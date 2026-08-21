---
title: Amazon MSK Monitoring
sidebar_label: MSK Monitoring
---

# Amazon MSK Monitoring

## Overview

Amazon Managed Streaming for Apache Kafka (MSK) provides multiple monitoring levels. At the basic level, CloudWatch receives broker, topic, and consumer group metrics automatically. For deeper visibility, **Open Monitoring** exposes a JMX Exporter (port 11001) and Node Exporter (port 11002) on each broker, making Prometheus-compatible scraping possible.

The **AWS Managed Collector** provides a fully managed, agentless path to scrape these endpoints and deliver metrics to Amazon Managed Service for Prometheus (AMP) or CloudWatch's PromQL-compatible store. This eliminates the need to self-manage Prometheus servers inside your VPC.

This entry covers enabling Open Monitoring, deploying the AWS Managed Collector, and validating end-to-end metric flow. For the complete MSK monitoring reference, see [Monitoring Amazon MSK](https://docs.aws.amazon.com/msk/latest/developerguide/monitoring.html).

:::note
This guide applies to **MSK Provisioned** clusters only. MSK Serverless and MSK Express do not support Open Monitoring.
:::

## Prerequisites

- Amazon MSK Provisioned cluster
- Open Monitoring enabled (JMX Exporter on port 11001, Node Exporter on port 11002)
- VPC with DNS enabled
- At least two subnets in different AZs (same VPC as MSK)
- Security group allowing the collector to reach broker ports 11001 and 11002
- IAM permissions: `aps:CreateScraper`, `kafka:DescribeCluster`, `kafka:GetBootstrapBrokers`
- (Optional) AMP workspace for long-term metric storage
- (Optional) AMG workspace with AMP or CloudWatch data source

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   MSK Cluster (VPC)                          │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │  Broker 1   │  │  Broker 2   │  │  Broker 3   │        │
│  │ :11001 JMX  │  │ :11001 JMX  │  │ :11001 JMX  │        │
│  │ :11002 Node │  │ :11002 Node │  │ :11002 Node │        │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘        │
└─────────┼────────────────┼────────────────┼────────────────┘
          │                │                │
          └────────────────┼────────────────┘
                           │ Pull (private VPC)
                           ▼
              ┌──────────────────────────┐
              │  AWS Managed Collector   │
              │  (fully managed)         │
              └─────────────┬────────────┘
                            │
              ┌─────────────┼─────────────┐
              ▼                           ▼
┌──────────────────────┐    ┌──────────────────────┐
│ Amazon Managed       │    │ Amazon CloudWatch    │
│ Prometheus (AMP)     │    │ (PromQL store)       │
└──────────┬───────────┘    └──────────────────────┘
           │
           ▼
┌──────────────────────┐
│ Amazon Managed       │
│ Grafana (AMG)        │
└──────────────────────┘
```

## Deploy

### Step 1: Enable Open Monitoring

```bash
aws kafka update-monitoring \
  --cluster-arn "arn:aws:kafka:us-west-2:123456789012:cluster/my-cluster/abc-uuid" \
  --current-version "K1V2E3N4" \
  --open-monitoring '{
    "prometheus": {
      "jmxExporter": {"enabledInBroker": true},
      "nodeExporter": {"enabledInBroker": true}
    }
  }'
```

:::warning
Enabling Open Monitoring on an existing cluster triggers a rolling restart. Plan during a maintenance window.
:::

### Step 2: Configure security groups

Add inbound rules to the MSK cluster's security group:

| Protocol | Port | Source | Purpose |
|----------|------|--------|---------|
| TCP | 11001 | Scraper SG | JMX Exporter |
| TCP | 11002 | Scraper SG | Node Exporter |

### Step 3: Create scrape configuration

Get your cluster DNS name:

```bash
aws kafka get-bootstrap-brokers \
  --cluster-arn "arn:aws:kafka:us-west-2:123456789012:cluster/my-cluster/abc-uuid"
```

Create `msk-scrape-config.yaml`:

```yaml
global:
  scrape_interval: 60s
  external_labels:
    cluster_name: my-msk-cluster

scrape_configs:
  - job_name: 'msk-jmx'
    dns_sd_configs:
      - names:
          - my-cluster.abc123.c4.kafka.us-west-2.amazonaws.com
        type: A
        port: 11001
    metric_relabel_configs:
      - source_labels: [topic]
        regex: '__consumer_offsets|__amazon_msk_.*|__transaction_state'
        action: drop

  - job_name: 'msk-node'
    dns_sd_configs:
      - names:
          - my-cluster.abc123.c4.kafka.us-west-2.amazonaws.com
        type: A
        port: 11002
```

### Step 4: Create the managed collector scraper

```bash
aws amp create-scraper \
  --alias "msk-metrics-scraper" \
  --source '{
    "vpcConfiguration": {
      "subnetIds": ["subnet-abc123", "subnet-def456"],
      "securityGroupIds": ["sg-0123456789abcdef0"]
    }
  }' \
  --scrape-configuration configurationBlob=$(base64 -w 0 msk-scrape-config.yaml) \
  --destination '{
    "ampConfiguration": {
      "workspaceArn": "arn:aws:aps:us-west-2:123456789012:workspace/ws-abc123"
    }
  }'
```

Replace `ampConfiguration` with `cloudWatchConfiguration` to send metrics to CloudWatch PromQL store instead.

## Validate

1. **Check scraper status:**
   ```bash
   aws amp describe-scraper --scraper-id s-1234abcd-5678-90ef
   ```
   Wait for `ACTIVE` status.

2. **Query JMX metrics** (CloudWatch Query Studio or AMP):
   ```promql
   kafka_server_BrokerTopicMetrics_MeanRate
   ```

3. **Query Node metrics:**
   ```promql
   100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)
   ```

4. **Check the vended dashboard:** CloudWatch → Dashboards → Templates → **MSK OTel**.

### Key metrics to monitor

| Metric | Meaning | Alert Threshold |
|--------|---------|-----------------|
| `kafka_server_ReplicaManager_Value{name="UnderReplicatedPartitions"}` | Partitions lacking replicas | > 0 |
| `kafka_controller_KafkaController_Value{name="ActiveControllerCount"}` | Cluster controllers | ≠ 1 |
| `kafka_server_BrokerTopicMetrics_OneMinuteRate{name="BytesInPerSec"}` | Ingress throughput | Baseline + 50% |
| `java_lang_Memory_HeapMemoryUsage_used` / `max` | JVM heap utilization | > 80% |

## Troubleshoot

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| Scraper stuck in `CREATING` | Security group blocks collector → broker | Add inbound rules for ports 11001/11002 from scraper SG |
| No JMX metrics returned | Open Monitoring not enabled | Run `update-monitoring` to enable JMX Exporter |
| Partial broker coverage | DNS resolution returning subset | Verify all broker IPs resolve from scraper subnets; check DNS SD config name |
| `UnderReplicatedPartitions` spiking | Broker under load or restarting | Check broker CPU/memory; verify disk IOPS not saturated |
| Consumer lag not visible | JMX Exporter doesn't expose consumer lag | Deploy [kafka_exporter](https://github.com/danielqsj/kafka_exporter) as a sidecar and add it as a static target |

## Related Solutions

- [Kafka on EC2](../kafka-ec2/) — Self-managed Kafka monitoring with Prometheus on EC2
- [Amazon OpenSearch Service Monitoring](../opensearch-monitoring/) — Monitor OpenSearch domains that consume MSK data
