---
sidebar_position: 2
---
# Operating your landing zone

## Consider creating a test landing zone

Controls can (and should) be tested on non-production OUs before applying to production accounts, but there are also some instances where a second, test Organization can be helpful. If you need to test landing zone updates, modify landing zone management automations or account customization processes it can be useful to have an entirely separate Organization to avoid any inadvertent impact on production workloads.

## Keep your Landing Zone updated

Landing zone updates can include security improvements, cost optimizations and feature enhancements. When a new landing zone version becomes available you should [update](https://docs.aws.amazon.com/controltower/latest/userguide/update-controltower.html) it as soon as possible. You can do this from the AWS Console. This process will update the landing zone components including the shared (log archive, audit, backup) accounts. 

If you are updating from 2.x to 3.x note that this involves [additional caveats](https://docs.aws.amazon.com/controltower/latest/userguide/lz-update-best-practices.html) around the change from account level to Organization level CloudTrail trails. 

## Create accounts through Control Tower 

Create new accounts via Control Tower’s Account Factory to have them enrolled and managed upon creation. Although it is possible to create accounts through AWS Organizations when Control Tower is enabled, they will not be enrolled to Control Tower, even if they are under a Control Tower managed OU.  If you have accounts in your Organization that were not created through Control Tower you can enroll them to apply Control Tower controls and baselines.

### When using federated identities with a Control Tower managed Identity Center use a common SSO user during account creation

If Identity Center is managed by Control Tower, Account Factory requires an Identity Center user as a parameter. This user will be granted admin access to the created account but will not be usable while identity federation is enabled. This user won’t be usable when using federated identities but is still a required parameter. The user does not need to be unique so to avoid creating many unused local Identity Center users, you can use the same one for multiple accounts. If identity federation is subsequently disabled, access to the email address associated with the user would be required to enable a password and access your accounts.

## Keep your accounts updated

Once a landing zone update is complete, you will need to update your accounts. You can do this in the console for individual accounts or by re-registering entire OUs (as long as they have fewer than 1000 accounts). It is also possible to [automate the process](https://docs.aws.amazon.com/controltower/latest/userguide/update-accounts-by-script.html).

It is a best practice to keep non-prod workloads in a different OU to prod workloads allowing you to test impact of any updates by re-register the non-prod OUs first.


## Manage Drift

Drift occurs when your AWS Control Tower landing zone components, accounts, or organizational units (OUs) become out of sync with the defined baselines and controls. Understanding and managing drift is critical for maintaining governance and compliance in your AWS environment. 

### Make changes to accounts and OUs through Control Tower to avoid causing drift

If you make changes to accounts, OUs or Control Tower managed Organization policies (SCPs, RCPs) outside of Control Tower (which typically happens if you make changes directly in the AWS Organizations console) you can cause drift. 

### Regularly review your landing zone for drift

Control Tower detects drift automatically.  Regularly review your landing zone for drift and remediate as necessary. You can view OU and account drift status in the console by navigating to the Organization page, and then select the OUs or accounts that you wish to inspect.  Drift is also surfaced in the [SNS notifications](https://docs.aws.amazon.com/controltower/latest/userguide/sns-guidance.html) that are aggregated in the audit account. You can subscribe to the aws-controltower-AggregateSecurityNotifications topic to ensure you receive all drift notifications. As this topic also receives config non-compliance and other notifications it can be noisy, so you might want to subscribe a Lambda to process notifications of interest. 


### Resolve drift to ensure compliance

If your landing zone is drifted, you cannot accurately determine whether your resources are compliant with the controls you have enabled. Repair drift when you detect it to ensure your governance requirements are met. See the documentation for some examples of [repairable drift](https://docs.aws.amazon.com/controltower/latest/userguide/drift.html#repairable-changes-to-resources).

* If accounts or OUs are drifted you may be able to resolve this by updating the account or re-registering the OU in the console. 
* For controls, many types of drift can be resolved by calling the ResetEnabledControl API.
* Many types of drift can be resolved automatically with a reset of our Landing Zone. This can be done through the Landing zone settings by clicking the Reset button in the Versions section.


## Do not delete required Control Tower OUs or Accounts

As mentioned in the earlier section on expanding your landing zone, deleting or moving the Security OU or the Control Tower managed accounts or deleting all other OUs to leave only the Security OU will cause landing zone drift. In this state, Control Tower will not function until you have reset your landing zone.

## Do not delete required roles

If the [roles Control Tower requires](https://docs.aws.amazon.com/controltower/latest/userguide/roles-how.html) are missing or inaccessible, you'll see an error page instructing you to reset your landing zone. 

## Enable controls to enforce your governance requirements

Follow [best practices for applying controls](https://aws.amazon.com/blogs/mt/best-practices-for-applying-controls-with-aws-control-tower/)

Identify Control Tower controls to suit your requirements in the AWS Controls Catalog. Controls can be searched based on metadata including implementation, behaviour, owner, service and framework through:

* The Control Tower Console
* The [Control Tower Catalog documentation](https://docs.aws.amazon.com/controltower/latest/controlreference/controls-reference.html)
* [Amazon Q](https://docs.aws.amazon.com/controltower/latest/controlreference/q-search.html)


If necessary you can define custom controls using the underlying services, but these will not be included in Control Tower dashboards or compliance metrics:

* AWS Organization [SCPs](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html) and [RCPs](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_rcps.html) for Preventative Controls
* AWS [Config Rules](https://docs.aws.amazon.com/config/latest/developerguide/evaluate-config_develop-rules.html) for Detective Controls
* AWS [CloudFormation hooks](https://docs.aws.amazon.com/cloudformation-cli/latest/hooks-userguide/what-is-cloudformation-hooks.html) for Proactive Controls
* AWS [Security Hub CSPM Controls](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-controls-reference.html) 

If you are deploying custom policies (SCPs or RCPs), ensure that the [Control Tower service roles](https://docs.aws.amazon.com/controltower/latest/userguide/awscontroltowerexecution.html) are not denied as this may cause errors or Control Tower to be inoperable.


Always test controls before deploying to production accounts.

* Deploy to non-production OUs and / or to a test Organization first
* Consider deploying an equivalent detective controls to identify and resolve non-compliance before rolling out a new preventative control

## Understand control inheritance 

Controls are a fundamental element of AWS Control Tower and understanding how they work is necessary for successful landing zone operations.

* Mandatory controls cannot be disabled and specifically protect Control Tower resources. They will not apply to user workloads.
* Control Tower enrolled accounts inherit controls from the parent OU
    * Preventative, AWS Organizations policy based controls are inherited in nested OUs, others are not.
    * Preventative, AWS Organizations policy based controls apply to un-enrolled accounts in Control Tower registered OUs, others do not.

## Update Config controls to use Service Linked Rules

Since [June 2025](https://aws.amazon.com/about-aws/whats-new/2025/06/aws-control-tower-service-linked-aws-config-managed-rules/) Control Tower has supported service-linked AWS Config managed Config rules. Previously, rules were deployed via StackSets. Service-linked rules are deployed directly in to accounts by the service and cannot be edited or deleted by users except via Control Tower. This improves deployment speed and prevents unintentional drift. 


## Do not move accounts via AWS Organizations

Moving accounts between OUs directly through AWS Organizations, either in the console or through the API, will cause drift in Control Tower.

If you need to move accounts between OUs do so by [updating the account through the Control Tower console](https://docs.aws.amazon.com/controltower/latest/userguide/updating-account-factory-accounts.html#update-account-in-console) or by [updating the account’s provisioned product in Service Catalog](https://docs.aws.amazon.com/controltower/latest/userguide/updating-account-factory-accounts.html#update-provisioned-product). If you have moved an account in Organizations, [updating the account](https://docs.aws.amazon.com/controltower/latest/userguide/governance-drift.html#drift-account-moved) should resolve the drift. 


## Review compliance state 

Regularly review the compliance state of your accounts and OUs and take action to remediate non-compliance.

The Control Tower dashboard will show you the compliance state of your applied Control Tower controls. Currently it will not show the compliance state of config rules applied outside of Control Tower (including those owned by Security Hub).

Consider implementing the [Config Resource Compliance Dashboard](https://catalog.workshops.aws/awscid/en-US/dashboards/additional/config-resource-compliance-dashboard) from the Cloud Intelligence Dashboards project to get a comprehensive view of config compliance across your Organization.

Subscribe to [SNS topics in the audit account](https://docs.aws.amazon.com/controltower/latest/controlreference/receive-notifications.html) to receive notifications about compliance changes.

## Periodically review enabled controls

Regularly review the controls applied to your accounts and OUs to ensure they continue to meet your business requirements and that you are taking advantage of new controls. 


## Take action on non-compliance

You should define [Systems Manager Documents](https://docs.aws.amazon.com/systems-manager/latest/userguide/documents.html) and associate them with your enabled Config rules so that they can be used to [remediate non-compliance](https://docs.aws.amazon.com/config/latest/developerguide/remediation.html).  Remediation can be triggered [manually](https://docs.aws.amazon.com/config/latest/developerguide/setup-manualremediation.html) or configured to [run automatically](https://docs.aws.amazon.com/config/latest/developerguide/setup-autoremediation.html). 



## Monitor and optimize landing zone cost

### Ensure you have visibility into your landing zone costs.

* Use [AWS Cost Explorer](https://docs.aws.amazon.com/cost-management/latest/userguide/ce-what-is.html) in the management account for visibility into Organization-wide AWS spend
* Configure [AWS Cost Anomaly Detection](https://docs.aws.amazon.com/cost-management/latest/userguide/getting-started-ad.html) and subscribe to notifications.
* Consider implementing the Cloud Intelligence Dashboards to easily enable [Cost & Usage Report data exports](https://docs.aws.amazon.com/cur/latest/userguide/dataexports-create.html), Athena integration and detailed QuickSight cost Dashboards 

### Be aware of common causes of cost spikes

* When enabling Control Tower with CloudTrail integration, ensure you delete any pre-existing management trails to avoid CloudTrail charges
* Control Tower uses AWS Config to track resource state. This is important for maintaining compliance but can be costly to track for frequently changing ephemeral workloads. There is currently no built-in option in Control Tower to modify the Config recorder in member accounts but consider [this workaround](https://aws.amazon.com/blogs/mt/customize-aws-config-resource-tracking-in-aws-control-tower-environment/) to disable Config recorder for accounts with excessive Config costs and less stringent compliance requirements.



