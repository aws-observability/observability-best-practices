# AI Observability డెమో

మల్టీ-క్లౌడ్ AI-నేటివ్ ఫుల్-స్టాక్ observability ప్లాట్‌ఫారమ్ LLM వర్క్‌లోడ్‌లను మానిటరింగ్ చేయడానికి.

## త్వరిత ప్రారంభం

### ముందస్తు అవసరాలు
- Bedrock యాక్సెస్ ఉన్న AWS ఖాతా. ఈ డెమో us-east-1 లో Claude 3 Haiku/Sonnet ని ఉపయోగిస్తుంది, కానీ `gateway/litellm-config.yaml` లో మోడల్ ID ని అప్‌డేట్ చేయడం ద్వారా ఏదైనా Bedrock-సపోర్టెడ్ మోడల్‌ను ప్రత్యామ్నాయంగా ఉపయోగించవచ్చు. Observability పైప్‌లైన్ మోడల్-అజ్ఞేయం మరియు LiteLLM సపోర్ట్ చేసే ఏ LLM ప్రొవైడర్‌తోనైనా పని చేస్తుంది.
- AdministratorAccess తో కాన్ఫిగర్ చేయబడిన AWS CLI
- Docker Desktop రన్ అవుతూ ఉండాలి
- Docker Compose v2
- Python 3.11+
- Terraform 1.5.0+

### దశ 1: ఇన్‌ఫ్రాస్ట్రక్చర్ ప్రొవిజనింగ్

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

### దశ 2: ఎన్విరాన్‌మెంట్ కాన్ఫిగరేషన్

```bash
cd ..
cp .env.example .env

# మీ AWS credentials మరియు Terraform outputs తో .env ను సవరించండి
# జోడించండి:
# - AWS_ACCESS_KEY_ID
# - AWS_SECRET_ACCESS_KEY
# - AWS_SESSION_TOKEN (తాత్కాలిక credentials ఉపయోగిస్తుంటే)
# - AMP_REMOTE_WRITE_URL (Terraform నుండి)
# - AMP_ENDPOINT (Terraform నుండి)
```

### దశ 3: బిల్డ్ మరియు లాంచ్

```bash
# అన్ని సర్వీసులను బిల్డ్ చేయండి
docker compose build

# స్టాక్‌ను ప్రారంభించండి
docker compose up -d

# సర్వీసులను ధ్రువీకరించండి
docker compose ps

# OTEL Collector ఆరోగ్యాన్ని తనిఖీ చేయండి
curl http://localhost:13133

# డెమో రన్ చేసి లాగ్‌లను చూడండి
docker compose logs -f ai-app
```

### దశ 4: టెలిమెట్రీ ధ్రువీకరణ

```bash
# awscurl ను ఇన్‌స్టాల్ చేయండి
pip3 install awscurl

# టోకెన్ వాడకం కోసం AMP ను క్వెరీ చేయండి
awscurl --service aps --region us-east-1 \
  "${AMP_ENDPOINT}api/v1/query?query=gen_ai_usage_input_tokens_total"

# AWS Console లో X-Ray ట్రేసెస్ తనిఖీ చేయండి
# ఇక్కడకు నావిగేట్ చేయండి: X-Ray > Traces > Filter by service: ai-observability-demo

# CloudWatch లాగ్‌లు తనిఖీ చేయండి
# ఇక్కడకు నావిగేట్ చేయండి: CloudWatch > Log Groups > /ai-observability-demo
```

### దశ 5: Grafana డాష్‌బోర్డ్

1. AWS Console తెరవండి → Amazon Managed Grafana → ai-observability-demo
2. "Open Grafana" క్లిక్ చేయండి
3. డేటా సోర్స్‌లను జోడించండి:
   - Prometheus: SigV4 auth తో AMP ఎండ్‌పాయింట్ ఉపయోగించండి
   - CloudWatch: మీ రిసోర్స్‌లు డిప్లాయ్ చేయబడిన region కు సెట్ చేయండి
   - X-Ray: CloudWatch తో అదే region కు సెట్ చేయండి
4. డాష్‌బోర్డ్ ఇంపోర్ట్ చేయండి: `grafana/dashboards/ai-observability.json`

