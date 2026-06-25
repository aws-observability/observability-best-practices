# Kiro IDE MCP Server - クイックスタートガイド

## 得られるもの

Kiro IDE で直接平易な英語で質問できます。
- 「どのモデルが最もトークンを消費していますか？」
- 「Claude Haiku の平均レイテンシはどのくらいですか？」
- 「過去 1 時間の LLM コストを見積もってください」

ダッシュボードに切り替えたり、複雑なクエリを記述したりする必要はありません！

---

## ステップ 1: Kiro で MCP Server を設定する

### オプション A: ワークスペース設定を使用する（推奨）

1. **MCP 設定ディレクトリを作成します**。
   ```bash
   mkdir -p .kiro/settings
   ```

2. **MCP 設定をコピーします**。
   ```bash
   cp AI-OBS_DEMO/kiro-mcp-config.json .kiro/settings/mcp.json
   ```

3. **設定のパスを更新します**（必要な場合）：
   開く `.kiro/settings/mcp.json` パスを確認します `cloudwatch_mcp_server.py` は正しいです。
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

### オプション B: ユーザーレベルの設定を使用する（グローバル）

1. **ユーザー設定ディレクトリを作成します**。
   ```bash
   mkdir -p ~/.kiro/settings
   ```

2. **設定をコピーします**。
   ```bash
   cp AI-OBS_DEMO/kiro-mcp-config.json ~/.kiro/settings/mcp.json
   ```

---

## ステップ 2: AWS 認証情報を確認する

MCP サーバーが CloudWatch にクエリを実行するには、AWS 認証情報が必要です。

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

AWS 認証情報が設定されていない場合は、設定してください。
```bash
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Default region: your-aws-region
# Default output format: json
```

---

## ステップ 3: MCP Server をテストする（オプション）

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

Kiro が MCP 設定を読み込むには、次の手順を実行します。

1. **作業内容をすべて保存します**
2. **Kiro を完全に終了します** (Mac では Cmd+Q、または File → Exit)
3. **Kiro を再起動します**
4. **ワークスペースを開きます** (フォルダーを含む `.kiro/settings/mcp.json`)

---

## ステップ 5: MCP Server が接続されていることを確認する

1. **Kiro Feature Panel を開きます**（左サイドバー）
2. **「MCP Servers」セクションを探します**
3. **以下が表示されるはずです**： `ai-observability` 緑色のステータスインジケーターが表示されます
4. **赤いインジケーターが表示された場合**: クリックしてエラーの詳細を確認してください

### 接続の問題のトラブルシューティング

サーバーが切断済みと表示される場合は、次の手順を実行してください。

1. **Kiro の左パネルで MCP Server ビューを確認します**
2. **利用可能な場合は「Reconnect」をクリックします**
3. **ログを確認します**: MCP サーバーの出力でエラーメッセージを探します
4. **Python パスを確認します**: 正しく設定されていることを確認します `python3` PATH に含まれていることを確認してください。
5. **ファイルのアクセス許可を確認する**: 確認してください `cloudwatch_mcp_server.py` 読みやすい

---

## ステップ 6: 自然言語クエリを使用する

### Kiro Chat 内

1. **Kiro Chat を開く** (Cmd+L またはチャットアイコンをクリック)
2. **質問を入力する** (平易な英語で)

```
Which model is consuming the most tokens?
```

3. **Kiro は自動的に**:
   - これをオブザーバビリティクエリとして認識します
   - MCP サーバーを呼び出します `get_token_usage` ツール
   - 構造化された結果を返す

### 試してみるクエリの例

#### 1. トークンの使用状況
```
Which model is consuming the most tokens?
```

**期待されるレスポンス**：
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

**期待されるレスポンス**：
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

**期待されるレスポンス**：
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

### マルチメトリクスクエリ

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
2. CloudWatch がメトリクスを取り込むまで 1〜2 分待ちます
3. 時間範囲を広げてみてください。「過去 2 時間のトークン使用量を表示して」

### MCP サーバーが応答しない

**問題**: クエリがタイムアウトするか失敗する

**解決策**:
1. Kiro の MCP パネルで MCP サーバーのステータスを確認してください
2. AWS 認証情報を確認してください。 `aws sts get-caller-identity`
3. CloudWatch の権限を確認します
4. Kiro を再起動して MCP 設定を再読み込みします

### 権限エラー

**問題**: レスポンスに "AccessDenied" エラーが発生する

**解決策**:
1. IAM 権限に以下が含まれていることを確認します。
   - `cloudwatch:GetMetricStatistics`
   - `cloudwatch:ListMetrics`
2. AWS リージョンが正しく設定されていることを確認します

### Python パスの問題

**問題**: "python3: command not found"

**解決策**:
1. Python のパスを確認します。 `which python3`
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
- ✅ "Which model costs the most?"
- ✅ "Show me latency for all models"
- ✅ "How many tokens did Claude use?"

### 3. 必要に応じて具体的に記述する

特定のモデルには、完全な ID を使用します。
```
What's the latency for anthropic.claude-3-haiku-20240307-v1:0?
```

### 4. コードコンテキストとの組み合わせ

コードを表示しながら質問することができます。
```
Based on this code, estimate the cost if we run it 1000 times
```

---

## 利用可能な MCP ツール

MCP サーバーは 5 つのツールを提供します。

| ツール | 説明 | クエリ例 |
|------|-------------|---------------|
| `get_token_usage` | モデル別のトークン消費量 | 「どのモデルが最もトークンを使用していますか？」 |
| `get_model_latency` | レイテンシー統計 | 「平均レイテンシーはどのくらいですか？」 |
| `get_request_count` | リクエストボリューム | 「リクエストは何回行われましたか？」 |
| `get_cost_estimate` | コスト見積もり | 「LLM コストを見積もってください」 |
| `compare_models` | 複数メトリクスの比較 | 「すべてのモデルを比較してください」 |

---

## 次のステップ

### デモ用スクリーンショットの撮影

1. デモを実行します。 `python3 AI-OBS_DEMO/multi-cloud-demo.py`
2. 1〜2 分待ちます
3. 「過去 1 時間の LLM 使用コストを見積もってください」と質問します
4. クエリと応答を示すスクリーンショットを撮ります

### ユースケースに合わせてカスタマイズする

編集 `mcp-server/cloudwatch_mcp_server.py` 以下の目的に使用できます。
- カスタムメトリクスの追加
- コスト計算式の変更
- 新しいクエリツールの追加
- 他の AWS サービスとの統合

### チームと共有する

1. コミットします。 `.kiro/settings/mcp.json` リポジトリに追加します
2. チームメンバーは自動的に MCP アクセスを取得します
3. 全員が IDE からオブザーバビリティデータをクエリできます

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

**ご質問は？** ご確認ください `MCP-DEMO-QUERIES.md` その他の例については、GitHub でイシューを開いてください。
