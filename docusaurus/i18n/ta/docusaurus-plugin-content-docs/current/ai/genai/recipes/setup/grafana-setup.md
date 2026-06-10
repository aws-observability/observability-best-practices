# Grafana அமைப்பு வழிகாட்டி

## தற்போதைய நிலை
- ✅ Grafana Workspace: `<your-amg-workspace-id>` (ACTIVE)
- ✅ Endpoint: `<your-amg-workspace-id>.grafana-workspace.<your-region>.amazonaws.com`
- ⚠️ Authentication: AWS SSO required (not yet configured)

## விருப்பம் 1: AWS IAM Identity Center இயக்கவும் (பரிந்துரைக்கப்படுகிறது)

### படி 1: IAM Identity Center இயக்கவும்
```bash
# Open IAM Identity Center console
open "https://console.aws.amazon.com/singlesignon/home?region=<your-region>"

# Or use AWS CLI
aws sso-admin create-instance --region <your-region>
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
  --workspace-id <your-amg-workspace-id> \
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
  --region <your-region>
```

### Step 4: Access Grafana
1. Open: `https://<your-amg-workspace-id>.grafana-workspace.<your-region>.amazonaws.com`
2. Sign in with your IAM Identity Center credentials
3. You should now have admin access

---

## விருப்பம் 2: CloudWatch டாஷ்போர்டுகளைப் பயன்படுத்தவும் (ஏற்கனவே செயல்படுகிறது!)

If you prefer to skip the SSO setup, you already have a working CloudWatch dashboard:

**Dashboard URL:**
`https://console.aws.amazon.com/cloudwatch/home?region=<your-region>#dashboards:name=AI-Observability-Demo`

**Advantages:**
- ✅ No SSO setup required
- ✅ Already created and working
- ✅ Shows all your metrics
- ✅ Integrated with CloudWatch Logs

**To view:**
```bash
# Open in browser
open "https://console.aws.amazon.com/cloudwatch/home?region=<your-region>#dashboards:name=AI-Observability-Demo"

# Generate more data
python3 AI-OBS_DEMO/local-demo.py
```

---

## விருப்பம் 3: Grafana-ஐ API Key Authentication-க்கு மாற்றவும்

Update Grafana to use API key authentication instead of SSO:

```bash
aws grafana update-workspace-authentication \
  --workspace-id <your-amg-workspace-id> \
  --authentication-providers SAML \
  --region <your-region>
```

Then configure SAML with your corporate identity provider.

---

## ஒப்பீடு

| Feature | CloudWatch Dashboard | Grafana |
|---------|---------------------|---------|
| Setup Time | ✅ Immediate | ⚠️ Requires SSO setup |
| Authentication | AWS Console | IAM Identity Center |
| Customization | Good | Excellent |
| Multi-source | Limited | Excellent |
| Cost | Included | ~$9/month |
| Current Status | ✅ Working | ⚠️ Needs SSO |

---

## பரிந்துரை

**இந்த demo-க்கு:** CloudWatch Dashboard (விருப்பம் 2) பயன்படுத்தவும் - இது ஏற்கனவே செயல்படுகிறது மற்றும் உங்கள் அனைத்து மெட்ரிக்குகளையும் காட்டுகிறது.

**Production-க்கு:** சிறந்த visualization மற்றும் multi-source support-க்கு IAM Identity Center-உடன் Grafana (விருப்பம் 1) அமைக்கவும்.

---

## Quick Start (CloudWatch)

```bash
# View your dashboard
open "https://console.aws.amazon.com/cloudwatch/home?region=<your-region>#dashboards:name=AI-Observability-Demo"

# Run demo to generate data
python3 AI-OBS_DEMO/local-demo.py

# View metrics
open "https://console.aws.amazon.com/cloudwatch/home?region=<your-region>#metricsV2:graph=~();namespace=AIObservability"

# View logs
open "https://console.aws.amazon.com/cloudwatch/home?region=<your-region>#logsV2:log-groups/log-group/$252Fai-observability-demo"
```
