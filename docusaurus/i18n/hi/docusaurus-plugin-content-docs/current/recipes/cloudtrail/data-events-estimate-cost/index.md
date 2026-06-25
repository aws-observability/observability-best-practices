# CloudTrail Data Event लागत का अनुमान

## परिचय

[CloudTrail Data Events](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/logging-data-events-with-cloudtrail.html) S3 ऑब्जेक्ट्स, DynamoDB टेबल, Lambda फ़ंक्शन और कई अन्य AWS रिसोर्सेज पर डेटा प्लेन ऑपरेशंस की विस्तृत लॉगिंग प्रदान करते हैं। ये इवेंट्स मूल्यवान सुरक्षा और अनुपालन इनसाइट्स प्रदान करते हैं, लेकिन प्रोडक्शन एनवायरनमेंट में ऑपरेशंस की उच्च मात्रा के कारण महत्वपूर्ण लागत उत्पन्न कर सकते हैं। Data Events सक्षम करने से पहले संभावित लागत प्रभाव को समझना बजट नियोजन और लागत अनुकूलन के लिए महत्वपूर्ण है।

इस गाइड में S3 के लिए CloudTrail Data Events की लागत का अनुमान लगाने के लिए Cost and Usage Report (CUR) क्वेरी का उपयोग करने का तरीका दिखाया गया है। भविष्य में अतिरिक्त Data Event रिसोर्स प्रकारों के लिए लागत अनुमान उदाहरण शामिल करने के लिए गाइड को अपडेट किया जाएगा।

:::note
**नोट**: यह गाइड CUR डेटा का उपयोग करके एक लागत अनुमान विधि प्रदान करती है, जो वास्तविक CloudTrail लागत से कम अनुमान लगा सकती है क्योंकि CUR केवल बिलिंग योग्य ऑपरेशंस को ट्रैक करता है जबकि CloudTrail सभी ऑपरेशंस को लॉग करता है।
:::

## CUR का उपयोग करके S3 के लिए Data Events लागत अनुमान का अवलोकन

[AWS Cost and Usage Report (CUR)](https://docs.aws.amazon.com/cur/latest/userguide/creating-cur.html) में व्यक्तिगत API ऑपरेशंस सहित आपके AWS सेवा उपयोग के बारे में विस्तृत जानकारी होती है। अपने CUR डेटा में S3 API ऑपरेशंस का एनालिसिस करके, आप CloudTrail Data Events सक्षम करने की संभावित लागत का अनुमान लगा सकते हैं। यह दृष्टिकोण एक आधारभूत अनुमान प्रदान करता है क्योंकि:

- **आंशिक सहसंबंध**: CUR में रिकॉर्ड किया गया प्रत्येक S3 API ऑपरेशन एक CloudTrail Data Event उत्पन्न करेगा यदि लॉगिंग सक्षम हो, लेकिन CUR केवल बिलिंग योग्य ऑपरेशंस को ट्रैक करता है
- **ऐतिहासिक एनालिसिस**: CUR डेटा भविष्य की लागतों का अनुमान लगाने के लिए बिलिंग योग्य ऑपरेशंस के ऐतिहासिक उपयोग पैटर्न प्रदान करता है
- **विस्तृत दृश्यता**: आप ट्रैक किए गए ऑपरेशंस के लिए अकाउंट, बकेट, ऑपरेशन प्रकार और समय अवधि के अनुसार लागतों का एनालिसिस कर सकते हैं
- **लागत गणना**: CloudTrail Data Events की कीमत $0.10 प्रति 100,000 इवेंट्स है

:::note
**महत्वपूर्ण**: यह विधि एक रूढ़िवादी अनुमान प्रदान करती है क्योंकि CUR फ्री टियर ऑपरेशंस, विफल ऑपरेशंस, या बिलिंग सीमा से नीचे के ऑपरेशंस को ट्रैक नहीं करता जिन्हें CloudTrail अभी भी लॉग करेगा।
:::

निम्नलिखित क्वेरी CloudTrail Data Events लागत का अनुमान लगाने के लिए CUR डेटा से [S3 के लिए CloudTrail Data Events](https://docs.aws.amazon.com/AmazonS3/latest/userguide/cloudtrail-logging-s3-info.html#cloudtrail-data-events) से जुड़े आपके Amazon S3 API ऑपरेशंस का एनालिसिस करती है।

## महत्वपूर्ण सीमाएँ

**CUR ट्रैकिंग सीमाएँ**: CUR `line_item_operation` केवल उन ऑपरेशंस को ट्रैक करता है जिनके परिणामस्वरूप बिलिंग योग्य उपयोग या लागत होती है। इसका मतलब है:

- **ट्रैक न किए गए ऑपरेशन**: फ्री टियर ऑपरेशंस, विफल ऑपरेशंस, एक्सेस अस्वीकृत इवेंट्स, और बिलिंग सीमा से नीचे के ऑपरेशन CUR में शामिल नहीं हैं
- **CloudTrail सब कुछ लॉग करता है**: CloudTrail Data Events सफलता, विफलता, या बिलिंग स्थिति की परवाह किए बिना सभी ऑपरेशंस कैप्चर करते हैं
- **लागत अनुमान सटीकता**: CUR-आधारित अनुमान वास्तविक CloudTrail लागत से **कम** हो सकते हैं क्योंकि CloudTrail CUR की तुलना में अधिक ऑपरेशंस लॉग करता है

**अनुशंसा**: इस अनुमान का उपयोग एक आधारभूत मान के रूप में करें, यह समझते हुए कि वास्तविक CloudTrail Data Events लागत अधिक हो सकती है, विशेष रूप से ऐसे एनवायरनमेंट में जहाँ विफल ऑपरेशंस या फ्री टियर उपयोग की उच्च मात्रा हो।

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

नीचे दी गई इमेज CUR क्वेरी का आउटपुट दिखाती है। यह पहले सभी बकेट्स के लिए बिलिंग योग्य S3 API ऑपरेशंस की कुल गिनती और Data Events की अनुमानित लागत प्रदान करती है। फिर, यह प्रत्येक बकेट के लिए बिलिंग योग्य S3 API ऑपरेशन काउंट और अनुमानित लागत देती है। यह आधारभूत जानकारी Data Events के लिए विशिष्ट एडवांस्ड इवेंट सेलेक्टर फ़िल्टर में विशिष्ट S3 रिसोर्सेज को शामिल/बाहर करने को परिभाषित करते समय मदद करेगी, यह ध्यान में रखते हुए कि CUR में ट्रैक न किए गए ऑपरेशंस के कारण वास्तविक CloudTrail लागत अधिक हो सकती है।

![S3 के लिए CloudTrail Data Event लागत अनुमान](/img/cloudops/recipes/AWS%20CloudTrail/data-events-estimate-cost/data-events-estimate-cost.png)
