---
sidebar_position: 5
---
# AWS Control Tower

### AWS Control Tower किस समस्या को हल करता है?

AWS Control Tower उन संगठनों की मदद करता है जिनके पास कई AWS अकाउंट और टीमें हैं जिन्हें अनुपालन सुनिश्चित करते हुए बड़े पैमाने पर अपने [मल्टी-अकाउंट AWS एनवायरनमेंट](https://docs.aws.amazon.com/whitepapers/latest/organizing-your-aws-environment/organizing-your-aws-environment.html) को सेट अप और गवर्न करने का एक सीधा तरीका चाहिए।

### क्या AWS Control Tower का उपयोग करने के लिए अतिरिक्त लागत है?

AWS Control Tower का उपयोग करने के लिए कोई अतिरिक्त शुल्क या अग्रिम प्रतिबद्धताएं नहीं हैं। आप केवल उन AWS सेवाओं के लिए भुगतान करते हैं जो AWS Control Tower द्वारा सक्षम हैं और जो सेवाएं आप अपने landing zone में उपयोग करते हैं।

### AWS Control Tower में controls (guardrails) क्या हैं?

[Controls](https://docs.aws.amazon.com/controltower/latest/controlreference/controls.html), जिन्हें पहले guardrails कहा जाता था, सुरक्षा, ऑपरेशन और अनुपालन के लिए स्पष्ट रूप से परिभाषित नियम हैं जो गैर-अनुरूप संसाधनों के डिप्लॉयमेंट को रोकने और लगातार डिप्लॉय किए गए संसाधनों की अनुपालन निगरानी करने में मदद करते हैं।

### AWS Control Tower किस प्रकार के controls प्रदान करता है?

AWS Control Tower तीन मुख्य प्रकार के controls प्रदान करता है:

1. [Preventive controls](https://docs.aws.amazon.com/controltower/latest/controlreference/preventive-controls.html): ये actions को होने से रोकते हैं। ये AWS Organizations में Service Control Policies (SCPs) का उपयोग करके लागू किए जाते हैं।
2. [Detective controls](https://docs.aws.amazon.com/controltower/latest/controlreference/detective-controls.html): ये विशिष्ट इवेंट या संसाधनों की गैर-अनुपालन का पता लगाते हैं और डैशबोर्ड के माध्यम से अलर्ट प्रदान करते हैं। ये AWS Config rules का उपयोग करके लागू किए जाते हैं।
3. [Proactive controls](https://docs.aws.amazon.com/controltower/latest/controlreference/proactive-controls.html): ये जांचते हैं कि क्या संसाधन प्रोविज़न होने से पहले आपकी कंपनी की नीतियों के अनुरूप हैं। Proactive controls AWS CloudFormation hooks के साथ लागू किए जाते हैं।

### AWS Control Tower कौन सी AWS सेवाओं का ऑर्केस्ट्रेशन करता है?

AWS Control Tower [कई AWS सेवाओं](https://docs.aws.amazon.com/controltower/latest/userguide/integrated-services.html) का ऑर्केस्ट्रेशन करता है जिसमें AWS Organizations, AWS Service Catalog, AWS IAM Identity Center, AWS CloudTrail, और AWS Config शामिल हैं।

### क्या मैं AWS Control Tower के साथ अपने मौजूदा identity provider का उपयोग कर सकता हूं?

AWS Control Tower identity provider इंटीग्रेशन के लिए तीन विकल्प प्रदान करता है:
1. IAM Identity Center User Store: यह डिफ़ॉल्ट विकल्प है।
2. Active Directory: जब AWS Control Tower Active Directory के साथ सेट अप किया जाता है।
3. External Identity Provider (IdP): Microsoft Entra ID, Google Workspace या Okta जैसे बाहरी IdPs से मौजूदा users को निर्दिष्ट कर सकते हैं।

कृपया ध्यान दें कि आपके पास AWS Control Tower को सेट अप करने की बजाय AWS IAM Identity Center को [self-manage](https://docs.aws.amazon.com/controltower/latest/userguide/select-idp.html) करने का विकल्प है।

### क्या मेरा डेटा एन्क्रिप्टेड है और क्या मैं अपनी AWS Key Management Service key का उपयोग कर सकता हूं?

AWS Control Tower आपके landing zone के लिए दो मुख्य एन्क्रिप्शन विकल्प प्रदान करता है: डिफ़ॉल्ट एन्क्रिप्शन (SSE-S3) और AWS KMS एन्क्रिप्शन (वैकल्पिक बढ़ी हुई सुरक्षा)।

### क्या मैं AWS में उपलब्ध कुछ रीजन तक एक्सेस सीमित करने के लिए AWS Control Tower का उपयोग कर सकता हूं?

AWS Control Tower enrolled अकाउंट के लिए विशिष्ट रीजन में AWS सेवाओं तक एक्सेस सीमित करने के लिए [Region deny](https://docs.aws.amazon.com/controltower/latest/userguide/region-how.html) क्षमताएं प्रदान करता है।

### मौजूदा AWS Config संसाधनों वाले मौजूदा AWS अकाउंट कैसे enroll करें

AWS Config संसाधनों वाले मौजूदा अकाउंट को AWS Control Tower में माइग्रेट करने के लिए, आपको एक विशिष्ट [5-चरणीय प्रक्रिया](https://docs.aws.amazon.com/controltower/latest/userguide/existing-config-resources.html) का पालन करना होगा।

### Drift क्या है और control tower drift और कॉन्फ़िगरेशन को कैसे संभालें

AWS Control Tower में Drift तब होता है जब AWS Control Tower के बाहर कॉन्फ़िगरेशन परिवर्तन किए जाते हैं, जिससे संसाधन गवर्नेंस आवश्यकताओं के अनुरूप नहीं रहते। AWS Control Tower पता लगाए गए drift के प्रकार के आधार पर विभिन्न [उपचार विकल्प](https://docs.aws.amazon.com/controltower/latest/userguide/resolving-drift.html) प्रदान करता है।

### AWS Control Tower अकाउंट कस्टमाइज़ेशन विकल्प क्या हैं?

AWS Control Tower अकाउंट कस्टमाइज़ करने के लिए कई विकल्प प्रदान करता है:
1. [Account Factory Customization](https://docs.aws.amazon.com/controltower/latest/userguide/af-customization-page.html) (AFC)
2. [Customizations for AWS Control Tower](https://docs.aws.amazon.com/controltower/latest/userguide/cfct-overview.html) (CfCT)
3. [AWS Control Tower Account Factory for Terraform](https://docs.aws.amazon.com/controltower/latest/userguide/taf-account-provisioning.html) (AFT)

### क्या मैं CfCT के लिए कॉन्फ़िगरेशन सोर्स के रूप में GitHub का उपयोग कर सकता हूं?

हां, GitHub को Customizations for AWS Control Tower (CfCT) के लिए कॉन्फ़िगरेशन सोर्स के रूप में उपयोग किया जा सकता है।

### क्या मैं AFT रिपॉजिटरी के रूप में GitHub का उपयोग कर सकता हूं?

हां, आप AWS Control Tower Account Factory for Terraform (AFT) को AWS CodeCommit से किसी अन्य VCS प्रोवाइडर में माइग्रेट कर सकते हैं।

### क्या मैं AFT के साथ OpenTofu का उपयोग कर सकता हूं?

OpenTofu एक लोकप्रिय ओपन सोर्स infrastructure as code (IaC) टूल है जो Terraform से fork किया गया है। OpenTofu में एक मॉड्यूल है - sourcefuse/arc-control-tower-aft जो कुछ tweaks के साथ AFT functions का समर्थन कर सकता है, हालांकि, यह AWS द्वारा समर्थित नहीं है।

### क्या मैं अपने CfCT के लिए VCS के रूप में Gitlab का उपयोग कर सकता हूं?

नहीं, CfCT के लिए Gitlab सपोर्ट अभी तक उपलब्ध नहीं है। आप v2.8.1 से Github को VCS के रूप में उपयोग कर सकते हैं।

### मेरे पास पहले से Landing Zone Accelerator (LZA) डिप्लॉय है, क्या मैं अभी भी AWS Control Tower का उपयोग कर सकता हूं?

AWS Control Tower और Landing Zone Accelerator (LZA) पूरक समाधानों के रूप में अच्छी तरह से एक साथ काम करते हैं। अनुशंसित सर्वोत्तम प्रथा यह है कि पहले AWS Control Tower को अपने मूलभूत landing zone के रूप में डिप्लॉय करें, और फिर आवश्यकतानुसार इसकी क्षमताओं को LZA के साथ बढ़ाएं।

### क्या मैं AWS Control Tower सेटअप के साथ इंटरैक्ट करने के लिए API का उपयोग कर सकता हूं?

AWS Control Tower [कई APIs](https://docs.aws.amazon.com/controltower/latest/APIReference/Welcome.html) प्रदान करता है जो आपको Control APIs, Landing Zone APIs, और Baseline APIs सहित विभिन्न कार्यों को ऑटोमेट करने की अनुमति देती हैं।

### Control Tower द्वारा बनाए गए अकाउंट के लिए ईमेल पता कैसे बदलें?

AWS Control Tower में enrolled सदस्य अकाउंट का ईमेल पता बदलने के लिए, root user पासवर्ड रिकवर करें, अकाउंट में साइन इन करें, ईमेल पता बदलें, और Service Catalog में provisioned product अपडेट करें।

### इंटर-नेटवर्किंग कनेक्टिविटी विचार

AWS Control Tower डिफ़ॉल्ट रूप से एक organizational unit (OU) के भीतर बनाए गए प्रत्येक अकाउंट के लिए प्रत्येक VPC को समान CIDR रेंज (172.31.0.0/16) असाइन करता है। VPC peering का समर्थन करने के लिए, Account Factory सेटिंग्स में CIDR रेंज को संशोधित करें।

### हमारे पास पहले से मौजूदा security और logging अकाउंट हैं, क्या मैं AWS Control Tower के लिए audit और logging अकाउंट के रूप में मौजूदा अकाउंट का उपयोग कर सकता हूं?

हां, AWS Control Tower प्रारंभिक landing zone सेटअप प्रक्रिया के दौरान मौजूदा AWS अकाउंट को आपके audit (security) और log archive (logging) अकाउंट के रूप में निर्दिष्ट करने का विकल्प प्रदान करता है।

### क्या AWS Control Tower nested OU का समर्थन करता है

हां, AWS Control Tower nested organizational units (OUs) का समर्थन करता है। nested OU पदानुक्रम AWS Control Tower में अधिकतम पांच स्तर गहरा हो सकता है।

### क्या AWS Control Tower AWS GovCloud में समर्थित है?

हां AWS Control Tower [GovCloud में समर्थित](https://docs.aws.amazon.com/govcloud-us/latest/UserGuide/govcloud-controltower.html) है, हालांकि सख्त अनुपालन और परिचालन आवश्यकताओं के कारण commercial regions से कुछ भिन्नताएं हैं।

### क्या AWS Control Tower resource control policies (RCPs) का उपयोग करता है?

AWS Control Tower अब resource control policies (RCPs) के साथ लागू preventive controls का समर्थन करता है। ये RCP-based controls आपके AWS Control Tower एनवायरनमेंट में संसाधनों को अनपेक्षित एक्सेस से बचाने के लिए एक data perimeter स्थापित करने में मदद करते हैं।

### कार्यान्वयन से पहले OUs पर policies का परीक्षण कैसे करें

Policy Staging OU प्रोडक्शन में डिप्लॉय करने से पहले AWS policies, controls, और सेवाओं के परीक्षण और सत्यापन के लिए एक नियंत्रित एनवायरनमेंट के रूप में कार्य करता है।
