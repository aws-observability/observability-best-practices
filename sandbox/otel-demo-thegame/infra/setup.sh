#!/usr/bin/env bash
set -euo pipefail

REGION="${AWS_REGION:-eu-west-1}"
CLUSTER_NAME="otel-demo-cluster"
NAMESPACE="otel-demo"
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

# ── Cost allocation tags applied to every resource ───────────────────────────
# These tags enable CUR split cost allocation for EKS workloads.
# See: https://docs.aws.amazon.com/cur/latest/userguide/split-cost-allocation-data.html
TAG_PROJECT="otel-chaos-game"
TAG_ENVIRONMENT="demo"
TAG_COST_CENTER="observability-demo"
TAG_MANAGED_BY="eksctl"

echo "==> Using region: $REGION"
echo "==> Account ID: $ACCOUNT_ID"

# ── 1. Create EKS Auto Mode cluster ─────────────────────────────────────────
cp eks-cluster.yaml eks-cluster-rendered.yaml
sed -i.bak "s|REGION_PLACEHOLDER|${REGION}|g" eks-cluster-rendered.yaml
rm -f eks-cluster-rendered.yaml.bak

echo "==> Creating EKS Auto Mode cluster (this takes ~15 min)..."
if aws eks describe-cluster --name "$CLUSTER_NAME" --region "$REGION" >/dev/null 2>&1; then
  echo "    Cluster '$CLUSTER_NAME' already exists, skipping creation."
  # Ensure tags are up-to-date on existing cluster
  echo "    Updating tags on existing cluster..."
  aws eks tag-resource \
    --resource-arn "arn:aws:eks:${REGION}:${ACCOUNT_ID}:cluster/${CLUSTER_NAME}" \
    --tags "Project=${TAG_PROJECT},Environment=${TAG_ENVIRONMENT},CostCenter=${TAG_COST_CENTER},ManagedBy=${TAG_MANAGED_BY}" \
    --region "$REGION" 2>/dev/null || true
else
  eksctl create cluster -f eks-cluster-rendered.yaml
fi

echo "==> Waiting for cluster to be ACTIVE..."
aws eks wait cluster-active --name "$CLUSTER_NAME" --region "$REGION"

echo "==> Updating kubeconfig..."
aws eks update-kubeconfig --name "$CLUSTER_NAME" --region "$REGION"

echo "==> Verifying cluster connectivity..."
kubectl cluster-info || { echo "ERROR: Cannot reach cluster. Check your kubeconfig."; exit 1; }

# ── 2. IAM policy ───────────────────────────────────────────────────────────
echo "==> Creating IAM policy for OTel Collector..."
POLICY_ARN=$(aws iam create-policy \
  --policy-name OTelCollectorCloudWatchPolicy \
  --policy-document file://iam-policy.json \
  --tags "Key=Project,Value=${TAG_PROJECT}" "Key=Environment,Value=${TAG_ENVIRONMENT}" "Key=CostCenter,Value=${TAG_COST_CENTER}" "Key=ManagedBy,Value=${TAG_MANAGED_BY}" \
  --query 'Policy.Arn' --output text 2>/dev/null || \
  echo "arn:aws:iam::${ACCOUNT_ID}:policy/OTelCollectorCloudWatchPolicy")
echo "    Policy ARN: $POLICY_ARN"

# ── 3. Create IAM role for the collector via IRSA (role only) ────────────────
# The Helm chart owns the service account, so we only create the IAM role here.
# The role ARN is injected into the Helm values so the chart can annotate the SA.
COLLECTOR_SA_NAME="otel-demo-otelcol"

echo "==> Creating IRSA role for SA '${COLLECTOR_SA_NAME}' in namespace '${NAMESPACE}'..."
eksctl create iamserviceaccount \
  --cluster "$CLUSTER_NAME" \
  --region "$REGION" \
  --namespace "$NAMESPACE" \
  --name "$COLLECTOR_SA_NAME" \
  --attach-policy-arn "$POLICY_ARN" \
  --role-only \
  --approve \
  --tags "Project=${TAG_PROJECT},Environment=${TAG_ENVIRONMENT},CostCenter=${TAG_COST_CENTER},ManagedBy=${TAG_MANAGED_BY}"

# Retrieve the role ARN from the CloudFormation stack that eksctl created
ROLE_ARN=$(aws cloudformation describe-stacks \
  --stack-name "eksctl-${CLUSTER_NAME}-addon-iamserviceaccount-${NAMESPACE}-${COLLECTOR_SA_NAME}" \
  --region "$REGION" \
  --query 'Stacks[0].Outputs[?OutputKey==`Role1`].OutputValue' \
  --output text)
echo "    Role ARN: $ROLE_ARN"

# Tag the IRSA IAM role directly as well
ROLE_NAME=$(echo "$ROLE_ARN" | awk -F'/' '{print $NF}')
aws iam tag-role \
  --role-name "$ROLE_NAME" \
  --tags "Key=Project,Value=${TAG_PROJECT}" "Key=Environment,Value=${TAG_ENVIRONMENT}" "Key=CostCenter,Value=${TAG_COST_CENTER}" "Key=ManagedBy,Value=${TAG_MANAGED_BY}" \
  2>/dev/null || true

