---
sidebar_position: 2
title: CloudWatch Unified Data Store का उपयोग करके सुरक्षा विजिबिलिटी डैशबोर्ड
---

# CloudWatch Unified Data Store का उपयोग करके सुरक्षा विजिबिलिटी डैशबोर्ड

Amazon CloudWatch [Unified Data Store](https://aws.amazon.com/blogs/aws/amazon-cloudwatch-introduces-unified-data-management-and-analytics-for-operations-security-and-compliance/) व्यक्तिगत लॉग ग्रुप नामों को जाने बिना AWS सेवाओं में आपके लॉग डेटा को खोजने, व्यवस्थित करने और क्वेरी करने का एक केंद्रीकृत तरीका प्रदान करता है। इसे संभव बनाने के लिए, CloudWatch Unified Data Store [facets](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatchLogs-Facets.html) का उपयोग करता है - आपके लॉग डेटा में फ़ील्ड जो CloudWatch इंटरैक्टिव फ़िल्टरिंग, ग्रुपिंग और विश्लेषण के लिए सामने लाता है। `@data_source_name`, `@data_source_type`, और `@data_format` जैसे डिफ़ॉल्ट facets बिना किसी कॉन्फ़िगरेशन के सभी Standard लॉग क्लास लॉग ग्रुप्स पर स्वचालित रूप से उपलब्ध हैं। [CloudWatch Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html) कंसोल में, आप अपने डेटा को दृश्य रूप से एक्सप्लोर करने के लिए facet values चुन सकते हैं, या अपनी क्वेरीज में उन्हें रेफ़रेंस करके केवल मिलान करने वाले लॉग ग्रुप्स और events तक खोज स्कोप को कुशलतापूर्वक सीमित कर सकते हैं।

इन facets के माध्यम से, CloudWatch स्वचालित रूप से लॉग्स को उनके मूल [डेटा स्रोत](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/supported-aws-services-data-sources.html) द्वारा वर्गीकृत करता है - जैसे AWS CloudTrail और Amazon VPC Flow Logs - ताकि आप `@data_source_name` facet का उपयोग करके अपने सभी CloudTrail या VPC Flow Log डेटा को अपने लॉग ग्रुप्स में क्वेरी कर सकें, चाहे कितने भी लॉग ग्रुप मौजूद हों या उनके नाम क्या हों।

[CloudWatch क्रॉस-अकाउंट क्रॉस-रीजन लॉग सेंट्रलाइज़ेशन](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatchLogs_Centralization.html) के साथ, आप इस नींव के ऊपर सुरक्षा एनालिटिक्स बना सकते हैं। यह गाइड AWS CloudFormation के माध्यम से एक सैंपल प्री-बिल्ट [CloudWatch Dashboard](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Dashboards.html) डिप्लॉय करने की प्रक्रिया बताती है जो CloudWatch डेटा स्रोतों का लाभ उठाकर आपकी CloudTrail और VPC Flow Logs गतिविधि में निकट-वास्तविक समय विजिबिलिटी प्रदान करती है।

## यह डैशबोर्ड क्यों महत्वपूर्ण है

सुरक्षा टीमों को अपने AWS अकाउंट्स में API गतिविधि और नेटवर्क ट्रैफ़िक में केंद्रीकृत, निकट-वास्तविक समय विजिबिलिटी की आवश्यकता होती है। केंद्रीकृत डैशबोर्ड के बिना, टीमों को कई लॉग ग्रुप्स में मैन्युअल रूप से क्वेरीज चलानी पड़ती हैं, CloudTrail और VPC Flow Logs के बीच डेटा को सहसंबंधित करना पड़ता है, और विभिन्न स्रोतों से सुरक्षा संदर्भ को एक साथ जोड़ना पड़ता है।

यह डैशबोर्ड कई प्रमुख चुनौतियों का समाधान करता है:

- **लॉग ग्रुप नामों पर कोई निर्भरता नहीं**: [`SOURCE logGroups() | filterIndex @data_source_name`](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax-FilterIndex.html) का उपयोग करके CloudWatch Unified Data Store डिफ़ॉल्ट facets के माध्यम से CloudTrail और VPC Flow Logs को गतिशील रूप से खोजता है।
- **ड्यूअल फ़ॉर्मेट सपोर्ट**: आपकी लॉग फ़ॉर्मेट प्राथमिकता के आधार पर Standard (नेटिव AWS फ़ील्ड नाम) या OCSF (Open Cybersecurity Schema Framework) वर्शन डिप्लॉय करता है।
- **क्रॉस-सर्विस सहसंबंध**: सुरक्षा events के दृश्य सहसंबंध के लिए CloudTrail API गतिविधि और VPC Flow Log नेटवर्क डेटा को साथ-साथ रखता है।
- **अकाउंट्स में पोर्टेबल**: समान CloudFormation टेम्पलेट किसी भी अकाउंट में काम करता है जिसमें CloudTrail और VPC Flow Logs CloudWatch Logs को भेजे जा रहे हों।

## पूर्वापेक्षाएँ

डिप्लॉय करने से पहले, सत्यापित करें कि आपके अकाउंट में आवश्यक डेटा स्रोत उपलब्ध हैं:

```bash
aws logs list-aggregate-log-group-summaries --group-by DATA_SOURCE_NAME_AND_TYPE
```

आपको आउटपुट में `aws_cloudtrail` और `amazon_vpc` के लिए एंट्रीज दिखनी चाहिए। यदि ये अनुपस्थित हैं, तो सुनिश्चित करें कि:

1. **[CloudTrail](https://aws.amazon.com/about-aws/whats-new/2025/12/key-enhancements-cloudtrail-events-cloudwatch/)** CloudWatch Logs को लॉग्स डिलीवर करने के लिए कॉन्फ़िगर है।
2. **[VPC Flow Logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/telemetry-config-rules.html)** कम से कम एक VPC के लिए CloudWatch Logs को डिलीवर करने के लिए कॉन्फ़िगर हैं।

## डैशबोर्ड डिप्लॉय करें

1. **[CloudWatch_Dashboard_CloudTrail_VPC.yaml](https://raw.githubusercontent.com/aws-samples/aws-management-and-governance-samples/refs/heads/master/AWSCloudTrail/cloudwatch-dashboards/CloudWatch_Dashboard_CloudTrail_VPC.yaml)** टेम्पलेट डाउनलोड करें।
1. **CloudFormation** > **Create stack** > **With new resources** पर जाएँ।
1. `CloudWatch_Dashboard_CloudTrail_VPC.yaml` टेम्पलेट अपलोड करें।
1. पैरामीटर्स कॉन्फ़िगर करें:
   - **DashboardName**: आपके डैशबोर्ड का नाम (डिफ़ॉल्ट: `CloudTrail-VPC-Dashboard`)।
   - **LogFormat**: नेटिव AWS CloudTrail/VPC Flow Log फ़ील्ड नामों के लिए `Standard`, या Open Cybersecurity Schema Framework सामान्यीकृत फ़ील्ड्स के लिए `OCSF` चुनें।
1. समीक्षा करें और स्टैक बनाएँ।

### CloudFormation पैरामीटर्स

| पैरामीटर | डिफ़ॉल्ट | विवरण |
|------------------------------------|----------------------------|--------------------------------------------------------------------------------------------------|
| `DashboardName` | `CloudTrail-VPC-Dashboard` | CloudWatch डैशबोर्ड का नाम |
| `LogFormat` | `Standard` | `Standard` (नेटिव AWS फ़ील्ड्स) या `OCSF` (सामान्यीकृत स्कीमा) |

## क्वेरीज कैसे काम करती हैं

इस डैशबोर्ड की प्रत्येक [CloudWatch Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html) क्वेरी समान पैटर्न का उपयोग करती है:

```
SOURCE logGroups() | filterIndex @data_source_name in ["aws_cloudtrail"]
| <your query logic here>
```

- [`SOURCE logGroups()`](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax-Source.html) CloudWatch को अकाउंट में सभी लॉग ग्रुप्स में खोजने के लिए कहता है।
- [`filterIndex @data_source_name in [...]`](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax-FilterIndex.html) `@data_source_name` डिफ़ॉल्ट facet का उपयोग करके खोज को केवल निर्दिष्ट डेटा स्रोत वाले लॉग ग्रुप्स तक सीमित करता है।
- CloudTrail क्वेरीज के लिए, डेटा स्रोत नाम `aws_cloudtrail` है।
- VPC Flow Log क्वेरीज के लिए, डेटा स्रोत नाम `amazon_vpc` है।

इस दृष्टिकोण का अर्थ है कि आपको वास्तविक लॉग ग्रुप नाम जानने या कॉन्फ़िगर करने की कभी आवश्यकता नहीं है।

## सुरक्षा सर्वोत्तम प्रथाएँ

### IAM के साथ डैशबोर्ड एक्सेस प्रतिबंधित करना

सर्वोत्तम प्रथा के रूप में, सुरक्षा डेटा प्रदर्शित करने वाले किसी भी CloudWatch डैशबोर्ड पर न्यूनतम-विशेषाधिकार एक्सेस नियंत्रण लागू करें।

नीचे एक IAM पॉलिसी का उदाहरण है जो डैशबोर्ड तक केवल-पढ़ने की पहुँच प्रदान करती है और संशोधन को अस्वीकार करती है:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowDashboardReadOnly",
      "Effect": "Allow",
      "Action": [
        "cloudwatch:GetDashboard",
        "cloudwatch:ListDashboards"
      ],
      "Resource": "arn:aws:cloudwatch::ACCOUNT_ID:dashboard/CloudTrail-VPC-Dashboard"
    },
    {
      "Sid": "DenyDashboardModification",
      "Effect": "Deny",
      "Action": [
        "cloudwatch:PutDashboard",
        "cloudwatch:DeleteDashboards"
      ],
      "Resource": "arn:aws:cloudwatch::ACCOUNT_ID:dashboard/CloudTrail-VPC-Dashboard"
    }
  ]
}
```

`ACCOUNT_ID` को अपने AWS अकाउंट ID से बदलें और `CloudTrail-VPC-Dashboard` को अपने वास्तविक डैशबोर्ड नाम से बदलें यदि आपने इसे कस्टमाइज़ किया है।

### CloudWatch Alarms के साथ डैशबोर्ड को पूरक बनाना

डैशबोर्ड आपको दिखाता है कि क्या हो रहा है लेकिन जब कुछ गलत होता है तो आपको सूचित नहीं करेगा। महत्वपूर्ण सुरक्षा events पर अलर्ट प्राप्त करने के लिए, [CloudWatch Logs metric filters](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/MonitoringLogData.html) द्वारा समर्थित [CloudWatch Alarms](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html) सेट करें।

| Event | Metric Filter Pattern |
|---|---|
| Root अकाउंट उपयोग | `{ $.userIdentity.type = "Root" && $.userIdentity.invokedBy NOT EXISTS && $.eventType != "AwsServiceEvent" }` |
| विशेषाधिकार वृद्धि | `{ ($.eventName = "AttachRolePolicy") \|\| ($.eventName = "PutRolePolicy") \|\| ($.eventName = "CreateAccessKey") \|\| ($.eventName = "CreateLoginProfile") }` |
| कंसोल लॉगिन विफलताएँ | `{ ($.eventName = "ConsoleLogin") && ($.errorMessage = "Failed authentication") }` |

अलर्म actions को एक [SNS topic](https://docs.aws.amazon.com/sns/latest/dg/welcome.html) पर रूट करें जो ईमेल, Slack, या आपके इंसिडेंट मैनेजमेंट प्लेटफ़ॉर्म के माध्यम से आपकी सुरक्षा संचालन टीम को सूचित करे।

### लॉग ग्रुप एन्क्रिप्शन और रिटेंशन

CloudWatch Logs डिफ़ॉल्ट रूप से AWS-managed keys का उपयोग करके सभी लॉग डेटा को रेस्ट पर एन्क्रिप्ट करता है। हालाँकि, यदि आपके संगठन को अनुपालन के लिए customer-managed एन्क्रिप्शन keys की आवश्यकता है, तो आप प्रत्येक [लॉग ग्रुप के साथ KMS key जोड़](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/encrypt-log-data-kms.html) सकते हैं।

### अतिरिक्त सिफारिशें

- डिप्लॉयमेंट के बाद आकस्मिक डिलीशन से बचने के लिए **CloudFormation स्टैक termination protection सक्षम करें**।
- AWS Organizations में **[Service Control Policies (SCPs)](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html)** का उपयोग करके सभी अकाउंट्स में `cloudwatch:PutDashboard` और `cloudwatch:DeleteDashboards` को विशिष्ट admin roles तक प्रतिबंधित करें।

## डैशबोर्ड सेक्शन और विजेट रेफ़रेंस

डैशबोर्ड छह सेक्शन में व्यवस्थित है। नीचे Standard फ़ॉर्मेट वर्शन है।

---

### सेक्शन 1: सुरक्षा अवलोकन

यह सेक्शन आपके AWS एनवायरनमेंट में सुरक्षा स्थिति का एक नज़र में दृश्य प्रदान करता है।

---

### सेक्शन 2: सहसंबंधित सुरक्षा अंतर्दृष्टि - CloudTrail + VPC Flow Logs

यह सेक्शन दृश्य सहसंबंध के लिए API-लेयर और नेटवर्क-लेयर सुरक्षा डेटा को साथ-साथ रखता है।

---

### सेक्शन 3: नेटवर्क सुरक्षा - नेटवर्क गतिविधि विश्लेषण

नेटवर्क-लेयर सुरक्षा विजिबिलिटी के लिए VPC Flow Log डेटा में गहरी खोज।

---

### सेक्शन 4: आइडेंटिटी और एक्सेस मैनेजमेंट

CloudTrail से IAM गतिविधि और प्रमाणीकरण events पर केंद्रित।

---

### सेक्शन 5: गतिविधि वितरण और विश्लेषण

परिचालन और सुरक्षा जागरूकता के लिए API गतिविधि पैटर्न का व्यापक विश्लेषण।

---

### सेक्शन 6: विस्तृत सुरक्षा events टाइमलाइन

---
![CloudTrail Dashboard](/img/cloudops/solutions/cloudtrail-dashboards/example-dashboard-01.png)

![CloudTrail Dashboard](/img/cloudops/solutions/cloudtrail-dashboards/example-dashboard-02.png)

## क्लीन अप

डैशबोर्ड और सभी संबद्ध रिसोर्सेज को हटाने के लिए:

```bash
aws cloudformation delete-stack --stack-name CloudTrail-VPC-Dashboard
```

:::note
**CloudTrail-VPC-Dashboard** को Deploy सेक्शन में उपयोग किए गए CloudFormation स्टैक नाम से बदलें
:::

## निष्कर्ष

यह CloudWatch Dashboard CloudWatch Unified Data Store डेटा स्रोतों का उपयोग करके CloudTrail API गतिविधि और VPC Flow Log नेटवर्क डेटा में केंद्रीकृत, निकट-वास्तविक समय सुरक्षा विजिबिलिटी प्रदान करता है। `@data_source_name` डिफ़ॉल्ट facet का लाभ उठाकर, डैशबोर्ड लॉग ग्रुप नाम कॉन्फ़िगरेशन की आवश्यकता के बिना स्वचालित रूप से सही लॉग ग्रुप्स खोजता है, जिससे यह किसी भी AWS अकाउंट में पोर्टेबल बन जाता है। खतरे का पता लगाने, इंसिडेंट जाँच, और अनुपालन निगरानी के लिए तत्काल सुरक्षा विजिबिलिटी प्राप्त करने हेतु इसे CloudFormation के माध्यम से मिनटों में डिप्लॉय करें।
