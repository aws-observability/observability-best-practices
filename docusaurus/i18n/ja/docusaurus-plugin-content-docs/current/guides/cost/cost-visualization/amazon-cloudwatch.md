# Amazon CloudWatch

Amazon CloudWatch のコストと使用状況のビジュアルにより、個々の AWS アカウント、AWS リージョン、および GetMetricData、PutLogEvents、GetMetricStream、ListMetrics、MetricStorage、HourlyStorageMetering、ListMetrics などのすべての CloudWatch オペレーションのコストに関するインサイトを得ることができます。

CloudWatch のコストと使用状況データを可視化および分析するには、カスタム Athena ビューを作成する必要があります。Amazon Athena の[ビュー][view]は論理テーブルであり、元の CUR テーブルから列のサブセットを作成して、データのクエリを簡素化します。

1. 続行する前に、[実装の概要][cid-implement]に記載されている CUR の作成（ステップ #1）と AWS CloudFormation テンプレートのデプロイ（ステップ #2）が完了していることを確認してください。

2. 次に、以下のクエリを使用して新しい Amazon Athena [ビュー][view]を作成します。このクエリは、組織内のすべての AWS アカウントにおける Amazon CloudWatch のコストと使用状況を取得します。

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

それでは、Amazon CloudWatch のコストと使用状況を可視化するための QuickSight ダッシュボードを作成しましょう。

1. AWS Management Console で、QuickSight サービスに移動し、右上隅から AWS リージョンを選択します。QuickSight データセットは、Amazon Athena テーブルと同じ AWS リージョンにある必要があることに注意してください。
2. QuickSight が Amazon S3 と AWS Athena に[アクセス][access]できることを確認します。
3. 以前に作成した Amazon Athena ビューをデータソースとして選択して、[QuickSight データセットを作成][create-dataset]します。この手順を使用して、データセットの[更新を毎日スケジュール][schedule-refresh]します。
4. QuickSight [分析][analysis]を作成します。
5. ニーズに合わせて QuickSight [ビジュアル][visuals]を作成します。
6. ニーズに合わせてビジュアルを[フォーマット][format]します。
7. これで、分析からダッシュボードを[公開][publish]できます。
8. ダッシュボードを[レポート][report]形式で個人またはグループに、1 回または定期的に送信できます。

以下の **QuickSight ダッシュボード**は、AWS Organizations 内のすべての AWS アカウントにおける Amazon CloudWatch のコストと使用状況を、GetMetricData、PutLogEvents、GetMetricStream、ListMetrics、MetricStorage、HourlyStorageMetering、ListMetrics などの CloudWatch オペレーションとともに表示します。

![cloudwatch-cost1](../../../images/cloudwatch-cost-1.PNG)
![cloudwatch-cost2](../../../images/cloudwatch-cost-2.PNG)

前述のダッシュボードを使用することで、組織全体の AWS アカウントにおける Amazon CloudWatch のコストを特定できるようになります。他の QuickSight [ビジュアルタイプ][types]を使用して、要件に合わせたさまざまなダッシュボードを構築できます。


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

