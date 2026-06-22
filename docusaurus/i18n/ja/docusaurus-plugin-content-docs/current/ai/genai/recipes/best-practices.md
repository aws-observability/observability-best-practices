# GenAI オブザーバビリティ実装のベストプラクティス

## 概要

このガイドでは、本番環境に対応した GenAI オブザーバビリティソリューションを構築するための、実装に特化した戦術的なベストプラクティスを提供します。これらのプラクティスは、実際のデプロイメントと得られた教訓に基づいています。

## OpenTelemetry インストルメンテーション

### メトリクスの命名規則

**一貫性のある説明的な名前を使用します。**

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

### 必須ディメンション

**常にこれらのディメンションを含めてください：**

```python
dimensions = {
    "model": "anthropic.claude-3-haiku-20240307-v1:0",
    "cloud_provider": "aws",  # aws, gcp, azure, on-prem
    "application": "chatbot",
    "environment": "production",
    "region": "us-east-1"
}
```

### オプションですが推奨されるディメンション

```python
optional_dimensions = {
    "user_id": "hashed_user_id",  # Hash for privacy
    "session_id": "session_123",
    "prompt_template": "customer_support_v2",
    "model_version": "2024-03-07",
    "feature_flag": "new_prompt_enabled"
}
```

### インストルメンテーションコードの例

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

## CloudWatch の設定

### メトリクス名前空間戦略

**階層的な名前空間を使用します。**

```
AIObservability              # Root namespace
├── Production               # Environment-specific
│   ├── Chatbot             # Application-specific
│   └── SearchAssistant
└── Development
```

### メトリクス期間の選択

**適切な期間を選択します。**

- **高頻度メトリクス**（リクエスト数、エラー）: 60 秒
- **中頻度メトリクス**（レイテンシ、トークン）: 300 秒（5 分）
- **低頻度メトリクス**（日次コスト）: 3600 秒（1 時間）

### CloudWatch Logs の構造

**構造化ログを使用します。**

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

### ログ グループの構成

```
/genai-observability/
├── application-logs          # Application-level logs
├── model-invocations        # LLM request/response logs
├── errors                   # Error logs only
└── audit                    # Compliance audit trail
```

## Grafana ダッシュボードのデザイン

### ダッシュボード階層

**さまざまなオーディエンス向けのダッシュボードを作成します。**

1. **エグゼクティブダッシュボード** - 高レベル KPI
   - 1 日の総コスト
   - リクエスト量のトレンド
   - エラー率
   - 使用量上位のモデル

2. **オペレーションダッシュボード** - リアルタイムモニタリング
   - 現在のリクエストレート
   - アクティブなエラー
   - レイテンシーパーセンタイル
   - プロバイダーのヘルスステータス

3. **開発者ダッシュボード** - デバッグと最適化
   - リクエストトレース
   - 機能別トークン使用量
   - レイテンシーの内訳
   - エラーの詳細

4. **FinOps ダッシュボード** - コスト管理
   - モデル別コスト
   - チーム/プロジェクト別コスト
   - コストのトレンドと予測
   - 最適化の機会

### パネルのベストプラクティス

**時系列パネル：**
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

**KPI の Stat パネル:**
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

### 変数テンプレート

**ダッシュボード変数をフィルタリングに使用します。**

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

## アラート設定

### アラートしきい値の推奨事項

**エラーレートアラート：**
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

**レイテンシーアラート:**
```yaml
- alert: HighLatency
  expr: histogram_quantile(0.95, rate(genai_request_duration_bucket[5m])) > 10000
  for: 10m
  labels:
    severity: warning
  annotations:
    summary: "P95 latency above 10 seconds"
```

**コストアラート：**
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

### アラートルーティング

**適切なチャンネルにアラートをルーティングします。**

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

## MCP Server のデプロイ

### サーバー設定

**本番環境対応の MCP サーバーセットアップ：**

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

### クエリの最適化

**CloudWatch クエリを最適化します。**

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

### キャッシュ戦略

**インテリジェントなキャッシングを実装します。**

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

## コスト最適化

### メトリクスサンプリング

**大量メトリクスをサンプリングします。**

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

### ログ保持ポリシー

**適切な保持期間を設定します。**

```python
# CloudWatch Logs retention
retention_policies = {
    "/genai-observability/application-logs": 7,      # 7 days
    "/genai-observability/model-invocations": 30,    # 30 days
    "/genai-observability/errors": 90,               # 90 days
    "/genai-observability/audit": 2555               # 7 years (compliance)
}
```

### メトリクスの解像度

**適切な解像度を使用します。**

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

## セキュリティのベストプラクティス

### PII の編集

**ログから機密データを削除します。**

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

### IAM アクセス許可

**オブザーバビリティのための最小権限 IAM ポリシー:**

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

### 暗号化

**テレメトリデータを暗号化します。**

```python
# CloudWatch Logs encryption
import boto3

logs = boto3.client('logs')

logs.associate_kms_key(
    logGroupName='/genai-observability/model-invocations',
    kmsKeyId='arn:aws:kms:us-east-1:123456789:key/abc-123'
)
```

## テストと検証

### 負荷テスト

**負荷下での観測可能性をテストします。**

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

### メトリクスの検証

**メトリクスが記録されていることを確認します。**

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

## トラブルシューティング

### よくある問題と解決策

**問題: メトリクスが CloudWatch に表示されない**

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

**問題: ダッシュボードにデータが表示されない**

```python
# Check time range
# CloudWatch has eventual consistency - wait 1-2 minutes

# Verify dimensions match exactly
# Dimension names are case-sensitive: "Model" != "model"

# Check metric period
# Period must align with data points (60s, 300s, 3600s)
```

**問題: CloudWatch のコストが高い**

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

## デプロイメントチェックリスト

### プリプロダクション

- [ ] OpenTelemetry インストルメンテーションのテスト完了
- [ ] 必要なすべてのディメンションの設定完了
- [ ] PII の削除実装済み
- [ ] IAM 権限の設定完了（最小権限）
- [ ] ログとメトリクスの暗号化有効化済み
- [ ] ダッシュボードの作成とテスト完了
- [ ] 適切なしきい値でのアラート設定完了
- [ ] 一般的な問題に対するランブック作成済み
- [ ] 負荷テスト完了
- [ ] コスト見積もりの検証完了

### 本番環境

- [ ] 本番環境でモニタリングが有効化されている
- [ ] アラートが正しいチャンネルにルーティングされている
- [ ] チームアクセスが設定されている
- [ ] バックアップとディザスタリカバリがテストされている
- [ ] ドキュメントが更新されている
- [ ] 運用チームのトレーニングが完了している
- [ ] インシデント対応手順が定義されている
- [ ] 定期的なレビュースケジュールが確立されている

## まとめ

これらの戦術的なベストプラクティスは、本番環境での GenAI オブザーバビリティを実装するための強固な基盤を提供します。以下の点を忘れないでください。

1. コアメトリクス（トークン、レイテンシー、エラー）から始める
2. 実際の使用パターンに基づいて反復する
3. スケールに応じてコストを最適化する
4. セキュリティとコンプライアンスを維持する
5. フィードバックに基づいて継続的に改善する

完全な動作例については、[GenAI Observability レシピ](./index.md)を参照してください。

---

**最終更新日:** 2026-03-04
**フィードバック:** [問題を報告する](https://github.com/aws-observability/observability-best-practices/issues)
