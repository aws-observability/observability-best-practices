# Infrastructure Guide — OTel Chaos Game

This document covers the AWS and Kubernetes infrastructure that backs the
game: the EKS cluster, the OpenTelemetry demo deployment, the OTel Collector
configuration for CloudWatch OTLP ingestion, IAM setup, and cost allocation
tagging for CUR split cost attribution.

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
`ACCOUNT_ID`, `ROLE_ARN_PLACEHOLDER`) that `setup.sh` replaces at runtime
via `sed`, writing `*-rendered.yaml` copies. The originals are never modified.

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
│  IAM: IRSA (otel-demo-otelcol SA → OTelCollectorCloudWatchRole) │
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

1. Renders `eks-cluster.yaml` into a `*-rendered.yaml` copy, injecting
   `$REGION`. Cost allocation tags (`Project`, `Environment`,
   `CostCenter`, `ManagedBy`) are applied to every resource created by
   the script.

2. Creates an EKS Auto Mode cluster using `eksctl`. Auto Mode means AWS
   manages the node groups — no managed or self-managed node configuration
   needed. If the cluster already exists, this step is skipped and tags
   are updated on the existing cluster (idempotent).

3. Waits for the cluster to reach `ACTIVE` status using
   `aws eks wait cluster-active`, then updates your local kubeconfig and
   verifies cluster connectivity.

4. Creates an IAM policy (`OTelCollectorCloudWatchPolicy`) from
   `iam-policy.json` granting:
   - `cloudwatch:PutMetricData`
   - `logs:CreateLogGroup`, `CreateLogStream`, `PutLogEvents`,
     `DescribeLogGroups`, `DescribeLogStreams`, `PutRetentionPolicy`,
     `TagResource`, `StartQuery`, `GetQueryResults`, `FilterLogEvents`
   - `xray:PutTraceSegments`, `PutTelemetryRecords`,
     `GetSamplingRules`, `GetSamplingTargets`
   - `xray:GetTraceSummaries`, `BatchGetTraces`, `GetTraceGraph`,
     `GetServiceGraph` (trace read access)
   - `ce:GetCostAndUsage`, `GetTags`, `GetCostCategories`,
     `ListCostAllocationTags`, `UpdateCostAllocationTagsStatus`
     (Cost Explorer read access)
   - `cur:DescribeReportDefinitions`, `GetUsageReport`
     (CUR read access)

5. Creates an IAM Role for Service Accounts (IRSA) using `--role-only`,
   binding the policy to the `otel-demo-otelcol` service account in the
   `otel-demo` namespace. The Helm chart owns the actual service account;
   the script only creates the IAM role. The role ARN is retrieved from
   the CloudFormation stack that `eksctl` creates.

6. Creates the CloudWatch log group `/otel/demo` (with cost allocation
   tags) and log stream `otel-demo-services`.

7. Renders `otel-demo-values.yaml` into a `*-rendered.yaml` copy,
   injecting `$ACCOUNT_ID` and `$ROLE_ARN`.

8. Installs the OpenTelemetry Demo Helm chart (`open-telemetry/opentelemetry-demo`)
   with the rendered values file that configures the collector exporters
   and annotates the collector service account with the IRSA role ARN.
   Uses `helm upgrade --install` for idempotency.

9. Labels the `otel-demo` namespace with cost attribution tags
   (`Project`, `Environment`, `CostCenter`).

10. Verifies the IRSA annotation is present on the `otel-demo-otelcol`
    service account. Exits with an error if the annotation is missing.

11. Waits for all pods in the namespace to be ready (5 min timeout).

12. Activates cost allocation tags for CUR split cost allocation,
    including both user-defined tags (`Project`, `Environment`,
    `CostCenter`) and EKS automatic tags (`aws:eks:cluster-name`,
    `aws:eks:namespace`, `aws:eks:node`, `aws:eks:workload-name`,
    `aws:eks:workload-type`, `aws:eks:deployment`).

13. Cleans up rendered files.

## Teardown

```bash
cd infra
./teardown.sh
```

### What teardown.sh does, step by step

