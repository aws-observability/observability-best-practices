# Amazon Managed Service for Prometheus - よくある質問

1. **現在サポートされている AWS リージョンはどこで、他のリージョンからメトリクスを収集することは可能ですか？** サポートしているリージョンの最新リストについては、[ドキュメント](https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/what-is-Amazon-Managed-Service-Prometheus.html) をご覧ください。2023 年にはすべての商用リージョンをサポートする予定です。優先順位付けのため、どのリージョンが必要かお知らせください。サポートしているリージョンに、他のリージョンからデータを収集して送信することは常に可能です。詳細については、こちらのブログをご覧ください：[Amazon Managed Service for Prometheus のクロスリージョンメトリクス収集](https://aws.amazon.com/blogs/opensource/set-up-cross-region-metrics-collection-for-amazon-managed-service-for-prometheus-workspaces/)。

2. **Cost Explorer や [CloudWatch の AWS 請求料金](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/gs_monitor_estimated_charges_with_cloudwatch.html) で課金や請求を確認するまでにどのくらい時間がかかりますか？**
    取り込まれたメトリクスサンプルのブロックは、2 時間ごとに S3 にアップロードされるとすぐに計測されます。Amazon Managed Service for Prometheus の計測と料金が報告されるまでに最大 3 時間かかる場合があります。

3. **Prometheus サービスはクラスター（EKS/ECS）からのみメトリクスをスクレイプできるように見えますが、それは正しいですか？**
    他のコンピューティング環境に関するドキュメントが不足していて申し訳ありません。Prometheus サーバーを使用して、[EC2 からの Prometheus メトリクス](https://aws.amazon.com/jp/blogs/news/using-amazon-managed-service-for-prometheus-to-monitor-ec2-environments/) をスクレイプできます。また、Prometheus サーバーをインストールできる他のコンピューティング環境からも、リモートライトを設定し [AWS SigV4 プロキシ](https://github.com/awslabs/aws-sigv4-proxy) をセットアップすれば可能です。[EC2 ブログ](https://aws.amazon.com/jp/blogs/news/using-amazon-managed-service-for-prometheus-to-monitor-ec2-environments/) の「Running aws-sigv4-proxy」セクションで実行方法を確認できます。他のコンピューティング環境での AWS SigV4 の実行を簡素化するためのドキュメントを追加する必要があります。

4. **このサービスを Grafana に接続するにはどうすればよいですか？ドキュメントはありますか？**
    PromQL を使用して Amazon Managed Service for Prometheus にクエリを実行するには、Grafana で利用可能なデフォルトの [Prometheus データソース](https://grafana.com/docs/grafana/latest/datasources/prometheus/) を使用します。以下のドキュメントとブログが参考になります：
    1. [サービスドキュメント](https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/AMP-onboard-query.html)
    2. [EC2 上の Grafana セットアップ](https://aws.amazon.com/jp/blogs/news/setting-up-grafana-on-ec2-to-query-metrics-from-amazon-managed-service-for-prometheus/)

5. **Amazon Managed Service for Prometheus に送信されるサンプル数を減らすためのベストプラクティスは何ですか？**
    Amazon Managed Service for Prometheus に取り込まれるサンプル数を減らすには、スクレイプ間隔を延長する（例：30 秒から 1 分に変更）か、スクレイプするシリーズの数を減らすことができます。スクレイプ間隔の変更は、シリーズ数の削減よりもサンプル数に大きな影響を与え、スクレイプ間隔を 2 倍にすると取り込まれるサンプル量が半分になります。

6. **CloudWatch メトリクスを Amazon Managed Service for Prometheus に送信するにはどうすればよいですか？**
    [CloudWatch メトリクスストリームを使用して CloudWatch メトリクスを Amazon Managed Service for Prometheus に送信する](https://aws-observability.github.io/observability-best-practices/recipes/recipes/lambda-cw-metrics-go-amp/) ことをお勧めします。この統合の潜在的な短所は以下の通りです：
    1. Amazon Managed Service for Prometheus API を呼び出すために Lambda 関数が必要
    2. CloudWatch メトリクスを Amazon Managed Service for Prometheus に取り込む前にメタデータ（AWS タグなど）で強化する機能がない
    3. メトリクスは名前空間でのみフィルタリングできる（十分に細かくない）

    代替案として、Prometheus Exporter を使用して CloudWatch メトリクスデータを Amazon Managed Service for Prometheus に送信できます：(1) CloudWatch Exporter：CW ListMetrics と GetMetricStatistics (GMS) API を使用する Java ベースのスクレイピング。

    [**Yet Another CloudWatch Exporter (YACE)**](https://github.com/nerdswords/yet-another-cloudwatch-exporter) は、CloudWatch から Amazon Managed Service for Prometheus にメトリクスを取得するもう一つのオプションです。これは CW ListMetrics、GetMetricData (GMD)、GetMetricStatistics (GMS) API を使用する Go ベースのツールです。これを使用する場合の欠点として、エージェントをデプロイし、ライフサイクルを慎重に管理する必要があることが挙げられます。

7. **どのバージョンの Prometheus と互換性がありますか？**
    Amazon Managed Service for Prometheus は [Prometheus 2.x](https://github.com/prometheus/prometheus/blob/main/RELEASE.md) と互換性があります。Amazon Managed Service for Prometheus は、データプレーンとしてオープンソースの [CNCF Cortex プロジェクト](https://cortexmetrics.io/) をベースにしています。Cortex は Prometheus と 100% API 互換（/prometheus/* と /api/prom/* の下）を目指しています。Amazon Managed Service for Prometheus は、Prometheus 互換の PromQL クエリ、リモートライトメトリクス取り込み、および Gauge、Counters、Summary、Histogram を含む既存のメトリクスタイプの Prometheus データモデルをサポートしています。現在、[すべての Cortex API](https://cortexmetrics.io/docs/api/) を公開しているわけではありません。サポートしている互換 API のリストは[こちら](https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/AMP-APIReference.html)で確認できます。Amazon Managed Service for Prometheus に必要な機能が不足している場合、お客様はアカウントチームと協力して新しい製品機能リクエスト（PFR）を開いたり、既存の PFR に影響を与えたりすることができます。

8. **Amazon Managed Service for Prometheus にメトリクスを取り込むためにどのコレクターを推奨しますか？Prometheus をエージェントモードで使用すべきですか？**
    エージェントモードを含む Prometheus サーバー、OpenTelemetry エージェント、AWS Distro for OpenTelemetry エージェントの使用をサポートしています。これらは、お客様が Amazon Managed Service for Prometheus にメトリクスデータを送信するために使用できるエージェントです。AWS Distro for OpenTelemetry は、AWS によってパッケージ化およびセキュア化された OpenTelemetry プロジェクトのダウンストリーム配布版です。これらのいずれも問題ありませんので、個々のチームのニーズと好みに最も適したものを選択してください。

9. **Amazon Managed Service for Prometheus のパフォーマンスはワークスペースのサイズに応じてどのようにスケールしますか？**
    現在、Amazon Managed Service for Prometheus は単一のワークスペースで最大 2 億のアクティブな時系列をサポートしています。新しい最大制限を発表する際は、取り込みとクエリの両方でサービスのパフォーマンスと信頼性が維持されることを確認しています。同じサイズのデータセットに対するクエリは、ワークスペース内のアクティブなシリーズの数に関係なく、パフォーマンスの低下を経験しないはずです。

10. **製品 FAQ** [https://aws.amazon.com/jp/prometheus/faqs/](.)
