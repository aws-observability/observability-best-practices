# MCP Server デモクエリ

このガイドでは、Kiro IDE との MCP サーバー統合をテストするために使用できる自然言語クエリの例を提供します。

## 前提条件

1. Kiro で MCP サーバーをセットアップしていることを確認してください ( `SETUP-MCP-KIRO.md`)
2. マルチクラウドデモを実行してテレメトリを生成します。 `python3 AI-OBS_DEMO/multi-cloud-demo.py`
3. CloudWatch にメトリクスが表示されるまで 1～2 分待ちます

## スクリーンショット用のクエリ例

### 1. トークン使用量の分析

**クエリ**: 「最も多くのトークンを消費しているモデルはどれですか？」

**期待されるレスポンス**:
```json
{
  "token_type": "input",
  "time_range_hours": 1,
  "models": [
    {
      "model": "anthropic.claude-3-haiku-20240307-v1:0",
      "total_tokens": 475
    },
    {
      "model": "gpt-4o",
      "total_tokens": 312
    },
    {
      "model": "gemini-1.5-pro",
      "total_tokens": 289
    }
  ]
}
```

**代替クエリ**:
- 「過去 1 時間の入力トークン使用量を表示」
- 「Claude Haiku が使用した出力トークン数は？」
- 「すべてのモデル間でトークン消費量を比較」

---

### 2. レイテンシー統計

**クエリ**: 「Claude Haiku の平均レイテンシーはどのくらいですか？」

**期待されるレスポンス**:
```json
{
  "model": "anthropic.claude-3-haiku-20240307-v1:0",
  "avg_latency_ms": 1234.56,
  "max_latency_ms": 1876.23,
  "min_latency_ms": 892.45,
  "time_range_hours": 1,
  "datapoints": 31
}
```

**代替クエリ**:
- 「すべてのモデルのレイテンシー統計を表示してください」
- 「最もレイテンシーが高いモデルはどれですか？」
- 「応答時間の観点で最も高速なモデルは何ですか？」

---

### 3. リクエストボリューム

**クエリ**: 「過去 1 時間にリクエストは何回行われましたか?」

**期待されるレスポンス**:
```json
{
  "time_range_hours": 1,
  "models": [
    {
      "model": "anthropic.claude-3-sonnet-20240229-v1:0",
      "total_requests": 81
    },
    {
      "model": "anthropic.claude-3-haiku-20240307-v1:0",
      "total_requests": 31
    },
    {
      "model": "gpt-4o",
      "total_requests": 21
    }
  ]
}
```

**代替クエリ**:
- 「モデル別のリクエスト数を表示」
- 「最も使用されているモデルはどれですか？」
- 「GPT-4o は何回呼び出されましたか？」

---

### 4. コスト見積もり

**クエリ**: 「過去 1 時間の LLM 使用量のコストを見積もる」

**期待されるレスポンス**:
```json
{
  "time_range_hours": 1,
  "total_estimated_cost_usd": 0.0142,
  "cost_breakdown": [
    {
      "model": "anthropic.claude-3-haiku-20240307-v1:0",
      "input_tokens": 475,
      "output_tokens": 8084,
      "estimated_cost_usd": 0.0102
    },
    {
      "model": "anthropic.claude-3-sonnet-20240229-v1:0",
      "input_tokens": 312,
      "output_tokens": 2456,
      "estimated_cost_usd": 0.0031
    }
  ],
  "note": "Costs are estimates based on Claude 3 Haiku pricing ($0.25/$1.25 per 1M tokens)"
}
```

**代替クエリ**:
- 「今日の推定 LLM コストはいくらですか？」
- 「Claude モデルにいくら費やしていますか？」
- 「リクエストあたりのコストを計算してください」

---

### 5. モデルの比較

**クエリ**: 「すべてのモデルをレイテンシーとトークン使用量で比較する」

**期待されるレスポンス**:
```json
{
  "time_range_hours": 1,
  "latency": {
    "models": [
      {
        "model": "anthropic.claude-3-sonnet-20240229-v1:0",
        "avg_latency_ms": 2567.89
      },
      {
        "model": "gpt-4o",
        "avg_latency_ms": 2234.12
      },
      {
        "model": "anthropic.claude-3-haiku-20240307-v1:0",
        "avg_latency_ms": 1234.56
      }
    ]
  },
  "input_tokens": {
    "models": [
      {
        "model": "anthropic.claude-3-haiku-20240307-v1:0",
        "total_tokens": 475
      },
      {
        "model": "anthropic.claude-3-sonnet-20240229-v1:0",
        "total_tokens": 312
      }
    ]
  },
  "output_tokens": {
    "models": [
      {
        "model": "anthropic.claude-3-haiku-20240307-v1:0",
        "total_tokens": 8084
      },
      {
        "model": "anthropic.claude-3-sonnet-20240229-v1:0",
        "total_tokens": 2456
      }
    ]
  },
  "requests": {
    "models": [
      {
        "model": "anthropic.claude-3-sonnet-20240229-v1:0",
        "total_requests": 81
      },
      {
        "model": "anthropic.claude-3-haiku-20240307-v1:0",
        "total_requests": 31
      }
    ]
  }
}
```

