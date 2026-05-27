---
sidebar_position: 2
---
# Extending an AWS Landing Zone

As AWS expands its global footprint, organizations need a structured approach to extend their cloud presence into new regions. As AWS launches new regions, organizations are looking to expand their footprint. This guidance outlines key considerations and best practices for extending your AWS Organization or Landing Zone. 

## Building the Foundation

Setting up a robust cloud foundation with comprehensive governance controls isn't just a best practice—it's a critical necessity in today's dynamic cloud environment. Organizations that invest time in establishing strong governance frameworks from the start find themselves better positioned to scale, adapt, and maintain security as they grow. Think of it as building a house: without a solid foundation, any additions or modifications become increasingly risky and complex. Cloud governance controls, including Service Control Policies (SCPs), guardrails, and compliance frameworks, act as the architectural blueprints and building codes that ensure your cloud infrastructure remains secure, compliant, and manageable. When expanding into new regions, having these controls in place makes the extension process more streamlined and secure. Organizations often discover that retrofitting governance controls after the fact is significantly more challenging and resource-intensive than implementing them during the initial setup. This proactive approach to governance not only helps prevent security incidents and compliance violations but also provides the flexibility to adapt to changing business needs while maintaining operational excellence.

## Organization-First Approach vs. Control Tower: Key Differences 

When extending into a new region, customers have two primary paths depending on their existing setup. AWS Organizations provides a manual but highly flexible approach, allowing granular control over the implementation details. This path requires hands-on configuration of each service and custom implementation of Service Control Policies, but offers maximum flexibility for specific requirements. In contrast, AWS Control Tower offers a more streamlined, automated approach through Account Factory alongside pre-built governance controls and standardized guardrails. Control Tower significantly simplifies the multi-account setup process, though it may have less flexibility than a pure Organizations approach. The choice between these paths often depends on your existing infrastructure and specific governance requirements.

## Governance and Security Controls

One silver lining when extending into new AWS regions is that certain foundational services, like CloudTrail and AWS Billing, automatically incorporate new regions into their existing configurations. CloudTrail, when configured for all regions, will automatically begin logging API activity in new regions as they become available to your account, requiring no additional setup. Similarly, AWS Billing consolidates costs across all active regions automatically, providing unified cost management and reporting through the AWS Cost Explorer and AWS Bills. 

However, it's important to note that while these services adapt automatically, other security and operational services like Service Control Policies, GuardDuty, Security Hub, and AWS Config still require explicit regional enablement to ensure comprehensive coverage of your expanded footprint.

## Access Control

