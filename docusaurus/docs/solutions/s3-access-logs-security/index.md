---
title: S3 Access Logs for Security & Compliance
sidebar_label: S3 Access Logs Security
---

import RelatedEvents from '@site/src/components/RelatedEvents';

# S3 Access Logs for Security & Compliance

## Related Events

<RelatedEvents topics={["security"]} />


## Overview

Amazon S3 server access logs record every request made to your buckets — successful or failed, authenticated or anonymous — with HTTP-level detail not available in other log sources. With S3 server access logs now available as a native data source for CloudWatch unified data store, logs are automatically delivered and transformed into a structured, queryable format without custom ETL pipelines.

Combined with AWS CloudTrail management events, server access logs form a cost-effective, defense-in-depth strategy for S3 security monitoring, compliance evidence, and operational auditing. This guide covers the hybrid logging approach, key security queries, and real-time monitoring patterns.

## When to use this

- You need to detect unauthorized access attempts, data exfiltration, or bulk deletions on S3 buckets
- You must provide compliance evidence for TLS version, cipher suites, or encryption-in-transit (PCI-DSS, HIPAA, SOC 2, FedRAMP)
- You need to identify deprecated SigV2 usage (only available in server access logs)
- You want to track S3 lifecycle operations (expirations, transitions) which CloudTrail does not log
- You need broad data-plane visibility on high-volume buckets without unbounded cost growth
- You are planning a migration to bucket-owner-enforced Object Ownership and need `acl_required` field data

## Guidance

### Hybrid Logging Strategy

Use a three-layer architecture that balances cost with assurance:

| Layer | What | Purpose | Cost |
|---|---|---|---|
| CloudTrail management events | Trail (first copy free) | Bucket-level config changes (PutBucketPolicy, DeleteBucketEncryption) | No additional cost |
| S3 server access logs (via CloudWatch UDS) | Enable on all buckets | Broad data-plane visibility, HTTP-level detail, lifecycle tracking, SigV2 detection | CloudWatch Logs ingestion + storage (volume-tiered) |
| CloudTrail data events (scoped) | Write-only on sensitive buckets | Guaranteed delivery for critical mutations on PII/financial/regulated buckets | Per-event charge (scoped to reduce volume) |

### What Each Source Uniquely Provides

**CloudTrail data events** provide: guaranteed delivery, full IAM identity chain (ARN, session context, MFA status), request/response parameters, and selective logging via advanced event selectors.

**Server access logs** provide: HTTP status/latency/bytes, signature version (SigV2 vs SigV4), authentication type, `acl_required` field, S3 lifecycle operations, source region, and native CloudWatch UDS integration with volume-tiered pricing.

### Key Security Fields

| Field | Security Use |
|---|---|
| `requester` | IAM principal identification |
| `remote_ip` | Source IP for geo-analysis and threat correlation |
| `authentication_type` | Detect anonymous access (NULL = no credentials) |
| `signature_version` | Find deprecated SigV2 clients |
| `http_status` | 403/404 spikes indicate brute-force or enumeration |
| `bytes_sent_size` | Large downloads may indicate exfiltration |
| `tls_version` | Compliance evidence (must be TLS 1.2+) |
| `operation` | `S3.EXPIRE.OBJECT`, `S3.TRANSITION_*` for lifecycle tracking |

### Security Queries

**Unauthorized access attempts (403/404 spikes):**

```sql
SELECT remote_ip, error_code, operation,
    COUNT(*) AS error_count,
    COUNT(DISTINCT key_name) AS unique_keys_targeted
FROM `YOUR_S3_ACCESS_LOG_GROUP`
WHERE http_status IN (403, 404)
GROUP BY remote_ip, error_code, operation
ORDER BY error_count DESC
LIMIT 50
```

**Unusual data transfer patterns:**

```sql
SELECT remote_ip, requester,
    SUM(bytes_sent_size) / 1048576 AS total_MB_downloaded,
    COUNT(DISTINCT key_name) AS unique_objects
FROM `YOUR_S3_ACCESS_LOG_GROUP`
WHERE operation LIKE 'REST.GET.OBJECT' AND http_status = 200
GROUP BY remote_ip, requester
ORDER BY total_MB_downloaded DESC
LIMIT 25
```

**Anonymous (unauthenticated) access:**

```sql
SELECT `@timestamp`, bucket_name, operation, key_name, remote_ip, http_status
FROM `YOUR_S3_ACCESS_LOG_GROUP`
WHERE authentication_type IS NULL
  AND operation NOT LIKE '%OPTIONS%'
ORDER BY `@timestamp` DESC
LIMIT 100
```

