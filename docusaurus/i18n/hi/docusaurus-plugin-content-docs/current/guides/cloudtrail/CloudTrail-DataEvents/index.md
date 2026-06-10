---
sidebar_position: 4
---
# CloudTrail Data Events

AWS CloudTrail सर्वोत्तम प्रथाओं के अनुसार, आपको सुरक्षा-संवेदनशील वर्कलोड के लिए मल्टी-रीजन ट्रेल स्तर पर data events रिकॉर्ड करने चाहिए। गहन अनुपालन आवश्यकताओं वाले वर्कलोड के लिए, हम अनुशंसा करते हैं कि आप रिसोर्स लेवल एक्टिविटी का ऑडिट करने के लिए data events सक्षम करें। Data events को लॉग करने से डेटा स्तर पर ऑडिट करने की क्षमता मिलती है, जिसमें उस रिसोर्स के अंदर के परिवर्तन भी शामिल हैं जिसकी आप विजिबिलिटी सक्षम कर रहे हैं।

CloudTrail अतिरिक्त observability प्रदान करके मदद करता है और विभिन्न प्रकार की सेवाओं के लिए data events को सपोर्ट करता है। इन data events का उपयोग आपके महत्वपूर्ण अनुपालन, जोखिम और सुरक्षा उद्देश्यों को पूरा करने में मदद के लिए किया जा सकता है। इस प्रकार के events के कुछ उदाहरणों में ऑब्जेक्ट-लेवल API एक्टिविटीज जैसे delete, update, और put items शामिल हैं। CloudTrail data events द्वारा प्रदान की गई बढ़ी हुई विजिबिलिटी के उदाहरणों में Amazon Bedrock में agent alias या knowledge base पर API एक्टिविटी, Amazon Q Business में एप्लिकेशन या डेटा सोर्स पर एक्टिविटी, या Sagemaker की feature store पर API एक्टिविटी शामिल है। ये प्रमुख जोखिम प्रबंधन लाभ प्रदान करते हैं जैसे:

* व्यक्तिगत डेटा और संवेदनशील जानकारी तक पहुँच की निगरानी
* व्यक्तिगत डेटा और संवेदनशील डेटा में संशोधनों की विजिबिलिटी
* व्यक्तिगत डेटा और संवेदनशील जानकारी को संभालने वाले एप्लिकेशन में गतिविधियों का ऑडिट
* संभावित डेटा उल्लंघनों और प्राइवेसी इंसिडेंट्स का पता लगाना
* प्राइवेसी ऑडिट और अनुपालन रिपोर्टिंग को सुगम बनाना

### Data Events के लिए Advanced Event Selectors
जब आप data events का उपयोग करते हैं, तो advanced event selectors आपको अधिक नियंत्रण प्रदान करते हैं कि कौन से CloudTrail events आपके event data stores में इंजेस्ट किए जाएँ। Advanced event selectors के साथ, आप EventSource, EventName, userIdentity.arn, और ResourceARN जैसे फ़ील्ड्स पर values को शामिल या बाहर कर सकते हैं। Advanced event selectors आंशिक स्ट्रिंग्स पर पैटर्न मैचिंग के साथ values को शामिल या बाहर करने का भी समर्थन करते हैं। यह लागत कम करने में मदद करते हुए आपकी सुरक्षा, अनुपालन और परिचालन जाँच की दक्षता और सटीकता बढ़ाता है। उदाहरण के लिए, आप userIdentity.arn एट्रिब्यूट के आधार पर CloudTrail events फ़िल्टर कर सकते हैं ताकि विशिष्ट IAM roles या users द्वारा जनरेट किए गए events को बाहर किया जा सके। आप मॉनिटरिंग उद्देश्यों के लिए बार-बार API कॉल करने वाली सेवा द्वारा उपयोग किए जाने वाले एक समर्पित IAM role को बाहर कर सकते हैं। यह आपको CloudTrail Lake में इंजेस्ट किए जाने वाले CloudTrail events की मात्रा को काफी कम करने की अनुमति देता है, जिससे प्रासंगिक उपयोगकर्ता और सिस्टम गतिविधियों में विजिबिलिटी बनाए रखते हुए लागत कम होती है।

![CloudTrail Lake Data Events](/img/cloudops/guides/cloudtrail-lake/cloudtrail-data-events-advanced-selector.png "Advanced Event Selectors for Data Events")

### **वर्कलोड विशिष्ट**

निम्नलिखित अनुभाग ट्रेल्स और event data stores के लिए उपलब्ध रिसोर्स प्रकारों का उपयोग करके विशिष्ट वर्कलोड की निगरानी और ऑडिटिंग पर कुछ सर्वोत्तम प्रथाएँ प्रदान करेंगे। उदाहरण के लिए, Amazon S3 के लिए data events लॉग करते समय आप `PutObject` API ऑपरेशंस कैप्चर करना चाहेंगे ताकि Amazon S3 ऑब्जेक्ट्स पर किए जा रहे सभी रिसोर्स लेवल ऑपरेशंस रिकॉर्ड हो सकें। यह Amazon S3 ऑब्जेक्ट्स के लिए रिसोर्स स्तर पर किए गए कार्यों पर विजिबिलिटी प्रदान करेगा।

