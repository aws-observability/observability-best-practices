---
sidebar_position: 3
---

# एजेंट/Collectors कॉन्फ़िगर करें

एक बार जब आपकी मॉनिटरिंग अकाउंट संरचना तैयार हो जाती है, तो आपको अपने अनुप्रयोगों, सेवाओं और अन्य इंफ्रास्ट्रक्चर कंपोनेंट्स को CloudWatch पर टेलीमेट्री भेजने के लिए कॉन्फ़िगर करना होगा।

यह आपके एजेंट और collectors को कॉन्फ़िगर करने के लिए एक उच्च-स्तरीय गाइड है। गहन मार्गदर्शन के लिए, कृपया इस सर्वोत्तम प्रथाओं की गाइड के विभिन्न अनुभागों को देखें।

## Amazon EKS

EKS के लिए, observability कॉन्फ़िगर करने का सबसे सरल तरीका Amazon EKS add-on का उपयोग करना है। यह Amazon EKS के लिए बेहतर observability के साथ Container Insights इंस्टॉल करेगा। Add-on cluster से इंफ्रास्ट्रक्चर मेट्रिक्स भेजने के लिए CloudWatch agent इंस्टॉल करता है, कंटेनर लॉग्स भेजने के लिए Fluent Bit इंस्टॉल करता है, और एप्लिकेशन प्रदर्शन टेलीमेट्री भेजने के लिए CloudWatch Application Signals भी सक्षम करता है। (यदि आप Application Signals, Container Insights, आदि नहीं चाहते तो यह कॉन्फ़िगर किया जा सकता है।)

सामान्यतः, Amazon CloudWatch Observability EKS add-on एक DaemonSet के रूप में इंस्टॉल किया जाता है।

EKS के लिए कुछ विकल्प हैं:

### EKS के लिए CloudWatch Agent

- Amazon CloudWatch Observability EKS add-on
- Amazon CloudWatch Observability Helm Chart

### EKS के लिए OTEL Collector

वैकल्पिक रूप से, यदि आप OTEL collector का उपयोग करना चाहते हैं, तो आप:
- AWS Exporters कॉन्फ़िगर कर सकते हैं
- अपने OTLP exporter को log और traces OTLP endpoints पर पॉइंट कर सकते हैं
- अपनी processing pipelines परिभाषित कर सकते हैं
- अपने एप्लिकेशन को OTEL लाइब्रेरीज़ का उपयोग करके इंस्ट्रूमेंट कर सकते हैं (यदि आवश्यक हो)

## Amazon ECS

ECS के लिए, आप अपने clusters के लिए इंफ्रास्ट्रक्चर मेट्रिक्स एकत्र करने के लिए Container Insights सक्षम कर सकते हैं। आप एप्लिकेशन प्रदर्शन टेलीमेट्री और संबंधित ट्रेसेस एकत्र करने के लिए Application Signals भी डिप्लॉय कर सकते हैं। लॉग्स के लिए, आप अपने लॉग डेटा को CloudWatch पर भेजने के लिए awslogs driver का उपयोग कर सकते हैं, या आप डेटा भेजने के लिए OpenTelemetry collectors का उपयोग कर सकते हैं।

ECS के लिए कुछ विकल्प हैं:

### ECS के लिए CloudWatch Agent

- Container Insights सक्षम करें
- Application Signals डिप्लॉय करें (वैकल्पिक)
- awslogs log driver का उपयोग करें

### ECS के लिए OTEL Collector

वैकल्पिक रूप से, आप:
- एक sidecar के रूप में चला सकते हैं
- AWS Exporters कॉन्फ़िगर कर सकते हैं
- OTLP endpoints सेट कर सकते हैं
- Processing pipelines परिभाषित कर सकते हैं
- अनुप्रयोगों को इंस्ट्रूमेंट कर सकते हैं (यदि आवश्यक हो)

## Amazon EC2 और ऑन-प्रेमिस

CloudWatch agent का उपयोग EC2 इंस्टेंस, अन्य वर्चुअल मशीनों और ऑन-प्रेमिस सर्वरों से CloudWatch पर टेलीमेट्री डेटा भेजने के लिए किया जा सकता है।

### डिप्लॉयमेंट विकल्प

- **EC2 के लिए Workload Detection** - एजेंट को डिप्लॉय करने का एक स्वचालित तरीका प्रदान करता है

![EC2 Workload Detection](../../images/GettingStarted/ec2workloaddetection.png)

- **Systems Manager** - AWS Systems Manager का उपयोग करके एजेंट डिप्लॉय और कॉन्फ़िगर करें
- **कस्टम ऑटोमेशन** - अपने स्वयं के ऑटोमेशन टूल्स का उपयोग करें
- **मैनुअल इंस्टॉलेशन** - विशिष्ट उपयोग मामलों के लिए मैन्युअल रूप से इंस्टॉल करें

आप config फ़ाइल के माध्यम से (स्वचालित या मैन्युअल रूप से) टेलीमेट्री को कॉन्फ़िगर/कस्टमाइज़ कर सकते हैं, और आपकी सेटिंग्स को फ़ाइन-ट्यून करने में मदद करने के लिए एक wizard उपलब्ध है।

### EC2 के लिए OTEL Collector

आप OTEL collector का भी उपयोग कर सकते हैं:

**OTLP Exporters:**

![OTLP कॉन्फ़िगरेशन](../../images/GettingStarted/otlp.png)

ट्रेस और लॉग OTLP endpoints के लिए OTLP exporters का उपयोग करें।

**AWS-विशिष्ट Exporters:**

![ADOT कॉन्फ़िगरेशन](../../images/GettingStarted/adot.png)

AWS-विशिष्ट exporters और processing pipelines का उपयोग करें।

## सारांश

संक्षेप में:
1. अपने कंप्यूट प्लेटफ़ॉर्म (EKS, ECS, EC2) के लिए उपयुक्त agent/collector चुनें
2. स्वचालित विधियों (add-ons, Helm charts, Systems Manager) या मैनुअल इंस्टॉलेशन का उपयोग करके डिप्लॉय करें
3. अपनी आवश्यकताओं के आधार पर टेलीमेट्री संग्रह कॉन्फ़िगर करें
4. वैकल्पिक रूप से वेंडर-न्यूट्रल इंस्ट्रूमेंटेशन के लिए OpenTelemetry का उपयोग करें

विस्तृत कॉन्फ़िगरेशन गाइड के लिए, अपने कंप्यूट प्लेटफ़ॉर्म और observability टूल्स के लिए इस सर्वोत्तम प्रथाओं की गाइड के विशिष्ट अनुभागों को देखें।

## अगले कदम

[डैशबोर्ड और अलर्ट](./dashboards-alerts.md) पर जारी रखें