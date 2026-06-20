# GenAI テレメトリ用のカスタムダッシュボードの作成

## カスタムダッシュボードを使用する理由

Bedrock Model Invocation Logging を有効にし、ADOT 自動計装エージェントをデプロイすると、AWS はすぐに使える標準ダッシュボードを提供します。Bedrock は、呼び出し回数、レイテンシー、トークン数、スロットルメトリクスを自動的に提供します。Application Signals は、サービスマップと SLO ビューを自動生成します。これは確かな基盤ですが、全体像ではありません。

標準のダッシュボードは「私の AI は今健全か？」という質問に答えます。しかし、DevOps、FinOps、セキュリティチームが実際に尋ねる質問には答えません。

- Bedrock 予算の 80% を消費しているのはどの呼び出し元か？
- 午後 3 時のデプロイ後に完了率が低下したのはなぜか？
- クロスリージョン推論は実際に役立っているのか、それともレイテンシーを追加しているのか？
- どのプロンプトがキャッシュから最も恩恵を受けるか？
- PII を返したモデル呼び出しを行ったのは誰で、何を尋ねたのか？
- エージェントはツールレイヤーで失敗しているのか、それともモデルレイヤーで失敗しているのか？

これらの質問に答えるには、ログ グループを結合し、トークンからコストを計算し、IAM ロール別にセグメント化し、スパン ツリーを詳しく調べるカスタム クエリが必要です。生のテレメトリはすでに流れています。価値は、それをどのように分析するかにあります。

### 1 つのパイプライン、異なるオーディエンス

GenAI テレメトリは 3 つのロググループに記録されます。 `bedrock-model-invocation-logging`, `aws/spans`、および `/aws/bedrock-agentcore/runtimes/<agent>`データは変わりませんが、表示方法が変わります。同じ呼び出しデータは次のようになります。

- **DevOps ダッシュボード** — 完了率、コンポーネントのレイテンシー、エージェントエラーのドリルダウンを表示し、「システムは正常に動作しているか？」に焦点を当てます
- **FinOps ダッシュボード** — モデルごとのコスト、上位の支出者、キャッシングの機会を表示し、「効率的に支出しているか？」に焦点を当てます

このガイドでは、両方を構築するためのクエリを提供します。対象者に関連するセクションを選択してください。各クエリには、ソースログ グループ、ビュータイプ、クエリ言語、および回答する質問が記載されています。

基盤となるデータパイプラインの概要と、それぞれを有効にするタイミングについては、[GenAI Observability on AWS](../genai-observability-on-aws) を参照してください。

---

## DevOps ペルソナダッシュボード

DevOps チームは次の質問に答える必要があります。*GenAI ワークロードは正常に動作しているか、ボトルネックはどこにあるか?* これらのクエリは、呼び出しの健全性、エージェントワークフローの信頼性、パフォーマンスのボトルネックに焦点を当てています。

![GenAI DevOps Dashboard](../../images/GenAI/genai-devops-dashboard.png)

### モデル呼び出しの健全性

#### 1. モデル別の停止理由の内訳

- **目的:** すべてのモデルにわたるすべての停止理由の分布を示します。すべての Bedrock 呼び出しは停止理由で終了します — `end_turn` (自然補完)、 `tool_use` (ツールを呼び出す)、 `max_tokens` (truncated), `stop_sequence` (境界に達した)、またはエラーが発生した場合です。例: 要約モデルの呼び出しの 15% が次のように終了することがわかる場合があります `max_tokens` つまり、ユーザーは途中で切れたレスポンスを受け取っているということです。一方で、分類モデルは 100% `end_turn`.
- **ソース:** `bedrock-model-invocation-logging`
- **ビュー:** 棒グラフ
- **クエリ言語:** CloudWatch Logs Insights
- **クエリ:**

```sql
fields @timestamp, modelId, operation, requestId,
       output.outputBodyJson.stopReason as stop_reason
| filter schemaType = "ModelInvocationLog"
| filter ispresent(output.outputBodyJson.stopReason)
        or ispresent(output.outputBodyJson.error)
| stats count() as stop_reason_count by stop_reason, modelId
```

