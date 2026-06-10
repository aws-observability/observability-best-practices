# 在 Amazon Managed Grafana 中使用 Athena

本文介绍如何在 [Amazon Managed Grafana][amg] 中使用 [Amazon Athena][athena]——一种无服务器交互式查询服务，允许您使用标准 SQL 分析 Amazon S3 中的数据。此集成由 [Athena data source for Grafana][athena-ds] 实现，这是一个开源插件，可在任何自建的 Grafana 实例中使用，也已预装在 Amazon Managed Grafana 中。

:::note
    本指南大约需要 20 分钟完成。
:::

## 前提条件

* [AWS CLI][aws-cli] 已在您的环境中安装并[配置][aws-cli-conf]。
* 您可以从您的账户访问 Amazon Athena。

## 基础设施

让我们先设置必要的基础设施。

### 设置 Amazon Athena

我们想了解如何在两种不同场景中使用 Athena：一种是围绕地理数据配合 Geomap 插件，另一种是围绕 VPC 流日志的安全相关场景。

首先，确保 Athena 已设置好并且数据集已加载。

:::warning
    您必须使用 Amazon Athena 控制台来执行这些查询。Grafana
	通常对数据源只有只读访问权限，因此不能用于创建或更新数据。
:::

#### 加载地理数据

在第一个用例中，我们使用来自 [Registry of Open Data on AWS][awsod] 的数据集。
更具体地说，我们将使用 [OpenStreetMap][osm] (OSM) 来演示 Athena 插件在地理数据方面的使用。为此，我们需要先将 OSM 数据导入 Athena。

首先，在 Athena 中创建一个新数据库。转到 [Athena
控制台][athena-console]，使用以下三个 SQL 查询将 OSM 数据导入数据库。

查询 1：

```sql
CREATE EXTERNAL TABLE planet (
  id BIGINT,
  type STRING,
  tags MAP<STRING,STRING>,
  lat DECIMAL(9,7),
  lon DECIMAL(10,7),
  nds ARRAY<STRUCT<ref: BIGINT>>,
  members ARRAY<STRUCT<type: STRING, ref: BIGINT, role: STRING>>,
  changeset BIGINT,
  timestamp TIMESTAMP,
  uid BIGINT,
  user STRING,
  version BIGINT
)
STORED AS ORCFILE
LOCATION 's3://osm-pds/planet/';
```

查询 2：

```sql
CREATE EXTERNAL TABLE planet_history (
    id BIGINT,
    type STRING,
    tags MAP<STRING,STRING>,
    lat DECIMAL(9,7),
    lon DECIMAL(10,7),
    nds ARRAY<STRUCT<ref: BIGINT>>,
    members ARRAY<STRUCT<type: STRING, ref: BIGINT, role: STRING>>,
    changeset BIGINT,
    timestamp TIMESTAMP,
    uid BIGINT,
    user STRING,
    version BIGINT,
    visible BOOLEAN
)
STORED AS ORCFILE
LOCATION 's3://osm-pds/planet-history/';
```

查询 3：

```sql
CREATE EXTERNAL TABLE changesets (
    id BIGINT,
    tags MAP<STRING,STRING>,
    created_at TIMESTAMP,
    open BOOLEAN,
    closed_at TIMESTAMP,
    comments_count BIGINT,
    min_lat DECIMAL(9,7),
    max_lat DECIMAL(9,7),
    min_lon DECIMAL(10,7),
    max_lon DECIMAL(10,7),
    num_changes BIGINT,
    uid BIGINT,
    user STRING
)
STORED AS ORCFILE
LOCATION 's3://osm-pds/changesets/';
```

#### 加载 VPC 流日志数据

第二个用例是安全相关的：使用 [VPC Flow Logs][vpcflowlogs] 分析网络流量。

首先，我们需要让 EC2 为我们生成 VPC Flow Logs。如果您还没有这样做，请现在[创建 VPC 流日志][createvpcfl]，可以在网络接口级别、子网级别或 VPC 级别创建。

:::note
    为了提高查询性能并最小化存储占用，我们将 VPC 流日志存储为
    [Parquet][parquet] 格式——一种支持嵌套数据的列式存储格式。
