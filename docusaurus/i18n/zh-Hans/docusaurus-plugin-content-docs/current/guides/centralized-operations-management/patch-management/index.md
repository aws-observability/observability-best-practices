---
sidebar_position: 5
---
# 补丁管理

[Patch Manager](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-patch.html) 是 Systems Manager 的一项功能，允许您自动化使用安全相关更新修补托管节点的过程。您可以修补 Amazon EC2 实例、边缘设备以及本地服务器和虚拟机 (VM)，包括其他云环境中的 VM。

## 为什么补丁很难？

![为什么补丁很难？](/img/cloudops/guides/centralized-operations-management/patch-management/what-makes-patching-hard.png "为什么补丁很难？")

创建补丁策略对组织来说可能具有挑战性。首先，补丁管理依赖于拥有公司环境中每个节点上安装的可修补软件（包括应用程序和操作系统）的当前完整清单。其次，企业补丁管理可能导致在人员和基础设施方面的某些资源过载。

接下来，安装补丁可能导致副作用发生。另一个常见挑战（这通常导致组织倾向于谨慎行事）是安装补丁引起的意外或非预期问题。检查节点并确定特定补丁是否实际生效可能出奇地困难。这个挑战可能出现在单个节点上，或者如果将其推断到整个组织的节点和操作系统群，这个挑战的规模可能很快变得非常庞大。

## 改善现状

![补丁优先级](/img/cloudops/guides/centralized-operations-management/patch-management/prioritize.png "补丁优先级")

为帮助解决一些常见挑战，首先通过分类对特定补丁进行优先级排序，以识别必须优先处理的小部分补丁。为此，确定哪些工作负载或应用程序对您的业务最关键，然后确定哪些补丁对这些工作负载影响最大。例如，邮件服务器、数据库、Web 应用程序、面向客户的数字资产等。

![工作原理](/img/cloudops/guides/centralized-operations-management/patch-management/how-it-works.png "工作原理")

