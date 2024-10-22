# Amazon Managed Service for Prometheus - FAQ

1. **現在サポートされている AWS リージョンはどこですか。また、他のリージョンからメトリクスを収集することは可能ですか?** 現在サポートしているリージョョンの最新リストは、[ドキュメント](https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/what-is-Amazon-Managed-Service-Prometheus.html)をご覧ください。2023 年中にすべての商用リージョンをサポートする予定です。優先的にサポートしてほしいリージョンがあれば教えてください。そうすれば、既存の製品機能リクエスト (PFR) の優先順位付けに役立ちます。サポートしているリージョンであれば、どのリージョンからでもデータを収集し、送信することができます。詳細については、次のブログをご覧ください。[Cross-region metrics collection for Amazon Managed Service for Prometheus](https://aws.amazon.com/blogs/opensource/set-up-cross-region-metrics-collection-for-amazon-managed-service-for-prometheus-workspaces/)。

2. **Cost Explorer または [CloudWatch での AWS 課金料金](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/gs_monitor_estimated_charges_with_cloudwatch.html)で課金やメータリングが表示されるまでにどのくらい時間がかかりますか?** 2 時間ごとに S3 にアップロードされた取り込みメトリクスサンプルのブロックは、すぐにメータリングされます。Amazon Managed Service for Prometheus の課金やメータリングが報告されるまでに最大 3 時間かかる場合があります。

3. **Prometheus サービスは、クラスター (EKS/ECS) からのメトリクスのスクレイピングしかできないようですが、これは正しいでしょうか?** ドキュメントに他のコンピューティング環境に関する情報がなく、申し訳ありません。[EC2 からの Prometheus メトリクス](https://aws.amazon.com/jp/blogs/news/using-amazon-managed-service-for-prometheus-to-monitor-ec2-environments/)や、Prometheus サーバーをインストールできる他のコンピューティング環境からも、リモートライトを設定し、[AWS SigV4 プロキシ](https://github.com/awslabs/aws-sigv4-proxy)を設定すれば、Prometheus サーバーを使ってメトリクスをスクレイピングできます。[EC2 ブログ](https://aws.amazon.com/jp/blogs/news/using-amazon-managed-service-for-prometheus-to-monitor-ec2-environments/)には、「AWS SigV4 プロキシの実行」という項目があり、実行方法が示されています。他のコンピューティング環境で AWS SigV4 を実行する方法をドキュメントに追加する必要があります。

4. **このサービスを Grafana に接続するにはどうすればよいでしょうか。ドキュメントはありますか?** Grafana の [Prometheus データソース](https://grafana.com/docs/grafana/latest/datasources/prometheus/)を使って、PromQL で Amazon Managed Service for Prometheus を照会します。次のドキュメントとブログが役立つはずです。
    1. [サービスドキュメント](https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/AMP-onboard-query.html)
    2. [EC2 上の Grafana のセットアップ](https://aws.amazon.com/jp/blogs/news/setting-up-grafana-on-ec2-to-query-metrics-from-amazon-managed-service-for-prometheus/)

5. **Amazon Managed Service for Prometheus に送信されるサンプル数を減らすためのベストプラクティスは何ですか?** Amazon Managed Service for Prometheus に取り込まれるサンプル数を減らすには、スクレイプ間隔を延長する (30 秒から 1 分に変更するなど) か、スクレイピングしているシリーズの数を減らすことができます。スクレイプ間隔を変更した方が、シリーズ数を減らすよりも取り込まれるサンプル数への影響が大きく、スクレイプ間隔を 2 倍にすると取り込まれるサンプル数は半分になります。

6. **CloudWatch メトリクスを Amazon Managed Service for Prometheus に送信するにはどうすればよいですか?** [CloudWatch メトリクススト リームを使って CloudWatch メトリクスを Amazon Managed Service for Prometheus に送信する](https://aws-observability.github.io/observability-best-practices/recipes/recipes/lambda-cw-metrics-go-amp/)ことをおすすめします。この統合には次のような欠点があります。
    1. Amazon Managed Service for Prometheus API を呼び出す Lambda 関数が必要
    2. CloudWatch メトリクスを Amazon Managed Service for Prometheus に取り込む前に、メタデータ (AWS タグなど) を付加する機能がない
    3. 名前空間でのみメトリクスをフィルタリングできる (十分に細かくない)。代替案として、Prometheus Exporter を使って CloudWatch メトリクスデータを Amazon Managed Service for Prometheus に送信することができます。(1) CloudWatch Exporter: CW ListMetrics および GetMetricStatistics (GMS) API を使用する Java ベースのスクレイピング。

    [Yet Another CloudWatch Exporter (YACE)](https://github.com/nerdswords/yet-another-cloudwatch-exporter) は、CloudWatch から Amazon Managed Service for Prometheus にメトリクスを取得する別の選択肢です。これは、CW ListMetrics、GetMetricData (GMD)、GetMetricStatistics (GMS) API を使用する Go ベースのツールです。このツールを使う欠点は、エージェントをデプロイしてライフサイクルを自分で管理する必要があり、慎重に行う必要があることです。

7. **どのバージョンの Prometheus と互換性がありますか?** Amazon Managed Service for Prometheus は [Prometheus 2.x](https://github.com/prometheus/prometheus/blob/main/RELEASE.md) と互換性があります。Amazon Managed Service for Prometheus は、データプレーンとしてオープンソースの [CNCF Cortex プロジェクト](https://cortexmetrics.io/)をベースにしています。Cortex は Prometheus との 100% の API 互換性を目指しています (/prometheus/* および /api/prom/* 以下)。Amazon Managed Service for Prometheus は、Prometheus 互換の PromQL クエリ、リモートライトメトリクス取り込み、Gauge、Counter、Summary、Histogram を含む既存のメトリクスタイプの Prometheus データモデルをサポートしています。現在、[すべての Cortex API](https://cortexmetrics.io/docs/api/) を公開していません。サポートしている互換 API のリストは[こちら](https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/AMP-APIReference.html)にあります。Amazon Managed Service for Prometheus で必要な機能が不足している場合は、アカウントチームに連絡して新しい製品機能リクエスト (PFR) を作成するか、既存の PFR に影響を与えることができます。

8. **Amazon Managed Service for Prometheus にメトリクスを取り込むためのコレクターとして何をおすすめしますか? Prometheus のエージェントモードを利用すべきでしょうか?** Prometheus サーバー (エージェントモードを含む)、OpenTelemetry エージェント、AWS Distro for OpenTelemetry エージェントを使って、メトリクスデータを Amazon Managed Service for Prometheus に送信することができます。AWS Distro for OpenTelemetry は、OpenTelemetry プロジェクトの下流ディストリビューションで、AWS によってパッケージ化およびセキュリティ対策が施されています。いずれでも構いません。チームのニーズと好みに最も合ったものを選んでください。

9. **Amazon Managed Service for Prometheus のパフォーマンスは、ワークスペースのサイズによってどのように拡張しますか?** 現在、Amazon Managed Service for Prometheus は、単一のワークスペースで最大 200 万の有効な時系列をサポートしています。新しい上限を発表する際は、取り込みとクエリにおけるサービスのパフォーマンスと信頼性が維持されることを確認しています。ワークスペースの有効シリーズ数に関係なく、同じサイズのデータセットに対するクエリのパフォーマンスは低下しません。

10. **製品 FAQ** [https://aws.amazon.com/jp/prometheus/faqs/](.)
