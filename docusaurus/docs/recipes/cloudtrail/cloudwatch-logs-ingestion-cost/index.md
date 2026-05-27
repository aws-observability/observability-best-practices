# Estimating Cost: Moving from CloudTrail Trails to CloudWatch Logs Ingestion

## Introduction

Organizations using [AWS CloudTrail](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html) have three primary approaches for storing and monitoring their CloudTrail logs:

1. **CloudTrail Trails**: Store logs in Amazon S3 buckets (with optional CloudWatch Logs integration)
2. **CloudTrail Lake**: Store events in a managed data lake for advanced querying and analytics
3. **Direct CloudWatch Logs Ingestion**: Send CloudTrail events directly to CloudWatch Logs without the need to create a trail for CloudTrail

This guide focuses on providing a cost estimate when moving from CloudTrail trails to direct CloudWatch Logs ingestion. With the introduction of [CloudWatch Logs data sources](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/data-source-discovery-management.html), CloudTrail events can be automatically ingested into CloudWatch Logs unified data store. This provides enhanced log management, automatic schema discovery, and simplified querying capabilities for your CloudTrail events. To learn more about the CloudWatch unified data store, see the blog post [Amazon CloudWatch introduces unified data management and analytics for operations, security, and compliance](https://aws.amazon.com/blogs/aws/amazon-cloudwatch-introduces-unified-data-management-and-analytics-for-operations-security-and-compliance/).

Understanding the cost implications of moving from CloudTrail trails to direct CloudWatch Logs ingestion is crucial for budget planning and cost optimization. This guide demonstrates how to use [AWS Cost and Usage Report (CUR)](https://docs.aws.amazon.com/cur/latest/userguide/what-is-cur.html) data to estimate the costs associated with this move.

:::note
**Note**: This guide provides only an estimate of your cost for ingesting CloudTrail events into CloudWatch Logs and doesn't include any additional cost associated with CloudWatch Logs such as storage and queries.
:::

## CloudTrail as a Data Source with CloudWatch Unified Data Store

CloudTrail is a data source within the CloudWatch unified data store, providing data for security and operational analysis. The unified data store for CloudWatch Logs enables you to correlate CloudTrail data with other AWS and non-AWS logs using CloudWatch Log Insights, providing visibility into your cloud infrastructure and security posture. 

## Cost Analysis: Moving from Trails to CloudWatch Unified Data Store

The [AWS Cost and Usage Report (CUR)](https://docs.aws.amazon.com/cur/latest/userguide/what-is-cur.html) contains detailed information about your AWS service usage, including [CloudTrail event volumes](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-costs.html). By analyzing CloudTrail events recorded in your CUR data, you can estimate the potential cost of moving to direct CloudWatch Logs ingestion. This approach provides a baseline estimate because:

- **Event correlation**: Each CloudTrail event recorded in CUR represents an event that would incur CloudWatch Logs ingestion charges
- **Historical analysis**: CUR data provides historical CloudTrail usage patterns to project future CloudWatch Logs costs
- **Granular visibility**: You can analyze costs by account, event type, and time period
- **Cost calculation**: CloudWatch Logs ingestion is priced at $0.75 per GB ($0.25 CloudTrail delivery + $0.50 CloudWatch Logs ingestion)

:::note
**Important**: This method provides an estimate based on actual CloudTrail event volumes recorded in CUR, helping you understand the cost impact of sending these events to CloudWatch Logs instead of using Trails to deliver to an S3 bucket. The estimate does not include the cost of storage associated with the CloudWatch Logs.
:::

The following query analyzes your CloudTrail events from AWS Cost and Usage Report (CUR) data to estimate CloudWatch Logs ingestion costs.

### Understanding the Query

The query calculates costs based on:

1. **Event Count**: Total CloudTrail events from previous month using CUR data
2. **Estimated Data Size**: Assumes 1,500 bytes per event (average CloudTrail event size)
3. **Cost Components**:
   - CloudTrail delivery to CloudWatch Logs: $0.25 per GB
   - CloudWatch Logs ingestion: $0.50 per GB
   - Total ingestion cost: $0.75 per GB

### Cost Calculation Formula

```
Total Events × 1,500 bytes / 1,000,000,000 = GB of data
GB of data × $0.25 = CloudTrail delivery cost
GB of data × $0.50 = CloudWatch Logs ingestion cost
GB of data × $0.75 = Total ingestion cost
```

### CUR Query Using Previous Month's CloudTrail Usage Data

Replace `<CUR_TABLE>` with your actual CUR table name:

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
**Note**: This sample query provides an estimate of your monthly cost for ingesting CloudTrail events into CloudWatch Logs. Please note that this estimate does not include additional CloudWatch Logs costs such as storage, queries, or potential future increases in your CloudTrail event volume. This calculation serves as an estimated baseline for your costs based on historical CUR (Cost and Usage Report) data.
:::

The image below shows the output of the CUR query. The results are organized by event type (Management Events, Data Events, and Additional copies of Management Events) and provide the total CloudTrail events recorded for the previous month, current trail costs for that period, and estimated CloudWatch Logs ingestion costs. This breakdown helps you understand the cost impact of moving each usage type from trails to direct CloudWatch Logs ingestion. 

![CloudTrail Estimation of Data Event Cost for S3](/img/cloudops/recipes/AWS%20CloudTrail/trail-events-estimate-cost/trail-events-cw-logs-estimate-cost.png)


## Conclusion

CloudWatch Logs ingestion provides real-time monitoring, faster analytics, and simplified management for CloudTrail events. The CUR query will help estimate your costs when moving from Trails and help take advantage of the unified data store capabilities that CloudWatch Logs provides, including immediate alerting, cross-service correlation, and reduced infrastructure complexity for your organization's security and compliance requirements.

:::note
For current pricing details, see [AWS CloudTrail Pricing](https://aws.amazon.com/cloudtrail/pricing/) and [Amazon CloudWatch Pricing](https://aws.amazon.com/cloudwatch/pricing/).
:::
