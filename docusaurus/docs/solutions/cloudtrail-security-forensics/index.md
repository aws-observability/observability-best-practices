---
title: CloudTrail Security Forensics
sidebar_label: Security Forensics
---

import RelatedEvents from '@site/src/components/RelatedEvents';

# CloudTrail Security Forensics

## Related Events

<RelatedEvents topics={["security"]} />

## Overview

AWS CloudTrail provides detailed records of API calls, user actions, and service events essential for security forensics, incident response, and compliance auditing. During a security incident, CloudTrail logs are the primary source for understanding what happened, who did it, and what was affected.

This guide covers the critical event fields for forensic analysis, investigation patterns using CloudTrail Lake and CloudWatch Logs Insights, and deploying a security visibility dashboard for near real-time threat detection. It assumes you already have CloudTrail trails or event data stores configured — see [CloudTrail Monitoring](../cloudtrail-monitoring/) for setup guidance.

## When to use this

- You are investigating a suspected compromise of IAM credentials
- You need to trace cross-account activity or role-chaining attacks
- You want to identify which resources an attacker accessed or modified
- You are building CloudWatch alarms for high-risk API activity (root login, privilege escalation)
- You need a centralized security dashboard correlating CloudTrail with VPC Flow Logs
- You are preparing for a compliance audit requiring evidence of API activity monitoring

## Guidance

### Critical event fields for investigations

Understanding which CloudTrail event fields to examine accelerates incident response. The most important fields for forensic analysis are:

| Field | Security Significance |
|-------|----------------------|
| `userIdentity.type` | Identifies the actor type (Root, IAMUser, AssumedRole). Root usage requires immediate escalation. |
| `userIdentity.accessKeyId` | Tracks compromised credentials across multiple events. |
| `userIdentity.sessionContext` | Critical for understanding role-chaining attacks and cross-account access. |
| `eventName` | Reveals attacker techniques — reconnaissance (`ListUsers`), escalation (`CreateAccessKey`), or destruction (`DeleteBucket`). |
| `sourceIPAddress` | Identifies geographic origin; cross-reference with threat intelligence feeds. |
| `errorCode` / `errorMessage` | Reveals failed attack attempts and permission boundaries. Multiple `AccessDenied` errors may indicate credential testing. |
| `responseElements` | Contains newly created resources (access keys, roles) that must be revoked during remediation. |
| `readOnly` | Distinguishes reconnaissance (true) from modification actions (false). |

For the complete field reference, see [CloudTrail event record contents](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-event-reference-record-contents.html).

### Investigation workflow for compromised access keys

1. **Identify the actor**: Use `userIdentity` fields (`type`, `userName`, `arn`, `accountId`) to determine the compromised identity. Escalate immediately if `type` is `Root`.
2. **Establish timeline**: Use `eventTime` to sequence events and determine how long the attacker had access.
3. **Analyze actions**: Review `eventName` and `readOnly` to understand techniques — look for `CreateAccessKey`, `AttachRolePolicy`, `PutUserPolicy` (persistence), or `DeleteTrail` (detection evasion).
4. **Track affected resources**: Use `resources`, `requestParameters`, and `responseElements` to identify targeted or modified assets.
5. **Investigate access path**: Cross-reference `sourceIPAddress`, `userAgent`, and `sessionContext` to detect unauthorized access or role-chaining.
6. **Review errors**: Analyze `errorCode` to identify actions blocked by IAM policies — this reveals the attacker's full intent.

### Querying with CloudTrail Lake

Constrain queries by `eventTime` to minimize scan costs:

```sql
SELECT eventTime, userIdentity.arn, eventName, sourceIPAddress, errorCode
FROM $EDS_ID
WHERE eventName = 'CreateAccessKey'
  AND eventtime >= '2026-08-18 00:00:00'
  AND eventtime <= '2026-08-20 23:59:59'
ORDER BY eventTime DESC
```

Detect VPC endpoint access denials (network activity events):

