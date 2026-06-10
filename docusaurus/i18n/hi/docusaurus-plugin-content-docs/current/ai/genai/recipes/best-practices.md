# GenAI Observability कार्यान्वयन सर्वोत्तम प्रथाएं

## अवलोकन

यह गाइड प्रोडक्शन-रेडी GenAI observability समाधान बनाने के लिए सामरिक, कार्यान्वयन-विशिष्ट सर्वोत्तम प्रथाएं प्रदान करती है। ये प्रथाएं वास्तविक दुनिया के डिप्लॉयमेंट और सीखे गए अनुभवों पर आधारित हैं।

## OpenTelemetry इंस्ट्रूमेंटेशन

### मेट्रिक नामकरण परंपराएं

**सुसंगत, वर्णनात्मक नामों का उपयोग करें:**

```python
# ✅ Good - Clear, hierarchical naming
"genai.token.input.count"
"genai.token.output.count"
"genai.request.duration"
"genai.request.error.count"

# ❌ Bad - Ambiguous, inconsistent
"tokens"
"input_tok"
"req_time"
"errors"
```

### आवश्यक डाइमेंशन

**हमेशा ये डाइमेंशन शामिल करें:**

```python
dimensions = {
    "model": "anthropic.claude-3-haiku-20240307-v1:0",
    "cloud_provider": "aws",  # aws, gcp, azure, on-prem
    "application": "chatbot",
    "environment": "production",
    "region": "us-east-1"
}
```

### वैकल्पिक लेकिन अनुशंसित डाइमेंशन

```python
optional_dimensions = {
    "user_id": "hashed_user_id",  # Hash for privacy
    "session_id": "session_123",
    "prompt_template": "customer_support_v2",
    "model_version": "2024-03-07",
    "feature_flag": "new_prompt_enabled"
}
```

### इंस्ट्रूमेंटेशन कोड उदाहरण

```python
from opentelemetry import metrics
from opentelemetry.sdk.metrics import MeterProvider
from opentelemetry.exporter.otlp.proto.grpc.metric_exporter import OTLPMetricExporter

# Initialize meter
meter = metrics.get_meter(__name__)

# Create instruments
token_input_counter = meter.create_counter(
    name="genai.token.input.count",
    description="Number of input tokens consumed",
    unit="tokens"
)

token_output_counter = meter.create_counter(
    name="genai.token.output.count",
    description="Number of output tokens generated",
    unit="tokens"
)

latency_histogram = meter.create_histogram(
    name="genai.request.duration",
    description="Request duration in milliseconds",
    unit="ms"
)

# Record metrics
def record_llm_metrics(model, provider, input_tokens, output_tokens, latency_ms):
    dimensions = {
        "model": model,
        "cloud_provider": provider
    }
    
    token_input_counter.add(input_tokens, dimensions)
    token_output_counter.add(output_tokens, dimensions)
    latency_histogram.record(latency_ms, dimensions)
```

## CloudWatch कॉन्फ़िगरेशन

### मेट्रिक नेमस्पेस रणनीति

**श्रेणीबद्ध नेमस्पेस का उपयोग करें:**

```
AIObservability              # Root namespace
├── Production               # Environment-specific
│   ├── Chatbot             # Application-specific
│   └── SearchAssistant
└── Development
```

### मेट्रिक अवधि चयन

**उचित अवधि चुनें:**

- **उच्च-आवृत्ति मेट्रिक्स** (request count, errors): 60 सेकंड
- **मध्यम-आवृत्ति मेट्रिक्स** (latency, tokens): 300 सेकंड (5 मिनट)
- **निम्न-आवृत्ति मेट्रिक्स** (daily costs): 3600 सेकंड (1 घंटा)

### CloudWatch Logs संरचना

**स्ट्रक्चर्ड लॉगिंग का उपयोग करें:**

```json
{
  "timestamp": "2026-03-04T10:30:00Z",
  "level": "INFO",
  "model": "gpt-4o",
  "cloud_provider": "azure",
  "input_tokens": 45,
  "output_tokens": 234,
  "latency_ms": 1523,
  "cost_usd": 0.0234,
  "user_id": "hashed_abc123",
  "prompt_template": "summarization_v3",
  "success": true
}
```

### Log Group संगठन

