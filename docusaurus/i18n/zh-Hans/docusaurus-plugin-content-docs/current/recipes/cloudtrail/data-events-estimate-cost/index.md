# 估算 CloudTrail 数据事件成本

## 简介

[CloudTrail 数据事件](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/logging-data-events-with-cloudtrail.html)提供对 AWS 资源（如 S3 对象、DynamoDB 表、Lambda 函数等）的数据平面操作的详细记录。虽然这些事件提供了有价值的安全和合规洞察，但由于生产环境中的操作量很大，它们可能产生显著的成本。在启用数据事件之前了解潜在的成本影响对于预算规划和成本优化至关重要。

本指南将演示如何使用成本和使用报告 (CUR) 查询来估算 S3 的 CloudTrail 数据事件成本。未来将更新指南以包含估算其他数据事件资源类型成本的更多示例。

:::note
**注意**：本指南提供了使用 CUR 数据的成本近似方法，可能低估实际 CloudTrail 成本，因为 CUR 仅跟踪计费操作，而 CloudTrail 记录所有操作。
:::

## 使用 CUR 估算 S3 数据事件成本概述

[AWS 成本和使用报告 (CUR)](https://docs.aws.amazon.com/cur/latest/userguide/creating-cur.html) 包含有关 AWS 服务使用情况的详细信息，包括单个 API 操作。通过分析 CUR 数据中的 S3 API 操作，您可以近似估算启用 CloudTrail 数据事件的潜在成本。这种方法提供基线估算，因为：

- **部分关联**：CUR 中记录的每个 S3 API 操作在启用日志记录后将生成一个 CloudTrail 数据事件，但 CUR 仅跟踪计费操作
- **历史分析**：CUR 数据提供计费操作的历史使用模式以预测未来成本
- **精细可见性**：您可以按账户、存储桶、操作类型和时间段分析所跟踪操作的成本
- **成本计算**：CloudTrail 数据事件的定价为每 100,000 个事件 $0.10

:::note
**重要**：此方法提供保守估计，因为 CUR 不跟踪免费层操作、失败操作或低于计费阈值的操作，而 CloudTrail 仍会记录这些操作。
:::

以下查询分析与[S3 的 CloudTrail 数据事件](https://docs.aws.amazon.com/AmazonS3/latest/userguide/cloudtrail-logging-s3-info.html#cloudtrail-data-events)关联的 CUR 数据中的 Amazon S3 API 操作，以估算 CloudTrail 数据事件成本。

## 重要限制

**CUR 跟踪限制**：CUR `line_item_operation` 仅跟踪导致计费使用或成本的操作。这意味着：

- **未跟踪的操作**：免费层操作、失败操作、访问被拒绝事件和低于计费阈值的操作不包含在 CUR 中
- **CloudTrail 记录所有操作**：CloudTrail 数据事件捕获所有操作，无论成功、失败或计费状态如何
- **成本估算准确性**：基于 CUR 的估算可能**低于**实际 CloudTrail 成本，因为 CloudTrail 记录的操作比 CUR 跟踪的更多

**建议**：将此估算用作基线，了解实际 CloudTrail 数据事件成本可能更高，特别是在失败操作量大或免费层使用量高的环境中。

```sql
WITH base_data AS (
	SELECT DATE(line_item_usage_start_date) as usage_date,
		bill_payer_account_id as payer_account_id,
		line_item_usage_account_id as usage_account_id,
		line_item_operation,
		line_item_resource_id as bucket_name,
		COUNT(*) as operation_count,
		CONCAT('$', FORMAT('%.6f', (COUNT(*) / 100000.0) * 0.10)) as data_events_estimated_cost
	FROM <CUR TABLE>
	WHERE line_item_product_code = 'AmazonS3'
		AND line_item_operation IN (
			'AbortMultipartUpload',
			'CompleteMultipartUpload',
			'CopyObject',
			'CreateMultipartUpload',
			'DeleteObject',
			'DeleteObjectTagging',
			'DeleteObjects',
			'GetObject',
			'GetObjectAcl',
			'GetObjectAttributes',
			'GetObjectLegalHold',
			'GetObjectRetention',
			'GetObjectTagging',
			'GetObjectTorrent',
			'HeadObject',
			'HeadBucket',
			'ListObjectVersions',
			'ListObjects',
			'ListParts',
			'PutObject',
			'PutObjectAcl',
			'PutObjectLegalHold',
			'PutObjectRetention',
			'PutObjectTagging',
			'RestoreObject',
			'SelectObjectContent',
			'UploadPart',
			'UploadPartCopy'
		)
		AND line_item_usage_start_date >= DATE('2025-09-01')
		AND line_item_usage_start_date < DATE('2025-09-30')
	GROUP BY DATE(line_item_usage_start_date),
		bill_payer_account_id,
		line_item_usage_account_id,
		line_item_operation,
		line_item_resource_id
)
SELECT *
FROM base_data
UNION ALL
SELECT NULL as usage_date,
	payer_account_id,
	usage_account_id,
	'TOTAL' as line_item_operation,
	'ALL BUCKETS' as bucket_name,
	SUM(operation_count) as operation_count,
	CONCAT('$', FORMAT('%.6f', (SUM(operation_count) / 100000.0) * 0.10)) as data_events_estimated_cost
FROM base_data
GROUP BY payer_account_id,
	usage_account_id
ORDER BY CASE WHEN bucket_name = 'ALL BUCKETS' THEN 0 ELSE 1 END,
	operation_count DESC;
```

下图显示了 CUR 查询的输出。它首先给出所有存储桶的可计费 S3 API 操作的总体计数和数据事件的近似成本。然后，它给出每个存储桶的可计费 S3 API 操作计数和近似成本。此基线信息将有助于在定义特定的高级事件选择器过滤器以排除/包含数据事件的特定 S3 资源时提供参考，同时请记住实际 CloudTrail 成本可能由于 CUR 中未跟踪的操作而更高。

![CloudTrail S3 数据事件成本估算](/img/cloudops/recipes/AWS%20CloudTrail/data-events-estimate-cost/data-events-estimate-cost.png)
