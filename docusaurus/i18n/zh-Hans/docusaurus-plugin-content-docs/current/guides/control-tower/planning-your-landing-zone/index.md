---
sidebar_position: 1
---
# 规划和实施您的 Landing Zone

## 启用适合您业务需求的区域

### 选择最常用的区域作为您的主区域

尽管 Control Tower 可以治理多个区域，但必须从单一的主区域启用。确定您预计运行大部分工作负载的区域，并将其指定为 Control Tower 主区域。如果您使用的是现有的 AWS Identity Center 实例，您的主区域必须与 AWS Identity Center 配置所在的区域相同。

Control Tower 主区域存储着 Landing Zone 的关键配置项。AWS Organization 在此处创建，IAM Identity Center 在此处启用，同时还有用于 CloudTrail 数据存储的 S3 bucket。审计账户中的 AWS Config 也配置为将发现结果聚合到主区域。


### 拒绝未使用的区域，治理所有允许的区域

Control Tower 提供了拒绝使用大多数 AWS 区域并仅启用满足业务需求的子集的功能。这可以减少攻击面，降低工作负载产生不必要成本的可能性，并简化治理和可观测性需求。

[全局区域拒绝控制](https://docs.aws.amazon.com/controltower/latest/userguide/region-deny.html)可以在创建或更新 Landing Zone 时设置。这与 Control Tower 治理区域列表配合使用，即如果该区域未启用治理，它将被拒绝。要进一步限制特定组织单元 (OU) 的区域使用，您还可以实施 [OU 区域拒绝控制](https://docs.aws.amazon.com/controltower/latest/controlreference/ou-region-deny.html)。这两种控制都是使用[服务控制策略 (SCP)](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html) 实现的。如果某个区域未被拒绝，用户可以根据 IAM 权限向其部署资源。在拒绝某个区域之前，请确保该区域中没有正在使用的资源，以避免影响您的工作负载。

Control Tower 主区域默认受治理，且不能取消治理。

Control Tower 区域拒绝 SCP 包含 Control Tower 正常运行所需的例外项。

## 使用 AWS Identity Center 简化访问控制

AWS 最佳实践是避免使用 IAM 用户，而是要求通过[身份联合](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html#bp-users-federation-idp)授予人员对 AWS 资源的访问权限。这极大地减轻了凭证被盗用的风险，因为您不再需要使用长期有效的 AWS 凭证。对于集中访问管理，我们建议您使用 [AWS IAM Identity Center](https://docs.aws.amazon.com/singlesignon/latest/userguide/getting-started.html) 来管理对账户的访问和这些账户内的权限。

Identity Center 可以在单个区域启用，并在全球范围内对用户可用。如果您的组织尚未启用 Identity Center，Control Tower 将在您的 Control Tower 主区域中为您启用。如果 Identity Center 已经启用，它必须在您的 Control Tower 主区域中启用，否则[预检查](https://docs.aws.amazon.com/controltower/latest/userguide/getting-started-prereqs.html)将失败。

AWS Identity Center 支持权限集，可以分配给 AWS Organization 中的账户，并作为在这些账户中创建 IAM 角色的模板。当您将 Identity Center 用户或组与特定账户中的特定权限集关联时，它允许该用户或组在该账户中承担权限集定义的角色。如果您允许 Control Tower 管理 Identity Center，它将创建一些[预配置的组和权限集](https://docs.aws.amazon.com/controltower/latest/userguide/sso-groups.html)并将它们分配给账户，为用户访问奠定基础。


### 集成您的企业身份提供商

Identity Center 可用于管理用户和组，但如果您有现有的企业身份提供商，应该[将其连接到 Identity Center](https://docs.aws.amazon.com/singlesignon/latest/userguide/tutorials.html) 以维护身份的单一事实来源。

如果您使用联合用户并且想要利用 Control Tower 在 Identity Center 中设置的默认组和权限集配置，可以在上游提供商中创建同名的组并将它们同步到 Identity Center。然后，您可以在身份提供商中将用户分配到这些组，以授予他们访问已注册账户的权限。

### 朝着最小权限访问努力

Control Tower 创建的默认权限集针对常见用例设计，如 **AdministratorAccess** 和 **DeveloperAccess**。对于生产工作负载，特别是涉及敏感数据或安全和合规性至关重要的其他情况，最佳实践要求将权限降低到所需的最低访问级别。这可以通过使用自定义权限集来专门授予所需权限和/或通过应用服务控制策略来拒绝不必要的访问来实现。[AWS IAM Access Analyzer](https://docs.aws.amazon.com/IAM/latest/UserGuide/what-is-access-analyzer.html) 可以帮助识别必要的权限、删除未使用的权限并编写最小权限策略。


### 启用委托管理员账户

Control Tower 在组织管理账户中启用 Identity Center。最佳实践是尽量减少任何人需要访问管理账户的情况，因为它控制着您 AWS Organization 的其余部分，并且不能像成员账户那样受到预防性控制 (SCP) 的相同程度约束。因此，您应该[为 Identity Center 启用委托管理员账户](https://docs.aws.amazon.com/singlesignon/latest/userguide/delegated-admin.html)。

部署到管理账户的权限集不能从委托管理员账户进行管理，我们建议为管理账户创建专用权限集（例如 MA_Administrator），仅允许高度受限的一组用户承担。

### 对 Control Tower 管理的角色应用额外约束

Control Tower 在成员账户中创建[各种角色](https://docs.aws.amazon.com/controltower/latest/userguide/roles-how.html)，这些角色可由 AWS 服务承担。

为了防止[跨服务混淆代理](https://docs.aws.amazon.com/IAM/latest/UserGuide/confused-deputy.html)问题，您可以定义[资源控制策略 (RCP)](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_rcps_examples.html) 来防止您 AWS Organization 之外的身份欺骗服务代表他们承担角色。

您还可以向 Control Tower 角色添加条件[以进一步限制访问](https://docs.aws.amazon.com/controltower/latest/userguide/conditions-for-role-trust.html)，但请注意，对这些角色的任何更改都可能在 Landing Zone 更新时被覆盖。


## 使用 AWS Backup 保护您的数据

Control Tower 的 [AWS Backup 集成](https://docs.aws.amazon.com/controltower/latest/userguide/backup.html/)可以帮助您设置最佳实践备份解决方案，在每个成员账户中设置备份保管库、在共享账户中设置中央保管库以及一些标准备份策略（每小时、每周、每天、每月）。可以在 OU 级别启用备份，并且可以标记各个资源以将其定位到相关备份计划。

您可以使用您选择的 Control Tower 自定义方法（[AFC](https://docs.aws.amazon.com/controltower/latest/userguide/af-customization-page.html)、[CfCT](https://docs.aws.amazon.com/controltower/latest/userguide/cfct-overview.html)、[AFT](https://docs.aws.amazon.com/controltower/latest/userguide/aft-overview.html)、[StackSets](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/what-is-cfnstacksets.html)）将额外的备份计划部署到账户。这些可以重用 [aws-controltower-BackupRole](https://docs.aws.amazon.com/controltower/latest/userguide/backup-resources.html) 角色，或者您可以根据需要创建新角色。

如果您有现有的备份解决方案，可以选择退出此集成。


## 扩展 AWS Organization 结构以适应业务需求

### 遵循 AWS Organizations 多账户最佳实践

通常，在使用 Control Tower 时，请遵循与[多账户策略](https://docs.aws.amazon.com/whitepapers/latest/organizing-your-aws-environment/organizing-your-aws-environment.html)和组织单元 (OU) 设计相关的 AWS Organizations 最佳实践。保持简单 - 从支持您差异化治理、安全和策略需求所需的 OU 开始，避免深层嵌套 - Control Tower 支持最多五层嵌套。


### 不要修改或删除 Control Tower Security OU

Control Tower 对您的 Organization 施加的少数限制之一是，您不能在 Security OU 下创建额外的账户或 OU，也不能在不破坏 Control Tower 环境的情况下移动或删除 Control Tower 创建的账户（日志归档、审计账户）。


### 不要删除所有 OU 只留下 Security OU

Control Tower 期望至少有两个 OU，其中一个必须是 Security OU。您可以删除启用 Control Tower 时创建的 Sandbox OU，但前提是您的 Organization 中至少有另一个 OU。