**代替クエリ**:
- 「すべてのアクティブなモデルの比較を表示してください」
- 「最高のパフォーマンスを提供するモデルはどれですか？」
- 「Claude Haiku と Claude Sonnet を比較してください」

---

## 高度なクエリ

### 時間範囲クエリ

**クエリ**: 「過去 2 時間のトークン使用量を表示してください」

MCP サーバーは、次を使用したカスタム時間範囲をサポートします `hours` パラメータ。

### 特定のモデルクエリ

**クエリ**: 「anthropic.claude-3-haiku-20240307-v1:0 のレイテンシーはどのくらいですか？」

完全なモデル ID を使用して、特定のモデルをクエリできます。

### マルチメトリッククエリ

**クエリ**: 「Claude Haiku のパフォーマンスの完全な概要を教えてください」

これにより、 `compare_models` 指定されたモデルのすべてのメトリクスを表示するツールです。

---

## スクリーンショットを撮るためのヒント

### デモスクリーンショット用のベストクエリ

1. **コスト分析** (最も印象的):
   ```
   "Estimate the cost of LLM usage for the last hour"
   ```
   ドル金額で実際のビジネス価値を示します。

2. **モデル比較** (最も包括的):
   ```
   "Compare all models by latency and token usage"
   ```
   プロバイダー間での統合オブザーバビリティの威力を示します。

3. **シンプルクエリ** (最もアクセスしやすい):
   ```
   "Which model is consuming the most tokens?"
   ```
   理解しやすく、自然言語機能を示しています。

### スクリーンショット構成のヒント

1. **クエリを表示する**: 自然言語クエリが表示されていることを確認します
2. **レスポンスを表示する**: データを含む完全な JSON レスポンスを含めます
3. **コンテキストを表示する**: 可能であれば IDE コンテキスト (ファイルエクスプローラー、ターミナル) を含めます
4. **重要なデータを強調表示する**: レスポンス内の興味深いインサイトを指摘します

### スクリーンショットフローの例

1. Kiro IDE を開きます
2. チャットパネルを開きます
3. 次のように入力します。「過去 1 時間の LLM 使用量のコストを見積もる」
4. MCP サーバーが応答するまで待ちます
5. 次の内容を示すスクリーンショットを撮ります。
   - 自然言語クエリ
   - 構造化された JSON レスポンス
   - モデル別のコスト内訳
   - 推定総コスト

---

## トラブルシューティング

### 「データなし」レスポンス

**問題**: MCP サーバーが空の結果を返す

**解決策**:
1. デモを実行してメトリクスを生成します。 `python3 AI-OBS_DEMO/multi-cloud-demo.py`
2. CloudWatch がメトリクスを取り込むまで 1～2 分待ちます
3. 時間範囲を増やしてみてください。「過去 2 時間のトークン使用量を表示」

### MCP サーバーが応答しない

**問題**: クエリがタイムアウトまたは失敗する

**解決策**:
1. MCP サーバーが実行中であることを確認します。Kiro MCP パネルで「ai-observability」を探してください
2. AWS 認証情報を確認します。 `aws sts get-caller-identity`
3. CloudWatch のアクセス許可を確認します。CloudWatch メトリクスへの読み取りアクセスがあることを確認してください
4. Kiro を再起動して MCP 設定を再読み込みします

### 権限エラー

**問題**: レスポンスに「AccessDenied」エラーが発生する

**解決策**:
1. IAM アクセス許可に以下が含まれていることを確認します `cloudwatch:GetMetricStatistics`
2. IAM アクセス許可に以下が含まれていることを確認します `cloudwatch:ListMetrics`
3. AWS リージョンが次のように設定されていることを確認します `us-east-1` MCP 設定内

---

## MCP サーバーを直接テストする

Kiro を使用せずに MCP サーバーを直接テストすることもできます。

```bash
python3 AI-OBS_DEMO/test-mcp-server.py
```

これにより、5 つの MCP ツールすべてが実行され、結果が表示されます。次の用途に役立ちます。
- MCP サーバーが動作することを確認する
- 問題をデバッグする
- レスポンス形式を理解する
- ドキュメント用のサンプルデータを生成する

---

## 次のステップ

スクリーンショットを撮影した後:

1. **ブログ投稿に追加**: 「デモ結果」セクションにスクリーンショットを含める
2. **チュートリアルを作成**: スクリーンショットを使用してステップバイステップガイドを作成する
3. **チームと共有**: 自然言語クエリ機能をデモンストレーションする
4. **フィードバックを収集**: 開発者に他にどのようなクエリが役立つか尋ねる

---

## その他のリソース

- **MCP サーバーコード**: `AI-OBS_DEMO/mcp-server/cloudwatch_mcp_server.py`
- **セットアップガイド**: `AI-OBS_DEMO/SETUP-MCP-KIRO.md`
- **テストスクリプト**: `AI-OBS_DEMO/test-mcp-server.py`
- **Kiro Config**: `AI-OBS_DEMO/kiro-mcp-config.json`
