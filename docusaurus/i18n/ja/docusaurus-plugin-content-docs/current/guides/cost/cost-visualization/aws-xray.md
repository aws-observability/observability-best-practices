# AWS X-Ray

AWS X-Ray のコストと使用状況を可視化することで、個々の AWS アカウント、AWS リージョン、TracesStored のコストに関する洞察を得ることができます！

コストと使用状況データを可視化して分析するには、カスタムの Athena ビューを作成する必要があります。

1. 作業を進める前に、[実装の概要][cid-implement] で説明されている CUR の作成 (ステップ #1) と AWS CloudFormation テンプレートのデプロイ (ステップ #2) が完了していることを確認してください。

2. 次に、以下のクエリを使用して新しい Amazon Athena [ビュー][view] を作成します。このクエリは、組織内のすべての AWS アカウントにおける Amazon Managed Grafana のコストと使用状況を取得します。

        CREATE OR REPLACE VIEW "xray_cost" AS 
        SELECT
        line_item_usage_type
        , line_item_resource_id
        , line_item_usage_account_id
        , month
        , year
        , "sum"(line_item_usage_amount) "Usage"
        , "sum"(line_item_net_unblended_cost) cost
        FROM
        database.tablename #replace database.tablename with your database and table name 
        WHERE ("line_item_product_code" = 'AWSXRay')
        GROUP BY 1, 2, 3, 4, 5

Athena をデータソースとして使用することで、ビジネス要件に合わせて Amazon Managed Grafana または Amazon QuickSight でダッシュボードを構築できます。また、作成した Athena ビューに対して直接 [SQL クエリ][sql-query] を実行することもできます。

[view]: https://athena-in-action.workshop.aws/30-basics/303-create-view.html
[sql-query]: https://docs.aws.amazon.com/ja_jp/athena/latest/ug/querying-athena-tables.html
[cid-implement]: ../../../guides/cost/cost-visualization/cost.md#implementation
