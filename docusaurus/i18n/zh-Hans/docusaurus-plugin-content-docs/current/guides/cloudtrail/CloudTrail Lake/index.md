---
sidebar_position: 3
---
# CloudTrail Lake
CloudTrail Lake 聚合、不可变地存储和查询摄取的事件，为您的组织提供托管数据湖。您的组织可以使用这些事件进行审计、安全调查和运营调查。CloudTrail Lake 通过在 CloudTrail 中集成收集、存储、准备和优化分析与查询，简化了分析工作流。以下将概述 CloudTrail Lake 的一些最佳实践。

### 选择合适的定价选项
创建事件数据存储时，您需要选择适合您预期每月摄取的事件类型和数量的定价选项。对于大多数情况，一年可延长保留定价选项是最具成本效益的方法。但是，如果您每月将摄取超过 25 TB 的数据，那么七年保留定价选项可能是更好的选择。

![CloudTrail Lake 定价选项](/img/cloudops/guides/cloudtrail-lake/price-option-eds.png "CloudTrail Lake 定价选项")

### Lake 查询联合
我们建议启用 Lake 查询联合，这将允许您配置事件数据存储以从 Athena 进行零 ETL 分析。这将消除构建数据处理管道以将活动日志与应用程序日志或存储在 S3 中的成本和使用数据关联的运营复杂性。这还允许您在 Athena 中针对其他数据集运行跨连接查询。启用此功能还将消除复制或移动 CloudTrail 数据的需要，因为它使用 LakeFormation 提供到您事件数据存储的联合链接。使用此功能，您还可以使用 LakeFormation 创建数据过滤器，并将事件数据存储中的数据子集共享到组织中的其他账户。有关更多信息，请查看博客：[在不复制数据的情况下跨账户安全共享 AWS CloudTrail Lake 日志](https://aws.amazon.com/blogs/mt/securely-share-aws-cloudtrail-lake-logs-across-accounts-without-replicating-data/)

### 配置基于资源的策略
您可以配置基于资源的策略来授予其他 IAM 主体权限。这将允许您将 EDS 共享给其他成员账户以查询 CloudTrail 数据。这可以帮助避免将事件复制到其他账户的需要，因为您可以授予特定 IAM 主体查询事件数据存储的访问权限。

### 为事件数据存储配置标签
为事件数据存储添加标签可以让您跟踪 CloudTrail Lake 事件数据的查询和摄取成本（如果将这些标签添加为用户定义的成本分配标签）。事件数据存储标签的另一个用例是添加基于资源的 IAM 策略，定义谁可以管理或查询事件数据存储。

### 为事件数据存储摄取数据事件
数据事件提供对资源上或资源中执行的资源操作的可见性。CloudTrail 数据事件支持各种资源类型，有关支持的资源类型的完整列表，请查看文档 [CloudTrail 数据事件](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/logging-data-events-with-cloudtrail.html#logging-data-events)。这些事件也称为数据平面操作。数据事件通常是高容量活动，特别是如果您在 S3 上存储敏感数据或通过 Lambda 函数执行关键业务操作。对敏感数据的任何意外访问的可见性让您能够采取纠正措施保护数据。因为某些合规报告（例如 FedRAMP 和 PCI-DSS）要求开启数据事件，AWS 建议您使用 AWS Config 托管规则或适当的合规包示例模板来检查至少有一个跟踪正在记录所有 S3 存储桶的 S3 数据事件。

### 导入历史 CloudTrail Trail 事件
从 CloudTrail Trails 迁移到 CloudTrail Lake 时，使用复制 Trail 事件功能将现有 trail 事件复制到您的 CloudTrail Lake 事件数据存储（在事件数据存储创建之前记录的事件）。这将允许您从与 CloudTrail trail 对应的 Amazon Simple Storage Service (Amazon S3) 存储桶导入事件到 CloudTrail Lake EDS。但是，使用此功能时建议指定导入日期范围，以便仅导入长期存储和分析所需的日志子集。这将有助于防止与导入指定日期范围之外的日志相关的额外成本。

![CloudTrail Lake 复制 trail 事件](/img/cloudops/guides/cloudtrail-lake/copy-trail-eds.png "CloudTrail Lake 复制 trail 事件")

### CloudTrail 事件摄取到事件数据存储的增强过滤选项
增强的事件过滤功能使您能够更好地控制哪些 CloudTrail 事件被摄取到您的事件数据存储中。这些增强的过滤选项提供了对 AWS 活动数据的更严格控制，提高了安全、合规和运营调查的效率和精确度。此外，新的过滤选项通过仅摄取最相关的事件数据到 CloudTrail Lake 事件数据存储来帮助您降低分析工作流成本。

您可以使用高级事件收集来过滤管理事件，并根据 eventSource、eventType、eventName、userIdentity.arn 和 sessionCredentialFromConsole 等属性来包含或排除事件。

当您使用数据事件时，我们建议使用高级事件选择器，它们提供更大的控制来决定哪些 CloudTrail 事件被摄取到您的事件数据存储中。使用高级事件选择器，您可以包含或排除 EventSource、EventName、userIdentity.arn 和 ResourceARN 等字段上的值。高级事件选择器还支持使用部分字符串的模式匹配来包含或排除值。

使用 CloudTrail 的增强过滤器将有助于提高安全、合规和运营调查的效率和精确度，同时帮助降低成本。例如，您可以根据 userIdentity.arn 属性过滤 CloudTrail 事件，以排除由特定 IAM 角色或用户生成的事件。您可以排除用于监控目的并频繁进行 API 调用的专用 IAM 角色。这使您能够显著减少摄取到 CloudTrail Lake 中的 CloudTrail 事件量，降低成本同时保持对相关用户和系统活动的可见性。

![CloudTrail Lake 数据事件](/img/cloudops/guides/cloudtrail-lake/cloudtrail-data-events-advanced-selector.png "数据事件的高级事件选择器")

### SQL 查询
运行 SQL 查询时，我们建议通过添加开始和结束 eventTime 时间戳来约束查询。这将有助于最小化查询数据扫描时的成本。您可以通过在 where 子句中添加 eventtime 字段，并使用您想要使用的时间范围来完成此操作。eventTime > 之后指定的日期字符串是将被包含的最早事件时间戳，而 eventTime < 之后指定的日期字符串是将被包含的最晚事件时间戳。以下查询是显示 eventtime 字段用法的示例。

```sql
SELECT eventTime, useridentity.arn, awsRegion FROM $EDS_ID WHERE eventTime > '2024-07-20 00:00:00' AND eventTime < '2024-07-23 00:00:00' AND awsRegion in ('us-east-1') AND eventName = 'ConsoleLogin'
```

### 自然语言提示
使用自然语言查询处理器帮助您开始分析存储在 CloudTrail Lake 中的活动日志（管理和数据事件），无需编写 SQL 查询或花时间了解查询活动事件所需的 SQL 语法。NLQ 还可以通过询问您想要查询的内容然后提供要使用的 SQL 查询来帮助您更快地获得数据洞察。

### CloudTrail 查询结果完整性验证
CloudTrail Lake 查询结果完整性验证让您知道查询结果在导出时是否被修改、删除或更改。通过验证查询结果，您可以确认 CloudTrail 传送的导出结果文件没有被更改。要验证结果，您可以使用 **verify-query-results** AWS CLI 命令将每个查询结果文件的哈希值与签名文件中的哈希值进行比较。

### 设置 CloudWatch 告警以监控 CloudTrail Lake 使用情况
您可以在 CloudTrail Lake 支持的 CloudWatch metrics 上创建告警和通知，以帮助跟踪一段时间内的事件数据存储使用情况。然后您可以设置告警在超过某个阈值时通知您。使用 CloudWatch，您可以监控 HourlyDataIngested、TotalDataRetained、TotalStorageBytes 和 TotalPaidStorageBytes 等 metrics，以帮助您进一步了解 CloudTrail Lake 的整体数据使用情况。例如，您可以创建一个显示 CloudTrail Lake 事件数据存储大小的 CloudWatch Dashboard。

```sql
SORT(SEARCH('{AWS/CloudTrail,"Event data store ID","Lake Metrics"} MetricName="TotalPaidStorageBytes" NOT "Lake Metrics"="IngestionMetrics"',"Sum"),SUM, DESC)
```
![CloudTrail Lake 事件数据存储大小](/img/cloudops/guides/cloudtrail-lake/cloudtrail-lake-storage-size.png "CloudTrail Lake 事件数据存储大小")

### CloudTrail Lake Dashboards
我们建议启用 CloudTrail Lake dashboards 来可视化存储在 CloudTrail Lake 事件数据存储中的事件趋势。亮点 dashboard 将提供 CloudTrail Lake 中捕获数据的整体易于查看的摘要。这将提供一个 dashboard 来快速识别和理解事件数据存储中的重要洞察，例如最常见的失败 API 调用、登录失败尝试的趋势以及资源创建的峰值。CloudTrail Lake dashboards 还提供针对特定 AWS 服务的其他托管 dashboards，提供有关该服务的进一步洞察。您还可以创建自定义 dashboard，显示您自己的小组件或来自任何托管 dashboards 的特定小组件。