- **アラーム:** 正常でない停止理由（以下を除く `end_turn`, `tool_use`、または `stop_sequence`) がモデルの総呼び出し数の 10% を超えています。

#### 2. 完了率と切り捨て (1 時間ごと)

- **目的:** 成功した完了の時間あたりの比率を追跡します (`end_turn` + `tool_use`) と切り捨てられたレスポンス (`max_tokens`)。これが SLA メトリクスです。完了率 95% 以上を目標にします。例: 完了率が午後 3 時から午後 4 時の間に 97% から 88% に低下した場合、何かが変更されています。新しいプロンプトテンプレート、モデルの更新、または設定変更により、より多くの切り捨てが発生しています。
- **ソース:** `bedrock-model-invocation-logging`
- **ビュー:** 時系列 (積み上げ)
- **クエリ言語:** CloudWatch Logs Insights
- **クエリ:**

```sql
fields @timestamp, modelId,
       output.outputBodyJson.stopReason as stop_reason
| filter schemaType = "ModelInvocationLog"
| filter ispresent(output.outputBodyJson.stopReason)
| stats sum(stop_reason = "end_turn" or stop_reason = "tool_use") as ok,
        sum(stop_reason = "max_tokens") as truncated
  by bin(@timestamp, 1h) as hour
| sort hour desc
```

- **アラーム:** `ok / (ok + truncated)` 2 時間連続で 95% を下回った場合。

#### 3. トークン効率 — 無駄なトークンを見つける

- **目的:** 高い入力トークン (2000 以上) を送信しているが、低い出力 (200 未満) しか受信していない呼び出し元を見つけます。これはトークンの無駄遣いの兆候です。例: 製品カタログ全体 (8000 トークン) を送信して、1 単語のラベル (3 トークン) を取得する分類パイプライン。 `caller_arn` column は、どのサービスまたはロールが責任を持っているかを正確に示すため、プロンプトの再構築について的を絞った会話を行うことができます。
- **ソース:** `bedrock-model-invocation-logging`
- **ビュー:** テーブル
- **クエリ言語:** CloudWatch Logs Insights
- **クエリ:**

```sql
fields @timestamp, modelId, operation,
       input.inputTokenCount as input_tokens,
       output.outputTokenCount as output_tokens,
       identity.arn as caller_arn
| filter schemaType = "ModelInvocationLog"
| filter input_tokens > 2000 and output_tokens < 200
| stats count() as inefficient_requests,
        avg(input_tokens) as avg_input_tokens,
        avg(output_tokens) as avg_output_tokens,
        sum(input_tokens) as total_wasted_tokens
  by modelId, operation, caller_arn
| sort total_wasted_tokens desc
```

- **アラーム:** 任意の呼び出し元が `total_wasted_tokens` 24 時間で 100K を超えています。

#### 4. クロスリージョン推論レイテンシー

- **目的:** 各モデルの推論リージョン間でレイテンシーパーセンタイルを比較します。クロスリージョン推論を有効にしている場合、一部のリクエストは、レイテンシーが高い遠隔リージョンにルーティングされます。例: 要約モデルの P95 が us-west-2 では 12 秒ですが、us-east-1 では 4 秒の場合、推論プロファイルを us-east-1 を優先するように設定することで、P95 を 40% 削減できます。
- **ソース:** `bedrock-model-invocation-logging`
- **ビュー:** テーブル
- **クエリ言語:** CloudWatch Logs Insights
- **クエリ:**

```sql
fields @timestamp, modelId, region, inferenceRegion,
       output.outputBodyJson.metrics.latencyMs as latency
| filter schemaType = "ModelInvocationLog"
| filter ispresent(inferenceRegion)
| filter latency > 0
| stats count() as invocations,
        avg(latency) as avg_latency,
        pct(latency, 50) as p50_latency,
        pct(latency, 95) as p95_latency,
        pct(latency, 99) as p99_latency,
        stddev(latency) as latency_stddev
  by modelId, region, inferenceRegion
| sort modelId asc, avg_latency asc
```

- **アラーム:** 特定のリージョンにおいて、任意のモデルの P95 が 10 秒を超えた場合。

#### 5. プロンプトキャッシングの機会

