---
sidebar_position: 2
---
# CloudTrail Trails

AWS CloudTrail आपके AWS बुनियादी ढाँचे में खाता गतिविधि की निगरानी और रिकॉर्ड करता है ताकि आपको स्टोरेज, विश्लेषण और उपचारात्मक कार्रवाइयों पर नियंत्रण प्रदान किया जा सके। एक trail एक कॉन्फ़िगरेशन है जो CloudTrail events को आपके द्वारा निर्दिष्ट Amazon Simple Storage Service (Amazon S3) bucket में वितरित करने में मदद करता है।

CloudTrail आपके AWS बुनियादी ढाँचे में खाता गतिविधि की निगरानी और रिकॉर्डिंग के लिए तीन प्रकार के trails प्रदान करता है। पहला प्रकार multi-Regional trail है जो सभी AWS Regions से गतिविधि कैप्चर करता है। डिफ़ॉल्ट रूप से, AWS Management Console के माध्यम से trail बनाते समय, यह सभी Regions पर लागू होता है। दूसरा प्रकार single-Region trail है, जो विशेष रूप से AWS CLI में उपलब्ध है, जो एक विशिष्ट Region में गतिविधि कैप्चर करता है। हालांकि, हम व्यापक कवरेज के लिए multi-Region trails का उपयोग करने की अनुशंसा करते हैं।

अंत में, organizational trail है जो AWS Organizations सेवा का उपयोग करते समय आपके संगठन के भीतर सभी AWS accounts पर लागू होता है। इस प्रकार का trail मल्टी-अकाउंट वातावरण में व्यापक कवरेज और केंद्रीकृत निगरानी प्रदान करता है।

इन trail प्रकारों का उपयोग करके, आप अपनी निगरानी और रिकॉर्डिंग आवश्यकताओं को पूरा करने के लिए अपने CloudTrail सेटअप को अनुकूलित कर सकते हैं। आप यह Regional स्तर पर या अपने संपूर्ण संगठन में कर सकते हैं। निम्नलिखित CloudTrail Trails के लिए कुछ सर्वोत्तम प्रथाएँ हैं।

### सभी AWS accounts और Regions में CloudTrail कॉन्फ़िगर करें

AWS accounts में किसी उपयोगकर्ता, role, या सेवा द्वारा की गई events का पूर्ण रिकॉर्ड प्राप्त करने के लिए, प्रत्येक trail को सभी AWS Regions में events लॉग करने के लिए कॉन्फ़िगर करें। इन trails को अपनी कंपनी या संगठन द्वारा उपयोग किए जाने वाले प्रत्येक AWS account में सेट करें। यह सेटअप सुनिश्चित करता है कि प्रत्येक event लॉग की जाती है, चाहे event किसी भी AWS Region में हुई हो। परिणामस्वरूप, आप अन्यथा अप्रयुक्त Regions में अप्रत्याशित गतिविधि का पता लगा सकते हैं। Global service events (उदाहरण के लिए, AWS Identity and Access Management और Amazon Route 53) भी शामिल और लॉग किए जाते हैं। यदि आप एक trail बनाते हैं जो सभी Regions पर लागू होता है, तो कोई भी नया AWS Region स्वचालित रूप से शामिल हो जाता है। यदि आपके पास AWS Organizations के माध्यम से मल्टी-अकाउंट सेटअप है, तो आप एक trail बना सकते हैं जो उस संगठन में सभी AWS accounts के लिए सभी events लॉग करता है।

### विभिन्न उपयोग मामलों के लिए अलग trails सेट करें

