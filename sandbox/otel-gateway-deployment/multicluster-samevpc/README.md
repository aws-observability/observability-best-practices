# Multi-cluster (same account, same VPC) — shared gateway sample

Reference manifests for scaling to a shared gateway across multiple clusters in one VPC.
When several EKS clusters share one VPC, you don't need a gateway in every cluster.
Run the gateway on one cluster (the **hub**) and point the other clusters' agents
(the **spokes**) at it through an internal Network Load Balancer.

```
spoke cluster: app → node-local agent ─┐
spoke cluster: app → node-local agent ─┼─→ internal NLB → shared gateway (hub) → CloudWatch
hub cluster:   app → node-local agent ─┘
```

> These are reference samples for the scaling pattern. The **tested baseline** in the
> parent folder is the single-cluster (ClusterIP) path. The cross-cluster hop leaves the
> pod network, so it is configured for TLS — provisioning the certs is a prerequisite.

## Files

| File | Where | What it is |
|------|-------|------------|
| `gateway-nlb-service.yaml` | hub cluster | Replaces the gateway's ClusterIP Service with an **internal NLB** so agents in the same VPC can reach ports 4317/4318. Requires the AWS Load Balancer Controller. |
| `agent-remote.yaml` | each spoke cluster | The agent DaemonSet whose exporter targets the NLB DNS over TLS instead of the in-cluster gateway Service. |

## Deploy

**1. Hub cluster** — deploy the gateway (parent `gateway.yaml`), then swap its Service:

```bash
kubectl apply -f gateway-nlb-service.yaml
# Grab the NLB hostname once provisioned:
kubectl get svc otel-gateway -n otel-gateway \
  -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'
```

**2. Each spoke cluster** — set `<GATEWAY_NLB_DNS>` in `agent-remote.yaml`, mount the
CA (and client cert/key for mTLS), then:

```bash
kubectl apply -f agent-remote.yaml
```

Workloads on every cluster still point at their node-local agent (unchanged). The
shared gateway handles batching, authentication, and export for all of them.

## Prerequisites

- All clusters in the **same account and VPC** (agents reach the internal NLB directly).
- **AWS Load Balancer Controller** on the hub cluster.
- **TLS certificates**: the gateway's OTLP receiver serves a cert the agents trust
  (`ca_file`); add `cert_file`/`key_file` for mTLS so the gateway authenticates senders.
  Cert provisioning (e.g. cert-manager) is out of scope for this config sample.
- Restrict the NLB with a security group scoped to the sending clusters
  (`aws-load-balancer-security-groups`).
