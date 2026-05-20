# Monitoring Databases with Amazon CloudWatch Database Insights

## Introduction

Amazon CloudWatch Database Insights is a unified monitoring solution for Amazon RDS and Aurora databases. It consolidates database metrics, query analytics, logs, events, and application telemetry into a single experience within the CloudWatch console — eliminating the need to switch between multiple tools to understand what's happening in your database layer.

This article covers what Database Insights offers, how to choose between its two operating modes, practical guidance for monitoring your databases effectively, and the limitations you should be aware of before adopting it.

---

## What Is Database Insights?

Database Insights builds on top of Amazon RDS Performance Insights and extends it with fleet-wide monitoring, log correlation, lock analysis, execution plan capture, and application-level integration. It is the successor to the standalone Performance Insights console experience (which reaches end-of-life soon).

The core concept is **DB Load** — the average number of active sessions in your database at any point in time. If DB Load exceeds your instance's vCPU count, your database is overloaded. Database Insights visualizes this metric and lets you slice it by multiple dimensions (SQL, wait events, users, hosts, applications) to quickly identify the root cause of performance issues.

---

## Standard Mode vs. Advanced Mode

Database Insights operates in two tiers. Standard mode is enabled by default at no additional cost. Advanced mode requires Performance Insights to be enabled with a 15-month retention period and is priced based on vCPU-hours (provisioned) or ACU-hours (serverless/limitless).

| Feature | Standard | Advanced |
|---|:---:|:---:|
| Analyze top DB Load contributors by dimension | ✔ | ✔ |
| Query, graph, and alarm on metrics (7-day retention) | ✔ | ✔ |
| Fine-grained IAM access control for sensitive dimensions | ✔ | ✔ |
| Fleet-wide monitoring views | ✘ | ✔ |
| OS process analysis (Enhanced Monitoring) | ✘ | ✔ |
| SQL lock analysis (15-month retention) | ✘ | ✔ (Aurora PG) |
| SQL execution plan analysis (15-month retention) | ✘ | ✔ (Aurora PG, Oracle, SQL Server) |
| Per-query statistics visualization | ✘ | ✔ |
| Slow SQL query analysis | ✘ | ✔ |
| Application Signals integration (calling services) | ✘ | ✔ |
| Consolidated telemetry dashboard (metrics, logs, events) | ✘ | ✔ |
| Auto-import Performance Insights counter metrics | ✘ | ✔ |
| RDS events in CloudWatch | ✘ | ✔ |
| On-demand performance analysis reports | ✘ | ✔ |
| Cross-account cross-region monitoring | ✘ | ✔ |

**Data retention:**
- Standard: 7 days for Performance Insights data.
- Advanced: 15 months for all metrics collected by Database Insights.

---

## Key Features Explained

### Fleet Health Dashboard

The Fleet Health Dashboard provides a bird's-eye view of all your RDS and Aurora instances cross-account and cross-region in one screen. A honeycomb visualization categorizes instances by health state (High, Warning, Ok, Idle) based on DB Load relative to vCPU capacity. You can filter by tags (environment, service, team) and save custom fleet views. Top-10 charts show the most loaded instances, their top queries, and top wait events at a glance.

This is where you start when you're responsible for hundreds of databases and need to quickly identify which one needs attention.

### DB Load Analysis (The Investigation Workbench)

The Instance Dashboard's DB Load Analysis tab is where you spend most of your troubleshooting time. It answers the five W's:

- **WHAT** — Slice by SQL to see which queries are generating load.
- **WHO** — Slice by User or Application to identify the responsible party.
- **WHERE** — Slice by Host to find the source machine.
- **WHEN** — The timeline shows exactly when issues started and stopped.
- **WHY** — Correlate findings and take action.

The Top SQL table ranks queries by load contribution and shows calls/sec, average latency, rows examined, and plan count.

### Lock Analysis

Available for Aurora PostgreSQL and RDS for PostgreSQL. Database Insights captures lock snapshots every 15 seconds and visualizes them as lock trees — parent nodes are blocking sessions, child nodes are waiters. You can see the blocking SQL, duration, and number of downstream sessions affected. The "Sliced by: Blocking SQL" option in the DB Load chart shows which statements are driving lock contention over time.

### Execution Plan Analysis

