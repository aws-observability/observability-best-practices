---
sidebar_position: 7
---

# 自动化

通过 Automation（[AWS Systems Manager](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-automation.html) 的一项功能），您可以使用低代码[可视化设计器](https://docs.aws.amazon.com/systems-manager/latest/userguide/automation-visual-designer.html)编写[自定义 Runbook](https://docs.aws.amazon.com/systems-manager/latest/userguide/automation-documents.html)，或从 AWS 提供的 370 多个预定义 Runbook 中选择，[跨多个账户和 AWS 区域](https://docs.aws.amazon.com/systems-manager/latest/userguide/running-automations-multiple-accounts-regions.html)运行。您可以将 Python 或 PowerShell 脚本作为 Runbook 的一部分运行，并结合其他 [Systems Manager Automation 操作](https://docs.aws.amazon.com/systems-manager/latest/userguide/automation-actions.html)，如审批、AWS API 调用或在节点上运行命令。

Automation 可以通过减少错误和提高弹性来帮助企业提升性能。Automation 可以通过多种方式增强安全性和运维，以下是一些示例：

* **配置管理**：Automation 工具可以在服务器、工作站和网络设备上强制执行标准化配置，减少可能导致安全漏洞的错误配置的可能性。
* **补丁管理**：Automation 可用于跨系统部署安全补丁和更新，缩短对已知漏洞的暴露窗口。
* **事件响应 Playbook**：Automation 可以执行预定义的事件响应 Playbook，引导安全团队完成控制、调查和修复安全事件所需的步骤。应用程序所有者可以创建 Automation Runbook 来响应系统中断事件。例如，网络连接丢失、物理主机上的软件问题、系统电源丢失。使用 [Amazon CloudWatch 告警](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html)来停止、终止、重启或恢复 EC2 实例。
* **合规管理**：Automation 可以通过自动化审计流程、生成合规报告以及一致地强制执行安全控制来协助维护行业法规和内部策略的合规性。

通过利用 Systems Manager Automation，您可以简化这一关键流程，确保应用服务器保持最新并符合组织的安全策略。这不仅节省时间并减少手动错误的可能性，还提供了一种一致且可重复的方法来处理这一经常性任务。

![Automation](/img/cloudops/guides/centralized-operations-management/automation/BP-Automation-1.png "Automation")

## 使用服务角色管理权限

作为安全最佳实践，您可以创建一个 IAM 角色（可由 SSM 服务代入）来启动自动化。当您使用服务角色时，自动化被允许针对 AWS 资源运行，但运行自动化的用户对这些资源的访问受到限制（或没有访问权限）。

提升安全性和控制力 - 委托管理确保对 AWS 资源的安全性和控制力得到提升。如果要修改权限，请在服务角色而不是多个 IAM 账户中进行更改。

增强审计体验 - 允许增强的审计体验，因为操作是由中央服务角色而不是多个 IAM 账户对资源执行的。

以下情况要求您为 Automation 指定服务角色：1/ 当您想使用委托管理时。2/ 当您创建运行 Runbook 的 Systems Manager State Manager 关联时。3/ 当您的操作预计运行超过 12 小时时。4/ 当您运行的非 Amazon 拥有的 Runbook 使用 aws:executeScript 操作调用 AWS API 操作或对 AWS 资源执行操作时。

![管理权限](/img/cloudops/guides/centralized-operations-management/automation/BP-Automation-2.png "管理权限")

创建服务角色后，我们建议编辑信任策略，以确保只有该账户中的 Systems Manager Automation 被允许代入该角色。对于角色策略，仅附加运行 Runbook 中定义的自动化操作所需的权限。启动自动化的 IAM 实体被允许启动所需的 Automation Runbook。该实体被允许将自动化服务角色传递给 Systems Manager。此实体不被授予直接与 AWS 资源交互的权限。这些权限委托给服务角色。

* 服务角色信任策略
  * 可由 Systems Manager 代入
* 服务角色策略 - 最小访问权限策略
  * 仅授予运行自动化操作所需的权限
* IAM 用户/组/角色策略
  * 允许将服务角色传递给 Automation
  * 允许启动/停止/描述 Automation 执行
  * 无需 Automation 之外管理资源的权限

## 创建 Automation Runbook

有多种方法可以创建您自己的 Automation Runbook。要以编程方式创建文档，您可以使用 CreateDocument API，或使用 SSM Documents CDK 库。您也可以使用 CloudFormation 创建文档。

AWS Systems Manager Automation 提供了低代码可视化设计体验，帮助您创建 Automation Runbook。可视化设计体验提供拖放界面，并可选择添加您自己的代码，使您可以更轻松地创建和编辑 Runbook。

在创建 Runbook 时，可视化设计体验会验证您的工作并自动生成代码。您可以查看生成的代码，或将其导出以进行本地开发。完成后，您可以保存 Runbook、运行它并在 Systems Manager Automation 控制台中检查结果。

在可视化设计体验中，Automation 与 Amazon CodeGuru Security 集成，帮助您检测 Python 脚本中的安全策略违规和漏洞。

可用选项：

* 利用 AWS API 或使用 CloudFormation 创建文档
* [Automation Runbook 的可视化设计体验](https://docs.aws.amazon.com/systems-manager/latest/userguide/automation-visual-designer.html)
* [Visual Studio Code Toolkit](https://docs.aws.amazon.com/toolkit-for-vscode/latest/userguide/systems-manager-automation-docs.html)
* [CDK for Systems Manager Documents](https://github.com/cdklabs/cdk-ssm-documents)

Systems Manager 允许跨 AWS 账户共享 Runbook。这实现了有效的协作并促进了最佳实践的采用。例如，中央账户可以将安全最佳实践定义为 Automation Runbook 并与组织中的其他账户共享。这确保了整个 AWS 环境中安全措施的一致实施。

默认情况下，SSM 不支持使用 AWS Organizations OU 共享 Runbook。有一个解决方案可以解决此限制。

![Automation Runbook](/img/cloudops/guides/centralized-operations-management/automation/BP-Automation-3.png "Automation Runbook")

该解决方案使用多个 AWS 资源，包括 EventBridge Rule、Lambda 函数、Step Function State Machine 和 SNS 主题。部署后，每次通过 CreateAccount 或 InviteAccountToOrganization API 调用将新账户添加到 AWS Organizations 时，该解决方案都会触发工作流。工作流将为指定 AWS Organizations 子账户中新添加的账户 ID 以及所有指定区域添加 SSM 文档共享权限。了解更多关于[自动化 AWS Organizations SSM 文档共享权限](https://github.com/aws-samples/aws-management-and-governance-samples/tree/master/AWSSystemsManager/AWS-Org-SSM-Permissions)的信息。

## 运行 Automation

* **简单 Automation** - 当前区域和账户
* **手动 Automation** - 交互式逐步执行。每个步骤手动执行。适用于故障排除目的。
* **多账户多区域 Automation** - 从中央账户跨多个 AWS 区域和 AWS 账户或 AWS Organizations OU 运行自动化。
* **大规模运行** - 使用标签、资源组或参数值定位
* **速率控制** - 并发和错误阈值。控制爆炸半径。并发值确定允许同时运行自动化的资源数量。
* **自适应并发** - 最多 500 个并发自动化。在 Automation 首选项中启用。
* **CloudWatch 告警集成** - 附加 CloudWatch 告警以监控自动化。如果告警激活，自动化将停止。
* **安全性** - IAM 访问控制。
  * 使用 IAM 策略，管理员可以控制组织中哪些个人用户或组可以使用 Automation 以及他们可以访问哪些 Runbook。
  * Automation 允许使用 IAM 服务角色进行访问委托。当您使用服务角色时，自动化被允许针对 AWS 资源运行，但运行自动化的用户对这些资源的访问受到限制（或没有访问权限）。

## 在多个账户和区域中运行 Automation

![运行 Automation](/img/cloudops/guides/centralized-operations-management/automation/BP-Automation-4.png "运行 Automation")

跨多个区域和账户或 OU 运行自动化的工作方式如下：

1. 验证您要在所有区域和账户或 OU 中运行自动化的所有资源是否使用相同的标签。如果不是，您可以将它们添加到 AWS 资源组并定位该组。有关更多信息，请参阅 *AWS Resource Groups and Tags User Guide* 中的[什么是资源组？](https://docs.aws.amazon.com/ARG/latest/userguide/)。
1. 登录要配置为 Automation 中央账户的账户。
1. 使用本主题中的[为多区域和多账户自动化设置管理账户权限](https://docs.aws.amazon.com/systems-manager/latest/userguide/running-automations-multiple-accounts-regions.html)过程创建以下 IAM 角色：
1. **AWS-SystemsManager-AutomationAdministrationRole** - 此角色赋予用户在多个账户和 OU 中运行自动化的权限。
1. **AWS-SystemsManager-AutomationExecutionRole** - 此角色赋予用户在目标账户中运行自动化的权限。
1. 选择 Runbook、区域以及要运行自动化的账户或 OU。

**多账户/区域 Automation 的注意事项：**

* 定位资源组时，资源组必须存在于每个目标账户和区域中
  * 资源组名称在每个目标账户和区域中必须完全相同
* Automation 不会递归遍历 OU
  * Automation 只能定位包含账户的 OU
* 建议客户使用 CloudFormation 或 IaC 创建多账户/区域所需的 IAM 角色
