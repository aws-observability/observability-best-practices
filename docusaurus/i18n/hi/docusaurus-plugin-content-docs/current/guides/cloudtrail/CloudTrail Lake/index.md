---
sidebar_position: 3
---
# CloudTrail Lake
CloudTrail Lake आपके संगठन के लिए एक managed data lake प्रदान करते हुए अंतर्ग्रहित events को एकत्रित, अपरिवर्तनीय रूप से संग्रहीत और क्वेरी करता है। आपका संगठन ऑडिटिंग, सुरक्षा जाँच और परिचालन जाँच के लिए इन events का उपयोग कर सकता है। CloudTrail Lake CloudTrail के भीतर विश्लेषण और क्वेरीइंग के लिए संग्रह, स्टोरेज, तैयारी और अनुकूलन को एकीकृत करके विश्लेषण कार्यप्रवाह को सरल बनाता है। निम्नलिखित CloudTrail Lake के आसपास कुछ सर्वोत्तम प्रथाओं की रूपरेखा तैयार करेगा।

### सही मूल्य निर्धारण विकल्प चुनना
अपना event data store बनाते समय, आप एक ऐसा मूल्य निर्धारण विकल्प चुनना चाहते हैं जो उस प्रकार और मात्रा के events के अनुकूल हो जो आप मासिक रूप से अंतर्ग्रहित करने की उम्मीद करते हैं। अधिकांश के लिए, One-year extendable retention मूल्य निर्धारण विकल्प सबसे लागत-प्रभावी दृष्टिकोण है। हालांकि, यदि आप प्रति माह 25 TB से अधिक डेटा अंतर्ग्रहित करेंगे, तो Seven-year retention मूल्य निर्धारण विकल्प एक बेहतर विकल्प हो सकता है।

![CloudTrail Lake मूल्य निर्धारण विकल्प](/img/cloudops/guides/cloudtrail-lake/price-option-eds.png "CloudTrail Lake मूल्य निर्धारण विकल्प")

