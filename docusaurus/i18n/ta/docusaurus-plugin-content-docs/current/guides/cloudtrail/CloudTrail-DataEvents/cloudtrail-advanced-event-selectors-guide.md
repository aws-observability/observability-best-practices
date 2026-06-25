---
sidebar_position: 14
---
# Advanced Event Selectors

<!-- AWS CloudTrail இல் Advanced event selectors குறிப்பிட்ட தேர்வு அளவுகோல்களை வரையறுப்பதன் மூலம் எந்த data events பதிவு செய்யப்படுகின்றன என்பதில் நுணுக்கமான கட்டுப்பாட்டை வழங்குகின்றன. -->

### Understanding Advanced Event Selectors

Advanced event selectors in AWS CloudTrail provide granular control over which data events are recorded by defining specific selection criteria using field-based conditions with operators like equals, not equals, starts with, and ends with. This granular approach enables organizations to capture only the data events that matter for their security, compliance, and operational requirements while reducing costs associated with excessive event logging.

Advanced event selectors consist of field selectors, operators, and values. Each selector contains an array of field selectors that define the selection criteria, with each field selector specifying a field name (such as eventCategory, eventName, or resources.type), an operator (Equals, NotEquals, StartsWith, EndsWith), and one or more values to match against. The relationship between multiple field selectors within a single advanced event selector is logical AND, meaning all conditions must be met for an event to be recorded.

![CloudTrail Advanced Event Selectors](/img/cloudops/guides/cloudtrail-lake/cloudtrail-data-events-advanced-selector.png "Advanced Event Selectors for Data Events")

### Supported Fields and Operators

CloudTrail advanced event selectors support a comprehensive set of fields that cover all aspects of AWS API calls for data events. The primary fields include eventName for specific API operations, resources.type for AWS resource types, resources.ARN for specific resource identifiers, and readOnly for distinguishing between read and write operations. Each field supports specific operators: Equals and NotEquals work with exact matches, while StartsWith and EndsWith enable pattern-based selection. Understanding these combinations is crucial for creating effective selection strategies.

The following will provide examples on how advanced event selectors can be used to select specific data events related to your AWS resources.

### Amazon S3

#### Critical Write Operations Selector

This selector focuses on high-risk S3 operations that could indicate data exfiltration, unauthorized modifications, or compliance violations. By recording only write operations on sensitive buckets, organizations can detect malicious activity while reducing the log volume of S3 events. This approach is essential for maintaining security visibility without overwhelming security teams with routine read operations.

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

### AWS Lambda Function Monitoring

#### Production Function Invocation Selector

Lambda invocation monitoring is crucial for detecting unauthorized function execution and unusual access patterns. This selector targets lambda functions that start with the naming patterns for production and critical functions while excluding development naming pattern environments, reducing noise and focusing on business-critical activities. The pattern-based ARN selection automatically covers new functions that follow naming conventions, providing scalable security monitoring.

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
        "Equals": ["AWS::Lambda::Function"]
      },
      {
        "Field": "eventName",
        "Equals": ["Invoke"]
      },
      {
        "Field": "resources.ARN",
        "StartsWith": ["arn:aws:lambda:us-east-1:123456789012:function:prod-", "arn:aws:lambda:us-east-1:123456789012:function:critical-"]
      }
    ]
  }
]
```

### DynamoDB Table Operations

#### Write Operations and Sensitive Table Selector

DynamoDB generates high volumes of events, making selective event selection essential for cost control and security focus. These selectors capture data modification events that could indicate unauthorized access or data tampering while excluding routine read operations. The combination approach in the following example allows the recording of specific write operations for specific tables and all operations on sensitive tables that are defined, providing comprehensive coverage without excessive costs.

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
        "Equals": ["AWS::DynamoDB::Table"]
      },
      {
        "Field": "eventName",
        "Equals": ["PutItem", "UpdateItem", "DeleteItem", "BatchWriteItem"]
      },
      {
        "Field": "resources.ARN",
        "Equals": ["arn:aws:dynamodb:us-east-1:123456789012:table/UserData"]
      }
    ]
  },
  {
    "FieldSelectors": [
      {
        "Field": "eventCategory",
        "Equals": ["Data"]
      },
      {
        "Field": "resources.type",
        "Equals": ["AWS::DynamoDB::Table"]
      },
      {
        "Field": "resources.ARN",
        "StartsWith": ["arn:aws:dynamodb:us-east-1:123456789012:table/Financial"]
      }
    ]
  }
]
```

### Amazon SQS Queue Monitoring

#### Administrative Operations Selector

