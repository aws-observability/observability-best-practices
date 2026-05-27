# CloudTrail Enrichment with CloudWatch Logs Transformation

## Introduction

[AWS CloudTrail](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html) provides comprehensive audit coverage of AWS API activity, creating a complete security and compliance foundation for organizations. When delivering these logs to [Amazon CloudWatch Logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html), [CloudWatch Logs Transformation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch-Logs-Transformation.html) enables organizations to enrich and optimize CloudTrail data without custom Lambda functions, external ETL pipelines, or post-processing scripts.

Using declarative JSON processor configurations, you can parse nested fields, add security context, classify resources, and optimize data for downstream delivery as CloudTrail events flow into CloudWatch Logs. This guide demonstrates practical transformation patterns for security monitoring, compliance reporting, and operational efficiency while maintaining the simplicity and reliability of AWS-native log management.

## Why This Matters

Organizations [delivering CloudTrail logs to CloudWatch Logs](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/send-cloudtrail-events-to-cloudwatch-logs.html) often need to enhance this data to align with specific operational workflows and tooling requirements:

- **Security teams** want to add custom risk indicators and classification tags to accelerate threat detection workflows
- **Compliance teams** need to pre-classify events by regulatory framework (PCI-DSS, HIPAA, SOC2) to streamline audit responses
- **Operations teams** managing multi-account environments want to add business context like environment labels, cost centers, or team ownership to CloudTrail's technical event data
- **All teams** forwarding data to downstream systems (SIEMs, OpenSearch, S3) want to optimize data structure—flattening nested fields for tool compatibility or focusing on security-relevant fields to reduce downstream ingestion costs

Without native transformation capabilities, teams resort to building custom Lambda functions, maintaining external ETL pipelines, or performing post-processing—adding complexity, latency, and operational overhead to their log management infrastructure.

## How CloudWatch Logs and Transformation Work

### CloudWatch Logs

[Amazon CloudWatch Logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html) serves as a audit log destination for CloudTrail. When CloudTrail delivers logs to CloudWatch Logs, each API event becomes a log event organized within [log groups and streams](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/Working-with-log-groups-and-streams.html), enabling organizations to:

- Query recent API activity using [CloudWatch Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html)
- Create security alerts with [metric filters and alarms](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/MonitoringLogData.html)
- Forward logs to downstream systems using [subscription filters](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/SubscriptionFilters.html)

### CloudWatch Logs Transformation

[CloudWatch Logs Transformation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch-Logs-Transformation.html) enables modification of log data during ingestion using declarative [processors](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch-Logs-Transformation-Processors.html). Transformations are defined as JSON configurations that specify operations like:

