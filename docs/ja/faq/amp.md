# Amazon Managed Service for Prometheus - よくある質問

1. **現在どの AWS リージョンがサポートされていますか? 他のリージョンからメトリクスを収集することは可能ですか?** サポートしているリージョンの最新リストは、[ドキュメント](https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/what-is-Amazon-Managed-Service-Prometheus.html) をご覧ください。2023年にはすべての商用リージョンをサポートする計画です。優先順位をより適切に設定できるよう、サポートが必要なリージョンをお知らせください。特定のサポート対象リージョンにデータを送信することで、任意のリージョンからデータを収集できます。詳細はこちらのブログをご覧ください: [Amazon Managed Service for Prometheus のクロスリージョンメトリクス収集の設定](https://aws.amazon.com/jp/blogs/news/set-up-cross-region-metrics-collection-for-amazon-managed-service-for-prometheus-workspaces/)。

1. **Cost Explorer や [CloudWatch による AWS 課金情報](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/gs_monitor_estimated_charges_with_cloudwatch.html) で課金やメータリングを確認するまでにどのくらい時間がかかりますか?** 
   メトリックサンプルのブロックは、S3 に 2 時間ごとにアップロードされるたびに即座に課金されます。Amazon Managed Service for Prometheus の課金やメータリングが報告されるまで最大 3 時間かかる場合があります。

1. **Prometheus サービスはクラスター (EKS/ECS) からメトリクスをスクレイピングできるだけのようですが、そうでしょうか?**
   他のコンピュート環境に関するドキュメントが不足していることをお詫び申し上げます。Prometheus サーバーを使用して、[EC2 から Prometheus メトリクスをスクレイピング](https://aws.amazon.com/jp/blogs/news/using-amazon-managed-service-for-prometheus-to-monitor-ec2-environments/)したり、Prometheus サーバーをインストールできるコンピュート環境ならどこからでもメトリクスを収集できます。リモートライトの設定と [AWS SigV4 プロキシ](https://github.com/awslabs/aws-sigv4-proxy) のセットアップが必要です。[EC2 ブログ](https://aws.amazon.com/jp/blogs/news/using-amazon-managed-service-for-prometheus-to-monitor-ec2-environments/) の「aws-sigv4-proxy の実行」というセクションで、AWS SigV4 の実行方法を確認できます。他のコンピュート環境で AWS SigV4 を実行する方法を簡略化するためのドキュメントを追加する必要があります。

1. **このサービスを Grafana に接続するにはどうすればよいでしょうか? 関連ドキュメントはありますか?**
   Amazon Managed Service for Prometheus を PromQL を使用してクエリするために、Grafana で利用できるデフォルトの [Prometheus データソース](https://grafana.com/docs/grafana/latest/datasources/prometheus/) を使用します。以下のドキュメントとブログが開始するのに役立ちます。

   1. [サービスドキュメント](https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/AMP-onboard-query.html)
   1. [EC2 上での Grafana の設定](https://aws.amazon.com/jp/blogs/news/setting-up-grafana-on-ec2-to-query-metrics-from-amazon-managed-service-for-prometheus/)

1. **Amazon Managed Service for Prometheus に送信されるサンプル数を減らすためのベストプラクティスは何ですか?**
   Amazon Managed Service for Prometheus にインジェストされるサンプル数を減らすには、スクレイプインターバルを延長する (例: 30 秒から 1 分に変更) か、スクレイピングする時系列の数を減らします。スクレイプインターバルの変更の方が、時系列数の減少よりもインジェストされるサンプル量に大きな影響を与えます。スクレイプインターバルを2倍にすると、インジェストされるサンプル量が半分になります。

1. **CloudWatch メトリクスを Amazon Managed Service for Prometheus に送信するにはどうすればよいですか?**
   CloudWatch メトリクスを Amazon Managed Service for Prometheus に送信するには、[CloudWatch メトリクスストリームを利用することをおすすめします](/observability-best-practices/ja/recipes/recipes/lambda-cw-metrics-go-amp/)。この統合には以下のような短所があります。

   1. Amazon Managed Service for Prometheus API を呼び出す Lambda 関数が必要
   1. CloudWatch メトリクスにメタデータ (例: AWS タグ) を追加してから Amazon Managed Service for Prometheus にインジェストする機能がない
   1. メトリクスを名前空間でしかフィルタリングできない (細かい制御ができない)

   代替として、Prometheus Exporter を利用して CloudWatch メトリクスデータを Amazon Managed Service for Prometheus に送信できます。

   1. CloudWatch Exporter: CW ListMetrics API と GetMetricStatistics API を使用した Java ベースのスクレイピング
   1. [**Yet Another CloudWatch Exporter (YACE)**](https://github.com/nerdswords/yet-another-cloudwatch-exporter): CW ListMetrics API、GetMetricData API、GetMetricStatistics API を使用した Go ベースのツール

   この方法の短所は、エージェントをデプロイしてライフサイクルを管理する必要があることです。慎重に実装する必要があります。

1. **どのバージョンの Prometheus と互換性がありますか?**
   Amazon Managed Service for Prometheus は、[Prometheus 2.x](https://github.com/prometheus/prometheus/blob/main/RELEASE.md) と互換性があります。データプレーンとしてオープンソースの [CNCF Cortex プロジェクト](https://cortexmetrics.io/) をベースに構築されています。Cortex は Prometheus (/prometheus/* と /api/prom/* の下) と 100% API 互換を目指しています。Prometheus 互換の PromQL クエリ、リモートライトによるメトリクスインジェスト、Gauge、Counter、Summary、Histogram などの既存のメトリクスタイプの Prometheus データモデルをサポートしています。現在、[すべての Cortex API](https://cortexmetrics.io/docs/api/) を公開しているわけではありません。サポートしている互換 API のリストは[こちら](https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/AMP-APIReference.html) をご覧ください。Amazon Managed Service for Prometheus で必要な機能がない場合は、アカウントチームに相談の上、新規または既存の製品機能リクエスト (PFR) を開くことができます。

1. **Amazon Managed Service for Prometheus にメトリクスをインジェストするために推奨するコレクターは何ですか? Prometheus のエージェントモードを利用すべきですか?**
   Prometheus サーバー(エージェントモードを含む)、OpenTelemetry エージェント、AWS Distro for OpenTelemetry エージェントのいずれも、メトリクスデータを Amazon Managed Service for Prometheus に送信するために使用できるエージェントです。AWS Distro for OpenTelemetry は、AWS によってパッケージ化および保護された OpenTelemetry プロジェクトのダウンストリームディストリビューションです。3つのうちいずれでも問題ありません。チームのニーズと好みに最も適したものを選択してください。

1. **ワークスペースのサイズに応じて、Amazon Managed Service for Prometheus のパフォーマンスはどのようにスケールしますか?**
   現在、Amazon Managed Service for Prometheus は単一のワークスペースで最大 2 億のアクティブな時系列をサポートしています。新しい上限を発表する際は、サービスのパフォーマンスと信頼性が維持されることを確認しています。同じデータセットに対するクエリは、ワークスペース内のアクティブな時系列数に関係なく、パフォーマンスの低下がないはずです。

1. **製品 FAQ** [https://aws.amazon.com/prometheus/faqs/]()
