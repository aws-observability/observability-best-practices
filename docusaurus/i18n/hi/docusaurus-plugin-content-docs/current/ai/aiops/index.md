---
sidebar_position: 2
---

# AIOps

क्लाउड संचालन को बेहतर बनाने के लिए AI और मशीन लर्निंग का उपयोग -- विसंगति का पता लगाना, स्वचालित मूल कारण विश्लेषण, पूर्वानुमानित अलर्टिंग, और बुद्धिमान स्वचालित सुधार।

## AIOps के लिए AWS सेवाएँ

- **[Amazon DevOps Guru](https://aws.amazon.com/devops-guru/)** -- ML-संचालित अंतर्दृष्टि जो असामान्य एप्लिकेशन व्यवहार का पता लगाती है और सुधार की सिफारिश करती है
- **[CloudWatch Anomaly Detection](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Anomaly_Detection.html)** -- मेट्रिक्स का निरंतर विश्लेषण करने और विसंगतियों की पहचान करने के लिए ML एल्गोरिदम लागू करता है
- **[CloudWatch Application Signals](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Monitoring-Sections.html)** -- एप्लिकेशन सेवाओं और उनकी निर्भरताओं को स्वचालित रूप से खोजता और मॉनिटर करता है
- **[Amazon Q Developer operational investigations](https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/operational-investigation.html)** -- परिचालन समस्याओं की AI-सहायता प्राप्त जाँच

## सर्वोत्तम प्रथाएँ

- इन्फ्रास्ट्रक्चर तक विस्तार करने से पहले प्रमुख व्यावसायिक मेट्रिक्स पर विसंगति पहचान से शुरू करें
- व्यक्तिगत ML-आधारित डिटेक्टरों से शोर कम करने के लिए composite alarms का उपयोग करें
- AIOps सिग्नल को मानवीय निर्णय के साथ संयोजित करें -- ML का उपयोग समस्याओं को सामने लाने के लिए करें, समीक्षा के बिना महत्वपूर्ण सिस्टम को स्वचालित रूप से ठीक करने के लिए नहीं
- AI-सहायता प्राप्त जाँच में सुधार के लिए परिचालन रनबुक और पिछली घटनाओं के डेटा का उपयोग करें
