---
sidebar_position: 2
---
# AWS Landing Zone का विस्तार

जैसे-जैसे AWS अपने वैश्विक footprint का विस्तार करता है, ऑर्गनाइज़ेशन्स को नई regions में अपनी क्लाउड उपस्थिति बढ़ाने के लिए एक संरचित दृष्टिकोण की आवश्यकता होती है। जैसे-जैसे AWS नई regions लॉन्च करता है, ऑर्गनाइज़ेशन अपने footprint का विस्तार करना चाहते हैं। यह मार्गदर्शन आपके AWS Organization या Landing Zone के विस्तार के लिए प्रमुख विचारों और सर्वोत्तम अभ्यासों की रूपरेखा प्रस्तुत करता है।

## नींव का निर्माण

व्यापक governance controls के साथ एक मजबूत क्लाउड नींव स्थापित करना केवल एक सर्वोत्तम अभ्यास नहीं है—यह आज के गतिशील क्लाउड एनवायरनमेंट में एक महत्वपूर्ण आवश्यकता है। जो ऑर्गनाइज़ेशन शुरुआत से ही मजबूत governance frameworks स्थापित करने में समय निवेश करते हैं, वे बढ़ने, अनुकूलित होने और सुरक्षा बनाए रखने के लिए बेहतर स्थिति में होते हैं। इसे एक घर बनाने जैसा समझें: एक ठोस नींव के बिना, कोई भी addition या modification तेजी से जोखिमपूर्ण और जटिल हो जाता है। Cloud governance controls, जिनमें Service Control Policies (SCPs), guardrails, और compliance frameworks शामिल हैं, architectural blueprints और building codes की तरह काम करते हैं जो सुनिश्चित करते हैं कि आपका क्लाउड इन्फ्रास्ट्रक्चर सुरक्षित, अनुपालन और प्रबंधनीय बना रहे। नई regions में विस्तार करते समय, इन controls का होना विस्तार प्रक्रिया को अधिक सुव्यवस्थित और सुरक्षित बनाता है। ऑर्गनाइज़ेशन अक्सर पाते हैं कि प्रारंभिक सेटअप के दौरान लागू करने की तुलना में बाद में governance controls को retrofit करना काफी अधिक चुनौतीपूर्ण और संसाधन-गहन है। governance के प्रति यह सक्रिय दृष्टिकोण न केवल सुरक्षा घटनाओं और अनुपालन उल्लंघनों को रोकने में मदद करता है बल्कि operational excellence बनाए रखते हुए बदलती व्यावसायिक आवश्यकताओं के अनुकूल होने का लचीलापन भी प्रदान करता है।

## Organization-First दृष्टिकोण बनाम Control Tower: प्रमुख अंतर

नई region में विस्तार करते समय, ग्राहकों के पास उनके मौजूदा सेटअप के आधार पर दो प्राथमिक मार्ग हैं। AWS Organizations एक manual लेकिन अत्यधिक लचीला दृष्टिकोण प्रदान करता है, जो implementation details पर granular control की अनुमति देता है। इस मार्ग में प्रत्येक सेवा के hands-on configuration और Service Control Policies के custom implementation की आवश्यकता होती है, लेकिन विशिष्ट आवश्यकताओं के लिए अधिकतम लचीलापन प्रदान करता है। इसके विपरीत, AWS Control Tower Account Factory के माध्यम से एक अधिक सुव्यवस्थित, automated दृष्टिकोण प्रदान करता है साथ ही pre-built governance controls और standardized guardrails के साथ। Control Tower multi-account setup प्रक्रिया को काफी सरल बनाता है, हालांकि शुद्ध Organizations दृष्टिकोण की तुलना में इसमें कम लचीलापन हो सकता है। इन मार्गों के बीच चुनाव अक्सर आपके मौजूदा इन्फ्रास्ट्रक्चर और विशिष्ट governance आवश्यकताओं पर निर्भर करता है।

## Governance और Security Controls

