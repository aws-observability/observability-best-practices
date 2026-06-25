---
sidebar_position: 4
---
# 在现有 AWS 组织中启用 Control Tower 的额外注意事项

## Control Tower 账户

Control Tower 必须在您的 AWS 组织的管理账户中启用。不可能在单个 AWS 组织中拥有多个着陆区。

当您初次启用 Control Tower 时，它不会自动注册组织中的现有账户，但会创建两个 OU、[共享账户](https://docs.aws.amazon.com/controltower/latest/userguide/accounts.html#special-accounts)及其[内部资源](https://docs.aws.amazon.com/controltower/latest/userguide/shared-account-resources.html)。您的组织必须有足够的配额来允许此操作。

如果在设置 Control Tower 时需要[使用现有账户](https://aws.amazon.com/blogs/mt/use-existing-logging-and-security-account-with-aws-control-tower/)作为日志存档或审计账户，您可以这样做，但需要[删除 Config 记录器](https://docs.aws.amazon.com/cli/latest/reference/configservice/delete-configuration-recorder.html)和 [Config 传送通道](https://docs.aws.amazon.com/cli/latest/reference/configservice/delete-delivery-channel.html)。通常让 Control Tower 创建这些账户并根据需要复制历史日志更为简单，但在某些情况下（例如您有与非 AWS 服务的现有日志集成），可能需要重用现有账户。

## Identity Center

我们强烈建议将 AWS Identity Center 与 Control Tower 结合使用，为您的用户提供身份验证。如果您选择不让 Control Tower 管理 Identity Center 且尚未启用 Identity Center，Control Tower 将不会启用它，您需要为组织实施替代身份解决方案。

如果您尚未配置现有的 Identity Center 并选择 Identity Center 管理，Control Tower 将启用该服务，并可能会也可能不会配置组和权限集，[取决于您选择的身份源](https://docs.aws.amazon.com/controltower/latest/userguide/getting-started-prereqs.html#sso-considerations)。

如果您已配置 Identity Center，它必须与您的 Control Tower 主区域在同一区域。如果您选择 Control Tower 管理且使用本地 IAM Identity Center 目录，Control Tower 将为您创建用户、组和权限集。如果您使用任何其他目录，[Control Tower 不会进行任何更改](https://docs.aws.amazon.com/controltower/latest/userguide/about-extending-governance.html#sso-and-existing-orgs)。

如果您有使用 IAM 用户或 IAM 联合的现有身份解决方案，您应该采用 Identity Center。启用 Control Tower 和 Identity Center 不会影响您现有的 IAM 用户、角色和策略，也不会影响现有的 IAM SAML 配置。这允许您在过渡期间并行运行两个系统，直到您准备好删除旧的 IAM 用户/IAM 联合。



## CloudTrail

如果您打算在现有组织中启用 Control Tower 的 CloudTrail 管理，您需要[禁用 CloudTrail 的受信任访问](https://docs.aws.amazon.com/organizations/latest/userguide/services-that-can-integrate-cloudtrail.html#integrate-disable-ta-cloudtrail)以通过 AWS Control Tower [预检检查](https://docs.aws.amazon.com/controltower/latest/userguide/getting-started-prereqs.html)。


如果您选择退出 Control Tower 的 CloudTrail 管理，您将负责部署跟踪、集中日志记录以及实施保护跟踪的安全措施。无论如何，Control Tower 都会[创建一个组织跟踪](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/creating-trail-organization.html)，但当您选择退出时其状态将设置为关闭。我们建议让 Control Tower 为您管理 CloudTrail。


如果您有一个**具有账户级别跟踪的现有组织**，并且在 Control Tower 中启用 CloudTrail 管理，它将创建一个新的组织管理跟踪，配置为记录到日志存档账户中的存储桶。它不会触碰您现有的跟踪，因此如果它们正在记录，您可以预期在整个组织中看到 CloudTrail 成本显著增加，因为每个账户中每个区域的第一份管理事件副本是免费的。停止账户级别跟踪的记录将防止额外成本。

如果您有一个**具有组织跟踪的现有组织**，并且选择 Control Tower 管理，您需要[禁用受信任访问](https://docs.aws.amazon.com/organizations/latest/userguide/services-that-can-integrate-cloudtrail.html#integrate-disable-ta-cloudtrail)。当您这样做时，您账户中的所有组织跟踪都将变得无法使用，因此您应该[停止记录](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-turning-off-logging.html)现有跟踪，以避免在它再次激活时被收取记录费用。然后禁用受信任访问并启用 Control Tower。这将导致在一段短暂的时间内您的组织没有 CloudTrail 数据，因此需要在维护期间进行计划。


## Config

无法选择退出 Control Tower 的 Config 管理。

如果您在现有组织中启用 Control Tower，需要确保[禁用 Config 的受信任访问](https://docs.aws.amazon.com/organizations/latest/userguide/services-that-can-integrate-config.html#integrate-disable-ta-config)以通过 Control Tower [预启动检查](https://docs.aws.amazon.com/controltower/latest/userguide/getting-started-prereqs.html)。Control Tower 将在启用过程中启用受信任访问。

如果您计划将现有账户用于日志存档和审计账户，您需要先[从这些账户中删除所有 Config 资源](https://docs.aws.amazon.com/controltower/latest/userguide/existing-config-resources.html)。




## 备份

Control Tower 的 [AWS Backup 集成](https://docs.aws.amazon.com/controltower/latest/userguide/backup.html)可以帮助您设置基本的备份解决方案，在每个成员账户中有一个保管库，在共享账户中有一个中央保管库，以及一些基本的备份策略。这可以在 OU 级别启用，单个资源可以通过标记来定位到相关的备份计划。

如果您已经有备份解决方案，可以选择退出 Backup 集成。

Control Tower 集成不会部署逻辑上隔离的保管库，也不会开箱即用地提供跨区域备份配置。


## 将治理扩展到现有 OU 和账户

在现有组织中启用 Control Tower 不会自动将治理扩展到组织中的现有 OU 和账户。您需要使用 Control Tower [注册现有账户](https://docs.aws.amazon.com/controltower/latest/userguide/enroll-account.html)以将它们纳入 Control Tower 治理。

注册账户有一些[先决条件](https://docs.aws.amazon.com/controltower/latest/userguide/enrollment-prerequisites.html)：

* 您的着陆区不能处于偏移状态
* 账户必须是组织的成员
* [AWSControlTowerExecution](https://docs.aws.amazon.com/controltower/latest/userguide/awscontroltowerexecution.html) 角色必须存在并具有 AdministratorAccess 权限
* 组织必须[启用 StackSets 受信任访问](https://docs.aws.amazon.com/organizations/latest/userguide/services-that-can-integrate-cloudformation.html)，以便 AWSControlTowerExecution 角色可以[将 Control Tower 资源部署](https://docs.aws.amazon.com/controltower/latest/userguide/enroll-account.html#what-happens-during-account-enrollment)到您正在注册的账户中。
* 现有的 AWS Config 资源应该被[删除](https://docs.aws.amazon.com/controltower/latest/userguide/enroll-account.html#example-config-cli-commands)。如果无法做到这一点，有一个[流程](https://docs.aws.amazon.com/controltower/latest/userguide/existing-config-resources.html)可以与客户支持合作来启用现有 Config 资源的使用。请注意，这不适用于现有的日志存档和审计账户，它们必须删除其 Config 资源。

将现有 AWS 账户纳入 AWS Control Tower 最有效的方式是[注册整个 OU](https://docs.aws.amazon.com/controltower/latest/userguide/importing-existing.html)。当您注册一个 OU 时，其成员账户将被注册到 AWS Control Tower 着陆区中。AWSControlTowerExecution 角色会自动添加到账户中。OU 最多可包含 1000 个账户。



## 现有控制措施

如果您将现有账户注册到具有预防性控制（SCP、RCP）的 OU 中，请确保这些控制[不会阻止配置或注册操作](https://docs.aws.amazon.com/controltower/latest/userguide/quick-account-provisioning.html#common-causes-for-enrollment-failure)。或者，如果您需要这些控制就位，请将账户注册到专用的注册 OU 中，然后将它们移动到最终目的地。

AWS Organizations 有一些[服务限制](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_reference_limits.html)，在将治理扩展到具有现有预防性控制的账户和 OU 时，您必须注意不要超过：

* RCP 和 SCP 的最大策略大小：5120 个字符
* 最大 OU 嵌套 5 层
* 直接附加到 OU 或账户的 RCP 最多 5 个，SCP 最多 5 个


对于检测性控制，如果您在账户中定义了现有的 Config 规则，即使您删除 Config 记录器以注册账户，这些规则也会保留。当您将账户注册到 Control Tower 并创建新的记录器后，规则应恢复评估。

在 Control Tower 之外定义的 Config 规则的合规状态不会从 Control Tower dashboard 中可见。

如果您使用自定义 Config 规则并希望从整个 AWS 组织获得全面的合规视图，请考虑实施 [Cloud Intelligence Dashboards](https://catalog.workshops.aws/awscid/en-US) 框架中的 [Config Resource Compliance Dashboard](https://catalog.workshops.aws/awscid/en-US/dashboards/additional/config-resource-compliance-dashboard)。
