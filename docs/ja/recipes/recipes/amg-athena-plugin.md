# Amazon Managed GrafanaでAthenaを使用する

このレシピでは、[Amazon Athena][athena]を[Amazon Managed Grafana][amg]で使用する方法を示します。Athena は、Amazon S3 のデータを標準 SQL を使用して分析できる、サーバーレスかつインタラクティブなクエリサービスです。この統合は、[Grafana 用 Athena データソース][athena-ds]によって実現されています。これはオープンソースのプラグインで、DIY Grafana インスタンスや Amazon Managed Grafana にプリインストールされています。

!!! note
    このガイドの完了には約 20 分かかります。

## 前提条件

* [AWS CLI][aws-cli] がインストールされ、環境に [設定][aws-cli-conf] されていること。
* アカウントから Amazon Athena にアクセスできること。

## インフラストラクチャ

まず、必要なインフラストラクチャをセットアップしましょう。

### Amazon Athenaの設定

Athenaを2つの異なるシナリオで使用する方法を見ていきましょう: 1つはGeomapプラグインを使用した地理データに関するシナリオ、もう1つはVPCフローログに関連するセキュリティの高いシナリオです。

まず、Athenaが設定され、データセットがロードされていることを確認しましょう。

!!! warning
    これらのクエリを実行するには、Amazon Athenaコンソールを使用する必要があります。Grafanaはデータソースへの読み取り専用アクセス権しかないため、データの作成や更新には使用できません。

#### 地理データの読み込み

この最初のユースケースでは、[AWS のオープンデータレジストリ][awsod] からデータセットを使用します。
具体的には、地理データをモチベーションとしたユースケースのために Athena プラグインの使用法を示すために、[OpenStreetMap][osm](OSM) を使用します。
そのためには、まず OSM データを Athena に取り込む必要があります。

そこで、まず Athena で新しいデータベースを作成します。 [Athena コンソール][athena-console] にアクセスし、以下の 3つの SQL クエリを使用して、OSM データをデータベースにインポートします。

クエリ1:

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

クエリ2:  

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

クエリ3:

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

</string,string></struct<type:></struct<ref:></string,string></struct<type:></struct<ref:></string,string>

#### VPC フローログデータの読み込み

2つ目のユースケースは、セキュリティを目的としたものです。[VPC Flow Logs][vpcflowlogs] を使用したネットワークトラフィックの分析です。

まず、EC2 に VPC フローログを生成させる必要があります。
したがって、まだ行っていない場合は、ネットワークインターフェイスレベル、サブネットレベル、VPC レベルのいずれかで [VPC フローログを作成][createvpcfl] します。

!!! note
    クエリパフォーマンスを向上させ、ストレージフットプリントを最小限に抑えるために、VPC フローログを [Parquet][parquet] というネストされたデータをサポートする列指向のストレージフォーマットに格納します。

当社のセットアップでは、ネットワークインターフェイス、サブネット、VPC のどのオプションを選択しても問題ありません。
下図のように Parquet 形式で S3 バケットにパブリッシュする限りです。

![EC2 コンソールの「フローログの作成」パネルのスクリーンショット](../images/ec2-vpc-flowlogs-creation.png)

次に、[Athena コンソール][athena-console] を介して、OSM データをインポートしたのと同じデータベース、または必要に応じて新しいデータベースに、VPC フローログデータのテーブルを作成します。

次の SQL クエリを使用し、`VPC_FLOW_LOGS_LOCATION_IN_S3` を独自のバケット/フォルダに置き換えていることを確認してください。


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

たとえば、S3 バケット `allmyflowlogs` を使用している場合、`VPC_FLOW_LOGS_LOCATION_IN_S3` は次のようになります。

```
s3://allmyflowlogs/AWSLogs/12345678901/vpcflowlogs/eu-west-1/2021/
```

Athena でデータセットが利用可能になったので、Grafana に進みましょう。

### Grafanaの設定

Grafanaインスタンスが必要なので、たとえば[Getting Started][amg-getting-started]ガイドを使用して、新しい[Amazon Managed Grafanaワークスペース][amg-workspace]を設定するか、既存のものを使用します。

