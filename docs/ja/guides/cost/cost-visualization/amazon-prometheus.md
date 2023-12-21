# Amazon Managed Service for Prometheus

Amazon Managed Service for Prometheus のコストと使用状況のビジュアルにより、個々の AWS アカウント、AWS リージョン、RemoteWrite、Query、HourlyStorageMetering などの特定の Prometheus ワークスペースインスタンスとその操作のコストの洞察を得ることができます。

コストと使用状況データを視覚化および分析するには、カスタム Athena ビューを作成する必要があります。

1. 進める前に、[実装の概要][cid-implement] で言及されている CUR (ステップ #1) を作成し、AWS 準拠テンプレート (ステップ #2) をデプロイしたことを確認してください。

2. 次に、以下のクエリを使用して、新しい Amazon Athena [ビュー][view] を作成します。このクエリは、Organization のすべての AWS アカウントにわたる Amazon Managed Service for Prometheus のコストと使用状況を取得します。

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

## Amazon Managed Grafana ダッシュボードの作成

Amazon Managed Grafana を使用すると、Grafana ワークスペースコンソールの AWS データソース構成オプションを使用して、Athena をデータソースとして追加できます。この機能により、既存の Athena アカウントを検出し、Athena へのアクセスに必要な認証情報の構成を管理することで、Athena をデータソースとして簡単に追加できます。Athena データソースを使用するための前提条件については、[前提条件][Prerequisites] を参照してください。


以下の **Grafana ダッシュボード** は、AWS Organizations のすべての AWS アカウントにおける Amazon Managed Service for Prometheus のコストと使用状況を、個々の Prometheus ワークスペースインスタンスのコストや RemoteWrite、Query、HourlyStorageMetering などのオペレーションとともに示しています。

![prometheus-cost](../../../images/prometheus-cost.png)

Grafana のダッシュボードは JSON オブジェクトで表され、ダッシュボードのメタデータが格納されます。ダッシュボードのメタデータには、ダッシュボードのプロパティ、パネルのメタデータ、テンプレート変数、パネルクエリなどが含まれます。上記のダッシュボードの JSON テンプレートにアクセスするには、[こちら](AmazonPrometheus.json) を参照してください。

上記のダッシュボードを使用することで、Organization 全体の AWS アカウントにおける Amazon Managed Service for Prometheus のコストと使用状況を特定できるようになりました。要件に合わせてビジュアルを構築するために、他の Grafana [ダッシュボードパネル][panels] を使用できます。

[前提条件]: https://docs.aws.amazon.com/grafana/latest/userguide/Athena-prereq.html
[view]: https://athena-in-action.workshop.aws/30-basics/303-create-view.html
[panels]: https://docs.aws.amazon.com/grafana/latest/userguide/Grafana-panels.html
[cid-implement]: ../../../guides/cost/cost-visualization/cost.md#implementation
