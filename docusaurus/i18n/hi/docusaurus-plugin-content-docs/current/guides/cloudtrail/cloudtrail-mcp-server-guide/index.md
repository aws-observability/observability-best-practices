# सुरक्षा, ऑडिट और संचालन के लिए CloudTrail MCP Server का उपयोग

## परिचय

[CloudTrail Model Context Protocol (MCP)](https://awslabs.github.io/mcp/servers/cloudtrail-mcp-server) server [Kiro](https://kiro.dev/cli/) जैसे एजेंट्स को प्राकृतिक भाषा के माध्यम से सीधे [AWS CloudTrail](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html) events को क्वेरी और विश्लेषित करने में सक्षम बनाता है। अपने एजेंट्स को [CloudWatch Logs](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/send-cloudtrail-events-to-cloudwatch-logs.html) या [CloudTrail Lake](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-lake.html) में CloudTrail events से जोड़कर, आप जटिल SQL क्वेरीज लिखने या मैन्युअल रूप से JSON लॉग्स पार्स करने के बजाय संवादात्मक प्रॉम्प्ट्स के माध्यम से सुरक्षा इंसिडेंट्स की जाँच, अकाउंट एक्टिविटी का ऑडिट, परिचालन समस्याओं का निवारण, और अनुपालन रिपोर्ट्स जनरेट कर सकते हैं।

## यह क्यों महत्वपूर्ण है

सुरक्षा, अनुपालन और संचालन टीमें AWS अकाउंट एक्टिविटी को समझने के लिए CloudTrail लॉग्स का एनालिसिस करने में महत्वपूर्ण समय व्यतीत करती हैं:

- **सुरक्षा टीमों** को संदिग्ध गतिविधि की त्वरित जाँच करनी होती है, अनधिकृत पहुँच प्रयासों को ट्रैक करना होता है, और कई अकाउंट्स में संभावित सुरक्षा इंसिडेंट्स के दायरे की पहचान करनी होती है
- **अनुपालन टीमों** को यह दिखाने वाली ऑडिट रिपोर्ट्स जनरेट करनी होती हैं कि किसने किन रिसोर्सेज को एक्सेस किया, परिवर्तन कब किए गए, और गतिविधियाँ ऑर्गनाइज़ेशनात्मक नीतियों के अनुरूप हैं या नहीं
- **संचालन टीमें** API कॉल्स ट्रेस करके, कॉन्फ़िगरेशन परिवर्तनों की पहचान करके, और समस्याओं तक ले जाने वाली events के अनुक्रम को समझकर सेवा व्यवधानों का निवारण करती हैं
- **सभी टीमें** CloudWatch Logs Insights क्वेरी सिंटैक्स, JSON पार्सिंग, और समय अवधि तथा अकाउंट्स में events को सहसंबंधित करने में कठिनाई का अनुभव करती हैं

CloudTrail MCP server के बिना, टीमों को जटिल क्वेरीज लिखनी पड़ती हैं, मैन्युअल रूप से JSON लॉग्स पार्स करने पड़ते हैं, या कस्टम डैशबोर्ड बनाने पड़ते हैं - जो महत्वपूर्ण सुरक्षा और परिचालन वर्कफ़्लो में समय, जटिलता और मानवीय त्रुटि की संभावना जोड़ता है।

## यह कैसे काम करता है

CloudTrail MCP server प्राकृतिक भाषा प्रश्नों को आपके CloudTrail डेटा के विरुद्ध क्वेरीज में अनुवादित करता है, उन्हें निष्पादित करता है, और संदर्भ और अंतर्दृष्टि के साथ मानव-पठनीय परिणाम लौटाता है।

**समर्थित डेटा स्रोत:**

- **CloudWatch Logs**: [CloudWatch Logs Insights क्वेरी सिंटैक्स](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html) का उपयोग करता है - MCP server स्वचालित रूप से उपलब्ध लॉग ग्रुप्स खोजता है
- **CloudTrail Lake**: [SQL क्वेरीज](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/query-create-edit-query.html) का उपयोग करता है - MCP server स्वचालित रूप से CloudTrail Lake के लिए उपलब्ध event data stores खोजता है

**प्रमुख क्षमताएँ:**

- क्वेरी सिंटैक्स लिखने के बजाय प्राकृतिक भाषा क्वेरीज
- मल्टी-अकाउंट सपोर्ट
- समय-आधारित एनालिसिस और इवेंट सहसंबंध
- सुरक्षा जाँच, अनुपालन रिपोर्टिंग, और परिचालन समस्या निवारण

## सेटअप आवश्यकताएँ

CloudTrail MCP server का उपयोग करने के लिए, आपको चाहिए:

**CloudWatch Logs के लिए:**
- [CloudWatch Logs को events भेजने के लिए कॉन्फ़िगर किया गया AWS CloudTrail](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/send-cloudtrail-events-to-cloudwatch-logs.html)
- IAM अनुमतियाँ: `logs:StartQuery`, `logs:GetQueryResults`, `logs:DescribeLogGroups`
- MCP server स्वचालित रूप से उपलब्ध CloudTrail लॉग ग्रुप्स खोजेगा

**CloudTrail Lake के लिए:**
- [CloudTrail Lake event data store](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/query-event-data-store.html) बनाया और कॉन्फ़िगर किया गया
- IAM अनुमतियाँ: `cloudtrail:StartQuery`, `cloudtrail:GetQueryResults`, `cloudtrail:DescribeEventDataStores`, `cloudtrail:ListEventDataStores` ([CloudTrail Lake अनुमतियाँ](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/lake-permissions.html) देखें)
- MCP server स्वचालित रूप से उपलब्ध CloudTrail Lake event data stores खोजेगा

**दोनों के लिए:**
- आपके एजेंट में MCP server कॉन्फ़िगर किया गया
- उचित अनुमतियों के साथ AWS क्रेडेंशियल्स

## कॉन्फ़िगरेशन

अपने एजेंट में CloudTrail MCP server कॉन्फ़िगर करने के लिए, [AWS MCP Servers डॉक्यूमेंटेशन](https://awslabs.github.io/mcp/) में सेटअप निर्देशों का पालन करें। MCP server स्वचालित रूप से आपके AWS अकाउंट में उपलब्ध CloudTrail डेटा स्रोतों (CloudWatch Logs और CloudTrail Lake) को खोजता है।

**अपने प्रॉम्प्ट्स में**, आप वैकल्पिक रूप से निर्दिष्ट कर सकते हैं कि कौन सा डेटा स्रोत क्वेरी करना है:

```
Using CloudWatch Logs, show me all failed login attempts in the last 24 hours.
```

```
Using CloudTrail Lake, show me all IAM policy changes in the last 90 days.
```

## वास्तविक कार्यों के लिए सैंपल प्रॉम्प्ट्स

### सुरक्षा जाँच प्रॉम्प्ट्स

#### 1. विफल लॉगिन प्रयासों की जाँच

**प्रॉम्प्ट:**
```
Show me all failed console login attempts in the last 24 hours. 
Include the username, source IP address, and timestamp.
```

**यह क्या करता है:** [CloudTrail event records](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-event-reference-record-contents.html) का एनालिसिस करके संभावित ब्रूट फ़ोर्स हमलों या समझौता किए गए क्रेडेंशियल्स की पहचान करता है

**उपयोग मामला:** सुरक्षा टीम को कई विफल लॉगिन्स के बारे में अलर्ट प्राप्त होता है और खतरे के स्तर का आकलन करना होता है

---

#### 2. विशेषाधिकार वृद्धि की पहचान

**प्रॉम्प्ट:**
```
Show me all IAM policy changes in the last 48 hours. 
Focus on policies that grant admin permissions or modify IAM roles.
```

**यह क्या करता है:** संभावित विशेषाधिकार वृद्धि प्रयासों का पता लगाता है

**उपयोग मामला:** सुरक्षा टीम जाँच करती है कि क्या किसी अभिकर्ता ने उन्नत अनुमतियाँ प्राप्त कीं

---

### अनुपालन और ऑडिट प्रॉम्प्ट्स

#### 3. उपयोगकर्ता गतिविधि रिपोर्ट जनरेट करें

**प्रॉम्प्ट:**
```
Generate a complete audit report for IAM user demo.user for the month of January 2024. 
Include all API calls, resources accessed, and any permission changes.
```

**यह क्या करता है:** व्यापक उपयोगकर्ता गतिविधि ऑडिट ट्रेल बनाता है

**उपयोग मामला:** एक निश्चित अवधि के लिए गतिविधि टाइमलाइन प्रदान करने की आवश्यकता

---

#### 4. MFA उपयोग ट्रैक करें

**प्रॉम्प्ट:**
```
Show me all console logins in the last month. Which users logged in without MFA? 
How many times did each user login?
```

**यह क्या करता है:** पूरे ऑर्गनाइज़ेशन में MFA अनुपालन को मान्य करता है

**उपयोग मामला:** सुरक्षा नीति के अनुसार सभी उपयोगकर्ताओं के लिए MFA आवश्यक है; गैर-अनुपालक अकाउंट्स की पहचान करें

---

### परिचालन समस्या निवारण प्रॉम्प्ट्स

#### 5. सेवा आउटेज की जाँच

**प्रॉम्प्ट:**
```
Our application stopped working at 2024-01-15 14:30 UTC. Show me all API calls 
related to our production VPC (vpc-abc123) in the 30 minutes before the outage. 
What changed?
```

**यह क्या करता है:** सेवा व्यवधान का कारण बने कॉन्फ़िगरेशन परिवर्तनों की पहचान करता है

**उपयोग मामला:** संचालन टीम को आउटेज के मूल कारण की तुरंत पहचान करनी होती है

---

#### 6. IAM अनुमति समस्याओं को डीबग करें

**प्रॉम्प्ट:**
```
User reports they can't create EC2 instances. Show me all EC2 RunInstances calls 
from user demo.user in the last 2 hours, including any access denied errors. 
What permissions are missing?
```

**यह क्या करता है:** IAM अनुमति समस्याओं का निदान करता है

**उपयोग मामला:** उपयोगकर्ता आवश्यक कार्य नहीं कर सकता; लुप्त अनुमतियों की पहचान करें

---

### उन्नत मल्टी-अकाउंट प्रॉम्प्ट्स

#### 7. क्रॉस-अकाउंट सुरक्षा समीक्षा

**प्रॉम्प्ट:**
```
Across all our AWS accounts, show me any security group rules that allow inbound 
traffic from 0.0.0.0/0 on ports other than 80 and 443. When were these rules created 
and by whom?
```

**यह क्या करता है:** पूरे AWS ऑर्गनाइज़ेशन में सुरक्षा जोखिमों की पहचान करता है

**उपयोग मामला:** सुरक्षा टीम ऑर्गनाइज़ेशन-व्यापी सुरक्षा स्थिति समीक्षा करती है

**नोट:** मल्टी-अकाउंट क्वेरीज के लिए [organization event data store](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-lake-organizations.html) के साथ CloudTrail Lake या CloudWatch Logs को डिलीवर किए जाने वाले organization trail की आवश्यकता है।

---

#### 8. अकाउंट्स में अनुपालन

**प्रॉम्प्ट:**
```
For production accounts (account IDs: 111111111111, 222222222222, 333333333333), 
show me any CloudTrail configuration changes in the last year. Has logging ever 
been disabled?
```

**यह क्या करता है:** पूरे ऑर्गनाइज़ेशन में ऑडिट लॉगिंग अनुपालन को मान्य करता है

**उपयोग मामला:** अनुपालन ऑडिट के लिए निरंतर लॉगिंग का प्रमाण आवश्यक है

---

### CloudTrail को VPC Flow Logs के साथ जोड़ना

जब CloudTrail और [VPC Flow Logs](https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html) दोनों CloudWatch Logs को भेजे जाते हैं, तो आप व्यापक सुरक्षा जाँच के लिए API actions को नेटवर्क ट्रैफ़िक के साथ सहसंबंधित कर सकते हैं।

#### 9. कनेक्टिविटी समस्याओं का निवारण

**प्रॉम्प्ट:**
```
Application team reports connectivity issues to RDS database at 10:15 AM today. 
Check VPC Flow Logs for rejected connections to the database subnet around that time, 
then check CloudTrail for any security group, NACL, or route table changes in the 
30 minutes before the issue started.
```

**यह क्या करता है:** पहचानता है कि कनेक्टिविटी समस्याएँ कॉन्फ़िगरेशन परिवर्तनों से हैं या नेटवर्क समस्याओं से

**उपयोग मामला:** संचालन टीम को एप्लिकेशन आउटेज को जल्दी हल करना होता है

---

#### 10. लेटरल मूवमेंट का पता लगाना

**प्रॉम्प्ट:**
```
CloudTrail shows user demo.user assumed role "ProductionAdmin" at 2:30 PM. 
Check VPC Flow Logs for all network connections initiated from instances 
accessed by that role in the following hour. Are there any unusual internal 
connections or port scans?
```

**यह क्या करता है:** विशेषाधिकार वृद्धि के बाद संभावित लेटरल मूवमेंट की पहचान करता है

**उपयोग मामला:** सुरक्षा टीम जाँच करती है कि क्या समझौता किए गए क्रेडेंशियल्स का उपयोग अतिरिक्त रिसोर्सेज तक पहुँचने के लिए किया गया

---

## बेस्ट प्रैक्टिसएँ

**प्रभावी प्रॉम्प्ट्स:**
- समय सीमा के साथ विशिष्ट रहें और संदर्भ (अकाउंट IDs, रिसोर्स नाम, उपयोगकर्ता पहचान) शामिल करें
- परिणामों को परिष्कृत करने के लिए अनुवर्ती प्रश्न पूछें
- कार्यात्मक अंतर्दृष्टि का अनुरोध करें: "मुझे क्या करना चाहिए?" या "क्या यह सामान्य है?"

**क्वेरी ऑप्टिमाइज़ेशन:**
- व्यापक से शुरू करें, फिर सीमित करें
- तेज़ परिणामों के लिए रिसोर्स आइडेंटिफ़ायर्स का उपयोग करें
- संबंधित प्रश्नों को एक प्रॉम्प्ट में संयोजित करें

**सुरक्षा:**
- क्वेरी परिणामों में संवेदनशील डेटा की सुरक्षा करें
- कई डेटा पॉइंट्स के माध्यम से निष्कर्षों को मान्य करें
- MCP server एक्सेस को अधिकृत उपयोगकर्ताओं तक सीमित करें


## निष्कर्ष

CloudTrail MCP server CloudTrail event एनालिसिस को एक तकनीकी क्वेरी-लेखन कार्य से आपके एजेंट्स के साथ एक प्राकृतिक बातचीत में बदल देता है। सुरक्षा टीमें इंसिडेंट्स की तेज़ी से जाँच कर सकती हैं, अनुपालन टीमें सहजता से ऑडिट रिपोर्ट्स जनरेट कर सकती हैं, और संचालन टीमें जटिल क्वेरी सिंटैक्स सीखे बिना समस्याओं का निवारण कर सकती हैं।

अपने सबसे सामान्य कार्यों के लिए बुनियादी प्रॉम्प्ट्स से शुरू करें - विफल लॉगिन्स की जाँच, IAM परिवर्तनों को ट्रैक करना, या आउटेज का निवारण - फिर उन्हें अपने विशिष्ट एनवायरनमेंट के अनुसार अनुकूलित करें। MCP server की संवादात्मक प्रकृति का अर्थ है कि आप अपने CloudTrail डेटा का अन्वेषण करते हुए अपने प्रश्नों को पुनरावृत्त रूप से परिष्कृत कर सकते हैं, अधिक सटीक उत्तर प्राप्त कर सकते हैं।

अधिक जानकारी के लिए, [AWS MCP Servers डॉक्यूमेंटेशन](https://awslabs.github.io/mcp/) और [MCP for Kiro](https://kiro.dev/docs/mcp/) देखें।

