# Reducing CloudWatch cost

CloudWatch billing breaks down across a few dimensions: **Logs** (ingestion, storage, analysis), **Metrics** (custom metrics, API calls like `GetMetricData`), **Alarms**, **Dashboards**, **Synthetics/RUM**, and **Contributor Insights**. Optimize each independently - ” the biggest wins are almost always in **Logs ingestion** and **`GetMetricData` API volume**.

---

## 1. Metrics - ” `GetMetricData` / API cost

These charges usually come from third-party observability tools and cloud financial tools polling CloudWatch.

- **Lower request frequency.** Shifting a tool from 1-minute to 5-minute polling cuts that cost to ~1/5 (20%).
- **Diagnose the trend.** Temporarily disable third-party data collection to isolate what's driving `GetMetricData` usage, then re-enable selectively.
- **Batch metric retrieval.** Use `GetMetricData` (up to 500 metrics/call) instead of many `GetMetricStatistics` calls.
- **Scope metric streams.** If using CloudWatch Metric Streams to third parties, filter to only the namespaces/metrics you actually need rather than streaming everything.
- **Prune unused custom metrics.** Custom metrics bill per metric per month. Audit for high-cardinality dimensions (e.g., per-request IDs, per-pod UUIDs) that explode metric count.

---

## 2. CloudWatch Logs - ” ingestion & storage

Ingestion ($/GB) is typically the single largest CloudWatch line item.

### Reduce what you ingest
- **Identify top contributors.** Use CloudWatch Logs usage metrics / `IncomingBytes` by log group to find the biggest sources.
- **Lower logging verbosity.** Drop DEBUG/INFO to WARN/ERROR for chatty top-contributor apps unless the detail is required.
- **Audit third-party log tooling** running alongside CloudWatch (double-shipping).
- **VPC Flow Logs** - ” expensive on high-traffic VPCs. If still needed, deliver to **Amazon S3** instead of CloudWatch Logs, or sample.
- **Lambda logging** - ” where unnecessary, deny `logs:PutLogEvents` in the Lambda execution role; adopt **Lambda log-level controls** (`ApplicationLogLevel`/`SystemLogLevel`) to filter at source.
- **CloudTrail logs** - ” often a top contributor. Route to **S3 + Athena** for querying and **EventBridge** for alarms/notifications rather than ingesting into CloudWatch Logs.

### Reduce what you store (retention & tiering)
- **Set retention policies.** Log groups default to **Never Expire**. Set explicit retention (e.g., 30/90/365 days) on every group - ” unbounded retention silently accrues storage cost forever.
- **Enable CloudWatch Logs Intelligent Tiering (Jul 2026).** See Section 3 below. This is the recommended first move for long-retention, high-volume, infrequently-queried logs.
- **Choose the right log class.** Use **Logs Infrequent Access (IA)** class for logs you rarely query interactively (ingestion is ~50% cheaper). Note IA has feature limitations (no Live Tail, metric filters, etc.).
- **Archive cold data to S3** with lifecycle policies to Glacier for compliance-only retention.

### Reduce analysis cost
- **Logs Insights** bills per GB scanned. Narrow time ranges, add filters early in the query, and target specific log groups instead of scanning everything.
- Prefer **metric filters** for recurring numeric extraction rather than re-running Insights queries.

---

## 3. CloudWatch Logs Intelligent Tiering (announced Jul 15, 2026)

Automatically moves log data across three storage tiers based on access patterns - ” retain high-volume verbose logs longer at reduced cost, with **no manual work** and the **same query experience** across tiers.

### Tiers & transitions
| Tier | Trigger |
|------|---------|
| **Standard** | Default / recently accessed |
| **Infrequent Access** | Not accessed for **30 days** |
| **Archive Instant Access** | Not accessed for **90 days** |

- When older data is accessed, it's **automatically promoted back to Standard for 30 days**.
- Query experience is identical regardless of tier - ” no restore step, no separate tooling.

### Why it matters
- Keep **high-volume verbose logs** longer at lower cost instead of filtering, sampling, or exporting them out.
- **Consolidate** logs in one place (fewer bespoke storage solutions) â†’ lower MTTR during incidents.
- Complements retention policies: use Intelligent Tiering for the "keep it but rarely touch it" long tail.

### How to enable
- Enable at the **account level**.
- Available via **AWS Management Console, SDKs, or CLI**.

### Availability / limitations
- All AWS **commercial regions except Middle East (Bahrain)** and **Middle East (UAE)**.
- Applies to **Logs only** (not metrics).
- Refer to [CloudWatch pricing](https://aws.amazon.com/cloudwatch/pricing/) and the [Intelligent Tiering docs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/cwl_intelligent_tier.html) for exact per-GB rates.

**Decision guide:** Set retention and enable Intelligent Tiering as the default for most log groups. Reserve the IA log class for groups you ingest but almost never query interactively. Route pure-compliance/archival data to S3 and Glacier.

---

## 4. Alarms

- **Consolidate with composite alarms.** Replace many metric alarms feeding one notification with a **composite alarm** to reduce alarm count.
- **Remove orphaned/duplicate alarms** on decommissioned resources.
- **Prefer standard-resolution** alarms (60s) over high-resolution (10s/30s) unless sub-minute detection is genuinely required - ” high-resolution alarms cost more.
- **Metrics Insights (SQL) alarms** can watch many resources with a single alarm definition instead of one-alarm-per-resource sprawl.

---

## 5. Dashboards

- First **3 dashboards are free**; beyond that they bill per dashboard/month.
- **Consolidate** low-traffic dashboards; delete stale ones.
- Use **variables** to make one parameterized dashboard serve many resources instead of duplicating dashboards per service/account.

---

## 6. Synthetics, RUM & Contributor Insights

- **Synthetics canaries** bill per run - ” widen intervals for non-critical canaries; disable canaries on non-prod off-hours.
- **RUM** bills per events collected - ” apply session sampling.
- **Contributor Insights** bills per rule + per log event matched - ” disable rules that are no longer investigated.

---

## 7. Cross-cutting practices

- **Tag-based cost allocation.** Turn on cost allocation tags and use **Cost Explorer** grouped by CloudWatch usage type to see where spend concentrates before optimizing.
- **CloudWatch usage metrics** (`AWS/Usage` namespace) - ” alarm on your own CloudWatch API call volume to catch runaway third-party polling.
- **Right-size at the source.** The cheapest telemetry is the telemetry you never emit - ” sample traces, drop noisy log lines, and prune high-cardinality metric dimensions at the SDK/collector layer.
- **Review quarterly.** Log volume grows with traffic; revisit top contributors and retention settings on a schedule.

---

## Quick-win checklist

1. Set explicit retention on every log group (none should be "Never Expire" by default)
2. Enable Logs Intelligent Tiering at the account level
3. Move VPC Flow Logs and CloudTrail to S3 where CloudWatch isn't required
4. Drop third-party metric polling from 1-minute to 5-minute where acceptable
5. Switch rarely-queried log groups to the Infrequent Access log class
6. Prune high-cardinality custom metrics and orphaned alarms/dashboards
7. Turn on cost allocation tags and review CloudWatch usage in Cost Explorer