### దశ 6: MCP Server ఇంటిగ్రేషన్

```bash
# MCP server dependencies ఇన్‌స్టాల్ చేయండి
cd mcp-server
pip3 install -r requirements.txt

# Kiro MCP కాన్ఫిగర్ చేయండి
# .kiro/mcp.json కు జోడించండి:
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

:::tip Region కాన్ఫిగరేషన్
మీ observability రిసోర్స్‌లు (AMP, CloudWatch, X-Ray) డిప్లాయ్ చేయబడిన region కు `AWS_REGION` ను సెట్ చేయండి. ఈ సేవలకు మద్దతు ఇచ్చే ఏ AWS region అయినా పని చేస్తుంది.
:::

### Kiro లో నేచురల్ లాంగ్వేజ్ క్వెరీలు

కాన్ఫిగర్ చేసిన తర్వాత, Kiro ను అడగండి:
- "ప్రస్తుతం ఏ మోడల్ అత్యధిక టోకెన్‌లను వినియోగిస్తోంది?"
- "గత గంటలో Claude Haiku కోసం P95 latency ఏమిటి?"
- "గత 30 నిమిషాలలో throttle ఈవెంట్‌లు ఏమైనా ఉన్నాయా?"
- "ఈ రోజు LLM వాడకం ఖర్చును అంచనా వేయండి"
- "అన్ని యాక్టివ్ మోడల్‌లలో latency ని పోల్చండి"

## టేర్‌డౌన్

```bash
# కంటైనర్‌లను ఆపి తొలగించండి
docker compose down

# AWS రిసోర్స్‌లను నాశనం చేయండి
cd terraform
terraform destroy -auto-approve

# ప్రాజెక్ట్‌ను తొలగించండి (ఐచ్ఛికం)
cd ../..
rm -rf AI-OBS_DEMO
```

## ఆర్కిటెక్చర్

- **OpenTelemetry**: GenAI సెమాంటిక్ కన్వెన్షన్‌లతో వెండార్-న్యూట్రల్ ఇన్‌స్ట్రుమెంటేషన్
- **LiteLLM**: మల్టీ-ప్రొవైడర్ AI గేట్‌వే (AWS Bedrock, Azure OpenAI, మొదలైనవి)
- **Amazon Managed Prometheus**: SigV4 auth తో స్కేలబుల్ మెట్రిక్స్ స్టోరేజ్
- **AWS X-Ray**: LLM ఇన్వొకేషన్‌ల కోసం డిస్ట్రిబ్యూటెడ్ ట్రేసింగ్
- **Amazon Managed Grafana**: AMP, CloudWatch, X-Ray అంతటా ఏకీకృత విజువలైజేషన్
- **కస్టమ్ MCP Server**: Kiro ద్వారా నేచురల్ లాంగ్వేజ్ observability క్వెరీలు

## మల్టీ-క్లౌడ్‌కు విస్తరించడం

1. **Azure OpenAI**: `.env` కు నిజమైన credentials జోడించండి - LiteLLM స్వయంచాలకంగా రూటింగ్ నిర్వహిస్తుంది
2. **GCP Vertex AI**: `gateway/litellm-config.yaml` కు Vertex AI మోడల్ జోడించండి
3. **ఆన్-ప్రెమిసెస్ మోడల్‌లు**: vLLM/Ollama ను స్థానికంగా డిప్లాయ్ చేయండి, LiteLLM ప్రొవైడర్‌గా జోడించండి
4. **ఫెడరేటెడ్ మెట్రిక్స్**: ప్రతి క్లౌడ్‌లో OTEL Collector డిప్లాయ్ చేయండి, అదే AMP వర్క్‌స్పేస్‌కు remote write చేయండి

## సూచనలు

- [OpenTelemetry GenAI Semantic Conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/)
- [Amazon Managed Prometheus](https://docs.aws.amazon.com/prometheus/)
- [Amazon Managed Grafana](https://docs.aws.amazon.com/grafana/)
- [LiteLLM Proxy](https://docs.litellm.ai/docs/proxy/quick_start)
- [AWS Bedrock Observability](https://docs.aws.amazon.com/bedrock/latest/userguide/monitoring-cloudwatch.html)
