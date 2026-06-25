# AWS における GenAI オブザーバビリティ

## 概要

ジェネレーティブ AI ワークロードは、従来のアプリケーションとは異なる特性を持っており、初日からオブザーバビリティが不可欠です。レスポンスは非決定論的であり、レイテンシーはプロンプトの複雑さによって大きく変動し、コストはトークン使用量に直接結びついており、単一のエージェント呼び出しが数秒以内に Bedrock、S3、Lambda、KMS をまたいで数十の API 呼び出しを連鎖させることがあります。

適切なオブザーバビリティがなければ、チームは予測可能な問題に直面します。

- **コスト超過** — トークン使用量が追跡されないと、予期しない請求が発生します。暴走したエージェントループ 1 つで、数分のうちに数百ドルを消費する可能性があります。
- **パフォーマンスの低下** — 応答が遅いとユーザーエクスペリエンスに影響し、把握できない問題は修正できません。エージェントワークフローは、モデル呼び出しが成功している一方で、オーケストレーションレイヤーでサイレントに失敗することがあります。
- **品質のギャップ** — エラー、ハルシネーション、予期しない出力は、ユーザーが苦情を言うまで検出されません。
- **コンプライアンスおよび監査リスク** — モデルが何を返したか、どのパラメータを使用したか、どの IAM ロールが要求したかの記録が残りません。

このガイドでは、AWS 上の GenAI ワークロードを監視するための戦略、AWS 実装、有効化パターン、およびダッシュボード設計について説明します。同じテレメトリをもとに DevOps、FinOps、その他のステークホルダー向けのペルソナベースのダッシュボードを作成する方法を示すコンパニオンガイド「[GenAI テレメトリのカスタムダッシュボードの作成](../custom-dashboards-for-genai-telemetry)」と合わせてご活用ください。

---

## GenAI オブザーバビリティが異なる理由

### 固有の課題

**非決定論的な動作** — 同じ入力が異なる出力を生成する可能性があります。従来の「正しい値を返したか」というテストは適用できません。成功/失敗だけでなく、品質メトリクスが必要です。

**可変レイテンシー** — レスポンス時間は、プロンプトの複雑さ、出力の長さ、モデルの負荷、およびクロスリージョンルーティングによって異なります。P50 と P95 は、従来の API よりもはるかに大きく乖離します。

**トークンベースの料金** — コストはリクエスト数だけでなく、使用パターンに応じてスケールします。平均プロンプト長がわずかに増加するだけで、月額料金が 2 倍になる可能性があります。

**マルチサービスの複雑さ** — エージェントは複数の AWS サービスにわたって API 呼び出しをチェーンします。単一のログソースだけでは全体像を把握できません。

**迅速なイテレーション** — モデルとプロンプトは頻繁に変更されます。オブザーバビリティは、モデルのバージョン、プロンプトテンプレート、および設定の変更を時系列で追跡する必要があります。

### ビジネスへの影響

オブザーバビリティを後回しにしている組織は、通常これらのパターンを事後に発見します。

- 月次 Bedrock 予算の 80% を消費する、チューニングされていない単一のプロンプト
- モデルのメトリクスは正常に見えるにもかかわらず、ツールレイヤーで失敗するエージェントワークフロー
- 事前にリダクションが設定されていなかったために、ログに漏洩する PII
- チームタグが適用されていないために、コスト配分が不可能な状況

早期にオブザーバビリティを適切に設定することで、後から高コストな改修を防ぐことができます。

---

## GenAI のコアピラー

### メトリクス

「私の AI はどのように機能しているか？」という問いに答えるオペレーショナルテレメトリ

**追跡すべき重要なメトリクス:**

- **トークン使用量** — リクエストごとの入力トークン、リクエストごとの出力トークン、モデルおよびユーザー別の合計トークン、トークンコスト計算
- **レイテンシー** — 最初のトークンまでの時間 (TTFT)、合計レスポンス時間、P50/P95/P99 パーセンタイル、モデルおよびリージョン別のレイテンシー
- **リクエスト量** — 秒/分/時間あたりのリクエスト数、成功率とエラー率、同時リクエスト数
- **コスト** — リクエストごとのコスト、モデル/ユーザー/チーム別のコスト、日次/月次トレンド、コスト効率 (1 ドルあたりの出力トークン数)