नई AWS regions में विस्तार करते समय एक अच्छी बात यह है कि कुछ आधारभूत सेवाएं, जैसे CloudTrail और AWS Billing, स्वचालित रूप से नई regions को अपनी मौजूदा configurations में शामिल कर लेती हैं। CloudTrail, जब सभी regions के लिए कॉन्फ़िगर किया गया हो, तो नई regions में API activity को स्वचालित रूप से लॉग करना शुरू कर देगा जैसे ही वे आपके अकाउंट के लिए उपलब्ध होती हैं, बिना किसी अतिरिक्त सेटअप की आवश्यकता के। इसी तरह, AWS Billing सभी सक्रिय regions में लागतों को स्वचालित रूप से consolidate करता है, AWS Cost Explorer और AWS Bills के माध्यम से एकीकृत cost management और reporting प्रदान करता है।

हालांकि, यह ध्यान रखना महत्वपूर्ण है कि जबकि ये सेवाएं स्वचालित रूप से अनुकूलित होती हैं, अन्य सुरक्षा और operational सेवाओं जैसे Service Control Policies, GuardDuty, Security Hub, और AWS Config को अभी भी आपके विस्तारित footprint की व्यापक कवरेज सुनिश्चित करने के लिए स्पष्ट regional enablement की आवश्यकता होती है।

## Access Control

AWS Identity and Access Management (IAM) उन खूबसूरत "set it and forget it" global services में से एक है जो आपके पूरे AWS footprint में बस काम करती है। जब आप किसी region में विस्तार कर रहे हैं, तो आपके मौजूदा IAM users, roles, और policies पहले से तैयार हैं - किसी अतिरिक्त configuration की आवश्यकता नहीं! यह ऐसा है जैसे आपकी सुरक्षा टीम आपके पहुंचने से पहले ही नए स्थान पर तैनात हो। आपके मौजूदा IAM principals को स्वचालित रूप से वही permissions होंगे जो अन्य regions में हैं (यह मानते हुए कि आपकी policies में region-specific restrictions शामिल नहीं हैं)। IAM की यह global प्रकृति एक बड़ी समय-बचत है और आपकी बढ़ती AWS उपस्थिति में सुसंगत access controls बनाए रखने में मदद करती है। बस याद रखें - जबकि IAM global है, कुछ resource-based policies और service-linked roles को regional विचार की आवश्यकता हो सकती है, इसलिए इसे अपनी expansion checklist में रखें।

## Service Control Policies