:::

对于我们的设置，您选择哪个选项（网络接口、子网或 VPC）都没有关系，只要您以 Parquet 格式将其发布到 S3 存储桶，如下所示：

![Screen shot of the EC2 console "Create flow log" panel](../images/ec2-vpc-flowlogs-creation.png)

现在，再次通过 [Athena 控制台][athena-console]，在您导入 OSM 数据的同一数据库中创建 VPC 流日志数据的表，或者如果您愿意，也可以创建一个新数据库。

使用以下 SQL 查询，确保将 `VPC_FLOW_LOGS_LOCATION_IN_S3` 替换为您自己的存储桶/文件夹：


```sql
CREATE EXTERNAL TABLE vpclogs (
  `version` int, 
  `account_id` string, 
  `interface_id` string, 
  `srcaddr` string, 
  `dstaddr` string, 
  `srcport` int, 
  `dstport` int, 
  `protocol` bigint, 
  `packets` bigint, 
  `bytes` bigint, 
  `start` bigint, 
  `end` bigint, 
  `action` string, 
  `log_status` string, 
  `vpc_id` string, 
  `subnet_id` string, 
  `instance_id` string, 
  `tcp_flags` int, 
  `type` string, 
  `pkt_srcaddr` string, 
  `pkt_dstaddr` string, 
  `region` string, 
  `az_id` string, 
  `sublocation_type` string, 
  `sublocation_id` string, 
  `pkt_src_aws_service` string, 
  `pkt_dst_aws_service` string, 
  `flow_direction` string, 
  `traffic_path` int
)
STORED AS PARQUET
LOCATION 'VPC_FLOW_LOGS_LOCATION_IN_S3'
```

例如，如果您使用的 S3 存储桶名为 `allmyflowlogs`，`VPC_FLOW_LOGS_LOCATION_IN_S3` 可能如下所示：

```
s3://allmyflowlogs/AWSLogs/12345678901/vpcflowlogs/eu-west-1/2021/
```

现在数据集在 Athena 中可用了，让我们继续设置 Grafana。

### 设置 Grafana

我们需要一个 Grafana 实例，请设置一个新的 [Amazon Managed Grafana
工作区][amg-workspace]，例如使用[入门][amg-getting-started]指南，或使用现有的工作区。

:::warning
    要使用 AWS 数据源配置，首先转到 Amazon Managed Grafana
    控制台启用服务托管的 IAM 角色，该角色授予工作区读取 Athena 资源所需的 IAM 策略。
    此外，请注意以下事项：

	1. 您计划使用的 Athena 工作组需要使用键 `GrafanaDataSource`、值 `true` 进行标记，
	服务托管权限才能允许使用该工作组。
	1. 服务托管的 IAM 策略仅授予对以 `grafana-athena-query-results-` 开头的
	查询结果存储桶的访问权限，因此对于任何其他存储桶，您必须手动添加权限。
	1. 您必须手动为正在查询的底层数据源添加 `s3:Get*` 和 `s3:List*` 权限。
:::




要设置 Athena 数据源，使用左侧工具栏选择下方的 AWS 图标，然后选择 "Athena"。选择您希望插件用于发现 Athena 数据源的默认区域，然后选择所需的账户，最后选择 "Add data source"。

或者，您可以按照以下步骤手动添加和配置 Athena 数据源：

1. 点击左侧工具栏上的 "Configurations" 图标，然后点击 "Add data source"。
1. 搜索 "Athena"。
1. [可选] 配置身份验证提供程序（建议使用 workspace IAM role）。
1. 选择目标 Athena 数据源、数据库和工作组。
1. 如果您的工作组尚未配置输出位置，请指定用于查询结果的 S3 存储桶和文件夹。请注意，如果要使用服务托管策略，存储桶名称必须以 `grafana-athena-query-results-` 开头。
1. 点击 "Save & test"。

您应该会看到类似以下内容：

![Screen shot of the Athena data source config](../images/amg-plugin-athena-ds.png)




## 使用方法

现在让我们看看如何从 Grafana 使用 Athena 数据集。

