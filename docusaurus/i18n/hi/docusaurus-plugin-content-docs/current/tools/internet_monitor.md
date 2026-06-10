# Internet Monitor

:::warning
	इस लेखन के समय, [Internet Monitor](https://aws.amazon.com/blogs/aws/cloudwatch-internet-monitor-end-to-end-visibility-into-internet-performance-for-your-applications/) CloudWatch कंसोल में **प्रीव्यू** में उपलब्ध है। सामान्य उपलब्धता के लिए फीचर्स का दायरा आज आप जो अनुभव करते हैं उससे बदल सकता है।
:::
[अपने वर्कलोड की सभी परतों से टेलीमेट्री एकत्र करना](../guides/index.md#collect-telemetry-from-all-tiers-of-your-workload) एक सर्वोत्तम अभ्यास है, और यह एक चुनौती हो सकती है। लेकिन आपके वर्कलोड की परतें क्या हैं? कुछ के लिए यह वेब, एप्लिकेशन और डेटाबेस सर्वर हो सकती हैं। अन्य लोग अपने वर्कलोड को फ्रंट एंड और बैक एंड के रूप में देख सकते हैं। और वेब एप्लिकेशन संचालित करने वाले [Real User Monitoring](./rum.md)(RUM) का उपयोग करके इन ऐप्स की स्थिति का अवलोकन कर सकते हैं जैसा कि अंतिम उपयोगकर्ताओं द्वारा अनुभव किया जाता है।

लेकिन क्लाइंट और डेटासेंटर या क्लाउड सेवा प्रदाता के बीच ट्रैफिक का क्या? और उन एप्लिकेशनों के लिए जो वेब पेज के रूप में नहीं परोसे जाते और इसलिए RUM का उपयोग नहीं कर सकते?

![इंटरनेट-ट्रैवर्सिंग एप्लिकेशन से नेटवर्क टेलीमेट्री](../images/internet_monitor.png)

Internet Monitor नेटवर्किंग स्तर पर काम करता है और अवलोकित ट्रैफिक की स्थिति का मूल्यांकन करता है, जो ज्ञात इंटरनेट समस्याओं के [AWS के मौजूदा ज्ञान](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-IM-inside-internet-monitor.html) के साथ सहसंबद्ध होता है। संक्षेप में, यदि कोई Internet Service Provider (ISP) में प्रदर्शन या उपलब्धता की समस्या है **और** यदि आपके एप्लिकेशन का ट्रैफिक क्लाइंट/सर्वर संचार के लिए इस ISP का उपयोग करता है, तो Internet Monitor आपको इस प्रभाव के बारे में सक्रिय रूप से सूचित कर सकता है। इसके अतिरिक्त, यह आपके चयनित होस्टिंग क्षेत्र और Content Delivery Network[^1] के रूप में [CloudFront](https://aws.amazon.com/cloudfront/) के उपयोग के आधार पर आपको सिफारिशें कर सकता है।

:::tip
	Internet Monitor केवल उन नेटवर्क से ट्रैफिक का मूल्यांकन करता है जो आपके वर्कलोड ट्रैवर्स करते हैं। उदाहरण के लिए, यदि किसी अन्य देश में ISP प्रभावित है, लेकिन आपके उपयोगकर्ता उस कैरियर का उपयोग नहीं करते, तो आपको उस समस्या में दृश्यता नहीं होगी।
:::

## इंटरनेट ट्रैवर्स करने वाले एप्लिकेशनों के लिए मॉनिटर बनाएं

Internet Monitor जिस तरह से काम करता है वह प्रभावित ISP से आपके CloudFront डिस्ट्रीब्यूशन या आपके VPC में आने वाले ट्रैफिक को देखकर है। यह आपको एप्लिकेशन व्यवहार, रूटिंग, या उपयोगकर्ता अधिसूचना के बारे में निर्णय लेने की अनुमति देता है जो आपके नियंत्रण से बाहर नेटवर्क समस्याओं के परिणामस्वरूप उत्पन्न होने वाली व्यावसायिक समस्याओं को कम करने में मदद करता है।

![आपके वर्कलोड और ISP समस्याओं का प्रतिच्छेदन](../images/internet_monitor_2.png)

:::info
	केवल ऐसे मॉनिटर बनाएं जो इंटरनेट ट्रैवर्स करने वाले ट्रैफिक को देखते हैं। प्राइवेट ट्रैफिक, जैसे कि प्राइवेट नेटवर्क ([RFC1918](https://www.arin.net/reference/research/statistics/address_filters/)) में दो होस्ट के बीच का ट्रैफिक, Internet Monitor का उपयोग करके मॉनिटर नहीं किया जा सकता।
:::
:::info
	जहां लागू हो, मोबाइल एप्लिकेशन से ट्रैफिक को प्राथमिकता दें। प्रदाताओं के बीच रोमिंग करने वाले, या दूरस्थ भौगोलिक स्थानों में ग्राहकों का अनुभव अलग या अप्रत्याशित हो सकता है जिसके बारे में आपको जानकारी होनी चाहिए।
:::
## EventBridge और CloudWatch के माध्यम से एक्शन सक्षम करें

अवलोकित समस्याएं [EventBridge](https://aws.amazon.com/eventbridge/) के माध्यम से एक [स्कीमा](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-IM-EventBridge-integration.html) का उपयोग करके प्रकाशित की जाएंगी जिसमें सोर्स `aws.internetmonitor` के रूप में पहचाना गया है। EventBridge का उपयोग स्वचालित रूप से आपके टिकट प्रबंधन सिस्टम में समस्याएं बनाने, आपकी सपोर्ट टीमों को पेज करने, या यहां तक कि ऑटोमेशन ट्रिगर करने के लिए किया जा सकता है जो कुछ परिदृश्यों को कम करने के लिए आपके वर्कलोड को बदल सकता है।

```json
{
  "source": ["aws.internetmonitor"]
}
```

इसी तरह, अवलोकित शहरों, देशों, मेट्रो और उपखंडों के लिए ट्रैफिक का व्यापक विवरण [CloudWatch Logs](./logs/index.md) में उपलब्ध है। यह आपको अत्यधिक लक्षित कार्रवाइयां बनाने की अनुमति देता है जो प्रभावित ग्राहकों को उनके स्थानीय समस्याओं के बारे में सक्रिय रूप से सूचित कर सकती हैं। यहां एक एकल प्रदाता के बारे में देश-स्तरीय अवलोकन का एक उदाहरण है:

```json
{
    "version": 1,
    "timestamp": 1669659900,
    "clientLocation": {
        "latitude": 0,
        "longitude": 0,
        "country": "United States",
        "subdivision": "",
        "metro": "",
        "city": "",
        "countryCode": "US",
        "subdivisionCode": "",
        "asn": 00000,
        "networkName": "MY-AWESOME-ASN"
    },
    "serviceLocation": "us-east-1",
    "percentageOfTotalTraffic": 0.36,
    "bytesIn": 23,
    "bytesOut": 0,
    "clientConnectionCount": 0,
    "internetHealth": {
        "availability": {
            "experienceScore": 100,
            "percentageOfTotalTrafficImpacted": 0,
            "percentageOfClientLocationImpacted": 0
        },
        "performance": {
            "experienceScore": 100,
            "percentageOfTotalTrafficImpacted": 0,
            "percentageOfClientLocationImpacted": 0,
            "roundTripTime": {
                "p50": 71,
                "p90": 72,
                "p95": 73
            }
        }
    },
    "trafficInsights": {
        "timeToFirstByte": {
            "currentExperience": {
                "serviceName": "VPC",
                "serviceLocation": "us-east-1",
                "value": 48
            },
            "ec2": {
                "serviceName": "EC2",
                "serviceLocation": "us-east-1",
                "value": 48
            }
        }
    }
}
```

:::info
	`percentageOfTotalTraffic` जैसे मान इस बारे में शक्तिशाली अंतर्दृष्टि प्रकट कर सकते हैं कि आपके ग्राहक आपके वर्कलोड को कहां से एक्सेस करते हैं और उन्नत एनालिटिक्स के लिए उपयोग किया जा सकता है।
:::

:::warning
	ध्यान दें कि Internet Monitor द्वारा बनाए गए लॉग ग्रुप में डिफ़ॉल्ट रिटेंशन अवधि *कभी समाप्त न हो* के रूप में सेट होगी। AWS आपकी सहमति के बिना आपका डेटा नहीं हटाता, इसलिए सुनिश्चित करें कि आप अपनी आवश्यकताओं के अनुसार एक रिटेंशन अवधि सेट करें।
:::
:::info
	प्रत्येक मॉनिटर कम से कम 10 अलग CloudWatch मेट्रिक्स बनाएगा। इनका उपयोग [अलार्म](./alarms.md) बनाने के लिए किया जाना चाहिए जैसा कि आप किसी अन्य ऑपरेशनल मेट्रिक के साथ करेंगे।
:::
## ट्रैफिक ऑप्टिमाइज़ेशन सुझावों का उपयोग करें

Internet Monitor में ट्रैफिक ऑप्टिमाइज़ेशन सिफारिशों की सुविधा है जो आपको सलाह दे सकती है कि सर्वोत्तम ग्राहक अनुभव प्राप्त करने के लिए अपने वर्कलोड कहां रखने चाहिए। उन वर्कलोड के लिए जो वैश्विक हैं, या जिनके वैश्विक ग्राहक हैं, यह सुविधा विशेष रूप से मूल्यवान है।

![Internet Monitor कंसोल](../images/internet_monitor_3.png)

:::info
	ट्रैफिक ऑप्टिमाइज़ेशन सुझाव दृश्य में वर्तमान, पूर्वानुमानित और न्यूनतम time-to-first-byte (TTFB) मानों पर विशेष ध्यान दें क्योंकि ये संभावित खराब अंतिम-उपयोगकर्ता अनुभवों को इंगित कर सकते हैं जो अन्यथा अवलोकन करना कठिन हैं।
:::
[^1]: इस नई सुविधा के बारे में हमारे लॉन्च ब्लॉग के लिए [https://aws.amazon.com/blogs/aws/cloudwatch-internet-monitor-end-to-end-visibility-into-internet-performance-for-your-applications/](https://aws.amazon.com/blogs/aws/cloudwatch-internet-monitor-end-to-end-visibility-into-internet-performance-for-your-applications/) देखें।