यदि आप AWS Control Tower का उपयोग कर रहे हैं, तो अच्छी खबर है - built-in guardrails और उनसे संबंधित Service Control Policies (SCPs) स्वचालित रूप से किसी भी नई region में अपनी सुरक्षा विस्तारित कर देंगे एक बार यह Control Tower में सक्षम हो जाए। हालांकि, यदि आप custom SCPs का उपयोग कर रहे हैं (चाहे Control Tower में हो या AWS Organizations में), तो आपको उन policies को मैन्युअल रूप से अपडेट करना होगा ताकि नई region शामिल हो। यह विशेष रूप से उन policies के लिए महत्वपूर्ण है जो region-specific controls या allowed-regions statements का उपयोग करती हैं। उदाहरण के लिए, यदि आपके पास एक SCP है जो स्पष्ट रूप से allowed regions की सूची देती है, तो आपको उस सूची में नई region जोड़नी होगी, उदाहरण के लिए:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AllowedRegions",
            "Effect": "Deny",
            "NotAction": [
                "cloudfront:*",
                "iam:*",
                "route53:*",
                "support:*"
            ],
            "Resource": "*",
            "Condition": {
                "StringNotLike": {
                    "aws:RequestedRegion": [
                        "ap-southeast-2",
                        "ap-southeast-4"  // Adding Asia Pacific (Melbourne) region
                    ]
                }
            }
        }
    ]
}
```

इन परिवर्तनों के बिना आपकी टीमें सोच सकती हैं कि वे resources क्यों नहीं लॉन्च कर पा रही हैं। इन policy updates को पहले non-production एनवायरनमेंट में परीक्षण करना याद रखें - हम हमेशा ग्राहक प्रभाव को कम करना चाहते हैं।


## AWS Config

Service Control Policies की तरह, जब आप AWS Control Tower का उपयोग कर रहे हैं, तो AWS Config को VIP उपचार मिलता है - यह Control Tower द्वारा support किए जाने पर किसी भी नई region में स्वचालित रूप से सक्षम और कॉन्फ़िगर हो जाता है। Rules, aggregators, और recorders बस स्वचालित रूप से दिखाई देते हैं। हालांकि, यदि आप Control Tower के बिना Organizations के माध्यम से AWS Config चला रहे हैं, तो आपको मैन्युअल रूप से वह रास्ता बनाना होगा। इसका मतलब है नई region में Config सक्षम करना, अपने rules (custom वालों को मत भूलिए!) डिप्लॉय करना, और aggregators सेट अप करना यदि आप उनका उपयोग कर रहे हैं। कई ग्राहक इस प्रक्रिया को स्वचालित करने के लिए CloudFormation StackSets का उपयोग करते हैं। याद रखें, चाहे automated हो या manual, सुसंगत AWS Config coverage बनाए रखना आपकी governance और compliance आवश्यकताओं के लिए महत्वपूर्ण है!

## अतिरिक्त Security Services

आइए AWS Security services की दुनिया में गोता लगाएं और जानें कि नई regions में विस्तार करते समय आपको क्या जानना चाहिए। globally-scoped IAM के विपरीत, अधिकांश AWS Security services को regional rollout strategy की आवश्यकता होती है - इसे प्रत्येक स्थान पर नए security offices खोलने जैसा समझें जहां आप operate करते हैं।

सबसे पहले, security dream team के बारे में बात करें: GuardDuty, Security Hub, Macie, और Detective। इनमें से प्रत्येक सेवा को नई region में स्पष्ट रूप से सक्षम करने की आवश्यकता है। यह "lift and shift" स्थिति नहीं है - आपको जानबूझकर प्रत्येक सेवा को सक्षम करना होगा। लेकिन यहां Organizations के साथ दिलचस्प बात यह है - आपकी delegated administrator account settings वास्तव में global हैं। एक बार जब आपने किसी account को security service के लिए delegated administrator के रूप में नामित कर दिया, तो वह account सभी regions में अपनी विशेष शक्तियां बनाए रखता है।

हालांकि, अभी भी काम करना बाकी है। delegated administrator account के साथ भी, आपको नई region में प्रत्येक security service को सक्षम करना होगा। उदाहरण के लिए, Security Hub के साथ, आपके delegated admin account को नई region में सेवा सक्षम करनी होगी और फिर member accounts से findings के aggregation को कॉन्फ़िगर करना होगा। GuardDuty के लिए भी यही लागू होता है - जबकि आपका delegated administrator designation कैरी ओवर होता है, आपको नई region में threat detection सक्षम करनी होगी और member accounts को accordingly कॉन्फ़िगर करना होगा।

एक प्रो टिप: कई builders इस regional enablement प्रक्रिया को स्वचालित करने के लिए AWS CloudFormation StackSets या अन्य tooling का उपयोग करते हैं। हमने देखा है कि regions में सुसंगत security controls बनाए रखने के लिए automation महत्वपूर्ण है। एक "new region security bootstrap" template बनाने पर विचार करें जो आपकी सभी आवश्यक security services को सक्षम और कॉन्फ़िगर करे - भविष्य में आप स्वयं को धन्यवाद देंगे!

और regional aggregation को मत भूलिए! यदि आप central security monitoring tools के रूप में Security Hub या GuardDuty का उपयोग कर रहे हैं, तो आप उस single-pane-of-glass view को बनाए रखने के लिए cross-region aggregation कॉन्फ़िगर करना चाहेंगे। अच्छी खबर यह है कि एक बार जब आपने अपना delegated administrator account सेट अप कर लिया और नई region में सेवा सक्षम कर दी, तो इसे अपनी aggregation configuration में जोड़ना आमतौर पर बस कुछ ही clicks दूर है।


## दृश्यता प्राप्त करना

आइए कुछ अक्सर अनदेखी की जाने वाली लेकिन बहुत महत्वपूर्ण सेवाओं के बारे में बात करें जिन पर नई regions में विस्तार करते समय ध्यान देने की आवश्यकता है। जब आप अपने regional expansion की योजना बना रहे हैं, तो अपने operational visibility tools को मत भूलिए - उन्हें भी कुछ देखभाल की आवश्यकता है। Resource Explorer, हमारी उपयोगी unified search service, यदि आप अपने सभी AWS resources का consolidated view बनाए रखना चाहते हैं तो आपको अपनी aggregator settings में नई regions जोड़ने की आवश्यकता है। इसी तरह, IAM Access Analyzer, आपका permissions guardian, नई region में सक्षम करने और व्यापक permissions insights बनाए रखने के लिए आपकी aggregation configuration में जोड़ने की आवश्यकता है। और CloudWatch Logs को मत भूलिए! यदि आप cross-account, cross-region centralized logging का उपयोग कर रहे हैं, तो आपको नई region को शामिल करने के लिए अपनी log routing और replication settings अपडेट करनी होंगी। प्रो टिप: कई builders एक centralized logging account बनाते हैं और single source of truth बनाए रखने के लिए CloudWatch Logs cross-region ऑब्ज़र्वेबिलिटी sink का उपयोग करते हैं। हम अनुशंसा करते हैं कि इन aggregation configurations को अपने regional expansion runbook में दस्तावेज करें - भविष्य में आप इन सभी चरणों को एक ही स्थान पर रखने की सराहना करेंगे!

## क्या गायब है?

उस चमकदार नई region में कूदने से पहले, आइए अपनी AWS service inventory के बारे में बात करें - यह सुनाने में जितना लगता है उससे कहीं अधिक रोमांचक है। एक सफल regional expansion से backwards काम करते हुए, आप अपने AWS service footprint का एक व्यापक मूल्यांकन बनाना चाहेंगे। स्पष्ट सेवाओं से आगे सोचें - निश्चित रूप से, हमने organizational services, security और compliance tools, monitoring और logging configurations को कवर किया है, और आप EC2 और S3 के बारे में जानते हैं। लेकिन उन Route 53 health checks, AWS Backup plans, या उन AWS Private Certificate Authorities के बारे में क्या जो आपने महीनों पहले सेट किए थे? एक service checklist बनाएं जिसमें आपके core infrastructure और supporting services शामिल हों। प्रो टिप: वर्तमान में आप जो सभी services उपयोग कर रहे हैं उन्हें खोजने में मदद के लिए AWS Resource Explorer या AWS Config का उपयोग करें - आपको कुछ भूले हुए खजाने मिल सकते हैं! प्रत्येक service के लिए, दस्तावेज करें कि यह global है, regional है, या विशिष्ट regional configuration की आवश्यकता है। यह मूल्यांकन आपका expansion playbook बन जाएगा, जो सुनिश्चित करेगा कि आप regions में सुसंगत capabilities बनाए रखें जबकि किसी भी "अरे, हम उस service को भूल गए" पलों से बचें। याद रखें, एक अच्छी तरह से नियोजित regional expansion एक सफल regional expansion है!

## Landing Zones के विषय पर

आइए AWS landing zones की अवधारणा और home region की महत्वपूर्ण भूमिका में गहराई से जाएं - यह multi-region deployments प्रबंधित करने वाले किसी भी व्यक्ति के लिए महत्वपूर्ण ज्ञान है!

अपने AWS Landing Zone को अपना क्लाउड मुख्यालय समझें, जहां home region आपके मुख्य कार्यालय के रूप में कार्य करती है। जब आप पहली बार AWS Control Tower सेट अप करते हैं या custom Landing Zone solution लागू करते हैं, तो आप एक home region चुनते हैं - और यह निर्णय कई लोगों की सोच से अधिक महत्वपूर्ण है। यह एक झंडा लगाने जैसा है जो कहता है, "यहां हमारी core configurations रहती हैं!"

आपकी home region में, Control Tower और इसके management components जैसी महत्वपूर्ण सेवाएं स्थापित होती हैं। इसमें Account Factory configurations, audit log archives, deployment pipelines, और अन्य foundational services शामिल हैं। जब आप अपनी Landing Zone को नई regions में विस्तारित करते हैं, तो आप अनिवार्य रूप से branch offices खोल रहे हैं जबकि अपना मुख्यालय मूल home region में बनाए रख रहे हैं। नई region governance controls विरासत में प्राप्त करती है और पूरी तरह से उपयोग की जा सकती है, लेकिन primary configurations और management components home region में ही रहते हैं।

यहां दिलचस्प बात आती है - और दिलचस्प से मतलब चुनौतीपूर्ण है! अपनी Landing Zone की home region को स्थानांतरित करना आपकी default AWS Console region बदलने जैसा नहीं है। यह व्यापार को सुचारू रूप से चालू रखते हुए अपनी कंपनी के मुख्यालय को नए शहर में स्थानांतरित करने की कोशिश करने जैसा है। आपको core services को decommission और redeploy करना होगा, logging aggregation को reconfigure करना होगा, organizational configurations को restructure करना होगा, और संभावित रूप से automation pipelines को rebuild करना होगा। इनमें से कई services, जैसे Control Tower का configuration data, audit logs, और AWS Organizations management, home region के साथ tightly coupled हैं।

आइए एक चित्र बनाएं कि home region स्थानांतरित करने में आमतौर पर क्या शामिल होगा:

* वर्तमान home region में Control Tower को decommission करना
* Core account structures को reconfigure करना
* IAM Identity Center configuration को decommission और redeploy करना
* Logging और audit architectures को rebuild करना
* Automation और pipeline configurations को redeploy करना
* Cross-account और cross-region service configurations को restructure करना
* Historical data और archives को migrate करना

यही कारण है कि अपनी home region चुनना उन "दो बार मापो, एक बार काटो" निर्णयों में से एक है। हम ऐसी home region चुनने की अनुशंसा करते हैं जो आपकी दीर्घकालिक भौगोलिक नीति और compliance आवश्यकताओं के अनुरूप हो। जबकि नई regions में विस्तार करना सीधा है, अपनी Landing Zone का home स्थानांतरित करना एक महत्वपूर्ण उपक्रम है जिसमें सावधानीपूर्वक योजना और execution की आवश्यकता होती है।

प्रो टिप: अपनी Landing Zone डिज़ाइन करते समय, अपनी home region dependencies को पूरी तरह से दस्तावेज करें। भले ही आप इसे स्थानांतरित करने की योजना कभी नहीं बनाते, इन relationships को समझना आपको नई regions में विस्तार करते समय बेहतर architectural निर्णय लेने में मदद करेगा। याद रखें, आपकी home region का चुनाव अन्य regions में operate करने की आपकी क्षमता को सीमित नहीं करता - यह बस आपके AWS एनवायरनमेंट का control center है।

## निष्कर्ष

निष्कर्ष में, अपनी AWS Landing Zone या Organization को एक region में विस्तारित करने के लिए विचारशील योजना और AWS services के regional behaviors की व्यापक समझ की आवश्यकता होती है। हमने महत्वपूर्ण पहलुओं को कवर किया है: foundational governance controls और security services से लेकर operational visibility tools और Landing Zone विचारों तक। याद रखें कि जबकि IAM और CloudTrail जैसी कुछ services स्वचालित रूप से नई regions को अपनाती हैं, अन्य को स्पष्ट enablement और configuration की आवश्यकता होती है। आपकी expansion यात्रा एक अच्छी तरह से दस्तावेज service inventory और आपकी Landing Zone की home region implications की स्पष्ट समझ द्वारा निर्देशित होनी चाहिए। इन सर्वोत्तम अभ्यासों और विचारों का पालन करके, आप अपने बढ़ते AWS footprint में सुसंगत सुरक्षा, compliance, और operational excellence बनाए रखने के लिए अच्छी तरह से सुसज्जित होंगे। सफलता की कुंजी संपूर्ण तैयारी, service-specific आवश्यकताओं को समझने, और एक मजबूत governance foundation बनाए रखने में है। जैसे-जैसे AWS अपने global infrastructure का विस्तार जारी रखता है, ये सिद्धांत भविष्य के regional expansions के लिए आपके मार्गदर्शक के रूप में कार्य करेंगे।

