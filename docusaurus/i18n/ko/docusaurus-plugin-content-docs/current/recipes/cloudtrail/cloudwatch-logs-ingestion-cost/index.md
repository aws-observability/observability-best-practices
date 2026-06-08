# 비용 추정: CloudTrail Trails에서 CloudWatch Logs 수집으로 전환

## 소개

[AWS CloudTrail](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html)을 사용하는 조직은 CloudTrail 로그를 저장하고 모니터링하는 세 가지 주요 접근 방식을 가지고 있습니다:

1. **CloudTrail Trails**: Amazon S3 버킷에 로그를 저장(선택적으로 CloudWatch Logs 통합)
2. **CloudTrail Lake**: 고급 쿼리 및 분석을 위한 관리형 데이터 레이크에 이벤트 저장
3. **직접 CloudWatch Logs 수집**: CloudTrail 추적을 생성할 필요 없이 CloudTrail 이벤트를 CloudWatch Logs로 직접 전송

이 가이드는 CloudTrail Trails에서 직접 CloudWatch Logs 수집으로 전환할 때의 비용 추정을 제공하는 데 중점을 둡니다. [CloudWatch Logs 데이터 소스](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/data-source-discovery-management.html) 도입으로 CloudTrail 이벤트를 CloudWatch Logs 통합 데이터 스토어에 자동으로 수집할 수 있게 되었습니다. 이를 통해 향상된 로그 관리, 자동 스키마 검색, CloudTrail 이벤트에 대한 간소화된 쿼리 기능을 제공합니다. CloudWatch 통합 데이터 스토어에 대해 자세히 알아보려면 블로그 게시물 [Amazon CloudWatch introduces unified data management and analytics for operations, security, and compliance](https://aws.amazon.com/blogs/aws/amazon-cloudwatch-introduces-unified-data-management-and-analytics-for-operations-security-and-compliance/)를 참조하세요.

CloudTrail Trails에서 직접 CloudWatch Logs 수집으로 전환하는 비용 영향을 이해하는 것은 예산 계획 및 비용 최적화에 매우 중요합니다. 이 가이드에서는 [AWS Cost and Usage Report(CUR)](https://docs.aws.amazon.com/cur/latest/userguide/what-is-cur.html) 데이터를 사용하여 이 전환과 관련된 비용을 추정하는 방법을 보여줍니다.

:::note
**참고**: 이 가이드는 CloudTrail 이벤트를 CloudWatch Logs에 수집하는 비용에 대한 추정치만 제공하며 저장 및 쿼리와 같은 CloudWatch Logs와 관련된 추가 비용은 포함하지 않습니다.
:::

## CloudWatch 통합 데이터 스토어의 데이터 소스로서의 CloudTrail

CloudTrail은 CloudWatch 통합 데이터 스토어 내의 데이터 소스로서 보안 및 운영 분석을 위한 데이터를 제공합니다. CloudWatch Logs의 통합 데이터 스토어를 통해 CloudWatch Log Insights를 사용하여 CloudTrail 데이터를 다른 AWS 및 비 AWS 로그와 상관 분석할 수 있으며, 클라우드 인프라 및 보안 태세에 대한 가시성을 제공합니다.

## 비용 분석: Trails에서 CloudWatch 통합 데이터 스토어로 전환

[AWS Cost and Usage Report(CUR)](https://docs.aws.amazon.com/cur/latest/userguide/what-is-cur.html)에는 [CloudTrail 이벤트 볼륨](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-costs.html)을 포함한 AWS 서비스 사용에 대한 상세 정보가 포함되어 있습니다. CUR 데이터에 기록된 CloudTrail 이벤트를 분석하여 직접 CloudWatch Logs 수집으로 전환 시 잠재적 비용을 추정할 수 있습니다. 이 접근 방식이 기준 추정치를 제공하는 이유:

- **이벤트 상관 관계**: CUR에 기록된 각 CloudTrail 이벤트는 CloudWatch Logs 수집 요금이 발생하는 이벤트를 나타냄
- **과거 분석**: CUR 데이터는 미래 CloudWatch Logs 비용을 예측하기 위한 과거 CloudTrail 사용 패턴을 제공
- **세분화된 가시성**: 계정, 이벤트 유형, 기간별로 비용 분석 가능
- **비용 계산**: CloudWatch Logs 수집 가격은 GB당 $0.75($0.25 CloudTrail 전달 + $0.50 CloudWatch Logs 수집)

:::note
**중요**: 이 방법은 CUR에 기록된 실제 CloudTrail 이벤트 볼륨을 기반으로 추정치를 제공하여 Trails를 사용하여 S3 버킷에 전달하는 대신 이러한 이벤트를 CloudWatch Logs로 보내는 비용 영향을 이해하는 데 도움이 됩니다. 추정치에는 CloudWatch Logs와 관련된 저장 비용은 포함되지 않습니다.
:::

다음 쿼리는 AWS Cost and Usage Report(CUR) 데이터에서 CloudTrail 이벤트를 분석하여 CloudWatch Logs 수집 비용을 추정합니다.

### 쿼리 이해

쿼리는 다음을 기반으로 비용을 계산합니다:

1. **이벤트 수**: CUR 데이터를 사용하여 이전 달의 전체 CloudTrail 이벤트
2. **추정 데이터 크기**: 이벤트당 1,500바이트 가정(평균 CloudTrail 이벤트 크기)
3. **비용 구성 요소**:
   - CloudTrail에서 CloudWatch Logs로의 전달: GB당 $0.25
   - CloudWatch Logs 수집: GB당 $0.50
   - 총 수집 비용: GB당 $0.75

### 비용 계산 공식

```
전체 이벤트 × 1,500 바이트 / 1,000,000,000 = GB 데이터
GB 데이터 × $0.25 = CloudTrail 전달 비용
GB 데이터 × $0.50 = CloudWatch Logs 수집 비용
GB 데이터 × $0.75 = 총 수집 비용
```

### 이전 달의 CloudTrail 사용 데이터를 사용한 CUR 쿼리

`<CUR_TABLE>`을 실제 CUR 테이블 이름으로 대체하세요:

```sql
SELECT 
  DATE_FORMAT(line_item_usage_start_date,'%Y-%m') AS month,
  line_item_usage_account_id as account_id,
  product_product_name as product_name, 
  CAST(SUM(CAST(line_item_usage_amount AS DOUBLE)) AS BIGINT) AS total_cloudtrail_events,
  CONCAT('$', CAST(CAST(ROUND(SUM(CAST(line_item_unblended_cost AS DECIMAL(16,8))), 2) AS DECIMAL(16,2)) AS VARCHAR)) AS trail_cost,
  CONCAT('$', CAST(CAST(((SUM(CAST(line_item_usage_amount AS DOUBLE)) * 1500)/1000000000) * 0.25 AS DECIMAL(16,2)) AS VARCHAR)) AS cloudtrail_delivery_cost,
  CONCAT('$', CAST(CAST(((SUM(CAST(line_item_usage_amount AS DOUBLE)) * 1500)/1000000000) * 0.50 AS DECIMAL(16,2)) AS VARCHAR)) AS cloudwatch_logs_ingestion_cost,
  CONCAT('$', CAST(CAST(((SUM(CAST(line_item_usage_amount AS DOUBLE)) * 1500)/1000000000) * 0.75 AS DECIMAL(16,2)) AS VARCHAR)) AS total_cloudwatch_log_ingestion_cost,
  'Management Events' as event_type
FROM <CUR_TABLE>
WHERE DATE_FORMAT(line_item_usage_start_date,'%Y-%m') = DATE_FORMAT(date_add('month', -1, current_date),'%Y-%m')
  AND product_product_name = 'AWS CloudTrail'
  AND line_item_line_item_type IN ('DiscountedUsage', 'Usage', 'SavingsPlanCoveredUsage')
  AND line_item_usage_type LIKE '%-FreeEventsRecorded'
GROUP BY line_item_usage_account_id, DATE_FORMAT(line_item_usage_start_date,'%Y-%m'), product_product_name

UNION ALL

SELECT 
  DATE_FORMAT(line_item_usage_start_date,'%Y-%m') AS month,
  line_item_usage_account_id as account_id,
  product_product_name as product_name, 
  CAST(SUM(CAST(line_item_usage_amount AS DOUBLE)) AS BIGINT) AS total_cloudtrail_events,
  CONCAT('$', CAST(CAST(ROUND(SUM(CAST(line_item_unblended_cost AS DECIMAL(16,8))), 2) AS DECIMAL(16,2)) AS VARCHAR)) AS trail_cost,
  CONCAT('$', CAST(CAST(((SUM(CAST(line_item_usage_amount AS DOUBLE)) * 1500)/1000000000) * 0.25 AS DECIMAL(16,2)) AS VARCHAR)) AS cloudtrail_delivery_cost,
  CONCAT('$', CAST(CAST(((SUM(CAST(line_item_usage_amount AS DOUBLE)) * 1500)/1000000000) * 0.50 AS DECIMAL(16,2)) AS VARCHAR)) AS cloudwatch_logs_ingestion_cost,
  CONCAT('$', CAST(CAST(((SUM(CAST(line_item_usage_amount AS DOUBLE)) * 1500)/1000000000) * 0.75 AS DECIMAL(16,2)) AS VARCHAR)) AS total_cloudwatch_log_ingestion_cost,
  'Data Events' as event_type
FROM <CUR_TABLE>
WHERE DATE_FORMAT(line_item_usage_start_date,'%Y-%m') = DATE_FORMAT(date_add('month', -1, current_date),'%Y-%m')
  AND product_product_name = 'AWS CloudTrail'
  AND line_item_line_item_type IN ('DiscountedUsage', 'Usage', 'SavingsPlanCoveredUsage')
  AND line_item_usage_type LIKE '%-DataEventsRecorded'
GROUP BY line_item_usage_account_id, DATE_FORMAT(line_item_usage_start_date,'%Y-%m'), product_product_name

UNION ALL

SELECT 
  DATE_FORMAT(line_item_usage_start_date,'%Y-%m') AS month,
  line_item_usage_account_id as account_id,
  product_product_name as product_name,
  CAST(SUM(CAST(line_item_usage_amount AS DOUBLE)) AS BIGINT) AS total_cloudtrail_events, 
  CONCAT('$', CAST(CAST(ROUND(SUM(CAST(line_item_unblended_cost AS DECIMAL(16,8))), 2) AS DECIMAL(16,2)) AS VARCHAR)) AS trail_cost,
  CONCAT('$', CAST(CAST(((SUM(CAST(line_item_usage_amount AS DOUBLE)) * 1500)/1000000000) * 0.25 AS DECIMAL(16,2)) AS VARCHAR)) AS cloudtrail_delivery_cost,
  CONCAT('$', CAST(CAST(((SUM(CAST(line_item_usage_amount AS DOUBLE)) * 1500)/1000000000) * 0.50 AS DECIMAL(16,2)) AS VARCHAR)) AS cloudwatch_logs_ingestion_cost,
  CONCAT('$', CAST(CAST(((SUM(CAST(line_item_usage_amount AS DOUBLE)) * 1500)/1000000000) * 0.75 AS DECIMAL(16,2)) AS VARCHAR)) AS total_cloudwatch_log_ingestion_cost,
  'Additional copies of Management Events' as event_type
FROM <CUR_TABLE>
WHERE DATE_FORMAT(line_item_usage_start_date,'%Y-%m') = DATE_FORMAT(date_add('month', -1, current_date),'%Y-%m')
  AND product_product_name = 'AWS CloudTrail'
  AND line_item_line_item_type IN ('DiscountedUsage', 'Usage', 'SavingsPlanCoveredUsage')
  AND line_item_usage_type LIKE '%-PaidEventsRecorded'
GROUP BY line_item_usage_account_id, DATE_FORMAT(line_item_usage_start_date,'%Y-%m'), product_product_name
ORDER BY month, account_id, event_type
```
:::note
**참고**: 이 샘플 쿼리는 CloudTrail 이벤트를 CloudWatch Logs에 수집하는 월별 비용 추정치를 제공합니다. 이 추정치에는 저장, 쿼리 또는 향후 CloudTrail 이벤트 볼륨 증가와 같은 추가 CloudWatch Logs 비용은 포함되지 않습니다. 이 계산은 과거 CUR(Cost and Usage Report) 데이터를 기반으로 비용의 추정 기준선 역할을 합니다.
:::

아래 이미지는 CUR 쿼리의 출력을 보여줍니다. 결과는 이벤트 유형(Management Events, Data Events, Additional copies of Management Events)별로 정리되어 있으며 이전 달에 기록된 총 CloudTrail 이벤트, 해당 기간의 현재 Trail 비용, 추정 CloudWatch Logs 수집 비용을 제공합니다. 이 분석은 각 사용 유형을 Trails에서 직접 CloudWatch Logs 수집으로 전환할 때의 비용 영향을 이해하는 데 도움이 됩니다.

![S3에 대한 CloudTrail 데이터 이벤트 비용 추정](/img/cloudops/recipes/AWS%20CloudTrail/trail-events-estimate-cost/trail-events-cw-logs-estimate-cost.png)


## 결론

CloudWatch Logs 수집은 CloudTrail 이벤트에 대한 실시간 모니터링, 더 빠른 분석, 간소화된 관리를 제공합니다. CUR 쿼리는 Trails에서 전환할 때의 비용을 추정하고 즉각적인 알림, 서비스 간 상관 분석, 조직의 보안 및 규정 준수 요구 사항을 위한 인프라 복잡성 감소를 포함하여 CloudWatch Logs가 제공하는 통합 데이터 스토어 기능을 활용하는 데 도움이 됩니다.

:::note
현재 요금 세부 정보는 [AWS CloudTrail 요금](https://aws.amazon.com/cloudtrail/pricing/) 및 [Amazon CloudWatch 요금](https://aws.amazon.com/cloudwatch/pricing/)을 참조하세요.
:::
