---
title: WAF Security Analysis with CloudWatch
sidebar_label: WAF Security Analysis
---

import RelatedEvents from '@site/src/components/RelatedEvents';

# WAF Security Analysis with CloudWatch

## Related Events

<RelatedEvents topics={["security"]} />


## Overview

AWS WAF generates detailed JSON logs for every web request evaluated by a web ACL. When sent to Amazon CloudWatch Logs, these logs unlock three complementary analysis capabilities: CloudWatch Logs Insights for ad-hoc investigation, metric filters for near-real-time alerting, and Contributor Insights for continuous top-N threat identification. Together, these form a complete security operations workflow for detecting, investigating, and responding to web application threats.

This guide covers effective security queries, metric filters and alarms for automated threat detection, and Contributor Insights rules to continuously identify top unauthorized actors and most-targeted endpoints.

## When to use this

- You have WAF web ACLs logging to CloudWatch Logs (log group prefixed `aws-waf-logs-`)
- You need to detect and investigate SQL injection, XSS, or other web attacks
- You want near-real-time alerting on attack spikes and DDoS/brute-force activity
- You need continuous visibility into top blocked IPs, targeted URIs, and active rules
- You are building a WAF security operations dashboard
- You need to identify multi-vector unauthorized actors running diverse attack techniques

## Guidance

### WAF Log Structure

Key fields for security analysis:

| Field | Security Use |
|---|---|
| `action` | Filter by ALLOW, BLOCK, CAPTCHA, CHALLENGE |
| `httpRequest.clientIp` | Identify unauthorized source IPs |
| `httpRequest.country` | Geo-based threat detection |
| `httpRequest.uri` | Identify targeted endpoints |
| `terminatingRuleId` | Which rules are firing most |
| `terminatingRuleType` | RATE_BASED, REGULAR, MANAGED_RULE_GROUP |
| `ruleGroupList[].terminatingRule` | Specific rule within a managed group |
| `labels[].name` | Categorize and correlate events |
| `httpRequest.headers[]` | Bot and tool fingerprinting |

### CloudWatch Logs Insights Queries

**Security posture overview:**

```sql
fields @timestamp, action, terminatingRuleId
| stats count(*) as requestCount by action
| sort requestCount desc
```

**Top blocked IPs:**

```sql
fields httpRequest.clientIp, httpRequest.country, terminatingRuleId
| filter action = "BLOCK"
| stats count(*) as blockCount by httpRequest.clientIp, httpRequest.country
| sort blockCount desc
| limit 20
```

**SQL injection analysis:**

```sql
fields @timestamp, httpRequest.clientIp, httpRequest.uri, httpRequest.args
| filter terminatingRuleId = "SQLInjectionRule"
    or terminatingRuleId like /(?i)sql/
| sort @timestamp desc
| limit 50
```

**Rule effectiveness:**

```sql
fields terminatingRuleId, terminatingRuleType
| filter action = "BLOCK"
| stats count(*) as triggers by terminatingRuleId, terminatingRuleType
| sort triggers desc
```

**Multi-vector unauthorized actors (IPs triggering 3+ rules):**

```sql
fields httpRequest.clientIp, terminatingRuleId
| filter action = "BLOCK"
| stats count_distinct(terminatingRuleId) as rulesTriggered,
    count(*) as totalBlocks
  by httpRequest.clientIp
| filter rulesTriggered > 2
| sort rulesTriggered desc, totalBlocks desc
```

**Rate-limited IPs (DDoS/brute-force):**

```sql
fields @timestamp, httpRequest.clientIp, httpRequest.uri
| filter terminatingRuleType = "RATE_BASED"
| stats count(*) as rateLimited,
    earliest(@timestamp) as firstSeen,
    latest(@timestamp) as lastSeen
  by httpRequest.clientIp
| sort rateLimited desc
```

**SSRF and Log4j attempts:**

```sql
fields @timestamp, httpRequest.clientIp, httpRequest.uri, terminatingRuleId
| filter httpRequest.uri like /169\.254/
    or httpRequest.uri like /jndi:/
    or httpRequest.uri like /\$\{/
    or @message like /Log4JRCE/
| sort @timestamp desc
| limit 30
```

