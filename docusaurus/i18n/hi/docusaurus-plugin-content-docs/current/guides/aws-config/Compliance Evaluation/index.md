---
sidebar_position: 3
---
# अनुपालन मूल्यांकन

AWS Config आपके AWS वातावरण के भीतर संसाधन कॉन्फ़िगरेशन का मूल्यांकन करने के लिए दो प्रमुख प्रकार के नियम प्रदान करता है। पहला प्रकार, [Managed Rules](https://docs.aws.amazon.com/config/latest/developerguide/managed-rules-by-aws-config.html), AWS द्वारा प्रदान किए गए पूर्व-निर्मित नियम हैं, जो विभिन्न सुरक्षा, परिचालन और अनुपालन उपयोग मामलों को कवर करते हैं। Managed Rules पूर्व-कॉन्फ़िगर किए गए नियम टेम्पलेट हैं जो आपके AWS संसाधनों का सर्वोत्तम प्रथाओं और सामान्य अनुपालन मानकों के विरुद्ध मूल्यांकन करते हैं। दूसरा प्रकार [Custom Rules](https://docs.aws.amazon.com/config/latest/developerguide/evaluate-config_develop-rules.html), संगठनों को अपने स्वयं के नियम बनाने की अनुमति देता है जिससे वे संगठन-विशिष्ट अनुपालन आवश्यकताओं और जाँचों को लागू कर सकें।

Custom rules को AWS Lambda फ़ंक्शन के माध्यम से बनाया जा सकता है, जहाँ आप वह लॉजिक कोड करते हैं जो मूल्यांकन करता है कि आपके AWS संसाधन अनुपालन में हैं या नहीं। AWS Config [Guard Custom policy का उपयोग करके कस्टम नियम बनाने](https://aws.amazon.com/blogs/mt/announcing-aws-config-custom-rules-using-guard-custom-policy/) की भी अनुमति देता है। [Guard Custom policy](https://docs.aws.amazon.com/config/latest/developerguide/evaluate-config_develop-rules.html) कस्टम नियम बनाने की प्रक्रिया को सरल बनाता है क्योंकि आपको Lambda फ़ंक्शन बनाने की आवश्यकता नहीं होगी। Guard Custom policy आपको [Guard domain-specific language (DSL)](https://docs.aws.amazon.com/cfn-guard/latest/ug/writing-rules.html) का उपयोग करके परिभाषित पॉलिसी के विरुद्ध अपने संसाधन का मूल्यांकन करने के लिए policy-as-code परिभाषित करने देता है।

AWS Config मूल रूप से उपचारात्मक कार्यों के लिए [Systems Manager Automation documents](https://aws.amazon.com/blogs/mt/remediate-noncompliant-aws-config-rules-with-aws-systems-manager-automation-runbooks/) के साथ एकीकृत है। आप AWS Systems Manager Automation documents का उपयोग करके अपनी स्वयं की कस्टम उपचारात्मक कार्रवाइयाँ बना सकते हैं और AWS Config के माध्यम से मैनुअल या स्वचालित उपचार चुनने का विकल्प होगा।

इसके अतिरिक्त, AWS [Service-Linked Rules](https://docs.aws.amazon.com/config/latest/developerguide/service-linked-rules.html) भी प्रदान करता है, जो अन्य AWS सेवाओं द्वारा स्वचालित रूप से बनाए और प्रबंधित किए जाते हैं ताकि उन सेवाओं के लिए विशिष्ट संसाधन कॉन्फ़िगरेशन का मूल्यांकन किया जा सके। उदाहरण के लिए, AWS Security Hub सुरक्षा सर्वोत्तम प्रथाओं और मानकों का मूल्यांकन करने के लिए AWS Config में service-linked rules बना सकता है। आप [Organization Rules](https://docs.aws.amazon.com/config/latest/developerguide/config-rule-multi-account-deployment.html) भी तैनात कर सकते हैं, जो आपको अपने AWS Organizations संरचना में कई खातों में नियमों को तैनात और प्रबंधित करने की अनुमति देते हैं, जिससे आपके संपूर्ण AWS वातावरण में लगातार अनुपालन बनाए रखना आसान हो जाता है।

### Conformance Packs:

Managed rules या custom rules को व्यक्तिगत रूप से विशिष्ट क्षेत्रों और खातों में तैनात करने के बजाय, एक सर्वोत्तम प्रथा यह है कि उन्हें [Conformance Packs](https://docs.aws.amazon.com/config/latest/developerguide/conformance-packs.html) में बंडल करें। AWS Conformance Packs कई खातों और क्षेत्रों में सैकड़ों नियमों को तैनात और मॉनिटर करने के लिए नियंत्रण का एक बिंदु प्रदान करते हैं, जो बड़े पैमाने पर लगातार सुरक्षा और अनुपालन मानकों को सुनिश्चित करते हैं। वे सामान्य फ्रेमवर्क (जैसे HIPAA, NIST, PCI-DSS) के लिए [पूर्व-निर्मित टेम्पलेट](https://docs.aws.amazon.com/config/latest/developerguide/conformancepack-sample-templates.html) प्रदान करते हैं और कस्टम नियम निर्माण की अनुमति देते हैं, जो अनुपालन प्रबंधन के लिए आवश्यक समय और प्रयास को काफी कम करते हैं। ये पैक Config नियमों के अपरिवर्तनीय समूहों का प्रतिनिधित्व करते हैं, यह सुनिश्चित करते हैं कि परिवर्तन केवल conformance pack में औपचारिक अपडेट के माध्यम से किए जा सकते हैं। यह दृष्टिकोण आपके अनुपालन नियमों पर बेहतर शासन और नियंत्रण प्रदान करता है।


#### संगठनात्मक तैनाती:

AWS आपको अपने AWS Organization में स्वचालित तैनाती के लिए organizational conformance packs का लाभ उठाने में सक्षम बनाता है। यह क्षमता conformance packs और individual Config rules दोनों तक फैली हुई है। AWS Config delegated administrator कार्यक्षमता का भी समर्थन करता है, जो आपको अपने संगठन में conformance pack तैनाती के प्रबंधन के लिए एक विशिष्ट खाता नामित करने की अनुमति देता है। अपरिवर्तनीयता जैसे लाभों को बनाए रखते हुए [delegated admin का उपयोग करके conformance packs तैनात करने के लिए इस दस्तावेज़ का पालन करें](https://aws.amazon.com/blogs/mt/deploy-aws-config-rules-and-conformance-packs-using-a-delegated-admin/)


### AWS Config Rules Development Kit (RDK)

AWS Config [Rules Development Kit](https://github.com/awslabs/aws-config-rdk) (RDK), AWS samples GitHub रिपॉजिटरी में उपलब्ध, कस्टम Config rules के निर्माण को सुव्यवस्थित करता है। यह बॉयलरप्लेट कोड टेम्पलेट प्रदान करता है जिन्हें संसाधन मूल्यांकन लागू करने के लिए न्यूनतम संशोधन की आवश्यकता होती है। RDK विभिन्न तैनाती परिदृश्यों का समर्थन करता है, जिसमें ऊपर उल्लिखित केंद्रीकृत Lambda function दृष्टिकोण शामिल है।

AWS Config RDK का उपयोग करके [बड़े पैमाने पर कस्टम AWS Config नियम बनाने और संचालित करने](https://aws.amazon.com/blogs/mt/aws-config-rule-development-kit-library-build-and-operate-rules-at-scale/) के लिए कृपया इस ब्लॉग को देखें।

#### Lambda Functions का केंद्रीकरण

बहु-खाता वातावरण में जहाँ कई कस्टम नियमों की आवश्यकता होती है, एक ही खाते (जैसे सुरक्षा या अनुपालन खाता) में Lambda functions को केंद्रीकृत करने की अनुशंसा की जाती है। अन्य खातों के कस्टम नियम फिर इन केंद्रीकृत functions को आमंत्रित कर सकते हैं।

### Global Resource प्रबंधन

Global resources (जैसे IAM नियम) का मूल्यांकन करने वाले नियमों के लिए, डुप्लीकेट लागत और अनावश्यक API कॉल से बचने के लिए उन्हें केवल एक क्षेत्र में तैनात करें। यह प्रथा प्रभावी अनुपालन निगरानी बनाए रखते हुए लागत दक्षता और संसाधन उपयोग दोनों को अनुकूलित करती है।


### मूल्यांकन प्रबंधन

Rule मूल्यांकन प्रबंधित करते समय, मूल्यांकन परिणामों को हटाने या पुनर्मूल्यांकन ट्रिगर करने के विकल्पों के प्रति सावधान रहें। इन सुविधाओं का बार-बार उपयोग संसाधनों के लिए नए [configuration items](https://docs.aws.amazon.com/config/latest/APIReference/API_ConfigurationItem.html) उत्पन्न करेगा, जो संभावित रूप से स्टोरेज और प्रोसेसिंग आवश्यकताओं को प्रभावित कर सकता है।



## क्रॉस-अकाउंट एग्रीगेशन और क्वेरीइंग

जैसे-जैसे संगठन कई क्षेत्रों और खातों में AWS Config सक्षम करते हैं, व्यापक दृश्यता और प्रबंधन के लिए डेटा को केंद्रीकृत करना महत्वपूर्ण हो जाता है। [AWS Config Aggregators](https://docs.aws.amazon.com/config/latest/developerguide/aggregate-data.html) विभिन्न क्षेत्रों और खातों से कॉन्फ़िगरेशन-संबंधित डेटा को एक एकल, निर्दिष्ट aggregator खाते में समेकित करने के लिए एक मुफ्त सुविधा प्रदान करते हैं। यह केंद्रीकरण आपके AWS वातावरण का एकीकृत दृश्य प्रदान करता है, जो आपके संगठन में Config rule मूल्यांकन, conformance pack आकलन, और समग्र अनुपालन स्थिति की आसान निगरानी को सक्षम बनाता है। संगठन-व्यापी aggregator तैनात करने के लिए, [कृपया इस ब्लॉग का पालन करें](https://aws.amazon.com/blogs/mt/org-aggregator-delegated-admin/)।

केंद्रीय खाते में यह एग्रीगेटेड डेटा [उन्नत क्वेरीइंग](https://docs.aws.amazon.com/config/latest/developerguide/querying-AWS-resources.html) क्षमताओं को अनलॉक करता है। यह सुविधा आपको अपने AWS वातावरण में जटिल क्वेरी करने की अनुमति देती है, जो संसाधन कॉन्फ़िगरेशन और अनुपालन स्थितियों में अंतर्दृष्टि प्रदान करती है। उदाहरण के लिए, आप एक सरल SQL-जैसी सिंटैक्स का उपयोग करके अपने खातों में सभी अनअटैच्ड EBS volumes की आसानी से पहचान कर सकते हैं। ये उन्नत क्वेरी परिचालन और अनुपालन-संबंधित दोनों डेटा प्रदान करती हैं, जो आपके AWS बुनियादी ढाँचे को प्रभावी ढंग से प्रबंधित और अनुकूलित करने की आपकी क्षमता को बढ़ाती हैं।

S3 में [AWS Config configuration snapshot data](https://docs.aws.amazon.com/config/latest/developerguide/deliver-snapshot-cli.html) को [Amazon Athena](https://aws.amazon.com/athena/) का उपयोग करके क्वेरी किया जा सकता है और ग्राहक [Amazon QuickSight](https://aws.amazon.com/quicksight) का उपयोग करके कस्टम विज़ुअलाइज़ेशन बना सकते हैं। AWS Config डेटा को एग्रीगेट करने, उन्नत क्वेरी करने, और अनुकूलित इन्वेंट्री डैशबोर्ड बनाने का तरीका जानने के लिए, [कृपया AWS Config के साथ निगरानी कार्यशाला का पालन करें](https://catalog.workshops.aws/cloudops-accelerator/en-US/inventory/monitoring-resources-with-aws-config)। कृपया [AWS Config Resource Compliance Dashboard](https://catalog.workshops.aws/awscid/en-US/dashboards/additional/config-resource-compliance-dashboard#aws-config-aggregator-dashboard) पर कार्यशाला भी देखें जो आपको दिखाती है कि कैसे [AWS Organizations पर AWS Config डैशबोर्ड तैनात करें](https://catalog.workshops.aws/awscid/en-US/dashboards/additional/config-resource-compliance-dashboard#aws-config-aggregator-dashboard)।
