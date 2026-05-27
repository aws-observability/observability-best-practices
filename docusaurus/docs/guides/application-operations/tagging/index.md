---
sidebar_position: 4
---
# Tagging Services comparison

## Introduction

In today's complex cloud environments, effective resource management has become more challenge for organizations running workloads on AWS. This guide addresses the fundamental questions that many organizations face when managing their AWS resources: How do we ensure compliance with data protection regulations? How can we accurately track costs by department or project? What are the best methods for validating tags across multiple AWS accounts? And how do we establish and maintain organization-wide tagging standards?.

Resource tagging in AWS is a key for addressing these challenges, providing mechanism for organizing, tracking, and managing cloud resources at scale. Tags form the foundation for a solutions in cost allocation, security control, compliance management, and operational automation.

This guide explores different AWS Tagging services, framework for implementing, and managing AWS resource tags.

## AWS Resource Tags

AWS Resource Tags form the foundation of AWS's tagging infrastructure, providing a way to attach metadata to AWS resources. These tags consist of key-value pairs that can be used to organize, track, and manage resources across your AWS environment. Each resource can have up to 50 tags, with keys having a maximum length of 128 Unicode characters and values up to 256 characters. Resource tags are particularly valuable for cost allocation, access control, and automation purposes. For instance, you might tag resources with their environment (production, development, testing), cost center, or security requirements. However, it's important to note that not all AWS resources support tagging, and there are certain character restrictions in tag keys and values. These tags integrate seamlessly with other AWS services like IAM for access control and CloudWatch for monitoring.

```
{
    "Environment": "Production",
    "Application": "WebApp",
    "Owner": "team@company.com",
    "CostCenter": "CC123",
    "SecurityLevel": "High",
    "BackupSchedule": "Daily"
}
```

## Tag Editor

The AWS Tag Editor serves as a centralized management service for handling tags across multiple AWS services and regions. It simplifies the process of managing tags at scale by providing bulk editing capabilities and search functionality. Users can add, remove, or modify tags across multiple resources simultaneously. The Tag Editor also includes validation rules to ensure tag compliance and supports saved searches for frequently accessed resource groups. Tag Editor is useful during periodic tag audits and when implementing changes to tagging strategies across an organization. You can also use AWS Service Catalog TagOptions Library to easily manage tags on provisioned products. A TagOption is a key-value pair managed in Service Catalog. It is not an AWS tag, but serves as a template for creating an AWS tag based on the TagOption.

## Resource Groups

A resource group is a collection of AWS resources that are all in the same AWS Region, and that match the criteria specified in the group's query. In AWS, a resource is an entity that you can work with. Examples include an Amazon EC2 instance, an AWS CloudFormation stack, or an Amazon S3 bucket. If you work with multiple resources, you might find it useful to manage them as a group in a single page to view and manage, rather than move from one AWS service to another for each task. AWS Resource Groups provide a way to collectively manage resources that share common tags or are part of the same CloudFormation stack. These groups can be either tag-based, where resources are dynamically included based on their tags, or CloudFormation stack-based, which groups resources deployed as part of the same stack. Resource Groups integrate deeply with AWS Systems Manager, enabling automated operations across grouped resources. This feature is particularly valuable for managing applications that span multiple AWS services, as it allows administrators to perform actions like patch management, configuration updates, or maintenance tasks across all resources in a group simultaneously. The service supports custom group queries and provides a unified view of resource health and operational status.

## Tag Policies

Tag Policies, a feature of AWS Organizations, enable standardized tagging practices across multiple AWS accounts.  Allow you to standardize the tags attached to the AWS resources in an organization's accounts. These policies define rules for tag keys, allowed values, and enforcement levels, ensuring consistency in resource tagging across an organization. You can use tag policies to maintain consistent tags, including the preferred case treatment of tag keys and tag values. Administrators can create policies that either prevent non-compliant tags or simply report them, providing flexibility in policy enforcement. Tag Policies can be applied at various levels of the organization hierarchy, from the entire organization down to individual accounts, with inheritance rules determining how policies flow through the organizational structure. This hierarchical approach allows for both organization-wide standards and account-specific customization where needed. Using tag policies involves working with multiple AWS services AWS Organizations, AWS Resource Groups, and Tag Editor.

A tag policy is a plaintext file that is structured according to the rules of JSON.  The following example shows a tag policy that only defines two tag keys and the capitalization that you want accounts in your organization to standardize on. 

Policy A – organization root tag policy