- **目的:** 繰り返し呼び出されているにもかかわらず、キャッシュヒットがゼロまたは低いプロンプトを見つけます。これは、キャッシングによる最大の ROI 機会です。例: システムプロンプトが 500 回使用されているのにキャッシュ読み取りがゼロの場合、毎回フル料金を支払っていることになります。キャッシングを有効にすると、これらの入力トークンで 90% 節約できる可能性があります。
- **ソース:** `bedrock-model-invocation-logging`
- **ビュー:** テーブル
- **クエリ言語:** CloudWatch Logs Insights
- **クエリ:**

```sql
fields @timestamp,
       input.inputBodyJson.messages.0.content.0.text as promptText,
       input.inputTokenCount as inputTokens,
       input.cacheReadInputTokenCount as cacheReadTokens,
       input.cacheWriteInputTokenCount as cacheWriteTokens,
       modelId
| filter input.inputTokenCount > 0
| stats sum(input.inputTokenCount) as totalInputTokens,
        count(*) as invocationCount,
        avg(input.inputTokenCount) as avgInputTokens,
        sum(input.cacheReadInputTokenCount) as totalCacheReadTokens,
        sum(input.cacheWriteInputTokenCount) as totalCacheWriteTokens
  by promptText, modelId
| filter invocationCount > 1
| sort totalInputTokens desc
```

- **アラーム:** なし (最適化レビュー、毎週実行)。

### エージェントワークフローの健全性

#### 6. エージェントのトレースとエラー (1 時間ごと)

- **目的:** エラースパンと並行した、エージェントトレースの合計の時間ごとのカウント — エージェントレベルの信頼性メトリクス。例: total_traces が 500/時間であるのに対し、error_spans が午後 3 時に 5 から 80 に急増した場合、エージェントワークフローで何かが壊れています。これは、モデルレベルのメトリクスでは見逃される問題を捉えます — ツールのタイムアウトやガードレールの拒否により、モデルは成功してもエージェントは失敗する可能性があります。
- **ソース:** `aws/spans`
- **ビュー:** 時系列
- **クエリ言語:** CloudWatch Logs Insights
- **クエリ:**

```sql
fields attributes.session.id as sessionId, traceId,
       status.code as statusCode, durationNano/1000000 as durationMs
| filter ispresent(sessionId)
| stats count_distinct(traceId) as total_traces,
        sum(statusCode = "ERROR") as error_spans
  by bin(@timestamp, 1h) as hour
| sort hour desc
```

- **アラーム:** `error_spans / total_traces` 15 分間 10% を超えた場合。

#### 7. スパンエラーのドリルダウン

- **目的:** エージェントエラーが発生していることがわかっている場合、これにより、ナレッジベースの取得、ガードレールチェック、ツールの実行、またはモデルの呼び出しのうち、どのコンポーネントが失敗しているかを正確に把握できます。例: エラーの 70% が HTTP 503 を伴う KB 取得スパンで発生している場合、モデルの問題ではなく、OpenSearch クラスターが負荷によってスロットリングされています。
- **ソース:** `aws/spans`
- **ビュー:** テーブル
- **クエリ言語:** CloudWatch Logs Insights
- **クエリ:**

```sql
fields name as spanName,
       resource.attributes.service.name as serviceName,
       status.code as statusCode,
       status.message as statusMessage,
       attributes.http.response.status_code as httpStatus,
       durationNano/1000000 as durationMs,
       traceId, spanId, parentSpanId
| filter resource.attributes.aws.service.type = "gen_ai_agent"
| filter status.code = "ERROR"
        or attributes.http.response.status_code >= 400
| stats count() as error_count,
        count_distinct(traceId) as affected_traces,
        avg(durationMs) as avg_error_duration_ms,
        earliest(statusMessage) as error_message
  by spanName, serviceName, httpStatus
| sort error_count desc
```

- **アラーム:** 15 分間に 10 件を超えるエラーが発生したコンポーネント。

#### 8. コンポーネントパフォーマンスの内訳 (時間単位)

