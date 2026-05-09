# AWS での GenAI 可観測性

## 概要

生成 AI ワークロードは、従来のアプリケーションとは異なる特性を持ち、初日からオブザーバビリティが不可欠です。応答は非決定的であり、レイテンシーはプロンプトの複雑さによって大きく変動し、コストはトークン使用量に直接結びついており、単一のエージェント呼び出しが数秒以内に Bedrock、S3、Lambda、KMS 全体で数十の API 呼び出しを連鎖させることがあります。

適切なオブザーバビリティがない場合、チームは予測可能な問題に直面します。

- **コストの超過** — 追跡されていないトークン使用量は予期しない請求につながります。単一の暴走したエージェントループは、数分で数百ドルを消費する可能性があります。
- **パフォーマンスの低下** — 応答の遅延はユーザーエクスペリエンスに影響を与え、見えないものは修正できません。エージェントワークフローは、モデル呼び出しが成功している間にオーケストレーション層で静かに失敗する可能性があります。
- **品質のギャップ** — エラー、ハルシネーション、予期しない出力は、ユーザーが苦情を言うまで検出されません。
- **コンプライアンスと監査のリスク** — モデルが何を言ったか、どのパラメータを使用したか、どの IAM ロールが要求したかの記録がありません。

このガイドでは、AWS 上の GenAI ワークロードを監視するための戦略、AWS 実装、有効化パターン、およびダッシュボード設計について説明します。このガイドは、同じテレメトリを DevOps、FinOps、およびその他の関係者向けのペルソナベースのダッシュボードに変換する方法を示す、関連ガイド「[GenAI テレメトリ用のカスタムダッシュボードの作成](../custom-dashboards-for-genai-telemetry)」と組み合わせて使用できます。

---

## GenAI オブザーバビリティが異なる理由

### 独自の課題

**非決定的な動作** — 同じ入力が異なる出力を生成する可能性があります。従来の「正しい値を返したか」というテストは適用されません。成功/失敗だけでなく、品質メトリクスが必要です。

**可変レイテンシー** — 応答時間は、プロンプトの複雑さ、出力の長さ、モデルの負荷、およびクロスリージョンルーティングに依存します。P50 と P95 は、従来の API よりもはるかに乖離します。

**トークンベースの料金** — コストは、リクエスト数だけでなく、使用パターンに応じて増減します。平均プロンプト長がわずかに増加するだけで、月額料金が 2 倍になる可能性があります。

**マルチサービスの複雑性** — エージェントは複数の AWS サービスにわたって API 呼び出しをチェーンします。単一のログソースでは完全なストーリーを把握できません。

**迅速な反復** — モデルとプロンプトは頻繁に変更されます。オブザーバビリティは、モデルのバージョン、プロンプトテンプレート、および設定の変更を経時的に追跡する必要があります。

### ビジネスへの影響

オブザーバビリティを後回しにする組織は、通常、これらのパターンを事後的に発見します。

- 月間 Bedrock 予算の 80% を消費する、チューニングされていない単一のプロンプト
- モデルメトリクスは正常に見えるのに、ツールレイヤーで失敗する Agent ワークフロー
- 事前に編集が設定されていなかったために、ログに PII が漏洩
- チームタグが適用されていなかったために、コストの帰属が不可能

オブザーバビリティを早期に適切に実装することで、後から高コストな改修を防ぐことができます。

---

## GenAI のコア柱

### メトリクス

「私の AI はどのように動作していますか？」という質問に答える運用テレメトリ

**追跡すべき重要なメトリクス:**

- **トークン使用量** — リクエストあたりの入力トークン、リクエストあたりの出力トークン、モデルとユーザー別の合計トークン、トークンコスト計算
- **レイテンシー** — 最初のトークンまでの時間 (TTFT)、合計応答時間、P50/P95/P99 パーセンタイル、モデルとリージョン別のレイテンシー
- **リクエスト量** — 秒/分/時間あたりのリクエスト数、成功率とエラー率、同時リクエスト数
- **コスト** — リクエストあたりのコスト、モデル/ユーザー/チーム別のコスト、日次/月次トレンド、コスト効率 (1 ドルあたりの出力トークン数)

