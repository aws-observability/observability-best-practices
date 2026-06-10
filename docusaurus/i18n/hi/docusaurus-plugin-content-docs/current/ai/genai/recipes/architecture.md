# Cloud-Agnostic AI Observability Platform - आर्किटेक्चर

## अवलोकन

यह दस्तावेज़ AWS managed services पर निर्मित एक cloud-agnostic AI Observability platform की आर्किटेक्चर का वर्णन करता है। यह platform कई cloud providers में Large Language Model (LLM) वर्कलोड के लिए एकीकृत monitoring, cost optimization, और operational insights प्रदान करता है।

## आर्किटेक्चर डायग्राम

![Architecture Diagram](./architecture_diagram.png)

## आर्किटेक्चर Components

### 1. LLM Providers Layer (Multi-Cloud)

यह platform कई providers में LLM invocations की monitoring support करता है:

:::info Model लचीलापन
नीचे सूचीबद्ध models इस demo में उपयोग किए गए हैं। चूंकि platform AI gateway के रूप में [LiteLLM](https://docs.litellm.ai/) का उपयोग करता है, आप LiteLLM द्वारा supported किसी भी LLM से replace कर सकते हैं -- बस `gateway/litellm-config.yaml` को अपने पसंदीदा models से update करें। Observability pipeline आपके model चयन की परवाह किए बिना समान रूप से काम करती है।
:::

#### AWS Bedrock
- **Models**: Claude 3 Haiku, Claude 3 Sonnet
- **Integration**: AWS SDK (boto3)
- **Metrics**: Token usage, latency, request counts
- **Dimension**: `CloudProvider=aws`

#### Google Vertex AI
- **Models**: Gemini 1.5 Pro, Gemini 1.5 Flash
- **Integration**: Simulated (production में Google Cloud SDK उपयोग होगा)
- **Metrics**: Token usage, latency, request counts
- **Dimension**: `CloudProvider=gcp`

#### Azure OpenAI
- **Models**: GPT-4o, GPT-4o Mini
- **Integration**: Simulated (production में Azure SDK उपयोग होगा)
- **Metrics**: Token usage, latency, request counts
- **Dimension**: `CloudProvider=azure`

#### On-Premises (Ollama)
- **Models**: Llama 3.1 70B, Mistral 7B
- **Integration**: Simulated (production में Ollama API उपयोग होगा)
- **Metrics**: Token usage, latency, request counts
- **Dimension**: `CloudProvider=on-prem`

### 2. Application Layer

#### Python Application
- **Framework**: Instrumentation के लिए OpenTelemetry SDK
- **Language**: Python 3.8+
- **जिम्मेदारियां**:
  - Providers में LLM APIs invoke करना
  - Telemetry collect करना (metrics, traces, logs)
  - OpenTelemetry Collector को data भेजना

#### OpenTelemetry Collector
- **Protocol**: OTLP (OpenTelemetry Protocol)
- **Format**: Cloud-agnostic, vendor-neutral
- **जिम्मेदारियां**:
  - Application से telemetry receive करना
  - Data transform और enrich करना
  - AWS services को export करना

### 3. AWS Observability Stack

#### Amazon CloudWatch
- **Service Type**: Managed metrics और monitoring
- **Region**: us-east-1
- **Namespace**: `AIObservability`
- **Metrics**:
  - `InputTokens` - Prompts के लिए token count
  - `OutputTokens` - Completions के लिए token count
  - `Latency` - Milliseconds में response time
- **Dimensions**:
  - `Model` - LLM model identifier
  - `CloudProvider` - Provider (aws, gcp, azure, on-prem)
- **Retention**: 15 महीने (default)
- **Cost**: प्रति metric प्रति माह $0.30 (पहले 10,000 metrics मुफ़्त)

#### AWS X-Ray
- **Service Type**: Distributed tracing
- **Region**: us-east-1
- **जिम्मेदारियां**:
  - Services में request flow ट्रैक करना
  - Performance bottlenecks पहचानना
  - Service dependencies visualize करना
- **Trace Format**: X-Ray segment documents
- **Retention**: 30 दिन
- **Cost**: 1 million traces recorded प्रति $5.00

#### CloudWatch Logs
- **Service Type**: Log aggregation और analysis
- **Region**: us-east-1
- **Log Group**: `/ai-observability-demo`
- **Format**: JSON structured logs
- **Features**:
  - Querying के लिए CloudWatch Logs Insights
  - Log retention policies
  - Alerting के लिए metric filters
- **Retention**: 7 दिन (configurable)
- **Cost**: प्रति GB ingested $0.50

#### Amazon Managed Prometheus (AMP)
- **Service Type**: Managed Prometheus-compatible monitoring
- **Region**: us-east-1
- **Workspace ID**: `<your-amp-workspace-id>`
- **Use Case**: Time-series metrics storage
- **Query Language**: PromQL
- **Retention**: 150 दिन
- **Cost**: 1 million samples ingested प्रति $0.10

#### Amazon Managed Grafana (AMG)
- **Service Type**: Visualization के लिए managed Grafana
- **Region**: us-east-1
- **Workspace ID**: `<your-amg-workspace-id>`
- **Authentication**: IAM Identity Center (SSO)
- **Data Sources**:
  - Amazon CloudWatch
  - AWS X-Ray
  - Amazon Managed Prometheus
- **Features**:
  - Template variables के साथ dynamic dashboards
  - Multi-cloud filtering
  - Auto-refresh (30 seconds)
- **Cost**: प्रति active user प्रति माह $9.00

### 4. Security और Access Control

#### IAM Role (Grafana Access)
- **Role Name**: `ai-observability-grafana-role`
- **उद्देश्य**: Grafana को AWS services query करने की अनुमति देना
- **Managed Policies**:
  - `CloudWatchReadOnlyAccess`
  - `AWSXRayReadOnlyAccess`
  - `AmazonPrometheusQueryAccess`
- **Trust Policy**: Grafana workspace को role assume करने की अनुमति
- **Least Privilege सिद्धांत**: केवल read-only access

#### IAM Identity Center (SSO)
- **Region**: us-east-2 (Ohio)
- **उद्देश्य**: Grafana users के लिए single sign-on
- **Users**: `<your-email>` (ADMIN role)
- **Integration**: SAML 2.0 authentication
- **लाभ**:
  - केंद्रीकृत user management
  - MFA support
  - Audit logging

### 5. Visualization और Query Layer

#### Grafana Dashboard
- **Type**: Template variables के साथ dynamic dashboard
- **File**: `grafana/dashboards/ai-observability-dynamic.json`
- **Features**:
  - Cloud Provider dropdown (auto-discovers: aws, gcp, azure, on-prem)
  - Model dropdown (सभी models auto-discover)
  - Multi-select filters
  - Real-time metrics (30s refresh)
- **Panels**:
  - Model-wise Input Tokens (time series)
  - Model-wise Output Tokens (time series)
  - Model-wise Latency (time series)
  - Total Requests (stat)
  - Average Latency (stat)

#### CloudWatch Dashboard
- **Name**: `AI-Observability-Demo`
- **Type**: Native CloudWatch dashboard
- **Widgets**:
  - Input/Output token metrics
  - Latency statistics
  - Request counts
- **Dimensions**: Model और CloudProvider
- **Access**: AWS Console

#### MCP Server (Natural Language Queries)
- **Technology**: Model Context Protocol
- **Language**: Python 3.8+
- **Integration**: Kiro IDE
- **Tools**:
  - `get_token_usage` - Token consumption query
  - `get_model_latency` - Latency statistics query
  - `get_request_count` - Request volumes query
  - `get_cost_estimate` - Cost estimate
  - `compare_models` - Side-by-side comparison
- **Query Examples**:
  - "कौन सा model सबसे अधिक tokens consume कर रहा है?"
  - "Claude Haiku की average latency क्या है?"
  - "पिछले एक घंटे के LLM costs estimate करें"

#### Kiro IDE Integration
- **उद्देश्य**: Developer-centric Observability
- **Features**:
  - IDE में natural language queries
  - Dashboards पर context switch करने की आवश्यकता नहीं
  - Development के दौरान real-time metrics
- **Configuration**: `kiro-mcp-config.json`

### 6. Alerting और Notifications

#### CloudWatch Alarms
- **उद्देश्य**: Proactive monitoring और alerting
- **Alarm Types**:
  - Cost threshold breaches
  - Latency SLA violations
  - Error rate increases
  - Token usage anomalies
- **Actions**: SNS notifications trigger करना

#### Amazon SNS
- **उद्देश्य**: Multi-channel notifications
- **Channels**:
  - Email
  - SMS
  - Slack (webhook द्वारा)
  - PagerDuty integration
- **Subscribers**: Operations team

## Data Flow

### 1. LLM Invocation Flow

```
User Request → Application → LLM Provider API
                    ↓
            OpenTelemetry SDK
                    ↓
         (Collect Telemetry)
                    ↓
            OTLP Collector
```

### 2. Telemetry Export Flow

```
OTLP Collector → CloudWatch (Metrics)
              → X-Ray (Traces)
              → CloudWatch Logs (Logs)
              → Prometheus (Time Series)
```

### 3. Visualization Flow

```
CloudWatch/X-Ray/Prometheus → Grafana → Users
                           → CloudWatch Dashboard → Users
```

### 4. Query Flow (MCP)

```
Developer → Kiro IDE → MCP Server → CloudWatch API → Response
```

### 5. Alerting Flow

```
CloudWatch Metrics → Alarm Threshold → SNS → Operations Team
```

## प्रमुख Design Decisions

### 1. Cloud-Agnostic Approach

**निर्णय**: OpenTelemetry को instrumentation standard के रूप में उपयोग करना

**तर्क**:
- Vendor-neutral, open-source standard
- किसी भी LLM provider के साथ काम करता है
- Provider changes के विरुद्ध future-proof
- Cloud platforms में portable

**Trade-offs**:
- अतिरिक्त abstraction layer
- OTLP collector setup आवश्यक
- OpenTelemetry की learning curve

### 2. AWS Managed Services

**निर्णय**: Self-hosted की जगह Amazon Managed Grafana और Prometheus उपयोग करना

**तर्क**:
- कोई infrastructure management overhead नहीं
- Built-in high availability और scalability
- Automatic patching और updates
- AWS-native security integration
- Pay-per-use pricing model

**Trade-offs**:
- Self-hosted से अधिक cost (बड़े scale पर)
- कम customization flexibility
- AWS region dependency

### 3. Dimensional Metrics

**निर्णय**: Metric name prefixes की जगह CloudWatch dimensions (Model, CloudProvider) उपयोग करना

**तर्क**:
- Flexible querying और aggregation
- Efficient storage (कोई metric explosion नहीं)
- Grafana में dynamic filtering support
- नई dimensions जोड़ना आसान

**Trade-offs**:
- CloudWatch dimension limits (प्रति metric 30)
- सावधानीपूर्वक dimension design आवश्यक
- Query complexity बढ़ती है

### 4. SSO के लिए IAM Identity Center

**निर्णय**: Grafana native authentication की जगह IAM Identity Center उपयोग करना

**तर्क**:
- केंद्रीकृत user management
- Out of the box MFA support
- Compliance के लिए audit logging
- Corporate identity providers के साथ integration

**Trade-offs**:
- अतिरिक्त AWS service dependency
- Setup complexity
- Regional constraints (us-east-2)

### 5. Natural Language Queries के लिए MCP

**निर्णय**: मौजूदा query tools की जगह custom MCP server बनाना

**तर्क**:
- Developer-centric experience
- Context switching कम करता है
- Natural language interface
- IDE integration

**Trade-offs**:
- Maintain करने के लिए custom code
- Supported IDEs तक सीमित
- MCP protocol knowledge आवश्यक

## Scalability Considerations

### Metrics Volume

**वर्तमान Scale**:
- प्रति invocation 3 metrics (InputTokens, OutputTokens, Latency)
- प्रति metric 2 dimensions (Model, CloudProvider)
- Demo में प्रति मिनट ~10 invocations

**Production Scale Estimate**:
- प्रति सेकंड 1,000 invocations
- प्रति मिनट 180,000 metric data points
- प्रति दिन 259 million data points

**CloudWatch Limits**:
- प्रति account प्रति region 1,000 transactions per second (TPS)
- प्रति API 150 TPS (PutMetricData)
- समाधान: Batching उपयोग करें (प्रति request 1,000 metrics तक)

### Cost Optimization

**रणनीतियां**:
1. **Metric Aggregation**: CloudWatch को भेजने से पहले metrics pre-aggregate करें
2. **Sampling**: High-volume workloads के लिए traces sample करें (जैसे requests का 10%)
3. **Retention Policies**: Non-critical logs का retention कम करें
4. **Reserved Capacity**: Predictable workloads के लिए Savings Plans उपयोग करें

**अनुमानित मासिक Cost** (1M invocations/day):
- CloudWatch Metrics: ~$90
- CloudWatch Logs: ~$15
- X-Ray: ~$150
- Amazon Managed Grafana: $9 प्रति user
- Amazon Managed Prometheus: ~$30
- **कुल**: ~$300/माह + $9 प्रति user

### High Availability

**Built-in HA**:
- CloudWatch: Default रूप से Multi-AZ
- X-Ray: Default रूप से Multi-AZ
- Amazon Managed Grafana: Multi-AZ deployment
- Amazon Managed Prometheus: Multi-AZ deployment

**Application HA**:
- कई AZs में application deploy करें
- Distribution के लिए Application Load Balancer उपयोग करें
- Exponential backoff के साथ retry logic implement करें

## Security Best Practices

### 1. Least Privilege Access

- Grafana role के पास AWS services का केवल read-only access
- CloudWatch, X-Ray, या Prometheus में कोई write permissions नहीं
- विभिन्न user groups के लिए अलग roles

### 2. Encryption

- **At Rest**: AWS KMS से encrypted CloudWatch Logs
- **In Transit**: सभी API calls के लिए TLS 1.2+
- **Grafana**: Valid SSL certificate के साथ केवल HTTPS

### 3. Network Security

- AWS-managed VPC में Grafana workspace
- Backend services तक कोई public internet access नहीं
- AWS service access के लिए VPC endpoints (वैकल्पिक)

### 4. Audit Logging

- CloudTrail सभी API calls लॉग करता है
- CloudWatch में Grafana access logs
- IAM Identity Center audit logs

### 5. Secrets Management

- IAM roles द्वारा AWS credentials (कोई hardcoded keys नहीं)
- AWS Secrets Manager में LLM API keys
- Automatic key rotation policies

## Monitoring System की Monitoring

### Meta-Monitoring

**Platform Health के लिए CloudWatch Metrics**:
- Grafana workspace status
- Prometheus workspace status
- API call success rates
- Query latency

**Alarms**:
- Grafana workspace unavailable
- CloudWatch API throttling
- X-Ray trace ingestion failures

## Disaster Recovery

### Backup Strategy

**CloudWatch**:
- Metrics: 15 महीने retained (backup आवश्यक नहीं)
- Logs: Long-term retention के लिए S3 में export
- Dashboards: Git में version controlled

**Grafana**:
- Dashboards: JSON में exported, Git में stored
- Data sources: Code के रूप में configuration (Terraform)
- Users: IAM Identity Center द्वारा managed

**Recovery Time Objective (RTO)**: 1 घंटा
**Recovery Point Objective (RPO)**: 5 मिनट

### Disaster Recovery Plan

1. **Infrastructure**: Terraform द्वारा redeploy
2. **Dashboards**: Git repository से import
3. **Data**: CloudWatch data persist करता है (कोई action आवश्यक नहीं)
4. **Users**: IAM Identity Center द्वारा reassign

## भविष्य के सुधार

### अल्पकालिक (1-3 महीने)

1. **Anomaly Detection**: असामान्य patterns के लिए ML-powered alerts
2. **Cost Forecasting**: Trends पर आधारित monthly costs predict करना
3. **SLO Tracking**: Service Level Objective monitoring
4. **Multi-Region**: AWS regions में metrics aggregate करना

### मध्यकालिक (3-6 महीने)

1. **Advanced Analytics**: BigQuery/Athena integration
2. **Custom Dashboards**: Team-specific views
3. **Integration Testing**: Automated Observability tests
4. **API Gateway**: External integrations के लिए RESTful API

### दीर्घकालिक (6-12 महीने)

1. **AI-Powered Insights**: Automated root cause analysis
2. **Predictive Scaling**: Forecasts पर आधारित quotas auto-adjust
3. **Cost Optimization Engine**: Automated model selection
4. **Compliance Automation**: Automated audit reports

## संदर्भ

### AWS Services Documentation
- [Amazon CloudWatch](https://docs.aws.amazon.com/cloudwatch/)
- [AWS X-Ray](https://docs.aws.amazon.com/xray/)
- [Amazon Managed Grafana](https://docs.aws.amazon.com/grafana/)
- [Amazon Managed Prometheus](https://docs.aws.amazon.com/prometheus/)
- [IAM Identity Center](https://docs.aws.amazon.com/singlesignon/)

### Standards और Protocols
- [OpenTelemetry](https://opentelemetry.io/docs/)
- [OTLP Specification](https://opentelemetry.io/docs/specs/otlp/)
- [Model Context Protocol](https://modelcontextprotocol.io/)

### Related Patterns
- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)
- [Observability Best Practices](https://aws.amazon.com/blogs/mt/observability-best-practices/)
- [Multi-Cloud Architecture Patterns](https://aws.amazon.com/blogs/architecture/)

---

**Document Version**: 1.0  
**अंतिम अपडेट**: फरवरी 2026  
**Maintained By**: AWS Solutions Architecture Team
