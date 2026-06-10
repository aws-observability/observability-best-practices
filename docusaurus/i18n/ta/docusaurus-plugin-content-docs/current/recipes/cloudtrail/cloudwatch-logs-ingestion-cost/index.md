# செலவு மதிப்பீடு: CloudTrail Trails-லிருந்து CloudWatch Logs Ingestion-க்கு மாறுதல்

## அறிமுகம்

[AWS CloudTrail](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html)-ஐப் பயன்படுத்தும் நிறுவனங்களுக்கு தங்கள் CloudTrail லாக்குகளை சேமிக்கவும் கண்காணிக்கவும் மூன்று முதன்மை அணுகுமுறைகள் உள்ளன:

1. **CloudTrail Trails**: Amazon S3 பக்கெட்களில் லாக்குகளை சேமித்தல் (விரும்பினால் CloudWatch Logs ஒருங்கிணைப்புடன்)
2. **CloudTrail Lake**: மேம்பட்ட வினவல் மற்றும் பகுப்பாய்வுக்காக நிர்வகிக்கப்படும் data lake-ல் நிகழ்வுகளை சேமித்தல்
3. **நேரடி CloudWatch Logs Ingestion**: CloudTrail-க்கு trail உருவாக்காமல் CloudTrail நிகழ்வுகளை நேரடியாக CloudWatch Logs-க்கு அனுப்புதல்