1. Updates kubeconfig (best-effort, won't fail if cluster is already gone).
2. Uninstalls the `otel-demo` Helm release.
3. Deletes the `otel-demo` namespace.
4. Deletes the IRSA role via `eksctl delete iamserviceaccount`
   (`otel-demo-otelcol` in the `otel-demo` namespace).
5. Detaches the IAM policy from any roles, then deletes the policy.
6. Deletes the CloudWatch log group `/otel/demo`.
7. Deactivates user-defined cost allocation tags (`Project`,
   `Environment`, `CostCenter`).
8. Deletes the EKS cluster via `eksctl delete cluster --wait`.
9. Cleans up any leftover rendered files.

Every step is guarded with `2>/dev/null || echo "..."` so the script is
safe to re-run even if resources are partially deleted.

## EKS cluster configuration

`eks-cluster.yaml`:

| Field                  | Value                |
|------------------------|----------------------|
| Name                   | `otel-demo-cluster`  |
| Kubernetes version     | 1.35                 |
| Auto Mode              | enabled              |
| OIDC provider          | enabled (for IRSA)   |
| Region                 | injected at runtime  |

Auto Mode delegates node provisioning entirely to AWS. The cluster
automatically scales compute based on pod scheduling demands.

Cost allocation tags are applied at the cluster level and propagated by
Auto Mode to managed resources (EC2 instances, ENIs, EBS volumes):

| Tag           | Value                  |
|---------------|------------------------|
| `Project`     | `otel-chaos-game`      |
| `Environment` | `demo`                 |
| `ManagedBy`   | `eksctl`               |
| `CostCenter`  | `observability-demo`   |

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

- `batch` — buffers up to 500 items or 10 seconds before flushing.
- `resource` — adds `cloud.provider=aws` attribute to all telemetry.
- `transform/metrics` — drops high-cardinality datapoint attributes
  (`net.sock.peer.addr`, `net.sock.peer.port`) and invalid
  `http.status_code` values to reduce metric cardinality.

### Connectors

- `spanmetrics` — generates request rate and duration metrics from
  trace spans, feeding the metrics pipeline from the traces pipeline.

### Log routing

Logs are sent to the CloudWatch Logs OTLP endpoint with HTTP headers:
- `x-aws-log-group: /otel/demo`
- `x-aws-log-stream: otel-demo-services`

## IAM policy

`iam-policy.json` grants the permissions needed for the OTel Collector
to write metrics, traces, and logs to CloudWatch, plus read access for
the web application to query traces (X-Ray), logs, and cost data. The
policy contains six statements:

| Sid                      | Purpose                                          |
|--------------------------|--------------------------------------------------|
| `OTLPMetricsIngest`      | `cloudwatch:PutMetricData`                       |
| `OTLPTracesIngest`       | X-Ray write (PutTraceSegments, etc.)             |
| `XRayTraceRead`          | X-Ray read (GetTraceSummaries, BatchGetTraces)   |
| `OTLPLogsIngest`         | CloudWatch Logs write + query (FilterLogEvents, StartQuery, etc.) |
| `CostExplorerReadAccess` | Cost Explorer read (GetCostAndUsage, GetTags)    |
| `CURReadAccess`          | Cost and Usage Report read                       |

The policy uses `Resource: "*"` for simplicity. In production, scope
this down to specific log group ARNs and resource ARNs.

## Helm values

`otel-demo-values.yaml` overrides the default OTel Demo chart to:

- Enable all 15 services plus the load generator.
- Embed the full collector pipeline configuration (receivers, processors,
  exporters, connectors, extensions) inline — no separate ConfigMap apply
  is needed.
- Let the chart create and own the `otel-demo-otelcol` service account,
  annotated with the IRSA role ARN.

The `ACCOUNT_ID` and `ROLE_ARN_PLACEHOLDER` placeholders are replaced by
`setup.sh` before Helm install.

## Customizing the region

The default region is `eu-west-1`. To change it:

- Set `AWS_REGION` before running `setup.sh` / `teardown.sh`.
- The setup script injects the region into all templated files.
- The web app reads `AWS_REGION` at runtime for CloudWatch queries.

## Cost allocation

The infrastructure is tagged end-to-end for CUR split cost allocation.
See the [AWS docs on split cost allocation](https://docs.aws.amazon.com/cur/latest/userguide/split-cost-allocation-data.html).

User-defined tags applied to all resources:

| Tag           | Value                  |
|---------------|------------------------|
| `Project`     | `otel-chaos-game`      |
| `Environment` | `demo`                 |
| `CostCenter`  | `observability-demo`   |
| `ManagedBy`   | `eksctl`               |

EKS Auto Mode automatically generates additional tags for split cost
allocation at the pod level:

- `aws:eks:cluster-name`
- `aws:eks:namespace`
- `aws:eks:node`
- `aws:eks:workload-name`
- `aws:eks:workload-type`
- `aws:eks:deployment`

`setup.sh` activates all of these tags in Cost Explorer so they appear
in CUR reports. `teardown.sh` deactivates the user-defined tags on
cleanup. Tag activation may take up to 24 hours to take effect.

The web application includes a cost breakdown page that queries Cost
Explorer using the `Project` tag to show infrastructure and observability
costs grouped by AWS service and usage type.

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
  `kubectl get sa otel-demo-otelcol -n otel-demo -o yaml`
- Confirm the IAM role trust policy allows the OIDC provider.

### Pods stuck in Pending

- Auto Mode may take a minute to provision nodes for the first time.
- Check events: `kubectl get events -n otel-demo --sort-by=.lastTimestamp`
- If nodes never appear, check the EKS console for Auto Mode errors.

### teardown.sh hangs on namespace deletion

- A namespace can get stuck if finalizers are blocking. Force it:
  `kubectl get namespace otel-demo -o json | jq '.spec.finalizers=[]' | kubectl replace --raw "/api/v1/namespaces/otel-demo/finalize" -f -`
