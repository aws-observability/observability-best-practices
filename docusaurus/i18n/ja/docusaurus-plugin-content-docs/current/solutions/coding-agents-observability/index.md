---
title: コーディングエージェントのオブザーバビリティ
sidebar_label: コーディングエージェント
---

import RelatedEvents from '@site/src/components/RelatedEvents';

# コーディングエージェントのオブザーバビリティ

## Related Events

<RelatedEvents topics={["ai-ml"]} />


## 概要

AI コーディングエージェント（Claude Code、OpenAI Codex、GitHub Copilot）は開発者のラップトップ上で AWS の外部で実行されるため、従来の CloudWatch 計装は実用的ではありません。これらのエージェントはそれぞれ組み込みの OpenTelemetry SDK を搭載しており、ベアラートークン認証を使用して CloudWatch OTLP エンドポイントにメトリクスを直接エクスポートできます — 開発者マシンにコレクター、サイドカー、AWS SDK は不要です。

このソリューションでは、3 つのエージェントすべてを設定して使用メトリクス（トークン、セッション、コスト、ツールコール、レイテンシ）を CloudWatch に送信し、PromQL ダッシュボードとアラームで開発者ごと、チームごと、組織レベルの可視性を提供します。同じデータは、CloudWatch PromQL データソースを介して Amazon Managed Grafana からもクエリ可能です。

パターンはエージェント間で一貫しています：CloudWatch メトリクス API キー（ベアラートークン）を作成し、エージェントの OTel 環境変数または設定ファイルを構成し、チーム帰属のためのリソース属性を設定し、事前構築されたダッシュボードをデプロイします。

