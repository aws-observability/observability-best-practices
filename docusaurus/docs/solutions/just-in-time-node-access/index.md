---
title: Just-in-Time Node Access
sidebar_label: Just-in-Time Node Access
---

# Just-in-Time Node Access

## Overview

Just-in-time node access (JITNA) is a capability of AWS Systems Manager that provides approval-based temporary access to managed nodes. Instead of granting persistent session access, JITNA requires users to request access with a justification, which is then either automatically approved by Cedar policies or routed through a manual approval workflow. Access is time-bounded and fully auditable via OpsItems and EventBridge events.

This solution covers enabling JITNA via Infrastructure-as-Code, configuring auto-approval and manual approval policies using Cedar, integrating with EventBridge for event-driven notifications, and monitoring access request activity through CloudWatch Logs.

## Prerequisites

- AWS Organizations with a delegated administrator account for Systems Manager
- Systems Manager unified console enabled across target accounts and Regions
- SSM Agent installed and running on target managed nodes
- IAM Identity Center (SSO) or IAM configured for requester/approver identities
- Network connectivity from managed nodes to Systems Manager endpoints

## Architecture

JITNA is deployed through Quick Setup configuration managers. The following diagram shows the organisation-level deployment:

![JITNA architecture for AWS Organizations](/img/cloudops/recipes/centralized-operations-management/just-in-time-node-access/jitna-organization.png "Just-in-time node access deployment via Quick Setup configuration managers")

1. A CloudFormation stack in the delegated administrator account creates Quick Setup configuration managers.
2. The unified console configuration manager deploys to all OUs.
3. The JITNA configuration manager deploys to selected OUs.
4. Approval policies, session preferences, and notification configurations are deployed separately.

### Approval policies and session preferences

![JITNA approval policies and session preferences](/img/cloudops/recipes/centralized-operations-management/just-in-time-node-access/jitna-resources.png "JITNA approval policies and session preferences architecture")

1. A CloudFormation StackSet deploys auto-approval policies, manual approval policies, and session preferences as SSM documents.
2. Each target account/Region receives the required resources as CloudFormation stacks.
3. A deny-access policy is deployed centrally in the delegated administrator account.

## Deploy

### Step 1: Enable JITNA via CloudFormation

Deploy the Quick Setup configuration managers in your delegated administrator account. The CloudFormation template creates:

- IAM service roles for Quick Setup
- A configuration manager for the Systems Manager unified console
- A configuration manager for just-in-time node access

Key parameters:

| Parameter | Description | Example |
|-----------|-------------|---------|
| `DelegatedAdminAccountId` | SSM delegated admin account ID | `123456789012` |
| `HomeRegion` | Region for unified console | `us-east-1` |
| `JITNATargetOrganizationalUnits` | OUs where JITNA is enabled | `ou-a1b2-abcd1234,ou-a1b2-efgh1234` |
| `JITNATargetRegions` | Regions for JITNA (subset of unified console Regions) | `us-east-1,us-east-2,us-west-2` |
| `IdentityProviderSetting` | `IAM` or `SSO` | `IAM` |

Sample template: [just-in-time-quick-setup-cfn-template.yaml](https://github.com/aws-samples/cloud-operations-best-practices/blob/main/cloud-operations-best-practices/static/cfn-templates/just-in-time-node-access/just-in-time-quick-setup-cfn-template.yaml)

### Step 2: Deploy approval policies

Deploy approval policies via CloudFormation StackSets. The template creates:

- An **auto-approval policy** for development nodes (tag `ENV:DEV`)
- **Manual approval policies** for production workloads (e.g., `Workload:Ecommerce`, `Workload:Finance`)
- **Session preferences** for JITNA sessions

Sample template: [just-in-time-cfn-approval-policies.yaml](https://github.com/aws-samples/cloud-operations-best-practices/blob/main/cloud-operations-best-practices/static/cfn-templates/just-in-time-node-access/just-in-time-cfn-approval-policies.yaml)

### Step 3: Configure Cedar policies

Cedar policies control automatic approval logic. Below are key examples.

#### Permit automatic access to development nodes for all identities

```cedar
// Permit automatic access to DEV nodes
permit (principal, 
      action == AWS::SSM::Action::"getTokenForInstanceAccess", 
      resource)
    when {
    resource.hasTag("Environment") && 
    resource.getTag("Environment") == "DEV"
    };
```

#### Permit automatic access to production nodes for the on-call IDC group

```cedar
// Permit automatic access to PROD nodes for OnCall users
// OnCall IDC Group ID: 34688438-1061-702c-a03d-1fa788dccfd1
permit (principal in AWS::IdentityStore::Group::"34688438-1061-702c-a03d-1fa788dccfd1", 
      action == AWS::SSM::Action::"getTokenForInstanceAccess", 
      resource)
    when {
    resource.hasTag("Environment") && 
    resource.getTag("Environment") == "PROD"
    };
```

For the full schema and built-in operators, see [Statement structure for auto-approval and deny-access policies](https://docs.aws.amazon.com/systems-manager/latest/userguide/auto-approval-deny-access-policy-statement-structure.html). For Cedar syntax and built-in operators generally, see the [Cedar policy language reference](https://docs.cedarpolicy.com/).

### Step 4: Configure EventBridge rules for notifications

JITNA emits three event types to EventBridge for manual approval requests:

| Event Type | Description |
|-----------|-------------|
| `Requester Access Request Status Update` | Notifies requester of status changes (PendingApproval, Approved) |
| `Approver Access Request Status Update` | Notifies approvers of pending requests |
| `JITNA Access Request Failed` | Fired when multiple policies conflict on a node |

EventBridge rule pattern for approver notifications:

```json
{
  "source": ["aws.ssm"],
  "detail-type": ["Approver Access Request Status Update"],
  "detail": {
    "Approvers": ["AccessApprover1"]
  }
}
```

EventBridge rule pattern for failed requests:

```json
{
  "source": ["aws.ssm"],
  "detail-type": ["JITNA Access Request Failed"]
}
```

Route these events to SNS topics, Lambda functions, or third-party incident management tools.

## Validate

1. **Request access to a DEV node**: Verify the request is auto-approved and a session starts immediately
2. **Request access to a PROD node**: Verify the request enters `PendingApproval` state and approvers receive EventBridge notifications
3. **Approve a pending request**: Confirm the requester receives an `Approved` event and can start a session
4. **Check OpsItems**: Verify access requests are stored as OpsItems with type `/aws/accessrequest`
5. **Conflict scenario**: Tag a node with multiple manual approval policy tags and confirm a `JITNA Access Request Failed` event fires

## Troubleshoot

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| Access request fails with policy conflict | Multiple manual approval policies apply to the same node | Ensure each node matches exactly one manual approval policy via distinct tags |
| Auto-approval not working | Cedar policy syntax error or tag mismatch | Validate policy in Cedar playground; confirm node tags match policy conditions exactly |
| Approvers not receiving notifications | Missing EventBridge rule or incorrect approver ID | Verify EventBridge rule pattern includes correct approver principal IDs |
| Session times out before approval | Access duration too short or approval latency | Increase access duration in the approval policy; add more approvers for faster response |
| JITNA not enabled in a Region | Region not included in Quick Setup target Regions | Update `JITNATargetRegions` parameter; Region must be in the unified console target Regions |

## Related Solutions

- [Patch and Node Management](../patch-and-node-management/) — comprehensive fleet management with Systems Manager
- [CloudTrail Security Forensics](../cloudtrail-security-forensics/) — security investigation and audit trail analysis
