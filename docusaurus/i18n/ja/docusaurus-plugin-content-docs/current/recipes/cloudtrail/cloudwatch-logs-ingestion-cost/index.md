# コスト見積もり: CloudTrail Trails から CloudWatch Logs インジェストへの移行

## はじめに

[AWS CloudTrail](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html) を使用している組織には、CloudTrail ログを保存および監視するための主要なアプローチが 3 つあります。

1. **CloudTrail Trails**: ログを Amazon S3 バケットに保存します（オプションで CloudWatch Logs との統合も可能）
2. **CloudTrail Lake**: 高度なクエリと分析のために、マネージドデータレイクにイベントを保存します
3. **Direct CloudWatch Logs Ingestion**: CloudTrail のトレイルを作成せずに、CloudTrail イベントを直接 CloudWatch Logs に送信します

このガイドでは、CloudTrail トレイルから CloudWatch Logs への直接取り込みに移行する際のコスト見積もりについて説明します。[CloudWatch Logs データソース](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/data-source-discovery-management.html)の導入により、CloudTrail イベントを CloudWatch Logs 統合データストアに自動的に取り込むことができます。これにより、CloudTrail イベントのログ管理の強化、自動スキーマ検出、およびクエリ機能の簡素化が実現します。CloudWatch 統合データストアの詳細については、ブログ記事[Amazon CloudWatch introduces unified data management and analytics for operations, security, and compliance](https://aws.amazon.com/blogs/aws/amazon-cloudwatch-introduces-unified-data-management-and-analytics-for-operations-security-and-compliance/)を参照してください。

CloudTrail トレイルから CloudWatch Logs への直接取り込みへの移行に伴うコストへの影響を理解することは、予算計画とコスト最適化において非常に重要です。このガイドでは、[AWS Cost and Usage Report (CUR)](https://docs.aws.amazon.com/cur/latest/userguide/what-is-cur.html) データを使用して、この移行に関連するコストを見積もる方法を説明します。

:::note
**注意**: このガイドでは、CloudTrail イベントを CloudWatch Logs に取り込むコストの見積もりのみを提供しており、ストレージやクエリなど CloudWatch Logs に関連する追加コストは含まれていません。
:::

## CloudWatch Unified Data Store を使用したデータソースとしての CloudTrail

CloudTrail は CloudWatch 統合データストア内のデータソースであり、セキュリティおよび運用分析のためのデータを提供します。CloudWatch Logs の統合データストアを使用すると、CloudWatch Log Insights を使用して CloudTrail データを他の AWS および非 AWS ログと関連付けることができ、クラウドインフラストラクチャとセキュリティ体制への可視性を提供します。 

## コスト分析: Trails から CloudWatch Unified Data Store への移行

[AWS Cost and Usage Report (CUR)](https://docs.aws.amazon.com/cur/latest/userguide/what-is-cur.html) には、[CloudTrail イベントのボリューム](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-costs.html)を含む AWS サービスの使用状況に関する詳細情報が含まれています。CUR データに記録された CloudTrail イベントを分析することで、CloudWatch Logs への直接取り込みに移行した場合の潜在的なコストを見積もることができます。このアプローチがベースライン見積もりを提供する理由は次のとおりです。

- **イベントの相関**: CUR に記録された各 CloudTrail イベントは、CloudWatch Logs の取り込み料金が発生するイベントを表します
- **履歴分析**: CUR データは過去の CloudTrail 使用パターンを提供し、将来の CloudWatch Logs コストを予測するために活用できます
- **詳細な可視性**: アカウント、イベントタイプ、期間別にコストを分析できます
- **コスト計算**: CloudWatch Logs の取り込みは 1 GB あたり $0.75 ($0.25 CloudTrail 配信 + $0.50 CloudWatch Logs 取り込み) で料金が設定されています

:::note
**重要**: この方法は、CUR に記録された実際の CloudTrail イベントボリュームに基づく見積もりを提供し、Trail を使用して S3 バケットに配信する代わりに、これらのイベントを CloudWatch Logs に送信する場合のコストへの影響を把握するのに役立ちます。この見積もりには、CloudWatch Logs に関連するストレージのコストは含まれていません。
:::

次のクエリは、AWS Cost and Usage Report (CUR) データから CloudTrail イベントを分析し、CloudWatch Logs のインジェストコストを見積もります。

### クエリの理解

クエリは以下に基づいてコストを計算します。

1. **イベント数**: CUR データを使用した前月の CloudTrail イベントの合計
2. **推定データサイズ**: イベントあたり 1,500 バイトを想定（CloudTrail イベントの平均サイズ）
3. **コストの内訳**:
   - CloudWatch Logs への CloudTrail 配信: GB あたり $0.25
   - CloudWatch Logs の取り込み: GB あたり $0.50
   - 合計取り込みコスト: GB あたり $0.75

### コスト計算式

```
Total Events × 1,500 bytes / 1,000,000,000 = GB of data
GB of data × $0.25 = CloudTrail delivery cost
GB of data × $0.50 = CloudWatch Logs ingestion cost
GB of data × $0.75 = Total ingestion cost
```

### 前月の CloudTrail 使用データを使用した CUR クエリ

`<CUR_TABLE>` を実際の CUR テーブル名に置き換えてください。

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
**注意**: このサンプルクエリは、CloudTrail イベントを CloudWatch Logs に取り込む際の月額コストの見積もりを提供します。この見積もりには、ストレージ、クエリ、または将来的な CloudTrail イベント量の増加など、CloudWatch Logs の追加コストは含まれていないことにご注意ください。この計算は、過去の CUR (コストと使用状況レポート) データに基づくコストの推定ベースラインとして機能します。
:::

以下の画像は、CUR クエリの出力を示しています。結果はイベントタイプ（管理イベント、データイベント、および管理イベントの追加コピー）ごとに整理されており、前月に記録された CloudTrail イベントの合計数、その期間の現在のトレイルコスト、および推定 CloudWatch Logs 取り込みコストが表示されます。この内訳により、各使用タイプをトレイルから直接 CloudWatch Logs 取り込みに移行した場合のコストへの影響を把握できます。 

![CloudTrail Estimation of Data Event Cost for S3](/img/cloudops/recipes/AWS%20CloudTrail/trail-events-estimate-cost/trail-events-cw-logs-estimate-cost.png)


## まとめ

CloudWatch Logs の取り込みにより、CloudTrail イベントのリアルタイムモニタリング、より高速な分析、および簡素化された管理が実現します。CUR クエリは、Trails からの移行時のコスト見積もりに役立ち、即時アラート、クロスサービス相関、および組織のセキュリティとコンプライアンス要件に対するインフラストラクチャの複雑さの軽減など、CloudWatch Logs が提供する統合データストア機能を活用するのに役立ちます。

:::note
現在の料金の詳細については、[AWS CloudTrail の料金](https://aws.amazon.com/cloudtrail/pricing/)および [Amazon CloudWatch の料金](https://aws.amazon.com/cloudwatch/pricing/)を参照してください。
:::
