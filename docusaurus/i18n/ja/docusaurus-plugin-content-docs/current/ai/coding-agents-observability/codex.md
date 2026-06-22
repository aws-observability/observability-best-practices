---
sidebar_position: 3
title: OpenAI Codex
---
# CloudWatch と OpenTelemetry を使用した OpenAI Codex の使用状況の分析

:::note
このガイドは、1 人の開発者が約 15 分で完了できます。ここで説明するすべての内容は **Codex CLI 0.139.0** に対して検証済みです。Codex のテレメトリは急速に進化しており、メトリクス名や設定キーは他のバージョンでは異なる場合があります。インストール済みのバージョンで確認してください（[メトリクスのフローを確認する](#メトリクスが流れていることを確認する)を参照）。
:::

## Bearer トークン認証

ベアラートークン（CloudWatch メトリクス API キー）を使用すると、AWS の外部で実行されているツール（開発者のラップトップ上の Codex など）が、AWS SDK や IAM 認証情報チェーンを必要とせずに CloudWatch にメトリクスを送信できます。各トークンは、[CloudWatchAPIKeyAccess](https://docs.aws.amazon.com/aws-managed-policy/latest/reference/CloudWatchAPIKeyAccess.html) マネージドポリシーのみにスコープされた AWS IAM ユーザーに紐付けられています。

:::warning
Bearer トークンは長期的な認証情報です。このレシピで Bearer トークンを使用しているのは、AI コーディングエージェントが AWS の外部にある開発者のラップトップ上で動作しており、短期的な認証情報を使用した SigV4 では中央コレクターまたはマシンごとのコレクタープロセスが必要になるためです。短期的な認証情報を使用した SigV4 が実現可能な AWS 内で動作するワークロードでは、より強固なセキュリティ体制のためにそのアプローチを優先してください。CloudWatch OTLP エンドポイントは HTTPS を必要とします。プレーン HTTP によるリクエストは拒否されます。詳細については、[CloudWatch OTLP Metrics Bearer Token Auth](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-OTLP-MetricsBearerTokenAuth.html) を参照してください。
:::

## ソリューションの概要

セットアップには 3 つのコンポーネントがあります。

1. **CloudWatch メトリクス API キー** — 範囲を絞った IAM ユーザーに紐付けられたベアラートークンです。開発者ごとに 1 回作成します（またはチームで共有します）。
2. **Codex 設定** — `~/.codex/config.toml` および、メトリクスの送信先と属性付けの方法を Codex の OpenTelemetry SDK に伝えるいくつかの環境変数。
3. **事前構築済みダッシュボード** — トークン使用量、API およびツールのアクティビティ、PromQL クエリを使用したチームレベルの使用状況を可視化する CloudWatch ダッシュボード（および Grafana 相当のもの）。

## 前提条件

* CloudWatch および IAM リソースを作成する権限を持つ AWS アカウント。
* AWS CLI v2 がインストールおよび設定済みであること。
* Codex CLI がインストールされており、モデルにアクセスできること。Codex をモデルに認証する方法はモデルプロバイダーによって異なり、このレシピの CloudWatch メトリクスの設定とは**独立**しています。
    * **OpenAI**（デフォルトプロバイダー）— 実行 `codex login`.
    * **Amazon Bedrock** — 使用**しないでください** `codex login`. AWS 認証情報で認証します（例： `export AWS_PROFILE=... AWS_REGION=...`、または AWS 認証情報チェーン内の任意のプロバイダー）または Bedrock ベアラートークンを使用して `AWS_BEARER_TOKEN_BEDROCK`、設定します `model_provider = "amazon-bedrock"` を使用 `[model_providers.amazon-bedrock.aws] region = "<region>"` in `~/.codex/config.toml`.
* CloudWatch メトリクス API キー（以下で作成）。

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

Codex は以下を通じて設定されます `~/.codex/config.toml`。追加します `[otel]` **メトリクス**（のみ）をベアラー認証済み HTTPS 接続経由で CloudWatch OTLP エンドポイントにルーティングするセクションです。ログとトレースはデフォルトのまま (`none`).

The `[otel]` 以下のブロックは、モデルプロバイダーの認証とは独立しています（[前提条件](#前提条件)を参照）。Amazon Bedrock を使用する場合、これは `[otel]` 既存のセクションと並んで配置されます `model_provider` / `[model_providers.amazon-bedrock.aws]` 同じファイル内の設定。ベアラートークンは `[otel]` ヘッダーは Codex を **CloudWatch** に対して認証するものであり、モデルに対して認証するものではありません。

```toml
[otel]

[otel.metrics_exporter.otlp-http]
endpoint = "https://monitoring.<AWS_REGION>.amazonaws.com/v1/metrics"
protocol = "binary"  # OTLP/protobuf; "json" also works — both are accepted by CloudWatch

[otel.metrics_exporter.otlp-http.headers]
"Authorization" = "Bearer <YOUR_BEARER_TOKEN>"
```

:::note
設定します `environment` ディメンションを通じて `OTEL_RESOURCE_ATTRIBUTES` (次のセクション) に記載されており、次のように表示されます `@resource.environment`。避けてください `[otel] environment = "..."` config key — これは*異なる*ラベルの下に表示されます (`@resource.env`)、これはダッシュボードでは使用されません。
:::

置き換える `<AWS_REGION>` ターゲットリージョンに置き換えてください (例： `us-east-1`) および `<YOUR_BEARER_TOKEN>` を使用して `ServiceCredentialSecret` 値。

:::warning
**リテラルトークン値**をヘッダーに貼り付けてください。Codex 0.139.0 は環境変数の参照 (例： `Bearer ${MY_TOKEN}`) ヘッダー値内 — テキストをそのまま送信し、CloudWatch は HTTP 403 でリジェクトします。トークンがファイル内に存在するため、そのパーミッションを制限してください。 `chmod 600 ~/.codex/config.toml`。どちらも `protocol = "binary"` (OTLP/protobuf) および `protocol = "json"` CloudWatch に受け入れられます。
:::

### アイデンティティとチームの帰属を追加する

Codex は標準を読み取ります `OTEL_RESOURCE_ATTRIBUTES` 環境変数を設定し、その値をすべてのメトリクスの**リソース属性**として付加します。これにより、開発者ごと、チームごとの内訳を取得できます。開発者のシェルプロファイル（またはフリートのプロファイル管理ツール）で設定します。

```bash
export OTEL_RESOURCE_ATTRIBUTES="user.id=$(whoami),user.email=${USER_EMAIL},team.id=${TEAM:-engineering},cost_center=${COST_CENTER:-default},department=${DEPARTMENT:-engineering},environment=${ENV:-dev}"
```

:::note
これらのディメンションは **resource** 属性として届くため、PromQL では次のように参照されます。 `@resource.` プレフィックス（例えば） `@resource.team.id`. 事前構築済みのダッシュボードはすでにこのプレフィックスを使用しています。Codex サービス名は CLI によって固定されています (`codex` インタラクティブな TUI の場合、 `codex_exec` 非インタラクティブな実行の場合) オーバーライドできないため、ダッシュボードは正規表現でそれに一致させます `@resource.service.name=~"codex.*"`.
:::

グループ化とフィルタリングに使用できる属性は以下のとおりです。

<!-- attribution attributes -->
| 属性 | PromQL ラベル | 目的 | 例 |
| --- | --- | --- | --- |
| `user.id` | `@resource.user.id` | 開発者ごとの帰属 | `jdoe` |
| `user.email` | `@resource.user.email` | 開発者ごとの帰属 | `jdoe@example.com` |
| `team.id` | `@resource.team.id` | チームレベルの集計 | `platform-eng` |
| `cost_center` | `@resource.cost_center` | 財務/チャージバックのグループ化 | `CC-4200` |
| `department` | `@resource.department` | 組織レベルのロールアップ | `engineering` |
| `environment` | `@resource.environment` | dev/staging/prod 使用の区別 | `production` |

## メトリクスが流れていることを確認する

短い Codex セッションを実行して、1 ターン分のメトリクスを出力します。

```bash
codex exec "print hello world in python"
```

次に[CloudWatch Query Studio](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-PromQL-QueryStudio.html)を開いて入力します `codex` 利用可能なメトリクスを確認するか、次のようなインスタントクエリを実行します。

```
sum({"codex.turn.token_usage", "@resource.service.name"=~"codex.*"})
```

メトリクスが表示される場合、設定は正しいです。表示されない場合は、エンドポイント URL を確認してください。また、 `Authorization` ヘッダーにはリテラルトークン値が含まれており（上記の警告を参照）、少なくとも 1 つの Codex ターンが完了していることを確認してください。CloudWatch へのインジェストがクエリ可能になるまで数分かかる場合があります。

### Metrics Codex が出力するメトリクス

Codex 0.139.0 は、以下の使用状況に関連するメトリクスを出力します（すべてカウンター/ヒストグラム。メトリクス名は CLI に対して検証済み）。

| メトリクス | タイプ | 説明 |
| --- | --- | --- |
| `codex.turn.token_usage` | Histogram | トークン使用量。属性 `token_type` ∈ `input`, `output`, `cached_input`, `reasoning_output`、および `model` |
| `codex.api_request` | Counter | モデル API リクエスト数（属性には `model`, `success`, `status` が含まれます） |
| `codex.api_request.duration_ms` | Histogram | API リクエストのレイテンシー |
| `codex.tool.call` | Counter | ツール呼び出し数（属性 `tool`, `success`） |
| `codex.tool.call.duration_ms` | Histogram | ツール実行のレイテンシー |
| `codex.approval.requested` | Counter | 承認プロンプトとその `decision` |
| `codex.conversation.turn.count` | Counter | 会話ターン数（属性 `model`） |
| `codex.turn.e2e_duration_ms` | Histogram | エンドツーエンドのターンレイテンシー |
| `codex.thread.started` | Counter | 開始されたスレッド/セッション数 |

:::note
Amazon Bedrock 上の Claude Code とは異なり、**Codex はコストメトリクスを出力しません**。ダッシュボードはモデル別のトークン消費量をレポートします。コストの数値が必要な場合は、トークン数にモデルの料金を乗算してください。メトリクスとイベントの完全なリストは、[Codex オブザーバビリティドキュメント](https://developers.openai.com/codex/config-advanced)に記載されています。
:::

## 使用状況サンプルダッシュボード

このレシピには、2 つの同等の事前構築済みダッシュボードが含まれています。リソース属性が上記の規則に従っている限り、値は自動的に入力されます。

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

* **概要** — 合計トークン数、API リクエスト数、アクティブユーザー数、会話ターン数。
* **トークン使用量** — 時系列の合計トークン数、種類別の内訳（入力 / 出力 / キャッシュ済み入力 / 推論出力）、モデル別、上位ユーザー別。
* **API とツールアクティビティ** — 結果別およびモデル別の API リクエスト数、会話ターン数、ツール別のツール呼び出し数、ツール呼び出しの結果、および承認の決定。
* **パフォーマンスとレイテンシー** — キャッシュヒット率、ターンレイテンシーおよびタイム・トゥ・ファースト・トークン（p50/p90/p99）、モデル別 API リクエストレイテンシー p90、ツール呼び出しレイテンシー。レイテンシーパネルは、集約セレクターを使用した CloudWatch のネイティブヒストグラム関数を使用しています — `histogram_quantile(0.9, sum({"codex.turn.e2e_duration_ms"}))` — CloudWatch の OTLP ヒストグラムはクラシック Prometheus を公開しないため `le` バケット。(セレクターを `sum(...)` そのため、分位数はユーザー/ツールごとに 1 行ではなく、すべてのシリーズにわたって計算されます。)
* **組織別内訳** — 部門およびチーム別のトークンと API リクエスト、さらにコストセンターおよび環境別のトークン使用量。

### Grafana ダッシュボード

組織が Amazon Managed Grafana（またはセルフマネージド Grafana）を使用している場合は、[codex-grafana-dashboard.json](https://raw.githubusercontent.com/aws-observability/aws-observability-accelerator/main/artifacts/grafana-dashboards/codex/codex.json) をインポートしてください。これは、[CloudWatch PromQL エンドポイントを指す Amazon Managed Service for Prometheus データソース](https://docs.aws.amazon.com/grafana/latest/userguide/cloudwatch-promql.html)に対して同じ PromQL を使用します (SigV4 の **Service** を `monitoring`)。ダッシュボードのデータソースとして選択します。 `datasource` インポート時の変数。

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

CloudWatch OTLP メトリクスの取り込みは $0.50/GB で請求されます。単一の OTLP メトリクスデータポイントは、ネットワーク上で平均約 300 バイトです。1 日あたり約 20 セッションを実行する 200 人の開発者組織の場合、メトリクスのボリュームは月あたり数十 MB のオーダーとなり、取り込みコストは $5/月 を大幅に下回ります。Console での PromQL クエリは無料です。最新の料金については、[Amazon CloudWatch の料金ページ](https://aws.amazon.com/cloudwatch/pricing/)を参照してください。

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

テレメトリのエクスポートを停止するには、 `[otel]` セクションから `~/.codex/config.toml` および未設定 `OTEL_RESOURCE_ATTRIBUTES`.

## リソース

* [OpenAI Codex: オブザーバビリティとテレメトリ](https://developers.openai.com/codex/config-advanced)
* [CloudWatch OTLP メトリクス Bearer トークン認証](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-OTLP-MetricsBearerTokenAuth.html)
* [PromQL を使用して Amazon CloudWatch メトリクスをクエリする (Amazon Managed Grafana)](https://docs.aws.amazon.com/grafana/latest/userguide/cloudwatch-promql.html)
* [OpenTelemetry GenAI セマンティック規約](https://opentelemetry.io/docs/specs/semconv/gen-ai/)
