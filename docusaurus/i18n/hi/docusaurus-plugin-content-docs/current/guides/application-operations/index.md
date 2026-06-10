---
sidebar_position: 5
---
# एप्लिकेशन ऑपरेशन

AWS ग्राहक अक्सर सैकड़ों एप्लिकेशन संचालित करते हैं और यह सुनिश्चित करने के लिए व्यक्तिगत संसाधनों की मॉनिटर और प्रबंधन करना पड़ता है कि उनके एप्लिकेशन उपलब्ध, सुरक्षित, लागत-अनुकूलित और बेहतर प्रदर्शन कर रहे हैं। एप्लिकेशन ग्राहक व्यवसायों के लिए आवश्यक हैं। ये संसाधनों के समूह हैं जो विशिष्ट सुविधाएं या सेवाएं प्रदान करने के लिए एक साथ काम करते हैं जिनकी अंतिम उपयोगकर्ता को आवश्यकता है। आज के तेज़ी से विकसित हो रहे डिजिटल परिदृश्य में, अपने AWS संसाधनों को सुपरिभाषित एप्लिकेशन में व्यवस्थित करना कुशल Cloud Operations के लिए महत्वपूर्ण हो गया है।

AWS एक एप्लिकेशन-केंद्रित क्लाउड ऑपरेशन रणनीति का समर्थन करने के लिए डिज़ाइन की गई सेवाओं का एक व्यापक सूट प्रदान करता है, जो आपको संसाधन प्रबंधन को सुव्यवस्थित करने, दृश्यता में सुधार करने और समग्र परिचालन दक्षता बढ़ाने में सक्षम बनाता है।

एप्लिकेशन ऑपरेशन AWS में क्षमताओं का एक सेट है जो आपके एप्लिकेशन की लागत, स्वास्थ्य, सुरक्षा स्थिति और प्रदर्शन जैसे मेट्रिक्स की मॉनिटरिंग के लिए कम प्रयास और बड़े पैमाने पर एक सुसंगत दृष्टिकोण प्रदान करता है।

![Application Operations](/img/cloudops/guides/app-ops/BP-App-ops-1.png "Application Operations")

जटिल क्लाउड एनवायरनमेंट में, एप्लिकेशन का प्रबंधन कई संगठनों के लिए चुनौतीपूर्ण और समय लेने वाला हो सकता है। चुनौती न केवल व्यक्तिगत संसाधनों के प्रबंधन में है, बल्कि एप्लिकेशन लाइफसाइकल के विभिन्न चरणों में एप्लिकेशन कार्यों को करने में भी है।

इन चुनौतियों को संबोधित करने के लिए, संसाधन प्रबंधन के लिए एक ठोस आधार स्थापित करना आवश्यक है। यह आधार संसाधन परिदृश्य की व्यापक समझ विकसित करने और एप्लिकेशन पर केंद्रित एक मजबूत टैगिंग रणनीति लागू करने से शुरू होता है।

![Application Operations](/img/cloudops/guides/app-ops/BP-App-ops-2.png "Application Operations")


### **आधार स्थापित करना**

AWS ग्राहक अक्सर एक ही अकाउंट के भीतर कई संसाधनों से निपटते हैं, और उनके एप्लिकेशन में एकीकृत दृश्य की कमी कुशल कार्रवाई और निर्णय लेने में काफी बाधा डाल सकती है। आधार में निम्नलिखित घटक होते हैं: टैगिंग, टैगिंग नीतियां, Resource Groups, और Resources Explorer।

AWS Resource Explorer AWS संसाधनों के बारे में विस्तृत जानकारी एकत्रित करता है और उन पर कार्रवाई करने के लिए एक केंद्रीकृत स्थान प्रदान करता है।

टैगिंग संसाधनों को व्यवस्थित करने और संसाधन प्रबंधन को सरल बनाने में एक महत्वपूर्ण कदम है। एक application tag विशेष रूप से मूल्यवान है क्योंकि यह पहचानने में मदद करता है कि प्रत्येक संसाधन किस एप्लिकेशन से संबंधित है।

```json
Example for tagging schema for POS system and inventory manager can be as:
Application name ("pos-system", "inventory-manager")
Environment (e.g., "production", "development", "testing")
Business unit (e.g., "north-america", "europe", "e-commerce")
Cost center (e.g., "it-ops", "marketing", "sales")
```

टैगिंग और Resource Groups मिलकर काम करते हैं। Resource Groups आपको AWS संसाधनों को उन कंपोनेंट में व्यवस्थित करने की अनुमति देते हैं जो एप्लिकेशन, प्रोजेक्ट या वर्कलोड को दर्शाते हैं।

### **एप्लिकेशन परिभाषित करना**

टैग और Resource Groups पर निर्माण करते हुए, AWS के भीतर एप्लिकेशन को सुसंगत इकाइयों के रूप में परिभाषित करना Cloud Operations के लिए वास्तव में एप्लिकेशन-केंद्रित दृष्टिकोण की अनुमति देता है। एप्लिकेशन स्थापित करने के लिए, AWS Service Catalog AppRegistry जैसी AWS सेवाओं का उपयोग करें।

### **एप्लिकेशन-केंद्रित दृश्य**

