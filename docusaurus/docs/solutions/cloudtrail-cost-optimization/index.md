---
title: CloudTrail Cost Optimization
sidebar_label: Cost Optimization
---

# CloudTrail Cost Optimization

## Overview

AWS CloudTrail costs can grow significantly in production environments — particularly from data events, additional copies of management events, and CloudWatch Logs ingestion. Understanding and controlling these costs requires visibility into event volumes, strategic use of advanced event selectors, and choosing the right log destination architecture.

This guide covers estimating costs using AWS Cost and Usage Reports (CUR), controlling data event volume with advanced event selectors, optimizing CloudWatch Logs ingestion pricing, using log transformations to reduce downstream costs, automating log management with Athena, and understanding CloudTrail Lake pricing and migration options.

## When to use this

- Your CloudTrail spending is higher than expected or growing unexpectedly
- You are enabling data events and need to estimate the cost impact before deployment
- You are considering migrating from CloudTrail Trails to CloudWatch Logs direct ingestion
- You operate multiple trails and want to consolidate costs
- You want to reduce downstream SIEM or OpenSearch ingestion costs using log transformation
- You are evaluating CloudTrail Lake versus S3-based log storage

## Guidance

### Estimating data event costs with CUR

Before enabling data events, estimate the cost impact using your AWS Cost and Usage Report. CloudTrail data events are priced at **$0.10 per 100,000 events**.

The following CUR query analyzes S3 API operations to approximate data event costs:

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

:::note
CUR only tracks billable operations. CloudTrail logs all operations including failed requests and free tier usage. Actual costs may be higher than this estimate.
:::

![CUR query output showing estimated data event costs per S3 bucket](/img/cloudops/recipes/AWS%20CloudTrail/data-events-estimate-cost/data-events-estimate-cost.png "Estimated Data Event Costs for S3")

### Estimating CloudWatch Logs ingestion costs

When moving from CloudTrail Trails (S3) to direct CloudWatch Logs ingestion, use the following cost formula:

```
Total Events × 1,500 bytes / 1,000,000,000 = GB of data
GB of data × $0.25 = CloudTrail delivery cost
GB of data × $0.50 = CloudWatch Logs ingestion cost
GB of data × $0.75 = Total ingestion cost
```

Use this CUR query to estimate based on your previous month's event volumes (replace `<CUR_TABLE>` with your table name):

```sql
SELECT
  DATE_FORMAT(line_item_usage_start_date,'%Y-%m') AS month,
  line_item_usage_account_id as account_id,
  CAST(SUM(CAST(line_item_usage_amount AS DOUBLE)) AS BIGINT) AS total_cloudtrail_events,
  CONCAT('$', CAST(CAST(((SUM(CAST(line_item_usage_amount AS DOUBLE)) * 1500)/1000000000) * 0.75 AS DECIMAL(16,2)) AS VARCHAR)) AS total_cloudwatch_log_ingestion_cost,
  'Management Events' as event_type
FROM <CUR_TABLE>
WHERE DATE_FORMAT(line_item_usage_start_date,'%Y-%m') = DATE_FORMAT(date_add('month', -1, current_date),'%Y-%m')
  AND product_product_name = 'AWS CloudTrail'
  AND line_item_line_item_type IN ('DiscountedUsage', 'Usage', 'SavingsPlanCoveredUsage')
  AND line_item_usage_type LIKE '%-FreeEventsRecorded'
GROUP BY line_item_usage_account_id, DATE_FORMAT(line_item_usage_start_date,'%Y-%m')
ORDER BY month, account_id
```

![CUR query results showing estimated CloudWatch Logs ingestion costs by event type](/img/cloudops/recipes/AWS%20CloudTrail/trail-events-estimate-cost/trail-events-cw-logs-estimate-cost.png "Estimated CloudWatch Logs Ingestion Cost")

### Controlling costs with advanced event selectors

Advanced event selectors reduce data event volume by logging only what matters:

