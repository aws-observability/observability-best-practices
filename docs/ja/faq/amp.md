# Amazon Managed Service for Prometheus - よくある質問

1. **現在どの AWS リージョンがサポートされていますか? 他のリージョンからメトリクスを収集することは可能ですか?** サポートしているリージョンの最新リストは、[ドキュメント](https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/what-is-Amazon-Managed-Service-Prometheus.html) をご覧ください。2023年にはすべての商用リージョンをサポートする計画です。優先順位をより適切に設定できるよう、サポートが必要なリージョンをお知らせください。特定のサポート対象リージョンにデータを送信することで、任意のリージョンからデータを収集できます。詳細はこちらのブログをご覧ください: [Amazon Managed Service for Prometheus のクロスリージョンメトリクス収集の設定](https://aws.amazon.com/blogs/opensource/set-up-cross-region-metrics-collection-for-amazon-managed-service-for-prometheus-workspaces/)。

1. **Cost Explorer や [CloudWatch の AWS 課金情報](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/gs_monitor_estimated_charges_with_cloudwatch.html) で課金やメータリングを確認するまでにどのくらい時間がかかりますか?**
   取り込まれたメトリクス サンプルのブロックは、2 時間ごとに S3 にアップロードされるたびに即座に課金されます。Amazon Managed Service for Prometheus のメータリングと料金が報告されるまでに最大 3 時間かかる場合があります。

1. **Prometheus サービスは、クラスター (EKS/ECS) からメトリクスをスクレイピングできるだけのようですが、そうでしょうか?**
   他のコンピュート環境に関するドキュメントが不足していることをお詫び申し上げます。Prometheus サーバーを使用して、[EC2 から Prometheus メトリクスをスクレイピング](https://aws.amazon.com/jp/blogs/news/using-amazon-managed-service-for-prometheus-to-monitor-ec2-environments/)したり、Prometheus サーバーをインストールできるコンピュート環境ならどこからでもメトリクスを収集できます。リモートライトの設定と [AWS SigV4 プロキシ](https://github.com/awslabs/aws-sigv4-proxy) のセットアップが必要です。[EC2 ブログ](https://aws.amazon.com/jp/blogs/news/using-amazon-managed-service-for-prometheus-to-monitor-ec2-environments/) の「aws-sigv4-proxy の実行」というセクションで、AWS SigV4 の実行方法を確認できます。他のコンピュート環境で AWS SigV4 を実行する方法を簡略化するためのドキュメントを追加する必要があります。

1. **このサービスを Grafana に接続するにはどうすればよいでしょうか? 関連ドキュメントはありますか?**
   Amazon Managed Service for Prometheus を PromQL を使用してクエリするために、Grafana で利用できるデフォルトの [Prometheus データソース](https://grafana.com/docs/grafana/latest/datasources/prometheus/) を使用します。以下のドキュメントとブログが開始するのに役立ちます。

   1. [サービスドキュメント](https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/AMP-onboard-query.html)
   1. [EC2 上での Grafana の設定](https://aws.amazon.com/jp/blogs/news/setting-up-grafana-on-ec2-to-query-metrics-from-amazon-managed-service-for-prometheus/)

1. **Amazon Managed Service for Prometheus に送信されるサンプル数を減らすためのベストプラクティスは何ですか?**
   Amazon Managed Service for Prometheus に取り込まれるサンプル数を減らすには、スクレイプ間隔を延長する (30 秒から 1 分に変更など) か、スクレイプする時系列の数を減らします。スクレイプ間隔を変更するほうが、時系列数を減らすよりもサンプル数に大きな影響を与えます。スクレイプ間隔を2倍にすると、取り込まれるサンプル量が半分になります。

1. **CloudWatch メトリクスを Amazon Managed Service for Prometheus に送信するにはどうすればよいですか?**
   CloudWatch メトリクスを Amazon Managed Service for Prometheus に送信するには、[CloudWatch メトリクスストリームを利用することをおすすめします](/observability-best-practices/ja/recipes/recipes/lambda-cw-metrics-go-amp/)。この統合には、次のような短所があります。

   1. Amazon Managed Service for Prometheus API を呼び出す Lambda 関数が必要
   1. CloudWatch メトリクスにメタデータ (AWS タグなど) を追加してから Amazon Managed Service for Prometheus に取り込むことができない
   1. メトリクスを名前空間でしかフィルタリングできない (細かい制御ができない)

   代替策として、Prometheus Exporter を利用して CloudWatch メトリクスデータを Amazon Managed Service for Prometheus に送信できます。

   1. CloudWatch Exporter: CW ListMetrics API と GetMetricStatistics API を使用してスクレイピングする Java ベースのツール
   1. [**Yet Another CloudWatch Exporter (YACE)**](https://github.com/nerdswords/yet-another-cloudwatch-exporter): CW ListMetrics API、GetMetricData API、GetMetricStatistics API を使用して CloudWatch からメトリクスを取得する Go ベースのツール

   この方法の短所は、エージェントをデプロイしてライフサイクルを管理する必要があることです。注意深く実装する必要があります。

1. **どのバージョンの Prometheus と互換性がありますか?**
   Amazon Managed Service for Prometheus は、[Prometheus 2.x](https://github.com/prometheus/prometheus/blob/main/RELEASE.md) と互換性があります。データプレーンとしてオープンソースの [CNCF Cortex プロジェクト](https://cortexmetrics.io/) をベースに構築されています。Cortex は Prometheus (/prometheus/* と /api/prom/* の下) と 100% API 互換を目指しています。Prometheus 互換の PromQL クエリ、リモートライトによるメトリクス取り込み、Gauge、Counter、Summary、Histogram などの既存のメトリクス タイプの Prometheus データモデルをサポートしています。現在、[すべての Cortex API](https://cortexmetrics.io/docs/api/) を公開しているわけではありません。サポートしている互換 API のリストは、[こちらで確認できます](https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/AMP-APIReference.html)。Amazon Managed Service for Prometheus で必要な機能がない場合は、アカウント チームと連携して新規または既存の製品機能リクエスト (PFR) を開くことができます。

1. **Amazon Managed Service for Prometheus にメトリクスを取り込むために推奨するコレクターは何ですか? Prometheus のエージェントモードを利用する必要がありますか?**
   Prometheus サーバー(エージェントモードを含む)、OpenTelemetry エージェント、AWS Distro for OpenTelemetry エージェントのいずれも、Amazon Managed Service for Prometheus にメトリクスデータを送信するエージェントとして利用できます。AWS Distro for OpenTelemetry は、AWS によってパッケージ化および保護された OpenTelemetry プロジェクトのダウンストリーム配布です。3つのいずれかを選択できます。チームのニーズと好みに最も適したものを選んでください。

1. **ワークスペースのサイズに応じて、Amazon Managed Service for Prometheus のパフォーマンスはどのようにスケールしますか?**
   現在、Amazon Managed Service for Prometheus は、単一のワークスペースで最大 2 億のアクティブな時系列をサポートしています。新しい上限を発表する際は、サービスのパフォーマンスと信頼性が維持されることを確認しています。ワークスペース内のアクティブな時系列数に関係なく、同じデータセットに対するクエリのパフォーマンスが低下することはありません。

1. **製品 FAQ** [https://aws.amazon.com/prometheus/faqs/]()
