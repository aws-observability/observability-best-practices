# Amazon Managed Service for Prometheus

Amazon Managed Service for Prometheus のコストと使用量の視覚化により、個々の AWS アカウント、AWS リージョン、特定の Prometheus Workspace インスタンスに加え、RemoteWrite、Query、HourlyStorageMetering などのオペレーションのコストに関する洞察を得ることができます。

コストと使用量のデータを視覚化および分析するには、カスタム Athena ビューを作成する必要があります。

1. 進む前に、[実装の概要][cid-implement] で説明されている CUR (ステップ #1) を作成し、AWS Conformation テンプレート (ステップ #2) をデプロイしていることを確認してください。

2. 次に、以下のクエリを使用して新しい Amazon Athena [ビュー][view] を作成します。このクエリは、組織内のすべての AWS アカウントにわたる Amazon Managed Service for Prometheus のコストと使用量を取得します。

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

## Amazon Managed Grafana ダッシュボードを作成する

Amazon Managed Grafana では、Grafana ワークスペースコンソールの AWS データソース設定オプションを使用して、Athena をデータソースとして追加できます。この機能により、既存の Athena アカウントを検出し、Athena にアクセスするために必要な認証資格情報の設定を管理することで、Athena をデータソースとして追加するプロセスが簡素化されます。Athena データソースを使用する際の前提条件については、[前提条件][Prerequisites] を参照してください。

以下の **Grafana ダッシュボード** は、AWS Organizations 内のすべての AWS アカウントにわたる Amazon Managed Service for Prometheus のコストと使用量、個々の Prometheus Workspace インスタンスのコスト、および RemoteWrite、Query、HourlyStorageMetering などの操作のコストを示しています。

![prometheus-cost](../../../images/prometheus-cost.png)

Grafana のダッシュボードは、ダッシュボードのメタデータを格納する JSON オブジェクトで表されます。ダッシュボードのメタデータには、ダッシュボードのプロパティ、パネルのメタデータ、テンプレート変数、パネルのクエリなどが含まれます。上記のダッシュボードの JSON テンプレートは[こちら](AmazonPrometheus.json)からアクセスできます。

この前述のダッシュボードを使用すると、組織内の AWS アカウントにおける Amazon Managed Service for Prometheus のコストと使用量を特定できます。他の Grafana [ダッシュボードパネル][panels] を使用して、要件に合わせた視覚化を構築することができます。

[Prerequisites]: https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/Athena-prereq.html
[view]: https://athena-in-action.workshop.aws/30-basics/303-create-view.html
[panels]: https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/Grafana-panels.html
[cid-implement]: ../../../guides/cost/cost-visualization/cost.md#implementation
