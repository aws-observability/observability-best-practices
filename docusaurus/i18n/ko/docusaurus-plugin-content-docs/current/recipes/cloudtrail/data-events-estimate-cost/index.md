# CloudTrail Data Event 비용 추정

## 소개

[CloudTrail Data Events](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/logging-data-events-with-cloudtrail.html)는 S3 객체, DynamoDB 테이블, Lambda 함수 등 AWS 리소스에 대한 데이터 플레인 작업의 상세한 로깅을 제공합니다. 이러한 이벤트는 귀중한 보안 및 규정 준수 인사이트를 제공하지만, 프로덕션 환경에서 높은 작업 볼륨으로 인해 상당한 비용이 발생할 수 있습니다. Data Events를 활성화하기 전에 잠재적 비용 영향을 파악하는 것은 예산 계획 및 비용 최적화에 매우 중요합니다.

이 가이드에서는 Cost and Usage Report (CUR) 쿼리를 사용하여 S3에 대한 CloudTrail Data Events 비용을 추정하는 방법을 설명합니다. 향후 추가 Data Event 리소스 유형에 대한 비용 추정 예제를 포함하도록 가이드를 업데이트할 예정입니다.

:::note
**참고**: 이 가이드는 CUR 데이터를 사용한 비용 근사 방법을 제공하며, CUR은 과금 대상 작업만 추적하고 CloudTrail은 모든 작업을 로깅하므로 실제 CloudTrail 비용보다 낮게 추정될 수 있습니다.
:::

## CUR을 사용한 S3 Data Events 비용 추정 개요

[AWS Cost and Usage Report (CUR)](https://docs.aws.amazon.com/cur/latest/userguide/creating-cur.html)에는 개별 API 작업을 포함한 AWS 서비스 사용에 대한 상세 정보가 포함되어 있습니다. CUR 데이터에서 S3 API 작업을 분석하면 CloudTrail Data Events 활성화 시 발생할 수 있는 잠재적 비용을 근사할 수 있습니다. 이 접근 방식이 기본 추정치를 제공하는 이유는 다음과 같습니다:

- **부분적 상관관계**: CUR에 기록된 각 S3 API 작업은 로깅이 활성화된 경우 하나의 CloudTrail Data Event를 생성하지만, CUR은 과금 대상 작업만 추적합니다
- **과거 분석**: CUR 데이터는 과금 대상 작업에 대한 과거 사용 패턴을 제공하여 향후 비용을 예측할 수 있습니다
- **세분화된 가시성**: 추적되는 작업에 대해 계정, 버킷, 작업 유형 및 기간별로 비용을 분석할 수 있습니다
- **비용 계산**: CloudTrail Data Events의 가격은 100,000 이벤트당 $0.10입니다

:::note
**중요**: CUR은 CloudTrail이 여전히 로깅하는 프리 티어 작업, 실패한 작업 또는 과금 임계값 미만의 작업을 추적하지 않으므로 이 방법은 보수적인 추정치를 제공합니다.
:::

다음 쿼리는 CUR 데이터에서 [S3에 대한 CloudTrail Data Events](https://docs.aws.amazon.com/AmazonS3/latest/userguide/cloudtrail-logging-s3-info.html#cloudtrail-data-events)와 관련된 Amazon S3 API 작업을 분석하여 CloudTrail Data Events 비용을 추정합니다.

## 중요한 제한 사항

**CUR 추적 제한**: CUR `line_item_operation`은 과금 가능한 사용 또는 비용이 발생하는 작업만 추적합니다. 이는 다음을 의미합니다:

- **추적되지 않는 작업**: 프리 티어 작업, 실패한 작업, 액세스 거부 이벤트, 과금 임계값 미만의 작업은 CUR에 포함되지 않습니다
- **CloudTrail은 모든 것을 로깅**: CloudTrail Data Events는 성공, 실패 또는 과금 상태에 관계없이 모든 작업을 캡처합니다
- **비용 추정 정확도**: CUR 기반 추정치는 CloudTrail이 CUR보다 더 많은 작업을 로깅하므로 실제 CloudTrail 비용보다 **낮을** 수 있습니다

**권장 사항**: 실제 CloudTrail Data Events 비용이 더 높을 수 있다는 점을 이해하고 이 추정치를 기본 참고값으로 사용하십시오. 특히 실패한 작업이나 프리 티어 사용량이 많은 환경에서는 더욱 그렇습니다.

```sql
WITH base_data AS (
	SELECT DATE(line_item_usage_start_date) as usage_date,
		bill_payer_account_id as payer_account_id,
		line_item_usage_account_id as usage_account_id,
		line_item_operation,
		line_item_resource_id as bucket_name,
		COUNT(*) as operation_count,
		CONCAT('$', FORMAT('%.6f', (COUNT(*) / 100000.0) * 0.10)) as data_events_estimated_cost
	FROM <CUR TABLE>
	WHERE line_item_product_code = 'AmazonS3'
		AND line_item_operation IN (
			'AbortMultipartUpload',
			'CompleteMultipartUpload',
			'CopyObject',
			'CreateMultipartUpload',
			'DeleteObject',
			'DeleteObjectTagging',
			'DeleteObjects',
			'GetObject',
			'GetObjectAcl',
			'GetObjectAttributes',
			'GetObjectLegalHold',
			'GetObjectRetention',
			'GetObjectTagging',
			'GetObjectTorrent',
			'HeadObject',
			'HeadBucket',
			'ListObjectVersions',
			'ListObjects',
			'ListParts',
			'PutObject',
			'PutObjectAcl',
			'PutObjectLegalHold',
			'PutObjectRetention',
			'PutObjectTagging',
			'RestoreObject',
			'SelectObjectContent',
			'UploadPart',
			'UploadPartCopy'
		)
		AND line_item_usage_start_date >= DATE('2025-09-01')
		AND line_item_usage_start_date < DATE('2025-09-30')
	GROUP BY DATE(line_item_usage_start_date),
		bill_payer_account_id,
		line_item_usage_account_id,
		line_item_operation,
		line_item_resource_id
)
SELECT *
FROM base_data
UNION ALL
SELECT NULL as usage_date,
	payer_account_id,
	usage_account_id,
	'TOTAL' as line_item_operation,
	'ALL BUCKETS' as bucket_name,
	SUM(operation_count) as operation_count,
	CONCAT('$', FORMAT('%.6f', (SUM(operation_count) / 100000.0) * 0.10)) as data_events_estimated_cost
FROM base_data
GROUP BY payer_account_id,
	usage_account_id
ORDER BY CASE WHEN bucket_name = 'ALL BUCKETS' THEN 0 ELSE 1 END,
	operation_count DESC;
```

아래 이미지는 CUR 쿼리의 출력을 보여줍니다. 먼저 모든 버킷에 대한 과금 가능 S3 API 작업의 전체 수와 Data Events의 대략적인 비용을 제공합니다. 그런 다음 각 버킷별 과금 가능 S3 API 작업 수와 대략적인 비용을 보여줍니다. 이 기본 정보는 Data Events에 대한 특정 고급 이벤트 선택기 필터에서 특정 S3 리소스를 제외/포함하는 것을 정의할 때 도움이 됩니다. CUR에서 추적되지 않는 작업으로 인해 실제 CloudTrail 비용이 더 높을 수 있다는 점을 유의하십시오.

![CloudTrail S3 Data Event 비용 추정](/img/cloudops/recipes/AWS%20CloudTrail/data-events-estimate-cost/data-events-estimate-cost.png)
