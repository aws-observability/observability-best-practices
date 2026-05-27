---
sidebar_position: 5
---
# AWS Control Tower

### What problem does AWS Control Tower solve?

AWS Control Tower helps organizations with multiple AWS accounts and teams who need a straightforward way to set up and govern their [multi-account AWS environment](https://docs.aws.amazon.com/whitepapers/latest/organizing-your-aws-environment/organizing-your-aws-environment.html) at scale while ensuring compliance with established policies.


### Are there additional costs for using AWS Control Tower?

There are no additional charges or upfront commitments to use AWS Control Tower. You only pay for the AWS services that are enabled by AWS Control Tower and the services you use in your landing zone and implement selected controls. For example, you pay for: - Service Catalog for provisioning accounts with Account Factory and mandatory controls which are implemented by using AWS Config.  


### What are controls (guardrails) in AWS Control Tower?

[Controls](https://docs.aws.amazon.com/controltower/latest/controlreference/controls.html), previously referred to as guardrails, are clearly defined rules for security, operations, and compliance that help prevent deployment of non-conforming resources and continuously monitor deployed resources for compliance.


### What types of controls does AWS Control Tower offer?

AWS Control Tower offers three main types of controls: 

1. [Preventive controls](https://docs.aws.amazon.com/controltower/latest/controlreference/preventive-controls.html): These prevent actions from occurring. They are implemented using Service Control Policies (SCPs) in AWS Organizations. 
2. [Detective controls](https://docs.aws.amazon.com/controltower/latest/controlreference/detective-controls.html): These detect specific events or noncompliance of resources after they occur and provide alerts through the dashboard. They are implemented using AWS Config rules. 
3. [Proactive controls](https://docs.aws.amazon.com/controltower/latest/controlreference/proactive-controls.html): These check whether resources are compliant with your company policies and objectives before the resources are provisioned in your accounts. If the resources are out of compliance, they are not provisioned. Proactive controls are implemented with AWS CloudFormation hooks.

 By combining these three types of controls in AWS Control Tower, you can monitor whether your multi-account AWS environment is secure and managed in accordance with best practices.


### What AWS services does Control Tower orchestrate?

AWS Control Tower orchestrates [several AWS services](https://docs.aws.amazon.com/controltower/latest/userguide/integrated-services.html) to set up and govern a multi-account AWS environment. The primary services orchestrated by AWS Control Tower include: 
1. AWS Organizations - Used to set up a framework for consistent compliance and governance across your multi-account environment 
2. AWS Service Catalog - Used for the Account Factory functionality that automates account deployment and enrollment 
3. AWS IAM Identity Center (formerly AWS SSO) - Used for managing user identities and federated access Additionally, AWS Control Tower integrates with: 
4. AWS CloudTrail - Used as part of creating a centralized log archive 
5. AWS Config - Used for monitoring deployed resources and to help prevent drift from best practices.



### Can I use my existing identity provider with AWS Control Tower?

AWS Control Tower offers three options for identity provider integration: 
1. IAM Identity Center User Store: This is the default option where AWS Control Tower sets up and manages IAM Identity Center for you. It creates groups in the IAM Identity Center directory and provisions access to these groups for selected users in member accounts.
2. Active Directory: When AWS Control Tower is set up with Active Directory, AWS Control Tower does not manage the IAM Identity Center directory and does not assign users or groups to new AWS accounts. 
3. External Identity Provider (IdP): With this option, AWS Control Tower creates groups in the IAM Identity Center directory and provisions access to these groups for selected users in member accounts. You can specify existing users from your external IdPs such as Microsoft Entra ID, Google Workspace or Okta during account creation, and AWS Control Tower gives these users access to newly created accounts when it synchronizes users between IAM Identity Center and the external IdPs.
Please note that you have the option to [self-manage](https://docs.aws.amazon.com/controltower/latest/userguide/select-idp.html) AWS IAM Identity Center rather than allowing AWS Control Tower to set it up for you.


### Is my data encrypted and can I use my own AWS Key Management Service key?

AWS Control Tower provides two main encryption options for your landing zone: 1. Default encryption: By default, AWS Control Tower encrypts data at rest using Amazon S3-Managed Keys (SSE-S3) for resources in your landing zone. 2. AWS KMS encryption: As an optional enhanced level of security, you can configure AWS Control Tower to use an AWS Key Management Service (AWS KMS) key to secure services that AWS Control Tower deploys, including AWS CloudTrail, AWS Config, and the associated Amazon S3 data.  If you opt to enable AWS Backup when setting up the AWS Control Tower, you must choose one of your own existing multi-Region KMS keys, or create a new AWS KMS key.  This key is used to protect your cross-account backups with encryption.


### Can I use AWS Control Tower to limit access to certain regions available in AWS?


AWS Control Tower offers [Region deny](https://docs.aws.amazon.com/controltower/latest/userguide/region-how.html) capabilities to limit access to AWS services in specific regions for enrolled accounts. This helps address compliance requirements and manage costs by restricting access to specific Regions. The feature works with existing Region selection options in AWS Control Tower. For instance, German customers can restrict access to services outside Frankfurt. Two control levels are available: the landing zone level (original control) and the [OU level](https://docs.aws.amazon.com/controltower/latest/userguide/region-deny.html) (newer parameterized control) for more granular governance. This customization helps apply regional restrictions tailored to your business needs.



### How can I enroll existing AWS accounts that already have AWS Config resources 


To migrate an existing account with AWS Config resources into AWS Control Tower, you need to follow a specific [5-step process](https://docs.aws.amazon.com/controltower/latest/userguide/existing-config-resources.html): 

1. Contact AWS customer support to add the account to the AWS Control Tower allow list. Include "Enroll accounts that have existing AWS Config resources into AWS Control Tower" in your ticket subject line. In the body, provide your management account number, member account numbers with existing AWS Config resources, and your selected home Region for AWS Control Tower setup. This process typically takes 2 business days. 
2. Create a new IAM role in the member account using AWS CloudFormation. 
3. Identify AWS Regions with pre-existing AWS Config resources. 
4. Identify AWS Regions without any AWS Config resources. 
5. Modify the existing AWS Config resources in each Region to align with AWS Control Tower settings, then enroll the account with AWS Control Tower.




### What is drift and how to handle control tower drift and configuration

Drift in AWS Control Tower occurs when configuration changes are made outside of AWS Control Tower, causing resources to become non-compliant with governance requirements. Common types of drift include:
 1. Control policy drift - when policies owned by AWS Control Tower are unexpectedly updated.  For example, an SCP for a control is updated in the AWS Organizations console or programmatically using the AWS CLI.
2. Security Hub control drift.  This type of drift occurs when a control that's part of the AWS Security Hub Service-Managed Standard: AWS Control Tower reports a state of drift.
3. Deletion of required organizational units (like the Security OU) 
4. Deletion or inaccessibility of required IAM roles (AWSControlTowerAdmin, AWSControlTowerCloudTrailRole, AWSControlTowerStackSetRole) 
5. Moving member accounts from registered AWS Control Tower OUs to other OUs.

AWS Control Tower offers various [remediation options](https://docs.aws.amazon.com/controltower/latest/userguide/resolving-drift.html) depending on the type of drift detected. For a full list of remediation actions, please refer to the Control Tower user guide.


### What are the AWS Control Tower account customization options?


AWS Control Tower offers several options for customizing accounts: 
1. [Account Factory Customization](https://docs.aws.amazon.com/controltower/latest/userguide/af-customization-page.html) (AFC) - Allows you to customize new and existing AWS accounts directly from the AWS Control Tower console. You can define account requirements and implement them as part of a workflow using blueprints (customized account templates). These blueprints describe specific resources and configurations required when an account is provisioned. 
2. [Customizations for AWS Control Tower](https://docs.aws.amazon.com/controltower/latest/userguide/cfct-overview.html) (CfCT) - CfCT is a package of functionality that helps you customize your AWS Control Tower landing zone beyond what's available through the AWS Control Tower console. It allows you to implement customizations using AWS CloudFormation templates, service control policies (SCPs) and resource control policies (RCPs). that can be deployed to individual accounts and organizational units (OUs) within your organization. CfCT is integrated with AWS Control Tower lifecycle events, ensuring that your resource deployments remain synchronized with your landing zone. 
3. [AWS Control Tower Account Factory for Terraform](https://docs.aws.amazon.com/controltower/latest/userguide/taf-account-provisioning.html) (AFT) is a solution that allows you to provision and customize AWS accounts using Terraform. It creates a separate AFT management account (different from the AWS Control Tower management account) to deploy AFT capabilities. AFT provides flexibility by supporting any Terraform Distribution (Community Edition, Cloud, and Enterprise).


### Can I use GitHub as the configuration source for CfCT?


Yes, GitHub can be used as a configuration source for Customizations for AWS Control Tower (CfCT). When deploying CfCT, you have the option to select GitHub (via Code Connection) as the AWS CodePipeline Source instead of the default Amazon S3 option.


### Can I use GitHub as the AFT repository?


Yes, you can move AWS Control Tower Account Factory for Terraform (AFT) from AWS CodeCommit to another VCS provider. To migrate from CodeCommit to another VCS provider, follow these steps: 1. Set up new repositories in your chosen VCS provider 2. Add these repositories as new remotes in git 3. Execute git push to the new VCS provider 4. In your AWS Control Tower management account, update the Terraform module (bootstrap) to point to your new VCS provider 5. Perform terraform plan to preview changes, then terraform apply 6. Sign in to your AFT management account and complete the pending AWS CodeConnections for the new VCS provider Note that the repository structure should remain the same as in AWS CodeCommit to ensure AFT can execute the desired code properly.

### Can I use OpenTofu with AFT ? 

OpenTofu is a popular open source infrastructure as code (IaC) tool forked from Terraform.  OpenTofu has a module - sourcefuse/arc-control-tower-aft which might support the AFT functions with some tweaks, however, it is not supported by AWS.

### Can I use Gitlab as VCS for my CfCT ? 

No, Gitlab support for CfCT is not yet available.  You can use Github as the VCS starting from v2.8.1.

### I already have Landing Zone Accelerator (LZA)deployed, can I still use AWS Control Tower?


AWS Control Tower and Landing Zone Accelerator (LZA) work well together as complementary solutions. The recommended best practice is to deploy AWS Control Tower as your foundational landing zone first, and then enhance its capabilities with LZA as needed. LZA is a solution built using AWS Cloud Development Kit (CDK) that deploys foundational capabilities designed to align with AWS best practices and multiple global compliance frameworks. It helps you manage and govern your multi-account environment more effectively.  The LZA solution automatically sets up a cloud environment suitable for hosting secure workloads. It can be deployed in all AWS Regions to help maintain consistency of operations and governance. By integrating AWS Control Tower with LZA, you can customize your landing zone while ensuring it remains aligned with best practices and compliance requirements.



### Can I use API to interact with AWS Control Tower setup? 


AWS Control Tower offers [several APIs](https://docs.aws.amazon.com/controltower/latest/APIReference/Welcome.html) that allow you to automate various tasks: 1. Control APIs: - EnableControl: Activates a control, creating AWS resources on the specified organizational unit and its accounts - DisableControl: Turns off a control, deleting AWS resources on the specified organizational unit and its accounts - GetControlOperation: Retrieves information about control operations These APIs allow you to programmatically manage controls (also known as guardrails), view their application status, and get information about enabled controls including their supported Regions, identifiers (ARNs), drift status, and status summaries.  2. Landing Zone APIs: Help automate tasks related to your landing zone 3. Baseline APIs: Help automate certain tasks such as registering an organizational unit (OU).  You can refer to the API Reference documentation.


### How Can I change the email address for the account created by Control Tower?


To change the email address of an enrolled member account in AWS Control Tower, you need to follow these steps: 1. Recover the root user password for the account. 2. Sign in to the account with the root user password. 3. Change the email address as you would for any other AWS account, and wait for the change to reflect in AWS Organizations. There might be a delay while the email address change finishes updating. 4. Update the provisioned product in Service Catalog using the email address that previously belonged to the account. This process associates the new email address with the provisioned product, ensuring the email address change takes effect in AWS Control Tower.  However, it's important to note that this procedure doesn't allow you to change the email address of a management account, log archive account, or audit account. 



### Inter-networking connectivity considerations


AWS Control Tower by default assigns the same CIDR range (172.31.0.0/16) to every VPC for every account created within an organizational unit (OU). This default configuration does not initially permit peering among your AWS Control Tower VPCs due to the overlapping IP addresses. To support VPC peering in AWS Control Tower, you should modify the CIDR range in Account Factory settings to ensure IP addresses do not overlap between VPCs. When you change the CIDR range in Account Factory settings, all new accounts subsequently created will be assigned the new CIDR range, while existing accounts will retain their original CIDR ranges. This approach allows peering between VPCs with different IP address ranges.  


### We already have existing security and logging accounts, can I use the existing account as the audit and logging account for AWS Control Tower?


Yes, AWS Control Tower provides the option to specify existing AWS accounts as your audit (security) and log archive (logging) accounts during the initial landing zone setup process. This feature eliminates the need for AWS Control Tower to create new shared accounts. When setting up your landing zone, you can choose to either: 1. Have AWS Control Tower create new shared accounts for you, or 2. Bring your own existing accounts for audit and logging purposes If you choose to use existing accounts, you'll need to provide the unique email addresses associated with these accounts during the setup process. This option is only available during the initial landing zone setup.  Using existing accounts makes it easier to extend AWS Control Tower governance into your existing organizations or to move to AWS Control Tower from an alternate landing zone. 


### We already have an existing external IDP, what changes will AWS Control Tower do to the existing settings if I enable Control Tower?


When setting up AWS Control Tower with an existing identity provider, there are different impacts based on the identity source you choose: If IAM Identity Center is already enabled in your organization and you're using IAM Identity Center Directory, AWS Control Tower will add resources such as permission sets and groups without deleting your existing configuration. If you're using another directory (external, AD, Managed AD), AWS Control Tower will not change your existing configuration.  


### Does AWS Control Tower supports nested OU


Yes, AWS Control Tower supports nested organizational units (OUs). Nested OUs in AWS Control Tower allow you to organize accounts into multiple hierarchy levels and enforce controls hierarchically. A nested OU is an OU contained within another OU, creating a hierarchy where policies attached to one OU flow down and affect all OUs and accounts beneath it.  The nested OU hierarchy in AWS Control Tower can be a maximum of five levels deep. You can register existing multi-level OUs, create new nested OUs, and enable controls on any registered OU regardless of its depth in the hierarchy. With nested OUs, you can align your AWS Control Tower OUs to the AWS multi-account strategy and reduce the time required to enable controls on multiple OUs by enforcing controls at the parent OU level.


### Is AWS Control Tower supported in AWS GovCloud?


Yes AWS Control Tower is [supported in GovCloud](https://docs.aws.amazon.com/govcloud-us/latest/UserGuide/govcloud-controltower.html).  However, AWS Control Tower in AWS GovCloud (US) differs from commercial regions due to stricter compliance and operational requirements. In GovCloud, you must use existing Audit and Log Archive accounts during landing zone setup, as direct account creation is unavailable. GovCloud accounts are created via the CreateGovCloudAccount API in the commercial region and linked for billing/support, but they can only join GovCloud organizations. Some features, such as Account Factory account creation, GDPR compliance, certain Security Hub controls, and Resource Control Policies (RCP), are not supported.



### Does AWS Control Tower use resource control policies (RCPs)?

AWS Control Tower now supports preventive controls that are implemented with resource control policies (RCPs). These RCP-based controls help establish a data perimeter across your AWS Control Tower environment to protect resources from unintended access. RCPs allow you to enforce requirements such as ensuring that an organization's Amazon S3 resources are only accessible by IAM principals belonging to the organization or by an AWS service, regardless of permissions granted in individual bucket policies.  The RCP-based preventive controls are available in all AWS Regions where AWS Control Tower is available. You can also configure exemptions for these controls if you don't want specific principals or resources to be governed by them. Additionally, AWS Control Tower now reports control policy drift for controls implemented with RCPs and provides a ResetEnabledControl API to help manage control drift programmatically, allowing you to repair control drift and reset a control to its intended configuration.  AWS Control Tower also supports RCPs for Customizations for AWS Control Tower (CFCT), allowing you to incorporate these policies into your customization workflows.


### How to test policies on OUs before implementing

The Policy Staging OU acts as a controlled environment for testing and validating AWS policies, controls, and services before deploying them to production. It allows organizations to verify that new policies, guardrails, and configurations work as intended without impacting operational accounts. This approach helps prevent unintended consequences and ensures policy effectiveness. The staging OU typically contains test accounts that mirror the production environment's structure, enabling thorough validation of policy changes before applying them to production OUs or accounts. This practice aligns with AWS best practices for governance and helps maintain operational stability while implementing new controls.
