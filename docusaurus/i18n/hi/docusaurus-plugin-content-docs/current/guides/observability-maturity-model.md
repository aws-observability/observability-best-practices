# AWS Observability Maturity Model

## परिचय

अपने मूल में, observability किसी सिस्टम की बाहरी आउटपुट का विश्लेषण करके उसकी आंतरिक स्थिति को समझने और अंतर्दृष्टि प्राप्त करने की क्षमता है। यह अवधारणा पारंपरिक मॉनिटरिंग दृष्टिकोणों से विकसित हुई है जो पूर्वनिर्धारित मेट्रिक्स या इवेंट पर केंद्रित होती हैं, एक अधिक समग्र दृष्टिकोण की ओर जो किसी वातावरण में विभिन्न कंपोनेंट्स द्वारा उत्पन्न डेटा के संग्रह, विश्लेषण और विज़ुअलाइज़ेशन को शामिल करती है। किसी सिस्टम को तब तक नियंत्रित या अनुकूलित नहीं किया जा सकता जब तक उसे observe नहीं किया जाता। एक प्रभावी observability रणनीति टीमों को समस्याओं की तेज़ी से पहचान और समाधान करने, संसाधन उपयोग को अनुकूलित करने और अपने सिस्टम के समग्र स्वास्थ्य में अंतर्दृष्टि प्राप्त करने की अनुमति देती है।

![Observability क्यों](../images/Why_is_Observability_Important.png)

मॉनिटरिंग और Observability के बीच अंतर यह है कि मॉनिटरिंग बताती है कि सिस्टम काम कर रहा है या नहीं, जबकि Observability बताता है कि सिस्टम क्यों काम नहीं कर रहा। मॉनिटरिंग आमतौर पर एक प्रतिक्रियात्मक उपाय है जबकि Observability का लक्ष्य सक्रिय तरीके से आपके Key Performance Indicators (KPIs) में सुधार करने में सक्षम होना है। निरंतर मॉनिटरिंग और Observability चपलता बढ़ाती है, ग्राहक अनुभव में सुधार करती है और क्लाउड वातावरण में जोखिम कम करती है।

## Observability maturity model

Observability maturity model उन संगठनों के लिए एक आवश्यक फ्रेमवर्क के रूप में कार्य करता है जो अपने वर्कलोड observability और प्रबंधन प्रक्रियाओं को अनुकूलित करना चाहते हैं। यह मॉडल व्यवसायों के लिए उनकी वर्तमान क्षमताओं का आकलन करने, सुधार के क्षेत्रों की पहचान करने और इष्टतम observability प्राप्त करने के लिए सही उपकरणों और प्रक्रियाओं में रणनीतिक रूप से निवेश करने के लिए एक व्यापक रोडमैप प्रदान करता है।

## Observability Maturity Model के चरण

जैसे-जैसे संगठन अपने वर्कलोड का विस्तार करते हैं, observability maturity model के भी परिपक्व होने की उम्मीद है।

1. Observability maturity model में पहले चरण में आमतौर पर संगठन की वर्तमान स्थिति की बेसलाइन समझ स्थापित करना शामिल है। इसमें मौजूदा मॉनिटरिंग उपकरणों और प्रक्रियाओं का आकलन करना, साथ ही दृश्यता या कार्यक्षमता में gaps की पहचान करना शामिल है।

2. अगले चरण में, संगठन उन्नत observability रणनीतियों और सेवाओं को अपनाकर अधिक परिष्कृत दृष्टिकोण की ओर बढ़ते हैं।

3. जैसे-जैसे व्यवसाय तीसरे चरण से गुज़रते हैं, वे anomaly detection और root cause analysis को स्वचालित करने के लिए कृत्रिम बुद्धिमत्ता और मशीन लर्निंग प्रौद्योगिकियों जैसी अतिरिक्त क्षमताओं का लाभ उठा सकते हैं।

4. अंतिम चरण में observability उपकरणों द्वारा उत्पन्न डेटा की संपदा का लाभ उठाकर निरंतर सुधार को चलाना शामिल है।

![Observability maturity model चरण](../images/AWS-Observability-maturity-model.png)