AWS Identity and Access Management (IAM) is one of those beautiful "set it and forget it" global services that just works across your entire AWS footprint. When you're expanding into a region, your existing IAM users, roles, and policies are already packed and ready to go - no additional configuration needed! It's like having your security team already stationed at the new location before you arrive. Your existing IAM principals will automatically have the same permissions as they do in other regions (assuming your policies don't include region-specific restrictions). This global nature of IAM is a huge time-saver and helps maintain consistent access controls across your growing AWS presence. Just remember - while IAM is global, some resource-based policies and service-linked roles might need regional consideration, so keep that in your expansion checklist.

## Service Control Policies

If you're using AWS Control Tower, there's good news - the built-in guardrails and their associated Service Control Policies (SCPs) will automatically extend their protection to any new region once it's enabled in Control Tower. It's like having an automatic security force that deploys itself! However, if you're using custom SCPs (whether in Control Tower or AWS Organizations), you'll need to roll up your sleeves and manually update those policies to include the new region. This is particularly important for policies that use region-specific controls or allowed-regions statements. For example, if you have an SCP that explicitly lists allowed regions, you'll need to add the new region to that list, for example:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AllowedRegions",
            "Effect": "Deny",
            "NotAction": [
                "cloudfront:*",
                "iam:*",
                "route53:*",
                "support:*"
            ],
            "Resource": "*",
            "Condition": {
                "StringNotLike": {
                    "aws:RequestedRegion": [
                        "ap-southeast-2",
                        "ap-southeast-4"  // Adding Asia Pacific (Melbourne) region
                    ]
                }
            }
        }
    ]
}
```

Without those changes your teams might find themselves wondering why they can't launch resources. Remember to test these policy updates in a non-production environment first - we always want to minimize customer impact.


## AWS Config

Like Service Control Policies, when you're using AWS Control Tower, AWS Config gets the VIP treatment - it's automatically enabled and configured in any new region once Control Tower supports it. Think of it as Config getting a first-class ticket to your new region! The rules, aggregators, and recorders just magically appear (well, not magic, but you get the idea). However, if you're running AWS Config through Organizations without Control Tower, you'll need to manually pave that road. This means rolling up your sleeves to enable Config in the new region, deploying your rules (don't forget those custom ones!), and setting up aggregators if you're using them. Many customers use CloudFormation StackSets to automate this process. Remember, whether automated or manual, maintaining consistent AWS Config coverage is crucial for your governance and compliance needs!

## Further Security Services

Let's dive into the world of AWS Security services and what you need to know when expanding into new regions. Unlike the globally-scoped IAM, most AWS Security services need a regional rollout strategy - think of it as opening new security offices in each location where you operate.

First, let's talk about the security dream team: GuardDuty, Security Hub, Macie, and Detective. Each of these services needs to be explicitly enabled in the new region. It's not a "lift and shift" situation - you'll need to deliberately enable each service. But here's where it gets interesting with Organizations - your delegated administrator account settings are actually global. Once you've designated an account as the delegated administrator for a security service, that account maintains its special powers across all regions. 

However, there's still work to be done. Even with a delegated administrator account, you'll need to enable each security service in the new region. For example, with Security Hub, your delegated admin account will need to enable the service in the new region and then configure the aggregation of findings from member accounts. The same goes for GuardDuty - while your delegated administrator designation carries over, you'll need to enable threat detection in the new region and configure member accounts accordingly.

Here's a pro tip: many builders use AWS CloudFormation StackSets or other tooling to automate this regional enablement process. We've seen that automation is key to maintaining consistent security controls across regions. Consider creating a "new region security bootstrap" template that enables and configures all your required security services - your future self will thank you!

And don't forget about regional aggregation! If you're using Security Hub or GuardDuty as central security monitoring tools, you'll want to configure cross-region aggregation to maintain that single-pane-of-glass view. The good news is that once you've set up your delegated administrator account and enabled the service in the new region, adding it to your aggregation configuration is usually just a few clicks away.


## Getting Visibility

Let's talk about some often-overlooked but super important services that need attention when expanding into new regions. While you're planning your regional expansion, don't forget about your operational visibility tools - they need some TLC too. Resource Explorer, our handy unified search service, requires you to add new regions to your aggregator settings if you want to maintain that sweet, consolidated view of all your AWS resources. Similarly, IAM Access Analyzer, your permissions guardian, needs to be enabled in the new region and added to your aggregation configuration to maintain comprehensive permissions insights. And let's not forget about CloudWatch Logs! If you're using cross-account, cross-region centralized logging, you'll need to update your log routing and replication settings to include the new region. Pro tip: many builders create a centralized logging account and use a CloudWatch Logs cross-region observability sink to maintain a single source of truth. We recommend documenting these aggregation configurations in your regional expansion runbook - future you will appreciate having all these steps in one place!

## Whats missing?

Before jumping into that shiny new region, let's talk about your AWS service inventory - it's more exciting than it sounds. Working backwards from a successful regional expansion, you'll want to create a comprehensive evaluation of your AWS service footprint. Think beyond the obvious services - sure, we've covered organizational services, security and compliance tools, monitoring and logging configurations, and you know about EC2 and S3. But what about those Route 53 health checks, AWS Backup plans, or those AWS Private Certificate Authorities you set up months ago? Create a service checklist that includes your core infrastructure and supporting services. Pro tip: Use AWS Resource Explorer or AWS Config to help discover all the services you're currently using - you might find some forgotten treasures! For each service, document whether it's global, regional, or needs specific regional configuration. This evaluation will become your expansion playbook, ensuring you maintain consistent capabilities across regions while avoiding any "oops, we forgot about that service" moments. Remember, a well-planned regional expansion is a successful regional expansion!

## On the topic of Landing Zones

Let's dive into the concept of AWS landing zones and the important role of the home region - this is crucial knowledge for anyone managing multi-region deployments!

Think of your AWS Landing Zone as your cloud headquarters, with the home region serving as your main office. When you first set up AWS Control Tower or implement a custom Landing Zone solution, you choose a home region - and this decision is more significant than many realize. It's like planting a flag that says, "This is where our core configurations live!"

In your home region, critical services like Control Tower and its management components set up shop. This includes the Account Factory configurations, audit log archives, deployment pipelines, and other foundational services. When you extend your Landing Zone to new regions, you're essentially opening branch offices while maintaining your headquarters in the original home region. The new region inherits governance controls and can be fully utilized, but the primary configurations and management components stay put in the home region.

Here's where it gets interesting - and by interesting, I mean challenging! Moving your Landing Zone's home region isn't like changing your default AWS Console region. It's more like trying to move your company's headquarters to a new city while keeping the business running smoothly. You'd need to decommission and redeploy core services, reconfigure logging aggregation, restructure organizational configurations, and potentially rebuild automation pipelines. Many of these services, like Control Tower's configuration data, audit logs, and AWS Organizations management, are tightly coupled with the home region.

Let’s paint a picture of what moving a home region would typically involve:

* Decomissioning Control Tower in the current home region
* Reconfiguring core account structures
* Decomissioning and redeploying IAM Identity Center configuration
* Rebuilding logging and audit architectures
* Redeploying automation and pipeline configurations
* Restructuring cross-account and cross-region service configurations
* Migrating historical data and archives

This is why choosing your home region is one of those "measure twice, cut once" decisions. We recommend selecting a home region that aligns with your long-term geographic strategy and compliance requirements. While extending to new regions is straightforward, moving your Landing Zone's home is a significant undertaking that requires careful planning and execution.

Pro tip: When designing your Landing Zone, document your home region dependencies thoroughly. Even if you never plan to move it, understanding these relationships will help you make better architectural decisions as you expand into new regions. Remember, your home region choice doesn't limit your ability to operate in other regions - it's just the control center for your AWS environment.

## Conclusion

In conclusion, extending your AWS Landing Zone or Organization into a region requires thoughtful planning and a comprehensive understanding of AWS services' regional behaviors. We've covered the critical aspects: from foundational governance controls and security services to operational visibility tools and Landing Zone considerations. Remember that while some services like IAM and CloudTrail automatically embrace new regions, others require explicit enablement and configuration. Your expansion journey should be guided by a well-documented service inventory and a clear understanding of your Landing Zone's home region implications. By following these best practices and considerations, you'll be well-equipped to maintain consistent security, compliance, and operational excellence across your expanding AWS footprint. The key to success lies in thorough preparation, understanding service-specific requirements, and maintaining a strong governance foundation. As AWS continues to grow its global infrastructure, these principles will serve as your compass for future regional expansions. 
