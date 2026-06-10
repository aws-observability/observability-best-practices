# GenAI Observability 实施最佳实践

## 概述

本指南提供了构建生产就绪的 GenAI Observability 解决方案的战术性、实施特定的最佳实践。这些实践基于实际部署和经验教训。

## OpenTelemetry 检测

### Metric 命名约定

**使用一致的、描述性的名称：**

```python
# ✅ 好 - 清晰、层次化的命名
"genai.token.input.count"
"genai.token.output.count"
"genai.request.duration"
"genai.request.error.count"

# ❌ 差 - 模糊、不一致
"tokens"
"input_tok"
"req_time"
"errors"
```

### 必需维度

**始终包含这些维度：**

```python
dimensions = {
    "model": "anthropic.claude-3-haiku-20240307-v1:0",
    "cloud_provider": "aws",  # aws, gcp, azure, on-prem
    "application": "chatbot",
    "environment": "production",
    "region": "us-east-1"
}
```

### 可选但推荐的维度

```python
optional_dimensions = {
    "user_id": "hashed_user_id",  # 哈希处理以保护隐私
    "session_id": "session_123",
    "prompt_template": "customer_support_v2",
    "model_version": "2024-03-07",
    "feature_flag": "new_prompt_enabled"
}
```

### 检测代码示例

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

## CloudWatch 配置

### Metric 命名空间策略

**使用层次化的命名空间：**

```
AIObservability              # 根命名空间
├── Production               # 特定环境
│   ├── Chatbot             # 特定应用
│   └── SearchAssistant
└── Development
```

### Metric 周期选择

**选择适当的周期：**

- **高频 metrics**（请求计数、错误）：60 秒
- **中频 metrics**（延迟、tokens）：300 秒（5 分钟）
- **低频 metrics**（每日成本）：3600 秒（1 小时）

### CloudWatch Logs 结构

**使用结构化日志：**

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

### 日志组组织

```
/genai-observability/
├── application-logs          # 应用级日志
├── model-invocations        # LLM 请求/响应日志
├── errors                   # 仅错误日志
└── audit                    # 合规审计轨迹
```

## Grafana Dashboard 设计

### Dashboard 层次结构

**为不同受众创建 dashboard：**

1. **高管 Dashboard** - 高级 KPI
   - 每日总成本
   - 请求量趋势
   - 错误率
   - 按使用量排名的模型

2. **运维 Dashboard** - 实时监控
   - 当前请求率
   - 活跃错误
   - 延迟百分位数
   - 提供商健康状态

3. **开发者 Dashboard** - 调试和优化
   - 请求 traces
   - 按功能统计的 token 使用
   - 延迟分解
   - 错误详情

4. **FinOps Dashboard** - 成本管理
   - 按模型统计的成本
   - 按团队/项目统计的成本
   - 成本趋势和预测
   - 优化机会

### 面板最佳实践

**时间序列面板：**
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

**KPI 统计面板：**
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

### 变量模板

**使用 dashboard 变量进行过滤：**

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

## 告警配置

### 告警阈值建议

**错误率告警：**
```yaml
# 严重 - 立即通知
- alert: HighErrorRate
  expr: rate(genai_request_error_count[5m]) > 0.05
  for: 5m
  labels:
    severity: critical
  annotations:
    summary: "Error rate above 5% for 5 minutes"

# 警告 - 工作时间内调查
- alert: ElevatedErrorRate
  expr: rate(genai_request_error_count[5m]) > 0.02
  for: 15m
  labels:
    severity: warning
```

**延迟告警：**
```yaml
- alert: HighLatency
  expr: histogram_quantile(0.95, rate(genai_request_duration_bucket[5m])) > 10000
  for: 10m
  labels:
    severity: warning
  annotations:
    summary: "P95 latency above 10 seconds"
```

**成本告警：**
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

### 告警路由

**将告警路由到适当的渠道：**

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

## MCP Server 部署

### Server 配置

**生产就绪的 MCP server 设置：**

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

### 查询优化

**优化 CloudWatch 查询：**

```python
# ✅ 好 - 使用特定的时间范围和维度
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

# ❌ 差 - 不带过滤器查询所有数据
def get_all_metrics():
    response = cloudwatch.get_metric_statistics(
        Namespace='AIObservability',
        MetricName='InputTokens',
        StartTime=datetime(2020, 1, 1),  # 范围太广
        EndTime=datetime.utcnow(),
        Period=60,  # 粒度太细
        Statistics=['Sum', 'Average', 'Min', 'Max']  # 不必要的统计
    )
```

