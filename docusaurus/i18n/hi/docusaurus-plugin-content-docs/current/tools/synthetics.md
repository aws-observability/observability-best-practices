# Synthetic Testing

Amazon CloudWatch Synthetics आपको अपने ग्राहक के दृष्टिकोण से एप्लिकेशन की निगरानी करने की अनुमति देता है, वास्तविक उपयोगकर्ताओं की अनुपस्थिति में भी। अपने API और वेबसाइट अनुभवों का लगातार परीक्षण करके, आप उन आंतरायिक समस्याओं की दृश्यता प्राप्त कर सकते हैं जो उपयोगकर्ता ट्रैफिक न होने पर भी होती हैं।

Canary कॉन्फ़िगर करने योग्य स्क्रिप्ट हैं, जिन्हें आप अपने API और वेबसाइट अनुभवों का 24x7 लगातार परीक्षण करने के लिए शेड्यूल पर चला सकते हैं। वे वास्तविक उपयोगकर्ताओं के समान कोड पथ और नेटवर्क रूट का अनुसरण करते हैं, और लेटेंसी, पेज लोड एरर, टूटे या मृत लिंक, और टूटे उपयोगकर्ता वर्कफ़्लो सहित अप्रत्याशित व्यवहार के बारे में आपको सूचित कर सकते हैं।

![CloudWatch Synthetics आर्किटेक्चर](../images/synthetics0.png)

:::note
    सुनिश्चित करें कि आप केवल उन एंडपॉइंट और API की निगरानी के लिए Synthetics canary का उपयोग करें जहां आपके पास स्वामित्व या अनुमतियां हैं। Canary फ्रीक्वेंसी सेटिंग्स के आधार पर, इन एंडपॉइंट पर बढ़ा हुआ ट्रैफिक अनुभव हो सकता है।
:::
## शुरू करना

### पूर्ण कवरेज