- **目的:** エージェントコンポーネントごとの時間単位のパフォーマンスを、完全なパーセンタイル分布 (P50、P95、P99) で表示します。エージェントの時間がどこに費やされているか、どのコンポーネントがボトルネックになっているかを示します。例: ガードレールチェックの平均は 2.8 秒 (P95: 4.1 秒) で、モデル呼び出しの平均は 1.2 秒 (P95: 2.0 秒) です。この場合、ガードレールを最初に最適化すべきです。モデルの最適化よりも大きな影響があります。
- **ソース:** `aws/spans`
- **ビュー:** テーブル
- **クエリ言語:** CloudWatch Logs Insights
- **クエリ:**

```sql
fields name as spanName,
       resource.attributes.service.name as serviceName,
       durationNano/1000000 as durationMs,
       traceId
| filter resource.attributes.aws.service.type = "gen_ai_agent"
| filter ispresent(spanName)
| stats count() as invocations,
        avg(durationMs) as avg_duration_ms,
        pct(durationMs, 50) as p50_duration_ms,
        pct(durationMs, 95) as p95_duration_ms,
        pct(durationMs, 99) as p99_duration_ms,
        sum(durationMs) as total_time_ms
  by bin(1h), spanName, serviceName
| sort total_time_ms desc
```

- **アラーム:** 任意のコンポーネントの P95 が 5000ms を超えた場合。

---

## FinOps ペルソナダッシュボード

FinOps チームは次の問いに答える必要があります。*GenAI の支出はどこに向かっているのか、そしてどのように最適化するのか？* これらのクエリは、トークン使用量からコストを計算し、支出をチームと役割に帰属させ、プロンプトキャッシュなどの最適化の機会を明らかにします。

![GenAI FinOps Dashboard](../../images/GenAI/genai-finops-dashboard.png)

すべての FinOps クエリは、トークンあたりの価格設定に基づくコスト計算パターンを使用します。 `strcontains` 乗算パターンは、各モデルをトークンあたりのレートにマッピングします。Bedrock の料金が変更された場合は、料金の値を更新してください。

### エグゼクティブサマリー

#### 9. 推定支出合計

- **目的:** 選択した期間におけるすべてのモデルの GenAI 総支出を示す単一値ウィジェット。これは主要な KPI であり、CFO が注目する数値です。
- **ソース:** `bedrock-model-invocation-logging`
- **ビュー:** 単一値
- **クエリ言語:** CloudWatch Logs Insights
- **クエリ:**

```sql
fields coalesce(output.outputBodyJson.usage.inputTokens,
    output.outputBodyJson.usage.prompt_tokens,
    output.outputBodyJson.usage.input_tokens,
    input.inputTokenCount) as inputTokens,
  coalesce(output.outputBodyJson.usage.outputTokens,
    output.outputBodyJson.usage.completion_tokens,
    output.outputBodyJson.usage.output_tokens,
    output.outputTokenCount) as outputTokens
| fields (inputTokens *
    ((strcontains(modelId, "nova-micro") * 0.000000035) +
    (strcontains(modelId, "nova-lite") * 0.00000006) +
    (strcontains(modelId, "nova-pro") * 0.0000008) +
    (strcontains(modelId, "claude-sonnet-4-6") * 0.000003) +
    (strcontains(modelId, "claude-sonnet-4-5") * 0.000003) +
    (strcontains(modelId, "claude-haiku") * 0.000001) +
    (strcontains(modelId, "llama4-maverick") * 0.0000002) +
    (strcontains(modelId, "llama4-scout") * 0.00000015) +
    (strcontains(modelId, "command-r-plus") * 0.0000025) +
    (strcontains(modelId, "command-r-v") * 0.00000015) +
    (strcontains(modelId, "gpt-oss-120b") * 0.00000009) +
    (strcontains(modelId, "gpt-oss-20b") * 0.00000004))) +
  (outputTokens *
    ((strcontains(modelId, "nova-micro") * 0.00000014) +
    (strcontains(modelId, "nova-lite") * 0.00000024) +
    (strcontains(modelId, "nova-pro") * 0.0000032) +
    (strcontains(modelId, "claude-sonnet-4-6") * 0.000015) +
    (strcontains(modelId, "claude-sonnet-4-5") * 0.000015) +
    (strcontains(modelId, "claude-haiku") * 0.000005) +
    (strcontains(modelId, "llama4-maverick") * 0.0000002) +
    (strcontains(modelId, "llama4-scout") * 0.00000015) +
    (strcontains(modelId, "command-r-plus") * 0.00001) +
    (strcontains(modelId, "command-r-v") * 0.0000006) +
    (strcontains(modelId, "gpt-oss-120b") * 0.00000045) +
    (strcontains(modelId, "gpt-oss-20b") * 0.0000002))) as totalCostUSD
| stats sum(totalCostUSD) as TotalSpendUSD
```

