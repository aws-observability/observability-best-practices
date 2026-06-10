---
sidebar_position: 3
---

# 从 CloudTrail Lake 迁移到 Amazon CloudWatch

## 概述

本指南提供了从 AWS CloudTrail Lake 迁移到 Amazon CloudWatch 作为 CloudTrail 事件分析主要目标的分步方法。它详细介绍了结构化的三阶段迁移过程——导出历史数据、通过遥测启用规则启用新的 CloudTrail 数据摄取，以及设置跨账户/跨区域集中化——从而帮助您将 CloudTrail 活动与其他运维和安全遥测数据统一到 CloudWatch Unified Data Store 中。本指南还涵盖了成本估算、从 CloudTrail Lake SQL 到 CloudWatch Logs Insights 的查询转换、集中化定价优化、日志组的安全最佳实践，以及构建近实时安全可视化 dashboard。

### 为什么要迁移？

当前使用 CloudTrail Lake 的组织面临一个常见挑战：CloudTrail 数据与其他运维和安全遥测数据隔离，导致事故调查缓慢且需要在多个工具和查询语言之间来回切换。[Amazon CloudWatch Unified Data Store](https://aws.amazon.com/blogs/aws/amazon-cloudwatch-introduces-unified-data-management-and-analytics-for-operations-security-and-compliance/) 通过提供集中式存储库来解决这个问题，将 CloudTrail 活动与 VPC Flow Logs、AWS WAF logs、应用程序日志和第三方安全数据整合在一起——通过 [CloudWatch Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html) 和兼容 Apache Iceberg 的工具（如 [Amazon Athena](https://docs.aws.amazon.com/athena/latest/ug/what-is.html) 和 [Amazon Redshift](https://docs.aws.amazon.com/redshift/latest/mgmt/welcome.html)）实现关联分析。

### 迁移的主要优势

1. **统一遥测**：在单一查询界面中通过 CloudWatch unified data store 关联跨 AWS 服务（CloudTrail、VPC Flow Logs、WAF、Route 53、EKS、NLB 等）、第三方来源（CrowdStrike、SentinelOne、Okta、Palo Alto Networks 等）和自定义应用程序日志的数据。
2. **自动 schema 发现**：CloudWatch 自动发现并索引 CloudTrail 字段，提供默认 facets（如 `@data_source_name`）用于动态日志组发现。更多信息请参阅[数据源发现和管理](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/data-source-discovery-management.html)。
3. **不依赖日志组名称**：使用 `SOURCE logGroups() | filterIndex @data_source_name in ["aws_cloudtrail"]` 查询所有 CloudTrail 数据，无需依赖日志组命名。
4. **原生增强**：使用 [CloudWatch Logs Transformation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch-Logs-Transformation.html) 在数据摄取时添加安全上下文、合规标签和环境标签，无需自定义 Lambda 函数。
5. **跨账户/跨区域集中化**：将所有账户和区域的 CloudTrail 数据整合到单一目标中，用于安全、合规和事故响应。更多信息请参阅[跨账户跨区域日志集中化](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatchLogs_Centralization.html)。
6. **一个平台，更多价值**：CloudWatch unified data store 超越了独立查询服务，将 AWS 日志、第三方安全来源和自定义应用程序数据统一在单一平台中，内置标准化和跨源关联功能。

### 三阶段迁移方法

迁移遵循结构化的三阶段方法：

![CloudTrail Lake 三阶段迁移方法](/img/cloudops/guides/cloudtrail-lake/cloudtrail_lake_to_cloudwatch/three-phase-migration-approach.png "CloudTrail Lake 三阶段迁移方法")

### 估算迁移成本

从 CloudTrail Lake 迁移到 CloudWatch 后，新的 CloudTrail 事件将持续直接摄取到 CloudWatch Logs 中。了解此迁移的成本影响对于预算规划和成本优化非常重要。

要估算您预计的每月 CloudWatch Logs 成本，请在 **AWS Cost Explorer** 中查看您当前的 CloudTrail Lake 使用情况，筛选 CloudTrail 服务并按使用类型分组。参阅[使用 AWS Cost Explorer 查看 CloudTrail 成本和使用情况](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-costs.html)来确定您的事件数据存储的 CloudTrail Lake 使用类型（如摄取字节数）。Cost Explorer 以 GB 为单位显示摄取值，您可以使用最新的 [CloudWatch 定价](https://aws.amazon.com/cloudwatch/pricing/)来估算 CloudTrail 交付和 CloudWatch Logs 摄取的成本。

:::info
注意：此估算仅涵盖摄取和交付成本，不包括与 CloudWatch Logs 相关的任何额外成本，如存储和查询。
:::

---

## 阶段 1 — 从 CloudTrail Lake 导出历史数据到 CloudWatch

将您的历史 CloudTrail Lake 数据导出到 CloudWatch 可确保审计跟踪的连续性，并实现跨历史和新事件的统一查询。此阶段专注于将数据从现有的事件数据存储（EDS）移动到 CloudWatch Logs。

### 将 CloudTrail Lake 数据导出到 CloudWatch 执行导出

1. 导航到 [CloudTrail 控制台](https://console.aws.amazon.com/cloudtrailv2/#/lake)。
1. 在左侧导航菜单中，选择 **Lake**。
1. 选择 **Event Data Stores**。
1. 选择用于 CloudTrail 事件的 **Event Data Store**。
1. 从 **Actions** 下拉菜单中，选择 **Export to CloudWatch**。

    ![CloudTrail Lake Event Data Store Actions 菜单显示 Export to CloudWatch 选项。](/img/cloudops/guides/cloudtrail-lake/cloudtrail_lake_to_cloudwatch/cloudtrail_lake_to_cloudwatch_01.png "CloudTrail Lake Event Data Store Actions 菜单显示 Export to CloudWatch 选项。")

1. 选择要导出事件数据存储数据的**时间范围**。
1. 使用提供的说明配置 **IAM 角色**，创建新的 IAM 角色或提供现有 IAM 角色供 CloudTrail 用于访问您的数据进行导出。
1. 选择 **Export**。

    ![Export to CloudWatch 配置界面显示时间范围选择和 IAM 角色配置。](/img/cloudops/guides/cloudtrail-lake/cloudtrail_lake_to_cloudwatch/cloudtrail_lake_to_cloudwatch_02.png "Export to CloudWatch 配置界面显示时间范围选择和 IAM 角色配置。")

:::info
导出的数据使用 Infrequent Access 存储类，需要使用 CloudWatch Logs Insights 来查询日志信息。使用 Infrequent Access 存储创建的日志组不会在控制台的 Log Streams 中直接显示导出结果。此外，2023 年之前的数据无法从 CloudTrail Lake 迁移到 Amazon CloudWatch。如果您需要访问 2023 年之前的事件，可以继续在 CloudTrail Lake 中直接查询，或将数据导出到 S3 存储桶。更多信息请参阅[从 CloudTrail Lake Event Data Store 导出数据到 CloudWatch](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-lake-export-cloudwatch.html) 的文档，以及关于将 AWS CloudTrail Lake 事件子集导出到 Amazon S3 的 [AWS 博客](https://aws.amazon.com/blogs/mt/exporting-a-subset-of-aws-cloudtrail-lake-events-to-amazon-s3/)。
:::

---

## 阶段 2 — 通过遥测启用规则启用新的 CloudTrail 数据摄取

历史 CloudTrail Lake 数据现已在 CloudWatch 中可访问，下一步是开始将新的 CloudTrail 事件直接摄取到 [CloudWatch Unified Data Store](https://aws.amazon.com/blogs/aws/amazon-cloudwatch-introduces-unified-data-management-and-analytics-for-operations-security-and-compliance/)。此步骤独立于任何现有的 CloudTrail Trails 或 CloudTrail Lake 事件数据存储。它为 CloudTrail 活动建立了一条新的专用路径流入 CloudWatch。使用 CloudWatch 的[遥测配置](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/telemetry-config-rules.html)功能，您可以设置自动摄取 CloudTrail 事件。启用后，每个新的 CloudTrail 事件将与您的其他运维和安全遥测数据一起交付，可用于统一查询、告警和分析。

### 为 CloudTrail 创建遥测启用规则

1. 打开 [CloudWatch 控制台](https://console.aws.amazon.com/cloudwatch/)。
1. 在左侧导航窗格中，点击 **Ingestion**。
1. 点击 **Enable Resource Discovery** 按钮。
1. CloudWatch 将自动创建必要的服务关联角色。
1. 在 **Data Sources** 选项卡中，在可用服务列表中找到 **AWS CloudTrail**。
1. 选择 **AWS CloudTrail** 旁边的 **Configure telemetry**。
1. 在 **Specify Scope** 页面，保留默认的 **Rule name** 并选择 **Next**。（**注意：** 对于组织级规则，您可以在选择设置中配置源账户范围）。

    ![CloudWatch Telemetry config Enablement rules 选项卡显示 CloudTrail 的 Add rule 向导。](/img/cloudops/guides/cloudtrail-lake/cloudtrail_lake_to_cloudwatch/cloudtrail_lake_to_cloudwatch_03.png "CloudWatch Telemetry config Enablement rules 选项卡显示 CloudTrail 的 Add rule 向导。")

1. 在 **Specify Destination** 页面，执行以下步骤：
    -   对于 **Send to**，保留默认值 CloudWatch Logs。
    -   对于 **Log group name pattern**，保留默认值 `aws/cloudtrail/[event-type]`。
    -   对于 **Retention period**，根据您的合规要求选择保留期。（**注意：** CloudWatch 到 CloudTrail 的集成将日志直接交付到成员账户。您在此配置的保留期适用于每个成员账户中的日志组。保留期可以与源日志组和集中化日志组不同。有关更多信息，请参阅[优化 CloudWatch Logs 集中化的日志存储成本](/guides/cloudtrail/CloudTrail%20Lake/cloudtrail_lake_to_cloudwatch#optimizing-log-storage-costs-for-cloudwatch-logs-centralization)部分）
1. 选择 **Next**。

    ![CloudWatch Telemetry config Enablement rules 选项卡显示 CloudTrail 的 Specify destination 部分。](/img/cloudops/guides/cloudtrail-lake/cloudtrail_lake_to_cloudwatch/cloudtrail_lake_to_cloudwatch_04.png "CloudWatch Telemetry config Enablement rules 选项卡显示 CloudTrail 的 Specify destination 部分。")

1. 在 **Select Data Options** 页面，对于 **Event type**，选择要摄取的事件——**Management events** 或 **Data events**。

    ![CloudWatch Telemetry config Enablement rules 选项卡显示 CloudTrail 的 Select data options。](/img/cloudops/guides/cloudtrail-lake/cloudtrail_lake_to_cloudwatch/cloudtrail_lake_to_cloudwatch_05.png "CloudWatch Telemetry config Enablement rules 选项卡显示 CloudTrail 的 Select data options。")

1. 选择 **Next**。
1. 在 **Review and Create** 页面，查看配置设置并选择 **Configure CloudTrail enablement**。

随后将创建遥测配置规则以开始摄取 CloudTrail 事件。日志组将按以下命名模式创建。

| 事件类型 | 日志组名称模式 | 描述 |
|----------|---------------|------|
| Management Events | `aws/cloudtrail/managementevents` | 所有管理事件 |
| Data Events | `aws/cloudtrail/dataevents` | 所有数据事件 |

### 验证 CloudTrail 数据摄取

启用 CloudTrail 直接摄取到 CloudWatch 后，建议将 CloudTrail Lake 事件数据存储和 CloudWatch 的 CloudTrail 摄取并行运行。通过运行至少一天来验证您的 CloudWatch 摄取，确认所有 CloudTrail 事件都按预期被捕获。如果验证需要更多时间，请评估并行运行两个服务的潜在成本，并在继续之前联系您的 AWS 客户团队获取指导。验证成功后，您可以停止 CloudTrail Lake 事件数据存储的摄取。

:::info
更多信息请参阅[使用遥测启用规则](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/telemetry-config-rules.html)和[简化在 CloudWatch 中启用 CloudTrail 事件](https://aws.amazon.com/about-aws/whats-new/2025/12/key-enhancements-cloudtrail-events-cloudwatch/)。
:::

---

## 阶段 3 — 设置跨账户/跨区域集中化

您已将历史 CloudTrail Lake 数据迁移到 CloudWatch，通过遥测启用规则启用了 CloudTrail 摄取，现在是时候将所有内容整合到集中账户中进行统一监控、分析和合规管理了。

让 CloudTrail 数据在每个单独账户中流入 CloudWatch Unified Data Store 是第一步，但将所有 CloudTrail 活动集中到单一目标账户可以为您的安全团队、合规团队和事故响应人员提供整个 AWS 组织中所有 API 活动的统一视图——一个用于安全监控和事故响应的单一窗口。

[CloudWatch Logs 跨账户跨区域集中化](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatchLogs_Centralization.html)与 [AWS Organizations](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_introduction.html) 集成，使用集中化规则从多个成员账户收集日志数据到一个中心位置。您可以定义规则，自动将多个账户和 AWS 区域的日志数据复制到集中账户中。

每个成员账户保留自己的日志副本用于本地访问和故障排除，而您的中央安全和合规团队获得自己的整合副本用于组织范围的可见性和分析。

### 理解集中化架构

![CloudWatch 集中化架构](/img/cloudops/guides/cloudtrail-lake/cloudtrail_lake_to_cloudwatch/LogsCentralization.png "CloudWatch 集中化架构")

### 集中化前提条件

- 已设置 **[AWS Organizations](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_introduction.html)**，且所有源/目标账户属于该组织
- 已在 AWS Organizations 中为 CloudWatch 启用**[可信访问](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_integrate_services.html)**

### 创建集中化规则

1. 在组织的**管理**或**委托管理员**账户中导航到 [**CloudWatch 控制台**](https://console.aws.amazon.com/cloudwatch/home)。
2. 选择 **Settings**。
3. 导航到 **Organization** 选项卡。
4. 选择 **Configure rule**。
5. 在 **Specify Source Details** 页面，指定源详细信息，然后选择 **Next**：
    - **Centralization rule name**：输入集中化规则的唯一名称（例如 `cloudtrail-centralization`）。
    - **Source accounts**：定义源选择条件以选取要集中化遥测数据的账户。您可以按 Account ID、Organization Unit (OU) ID 或整个 Organization 进行选择。您可以使用 **Builder**（点击式）或 **Editor**（自由文本）模式提供选择条件。
        - 支持的 Keys：`OrganizationId` | `OrganizationUnitId` | `AccountId` | `*`
        - 支持的 Operators：`=` | `IN` | `OR`
    - **Source Regions**：选择要从中集中化日志的区域。

    ![为日志集中化指定源详细信息](/img/cloudops/guides/cloudtrail-lake/cloudtrail_lake_to_cloudwatch/cloudtrail_lake_to_cloudwatch_06.png "为日志集中化指定源详细信息")

6. 在 **Specify Destination** 页面，指定目标详细信息，然后选择 **Next**：
    - **Destination account**：选择组织中作为遥测数据集中目标的账户。
    - **Destination Region**：选择存储集中化遥测数据副本的主要区域。
    - **Backup Region**（可选）：在目标账户中选择备份区域以维护日志的同步副本，确保在主要区域发生中断时数据可用。

    ![为日志集中化指定目标详细信息](/img/cloudops/guides/cloudtrail-lake/cloudtrail_lake_to_cloudwatch/cloudtrail_lake_to_cloudwatch_07.png "为日志集中化指定目标详细信息")

7. 在 **Specify Telemetry Data** 页面，通过设置以下字段指定遥测数据，然后选择 **Next**：
    - **Log groups**：选择 **Filter log groups** 仅集中化 CloudTrail 日志组。您可以使用 **Builder**（点击式）或 **Editor**（自由文本）模式提供选择条件。
        - **Data source selection criteria**：使用此选项按 CloudWatch Logs 自动分配给日志的数据源名称和类型进行筛选。对于 CloudTrail，设置：`DataSourceName = "aws_cloudtrail"`。您还可以按 `DataSourceType` 筛选以定位特定事件类型，如管理事件或数据事件。
     
    - **KMS Encrypted Log Groups**：选择以下选项之一来处理 KMS 加密的日志组：
        - **使用目标特定的客户管理 KMS 密钥集中化使用客户管理 KMS 密钥加密的源日志组**：使用提供的目标 KMS 密钥 ARN 将源账户中的加密日志组集中化到目标。如果选择此选项，您必须提供目标加密密钥 ARN 和备份目标加密密钥 ARN（仅在上一步中选择了备份区域时需要）。指定的 KMS 密钥必须具有 CloudWatch Logs 加密权限。
        - **使用 AWS 拥有的 KMS 密钥在目标账户中集中化使用客户管理 KMS 密钥加密的日志组**：将源账户中使用 KMS 加密的日志组集中化到使用 AWS 拥有的 KMS 密钥加密的目标日志组。
        - **不集中化使用客户管理 KMS 密钥加密的日志组**：跳过对使用客户管理 KMS 密钥加密的源日志组的日志事件集中化。

    ![为日志集中化指定遥测数据](/img/cloudops/guides/cloudtrail-lake/cloudtrail_lake_to_cloudwatch/cloudtrail_lake_to_cloudwatch_08.png "为日志集中化指定遥测数据")

    :::info
    还可以使用 **Log group selection criteria** 按日志组名称进行额外筛选。更多信息请参阅[跨账户跨区域日志集中化](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatchLogs_Centralization.html)。
    :::

8. 在 **Review and Configure** 页面，查看集中化规则，可选择进行最后的修改，然后选择 **Create Centralization policy**。

集中化规则创建并激活后，日志事件将开始整合到中央账户。具有相同名称的日志组将被合并以简化日志管理，而日志流会附加其来源的源账户 ID 和源区域标识符。此外，日志事件会使用新的系统字段（@aws.account 和 @aws.region）进行增强，从而清晰追溯日志数据的来源。

:::info
CloudWatch 日志集中化功能仅处理在创建集中化规则后到达源账户的新日志数据。历史日志数据（规则创建之前存在的日志）不会被集中化。
:::

### 验证集中化规则

**检查规则健康状况：**

1. 导航到 **CloudWatch** → **Settings** → **Organization** 选项卡 → **Manage rules**
2. 验证规则状态为 **HEALTHY**

**监控集中化 metrics：**

- **IncomingCopiedBytes**：复制到目标账户的未压缩日志数据量（应为非零且一致）
- **IncomingCopiedLogEvents**：复制到目标账户的日志事件数量
- **OutgoingCopiedBytes**：从源账户发送到目标账户的未压缩日志数据量
- **OutgoingCopiedLogEvents**：从源账户发送到目标账户的日志事件数量
- **CentralizationError**：复制过程中遇到的错误数量；应为零——对任何错误设置告警
- **CentralizationThrottled**：集中化处理被限流的次数；监控可能影响复制的限流情况

### 优化 CloudWatch Logs 集中化的日志存储成本

CloudWatch Logs 集中化提供了经济高效的定价结构，用于管理跨多个账户和区域的日志。第一份集中化日志副本不收取额外的摄取费用或跨区域数据传输成本，客户只需支付标准 CloudWatch 存储成本和功能定价。对于超出第一次集中化的任何后续副本，将按每 GB 收取额外费用（使用备份区域功能也会创建额外副本）。有关当前定价详情，请参阅 [CloudWatch 定价页面](https://aws.amazon.com/cloudwatch/pricing/)。为帮助您在使用 CloudWatch Logs 集中化时优化成本，我们建议实施以下最佳实践：

1. **实施分层保留策略**

    您可以通过实施双层保留策略显著降低存储成本。

    - 为源账户配置短期保留期（**7-30 天**）以处理即时运维需求。
    - 为集中化账户设置较长的保留期（**90 天以上**）以满足合规要求并支持历史分析。

2. **使用选择性集中化**

    创建日志的额外副本时，请对集中化方法进行策略性规划：

    - 利用**日志组筛选器**仅集中化特定应用程序或服务。
    - 识别并仅集中化符合业务需求的日志。
    - 避免集中化不服务于特定用例的不必要日志数据。

3. **备份策略**

    规划备份策略时请考虑以下因素：

    - 请注意备份副本被视为额外副本，将产生额外的每 GB 费用。有关当前费率，请参阅 [CloudWatch 定价页面](https://aws.amazon.com/cloudwatch/pricing/)。
    - 仅在有特定需求在中央账户中进行专用备份时才启用备份集中化。
    - 考虑利用源账户作为备份副本以消除额外费用。

通过实施这些优化策略，您可以在控制成本的同时保持有效的日志管理。


### 停止 CloudTrail Lake 摄取

在启用 CloudTrail 事件摄取到 CloudWatch 并确认事件至少正确流动 24 小时后，是时候禁用 CloudTrail Lake 事件数据存储的摄取了。这可以防止跨两个服务的重复摄取费用。即使停止新的摄取，您在 CloudTrail Lake 中的历史数据仍然可以完全访问和查询。

1. 导航到 **CloudTrail 控制台** → **Lake** → **Event data stores**
2. 选择 **Event Data Store**
3. 选择 **Stop ingestion**（这将保留现有数据用于查询）
4. 确认操作

:::info
停止摄取不会删除现有数据。您仍然可以查询 CloudTrail Lake 中的历史数据，直到保留期到期或您删除 EDS。
:::
---

### 使用 CloudWatch Unified Data Store 的安全可视化 Dashboard

通过在 CloudWatch 中集中化 CloudTrail 数据，您可以部署一个预构建的 CloudWatch Dashboard，它利用 CloudWatch Unified Data Store 的默认 facets（如 `@data_source_name`）来动态发现和查询跨所有日志组的 CloudTrail 活动——不依赖于日志组名称。该 dashboard 提供近实时的 API 活动模式、安全事件和合规态势可见性，将 CloudTrail 和 VPC Flow Log 数据并排放置，用于事故调查期间的跨服务关联。

有关使用 AWS CloudFormation 的分步部署指南（包括 dashboard 小部件描述和查询说明），请参阅[使用 CloudWatch Unified Data Store 的安全可视化 Dashboard](https://aws-samples.github.io/solutions/AWS%20CloudTrail/security-dashboard-uds)。

---

## 查询转换指南 — CloudTrail Lake SQL 到 CloudWatch Logs Insights

迁移中最关键的方面之一是将现有的 CloudTrail Lake SQL 查询转换为 CloudWatch Logs Insights 等效查询。[CloudWatch Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html) 支持三种查询语言：**Logs Insights QL**、**OpenSearch PPL** 和 **OpenSearch SQL**——为您查询数据提供灵活性。

:::info
CloudWatch Logs Insights 支持自然语言查询生成。您可以用简单的英语描述您要查找的内容，AI 辅助功能会生成查询并提供逐行解释。这在转换复杂的 CloudTrail Lake SQL 查询时特别有用。
:::

---

## 迁移环境的安全最佳实践

保护 CloudWatch 中 CloudTrail 数据的安全需要综合的多层方法，结合 IAM 策略、加密、删除保护、基于资源的策略和持续监控。适当的安全控制确保您的日志数据仍然是审计和合规的资产而非漏洞，涵盖最小权限访问、基于数据分类的日志组设计，以及防止意外或恶意删除关键审计跟踪的保护。

有关实施这些控制的详细指南（包括日志组层次结构设计、精细权限管理和加密最佳实践），请参阅 [CloudWatch Logs 安全最佳实践](https://aws-observability.github.io/observability-best-practices/tools/logs/security/cloudwatch-logs-security-best-practices/)。
