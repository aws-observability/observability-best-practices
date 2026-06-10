---
sidebar_position: 5
---
# AWS Control Tower

### AWS Control Tower 解决什么问题？

AWS Control Tower 帮助拥有多个 AWS 账户和团队的组织，以简单直接的方式大规模设置和治理其[多账户 AWS 环境](https://docs.aws.amazon.com/whitepapers/latest/organizing-your-aws-environment/organizing-your-aws-environment.html)，同时确保符合已建立的策略。


### 使用 AWS Control Tower 是否有额外费用？

使用 AWS Control Tower 没有额外费用或预付承诺。您只需为 AWS Control Tower 启用的 AWS 服务以及您在着陆区中使用的服务和实施的选定控件付费。例如，您需要为以下内容付费：使用 Account Factory 预置账户的 Service Catalog，以及使用 AWS Config 实现的强制性控件。


### AWS Control Tower 中的控件（护栏）是什么？

[控件](https://docs.aws.amazon.com/controltower/latest/controlreference/controls.html)（以前称为护栏）是为安全、运营和合规明确定义的规则，有助于防止部署不合规的资源并持续监控已部署资源的合规性。


### AWS Control Tower 提供哪些类型的控件？

AWS Control Tower 提供三种主要类型的控件：

1. [预防性控件](https://docs.aws.amazon.com/controltower/latest/controlreference/preventive-controls.html)：防止操作发生。通过 AWS Organizations 中的服务控制策略（SCP）实现。
2. [检测性控件](https://docs.aws.amazon.com/controltower/latest/controlreference/detective-controls.html)：在特定事件发生后或资源不合规时进行检测，并通过 dashboard 提供告警。通过 AWS Config 规则实现。
3. [主动性控件](https://docs.aws.amazon.com/controltower/latest/controlreference/proactive-controls.html)：在资源在您的账户中预置之前检查其是否符合公司策略和目标。如果资源不合规，则不会被预置。主动性控件通过 AWS CloudFormation hooks 实现。

通过在 AWS Control Tower 中组合这三种类型的控件，您可以监控多账户 AWS 环境是否安全并按照最佳实践进行管理。


### AWS Control Tower 编排哪些 AWS 服务？

AWS Control Tower 编排[多个 AWS 服务](https://docs.aws.amazon.com/controltower/latest/userguide/integrated-services.html)来设置和治理多账户 AWS 环境。AWS Control Tower 编排的主要服务包括：
1. AWS Organizations - 用于在多账户环境中设置一致的合规性和治理框架
2. AWS Service Catalog - 用于 Account Factory 功能，自动化账户部署和注册
3. AWS IAM Identity Center（前身为 AWS SSO）- 用于管理用户身份和联合访问。此外，AWS Control Tower 还集成了：
4. AWS CloudTrail - 用于创建集中式日志存档
5. AWS Config - 用于监控已部署的资源并帮助防止偏离最佳实践。



### 我可以将现有身份提供商与 AWS Control Tower 一起使用吗？

AWS Control Tower 为身份提供商集成提供三个选项：
1. IAM Identity Center 用户存储：这是默认选项，AWS Control Tower 为您设置和管理 IAM Identity Center。它在 IAM Identity Center 目录中创建组，并为成员账户中选定的用户预置这些组的访问权限。
2. Active Directory：当 AWS Control Tower 配置为使用 Active Directory 时，AWS Control Tower 不管理 IAM Identity Center 目录，也不会为新 AWS 账户分配用户或组。
3. 外部身份提供商（IdP）：使用此选项，AWS Control Tower 在 IAM Identity Center 目录中创建组并为选定用户预置这些组的访问权限。您可以在账户创建期间指定来自外部 IdP（如 Microsoft Entra ID、Google Workspace 或 Okta）的现有用户，当 AWS Control Tower 在 IAM Identity Center 和外部 IdP 之间同步用户时，会给予这些用户对新创建账户的访问权限。
请注意，您可以选择[自行管理](https://docs.aws.amazon.com/controltower/latest/userguide/select-idp.html) AWS IAM Identity Center，而不是让 AWS Control Tower 为您设置。


### 我的数据是否加密？我可以使用自己的 AWS Key Management Service 密钥吗？

AWS Control Tower 为您的着陆区提供两个主要的加密选项：1. 默认加密：默认情况下，AWS Control Tower 使用 Amazon S3 管理的密钥（SSE-S3）对着陆区中的资源进行静态数据加密。2. AWS KMS 加密：作为可选的增强安全级别，您可以配置 AWS Control Tower 使用 AWS Key Management Service (AWS KMS) 密钥来保护 AWS Control Tower 部署的服务，包括 AWS CloudTrail、AWS Config 和关联的 Amazon S3 数据。如果您在设置 AWS Control Tower 时选择启用 AWS Backup，则必须选择您自己的现有多区域 KMS 密钥或创建新的 AWS KMS 密钥。此密钥用于通过加密保护跨账户备份。


### 我可以使用 AWS Control Tower 限制对 AWS 中某些区域的访问吗？


AWS Control Tower 提供[区域拒绝](https://docs.aws.amazon.com/controltower/latest/userguide/region-how.html)功能，以限制已注册账户对特定区域中 AWS 服务的访问。这有助于满足合规要求并通过限制对特定区域的访问来管理成本。该功能与 AWS Control Tower 中现有的区域选择选项配合使用。例如，德国客户可以限制对法兰克福以外服务的访问。有两个控制级别可用：着陆区级别（原始控件）和 [OU 级别](https://docs.aws.amazon.com/controltower/latest/userguide/region-deny.html)（较新的参数化控件）以实现更精细的治理。此自定义有助于根据您的业务需求应用区域限制。



### 如何注册已有 AWS Config 资源的现有 AWS 账户


要将具有 AWS Config 资源的现有账户迁移到 AWS Control Tower，您需要按照特定的 [5 步流程](https://docs.aws.amazon.com/controltower/latest/userguide/existing-config-resources.html)：

1. 联系 AWS 客户支持以将账户添加到 AWS Control Tower 允许列表。在工单主题行中包含"将具有现有 AWS Config 资源的账户注册到 AWS Control Tower"。在正文中提供您的管理账户编号、具有现有 AWS Config 资源的成员账户编号，以及您为 AWS Control Tower 设置选择的主区域。此过程通常需要 2 个工作日。
2. 使用 AWS CloudFormation 在成员账户中创建新的 IAM 角色。
3. 识别具有预先存在的 AWS Config 资源的 AWS 区域。
4. 识别没有任何 AWS Config 资源的 AWS 区域。
5. 修改每个区域中的现有 AWS Config 资源以与 AWS Control Tower 设置对齐，然后将账户注册到 AWS Control Tower。




### 什么是偏移？如何处理 Control Tower 偏移和配置

AWS Control Tower 中的偏移发生在 AWS Control Tower 之外进行配置更改时，导致资源不符合治理要求。常见的偏移类型包括：
 1. 控制策略偏移 - 当 AWS Control Tower 拥有的策略被意外更新时。例如，在 AWS Organizations 控制台中或使用 AWS CLI 以编程方式更新控件的 SCP。
2. Security Hub 控件偏移。当作为 AWS Security Hub 服务管理标准的一部分的控件：AWS Control Tower 报告偏移状态时，会发生此类偏移。
3. 删除必需的组织单位（如安全 OU）
4. 删除或无法访问必需的 IAM 角色（AWSControlTowerAdmin、AWSControlTowerCloudTrailRole、AWSControlTowerStackSetRole）
5. 将成员账户从注册的 AWS Control Tower OU 移动到其他 OU。

AWS Control Tower 根据检测到的偏移类型提供各种[修复选项](https://docs.aws.amazon.com/controltower/latest/userguide/resolving-drift.html)。有关修复操作的完整列表，请参阅 Control Tower 用户指南。


### AWS Control Tower 的账户自定义选项有哪些？


AWS Control Tower 提供多个账户自定义选项：
1. [Account Factory Customization](https://docs.aws.amazon.com/controltower/latest/userguide/af-customization-page.html) (AFC) - 允许您直接从 AWS Control Tower 控制台自定义新的和现有的 AWS 账户。您可以定义账户需求并使用蓝图（自定义账户模板）将其作为工作流的一部分来实现。这些蓝图描述了预置账户时所需的特定资源和配置。
2. [Customizations for AWS Control Tower](https://docs.aws.amazon.com/controltower/latest/userguide/cfct-overview.html) (CfCT) - CfCT 是一组功能包，帮助您将 AWS Control Tower 着陆区自定义为超出 AWS Control Tower 控制台可用范围。它允许您使用 AWS CloudFormation 模板、服务控制策略（SCP）和资源控制策略（RCP）来实现自定义，这些可以部署到组织内的各个账户和组织单位（OU）。CfCT 与 AWS Control Tower 生命周期事件集成，确保您的资源部署与着陆区保持同步。
3. [AWS Control Tower Account Factory for Terraform](https://docs.aws.amazon.com/controltower/latest/userguide/taf-account-provisioning.html) (AFT) 是一个允许您使用 Terraform 预置和自定义 AWS 账户的解决方案。它创建一个单独的 AFT 管理账户（不同于 AWS Control Tower 管理账户）来部署 AFT 功能。AFT 通过支持任何 Terraform 发行版（社区版、Cloud 和 Enterprise）提供了灵活性。


### 我可以使用 GitHub 作为 CfCT 的配置源吗？


可以，GitHub 可以用作 Customizations for AWS Control Tower (CfCT) 的配置源。在部署 CfCT 时，您可以选择 GitHub（通过 Code Connection）作为 AWS CodePipeline 源，而不是默认的 Amazon S3 选项。


### 我可以使用 GitHub 作为 AFT 仓库吗？


可以，您可以将 AWS Control Tower Account Factory for Terraform (AFT) 从 AWS CodeCommit 迁移到另一个 VCS 提供商。要从 CodeCommit 迁移到另一个 VCS 提供商，请按照以下步骤操作：1. 在您选择的 VCS 提供商中设置新仓库 2. 将这些仓库添加为 git 中的新远程 3. 执行 git push 到新的 VCS 提供商 4. 在您的 AWS Control Tower 管理账户中，更新 Terraform 模块（bootstrap）以指向新的 VCS 提供商 5. 执行 terraform plan 预览更改，然后执行 terraform apply 6. 登录 AFT 管理账户并完成新 VCS 提供商的待处理 AWS CodeConnections。请注意，仓库结构应与 AWS CodeCommit 中保持一致，以确保 AFT 能够正确执行所需代码。

### 我可以将 OpenTofu 与 AFT 一起使用吗？

OpenTofu 是一个流行的开源基础设施即代码（IaC）工具，从 Terraform 分叉而来。OpenTofu 有一个模块 - sourcefuse/arc-control-tower-aft，经过一些调整可能支持 AFT 功能，但它不受 AWS 支持。

### 我可以使用 Gitlab 作为 CfCT 的 VCS 吗？

不可以，CfCT 尚不支持 Gitlab。从 v2.8.1 开始，您可以使用 Github 作为 VCS。

### 我已经部署了 Landing Zone Accelerator (LZA)，还可以使用 AWS Control Tower 吗？


AWS Control Tower 和 Landing Zone Accelerator (LZA) 作为互补解决方案可以很好地协同工作。建议的最佳实践是首先部署 AWS Control Tower 作为基础着陆区，然后根据需要使用 LZA 增强其功能。LZA 是使用 AWS Cloud Development Kit (CDK) 构建的解决方案，部署的基础功能旨在与 AWS 最佳实践和多个全球合规框架保持一致。它帮助您更有效地管理和治理多账户环境。LZA 解决方案自动设置适合托管安全工作负载的云环境。它可以部署到所有 AWS 区域以帮助维护运营和治理的一致性。通过将 AWS Control Tower 与 LZA 集成，您可以自定义着陆区，同时确保其保持与最佳实践和合规要求的一致性。



### 我可以使用 API 与 AWS Control Tower 设置进行交互吗？


AWS Control Tower 提供[多个 API](https://docs.aws.amazon.com/controltower/latest/APIReference/Welcome.html) 允许您自动化各种任务：1. 控件 API：- EnableControl：激活控件，在指定的组织单位及其账户上创建 AWS 资源 - DisableControl：关闭控件，删除指定组织单位及其账户上的 AWS 资源 - GetControlOperation：检索有关控件操作的信息。这些 API 允许您以编程方式管理控件（也称为护栏），查看其应用状态，并获取已启用控件的信息，包括其支持的区域、标识符（ARN）、偏移状态和状态摘要。2. 着陆区 API：帮助自动化与着陆区相关的任务 3. 基线 API：帮助自动化某些任务，如注册组织单位（OU）。您可以参考 API 参考文档。


### 如何更改 Control Tower 创建的账户的电子邮件地址？


要更改 AWS Control Tower 中已注册成员账户的电子邮件地址，您需要按照以下步骤操作：1. 恢复账户的 root 用户密码。2. 使用 root 用户密码登录账户。3. 像更改任何其他 AWS 账户一样更改电子邮件地址，并等待更改在 AWS Organizations 中反映。电子邮件地址更改完成更新可能存在延迟。4. 使用之前属于该账户的电子邮件地址更新 Service Catalog 中的已预置产品。此过程将新电子邮件地址与已预置产品关联，确保电子邮件地址更改在 AWS Control Tower 中生效。但请注意，此过程不允许您更改管理账户、日志存档账户或审计账户的电子邮件地址。



### 网络互联注意事项


AWS Control Tower 默认为组织单位（OU）中创建的每个账户的每个 VPC 分配相同的 CIDR 范围（172.31.0.0/16）。由于 IP 地址重叠，此默认配置最初不允许 AWS Control Tower VPC 之间进行对等连接。要在 AWS Control Tower 中支持 VPC 对等连接，您应该修改 Account Factory 设置中的 CIDR 范围，以确保 VPC 之间的 IP 地址不重叠。当您更改 Account Factory 设置中的 CIDR 范围时，所有后续创建的新账户将被分配新的 CIDR 范围，而现有账户将保留其原始 CIDR 范围。此方法允许具有不同 IP 地址范围的 VPC 之间进行对等连接。


### 我们已有现有的安全和日志账户，可以将现有账户用作 AWS Control Tower 的审计和日志账户吗？


可以，AWS Control Tower 提供了在初始着陆区设置过程中指定现有 AWS 账户作为审计（安全）和日志存档（日志）账户的选项。此功能消除了 AWS Control Tower 创建新共享账户的需要。在设置着陆区时，您可以选择：1. 让 AWS Control Tower 为您创建新的共享账户，或 2. 使用您自己现有的审计和日志账户。如果您选择使用现有账户，需要在设置过程中提供与这些账户关联的唯一电子邮件地址。此选项仅在初始着陆区设置期间可用。使用现有账户可以更轻松地将 AWS Control Tower 治理扩展到现有组织或从备用着陆区迁移到 AWS Control Tower。


### 我们已有现有的外部 IDP，如果我启用 Control Tower，AWS Control Tower 会对现有设置做哪些更改？


使用现有身份提供商设置 AWS Control Tower 时，根据您选择的身份源会有不同的影响：如果 IAM Identity Center 已在组织中启用且您使用的是 IAM Identity Center 目录，AWS Control Tower 将添加权限集和组等资源，而不会删除现有配置。如果您使用的是其他目录（外部、AD、托管 AD），AWS Control Tower 不会更改您的现有配置。


### AWS Control Tower 支持嵌套 OU 吗？


是的，AWS Control Tower 支持嵌套组织单位（OU）。AWS Control Tower 中的嵌套 OU 允许您将账户组织为多个层次级别并以层次方式执行控件。嵌套 OU 是包含在另一个 OU 中的 OU，创建了一个层次结构，其中附加到一个 OU 的策略向下流动并影响其下的所有 OU 和账户。AWS Control Tower 中的嵌套 OU 层次结构最多可以深达五个级别。您可以注册现有的多级别 OU、创建新的嵌套 OU，并在层次结构中的任何深度的已注册 OU 上启用控件。使用嵌套 OU，您可以将 AWS Control Tower OU 与 AWS 多账户策略对齐，并通过在父 OU 级别执行控件来减少在多个 OU 上启用控件所需的时间。


### AWS Control Tower 是否在 AWS GovCloud 中受支持？


是的，AWS Control Tower [在 GovCloud 中受支持](https://docs.aws.amazon.com/govcloud-us/latest/UserGuide/govcloud-controltower.html)。但是，由于更严格的合规和运营要求，AWS GovCloud（美国）中的 AWS Control Tower 与商业区域有所不同。在 GovCloud 中，您必须在着陆区设置期间使用现有的审计和日志存档账户，因为直接创建账户不可用。GovCloud 账户通过商业区域中的 CreateGovCloudAccount API 创建并关联用于计费/支持，但它们只能加入 GovCloud 组织。某些功能不受支持，如 Account Factory 账户创建、GDPR 合规、某些 Security Hub 控件和资源控制策略（RCP）。



### AWS Control Tower 是否使用资源控制策略（RCP）？

AWS Control Tower 现在支持通过资源控制策略（RCP）实现的预防性控件。这些基于 RCP 的控件帮助在 AWS Control Tower 环境中建立数据边界，以保护资源免受意外访问。RCP 允许您执行要求，例如确保组织的 Amazon S3 资源只能由属于该组织的 IAM 主体或 AWS 服务访问，而不管各个存储桶策略中授予的权限。基于 RCP 的预防性控件在 AWS Control Tower 可用的所有 AWS 区域中可用。如果您不希望特定主体或资源受这些控件管理，还可以为这些控件配置豁免。此外，AWS Control Tower 现在报告通过 RCP 实现的控件的控制策略偏移，并提供 ResetEnabledControl API 以帮助以编程方式管理控件偏移，允许您修复控件偏移并将控件重置为其预期配置。AWS Control Tower 还支持 Customizations for AWS Control Tower (CFCT) 的 RCP，允许您将这些策略纳入自定义工作流。


### 如何在实施前测试 OU 上的策略

策略暂存 OU 充当测试和验证 AWS 策略、控件和服务的受控环境，然后再将其部署到生产环境。它允许组织验证新策略、护栏和配置是否按预期工作，而不影响运营账户。此方法有助于防止意外后果并确保策略有效性。暂存 OU 通常包含镜像生产环境结构的测试账户，在将策略更改应用到生产 OU 或账户之前进行全面验证。此做法符合 AWS 治理最佳实践，有助于在实施新控件的同时维护运营稳定性。
