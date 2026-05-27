---
sidebar_position: 3
---
# Customizing your landing zone


Control Tower defines a starting point for a well-governed landing zone, but most customers need to implement additional platform services for their workloads. This can include centralized networking, security services, centralized observability services and so on. 

## Use infrastructure as code

Additional platform services should be defined and deployed using infrastructure as code (IaC), which will:

* Ensure  identical configurations across all accounts and regions
* Enable version control & change management, supporting peer review and rollback as well as ensuring all changes are recorded and auditable
* support rapid, automated account provisioning where deployment can be triggered in response to Control Tower lifecycle events 

## Choose the right customization option 

Choosing the right customization approach at the beginning is crucial as it will significantly impact your operational model and flexibility going forward. The choice depends on factors such as your organization's infrastructure-as-code preferences, operational requirements, and desired level of customization flexibility.  We recommend implementing only one customization option for your landing zone.

There are four main options for customizing Control Tower with code: 

* AWS Organizations StackSets
* Account Factory Customization (AFC)
* Customization for AWS Control Tower (CfCT)
* Account Factory for Terraform (AFT) 
* Landing Zone Accelerator (LZA)

### CloudFormation StackSets

It is possible to define infrastructure resources in CloudFormation and deploy to specific accounts using the native [CloudFormation StackSets](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/what-is-cfnstacksets.html) feature.  A StackSet lets you create stacks across regions using a single template. CloudFormation can [automatically deploy additional stacks to new AWS Organizations accounts](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-orgs-manage-auto-deployment.html) when they're added to your target organization or organizational units (OUs), with [some caveats](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-orgs-manage-auto-deployment.html#stacksets-orgs-auto-deployment-considerations).

StackSets can be useful for deploying simple templates with minimal dependencies (and are used by Control Tower itself for deploying things like baseline IAM Roles) but the lack of CI/CD and lack of integration or awareness of Control Tower’s account provisioning process is a challenge for more complex customizations. 

If you’re looking for a managed service to deploy simple customizations in CloudFormation, consider AFC. If you’re looking for a CloudFormation based solution that supports CI/CD, consider CfCT.


### Account Factory Customization (AFC)

[AFC](https://docs.aws.amazon.com/controltower/latest/userguide/af-customization-page.html) is a native Control Tower feature and integrates directly with AWS Control Tower's account provisioning workflow. It allows you to define blueprints (in CloudFormation or Terraform, depending on which you are using for account provisioning) that are used to baseline an account with resources and configurations when it is provisioned. 

Blueprints can be updated and versioned in Service Catalog. The Control Tower account updated process can be used to apply the updated baseline. Although you can define multiple blueprints in AFC, it is not yet possible to baseline an account with more than single blueprint. This makes it challenging to use AFC for more complex customization.  

Use AFC if you require straightforward customization, a single baseline per account is sufficient and you don’t want to manage any resources for your customization process.


### Customizations for AWS Control Tower (CfCT)

[CfCT](https://docs.aws.amazon.com/controltower/latest/userguide/cfct-overview.html) is an AWS solution which implements an AWS Code Pipeline pipeline in the Control Tower management account, in the Control Tower home region. This is backed by a repository of CloudFormation templates in S3 or Github.  It supports deployment of CloudFormation templates, SCPs, and RCPs to target accounts and OUs in your Organization. CfCT does not support automation of account creation. Instead it is integrated with Control Tower’s lifecycle events so customization can be automatically triggered for new accounts created through Control Tower’s Account Factory. 

Use CfCT if you have in-house CloudFormation skills and are willing to maintain and [update](https://docs.aws.amazon.com/controltower/latest/userguide/update-stack.html) the solution in your management account.



### Account Factory for Terraform (AFT)

[AFT](https://docs.aws.amazon.com/controltower/latest/userguide/taf-account-provisioning.html) uses Terraform, and therefore direct AWS API calls, to manage the entire process of account creation and customization. It is an extremely flexible solution for customization but this comes at the expense of increased management overhead. Unlike CfCT, AFT can automate the entire process from account creation to account customization. It is also designed to manage the Terraform state files of the account customizations. 

Also note that Control Tower Proactive controls (implemented as CloudFormation Guard rules) will not apply as resources are not being deployed using CloudFormation.

Use AFT  if you have in-house Terraform skills and are experienced in setting up and maintaining Terraform state and processes, manage multiple repositories, and coordinate between different teams who might be creating and customizing accounts. 


### Landing Zone Accelerator (LZA)

[LZA](https://aws.amazon.com/solutions/implementations/landing-zone-accelerator-on-aws/) is an AWS solution for implementing a secure, multi-account environment based on AWS best practices and security frameworks. Although LZA doesn’t require AWS Control Tower, [it is recommended](https://docs.aws.amazon.com/controltower/latest/userguide/about-lza.html) that you use Control Tower as your foundational landing zone and implement LZA on top of it. LZA provides opinionated deployments of common landing zone functions, including security tooling and shared networking services, with limited customization available through configuration files.   This allows AWS customers with strict security and compliance requirements to configure their cloud foundations rapidly.

Use LZA if you are in a highly regulated field; need a secure and compliant landing zone deployed quickly; are comfortable with a more opinionated approach to infrastructure deployment; are willing to maintain the solution; and are prepared to understand and manage the underlying CDK code if any issues arise.  


| Feature | Account Factory Customization (AFC) | Customizations for AWS Control Tower (CfCT) | Account Factory for Terraform (AFT) | Landing Zone Accelerator (LZA) |
| ------- | ------------------------------------ | -------------------------------------------- | ------------------------------------ | ------------------------------- |
| Service Managed | Yes | No | No | No |
| IaC Engine | CloudFormation, Terraform | CloudFormation | Terraform | CDK |
| Deploys SCP | No | Yes | Yes | Yes |
| Supports Multiple Configuration Packages | No | Yes | Yes | Yes |
| Learning Curve | Low | Medium | High | Low |
| Operational Overhead | Low | Medium | High | Medium |
| API Support | No | Yes | Yes | Yes |
| Version Control Integration | No | Yes | Yes | Yes |
| Delegated Administration | No | No | Yes | Yes |
| Account Provisioning | Direct | Via lifecycle events only | Direct | Direct |
| Console Management | Yes | Limited | Limited | Limited |
| Deployment Complexity | Low | Medium | High | Medium |
| Customization Flexibility | Limited | High | Highest | High |
| Proactive Controls Apply | Yes | Yes | No | Yes |

