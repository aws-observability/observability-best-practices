# X-Ray 고객이 Application Signals + Transaction Search를 도입해야 하는 이유

## Observability 요구사항의 진화

애플리케이션의 복잡성과 규모가 증가함에 따라 고객의 Observability 요구사항도 크게 변화했습니다. [AWS X-Ray](https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html)가 신뢰할 수 있는 분산 추적 솔루션으로 역할을 해왔지만, 현대 애플리케이션 환경에서는 보다 포괄적인 가시성이 요구됩니다.

## 기술 아키텍처 차이

**X-Ray 기존 방식:**

![X-Ray 아키텍처](/apm-src/assets/images/deep-dive/X-ray.png)

**Application Signals + Transaction Search:**

![Application Signals + Transaction Search 아키텍처](/apm-src/assets/images/deep-dive/ap%20ts.png)

## 주요 마이그레이션 이점

| 기능 | X-Ray | Application Signals + Transaction Search |
|---|---|---|
| **데이터 수집** | 100% 트랜잭션 (구성 시) | 100% 트랜잭션 (구성 시) |
| **처리량 제한** | 대규모 환경에서 X-Ray 서비스 할당량 적용 | CloudWatch Logs를 통한 더 높은 처리량 용량 |
| **비용 모델** | 트레이스당 과금 (100%일 때 고비용) | Application Signals 번들 과금 |
| **저장 형식** | X-Ray 전용 형식 | OpenTelemetry 표준 형식 |
| **스토리지 백엔드** | X-Ray 최적화 스토리지 | 선별적 인덱싱을 지원하는 CloudWatch Logs |
| **분석** | X-Ray 콘솔 전용 | Transaction Search + X-Ray 트레이스 분석 |
| **쿼리 기능** | X-Ray 콘솔 및 API | Transaction Search 시각적 분석 + X-Ray |
| **인덱싱** | 모든 트레이스 인덱싱 | 선별적 인덱싱 (구성 가능한 비율 %) |
| **비즈니스 컨텍스트** | 제한된 커스텀 속성 | 풍부한 OTEL span 속성 + 비즈니스 컨텍스트 |

## 주요 가치 제안

### 1. 높은 처리량과 확장성
- **CloudWatch Logs는 X-Ray보다 높은 처리량을 처리**하여, 서비스 제한에 도달하지 않고 모든 애플리케이션 이벤트를 추적할 수 있습니다
- **트레이스 데이터를 Logs로 저장**하여 대용량 애플리케이션에서 X-Ray의 처리량 제약을 해소합니다
- **대규모 로그 수집에 최적화된 확장 가능한 인프라**를 제공합니다

### 2. 강화된 분석 및 통합 기능
- **네이티브 CloudWatch Logs 기능**을 span 데이터 분석에 활용할 수 있습니다:
  - **Metrics Filters**: span 속성 및 패턴에서 커스텀 메트릭 생성
  - **Subscription Filters**: span 데이터를 다른 AWS 서비스(Lambda, Kinesis 등)로 스트리밍
  - **Log Insights**: 기존 트레이스 분석을 넘어서는 고급 쿼리 기능
- **Transaction Search가 span 수준 분석을 위한 고급 비주얼 쿼리 인터페이스**를 제공합니다
- **OTEL 형식으로 커스텀 속성을 통해 span에 더 풍부한 비즈니스 컨텍스트**를 담을 수 있습니다

### 3. 비용 효율적인 100% 샘플링
- **번들 가격**으로 트레이스당 과금하는 X-Ray 대비 완전한 가시성을 비용 효율적으로 확보할 수 있습니다. [CloudWatch 요금 페이지](https://aws.amazon.com/cloudwatch/pricing/)의 **Example 13**을 참조하세요
- **데이터 볼륨 기반의 예측 가능한 비용** — 트레이스 수가 아닌 데이터 양 기준
- **선별적 인덱싱**으로 완전한 데이터 접근을 유지하면서 스토리지 비용 최적화

## Span 데이터에 CloudWatch Logs 기능 활용하기

Transaction Search는 span 데이터를 CloudWatch Logs(`aws/spans` 로그 그룹)에 저장하므로, 모든 네이티브 CloudWatch Logs 기능을 활용할 수 있습니다:

**Metrics Filters:**
```bash
# span 속성에서 커스텀 메트릭 생성
aws logs put-metric-filter \
  --log-group-name "aws/spans" \
  --filter-name "HighLatencyRequests" \
  --filter-pattern '[timestamp, request_id, span_id, trace_id, duration > 5000]' \
  --metric-transformations \
    metricName=HighLatencySpans,metricNamespace=CustomApp/Performance,metricValue=1
```

**Subscription Filters:**
```bash
# span 데이터를 Lambda로 스트리밍하여 실시간 처리
aws logs put-subscription-filter \
  --log-group-name "aws/spans" \
  --filter-name "ErrorSpanProcessor" \
  --filter-pattern '[..., status_code="ERROR"]' \
  --destination-arn "arn:aws:lambda:region:account:function:ProcessErrorSpans"
```

**Log Insights Queries:**
```sql
-- 특정 비즈니스 속성을 가진 모든 span 검색
fields @timestamp, attributes.customer_id, attributes.order_value, duration
| filter attributes.service_name = "payment-service"
| filter attributes.customer_tier = "premium"
| stats avg(duration) by attributes.customer_id
| sort avg(duration) desc
```

**통합 활용 사례:**
- **실시간 알림**: Subscription Filters로 Lambda 함수를 트리거하여 즉각적인 인시던트 대응
- **비즈니스 인텔리전스**: Kinesis Data Streams를 통해 분석 플랫폼으로 span 데이터 내보내기
- **커스텀 대시보드**: span 속성에서 파생된 메트릭으로 CloudWatch 대시보드 생성
- **규정 준수 감사**: Log Insights로 span을 쿼리하여 규제 준수 보고
