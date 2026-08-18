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

## Prerequisites

- Amazon EKS cluster (v1.27+)
- Java application deployed as a Kubernetes Deployment
- CloudWatch agent with Application Signals enabled
- ADOT add-on or OpenTelemetry Operator installed
- IAM permissions for CloudWatch and X-Ray

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

### Step 4: Deploy CloudWatch agent

```bash
aws eks create-addon \
  --cluster-name my-cluster \
  --addon-name amazon-cloudwatch-observability
```

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

## Troubleshoot

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| No init container injected | Instrumentation CR missing | Verify `kubectl get instrumentation -A` |
| App crashes after instrumentation | Agent compatibility | Check Java version >= 8, try pinning agent version |
| Traces but no Application Signals | CloudWatch agent not forwarding | Check CW agent config and IAM role |
| High latency after instrumentation | Sampling too aggressive | Adjust sampling rate in collector config |

## Related Solutions

- [EKS Infrastructure Monitoring](../eks-infrastructure/) — Add infrastructure-level visibility
- [Lambda Monitoring](../lambda-monitoring/) — Trace requests from EKS to Lambda
