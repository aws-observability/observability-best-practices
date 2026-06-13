---
sidebar_position: 3
---
# 自定义您的着陆区


Control Tower 定义了一个治理良好的着陆区的起点，但大多数客户需要为其工作负载实施额外的平台服务。这可以包括集中式网络、安全服务、集中式可观测性服务等。

## 使用基础设施即代码

额外的平台服务应使用基础设施即代码 (IaC) 进行定义和部署，这将：

* 确保所有账户和区域具有相同的配置
* 支持版本控制和变更管理，支持同行审查和回滚，并确保所有变更都被记录和可审计
* 支持快速的自动化账户配置，可在响应 Control Tower 生命周期事件时触发部署

## 选择正确的自定义选项

在开始时选择正确的自定义方法至关重要，因为它将显著影响您未来的运营模式和灵活性。选择取决于组织的基础设施即代码偏好、运营需求和所需的自定义灵活性等因素。我们建议只为您的着陆区实施一种自定义选项。

自定义 Control Tower 有四种主要选项：

* AWS Organizations StackSets
* Account Factory Customization (AFC)
* Customization for AWS Control Tower (CfCT)
* Account Factory for Terraform (AFT)
* Landing Zone Accelerator (LZA)

### CloudFormation StackSets

可以在 CloudFormation 中定义基础设施资源，并使用原生 [CloudFormation StackSets](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/what-is-cfnstacksets.html) 功能部署到特定账户。StackSet 允许您使用单个模板跨区域创建堆栈。CloudFormation 可以在新的 AWS Organizations 账户添加到目标组织或组织单元 (OU) 时[自动部署额外的堆栈](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-orgs-manage-auto-deployment.html)，但有[一些注意事项](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-orgs-manage-auto-deployment.html#stacksets-orgs-auto-deployment-considerations)。

StackSets 可用于部署依赖性最小的简单模板（Control Tower 本身就使用它来部署基线 IAM 角色等内容），但缺乏 CI/CD 以及缺乏与 Control Tower 账户配置流程的集成或感知能力，这对于更复杂的自定义来说是一个挑战。

如果您正在寻找用于部署简单 CloudFormation 自定义的托管服务，请考虑 AFC。如果您正在寻找支持 CI/CD 的 CloudFormation 解决方案，请考虑 CfCT。


### Account Factory Customization (AFC)

[AFC](https://docs.aws.amazon.com/controltower/latest/userguide/af-customization-page.html) 是 Control Tower 的原生功能，直接与 AWS Control Tower 的账户配置工作流集成。它允许您定义蓝图（使用 CloudFormation 或 Terraform，取决于您用于账户配置的工具），在配置账户时使用这些蓝图来为账户建立资源和配置基线。

蓝图可以在 Service Catalog 中更新和版本化。Control Tower 账户更新流程可用于应用更新的基线。虽然您可以在 AFC 中定义多个蓝图，但目前还不能为一个账户建立多个蓝图的基线。这使得 AFC 难以用于更复杂的自定义。

如果您需要简单的自定义、单个基线对每个账户足够，并且不想管理任何自定义流程资源，请使用 AFC。


### Customizations for AWS Control Tower (CfCT)

[CfCT](https://docs.aws.amazon.com/controltower/latest/userguide/cfct-overview.html) 是一个 AWS 解决方案，在 Control Tower 管理账户的 Control Tower 主区域中实施了一个 AWS Code Pipeline 管道。它由 S3 或 Github 中的 CloudFormation 模板仓库支持。它支持将 CloudFormation 模板、SCP 和 RCP 部署到组织中的目标账户和 OU。CfCT 不支持自动化账户创建。相反，它与 Control Tower 的生命周期事件集成，以便可以为通过 Control Tower 的 Account Factory 创建的新账户自动触发自定义。

如果您拥有内部 CloudFormation 技能，并且愿意在管理账户中维护和[更新](https://docs.aws.amazon.com/controltower/latest/userguide/update-stack.html)该解决方案，请使用 CfCT。



### Account Factory for Terraform (AFT)

[AFT](https://docs.aws.amazon.com/controltower/latest/userguide/taf-account-provisioning.html) 使用 Terraform，因此通过直接 AWS API 调用来管理从账户创建到自定义的整个过程。它是一个非常灵活的自定义解决方案，但代价是增加了管理开销。与 CfCT 不同，AFT 可以自动化从账户创建到账户自定义的整个流程。它还设计用于管理账户自定义的 Terraform 状态文件。

另请注意，Control Tower 主动控制（作为 CloudFormation Guard 规则实施）将不适用，因为资源不是使用 CloudFormation 部署的。

如果您拥有内部 Terraform 技能，并且有设置和维护 Terraform 状态和流程的经验，管理多个代码仓库，并在可能创建和自定义账户的不同团队之间进行协调，请使用 AFT。


### Landing Zone Accelerator (LZA)

[LZA](https://aws.amazon.com/solutions/implementations/landing-zone-accelerator-on-aws/) 是一个 AWS 解决方案，用于实施基于 AWS 最佳实践和安全框架的安全多账户环境。虽然 LZA 不需要 AWS Control Tower，但[建议](https://docs.aws.amazon.com/controltower/latest/userguide/about-lza.html)您使用 Control Tower 作为基础着陆区，并在其之上实施 LZA。LZA 提供常见着陆区功能的固定部署，包括安全工具和共享网络服务，通过配置文件提供有限的自定义。这使得具有严格安全和合规要求的 AWS 客户能够快速配置其云基础。

如果您处于高度监管的领域；需要快速部署安全合规的着陆区；对更固定化的基础设施部署方法感到满意；愿意维护该解决方案；并且准备好在出现任何问题时理解和管理底层 CDK 代码，请使用 LZA。


| 功能 | Account Factory Customization (AFC) | Customizations for AWS Control Tower (CfCT) | Account Factory for Terraform (AFT) | Landing Zone Accelerator (LZA) |
| ------- | ------------------------------------ | -------------------------------------------- | ------------------------------------ | ------------------------------- |
| 服务托管 | 是 | 否 | 否 | 否 |
| IaC 引擎 | CloudFormation, Terraform | CloudFormation | Terraform | CDK |
| 部署 SCP | 否 | 是 | 是 | 是 |
| 支持多配置包 | 否 | 是 | 是 | 是 |
| 学习曲线 | 低 | 中 | 高 | 低 |
| 运营开销 | 低 | 中 | 高 | 中 |
| API 支持 | 否 | 是 | 是 | 是 |
| 版本控制集成 | 否 | 是 | 是 | 是 |
| 委派管理 | 否 | 否 | 是 | 是 |
| 账户配置 | 直接 | 仅通过生命周期事件 | 直接 | 直接 |
| 控制台管理 | 是 | 有限 | 有限 | 有限 |
| 部署复杂度 | 低 | 中 | 高 | 中 |
| 自定义灵活性 | 有限 | 高 | 最高 | 高 |
| 主动控制适用 | 是 | 是 | 否 | 是 |