CloudTrail ऑडिटिंग, सुरक्षा निगरानी और परिचालन समस्या निवारण जैसे उपयोग मामलों का समर्थन करता है। AWS अनुशंसा करता है कि आप प्रत्येक उपयोग मामले के लिए कई trails सेट करें ताकि आप प्रत्येक टीम को आवश्यक ज्ञान प्रदान कर सकें। ऐसा करने के लिए, विभिन्न उपयोगकर्ताओं के प्रबंधन के लिए trails बनाएँ। Trails को अलग S3 buckets में log files वितरित करने के लिए कॉन्फ़िगर किया जा सकता है। उदाहरण के लिए, एक सुरक्षा administrator एक trail बना सकता है जो सभी Regions पर लागू होता है और एक AWS Key Management Service (AWS KMS) key के साथ log files एन्क्रिप्ट करता है, और log file validation सक्षम करता है। एक ही कंपनी में एक developer केवल एक Region पर लागू होने वाला trail बना सकता है और विशिष्ट API गतिविधि की सूचनाएँ प्राप्त करने के लिए Amazon CloudWatch alarms कॉन्फ़िगर कर सकता है।

### सीमित पहुँच के साथ अलग सुरक्षा सीमा में S3 bucket में CloudTrail logs वितरित करने के लिए कॉन्फ़िगर करें (एक अलग AWS account)

ऑडिटिंग उद्देश्यों के लिए, जब आप एक अलग प्रशासनिक डोमेन में एक समर्पित S3 bucket में log files संग्रहीत करते हैं, तो आप सख्त सुरक्षा नियंत्रण और कर्तव्यों का पृथक्करण लागू कर सकते हैं। इस S3 bucket तक पहुँच को प्रतिबंधित करने से logs तक अनधिकृत और अनियंत्रित पहुँच की संभावना कम हो जाएगी। जब आपके पास ये नियंत्रण मौजूद हों, तो यदि कोई AWS account credentials समझौता हो जाती हैं, तो logs खोए नहीं जाएंगे क्योंकि वे एक अलग डोमेन में संग्रहीत हैं।

### Log files संग्रहीत करने वाले Amazon S3 Bucket पर MFA-delete और versioning सक्षम करें

इस S3 bucket पर multi-factor authentication (MFA) कॉन्फ़िगर होने के साथ, आप यह सुनिश्चित कर सकते हैं कि bucket या bucket में किसी object को स्थायी रूप से हटाने के लिए अतिरिक्त authentication आवश्यक है। MFA के अतिरिक्त, versioning-सक्षम buckets आपको आकस्मिक deletion या overwrite से objects पुनर्प्राप्त करने में मदद कर सकते हैं। उदाहरण के लिए, यदि आप कोई object हटाते हैं, तो Amazon S3 object को स्थायी रूप से हटाने के बजाय एक delete marker डालता है। भले ही अधिकांश AWS उपयोगकर्ताओं और admins का कोई दुर्भावनापूर्ण इरादा नहीं है, कोई गलती से महत्वपूर्ण log files संग्रहीत करने वाला S3 bucket हटा सकता है। जब आप ये सुरक्षाएँ जोड़ते हैं, तो आप समझौता की गई log files के जोखिम को कम कर सकते हैं।

### CloudTrail log file integrity validation सक्षम करें

CloudTrail log file integrity validation आपको बताता है कि क्या कोई log file हटाई गई या बदली गई है। आप इस validation का उपयोग यह पुष्टि करने के लिए भी कर सकते हैं कि किसी दिए गए अवधि के दौरान आपके खाते में कोई log files वितरित नहीं की गईं। ये अंतर्दृष्टि सुरक्षा और फोरेंसिक जाँच में मूल्यवान हैं। वे log files की अखंडता सुनिश्चित करने के लिए सुरक्षा की एक अतिरिक्त परत प्रदान करती हैं। CloudTrail log file integrity validation उद्योग मानक algorithms का उपयोग करता है: hashing के लिए SHA-256 और digital signing के लिए SHA-256 with RSA, जो बिना पता लगाए log files को संशोधित करना कम्प्यूटेशनल रूप से अव्यवहार्य बनाता है।

### CloudTrail log files को rest पर encrypt करें

