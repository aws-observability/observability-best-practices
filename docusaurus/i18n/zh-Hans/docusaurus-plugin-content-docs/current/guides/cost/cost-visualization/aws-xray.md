# AWS X-Ray

AWS X-Ray 成本和使用量可视化将帮助您深入了解各个 AWS 账户、AWS 区域和 TracesStored 的成本！

要可视化和分析成本及使用量数据，您需要创建一个自定义 Athena 视图。

1.	在继续之前，请确保您已创建 CUR（步骤 #1）并部署了[实施概述][cid-implement]中提到的 AWS CloudFormation 模板（步骤 #2）。

2.	现在，使用以下查询创建一个新的 Amazon Athena [视图][view]。此查询获取组织中所有 AWS 账户的 AWS X-Ray 成本和使用量。

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

使用 Athena 作为数据源，您可以在 Amazon Managed Grafana 或 Amazon QuickSight 中构建 dashboard 以满足您的业务需求。同样，您也可以直接对创建的 Athena 视图运行 [SQL 查询][sql-query]。

[view]: https://athena-in-action.workshop.aws/30-basics/303-create-view.html
[sql-query]: https://docs.aws.amazon.com/athena/latest/ug/querying-athena-tables.html
[cid-implement]: ../../../guides/cost/cost-visualization/cost.md#implementation
