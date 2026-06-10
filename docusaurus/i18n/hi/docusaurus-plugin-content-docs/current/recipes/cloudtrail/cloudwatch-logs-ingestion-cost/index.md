# लागत अनुमान: CloudTrail Trails से CloudWatch Logs इंजेशन में परिवर्तन

## परिचय

[AWS CloudTrail](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html) का उपयोग करने वाले संगठनों के पास अपने CloudTrail लॉग्स को स्टोर और मॉनिटर करने के लिए तीन प्राथमिक दृष्टिकोण हैं:

1. **CloudTrail Trails**: Amazon S3 बकेट्स में लॉग स्टोर करें (वैकल्पिक CloudWatch Logs एकीकरण के साथ)
2. **CloudTrail Lake**: एडवांस्ड क्वेरीइंग और एनालिटिक्स के लिए प्रबंधित डेटा लेक में इवेंट्स स्टोर करें
3. **सीधा CloudWatch Logs इंजेशन**: CloudTrail के लिए ट्रेल बनाने की आवश्यकता के बिना CloudTrail इवेंट्स को सीधे CloudWatch Logs में भेजें

यह गाइड CloudTrail Trails से सीधे CloudWatch Logs इंजेशन में परिवर्तन करते समय लागत अनुमान प्रदान करने पर केंद्रित है। [CloudWatch Logs डेटा सोर्सेज](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/data-source-discovery-management.html) की शुरुआत के साथ, CloudTrail इवेंट्स को स्वचालित रूप से CloudWatch Logs यूनिफाइड डेटा स्टोर में इंजेस्ट किया जा सकता है। यह बेहतर लॉग प्रबंधन, स्वचालित स्कीमा डिस्कवरी, और आपके CloudTrail इवेंट्स के लिए सरलीकृत क्वेरीइंग क्षमताएँ प्रदान करता है। CloudWatch यूनिफाइड डेटा स्टोर के बारे में अधिक जानने के लिए, ब्लॉग पोस्ट [Amazon CloudWatch introduces unified data management and analytics for operations, security, and compliance](https://aws.amazon.com/blogs/aws/amazon-cloudwatch-introduces-unified-data-management-and-analytics-for-operations-security-and-compliance/) देखें।

CloudTrail Trails से सीधे CloudWatch Logs इंजेशन में परिवर्तन की लागत प्रभावों को समझना बजट नियोजन और लागत अनुकूलन के लिए महत्वपूर्ण है। यह गाइड दर्शाती है कि इस परिवर्तन से जुड़ी लागतों का अनुमान लगाने के लिए [AWS Cost and Usage Report (CUR)](https://docs.aws.amazon.com/cur/latest/userguide/what-is-cur.html) डेटा का उपयोग कैसे करें।

:::note
**नोट**: यह गाइड केवल CloudTrail इवेंट्स को CloudWatch Logs में इंजेस्ट करने की आपकी लागत का अनुमान प्रदान करती है और इसमें स्टोरेज और क्वेरीज़ जैसी CloudWatch Logs से जुड़ी कोई अतिरिक्त लागत शामिल नहीं है।
:::

## CloudWatch यूनिफाइड डेटा स्टोर के साथ डेटा सोर्स के रूप में CloudTrail

CloudTrail, CloudWatch यूनिफाइड डेटा स्टोर के भीतर एक डेटा सोर्स है, जो सुरक्षा और ऑपरेशनल विश्लेषण के लिए डेटा प्रदान करता है। CloudWatch Logs के लिए यूनिफाइड डेटा स्टोर आपको CloudWatch Log Insights का उपयोग करके CloudTrail डेटा को अन्य AWS और गैर-AWS लॉग्स के साथ सहसंबंधित करने में सक्षम बनाता है, जो आपके क्लाउड इन्फ्रास्ट्रक्चर और सुरक्षा स्थिति में दृश्यता प्रदान करता है।

## लागत विश्लेषण: Trails से CloudWatch यूनिफाइड डेटा स्टोर में परिवर्तन

[AWS Cost and Usage Report (CUR)](https://docs.aws.amazon.com/cur/latest/userguide/what-is-cur.html) में [CloudTrail इवेंट वॉल्यूम](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-costs.html) सहित आपके AWS सेवा उपयोग के बारे में विस्तृत जानकारी होती है। आपके CUR डेटा में रिकॉर्ड किए गए CloudTrail इवेंट्स का विश्लेषण करके, आप सीधे CloudWatch Logs इंजेशन में जाने की संभावित लागत का अनुमान लगा सकते हैं। यह दृष्टिकोण एक आधारभूत अनुमान प्रदान करता है क्योंकि:

- **इवेंट सहसंबंध**: CUR में रिकॉर्ड किया गया प्रत्येक CloudTrail इवेंट एक ऐसे इवेंट का प्रतिनिधित्व करता है जिस पर CloudWatch Logs इंजेशन शुल्क लगेगा
- **ऐतिहासिक विश्लेषण**: CUR डेटा भविष्य की CloudWatch Logs लागतों का अनुमान लगाने के लिए ऐतिहासिक CloudTrail उपयोग पैटर्न प्रदान करता है
- **विस्तृत दृश्यता**: आप अकाउंट, इवेंट प्रकार और समय अवधि के अनुसार लागतों का विश्लेषण कर सकते हैं
- **लागत गणना**: CloudWatch Logs इंजेशन की कीमत $0.75 प्रति GB ($0.25 CloudTrail डिलीवरी + $0.50 CloudWatch Logs इंजेशन) है

:::note
**महत्वपूर्ण**: यह विधि CUR में रिकॉर्ड किए गए वास्तविक CloudTrail इवेंट वॉल्यूम पर आधारित अनुमान प्रदान करती है, जो आपको Trails का उपयोग करके S3 बकेट में डिलीवर करने के बजाय इन इवेंट्स को CloudWatch Logs में भेजने के लागत प्रभाव को समझने में मदद करती है। अनुमान में CloudWatch Logs से संबंधित स्टोरेज लागत शामिल नहीं है।
:::

निम्नलिखित क्वेरी CloudWatch Logs इंजेशन लागतों का अनुमान लगाने के लिए AWS Cost and Usage Report (CUR) डेटा से आपके CloudTrail इवेंट्स का विश्लेषण करती है।

### क्वेरी को समझना

क्वेरी निम्नलिखित के आधार पर लागतों की गणना करती है:

1. **इवेंट काउंट**: CUR डेटा का उपयोग करके पिछले महीने के कुल CloudTrail इवेंट्स
2. **अनुमानित डेटा आकार**: प्रति इवेंट 1,500 बाइट्स मानता है (औसत CloudTrail इवेंट आकार)
3. **लागत घटक**:
   - CloudTrail से CloudWatch Logs तक डिलीवरी: $0.25 प्रति GB
   - CloudWatch Logs इंजेशन: $0.50 प्रति GB
   - कुल इंजेशन लागत: $0.75 प्रति GB

### लागत गणना सूत्र

```
कुल इवेंट्स x 1,500 बाइट्स / 1,000,000,000 = GB डेटा
GB डेटा x $0.25 = CloudTrail डिलीवरी लागत
GB डेटा x $0.50 = CloudWatch Logs इंजेशन लागत
GB डेटा x $0.75 = कुल इंजेशन लागत
```

### पिछले महीने के CloudTrail उपयोग डेटा का उपयोग करते हुए CUR क्वेरी

`<CUR_TABLE>` को अपने वास्तविक CUR टेबल नाम से बदलें:

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
**नोट**: यह सैंपल क्वेरी CloudTrail इवेंट्स को CloudWatch Logs में इंजेस्ट करने की आपकी मासिक लागत का अनुमान प्रदान करती है। कृपया ध्यान दें कि इस अनुमान में स्टोरेज, क्वेरीज़, या आपके CloudTrail इवेंट वॉल्यूम में भविष्य की वृद्धि जैसी अतिरिक्त CloudWatch Logs लागतें शामिल नहीं हैं। यह गणना ऐतिहासिक CUR (Cost and Usage Report) डेटा पर आधारित आपकी लागतों के लिए एक अनुमानित आधारभूत रेखा के रूप में कार्य करती है।
:::

नीचे दी गई इमेज CUR क्वेरी का आउटपुट दिखाती है। परिणाम इवेंट प्रकार (Management Events, Data Events, और Additional copies of Management Events) के अनुसार व्यवस्थित हैं और पिछले महीने के लिए रिकॉर्ड किए गए कुल CloudTrail इवेंट्स, उस अवधि की वर्तमान Trail लागत, और अनुमानित CloudWatch Logs इंजेशन लागत प्रदान करते हैं। यह विभाजन आपको प्रत्येक उपयोग प्रकार को Trails से सीधे CloudWatch Logs इंजेशन में ले जाने के लागत प्रभाव को समझने में मदद करता है।

![S3 के लिए CloudTrail Data Event लागत अनुमान](/img/cloudops/recipes/AWS%20CloudTrail/trail-events-estimate-cost/trail-events-cw-logs-estimate-cost.png)


## निष्कर्ष

CloudWatch Logs इंजेशन CloudTrail इवेंट्स के लिए रियल-टाइम मॉनिटरिंग, तेज़ एनालिटिक्स, और सरलीकृत प्रबंधन प्रदान करता है। CUR क्वेरी Trails से परिवर्तन करते समय आपकी लागतों का अनुमान लगाने में मदद करेगी और तत्काल अलर्टिंग, क्रॉस-सर्विस सहसंबंध, और आपके संगठन की सुरक्षा और अनुपालन आवश्यकताओं के लिए कम इन्फ्रास्ट्रक्चर जटिलता सहित CloudWatch Logs द्वारा प्रदान की जाने वाली यूनिफाइड डेटा स्टोर क्षमताओं का लाभ उठाने में मदद करेगी।

:::note
वर्तमान मूल्य निर्धारण विवरण के लिए, [AWS CloudTrail मूल्य निर्धारण](https://aws.amazon.com/cloudtrail/pricing/) और [Amazon CloudWatch मूल्य निर्धारण](https://aws.amazon.com/cloudwatch/pricing/) देखें।
:::
