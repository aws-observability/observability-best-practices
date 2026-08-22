---
title: EKS Infrastructure Monitoring
sidebar_label: EKS Infrastructure
---

# EKS Infrastructure Monitoring

## Overview

Monitor the health and performance of your Amazon EKS cluster infrastructure — nodes, pods, control plane, and cluster networking — using three collection paths that deliver metrics to CloudWatch, Amazon Managed Service for Prometheus (AMP), or both.

**Choose your path:**

| Situation | Path |
|-----------|------|
| You want the fastest default with minimal configuration | **Path 1 — Container Insights with OpenTelemetry** |
| You run GPU, AWS Neuron (Trainium/Inferentia), or EFA workloads | **Path 1** — accelerator metrics are collected out of the box |
| You need control over exactly which metrics are scraped, with PromQL access in CloudWatch | **Path 2 — CloudWatch managed Prometheus collector** |
| You already run Amazon Managed Service for Prometheus as your metrics store | **Path 3 — Self-managed collector into AMP** |

All three paths use OpenTelemetry-based collection. They differ in what is collected, where it lands, and how much you configure.

## Prerequisites

- Amazon EKS cluster (v1.25+)
- AWS CLI v2 configured with appropriate permissions
- `kubectl` configured for your cluster
- **Path 1:** Permissions to install EKS add-ons (`eks:CreateAddon`)
- **Path 2:** Permissions to create a CloudWatch managed collector (`cloudwatch:CreateCollector`, `aps:CreateScraper`)
- **Path 3:** An AMP workspace, an IAM role with `aps:RemoteWrite` for the collector service account, and an Amazon Managed Grafana workspace with an AMP data source configured

## Architecture

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                              EKS Cluster                                      │
│                                                                               │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐  ┌───────────┐  │
│  │ kubelet/cAdvisor│  │kube-state-     │  │ Node Exporter  │  │ API Server│  │
│  │                │  │metrics         │  │ (DaemonSet)    │  │ /metrics  │  │
│  └───────┬────────┘  └───────┬────────┘  └───────┬────────┘  └─────┬─────┘  │
│          │                    │                    │                  │        │
│          └────────────────────┼────────────────────┼──────────────────┘        │
│                               │                    │                           │
│  ┌─ Path 1 ──────────────────┐│┌─ Path 2 ────────┐│┌─ Path 3 ──────────────┐ │
│  │ CloudWatch Agent          │││ CW Managed       │││ ADOT Collector        │ │
│  │ (amazon-cloudwatch-       │││ Prometheus       │││ (DaemonSet)           │ │
│  │  observability add-on)    │││ Collector        │││                       │ │
│  └───────────┬───────────────┘│└────────┬─────────┘│└───────────┬───────────┘ │
│              │                │         │          │            │             │
└──────────────┼────────────────┼─────────┼──────────┼────────────┼─────────────┘
               │                │         │          │            │
               ▼                │         ▼          │            ▼
    ┌───────────────────┐       │  ┌────────────────┐│  ┌──────────────────────┐
    │  CloudWatch       │       │  │  CloudWatch    ││  │  Amazon Managed      │
    │  Container        │       │  │  (PromQL API)  ││  │  Prometheus (AMP)    │
    │  Insights         │       │  └───────┬────────┘│  └──────────┬───────────┘
    └───────────────────┘       │          │         │             │
                                │          ▼         │             ▼
                                │  ┌────────────────┐│  ┌──────────────────────┐
                                │  │  Grafana /     ││  │  Amazon Managed      │
                                │  │  CW Console    ││  │  Grafana (AMG)       │
                                │  └────────────────┘│  └──────────────────────┘
                                │                    │
```

## Deploy

### Path 1 — Container Insights with OpenTelemetry (recommended default)

Container Insights with enhanced observability provides node, pod, container, and control plane metrics out of the box. It is the fastest path to full-cluster visibility and requires no custom scrape configuration.

Install the **amazon-cloudwatch-observability** EKS add-on, which deploys the CloudWatch Agent with OpenTelemetry-based collection:

```bash
aws eks create-addon \
  --cluster-name <CLUSTER_NAME> \
  --addon-name amazon-cloudwatch-observability \
  --region <REGION>