### Lake query Federation
हम Lake query Federation सक्षम करने की अनुशंसा करते हैं, जो आपको Athena से zero-ETL विश्लेषण के लिए अपना event data store कॉन्फ़िगर करने की अनुमति देगा। यह S3 में संग्रहीत एप्लिकेशन लॉग्स या Cost and Usage डेटा के साथ activity logs को सहसंबंधित करने में सक्षम होने के लिए data processing pipelines बनाने की परिचालन जटिलताओं को हटाता है। यह आपको Athena के भीतर अपने अन्य data sets के विरुद्ध cross join queries चलाने की भी अनुमति देगा। इस सुविधा को सक्षम करने से आपके CloudTrail डेटा को दोहराने या स्थानांतरित करने की आवश्यकता भी समाप्त हो जाएगी क्योंकि यह LakeFormation का उपयोग करके आपके event data store के लिए एक federate link प्रदान करता है। इस सुविधा के साथ आप LakeFormation का उपयोग करके data filters बना सकते हैं और अपने event data store के भीतर अपने डेटा के subset को अपने संगठन के भीतर अन्य खातों के साथ साझा कर सकते हैं। अधिक जानकारी के लिए कृपया ब्लॉग देखें: [Securely share AWS CloudTrail Lake logs across accounts without replicating data](https://aws.amazon.com/blogs/mt/securely-share-aws-cloudtrail-lake-logs-across-accounts-without-replicating-data/)

### Resource based policies कॉन्फ़िगर करें
आप अन्य IAM principals को अनुमतियाँ प्रदान करने के लिए resource based policies कॉन्फ़िगर कर सकते हैं। यह आपको CloudTrail डेटा क्वेरी करने के लिए अन्य सदस्य खातों के साथ अपना EDS साझा करने की अनुमति देगा। यह अन्य खातों में events को दोहराने या कॉपी करने की आवश्यकता से बचने में मदद कर सकता है क्योंकि आप विशिष्ट IAM principals को event data store क्वेरी करने की पहुँच प्रदान कर सकते हैं।

### अपने event data store के लिए Tags कॉन्फ़िगर करें
अपने event data store में tags जोड़ने से आप अपने CloudTrail Lake event data के लिए query और ingestion लागतों को ट्रैक कर सकते हैं यदि आप इन tags को user defined cost allocation tags के रूप में जोड़ते हैं। आपके event data store के लिए tags का एक अन्य उपयोग case resource based IAM policy जोड़ने के लिए होगा जो परिभाषित करता है कि कौन event data store को प्रबंधित या क्वेरी कर सकता है।

### अपने event data store के लिए data events अंतर्ग्रहित करें
Data events संसाधन पर या संसाधन में किए गए resource operations में दृश्यता प्रदान करते हैं। CloudTrail data events विभिन्न resource types का समर्थन करते हैं, समर्थित resource types की पूर्ण सूची के लिए, कृपया doc [CloudTrail data events](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/logging-data-events-with-cloudtrail.html#logging-data-events) देखें। ये events data plane operations के रूप में भी जाने जाते हैं। Data events अक्सर उच्च-मात्रा वाली गतिविधियाँ होती हैं, विशेष रूप से यदि आप S3 पर संवेदनशील डेटा संग्रहीत कर रहे हैं या Lambda functions के माध्यम से प्रमुख व्यावसायिक संचालन हो रहे हैं। संवेदनशील डेटा तक किसी भी अप्रत्याशित पहुँच में दृश्यता आपको अपने डेटा की सुरक्षा के लिए सुधारात्मक कार्रवाई करने देती है। क्योंकि कुछ अनुपालन रिपोर्ट (उदाहरण के लिए, FedRAMP और PCI-DSS) के लिए data events चालू करना आवश्यक है, AWS अनुशंसा करता है कि आप AWS Config managed rules या उपयुक्त Conformance Pack Sample Templates का उपयोग करके यह जाँचें कि कम से कम एक trail सभी S3 buckets के लिए S3 data events लॉग कर रहा है।

### ऐतिहासिक CloudTrail Trail events आयात करें
CloudTrail Trails से CloudTrail Lake में माइग्रेट करते समय, event data store बनने से पहले रिकॉर्ड किए गए मौजूदा trail events को अपने CloudTrail Lake event data store में कॉपी करने के लिए Copy Trail event सुविधा का उपयोग करें। यह आपको Amazon Simple Storage Service (Amazon S3) buckets से events आयात करने की अनुमति देगा जो CloudTrail trail से CloudTrail Lake EDS में संबंधित हैं। हालांकि, इस सुविधा का उपयोग करते समय एक import date range निर्दिष्ट करने की अनुशंसा की जाती है, ताकि आप केवल Lake में दीर्घकालिक स्टोरेज और विश्लेषण के लिए आवश्यक logs का subset ही आयात करें। यह निर्दिष्ट date range के बाहर logs के आयात से संबंधित अतिरिक्त लागतों को रोकने में मदद करेगा।

![CloudTrail Lake Copy trail events](/img/cloudops/guides/cloudtrail-lake/copy-trail-eds.png "CloudTrail Lake Copy trail events")

### Event data stores में अंतर्ग्रहित CloudTrail events के लिए Enhanced filtering विकल्प
Enhanced event filtering क्षमताएँ आपको इस पर अधिक नियंत्रण देती हैं कि कौन से CloudTrail events आपके event data stores में अंतर्ग्रहित होते हैं। ये enhanced filtering विकल्प आपके AWS activity data पर कड़ा नियंत्रण प्रदान करते हैं, सुरक्षा, अनुपालन और परिचालन जाँच की दक्षता और सटीकता में सुधार करते हैं। इसके अतिरिक्त, नए filtering विकल्प आपके CloudTrail Lake event data stores में केवल सबसे प्रासंगिक event data अंतर्ग्रहित करके आपकी विश्लेषण कार्यप्रवाह लागतों को कम करने में मदद करते हैं।

आप Advanced Event Collection का उपयोग करके management events को फ़िल्टर कर सकते हैं और eventSource, eventType, eventName, userIdentity.arn, और sessionCredentialFromConsole जैसे attributes के आधार पर events को शामिल या बहिष्कृत करने के लिए फ़िल्टर कर सकते हैं।

जब आप data events का उपयोग करते हैं, तो हम advanced event selectors का उपयोग करने की अनुशंसा करते हैं जो आपके event data stores में कौन से CloudTrail events अंतर्ग्रहित होते हैं इस पर अधिक नियंत्रण प्रदान करते हैं। Advanced event selectors के साथ, आप EventSource, EventName, userIdentity.arn, और ResourceARN जैसे fields पर values शामिल या बहिष्कृत कर सकते हैं। Advanced event selectors आंशिक strings पर pattern matching के साथ values शामिल या बहिष्कृत करने का भी समर्थन करते हैं।

CloudTrail के लिए enhanced filters का उपयोग लागत कम करते हुए आपकी सुरक्षा, अनुपालन और परिचालन जाँच की दक्षता और सटीकता बढ़ाने में मदद करेगा। उदाहरण के लिए, आप विशिष्ट IAM roles या उपयोगकर्ताओं द्वारा उत्पन्न events को बहिष्कृत करने के लिए userIdentity.arn attribute के आधार पर CloudTrail events फ़िल्टर कर सकते हैं। आप निगरानी उद्देश्यों के लिए बारंबार API calls करने वाली एक समर्पित IAM role को बहिष्कृत कर सकते हैं। यह आपको CloudTrail Lake में अंतर्ग्रहित CloudTrail events की मात्रा को काफी कम करने की अनुमति देता है, प्रासंगिक उपयोगकर्ता और सिस्टम गतिविधियों में दृश्यता बनाए रखते हुए लागत कम करता है।

![CloudTrail Lake Data Events](/img/cloudops/guides/cloudtrail-lake/cloudtrail-data-events-advanced-selector.png "Data Events के लिए Advanced Event Selectors")

### SQL Queries
SQL queries चलाते समय, हम अनुशंसा करते हैं कि आप queries में शुरुआती और समाप्ति eventTime time stamps जोड़कर queries को सीमित करें। यह queries के लिए data स्कैन होने पर लागत को कम करने में मदद करेगा। आप where clause में eventtime field जोड़कर, उस time range के साथ खोजी जाने वाली time range जोड़कर ऐसा कर सकते हैं। eventTime > के बाद निर्दिष्ट date string सबसे पहला event timestamp है जो शामिल किया जाएगा, जबकि eventTime < के बाद निर्दिष्ट date string नवीनतम event timestamp है जो शामिल किया जाएगा। निम्नलिखित query eventtime field के उपयोग को दर्शाने वाला एक नमूना है।

```sql
SELECT eventTime, useridentity.arn, awsRegion FROM $EDS_ID WHERE eventTime > '2024-07-20 00:00:00' AND eventTime < '2024-07-23 00:00:00' AND awsRegion in ('us-east-1') AND eventName = 'ConsoleLogin'
```

### Natural language prompts
अपने activity logs (management और data events) का विश्लेषण शुरू करने में मदद करने के लिए Natural Language query processor का उपयोग करें जो CloudTrail Lake में संग्रहीत हैं बिना SQL query लिखे या अपने activity events को क्वेरी करने के लिए आवश्यक SQL syntax को समझने में समय बिताए। NLQ आपको यह पूछकर आपके डेटा में तेज़ अंतर्दृष्टि प्राप्त करने में भी सहायक हो सकता है कि आप क्या क्वेरी करना चाहते हैं और फिर यह उपयोग करने के लिए SQL query प्रदान करता है।

### CloudTrail query results integrity validation
CloudTrail Lake query results integrity validation आपको बताता है कि query results संशोधित, हटाए या बदले गए थे जब results निर्यात किए गए थे। Query results को मान्य करके, आप यह सत्यापित कर सकते हैं कि CloudTrail द्वारा वितरित निर्यातित results फ़ाइल में कोई परिवर्तन नहीं किया गया। Results को मान्य करने के लिए, आप signed फ़ाइल में hash value के साथ प्रत्येक query result फ़ाइल के hash value को सत्यापित करने के लिए **verify-query-results** AWS cli कमांड का उपयोग कर सकते हैं।

### CloudTrail Lake उपयोग की निगरानी के लिए CloudWatch alerts सेट करें
आप CloudTrail Lake के लिए समर्थित CloudWatch metrics पर alarms और notification बना सकते हैं ताकि एक अवधि में अपने event data store उपयोग को ट्रैक करने में मदद मिल सके। फिर आप alerts सेट कर सकते हैं जो आपको सूचित करें जब यह एक निश्चित threshold पार कर गया हो। CloudWatch के साथ आप HourlyDataIngested, TotalDataRetained, TotalStorageBytes और TotalPaidStorageBytes जैसे metrics की निगरानी कर सकते हैं ताकि CloudTrail Lake के लिए आपके समग्र data usage में और दृश्यता प्राप्त करने में मदद मिल सके। उदाहरण के लिए, आप CloudTrail Lake Event Data Store Size दिखाने वाला एक CloudWatch Dashboard बना सकते हैं।

```sql
SORT(SEARCH('{AWS/CloudTrail,"Event data store ID","Lake Metrics"} MetricName="TotalPaidStorageBytes" NOT "Lake Metrics"="IngestionMetrics"',"Sum"),SUM, DESC)
```
![CloudTrail Lake Event Data Store Size](/img/cloudops/guides/cloudtrail-lake/cloudtrail-lake-storage-size.png "CloudTrail Lake Event Data Store Size")

### CloudTrail Lake Dashboards
हम CloudTrail Lake में आपके event data stores में संग्रहीत data के event trends को visualize करने के लिए CloudTrail Lake dashboards सक्षम करने की अनुशंसा करते हैं। Highlights dashboard CloudTrail Lake में कैप्चर किए गए data का एक समग्र आसानी-से-देखने-योग्य सारांश प्रदान करेगा। यह आपके event data store के भीतर महत्वपूर्ण अंतर्दृष्टि को जल्दी से पहचानने और समझने के लिए एक dashboard प्रदान करेगा, जैसे शीर्ष विफल API calls, विफल login attempts में trends, और resource creation में spikes। CloudTrail Lake dashboards AWS सेवा के लिए विशिष्ट अन्य managed dashboards भी प्रदान करते हैं जो इस सेवा के आसपास और अंतर्दृष्टि प्रदान करेंगे। आप अपने स्वयं के widgets या किसी भी managed dashboards से विशिष्ट widgets दिखाने वाला एक custom dashboard भी बना सकते हैं।
