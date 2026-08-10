# Monitoring Amazon MSK with AWS Managed Collector

In this recipe we show you how to use the [AWS Managed Collector][amp-collector] to collect
[Prometheus][prom-main] metrics from [Amazon Managed Streaming for Apache Kafka (MSK)][msk-main]
and deliver them to [Amazon CloudWatch][cw-main] or [Amazon Managed Service for Prometheus (AMP)][amp-main].

!!! note
    This guide applies to **MSK Provisioned** clusters only. MSK Serverless and MSK Express clusters do not support Open Monitoring.

## Infrastructure

### Architecture

Amazon MSK's [Open Monitoring][msk-open-monitoring] feature runs two Prometheus-compatible exporters on each broker:

| Exporter | Port | Metrics |
|----------|------|---------|
| **JMX Exporter** | 11001 | Kafka application metrics — throughput, replication, request processing, JVM |
| **Node Exporter** | 11002 | Host-level OS metrics — CPU, memory, disk, network, filesystem |

The Managed Collector creates network interfaces (ENIs) in your VPC, scrapes these endpoints over private networking, and exports the metrics to your chosen destination.

```
MSK Brokers (port 11001/11002)
        │
        ▼ (pull over private VPC networking)
AWS Managed Collector (fully managed)
        │
        ├──→ Amazon Managed Prometheus (AMP workspace)
        └──→ Amazon CloudWatch (PromQL)
```

For a complete list of available metrics, see [MSK metrics collected by managed collectors](https://docs.aws.amazon.com/prometheus/latest/userguide/prom-msk-integration.html#prom-msk-metrics) in the AMP User Guide.

### Prerequisites

- Amazon MSK cluster with Open Monitoring enabled (JMX Exporter on port 11001, Node Exporter on port 11002)
- VPC with DNS enabled
- At least two subnets in different Availability Zones (same VPC as MSK)
- Security group allowing the collector to reach broker ports 11001 and 11002
- IAM permissions to call `aps:CreateScraper` and create the service-linked role
- VPC endpoint for CloudWatch (if subnets have no internet access)

### Enable Open Monitoring

If not already enabled on your cluster:

```bash
aws kafka update-monitoring \
  --cluster-arn "arn:aws:kafka:us-west-2:123456789012:cluster/my-cluster/abc123-uuid" \
  --current-version "K1V2E3N4" \
  --open-monitoring '{
    "prometheus": {
      "jmxExporter": {"enabledInBroker": true},
      "nodeExporter": {"enabledInBroker": true}
    }
  }'
```

!!! warning
    Enabling Open Monitoring on an existing cluster triggers a rolling restart. Plan this during a maintenance window.

### Configure security groups

The MSK cluster's security group must allow inbound traffic from the scraper:

| Rule | Protocol | Port | Source |
|------|----------|------|--------|
| JMX Exporter | TCP | 11001 | Scraper security group |
| Node Exporter | TCP | 11002 | Scraper security group |

### Set up the scrape configuration

Get your cluster DNS name (strip the `b-N.` broker prefix):

```bash
aws kafka get-bootstrap-brokers \
  --cluster-arn "arn:aws:kafka:us-west-2:123456789012:cluster/my-cluster/abc123-uuid"
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
    relabel_configs:
      - source_labels: [__meta_dns_name]
        target_label: broker_dns
      - source_labels: [__address__]
        target_label: instance
      - target_label: compute_platform
        replacement: 'msk'
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
    relabel_configs:
      - source_labels: [__meta_dns_name]
        target_label: broker_dns
      - source_labels: [__address__]
        target_label: instance
      - target_label: compute_platform
        replacement: 'msk'
```

### Create the scraper

**CloudWatch destination:**

```bash
aws amp create-scraper \
  --alias "msk-metrics-scraper" \
  --source '{
    "vpcConfiguration": {
      "subnetIds": ["subnet-abc123", "subnet-def456"],
      "securityGroupIds": ["sg-0123456789abcdef0"]
    }
  }' \
  --scrape-configuration configurationBlob=$(cat msk-scrape-config.yaml | base64 -w 0) \
  --destination '{
    "cloudWatchConfiguration": {
      "datasetArn": "arn:aws:cloudwatch:us-west-2:123456789012:dataset/default"
    }
  }'
```

**AMP destination:**

```bash
aws amp create-scraper \
  --alias "msk-metrics-scraper" \
  --source '{
    "vpcConfiguration": {
      "subnetIds": ["subnet-abc123", "subnet-def456"],
      "securityGroupIds": ["sg-0123456789abcdef0"]
    }
  }' \
  --scrape-configuration configurationBlob=$(cat msk-scrape-config.yaml | base64 -w 0) \
  --destination '{
    "ampConfiguration": {
      "workspaceArn": "arn:aws:aps:us-west-2:123456789012:workspace/ws-abc123def456"
    }
  }'
```

## End-to-end

### Verify your pipeline is working

Wait for the scraper to become `ACTIVE`:

```bash
aws amp describe-scraper --scraper-id s-1234abcd-5678-90ef-abcd-1234567890ab
```

Then run these queries in [CloudWatch Query Studio](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-PromQL-QueryStudio.html) to confirm both exporters are scraped:

```promql
# JMX Exporter (port 11001) — broker topic activity
kafka_server_BrokerTopicMetrics_MeanRate

# Node Exporter (port 11002) — CPU utilization
100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)
```

If both return data points, the collector is working.

### View the automatic dashboard

Once metrics are flowing, CloudWatch provides a vended **MSK OTel** dashboard. In the CloudWatch console, go to **Dashboards → Templates → MSK OTel** (or open it directly at `https://<region>.console.aws.amazon.com/cloudwatch/home#dashboards/templates/msk-otel`). You can use it as-is or add its widgets to a custom dashboard.

!!! info
    The collector automatically enriches each metric with cloud attributes (AWS account, Region) and a unit inferred from the metric name. You can filter and group on these attributes in PromQL.

### Example queries

```promql
# Total throughput across all brokers
sum(kafka_server_BrokerTopicMetrics_OneMinuteRate{name="BytesInPerSec"})

# Under-replicated partitions (should be 0)
sum(kafka_server_ReplicaManager_Value{name="UnderReplicatedPartitions"})

# Active controller count (should be exactly 1)
kafka_controller_KafkaController_Value{name="ActiveControllerCount"}

# JVM heap utilization
java_lang_Memory_HeapMemoryUsage_used / java_lang_Memory_HeapMemoryUsage_max * 100
```

!!! note
    Consumer group lag is not directly exposed by the MSK JMX Exporter. For detailed consumer lag monitoring, deploy a [kafka_exporter](https://github.com/danielqsj/kafka_exporter) and scrape it with a `static_configs` target.

## Cleanup

To delete the scraper:

```bash
aws amp delete-scraper --scraper-id s-1234abcd-5678-90ef-abcd-1234567890ab
```

This removes the scraper and its ENIs. Metrics already ingested are retained per their destination's retention policy.

[amp-collector]: https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-collector.html
[amp-main]: https://aws.amazon.com/prometheus/
[msk-main]: https://aws.amazon.com/msk/
[msk-open-monitoring]: https://docs.aws.amazon.com/msk/latest/developerguide/open-monitoring.html
[cw-main]: https://aws.amazon.com/cloudwatch/
[prom-main]: https://prometheus.io/
