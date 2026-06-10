---
sidebar_position: 4
---

# डैशबोर्ड और अलर्ट

एक बार जब आपकी टेलीमेट्री प्रवाहित हो रही हो, तो आप अपने उपयोग के मामले से संबंधित डैशबोर्ड और अलर्ट सेट कर सकते हैं।

## क्यूरेटेड डैशबोर्ड

क्यूरेटेड डैशबोर्ड का लाभ उठाना सुनिश्चित करें जो आप CloudWatch कंसोल के विभिन्न भागों में पा सकते हैं।

उदाहरण के लिए, आपको Dashboards के अंतर्गत कई सेवाओं (जैसे Lambda, EC2, API Gateway, और कई अन्य) के लिए स्वचालित डैशबोर्ड मिलेंगे।

यदि आप Application Signals का लाभ उठा रहे हैं, तो आपको Application Signals (APM) के अंतर्गत एप्लिकेशन मैप और डैशबोर्ड मिलेंगे। इसके अतिरिक्त, आपको uninstrumented services मिलेंगी जो observability में किसी भी gap को उजागर करेंगी।

## कस्टम डैशबोर्ड

आपको अपने स्वयं के व्यवसाय-विशिष्ट डैशबोर्ड भी डिज़ाइन करने होंगे। परिचालन उत्कृष्टता के लिए अपने डैशबोर्ड कैसे डिज़ाइन करें, इस बारे में इस गाइड को देखें: [Building Dashboards for Operational Visibility](https://aws.amazon.com/builders-library/building-dashboards-for-operational-visibility/)

## CloudWatch Alarms

आप अपनी सेवाओं और इंफ्रास्ट्रक्चर में किसी भी समस्या को सिग्नल करने के लिए अलर्ट (या CloudWatch में Alarms) भी बनाएंगे। आप केंद्रीकृत alarm दृश्यता के लिए अपने मॉनिटरिंग अकाउंट में alarms बना सकते हैं या/और स्थानीय अकाउंट में अलग-अलग alarms बना सकते हैं।

### Alarm अनुशंसाएं

यदि आप अनिश्चित हैं कि कैसे शुरू करें, तो Alarm Recommendations आपकी मदद करेंगी। Alarm recommendations मॉनिटरिंग सर्वोत्तम प्रथाओं पर आधारित हैं। Alarm बनाने से पहले अनुशंसित alarm कॉन्फ़िगरेशन की समीक्षा करें।

अधिक विवरण के लिए, [AWS सेवाओं के लिए Alarm अनुशंसाएं](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html) देखें।

## Service Level Objectives (SLOs)

आप महत्वपूर्ण KPIs को ट्रैक करने में मदद के लिए SLOs और संबंधित alarms भी बना सकते हैं।

अधिक जानकारी के लिए, [CloudWatch SLOs](../../tools/slos.md) देखें।

## सारांश

यह CloudWatch पर शुरुआत करने की गाइड को पूरा करता है। यहां हमने जो चरण कवर किए वे हैं:

1. **मॉनिटरिंग और सोर्स अकाउंट सेटअप** - कई AWS अकाउंट और regions से टेलीमेट्री डेटा को केंद्रीकृत करने के लिए cross-account observability कॉन्फ़िगर किया
2. **Unified Data Store सेटअप** - एकीकृत क्वेरीइंग और विश्लेषण के लिए एक ही अकाउंट और region में लॉग डेटा केंद्रीकृत किया
3. **एजेंट/Collectors कॉन्फ़िगर करें** - अपने अनुप्रयोगों और इंफ्रास्ट्रक्चर से टेलीमेट्री भेजने के लिए CloudWatch agents और/या OpenTelemetry collectors डिप्लॉय किए
4. **डैशबोर्ड और अलर्ट** - दृश्यता के लिए डैशबोर्ड और अपनी सेवाओं के स्वास्थ्य की निगरानी के लिए alarms बनाए

## अगले कदम

विशिष्ट विषयों पर अधिक गहन मार्गदर्शन के लिए, इस सर्वोत्तम प्रथाओं की गाइड के विस्तृत अनुभागों को देखें:

- [कंटेनर (ECS/EKS)](../containers/aws-native/eks/amazon-cloudwatch-container-insights.md)
- [सर्वरलेस](../serverless/aws-native/lambda-based-observability.md)
- [परिचालन गाइड](../operational/observability-driven-dev.md)
- [लागत अनुकूलन](../cost/cost-visualization/cost.md)
- [सिग्नल संग्रह](../signal-collection/emf.md)