---
title: Amazon OpenSearch Service Monitoring
sidebar_label: OpenSearch Monitoring
---

# Amazon OpenSearch Service Monitoring

## Overview

Amazon OpenSearch Service publishes cluster and node metrics to CloudWatch in the `AWS/ES` namespace automatically. For deeper Prometheus-compatible monitoring — including per-node JVM, indexing rates, search latencies, and shard-level detail — the **AWS Managed Collector** can scrape your VPC-access domain and export metrics to Amazon Managed Service for Prometheus (AMP) or CloudWatch's PromQL store.

This combination gives you both the native CloudWatch alarms path and the full PromQL query capability with Grafana dashboards, without running any self-managed Prometheus infrastructure.

OpenSearch also functions as a log analytics backend itself (ingesting logs from ECS, EKS, EC2 via Fluent Bit or Logstash), but this entry focuses on monitoring the OpenSearch *service* health rather than using it as a logging destination.

For complete reference material, see [Monitoring Amazon OpenSearch Service](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/monitoring.html).

## Prerequisites

- Amazon OpenSearch Service domain with **VPC access** (public-access domains are not supported by the managed collector)
- At least two subnets in different Availability Zones (same VPC as the domain)
- Security group allowing the collector to reach the domain endpoint over HTTPS (port 443)
- IAM permissions: `aps:CreateScraper`, `es:DescribeDomain`, `es:ESHttpGet`
- (Optional) AMP workspace for PromQL-based querying
- (Optional) AMG workspace with AMP or CloudWatch data source configured

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│              OpenSearch Domain (VPC access)                   │
│                                                              │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐             │
│  │  Data Node │  │  Data Node │  │  Data Node │             │
│  │  (metrics) │  │  (metrics) │  │  (metrics) │             │
│  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘             │
│        └────────────────┼────────────────┘                   │
│                         │ :443 HTTPS                         │
└─────────────────────────┼────────────────────────────────────┘
                          │ Pull (private VPC)
                          ▼
             ┌──────────────────────────┐
             │  AWS Managed Collector   │
             │  (fully managed)         │
             └────────────┬─────────────┘
                          │
             ┌────────────┼────────────┐
             ▼                         ▼
┌──────────────────────┐  ┌──────────────────────┐
│ Amazon Managed       │  │ Amazon CloudWatch    │
│ Prometheus (AMP)     │  │ (PromQL store)       │
└──────────┬───────────┘  └──────────────────────┘
           │
           ▼
┌──────────────────────┐
│ Amazon Managed       │
│ Grafana (AMG)        │
└──────────────────────┘
```

## Deploy

### Step 1: Configure the domain security group

Add an inbound rule allowing HTTPS from the collector's security group:

| Protocol | Port | Source | Purpose |
|----------|------|--------|---------|
| TCP | 443 | Scraper SG | Metric collection endpoint |

### Step 2: Create scrape configuration

Create `opensearch-config.yaml`:

```yaml
global:
  external_labels:
    domain_name: my-opensearch-domain

scrape_configs:
  - job_name: opensearch-exporter
    scrape_interval: 60s
```

The managed collector resolves domain endpoints automatically — you do not specify targets manually.

### Step 3: Create the managed collector scraper

```bash
aws amp create-scraper \
  --alias "opensearch-metrics-scraper" \
  --source '{
    "vpcConfiguration": {
      "subnetIds": ["subnet-abc123", "subnet-def456"],
      "securityGroupIds": ["sg-0123456789abcdef0"]
    }
  }' \
  --exporters '[
    {
      "openSearchConfiguration": {
        "domainArn": "arn:aws:es:us-west-2:123456789012:domain/my-opensearch-domain"
      }
    }
  ]' \
  --scrape-configuration configurationBlob=$(base64 -w 0 opensearch-config.yaml) \
  --destination '{
    "ampConfiguration": {
      "workspaceArn": "arn:aws:aps:us-west-2:123456789012:workspace/ws-abc123"
    }
  }'
```

Replace `ampConfiguration` with `cloudWatchConfiguration` (using a dataset ARN) to send metrics to CloudWatch PromQL store.

### Step 4: Set up CloudWatch alarms on native metrics

```bash
aws cloudwatch put-metric-alarm \
  --alarm-name "OpenSearch-ClusterRed" \
  --namespace AWS/ES \
  --metric-name "ClusterStatus.red" \
  --dimensions Name=DomainName,Value=my-opensearch-domain Name=ClientId,Value=123456789012 \
  --statistic Maximum \
  --period 60 \
  --threshold 1 \
  --comparison-operator GreaterThanOrEqualToThreshold \
  --evaluation-periods 1 \
  --alarm-actions arn:aws:sns:us-west-2:123456789012:ops-alerts
```

## Validate

1. **Check scraper status:**
   ```bash
   aws amp describe-scraper --scraper-id s-1234abcd-5678-90ef
   ```
   Wait for `ACTIVE` status.

2. **Query cluster health** (CloudWatch Query Studio or AMP):
   ```promql
   opensearch_cluster_health_status
   ```

3. **Query node-level JVM heap:**
   ```promql
   opensearch_jvm_mem_heap_used_in_bytes / opensearch_jvm_mem_heap_max_in_bytes * 100
   ```

4. **Check the vended dashboard:** CloudWatch → Dashboards → Templates → **OpenSearch OTel**.

### Key metrics to monitor

| Metric | Meaning | Alert Threshold |
|--------|---------|-----------------|
| `ClusterStatus.red` (CW) | At least one primary shard unassigned | = 1 |
| `FreeStorageSpace` (CW) | Available disk per node | < 20% of total |
| `JVMMemoryPressure` (CW) | JVM heap utilization | > 80% |
| `opensearch_indices_search_query_time_in_millis` (Prom) | Search latency | Trending upward |
| `opensearch_cluster_health_number_of_nodes` (Prom) | Node count | < expected |

## Troubleshoot

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| Scraper stuck in `CREATING` | Security group blocks HTTPS from collector to domain | Add inbound rule for port 443 from scraper SG to domain SG |
| No Prometheus metrics, CW metrics work fine | Domain uses public access (unsupported) | Migrate domain to VPC access or rely on native CW metrics only |
| `ClusterStatus.red` alarm firing | Primary shard unassigned (node failure, disk full) | Check `FreeStorageSpace`; increase instance count or storage; see [Red cluster troubleshooting](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/handling-errors.html#handling-errors-red-cluster-status) |
| JVM memory pressure > 90% | Field data or aggregation cache pressure | Reduce field data usage; increase instance size; enable [circuit breakers](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/handling-errors.html#handling-errors-jvm_out_of_memory_error) |
| Indexing latency increasing | Bulk queue full or merge pressure | Check `ThreadpoolWriteQueue`; reduce bulk request size; add data nodes |

## Related Solutions

- [RDS & Aurora Monitoring](../rds-aurora-monitoring/) — Monitor databases that store structured data alongside your OpenSearch analytics
- [Amazon MSK Monitoring](../msk-monitoring/) — Monitor Kafka clusters that stream data into OpenSearch
