# AWS Distro for Open Telemetry (ADOT) - よくある質問

1. **ADOT コレクターを使用して AMP にメトリクスを取り込むことはできますか？**
    はい、この機能は 2022 年 5 月のメトリクスサポートの GA ローンチで導入されました。EC2、EKS アドオン、ECS サイドカー統合、および Lambda レイヤーを通じて ADOT コレクターを使用できます。

2. **ADOT コレクターを使用してログを収集し、Amazon CloudWatch や Amazon OpenSearch に取り込むことはできますか？**
    まだできませんが、OpenTelemetry のアップストリームでログの安定化に取り組んでいます。2023 年後半か 2024 年初頭に ADOT でログをサポートする予定です。[公開ロードマップのエントリ](https://github.com/aws-observability/aws-otel-community/issues/11) もご覧ください。

3. **ADOT コレクターのリソース使用量とパフォーマンスの詳細はどこで確認できますか？**
    コレクターをリリースするたびに更新している [パフォーマンスレポート](https://aws-observability.github.io/aws-otel-collector/benchmark/report) をオンラインで公開しています。

4. **ADOT を Apache Kafka と一緒に使用することは可能ですか？**
    はい、ADOT コレクター v0.28.0 で Kafka エクスポーターとレシーバーのサポートが追加されました。詳細については、[ADOT コレクターのドキュメント](https://aws-otel.github.io/docs/components/kafka-receiver-exporter) をご確認ください。

5. **ADOT コレクターの設定方法を教えてください。**
    ADOT コレクターは、ローカルに保存された YAML 設定ファイルを使用して設定します。また、S3 バケットなど他の場所に保存された設定を使用することも可能です。ADOT コレクターの設定に対応しているすべてのメカニズムは、[ADOT コレクターのドキュメント](https://aws-otel.github.io/docs/components/confmap-providers) に詳しく説明されています。

6. **ADOT コレクターで高度なサンプリングを行うことはできますか？**
    現在取り組んでいます。最新情報を確認するには、公開 [ロードマップのエントリ](https://github.com/aws-observability/aws-otel-collector/issues/1135) をサブスクライブしてください。

7. **ADOT コレクターのスケーリングに関するヒントはありますか？**
    はい！OpenTelemetry のアップストリームドキュメントの [コレクターのスケーリング](https://opentelemetry.io/docs/collector/scaling/) をご覧ください。

8. **ADOT コレクターのフリートがあります。どのように管理すればよいですか？**
    これは活発に開発が進められている分野で、2023 年には成熟すると予想しています。詳細については、OpenTelemetry のアップストリームドキュメントの [管理](https://opentelemetry.io/docs/collector/management/) をご覧ください。特に [Open Agent Management Protocol (OpAMP)](https://opentelemetry.io/docs/collector/management/#opamp) に注目してください。

9. **ADOT コレクターの健全性とパフォーマンスをどのようにモニタリングしますか？**
    1. [コレクターのモニタリング](https://github.com/open-telemetry/opentelemetry-collector/blob/main/docs/observability.md) - ポート 8080 で公開されるデフォルトのメトリクスを Prometheus レシーバーでスクレイピングできます。
    2. [Node Exporter](https://prometheus.io/docs/guides/node-exporter/) を使用すると、コレクターが実行されているノード、Pod、オペレーティングシステムに関する様々なパフォーマンスと健全性のメトリクスも提供されます。
    3. [Kube-state-metrics (KSM)](https://github.com/kubernetes/kube-state-metrics) は、コレクターに関する興味深いイベントを生成することもできます。
    4. [Prometheus の `up` メトリクス](https://github.com/open-telemetry/opentelemetry-collector/pull/2918)
    5. 開始するためのシンプルな Grafana ダッシュボード: [https://grafana.com/grafana/dashboards/12553](.)

10. **製品 FAQ** - [https://aws.amazon.com/jp/otel/faqs/](.)
