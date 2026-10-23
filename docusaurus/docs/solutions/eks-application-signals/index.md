---
title: EKS Java Application Monitoring
sidebar_label: EKS Java/JVM
---

# EKS Java Application Monitoring

## Overview

Instrument Java/JVM applications running on Amazon EKS with CloudWatch Application Signals for automatic service map generation, latency tracking, and error rate monitoring — with zero code changes.

Application Signals uses the OpenTelemetry Java agent auto-instrumentation to capture:
- HTTP request/response metrics (latency, error rate, throughput)
- Downstream dependency calls (databases, other services, AWS SDKs)
- Distributed traces correlated with metrics
- JVM runtime metrics (heap, GC, threads)

Application Signals correlates telemetry across metrics, traces, logs, real-user monitoring, and synthetic monitoring, providing a standardized dashboard of the most critical metrics — volume, availability, latency, faults, and errors — for each instrumented service without custom dashboard work.

A key capability is **Service Level Objective (SLO) management**. After instrumentation, you define SLOs for availability and latency directly in the CloudWatch console. Application Signals tracks performance against these objectives and raises alarms when an SLO is at risk, giving you a clear view of whether services meet their business-level commitments.

Auto-instrumentation injects the OpenTelemetry agent into application pods at startup via the OpenTelemetry Operator's `Instrumentation` custom resource — no code changes, no rebuild, no redeployment of your application image. While this guide focuses on Java/JVM workloads (including Kotlin and other JVM languages), Application Signals supports **Python, .NET, and Node.js** as well, each with a corresponding language annotation.

For containerized environments, Application Signals integrates with **Container Insights** to correlate application-level metrics with infrastructure signals such as pod CPU, memory pressure, and node capacity, letting you determine whether a latency spike originates from application logic or infrastructure resource contention.

## Prerequisites