**コスト：** CloudWatch OTLP メトリクスの取り込みは $0.50/GB で課金されます。200 人の開発者の組織（開発者あたり約 20 セッション/日）の場合、メトリクス量は月あたり数十 MB のオーダーであり、取り込みには月額 $5 未満です。Claude Code の実例（7 メトリクス × 450 バイト/ポイント × 200 開発者 × 20 セッション/日 × 22 日）では約 0.27 GB/月、基本ケースで約 $0.14/月となります。コンソールでの PromQL クエリは無料です。最新の料金については [Amazon CloudWatch の料金ページ](https://aws.amazon.com/cloudwatch/pricing/)を参照してください。

## 前提条件

- IAM ユーザーおよび CloudWatch リソースを作成する権限を持つ AWS アカウント
- AWS CLI v2 がインストールおよび設定済み
- 少なくとも 1 つのコーディングエージェントがインストール済み：
  - **Claude Code** — Anthropic API または Amazon Bedrock に認証された CLI。企業向けの SSO/IdP フェデレーション（Okta、Azure AD、Auth0、Amazon Cognito、AWS IAM Identity Center）および OIDC 資格情報フェデレーションによるロールアウトについては、[Claude Apps Gateway](https://github.com/aws-samples/anthropic-on-aws/tree/main/claude-apps-gateway) を参照してください。
  - **OpenAI Codex** — `codex login` または Amazon Bedrock（`~/.codex/config.toml` で `model_provider = "amazon-bedrock"`）で認証された CLI
  - **GitHub Copilot** — サインイン済みの VS Code 拡張機能、または認証済みの Copilot CLI
- IAM 権限：`iam:CreateUser`、`iam:AttachUserPolicy`、`iam:CreateServiceSpecificCredential`、`cloudwatch:PutDashboard`

## アーキテクチャ

```
┌──────────────────────────────────────────────────────────────────┐
│                    Developer Laptops                              │
│                                                                  │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────────────┐   │
│  │ Claude Code │   │ OpenAI Codex│   │ GitHub Copilot      │   │
│  │ (OTel SDK)  │   │ (OTel SDK)  │   │ (VS Code / CLI)     │   │
│  └──────┬──────┘   └──────┬──────┘   └──────────┬──────────┘   │
│         │                  │                      │              │
└─────────┼──────────────────┼──────────────────────┼──────────────┘
          │ HTTPS + Bearer   │ HTTPS + Bearer       │ HTTPS + Bearer
          │ /v1/metrics      │ /v1/metrics          │ /v1/metrics
          └──────────────────┼──────────────────────┘
                             ▼
              ┌──────────────────────────────┐
              │  CloudWatch OTLP Endpoint    │
              │  monitoring.<region>.aws.com │
              └──────────────┬───────────────┘
                             │
                             ▼
              ┌──────────────────────────────┐
              │  CloudWatch metric store     │
              │  queryable via PromQL API    │
              └──────┬────────────────┬──────┘
                     │                │
                     ▼                ▼
          ┌────────────────────┐  ┌────────────────────┐
          │  CloudWatch        │  │  Grafana           │
          │  Dashboards        │  │  (Prometheus data  │
          │  + Alarms          │  │   source, SigV4)   │
          └────────────────────┘  └────────────────────┘
```

## デプロイ

### ステップ 1：ベアラートークンの作成（チームごとに 1 回）

ベアラートークンにより、AWS の外部で実行されるツールが IAM 認証情報チェーンなしでメトリクスを CloudWatch に送信できます。各トークンは、[CloudWatchAPIKeyAccess](https://docs.aws.amazon.com/aws-managed-policy/latest/reference/CloudWatchAPIKeyAccess.html) マネージドポリシーにスコープされた IAM ユーザーに紐づけられます。

```bash
aws iam create-user --user-name coding-agents-cw-metrics

aws iam attach-user-policy \
  --user-name coding-agents-cw-metrics \
  --policy-arn arn:aws:iam::aws:policy/CloudWatchAPIKeyAccess

aws iam create-service-specific-credential \
  --user-name coding-agents-cw-metrics \
  --service-name cloudwatch.amazonaws.com \
  --credential-age-days 90
```

`ServiceCredentialSecret` の値を AWS Secrets Manager またはお使いのボールトに保存してください。バージョン管理にコミットしないでください。

### ステップ 2：Claude Code の設定

```bash
BEARER_TOKEN=$(aws secretsmanager get-secret-value \
  --secret-id cloudwatch-otlp-bearer-token --query SecretString --output text)

export CLAUDE_CODE_ENABLE_TELEMETRY=1
export OTEL_METRICS_EXPORTER=otlp
export OTEL_EXPORTER_OTLP_PROTOCOL=http/json
export OTEL_EXPORTER_OTLP_ENDPOINT="https://monitoring.us-east-1.amazonaws.com"
export OTEL_EXPORTER_OTLP_HEADERS="Authorization=Bearer ${BEARER_TOKEN}"
export OTEL_METRIC_EXPORT_INTERVAL=2000
export OTEL_RESOURCE_ATTRIBUTES="user.id=$(whoami),user.email=${USER_EMAIL},team.id=${TEAM:-engineering},cost_center=${COST_CENTER:-default},department=${DEPARTMENT:-engineering},environment=${ENV:-dev}"
```

`OTEL_METRIC_EXPORT_INTERVAL=2000`（2 秒）により、検証中にメトリクスがすぐに表示されます。定常状態のフリート使用では、デフォルトの 60000 ms に近づけてください。

Claude Code はイベントを OpenTelemetry ログとしてもエクスポートできます。キャプチャするには、追加で `export OTEL_LOGS_EXPORTER=otlp` を設定してください。

### ステップ 3：OpenAI Codex の設定

`~/.codex/config.toml` に追加してください：

```toml
[otel]

[otel.metrics_exporter.otlp-http]
endpoint = "https://monitoring.us-east-1.amazonaws.com/v1/metrics"
protocol = "binary"

[otel.metrics_exporter.otlp-http.headers]
"Authorization" = "Bearer <YOUR_BEARER_TOKEN>"
```

**リテラルのトークン値**を貼り付けてください — Codex は TOML ヘッダー内で環境変数の参照を展開しません。権限を制限してください：`chmod 600 ~/.codex/config.toml`。

シェルで帰属を設定してください：

```bash
export OTEL_RESOURCE_ATTRIBUTES="user.id=$(whoami),user.email=${USER_EMAIL},team.id=${TEAM:-engineering},cost_center=${COST_CENTER:-default},department=${DEPARTMENT:-engineering},environment=${ENV:-dev}"
```

### ステップ 4：GitHub Copilot の設定

異なるメトリクスセットを出力する **2 つ**の Copilot プロダクトがあります：

| | VS Code Copilot Chat 拡張機能 | GitHub Copilot CLI |
| --- | --- | --- |
| `service.name` | `copilot-chat` | `github-copilot` |
| ツールメトリクスプレフィックス | `copilot_chat.tool.call.*` | `github.copilot.tool.call.*` |
| デフォルト OTLP プロトコル | `http/protobuf` | `http/json` |

まず共通の環境変数を設定してください（クライアントを起動するシェルで）：

```bash
export OTEL_EXPORTER_OTLP_HEADERS="Authorization=Bearer <YOUR_BEARER_TOKEN>"
export OTEL_RESOURCE_ATTRIBUTES="user.id=$(whoami),user.email=${USER_EMAIL},team.id=${TEAM:-engineering},cost_center=${COST_CENTER:-default},department=${DEPARTMENT:-engineering},environment=${ENV:-dev}"
```

**VS Code Copilot Chat 拡張機能** — `settings.json` で OTel を有効にしてください（認証ヘッダーは環境変数から取得する必要があります）：

```json
{
  "github.copilot.chat.otel.enabled": true,
  "github.copilot.chat.otel.otlpEndpoint": "https://monitoring.<AWS_REGION>.amazonaws.com",
  "github.copilot.chat.otel.exporterType": "otlp-http"
}
```

その後、変数を設定したシェルから VS Code を起動してください：`code .`

**GitHub Copilot CLI** — 完全に環境変数で設定されます：

```bash
export OTEL_EXPORTER_OTLP_ENDPOINT="https://monitoring.<AWS_REGION>.amazonaws.com"
export OTEL_EXPORTER_OTLP_PROTOCOL="http/json"
copilot
```

生のメトリクス出力を検査するには、`COPILOT_OTEL_FILE_EXPORTER_PATH` をローカルファイルパスに設定するか、VS Code で `"github.copilot.chat.otel.exporterType": "console"` を使用してください。

### ステップ 5：CloudWatch ダッシュボードのデプロイ

```bash
# Claude Code
curl -o claude-code-dashboard.json \
  https://raw.githubusercontent.com/aws-observability/aws-observability-accelerator/main/artifacts/cloudwatch-dashboards/claude-code/claude-code.json
aws cloudwatch put-dashboard --dashboard-name ClaudeCodeDashboard \
  --dashboard-body file://claude-code-dashboard.json --region us-east-1

# Codex
curl -o codex-dashboard.json \
  https://raw.githubusercontent.com/aws-observability/aws-observability-accelerator/main/artifacts/cloudwatch-dashboards/codex/codex.json
aws cloudwatch put-dashboard --dashboard-name CodexDashboard \
  --dashboard-body file://codex-dashboard.json --region us-east-1

# Copilot
curl -o copilot-dashboard.json \
  https://raw.githubusercontent.com/aws-observability/aws-observability-accelerator/main/artifacts/cloudwatch-dashboards/copilot/copilot.json
aws cloudwatch put-dashboard --dashboard-name CopilotDashboard \
  --dashboard-body file://copilot-dashboard.json --region us-east-1
```

### ステップ 6：Grafana ダッシュボードのデプロイ

組織が Amazon Managed Grafana（または自己管理の Grafana）を使用している場合は、各エージェント用の同等の Grafana JSON をインポートしてください。それぞれ同じ PromQL を使用するため、SigV4 認証と **Service** を `monitoring` に設定した [CloudWatch PromQL エンドポイント](https://docs.aws.amazon.com/grafana/latest/userguide/cloudwatch-promql.html)を指す **Prometheus** データソースを追加してください。インポート時にダッシュボードの `datasource` 変数でそのデータソースを選択してください。

このパスには Amazon Managed Service for Prometheus は関与しないことに注意してください。メトリクスは CloudWatch に留まります。PromQL API は OTLP で取り込まれたメトリクスに対する CloudWatch のクエリ表面であり、Grafana は汎用の Prometheus データソースを使用してそれを読み取ります。

```bash
# Claude Code
curl -o claude-code-grafana.json \
  https://raw.githubusercontent.com/aws-observability/aws-observability-accelerator/main/artifacts/grafana-dashboards/claude-code/claude-code.json

# Codex
curl -o codex-grafana.json \
  https://raw.githubusercontent.com/aws-observability/aws-observability-accelerator/main/artifacts/grafana-dashboards/codex/codex.json

# Copilot
curl -o copilot-grafana.json \
  https://raw.githubusercontent.com/aws-observability/aws-observability-accelerator/main/artifacts/grafana-dashboards/copilot/copilot.json
```

## 検証

1. **Claude Code** — 短いセッションを実行してクエリしてください：
   ```bash
   claude -p "hello" --max-turns 1
   # Then in CloudWatch Query Studio:
   # sum({"claude_code.token.usage"})
   ```

2. **Codex** — ワンショットコマンドを実行してください：
   ```bash
   codex exec "print hello world in python"
   # Query: sum({"codex.turn.token_usage"})
   ```

3. **Copilot** — VS Code を開き、チャットプロンプトを送信してからクエリしてください：
   ```
   sum(histogram_sum({"gen_ai.client.token.usage", "@resource.service.name"=~"copilot.*"}))
   ```

メトリクスが表示されるまで 2〜5 分かかります。`cwpromql series '{"claude_code.token.usage"}' -o json` または CloudWatch Query Studio でリソース属性を確認してください。

### 出力されるメトリクス

#### Claude Code

| メトリクス | タイプ | 説明 |
| --- | --- | --- |
| `claude_code.token.usage` | Counter | 消費されたトークン数。属性 `type` ∈ `input`、`output`、`cacheRead`、`cacheCreation`、および `model` |
| `claude_code.cost.usage` | Counter | USD での推定コスト。属性 `model` |
| `claude_code.session.count` | Counter | 開始された CLI セッション |
| `claude_code.lines_of_code.count` | Counter | 変更されたコード行数。属性 `type` ∈ `added`、`removed` |
| `claude_code.commit.count` | Counter | Claude Code が作成した Git コミット |
| `claude_code.pull_request.count` | Counter | Claude Code が作成したプルリクエスト |
| `claude_code.code_edit_tool.decision` | Counter | 編集ツールの許可決定。属性 `tool`、`decision` ∈ `accept`、`reject` |
| `claude_code.active_time.total` | Counter | 開発者のアクティブ時間の合計（秒） |

Claude Code はコストメトリクス（`claude_code.cost.usage`）を出力する唯一のエージェントのため、ダッシュボードでは推定支出を直接チャート表示できます。

#### OpenAI Codex

| メトリクス | タイプ | 説明 |
| --- | --- | --- |
| `codex.turn.token_usage` | Histogram | トークン使用量。属性 `token_type` ∈ `input`、`output`、`cached_input`、`reasoning_output`、および `model` |
| `codex.api_request` | Counter | モデル API リクエスト数。属性 `model`、`success`、`status` |
| `codex.api_request.duration_ms` | Histogram | API リクエストレイテンシ |
| `codex.tool.call` | Counter | ツール呼び出し回数。属性 `tool`、`success` |
| `codex.tool.call.duration_ms` | Histogram | ツール実行レイテンシ |
| `codex.approval.requested` | Counter | 承認プロンプトとその `decision` |
| `codex.conversation.turn.count` | Counter | 会話ターン。属性 `model` |
| `codex.turn.e2e_duration_ms` | Histogram | エンドツーエンドのターンレイテンシ |
| `codex.thread.started` | Counter | 開始されたスレッド/セッション |

Codex はコストメトリクスを出力しません。必要に応じて、ダウンストリームでトークン数にモデル料金を掛けてください。

#### GitHub Copilot

異なるメトリクスセットを持つ 2 つのクライアントがあります。ダッシュボードは `@resource.service.name=~"copilot.*"` で両方に一致し、2 つのツールメトリクス名をユニオンします。

| メトリクス | タイプ | ソース | 備考 |
| --- | --- | --- | --- |
| `gen_ai.client.token.usage` | Histogram | 両方 | トークン数。`gen_ai.token.type` ∈ `input`、`output`、`gen_ai.request.model`。合計は `sum(histogram_sum(...))` でクエリしてください。 |
| `gen_ai.client.operation.duration` | Histogram | 両方 | LLM コール所要時間（秒）。`gen_ai.request.model`、`error.type` |
| `copilot_chat.tool.call.count` / `github.copilot.tool.call.count` | Counter | VS Code / CLI | ツール呼び出し。`gen_ai.tool.name`、success |
| `copilot_chat.tool.call.duration` / `github.copilot.tool.call.duration` | Histogram | VS Code / CLI | ツール実行レイテンシ |
| `copilot_chat.agent.turn.count` / `github.copilot.agent.turn.count` | Histogram | VS Code / CLI | エージェント呼び出しあたりの LLM ラウンドトリップ |
| `copilot_chat.time_to_first_token` | Histogram | VS Code | 最初の SSE トークンまでの時間（秒） |
| `copilot_chat.agent.invocation.duration` | Histogram | VS Code | エージェントのエンドツーエンド所要時間（秒） |
| `copilot_chat.session.count` | Counter | VS Code | 開始されたチャットセッション |
| `copilot_chat.lines_of_code.count` | Counter | VS Code | 承認された編集で追加または削除された行 |
| `copilot_chat.edit.acceptance.count` | Counter | VS Code | 編集の承認/拒否の決定 |
| `copilot_chat.user.feedback.count` | Counter | VS Code | 高評価/低評価の投票 |
| `copilot_chat.user.action.count` | Counter | VS Code | エンゲージメントアクション（コピー、挿入、適用、フォローアップ） |
| `copilot_chat.pull_request.count` | Counter | VS Code | 作成されたプルリクエスト |

GitHub Copilot CLI は最初の 5 行のみを出力します。残りの `copilot_chat.*` メトリクスは VS Code 拡張機能専用です。Copilot はドルコストメトリクスを出力しません。

Copilot メトリクスは以下のデータポイント属性を持ち、パネルやアラームを構築する際のグルーピングやフィルタリングに使用します：`gen_ai.request.model`、`gen_ai.provider.name`、`gen_ai.tool.name`、`copilot_chat.edit.source`、`error.type`。

## アラート

すべてのダッシュボードパネルは PromQL クエリに基づいています。**Query Studio で表示** > **アラームの作成**で任意のパネルからアラームを作成できます。エージェント別の例：

### Claude Code

**個人の支出スパイク** — 開発者の 1 時間あたりの支出が 24 時間平均の 2 倍を超えた場合にアラート：

```
sum by ("@resource.user.email") (increase({"claude_code.cost.usage"}[1h]))
> 2 * avg_over_time(sum by ("@resource.user.email") (increase({"claude_code.cost.usage"}[1h]))[24h:1h])
```

**チーム予算しきい値** — チームの 1 日のコストが予算（USD）を超えた場合にアラート：

```
sum by ("@resource.team.id") (increase({"claude_code.cost.usage"}[24h])) > 500
```

**採用リグレッション** — チームの 1 日のセッションが 7 日平均の半分を下回った場合に検出：

```
sum by ("@resource.team.id") (increase({"claude_code.session.count"}[24h]))
< 0.5 * avg_over_time(sum by ("@resource.team.id") (increase({"claude_code.session.count"}[1h]))[7d:1d])
```

### OpenAI Codex

**チームのトークン使用量しきい値**：

```
sum by ("@resource.team.id") (increase({"codex.turn.token_usage"}[24h])) > 5000000
```

**API エラー率の上昇**：

```
sum(increase({"codex.api_request", success="false"}[1h])) > 50
```

**レイテンシリグレッション** — p90 ターンレイテンシが 30 秒を超えた場合：

```
histogram_quantile(0.9, sum({"codex.turn.e2e_duration_ms"})) > 30000
```

**採用リグレッション**：

```
sum by ("@resource.team.id") (increase({"codex.thread.started"}[24h]))
< 0.5 * avg_over_time(sum by ("@resource.team.id") (increase({"codex.thread.started"}[1h]))[7d:1d])
```

### GitHub Copilot

**チームのトークン使用量しきい値**：

```
sum by ("@resource.team.id") (increase(histogram_sum({"gen_ai.client.token.usage"})[24h])) > 5000000
```

**LLM レイテンシリグレッション** — p90 操作時間が 30 秒を超えた場合：

```
histogram_quantile(0.9, sum({"gen_ai.client.operation.duration"})) > 30
```

**採用リグレッション**：

```
sum by ("@resource.team.id") (increase({"copilot_chat.session.count"}[24h]))
< 0.5 * avg_over_time(sum by ("@resource.team.id") (increase({"copilot_chat.session.count"}[1h]))[7d:1d])
```

## トラブルシューティング

| 症状 | 考えられる原因 | 修正方法 |
|------|---------------|----------|
| 5 分後もメトリクスが表示されない（全エージェント共通） | ベアラートークンが無効、またはエンドポイント URL が間違っている | トークンがリテラルの `ServiceCredentialSecret` の値であることを確認してください。エンドポイントが `https://monitoring.<REGION>.amazonaws.com` であることを確認してください |
| Codex の設定が無視される | `~/.codex/config.toml` の構文エラー、またはヘッダーでの環境変数参照 | リテラルのトークン値を貼り付けてください（Codex は TOML で `${VAR}` を展開しません）。`chmod 600 ~/.codex/config.toml` を実行してください |
| Copilot メトリクスが CloudWatch に表示されない | VS Code を起動したシェルで `OTEL_EXPORTER_OTLP_HEADERS` が設定されていない | まず変数をエクスポートし、そのシェルから `code .` を実行してください。VS Code は settings.json からヘッダーを取得しません |
| リソース属性（`@resource.team.id`）が空 | `OTEL_RESOURCE_ATTRIBUTES` が未設定または不正 | エージェントを起動するシェルプロファイルで変数がエクスポートされていることを確認してください。値の `=` の前後にスペースを入れないでください |
| Grafana パネルでダッシュボードが「No Data」を表示 | データソースが CloudWatch PromQL エンドポイントを指していない | AMG で、Prometheus データソースの URL を `https://monitoring.<REGION>.amazonaws.com` に設定し、SigV4 サービスを `monitoring` にしてください |
| Copilot CLI でトレース/ログのエクスポートエラー | CLI がすべてのシグナルを同じエンドポイントに送信し、非メトリクスの POST が拒否される | 無害です — メトリクスは引き続きフローします。抑制するには、ローカル OTel コレクターを実行し、各シグナルを個別にルーティングしてください |

## 関連ソリューション

- [GenAI ワークロードのオブザーバビリティ](../genai-observability/) — Bedrock/SageMaker モデル呼び出しモニタリングとエージェントトレースのオブザーバビリティ
