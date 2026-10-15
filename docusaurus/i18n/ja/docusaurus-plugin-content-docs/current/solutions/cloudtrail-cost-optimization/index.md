---
title: CloudTrail コスト最適化
sidebar_label: コスト最適化
---

# CloudTrail コスト最適化

## 概要

AWS CloudTrail のコストは本番環境で大幅に増加する可能性があります — 特にデータイベント、管理イベントの追加コピー、CloudWatch Logs の取り込みが原因です。これらのコストを理解し制御するには、イベントボリュームの可視化、高度なイベントセレクターの戦略的使用、適切なログ配信先アーキテクチャの選択が必要です。

このガイドでは、AWS Cost and Usage Reports（CUR）を使用したコスト見積もり、高度なイベントセレクターによるデータイベントボリュームの制御、CloudWatch Logs 取り込み料金の最適化、ログ変換によるダウンストリームコストの削減、Athena によるログ管理の自動化、CloudTrail Lake の料金体系と移行オプションについて説明します。

## 使用するタイミング

- CloudTrail の支出が予想以上に高いか、予期せず増加している場合
- データイベントを有効化する前に、デプロイ前のコスト影響を見積もりたい場合
- CloudTrail Trails から CloudWatch Logs 直接取り込みへの移行を検討している場合
- 複数のトレイルを運用しており、コストを統合したい場合
- ログ変換を使用してダウンストリーム SIEM または OpenSearch の取り込みコストを削減したい場合
- CloudTrail Lake と S3 ベースのログストレージを比較評価している場合

## ガイダンス

### CUR を使用したデータイベントコストの見積もり

データイベントを有効化する前に、AWS Cost and Usage Report を使用してコスト影響を見積もります。CloudTrail データイベントの料金は **100,000 イベントあたり $0.10** です。

以下の CUR クエリは、S3 API オペレーションを分析してデータイベントコストを概算します：

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

:::note
CUR は課金対象オペレーションのみを追跡します。CloudTrail は失敗したリクエストや無料枠の使用を含むすべてのオペレーションをログに記録します。実際のコストはこの見積もりよりも高くなる可能性があります。
:::

![S3 バケットごとの推定データイベントコストを示す CUR クエリ出力](/img/cloudops/recipes/AWS%20CloudTrail/data-events-estimate-cost/data-events-estimate-cost.png "S3 の推定データイベントコスト")

### CloudWatch Logs 取り込みコストの見積もり

CloudTrail Trails（S3）から CloudWatch Logs 直接取り込みに移行する際は、以下のコスト計算式を使用します：

```
Total Events × 1,500 bytes / 1,000,000,000 = GB of data
GB of data × $0.25 = CloudTrail delivery cost
GB of data × $0.50 = CloudWatch Logs ingestion cost
GB of data × $0.75 = Total ingestion cost
```

前月のイベントボリュームに基づいて見積もるには、以下の CUR クエリを使用します（`<CUR_TABLE>` をテーブル名に置き換えてください）：

```sql
SELECT
  DATE_FORMAT(line_item_usage_start_date,'%Y-%m') AS month,
  line_item_usage_account_id as account_id,
  CAST(SUM(CAST(line_item_usage_amount AS DOUBLE)) AS BIGINT) AS total_cloudtrail_events,
  CONCAT('$', CAST(CAST(((SUM(CAST(line_item_usage_amount AS DOUBLE)) * 1500)/1000000000) * 0.75 AS DECIMAL(16,2)) AS VARCHAR)) AS total_cloudwatch_log_ingestion_cost,
  'Management Events' as event_type
FROM <CUR_TABLE>
WHERE DATE_FORMAT(line_item_usage_start_date,'%Y-%m') = DATE_FORMAT(date_add('month', -1, current_date),'%Y-%m')
  AND product_product_name = 'AWS CloudTrail'
  AND line_item_line_item_type IN ('DiscountedUsage', 'Usage', 'SavingsPlanCoveredUsage')
  AND line_item_usage_type LIKE '%-FreeEventsRecorded'
GROUP BY line_item_usage_account_id, DATE_FORMAT(line_item_usage_start_date,'%Y-%m')
ORDER BY month, account_id
```

![イベントタイプ別の推定 CloudWatch Logs 取り込みコストを示す CUR クエリ結果](/img/cloudops/recipes/AWS%20CloudTrail/trail-events-estimate-cost/trail-events-cw-logs-estimate-cost.png "推定 CloudWatch Logs 取り込みコスト")

### 高度なイベントセレクターによるコスト制御

高度なイベントセレクターは、必要なもののみをログに記録することでデータイベントボリュームを削減します：

- 機密バケットのすべての S3 アクティビティではなく、**書き込みオペレーションのみをログに記録**
- `userIdentity.arn` で `NotStartsWith` を使用して、予測可能でリスクの低いイベントを生成する**自動化されたサービスロールを除外**
- 組織レベルのデータイベントロギングから**開発アカウントを除外**
- **パターンベースのセレクター**（`StartsWith`、`EndsWith`）を使用して、命名規則に従うリソースを自動的にカバー