- **Log only write operations** on sensitive buckets instead of all S3 activity
- **Exclude automated service roles** that generate predictable, low-risk events using `userIdentity.arn` with `NotStartsWith`
- **Exclude development accounts** from organization-level data event logging
- **Use pattern-based selectors** (`StartsWith`, `EndsWith`) to automatically cover resources following naming conventions

Example — exclude backup and temporary buckets from S3 data events:

```json
[
  {
    "FieldSelectors": [
      { "Field": "eventCategory", "Equals": ["Data"] },
      { "Field": "resources.type", "Equals": ["AWS::S3::Object"] },
      {
        "Field": "resources.ARN",
        "NotStartsWith": [
          "arn:aws:s3:::backup-bucket-",
          "arn:aws:s3:::temp-processing-",
          "arn:aws:s3:::automated-logs-"
        ]
      }
    ]
  }
]
```

### Reducing costs from multiple trails

The first copy of management events is included with AWS Free Tier. Additional trails incur costs. To reduce this:

- **Use CloudTrail Lake** for additional copies — up to 90% cheaper than additional trail copies
- **Exclude KMS and RDS Data API events** from additional trails (high-volume, low-value for most use cases)
- **Use S3 Bucket Keys** instead of object-level KMS keys to reduce KMS request costs by up to 99%

![AWS Budgets configuration for CloudTrail spending monitoring](/img/cloudops/guides/cloudtrail/cloudtrail-budgets.png "Monitoring CloudTrail Costs with AWS Budgets")

### Optimizing downstream costs with log transformation

CloudWatch Logs Transformation reduces data volume sent to downstream systems (SIEMs, OpenSearch, S3) via subscription filters:

```json
[
  { "parseJSON": { "source": "@message" } },
  {
    "deleteKeys": {
      "withKeys": ["responseElements", "requestParameters"]
    }
  }
]
```

Both original and transformed logs are stored in CloudWatch Logs. The cost savings apply to downstream subscription filter destinations, not CloudWatch storage.

### CloudTrail Lake pricing and migration

CloudTrail Lake offers two pricing options:

| Option | Best for | Key consideration |
|--------|----------|-------------------|
| One-year extendable retention | Most workloads (&lt;25 TB/month) | Most cost-effective for typical volumes |
| Seven-year retention | High-volume environments (>25 TB/month) | Lower per-GB price at scale |

For organizations migrating from CloudTrail Lake to CloudWatch, a three-phase approach preserves continuity:

1. **Export historical data** from CloudTrail Lake to CloudWatch
2. **Enable new CloudTrail ingestion** via telemetry enablement rules
3. **Set up cross-account/cross-region centralization** for unified analysis

![Three-phase migration approach from CloudTrail Lake to CloudWatch](/img/cloudops/guides/cloudtrail-lake/cloudtrail_lake_to_cloudwatch/three-phase-migration-approach.png "CloudTrail Lake to CloudWatch Migration Phases")

### Automating log management with Amazon Athena

For cost-effective long-term analysis of CloudTrail logs stored in S3, use partitioned Athena tables:

- **Partition by account, region, and date** — Athena scans only relevant data, reducing query costs
- **Use partition projection** — automatically includes new accounts and partitions without manual `ALTER TABLE`
- **Deploy via CloudFormation** using the [CloudTrail Athena automation scripts](https://github.com/aws-samples/sample-automation-cloudtrail-athena)

### Cost monitoring best practices

- **AWS Budgets**: Set cost-based budgets for the CloudTrail service with email or AWS Chatbot alerts
- **AWS Cost Anomaly Detection**: Create a monitor for CloudTrail to detect unexpected spending spikes
- **CloudTrail Lake CloudWatch metrics**: Monitor `HourlyDataIngested` and `TotalPaidStorageBytes` to track Lake usage

## Related

- [CloudTrail Monitoring](../cloudtrail-monitoring/) — Setup and configuration of trails and event data stores
- [Observability Cost Management](../observability-cost-management/) — Broader cost optimization for observability
- [AWS CloudTrail Pricing](https://aws.amazon.com/cloudtrail/pricing/) — Current pricing details
- [Amazon CloudWatch Pricing](https://aws.amazon.com/cloudwatch/pricing/) — CloudWatch Logs ingestion and storage costs
