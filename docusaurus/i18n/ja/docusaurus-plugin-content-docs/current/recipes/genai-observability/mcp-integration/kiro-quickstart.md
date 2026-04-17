# Kiro IDE MCP Server - クイックスタートガイド

## 得られるもの

Kiro IDE で直接平易な英語で質問できます。

- "Which model is consuming the most tokens?"
- "What's the average latency for Claude Haiku?"
- "Estimate my LLM costs for the last hour"

ダッシュボードに切り替えたり、複雑なクエリを記述したりする必要はありません！

---

## ステップ 1: Kiro で MCP Server を設定する

### オプション A: ワークスペース設定を使用する (推奨)

1. **MCP 設定ディレクトリを作成します。**
   ```bash
   mkdir -p .kiro/settings
   ```

2. **MCP 設定をコピーします**。
   ```bash
   cp AI-OBS_DEMO/kiro-mcp-config.json .kiro/settings/mcp.json
   ```

3. **設定内のパスを更新します**（必要な場合）。
   開く `.kiro/settings/mcp.json` パスを確認します。 `cloudwatch_mcp_server.py` が正しいです。
   ```json
   {
     "mcpServers": {
       "ai-observability": {
         "command": "python3",
         "args": [
           "/path/to/mcp-server/cloudwatch_mcp_server.py"
         ],
         "env": {
           "AWS_REGION": "your-aws-region"
         },
         "disabled": false,
         "autoApprove": []
       }
     }
   }
   ```

### オプション B: ユーザーレベル設定を使用する (グローバル)

1. **ユーザー設定ディレクトリを作成します。**
   ```bash
   mkdir -p ~/.kiro/settings
   ```

2. **設定をコピーします**。
   ```bash
   cp AI-OBS_DEMO/kiro-mcp-config.json ~/.kiro/settings/mcp.json
   ```

---

## ステップ 2: AWS 認証情報を確認する

MCP サーバーは CloudWatch にクエリを実行するために AWS 認証情報が必要です。

```bash
# Check your AWS credentials are configured
aws sts get-caller-identity

# Should show:
# {
#     "UserId": "...",
#     "Account": "<your-account-id>",
#     "Arn": "arn:aws:iam::<your-account-id>:user/<your-username>"
# }
```

設定されていない場合は、AWS 認証情報を設定します。
```bash
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Default region: your-aws-region
# Default output format: json
```

---

## ステップ 3: MCP サーバーをテストする (オプション)

Kiro で使用する前に、MCP サーバーが動作することを確認します。

```bash
python3 AI-OBS_DEMO/test-mcp-server.py
```

次のような出力が表示されます。
```
Testing CloudWatch MCP Server
==============================

1. Testing get_token_usage...
✅ Success: {
  "token_type": "input",
  "time_range_hours": 1,
  "models": [...]
}

2. Testing get_model_latency...
✅ Success: {...}
```

---

## ステップ 4: Kiro IDE を再起動する

Kiro が MCP 設定を読み込むには次のようにします。

1. **すべての作業を保存します**
2. **Kiro を完全に終了します** (Mac では Cmd+Q、または File → Exit)
3. **Kiro を再度開きます**
4. **ワークスペースを開きます** (次を含むフォルダー `.kiro/settings/mcp.json`)

---

## ステップ 5: MCP Server が接続されていることを確認する

1. **Kiro Feature Panel を開きます**（左サイドバー）
2. **「MCP Servers」セクションを探します**
3. **次のように表示されます**。 `ai-observability` 緑色のステータスインジケーターが表示されます
4. **赤色のインジケーターが表示された場合**: クリックしてエラーの詳細を確認します

### 接続の問題のトラブルシューティング

サーバーが切断されていると表示される場合:

1. Kiro の左パネルにある **MCP Server ビューを確認します**
2. 利用可能な場合は **「Reconnect」をクリックします**
3. **ログを確認します**: MCP サーバー出力のエラーメッセージを探します
4. **Python パスを確認します**: 次のことを確認してください `python3` PATH に含まれていることを確認します
5. **ファイルのアクセス許可を確認する**: 次のことを確認します `cloudwatch_mcp_server.py` 読みやすい

---

## ステップ 6: 自然言語クエリを使用する

### Kiro Chat での使用

1. **Kiro Chat を開く** (Cmd+L またはチャットアイコンをクリック)
2. **質問を入力する** 平易な英語で入力します。

```
Which model is consuming the most tokens?
```

3. **Kiro は自動的に**以下を実行します。
   - これを可観測性クエリとして認識
   - MCP サーバーを呼び出し `get_token_usage` tool
   - 構造化された結果を返す

### 試してみるクエリの例

#### 1. トークン使用量
```
Which model is consuming the most tokens?
```

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
    }
  ]
}
```

#### 2. レイテンシー統計
```
What's the average latency for all models?
```

**期待されるレスポンス**:
```json
{
  "time_range_hours": 1,
  "models": [
    {
      "model": "anthropic.claude-3-sonnet-20240229-v1:0",
      "avg_latency_ms": 2567.89
    },
    {
      "model": "gpt-4o",
      "avg_latency_ms": 2234.12
    }
  ]
}
```

#### 3. コスト見積もり
```
Estimate the cost of LLM usage for the last hour
```

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
    }
  ]
}
```