SQS administrative operations can represent certain security risk as they can disrupt message flow and modify queue permissions. This selector example focuses on queue management activities that could indicate privilege escalation or service disruption attempts. By excluding high-volume message operations, this approach reduces logging costs while maintaining visibility into security-relevant administrative changes.

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
        "Equals": ["AWS::SQS::Queue"]
      },
      {
        "Field": "eventName",
        "Equals": ["CreateQueue", "DeleteQueue", "SetQueueAttributes", "AddPermission", "RemovePermission"]
      }
    ]
  }
]
```

### Amazon SNS Topic Operations

#### Topic Management and Critical Topic Selector

SNS monitoring requires balancing administrative oversight with message flow visibility for critical topics. These selectors capture topic management operations that could affect notification delivery and monitor all activities on security-sensitive topics. The multi-selector approach allows comprehensive monitoring of critical communication channels while reducing overall log volume through selective topic selection.

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
        "Equals": ["AWS::SNS::Topic"]
      },
      {
        "Field": "eventName",
        "Equals": ["CreateTopic", "DeleteTopic", "Subscribe", "Unsubscribe", "SetTopicAttributes"]
      }
    ]
  },
  {
    "FieldSelectors": [
      {
        "Field": "eventCategory",
        "Equals": ["Data"]
      },
      {
        "Field": "resources.type",
        "Equals": ["AWS::SNS::Topic"]
      },
      {
        "Field": "resources.ARN",
        "Equals": ["arn:aws:sns:us-east-1:123456789012:security-alerts"]
      }
    ]
  },
  {
    "FieldSelectors": [
      {
        "Field": "eventCategory",
        "Equals": ["Data"]
      },
      {
        "Field": "resources.type",
        "Equals": ["AWS::SNS::Topic"]
      },
      {
        "Field": "resources.ARN",
        "StartsWith": ["arn:aws:sns:us-east-1:123456789012:compliance-"]
      }
    ]
  }
]
```

### User Identity-Based Selectors

#### Privileged User Monitoring Selector

User identity selection allows you to include or exclude events for actions taken by specific IAM identities. The following example demonstrates two approaches: excluding specific service roles from S3 object logging to reduce noise from automated processes, and recording only privileged roles for DynamoDB table operations to focus on high-risk activities.

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
        "Field": "userIdentity.arn",
        "NotStartsWith": ["arn:aws:sts::123456789012:assumed-role/service-role/backup-automation-role", "arn:aws:sts::123456789012:assumed-role/service-role/monitoring-role"]
      }
    ]
  },
  {
    "FieldSelectors": [
      {
        "Field": "eventCategory",
        "Equals": ["Data"]
      },
      {
        "Field": "resources.type",
        "Equals": ["AWS::DynamoDB::Table"]
      },
      {
        "Field": "userIdentity.arn",
        "StartsWith": ["arn:aws:sts::123456789012:assumed-role/AdminRole/", "arn:aws:sts::123456789012:assumed-role/SecurityRole/"]
      }
    ]
  }
]
```

### Organization Trail and Event Data Store (EDS) Selectors

#### Account-Level Exclusion Selector

For organization trails or Event Data Store (EDS) configurations, you can exclude entire accounts from S3 data event logging to reduce costs and focus on critical accounts. This selector excludes all S3 data events from a specific account by using the userIdentity.arn field to match any identity from that account. This approach is particularly useful for excluding development or testing accounts from comprehensive logging while maintaining coverage for production accounts.


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
        "Field": "userIdentity.arn",
        "NotStartsWith": ["arn:aws:sts::111122223333:", "arn:aws:iam::111122223333:"]
      }
    ]
  }
]
```

:::info
Please be aware that userIdentity ARN types may extend beyond the STS and IAM examples shown above. It is recommended to verify all userIdentity ARN types currently used within your organization.
:::

#### Multiple S3 Bucket Exclusion Selector

When managing organization-wide logging, you may need to exclude multiple S3 buckets that generate high-volume, low-value events such as backup buckets, temporary storage, or automated processing buckets. This selector demonstrates how to exclude multiple specific buckets while maintaining logging for all other S3 resources. The approach uses multiple NotStartsWith conditions to exclude different bucket ARN patterns efficiently.

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
        "Field": "resources.ARN",
        "NotStartsWith": [
          "arn:aws:s3:::backup-bucket-",
          "arn:aws:s3:::temp-processing-",
          "arn:aws:s3:::automated-logs-",
          "arn:aws:s3:::dev-sandbox-"
        ]
      }
    ]
  }
]
```

### Additional Supported Field Examples

#### Write Operations Selector

The readOnly field selector is crucial for focusing on events that represent actual changes to your environment. By selecting write operations only, organizations can reduce log volume while maintaining visibility into all actions that could impact security or compliance. This selector is particularly effective when combined with specific resource types or event sources.

#### Service-Specific Event Source Selector

Event source selection allows targeted monitoring of specific AWS services without the complexity of resource-type selection. This approach is ideal for compliance scenarios where certain services require comprehensive logging regardless of the specific resources involved. The selector significantly reduces cross-service noise while ensuring complete coverage of designated services.

#### Specific API Operation Monitoring

Event name selection provides the most granular control over CloudTrail logging, allowing organizations to monitor specific API operations across all services. This approach is valuable for detecting specific attack patterns, monitoring critical operations, or meeting precise compliance requirements. The selector dramatically reduces log volume while providing surgical visibility into high-risk operations.

#### Resource Type Combination Selection

Combining resource type selection with operation type selection creates powerful, targeted monitoring capabilities. The following example demonstrates three different approaches: recording write operations on S3 objects, capturing specific DynamoDB write operations, and logging write operations on S3 buckets. This combination allows organizations to record specific types of resources for specific types of operations, providing precise security coverage while minimizing unnecessary logging.

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
        "Field": "readOnly",
        "Equals": ["false"]
      }
    ]
  },
  {
    "FieldSelectors": [
      {
        "Field": "eventCategory",
        "Equals": ["Data"]
      },
      {
        "Field": "resources.type",
        "Equals": ["AWS::DynamoDB::Table"]
      },
      {
        "Field": "eventName",
        "Equals": ["PutItem", "UpdateItem", "DeleteItem"]
      }
    ]
  },
  {
    "FieldSelectors": [
      {
        "Field": "eventCategory",
        "Equals": ["Data"]
      },
      {
        "Field": "resources.type",
        "Equals": ["AWS::S3::Bucket"]
      },
      {
        "Field": "readOnly",
        "Equals": ["false"]
      }
    ]
  }
]
```

