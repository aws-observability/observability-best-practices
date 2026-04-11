#!/usr/bin/env bash
set -euo pipefail

REGION="${AWS_REGION:-eu-west-1}"
CLUSTER_NAME="${CLUSTER_NAME:-otel-demo-cluster}"
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REPO_NAME="odtg"

echo "==> Deleting odtg namespace (cascades all resources inside it)..."
kubectl delete namespace odtg 2>/dev/null || true

echo "==> Deleting RBAC in otel-demo namespace..."
read -rp "    Delete Role/RoleBinding 'odtg-chaos' from otel-demo namespace? [y/N] " ans
if [[ "${ans:-N}" =~ ^[Yy]$ ]]; then
  kubectl delete role,rolebinding odtg-chaos -n otel-demo 2>/dev/null || true
else
  echo "    Skipped. Remove manually with: kubectl delete role,rolebinding odtg-chaos -n otel-demo"
fi

echo "==> Deleting IRSA role..."
eksctl delete iamserviceaccount \
  --cluster "$CLUSTER_NAME" --region "$REGION" \
  --namespace odtg --name odtg 2>/dev/null || true

echo "==> Deleting ECR repository..."
aws ecr delete-repository --repository-name "$REPO_NAME" --region "$REGION" --force 2>/dev/null || true

echo "==> Deleting Bedrock IAM policy..."
BEDROCK_POLICY_ARN="arn:aws:iam::${ACCOUNT_ID}:policy/ODTGBedrockInvokePolicy"
aws iam delete-policy --policy-arn "$BEDROCK_POLICY_ARN" 2>/dev/null || true

echo ""
echo "✅ ODTG cleaned up."
