# ODTG — EKS Deployment

Deploys the OpenTelemetry Demo: The Game as a containerized app running in the same EKS cluster as the OTel demo.

## Prerequisites

- EKS cluster created via `infra/setup.sh` (with Auto Mode load balancing enabled)
- AWS CLI, `kubectl`, `eksctl`, Docker
- `kubeconfig` pointing at the cluster

## Quick Start

```bash
./deploy.sh
```

This will:

1. Create an ECR repository and push the container image
2. Create an IRSA role with CloudWatch, Cost Explorer, and Bedrock permissions
3. Deploy the app into the `odtg` namespace with RBAC to manage the `otel-demo` namespace

## Access

The deploy script ensures the `alb` IngressClass exists (creating it if EKS Auto Mode hasn't provisioned it yet) and creates an Ingress that provisions an ALB automatically.

```bash
# Get the load balancer address
kubectl get ingress odtg -n odtg
```

The ADDRESS column shows the ALB hostname. It may take 2–3 minutes for the ALB to provision and another 2–5 minutes for DNS to propagate.

## Configuration

Set these environment variables before running `deploy.sh`:

| Variable | Default | Description |
|----------|---------|-------------|
| `AWS_REGION` | `eu-west-1` | AWS region |
| `CLUSTER_NAME` | `otel-demo-cluster` | EKS cluster name |
| `IMAGE_TAG` | `latest` | Container image tag |

LLM and CloudWatch settings are configured in `k8s/deployment.yaml` env vars.

## What Gets Created

| Resource | Namespace | Purpose |
|----------|-----------|---------|
| Namespace `odtg` | — | Isolates the game app |
| ServiceAccount `odtg` | `odtg` | IRSA for AWS API access |
| Role + RoleBinding | `otel-demo` | K8s API access for chaos scenarios |
| Deployment `odtg` | `odtg` | The app (1 replica) |
| Service `odtg` | `odtg` | ClusterIP on port 80 → 3000 |
| Ingress `odtg` | `odtg` | ALB via EKS Auto Mode `alb` IngressClass |

## Teardown

```bash
./undeploy.sh
```

This will delete the `odtg` namespace, RBAC resources in `otel-demo`, the IRSA role, the ECR repository, and the Bedrock IAM policy.
