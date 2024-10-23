# Amazon CloudWatch

Amazon CloudWatch のコストと使用状況のビジュアルを利用することで、個々の AWS アカウント、AWS リージョン、そして GetMetricData、PutLogEvents、GetMetricStream、ListMetrics、MetricStorage、HourlyStorageMetering、ListMetrics などの CloudWatch 操作全般のコストに関する洞察を得ることができます。

CloudWatch のコストと使用状況データを可視化し分析するには、カスタムの Athena ビューを作成する必要があります。Amazon Athena の[ビュー][view]は論理テーブルであり、元の CUR テーブルから列のサブセットを作成してデータのクエリを簡素化します。

1. 続行する前に、[実装の概要][cid-implement]で言及されている CUR の作成（ステップ #1）と AWS CloudFormation テンプレートのデプロイ（ステップ #2）を完了していることを確認してください。

2. 次に、以下のクエリを使用して新しい Amazon Athena [ビュー][view]を作成します。このクエリは、組織内のすべての AWS アカウントにわたる Amazon CloudWatch のコストと使用状況を取得します。

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
        database.tablename #database.tablename をあなたのデータベースとテーブル名に置き換えてください
        WHERE ("line_item_product_code" = 'AmazonCloudWatch')
        GROUP BY 1, 2, 3, 4, 5, 6



### Amazon QuickSight ダッシュボードの作成

では、Amazon CloudWatch のコストと使用状況を可視化するための QuickSight ダッシュボードを作成しましょう。

1. AWS マネジメントコンソールで、QuickSight サービスに移動し、右上隅から AWS リージョンを選択します。QuickSight データセットは Amazon Athena テーブルと同じ AWS リージョンにある必要があることに注意してください。
2. QuickSight が Amazon S3 と AWS Athena に[アクセス][access]できることを確認します。
3. 以前に作成した Amazon Athena ビューをデータソースとして選択し、QuickSight [データセットを作成][create-dataset]します。この手順を使用して、データセットの[更新をスケジュール][schedule-refresh]し、毎日更新するようにします。
4. QuickSight [分析][analysis]を作成します。
5. 必要に応じて QuickSight [ビジュアル][visuals]を作成します。
6. ニーズに合わせてビジュアルを[フォーマット][format]します。
7. これで、分析からダッシュボードを[公開][publish]できます。
8. ダッシュボードを[レポート][report]形式で個人やグループに、1 回または定期的に送信できます。

以下の **QuickSight ダッシュボード**は、AWS Organizations 内のすべての AWS アカウントにおける Amazon CloudWatch のコストと使用状況を示しています。GetMetricData、PutLogEvents、GetMetricStream、ListMetrics、MetricStorage、HourlyStorageMetering、ListMetrics などの CloudWatch 操作も含まれています。

![cloudwatch-cost1](../../../images/cloudwatch-cost-1.PNG)
![cloudwatch-cost2](../../../images/cloudwatch-cost-2.PNG)

このダッシュボードを使用することで、組織全体の AWS アカウントにおける Amazon CloudWatch のコストを特定できるようになりました。他の QuickSight [ビジュアルタイプ][types]を使用して、要件に合わせてさまざまなダッシュボードを構築できます。

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