例 — S3 データイベントからバックアップおよび一時バケットを除外：

```json
[
  {
    "FieldSelectors": [
      { "Field": "eventCategory", "Equals": ["Data"] },
      { "Field": "resources.type", "Equals": ["AWS::S3::Object"] },
      {
        "Field": "resources.ARN",
        "NotStartsWith": [
          "arn:aws:s3:::backup-bucket-",
          "arn:aws:s3:::temp-processing-",
          "arn:aws:s3:::automated-logs-"
        ]
      }
    ]
  }
]
```

### 複数トレイルからのコスト削減

管理イベントの最初のコピーは AWS 無料枠に含まれています。追加のトレイルにはコストが発生します。これを削減するには：

- 追加コピーには **CloudTrail Lake を使用** — 追加トレイルコピーよりも最大 90% 安価
- 追加トレイルから **KMS と RDS Data API イベントを除外**（ほとんどのユースケースで大量かつ価値が低い）
- オブジェクトレベルの KMS キーの代わりに **S3 Bucket Keys を使用**して、KMS リクエストコストを最大 99% 削減

![CloudTrail 支出モニタリング用の AWS Budgets 設定](/img/cloudops/guides/cloudtrail/cloudtrail-budgets.png "AWS Budgets による CloudTrail コストのモニタリング")

### ログ変換によるダウンストリームコストの最適化

CloudWatch Logs Transformation は、サブスクリプションフィルター経由でダウンストリームシステム（SIEM、OpenSearch、S3）に送信されるデータボリュームを削減します：

```json
[
  { "parseJSON": { "source": "@message" } },
  {
    "deleteKeys": {
      "withKeys": ["responseElements", "requestParameters"]
    }
  }
]
```

オリジナルと変換済みの両方のログが CloudWatch Logs に保存されます。コスト削減はダウンストリームのサブスクリプションフィルター配信先に適用され、CloudWatch ストレージには適用されません。

### CloudTrail Lake の料金体系と移行

CloudTrail Lake には 2 つの料金オプションがあります：

| オプション | 最適な用途 | 主な考慮事項 |
|--------|----------|-------------------|
| 1 年延長可能なリテンション | ほとんどのワークロード（月間 25 TB 未満） | 一般的なボリュームで最もコスト効率が高い |
| 7 年リテンション | 大量環境（月間 25 TB 超） | スケールでの GB あたりの料金が低い |

CloudTrail Lake から CloudWatch に移行する組織向けには、継続性を維持する 3 フェーズアプローチがあります：

1. CloudTrail Lake から CloudWatch に**履歴データをエクスポート**
2. テレメトリー有効化ルールを通じて**新しい CloudTrail 取り込みを有効化**
3. 統一分析のために**クロスアカウント/クロスリージョンの一元化を設定**

![CloudTrail Lake から CloudWatch への 3 フェーズ移行アプローチ](/img/cloudops/guides/cloudtrail-lake/cloudtrail_lake_to_cloudwatch/three-phase-migration-approach.png "CloudTrail Lake から CloudWatch への移行フェーズ")

### Amazon Athena によるログ管理の自動化

S3 に保存された CloudTrail ログのコスト効率の高い長期分析には、パーティション化された Athena テーブルを使用します：

- **アカウント、リージョン、日付でパーティション化** — Athena は関連データのみをスキャンし、クエリコストを削減
- **パーティションプロジェクションを使用** — 手動の `ALTER TABLE` なしで新しいアカウントとパーティションを自動的に含める
- [CloudTrail Athena 自動化スクリプト](https://github.com/aws-samples/sample-automation-cloudtrail-athena)を使用して **CloudFormation 経由でデプロイ**

### コストモニタリングのベストプラクティス

- **AWS Budgets**：CloudTrail サービスにコストベースの予算を設定し、メールまたは AWS Chatbot アラートを設定
- **AWS Cost Anomaly Detection**：CloudTrail のモニターを作成して予期しない支出のスパイクを検出
- **CloudTrail Lake CloudWatch メトリクス**：`HourlyDataIngested` と `TotalPaidStorageBytes` をモニタリングして Lake の使用状況を追跡

## 関連リソース

- [CloudTrail モニタリング](../cloudtrail-monitoring/) — トレイルとイベントデータストアのセットアップと設定
- [オブザーバビリティコスト管理](../observability-cost-management/) — オブザーバビリティのより広範なコスト最適化
- [AWS CloudTrail の料金](https://aws.amazon.com/cloudtrail/pricing/) — 現在の料金の詳細
- [Amazon CloudWatch の料金](https://aws.amazon.com/cloudwatch/pricing/) — CloudWatch Logs の取り込みとストレージのコスト
