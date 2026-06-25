---
sidebar_position: 2
---
# अपने लैंडिंग ज़ोन का संचालन

## एक टेस्ट लैंडिंग ज़ोन बनाने पर विचार करें

Controls को प्रोडक्शन accounts पर लागू करने से पहले गैर-प्रोडक्शन OUs पर टेस्ट किया जा सकता है (और किया जाना चाहिए), लेकिन कुछ ऐसे उदाहरण भी हैं जहां दूसरा, टेस्ट Organization उपयोगी हो सकता है। यदि आपको लैंडिंग ज़ोन अपडेट का परीक्षण करने, landing zone management automations या account customization प्रक्रियाओं को संशोधित करने की आवश्यकता है, तो प्रोडक्शन वर्कलोड पर किसी भी अनजाने प्रभाव से बचने के लिए एक पूरी तरह से अलग Organization होना उपयोगी हो सकता है।

## अपने लैंडिंग ज़ोन को अपडेट रखें

लैंडिंग ज़ोन अपडेट में सुरक्षा सुधार, लागत ऑप्टिमाइज़ेशन और feature enhancements शामिल हो सकते हैं। जब एक नया लैंडिंग ज़ोन version उपलब्ध हो, तो आपको इसे जितनी जल्दी हो सके [अपडेट](https://docs.aws.amazon.com/controltower/latest/userguide/update-controltower.html) करना चाहिए। आप AWS Console से ऐसा कर सकते हैं। यह प्रक्रिया shared (log archive, audit, backup) accounts सहित लैंडिंग ज़ोन components को अपडेट करेगी।

यदि आप 2.x से 3.x में अपडेट कर रहे हैं तो ध्यान दें कि इसमें account level से Organization level CloudTrail trails में परिवर्तन के बारे में [अतिरिक्त चेतावनियां](https://docs.aws.amazon.com/controltower/latest/userguide/lz-update-best-practices.html) शामिल हैं।

## Control Tower के माध्यम से accounts बनाएं

Control Tower की Account Factory के माध्यम से नए accounts बनाएं ताकि वे बनते ही enrolled और managed हों। हालांकि जब Control Tower सक्षम हो तो AWS Organizations के माध्यम से accounts बनाना संभव है, वे Control Tower में enrolled नहीं होंगे, भले ही वे Control Tower managed OU के अंतर्गत हों। यदि आपके Organization में ऐसे accounts हैं जो Control Tower के माध्यम से नहीं बनाए गए थे, तो आप Control Tower controls और baselines लागू करने के लिए उन्हें enroll कर सकते हैं।

### Control Tower managed Identity Center के साथ federated identities का उपयोग करते समय account creation के दौरान एक सामान्य SSO user का उपयोग करें

यदि Identity Center को Control Tower द्वारा प्रबंधित किया जाता है, तो Account Factory को एक Identity Center user को parameter के रूप में आवश्यकता होती है। इस user को बनाए गए account में admin access दिया जाएगा लेकिन identity federation सक्षम होने पर यह उपयोग योग्य नहीं होगा। federated identities का उपयोग करते समय यह user उपयोग योग्य नहीं होगा लेकिन फिर भी एक आवश्यक parameter है। user को unique होने की आवश्यकता नहीं है इसलिए कई अप्रयुक्त स्थानीय Identity Center users बनाने से बचने के लिए, आप कई accounts के लिए एक ही user का उपयोग कर सकते हैं। यदि बाद में identity federation अक्षम किया जाता है, तो password सक्षम करने और अपने accounts तक पहुंचने के लिए user से जुड़े email address तक पहुंच आवश्यक होगी।

## अपने accounts को अपडेट रखें

एक बार लैंडिंग ज़ोन अपडेट पूरा हो जाने पर, आपको अपने accounts को अपडेट करना होगा। आप console में व्यक्तिगत accounts के लिए ऐसा कर सकते हैं या पूरे OUs को फिर से register करके (जब तक कि उनमें 1000 से कम accounts हों)। [प्रक्रिया को स्वचालित](https://docs.aws.amazon.com/controltower/latest/userguide/update-accounts-by-script.html) करना भी संभव है।

किसी भी अपडेट के प्रभाव का परीक्षण करने के लिए पहले non-prod OUs को re-register करके गैर-प्रोडक्शन वर्कलोड को प्रोडक्शन वर्कलोड से अलग OU में रखना एक बेस्ट प्रैक्टिस है।


## Drift प्रबंधित करें

Drift तब होता है जब आपके AWS Control Tower लैंडिंग ज़ोन components, accounts, या organizational units (OUs) परिभाषित baselines और controls के साथ sync से बाहर हो जाते हैं। आपके AWS एनवायरनमेंट में governance और compliance बनाए रखने के लिए drift को समझना और प्रबंधित करना महत्वपूर्ण है।

### Drift से बचने के लिए accounts और OUs में बदलाव Control Tower के माध्यम से करें

यदि आप Control Tower के बाहर accounts, OUs या Control Tower managed Organization policies (SCPs, RCPs) में बदलाव करते हैं (जो आमतौर पर तब होता है जब आप सीधे AWS Organizations console में बदलाव करते हैं) तो आप drift पैदा कर सकते हैं।

### नियमित रूप से अपने लैंडिंग ज़ोन की drift के लिए समीक्षा करें

Control Tower स्वचालित रूप से drift का पता लगाता है। नियमित रूप से अपने लैंडिंग ज़ोन की drift के लिए समीक्षा करें और आवश्यकतानुसार remediate करें। आप console में Organization पेज पर जाकर और फिर उन OUs या accounts का चयन करके जिनका आप निरीक्षण करना चाहते हैं, OU और account drift स्थिति देख सकते हैं। Drift को [SNS notifications](https://docs.aws.amazon.com/controltower/latest/userguide/sns-guidance.html) में भी सामने लाया जाता है जो audit account में एकत्र किए जाते हैं। आप सभी drift notifications प्राप्त करने के लिए aws-controltower-AggregateSecurityNotifications topic की सदस्यता ले सकते हैं। चूंकि यह topic config non-compliance और अन्य notifications भी प्राप्त करता है, यह शोरगुल वाला हो सकता है, इसलिए आप रुचि की notifications को प्रोसेस करने के लिए एक Lambda को subscribe करना चाह सकते हैं।


### Compliance सुनिश्चित करने के लिए drift को हल करें

यदि आपका लैंडिंग ज़ोन drifted है, तो आप सटीक रूप से निर्धारित नहीं कर सकते कि आपके resources आपके द्वारा सक्षम किए गए controls के अनुरूप हैं या नहीं। जब आप drift का पता लगाएं तो इसे repair करें ताकि आपकी governance आवश्यकताएं पूरी हों। [repairable drift](https://docs.aws.amazon.com/controltower/latest/userguide/drift.html#repairable-changes-to-resources) के कुछ उदाहरणों के लिए documentation देखें।

* यदि accounts या OUs drifted हैं तो आप console में account को अपडेट करके या OU को re-register करके इसे हल कर सकते हैं।
* Controls के लिए, कई प्रकार की drift को ResetEnabledControl API को कॉल करके हल किया जा सकता है।
* कई प्रकार की drift को हमारे Landing Zone के reset से स्वचालित रूप से हल किया जा सकता है। यह Landing zone settings के माध्यम से Versions section में Reset बटन क्लिक करके किया जा सकता है।


## आवश्यक Control Tower OUs या Accounts को डिलीट न करें

जैसा कि आपके लैंडिंग ज़ोन के विस्तार पर पहले के अनुभाग में उल्लेख किया गया है, Security OU या Control Tower managed accounts को डिलीट या move करना या अन्य सभी OUs को डिलीट करके केवल Security OU छोड़ना landing zone drift का कारण बनेगा। इस स्थिति में, Control Tower तब तक काम नहीं करेगा जब तक आप अपना लैंडिंग ज़ोन reset नहीं कर लेते।

## आवश्यक roles को डिलीट न करें

यदि [Control Tower को आवश्यक roles](https://docs.aws.amazon.com/controltower/latest/userguide/roles-how.html) गायब या अनुपलब्ध हैं, तो आपको अपना लैंडिंग ज़ोन reset करने का निर्देश देने वाला एक error page दिखाई देगा।

## अपनी governance आवश्यकताओं को लागू करने के लिए controls सक्षम करें

[Controls लागू करने के लिए बेस्ट प्रैक्टिसेज़](https://aws.amazon.com/blogs/mt/best-practices-for-applying-controls-with-aws-control-tower/) का पालन करें।

AWS Controls Catalog में अपनी आवश्यकताओं के अनुरूप Control Tower controls की पहचान करें। Controls को implementation, behaviour, owner, service और framework सहित metadata के आधार पर खोजा जा सकता है:

* Control Tower Console
* [Control Tower Catalog documentation](https://docs.aws.amazon.com/controltower/latest/controlreference/controls-reference.html)
* [Amazon Q](https://docs.aws.amazon.com/controltower/latest/controlreference/q-search.html)


यदि आवश्यक हो तो आप underlying services का उपयोग करके custom controls परिभाषित कर सकते हैं, लेकिन ये Control Tower dashboards या compliance metrics में शामिल नहीं होंगे:

* Preventative Controls के लिए AWS Organization [SCPs](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html) और [RCPs](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_rcps.html)
* Detective Controls के लिए AWS [Config Rules](https://docs.aws.amazon.com/config/latest/developerguide/evaluate-config_develop-rules.html)
* Proactive Controls के लिए AWS [CloudFormation hooks](https://docs.aws.amazon.com/cloudformation-cli/latest/hooks-userguide/what-is-cloudformation-hooks.html)
* AWS [Security Hub CSPM Controls](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-controls-reference.html)

यदि आप custom policies (SCPs या RCPs) डिप्लॉय कर रहे हैं, तो सुनिश्चित करें कि [Control Tower service roles](https://docs.aws.amazon.com/controltower/latest/userguide/awscontroltowerexecution.html) को deny नहीं किया गया है क्योंकि इससे errors हो सकते हैं या Control Tower अनुपयोगी हो सकता है।


प्रोडक्शन accounts पर डिप्लॉय करने से पहले हमेशा controls का परीक्षण करें।

* पहले non-production OUs और/या एक test Organization में डिप्लॉय करें
* एक नया preventative control लागू करने से पहले non-compliance की पहचान करने और हल करने के लिए एक समकक्ष detective control डिप्लॉय करने पर विचार करें

## Control inheritance को समझें

Controls AWS Control Tower का एक मूलभूत तत्व हैं और सफल landing zone operations के लिए यह समझना आवश्यक है कि वे कैसे काम करते हैं।

* Mandatory controls को अक्षम नहीं किया जा सकता और ये विशेष रूप से Control Tower resources की रक्षा करते हैं। ये user workloads पर लागू नहीं होंगे।
* Control Tower enrolled accounts parent OU से controls inherit करते हैं
    * Preventative, AWS Organizations policy based controls nested OUs में inherited होते हैं, अन्य नहीं।
    * Preventative, AWS Organizations policy based controls Control Tower registered OUs में un-enrolled accounts पर लागू होते हैं, अन्य नहीं।

## Config controls को Service Linked Rules का उपयोग करने के लिए अपडेट करें

[जून 2025](https://aws.amazon.com/about-aws/whats-new/2025/06/aws-control-tower-service-linked-aws-config-managed-rules/) से Control Tower ने service-linked AWS Config managed Config rules का समर्थन किया है। पहले, rules StackSets के माध्यम से डिप्लॉय किए जाते थे। Service-linked rules सीधे service द्वारा accounts में डिप्लॉय की जाती हैं और Control Tower के माध्यम से छोड़कर users द्वारा संपादित या डिलीट नहीं की जा सकतीं। इससे deployment speed में सुधार होता है और अनजाने drift को रोका जाता है।


## AWS Organizations के माध्यम से accounts को move न करें

AWS Organizations के माध्यम से सीधे OUs के बीच accounts को move करना, चाहे console में हो या API के माध्यम से, Control Tower में drift का कारण बनेगा।

यदि आपको OUs के बीच accounts को move करने की आवश्यकता है तो [Control Tower console के माध्यम से account को अपडेट](https://docs.aws.amazon.com/controltower/latest/userguide/updating-account-factory-accounts.html#update-account-in-console) करके या [Service Catalog में account के provisioned product को अपडेट](https://docs.aws.amazon.com/controltower/latest/userguide/updating-account-factory-accounts.html#update-provisioned-product) करके ऐसा करें। यदि आपने Organizations में एक account move किया है, तो [account को अपडेट](https://docs.aws.amazon.com/controltower/latest/userguide/governance-drift.html#drift-account-moved) करने से drift हल होनी चाहिए।


## Compliance state की समीक्षा करें

नियमित रूप से अपने accounts और OUs की compliance state की समीक्षा करें और non-compliance को remediate करने के लिए कार्रवाई करें।

Control Tower डैशबोर्ड आपको आपके लागू Control Tower controls की compliance state दिखाएगा। वर्तमान में यह Control Tower के बाहर (Security Hub के स्वामित्व वाले सहित) लागू config rules की compliance state नहीं दिखाएगा।

अपने Organization में config compliance का व्यापक दृश्य प्राप्त करने के लिए Cloud Intelligence Dashboards प्रोजेक्ट से [Config Resource Compliance Dashboard](https://catalog.workshops.aws/awscid/en-US/dashboards/additional/config-resource-compliance-dashboard) को लागू करने पर विचार करें।

Compliance changes के बारे में notifications प्राप्त करने के लिए [audit account में SNS topics](https://docs.aws.amazon.com/controltower/latest/controlreference/receive-notifications.html) की सदस्यता लें।

## समय-समय पर सक्षम controls की समीक्षा करें

नियमित रूप से अपने accounts और OUs पर लागू controls की समीक्षा करें ताकि यह सुनिश्चित हो सके कि वे आपकी व्यावसायिक आवश्यकताओं को पूरा करते रहें और आप नए controls का लाभ उठा रहे हों।


## Non-compliance पर कार्रवाई करें

आपको [Systems Manager Documents](https://docs.aws.amazon.com/systems-manager/latest/userguide/documents.html) परिभाषित करने चाहिए और उन्हें अपनी सक्षम Config rules के साथ associate करना चाहिए ताकि उनका उपयोग [non-compliance को remediate](https://docs.aws.amazon.com/config/latest/developerguide/remediation.html) करने के लिए किया जा सके। Remediation को [मैन्युअल रूप से](https://docs.aws.amazon.com/config/latest/developerguide/setup-manualremediation.html) ट्रिगर किया जा सकता है या [स्वचालित रूप से चलाने](https://docs.aws.amazon.com/config/latest/developerguide/setup-autoremediation.html) के लिए कॉन्फ़िगर किया जा सकता है।



## लैंडिंग ज़ोन की लागत की निगरानी और ऑप्टिमाइज़ करें

### सुनिश्चित करें कि आपके पास अपनी लैंडिंग ज़ोन की लागत में visibility है।

* Organization-wide AWS खर्च में visibility के लिए management account में [AWS Cost Explorer](https://docs.aws.amazon.com/cost-management/latest/userguide/ce-what-is.html) का उपयोग करें
* [AWS Cost Anomaly Detection](https://docs.aws.amazon.com/cost-management/latest/userguide/getting-started-ad.html) कॉन्फ़िगर करें और notifications की सदस्यता लें।
* [Cost & Usage Report data exports](https://docs.aws.amazon.com/cur/latest/userguide/dataexports-create.html), Athena integration और विस्तृत QuickSight cost Dashboards को आसानी से सक्षम करने के लिए Cloud Intelligence Dashboards को लागू करने पर विचार करें

### लागत बढ़ने के सामान्य कारणों से अवगत रहें

* CloudTrail integration के साथ Control Tower सक्षम करते समय, CloudTrail charges से बचने के लिए सुनिश्चित करें कि आप किसी भी पहले से मौजूद management trails को डिलीट कर दें
* Control Tower resource state को track करने के लिए AWS Config का उपयोग करता है। compliance बनाए रखने के लिए यह महत्वपूर्ण है लेकिन बार-बार बदलने वाले ephemeral workloads के लिए track करना महंगा हो सकता है। Control Tower में वर्तमान में member accounts में Config recorder को संशोधित करने का कोई built-in विकल्प नहीं है लेकिन अत्यधिक Config लागत और कम कठोर compliance आवश्यकताओं वाले accounts के लिए Config recorder को अक्षम करने हेतु [इस workaround](https://aws.amazon.com/blogs/mt/customize-aws-config-resource-tracking-in-aws-control-tower-environment/) पर विचार करें।
