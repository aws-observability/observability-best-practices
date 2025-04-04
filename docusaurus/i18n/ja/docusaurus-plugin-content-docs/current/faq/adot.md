# AWS Distro for OpenTelemetry (ADOT) - よくある質問




## ADOT コレクターを使用して AMP にメトリクスを取り込むことはできますか？

はい、この機能は 2022 年 5 月のメトリクスサポートの GA リリースで導入されました。EC2、EKS アドオン、ECS サイドカー統合、Lambda レイヤーを通じて ADOT コレクターを使用できます。




## ADOT コレクターを使用してログを収集し、Amazon CloudWatch や Amazon OpenSearch に取り込むことはできますか？

はい。[ログのサポート](https://aws.amazon.com/jp/about-aws/whats-new/2023/11/logs-support-aws-distro-opentelemetry/) は 2023 年 11 月 22 日から利用可能になりました。詳細については、[Logging Exporter](https://aws-otel.github.io/docs/components/misc-exporters) のページをご覧ください。




## ADOT コレクターのリソース使用量とパフォーマンスの詳細はどこで確認できますか？

[パフォーマンスレポート](https://aws-observability.github.io/aws-otel-collector/benchmark/report) をオンラインで公開しており、コレクターをリリースするたびに最新の情報に更新しています。




## ADOT を Apache Kafka で使用することは可能ですか？

はい、ADOT コレクター v0.28.0 で Kafka エクスポーターとレシーバーのサポートが追加されました。詳細については、[ADOT コレクターのドキュメント](https://aws-otel.github.io/docs/components/kafka-receiver-exporter) をご確認ください。



## ADOT コレクターの設定方法

ADOT コレクターは、ローカルに保存された YAML 設定ファイルを使用して設定します。
また、S3 バケットなど、他の場所に保存された設定を使用することも可能です。
ADOT コレクターの設定に対応しているすべてのメカニズムは、[ADOT コレクターのドキュメント](https://aws-otel.github.io/docs/components/confmap-providers)で詳しく説明されています。



## ADOT コレクターで高度なサンプリングを実行できますか？

はい。[高度なサンプリング](https://aws.amazon.com/jp/about-aws/whats-new/2023/05/aws-distro-opentelemetry-advanced-sampling/) は 2023 年 5 月 15 日にリリースされました。詳細については、[AWS Distro for OpenTelemetry を使用した高度なサンプリングの開始](https://aws-otel.github.io/docs/getting-started/advanced-sampling) のページをご覧ください。




## ADOT コレクターのスケーリングに関するヒントはありますか？

はい！上流の OpenTelemetry ドキュメントの [Scaling the Collector](https://opentelemetry.io/docs/collector/scaling/) をご覧ください。




## ADOT コレクターのフリートを持っていますが、どのように管理できますか？

これは現在活発に開発が進められている分野で、2023 年に成熟すると予想されています。詳細については、上流の OpenTelemetry ドキュメントの [Management](https://opentelemetry.io/docs/collector/management/) を参照してください。特に [Open Agent Management Protocol (OpAMP)](https://opentelemetry.io/docs/collector/management/#opamp) に関する情報が記載されています。



## ADOT コレクターの正常性とパフォーマンスをどのようにモニタリングしますか？

1. [コレクターのモニタリング](https://github.com/open-telemetry/opentelemetry-collector/blob/main/docs/observability.md) - Prometheus Receiver によってスクレイピングできるポート 8080 で公開されるデフォルトのメトリクス
2. [Node Exporter](https://prometheus.io/docs/guides/node-exporter/) の使用 - Node Exporter を実行することで、コレクターが実行されているノード、Pod、オペレーティングシステムに関する様々なパフォーマンスと正常性のメトリクスを提供します。
3. [Kube-state-metrics (KSM)](https://github.com/kubernetes/kube-state-metrics) - KSM はコレクターに関する興味深いイベントを生成することもできます。
4. [Prometheus の `up` メトリクス](https://github.com/open-telemetry/opentelemetry-collector/pull/2918)
5. 開始するためのシンプルな Grafana ダッシュボード: [https://grafana.com/grafana/dashboards/12553](https://grafana.com/grafana/dashboards/12553)

**製品 FAQ:** [https://aws.amazon.com/jp/otel/faqs/](https://aws.amazon.com/jp/otel/faqs/)