### ログ

「私の AI は何を言い、誰に対して言ったのか？」という問いに答えるコンテンツとコンテキスト

**何をログに記録するか：**

- リクエスト/レスポンスのペア（PII 削除あり）
- プロンプトテンプレートと変数
- モデルパラメータ（temperature、max_tokens、top_p）
- エラーメッセージとスタックトレース
- ユーザーコンテキストとセッション ID
- A/B テストのバリアント

**ログレベル：**

- `DEBUG` — 詳細なプロンプトエンジニアリングの反復
- `INFO` — メタデータを含む成功したリクエスト
- `WARN` — リトライ、フォールバック、レート制限
- `ERROR` — 障害、タイムアウト、無効なレスポンス

### トレース

「リクエストがシステムをどのように移動したか？」という問いに答える分散フロー

**キャプチャする内容：**

- エンドツーエンドのリクエストフロー
- プロンプトの前処理ステップ
- モデル呼び出しスパン
- ツールおよび関数呼び出しスパン
- 後処理と検証
- ダウンストリームサービスとの統合
- マルチホップエージェントワークフロー

---

## 戦略的ベストプラクティス

1. **早期にインストルメント化する** — 出荷後ではなく、構築時にオブザーバビリティを追加します。インストルメンテーションがベンダー中立でポータブルになるよう、OpenTelemetry を使用してください。
2. **多次元タグ付け** — すべてのメトリクスに以下のタグを付けます。 `model`, `environment`, `application`, `team`、および `region` ディメンションを設定しておくことで、後からコストとパフォーマンスをスライスして分析できます。
3. **アラームを設定する前にベースラインを確立する** — アラームのしきい値を設定する前に、少なくとも 1 週間は本番環境で実行して通常の動作を確立してください。ベースラインのないアラームはノイズ疲労を引き起こします。
4. **技術的なメトリクスだけでなくビジネスメトリクスも監視する** — レイテンシやエラー率と並行して、出力品質、ユーザー満足度（高評価/低評価）、機能あたりのコストを追跡してください。
5. **最初から PII を考慮する** — ログが保存される前に機密データを削除してください。自動マスキングには [CloudWatch Logs のデータ保護ポリシー](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/mask-sensitive-data.html) を使用してください。
6. **保持ポリシーを設定する** — ログのボリュームは急速に増加します。目的に応じて保持期間を区別してください。
   - 運用ログ: 7 日間
   - モデル呼び出し: 30〜90 日間
   - 監査/コンプライアンス: 規制要件に従う（多くの場合 7 年間）
7. **モデルバージョンとプロンプトテンプレートを追跡する** — 何かが変更された場合、その時点で本番環境に何があったかと関連付ける必要があります。

---

## AWS における 2 つのデータパイプライン

Amazon CloudWatch は、2 つの補完的なデータパイプラインを通じて GenAI のエンドツーエンドの可観測性を提供します。これらはそれぞれ異なる目的を持ち、異なるデータをキャプチャし、異なる方法で有効化されます。ほとんどの本番環境のセットアップでは、両方が必要です。

![GenAI Telemetry Pipelines](../../../images/GenAI/genai-telemetry-pipelines.png)

### パイプライン 1: Bedrock モデル呼び出しログ {#pipeline-1-bedrock-model-invocation-logging}

すべてのモデル呼び出しに対して生のリクエストとレスポンスをキャプチャする Bedrock レベルのロギング機能です。これは **Bedrock 専用**であり、Amazon Bedrock ファウンデーションモデルへの呼び出しのみを対象としています。Bedrock 以外のモデル（SageMaker 上でセルフホスト、外部プロバイダーなど）を使用している場合、このパイプラインは適用されません。

**キャプチャされる内容：**

