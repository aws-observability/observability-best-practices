# OpenTelemetry Gateway on Amazon EKS — Monitoring Your Observability Pipeline

Companion manifests for the AWS blog **"Deploy OpenTelemetry Gateway on AWS: Monitoring
Your Observability Pipeline."** They deploy an agent-to-gateway OpenTelemetry pipeline on
Amazon EKS that exports metrics to Amazon CloudWatch via the native OTLP endpoint (SigV4)
and self-monitors the gateway ("monitor the monitoring").

Pattern: **application → node-local OTel agent (DaemonSet) → OTel gateway (Deployment) →
CloudWatch native OTLP**. The CloudWatch Observability EKS add-on runs alongside for
infrastructure Container Insights.

## Files

| File | What it is |
|------|------------|
| `agent.yaml` | Self-managed OTel Collector **agent** (DaemonSet): OTLP receiver → `memory_limiter` + `k8sattributes` + `batch` → forwards to the gateway. Includes ServiceAccount, k8sattributes RBAC, and Service. |
| `gateway.yaml` | OTel Collector **gateway** (Deployment ×2 + Service): OTLP + Prometheus self-scrape receivers → `memory_limiter` + `batch` → `otlphttp` (`metrics_endpoint` + `sigv4auth`) to CloudWatch; `health_check` on :13133; self-telemetry on :8888. Contains an `<ACCOUNT_ID>` placeholder. |
| `dashboard.json` | CloudWatch dashboard body (`OTel-Gateway-Pipeline-Health`) — throughput, export success vs failure, queue utilization, refused metrics. Uses PromQL `chart` widgets. |

## Prerequisites

- Amazon EKS cluster running Kubernetes 1.28 or later.
- OIDC provider configured for IAM Roles for Service Accounts (IRSA).
- An IAM role `OTelGatewayRole` for the gateway ServiceAccount with `CloudWatchAgentServerPolicy`
  attached (trust policy scoped to `system:serviceaccount:otel-gateway:otel-gateway`).
- The CloudWatch Observability EKS add-on installed (its service account also needs
  `CloudWatchAgentServerPolicy` via IRSA or EKS Pod Identity).
- Network egress from the cluster to the CloudWatch OTLP endpoint
  (`monitoring.<region>.amazonaws.com`, HTTPS/443) — via NAT or a CloudWatch VPC interface endpoint.

## Deploy

> Review these manifests before applying. Pin to a release tag/commit rather than `main`
> so your steps stay reproducible.

```bash
# 1) Gateway (substitute your AWS account ID for the IRSA annotation)
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
curl -sSL https://raw.githubusercontent.com/aws-observability/observability-best-practices/main/sandbox/otel-gateway-deployment/gateway.yaml \
  | sed "s/<ACCOUNT_ID>/$ACCOUNT_ID/g" | kubectl apply -f -

# 2) Agent tier (no placeholders)
kubectl apply -f https://raw.githubusercontent.com/aws-observability/observability-best-practices/main/sandbox/otel-gateway-deployment/agent.yaml

# 3) Point your workloads at the node-local agent (SDK env vars)
#    OTEL_EXPORTER_OTLP_ENDPOINT = http://$(NODE_IP):4317   (NODE_IP from downward API status.hostIP)
#    or the agent Service: otel-agent.otel-agent.svc.cluster.local:4317

# 4) Dashboard
aws cloudwatch put-dashboard --region us-east-1 \
  --dashboard-name OTel-Gateway-Pipeline-Health \
  --dashboard-body file://dashboard.json
```

Region note: `gateway.yaml` pins `us-east-1` in the `otlphttp` endpoint and `sigv4auth`.
Change both if you deploy elsewhere.

## Verify

```bash
kubectl get pods -n otel-gateway     # 2/2 Running
kubectl get pods -n otel-agent       # one per node, Running
# Then query the gateway's own metrics in CloudWatch Query Studio (PromQL):
#   rate(otelcol_receiver_accepted_metric_points[5m])
```

## Alarms (PromQL — create in the CloudWatch console; queries return a single series)

- Queue saturation: `max(otelcol_exporter_queue_size / otelcol_exporter_queue_capacity) > 0.8`
- Export failures: `sum(rate(otelcol_exporter_send_failed_metric_points[5m])) > 0`
- Memory limiter (refused): `sum(rate(otelcol_receiver_refused_metric_points[5m])) > 0`

## Cleanup

```bash
kubectl delete namespace otel-agent
kubectl delete namespace otel-gateway
aws cloudwatch delete-alarms --alarm-names "OTelGateway-QueueSaturation" "OTelGateway-ExportFailures"
aws cloudwatch delete-dashboards --dashboard-names "OTel-Gateway-Pipeline-Health"
```
