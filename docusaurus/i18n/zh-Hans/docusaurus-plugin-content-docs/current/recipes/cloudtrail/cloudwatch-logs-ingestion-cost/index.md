# 估算成本：从 CloudTrail Trails 迁移到 CloudWatch Logs 摄取

## 简介

使用 [AWS CloudTrail](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html) 的组织主要有三种存储和监控 CloudTrail logs 的方法：

1. **CloudTrail Trails**：将 logs 存储在 Amazon S3 存储桶中（可选择与 CloudWatch Logs 集成）
2. **CloudTrail Lake**：将事件存储在托管数据湖中以进行高级查询和分析
3. **直接 CloudWatch Logs 摄取**：将 CloudTrail 事件直接发送到 CloudWatch Logs，无需为 CloudTrail 创建 trail

本指南重点提供从 CloudTrail trails 迁移到直接 CloudWatch Logs 摄取时的成本估算。随着 [CloudWatch Logs 数据源](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/data-source-discovery-management.html)的引入，CloudTrail 事件可以自动摄取到 CloudWatch Logs 统一数据存储中。这为您的 CloudTrail 事件提供了增强的 log 管理、自动模式发现和简化的查询功能。要了解更多关于 CloudWatch 统一数据存储的信息，请参阅博客文章 [Amazon CloudWatch 为运维、安全和合规引入统一数据管理和分析](https://aws.amazon.com/blogs/aws/amazon-cloudwatch-introduces-unified-data-management-and-analytics-for-operations-security-and-compliance/)。

了解从 CloudTrail trails 迁移到直接 CloudWatch Logs 摄取的成本影响对于预算规划和成本优化至关重要。本指南演示如何使用 [AWS 成本和使用报告 (CUR)](https://docs.aws.amazon.com/cur/latest/userguide/what-is-cur.html) 数据来估算与此迁移相关的成本。

:::note
**注意**：本指南仅提供将 CloudTrail 事件摄取到 CloudWatch Logs 的成本估算，不包含与 CloudWatch Logs 相关的任何其他成本，如存储和查询。
:::

## CloudTrail 作为 CloudWatch 统一数据存储的数据源

CloudTrail 是 CloudWatch 统一数据存储中的数据源，为安全和运维分析提供数据。CloudWatch Logs 的统一数据存储使您能够使用 CloudWatch Log Insights 将 CloudTrail 数据与其他 AWS 和非 AWS logs 关联，提供对云基础设施和安全状况的可见性。

## 成本分析：从 Trails 迁移到 CloudWatch 统一数据存储

[AWS 成本和使用报告 (CUR)](https://docs.aws.amazon.com/cur/latest/userguide/what-is-cur.html) 包含有关 AWS 服务使用情况的详细信息，包括 [CloudTrail 事件量](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-costs.html)。通过分析 CUR 数据中记录的 CloudTrail 事件，您可以估算迁移到直接 CloudWatch Logs 摄取的潜在成本。这种方法提供基线估算，因为：

- **事件关联**：CUR 中记录的每个 CloudTrail 事件代表一个将产生 CloudWatch Logs 摄取费用的事件
- **历史分析**：CUR 数据提供历史 CloudTrail 使用模式以预测未来 CloudWatch Logs 成本
- **精细可见性**：您可以按账户、事件类型和时间段分析成本
- **成本计算**：CloudWatch Logs 摄取定价为每 GB $0.75（$0.25 CloudTrail 传送 + $0.50 CloudWatch Logs 摄取）

:::note
**重要**：此方法基于 CUR 中记录的实际 CloudTrail 事件量提供估算，帮助您了解将这些事件发送到 CloudWatch Logs 而非使用 Trails 传送到 S3 存储桶的成本影响。该估算不包括与 CloudWatch Logs 相关的存储成本。
:::

以下查询分析来自 AWS 成本和使用报告 (CUR) 数据的 CloudTrail 事件，以估算 CloudWatch Logs 摄取成本。

### 理解查询

查询基于以下内容计算成本：

1. **事件计数**：使用 CUR 数据的上月 CloudTrail 事件总数
2. **估算数据大小**：假设每个事件 1,500 字节（平均 CloudTrail 事件大小）
3. **成本组成**：
   - CloudTrail 传送到 CloudWatch Logs：每 GB $0.25
   - CloudWatch Logs 摄取：每 GB $0.50
   - 总摄取成本：每 GB $0.75

### 成本计算公式

```
总事件数 x 1,500 字节 / 1,000,000,000 = GB 数据
GB 数据 x $0.25 = CloudTrail 传送成本
GB 数据 x $0.50 = CloudWatch Logs 摄取成本
GB 数据 x $0.75 = 总摄取成本
```

### 使用上月 CloudTrail 使用数据的 CUR 查询

将 `<CUR_TABLE>` 替换为您的实际 CUR 表名：

```sql
SELECT 
  DATE_FORMAT(line_item_usage_start_date,'%Y-%m') AS month,
  line_item_usage_account_id as account_id,
  product_product_name as product_name, 
  CAST(SUM(CAST(line_item_usage_amount AS DOUBLE)) AS BIGINT) AS total_cloudtrail_events,
  CONCAT('$', CAST(CAST(ROUND(SUM(CAST(line_item_unblended_cost AS DECIMAL(16,8))), 2) AS DECIMAL(16,2)) AS VARCHAR)) AS trail_cost,
  CONCAT('$', CAST(CAST(((SUM(CAST(line_item_usage_amount AS DOUBLE)) * 1500)/1000000000) * 0.25 AS DECIMAL(16,2)) AS VARCHAR)) AS cloudtrail_delivery_cost,
  CONCAT('$', CAST(CAST(((SUM(CAST(line_item_usage_amount AS DOUBLE)) * 1500)/1000000000) * 0.50 AS DECIMAL(16,2)) AS VARCHAR)) AS cloudwatch_logs_ingestion_cost,
  CONCAT('$', CAST(CAST(((SUM(CAST(line_item_usage_amount AS DOUBLE)) * 1500)/1000000000) * 0.75 AS DECIMAL(16,2)) AS VARCHAR)) AS total_cloudwatch_log_ingestion_cost,
  'Management Events' as event_type
FROM <CUR_TABLE>
WHERE DATE_FORMAT(line_item_usage_start_date,'%Y-%m') = DATE_FORMAT(date_add('month', -1, current_date),'%Y-%m')
  AND product_product_name = 'AWS CloudTrail'
  AND line_item_line_item_type IN ('DiscountedUsage', 'Usage', 'SavingsPlanCoveredUsage')
  AND line_item_usage_type LIKE '%-FreeEventsRecorded'
GROUP BY line_item_usage_account_id, DATE_FORMAT(line_item_usage_start_date,'%Y-%m'), product_product_name

UNION ALL

SELECT 
  DATE_FORMAT(line_item_usage_start_date,'%Y-%m') AS month,
  line_item_usage_account_id as account_id,
  product_product_name as product_name, 
  CAST(SUM(CAST(line_item_usage_amount AS DOUBLE)) AS BIGINT) AS total_cloudtrail_events,
  CONCAT('$', CAST(CAST(ROUND(SUM(CAST(line_item_unblended_cost AS DECIMAL(16,8))), 2) AS DECIMAL(16,2)) AS VARCHAR)) AS trail_cost,
  CONCAT('$', CAST(CAST(((SUM(CAST(line_item_usage_amount AS DOUBLE)) * 1500)/1000000000) * 0.25 AS DECIMAL(16,2)) AS VARCHAR)) AS cloudtrail_delivery_cost,
  CONCAT('$', CAST(CAST(((SUM(CAST(line_item_usage_amount AS DOUBLE)) * 1500)/1000000000) * 0.50 AS DECIMAL(16,2)) AS VARCHAR)) AS cloudwatch_logs_ingestion_cost,
  CONCAT('$', CAST(CAST(((SUM(CAST(line_item_usage_amount AS DOUBLE)) * 1500)/1000000000) * 0.75 AS DECIMAL(16,2)) AS VARCHAR)) AS total_cloudwatch_log_ingestion_cost,
  'Data Events' as event_type
FROM <CUR_TABLE>
WHERE DATE_FORMAT(line_item_usage_start_date,'%Y-%m') = DATE_FORMAT(date_add('month', -1, current_date),'%Y-%m')
  AND product_product_name = 'AWS CloudTrail'
  AND line_item_line_item_type IN ('DiscountedUsage', 'Usage', 'SavingsPlanCoveredUsage')
  AND line_item_usage_type LIKE '%-DataEventsRecorded'
GROUP BY line_item_usage_account_id, DATE_FORMAT(line_item_usage_start_date,'%Y-%m'), product_product_name

UNION ALL

SELECT 
  DATE_FORMAT(line_item_usage_start_date,'%Y-%m') AS month,
  line_item_usage_account_id as account_id,
  product_product_name as product_name,
  CAST(SUM(CAST(line_item_usage_amount AS DOUBLE)) AS BIGINT) AS total_cloudtrail_events, 
  CONCAT('$', CAST(CAST(ROUND(SUM(CAST(line_item_unblended_cost AS DECIMAL(16,8))), 2) AS DECIMAL(16,2)) AS VARCHAR)) AS trail_cost,
  CONCAT('$', CAST(CAST(((SUM(CAST(line_item_usage_amount AS DOUBLE)) * 1500)/1000000000) * 0.25 AS DECIMAL(16,2)) AS VARCHAR)) AS cloudtrail_delivery_cost,
  CONCAT('$', CAST(CAST(((SUM(CAST(line_item_usage_amount AS DOUBLE)) * 1500)/1000000000) * 0.50 AS DECIMAL(16,2)) AS VARCHAR)) AS cloudwatch_logs_ingestion_cost,
  CONCAT('$', CAST(CAST(((SUM(CAST(line_item_usage_amount AS DOUBLE)) * 1500)/1000000000) * 0.75 AS DECIMAL(16,2)) AS VARCHAR)) AS total_cloudwatch_log_ingestion_cost,
  'Additional copies of Management Events' as event_type
FROM <CUR_TABLE>
WHERE DATE_FORMAT(line_item_usage_start_date,'%Y-%m') = DATE_FORMAT(date_add('month', -1, current_date),'%Y-%m')
  AND product_product_name = 'AWS CloudTrail'
  AND line_item_line_item_type IN ('DiscountedUsage', 'Usage', 'SavingsPlanCoveredUsage')
  AND line_item_usage_type LIKE '%-PaidEventsRecorded'
GROUP BY line_item_usage_account_id, DATE_FORMAT(line_item_usage_start_date,'%Y-%m'), product_product_name
ORDER BY month, account_id, event_type
```
:::note
**注意**：此示例查询提供了将 CloudTrail 事件摄取到 CloudWatch Logs 的每月成本估算。请注意，此估算不包括 CloudWatch Logs 的其他成本，如存储、查询或 CloudTrail 事件量未来可能的增长。此计算基于历史 CUR（成本和使用报告）数据作为成本的估算基线。
:::

下图显示了 CUR 查询的输出。结果按事件类型（Management Events、Data Events 和 Additional copies of Management Events）组织，提供上月记录的 CloudTrail 事件总数、该期间的当前 trail 成本以及估算的 CloudWatch Logs 摄取成本。此分解帮助您了解将每种使用类型从 trails 迁移到直接 CloudWatch Logs 摄取的成本影响。

![CloudTrail S3 数据事件成本估算](/img/cloudops/recipes/AWS%20CloudTrail/trail-events-estimate-cost/trail-events-cw-logs-estimate-cost.png)


## 结论

CloudWatch Logs 摄取为 CloudTrail 事件提供实时监控、更快的分析和简化的管理。CUR 查询将帮助估算从 Trails 迁移时的成本，并帮助利用 CloudWatch Logs 提供的统一数据存储功能，包括即时告警、跨服务关联以及为组织的安全和合规要求降低的基础设施复杂性。

:::note
有关当前定价详情，请参阅 [AWS CloudTrail 定价](https://aws.amazon.com/cloudtrail/pricing/) 和 [Amazon CloudWatch 定价](https://aws.amazon.com/cloudwatch/pricing/)。
:::