### ログ

AI が「何を言ったか、誰に対して言ったか」という質問に答えるコンテンツとコンテキスト

**ログに記録する内容:**

- リクエスト/レスポンスのペア (PII の編集を含む)
- プロンプトテンプレートと変数
- モデルパラメータ (temperature、max_tokens、top_p)
- エラーメッセージとスタックトレース
- ユーザーコンテキストとセッション ID
- A/B テストのバリアント

**ログレベル:**

- `DEBUG` — 詳細なプロンプトエンジニアリングの反復
- `INFO` — メタデータを含む成功したリクエスト
- `WARN` — リトライ、フォールバック、レート制限
- `ERROR` — 失敗、タイムアウト、無効な応答

### トレース

「リクエストがシステム内をどのように移動したか」という問いに答える分散フロー

**キャプチャする内容:**

- エンドツーエンドのリクエストフロー
- プロンプトの前処理ステップ
- モデル呼び出しスパン
- ツールと関数呼び出しスパン
- 後処理と検証
- ダウンストリームサービスとの統合
- マルチホップエージェントワークフロー

---

## 戦略的なベストプラクティス

1. **早期にインストルメント化する** — 出荷後ではなく、構築時に可観測性を追加します。OpenTelemetry を使用して、インストルメンテーションをベンダーニュートラルでポータブルにします。
2. **多次元タグ付け** — すべてのメトリクスに次のタグを付けます `model`, `environment`, `application`, `team`、および `region` ディメンションを設定することで、後でコストとパフォーマンスを分析できます。
3. **アラームの前にベースラインを設定** — アラームのしきい値を設定する前に、少なくとも 1 週間本番環境で実行して通常の動作を確立します。ベースラインのないアラームはノイズ疲労を引き起こします。
4. **技術的なメトリクスだけでなくビジネスメトリクスも監視** — レイテンシーとエラー率に加えて、出力品質、ユーザー満足度 (thumbs up/down)、機能あたりのコストを追跡します。
5. **初日から PII を計画** — ログに記録される前に機密データを編集します。自動マスキングには [CloudWatch Logs データ保護ポリシー](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/mask-sensitive-data.html)を使用します。
6. **保持ポリシーを設定** — ログ量は急速に増加します。目的に応じて保持期間を区別します。
   - 運用ログ: 7 日間
   - モデル呼び出し: 30〜90 日間
   - 監査/コンプライアンス: 規制要件に従う (多くの場合 7 年間)
7. **モデルバージョンとプロンプトテンプレートを追跡** — 何かが変更されたときに、その時点で本番環境にあったものと関連付ける必要があります。

---

## AWS における 2 つのデータパイプライン

Amazon CloudWatch は、2 つの補完的なデータパイプラインを通じて GenAI のエンドツーエンドの可観測性を提供します。これらは異なる目的を果たし、異なるデータをキャプチャし、異なる方法で有効化されます。ほとんどの本番環境のセットアップでは、両方が必要です。

![GenAI Telemetry Pipelines](../../images/GenAI/genai-telemetry-pipelines.png)

### パイプライン 1: Bedrock モデル呼び出しログ

すべてのモデル呼び出しに対する生のリクエストとレスポンスをキャプチャする Bedrock レベルのログ記録機能です。これは **Bedrock 専用**であり、Amazon Bedrock 基盤モデルへの呼び出しのみをカバーします。Bedrock 以外のモデル（SageMaker でセルフホストされているモデルや外部プロバイダー）を使用している場合、このパイプラインは適用されません。

**キャプチャする内容:**

