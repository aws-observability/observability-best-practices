# Monitoring Amazon OpenSearch Service with AWS Managed Collector

In this recipe we show you how to use the [AWS Managed Collector][amp-collector] to collect
[Prometheus][prom-main] metrics from [Amazon OpenSearch Service][opensearch-main]
domains and deliver them to [Amazon CloudWatch][cw-main] or [Amazon Managed Service for Prometheus (AMP)][amp-main].

!!! note
    This guide applies to **VPC-access domains only**. Domains with public access are not supported.

## Infrastructure

### Architecture

The managed collector connects to your OpenSearch domain's VPC endpoint over HTTPS (port 443), collects cluster, node, and index metrics, and delivers them to your chosen destination.

```
OpenSearch Domain (port 443, VPC access)
        │
        ▼ (HTTPS over private VPC networking)
AWS Managed Collector (fully managed)
        │
        ├──→ Amazon Managed Prometheus (AMP workspace)
        └──→ Amazon CloudWatch (PromQL)
```

Available metrics include:

- **Cluster metrics** — health status, number of nodes and data nodes, active and relocating shards, pending tasks
- **Node metrics** — CPU usage, JVM heap and GC, OS memory, disk usage, thread pool activity
- **Index metrics** — indexing and search rates/latencies, document counts, merge and refresh activity, cache usage

For a complete list, see [Metrics collected from Amazon OpenSearch Service](https://docs.aws.amazon.com/prometheus/latest/userguide/prom-opensearch-integration.html#prom-opensearch-metrics) in the AMP User Guide.

### Prerequisites

- An Amazon OpenSearch Service domain with **VPC access** (public-access domains are not supported)
- At least two subnets in different Availability Zones
- Security group allowing the collector to reach your domain endpoint over HTTPS (port 443)
- IAM permissions to call `aps:CreateScraper` and create the service-linked role
- VPC endpoint for CloudWatch (if subnets have no internet access)

### Configure security groups

Add an inbound rule to your domain's security group allowing HTTPS from the collector's security group:

| Rule | Protocol | Port | Source |
|------|----------|------|--------|
| Domain endpoint | TCP | 443 | Scraper security group |

### Set up the scrape configuration

You do not specify scrape targets — the collector resolves and collects from the domain you pass in the `exporters` field when you create the scraper. The scrape configuration just needs a job named `opensearch-exporter`, which tells the collector to activate OpenSearch collection for that domain. Set the `scrape_interval` here to control how often metrics are collected.

Create `opensearch-config.yaml`:

```yaml
global:
  external_labels:
    domain_name: my-opensearch-domain

scrape_configs:
  - job_name: opensearch-exporter
    scrape_interval: 60s
```

### Create the scraper

You specify the domain in the `exporters` field (not in the scrape configuration targets).

**CloudWatch destination:**

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
    "cloudWatchConfiguration": {
      "datasetArn": "arn:aws:cloudwatch:us-west-2:123456789012:dataset/default"
    }
  }'
```

**AMP destination:**

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

Then run this query in [CloudWatch Query Studio](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-PromQL-QueryStudio.html) to confirm metrics are flowing:

```promql
opensearch_cluster_health_status
```

If it returns data points, the collector is working.

### View the automatic dashboard

Once metrics are flowing, CloudWatch provides a vended **OpenSearch OTel** dashboard. In the CloudWatch console, go to **Dashboards → Templates → OpenSearch OTel** (or open it directly at `https://<region>.console.aws.amazon.com/cloudwatch/home#dashboards/templates/opensearch-otel`). You can use it as-is or add its widgets to a custom dashboard.

### Example queries

```promql
# Cluster health status
opensearch_cluster_health_status

# Number of nodes in the cluster
opensearch_cluster_health_number_of_nodes

# JVM heap utilization per node
opensearch_jvm_mem_heap_used_in_bytes / opensearch_jvm_mem_heap_max_in_bytes * 100

# Indexing rate
rate(opensearch_indices_indexing_index_total[5m])

# Search latency
rate(opensearch_indices_search_query_time_in_millis[5m]) / rate(opensearch_indices_search_query_total[5m])
```

!!! info
    The collector automatically enriches each metric with cloud attributes (AWS account, Region) and a unit inferred from the metric name. You can filter and group on these attributes in PromQL.

## Current limitations

- Only domains with VPC access are supported
- Each scraper collects from a single OpenSearch domain — create a separate scraper per domain

## Cleanup

To delete the scraper:

```bash
aws amp delete-scraper --scraper-id s-1234abcd-5678-90ef-abcd-1234567890ab
```

This removes the scraper and its ENIs. Metrics already ingested are retained per their destination's retention policy.

[amp-collector]: https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-collector.html
[amp-main]: https://aws.amazon.com/prometheus/
[opensearch-main]: https://aws.amazon.com/opensearch-service/
[cw-main]: https://aws.amazon.com/cloudwatch/
[prom-main]: https://prometheus.io/
