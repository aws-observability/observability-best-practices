---
sidebar_position: 1
---
# 集中式补丁合规性报告

## 什么是补丁合规性？

补丁合规性是确保所有计算资源根据组织策略安装了最新安全更新和错误修复的过程。当补丁基线中定义的所有必需补丁都已成功应用时，系统被视为"补丁合规"。不合规的系统可能缺少关键安全更新，从而使您的组织面临可能被恶意行为者利用的安全漏洞。

在跨越多个 AWS 账户和区域的现代云环境中，分散的补丁管理带来了重大挑战，包括可见性差距、报告不一致、对漏洞的响应延迟、复杂的审计流程以及跨团队的重复工作。这些挑战可能导致安全暴露时间延长和整个组织资源利用效率低下。

集中式补丁合规性报告通过将所有账户和区域的数据整合到一个位置来解决这些挑战，提供安全态势的全面视图。这种方法带来诸多好处：合规状态的单一事实来源、漏洞的实时感知、跨环境的一致指标、简化的审计、趋势分析能力、提高的资源效率，以及自动化修复工作流的基础。

AWS Systems Manager 通过以下组件为这种集中化提供基础：Patch Manager 用于自动化补丁流程，[资源数据同步](https://docs.aws.amazon.com/systems-manager/latest/userguide/inventory-create-resource-data-sync.html)将合规数据聚合到中央 S3 存储桶中，以及 AWS Glue、Amazon Athena 和 Amazon QuickSight 等分析服务用于转换、查询和可视化数据。本方案中描述的解决方案利用这些组件创建了一个适用于整个 AWS 组织的综合报告系统，从而实现更高效的运营和更快速的漏洞修复。

:::tip
资源数据同步以 JSON 文件的形式提供清单和补丁合规性元数据。作为使用 Athena 和 QuickSight 的替代方案，您可以使用任何能够从 S3 存储桶提取数据的 BI 或分析工具。
:::

## 目的

本方案的目的是提供示例 CloudFormation 模板，可用于配置集中式补丁合规性报告所需的资源。本方案不涉及部署补丁扫描或安装操作。

有关如何准备对托管节点进行补丁的更多信息，请参阅[使用 AWS Systems Manager 和标签对托管节点进行补丁](/guides/centralized-operations-management/patch-nodes-using-tags/)。

## 前提条件

在开始部署之前，请确保您具备以下条件：

* AWS Organizations 设置：正确配置的 AWS Organization，包含管理账户和成员账户。
* 已配置的托管节点：Amazon Elastic Compute Cloud (EC2) 实例、AWS Internet of Things (IoT) Greengrass 核心设备、本地服务器、边缘设备和虚拟机必须是 Systems Manager 托管节点，才能执行补丁操作并报告补丁合规性。
* 已实施补丁操作：至少必须配置并执行一次补丁扫描操作。否则，将没有合规数据可供报告。有关不同类型的补丁及如何实施补丁的更多信息，请参阅[补丁管理最佳实践指南](/guides/centralized-operations-management/patch-management)和[不同类型的补丁](/guides/centralized-operations-management/patch-management#different-types-of-patching)部分。
* IAM 权限：具有适当的权限，可以在中央报告账户和成员账户中部署 CloudFormation 模板并创建所需资源。
* Amazon QuickSight：为了使用 QuickSight 可视化补丁合规性信息，您必须[注册 QuickSight](https://docs.aws.amazon.com/quicksight/latest/user/signing-up.html)。
* Amazon QuickSight 对 S3 的权限：您必须确保 QuickSight 对[阶段 1：中央账户设置](#phase-1-central-account-setup)中创建的 S3 存储桶具有权限。更多信息请参阅[部署 QuickSight CloudFormation 模板前需完成的前提条件](#prerequisites-to-complete-before-deploying-the-cloudformation-template-for-quicksight)。

## 注意事项

### 资源数据同步

目前，AWS CloudFormation 中的 `AWS::SSM::ResourceDataSync` 资源不支持 [S3Destination](https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-properties-ssm-resourcedatasync-s3destination.html) 属性中的 `DestinationDataSharing` 属性，而该属性是创建支持简化 S3 存储桶策略的清单资源数据同步所必需的。

因此，本方案在[组织资源数据同步示例 CloudFormation 模板](#sample-cloudformation-template-for-organization-resource-data-sync)部分使用自定义 CloudFormation 资源，通过 Lambda 函数创建资源数据同步。

使用自定义资源创建资源数据同步的替代方案：

1. 使用 CloudFormation 支持的标准资源数据同步。
    1. 为此，您必须创建并使用基于 AWS 账户 ID 授予权限的存储桶策略。有关更多信息和示例 S3 存储桶策略，请参阅 [Before you begin](https://docs.aws.amazon.com/systems-manager/latest/userguide/inventory-create-resource-data-sync.html#datasync-before-you-begin)。
    1. 更新[使用 Athena 进行中央报告的示例 CloudFormation 模板](#sample-cloudformation-template-for-central-reporting-using-athena)中的 S3 存储桶策略，使用列出 AWS 账户 ID 的新策略。
    1. 使用 CloudFormation StackSets 部署 `AWS::SSM::ResourceDataSync` 资源。有关示例 CloudFormation 资源代码片段，请参阅 [Create a SyncToDestination resource data sync](https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-resource-ssm-resourcedatasync.html#aws-resource-ssm-resourcedatasync--examples--Create_a_SyncToDestination_resource_data_sync)。
1. 使用替代方法创建组织资源数据同步，例如通过 AWS CLI 或其他 SDK 编写脚本。

### 成本考虑

实施集中式补丁合规性报告涉及多项 AWS 服务，每项服务都有相关成本：

1. [Amazon S3 定价](https://aws.amazon.com/s3/pricing/)：
    * 清单和补丁合规数据的标准存储费用
    * 从多个账户和区域同步数据的数据传输费用
      * 成本随托管节点数量和扫描频率线性增长
1. [AWS Glue 定价](https://aws.amazon.com/glue/pricing/)：
    * 爬网程序费用
    * 默认配置（每天运行一次爬网程序）
1. [Amazon Athena 定价](https://aws.amazon.com/athena/pricing/)：
    * 查询费用
    * 成本因查询复杂度和频率而异
    * 使用分区和过滤可以显著降低成本
1. [AWS Lambda 定价](https://aws.amazon.com/lambda/pricing/)：
    * 自定义资源 Lambda 函数的成本极低
    * 对于大多数实施，免费套餐通常可以覆盖此用量
1. [Amazon QuickSight 定价](https://aws.amazon.com/quicksight/pricing/)（可选）：
    * 作者许可证和读者许可证

## 架构概述

### 中央报告账户

在下图中，**中央报告**账户是 AWS Organization 中专门用于存储补丁和清单元数据以及查询或可视化的 AWS 账户。

:::warning
**不建议**将 [AWS Organization 管理账户](https://docs.aws.amazon.com/managedservices/latest/userguide/management-account.html)用作**中央报告账户**。[管理账户的 AWS 最佳实践](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_best-practices_mgmt-acct.html#bp_mgmt-acct_use-mgmt)建议您仅将管理账户及其用户和角色用于**必须**由该账户执行的任务。将所有 AWS 资源存储在组织中的其他 AWS 账户中，不要放在管理账户中。
:::

![中央报告账户架构](/img/cloudops/recipes/central-reporting/architecture-diagram-reporting-account.png "中央报告账户架构")

1. Glue 爬网程序每天运行一次，爬取托管资源数据同步所提供元数据的 S3 存储桶。
1. Glue 爬网程序根据 S3 存储桶中的元数据更新数据库和表。
1. Glue 爬网程序完成运行后，向 EventBridge 发送事件。
1. EventBridge 规则调用 Lambda 函数。
1. Lambda 函数删除 AWS:InstanceInformation 表的重复列。
    :::info
    `AWS:InstanceInformation` 表包含一个名为 `resourcetype` 的列，该列也是分区键，这会导致 Athena 查询失败。EventBridge 规则由 Glue 爬网程序执行触发，然后调用 Lambda 函数删除该列。
    :::
1. Athena 根据您运行的查询查询 Glue 数据库和表。
1. （可选）您可以创建 QuickSight 仪表板来可视化补丁合规性信息。**注意：** QuickSight 未包含在示例 CloudFormation 模板中。

### 成员账户/区域（包含托管节点）

![AWS Organization 资源数据同步架构](/img/cloudops/recipes/central-reporting/architecture-diagram-ssm-org-resource-data-sync.png "AWS Organization 资源数据同步架构")

1. 委托管理员账户中的 CloudFormation StackSet 在目标 AWS 账户/区域中创建堆栈实例以创建所需资源。
1. 堆栈实例创建 IAM 服务角色、Lambda 函数和自定义 CloudFormation 资源。
1. Lambda 函数为 AWS Organizations 创建 Systems Manager 资源数据同步。
1. 资源数据同步将清单和补丁合规性元数据发送到[中央报告账户](#central-reporting-account)中指定的 S3 存储桶。

### 流程时间线

下图显示了查询托管节点补丁合规性的流程时间线。

![补丁操作流程时间线](/img/cloudops/recipes/central-reporting/architecture-diagram-org-patch-reporting-combined.png "补丁操作流程时间线")

1. 在补丁扫描、安装或清单元数据收集操作之后，托管节点上的 SSM agent 将数据报告回 Systems Manager。
1. 资源数据同步根据所采取的操作识别补丁和清单元数据更新。
1. 资源数据同步将元数据传送到中央报告账户中指定的 S3 存储桶。
1. 然后您可以在操作完成后使用 Athena 查询结果。

如上图所示，您可以注册混合托管节点用于补丁或清单元数据收集，数据将流入与 EC2 实例相同的 S3 存储桶。

## 部署步骤

### 部署清单

以下是本方案中包含的部署步骤清单。

#### 中央报告账户任务

* [ ] 部署 Athena 资源的 CloudFormation 堆栈
* [ ] 记录堆栈输出中的 S3 存储桶名称
* [ ] 配置 QuickSight 对 S3 存储桶的权限
* [ ] 部署 QuickSight 可视化的 CloudFormation 堆栈
* [ ] 验证对 QuickSight 分析的访问权限

#### 成员账户任务（通过 StackSets）

* [ ] 部署组织资源数据同步 CloudFormation StackSet
* [ ] 验证资源数据同步已在成员账户中创建

### 阶段 1：中央账户设置

#### 使用 Athena 进行中央报告的示例 CloudFormation 模板

以下是 CloudFormation 模板创建的资源及其用途的详细信息。

[使用 Athena 进行中央报告的示例 CloudFormation 模板](https://github.com/aws-samples/cloud-operations-best-practices/blob/main/cloud-operations-best-practices/static/cfn-templates/patch-reporting/patch-reporting.yaml)

| 资源名称 | 用途 |
| -------- | ------ |
| **KMS 资源** | |
| ManagedInstanceDataEncryptionKey | 客户管理密钥 (CMK)，用于加密资源数据同步 S3 存储桶中的托管节点元数据。 |
| ManagedInstanceDataEncryptionKeyAlias | CMK 的别名。 |
| **S3 资源** | |
| AthenaQueryResultsBucket | 用于存储 Athena 查询结果的 S3 存储桶。 |
| ResourceSyncBucket | 用于存储资源数据同步提供的托管节点元数据的 S3 存储桶。 |
| ResourceSyncBucketPolicy | 资源数据同步 S3 存储桶的存储桶策略。 |
| **Glue 资源** | |
| GlueDatabase | 用于资源数据同步元数据的 Glue 数据库。 |
| GlueCrawler | 用于创建数据库和表的 Glue 爬网程序。 |
| GlueCrawlerRole | Glue 爬网程序使用的 IAM 角色。 |
| DeleteGlueTableColumnFunctionRole | DeleteGlueTableColumnFunction Lambda 函数的 IAM 角色。 |
| DeleteGlueTableColumnFunction | 用于删除重复 `resourcetype` 分区键的 Lambda 函数。 |
| DeleteGlueTableColumnFunctionEventRule | 用于调用 DeleteGlueTableColumnFunction Lambda 函数的 Amazon EventBridge 规则。 |
| DeleteGlueTableColumnFunctionCloudWatchPermission | 授予 EventBridge 调用 DeleteGlueTableColumnFunction Lambda 函数的权限。 |
| **Athena 资源** | |
| AthenaWorkGroup | 用于已命名查询的 Athena 工作组。 |
| AthenaQueryCompliantPatch | 列出补丁合规的托管节点的示例查询。 |
| AthenaQueryNonCompliantPatch | 列出补丁不合规的托管节点的示例查询。 |
| AthenaQueryComplianceSummaryPatch | 提供托管节点补丁合规性摘要的示例查询。 |
| AthenaQueryPatchSummary | 提供托管节点补丁摘要的示例查询。 |
| AthenaQueryInstanceList | 返回未终止的托管节点列表的示例查询。 |
| AthenaQueryInstanceApplications | 返回未终止的托管节点及其已安装应用程序列表的示例查询。 |
| AthenaQuerySSMAgent | 列出托管节点上安装的 SSM Agent 版本的示例查询。 |
| **S3 清理资源** | |
| S3CleanupLambdaExecutionRole | 用于清理 S3 存储桶的 IAM 角色 |
| S3BucketCleanup | 用于清理 S3 存储桶的 Lambda 函数 |
| S3Cleanup | 用于清理 S3 存储桶的自定义资源 |

#### 在中央报告账户中部署 Athena CloudFormation 堆栈

1. 将[使用 Athena 进行中央报告的示例 CloudFormation 模板](https://github.com/aws-samples/cloud-operations-best-practices/blob/main/cloud-operations-best-practices/static/cfn-templates/patch-reporting/patch-reporting.yaml)下载到本地计算机。
1. 在中央报告账户和区域中，导航到 [AWS CloudFormation 控制台](https://console.aws.amazon.com/cloudformation/home)。
1. 在左侧导航窗格中，选择 **Stacks**，然后选择 **Create stack**。
1. 从下拉列表中，选择 **With new resources (standard)**。
1. 在 **Create stack** 页面上，选择 **Upload a template file**，选择 **Choose file**，选择 `patch-reporting.yaml` 文件，然后选择 **Next**。
1. 在 **Specify stack details** 页面上，执行以下步骤：
    1. 对于 **Stack name**，输入描述性名称，例如 `patch-reporting`。
    1. 对于 **Organization ID**，输入您的 AWS Organization 的 AWS Organization ID。例如，`o-abcde12345`。
    :::tip
    有关如何获取 AWS Organization ID 的更多信息，请参阅 [Viewing details of an organization from the management account](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_view_org.html)。
    :::
    1. 对于 **Enable Glue Crawler Schedule**，选择启用或禁用 Glue 爬网程序的计划执行。
    1. 对于 **Glue Crawler Schedule (cron)**，输入 Glue 爬网程序的 cron 计划表达式。
    1. 对于 **Enable KMS permissions for QuickSight service role**，选择启用或禁用 QuickSight IAM 服务角色的 KMS 权限。**注意**：如果不授予 KMS 权限，您将无法使用 QuickSight 可视化补丁合规数据。
    1. 选择 **Next**。
1. 在 **Configure stack options** 页面上，添加任何必需的标签，选择 **I acknowledge that AWS CloudFormation might create IAM resources with custom names**，然后选择 **Next**。
1. 在 **Review and create** 页面上，查看所有信息，然后选择 **Submit** 创建堆栈。

页面刷新后，堆栈状态应为 `CREATE_IN_PROGRESS`。当状态变为 `CREATE_COMPLETE` 时，您就可以部署 QuickSight 可视化了。

:::tip
请记录 **AthenaQueryResultsBucket** 和 **ResourceDataSyncBucketName** 的 Amazon S3 存储桶名称，这些可以在 CloudFormation 堆栈的 **Outputs** 选项卡中找到。您将在下一节部署 QuickSight 时需要这两个值。

![CloudFormation 堆栈输出，显示资源数据同步 S3 存储桶名称](/img/cloudops/recipes/central-reporting/patch-reporting-cfn-outputs.png "CloudFormation 堆栈输出，显示资源数据同步 S3 存储桶名称")
:::

#### Amazon QuickSight 可视化示例 CloudFormation 模板

以下是 CloudFormation 模板创建的资源及其用途的详细信息。

[Amazon QuickSight 可视化示例 CloudFormation 模板](https://github.com/aws-samples/cloud-operations-best-practices/blob/main/cloud-operations-best-practices/static/cfn-templates/patch-reporting/quicksight.yaml)

| 资源名称 | 用途 |
| -------- | ------ |
| SSMDataSyncSource | 指向 Athena 工作组 patch-workgroup 的 QuickSight 数据源。 |
| ApplicationDataSet | 应用程序元数据的 QuickSight 数据集 |
| ComplianceItemDataSet | 合规项元数据的 QuickSight 数据集 |
| ComplianceSummaryDataSet | 合规摘要元数据的 QuickSight 数据集 |
| InstanceDetailedInformationDataSet | 实例详细信息元数据的 QuickSight 数据集 |
| InstanceInformationDataSet | 实例信息元数据的 QuickSight 数据集 |
| TagDataSet | 标签元数据的 QuickSight 数据集 |
| JoinedDataSet | 连接 aws_instanceinformation、aws_compliancesummary、aws_tag 的 QuickSight 数据集 |
| ManagedNodeAnalysis | QuickSight 分析仪表板 |

:::tip
示例 CloudFormation 模板使用 `DIRECT_QUERY` 方法，允许近实时查询数据源。另一种选择是使用 SPICE 在 QuickSight 中缓存数据。如果使用 SPICE，示例模板还包含第 551-647 行的刷新计划示例。有关选择哪种模式的更多信息，请参阅 [Best practices for Amazon QuickSight SPICE and direct query mode](https://aws.amazon.com/blogs/business-intelligence/best-practices-for-amazon-quicksight-spice-and-direct-query-mode/)。
:::

#### 部署 QuickSight CloudFormation 模板前需完成的前提条件

为了使 QuickSight 能够访问补丁合规性和清单元数据，您必须为[在中央报告账户中部署 Athena CloudFormation 堆栈](#deploy-a-cloudformation-stack-for-athena-in-the-central-reporting-account)中创建的 S3 存储桶授予 QuickSight 访问权限：`ssm-res-sync-athena-query-results-us-east-1-$AccountId` 和 `ssm-resource-sync-us-east-1-$AccountId`。

![QuickSight 对 S3 存储桶的权限](/img/cloudops/recipes/central-reporting/quicksight-athena-resources.png "QuickSight 对 S3 存储桶的权限")

有关如何授予访问权限的更多信息，请参阅 [I can't connect to Amazon S3](https://docs.aws.amazon.com/quicksight/latest/user/troubleshoot-connect-S3.html)。

#### 在中央报告账户中部署 QuickSight CloudFormation 堆栈

1. 将 [Amazon QuickSight 可视化示例 CloudFormation 模板](https://github.com/aws-samples/cloud-operations-best-practices/blob/main/cloud-operations-best-practices/static/cfn-templates/patch-reporting/quicksight.yaml)下载到本地计算机。
1. 在中央报告账户和区域中，导航到 [AWS CloudFormation 控制台](https://console.aws.amazon.com/cloudformation/home)。
1. 在左侧导航窗格中，选择 **Stacks**，然后选择 **Create stack**。
1. 从下拉列表中，选择 **With new resources (standard)**。
1. 在 **Create stack** 页面上，选择 **Upload a template file**，选择 **Choose file**，选择 `quicksight.yaml` 文件，然后选择 **Next**。
1. 在 **Specify stack details** 页面上，执行以下步骤：
    1. 对于 **Stack name**，输入描述性名称，例如 `quicksight`。
    1. 对于 **QuickSightUser**，输入要授予 QuickSight 数据源和分析仪表板权限的 QuickSight 用户名称。
    1. 对于 **Workgroup**，保留默认值 `patch-workgroup`。
    1. 选择 **Next**。
1. 在 **Configure stack options** 页面上，添加任何必需的标签，然后选择 **Next**。
1. 在 **Review and create** 页面上，查看所有信息，然后选择 **Submit** 创建堆栈。

页面刷新后，堆栈状态应为 `CREATE_IN_PROGRESS`。当状态变为 `CREATE_COMPLETE` 时，将资源数据同步部署到成员账户/区域。

### 阶段 2：成员账户配置

#### 组织资源数据同步示例 CloudFormation 模板

以下是 CloudFormation 模板创建的资源及其用途的详细信息。

[组织资源数据同步示例 CloudFormation 模板](https://github.com/aws-samples/cloud-operations-best-practices/blob/main/cloud-operations-best-practices/static/cfn-templates/patch-reporting/organization-resource-data-sync.yaml)

| 资源名称 | 用途 |
| -------- | ------ |
| **资源数据同步资源** | |
| ResourceDataSyncLambdaRole | Lambda 创建组织资源数据同步的 IAM 服务角色 |
| ResourceDataSyncLambdaFunction | 创建组织资源数据同步的 Lambda 函数 |
| ResourceDataSyncCustomResource | 调用 Lambda 函数的 CFN 自定义资源 |

#### 部署 CloudFormation StackSet

以下演练将使用 CloudFormation 的委托管理员账户，通过[服务管理权限](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-orgs-associate-stackset-with-org.html)部署 StackSet，以部署兼容 AWS Organization 的资源数据同步。

1. 将[组织资源数据同步示例 CloudFormation 模板](https://github.com/aws-samples/cloud-operations-best-practices/blob/main/cloud-operations-best-practices/static/cfn-templates/patch-reporting/organizational-resource-data-sync.yaml)下载到本地计算机。
1. 在 CloudFormation 的委托管理员账户中，导航到 [AWS CloudFormation 控制台](https://console.aws.amazon.com/cloudformation/home)。
1. 在左侧导航窗格中，选择 **StackSets**，然后选择 **Create StackSet**。
1. 在 **Choose a template** 页面上，执行以下步骤：
    1. 对于 **Permission model**，保留默认选项 **Service-managed permissions**。
    1. 对于 **Prerequisite - Prepare template**，保留默认选项 **Template is ready**。
    1. 对于 **Specify template**，选择 **Upload a template file**，选择 **Choose file**，选择 `organization-resource-data-sync.yaml` 文件，然后选择 **Next**。
1. 在 **Specify StackSet details** 页面上，执行以下步骤：
    1. 对于 **StackSet name**，输入描述性名称，例如 `org-resource-data-sync`。
    1. 对于 **Name of the resource data sync S3 bucket**，输入您在上一节中创建的 S3 存储桶名称。
    :::tip
    在中央报告账户中，您可以在已配置的 CloudFormation 堆栈的 **Outputs** 中找到 S3 存储桶名称。
    ![CloudFormation 堆栈输出，显示资源数据同步 S3 存储桶名称](/img/cloudops/recipes/central-reporting/patch-reporting-cfn-outputs.png "CloudFormation 堆栈输出，显示资源数据同步 S3 存储桶名称")
    :::
    1. 对于 **Prefix for the resource data sync S3 bucket**，输入 S3 存储桶前缀的名称，例如 `ResourceDataSync`。
    1. 对于 **AWS Region for the resource data sync S3 bucket**，输入资源数据同步 S3 存储桶的区域。
    1. 对于 **Name of the resource data sync**，输入资源数据同步的名称。
    1. 选择 **Next**。
1. 在 **Configure StackSet options** 页面上，添加任何必需的标签，选择 **I acknowledge that AWS CloudFormation might create IAM resources**，然后选择 **Next**。
1. 在 **Set deployment options** 页面上，执行以下步骤：
    1. 对于 **Deployment targets**，选择部署到组织或特定组织单元 (OU)。
    :::tip
    建议将资源数据同步部署到所有具有 AWS Systems Manager 托管节点的账户和区域，以确保所有可用的清单和补丁元数据聚合到单个 S3 存储桶中，用于查询、报告和可视化。
    :::
    1. 对于 **Specify Regions**，选择要部署资源数据同步的区域。
    1. 保留所有其他选项的默认值，然后选择 **Next**。
1. 在 **Review** 页面上，查看所有信息，然后选择 **Submit** 创建 StackSet。

页面刷新后，您将能够看到您的 StackSet。创建完成后，状态将变为 `SUCCEEDED`。

## 阶段 3：验证和测试

### 验证资源数据同步 S3 存储桶中的元数据

在中央报告账户中，导航到 [Amazon S3 控制台](https://console.aws.amazon.com/s3/home)，选择 CloudFormation 创建的名称类似于 `ssm-resource-sync-${region}-${account-id}` 的 S3 存储桶。在 S3 存储桶中，选择您在[部署 CloudFormation StackSet](#deploy-a-cloudformation-stackset) 时提供的存储桶前缀。

在存储桶中，您可以看到资源数据同步自动同步的各种数据类型。如果您之前配置了清单元数据收集并至少执行了一次补丁扫描操作，您应该会在 S3 存储桶中看到其他文件夹（例如 `AWS:Application`、`AWS:AWSComponent`）。每个文件夹代表[清单收集的元数据](https://docs.aws.amazon.com/systems-manager/latest/userguide/inventory-schema.html)。

![资源数据同步元数据的 S3 存储桶文件夹](/img/cloudops/recipes/central-reporting/s3-bucket-objects.png "资源数据同步元数据的 S3 存储桶文件夹")

在每个数据类型前缀中，将有一个前缀对应使用此 S3 存储桶进行资源数据同步的每个账户。然后是每个报告清单的区域的前缀，再是资源类型的前缀（通常为 `ManagedInstanceInventory`）。在该前缀中，将有一个 JSON 文件对应每个报告清单数据的实例。

### 验证对 QuickSight 分析的访问权限

通过导航到 [QuickSight 控制台](https://quicksight.aws.amazon.com/sn/start/analyses)，验证您是否有权访问 CloudFormation 创建的 QuickSight 分析仪表板。

如果您没有看到名为 **Managed Node Analysis CFN** 的分析，请确保您以 CloudFormation 参数 `QuickSightUser` 中指定的同一用户身份登录 QuickSight。您可以通过选择右上角的个人资料来验证当前登录 QuickSight 的用户。

![CloudFormation 创建的 QuickSight 分析](/img/cloudops/recipes/central-reporting/quicksight-analysis.png "CloudFormation 创建的 QuickSight 分析")

## 查询补丁合规性

### 查看 Glue 爬网程序

现在资源数据同步已将 Systems Manager 数据同步到 S3 存储桶，我们可以使用 Glue 爬网程序从 JSON 文件创建表。Glue 爬网程序配置为每天 00:00 UTC 运行一次。您可以等待 Glue 爬网程序运行，也可以手动运行爬网程序并生成表以在 Athena 中查询。

1. 打开 [AWS Glue 控制台](https://console.aws.amazon.com/glue/home/v2/home)，在导航窗格中，选择 **Data Catalog** 标题下的 **Crawlers**。
1. 选择 **SSM-GlueCrawler** 并选择 **Run**。

爬网程序应运行约 2-4 分钟后停止。爬网程序返回就绪状态后，通过在导航窗格中选择 **Tables** 来验证表已添加到相应数据库中。

### 使用 Athena 查询

1. 登录部署了 KMS、S3、Glue 和 Athena 资源的[中央报告 AWS 账户](#central-reporting-account)。
1. 打开 [Amazon Athena 控制台](https://console.aws.amazon.com/athena/home)，在导航窗格中，选择 **Query editor**。
1. 在右上角，对于 **Workgroup**，选择 **patch-workgroup**。
1. 对于 **Workgroup patch-workgroup settings**，选择 **Acknowledge**。
1. 选择 **Saved queries** 选项卡查看示例查询。
1. 选择一个已保存的查询，例如 **QueryNonCompliantPatch**，然后选择 **Run**。
1. 验证是否返回了缺少更新且不合规的托管节点的查询结果。

![QueryNonCompliantPatch 的 Athena 查询结果](/img/cloudops/recipes/central-reporting/athena-query-results.png "QueryNonCompliantPatch 的 Athena 查询结果")

:::warning
要使用名为 **QuerySSMAgentVersion** 和 **QueryInstanceApplications** 的**已保存查询**，您必须启用 [Systems Manager Inventory](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-inventory.html)。您可以在加入 [Systems Manager 统一控制台](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-setting-up-organizations.html)时快速启用 Systems Manager Inventory。
:::

### 其他 Athena 示例查询

#### 按托管节点分组不合规的更新

以下示例 Athena 查询按托管节点分组不合规的更新。

<Tabs
    defaultValue="query"
    values={[
        {label: '查询', value: 'query'},
        {label: '结果', value: 'results'},
    ]}>
<TabItem value="query">

```sql
-- Query to aggregate non-compliant patch compliance items by resource (limited to 20 results)
SELECT 
    ci.resourceid,
    ci.status,
    ci.patchstate,
    LISTAGG(DISTINCT ci.id, ', ') WITHIN GROUP (ORDER BY ci.id) AS ids
FROM 
    aws_complianceitem ci
WHERE 
    ci.compliancetype = 'Patch'
    AND ci.status = 'NON_COMPLIANT'
GROUP BY 
    ci.resourceid,
    ci.status,
    ci.patchstate
ORDER BY 
    ci.resourceid
LIMIT 20;
```

</TabItem>

<TabItem value="results">

![按托管节点分组更新的示例查询结果](/img/cloudops/recipes/central-reporting/group-updates-per-node.png "按托管节点分组更新的示例查询结果")

</TabItem>
</Tabs>

#### 过滤非活跃托管节点

资源数据同步将清单和补丁合规性元数据发送到 S3 存储桶。当托管 EC2 实例停止或终止时，`AWS:InstanceInformation` 元数据会更新以反映新状态。对于混合托管节点，此状态根据 SSM agent 的连接状态更新。这些值在 `InstanceStatus` 键中指示，可以具有以下值：

* `Active` - EC2 或混合托管节点上的 SSM agent 正在活跃运行并与 AWS Systems Manager 通信。
* `Stopped` - EC2 实例处于 `Stopped` 状态。
* `Terminated` - EC2 实例已被终止（删除）。
* `ConnectionLost` - 混合托管节点上的 SSM agent 无法与 AWS Systems Manager 通信。

:::tip
资源数据同步不会从指定的 S3 存储桶中删除 JSON 文件。要自动清理已终止 EC2 实例或已注销混合托管节点的托管节点元数据 JSON 文件，您可以使用 [S3 生命周期策略](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html)自动删除对象。例如，您可以实施一个 S3 存储桶策略，使 60 天未更新的过期对象过期。[组织资源数据同步示例 CloudFormation 模板](#sample-cloudformation-template-for-organization-resource-data-sync)部分中的示例 CloudFormation 模板包含从第 154 行开始的注释掉的 `LifecycleConfiguration`。
:::

您可以在 Athena 查询中使用 `InstanceStatus` 过滤掉已停止或已终止的实例或处于连接丢失状态的混合托管节点。例如，以下查询仅返回 `Active` 托管节点的 `AWS:InstanceInformation` 元数据。

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs
    defaultValue="query"
    values={[
        {label: '查询', value: 'query'},
        {label: '结果', value: 'results'},
    ]}>
<TabItem value="query">

```sql
-- Query to return only Active managed nodes
SELECT 
    ii.accountid,
    ii.region,
    ii.resourceid,
    ii.computername,
    ii.ipaddress,
    ii.instancestatus,
    ii.platformtype,
    ii.platformname,
    ii.platformversion,
    ii.agenttype,
    ii.agentversion,
    ii.capturetime
FROM 
    aws_instanceinformation ii
WHERE 
    ii.instancestatus = 'Active'
LIMIT 20;
```

</TabItem>

<TabItem value="results">

![仅返回活跃托管节点的示例查询结果](/img/cloudops/recipes/central-reporting/active-instance-query-results.png "仅返回活跃托管节点的示例查询结果")

</TabItem>
</Tabs>

## 使用 QuickSight 可视化补丁合规性

在[在中央报告账户中部署 QuickSight CloudFormation 堆栈](#deploy-a-cloudformation-stack-for-quicksight-in-the-central-reporting-account)中部署的 CloudFormation 堆栈创建了 QuickSight 数据集和空的分析仪表板，以便您可以开始可视化补丁合规性和清单元数据。

要创建 QuickSight 可视化，请按照以下两个主题中的步骤操作：

1. [第 1 部分：基于托管节点元数据创建 QuickSight 可视化](https://catalog.workshops.aws/getting-started-with-com/en-US/advanced-workshops/organization-patch-reporting/create-quicksight-visuals-and-dashboard)
1. [第 2 部分：为补丁合规性信息创建 AWS QuickSight 可视化](https://catalog.workshops.aws/getting-started-with-com/en-US/advanced-workshops/organization-patch-reporting/create-quicksight-visuals-for-patch-compliance)

按照以上两个主题操作后，您可以创建包含两个工作表的 QuickSight 仪表板，如下所示：

<Tabs
    defaultValue="instanceinfo"
    values={[
        {label: '实例信息', value: 'instanceinfo'},
        {label: '补丁合规性', value: 'patchcompliance'},
    ]}>
<TabItem value="instanceinfo">

![实例信息的示例 QuickSight 仪表板](/img/cloudops/recipes/central-reporting/example-instance-information-dashboard.png "实例信息的示例 QuickSight 仪表板")

</TabItem>

<TabItem value="patchcompliance">

![补丁合规性的示例 QuickSight 仪表板](/img/cloudops/recipes/central-reporting/example-patch-compliance-dashboard.png "补丁合规性的示例 QuickSight 仪表板")

</TabItem>
</Tabs>

## 清理已部署的资源

:::warning
本方案中的示例 CloudFormation 模板会在删除中央报告账户的 CloudFormation 堆栈时删除 S3 存储桶的内容。
:::

要清理[阶段 2：成员账户配置](#phase-2-member-account-configuration)中创建的示例资源，您必须首先[删除 StackSet 中的堆栈实例](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stackinstances-delete.html)，然后[删除 StackSet](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-delete.html)。

要清理[阶段 1：中央账户设置](#phase-1-central-account-setup)中创建的示例资源，请执行以下步骤：

1. 删除在[在中央报告账户中部署 QuickSight CloudFormation 堆栈](#deploy-a-cloudformation-stack-for-athena-in-the-central-reporting-account)部分部署的堆栈 `quicksight` 中的资源。
1. 删除在[在中央报告账户中部署 Athena CloudFormation 堆栈](#deploy-a-cloudformation-stack-for-athena-in-the-central-reporting-account)部分部署的堆栈 `patch-reporting` 中的资源。

有关如何删除 CloudFormation 堆栈的信息，请参阅 [Delete a stack from the CloudFormation console](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-console-delete-stack.html)。

## 后续步骤

以下是一系列相关 AWS 博客文章，可作为改进补丁操作和报告机制的参考。

* [Automate Systems Manager patching reports via email and Slack notifications in an AWS Organization](https://aws.amazon.com/blogs/mt/automate-systems-manager-patching-reports-via-email-and-slack-notifications-in-an-aws-organization/)
  * *在这篇博客文章中，我们将探讨如何自动创建和交付补丁报告，简化跟踪补丁操作的流程。通过利用 AWS Lambda、Amazon EventBridge、AWS Step Functions 和 Amazon DynamoDB 等 AWS 服务，您可以整合来自多个账户的 Systems Manager Patch Manager 执行详情，生成全面的报告，并通过电子邮件和 Slack 通知进行分发，为您的团队提供维护安全且合规基础设施所需的洞察。*
* [Troubleshooting AWS Systems Manager patching made easy with Amazon Bedrock's automated recommendations](https://aws.amazon.com/blogs/mt/troubleshooting-aws-systems-manager-patching-made-easy-with-amazon-bedrocks-automated-recommendations/)
  * *在这篇文章中，我们将探讨 Amazon Bedrock 如何简化 Systems Manager 补丁故障的排查过程。Bedrock 的自动分析和建议功能可以帮助您快速识别补丁问题的根本原因并实施正确的解决方案，节省宝贵的时间和精力。*
* [Visualize AWS Systems Manager Patch Manager information using Amazon QuickSight](https://aws.amazon.com/blogs/mt/visualize-aws-systems-manager-patch-manager-information-using-amazon-quicksight/)
  * *在这篇博客文章中，了解如何构建 Amazon QuickSight 仪表板来可视化关键补丁和清单信息，以加快平均修复时间 (MTTR)。此外，您还可以使用过滤器搜索特定的 AWS 账户、特定的 AWS 区域、Amazon Elastic Compute Cloud (Amazon EC2) 名称，或检查已安装/缺失的软件包。*
* [Automate vulnerability management and remediation in AWS using Amazon Inspector and AWS Systems Manager – Part 1](https://aws.amazon.com/blogs/mt/automate-vulnerability-management-and-remediation-in-aws-using-amazon-inspector-and-aws-systems-manager-part-1/)
  * *在本系列的第 1 部分中，您将了解如何修复影响多个 EC2 实例的特定漏洞的 Inspector 发现。在第 2 部分中，您将了解如何直接调用 Systems Manager Automation 运行手册，使用资源标签和 Amazon Inspector 发现严重性修复 EC2 实例的所有 Amazon Inspector 发现。*

## 技术术语表

| 术语 | 定义 |
|---|---|
| AWS Glue Crawler | 一种自动发现和编目数据源元数据的服务，在 AWS Glue Data Catalog 中创建表。 |
| AWS Organizations | 一种用于集中管理和治理多个 AWS 账户（作为单一组织）的服务。 |
| Custom Resource | 一种 CloudFormation 资源类型，使您能够在模板中编写自定义配置逻辑。 |
| Delegated Administrator | 已被授予代表 AWS 组织管理某些 AWS 服务权限的 AWS 账户。 |
| Managed Node | 配置为由 AWS Systems Manager 管理的任何服务器（EC2 实例或本地/其他云中的虚拟机）。需要安装并正确配置 SSM Agent。 |
| Patch Baseline | 一组规则，定义应在托管节点上安装哪些补丁，包括不同严重级别的批准规则。 |
| Patch Compliance | 托管节点关于所需补丁的状态。当根据关联的补丁基线安装了所有必需补丁时，节点即为合规。 |
| Patch Group | 一种基于标签的分组机制，将托管节点与特定补丁基线关联。 |
| Resource Data Sync | Systems Manager 的一项功能，可自动将托管节点的清单数据聚合到中央 S3 存储桶中，实现统一报告。 |
| Service-Managed Permissions | 一种使用 AWS Organizations 将堆栈实例部署到组织中账户的 StackSet 权限模型。 |
| SSM Agent | 安装在托管节点上的 AWS 软件，使 Systems Manager 能够更新、管理和配置这些资源。 |
| StackSet | 一项 CloudFormation 功能，允许您通过单一操作跨多个账户和区域创建、更新或删除堆栈。 |
