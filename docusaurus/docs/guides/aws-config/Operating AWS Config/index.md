---
sidebar_position: 1
---
# Operating AWS Config

### **Enable AWS Config across all regions in all accounts**

For customers running multiple AWS accounts, we recommend implementing AWS Config across your entire organization. AWS Config is a region-specific service, you'll need to enable it in each region where you want to track resource configuration changes and compliance evaluations. You can do so in three ways:


1. Using CloudFormation StackSets: 
    [CloudFormation StackSets](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/what-is-cfnstacksets.html) provide pre-built templates for enabling AWS Config across multiple regions  and accounts simultaneously, deploy the configuration recorder across your organization, and maintain consistent settings across all accounts. To deploy AWS Config across your organization using CloudFormation, please [follow this blog](https://aws.amazon.com/blogs/mt/managing-aws-organizations-accounts-using-aws-config-and-aws-cloudformation-stacksets/).
2. Using AWS Systems Manager Quick Setup:
     [AWS Systems Manager Quick Setup](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-quick-setup.html) offers a streamlined way to enable Config recorder across your entire organization. To deploy AWS Config across your organization using Systems Manager Quick Setup, please [follow this blog](https://aws.amazon.com/blogs/mt/managing-configuration-compliance-across-your-organization-with-aws-systems-manager-quick-setup/).
3. AWS Control Tower:
    [AWS Control Tower](https://aws.amazon.com/controltower/) helps you set up and securely manage multiple AWS accounts from a central location. When enabled, Control Tower automatically activates AWS Config across all enrolled accounts. To get started with AWS Control, please refer to [AWS Control Tower Getting Started public documentation](https://docs.aws.amazon.com/controltower/latest/userguide/getting-started-with-control-tower.html).



### AWS Config recorder settings

When configuring AWS Config recorder settings, an important best practice is to enable tracking for [all resource types](https://docs.aws.amazon.com/config/latest/developerguide/select-resources.html). The additional benefit of enabling all resources is the automatic inclusion of new AWS services resource types as they become available for Config tracking, ensuring your configuration management stays current without manual intervention.
Regarding [global resources](https://docs.aws.amazon.com/config/latest/developerguide/select-resources.html#select-resources-global), such as [IAM](https://aws.amazon.com/iam/), it's important to enable recording in only one region (AWS Config should be enabled in the customer's home or main region). This configuration serves two purposes: it prevents duplicate configuration items and helps avoid unnecessary costs. If you enable global resource recording in multiple regions, you'll encounter redundant configuration tracking and incur additional expenses for monitoring the same global resources multiple times. For example, when tracking IAM users, roles, and policies, you should designate a primary region (such as us-east-1) for global resource recording and disable this feature in all other regions.


### Delivery Method Best Practices

When implementing AWS configuration management, establishing proper delivery methods for configuration items is crucial. A recommended best practice is to designate a centralized [Amazon S3 bucket](https://aws.amazon.com/pm/serv-s3/) within a central account, which could be either a logging account or another specifically designated account. This centralization allows for better organization and management of configuration item logs. To maintain clear organization within the bucket, it's advisable to implement a structured prefix system that clearly identifies the source account and region for each configuration item. Please also implement [security best practices for the S3 bucket](https://docs.aws.amazon.com/AmazonS3/latest/userguide/security-best-practices.htm) such as: enabling encryption in transit and at rest, disabling public access, and maintaining strict access controls. These security measures ensure compliance with data protection standards and minimize security risks. 

You can also configure AWS Config to automatically stream configuration changes and compliance status updates to a designated SNS topic. For enterprise environments with multiple AWS accounts, you establish a central SNS topic to consolidate these notifications. This centralized approach enables IT and Security teams to efficiently monitor and respond to configuration changes across the organization. To do so, [please follow this documentation](https://docs.aws.amazon.com/config/latest/developerguide/notifications-for-AWS-Config.html). 



### Delegated Admin for AWS Config

A delegated administrator for AWS Config is a designated member account within an AWS organization that receives permissions to manage configuration settings across the entire organization. This administrator can deploy and manage AWS Config rules, handle conformance packs, and aggregate configuration data from multiple accounts. They have visibility into resource configurations and compliance status across the organization, enabling centralized management and monitoring. To use delegated admin for [AWS Config operations and aggregation please follow this blog](https://aws.amazon.com/blogs/mt/using-delegated-admin-for-aws-config-operations-and-aggregation/).

Using a delegated administrator for AWS Config is a best practice because it protects the management account by limiting its use to only essential organizational tasks while delegating AWS Config specific administrative duties to designated member accounts. This approach follows the principle of least privilege, reduces security risks, and provides better operational control by centralizing Config management in designated accounts.