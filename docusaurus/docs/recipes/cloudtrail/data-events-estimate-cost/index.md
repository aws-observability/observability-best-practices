# Estimating CloudTrail Data Event Costs

## Introduction

[CloudTrail Data Events](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/logging-data-events-with-cloudtrail.html) provide detailed logging of data plane operations on AWS resources like S3 objects, DynamoDB tables, Lambda functions and many more. While these events offer valuable security and compliance insights, they can generate significant costs due to the high volume of operations in production environments. Understanding the potential cost impact before enabling Data Events is crucial for budget planning and cost optimization.

In this guide will demonstrate how to use a Cost and Usage Report (CUR) query to estimate the costs for CloudTrail data events for S3.  In the future will update the guide to include other example for estimating cost for additional data event resource types. 

:::note
**Note**: This guide provides a cost approximation method using CUR data, which may underestimate actual CloudTrail costs since CUR only tracks billable operations while CloudTrail logs all operations.
:::

## Overview of Cost Estimation for data events for S3 Using CUR

The [AWS Cost and Usage Report (CUR)](https://docs.aws.amazon.com/cur/latest/userguide/creating-cur.html) contains detailed information about your AWS service usage, including individual API operations. By analyzing S3 API operations in your CUR data, you can approximate the potential cost of enabling CloudTrail Data Events. This approach provides a baseline estimate because:

- **Partial correlation**: Each S3 API operation recorded in CUR would generate one CloudTrail Data Event if logging were enabled, but CUR only tracks billable operations
- **Historical analysis**: CUR data provides historical usage patterns for billable operations to project future costs
- **Granular visibility**: You can analyze costs by account, bucket, operation type, and time period for tracked operations
- **Cost calculation**: CloudTrail Data Events are priced at $0.10 per 100,000 events

:::note
**Important**: This method provides a conservative estimate as CUR doesn't track free tier operations, failed operations, or operations below billing thresholds that CloudTrail would still log.
:::

The following query analyzes your Amazon S3 API operations associated to [CloudTrail data events for S3](https://docs.aws.amazon.com/AmazonS3/latest/userguide/cloudtrail-logging-s3-info.html#cloudtrail-data-events) from CUR data to estimate CloudTrail Data Events costs.

## Important Limitations

**CUR Tracking Limitations**: CUR `line_item_operation` only tracks operations that result in billable usage or costs. This means:

- **Operations not tracked**: Free tier operations, failed operations, access denied events, and operations below billing thresholds are not included in CUR
- **CloudTrail logs everything**: CloudTrail Data Events capture ALL operations regardless of success, failure, or billing status
- **Cost estimate accuracy**: CUR-based estimates may be **lower** than actual CloudTrail costs since CloudTrail logs more operations than CUR tracks

**Recommendation**: Use this estimate as a baseline understanding that actual CloudTrail Data Events costs could be higher, especially in environments with high volumes of failed operations or free tier usage.

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

The below image shows the output of the CUR query. It will first give the overall count of billable S3 API operations for all buckets and the approximate cost for Data Events. Then, it will give the billable S3 API operation count for each bucket and the approximate cost. This baseline information will help when defining specific advanced event selector filters in excluding/including specific S3 resources for data events, keeping in mind that actual CloudTrail costs may be higher due to operations not tracked in CUR.

![CloudTrail Estimation of Data Event Cost for S3](/img/cloudops/recipes/AWS%20CloudTrail/data-events-estimate-cost/data-events-estimate-cost.png)
