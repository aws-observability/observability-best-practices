# Amazon CloudWatch

Amazon CloudWatch のコストと使用量のビジュアルにより、個々の AWS アカウント、AWS リージョン、GetMetricData、PutLogEvents、GetMetricStream、ListMetrics、MetricStorage、HourlyStorageMetering などのすべての CloudWatch オペレーションのコストの洞察を得ることができます。

CloudWatch のコストと使用量データを視覚化および分析するには、カスタム Athena ビューを作成する必要があります。Amazon Athena [ビュー][view]は論理テーブルであり、元の CUR テーブルから列のサブセットを作成し、データのクエリを簡素化します。

1.  [実装の概要][cid-implement] で言及されている CUR (ステップ #1) を作成し、AWS 準拠テンプレート (ステップ #2) をデプロイしたことを確認してください。

2.  次のクエリを使用して、新しい Amazon Athena [ビュー][view] を作成します。このクエリは、Organization のすべての AWS アカウントにわたる Amazon CloudWatch のコストと使用状況を取得します。

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

### Amazon QuickSight ダッシュボードの作成

次に、Amazon CloudWatch のコストと使用状況を可視化するための QuickSight ダッシュボードを作成しましょう。

1. AWS Management Console で、QuickSight サービスに移動し、右上のコーナーから AWS リージョンを選択します。QuickSight データセットは、Amazon Athena テーブルと同じ AWS リージョンにある必要があることに注意してください。
2. QuickSight が [Amazon S3 にアクセス][access] し、AWS Athena を使用できることを確認します。 
3. 以前に作成した Amazon Athena ビューをデータソースとして選択し、[QuickSight データセットを作成][create-dataset]します。 この手順を使用して、データセットの[更新を毎日スケジュール][schedule-refresh]します。
4. QuickSight [分析][analysis]を作成します。
5. ニーズに合わせて QuickSight [ビジュアル][visuals]を作成します。
6. ビジュアルをニーズに合わせて[フォーマット][format]します。
7. これで、分析からダッシュボードを[公開][publish]できます。
8. 個人またはグループに対して、ダッシュボードを[レポート][report]形式で一度またはスケジュールに従って送信できます。

次の **QuickSight ダッシュボード** は、AWS Organizations のすべての AWS アカウントにおける Amazon CloudWatch のコストと使用状況を示しています。また、GetMetricData、PutLogEvents、GetMetricStream、ListMetrics、MetricStorage、HourlyStorageMetering などの CloudWatch オペレーションも示しています。

![cloudwatch-cost1](../../../images/cloudwatch-cost-1.PNG)
![cloudwatch-cost2](../../../images/cloudwatch-cost-2.PNG)

このダッシュボードを使用することで、組織内の AWS アカウントにおける Amazon CloudWatch のコストを特定できるようになりました。ニーズに合わせて異なるダッシュボードを構築するために、他の QuickSight [ビジュアルタイプ][types] を使用できます。

[view]: https://athena-in-action.workshop.aws/30-basics/303-create-view.html
[access]: https://docs.aws.amazon.com/quicksight/latest/user/accessing-data-sources.html
[create-dataset]: https://docs.aws.amazon.com/quicksight/latest/user/create-a-data-set-athena.html
[schedule-refresh]: https://docs.aws.amazon.com/quicksight/latest/user/refreshing-imported-data.html
[analysis]: https://docs.aws.amazon.com/quicksight/latest/user/creating-an-analysis.html
[visuals]: https://docs.aws.amazon.com/quicksight/latest/user/creating-a-visual.html
[format]: https://docs.aws.amazon.com/quicksight/latest/user/formatting-a-visual.html
[publish]: https://docs.aws.amazon.com/quicksight/latest/user/creating-a-dashboard.html
[report]: https://docs.aws.amazon.com/quicksight/latest/user/sending-reports.html
[types]: https://docs.aws.amazon.com/quicksight/latest/user/working-with-visual-types.html
[cid-implement]: ../../../guides/cost/cost-visualization/cost.md#implementation