डिफ़ॉल्ट रूप से, CloudTrail द्वारा आपके bucket में वितरित log files Amazon server-side encryption with Amazon S3-managed encryption keys (SSE-S3) द्वारा एन्क्रिप्ट की जाती हैं। सीधे प्रबंधनीय सुरक्षा परत प्रदान करने के लिए, आप इसके बजाय अपनी CloudTrail log files के लिए server-side encryption with AWS KMS-managed keys (SSE-KMS) का उपयोग कर सकते हैं।

### Trails के लिए data events चालू करें

Data events S3 और AWS Lambda में किए गए resource operations में दृश्यता प्रदान करते हैं। ये events data plane operations के रूप में भी जाने जाते हैं। Data events अक्सर उच्च-मात्रा वाली गतिविधियाँ होती हैं, विशेष रूप से यदि आप S3 पर संवेदनशील डेटा संग्रहीत कर रहे हैं या Lambda functions के माध्यम से प्रमुख व्यावसायिक संचालन हो रहे हैं। संवेदनशील डेटा तक किसी भी अप्रत्याशित पहुँच में दृश्यता आपको अपने डेटा की सुरक्षा के लिए सुधारात्मक कार्रवाई करने देती है। क्योंकि कुछ अनुपालन रिपोर्ट (उदाहरण के लिए, FedRAMP और PCI-DSS) के लिए data events चालू करना आवश्यक है, AWS अनुशंसा करता है कि आप AWS Config managed rules या उपयुक्त Conformance Pack Sample Templates का उपयोग करके यह जाँचें कि कम से कम एक trail सभी S3 buckets के लिए S3 data events लॉग कर रहा है।

### Data events के साथ advanced event selectors का उपयोग करें

जब आप data events का उपयोग करते हैं, तो advanced event selectors data event logging का अधिक बारीक नियंत्रण प्रदान करते हैं। Advanced event selectors के साथ, आप EventSource, EventName, और ResourceARN जैसे fields पर values शामिल या बहिष्कृत कर सकते हैं। Advanced event selectors regular expressions के समान, आंशिक strings पर pattern matching के साथ values शामिल या बहिष्कृत करने का भी समर्थन करते हैं। यह आपको इस पर अधिक नियंत्रण प्रदान करता है कि आप कौन से CloudTrail data events लॉग करना और भुगतान करना चाहते हैं। उदाहरण के लिए, आप S3 DeleteObject APIs लॉग कर सकते हैं ताकि आपको प्राप्त होने वाले CloudTrail events को केवल विनाशकारी कार्रवाइयों तक सीमित किया जा सके, लागत को नियंत्रित करते हुए सुरक्षा मुद्दों की पहचान करने के लिए। ध्यान रखें कि जब आप ऑडिटिंग के लिए CloudTrail का उपयोग करते हैं, तो सभी data events रिकॉर्ड करना एक सर्वोत्तम प्रथा है। हालांकि, जब आप परिचालन निगरानी या अन्य उपयोग मामलों के लिए data events का उपयोग करते हैं, तो advanced event selectors बहुत सहायक हो सकते हैं।

### CloudTrail को Amazon CloudWatch Logs के साथ एकीकृत करें

Amazon CloudWatch आपको logs, metrics, और events के रूप में निगरानी और परिचालन डेटा एकत्र करने में मदद करता है। जब आप CloudTrail को CloudWatch Logs के साथ एकीकृत करते हैं, तो आप CloudTrail द्वारा कैप्चर किए गए विशिष्ट events के लिए लगभग रीयल टाइम में निगरानी और alerts प्राप्त कर सकते हैं। उदाहरण के लिए, आप असामान्य AWS API गतिविधि के लिए alarms और notifications सेट कर सकते हैं।

जब आप CloudTrail को CloudWatch Logs के साथ एकीकृत करते हैं, तो आप CloudWatch Insights द्वारा उत्पादित डेटा को भी विज़ुअलाइज़ कर सकते हैं। ये insights आपको आवश्यक डेटा निकालने की अनुमति देती हैं, जो querying की प्रक्रिया को सरल बनाती है। उदाहरण के लिए, आप लगभग रीयल टाइम में Amazon Elasticsearch Service में logs को stream करने के लिए CloudWatch Logs का उपयोग कर सकते हैं, और फिर डेटा विज़ुअलाइज़ करने के लिए Kibana endpoint एक्सेस कर सकते हैं।

