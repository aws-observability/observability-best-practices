# CloudTrail データイベントコストの見積もり

## はじめに

[CloudTrail Data Events](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/logging-data-events-with-cloudtrail.html) は、S3 オブジェクト、DynamoDB テーブル、Lambda 関数など、AWS リソースに対するデータプレーン操作の詳細なログを提供します。これらのイベントは、セキュリティとコンプライアンスに関する貴重なインサイトを提供しますが、本番環境での大量のオペレーションにより、大幅なコストが発生する可能性があります。Data Events を有効にする前に、コストへの潜在的な影響を把握することは、予算計画とコスト最適化において非常に重要です。

このガイドでは、Cost and Usage Report (CUR) クエリを使用して、S3 の CloudTrail データイベントのコストを見積もる方法を説明します。今後、追加のデータイベントリソースタイプのコスト見積もりに関する他の例を含めるようにガイドを更新する予定です。 

:::note
**注意**: このガイドでは、CUR データを使用したコスト概算方法を提供していますが、CUR は課金対象のオペレーションのみを追跡するのに対し、CloudTrail はすべてのオペレーションをログに記録するため、実際の CloudTrail コストを過小評価する可能性があります。
:::

## CUR を使用した S3 のデータイベントのコスト見積もりの概要

[AWS コストと使用状況レポート (CUR)](https://docs.aws.amazon.com/cur/latest/userguide/creating-cur.html) には、個々の API オペレーションを含む AWS サービスの使用状況に関する詳細情報が含まれています。CUR データの S3 API オペレーションを分析することで、CloudTrail データイベントを有効にした場合の潜在的なコストを概算できます。このアプローチがベースライン見積もりを提供する理由は以下のとおりです。

- **部分的な相関**: CUR に記録された各 S3 API オペレーションは、ログが有効になっている場合に 1 つの CloudTrail データイベントを生成しますが、CUR は課金対象のオペレーションのみを追跡します
- **履歴分析**: CUR データは、将来のコストを予測するための課金対象オペレーションの過去の使用パターンを提供します
- **詳細な可視性**: 追跡されたオペレーションについて、アカウント、バケット、オペレーションタイプ、および期間ごとにコストを分析できます
- **コスト計算**: CloudTrail データイベントは 100,000 イベントあたり $0.10 で価格設定されています

:::note
**重要**: この方法は保守的な見積もりを提供します。CUR は無料利用枠の操作、失敗した操作、または CloudTrail が引き続きログに記録する請求しきい値を下回る操作を追跡しないためです。
:::

以下のクエリは、CUR データから [S3 の CloudTrail データイベント](https://docs.aws.amazon.com/AmazonS3/latest/userguide/cloudtrail-logging-s3-info.html#cloudtrail-data-events)に関連する Amazon S3 API オペレーションを分析し、CloudTrail データイベントのコストを見積もります。

## 重要な制限事項

**CUR トラッキングの制限**: CUR の `line_item_operation` は、課金対象の使用量またはコストが発生する操作のみを追跡します。つまり、以下のことを意味します。

- **追跡されない操作**: 無料枠の操作、失敗した操作、アクセス拒否イベント、および請求しきい値を下回る操作は CUR に含まれません
- **CloudTrail はすべてをログに記録**: CloudTrail データイベントは、成功、失敗、または請求ステータスに関係なく、すべての操作をキャプチャします
- **コスト見積もりの精度**: CloudTrail は CUR が追跡するよりも多くの操作をログに記録するため、CUR ベースの見積もりは実際の CloudTrail コストよりも**低く**なる場合があります

**推奨事項**: この見積もりはベースラインの理解として使用してください。実際の CloudTrail データイベントのコストは、特に失敗したオペレーションの量が多い環境や無料利用枠の使用がある場合には、より高くなる可能性があります。

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

以下の画像は、CUR クエリの出力結果を示しています。まず、すべてのバケットに対する課金対象の S3 API オペレーションの総数と、データイベントの概算コストが表示されます。次に、各バケットの課金対象 S3 API オペレーション数と概算コストが表示されます。このベースライン情報は、データイベントに対して特定の S3 リソースを除外または含めるための高度なイベントセレクターフィルターを定義する際に役立ちます。なお、CUR で追跡されないオペレーションにより、実際の CloudTrail コストはより高くなる場合があることに注意してください。

![CloudTrail Estimation of Data Event Cost for S3](/img/cloudops/recipes/AWS%20CloudTrail/data-events-estimate-cost/data-events-estimate-cost.png)
