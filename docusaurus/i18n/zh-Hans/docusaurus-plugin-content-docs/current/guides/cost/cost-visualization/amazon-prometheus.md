# Amazon Managed Service for Prometheus

Amazon Managed Service for Prometheus 成本和使用量可视化将帮助您深入了解各个 AWS 账户、AWS 区域、特定 Prometheus Workspace 实例的成本，以及 RemoteWrite、Query 和 HourlyStorageMetering 等操作的成本！

要可视化和分析成本及使用量数据，您需要创建一个自定义 Athena 视图。

1.	在继续之前，请确保您已创建 CUR（步骤 #1）并部署了[实施概述][cid-implement]中提到的 AWS CloudFormation 模板（步骤 #2）。

2.	现在，使用以下查询创建一个新的 Amazon Athena [视图][view]。此查询获取组织中所有 AWS 账户的 Amazon Managed Service for Prometheus 成本和使用量。

        CREATE OR REPLACE VIEW "prometheus_cost" AS 
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
        WHERE ("line_item_product_code" = 'AmazonPrometheus')
        GROUP BY 1, 2, 3, 4, 5, 6

## 创建 Amazon Managed Grafana dashboard

使用 Amazon Managed Grafana，您可以通过 Grafana workspace 控制台中的 AWS 数据源配置选项将 Athena 添加为数据源。此功能通过发现您现有的 Athena 账户并管理访问 Athena 所需的身份验证凭证配置，简化了将 Athena 添加为数据源的过程。有关使用 Athena 数据源的先决条件，请参阅[先决条件][Prerequisites]。


以下 **Grafana dashboard** 显示了 AWS Organizations 中所有 AWS 账户的 Amazon Managed Service for Prometheus 成本和使用量，以及各个 Prometheus Workspace 实例的成本和 RemoteWrite、Query 和 HourlyStorageMetering 等操作的成本！

![prometheus-cost](../../../images/prometheus-cost.png)

Grafana 中的 dashboard 由 JSON 对象表示，该对象存储其 dashboard 的元数据。Dashboard 元数据包括 dashboard 属性、面板的元数据、模板变量、面板查询等。访问上述 dashboard 的 JSON 模板[此处](AmazonPrometheus.json)。

通过上述 dashboard，您现在可以识别组织中各 AWS 账户的 Amazon Managed Service for Prometheus 的成本和使用量。您可以使用其他 Grafana [dashboard 面板][panels]来构建满足您需求的可视化。

[Prerequisites]: https://docs.aws.amazon.com/grafana/latest/userguide/Athena-prereq.html
[view]: https://athena-in-action.workshop.aws/30-basics/303-create-view.html
[panels]: https://docs.aws.amazon.com/grafana/latest/userguide/Grafana-panels.html
[cid-implement]: ../../../guides/cost/cost-visualization/cost.md#implementation
