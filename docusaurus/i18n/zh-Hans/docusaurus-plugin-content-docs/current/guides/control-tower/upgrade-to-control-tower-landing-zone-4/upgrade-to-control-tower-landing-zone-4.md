---
sidebar_position: 5
---
# 升级到 AWS Control Tower Landing Zone 4.0

## 简介

如果您正在使用 AWS Control Tower Landing Zone 3.x，现在可以升级到 4.0 版本，以获得更大的灵活性来在您的 AWS 组织中应用治理控制。本文将引导您了解关键的架构变更，帮助您理解迁移影响，并提供成功升级的分步指导。

在早期版本的 AWS Control Tower（3.x 及更早版本）中，启用着陆区要求您接受预定义的组织结构和强制性的服务集成。Landing Zone 4.0 移除了这些限制，允许您：

- 访问 [AWS Control Catalog](https://docs.aws.amazon.com/controltower/latest/userguide/control-catalog.html) 中的 1200 多个控制措施，无需重构现有组织
- 您现在可以自由选择根据您的具体需求启用哪些 AWS 服务。服务集成不再是强制性的，允许您：
  - 仅在需要时启用 [AWS Config](https://aws.amazon.com/config/) 用于检测性控制
  - 如果您有现有的审计日志记录解决方案，可以独立管理 [AWS CloudTrail](https://aws.amazon.com/cloudtrail/)
  - 根据您的身份管理策略选择是否使用 [AWS IAM Identity Center](https://aws.amazon.com/iam/identity-center/)
  - 根据您的备份需求控制 [AWS Backup](https://aws.amazon.com/backup/) 集成
- 定义您自己的组织单元 (OU) 层次结构，同时应用 AWS Control Tower 治理
- 仅使用 [AWS Organizations](https://aws.amazon.com/organizations/) 集成和控制措施部署最小着陆区，无需专用的服务集成账户

这种以控制为中心的模式对于拥有现有着陆区的企业特别有价值，因为它允许您逐步采用 AWS Control Tower 治理。您可以应用控制措施和合规性监控，而无需进行早期版本所需的大规模重构。

有关充分利用 AWS Control Catalog 的额外指导，请参阅 AWS 文档：[在 AWS Control Tower 中使用 Control Catalog 搜索和发现治理控制](https://aws.amazon.com/blogs/mt/search-and-discover-governance-controls-with-control-catalog-in-aws-control-tower/)。

## 优势和架构变更

Landing Zone 4.0 引入了重大改进，提供了更大的灵活性和运营效率。以下比较突出了 3.x 版本和 4.0 版本之间的关键差异：

| 功能 | 版本 3.x | 版本 4.0 |
|---------|-------------|-------------|
| 服务集成 | 强制性 | 可选 |
| [AWS Config](https://aws.amazon.com/config/) S3 存储桶 | 与 [AWS CloudTrail](https://aws.amazon.com/cloudtrail/) 共享 | 专用存储桶 |
| AWS Config 聚合器 | 组织 + 账户聚合器 | 服务关联聚合器 |
| 委派管理员 | 无 | 审计账户用于 AWS Config |
| OU 结构 | 强制性安全 OU | 灵活的客户自定义 |
| Manifest 字段 | 必需 | 可选 |
| Config 基线 | AWSControlTowerBaseline 的一部分 | 独立的 ConfigBaseline |
| 偏移通知 | [Amazon SNS](https://aws.amazon.com/sns/) | [Amazon EventBridge](https://aws.amazon.com/eventbridge/) |



## 先决条件

在升级到 AWS Control Tower Landing Zone 4.0 之前，请确保满足以下要求：

> **重要提示**：此升级不可逆。AWS Control Tower 不支持降级到以前的着陆区版本。一旦升级到 Landing Zone 4.0，就无法回滚到 3.x 版本。强烈建议先在非生产环境中测试升级，并在继续之前进行全面备份。

#### 一般先决条件

1. **解决组织偏移**：强烈建议在升级到 Landing Zone 4.0 之前解决所有组织偏移。您可以在 AWS Control Tower 控制台中检查偏移。升级前未解决的偏移可能在升级后和 OU 重新注册后仍然存在，可能需要 AWS Support 案例来解决。

2. **查看 AWS Control Tower 先决条件**：确保您的环境满足所有标准 [AWS Control Tower 先决条件](https://docs.aws.amazon.com/controltower/latest/userguide/getting-started-prereqs.html)。

3. **审查服务集成依赖关系**：了解基线之间的依赖关系。如果您计划将来禁用 AWS Config 集成，由于服务依赖关系，您还必须禁用 Security Roles、AWS IAM Identity Center 和 AWS Backup 集成。

4. **进行全面备份**：升级前，记录并备份您当前的配置：
   - 导出组织结构（OU、账户、账户到 OU 的映射）
   - 截图或导出当前着陆区设置、Config 聚合器视图和 SNS 主题配置
   - 导出 Config 规则和聚合器配置
   - 导出 CloudFormation StackSet 模板和参数
   - 记录每个 OU 的当前基线版本和每个 OU 的控制启用状态
   - 保存 CfCT CloudFormation 模板（如适用）

```bash
# Export organizational units
aws organizations list-organizational-units-for-parent \
  --parent-id <ROOT_ID> > org_units_backup.json

# Export all accounts
aws organizations list-accounts > accounts_backup.json

# Export Config rules
aws configservice describe-config-rules > config_rules_backup.json

# Export Config aggregators
aws configservice describe-configuration-aggregators > aggregators_backup.json

# Export Control Tower IAM roles
aws iam get-role --role-name AWSControlTowerExecution > ct_exec_role_backup.json
aws iam get-role --role-name AWSControlTowerCloudTrailRole > ct_cloudtrail_role_backup.json
```

### AWS CloudFormation StackSet 先决条件

#### 删除已关闭/暂停账户的堆栈实例

当 AWS 账户关闭时，其在管理账户 `AWSControlTowerBP-*` StackSets 中的 AWS CloudFormation 堆栈实例**不会自动删除**。在升级过程中，AWS Control Tower 尝试更新这些 StackSets 并失败，因为它无法在已关闭的账户中承担 `AWSControlTowerExecution` 角色。这是一个[已记录的限制](https://docs.aws.amazon.com/controltower/latest/userguide/troubleshooting.html#unable-to-update-landing-zone)。

在长期关闭了账户的组织中，这可能导致升级停滞，因为每个 StackSet 操作依次超时。为防止这种情况，请在升级前运行以下预检检查和修复：

**预检检查：**

```bash
# Identify closed/suspended accounts
CLOSED=$(aws organizations list-accounts \
  --query "Accounts[?Status!='ACTIVE'].Id" --output text)

# Check for orphaned stack instances in AWS Control Tower StackSets
for SS in $(aws cloudformation list-stack-sets --status ACTIVE \
  --query "Summaries[?starts_with(StackSetName,'AWSControlTowerBP-')].StackSetName" \
  --output text); do
  for ACCT in $CLOSED; do
    COUNT=$(aws cloudformation list-stack-instances --stack-set-name "$SS" \
      --query "length(Summaries[?Account=='${ACCT}'])" --output text)
    [ "$COUNT" -gt 0 ] && echo "BLOCKER: $SS has $COUNT instances for closed account $ACCT"
  done
done
```

**建议的修复方法：**

```bash
# For each StackSet flagged as BLOCKER in the pre-flight check above,
# remove the orphaned instances for the closed account
aws cloudformation delete-stack-instances \
  --stack-set-name "<stackset-name>" \
  --accounts '["<closed-account-id>"]' \
  --regions '["us-east-1","us-west-2"]' \
  --retain-stacks \
  --no-cli-pager
```

> **重要提示**：[`--retain-stacks`](https://docs.aws.amazon.com/cli/latest/reference/cloudformation/delete-stack-instances.html) 标志是必需的。没有它，AWS CloudFormation 会尝试在已关闭的账户中承担 `AWSControlTowerExecution` 来删除堆栈，这将失败。

#### 验证 AWS Control Tower 基线堆栈没有终止保护

4.0 版本的升级会删除或替换成员账户中的某些 AWS CloudFormation 堆栈（特别是与 AWS Config 相关的基线）。如果这些堆栈启用了终止保护，StackSet 操作将失败，升级将停滞。

AWS Control Tower **不会**在其基线堆栈上启用终止保护——它使用 [SCP（强制性预防控制）](https://docs.aws.amazon.com/prescriptive-guidance/latest/designing-control-tower-landing-zone/mandatory.html)代替。但是，终止保护可能在 AWS Control Tower 之外被启用，例如：

- **AWS Security Hub CSPM 自动修复** — [CloudFormation.3](https://docs.aws.amazon.com/securityhub/latest/userguide/cloudformation-controls.html) 建议对所有堆栈启用终止保护。自动修复会在每个堆栈上启用它，包括 AWS Control Tower 管理的堆栈。
- **[AWS Landing Zone Accelerator](https://docs.aws.amazon.com/solutions/latest/landing-zone-accelerator-on-aws/problem-validationerror.html)**，默认在其预配置的堆栈上启用终止保护。

**预检检查（从管理账户运行）：**

```bash
# Assume role into a member account
CREDS=$(aws sts assume-role \
  --role-arn "arn:aws:iam::<member-account-id>:role/AWSControlTowerExecution" \
  --role-session-name "tp-check" --query Credentials --output json)

export AWS_ACCESS_KEY_ID=$(echo $CREDS | jq -r .AccessKeyId)
export AWS_SECRET_ACCESS_KEY=$(echo $CREDS | jq -r .SecretAccessKey)
export AWS_SESSION_TOKEN=$(echo $CREDS | jq -r .SessionToken)

# Check AWS Control Tower baseline stacks for termination protection
aws cloudformation describe-stacks --region <region> \
  --query "Stacks[?starts_with(StackName,'StackSet-AWSControlTowerBP-')].\
  [StackName,EnableTerminationProtection]" --output table
```

**建议的修复方法：**

```bash
aws cloudformation update-termination-protection \
  --no-enable-termination-protection \
  --stack-name "<stack-name>" --region <region>
```

### AWS CloudTrail 先决条件

如果您通过 API 升级并启用了 AWS CloudTrail 集成：

1. **更新 IAM 角色策略**：从 `AWSControlTowerCloudTrailRole` 分离现有的内联策略，并附加新的托管策略 `AWSControlTowerCloudTrailRolePolicy`。

```bash
# Detach inline policy
aws iam delete-role-policy \
  --role-name AWSControlTowerCloudTrailRole \
  --policy-name <inline-policy-name>

# Attach new managed policy
aws iam attach-role-policy \
  --role-name AWSControlTowerCloudTrailRole \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSControlTowerCloudTrailRolePolicy
```

2. **了解 S3 存储桶上的 S3 复制配置**：保护 Control Tower 管理的 CloudTrail S3 存储桶的强制性 SCP (CTS3PV8) 现在阻止 *s3:PutReplicationConfiguration* 操作。由于 LZ 4.0 继续使用现有的 CloudTrail 存储桶，任何当前的复制配置将继续正常工作。但是，升级后您将无法修改或重新创建复制规则。如果您需要在升级后修改复制设置，解决方法是承担 AWSControlTowerExecution 角色（该角色免于 SCP 限制）来更新复制规则，但应谨慎使用，因为这会绕过 Control Tower 的保护性防护栏。

### AWS Config 先决条件

1. **了解数据存储变更**：请注意，升级后 AWS Config 数据将存储在新的专用 S3 存储桶中。历史数据将保留在原始共享存储桶中，不会自动迁移。升级完成后，新的 Config 数据可能需要长达 24 小时才能出现在新存储桶中。

2. **识别依赖的工作流**：记录所有直接从 S3 存储桶访问 AWS Config 数据的工作流、脚本和工具，包括：
   - 日志聚合工具（Splunk、Datadog 等）
   - SIEM 集成
   - 自定义 dashboard（标签合规、补丁合规等）
   - 自动化合规报告工具
   

   识别每个依赖项的所有者，并在升级前协调切换时间。

3. **了解 S3 存储桶上的 S3 复制配置**：保护 Control Tower 管理的 Config S3 存储桶的强制性 SCP (CTS3PV7) 现在阻止 **s3:PutReplicationConfiguration 操作**。因此，升级后您将无法在此存储桶上配置 S3 复制。如果您需要为新的 Config 存储桶进行复制，解决方法是承担 **AWSControlTowerExecution** 角色（该角色免于 SCP 限制）来创建复制规则，但应谨慎使用，因为这会绕过 Control Tower 的保护性防护栏。

4. **清点自定义 AWS Config 高级查询**：如果您在管理账户中针对组织级别聚合器创建了自定义 AWS Config 高级查询，升级后需要在审计账户中重新创建这些查询。Config 聚合器从管理账户移动到审计账户，因此从管理账户进行的跨账户查询将不再有效。在升级前记录所有自定义查询。

5. **审查 SNS 主题订阅**：审查 AWS Control Tower SNS 主题上的所有订阅，特别是第三方集成（ServiceNow、PagerDuty 等）的 HTTPS endpoint。验证这些订阅在升级后将继续接收通知。

6. **识别具有预先存在 Config 资源的账户**：如果您有已注册的账户具有非 Control Tower 创建的预先存在的 AWS Config 传送通道，这些传送通道不会自动更新为指向新的 Config S3 存储桶。在升级前识别这些账户。请参阅 AWS 文档[注册具有现有 AWS Config 资源的账户](https://docs.aws.amazon.com/controltower/latest/userguide/existing-config-resources.html)。


## 升级流程

本节提供从 3.x 版本升级到 4.0 版本的 AWS Control Tower 着陆区的分步指导。

### 步骤 1：准备升级

1. **访问 AWS Control Tower 控制台**，在您的管理账户中的主区域。

2. **查看着陆区版本**：导航到着陆区设置页面并验证您当前的版本。

![查看着陆区版本](/img/cloudops/guides/control-tower/upgrade/image.png)

3. **检查偏移**：在着陆区设置页面上，验证您的着陆区显示"未检测到偏移"。如果检测到偏移，请在继续之前解决。升级前已处于偏移状态的账户可能在升级后和 OU 重新注册后仍然偏移，可能需要 AWS Support 案例来解决。

4. **审查已启用的服务集成**：记录当前启用了哪些服务集成（AWS Config、AWS CloudTrail、AWS IAM Identity Center、AWS Backup）。

### 步骤 2：发起升级

您可以使用 AWS Control Tower 控制台或 AWS CLI/API 升级到 Landing Zone 4.0。

#### 通过控制台升级

1. **导航到着陆区设置**，在 AWS Control Tower 控制台中。

2. 选择 Landing Zone 版本 4.0 并**点击"更新"**按钮开始升级过程。
![通过控制台升级](/img/cloudops/guides/control-tower/upgrade/Pastedimage20260219204716.png)

3. 在下一页，确认选择了 Landing zone 版本 4.0 并可选择配置自动账户注册。请注意，升级后无法回到以前的版本。点击下一步。
![着陆区版本选择](/img/cloudops/guides/control-tower/upgrade/Pastedimage20260219205257.png)

4. 查看您的管辖区域和区域拒绝控制设置，然后点击下一步

![管辖区域](/img/cloudops/guides/control-tower/upgrade/Pastedimage20260219205556.png)
5. 这是您可以更新"服务集成"的页面，然后点击下一步
![服务集成 1](/img/cloudops/guides/control-tower/upgrade/Pastedimage20260219205749.png)
![服务集成 2](/img/cloudops/guides/control-tower/upgrade/Pastedimage20260219205825.png)

![服务集成 3](/img/cloudops/guides/control-tower/upgrade/Pastedimage20260219205843.png)
5. 查看着陆区设置，然后**确认升级**：点击"更新着陆区"开始升级过程。

   ![审查和更新](/img/cloudops/guides/control-tower/upgrade/Pastedimage20260219210023.png)
![审查集成设置](/img/cloudops/guides/control-tower/upgrade/Pastedimage20260219210107.png)

![审查集成设置](/img/cloudops/guides/control-tower/upgrade/Pastedimage20260219210132.png)
6. **监控升级进度**：升级过程通常需要 30-60 分钟。您可以在 AWS Control Tower 控制台中监控进度。


### 步骤 3：验证升级完成

1. **检查着陆区状态**：在 AWS Control Tower 控制台中，验证着陆区状态显示"活动"且版本显示"4.0"。

   ![验证升级完成](/img/cloudops/guides/control-tower/upgrade/Pastedimage20260219210908.png)

2. **审查服务集成**：确认所有之前启用的服务集成仍然启用且功能正常。

3. **检查升级错误**：查看 AWS Control Tower 控制台是否有任何错误消息或警告。

### 步骤 4：验证新的 Config 基线

- **新的 `ConfigBaseline` 基线：** 现在在 OU 级别有一个单独的 `ConfigBaseline`，用于支持检测性控制而无需完整的 `AWSControlTowerBaseline`。有关更多信息，请参阅[OU 级别的基线类型](https://docs.aws.amazon.com//controltower/latest/userguide/types-of-baselines.html#ou-baseline-types)列表。对于使用默认着陆区的现有客户，所有服务集成现在都是可选的，但有[关键变更](https://docs.aws.amazon.com/controltower/latest/userguide/key-changes-lz-v4.html)中概述的依赖关系要求。

![验证基线](/img/cloudops/guides/control-tower/upgrade/Pastedimage20260219222252.png)

### 步骤 5：验证 AWS Config 变更

升级到 Landing Zone 4.0 后，AWS Config 经历了重大架构变更。请遵循以下验证步骤：

#### 验证委派管理员注册

确认审计账户已注册为 AWS Config 委派管理员：

```bash
# Check delegated administrator for AWS Config
aws organizations list-delegated-administrators \
  --service-principal config.amazonaws.com \
  --region <your-home-region>
```

预期输出应显示您的审计账户 ID。

#### 验证服务关联 Config 聚合器

确认服务关联 Config 聚合器 (SLCA) 存在于您的审计账户中。新聚合器名为 `aws-controltower-ConfigAggregatorForOrganizations`，部署在审计账户中（与以前在管理账户中的同名旧聚合器不同）：

```bash
# Describe configuration aggregators in Audit account
aws configservice describe-configuration-aggregators \
  --region <your-home-region>
```

您应该在审计账户中看到聚合器 `aws-controltower-ConfigAggregatorForOrganizations`。请注意，虽然它与管理账户中的旧聚合器同名，但它是部署在不同账户中的不同资源。

![验证聚合器](/img/cloudops/guides/control-tower/upgrade/Pastedimage20260219215025.png)

#### 验证旧聚合器已删除
确认旧聚合器已被删除：

1. 在**管理账户**中，验证 `aws-controltower-ConfigAggregatorForOrganizations` 不再存在
2. 在**审计账户**中，验证 `aws-controltower-GuardRailsComplianceAggregator` 不再存在

```bash
# In the management account - check for old aggregator (should return empty or not found)
aws configservice describe-configuration-aggregators \
  --region <your-home-region>
```

**审查自定义 Config 聚合器**
如果您有 AWS Control Tower 命名约定之外的自定义 AWS Config 聚合器，请验证它们继续正常工作。AWS Control Tower 仅管理具有特定命名模式的聚合器。自定义聚合器不受影响，可以与新的 SLCA 并行运行。

#### 验证自定义 Config 查询迁移

如果您在管理账户中有针对旧组织级别聚合器运行的自定义 AWS Config 高级查询，这些查询现在只能在管理账户中本地运行（不能跨账户）。要运行跨账户查询，请在新的 `aws-controltower-ConfigAggregatorForOrganizations` 聚合器所在的审计账户中重新创建它们。

```bash
# In the Audit account - verify the new aggregator shows all member accounts
aws configservice describe-configuration-aggregator-sources-status \
  --configuration-aggregator-name aws-controltower-ConfigAggregatorForOrganizations \
  --region <your-home-region>
```

#### 验证新 S3 存储桶创建

确认审计账户中存在新的专用 AWS Config S3 存储桶：

```bash
# List S3 buckets in Audit account
aws s3 ls | grep aws-controltower-config-logs
```

预期存储桶命名模式：`aws-controltower-config-logs-<AUDIT_ACCOUNT>-<REGION_STRING>-<SUFFIX_STRING>`

![验证 AWS Config S3 存储桶](/img/cloudops/guides/control-tower/upgrade/Pastedimage20260219215231.png)

> **注意**：升级后，成员账户的 Config 数据可能需要长达 24 小时才能出现在新的 S3 存储桶中。从 S3 读取数据的 Dashboard 和合规工具在此期间将显示过时数据。要获取近实时数据访问，请使用 Config Aggregator API。

#### 验证 CloudTrail 存储桶未更改

确认 AWS CloudTrail 继续使用日志存档账户中的现有存储桶：

```bash
# List S3 buckets in Log Archive account
aws s3 ls | grep aws-controltower-logs
```

预期存储桶命名模式：`aws-controltower-logs-<LOGGING_ACCOUNT>-<HOME_REGION>`

通过检查最近的时间戳来测试数据流：

```bash
# Check recent CloudTrail logs
aws s3 ls s3://aws-controltower-logs-<LOGGING_ACCOUNT>-<HOME_REGION>/ --recursive | tail -20
```

#### 验证 Config 传送通道

检查所有已注册账户中的 AWS Config 传送通道是否指向新的 S3 存储桶：

```bash
# Describe delivery channels
aws configservice describe-delivery-channels \
  --region <your-home-region>
```

`s3BucketName` 应引用新的 `aws-controltower-config-logs-*` 存储桶。

![验证 AWS Config S3 存储桶](/img/cloudops/guides/control-tower/upgrade/Pastedimage20260219215431.png)

如果您有已注册的账户具有非 Control Tower 创建的预先存在的 Config 传送通道，必须手动更新它们以指向新存储桶：

```bash
# Update pre-existing delivery channels to new bucket
aws configservice put-delivery-channel \
  --delivery-channel name=<CHANNEL_NAME>,s3BucketName=aws-controltower-config-logs-<AUDIT_ACCOUNT>-<REGION>-<SUFFIX>
```

#### 验证 SLCA 数据聚合

升级完成后，等待 24-48 小时进行完整的数据聚合。然后验证新的服务关联 Config 聚合器可以从组织中的所有 AWS Config 记录器聚合数据，包括非 AWS Control Tower 管理的账户：

```bash
# Get aggregated compliance summary
aws configservice get-aggregate-compliance-details-by-config-rule \
  --configuration-aggregator-name aws-controltower-ConfigAggregatorForOrganizations \
  --config-rule-name <any-config-rule-name> \
  --account-id <test-account-id> \
  --aws-region <region> \
  --region <your-home-region>
```

#### 验证下游 Dashboard 和工具

Config 数据开始流入新存储桶后（最多 24 小时），验证所有依赖的 Dashboard 和工具正在接收新鲜数据：

- 标签合规 Dashboard
- 补丁合规 Dashboard
- SIEM 集成
- 任何自定义合规报告工具

仍然引用旧 `aws-controltower-logs-*` 存储桶的 Dashboard 将显示升级前的过时数据。将它们更新为指向新的 `aws-controltower-config-logs-*` 存储桶，或者最好将它们重构为使用 Config Aggregator API。


### 步骤 6：验证 AWS CloudTrail 变更

AWS CloudTrail 在 Landing Zone 4.0 中经历的变更较小，但您应验证以下内容：

#### 验证 IAM 角色策略更新

如果您通过 API 升级，请确认 `AWSControlTowerCloudTrailRole` 使用新的托管策略：

```bash
# List attached policies for CloudTrail role
aws iam list-attached-role-policies \
  --role-name AWSControlTowerCloudTrailRole
```

预期输出应包含 `AWSControlTowerCloudTrailRolePolicy`。

#### 验证 CloudTrail 日志记录继续

确认组织跟踪继续记录：

```bash
# Describe trails
aws cloudtrail describe-trails \
  --region <your-home-region>
```

验证跟踪状态为活动，并记录到预期的 S3 存储桶。

### 步骤 7：验证 SNS 主题变更

Landing Zone 4.0 为每个服务集成引入了专用的 SNS 主题。验证审计账户中的 SNS 主题：

```bash
# List SNS topics in Audit account
aws sns list-topics --region <your-home-region>
```

审计账户中预期的 SNS 主题：
- `aws-controltower-AllConfigNotifications` - 仍接收 AWS Config 事件
- `aws-controltower-AggregateSecurityNotifications` - 仍存在但仅用于非偏移通知
- `aws-controltower-AggregateConfigurationNotifications` - 继续用于合规通知

![验证 SNS 主题](/img/cloudops/guides/control-tower/upgrade/Pastedimage20260219211445.png)

对于启用了 `AWSControlTowerBaseline` 进行升级的客户，审计账户中的现有 SNS 主题及其订阅将被保留并继续正常工作。主要变更是针对稍后禁用 `AWSControlTowerBaseline` 的客户——在这种情况下，偏移通知从 Amazon SNS 移动到管理账户中的 Amazon EventBridge。

> **注意**：某些现有的 SNS 主题（如 `aws-controltower-AggregateSecurityNotifications`）可能没有活动的订阅者。这是预期的，与升级前的行为一致——这些主题充当占位符，不表示问题。

审查所有 SNS 主题订阅，特别是第三方集成（ServiceNow、PagerDuty 等）的 HTTPS endpoint，以确认它们在升级后继续接收通知。

### 步骤 8：验证控制措施变更

随着 AWS Control Tower Landing Zone 4.0 的推出，强制性控制发生了多项变更。要验证变更，请遵循文档 [Landing Zone 4.0 控制变更](https://docs.aws.amazon.com/controltower/latest/controlreference/mandatory-controls.html#changes-in-landing-zone-40)


## 重新注册组织单元

升级到 Landing Zone 4.0 后，您应该重新注册您的 OU 以将新的基线版本应用于成员账户。这是一个可以分阶段完成的增量过程。

#### 理解 OU 重新注册

当 AWS Control Tower 更新到 4.0 版本时，由于新的基线依赖结构，OU 重新注册变得必要。请参阅有关[[基线与 AWS Control Tower 着陆区版本兼容性]]的文档。

当您重新注册一个 OU 时：
- AWS Control Tower 使用新的基线版本更新该 OU 中的所有成员账户
- Control Tower 管理的 SCP 在刷新时暂时不活动（通常几分钟）
- 自定义 SCP 保持强制执行且不受影响
- 工作负载继续运行不会中断
- 每个 OU 单批最多可以处理 1000 个账户

> **重要提示**：重新注册父 OU 不会级联到子 OU。层次结构中的每个 OU 必须单独重新注册。计划从顶层 OU 开始向下分别重新注册每个子 OU。如果您有深层 OU 层次结构，这可能会显著增加推出时间。


#### 分阶段推出策略

**推荐方法**：

1. **层次化启用**：先从顶层 OU 开始，再处理子 OU。记住每个子 OU 必须单独重新注册——不会级联。
2. **混合基线版本**：在过渡期间可以接受（3.x 和 4.0 混合）
3. **批量处理**：使用"重新注册 OU"更新 OU 中的所有账户（每批最多 1000 个账户）
4. **监控每个 OU**：在继续下一个 OU 之前验证重新注册成功

#### 通过控制台重新注册 OU

1. 在 AWS Control Tower 控制台中导航到 **OU** 页面
2. 选择要重新注册的 OU
3. 点击**重新注册 OU**
4. 查看将被更新的账户
5. 点击**重新注册 OU** 确认
6. 在控制台中监控重新注册进度

**注意**：迁移后，您可能需要手动重新注册某些 OU 以部署新的基线版本。这是预期行为，确保您可以控制何时应用基线更新。

> **故障排除**：如果一个账户在升级前已经处于偏移状态，重新注册后可能仍然偏移。在这种情况下，请在受影响的账户中向 AWS Support 开启支持案例以调查和解决持续的偏移。

## 其他资源

- [AWS Control Tower 用户指南](https://docs.aws.amazon.com/controltower/latest/userguide/)
- [AWS Control Tower API 参考](https://docs.aws.amazon.com/controltower/latest/APIReference/)
- [AWS Control Catalog](https://docs.aws.amazon.com/controltower/latest/userguide/control-catalog.html)
- [AWS Config 用户指南](https://docs.aws.amazon.com/config/latest/developerguide/)
- [AWS CloudTrail 用户指南](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/)
- [AWS Organizations 用户指南](https://docs.aws.amazon.com/organizations/latest/userguide/)