```
/genai-observability/
├── application-logs          # Application-level logs
├── model-invocations        # LLM request/response logs
├── errors                   # Error logs only
└── audit                    # Compliance audit trail
```

## Grafana डैशबोर्ड डिज़ाइन

### डैशबोर्ड पदानुक्रम

**विभिन्न दर्शकों के लिए डैशबोर्ड बनाएं:**

1. **एग्जीक्यूटिव डैशबोर्ड** - उच्च-स्तरीय KPI
   - कुल दैनिक लागत
   - अनुरोध मात्रा रुझान
   - एरर दर
   - उपयोग के अनुसार शीर्ष मॉडल

2. **ऑपरेशन डैशबोर्ड** - रीयल-टाइम मॉनिटरिंग
   - वर्तमान अनुरोध दर
   - सक्रिय एरर
   - लेटेंसी पर्सेंटाइल
   - प्रोवाइडर स्वास्थ्य स्थिति

3. **डेवलपर डैशबोर्ड** - डीबगिंग और ऑप्टिमाइज़ेशन
   - अनुरोध ट्रेस
   - फ़ीचर के अनुसार टोकन उपयोग
   - लेटेंसी ब्रेकडाउन
   - एरर विवरण

4. **FinOps डैशबोर्ड** - लागत प्रबंधन
   - मॉडल के अनुसार लागत
   - टीम/प्रोजेक्ट के अनुसार लागत
   - लागत रुझान और पूर्वानुमान
   - ऑप्टिमाइज़ेशन अवसर

### पैनल सर्वोत्तम प्रथाएं

**टाइम सीरीज़ पैनल:**
```json
{
  "type": "timeseries",
  "title": "Token Usage by Model",
  "targets": [{
    "expr": "sum by (model) (rate(genai_token_input_count[5m]))",
    "legendFormat": "{{model}}"
  }],
  "options": {
    "legend": {"displayMode": "table", "placement": "right"},
    "tooltip": {"mode": "multi"}
  }
}
```

**KPI के लिए Stat पैनल:**
```json
{
  "type": "stat",
  "title": "Total Requests (24h)",
  "targets": [{
    "expr": "sum(increase(genai_request_count[24h]))"
  }],
  "options": {
    "colorMode": "background",
    "graphMode": "area"
  },
  "thresholds": {
    "steps": [
      {"value": 0, "color": "green"},
      {"value": 10000, "color": "yellow"},
      {"value": 50000, "color": "red"}
    ]
  }
}
```

### वेरिएबल टेम्पलेट

**फ़िल्टरिंग के लिए डैशबोर्ड वेरिएबल का उपयोग करें:**

```json
{
  "templating": {
    "list": [
      {
        "name": "cloud_provider",
        "type": "query",
        "query": "label_values(genai_token_input_count, cloud_provider)",
        "multi": true,
        "includeAll": true
      },
      {
        "name": "model",
        "type": "query",
        "query": "label_values(genai_token_input_count{cloud_provider=~\"$cloud_provider\"}, model)",
        "multi": true,
        "includeAll": true
      }
    ]
  }
}
```

## अलर्ट कॉन्फ़िगरेशन

### अलर्ट थ्रेशोल्ड अनुशंसाएं

**एरर दर अलर्ट:**
```yaml
# Critical - Page immediately
- alert: HighErrorRate
  expr: rate(genai_request_error_count[5m]) > 0.05
  for: 5m
  labels:
    severity: critical
  annotations:
    summary: "Error rate above 5% for 5 minutes"

# Warning - Investigate during business hours
- alert: ElevatedErrorRate
  expr: rate(genai_request_error_count[5m]) > 0.02
  for: 15m
  labels:
    severity: warning
```

**लेटेंसी अलर्ट:**
```yaml
- alert: HighLatency
  expr: histogram_quantile(0.95, rate(genai_request_duration_bucket[5m])) > 10000
  for: 10m
  labels:
    severity: warning
  annotations:
    summary: "P95 latency above 10 seconds"
```

**लागत अलर्ट:**
```yaml
- alert: DailyCostSpike
  expr: sum(increase(genai_cost_usd[1h])) > 100
  labels:
    severity: warning
  annotations:
    summary: "Hourly cost exceeds $100"

- alert: MonthlyBudgetExceeded
  expr: sum(increase(genai_cost_usd[30d])) > 10000
  labels:
    severity: critical
  annotations:
    summary: "Monthly budget of $10,000 exceeded"
```

