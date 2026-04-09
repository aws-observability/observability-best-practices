# Infrastructure Guide — OTel Chaos Game

This document covers the AWS and Kubernetes infrastructure that backs the
game: the EKS cluster, the OpenTelemetry demo deployment, the OTel Collector
configuration for CloudWatch OTLP ingestion, and IAM setup.

## Prerequisites

| Tool       | Minimum version | Purpose                          |
|------------|-----------------|----------------------------------|
| `aws`      | 2.x             | AWS CLI, configured with creds   |
| `eksctl`   | 0.170+          | EKS cluster lifecycle            |
| `kubectl`  | 1.28+           | Kubernetes operations            |
| `helm`     | 3.x             | OTel demo chart installation     |
| `sed`      | any             | Template rendering in setup.sh   |

Your AWS credentials must have permissions to create EKS clusters, IAM
policies/roles, and CloudWatch log groups.

## File inventory

```
infra/
├── setup.sh                    # One-shot provisioning script
├── teardown.sh                 # Full cleanup script
├── eks-cluster.yaml            # eksctl ClusterConfig (templated)
├── otel-demo-values.yaml       # Helm values override (templated)
├── otel-collector-config.yaml  # OTel Collector ConfigMap
└── iam-policy.json             # IAM policy for CloudWatch access
```

Files marked "templated" contain placeholders (`REGION_PLACEHOLDER`,
`ACCOUNT_ID`) that `setup.sh` replaces at runtime via `sed`, writing
`*-rendered.yaml` copies. The originals are never modified.

## Architecture overview

```
┌──────────────────────────────────────────────────────────────┐
│  EKS Auto Mode Cluster (otel-demo-cluster)                   │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Namespace: otel-demo                                  │  │
│  │                                                        │  │
│  │  15 microservices (Helm: opentelemetry-demo)           │  │
│  │  accounting, ad, cart, checkout, currency, email,      │  │
│  │  fraud-detection, frontend, load-generator, payment,   │  │
│  │  product-catalog, product-reviews, quote,              │  │
│  │  recommendation, shipping                              │  │
│  │                                                        │  │
│  │  OTel Collector (Deployment)                           │  │
│  │    receives OTLP on :4317 (gRPC) and :4318 (HTTP)     │  │
│  │    exports via SigV4-authenticated OTLP/HTTP to:       │  │
│  │      → CloudWatch Metrics                              │  │
│  │      → X-Ray (traces)                                  │  │
│  │      → CloudWatch Logs                                 │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  IAM: IRSA (otel-collector SA → OTelCollectorCloudWatchRole) │
└──────────────────────────────────────────────────────────────┘
         │                    │                    │
   ┌─────▼─────┐       ┌─────▼─────┐       ┌─────▼──────┐
   │ CloudWatch │       │   X-Ray   │       │ CloudWatch │
   │  Metrics   │       │  Traces   │       │    Logs    │
   │            │       │           │       │ /otel/demo │
   └────────────┘       └───────────┘       └────────────┘
```

## Setup

```bash
cd infra
./setup.sh
```

Override the default region (`eu-west-1`):

```bash
AWS_REGION=us-west-2 ./setup.sh
```

### What setup.sh does, step by step

1. Renders templated YAML files into `*-rendered.yaml` copies, injecting
   `$REGION` and `$ACCOUNT_ID`.

2. Creates an EKS Auto Mode cluster using `eksctl`. Auto Mode means AWS
   manages the node groups — no managed or self-managed node configuration
   needed. If the cluster already exists, this step is skipped (idempotent).

3. Waits for the cluster to reach `ACTIVE` status using
   `aws eks wait cluster-active`, then updates your local kubeconfig.

4. Creates an IAM policy (`OTelCollectorCloudWatchPolicy`) from
   `iam-policy.json` granting:
   - `cloudwatch:PutMetricData`
   - `logs:CreateLogGroup`, `CreateLogStream`, `PutLogEvents`,
     `DescribeLogGroups`, `DescribeLogStreams`
   - `xray:PutTraceSegments`, `PutTelemetryRecords`,
     `GetSamplingRules`, `GetSamplingTargets`

5. Creates an IAM Role for Service Accounts (IRSA) binding the policy to
   the `otel-collector` Kubernetes service account in the `otel-demo`
   namespace. This lets the collector authenticate to CloudWatch without
   static credentials.

6. Creates the CloudWatch log group `/otel/demo` and log stream
   `otel-demo-services`.

7. Installs the OpenTelemetry Demo Helm chart (`open-telemetry/opentelemetry-demo`)
   with the custom values file that configures the collector exporters.
   Uses `helm upgrade --install` for idempotency.

8. Applies the `otel-collector-config` ConfigMap with the full collector
   pipeline configuration.

9. Waits for all pods in the namespace to be ready (5 min timeout).

10. Cleans up rendered files.

## Teardown

```bash
cd infra
./teardown.sh
```

