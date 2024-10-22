# AWS Distro for Open Telemetry (ADOT) - FAQ

1. **ADOT コレクターを使って AMP にメトリクスを取り込むことはできますか?**
    はい、2022年5月のメトリクスサポートの GA リリースで、この機能が導入されました。EC2、EKS アドオン、ECS サイドカーインテグレーション、Lambda レイヤーから ADOT コレクターを使用できます。
2. **ADOT コレクターを使ってログを収集し、Amazon CloudWatch または Amazon OpenSearch に取り込むことはできますか?**
    まだできませんが、OpenTelemetry の上流でログの安定化に取り組んでおり、2023年後半または2024年初頭に ADOT でログをサポートする予定です。詳細は[公開ロードマップエントリ](https://github.com/aws-observability/aws-otel-community/issues/11)を参照してください。
3. **ADOT コレクターのリソース使用量とパフォーマンス詳細はどこで確認できますか?**
    [パフォーマンスレポート](https://aws-observability.github.io/aws-otel-collector/benchmark/report)をオンラインで公開しており、コレクターのリリースごとに最新の状況を反映しています。
4. **ADOT を Apache Kafka と併用できますか?**
    はい、ADOT コレクター v0.28.0 で Kafka エクスポーターとレシーバーのサポートが追加されました。詳細は[ADOT コレクターのドキュメント](https://aws-otel.github.io/docs/components/kafka-receiver-exporter)を参照してください。
5. **ADOT コレクターをどのように設定できますか?**
    ADOT コレクターは、ローカルに保存された YAML 設定ファイルを使って設定します。また、S3 バケットに保存された設定を使うこともできます。ADOT コレクターの設定方法はすべて、[ADOT コレクターのドキュメント](https://aws-otel.github.io/docs/components/confmap-providers)に詳しく記載されています。
6. **ADOT コレクターで高度なサンプリングを行えますか?**
    現在開発中です。最新情報を入手するには、公開ロードマップエントリ[https://github.com/aws-observability/aws-otel-collector/issues/1135](https://github.com/aws-observability/aws-otel-collector/issues/1135)を購読してください。
7. **ADOT コレクターのスケーリングに関するヒントはありますか?**
    はい!OpenTelemetry の上流ドキュメントの[Scaling the Collector](https://opentelemetry.io/docs/collector/scaling/)を参照してください。
8. **ADOT コレクターのフリートを管理する方法はありますか?**
    これは現在積極的に開発が行われている分野で、2023年に成熟すると予想されています。詳細は OpenTelemetry の上流ドキュメントの[Management](https://opentelemetry.io/docs/collector/management/)、特に[Open Agent Management Protocol (OpAMP)](https://opentelemetry.io/docs/collector/management/#opamp)を参照してください。
9. **ADOT コレクターの健全性とパフォーマンスをどのように監視しますか?**
    1. [Monitoring the collector](https://github.com/open-telemetry/opentelemetry-collector/blob/main/docs/monitoring.md) - ポート 8080 で公開されているデフォルトメトリクスを Prometheus レシーバーでスクレイピングできます。
    2. [Node Exporter](https://prometheus.io/docs/guides/node-exporter/)を使用すると、コレクターが実行されているノード、Pod、オペレーティングシステムのパフォーマンスと健全性に関するさまざまなメトリクスを取得できます。
    3. [Kube-state-metrics (KSM)](https://github.com/kubernetes/kube-state-metrics)を使うと、コレクターに関する興味深いイベントを生成できます。
    4. [Prometheus `up` メトリック](https://github.com/open-telemetry/opentelemetry-collector/pull/2918)
    5. 開始用の簡単な Grafana ダッシュボード: [https://grafana.com/grafana/dashboards/12553](https://grafana.com/grafana/dashboards/12553)
10. **製品 FAQ** - [https://aws.amazon.com/jp/otel/faqs/](https://aws.amazon.com/jp/otel/faqs/)