| フィールド | 重要な理由 |
| --- | --- |
| 完全なリクエストペイロード | システムプロンプトとメッセージ履歴を含め、モデルに何が送信されたかを正確に確認できます |
| 完全なレスポンスペイロード | モデルが返した内容をそのまま正確に確認できます |
| 推論パラメータ (`temperature`, `max_tokens`, `top_p`) | 予期しないモデルの動作をデバッグ — temp 0.7 で呼び出されたのか 0.0 で呼び出されたのか？ |
| 呼び出し元の IAM アイデンティティ (ロール ARN) | セキュリティ監査、チーム/ロールごとのコスト配分 |
| Bedrock オペレーションタイプ | `InvokeModel`, `Converse`, `ConverseStream` |
| モデルバージョン | サフィックスを含む正確なモデル ID (例: `cohere.command-r-plus-v1:0`) |
| トークン数 | コンテンツに直接紐付けられた入力および出力トークン数 |

**キャプチャされないもの：**

- エージェントオーケストレーションフロー（どのツールが呼び出されたか、エージェントループの動作）
- クライアント側のレイテンシー
- 分散トレースの相関（traceId/spanId なし — requestId のみ）
- ツール呼び出しの詳細
- インフラストラクチャのコンテキスト
- Bedrock 以外のモデル呼び出し

**サンプルログエントリ：**

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

**有効にする方法：**

Amazon Bedrock コンソール（または API）を使用した手動オプトイン。これは、モデルがエージェント、直接 API 呼び出し、SDK、またはその他の方法で呼び出される場合でも同じ手順です。一度有効にすると、アカウント全体のすべての Bedrock モデル呼び出しに適用されます。

