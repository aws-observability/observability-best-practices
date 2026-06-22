# Amazon Managed Grafana で Athena を使用する

このレシピでは、[Amazon Athena][athena]（標準 SQL を使用して Amazon S3 のデータを分析できるサーバーレスのインタラクティブなクエリサービス）を [Amazon Managed Grafana][amg] で使用する方法を説明します。この統合は、[Grafana 用 Athena データソース][athena-ds]によって実現されています。これは、任意の DIY Grafana インスタンスで使用できるオープンソースプラグインであり、Amazon Managed Grafana にはプリインストールされています。

:::note
    このガイドは完了まで約 20 分かかります。
:::

## 前提条件

* [AWS CLI][aws-cli] がインストールされ、環境内で[設定][aws-cli-conf]されています。
* アカウントから Amazon Athena にアクセスできます。

## インフラストラクチャ

まず、必要なインフラストラクチャをセットアップしましょう。

### Amazon Athena をセットアップする

Athena を 2 つの異なるシナリオで使用する方法を見ていきます。1 つは Geomap プラグインを使用した地理データに関するシナリオ、もう 1 つは VPC フローログに関するセキュリティ関連のシナリオです。

まず、Athena が設定され、データセットが読み込まれていることを確認しましょう。

:::warning
    これらのクエリを実行するには、Amazon Athena コンソールを使用する必要があります。Grafana は一般的にデータソースへの読み取り専用アクセス権を持つため、データの作成や更新には使用できません。
:::

#### 地理データの読み込み

この最初のユースケースでは、[Registry of Open Data on AWS][awsod] のデータセットを使用します。
具体的には、[OpenStreetMap][osm] (OSM) を使用して、地理データを活用したユースケースにおける Athena プラグインの使用方法を実演します。
これを機能させるには、まず OSM データを Athena に取り込む必要があります。

まず、Athena で新しいデータベースを作成します。[Athena コンソール][athena-console]に移動し、次の 3 つの SQL クエリを使用して OSM データをデータベースにインポートします。

クエリ 1:

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

クエリ 2:

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

クエリ 3:

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

#### VPC フローログデータを読み込む

2 番目のユースケースはセキュリティを目的としたもので、[VPC Flow Logs][vpcflowlogs] を使用してネットワークトラフィックを分析します。

まず、VPC Flow Logs を生成するように EC2 に指示する必要があります。まだ実行していない場合は、ネットワークインターフェイスレベル、サブネットレベル、または VPC レベルで [VPC フローログを作成][createvpcfl]してください。

:::note
    クエリのパフォーマンスを向上させ、ストレージのフットプリントを最小限に抑えるために、VPC フローログをネストされたデータをサポートする列指向ストレージ形式である [Parquet][parquet] に保存します。
:::

今回のセットアップでは、どのオプションを選択しても (ネットワークインターフェイス、サブネット、または VPC)、以下に示すように Parquet 形式で S3 バケットに発行する限り、問題ありません。

![Screen shot of the EC2 console "Create flow log" panel](../images/ec2-vpc-flowlogs-creation.png)

次に、再度 [Athena コンソール][athena-console]を使用して、OSM データをインポートしたのと同じデータベースに VPC フローログデータのテーブルを作成するか、必要に応じて新しいデータベースを作成します。

次の SQL クエリを使用し、必ず置き換えてください
`VPC_FLOW_LOGS_LOCATION_IN_S3` 独自のバケット/フォルダーを使用します。


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

たとえば、 `VPC_FLOW_LOGS_LOCATION_IN_S3` S3 バケットを使用している場合、次のようになります `allmyflowlogs`:

```
s3://allmyflowlogs/AWSLogs/12345678901/vpcflowlogs/eu-west-1/2021/
```

データセットが Athena で利用可能になったので、Grafana に移りましょう。

### Grafana をセットアップする

Grafana インスタンスが必要なので、新しい [Amazon Managed Grafana ワークスペース][amg-workspace]をセットアップしてください。たとえば、[Getting Started][amg-getting-started] ガイドを使用するか、既存のものを使用します。

:::warning
    AWS データソース設定を使用するには、まず Amazon Managed Grafana コンソールに移動して、ワークスペースに Athena リソースを読み取るために必要な IAM ポリシーを付与するサービスマネージド IAM ロールを有効にします。
    さらに、以下の点に注意してください。

