---
sidebar_position: 1
---
# AWS Config का संचालन

### **सभी खातों में सभी क्षेत्रों में AWS Config सक्षम करें**

कई AWS खाते चलाने वाले ग्राहकों के लिए, हम अनुशंसा करते हैं कि AWS Config को आपके संपूर्ण संगठन में लागू करें। AWS Config एक क्षेत्र-विशिष्ट सेवा है, इसलिए आपको इसे प्रत्येक उस क्षेत्र में सक्षम करना होगा जहाँ आप संसाधन कॉन्फ़िगरेशन परिवर्तनों और अनुपालन मूल्यांकन को ट्रैक करना चाहते हैं। आप ऐसा तीन तरीकों से कर सकते हैं:


1. CloudFormation StackSets का उपयोग:
    [CloudFormation StackSets](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/what-is-cfnstacksets.html) कई क्षेत्रों और खातों में एक साथ AWS Config सक्षम करने, आपके संगठन में configuration recorder तैनात करने, और सभी खातों में लगातार सेटिंग्स बनाए रखने के लिए पूर्व-निर्मित टेम्पलेट प्रदान करता है। CloudFormation का उपयोग करके अपने संगठन में AWS Config तैनात करने के लिए, कृपया [इस ब्लॉग का पालन करें](https://aws.amazon.com/blogs/mt/managing-aws-organizations-accounts-using-aws-config-and-aws-cloudformation-stacksets/)।
2. AWS Systems Manager Quick Setup का उपयोग:
     [AWS Systems Manager Quick Setup](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-quick-setup.html) आपके संपूर्ण संगठन में Config recorder सक्षम करने का एक सुव्यवस्थित तरीका प्रदान करता है। Systems Manager Quick Setup का उपयोग करके अपने संगठन में AWS Config तैनात करने के लिए, कृपया [इस ब्लॉग का पालन करें](https://aws.amazon.com/blogs/mt/managing-configuration-compliance-across-your-organization-with-aws-systems-manager-quick-setup/)।
3. AWS Control Tower:
    [AWS Control Tower](https://aws.amazon.com/controltower/) एक केंद्रीय स्थान से कई AWS खातों को सुरक्षित रूप से सेट अप और प्रबंधित करने में आपकी मदद करता है। सक्षम होने पर, Control Tower स्वचालित रूप से सभी नामांकित खातों में AWS Config को सक्रिय करता है। AWS Control Tower के साथ शुरू करने के लिए, कृपया [AWS Control Tower Getting Started सार्वजनिक दस्तावेज़](https://docs.aws.amazon.com/controltower/latest/userguide/getting-started-with-control-tower.html) देखें।



### AWS Config recorder सेटिंग्स

AWS Config recorder सेटिंग्स कॉन्फ़िगर करते समय, एक महत्वपूर्ण सर्वोत्तम प्रथा यह है कि [सभी संसाधन प्रकारों](https://docs.aws.amazon.com/config/latest/developerguide/select-resources.html) के लिए ट्रैकिंग सक्षम करें। सभी संसाधनों को सक्षम करने का अतिरिक्त लाभ यह है कि Config ट्रैकिंग के लिए उपलब्ध होने पर नई AWS सेवाओं के संसाधन प्रकारों का स्वचालित समावेश होता है, जो बिना मैनुअल हस्तक्षेप के यह सुनिश्चित करता है कि आपका कॉन्फ़िगरेशन प्रबंधन वर्तमान रहे।
[Global resources](https://docs.aws.amazon.com/config/latest/developerguide/select-resources.html#select-resources-global) के संबंध में, जैसे [IAM](https://aws.amazon.com/iam/), केवल एक क्षेत्र में रिकॉर्डिंग सक्षम करना महत्वपूर्ण है (AWS Config को ग्राहक के होम या मुख्य क्षेत्र में सक्षम किया जाना चाहिए)। यह कॉन्फ़िगरेशन दो उद्देश्यों को पूरा करता है: यह डुप्लीकेट configuration items को रोकता है और अनावश्यक लागतों से बचने में मदद करता है। यदि आप कई क्षेत्रों में global resource recording सक्षम करते हैं, तो आपको अनावश्यक कॉन्फ़िगरेशन ट्रैकिंग का सामना करना पड़ेगा और एक ही global resources की कई बार निगरानी के लिए अतिरिक्त खर्च उठाना पड़ेगा। उदाहरण के लिए, IAM users, roles, और policies को ट्रैक करते समय, आपको global resource recording के लिए एक प्राथमिक क्षेत्र (जैसे us-east-1) नामित करना चाहिए और अन्य सभी क्षेत्रों में इस सुविधा को अक्षम करना चाहिए।


### Delivery Method सर्वोत्तम प्रथाएँ

AWS कॉन्फ़िगरेशन प्रबंधन लागू करते समय, configuration items के लिए उचित delivery methods स्थापित करना महत्वपूर्ण है। एक अनुशंसित सर्वोत्तम प्रथा यह है कि एक केंद्रीय खाते के भीतर एक केंद्रीकृत [Amazon S3 bucket](https://aws.amazon.com/pm/serv-s3/) निर्दिष्ट करें, जो एक लॉगिंग खाता या अन्य विशेष रूप से निर्दिष्ट खाता हो सकता है। यह केंद्रीकरण configuration item लॉग के बेहतर संगठन और प्रबंधन की अनुमति देता है। बकेट के भीतर स्पष्ट संगठन बनाए रखने के लिए, एक संरचित prefix प्रणाली लागू करने की सलाह दी जाती है जो प्रत्येक configuration item के लिए स्रोत खाता और क्षेत्र को स्पष्ट रूप से पहचानती है। कृपया S3 bucket के लिए [सुरक्षा सर्वोत्तम प्रथाएँ](https://docs.aws.amazon.com/AmazonS3/latest/userguide/security-best-practices.htm) भी लागू करें जैसे: ट्रांज़िट और आराम में एन्क्रिप्शन सक्षम करना, सार्वजनिक पहुँच अक्षम करना, और सख्त पहुँच नियंत्रण बनाए रखना। ये सुरक्षा उपाय डेटा सुरक्षा मानकों के अनुपालन को सुनिश्चित करते हैं और सुरक्षा जोखिमों को कम करते हैं।

आप कॉन्फ़िगरेशन परिवर्तनों और अनुपालन स्थिति अपडेट को एक निर्दिष्ट SNS topic पर स्वचालित रूप से स्ट्रीम करने के लिए AWS Config कॉन्फ़िगर कर सकते हैं। कई AWS खातों वाले एंटरप्राइज़ वातावरण के लिए, आप इन सूचनाओं को समेकित करने के लिए एक केंद्रीय SNS topic स्थापित करें। यह केंद्रीकृत दृष्टिकोण IT और सुरक्षा टीमों को संगठन भर में कॉन्फ़िगरेशन परिवर्तनों की कुशलतापूर्वक निगरानी करने और प्रतिक्रिया देने में सक्षम बनाता है। ऐसा करने के लिए, [कृपया इस दस्तावेज़ का पालन करें](https://docs.aws.amazon.com/config/latest/developerguide/notifications-for-AWS-Config.html)।



### AWS Config के लिए Delegated Admin

AWS Config के लिए एक delegated administrator एक AWS संगठन के भीतर एक निर्दिष्ट सदस्य खाता है जो संपूर्ण संगठन में कॉन्फ़िगरेशन सेटिंग्स प्रबंधित करने की अनुमतियाँ प्राप्त करता है। यह administrator AWS Config नियमों को तैनात और प्रबंधित कर सकता है, conformance packs को संभाल सकता है, और कई खातों से कॉन्फ़िगरेशन डेटा एग्रीगेट कर सकता है। उनके पास संगठन भर में संसाधन कॉन्फ़िगरेशन और अनुपालन स्थिति में दृश्यता होती है, जो केंद्रीकृत प्रबंधन और निगरानी को सक्षम बनाती है। [AWS Config संचालन और एग्रीगेशन के लिए delegated admin का उपयोग करने के लिए कृपया इस ब्लॉग का पालन करें](https://aws.amazon.com/blogs/mt/using-delegated-admin-for-aws-config-operations-and-aggregation/)।

AWS Config के लिए delegated administrator का उपयोग एक सर्वोत्तम प्रथा है क्योंकि यह management account की सुरक्षा करता है, इसके उपयोग को केवल आवश्यक संगठनात्मक कार्यों तक सीमित करते हुए AWS Config विशिष्ट प्रशासनिक कर्तव्यों को नामित सदस्य खातों को सौंपता है। यह दृष्टिकोण न्यूनतम विशेषाधिकार के सिद्धांत का पालन करता है, सुरक्षा जोखिमों को कम करता है, और नामित खातों में Config प्रबंधन को केंद्रीकृत करके बेहतर परिचालन नियंत्रण प्रदान करता है।