- **Amazon EKS cluster** running Kubernetes v1.27 or later. Earlier versions lack the webhook configurations required by the ADOT Operator.
- **IAM OIDC provider** associated with the cluster. Required for IAM Roles for Service Accounts (IRSA) so that the CloudWatch agent and ADOT collector can assume the correct permissions. See [Creating an IAM OIDC provider](https://docs.aws.amazon.com/eks/latest/userguide/enable-iam-roles-for-service-accounts.html).
- **CloudWatch Observability EKS add-on** (`amazon-cloudwatch-observability`). This deploys the CloudWatch agent as a DaemonSet and configures Application Signals collection.
- **ADOT EKS add-on** or the **OpenTelemetry Operator** installed in the cluster to manage the `Instrumentation` custom resource that triggers auto-instrumentation injection.
- **IAM policies** attached to the node role or IRSA service account:
  - `CloudWatchAgentServerPolicy` — metric and log publishing
  - `AWSXRayDaemonWriteAccess` — trace submission
  - `CloudWatchApplicationSignalsFullAccess` — service map and SLO data
- Java application deployed as a Kubernetes **Deployment** (DaemonSets and bare pods are not supported by the auto-instrumentation webhook).
- `kubectl` access with permissions to create namespaces, deployments, and annotations.

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    EKS Cluster                       │
│  ┌───────────────────────────────────────────────┐  │
│  │           Application Pod                     │  │
│  │  ┌─────────────┐    ┌────────────────────┐   │  │
│  │  │ Java App    │    │ OTel Java Agent     │   │  │
│  │  │             │◄───│ (auto-instrument)   │   │  │
│  │  └─────────────┘    └─────────┬──────────┘   │  │
│  └───────────────────────────────┼───────────────┘  │
│                                  │                   │
│  ┌───────────────────────────────▼───────────────┐  │
│  │         CloudWatch Agent (DaemonSet)          │  │
│  └───────────────────────────────┬───────────────┘  │
└──────────────────────────────────┼───────────────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    ▼              ▼              ▼
           ┌──────────────┐ ┌──────────┐ ┌────────────┐
           │ CloudWatch   │ │  X-Ray   │ │ Application│
           │ Metrics      │ │  Traces  │ │ Signals    │
           └──────────────┘ └──────────┘ └────────────┘
```

## Deploy

### Step 1: Enable the ADOT add-on

```bash
aws eks create-addon \
  --cluster-name my-cluster \
  --addon-name adot \
  --addon-version v0.92.1-eksbuild.1
```

### Step 2: Annotate your application namespace

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: my-app
  labels:
    aws-observability: enabled
```

### Step 3: Add instrumentation annotation to your Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-java-app
spec:
  template:
    metadata:
      annotations:
        instrumentation.opentelemetry.io/inject-java: "true"
    spec:
      containers:
        - name: app
          image: my-java-app:latest
```

For **Kotlin** or other JVM-language services, the same `inject-java` annotation applies — the OTel Java agent instruments at the bytecode level, so any language that compiles to JVM bytecode is supported. For non-JVM languages, substitute the annotation: `inject-python` for Python, `inject-dotnet` for .NET, or `inject-nodejs` for Node.js.

### Step 4: Deploy CloudWatch agent

```bash
aws eks create-addon \
  --cluster-name my-cluster \
  --addon-name amazon-cloudwatch-observability
```

### Step 5: Define Service Level Objectives

Once telemetry is flowing, navigate to **CloudWatch → Application Signals → Service level objectives** and create SLOs for your critical services. You can set targets for:
- **Availability** — percentage of successful responses (e.g., 99.9%)
- **Latency** — p99 response time thresholds (e.g., p99 < 500 ms)

Application Signals tracks burn rate against these targets and raises CloudWatch Alarms when an SLO is at risk of breaching within its compliance window.

### Infrastructure as Code

This solution can be deployed using **AWS CDK** or **Terraform**. For CDK, the [`aws-eks`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_eks-readme.html) module supports add-on installation via `eks.Addon` constructs. For Terraform, use the [`aws_eks_addon`](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/eks_addon) resource to manage both the `adot` and `amazon-cloudwatch-observability` add-ons declaratively.

## Validate

1. **Check auto-instrumentation is injected:**
   ```bash
   kubectl get pods -n my-app -o jsonpath='{.items[*].spec.initContainers[*].name}'
   # Should show: opentelemetry-auto-instrumentation
   ```

2. **Generate traffic and check Application Signals:**
   Navigate to CloudWatch > Application Signals > Services.

3. **Verify traces in X-Ray:**
   Navigate to CloudWatch > X-Ray traces > Trace map.

4. **Inspect the Service Map:**
   Open **CloudWatch → Application Signals → Service Map**. Your instrumented service should appear as a node with edges to its downstream dependencies (databases, other services, AWS APIs). Verify that call volume, latency, and fault metrics populate on each edge. If a node is missing, confirm the corresponding pod has the auto-instrumentation init container.

5. **Review SLO status:**
   Navigate to **CloudWatch → Application Signals → Service level objectives**. Each SLO should show a current attainment percentage and burn rate. A healthy SLO displays a green status; an at-risk SLO shows amber with a projected breach time.

## Troubleshoot

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| No init container injected | Instrumentation CR missing | Verify `kubectl get instrumentation -A` |
| App crashes after instrumentation | Agent compatibility | Check Java version >= 8, try pinning agent version |
| Traces but no Application Signals | CloudWatch agent not forwarding | Check CW agent config and IAM role |
| High latency after instrumentation | Sampling too aggressive | Adjust sampling rate in collector config |
| Trace context not propagating across services | W3C TraceContext headers dropped by intermediate proxy or load balancer | Ensure ALB/NLB or service mesh preserves `traceparent` and `tracestate` headers; check `OTEL_PROPAGATORS` env var is set to `xray,tracecontext` |
| ADOT add-on fails to install or pods crash-loop | ADOT Operator version incompatible with cluster Kubernetes version | Verify add-on version compatibility in the [EKS add-on versions list](https://docs.aws.amazon.com/eks/latest/userguide/managing-add-ons.html); upgrade with `aws eks update-addon` |

## Related Solutions

- [EKS Infrastructure Monitoring](../eks-infrastructure/) — infrastructure complement to application-level signals, covering node and pod resource metrics via Container Insights
- [.NET Application Monitoring](../dotnet-application-monitoring/) — the same Application Signals pattern applied to .NET workloads
- [ADOT at Scale](../adot-at-scale/) — scaling the ADOT collector that underpins Application Signals for high-throughput clusters
- [APM Implementation Guide](../apm-implementation-guide/) — Application Signals and Transaction Search setup, collector options, and X-Ray migration
