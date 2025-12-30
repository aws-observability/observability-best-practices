# Amazon Managed Service for Prometheus

Amazon Managed Service for Prometheus のコストと使用状況のビジュアルにより、個々の AWS アカウント、AWS リージョン、特定の Prometheus ワークスペースインスタンスのコスト、および RemoteWrite、Query、HourlyStorageMetering などのオペレーションに関する洞察を得ることができます。

コストと使用状況データを可視化および分析するには、カスタム Athena ビューを作成する必要があります。

1. 続行する前に、[実装の概要][cid-implement]に記載されている CUR の作成（ステップ #1）と AWS CloudFormation テンプレートのデプロイ（ステップ #2）が完了していることを確認してください。

2. 次に、以下のクエリを使用して新しい Amazon Athena [ビュー][view]を作成します。このクエリは、組織内のすべての AWS アカウントにわたる Amazon Managed Service for Prometheus のコストと使用状況を取得します。

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

Amazon Managed Grafana では、Grafana ワークスペースコンソールの AWS データソース設定オプションを使用して、Athena をデータソースとして追加できます。この機能により、既存の Athena アカウントを検出し、Athena へのアクセスに必要な認証情報の設定を管理することで、Athena をデータソースとして追加する作業が簡素化されます。Athena データソースの使用に関連する前提条件については、[前提条件][Prerequisites]を参照してください。

以下の **Grafana ダッシュボード**は、AWS Organizations 内のすべての AWS アカウントにおける Amazon Managed Service for Prometheus のコストと使用状況、および個々の Prometheus Workspace インスタンスのコストと、RemoteWrite、Query、HourlyStorageMetering などのオペレーションを表示します。 

![prometheus-cost](../../../images/prometheus-cost.png)

Grafana のダッシュボードは JSON オブジェクトで表され、ダッシュボードのメタデータが保存されます。ダッシュボードのメタデータには、ダッシュボードのプロパティ、パネルのメタデータ、テンプレート変数、パネルクエリなどが含まれます。上記のダッシュボードの JSON テンプレートには[こちら](AmazonPrometheus.json)からアクセスできます。

前述のダッシュボードを使用することで、組織全体の AWS アカウントにおける Amazon Managed Service for Prometheus のコストと使用状況を特定できるようになりました。他の Grafana [ダッシュボードパネル][panels]を使用して、要件に合わせたビジュアルを構築できます。

[Prerequisites]: https://docs.aws.amazon.com/grafana/latest/userguide/Athena-prereq.html
[view]: https://athena-in-action.workshop.aws/30-basics/303-create-view.html
[panels]: https://docs.aws.amazon.com/grafana/latest/userguide/Grafana-panels.html
[cid-implement]: ../../../guides/cost/cost-visualization/cost.md#implementation