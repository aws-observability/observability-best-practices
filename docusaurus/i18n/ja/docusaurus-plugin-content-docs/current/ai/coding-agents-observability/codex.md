---
sidebar_position: 4
title: OpenAI Codex
---
# CloudWatch と OpenTelemetry を使用した OpenAI Codex の使用状況の分析

:::note
このガイドは、1 人の開発者が約 15 分で完了できます。ここで説明するすべての内容は **Codex CLI 0.139.0** に対して検証済みです。Codex のテレメトリは急速に進化しており、メトリクス名や設定キーは他のバージョンでは異なる場合があります。インストール済みのバージョンで確認してください（[メトリクスのフローを確認する](#メトリクスが流れていることを確認する)を参照）。
:::

## Bearer トークン認証

ベアラートークン（CloudWatch メトリクス API キー）を使用すると、AWS 外部で実行されているツール（開発者のラップトップ上の Codex など）が、AWS SDK や IAM 認証情報チェーンを必要とせずに CloudWatch にメトリクスを送信できます。各トークンは、[CloudWatchAPIKeyAccess](https://docs.aws.amazon.com/aws-managed-policy/latest/reference/CloudWatchAPIKeyAccess.html) マネージドポリシーのみにスコープされた AWS IAM ユーザーに紐付けられています。

:::warning
Bearer トークンは長期的な認証情報です。このレシピで Bearer トークンを使用しているのは、AI コーディングエージェントが AWS の外部にある開発者のラップトップ上で動作しており、短期的な認証情報を使用した SigV4 では中央コレクターまたはマシンごとのコレクタープロセスが必要になるためです。短期的な認証情報を使用した SigV4 が実現可能な AWS 内で動作するワークロードの場合は、より強固なセキュリティ体制のためにそのアプローチを優先してください。CloudWatch OTLP エンドポイントは HTTPS を必要とし、プレーン HTTP によるリクエストは拒否されます。詳細については、[CloudWatch OTLP Metrics Bearer Token Auth](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-OTLP-MetricsBearerTokenAuth.html) を参照してください。
:::

## ソリューションの概要

セットアップには 3 つのコンポーネントがあります。

1. **CloudWatch メトリクス API キー** — 範囲を絞った IAM ユーザーに紐付けられたベアラートークンです。開発者ごとに 1 回作成します（またはチームで共有します）。
2. **Codex 設定** — `~/.codex/config.toml` および、Codex の OpenTelemetry SDK にメトリクスの送信先と属性付けの方法を伝えるいくつかの環境変数。
3. **事前構築済みダッシュボード** — トークン使用量、API およびツールのアクティビティ、PromQL クエリを使用したチームレベルの使用状況を可視化する CloudWatch ダッシュボード（および同等の Grafana ダッシュボード）。

## 前提条件

* CloudWatch および IAM リソースを作成する権限を持つ AWS アカウント。
* AWS CLI v2 がインストールおよび設定済みであること。
* Codex CLI がインストールされており、モデルにアクセスできること。Codex をモデルに認証する方法はモデルプロバイダーによって異なり、このレシピの CloudWatch メトリクスの設定とは**独立**しています。
    * **OpenAI**（デフォルトプロバイダー）— `codex login` を実行します。
    * **Amazon Bedrock** — `codex login` は使用**しないでください**。AWS 認証情報で認証するか（例: `export AWS_PROFILE=... AWS_REGION=...`、または AWS 認証情報チェーン内の任意のプロバイダー）、`AWS_BEARER_TOKEN_BEDROCK` 経由で Bedrock ベアラートークンを使用し、`~/.codex/config.toml` に `model_provider = "amazon-bedrock"` と `[model_providers.amazon-bedrock.aws] region = "<region>"` を設定します。
* CloudWatch メトリクス API キー（以下で作成）。

:::tip
エンタープライズ展開向け — 企業 SSO（Okta、Azure AD、Auth0、AWS IAM Identity Center）、IdP フェデレーション、Amazon Bedrock への集中アクセス、および `aws sso login` によるユーザーごとの帰属管理 — については、[Guidance for OpenAI Codex on AWS](https://github.com/openai-on-aws/guidance-codex) リポジトリを参照してください。このリポジトリでは、CloudFormation テンプレート、オプションのクォータ適用、およびオブザーバビリティを備えた、本番環境対応のデプロイパターン（Native AWS Access、AgentCore Gateway、LLM Gateway）を提供しています。このガイダンスは**開発者がスケールでモデルに認証する方法**を扱っており、このレシピの CloudWatch メトリクスのセットアップはそれとは独立しており、その上に重ねて機能します。
:::

## ベアラートークンを作成する

CloudWatch コンソール (**Settings** > **API keys** までスクロール > **Create**) または CLI を使用してトークンを作成できます。

```bash
# Create an IAM user for CloudWatch metrics ingestion
aws iam create-user --user-name codex-cloudwatch-metrics-user

# Attach the CloudWatchAPIKeyAccess managed policy
aws iam attach-user-policy \
    --user-name codex-cloudwatch-metrics-user \
    --policy-arn arn:aws:iam::aws:policy/CloudWatchAPIKeyAccess

# Create a service-specific credential (the bearer token), expiring in 90 days
aws iam create-service-specific-credential \
    --user-name codex-cloudwatch-metrics-user \
    --service-name cloudwatch.amazonaws.com \
    --credential-age-days 90
```

レスポンスには `ServiceCredentialSecret` フィールド — これはベアラートークンの値です。[AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html) またはお客様の組織のボールトに安全に保存してください。バージョン管理にコミットしないでください。

## Codex を設定する

Codex は `~/.codex/config.toml` で設定します。`[otel]` セクションを追加して、**メトリクス**（のみ）をベアラー認証済み HTTPS 接続経由で CloudWatch OTLP エンドポイントにルーティングします。ログとトレースはデフォルトのまま（`none`）にしておきます。

以下の `[otel]` ブロックは、モデルプロバイダーの認証とは独立しています（[前提条件](#前提条件)を参照）。Amazon Bedrock を使用する場合、この `[otel]` セクションは既存の `model_provider` / `[model_providers.amazon-bedrock.aws]` 設定と同じファイル内に並んで配置します。`[otel]` ヘッダーのベアラートークンは Codex を **CloudWatch** に対して認証するものであり、モデルに対して認証するものではありません。

```toml
[otel]

[otel.metrics_exporter.otlp-http]
endpoint = "https://monitoring.<AWS_REGION>.amazonaws.com/v1/metrics"
protocol = "binary"  # OTLP/protobuf; "json" also works — both are accepted by CloudWatch

[otel.metrics_exporter.otlp-http.headers]
"Authorization" = "Bearer <YOUR_BEARER_TOKEN>"
```

:::note
`environment` ディメンションは `OTEL_RESOURCE_ATTRIBUTES`（次のセクション）を通じて設定してください。`@resource.environment` として表示されます。`[otel] environment = "..."` config key は使わないでください — これは*異なる*ラベル（`@resource.env`）の下に表示され、ダッシュボードでは使用されません。
:::

`<AWS_REGION>` をターゲットリージョン（例: `us-east-1`）に、`<YOUR_BEARER_TOKEN>` を `ServiceCredentialSecret` の値に置き換えてください。

:::warning
**リテラルトークン値**をヘッダーに貼り付けてください。Codex 0.139.0 はヘッダー値内の環境変数参照（例: `Bearer ${MY_TOKEN}`）を展開しません — テキストをそのまま送信するため、CloudWatch は HTTP 403 で拒否します。トークンがファイル内に存在するため、パーミッションを制限してください: `chmod 600 ~/.codex/config.toml`。`protocol = "binary"`（OTLP/protobuf）と `protocol = "json"` はどちらも CloudWatch で受け入れられます。
:::

### アイデンティティとチームの帰属を追加する

Codex は標準の `OTEL_RESOURCE_ATTRIBUTES` 環境変数を読み取り、その値をすべてのメトリクスの**リソース属性**として付加します。これにより、開発者ごと、チームごとの内訳を取得できます。開発者のシェルプロファイル（またはフリートのプロファイル管理ツール経由）で設定します。

```bash
export OTEL_RESOURCE_ATTRIBUTES="user.id=$(whoami),user.email=${USER_EMAIL},team.id=${TEAM:-engineering},cost_center=${COST_CENTER:-default},department=${DEPARTMENT:-engineering},environment=${ENV:-dev}"
```

:::note
これらのディメンションは **resource** 属性として届くため、PromQL では `@resource.` プレフィックス付きで参照されます（例: `@resource.team.id`）。プレビルドのダッシュボードはすでにこのプレフィックスを使用しています。Codex サービス名は CLI によって固定されており（インタラクティブ TUI の場合は `codex`、非インタラクティブ実行の場合は `codex_exec`）、オーバーライドできません。そのため、ダッシュボードは正規表現 `@resource.service.name=~"codex.*"` でマッチさせています。
:::

グループ化とフィルタリングに使用できる属性:

<!-- attribution attributes -->
| Attribute | PromQL label | Purpose | Example |
| --- | --- | --- | --- |
| `user.id` | `@resource.user.id` | Per-developer attribution | `jdoe` |
| `user.email` | `@resource.user.email` | Per-developer attribution | `jdoe@example.com` |
| `team.id` | `@resource.team.id` | Team-level aggregation | `platform-eng` |
| `cost_center` | `@resource.cost_center` | Finance/chargeback grouping | `CC-4200` |
| `department` | `@resource.department` | Org-level rollup | `engineering` |
| `environment` | `@resource.environment` | Distinguish dev/staging/prod usage | `production` |

## メトリクスが流れていることを確認する

短い Codex セッションを実行して、1 ターン分のメトリクスを出力します。

```bash
codex exec "print hello world in python"
```

次に [CloudWatch Query Studio](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-PromQL-QueryStudio.html) を開き、`codex` と入力して利用可能なメトリクスを確認するか、次のようなインスタントクエリを実行します。

```
sum({"codex.turn.token_usage", "@resource.service.name"=~"codex.*"})
```

メトリクスが表示される場合、設定は正しいです。表示されない場合は、エンドポイント URL を確認し、`Authorization` ヘッダーにリテラルトークン値が含まれていること（上記の警告を参照）、また少なくとも 1 つの Codex ターンが完了していることを確認してください。CloudWatch へのインジェストがクエリ可能になるまで数分かかる場合があります。

### Metrics Codex が出力するメトリクス

Codex 0.139.0 は、以下の使用状況に関連するメトリクスを出力します（すべてカウンター/ヒストグラム。メトリクス名は CLI に対して検証済み）。

| Metric | Type | Description |
| --- | --- | --- |
| `codex.turn.token_usage` | Histogram | Token usage; attribute `token_type` ∈ `input`, `output`, `cached_input`, `reasoning_output`, plus `model` |
| `codex.api_request` | Counter | Model API request count (attributes include `model`, `success`, `status`) |
| `codex.api_request.duration_ms` | Histogram | API request latency |
| `codex.tool.call` | Counter | Tool invocation count (attributes `tool`, `success`) |
| `codex.tool.call.duration_ms` | Histogram | Tool execution latency |
| `codex.approval.requested` | Counter | Approval prompts and their `decision` |
| `codex.conversation.turn.count` | Counter | Conversation turns (attribute `model`) |
| `codex.turn.e2e_duration_ms` | Histogram | End-to-end turn latency |
| `codex.thread.started` | Counter | Threads/sessions started |

:::note
Amazon Bedrock 上の Claude Code とは異なり、**Codex はコストメトリクスを出力しません**。ダッシュボードはモデル別のトークン消費量をレポートします。コストの数値が必要な場合は、トークン数にモデルの料金を乗じて算出してください。メトリクスとイベントの完全なリストは、[Codex オブザーバビリティドキュメント](https://developers.openai.com/codex/config-advanced)に記載されています。
:::

## 使用状況サンプルダッシュボード

このレシピには、2 つの同等のビルド済みダッシュボードが含まれています。リソース属性が上記の規則に従っている限り、値は自動的に入力されます。

### CloudWatch ダッシュボード

[codex-cloudwatch-dashboard.json](https://raw.githubusercontent.com/aws-observability/aws-observability-accelerator/main/artifacts/cloudwatch-dashboards/codex/codex.json) をダウンロードしてデプロイします。

```bash
aws cloudwatch put-dashboard \
  --dashboard-name CodexDashboard \
  --dashboard-body file://codex-cloudwatch-dashboard.json \
  --region <AWS_REGION>

# Verify
aws cloudwatch list-dashboards --dashboard-name-prefix Codex --region <AWS_REGION>
```

ダッシュボードは 5 つのセクションで構成されています。

* **概要** — 総トークン数、API リクエスト数、アクティブユーザー数、会話ターン数。
* **トークン使用量** — 時系列での総トークン数、種類別の内訳（入力 / 出力 / キャッシュ済み入力 / 推論出力）、モデル別、およびトップユーザー。
* **API とツールアクティビティ** — 結果別およびモデル別の API リクエスト数、会話ターン数、ツール別のツール呼び出し数、ツール呼び出しの結果、および承認の決定。
* **パフォーマンスとレイテンシー** — キャッシュヒット率、ターンレイテンシーおよびタイム・トゥ・ファースト・トークン（p50/p90/p99）、モデル別の API リクエストレイテンシー p90、およびツール呼び出しレイテンシー。レイテンシーパネルは、集計セレクターに対して CloudWatch のネイティブヒストグラム関数を使用しています — `histogram_quantile(0.9, sum({"codex.turn.e2e_duration_ms"}))` — CloudWatch の OTLP ヒストグラムはクラシック Prometheus の `le` バケットを公開しないためです。（セレクターを `sum(...)` で囲むと、ユーザー/ツールごとではなく、すべてのシリーズにわたって分位数が計算されます。）
* **組織別内訳** — 部門およびチーム別のトークンと API リクエスト、さらにコストセンターおよび環境別のトークン使用量。

### Grafana ダッシュボード

組織が Amazon Managed Grafana（またはセルフマネージド Grafana）を使用している場合は、[codex-grafana-dashboard.json](https://raw.githubusercontent.com/aws-observability/aws-observability-accelerator/main/artifacts/grafana-dashboards/codex/codex.json) をインポートしてください。これは、[CloudWatch PromQL エンドポイントを指す Amazon Managed Service for Prometheus データソース](https://docs.aws.amazon.com/grafana/latest/userguide/cloudwatch-promql.html)に対して同じ PromQL を使用します（SigV4 の **Service** を `monitoring` に設定）。インポート時にダッシュボードの `datasource` 変数としてそのデータソースを選択してください。

## アラート

すべてのパネルは PromQL クエリによって支えられているため、**View in Query Studio** > **Create alarm** から任意のパネルでアラームを作成できます。いくつかの例を示します。

**チームのトークン使用量しきい値** — チームの 1 日あたりのトークン使用量が予算を超えた場合にアラートを発します。

```
sum by ("@resource.team.id") (increase({"codex.turn.token_usage"}[24h])) > 5000000
```

**API エラーレートの上昇** — 失敗したリクエストが増加した場合にアラートを発します。

```
sum(increase({"codex.api_request", success="false"}[1h])) > 50
```

**レイテンシーの回帰** — p90 のターンレイテンシーがしきい値（例：30 秒）を超えた場合にアラートを発します。

```
histogram_quantile(0.9, sum({"codex.turn.e2e_duration_ms"})) > 30000
```

**採用率の低下** — チームの日次スレッド数が 7 日間平均の半分を下回った場合に検出します。

```
sum by ("@resource.team.id") (increase({"codex.thread.started"}[24h]))
< 0.5 * avg_over_time(sum by ("@resource.team.id") (increase({"codex.thread.started"}[1h]))[7d:1d])
```

## コスト見積もり

CloudWatch OTLP メトリクスの取り込みは $0.50/GB で請求されます。単一の OTLP メトリクスデータポイントは、ネットワーク上で平均約 300 バイトです。1 日あたり約 20 セッションを実行する 200 人の開発者組織の場合、メトリクスのボリュームは月あたり数十 MB のオーダーとなり、取り込みコストは $5/月 を大幅に下回ります。Console での PromQL クエリは無料です。最新の料金については、[Amazon CloudWatch の料金ページ](https://aws.amazon.com/cloudwatch/pricing/)をご覧ください。

## クリーンアップ

:::warning
CloudWatch のメトリクスデータは、テレメトリを停止した後も保持され（最大 15 か月の保持期間）、追加料金はかかりません。CloudWatch アラームは、作成した場合、削除されるまで $0.10/アラーム/月の料金が発生します。IAM ユーザーとベアラートークンをアクティブのままにしておくことは、セキュリティリスクをもたらします。
:::

```bash
# Delete the dashboard
aws cloudwatch delete-dashboards --dashboard-names CodexDashboard --region <AWS_REGION>

# Delete the service-specific credential, detach the policy, delete the user
aws iam delete-service-specific-credential --user-name codex-cloudwatch-metrics-user --service-specific-credential-id <credential-id>
aws iam detach-user-policy --user-name codex-cloudwatch-metrics-user --policy-arn arn:aws:iam::aws:policy/CloudWatchAPIKeyAccess
aws iam delete-user --user-name codex-cloudwatch-metrics-user
```

テレメトリのエクスポートを停止するには、`~/.codex/config.toml` から `[otel]` セクションを削除し、`OTEL_RESOURCE_ATTRIBUTES` の設定を解除してください。

## リソース

* [AWS 上の OpenAI Codex のガイダンス（エンタープライズ SSO、IdP フェデレーション、および Bedrock アクセスパターン）](https://github.com/openai-on-aws/guidance-codex)
* [OpenAI Codex: オブザーバビリティとテレメトリ](https://developers.openai.com/codex/config-advanced)
* [CloudWatch OTLP メトリクス Bearer トークン認証](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-OTLP-MetricsBearerTokenAuth.html)
* [PromQL を使用した Amazon CloudWatch メトリクスのクエリ（Amazon Managed Grafana）](https://docs.aws.amazon.com/grafana/latest/userguide/cloudwatch-promql.html)
* [OpenTelemetry GenAI セマンティック規約](https://opentelemetry.io/docs/specs/semconv/gen-ai/)