### चरण 1: आधारभूत मॉनिटरिंग - टेलीमेट्री डेटा एकत्र करना

न्यूनतम के रूप में अपनाया गया और साइलो में काम करते हुए, बेसिक मॉनिटरिंग में एक संगठन में सिस्टम या वर्कलोड की संपूर्णता की निगरानी के लिए आवश्यकताओं की एक अपरिभाषित रणनीति होती है।

observability maturity में सुधार की दिशा में एक नींव बनाने के लिए, मेट्रिक्स, लॉग्स, ट्रेसेस के संग्रह के माध्यम से वर्कलोड को इंस्ट्रूमेंट करना और सही मॉनिटरिंग और observability उपकरणों का उपयोग करके सार्थक अंतर्दृष्टि प्राप्त करना ग्राहकों को वातावरण को नियंत्रित और अनुकूलित करने में मदद करता है।

### चरण 2: मध्यवर्ती मॉनिटरिंग - टेलीमेट्री विश्लेषण और अंतर्दृष्टि

इस चरण में, ग्राहक देखते हैं कि उनके संगठन ऑन-प्रेमिस और क्लाउड जैसे विभिन्न वातावरणों से सिग्नल एकत्र करने के मामले में स्पष्ट हो रहे हैं।

![Observability के स्तंभ](../images/three-pillars.png)

हालांकि अधिकांश मामलों में मॉनिटरिंग अच्छी तरह से काम करती प्रतीत होती है, संगठन समस्याओं को डिबग करने में अधिक समय बिताते हैं और परिणामस्वरूप समग्र Mean Time-To-Resolution (MTTR) सुसंगत नहीं है।

### चरण 3: उन्नत Observability - Correlation और Anomaly Detection

इस चरण में संगठन बिना अधिक समय खर्च किए समस्याओं के मूल कारण को स्पष्ट रूप से समझ सकते हैं। जब कोई समस्या उत्पन्न होती है, तो अलर्ट संबंधित टीमों को पर्याप्त संदर्भगत जानकारी प्रदान करते हैं।

![AIOps के साथ Observability](../images/o11y4AIOps.png)

### चरण 4: सक्रिय Observability - स्वचालित और सक्रिय Root Cause पहचान

यहां Observability डेटा का उपयोग केवल किसी समस्या के "बाद" नहीं किया जाता, बल्कि वास्तविक समय में "पहले" किसी समस्या के होने से पहले डेटा का उपयोग किया जाता है।

एक समग्र तस्वीर प्रदान करने वाले observability पोर्टफोलियो का एक अवलोकन, डेटा संग्रह, डेटा प्रसंस्करण, डेटा अंतर्दृष्टि और विश्लेषण के लिए विभिन्न AWS नेटिव और ओपन-सोर्स समाधानों के साथ।

![AWS Observability स्टैक](../images/AWS_O11y_Stack.png)

## Observability के लिए AWS Well-Architected और Cloud Adoption Framework

