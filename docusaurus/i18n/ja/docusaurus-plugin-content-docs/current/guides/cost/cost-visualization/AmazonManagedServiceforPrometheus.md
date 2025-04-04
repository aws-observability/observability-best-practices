# リアルタイムのコスト監視

Amazon Managed Service for Prometheus は、コンテナメトリクスのためのサーバーレスな Prometheus 互換の監視サービスで、大規模なコンテナ環境を安全に監視することを容易にします。Amazon Managed Service for Prometheus の料金モデルは、取り込まれたメトリクスサンプル、処理されたクエリサンプル、保存されたメトリクスに基づいています。最新の料金の詳細は[こちら][pricing]で確認できます。

マネージドサービスとして、Amazon Managed Service for Prometheus は、ワークロードのスケールアップとダウンに応じて、運用メトリクスの取り込み、保存、クエリを自動的にスケールします。一部のお客様から、`metric samples ingestion rate` とそのコストをリアルタイムで追跡する方法についてのガイダンスを求められました。それを実現する方法を見ていきましょう。



### 解決策
Amazon Managed Service for Prometheus は [ベンダーメトリクス][vendedmetrics] を Amazon CloudWatch に提供します。これらのメトリクスを使用することで、Amazon Managed Service for Prometheus ワークスペースの可視性を向上させることができます。
ベンダーメトリクスは CloudWatch の `AWS/Usage` および `AWS/Prometheus` 名前空間で確認でき、これらの [メトリクス][AMPMetrics] は追加料金なしで CloudWatch で利用できます。
CloudWatch ダッシュボードを作成して、これらのメトリクスをさらに探索し、視覚化することができます。

今日は、Amazon CloudWatch を Amazon Managed Grafana のデータソースとして使用し、Grafana でこれらのメトリクスを視覚化するためのダッシュボードを構築します。
アーキテクチャ図は以下を示しています。

- Amazon Managed Service for Prometheus から Amazon CloudWatch へのベンダーメトリクスの提供

- Amazon Managed Grafana のデータソースとしての Amazon CloudWatch

- Amazon Managed Grafana で作成されたダッシュボードへのユーザーアクセス

![prometheus-ingestion-rate](../../../images/ampmetricsingestionrate.png)



### Amazon Managed Grafana ダッシュボード

Amazon Managed Grafana で作成されたダッシュボードでは、以下を可視化できます。

1. ワークスペースごとの Prometheus 取り込みレート  
![prometheus-ingestion-rate-dash1](../../../images/ampwsingestionrate-1.png)  

2. ワークスペースごとの Prometheus 取り込みレートとリアルタイムコスト  
   リアルタイムのコスト追跡には、公式の [AWS 料金ドキュメント][pricing] に記載されている「最初の 20 億サンプル」の「メトリクス取り込み層」の料金に基づいた `math expression` を使用します。数式演算は、数値と時系列を入力として受け取り、それらを異なる数値と時系列に変換します。ビジネス要件に合わせてさらにカスタマイズする場合は、この[ドキュメント][mathexpression]を参照してください。  
![prometheus-ingestion-rate-dash2](../../../images/ampwsingestionrate-2.png)  

3. ワークスペースごとの Prometheus アクティブシリーズ  
![prometheus-ingestion-rate-dash3](../../../images/ampwsingestionrate-3.png)

Grafana のダッシュボードは JSON オブジェクトで表現され、そのダッシュボードのメタデータが保存されます。
ダッシュボードのメタデータには、ダッシュボードのプロパティ、パネルからのメタデータ、テンプレート変数、パネルクエリなどが含まれます。

上記ダッシュボードの **JSON テンプレート**には<mark>[こちら](AmazonPrometheusMetrics.json)</mark>からアクセスできます。

このダッシュボードを使用することで、ワークスペースごとの取り込みレートを特定し、メトリクス取り込みレートに基づいてワークスペースごとのリアルタイムコストを監視できるようになります。
要件に合わせた視覚化を構築するために、他の Grafana [ダッシュボードパネル][panels] を使用することもできます。

[pricing]: https://aws.amazon.com/jp/prometheus/pricing/
[AMPMetrics]: https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/AMP-CW-usage-metrics.html
[vendedmetrics]: https://aws.amazon.com/blogs/mt/introducing-vended-metrics-for-amazon-managed-service-for-prometheus/
[mathexpression]: https://grafana.com/docs/grafana/latest/panels-visualizations/query-transform-data/expression-queries/#math
[panels]: https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/Grafana-panels.html
