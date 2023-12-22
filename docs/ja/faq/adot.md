# AWS Distro for OpenTelemetry(ADOT) - FAQ

1. **AMP にメトリクスをインジェストするために ADOT コレクタを使用できますか?**
    はい、この機能は2022年5月のメトリクスサポートのGAリリースで導入され、EC2から、EKSアドオンを介して、ECSサイドカーインテグレーションを介して、および/またはLambdaレイヤーを介してADOTコレクタを使用できます。

1. **ADOT コレクタを使用してログを収集し、Amazon CloudWatch または Amazon OpenSearch にインジェストできますか?**
    まだですが、OpenTelemetry でログを上流で安定化させる作業を行っています。時期が来たら、おそらく2023年後半または2024年初頭に、ADOT でログをサポートする予定です。[パブリックロードマップのエントリ](https://github.com/aws-observability/aws-otel-community/issues/11)もご覧ください。

1. **ADOT コレクタのリソース使用量とパフォーマンスの詳細はどこで確認できますか?**
    コレクタのリリースごとに更新している[パフォーマンスレポート](https://aws-observability.github.io/aws-otel-collector/benchmark/report)がオンラインで公開されています。

1. **ADOT を Apache Kafka で使用することは可能ですか?**
    はい、Kafka エクスポーターとレシーバーのサポートが ADOT コレクタ v0.28.0 で追加されました。詳細は、[ADOT コレクタのドキュメント](https://aws-otel.github.io/docs/components/kafka-receiver-exporter)をご確認ください。

1. **ADOT コレクタをどのように設定できますか?**
    ADOT コレクタは、ローカルに保存されている YAML 設定ファイルで構成されます。 加えて、S3 バケットなどの他の場所に保存された設定を使用することも可能です。 ADOT コレクタを設定するためにサポートされているすべてのメカニズムが、[ADOT コレクタのドキュメント](https://aws-otel.github.io/docs/components/confmap-providers)に詳しく説明されています。

1. **ADOT コレクタで高度なサンプリングを行うことはできますか?**
    現在実装中です。 公開[ロードマップのエントリ](https://github.com/aws-observability/aws-otel-collector/issues/1135)にサブスクライブして最新情報を入手してください。

1. **ADOT コレクタのスケーリングのヒントはありますか?**
    はい! 上流の OpenTelemetry ドキュメントの [コレクタのスケーリング](https://opentelemetry.io/docs/collector/scaling/) をご覧ください。

1. **ADOT コレクタのフリートがあります。これらをどのように管理できますか?**
    これは積極的に開発が進められている分野で、2023年に成熟することが期待されます。 詳細については、上流の OpenTelemetry ドキュメントの [Management](https://opentelemetry.io/docs/collector/management/) をご覧ください。特に [Open Agent Management Protocol (OpAMP)](https://opentelemetry.io/docs/collector/management/#opamp) をご確認ください。

1. **ADOT コレクタのヘルスとパフォーマンスをどのように監視できますか?**
    1. [コレクタの監視](https://github.com/open-telemetry/opentelemetry-collector/blob/main/docs/monitoring.md) - ポート 8080 で公開されているデフォルトのメトリクスを Prometheus レシーバでスクレイプできます
    2. [Node Exporter](https://prometheus.io/docs/guides/node-exporter/) を使用 - ノードエクスポータの実行により、コレクタが実行されているノード、Pod、オペレーティングシステムに関するいくつかのパフォーマンスとヘルスメトリクスが提供されます。
    3. [Kube-state-metrics (KSM)](https://github.com/kubernetes/kube-state-metrics) - KSM もコレクタに関する興味深いイベントを生成できます。 
    4. Prometheus の `up` メトリクス - [https://github.com/open-telemetry/opentelemetry-collector/pull/2918]()
    5. スタートするためのシンプルな Grafana ダッシュボード: [https://grafana.com/grafana/dashboards/12553]()

1. **製品 FAQ** - [https://aws.amazon.com/otel/faqs/]()
