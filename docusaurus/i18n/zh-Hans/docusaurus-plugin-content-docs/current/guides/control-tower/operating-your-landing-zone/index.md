---
sidebar_position: 2
---
# 操作您的着陆区

## 考虑创建测试着陆区

控制措施可以（也应该）在非生产 OU 上测试后再应用于生产账户，但在某些情况下，拥有第二个测试组织也会有所帮助。如果您需要测试着陆区更新、修改着陆区管理自动化或账户自定义流程，拥有一个完全独立的组织可以避免对生产工作负载产生意外影响。

## 保持着陆区更新

着陆区更新可能包括安全改进、成本优化和功能增强。当新的着陆区版本可用时，您应该尽快[更新](https://docs.aws.amazon.com/controltower/latest/userguide/update-controltower.html)它。您可以从 AWS 控制台执行此操作。此过程将更新着陆区组件，包括共享账户（日志存档、审计、备份）。

如果您从 2.x 升级到 3.x，请注意这涉及[额外的注意事项](https://docs.aws.amazon.com/controltower/latest/userguide/lz-update-best-practices.html)，主要关于从账户级别到组织级别 CloudTrail 跟踪的变化。

## 通过 Control Tower 创建账户

通过 Control Tower 的 Account Factory 创建新账户，以便在创建时即被注册和管理。虽然在启用 Control Tower 时可以通过 AWS Organizations 创建账户，但这些账户不会被注册到 Control Tower，即使它们位于 Control Tower 管理的 OU 下也是如此。如果您的组织中有不是通过 Control Tower 创建的账户，您可以注册这些账户以应用 Control Tower 控制和基线。

### 使用联合身份和 Control Tower 管理的 Identity Center 时，在账户创建过程中使用通用的 SSO 用户

如果 Identity Center 由 Control Tower 管理，Account Factory 需要一个 Identity Center 用户作为参数。该用户将被授予对所创建账户的管理员访问权限，但在启用身份联合时该用户将不可用。使用联合身份时此用户不可用，但它仍然是必需参数。该用户不需要唯一，因此为避免创建许多未使用的本地 Identity Center 用户，您可以对多个账户使用同一个用户。如果随后禁用身份联合，则需要访问与该用户关联的电子邮件地址来启用密码并访问您的账户。

## 保持账户更新

着陆区更新完成后，您需要更新您的账户。您可以在控制台中逐个账户更新，也可以通过重新注册整个 OU（只要它们的账户少于 1000 个）来更新。您还可以[自动化此过程](https://docs.aws.amazon.com/controltower/latest/userguide/update-accounts-by-script.html)。

最佳实践是将非生产工作负载放在与生产工作负载不同的 OU 中，这样您可以通过先重新注册非生产 OU 来测试更新的影响。


## 管理偏移

当您的 AWS Control Tower 着陆区组件、账户或组织单元 (OU) 与定义的基线和控制措施不同步时，就会发生偏移。理解和管理偏移对于维护 AWS 环境中的治理和合规性至关重要。

### 通过 Control Tower 对账户和 OU 进行更改以避免偏移

如果您在 Control Tower 之外对账户、OU 或 Control Tower 管理的组织策略（SCP、RCP）进行更改（通常发生在您直接在 AWS Organizations 控制台中进行更改时），可能会导致偏移。

### 定期检查着陆区偏移

Control Tower 会自动检测偏移。定期检查您的着陆区偏移情况并根据需要进行修复。您可以在控制台中导航到"组织"页面，然后选择要检查的 OU 或账户来查看其偏移状态。偏移信息也会在审计账户中聚合的 [SNS 通知](https://docs.aws.amazon.com/controltower/latest/userguide/sns-guidance.html)中显示。您可以订阅 aws-controltower-AggregateSecurityNotifications 主题以确保接收所有偏移通知。由于该主题还会接收 Config 不合规和其他通知，可能会比较嘈杂，因此您可能需要订阅一个 Lambda 来处理感兴趣的通知。


### 解决偏移以确保合规

如果您的着陆区发生偏移，您将无法准确确定您的资源是否符合已启用的控制措施。检测到偏移时应及时修复，以确保满足治理要求。请参阅文档了解一些[可修复偏移](https://docs.aws.amazon.com/controltower/latest/userguide/drift.html#repairable-changes-to-resources)的示例。

* 如果账户或 OU 发生偏移，您可以尝试在控制台中更新账户或重新注册 OU 来解决。
* 对于控制措施，许多类型的偏移可以通过调用 ResetEnabledControl API 来解决。
* 许多类型的偏移可以通过重置着陆区来自动解决。可以通过着陆区设置中版本部分的"重置"按钮来完成。


## 不要删除 Control Tower 所需的 OU 或账户

如前面关于扩展着陆区的章节所述，删除或移动安全 OU 或 Control Tower 管理的账户，或者删除所有其他 OU 只留下安全 OU，都会导致着陆区偏移。在这种状态下，Control Tower 将无法正常工作，直到您重置着陆区。

## 不要删除所需的角色

如果 [Control Tower 所需的角色](https://docs.aws.amazon.com/controltower/latest/userguide/roles-how.html)缺失或无法访问，您将看到一个错误页面，指示您重置着陆区。

## 启用控制措施以强制执行治理要求

遵循[应用控制措施的最佳实践](https://aws.amazon.com/blogs/mt/best-practices-for-applying-controls-with-aws-control-tower/)

在 AWS Controls Catalog 中识别适合您需求的 Control Tower 控制措施。可以通过以下方式根据元数据（包括实施方式、行为、所有者、服务和框架）搜索控制措施：

* Control Tower 控制台
* [Control Tower Catalog 文档](https://docs.aws.amazon.com/controltower/latest/controlreference/controls-reference.html)
* [Amazon Q](https://docs.aws.amazon.com/controltower/latest/controlreference/q-search.html)


如有必要，您可以使用底层服务定义自定义控制措施，但这些控制措施不会包含在 Control Tower dashboard 或合规 metrics 中：

* AWS Organization [SCP](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html) 和 [RCP](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_rcps.html) 用于预防性控制
* AWS [Config Rules](https://docs.aws.amazon.com/config/latest/developerguide/evaluate-config_develop-rules.html) 用于检测性控制
* AWS [CloudFormation hooks](https://docs.aws.amazon.com/cloudformation-cli/latest/hooks-userguide/what-is-cloudformation-hooks.html) 用于主动控制
* AWS [Security Hub CSPM Controls](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-controls-reference.html)

如果您部署自定义策略（SCP 或 RCP），请确保 [Control Tower 服务角色](https://docs.aws.amazon.com/controltower/latest/userguide/awscontroltowerexecution.html)未被拒绝，因为这可能会导致错误或使 Control Tower 无法运行。


始终在部署到生产账户之前测试控制措施。

* 先部署到非生产 OU 和/或测试组织
* 考虑在推出新的预防性控制之前部署等效的检测性控制，以识别和解决不合规问题

## 理解控制继承

控制措施是 AWS Control Tower 的基本要素，了解它们的工作方式对于成功运营着陆区至关重要。

* 强制性控制措施无法禁用，专门保护 Control Tower 资源。它们不会应用于用户工作负载。
* Control Tower 注册的账户继承父 OU 的控制措施
    * 基于 AWS Organizations 策略的预防性控制措施在嵌套 OU 中继承，其他控制措施则不会。
    * 基于 AWS Organizations 策略的预防性控制措施适用于 Control Tower 注册 OU 中的未注册账户，其他控制措施则不适用。

## 更新 Config 控制以使用服务关联规则

自 [2025 年 6 月](https://aws.amazon.com/about-aws/whats-new/2025/06/aws-control-tower-service-linked-aws-config-managed-rules/)起，Control Tower 已支持服务关联的 AWS Config 托管 Config 规则。以前，规则通过 StackSets 部署。服务关联规则由服务直接部署到账户中，除通过 Control Tower 外，用户无法编辑或删除。这提高了部署速度并防止了意外偏移。


## 不要通过 AWS Organizations 移动账户

通过 AWS Organizations 直接在控制台或通过 API 在 OU 之间移动账户将导致 Control Tower 偏移。

如果您需要在 OU 之间移动账户，请通过 [Control Tower 控制台更新账户](https://docs.aws.amazon.com/controltower/latest/userguide/updating-account-factory-accounts.html#update-account-in-console)或通过[在 Service Catalog 中更新账户的预配置产品](https://docs.aws.amazon.com/controltower/latest/userguide/updating-account-factory-accounts.html#update-provisioned-product)来完成。如果您已在 Organizations 中移动了账户，[更新账户](https://docs.aws.amazon.com/controltower/latest/userguide/governance-drift.html#drift-account-moved)应该可以解决偏移问题。


## 审查合规状态

定期审查您的账户和 OU 的合规状态，并采取措施修复不合规问题。

Control Tower dashboard 将显示您应用的 Control Tower 控制措施的合规状态。目前它不会显示在 Control Tower 之外应用的 Config 规则（包括 Security Hub 拥有的规则）的合规状态。

考虑实施 Cloud Intelligence Dashboards 项目中的 [Config Resource Compliance Dashboard](https://catalog.workshops.aws/awscid/en-US/dashboards/additional/config-resource-compliance-dashboard)，以获得组织范围内 Config 合规性的全面视图。

订阅[审计账户中的 SNS 主题](https://docs.aws.amazon.com/controltower/latest/controlreference/receive-notifications.html)以接收有关合规性变更的通知。

## 定期审查已启用的控制措施

定期审查应用于您的账户和 OU 的控制措施，以确保它们继续满足您的业务需求，并且您正在利用新的控制措施。


## 对不合规采取行动

您应该定义 [Systems Manager Documents](https://docs.aws.amazon.com/systems-manager/latest/userguide/documents.html) 并将其与已启用的 Config 规则关联，以便用于[修复不合规](https://docs.aws.amazon.com/config/latest/developerguide/remediation.html)。修复可以[手动触发](https://docs.aws.amazon.com/config/latest/developerguide/setup-manualremediation.html)或配置为[自动运行](https://docs.aws.amazon.com/config/latest/developerguide/setup-autoremediation.html)。



## 监控和优化着陆区成本

### 确保您能够了解着陆区成本

* 使用管理账户中的 [AWS Cost Explorer](https://docs.aws.amazon.com/cost-management/latest/userguide/ce-what-is.html) 了解组织范围内的 AWS 支出
* 配置 [AWS Cost Anomaly Detection](https://docs.aws.amazon.com/cost-management/latest/userguide/getting-started-ad.html) 并订阅通知
* 考虑实施 Cloud Intelligence Dashboards 以轻松启用 [Cost & Usage Report 数据导出](https://docs.aws.amazon.com/cur/latest/userguide/dataexports-create.html)、Athena 集成和详细的 QuickSight 成本 Dashboard

### 了解成本激增的常见原因

* 在启用 Control Tower 的 CloudTrail 集成时，确保删除任何预先存在的管理跟踪以避免 CloudTrail 费用
* Control Tower 使用 AWS Config 跟踪资源状态。这对于维护合规性很重要，但对于频繁变化的短暂工作负载来说，跟踪成本可能很高。Control Tower 目前没有内置选项来修改成员账户中的 Config 记录器，但可以考虑[此解决方法](https://aws.amazon.com/blogs/mt/customize-aws-config-resource-tracking-in-aws-control-tower-environment/)来为 Config 成本过高且合规要求不太严格的账户禁用 Config 记录器。


