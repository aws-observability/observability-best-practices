# Amazon CloudWatch

Amazon CloudWatch のコストと使用量の視覚化により、個々の AWS アカウント、AWS リージョン、および GetMetricData、PutLogEvents、GetMetricStream、ListMetrics、MetricStorage、HourlyStorageMetering、ListMetrics などの CloudWatch の操作のコストに関する洞察を得ることができます。

CloudWatch のコストと使用量データを視覚化および分析するには、カスタム Athena ビューを作成する必要があります。Amazon Athena の[ビュー][view]は論理テーブルであり、元の CUR テーブルからの一部のカラムのサブセットを作成して、データのクエリを簡素化します。

1. 進む前に、CUR (ステップ #1) を作成し、[実装の概要][cid-implement]で説明されている AWS Conformation テンプレート (ステップ #2) をデプロイしていることを確認してください。

2. 次に、以下のクエリを使用して新しい Amazon Athena [ビュー][view] を作成します。このクエリは、組織内のすべての AWS アカウントにわたる Amazon CloudWatch のコストと使用量を取得します。

        CREATE OR REPLACE VIEW "cloudwatch_cost" AS 
        SELECT
        line_item_usage_type
        , line_item_resource_id
        , line_item_operation
        , line_item_usage_account_id
        , month
        , year
        , "sum"(line_item_usage_amount) "Usage"
        , "sum"(line_item_unblended_cost) cost
        FROM
        database.tablename #replace database.tablename with your database and table name
        WHERE ("line_item_product_code" = 'AmazonCloudWatch')
        GROUP BY 1, 2, 3, 4, 5, 6

### Amazon QuickSight ダッシュボードを作成する

次に、Amazon CloudWatch のコストと使用状況を可視化するための QuickSight ダッシュボードを作成しましょう。

1. AWS マネジメントコンソールで QuickSight サービスに移動し、右上の AWS リージョンを選択します。QuickSight データセットは、前に作成した Amazon Athena テーブルと同じ AWS リージョンにある必要があることに注意してください。
2. QuickSight が [Amazon S3 と AWS Athena にアクセス] できることを確認します。
3. 前に作成した Amazon Athena ビューをデータソースとして選択し、[QuickSight データセットを作成] します。この手順に従って、データセットを毎日更新するよう [スケジュール設定] してください。
4. QuickSight [分析] を作成します。
5. ニーズに合わせて QuickSight [ビジュアル] を作成します。
6. ビジュアルを [フォーマット] してニーズに合わせます。
7. 分析から [ダッシュボードを公開] できます。
8. ダッシュボードを [レポート] 形式で個人またはグループに、1 回限りまたはスケジュールで送信できます。

次の **QuickSight ダッシュボード** は、AWS Organizations 内のすべての AWS アカウントにおける Amazon CloudWatch のコストと使用状況、および GetMetricData、PutLogEvents、GetMetricStream、ListMetrics、MetricStorage、HourlyStorageMetering、ListMetrics などの CloudWatch 操作を示しています。

![cloudwatch-cost1](../../../images/cloudwatch-cost-1.PNG)
![cloudwatch-cost2](../../../images/cloudwatch-cost-2.PNG)

このダッシュボードを使えば、組織内の AWS アカウントにおける Amazon CloudWatch のコストを特定できます。他の QuickSight [ビジュアルタイプ] を使って、要件に合わせて異なるダッシュボードを作成することができます。
