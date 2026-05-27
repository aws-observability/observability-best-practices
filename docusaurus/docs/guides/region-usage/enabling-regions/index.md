---
sidebar_position: 1
---
# How to Enable a new AWS Region

Before we jump into the technical steps, it's crucial to understand that AWS regions fall into two categories: Default Regions and Opt-in Regions. [Available AWS regions](https://docs.aws.amazon.com/global-infrastructure/latest/regions/aws-regions.html), like US East (N. Virginia), Europe (Ireland), or Asia Pacific (Sydney) (introduced before March 20, 2019), are enabled by default for all AWS accounts. However, others such as Asia Pacific (New Zealand) or Mexico (Central), like several other newer AWS regions (introduced after March 20, 2019), are [Opt-in Regions](https://docs.aws.amazon.com/global-infrastructure/latest/regions/aws-regions.html). This means you'll need to explicitly enable it for your AWS account(s) before you can start deploying resources. This opt-in requirement is part of AWS's strategy to help customers maintain better control over their geographic expansion and comply with specific data sovereignty requirements.

Let's now explore how to enable these Opt-in regions...

## Best Practice Considerations

While enabling the region is simple, take this opportunity to plan your regional strategy. Consider which workloads you'll deploy first and how you'll organize your resources across regions if you're using multiple AWS regions. Remember, this is just the first step in your AWS journey. Once the region is enabled, you can proceed with setting up your networking, security, and other foundational services.

To help you succeed, we recommend considering the following before enabling a new Region across your organization:

* Which organizational units (OUs) need access to the new region
* Impact on existing SCPs and permission boundaries
* Changes needed to your tagging strategy and cost allocation
* Modifications required for compliance and security policies

Before adding the region if you are using a Control Tower environment, review:

* Current control configurations that may need replication
* Existing lifecycle events that might be impacted
* Customized controls and automation that need to be extended
* Resource sharing configurations that should apply to the new region
* Network configurations that need to be replicated


## How to Enable a new Region in a single AWS Account

For organizations just beginning their AWS journey, enabling a new Region in a single AWS account is a straightforward process. Here's how to get started:

1. First, log into your AWS Management Console with a user account that has administrative privileges. Once logged in, look for your account name in the top right navigation bar and click on it to reveal a dropdown menu. Select "Account Settings" from this menu.
2. In the Account Settings page, scroll down until you find the "Regions" section. This is where AWS lists all opt-in regions available for your account. Look for the region you want to opt-in in the list of regions. Next to it, you'll find an enable button or toggle.
3. Click to enable the region and wait for the process to complete. This typically takes just a few minutes, but it's important to let the process finish before attempting to deploy resources in the new region.


## Enabling New AWS Regions using AWS Organizations

For organizations already operating in a multi-account AWS environment, expanding into a new region requires a thoughtful and systematic approach. Most established AWS customers have already built out sophisticated account structures, utilizing AWS Organizations for governance, billing consolidation, and service control policies (SCPs). Let's explore how these customers can efficiently enable new regions across their AWS estate.

The technical implementation starts with your Organizations Management Account (formerly known as the master account). As an experienced AWS customer, you'll be familiar with this critical account that serves as the root of your organizational structure.

Begin by enabling the region in your management account:

1. Sign in to your Organizations Management Account
2. Navigate to AWS Organizations service
3. Select the Management account from AWS accounts list
4. Access the Account Settings tab
5. Locate the required region in the Regions list
6. Enable the region and wait for completion

For each member account in the Organization, you'll need to systematically enable the region based on your organizational strategy. Consider using AWS CloudFormation StackSets or AWS CLI scripts to automate this process across multiple accounts, especially if you're managing dozens or hundreds of accounts.

## Adding New Regions to Your Control Tower Environment

For enterprises using AWS Control Tower to manage their multi-account environment, enabling new Regions requires consideration of your existing governance structure. Your organization has likely invested significant effort in establishing guardrails, compliance controls, and automated account provisioning processes. The Landing Zone update is particularly crucial as it ensures all Control Tower governance controls extend to the new region. This includes:

* Guardrails implementation
* Compliance monitoring
* Security controls
* Resource sharing configurations

Let's explore how to extend these controls to the new region, starting in your Organizations Management Account:

1. First enable the region at the Organizations level:
    1. Navigate to AWS Organizations
    2. Select your Management account
    3. Access Account Settings
    4. Enable the opt-in region
    5. Wait for completion
2. Then extend Control Tower to the new region:
    1. Access the Control Tower console
    2. Go to Landing Zone settings
    3. Select "Modify settings"
    4. Progress through to "Update Region Settings"
    5. Select the required region(s)
    6. Complete the update landing zone workflow


After Control Tower completes the update, you'll need to:

* Re-register existing OUs to apply the updated landing zone settings or
* Update existing accounts through Account Factory
* Verify guardrails are properly implemented in the new region
* Confirm CloudWatch alarms and AWS Config rules are functioning
* Review and update relevant customer managed SCPs (Service Control Policies)

Remember, successful region enablement in Control Tower requires patience - allow time for all automated processes to complete and verify each step before proceeding with workload deployment. Take time to evaluate the impact on existing governance structures and ensure all necessary controls are in place before deploying workloads.

## What Happens After Enabling Your New AWS Region

Successfully enabling the new Region is just the beginning of your regional expansion journey. As the region becomes visible in your AWS Management Console's region selector, it's time to think strategically about how to leverage this new infrastructure while maintaining your organization's governance and security standards. Some services, such as Cloudtrail logging or Cost and Usage reports, will pick up the new region automatically. 

Your immediate focus should be on extending your existing AWS infrastructure and governance frameworks to the new region. We cover this topic in our Extending Your AWS Landing Zone to a new Region guidance.

Remember that while the technical steps to enable a region might be straightforward, the real value comes from careful planning, systematic implementation, and thorough validation. Your existing investments in automation, governance, and security should extend seamlessly to your new region, creating a consistent, secure, and compliant environment across your entire AWS footprint. See our further guidance about extending your foundations and governance in this next section.