### **Amazon SNS और Amazon SQS**

Amazon SNS सुरक्षा सर्वोत्तम प्रथाओं और Amazon SQS सुरक्षा सर्वोत्तम प्रथाओं के अनुसार, यह Amazon SNS और Amazon SQS तक पहुँचने के लिए VPC endpoints का उपयोग करने पर विचार करने की सिफारिश करता है। उदाहरण के लिए, यदि आपके पास Amazon SNS topics या Amazon SQS queues हैं जिनके साथ आपको इंटरैक्ट करने में सक्षम होना चाहिए, लेकिन जिन्हें इंटरनेट पर बिल्कुल एक्सपोज नहीं किया जाना चाहिए, तो VPC endpoints का उपयोग करके एक्सेस को केवल एक विशेष VPC के भीतर होस्ट्स तक सीमित किया जा सकता है ताकि Amazon SNS topic या Amazon SQS queue पर मैसेज पब्लिश या सेंड किया जा सके।

CloudTrail में Amazon SNS के लिए data events सक्षम करने से आप अपने सभी Amazon SNS topics के लिए `Publish` और `PublishBatch` API actions का ऑडिट कर पाएँगे। इसी तरह, [Amazon SQS के लिए data events](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-logging-using-cloudtrail.html#sqs-data-events-in-cloud-trail) यह सुनिश्चित करते हैं कि `SendMessage` API action ऑडिट करेगा कि आपके VPC के भीतर इंस्टेंसेस से Amazon SQS queues में मैसेज भेजते समय VPC Endpoints का उपयोग किया जा रहा है, बिना इंटरनेट को पार किए।

नीचे दी गई क्वेरी Amazon SNS से [Publish](https://docs.aws.amazon.com/sns/latest/api/API_Publish.html) events के लिए API actions दिखाएगी, जो इंगित करती है कि मैसेज Amazon SNS topic पर पब्लिश किए जा रहे थे। परिणाम यह भी दिखाएँगे कि कौन सी [IAM](https://aws.amazon.com/iam/) एंटिटी ने यह एक्शन लिया और विशिष्ट VPC endpoint ID जहाँ मैसेज भेजा गया। हालाँकि, यदि कोई VPC endpoint ID नहीं है तो Publish API कॉल VPC Endpoint का उपयोग किए बिना किया गया था।

#### SQL Query:

```
SELECT eventTime,
    substr(userIdentity.arn, strpos(userIdentity.arn, '/') +1) as IAM, 
    recipientAccountId, 
    awsRegion, 
    eventName,sourceIPAddress, 
    substr(element_At(requestParameters, 'topicArn'), 
    strpos(element_At(requestParameters, 'topicArn'), '.com/') +18) as Topic, 
    vpcEndpointId
FROM $EDS_ID
    WHERE eventSource = 'sns.amazonaws.com'
    AND eventName = 'Publish'
    AND eventtime >= '2024-06-24 00:00:00'
    AND eventtime <= '2024-06-24 23:59:59'
```

जैसा कि Amazon SNS क्वेरी के लिए दिखाया गया था, नीचे दी गई क्वेरी Amazon SQS से [SendMessage](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/APIReference/API_SendMessage.html) events के लिए API actions दिखाएगी, जो इंगित करती है कि मैसेज एक विशिष्ट Amazon SQS queue को भेजे जा रहे थे। ये परिणाम यह भी दिखाएँगे कि कौन सी [IAM](https://aws.amazon.com/iam/) एंटिटी ने एक्शन लिया और विशिष्ट VPC endpoint ID जहाँ मैसेज भेजा गया।

#### SQL Query:

```
SELECT eventTime, 
    substr(userIdentity.arn, strpos(userIdentity.arn, '/') +1) as IAM, 
    recipientAccountId, 
    awsRegion, 
    eventName,sourceIPAddress, 
    substr(element_At(requestParameters, 'queueUrl'), 
    strpos(element_At(requestParameters, 'queueUrl'), '.com/') +18) as Queue, 
    vpcEndpointId
FROM $EDS_ID
WHERE eventSource = 'sqs.amazonaws.com'
    AND eventName = 'SendMessage'
    AND eventtime >= '2024-06-24 00:00:00'
    AND eventtime <= '2024-06-24 23:59:59'
```

### Amazon Q for Business

Amazon Q for Business वर्कलोड के लिए आप **AWS::QBusiness::Application** और **AWS::S3::Object** के लिए data events कॉन्फ़िगर कर सकते हैं। **AWS::QBusiness::Application** हमारे Amazon Q Business एप्लिकेशन से संबंधित data plane गतिविधियों को लॉग करता है और **AWS::S3::Object** सोर्स Amazon S3 बकेट के लिए data events रिकॉर्ड करता है। एक बार data events आपके ट्रेल या event data store के लिए कॉन्फ़िगर हो जाने के बाद, Amazon Q Business और Amazon S3 के लिए events जनरेट होना शुरू हो जाएँगे।

नीचे दी गई क्वेरी [BatchDeleteDocument](https://docs.aws.amazon.com/amazonq/latest/api-reference/API_BatchDeleteDocument.html) के API कॉल्स दिखाएगी जो एक या अधिक डॉक्यूमेंट्स के डिलीशन को इंगित करती है जो हमारे Amazon Q Business Application में उपयोग किए गए थे।

#### SQL Query:

```
SELECT
    eventName, COUNT(*) AS numberOfCallsFROM
<event-data-store-ID>
WHERE
    eventSource='qbusiness.amazonaws.com' AND eventTime > date_add('day', -1, now())
Group
BY eventName ORDER BY COUNT(*) DESC
```

नीचे दी गई क्वेरी BatchDeleteDocument API कॉल से संबद्ध IAM आइडेंटिटी खोजने में मदद करेगी।

#### SQL Query:

```
SELECT
 sourceIPAddress, eventTime, userIdentity.principalid
 FROM
 <event-data-store-ID>
 WHERE
 eventName='BatchDeleteDocument' AND eventTime > date_add('day', -1, now())
```

नीचे दी गई क्वेरी दिखाती है कि किस job ने StartDataSourceSyncJob API कॉल को देखकर S3 data source को Amazon Q Business Applications के साथ सिंक्रोनाइज़ेशन ट्रिगर किया।

#### SQL Query:

```
SELECT
 sourceIPAddress, eventTime, userIdentity.arn AS user
 FROM
 <event-data-store-ID>
 WHERE
 eventName='StartDataSourceSyncJob' AND eventTime > date_add('day', -1, now())
```

निम्नलिखित क्वेरी दिखाएगी कि क्या हमारे Q business एप्लिकेशन से डेटा सोर्स के रूप में जुड़ी S3 बकेट से कोई ऑब्जेक्ट्स डिलीट किए गए, DeleteObject API event की जाँच करके:

#### SQL Query:

```
SELECT
 sourceIPAddress, eventTime, userIdentity.arn AS user
 FROM
 <event-data-store-ID>
 WHERE
 userIdentity.arn IS NOT NULL AND eventName='DeleteObject'
 AND element_at(requestParameters, 'bucketName') like '<enter-S3-bucket-name>'
 AND eventTime > '[2024-05-09 00](tel:2024050900):00:00'
```

### Amazon Q Developer

Amazon Q Developer के लिए data events का उपयोग करके आप जिन events को ट्रैक कर सकते हैं उनमें से एक है **'StartCodeAnalysis'**, जो VS Code और JetBrains IDEs के लिए Amazon Q Developer द्वारा किए गए सिक्योरिटी स्कैन को ट्रैक करता है।

नीचे दी गई क्वेरी में हम उन सभी उपयोगकर्ताओं की सूची प्राप्त करेंगे जिन्होंने सिक्योरिटी स्कैन शुरू किया। यह पहचानने में मदद करेगा कि कौन से उपयोगकर्ता आपके संगठन में कोड का विश्लेषण करने के लिए Amazon Q Developer का उपयोग करते हैं और उनके अनुरोधों का स्रोत निर्धारित करते हैं।

```
SELECT
userIdentity.onbehalfof.userid, eventTime, SourceIPAddress
FROM
    <event-data-store-ID>
WHERE
    eventName = 'StartCodeAnalysis'
```

### Amazon Bedrock

Amazon Bedrock के लिए CloudTrail data events 'AWS::Bedrock::AgentAlias' और 'AWS::Bedrock::KnowledgeBase' रिसोर्स टाइप actions के माध्यम से Agents for Bedrock और Amazon Bedrock knowledge bases के लिए API events ट्रैक करते हैं।

उदाहरण के लिए, यदि एक चैट एप्लिकेशन का एडमिनिस्ट्रेटर Bedrock agents के इनवोकेशन से संबंधित events का ऑडिट करना चाहता है, तो वे निम्नलिखित क्वेरी का उपयोग कर सकते हैं, जो इनवोक किए गए agent alias के साथ भेजे गए [request](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_agent-runtime_InvokeAgent.html#API_agent-runtime_InvokeAgent_RequestSyntax) और [response](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_agent-runtime_InvokeAgent.html#API_agent-runtime_InvokeAgent_ResponseSyntax) पैरामीटर्स पर विवरण निर्धारित करने में मदद करेगी।

```
SELECT
UserIdentity,eventTime,eventName,UserAgent,requestParameters,resourcesFROM
<event-data-store-ID>
WHERE
    eventName = 'InvokeAgent'
```

इसके अतिरिक्त, नीचे दी गई क्वेरी इनवोक की गई knowledge base पर विवरण प्रदान करेगी, साथ ही रिटर्न किए गए request और response पैरामीटर्स:

```
SELECT
UserIdentity,eventTime,eventName,UserAgent,requestParameters,resourcesFROM
<event-data-store-ID>
WHERE
    eventName = 'RetrieveAndGenerate'
```
