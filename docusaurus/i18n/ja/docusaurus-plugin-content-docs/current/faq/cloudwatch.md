# Amazon CloudWatch - よくある質問




## なぜ Amazon CloudWatch を選ぶべきなのか？

Amazon CloudWatch は、AWS のクラウドネイティブサービスで、AWS クラウドリソースと AWS 上で実行するアプリケーションの統合的なオブザーバビリティを単一のプラットフォームで提供します。
Amazon CloudWatch は、[ログ](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html)の形式でモニタリングと運用データを収集し、[メトリクス](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/working_with_metrics.html)、[イベント](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/events/WhatIsCloudWatchEvents.html)を追跡し、[アラーム](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html)を設定することができます。
また、AWS リソース、アプリケーション、AWS および[オンプレミスサーバー](https://aws.amazon.com/blogs/mt/how-to-monitor-hybrid-environment-with-aws-services/)で実行されるサービスの[統合ビュー](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Dashboards.html)を提供します。
Amazon CloudWatch は、リソース使用率、アプリケーションのパフォーマンス、ワークロードの運用状態についてシステム全体の可視性を提供します。
Amazon CloudWatch は、AWS、ハイブリッド、オンプレミスのアプリケーションとインフラストラクチャリソースに対する[実用的なインサイト](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-Insights-Sections.html)を提供します。
[クロスアカウントオブザーバビリティ](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-Unified-Cross-Account.html)は、CloudWatch の統合オブザーバビリティ機能に追加された機能です。




## どの AWS サービスが Amazon CloudWatch および Amazon CloudWatch Logs とネイティブに統合されていますか？

Amazon CloudWatch は 70 以上の AWS サービスとネイティブに統合されており、お客様は追加の作業なしでインフラストラクチャメトリクスを収集し、シンプルなモニタリングとスケーラビリティを実現できます。
サポートされている [CloudWatch メトリクスを公開する AWS サービス](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/aws-services-cloudwatch-metrics.html) の完全なリストについてはドキュメントをご確認ください。
現在、30 以上の AWS サービスが CloudWatch にログを公開しています。
サポートされている [CloudWatch Logs にログを公開する AWS サービス](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/aws-services-sending-logs.html) の完全なリストについてはドキュメントをご確認ください。



## AWS サービスから Amazon CloudWatch に公開されているすべてのメトリクスのリストはどこで入手できますか？

[メトリクスを公開する AWS サービス](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/aws-services-cloudwatch-metrics.html) の一覧は、AWS ドキュメントに記載されています。




## Amazon CloudWatch でメトリクスの収集とモニタリングを始めるにはどうすればよいですか？

[Amazon CloudWatch は様々な AWS サービスからメトリクスを収集](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/working_with_metrics.html)し、[AWS マネジメントコンソール、AWS CLI、または API](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/viewing_metrics_with_cloudwatch.html) を通じて確認できます。Amazon CloudWatch は Amazon EC2 インスタンスの[利用可能なメトリクス](https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/viewing_metrics_with_cloudwatch.html)を収集します。追加のカスタムメトリクスについては、統合された CloudWatch エージェントを使用して収集とモニタリングを行うことができます。

> 関連する AWS オブザーバビリティワークショップ: [メトリクス](https://catalog.workshops.aws/observability/en-US/aws-native/metrics)



## Amazon EC2 インスタンスに非常に詳細なレベルのモニタリングが必要な場合、どうすればよいですか？

デフォルトでは、Amazon EC2 は 5 分間隔でメトリクスデータを CloudWatch に送信し、インスタンスの基本モニタリングを行います。
インスタンスのメトリクスデータを 1 分間隔で CloudWatch に送信するには、インスタンスで[詳細モニタリング](https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/using-cloudwatch-new.html)を有効にすることができます。



## アプリケーション用の独自のメトリクスを公開したい場合、どのような選択肢がありますか？

お客様は、API または CLI を使用して、1 分間の標準解像度または 1 秒間隔までの高解像度で、[カスタムメトリクス](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/publishingMetrics.html) を CloudWatch に公開することもできます。

CloudWatch エージェントは、特殊なシナリオでの EC2 インスタンスからのカスタムメトリクスの収集もサポートしています。例えば、Elastic Network Adapter (ENA) を使用する Linux 上の [EC2 インスタンスのネットワークパフォーマンスメトリクス](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-network-performance.html)、Linux サーバーからの [NVIDIA GPU メトリクス](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-NVIDIA-GPU.html)、そして procstat プラグインを使用した Linux および Windows サーバー上の[個別のプロセス](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-procstat-process-metrics.html)からのプロセスメトリクスなどです。

> 関連する AWS オブザーバビリティワークショップ: [パブリックカスタムメトリクス](https://catalog.workshops.aws/observability/en-US/aws-native/metrics/publishmetrics)



## Amazon CloudWatch エージェントを使用したカスタムメトリクス収集のためのサポートについて

アプリケーションやサービスからのカスタムメトリクスは、[StatsD](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-custom-metrics-statsd.html) または [collectd](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-custom-metrics-collectd.html) プロトコルをサポートする統合された CloudWatch エージェントを使用して取得できます。

StatsD は、さまざまなアプリケーションからメトリクスを収集できる一般的なオープンソースソリューションです。
StatsD は、Linux と Windows の両方のサーバーをサポートしており、独自のメトリクスを計測するのに特に便利です。

collectd プロトコルは、Linux サーバーのみをサポートする一般的なオープンソースソリューションで、プラグインを使用してさまざまなアプリケーションのシステム統計情報を収集できます。




## ワークロードに多くの一時的なリソースが含まれ、高カーディナリティのログを生成する場合、メトリクスとログを収集・測定するための推奨アプローチは何ですか？

[CloudWatch 埋め込みメトリクスフォーマット](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html) を使用すると、お客様は複雑な高カーディナリティのアプリケーションデータをログ形式で取り込み、Lambda 関数やコンテナなどの一時的なリソースからアクション可能なメトリクスを生成できます。これにより、お客様は個別のコードを実装または維持することなく、詳細なログイベントデータと一緒にカスタムメトリクスを埋め込むことができます。また、ログデータに対する強力な分析機能を得ることができ、CloudWatch は自動的にカスタムメトリクスを抽出してデータの可視化やリアルタイムのインシデント検出のためのアラーム設定を支援します。

> 関連する AWS オブザーバビリティワークショップ: [埋め込みメトリクスフォーマット](https://catalog.workshops.aws/observability/en-US/aws-native/metrics/emf)




## Amazon CloudWatch でログを収集・監視するにはどうすればよいですか？

[Amazon CloudWatch Logs](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html) は、既存のシステム、アプリケーション、カスタムログファイルを使用して、ほぼリアルタイムでシステムとアプリケーションの監視とトラブルシューティングを行うことができます。[統合された CloudWatch エージェント](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/CWL_GettingStarted.html) をインストールすることで、[Amazon EC2 インスタンスとオンプレミスサーバーからのログ](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html) を CloudWatch に収集できます。

> 関連する AWS オブザーバビリティワークショップ: [Log Insights](https://catalog.workshops.aws/observability/en-US/aws-native/logs/logsinsights)



## CloudWatch エージェントとは何か、なぜ使用すべきなのか？

[統合された CloudWatch エージェント](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html) は、x86-64 および ARM64 アーキテクチャを使用するほとんどのオペレーティングシステムをサポートする MIT ライセンスのオープンソースソフトウェアです。
CloudWatch エージェントは、オペレーティングシステム全体で Amazon EC2 インスタンスとオンプレミスサーバーからシステムレベルのメトリクスを収集し、アプリケーションやサービスからカスタムメトリクスを取得し、Amazon EC2 インスタンスとオンプレミスサーバーからログを収集するのに役立ちます。



## 環境内にさまざまな規模のインストールが必要な場合、CloudWatch エージェントを通常のインストールと自動化を使用してどのように導入できますか？

Linux や Windows Server などのサポートされているすべてのオペレーティングシステムで、[コマンドライン](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/installing-cloudwatch-agent-commandline.html)、AWS [Systems Manager](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/installing-cloudwatch-agent-ssm.html)、または AWS [CloudFormation テンプレート](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent-New-Instances-CloudFormation.html) を使用して [CloudWatch エージェントをインストール](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-on-EC2-Instance.html) できます。また、監視のために [オンプレミスサーバーに CloudWatch エージェントをインストール](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-on-premise.html) することもできます。



## 組織内に複数のリージョンにまたがる複数の AWS アカウントがありますが、Amazon CloudWatch はこのようなシナリオに対応していますか？

Amazon CloudWatch は、[クロスアカウントオブザーバビリティ](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-Unified-Cross-Account.html)を提供しており、リージョン内の複数のアカウントにまたがるリソースとアプリケーションの健全性を監視およびトラブルシューティングするのに役立ちます。
また、Amazon CloudWatch は[クロスアカウント、クロスリージョンダッシュボード](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/Cross-Account-Cross-Region.html)も提供しています。
この機能により、お客様はマルチアカウント、マルチリージョンのリソースとワークロードの可視性とインサイトを得ることができます。



## Amazon CloudWatch にはどのような自動化サポートがありますか？

AWS マネジメントコンソールを通じた Amazon CloudWatch へのアクセスに加えて、お客様は API、[AWS コマンドラインインターフェイス (CLI)](https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/getting-started-install.html)、[AWS SDK](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/sdk-general-information-section.html) を通じてもサービスにアクセスできます。

メトリクスとダッシュボード用の [CloudWatch API](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/APIReference/Welcome.html) は、[AWS CLI](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/cli/Welcome.html) を通じた自動化やソフトウェア/製品との統合を支援し、リソースやアプリケーションの管理や運用にかかる時間を削減できます。

ログ用の [CloudWatch API](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatchLogs/latest/APIReference/Welcome.html) と [AWS CLI](https://docs.aws.amazon.com/ja_jp/cli/latest/reference/logs/index.html) も個別に利用可能です。

お客様の参考として、[AWS SDK を使用した CloudWatch のコード例](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/service_code_examples.html) も用意されています。



## リソースのモニタリングをすぐに始めたい場合、推奨されるアプローチは何ですか？

CloudWatch の自動ダッシュボードは、すべての AWS パブリックリージョンで利用可能で、すべての AWS リソースの健全性とパフォーマンスの集約ビューを提供します。
これにより、お客様はモニタリングをすぐに開始でき、リソースベースのメトリクスとアラームのビューを確認し、パフォーマンスの問題の根本原因を容易に特定できます。
[自動ダッシュボード](https://docs.aws.amazon.com/ja_jp/prescriptive-guidance/latest/implementing-logging-monitoring-cloudwatch/cloudwatch-dashboards-visualizations.html) は AWS サービスの推奨ベストプラクティスに基づいて事前に構築されており、リソースを認識し、重要なパフォーマンスメトリクスの最新状態を動的に更新します。

関連する AWS オブザーバビリティワークショップ: [自動ダッシュボード](https://catalog.workshops.aws/observability/en-US/aws-native/dashboards/autogen-dashboard)



## CloudWatch で監視したい内容をカスタマイズしたい場合、推奨されるアプローチは何ですか？

[カスタムダッシュボード](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/create_dashboard.html) を使用することで、お客様は必要な数のダッシュボードを作成し、異なるウィジェットを使用して適切にカスタマイズすることができます。
カスタムダッシュボードを作成する際には、カスタマイズ用に選択できる様々なタイプのウィジェットが用意されています。

関連する AWS オブザーバビリティワークショップ: [Dashboarding](https://catalog.workshops.aws/observability/en-US/aws-native/ec2-monitoring/dashboarding)



## カスタムダッシュボードを作成しましたが、共有する方法はありますか？

はい、[CloudWatch ダッシュボードの共有](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/cloudwatch-dashboard-sharing.html)は可能です。
共有方法は 3 つあります。
リンクにアクセスできる人なら誰でもダッシュボードを表示できるように、単一のダッシュボードを公開する方法。
ダッシュボードの表示を許可する人のメールアドレスを指定して、単一のダッシュボードをプライベートに共有する方法。
ダッシュボードへのアクセスにサードパーティのシングルサインオン (SSO) プロバイダーを指定して、アカウント内のすべての CloudWatch ダッシュボードを共有する方法です。

> 関連する AWS オブザーバビリティワークショップ: [CloudWatch ダッシュボードの共有](https://catalog.workshops.aws/observability/en-US/aws-native/dashboards/sharingdashboard)



## アプリケーションと、その下にある AWS リソースのオブザーバビリティを向上させたいのですが、どうすればよいですか？

[Amazon CloudWatch Application Insights](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/cloudwatch-application-insights.html) は、SQL Server データベース、.Net ベースの Web (IIS) スタック、アプリケーションサーバー、OS、ロードバランサー、キューなどの基盤となる AWS リソースと共に、アプリケーションのオブザーバビリティを容易にします。
アプリケーションリソースとテクノロジースタック全体で、主要なメトリクスとログの特定と設定を支援します。
これにより、平均修復時間 (MTTR) を短縮し、アプリケーションの問題をより迅速にトラブルシューティングできます。

> FAQ の追加詳細: [AWS リソースとカスタムメトリクスのモニタリング](https://aws.amazon.com/jp/cloudwatch/faqs/)



## 私の組織はオープンソース中心ですが、Amazon CloudWatch はオープンソーステクノロジーを通じたモニタリングとオブザーバビリティをサポートしていますか？

メトリクスとトレースの収集については、[AWS Distro for OpenTelemetry (ADOT) Collector](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-open-telemetry.html) を CloudWatch エージェントと共に Amazon EC2 インスタンスにサイドバイサイドでインストールでき、OpenTelemetry SDK を使用して Amazon EC2 インスタンス上で実行されているワークロードからアプリケーショントレースとメトリクスを収集できます。

Amazon CloudWatch での OpenTelemetry メトリクスをサポートするために、[AWS EMF Exporter for OpenTelemetry Collector](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/awsemfexporter) は OpenTelemetry 形式のメトリクスを CloudWatch Embedded Metric Format (EMF) に変換します。これにより、OpenTelemetry メトリクスと統合されたアプリケーションが、高カーディナリティの[アプリケーションメトリクスを CloudWatch に送信](https://aws-otel.github.io/docs/getting-started/adot-eks-add-on/config-cloudwatch)できるようになります。

ログについては、Fluent Bit を使用することで、[Amazon EC2 からのログ](https://docs.fluentbit.io/manual/pipeline/outputs/cloudwatch)を Amazon CloudWatch を含む AWS サービスにストリーミングするための簡単な拡張ポイントを作成できます。新しくリリースされた [Fluent Bit プラグイン](https://github.com/aws/amazon-cloudwatch-logs-for-fluent-bit#new-higher-performance-core-fluent-bit-plugin)を使用して、ログを Amazon CloudWatch にルーティングできます。

ダッシュボードについては、Grafana ワークスペースコンソールで AWS データソース設定オプションを使用して、[Amazon CloudWatch をデータソース](https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/using-amazon-cloudwatch-in-AMG.html)として Amazon Managed Grafana に追加できます。この機能により、既存の CloudWatch アカウントを検出し、CloudWatch へのアクセスに必要な認証情報の設定を管理することで、CloudWatch をデータソースとして追加するプロセスが簡素化されます。



## すでに Prometheus を使用してメトリクスを収集するように構築されているワークロードの場合、同じ方法を継続できますか？

お客様は、オブザーバビリティのニーズに対して、すべてオープンソースのセットアップを選択できます。AWS Distro for OpenTelemetry (ADOT) Collector を設定することで、Prometheus で計装されたアプリケーションからメトリクスを収集し、Prometheus Server または Amazon Managed Prometheus に送信することができます。

EC2 インスタンスの CloudWatch エージェントは、[Prometheus メトリクスを収集](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-PrometheusEC2.html)するようにインストールおよび設定でき、CloudWatch でモニタリングできます。これは、EC2 上のコンテナワークロードを好み、オープンソースの Prometheus モニタリングと互換性のあるカスタムメトリクスを必要とするお客様に役立ちます。

CloudWatch の [Prometheus 用 Container Insights モニタリング](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/ContainerInsights-Prometheus.html) は、コンテナ化されたシステムとワークロードからの Prometheus メトリクスの検出を自動化します。Prometheus メトリクスの検出は、Amazon Elastic Container Service (ECS)、Amazon Elastic Kubernetes Service (EKS)、および Amazon EC2 インスタンス上で実行される Kubernetes クラスターでサポートされています。



## マイクロサービスコンピュート、特に EKS/Kubernetes 関連のコンテナを含むワークロードで、Amazon CloudWatch を使用して環境の洞察を得るにはどうすればよいですか？

[CloudWatch Container Insights](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/ContainerInsights.html) を使用することで、[Amazon Elastic Kubernetes Service (Amazon EKS)](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/deploy-container-insights-EKS.html) や Amazon EC2 上の Kubernetes プラットフォームで実行されているコンテナ化されたアプリケーションやマイクロサービスからメトリクスとログを収集、集約、要約できます。

[Container Insights](https://aws.amazon.com/jp/cloudwatch/faqs/) は、Amazon EKS の Fargate にデプロイされたクラスターからのメトリクス収集もサポートしています。

CloudWatch は、CPU、メモリ、ディスク、ネットワークなどの多くのリソースから自動的に[メトリクスを収集](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/Container-Insights-metrics.html)し、コンテナの再起動失敗などの[診断情報を提供](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/Container-Insights-reference.html)して、問題の特定と迅速な解決を支援します。

> 関連する AWS オブザーバビリティワークショップ: [Container Insights on EKS](https://catalog.workshops.aws/observability/en-US/aws-native/insights/containerinsights/eks)



## マイクロサービスコンピュート、特に ECS 関連のコンテナを含むワークロードで、Amazon CloudWatch を使用して環境の洞察を得るにはどうすればよいですか？

[CloudWatch Container Insights](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/ContainerInsights.html) を使用することで、[Amazon Elastic Container Service (Amazon ECS)](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/deploy-container-insights-ECS.html) や Amazon EC2 上のコンテナプラットフォームで実行されているコンテナ化されたアプリケーションやマイクロサービスからメトリクスとログを収集、集約、要約できます。

[Container Insights](https://aws.amazon.com/jp/cloudwatch/faqs/) は、Amazon ECS の Fargate にデプロイされたクラスターからのメトリクス収集もサポートしています。

CloudWatch は、CPU、メモリ、ディスク、ネットワークなど、多くのリソースのメトリクスを自動的に[収集](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/Container-Insights-metrics.html)し、コンテナの再起動失敗などの[診断情報を提供](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/Container-Insights-reference.html)して、問題の特定と迅速な解決を支援します。

> 関連する AWS オブザーバビリティワークショップ: [ECS での Container Insights](https://catalog.workshops.aws/observability/en-US/aws-native/insights/containerinsights/ecs)



## サーバーレスコンピューティング、特に AWS Lambda を含むワークロードで、Amazon CloudWatch を使用して環境の洞察を得るにはどうすればよいですか？

[CloudWatch Lambda Insights](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/Lambda-Insights.html) を使用して、AWS Lambda 上で実行されているサーバーレスアプリケーションのモニタリングとトラブルシューティングを行うことができます。
[CloudWatch Lambda Insights](https://aws.amazon.com/jp/cloudwatch/faqs/) は、CPU 時間、メモリ、ディスク、ネットワークなどのシステムレベルのメトリクスを収集、集約、要約します。
また、コールドスタートや Lambda ワーカーのシャットダウンなどの診断情報も収集、集約、要約することで、Lambda 関数の問題を特定し、迅速に解決することができます。

> 関連する AWS オブザーバビリティワークショップ: [Lambda Insights](https://catalog.workshops.aws/observability/en-US/aws-native/insights/lambdainsights)




## Amazon CloudWatch Logs に大量のログを集約していますが、そのデータのオブザーバビリティを得るにはどうすればよいですか？

[CloudWatch Logs Insights](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/AnalyzingLogData.html) を使用すると、お客様は Amazon CloudWatch Logs のログデータをインタラクティブに検索、分析し、クエリを実行して運用上の問題に効率的かつ効果的に対応できます。問題が発生した場合、お客様は [CloudWatch Logs Insights](https://aws.amazon.com/jp/cloudwatch/faqs/) を使用して潜在的な原因を特定し、デプロイされた修正を検証できます。




## Amazon CloudWatch Logs でログを照会するにはどうすればよいですか？

Amazon CloudWatch Logs の CloudWatch Logs Insights では、ロググループを照会するために[クエリ言語](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html)を使用します。




## Amazon CloudWatch Logs に保存されているログをコスト最適化、コンプライアンス保持、追加処理のためにどのように管理すればよいですか？

デフォルトでは、[LogGroups](https://aws.amazon.com/jp/cloudwatch/faqs/) の Amazon CloudWatch Logs は[無期限に保持され、有効期限が切れることはありません](https://docs.aws.amazon.com/ja_jp/managedservices/latest/userguide/log-customize-retention.html)。お客様は、コスト最適化やコンプライアンスの目的に応じて、各ロググループの保持ポリシーを調整し、1 日から 10 年の間で保持期間を選択できます。

お客様は、[ロググループから Amazon S3 バケットにログデータをエクスポート](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/S3Export.html)し、このデータをカスタム処理や分析に使用したり、他のシステムにロードしたりすることができます。

また、CloudWatch Logs のロググループを設定して、CloudWatch Logs サブスクリプションを通じて、[データを Amazon OpenSearch Service クラスターにほぼリアルタイムでストリーミング](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/CWL_OpenSearch_Stream.html)することもできます。これにより、お客様はインタラクティブなログ分析、リアルタイムのアプリケーション監視、検索などを実行できます。



## ワークロードが生成するログに機密データが含まれている可能性がある場合、Amazon CloudWatch でそれらを保護する方法はありますか？

お客様は CloudWatch Logs の [ログデータ保護機能](https://aws.amazon.com/jp/cloudwatch/faqs/) を利用できます。この機能により、システムやアプリケーションから収集されたログ内の機密データを[自動的に検出してマスクするための独自のルールとポリシーを定義](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/mask-sensitive-log-data.html)することができます。

関連する AWS オブザーバビリティワークショップ: [データ保護](https://catalog.workshops.aws/observability/en-US/aws-native/logs/dataprotection)




## システムやアプリケーションに異常な変動や予期せぬ変化が発生した場合、それを知る方法はありますか？ Amazon CloudWatch ではどのように通知を受け取れますか？

[Amazon CloudWatch Anomaly Detection](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Anomaly_Detection.html) は、統計的機械学習アルゴリズムを適用して、システムとアプリケーションの単一時系列を継続的に分析し、正常な基準値を決定し、最小限のユーザー操作で異常を検出します。
このアルゴリズムは、メトリクスの正常な動作を表す予想値の範囲を生成する異常検出モデルを作成します。
お客様は過去のメトリクスデータの分析と異常しきい値に設定された値に基づいて[アラームを作成](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/Create_Anomaly_Detection_Alarm.html)できます。

> 関連する AWS オブザーバビリティワークショップ: [Anomaly Detection](https://catalog.workshops.aws/observability/en-US/aws-native/metrics/alarms/anomalydetection)




## Amazon CloudWatch でメトリクスアラームを設定しましたが、頻繁にアラームが発生します。これをどのように制御し、微調整できますか？

複数のアラームが同時に発生した場合に 1 回だけトリガーすることで、アラームノイズを低減するために、複数のアラームを [composite alarm](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/Create_Composite_Alarm.html) として組み合わせることができます。
Composite alarm は、アプリケーション、AWS リージョン、AZ などのリソースをグループ化することで、全体的な状態を把握することができます。

> 関連する AWS オブザーバビリティワークショップ: [Alarms](https://catalog.workshops.aws/observability/en-US/aws-native/metrics/alarms)



## インターネットに接続しているワークロードのパフォーマンスと可用性に問題が発生した場合、どのようにトラブルシューティングを行えばよいですか？

[Amazon CloudWatch Internet Monitor](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-InternetMonitor.html) は、インターネットの問題が AWS でホストされているアプリケーションとエンドユーザー間のパフォーマンスと可用性にどのような影響を与えているかを可視化します。[Internet Monitor](https://aws.amazon.com/jp/cloudwatch/faqs/) を使用すると、アプリケーションのパフォーマンスと可用性に影響を与えている要因を素早く特定できるため、インターネットの問題を診断するために必要な時間を大幅に短縮できます。



## AWS 上のワークロードを運用しており、エンドユーザーがアプリケーションへのアクセスで影響やレイテンシーを経験する前に通知を受けたいと考えています。顧客向けワークロードの可視性を向上させ、オブザーバビリティを改善するにはどうすればよいですか？

[Amazon CloudWatch Synthetics](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries.html) を使用して、エンドポイントと API を監視するためのスケジュールで実行される設定可能なスクリプトである Canary を作成できます。
Canary は顧客と同じルートをたどり、同じアクションを実行するため、アプリケーションにライブトラフィックがない場合でも、エンドユーザーエクスペリエンスを継続的に検証することが可能です。
Canary は、顧客が問題を発見する前に問題を検出するのに役立ちます。
Canary はエンドポイントの可用性とレイテンシーをチェックし、ヘッドレス Chromium ブラウザによってレンダリングされた UI のロード時間データとスクリーンショットを保存できます。

> 関連する AWS オブザーバビリティワークショップ: [CloudWatch Synthetics](https://catalog.workshops.aws/observability/en-US/aws-native/app-monitoring/synthetics)



## クライアント側のパフォーマンスを特定し、リアルタイムの問題を解決することで、エンドユーザーのエクスペリエンスをどのように観察できますか？

[CloudWatch RUM](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM.html) は、実際のユーザーセッションからウェブアプリケーションのパフォーマンスに関するクライアント側のデータをほぼリアルタイムで収集し、表示する実ユーザーモニタリングを実行できます。

収集されたデータは、クライアント側のパフォーマンスの問題を素早く特定してデバッグするのに役立ち、ページの読み込み時間、クライアント側のエラー、ユーザーの行動を視覚化して分析するのにも役立ちます。

このデータを表示する際、お客様はすべてのデータを集約して確認できるだけでなく、お客様のユーザーが使用しているブラウザやデバイスごとの内訳も確認できます。

CloudWatch RUM は、アプリケーションのパフォーマンスの異常を視覚化し、エラーメッセージ、スタックトレース、ユーザーセッションなどの関連するデバッグデータを見つけるのに役立ちます。

> 関連する AWS オブザーバビリティワークショップ: [CloudWatch RUM](https://catalog.workshops.aws/observability/en-US/aws-native/app-monitoring/rum)



## 組織では監査のためにすべてのアクションを記録する必要があります。Amazon CloudWatch のイベントを記録できますか？

Amazon CloudWatch は [AWS CloudTrail](https://docs.aws.amazon.com/ja_jp/awscloudtrail/latest/userguide/cloudtrail-user-guide.html) と統合されており、ユーザー、ロール、または AWS サービスが Amazon CloudWatch で実行したアクションの記録を提供します。CloudTrail は、コンソールからの呼び出しや API オペレーションへのコード呼び出しを含む、[Amazon CloudWatch の API 呼び出し](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/logging_cw_api_calls.html) をすべてイベントとしてキャプチャします。



## 詳細情報はどこにありますか？

追加情報については、[CloudWatch](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html)、[CloudWatch Events](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/events/WhatIsCloudWatchEvents.html)、[CloudWatch Logs](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html) の AWS ドキュメントをご覧ください。

また、[AWS Native Observability](https://catalog.workshops.aws/observability/en-US/aws-native) の AWS オブザーバビリティワークショップに参加したり、[製品ページ](https://aws.amazon.com/jp/cloudwatch/) で [機能](https://aws.amazon.com/jp/cloudwatch/features/) や [料金](https://aws.amazon.com/jp/cloudwatch/pricing/) の詳細を確認することもできます。

お客様のユースケースシナリオを説明する [CloudWatch のチュートリアル](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-tutorials.html) も用意されています。

**製品 FAQ:** [https://aws.amazon.com/jp/cloudwatch/faqs/](https://aws.amazon.com/jp/cloudwatch/faqs/)