### अलर्ट राउटिंग

**अलर्ट को उचित चैनलों में रूट करें:**

```yaml
route:
  group_by: ['alertname', 'cloud_provider']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h
  receiver: 'default'
  routes:
    - match:
        severity: critical
      receiver: 'pagerduty'
    - match:
        severity: warning
      receiver: 'slack-ops'
    - match:
        alertname: MonthlyBudgetExceeded
      receiver: 'slack-finops'
```

## MCP Server डिप्लॉयमेंट

### सर्वर कॉन्फ़िगरेशन

**प्रोडक्शन-रेडी MCP सर्वर सेटअप:**

```python
# mcp_server_config.py
import os

CONFIG = {
    "server": {
        "host": "0.0.0.0",
        "port": int(os.getenv("MCP_PORT", "8080")),
        "workers": int(os.getenv("MCP_WORKERS", "4"))
    },
    "cloudwatch": {
        "region": os.getenv("AWS_REGION", "us-east-1"),
        "namespace": "AIObservability",
        "log_group": "/genai-observability/mcp-server"
    },
    "cache": {
        "enabled": True,
        "ttl_seconds": 300,  # 5 minutes
        "max_size": 1000
    },
    "rate_limiting": {
        "enabled": True,
        "requests_per_minute": 60
    }
}
```

### क्वेरी ऑप्टिमाइज़ेशन

**CloudWatch क्वेरी को ऑप्टिमाइज़ करें:**

```python
# ✅ Good - Use specific time ranges and dimensions
def get_token_usage(model, hours=1):
    end_time = datetime.utcnow()
    start_time = end_time - timedelta(hours=hours)
    
    response = cloudwatch.get_metric_statistics(
        Namespace='AIObservability',
        MetricName='InputTokens',
        Dimensions=[
            {'Name': 'Model', 'Value': model},
            {'Name': 'CloudProvider', 'Value': 'aws'}
        ],
        StartTime=start_time,
        EndTime=end_time,
        Period=300,  # 5 minutes
        Statistics=['Sum']
    )
    return response

# ❌ Bad - Querying all data without filters
def get_all_metrics():
    response = cloudwatch.get_metric_statistics(
        Namespace='AIObservability',
        MetricName='InputTokens',
        StartTime=datetime(2020, 1, 1),  # Too broad
        EndTime=datetime.utcnow(),
        Period=60,  # Too granular
        Statistics=['Sum', 'Average', 'Min', 'Max']  # Unnecessary stats
    )
```

### कैशिंग रणनीति

**बुद्धिमान कैशिंग लागू करें:**

```python
from functools import lru_cache
from datetime import datetime, timedelta

@lru_cache(maxsize=100)
def get_cached_metrics(model, cloud_provider, time_bucket):
    """Cache metrics by 5-minute time buckets"""
    # time_bucket = current_time // 300 (5 minutes)
    return fetch_metrics_from_cloudwatch(model, cloud_provider)

def get_metrics_with_cache(model, cloud_provider):
    current_time = int(datetime.utcnow().timestamp())
    time_bucket = current_time // 300  # 5-minute buckets
    return get_cached_metrics(model, cloud_provider, time_bucket)
```

## लागत ऑप्टिमाइज़ेशन

### मेट्रिक सैंपलिंग

**उच्च-मात्रा मेट्रिक्स का सैंपल करें:**

```python
import random

def should_sample(sample_rate=0.1):
    """Sample 10% of requests"""
    return random.random() < sample_rate

def record_metrics(model, tokens, latency):
    # Always record critical metrics
    record_error_metrics()
    record_request_count()
    
    # Sample detailed metrics
    if should_sample(sample_rate=0.1):
        record_token_metrics(model, tokens)
        record_latency_histogram(latency)
```

### लॉग रिटेंशन पॉलिसी

**उचित रिटेंशन सेट करें:**

```python
# CloudWatch Logs retention
retention_policies = {
    "/genai-observability/application-logs": 7,      # 7 days
    "/genai-observability/model-invocations": 30,    # 30 days
    "/genai-observability/errors": 90,               # 90 days
    "/genai-observability/audit": 2555               # 7 years (compliance)
}
```