### सभी Regions पर Trails लागू करें
अपने AWS account में IAM identity या सेवा द्वारा किए गए सभी actions कैप्चर करने के लिए, प्रत्येक trail को सभी Regions में events लॉग करने के लिए कॉन्फ़िगर करें। सभी Regions में events लॉग करके, आप सुनिश्चित करते हैं कि आपके AWS account में होने वाले सभी events लॉग किए जाते हैं, चाहे वे किसी भी Region में हुए हों।

### CloudTrail logs को केंद्रीय S3 bucket में वितरित करें
CloudTrail logs को सीमित पहुँच के साथ एक अलग AWS account में एक केंद्रीय S3 bucket में वितरित करने के लिए कॉन्फ़िगर करें। आप logs तक पहुँच सकने वालों की अनुमतियों को सीमित करने के लिए Amazon S3 access policy परिभाषित कर सकते हैं। यह logs तक अनधिकृत पहुँच को कम करने में मदद कर सकता है।

### Log files संग्रहीत करने वाले S3 bucket पर data protection कॉन्फ़िगर करें
ऐसा करने के लिए, निम्नलिखित कार्य करें:

*   S3 bucket में सुरक्षा का एक अतिरिक्त स्तर जोड़ने के लिए multi-factor authentication (MFA) चालू करें। MFA को bucket या bucket में objects हटाने के किसी भी अनुरोध के लिए authentication के दो रूपों की आवश्यकता होती है।
*   अवांछित deletions या changes से objects पुनर्प्राप्त करने में मदद करने के लिए S3 bucket पर versioning चालू करें। सुरक्षा की इस अतिरिक्त परत को जोड़ने से आपकी फ़ाइलों में परिवर्तन के जोखिम को कम करने में मदद मिल सकती है।
*   अपने S3 bucket में वितरित log files को encrypt करने के लिए अतिरिक्त सुरक्षा जोड़ने के लिए CloudTrail log files के लिए encryption चालू करें।
*   यह सुनिश्चित करने के लिए log file validation कॉन्फ़िगर करें कि CloudTrail द्वारा वितरित log files वितरित होने के बाद नहीं बदलीं।

### S3 bucket पर object lifecycle management कॉन्फ़िगर करें
CloudTrail का डिफ़ॉल्ट trail के लिए कॉन्फ़िगर किए गए S3 bucket में log files को अनिश्चित काल तक संग्रहीत करना है। आप अपनी व्यावसायिक और ऑडिटिंग आवश्यकताओं को बेहतर ढंग से पूरा करने के लिए अपनी स्वयं की retention policy परिभाषित करने के लिए Amazon S3 object lifecycle management rules का उपयोग कर सकते हैं। उदाहरण के लिए, आप 1 वर्ष से अधिक पुरानी log files को Amazon Simple Storage Service Glacier (Amazon S3 Glacier) जैसे भिन्न storage tier में archive करना चाह सकते हैं। एक अन्य उदाहरण एक निश्चित समय बीतने के बाद log files को हटाना है।

### AWSCloudTrail_FullAccess policy तक पहुँच सीमित करें
इस policy तक पहुँच सीमित करने के निम्नलिखित कारण हैं:

*   AWSCloudTrail_FullAccess policy वाले उपयोगकर्ता अपने AWS accounts में महत्वपूर्ण और significant ऑडिटिंग functions को अक्षम या पुनः कॉन्फ़िगर कर सकते हैं।
*   यह policy आपके AWS account में IAM identities के लिए व्यापक रूप से साझा या लागू करने के लिए अभिप्रेत नहीं है। इस policy के अनुप्रयोग को उन व्यक्तियों तक सीमित करें जिनसे आप AWS account administrators के रूप में कार्य करने की अपेक्षा करते हैं।
