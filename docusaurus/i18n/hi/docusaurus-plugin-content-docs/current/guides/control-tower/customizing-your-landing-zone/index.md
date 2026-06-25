---
sidebar_position: 3
---
# अपने लैंडिंग ज़ोन को अनुकूलित करना


Control Tower एक अच्छी तरह से गवर्न किए गए लैंडिंग ज़ोन के लिए एक शुरुआती बिंदु परिभाषित करता है, लेकिन अधिकांश ग्राहकों को अपने वर्कलोड के लिए अतिरिक्त platform services लागू करने की आवश्यकता होती है। इसमें केंद्रीकृत नेटवर्किंग, सुरक्षा सेवाएं, केंद्रीकृत ऑब्ज़र्वेबिलिटी सेवाएं आदि शामिल हो सकती हैं।

## Infrastructure as Code का उपयोग करें

अतिरिक्त platform services को Infrastructure as Code (IaC) का उपयोग करके परिभाषित और डिप्लॉय किया जाना चाहिए, जो:

* सभी accounts और regions में समान कॉन्फ़िगरेशन सुनिश्चित करेगा
* Version control और change management को सक्षम करेगा, peer review और rollback का समर्थन करेगा और यह सुनिश्चित करेगा कि सभी परिवर्तन रिकॉर्ड और ऑडिट योग्य हैं
* तीव्र, स्वचालित account provisioning का समर्थन करेगा जहां Control Tower lifecycle events के जवाब में deployment ट्रिगर किया जा सकता है

## सही अनुकूलन विकल्प चुनें

शुरुआत में सही अनुकूलन दृष्टिकोण चुनना महत्वपूर्ण है क्योंकि यह आगे चलकर आपके operational model और flexibility को महत्वपूर्ण रूप से प्रभावित करेगा। यह चयन आपके ऑर्गनाइज़ेशन की infrastructure-as-code प्राथमिकताओं, operational आवश्यकताओं और वांछित अनुकूलन flexibility स्तर जैसे कारकों पर निर्भर करता है। हम आपके लैंडिंग ज़ोन के लिए केवल एक अनुकूलन विकल्प लागू करने की अनुशंसा करते हैं।

Control Tower को code के साथ अनुकूलित करने के चार मुख्य विकल्प हैं:

* AWS Organizations StackSets
* Account Factory Customization (AFC)
* Customization for AWS Control Tower (CfCT)
* Account Factory for Terraform (AFT)
* Landing Zone Accelerator (LZA)

### CloudFormation StackSets