### मेट्रिक रेज़ोल्यूशन

**उचित रेज़ोल्यूशन का उपयोग करें:**

```python
# High-resolution metrics (1-second) - Use sparingly
cloudwatch.put_metric_data(
    Namespace='AIObservability',
    MetricData=[{
        'MetricName': 'CriticalErrors',
        'Value': 1,
        'StorageResolution': 1  # 1-second resolution (expensive)
    }]
)

# Standard resolution (60-second) - Default for most metrics
cloudwatch.put_metric_data(
    Namespace='AIObservability',
    MetricData=[{
        'MetricName': 'RequestCount',
        'Value': 1,
        'StorageResolution': 60  # 60-second resolution (standard)
    }]
)
```

## सुरक्षा सर्वोत्तम प्रथाएं

### PII रिडैक्शन

**लॉग से संवेदनशील डेटा को रिडैक्ट करें:**

```python
import re
import hashlib

def redact_pii(text):
    """Redact common PII patterns"""
    # Email addresses
    text = re.sub(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', 
                  '[EMAIL_REDACTED]', text)
    
    # Phone numbers
    text = re.sub(r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b', 
                  '[PHONE_REDACTED]', text)
    
    # Credit card numbers
    text = re.sub(r'\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b', 
                  '[CC_REDACTED]', text)
    
    # SSN
    text = re.sub(r'\b\d{3}-\d{2}-\d{4}\b', 
                  '[SSN_REDACTED]', text)
    
    return text

def hash_user_id(user_id):
    """Hash user IDs for privacy"""
    return hashlib.sha256(user_id.encode()).hexdigest()[:16]
```

### IAM अनुमतियां

