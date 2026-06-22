#!/bin/bash
# Enable Grafana Access with IAM Identity Center

set -e

WORKSPACE_ID="g-45577447e2"
REGION="us-east-1"

echo "======================================================================"
echo "🔐 Grafana Access Setup"
echo "======================================================================"
echo ""

# Check if IAM Identity Center is enabled
echo "Checking IAM Identity Center status..."
INSTANCE_ARN=$(aws sso-admin list-instances --region $REGION --query 'Instances[0].InstanceArn' --output text 2>/dev/null || echo "None")

if [ "$INSTANCE_ARN" == "None" ] || [ -z "$INSTANCE_ARN" ]; then
    echo ""
    echo "⚠️  IAM Identity Center is not enabled in your account."
    echo ""
    echo "To enable it:"
    echo "  1. Open: https://console.aws.amazon.com/singlesignon/home?region=$REGION"
    echo "  2. Click 'Enable'"
    echo "  3. Follow the setup wizard"
    echo ""
    echo "After enabling, run this script again."
    echo ""
    exit 1
fi

echo "✅ IAM Identity Center is enabled"
echo "   Instance ARN: $INSTANCE_ARN"
echo ""

# Get Identity Store ID
IDENTITY_STORE_ID=$(aws sso-admin list-instances --region $REGION --query 'Instances[0].IdentityStoreId' --output text)
echo "✅ Identity Store ID: $IDENTITY_STORE_ID"
echo ""

# List users
echo "======================================================================"
echo "Available Users in Identity Center:"
echo "======================================================================"
aws identitystore list-users --identity-store-id $IDENTITY_STORE_ID --region $REGION \
    --query 'Users[].[UserName,DisplayName,UserId]' --output table

echo ""
read -p "Enter the username to grant Grafana access: " USERNAME

# Get user ID
USER_ID=$(aws identitystore list-users --identity-store-id $IDENTITY_STORE_ID --region $REGION \
    --query "Users[?UserName=='$USERNAME'].UserId" --output text)

if [ -z "$USER_ID" ]; then
    echo "❌ User '$USERNAME' not found"
    exit 1
fi

echo "✅ Found user: $USERNAME (ID: $USER_ID)"
echo ""

# Assign user to Grafana
echo "Assigning user to Grafana workspace..."
aws grafana update-permissions \
    --workspace-id $WORKSPACE_ID \
    --update-instruction-batch "[
        {
            \"action\": \"ADD\",
            \"role\": \"ADMIN\",
            \"users\": [
                {
                    \"id\": \"$USER_ID\",
                    \"type\": \"SSO_USER\"
                }
            ]
        }
    ]" \
    --region $REGION

echo ""
echo "======================================================================"
echo "✅ Grafana Access Configured!"
echo "======================================================================"
echo ""
echo "User '$USERNAME' now has ADMIN access to Grafana"
echo ""
echo "🔗 Access Grafana:"
echo "   https://g-45577447e2.grafana-workspace.us-east-1.amazonaws.com"
echo ""
echo "📝 Next Steps:"
echo "   1. Open the Grafana URL above"
echo "   2. Sign in with your IAM Identity Center credentials"
echo "   3. Add CloudWatch as a data source"
echo "   4. Import the dashboard from:"
echo "      AI-OBS_DEMO/grafana/dashboards/ai-observability-cloudwatch.json"
echo ""
echo "======================================================================"
