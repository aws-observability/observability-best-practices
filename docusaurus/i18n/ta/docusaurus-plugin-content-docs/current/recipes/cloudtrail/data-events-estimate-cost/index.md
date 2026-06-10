# CloudTrail Data Event செலவுகளை மதிப்பிடுதல்

## அறிமுகம்

[CloudTrail Data Events](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/logging-data-events-with-cloudtrail.html) S3 ஆப்ஜெக்ட்கள், DynamoDB டேபிள்கள், Lambda ஃபங்ஷன்கள் மற்றும் பல போன்ற AWS ரிசோர்ஸ்களில் data plane செயல்பாடுகளின் விரிவான லாக்கிங்கை வழங்குகின்றன. இந்த நிகழ்வுகள் மதிப்புமிக்க பாதுகாப்பு மற்றும் இணக்கத்தன்மை நுண்ணறிவுகளை வழங்கினாலும், உற்பத்தி சூழல்களில் அதிக அளவிலான செயல்பாடுகள் காரணமாக குறிப்பிடத்தக்க செலவுகளை உருவாக்கலாம். Data Events-ஐ இயக்குவதற்கு முன் சாத்தியமான செலவு தாக்கத்தைப் புரிந்துகொள்வது பட்ஜெட் திட்டமிடல் மற்றும் செலவு உகப்பாக்கத்திற்கு முக்கியமானது.

இந்த வழிகாட்டியில் S3-க்கான CloudTrail data events செலவுகளை மதிப்பிட Cost and Usage Report (CUR) வினவலை எவ்வாறு பயன்படுத்துவது என்பதை விளக்குவோம். எதிர்காலத்தில் கூடுதல் data event ரிசோர்ஸ் வகைகளுக்கான செலவு மதிப்பீட்டு உதாரணங்களைச் சேர்க்க வழிகாட்டியைப் புதுப்பிப்போம்.

:::note
**குறிப்பு**: இந்த வழிகாட்டி CUR தரவைப் பயன்படுத்தி செலவு தோராய முறையை வழங்குகிறது, இது உண்மையான CloudTrail செலவுகளைக் குறைத்து மதிப்பிடக்கூடும், ஏனெனில் CUR பில்லிங் செயல்பாடுகளை மட்டுமே கண்காணிக்கிறது, அதேசமயம் CloudTrail அனைத்து செயல்பாடுகளையும் பதிவு செய்கிறது.
:::

## CUR-ஐப் பயன்படுத்தி S3-க்கான Data Events செலவு மதிப்பீட்டின் கண்ணோட்டம்

