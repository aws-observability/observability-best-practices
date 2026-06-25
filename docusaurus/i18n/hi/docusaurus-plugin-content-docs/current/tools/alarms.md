---
sidebar_label: अलार्म्स
---

# Alarms

Amazon CloudWatch alarms आपको CloudWatch Metrics और Logs के आसपास threshold परिभाषित करने और CloudWatch में कॉन्फ़िगर किए गए नियमों के आधार पर नोटिफिकेशन प्राप्त करने की अनुमति देता है।

**CloudWatch metrics पर Alarms:**

CloudWatch alarms आपको CloudWatch metrics पर threshold परिभाषित करने और metrics रेंज से बाहर आने पर नोटिफिकेशन प्राप्त करने की अनुमति देता है। प्रत्येक metric कई alarms ट्रिगर कर सकता है, और प्रत्येक alarm के साथ कई कार्रवाइयाँ जुड़ी हो सकती हैं। CloudWatch metrics के आधार पर metric alarms सेट अप करने के दो अलग-अलग तरीके हैं।

1. **स्थिर threshold**: स्थिर threshold एक कठोर सीमा का प्रतिनिधित्व करता है जिसका metric को उल्लंघन नहीं करना चाहिए। सामान्य संचालन के दौरान व्यवहार को समझने के लिए आपको स्थिर threshold की सीमा जैसे ऊपरी सीमा और निचली सीमा को परिभाषित करना होगा। यदि metric मान स्थिर threshold से नीचे या ऊपर जाता है तो आप CloudWatch को alarm उत्पन्न करने के लिए कॉन्फ़िगर कर सकते हैं।

2. **विसंगति पहचान**: विसंगति पहचान को आम तौर पर ऐसी दुर्लभ वस्तुओं, इवेंट या अवलोकनों के रूप में पहचाना जाता है जो डेटा के बहुमत से काफी विचलित होती हैं और सामान्य व्यवहार की एक अच्छी तरह से परिभाषित धारणा के अनुरूप नहीं होतीं। CloudWatch विसंगति पहचान पिछले metric डेटा का विश्लेषण करती है और अपेक्षित मानों का एक मॉडल बनाती है। अपेक्षित मान metric में सामान्य प्रति घंटा, दैनिक और साप्ताहिक पैटर्न को ध्यान में रखते हैं। आप आवश्यकतानुसार प्रत्येक metric पर विसंगति पहचान लागू कर सकते हैं और CloudWatch प्रत्येक सक्षम metric की ऊपरी और निचली सीमा परिभाषित करने के लिए मशीन-लर्निंग एल्गोरिदम लागू करता है और केवल तभी alarm उत्पन्न करता है जब metrics अपेक्षित मानों से बाहर जाती हैं।

:::tip
	स्थिर threshold उन metrics के लिए सबसे उपयुक्त हैं जिनकी आपको पक्की समझ है, जैसे आपके वर्कलोड में पहचाने गए प्रदर्शन ब्रेकपॉइंट, या इंफ्रास्ट्रक्चर घटकों पर पूर्ण सीमाएँ।
:::
:::info
	जब आपके पास समय के साथ किसी विशेष metric के प्रदर्शन में दृश्यता नहीं है, या जब metric मान लोड-टेस्टिंग या विषम ट्रैफ़िक के तहत पहले नहीं देखा गया है, तो अपने alarms के साथ विसंगति पहचान मॉडल का उपयोग करें।
:::
![CloudWatch Alarm types](../images/cwalarm1.png)

CloudWatch में स्थिर और विसंगति-आधारित alarms सेट अप करने के तरीके पर नीचे दिए गए निर्देशों का पालन कर सकते हैं।

[स्थिर threshold alarms](https://catalog.us-east-1.prod.workshops.aws/workshops/31676d37-bbe9-4992-9cd1-ceae13c5116c/en-US/alarms/mericalarm)

[CloudWatch विसंगति पहचान आधारित alarms](https://catalog.us-east-1.prod.workshops.aws/workshops/31676d37-bbe9-4992-9cd1-ceae13c5116c/en-US/alarms/adalarm)

:::info
	Alarm fatigue को कम करने या उत्पन्न होने वाले alarms की संख्या से शोर कम करने के लिए, alarms को कॉन्फ़िगर करने के दो उन्नत तरीके हैं:

	1. **Composite alarms**: एक composite alarm में एक नियम अभिव्यक्ति शामिल होती है जो पहले से बनाए गए अन्य alarms की स्थितियों को ध्यान में रखती है। Composite alarm `ALARM` स्थिति में तभी जाता है जब नियम की सभी शर्तें पूरी होती हैं। Composite alarm के नियम अभिव्यक्ति में निर्दिष्ट alarms में metric alarms और अन्य composite alarms शामिल हो सकते हैं। Composite alarms [एग्रीगेशन के साथ alarm fatigue से लड़ने](../signals/alarms.md#fight-alarm-fatigue-with-aggregation) में मदद करते हैं।

	2. **Metric math आधारित alarms**: Metric math अभिव्यक्तियों का उपयोग अधिक सार्थक KPI बनाने और उन पर alarm सेट करने के लिए किया जा सकता है। आप कई metrics को संयोजित करके एक संयुक्त उपयोग metric बना सकते हैं और उन पर alarm सेट कर सकते हैं।
:::

नीचे दिए गए निर्देश Composite alarms और Metric math आधारित alarms सेट अप करने का मार्गदर्शन करते हैं।

[Composite Alarms](https://catalog.us-east-1.prod.workshops.aws/workshops/31676d37-bbe9-4992-9cd1-ceae13c5116c/en-US/alarms/compositealarm)

[Metric Math alarms](https://aws.amazon.com/blogs/mt/create-a-metric-math-alarm-using-amazon-cloudwatch/)

**CloudWatch Logs पर Alarms**

आप CloudWatch Metric filter का उपयोग करके CloudWatch Logs के आधार पर alarms बना सकते हैं। Metric filters log डेटा को संख्यात्मक CloudWatch metrics में बदलते हैं जिन्हें आप ग्राफ़ कर सकते हैं या alarm सेट कर सकते हैं। एक बार metrics सेट अप हो जाने के बाद आप CloudWatch Logs से उत्पन्न CloudWatch metrics पर स्थिर या विसंगति-आधारित alarms का उपयोग कर सकते हैं।

आप [CloudWatch logs पर metric filter सेट अप](https://aws.amazon.com/blogs/mt/quantify-custom-application-metrics-with-amazon-cloudwatch-logs-and-metric-filters/) करने का उदाहरण यहाँ पा सकते हैं।

