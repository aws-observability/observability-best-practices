# Grafana Setup Guide

## Current Status
- ✅ Grafana Workspace: `g-45577447e2` (ACTIVE)
- ✅ Endpoint: `g-45577447e2.grafana-workspace.us-east-1.amazonaws.com`
- ⚠️ Authentication: AWS SSO required (not yet configured)

## Option 1: Enable AWS IAM Identity Center (Recommended)

### Step 1: Enable IAM Identity Center
```bash
# Open IAM Identity Center console
open "https://console.aws.amazon.com/singlesignon/home?region=us-east-1"

# Or use AWS CLI
aws sso-admin create-instance --region us-east-1
```

**In the Console:**
1. Go to IAM Identity Center
2. Click "Enable"
3. Choose "Enable with AWS Organizations" (or standalone)
4. Wait for activation (takes 1-2 minutes)

### Step 2: Create a User
1. In IAM Identity Center → Users
2. Click "Add user"
3. Fill in:
   - Username: your-username
   - Email: your-email@amazon.com
   - First/Last name
4. Click "Next" → "Add user"
5. Check your email for the invitation

### Step 3: Assign User to Grafana
Once Identity Center is enabled, run:

```bash
# Get the Identity Store ID
IDENTITY_STORE_ID=$(aws sso-admin list-instances --query 'Instances[0].IdentityStoreId' --output text)

# Get your user ID
USER_ID=$(aws identitystore list-users --identity-store-id $IDENTITY_STORE_ID --query "Users[?UserName=='your-username'].UserId" --output text)

# Assign user to Grafana workspace
aws grafana update-permissions \
  --workspace-id g-45577447e2 \
  --update-instruction-batch '[
    {
      "action": "ADD",
      "role": "ADMIN",
      "users": [
        {
          "id": "'$USER_ID'",
          "type": "SSO_USER"
        }
      ]
    }
  ]' \
  --region us-east-1
```

### Step 4: Access Grafana
1. Open: https://g-45577447e2.grafana-workspace.us-east-1.amazonaws.com
2. Sign in with your IAM Identity Center credentials
3. You should now have admin access

---

## Option 2: Use CloudWatch Dashboards (Already Working!)

If you prefer to skip the SSO setup, you already have a working CloudWatch dashboard:

**Dashboard URL:**
https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#dashboards:name=AI-Observability-Demo

**Advantages:**
- ✅ No SSO setup required
- ✅ Already created and working
- ✅ Shows all your metrics
- ✅ Integrated with CloudWatch Logs

**To view:**
```bash
# Open in browser
open "https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#dashboards:name=AI-Observability-Demo"

# Generate more data
python3 AI-OBS_DEMO/local-demo.py
```

---

## Option 3: Switch Grafana to API Key Authentication

Update Grafana to use API key authentication instead of SSO:

```bash
aws grafana update-workspace-authentication \
  --workspace-id g-45577447e2 \
  --authentication-providers SAML \
  --region us-east-1
```

Then configure SAML with your corporate identity provider.

---

## Comparison

| Feature | CloudWatch Dashboard | Grafana |
|---------|---------------------|---------|
| Setup Time | ✅ Immediate | ⚠️ Requires SSO setup |
| Authentication | AWS Console | IAM Identity Center |
| Customization | Good | Excellent |
| Multi-source | Limited | Excellent |
| Cost | Included | ~$9/month |
| Current Status | ✅ Working | ⚠️ Needs SSO |

---

## Recommendation

**For this demo:** Use the CloudWatch Dashboard (Option 2) - it's already working and shows all your metrics.

**For production:** Set up Grafana with IAM Identity Center (Option 1) for better visualization and multi-source support.

---

## Quick Start (CloudWatch)

```bash
# View your dashboard
open "https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#dashboards:name=AI-Observability-Demo"

# Run demo to generate data
python3 AI-OBS_DEMO/local-demo.py

# View metrics
open "https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#metricsV2:graph=~();namespace=AIObservability"

# View logs
open "https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#logsV2:log-groups/log-group/$252Fai-observability-demo"
```
