---
sidebar_position: 4
---
# Additional considerations when enabling Control Tower in an existing AWS Organization

## Control Tower Accounts

Control Tower must be enabled in your AWS Organization’s management account. It is not possible to have multiple landing zones in a single AWS Organization.

When you initially enable Control Tower it will not automatically enroll existing accounts in your organization, but it will create two OUs, the [shared accounts](https://docs.aws.amazon.com/controltower/latest/userguide/accounts.html#special-accounts) and [resources within them](https://docs.aws.amazon.com/controltower/latest/userguide/shared-account-resources.html). Your Organization must have sufficient quota available to allow this. 

If need to [use existing accounts](https://aws.amazon.com/blogs/mt/use-existing-logging-and-security-account-with-aws-control-tower/) for log archive or audit accounts when setting up Control Tower, you can do so, but you will need to [delete the config recorder](https://docs.aws.amazon.com/cli/latest/reference/configservice/delete-configuration-recorder.html) and [config delivery channel](https://docs.aws.amazon.com/cli/latest/reference/configservice/delete-delivery-channel.html).  It is generally simpler to allow Control Tower to create these accounts and to copy over historical logs as needed but in some cases, for example where you have existing log integrations with non-AWS services, it may be necessary to reuse existing accounts. 

## Identity Center

We strongly recommend using AWS Identity Center with Control Tower to provide authentication for your users. If you choose not to have Control Tower manage Identity Center and you do not already have Identity Center enabled, Control Tower will not enable it and you will need to implement an alternative identity solution for your Organization.

If you do not have an existing Identity Center configured and you opt-in to Identity Center management, Control Tower will enable the service and may or may not provision groups and permission sets, [depending on your choice of identity source](https://docs.aws.amazon.com/controltower/latest/userguide/getting-started-prereqs.html#sso-considerations). 

If you already have Identity Center configured, it must be in the same region as your Control Tower home region. If you opt in to Control Tower management and if you are using the local IAM Identity Center Directory, Control Tower will create users, groups and permission sets for you. If you are using any other directory [Control Tower will make no changes](https://docs.aws.amazon.com/controltower/latest/userguide/about-extending-governance.html#sso-and-existing-orgs).

If you have an existing identity solution in place that uses IAM users or IAM federation you should adopt Identity Center. Enabling Control Tower & Identity Center will not have an impact on your existing IAM users, roles and policies and will not affect existing IAM SAML configuration. This will allow you to run both systems in parallel during a transition period until you are ready to remove your old IAM Users / IAM federation. 



## CloudTrail

If you intend to enable Control Tower management of CloudTrail in an existing Organization, you will need to [disable trusted access](https://docs.aws.amazon.com/organizations/latest/userguide/services-that-can-integrate-cloudtrail.html#integrate-disable-ta-cloudtrail) for CloudTrail to pass the AWS Control Tower [pre-flight checks](https://docs.aws.amazon.com/controltower/latest/userguide/getting-started-prereqs.html).


If you opt out of Control Tower management of CloudTrail, you will be responsible for deploying trails, centralizing logging and implementing any security measures to protect your trails. Control Tower will [create an organization trail](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/creating-trail-organization.html) regardless, but when you opt-out its status will be set to off. We recommend allowing Control Tower to manage CloudTrail for you. 


If you have an **existing Organization with account-level trails** and you enable CloudTrail management in Control Tower, it will create a new Organizations management trail, configured to log into a bucket in the log archive account. It will not touch your existing trails, so if they are recording you can expect to see a significant increase in CloudTrail costs across your Organization as only the first copy of management events in each region for an account is free. Stopping the account level trails from recording will prevent the extra costs.

If you have an **existing Organization with an Organization trail** and you opt-in to Control Tower management, you will need to [disable trusted access](https://docs.aws.amazon.com/organizations/latest/userguide/services-that-can-integrate-cloudtrail.html#integrate-disable-ta-cloudtrail). When you do this, all the organization trails in your accounts will become non-functional anyway, so you should [stop logging](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-turning-off-logging.html) for your existing trail to avoid getting billed for recording when it becomes active again. Then disable trusted access and enable Control Tower. This will result in a short period during which you do not have CloudTrail data for your organization so it needs to planned during maintenance period. 


## Config

It is not possible to opt out of Control Tower management of Config.  

If you are enabling Control Tower in an existing Organization you will need to ensure [Trusted Access for Config is disabled](https://docs.aws.amazon.com/organizations/latest/userguide/services-that-can-integrate-config.html#integrate-disable-ta-config) to pass the Control Tower [pre-launch checks](https://docs.aws.amazon.com/controltower/latest/userguide/getting-started-prereqs.html). Control Tower will enable trusted access during the enablement process.

If you are planning to use existing accounts for log archive and audit accounts you will [need to delete all Config resources](https://docs.aws.amazon.com/controltower/latest/userguide/existing-config-resources.html) from those accounts first. 




## Backup

The Control Tower [AWS Backup integration](https://docs.aws.amazon.com/controltower/latest/userguide/backup.html) can help you set up a basic backup solution with a vault in each member account, a central vault in a shared account and some basic backup policies. This can be enabled at the OU level and individual resources can be tagged to target them for the relevant backup schedule. 

If you already have a backup solution you can opt out of the Backup integration. 

The Control Tower integration does not deploy a logically air-gapped vault and does not provide configuration for cross-region backup out of the box.


## Extending governance to existing OUs and accounts

Enabling Control Tower in an existing organization does not automatically extend governance over existing OUs and accounts in the Organization.  You will need to use Control Tower to [enroll existing accounts](https://docs.aws.amazon.com/controltower/latest/userguide/enroll-account.html) to bring them under Control Governance.
 
There are some [pre-requisites](https://docs.aws.amazon.com/controltower/latest/userguide/enrollment-prerequisites.html) for accounts to be enrolled:

* Your landing zone must not be in a state of drift 
* Account must be a member of the Organization
* The [AWSControlTowerExecution](https://docs.aws.amazon.com/controltower/latest/userguide/awscontroltowerexecution.html) role must be present and have AdministratorAccess permissions
* Organization must have [StackSets trusted access enabled](https://docs.aws.amazon.com/organizations/latest/userguide/services-that-can-integrate-cloudformation.html) so that the AWSControlTowerExecution role can [deploy Control Tower resources](https://docs.aws.amazon.com/controltower/latest/userguide/enroll-account.html#what-happens-during-account-enrollment) into the account you are enrolling. 
* Existing AWS Config resources should be [deleted](https://docs.aws.amazon.com/controltower/latest/userguide/enroll-account.html#example-config-cli-commands). If this isn’t an option there is a [process](https://docs.aws.amazon.com/controltower/latest/userguide/existing-config-resources.html) to work with customer support to enable use of existing Config resources. Not that this is not an option for existing log archive and audit accounts, which must have their Config resources deleted.

The most efficient way to bring existing AWS accounts into AWS Control Tower is to [register an entire OU](https://docs.aws.amazon.com/controltower/latest/userguide/importing-existing.html). When you register an OU, its member accounts are enrolled into the AWS Control Tower landing zone. The AWSControlTowerExecution role is added to accounts for you. The OU may contain up to 1000 accounts.  



## Existing Controls

If you are enrolling existing accounts into OUs with preventative controls in place (SCP, RCPs) ensure these [don’t prevent provisioning or enrolment actions](https://docs.aws.amazon.com/controltower/latest/userguide/quick-account-provisioning.html#common-causes-for-enrollment-failure). Alternatively, if you need these controls in place, enroll accounts into a dedicated Enrollment OU and then move them to their final destination.

AWS Organizations has some [service limits](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_reference_limits.html) you must take care not to exceed when extending governance to accounts and OUs with existing preventative controls:

* Max policy size for RCPs and SCPs: 5120 characters
* Max OU nesting of 5 levels
* Max 5 RCPs, 5 SCPs directly attached to an OU or account 


For detective controls, if you have existing Config rules defined in an account, these will remain even if you delete the Config recorder in order to enroll your account. When you enroll the account to Control Tower and it creates a new recorder the rules should resume evaluation. 

Compliance state of config rules defined outside of Control Tower will not be visible from the Control Tower dashboard.

If you are using custom Config rules and you want to get a comprehensive view of compliance from across your whole AWS Organization, consider implementing the [Config Resource Compliance Dashboard](https://catalog.workshops.aws/awscid/en-US/dashboards/additional/config-resource-compliance-dashboard) from the [Cloud Intelligence Dashboards](https://catalog.workshops.aws/awscid/en-US) framework.  

