# Amazon CloudWatch

Amazon CloudWatch のコストと使用状況を可視化することで、個々の AWS アカウント、AWS リージョン、そして GetMetricData、PutLogEvents、GetMetricStream、ListMetrics、MetricStorage、HourlyStorageMetering、ListMetrics などの CloudWatch オペレーションのコストについての洞察を得ることができます。

CloudWatch のコストと使用状況データを可視化して分析するには、カスタムの Athena ビューを作成する必要があります。Amazon Athena の[ビュー][view]は論理テーブルであり、クエリを簡素化するために元の CUR テーブルから列のサブセットを作成します。

1. 作業を進める前に、[実装の概要][cid-implement]で説明されている CUR の作成 (ステップ #1) と AWS CloudFormation テンプレートのデプロイ (ステップ #2) が完了していることを確認してください。

2. 次のクエリを使用して、新しい Amazon Athena [ビュー][view]を作成します。このクエリは、組織内のすべての AWS アカウントにおける Amazon CloudWatch のコストと使用状況を取得します。

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

それでは、Amazon CloudWatch のコストと使用状況を可視化するための QuickSight ダッシュボードを作成しましょう。

1. AWS マネジメントコンソールで、QuickSight サービスに移動し、右上隅から AWS リージョンを選択します。QuickSight データセットは、Amazon Athena テーブルと同じ AWS リージョンにある必要があることに注意してください。
2. QuickSight が Amazon S3 と AWS Athena に[アクセス][access]できることを確認します。
3. 以前作成した Amazon Athena ビューをデータソースとして選択し、[QuickSight データセット][create-dataset]を作成します。この手順を使用して、データセットの[更新スケジュール][schedule-refresh]を毎日設定します。
4. QuickSight [分析][analysis]を作成します。
5. 必要に応じて QuickSight [ビジュアル][visuals]を作成します。
6. 必要に応じてビジュアルを[フォーマット][format]します。
7. これで、分析からダッシュボードを[公開][publish]できます。
8. ダッシュボードを[レポート][report]形式で、1 回限りまたはスケジュールに従って、個人やグループに送信できます。

以下の **QuickSight ダッシュボード**は、AWS Organizations 内のすべての AWS アカウントにおける Amazon CloudWatch のコストと使用状況を示しています。GetMetricData、PutLogEvents、GetMetricStream、ListMetrics、MetricStorage、HourlyStorageMetering、ListMetrics などの CloudWatch オペレーションも含まれています。

![cloudwatch-cost1](../../../images/cloudwatch-cost-1.PNG)
![cloudwatch-cost2](../../../images/cloudwatch-cost-2.PNG)

このダッシュボードを使用することで、組織全体の AWS アカウントにおける Amazon CloudWatch のコストを特定できるようになりました。要件に合わせて異なるダッシュボードを構築するために、他の QuickSight [ビジュアルタイプ][types]を使用することもできます。

[view]: https://athena-in-action.workshop.aws/30-basics/303-create-view.html
[access]: https://docs.aws.amazon.com/ja_jp/quicksight/latest/user/accessing-data-sources.html
[create-dataset]: https://docs.aws.amazon.com/ja_jp/quicksight/latest/user/create-a-data-set-athena.html
[schedule-refresh]: https://docs.aws.amazon.com/ja_jp/quicksight/latest/user/refreshing-imported-data.html
[analysis]: https://docs.aws.amazon.com/ja_jp/quicksight/latest/user/creating-an-analysis.html
[visuals]: https://docs.aws.amazon.com/ja_jp/quicksight/latest/user/creating-a-visual.html
[format]: https://docs.aws.amazon.com/ja_jp/quicksight/latest/user/formatting-a-visual.html
[publish]: https://docs.aws.amazon.com/ja_jp/quicksight/latest/user/creating-a-dashboard.html
[report]: https://docs.aws.amazon.com/ja_jp/quicksight/latest/user/sending-reports.html
[types]: https://docs.aws.amazon.com/ja_jp/quicksight/latest/user/working-with-visual-types.html
[cid-implement]: ../../../guides/cost/cost-visualization/cost.md#implementation
