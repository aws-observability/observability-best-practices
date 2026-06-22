# AI Observability デモ

LLM ワークロードを監視するためのマルチクラウド AI ネイティブフルスタックオブザーバビリティプラットフォームです。

## クイックスタート

### 前提条件
- Bedrock へのアクセス権を持つ AWS アカウント。このデモでは us-east-1 の Claude 3 Haiku/Sonnet を使用していますが、モデル ID を更新することで Bedrock がサポートする任意のモデルに置き換えることができます。 `gateway/litellm-config.yaml`. オブザーバビリティパイプラインはモデルに依存せず、LiteLLM がサポートする任意の LLM プロバイダーで動作します。
- AdministratorAccess が設定された AWS CLI
- Docker Desktop の起動
- Docker Compose v2
- Python 3.11+
- Terraform 1.5.0+

### フェーズ 1: インフラストラクチャのプロビジョニング

```bash
cd AI-OBS_DEMO/terraform
terraform init
terraform plan -out=tfplan
terraform apply tfplan

# Capture outputs
export AMP_WORKSPACE_ID=$(terraform output -raw amp_workspace_id)
export AMP_REMOTE_WRITE_URL=$(terraform output -raw amp_remote_write_url)
export AMP_ENDPOINT=$(terraform output -raw amp_endpoint)
```

### フェーズ 2: 環境設定

```bash
cd ..
cp .env.example .env

# Edit .env with your AWS credentials and Terraform outputs
# Add:
# - AWS_ACCESS_KEY_ID
# - AWS_SECRET_ACCESS_KEY
# - AWS_SESSION_TOKEN (if using temporary credentials)
# - AMP_REMOTE_WRITE_URL (from Terraform)
# - AMP_ENDPOINT (from Terraform)
```

### フェーズ 3: ビルドと起動

```bash
# Build all services
docker compose build

# Start the stack
docker compose up -d

# Verify services
docker compose ps

# Check OTEL Collector health
curl http://localhost:13133

# Run demo and watch logs
docker compose logs -f ai-app
```

### フェーズ 4: テレメトリの検証

```bash
# Install awscurl
pip3 install awscurl

# Query AMP for token usage
awscurl --service aps --region us-east-1 \
  "${AMP_ENDPOINT}api/v1/query?query=gen_ai_usage_input_tokens_total"

# Check X-Ray traces in AWS Console
# Navigate to: X-Ray > Traces > Filter by service: ai-observability-demo

# Check CloudWatch logs
# Navigate to: CloudWatch > Log Groups > /ai-observability-demo
```

### フェーズ 5: Grafana ダッシュボード

1. AWS Console → Amazon Managed Grafana → ai-observability-demo を開きます。
2. 「Open Grafana」をクリックします。
3. データソースを追加します。
   - Prometheus: SigV4 認証を使用した AMP エンドポイントを使用します。
   - CloudWatch: リソースがデプロイされているリージョンに設定します。
   - X-Ray: CloudWatch と同じリージョンに設定します。
4. ダッシュボードをインポートします。 `grafana/dashboards/ai-observability.json`

### フェーズ 6: MCP Server 統合

```bash
# Install MCP server dependencies
cd mcp-server
pip3 install -r requirements.txt

# Configure Kiro MCP
# Add to .kiro/mcp.json:
{
  "mcpServers": {
    "ai-observability": {
      "command": "python3",
      "args": ["/path/to/AI-OBS_DEMO/mcp-server/prometheus_mcp_server.py"],
      "env": {
        "AMP_ENDPOINT": "your-amp-endpoint",
        "AWS_REGION": "your-aws-region",
        "AWS_ACCESS_KEY_ID": "your-key",
        "AWS_SECRET_ACCESS_KEY": "your-secret",
        "AWS_SESSION_TOKEN": "your-token"
      }
    }
  }
}
```

:::tip リージョン設定
設定 `AWS_REGION` オブザーバビリティリソース（AMP、CloudWatch、X-Ray）がデプロイされているリージョンに設定してください。これらのサービスをサポートする AWS リージョンであれば、どのリージョンでも使用できます。
:::

### Kiro での自然言語クエリ

設定が完了したら、Kiro に次のように質問してください。
- 「現在最もトークンを消費しているモデルはどれですか？」
- 「過去 1 時間の Claude Haiku の P95 レイテンシはどのくらいですか？」
- 「過去 30 分間にスロットルイベントはありましたか？」
- 「今日の LLM 使用コストを見積もってください」
- 「すべてのアクティブなモデルのレイテンシを比較してください」

## クリーンアップ

```bash
# Stop and remove containers
docker compose down

# Destroy AWS resources
cd terraform
terraform destroy -auto-approve

# Remove project (optional)
cd ../..
rm -rf AI-OBS_DEMO
```

## アーキテクチャ

- **OpenTelemetry**: GenAI セマンティック規約を使用したベンダー中立のインストルメンテーション
- **LiteLLM**: マルチプロバイダー AI ゲートウェイ（AWS Bedrock、Azure OpenAI など）
- **Amazon Managed Prometheus**: SigV4 認証を使用したスケーラブルなメトリクスストレージ
- **AWS X-Ray**: LLM 呼び出しの分散トレーシング
- **Amazon Managed Grafana**: AMP、CloudWatch、X-Ray にわたる統合ビジュアライゼーション
- **Custom MCP Server**: Kiro を介した自然言語オブザーバビリティクエリ

## マルチクラウドへの拡張

1. **Azure OpenAI**: 実際の認証情報を追加します `.env` - LiteLLM はルーティングを自動的に処理します
2. **GCP Vertex AI**: Vertex AI モデルを追加します `gateway/litellm-config.yaml`
3. **オンプレミスモデル**: vLLM/Ollama をローカルにデプロイし、LiteLLM プロバイダーとして追加する
4. **フェデレーテッドメトリクス**: 各クラウドに OTEL Collector をデプロイし、同じ AMP ワークスペースにリモート書き込みする

## 参考資料

- [OpenTelemetry GenAI セマンティック規約](https://opentelemetry.io/docs/specs/semconv/gen-ai/)
- [Amazon Managed Prometheus](https://docs.aws.amazon.com/prometheus/)
- [Amazon Managed Grafana](https://docs.aws.amazon.com/grafana/)
- [LiteLLM Proxy](https://docs.litellm.ai/docs/proxy/quick_start)
- [AWS Bedrock オブザーバビリティ](https://docs.aws.amazon.com/bedrock/latest/userguide/monitoring-cloudwatch.html)