!!! warning
    AWSデータソース構成を使用するには、まずAmazon Managed Grafanaコンソールに移動して、Athenaリソースを読み取るために必要なIAMポリシーをワークスペースに付与するサービス管理IAMロールを有効にします。
    さらに、次の点に注意してください。

	1. 使用する予定のAthenaワークグループは、キー`GrafanaDataSource`と値`true`でタグ付けする必要があります。これは、サービス管理されたアクセス許可でワークグループを使用できるようにするためです。
	1. サービス管理されたIAMポリシーは、`grafana-athena-query-results-`で始まるクエリ結果バケットへのアクセスのみを許可するので、その他のバケットの場合はアクセス許可を手動で追加する必要があります。
	1. クエリ対象の基礎となるデータソースへの`s3:Get*`および`s3:List*`アクセス許可は手動で追加する必要があります。


Athenaデータソースの設定には、左側のツールバーから下のAWSアイコンを選択し、「Athena」を選択します。プラグインがAthenaデータソースの検出に使用するデフォルトリージョンを選択し、使用したいアカウントを選択して、最後に「データソースの追加」を選択します。

あるいは、次の手順に従ってAthenaデータソースを手動で追加および構成できます。

1. 左側のツールバーの「構成」アイコンをクリックし、「データソースの追加」をクリックします。 
1. 「Athena」と入力します。
1. [オプション] 認証プロバイダーの構成(推奨: ワークスペースIAMロール)
1. ターゲットのAthenaデータソース、データベース、ワークグループを選択します。 
1. ワークグループに出力ロケーションがまだ構成されていない場合は、クエリ結果に使用するS3バケットとフォルダを指定します。 サービス管理ポリシーからメリットを得るには、バケット名が `grafana-athena-query-results-` で始まる必要があることに注意してください。
1. 「保存してテスト」をクリックします。

次のような画面が表示されるはずです。

![Athenaデータソース構成のスクリーンショット](../images/amg-plugin-athena-ds.png)

## 使い方

次に、Grafana から Athena データセットを使う方法を見ていきましょう。

### 地理データの利用

Athena の [OpenStreetMap][osm](OSM) データを使用すると、「ある施設がどこにあるか」など、さまざまな質問に答えることができます。その実際の使用例を見ていきましょう。

たとえば、ラスベガス地域の飲食店をリストするための OSM データセットに対する SQL クエリは次のとおりです。

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

!!!info
    上記のクエリでは、ラスベガス地域は緯度が `36.1` から `36.3` の間、経度が `-115.5` から `-114.5` の間の領域として定義されています。
	これを変数のセット(各コーナーごとに 1 つ)に変換し、Geomap プラグインを他の地域に適応させることができます。

上記のクエリを使用して OSM データを可視化するには、次のような [osm-sample-dashboard.json](./amg-athena-plugin/osm-sample-dashboard.json) からサンプルダッシュボードをインポートできます。

![AMG の OSM ダッシュボードのスクリーンショット](../images/amg-osm-dashboard.png)

!!!note
    上記のスクリーンショットでは、左パネルの Geomap 可視化を使用してデータポイントをプロットしています。

### VPC フローログデータの利用

VPC フローログデータを分析し、SSH と RDP のトラフィックを検出するには、
次の SQL クエリを使用します。

SSH/RDP トラフィックの表形式の概要を取得:

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

受け入れられたバイトと拒否されたバイトの時系列ビューを取得:

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

!!! tip
    Athena でクエリするデータ量を制限する場合は、
    `$__timeFilter` マクロを使用することを検討してください。

VPC フローログデータを視覚化するには、
[vpcfl-sample-dashboard.json](./amg-athena-plugin/vpcfl-sample-dashboard.json) 
からインポートできるサンプルダッシュボードを使用できます。
そのダッシュボードは次のようになります:

![AMG の VPC フローログダッシュボードのスクリーンショット](../images/amg-vpcfl-dashboard.png)

ここから、Amazon Managed Grafana で独自のダッシュボードを作成するために、
次のガイドを使用できます:

* [ユーザーガイド: ダッシュボード](https://docs.aws.amazon.com/grafana/latest/userguide/dashboard-overview.html)
* [ダッシュボード作成のベストプラクティス](https://grafana.com/docs/grafana/latest/best-practices/best-practices-for-creating-dashboards/)

以上で、Grafana から Athena を使用する方法を学ぶことができました。お疲れさまでした。

## クリーンアップ

使用していた Athena データベースから OSM データを削除し、コンソールから Amazon Managed Grafana ワークスペースを削除します。

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
