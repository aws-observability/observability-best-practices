# CloudTrail Data Event ఖర్చుల అంచనా

## పరిచయం

[CloudTrail Data Events](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/logging-data-events-with-cloudtrail.html) S3 objects, DynamoDB tables, Lambda functions మరియు అనేక ఇతర AWS resources పై data plane operations యొక్క వివరణాత్మక logging ను అందిస్తాయి. ఈ events విలువైన security మరియు compliance insights ను అందిస్తాయి, అయితే production environments లో operations యొక్క అధిక volume కారణంగా గణనీయమైన ఖర్చులు ఉత్పన్నమవుతాయి. Data Events ను ఎనేబుల్ చేయడానికి ముందు సంభావ్య ఖర్చు ప్రభావాన్ని అర్థం చేసుకోవడం budget planning మరియు cost optimization కోసం చాలా ముఖ్యం.

ఈ గైడ్‌లో S3 కోసం CloudTrail data events ఖర్చులను అంచనా వేయడానికి Cost and Usage Report (CUR) query ఎలా ఉపయోగించాలో చూపిస్తాము. భవిష్యత్తులో అదనపు data event resource types కోసం ఖర్చు అంచనా ఉదాహరణలను చేర్చడానికి గైడ్‌ను అప్‌డేట్ చేస్తాము.

:::note
**గమనిక**: ఈ గైడ్ CUR data ఉపయోగించి ఖర్చు అంచనా పద్ధతిని అందిస్తుంది, ఇది వాస్తవ CloudTrail ఖర్చులను తక్కువ అంచనా వేయవచ్చు ఎందుకంటే CUR కేవలం billable operations ను మాత్రమే track చేస్తుంది, CloudTrail అన్ని operations ను log చేస్తుంది.
:::

## CUR ఉపయోగించి S3 కోసం data events ఖర్చు అంచనా అవలోకనం

[AWS Cost and Usage Report (CUR)](https://docs.aws.amazon.com/cur/latest/userguide/creating-cur.html) మీ AWS service usage గురించి వ్యక్తిగత API operations తో సహా వివరణాత్మక సమాచారాన్ని కలిగి ఉంటుంది. మీ CUR data లో S3 API operations ను విశ్లేషించడం ద్వారా, CloudTrail Data Events ని ఎనేబుల్ చేయడం వల్ల సంభావ్య ఖర్చును అంచనా వేయవచ్చు. ఈ విధానం baseline estimate ను అందిస్తుంది ఎందుకంటే:

- **పాక్షిక correlation**: CUR లో నమోదు చేయబడిన ప్రతి S3 API operation, logging ఎనేబుల్ చేసినట్లయితే ఒక CloudTrail Data Event ను ఉత్పత్తి చేస్తుంది, కానీ CUR కేవలం billable operations ను మాత్రమే track చేస్తుంది
- **Historical analysis**: CUR data భవిష్యత్తు ఖర్చులను project చేయడానికి billable operations కోసం historical usage patterns ను అందిస్తుంది
- **Granular visibility**: మీరు tracked operations కోసం account, bucket, operation type మరియు time period ద్వారా ఖర్చులను విశ్లేషించవచ్చు
- **Cost calculation**: CloudTrail Data Events ధర ప్రతి 100,000 events కు $0.10

:::note
**ముఖ్యం**: ఈ పద్ధతి conservative estimate అందిస్తుంది ఎందుకంటే CUR free tier operations, failed operations, లేదా billing thresholds క్రింద ఉన్న operations ను track చేయదు, CloudTrail ఇప్పటికీ వాటిని log చేస్తుంది.
:::

కింది query మీ Amazon S3 API operations ను [CloudTrail data events for S3](https://docs.aws.amazon.com/AmazonS3/latest/userguide/cloudtrail-logging-s3-info.html#cloudtrail-data-events) తో అనుసంధానించి CUR data నుండి CloudTrail Data Events ఖర్చులను అంచనా వేస్తుంది.

## ముఖ్యమైన పరిమితులు

**CUR Tracking పరిమితులు**: CUR `line_item_operation` billable usage లేదా costs కు దారితీసే operations ను మాత్రమే track చేస్తుంది. దీని అర్థం:

- **Track చేయబడని Operations**: Free tier operations, failed operations, access denied events, మరియు billing thresholds క్రింద ఉన్న operations CUR లో చేర్చబడవు
- **CloudTrail అన్నింటినీ log చేస్తుంది**: CloudTrail Data Events success, failure, లేదా billing status తో సంబంధం లేకుండా ALL operations ను capture చేస్తాయి
- **Cost estimate accuracy**: CUR-based estimates వాస్తవ CloudTrail ఖర్చుల కంటే **తక్కువగా** ఉండవచ్చు ఎందుకంటే CloudTrail CUR track చేయని operations కంటే ఎక్కువ operations ను log చేస్తుంది

**సిఫార్సు**: ఈ estimate ను baseline గా ఉపయోగించండి, వాస్తవ CloudTrail Data Events ఖర్చులు ఎక్కువగా ఉండవచ్చని అర్థం చేసుకోండి, ముఖ్యంగా failed operations లేదా free tier usage యొక్క అధిక volumes ఉన్న environments లో.

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

క్రింది చిత్రం CUR query output ను చూపిస్తుంది. ఇది మొదట అన్ని buckets కోసం billable S3 API operations యొక్క మొత్తం count మరియు Data Events కోసం approximate cost ను ఇస్తుంది. తర్వాత, ఇది ప్రతి bucket కోసం billable S3 API operation count మరియు approximate cost ను ఇస్తుంది. ఈ baseline సమాచారం data events కోసం నిర్దిష్ట S3 resources ను exclude/include చేయడంలో నిర్దిష్ట advanced event selector filters ను నిర్వచించేటప్పుడు సహాయపడుతుంది, CUR లో track చేయబడని operations కారణంగా వాస్తవ CloudTrail ఖర్చులు ఎక్కువగా ఉండవచ్చని గుర్తుంచుకోండి.

![S3 కోసం CloudTrail Data Event Cost అంచనా](/img/cloudops/recipes/AWS%20CloudTrail/data-events-estimate-cost/data-events-estimate-cost.png)