| Field | Why it matters |
| --- | --- |
| Full request payload | See exactly what was sent to the model, including system prompt and message history |
| Full response payload | See exactly what the model returned, verbatim |
| Inference parameters (`temperature`, `max_tokens`, `top_p`) | Debug unexpected model behavior — was it called with temp 0.7 or 0.0? |
| Caller IAM identity (role ARN) | Security audit, cost attribution per team/role |
| Bedrock operation type | `InvokeModel`, `Converse`, `ConverseStream` |
| Model version | Exact model ID including suffix (e.g., `cohere.command-r-plus-v1:0`) |
| Token counts | Input and output token counts tied directly to content |

**キャプチャしないもの:**

- エージェントオーケストレーションフロー (どのツールが呼び出されたか、エージェントループの動作)
- クライアント側のレイテンシー
- 分散トレースの相関 (traceId/spanId なし — requestId のみ)
- ツール呼び出しの詳細
- インフラストラクチャコンテキスト
- Bedrock 以外のモデル呼び出し

**サンプルログエントリ:**

```json
{
  "timestamp": "2026-04-17T14:21:50Z",
  "accountId": "123456789012",
  "region": "us-east-1",
  "requestId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "operation": "InvokeModel",
  "modelId": "cohere.command-r-plus-v1:0",
  "input": {
    "inputBodyJson": {
      "message": "Write a short joke about software engineers.",
      "max_tokens": 256,
      "temperature": 0.7
    },
    "inputTokenCount": 8
  },
  "output": {
    "outputBodyJson": {
      "text": "Why did the engineer break up? Because they couldn't commit.",
      "finish_reason": "COMPLETE"
    },
    "outputTokenCount": 20
  },
  "identity": {
    "arn": "arn:aws:sts::123456789012:assumed-role/my-bedrock-role/my-session"
  },
  "schemaType": "ModelInvocationLog"
}
```

**有効化する方法:**

Amazon Bedrock コンソール (または API) を使用した手動のオプトイン。これは、モデルがエージェント、直接 API 呼び出し、SDK、またはその他の方法によって呼び出される場合でも同じ手順です。有効にすると、アカウント全体のすべての Bedrock モデル呼び出しに適用されます。