从那里您可以为每个工作负载创建[补丁基线](https://docs.aws.amazon.com/systems-manager/latest/userguide/patch-manager-patch-baselines.html)，这有助于确定在执行补丁扫描操作时将适用的补丁标记为缺失。扫描帮助您确定相对于已建立基线的合规程度。

然后，您可以开始安排定期补丁安装操作，在例行维护期间应用更新，或在紧急补丁发布期间按需安装更新。补丁安装后，您可以使用 Patch Manager 提供的补丁合规数据确认结果。

## 操作系统中补丁期间发生了什么？

客户常见的问题是 Patch Manager 如何扫描或安装补丁？当补丁操作启动时，无论是计划的还是临时的，操作都会排队到 Systems Manager endpoint。然后 SSM agent 检索扫描或安装命令。SSM agent 检索补丁基线批准规则并使用本地操作系统包管理器（即 Windows Update、yum、apt-get）启动扫描或安装。操作完成后，SSM agent 将补丁合规数据报告回 Patch Manager。

![补丁管理 OS 补丁](/img/cloudops/guides/centralized-operations-management/patch-management/os-patching.png "补丁管理 OS 补丁")

### 与补丁源的连接

如果您的托管节点没有直接的互联网连接，并且您使用具有 VPC endpoint 的 Amazon Virtual Private Cloud (Amazon VPC)，则必须确保节点有权访问源补丁仓库 (repos)。

在 Linux 节点上，补丁更新通常从节点上配置的远程仓库下载。因此，节点必须能够连接到仓库才能执行补丁。Windows Server 托管节点必须能够连接到 Windows Update Catalog 或 Windows Server Update Services (WSUS)。有关更多信息，请参阅 [Patch Manager 先决条件](https://docs.aws.amazon.com/systems-manager/latest/userguide/patch-manager-prerequisites.html)。

## 定义补丁标准

Patch Manager 为 Patch Manager 支持的每个操作系统提供[预定义补丁基线](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-patch-baselines.html)。您可以按当前配置使用这些基线（无法自定义它们），或者创建自己的自定义补丁基线。自定义补丁基线允许您对环境中批准或拒绝的补丁进行更大的控制。

在自定义补丁基线中，您可以：

* 定义批准哪些补丁
* 使用自动批准延迟进行截止
* 定义补丁例外
* 为 Linux 定义自定义补丁仓库
* 为多个操作系统版本定义补丁标准

## 不同类型的补丁

补丁解决方案有两种一般方法：集中式或分散式。

| 集中式补丁 | 分散式补丁 |
| -------------------- | ---------------------- |
| 中央团队部署补丁扫描操作 | 将更多职责转移给应用/账户所有者 |
| 中央团队部署补丁安装操作 | 中央团队部署补丁扫描操作，合规报告仍然集中 |
| 在计划和执行操作方面灵活性有限 | 所有者负责补丁安装操作，中央团队可提供构建块（即通过 AWS Service Catalog） |
| 中央团队通常负责故障排除 | 允许所有者定义安装计划 |
| 在高度监管或安全的环境中更常见 | 中央团队应有按需补丁安装覆盖权 |

### 多账户组织的集中式补丁解决方案示例

**选项 1：** 可以使用 [Quick Setup 补丁策略配置](https://docs.aws.amazon.com/systems-manager/latest/userguide/quick-setup-patch-manager.html)建立集中式补丁解决方案。补丁策略使客户能够跨 AWS 账户和 AWS 区域扫描和安排多个补丁基线的补丁安装。有关更多信息，请参阅[跨 AWS Organization 补丁 - 补丁策略](/guides/centralized-operations-management/patch-management/#patching-across-an-aws-organization---patch-policies)。

![补丁管理集中式补丁选项 1](/img/cloudops/guides/centralized-operations-management/patch-management/patch-policy-architecture.png "补丁管理集中式补丁选项 1")

**选项 2：** 集中式解决方案的另一个选项是使用 [Amazon EventBridge](https://aws.amazon.com/eventbridge/)、[AWS Lambda](https://aws.amazon.com/lambda/) 和 [Systems Manager Automation](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-automation.html) 的组合来安排多账户和多区域补丁操作。有关更多信息，请参阅[使用 AWS Systems Manager Automation 安排集中式多账户和多区域补丁](https://aws.amazon.com/blogs/mt/scheduling-centralized-multi-account-multi-region-patching-aws-systems-manager-automation/)。

![补丁管理集中式补丁选项 2](/img/cloudops/guides/centralized-operations-management/patch-management/scheduled-mamr-patching-automation.png "补丁管理集中式补丁选项 2")

### 多账户组织的分散式自助补丁解决方案示例

不同的应用程序所有者在补丁操作、补丁时机、补丁频率以及在较低环境（DEV 或 UAT）中测试补丁的灵活性方面可能有不同的需求。使用 [AWS Service Catalog](https://aws.amazon.com/servicecatalog/)，中央团队可以创建充当自助补丁构建块的产品。应用/账户所有者然后可以将这些产品部署到其环境中，只需提供少量参数（如计划），而无需自己构建解决方案。有关更多信息，请参阅[多账户组织的自助补丁解决方案](https://aws.amazon.com/blogs/mt/a-self-service-patching-solution-for-multi-account-organisations/)。

![使用 Service Catalog 的自助补丁](/img/cloudops/guides/centralized-operations-management/patch-management/self-service-patching.png "使用 Service Catalog 的自助补丁")

## 原位补丁与重新水合

重新水合（重铺、刷新）是启动安装了最新补丁的新服务器并退役旧节点的过程。这是 Auto Scaling Group 中 EC2 实例、容器 cluster（ECS / EKS）中的托管节点组以及预配置了应用程序工作负载要求的 AMI 的常见做法。

| 原位补丁 | 重新水合 |
| -------------- | ----------- |
| 通常比重新水合执行频率更高（每周、每两周） | 通常每月或每季度执行。有些客户每 2 周执行一次！ |
| 适用于无法轻易替换的长期存在节点（可变的） | 适用于启动后不需要太多配置的工作负载（不可变的） |
| 补丁安装工作流可能需要进行备份 | 使用 EC2 Image Builder 等服务与 Auto Scaling 组集成 |
| | 可能仍需要原位补丁机制。例如，如果发布了零日漏洞补丁但节点在下一个重新水合周期之前无法替换 |

根据应用程序工作负载，您的环境中可能需要原位补丁和重新水合两种方法。

## 跨 AWS Organization 补丁 - 补丁策略

要在 AWS Organization 中标准化补丁要求，您可以使用[Quick Setup 中的补丁策略](https://docs.aws.amazon.com/systems-manager/latest/userguide/patch-manager-policies.html)。您可以跨整个组织为多个操作系统、跨多个账户和区域应用补丁策略，并审查目标托管节点的资源合规性。

跨多个账户使用 Quick Setup 有助于确保您的组织维护一致的配置。此外，Quick Setup 定期检查配置漂移并尝试修复它。当用户对服务或功能进行任何与通过 Quick Setup 所做选择相冲突的更改时，就会发生配置漂移。

![补丁策略架构](/img/cloudops/guides/centralized-operations-management/patch-management/patch-policy-detailed-architecture.png "补丁策略架构")

### 工作原理

1. 您使用 Quick Setup 创建补丁策略，选择的参数发送到 CloudFormation。
1. CloudFormation 使用定义的参数和定义的目标账户和区域创建堆栈集。这由 Quick Setup 在部署期间生成。
1. CloudFormation 在每个目标账户和区域中创建堆栈实例。
1. 堆栈实例为定义的补丁扫描创建 [State Manager 关联](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-state.html)，如果选择了补丁安装，则还创建补丁安装的关联。这些关联使用您创建补丁策略时提供的计划应用。
1. 在管理账户中，State Manager 关联每天启动一次 Automation runbook 来调用 Lambda 函数。
1. Lambda 函数将指定的补丁基线作为 JSON 文件存储在 S3 bucket 中。此外，Lambda 函数评估 Quick Setup 中指定的自定义补丁基线是否有任何更改。如果对自定义补丁基线进行了更改，Lambda 函数会更新 S3 bucket 中的 JSON 文件。
1. 托管节点然后在补丁操作期间拉取中央补丁基线 JSON 文件以扫描或安装更新。

**注意：** 目前，要通过 Quick Setup 部署补丁策略，您必须使用 AWS Organization 中的管理账户。要在管理账户之外部署补丁策略，请访问[如何在 Quick Setup 之外部署补丁策略](https://catalog.us-east-1.prod.workshops.aws/workshops/7c0ea253-6462-41cd-af76-3850c92458fa/en-US)。

## 按需补丁

有时您可能需要在例行补丁周期之外修补节点，例如在紧急漏洞场景中。

**选项 1：** [立即修补](https://docs.aws.amazon.com/systems-manager/latest/userguide/patch-manager-patch-now-on-demand.html)（*单账户/区域*）

* 使用 Patch Manager 中的**立即修补**选项，您可以快速运行按需补丁操作。然而，**立即修补**一次只允许在单个 AWS 账户和区域内进行补丁。它也不能使用补丁策略中定义的补丁基线。您可以创建不同的基线，该基线将根据与补丁策略基线不同的批准规则执行补丁扫描或安装适用补丁。

**选项 2：** Automation（*多账户/区域*）

* 要跨账户和区域执行按需补丁操作，您可以利用支持[在多个 AWS 区域和账户中运行自动化](https://docs.aws.amazon.com/systems-manager/latest/userguide/running-automations-multiple-accounts-regions.html)的 Automation。您可以利用部署到目标账户中的 IAM 角色来执行操作。您可以与补丁策略或独立的补丁要求集成。

## 集成漏洞管理和修复

[Amazon Inspector](https://aws.amazon.com/inspector) 对 Amazon EC2 实例和存储在 Amazon Elastic Container Registry (Amazon ECR) 中的容器镜像提供持续漏洞扫描。这些扫描评估软件漏洞和意外的网络暴露。Amazon Inspector 使用 Systems Manager (SSM) agent 收集 EC2 实例的软件应用程序清单。然后，Inspector 扫描这些数据并识别软件漏洞，这是漏洞管理中的关键步骤。

您应根据漏洞的严重程度对 Amazon Inspector 识别的漏洞执行定期补丁操作进行修复。您可以使用 AWS Systems Manager Patch Manager 来自动化使用 SSM agent 修补 Systems Manager 管理的节点的过程。

可能存在零日或其他高危和严重漏洞，其补丁已可用。然而，您可能不想等到常规补丁计划来修复它们。在这些情况下，应存在按需补丁机制。

要了解更多信息，请参阅：

* [AWS on Air: LockDown - The Magical World of Vulnerability Management](https://www.linkedin.com/events/awsonair-lockdown-themagicalwor7061737757479481344/comments/)
* [Automate vulnerability management and remediation in AWS using Amazon Inspector and AWS Systems Manager – Part 1](https://aws.amazon.com/blogs/mt/automate-vulnerability-management-and-remediation-in-aws-using-amazon-inspector-and-aws-systems-manager-part-1/)
* [Automate vulnerability management and remediation in AWS using Amazon Inspector and AWS Systems Manager – Part 2](https://aws.amazon.com/blogs/mt/automate-vulnerability-management-and-remediation-in-aws-using-amazon-inspector-and-aws-systems-manager-part-2/)

![自动化漏洞管理和修复](/img/cloudops/guides/centralized-operations-management/patch-management/vulnerability-remediation-architecture.png "自动化漏洞管理和修复")

## 审查补丁合规性

Patch Manager dashboard 提供当前 AWS 账户和区域内补丁合规性的快照。合规报告允许您确定节点的补丁合规性。您还可以使用 Fleet Manager 控制台查看有关安装了哪些补丁以及这些补丁的严重程度和关键性的更多详细信息。

虽然这些视图特定于本地 AWS 账户和区域，但您可以为整个 AWS Organization 创建集中式补丁合规报告。

## 在 AWS Organization 中创建端到端补丁管理和清单报告

:::tip
您知道吗，您可以使用 [Amazon Quick Suite](https://aws.amazon.com/quicksuite/) 将多步骤手动流程减少为几个简单的提示，使您能够快速生成有洞察力的补丁合规性和清单可视化。在博客中了解 AI 驱动的功能如何帮助您创建动态 dashboard，节省宝贵时间同时保持准确性并提供对组织补丁状态的实时洞察：[使用 Amazon Quick Suite 构建企业补丁和清单 dashboard](https://aws.amazon.com/blogs/mt/building-enterprise-patching-and-inventory-dashboards-using-amazon-q-in-amazon-quicksuite/)。
:::

要创建跨 AWS Organization 的补丁合规报告，您可以使用 Systems Manager [资源数据同步](https://docs.aws.amazon.com/systems-manager/latest/userguide/inventory-create-resource-data-sync.html)将从所有托管节点收集的清单数据发送到单个 Amazon S3 bucket。资源数据同步然后在收集到新清单数据时自动更新集中数据。

使用 [AWS Glue crawler](https://docs.aws.amazon.com/glue/latest/dg/add-crawler.html)，您可以自动从 S3 中的补丁合规数据创建数据库和表，然后使用 [Amazon Athena](https://aws.amazon.com/athena/) 查询补丁合规数据。此解决方案利用 [Amazon QuickSight](https://aws.amazon.com/quicksight/) 可视化清单和补丁合规数据，但是您可以使用任何可以从 S3 bucket 拉取数据的 BI 或分析工具。

**注意：** 您需要在每个要从节点收集清单数据的账户和区域中创建资源数据同步。

![端到端补丁管理报告](/img/cloudops/guides/centralized-operations-management/patch-management/architecture-diagram-ssm-org-reporting.png "端到端补丁管理报告")

1. 在每个账户/区域中创建 Systems Manager 资源数据同步。
1. 在单个 Amazon S3 Bucket 中集中聚合补丁合规数据。
1. 使用 AWS Glue Crawler 自动创建数据库和表。
1. 使用 Amazon Athena 查询补丁或清单数据。
1. 使用 Amazon QuickSight 可视化补丁合规性。

## 理解 AWS Systems Manager 清单元数据

资源数据同步根据按需操作（注册或终止实例/执行补丁扫描或安装）、计划操作（收集软件清单、收集自定义清单元数据、执行补丁安装以及使用 Chef InSpec 评估合规性）采取的操作将数据推送到 S3 bucket。

![清单元数据](/img/cloudops/guides/centralized-operations-management/patch-management/resource-data-sync-inventory-metadata.png "清单元数据")

来源：[理解 AWS Systems Manager 清单元数据](https://aws.amazon.com/blogs/mt/understanding-aws-systems-manager-inventory-metadata/)