### 使用地理数据

Athena 中的 [OpenStreetMap][osm] (OSM) 数据可以回答许多问题，例如"某些设施在哪里"。让我们来看看实际操作。

例如，针对 OSM 数据集的一个 SQL 查询，列出拉斯维加斯地区提供餐饮的场所：

```sql
SELECT 
tags['amenity'] AS amenity,
tags['name'] AS name,
tags['website'] AS website,
lat, lon
FROM planet
WHERE type = 'node'
  AND tags['amenity'] IN ('bar', 'pub', 'fast_food', 'restaurant')
  AND lon BETWEEN -115.5 AND -114.5
  AND lat BETWEEN 36.1 AND 36.3
LIMIT 500;
```

:::info
    上述查询中的拉斯维加斯地区定义为纬度在 `36.1` 到 `36.3` 之间、
    经度在 `-115.5` 到 `-114.5` 之间的所有内容。
	您可以将其转换为一组变量（每个角一个），使 Geomap 插件适用于其他区域。
:::
要使用上述查询可视化 OSM 数据，您可以导入示例 dashboard，
可通过 [osm-sample-dashboard.json](./amg-athena-plugin/osm-sample-dashboard.json) 获取，
效果如下：

![Screen shot of the OSM dashboard in AMG](../images/amg-osm-dashboard.png)

:::note
    在上面的截图中，我们使用 Geomap 可视化（左侧面板）来绘制数据点。
:::
### 使用 VPC 流日志数据

要分析 VPC 流日志数据并检测 SSH 和 RDP 流量，请使用以下 SQL 查询。

获取 SSH/RDP 流量的表格概览：

```sql
SELECT
srcaddr, dstaddr, account_id, action, protocol, bytes, log_status
FROM vpclogs
WHERE
srcport in (22, 3389)
OR
dstport IN (22, 3389)
ORDER BY start ASC;
```

获取已接受和已拒绝字节数的时间序列视图：

```sql
SELECT
from_unixtime(start), sum(bytes), action
FROM vpclogs
WHERE
srcport in (22,3389)
OR
dstport IN (22, 3389)
GROUP BY start, action
ORDER BY start ASC;
```

:::tip
    如果要限制在 Athena 中查询的数据量，请考虑使用 `$__timeFilter` 宏。
:::

要可视化 VPC 流日志数据，您可以导入示例 dashboard，
可通过 [vpcfl-sample-dashboard.json](./amg-athena-plugin/vpcfl-sample-dashboard.json) 获取，
效果如下：

![Screen shot of the VPC flow logs dashboard in AMG](../images/amg-vpcfl-dashboard.png)

从这里开始，您可以使用以下指南在 Amazon Managed Grafana 中创建自己的 dashboard：

* [用户指南：Dashboards](https://docs.aws.amazon.com/grafana/latest/userguide/dashboard-overview.html)
* [创建 dashboard 的最佳实践](https://grafana.com/docs/grafana/latest/best-practices/best-practices-for-creating-dashboards/)

以上就是全部内容，恭喜您已学会如何从 Grafana 使用 Athena！

## 清理

从您使用的 Athena 数据库中删除 OSM 数据，然后通过控制台删除 Amazon Managed Grafana 工作区。

[athena]: https://aws.amazon.com/athena/
[amg]: https://aws.amazon.com/grafana/
[athena-ds]: https://grafana.com/grafana/plugins/grafana-athena-datasource/
[aws-cli]: https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html
[aws-cli-conf]: https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html
[amg-getting-started]: https://aws.amazon.com/blogs/mt/amazon-managed-grafana-getting-started/
[awsod]: https://registry.opendata.aws/
[osm]: https://aws.amazon.com/blogs/big-data/querying-openstreetmap-with-amazon-athena/
[vpcflowlogs]: https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html
[createvpcfl]: https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs-s3.html#flow-logs-s3-create-flow-log
[athena-console]: https://console.aws.amazon.com/athena/
[amg-workspace]: https://console.aws.amazon.com/grafana/home#/workspaces
[parquet]: https://github.com/apache/parquet-format