```

The add-on collects infrastructure metrics and sends them to CloudWatch Container Insights automatically. Dashboards appear in the CloudWatch console under **Container Insights**.

**Accelerated computing.** This path is the only one with out-of-the-box support
for accelerator hardware, which matters if you run training or inference on EKS:

- **NVIDIA GPU** metrics — utilisation, memory, temperature, and power per GPU
- **AWS Neuron** metrics for Trainium and Inferentia, collected via
  `neuron-monitor`, including NeuronCore utilisation and device memory
- **Elastic Fabric Adapter (EFA)** metrics for the high-throughput interconnect
  used by distributed training

The add-on discovers and collects these automatically when the relevant device
plugins are present, with no scrape configuration. On paths 2 and 3 you would
build the equivalent yourself from DCGM and Neuron exporters. See
[Container Insights accelerated compute monitoring](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/container-insights-detailed-metrics.html).

For full setup details including IAM role configuration and Fargate support, see:

- [Container Insights EKS quick start](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-setup-EKS-quickstart.html)
- [Enhanced observability for EKS](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-Enhanced-EKS.html)

### Path 2 — CloudWatch managed Prometheus collector

Use this path when you want to choose which Prometheus metrics are scraped rather than accept the Container Insights default set. Metrics land in CloudWatch and are queryable with PromQL.

Create a managed scraper that discovers and scrapes Prometheus endpoints within your cluster. The scraper runs in the AWS service account and delivers metrics to CloudWatch:

```bash
aws amp create-scraper \
  --source eksConfiguration="{clusterArn=arn:aws:eks:<REGION>:<ACCOUNT>:cluster/<CLUSTER>,securityGroupIds=[<SG_ID>],subnetIds=[<SUBNET_1>,<SUBNET_2>]}" \
  --destination cloudWatchConfiguration="{}" \
  --scrape-configuration configurationBlob="<BASE64_SCRAPE_CONFIG>"
```

The scrape configuration uses standard Prometheus format. Include jobs for `kubernetes-apiservers`, `kube-state-metrics`, `node-exporter`, and `kubelet` cAdvisor endpoints to cover the full infrastructure surface.

See the [managed scraper documentation](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-collector-how-to.html) for the complete configuration reference.

**Visualisation — option A: Grafana dashboards from the artifacts repository**

Download pre-built Grafana dashboards for EKS infrastructure:

```bash
curl -o eks-cluster-dashboard.json \
  https://raw.githubusercontent.com/aws-observability/aws-observability-accelerator/main/artifacts/grafana-dashboards/eks/cloudwatch-otlp/cluster.json

curl -o eks-namespace-dashboard.json \
  https://raw.githubusercontent.com/aws-observability/aws-observability-accelerator/main/artifacts/grafana-dashboards/eks/cloudwatch-otlp/namespace.json

curl -o eks-node-dashboard.json \
  https://raw.githubusercontent.com/aws-observability/aws-observability-accelerator/main/artifacts/grafana-dashboards/eks/cloudwatch-otlp/node.json
```

In Grafana, add a **Prometheus** data source pointed at the CloudWatch PromQL endpoint with SigV4 authentication and the **Service** set to `monitoring`. This does not require Amazon Managed Service for Prometheus — the PromQL API is a CloudWatch query surface over OTLP-ingested metrics. Select that data source for the dashboard's `datasource` variable on import.

**Visualisation — option B: CloudWatch console**

Navigate to **CloudWatch > Metrics > All metrics** and query using PromQL syntax directly. A default EKS infrastructure dashboard is available under **CloudWatch > Dashboards > Automatic dashboards > EKS**.

### Path 3 — Self-managed collector into Amazon Managed Service for Prometheus

Use this path when your organisation already uses AMP as the metrics store. It offers the most flexibility in collection and retention, and integrates with Amazon Managed Grafana for visualisation.

This path deploys the AWS Distro for OpenTelemetry (ADOT) Collector as a DaemonSet, scraping Prometheus-format metric sources and remote-writing to AMP.

**Metric sources to scrape:**

| Layer | Source | Endpoint |
|-------|--------|----------|
| Control Plane | API Server | `<api-server>/metrics` (Prometheus format natively) |
| Cluster State | kube-state-metrics | `kube-state-metrics:8080/metrics` |
| VPC CNI | cni-metrics-helper | `cni-metrics-helper/metrics` |
| CoreDNS | CoreDNS | `core-dns:9153/metrics` |
| Node | Prometheus node-exporter | `node-exporter:9100/metrics` |
| Pod/Container | kubelet cAdvisor | `kubelet/metrics/cadvisor` |

**Install the ADOT EKS add-on:**

```bash
aws eks create-addon \
  --cluster-name <CLUSTER_NAME> \
  --addon-name adot \
  --region <REGION>
```

**Configure the collector pipeline.** The ADOT Collector uses the OpenTelemetry Collector configuration format. The key elements are a Prometheus receiver with scrape jobs for each source above, and a Prometheus Remote Write exporter pointed at your AMP workspace:

```yaml
exporters:
  prometheusremotewrite:
    endpoint: <YOUR_AMP_REMOTE_WRITE_ENDPOINT>
    auth:
      authenticator: sigv4auth

