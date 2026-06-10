---
sidebar_position: 2
title: CloudWatch Unified Data Store ఉపయోగించి Security Visibility డాష్‌బోర్డ్
---

# CloudWatch Unified Data Store ఉపయోగించి Security Visibility డాష్‌బోర్డ్

Amazon CloudWatch [Unified Data Store](https://aws.amazon.com/blogs/aws/amazon-cloudwatch-introduces-unified-data-management-and-analytics-for-operations-security-and-compliance/) individual log group names తెలియాల్సిన అవసరం లేకుండా AWS services అంతటా మీ log data ను discover చేయడానికి, organize చేయడానికి మరియు query చేయడానికి centralized way అందిస్తుంది. దీన్ని సాధ్యం చేయడానికి, CloudWatch Unified Data Store [facets](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatchLogs-Facets.html) ఉపయోగిస్తుంది. `@data_source_name`, `@data_source_type` మరియు `@data_format` వంటి Default facets ఎటువంటి configuration అవసరం లేకుండా అన్ని Standard log class log groups పై automatically available.

ఈ facets ద్వారా, CloudWatch logs ను వాటి originating [data source](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/supported-aws-services-data-sources.html) ద్వారా automatically categorize చేస్తుంది — AWS CloudTrail మరియు Amazon VPC Flow Logs వంటివి — తద్వారా ఎన్ని log groups ఉన్నా లేదా వాటి పేరు ఏమిటో తో సంబంధం లేకుండా `@data_source_name` facet ఉపయోగించి మీ అన్ని CloudTrail లేదా VPC Flow Log log data ను query చేయవచ్చు.

[CloudWatch Cross-account cross-Region log centralization](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatchLogs_Centralization.html) తో, ఆ foundation పై security analytics build చేయవచ్చు. ఈ guide మీ CloudTrail మరియు VPC Flow Logs activity లోకి near real-time visibility provide చేయడానికి CloudWatch data sources leverage చేసే sample pre-built [CloudWatch Dashboard](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Dashboards.html) ను AWS CloudFormation ద్వారా deploy చేయడం walk through చేస్తుంది.

## ఈ డాష్‌బోర్డ్ ఎందుకు ముఖ్యం

Security teams వారి AWS accounts అంతటా API activity మరియు network traffic లోకి centralized, near real-time visibility అవసరం. Centralized dashboard లేకుండా, teams manually multiple log groups అంతటా queries run చేయాలి.

ఈ dashboard అనేక key challenges ను address చేస్తుంది:

- **Log group names పై dependency లేదు**: CloudWatch Unified Data Store default facets ద్వారా CloudTrail మరియు VPC Flow Logs dynamically discover చేయడానికి [`SOURCE logGroups() | filterIndex @data_source_name`](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax-FilterIndex.html) ఉపయోగిస్తుంది
- **Dual format support**: మీ log format preference ఆధారంగా Standard (native AWS field names) లేదా OCSF (Open Cybersecurity Schema Framework) version deploy చేస్తుంది
- **Cross-service correlation**: Visual correlation కోసం CloudTrail API activity మరియు VPC Flow Log network data ను side by side place చేస్తుంది
- **Accounts అంతటా portable**: అదే CloudFormation template CloudTrail మరియు VPC Flow Logs CloudWatch Logs కు flow అయ్యే ఏ account లోనైనా పని చేస్తుంది

## Prerequisites

Deploy చేయడానికి ముందు, మీ account లో required data sources available ఉన్నాయని verify చేయండి:

```bash
aws logs list-aggregate-log-group-summaries --group-by DATA_SOURCE_NAME_AND_TYPE
```

Output లో `aws_cloudtrail` మరియు `amazon_vpc` కోసం entries కనిపించాలి.

## డాష్‌బోర్డ్ Deploy చేయండి

1. **[CloudWatch_Dashboard_CloudTrail_VPC.yaml](https://raw.githubusercontent.com/aws-samples/aws-management-and-governance-samples/refs/heads/master/AWSCloudTrail/cloudwatch-dashboards/CloudWatch_Dashboard_CloudTrail_VPC.yaml)** template download చేయండి.
1. **CloudFormation** → **Create stack** → **With new resources** కు navigate చేయండి.
1. `CloudWatch_Dashboard_CloudTrail_VPC.yaml` template upload చేయండి.
1. Parameters configure చేయండి:
   - **DashboardName**: మీ dashboard కోసం పేరు (default: `CloudTrail-VPC-Dashboard`).
   - **LogFormat**: Native AWS CloudTrail/VPC Flow Log field names కోసం `Standard` లేదా Open Cybersecurity Schema Framework normalized fields కోసం `OCSF` ఎంచుకోండి.
1. Review చేసి stack create చేయండి.

### CloudFormation Parameters

| Parameter                          | Default                    | వివరణ                                                                                      |
|------------------------------------|----------------------------|--------------------------------------------------------------------------------------------------|
| `DashboardName`                    | `CloudTrail-VPC-Dashboard`    | CloudWatch dashboard కోసం పేరు                                                                |
| `LogFormat`                        | `Standard`                 | `Standard` (native AWS fields) లేదా `OCSF` (normalized schema)                                    |

## Queries ఎలా పని చేస్తాయి

ఈ dashboard లో ప్రతి [CloudWatch Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html) query ఒకే pattern ఉపయోగిస్తుంది:

```
SOURCE logGroups() | filterIndex @data_source_name in ["aws_cloudtrail"]
| <your query logic here>
```

- [`SOURCE logGroups()`](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax-Source.html) CloudWatch కు account లోని అన్ని log groups అంతటా search చేయమని చెబుతుంది.
- [`filterIndex @data_source_name in [...]`](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax-FilterIndex.html) specified data source కలిగి ఉన్న log groups కు search narrow చేయడానికి `@data_source_name` default facet ఉపయోగిస్తుంది.

## Security Best Practices

### IAM తో Dashboard Access Restrict చేయడం

Best practice గా, security data surface చేసే ఏ CloudWatch dashboard కైనా least-privilege access controls apply చేయండి.

Dashboard కు read-only access grant చేసి modification deny చేసే ఉదాహరణ IAM policy క్రింద ఉంది:

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

### CloudWatch Alarms తో Dashboard ను Complement చేయడం

Dashboard ఏమి జరుగుతుందో చూపిస్తుంది కానీ ఏదైనా తప్పు అయినప్పుడు notify చేయదు. Critical security events పై alert పొందడానికి, [CloudWatch Logs metric filters](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/MonitoringLogData.html) backed [CloudWatch Alarms](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html) set up చేయండి.

| Event | Metric Filter Pattern |
|---|---|
| Root account usage | `{ $.userIdentity.type = "Root" && $.userIdentity.invokedBy NOT EXISTS && $.eventType != "AwsServiceEvent" }` |
| Privilege escalation | `{ ($.eventName = "AttachRolePolicy") \|\| ($.eventName = "PutRolePolicy") \|\| ($.eventName = "CreateAccessKey") \|\| ($.eventName = "CreateLoginProfile") }` |
| Console login failures | `{ ($.eventName = "ConsoleLogin") && ($.errorMessage = "Failed authentication") }` |

---
![CloudTrail Dashboard](/img/cloudops/solutions/cloudtrail-dashboards/example-dashboard-01.png)

![CloudTrail Dashboard](/img/cloudops/solutions/cloudtrail-dashboards/example-dashboard-02.png)

## Clean Up

Dashboard మరియు అన్ని associated resources remove చేయడానికి:

```bash
aws cloudformation delete-stack --stack-name CloudTrail-VPC-Dashboard
```

:::note
Deploy section లో ఉపయోగించిన CloudFormation stack పేరుతో **CloudTrail-VPC-Dashboard** ను replace చేయండి
:::

## ముగింపు

ఈ CloudWatch Dashboard CloudWatch Unified Data Store data sources ఉపయోగించి CloudTrail API activity మరియు VPC Flow Log network data అంతటా centralized, near real-time security visibility provide చేస్తుంది. `@data_source_name` default facet leverage చేయడం ద్వారా, dashboard log group name configuration అవసరం లేకుండా సరైన log groups ను automatically discover చేస్తుంది, ఏ AWS account లోనైనా portable చేస్తుంది.
