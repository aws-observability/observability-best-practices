---
sidebar_position: 1
---
# अपने लैंडिंग ज़ोन की योजना बनाना और लागू करना

## अपनी व्यावसायिक आवश्यकताओं के अनुसार regions सक्षम करें

### अपने सबसे अधिक उपयोग किए जाने वाले region को अपने Home Region के रूप में चुनें

हालांकि Control Tower कई regions को govern कर सकता है, इसे एक ही home region से सक्षम किया जाना चाहिए। उस region की पहचान करें जहां आप अपने अधिकांश वर्कलोड चलाने की उम्मीद करते हैं और इसे अपने Control Tower Home Region के रूप में निर्दिष्ट करें। यदि आप AWS Identity Center के मौजूदा instance का उपयोग कर रहे हैं, तो आपका home region वही region होना चाहिए जिसमें AWS Identity Center कॉन्फ़िगर किया गया है।

Control Tower home region आपके Landing Zone के लिए प्रमुख configuration items रखता है। AWS Organization वहां बनाया जाता है, IAM Identity Center वहां सक्षम किया जाता है, CloudTrail डेटा स्टोरेज के लिए S3 buckets के साथ। Audit account में AWS Config भी home region में findings एकत्रित करने के लिए कॉन्फ़िगर किया गया है।


### अप्रयुक्त regions को deny करें, सभी अनुमत regions को govern करें

Control Tower अधिकांश AWS regions के उपयोग को deny करने और केवल आपकी व्यावसायिक आवश्यकताओं के लिए subset को सक्षम करने की क्षमता प्रदान करता है। इससे आपकी attack surface कम होती है, वर्कलोड द्वारा अनावश्यक लागत उत्पन्न करने की संभावना कम होती है और आपकी governance और Observability आवश्यकताएं सरल होती हैं।

