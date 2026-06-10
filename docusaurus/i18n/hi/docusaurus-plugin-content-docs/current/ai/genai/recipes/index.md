# AI Observability डेमो

मल्टी-क्लाउड AI-नेटिव फुल-स्टैक observability प्लेटफ़ॉर्म LLM वर्कलोड की मॉनिटरिंग के लिए।

## त्वरित शुरुआत

### पूर्वापेक्षाएं
- Bedrock एक्सेस के साथ AWS अकाउंट। यह डेमो us-east-1 में Claude 3 Haiku/Sonnet का उपयोग करता है, लेकिन आप `gateway/litellm-config.yaml` में मॉडल ID अपडेट करके किसी भी Bedrock-समर्थित मॉडल का उपयोग कर सकते हैं। Observability पाइपलाइन मॉडल-एग्नॉस्टिक है और LiteLLM द्वारा समर्थित किसी भी LLM प्रोवाइडर के साथ काम करती है।
- AdministratorAccess के साथ कॉन्फ़िगर किया गया AWS CLI
- Docker Desktop चालू
- Docker Compose v2
- Python 3.11+
- Terraform 1.5.0+

### फ़ेज 1: इंफ्रास्ट्रक्चर प्रोविज़निंग

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

### फ़ेज 2: एनवायरनमेंट कॉन्फ़िगरेशन

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

### फ़ेज 3: बिल्ड और लॉन्च

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

### फ़ेज 4: टेलीमेट्री सत्यापन

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

### फ़ेज 5: Grafana डैशबोर्ड

1. AWS Console खोलें → Amazon Managed Grafana → ai-observability-demo
2. "Open Grafana" पर क्लिक करें
3. डेटा सोर्स जोड़ें:
   - Prometheus: SigV4 auth के साथ AMP endpoint का उपयोग करें
   - CloudWatch: उस रीजन पर सेट करें जहां आपके रिसोर्स डिप्लॉय हैं
   - X-Ray: CloudWatch के समान रीजन पर सेट करें
4. डैशबोर्ड इम्पोर्ट करें: `grafana/dashboards/ai-observability.json`

### फ़ेज 6: MCP Server इंटीग्रेशन

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

:::tip Region कॉन्फ़िगरेशन
`AWS_REGION` को उस रीजन पर सेट करें जहां आपके observability रिसोर्स (AMP, CloudWatch, X-Ray) डिप्लॉय हैं। इन सेवाओं का समर्थन करने वाला कोई भी AWS रीजन काम करेगा।
:::

### Kiro में प्राकृतिक भाषा क्वेरी

एक बार कॉन्फ़िगर हो जाने पर, Kiro से पूछें:
- "अभी कौन सा मॉडल सबसे अधिक टोकन खपत कर रहा है?"
- "पिछले एक घंटे में Claude Haiku की P95 लेटेंसी क्या है?"
- "पिछले 30 मिनटों में कोई throttle इवेंट हुए हैं?"
- "आज LLM उपयोग की लागत का अनुमान लगाएं"
- "सभी सक्रिय मॉडलों में लेटेंसी की तुलना करें"

## टियरडाउन

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

## आर्किटेक्चर

- **OpenTelemetry**: GenAI सिमेंटिक कन्वेंशन के साथ वेंडर-न्यूट्रल इंस्ट्रूमेंटेशन
- **LiteLLM**: मल्टी-प्रोवाइडर AI गेटवे (AWS Bedrock, Azure OpenAI, आदि)
- **Amazon Managed Prometheus**: SigV4 auth के साथ स्केलेबल मेट्रिक्स स्टोरेज
- **AWS X-Ray**: LLM इनवोकेशन के लिए डिस्ट्रीब्यूटेड ट्रेसिंग
- **Amazon Managed Grafana**: AMP, CloudWatch, X-Ray में एकीकृत विज़ुअलाइज़ेशन
- **कस्टम MCP Server**: Kiro के माध्यम से प्राकृतिक भाषा observability क्वेरी

## मल्टी-क्लाउड में विस्तार

1. **Azure OpenAI**: `.env` में वास्तविक क्रेडेंशियल जोड़ें - LiteLLM स्वचालित रूप से राउटिंग संभालता है
2. **GCP Vertex AI**: `gateway/litellm-config.yaml` में Vertex AI मॉडल जोड़ें
3. **ऑन-प्रिमाइसेस मॉडल**: स्थानीय रूप से vLLM/Ollama डिप्लॉय करें, LiteLLM प्रोवाइडर के रूप में जोड़ें
4. **फ़ेडरेटेड मेट्रिक्स**: प्रत्येक क्लाउड में OTEL Collector डिप्लॉय करें, एक ही AMP workspace में remote write करें

## संदर्भ

- [OpenTelemetry GenAI Semantic Conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/)
- [Amazon Managed Prometheus](https://docs.aws.amazon.com/prometheus/)
- [Amazon Managed Grafana](https://docs.aws.amazon.com/grafana/)
- [LiteLLM Proxy](https://docs.litellm.ai/docs/proxy/quick_start)
- [AWS Bedrock Observability](https://docs.aws.amazon.com/bedrock/latest/userguide/monitoring-cloudwatch.html)
