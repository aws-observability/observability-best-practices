---
sidebar_position: 4
---

# JITNA Cedar पॉलिसी उदाहरण

इस अनुभाग में Systems Manager just-in-time node access (JITNA) का उपयोग करते समय पॉलिसी उदाहरणों के नमूनों का संग्रह है। ये नमूने AWS ग्राहकों को Cedar पॉलिसियों को लागू करने के तरीके सिखाने के लिए डिज़ाइन किए गए हैं, जिनसे just-in-time node session अनुरोधों के लिए स्वचालित पहुँच को अनुमति या अस्वीकार किया जा सकता है।

just-in-time node access के स्कीमा के बारे में अधिक जानकारी के लिए, [ऑटो-अप्रूवल और डेनाई-एक्सेस पॉलिसियों के लिए स्टेटमेंट संरचना और बिल्ट-इन ऑपरेटर्स](https://docs.aws.amazon.com/systems-manager/latest/userguide/auto-approval-deny-access-policy-statement-structure.html) देखें। Cedar पॉलिसियों को लिखने के बारे में [Cedar playground](https://www.cedarpolicy.com/en/playground) में और जानें।

कृपया ध्यान रखें कि यह सैंपल कोड है और किसी भी प्रोडक्शन एनवायरनमेंट में उपयोग से पहले इसे डेवलपमेंट एनवायरनमेंट में अच्छी तरह से परीक्षण और मान्य किया जाना चाहिए।

## ऑन-कॉल IDC ग्रुप के लिए प्रोडक्शन नोड्स पर स्वचालित पहुँच की अनुमति

निम्नलिखित उदाहरण इनके लिए स्वचालित पहुँच की अनुमति देता है:

* किसी भी आइडेंटिटी को डेवलपमेंट नोड्स पर, जो टैग की-वैल्यू पेयर `Environment:DEV` द्वारा पहचाने जाते हैं।
* AWS Identity Center (IDC) ग्रुप **OnCall** के उपयोगकर्ताओं को प्रोडक्शन नोड्स पर पहुँच, जो टैग की-वैल्यू पेयर `Environment:PROD` द्वारा पहचाने जाते हैं।

```language=cedar
// Permit automatic access to DEV nodes
permit (principal, 
      action == AWS::SSM::Action::"getTokenForInstanceAccess", 
      resource)
    when {
    resource.hasTag("Environment") && 
    resource.getTag("Environment") == "DEV"
    };

// Permit automatic access to PROD nodes for OnCall users
// OnCall IDC Group ID: 34688438-1061-702c-a03d-1fa788dccfd1
permit (principal in AWS::IdentityStore::Group::"34688438-1061-702c-a03d-1fa788dccfd1", 
      action == AWS::SSM::Action::"getTokenForInstanceAccess", 
      resource)
    when {
    resource.hasTag("Environment") && 
    resource.getTag("Environment") == "PROD"
    };
```
