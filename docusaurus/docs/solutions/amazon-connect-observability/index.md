---
title: Amazon Connect Observability
sidebar_label: Amazon Connect
---
# Amazon Connect Observability

[Amazon Connect](https://aws.amazon.com/connect/) is an AI-native contact center solution used by thousands of companies to serve millions of customers daily across voice, chat, and digital channels. Effective observability is critical for maintaining service quality, optimizing agent performance, meeting SLA targets, and ensuring cost efficiency.

This guide covers best practices for monitoring Amazon Connect using AWS native observability tools: Amazon CloudWatch, AWS CloudTrail, Amazon EventBridge, Contact Lens, and Contact Trace Records (CTRs).

---

## Overview

Contact centers are real-time, customer-facing systems where degraded performance directly impacts customer experience, agent productivity, and business outcomes. Unlike typical web applications, contact centers must be observed across multiple dimensions:

| Dimension | What to Monitor | Business Impact |
|-----------|----------------|-----------------|
| **Customer Experience** | Wait times, abandonment rates, call quality | Customer satisfaction, retention |
| **Agent Performance** | Handle time, occupancy, after-call work | Operational efficiency, costs |
| **System Health** | Concurrent calls, throttling, errors | Service availability |
| **Quality** | Sentiment, compliance, script adherence | Brand reputation, regulatory risk |
| **Capacity** | Quota utilization, queue sizes | Ability to handle demand spikes |

### Observability Pillars

```
┌──────────────────────────────────────────────────────────────────┐
│                  Amazon Connect Observability                     │
├────────────┬────────────┬────────────┬────────────┬──────────────┤
│  Metrics   │    Logs    │   Events   │  Analytics │   Traces     │
│            │            │            │            │              │
│ CloudWatch │ CloudWatch │ EventBridge│ Contact    │ Contact      │
│ Metrics    │ Logs       │            │ Lens       │ Flow Logs    │
│            │            │            │            │              │
│ Real-time  │ Flow Logs  │ Contact    │ CTRs       │ CloudTrail   │
│ Metrics API│            │ Events     │            │              │
│            │ CloudTrail │ Rule       │ Historical │ X-Ray (for   │
│ Historical │            │ Events     │ Metrics    │ integrations)│
│ Metrics API│            │            │            │              │
└────────────┴────────────┴────────────┴────────────┴──────────────┘
```

### Key Metrics and KPIs

#### Customer-Facing KPIs

| KPI | Definition | Target (Example) | Data Source |
|-----|-----------|-------------------|-------------|
| **Average Speed of Answer (ASA)** | Average time before agent answers | < 30 seconds | Historical Metrics API |
| **Abandonment Rate** | % of contacts disconnected before agent | < 5% | CTRs, Historical Metrics |
| **First Contact Resolution (FCR)** | % resolved without callback/transfer | > 80% | CTRs + Custom Attributes |
| **Customer Sentiment** | Positive/Negative/Neutral sentiment score | Trending positive | Contact Lens |
| **Service Level** | % of contacts answered within threshold | 80% in 20 seconds | Real-time Metrics |

#### Operational KPIs

| KPI | Definition | Target (Example) | Data Source |
|-----|-----------|-------------------|-------------|
| **Average Handle Time (AHT)** | Talk + Hold + After-Call Work time | < 6 minutes | CTRs |
| **Agent Occupancy** | % of time agents are handling contacts | 70–85% | Real-time Metrics |
| **Queue Size** | Number of contacts waiting in queue | < 10 per queue | CloudWatch Metrics |
| **Concurrent Call Utilization** | % of concurrent call quota used | < 80% | CloudWatch Metrics |
| **Contact Flow Error Rate** | Errors per flow execution | < 1% | CloudWatch Metrics |

---

## When to use this

Use this guide when:

- **Setting up a new Amazon Connect instance** — Use the Day 1 checklist in the Guidance section to ensure all observability components are enabled from the start.
- **Diagnosing customer experience degradation** — Use the troubleshooting playbook to quickly isolate whether the root cause is quota exhaustion, routing failure, voice quality, or flow misconfiguration.
- **Building a monitoring strategy for a contact center migration** — Use the reference architecture and dashboard layout to align stakeholders across operations, engineering, and executive audiences.
- **Meeting compliance or regulatory requirements** — Security and compliance monitoring patterns (CloudTrail, recording completeness, data redaction) help demonstrate control coverage.
- **Scaling for planned traffic events** — Quota monitoring and alarm tiering help identify capacity headroom before marketing campaigns, seasonal peaks, or product launches.
- **Operating Amazon Connect alongside AI/ML capabilities** — Voice AI observability (Contact Lens, Amazon Lex, Amazon Bedrock) requires additional instrumentation beyond standard CloudWatch metrics.

---

## Guidance

### CloudWatch Metrics

Amazon Connect automatically publishes metrics to CloudWatch every 1 minute under the `AWS/Connect` namespace. High-resolution (1-minute) data is retained for 15 days, then aggregated to 5-minute resolution for 63 days, 1-hour resolution for 455 days.

Metrics are organized by these dimensions: **Instance**, **Queue**, **Contact Flow**, **Contact**, and **Connection** (voice quality per participant and stream type).

**Critical metric practices:**

1. **Use percentage metrics for quota monitoring** — `ConcurrentCallsPercentage`, `ConcurrentActiveChatsPercentage`, `ConcurrentTasksPercentage`, and `ConcurrentEmailsPercentage` normalize against your configured quota and make alarm thresholds portable across instances.
2. **Use Sum for count-based error metrics** — For `CallsBreachingConcurrencyQuota`, `MissedCalls`, `QueueCapacityExceededError`, always use `Sum` to get the total count in the period.
3. **Use Maximum for concurrent metrics** — For `ConcurrentCalls`, `ConcurrentActiveChats`, `ConcurrentTasks`, use `Maximum` to catch peak utilization.
4. **Monitor `ToInstancePacketLossRate` carefully** — Values range from 0.0–1.0 (0.05 = 5% packet loss). Set the CloudWatch period to 60 seconds. Filter by `Participant` dimension to isolate agent-side vs. customer-side issues.
5. **Note the 5-minute publish interval** for `ConcurrentTasks`, `ConcurrentTasksPercentage`, `ConcurrentEmails`, and `ConcurrentEmailsPercentage`.

### Logging

#### Contact Flow Logs

Contact flow logs capture the execution path of every contact through your flows. Enable flow logging in the instance settings (Data Storage → Contact flow logs). Logs are published to CloudWatch Logs under `/aws/connect/<instance-alias>`.

**Useful CloudWatch Logs Insights queries:**

```sql
-- Find all errors in a specific contact flow
fields @timestamp, @message
| filter @message like /Error/
| filter @message like /your-flow-name/
| sort @timestamp desc
| limit 50
```

```sql
-- Track contacts that hit the error branch
fields @timestamp, ContactId, @message
| filter @message like /TookErrorBranch/
| stats count(*) as errorCount by bin(1h)
```

**Best practices:**
- Enable flow logging in production — overhead is minimal, troubleshooting value is high
- Set CloudWatch Logs retention policies (30–90 days for active troubleshooting). Consider [CloudWatch Logs Intelligent Tiering](https://aws.amazon.com/about-aws/whats-new/2026/07/amazon-cloudwatch-intelligent-tiering/) to optimize cost on infrequently accessed logs.
- Monitor `ContactFlowErrors` and `ContactFlowFatalErrors` — these indicate broken flow logic

#### AWS CloudTrail

CloudTrail logs all Amazon Connect API calls. Key actions to monitor:

| Action Category | API Calls | Why Monitor |
|-----------------|-----------|-------------|
| **Instance changes** | `CreateInstance`, `DeleteInstance`, `UpdateInstanceAttribute` | Security, change management |
| **User management** | `CreateUser`, `DeleteUser`, `UpdateUserSecurityProfiles` | Access control audit |
| **Contact flow** | `CreateContactFlow`, `UpdateContactFlow`, `DeleteContactFlow` | Change management |
| **Phone numbers** | `ClaimPhoneNumber`, `ReleasePhoneNumber` | Capacity planning |
| **Queue/Routing** | `CreateQueue`, `UpdateQueueOutboundCallerConfig` | Routing changes |

Leverage **CloudWatch Unified Data Store (UDS)** to centralize CloudTrail data alongside Connect flow logs for unified querying and correlation.

### Contact Trace Records (CTRs)

CTRs are the definitive record of every contact's journey — capturing queue information, agent information, disconnection details, and custom attributes.

**CTR data pipeline architecture:**

```
Amazon Connect Instance
         │
         ▼
  Kinesis Data Stream ──► Kinesis Data Firehose ──► S3 (Data Lake)
         │                                              │
         ▼                                              ▼
  Lambda (Real-time)                            Athena / QuickSight
  (Custom Metrics)                             (Historical Analytics)
```

**Best practices:**
- Stream CTRs to Kinesis Data Stream for real-time analytics
- Store CTRs in S3 for long-term retention and Athena queries
- Correlate CTRs with Contact Lens output on `ContactId` for full conversational analytics
- Build derived metrics (FCR, transfer rate) from CTR data — not available as native CloudWatch metrics

### EventBridge Integration

Amazon Connect publishes events to the default EventBridge bus. Key event types:

| Event Type | Detail-Type | Use Case |
|-----------|-------------|----------|
| **Contact events** | `Amazon Connect Contact Event` | Track contact lifecycle |
| **Contact Lens** | `Contact Lens Analysis State Change` | Trigger post-call workflows |
| **Rules matched** | `Contact Lens Realtime Rules Matched` | Real-time supervisor alerts |
| **Evaluation failures** | `Contact Lens Automated Evaluation Submission Failed` | Monitor QA automation health |

**Pattern: Real-time alerting on customer sentiment**
```json
{
  "source": ["aws.connect"],
  "detail-type": ["Contact Lens Realtime Rules Matched"],
  "detail": { "actionName": ["ESCALATION_DETECTED"] }
}
```
Route to SNS → supervisor notification or PagerDuty.

### Alerting

#### Tier 1: Critical (page immediately)

| Alarm | Metric | Threshold | Statistic | Why |
|-------|--------|-----------|-----------|-----|
| Calls breaching quota | `CallsBreachingConcurrencyQuota` | > 0, 1 min | Sum | Every count = a real customer turned away |
| Concurrent calls near limit | `ConcurrentCallsPercentage` | > 90%, 5 min | Maximum | At 100%, new calls are rejected |
| Flow fatal errors | `ContactFlowFatalErrors` | > 0, 1 min | Sum | Customer hears dead air or gets disconnected |
| Throttled calls | `ThrottledCalls` | > 0, 1 min | Sum | Calls actively being rejected |

#### Tier 2: Warning (notify operations)

| Alarm | Metric | Threshold | Statistic | Why |
|-------|--------|-----------|-----------|-----|
| Capacity approaching limit | `ConcurrentCallsPercentage` | > 80%, 5 min | Average | Approaching rejection threshold |
| Chat capacity warning | `ConcurrentActiveChatsPercentage` | > 80%, 5 min | Average | Chat queue will grow unbounded |
| Queue growing | `QueueSize` | > 20 contacts, 5 min | Maximum | SLA breach imminent |
| Long wait time | `LongestQueueWaitTime` | > 120 sec, 5 min | Maximum | Longest waiter defines worst CX |
| Recording failures | `CallRecordingUploadError` | > 0, 5 min | Sum | Compliance risk — recordings may be lost |
| Missed calls spike | `MissedCalls` | > 10, 5 min | Sum | Staffing or routing issue |

**Composite alarms** reduce noise:

```
ALARM("HighConcurrentCalls") AND ALARM("LongQueueWaitTime")
  → "Contact Center Under Stress"

ALARM("FlowFatalErrors") AND ALARM("MissedCalls")
  → "Routing Failure Impacting Customers"
```

Use **anomaly detection** for `CallsPerInterval` and `QueueSize` — traffic patterns are cyclical, and static thresholds produce false positives. Integrate Tier 1 alarms with incident management platforms (PagerDuty, OpsGenie, ServiceNow) via SNS for structured on-call escalation.

### Dashboards

Design dashboards for three distinct audiences:

| Dashboard | Audience | Key Metrics |
|-----------|----------|-------------|
| **Executive** | Leadership, business owners | Service level, abandonment rate, CSAT proxy (Contact Lens sentiment), FCR |
| **Operations** | Supervisors, contact center managers | Queue sizes, concurrent utilization, flow errors, agent adherence, missed calls |
| **Engineering** | Platform/DevOps teams | API throttling, Lambda errors, recording failures, packet loss, system metrics |

Use **CloudWatch Dashboard Variables** to filter by queue name, routing profile, or time range. Add annotation lines for deployments, quota changes, and marketing campaigns. Set auto-refresh to 1 minute for operational dashboards.

### Contact Lens Analytics

Contact Lens provides ML-powered conversational analytics: speech-to-text transcription, per-turn sentiment analysis, issue detection, non-talk time detection, sensitive data redaction, and automated agent evaluation.

**Observability uses:**

| Capability | Use Case | Integration |
|-----------|----------|-------------|
| Sentiment scoring | Track CSAT proxy over time | S3 → Athena → QuickSight |
| Category labels | Monitor issue frequency trends | EventBridge rules → Custom metrics |
| Non-talk time | Detect system or flow issues | Historical analytics |
| Compliance rules | Automated QA scoring | EventBridge → alerts |

Enable both real-time and post-call analytics — real-time enables in-call interventions; post-call provides highest accuracy. Stream Contact Lens data to S3 and join with CTRs on `ContactId` for rich analytics.

### Service Quota Monitoring

| Quota | Recommended Alert | Metric |
|-------|------------------|--------|
| Concurrent active calls | > 80% utilization | `ConcurrentCallsPercentage` |
| Concurrent active chats | > 80% utilization | `ConcurrentActiveChatsPercentage` |
| Concurrent active tasks | > 80% utilization | `ConcurrentTasksPercentage` |
| Concurrent active emails | > 80% utilization | `ConcurrentEmailsPercentage` |

Request quota increases at 70–80% sustained utilization — don't wait until 100%. Plan for 2–3x traffic spikes during holidays, marketing events, or product outages. Track API throttling (429 responses) via CloudTrail to identify integrations hitting rate limits.

### Security and Compliance Monitoring

**High-priority CloudTrail events:**

| Event | Risk | Alert Type |
|-------|------|------------|
| `UpdateInstanceAttribute` (storage changes) | Data exfiltration | Critical |
| `CreateUser` with admin security profile | Privilege escalation | Critical |
| `DisassociateInstanceStorageConfig` | Recording/logging disabled | Critical |
| `UpdateUserSecurityProfiles` | Unauthorized access changes | Warning |
| `DeleteContactFlow` | Service disruption | Warning |

For regulated industries, build compliance dashboards tracking: recording completeness (% of contacts with successful recordings), consent management, S3 data retention lifecycle compliance, and Contact Lens evaluation coverage.

### Day 1 Observability Checklist

- [ ] Enable Contact Flow Logging (CloudWatch Logs, `/aws/connect/<instance-alias>`)
- [ ] Enable CTR streaming (Kinesis Data Stream → Kinesis Firehose → S3)
- [ ] Enable Agent Event streaming (Kinesis Data Stream)
- [ ] Configure CloudWatch Dashboard with Tier 1 and Tier 2 alarms
- [ ] Enable CloudTrail for API auditing; create EventBridge rules for critical actions
- [ ] Set up SNS topics for alarm notifications and on-call routing
- [ ] Enable Contact Lens if using conversational analytics
- [ ] Set CloudWatch Logs retention policies (30–90 days or Intelligent Tiering)
- [ ] Document baseline metrics per queue before go-live

### Troubleshooting Playbook

| Symptom | First Check | Second Check | Root Cause Pattern |
|---------|------------|--------------|-------------------|
| Dropped calls | `CallsBreachingConcurrencyQuota` | `ThrottledCalls` | Quota exhaustion |
| Long wait times | `QueueSize` per queue | Agent availability (Real-time Metrics) | Under-staffing |
| Poor call quality | `ToInstancePacketLossRate` | Agent network (by Participant dimension) | Network issues |
| Flow failures | `ContactFlowFatalErrors` | Flow logs (CloudWatch Logs Insights) | Flow misconfiguration |
| Missing recordings | `CallRecordingUploadError` | S3 bucket policy | Permission or storage issue |
| API failures | CloudTrail 4xx/5xx events | Service Quotas console | Rate limit exceeded |

### Reference Architecture

```
                          Amazon Connect Instance
                                  │
            ┌─────────────────────┬┴────────────────────┐
            │                     │                      │
            ▼                     ▼                      ▼
  CloudWatch Metrics       Contact Flow Logs     CTR / Agent Events
  (AWS/Connect)            (CloudWatch Logs)     (Kinesis Data Stream)
            │                     │                      │
            ▼                     ▼                      ▼
  CloudWatch Alarms        Logs Insights         Kinesis Firehose
            │               Queries                      │
            ▼                                            ▼
  SNS → PagerDuty                              Amazon S3 (Data Lake)
                                                         │
            ┌────────────────────────────────────────────┤
            │                    │                       │
            ▼                    ▼                       ▼
       AWS Glue            Amazon Athena         Amazon QuickSight
     (ETL/Catalog)         (Ad-hoc queries)     (Dashboards/Reports)

  Amazon EventBridge ◄── Amazon Connect Contact Events
            │
  ┌─────────┼──────────┐
  ▼         ▼          ▼
Lambda     SNS    CloudWatch Logs
(Enrich) (Alerts) (Event Archive)
```

| Tool | Role |
|------|------|
| **CloudWatch** | Metrics, alarms, dashboards, logs, anomaly detection |
| **EventBridge** | Event-driven automation, routing, integration |
| **X-Ray** | Trace Lambda functions invoked from Connect flows |
| **CloudTrail** | API audit trail, change tracking |
| **Kinesis** | Real-time CTR and agent event streaming |
| **S3 + Athena** | Historical analytics, data lake queries |
| **QuickSight** | Business intelligence dashboards |
| **Contact Lens** | ML-powered conversational analytics and QA |

---

## Related

- [Monitoring your Amazon Connect instance using CloudWatch](https://docs.aws.amazon.com/connect/latest/adminguide/monitoring-cloudwatch.html)
- [EventBridge events emitted by Amazon Connect](https://docs.aws.amazon.com/connect/latest/adminguide/connect-eventbridge-events.html)
- [Amazon Connect service quotas](https://docs.aws.amazon.com/connect/latest/adminguide/amazon-connect-service-limits.html)
- [Contact Lens for Amazon Connect](https://docs.aws.amazon.com/connect/latest/adminguide/analyze-conversations.html)
- [Monitor and trigger alerts using CloudWatch for Amazon Connect](https://aws.amazon.com/blogs/contact-center/monitor-and-trigger-alerts-using-amazon-cloudwatch-for-amazon-connect/)
- [Visualizing Amazon Connect instance metrics with CloudWatch](https://aws.amazon.com/blogs/contact-center/visualizing-amazon-connect-instance-metrics-with-amazon-cloudwatch/)
- [Amazon Connect Administrator Guide — Logging and Monitoring](https://docs.aws.amazon.com/connect/latest/adminguide/logging-and-monitoring.html)
- [CloudWatch Logs Insights query syntax](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html)
