---
title: Control Tower Landing Zone
sidebar_label: Control Tower Landing Zone
---

# Control Tower Landing Zone

## Overview

AWS Control Tower orchestrates AWS services to set up and govern a secure, multi-account landing zone. This guide covers the full lifecycle: planning region strategy and identity, choosing a customization approach, operating controls and drift management, enabling Control Tower in an existing organisation, and upgrading to landing zone version 4.0.

Landing zone governance directly impacts observability — Control Tower manages AWS Config recorders, CloudTrail organisation trails, and SNS notifications that feed monitoring and compliance pipelines.

## When to use this

- You are setting up a new multi-account AWS environment and need centralized governance
- You need to choose between AFC, CfCT, AFT, or LZA for landing zone customization
- You are operating an existing Control Tower environment and need guidance on drift, updates, and controls
- You have an existing AWS Organization and want to adopt Control Tower incrementally
- You are upgrading from landing zone 3.x to 4.0

## Guidance

### Planning your landing zone

**Region strategy**: Designate your most commonly used region as the Control Tower home region. Enable the [global region deny control](https://docs.aws.amazon.com/controltower/latest/userguide/region-deny.html) to restrict unused regions, reducing attack surface and simplifying governance.

**Identity**: Use AWS IAM Identity Center for all human access. Integrate your corporate identity provider to maintain a single source of truth. Work towards least-privilege by replacing default `AdministratorAccess` permission sets with scoped custom policies.

**Delegated administration**: Enable delegated administrator accounts for Identity Center and AWS Config to minimize management account usage.

**Organization structure**: Follow [multi-account best practices](https://docs.aws.amazon.com/whitepapers/latest/organizing-your-aws-environment/organizing-your-aws-environment.html). Keep nesting under five levels. Do not modify or delete the Security OU or its accounts.

### Customizing your landing zone

Choose one customization approach and commit to it:

| Feature | AFC | CfCT | AFT | LZA |
|---------|-----|------|-----|-----|
| Service Managed | Yes | No | No | No |
| IaC Engine | CloudFormation/Terraform | CloudFormation | Terraform | CDK |
| Operational Overhead | Low | Medium | High | Medium |
| Customization Flexibility | Limited | High | Highest | High |
| Proactive Controls Apply | Yes | Yes | No | Yes |

- **AFC** — Simplest option, single blueprint per account, no infrastructure to manage.
- **CfCT** — Code Pipeline in management account; supports SCPs, RCPs, and CloudFormation templates.
- **AFT** — Full Terraform lifecycle including account creation; highest flexibility but highest overhead.
- **LZA** — Opinionated CDK-based solution for highly regulated environments.

Define all platform services (networking, security tooling, observability) in infrastructure as code for version control, peer review, and automated provisioning.

### Operating your landing zone

**Keep updated**: Apply landing zone updates promptly for security improvements and feature enhancements. After updating, re-register OUs to propagate baselines to member accounts.

**Account creation**: Always create accounts through Account Factory so they are enrolled and governed upon creation. Accounts created directly in Organizations are not enrolled.

**Drift management**: Control Tower detects drift automatically. Subscribe to `aws-controltower-AggregateSecurityNotifications` in the audit account for notifications. Resolve drift promptly — a drifted landing zone cannot accurately determine compliance.

**Controls**: Apply controls from the [Controls Catalog](https://docs.aws.amazon.com/controltower/latest/controlreference/controls-reference.html) to enforce governance. Always test on non-production OUs first. Consider deploying detective controls before equivalent preventative controls to identify non-compliance without blocking workloads.

**Remediation**: Associate [Systems Manager Automation documents](https://docs.aws.amazon.com/config/latest/developerguide/remediation.html) with Config rules for manual or automatic remediation of non-compliant resources.

**Cost awareness**: Monitor AWS Config recorder costs (especially in dynamic environments), delete pre-existing CloudTrail management trails after enabling Control Tower's organisation trail, and use [Cost Anomaly Detection](https://docs.aws.amazon.com/cost-management/latest/userguide/getting-started-ad.html) for spike alerts.

### Enabling in an existing organisation

**Pre-requisites**:
- Disable trusted access for Config and CloudTrail before enabling Control Tower
- Resolve any existing Identity Center region conflicts (must match home region)
- Ensure sufficient account quota for shared accounts creation

**CloudTrail considerations**: If you have existing organisation trails, stop logging on them before disabling trusted access to avoid billing for inactive trails. Plan a maintenance window for the brief gap in coverage.

**Extending governance**: Enabling Control Tower does not automatically enroll existing accounts. Register entire OUs (up to 1000 accounts per batch) to apply baselines. Ensure `AWSControlTowerExecution` role exists in target accounts and delete existing Config resources before enrollment.

**Existing controls**: Pre-existing SCPs remain enforced. Ensure they don't block Control Tower provisioning actions. Compliance state of Config rules defined outside Control Tower will not appear in the Control Tower dashboard — consider the [Config Resource Compliance Dashboard](https://catalog.workshops.aws/awscid/en-US/dashboards/additional/config-resource-compliance-dashboard) for a unified view.

### Upgrading to landing zone 4.0

Landing zone 4.0 makes all service integrations optional, introduces a standalone `ConfigBaseline`, moves drift notifications to EventBridge, and provides access to 1,200+ controls from AWS Control Catalog without restructuring your organisation.

![Control Tower landing zone version selection during upgrade](/img/cloudops/guides/control-tower/upgrade/image.png)

**Key changes**:
- AWS Config data stored in a dedicated S3 bucket (separate from CloudTrail)
- Config aggregator moves to the audit account as a service-linked aggregator
- Delegated administrator registered for Config in the audit account

**Before upgrading**:
1. Resolve all organisational drift
2. Back up configuration: OU structure, Config aggregators, StackSet templates, control enablement
3. Remove closed-account stack instances from `AWSControlTowerBP-*` StackSets
4. Verify no termination protection on Control Tower baseline stacks
5. Identify workflows reading Config data from S3 and coordinate cutover

**After upgrading**:
- Re-register OUs to apply new baselines (does not cascade to child OUs)
- Recreate custom Config advanced queries in the audit account
- Update downstream dashboards to reference the new `aws-controltower-config-logs-*` bucket
- Allow 24-48 hours for full data aggregation in the new service-linked aggregator

![Config aggregator verification in the audit account after upgrade](/img/cloudops/guides/control-tower/upgrade/Pastedimage20260219215025.png)

> **Important**: This upgrade is irreversible. Test in a non-production organisation first.

## Related

- [AWS Config Compliance Monitoring](../aws-config-compliance/)
- [AWS Organizations and Regions](../aws-organizations-and-regions/)
- [Cross-Account Observability](../cross-account-observability/)
