# AI Observability Demo

பல கிளவுட் AI-நேட்டிவ் முழு-ஸ்டாக் observability தளம் LLM பணிச்சுமைகளை கண்காணிப்பதற்கானது.

## விரைவு தொடக்கம்

### முன்நிபந்தனைகள்
- Bedrock அணுகலுடன் AWS கணக்கு. இந்த demo us-east-1 இல் Claude 3 Haiku/Sonnet ஐ பயன்படுத்துகிறது, ஆனால் `gateway/litellm-config.yaml` இல் model ID ஐ புதுப்பிப்பதன் மூலம் எந்த Bedrock-ஆதரிக்கப்படும் மாடலையும் மாற்றலாம். Observability pipeline மாடல்-அக்னாஸ்டிக் மற்றும் LiteLLM ஆதரிக்கும் எந்த LLM provider உடனும் செயல்படும்.
- AdministratorAccess உடன் கட்டமைக்கப்பட்ட AWS CLI
- Docker Desktop இயங்குகிறது
- Docker Compose v2
- Python 3.11+
- Terraform 1.5.0+

### படிநிலை 1: உள்கட்டமைப்பு வழங்கல்

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

### படிநிலை 2: சூழல் கட்டமைப்பு

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

### படிநிலை 3: உருவாக்கம் மற்றும் தொடக்கம்

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

### படிநிலை 4: டெலிமெட்ரி சரிபார்ப்பு

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

### படிநிலை 5: Grafana டாஷ்போர்டு

1. AWS Console -> Amazon Managed Grafana -> ai-observability-demo ஐ திறக்கவும்
2. "Open Grafana" ஐ கிளிக் செய்யவும்
3. தரவு மூலங்களை சேர்க்கவும்:
   - Prometheus: SigV4 auth உடன் AMP எண்ட்பாயிண்ட் ஐ பயன்படுத்தவும்
   - CloudWatch: உங்கள் ரிசோர்ஸ்கள் டிப்ளாய் செய்யப்பட்ட region க்கு அமைக்கவும்
   - X-Ray: CloudWatch போன்ற அதே region க்கு அமைக்கவும்
4. டாஷ்போர்டை இறக்குமதி செய்யவும்: `grafana/dashboards/ai-observability.json`

### படிநிலை 6: MCP Server ஒருங்கிணைப்பு

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

:::tip Region கட்டமைப்பு
உங்கள் observability ரிசோர்ஸ்கள் (AMP, CloudWatch, X-Ray) டிப்ளாய் செய்யப்பட்ட region க்கு `AWS_REGION` ஐ அமைக்கவும். இந்த சேவைகளை ஆதரிக்கும் எந்த AWS region உம் செயல்படும்.
:::

### Kiro இல் இயற்கை மொழி வினவல்கள்

கட்டமைக்கப்பட்டவுடன், Kiro விடம் கேளுங்கள்:
- "இப்போது எந்த மாடல் அதிக டோக்கன்களை பயன்படுத்துகிறது?"
- "கடந்த ஒரு மணி நேரத்தில் Claude Haiku க்கான P95 latency என்ன?"
- "கடந்த 30 நிமிடங்களில் ஏதேனும் throttle events இருந்ததா?"
- "இன்று LLM பயன்பாட்டின் செலவை மதிப்பிடுங்கள்"
- "அனைத்து செயலில் உள்ள மாடல்களிலும் latency ஐ ஒப்பிடுங்கள்"

## நீக்குதல்

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

## கட்டமைப்பு

- **OpenTelemetry**: GenAI semantic conventions உடன் விற்பனையாளர்-நடுநிலை instrumentation
- **LiteLLM**: பல-provider AI gateway (AWS Bedrock, Azure OpenAI, போன்றவை)
- **Amazon Managed Prometheus**: SigV4 auth உடன் அளவிடக்கூடிய மெட்ரிக்குகள் சேமிப்பு
- **AWS X-Ray**: LLM invocations க்கான விநியோகிக்கப்பட்ட tracing
- **Amazon Managed Grafana**: AMP, CloudWatch, X-Ray முழுவதும் ஒருங்கிணைந்த காட்சிப்படுத்தல்
- **Custom MCP Server**: Kiro வழியாக இயற்கை மொழி observability வினவல்கள்

## பல கிளவுட்க்கு விரிவாக்கம்

1. **Azure OpenAI**: `.env` க்கு உண்மையான credentials ஐ சேர்க்கவும் - LiteLLM தானாகவே routing ஐ கையாளும்
2. **GCP Vertex AI**: `gateway/litellm-config.yaml` க்கு Vertex AI model ஐ சேர்க்கவும்
3. **On-premises models**: vLLM/Ollama ஐ உள்ளூரில் டிப்ளாய் செய்து, LiteLLM provider ஆக சேர்க்கவும்
4. **Federated metrics**: ஒவ்வொரு கிளவுட்டிலும் OTEL Collector ஐ டிப்ளாய் செய்து, அதே AMP workspace க்கு remote write செய்யவும்

## குறிப்புகள்

- [OpenTelemetry GenAI Semantic Conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/)
- [Amazon Managed Prometheus](https://docs.aws.amazon.com/prometheus/)
- [Amazon Managed Grafana](https://docs.aws.amazon.com/grafana/)
- [LiteLLM Proxy](https://docs.litellm.ai/docs/proxy/quick_start)
- [AWS Bedrock Observability](https://docs.aws.amazon.com/bedrock/latest/userguide/monitoring-cloudwatch.html)