1. [Amazon Bedrock コンソール](https://console.aws.amazon.com/bedrock/)を開きます
2. **Settings** を選択します
3. **Model invocation logging** で、**Model invocation logging** を選択します
4. ログに含める必要なデータタイプを選択します。ログを CloudWatch Logs のみに送信するか、Amazon S3 と CloudWatch Logs の両方に送信するかを選択します。
5. CloudWatch Logs 設定で、ロググループ名を作成し、適切なサービスロールを選択します
6. **Save settings** を選択します

詳細については、[モデル呼び出し](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/model-invocations.html)および[CloudWatch Logs の送信先の設定](https://docs.aws.amazon.com/bedrock/latest/userguide/model-invocation-logging.html#setup-cloudwatch-logs-destination)を参照してください。

**事前設定されたダッシュボード:**

Model Invocation Logging を有効にすると、CloudWatch は以下を示すダッシュボードを自動的に提供します。

- **呼び出し回数** — Converse、ConverseStream、InvokeModel、InvokeModelWithResponseStream API への成功したリクエストの数
- **呼び出しレイテンシー** — 呼び出しのレイテンシー
- **モデル別トークン数** — モデル別の入力および出力トークン数
- **ModelID 別の日次トークン数** — モデル ID 別の日次合計トークン数
- **入力トークンでグループ化されたリクエスト** — トークン範囲にグループ化されたリクエストの数
- **呼び出しスロットル** — スロットルされた呼び出しの数
- **呼び出しエラー数** — エラーが発生した呼び出しの数

### パイプライン 2: Agent テレメトリ (ADOT SDK 経由)

[AWS Distro for OpenTelemetry (ADOT)](https://aws-otel.github.io/docs/introduction) SDK によってキャプチャされた OpenTelemetry ベースのトレース、スパン、ログ。モデル呼び出しログとは異なり、エージェントテレメトリは Bedrock だけでなく、あらゆるモデルプロバイダー (Bedrock、SageMaker、外部) で動作します。

**キャプチャする内容:**

- **エージェントオーケストレーションフロー** — 呼び出されたツール、その順序、エージェントループの反復
- **モデル呼び出しメタデータ** — モデル ID、トークン数（入力/出力）、レイテンシー、ステータスコード、終了理由
- **ツール実行の詳細** — ツール名、期間、すべてのツール呼び出しの成功/失敗
- **分散トレースの相関** — エンドツーエンドのリクエストトレーシングのための traceId、spanId、parentSpanId
- **セッショントラッキング** — session.id により、複数の呼び出しを単一のユーザーセッションに関連付け
- **プラットフォームと環境のコンテキスト** — cloud.platform、deployment.environment、サービスメタデータ

**キャプチャしないもの:**

- 推論パラメータ (temperature、max_tokens、top_p)
- 呼び出し元の IAM アイデンティティ
- デフォルトで完全なプロンプト/レスポンスコンテンツ (フレームワーク依存 — Strands、LangChain、CrewAI などがサポートされています。その他は異なります)

**サンプルモデル呼び出しスパン** (`aws/spans`):

```json
{
  "resource": {
    "attributes": {
      "deployment.environment.name": "bedrock-agentcore:default",
      "service.name": "MyAgent.DEFAULT",
      "cloud.platform": "aws_bedrock_agentcore",
      "telemetry.sdk.version": "1.40.0"
    }
  },
  "traceId": "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6",
  "spanId": "1a2b3c4d5e6f7a8b",
  "parentSpanId": "9c8d7e6f5a4b3c2d",
  "name": "chat us.anthropic.claude-sonnet-4-6",
  "durationNano": 2644916837,
  "attributes": {
    "gen_ai.request.model": "us.anthropic.claude-sonnet-4-6",
    "gen_ai.usage.input_tokens": 1980,
    "gen_ai.usage.output_tokens": 119,
    "gen_ai.response.finish_reasons": ["tool_use"],
    "http.response.status_code": 200,
    "session.id": "session-a1b2c3d4-e5f6-7890"
  }
}
```

**サンプルツール実行スパン** (`aws/spans`):

```json
{
  "traceId": "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6",
  "spanId": "2b3c4d5e6f7a8b9c",
  "parentSpanId": "d4e5f6a7b8c9d0e1",
  "name": "execute_tool http_request",
  "durationNano": 37505594,
  "attributes": {
    "gen_ai.tool.name": "http_request",
    "gen_ai.tool.status": "success",
    "gen_ai.system": "strands-agents"
  }
}
```

**データの保存先:**

| Log Group | What's in it |
| --- | --- |
| `aws/spans` | OTel trace spans — model calls, tool executions, agent loop iterations |
| `/aws/bedrock-agentcore/runtimes/<agent>` (runtime-logs) | Application stdout/stderr — startup logs, errors, custom app logging |
| `/aws/bedrock-agentcore/runtimes/<agent>` (otel-rt-logs) | OTel log records from agent framework (prompt/response content for supported frameworks) |

**CloudWatch で提供される機能:**

- **Application Signals ダッシュボード** — レイテンシーパーセンタイル、エラー率、スループット
- **Application Maps** — エージェント → モデル → ツール呼び出しチェーンの可視化
- **分散トレーシング** — サービス全体にわたるエンドツーエンドのリクエストトレーシング
- **SLO モニタリング**
- **トレース分析** — 個々のリクエストをエンドツーエンドで詳細に調査
- **インフラストラクチャメトリクスとの相関**

**有効化する方法:**

| Deployment Model | What you do |
| --- | --- |
| Bedrock AgentCore | Nothing — ADOT SDK is baked into the runtime. Telemetry flows automatically. |
| Non-AgentCore (EKS/ECS/self-hosted) | Attach the ADOT auto-instrumentation agent. No code changes needed. |

---

## サイドバイサイド比較

| What you want to know | Model Invocation Logging (Bedrock only) | Agent Telemetry (ADOT) |
| --- | --- | --- |
| Which model was called? | ✅ | ✅ |
| Latency / duration? | ❌ | ✅ (client-side) |
| Token counts? | ✅ | ✅ |
| Error rates / status? | ✅ | ✅ |
| Agent orchestration flow? | ❌ | ✅ |
| Tool call details? | ❌ | ✅ |
| Full prompt text? | ✅ | Framework-dependent |
| Full model response? | ✅ | Framework-dependent |
| Inference parameters? | ✅ | ❌ |
| Caller IAM identity? | ✅ | ❌ |
| Distributed trace correlation? | ❌ | ✅ |
| Works for non-agent Bedrock calls? | ✅ | ❌ |
| Works for non-Bedrock models? | ❌ (Bedrock only) | ✅ |
| Application Signals / Application Maps? | ❌ | ✅ |

Pipeline 2 におけるプロンプト/レスポンスコンテンツのキャプチャは、エージェントフレームワークの OTel インストルメンテーションに依存します。Strands、LangChain、CrewAI がサポートされています。その他のフレームワークは異なる場合があります。

**要約すると:** Agent Telemetry は*エージェントのパフォーマンス*を示します。Model Invocation Logging は*モデルが何を言っているか、誰が尋ねているか*を示します。完全な可観測性を実現するには、両方を有効にしてください。

---

## Agentic ワークロードの可観測性の有効化

開始する前に、[CloudWatch Transaction Search](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Enable-TransactionSearch.html) を有効にして、GenAI の完全なオブザーバビリティエクスペリエンスを利用できるようにします。

### AgentCore Runtime ホスト型エージェント

AgentCore Runtime は、動的な AI エージェントとツールのデプロイとスケーリングのために特別に構築された、安全なサーバーレスランタイムです。LangGraph、CrewAI、Strands Agents を含むあらゆるオープンソースフレームワーク、あらゆるプロトコル、あらゆるモデルをサポートします。

可観測性は組み込まれています。ADOT SDK は AgentCore ランタイムに組み込まれています。メトリクスは自動的に生成され、トレースはコード変更なしで流れます。

- [カスタム可観測性の設定](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability-configure.html#observability-configure-custom)
- [ステップバイステップチュートリアル: AgentCore Runtime でホストされるエージェントの可観測性の有効化](https://aws.github.io/bedrock-agentcore-starter-toolkit/user-guide/observability/quickstart.html#enabling-observability-for-agentcore-runtime-hosted-agents)

### 非 AgentCore ホスト型エージェント (EKS、ECS、セルフホスト型)

AgentCore の外部でエージェントをホストし、オブザーバビリティデータを CloudWatch に取り込むことで、1 つの場所でエンドツーエンドのモニタリングを実現できます。ADOT 自動計装エージェントをワークロードにアタッチします。コード変更は不要です。

- [サードパーティの可観測性を設定する](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability-configure.html#observability-configure-3p)
- [ステップバイステップチュートリアル: AgentCore 以外でホストされるエージェントの可観測性を有効にする](https://aws.github.io/bedrock-agentcore-starter-toolkit/user-guide/observability/quickstart.html#enabling-observability-for-non-agentcore-hosted-agents)

### AgentCore メモリ、ゲートウェイ、および組み込みツールリソース

AgentCore モジュラーサービスのメトリクスとトレースを可視化します。[CloudWatch オブザーバビリティの設定](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability-configure.html#observability-configure-cloudwatch)を参照してください。

### AgentCore 評価

AgentCore Evaluations は、AI エージェントのパフォーマンス、品質、信頼性を監視および評価する機能を提供します。[AgentCore evaluations](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/evaluations.html) を参照してください。

### 有効化の概要

| Component | AgentCore | Non-AgentCore (EKS/ECS) |
| --- | --- | --- |
| Metrics | Automatic | ADOT auto-instrumentation agent |
| Agent traces and spans | Automatic (ADOT baked in) | ADOT auto-instrumentation agent |
| Model Invocation Logging | Manual opt-in via Bedrock console | Manual opt-in via Bedrock console |

両方のパスで真に手動でのオプトインが必要なのは、Model Invocation Logging のみです。それ以外はすべて自動であるか、ADOT 自動計装エージェントをアタッチすることで処理されます。

---

## 機密データの保護

モデル呼び出しをログに記録する際、プロンプトとレスポンスには PII や機密情報が含まれる可能性があります。Amazon CloudWatch Logs は、機械学習とパターンマッチングを使用して機密データを識別およびマスクするデータ保護ポリシーを提供します。

データ保護は 2 つのレベルで設定できます。

### アカウントレベルのデータ保護

1. Amazon CloudWatch コンソールを開きます
2. ナビゲーションペインで、**Settings** を選択します
3. **Logs** タブを選択します
4. **Configure the Data protection account policy** を選択します
5. データに関連するデータ識別子 (マネージド型またはカスタム) を指定します
6. (オプション) 監査結果の送信先 (CloudWatch Logs、Firehose、または S3) を選択します
7. **Activate data protection** を選択します

### ログループレベルのデータ保護

1. Amazon CloudWatch コンソールを開きます
2. ナビゲーションパネルで、**Logs**、**Log Management** を選択します
3. **Log groups** タブを選択し、ログ・グループを選択します (例: `aws/bedrock/modelinvocations`)、**Create data protection policy** を選択します
4. データに関連するデータ識別子を指定します
5. (オプション) 監査結果の送信先を選択します
6. **Activate data protection** を選択します

詳細については、[マスキングによる機密ログデータの保護](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/cloudwatch-logs-data-protection-policies.html)および[機密データの保護](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/mask-sensitive-data.html)を参照してください。

---

## 何をいつ有効にするか

| Scenario | Model Invocation Logging | Agent Telemetry (ADOT) |
| --- | --- | --- |
| Using Bedrock without agents (direct API) | ✅ Only option | ❌ Not applicable |
| Compliance/audit trail of all LLM interactions | ✅ Required | Nice to have |
| Debugging prompt quality or unexpected model outputs | ✅ Required (inference params + content) | Helpful for context |
| Cost attribution per team/role | ✅ Required (IAM identity) | ❌ Cannot do this |
| Building evaluation/fine-tuning pipelines | ✅ Required (structured content) | Framework-dependent |
| Running agents, wants operational dashboards | Nice to have | ✅ Required |
| Latency/error monitoring only | Not needed | ✅ Sufficient |

---

## ダッシュボードの構築

両方のパイプラインが流れるようになったら、さまざまな対象者向けのダッシュボードを構築できます。すぐに使用できるクエリについては、[GenAI テレメトリ用のカスタムダッシュボードの作成](../custom-dashboards-for-genai-telemetry)ガイドを参照してください。

### 対象者別のダッシュボード階層

**エグゼクティブダッシュボード** — 高レベルの KPI

- 1 日あたりの合計コスト
- リクエストボリュームのトレンド
- エラー率
- 使用量別の上位モデル

**DevOps ダッシュボード** — リアルタイム監視

- 停止理由の内訳 (end_turn vs tool_use vs max_tokens)
- 完了率と切り捨て傾向
- エージェントトレース vs エラー (時間別)
- スパンエラーのドリルダウン
- コンポーネントパフォーマンスの内訳 (P50/P95/P99)
- クロスリージョン推論レイテンシー

**FinOps ダッシュボード** — コスト管理

- 総支出 (時間別、日別、月別)
- モデル別のコスト分布
- ロール/ユーザー別の上位 10 位の支出者
- 入力コストと出力コストの内訳
- プロンプトキャッシュの機会
- 異常検知を含む日次コスト傾向

**開発者ダッシュボード** — デバッグと最適化

- リクエストトレース
- 機能別のトークン使用量
- レイテンシーの内訳
- スタックトレース付きのエラー詳細
- トークン効率 (高入力、低出力の無駄検出)

### サンプル DevOps クエリ: 完了率

成功した完了と切り捨てられたレスポンスの時間ごとの比率を追跡します。目標は 95% 以上の完了率です。

```text
fields @timestamp, modelId,
       output.outputBodyJson.stopReason as stop_reason
| filter schemaType = "ModelInvocationLog"
| filter ispresent(output.outputBodyJson.stopReason)
| stats sum(stop_reason = "end_turn" or stop_reason = "tool_use") as ok,
        sum(stop_reason = "max_tokens") as truncated
  by bin(@timestamp, 1h) as hour
| sort hour desc
```

### サンプル FinOps クエリ: ロール別の上位支出者

```text
SOURCE "bedrock-model-invocation-logging"
| filter @logStream = 'aws/bedrock/modelinvocations'
| fields replace(`identity.arn`, "arn:aws:sts::ACCOUNT_ID:assumed-role/", "") as userRole
| stats sum(totalCostUSD) as spend, count(*) as invocations
  by userRole
| sort spend desc
| limit 10
```

コスト計算の詳細と他の例については、[ダッシュボードクエリガイド](../custom-dashboards-for-genai-telemetry)を参照してください。

---

## アラート戦略

緊急性と影響度に応じた階層でアラートを設定します。

### クリティカルアラート (即座にページング)

- エラー率が 5% を超える
- P95 レイテンシーが 10 秒を超える
- 日次コストがベースラインの 150% を超える
- モデルが利用不可
- エージェントのエラー率が 15 分間 10% を超える

### 警告アラート (営業時間中に調査)

- トークン使用量が前週比で 20% 増加傾向
- 7 日間にわたるレイテンシーの低下
- キャッシュヒット率の低下
- 異常なリクエストパターン
- 2 時間にわたり完了率が 95% を下回る
- コンポーネントの P95 が 5000ms を超える

### 情報アラート (日次ダイジェスト)

- 日々のコスト概要
- 週次使用状況レポート
- モデルパフォーマンス比較
- 上位支出者レポート

### アラートルーティングの例

```yaml
route:
  group_by: ['alertname', 'cloud_provider']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h
  receiver: 'default'
  routes:
    - match:
        severity: critical
      receiver: 'pagerduty'
    - match:
        severity: warning
      receiver: 'slack-ops'
    - match:
        alertname: MonthlyBudgetExceeded
      receiver: 'slack-finops'
```

---

## オブザーバビリティ成熟度モデル

**レベル 1: 基本的なモニタリング**

- リクエスト数とエラーを追跡
- 基本的なレイテンシーメトリクス
- 手動コスト追跡

**レベル 2: 包括的なメトリクス**

- トークンレベルの追跡
- 多次元メトリクス (モデル、チーム、環境)
- 自動化されたダッシュボード
- ベースラインを使用した基本的なアラート

**レベル 3: 高度な分析**

- エージェントワークフロー全体にわたる分散トレーシング
- チーム/機能ごとのコスト配分
- 品質スコアリングとユーザーフィードバックの統合
- トレンドに基づく予測アラート

**レベル 4: AI を活用したオブザーバビリティ**

- コストと動作の異常検出
- 自動化されたルート原因分析
- 自己修復システム (より安価なモデルへの自動フォールバック)
- 継続的な最適化ループ

---

## MLOps との統合

可観測性は、本番環境だけでなく、ML ライフサイクル全体に拡張する必要があります。

**トレーニングフェーズ:**

- トレーニングコストと期間の追跡
- モデル品質メトリクスの監視
- モデルとプロンプトのバージョン管理

**デプロイフェーズ:**

- メトリクス比較を使用した Canary デプロイメント
- Blue-green デプロイメントの監視
- オブザーバビリティシグナルに基づくロールバックトリガー

**本番フェーズ:**

- 継続的なモニタリング
- ドリフト検出に基づく自動再トレーニングトリガー
- パフォーマンス低下の検出

**最適化フェーズ:**

- プロンプトとモデルの A/B テストフレームワーク
- コストパフォーマンスのトレードオフ分析
- プロンプトエンジニアリングのフィードバックループ

---

## 避けるべき一般的なアンチパターン

1. **PII 編集なしでプロンプトとレスポンス全体をログに記録する** — コンプライアンス違反、データ侵害のリスク。Model Invocation Logging を有効にする*前に*データ保護ポリシーを設定してください。
2. **集計メトリクスのみを追跡する** — リクエストごとの詳細がないと、個々の問題をデバッグしたり、コストを帰属させたりすることができません。
3. **ベースラインなしでアラートを設定する** — 誤検知によるアラート疲労。常に最初に正常な動作を確立してください。
4. **請求書が届くまでトークン使用量を無視する** — 請求書を確認する頃には、すでに手遅れです。毎日監視してください。
5. **プロバイダーごとに異なるメトリクス名を使用する** — モデル間でパフォーマンスを比較できません。OpenTelemetry GenAI セマンティック規約に標準化してください。
6. **テレメトリデータを無期限に保存する** — コンプライアンスの問題と不要なストレージコスト。データクラスごとに保持ポリシーを設定してください。
7. **手動でダッシュボードを作成する** — 一貫性のなさとメンテナンスの負担。ダッシュボードには Infrastructure as Code を使用してください。
8. **技術的なメトリクスのみを監視する** — 品質とビジネスへの影響に関する問題を見逃します。レイテンシーと並行してユーザー満足度を追跡してください。

---

## 開始チェックリスト

### プレプロダクション

- [ ] CloudWatch Transaction Search を有効化
- [ ] AgentCore の場合: エージェントをデプロイ — テレメトリは自動的に流れます
- [ ] 非 AgentCore の場合: ADOT 自動計装エージェントをアタッチ
- [ ] Bedrock コンソールから Bedrock Model Invocation Logging を有効化
- [ ] PII 編集のためのデータ保護ポリシーを設定
- [ ] 各ロググループのログ保持ポリシーを設定
- [ ][ダッシュボードクエリガイド](../custom-dashboards-for-genai-telemetry)を使用して初期ダッシュボードを構築
- [ ] ベースラインメトリクス (レイテンシー、トークン使用量、コスト) を文書化
- [ ] 適切なしきい値でアラームを設定
- [ ] 一般的な問題に対するランブックを作成

### 本番環境

- [ ] 本番環境で監視が有効化されている
- [ ] アラートが正しいチャネルにルーティングされている (PagerDuty、Slack)
- [ ] チームアクセスが設定されている (ステークホルダー向けの読み取り専用ダッシュボード)
- [ ] バックアップとディザスタリカバリがテストされている
- [ ] 定期的なレビュースケジュールが確立されている (週次コストレビュー、月次パフォーマンスレビュー)

---

## その他のリソース

### コンパニオンガイド

- [GenAI テレメトリ用のカスタムダッシュボードの作成](../custom-dashboards-for-genai-telemetry) — テレメトリを DevOps、FinOps、その他の関係者向けのペルソナベースのダッシュボードに変換します

### AWS ドキュメント

- [モデル呼び出し — CloudWatch GenAI Observability](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/model-invocations.html)
- [AgentCore Observability の開始方法](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AgentCore-GettingStarted.html)
- [Bedrock モデル呼び出しログの設定](https://docs.aws.amazon.com/bedrock/latest/userguide/model-invocation-logging.html#setup-cloudwatch-logs-destination)
- [CloudWatch Logs での機密データの保護](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/mask-sensitive-data.html)
- [AgentCore のカスタム Observability の設定](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability-configure.html#observability-configure-custom)
- [サードパーティ Observability の設定](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability-configure.html#observability-configure-3p)
- [AgentCore 評価](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/evaluations.html)

### 標準とツール

- [AWS Distro for OpenTelemetry (ADOT)](https://aws-otel.github.io/docs/introduction)
- [OpenTelemetry GenAI セマンティック規約](https://opentelemetry.io/docs/specs/semconv/gen-ai/)
- [OpenTelemetry 仕様](https://opentelemetry.io/docs/)

---

**貢献者:** AWS Observability Team
**最終更新日:** 2026-04-21