#### 4. リクエストボリューム
```
How many requests have been made in the last hour?
```

#### 5. モデルの比較
```
Compare all models by latency and token usage
```

---

## ステップ 7: 高度な使用方法

### カスタム時間範囲

クエリでカスタム時間範囲を指定できます。

```
Show me token usage for the last 2 hours
```

```
What was the latency for Claude Haiku in the last 3 hours?
```

### 特定のモデルクエリ

完全な ID を使用して特定のモデルをクエリします。

```
What's the latency for anthropic.claude-3-haiku-20240307-v1:0?
```

### マルチメトリッククエリ

包括的な分析を依頼します。

```
Give me a complete overview of Claude Haiku performance
```

---

## トラブルシューティング

### 「データなし」レスポンス

**問題**: MCP サーバーが空の結果を返す

**解決策**:
1. デモを実行してメトリクスを生成します。
   ```bash
   python3 AI-OBS_DEMO/multi-cloud-demo.py
   ```
2. CloudWatch がメトリクスを取り込むまで 1～2 分待ちます
3. 時間範囲を増やしてみてください。「過去 2 時間のトークン使用量を表示」

### MCP サーバーが応答しない

**問題**: クエリがタイムアウトまたは失敗する

**解決策**:
1. Kiro の MCP パネルで MCP サーバーのステータスを確認します
2. AWS 認証情報を検証します。 `aws sts get-caller-identity`
3. CloudWatch のアクセス許可を確認します
4. Kiro を再起動して MCP 設定を再読み込みします

### 権限エラー

**問題**: レスポンスに「AccessDenied」エラーが発生する

**解決策**:
1. IAM アクセス許可に以下が含まれていることを確認します。
   - `cloudwatch:GetMetricStatistics`
   - `cloudwatch:ListMetrics`
2. AWS リージョンが正しく設定されていることを確認します

### Python パスの問題

**問題**: "python3: command not found"

**解決策**:
1. Python パスを見つけます。 `which python3`
2. MCP 設定をフルパスで更新します。
   ```json
   "command": "/usr/local/bin/python3"
   ```

---

## 最良の結果を得るためのヒント

### 1. 新しいデータを生成する

クエリを実行する前に、デモを実行して最新のメトリクスがあることを確認します。
```bash
python3 AI-OBS_DEMO/multi-cloud-demo.py
```

### 2. 自然言語を使用する

MCP サーバーは自然な質問を理解します。
- ✅ "最もコストがかかるモデルはどれですか？"
- ✅ "すべてのモデルのレイテンシーを表示してください"
- ✅ "Claude はどれだけのトークンを使用しましたか？"

### 3. 必要に応じて具体的に記述する

特定のモデルについては、完全な ID を使用します。
```
What's the latency for anthropic.claude-3-haiku-20240307-v1:0?
```

### 4. コードコンテキストと組み合わせる

コードを表示しながら質問できます。
```
Based on this code, estimate the cost if we run it 1000 times
```

---

## 利用可能な MCP ツール

MCP サーバーは 5 つのツールを提供します。

| Tool | Description | Example Query |
|------|-------------|---------------|
| `get_token_usage` | Token consumption by model | "Which model uses the most tokens?" |
| `get_model_latency` | Latency statistics | "What's the average latency?" |
| `get_request_count` | Request volume | "How many requests were made?" |
| `get_cost_estimate` | Cost estimation | "Estimate my LLM costs" |
| `compare_models` | Multi-metric comparison | "Compare all models" |

---

## 次のステップ

### デモ用のスクリーンショットを撮る

1. デモを実行します。 `python3 AI-OBS_DEMO/multi-cloud-demo.py`
2. 1〜2 分待ちます
3. 「過去 1 時間の LLM 使用量のコストを見積もってください」と尋ねます
4. クエリと応答を示すスクリーンショットを撮ります

### ユースケースに合わせてカスタマイズする

編集 `mcp-server/cloudwatch_mcp_server.py` 次の目的で使用できます。
- カスタムメトリクスの追加
- コスト計算式の変更
- 新しいクエリツールの追加
- 他の AWS サービスとの統合

### チームと共有する

1. コミットします。 `.kiro/settings/mcp.json` リポジトリに追加します
2. チームメンバーは自動的に MCP アクセスを取得します
3. 全員が IDE から可観測性データをクエリできます

---

## リソース

- **MCP サーバーコード**: `AI-OBS_DEMO/mcp-server/cloudwatch_mcp_server.py`
- **テストスクリプト**: `AI-OBS_DEMO/test-mcp-server.py`
- **クエリの例**: `AI-OBS_DEMO/MCP-DEMO-QUERIES.md`
- **アーキテクチャ**: `AI-OBS_DEMO/ARCHITECTURE.md`

---

## クイックリファレンスカード

```bash
# Setup
mkdir -p .kiro/settings
cp AI-OBS_DEMO/kiro-mcp-config.json .kiro/settings/mcp.json

# Test
python3 AI-OBS_DEMO/test-mcp-server.py

# Generate Data
python3 AI-OBS_DEMO/multi-cloud-demo.py

# Restart Kiro
# Cmd+Q → Reopen

# Query in Chat
"Which model is consuming the most tokens?"
```

---

**ご質問がありますか？** 確認してください `MCP-DEMO-QUERIES.md` より多くの例については、GitHub で issue を開いてください。
