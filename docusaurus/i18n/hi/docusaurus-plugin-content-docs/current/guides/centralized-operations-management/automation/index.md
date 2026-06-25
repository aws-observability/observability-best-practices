---
sidebar_position: 7
---

# ऑटोमेशन

Automation, [AWS Systems Manager](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-automation.html) की एक क्षमता, के साथ आप लो-कोड [visual designer](https://docs.aws.amazon.com/systems-manager/latest/userguide/automation-visual-designer.html) के साथ [कस्टम runbooks](https://docs.aws.amazon.com/systems-manager/latest/userguide/automation-documents.html) लिख सकते हैं, या AWS द्वारा प्रदान किए गए 370 से अधिक पूर्वनिर्धारित runbooks में से चुन सकते हैं [कई खातों और AWS Regions](https://docs.aws.amazon.com/systems-manager/latest/userguide/running-automations-multiple-accounts-regions.html) में। आप अन्य [Systems Manager Automation actions](https://docs.aws.amazon.com/systems-manager/latest/userguide/automation-actions.html) जैसे approvals, AWS API calls, या अपने nodes पर कमांड चलाने के संयोजन में runbook के हिस्से के रूप में Python या PowerShell स्क्रिप्ट चला सकते हैं।

Automation व्यवसायों को त्रुटियों को कम करके, लचीलापन बढ़ाकर प्रदर्शन में सुधार करने में सक्षम बना सकता है। Automation विभिन्न तरीकों से सुरक्षा और संचालन दोनों को बढ़ा सकता है, यहाँ कुछ उदाहरण हैं:

* **कॉन्फ़िगरेशन प्रबंधन**: Automation टूल सर्वर, वर्कस्टेशन और नेटवर्क डिवाइस में मानकीकृत कॉन्फ़िगरेशन लागू कर सकते हैं, गलत कॉन्फ़िगरेशन की संभावना को कम करते हैं जो सुरक्षा कमजोरियों का कारण बन सकती हैं।
* **पैच प्रबंधन**: Automation का उपयोग सिस्टम में सुरक्षा पैच और अपडेट तैनात करने के लिए किया जा सकता है, ज्ञात शोषणों की भेद्यता की विंडो को कम करता है।
* **Incident Response Playbooks**: Automation सुरक्षा टीमों को सुरक्षा घटनाओं को रोकने, जाँच करने और उपचार करने के लिए आवश्यक कदमों के माध्यम से मार्गदर्शन करने के लिए पूर्वनिर्धारित incident response playbooks निष्पादित कर सकता है। एप्लिकेशन मालिक सिस्टम आउटेज घटनाओं का जवाब देने के लिए Automation runbooks बना सकते हैं। उदाहरण के लिए, नेटवर्क कनेक्टिविटी की हानि, भौतिक होस्ट पर सॉफ़्टवेयर समस्याएँ, सिस्टम पावर की हानि। EC2 इंस्टेंस को रोकने, समाप्त करने, रीबूट करने, या पुनर्प्राप्त करने के लिए [Amazon CloudWatch alarms](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html) का उपयोग करना।
* **अनुपालन प्रबंधन**: Automation ऑडिट प्रक्रियाओं को ऑटोमेट करके, अनुपालन रिपोर्ट जनरेट करके, और सुरक्षा नियंत्रणों को लगातार लागू करके उद्योग नियमों और आंतरिक नीतियों के अनुपालन को बनाए रखने में सहायता कर सकता है।

Systems Manager Automation का लाभ उठाकर, आप इस महत्वपूर्ण प्रक्रिया को सुव्यवस्थित कर सकते हैं, यह सुनिश्चित करते हुए कि आपके एप्लिकेशन सर्वर आपके ऑर्गनाइज़ेशन की सुरक्षा नीतियों के साथ अप-टू-डेट और अनुपालन में रहें। यह न केवल समय बचाता है और मैनुअल त्रुटियों की संभावना को कम करता है, बल्कि इस आवर्ती कार्य के लिए एक सुसंगत और दोहराने योग्य दृष्टिकोण भी प्रदान करता है।

![Automation](/img/cloudops/guides/centralized-operations-management/automation/BP-Automation-1.png "Automation")

## Service role का उपयोग करके अनुमतियों का प्रबंधन

एक सुरक्षा बेस्ट प्रैक्टिस के रूप में, आप automation शुरू करने के लिए एक IAM role (SSM सेवा द्वारा assume करने योग्य) बना सकते हैं। जब आप service role का उपयोग करते हैं, तो automation को AWS संसाधनों के विरुद्ध चलने की अनुमति होती है, लेकिन जिस उपयोगकर्ता ने automation चलाया उसकी उन संसाधनों तक सीमित पहुँच (या कोई पहुँच नहीं) होती है।

उन्नत सुरक्षा और नियंत्रण - Delegated administration आपके AWS संसाधनों की उन्नत सुरक्षा और नियंत्रण सुनिश्चित करता है। यदि आप अनुमतियों को संशोधित करना चाहते हैं, तो कई IAM खातों के बजाय service role में वे परिवर्तन करें।

बेहतर ऑडिटिंग अनुभव - एक बेहतर ऑडिटिंग अनुभव की अनुमति देता है क्योंकि आपके संसाधनों के विरुद्ध कार्रवाइयाँ कई IAM खातों के बजाय एक केंद्रीय service role द्वारा की जा रही हैं।

निम्नलिखित स्थितियों में आपको Automation के लिए service role निर्दिष्ट करना आवश्यक है: 1/ जब आप delegated administration का उपयोग करना चाहते हैं। 2/ जब आप एक Systems Manager State Manager association बनाते हैं जो एक runbook चलाता है। 3/ जब आपके पास ऐसे operations हैं जिनके 12 घंटे से अधिक चलने की उम्मीद है। 4/ जब आप Amazon के स्वामित्व वाला नहीं एक runbook चला रहे हैं जो AWS API operation को कॉल करने या AWS संसाधन पर कार्य करने के लिए aws:executeScript action का उपयोग करता है।

![अनुमतियों का प्रबंधन](/img/cloudops/guides/centralized-operations-management/automation/BP-Automation-2.png "अनुमतियों का प्रबंधन")

अपना service role बनाने के बाद, हम trust policy को संपादित करने की अनुशंसा करते हैं ताकि यह सुनिश्चित किया जा सके कि केवल उस खाते में Systems Manager Automation को role assume करने की अनुमति है। Role policy के लिए, runbook में परिभाषित automation actions चलाने के लिए केवल आवश्यक अनुमति अटैच करें। Automation शुरू करने वाली IAM entity को आवश्यक automation runbooks शुरू करने की अनुमति है। Entity को Systems Manager को automation service role पास करने की अनुमति है। इस entity को AWS संसाधनों के साथ सीधे इंटरैक्ट करने की अनुमतियाँ नहीं दी गई हैं। वे अनुमतियाँ service role को सौंपी गई हैं।

* Service role trust policy
  * Systems Manager द्वारा assume करने योग्य
* Service role policy - न्यूनतम पहुँच नीति
  * Automation actions चलाने के लिए केवल आवश्यक अनुमति प्रदान करें
* IAM User/Group/Role policy
  * Automation को service role पास करने की अनुमति
  * Automation executions शुरू/बंद/describe करने की अनुमति
  * Automation के बाहर संसाधनों को प्रबंधित करने के लिए कोई अनुमतियाँ आवश्यक नहीं

## Automation runbooks बनाना

अपने स्वयं के automation runbooks बनाने के कई तरीके हैं। प्रोग्रामेटिक रूप से document बनाने के लिए, आप CreateDocument API, या SSM Documents CDK लाइब्रेरी का उपयोग कर सकते हैं। आप CloudFormation का उपयोग करके भी document बना सकते हैं।

AWS Systems Manager Automation एक लो-कोड visual design अनुभव प्रदान करता है जो आपको automation runbooks बनाने में मदद करता है। Visual design अनुभव एक drag-and-drop इंटरफ़ेस प्रदान करता है जिसमें अपना कोड जोड़ने का विकल्प होता है ताकि आप अधिक आसानी से runbooks बना और संपादित कर सकें।

जैसे-जैसे आप runbook बनाते हैं, visual design अनुभव आपके काम को मान्य करता है और ऑटो-जनरेट कोड करता है। आप जनरेट किए गए कोड की समीक्षा कर सकते हैं, या इसे स्थानीय विकास के लिए निर्यात कर सकते हैं। जब आप समाप्त कर लें, तो आप अपना runbook सहेज सकते हैं, इसे चला सकते हैं, और Systems Manager Automation कंसोल में परिणामों की जाँच कर सकते हैं।

Visual design अनुभव में, Automation आपकी Python स्क्रिप्ट में सुरक्षा नीति उल्लंघनों और कमजोरियों का पता लगाने में मदद करने के लिए Amazon CodeGuru Security के साथ एकीकृत होता है।

उपलब्ध विकल्प:

* AWS APIs का लाभ उठाएँ या CloudFormation का उपयोग करके documents बनाएँ
* [Automation runbooks के लिए Visual design अनुभव](https://docs.aws.amazon.com/systems-manager/latest/userguide/automation-visual-designer.html)
* [Visual Studio Code Toolkit](https://docs.aws.amazon.com/toolkit-for-vscode/latest/userguide/systems-manager-automation-docs.html)
* [CDK for Systems Manager Documents](https://github.com/cdklabs/cdk-ssm-documents)

Systems Manager AWS खातों में runbooks साझा करने की अनुमति देता है। यह प्रभावी सहयोग और बेस्ट प्रैक्टिसेज़ को अपनाने को बढ़ावा देता है। उदाहरण के लिए, एक केंद्रीय खाता सुरक्षा बेस्ट प्रैक्टिसेज़ को automation runbooks के रूप में परिभाषित कर सकता है और उन्हें ऑर्गनाइज़ेशन के भीतर अन्य खातों के साथ साझा कर सकता है। यह संपूर्ण AWS एनवायरनमेंट में सुरक्षा उपायों का सुसंगत कार्यान्वयन सुनिश्चित करता है।

डिफ़ॉल्ट रूप से SSM AWS Organization Unit (OU) का उपयोग करके runbooks साझा करने का समर्थन नहीं करता है। इस सीमा को दूर करने के लिए एक समाधान उपलब्ध है।

![Automation runbooks](/img/cloudops/guides/centralized-operations-management/automation/BP-Automation-3.png "Automation runbooks")

समाधान कई AWS संसाधनों का उपयोग करता है, जिसमें EventBridge Rule, Lambda functions, Step Function State Machine, और SNS topic शामिल हैं। तैनात होने के बाद, समाधान हर बार CreateAccount या InviteAccountToOrganization API कॉल के माध्यम से AWS Organizations में एक नया खाता जोड़े जाने पर एक workflow ट्रिगर करेगा। Workflow एक निर्दिष्ट AWS Organizations चाइल्ड खाते और सभी निर्दिष्ट Region(s) में नए जोड़े गए Account ID के लिए SSM Document शेयर अनुमतियाँ जोड़ेगा। [Automate AWS Organizations SSM Document Share Permissions](https://github.com/aws-samples/aws-management-and-governance-samples/tree/master/AWSSystemsManager/AWS-Org-SSM-Permissions) पर अधिक जानें।

## Automation चलाना

* **Simple Automation** - वर्तमान region और account
* **Manual Automation** - इंटरैक्टिव step-by-step execution। प्रत्येक step मैन्युअल रूप से निष्पादित। समस्या निवारण उद्देश्य के लिए उपयोगी।
* **Multi Account Multi Region Automation** - एक केंद्रीय खाते से कई AWS Regions और AWS accounts या AWS Organizations organizational units (OUs) में automation चलाएँ।
* **बड़े पैमाने पर चलाएँ** - Tags, Resource Groups या Parameter values का उपयोग करके लक्ष्य करें
* **Rate Control** - Concurrency और Error threshold। Blast radius को नियंत्रित करता है। Concurrency मान निर्धारित करता है कि कितने संसाधनों को एक साथ automation चलाने की अनुमति है।
* **Adaptive Concurrency** - 500 तक concurrent automations। Automation preferences में इसे सक्षम करें।
* **CloudWatch Alarm Integration** - Automation की निगरानी के लिए CloudWatch alarm अटैच करें। यदि alarm सक्रिय होता है, तो automation रुक जाता है।
* **Security** - IAM access control।
  * IAM policies का उपयोग करके, administrators नियंत्रित कर सकते हैं कि आपके ऑर्गनाइज़ेशन में कौन से व्यक्तिगत उपयोगकर्ता या समूह Automation का उपयोग कर सकते हैं और कौन से runbooks वे एक्सेस कर सकते हैं।
  * Automation IAM service role का उपयोग करके access delegation की अनुमति देता है। जब आप service role का उपयोग करते हैं, तो automation को AWS संसाधनों के विरुद्ध चलने की अनुमति होती है, लेकिन जिस उपयोगकर्ता ने automation चलाया उसकी उन संसाधनों तक सीमित पहुँच (या कोई पहुँच नहीं) होती है।

## कई खातों और Regions में Automation चलाना

![Automation चलाना](/img/cloudops/guides/centralized-operations-management/automation/BP-Automation-4.png "Automation चलाना")

कई Regions और accounts या OUs में automations चलाना इस प्रकार काम करता है:

1. सत्यापित करें कि सभी Regions और accounts या OUs में, जिन संसाधनों पर आप automation चलाना चाहते हैं, वे समान tags का उपयोग करते हैं। यदि वे नहीं करते, तो आप उन्हें एक AWS resource group में जोड़ सकते हैं और उस group को लक्षित कर सकते हैं। अधिक जानकारी के लिए, *AWS Resource Groups and Tags User Guide* में [What are resource groups?](https://docs.aws.amazon.com/ARG/latest/userguide/) देखें।
1. उस खाते में साइन इन करें जिसे आप Automation केंद्रीय खाते के रूप में कॉन्फ़िगर करना चाहते हैं।
1. निम्नलिखित IAM roles बनाने के लिए इस विषय में [Setting up management account permissions for multi-Region and multi-account automation](https://docs.aws.amazon.com/systems-manager/latest/userguide/running-automations-multiple-accounts-regions.html) प्रक्रिया का उपयोग करें:
1. **AWS-SystemsManager-AutomationAdministrationRole** - यह role उपयोगकर्ता को कई accounts और OUs में automations चलाने की अनुमति देता है।
1. **AWS-SystemsManager-AutomationExecutionRole** - यह role उपयोगकर्ता को लक्षित accounts में automations चलाने की अनुमति देता है।
1. Runbook, Regions, और accounts या OUs चुनें जहाँ आप automation चलाना चाहते हैं।

**Multi-account/Region Automation के लिए विचार:**

* Resource Groups को लक्षित करते समय, resource group प्रत्येक लक्ष्य account और Region में मौजूद होना चाहिए
  * Resource group का नाम प्रत्येक लक्ष्य account और Region में बिल्कुल समान होना चाहिए
* Automations OUs के माध्यम से पुनरावर्ती रूप से नहीं चलते
  * Automation केवल उन OUs को लक्षित कर सकता है जिनमें accounts हों
* ग्राहकों को multi-account/Region के लिए आवश्यक IAM roles CloudFormation या IaC का उपयोग करके बनाने की अनुशंसा की जाती है

