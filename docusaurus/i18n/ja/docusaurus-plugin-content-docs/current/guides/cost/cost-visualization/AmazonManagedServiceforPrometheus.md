# リアルタイムコスト監視

Amazon Managed Service for Prometheus は、コンテナメトリクス用のサーバーレスで Prometheus 互換の監視サービスで、大規模なコンテナ環境を安全に監視することを容易にします。Amazon Managed Service for Prometheus の価格モデルは、取り込まれたメトリクスサンプル、処理されたクエリサンプル、保存されたメトリクスに基づいています。最新の価格詳細は[こちら][pricing]で確認できます。

マネージドサービスとして、Amazon Managed Service for Prometheus は、ワークロードのスケールアップとダウンに応じて、運用メトリクスの取り込み、保存、クエリを自動的にスケールします。一部のお客様から、`メトリクスサンプルの取り込みレート`とそのコストをリアルタイムで追跡する方法についてのガイダンスを求められました。それを実現する方法を探ってみましょう。



### 解決策
Amazon Managed Service for Prometheus は [ベンダーメトリクス][vendedmetrics] を Amazon CloudWatch に提供します。これらのメトリクスを使用することで、Amazon Managed Service for Prometheus ワークスペースの可視性を向上させることができます。ベンダーメトリクスは CloudWatch の `AWS/Usage` および `AWS/Prometheus` 名前空間で見つけることができ、これらの [メトリクス][AMPMetrics] は追加料金なしで CloudWatch で利用可能です。CloudWatch ダッシュボードを作成して、これらのメトリクスをさらに探索し視覚化することもできます。

今日は、Amazon CloudWatch を Amazon Managed Grafana のデータソースとして使用し、Grafana でダッシュボードを構築してこれらのメトリクスを視覚化します。アーキテクチャ図は以下を示しています。

- Amazon Managed Service for Prometheus が Amazon CloudWatch にベンダーメトリクスを公開する

- Amazon CloudWatch が Amazon Managed Grafana のデータソースとなる

- ユーザーが Amazon Managed Grafana で作成されたダッシュボードにアクセスする

![prometheus-ingestion-rate](../../../images/ampmetricsingestionrate.png)



### Amazon Managed Grafana ダッシュボード

Amazon Managed Grafana で作成されたダッシュボードでは、以下を可視化できます：

1. ワークスペースごとの Prometheus 取り込みレート
![prometheus-ingestion-rate-dash1](../../../images/ampwsingestionrate-1.png)

2. ワークスペースごとの Prometheus 取り込みレートとリアルタイムコスト
   リアルタイムのコスト追跡には、公式の [AWS 料金ドキュメント][pricing] に記載されている「最初の 20 億サンプル」の「取り込まれたメトリクス層」の価格に基づいた `数式` を使用します。数式の操作は、数値と時系列を入力として受け取り、それらを異なる数値と時系列に変換します。ビジネス要件に合わせてさらにカスタマイズする場合は、この [ドキュメント][mathexpression] を参照してください。
![prometheus-ingestion-rate-dash2](../../../images/ampwsingestionrate-2.png)

3. ワークスペースごとの Prometheus アクティブシリーズ
![prometheus-ingestion-rate-dash3](../../../images/ampwsingestionrate-3.png)

Grafana のダッシュボードは JSON オブジェクトで表現され、そのダッシュボードのメタデータを保存します。ダッシュボードのメタデータには、ダッシュボードのプロパティ、パネルからのメタデータ、テンプレート変数、パネルクエリなどが含まれます。

上記ダッシュボードの **JSON テンプレート** には <mark>[ここ](AmazonPrometheusMetrics.json)</mark> からアクセスできます。

前述のダッシュボードを使用することで、ワークスペースごとの取り込みレートを特定し、Amazon Managed Service for Prometheus のメトリクス取り込みレートに基づいてワークスペースごとのリアルタイムコストを監視できるようになりました。他の Grafana [ダッシュボードパネル][panels] を使用して、要件に合わせたビジュアルを構築することができます。

[pricing]: https://aws.amazon.com/jp/prometheus/pricing/
[AMPMetrics]: https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/AMP-CW-usage-metrics.html
[vendedmetrics]: https://aws.amazon.com/blogs/mt/introducing-vended-metrics-for-amazon-managed-service-for-prometheus/
[mathexpression]: https://grafana.com/docs/grafana/latest/panels-visualizations/query-transform-data/expression-queries/#math
[panels]: https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/Grafana-panels.html
