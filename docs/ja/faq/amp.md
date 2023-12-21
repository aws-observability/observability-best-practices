# Amazon Managed Service for Prometheus - FAQ

1. **現在どの AWS リージョンがサポートされていますか?また、他のリージョンからメトリクスを収集することは可能ですか?** サポートしているリージョンの最新リストは、[ドキュメント](https://docs.aws.amazon.com/prometheus/latest/userguide/what-is-Amazon-Managed-Service-Prometheus.html)をご覧ください。2023年中にすべての商用リージョンのサポートを計画しています。優先順位を設定するうえで役立つため、ご希望のリージョンをお知らせください。任意のリージョンからデータを収集し、サポートしている特定のリージョンに送信することが常に可能です。詳細はこちらのブログをご覧ください: [Amazon Managed Service for Prometheus のクロスリージョンメトリクス収集の設定](https://aws.amazon.com/blogs/opensource/set-up-cross-region-metrics-collection-for-amazon-managed-service-for-prometheus-workspaces/)。

1. **Cost Explorer や [CloudWatch による AWS 課金情報](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/gs_monitor_estimated_charges_with_cloudwatch.html)で課金情報を確認するまでにどのくらい時間がかかりますか?**
    インジェストされたメトリクス サンプルのブロックは、2 時間ごとに S3 にアップロードされるたびに即座に計測されます。Amazon Managed Service for Prometheus の課金と料金が報告されるまでに最大 3 時間かかる場合があります。

1. **Prometheus サービスは、クラスター(EKS/ECS)からのメトリクスのスクレイプのみ可能のようですが、そうでしょうか?**
    他のコンピュート環境のドキュメントが不足していることをお詫び申し上げます。Prometheus サーバーを使用して、[EC2 から Prometheus メトリクスをスクレイプ](https://aws.amazon.com/blogs/opensource/using-amazon-managed-service-for-prometheus-to-monitor-ec2-environments/)できます。また、リモートライトの設定と [AWS SigV4 プロキシ](https://github.com/awslabs/aws-sigv4-proxy) の設定ができれば、Prometheus サーバーをインストールできる任意のコンピュート環境から、本日よりメトリクスを収集することができます。[EC2 ブログ](https://aws.amazon.com/blogs/opensource/using-amazon-managed-service-for-prometheus-to-monitor-ec2-environments/) には、「Running aws-sigv4-proxy」というセクションがあり、実行方法を示しています。他のコンピュート環境で AWS SigV4 を実行する方法を簡略化するためのドキュメントをさらに追加する必要があります。 

1. **このサービスを Grafana に接続するにはどうすればよいでしょうか?このことについてのドキュメントはありますか?**
    Amazon Managed Service for Prometheus を PromQL を使用してクエリするために、Grafana で利用できるデフォルトの [Prometheus データソース](https://grafana.com/docs/grafana/latest/datasources/prometheus/) を使用します。以下のドキュメントとブログが開始するのに役立ちます。
    1. [サービスドキュメント](https://docs.aws.amazon.com/prometheus/latest/userguide/Amazon Managed Service for Prometheus-onboard-query.html) 
    1. [EC2 上での Grafana の設定](https://aws.amazon.com/blogs/opensource/setting-up-grafana-on-ec2-to-query-metrics-from-amazon-managed-service-for-prometheus/)

1. **Amazon Managed Service for Prometheus に送信されるサンプル数を減らすためのベストプラクティスは何ですか?** 
    Amazon Managed Service for Prometheus にインジェストされるサンプル数を減らすために、お客様はスクレイプ間隔を延長(例: 30秒から1分に変更)したり、スクレイプしている時系列の数を減らすことができます。スクレイプ間隔を変更するほうが、時系列数を減らすよりもインジェストされるサンプル数に劇的な影響を与えます。スクレイプ間隔を2倍にすると、インジェストされるサンプル数が半分になります。

1. **CloudWatch メトリクスを Amazon Managed Service for Prometheus に送信するにはどうすればよいですか?** 
    CloudWatch メトリクスを Amazon Managed Service for Prometheus に送信するために、[CloudWatch メトリクスストリームを利用することをおすすめします](https://aws-observability.github.io/observability-best-practices/recipes/recipes/lambda-cw-metrics-go-amp/)。この統合には次のような短所がある可能性があります。
    1. Amazon Managed Service for Prometheus API を呼び出す Lambda 関数が必要
    1. CloudWatch メトリクスにメタデータ(タグなど)を付加してから Amazon Managed Service for Prometheus にインジェストする機能がない
    1. メトリクスは名前空間でのみフィルタリングできる(細かすぎない)
    
    代替として、Prometheus エクスポーターを利用して、CloudWatch メトリクスデータを Amazon Managed Service for Prometheus に送信できます。(1) CloudWatch Exporter: CW ListMetrics および GetMetricStatistics(GMS) API を使用した Java ベースのスクレイピング。
    
    [**Yet Another CloudWatch Exporter (YACE)**](https://github.com/nerdswords/yet-another-cloudwatch-exporter) は、CloudWatch から Amazon Managed Service for Prometheus にメトリクスを取得するための別のオプションです。これは、CW ListMetrics、GetMetricData (GMD)、GetMetricStatistics (GMS) API を使用した Go ベースのツールです。この使用に伴う短所は、エージェントをデプロイしてライフサイクルを管理する必要があることで、これは慎重に行う必要があります。

1. **どのバージョンの Prometheus と互換性がありますか?**
    Amazon Managed Service for Prometheus は、[Prometheus 2.x](https://github.com/prometheus/prometheus/blob/main/RELEASE.md) と互換性があります。Amazon Managed Service for Prometheus は、データプレーンとしてオープンソースの [CNCF Cortex プロジェクト](https://cortexmetrics.io/) に基づいています。Cortex は Prometheus( /prometheus/* および /api/prom/* の下)との 100% の API 互換性を目指しています。Amazon Managed Service for Prometheus は、Prometheus 互換の PromQL クエリ、リモートライトメトリクスインジェスト、および Gauge、Counters、Summary、Histogram を含む既存のメトリクスタイプの Prometheus データモデルをサポートしています。現在、[すべての Cortex API](https://cortexmetrics.io/docs/api/) を公開しているわけではありません。サポートしている互換 API のリストは、[こちらで確認](https://docs.aws.amazon.com/prometheus/latest/userguide/Amazon Managed Service for Prometheus-APIReference.html) できます。Amazon Managed Service for Prometheus から必要な機能がない場合は、アカウント チームと協力して、新しい製品機能リクエスト(PFR)を開くか、既存の PFR に影響を与えることができます。

1. **Amazon Managed Service for Prometheus にメトリクスをインジェストするために推奨されるコレクターは何ですか?Prometheus をエージェントモードで利用する必要がありますか?**
    Prometheus サーバー(エージェントモードを含む)、OpenTelemetry エージェント、AWS Distro for OpenTelemetry エージェントのいずれも、メトリクスデータを Amazon Managed Service for Prometheus に送信するためにお客様が使用できるエージェントとしてサポートしています。AWS Distro for OpenTelemetry は、OpenTelemetry プロジェクトのダウンストリームディストリビューションで、AWS によってパッケージ化および保護されています。3つのうちどれでもかまいません。チームのニーズと好みに最も適したものを選択してください。

1. **ワークスペースのサイズに応じて、Amazon Managed Service for Prometheus のパフォーマンスはどのようにスケールしますか?**
    現在、Amazon Managed Service for Prometheus は、単一のワークスペースで最大 2 億のアクティブな時系列をサポートしています。新しい上限を発表する際には、サービスのパフォーマンスと信頼性の特性がインジェストとクエリの両方で維持されていることを確認しています。同じデータセットに対するクエリは、ワークスペース内のアクティブな系列数に関係なく、パフォーマンスの低下が見られないはずです。

1. **製品 FAQ** [https://aws.amazon.com/prometheus/faqs/]()