CloudFormation में infrastructure resources को परिभाषित करना और native [CloudFormation StackSets](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/what-is-cfnstacksets.html) feature का उपयोग करके विशिष्ट accounts में डिप्लॉय करना संभव है। एक StackSet आपको एक ही template का उपयोग करके regions में stacks बनाने देता है। CloudFormation [स्वचालित रूप से नए AWS Organizations accounts में अतिरिक्त stacks डिप्लॉय](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-orgs-manage-auto-deployment.html) कर सकता है जब वे आपके target organization या organizational units (OUs) में जोड़े जाते हैं, [कुछ चेतावनियों](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-orgs-manage-auto-deployment.html#stacksets-orgs-auto-deployment-considerations) के साथ।

StackSets न्यूनतम dependencies वाले सरल templates को डिप्लॉय करने के लिए उपयोगी हो सकते हैं (और Control Tower स्वयं baseline IAM Roles जैसी चीजों को डिप्लॉय करने के लिए इनका उपयोग करता है) लेकिन CI/CD की कमी और Control Tower की account provisioning प्रक्रिया के साथ एकीकरण या जागरूकता की कमी अधिक जटिल अनुकूलन के लिए एक चुनौती है।

यदि आप CloudFormation में सरल अनुकूलन डिप्लॉय करने के लिए एक managed service की तलाश में हैं, तो AFC पर विचार करें। यदि आप CI/CD का समर्थन करने वाले CloudFormation आधारित समाधान की तलाश में हैं, तो CfCT पर विचार करें।


### Account Factory Customization (AFC)

[AFC](https://docs.aws.amazon.com/controltower/latest/userguide/af-customization-page.html) एक native Control Tower feature है और AWS Control Tower की account provisioning workflow के साथ सीधे एकीकृत होता है। यह आपको blueprints (CloudFormation या Terraform में, इस पर निर्भर करते हुए कि आप account provisioning के लिए किसका उपयोग कर रहे हैं) को परिभाषित करने की अनुमति देता है जो provisioned होने पर एक account को resources और configurations के साथ baseline करने के लिए उपयोग किए जाते हैं।

Blueprints को Service Catalog में अपडेट और version किया जा सकता है। Control Tower account updated process का उपयोग अपडेट की गई baseline को लागू करने के लिए किया जा सकता है। हालांकि आप AFC में कई blueprints परिभाषित कर सकते हैं, अभी एक से अधिक blueprint के साथ किसी account को baseline करना संभव नहीं है। इससे अधिक जटिल अनुकूलन के लिए AFC का उपयोग करना चुनौतीपूर्ण हो जाता है।

यदि आपको सीधा अनुकूलन चाहिए, प्रति account एक single baseline पर्याप्त है और आप अपनी अनुकूलन प्रक्रिया के लिए किसी भी resource को प्रबंधित नहीं करना चाहते हैं, तो AFC का उपयोग करें।


### Customizations for AWS Control Tower (CfCT)

[CfCT](https://docs.aws.amazon.com/controltower/latest/userguide/cfct-overview.html) एक AWS समाधान है जो Control Tower management account में, Control Tower home region में एक AWS Code Pipeline pipeline लागू करता है। यह S3 या Github में CloudFormation templates के repository द्वारा समर्थित है। यह आपके Organization में target accounts और OUs में CloudFormation templates, SCPs, और RCPs की deployment का समर्थन करता है। CfCT account creation के automation का समर्थन नहीं करता। इसके बजाय यह Control Tower के lifecycle events के साथ एकीकृत है ताकि Control Tower की Account Factory के माध्यम से बनाए गए नए accounts के लिए अनुकूलन स्वचालित रूप से ट्रिगर किया जा सके।

यदि आपके पास इन-हाउस CloudFormation कौशल हैं और आप अपने management account में समाधान को बनाए रखने और [अपडेट](https://docs.aws.amazon.com/controltower/latest/userguide/update-stack.html) करने के इच्छुक हैं, तो CfCT का उपयोग करें।



### Account Factory for Terraform (AFT)

[AFT](https://docs.aws.amazon.com/controltower/latest/userguide/taf-account-provisioning.html) Terraform का उपयोग करता है, और इसलिए account creation और customization की संपूर्ण प्रक्रिया को प्रबंधित करने के लिए सीधे AWS API calls करता है। यह customization के लिए एक अत्यंत लचीला समाधान है लेकिन यह बढ़े हुए management overhead की कीमत पर आता है। CfCT के विपरीत, AFT account creation से लेकर account customization तक की संपूर्ण प्रक्रिया को स्वचालित कर सकता है। यह account customizations की Terraform state files को प्रबंधित करने के लिए भी डिज़ाइन किया गया है।

यह भी ध्यान दें कि Control Tower Proactive controls (CloudFormation Guard rules के रूप में लागू) लागू नहीं होंगे क्योंकि resources CloudFormation का उपयोग करके डिप्लॉय नहीं किए जा रहे हैं।

यदि आपके पास इन-हाउस Terraform कौशल हैं और आप Terraform state और processes को सेट अप और बनाए रखने, कई repositories प्रबंधित करने और accounts बनाने और अनुकूलित करने वाली विभिन्न टीमों के बीच समन्वय करने में अनुभवी हैं, तो AFT का उपयोग करें।


### Landing Zone Accelerator (LZA)

[LZA](https://aws.amazon.com/solutions/implementations/landing-zone-accelerator-on-aws/) AWS best practices और security frameworks के आधार पर एक सुरक्षित, मल्टी-अकाउंट एनवायरनमेंट लागू करने के लिए एक AWS समाधान है। हालांकि LZA को AWS Control Tower की आवश्यकता नहीं है, [यह अनुशंसित है](https://docs.aws.amazon.com/controltower/latest/userguide/about-lza.html) कि आप Control Tower को अपने मूलभूत लैंडिंग ज़ोन के रूप में उपयोग करें और उसके ऊपर LZA लागू करें। LZA security tooling और shared networking services सहित सामान्य landing zone functions की opinionated deployments प्रदान करता है, जिसमें configuration files के माध्यम से सीमित अनुकूलन उपलब्ध है। यह सख्त सुरक्षा और compliance आवश्यकताओं वाले AWS ग्राहकों को अपनी cloud foundations को तेज़ी से कॉन्फ़िगर करने की अनुमति देता है।

यदि आप अत्यधिक विनियमित क्षेत्र में हैं; एक सुरक्षित और compliant लैंडिंग ज़ोन की जल्दी आवश्यकता है; infrastructure deployment के लिए अधिक opinionated दृष्टिकोण के साथ सहज हैं; समाधान को बनाए रखने के इच्छुक हैं; और यदि कोई समस्या आती है तो underlying CDK code को समझने और प्रबंधित करने के लिए तैयार हैं, तो LZA का उपयोग करें।


| Feature | Account Factory Customization (AFC) | Customizations for AWS Control Tower (CfCT) | Account Factory for Terraform (AFT) | Landing Zone Accelerator (LZA) |
| ------- | ------------------------------------ | -------------------------------------------- | ------------------------------------ | ------------------------------- |
| Service Managed | Yes | No | No | No |
| IaC Engine | CloudFormation, Terraform | CloudFormation | Terraform | CDK |
| Deploys SCP | No | Yes | Yes | Yes |
| Supports Multiple Configuration Packages | No | Yes | Yes | Yes |
| Learning Curve | Low | Medium | High | Low |
| Operational Overhead | Low | Medium | High | Medium |
| API Support | No | Yes | Yes | Yes |
| Version Control Integration | No | Yes | Yes | Yes |
| Delegated Administration | No | No | Yes | Yes |
| Account Provisioning | Direct | Via lifecycle events only | Direct | Direct |
| Console Management | Yes | Limited | Limited | Limited |
| Deployment Complexity | Low | Medium | High | Medium |
| Customization Flexibility | Limited | High | Highest | High |
| Proactive Controls Apply | Yes | Yes | No | Yes |

