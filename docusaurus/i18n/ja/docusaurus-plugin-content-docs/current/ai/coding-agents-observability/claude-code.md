---
sidebar_position: 2
title: Claude Code
---
# CloudWatch と OpenTelemetry を使用した Claude Code の使用状況の分析

:::note
このガイドのテレメトリ環境変数とメトリクス名は、公式の[Claude Code モニタリングドキュメント](https://docs.claude.com/en/docs/claude-code/monitoring-usage)に従っています。Claude Code のテレメトリは急速に進化しています。インストールされているバージョンに対してメトリクス名を確認してください（[メトリクスが流れていることを確認する](#メトリクスが流れていることを確認する)を参照）。
:::

## Bearer トークン認証

Bearer トークン（CloudWatch メトリクス API キー）を使用すると、AWS の外部で実行されているツール（開発者のラップトップ上の Claude Code など）が、AWS SDK や IAM 認証情報チェーンを必要とせずに CloudWatch にメトリクスを送信できます。各トークンは、[CloudWatchAPIKeyAccess](https://docs.aws.amazon.com/aws-managed-policy/latest/reference/CloudWatchAPIKeyAccess.html) マネージドポリシーのみにスコープされた AWS IAM ユーザーに紐付けられています。

:::warning
Bearer トークンは長期的な認証情報です。このレシピで Bearer トークンを使用しているのは、AI コーディングエージェントが AWS の外部にある開発者のラップトップ上で動作しており、短期的な認証情報を使用した SigV4 では中央コレクターまたはマシンごとのコレクタープロセスが必要になるためです。短期的な認証情報を使用した SigV4 が実現可能な AWS 内で動作するワークロードの場合は、より強固なセキュリティ体制のためにそのアプローチを優先してください。CloudWatch OTLP エンドポイントは HTTPS を必要とし、プレーン HTTP によるリクエストは拒否されます。詳細については、[CloudWatch OTLP Metrics Bearer Token Auth](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-OTLP-MetricsBearerTokenAuth.html) を参照してください。
:::

## ソリューションの概要

セットアップには 3 つのコンポーネントがあります。

1. **CloudWatch メトリクス API キー** — 範囲を絞った IAM ユーザーに紐付けられたベアラートークンです。開発者ごとに 1 回作成するか、チームで共有します。
2. **Claude Code の設定** — Claude Code の OpenTelemetry SDK にテレメトリの有効化、メトリクスの送信先、および属性付けの方法を指示するいくつかの環境変数です。
3. **事前構築済みダッシュボード** — トークン使用量、コスト、開発者の生産性、およびチームレベルの使用状況を PromQL クエリで可視化する CloudWatch ダッシュボード（および Grafana 相当のもの）です。

## 前提条件

* CloudWatch および IAM リソースを作成する権限を持つ AWS アカウント。
* AWS CLI v2 がインストールおよび設定済みであること。
* Claude Code がインストールされており、モデルにアクセスできること。Claude Code をモデルに認証する方法は、プロバイダーによって異なり、このレシピの CloudWatch メトリクスの設定とは**独立**しています。
    * **Anthropic API**（デフォルト）— `claude`（インタラクティブログイン）で認証するか、`ANTHROPIC_API_KEY` を設定します。
    * **Amazon Bedrock** — `export CLAUDE_CODE_USE_BEDROCK=1` を設定し、AWS 認証情報で認証します（例: `export AWS_PROFILE=... AWS_REGION=...`、または AWS 認証情報チェーン内の任意のプロバイダー）。このレシピのベアラートークンは、Claude Code を Bedrock ではなく **CloudWatch** に対して認証します。
* CloudWatch メトリクス API キー（以下で作成）。

:::tip
エンタープライズ向けのロールアウト — 企業 SSO および IdP フェデレーション（Okta、Azure AD、Auth0、Amazon Cognito、AWS IAM Identity Center）、長期間有効な API キーを不要にする OIDC クレデンシャルフェデレーション、JWT クレームによるユーザーごとの帰属（部門、チーム、コストセンター）、クォータ/コスト管理 — については、[Guidance for Claude Code with Amazon Bedrock](https://github.com/aws-solutions-library-samples/guidance-for-claude-code-with-amazon-bedrock) リポジトリを参照してください。このリポジトリは、Claude Code CLI と Claude Code Desktop の両方に対して、デプロイ可能な認証パターン（外部 IdP OIDC、IAM Identity Center）を提供しています。このガイダンスは**開発者が大規模に Bedrock へ認証する方法**を扱っており、本レシピの CloudWatch メトリクスのセットアップはそれとは独立しており、その上に重ねて機能します。
:::

## ベアラートークンを作成する

CloudWatch コンソール (**Settings** > **API keys** までスクロール > **Create**) または CLI を使用してトークンを作成できます。

```bash
# Create an IAM user for CloudWatch metrics ingestion
aws iam create-user --user-name claude-code-cloudwatch-metrics-user

# Attach the CloudWatchAPIKeyAccess managed policy
aws iam attach-user-policy \
    --user-name claude-code-cloudwatch-metrics-user \
    --policy-arn arn:aws:iam::aws:policy/CloudWatchAPIKeyAccess

# Create a service-specific credential (the bearer token), expiring in 90 days
aws iam create-service-specific-credential \
    --user-name claude-code-cloudwatch-metrics-user \
    --service-name cloudwatch.amazonaws.com \
    --credential-age-days 90
```

レスポンスには `ServiceCredentialSecret` フィールド — これはベアラートークンの値です。[AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html) またはお客様の組織のボールトに安全に保存してください。バージョン管理にコミットしないでください。

## Claude Code を設定する

Claude Code は、標準の OpenTelemetry 環境変数からテレメトリ設定を読み取ります。`claude` を起動するシェル（またはフリートのプロファイル管理）でそれらを設定します。これにより、**メトリクス**がベアラー認証済みの HTTPS 接続を介して CloudWatch OTLP エンドポイントにルーティングされます。

```bash
# Pull the bearer token from your vault rather than hard-coding it
BEARER_TOKEN=$(aws secretsmanager get-secret-value \
  --secret-id cloudwatch-otlp-bearer-token \
  --query SecretString --output text)

export CLAUDE_CODE_ENABLE_TELEMETRY=1
export OTEL_METRICS_EXPORTER=otlp
export OTEL_EXPORTER_OTLP_PROTOCOL=http/json
export OTEL_EXPORTER_OTLP_ENDPOINT="https://monitoring.<AWS_REGION>.amazonaws.com"
export OTEL_EXPORTER_OTLP_HEADERS="Authorization=Bearer ${BEARER_TOKEN}"
export OTEL_METRIC_EXPORT_INTERVAL=2000
```

`<AWS_REGION>` をターゲットリージョン（例: `us-east-1`）に置き換えてください。OpenTelemetry SDK はベースエンドポイントに `/v1/metrics` パスを自動的に追加します。`http/json` と `http/protobuf` はどちらも CloudWatch で受け入れられます。

:::note
`OTEL_METRIC_EXPORT_INTERVAL=2000` (2 秒) は、セットアップを確認する際にメトリクスをすばやく表示するための設定です。Claude Code のデフォルトは 60000 ms (60 秒) です。安定稼働中のフリートで使用する場合は、リクエスト量を削減するために、インターバルをデフォルトに近い値に戻してください。
:::

:::tip
フリート全体へのロールアウトでは、各開発者のシェルプロファイルの代わりに、[管理された Claude Code の `settings.json`](https://docs.claude.com/en/docs/claude-code/settings) の `env` ブロックにこれらの同じ変数を設定できます。
:::

### アイデンティティとチームの帰属を追加する

Claude Code は標準の `OTEL_RESOURCE_ATTRIBUTES` 環境変数を読み取り、その値をすべてのメトリクスの**リソース属性**として付加します。これにより、開発者ごと、チームごとの内訳を取得できます。開発者のシェルプロファイル（またはフリートのプロファイル管理ツール経由）で設定します。

```bash
export OTEL_RESOURCE_ATTRIBUTES="user.id=$(whoami),user.email=${USER_EMAIL},team.id=${TEAM:-engineering},cost_center=${COST_CENTER:-default},department=${DEPARTMENT:-engineering},environment=${ENV:-dev}"
```

:::note
これらのディメンションは **resource** 属性として届くため、PromQL では `@resource.` プレフィックス付きで参照されます（例: `@resource.team.id`）。プリビルドダッシュボードはすでにこのプレフィックスを使用しています。Claude Code のサービス名は CLI によって固定されています（`@resource.service.name` は `claude-code`）。ダッシュボードは、その一意の `claude_code.*` プレフィックスによって Claude Code のメトリクスを識別します。
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

短い Claude Code セッションを実行して、1 ターン分のメトリクスを出力させます。

```bash
claude -p "Let's conquer the world" --max-turns 1
```

次に [CloudWatch Query Studio](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-PromQL-QueryStudio.html) を開き、`claude_` と入力して利用可能なメトリクスを確認するか、次のようなインスタントクエリを実行します。

```
sum({"claude_code.token.usage"})
```

メトリクスが表示される場合、設定は正しいです。表示されない場合は、エンドポイント URL を確認し、`Authorization` ヘッダーにリテラルトークン値が含まれていること、`CLAUDE_CODE_ENABLE_TELEMETRY=1` が `claude` を起動したシェルで設定されていること、また少なくとも 1 つのセッションが完了していることを確認してください。CloudWatch への取り込みがクエリ可能になるまで、数分かかる場合があります。

### Claude Code が出力するメトリクス

Claude Code は、以下の使用状況に関連するメトリクスを出力します（メトリクス名は公式モニタリングドキュメントに従っています）。

| Metric | Type | Description |
| --- | --- | --- |
| `claude_code.token.usage` | Counter | Tokens consumed; attribute `type` ∈ `input`, `output`, `cacheRead`, `cacheCreation`, plus `model` |
| `claude_code.cost.usage` | Counter | Estimated cost in USD; attribute `model` |
| `claude_code.session.count` | Counter | CLI sessions started |
| `claude_code.lines_of_code.count` | Counter | Lines of code modified; attribute `type` ∈ `added`, `removed` |
| `claude_code.commit.count` | Counter | Git commits created by Claude Code |
| `claude_code.pull_request.count` | Counter | Pull requests created by Claude Code |
| `claude_code.code_edit_tool.decision` | Counter | Edit-tool permission decisions; attributes `tool`, `decision` ∈ `accept`, `reject` |
| `claude_code.active_time.total` | Counter | Total active developer time in seconds |

:::note
OpenAI Codex や GitHub Copilot とは異なり、**Claude Code はコストメトリクスを出力します** (`claude_code.cost.usage`)、そのためダッシュボードはトークン数にモデルの価格を後から掛け合わせることなく、推定コストを直接グラフ化できます。
:::

:::tip
Claude Code は、**イベント**（ユーザープロンプト、ツール結果、API リクエストとエラー）を OpenTelemetry ログとしてエクスポートすることもできます。それらをキャプチャするには、追加で `export OTEL_LOGS_EXPORTER=otlp` を設定し、ログを対応する CloudWatch logs エンドポイントにルーティングします。このガイドとそのダッシュボードはメトリクスに焦点を当てています。完全なイベントリファレンスについては、[Claude Code モニタリングドキュメント](https://docs.claude.com/en/docs/claude-code/monitoring-usage)を参照してください。
:::

## 使用状況サンプルダッシュボード

このレシピには、同等の事前構築済みダッシュボードが 2 つ付属しています。リソース属性が上記の規則に従っている限り、値は自動的に入力されます。

### CloudWatch ダッシュボード

[claude-code-cloudwatch-dashboard.json](https://raw.githubusercontent.com/aws-observability/aws-observability-accelerator/main/artifacts/cloudwatch-dashboards/claude-code/claude-code.json) をダウンロードしてデプロイします。

```bash
curl -o claude-code-cloudwatch-dashboard.json \
  https://raw.githubusercontent.com/aws-observability/aws-observability-accelerator/main/artifacts/cloudwatch-dashboards/claude-code/claude-code.json

aws cloudwatch put-dashboard \
  --dashboard-name ClaudeCodeDashboard \
  --dashboard-body file://claude-code-cloudwatch-dashboard.json \
  --region <AWS_REGION>

# Verify
aws cloudwatch list-dashboards --dashboard-name-prefix ClaudeCode --region <AWS_REGION>
```

ダッシュボードは 5 つのセクションで構成されています。

* **概要** — トークン合計数、アクティブユーザー数、セッション数、キャッシュヒット率。
* **トークン使用状況** — 時系列での消費量、種類別の内訳（入力 / 出力 / キャッシュ読み取り / キャッシュ作成）、モデル別、上位ユーザー、および推定コスト。
* **開発者の生産性** — 追加 / 削除された行数、コミット数、アクティブ時間、プルリクエスト数、編集の承認 / 拒否率。
* **組織別内訳** — 部門およびチーム別のトークン数とコスト、さらにチャージバック用のコストセンターおよび環境別の使用状況。
* **Amazon Bedrock API の健全性** — モデル別のスロットルイベントおよびクライアント / サーバーエラー（Amazon Bedrock 上で Claude Code を実行している場合。ネイティブの `AWS/Bedrock` CloudWatch メトリクスから取得）。

### Grafana ダッシュボード

組織が Amazon Managed Grafana（またはセルフマネージド Grafana）を使用している場合は、[claude-code-grafana-dashboard.json](https://raw.githubusercontent.com/aws-observability/aws-observability-accelerator/main/artifacts/grafana-dashboards/claude-code/claude-code.json) をインポートしてください。これは、[CloudWatch PromQL エンドポイントを指す Amazon Managed Service for Prometheus データソース](https://docs.aws.amazon.com/grafana/latest/userguide/cloudwatch-promql.html)に対して同じ PromQL を使用します（SigV4 の **Service** を `monitoring` に設定）。インポート時にダッシュボードの `datasource` 変数としてそのデータソースを選択してください。

## アラート

すべてのパネルは PromQL クエリによって支えられているため、**View in Query Studio** > **Create alarm** から任意のパネルでアラームを作成できます。いくつかの例を示します。

**個別の支出急増** — 開発者の直近 1 時間の支出が 24 時間の時間平均の 2 倍を超えた場合にアラートを発します。

```
sum by ("@resource.user.email") (increase({"claude_code.cost.usage"}[1h]))
> 2 * avg_over_time(sum by ("@resource.user.email") (increase({"claude_code.cost.usage"}[1h]))[24h:1h])
```

**チームの予算しきい値** — チームの 1 日のコストが予算 (USD) を超えた場合にアラートを送信します。

```
sum by ("@resource.team.id") (increase({"claude_code.cost.usage"}[24h])) > 500
```

**採用率の低下** — チームの日次セッションが 7 日間平均の半分を下回った場合に検出します。

```
sum by ("@resource.team.id") (increase({"claude_code.session.count"}[24h]))
< 0.5 * avg_over_time(sum by ("@resource.team.id") (increase({"claude_code.session.count"}[1h]))[7d:1d])
```

## コスト見積もり

CloudWatch OTLP メトリクスの取り込みは $0.50/GB で請求されます。200 人の開発者組織（1 日あたり約 20 セッション、セッションあたり約 7 メトリクス、データポイントあたり約 450 バイト、月あたり約 22 稼働日）の計算例として：

```
200 developers × 20 sessions/day × 7 metrics × 450 bytes ≈ 12.6 MB/day
12.6 MB/day × 22 days ≈ 277 MB/month ≈ 0.27 GB/month
```

$0.50/GB の場合、基本ケースでは約 **$0.14/月** となり、その 100 倍のボリュームでも $15/月 未満に収まります。Console での PromQL クエリは無料です。最新の料金については、[Amazon CloudWatch 料金ページ](https://aws.amazon.com/cloudwatch/pricing/)をご覧ください。

## クリーンアップ

:::warning
CloudWatch のメトリクスデータは、テレメトリを停止した後も保持され（最大 15 か月の保持期間）、追加料金はかかりません。CloudWatch アラームは、作成した場合、削除されるまで $0.10/アラーム/月の料金が発生します。IAM ユーザーとベアラートークンをアクティブのままにしておくことは、セキュリティリスクをもたらします。
:::

```bash
# Delete the dashboard
aws cloudwatch delete-dashboards --dashboard-names ClaudeCodeDashboard --region <AWS_REGION>

# Delete the service-specific credential, detach the policy, delete the user
aws iam delete-service-specific-credential --user-name claude-code-cloudwatch-metrics-user --service-specific-credential-id <credential-id>
aws iam detach-user-policy --user-name claude-code-cloudwatch-metrics-user --policy-arn arn:aws:iam::aws:policy/CloudWatchAPIKeyAccess
aws iam delete-user --user-name claude-code-cloudwatch-metrics-user
```

テレメトリのエクスポートを停止するには、テレメトリ変数の設定を解除します。

```bash
unset CLAUDE_CODE_ENABLE_TELEMETRY OTEL_METRICS_EXPORTER OTEL_EXPORTER_OTLP_PROTOCOL \
  OTEL_EXPORTER_OTLP_ENDPOINT OTEL_EXPORTER_OTLP_HEADERS OTEL_RESOURCE_ATTRIBUTES \
  OTEL_METRIC_EXPORT_INTERVAL
```

## リソース

* [CloudWatch と OpenTelemetry を使用した Claude Code の使用状況の分析 (AWS ブログ)](https://aws.amazon.com/blogs/mt/analyzing-claude-code-usage-with-cloudwatch-and-opentelemetry/)
* [Amazon Bedrock を使用した Claude Code のガイダンス (エンタープライズ SSO、IdP フェデレーション、および Bedrock アクセスパターン)](https://github.com/aws-solutions-library-samples/guidance-for-claude-code-with-amazon-bedrock)
* [Claude Code: 使用状況のモニタリング](https://docs.claude.com/en/docs/claude-code/monitoring-usage)
* [CloudWatch OTLP Metrics Bearer Token Auth](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-OTLP-MetricsBearerTokenAuth.html)
* [PromQL を使用した Amazon CloudWatch メトリクスのクエリ (Amazon Managed Grafana)](https://docs.aws.amazon.com/grafana/latest/userguide/cloudwatch-promql.html)
* [OpenTelemetry GenAI セマンティック規約](https://opentelemetry.io/docs/specs/semconv/gen-ai/)
