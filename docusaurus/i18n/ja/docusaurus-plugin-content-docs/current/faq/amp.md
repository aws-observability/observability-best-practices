# Amazon Managed Service for Prometheus - よくある質問




## 現在サポートされている AWS リージョンはどこで、他のリージョンからメトリクスを収集することは可能ですか？

サポートしているリージョンの最新リストについては、[ドキュメント](https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/what-is-Amazon-Managed-Service-Prometheus.html) をご覧ください。
既存の製品機能リクエスト (PFR) の優先順位付けに役立てるため、どのリージョンが必要かお知らせください。
サポートしているリージョンに対して、任意のリージョンからデータを収集して送信することは常に可能です。
詳細については、以下のブログをご覧ください：[Cross-region metrics collection for Amazon Managed Service for Prometheus](https://aws.amazon.com/blogs/opensource/set-up-cross-region-metrics-collection-for-amazon-managed-service-for-prometheus-workspaces/)。



## Cost Explorer または [CloudWatch の AWS 請求料金](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/gs_monitor_estimated_charges_with_cloudwatch.html) で課金や使用量を確認するまでにどのくらい時間がかかりますか？

取り込まれたメトリクスのサンプルブロックは、2 時間ごとに S3 にアップロードされた時点で計測されます。Amazon Managed Service for Prometheus の使用量と料金が報告されるまでに最大 3 時間かかる場合があります。




## Prometheus サービスはクラスター (EKS/ECS) からのメトリクスのスクレイピングしかできないのですか？

他のコンピューティング環境に関するドキュメントが不足していることをお詫びいたします。[AWS SigV4 プロキシ](https://github.com/awslabs/aws-sigv4-proxy) を設定し、リモートライトを構成すれば、[EC2 からの Prometheus メトリクス](https://aws.amazon.com/jp/blogs/news/using-amazon-managed-service-for-prometheus-to-monitor-ec2-environments/) や、現在 Prometheus サーバーをインストールできる他のコンピューティング環境からもスクレイピングできます。[EC2 のブログ](https://aws.amazon.com/jp/blogs/news/using-amazon-managed-service-for-prometheus-to-monitor-ec2-environments/) には「Running aws-sigv4-proxy」というセクションがあり、その実行方法が説明されています。他のコンピューティング環境での AWS SigV4 の実行を簡素化するために、より多くのドキュメントを追加する必要があります。



## Amazon Managed Service for Prometheus を Grafana に接続するにはどうすればよいですか？ドキュメントはありますか？

PromQL を使用して Amazon Managed Service for Prometheus にクエリを実行するには、Grafana で利用可能な [Prometheus データソース](https://grafana.com/docs/grafana/latest/datasources/prometheus/) を使用します。以下のドキュメントとブログが参考になります：
1. [サービスドキュメント](https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/AMP-onboard-query.html)
1. [EC2 での Grafana セットアップ](https://aws.amazon.com/jp/blogs/news/setting-up-grafana-on-ec2-to-query-metrics-from-amazon-managed-service-for-prometheus/)



## Amazon Managed Service for Prometheus に送信されるサンプル数を削減するためのベストプラクティスは何ですか？

Amazon Managed Service for Prometheus に取り込まれるサンプル数を削減するために、スクレイプ間隔を延長する（例：30 秒から 1 分に変更）か、スクレイプするシリーズの数を減らすことができます。
スクレイプ間隔を変更することは、シリーズ数を減らすよりも取り込まれるサンプル数に大きな影響を与えます。
スクレイプ間隔を 2 倍にすると、取り込まれるサンプル量は半分になります。



## CloudWatch メトリクスを Amazon Managed Service for Prometheus に送信するにはどうすればよいですか？

[CloudWatch メトリクスストリームを使用して CloudWatch メトリクスを Amazon Managed Service for Prometheus に送信する](/observability-best-practices/ja/recipes/recipes/lambda-cw-metrics-go-amp/) ことをお勧めします。この統合には以下のような制限があります。

1. Amazon Managed Service for Prometheus API を呼び出すために Lambda 関数が必要です。
1. CloudWatch メトリクスを Amazon Managed Service for Prometheus に取り込む前にメタデータ (AWS タグなど) で強化する機能がありません。
1. メトリクスは名前空間でのみフィルタリングできます (十分な粒度ではありません)。代替手段として、お客様は Prometheus Exporter を使用して CloudWatch メトリクスデータを Amazon Managed Service for Prometheus に送信できます: (1) CloudWatch Exporter: CW ListMetrics と GetMetricStatistics (GMS) API を使用する Java ベースのスクレイピング。

[**Yet Another CloudWatch Exporter (YACE)**](https://github.com/nerdswords/yet-another-cloudwatch-exporter) は、CloudWatch から Amazon Managed Service for Prometheus にメトリクスを取得するもう 1 つのオプションです。これは CW ListMetrics、GetMetricData (GMD)、GetMetricStatistics (GMS) API を使用する Go ベースのツールです。これを使用する場合の欠点として、エージェントをデプロイし、そのライフサイクルを慎重に管理する必要があることが挙げられます。



## Amazon Managed Service for Prometheus は、どのバージョンの Prometheus と互換性がありますか？

Amazon Managed Service for Prometheus は、[Prometheus 2.x](https://github.com/prometheus/prometheus/blob/main/RELEASE.md) と互換性があります。
Amazon Managed Service for Prometheus は、データプレーンとしてオープンソースの [CNCF Cortex プロジェクト](https://cortexmetrics.io/) をベースにしています。
Cortex は、Prometheus との 100% の API 互換性 (/prometheus/* および /api/prom/* の下) を目指しています。
Amazon Managed Service for Prometheus は、Prometheus 互換の PromQL クエリ、Remote write メトリクス取り込み、および Gauge、Counters、Summary、Histogram などの既存のメトリクスタイプに対応する Prometheus データモデルをサポートしています。
現在、[すべての Cortex API](https://cortexmetrics.io/docs/api/) を公開しているわけではありません。
サポートしている互換 API のリストは[こちら](https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/AMP-APIReference.html)で確認できます。
Amazon Managed Service for Prometheus で必要な機能が不足している場合、お客様はアカウントチームと協力して、新しい製品機能リクエスト (PFR) を作成したり、既存の PFR に影響を与えたりすることができます。



## Amazon Managed Service for Prometheus にメトリクスを取り込むために、どのコレクターを推奨しますか？ Prometheus をエージェントモードで使用すべきですか？

エージェントモードを含む Prometheus サーバー、OpenTelemetry エージェント、AWS Distro for OpenTelemetry エージェントを、Amazon Managed Service for Prometheus にメトリクスデータを送信するためのエージェントとしてサポートしています。
AWS Distro for OpenTelemetry は、AWS によってパッケージ化され、セキュリティが確保された OpenTelemetry プロジェクトのダウンストリーム配布版です。
これら 3 つのいずれも問題なく使用でき、チームのニーズと好みに最も適したものを選択していただけます。



## Amazon Managed Service for Prometheus のパフォーマンスは、ワークスペースのサイズに応じてどのようにスケールしますか？

現在、Amazon Managed Service for Prometheus は、単一のワークスペースで最大 2 億の有効な時系列をサポートしています。
新しい最大制限を発表する際は、取り込みとクエリの両方で、サービスのパフォーマンスと信頼性が維持されることを確認しています。
同じサイズのデータセットに対するクエリは、ワークスペース内の有効な時系列の数に関係なく、パフォーマンスの低下を経験することはありません。

**製品 FAQ:** [https://aws.amazon.com/jp/prometheus/faqs/](https://aws.amazon.com/jp/prometheus/faqs/)
