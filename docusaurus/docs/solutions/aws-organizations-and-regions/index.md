---
title: AWS Organizations and Regions
sidebar_label: AWS Organizations and Regions
---

# AWS Organizations and Regions

## Overview

Managing a multi-account AWS environment requires deliberate planning around organisational structure, account lifecycle, regional expansion, and resource tagging. This guide consolidates operational guidance for account migration readiness assessments, enabling new AWS Regions (including opt-in Regions), extending a landing zone into additional Regions, and implementing a tagging strategy for application-centric operations.

These topics are foundational to cloud operations at scale—getting them wrong creates governance gaps, compliance drift, and operational blind spots that compound over time.

## When to use this

- You are transferring AWS accounts between organisations (M&A, consolidation, restructuring) and need a dependency assessment checklist
- You are expanding into a new AWS Region and need to understand what services require explicit enablement versus automatic coverage
- You operate AWS Control Tower and need to extend guardrails and governance controls to a newly enabled Region
- You are establishing or refining a tagging strategy for cost allocation, security, compliance, and operational automation
- You need to understand the implications of choosing a landing zone home Region

## Guidance

### Account migration readiness

When transferring an account between AWS Organizations, multiple service dependencies are affected immediately on transfer. Key impacts include:

| Category | Service/Feature | Impact |
|----------|----------------|--------|
| Access control | IAM Identity Center | Permission set assignments removed |
| Authorization | SCPs / RCPs | Stop applying immediately |
| Infrastructure | CloudFormation StackSets | Resources may be deleted (depends on retention setting) |
| Resource sharing | AWS RAM | Organization-scoped shares revoked |
| Billing | Reserved Instances / Savings Plans | Organization-wide sharing benefits lost |
| Observability | EventBridge cross-account | Policies referencing `aws:PrincipalOrgID` break |

**Assessment approach:**

1. Deploy [Account Assessment for AWS Organizations](https://docs.aws.amazon.com/solutions/account-assessment-for-aws-organizations/) in the management account to scan resource-based policies, delegated administrators, and trusted access services
2. Run [CFAT](https://github.com/cloud-foundations-on-aws/cloud-foundations-templates/blob/main/cfat/README.md) from CloudShell for a foundation readiness snapshot of the target organisation
3. Execute manual CLI checks for StackSets retention settings, Identity Center assignments, RAM shares, and all policy types (SCPs, RCPs, declarative, management)

**Critical pre-transfer step** — verify account recovery options:

```bash
# Verify root user email is accessible
aws account get-primary-email --account-id <ACCOUNT_ID> --region us-east-1

# Verify contact information
aws account get-contact-information --account-id <ACCOUNT_ID> --region us-east-1
```

For accounts created via `CreateAccount` in Organizations, root user credentials may never have been set. Perform a root user password reset before transferring.

### Enabling a new AWS Region

AWS Regions introduced after March 2019 are opt-in Regions requiring explicit enablement. Before enabling a Region across your organisation:

1. Identify which OUs need access to the new Region
2. Assess impact on existing SCPs and permission boundaries
3. Plan changes to tagging strategy and cost allocation tags
4. Review compliance and security policy modifications needed

**For a single account:** Navigate to Account Settings → Regions → enable the target Region.

**For AWS Organizations:** Enable in the management account first, then systematically enable in member accounts. Use CloudFormation StackSets or AWS CLI scripts to automate across dozens or hundreds of accounts.

**For Control Tower environments:**
1. Enable the Region at the Organizations level
2. Access the Control Tower console → Landing Zone settings → Modify settings → Update Region Settings
3. Re-register existing OUs or update accounts through Account Factory
4. Verify guardrails, CloudWatch alarms, and AWS Config rules are functioning

### Extending a landing zone into new Regions

After enabling a Region, extend your governance framework:

**Services that extend automatically:**
- CloudTrail (if configured for all Regions)
- AWS Billing and Cost Explorer
- IAM (global service)
- Control Tower built-in guardrails (after Landing Zone update)

**Services requiring explicit enablement:**
- GuardDuty, Security Hub, Macie, Detective
- AWS Config recorders and rules
- Custom SCPs with region allow-lists
- Resource Explorer aggregators
- CloudWatch Logs cross-region observability sinks
- IAM Access Analyzer

Example SCP update to allow a new Region:

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
                        "ap-southeast-4"
                    ]
                }
            }
        }
    ]
}
```

**Home Region considerations:** Your landing zone home Region hosts Control Tower management components, audit log archives, and deployment pipelines. Moving a home Region is a major undertaking (decomissioning and redeploying core services). Choose a home Region aligned with your long-term geographic strategy before expanding.

### Tagging strategy for application operations

Effective tagging enables cost allocation, security controls, compliance monitoring, and operational automation. Implement a layered approach:

**Core tag categories:**

| Category | Example Keys | Purpose |
|----------|-------------|---------|
| Business | `CostCenter`, `Project`, `Owner` | Cost allocation and accountability |
| Technical | `Environment`, `Application` | Resource grouping and automation |
| Security | `SecurityLevel`, `DataClassification` | Access control and compliance |
| Operations | `BackupSchedule`, `maintenance:patching` | Automated operational tasks |

**Enforcement mechanisms:**

1. **Tag Policies** (AWS Organizations) — define required tag keys, allowed values, and case treatment across accounts
2. **AWS Config rules** — detect non-compliant resources and trigger automated remediation
3. **Service Control Policies** — prevent resource creation without required tags
4. **Resource Groups** — organise resources by application for collective management

**Application-centric operations:** Use the `awsApplication` tag with AWS Service Catalog AppRegistry to define formal applications. The myApplications dashboard then provides unified cost, security, compliance, and performance views per application.

## Related

- [Control Tower Landing Zone](../control-tower-landing-zone/) — governance and guardrails for multi-account environments
- [Cross-Account Observability](../cross-account-observability/) — centralised monitoring across accounts and Regions
- [AWS Config Compliance Monitoring](../aws-config-compliance/) — configuration compliance and drift detection
