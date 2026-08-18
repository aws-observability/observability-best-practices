---
title: EKS Monitoring with CloudWatch Container Insights
sidebar_label: EKS Container Insights
---

# EKS Monitoring with CloudWatch Container Insights

## Overview

Amazon CloudWatch Container Insights collects, aggregates, and summarizes metrics and logs from containerized applications running on Amazon EKS. It provides automatic dashboards at the cluster, node, pod, task, and service level using the CloudWatch agent (deployed as a DaemonSet) and Fluent Bit for log forwarding.

Container Insights gives you immediate visibility into CPU, memory, disk, and network utilization across your EKS workloads without application-level instrumentation. Metrics are published using the embedded metric format and stored as both performance log events (for deep analysis via CloudWatch Logs Insights) and aggregated CloudWatch metrics. For tracing, the ADOT add-on with AWS X-Ray provides distributed request tracing across your microservices.

This entry covers the fast-path setup using the CloudWatch agent and Fluent Bit. For AMP/AMG-based infrastructure monitoring, see [EKS Infrastructure Monitoring](../eks-infrastructure/). The full reference is in the [Container Insights documentation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html).

## Prerequisites

- Amazon EKS cluster (v1.25+) with managed or self-managed node groups
- `kubectl` configured for your cluster
- IAM permissions: nodes need the `CloudWatchAgentServerPolicy` managed policy
- AWS CLI v2 installed
- (For tracing) Certificate Manager installed in the cluster and ADOT EKS add-on prerequisites met

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        EKS Cluster                           │
│                                                              │
│  ┌─────────────────┐   ┌─────────────────┐                  │
│  │  Application    │   │  Application    │                  │
│  │  Pods           │   │  Pods           │                  │
│  │  (stdout/stderr)│   │  (X-Ray SDK)    │                  │
│  └────────┬────────┘   └────────┬────────┘                  │
│           │ logs                 │ traces                    │
│           ▼                      ▼                           │
│  ┌─────────────────┐   ┌─────────────────┐                  │
│  │  Fluent Bit     │   │  ADOT Collector │                  │
│  │  (DaemonSet)    │   │  (Deployment)   │                  │
│  └────────┬────────┘   └────────┬────────┘                  │
│           │                      │                           │
│  ┌────────┴────────┐            │                           │
│  │  CloudWatch     │            │                           │
│  │  Agent          │            │                           │
│  │  (DaemonSet)    │            │                           │
│  └────────┬────────┘            │                           │
│           │ metrics              │ traces                    │
└───────────┼──────────────────────┼───────────────────────────┘
            │                      │
            ▼                      ▼
┌─────────────────────┐  ┌─────────────────────┐
│  CloudWatch         │  │  AWS X-Ray          │
│  - Metrics          │  │  - Service Map      │
│  - Logs             │  │  - Trace Analytics  │
│  - Dashboards       │  └─────────────────────┘
└─────────────────────┘
```

## Deploy

### Step 1: Install the CloudWatch agent (Container Insights metrics)

Install the CloudWatch agent as a DaemonSet using the quick-start manifest:

```bash
ClusterName=<your-cluster-name>
RegionName=<your-region>
FluentBitHttpPort='2020'
FluentBitReadFromHead='Off'

curl -s https://raw.githubusercontent.com/aws-samples/amazon-cloudwatch-container-insights/latest/k8s-deployment-manifest-templates/deployment-mode/daemonSet/container-insights-monitoring/quickstart/cwagent-fluent-bit-quickstart.yaml \
  | sed "s/{{cluster_name}}/${ClusterName}/;s/{{region_name}}/${RegionName}/;s/{{http_server_toggle}}/On/;s/{{http_server_port}}/${FluentBitHttpPort}/;s/{{read_from_head}}/${FluentBitReadFromHead}/" \
  | kubectl apply -f -
```

This deploys both the CloudWatch agent (metrics) and Fluent Bit (logs) in the `amazon-cloudwatch` namespace.

### Step 2: Verify DaemonSet pods

```bash
kubectl get pods -n amazon-cloudwatch
```

All pods should be in `Running` state (one per node).

### Step 3: Enable control plane logging (optional)

```bash
aws eks update-cluster-config \
  --name $ClusterName \
  --region $RegionName \
  --logging '{"clusterLogging":[{"types":["api","audit","authenticator","controllerManager","scheduler"],"enabled":true}]}'
```

### Step 4: Enable X-Ray tracing (optional)

Install the ADOT add-on for distributed tracing:

```bash
aws eks create-addon --addon-name adot --cluster-name $ClusterName --region $RegionName
```

Then deploy an `OpenTelemetryCollector` custom resource with the X-Ray exporter. See the [ADOT X-Ray collector config](https://github.com/aws-observability/aws-otel-community/blob/master/sample-configs/operator/collector-config-xray.yaml) for a ready-to-use template.

## Validate

1. **Check Container Insights dashboards:**
   Navigate to CloudWatch → Container Insights → Performance monitoring. Select your cluster and verify metrics appear for nodes, pods, and services.

2. **Verify log groups exist:**
   ```bash
   aws logs describe-log-groups --log-group-name-prefix "/aws/containerinsights/${ClusterName}" --region $RegionName
   ```
   Expected groups: `/aws/containerinsights/<cluster>/application`, `/aws/containerinsights/<cluster>/host`, `/aws/containerinsights/<cluster>/dataplane`, `/aws/containerinsights/<cluster>/performance`.

3. **Query logs with Logs Insights:**
   ```
   stats avg(CpuUtilized) as CPU, avg(MemoryUtilized) as Mem by PodName
   | sort CPU desc
   | limit 10
   ```

4. **Verify X-Ray traces (if enabled):**
   Open the CloudWatch → X-Ray traces → Service map console and confirm your services appear.

## Troubleshoot

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| No metrics in Container Insights dashboard | CloudWatch agent DaemonSet not running | Run `kubectl get ds -n amazon-cloudwatch` and check pod logs |
| Missing log groups | Fluent Bit pods crashing or IAM permissions missing | Verify node IAM role has `CloudWatchAgentServerPolicy`; check `kubectl logs -n amazon-cloudwatch -l app=fluent-bit` |
| Partial node metrics | Agent not scheduled on all nodes | Check for taints/tolerations preventing scheduling on some nodes |
| High CloudWatch costs | Default config exports all metrics and dimensions | Use filter processors or customize `metric_declarations` in the EMF exporter to reduce cardinality |
| X-Ray traces not appearing | ADOT collector missing IAM permissions | Ensure service account is annotated with an IAM role that has `AWSXRayDaemonWriteAccess` |

## Related Solutions

- [EKS Infrastructure Monitoring](../eks-infrastructure/) — Prometheus/Grafana-based infrastructure monitoring with Terraform accelerator
- [EKS Application Signals](../eks-application-signals/) — Application-level APM with automatic instrumentation and SLOs
