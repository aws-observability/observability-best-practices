# Using the CloudTrail MCP Server for Security, Audit, and Operations

## Introduction

The [CloudTrail Model Context Protocol (MCP)](https://awslabs.github.io/mcp/servers/cloudtrail-mcp-server) server enables agents like [Kiro](https://kiro.dev/cli/) to query and analyze [AWS CloudTrail](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html) events directly through natural language. By connecting your agents to CloudTrail events in either [CloudWatch Logs](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/send-cloudtrail-events-to-cloudwatch-logs.html) or [CloudTrail Lake](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-lake.html), you can investigate security incidents, audit account activity, troubleshoot operational issues, and generate compliance reports—all through conversational prompts instead of writing complex SQL queries or manually parsing JSON logs.

## Why This Matters

Security, compliance, and operations teams spend significant time analyzing CloudTrail logs to understand AWS account activity:

- **Security teams** need to quickly investigate suspicious activity, trace unauthorized access attempts, and identify the scope of potential security incidents across multiple accounts
- **Compliance teams** must generate audit reports showing who accessed what resources, when changes were made, and whether activities comply with organizational policies
- **Operations teams** troubleshoot service disruptions by tracing API calls, identifying configuration changes, and understanding the sequence of events leading to issues
- **All teams** struggle with CloudWatch Logs Insights query syntax, JSON parsing, and correlating events across time periods and accounts

Without the CloudTrail MCP server, teams resort to writing complex queries, manually parsing JSON logs, or building custom dashboards—adding time, complexity, and potential for human error to critical security and operational workflows.

## How It Works

The CloudTrail MCP server translates natural language questions into queries against your CloudTrail data, executes them, and returns human-readable results with context and insights.

**Supported Data Sources:**

- **CloudWatch Logs**: Uses [CloudWatch Logs Insights query syntax](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html) - MCP server automatically discovers available log groups
- **CloudTrail Lake**: Uses [SQL queries](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/query-create-edit-query.html) - MCP server automatically discovers available event data stores for CloudTrail Lake

**Key Capabilities:**

- Natural language queries instead of writing query syntax
- Multi-account support
- Time-based analysis and event correlation
- Security investigation, compliance reporting, and operational troubleshooting

## Setup Requirements

To use the CloudTrail MCP server, you need:

**For CloudWatch Logs:**
- [AWS CloudTrail configured to send events to CloudWatch Logs](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/send-cloudtrail-events-to-cloudwatch-logs.html)
- IAM permissions: `logs:StartQuery`, `logs:GetQueryResults`, `logs:DescribeLogGroups`
- MCP server will automatically discover available CloudTrail log groups

**For CloudTrail Lake:**
- [CloudTrail Lake event data store](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/query-event-data-store.html) created and configured 
- IAM permissions: `cloudtrail:StartQuery`, `cloudtrail:GetQueryResults`, `cloudtrail:DescribeEventDataStores`, `cloudtrail:ListEventDataStores` (see [CloudTrail Lake permissions](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/lake-permissions.html))
- MCP server will automatically discover available CloudTrail Lake event data stores

**For Both:**
- MCP server configured in your agent
- AWS credentials with appropriate permissions

## Configuration

To configure the CloudTrail MCP server in your agent, follow the setup instructions in the [AWS MCP Servers Documentation](https://awslabs.github.io/mcp/). The MCP server automatically discovers available CloudTrail data sources (CloudWatch Logs and CloudTrail Lake) in your AWS account.

**In your prompts**, you can optionally specify which data source to query:

```
Using CloudWatch Logs, show me all failed login attempts in the last 24 hours.
```

```
Using CloudTrail Lake, show me all IAM policy changes in the last 90 days.
```

## Sample Prompts for Real-World Tasks

### Security Investigation Prompts

#### 1. Investigate Failed Login Attempts

**Prompt:**
```
Show me all failed console login attempts in the last 24 hours. 
Include the username, source IP address, and timestamp.
```

**What it does:** Identifies potential brute force attacks or compromised credentials by analyzing [CloudTrail event records](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-event-reference-record-contents.html)

**Use case:** Security team receives alert about multiple failed logins and needs to assess threat level

---

#### 2. Identify Privilege Escalation

**Prompt:**
```
Show me all IAM policy changes in the last 48 hours. 
Focus on policies that grant admin permissions or modify IAM roles.
```

**What it does:** Detects potential privilege escalation attempts

**Use case:** Security team investigates whether an actor gained elevated permissions

---

### Compliance and Audit Prompts

#### 3. Generate User Activity Report

**Prompt:**
```
Generate a complete audit report for IAM user demo.user for the month of January 2024. 
Include all API calls, resources accessed, and any permission changes.
```

**What it does:** Creates comprehensive user activity audit trail

**Use case:** Need to provide a timeline of activity for a certain period

---

#### 4. Track MFA Usage

**Prompt:**
```
Show me all console logins in the last month. Which users logged in without MFA? 
How many times did each user login?
```

**What it does:** Validates MFA compliance across organization

**Use case:** Security policy requires MFA for all users; identify non-compliant accounts

---

### Operational Troubleshooting Prompts

#### 5. Investigate Service Outage

**Prompt:**
```
Our application stopped working at 2024-01-15 14:30 UTC. Show me all API calls 
related to our production VPC (vpc-abc123) in the 30 minutes before the outage. 
What changed?
```

**What it does:** Identifies configuration changes that caused service disruption

**Use case:** Operations team needs to quickly identify root cause of outage

---

#### 6. Debug IAM Permission Issues

**Prompt:**
```
User reports they can't create EC2 instances. Show me all EC2 RunInstances calls 
from user demo.user in the last 2 hours, including any access denied errors. 
What permissions are missing?
```

**What it does:** Diagnoses IAM permission problems

**Use case:** User can't perform required tasks; identify missing permissions

---

### Advanced Multi-Account Prompts

#### 7. Cross-Account Security Review

**Prompt:**
```
Across all our AWS accounts, show me any security group rules that allow inbound 
traffic from 0.0.0.0/0 on ports other than 80 and 443. When were these rules created 
and by whom?
```

**What it does:** Identifies security risks across entire AWS organization

**Use case:** Security team conducts organization-wide security posture review

**Note:** Requires CloudTrail Lake with [organization event data store](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-lake-organizations.html) for multi-account queries or a organization trail delivered to CloudWatch Logs.

---

#### 8. Compliance Across Accounts

**Prompt:**
```
For production accounts (account IDs: 111111111111, 222222222222, 333333333333), 
show me any CloudTrail configuration changes in the last year. Has logging ever 
been disabled?
```

**What it does:** Validates audit logging compliance across organization

**Use case:** Compliance audit requires proof of continuous logging

---

### Combining CloudTrail with VPC Flow Logs

When both CloudTrail and [VPC Flow Logs](https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html) are sent to CloudWatch Logs, you can correlate API actions with network traffic for comprehensive security investigations.

#### 9. Troubleshoot Connectivity Issues

**Prompt:**
```
Application team reports connectivity issues to RDS database at 10:15 AM today. 
Check VPC Flow Logs for rejected connections to the database subnet around that time, 
then check CloudTrail for any security group, NACL, or route table changes in the 
30 minutes before the issue started.
```

**What it does:** Identifies whether connectivity issues stem from configuration changes or network problems

**Use case:** Operations team needs to quickly resolve application outage

---

#### 10. Detect Lateral Movement

**Prompt:**
```
CloudTrail shows user demo.user assumed role "ProductionAdmin" at 2:30 PM. 
Check VPC Flow Logs for all network connections initiated from instances 
accessed by that role in the following hour. Are there any unusual internal 
connections or port scans?
```

**What it does:** Identifies potential lateral movement after privilege escalation

**Use case:** Security team investigates whether compromised credentials were used to access additional resources

---

## Best Practices

**Effective Prompts:**
- Be specific with time ranges and include context (account IDs, resource names, user identities)
- Ask follow-up questions to refine results
- Request actionable insights: "what should I do?" or "is this normal?"

**Query Optimization:**
- Start broad, then narrow down
- Use resource identifiers for faster results
- Combine related questions in one prompt

**Security:**
- Protect sensitive data in query results
- Validate findings through multiple data points
- Limit MCP server access to authorized users


## Conclusion

The CloudTrail MCP server transforms CloudTrail event analysis from a technical query-writing task into a natural conversation with your agents. Security teams can investigate incidents faster, compliance teams can generate audit reports effortlessly, and operations teams can troubleshoot issues without learning complex query syntax.

Start with the basic prompts for your most common tasks—investigating failed logins, tracking IAM changes, or troubleshooting outages—then adapt them to your specific environment. The conversational nature of the MCP server means you can refine your questions iteratively, getting more precise answers as you explore your CloudTrail data.

For more information, see the [AWS MCP Servers Documentation](https://awslabs.github.io/mcp/) and [MCP for Kiro](https://kiro.dev/docs/mcp/).
