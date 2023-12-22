# Amazon Managed Service for Prometheus - FAQ

1. **現在どの AWS リージョンがサポートされていますか?また、他のリージョンからメトリクスを収集することは可能ですか?** サポートしているリージョンの最新リストは、[ドキュメント](https://docs.aws.amazon.com/prometheus/latest/userguide/what-is-Amazon-Managed-Service-Prometheus.html)をご覧ください。2023年にはすべての商用リージョンをサポートする計画です。優先順位を決める際の参考にさせていただけるよう、ご希望のリージョンをお知らせください。サポートしている特定のリージョンにデータを送信することで、任意のリージョンからデータを収集できます。詳細はこちらのブログをご覧ください: [Amazon Managed Service for Prometheus のクロスリージョンメトリクス収集の設定](https://aws.amazon.com/blogs/opensource/set-up-cross-region-metrics-collection-for-amazon-managed-service-for-prometheus-workspaces/)。

1. **Cost Explorer や [CloudWatch による AWS 課金情報](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/gs_monitor_estimated_charges_with_cloudwatch.html) で課金情報を確認するまでにどのくらい時間がかかりますか?** 
   インジェストされたメトリクスサンプルのブロックは、2時間ごとに S3 にアップロードされ次第すぐに計測されます。Amazon Managed Service for Prometheus の課金や料金が報告されるまで最大3時間かかることがあります。

1. **Prometheus サービスは、クラスター(EKS/ECS)からのメトリクスのスクレイピングのみ可能であると理解していますが、そうでしょうか?**
   他のコンピュート環境のドキュメントが不足していることをお詫び申し上げます。Prometheus サーバーを使用して、[EC2 から Prometheus メトリクスをスクレイプ](https://aws.amazon.com/blogs/opensource/using-amazon-managed-service-for-prometheus-to-monitor-ec2-environments/)できます。また、リモートライトの設定と [AWS SigV4 プロキシ](https://github.com/awslabs/aws-sigv4-proxy) の設定ができれば、Prometheus サーバーをインストールできる任意のコンピュート環境から、本日よりメトリクスデータを収集できます。[EC2 ブログ](https://aws.amazon.com/blogs/opensource/using-amazon-managed-service-for-prometheus-to-monitor-ec2-environments/) には、「Running aws-sigv4-proxy」という aws-sigv4-proxy の実行方法を示したセクションがあります。他のコンピュート環境で AWS SigV4 を実行する方法を簡略化するためのドキュメントをさらに追加する必要があります。 

1. **このサービスを Grafana に接続するにはどうすればよいでしょうか?この点に関するドキュメントはありますか?**
   Amazon Managed Service for Prometheus をクエリするために、Grafana でデフォルトで利用できる [Prometheus データソース](https://grafana.com/docs/grafana/latest/datasources/prometheus/) を使用しています。以下のドキュメントとブログが開始するのに役立つはずです。

   1. [サービスのドキュメント](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-onboard-query.html)
   1. [EC2 への Grafana のセットアップ](https://aws.amazon.com/blogs/opensource/setting-up-grafana-on-ec2-to-query-metrics-from-amazon-managed-service-for-prometheus/)

1. **Amazon Managed Service for Prometheus に送信されるサンプル数を減らすためのベストプラクティスは何ですか?**
   Amazon Managed Service for Prometheus にインジェストされるサンプル数を減らすために、お客様はスクレイプインターバルを延長できます(例: 30秒から1分に変更)。または、スクレイプしている時系列の数を減らすこともできます。スクレイプインターバルを変更するほうが、時系列数を減らすよりもインジェストされるサンプル数に劇的な影響を与えます。スクレイプインターバルを2倍にすると、インジェストされるサンプル数が半分になります。

1. **CloudWatch メトリクスを Amazon Managed Service for Prometheus に送信するにはどうすればよいですか?**
   [CloudWatch メトリクスストリームを利用して、CloudWatch メトリクスを Amazon Managed Service for Prometheus に送信することをおすすめします](/observability-best-practices/ja/recipes/recipes/lambda-cw-metrics-go-amp/)。この統合には次のような短所がある可能性があります。

   1. Amazon Managed Service for Prometheus API を呼び出すために Lambda 関数が必要
   1. CloudWatch メトリクスにメタデータ(AWS タグなど)を付加してから Amazon Managed Service for Prometheus にインジェストする機能がない
   1. メトリクスは名前空間でのみフィルタリングできる(細かいフィルタリングができない)

   代替策として、Prometheus エクスポーターを利用して、CloudWatch メトリクスデータを Amazon Managed Service for Prometheus に送信できます。

   1. CloudWatch Exporter: CW ListMetrics API と GetMetricStatistics(GMS) API を使用した Java ベースのスクレイピング
   1. [**Yet Another CloudWatch Exporter (YACE)**](https://github.com/nerdswords/yet-another-cloudwatch-exporter): CloudWatch から Amazon Managed Service for Prometheus にメトリクスを取得するための別のオプションです。これは、CW ListMetrics API、GetMetricData (GMD) API、GetMetricStatistics (GMS) API を使用した Go ベースのツールです。このツールを使用する際の短所は、エージェントをデプロイしてライフサイクルを管理する必要があることです。これは慎重に行う必要があります。

1. **どのバージョンの Prometheus と互換性がありますか?**
   Amazon Managed Service for Prometheus は、[Prometheus 2.x](https://github.com/prometheus/prometheus/blob/main/RELEASE.md) と互換性があります。データプレーンとしてオープンソースの [CNCF Cortex プロジェクト](https://cortexmetrics.io/) をベースに構築されています。Cortex は Prometheus(/prometheus/* および /api/prom/* の下)との 100% の API 互換性を目指しています。Prometheus 互換の PromQL クエリ、リモートライトによるメトリクス インジェスト、Gauge、Counters、Summary、Histogram など、既存のメトリクスタイプの Prometheus データモデルをサポートしています。現在、[すべての Cortex API](https://cortexmetrics.io/docs/api/) を公開しているわけではありません。サポートしている互換 API のリストは[こちら](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-APIReference.html)をご覧ください。Amazon Managed Service for Prometheus に必要な機能がない場合は、アカウント チームと連携して、新規または既存の製品機能リクエスト (PFR) をオープンできます。

1. **Amazon Managed Service for Prometheus にメトリクスをインジェストするために推奨するコレクターは何ですか?Prometheus をエージェントモードで利用する必要がありますか?**
   Prometheus サーバー(エージェントモードを含む)、OpenTelemetry エージェント、AWS Distro for OpenTelemetry エージェントのいずれも、メトリクスデータを Amazon Managed Service for Prometheus に送信するためにお客様が使用できるエージェントとしてサポートしています。AWS Distro for OpenTelemetry は、OpenTelemetry プロジェクトのダウンストリームディストリビューションで、AWS によってパッケージ化および保護されています。3つのうちいずれでも構いません。チームのニーズと好みに最も適したものを選択してください。

1. **ワークスペースのサイズに応じて、Amazon Managed Service for Prometheus のパフォーマンスはどのようにスケールしますか?**
   現在、Amazon Managed Service for Prometheus は、単一のワークスペースで最大 2 億のアクティブなタイムシリーズをサポートしています。新しい上限を発表する際は、サービスのパフォーマンスと信頼性がインジェストとクエリの両方で維持されることを確認しています。同じデータセットに対するクエリは、ワークスペース内のアクティブなシリーズ数に関係なく、パフォーマンスの低下が見られないはずです。

1. **製品 FAQ** [https://aws.amazon.com/prometheus/faqs/]()
