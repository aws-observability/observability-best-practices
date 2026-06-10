---
sidebar_position: 1
---

# AWS Organizations 账户迁移准备指南

> **免责声明：** 本指南基于在 AWS Organizations 之间转移账户时常见的依赖项和注意事项提供尽力而为的指导。任何迁移的成功完成取决于每个客户的独特场景、工作负载和依赖关系。客户有责任全面评估其特定环境、验证所有依赖项，并在执行前测试其迁移计划。本指南并未涵盖所有可能的依赖项或边缘情况。

## 范围

本指南涵盖 **AWS Organizations 之间的账户迁移**。此处描述的方法使用 [Account Assessment for AWS Organizations](https://docs.aws.amazon.com/solutions/account-assessment-for-aws-organizations/) 和 [CFAT](https://github.com/cloud-foundations-on-aws/cloud-foundations-templates/blob/main/cfat/README.md) 来加速审查和评估流程。根据您决定使用的工具或方法，步骤可能会有所不同，但本指南提供了一种经过验证的方式。

:::tip
将账户移入 AWS Control Tower 环境时，请使用本指南作为迁移前的依赖项检查，然后在账户转移到目标组织后，按照[注册现有 AWS 账户](https://docs.aws.amazon.com/controltower/latest/userguide/enroll-account.html)指南作为补充。
:::

## 关键服务和依赖项概览

下表总结了在组织之间转移账户时可能受影响的关键 AWS 服务和功能：

| 类别 | 服务/功能 | 转移影响 |
|----------|----------------|-------------------|
| **访问控制** | IAM Identity Center | 权限集分配被移除；用户失去访问权限 |
| **授权** | 服务控制策略 (SCPs) | 立即停止应用 |
| **授权** | 资源控制策略 (RCPs) | 立即停止应用 |
| **声明式** | 声明式策略 (EC2) | 立即停止应用 |
| **管理** | 标签、备份、AI 退出策略 | 从账户分离 |
| **基础设施** | AWS CloudFormation StackSets | 资源可能被删除（取决于保留设置） |
| **资源共享** | AWS Resource Access Manager | 组织范围的共享被撤销（除非启用保留） |
| **委派** | 委派管理员服务 | 必须在转移前取消注册；某些服务会删除数据 |
| **策略条件** | `aws:PrincipalOrgID` / `aws:PrincipalOrgPaths` | 引用源组织 ID 的策略将拒绝访问 |
| **计费** | Reserved Instances / Savings Plans | 失去组织范围的共享优惠 |
| **计费** | 成本分配标签 | 必须在目标组织中重新激活 |
| **Observability** | Amazon EventBridge 跨账户 | 引用组织 ID 的事件总线策略将失效 |
| **账户访问** | Root 用户 / `OrganizationAccountAccessRole` | 如果在转移前未验证，可能失去所有访问权限 |

## 概述

本指南提供了一个逐步流程，用于在 AWS Organizations 之间转移账户前评估迁移准备情况。它结合了自动化工具（[Account Assessment for AWS Organizations](https://docs.aws.amazon.com/solutions/account-assessment-for-aws-organizations/) + [CFAT](https://github.com/cloud-foundations-on-aws/cloud-foundations-templates/blob/main/cfat/README.md)）和经过验证的 CLI 命令来覆盖所有依赖项。

**适用场景：** 并购、组织整合、账户重组。

**利用的关键功能：**
- [Direct Account Transfers](https://aws.amazon.com/about-aws/whats-new/2025/11/aws-organizations-direct-account-transfers/)（2025 年 11 月）——无需独立期
- [AWS RAM RetainSharingOnAccountLeaveOrganization](https://aws.amazon.com/about-aws/whats-new/2026/02/aws-resource-access-manager/)（2026 年 2 月）——在转移期间保留资源共享

**参考资料：**
- [将账户迁移到另一个组织](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_account_migration.html) — AWS 文档
- [移动账户 - 第 1 部分：策略、AWS RAM、条件键](https://aws.amazon.com/blogs/mt/aws-organizations-moving-an-organization-member-account-to-another-organization-part-1/) — AWS 博客
- [移动账户 - 第 2 部分：委派管理员](https://aws.amazon.com/blogs/mt/aws-organizations-moving-an-organization-member-account-to-another-organization-part-2/) — AWS 博客

---

## 第 1 阶段：部署评估工具

### 1.1 部署 Account Assessment for AWS Organizations

在管理账户中部署。提供：策略浏览器、委派管理员扫描、受信任访问扫描。

:::note
为简单起见，本指南展示了在管理账户中部署 Hub 堆栈。对于生产环境，AWS 建议将 Hub 堆栈部署在**单独的成员账户**（例如共享服务或安全工具账户）中，以遵循管理账户中的最小权限原则。无论如何，Org-Management 堆栈始终部署在管理账户中。
:::

**Hub 堆栈（管理账户）：**
```bash
aws cloudformation create-stack \
  --stack-name AccountAssessment-Hub \
  --template-url https://solutions-reference.s3.amazonaws.com/account-assessment-for-aws-organizations/latest/account-assessment-for-aws-organizations-hub.template \
  --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND \
  --parameters \
    ParameterKey=DeploymentNamespace,ParameterValue=<NAMESPACE> \
    ParameterKey=UserEmail,ParameterValue=<EMAIL> \
    "ParameterKey=AllowListedIPRanges,ParameterValue=0.0.0.0/1\,128.0.0.0/1" \
    ParameterKey=OrganizationID,ParameterValue=<ORG_ID> \
    ParameterKey=ManagementAccountId,ParameterValue=<MGMT_ACCOUNT_ID> \
  --region <REGION>
```

**Org-Management 堆栈（管理账户）：**
```bash
aws cloudformation create-stack \
  --stack-name AccountAssessment-OrgMgmt \
  --template-url https://solutions-reference.s3.amazonaws.com/account-assessment-for-aws-organizations/latest/account-assessment-for-aws-organizations-org-management.template \
  --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND \
  --parameters \
    ParameterKey=DeploymentNamespace,ParameterValue=<NAMESPACE> \
    ParameterKey=HubAccountId,ParameterValue=<HUB_ACCOUNT_ID> \
  --region <REGION>
```

**Spoke 堆栈（每个要评估的账户，通过 StackSet）：**
```bash
aws cloudformation create-stack-set \
  --stack-set-name AccountAssessment-Spoke \
  --template-url https://solutions-reference.s3.amazonaws.com/account-assessment-for-aws-organizations/latest/account-assessment-for-aws-organizations-spoke.template \
  --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM \
  --parameters \
    ParameterKey=DeploymentNamespace,ParameterValue=<NAMESPACE> \
    ParameterKey=HubAccountId,ParameterValue=<HUB_ACCOUNT_ID> \
  --permission-model SERVICE_MANAGED \
  --auto-deployment Enabled=true,RetainStacksOnAccountRemoval=false \
  --region <REGION>

aws cloudformation create-stack-instances \
  --stack-set-name AccountAssessment-Spoke \
  --deployment-targets OrganizationalUnitIds=<ROOT_OR_OU_ID> \
  --regions <REGION> \
  --region <REGION>
```

> **重要：** 还需要直接在管理账户中部署 Spoke 堆栈（SERVICE_MANAGED 的 StackSets 不包含管理账户）：
```bash
aws cloudformation create-stack \
  --stack-name AccountAssessment-Spoke \
  --template-url https://solutions-reference.s3.amazonaws.com/account-assessment-for-aws-organizations/latest/account-assessment-for-aws-organizations-spoke.template \
  --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND \
  --parameters \
    ParameterKey=DeploymentNamespace,ParameterValue=<NAMESPACE> \
    ParameterKey=HubAccountId,ParameterValue=<HUB_ACCOUNT_ID> \
  --region <REGION>
```

### 1.2 运行 CFAT（Cloud Foundation Assessment Tool）

在管理账户的 CloudShell 中运行：
```bash
curl -sSL https://raw.githubusercontent.com/cloud-foundations-on-aws/cloud-foundations-templates/main/cfat/run-assessment.sh | sh
```

下载结果：`./cfat/assessment.zip`

---

## 第 2 阶段：自动化评估（Account Assessment 工具）

### 2.1 从 Web UI 运行扫描

1. 登录 Account Assessment Web UI（检查邮箱获取 Cognito 凭证）
2. 运行**委派管理员**扫描 → 下载 CSV
3. 运行**受信任访问**扫描 → 下载 CSV
4. 等待**策略浏览器**夜间扫描（或手动触发）：

```bash
# 手动触发策略浏览器扫描
aws lambda invoke \
  --function-name <NAMESPACE>-PolicyExplorerStartScan-<ID> \
  --payload '{"source": "manual-trigger"}' \
  --region <REGION> \
  /dev/null
```

### 2.2 在策略浏览器中搜索组织依赖项

在 Web UI 策略浏览器中：
1. 点击 **"Add OrgId"** 按钮搜索策略条件中的组织 ID
2. 搜索 `aws:PrincipalOrgID`、`aws:PrincipalOrgPaths`、`aws:ResourceOrgID`
3. 将结果下载为 CSV

**此功能发现的内容：**
- 带有组织条件的资源基策略（S3、KMS、SQS、SNS、Lambda 等）
- 引用组织的身份基策略
- 带有组织特定条件的 SCPs

---

## 第 3 阶段：手动依赖项检查（CLI 命令）

以下检查覆盖了自动化工具未涉及的差距。

### 3.1 针对该账户的 AWS CloudFormation StackSets

**风险：** 当账户离开组织时，服务托管的 StackSets 将从账户中删除资源（除非 `RetainStacksOnAccountRemoval=true`）。

:::info
从**管理账户**或 CloudFormation StackSets 的委派管理员账户运行这些命令。服务托管的 StackSets 只能从这些账户管理。
:::

```bash
# 列出所有活动的 StackSets
aws cloudformation list-stack-sets --status ACTIVE --region <REGION>

# 对于每个 StackSet，检查迁移账户是否有实例
aws cloudformation list-stack-instances \
  --stack-set-name <STACKSET_NAME> \
  --stack-instance-account <ACCOUNT_ID> \
  --region <REGION>

# 检查保留设置
aws cloudformation describe-stack-set \
  --stack-set-name <STACKSET_NAME> \
  --region <REGION> \
  --query "StackSet.AutoDeployment.RetainStacksOnAccountRemoval"
```

**操作：** 对于每个 `RetainStacksOnAccountRemoval=false` 且部署了关键资源的 StackSet，可以：
- 在迁移前更新为 `RetainStacksOnAccountRemoval=true`
- 或记录这些资源将被删除并计划在目标组织中重新创建

### 3.2 IAM Identity Center 分配

**风险：** 当账户离开时，迁移账户的所有权限集分配都将被移除。用户将失去对该账户的 IAM Identity Center 访问权限。

:::info
从**管理账户**或 Identity Center 委派管理员账户运行这些命令。
:::

```bash
# 获取 Identity Center 实例 ARN
aws sso-admin list-instances --region <REGION>

# 列出分配给该账户的所有权限集
aws sso-admin list-permission-sets-provisioned-to-account \
  --instance-arn <INSTANCE_ARN> \
  --account-id <ACCOUNT_ID> \
  --region <REGION>

# 对于每个权限集，列出谁有访问权限
aws sso-admin list-account-assignments \
  --instance-arn <INSTANCE_ARN> \
  --account-id <ACCOUNT_ID> \
  --permission-set-arn <PERMISSION_SET_ARN> \
  --region <REGION>
```

**操作：** 记录所有分配。在目标组织的 Identity Center 中，迁移后重新创建等效的权限集和分配。

### 3.3 AWS Resource Access Manager (AWS RAM) 资源共享

**风险：** 当账户离开时，组织范围的 AWS RAM 共享将被撤销。新功能（2026 年 2 月）允许保留。

```bash
# 检查迁移账户拥有的共享（从该账户运行）
aws ram get-resource-shares --resource-owner SELF --region <REGION>

# 检查迁移账户使用的共享
aws ram get-resource-shares --resource-owner OTHER-ACCOUNTS --region <REGION>

# 列出共享中的实际资源
aws ram list-resources --resource-owner OTHER-ACCOUNTS --region <REGION>
aws ram list-resources --resource-owner SELF --region <REGION>
```

**缓解措施（2026 年 2 月功能）：** 在转移前对 AWS RAM 共享启用保留：
```bash
# 从共享所有者账户运行
aws ram update-resource-share \
  --resource-share-arn <SHARE_ARN> \
  --retain-sharing-on-account-leave-organization \
  --region <REGION>
```

**通过 SCP 在组织范围内强制执行：**
```json
{
  "Effect": "Deny",
  "Action": ["ram:CreateResourceShare", "ram:UpdateResourceShare"],
  "Resource": "*",
  "Condition": {
    "BoolIfExists": {
      "ram:RetainSharingOnAccountLeaveOrganization": "false"
    }
  }
}
```

### 3.4 组织策略（授权策略、声明式策略和管理策略）

**风险：** 当账户转移时，所有组织策略都将停止应用。这包括授权策略（SCPs、RCPs）、声明式策略（EC2）和管理策略。

:::info
从**管理账户**或 AWS Organizations 的委派管理员账户运行这些命令。
:::

> **重要：** Account Assessment 中的策略浏览器仅扫描 **SCP 内容**。它不涵盖 RCPs、声明式策略或管理策略。这些必须手动检查。
>
> **提示：** CFAT 提供了有用的初始快照——它确认 SCPs、RCPs、标签策略和备份策略是否在组织级别启用。使用此作为起点，了解哪些策略类型需要使用以下 CLI 命令进行更深入的调查。

```bash
# 首先：发现组织中启用的所有策略类型
aws organizations list-roots --query "Roots[0].PolicyTypes"

# --- 授权策略 ---

# 应用于账户的 SCPs（策略浏览器也覆盖内容）
aws organizations list-policies-for-target \
  --target-id <ACCOUNT_ID> \
  --filter SERVICE_CONTROL_POLICY

# 应用于账户的 RCPs（策略浏览器不覆盖）
aws organizations list-policies-for-target \
  --target-id <ACCOUNT_ID> \
  --filter RESOURCE_CONTROL_POLICY

# --- 声明式策略 ---

# 声明式策略 (EC2 - 例如允许的 AMI、阻止公共快照)
aws organizations list-policies-for-target \
  --target-id <ACCOUNT_ID> \
  --filter DECLARATIVE_POLICY_EC2

# --- 管理策略 ---

# 检查每个已启用的管理策略类型：
aws organizations list-policies-for-target --target-id <ACCOUNT_ID> --filter TAG_POLICY
aws organizations list-policies-for-target --target-id <ACCOUNT_ID> --filter BACKUP_POLICY
aws organizations list-policies-for-target --target-id <ACCOUNT_ID> --filter AISERVICES_OPT_OUT_POLICY
aws organizations list-policies-for-target --target-id <ACCOUNT_ID> --filter BEDROCK_POLICY
aws organizations list-policies-for-target --target-id <ACCOUNT_ID> --filter CHATBOT_POLICY
aws organizations list-policies-for-target --target-id <ACCOUNT_ID> --filter INSPECTOR_POLICY
aws organizations list-policies-for-target --target-id <ACCOUNT_ID> --filter NETWORK_SECURITY_DIRECTOR_POLICY
aws organizations list-policies-for-target --target-id <ACCOUNT_ID> --filter S3_POLICY
aws organizations list-policies-for-target --target-id <ACCOUNT_ID> --filter SECURITYHUB_POLICY
aws organizations list-policies-for-target --target-id <ACCOUNT_ID> --filter UPGRADE_ROLLOUT_POLICY

# 获取账户的父 OU（策略可能是继承的）
aws organizations list-parents --child-id <ACCOUNT_ID>

# 列出 OU 级别的策略（对每种策略类型重复）
aws organizations list-policies-for-target \
  --target-id <OU_ID> \
  --filter <POLICY_TYPE>

# 获取策略内容以在目标组织中复制
aws organizations describe-policy --policy-id <POLICY_ID>

# 获取有效管理策略
aws organizations describe-effective-policy \
  --policy-type TAG_POLICY \
  --target-id <ACCOUNT_ID>

aws organizations describe-effective-policy \
  --policy-type BACKUP_POLICY \
  --target-id <ACCOUNT_ID>

aws organizations describe-effective-policy \
  --policy-type AISERVICES_OPT_OUT_POLICY \
  --target-id <ACCOUNT_ID>
```

**关键区别：**
- **授权策略（SCPs、RCPs）** — SCPs 限制主体可以执行的 API 操作。RCPs 限制可以对资源执行的操作（例如阻止对 Secrets Manager 的未加密访问）。策略浏览器仅扫描 SCPs，不扫描 RCPs。
- **声明式策略（EC2）** — 强制 EC2 的所需状态配置（例如仅允许的 AMI、阻止公共快照）。两个工具都不扫描。
- **管理策略** — 标签、备份、AI 退出、Bedrock、ChatBot、Inspector、SecurityHub、S3、Network Security Director、Upgrade Rollout。转移时分离。两个工具都不扫描。

**操作：** 对于组织中启用的每种策略类型：
1. 列出应用于账户的策略（直接 + 从 OU/根继承）
2. 使用 `describe-policy` 获取策略内容
3. 在转移前在目标组织中复制
4. 对于声明式策略：验证账户的资源也符合目标组织策略

### 3.5 委派管理员服务

**风险：** 必须在迁移前取消注册。某些服务在取消注册时会删除数据（Detective、Firewall Manager）。

:::info
从**管理账户**运行这些命令。
:::

```bash
# 列出所有委派管理员账户
aws organizations list-delegated-administrators

# 列出迁移账户的服务
aws organizations list-delegated-services-for-account \
  --account-id <ACCOUNT_ID>
```

**操作：** 对于每个委派服务：
1. 注册替代委派管理员（如果组织继续运营）
2. 取消注册迁移账户
3. 参阅第 2 部分博客了解服务特定的取消注册命令和数据丢失影响

### 3.6 Amazon EventBridge 跨账户事件总线

**风险：** 引用组织的跨账户事件传递权限将失效。

```bash
# 检查事件总线策略中的组织基权限
aws events describe-event-bus --region <REGION>

# 在使用 EventBridge 的所有区域中检查
aws events describe-event-bus --name default --region <REGION>
```

**操作：** 更新事件总线资源策略，使用账户 ID 而不是组织 ID，或添加目标组织 ID。

### 3.7 计费和成本管理

**风险：** 组织级别的计费历史记录保留在管理账户中。成本分配标签必须重新激活。

```bash
# 列出活动的成本分配标签（以在目标组织中重新创建）
aws ce list-cost-allocation-tags --status Active

# 检查 CUR 报告配置
aws cur describe-report-definitions --region us-east-1

# 检查组织详细信息（功能集，用于目标组织兼容性）
aws organizations describe-organization

# 列出迁移账户拥有的 Savings Plans（从该账户运行）
aws savingsplans list-savings-plans --states active

# 列出迁移账户拥有的 Reserved Instances（从该账户运行）
aws ec2 describe-reserved-instances --filters Name=state,Values=active --region <REGION>

# 检查 Reserved Instance/Savings Plan 共享偏好（从管理账户运行）
# 注意：使用计费控制台 -> 偏好设置 -> RI 和 Savings Plans 折扣共享
# 查看共享模式（组织范围、优先组或限制组）
```

**操作：**
- 在转移前导出所有计费报告
- 记录活动的成本分配标签
- 在目标组织中重新激活成本分配标签（最多需要 24 小时）
- **Reserved Instances 和 Savings Plans：**
  - 由迁移账户**购买的** Reserved Instances/Savings Plans 将随账户一起转移——但它们将不再应用于源组织的合并账单
  - 源组织中**其他账户购买的**与迁移账户共享的 Reserved Instances/Savings Plans 在转移后将不再使迁移账户受益
  - Reserved Instances/Savings Plans 仅适用于购买它们的组织——它们不能跨多个组织
  - 如果迁移账户受益于组织范围的 Reserved Instance/Savings Plan 共享，它将立即失去该折扣
  - 如果迁移账户拥有在组织范围内共享的 Reserved Instances/Savings Plans，源组织将失去该折扣容量
  - **检查共享模式：** 组织范围、优先组或限制组共享影响范围
  - 如果需要在迁移前将 Reserved Instances/Savings Plans 转移到其他账户，请联系 AWS Support

---

## 第 4 阶段：CFAT 基础准备情况（目标组织）

使用 CFAT 结果验证**目标组织**是否准备好接收账户：

| CFAT 检查 | 对迁移的重要性 |
|------------|------------------------------|
| Control Tower 已部署 | 为传入的账户提供防护栏 |
| Security OU 存在 | 账户需要受治理的着陆区 |
| Log Archive 账户存在 | 为迁移账户提供集中日志记录 |
| IAM Identity Center 已配置 | 用户需要 IAM Identity Center 访问新账户 |
| SCPs 已启用 | 治理策略必须就绪 |
| Config Recorder 已启用 | 新账户的合规性监控 |

---

## 第 5 阶段：转移前检查清单

| # | 检查项 | 工具 | CLI 命令 | 状态 |
|---|-------|------|-------------|--------|
| 1 | 资源基策略中的组织 ID | Account Assessment（策略浏览器） | Web UI → Add OrgId | ☐ |
| 2 | 身份基策略中的组织 ID | Account Assessment（策略浏览器） | Web UI 搜索 | ☐ |
| 3 | 委派管理员服务 | Account Assessment（委派管理员扫描） | `list-delegated-services-for-account` | ☐ |
| 4 | 受信任访问服务 | Account Assessment（受信任访问扫描） | `list-aws-service-access-for-organization` | ☐ |
| 5 | 针对账户的 StackSets | 手动 | `list-stack-instances --stack-instance-account` | ☐ |
| 6 | StackSet 保留设置 | 手动 | `describe-stack-set` → AutoDeployment | ☐ |
| 7 | Identity Center 分配 | 手动 | `list-permission-sets-provisioned-to-account` | ☐ |
| 8 | AWS RAM 共享（拥有的） | 手动 | `get-resource-shares --resource-owner SELF` | ☐ |
| 9 | AWS RAM 共享（使用的） | 手动 | `get-resource-shares --resource-owner OTHER-ACCOUNTS` | ☐ |
| 10 | AWS RAM RetainSharing 已启用 | 手动 | `update-resource-share --retain-sharing...` | ☐ |
| 11 | 应用于账户的 SCPs（授权） | Account Assessment（策略浏览器）+ 手动 | `list-policies-for-target` | ☐ |
| 12 | 应用于账户的 RCPs（授权） | 手动（不在策略浏览器中） | `list-policies-for-target --filter RESOURCE_CONTROL_POLICY` | ☐ |
| 13 | 应用于账户的声明式策略（EC2） | 手动（两个工具都不包含） | `list-policies-for-target --filter DECLARATIVE_POLICY_EC2` | ☐ |
| 14 | 管理策略（标签/备份/AI/Bedrock/ChatBot/Inspector/SecurityHub/S3/等） | 手动 | `describe-effective-policy` + `list-policies-for-target` | ☐ |
| 15 | EventBridge 跨账户 | 手动 | `describe-event-bus` | ☐ |
| 16 | 成本分配标签已记录 | 手动 | `list-cost-allocation-tags --status Active` | ☐ |
| 17 | CUR 报告已导出 | 手动 | `describe-report-definitions` | ☐ |
| 18 | Reserved Instance/Savings Plan 所有权和共享影响已评估 | 手动 | `list-savings-plans` + `describe-reserved-instances` | ☐ |
| 19 | 目标组织年龄 ≥ 7 天 | 手动 | `describe-organization` | ☐ |
| 20 | 目标组织账户配额 | 手动 | 检查 Service Quotas | ☐ |
| 21 | 目标组织 SCPs/RCPs/声明式策略就绪 | 手动 | 从源复制 | ☐ |
| 22 | 目标组织 Identity Center 就绪 | CFAT | 在目标上运行 CFAT | ☐ |
| 23 | OrganizationAccountAccessRole 已移除 | 手动 | 在迁移账户中删除 IAM 角色 | ☐ |

---

## 第 5.5 阶段：紧急恢复——验证账户恢复选项

**场景：** 如果在未验证 Identity Center 访问或其他访问控制的情况下转移账户，您可能会失去对该账户的所有访问权限。在转移前，确保您可以独立恢复访问权限。

**重要性：** 一旦账户离开源组织：
- Identity Center 权限集被移除 → IAM Identity Center 访问权限丢失
- `OrganizationAccountAccessRole` 信任可能失效 → 跨账户访问权限丢失
- 如果不存在 root 用户凭证（对于组织创建的账户很常见）→ 账户被锁定

### 转移前：验证恢复选项

```bash
# 验证账户有有效的 root 用户邮箱（您能在那里收到邮件吗？）
aws account get-primary-email --account-id <ACCOUNT_ID> --region us-east-1

# 验证电话号码已设置（root 用户 MFA 恢复所需）
aws account get-contact-information --account-id <ACCOUNT_ID> --region us-east-1

# 检查备用联系人是否已配置
aws account get-alternate-contact --account-id <ACCOUNT_ID> --alternate-contact-type SECURITY --region us-east-1
aws account get-alternate-contact --account-id <ACCOUNT_ID> --alternate-contact-type BILLING --region us-east-1
aws account get-alternate-contact --account-id <ACCOUNT_ID> --alternate-contact-type OPERATIONS --region us-east-1
```

### 转移前：如需更新恢复信息

```bash
# 更新 root 用户邮箱（从管理账户，需要 Account Management 受信任访问）
aws account start-primary-email-update --account-id <ACCOUNT_ID> --primary-email <NEW_EMAIL> --region us-east-1
aws account accept-primary-email-update --account-id <ACCOUNT_ID> --otp <CODE> --primary-email <NEW_EMAIL> --region us-east-1

# 更新账户名称（2025 年 4 月功能——不再需要 root 访问）
aws account put-account-name --account-id <ACCOUNT_ID> --account-name <NEW_NAME> --region us-east-1

# 更新电话号码/联系信息
aws account put-contact-information --account-id <ACCOUNT_ID> --region us-east-1 \
  --contact-information '{
    "FullName": "<NAME>",
    "PhoneNumber": "<PHONE>",
    "AddressLine1": "<ADDRESS>",
    "City": "<CITY>",
    "StateOrRegion": "<STATE>",
    "PostalCode": "<ZIP>",
    "CountryCode": "<CC>"
  }'
```

### 紧急恢复选项（转移后访问丢失时）

> ⚠️ **预检查至关重要。** 联系 AWS Support 应该是最后手段——它需要多个身份验证步骤，可能需要数天时间，并且不保证能恢复访问。确保在转移前验证所有恢复选项。

| 优先级 | 方法 | 使用时机 | 操作方式 |
|----------|--------|-------------|-----|
| 第 1 | **Root 用户密码重置** | 您有 root 邮箱的访问权限 | 前往 AWS 登录页面 → "忘记密码" → 通过邮件重置 |
| 第 2 | **Root 用户 MFA 重置** | MFA 设备丢失，有电话号码 | 在登录时使用电话验证流程 |
| 第 3 | **管理账户（目标组织）** | 账户现在在目标组织中 | 使用 `OrganizationAccountAccessRole`（如果存在），或 Account Management API |
| **最后手段** | **AWS Support** | 无邮箱/电话访问，所有其他选项已用尽 | 从另一个账户开 Support 工单。需要多个验证步骤（账户 ID、联系信息、计费详情）。**不保证成功且可能需要较长时间。** |

### 转移前恢复检查清单

| # | 检查项 | 状态 |
|---|-------|--------|
| 1 | Root 用户邮箱可访问（能收到邮件） | ☐ |
| 2 | Root 用户密码已知或可通过邮件重置 | ☐ |
| 3 | 账户上的电话号码是最新的且可访问 | ☐ |
| 4 | Root 用户的 MFA 设备已记录/可访问 | ☐ |
| 5 | 账户中至少存在一个具有管理员访问权限的 IAM 用户/角色（独立于组织） | ☐ |
| 6 | 备用联系人（安全、计费、运维）已设置 | ☐ |

> **关键：** 对于通过 Organizations 中的 `CreateAccount` 创建的账户，root 用户凭证可能从未设置过。您必须在转移账户之前执行 root 用户密码重置（通过 root 邮箱），以确保您可以独立访问它。

---

## 第 6 阶段：执行转移（直接转移）

使用直接转移功能（2025 年 11 月），无需独立期：

```bash
# 步骤 1：从目标组织管理账户 - 发送邀请
aws organizations invite-account-to-organization \
  --target '{"Type": "ACCOUNT", "Id": "<ACCOUNT_ID>"}' \
  --region <REGION>

# 步骤 2：从迁移账户 - 接受邀请
aws organizations accept-handshake \
  --handshake-id <HANDSHAKE_ID> \
  --region <REGION>
```

---

## 第 7 阶段：转移后验证

```bash
# 验证账户已在新组织中
aws organizations describe-organization

# 将账户移动到正确的 OU
aws organizations move-account \
  --account-id <ACCOUNT_ID> \
  --source-parent-id <ROOT_ID> \
  --destination-parent-id <TARGET_OU_ID>

# 验证 SCPs 已应用
aws organizations list-policies-for-target \
  --target-id <ACCOUNT_ID> \
  --filter SERVICE_CONTROL_POLICY

# 接受任何 AWS RAM 共享邀请
aws ram accept-resource-share-invitation \
  --resource-share-invitation-arn <INVITATION_ARN> \
  --region <REGION>

# 在目标组织中重新激活成本分配标签
aws ce update-cost-allocation-tags-status \
  --cost-allocation-tags-status '[{"TagKey": "<KEY>", "Status": "Active"}]'

# 在目标组织中设置 Identity Center 分配
aws sso-admin create-account-assignment \
  --instance-arn <TARGET_INSTANCE_ARN> \
  --target-id <ACCOUNT_ID> \
  --target-type AWS_ACCOUNT \
  --permission-set-arn <PERMISSION_SET_ARN> \
  --principal-type <USER|GROUP> \
  --principal-id <PRINCIPAL_ID> \
  --region <REGION>
```

---

## 附录：工具覆盖矩阵

| 依赖项类别 | Account Assessment | CFAT | 手动 CLI |
|--------------------|-------------------|------|------------|
| 资源基策略（组织条件） | ✅ 策略浏览器 | ❌ | — |
| 身份基策略（组织条件） | ✅ 策略浏览器 | ❌ | — |
| SCP 内容和条件（授权） | ✅ 策略浏览器 | ❌ | `describe-policy` |
| **RCPs（授权）** | ❌ | ✅ 仅检查是否启用 | ✅ `list-policies-for-target --filter RESOURCE_CONTROL_POLICY` |
| **声明式策略（EC2）** | ❌ | ❌ | ✅ `list-policies-for-target --filter DECLARATIVE_POLICY_EC2` |
| **管理策略（Bedrock、ChatBot、Inspector、SecurityHub、S3 等）** | ❌ | ❌ | ✅ `list-policies-for-target --filter <TYPE>` |
| 标签/备份/AI 退出（管理） | ❌ | ✅ 仅检查是否启用 | ✅ `describe-effective-policy` |
| 委派管理员 | ✅ 扫描 | ❌ | `list-delegated-services-for-account` |
| 受信任访问服务 | ✅ 扫描 | ✅ 列出服务 | `list-aws-service-access-for-organization` |
| StackSets（有风险的资源） | ❌ | ❌ | ✅ `list-stack-instances` + `describe-stack-set` |
| Identity Center 分配 | ❌ | ✅ 检查是否已配置 | ✅ `list-account-assignments` |
| AWS RAM 资源共享 | ❌ | ❌ | ✅ `get-resource-shares` |
| Reserved Instance/Savings Plan 所有权和共享影响 | ❌ | ❌ | ✅ `list-savings-plans` + `describe-reserved-instances` |
| EventBridge 跨账户 | ❌ | ❌ | ✅ `describe-event-bus` |
| 成本分配标签 | ❌ | ❌ | ✅ `list-cost-allocation-tags` |
| Control Tower 状态 | ❌ | ✅ | — |
| 基础最佳实践 | ❌ | ✅ 完整评估 | — |
| 组织配额 | ❌ | ❌ | ✅ Service Quotas 控制台 |

---

## 附录：关键日期和功能可用性

| 功能 | 日期 | 对迁移的影响 |
|---------|------|---------------------|
| Direct Account Transfers | 2025 年 11 月 | 无独立期，无需重新配置付款/联系方式 |
| AWS RAM RetainSharingOnAccountLeaveOrganization | 2026 年 2 月 | 资源共享在转移过程中保留 |
| Account Assessment Policy Explorer | v1.1.0+ | 夜间扫描组织相关策略 |

---

*使用 Account Assessment for AWS Organizations 和 CFAT 生成。所有 CLI 命令已针对实时 AWS API 进行验证。*
