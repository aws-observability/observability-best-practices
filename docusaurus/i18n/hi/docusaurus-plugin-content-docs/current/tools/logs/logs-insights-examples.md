# CloudWatch Logs Insights उदाहरण क्वेरी

[CloudWatch Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html) CloudWatch लॉग डेटा का विश्लेषण और क्वेरी करने के लिए एक शक्तिशाली प्लेटफ़ॉर्म प्रदान करता है। यह आपको कुछ सरल लेकिन शक्तिशाली कमांड के साथ SQL जैसी क्वेरी भाषा का उपयोग करके अपने लॉग डेटा को इंटरैक्टिव रूप से खोजने की अनुमति देता है।

CloudWatch Logs Insights निम्नलिखित श्रेणियों के लिए बिल्ट-इन उदाहरण क्वेरी प्रदान करता है:

- Lambda
- VPC Flow Logs
- CloudTrail
- सामान्य क्वेरी
- Route 53
- AWS AppSync
- NAT Gateway

बेस्ट प्रैक्टिस गाइड के इस अनुभाग में हम कुछ अन्य प्रकार के लॉग के लिए उदाहरण क्वेरी प्रदान करते हैं जो वर्तमान में बिल्ट-इन उदाहरणों में शामिल नहीं हैं। यह सूची समय के साथ विकसित और बदलेगी और आप GitHub पर एक [issue](https://github.com/aws-observability/observability-best-practices/issues) छोड़कर समीक्षा के लिए अपने स्वयं के उदाहरण सबमिट कर सकते हैं।

## API Gateway

### HTTP मेथड टाइप वाले अंतिम 20 मैसेज

```
filter @message like /$METHOD/ 
| fields @timestamp, @message
| sort @timestamp desc
| limit 20
```

यह क्वेरी एक विशिष्ट HTTP मेथड वाले अंतिम 20 लॉग मैसेज अवरोही टाइमस्टैम्प क्रम में लौटाएगी। **METHOD** को उस मेथड से बदलें जिसके लिए आप क्वेरी कर रहे हैं। इस क्वेरी का उपयोग कैसे करें इसका एक उदाहरण यहां है:

```
filter @message like /POST/ 
| fields @timestamp, @message
| sort @timestamp desc
| limit 20
```

:::tip
    विभिन्न संख्या में मैसेज लौटाने के लिए आप $limit मान बदल सकते हैं।
:::

### IP द्वारा सॉर्ट किए गए शीर्ष 20 टॉकर

```
fields @timestamp, @message
| stats count() by ip
| sort ip asc
| limit 20
```

यह क्वेरी IP द्वारा सॉर्ट किए गए शीर्ष 20 टॉकर लौटाएगी। यह आपके API के विरुद्ध दुर्भावनापूर्ण गतिविधि का पता लगाने के लिए उपयोगी हो सकता है।

अगले कदम के रूप में आप फिर मेथड टाइप के लिए एक अतिरिक्त फ़िल्टर जोड़ सकते हैं। उदाहरण के लिए, यह क्वेरी IP द्वारा शीर्ष टॉकर दिखाएगी लेकिन केवल "PUT" मेथड कॉल:

```
fields @timestamp, @message
| filter @message like /PUT/
| stats count() by ip
| sort ip asc
| limit 20
```

## CloudTrail Logs

### एरर श्रेणी द्वारा समूहीकृत API थ्रॉटलिंग एरर

```
stats count(errorCode) as eventCount by eventSource, eventName, awsRegion, userAgent, errorCode
| filter errorCode = 'ThrottlingException' 
| sort eventCount desc
```

यह क्वेरी आपको श्रेणी द्वारा समूहीकृत और अवरोही क्रम में प्रदर्शित API थ्रॉटलिंग एरर देखने की अनुमति देती है।

:::tip
    इस क्वेरी का उपयोग करने के लिए आपको पहले यह सुनिश्चित करना होगा कि आप [CloudTrail लॉग को CloudWatch में भेज रहे हैं।](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/send-cloudtrail-events-to-cloudwatch-logs.html)
:::
    
### लाइन ग्राफ में Root अकाउंट गतिविधि

```
fields @timestamp, @message, userIdentity.type 
| filter userIdentity.type='Root' 
| stats count() as RootActivity by bin(5m)
```

इस क्वेरी से आप लाइन ग्राफ में root अकाउंट गतिविधि को विज़ुअलाइज़ कर सकते हैं। यह क्वेरी समय के साथ root गतिविधि को एग्रीगेट करती है, प्रत्येक 5-मिनट अंतराल के भीतर root गतिविधि की घटनाओं की गणना करती है।
:::tip
     [लॉग डेटा को ग्राफ में विज़ुअलाइज़ करें](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_Insights-Visualizing-Log-Data.html)
:::

## VPC Flow Logs

### चयनित सोर्स IP एड्रेस के लिए REJECT एक्शन के साथ फ्लो लॉग फ़िल्टर करना

```
fields @timestamp, @message, @logStream, @log  | filter srcAddr like '$SOURCEIP' and action = 'REJECT'
| sort @timestamp desc
| limit 20
```

यह क्वेरी $SOURCEIP से 'REJECT' वाले अंतिम 20 लॉग मैसेज लौटाएगी। इसका उपयोग यह पता लगाने के लिए किया जा सकता है कि ट्रैफिक स्पष्ट रूप से अस्वीकार किया गया है, या समस्या किसी प्रकार की क्लाइंट साइड नेटवर्क कॉन्फ़िगरेशन समस्या है।

:::tip
    सुनिश्चित करें कि आप '$SOURCEIP' को उस IP एड्रेस के मान से बदलें जिसमें आप रुचि रखते हैं
:::

```
fields @timestamp, @message, @logStream, @log  | filter srcAddr like '10.0.0.5' and action = 'REJECT'
| sort @timestamp desc
| limit 20
```

### Availability Zone द्वारा नेटवर्क ट्रैफिक का समूहीकरण

```
stats sum(bytes / 1048576) as Traffic_MB by azId as AZ_ID 
| sort Traffic_MB desc
```

यह क्वेरी Availability Zone (AZ) द्वारा समूहीकृत नेटवर्क ट्रैफिक डेटा प्राप्त करती है। यह बाइट को जोड़कर और उन्हें MB में परिवर्तित करके मेगाबाइट (MB) में कुल ट्रैफिक की गणना करती है। परिणाम फिर प्रत्येक AZ में ट्रैफिक वॉल्यूम के आधार पर अवरोही क्रम में सॉर्ट किए जाते हैं।


### फ्लो दिशा द्वारा नेटवर्क ट्रैफिक का समूहीकरण

```
stats sum(bytes / 1048576) as Traffic_MB by flowDirection as Flow_Direction 
| sort by Bytes_MB desc
```

यह क्वेरी फ्लो दिशा द्वारा समूहीकृत नेटवर्क ट्रैफिक का विश्लेषण करने के लिए डिज़ाइन की गई है। (Ingress या Egress)


### सोर्स और डेस्टिनेशन IP एड्रेस द्वारा शीर्ष 10 डेटा ट्रांसफर

```
stats sum(bytes / 1048576) as Data_Transferred_MB by srcAddr as Source_IP, dstAddr as Destination_IP 
| sort Data_Transferred_MB desc 
| limit 10
```

यह क्वेरी सोर्स और डेस्टिनेशन IP एड्रेस द्वारा शीर्ष 10 डेटा ट्रांसफर प्राप्त करती है। यह क्वेरी विशिष्ट सोर्स और डेस्टिनेशन IP एड्रेस के बीच सबसे महत्वपूर्ण डेटा ट्रांसफर की पहचान करने की अनुमति देती है।

## Amazon SNS Logs

### कारणों के अनुसार SMS मैसेज विफलताओं की गणना

```
filter status = "FAILURE"
| stats count(*) by delivery.providerResponse as FailureReason
| sort delivery.providerResponse desc
```

ऊपर की क्वेरी अवरोही क्रम में कारण द्वारा सॉर्ट की गई डिलीवरी विफलताओं की गणना सूचीबद्ध करती है। इस क्वेरी का उपयोग डिलीवरी विफलता के कारणों को खोजने के लिए किया जा सकता है।

### अमान्य फोन नंबर के कारण SMS मैसेज विफलताएं

```
fields notification.messageId as MessageId, delivery.destination as PhoneNumber
| filter status = "FAILURE" and delivery.providerResponse = "Invalid phone number"
| limit 100
```

यह क्वेरी उन मैसेज को लौटाती है जो अमान्य फोन नंबर के कारण डिलीवर करने में विफल रहे। इसका उपयोग उन फोन नंबरों की पहचान करने के लिए किया जा सकता है जिन्हें ठीक करने की आवश्यकता है।

### SMS टाइप द्वारा मैसेज विफलता सांख्यिकी

```
fields delivery.smsType
| filter status = "FAILURE"
| stats count(notification.messageId), avg(delivery.dwellTimeMs), sum(delivery.priceInUSD) by delivery.smsType
```

यह क्वेरी प्रत्येक SMS टाइप (Transactional या Promotional) के लिए गणना, औसत ड्वेल टाइम और खर्च लौटाती है। इस क्वेरी का उपयोग सुधारात्मक कार्रवाइयों को ट्रिगर करने के लिए थ्रेशोल्ड स्थापित करने के लिए किया जा सकता है। क्वेरी को केवल कुछ SMS टाइप को फ़िल्टर करने के लिए संशोधित किया जा सकता है, यदि केवल उस SMS टाइप को सुधारात्मक कार्रवाई की आवश्यकता है।

### SNS विफलता नोटिफिकेशन सांख्यिकी

```
fields @MessageID 
| filter status = "FAILURE"
| stats count(delivery.deliveryId) as FailedDeliveryCount, avg(delivery.dwellTimeMs) as AvgDwellTime, max(delivery.dwellTimeMs) as MaxDwellTime by notification.messageId as MessageID
| limit 100
```

यह क्वेरी प्रत्येक विफल मैसेज के लिए गणना, औसत ड्वेल टाइम और खर्च लौटाती है। इस क्वेरी का उपयोग सुधारात्मक कार्रवाइयों को ट्रिगर करने के लिए थ्रेशोल्ड स्थापित करने के लिए किया जा सकता है।