- **アラーム:** 日次支出が 7 日間平均の 150% を超えています。

### コスト分析

#### 10. モデル別のコスト配分

- **目的:** 支出の内訳をモデル別に示す円グラフです。例: Claude Sonnet 4.6 が請求額の 70% を占め、Nova Lite が 5% であることがわかります。一部のユースケースを Nova に移行できる場合、プロンプト移行の機会となります。
- **ソース:** `bedrock-model-invocation-logging`
- **ビュー:** Pie
- **クエリ言語:** CloudWatch Logs Insights
- **クエリ (クエリ 9 のコスト計算パターンに追加):**

```sql
| stats sum(totalCostUSD) as costUSD by modelName
| sort costUSD desc
```

- **アラーム:** なし (情報提供のみ)。

#### 11. ロール/ユーザー別の上位 10 件の支出者

- **目的:** どの IAM ロールまたはユーザーが支出を促進しているかを特定します。呼び出し回数とコールあたりのコストと組み合わせることで、チームがボリュームのために多く支出しているのか、それとも呼び出しがより高価であるために多く支出しているのかを確認できます。例: `data-science-exploration` role は 100K 回の呼び出しがあり、それぞれ $0.002 です。一方、 `prod-chatbot` 10K を各 $0.05 で持っています — 最適化パスは大きく異なります。
- **ソース:** `bedrock-model-invocation-logging`
- **ビュー:** テーブル
- **クエリ言語:** CloudWatch Logs Insights
- **クエリ:**

```sql
fields replace(`identity.arn`, "arn:aws:sts::ACCOUNT_ID:assumed-role/", "") as userRole
| fields coalesce(output.outputBodyJson.usage.inputTokens,
    output.outputBodyJson.usage.prompt_tokens,
    output.outputBodyJson.usage.input_tokens,
    input.inputTokenCount) as inputTokens,
  coalesce(output.outputBodyJson.usage.outputTokens,
    output.outputBodyJson.usage.completion_tokens,
    output.outputBodyJson.usage.output_tokens,
    output.outputTokenCount) as outputTokens
| fields (inputTokens *
    ((strcontains(modelId, "nova-micro") * 0.000000035) +
    (strcontains(modelId, "nova-lite") * 0.00000006) +
    (strcontains(modelId, "nova-pro") * 0.0000008) +
    (strcontains(modelId, "claude-sonnet-4-6") * 0.000003) +
    (strcontains(modelId, "claude-sonnet-4-5") * 0.000003) +
    (strcontains(modelId, "claude-haiku") * 0.000001))) +
  (outputTokens *
    ((strcontains(modelId, "nova-micro") * 0.00000014) +
    (strcontains(modelId, "nova-lite") * 0.00000024) +
    (strcontains(modelId, "nova-pro") * 0.0000032) +
    (strcontains(modelId, "claude-sonnet-4-6") * 0.000015) +
    (strcontains(modelId, "claude-sonnet-4-5") * 0.000015) +
    (strcontains(modelId, "claude-haiku") * 0.000005))) as totalCostUSD
| stats sum(totalCostUSD) as spend,
        count(*) as invocations,
        (sum(totalCostUSD) / count(*)) as costPerCall
  by userRole
| sort spend desc
| limit 10
```

- **アラーム:** いずれかのロールの 1 日の支出が、その 7 日間の平均の 2 倍を超えた場合。

#### 12. 入力コストと出力コストの分割 (時間単位)

