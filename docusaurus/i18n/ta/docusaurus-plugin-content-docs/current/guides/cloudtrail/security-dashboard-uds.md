---
sidebar_position: 2
title: CloudWatch Unified Data Store ஐப் பயன்படுத்தி பாதுகாப்பு தெரிவுநிலை டாஷ்போர்டு
---

# CloudWatch Unified Data Store ஐப் பயன்படுத்தி பாதுகாப்பு தெரிவுநிலை டாஷ்போர்டு

Amazon CloudWatch [Unified Data Store](https://aws.amazon.com/blogs/aws/amazon-cloudwatch-introduces-unified-data-management-and-analytics-for-operations-security-and-compliance/) தனிப்பட்ட log group பெயர்களை அறியாமலேயே AWS சேவைகள் முழுவதும் உங்கள் லாக் தரவை கண்டறிய, ஒழுங்கமைக்க மற்றும் வினவ ஒரு மையப்படுத்தப்பட்ட வழியை வழங்குகிறது. இதை சாத்தியமாக்க, CloudWatch Unified Data Store [facets](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatchLogs-Facets.html) ஐ பயன்படுத்துகிறது — உங்கள் லாக் தரவில் உள்ள புலங்கள், CloudWatch ஊடாடும் வடிகட்டல், குழுவாக்கம் மற்றும் பகுப்பாய்விற்காக வெளிப்படுத்துகிறது. `@data_source_name`, `@data_source_type` மற்றும் `@data_format` போன்ற இயல்புநிலை facets எந்த கட்டமைப்பும் தேவையில்லாமல் அனைத்து Standard log class log groups இல் தானாகவே கிடைக்கின்றன. [CloudWatch Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html) console இல், உங்கள் தரவை காட்சி ரீதியாக ஆராய facet மதிப்புகளை தேர்வு செய்யலாம், அல்லது தேடல் நோக்கத்தை பொருத்தமான log groups மற்றும் events க்கு மட்டுமே திறமையாக சுருக்க உங்கள் வினவல்களில் அவற்றை குறிப்பிடலாம்.

இந்த facets மூலம், CloudWatch தானாகவே லாக்குகளை அவற்றின் தோற்றுவிக்கும் [data source](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/supported-aws-services-data-sources.html) மூலம் வகைப்படுத்துகிறது — AWS CloudTrail மற்றும் Amazon VPC Flow Logs போன்றவை — எனவே எத்தனை log groups இருந்தாலும் அல்லது அவை என்ன பெயரிடப்பட்டிருந்தாலும் `@data_source_name` facet ஐப் பயன்படுத்தி உங்கள் log groups முழுவதும் அனைத்து CloudTrail அல்லது VPC Flow Log தரவையும் வினவலாம்.

[CloudWatch Cross-account cross-Region log centralization](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatchLogs_Centralization.html) உடன், அந்த அடித்தளத்தின் மேல் பாதுகாப்பு பகுப்பாய்வை உருவாக்கலாம். இந்த வழிகாட்டி AWS CloudFormation மூலம் ஒரு மாதிரி முன்-கட்டப்பட்ட [CloudWatch Dashboard](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Dashboards.html) ஐ நிலைநிறுத்துவதை விவரிக்கிறது, இது CloudWatch data sources ஐ பயன்படுத்தி உங்கள் CloudTrail மற்றும் VPC Flow Logs செயல்பாட்டில் நிகழ்நேர தெரிவுநிலையை வழங்குகிறது. ஒவ்வொரு widget என்ன வழங்குகிறது என்பதையும் பாதுகாப்பு கண்காணிப்பு, சம்பவ விசாரணை மற்றும் இணக்க தெரிவுநிலைக்கு டாஷ்போர்டை எவ்வாறு பயன்படுத்துவது என்பதையும் விளக்குகிறது.

## இந்த டாஷ்போர்டு ஏன் முக்கியம்

பாதுகாப்பு குழுக்களுக்கு AWS கணக்குகள் முழுவதும் API செயல்பாடு மற்றும் நெட்வொர்க் போக்குவரத்தில் மையப்படுத்தப்பட்ட, நிகழ்நேர தெரிவுநிலை தேவை. மையப்படுத்தப்பட்ட டாஷ்போர்டு இல்லாமல், குழுக்கள் பல log groups முழுவதும் கைமுறையாக வினவல்களை இயக்கவும், CloudTrail மற்றும் VPC Flow Logs இடையே தரவை தொடர்புபடுத்தவும், வெவ்வேறு மூலங்களிலிருந்து பாதுகாப்பு சூழலை இணைக்கவும் வேண்டும்.

இந்த டாஷ்போர்டு பல முக்கிய சவால்களை தீர்க்கிறது:

- **Log group பெயர்களில் சார்பு இல்லை**: உங்கள் கணக்கில் log groups என்ன பெயரிடப்பட்டிருந்தாலும் CloudWatch Unified Data Store இயல்புநிலை facets மூலம் CloudTrail மற்றும் VPC Flow Logs ஐ மாறும் வகையில் கண்டறிய [`SOURCE logGroups() | filterIndex @data_source_name`](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax-FilterIndex.html) ஐ பயன்படுத்துகிறது.
- **இரட்டை வடிவ ஆதரவு**: உங்கள் log format விருப்பத்தின் அடிப்படையில் Standard (native AWS field names) அல்லது OCSF (Open Cybersecurity Schema Framework) பதிப்பு டாஷ்போர்டை நிலைநிறுத்துகிறது.
- **குறுக்கு-சேவை தொடர்பு**: பாதுகாப்பு நிகழ்வுகளின் காட்சி தொடர்புக்காக CloudTrail API செயல்பாடு மற்றும் VPC Flow Log நெட்வொர்க் தரவை பக்கவாட்டில் வைக்கிறது.
- **கணக்குகள் முழுவதும் எடுத்துச் செல்லக்கூடியது**: அதே CloudFormation template CloudTrail மற்றும் VPC Flow Logs CloudWatch Logs க்கு பாயும் எந்த கணக்கிலும் log group பெயர்களுக்கான parameter மாற்றங்கள் தேவையில்லாமல் செயல்படுகிறது.

## முன்நிபந்தனைகள்

நிலைநிறுத்துவதற்கு முன், உங்கள் கணக்கில் தேவையான data sources கிடைக்கின்றனவா என்பதை சரிபார்க்கவும்:

```bash
aws logs list-aggregate-log-group-summaries --group-by DATA_SOURCE_NAME_AND_TYPE
```

வெளியீட்டில் `aws_cloudtrail` மற்றும் `amazon_vpc` க்கான entries காண வேண்டும். இவை காணவில்லை என்றால், பின்வருவனவற்றை உறுதிசெய்யவும்:

1. **[CloudTrail](https://aws.amazon.com/about-aws/whats-new/2025/12/key-enhancements-cloudtrail-events-cloudwatch/)** CloudWatch Logs க்கு logs வழங்க கட்டமைக்கப்பட்டுள்ளது.
2. **[VPC Flow Logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/telemetry-config-rules.html)** குறைந்தது ஒரு VPC க்கு CloudWatch Logs க்கு வழங்க கட்டமைக்கப்பட்டுள்ளது.

## டாஷ்போர்டை நிலைநிறுத்துதல்

1. **[CloudWatch_Dashboard_CloudTrail_VPC.yaml](https://raw.githubusercontent.com/aws-samples/aws-management-and-governance-samples/refs/heads/master/AWSCloudTrail/cloudwatch-dashboards/CloudWatch_Dashboard_CloudTrail_VPC.yaml)** template ஐ பதிவிறக்கவும்.
1. **CloudFormation** → **Create stack** → **With new resources** க்கு செல்லவும்.
1. `CloudWatch_Dashboard_CloudTrail_VPC.yaml` template ஐ பதிவேற்றவும்.
1. Parameters ஐ கட்டமைக்கவும்:
   - **DashboardName**: உங்கள் டாஷ்போர்டுக்கான பெயர் (இயல்புநிலை: `CloudTrail-VPC-Dashboard`).
   - **LogFormat**: native AWS CloudTrail/VPC Flow Log field names க்கு `Standard` அல்லது Open Cybersecurity Schema Framework normalized fields க்கு `OCSF` ஐ தேர்வு செய்யவும்.
1. மதிப்பாய்வு செய்து stack ஐ உருவாக்கவும்.

### CloudFormation Parameters

| Parameter                          | இயல்புநிலை                    | விளக்கம்                                                                                      |
|------------------------------------|----------------------------|--------------------------------------------------------------------------------------------------|
| `DashboardName`                    | `CloudTrail-VPC-Dashboard`    | CloudWatch dashboard க்கான பெயர்                                                                |
| `LogFormat`                        | `Standard`                 | `Standard` (native AWS fields) அல்லது `OCSF` (normalized schema)                                    |

## வினவல்கள் எவ்வாறு செயல்படுகின்றன

இந்த டாஷ்போர்டில் உள்ள ஒவ்வொரு [CloudWatch Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html) வினவலும் அதே pattern ஐ பயன்படுத்துகிறது:

```
SOURCE logGroups() | filterIndex @data_source_name in ["aws_cloudtrail"]
| <your query logic here>
```

- [`SOURCE logGroups()`](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax-Source.html) கணக்கில் உள்ள அனைத்து log groups முழுவதும் தேட CloudWatch க்கு கூறுகிறது.
- [`filterIndex @data_source_name in [...]`](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax-FilterIndex.html) குறிப்பிட்ட data source ஐ கொண்ட log groups க்கு மட்டும் தேடலை சுருக்க `@data_source_name` இயல்புநிலை facet ஐ பயன்படுத்துகிறது.
- CloudTrail வினவல்களுக்கு, data source name `aws_cloudtrail` ஆகும்.
- VPC Flow Log வினவல்களுக்கு, data source name `amazon_vpc` ஆகும்.

இந்த அணுகுமுறை உண்மையான log group பெயரை நீங்கள் அறிந்திருக்க அல்லது கட்டமைக்க வேண்டியதில்லை என்பதை உறுதிசெய்கிறது. உங்கள் CloudTrail log group `aws-cloudtrail-logs`, `aws/cloudtrail/managementevents` அல்லது வேறு எந்த தனிப்பயன் பெயராக இருந்தாலும் டாஷ்போர்டு ஒரே மாதிரியாக செயல்படுகிறது.

## பாதுகாப்பு சிறந்த நடைமுறைகள்

### IAM உடன் டாஷ்போர்டு அணுகலை கட்டுப்படுத்துதல்

சிறந்த நடைமுறையாக, பாதுகாப்பு தரவை வெளிப்படுத்தும் எந்த CloudWatch dashboard க்கும் குறைந்தபட்ச-சிறப்புரிமை அணுகல் கட்டுப்பாடுகளை பயன்படுத்தவும்.

டாஷ்போர்டுக்கான படிக்க-மட்டும் அணுகலை வழங்கி மாற்றத்தை மறுக்கும் ஒரு எடுத்துக்காட்டு IAM policy கீழே உள்ளது. பார்வை-மட்டும் அணுகல் கொண்டிருக்க வேண்டிய IAM roles அல்லது groups க்கு இதை இணைக்கவும்:

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

`ACCOUNT_ID` ஐ உங்கள் AWS கணக்கு ID உடன் மாற்றவும், நீங்கள் தனிப்பயனாக்கியிருந்தால் `CloudTrail-VPC-Dashboard` ஐ உங்கள் உண்மையான dashboard பெயருடன் மாற்றவும்.

டாஷ்போர்டை பராமரிக்க வேண்டிய பாதுகாப்பு செயல்பாட்டு குழுவிற்கு, படிக்க மற்றும் எழுத இரண்டையும் அனுமதிக்கும் தனி policy ஐ பயன்படுத்தவும்:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowDashboardFullAccess",
      "Effect": "Allow",
      "Action": [
        "cloudwatch:GetDashboard",
        "cloudwatch:ListDashboards",
        "cloudwatch:PutDashboard",
        "cloudwatch:DeleteDashboards"
      ],
      "Resource": "arn:aws:cloudwatch::ACCOUNT_ID:dashboard/CloudTrail-VPC-Dashboard"
    }
  ]
}
```

டாஷ்போர்டு வினவல்களுக்கு தொடர்புடைய log groups இல் `logs:StartQuery`, `logs:GetQueryResults` மற்றும் `logs:FilterLogEvents` அனுமதிகளும் தேவை. IAM roles இந்த அனுமதிகளை CloudTrail மற்றும் VPC Flow Log log groups க்கு scoped ஆக வைத்திருப்பதை உறுதிசெய்யவும்.

### CloudWatch Alarms உடன் டாஷ்போர்டை நிரப்புதல்

டாஷ்போர்டு என்ன நடக்கிறது என்பதை காண்பிக்கிறது ஆனால் ஏதாவது தவறு நடக்கும்போது உங்களுக்கு அறிவிக்காது. முக்கியமான பாதுகாப்பு நிகழ்வுகளில் எச்சரிக்கை பெற, [CloudWatch Logs metric filters](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/MonitoringLogData.html) ஆல் ஆதரிக்கப்பட்ட [CloudWatch Alarms](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html) ஐ அமைக்கவும். பரிசீலிக்க வேண்டிய சில:

| நிகழ்வு | Metric Filter Pattern |
|---|---|
| Root கணக்கு பயன்பாடு | `{ $.userIdentity.type = "Root" && $.userIdentity.invokedBy NOT EXISTS && $.eventType != "AwsServiceEvent" }` |
| சிறப்புரிமை உயர்வு | `{ ($.eventName = "AttachRolePolicy") \|\| ($.eventName = "PutRolePolicy") \|\| ($.eventName = "CreateAccessKey") \|\| ($.eventName = "CreateLoginProfile") }` |
| Console உள்நுழைவு தோல்விகள் | `{ ($.eventName = "ConsoleLogin") && ($.errorMessage = "Failed authentication") }` |

Rolling window இல் REJECT count மீது [CloudWatch Logs Insights query-based alarm](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Create_Metrics_Insights_Alarm.html) ஐ பயன்படுத்தவும். | Port scanning அல்லது active network attacks ஐ கண்டறிகிறது. |

உங்கள் பாதுகாப்பு செயல்பாட்டு குழுவிற்கு email, Slack அல்லது உங்கள் incident management platform மூலம் அறிவிக்கும் [SNS topic](https://docs.aws.amazon.com/sns/latest/dg/welcome.html) க்கு alarm actions ஐ வழிநடத்தவும்.

### Log Group மறையாக்கம் மற்றும் தக்கவைப்பு

CloudWatch Logs இயல்பாகவே AWS-managed keys ஐ பயன்படுத்தி அனைத்து log தரவையும் ஓய்வில் மறையாக்குகிறது — கட்டமைப்பு தேவையில்லை. இருப்பினும், உங்கள் நிறுவனத்திற்கு இணக்கத்திற்காக customer-managed encryption keys தேவைப்பட்டால், ஒவ்வொரு log group உடனும் ஒரு [KMS key ஐ இணைக்கலாம்](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/encrypt-log-data-kms.html).

இந்த template டாஷ்போர்டை மட்டுமே உருவாக்குகிறது — அடிப்படை log groups ஐ உருவாக்கவோ நிர்வகிக்கவோ இல்லை, எனவே அவற்றில் மறையாக்கம் அல்லது தக்கவைப்பு அமைப்புகளை அமலாக்க முடியாது. டாஷ்போர்டுக்கான CloudTrail மற்றும் VPC Flow Log log groups பொருத்தமான அமைப்புகளை கொண்டிருப்பதை உறுதிசெய்யவும்:

- **KMS மறையாக்கம்**: தேவைப்பட்டால், `aws logs associate-kms-key` ஐ பயன்படுத்தி அல்லது log group ஐ உருவாக்கும்போது CloudFormation மூலம் KMS key ஐ log group உடன் இணைக்கவும்.
- **தக்கவைப்பு policy**: இயல்பாக, CloudWatch Logs log தரவை காலவரையின்றி வைத்திருக்கிறது. உங்கள் இணக்க தேவைகளை செலவுடன் சமநிலைப்படுத்தும் ஒரு [retention policy](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/Working-with-log-groups-and-streams.html#SettingLogRetention) ஐ அமைக்கவும்.

### கூடுதல் பரிந்துரைகள்

- தற்செயலான நீக்கலை தடுக்க நிலைநிறுத்தலுக்குப் பிறகு **CloudFormation stack termination protection ஐ இயக்கவும்**.
- அனைத்து கணக்குகளிலும் குறிப்பிட்ட admin roles க்கு `cloudwatch:PutDashboard` மற்றும் `cloudwatch:DeleteDashboards` ஐ கட்டுப்படுத்த AWS Organizations இல் **[Service Control Policies (SCPs)](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html)** ஐ பயன்படுத்தவும்.
- CloudTrail இல் `PutDashboard` event மூலம் எந்த dashboard மாற்றங்களும் தணிக்கை செய்யக்கூடியதாக இருக்க **CloudWatch API calls க்கான CloudTrail logging ஐ இயக்கவும்**.

## டாஷ்போர்டு பிரிவுகள் மற்றும் Widget குறிப்பு

டாஷ்போர்டு ஆறு பிரிவுகளாக ஒழுங்கமைக்கப்பட்டுள்ளது. கீழே Standard format பதிப்பு உள்ளது — OCSF பதிப்பு OCSF field names (`api.operation`, `src_endpoint.ip`, `actor.user.name`, போன்றவை) ஐ பயன்படுத்தும் சமமான widgets ஐ கொண்டுள்ளது.

---

### பிரிவு 1: பாதுகாப்பு கண்ணோட்டம்

இந்த பிரிவு உங்கள் AWS சூழல் முழுவதும் பாதுகாப்பு நிலையின் ஒரு பார்வையை வழங்குகிறது.

---

### பிரிவு 2: தொடர்புடைய பாதுகாப்பு நுண்ணறிவுகள் — CloudTrail + VPC Flow Logs

இந்த பிரிவு API-அடுக்கு மற்றும் நெட்வொர்க்-அடுக்கு பாதுகாப்பு தரவை காட்சி தொடர்புக்காக பக்கவாட்டில் வைக்கிறது.

---

### பிரிவு 3: நெட்வொர்க் பாதுகாப்பு — நெட்வொர்க் செயல்பாட்டு பகுப்பாய்வு

நெட்வொர்க்-அடுக்கு பாதுகாப்பு தெரிவுநிலைக்கான VPC Flow Log தரவில் ஆழமான பகுப்பாய்வு.

---

### பிரிவு 4: அடையாள மற்றும் அணுகல் மேலாண்மை

CloudTrail இலிருந்து IAM செயல்பாடு மற்றும் அங்கீகார நிகழ்வுகளில் கவனம் செலுத்துகிறது.

---

### பிரிவு 5: செயல்பாட்டு விநியோகம் மற்றும் பகுப்பாய்வு

செயல்பாட்டு மற்றும் பாதுகாப்பு விழிப்புணர்வுக்கான API செயல்பாட்டு முறைகளின் பரந்த பகுப்பாய்வு.

---

### பிரிவு 6: விரிவான பாதுகாப்பு நிகழ்வுகள் காலவரிசை

இது உங்கள் ஆய்வு தொடக்கப் புள்ளியாகும். எச்சரிக்கை எழும்போது அல்லது மேலே உள்ள widgets இல் அசாதாரணங்களை கவனிக்கும்போது, சம்பவ பதிலுக்கான முழு சூழலுடன் raw events ஐ பார்க்க இங்கே வாருங்கள்.

---
![CloudTrail Dashboard](/img/cloudops/solutions/cloudtrail-dashboards/example-dashboard-01.png)

![CloudTrail Dashboard](/img/cloudops/solutions/cloudtrail-dashboards/example-dashboard-02.png)

## சுத்தம் செய்தல்

டாஷ்போர்டு மற்றும் அனைத்து தொடர்புடைய வளங்களையும் நீக்க:

```bash
aws cloudformation delete-stack --stack-name CloudTrail-VPC-Dashboard
```

:::note
Deploy பிரிவில் பயன்படுத்தப்பட்ட CloudFormation stack இன் பெயருடன் **CloudTrail-VPC-Dashboard** ஐ மாற்றவும்
:::

## முடிவுரை

இந்த CloudWatch Dashboard CloudWatch Unified Data Store data sources ஐ பயன்படுத்தி CloudTrail API செயல்பாடு மற்றும் VPC Flow Log நெட்வொர்க் தரவு முழுவதும் மையப்படுத்தப்பட்ட, நிகழ்நேர பாதுகாப்பு தெரிவுநிலையை வழங்குகிறது. `@data_source_name` இயல்புநிலை facet ஐ பயன்படுத்துவதன் மூலம், டாஷ்போர்டு log group name கட்டமைப்பு தேவையில்லாமல் சரியான log groups ஐ தானாகவே கண்டறிகிறது, இது எந்த AWS கணக்கிலும் எடுத்துச் செல்லக்கூடியதாக ஆக்குகிறது. அச்சுறுத்தல் கண்டறிதல், சம்பவ விசாரணை மற்றும் இணக்க கண்காணிப்புக்கான உடனடி பாதுகாப்பு தெரிவுநிலையை பெற CloudFormation மூலம் நிமிடங்களில் நிலைநிறுத்தவும்.