### What teardown.sh does, step by step

1. Updates kubeconfig (best-effort, won't fail if cluster is already gone).
2. Uninstalls the `otel-demo` Helm release.
3. Deletes the `otel-collector-config` ConfigMap.
4. Deletes the `otel-demo` namespace.
5. Deletes the IRSA service account and its backing IAM role.
6. Detaches the IAM policy from any roles, then deletes the policy.
7. Deletes the CloudWatch log group `/otel/demo`.
8. Deletes the EKS cluster via `eksctl delete cluster --wait`.
9. Cleans up any leftover rendered files.

Every step is guarded with `|| true` or `2>/dev/null` so the script is
safe to re-run even if resources are partially deleted.

## EKS cluster configuration

`eks-cluster.yaml`:

| Field                  | Value                |
|------------------------|----------------------|
| Name                   | `otel-demo-cluster`  |
| Kubernetes version     | 1.31                 |
| Auto Mode              | enabled              |
| OIDC provider          | enabled (for IRSA)   |
| Region                 | injected at runtime  |

Auto Mode delegates node provisioning entirely to AWS. The cluster
automatically scales compute based on pod scheduling demands.

## OTel Collector pipeline

The collector receives all telemetry from the demo services via OTLP
(gRPC on port 4317, HTTP on port 4318) and exports to three CloudWatch
endpoints:

| Signal  | Exporter              | Endpoint                                                |
|---------|-----------------------|---------------------------------------------------------|
| Metrics | `otlphttp/cw_metrics` | `https://monitoring.<region>.amazonaws.com/v1/metrics`  |
| Traces  | `otlphttp/cw_traces`  | `https://xray.<region>.amazonaws.com`                   |
| Logs    | `otlphttp/cw_logs`    | `https://logs.<region>.amazonaws.com/v1/logs`           |

All exporters use the `sigv4auth` extension for authentication, which
picks up credentials from the IRSA-annotated service account.

### Processors

- `batch` — buffers up to 1024 items or 10 seconds before flushing.
- `resource` — adds `cloud.provider=aws` attribute to all telemetry.

### Log routing

Logs are sent to the CloudWatch Logs OTLP endpoint with HTTP headers:
- `x-aws-log-group: /otel/demo`
- `x-aws-log-stream: otel-demo-services`

## IAM policy

`iam-policy.json` grants the minimum permissions needed for the OTel
Collector to write metrics, traces, and logs to CloudWatch. The policy
uses `Resource: "*"` for simplicity. In production, scope this down to
specific log group ARNs.

## Helm values

`otel-demo-values.yaml` overrides the default OTel Demo chart to:

- Enable all 15 services plus the load generator.
- Configure the collector with CloudWatch OTLP exporters.
- Annotate the collector service account with the IRSA role ARN.

The `ACCOUNT_ID` placeholder in the role ARN is replaced by `setup.sh`.

## Customizing the region

The default region is `eu-west-1`. To change it:

- Set `AWS_REGION` before running `setup.sh` / `teardown.sh`.
- The setup script injects the region into all templated files.
- The web app reads `AWS_REGION` at runtime for CloudWatch queries.

## Networking

The web app connects to:

1. The Kubernetes API server — via your kubeconfig. If running locally,
   this goes through the EKS public endpoint. If deployed in-cluster,
   it uses the internal service account.

2. CloudWatch APIs — standard AWS SDK HTTPS calls, authenticated via
   your local AWS credentials or an IAM role.

The OTel demo frontend can be accessed via port-forward:

```bash
kubectl port-forward -n otel-demo svc/otel-demo-frontend 8080:8080
```

## Troubleshooting

### Cluster creation fails

- Check `eksctl` output for quota or permission errors.
- Verify your AWS credentials: `aws sts get-caller-identity`.
- EKS Auto Mode requires the account to have the
  `AmazonEKSAutoNodePolicy` service-linked role. `eksctl` creates this
  automatically, but it can fail if your IAM permissions are too
  restrictive.

### No metrics in CloudWatch

- Check the collector logs:
  `kubectl logs -n otel-demo -l app.kubernetes.io/component=opentelemetry-collector`
- Verify the IRSA annotation:
  `kubectl get sa otel-collector -n otel-demo -o yaml`
- Confirm the IAM role trust policy allows the OIDC provider.
- Check that the CloudWatch namespace matches `CW_METRICS_NAMESPACE`
  (default: `OTelDemo`).

### Pods stuck in Pending

- Auto Mode may take a minute to provision nodes for the first time.
- Check events: `kubectl get events -n otel-demo --sort-by=.lastTimestamp`
- If nodes never appear, check the EKS console for Auto Mode errors.

### teardown.sh hangs on namespace deletion

- A namespace can get stuck if finalizers are blocking. Force it:
  `kubectl get namespace otel-demo -o json | jq '.spec.finalizers=[]' | kubectl replace --raw "/api/v1/namespaces/otel-demo/finalize" -f -`
