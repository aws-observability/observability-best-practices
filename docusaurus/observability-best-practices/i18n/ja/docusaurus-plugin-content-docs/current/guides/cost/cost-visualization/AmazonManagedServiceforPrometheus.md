# リアルタイムコストモニタリング

Amazon Managed Service for Prometheus は、サーバーレスの Prometheus 互換のコンテナメトリクスモニタリングサービスで、大規模なコンテナ環境を安全にモニタリングするのが容易になります。Amazon Managed Service for Prometheus の料金モデルは、取り込まれたメトリクスサンプル、処理されたクエリサンプル、保存されたメトリクスに基づいています。 最新の料金の詳細は[こちら][pricing] で確認できます。

マネージドサービスとして、Amazon Managed Service for Prometheus は、ワークロードがスケールアップおよびスケールダウンするにつれて、運用メトリクスの取り込み、保存、クエリを自動的にスケールします。 一部のお客様からは、`メトリクスサンプルの取り込みレート` とそのコストをリアルタイムで追跡する方法についてご質問をいただいています。 その実現方法を探っていきましょう。

### ソリューション

Amazon Managed Service for Prometheus は、[ベンダーメトリクス][vendedmetrics]として使用状況メトリクスを Amazon CloudWatch に送信します。 これらのメトリクスを使用することで、Amazon Managed Service for Prometheus ワークスペースの可視性を高めるのに役立ちます。 ベンダーメトリクスは、CloudWatch の `AWS/Usage` および `AWS/Prometheus` 名前空間で確認できます。また、これらの[メトリクス][AMPMetrics]は、CloudWatch で追加料金なしで利用できます。 必要に応じて、これらのメトリクスをさらに調査および可視化するための CloudWatch ダッシュボードを作成できます。

本日は、Amazon Managed Grafana のデータソースとして Amazon CloudWatch を使用し、Grafana でダッシュボードを構築して、それらのメトリクスを可視化します。 アーキテクチャ図は、以下を示しています。

- Amazon Managed Service for Prometheus がベンダーメトリクスを Amazon CloudWatch にパブリッシュ
- Amazon Managed Grafana のデータソースとしての Amazon CloudWatch
- Amazon Managed Grafana で作成されたダッシュボードにアクセスするユーザー

![prometheus-ingestion-rate](../../../images/ampmetricsingestionrate.png)

### Amazon Managed Grafana ダッシュボード

Amazon Managed Grafana で作成されたダッシュボードにより、以下を視覚化できます。

1. ワークスペースごとの Prometheus インジェストレート  
![prometheus-ingestion-rate-dash1](../../../images/ampwsingestionrate-1.png)

2. ワークスペースごとの Prometheus インジェストレートとリアルタイムコスト  
   リアルタイムコストの追跡には、公式の [AWS 料金表][pricing] に記載されている `First 2 billion samples` の `Metrics Ingested Tier` の料金を基にした `数式` を使用します。数式は数値と時系列を入力として受け取り、異なる数値と時系列に変換します。ビジネス要件に合わせてさらにカスタマイズする場合は、この [ドキュメント][mathexpression] を参照してください。
![prometheus-ingestion-rate-dash2](../../../images/ampwsingestionrate-2.png)

3. ワークスペースごとの Prometheus アクティブシリーズ  
![prometheus-ingestion-rate-dash3](../../../images/ampwsingestionrate-3.png)


Grafana のダッシュボードは JSON オブジェクトで表され、ダッシュボードのメタデータが格納されます。ダッシュボードのメタデータには、ダッシュボードのプロパティ、パネルのメタデータ、テンプレート変数、パネルクエリなどが含まれます。

上記のダッシュボードの **JSON テンプレート** は [こちら](AmazonPrometheusMetrics.json) からアクセスできます。

このダッシュボードにより、ワークスペースごとのインジェストレートを特定し、メトリクスインジェストレートに基づいてワークスペースごとのリアルタイムコストを監視できるようになります。要件に合わせて視覚化を構築するために、他の Grafana [ダッシュボードパネル][panels] を使用できます。

[pricing]: https://aws.amazon.com/prometheus/pricing/
[AMPMetrics]: https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-CW-usage-metrics.html 
[vendedmetrics]: https://aws.amazon.com/blogs/mt/introducing-vended-metrics-for-amazon-managed-service-for-prometheus/
[mathexpression]: https://grafana.com/docs/grafana/latest/panels-visualizations/query-transform-data/expression-queries/#math
[panels]: https://docs.aws.amazon.com/grafana/latest/userguide/Grafana-panels.html
