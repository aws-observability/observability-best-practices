# Amazon Managed Service for Prometheus - FAQ

## 現在サポートされている AWS リージョンはどれですか。また、他のリージョンからメトリクスを収集することは可能ですか。

サポートしているリージョンの最新リストについては、[ドキュメント](https://docs.aws.amazon.com/prometheus/latest/userguide/what-is-Amazon-Managed-Service-Prometheus.html)を参照してください。既存のプロダクト機能リクエスト (PFR) の優先順位をより適切に設定できるよう、ご希望のリージョンをお知らせください。任意のリージョンからデータを収集し、サポートしている特定のリージョンに送信することは常に可能です。詳細については、次のブログを参照してください。[Amazon Managed Service for Prometheus のクロスリージョンメトリクス収集](https://aws.amazon.com/blogs/opensource/set-up-cross-region-metrics-collection-for-amazon-managed-service-for-prometheus-workspaces/)

## Cost Explorer または [CloudWatch の AWS 請求料金](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/gs_monitor_estimated_charges_with_cloudwatch.html)でメータリングや請求を確認できるようになるまでどのくらいかかりますか?

取り込まれたメトリクスサンプルのブロックは、2 時間ごとに S3 にアップロードされるとすぐに測定されます。Amazon Managed Service for Prometheus の測定と料金がレポートされるまでに最大 3 時間かかる場合があります。

## Prometheus Service はクラスター (EKS/ECS) からのみメトリクスをスクレイピングできますか?

他のコンピューティング環境に関するドキュメントが不足していることをお詫び申し上げます。現在、Prometheus サーバーを使用して [EC2 から Prometheus メトリクスをスクレイピング](https://aws.amazon.com/blogs/opensource/using-amazon-managed-service-for-prometheus-to-monitor-ec2-environments/)することや、Prometheus サーバーをインストールできる他のコンピューティング環境からメトリクスを取得することができます。ただし、リモート書き込みを設定し、[AWS SigV4 プロキシ](https://github.com/awslabs/aws-sigv4-proxy)をセットアップする必要があります。[EC2 ブログ](https://aws.amazon.com/blogs/opensource/using-amazon-managed-service-for-prometheus-to-monitor-ec2-environments/)へのリンクには「Running aws-sigv4-proxy」というセクションがあり、実行方法を確認できます。他のコンピューティング環境で AWS SigV4 を実行する方法を簡素化するために、お客様を支援するドキュメントをさらに追加する必要があります。

## Amazon Managed Service for Prometheus を Grafana に接続するにはどうすればよいですか？ドキュメントはありますか？

Amazon Managed Service for Prometheus を PromQL でクエリするために、[Grafana で利用可能なデフォルトの Prometheus データソース](https://grafana.com/docs/grafana/latest/datasources/prometheus/)を使用します。開始するのに役立つドキュメントとブログを以下に示します。
1. [サービスドキュメント](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-onboard-query.html)
1. [EC2 での Grafana セットアップ](https://aws.amazon.com/blogs/opensource/setting-up-grafana-on-ec2-to-query-metrics-from-amazon-managed-service-for-prometheus/)

## Amazon Managed Service for Prometheus に送信されるサンプル数を削減するためのベストプラクティスは何ですか？

Amazon Managed Service for Prometheus に取り込まれるサンプル数を削減するには、スクレイプ間隔を延長する（例：30秒から1分に変更）か、スクレイプするシリーズ数を減らすことができます。スクレイプ間隔の変更は、シリーズ数を減らすよりもサンプル数に劇的な影響を与えます。スクレイプ間隔を2倍にすると、取り込まれるサンプル量が半分になります。

## CloudWatch メトリクスを Amazon Managed Service for Prometheus に送信するにはどうすればよいですか?

CloudWatch メトリクスを Amazon Managed Service for Prometheus に送信するために、[CloudWatch メトリクスストリームを使用すること](/observability-best-practices/ja/recipes/recipes/lambda-cw-metrics-go-amp/)を推奨します。この統合には、次のような欠点がある可能性があります。
1. Amazon Managed Service for Prometheus API を呼び出すために Lambda 関数が必要です。
1. Amazon Managed Service for Prometheus に取り込む前に、CloudWatch メトリクスをメタデータ（AWS タグなど）で強化する機能がありません。
1. メトリクスは名前空間でのみフィルタリングできます（十分に細かくありません）。代替手段として、お客様は Prometheus Exporter を使用して CloudWatch メトリクスデータを Amazon Managed Service for Prometheus に送信できます。(1) CloudWatch Exporter: CW ListMetrics および GetMetricStatistics (GMS) API を使用する Java ベースのスクレイピングです。

[**Yet Another CloudWatch Exporter (YACE)**](https://github.com/nerdswords/yet-another-cloudwatch-exporter) は、CloudWatch から Amazon Managed Service for Prometheus にメトリクスを取得するもう 1 つのオプションです。これは、CW ListMetrics、GetMetricData (GMD)、および GetMetricStatistics (GMS) API を使用する Go ベースのツールです。これを使用する場合のいくつかの欠点として、エージェントをデプロイし、ライフサイクルを自分で管理する必要があり、慎重に行う必要があることが挙げられます。

## Amazon Managed Service for Prometheus はどのバージョンの Prometheus と互換性がありますか?

Amazon Managed Service for Prometheus は [Prometheus 2.x](https://github.com/prometheus/prometheus/blob/main/RELEASE.md) と互換性があります。Amazon Managed Service for Prometheus は、データプレーンとしてオープンソースの [CNCF Cortex プロジェクト](https://cortexmetrics.io/)をベースにしています。Cortex は、Prometheus と 100% API 互換性を持つことを目指しています（/prometheus/* および /api/prom/* 配下）。Amazon Managed Service for Prometheus は、Prometheus 互換の PromQL クエリ、Remote write メトリクス取り込み、および Gauge、Counters、Summary、Histogram を含む既存のメトリクスタイプ用の Prometheus データモデルをサポートしています。現在、[すべての Cortex API](https://cortexmetrics.io/docs/api/) を公開しているわけではありません。サポートしている互換性のある API のリストは[こちら](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-APIReference.html)で確認できます。Amazon Managed Service for Prometheus に必要な機能が不足している場合、お客様はアカウントチームと協力して、新しい製品機能リクエスト (PFR) を開くか、既存のリクエストに影響を与えることができます。

## Amazon Managed Service for Prometheus にメトリクスを取り込むために推奨されるコレクターは何ですか？Prometheus を Agent モードで使用すべきですか？

Amazon Managed Service for Prometheus にメトリクスデータを送信するためにお客様が使用できるエージェントとして、エージェントモードを含む Prometheus サーバー、OpenTelemetry エージェント、および AWS Distro for OpenTelemetry エージェントの使用をサポートしています。AWS Distro for OpenTelemetry は、AWS によってパッケージ化され、セキュリティが確保された OpenTelemetry プロジェクトのダウンストリームディストリビューションです。3 つのうちどれでも問題なく、個々のチームのニーズや好みに最も適したものを自由に選択できます。

## Amazon Managed Service for Prometheus のパフォーマンスは、ワークスペースのサイズに応じてどのようにスケールしますか？

現在、Amazon Managed Service for Prometheus は、単一のワークスペースで最大 200M のアクティブな時系列をサポートしています。新しい最大制限を発表する際には、取り込みとクエリ全体でサービスのパフォーマンスと信頼性のプロパティが引き続き維持されることを保証しています。同じサイズのデータセットに対するクエリは、ワークスペース内のアクティブな系列の数に関係なく、パフォーマンスの低下が発生しないはずです。

**製品 FAQ:** [https://aws.amazon.com/prometheus/faqs/](https://aws.amazon.com/prometheus/faqs/)
