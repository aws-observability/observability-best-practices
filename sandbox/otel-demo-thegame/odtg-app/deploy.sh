#!/usr/bin/env bash
set -euo pipefail

REGION="${AWS_REGION:-eu-west-1}"
CLUSTER_NAME="${CLUSTER_NAME:-otel-demo-cluster}"
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REPO_NAME="odtg"
IMAGE_TAG="${IMAGE_TAG:-latest}"
IMAGE_URI="${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${REPO_NAME}:${IMAGE_TAG}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

if command -v docker &>/dev/null; then
  CTR=docker
elif command -v finch &>/dev/null; then
  CTR=finch
else
  echo "ERROR: Neither docker nor finch found. Install one and retry." && exit 1
fi

echo "==> Region: $REGION | Account: $ACCOUNT_ID | Image: $IMAGE_URI | Runtime: $CTR"

# ── 1. Create ECR repo if needed ────────────────────────────────────────────
aws ecr describe-repositories --repository-names "$REPO_NAME" --region "$REGION" >/dev/null 2>&1 || \
  aws ecr create-repository --repository-name "$REPO_NAME" --region "$REGION" --query 'repository.repositoryUri' --output text

# ── 2. Build & push ─────────────────────────────────────────────────────────
aws ecr get-login-password --region "$REGION" | $CTR login --username AWS --password-stdin "${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com"
$CTR build -t "$IMAGE_URI" -f "$SCRIPT_DIR/Dockerfile" "$PROJECT_ROOT"
$CTR push "$IMAGE_URI"

# ── 3. Create IRSA role for the ODTG service account ────────────────────────
# Reuses the same IAM policy as the OTel collector (CloudWatch + Cost Explorer)
# plus adds Bedrock invoke permission.
POLICY_ARN="arn:aws:iam::${ACCOUNT_ID}:policy/OTelCollectorCloudWatchPolicy"

# Create Bedrock policy if it doesn't exist
BEDROCK_POLICY_NAME="ODTGBedrockInvokePolicy"
BEDROCK_POLICY_ARN="arn:aws:iam::${ACCOUNT_ID}:policy/${BEDROCK_POLICY_NAME}"
if ! aws iam get-policy --policy-arn "$BEDROCK_POLICY_ARN" >/dev/null 2>&1; then
  aws iam create-policy --policy-name "$BEDROCK_POLICY_NAME" --policy-document '{
    "Version": "2012-10-17",
    "Statement": [{"Effect": "Allow", "Action": "bedrock:InvokeModel", "Resource": "*"}]
  }' --query 'Policy.Arn' --output text
fi

eksctl create iamserviceaccount \
  --cluster "$CLUSTER_NAME" --region "$REGION" \
  --namespace odtg --name odtg \
  --attach-policy-arn "$POLICY_ARN" \
  --attach-policy-arn "$BEDROCK_POLICY_ARN" \
  --approve --override-existing-serviceaccounts 2>/dev/null || true

ROLE_ARN=$(kubectl get sa odtg -n odtg -o jsonpath='{.metadata.annotations.eks\.amazonaws\.com/role-arn}' 2>/dev/null || echo "")

# ── 4. Ensure ALB IngressClass exists (EKS Auto Mode) ───────────────────────
if ! kubectl get ingressclass alb >/dev/null 2>&1; then
  echo "==> Creating ALB IngressClass..."
  printf 'apiVersion: networking.k8s.io/v1\nkind: IngressClass\nmetadata:\n  name: alb\nspec:\n  controller: eks.amazonaws.com/alb\n' | kubectl apply -f -
fi

# ── 5. Apply K8s manifests ──────────────────────────────────────────────────
kubectl apply -f "$SCRIPT_DIR/k8s/namespace.yaml"

# Render and apply remaining manifests
for f in serviceaccount.yaml rbac.yaml deployment.yaml service.yaml ingress.yaml; do
  sed -e "s|IMAGE_PLACEHOLDER|${IMAGE_URI}|g" \
      -e "s|REGION_PLACEHOLDER|${REGION}|g" \
      -e "s|ROLE_ARN_PLACEHOLDER|${ROLE_ARN}|g" \
      "$SCRIPT_DIR/k8s/$f" | kubectl apply -f -
done

echo "==> Waiting for rollout..."
kubectl rollout status deployment/odtg -n odtg --timeout=120s

echo "==> Waiting for load balancer address..."
for i in $(seq 1 30); do
  LB=$(kubectl get ingress odtg -n odtg -o jsonpath='{.status.loadBalancer.ingress[0].hostname}' 2>/dev/null || true)
  [ -n "$LB" ] && break
  sleep 5
done

echo ""
echo "✅ ODTG deployed!"
echo ""
if [ -n "${LB:-}" ]; then
  echo "Access the game at: http://$LB"
else
  echo "Load balancer is still provisioning. Check with:"
  echo "  kubectl get ingress odtg -n odtg"
fi