extensions:
  sigv4auth:
    region: <REGION>
    service: "aps"

receivers:
  prometheus:
    config:
      global:
        scrape_interval: 60s
        scrape_timeout: 10s
      scrape_configs:
        - job_name: kubernetes-apiservers
          # Discovers API server endpoint via kubernetes_sd_configs
        - job_name: kube-state-metrics
        - job_name: node-exporter
        - job_name: kubelet-cadvisor
        - job_name: coredns
        - job_name: vpc-cni

processors:
  batch/metrics:
    timeout: 30s
    send_batch_size: 500

service:
  extensions: [sigv4auth]
  pipelines:
    metrics:
      receivers: [prometheus]
      processors: [batch/metrics]
      exporters: [prometheusremotewrite]
```

See the [ADOT EKS add-on documentation](https://docs.aws.amazon.com/eks/latest/userguide/opentelemetry.html) for advanced collector configuration including deployment modes and multiple collector instances.

**IAM:** The collector's service account must be annotated with an IAM role that has `aps:RemoteWrite` permission to your AMP workspace. Use IAM Roles for Service Accounts (IRSA) or EKS Pod Identity.

**Terraform option:** The [terraform-aws-observability-accelerator](https://github.com/aws-observability/terraform-aws-observability-accelerator) can still provision this entire path (ADOT, AMP workspace, AMG dashboards, alerting rules). Note that this repository is **no longer actively maintained** — evaluate whether the existing modules meet your needs before adopting it, and be prepared to maintain your fork.

## Validate

### Path 1 — Container Insights

1. Verify the add-on is active:
   ```bash
   aws eks describe-addon --cluster-name <CLUSTER_NAME> \
     --addon-name amazon-cloudwatch-observability --region <REGION> \
     --query "addon.status"
   ```
   Expected: `"ACTIVE"`

2. Confirm metrics in the CloudWatch console: navigate to **Container Insights > Performance monitoring** and select your cluster.

### Path 2 — CloudWatch managed collector

1. Verify the scraper is active:
   ```bash
   aws amp list-scrapers --region <REGION> \
     --query "scrapers[?alias=='<SCRAPER_NAME>'].status"
   ```

2. Query a metric using PromQL in the CloudWatch console:
   ```
   up{job="kube-state-metrics"}
   ```

### Path 3 — Self-managed collector into AMP

1. Check ADOT Collector pods are running:
   ```bash
   kubectl get pods -n opentelemetry-operator-system
   ```

2. Verify metrics in AMP using `awscurl`:
   ```bash
   awscurl --service aps --region <REGION> \
     "https://aps-workspaces.<REGION>.amazonaws.com/workspaces/{workspace_id}/api/v1/query?query=up"
   ```
   Replace `{workspace_id}` with your AMP workspace ID (format: `ws-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`). You can retrieve it with `aws amp list-workspaces --region <REGION>`.

3. Check Grafana dashboards: navigate to your AMG workspace and confirm the imported EKS infrastructure dashboards display data.

## Troubleshoot

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| Container Insights add-on status is `DEGRADED` | Missing IAM permissions for the CloudWatch agent service account | Attach the `CloudWatchAgentServerPolicy` managed policy to the node role or configure IRSA; see the [quick start prerequisites](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-setup-EKS-quickstart.html) |
| Managed scraper shows `CREATION_FAILED` | Security group or subnet does not allow outbound connectivity to the cluster API | Ensure the scraper's security group allows HTTPS egress to the cluster endpoint and that subnets have NAT or VPC endpoints for CloudWatch |
| No metrics in AMP after deploying ADOT | IRSA not configured or service account annotation missing | Verify the service account annotation matches the IAM role ARN with `aps:RemoteWrite` permission |
| ADOT Collector pods in CrashLoopBackOff | Invalid collector YAML or unreachable scrape targets | Inspect logs with `kubectl logs -n opentelemetry-operator-system <pod>` and validate the configuration |
| Grafana shows "No Data" for CloudWatch PromQL dashboards | Data source not pointed at the correct endpoint or missing SigV4 configuration | Set the Prometheus data source URL to `https://monitoring.<REGION>.amazonaws.com` with SigV4 service `monitoring` |
| Partial metrics — control plane metrics missing | API server scrape target not discovered | Confirm the scrape config includes `kubernetes-apiservers` job with `kubernetes_sd_configs` role `endpoints` and correct TLS settings |

## Related Solutions

- [EKS Application Signals](../eks-application-signals/) — Add application-level tracing and metrics with zero-code instrumentation
- [ECS Monitoring](../ecs-monitoring/) — Infrastructure and task-level monitoring for Amazon ECS clusters
