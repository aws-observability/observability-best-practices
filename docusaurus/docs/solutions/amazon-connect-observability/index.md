---
title: Amazon Connect Customer Observability
sidebar_label: Amazon Connect Customer
---

# Amazon Connect Customer Observability

[Amazon Connect Customer](https://aws.amazon.com/connect/) is an AI-native contact center solution used by thousands of companies to serve millions of customers daily across voice, chat, and digital channels. Effective observability is critical for maintaining service quality, optimizing agent performance, meeting SLA targets, and ensuring cost efficiency.

This guide covers best practices for monitoring Amazon Connect using AWS-native observability tools: Amazon CloudWatch, AWS CloudTrail, Amazon EventBridge, Contact Lens, and Contact Trace Records (CTRs).

:::tip Quick-Start: 5 Steps to Production Observability
Complete these five steps to get production-grade observability in under an hour:

1. **Enable Contact Flow Logs** — Navigate to instance settings → enable flow logging. Logs publish to CloudWatch Logs under `/aws/connect/<instance-alias>`.
2. **Set Tier 1 alarms** — `CallsBreachingConcurrencyQuota > 0`, `ContactFlowFatalErrors > 0`, `ThrottledCalls > 0`, `ConcurrentCallsPercentage > 90%`.
3. **Stream CTRs to Kinesis** — Enables real-time analytics, custom metrics, and long-term retention in S3.
4. **Enable Contact Lens** — Turn on real-time + post-call analytics for sentiment, compliance, and automated QA.
5. **Build a CloudWatch dashboard** — Use the reference architecture in the Guidance section to visualize all pillars in one view.
:::

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

| Pillar | Key Services |
|--------|-------------|
| **Metrics** | CloudWatch Metrics, Real-time Metrics API, Historical Metrics API |
| **Logs** | CloudWatch Logs (Flow Logs), CloudTrail |
| **Events** | EventBridge (Contact Events, Rule Events) |
| **Analytics** | Contact Lens, CTRs, Historical Metrics |
| **Traces** | Contact Flow Logs, CloudTrail, X-Ray (for integrations) |

### Key Metrics and KPIs

#### Customer-Facing KPIs

| KPI | Definition | Target (Example) | Data Source |
|-----|-----------|-------------------|-------------|
| **Average Speed of Answer (ASA)** | Average time before agent answers | < 30 seconds | Historical Metrics API |
| **Abandonment Rate** | % of contacts disconnected before agent | < 5% | CTRs, Historical Metrics |
| **First Contact Resolution (FCR)** | % resolved without callback/transfer | > 80% | CTRs + Custom Attributes |
| **Customer Sentiment** | Positive/Negative/Neutral sentiment score | Trending positive | Contact Lens |
| **Service Level** | % of contacts answered within threshold | 80% in 20 seconds | Real-time Metrics |

> **Customer Scenario:** A financial services contact center set a Service Level target of 80% answered within 20 seconds. During a billing system outage, call volume spiked 3x. Because they had a CloudWatch Alarm on Service Level, the ops team was paged within 2 minutes, activated overflow routing, and kept abandonment below 4%.

#### Operational KPIs

| KPI | Definition | Target (Example) | Data Source |
|-----|-----------|-------------------|-------------|
| **Average Handle Time (AHT)** | Talk + Hold + After-Call Work time | < 6 minutes | CTRs |
| **Agent Occupancy** | % of time agents are handling contacts | 70–85% | Real-time Metrics |
| **Queue Size** | Number of contacts waiting in queue | < 10 per queue | CloudWatch Metrics |
| **Concurrent Call Utilization** | % of concurrent call quota used | < 80% | CloudWatch Metrics |
| **Contact Flow Error Rate** | Errors per flow execution | < 1% | CloudWatch Metrics |

#### System Health KPIs

| KPI | Definition | Alert Threshold | Data Source |
|-----|-----------|-----------------|-------------|
| **Throttled Calls** | Calls rejected due to capacity | > 0 | CloudWatch Metrics |
| **Call Recording Upload Errors** | Failed recording uploads | > 0 | CloudWatch Metrics |
| **Misconfigured Phone Numbers** | Calls to unassociated numbers | > 0 | CloudWatch Metrics |
| **Packet Loss Rate** | Voice quality degradation | > 5% | CloudWatch Metrics |
| **API Throttling** | API requests exceeding rate limits | > 0 | CloudTrail + CloudWatch |

> **Customer Scenario (System Health):** A retail customer's agents reported choppy audio on Friday afternoon. Because they had `ToInstancePacketLossRate` alarmed at >5%, the NOC correlated the spike to a regional ISP issue affecting their VPN concentrator, and rerouted agents to direct-connect within 20 minutes.

---

## When to use this

Use this guide when:

- **Setting up a new Amazon Connect instance** — Use the Day 1 checklist in the Guidance section to ensure all observability components are enabled from the start.
- **Diagnosing customer experience degradation** — Use the troubleshooting playbook to quickly isolate whether the root cause is quota exhaustion, routing failure, voice quality, or flow misconfiguration.
- **Building a monitoring strategy for a contact center migration** — Use the reference architecture and dashboard layout to align stakeholders across operations, engineering, and executive audiences.
- **Meeting compliance or regulatory requirements** — Security and compliance monitoring patterns (CloudTrail, recording completeness, data redaction) help demonstrate control coverage.
- **Scaling for planned traffic events** — Quota monitoring and alarm tiering help identify capacity headroom before marketing campaigns, seasonal peaks, or product launches.
- **Operating Amazon Connect alongside AI/ML capabilities** — Voice AI observability (Contact Lens, Amazon Lex, Amazon Bedrock) requires additional instrumentation beyond standard CloudWatch metrics.
- **Running omnichannel contact centers** — Voice, chat, email, and task channels each have distinct metrics, publish intervals, and SLA targets that require channel-specific alarm sets.
- **Multi-instance or multi-region deployments** — Amazon Connect Global Resiliency (ACGR) and CloudWatch Cross-Account Observability require dedicated centralization before a single Omni Space or dashboard can span them.

---

## Guidance

### CloudWatch Metrics

Amazon Connect automatically publishes metrics to CloudWatch every 1 minute under the `AWS/Connect` namespace. High-resolution (1-minute) data is retained for 15 days, then aggregated to 5-minute resolution for 63 days, and 1-hour resolution for 455 days (15 months).

Source: [Monitoring your Amazon Connect instance using CloudWatch](https://docs.aws.amazon.com/connect/latest/adminguide/monitoring-cloudwatch.html)

Metrics are organized by these dimensions:

| Dimension | Metrics Available |
|-----------|-----------------|
| **Instance** | `ConcurrentCalls`, `ConcurrentCallsPercentage`, `ConcurrentActiveChats`, `ConcurrentTasks`, `MissedCalls`, `ThrottledCalls`, `CallsPerInterval`, `CallRecordingUploadError`, `MisconfiguredPhoneNumbers` |
| **Queue** | `QueueSize`, `LongestQueueWaitTime`, `QueueCapacityExceededError`, `CallBackNotDialableNumber` |
| **Contact Flow** | `ContactFlowErrors`, `ContactFlowFatalErrors`, `PublicSigningKeyUsage` |
| **Contact** | `TasksExpiryWarningReached`, `TasksExpired` |
| **Connection** | `ToInstancePacketLossRate` (per Participant, Stream Type) |

**Critical metric practices:**

1. **Use percentage metrics for quota monitoring** — `ConcurrentCallsPercentage`, `ConcurrentActiveChatsPercentage`, `ConcurrentTasksPercentage`, and `ConcurrentEmailsPercentage` normalize against your configured quota and make alarm thresholds portable across instances.

   :::warning Without alarms on `ConcurrentCallsPercentage`, hitting your quota is a silent outage — callers get busy signals with no alert to your team. Monitoring at 80% gives you a 20% buffer to react before customers are impacted. :::

2. **Use Sum for count-based error metrics** — For `CallsBreachingConcurrencyQuota`, `MissedCalls`, `QueueCapacityExceededError`, always use `Sum` to get the total count in the period.
3. **Use Maximum for concurrent metrics** — For `ConcurrentCalls`, `ConcurrentActiveChats`, `ConcurrentTasks`, use `Maximum` to catch peak utilization.
4. **Monitor `ToInstancePacketLossRate` carefully** — Values range from 0.0–1.0 (0.05 = 5% packet loss). Set the CloudWatch period to 60 seconds. Filter by the `Participant` dimension to isolate agent-side vs. customer-side issues.

   :::tip Packet loss above 5% causes audible degradation. Customers won't tell you — they'll hang up and call back, inflating the repeat contact rate. This alarm lets you isolate agent-side vs. customer-side issues and act before it hits CSAT. :::

5. **Note the 5-minute publish interval** for `ConcurrentTasks`, `ConcurrentTasksPercentage`, `ConcurrentEmails`, and `ConcurrentEmailsPercentage` — unlike most Connect metrics that publish every 1 minute.

---

### Logging

:::warning Contact flow logs are your only window into why a customer heard silence, got stuck in a loop, or was routed to the wrong queue. Without them, you're troubleshooting blind — relying on customer complaints to discover flow failures that could have been caught in minutes. :::

#### Contact Flow Logs

Contact flow logs capture the detailed execution path of every contact through your flows. Enable flow logging in the instance settings (Data Storage → Contact flow logs). Logs are published to CloudWatch Logs under `/aws/connect/<instance-alias>`.

**Best practices:**
- Enable flow logging in production — overhead is minimal, troubleshooting value is high.
- Set CloudWatch Logs retention policies (30–90 days for active troubleshooting). Consider [CloudWatch Logs Intelligent Tiering](https://aws.amazon.com/about-aws/whats-new/2026/07/amazon-cloudwatch-intelligent-tiering/) to automatically optimize cost on infrequently accessed logs.
- Monitor `ContactFlowErrors` and `ContactFlowFatalErrors` — these indicate broken flow logic.

> **Customer Scenario:** A healthcare payer discovered that 12% of after-hours calls were silently hitting an error branch due to a misconfigured Lambda timeout. Without flow logging, these failures were invisible. After enabling logs and a `ContactFlowFatalErrors` alarm, the team caught the issue within 5 minutes of deployment.

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
-- Track Lambda invocation failures within flows
fields @timestamp, @message
| filter @message like /InvokeLambdaFunction/
| filter @message like /Error/
| sort @timestamp desc
| limit 20
```

```sql
-- Find contacts that hit the error branch
fields @timestamp, ContactId, @message
| filter @message like /TookErrorBranch/
| stats count(*) as errorCount by bin(1h)
```

#### AWS CloudTrail

CloudTrail logs all Amazon Connect API calls, providing an audit trail for administrative and configuration changes.

| Action Category | API Calls | Why Monitor |
|-----------------|-----------|-------------|
| **Instance changes** | `CreateInstance`, `DeleteInstance`, `UpdateInstanceAttribute` | Security, change management |
| **User management** | `CreateUser`, `DeleteUser`, `UpdateUserSecurityProfiles` | Access control audit |
| **Contact flow** | `CreateContactFlow`, `UpdateContactFlow`, `DeleteContactFlow` | Change management |
| **Phone numbers** | `ClaimPhoneNumber`, `ReleasePhoneNumber` | Capacity planning |
| **Queue/Routing** | `CreateQueue`, `UpdateQueueOutboundCallerConfig`, `CreateRoutingProfile` | Routing changes |

**Best practices:**
- Create EventBridge rules for critical CloudTrail events (e.g., security profile changes, instance deletions).
- Enable CloudTrail Insights to detect unusual API activity patterns.
- Send CloudTrail logs to a centralized account for cross-instance visibility.
- Leverage **CloudWatch Unified Data Store (UDS)** to centralize CloudTrail data alongside Connect flow logs for unified querying and correlation.

> **Customer Scenario (Security):** A government agency detected an unauthorized `CreateUser` API call at 2 AM via a CloudTrail EventBridge rule. The alert triggered their incident response runbook within 3 minutes — the compromised credential was revoked before any contact flows were modified.

---

### Contact Trace Records (CTRs)

CTRs are the definitive record of every contact's journey — capturing contact initiation and channel information, queue entry/exit timestamps, agent information (name, routing profile, hierarchy), disconnection details, and custom attributes set during the flow.

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
- Stream CTRs to Kinesis Data Stream for real-time analytics and custom dashboards.
- Store CTRs in S3 for long-term retention and batch analytics with Athena.
- Build derived metrics from CTR data (e.g., FCR, transfer rate by queue) — not available as native CloudWatch metrics.
- Correlate CTRs with Contact Lens output on `ContactId` for full conversational analytics.

#### Agent Event Stream

The agent event stream provides real-time state changes: login/logout, available/unavailable transitions, contact connected/disconnected, and after-call work start/end. Enable it via Instance settings → Data streaming → Agent events → Kinesis Data Stream. Use it for real-time agent adherence monitoring, custom workforce management integrations, and agent productivity dashboards.

---

### EventBridge Integration

:::warning EventBridge turns your contact center from a system you monitor into a system that reacts. Instead of a human noticing a sentiment spike and manually escalating, the system pages a supervisor in real time. Instead of batch-processing disconnection data overnight, you publish custom metrics as contacts end. It's the difference between reactive and proactive operations. :::

Amazon Connect publishes events to Amazon EventBridge's default event bus. Source: [EventBridge events emitted by Amazon Connect](https://docs.aws.amazon.com/connect/latest/adminguide/connect-eventbridge-events.html)

| Event Type | Detail-Type | Use Case |
|-----------|-------------|----------|
| **Contact events** | `Amazon Connect Contact Event` | Track contact lifecycle (initiated, queued, connected, disconnected) |
| **Contact Lens** | `Contact Lens Analysis State Change` | Trigger workflows after analysis completes |
| **Rules matched** | `Contact Lens Realtime Rules Matched` | Real-time alerts on conversation categories |
| **Evaluation failures** | `Contact Lens Automated Evaluation Submission Failed` | Monitor QA automation health |
| **Screen recording** | Screen recording events | Track recording availability |

**Pattern 1 — Real-time alerting on customer sentiment:**
```json
{
  "source": ["aws.connect"],
  "detail-type": ["Contact Lens Realtime Rules Matched"],
  "detail": {
    "actionName": ["ESCALATION_DETECTED"]
  }
}
```
Route to SNS → supervisor notification.

**Pattern 2 — Contact lifecycle tracking:**
```json
{
  "source": ["aws.connect"],
  "detail-type": ["Amazon Connect Contact Event"],
  "detail": {
    "eventType": ["DISCONNECTED"]
  }
}
```
Route to Lambda → publish custom metrics (e.g., disconnection reasons).

**Pattern 3 — Operational health monitoring:**
```json
{
  "source": ["aws.connect"],
  "detail-type": ["Contact Lens Automated Evaluation Submission Failed"]
}
```
Route to SNS → operations team alert.

**Best practices:**
- Use specific event patterns — filter early in EventBridge rather than processing all events in targets.
- Create a custom event bus for transformed/enriched events to separate from the default bus.
- Send contact events to CloudWatch Logs for a queryable contact lifecycle history.
- Use EventBridge archive and replay for event debugging and reprocessing.

> **Customer Scenario:** A telecom provider used real-time sentiment alerting to page supervisors when Contact Lens detected escalation language during VIP calls. Within the first week, supervisors intervened on 3 calls that would have resulted in churn, saving an estimated $180K in annual contract value.

---

### Contact Lens Analytics

:::warning Without Contact Lens, your QA team samples 2–5% of calls and hopes they catch problems. With it, every interaction is analyzed for sentiment, compliance, and script adherence — turning quality management from a sampling exercise into 100% coverage. You find systemic issues in days instead of months. :::

Contact Lens provides ML-powered conversational analytics: speech-to-text transcription (real-time and post-call), per-turn sentiment analysis, issue detection and categorization, non-talk time detection, sensitive data redaction, and automated agent evaluation.

| Capability | Observability Value | Integration |
|-----------|---------------------|-------------|
| **Sentiment scoring** | Track CSAT proxy over time | S3 → Athena → QuickSight |
| **Category labels** | Monitor issue frequency trends | EventBridge rules → Custom metrics |
| **Non-talk time** | Detect system or flow issues | Historical analytics |
| **Compliance rules** | Automated QA scoring | EventBridge → alerts |
| **Talk speed/interruptions** | Agent coaching signals | Contact Lens dashboard |

**Best practices:**
- Enable both real-time and post-call analytics — real-time enables in-call interventions; post-call provides highest accuracy.
- Create Contact Lens rules for automated categorization and EventBridge integration.
- Stream Contact Lens data to your data lake — combine CTRs + Contact Lens output in S3 for rich Athena analytics.
- Monitor Contact Lens rule match rates — sudden changes may indicate flow or training issues.
- Use redaction for PCI/PII compliance observability.

> **Customer Scenario:** A large insurance carrier used Contact Lens category rules to detect when agents failed to read the mandatory compliance disclosure. With 100% evaluation coverage, they identified a 23% non-compliance rate on a new product line — a regulatory risk that would have gone undetected for months under the old 2% manual sampling approach.

---

### Alerting and Alarms

:::warning Alarms are the difference between "we noticed something was wrong after 200 customers complained" and "we caught it in 60 seconds and fixed it before anyone noticed." A well-configured alarm hierarchy (Critical → Warning → Informational) ensures the right people are paged at the right urgency — no alert fatigue, no missed outages. :::

#### Tier 1: Critical (page immediately)

These alarms indicate active customer impact — contacts are being lost or the system is failing. Immediate human intervention is required.

| Alarm | Metric | Threshold | Period | Statistic | Why |
|-------|--------|-----------|--------|-----------|-----|
| Calls breaching quota | `CallsBreachingConcurrencyQuota` | > 0 | 1 min | Sum | Every count = a real customer turned away |
| Concurrent calls near limit | `ConcurrentCallsPercentage` | > 90% | 5 min | Maximum | At 100%, new calls are rejected |
| Flow fatal errors | `ContactFlowFatalErrors` | > 0 | 1 min | Sum | Customer hears dead air or gets disconnected |
| Throttled calls | `ThrottledCalls` | > 0 | 1 min | Sum | Calls actively being rejected by the system |

#### Tier 2: Warning (notify operations)

These alarms indicate degrading conditions that will likely impact customers if not addressed.

| Alarm | Metric | Threshold | Period | Statistic | Why |
|-------|--------|-----------|--------|-----------|-----|
| Capacity approaching limit | `ConcurrentCallsPercentage` | > 80% | 5 min | Average | Approaching rejection threshold |
| Chat capacity warning | `ConcurrentActiveChatsPercentage` | > 80% | 5 min | Average | Chat customers will be queued indefinitely |
| Queue growing | `QueueSize` | > 20 contacts | 5 min | Maximum | SLA breach imminent |
| Long wait time | `LongestQueueWaitTime` | > 120 sec | 5 min | Maximum | SLA breach imminent |
| Recording failures | `CallRecordingUploadError` | > 0 | 5 min | Sum | Compliance risk |
| Missed calls spike | `MissedCalls` | > 10 | 5 min | Sum | Agents not answering |

#### Tier 3: Informational (track/dashboard)

| Alarm | Metric | Threshold | Period | Statistic |
|-------|--------|-----------|--------|-----------|
| Calls per interval | `CallsPerInterval` | > baseline + 2σ | 5 min | Sum |
| Queue capacity exceeded | `QueueCapacityExceededError` | > 0 | 5 min | Sum |
| Voice quality degradation | `ToInstancePacketLossRate` | > 0.03 | 5 min | Average |
| Flow errors | `ContactFlowErrors` | > 5 | 5 min | Sum |

#### Composite Alarms

Use CloudWatch Composite Alarms to reduce alert noise:

```
ALARM("HighConcurrentCalls") AND ALARM("LongQueueWaitTime")
  → "Contact Center Under Stress"

ALARM("FlowFatalErrors") AND ALARM("MissedCalls")
  → "Routing Failure Impacting Customers"
```

**Best practices:**
- Use anomaly detection for `CallsPerInterval` and `QueueSize` — traffic patterns are cyclical; static thresholds create false positives.
- Set evaluation periods ≥ 3 datapoints for non-critical alarms to avoid false alerts from transient spikes.
- Create per-queue alarms for high-priority queues (e.g., VIP, emergency).
- Integrate with incident management — route Tier 1 alarms via SNS to PagerDuty, OpsGenie, or ServiceNow for structured on-call escalation.

---

### Dashboards

Design your CloudWatch dashboard in logical sections for Capacity & Quota, Voice Quality, Queue Health, Contact Flow Health, Agent Metrics, and System Errors. Create separate dashboards for three audiences:

| Dashboard | Audience | Key Metrics |
|-----------|----------|-------------|
| **Executive** | Leadership, business owners | Service level, abandonment rate, CSAT proxy (Contact Lens sentiment), FCR |
| **Operations** | Supervisors, contact center managers | Queue sizes, concurrent utilization, flow errors, agent adherence, missed calls |
| **Engineering** | Platform/DevOps teams | API throttling, Lambda errors, recording failures, packet loss, system metrics |

**Best practices:**
- Use CloudWatch Dashboard Variables to filter by queue name, routing profile, or time range.
- Add annotation lines for known events (deployments, quota changes, marketing campaigns).
- Set auto-refresh to 1 minute for operational dashboards.
- Consider [CloudWatch Cross-Account Observability](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Unified-Cross-Account.html) if you run multiple Connect instances across accounts.

---

### Service Quota Monitoring

Amazon Connect has critical service quotas that impact availability when reached. Source: [Amazon Connect service quotas](https://docs.aws.amazon.com/connect/latest/adminguide/amazon-connect-service-limits.html)

| Quota | Default | CloudWatch Metric | Recommended Alert |
|-------|---------|------------------|------------------|
| Concurrent active calls per instance | Varies | `ConcurrentCallsPercentage` | > 80% |
| Concurrent active chats per instance | 2,500 | `ConcurrentActiveChatsPercentage` | > 80% |
| Concurrent active tasks per instance | 2,500 | `ConcurrentTasksPercentage` | > 80% |
| Concurrent active emails per instance | Varies | `ConcurrentEmailsPercentage` | > 80% |

#### API Throttling Quotas

:::note API throttling limits may change. Always verify current values in the [Amazon Connect API throttling quotas documentation](https://docs.aws.amazon.com/connect/latest/adminguide/amazon-connect-service-limits.html). :::

| API | Rate Limit | Burst Limit |
|-----|-----------|-------------|
| Default (most APIs) | 2/sec | 5/sec |
| `GetMetricDataV2` | 10/sec | 10/sec |
| `GetCurrentMetricData` | 5/sec | 8/sec |
| `GetContactAttributes` | 10/sec | 15/sec |
| `UpdateContactAttributes` | 10/sec | 15/sec |
| `SearchContacts` | 0.5/sec | 1/sec |

:::warning Throttling quotas are shared per account per Region — not per user or per instance. :::

**Best practices:**
- Request quota increases proactively at 70–80% sustained utilization — don't wait until 100%.
- Use the CloudWatch Service Quotas integration to create alarms directly from the Service Quotas console.
- Monitor `CallsBreachingConcurrencyQuota` — any non-zero value means you're losing contacts.
- Plan for seasonality — contact centers often see 2–3x spikes during holidays, marketing events, or outages.
- Track API throttling via CloudTrail by filtering for 429 responses to identify integrations hitting limits.

---

### Cost Observability

:::warning Amazon Connect is pay-per-use, which means misconfigurations don't just waste resources — they directly inflate your bill. A stuck outbound campaign, an IVR loop that keeps customers connected longer than needed, or unused DID numbers all cost real money. Cost observability helps you find these leaks before your finance team does. :::

| Cost Component | What Drives It | How to Monitor |
|---------------|---------------|----------------|
| Per-minute voice | Call duration, concurrent calls | CTRs → Athena → minutes by queue/flow |
| Per-message chat | Chat messages sent | CTRs with `Channel = CHAT` |
| Phone number claims | Toll-free vs. DID numbers | API: `ListPhoneNumbers` |
| Contact Lens | Minutes analyzed | CTRs with Contact Lens enabled |
| Outbound campaigns | Dial attempts | `ConcurrentHighVolumeCallsPerInterval` |
| Tasks | Tasks created | `ConcurrentTasks` |

**Best practices:**
- Tag Connect instances and associated resources using Cost Allocation Tags.
- Correlate `CallsPerInterval` with billing to spot traffic-to-cost anomalies.
- Track Contact Lens adoption — ensure you're getting value from analyzed minutes.
- Identify abandoned calls — calls that enter the system but don't reach agents still cost money.
- Optimize IVR self-service — track containment rate (calls resolved in flow without agent) as a cost efficiency metric.

> **Customer Scenario:** A SaaS company noticed their monthly Connect bill jumped 40% with no call volume increase. By correlating `ConcurrentCallsPerInterval` with CUR data, they found a misconfigured outbound campaign retrying failed dials every 60 seconds — thousands of billable attempts to disconnected numbers. Fixing it saved $12K/month.

---

### Security and Compliance Monitoring

#### High-priority CloudTrail events

| Event | Risk | Alert Type |
|-------|------|------------|
| `UpdateInstanceAttribute` (storage changes) | Data exfiltration | Critical |
| `CreateUser` with admin security profile | Privilege escalation | Critical |
| `DisassociateInstanceStorageConfig` | Recording/logging disabled | Critical |
| `UpdateUserSecurityProfiles` | Unauthorized access changes | Warning |
| `AssociateApprovedOrigin` | CORS policy changes | Warning |
| `DeleteContactFlow` | Service disruption | Warning |

#### Data protection observability

- Monitor call recording upload success — `CallRecordingUploadError > 0` means recordings may be lost.
- Enable Contact Lens redaction — verify PII/PCI data is being redacted in transcripts.
- Monitor S3 bucket access for CTR and recording storage using S3 Access Logs and CloudTrail.
- Track encryption status — ensure recordings and CTRs are encrypted at rest.

#### Compliance dashboards

For regulated industries, build compliance-specific views tracking:
- **Recording completeness** — % of contacts with successful recordings.
- **Consent management** — contacts where recording was explicitly stopped.
- **Data retention** — S3 lifecycle policy compliance for recordings and CTRs.
- **Agent evaluation coverage** — % of contacts evaluated by Contact Lens or supervisors.

---

### Omnichannel (Chat, Email, and Task) Observability

Amazon Connect is omnichannel — voice, chat, email, and tasks each have unique performance characteristics, metrics, and failure modes. Voice-centric monitoring misses channel-specific issues.

Source: [Monitoring your Amazon Connect instance using CloudWatch](https://docs.aws.amazon.com/connect/latest/adminguide/monitoring-cloudwatch.html)

#### Channel-specific CloudWatch metrics

| Channel | Key Metrics | MetricGroup | Publish Interval |
|---------|-------------|-------------|------------------|
| **Voice** | `ConcurrentCalls`, `ConcurrentCallsPercentage`, `CallsBreachingConcurrencyQuota`, `MissedCalls`, `ThrottledCalls` | VoiceCalls | 1 min |
| **Chat** | `ConcurrentActiveChats`, `ConcurrentActiveChatsPercentage`, `ChatsBreachingActiveChatQuota`, `SuccessfulChatsPerInterval` | Chats | 1 min |
| **Tasks** | `ConcurrentTasks`, `ConcurrentTasksPercentage`, `TasksExpiryWarningReached`, `TasksExpired` | Tasks | 5 min |
| **Email** | `ConcurrentEmails`, `ConcurrentEmailsPercentage` | Emails | 5 min |

**Channel-specific patterns:**

- **Chat:** `ConcurrentActiveChatsPercentage` counts ALL active chats (in flow, queued, with agent, in ACW) — not just those connected to agents. Track bot-to-agent handoff timing using EventBridge contact event timestamps.
- **Email:** The 5-minute publish interval means spike detection is slower — supplement with EventBridge contact events for faster detection. Email SLAs (e.g., 4-hour response) differ significantly from voice/chat.
- **Tasks:** `TasksExpiryWarningReached` fires 5 minutes before expiry — your last-chance alert. `TasksExpired` means work items were lost; investigate task routing or agent capacity.

**Best practices:**
- Create per-channel alarm sets — voice, chat, email, and tasks each need their own capacity and health alarms with appropriate thresholds.
- Account for different publish intervals — tasks and emails publish every 5 minutes; don't expect 1-minute granularity.
- Monitor channel-specific SLAs separately: Voice: 30-second answer time; Chat: 60-second response; Email: 4-hour response; Task: before expiry.
- Track cross-channel escalation patterns — chat-to-voice transfers and email-to-callback conversions indicate self-service failures.

**Omnichannel journey correlation (Athena):**

```sql
-- Find contacts that traversed multiple channels
SELECT
    initialcontactid,
    channel,
    initiationmethod,
    connectedtoagenttimestamp,
    disconnecttimestamp,
    disconnectreason
FROM connect_ctrs
WHERE initialcontactid IN (
    SELECT initialcontactid
    FROM connect_ctrs
    GROUP BY initialcontactid
    HAVING COUNT(DISTINCT channel) > 1
)
ORDER BY initialcontactid, initiationtimestamp;
```

---

### IVR and Bot Self-Service Observability

IVR/bot self-service is the first line of defense for contact volume management. Poor containment rates drive higher agent demand and cost. Source: [Amazon Connect bot metrics and analytics](https://docs.aws.amazon.com/connect/latest/adminguide/bot-metrics.html)

#### Key self-service metrics (via GetMetricDataV2)

| Metric | API Identifier | What It Measures |
|--------|---------------|-----------------|
| Bot conversations completed | `BOT_CONVERSATIONS_COMPLETED` | Total completed bot interactions |
| Avg bot conversation time | `AVG_BOT_CONVERSATION_TIME` | Duration customers spend in self-service |
| Avg bot conversation turns | `AVG_BOT_CONVERSATION_TURNS` | Interaction complexity |
| % conversations by outcome | `PERCENT_BOT_CONVERSATIONS_OUTCOME` | SUCCESS vs. FAILED vs. DROPPED breakdown |
| Bot intents completed | `BOT_INTENTS_COMPLETED` | Successful intent fulfillments |
| % intents by outcome | `PERCENT_BOT_INTENTS_OUTCOME` | SUCCESS/FAILED/SWITCHED/DROPPED per intent |

:::note Bot metrics data is available starting from December 2, 2024. Filter by `BOT_CONVERSATION_OUTCOME_TYPE` (SUCCESS, FAILED, DROPPED) for granular analysis. :::

#### IVR health signals

| Signal | What It Indicates | How to Detect |
|--------|------------------|--------------|
| High FAILED conversation rate | Bot can't understand customers or fulfill intents | `PERCENT_BOT_CONVERSATIONS_OUTCOME` with FAILED filter > 20% |
| High DROPPED rate | Customers abandoning mid-IVR | `PERCENT_BOT_CONVERSATIONS_OUTCOME` with DROPPED filter trending up |
| Rising avg turns | IVR is confusing | `AVG_BOT_CONVERSATION_TURNS` increasing vs. baseline |
| Sudden containment drop | Self-service broken, driving unexpected agent load | Containment rate < target (e.g., < 40%) |

**Best practices:**
- Track containment rate as a cost metric — every contact contained in self-service saves $3–8 vs. agent-handled.
- Monitor per-intent success rates — balance inquiry intents should have > 90% success; complex dispute intents may be lower.
- Correlate bot failures with downstream queue load — a bot outage immediately manifests as queue spikes.
- Use Contact Lens rules to detect "I already told the bot this" sentiment — it indicates poor bot-to-agent context handoff.

---

### Voice AI Observability

Organizations increasingly use Amazon Lex bots, Bedrock-powered agents, and Contact Lens AI within Connect. These AI components introduce new failure modes — hallucinations, latency, low transcription accuracy — that require dedicated monitoring.

| AI Component | What to Monitor | AWS Service |
|-------------|----------------|-------------|
| **Amazon Lex (IVR bots)** | Intent recognition accuracy, fallback rate, session duration, slot filling success | CloudWatch Metrics (`AWS/Lex`) |
| **Amazon Bedrock (generative agents)** | Invocation latency, throttling, token usage, model errors | CloudWatch Metrics (`AWS/Bedrock`) |
| **Amazon Transcribe (real-time)** | Transcription accuracy, partial result latency, language detection | CloudWatch Metrics + Contact Lens |
| **Contact Lens AI** | Sentiment accuracy, category match rates, rule triggering | EventBridge + Contact Lens dashboard |
| **Custom Lambda AI** | Cold start latency, timeout rate, error rate | CloudWatch (`AWS/Lambda`) + X-Ray |

#### Key metrics for voice AI

| Metric | Source | Alert Threshold |
|--------|--------|----------------|
| `MissedUtteranceCount` | CloudWatch `AWS/Lex` | > 20% of total utterances |
| `RuntimeSuccessfulRequestLatency` | CloudWatch `AWS/Lex` | p99 > 3 seconds |
| `InvocationLatency` | CloudWatch `AWS/Bedrock` | p95 > 5 seconds |
| `ThrottledCount` | CloudWatch `AWS/Bedrock` | > 0 |
| Lambda timeout rate (AI functions) | CloudWatch `AWS/Lambda` | > 2% |
| Contact Lens category match rate change | Custom metric from EventBridge | > 20% deviation from baseline |

**Voice AI dashboard sections:**
- **Bot Performance** — Containment rate, fallback %, avg session duration, top unrecognized utterances.
- **AI Latency** — Lex response time, Bedrock invocation time, end-to-end AI response time.
- **Transcription Quality** — Contact Lens confidence scores, language detection accuracy.
- **AI → Human Handoff** — Escalation rate, customer sentiment at handoff point, post-handoff handle time.
- **Cost per AI Interaction** — Bedrock token costs, Lex request costs, Transcribe minutes.

---

### Integration Monitoring

Most Amazon Connect deployments integrate with CRMs (Salesforce, ServiceNow), workforce management tools, custom backends via Lambda, and external APIs. These integrations introduce failure modes invisible to native Connect metrics.

| Integration Type | What to Monitor | AWS Service | Alert Condition |
|-----------------|----------------|-------------|----------------|
| **Lambda (invoked from flows)** | Duration, errors, throttles, cold starts | CloudWatch `AWS/Lambda` + X-Ray | Error rate > 2% or p99 > 3s |
| **External API calls (from Lambda)** | Response time, HTTP errors, timeouts | X-Ray subsegments + custom metrics | p95 latency > 2s or 5xx rate > 1% |
| **CRM screen-pop (agent-facing)** | Pop latency, failure rate | CloudWatch RUM (CCP) + custom metrics | Latency > 3s or failure > 5% |
| **Data sync (Connect ↔ CRM)** | Sync lag, record mismatches, failures | Custom CloudWatch metrics + EventBridge | Sync delay > 5 min or failure count > 0 |
| **Kinesis (CTR/Agent stream)** | Iterator age, read throughput, put failures | CloudWatch `AWS/Kinesis` | `IteratorAgeMilliseconds` > 60000 |

#### Lambda in the critical path

Lambda functions invoked from contact flows are in the critical path of customer experience — a timeout or error means the customer hears silence or gets routed incorrectly.

| Metric | Recommended Alarm | Why |
|--------|------------------|-----|
| Errors (Sum) | > 0 per minute | Any Lambda error = customer impact |
| Duration (p99) | > 3000ms | Connect Lambda timeout is 8 seconds; > 3s indicates degradation risk |
| Throttles (Sum) | > 0 | Throttled = flow error = customer hears error path |
| ConcurrentExecutions | > 80% of reserved concurrency | Approaching throttle point |

:::tip Set Lambda timeout < 8 seconds. Connect's Lambda invoke block has an 8-second hard timeout; set your function timeout to 6–7s so you get CloudWatch Duration metrics showing the issue before Connect force-kills it. :::

#### X-Ray for end-to-end tracing

Enable X-Ray on all Lambda functions invoked from Connect flows. This gives end-to-end visibility from contact flow through to external dependencies:

```
Contact enters flow
    │
    ▼
Invoke Lambda (X-Ray: Connect → Lambda segment)
    │
    ├── DynamoDB query (X-Ray: Lambda → DynamoDB subsegment)
    ├── External CRM API call (X-Ray: Lambda → HTTP subsegment)
    │   └── Salesforce REST API (200ms latency tracked)
    └── Return attributes to flow

X-Ray Trace shows:
├── Total: 1.2s
├── Lambda execution: 800ms
│   ├── DynamoDB: 50ms
│   └── Salesforce API: 650ms  ← bottleneck identified
└── Connect overhead: 400ms
```

**Additional integration best practices:**
- Monitor CRM screen-pop latency via CloudWatch RUM embedded in the CCP.
- Track Kinesis stream health — `GetRecords.IteratorAgeMilliseconds` > 60s means your real-time analytics pipeline is falling behind.
- Create an "Integration Health" composite alarm combining Lambda errors + external API latency + Kinesis iterator age.

---

### Multi-Instance and Multi-Region Observability

Organizations with multiple Amazon Connect instances need centralized visibility. Multi-region deployments using Amazon Connect Global Resiliency (ACGR) add complexity around traffic distribution and failover monitoring.

Sources: [Set up Connect Global Resiliency](https://docs.aws.amazon.com/connect/latest/adminguide/setup-connect-global-resiliency.html) | [CloudWatch cross-account observability](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Unified-Cross-Account.html)

| Capability | AWS Service | How |
|-----------|------------|-----|
| **Centralized metrics across instances/accounts** | CloudWatch Cross-Account Observability | Configure monitoring account as sink; source accounts link and share `AWS/Connect` namespace |
| **Unified log querying** | CloudWatch Logs cross-account | Share Connect flow log groups from source accounts to monitoring account |
| **Traffic distribution monitoring (ACGR)** | CloudWatch + custom metrics | Monitor traffic split percentages via `DescribeTrafficDistributionGroup` API |
| **Failover detection** | CloudWatch Alarms + EventBridge | Alarm on capacity spike in secondary region coinciding with drop in primary |

**ACGR region pairs:**
- US East (N. Virginia) ↔ US West (Oregon)
- Europe (Frankfurt) ↔ Europe (London)
- Asia Pacific (Tokyo) ↔ Asia Pacific (Osaka)

Traffic can be distributed in 10% increments between linked instances. ACGR is the only AWS-supported multi-region resiliency solution — custom-built alternatives are not supported and may impact SLA coverage.

**Best practices:**
- Use CloudWatch Cross-Account Observability — configure one monitoring account as the sink; each Connect instance's account becomes a source sharing the `AWS/Connect` namespace.
- Share only `AWS/Connect`, `AWS/Lex`, and custom namespaces rather than all metrics.
- Build composite alarms across instances: "Primary region healthy AND secondary idle" vs. "Primary degraded AND secondary absorbing traffic."
- Monitor traffic distribution — poll `DescribeTrafficDistributionGroup` on a schedule and publish the distribution percentages as custom CloudWatch metrics.
- Standardize dimension values (instance alias, environment tag) so dashboard variables filter cleanly across instances.

---

### Outbound Campaign Observability

Outbound campaigns operate at high volume with unique failure modes: answering machine detection accuracy, compliance violations (TCPA, quiet time), and multi-channel delivery tracking.

Source: [Outbound campaign metrics](https://docs.aws.amazon.com/connect/latest/adminguide/outbound-campaign-metrics.html)

| Metric | Description | MetricGroup |
|--------|-------------|-------------|
| `ConcurrentHighVolumeCalls` | Concurrent outbound campaign calls | VoiceCalls |
| `ConcurrentHighVolumeCallsPerInterval` | Outbound campaign calls placed per second | VoiceCalls |
| `ConcurrentHighVolumeCallsPercentage` | % of outbound campaign call quota used | VoiceCalls |

#### Compliance monitoring

| Compliance Concern | How to Monitor | AWS Service |
|-------------------|---------------|-------------|
| TCPA violations (calling outside hours) | Do-not-call list + quiet time controls (native to Connect) | Campaign configuration + CloudTrail audit |
| Abandoned call rate > 3% (regulatory limit) | Campaign contacts abandoned after 2s / Human answered | `GetMetricDataV2` → Custom alarm |
| Maximum call attempts exceeded | Campaign attempt tracking per contact | Outbound campaigns dashboard |
| Do-not-call list adherence | CloudTrail audit of list uploads | CloudTrail + EventBridge |

**Best practices:**
- Monitor abandoned call rate against regulatory limits — US TCPA requires < 3% abandoned rate; set alarms at 2% for early warning.
- Track answering machine detection accuracy — high false-positive rate (human classified as machine) means lost opportunities.
- Correlate dial rate with agent availability — predictive dialer should adjust pacing based on available agents.
- Audit compliance controls via CloudTrail — track changes to do-not-call lists, quiet time configurations, and maximum attempt settings.

---

### Disaster Recovery and High Availability Monitoring

Each Amazon Connect instance operates across a minimum of 3 Availability Zones in an active-active-active configuration. AZ failure causes automatic node rotation without customer impact. For multi-region resilience, ACGR is the officially supported failover mechanism.

Sources: [Resilience in Amazon Connect](https://docs.aws.amazon.com/connect/latest/adminguide/disaster-recovery-resiliency.html) | [Set up Connect Global Resiliency](https://docs.aws.amazon.com/connect/latest/adminguide/setup-connect-global-resiliency.html)

| What to Monitor | How | Alert Condition |
|----------------|-----|----------------|
| Primary region health | `ConcurrentCallsPercentage` + `ContactFlowFatalErrors` in primary | Sudden drop in calls with rising errors |
| Secondary region readiness | Periodic synthetic calls to secondary instance | Synthetic call fails or latency > threshold |
| Traffic distribution state | Custom metric from `DescribeTrafficDistributionGroup` | Unplanned distribution change detected |
| CTR replication lag | Compare CTR timestamps in S3 between regions | Lag > 5 minutes |
| Configuration drift | CloudTrail: compare `UpdateContactFlow` events across regions | Flow version mismatch between instances |

**Best practices:**
- Run failover drills — use ACGR's traffic distribution API to shift 10% of traffic to secondary during low-volume periods.
- Monitor both regions continuously — even when traffic is 100/0, the secondary instance must be healthy and ready.
- Create a composite "Failover Required" alarm combining primary region health signals into a single decision point.
- Track failover RTO/RPO — measure time from decision to full traffic shift, and CTR data replication lag.

---

### Observability in Amazon CloudWatch Omni

Amazon CloudWatch Omni is an AI-powered observability experience built on top of Amazon CloudWatch. It is reached through a dedicated URL for your organization (set up from the CloudWatch console via Domain, then Space) and is accessible outside the AWS Management Console. Omni does not replace CloudWatch and does not require re-instrumentation — telemetry you already send to CloudWatch appears in Omni, and your existing console pages, metrics, alarms, dashboards, and Logs Insights queries keep working unchanged.

Source: [Amazon CloudWatch Omni](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch-omni.html)

For an Amazon Connect contact center that already follows this guide (CloudWatch metrics, contact flow logs, CTR/agent-event streams), Omni adds:
- **Natural-language querying** — ask a question in plain language; Omni writes the query in SQL (over logs) or PromQL (over metrics).
- **Cross-signal query and correlation** of logs and metrics in one place via a CloudWatch Dataset.
- **AI-assisted investigation** — when an alert fires, start a root-cause investigation with the AWS DevOps Agent.
- **Alerting** to Slack or any Amazon SNS destination.

#### How Connect telemetry reaches Omni

Omni reads what CloudWatch has already ingested — it is not a separate ingestion pipeline. Three concepts govern this:

- **Domain** — your organization's sign-in entry point (one per organization).
- **Space** — where you work; maps to exactly one account and one Region.
- **CloudWatch Dataset** — makes your logs and traces queryable and correlated. Creating a Space automatically creates the Dataset integration and its execution role.

Metrics are **not** forwarded to the Dataset — Omni queries them directly from CloudWatch Metrics, so `AWS/Connect` metrics are available via PromQL with no extra setup.

#### Three conditions for Connect logs to forward

Contact flow logs are ordinary CloudWatch log groups (`/aws/connect/<instance-alias>`), so they forward into the Omni Dataset when all three conditions below are met:

1. **Same account and Region** — the Omni Space must be in the same account and Region as the Connect log group.
2. **Execution role coverage** — the integration's execution role needs `logs:IntegrateWithDataset` on the log group. The default resource (`log-group:*`) covers every log group in the account.
3. **STANDARD (or Infrequent Access) log class** — log groups in the `DELIVERY` log class do not forward. Verify with:

```bash
aws logs describe-log-groups \
  --log-group-name-prefix /aws/connect \
  --region <region> \
  --query "logGroups[].{name:logGroupName,class:logGroupClass}"
```

If `logGroupClass` is `STANDARD` or `INFREQUENT_ACCESS`, the group forwards and is queryable in Omni. If it is `DELIVERY`, it will not forward.

#### Multiple instances or accounts — centralize first

Omni does not aggregate telemetry across accounts or Regions on its own — centralization stays with CloudWatch. If you run multiple Connect instances:

- Use **CloudWatch Logs centralization rules** (AWS Organizations) to replicate log groups into one destination account and filter for `/aws/connect/*`.
- Use **CloudWatch cross-account observability (OAM)** to query log groups, metrics, and traces in-place from a monitoring account, within a Region.

Enable the Omni Space in the destination or monitoring account and Region where the centralized data lands.

#### What you can do with Connect data in Omni

- Query contact flow logs in natural language or SQL — find contacts that hit an error branch, isolate a misconfigured Lambda step, or count fatal flow errors by hour.
- Query `AWS/Connect` metrics with PromQL — concurrency percentages, queue size, packet loss, missed calls.
- Correlate logs and metrics on one surface, and route alerts to Slack or Amazon SNS.

:::note Omni's automatic service discovery, application map, and RED metrics (request rate, errors, duration) are built around OpenTelemetry traces. Amazon Connect emits flow logs and metrics rather than OTel spans, so Connect telemetry is queryable and correlatable in Omni, but Connect will not automatically appear as a mapped "service" with RED metrics the way an OTel-instrumented application does. Position Omni for Connect as an AI query, correlation, and alerting layer over your existing Connect logs and metrics — not as auto-instrumented application tracing. :::

> **Customer Scenario (Omni):** An ops lead saw `ContactFlowFatalErrors` spike at 2 PM. Instead of writing a Logs Insights query, they asked Omni in plain language why fatal flow errors spiked. Omni matched the error pattern to a contact flow deployment four minutes earlier and showed the failing Lambda branch — cutting triage from about 30 minutes to under 5.

#### Omni validation checklist

- [ ] Contact flow logs enabled and publishing to `/aws/connect/<alias>`.
- [ ] Log class is `STANDARD` or `INFREQUENT_ACCESS` (not `DELIVERY`).
- [ ] Omni Space enabled in the same account + Region (or destination account, if centralized).
- [ ] Dataset integration execution role covers the Connect log group.
- [ ] Confirmed Connect logs are queryable in the Space, and `AWS/Connect` metrics are queryable via PromQL (queried directly from CloudWatch Metrics, not the Dataset).

#### Example queries

**Logs (SQL) — contacts that hit an error branch in the last hour:**
```sql
SELECT ContactId, @timestamp, @message
FROM logs
WHERE @message LIKE '%TookErrorBranch%'
ORDER BY @timestamp DESC
LIMIT 50
```

**Metrics (PromQL) — concurrent calls as a percentage of quota:**
```promql
max_over_time(ConcurrentCallsPercentage[5m])
```

---

### Operational Playbooks

:::warning AWS Systems Manager Incident Manager is no longer available for new customers. The patterns below use Systems Manager OpsCenter and Automation runbooks for incident tracking and response. For ticketing and escalation, integrate with your existing tools (Jira, ServiceNow, PagerDuty, OpsGenie) via SNS/EventBridge. :::

| Runbook | Trigger | Automated Actions |
|---------|---------|------------------|
| **High Queue Wait Time** | `LongestQueueWaitTime` > 120s | 1. Check agent availability  2. Check for flow errors  3. Notify WFM team  4. Log OpsItem |
| **Voice Quality Degradation** | `ToInstancePacketLossRate` > 0.05 | 1. Identify affected agents  2. Check regional health (PHD)  3. Notify network team  4. Create incident |
| **Quota Breach** | `CallsBreachingConcurrencyQuota` > 0 | 1. Get current utilization  2. Check if quota increase pending  3. Auto-submit quota increase request  4. Page on-call |
| **Flow Errors Spike** | `ContactFlowFatalErrors` > 5 in 5 min | 1. Query flow logs for error details  2. Identify affected flow  3. Check recent CloudTrail for flow changes  4. Notify dev team |
| **Recording Failures** | `CallRecordingUploadError` > 0 | 1. Check S3 bucket permissions  2. Verify storage configuration  3. Check encryption key access  4. Create OpsItem |

---

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

---

### Troubleshooting Playbook

| Symptom | First Check | Second Check | Root Cause Pattern |
|---------|------------|--------------|-------------------|
| Dropped calls | `CallsBreachingConcurrencyQuota` | `ThrottledCalls` | Quota exhaustion |
| Long wait times | `QueueSize` per queue | Agent availability (Real-time Metrics) | Under-staffing |
| Poor call quality | `ToInstancePacketLossRate` | Agent network (by Participant dimension) | Network issues |
| Flow failures | `ContactFlowFatalErrors` | Flow logs (CloudWatch Logs Insights) | Flow misconfiguration |
| Missing recordings | `CallRecordingUploadError` | S3 bucket policy | Permission or storage issue |
| API failures | CloudTrail 4xx/5xx events | Service Quotas console | Rate limit exceeded |
| IVR self-service failures | `PERCENT_BOT_CONVERSATIONS_OUTCOME` (FAILED) | Lex `MissedUtteranceCount` | Bot training gap or slot-fill error |
| AI latency spikes | `RuntimeSuccessfulRequestLatency` (Lex) or `InvocationLatency` (Bedrock) | Lambda p99 Duration | Model cold start or downstream API delay |
| Integration errors | Lambda Errors (Sum) | X-Ray trace map | CRM API or DynamoDB failure |
| Campaign bill spike | `ConcurrentHighVolumeCallsPerInterval` | CUR data | Misconfigured retry loop |

---

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

  CloudWatch Omni ◄── CloudWatch Logs + Metrics
  (AI-powered query       (same account/Region;
   and correlation)        no re-instrumentation)
```

| Tool | Role |
|------|------|
| **CloudWatch** | Metrics, alarms, dashboards, logs, anomaly detection |
| **CloudWatch Omni** | AI-powered natural language query, cross-signal correlation, alerting |
| **EventBridge** | Event-driven automation, routing, integration |
| **X-Ray** | Trace Lambda functions invoked from Connect flows |
| **CloudTrail** | API audit trail, change tracking |
| **Kinesis** | Real-time CTR and agent event streaming |
| **S3 + Athena** | Historical analytics, data lake queries |
| **QuickSight** | Business intelligence dashboards |
| **Contact Lens** | ML-powered conversational analytics and QA |
| **Systems Manager** | Automated runbooks, OpsCenter incident tracking |

---

## Related

- [Monitoring your Amazon Connect instance using CloudWatch](https://docs.aws.amazon.com/connect/latest/adminguide/monitoring-cloudwatch.html)
- [Amazon Connect Administrator Guide — Logging and Monitoring](https://docs.aws.amazon.com/connect/latest/adminguide/logging-and-monitoring.html)
- [EventBridge events emitted by Amazon Connect](https://docs.aws.amazon.com/connect/latest/adminguide/connect-eventbridge-events.html)
- [Amazon Connect service quotas](https://docs.aws.amazon.com/connect/latest/adminguide/amazon-connect-service-limits.html)
- [Contact Lens for Amazon Connect](https://docs.aws.amazon.com/connect/latest/adminguide/analyze-conversations.html)
- [Amazon Connect bot metrics and analytics](https://docs.aws.amazon.com/connect/latest/adminguide/bot-metrics.html)
- [Set up Amazon Connect Global Resiliency](https://docs.aws.amazon.com/connect/latest/adminguide/setup-connect-global-resiliency.html)
- [Outbound campaign metrics](https://docs.aws.amazon.com/connect/latest/adminguide/outbound-campaign-metrics.html)
- [Amazon CloudWatch Omni](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch-omni.html)
- [CloudWatch cross-account observability](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Unified-Cross-Account.html)
- [Monitor and trigger alerts using CloudWatch for Amazon Connect](https://aws.amazon.com/blogs/contact-center/monitor-and-trigger-alerts-using-amazon-cloudwatch-for-amazon-connect/)
- [Visualizing Amazon Connect instance metrics with CloudWatch](https://aws.amazon.com/blogs/contact-center/visualizing-amazon-connect-instance-metrics-with-amazon-cloudwatch/)
