---
sidebar_position: 1
---

# Athena का उपयोग करके Amazon CloudWatch Logs में ऐतिहासिक Security Lake डेटा क्वेरी करना

## अवलोकन

जब आप अपने सुरक्षा लॉग प्रबंधन को [Amazon CloudWatch Unified Data Store (unified data store)](https://aws.amazon.com/blogs/aws/amazon-cloudwatch-introduces-unified-data-management-and-analytics-for-operations-security-and-compliance/) में माइग्रेट करते हैं, तो आप आगे बढ़ते हुए ऑपरेशनल और सुरक्षा टेलीमेट्री के लिए एक आधुनिक, एकीकृत डेस्टिनेशन प्राप्त करते हैं। लेकिन आपका ऐतिहासिक सुरक्षा डेटा - AWS CloudTrail इवेंट, Amazon Virtual Private Cloud (Amazon VPC) Flow Logs, AWS Security Hub findings, और माइग्रेशन से पहले [Amazon Security Lake](https://docs.aws.amazon.com/security-lake/latest/userguide/what-is-security-lake.html) में संचित अन्य रिकॉर्ड - गायब नहीं होता। यह ठीक वहीं रहता है जहां है, Security Lake की Amazon S3 समर्थित संरचना में पहले से संग्रहीत और विभाजित।

यह गाइड दिखाती है कि कैसे **Amazon Athena** का उपयोग आपके ऐतिहासिक Security Lake डेटा और आपके नए CloudWatch unified data store लॉग दोनों के लिए एक एकल क्वेरी कंसोल के रूप में किया जाए - बिना किसी डेटा को एक्सपोर्ट, कॉपी, या डुप्लीकेट किए। आप प्रत्येक डेटा स्टोर को स्वतंत्र रूप से क्वेरी कर सकते हैं, या क्रॉस-प्लेटफॉर्म दृश्यता के लिए `UNION ALL` का उपयोग करके दोनों के परिणामों को संयोजित कर सकते हैं।

> **नए** लॉग इवेंट आपके प्राथमिक प्लेटफॉर्म के रूप में CloudWatch unified data store में प्रवाहित होते हैं।
> **ऐतिहासिक** इवेंट Security Lake में रहते हैं।
> **Athena** एक ही कंसोल से दोनों को क्वेरी करता है।

![माइग्रेशन चरण](/img/ASL-CW-Migration-Timeline.png "Amazon Security Lake to Amazon CloudWatch")

| चरण | क्या होता है |
|---|---|
| **चरण 1 - Security Lake** | VPC Flow Logs और अन्य सुरक्षा डेटा स्रोत विशेष रूप से Security Lake को लिखते हैं, Amazon S3 में संग्रहीत और AWS Glue Data Catalog के माध्यम से क्वेरी करने योग्य OCSF-फॉर्मेटेड रिकॉर्ड का एक ऐतिहासिक आर्काइव बनाते हैं। |
| **चरण 2 - Security Lake और CloudWatch का दोहरा इन्जेशन** | Security Lake और CloudWatch दोनों एक साथ डेटा प्राप्त करते हैं। इस सत्यापन अवधि की न्यूनतम 24 घंटे के लिए अनुशंसा की जाती है, जो टीमों को CloudWatch में पूरी तरह से माइग्रेट करने से पहले दोनों प्लेटफार्मों पर लॉग इन्जेशन और स्थिरता को सत्यापित करने का समय देती है। |
| **चरण 3 - केवल CloudWatch** | डेटा स्रोत विशेष रूप से CloudWatch को लिखते हैं। सभी ऐतिहासिक Security Lake डेटा संरक्षित और सुलभ रहता है - और Athena आपको एक ही कंसोल से दोनों डेटा स्टोर को क्वेरी करने देता है, या तो स्वतंत्र रूप से या `UNION ALL` का उपयोग करके संयुक्त। |

Security Lake और Amazon CloudWatch unified data store दोनों अपने डेटा को [Open Cybersecurity Schema Framework (OCSF)](https://schema.ocsf.io/) में नॉर्मलाइज़ करते हैं, जिसका अर्थ है कि `src_endpoint.ip`, `api.operation`, और `actor.user.name` जैसे फ़ील्ड नाम दोनों स्रोतों में सुसंगत हैं। यह सुसंगतता क्रॉस-सोर्स क्वेरी को सरल बनाती है।

---

## एक्सपोर्ट के बजाय इन-प्लेस क्वेरी क्यों?

Athena क्रॉस-कैटलॉग क्वेरी आपको डेटा एक्सपोर्ट की आवश्यकता के बिना ऐतिहासिक Security Lake डेटा तक सीधे पहुंचने देती हैं। नीचे कुछ लाभ हैं जो इन-प्लेस क्वेरी को अधिक कुशल दृष्टिकोण बनाते हैं।

| लाभ | विवरण |
|---|---|
| **कोई डुप्लीकेट स्टोरेज शुल्क नहीं** | आपका ऐतिहासिक डेटा पहले से Security Lake के Amazon S3 समर्थित स्टोर में रहता है। इन-प्लेस क्वेरी करने का मतलब है कि आप केवल उसके लिए भुगतान करते हैं जो आपके पास पहले से है। |
| **कोई ETL पाइपलाइन बनाने या बनाए रखने की आवश्यकता नहीं** | Athena क्रॉस-कैटलॉग क्वेरी एक अलग पाइपलाइन की आवश्यकता को समाप्त करती हैं। |
| **ऐतिहासिक डेटा व्यवस्थित रहता है** | Security Lake डेटा को अकाउंट, रीजन, और तिथि के अनुसार संग्रहीत और विभाजित करता है - ऐतिहासिक विश्लेषण के लिए उपयुक्त संरचना। |
| **नया डेटा स्वाभाविक रूप से प्रवाहित होता है** | माइग्रेशन के बाद, CloudWatch नए लॉग इवेंट के लिए आपका प्राथमिक डेस्टिनेशन बन जाता है। |
| **Athena दोनों को कुशलता से जोड़ता है** | Security Lake अपनी टेबल को डिफ़ॉल्ट [AWS Glue Data Catalog](https://docs.aws.amazon.com/glue/latest/dg/catalog-and-crawler.html) (`AwsDataCatalog`) में रजिस्टर करता है। CloudWatch एक Amazon S3 Tables कैटलॉग (`s3tablescatalog/aws-cloudwatch`) का उपयोग करता है। Athena पूरी तरह से योग्य कैटलॉग पथों का उपयोग करके एक ही SQL क्वेरी में दोनों को संदर्भित कर सकता है। |

:::tip परिणाम
आप इवेंट जांच, थ्रेट हंटिंग, और अनुपालन ऑडिट के लिए अपने ऐतिहासिक Security Lake डेटा तक पूर्ण पहुंच बनाए रखते हैं - जबकि आपका नया CloudWatch unified data store डेटा चल रही निगरानी के लिए प्राथमिक स्रोत के रूप में प्रवाहित होता है।
:::

---

## यह कैसे काम करता है

दो डेटा स्टोर एक साथ कैसे फिट होते हैं यह समझने से क्वेरी के बारे में तर्क करना आसान हो जाता है।

### आर्किटेक्चर

- **Security Lake** → `"awsdatacatalog"."<database>"."<table>"`
- **CloudWatch unified data store** → `"s3tablescatalog/aws-cloudwatch"."logs"."<table>"`

Athena एक ही SQL स्टेटमेंट में कई Glue कैटलॉग के पार क्वेरी करने का समर्थन करता है। प्रत्येक स्रोत को उसके पूरी तरह से योग्य कैटलॉग पथ के साथ संदर्भित करके, आप एक ही Athena कंसोल से Security Lake और CloudWatch unified data store को स्वतंत्र रूप से क्वेरी कर सकते हैं - या जब आपको दोनों में एक एकीकृत दृश्य की आवश्यकता हो तो `UNION ALL` के साथ परिणामों को संयोजित कर सकते हैं।

दोनों स्रोत अपने डेटा को OCSF में नॉर्मलाइज़ करते हैं, इसलिए फ़ील्ड नाम, प्रकार, और संरचनाएं दोनों में सुसंगत हैं।

![आर्किटेक्चर डायग्राम](/img/Athena-Arch-ASL-CW.png "Architecture Diagram")

## पूर्वापेक्षाएं

क्रॉस-कैटलॉग क्वेरी चलाने से पहले, Athena कंसोल का उपयोग करके अपने कैटलॉग पथ, डेटाबेस, और टेबल नामों की पुष्टि करें। इस गाइड में उदाहरण `us-east-1` डिप्लॉयमेंट पर आधारित निम्नलिखित नामकरण परंपराओं का उपयोग करते हैं।

### Security Lake टेबल

| कैटलॉग | डेटाबेस | उदाहरण टेबल |
|---|---|---|
| `awsdatacatalog` | `amazon_security_lake_glue_db_us_east_1` | `amazon_security_lake_table_us_east_1_cloud_trail_mgmt_2_0` |
| | | `amazon_security_lake_table_us_east_1_vpc_flow_2_0` |
| | | `amazon_security_lake_table_us_east_1_route53_2_0` |
| | | `amazon_security_lake_table_us_east_1_sh_findings_2_0` |
| | | `amazon_security_lake_table_us_east_1_eks_audit_2_0` |
| | | `amazon_security_lake_table_us_east_1_lambda_execution_2_0` |

### CloudWatch Unified Data Store टेबल

| कैटलॉग | डेटाबेस | उदाहरण टेबल |
|---|---|---|
| `s3tablescatalog/aws-cloudwatch` | `logs` | `aws_cloudtrail__management` |
| | | `aws_cloudtrail__data` |
| | | `amazon_vpc__flow` |
| | | `cloudtrail__networkactivityevent` |
| | | `cloudtrailcustom__networkactivityevent` |
| | | `microsoft_entraid__account_change` |

:::info रीजन-विशिष्ट नामकरण
Security Lake डेटाबेस और टेबल नामों में आपका डिप्लॉयमेंट रीजन शामिल है। इस गाइड में उदाहरण `us_east_1` का उपयोग करते हैं (जैसे, `amazon_security_lake_glue_db_us_east_1`)। यदि Security Lake एक अलग रीजन में सक्षम है, तो `us_east_1` को अपने रीजन के आइडेंटिफायर से बदलें।
:::

:::tip अपने टेबल नाम खोजना
आपके टेबल नाम आपके रीजन, Security Lake कॉन्फ़िगरेशन, और कौन से CloudWatch unified data store डेटा स्रोत आपने सक्षम किए हैं, इसके आधार पर भिन्न हो सकते हैं। निम्नलिखित चलाकर अपने टेबल नामों को सत्यापित करें:

```sql
SHOW TABLES IN "s3tablescatalog/aws-cloudwatch"."logs"
```
:::

---

## Athena से दोनों डेटा स्टोर क्वेरी करना

CloudWatch unified data store में माइग्रेट करने के बाद, Athena ऐतिहासिक और वर्तमान दोनों सुरक्षा डेटा के लिए आपका एकल क्वेरी कंसोल बन जाता है। Security Lake टेबल AWS Glue Data Catalog में रजिस्टर हैं, और CloudWatch unified data store टेबल S3 Tables कैटलॉग में रजिस्टर हैं। Athena दोनों तक पहुंच सकता है - कोई डेटा मूवमेंट, कोई एक्सपोर्ट पाइपलाइन, कोई डुप्लीकेशन नहीं।

नीचे के अनुभाग तीन स्तरों की क्वेरीइंग के माध्यम से चलते हैं:

1. **Security Lake क्वेरी करना** - अपने ऐतिहासिक आर्काइव तक सीधे पहुंचें
2. **CloudWatch unified data store क्वेरी करना** - S3 Tables के माध्यम से अपना वर्तमान डेटा एक्सेस करें
3. **UNION ALL के साथ दोनों को संयोजित करना** - एक ही परिणाम सेट में ऐतिहासिक और हाल के डेटा को साथ-साथ देखें

### सिंटैक्स अवलोकन

किसी विशिष्ट कैटलॉग से टेबल को संदर्भित करने के लिए सामान्य पैटर्न:

```sql
-- Security Lake (Glue Data Catalog)
SELECT ...
FROM "awsdatacatalog"."amazon_security_lake_glue_db_us_east_1"."table_name"

-- CloudWatch Unified Data Store (S3 Tables Catalog)
SELECT ...
FROM "s3tablescatalog/aws-cloudwatch"."logs"."table_name"
```

---

## उपलब्ध टेबल संदर्भ

अपनी स्वयं की क्वेरी बनाते समय इन टेबल का संदर्भ के रूप में उपयोग करें। Security Lake और CloudWatch unified data store दोनों OCSF नॉर्मलाइज़ेशन का उपयोग करते हैं, इसलिए फ़ील्ड नाम डेटा स्रोत प्रकारों में सुसंगत हैं।

### Security Lake

| टेबल | OCSF क्लास | सामान्य क्वेरी फ़ील्ड |
|---|---|---|
| `..._cloud_trail_mgmt_2_0` | API Activity | `api.operation`, `src_endpoint.ip`, `actor.user.name`, `time_dt` |
| `..._vpc_flow_2_0` | Network Activity | `src_endpoint.ip`, `dst_endpoint.ip`, `dst_endpoint.port`, `time_dt` |
| `..._route53_2_0` | DNS Activity | `src_endpoint.ip`, `query.hostname`, `time_dt` |
| `..._sh_findings_2_0` | Vulnerability / Compliance / Detection Finding | `finding.title`, `cloud.account.uid`, `severity`, `severity_id`, `time_dt` |
| `..._eks_audit_2_0` | API Activity | `api.operation`, `actor.user.name`, `time_dt` |
| `..._lambda_execution_2_0` | API Activity | `api.operation`, `cloud.account.uid`, `time_dt` |

:::note Security Hub OCSF v2 क्लास नाम
OCSF v2 (1.1.0) में, Security Hub CSPM findings finding प्रकार के आधार पर कई OCSF क्लास नामों - Vulnerability Finding, Compliance Finding, या Detection Finding - में मैप होती हैं।
:::

### CloudWatch Unified Data Store

| टेबल | OCSF क्लास | सामान्य क्वेरी फ़ील्ड |
|---|---|---|
| `aws_cloudtrail__management` | API Activity | `api.operation`, `src_endpoint.ip`, `actor.user.name`, `time_dt` |
| `aws_cloudtrail__data` | API Activity | `api.operation`, `src_endpoint.ip`, `actor.user.name`, `time_dt` |
| `amazon_vpc__flow` | Network Activity | `src_endpoint.ip`, `dst_endpoint.ip`, `dst_endpoint.port`, `time_dt` |
| `cloudtrail__networkactivityevent` | Network Activity | `src_endpoint.ip`, `dst_endpoint.ip`, `time_dt` |
| `cloudtrailcustom__networkactivityevent` | Network Activity | `src_endpoint.ip`, `dst_endpoint.ip`, `time_dt` |
| `microsoft_entraid__account_change` | Account Change | `actor.user.name`, `time_dt` |
| `aws_security_hub__compliance_finding` | Compliance Finding | `finding_info.title`, `finding_info.uid`, `cloud.account.uid`, `severity`, `status`, `time_dt` |
| `aws_security_hub__vulnerability_finding` | Vulnerability Finding | `finding_info.title`, `finding_info.uid`, `cloud.account.uid`, `severity`, `status`, `time_dt` |
| `aws_security_hub__detection_finding` | Detection Finding | `finding_info.title`, `finding_info.uid`, `cloud.account.uid`, `severity`, `status`, `time_dt` |

:::tip टेबल नाम डिस्कवरी
CloudWatch unified data store टेबल नाम आपके एसोसिएशन में कॉन्फ़िगर किए गए डेटा स्रोत नाम और प्रकार के आधार पर जनरेट होते हैं। अपनी उपलब्ध टेबल खोजने के लिए Athena में निम्नलिखित चलाएं:

```sql
SHOW TABLES IN "s3tablescatalog/aws-cloudwatch"."logs"
```
:::

---

## भाग 1 - Security Lake क्वेरी करना (ऐतिहासिक डेटा)

आपका ऐतिहासिक सुरक्षा डेटा Security Lake में रहता है, Amazon S3 में संग्रहीत और AWS Glue Data Catalog में रजिस्टर। ये क्वेरी `awsdatacatalog` कैटलॉग के विरुद्ध चलती हैं और आपके माइग्रेशन से पहले एकत्रित OCSF-फॉर्मेटेड डेटा तक पहुंचती हैं।

### उदाहरण 1a - ऐतिहासिक CloudTrail Management Events

अपने Security Lake आर्काइव से CloudTrail management events क्वेरी करें। यह पिछली घटनाओं की जांच, ऐतिहासिक API गतिविधि का ऑडिट, या बेसलाइन स्थापित करने के लिए उपयोगी है।

<details>
<summary>SQL क्वेरी देखें</summary>

```sql
SELECT
    api.operation        AS event_name,
    api.service.name     AS event_source,
    actor.user.name      AS username,
    src_endpoint.ip      AS source_ip,
    time_dt,
    status
FROM "awsdatacatalog"."amazon_security_lake_glue_db_us_east_1"."amazon_security_lake_table_us_east_1_cloud_trail_mgmt_2_0"
WHERE time_dt BETWEEN TIMESTAMP '2025-01-01' AND TIMESTAMP '2025-06-01'
    AND api.operation = 'AssumeRole'
LIMIT 25;
```

</details>

### उदाहरण 1b - ऐतिहासिक VPC Flow Logs

ऐतिहासिक नेटवर्क गतिविधि की जांच के लिए अपने Security Lake आर्काइव से VPC Flow Logs क्वेरी करें।

<details>
<summary>SQL क्वेरी देखें</summary>

```sql
SELECT
    src_endpoint.ip              AS source_ip,
    dst_endpoint.ip              AS dest_ip,
    dst_endpoint.port            AS dest_port,
    traffic.bytes                AS bytes,
    activity_name                AS activity,
    time_dt,
    status_code,
    connection_info.direction    AS direction
FROM "awsdatacatalog"."amazon_security_lake_glue_db_us_east_1"."amazon_security_lake_table_us_east_1_vpc_flow_2_0"
WHERE time_dt BETWEEN TIMESTAMP '2025-01-01' AND TIMESTAMP '2025-06-01'
    AND activity_name = 'Reject'
LIMIT 25;
```

</details>

### उदाहरण 1c - ऐतिहासिक Security Hub Findings

अपनी ऐतिहासिक सुरक्षा स्थिति की समीक्षा के लिए अपने Security Lake आर्काइव से Security Hub findings क्वेरी करें।

<details>
<summary>SQL क्वेरी देखें</summary>

```sql
SELECT
    finding_info.title       AS finding_title,
    finding_info.uid         AS finding_uid,
    severity,
    status,
    cloud.account.uid        AS account,
    time_dt
FROM "awsdatacatalog"."amazon_security_lake_glue_db_us_east_1"."amazon_security_lake_table_us_east_1_sh_findings_2_0"
WHERE time_dt BETWEEN TIMESTAMP '2025-01-01' AND TIMESTAMP '2025-06-01'
    AND severity_id >= 3
LIMIT 25;
```

</details>

---

## भाग 2 - CloudWatch Unified Data Store क्वेरी करना (हालिया डेटा)

माइग्रेशन के बाद, आपका नया सुरक्षा डेटा CloudWatch unified data store में प्रवाहित होता है और Amazon S3 Tables में संग्रहीत होता है। ये क्वेरी `s3tablescatalog/aws-cloudwatch` कैटलॉग के विरुद्ध चलती हैं।

### उदाहरण 2a - हालिया CloudTrail Management Events

CloudWatch unified data store से हालिया CloudTrail management events क्वेरी करें। Security Lake क्वेरी में उपयोग किए गए समान OCSF फ़ील्ड नाम यहां काम करते हैं।

<details>
<summary>SQL क्वेरी देखें</summary>

```sql
SELECT
    api.operation        AS event_name,
    api.service.name     AS event_source,
    actor.user.name      AS username,
    src_endpoint.ip      AS source_ip,
    time_dt,
    status
FROM "s3tablescatalog/aws-cloudwatch"."logs"."aws_cloudtrail__management"
WHERE time_dt BETWEEN TIMESTAMP '2025-06-01' AND TIMESTAMP '2025-07-01'
    AND api.operation = 'AssumeRole'
LIMIT 25;
```

</details>

### उदाहरण 2b - हालिया VPC Flow Logs

CloudWatch unified data store से हालिया VPC Flow Logs क्वेरी करें।

<details>
<summary>SQL क्वेरी देखें</summary>

```sql
SELECT
    src_endpoint.ip              AS source_ip,
    dst_endpoint.ip              AS dest_ip,
    dst_endpoint.port            AS dest_port,
    traffic.bytes                AS bytes,
    activity_name                AS activity,
    time_dt,
    status_code,
    connection_info.direction    AS direction
FROM "s3tablescatalog/aws-cloudwatch"."logs"."amazon_vpc__flow"
WHERE time_dt BETWEEN TIMESTAMP '2025-06-01' AND TIMESTAMP '2025-07-01'
    AND activity_name = 'Reject'
LIMIT 25;
```

</details>

### उदाहरण 2c - हालिया Security Hub Findings

CloudWatch unified data store से हालिया Security Hub compliance findings क्वेरी करें।

<details>
<summary>SQL क्वेरी देखें</summary>

```sql
SELECT
    finding_info.title       AS finding_title,
    finding_info.uid         AS finding_uid,
    severity,
    status,
    cloud.account.uid        AS account,
    time_dt
FROM "s3tablescatalog/aws-cloudwatch"."logs"."aws_security_hub__compliance_finding"
WHERE time_dt BETWEEN TIMESTAMP '2025-06-01' AND TIMESTAMP '2025-07-01'
    AND severity_id >= 3
LIMIT 25;
```

</details>

:::info CloudWatch Unified Data Store में Security Hub Finding प्रकार
Security Hub findings CloudWatch unified data store में कई OCSF event classes में मैप होती हैं। finding प्रकार के आधार पर, आपका डेटा इन टेबल में से एक में हो सकता है:

| CW UDS टेबल | Finding प्रकार |
|---|---|
| `aws_security_hub__compliance_finding` | Compliance check results |
| `aws_security_hub__detection_finding` | Threat detection findings |
| `aws_security_hub__vulnerability_finding` | Vulnerability findings |
| `aws_security_hub__data_security_finding` | Data security findings |

अपनी उपलब्ध टेबल खोजने के लिए `SHOW TABLES IN "s3tablescatalog/aws-cloudwatch"."logs"` चलाएं।
:::

---

## भाग 3 - UNION ALL के साथ दोनों डेटा स्टोर संयोजित करना

एक बार जब आप प्रत्येक डेटा स्टोर को स्वतंत्र रूप से क्वेरी करने में सहज हो जाते हैं, तो आप `UNION ALL` का उपयोग करके एक ही क्वेरी में दोनों के परिणामों को संयोजित कर सकते हैं। यह आपको माइग्रेशन सीमा के पार एक एकीकृत दृश्य देता है।

`UNION ALL` को अच्छी तरह से काम कराने की कुंजी विशिष्ट फ़िल्टर (जैसे, एक विशेष API ऑपरेशन, IP एड्रेस, या finding शीर्षक) का उपयोग करना है ताकि दोनों पक्ष प्रासंगिक, तुलनीय परिणाम लौटाएं।

:::caution JOIN के बजाय UNION ALL क्यों?
AWS Glue Data Catalog (Security Lake) और S3 Tables कैटलॉग (CloudWatch unified data store) के बीच क्रॉस-कैटलॉग JOIN Athena में तकनीकी रूप से संभव हैं, लेकिन उनमें महत्वपूर्ण प्रदर्शन और लागत सीमाएं हैं। `UNION ALL` का उपयोग करने से यह टाला जाता है क्योंकि प्रत्येक क्वेरी उचित पार्टीशन प्रूनिंग के साथ अपने स्वयं के कैटलॉग के विरुद्ध स्वतंत्र रूप से चलती है, फिर परिणामों को संयोजित करती है - कम लागत पर तेज प्रदर्शन प्रदान करती है।
:::

:::info टाइम विंडो गाइडेंस
इन उदाहरणों में WHERE क्लॉज माइग्रेशन परिदृश्य को प्रतिबिंबित करने के लिए दोनों डेटा स्रोतों के लिए हार्डकोडेड तिथि सीमाओं का उपयोग करते हैं। इन्हें अपनी माइग्रेशन टाइमलाइन और रिटेंशन अवधि से मेल खाने वाली वास्तविक तिथियों से बदलें।
:::

### UNION ALL क्वेरी टेम्पलेट

```sql
SELECT
    'Security Lake'   AS source,
    <field_1>         AS <alias>,
    <field_2>         AS <alias>,
    time_dt
FROM "awsdatacatalog"."amazon_security_lake_glue_db_us_east_1"."<security_lake_table>"
WHERE time_dt BETWEEN TIMESTAMP '<YYYY-MM-DD>' AND TIMESTAMP '<YYYY-MM-DD>'
    AND <specific_filter>

UNION ALL

SELECT
    'CloudWatch UDS'  AS source,
    <field_1>         AS <alias>,
    <field_2>         AS <alias>,
    time_dt
FROM "s3tablescatalog/aws-cloudwatch"."logs"."<cw_uds_table>"
WHERE time_dt BETWEEN TIMESTAMP '<YYYY-MM-DD>' AND TIMESTAMP '<YYYY-MM-DD>'
    AND <specific_filter>

LIMIT 50;
```

### उदाहरण 3a - दोनों समय अवधियों में AssumeRole गतिविधि

माइग्रेशन सीमा के पार `AssumeRole` कॉल ट्रैक करें।

<details>
<summary>SQL क्वेरी देखें</summary>

```sql
SELECT
    'Security Lake'      AS source,
    api.operation        AS event_name,
    api.service.name     AS event_source,
    actor.user.name      AS username,
    src_endpoint.ip      AS source_ip,
    time_dt,
    status
FROM "awsdatacatalog"."amazon_security_lake_glue_db_us_east_1"."amazon_security_lake_table_us_east_1_cloud_trail_mgmt_2_0"
WHERE time_dt BETWEEN TIMESTAMP '2025-01-01' AND TIMESTAMP '2025-06-01'
    AND api.operation = 'AssumeRole'

UNION ALL

SELECT
    'CloudWatch UDS'     AS source,
    api.operation        AS event_name,
    api.service.name     AS event_source,
    actor.user.name      AS username,
    src_endpoint.ip      AS source_ip,
    time_dt,
    status
FROM "s3tablescatalog/aws-cloudwatch"."logs"."aws_cloudtrail__management"
WHERE time_dt BETWEEN TIMESTAMP '2025-06-01' AND TIMESTAMP '2025-07-01'
    AND api.operation = 'AssumeRole'

LIMIT 50;
```

</details>

**यह क्वेरी क्या दिखाती है:**

- दोनों समय अवधियों से `AssumeRole` इवेंट, `source` कॉलम द्वारा डेटा स्टोर की पहचान
- माइग्रेशन सीमा के पार कौन रोल assume कर रहा है और कहां से, यह ट्रैक करने के लिए उपयोगकर्ता पहचान और सोर्स IP

**इस क्वेरी को अनुकूलित करना:**

| लक्ष्य | संशोधन |
|---|---|
| विभिन्न API कॉल के लिए हंट | `api.operation = 'AssumeRole'` को किसी अन्य ऑपरेशन जैसे `'CreateUser'`, `'PutBucketPolicy'`, आदि में बदलें |
| एरर इवेंट द्वारा फ़िल्टर | दोनों SELECT ब्लॉक में `AND status = 'Failure'` जोड़ें |
| किसी विशिष्ट उपयोगकर्ता तक सीमित | दोनों SELECT ब्लॉक में `AND actor.user.name = '[USERNAME]'` जोड़ें |

---

### उदाहरण 3b - दोनों समय अवधियों में अस्वीकृत VPC Flows

Security Lake (ऐतिहासिक) और CloudWatch unified data store (हालिया) से अस्वीकृत नेटवर्क फ्लो की तुलना करें।

<details>
<summary>SQL क्वेरी देखें</summary>

```sql
SELECT
    'Security Lake'              AS source,
    src_endpoint.ip              AS source_ip,
    dst_endpoint.ip              AS dest_ip,
    dst_endpoint.port            AS dest_port,
    traffic.bytes                AS bytes,
    time_dt,
    connection_info.direction    AS direction
FROM "awsdatacatalog"."amazon_security_lake_glue_db_us_east_1"."amazon_security_lake_table_us_east_1_vpc_flow_2_0"
WHERE time_dt BETWEEN TIMESTAMP '2025-01-01' AND TIMESTAMP '2025-06-01'
    AND activity_name = 'Reject'

UNION ALL

SELECT
    'CloudWatch UDS'             AS source,
    src_endpoint.ip              AS source_ip,
    dst_endpoint.ip              AS dest_ip,
    dst_endpoint.port            AS dest_port,
    traffic.bytes                AS bytes,
    time_dt,
    connection_info.direction    AS direction
FROM "s3tablescatalog/aws-cloudwatch"."logs"."amazon_vpc__flow"
WHERE time_dt BETWEEN TIMESTAMP '2025-06-01' AND TIMESTAMP '2025-07-01'
    AND activity_name = 'Reject'

LIMIT 50;
```

</details>

**इस क्वेरी को अनुकूलित करना:**

| लक्ष्य | संशोधन |
|---|---|
| विशिष्ट डेस्टिनेशन पोर्ट द्वारा फ़िल्टर | दोनों SELECT ब्लॉक में `AND dst_endpoint.port = 443` जोड़ें |
| विशिष्ट सोर्स IP द्वारा फ़िल्टर | दोनों SELECT ब्लॉक में `AND src_endpoint.ip = '[IP_ADDRESS]'` जोड़ें |
| स्वीकृत ट्रैफिक भी शामिल करें | `AND activity_name = 'Reject'` फ़िल्टर हटाएं, या `'Accept'` में बदलें |

---

### उदाहरण 3c - दोनों समय अवधियों में उच्च-गंभीरता Security Hub Findings

माइग्रेशन सीमा के पार उच्च-गंभीरता Security Hub findings ट्रैक करें।

<details>
<summary>SQL क्वेरी देखें</summary>

```sql
SELECT
    'Security Lake'          AS source,
    finding_info.title       AS finding_title,
    finding_info.uid         AS finding_uid,
    severity,
    status,
    cloud.account.uid        AS account,
    time_dt
FROM "awsdatacatalog"."amazon_security_lake_glue_db_us_east_1"."amazon_security_lake_table_us_east_1_sh_findings_2_0"
WHERE time_dt BETWEEN TIMESTAMP '2025-01-01' AND TIMESTAMP '2025-06-01'
    AND severity_id >= 4

UNION ALL

SELECT
    'CloudWatch UDS'         AS source,
    finding_info.title       AS finding_title,
    finding_info.uid         AS finding_uid,
    severity,
    status,
    cloud.account.uid        AS account,
    time_dt
FROM "s3tablescatalog/aws-cloudwatch"."logs"."aws_security_hub__compliance_finding"
WHERE time_dt BETWEEN TIMESTAMP '2025-06-01' AND TIMESTAMP '2025-07-01'
    AND severity_id >= 4

LIMIT 50;
```

</details>

**इस क्वेरी को अनुकूलित करना:**

| लक्ष्य | संशोधन |
|---|---|
| MEDIUM गंभीरता शामिल करें | दोनों SELECT ब्लॉक में `severity_id >= 4` को `severity_id >= 3` में बदलें |
| Finding स्थिति द्वारा फ़िल्टर | अनसुलझी findings खोजने के लिए दोनों SELECT ब्लॉक में `AND status = 'New'` जोड़ें |
| किसी विशिष्ट अकाउंट पर ध्यान केंद्रित | दोनों SELECT ब्लॉक में `AND cloud.account.uid = '[ACCOUNT_ID]'` जोड़ें |
| Vulnerability findings क्वेरी करें | CW UDS टेबल को `aws_security_hub__vulnerability_finding` से बदलें |

---
