---
title: CloudTrail Monitoring
sidebar_label: CloudTrail Monitoring
---

# CloudTrail Monitoring

## Overview

AWS CloudTrail monitors and records account activity throughout your AWS infrastructure, providing control over storage, analysis, and remediation actions. It captures API calls made through the AWS Management Console, AWS SDKs, and command line tools — enabling you to identify which users and accounts called AWS APIs, the source IP addresses, and when calls occurred.

This solution covers configuring CloudTrail trails (multi-Region, single-Region, and organizational), enabling management and data events, using advanced event selectors for granular control, monitoring network activity events for VPC endpoints, and integrating with Amazon CloudWatch Logs for near real-time alerting. For full reference, see the [AWS CloudTrail User Guide](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html).

## Prerequisites

- An AWS account with permissions to create and manage CloudTrail trails (`cloudtrail:*`, `s3:CreateBucket`, `s3:PutBucketPolicy`)
- An S3 bucket for log delivery (or let CloudTrail create one)
- For CloudWatch Logs integration: a CloudWatch Logs log group and IAM role granting CloudTrail write access
- For organizational trails: AWS Organizations with all features enabled

## Architecture

```
┌─────────────────────────────────────┐
│         AWS Account(s)              │
│  Management Events ─┐               │
│  Data Events ───────┤               │
│  Network Activity ──┘               │
└──────────┬──────────────────────────┘
           │ CloudTrail Trail
           ▼
┌──────────────────────┐     ┌─────────────────────────┐
│   Amazon S3 Bucket   │     │  Amazon CloudWatch Logs  │
│  (long-term storage) │     │  (near real-time query)  │
└──────────────────────┘     └────────────┬────────────┘
                                          │
                              ┌───────────▼────────────┐
                              │  CloudWatch Alarms /    │
                              │  Logs Insights queries  │
                              └────────────────────────┘
```

![CloudTrail Insights anomaly detection dashboard](/img/cloudops/guides/cloudtrail/cloudtrail-insights.png "CloudTrail Insights detecting unusual API activity")

## Deploy

### 1. Create a multi-Region trail

```bash
aws cloudtrail create-trail \
  --name my-org-trail \
  --s3-bucket-name my-cloudtrail-bucket \
  --is-multi-region-trail \
  --enable-log-file-validation \
  --kms-key-id alias/cloudtrail-key
```

### 2. Enable CloudWatch Logs integration

```bash
aws cloudtrail update-trail \
  --name my-org-trail \
  --cloud-watch-logs-log-group-arn arn:aws:logs:us-east-1:123456789012:log-group:CloudTrail/DefaultLogGroup:* \
  --cloud-watch-logs-role-arn arn:aws:iam::123456789012:role/CloudTrail_CloudWatchLogs_Role
```

### 3. Start logging

```bash
aws cloudtrail start-logging --name my-org-trail
```

### 4. Enable data events with advanced event selectors

Use advanced event selectors to log only critical S3 write operations on sensitive buckets:

```json
[
  {
    "FieldSelectors": [
      {
        "Field": "eventCategory",
        "Equals": ["Data"]
      },
      {
        "Field": "resources.type",
        "Equals": ["AWS::S3::Object"]
      },
      {
        "Field": "eventName",
        "Equals": ["DeleteObject", "PutObject", "RestoreObject"]
      },
      {
        "Field": "resources.ARN",
        "StartsWith": ["arn:aws:s3:::sensitive-bucket/", "arn:aws:s3:::compliance-bucket/"]
      }
    ]
  }
]
```

Apply with:

```bash
aws cloudtrail put-event-selectors \
  --trail-name my-org-trail \
  --advanced-event-selectors file://selectors.json
```

![Advanced event selectors configuration for data events](/img/cloudops/guides/cloudtrail-lake/cloudtrail-data-events-advanced-selector.png "Advanced Event Selectors for Data Events")

### 5. Enable CloudTrail Insights

```bash
aws cloudtrail put-insight-selectors \
  --trail-name my-org-trail \
  --insight-selectors '[{"InsightType": "ApiCallRateInsight"},{"InsightType": "ApiErrorRateInsight"}]'
```

### 6. Enable network activity events (CloudTrail Lake)

Network activity events for VPC endpoints require an event data store. Create one with:

```bash
aws cloudtrail create-event-data-store \
  --name network-activity-eds \
  --advanced-event-selectors '[{"FieldSelectors":[{"Field":"eventCategory","Equals":["NetworkActivity"]}]}]'
```

## Validate

1. **Verify trail status:**

```bash
aws cloudtrail get-trail-status --name my-org-trail
```

Confirm `IsLogging` is `true` and `LatestDeliveryTime` is recent.

2. **Query recent events in CloudWatch Logs Insights:**

```
SOURCE logGroups() | filterIndex @data_source_name in ["aws_cloudtrail"]
| fields @timestamp, eventName, userIdentity.arn, sourceIPAddress
| sort @timestamp desc
| limit 20
```

3. **Verify data events are flowing (CloudTrail Lake):**

```sql
SELECT eventTime, eventName, userIdentity.arn
FROM $EDS_ID
WHERE eventCategory = 'Data'
  AND eventtime >= '2026-08-19 00:00:00'
ORDER BY eventTime DESC
LIMIT 10
```

## Troubleshoot

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| No events in CloudWatch Logs | CloudWatch Logs integration not configured or IAM role missing permissions | Verify the trail has `CloudWatchLogsLogGroupArn` set and the role has `logs:CreateLogStream` and `logs:PutLogEvents` permissions |
| Data events not appearing | Advanced event selectors misconfigured or trail not started | Confirm selectors with `aws cloudtrail get-event-selectors` and verify `IsLogging` is true |
| Insights events not generating | Insights not enabled or insufficient baseline data | Enable Insights selectors and allow 36 hours for baseline calculation |
| Network activity events empty | Event data store not configured for `NetworkActivity` category | Verify the EDS advanced event selectors include `eventCategory = NetworkActivity` |

## Related Solutions

- [CloudTrail Security Forensics](../cloudtrail-security-forensics/)
- [CloudTrail Cost Optimization](../cloudtrail-cost-optimization/)
- [CloudWatch Logs Security](../cloudwatch-logs-security/)