```sql
SELECT count(*) as VPCAccessDenied, userIdentity.arn,
    userIdentity.accountid, eventName, errorMessage,
    vpcEndpointId, sourceIPAddress
FROM $EDS_ID
WHERE eventCategory = 'NetworkActivity'
    AND errorCode = 'VpceAccessDenied'
    AND eventtime >= '2026-08-18 00:00:00'
    AND eventtime <= '2026-08-20 23:59:59'
GROUP BY userIdentity.arn, userIdentity.accountid,
    eventName, errorMessage, vpcEndpointId, sourceIPAddress
ORDER BY eventName DESC
```

### CloudWatch Logs metric filters for real-time alerting

Create metric filters on your CloudTrail log group for high-priority events:

| Event | Metric Filter Pattern |
|-------|----------------------|
| Root account usage | `{ $.userIdentity.type = "Root" && $.userIdentity.invokedBy NOT EXISTS && $.eventType != "AwsServiceEvent" }` |
| Privilege escalation | `{ ($.eventName = "AttachRolePolicy") \|\| ($.eventName = "PutRolePolicy") \|\| ($.eventName = "CreateAccessKey") \|\| ($.eventName = "CreateLoginProfile") }` |
| Console login failures | `{ ($.eventName = "ConsoleLogin") && ($.errorMessage = "Failed authentication") }` |

Route alarm actions to an SNS topic that notifies your security operations team.

### Security visibility dashboard

Deploy a pre-built CloudWatch Dashboard using CloudFormation that leverages CloudWatch Unified Data Store to provide near real-time visibility into CloudTrail and VPC Flow Logs activity:

1. Download the [CloudWatch_Dashboard_CloudTrail_VPC.yaml](https://raw.githubusercontent.com/aws-samples/aws-management-and-governance-samples/refs/heads/master/AWSCloudTrail/cloudwatch-dashboards/CloudWatch_Dashboard_CloudTrail_VPC.yaml) template.
2. Deploy via CloudFormation with parameters `DashboardName` and `LogFormat` (Standard or OCSF).
3. The dashboard uses `SOURCE logGroups() | filterIndex @data_source_name in ["aws_cloudtrail"]` to discover CloudTrail data automatically — no log group name configuration needed.

The dashboard provides six sections: Security Overview, Correlated Security Insights, Network Security, Identity & Access Management, Activity Distribution, and Detailed Security Events Timeline.

![CloudTrail security visibility dashboard showing API errors, identity types, and authentication events](/img/cloudops/solutions/cloudtrail-dashboards/example-dashboard-01.png "CloudTrail Security Dashboard — Overview Section")

![CloudTrail security dashboard showing network analysis and detailed event timelines](/img/cloudops/solutions/cloudtrail-dashboards/example-dashboard-02.png "CloudTrail Security Dashboard — Network and Events Section")

### Using the CloudTrail MCP Server for AI-assisted investigations

The [CloudTrail MCP server](https://awslabs.github.io/mcp/servers/cloudtrail-mcp-server) enables AI agents to query CloudTrail events through natural language, eliminating the need to write complex SQL or CloudWatch Logs Insights queries manually. Sample prompts:

- "Show me all failed console login attempts in the last 24 hours with username and source IP."
- "Using CloudTrail Lake, show me all IAM policy changes in the last 90 days."
- "What access keys were created in the last week and by whom?"

The MCP server automatically discovers available CloudTrail data sources (CloudWatch Logs and CloudTrail Lake) in your account.

## Related

- [CloudTrail Monitoring](../cloudtrail-monitoring/) — Setup and configuration of trails and event data stores
- [Security Lake with CloudWatch](../security-lake-cloudwatch/) — Centralized security data lake
- [CloudWatch Logs Security](../cloudwatch-logs-security/) — Securing and analyzing CloudWatch Logs
- [AWS CloudTrail Event Reference](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-event-reference.html) — Complete event field documentation