**Observability के लिए न्यूनतम विशेषाधिकार IAM पॉलिसी:**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "cloudwatch:PutMetricData",
        "cloudwatch:GetMetricStatistics",
        "cloudwatch:ListMetrics"
      ],
      "Resource": "*",
      "Condition": {
        "StringEquals": {
          "cloudwatch:namespace": "AIObservability"
        }
      }
    },
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:log-group:/genai-observability/*"
    }
  ]
}
```

### एन्क्रिप्शन

**टेलीमेट्री डेटा को एन्क्रिप्ट करें:**

```python
# CloudWatch Logs encryption
import boto3

logs = boto3.client('logs')

logs.associate_kms_key(
    logGroupName='/genai-observability/model-invocations',
    kmsKeyId='arn:aws:kms:us-east-1:123456789:key/abc-123'
)
```

## परीक्षण और सत्यापन

### लोड टेस्टिंग

**लोड के तहत observability का परीक्षण करें:**

```python
import concurrent.futures
import time

def simulate_load(num_requests=1000, concurrency=10):
    """Simulate load to test observability"""
    
    def make_request():
        start = time.time()
        # Simulate LLM call
        response = invoke_llm("test prompt")
        latency = (time.time() - start) * 1000
        
        # Record metrics
        record_metrics(
            model="test-model",
            input_tokens=10,
            output_tokens=50,
            latency_ms=latency
        )
    
    with concurrent.futures.ThreadPoolExecutor(max_workers=concurrency) as executor:
        futures = [executor.submit(make_request) for _ in range(num_requests)]
        concurrent.futures.wait(futures)
    
    print(f"Completed {num_requests} requests with {concurrency} concurrent workers")
```

### मेट्रिक सत्यापन

**सत्यापित करें कि मेट्रिक्स सही ढंग से रिकॉर्ड हो रहे हैं:**

```python
def validate_metrics():
    """Check that metrics are flowing correctly"""
    
    # Send test metric
    test_value = 12345
    cloudwatch.put_metric_data(
        Namespace='AIObservability',
        MetricData=[{
            'MetricName': 'TestMetric',
            'Value': test_value,
            'Dimensions': [{'Name': 'Test', 'Value': 'Validation'}]
        }]
    )
    
    # Wait for metric to be available
    time.sleep(60)
    
    # Query metric
    response = cloudwatch.get_metric_statistics(
        Namespace='AIObservability',
        MetricName='TestMetric',
        Dimensions=[{'Name': 'Test', 'Value': 'Validation'}],
        StartTime=datetime.utcnow() - timedelta(minutes=5),
        EndTime=datetime.utcnow(),
        Period=60,
        Statistics=['Sum']
    )
    
    # Validate
    if response['Datapoints']:
        print("✅ Metrics validation passed")
    else:
        print("❌ Metrics validation failed")
```

## समस्या निवारण

### सामान्य समस्याएं और समाधान

**समस्या: CloudWatch में मेट्रिक्स दिखाई नहीं दे रहे**

```bash
# Check IAM permissions
aws iam simulate-principal-policy \
  --policy-source-arn arn:aws:iam::123456789:role/MyRole \
  --action-names cloudwatch:PutMetricData \
  --resource-arns "*"

# Check metric namespace
aws cloudwatch list-metrics --namespace AIObservability

# Verify metric dimensions
aws cloudwatch list-metrics \
  --namespace AIObservability \
  --metric-name InputTokens
```

**समस्या: डैशबोर्ड में कोई डेटा नहीं दिख रहा**

```python
# Check time range
# CloudWatch has eventual consistency - wait 1-2 minutes

# Verify dimensions match exactly
# Dimension names are case-sensitive: "Model" != "model"

# Check metric period
# Period must align with data points (60s, 300s, 3600s)
```

**समस्या: CloudWatch की उच्च लागत**

```python
# Reduce metric resolution
# Use 60-second instead of 1-second resolution

# Implement sampling
# Sample 10% of requests for detailed metrics

# Optimize log retention
# Reduce retention from 30 days to 7 days for non-critical logs

# Use metric filters
# Create metrics from logs instead of custom metrics
```

## डिप्लॉयमेंट चेकलिस्ट

### प्री-प्रोडक्शन

- [ ] OpenTelemetry इंस्ट्रूमेंटेशन का परीक्षण किया गया
- [ ] सभी आवश्यक डाइमेंशन कॉन्फ़िगर किए गए
- [ ] PII रिडैक्शन लागू किया गया
- [ ] IAM अनुमतियां कॉन्फ़िगर की गईं (न्यूनतम विशेषाधिकार)
- [ ] लॉग और मेट्रिक्स के लिए एन्क्रिप्शन सक्षम
- [ ] डैशबोर्ड बनाए और परीक्षण किए गए
- [ ] उचित थ्रेशोल्ड के साथ अलर्ट कॉन्फ़िगर किए गए
- [ ] सामान्य समस्याओं के लिए रनबुक बनाई गईं
- [ ] लोड टेस्टिंग पूरी हुई
- [ ] लागत अनुमान सत्यापित किए गए

### प्रोडक्शन

- [ ] प्रोडक्शन में मॉनिटरिंग सक्षम
- [ ] अलर्ट सही चैनलों में रूट किए गए
- [ ] टीम एक्सेस कॉन्फ़िगर किया गया
- [ ] बैकअप और डिज़ास्टर रिकवरी का परीक्षण किया गया
- [ ] डॉक्यूमेंटेशन अपडेट किया गया
- [ ] ऑपरेशन टीम के लिए प्रशिक्षण पूरा हुआ
- [ ] इंसिडेंट रिस्पॉन्स प्रक्रियाएं परिभाषित की गईं
- [ ] नियमित समीक्षा शेड्यूल स्थापित किया गया

## निष्कर्ष

ये सामरिक सर्वोत्तम प्रथाएं प्रोडक्शन में GenAI observability को लागू करने के लिए एक ठोस आधार प्रदान करती हैं। याद रखें:

1. कोर मेट्रिक्स (tokens, latency, errors) से शुरू करें
2. वास्तविक उपयोग पैटर्न के आधार पर पुनरावृत्ति करें
3. स्केल करते समय लागत को ऑप्टिमाइज़ करें
4. सुरक्षा और अनुपालन बनाए रखें
5. फ़ीडबैक के आधार पर लगातार सुधार करें

एक पूर्ण कार्यशील उदाहरण के लिए, [GenAI Observability Recipe](./index.md) देखें।

---

**अंतिम अपडेट:** 2026-03-04  
**फ़ीडबैक:** [एक issue खोलें](https://github.com/aws-observability/observability-best-practices/issues)