**User-Agent bot detection:**

```sql
fields @timestamp, httpRequest.clientIp, action
| parse @message '"name":"user-agent","value":"*"' as userAgent
| filter action = "BLOCK"
| stats count(*) as requests by userAgent
| sort requests desc
| limit 20
```

### Metric Filters and Alarms

Create metric filters for near-real-time detection. Each publishes a CloudWatch metric that powers alarms and dashboard widgets.

| Metric | Filter Pattern | Alarm Threshold |
|---|---|---|
| Total blocked requests | `{ $.action = "BLOCK" }` | > 100 in 5 min |
| SQL injection attempts | `{ $.terminatingRuleId = "SQLInjectionRule" }` | > 10 in 5 min |
| XSS attempts | `{ $.terminatingRuleId = "XSSRule" }` | > 10 in 5 min |
| Rate-limited requests | `{ $.terminatingRuleType = "RATE_BASED" }` | > 50 in 5 min |
| Geo-blocked traffic | `{ $.terminatingRuleId = "GeoBlockRule" }` | > 100 in 5 min |
| Admin path probing | `{ $.terminatingRuleId = "BlockAdminPathsRule" }` | > 20 in 5 min |

Use composite alarms for nuanced alerting — e.g., fire only when SQLi exceeds threshold AND overall block rate spikes.

### Contributor Insights Rules

Contributor Insights creates near-real-time top-N reports without writing queries. Create rules for:

- **Top blocked source IPs**: Key `$.httpRequest.clientIp`, filter `$.action` in ["BLOCK"]
- **Top targeted URIs**: Key `$.httpRequest.uri`, filter `$.action` in ["BLOCK"]
- **Top terminating rules**: Key `$.terminatingRuleId`, filter `$.action` in ["BLOCK"]
- **Top attack source countries**: Key `$.httpRequest.country`, filter `$.action` in ["BLOCK"]
- **IP + rule combinations**: Keys `$.httpRequest.clientIp` + `$.terminatingRuleId`, filter BLOCK — fingerprints multi-vector unauthorized actors
- **Top allowed source IPs (baseline)**: Key `$.httpRequest.clientIp`, filter `$.action` in ["ALLOW"] — detect anomalies when unexpected IPs appear

Contributor Insights only analyzes events ingested after rule creation. Create rules early.

### Security Operations Workflow

| Use Case | Primary Tool | Supporting Tool |
|---|---|---|
| Detect active attack campaigns | Metric Filter + Alarm | Contributor Insights (top IPs) |
| Identify unauthorized actors | Contributor Insights | Logs Insights (deep-dive) |
| Validate rule effectiveness | Contributor Insights (top rules) | Metric Filters (trend) |
| Incident investigation | Logs Insights queries | Contributor Insights (context) |
| Compliance reporting | Metric Filters (metrics) | Logs Insights (evidence) |
| Geographic threat analysis | Contributor Insights (countries) | Logs Insights (details) |
| Bot/scanner identification | Logs Insights (User-Agent) | Metric Filter (bad bot count) |

**Incident response flow:**
1. Alarm fires (metric filter detects spike) → check dashboard
2. Identify top IPs (Contributor Insights)
3. Deep-dive investigation (Logs Insights) → examine payloads, paths, timing
4. Take action → update WAF rules, block IPs, tighten rate limits

### Operational Practices

- **Weekly review**: Check Contributor Insights trends for gradual attack pattern changes
- **Rule tuning**: Use rule effectiveness queries to identify false positives
- **Baseline monitoring**: Track allowed IPs to detect anomalies when unexpected sources appear
- **Geo-awareness**: Monitor geographic distribution for sudden shifts indicating coordinated campaigns

## Related

- [WAF logging documentation](https://docs.aws.amazon.com/waf/latest/developerguide/logging.html)
- [CloudWatch Logs Insights query syntax](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html)
- [Contributor Insights rule syntax](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContributorInsights-RuleSyntax.html)
- [CloudWatch Logs Security Best Practices](/solutions/cloudwatch-logs-security/)
- [S3 Access Logs for Security & Compliance](/solutions/s3-access-logs-security/)
