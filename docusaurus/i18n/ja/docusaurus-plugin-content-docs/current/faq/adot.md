# AWS Distro for Open Telemetry (ADOT) - FAQ

## ADOT コレクターを使用して AMP にメトリクスを取り込むことはできますか?

はい、この機能は 2022 年 5 月のメトリクスサポートの GA ローンチで導入されました。ADOT コレクターは、EC2 から、EKS アドオン経由で、ECS サイドカー統合経由で、および/または Lambda レイヤー経由で使用できます。

## ADOT コレクターを使用してログを収集し、Amazon CloudWatch または Amazon OpenSearch に取り込むことはできますか?

はい。[ログサポート](https://aws.amazon.com/about-aws/whats-new/2023/11/logs-support-aws-distro-opentelemetry/)は 2023 年 11 月 22 日から利用可能です。詳細については、[Logging Exporter](https://aws-otel.github.io/docs/components/misc-exporters) ページを参照してください。

## ADOT Collector のリソース使用状況とパフォーマンスの詳細はどこで確認できますか?

コレクターをリリースする際に最新の状態に保っている[パフォーマンスレポート](https://aws-observability.github.io/aws-otel-collector/benchmark/report)をオンラインで公開しています。

## Apache Kafka で ADOT を使用することは可能ですか?

はい、Kafka exporter と receiver のサポートは ADOT collector v0.28.0 で追加されました。詳細については、[ADOT collector ドキュメント](https://aws-otel.github.io/docs/components/kafka-receiver-exporter)を確認してください。
## ADOT Collector を設定するにはどうすればよいですか?

ADOT コレクターは、ローカルに保存された YAML 設定ファイルを使用して設定されます。それに加えて、S3 バケットなどの他の場所に保存された設定を使用することも可能です。ADOT コレクターを設定するためのサポートされているすべてのメカニズムは、[ADOT コレクターのドキュメント](https://aws-otel.github.io/docs/components/confmap-providers)で詳しく説明されています。

## ADOT Collector で高度なサンプリングを実行できますか?

はい。[Advanced Sampling](https://aws.amazon.com/about-aws/whats-new/2023/05/aws-distro-opentelemetry-advanced-sampling/) は 2023 年 5 月 15 日に開始されました。詳細については、[AWS Distro for OpenTelemetry を使用した Advanced Sampling の開始方法](https://aws-otel.github.io/docs/getting-started/advanced-sampling)のページを参照してください。

## ADOT コレクターをスケーリングする方法のヒントはありますか?

はい。[Collector のスケーリング](https://opentelemetry.io/docs/collector/scaling/)に関する OpenTelemetry の公式ドキュメントを参照してください。

## ADOT コレクターのフリートがありますが、どのように管理できますか?

これは活発に開発が進められている分野であり、2023年に成熟することが期待されています。詳細については、上流の OpenTelemetry ドキュメントの[管理](https://opentelemetry.io/docs/collector/management/)を参照してください。特に [Open Agent Management Protocol (OpAMP)](https://opentelemetry.io/docs/collector/management/#opamp) に関する情報をご確認ください。

## ADOT Collector の健全性とパフォーマンスをどのように監視しますか？

1. [コレクターの監視](https://github.com/open-telemetry/opentelemetry-collector/blob/main/docs/observability.md) - Prometheus レシーバーによってスクレイピング可能なポート 8080 で公開されるデフォルトメトリクス
2. [Node Exporter](https://prometheus.io/docs/guides/node-exporter/) の使用。Node Exporter を実行すると、コレクターが実行されているノード、ポッド、およびオペレーティングシステムに関するいくつかのパフォーマンスおよびヘルスメトリクスも提供されます。
3. [Kube-state-metrics (KSM)](https://github.com/kubernetes/kube-state-metrics)。KSM はコレクターに関する興味深いイベントも生成できます。
4. [Prometheus `up` metric](https://github.com/open-telemetry/opentelemetry-collector/pull/2918)
5. 開始するためのシンプルな Grafana ダッシュボード: [https://grafana.com/grafana/dashboards/12553](https://grafana.com/grafana/dashboards/12553)

**製品 FAQ:** [https://aws.amazon.com/otel/faqs/](https://aws.amazon.com/otel/faqs/)