[Global region deny control](https://docs.aws.amazon.com/controltower/latest/userguide/region-deny.html) आपके लैंडिंग ज़ोन बनाते या अपडेट करते समय सेट किया जा सकता है। यह Control Tower governed region list के साथ मिलकर काम करता है, अर्थात यदि region governance के लिए सक्षम नहीं है, तो इसे deny किया जाएगा। विशिष्ट Organizational Unit (OU) के लिए region उपयोग को और प्रतिबंधित करने के लिए, आप [OU region deny control](https://docs.aws.amazon.com/controltower/latest/controlreference/ou-region-deny.html) भी लागू कर सकते हैं। ये दोनों controls [Service Control Policies (SCP)](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html) का उपयोग करके लागू किए गए हैं। यदि कोई region denied नहीं है, तो users IAM permissions के अधीन उसमें resources डिप्लॉय कर सकते हैं। अपने वर्कलोड पर प्रभाव से बचने के लिए किसी region को deny करने से पहले सुनिश्चित करें कि उसमें कोई resource उपयोग में नहीं है।

Control Tower Home Region डिफ़ॉल्ट रूप से governed है और इसे ungoverned नहीं किया जा सकता।

Control Tower region-deny SCPs में ऐसे exceptions शामिल हैं जो Control Tower को काम करने के लिए आवश्यक हैं।

## Access control को सरल बनाने के लिए AWS Identity Center का उपयोग करें

AWS resources तक human access प्रदान करने के लिए IAM Users के उपयोग से बचना और इसके बजाय [identity federation](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html#bp-users-federation-idp) की आवश्यकता रखना एक AWS सर्वोत्तम प्रथा है। इससे credential compromise का अधिकांश जोखिम कम हो जाता है क्योंकि आपको अब long-lived AWS credentials का उपयोग करने की आवश्यकता नहीं है। केंद्रीकृत access management के लिए हम अनुशंसा करते हैं कि आप अपने accounts तक पहुंच और उन accounts के भीतर permissions को प्रबंधित करने के लिए [AWS IAM Identity Center](https://docs.aws.amazon.com/singlesignon/latest/userguide/getting-started.html) का उपयोग करें।

Identity Center को एक ही region में सक्षम किया जा सकता है और globally users के लिए उपलब्ध हो सकता है। यदि Identity Center आपके Organization के लिए सक्षम नहीं है, तो Control Tower इसे आपके Control Tower Home Region में आपके लिए सक्षम करेगा। यदि Identity Center पहले से सक्षम है, तो इसे आपके Control Tower home region में सक्षम होना चाहिए अन्यथा [pre-flight checks](https://docs.aws.amazon.com/controltower/latest/userguide/getting-started-prereqs.html) विफल हो जाएंगे।

AWS Identity Center Permission Sets का समर्थन करता है, जिन्हें आपके AWS Organization में accounts को assign किया जा सकता है और उन accounts में IAM roles के निर्माण के लिए एक template के रूप में कार्य करता है। जब आप एक Identity Center user या group को किसी विशेष account में किसी विशेष permission set के साथ associate करते हैं, तो यह उस user या group को उस account में Permission Set defined role assume करने की अनुमति देता है। यदि आप Control Tower को Identity Center प्रबंधित करने देते हैं, तो यह कुछ [preconfigured groups और permission sets](https://docs.aws.amazon.com/controltower/latest/userguide/sso-groups.html) बनाएगा और इन्हें accounts को assign करेगा ताकि आपको user access के लिए एक foundation मिल सके।


### अपने corporate identity provider को integrate करें

Identity Center का उपयोग users और groups को प्रबंधित करने के लिए किया जा सकता है लेकिन यदि आपके पास मौजूदा corporate identity provider है, तो आपको अपनी identities के लिए एकल source of truth बनाए रखने के लिए इसे [Identity Center से कनेक्ट](https://docs.aws.amazon.com/singlesignon/latest/userguide/tutorials.html) करना चाहिए।

यदि आप federated users का उपयोग कर रहे हैं और Control Tower द्वारा Identity Center में सेट अप किए गए default group और permission set configuration का उपयोग करना चाहते हैं, तो आप अपने upstream provider में समान नामों वाले groups बना सकते हैं और उन्हें Identity Center से sync कर सकते हैं। फिर आप अपने enrolled accounts तक पहुंच देने के लिए identity provider में users को इन groups में assign कर सकते हैं।

### Least privilege access की दिशा में काम करें

Control Tower द्वारा बनाए गए default Permission Sets **AdministratorAccess** और **DeveloperAccess** जैसे सामान्य use cases के लिए डिज़ाइन किए गए हैं। प्रोडक्शन वर्कलोड के लिए, विशेष रूप से sensitive data या अन्य स्थितियों में जहां सुरक्षा और compliance महत्वपूर्ण चिंताएं हैं, सर्वोत्तम प्रथा यह निर्देशित करती है कि आप permissions को न्यूनतम आवश्यक access तक कम करें। यह आवश्यक permissions को विशेष रूप से grant करने के लिए custom permission sets का उपयोग करके और/या अनावश्यक access को deny करने के लिए service control policies लागू करके प्राप्त किया जा सकता है। [AWS IAM Access Analyzer](https://docs.aws.amazon.com/IAM/latest/UserGuide/what-is-access-analyzer.html) आवश्यक permissions की पहचान करने, अप्रयुक्त permissions को हटाने और least privilege policies लिखने में मदद कर सकता है।


### एक Delegated Administrator Account सक्षम करें

Control Tower Organization management account में Identity Center को सक्षम करता है। management account तक किसी की भी पहुंच की आवश्यकता को कम करना एक सर्वोत्तम प्रथा है क्योंकि यह आपके शेष AWS Organization को नियंत्रित करता है और member accounts की तरह preventative controls (SCP) द्वारा समान रूप से प्रतिबंधित नहीं किया जा सकता। इस कारण से आपको [Identity Center के लिए एक delegated administrator account सक्षम](https://docs.aws.amazon.com/singlesignon/latest/userguide/delegated-admin.html) करना चाहिए।

Management account में डिप्लॉय किए गए Permission sets को delegated administrator account से प्रबंधित नहीं किया जा सकता, हम management account के लिए dedicated permission sets (उदाहरण के लिए MA_Administrator) बनाने की अनुशंसा करते हैं जो केवल users के एक अत्यंत प्रतिबंधित सेट द्वारा assumable हों।

### Control Tower managed roles पर अतिरिक्त constraints लागू करें

Control Tower member accounts में [विभिन्न roles](https://docs.aws.amazon.com/controltower/latest/userguide/roles-how.html) बनाता है जिन्हें AWS services द्वारा assume किया जा सकता है।

[Cross-service confused deputy](https://docs.aws.amazon.com/IAM/latest/UserGuide/confused-deputy.html) समस्या से बचाव के लिए आप एक [Resource Control Policy (RCP)](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_rcps_examples.html) परिभाषित कर सकते हैं ताकि आपके AWS Organization के बाहर की identities को services को उनकी ओर से roles assume करने के लिए धोखा देने से रोका जा सके।

आप [access को और प्रतिबंधित करने](https://docs.aws.amazon.com/controltower/latest/userguide/conditions-for-role-trust.html) के लिए Control Tower roles में Conditions भी जोड़ सकते हैं, लेकिन ध्यान रहे कि इन roles में कोई भी परिवर्तन landing zone updates पर overwrite हो सकता है।


## AWS Backup से अपने डेटा की रक्षा करें

Control Tower का [AWS Backup integration](https://docs.aws.amazon.com/controltower/latest/userguide/backup.html/) आपको प्रत्येक member account में एक backup vault, एक shared account में एक central vault और कुछ standard backup policies (hourly, weekly, daily, monthly) के साथ एक सर्वोत्तम प्रथा backup समाधान सेट अप करने में मदद कर सकता है। Backup को OU स्तर पर सक्षम किया जा सकता है और व्यक्तिगत resources को संबंधित backup schedule के लिए लक्षित करने हेतु tag किया जा सकता है।

आप अपनी Control Tower customization method ([AFC](https://docs.aws.amazon.com/controltower/latest/userguide/af-customization-page.html), [CfCT](https://docs.aws.amazon.com/controltower/latest/userguide/cfct-overview.html), [AFT](https://docs.aws.amazon.com/controltower/latest/userguide/aft-overview.html), [StackSets](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/what-is-cfnstacksets.html)) का उपयोग करके accounts में अतिरिक्त backup plans डिप्लॉय कर सकते हैं। ये [aws-controltower-BackupRole](https://docs.aws.amazon.com/controltower/latest/userguide/backup-resources.html) role का पुन: उपयोग कर सकते हैं या आप आवश्यकतानुसार नए roles बना सकते हैं।

यदि आपके पास मौजूदा backup समाधान है तो आप इस integration से ऑप्ट आउट कर सकते हैं।


## अपनी व्यावसायिक आवश्यकताओं के अनुरूप अपनी AWS Organization Structure का विस्तार करें

### AWS Organizations मल्टी-अकाउंट सर्वोत्तम प्रथाओं का पालन करें

सामान्य रूप से, Control Tower का उपयोग करते समय [मल्टी-अकाउंट रणनीति](https://docs.aws.amazon.com/whitepapers/latest/organizing-your-aws-environment/organizing-your-aws-environment.html) और अपनी Organizational Units (OUs) के डिज़ाइन से संबंधित AWS Organizations सर्वोत्तम प्रथाओं का पालन करें। इसे सरल रखें - अपनी differential governance, security और policy आवश्यकताओं का समर्थन करने के लिए आवश्यक OUs से शुरू करें और deep nesting से बचें - Control Tower अधिकतम पांच levels की nesting का समर्थन करता है।


### Control Tower Security OU को संशोधित या डिलीट न करें

Control Tower द्वारा आपके Organization पर लागू की जाने वाली कुछ सीमाओं में से एक यह है कि आप Security OU के तहत अतिरिक्त accounts या OUs नहीं बना सकते और अपने Control Tower वातावरण को तोड़े बिना Control Tower द्वारा बनाए गए accounts (log archive, audit) को move या डिलीट नहीं कर सकते।


### सभी OUs को डिलीट करके केवल Security OU न छोड़ें

Control Tower कम से कम दो OUs होने की अपेक्षा करता है, जिनमें से एक security OU होना चाहिए। आप Control Tower सक्षम करने पर बनाए गए Sandbox OU को डिलीट कर सकते हैं लेकिन केवल तभी जब आपके Organization में कम से कम एक अन्य OU हो।