இந்த வழிகாட்டி CloudTrail trails-லிருந்து நேரடி CloudWatch Logs ingestion-க்கு மாறும்போது செலவு மதிப்பீட்டை வழங்குவதில் கவனம் செலுத்துகிறது. [CloudWatch Logs data sources](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/data-source-discovery-management.html) அறிமுகத்துடன், CloudTrail நிகழ்வுகள் தானாகவே CloudWatch Logs ஒருங்கிணைந்த தரவு சேமிப்பகத்தில் உள்ளிடப்படலாம். இது மேம்பட்ட லாக் மேலாண்மை, தானியங்கு schema கண்டறிதல் மற்றும் உங்கள் CloudTrail நிகழ்வுகளுக்கான எளிமையான வினவல் திறன்களை வழங்குகிறது. CloudWatch ஒருங்கிணைந்த தரவு சேமிப்பகத்தைப் பற்றி மேலும் அறிய, [Amazon CloudWatch introduces unified data management and analytics for operations, security, and compliance](https://aws.amazon.com/blogs/aws/amazon-cloudwatch-introduces-unified-data-management-and-analytics-for-operations-security-and-compliance/) வலைப்பதிவு இடுகையைப் பார்க்கவும்.

CloudTrail trails-லிருந்து நேரடி CloudWatch Logs ingestion-க்கு மாறுவதன் செலவு தாக்கங்களைப் புரிந்துகொள்வது பட்ஜெட் திட்டமிடல் மற்றும் செலவு உகப்பாக்கத்திற்கு முக்கியமானது. இந்த வழிகாட்டி இந்த மாற்றத்துடன் தொடர்புடைய செலவுகளை மதிப்பிட [AWS Cost and Usage Report (CUR)](https://docs.aws.amazon.com/cur/latest/userguide/what-is-cur.html) தரவை எவ்வாறு பயன்படுத்துவது என்பதை விளக்குகிறது.

:::note
**குறிப்பு**: இந்த வழிகாட்டி CloudTrail நிகழ்வுகளை CloudWatch Logs-ல் உள்ளிடுவதற்கான உங்கள் செலவின் மதிப்பீட்டை மட்டுமே வழங்குகிறது, சேமிப்பு மற்றும் வினவல்கள் போன்ற CloudWatch Logs-உடன் தொடர்புடைய கூடுதல் செலவுகளை உள்ளடக்கவில்லை.
:::

## CloudWatch ஒருங்கிணைந்த தரவு சேமிப்பகத்துடன் தரவு மூலமாக CloudTrail

CloudTrail என்பது CloudWatch ஒருங்கிணைந்த தரவு சேமிப்பகத்தில் ஒரு தரவு மூலமாகும், இது பாதுகாப்பு மற்றும் செயல்பாட்டு பகுப்பாய்விற்கான தரவை வழங்குகிறது. CloudWatch Logs-க்கான ஒருங்கிணைந்த தரவு சேமிப்பகம் CloudWatch Log Insights-ஐப் பயன்படுத்தி CloudTrail தரவை மற்ற AWS மற்றும் AWS அல்லாத லாக்குகளுடன் தொடர்புபடுத்த உதவுகிறது, இது உங்கள் கிளவுட் உள்கட்டமைப்பு மற்றும் பாதுகாப்பு நிலையில் தெரிவுநிலையை வழங்குகிறது.

## செலவு பகுப்பாய்வு: Trails-லிருந்து CloudWatch ஒருங்கிணைந்த தரவு சேமிப்பகத்திற்கு மாறுதல்

[AWS Cost and Usage Report (CUR)](https://docs.aws.amazon.com/cur/latest/userguide/what-is-cur.html) [CloudTrail நிகழ்வு அளவுகள்](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-costs.html) உட்பட உங்கள் AWS சேவை பயன்பாட்டைப் பற்றிய விரிவான தகவல்களைக் கொண்டுள்ளது. உங்கள் CUR தரவில் பதிவுசெய்யப்பட்ட CloudTrail நிகழ்வுகளை பகுப்பாய்வு செய்வதன் மூலம், நேரடி CloudWatch Logs ingestion-க்கு மாறுவதன் சாத்தியமான செலவை நீங்கள் மதிப்பிடலாம். இந்த அணுகுமுறை அடிப்படை மதிப்பீட்டை வழங்குகிறது, ஏனெனில்:

- **நிகழ்வு தொடர்பு**: CUR-ல் பதிவுசெய்யப்பட்ட ஒவ்வொரு CloudTrail நிகழ்வும் CloudWatch Logs ingestion கட்டணங்களை ஏற்படுத்தும் ஒரு நிகழ்வைக் குறிக்கிறது
- **வரலாற்று பகுப்பாய்வு**: CUR தரவு எதிர்கால CloudWatch Logs செலவுகளை கணிக்க வரலாற்று CloudTrail பயன்பாட்டு முறைகளை வழங்குகிறது
- **நுணுக்கமான தெரிவுநிலை**: கணக்கு, நிகழ்வு வகை மற்றும் நேர காலத்தின் அடிப்படையில் செலவுகளை பகுப்பாய்வு செய்யலாம்
- **செலவு கணக்கீடு**: CloudWatch Logs ingestion GB-க்கு $0.75 விலையில் வழங்கப்படுகிறது ($0.25 CloudTrail டெலிவரி + $0.50 CloudWatch Logs ingestion)

:::note
**முக்கியம்**: இந்த முறை CUR-ல் பதிவுசெய்யப்பட்ட உண்மையான CloudTrail நிகழ்வு அளவுகளின் அடிப்படையில் ஒரு மதிப்பீட்டை வழங்குகிறது, இந்த நிகழ்வுகளை Trails-ஐப் பயன்படுத்தி S3 பக்கெட்டுக்கு டெலிவரி செய்வதற்குப் பதிலாக CloudWatch Logs-க்கு அனுப்புவதன் செலவு தாக்கத்தைப் புரிந்துகொள்ள உதவுகிறது. மதிப்பீடு CloudWatch Logs-உடன் தொடர்புடைய சேமிப்பு செலவை உள்ளடக்கவில்லை.
:::

பின்வரும் வினவல் AWS Cost and Usage Report (CUR) தரவிலிருந்து உங்கள் CloudTrail நிகழ்வுகளை பகுப்பாய்வு செய்து CloudWatch Logs ingestion செலவுகளை மதிப்பிடுகிறது.

### வினவலைப் புரிந்துகொள்ளுதல்

வினவல் பின்வருவனவற்றின் அடிப்படையில் செலவுகளைக் கணக்கிடுகிறது:

1. **நிகழ்வு எண்ணிக்கை**: CUR தரவைப் பயன்படுத்தி முந்தைய மாதத்தின் மொத்த CloudTrail நிகழ்வுகள்
2. **மதிப்பிடப்பட்ட தரவு அளவு**: ஒரு நிகழ்வுக்கு 1,500 பைட்கள் என்று கருதப்படுகிறது (சராசரி CloudTrail நிகழ்வு அளவு)
3. **செலவு கூறுகள்**:
   - CloudTrail-லிருந்து CloudWatch Logs-க்கு டெலிவரி: GB-க்கு $0.25
   - CloudWatch Logs ingestion: GB-க்கு $0.50
   - மொத்த ingestion செலவு: GB-க்கு $0.75

### செலவு கணக்கீட்டு சூத்திரம்

```
Total Events x 1,500 bytes / 1,000,000,000 = GB of data
GB of data x $0.25 = CloudTrail delivery cost
GB of data x $0.50 = CloudWatch Logs ingestion cost
GB of data x $0.75 = Total ingestion cost
```

### முந்தைய மாதத்தின் CloudTrail பயன்பாட்டு தரவைப் பயன்படுத்தும் CUR வினவல்

`<CUR_TABLE>`-ஐ உங்கள் உண்மையான CUR டேபிள் பெயருடன் மாற்றவும்:

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
**குறிப்பு**: இந்த மாதிரி வினவல் CloudTrail நிகழ்வுகளை CloudWatch Logs-ல் உள்ளிடுவதற்கான உங்கள் மாதாந்திர செலவின் மதிப்பீட்டை வழங்குகிறது. இந்த மதிப்பீடு சேமிப்பு, வினவல்கள் அல்லது உங்கள் CloudTrail நிகழ்வு அளவில் எதிர்கால அதிகரிப்புகள் போன்ற கூடுதல் CloudWatch Logs செலவுகளை உள்ளடக்கவில்லை. இந்த கணக்கீடு வரலாற்று CUR (Cost and Usage Report) தரவின் அடிப்படையில் உங்கள் செலவுகளுக்கான மதிப்பிடப்பட்ட அடிப்படையாக செயல்படுகிறது.
:::

கீழே உள்ள படம் CUR வினவலின் வெளியீட்டைக் காட்டுகிறது. முடிவுகள் நிகழ்வு வகையின் அடிப்படையில் (Management Events, Data Events மற்றும் Additional copies of Management Events) ஒழுங்கமைக்கப்பட்டுள்ளன, மேலும் முந்தைய மாதத்தில் பதிவுசெய்யப்பட்ட மொத்த CloudTrail நிகழ்வுகள், அந்த காலத்திற்கான தற்போதைய trail செலவுகள் மற்றும் மதிப்பிடப்பட்ட CloudWatch Logs ingestion செலவுகளை வழங்குகின்றன. இந்த பிரிவு ஒவ்வொரு பயன்பாட்டு வகையையும் trails-லிருந்து நேரடி CloudWatch Logs ingestion-க்கு மாற்றுவதன் செலவு தாக்கத்தைப் புரிந்துகொள்ள உதவுகிறது.

![CloudTrail Estimation of Data Event Cost for S3](/img/cloudops/recipes/AWS%20CloudTrail/trail-events-estimate-cost/trail-events-cw-logs-estimate-cost.png)


## முடிவுரை

CloudWatch Logs ingestion CloudTrail நிகழ்வுகளுக்கான நிகழ்நேர கண்காணிப்பு, வேகமான பகுப்பாய்வு மற்றும் எளிமையான மேலாண்மையை வழங்குகிறது. CUR வினவல் Trails-லிருந்து மாறும்போது உங்கள் செலவுகளை மதிப்பிட உதவும், மேலும் உடனடி எச்சரிக்கை, குறுக்கு-சேவை தொடர்பு மற்றும் உங்கள் நிறுவனத்தின் பாதுகாப்பு மற்றும் இணக்கத்தன்மை தேவைகளுக்கான குறைக்கப்பட்ட உள்கட்டமைப்பு சிக்கலான்மை உள்ளிட்ட CloudWatch Logs வழங்கும் ஒருங்கிணைந்த தரவு சேமிப்பக திறன்களைப் பயன்படுத்திக்கொள்ள உதவும்.

:::note
தற்போதைய விலை விவரங்களுக்கு, [AWS CloudTrail Pricing](https://aws.amazon.com/cloudtrail/pricing/) மற்றும் [Amazon CloudWatch Pricing](https://aws.amazon.com/cloudwatch/pricing/) பார்க்கவும்.
:::