Available for Aurora PostgreSQL (v14.10+, v15.5+), RDS for Oracle, and RDS for SQL Server. The Plans Count column in the Top SQL table shows how many distinct execution plans exist for each query. You can compare plans side-by-side to identify when a plan change caused a performance regression. A high plan count signals optimizer instability.

### Database Telemetry

A consolidated tab containing:
- **Metrics** — Customizable dashboard of CloudWatch, OS, and engine counter metrics.
- **Logs** — Database logs exported to CloudWatch Logs, viewable inline.
- **OS Processes** — Per-process CPU/memory from Enhanced Monitoring.
- **Slow SQL Queries** — Slow queries grouped by pattern, ranked by frequency.
- **Events** — RDS operational events (failovers, maintenance, configuration changes).

### Calling Services (CloudWatch Application Signals Integration)

This Application Performance Monitoring integration shows which upstream microservices are calling your database, along with their availability, latency, error rate, and request volume. This bridges the gap between "the database is slow" and "this specific service and function is causing it."

### On-Demand Performance Analysis

Select any time window and trigger an automated, ML-powered analysis by choosing "Analyze Performance" from the Database Load chart. Database Insights leverages machine learning models to compare the selected period against your database's normal baseline behavior, scanning across dimensions (SQL statements, wait events, hosts, users, and more) to surface anomalies and root causes (e.g., "DB load increased 4x due to a wait event shift from CPU to I/O"). Each report includes prioritized findings with specific remediation guidance, reducing mean-time-to-diagnosis from hours to minutes. Reports are retained alongside your 15-month metric history for easy retrieval during post-incident reviews.

---

## Limitations

Before adopting Database Insights, be aware of the following constraints:

### Engine and Feature Availability

- **Lock analysis** is only available for Aurora PostgreSQL and RDS for PostgreSQL.
- **Execution plan analysis** is only available for Aurora PostgreSQL (v14.10+/v15.5+), RDS for Oracle, and RDS for SQL Server.
- Not all Advanced mode features are available in all AWS Regions.
- Aurora PostgreSQL Limitless Database support exists but with a reduced feature set (no lock analysis or execution plan analysis at the shard group level).

### Data and Configuration Requirements

- **Slow SQL analysis** requires database log export to CloudWatch Logs to be enabled and appropriate DB parameters configured (e.g., `log_min_duration_statement` for PostgreSQL, `slow_query_log` for MySQL).
- **OS process data** requires Enhanced Monitoring to be enabled (additional cost).
- **Execution plans** on Aurora PostgreSQL require the `aurora_compute_plan_id` parameter set to `on`. Actual plans (vs. estimated) additionally require `aurora_stat_plans.with_analyze`.
- **Calling Services** requires your applications to be instrumented with CloudWatch Application Signals.
- `pg_stat_statements` is loaded by default on Aurora PostgreSQL 10+, but SQL text is truncated at `track_activity_query_size` (default 1,024 bytes). Long queries may appear incomplete.

### Operational Limitations

- Lock analysis snapshots are taken every 15 seconds — very short-lived locks may not be captured.
- The Fleet Health Dashboard requires Advanced mode for saved fleet views.
- Cross-account monitoring requires CloudWatch Observability Access Manager (OAM) setup in both monitoring and source accounts.
- Performance analysis reports are deleted when their start time falls outside the retention period.
- Dashboard customizations in the Database Telemetry tab apply per engine type per region per account — not per instance.

### Cost Considerations

- Advanced mode is priced per vCPU-hour (provisioned) or ACU-hour (serverless/limitless). For large fleets, costs can be significant.
- Enhanced Monitoring incurs separate charges.
- CloudWatch Logs ingestion and storage costs apply when log export is enabled.
- There is no way to enable Advanced mode for individual instances within a cluster — it applies to the entire DB cluster.

---

## Best Practices

### Start with Standard, Upgrade Strategically

Standard mode is free and gives you DB Load analysis with 7-day retention. Enable Advanced mode on production-critical databases where you need 15-month retention, fleet views, lock analysis, or execution plan capture. Not every dev/test instance needs Advanced mode.

### Tag Your Instances Consistently

Database Insights fleet views filter by tags. Adopt a consistent tagging strategy (e.g., `environment`, `service`, `team`) so you can create meaningful fleet views like "all production databases for the payments service."

### Enable Log Export Early

Slow SQL analysis and the Logs section of Database Telemetry only work if you've enabled log export to CloudWatch Logs. Do this at instance creation time rather than retroactively — you can't analyze historical slow queries from before export was enabled.

