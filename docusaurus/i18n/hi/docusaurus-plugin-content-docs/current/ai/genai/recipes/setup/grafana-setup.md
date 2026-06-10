# Grafana सेटअप गाइड

## वर्तमान स्थिति
- ✅ Grafana Workspace: `<your-amg-workspace-id>` (सक्रिय)
- ✅ Endpoint: `<your-amg-workspace-id>.grafana-workspace.<your-region>.amazonaws.com`
- ⚠️ प्रमाणीकरण: AWS SSO आवश्यक (अभी तक कॉन्फ़िगर नहीं)

## विकल्प 1: AWS IAM Identity Center सक्षम करें (अनुशंसित)

### चरण 1: IAM Identity Center सक्षम करें
```bash
# Open IAM Identity Center console
open "https://console.aws.amazon.com/singlesignon/home?region=<your-region>"

# Or use AWS CLI
aws sso-admin create-instance --region <your-region>
```

**Console में:**
1. IAM Identity Center पर जाएं
2. "Enable" पर क्लिक करें
3. "Enable with AWS Organizations" (या standalone) चुनें
4. सक्रियण के लिए प्रतीक्षा करें (1-2 मिनट लगते हैं)

### चरण 2: एक User बनाएं
1. IAM Identity Center → Users में
2. "Add user" पर क्लिक करें
3. भरें:
   - Username: your-username
   - Email: your-email@amazon.com
   - First/Last name
4. "Next" → "Add user" पर क्लिक करें
5. आमंत्रण के लिए अपना ईमेल चेक करें

### चरण 3: User को Grafana में असाइन करें
एक बार Identity Center सक्षम हो जाने पर, चलाएं:

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

### चरण 4: Grafana एक्सेस करें
1. खोलें: `https://<your-amg-workspace-id>.grafana-workspace.<your-region>.amazonaws.com`
2. अपने IAM Identity Center क्रेडेंशियल से साइन इन करें
3. अब आपके पास admin एक्सेस होना चाहिए

---

## विकल्प 2: CloudWatch Dashboards का उपयोग करें (पहले से काम कर रहा है!)

यदि आप SSO सेटअप छोड़ना चाहते हैं, तो आपके पास पहले से एक काम करने वाला CloudWatch डैशबोर्ड है:

**Dashboard URL:**
`https://console.aws.amazon.com/cloudwatch/home?region=<your-region>#dashboards:name=AI-Observability-Demo`

**लाभ:**
- ✅ SSO सेटअप आवश्यक नहीं
- ✅ पहले से बनाया और काम कर रहा है
- ✅ आपके सभी मेट्रिक्स दिखाता है
- ✅ CloudWatch Logs के साथ एकीकृत

**देखने के लिए:**
```bash
# Open in browser
open "https://console.aws.amazon.com/cloudwatch/home?region=<your-region>#dashboards:name=AI-Observability-Demo"

# Generate more data
python3 AI-OBS_DEMO/local-demo.py
```

---

## विकल्प 3: Grafana को API Key प्रमाणीकरण पर स्विच करें

SSO के बजाय API key प्रमाणीकरण का उपयोग करने के लिए Grafana अपडेट करें:

```bash
aws grafana update-workspace-authentication \
  --workspace-id <your-amg-workspace-id> \
  --authentication-providers SAML \
  --region <your-region>
```

फिर अपने कॉर्पोरेट identity provider के साथ SAML कॉन्फ़िगर करें।

---

## तुलना

| फ़ीचर | CloudWatch Dashboard | Grafana |
|---------|---------------------|---------|
| सेटअप समय | ✅ तत्काल | ⚠️ SSO सेटअप आवश्यक |
| प्रमाणीकरण | AWS Console | IAM Identity Center |
| कस्टमाइज़ेशन | अच्छा | उत्कृष्ट |
| मल्टी-सोर्स | सीमित | उत्कृष्ट |
| लागत | शामिल | ~$9/माह |
| वर्तमान स्थिति | ✅ काम कर रहा | ⚠️ SSO चाहिए |

---

## अनुशंसा

**इस डेमो के लिए:** CloudWatch Dashboard (विकल्प 2) का उपयोग करें - यह पहले से काम कर रहा है और आपके सभी मेट्रिक्स दिखाता है।

**प्रोडक्शन के लिए:** बेहतर विज़ुअलाइज़ेशन और मल्टी-सोर्स समर्थन के लिए IAM Identity Center (विकल्प 1) के साथ Grafana सेट करें।

---

## त्वरित शुरुआत (CloudWatch)

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
