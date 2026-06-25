# CloudWatch लागत कम करना

## GetMetricData

आमतौर पर `GetMetricData` तृतीय-पक्ष ऑब्ज़र्वेबिलिटी टूल्स और/या cloud financial टूल्स द्वारा अपने platform में CloudWatch Metrics का उपयोग करने से होने वाली calls के कारण होता है। 

- तृतीय-पक्ष टूल जिस आवृत्ति से requests कर रहा है उसे कम करने पर विचार करें। उदाहरण के लिए, आवृत्ति को 1 min से 5 mins तक कम करने से लागत में 1/5 (20%) की कमी होनी चाहिए।
- प्रवृत्ति की पहचान करने के लिए, थोड़े समय के लिए तृतीय-पक्ष टूल्स से किसी भी डेटा संग्रह को बंद करने पर विचार करें।

## CloudWatch Logs 

- इस [knowledge center document][log-article] का उपयोग करके शीर्ष योगदानकर्ताओं को खोजें।
- जब तक आवश्यक न समझा जाए, शीर्ष योगदानकर्ताओं के logging level को कम करें।
- पता करें कि क्या आप CloudWatch के अतिरिक्त logging के लिए तृतीय-पक्ष टूलिंग का उपयोग कर रहे हैं।
- VPC Flow Log की लागत तेज़ी से बढ़ सकती है यदि आपने इसे प्रत्येक VPC पर सक्षम किया है और बहुत अधिक traffic है। यदि आपको अभी भी इसकी आवश्यकता है, तो इसे Amazon S3 में deliver करने पर विचार करें।
- देखें कि क्या सभी AWS Lambda functions पर logging आवश्यक है। यदि नहीं, तो Lambda role में "logs:PutLogEvents" permissions को deny करें।
- CloudTrail logs अक्सर शीर्ष योगदानकर्ता होते हैं। उन्हें Amazon S3 में भेजना और query के लिए Amazon Athena और alarms/notifications के लिए Amazon EventBridge का उपयोग करना सस्ता है।

अधिक विवरण के लिए इस [knowledge center article][article] को देखें।


[article]: https://aws.amazon.com/premiumsupport/knowledge-center/cloudwatch-understand-and-reduce-charges/
[log-article]: https://aws.amazon.com/premiumsupport/knowledge-center/cloudwatch-logs-bill-increase/
