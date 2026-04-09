#!/usr/bin/env bash
set -euo pipefail

REGION="${AWS_REGION:-eu-west-1}"
CLUSTER_NAME="otel-demo-cluster"
NAMESPACE="otel-demo"
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

echo "==> Using region: $REGION"
echo "==> Account ID: $ACCOUNT_ID"

# ── 1. Remove Kubernetes resources ──────────────────────────────────────────
echo "==> Updating kubeconfig..."
aws eks update-kubeconfig --name "$CLUSTER_NAME" --region "$REGION" 2>/dev/null || true

echo "==> Uninstalling OTel Demo Helm release..."
helm uninstall otel-demo -n "$NAMESPACE" --wait 2>/dev/null || echo "    Helm release not found, skipping."

echo "==> Deleting namespace $NAMESPACE..."
kubectl delete namespace "$NAMESPACE" --timeout=120s 2>/dev/null || true

# ── 2. Remove IRSA role ─────────────────────────────────────────────────────
# Setup created the role with --role-only; this deletes the backing CFN stack.
echo "==> Deleting IRSA role..."
eksctl delete iamserviceaccount \
  --cluster "$CLUSTER_NAME" \
  --region "$REGION" \
  --namespace "$NAMESPACE" \
  --name otel-demo-otelcol \
  2>/dev/null || echo "    IRSA role not found, skipping."

# ── 3. Remove IAM policy ───────────────────────────────────────────────────
POLICY_ARN="arn:aws:iam::${ACCOUNT_ID}:policy/OTelCollectorCloudWatchPolicy"
echo "==> Deleting IAM policy $POLICY_ARN..."
# Detach from any roles first, then delete
for role_arn in $(aws iam list-entities-for-policy --policy-arn "$POLICY_ARN" --query 'PolicyRoles[].RoleName' --output text 2>/dev/null); do
  aws iam detach-role-policy --role-name "$role_arn" --policy-arn "$POLICY_ARN" 2>/dev/null || true
done
aws iam delete-policy --policy-arn "$POLICY_ARN" 2>/dev/null || echo "    IAM policy not found, skipping."

# ── 4. Remove CloudWatch log group ─────────────────────────────────────────
echo "==> Deleting CloudWatch log group /otel/demo..."
aws logs delete-log-group --log-group-name /otel/demo --region "$REGION" 2>/dev/null || echo "    Log group not found, skipping."

# ── 5. Deactivate user-defined cost allocation tags ─────────────────────────
echo "==> Deactivating user-defined cost allocation tags..."
aws ce update-cost-allocation-tags-status \
  --cost-allocation-tags-status \
    "TagKey=Project,Status=Inactive" \
    "TagKey=Environment,Status=Inactive" \
    "TagKey=CostCenter,Status=Inactive" \
  2>/dev/null || echo "    Cost allocation tag deactivation skipped."

# ── 6. Delete EKS cluster ──────────────────────────────────────────────────
echo "==> Deleting EKS cluster '$CLUSTER_NAME' (this takes ~10 min)..."
eksctl delete cluster --name "$CLUSTER_NAME" --region "$REGION" --wait

# ── 7. Cleanup rendered files from previous setup runs ──────────────────────
rm -f eks-cluster-rendered.yaml otel-demo-values-rendered.yaml

echo ""
echo "✅ Teardown complete. All resources removed."