- [parseJSON](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch-Logs-Transformation-Processors.html#CloudWatch-Logs-Transformation-parseJSON): Parse JSON structures and extract nested fields
- [copyValue](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch-Logs-Transformation-Processors.html#CloudWatch-Logs-Transformation-copyValue): Copy values to new fields for enrichment
- [substituteString](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch-Logs-Transformation-Processors.html#CloudWatch-Logs-Transformation-substituteString): Perform pattern-based string replacements
- [deleteKeys](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch-Logs-Transformation-Processors.html#CloudWatch-Logs-Transformation-deleteKeys): Remove unnecessary fields

When applied to a log group, transformations execute automatically on every incoming log event before storage. Both the original and transformed versions are retained in CloudWatch Logs, with [subscription filters](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/SubscriptionFilters.html) forwarding the transformed data to downstream systems and CloudWatch Logs Insights queries displaying the transformed version for analysis. Note that the [GetLogEvents](https://docs.aws.amazon.com/AmazonCloudWatchLogs/latest/APIReference/API_GetLogEvents.html) and [FilterLogEvents](https://docs.aws.amazon.com/AmazonCloudWatchLogs/latest/APIReference/API_FilterLogEvents.html) APIs return the original log version, not the transformed version.

## The Solution

CloudWatch Logs Transformation addresses these challenges by providing native, real-time enrichment capabilities that eliminate custom infrastructure while delivering immediate operational value. The following sections provide samples on how organizations can leverage transformations across four key areas:

### Security Monitoring

Organizations can streamline threat detection by adding enriched fields to CloudTrail's comprehensive event data:

- **Instant threat detection**: Add `is_root_user` flags for immediate filtering (see [Use Case #4: Root User Activity Detection](#4-root-user-activity-detection))
- **Resource sensitivity tagging**: Automatically classify S3 buckets based on naming patterns (see [Use Case #1: S3 Data Classification](#1-s3-data-classification-for-sensitive-resource-identification))
- **Simplified alerting**: Create [CloudWatch alarms](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html) using [metric filters](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/MonitoringLogData.html) on enriched fields without complex JSON parsing
- **SIEM-ready data**: Flatten nested fields for seamless integration with security tools (see [Use Case #2: Flattening Nested Fields](#2-flattening-nested-fields-for-siem-integration))

### Optimized Data Delivery

CloudTrail data events provide comprehensive audit coverage, generating millions of logs daily. Organizations can optimize this data for specific downstream systems:

- **Streamlined downstream delivery**: Remove verbose fields before sending to S3, OpenSearch, or third-party SIEMs via subscription filters (see [Use Case #3: Optimized Downstream Delivery](#3-optimized-downstream-delivery-through-field-reduction))
- **Selective field retention**: Keep only security-critical data while discarding operational noise
- **Improved query performance**: Smaller, flattened log structures mean faster CloudWatch Logs Insights queries
- **Reduced downstream costs**: Send only relevant data to external systems, reducing their ingestion and storage costs

:::info
**Note**: Both original and transformed logs are stored in CloudWatch Logs. The primary benefit is optimizing data sent to downstream systems via subscription filters, not reducing [CloudWatch Logs storage costs](https://aws.amazon.com/cloudwatch/pricing/).
:::

### Operational Efficiency

Organizations with dozens or hundreds of AWS accounts can streamline correlation of CloudTrail events across environments:

- **Environment tagging**: Automatically label events as `production`, `staging`, or `development` based on account ID (see [Use Case #5: Multi-Account Environment Tagging](#5-multi-account-environment-tagging))
- **Standardized field names**: Flatten nested fields like `userIdentity.type` and `sourceIPAddress` for consistent querying across all accounts (see [Use Case #2: Flattening Nested Fields](#2-flattening-nested-fields-for-siem-integration))
- **Business context**: Add compliance framework tags at ingestion time (see [Use Case #6: Compliance Framework Tagging](#6-compliance-framework-tagging))
- **Simplified cross-account analysis**: Query all accounts using consistent field names in CloudWatch Logs Insights

### Compliance and Audit Readiness

Organizations can accelerate audit responses by pre-classifying CloudTrail events:

- **Compliance framework tagging**: Automatically tag PCI-DSS, HIPAA, or SOC2-relevant events (see [Use Case #6: Compliance Framework Tagging](#6-compliance-framework-tagging))
- **Root user monitoring**: Flag root user activity for compliance audits (see [Use Case #4: Root User Activity Detection](#4-root-user-activity-detection))
- **Retention optimization**: Separate critical audit data from operational logs for different retention policies
- **Faster audit responses**: Pre-classified logs enable instant filtering during compliance reviews

## Common Use Cases and Solutions

The following examples demonstrate practical transformation patterns for [CloudTrail logs](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-event-reference-record-contents.html). Each use case includes a specific challenge, the processor configuration to address it, and the resulting benefits. These patterns can be combined or adapted to meet your organization's specific security monitoring and operational requirements.

### 1. S3 Data Classification for Sensitive Resource Identification

**Challenge**: Security teams struggle to quickly identify which CloudTrail events involve sensitive or production S3 buckets without manually inspecting each ARN.

**Solution**: Automatically classify S3 resources based on bucket naming patterns.

```json
[
  {
    "parseJSON": {
      "source": "@message"
    }
  },
  {
    "copyValue": {
      "entries": [
        {
          "source": "resources.0.ARN",
          "target": "data_classification"
        }
      ]
    }
  },
  {
    "substituteString": {
      "entries": [
        {
          "source": "data_classification",
          "from": ".*-prod-.*",
          "to": "sensitive"
        },
        {
          "source": "data_classification",
          "from": "^arn:aws:s3:::.*",
          "to": "normal"
        }
      ]
    }
  }
]
```

**Benefit**: Security analysts can filter by `data_classification` field to instantly identify sensitive resource access.

**Query Example**:
```sql
fields @timestamp, eventName, userIdentity.arn, data_classification
| filter data_classification = "sensitive"
| sort @timestamp desc
```

### 2. Flattening Nested Fields for SIEM Integration

**Challenge**: SIEM tools require flat field structures. CloudTrail's detailed JSON structure can be flattened to align with SIEM requirements.

**Solution**: Extract and flatten commonly queried nested fields.

```json
[
  {
    "parseJSON": {
      "source": "@message"
    }
  },
  {
    "copyValue": {
      "entries": [
        {
          "source": "userIdentity.type",
          "target": "user_type",
          "overwriteIfExists": true
        },
        {
          "source": "sourceIPAddress",
          "target": "source_ip",
          "overwriteIfExists": true
        },
        {
          "source": "awsRegion",
          "target": "region",
          "overwriteIfExists": true
        }
      ]
    }
  }
]
```

**Benefit**: Standardized field names across all accounts simplify SIEM correlation rules and reduce configuration complexity.

**Query Example**:
```sql
fields @timestamp, eventName, user_type, source_ip, region
| filter region = "us-east-1"
| sort @timestamp desc
```

### 3. Optimized Downstream Delivery Through Field Reduction

**Challenge**: CloudTrail data events generate massive volumes. Organizations can focus on security-relevant fields when forwarding to downstream systems.

**Solution**: Remove fields before forwarding via subscription filters.

```json
[
  {
    "parseJSON": {
      "source": "@message"
    }
  },
  {
    "deleteKeys": {
      "withKeys": [
        "responseElements",
        "requestParameters"
      ]
    }
  }
]
```

**Benefit**: Reduces data volume sent to downstream systems (S3, OpenSearch, SIEMs), lowering their ingestion and storage costs while maintaining all security-relevant data.

:::info
**Important**: Both original and transformed logs are stored in CloudWatch Logs. Subscription filters forward the transformed version, enabling cost savings in downstream systems. Only delete fields not required for your security monitoring. The example above removes verbose fields (`responseElements` and `requestParameters`) but retains core audit data like `eventName`, `userIdentity`, `sourceIPAddress`, and `eventTime`. Note that `deleteKeys` will only delete fields that exist in the event - if a field doesn't exist, it will be silently skipped. Add additional fields like `additionalEventData`, `resources`, or `serviceEventDetails` to the list based on your specific requirements.
:::

**Query Example**:
```sql
fields @timestamp, eventName, userIdentity.type, sourceIPAddress
| filter eventName like /Put|Delete|Create/
| sort @timestamp desc
```

### 4. Root User Activity Detection

**Challenge**: Identifying root user activity requires parsing the `userIdentity.type` field. Organizations can simplify alert creation by adding explicit flags.

**Solution**: Add explicit boolean flag for root user detection.

```json
[
  {
    "parseJSON": {
      "source": "@message"
    }
  },
  {
    "copyValue": {
      "entries": [
        {
          "source": "userIdentity.type",
          "target": "is_root_user",
          "overwriteIfExists": true
        }
      ]
    }
  },
  {
    "substituteString": {
      "entries": [
        {
          "source": "is_root_user",
          "from": "Root",
          "to": "true"
        },
        {
          "source": "is_root_user",
          "from": "(IAMUser|AssumedRole|FederatedUser|AWSAccount|AWSService)",
          "to": "false"
        }
      ]
    }
  }
]
```

**Benefit**: Enables simple filtering for root user activity: `filter is_root_user = "true"`

**Query Example**:
```sql
fields @timestamp, eventName, userIdentity.arn, sourceIPAddress, is_root_user
| filter is_root_user = "true"
| sort @timestamp desc
```

### 5. Multi-Account Environment Tagging

**Challenge**: Organizations with multiple AWS accounts need to quickly identify which environment (prod/staging/dev) generated each CloudTrail event.

**Solution**: Map account IDs to environment labels.

```json
[
  {
    "parseJSON": {
      "source": "@message"
    }
  },
  {
    "copyValue": {
      "entries": [
        {
          "source": "recipientAccountId",
          "target": "environment",
          "overwriteIfExists": true
        }
      ]
    }
  },
  {
    "substituteString": {
      "entries": [
        {
          "source": "environment",
          "from": "111122223333",
          "to": "production"
        }
      ]
    }
  },
  {
    "substituteString": {
      "entries": [
        {
          "source": "environment",
          "from": "444455556666",
          "to": "staging"
        }
      ]
    }
  },
  {
    "substituteString": {
      "entries": [
        {
          "source": "environment",
          "from": "[0-9]{12}",
          "to": "development"
        }
      ]
    }
  }
]
```

**Benefit**: Enables environment-based filtering and alerting without maintaining account ID mappings in downstream systems.

**Query Example**:
```sql
fields @timestamp, eventName, userIdentity.arn, environment
| filter environment = "production"
| stats count() by eventName
| sort count desc
```

### 6. Compliance Framework Tagging

**Challenge**: Compliance teams need to quickly filter CloudTrail events relevant to specific regulatory frameworks (PCI-DSS, HIPAA, SOC2) during audits.

**Solution**: Automatically tag events based on compliance-relevant patterns.

:::info
**Note**: The following is an example of how to add tags related to compliance frameworks.  The eventName mapping shown in the below example doesn't correlate to any specific framework.
:::

```json
[
  {
    "parseJSON": {
      "source": "@message"
    }
  },
  {
    "copyValue": {
      "entries": [
        {
          "source": "eventName",
          "target": "compliance_framework",
          "overwriteIfExists": true
        }
      ]
    }
  },
  {
    "substituteString": {
      "entries": [
        {
          "source": "compliance_framework",
          "from": ".*(CreateKey|DeleteKey|DisableKey|ScheduleKeyDeletion|PutKeyPolicy).*",
          "to": "PCI-DSS,HIPAA"
        }
      ]
    }
  },
  {
    "substituteString": {
      "entries": [
        {
          "source": "compliance_framework",
          "from": ".*(CreateAccessKey|DeleteAccessKey|UpdateAccessKey|CreateUser|DeleteUser).*",
          "to": "SOC2,PCI-DSS"
        }
      ]
    }
  },
  {
    "substituteString": {
      "entries": [
        {
          "source": "compliance_framework",
          "from": ".*(PutBucketEncryption|DeleteBucketEncryption|PutBucketPolicy|DeleteBucketPolicy).*",
          "to": "HIPAA,PCI-DSS"
        }
      ]
    }
  }
]
```

**Benefit**: Enables instant filtering of compliance-relevant events during audits without maintaining separate event catalogs.

**Query Example**:
```sql
fields @timestamp, eventName, userIdentity.arn, compliance_framework
| filter compliance_framework like /PCI-DSS/
| sort @timestamp desc
```

## Best Practices

Successful CloudWatch Logs Transformation implementations require careful planning and ongoing maintenance. These best practices cover design principles, performance optimization, security considerations, and cost management to help you build reliable and efficient transformation pipelines.

### Design Principles

1. **Start Simple**: Begin with basic transformations and add complexity as needed
2. **Test Thoroughly**: Validate transformations with sample CloudTrail events before production deployment
3. **Document Patterns**: Maintain documentation of regex patterns and their intended matches
4. **Version Control**: Track transformation configurations in source control for change management

### Performance Optimization

1. **Minimize Processor Count**: Use fewer, well-designed processors rather than many small ones
2. **Minimize Regex Complexity**: Use simple patterns when possible to improve performance
3. **Limit Field Operations**: Only copy or transform fields necessary for downstream analysis
4. **Test at Scale**: Validate transformation performance with realistic log volumes

### Security Considerations

1. **Avoid PII Exposure**: Never add PII to custom fields without proper data handling controls
2. **Validate Patterns**: Ensure regex patterns don't inadvertently expose sensitive data
3. **Audit Transformations**: Regularly review transformation logic for security implications
4. **Preserve Audit Integrity**: Ensure transformations don't remove fields required for compliance or forensic analysis

### Cost Management

1. **Optimize Downstream Delivery**: Remove unnecessary fields before forwarding to external systems via subscription filters to reduce [downstream ingestion costs](https://aws.amazon.com/cloudwatch/pricing/)
2. **Balance Storage vs Query Performance**: Consider trade-offs between storing additional enriched fields and query complexity
3. **Monitor Transformation Metrics**: Track [CloudWatch Logs metrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch-Logs-Monitoring-CloudWatch-Metrics.html) for transformation errors and performance
4. **Review Regularly**: Periodically assess whether transformations still align with current requirements

## Querying Original vs Transformed Logs

When transformations are applied to a log group, both the original and transformed versions are stored in CloudWatch Logs. Understanding how to access each version is important for validation and troubleshooting.

### CloudWatch Logs Insights Behavior

- **Default**: CloudWatch Logs Insights queries display the **transformed** version of logs
- **Original Access**: The original log content is always available in the `@message` field
- **API Behavior**: The [GetLogEvents](https://docs.aws.amazon.com/AmazonCloudWatchLogs/latest/APIReference/API_GetLogEvents.html) and [FilterLogEvents](https://docs.aws.amazon.com/AmazonCloudWatchLogs/latest/APIReference/API_FilterLogEvents.html) APIs return the **original** log version

### Query Examples

**Query transformed logs (default behavior)**:
```sql
fields @timestamp, eventName, user_type, source_ip, region
| filter region = "us-east-1"
| sort @timestamp desc
```

**Query original logs using @message**:
```sql
fields @timestamp, @message
| parse @message /"eventName":"(?<original_eventName>[^"]+)"/
| filter original_eventName like /Create/
| sort @timestamp desc
```

**Compare original and transformed side-by-side**:
```sql
fields @timestamp, @message as original_log, eventName, user_type, region
| limit 10
```

This dual-storage approach ensures you can always access the original audit trail while benefiting from enriched, transformed data for day-to-day operations.

## Implementation Steps

1. **Identify Requirements**: Determine which [CloudTrail fields](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-event-reference-record-contents.html) need enrichment or modification
2. **Design Transformation Logic**: Map out the processor chain and expected outcomes
3. **Create Test Events**: Generate sample CloudTrail events for validation
4. **Configure Transformation**: [Apply the processor configuration](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch-Logs-Transformation.html#CloudWatch-Logs-Transformation-Permissions) to your log group
5. **Validate Results**: Query transformed logs using [CloudWatch Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html) to verify correct processing
6. **Monitor and Iterate**: Continuously improve transformations based on operational feedback

## Conclusion

CloudWatch Logs Transformation enables organizations to maximize the value of CloudTrail data delivered to CloudWatch Logs by enriching events at ingestion time with security context, flattening complex JSON structures, and optimizing downstream delivery—all through native AWS capabilities. Security and operations teams can transform their CloudTrail events into actionable intelligence without the operational overhead of custom processing infrastructure. This guide provides the patterns, best practices, and implementation strategies needed to unlock these capabilities, enabling simplified compliance reporting and reduced downstream costs while maintaining complete audit trails for your AWS environment.