[AWS Cost and Usage Report (CUR)](https://docs.aws.amazon.com/cur/latest/userguide/creating-cur.html) தனிப்பட்ட API செயல்பாடுகள் உட்பட உங்கள் AWS சேவை பயன்பாட்டைப் பற்றிய விரிவான தகவல்களைக் கொண்டுள்ளது. உங்கள் CUR தரவில் S3 API செயல்பாடுகளை பகுப்பாய்வு செய்வதன் மூலம், CloudTrail Data Events-ஐ இயக்குவதன் சாத்தியமான செலவை நீங்கள் தோராயமாக மதிப்பிடலாம். இந்த அணுகுமுறை அடிப்படை மதிப்பீட்டை வழங்குகிறது, ஏனெனில்:

- **பகுதி தொடர்பு**: CUR-ல் பதிவுசெய்யப்பட்ட ஒவ்வொரு S3 API செயல்பாடும் லாக்கிங் இயக்கப்பட்டால் ஒரு CloudTrail Data Event-ஐ உருவாக்கும், ஆனால் CUR பில்லிங் செயல்பாடுகளை மட்டுமே கண்காணிக்கிறது
- **வரலாற்று பகுப்பாய்வு**: CUR தரவு பில்லிங் செயல்பாடுகளுக்கான வரலாற்று பயன்பாட்டு முறைகளை எதிர்கால செலவுகளை கணிக்க வழங்குகிறது
- **நுணுக்கமான தெரிவுநிலை**: கண்காணிக்கப்பட்ட செயல்பாடுகளுக்கு கணக்கு, பக்கெட், செயல்பாட்டு வகை மற்றும் நேர காலம் ஆகியவற்றின் அடிப்படையில் செலவுகளை பகுப்பாய்வு செய்யலாம்
- **செலவு கணக்கீடு**: CloudTrail Data Events 100,000 நிகழ்வுகளுக்கு $0.10 விலையில் வழங்கப்படுகின்றன

:::note
**முக்கியம்**: இந்த முறை ஒரு பழமைவாத மதிப்பீட்டை வழங்குகிறது, ஏனெனில் CUR இலவச நிலை செயல்பாடுகள், தோல்வியுற்ற செயல்பாடுகள் அல்லது பில்லிங் வரம்புகளுக்குக் கீழே உள்ள செயல்பாடுகளைக் கண்காணிக்காது, ஆனால் CloudTrail இவற்றை இன்னும் பதிவு செய்யும்.
:::

பின்வரும் வினவல் [S3-க்கான CloudTrail data events](https://docs.aws.amazon.com/AmazonS3/latest/userguide/cloudtrail-logging-s3-info.html#cloudtrail-data-events)-உடன் தொடர்புடைய உங்கள் Amazon S3 API செயல்பாடுகளை CUR தரவிலிருந்து பகுப்பாய்வு செய்து CloudTrail Data Events செலவுகளை மதிப்பிடுகிறது.

## முக்கியமான வரம்புகள்

**CUR கண்காணிப்பு வரம்புகள்**: CUR `line_item_operation` பில்லிங் பயன்பாடு அல்லது செலவுகளை ஏற்படுத்தும் செயல்பாடுகளை மட்டுமே கண்காணிக்கிறது. இதன் பொருள்:

- **கண்காணிக்கப்படாத செயல்பாடுகள்**: இலவச நிலை செயல்பாடுகள், தோல்வியுற்ற செயல்பாடுகள், அணுகல் மறுக்கப்பட்ட நிகழ்வுகள் மற்றும் பில்லிங் வரம்புகளுக்குக் கீழே உள்ள செயல்பாடுகள் CUR-ல் சேர்க்கப்படவில்லை
- **CloudTrail அனைத்தையும் பதிவு செய்கிறது**: CloudTrail Data Events வெற்றி, தோல்வி அல்லது பில்லிங் நிலையைப் பொருட்படுத்தாமல் அனைத்து செயல்பாடுகளையும் கைப்பற்றுகின்றன
- **செலவு மதிப்பீட்டு துல்லியம்**: CUR-அடிப்படையிலான மதிப்பீடுகள் உண்மையான CloudTrail செலவுகளைவிட **குறைவாக** இருக்கலாம், ஏனெனில் CloudTrail CUR கண்காணிப்பதை விட அதிகமான செயல்பாடுகளை பதிவு செய்கிறது

**பரிந்துரை**: இந்த மதிப்பீட்டை அடிப்படையாகப் பயன்படுத்தவும், உண்மையான CloudTrail Data Events செலவுகள் அதிகமாக இருக்கலாம் என்பதைப் புரிந்துகொள்ளவும், குறிப்பாக அதிக அளவு தோல்வியுற்ற செயல்பாடுகள் அல்லது இலவச நிலை பயன்பாடு உள்ள சூழல்களில்.

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

கீழே உள்ள படம் CUR வினவலின் வெளியீட்டைக் காட்டுகிறது. இது முதலில் அனைத்து பக்கெட்களுக்கான பில்லிங் S3 API செயல்பாடுகளின் மொத்த எண்ணிக்கையையும் Data Events-க்கான தோராய செலவையும் வழங்கும். பின்னர், ஒவ்வொரு பக்கெட்டிற்கும் பில்லிங் S3 API செயல்பாட்டு எண்ணிக்கையையும் தோராய செலவையும் வழங்கும். CUR-ல் கண்காணிக்கப்படாத செயல்பாடுகள் காரணமாக உண்மையான CloudTrail செலவுகள் அதிகமாக இருக்கலாம் என்பதை மனதில் கொண்டு, data events-க்கான குறிப்பிட்ட S3 ரிசோர்ஸ்களை விலக்க/சேர்க்க குறிப்பிட்ட advanced event selector வடிப்பான்களை வரையறுக்கும்போது இந்த அடிப்படை தகவல் உதவியாக இருக்கும்.

![CloudTrail Estimation of Data Event Cost for S3](/img/cloudops/recipes/AWS%20CloudTrail/data-events-estimate-cost/data-events-estimate-cost.png)
