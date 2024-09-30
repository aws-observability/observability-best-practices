# AWS Distro for OpenTelemetry(ADOT) - FAQ

1. **AMP へのメトリクスの取り込みに ADOT コレクタを使用できますか?**
    はい、2022年5月のメトリクスサポートの本番リリースでこの機能が導入されました。EC2 から、EKS アドオンを介して、ECS サイドカー統合を介して、および/または Lambda レイヤーを介して ADOT コレクタを使用できます。

1. **ADOT コレクタを使用してログを収集し、Amazon CloudWatch または Amazon OpenSearch に取り込むことができますか?**
    まだできませんが、OpenTelemetry でログを上流で安定化させる作業を行っています。時期が来たら、おそらく 2023 年後半または 2024 年初頭に、ADOT でログをサポートする予定です。詳細については、[パブリックロードマップのエントリ](https://github.com/aws-observability/aws-otel-community/issues/11) を参照してください。

1. **ADOT コレクタのリソース使用量とパフォーマンスの詳細はどこで確認できますか?**
    コレクタのリリースごとに更新している[パフォーマンスレポート](https://aws-observability.github.io/aws-otel-collector/benchmark/report)がオンラインで公開されています。

1. **ADOT を Apache Kafka で使用することは可能ですか?**
    はい、Kafka エクスポータとレシーバのサポートが ADOT コレクタ v0.28.0 で追加されました。詳細については、[ADOT コレクタのドキュメント](https://aws-otel.github.io/docs/components/kafka-receiver-exporter)をご確認ください。

1. **ADOT コレクタの設定方法を教えてください。**
    ADOT コレクタは、ローカルに保存されている YAML 設定ファイルを使用して構成されます。 加えて、S3 バケットなどの他の場所に保存されている構成を使用することもできます。 ADOT コレクタを構成するためにサポートされているすべてのメカニズムは、[ADOT コレクタのドキュメント](https://aws-otel.github.io/docs/components/confmap-providers)で詳しく説明されています。

1. **ADOT コレクタで高度なサンプリングを行うことができますか?**
    現在実装中です。公開 [ロードマップのエントリ](https://github.com/aws-observability/aws-otel-collector/issues/1135) をサブスクライブして最新情報を取得してください。

1. **ADOT コレクタのスケーリングのヒントを教えてください。**
    はい! アップストリームの OpenTelemetry ドキュメントの [コレクタのスケーリング](https://opentelemetry.io/docs/collector/scaling/) をご覧ください。

1. **ADOT コレクタのフリートを持っています。どのように管理できますか?**
    これは現在積極的に開発が進められている領域であり、2023年に成熟すると予想されます。 詳細については、アップストリームの OpenTelemetry ドキュメントの [管理](https://opentelemetry.io/docs/collector/management/) を参照してください。特に [Open Agent Management Protocol (OpAMP)](https://opentelemetry.io/docs/collector/management/#opamp) をご覧ください。

1. **ADOT コレクタの正常性とパフォーマンスをどのように監視していますか?**
    1. [コレクタの監視](https://github.com/open-telemetry/opentelemetry-collector/blob/main/docs/monitoring.md) - ポート 8080 で公開されているデフォルトのメトリクスを Prometheus レシーバがスクレイプできます
    2. [Node Exporter](https://prometheus.io/docs/guides/node-exporter/) を使用する - node exporter を実行すると、コレクタが実行されているノード、ポッド、オペレーティング システムに関するいくつかのパフォーマンスと正常性メトリクスも提供されます。
    3. [Kube-state-metrics (KSM)](https://github.com/kubernetes/kube-state-metrics) - KSM もコレクタに関する興味深いイベントを生成できます。
    4. [Prometheus `up` メトリクス](https://github.com/open-telemetry/opentelemetry-collector/pull/2918)
    5. はじめに使用できるシンプルな Grafana ダッシュボード: [https://grafana.com/grafana/dashboards/12553](.)
2. **製品 FAQ** - [https://aws.amazon.com/otel/faqs/](.)
