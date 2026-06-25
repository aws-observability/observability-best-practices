---
sidebar_position: 4
---
# मौजूदा AWS Organization में Control Tower सक्षम करते समय अतिरिक्त विचार

## Control Tower अकाउंट्स

Control Tower को आपके AWS Organization के management account में सक्षम किया जाना चाहिए। एक ही AWS Organization में कई लैंडिंग ज़ोन होना संभव नहीं है।

जब आप शुरू में Control Tower को सक्षम करते हैं तो यह स्वचालित रूप से आपके organization में मौजूदा अकाउंट्स को enroll नहीं करेगा, लेकिन यह दो OUs, [shared accounts](https://docs.aws.amazon.com/controltower/latest/userguide/accounts.html#special-accounts) और [उनमें मौजूद resources](https://docs.aws.amazon.com/controltower/latest/userguide/shared-account-resources.html) बनाएगा। आपके Organization में इसकी अनुमति देने के लिए पर्याप्त कोटा उपलब्ध होना चाहिए।

यदि Control Tower सेट अप करते समय log archive या audit accounts के लिए [मौजूदा अकाउंट्स का उपयोग](https://aws.amazon.com/blogs/mt/use-existing-logging-and-security-account-with-aws-control-tower/) करने की आवश्यकता है, तो आप ऐसा कर सकते हैं, लेकिन आपको [config recorder को डिलीट](https://docs.aws.amazon.com/cli/latest/reference/configservice/delete-configuration-recorder.html) और [config delivery channel को डिलीट](https://docs.aws.amazon.com/cli/latest/reference/configservice/delete-delivery-channel.html) करना होगा। आम तौर पर Control Tower को ये अकाउंट्स बनाने देना और ज़रूरत पड़ने पर ऐतिहासिक लॉग्स कॉपी करना सरल है, लेकिन कुछ मामलों में, उदाहरण के लिए जहां आपके पास गैर-AWS सेवाओं के साथ मौजूदा लॉग इंटीग्रेशन हैं, मौजूदा अकाउंट्स का पुन: उपयोग करना आवश्यक हो सकता है।

## Identity Center

हम Control Tower के साथ AWS Identity Center का उपयोग करने की दृढ़ता से अनुशंसा करते हैं ताकि आपके उपयोगकर्ताओं के लिए authentication प्रदान किया जा सके। यदि आप Control Tower को Identity Center प्रबंधित नहीं करने देना चुनते हैं और आपके पास पहले से Identity Center सक्षम नहीं है, तो Control Tower इसे सक्षम नहीं करेगा और आपको अपने Organization के लिए एक वैकल्पिक identity समाधान लागू करना होगा।

यदि आपके पास कोई मौजूदा Identity Center कॉन्फ़िगर नहीं है और आप Identity Center प्रबंधन के लिए ऑप्ट-इन करते हैं, तो Control Tower सेवा को सक्षम करेगा और [आपकी identity source के चयन के आधार पर](https://docs.aws.amazon.com/controltower/latest/userguide/getting-started-prereqs.html#sso-considerations) groups और permission sets प्रोविज़न कर सकता है या नहीं भी कर सकता है।

यदि आपके पास पहले से Identity Center कॉन्फ़िगर है, तो यह आपके Control Tower home region के समान region में होना चाहिए। यदि आप Control Tower प्रबंधन के लिए ऑप्ट-इन करते हैं और यदि आप स्थानीय IAM Identity Center Directory का उपयोग कर रहे हैं, तो Control Tower आपके लिए users, groups और permission sets बनाएगा। यदि आप किसी अन्य directory का उपयोग कर रहे हैं तो [Control Tower कोई बदलाव नहीं करेगा](https://docs.aws.amazon.com/controltower/latest/userguide/about-extending-governance.html#sso-and-existing-orgs)।

यदि आपके पास IAM users या IAM federation का उपयोग करने वाला मौजूदा identity समाधान है, तो आपको Identity Center अपनाना चाहिए। Control Tower और Identity Center को सक्षम करने से आपके मौजूदा IAM users, roles और policies पर कोई प्रभाव नहीं पड़ेगा और मौजूदा IAM SAML कॉन्फ़िगरेशन प्रभावित नहीं होगा। इससे आप संक्रमण अवधि के दौरान दोनों सिस्टम समानांतर में चला सकते हैं जब तक कि आप अपने पुराने IAM Users / IAM federation को हटाने के लिए तैयार न हों।



## CloudTrail

यदि आप मौजूदा Organization में Control Tower के CloudTrail प्रबंधन को सक्षम करना चाहते हैं, तो आपको AWS Control Tower [pre-flight checks](https://docs.aws.amazon.com/controltower/latest/userguide/getting-started-prereqs.html) पास करने के लिए CloudTrail के लिए [trusted access अक्षम](https://docs.aws.amazon.com/organizations/latest/userguide/services-that-can-integrate-cloudtrail.html#integrate-disable-ta-cloudtrail) करना होगा।


यदि आप Control Tower के CloudTrail प्रबंधन से ऑप्ट आउट करते हैं, तो आप trails डिप्लॉय करने, लॉगिंग को केंद्रीकृत करने और अपनी trails की सुरक्षा के लिए किसी भी सुरक्षा उपाय को लागू करने के लिए जिम्मेदार होंगे। Control Tower किसी भी स्थिति में एक [organization trail बनाएगा](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/creating-trail-organization.html), लेकिन जब आप ऑप्ट-आउट करते हैं तो इसकी स्थिति off पर सेट होगी। हम अनुशंसा करते हैं कि Control Tower को आपके लिए CloudTrail प्रबंधित करने दें।


यदि आपके पास **account-level trails वाला मौजूदा Organization** है और आप Control Tower में CloudTrail प्रबंधन सक्षम करते हैं, तो यह एक नया Organizations management trail बनाएगा, जो log archive account में एक bucket में लॉग करने के लिए कॉन्फ़िगर किया गया है। यह आपकी मौजूदा trails को नहीं छूएगा, इसलिए यदि वे recording कर रही हैं तो आप अपने Organization में CloudTrail लागतों में महत्वपूर्ण वृद्धि देख सकते हैं क्योंकि किसी अकाउंट के लिए प्रत्येक region में management events की केवल पहली कॉपी मुफ्त है। account level trails से recording बंद करने से अतिरिक्त लागत नहीं आएगी।

यदि आपके पास **Organization trail वाला मौजूदा Organization** है और आप Control Tower प्रबंधन के लिए ऑप्ट-इन करते हैं, तो आपको [trusted access अक्षम](https://docs.aws.amazon.com/organizations/latest/userguide/services-that-can-integrate-cloudtrail.html#integrate-disable-ta-cloudtrail) करना होगा। जब आप ऐसा करते हैं, तो आपके अकाउंट्स में सभी organization trails वैसे भी गैर-कार्यात्मक हो जाएंगी, इसलिए आपको अपनी मौजूदा trail के लिए [लॉगिंग बंद](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-turning-off-logging.html) करनी चाहिए ताकि जब यह फिर से active हो जाए तो recording के लिए बिल न आए। फिर trusted access अक्षम करें और Control Tower सक्षम करें। इसके परिणामस्वरूप एक छोटी अवधि होगी जिसके दौरान आपके organization के लिए CloudTrail डेटा नहीं होगा, इसलिए इसे maintenance period के दौरान योजनाबद्ध करना आवश्यक है।


## Config

Control Tower के Config प्रबंधन से ऑप्ट आउट करना संभव नहीं है।

यदि आप मौजूदा Organization में Control Tower सक्षम कर रहे हैं तो आपको Control Tower [pre-launch checks](https://docs.aws.amazon.com/controltower/latest/userguide/getting-started-prereqs.html) पास करने के लिए [Config के लिए Trusted Access अक्षम](https://docs.aws.amazon.com/organizations/latest/userguide/services-that-can-integrate-config.html#integrate-disable-ta-config) सुनिश्चित करना होगा। Control Tower सक्षमता प्रक्रिया के दौरान trusted access को सक्षम करेगा।

यदि आप log archive और audit accounts के लिए मौजूदा अकाउंट्स का उपयोग करने की योजना बना रहे हैं तो आपको पहले उन अकाउंट्स से [सभी Config resources डिलीट](https://docs.aws.amazon.com/controltower/latest/userguide/existing-config-resources.html) करने होंगे।




## Backup

Control Tower का [AWS Backup इंटीग्रेशन](https://docs.aws.amazon.com/controltower/latest/userguide/backup.html) आपको प्रत्येक member account में एक vault, एक shared account में एक central vault और कुछ बुनियादी backup policies के साथ एक बुनियादी backup समाधान सेट अप करने में मदद कर सकता है। इसे OU स्तर पर सक्षम किया जा सकता है और व्यक्तिगत resources को संबंधित backup schedule के लिए लक्षित करने हेतु tag किया जा सकता है।

यदि आपके पास पहले से एक backup समाधान है तो आप Backup इंटीग्रेशन से ऑप्ट आउट कर सकते हैं।

Control Tower इंटीग्रेशन logically air-gapped vault डिप्लॉय नहीं करता है और बॉक्स से बाहर cross-region backup के लिए कॉन्फ़िगरेशन प्रदान नहीं करता है।


## मौजूदा OUs और अकाउंट्स पर governance का विस्तार

मौजूदा organization में Control Tower सक्षम करने से Organization में मौजूदा OUs और अकाउंट्स पर स्वचालित रूप से governance का विस्तार नहीं होता है। आपको उन्हें Control Governance के अंतर्गत लाने के लिए Control Tower का उपयोग करके [मौजूदा अकाउंट्स को enroll](https://docs.aws.amazon.com/controltower/latest/userguide/enroll-account.html) करना होगा।
 
अकाउंट्स को enroll करने के लिए कुछ [पूर्व-आवश्यकताएं](https://docs.aws.amazon.com/controltower/latest/userguide/enrollment-prerequisites.html) हैं:

* आपका लैंडिंग ज़ोन drift की स्थिति में नहीं होना चाहिए
* अकाउंट Organization का सदस्य होना चाहिए
* [AWSControlTowerExecution](https://docs.aws.amazon.com/controltower/latest/userguide/awscontroltowerexecution.html) role मौजूद होनी चाहिए और AdministratorAccess permissions होनी चाहिए
* Organization में [StackSets trusted access सक्षम](https://docs.aws.amazon.com/organizations/latest/userguide/services-that-can-integrate-cloudformation.html) होना चाहिए ताकि AWSControlTowerExecution role आप जिस अकाउंट को enroll कर रहे हैं उसमें [Control Tower resources डिप्लॉय](https://docs.aws.amazon.com/controltower/latest/userguide/enroll-account.html#what-happens-during-account-enrollment) कर सके।
* मौजूदा AWS Config resources को [डिलीट](https://docs.aws.amazon.com/controltower/latest/userguide/enroll-account.html#example-config-cli-commands) किया जाना चाहिए। यदि यह विकल्प नहीं है तो मौजूदा Config resources के उपयोग को सक्षम करने के लिए customer support के साथ एक [प्रक्रिया](https://docs.aws.amazon.com/controltower/latest/userguide/existing-config-resources.html) है। ध्यान दें कि यह मौजूदा log archive और audit accounts के लिए विकल्प नहीं है, जिनके Config resources डिलीट होने चाहिए।

मौजूदा AWS अकाउंट्स को AWS Control Tower में लाने का सबसे कुशल तरीका एक [संपूर्ण OU को register](https://docs.aws.amazon.com/controltower/latest/userguide/importing-existing.html) करना है। जब आप एक OU register करते हैं, तो इसके member accounts AWS Control Tower लैंडिंग ज़ोन में enrolled हो जाते हैं। AWSControlTowerExecution role आपके लिए accounts में जोड़ दी जाती है। OU में 1000 तक accounts हो सकते हैं।



## मौजूदा Controls

यदि आप preventative controls (SCP, RCPs) वाले OUs में मौजूदा अकाउंट्स enroll कर रहे हैं, तो सुनिश्चित करें कि ये [provisioning या enrolment actions को नहीं रोकते](https://docs.aws.amazon.com/controltower/latest/userguide/quick-account-provisioning.html#common-causes-for-enrollment-failure)। वैकल्पिक रूप से, यदि आपको इन controls की आवश्यकता है, तो अकाउंट्स को एक समर्पित Enrollment OU में enroll करें और फिर उन्हें उनके अंतिम गंतव्य पर ले जाएं।

मौजूदा preventative controls वाले अकाउंट्स और OUs पर governance का विस्तार करते समय AWS Organizations की कुछ [service limits](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_reference_limits.html) हैं जिन्हें आपको पार नहीं करना चाहिए:

* RCPs और SCPs के लिए अधिकतम policy size: 5120 characters
* अधिकतम OU nesting 5 levels
* एक OU या account से सीधे जुड़े अधिकतम 5 RCPs, 5 SCPs


Detective controls के लिए, यदि आपके पास किसी account में मौजूदा Config rules परिभाषित हैं, तो ये तब भी बनी रहेंगी जब आप अपने account को enroll करने के लिए Config recorder डिलीट करते हैं। जब आप account को Control Tower में enroll करते हैं और यह एक नया recorder बनाता है, तो rules का evaluation फिर से शुरू हो जाना चाहिए।

Control Tower के बाहर परिभाषित config rules की compliance state Control Tower डैशबोर्ड से दिखाई नहीं देगी।

यदि आप custom Config rules का उपयोग कर रहे हैं और अपने पूरे AWS Organization से compliance का एक व्यापक दृश्य प्राप्त करना चाहते हैं, तो [Cloud Intelligence Dashboards](https://catalog.workshops.aws/awscid/en-US) फ्रेमवर्क से [Config Resource Compliance Dashboard](https://catalog.workshops.aws/awscid/en-US/dashboards/additional/config-resource-compliance-dashboard) को लागू करने पर विचार करें।