संगठन अपनी observability क्षमताओं को बढ़ाने और अपने क्लाउड वातावरण की प्रभावी ढंग से निगरानी और समस्या निवारण करने के लिए [AWS Well-Architected](https://aws.amazon.com/architecture/well-architected/) और [Cloud Adoption Framework](https://docs.aws.amazon.com/whitepapers/latest/aws-caf-operations-perspective/observability.html) का लाभ उठा सकते हैं।

## मूल्यांकन

Observability Maturity Model मूल्यांकन का उपयोग आपकी observability की वर्तमान स्थिति का आकलन करने और सुधार के क्षेत्रों की पहचान करने के लिए किया जा सकता है।

**लॉग्स**

1. आप लॉग्स कैसे एकत्र करते हैं?
2. आप लॉग्स का उपयोग कैसे करते हैं?
3. आप लॉग्स तक कैसे पहुंचते हैं?
4. सुरक्षा और नियामक अनुपालन के लिए आपकी लॉग retention नीति क्या है?
5. क्या आप आज कोई ML/AI क्षमता का उपयोग करते हैं?

**मेट्रिक्स**

6. आप किस प्रकार के मेट्रिक्स एकत्र करते हैं?
7. आप मेट्रिक्स का उपयोग कैसे करते हैं?
8. आप मेट्रिक्स तक कैसे पहुंचते हैं?

**ट्रेसेस**

9. आप ट्रेसेस कैसे एकत्र करते हैं?
10. आप ट्रेसेस का उपयोग कैसे करते हैं?

**डैशबोर्ड और अलर्टिंग**

11. आप alarms का उपयोग कैसे करते हैं?
12. आप डैशबोर्ड का उपयोग कैसे करते हैं?

**संगठन**

13. क्या आपके पास एक enterprise observability रणनीति है?
14. आप SLOs का उपयोग कैसे करते हैं?

## Observability रणनीति बनाना

एक बार जब संगठन ने अपने observability चरण की पहचान कर ली, तो उन्हें वर्तमान प्रक्रियाओं और उपकरणों को अनुकूलित करने की रणनीति बनाना शुरू करना चाहिए और परिपक्वता की दिशा में भी काम करना शुरू करना चाहिए।

![Observability virtuous cycle](../images/o11y-virtuous-cycle.png)

सारांश में, एक observability रणनीति बनाने के लिए तीन मुख्य पहलुओं पर विचार करने की आवश्यकता है: 1) क्या एकत्र करने की आवश्यकता है 2) वे सभी सिस्टम और वर्कलोड क्या हैं जिनका observe किया जाना है और 3) समस्याएं होने पर कैसे प्रतिक्रिया करनी है और उन्हें ठीक करने के लिए क्या तंत्र होने चाहिए।

## निष्कर्ष

Observability maturity model संगठनों के लिए उनकी वर्तमान स्थिति का आकलन करने और वर्कलोड और इंफ्रास्ट्रक्चर के व्यवहार को समझने, विश्लेषण करने और प्रतिक्रिया देने की उनकी क्षमता में सुधार करने के तरीके खोजने के लिए एक रोडमैप के रूप में कार्य करता है।

## सहायक संसाधन

- [Building an effective observability strategy](https://youtu.be/7PQv9eYCJW8?si=gsn0qPyIMhrxU6sy) - AWS re:Invent 2023
- [AWS Observability Best Practices](https://aws-observability.github.io/observability-best-practices/)
- [What is observability and Why does it matter?](https://aws.amazon.com/blogs/mt/what-is-observability-and-why-does-it-matter-part-1/)
- [How to develop an Observability strategy?](https://aws.amazon.com/blogs/mt/how-to-develop-an-observability-strategy/)
- [Guidance for Deep Application Observability on AWS](https://aws.amazon.com/solutions/guidance/deep-application-observability-on-aws/)
- [How Discovery increased operational efficiency with AWS observability](https://www.youtube.com/watch?v=zm30JNYmxlY) - AWS re:Invent 2022
- [Developing an observability strategy](https://www.youtube.com/watch?v=Ub3ATriFapQ) - AWS re:Invent 2022
- [Explore Cloud Native Observability with AWS](https://www.youtube.com/watch?v=UW7aT25Mbng) - AWS Virtual Workshop
- [Increase availability with AWS observability solutions](https://www.youtube.com/watch?v=_d_9xCfVBTM) - AWS re:Invent 2020
- [Observability best practices at Amazon](https://www.youtube.com/watch?v=zZPzXEBW4P8) - AWS re:Invent 2022
- [Observability: Best practices for modern applications](https://www.youtube.com/watch?v=YiegAlC_yyc) - AWS re:Invent 2022
- [Observability the open-source way](https://www.youtube.com/watch?v=2IJPpdp9xU0) - AWS re:Invent 2022
- [Elevate your Observability Strategy with AIOps](https://www.youtube.com/watch?v=L4b_eDSAwfE)
- [Let's Architect! Monitoring production systems at scale](https://aws.amazon.com/blogs/architecture/lets-architect-monitoring-production-systems-at-scale/)
- [Full-stack observability and application monitoring with AWS](https://www.youtube.com/watch?v=or7uFFyHIX0) - AWS Summit SF 2022