## Cost Optimization Strategies

### Event Volume Analysis and Reduction

Effective cost optimization begins with understanding your current event volume and identifying opportunities for reduction without compromising security or compliance requirements. Analyze your CloudTrail logs to identify high-volume events and determine which events can be safely excluded. This analysis can help you determine your advanced event selector strategy.

### Strategic Selection Approaches

Implement a layered selection approach that prioritizes security and compliance events while progressively excluding routine operational activities. Start with broad inclusion criteria for security-relevant events, then add specific exclusions for known routine operations. For example, include all write operations but exclude specific automated processes that generate predictable, low-risk events. Use the StartsWith and EndsWith operators to create pattern-based selectors that can efficiently exclude entire categories of routine events while maintaining coverage of unexpected or potentially malicious activities.

### Resource-Based Cost Management

Organize your selection strategy around resource criticality and sensitivity levels. Implement comprehensive logging for production resources, sensitive data stores, and security-critical services while applying more aggressive selection criteria to development and testing environments. Use resource ARN patterns to automatically apply appropriate logging levels based on naming conventions. This approach ensures that cost optimization efforts don't compromise security monitoring for your most important assets while reducing unnecessary logging overhead for less critical resources.

## Security and Compliance Considerations

### Maintaining Security Visibility

While optimizing costs through advanced event selectors, maintaining comprehensive security visibility remains paramount. Ensure that your selection strategy captures all events that could indicate security incidents. Regular review and testing of your event selectors ensures that security monitoring capabilities remain effective as your environment evolves.

### Compliance Requirements Integration

Different compliance frameworks have specific requirements for audit logging that must be considered when designing advanced event selectors. Map your compliance requirements to specific CloudTrail events and ensure that your advanced event selectors capture all necessary activities. Document your selection decisions and maintain evidence that your logging strategy meets regulatory requirements.

### Incident Response Preparedness

Design your advanced event selectors with incident response requirements in mind, ensuring that you capture sufficient detail to support forensic analysis and threat hunting activities. Include events that provide context around security incidents, such as authentication events, network access patterns, and resource configuration changes. Consider the timeline requirements for incident response and ensure that your logging strategy provides adequate historical data for investigation purposes. Test your event selectors against known incident scenarios to validate that they capture the necessary information for effective response.

## Implementation Best Practices

### Phased Deployment Strategy

Implement advanced event selectors using a phased approach that allows for testing and refinement before full deployment. Start with a pilot implementation in a non-production environment to validate your selection logic and measure the impact on event volume and costs. Gradually expand the implementation while monitoring the effectiveness of your selection strategy. This approach allows you to identify and address issues before they impact your production logging capabilities and provides opportunities to refine your selectors based on real-world usage patterns.

### Monitoring and Validation

Establish comprehensive monitoring for your CloudTrail advanced event selectors to ensure they continue to meet your security and compliance requirements over time. Implement automated validation checks that verify your event selectors are capturing expected events and not inadvertently excluding critical activities. Regular review of your selection effectiveness helps maintain the balance between cost optimization and security visibility.

## Advanced Selection Techniques

### Pattern-Based Resource Selection

Leverage the StartsWith and EndsWith operators to create sophisticated pattern-based selectors that can efficiently manage large numbers of resources. For example, use naming conventions in your resource ARNs to automatically apply appropriate logging levels based on environment, sensitivity, or business unit. Pattern-based selection is particularly effective for organizations with consistent naming standards and can significantly reduce the complexity of managing event selectors across large AWS environments. This approach also provides automatic coverage for new resources that follow established naming patterns.

### Multi-Condition Logic Implementation

Advanced event selectors support complex logical conditions that can be used to create sophisticated selection rules. Combine multiple field selectors within a single advanced event selector to create AND conditions, or use multiple advanced event selectors to create OR conditions. For example, you might create a selector that captures all write operations on sensitive resources OR any operations performed by privileged users. Understanding how to effectively combine conditions allows you to create precise selection rules that capture exactly the events you need while excluding everything else.
