# AI Observability Demo

Multi-cloud AI-native full-stack observability platform for monitoring LLM workloads.

## Quick Start

### Prerequisites
- AWS Account with Bedrock access. This demo uses Claude 3 Haiku/Sonnet in us-east-1, but you can substitute any Bedrock-supported model by updating the model ID in `gateway/litellm-config.yaml`. The observability pipeline is model-agnostic and works with any LLM provider supported by LiteLLM.
- AWS CLI configured with AdministratorAccess
- Docker Desktop running
- Docker Compose v2
- Python 3.11+
- Terraform 1.5.0+

### Phase 1: Infrastructure Provisioning

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

### Phase 2: Environment Configuration

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

### Phase 3: Build and Launch

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

### Phase 4: Validate Telemetry

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

### Phase 5: Grafana Dashboard

1. Open AWS Console → Amazon Managed Grafana → ai-observability-demo
2. Click "Open Grafana"
3. Add data sources:
   - Prometheus: Use AMP endpoint with SigV4 auth
   - CloudWatch: Set to the region where your resources are deployed
   - X-Ray: Set to the same region as CloudWatch
4. Import dashboard: `grafana/dashboards/ai-observability.json`

### Phase 6: MCP Server Integration

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

:::tip Region Configuration
Set `AWS_REGION` to the region where your observability resources (AMP, CloudWatch, X-Ray) are deployed. Any AWS region that supports these services will work.
:::

### Natural Language Queries in Kiro

Once configured, ask Kiro:
- "Which model is consuming the most tokens right now?"
- "What is the P95 latency for Claude Haiku over the last hour?"
- "Have there been any throttle events in the last 30 minutes?"
- "Estimate the cost of LLM usage today"
- "Compare latency across all active models"

## Teardown

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

## Architecture

- **OpenTelemetry**: Vendor-neutral instrumentation with GenAI semantic conventions
- **LiteLLM**: Multi-provider AI gateway (AWS Bedrock, Azure OpenAI, etc.)
- **Amazon Managed Prometheus**: Scalable metrics storage with SigV4 auth
- **AWS X-Ray**: Distributed tracing for LLM invocations
- **Amazon Managed Grafana**: Unified visualization across AMP, CloudWatch, X-Ray
- **Custom MCP Server**: Natural language observability queries via Kiro

## Extending to Multi-Cloud

1. **Azure OpenAI**: Add real credentials to `.env` - LiteLLM handles routing automatically
2. **GCP Vertex AI**: Add Vertex AI model to `gateway/litellm-config.yaml`
3. **On-premises models**: Deploy vLLM/Ollama locally, add as LiteLLM provider
4. **Federated metrics**: Deploy OTEL Collector in each cloud, remote write to same AMP workspace

## References

- [OpenTelemetry GenAI Semantic Conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/)
- [Amazon Managed Prometheus](https://docs.aws.amazon.com/prometheus/)
- [Amazon Managed Grafana](https://docs.aws.amazon.com/grafana/)
- [LiteLLM Proxy](https://docs.litellm.ai/docs/proxy/quick_start)
- [AWS Bedrock Observability](https://docs.aws.amazon.com/bedrock/latest/userguide/monitoring-cloudwatch.html)
