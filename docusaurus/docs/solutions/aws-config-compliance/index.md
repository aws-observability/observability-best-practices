---
title: AWS Config Compliance Monitoring
sidebar_label: AWS Config Compliance
---

import RelatedEvents from '@site/src/components/RelatedEvents';

# AWS Config Compliance Monitoring

## Related Events

<RelatedEvents topics={["security"]} />

## Overview

AWS Config is a fully managed service that provides resource inventory, configuration history, and change notifications for security and governance. It enables compliance auditing, security analysis, resource change tracking, and troubleshooting across your AWS environment.

This solution covers enabling and operating the AWS Config recorder, evaluating compliance with managed rules, custom rules, and conformance packs, remediating non-compliant resources, aggregating configuration data across accounts, and controlling AWS Config costs.

## Prerequisites

- AWS account with IAM permissions for `config:*`, `s3:*` (for delivery bucket), and `sns:*` (for notifications)
- An S3 bucket designated for configuration item storage (preferably in a centralized logging account)
- AWS Organizations enabled if deploying across multiple accounts
- AWS CloudFormation StackSets or AWS Systems Manager Quick Setup for multi-account deployment

## Architecture

AWS Config records configuration changes and evaluates compliance across your AWS resources, delivering results to S3 and CloudWatch.

![AWS Config resource timeline showing configuration changes over time](/img/cloudops/guides/config/resourcetimeline.png)

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  AWS Resources  │────▶│  Config Recorder │────▶│  S3 (Config     │
│  (all regions)  │     │                  │     │  Items)         │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                               │                         │
                               ▼                         ▼
                        ┌──────────────┐          ┌──────────────┐
                        │ Config Rules │          │ Athena /     │
                        │ Conformance  │          │ QuickSight   │
                        │ Packs        │          └──────────────┘
                        └──────────────┘
                               │
                               ▼
                        ┌──────────────────┐     ┌─────────────────┐
                        │ CloudWatch       │────▶│ SNS Alerts      │
                        │ Metrics          │     │                 │
                        └──────────────────┘     └─────────────────┘
```

## Deploy

### 1. Enable AWS Config across all regions

Use one of the following methods:

- **CloudFormation StackSets**: Deploy the configuration recorder across your organization using [StackSets templates](https://aws.amazon.com/blogs/mt/managing-aws-organizations-accounts-using-aws-config-and-aws-cloudformation-stacksets/).
- **Systems Manager Quick Setup**: Use the [streamlined deployment](https://aws.amazon.com/blogs/mt/managing-configuration-compliance-across-your-organization-with-aws-systems-manager-quick-setup/).
- **AWS Control Tower**: Automatically activates Config across enrolled accounts.

### 2. Configure the recorder

```bash
aws configservice put-configuration-recorder \
  --configuration-recorder name=default,roleARN=arn:aws:iam::ACCOUNT_ID:role/aws-service-role/config.amazonaws.com/AWSServiceRoleForConfig \
  --recording-group allSupported=true,includeGlobalResourceTypes=true
```

Record global resources (IAM) in only one region to avoid duplicates and extra cost.

### 3. Set up the delivery channel

```bash
aws configservice put-delivery-channel \
  --delivery-channel name=default,s3BucketName=my-config-bucket,snsTopicARN=arn:aws:sns:us-east-1:ACCOUNT_ID:config-notifications
```

### 4. Deploy conformance packs

Bundle rules into conformance packs for centralized deployment. AWS provides pre-built templates for HIPAA, NIST, and PCI-DSS:

```bash
aws configservice put-conformance-pack \
  --conformance-pack-name my-security-pack \
  --template-s3-uri s3://my-bucket/conformance-pack-template.yaml
```

For organization-wide deployment, use a [delegated admin account](https://aws.amazon.com/blogs/mt/deploy-aws-config-rules-and-conformance-packs-using-a-delegated-admin/).

### 5. Configure remediation

Associate Systems Manager Automation documents with non-compliant rules:

```bash
aws configservice put-remediation-configurations \
  --remediation-configurations '[{
    "ConfigRuleName": "s3-bucket-versioning-enabled",
    "TargetType": "SSM_DOCUMENT",
    "TargetId": "AWS-ConfigureS3BucketVersioning",
    "Automatic": true,
    "MaximumAutomaticAttempts": 3,
    "RetryAttemptSeconds": 60
  }]'
```

### 6. Set up cross-account aggregation

```bash
aws configservice put-configuration-aggregator \
  --configuration-aggregator-name my-org-aggregator \
  --organization-aggregation-source RoleArn=arn:aws:iam::ACCOUNT_ID:role/ConfigAggregatorRole,AllAwsRegions=true
```

## Validate

1. Confirm the recorder is running:

```bash
aws configservice describe-configuration-recorder-status
```

2. Check compliance summary:

```bash
aws configservice get-compliance-summary-by-config-rule
```

3. Monitor the `ConfigurationItemsRecorded` CloudWatch metric to verify data flow.

![AWS Config cost breakdown in Cost Explorer by usage type](/img/cloudops/guides/config/configcost.png)

4. Query aggregated data with advanced queries:

```sql
SELECT resourceId, resourceType, configuration
WHERE resourceType = 'AWS::EC2::SecurityGroup'
```

## Troubleshoot

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| Recorder status shows `STOPPED` | Recorder was manually stopped or IAM role lacks permissions | Restart with `aws configservice start-configuration-recorder` and verify the service-linked role exists |
| Conformance pack shows `CREATE_FAILED` | Template syntax error or insufficient permissions in target accounts | Check CloudFormation events in the target account; ensure `AWSConfigRoleForOrganizations` has required permissions |
| High Config costs from excessive configuration items | `AWS::Config::ResourceCompliance` generating CIs for every rule evaluation | Exclude `ResourceCompliance` from recording or stop compliance recording before bulk rule deletion |
| Rules evaluating global resources in multiple regions | `IncludeGlobalResourceTypes` enabled in more than one region | Set `includeGlobalResourceTypes=true` in only one region (home region) |
| Advanced query returns empty results | Aggregator not configured or accounts not enrolled | Verify aggregator source status with `describe-configuration-aggregator-sources-status` |

## Related Solutions

- [CloudTrail Monitoring](../cloudtrail-monitoring/)
- [Control Tower Landing Zone](../control-tower-landing-zone/)
- [Cross-Account Observability](../cross-account-observability/)
