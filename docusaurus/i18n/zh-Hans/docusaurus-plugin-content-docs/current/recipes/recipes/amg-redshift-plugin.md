# 在 Amazon Managed Grafana 中使用 Redshift

本文介绍如何在 [Amazon Managed Grafana][amg] 中使用 [Amazon Redshift][redshift]——一种使用标准 SQL 的 PB 级数据仓库服务。此集成由 [Redshift data source for Grafana][redshift-ds] 实现，这是一个开源插件，可在任何自建的 Grafana 实例中使用，也已预装在 Amazon Managed Grafana 中。

:::note
    本指南大约需要 10 分钟完成。
:::
## 前提条件

1. 您拥有从账户访问 Amazon Redshift 的管理员权限。
1. 使用 `GrafanaDataSource: true` 标记您的 Amazon Redshift 集群。
1. 为了使用服务托管策略，请按以下方式之一创建数据库凭证：
    1. 如果要使用默认机制（即临时凭证选项）对 Redshift 数据库进行身份验证，必须创建名为 `redshift_data_api_user` 的数据库用户。
    1. 如果要使用来自 Secrets Manager 的凭证，必须使用 `RedshiftQueryOwner: true` 标记该密钥。

:::tip
    有关如何使用服务托管或自定义策略的更多信息，
    请参阅 [Amazon Managed Grafana 文档中的示例][svpolicies]。
:::

## 基础设施
我们需要一个 Grafana 实例，请设置一个新的 [Amazon Managed Grafana
工作区][amg-workspace]，例如使用[入门][amg-getting-started]指南，或使用现有的工作区。

:::note
    要使用 AWS 数据源配置，首先转到 Amazon Managed Grafana
    控制台启用服务托管的 IAM 角色，该角色授予工作区读取 Athena 资源所需的 IAM 策略。
:::

要设置 Athena 数据源，使用左侧工具栏选择下方的 AWS 图标，然后选择 "Redshift"。选择您希望插件用于发现 Redshift 数据源的默认区域，然后选择所需的账户，最后选择 "Add data source"。

或者，您可以按照以下步骤手动添加和配置 Redshift 数据源：

1. 点击左侧工具栏上的 "Configurations" 图标，然后点击 "Add data source"。
1. 搜索 "Redshift"。
1. [可选] 配置身份验证提供程序（建议使用 workspace IAM role）。
1. 提供 "Cluster Identifier"、"Database" 和 "Database User" 的值。
1. 点击 "Save & test"。

您应该会看到类似以下内容：

![Screen shot of the Redshift data source config](../images/amg-plugin-redshift-ds.png)

## 使用方法
我们将使用 [Redshift Advance Monitoring][redshift-mon] 设置。由于所有内容都已开箱即用，此时无需额外配置。

您可以导入 Redshift 监控 dashboard，它包含在 Redshift 插件中。导入后，您应该会看到类似以下内容：

![Screen shot of the Redshift dashboard in AMG](../images/amg-redshift-mon-dashboard.png)

从这里开始，您可以使用以下指南在 Amazon Managed Grafana 中创建自己的 dashboard：

* [用户指南：Dashboards](https://docs.aws.amazon.com/grafana/latest/userguide/dashboard-overview.html)
* [创建 dashboard 的最佳实践](https://grafana.com/docs/grafana/latest/best-practices/best-practices-for-creating-dashboards/)

以上就是全部内容，恭喜您已学会如何从 Grafana 使用 Redshift！

## 清理

删除您使用的 Redshift 数据库，然后通过控制台删除 Amazon Managed Grafana 工作区。

[redshift]: https://aws.amazon.com/redshift/
[amg]: https://aws.amazon.com/grafana/
[svpolicies]: https://docs.aws.amazon.com/grafana/latest/userguide/security_iam_id-based-policy-examples.html
[redshift-ds]: https://grafana.com/grafana/plugins/grafana-redshift-datasource/
[aws-cli]: https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html
[aws-cli-conf]: https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html
[amg-getting-started]: https://aws.amazon.com/blogs/mt/amazon-managed-grafana-getting-started/
[redshift-console]: https://console.aws.amazon.com/redshift/
[redshift-mon]: https://github.com/awslabs/amazon-redshift-monitoring
[amg-workspace]: https://console.aws.amazon.com/grafana/home#/workspaces
