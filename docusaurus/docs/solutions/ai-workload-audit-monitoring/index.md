---
title: AI Workload Audit and Monitoring
sidebar_label: AI Audit & Monitoring
---

import RelatedEvents from '@site/src/components/RelatedEvents';

# AI Workload Audit and Monitoring

## Related Events

<RelatedEvents topics={["ai-ml", "security"]} />

## Overview

AI workloads on AWS generate telemetry across three independent pipelines: CloudTrail (who called what), Bedrock Model Invocation Logging (what the model said), and Agent Telemetry collected by ADOT (how the agent performed). Each pipeline is essential for audit and compliance, but no single pipeline provides complete visibility. Security investigations almost always require correlating at least two.

This guide distils the durable guidance for building a complete audit and monitoring story for AI workloads. It covers the three telemetry pipelines, key detection patterns, and cross-pipeline correlation. For reference detail on metric filters, advanced event selectors, and Contributor Insights rules, see the [CloudTrail](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html) and [Bedrock model invocation logging](https://docs.aws.amazon.com/bedrock/latest/userguide/model-invocation-logging.html) documentation.

## When to use this

- You are running Amazon Bedrock models, agents, knowledge bases, or flows in production and need audit visibility
- You need to demonstrate compliance for AI workloads (content audit, access tracking, governance evidence)
- You are building detection rules for unauthorized AI model access or guardrail tampering
- You need to correlate across CloudTrail, model invocation logs, and ADOT spans to answer investigation questions
- You are deploying AgentCore workloads and need visibility into gateway traffic, tool usage, and credential access

## Guidance

### The Three Telemetry Pipelines

Each pipeline captures different data and serves different audit purposes:

| Pipeline | Captures | Primary Use |
|---|---|---|
| **CloudTrail** | Every API call — caller ARN, source IP, error codes, access denials, configuration changes | Security audit, access investigation, change tracking |
| **Bedrock Model Invocation Logging** | Full prompt and response, inference parameters (temperature, max_tokens), token counts, caller identity | Content audit, compliance, prompt debugging, cost attribution |
| **Agent Telemetry (ADOT)** | Model call latency, tool execution order, distributed traces, session tracking | Operational monitoring, performance debugging, workflow observability |

### Enabling the Pipelines

**Pipeline A: Bedrock Model Invocation Logging** — Manual opt-in required.

1. Open the [Bedrock console](https://console.aws.amazon.com/bedrock/) → Settings → Model invocation logging
2. Enable logging with CloudWatch Logs as destination (default log group: `bedrock-model-invocation-logging`)
3. Configure the service role for log delivery

For data protection policies that mask sensitive fields, and for dashboard setup, see [GenAI Workload Observability](../genai-observability/).

**Pipeline B: Agent Telemetry (ADOT)** — For AgentCore, telemetry flows automatically to `aws/spans`. For EKS/ECS, attach the ADOT auto-instrumentation agent. Enable [CloudWatch Transaction Search](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Enable-TransactionSearch.html) for the full Application Signals experience.

**Pipeline C: CloudTrail** — Management events are captured by default (including `InvokeModel` and `Converse`). Data events for agents, knowledge bases, flows, guardrails, and AgentCore require advanced event selectors on your trail. Deliver to a CloudWatch Logs log group to enable correlation queries.

### CloudTrail Data Events for AI Workloads

By default, CloudTrail only captures management events. The following data event categories require explicit advanced event selector configuration:

**Bedrock data events** (18 resource types):

| Category | Key Resource Types |
|---|---|
| Agent & Orchestration | `AWS::Bedrock::AgentAlias`, `AWS::Bedrock::InlineAgent`, `AWS::Bedrock::FlowAlias`, `AWS::Bedrock::Session` |
| Safety & Guardrails | `AWS::Bedrock::Guardrail`, `AWS::Bedrock::AutomatedReasoningPolicy` |
| Knowledge & RAG | `AWS::Bedrock::KnowledgeBase`, `AWS::Bedrock::Tool` |
| Model Invocation | `AWS::Bedrock::Model` (bidirectional streaming), `AWS::Bedrock::AsyncInvoke` |

**AgentCore data events** (14 resource types):

| Category | Key Resource Types |
|---|---|
| Runtime & Gateway | `AWS::BedrockAgentCore::Gateway`, `AWS::BedrockAgentCore::Runtime` |
| Built-in Tools | `AWS::BedrockAgentCore::CodeInterpreter`, `AWS::BedrockAgentCore::Browser` |
| Identity & Credentials | `AWS::BedrockAgentCore::WorkloadIdentity`, `AWS::BedrockAgentCore::TokenVault` |
| Memory & Evaluation | `AWS::BedrockAgentCore::Memory`, `AWS::BedrockAgentCore::Evaluator` |

For the full JSON selectors, see [Amazon Bedrock CloudTrail documentation](https://docs.aws.amazon.com/bedrock/latest/userguide/logging-using-cloudtrail.html).

### Implementation Priority

| Step | What to Enable | Impact |
|---|---|---|
| 1 | Management events (all regions, Read + Write) | Captures `InvokeModel`, `Converse`, AgentCore management events |
| 2 | Bedrock data events (18 resource types) | Agent invocations, RAG, flows, guardrails, sessions |
| 3 | AgentCore data events (14 resource types) | Gateway traffic, tools, credentials, memory |
| 4 | CloudTrail Insights | Anomaly detection for API call rate and error rate |
| 5 | S3 data events (write-only on AI buckets) | Training data and model artifact changes |
| 6 | Lambda data events (production only) | AI pipeline function invocations |
| 7 | Network activity events | VPC endpoint access denials for Bedrock, S3, Lambda |

### Key Detection Patterns

Create CloudWatch metric filters on your CloudTrail log group for near-real-time alerting:

| Detection | Filter Pattern (simplified) | Why It Matters |
|---|---|---|
| Unauthorized Bedrock access | `eventSource=bedrock.amazonaws.com` AND `errorCode=AccessDenied` | Repeated denied calls may indicate credential misuse or agent scope violation |
| Agent invocation tracking | `eventName=InvokeAgent OR InvokeInlineAgent` | Agents chain multiple API calls; unexpected invocations need investigation |
| Guardrail modification | `eventName=UpdateGuardrail OR DeleteGuardrail` | Weakened guardrails before unsafe responses indicate deliberate manipulation |
| Logging disruption | `eventName=StopLogging OR DeleteTrail OR DeleteLogGroup` | Anti-forensic activity must trigger immediate alert |
| Knowledge base access | `eventName=Retrieve OR RetrieveAndGenerate` | Anomalous retrieval may indicate unauthorized data access |
| Model invocation volume | All `InvokeModel`/`Converse` variants | Baseline normal usage and detect spikes indicating runaway agents |

Set CloudWatch Alarms on each metric with SNS notification targets. Use Contributor Insights rules to identify top callers and source IPs.

### Cross-Pipeline Correlation

Correlation across pipelines is where investigations actually happen. Join keys:

| Join | Key Field | Notes |
|---|---|---|
| CloudTrail ↔ Model Invocation Logging | `requestID` = `requestId` | Same API call, different views |
| CloudTrail ↔ ADOT spans | `requestID` = `attributes.aws.request_id` | Same request, identity + performance |
| ADOT spans ↔ Model Invocation Logging | `attributes.aws.request_id` = `requestId` | Latency + content |
| Across agent sessions | `attributes.session.id` | Agent framework sets session ID |

Example investigation questions only correlation can answer:

- **Who asked the model this, and what did it say?** — Join CloudTrail (caller ARN, source IP) with Model Invocation Logging (prompt, response) on `requestId`
- **Did the agent fail due to model, tool, or permission issue?** — Join ADOT spans (component latency/errors) with CloudTrail (AccessDenied events)
- **Was a guardrail weakened before these unsafe responses?** — Join CloudTrail (UpdateGuardrail) with Model Invocation Logging (response content) by timestamp

These queries use OpenSearch SQL in CloudWatch Logs Insights across multiple log groups. Set the query language to SQL when creating dashboard widgets.

### Cost Optimization

Advanced event selectors reduce both cost and log volume:

- **Narrow by ARN** — Scope Bedrock data events to production agent IDs and knowledge base IDs only
- **Write-only for S3** — Log only write operations on AI-specific buckets
- **Filter by IAM identity** — For inline agents, filter to production execution roles
- **Production functions only** — Exclude dev/test Lambda functions from data event capture
- **Event aggregation** — Enable CloudTrail aggregation templates (`API_ACTIVITY`, `RESOURCE_ACCESS`) for 5-minute summaries alongside raw events

### Unified Dashboard

Build a CloudWatch dashboard (`AI-Workload-Security-Dashboard`) combining:

- **Alarm Status Grid** — All metric filter alarms in one view
- **Contributor Insights widgets** — Top model callers, top agent callers, access denied identities, guardrail changes
- **Cross-pipeline query widgets** — Saved correlation queries as Logs Insights SQL widgets
- **Cost widgets** — Token usage and model spend from invocation logs

![AI-Workload-Security-Dashboard](/img/cloudops/recipes/AWS%20CloudTrail/monitoring-and-auditing-genAI/dashboard.png)

Organize by audience: security/audit left, operational monitoring center, cost/FinOps right.

## Related

- [GenAI Workload Observability](../genai-observability/) — Operational monitoring and performance dashboards for Bedrock and SageMaker
- [Coding Agents Observability](../coding-agents-observability/) — Observability patterns specific to coding agent workloads
- [CloudWatch Logs Security](../cloudwatch-logs-security/) — General CloudWatch Logs security patterns and access controls
- [Amazon Bedrock Model Invocation Logging documentation](https://docs.aws.amazon.com/bedrock/latest/userguide/model-invocation-logging.html)
- [AWS CloudTrail User Guide — Logging Bedrock events](https://docs.aws.amazon.com/bedrock/latest/userguide/logging-using-cloudtrail.html)