```
{
    "tags": {
        "CostCenter": {
            "tag_key": {
                "@@assign": "CostCenter",
                "@@operators_allowed_for_child_policies": ["@@none"]
            }
        },
        "Project": {
            "tag_key": {
                "@@assign": "Project",
                "@@operators_allowed_for_child_policies": ["@@none"]
            }
        }
    }
}
```


## Cost Allocation Tags

Cost Allocation Tags are specifically designed for tracking and analyzing AWS spending. They come in two varieties: AWS-generated tags, which are automatically created by AWS services, and user-defined tags, which are created manually. Both types must be activated in the billing console before they appear in cost reports. These tags are the baseline for understanding cost distribution across different projects, departments, or environments. They integrate with AWS Cost Explorer, enabling detailed cost analysis and allocation. Monthly cost allocation reports can be generated based on these tags, making it easier to attribute costs to specific business units or projects.

These AWS tagging capability work together to create a resource management system. Through integration with other AWS services like IAM, Organizations, Systems Manager, and Config, they provide a robust foundation for resource organization, cost management, security controls, and operational automation. Understanding and effectively utilizing these services is important for maintaining an organized and efficient AWS environment, particularly as the scale and complexity of cloud deployments grow.

## Where to start

### Establishing a tagging strategy:

AWS tagging becomes complex when organizations experience growth and scale in their cloud infrastructure and resources. This happens when managing hundreds or thousands of resources across multiple AWS accounts and regions, along with resource provisioning and cross teams owners. The challenge start when having different departments/organizational unit within the organization use AWS, each with their own cost centers, budgets, and compliance requirements. Operational tasks like patching and automation needs, managing different environments (development, testing, production), backup schedules, and multiple CI/CD pipelines further complicate the tagging landscape.

What is AWS Tagging Strategy? Amazon Web Services (AWS) allows you to assign metadata to many of your AWS resources in the form of tags. Each tag is a simple label consisting of a key and an optional value to store information about the resource or data retained on that resource. Implementing a consistent tagging strategy can make it easier to filter and search for resources, monitor cost and usage, and manage your AWS environment. Labeling AWS resources with metadata using key-value pairs. For example, a tag could be "Environment: Production" or "Department: Finance". It's a structured way to categorize, track, and manage AWS resources across your organization's cloud infrastructure.

Phase of establishing a tagging strategy

### Planning Phase

The planning phase is the foundation of a successful tagging strategy. During this stage, organizations must clearly define their tagging objectives, which typically contains cost allocation, security requirements, and operational needs. Key stakeholders from various departments (Finance, Security, Operations, Development) should be identified and involved in the decision-making process. This phase involves making decisions about which tags will be mandatory across all resources and which will be optional. Organizations must establish clear naming conventions for tags, ensuring consistency and avoiding confusion later. 

### Design Phase

In the design phase, organizations create a structured framework for their tagging implementation. This involves categorizing tags into distinct groups such as technical tags (identifying environmental and application specifics), business tags (for cost allocation and project management), security tags (for compliance and data classification), and operational tags (for maintenance and backup procedures). Each category should have standardized key-value pairs that follow the established naming conventions. The design phase must also include comprehensive documentation of tag formats, acceptable values, and usage guidelines. This documentation serves as the single source of truth for all tagging-related decisions and implementations.

Naming Convention Rules:

* Use lowercase letters only
* Use hyphens (-) as separators
* No spaces or special characters
* Maximum key length: 128 characters
* Maximum value length: 256 characters

The following tagging examples for a retail customer:

Example on Resource Naming:

```
[environment]-[business-unit]-[application]-[resource-type]-[sequence]
```

Example:
```
prod-ecom-pos-ec2-01
dev-mktg-cms-rds-02
```
Example for tagging:
```
environment:
- Values: prod, dev, stage, test
- Example: environment = prod
business-unit:
- Values: ecommerce, store-ops, marketing, logistics
- Example: business-unit = ecommerce
cost-center:
- Format: CC-[NUMBER]
- Example: cost-center = CC-1234
application:
- Format: [APP_NAME]-[FUNCTION]
- Example: application = pos-payment
owner:
- Format: team-[DEPARTMENT]
- Example: owner = team-payments
```

Example on backup, and security tags
```
backup:
- Values: daily, weekly, monthly, none
- Example: backup = daily`