- **目的:** 入力トークン (プロンプト) と出力トークン (補完) のどちらに多く費用がかかっているかを示します。入力コストが支配的な場合は、プロンプトを最適化してキャッシュを有効にします。出力コストが支配的な場合は、max_tokens を削減するか、より安価なモデルに切り替えます。
- **ソース:** `bedrock-model-invocation-logging`
- **ビュー:** Bar (stacked)
- **クエリ言語:** CloudWatch Logs Insights
- **クエリ (コスト計算パターンに追加し、入力/出力を分割):**

```sql
| stats sum(inputCostUSD) as InputCost, sum(outputCostUSD) as OutputCost
  by bin(1h) as hour
| sort hour asc
```

- **アラーム:** なし (分析ウィジェット)。

### トークン消費量

#### 13. 呼び出し回数 (15 分間隔)

- **目的:** 15 分間隔でのトラフィック量のベースライン。通常、ウィンドウあたりの呼び出し数が 2～4 回であるのに突然 10 回に急増した場合、何かが変化しています。新機能のリリース、負荷テスト、または暴走した再試行ループなどが考えられます。時間単位のコスト傾向と比較して、コストの急増が量の急増と相関しているのか、モデル選択の変更と相関しているのかを確認します。
- **ソース:** `bedrock-model-invocation-logging`
- **ビュー:** 時系列
- **クエリ言語:** CloudWatch Logs Insights
- **クエリ:**

```sql
stats count(*) as invocations by bin(15m) as period
| sort period asc
```

- **アラーム:** 通常の 15 分間平均の 3 倍を超える呼び出しが 2 つの連続した期間で発生した場合。

#### 14. 入力トークンと出力トークン

- **目的:** 5 分間のウィンドウで入力トークンと出力トークンの消費量を表示します。この比率により、ワークロードのプロファイルが明らかになります。例: 入力トークンが常に出力トークンの 10 倍である場合、短い応答に対して大きなコンテキスト (RAG、システムプロンプト) を送信していることになります。これはプロンプトキャッシュの主要な候補です。出力トークンが突然急増した場合、モデルの更新またはプロンプトの変更により、より長い応答が生成されている可能性があります。
- **ソース:** `bedrock-model-invocation-logging`
- **ビュー:** Bar (stacked)
- **クエリ言語:** CloudWatch Logs Insights
- **クエリ:**

```sql
fields
  coalesce(output.outputBodyJson.usage.inputTokens,
    output.outputBodyJson.usage.prompt_tokens,
    output.outputBodyJson.usage.input_tokens,
    input.inputTokenCount) as inputTokens,
  coalesce(output.outputBodyJson.usage.outputTokens,
    output.outputBodyJson.usage.completion_tokens,
    output.outputBodyJson.usage.output_tokens,
    output.outputTokenCount) as outputTokens
| stats sum(inputTokens) as totalInputTokens,
        sum(outputTokens) as totalOutputTokens
  by bin(5m) as period
| sort period asc
```

- **アラーム:** 入出力比が 20:1 を超える状態が 1 時間継続 — プロンプトの最適化を調査します。

#### 15. 合計トークン数

- **目的:** 5 分間のウィンドウにおける合計（入力 + 出力）トークン消費量。使用量を最もシンプルに表示します。例: 呼び出し回数の増加に対応せずに合計トークンが週ごとに増加している場合、個々のリクエストが大きくなっています（プロンプトまたはレスポンスが長くなっています）。呼び出し回数と比較して、「リクエストの増加」と「リクエストの大型化」を区別します。
- **ソース:** `bedrock-model-invocation-logging`
- **View:** Bar
- **Query Language:** CloudWatch Logs Insights
- **Query:**

```sql
fields
  coalesce(output.outputBodyJson.usage.inputTokens,
    output.outputBodyJson.usage.prompt_tokens,
    output.outputBodyJson.usage.input_tokens,
    input.inputTokenCount) as inputTokens,
  coalesce(output.outputBodyJson.usage.outputTokens,
    output.outputBodyJson.usage.completion_tokens,
    output.outputBodyJson.usage.output_tokens,
    output.outputTokenCount) as outputTokens
| stats sum(inputTokens) + sum(outputTokens) as totalTokens by bin(5m) as period
| sort period asc
```

- **アラーム:** 任意の 5 分間のウィンドウで、7 日間の平均の 200% を超える合計トークン数。

### 呼び出しの詳細

