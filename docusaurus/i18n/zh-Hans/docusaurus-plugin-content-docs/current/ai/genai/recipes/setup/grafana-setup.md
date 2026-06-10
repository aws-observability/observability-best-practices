# Grafana 设置指南

## 当前状态
- Grafana Workspace: `<your-amg-workspace-id>` (ACTIVE)
- Endpoint: `<your-amg-workspace-id>.grafana-workspace.<your-region>.amazonaws.com`
- 身份验证：需要 AWS SSO（尚未配置）

## 选项 1：启用 AWS IAM Identity Center（推荐）

### 步骤 1：启用 IAM Identity Center
```bash
# Open IAM Identity Center console
open "https://console.aws.amazon.com/singlesignon/home?region=<your-region>"

# Or use AWS CLI
aws sso-admin create-instance --region <your-region>
```

**在控制台中：**
1. 转到 IAM Identity Center
2. 点击"启用"
3. 选择"使用 AWS Organizations 启用"（或独立模式）
4. 等待激活（需要 1-2 分钟）

### 步骤 2：创建用户
1. 在 IAM Identity Center -> 用户
2. 点击"添加用户"
3. 填写：
   - 用户名：your-username
   - 电子邮件：your-email@amazon.com
   - 名/姓
4. 点击"下一步" -> "添加用户"
5. 检查您的邮箱获取邀请

### 步骤 3：将用户分配到 Grafana
Identity Center 启用后，运行：

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

### 步骤 4：访问 Grafana
1. 打开：`https://<your-amg-workspace-id>.grafana-workspace.<your-region>.amazonaws.com`
2. 使用您的 IAM Identity Center 凭证登录
3. 您现在应该具有管理员访问权限

---

## 选项 2：使用 CloudWatch Dashboards（已可使用！）

如果您想跳过 SSO 设置，您已经有一个可用的 CloudWatch dashboard：

**Dashboard URL：**
`https://console.aws.amazon.com/cloudwatch/home?region=<your-region>#dashboards:name=AI-Observability-Demo`

**优势：**
- 无需 SSO 设置
- 已创建并可使用
- 显示所有 metrics
- 与 CloudWatch Logs 集成

**查看方法：**
```bash
# Open in browser
open "https://console.aws.amazon.com/cloudwatch/home?region=<your-region>#dashboards:name=AI-Observability-Demo"

# Generate more data
python3 AI-OBS_DEMO/local-demo.py
```

---

## 选项 3：将 Grafana 切换到 API Key 身份验证

将 Grafana 更新为使用 API key 身份验证而非 SSO：

```bash
aws grafana update-workspace-authentication \
  --workspace-id <your-amg-workspace-id> \
  --authentication-providers SAML \
  --region <your-region>
```

然后使用您的企业身份提供商配置 SAML。

---

## 比较

| 功能 | CloudWatch Dashboard | Grafana |
|---------|---------------------|---------|
| 设置时间 | 即时 | 需要 SSO 设置 |
| 身份验证 | AWS 控制台 | IAM Identity Center |
| 自定义能力 | 良好 | 优秀 |
| 多数据源 | 有限 | 优秀 |
| 成本 | 包含 | 约 $9/月 |
| 当前状态 | 可使用 | 需要 SSO |

---

## 建议

**对于此演示：** 使用 CloudWatch Dashboard（选项 2）- 它已经可以使用并显示所有 metrics。

**对于生产环境：** 使用 IAM Identity Center 设置 Grafana（选项 1）以获得更好的可视化和多数据源支持。

---

## 快速入门（CloudWatch）

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
