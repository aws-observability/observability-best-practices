# Amazon Managed Grafana

Amazon Managed Grafana のコストと使用状況のビジュアルにより、個々の AWS アカウント、AWS リージョン、特定の Grafana ワークスペースインスタンス、および Admin、Editor、Viewer ユーザーのライセンスコストの洞察を得ることができます。

コストと使用状況データを視覚化および分析するには、カスタム Athena ビューを作成する必要があります。

1. 開始する前に、[Implementation overview][cid-implement] に記載されている CUR (ステップ #1) を作成し、AWS Confirmation Template (ステップ #2) をデプロイしたことを確認してください。

2. 次に、以下のクエリを使用して、新しい Amazon Athena [view][view] を作成します。このクエリは、Organization 内のすべての AWS アカウントにわたる Amazon Managed Grafana のコストと使用状況を取得します。

        CREATE OR REPLACE VIEW "grafana_cost" AS
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
        WHERE ("line_item_product_code" = 'AmazonGrafana')
        GROUP BY 1, 2, 3, 4, 5, 6

Athena をデータソースとして使用することで、ビジネス要件に合わせて Amazon Managed Grafana または Amazon QuickSight でダッシュボードを構築できます。また、作成した Athena ビューに対して直接 [SQL クエリ][sql-query] を実行することもできます。


[view]: https://athena-in-action.workshop.aws/30-basics/303-create-view.html
[sql-query]: https://docs.aws.amazon.com/athena/latest/ug/querying-athena-tables.html
[cid-implement]: ../../../guides/cost/cost-visualization/cost.md#implementation
