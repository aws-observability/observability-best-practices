# AWS Distro for OpenTelemetry(ADOT) - FAQ

1. **AMP にメトリクスをインジェストするために ADOT コレクタを使用できますか?**
    はい、この機能は2022年5月のメトリクスサポートの一般提供ローンチで導入され、EC2 から、EKS アドオンを介して、ECS サイドカー統合を介して、および/または Lambda レイヤーを介して ADOT コレクタを使用できます。

1. **ADOT コレクタを使用してログを収集し、Amazon CloudWatch または Amazon OpenSearch にインジェストできますか?**
    まだですが、OpenTelemetry でログを上流で安定化させる作業を行っています。時期が来たら、おそらく2023年後半または2024年初頭に、ADOT でログをサポートする予定です。[パブリックロードマップのエントリ](https://github.com/aws-observability/aws-otel-community/issues/11)もご参照ください。

1. **ADOT コレクタのリソース使用量とパフォーマンスの詳細はどこで確認できますか?**
    コレクタのリリースごとに更新している[パフォーマンスレポート](https://aws-observability.github.io/aws-otel-collector/benchmark/report)がオンラインで参照できます。

1. **ADOT を Apache Kafka で使用することは可能ですか?**
    はい、Kafka エクスポーターとレシーバーのサポートが ADOT コレクタ v0.28.0 で追加されました。詳細は、[ADOTコレクタのドキュメント](https://aws-otel.github.io/docs/components/kafka-receiver-exporter)をご確認ください。

1. **ADOT コレクタをどのように設定できますか?**
    ADOT コレクタは、ローカルに保存されている YAML 設定ファイルで構成されます。 加えて、S3 バケットなどの他の場所に保存された設定を使用することも可能です。 ADOT コレクタを設定するためにサポートされているすべてのメカニズムが、[ADOT コレクタドキュメント](https://aws-otel.github.io/docs/components/confmap-providers)に詳しく説明されています。

1. **ADOTコレクタで高度なサンプリングを行うことはできますか?**
    現在実装中です。  最新情報を把握したい場合は、パブリック [ロードマップのエントリ](https://github.com/aws-observability/aws-otel-collector/issues/1135) を購読してください。

1. **ADOT コレクタのスケーリングのヒントはありますか?**
    はい! コレクタのスケーリングについては、OpenTelemetry の上流ドキュメント [Scaling the Collector](https://opentelemetry.io/docs/collector/scaling/) をご覧ください。

1. **ADOT コレクタのフリートがあります。これをどのように管理できますか?**
    これは積極的に開発が進められている分野で、2023年に成熟することが期待されます。 詳細については、上流の OpenTelemetry ドキュメントの [Management](https://opentelemetry.io/docs/collector/management/) を参照してください。特に [Open Agent Management Protocol (OpAMP)](https://opentelemetry.io/docs/collector/management/#opamp) をご覧ください。

1. **ADOT コレクタの正常性とパフォーマンスをどのように監視できますか?**
    1. [コレクタの監視](https://github.com/open-telemetry/opentelemetry-collector/blob/main/docs/monitoring.md) - ポート 8080 で公開されているデフォルトのメトリクスを Prometheus レシーバでスクレイプできます
    2. [Node Exporter](https://prometheus.io/docs/guides/node-exporter/) を使用 - ノードエクスポーターの実行により、コレクタが実行されているノード、Pod、オペレーティングシステムに関するパフォーマンスと正常性に関するメトリクスがいくつか提供されます。
    3. [Kube-state-metrics (KSM)](https://github.com/kubernetes/kube-state-metrics) - KSM もコレクタに関する興味深いイベントを生成できます。
    4. Prometheus の [`up` メトリクス](https://github.com/open-telemetry/opentelemetry-collector/pull/2918)
    5. スタートするためのシンプルな Grafana ダッシュボード: [https://grafana.com/grafana/dashboards/12553]()

1. **製品 FAQ** - [https://aws.amazon.com/otel/faqs/]()
