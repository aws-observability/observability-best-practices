# X-Ray ग्राहकों को Application Signals + Transaction Search क्यों अपनाना चाहिए

## Observability आवश्यकताओं का विकास

जैसे-जैसे एप्लिकेशन जटिलता और पैमाने में बढ़े हैं, ग्राहकों की Observability आवश्यकताएं भी काफी बदल गई हैं। जबकि [AWS X-Ray](https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html) एक विश्वसनीय डिस्ट्रिब्यूटेड ट्रेसिंग समाधान के रूप में काम करता रहा है, आधुनिक एप्लिकेशन परिदृश्य में अधिक व्यापक दृश्यता की मांग है।

## तकनीकी आर्किटेक्चर अंतर

**X-Ray पारंपरिक दृष्टिकोण:**

![X-Ray आर्किटेक्चर](/apm-src/assets/images/deep-dive/X-ray.png)

**Application Signals + Transaction Search:**

![Application Signals + Transaction Search आर्किटेक्चर](/apm-src/assets/images/deep-dive/ap%20ts.png)

## प्रमुख माइग्रेशन लाभ

| क्षमता | X-Ray | Application Signals + Transaction Search |
|---|---|---|
| **डेटा इंजेशन** | 100% ट्रांजैक्शन (कॉन्फ़िगर करने पर) | 100% ट्रांजैक्शन (कॉन्फ़िगर करने पर) |
| **थ्रूपुट सीमाएं** | उच्च वॉल्यूम पर X-Ray सर्विस कोटा के अधीन | CloudWatch Logs के साथ उच्च थ्रूपुट क्षमता |
| **लागत मॉडल** | प्रति-ट्रेस मूल्य निर्धारण (100% पर महंगा) | Application Signals बंडल्ड मूल्य निर्धारण |
| **स्टोरेज फॉर्मेट** | X-Ray प्रोप्राइटरी फॉर्मेट | OpenTelemetry मानक फॉर्मेट |
| **स्टोरेज बैकएंड** | X-Ray ऑप्टिमाइज़्ड स्टोरेज | चयनात्मक इंडेक्सिंग के साथ CloudWatch Logs |
| **एनालिटिक्स** | केवल X-Ray कंसोल | Transaction Search + X-Ray ट्रेस एनालिटिक्स |
| **क्वेरी क्षमताएं** | X-Ray कंसोल और APIs | Transaction Search विज़ुअल एनालिटिक्स + X-Ray |
| **इंडेक्सिंग** | सभी ट्रेस इंडेक्स किए जाते हैं | चयनात्मक इंडेक्सिंग (कॉन्फ़िगर करने योग्य %) |
| **बिज़नेस संदर्भ** | सीमित कस्टम attributes | समृद्ध OTEL span attributes + बिज़नेस संदर्भ |

## प्रमुख मूल्य प्रस्ताव

### 1. उच्च थ्रूपुट और स्केलेबिलिटी
- **CloudWatch Logs X-Ray से अधिक थ्रूपुट संभालता है**, जिससे ग्राहक सर्विस सीमाओं तक पहुंचे बिना सभी एप्लिकेशन इवेंट ट्रैक कर सकते हैं
- **ट्रेस डेटा के लिए Logs स्टोरेज** उच्च-वॉल्यूम एप्लिकेशन के लिए X-Ray की थ्रूपुट बाधाओं को दूर करता है
- **बड़े पैमाने पर लॉग इंजेशन वॉल्यूम के लिए डिज़ाइन किया गया स्केलेबल इंफ्रास्ट्रक्चर**

### 2. उन्नत एनालिटिक्स और एकीकरण क्षमताएं
- **नेटिव CloudWatch Logs सुविधाएं** span डेटा विश्लेषण के लिए उपलब्ध:
  - **Metrics Filters**: span attributes और पैटर्न से कस्टम मेट्रिक्स बनाएं
  - **Subscription Filters**: span डेटा को अन्य AWS सर्विसेज (Lambda, Kinesis, आदि) में स्ट्रीम करें
  - **Log Insights**: पारंपरिक ट्रेस विश्लेषण से परे उन्नत क्वेरी क्षमताएं
- **Transaction Search span-स्तरीय एनालिटिक्स के लिए उन्नत विज़ुअल क्वेरी इंटरफ़ेस प्रदान करता है**
- **OTEL फॉर्मेट कस्टम attributes के माध्यम से spans में समृद्ध बिज़नेस संदर्भ सक्षम करता है**

### 3. लागत प्रभावी 100% सैंपलिंग
- **बंडल्ड मूल्य निर्धारण** प्रति-ट्रेस X-Ray मूल्य निर्धारण की तुलना में पूर्ण दृश्यता को लागत-प्रभावी बनाता है। कृपया [CloudWatch मूल्य निर्धारण पृष्ठ](https://aws.amazon.com/cloudwatch/pricing/) में **Example 13** देखें
- **डेटा वॉल्यूम पर आधारित पूर्वानुमानित लागत**, ट्रेस गणना नहीं
- **चयनात्मक इंडेक्सिंग** पूर्ण डेटा एक्सेस बनाए रखते हुए स्टोरेज लागत को अनुकूलित करता है

## Span डेटा के साथ CloudWatch Logs सुविधाओं का लाभ उठाना

चूंकि Transaction Search span डेटा को CloudWatch Logs (`aws/spans` लॉग ग्रुप) में स्टोर करता है, आप सभी नेटिव CloudWatch Logs क्षमताओं का लाभ उठा सकते हैं:

**Metrics Filters:**
```bash
# span attributes से कस्टम मेट्रिक्स बनाएं
aws logs put-metric-filter \
  --log-group-name "aws/spans" \
  --filter-name "HighLatencyRequests" \
  --filter-pattern '[timestamp, request_id, span_id, trace_id, duration > 5000]' \
  --metric-transformations \
    metricName=HighLatencySpans,metricNamespace=CustomApp/Performance,metricValue=1
```

**Subscription Filters:**
```bash
# रीयल-टाइम प्रोसेसिंग के लिए span डेटा को Lambda में स्ट्रीम करें
aws logs put-subscription-filter \
  --log-group-name "aws/spans" \
  --filter-name "ErrorSpanProcessor" \
  --filter-pattern '[..., status_code="ERROR"]' \
  --destination-arn "arn:aws:lambda:region:account:function:ProcessErrorSpans"
```

**Log Insights Queries:**
```sql
-- विशिष्ट बिज़नेस attributes वाले सभी spans खोजें
fields @timestamp, attributes.customer_id, attributes.order_value, duration
| filter attributes.service_name = "payment-service"
| filter attributes.customer_tier = "premium"
| stats avg(duration) by attributes.customer_id
| sort avg(duration) desc
```

**एकीकरण अवसर:**
- **रीयल-टाइम अलर्टिंग**: तत्काल इंसिडेंट प्रतिक्रिया के लिए subscription filters से Lambda functions ट्रिगर करें
- **बिज़नेस इंटेलिजेंस**: Kinesis Data Streams के माध्यम से एनालिटिक्स प्लेटफॉर्म में span डेटा एक्सपोर्ट करें
- **कस्टम डैशबोर्ड**: span attributes से प्राप्त मेट्रिक्स का उपयोग करके CloudWatch डैशबोर्ड बनाएं
- **अनुपालन ऑडिटिंग**: नियामक अनुपालन रिपोर्टिंग के लिए Log Insights से spans क्वेरी करें
