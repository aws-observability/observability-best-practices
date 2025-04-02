# Amazon Managed Grafana

Amazon Managed Grafana のコストと使用状況の可視化により、個々の AWS アカウント、AWS リージョン、特定の Grafana ワークスペースインスタンス、および Admin、Editor、Viewer ユーザーのライセンスコストに関する洞察を得ることができます！

コストと使用状況データを可視化して分析するには、カスタム Athena ビューを作成する必要があります。

1. 作業を進める前に、[実装の概要][cid-implement] で説明されている CUR (ステップ #1) を作成し、AWS CloudFormation テンプレート (ステップ #2) をデプロイしていることを確認してください。

2. 次に、以下のクエリを使用して新しい Amazon Athena [ビュー][view] を作成します。このクエリは、組織内のすべての AWS アカウントにおける Amazon Managed Grafana のコストと使用状況を取得します。

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
[sql-query]: https://docs.aws.amazon.com/ja_jp/athena/latest/ug/querying-athena-tables.html
[cid-implement]: ../../../guides/cost/cost-visualization/cost.md#implementation