# ── 4. CloudWatch log group (with tags) ─────────────────────────────────────
echo "==> Creating CloudWatch Log Group..."
aws logs create-log-group \
  --log-group-name /otel/demo \
  --region "$REGION" \
  --tags "Project=${TAG_PROJECT},Environment=${TAG_ENVIRONMENT},CostCenter=${TAG_COST_CENTER},ManagedBy=${TAG_MANAGED_BY}" \
  2>/dev/null || true

# Ensure tags are present on existing log group
aws logs tag-resource \
  --resource-arn "arn:aws:logs:${REGION}:${ACCOUNT_ID}:log-group:/otel/demo" \
  --tags "Project=${TAG_PROJECT},Environment=${TAG_ENVIRONMENT},CostCenter=${TAG_COST_CENTER},ManagedBy=${TAG_MANAGED_BY}" \
  --region "$REGION" 2>/dev/null || true

aws logs create-log-stream --log-group-name /otel/demo --log-stream-name otel-demo-services --region "$REGION" 2>/dev/null || true

# ── 5. Render Helm values with actual account ID and role ARN ────────────────
cp otel-demo-values.yaml otel-demo-values-rendered.yaml
sed -i.bak "s|ACCOUNT_ID|${ACCOUNT_ID}|g" otel-demo-values-rendered.yaml
sed -i.bak "s|ROLE_ARN_PLACEHOLDER|${ROLE_ARN}|g" otel-demo-values-rendered.yaml
rm -f otel-demo-values-rendered.yaml.bak

# ── 6. Deploy OpenTelemetry Demo ────────────────────────────────────────────
echo "==> Installing OpenTelemetry Demo via Helm..."
helm repo add open-telemetry https://open-telemetry.github.io/opentelemetry-helm-charts 2>/dev/null || true
helm repo update

helm upgrade --install otel-demo open-telemetry/opentelemetry-demo \
  -n "$NAMESPACE" --create-namespace \
  -f otel-demo-values-rendered.yaml \
  --wait --timeout 15m

# ── 7. Label the Kubernetes namespace for cost attribution ───────────────────
echo "==> Labelling namespace for cost attribution..."
kubectl label namespace "$NAMESPACE" \
  "Project=${TAG_PROJECT}" \
  "Environment=${TAG_ENVIRONMENT}" \
  "CostCenter=${TAG_COST_CENTER}" \
  --overwrite 2>/dev/null || true

# ── 8. Verify the collector SA has the IRSA annotation ───────────────────────
echo "==> Verifying IRSA annotation on collector service account..."
ACTUAL_ROLE=$(kubectl get sa "$COLLECTOR_SA_NAME" -n "$NAMESPACE" -o jsonpath='{.metadata.annotations.eks\.amazonaws\.com/role-arn}' 2>/dev/null || true)
if [ -z "$ACTUAL_ROLE" ]; then
  echo "    ERROR: SA '${COLLECTOR_SA_NAME}' missing IRSA annotation. Helm values may be incorrect."
  exit 1
else
  echo "    OK: $ACTUAL_ROLE"
fi

# ── 9. Wait for pods ────────────────────────────────────────────────────────
echo "==> Waiting for all pods to be ready (up to 5 min)..."
kubectl wait --for=condition=ready pod --all -n "$NAMESPACE" --timeout=300s

# ── 10. Activate cost allocation tags for CUR split cost allocation ──────────
# EKS automatically creates aws:eks:* tags for split cost allocation.
# We also activate our user-defined tags so they appear in CUR reports.
# See: https://docs.aws.amazon.com/cur/latest/userguide/split-cost-allocation-data.html
echo "==> Activating cost allocation tags..."
aws ce update-cost-allocation-tags-status \
  --cost-allocation-tags-status \
    "TagKey=Project,Status=Active" \
    "TagKey=Environment,Status=Active" \
    "TagKey=CostCenter,Status=Active" \
    "TagKey=aws:eks:cluster-name,Status=Active" \
    "TagKey=aws:eks:namespace,Status=Active" \
    "TagKey=aws:eks:node,Status=Active" \
    "TagKey=aws:eks:workload-name,Status=Active" \
    "TagKey=aws:eks:workload-type,Status=Active" \
    "TagKey=aws:eks:deployment,Status=Active" \
  2>/dev/null || echo "    Note: Cost allocation tag activation may require 24h to take effect."

# ── 11. Cleanup rendered files ───────────────────────────────────────────────
rm -f eks-cluster-rendered.yaml otel-demo-values-rendered.yaml

echo ""
echo "✅ Setup complete!"
echo ""
echo "Cost allocation tags activated:"
echo "  User-defined:  Project, Environment, CostCenter"
echo "  EKS automatic: aws:eks:cluster-name, aws:eks:namespace, aws:eks:node,"
echo "                 aws:eks:workload-name, aws:eks:workload-type, aws:eks:deployment"
echo ""
echo "Services running in namespace: $NAMESPACE"
kubectl get pods -n "$NAMESPACE"
echo ""
echo "To access the demo frontend:"
echo "  kubectl port-forward -n $NAMESPACE svc/otel-demo-frontend 8080:8080"
echo ""
echo "To run the chaos game:"
echo "  cd .. && npm install && npm run dev"