security-level:
- Values: high, medium, low
- Example: security-level = high
```

### Implementation Phase

During implementation, the organization brings its tagging strategy to life using AWS services. This phase involves creating and applying tag policies using AWS Organizations to ensure consistency across multiple accounts and organizations units. Teams implement tagging using AWS Tag Editor and Resource Groups, while also incorporating tags into Infrastructure as Code deployments through CloudFormation templates. The implementation should focus on automating as much of the tagging process as possible to reduce human error and ensure consistency. This phase also includes setting up initial compliance checks and validation procedures. 

### Monitoring & Reporting Phase

In the monitoring and reporting phase, organizations establish visibility into their tagging implementation. This involves setting up regular compliance reports using AWS Config, creating detailed cost allocation reports based on tags, and developing custom dashboards for various stakeholders. AWS Cost Explorer is utilized to analyze spending patterns across tagged resources, providing valuable insights for cost optimization. Regular monitoring helps identify trends, compliance issues, and areas for improvement in the tagging strategy. This phase provides the data needed to demonstrate the value of proper tagging to stakeholders.


## Policy Framework Development

The policy framework serves as guardrails for tag implementation across the organization. AWS Organizations Tag Policies form the core of this framework, defining standardized tags that must be consistently applied. These work in conjunction with Service Control Policies (SCPs) to prevent the creation of non-compliant resources.

The framework should comprehensively document all aspects of tag management, including required tags for different resource types, allowed values and formats, exception handling processes, and tag inheritance rules. It should also address tag modification procedures, authority for changes, and compliance monitoring and reporting methods.

Control implementation for tagging operates on three key levels:

1. Preventive controls: Implemented through Service Control Policies (SCPs) and Resource Creation Policies (RCPs), ensure that resources are properly tagged at creation
2. Detective controls: utilizing AWS Config Rules, monitor ongoing tag compliance and identify non-compliant resources. 
3. Proactive measures: leveraging CloudFormation hooks and AWS EventBridge, automate tag application and validation, reducing manual effort and human error.

## Operational implementation

Focuses on maintaining visibility and control through various AWS services. AWS Resource Explorer enables efficient tag-based resource searches, while AWS Config provides detailed compliance monitoring. AWS Organizations centralizes tag management across multiple accounts, and Resource Groups facilitate tag-based resource organization. The operational implementation should include regular monitoring, automated notifications for violations, and trending reports. You can use to improve incident management, support automation of infrastructure tasks, and facilitate resource operations management.

## Resiliency

From an operational perspective, tags enable automated responses to failures by identifying related resources that need to be failed over together. For example, tagging application components with "ApplicationID" and "TierLevel" allows automation scripts to identify and handle all related resources during a failover event.

In a cross-region recovery scenario for RDS and EC2 instances, several AWS services work together to ensure business continuity. For example, when using AWS Elastic Disaster Recovery and implementing disaster recovery strategies, a proper tagging practices play a role in maintaining an organized and efficient recovery environment. It's recommended to establish tagging strategy that includes both business and technical metadata tags for your source servers and replicated resources. Key tags should identify information such as application names, environments (prod, dev, test), business units, cost centers, and recovery priority levels. These tags should be consistently applied across both source and target environments to ensure proper resource tracking and management.

Additionally, tags support incident management by helping teams quickly identify resource owners, support levels, and recovery procedures during outages. For instance, tags like "OnCall" and "SLA" can direct alerts to the appropriate teams and trigger the right response procedures based on service level requirements. This systematic approach to resource organization through tagging significantly enhances an organization's ability to maintain service availability and recover from failures efficiently.

## Cost management

Defining and implementing cost allocation tags that enable accurate billing attribution across different business units, projects, and departments. This includes setting up automated cost reports, implementing project-based tracking, and creating department-specific billing views.

Through proper tag implementation, organizations can leverage Cost and Usage Reports (CUR) with tag dimensions, enabling detailed cost allocation and analysis. AWS Cost Explorer provides tag-based reporting capabilities, while budgets can be tracked and managed through tag specifications, giving finance teams the visibility they need for accurate cost attribution.

## Security and compliance

Benefits from proper tagging. Tag-based access control enhances security management, while compliance reporting becomes more streamlined through systematic tag usage. Tags facilitate security group management and help track resource lifecycles, ensuring both security and operational efficiency. Tag-based security and compliance management is a key component of cloud operations. Implementing tag-based resource access policies and role-based access control to maintain secure resource isolation. Tags can support data classification, regulatory compliance tracking, and enable attribute-based access control (ABAC).