एप्लिकेशन ऑपरेशन के लिए एक सुसंगत एप्लिकेशन मॉडल की आवश्यकता होती है; [AWS Service Catalog AppRegistry](https://docs.aws.amazon.com/servicecatalog/latest/arguide/intro-app-registry.html) एप्लिकेशन मेटाडेटा संग्रहीत करता है, [AWS Resource Groups](https://docs.aws.amazon.com/ARG/latest/userguide/resource-groups.html) तार्किक रूप से एप्लिकेशन संसाधनों को समूहित करता है, और resource tagging एप्लिकेशन के संसाधनों को खोजने योग्य resource groups में व्यवस्थित करता है।

जब AppRegistry एप्लिकेशन बनाया जाता है, तो AppRegistry AWS संसाधनों को एक vended application tag का उपयोग करके resource group के रूप में जोड़ता है। Tag key **awsApplication** है और value एप्लिकेशन के लिए एक unique identifier है।

myApplications डैशबोर्ड आपके चुने हुए एप्लिकेशन के लिए लागत और उपयोग, सुरक्षा और ऑपरेशन मेट्रिक्स सहित मेट्रिक्स का एक संयुक्त दृश्य प्रदान करने के लिए application tag का उपयोग करता है।

myApplications डैशबोर्ड के साथ, आप विशिष्ट संसाधनों पर कार्रवाई करने के लिए संबंधित सेवाओं में गहराई से जा सकते हैं, जैसे एप्लिकेशन प्रदर्शन के लिए [Amazon CloudWatch](https://aws.amazon.com/cloudwatch), लागत और उपयोग के लिए [AWS Cost Explorer](https://aws.amazon.com/aws-cost-management/aws-cost-explorer/), और सुरक्षा findings के लिए [AWS Security Hub](https://aws.amazon.com/security-hub/) आदि।

#### **Cost & Usage Widget**

Cost & Usage widget [AWS Cost Explorer](https://docs.aws.amazon.com/cost-management/latest/userguide/ce-enable.html) से आपके AWS संसाधनों की लागत को विज़ुअलाइज़ करता है, जिसमें एप्लिकेशन की वर्तमान और पूर्वानुमानित महीने के अंत की लागत, शीर्ष पांच बिल की गई सेवाएं और मासिक एप्लिकेशन संसाधन लागत रुझान चार्ट शामिल हैं।

#### **DevOps widget**

DevOps widget fleet management, compliance और OpsItems management के बारे में महत्वपूर्ण जानकारी प्रदर्शित करके आपके एप्लिकेशन के लिए प्रमुख परिचालन अंतर्दृष्टि का एक केंद्रीकृत दृश्य प्रदान करता है।

#### **Security widget**

Security widget [AWS Security Hub](https://aws.amazon.com/security-hub/) से उन संसाधनों के बारे में जानकारी प्रदर्शित करता है जो उस एप्लिकेशन को बनाते हैं।

**Compute widget**

Compute widget myApplications डैशबोर्ड में प्रत्येक एप्लिकेशन को संचालित करने वाले कंप्यूट संसाधनों पर एक समेकित, त्वरित दृश्य प्रदान करता है।

#### **Monitoring and operations widget**

Monitoring and operations widget आपके एप्लिकेशन से संबंधित संसाधनों के लिए alarms और canary alarms, एप्लिकेशन service level indicator (SLIs) और मेट्रिक्स, और अन्य उपलब्ध AWS CloudWatch Application Signals मेट्रिक्स दिखाता है।

[Amazon CloudWatch Application Signals](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Monitoring-Sections.html) AWS पर आपके एप्लिकेशन को इंस्ट्रूमेंट करता है ताकि आप अपने एप्लिकेशन के स्वास्थ्य की मॉनिटरिंग कर सकें।

### रणनीति से कार्यान्वयन तक

1. एप्लिकेशन नाम, एनवायरनमेंट, बिजनेस यूनिट और कॉस्ट सेंटर पर केंद्रित एक व्यापक टैगिंग रणनीति विकसित करके शुरू करें। [Building your tagging strategy](https://docs.aws.amazon.com/whitepapers/latest/tagging-best-practices/building-your-tagging-strategy.html)
2. इन टैग्स को सभी प्रासंगिक संसाधनों में व्यवस्थित रूप से लागू करें। [Resource Groups and Tagging for AWS](https://aws.amazon.com/blogs/aws/resource-groups-and-tagging/)
3. इन टैग्स के आधार पर Resource Groups बनाएं। [Key concepts of AWS Service Catalog AppRegistry](https://docs.aws.amazon.com/serviwecatalog/latest/arguide/overview-appreg.html#ar-user-tags)
4. myApplications डैशबोर्ड का उपयोग करके अपने एप्लिकेशन का एकीकृत दृश्य प्राप्त करें। [myApplications in the AWS Management Console simplifies managing your application resources](https://aws.amazon.com/blogs/aws/new-myapplications-in-the-aws-management-console-simplifies-managing-your-application-resources/)

### **आगे पढ़ना:**

* [Defining and publishing a tagging schema](https://docs.aws.amazon.com/whitepapers/latest/tagging-best-practices/defining-and-publishing-a-tagging-schema.html)
* [Best Practices for Tagging AWS Resources](https://docs.aws.amazon.com/whitepapers/latest/tagging-best-practices/tagging-best-practices.html)
* [Implementing automated and centralized tagging control](https://aws.amazon.com/blogs/mt/implementing-automated-and-centralized-tagging-controls-with-aws-config-and-aws-organizations/)


### निष्कर्ष

जैसे-जैसे ग्राहकों के व्यवसाय क्लाउड में बढ़ते और विकसित होते रहते हैं, संसाधन प्रबंधन के लिए इन सर्वोत्तम प्रथाओं को अपनाना आवश्यक है। आधार रखकर, संगठन न केवल अपनी वर्तमान आवश्यकताओं को पूरा कर सकते हैं बल्कि भविष्य के विकास और नवाचारों के लिए भी तैयार हो सकते हैं। AWS Application Operations और myApplications इस दृष्टिकोण को एक कदम आगे ले जाता है, एप्लिकेशन संसाधनों और मेट्रिक्स का एक समेकित दृश्य प्रदान करता है।
