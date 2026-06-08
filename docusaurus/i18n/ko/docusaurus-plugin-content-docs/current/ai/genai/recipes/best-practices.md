# GenAI Observability 구현 모범 사례

## 개요

이 가이드는 프로덕션 준비된 GenAI Observability 솔루션을 구축하기 위한 전술적이고 구현별 모범 사례를 제공합니다. 이 모범 사례는 실제 배포 경험과 얻은 교훈을 기반으로 합니다.

## OpenTelemetry 계측

### 메트릭 명명 규칙

**일관되고 설명적인 이름을 사용하세요:**

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

### 필수 차원

**항상 다음 차원을 포함하세요:**

```python
dimensions = {
    "model": "anthropic.claude-3-haiku-20240307-v1:0",
    "cloud_provider": "aws",  # aws, gcp, azure, on-prem
    "application": "chatbot",
    "environment": "production",
    "region": "us-east-1"
}
```

### 선택적이지만 권장되는 차원

```python
optional_dimensions = {
    "user_id": "hashed_user_id",  # Hash for privacy
    "session_id": "session_123",
    "prompt_template": "customer_support_v2",
    "model_version": "2024-03-07",
    "feature_flag": "new_prompt_enabled"
}
```

### 계측 코드 예시

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

## CloudWatch 구성

### 메트릭 네임스페이스 전략

**계층적 네임스페이스를 사용하세요:**

```
AIObservability              # 루트 네임스페이스
├── Production               # 환경별
│   ├── Chatbot             # 애플리케이션별
│   └── SearchAssistant
└── Development
```

### 메트릭 기간 선택

**적절한 기간을 선택하세요:**

- **고빈도 메트릭** (요청 수, 오류): 60초
- **중빈도 메트릭** (지연시간, 토큰): 300초 (5분)
- **저빈도 메트릭** (일일 비용): 3600초 (1시간)

### CloudWatch Logs 구조

**구조화된 로깅을 사용하세요:**

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

### 로그 그룹 구성

```
/genai-observability/
├── application-logs          # 애플리케이션 수준 로그
├── model-invocations        # LLM 요청/응답 로그
├── errors                   # 오류 로그만
└── audit                    # 컴플라이언스 감사 추적
```

## Grafana 대시보드 설계

### 대시보드 계층 구조

**다양한 대상을 위한 대시보드를 만드세요:**

1. **경영진 대시보드** - 상위 KPI
   - 일일 총 비용
   - 요청 볼륨 트렌드
   - 오류율
   - 사용량 기준 상위 모델

2. **운영 대시보드** - 실시간 모니터링
   - 현재 요청률
   - 활성 오류
   - 지연시간 백분위수
   - 프로바이더 상태

3. **개발자 대시보드** - 디버깅 및 최적화
   - 요청 트레이스
   - 기능별 토큰 사용량
   - 지연시간 분석
   - 오류 상세

4. **FinOps 대시보드** - 비용 관리
   - 모델별 비용
   - 팀/프로젝트별 비용
   - 비용 트렌드 및 예측
   - 최적화 기회

### 패널 모범 사례

**시계열 패널:**
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

**KPI용 Stat 패널:**
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

### 변수 템플릿

**필터링을 위한 대시보드 변수를 사용하세요:**

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

## 알림 구성

### 알림 임계값 권장 사항

**오류율 알림:**
```yaml
# Critical - 즉시 호출
- alert: HighErrorRate
  expr: rate(genai_request_error_count[5m]) > 0.05
  for: 5m
  labels:
    severity: critical
  annotations:
    summary: "Error rate above 5% for 5 minutes"

# Warning - 업무 시간 중 조사
- alert: ElevatedErrorRate
  expr: rate(genai_request_error_count[5m]) > 0.02
  for: 15m
  labels:
    severity: warning
```

**지연시간 알림:**
```yaml
- alert: HighLatency
  expr: histogram_quantile(0.95, rate(genai_request_duration_bucket[5m])) > 10000
  for: 10m
  labels:
    severity: warning
  annotations:
    summary: "P95 latency above 10 seconds"
```

**비용 알림:**
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

### 알림 라우팅

**적절한 채널로 알림을 라우팅하세요:**

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

## MCP Server 배포

### Server 구성

**프로덕션 준비된 MCP 서버 설정:**

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

### 쿼리 최적화

**CloudWatch 쿼리를 최적화하세요:**

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

### 캐싱 전략

**지능적 캐싱을 구현하세요:**

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

## 비용 최적화

### 메트릭 샘플링

**고볼륨 메트릭을 샘플링하세요:**

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

### 로그 보존 정책