#### 16. 呼び出しごとの詳細テーブル

- **目的:** 完全な詳細を含む最新の 200 回の呼び出し — モデル名、temperature、maxTokens 設定、入力/出力/合計トークン、キャッシュ読み取り/書き込みトークン、および呼び出しごとの推定コスト。これは、特定の呼び出しを調査するためのドリルダウンテーブルです。例: 12,000 個の入力トークン、50 個の出力トークン、キャッシュ読み取りゼロ、コスト $0.04 の呼び出しを発見した場合 — これはドキュメント全体を送信する分類タスクです。
- **ソース:** `bedrock-model-invocation-logging`
- **ビュー:** テーブル
- **クエリ言語:** CloudWatch Logs Insights
- **クエリ:**

```sql
fields @timestamp, modelId,
  replace(replace(replace(modelId,
    "arn:aws:bedrock:us-east-1:ACCOUNT_ID:inference-profile/us.", ""),
    "arn:aws:bedrock:us-east-1:ACCOUNT_ID:inference-profile/", ""),
    "arn:aws:bedrock:us-east-1:ACCOUNT_ID:", "") as modelName,
  coalesce(input.inputBodyJson.inferenceConfig.temperature,
    input.inputBodyJson.temperature) as temperature,
  coalesce(input.inputBodyJson.inferenceConfig.maxTokens,
    input.inputBodyJson.max_completion_tokens,
    input.inputBodyJson.max_tokens) as maxTokens,
  coalesce(output.outputBodyJson.usage.inputTokens,
    output.outputBodyJson.usage.prompt_tokens,
    output.outputBodyJson.usage.input_tokens,
    input.inputTokenCount) as inputTokens,
  coalesce(output.outputBodyJson.usage.outputTokens,
    output.outputBodyJson.usage.completion_tokens,
    output.outputBodyJson.usage.output_tokens,
    output.outputTokenCount) as outputTokens,
  coalesce(output.outputBodyJson.usage.totalTokens,
    output.outputBodyJson.usage.total_tokens,
    floor(inputTokens + outputTokens)) as totalTokens,
  coalesce(output.outputBodyJson.usage.cache_read_input_tokens,
    output.outputBodyJson.usage.cacheReadInputTokenCount) as cacheReadTokens,
  coalesce(output.outputBodyJson.usage.cache_creation_input_tokens,
    output.outputBodyJson.usage.cacheWriteInputTokenCount) as cacheWriteTokens
| display @timestamp, modelName, temperature, maxTokens,
          inputTokens, outputTokens, totalTokens,
          cacheReadTokens, cacheWriteTokens
| sort @timestamp desc
| limit 200
```

- **アラーム:** なし (ドリルダウンテーブル — 調査に使用)。

#### 17. トークン数が多い上位 10 件のプロンプト

- **目的:** リクエスト/レスポンスの本文全体、モデル名、トークン数、レイテンシーを含む、トークン使用量が最も多い 10 件の呼び出し。これらは最もコストのかかる個別の呼び出しです。例: 最上位のプロンプトは 15,000 トークンを使用し、レイテンシーは 8 秒です。実際のプロンプトテキストを読むと、検索を使用する代わりにナレッジベース全体をコンテキストに詰め込んでいることがわかります。Bedrock モデル呼び出しログ設定で「リクエストとレスポンスの本文をログに記録」を有効にする必要があります。
- **ソース:** `bedrock-model-invocation-logging`
- **ビュー:** テーブル
- **クエリ言語:** CloudWatch Logs Insights
- **クエリ:**

```sql
filter !isPresent(errorCode)
| fields jsonParse(@message) as json_message,
    replace(replace(replace(modelId,
      "arn:aws:bedrock:us-east-1:ACCOUNT_ID:inference-profile/us.", ""),
      "arn:aws:bedrock:us-east-1:ACCOUNT_ID:inference-profile/", ""),
      "arn:aws:bedrock:us-east-1:ACCOUNT_ID:", "") as modelName
| unnest json_message.input into inputMessage
| unnest json_message.output into outputMessage
| display requestId, timestamp, modelName, inputMessage, outputMessage,
    coalesce(input.inputTokenCount, 0) as inputTokenCount,
    coalesce(output.outputTokenCount, 0) as outputTokenCount,
    coalesce(input.inputTokenCount, 0) + coalesce(output.outputTokenCount, 0) as totalTokenCount,
    (output.outputBodyJson.metrics.latencyMs / 1000) as latency
| sort totalTokenCount desc
| limit 10
```