1. [Amazon Bedrock コンソール](https://console.aws.amazon.com/bedrock/)を開きます。
2. **Settings** を選択します。
3. **Model invocation logging** の下で、**Model invocation logging** を選択します。
4. ログに含める必要なデータタイプを選択します。ログを CloudWatch Logs のみに送信するか、Amazon S3 と CloudWatch Logs の両方に送信するかを選択します。
5. CloudWatch Logs の設定で、ロググループ名を作成し、適切なサービスロールを選択します。
6. **Save settings** を選択します。

詳細については、[モデル呼び出し](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/model-invocations.html)および[CloudWatch Logs の送信先の設定](https://docs.aws.amazon.com/bedrock/latest/userguide/model-invocation-logging.html#setup-cloudwatch-logs-destination)を参照してください。

**事前設定済みダッシュボード：**

モデル呼び出しログを有効にすると、CloudWatch は以下を示すダッシュボードを自動的に提供します。

- **呼び出し回数** — Converse、ConverseStream、InvokeModel、および InvokeModelWithResponseStream API への成功したリクエストの数
- **呼び出しレイテンシー** — 呼び出しのレイテンシー
- **モデル別トークン数** — モデル別の入力および出力トークン数
- **モデル ID 別の日次トークン数** — モデル ID 別の日次合計トークン数
- **入力トークン別にグループ化されたリクエスト** — トークン範囲にグループ化されたリクエスト数
- **呼び出しスロットル** — スロットルされた呼び出しの数
- **呼び出しエラー数** — エラーが発生した呼び出しの数

### パイプライン 2: エージェントテレメトリ (ADOT SDK 経由)

[AWS Distro for OpenTelemetry (ADOT)](https://aws-otel.github.io/docs/introduction) SDK によってキャプチャされた OpenTelemetry ベースのトレース、スパン、およびログです。Model Invocation Logging とは異なり、Agent Telemetry は Bedrock だけでなく、任意のモデルプロバイダー（Bedrock、SageMaker、外部）と連携します。

**キャプチャされる内容：**

- **エージェントオーケストレーションフロー** — 呼び出されたツール、その順序、エージェントループの反復
- **モデル呼び出しメタデータ** — モデル ID、トークン数（入力/出力）、レイテンシ、ステータスコード、終了理由
- **ツール実行の詳細** — すべてのツール呼び出しにおけるツール名、実行時間、成功/失敗
- **分散トレースの相関** — エンドツーエンドのリクエストトレーシング全体のための traceId、spanId、parentSpanId
- **セッション追跡** — session.id により複数の呼び出しを単一のユーザーセッションに紐付け
- **プラットフォームおよび環境コンテキスト** — cloud.platform、deployment.environment、サービスメタデータ

**キャプチャされないもの：**

- 推論パラメータ（temperature、max_tokens、top_p）
- 呼び出し元の IAM アイデンティティ
- デフォルトでは完全なプロンプト/レスポンスのコンテンツ（フレームワーク依存 — Strands、LangChain、CrewAI などがサポートされており、その他は異なります）

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

**ツール実行スパンのサンプル** (`aws/spans`):

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

**データの格納先：**

| ロググループ | 含まれる内容 |
| --- | --- |
| `aws/spans` | OTel トレーススパン — モデル呼び出し、ツール実行、エージェントループの反復 |
| `/aws/bedrock-agentcore/runtimes/<agent>` (runtime-logs) | アプリケーションの stdout/stderr — 起動ログ、エラー、カスタムアプリログ |
| `/aws/bedrock-agentcore/runtimes/<agent>` (otel-rt-logs) | エージェントフレームワークからの OTel ログレコード（サポートされているフレームワークのプロンプト/レスポンスコンテンツ） |

**CloudWatch での活用内容:**

- **Application Signals ダッシュボード** — レイテンシーパーセンタイル、エラーレート、スループット
- **Application Maps** — エージェント → モデル → ツール呼び出しチェーンの可視化
- **分散トレーシング** — サービス間のエンドツーエンドリクエストトレーシング
- **SLO モニタリング**
- **トレース分析** — 個々のリクエストのエンドツーエンドの詳細分析
- **インフラストラクチャメトリクスとの相関**

**有効にする方法：**

| デプロイモデル | 実施内容 |
| --- | --- |
| Bedrock AgentCore | 何もする必要はありません — ADOT SDK はランタイムに組み込まれています。テレメトリは自動的に流れます。 |
| Non-AgentCore (EKS/ECS/セルフホスト型) | ADOT 自動インストルメンテーションエージェントをアタッチします。コードの変更は不要です。 |

---

## 並列比較

| 知りたいこと | Model Invocation Logging (Bedrock のみ) | Agent Telemetry (ADOT) |
| --- | --- | --- |
| どのモデルが呼び出されたか？ | ✅ | ✅ |
| レイテンシー/所要時間？ | ❌ | ✅ (クライアント側) |
| トークン数？ | ✅ | ✅ |
| エラー率/ステータス？ | ✅ | ✅ |
| エージェントオーケストレーションフロー？ | ❌ | ✅ |
| ツール呼び出しの詳細？ | ❌ | ✅ |
| 完全なプロンプトテキスト？ | ✅ | フレームワーク依存 |
| 完全なモデルレスポンス？ | ✅ | フレームワーク依存 |
| 推論パラメータ？ | ✅ | ❌ |
| 呼び出し元の IAM アイデンティティ？ | ✅ | ❌ |
| 分散トレースの相関？ | ❌ | ✅ |
| エージェント以外の Bedrock 呼び出しで機能するか？ | ✅ | ❌ |
| Bedrock 以外のモデルで機能するか？ | ❌ (Bedrock のみ) | ✅ |
| Application Signals / Application Maps？ | ❌ | ✅ |

Pipeline 2 におけるプロンプト/レスポンスコンテンツのキャプチャは、エージェントフレームワークの OTel インストルメンテーションに依存します。Strands、LangChain、および CrewAI がサポートされており、その他のフレームワークは異なる場合があります。

**まとめ:** Agent Telemetry はエージェントのパフォーマンスを示します。Model Invocation Logging はモデルが何を言っているか、誰が質問しているかを示します。完全な可観測性を実現するには、両方を有効にしてください。

---

## エージェント型ワークロードのオブザーバビリティの有効化 {#enabling-observability-for-agentic-workloads}

始める前に、完全な GenAI オブザーバビリティエクスペリエンスを利用するために、[CloudWatch Transaction Search](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Enable-TransactionSearch.html) を有効にしてください。

### AgentCore Runtime ホスト型エージェント

AgentCore Runtime は、動的な AI エージェントとツールのデプロイおよびスケーリングのために特別に構築された、セキュアでサーバーレスのランタイムです。LangGraph、CrewAI、Strands Agents などのオープンソースフレームワーク、あらゆるプロトコル、およびあらゆるモデルをサポートしています。

オブザーバビリティは組み込み済みです — ADOT SDK は AgentCore ランタイムに組み込まれています。メトリクスは自動的に生成され、コードを変更することなくトレースが流れます。

- [カスタムオブザーバビリティの設定](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability-configure.html#observability-configure-custom)
- [ステップバイステップチュートリアル: AgentCore Runtime ホスト型エージェントのオブザーバビリティを有効にする](https://aws.github.io/bedrock-agentcore-starter-toolkit/user-guide/observability/quickstart.html#enabling-observability-for-agentcore-runtime-hosted-agents)

### Non-AgentCore ホスト型エージェント (EKS、ECS、セルフホスト型)

エージェントを AgentCore の外部でホストし、オブザーバビリティデータを CloudWatch に取り込むことで、1 か所でエンドツーエンドのモニタリングを実現できます。ADOT 自動インストルメンテーションエージェントをワークロードにアタッチするだけで、コードの変更は不要です。

- [サードパーティの観測可能性を設定する](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability-configure.html#observability-configure-3p)
- [ステップバイステップのチュートリアル: AgentCore でホストされていないエージェントの観測可能性を有効にする](https://aws.github.io/bedrock-agentcore-starter-toolkit/user-guide/observability/quickstart.html#enabling-observability-for-non-agentcore-hosted-agents)

### AgentCore のメモリ、ゲートウェイ、および組み込みツールリソース

AgentCore モジュラーサービスのメトリクスとトレースを可視化します。[CloudWatch オブザーバビリティの設定](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability-configure.html#observability-configure-cloudwatch)を参照してください。

### AgentCore Evaluations

AgentCore Evaluations は、AI エージェントのパフォーマンス、品質、および信頼性を監視・評価する機能を提供します。詳細については、[AgentCore evaluations](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/evaluations.html) を参照してください。

### 有効化の概要

| コンポーネント | AgentCore | Non-AgentCore (EKS/ECS) |
| --- | --- | --- |
| メトリクス | 自動 | ADOT 自動インストルメンテーションエージェント |
| エージェントのトレースとスパン | 自動 (ADOT 組み込み) | ADOT 自動インストルメンテーションエージェント |
| Model Invocation Logging | Bedrock コンソールから手動オプトイン | Bedrock コンソールから手動オプトイン |

両方のパスで手動のオプトインが真に必要なのは、モデル呼び出しログ記録のみです。それ以外はすべて、自動で行われるか、ADOT 自動インストルメンテーションエージェントをアタッチすることで処理されます。

---

## 機密データの保護

モデルの呼び出しをログに記録する際、プロンプトとレスポンスには PII や機密情報が含まれる場合があります。Amazon CloudWatch Logs は、機械学習とパターンマッチングを使用して機密データを識別およびマスクするためのデータ保護ポリシーを提供しています。

データ保護は 2 つのレベルで設定できます。

### アカウントレベルのデータ保護

1. Amazon CloudWatch コンソールを開きます
2. ナビゲーションペインで、**設定**を選択します
3. **ログ**タブを選択します
4. **データ保護アカウントポリシーの設定**を選択します
5. データに関連するデータ識別子を指定します（マネージドまたはカスタム）
6. （オプション）監査結果の送信先を選択します（CloudWatch Logs、Firehose、または S3）
7. **データ保護を有効化**を選択します

### ロググループレベルのデータ保護

1. Amazon CloudWatch コンソールを開きます
2. ナビゲーションパネルで、**Logs**、**Log Management** を選択します
3. **Log groups** タブを選択し、ロググループを選択します（例： `aws/bedrock/modelinvocations`)、**データ保護ポリシーの作成**を選択します。
4. データに関連するデータ識別子を指定します。
5. (オプション) 監査結果の送信先を選択します。
6. **データ保護のアクティブ化**を選択します。

詳細については、[機密ログデータのマスキングによる保護](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/cloudwatch-logs-data-protection-policies.html)および[機密データの保護](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/mask-sensitive-data.html)を参照してください。

---

## いつ何を有効にするか

| シナリオ | Model Invocation Logging | Agent Telemetry (ADOT) |
| --- | --- | --- |
| エージェントなしで Bedrock を使用 (直接 API) | ✅ 唯一の選択肢 | ❌ 該当なし |
| すべての LLM インタラクションのコンプライアンス/監査証跡 | ✅ 必須 | あると便利 |
| プロンプト品質や予期しないモデル出力のデバッグ | ✅ 必須 (推論パラメータ + コンテンツ) | コンテキストに役立つ |
| チーム/ロールごとのコスト配分 | ✅ 必須 (IAM アイデンティティ) | ❌ できない |
| 評価/ファインチューニングパイプラインの構築 | ✅ 必須 (構造化されたコンテンツ) | フレームワーク依存 |
| エージェントの実行、運用ダッシュボードが必要 | あると便利 | ✅ 必須 |
| レイテンシー/エラー監視のみ | 不要 | ✅ 十分 |

---

## ダッシュボードの構築

両方のパイプラインが稼働したら、さまざまなオーディエンス向けのダッシュボードを構築できます。すぐに使えるクエリについては、[GenAI テレメトリのカスタムダッシュボードの作成](../custom-dashboards-for-genai-telemetry)ガイドを参照してください。

### 対象者別ダッシュボード階層

**エグゼクティブダッシュボード** — 高レベル KPI：

- 1 日あたりの合計コスト
- リクエスト量のトレンド
- エラーレート
- 使用量上位のモデル

**DevOps ダッシュボード** — リアルタイムモニタリング：

- 停止理由の内訳（end_turn vs tool_use vs max_tokens）
- 完了率と切り捨てのトレンド
- エージェントトレースとエラー（時間別）
- スパンエラーのドリルダウン
- コンポーネントパフォーマンスの内訳（P50/P95/P99）
- クロスリージョン推論のレイテンシ

**FinOps ダッシュボード** — コスト管理：

- 合計支出（時間別、日別、月別）
- モデル別のコスト分布
- ロール/ユーザー別の上位 10 件の支出者
- 入力コストと出力コストの内訳
- プロンプトキャッシュの活用機会
- 異常検知を含む日別コストトレンド

**開発者ダッシュボード** — デバッグと最適化：

- リクエストトレース
- 機能別トークン使用量
- レイテンシーの内訳
- スタックトレースを含むエラーの詳細
- トークン効率（高入力、低出力の無駄検出）

### DevOps クエリのサンプル: 完了率

切り捨てられたレスポンスに対する成功した完了の時間ごとの比率を追跡します。完了率 95% 以上を目標とします。

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

### FinOps クエリのサンプル: ロール別トップスペンダー

```text
SOURCE "bedrock-model-invocation-logging"
| filter @logStream = 'aws/bedrock/modelinvocations'
| fields replace(`identity.arn`, "arn:aws:sts::ACCOUNT_ID:assumed-role/", "") as userRole
| stats sum(totalCostUSD) as spend, count(*) as invocations
  by userRole
| sort spend desc
| limit 10
```

完全なコスト計算とその他の例については、[ダッシュボードクエリガイド](../custom-dashboards-for-genai-telemetry)を参照してください。

---

## アラート戦略

緊急度と影響度に合わせた階層でアラートを設定します。

### クリティカルアラート（即時ページング）

- エラーレートが 5% を超えている
- P95 レイテンシーが 10 秒を超えている
- 日次コストがベースラインの 150% を超えている
- モデルが利用不可
- エージェントのエラーレートが 15 分間で 10% を超えている

### 警告アラート（営業時間内に調査）

- トークン使用量が週次で 20% 増加傾向
- 7 日間にわたるレイテンシーの低下
- キャッシュヒット率の低下
- 異常なリクエストパターン
- 2 時間にわたる完了率が 95% 未満
- コンポーネント P95 が 5000ms を超過

### 情報アラート（日次ダイジェスト）

- 日次コスト概要
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

**レベル 1: 基本モニタリング**

- リクエスト数とエラーの追跡
- 基本的なレイテンシーメトリクス
- 手動コスト追跡

**レベル 2: 包括的なメトリクス**

- トークンレベルのトラッキング
- 多次元メトリクス（モデル、チーム、環境）
- 自動化されたダッシュボード
- ベースラインを使用した基本的なアラート

**レベル 3: 高度な分析**

- エージェントワークフロー全体にわたる分散トレーシング
- チーム/機能ごとのコスト配分
- 品質スコアリングとユーザーフィードバックの統合
- トレンドに基づく予測アラート

**レベル 4: AI を活用したオブザーバビリティ**

- コストと動作の異常検知
- 自動化された根本原因分析
- 自己修復システム（より安価なモデルへの自動フォールバック）
- 継続的な最適化ループ

---

## MLOps との統合

オブザーバビリティは、本番環境だけでなく、ML ライフサイクル全体にわたって拡張される必要があります。

**トレーニングフェーズ：**

- トレーニングのコストと所要時間を追跡する
- モデル品質メトリクスを監視する
- モデルとプロンプトのバージョン管理を行う

**デプロイフェーズ：**

- メトリクス比較を使用したカナリアデプロイ
- ブルーグリーンデプロイのモニタリング
- オブザーバビリティシグナルに基づくロールバックトリガー

**本番フェーズ：**

- 継続的なモニタリング
- ドリフト検出に基づく自動再トレーニングトリガー
- パフォーマンス低下の検出

**最適化フェーズ：**

- プロンプトとモデルの A/B テストフレームワーク
- コストとパフォーマンスのトレードオフ分析
- プロンプトエンジニアリングのフィードバックループ

---

## 避けるべき一般的なアンチパターン

1. **PII 削除なしでプロンプトと応答を完全にログに記録する** — コンプライアンス違反、データ漏洩リスク。Model Invocation Logging を有効にする*前に*、データ保護ポリシーを設定してください。
2. **集計メトリクスのみを追跡する** — リクエストごとの詳細がなければ、個別の問題をデバッグしたりコストを帰属させたりすることができません。
3. **ベースラインなしでアラートを設定する** — 誤検知によるアラート疲れが発生します。まず通常の動作を確立してください。
4. **請求書が届くまでトークン使用量を無視する** — 請求書を確認する頃には、すでに損害が発生しています。毎日監視してください。
5. **プロバイダーごとに異なるメトリクス名を使用する** — モデル間でパフォーマンスを比較できません。OpenTelemetry GenAI セマンティック規約に標準化してください。
6. **テレメトリデータを無期限に保存する** — コンプライアンス上の問題と不要なストレージコストが発生します。データクラスごとに保持ポリシーを設定してください。
7. **ダッシュボードを手動で作成する** — 一貫性の欠如とメンテナンスの負担が生じます。ダッシュボードには Infrastructure as Code を使用してください。
8. **技術的なメトリクスのみを監視する** — 品質やビジネスへの影響に関する問題を見逃します。レイテンシーと並行してユーザー満足度を追跡してください。

---

## はじめにチェックリスト

### プリプロダクション

- [ ] CloudWatch Transaction Search を有効化する
- [ ] AgentCore の場合: エージェントをデプロイする — テレメトリは自動的に流れます
- [ ] AgentCore 以外の場合: ADOT 自動インストルメンテーションエージェントをアタッチする
- [ ] Bedrock コンソールから Bedrock Model Invocation Logging を有効化する
- [ ] PII 削除のためのデータ保護ポリシーを設定する
- [ ] 各ロググループのログ保持ポリシーを設定する
- [ ] 初期ダッシュボードを[ダッシュボードクエリガイド](../custom-dashboards-for-genai-telemetry)を使用して構築する
- [ ] ベースラインメトリクス（レイテンシー、トークン使用量、コスト）を記録する
- [ ] 適切なしきい値でアラームを設定する
- [ ] 一般的な問題に対するランブックを作成する

### 本番環境

- [ ] 本番環境でモニタリングが有効化されている
- [ ] アラートが正しいチャンネル（PagerDuty、Slack）にルーティングされている
- [ ] チームアクセスが設定されている（ステークホルダー向けの読み取り専用ダッシュボード）
- [ ] バックアップとディザスタリカバリがテスト済みである
- [ ] 定期的なレビュースケジュールが確立されている（週次コストレビュー、月次パフォーマンスレビュー）

---

## 追加リソース

### コンパニオンガイド

- [GenAI テレメトリのカスタムダッシュボードの作成](../custom-dashboards-for-genai-telemetry) — テレメトリを DevOps、FinOps、その他のステークホルダー向けのペルソナベースのダッシュボードに変換します

### AWS ドキュメント

- [モデル呼び出し — CloudWatch GenAI Observability](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/model-invocations.html)
- [AgentCore Observability の使用開始](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AgentCore-GettingStarted.html)
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