:::tip
    अपनी परीक्षण रणनीति विकसित करते समय, अपने Amazon VPC के भीतर सार्वजनिक और [प्राइवेट आंतरिक एंडपॉइंट](https://aws.amazon.com/blogs/mt/monitor-your-private-endpoints-using-cloudwatch-synthetics/) दोनों पर विचार करें।
:::
### नए Canary रिकॉर्ड करना

[CloudWatch Synthetics Recorder](https://chrome.google.com/webstore/detail/cloudwatch-synthetics-rec/bhdnlmmgiplmbcdmkkdfplenecpegfno) Chrome ब्राउज़र प्लगइन आपको स्क्रैच से जटिल वर्कफ़्लो वाली नई canary टेस्ट स्क्रिप्ट जल्दी बनाने की अनुमति देता है। रिकॉर्डिंग के दौरान किए गए टाइप और क्लिक एक्शन को एक Node.js स्क्रिप्ट में परिवर्तित किया जाता है जिसका उपयोग आप canary बनाने के लिए कर सकते हैं। CloudWatch Synthetics Recorder की ज्ञात सीमाएं [इस पेज](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries_Recorder.html#CloudWatch_Synthetics_Canaries_Recorder-limitations) पर नोट की गई हैं।

### एग्रीगेट मेट्रिक्स देखना

अपनी canary स्क्रिप्ट के फ्लीट से एकत्रित एग्रीगेट मेट्रिक्स पर आउट-ऑफ-द-बॉक्स रिपोर्टिंग का लाभ उठाएं। CloudWatch Automatic Dashboard

![Synthetics के लिए CloudWatch डैशबोर्ड](../images/synthetics1.png)

## Canary बनाना

### ब्लूप्रिंट

कई canary प्रकारों के लिए सेटअप प्रक्रिया को सरल बनाने के लिए [canary ब्लूप्रिंट](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries_Blueprints.html) का उपयोग करें।

![Synthetics canary बनाने के कई तरीके](../images/synthetics2.png)

:::info
    ब्लूप्रिंट canary लिखना शुरू करने का एक सुविधाजनक तरीका है और सरल उपयोग मामलों को बिना कोड के कवर किया जा सकता है।
:::
### रखरखाव

जब आप अपने canary लिखते हैं, तो वे एक *रनटाइम वर्जन* से जुड़े होते हैं। यह Selenium के साथ Python, या Puppeteer के साथ JavaScript का एक विशिष्ट संस्करण होगा। हमारे वर्तमान में समर्थित रनटाइम संस्करणों और उन संस्करणों की सूची के लिए [यह पेज] देखें जो deprecated हैं।

:::info
    अपनी स्क्रिप्ट की रखरखाव में सुधार करने के लिए [environment variables का उपयोग](https://aws.amazon.com/blogs/mt/using-environment-variables-with-amazon-cloudwatch-synthetics/) करके डेटा साझा करें जिसे canary के निष्पादन के दौरान एक्सेस किया जा सकता है।
:::

:::info
    उपलब्ध होने पर अपने canary को नवीनतम रनटाइम वर्जन में अपग्रेड करें।
:::
### स्ट्रिंग सीक्रेट्स

आप अपने canary को अपने canary या इसके environment variables के बाहर एक सुरक्षित सिस्टम से सीक्रेट्स (जैसे लॉगिन क्रेडेंशियल) खींचने के लिए कोड कर सकते हैं। कोई भी सिस्टम जो AWS Lambda द्वारा पहुंच योग्य है, संभावित रूप से रनटाइम पर आपके canary को सीक्रेट्स प्रदान कर सकता है।

:::info
    AWS Secrets Manager का उपयोग करके डेटाबेस कनेक्शन विवरण, API की, और एप्लिकेशन क्रेडेंशियल जैसे सीक्रेट्स संग्रहीत करके अपने परीक्षण निष्पादित करें और [संवेदनशील डेटा सुरक्षित करें](https://aws.amazon.com/blogs/mt/secure-monitoring-of-user-workflow-experience-using-amazon-cloudwatch-synthetics-and-aws-secrets-manager/)।
:::
## स्केल पर Canary प्रबंधित करना

### टूटे लिंक की जांच करें
:::info
    यदि आपकी वेबसाइट में डायनामिक कंटेंट और लिंक की उच्च-मात्रा है, तो आप अपनी वेबसाइट को क्रॉल करने, [टूटे लिंक का पता लगाने](https://aws.amazon.com/blogs/mt/cloudwatch-synthetics-to-find-broken-links-on-your-website/), और विफलता का कारण खोजने के लिए CloudWatch Synthetics का उपयोग कर सकते हैं। फिर एक विफलता थ्रेशोल्ड का उपयोग करके वैकल्पिक रूप से एक CloudWatch Alarm बनाएं जब एक विफलता थ्रेशोल्ड का उल्लंघन हो।
:::
### मल्टीपल हार्टबीट URL

:::info
    एक एकल हार्टबीट मॉनिटरिंग canary टेस्ट में [कई URL को बैच करके](https://aws.amazon.com/blogs/mt/simplify-your-canary-by-batching-multiple-urls-in-amazon-cloudwatch-synthetics/) अपने परीक्षण को सरल बनाएं और लागत अनुकूलित करें। फिर आप canary रन रिपोर्ट के स्टेप सारांश में प्रत्येक URL की स्थिति, अवधि, संबंधित स्क्रीनशॉट, और विफलता कारण देख सकते हैं।
:::
### ग्रुप में व्यवस्थित करें

:::info
    एग्रीगेट मेट्रिक्स देखने और विफलताओं को अधिक आसानी से अलग और ड्रिल करने के लिए अपने canary को [ग्रुप](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Groups.html) में व्यवस्थित और ट्रैक करें।
:::
![ग्रुप में canary व्यवस्थित और ट्रैक करें](../images/synthetics3.png)

:::warning
    ध्यान दें कि यदि आप क्रॉस-रीजन ग्रुप बना रहे हैं तो ग्रुप को canary का *सटीक* नाम चाहिए।
:::
## रनटाइम विकल्प

### संस्करण और समर्थन

CloudWatch Synthetics वर्तमान में स्क्रिप्ट के लिए Node.js और [Puppeteer](https://github.com/puppeteer/puppeteer) फ्रेमवर्क का उपयोग करने वाले रनटाइम, और स्क्रिप्टिंग के लिए Python और [Selenium WebDriver](https://www.selenium.dev/documentation/webdriver/) फ्रेमवर्क का उपयोग करने वाले रनटाइम का समर्थन करता है।

:::info
    नवीनतम सुविधाओं और Synthetics लाइब्रेरी में किए गए अपडेट का उपयोग करने में सक्षम होने के लिए हमेशा अपने canary के लिए सबसे हाल के रनटाइम वर्जन का उपयोग करें।
:::
CloudWatch Synthetics आपको ईमेल द्वारा सूचित करता है यदि आपके पास ऐसे canary हैं जो [रनटाइम का उपयोग करते हैं जो अगले 60 दिनों में deprecated होने वाले हैं](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries_Library.html#CloudWatch_Synthetics_Canaries_runtime_support)।

### कोड सैंपल

[Node.js और Puppeteer](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries_Samples.html#CloudWatch_Synthetics_Canaries_Samples_nodejspup) और [Python और Selenium](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries_Samples.html#CloudWatch_Synthetics_Canaries_Samples_pythonsel) दोनों के लिए कोड सैंपल के साथ शुरू करें।

### Selenium के लिए इम्पोर्ट

स्क्रैच से या न्यूनतम परिवर्तनों के साथ मौजूदा स्क्रिप्ट आयात करके [Python और Selenium](https://aws.amazon.com/blogs/mt/create-canaries-in-python-and-selenium-using-amazon-cloudwatch-synthetics/) में canary बनाएं।