- **アラーム:** 合計 20,000 トークンを超える単一の呼び出し — プロンプト設計を確認してください。

---

## モデル料金リファレンス

:::warning
これらの価格はスナップショットであり、**古くなっている可能性があります**。AWS は Bedrock の価格を定期的に更新し、新しいモデルを追加しています。常に [AWS Bedrock 料金ページ](https://aws.amazon.com/bedrock/pricing/)で最新の料金を確認し、更新してください `strcontains` クエリで乗数を適切に調整してください。
:::

価格はトークンあたりです (1K または 1M トークンあたりではありません)。更新するには、[Bedrock 料金ページ](https://aws.amazon.com/bedrock/pricing/)でモデルを見つけ、100 万トークンあたりの価格をトークンあたりに変換し (1,000,000 で除算)、対応する値を置き換えます。 `strcontains` 各コストクエリのブロック。

| Model | Input ($/token) | Output ($/token) |
| --- | --- | --- |
| Nova Micro | 0.000000035 | 0.00000014 |
| Nova Lite | 0.00000006 | 0.00000024 |
| Nova Pro | 0.0000008 | 0.0000032 |
| Claude Sonnet 4.6 | 0.000003 | 0.000015 |
| Claude Sonnet 4.5 | 0.000003 | 0.000015 |
| Claude Sonnet 4 | 0.000003 | 0.000015 |
| Claude Haiku 4.5 | 0.000001 | 0.000005 |
| Llama 4 Maverick | 0.0000002 | 0.0000002 |
| Llama 4 Scout | 0.00000015 | 0.00000015 |
| Cohere Command R+ | 0.0000025 | 0.00001 |
| Cohere Command R | 0.00000015 | 0.0000006 |
| GPT OSS 120B | 0.00000009 | 0.00000045 |
| GPT OSS 20B | 0.00000004 | 0.0000002 |

---

## アラームの推奨事項

### DevOps アラーム

| Alarm | Condition | Severity |
| --- | --- | --- |
| Completion rate drop | `ok / (ok + truncated)` below 95% for 2 hours | Warning |
| Token waste | Caller above 100K wasted tokens in 24h | Warning |
| Cross-region latency | Model P95 above 10s in a region | Warning |
| Agent error rate | `error_spans / total_traces` above 10% for 15 min | Critical |
| Component errors | Component above 10 errors in 15 min | Critical |
| Component latency | Component P95 above 5000ms | Warning |

### FinOps アラーム

| Alarm | Condition | Severity |
| --- | --- | --- |
| Daily cost spike | Daily cost exceeds 150% of 7-day average | Warning |
| Hourly cost anomaly | Hourly cost exceeds 3x the hourly average | Warning |
| Cost concentration | Single model exceeds 60% of total spend | Warning |
| Token volume spike | Total tokens exceed 2x baseline in 1 hour | Warning |
| Error rate cost waste | Error rate above 5% (paying for failed calls) | Warning |
| Per-role budget | Any role's daily spend exceeding 2x its 7-day average | Warning |
| Token ratio imbalance | Input:output ratio exceeding 20:1 sustained for 1 hour | Warning |
| High-token invocation | Any single call exceeding 20,000 tokens | Warning |

---

## その他のリソース

- [GenAI Observability on AWS](../genai-observability-on-aws) — コンパニオンガイド: 戦略、パイプライン、有効化、ダッシュボード
- [モデル呼び出し — CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/model-invocations.html)
- [AgentCore Observability の開始方法](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AgentCore-GettingStarted.html)
- [CloudWatch Logs Insights クエリ構文](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html)
- [CloudWatch Logs Insights での OpenSearch SQL](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_AnalyzeLogData_SQL.html)
- [AWS Bedrock 料金](https://aws.amazon.com/bedrock/pricing/)

---

**貢献者:** AWS Observability Team
**最終更新日:** 2026-04-21
