# ఖర్చు అంచనా: CloudTrail Trails నుండి CloudWatch Logs Ingestion కు మారడం

## పరిచయం

[AWS CloudTrail](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html) ఉపయోగించే organizations వారి CloudTrail logs ను store చేయడానికి మరియు monitor చేయడానికి మూడు ప్రాథమిక approaches కలిగి ఉన్నాయి:

1. **CloudTrail Trails**: Amazon S3 buckets లో logs store చేయడం (optional CloudWatch Logs integration తో)
2. **CloudTrail Lake**: Advanced querying మరియు analytics కోసం managed data lake లో events store చేయడం
3. **Direct CloudWatch Logs Ingestion**: CloudTrail కోసం trail create చేయాల్సిన అవసరం లేకుండా CloudTrail events ను నేరుగా CloudWatch Logs కు send చేయడం

ఈ guide CloudTrail trails నుండి direct CloudWatch Logs ingestion కు move అయినప్పుడు cost estimate provide చేయడంపై focus చేస్తుంది. [CloudWatch Logs data sources](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/data-source-discovery-management.html) introduction తో, CloudTrail events స్వయంచాలకంగా CloudWatch Logs unified data store లోకి ingest చేయబడవచ్చు. ఇది మీ CloudTrail events కోసం enhanced log management, automatic schema discovery మరియు simplified querying capabilities అందిస్తుంది.

CloudTrail trails నుండి direct CloudWatch Logs ingestion కు move అవడం యొక్క cost implications ను అర్థం చేసుకోవడం budget planning మరియు cost optimization కోసం crucial. ఈ guide ఈ move తో associated costs ను estimate చేయడానికి [AWS Cost and Usage Report (CUR)](https://docs.aws.amazon.com/cur/latest/userguide/what-is-cur.html) data ఎలా ఉపయోగించాలో demonstrate చేస్తుంది.

:::note
**గమనిక**: ఈ guide CloudTrail events ను CloudWatch Logs లోకి ingest చేయడానికి మీ cost యొక్క estimate మాత్రమే provide చేస్తుంది మరియు storage మరియు queries వంటి CloudWatch Logs తో associated ఏదైనా additional cost include చేయదు.
:::

## CloudWatch Unified Data Store తో Data Source గా CloudTrail

CloudTrail అనేది CloudWatch unified data store లో data source, security మరియు operational analysis కోసం data provide చేస్తుంది. CloudWatch Logs కోసం unified data store CloudWatch Log Insights ఉపయోగించి CloudTrail data ను ఇతర AWS మరియు non-AWS logs తో correlate చేయడం enable చేస్తుంది.

## Cost Analysis: Trails నుండి CloudWatch Unified Data Store కు మారడం

[AWS Cost and Usage Report (CUR)](https://docs.aws.amazon.com/cur/latest/userguide/what-is-cur.html) [CloudTrail event volumes](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-costs.html) తో సహా మీ AWS service usage గురించి detailed information కలిగి ఉంటుంది. మీ CUR data లో record చేయబడిన CloudTrail events ను analyze చేయడం ద్వారా, direct CloudWatch Logs ingestion కు move అవడం యొక్క potential cost ను estimate చేయవచ్చు. ఈ approach baseline estimate అందిస్తుంది ఎందుకంటే:

- **Event correlation**: CUR లో record చేయబడిన ప్రతి CloudTrail event CloudWatch Logs ingestion charges incur అయ్యే event ను represent చేస్తుంది
- **Historical analysis**: CUR data భవిష్యత్ CloudWatch Logs costs project చేయడానికి historical CloudTrail usage patterns అందిస్తుంది
- **Granular visibility**: మీరు account, event type మరియు time period ద్వారా costs analyze చేయవచ్చు
- **Cost calculation**: CloudWatch Logs ingestion ధర GB కు $0.75 ($0.25 CloudTrail delivery + $0.50 CloudWatch Logs ingestion)

:::note
**ముఖ్యం**: ఈ method CUR లో record చేయబడిన actual CloudTrail event volumes ఆధారంగా estimate అందిస్తుంది. Estimate CloudWatch Logs తో associated storage cost include చేయదు.
:::

కింది query మీ CloudTrail events ను AWS Cost and Usage Report (CUR) data నుండి analyze చేసి CloudWatch Logs ingestion costs ను estimate చేస్తుంది.

### Query ను అర్థం చేసుకోవడం

Query ఈ ఆధారంగా costs calculate చేస్తుంది:

1. **Event Count**: CUR data ఉపయోగించి previous month నుండి Total CloudTrail events
2. **Estimated Data Size**: Event కు 1,500 bytes assume చేస్తుంది (average CloudTrail event size)
3. **Cost Components**:
   - CloudTrail delivery to CloudWatch Logs: GB కు $0.25
   - CloudWatch Logs ingestion: GB కు $0.50
   - Total ingestion cost: GB కు $0.75

### Cost Calculation Formula

```
Total Events × 1,500 bytes / 1,000,000,000 = GB of data
GB of data × $0.25 = CloudTrail delivery cost
GB of data × $0.50 = CloudWatch Logs ingestion cost
GB of data × $0.75 = Total ingestion cost
```

### Previous Month CloudTrail Usage Data ఉపయోగించి CUR Query

`<CUR_TABLE>` ను మీ actual CUR table name తో replace చేయండి:

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
**గమనిక**: ఈ sample query CloudTrail events ను CloudWatch Logs లోకి ingest చేయడానికి మీ monthly cost యొక్క estimate అందిస్తుంది. ఈ estimate storage, queries వంటి additional CloudWatch Logs costs లేదా మీ CloudTrail event volume లో potential future increases ను include చేయదని గమనించండి.
:::

క్రింది image CUR query output ను చూపిస్తుంది. Results event type (Management Events, Data Events మరియు Additional copies of Management Events) ద్వారా organize చేయబడతాయి మరియు previous month కోసం record చేయబడిన total CloudTrail events, ఆ period కోసం current trail costs మరియు estimated CloudWatch Logs ingestion costs provide చేస్తాయి.

![S3 కోసం CloudTrail Data Event Cost అంచనా](/img/cloudops/recipes/AWS%20CloudTrail/trail-events-estimate-cost/trail-events-cw-logs-estimate-cost.png)


## ముగింపు

CloudWatch Logs ingestion CloudTrail events కోసం real-time monitoring, faster analytics మరియు simplified management అందిస్తుంది. CUR query Trails నుండి move అయినప్పుడు మీ costs estimate చేయడంలో help చేస్తుంది మరియు CloudWatch Logs provide చేసే unified data store capabilities, immediate alerting, cross-service correlation మరియు మీ organization security మరియు compliance requirements కోసం reduced infrastructure complexity తో advantage తీసుకోవడంలో help చేస్తుంది.

:::note
Current pricing details కోసం, [AWS CloudTrail Pricing](https://aws.amazon.com/cloudtrail/pricing/) మరియు [Amazon CloudWatch Pricing](https://aws.amazon.com/cloudwatch/pricing/) చూడండి.
:::