### 缓存策略

**实现智能缓存：**

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

## 成本优化

### Metric 采样

**对高流量 metrics 进行采样：**

```python
import random

def should_sample(sample_rate=0.1):
    """Sample 10% of requests"""
    return random.random() < sample_rate

def record_metrics(model, tokens, latency):
    # 始终记录关键 metrics
    record_error_metrics()
    record_request_count()
    
    # 采样详细 metrics
    if should_sample(sample_rate=0.1):
        record_token_metrics(model, tokens)
        record_latency_histogram(latency)
```

### 日志保留策略

**设置适当的保留期：**

```python
# CloudWatch Logs retention
retention_policies = {
    "/genai-observability/application-logs": 7,      # 7 天
    "/genai-observability/model-invocations": 30,    # 30 天
    "/genai-observability/errors": 90,               # 90 天
    "/genai-observability/audit": 2555               # 7 年（合规要求）
}
```

### Metric 分辨率

**使用适当的分辨率：**

```python
# 高分辨率 metrics（1 秒）- 谨慎使用
cloudwatch.put_metric_data(
    Namespace='AIObservability',
    MetricData=[{
        'MetricName': 'CriticalErrors',
        'Value': 1,
        'StorageResolution': 1  # 1 秒分辨率（昂贵）
    }]
)

# 标准分辨率（60 秒）- 大多数 metrics 的默认值
cloudwatch.put_metric_data(
    Namespace='AIObservability',
    MetricData=[{
        'MetricName': 'RequestCount',
        'Value': 1,
        'StorageResolution': 60  # 60 秒分辨率（标准）
    }]
)
```

## 安全最佳实践

### PII 脱敏

**从日志中脱敏敏感数据：**

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

### IAM 权限

**Observability 的最小权限 IAM 策略：**

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

### 加密

**加密遥测数据：**

```python
# CloudWatch Logs encryption
import boto3

logs = boto3.client('logs')

logs.associate_kms_key(
    logGroupName='/genai-observability/model-invocations',
    kmsKeyId='arn:aws:kms:us-east-1:123456789:key/abc-123'
)
```

## 测试和验证

### 负载测试

**在负载下测试 Observability：**

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

### Metric 验证

**验证 metrics 是否正确记录：**

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

## 故障排除

### 常见问题和解决方案

**问题：Metrics 未出现在 CloudWatch 中**

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

**问题：Dashboard 不显示数据**

```python
# 检查时间范围
# CloudWatch 具有最终一致性 - 等待 1-2 分钟

# 验证维度完全匹配
# 维度名称区分大小写："Model" != "model"

# 检查 metric 周期
# 周期必须与数据点对齐（60s、300s、3600s）
```

**问题：CloudWatch 成本过高**

```python
# 降低 metric 分辨率
# 使用 60 秒而非 1 秒分辨率

# 实施采样
# 对详细 metrics 采样 10% 的请求

# 优化日志保留
# 将非关键日志的保留从 30 天减少到 7 天

# 使用 metric 过滤器
# 从日志创建 metrics 而非自定义 metrics
```

## 部署清单

### 预生产

- [ ] OpenTelemetry 检测已测试
- [ ] 所有必需维度已配置
- [ ] PII 脱敏已实现
- [ ] IAM 权限已配置（最小权限）
- [ ] 日志和 metrics 加密已启用
- [ ] Dashboard 已创建和测试
- [ ] 告警已配置适当阈值
- [ ] 运行手册已创建
- [ ] 负载测试已完成
- [ ] 成本估算已验证

### 生产

- [ ] 生产环境监控已启用
- [ ] 告警已路由到正确渠道
- [ ] 团队访问已配置
- [ ] 备份和灾难恢复已测试
- [ ] 文档已更新
- [ ] 运维团队培训已完成
- [ ] 事件响应流程已定义
- [ ] 定期审查计划已建立

## 结论

这些战术最佳实践为在生产环境中实施 GenAI Observability 提供了坚实的基础。请记住：

1. 从核心 metrics 开始（tokens、延迟、错误）
2. 基于实际使用模式进行迭代
3. 随着规模扩大优化成本
4. 维护安全性和合规性
5. 基于反馈持续改进

有关完整的工作示例，请参阅 [GenAI Observability Recipe](./index.md)。

---

**最后更新：** 2026-03-04
**反馈：** [提交 Issue](https://github.com/aws-observability/observability-best-practices/issues)