**Bulk delete detection:**

```sql
SELECT requester, remote_ip, operation,
    COUNT(*) AS delete_count,
    COUNT(DISTINCT key_name) AS unique_objects
FROM `YOUR_S3_ACCESS_LOG_GROUP`
WHERE operation LIKE '%DELETE%'
   OR operation = 'REST.POST.MULTI_OBJECT_DELETE'
GROUP BY requester, remote_ip, operation
ORDER BY delete_count DESC
LIMIT 50
```

### Compliance Queries

**Outdated TLS (PCI-DSS, FedRAMP, NIST 800-53):**

```sql
SELECT tls_version, cipher_suite, remote_ip, user_agent, bucket_name,
    COUNT(*) AS outdated_tls_count
FROM `YOUR_S3_ACCESS_LOG_GROUP`
WHERE tls_version IN ('TLSv1', 'TLSv1.1')
GROUP BY tls_version, cipher_suite, remote_ip, user_agent, bucket_name
ORDER BY outdated_tls_count DESC
```

**Deprecated SigV2 detection:**

```sql
SELECT requester, remote_ip, user_agent, bucket_name, operation,
    COUNT(*) AS sigv2_count
FROM `YOUR_S3_ACCESS_LOG_GROUP`
WHERE signature_version = 'SigV2'
GROUP BY requester, remote_ip, user_agent, bucket_name, operation
ORDER BY sigv2_count DESC
```

**Lifecycle policy verification:**

```sql
SELECT operation, bucket_name, COUNT(*) AS event_count
FROM `YOUR_S3_ACCESS_LOG_GROUP`
WHERE operation LIKE 'S3.%'
GROUP BY operation, bucket_name
ORDER BY event_count DESC
```

### Metric Filters for Real-Time Alerting

| Filter | Pattern | Alarm Threshold |
|---|---|---|
| Access Denied (403) | `{ $.http_status = 403 }` | > 100 in 5 min |
| Not Found (404) | `{ $.http_status = 404 }` | > 500 in 5 min |
| Anonymous requests | `{ $.authentication_type NOT EXISTS }` | > 0 in 5 min (non-public buckets) |
| SigV2 requests | `{ $.signature_version = "SigV2" }` | > 0 in 15 min |
| Outdated TLS | `{ $.tls_version = "TLSv1" \|\| $.tls_version = "TLSv1.1" }` | > 0 in 15 min |
| Large downloads (>100 MB) | `{ $.http_status = 200 && $.bytes_sent_size > 104857600 && $.operation = "REST.GET.OBJECT" }` | > 50 in 15 min |
| Server errors (5xx) | `{ $.http_status = 5* }` | > 50 in 5 min |

### Contributor Insights Rules

- **Top IPs generating 403/404 errors**: Key on `$.remote_ip`, filter `$.http_status` in [403, 404]
- **Top requesters by download volume**: Key on `$.requester` + `$.remote_ip`, aggregate Sum on `$.bytes_sent_size`
- **Top requesters performing deletes**: Key on `$.requester` + `$.bucket_name`, filter on DELETE operations
- **Top user agents per bucket**: Key on `$.user_agent` + `$.bucket_name` — unexpected agents (curl, wget) warrant investigation
- **Top buckets by error rate**: Key on `$.bucket_name` + `$.error_code`, filter `$.http_status` > 399

### Scoping CloudTrail Data Events for Cost Control

Use advanced event selectors to log only write operations on sensitive buckets:

```json
[{
  "Name": "S3WriteOnlySensitiveBuckets",
  "FieldSelectors": [
    { "Field": "eventCategory", "Equals": ["Data"] },
    { "Field": "resources.type", "Equals": ["AWS::S3::Object"] },
    { "Field": "readOnly", "Equals": ["false"] },
    { "Field": "resources.ARN", "StartsWith": [
        "arn:aws:s3:::my-pii-bucket/",
        "arn:aws:s3:::my-financial-data/"
    ]}
  ]
}]
```

## Related

- [Amazon S3 server access log format](https://docs.aws.amazon.com/AmazonS3/latest/userguide/LogFormat.html)
- [Security best practices for Amazon S3](https://docs.aws.amazon.com/AmazonS3/latest/userguide/security-best-practices.html)
- [CloudWatch Logs Security Best Practices](/solutions/cloudwatch-logs-security/)
- [WAF Security Analysis with CloudWatch](/solutions/waf-security-analysis/)
