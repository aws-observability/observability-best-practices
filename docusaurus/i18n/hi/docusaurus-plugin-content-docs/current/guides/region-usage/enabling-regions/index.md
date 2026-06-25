---
sidebar_position: 1
---
# नई AWS Region कैसे सक्षम करें

तकनीकी चरणों में जाने से पहले, यह समझना महत्वपूर्ण है कि AWS regions दो श्रेणियों में आते हैं: Default Regions और Opt-in Regions। [उपलब्ध AWS regions](https://docs.aws.amazon.com/global-infrastructure/latest/regions/aws-regions.html), जैसे US East (N. Virginia), Europe (Ireland), या Asia Pacific (Sydney) (20 मार्च, 2019 से पहले लॉन्च किए गए), सभी AWS अकाउंट्स के लिए डिफ़ॉल्ट रूप से सक्षम हैं। हालांकि, Asia Pacific (New Zealand) या Mexico (Central) जैसे अन्य, कई नए AWS regions (20 मार्च, 2019 के बाद लॉन्च किए गए) की तरह, [Opt-in Regions](https://docs.aws.amazon.com/global-infrastructure/latest/regions/aws-regions.html) हैं। इसका मतलब है कि आपको अपने AWS अकाउंट(ओं) के लिए रिसोर्स डिप्लॉय करने से पहले इसे स्पष्ट रूप से सक्षम करना होगा। यह opt-in आवश्यकता AWS की नीति का हिस्सा है जो ग्राहकों को उनके भौगोलिक विस्तार पर बेहतर नियंत्रण बनाए रखने और विशिष्ट डेटा संप्रभुता आवश्यकताओं का पालन करने में मदद करती है।

आइए अब देखें कि इन Opt-in regions को कैसे सक्षम करें...

## सर्वोत्तम अभ्यास विचार

जबकि region को सक्षम करना सरल है, इस अवसर का उपयोग अपनी क्षेत्रीय नीति की योजना बनाने के लिए करें। विचार करें कि आप पहले कौन से वर्कलोड डिप्लॉय करेंगे और यदि आप कई AWS regions का उपयोग कर रहे हैं तो आप अपने रिसोर्सेज को regions में कैसे व्यवस्थित करेंगे। याद रखें, यह आपकी AWS यात्रा का पहला कदम है। एक बार region सक्षम हो जाने के बाद, आप अपनी नेटवर्किंग, सुरक्षा और अन्य आधारभूत सेवाओं को सेट अप करने के लिए आगे बढ़ सकते हैं।

आपकी सफलता में मदद के लिए, हम अनुशंसा करते हैं कि अपने organization में नई Region सक्षम करने से पहले निम्नलिखित पर विचार करें:

* कौन से organizational units (OUs) को नई region तक पहुंच की आवश्यकता है
* मौजूदा SCPs और permission boundaries पर प्रभाव
* आपकी टैगिंग नीति और cost allocation में आवश्यक परिवर्तन
* अनुपालन और सुरक्षा नीतियों के लिए आवश्यक संशोधन

यदि आप Control Tower एनवायरनमेंट का उपयोग कर रहे हैं तो region जोड़ने से पहले समीक्षा करें:

* वर्तमान control configurations जिन्हें replicate करने की आवश्यकता हो सकती है
* मौजूदा lifecycle events जो प्रभावित हो सकते हैं
* कस्टमाइज़्ड controls और automation जिन्हें विस्तारित करने की आवश्यकता है
* Resource sharing configurations जो नई region पर लागू होनी चाहिए
* Network configurations जिन्हें replicate करने की आवश्यकता है


## एक AWS अकाउंट में नई Region कैसे सक्षम करें

जो ऑर्गनाइज़ेशन अभी अपनी AWS यात्रा शुरू कर रहे हैं, उनके लिए एक AWS अकाउंट में नई Region सक्षम करना एक सीधी प्रक्रिया है। शुरू करने का तरीका यहां है:

1. सबसे पहले, administrative privileges वाले उपयोगकर्ता अकाउंट से अपने AWS Management Console में लॉग इन करें। लॉग इन करने के बाद, ऊपर दाईं ओर navigation bar में अपने अकाउंट नाम पर क्लिक करें जिससे एक dropdown menu दिखेगा। इस menu से "Account Settings" चुनें।
2. Account Settings पृष्ठ पर, नीचे स्क्रॉल करें जब तक आपको "Regions" अनुभाग नहीं मिल जाता। यहां AWS आपके अकाउंट के लिए उपलब्ध सभी opt-in regions की सूची देता है। उस region को खोजें जिसे आप opt-in करना चाहते हैं। इसके बगल में, आपको एक enable बटन या toggle मिलेगा।
3. Region को सक्षम करने के लिए क्लिक करें और प्रक्रिया पूरी होने तक प्रतीक्षा करें। इसमें आमतौर पर कुछ ही मिनट लगते हैं, लेकिन नई region में रिसोर्स डिप्लॉय करने का प्रयास करने से पहले प्रक्रिया को पूरा होने देना महत्वपूर्ण है।


## AWS Organizations का उपयोग करके नई AWS Regions सक्षम करना

जो ऑर्गनाइज़ेशन पहले से multi-account AWS एनवायरनमेंट में काम कर रहे हैं, उनके लिए नई region में विस्तार के लिए एक विचारशील और व्यवस्थित दृष्टिकोण की आवश्यकता है। अधिकांश स्थापित AWS ग्राहकों ने पहले से ही sophisticated account structures बनाई हैं, governance, billing consolidation, और service control policies (SCPs) के लिए AWS Organizations का उपयोग कर रहे हैं। आइए देखें कि ये ग्राहक अपने AWS estate में कुशलतापूर्वक नई regions कैसे सक्षम कर सकते हैं।

तकनीकी कार्यान्वयन आपके Organizations Management Account (जिसे पहले master account कहा जाता था) से शुरू होता है। एक अनुभवी AWS ग्राहक के रूप में, आप इस महत्वपूर्ण अकाउंट से परिचित होंगे जो आपकी organizational structure की जड़ के रूप में कार्य करता है।

अपने management account में region सक्षम करके शुरू करें:

1. अपने Organizations Management Account में साइन इन करें
2. AWS Organizations सेवा पर नेविगेट करें
3. AWS accounts सूची से Management account चुनें
4. Account Settings टैब एक्सेस करें
5. Regions सूची में आवश्यक region खोजें
6. Region सक्षम करें और पूर्ण होने तक प्रतीक्षा करें

Organization में प्रत्येक member account के लिए, आपको अपनी organizational strategy के आधार पर व्यवस्थित रूप से region सक्षम करनी होगी। इस प्रक्रिया को कई अकाउंट्स में स्वचालित करने के लिए AWS CloudFormation StackSets या AWS CLI scripts का उपयोग करने पर विचार करें, विशेष रूप से यदि आप दर्जनों या सैकड़ों अकाउंट्स का प्रबंधन कर रहे हैं।

## अपने Control Tower एनवायरनमेंट में नई Regions जोड़ना

जो उद्यम अपने multi-account एनवायरनमेंट को प्रबंधित करने के लिए AWS Control Tower का उपयोग कर रहे हैं, उनके लिए नई Regions सक्षम करने के लिए आपकी मौजूदा governance structure पर विचार करने की आवश्यकता है। आपके ऑर्गनाइज़ेशन ने guardrails, compliance controls, और automated account provisioning प्रक्रियाओं की स्थापना में महत्वपूर्ण प्रयास किया है। Landing Zone अपडेट विशेष रूप से महत्वपूर्ण है क्योंकि यह सुनिश्चित करता है कि सभी Control Tower governance controls नई region तक विस्तारित हों। इसमें शामिल हैं:

* Guardrails कार्यान्वयन
* Compliance मॉनिटरिंग
* Security controls
* Resource sharing configurations

आइए देखें कि इन controls को नई region तक कैसे विस्तारित करें, अपने Organizations Management Account से शुरू करते हुए:

1. पहले Organizations स्तर पर region सक्षम करें:
    1. AWS Organizations पर नेविगेट करें
    2. अपना Management account चुनें
    3. Account Settings एक्सेस करें
    4. Opt-in region सक्षम करें
    5. पूर्ण होने तक प्रतीक्षा करें
2. फिर Control Tower को नई region तक विस्तारित करें:
    1. Control Tower console एक्सेस करें
    2. Landing Zone settings पर जाएं
    3. "Modify settings" चुनें
    4. "Update Region Settings" तक आगे बढ़ें
    5. आवश्यक region(s) चुनें
    6. Update landing zone workflow पूरा करें


Control Tower द्वारा अपडेट पूरा करने के बाद, आपको निम्नलिखित करने होंगे:

* अपडेटेड landing zone settings लागू करने के लिए मौजूदा OUs को फिर से रजिस्टर करें या
* Account Factory के माध्यम से मौजूदा accounts अपडेट करें
* सत्यापित करें कि guardrails नई region में ठीक से लागू हैं
* पुष्टि करें कि CloudWatch alarms और AWS Config rules काम कर रहे हैं
* संबंधित customer managed SCPs (Service Control Policies) की समीक्षा और अपडेट करें

याद रखें, Control Tower में सफल region enablement के लिए धैर्य की आवश्यकता होती है - सभी automated processes को पूरा होने दें और workload deployment के साथ आगे बढ़ने से पहले प्रत्येक चरण को सत्यापित करें। मौजूदा governance structures पर प्रभाव का मूल्यांकन करने के लिए समय लें और workloads डिप्लॉय करने से पहले सुनिश्चित करें कि सभी आवश्यक controls स्थापित हैं।

## आपकी नई AWS Region सक्षम करने के बाद क्या होता है

नई Region को सफलतापूर्वक सक्षम करना आपकी क्षेत्रीय विस्तार यात्रा की शुरुआत मात्र है। जैसे ही region आपके AWS Management Console के region selector में दिखाई देती है, यह नीतिक रूप से सोचने का समय है कि इस नए इन्फ्रास्ट्रक्चर का लाभ कैसे उठाया जाए जबकि आपके ऑर्गनाइज़ेशन की governance और सुरक्षा मानकों को बनाए रखा जाए। कुछ सेवाएं, जैसे CloudTrail logging या Cost and Usage reports, नई region को स्वचालित रूप से शामिल कर लेंगी।

आपका तत्काल ध्यान अपने मौजूदा AWS इन्फ्रास्ट्रक्चर और governance frameworks को नई region तक विस्तारित करने पर होना चाहिए। हम इस विषय को अपने Extending Your AWS Landing Zone to a new Region मार्गदर्शन में कवर करते हैं।

याद रखें कि जबकि region सक्षम करने के तकनीकी चरण सीधे हो सकते हैं, वास्तविक मूल्य सावधानीपूर्वक योजना, व्यवस्थित कार्यान्वयन, और संपूर्ण सत्यापन से आता है। automation, governance, और सुरक्षा में आपके मौजूदा निवेश आपकी नई region तक सहजता से विस्तारित होने चाहिए, आपके संपूर्ण AWS footprint में एक सुसंगत, सुरक्षित और अनुपालन एनवायरनमेंट बनाते हुए। इस अगले अनुभाग में अपनी foundations और governance के विस्तार के बारे में हमारा आगे का मार्गदर्शन देखें।


