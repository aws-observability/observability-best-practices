---
sidebar_position: 2
title: GitHub Copilot
---
# CloudWatch と OpenTelemetry を使用した GitHub Copilot の使用状況の分析

:::note
OpenTelemetry を出力する Copilot 製品は **2 つ**あり、それぞれ*異なる*メトリクスを出力します。このレシピとそのダッシュボードは**両方**をカバーしています。

| | VS Code Copilot Chat 拡張機能 | GitHub Copilot CLI |
| --- | --- | --- |
| `service.name` | `copilot-chat` | `github-copilot` |
| ツールメトリクスのプレフィックス | `copilot_chat.tool.call.*` | `github.copilot.tool.call.*` |
| デフォルトの OTLP プロトコル | `http/protobuf` | `http/json` |
| メトリクスの範囲 | 約 20 メトリクス | 5 メトリクス（トークン、LLM 所要時間、ツール数/所要時間、エージェントターン） |

ダッシュボードは `@resource.service.name=~"copilot.*"` でいずれの製品にも一致し、2 つのツールメトリクス名を結合します。両方とも `gen_ai.client.token.usage` と `gen_ai.client.operation.duration` (OTel GenAI セマンティック規約) を共有します。VS Code 拡張機能のみが出力するパネル（セッション、編集、フィードバック、コード行数、PR、最初のトークンまでの時間）には **(VS Code)** というラベルが付いています。メトリクス名は公式の[VS Code モニタリングガイド](https://code.visualstudio.com/docs/copilot/guides/monitoring-agents)および GitHub Copilot CLI 独自の `copilot help monitoring`、および [OTel GenAI セマンティック規約](https://github.com/open-telemetry/semantic-conventions-genai)に基づいています。一部のメトリクスごとの**内訳属性キー**（例：承認済み編集と拒否済み編集）は公開されていません。これらのパネルには合計値が表示されます（[Copilot が出力するメトリクス](#copilot-が出力するメトリクス)を参照）。
:::

## Bearer トークン認証

ベアラートークン（CloudWatch メトリクス API キー）を使用すると、AWS 外部で実行されているツール（開発者のラップトップ上の Copilot など）が、AWS SDK や IAM 認証情報チェーンを必要とせずに CloudWatch にメトリクスを送信できます。各トークンは、[CloudWatchAPIKeyAccess](https://docs.aws.amazon.com/aws-managed-policy/latest/reference/CloudWatchAPIKeyAccess.html) マネージドポリシーのみにスコープされた AWS IAM ユーザーに紐付けられています。

:::warning
Bearer トークンは長期的な認証情報です。このレシピで Bearer トークンを使用しているのは、AI コーディングエージェントが AWS の外部にある開発者のラップトップ上で動作しており、短期的な認証情報を使用した SigV4 では中央コレクターまたはマシンごとのコレクタープロセスが必要になるためです。短期的な認証情報を使用した SigV4 が実現可能な AWS 内で動作するワークロードでは、より強固なセキュリティ体制のためにそのアプローチを優先してください。CloudWatch OTLP エンドポイントは HTTPS を必要とし、プレーン HTTP によるリクエストは拒否されます。詳細については、[CloudWatch OTLP Metrics Bearer Token Auth](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-OTLP-MetricsBearerTokenAuth.html) を参照してください。
:::

## ソリューションの概要

セットアップには 3 つのコンポーネントがあります。

1. **CloudWatch メトリクス API キー** — 範囲を絞った IAM ユーザーに紐付けられたベアラートークンです。開発者ごとに 1 回作成するか、チームで共有します。
2. **Copilot 設定** — VS Code の設定と環境変数で、Copilot の OpenTelemetry SDK にメトリクスの送信先と属性付けの方法を伝えます。
3. **事前構築済みダッシュボード** — トークン使用量、レイテンシー、ツールおよび開発者のアクティビティ、PromQL クエリを使用したチームレベルの使用状況を可視化する CloudWatch ダッシュボード（および Grafana 相当品）です。

## 前提条件

* CloudWatch および IAM リソースを作成する権限を持つ AWS アカウント。
* AWS CLI v2 がインストールおよび設定済みであること。
* 次のいずれか（または両方）の Copilot クライアント: GitHub Copilot Chat 拡張機能を使用して Copilot にサインインした VS Code、および/または認証済みの GitHub Copilot CLI(`copilot` その後 `/login`、または `GITHUB_TOKEN`)。
* CloudWatch メトリクス API キー（以下で作成）。

## ベアラートークンを作成する

CloudWatch コンソール (**Settings** > **API keys** までスクロール > **Create**) または CLI を使用してトークンを作成できます。

```bash
# Create an IAM user for CloudWatch metrics ingestion
aws iam create-user --user-name copilot-cloudwatch-metrics-user

# Attach the CloudWatchAPIKeyAccess managed policy
aws iam attach-user-policy \
    --user-name copilot-cloudwatch-metrics-user \
    --policy-arn arn:aws:iam::aws:policy/CloudWatchAPIKeyAccess

# Create a service-specific credential (the bearer token), expiring in 90 days
aws iam create-service-specific-credential \
    --user-name copilot-cloudwatch-metrics-user \
    --service-name cloudwatch.amazonaws.com \
    --credential-age-days 90
```

レスポンスには `ServiceCredentialSecret` フィールド — これはベアラートークンの値です。[AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html) またはお客様の組織のボールトに安全に保存してください。バージョン管理にコミットしないでください。

## Copilot を設定する

使用するクライアントを設定します。どちらも `OTEL_RESOURCE_ATTRIBUTES`（帰属のため）と `OTEL_EXPORTER_OTLP_HEADERS`（ベアラートークン用）に対応しています。全体を通して `<AWS_REGION>`（例えば `us-east-1`）と `<YOUR_BEARER_TOKEN>`（`ServiceCredentialSecret` の値）を置き換えてください。

クライアントを起動するシェルで、以下の共通環境変数を最初に定義してください。

```bash
export OTEL_EXPORTER_OTLP_HEADERS="Authorization=Bearer <YOUR_BEARER_TOKEN>"
export OTEL_RESOURCE_ATTRIBUTES="user.id=$(whoami),user.email=${USER_EMAIL},team.id=${TEAM:-engineering},cost_center=${COST_CENTER:-default},department=${DEPARTMENT:-engineering},environment=${ENV:-dev}"
```

### VS Code Copilot Chat 拡張機能

`settings.json` で OTel を有効にします（**認証ヘッダーは環境から取得する必要があります** — VS Code のドキュメントには次のように記載されています: *「リモートコレクターの認証ヘッダーは、`OTEL_EXPORTER_OTLP_HEADERS` 環境変数を通じてのみ設定可能です」*）:

```json
{
  "github.copilot.chat.otel.enabled": true,
  "github.copilot.chat.otel.otlpEndpoint": "https://monitoring.<AWS_REGION>.amazonaws.com",
  "github.copilot.chat.otel.exporterType": "otlp-http"
}
```

次に、変数が設定されたシェルから VS Code を起動します: `code .`。デフォルトの OTLP プロトコルは `http/protobuf` で、CloudWatch エンドポイントはこれを受け入れます。`service.name` のデフォルト値は `copilot-chat` です。

### GitHub Copilot CLI

CLI は環境変数を通じて完全に設定されます（完全なリファレンスについては `copilot help monitoring` を実行してください）。エンドポイントを設定すると OTel が自動的に有効になります。

```bash
export OTEL_EXPORTER_OTLP_ENDPOINT="https://monitoring.<AWS_REGION>.amazonaws.com"
export OTEL_EXPORTER_OTLP_PROTOCOL="http/json"   # CLI default; CloudWatch accepts json and protobuf
# OTEL_EXPORTER_OTLP_HEADERS + OTEL_RESOURCE_ATTRIBUTES from the common block above
copilot
```

`service.name` のデフォルト値は `github-copilot` です。CLI はより小さなメトリクスセットを出力します（以下の表を参照）。ダッシュボードはすでに両方の命名スキームに対応しています。

:::warning
両方のクライアントは**トレース、メトリクス、およびイベントを同じエンドポイントに送信します** — メトリクスのみのモードはドキュメント化されていません。CloudWatch メトリクスエンドポイント (`/v1/metrics`) はメトリクスを取り込みます。そのホストへのトレースおよびログの POST は単純に拒否・破棄されます。これは無害ですが、メトリクス以外のシグナルに対してクライアント側のエクスポートエラーが表示されることを意味します。トレースやログも取得する場合、またはシグナルをきれいに分離する場合は、ローカルの OpenTelemetry Collector を実行し、クライアントを `/v1/metrics` に直接向ける代わりに、各シグナルを対応する CloudWatch エンドポイントにルーティングしてください。
:::

### アイデンティティとチームの帰属

Copilot は、メトリクスメータープロバイダー上で標準の `OTEL_RESOURCE_ATTRIBUTES` 環境変数を尊重し、その値を**リソース属性**としてすべてのメトリクスに付加します。これらは、ダッシュボードがグループ化に使用する PromQL ラベルになります（`@resource.` プレフィックスで参照されます — 例えば `@resource.team.id`）。

| 属性 | PromQL ラベル | 目的 | 例 |
| --- | --- | --- | --- |
| `user.id` | `@resource.user.id` | 開発者ごとの帰属 | `jdoe` |
| `user.email` | `@resource.user.email` | 開発者ごとの帰属 | `jdoe@example.com` |
| `team.id` | `@resource.team.id` | チームレベルの集計 | `platform-eng` |
| `cost_center` | `@resource.cost_center` | 財務/チャージバックのグループ化 | `CC-4200` |
| `department` | `@resource.department` | 組織レベルのロールアップ | `engineering` |
| `environment` | `@resource.environment` | dev/staging/prod 使用の区別 | `production` |

## メトリクスが流れていることを確認する

Copilot セッション(VS Code Chat セッション、または `copilot` 設定済みのシェルで) いくつかのプロンプトを送信します。次に[CloudWatch Query Studio](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-PromQL-QueryStudio.html)を開いて入力します `copilot` または `gen_ai`、またはインスタントクエリを実行します。例：

```
sum(histogram_sum({"gen_ai.client.token.usage", "@resource.service.name"=~"copilot.*"}))
```

メトリクスが表示される場合、設定は正しいです。表示されない場合は、エンドポイント URL を確認してください。 `OTEL_EXPORTER_OTLP_HEADERS` クライアントを起動したシェルで設定されており、少なくとも 1 回のインタラクションが完了していることを確認してください。CloudWatch への取り込みは、クエリ可能になるまで数分かかる場合があります。

### Copilot が出力するメトリクス

ダッシュボードはこれらのメトリクスをもとに構築されています。**Source** 列は、各メトリクスを送信するクライアントを示しています。ダッシュボードは両方を以下の方法で照合します。 `@resource.service.name=~"copilot.*"` 2 つのツールメトリクス名を結合します。

| メトリクス | タイプ | ソース | 注記 |
| --- | --- | --- | --- |
| `gen_ai.client.token.usage` | Histogram | both | トークン数。`gen_ai.token.type` ∈ `input`, `output`、`gen_ai.request.model`。合計値は `sum(histogram_sum(...))` でクエリします — `histogram_sum` 単体ではシリーズごとになるため、集計するには `sum(...)`（または `sum by (...)`）で囲みます。 |
| `gen_ai.client.operation.duration` | Histogram | both | LLM 呼び出しの所要時間（秒）。`gen_ai.request.model`, `error.type`。 |
| `copilot_chat.tool.call.count` / `github.copilot.tool.call.count` | Counter | VS Code / CLI | ツール呼び出し。`gen_ai.tool.name`、success。 |
| `copilot_chat.tool.call.duration` / `github.copilot.tool.call.duration` | Histogram | VS Code / CLI | ツール実行のレイテンシー。 |
| `copilot_chat.agent.turn.count` / `github.copilot.agent.turn.count` | Histogram | VS Code / CLI | エージェント呼び出しごとの LLM ラウンドトリップ。 |
| `copilot_chat.time_to_first_token` | Histogram | VS Code | 最初の SSE トークンまでの時間（秒）。 |
| `copilot_chat.agent.invocation.duration` | Histogram | VS Code | エージェントのエンドツーエンドの所要時間（秒）。 |
| `copilot_chat.session.count` | Counter | VS Code | 開始されたチャットセッション数。 |
| `copilot_chat.lines_of_code.count` | Counter | VS Code | 承認された編集による追加または削除された行数。¹ |
| `copilot_chat.edit.acceptance.count` | Counter | VS Code | 編集の承認/拒否の決定。¹ |
| `copilot_chat.user.feedback.count` | Counter | VS Code | 高評価/低評価の投票数。¹ |
| `copilot_chat.user.action.count` | Counter | VS Code | エンゲージメントアクション（コピー、挿入、適用、フォローアップ）。¹ |
| `copilot_chat.pull_request.count` | Counter | VS Code | 作成されたプルリクエスト数。 |

**GitHub Copilot CLI は最初の 3 行のみを出力します** (`gen_ai.*` plus `github.copilot.tool.call.*` および `github.copilot.agent.turn.count`) — 以下の方法で確認済み `copilot help monitoring`。残りの `copilot_chat.*` メトリクスは VS Code 拡張機能専用であり、ダッシュボード上のパネルには **(VS Code)** というラベルが付いています。

¹ VS Code のドキュメントにはこれらの内訳（追加/削除、承認/拒否、上/下）が記載されていますが、それらを伝えるアトリビュートのキー/値は**公開されていません**。そのため、ダッシュボードではこれらのメトリクスの**合計値**のみをグラフ化しています。実際の出力からラベル名を確認したうえで（設定後に `"github.copilot.chat.otel.exporterType": "console"` VS Code で、または `COPILOT_OTEL_FILE_EXPORTER_PATH` CLI の場合、それらを検査するため）。確認済みのクロスメトリクスフィルター属性： `gen_ai.request.model`, `gen_ai.provider.name`, `gen_ai.tool.name`, `copilot_chat.edit.source`, `error.type`.

:::note
Amazon Bedrock 上の Claude Code と同様に、Copilot はコストのメトリクスを**発行しません**。ダッシュボードはトークン消費量をレポートします。必要に応じて、トークン数とプランの料金からコストを算出してください。
:::

## 使用状況サンプルダッシュボード

### CloudWatch ダッシュボード

[copilot-cloudwatch-dashboard.json](https://raw.githubusercontent.com/aws-observability/aws-observability-accelerator/main/artifacts/cloudwatch-dashboards/copilot/copilot.json) をダウンロードしてデプロイします。

```bash
aws cloudwatch put-dashboard \
  --dashboard-name CopilotDashboard \
  --dashboard-body file://copilot-cloudwatch-dashboard.json \
  --region <AWS_REGION>

# Verify
aws cloudwatch list-dashboards --dashboard-name-prefix Copilot --region <AWS_REGION>
```

ダッシュボードは 5 つのセクションで構成されています。

* **概要** — トークン合計、セッション、アクティブユーザー、ツール呼び出し。
* **トークン使用量** — 時系列のトークン数、タイプ別（入力 / 出力）、モデル別、およびトップユーザー。
* **パフォーマンスとレイテンシー** — LLM オペレーションの所要時間とタイム・トゥ・ファースト・トークン（p50/p90/p99）、モデル別 LLM レイテンシー p90、ツール呼び出しレイテンシー、エージェント呼び出し/ターンメトリクス。レイテンシーパネルは、集約セレクター上で CloudWatch のネイティブヒストグラム関数を使用しています — `histogram_quantile(0.9, sum({"gen_ai.client.operation.duration"}))` — CloudWatch の OTLP ヒストグラムはクラシック Prometheus を公開しないため `le` バケット。(セレクターを `sum(...)` そのため、ユーザーごとに 1 行ではなく、すべてのシリーズにわたって分位数が集計されます。)
* **ツールと開発者のアクティビティ** — ツールと結果別のツール呼び出し、コード行数、編集承認率、ユーザーフィードバック、プルリクエスト。
* **組織別内訳** — 部門、チーム、コストセンター別のトークン使用量、および環境別のセッション数。

### Grafana ダッシュボード

組織が Amazon Managed Grafana（またはセルフマネージド Grafana）を使用している場合は、[copilot-grafana-dashboard.json](https://raw.githubusercontent.com/aws-observability/aws-observability-accelerator/main/artifacts/grafana-dashboards/copilot/copilot.json) をインポートしてください。これは、[CloudWatch PromQL エンドポイントを指す Amazon Managed Service for Prometheus データソース](https://docs.aws.amazon.com/grafana/latest/userguide/cloudwatch-promql.html)に対して同じ PromQL を使用します(SigV4 の **Service** を `monitoring`)。ダッシュボードのデータソースとして選択します。 `datasource` インポート時の変数。

## アラート

すべてのパネルは PromQL クエリによって支えられているため、**View in Query Studio** > **Create alarm** から任意のパネルでアラームを作成できます。いくつかの例を示します。

**チームのトークン使用量しきい値** — チームの 1 日あたりのトークン使用量が予算を超えた場合にアラートを発します。

```
sum by ("@resource.team.id") (increase(histogram_sum({"gen_ai.client.token.usage"})[24h])) > 5000000
```

**LLM レイテンシーの回帰** — p90 LLM オペレーションの所要時間が 30 秒を超えた場合にアラートを発します。

```
histogram_quantile(0.9, sum({"gen_ai.client.operation.duration"})) > 30
```

**採用率の低下** — チームの日次セッションが 7 日間平均の半分を下回った場合に検出します。

```
sum by ("@resource.team.id") (increase({"copilot_chat.session.count"}[24h]))
< 0.5 * avg_over_time(sum by ("@resource.team.id") (increase({"copilot_chat.session.count"}[1h]))[7d:1d])
```

## コスト見積もり

CloudWatch OTLP メトリクスの取り込みは $0.50/GB で請求されます。単一の OTLP メトリクスデータポイントは、ネットワーク上で平均約 300 バイトです。200 人の開発者組織の場合、メトリクスのボリュームは月あたり数十 MB のオーダーであり、取り込みコストは月額 $5 未満に収まります。Console での PromQL クエリは無料です。最新の料金については、[Amazon CloudWatch の料金ページ](https://aws.amazon.com/cloudwatch/pricing/)をご参照ください。

## クリーンアップ

:::warning
CloudWatch のメトリクスデータは、テレメトリを停止した後も保持され（最大 15 か月の保持期間）、追加料金はかかりません。CloudWatch アラームは、作成した場合、削除されるまで $0.10/アラーム/月の料金が発生します。IAM ユーザーとベアラートークンをアクティブのままにしておくことは、セキュリティリスクをもたらします。
:::

```bash
# Delete the dashboard
aws cloudwatch delete-dashboards --dashboard-names CopilotDashboard --region <AWS_REGION>

# Delete the service-specific credential, detach the policy, delete the user
aws iam delete-service-specific-credential --user-name copilot-cloudwatch-metrics-user --service-specific-credential-id <credential-id>
aws iam detach-user-policy --user-name copilot-cloudwatch-metrics-user --policy-arn arn:aws:iam::aws:policy/CloudWatchAPIKeyAccess
aws iam delete-user --user-name copilot-cloudwatch-metrics-user
```

テレメトリのエクスポートを停止するには、次を設定します。 `"github.copilot.chat.otel.enabled": false` VS Code の設定でオフにします `OTEL_EXPORTER_OTLP_HEADERS` / `OTEL_RESOURCE_ATTRIBUTES`.

## リソース

* [VS Code: OpenTelemetry でエージェントの使用状況を監視する](https://code.visualstudio.com/docs/copilot/guides/monitoring-agents)
* [CloudWatch OTLP Metrics Bearer Token Auth](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-OTLP-MetricsBearerTokenAuth.html)
* [PromQL を使用して Amazon CloudWatch メトリクスをクエリする (Amazon Managed Grafana)](https://docs.aws.amazon.com/grafana/latest/userguide/cloudwatch-promql.html)
* [OpenTelemetry GenAI セマンティック規約](https://github.com/open-telemetry/semantic-conventions-genai)
