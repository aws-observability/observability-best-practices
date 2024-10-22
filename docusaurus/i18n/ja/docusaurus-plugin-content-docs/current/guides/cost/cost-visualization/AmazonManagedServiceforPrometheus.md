# リアルタイムコスト監視

Amazon Managed Service for Prometheus は、コンテナメトリクスのサーバーレス、Prometheus 互換のモニタリングサービスで、大規模なコンテナ環境をセキュアに監視することが容易になります。Amazon Managed Service for Prometheus の価格モデルは、インジェストされたメトリクスサンプル、処理されたクエリサンプル、保存されたメトリクスに基づいています。最新の価格詳細は[こちら][pricing]で確認できます。

マネージドサービスとして、Amazon Managed Service for Prometheus は、ワークロードの増減に応じて、運用メトリクスのインジェスト、ストレージ、クエリを自動的にスケーリングします。一部のお客様から、`メトリクスサンプルのインジェスト率` とそのコストをリアルタイムで追跡する方法についてご質問をいただきました。それではその実現方法を探ってみましょう。

### ソリューション
Amazon Managed Service for Prometheus は、[ベンダーメトリクス][vendedmetrics] を Amazon CloudWatch に提供します。これらのメトリクスを使用すると、Amazon Managed Service for Prometheus ワークスペースの可視性を高めることができます。ベンダーメトリクスは CloudWatch の `AWS/Usage` と `AWS/Prometheus` 名前空間で確認でき、これらの [メトリクス][AMPMetrics] は CloudWatch で追加料金なしで利用できます。CloudWatch ダッシュボードを作成して、これらのメトリクスを詳しく調べ、可視化することができます。

今日は、Amazon CloudWatch を Amazon Managed Grafana のデータソースとして使用し、Grafana でそれらのメトリクスを可視化するダッシュボードを作成します。アーキテクチャ図は以下のことを示しています。

- Amazon Managed Service for Prometheus が Amazon CloudWatch にベンダーメトリクスを公開している

- Amazon CloudWatch が Amazon Managed Grafana のデータソースになっている

- ユーザーが Amazon Managed Grafana で作成したダッシュボードにアクセスしている

![prometheus-ingestion-rate](../../../images/ampmetricsingestionrate.png)

### Amazon Managed Grafana のダッシュボード

Amazon Managed Grafana で作成されたダッシュボードにより、以下の内容を可視化できます。

1. ワークスペース別の Prometheus インジェスト率
![prometheus-ingestion-rate-dash1](../../../images/ampwsingestionrate-1.png)

2. ワークスペース別の Prometheus インジェスト率とリアルタイムコスト
リアルタイムコスト追跡には、公式の [AWS 料金ドキュメント][pricing] に記載されている `First 2 billion samples` の `Metrics Ingested Tier` の価格に基づいた `math expression` を使用します。数値と時系列データを入力として受け取り、別の数値と時系列データに変換する数学演算で、ビジネス要件に合わせてさらにカスタマイズする場合は、この[ドキュメント][mathexpression]を参照してください。
![prometheus-ingestion-rate-dash2](../../../images/ampwsingestionrate-2.png)

3. ワークスペース別の Prometheus アクティブシリーズ
![prometheus-ingestion-rate-dash3](../../../images/ampwsingestionrate-3.png)

Grafana のダッシュボードは JSON オブジェクトで表され、ダッシュボードのメタデータが格納されます。ダッシュボードのメタデータには、ダッシュボードのプロパティ、パネルのメタデータ、テンプレート変数、パネルのクエリなどが含まれます。

上記のダッシュボードの **JSON テンプレート** は<mark>[こちら](AmazonPrometheusMetrics.json)からアクセスできます。</mark>

このダッシュボードを使用すると、Amazon Managed Service for Prometheus のメトリクスインジェスト率に基づいて、ワークスペース別のインジェスト率とリアルタイムコストを監視できます。他の Grafana の[ダッシュボードパネル][panels]を使用して、要件に合わせた可視化を構築することができます。

[pricing]: https://aws.amazon.com/jp/prometheus/pricing/
[AMPMetrics]: https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/AMP-CW-usage-metrics.html
[vendedmetrics]: https://aws.amazon.com/blogs/mt/introducing-vended-metrics-for-amazon-managed-service-for-prometheus/
[mathexpression]: https://grafana.com/docs/grafana/latest/panels-visualizations/query-transform-data/expression-queries/#math
[panels]: https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/Grafana-panels.html