### Set Up Alarms on DB Load

Create CloudWatch Alarms on the `DBLoad` metric relative to your instance's vCPU count. A sustained DB Load above vCPU count means sessions are queuing. Alert before customers notice.

### Use the Who/What/Where/When Framework

When investigating a performance issue, work through the "Sliced by" dropdown systematically:
1. **SQL** — identify the problem query.
2. **Application** or **User** — identify who's running it.
3. **Host** — identify where it's coming from.
4. **Timeline** — identify when it started.

This structured approach prevents you from going down rabbit holes.

### Enable Execution Plan Capture for Aurora PostgreSQL

Set `aurora_compute_plan_id = on` in your cluster parameter group. Plan regressions are one of the most common causes of sudden performance degradation, and without plan capture you're flying blind. The overhead is minimal.

### Use On-Demand Analysis for Post-Incident Reviews

After any performance incident, generate a performance analysis report for the affected time window. It provides an automated summary you can attach to your COE or post-mortem, and it's retained for 15 months.

### Leverage Cross-Account Monitoring for Multi-Account Architectures

If your organization uses separate AWS accounts for different services or environments, set up CloudWatch cross-account observability with OAM. This lets a central monitoring account see the Fleet Health Dashboard across all accounts and regions — essential for platform teams managing shared database infrastructure.

### Restrict Access to SQL Text

Use IAM policies to restrict access to the SQL text dimension. Database queries may contain sensitive data (customer IDs, email addresses in WHERE clauses). Grant full SQL visibility only to DBAs and limit other roles to aggregated metrics.

---

## Prescriptive Guidance: What You Should Do Today

### If you're just getting started:

1. **Verify Standard mode is active** — it should be by default. Navigate to CloudWatch → Insights → Database Insights and confirm you see your instances.
2. **Enable log export** to CloudWatch Logs for your production databases.
3. **Set up CloudWatch Alarms** on `CPUUtilization`, `DatabaseConnections`, and `DBLoad`.
4. **Tag your instances** with environment, service, and team tags.

### If you're running production workloads:

1. **Enable Advanced mode** on production clusters — the 15-month retention and fleet views are worth the cost for production.
2. **Enable Enhanced Monitoring** for OS-level visibility.
3. **Set `aurora_compute_plan_id = on`** (Aurora PostgreSQL) for execution plan capture.
4. **Create fleet health views** filtered by your production tags.
5. **Instrument your applications** with CloudWatch Application Signals to enable the Calling Services view.

### If you're managing a large fleet:

1. **Set up cross-account cross-region monitoring** with OAM.

   How OAM works:
   - **Monitoring account** — The central account where your team views dashboards. You create a "sink" here that accepts data from other accounts.
   - **Source accounts** — The accounts that actually run your databases. You create "links" from each source account to the monitoring account's sink, granting it permission to read their CloudWatch data.

   Once linked, the monitoring account can see metrics, logs, and traces from all source accounts as if they were local — including the Database Insights Fleet Health Dashboard showing instances across all linked accounts and regions in a single view.
2. **Create multiple fleet views** segmented by team, service, or environment.
3. **Establish a triage workflow**: Fleet Health → identify hot instance → DB Load Analysis → who/what/where/when → take action.
4. **Run periodic on-demand analyses** on your highest-traffic instances to catch slow regressions before they become incidents.

---

## Conclusion

CloudWatch Database Insights consolidates what used to require multiple tools — Performance Insights, CloudWatch Metrics, CloudWatch Logs, the RDS console — into a single, guided experience. Standard mode gives you immediate visibility at no cost. Advanced mode adds the depth needed for serious production monitoring: fleet views, lock trees, execution plans, slow query analysis, and 15-month retention.

The key shift in mindset is moving from reactive ("the database is slow, let me SSH in and run queries against pg_stat_activity") to proactive ("I can see my entire fleet's health, drill into any instance, and answer who/what/where/when in under two minutes from a single console"). Database Insights makes that workflow possible without custom tooling or third-party solutions.

---

## References

- [CloudWatch Database Insights Documentation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Database-Insights.html)
- [Get Started with Database Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Database-Insights-Get-Started.html)
- [Lock Analysis](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Database-Insights-Lock-Analysis.html)
- [Execution Plan Analysis](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Database-Insights-Execution-Plans.html)
- [Amazon CloudWatch Pricing](https://aws.amazon.com/cloudwatch/pricing/)