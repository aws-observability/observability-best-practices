---
title: Querying Security Lake with CloudWatch
sidebar_label: Security Lake + CloudWatch
---

import RelatedEvents from '@site/src/components/RelatedEvents';

# Querying Security Lake with CloudWatch

## Overview

When migrating security log management to Amazon CloudWatch unified data store, historical data accumulated in Amazon Security Lake remains in place. Amazon Athena cross-catalog queries allow you to access both data stores from a single console — querying historical Security Lake records and new CloudWatch unified data store logs without exporting, copying, or duplicating data.

Both sources normalize data to the Open Cybersecurity Schema Framework (OCSF), so field names like `src_endpoint.ip`, `api.operation`, and `actor.user.name` are consistent across both. This guide covers the architecture, query patterns, and best practices for bridging historical and current security data.

## When to use this

- You have migrated (or are migrating) security log ingestion from Security Lake to CloudWatch unified data store
- You need to query historical Security Lake data for threat hunting, forensic investigation, or compliance audits
- You want a single Athena console to access both historical and current security telemetry
- You need to compare security posture across migration boundaries (before vs. after)
- You want to avoid building ETL pipelines to export historical data

## Guidance

### Architecture

Security Lake tables register in the AWS Glue Data Catalog (`AwsDataCatalog`). CloudWatch unified data store uses an S3 Tables catalog (`s3tablescatalog/aws-cloudwatch`). Athena references both using fully qualified catalog paths in a single SQL statement:

```
Security Lake  → "awsdatacatalog"."<database>"."<table>"
CloudWatch UDS → "s3tablescatalog/aws-cloudwatch"."logs"."<table>"
```

### Why Query In-Place

| Benefit | Details |
|---|---|
| No duplicate storage charges | Historical data stays in Security Lake's S3-backed store |
| No ETL pipelines | Athena cross-catalog queries eliminate pipeline build/maintenance |
| Historical data stays organized | Security Lake partitions by account, Region, and date |
| New data flows naturally | CloudWatch is the primary destination; no dual routing needed |

### Available Tables

**Security Lake (Glue Data Catalog):**

| Table Pattern | OCSF Class | Key Fields |
|---|---|---|
| `..._cloud_trail_mgmt_2_0` | API Activity | `api.operation`, `src_endpoint.ip`, `actor.user.name`, `time_dt` |
| `..._vpc_flow_2_0` | Network Activity | `src_endpoint.ip`, `dst_endpoint.ip`, `dst_endpoint.port`, `time_dt` |
| `..._route53_2_0` | DNS Activity | `src_endpoint.ip`, `query.hostname`, `time_dt` |
| `..._sh_findings_2_0` | Finding | `finding.title`, `cloud.account.uid`, `severity`, `time_dt` |
| `..._eks_audit_2_0` | API Activity | `api.operation`, `actor.user.name`, `time_dt` |

**CloudWatch Unified Data Store (S3 Tables):**

| Table | OCSF Class | Key Fields |
|---|---|---|
| `aws_cloudtrail__management` | API Activity | `api.operation`, `src_endpoint.ip`, `actor.user.name`, `time_dt` |
| `amazon_vpc__flow` | Network Activity | `src_endpoint.ip`, `dst_endpoint.ip`, `dst_endpoint.port`, `time_dt` |
| `aws_security_hub__compliance_finding` | Compliance Finding | `finding_info.title`, `severity`, `status`, `time_dt` |
| `aws_security_hub__vulnerability_finding` | Vulnerability Finding | `finding_info.title`, `severity`, `status`, `time_dt` |
| `aws_security_hub__detection_finding` | Detection Finding | `finding_info.title`, `severity`, `status`, `time_dt` |

Discover your tables with: `SHOW TABLES IN "s3tablescatalog/aws-cloudwatch"."logs"`

### Querying Security Lake (Historical Data)

```sql
SELECT
    api.operation        AS event_name,
    api.service.name     AS event_source,
    actor.user.name      AS username,
    src_endpoint.ip      AS source_ip,
    time_dt,
    status
FROM "awsdatacatalog"."amazon_security_lake_glue_db_us_east_1"
     ."amazon_security_lake_table_us_east_1_cloud_trail_mgmt_2_0"
WHERE time_dt BETWEEN TIMESTAMP '2025-01-01' AND TIMESTAMP '2025-06-01'
    AND api.operation = 'AssumeRole'
LIMIT 25;
```

### Querying CloudWatch UDS (Recent Data)

```sql
SELECT
    api.operation        AS event_name,
    api.service.name     AS event_source,
    actor.user.name      AS username,
    src_endpoint.ip      AS source_ip,
    time_dt,
    status
FROM "s3tablescatalog/aws-cloudwatch"."logs"."aws_cloudtrail__management"
WHERE time_dt BETWEEN TIMESTAMP '2025-06-01' AND TIMESTAMP '2025-07-01'
    AND api.operation = 'AssumeRole'
LIMIT 25;
```

### Combining Both with UNION ALL

Use `UNION ALL` to get a unified view across the migration boundary. Use specific filters (API operation, IP, finding title) so both sides return relevant results:

```sql
SELECT
    'Security Lake'      AS source,
    api.operation        AS event_name,
    actor.user.name      AS username,
    src_endpoint.ip      AS source_ip,
    time_dt
FROM "awsdatacatalog"."amazon_security_lake_glue_db_us_east_1"
     ."amazon_security_lake_table_us_east_1_cloud_trail_mgmt_2_0"
WHERE time_dt BETWEEN TIMESTAMP '2025-01-01' AND TIMESTAMP '2025-06-01'
    AND api.operation = 'AssumeRole'

UNION ALL

SELECT
    'CloudWatch UDS'     AS source,
    api.operation        AS event_name,
    actor.user.name      AS username,
    src_endpoint.ip      AS source_ip,
    time_dt
FROM "s3tablescatalog/aws-cloudwatch"."logs"."aws_cloudtrail__management"
WHERE time_dt BETWEEN TIMESTAMP '2025-06-01' AND TIMESTAMP '2025-07-01'
    AND api.operation = 'AssumeRole'

LIMIT 50;
```

**Why UNION ALL instead of JOIN?** Cross-catalog JOINs cannot efficiently push down predicates across catalog types, causing full-table scans with high cost (Athena charges $5/TB scanned). UNION ALL runs each query independently with proper partition pruning.

### Best Practices

- **Use time-bounded WHERE clauses** — the PromQL API and Athena both benefit from narrow time windows
- **Always filter by a specific condition** (operation, IP, severity) in UNION ALL queries to avoid consuming the LIMIT from only one side
- **Replace region identifiers** in table/database names to match your deployment (e.g., `us_east_1` → `eu_west_1`)
- **Discover tables first** with `SHOW TABLES` before building queries
- **Adjust time ranges** to match your actual migration timeline (the boundary between Security Lake and CloudWatch UDS)

## Related

- [Amazon Security Lake documentation](https://docs.aws.amazon.com/security-lake/latest/userguide/what-is-security-lake.html)
- [CloudWatch unified data store](https://aws.amazon.com/cloudwatch/features/unified-data-and-telemetry/)
- [OCSF Schema](https://schema.ocsf.io/)
- [CloudWatch Logs Security Best Practices](/solutions/cloudwatch-logs-security/)

## Related Events

<RelatedEvents topics={["security"]} />