**적절한 보존 기간을 설정하세요:**

```python
# CloudWatch Logs retention
retention_policies = {
    "/genai-observability/application-logs": 7,      # 7일
    "/genai-observability/model-invocations": 30,    # 30일
    "/genai-observability/errors": 90,               # 90일
    "/genai-observability/audit": 2555               # 7년 (컴플라이언스)
}
```

### 메트릭 해상도

**적절한 해상도를 사용하세요:**

```python
# High-resolution metrics (1-second) - 꼭 필요한 경우에만 사용
cloudwatch.put_metric_data(
    Namespace='AIObservability',
    MetricData=[{
        'MetricName': 'CriticalErrors',
        'Value': 1,
        'StorageResolution': 1  # 1-second resolution (expensive)
    }]
)

# Standard resolution (60-second) - 대부분의 메트릭에 기본 사용
cloudwatch.put_metric_data(
    Namespace='AIObservability',
    MetricData=[{
        'MetricName': 'RequestCount',
        'Value': 1,
        'StorageResolution': 60  # 60-second resolution (standard)
    }]
)
```

## 보안 모범 사례

### PII 편집

**로그에서 민감한 데이터를 편집하세요:**

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

### IAM 권한

**Observability를 위한 최소 권한 IAM 정책:**

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

### 암호화

**텔레메트리 데이터를 암호화하세요:**

```python
# CloudWatch Logs encryption
import boto3

logs = boto3.client('logs')

logs.associate_kms_key(
    logGroupName='/genai-observability/model-invocations',
    kmsKeyId='arn:aws:kms:us-east-1:123456789:key/abc-123'
)
```

## 테스트 및 검증

### 부하 테스트

**부하 상태에서 Observability를 테스트하세요:**

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

### 메트릭 검증

**메트릭이 올바르게 기록되는지 검증하세요:**

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

## 문제 해결

### 일반적인 문제와 해결책

**문제: CloudWatch에 메트릭이 표시되지 않음**

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

**문제: 대시보드에 데이터가 표시되지 않음**

```python
# 시간 범위 확인
# CloudWatch는 최종 일관성을 가짐 - 1-2분 대기

# 차원이 정확히 일치하는지 확인
# 차원 이름은 대소문자 구분: "Model" != "model"

# 메트릭 기간 확인
# 기간은 데이터 포인트와 정렬되어야 함 (60s, 300s, 3600s)
```

**문제: 높은 CloudWatch 비용**

```python
# 메트릭 해상도 줄이기
# 1초 대신 60초 해상도 사용

# 샘플링 구현
# 상세 메트릭에 대해 10% 요청 샘플링

# 로그 보존 최적화
# 비중요 로그의 보존을 30일에서 7일로 단축

# 메트릭 필터 사용
# 커스텀 메트릭 대신 로그에서 메트릭 생성
```

## 배포 체크리스트

### 프로덕션 전

- [ ] OpenTelemetry 계측 테스트 완료
- [ ] 모든 필수 차원 구성 완료
- [ ] PII 편집 구현 완료
- [ ] IAM 권한 구성 완료 (최소 권한)
- [ ] 로그 및 메트릭 암호화 활성화
- [ ] 대시보드 생성 및 테스트 완료
- [ ] 적절한 임계값으로 알림 구성 완료
- [ ] 일반적인 문제에 대한 런북 작성 완료
- [ ] 부하 테스트 완료
- [ ] 비용 추정 검증 완료

### 프로덕션

- [ ] 프로덕션에서 모니터링 활성화
- [ ] 올바른 채널로 알림 라우팅
- [ ] 팀 접근 권한 구성
- [ ] 백업 및 재해 복구 테스트
- [ ] 문서 업데이트
- [ ] 운영 팀 교육 완료
- [ ] 인시던트 대응 절차 정의
- [ ] 정기 검토 일정 수립

## 결론

이러한 전술적 모범 사례는 프로덕션에서 GenAI Observability를 구현하기 위한 견고한 기반을 제공합니다. 기억할 사항:

1. 핵심 메트릭부터 시작하세요 (토큰, 지연시간, 오류)
2. 실제 사용 패턴에 기반하여 반복 개선하세요
3. 규모 확장 시 비용을 최적화하세요
4. 보안 및 컴플라이언스를 유지하세요
5. 피드백에 기반하여 지속적으로 개선하세요

전체 작동 예시는 [GenAI Observability Recipe](./index.md)를 참조하세요.

---

**최종 업데이트:** 2026-03-04  
**피드백:** [Open an issue](https://github.com/aws-observability/observability-best-practices/issues)