1. 使用する予定の Athena ワークグループには、キーでタグ付けする必要があります 
	`GrafanaDataSource` と値 `true` サービスマネージド型の権限が
	ワークグループの使用を許可されるようにします。
	1. サービスマネージド型の IAM ポリシーは、次で始まる
	クエリ結果バケットへのアクセスのみを許可します `grafana-athena-query-results-`、そのため他のバケットについては手動でアクセス許可を追加する必要があります。
	1. 次を追加する必要があります `s3:Get*` および `s3:List*` クエリ対象の基盤となるデータソースの権限を手動で設定します。
:::




Athena データソースを設定するには、左側のツールバーを使用して下部の AWS アイコンを選択し、「Athena」を選択します。プラグインが使用する Athena データソースを検出するデフォルトのリージョンを選択し、必要なアカウントを選択して、最後に「Add data source」を選択します。

あるいは、次の手順に従って、Athena データソースを手動で追加および設定できます。

1. 左側のツールバーにある「Configurations」アイコンをクリックし、次に「Add data source」をクリックします。
1. 「Athena」を検索します。
1. [オプション] 認証プロバイダーを設定します（推奨：ワークスペース IAM ロール）。
1. ターゲットとする Athena データソース、データベース、ワークグループを選択します。
1. ワークグループに出力場所がまだ設定されていない場合は、クエリ結果に使用する S3 バケットとフォルダを指定します。バケットは次で始まる必要があることに注意してください `grafana-athena-query-results-` サービスマネージド型ポリシーの恩恵を受けたい場合。
1. 「Save & test」をクリックします。

次のような内容が表示されます。

![Screen shot of the Athena data source config](../images/amg-plugin-athena-ds.png)




## 使用方法

それでは、Grafana から Athena データセットを使用する方法を見ていきましょう。

### 地理データを使用する

Athena の [OpenStreetMap][osm] (OSM) データは、「特定のアメニティがどこにあるか」などの多くの質問に答えることができます。実際に見てみましょう。

たとえば、ラスベガス地域で食事を提供する場所をリストするための OSM データセットに対する SQL クエリは次のとおりです。

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
    上記のクエリにおけるラスベガスリージョンは、緯度が次の範囲にあるすべてのものとして定義されています `36.1` および `36.3` 経度は次の範囲内である必要があります `-115.5` および `-114.5`.
	これを変数のセット (各コーナーに 1 つずつ) に変換し、Geomap プラグインを他のリージョンに適応できるようにすることができます。
:::
上記のクエリを使用して OSM データを可視化するには、[osm-sample-dashboard.json](./amg-athena-plugin/osm-sample-dashboard.json) から利用可能なサンプルダッシュボードをインポートできます。次のように表示されます。

![Screen shot of the OSM dashboard in AMG](../images/amg-osm-dashboard.png)

:::note
    上記のスクリーンショットでは、Geomap ビジュアライゼーション（左側のパネル）を使用してデータポイントをプロットしています。
:::
### VPC フローログデータを使用する

VPC フローログデータを分析し、SSH および RDP トラフィックを検出するには、次の SQL クエリを使用します。

SSH/RDP トラフィックの表形式の概要を取得します。

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

受け入れられたバイト数と拒否されたバイト数の時系列ビューを取得します。

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
    Athena でクエリされるデータ量を制限したい場合は、次の使用を検討してください `$__timeFilter` マクロ。
:::

VPC フローログデータを可視化するには、[vpcfl-sample-dashboard.json](./amg-athena-plugin/vpcfl-sample-dashboard.json) から利用可能なサンプルダッシュボードをインポートできます。次のように表示されます。

![Screen shot of the VPC flow logs dashboard in AMG](../images/amg-vpcfl-dashboard.png)

ここから、以下のガイドを使用して Amazon Managed Grafana で独自のダッシュボードを作成できます。

* [ユーザーガイド: ダッシュボード](https://docs.aws.amazon.com/grafana/latest/userguide/dashboard-overview.html)
* [ダッシュボード作成のベストプラクティス](https://grafana.com/docs/grafana/latest/best-practices/best-practices-for-creating-dashboards/)

これで完了です。おめでとうございます。Grafana から Athena を使用する方法を学習しました。

## クリーンアップ

使用していた Athena データベースから OSM データを削除し、次にコンソールから削除することで Amazon Managed Grafana ワークスペースを削除します。

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
