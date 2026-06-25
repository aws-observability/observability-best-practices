---
sidebar_position: 4
---
# AWS Config लागत अनुकूलन

### मूल्य निर्धारण

[AWS Config मूल्य निर्धारण](https://aws.amazon.com/config/pricing/) मुख्य रूप से दो प्रमुख आयामों पर आधारित है:

1. Configuration Item रिकॉर्डिंग :

    * Continuous Recording
        आपके AWS एनवायरनमेंट में प्रत्येक कॉन्फ़िगरेशन परिवर्तन को रीयल-टाइम में निरंतर मॉनिटर और रिकॉर्ड करता है। यह सभी संसाधन संशोधनों में व्यापक दृश्यता प्रदान करता है, जिससे आप परिवर्तनों को होते ही ट्रैक और ऑडिट कर सकते हैं।
    * Periodic Recording
        आपके संसाधन कॉन्फ़िगरेशन के दैनिक स्नैपशॉट लेता है, केवल तब परिवर्तन रिकॉर्ड करता है जब वे पिछली 24-घंटे की स्थिति से भिन्न हों। यह दृष्टिकोण निरीक्षण और लागत दक्षता के बीच संतुलन प्रदान करता है, डेटा मात्रा को कम करते हुए महत्वपूर्ण परिवर्तनों को कैप्चर करता है।

1. Rule और Conformance Pack मूल्यांकन:
    AWS Config, config rule मूल्यांकन के लिए शुल्क लेता है, चाहे वे व्यक्तिगत हों या conformance pack का हिस्सा।

AWS Config मूल्य निर्धारण पर वर्तमान विवरण के लिए, [कृपया इस लिंक को देखें](https://aws.amazon.com/config/pricing/)।

जबकि उपरोक्त प्राथमिक मूल्य निर्धारण घटक हैं, अन्य कारक AWS Config उपयोग की कुल लागत को प्रभावित कर सकते हैं:

1. [AWS Lambda](https://aws.amazon.com/lambda/pricing/) लागत: यदि आप Lambda फ़ंक्शन के माध्यम से लागू किए गए कस्टम नियमों का उपयोग कर रहे हैं, तो मानक Lambda मूल्य निर्धारण लागू होता है।
2. [Amazon S3](https://aws.amazon.com/s3/pricing/) स्टोरेज: S3 में कॉन्फ़िगरेशन स्नैपशॉट और इतिहास फ़ाइलों को संग्रहीत करने के लिए लागत आती है।
3. डेटा ट्रांसफ़र: AWS सेवाओं या क्षेत्रों के बीच डेटा ट्रांसफ़र के लिए शुल्क लागू हो सकते हैं।



### लागत अनुकूलन अनुशंसाएँ

#### Config लागतों का एनालिसिस

[AWS Cost Explorer](https://aws.amazon.com/aws-cost-management/aws-cost-explorer/) सेवा उपयोग को फ़िल्टर करके और लागत आयामों का एनालिसिस करके AWS Config लागतों में अंतर्दृष्टि प्रदान करता है। ऐसा करने के लिए, अपने [Billing and Cost Management कंसोल](https://us-east-1.console.aws.amazon.com/costmanagement/home#/home) पर जाएँ और बाएँ पैनल से **Cost Explorer** चुनें। दाएँ पैनल से, अपने वांछित समय जैसे पैरामीटर कॉन्फ़िगर करें और आपको आवश्यक विस्तार के स्तर के आधार पर अपनी पसंदीदा ग्रैन्युलैरिटी (दैनिक या मासिक) चुनें। **Group by** अनुभाग के अंतर्गत **Dimensions** से **Usage Type** चुनें। **Filters** के अंतर्गत, **Service** पर जाएँ और **Config** चुनें।

![AWS Config लागत विज़ुअलाइज़ेशन](/img/cloudops/guides/config/configcost.png)

[Amazon CloudWatch](https://aws.amazon.com/cloudwatch/) की "ConfigurationItemsRecorded" मेट्रिक सबसे अधिक configuration items उत्पन्न करने वाले संसाधन प्रकारों की पहचान करने में सहायता करती है। कृपया [CloudWatch Metrics का उपयोग करके AWS Config Resource Changes का एनालिसिस कैसे करें](https://aws.amazon.com/blogs/mt/analyzing-aws-config-resource-changes-using-cloudwatch-metrics/) पर ब्लॉग देखें। विस्तृत एनालिसिस के लिए, [Amazon Athena](https://aws.amazon.com/athena/) का उपयोग [Cost and Usage Reports](https://aws.amazon.com/aws-cost-management/aws-cost-and-usage-reporting/) को [AWS CloudTrail](https://aws.amazon.com/cloudtrail/) और [CloudTrail Lake](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-lake.html) के साथ क्वेरी करने के लिए किया जा सकता है ताकि config recorder लागतों का अनुमान लगाने और अक्सर मूल्यांकन किए जाने वाले नियमों को ट्रैक करने में मदद मिल सके। कृपया [AWS Config Data का एनालिसिस करने के लिए Athena का उपयोग कैसे करें](https://aws.amazon.com/blogs/mt/use-amazon-athena-and-aws-cloudtrail-to-estimate-billing-for-aws-config-rule-evaluations/) पर ब्लॉग देखें।

लागत अलर्ट के लिए, [AWS Budgets](https://aws.amazon.com/aws-cost-management/aws-budgets/) के माध्यम से सक्रिय लागत प्रबंधन लागू करें जब लागत पूर्वनिर्धारित सीमाओं से अधिक हो जाए। साथ ही, [AWS Cost Anomaly Detection](https://aws.amazon.com/aws-cost-management/aws-cost-anomaly-detection/) सेवा असामान्य खर्च पैटर्न के लिए निरंतर निगरानी प्रदान करती है, जिससे लागत स्पाइक को जल्दी पहचानना और संबोधित करना आसान हो जाता है। आप [CloudWatch बिलिंग अलार्म](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/monitor_estimated_charges_with_cloudwatch.html) भी बना सकते हैं जो आपको सूचित करते हैं जब आपके अनुमानित शुल्क एक निर्धारित सीमा से अधिक हो जाते हैं।

#### Continuous और Periodic Recording के बीच चयन

AWS Config को लागू करते समय, उपयुक्त रिकॉर्डिंग विधि का चयन लागत और अनुपालन आवश्यकताओं को संतुलित करने के लिए महत्वपूर्ण है। [Continuous recording](https://docs.aws.amazon.com/config/latest/developerguide/config-concepts.html#continuous-recording) अक्सर स्थिर वर्कलोड के लिए अधिक लागत-प्रभावी होती है जहाँ संसाधन समय के साथ अपेक्षाकृत स्थिर रहते हैं। यह विकल्प विशेष रूप से उन एनवायरनमेंट्स के लिए अनुशंसित है जिनमें कड़ी सुरक्षा और अनुपालन आवश्यकताएँ हैं जो रीयल-टाइम निगरानी और कॉन्फ़िगरेशन परिवर्तनों में तत्काल दृश्यता की माँग करती हैं। महत्वपूर्ण बुनियादी ढाँचा घटक, जैसे प्रोडक्शन डेटाबेस, कोर नेटवर्किंग संसाधन, या संवेदनशील डेटा प्रोसेसिंग सिस्टम, आमतौर पर continuous recording से लाभान्वित होते हैं। दूसरी ओर, [periodic recording](https://docs.aws.amazon.com/config/latest/developerguide/config-concepts.html#periodic-recording) अत्यधिक गतिशील वर्कलोड के लिए अधिक किफायती हो सकती है, जैसे कंटेनरीकृत एनवायरनमेंट में अल्पकालिक संसाधन या बुनियादी ढाँचा जो बार-बार स्केल अप और डाउन होता है। उदाहरणों में auto-scaling groups का उपयोग करने वाले विकास एनवायरनमेंट, container orchestration प्लेटफ़ॉर्म, या अस्थायी परीक्षण एनवायरनमेंट शामिल हैं। हालांकि, यह ध्यान रखना महत्वपूर्ण है कि periodic recording केवल कम अनुपालन आवश्यकताओं वाले वर्कलोड के लिए लागू की जानी चाहिए, क्योंकि यह रीयल-टाइम के बजाय 24-घंटे के आधार पर अपडेट प्रदान करती है। साथ ही periodic recording में, प्रति configuration item वितरित लागत continuous recording की तुलना में अधिक है, इसलिए कुछ परिदृश्यों में, periodic recording की कुल लागत वास्तव में continuous recording से अधिक हो सकती है। इन रिकॉर्डिंग विधियों के बीच का चयन अक्सर विशिष्ट उपयोग मामलों से संरेखित होता है, जैसे परिचालन योजना जहाँ आवधिक स्नैपशॉट पर्याप्त हो सकते हैं, या अनुपालन ऑडिटिंग जहाँ निरंतर निगरानी आवश्यक है। ऑर्गनाइज़ेशन्स को यह निर्णय लेते समय अपनी सुरक्षा आवश्यकताओं, परिचालन पैटर्न और बजट बाधाओं का सावधानीपूर्वक मूल्यांकन करना चाहिए।


#### संसाधन बहिष्करण

AWS Config [संसाधन बहिष्करण](https://docs.aws.amazon.com/config/latest/developerguide/select-resources.html) क्षमता के माध्यम से लागत अनुकूलन प्रदान करता है, जो ऑर्गनाइज़ेशन्स को अपनी कॉन्फ़िगरेशन निगरानी लागतों का नीतिक रूप से प्रबंधन करने की अनुमति देता है। विशिष्ट संसाधन प्रकारों को बहिष्कृत करके जो आपके जोखिम प्रोफ़ाइल के लिए कम प्रासंगिक हैं या जो उच्च मात्रा में configuration items उत्पन्न करते हैं, आप आवश्यक सुरक्षा निगरानी बनाए रखते हुए लागतों को काफी कम कर सकते हैं। इस सुविधा को AWS Management Console और CLI में AWS Config सेटिंग्स के माध्यम से एक्सेस और कॉन्फ़िगर किया जा सकता है। हालांकि, आपको सावधानीपूर्वक विचार और उचित हितधारक भागीदारी के साथ संसाधन बहिष्करण का दृष्टिकोण रखना चाहिए। ऑर्गनाइज़ेशन्स को अपनी सुरक्षा और संचालन टीमों को शामिल करना चाहिए ताकि यह पूरी तरह से आकलन किया जा सके कि कौन से संसाधन निगरानी और अनुपालन आवश्यकताओं के लिए महत्वपूर्ण हैं, और कौन से सुरक्षित रूप से बहिष्कृत किए जा सकते हैं। लक्ष्य लागत दक्षता और मजबूत शासन मुद्रा बनाए रखने के बीच इष्टतम संतुलन बनाना है। उदाहरण के लिए, जबकि अस्थायी विकास संसाधन बहिष्करण के उम्मीदवार हो सकते हैं, महत्वपूर्ण प्रोडक्शन बुनियादी ढाँचे को आमतौर पर निरंतर निगरानी में रहना चाहिए। किसी भी बहिष्करण को लागू करने से पहले, [AWS की सुरक्षा बेस्ट प्रैक्टिसेज़](https://docs.aws.amazon.com/config/latest/developerguide/security-best-practices.html) की समीक्षा करने और [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/) से परामर्श करने की अनुशंसा की जाती है ताकि यह सुनिश्चित किया जा सके कि आपके निर्णय सुरक्षा और अनुपालन आवश्यकताओं के अनुरूप हैं। इसके अतिरिक्त, ऑर्गनाइज़ेशन्स को व्यवसाय की ज़रूरतों और सुरक्षा आवश्यकताओं के विकसित होने पर नियमित रूप से अपनी बहिष्करण नीतियों की समीक्षा करनी चाहिए।

यह ध्यान देने योग्य है कि [AWS Control Tower](https://aws.amazon.com/controltower/) वर्तमान में config recorder अनुकूलन का समर्थन नहीं करता है। हालांकि, Control Tower एनवायरनमेंट में AWS Config संसाधन ट्रैकिंग को अनुकूलित करने के लिए [इस ब्लॉग में उल्लिखित](https://aws.amazon.com/blogs/mt/customize-aws-config-resource-tracking-in-aws-control-tower-environment/) एक वर्कअराउंड उपलब्ध है जब तक मूल समर्थन नहीं जोड़ा जाता।


#### शीर्ष Configuration Items

कभी-कभी [AWS::Config::ResourceCompliance](https://docs.aws.amazon.com/config/latest/developerguide/view-compliance-history.html) अक्सर सबसे प्रभावशाली CI जनरेटर में से एक होता है, विशेष रूप से कई rule मूल्यांकन वाले ग्राहकों के लिए। यह संसाधन प्रकार AWS Config कंसोल में अनुपालन स्थिति का एक टाइमलाइन दृश्य प्रदान करता है। जबकि यह मूल्यवान अंतर्दृष्टि प्रदान करता है, यह configuration item लागतों को काफी बढ़ा सकता है, विशेष रूप से बड़े संसाधनों का मूल्यांकन करते समय। यदि ऐसा है, तो आप लागत कम करने के लिए इसके बहिष्करण पर विचार कर सकते हैं।

ऐतिहासिक अनुपालन जाँच के लिए, ग्राहक लागत-मुक्त विकल्प के रूप में CloudTrail डेटा का उपयोग कर सकते हैं। आपके ग्राहक Athena, तृतीय-पक्ष समाधानों के साथ काम करने के लिए नीचे दी गई क्वेरी को संशोधित कर सकते हैं, या यदि उन्होंने CloudTrail Lake सक्षम किया है तो उसमें इसका उपयोग कर सकते हैं।


```
SELECT
    eventTime,awsRegion, recipientAccountId, element_at(additionalEventData, 'configRuleName'
    ) as configRuleName, json_extract_scalar(json_array_get(element_at(requestParameters,'evaluations'
        ),0
        ),'$.complianceType'
    ) as Compliance, json_extract_scalar(json_array_get(element_at(requestParameters,'evaluations'
        ),0
        ),'$.complianceResourceType'
    ) as ResourceType, json_extract_scalar(json_array_get(element_at(requestParameters,'evaluations'
        ),0
        ),'$.complianceResourceId'
    ) as ResourceName
FROM
    $EDS_ID
WHERE
    eventName='PutEvaluations'
    and eventTime > '2022-03-17 00:00:00'
    AND eventTime < '2022-03-18 00:00:00'
    And json_extract_scalar(json_array_get(element_at(requestParameters,'evaluations'
        ),0
        ),'$.complianceType'
    ) IN ('COMPLIANT','NON_COMPLIANT')
```



#### AWS Config Indirect Relationship

AWS Config में दो प्रकार के संबंध हैं:
Direct Relationships:

* संसाधन के कॉन्फ़िगरेशन डेटा से निकाला गया सीधा A→B संबंध
* सीधे describe API कॉल से प्राप्त
* उदाहरण: Amazon EC2 इंस्टेंस और उसके security group के बीच का संबंध direct है क्योंकि security groups Amazon EC2 इंस्टेंस के describe API रिस्पॉन्स में शामिल होते हैं।

Indirect Relationships:

* पुराने संसाधन प्रकारों का कॉन्फ़िगरेशन कई संसाधनों के कॉन्फ़िगरेशन की जाँच करके रिकॉर्ड किया जा सकता है
* उदाहरण: security group और Amazon EC2 इंस्टेंस के बीच का संबंध indirect है क्योंकि security group का describe करने पर उससे जुड़े इंस्टेंस के बारे में कोई जानकारी नहीं मिलती। इस मामले में AWS Config दो configuration items बनाता है।

आप [इस लिंक में](https://docs.aws.amazon.com/config/latest/developerguide/faq.html) जान सकते हैं कि कौन से संसाधन indirect relationships का समर्थन करते हैं।

Indirect relationships से बाहर निकलने के लिए, हम अनुशंसा करते हैं कि आप अपने [Technical Account Manager](https://aws.amazon.com/premiumsupport/plans/enterprise/) से संपर्क करें।

#### Rule प्रबंधन और मूल्यांकन विचार

AWS Config नियमों का प्रबंधन करते समय, rule हटाने और पुनर्मूल्यांकन कार्रवाइयों पर विचार करें, क्योंकि ये लागतों को काफी प्रभावित कर सकते हैं। बड़ी संख्या में संसाधनों का मूल्यांकन करने वाले नियमों को हटाते समय, एक लागत-प्रभावी दृष्टिकोण यह है कि पहले [resource compliance recording](https://docs.aws.amazon.com/config/latest/developerguide/stop-start-recorder.html) को रोकें, फिर नियमों को हटाएँ, और अंत में compliance recording को पुनः शुरू करें। यह क्रिया आपके संग्रहीत डेटा को प्रभावित नहीं करेगी लेकिन recorder बंद रहने के दौरान संसाधन कॉन्फ़िगरेशन में आपकी दृश्यता को प्रभावित करेगी। यह अनुक्रमिक प्रक्रिया configuration item जनरेशन और संबंधित लागतों में अनावश्यक स्पाइक को रोकने में मदद करती है।

#### API कॉल अनुकूलन

कुशल API संचालन AWS Config लागतों को कम कर सकते हैं। संसाधनों को संशोधित करते समय, जैसे [EC2 इंस्टेंस](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/Using_Tags.html) में कई टैग जोड़ना, कई व्यक्तिगत कॉल करने के बजाय एक ही API कॉल में परिवर्तनों को समेकित करने की अनुशंसा की जाती है। उदाहरण के लिए, एक API कॉल में 10 टैग जोड़ना 10 अलग-अलग कॉल करने से अधिक कुशल है, क्योंकि प्रत्येक कॉल एक API परिवर्तन रिकॉर्ड और एक resource compliance configuration item दोनों उत्पन्न करती है।

#### Custom Rules और Lambda Function अनुकूलन

कस्टम नियम कार्यान्वयन के लिए, निष्पादन लागत कम करने हेतु Lambda फ़ंक्शन की तुलना में [CloudFormation Guard](https://docs.aws.amazon.com/cfn-guard/latest/ug/what-is-guard.html) का उपयोग करना पसंदीदा है। हालांकि, यदि Lambda-आधारित कस्टम नियम आवश्यक हैं, तो उन्हें इस प्रकार अनुकूलित करें:

* विशिष्ट लक्ष्यीकरण का उपयोग करके मूल्यांकित संसाधनों के दायरे को सीमित करें। Scope-आधारित नियम केवल event-आधारित मूल्यांकन के लिए समर्थित हैं, periodic के लिए नहीं
* बेहतर नियंत्रण के लिए संसाधन टैगिंग लागू करें
* हटाए गए संसाधनों के मूल्यांकन की समाप्ति को संभालने के लिए लॉजिक जोड़ें
* सभी संसाधनों का मूल्यांकन करने के बजाय संसाधन-विशिष्ट ट्रिगर का उपयोग करें

#### Conformance Pack और Rule डीडुप्लीकेशन

अनावश्यकता को समाप्त करने के लिए नियमों और [conformance packs](https://docs.aws.amazon.com/config/latest/developerguide/conformance-packs.html) का नियमित ऑडिटिंग आवश्यक है। उदाहरण के लिए, यदि कई conformance packs में वही नियम शामिल है (जैसे CloudTrail सक्षमता जाँच) जो पहले से [AWS Security Hub](https://aws.amazon.com/security-hub/) द्वारा मूल्यांकित किया जा रहा है, तो अनावश्यक मूल्यांकन लागतों से बचने के लिए डुप्लीकेट नियमों को हटाने पर विचार करें। प्रभावशीलता बनाए रखते हुए लागतों को अनुकूलित करने के लिए विभिन्न अनुपालन मानकों में ओवरलैपिंग नियमों की समीक्षा और समेकन करें। कृपया [डुप्लीकेट AWS Config नियमों की खोज करने के लिए इस ब्लॉग का पालन करें](https://aws.amazon.com/blogs/security/discover-duplicate-aws-config-rules-for-streamlined-compliance/)।

#### AWS Config में Global Resource Recording का अनुकूलन

कई क्षेत्रों में AWS Config लागू करते समय, आप लागतों को नियंत्रित करने और डुप्लीकेट डेटा संग्रह को रोकने के लिए global resources की रिकॉर्डिंग को अनुकूलित कर सकते हैं। बेस्ट प्रैक्टिस यह है कि अपने AWS एनवायरनमेंट में एक ही क्षेत्र में global resource recording को सीमित करें। इसे AWS CloudFormation टेम्पलेट के माध्यम से केवल एक निर्दिष्ट क्षेत्र में 'IncludeGlobalResourceTypes' प्रॉपर्टी को 'true' पर सेट करके प्रबंधित किया जा सकता है। यह दृष्टिकोण IAM users, roles, और policies जैसे संसाधनों के लिए महत्वपूर्ण है जो प्रकृति में global हैं। इस दृष्टिकोण को लागू करके, ऑर्गनाइज़ेशन कई क्षेत्रों में global resource recording के अनावश्यक दोहराव से बच सकते हैं, जिससे अपने global resources में व्यापक दृश्यता बनाए रखते हुए महत्वपूर्ण लागत बचत होती है।

#### एकीकृत सेवाओं का अनुकूलन

AWS Config विभिन्न AWS सेवाओं के साथ इंटरैक्ट करता है, प्रत्येक समग्र लागत में योगदान करती है। इन एकीकृत सेवाओं की व्यक्तिगत लागतों को अनुकूलित करने के लिए बेस्ट प्रैक्टिसेज़ को लागू करें:

