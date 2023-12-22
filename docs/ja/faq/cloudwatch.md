# Amazon CloudWatch - よくある質問

**なぜ Amazon CloudWatch を選択する必要がありますか?**

Amazon CloudWatch は、AWS クラウドリソースと AWS 上で実行されるアプリケーションの統合された可観測性を単一のプラットフォームで提供する AWS ネイティブサービスです。Amazon CloudWatch は、[ログ](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html)、[メトリクス](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/working_with_metrics.html)、[イベント](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/WhatIsCloudWatchEvents.html)、[アラーム](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html)の形式で監視および運用データを収集するために使用できます。また、AWS 上で実行される AWS リソース、アプリケーション、サービスの[統合ビュー](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Dashboards.html)と[オンプレミスサーバー](https://aws.amazon.com/blogs/mt/how-to-monitor-hybrid-environment-with-aws-services/)を提供します。Amazon CloudWatch は、リソースの利用率、アプリケーションのパフォーマンス、ワークロードの運用状態に関するシステム全体の可視性を得るのに役立ちます。Amazon CloudWatch は、AWS、ハイブリッド、オンプレミスのアプリケーションとインフラストラクチャリソースに対する[実行可能なインサイト](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Insights-Sections.html)を提供します。[クロスアカウントの可観測性](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Unified-Cross-Account.html) は、CloudWatch の統合された可観測性機能への追加です。

**どの AWS サービスがネイティブに Amazon CloudWatch および Amazon CloudWatch Logs と統合されていますか?**

Amazon CloudWatch は 70 を超える AWS サービスとネイティブに統合されており、アクションなしで監視とスケーラビリティを簡素化するためにインフラストラクチャメトリクスを収集できます。サポートされている [CloudWatch メトリクスを公開する AWS サービスの完全なリスト](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/aws-services-cloudwatch-metrics.html)はドキュメントをご確認ください。現在、30 を超える AWS サービスが CloudWatch にログを公開しています。サポートされている [CloudWatch Logs にログを公開する AWS サービスの完全なリスト](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/aws-services-sending-logs.html)はドキュメントをご確認ください。

**すべての AWS サービスから Amazon CloudWatch に公開される公開メトリクスのリストはどこで入手できますか?**

[メトリクスを公開するすべての AWS サービスのリスト](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/aws-services-cloudwatch-metrics.html)は、AWS のドキュメントにあります。

**Amazon CloudWatch へのメトリクスの収集と監視を開始するにはどうすればよいですか?**

[Amazon CloudWatch はさまざまな AWS サービスからメトリクスを収集](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/working_with_metrics.html)します。これらは [AWS Management Console、AWS CLI、API](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/viewing_metrics_with_cloudwatch.html) を通じて表示できます。Amazon CloudWatch は、Amazon EC2 インスタンスの[利用可能なメトリクス](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/viewing_metrics_with_cloudwatch.html)を収集します。カスタムメトリクスの場合、統合 CloudWatch エージェントを利用して収集と監視が可能です。

> 関連する AWS Observability ワークショップ: [メトリクス](https://catalog.workshops.aws/observability/ja-JP/aws-native/metrics)

**私の Amazon EC2 インスタンスには非常に細かいレベルの監視が必要です。どうすればよいですか?**

デフォルトでは、Amazon EC2 はインスタンスの基本監視として 5 分ごとにメトリクスデータを CloudWatch に送信します。インスタンスのメトリクスデータを 1 分ごとに CloudWatch に送信するには、インスタンスで[詳細モニタリング](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-cloudwatch-new.html)を有効にできます。

**アプリケーションのカスタムメトリクスを公開するオプションはありますか?**

お客様は、API または CLI を使用して、1 分の標準解像度または 1 秒間隔の高解像度の粒度で、独自の[カスタムメトリクス](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/publishingMetrics.html)を CloudWatch に公開できます。

統合 CloudWatch エージェントは、Linux 上の Elastic Network Adapter (ENA) を使用する Amazon EC2 インスタンスの[ネットワークパフォーマンスメトリクス](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-network-performance.html)や Linux サーバーの [NVIDIA GPU メトリクス](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-NVIDIA-GPU.html)、Linux と Windows サーバー上の個々のプロセスの[プロセスメトリクス](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-procstat-process-metrics.html)など、特殊なシナリオでカスタムメトリクスを収集することもサポートしています。

> 関連する AWS Observability ワークショップ: [カスタムメトリクスの公開](https://catalog.workshops.aws/observability/ja-JP/aws-native/metrics/publishmetrics)

**Amazon CloudWatch エージェントを使用したカスタムメトリクスの収集で、さらにどのようなサポートが利用できますか?**

アプリケーションやサービスからのカスタムメトリクスは、[StatsD](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-custom-metrics-statsd.html) または [collectd](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-custom-metrics-collectd.html) プロトコルをサポートする統合 CloudWatch エージェントを使用して取得できます。StatsD は、幅広いアプリケーションからメトリクスを収集できる一般的なオープンソースソリューションです。StatsD は、Linux と Windows の両方のサーバーベースのサーバーをサポートしている独自のメトリクスを計装するのに特に便利です。collectd プロトコルは、幅広いアプリケーションのシステム統計を収集できるプラグインを備えた Linux サーバーでのみサポートされている一般的なオープンソースソリューションです。

**ワークロードには多数の短期リソースが含まれ、高基数のログが生成されます。メトリクスとログを収集および測定するための推奨アプローチは何ですか?**

[CloudWatch 埋め込みメトリックフォーマット](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html) を使用すると、複雑な高基数アプリケーションデータをログの形式で取り込み、Lambda 関数やコンテナなどの短期リソースから実行可能なメトリクスを生成できます。これにより、お客様は別のコードを計装または維持することなく、詳細なログイベントデータとともにカスタムメトリクスを埋め込むことができます。その結果、ログデータに対する強力な分析機能を得ることができ、CloudWatch は自動的にカスタムメトリクスを抽出してデータの視覚化とリアルタイムのインシデント検出のためのアラームの設定を支援します。

> 関連する AWS Observability ワークショップ: [Embedded Metric Format](https://catalog.workshops.aws/observability/ja-JP/aws-native/metrics/emf)

**Amazon CloudWatch Logs へのログの収集と監視を開始するにはどうすればよいですか?**

[Amazon CloudWatch Logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html) は、既存のシステム、アプリケーション、カスタムログファイルを使用して、ほぼリアルタイムでシステムとアプリケーションを監視およびトラブルシューティングするのに役立ちます。 統合 [CloudWatch エージェント](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_GettingStarted.html) をインストールして、[Amazon EC2 インスタンスとオンプレミスサーバーからのログを CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html) に収集できます。

> 関連する AWS Observability ワークショップ: [ログインサイト](https://catalog.workshops.aws/observability/ja-JP/aws-native/logs/logsinsights)

**CloudWatch エージェントとは何ですか。なぜそれを使用する必要がありますか?**

[統合 CloudWatch エージェント](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html) は、MIT ライセンスのオープンソースソフトウェアで、x86-64 および ARM64 アーキテクチャを利用するほとんどのオペレーティングシステムをサポートしています。CloudWatch エージェントは、オペレーティングシステムをまたいで Amazon EC2 インスタンスとハイブリッド環境のオンプレミスサーバーからシステムレベルのメトリクスを収集し、アプリケーションやサービスからカスタムメトリクスを取得し、Amazon EC2 インスタンスとオンプレミスサーバーからのログを収集するのに役立ちます。

**環境にはあらゆる規模のインストールが必要です。CloudWatch エージェントを通常どのようにインストールし、自動化できますか?**

Linux と Windows Server を含むすべてのサポートされているオペレーティングシステムで、お客様は [コマンドライン](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/installing-cloudwatch-agent-commandline.html)を使用して CloudWatch エージェントをダウンロードおよび[インストール](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-on-EC2-Instance.html)したり、AWS の [Systems Manager](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/installing-cloudwatch-agent-ssm.html) を使用したり、AWS の [CloudFormation テンプレート](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent-New-Instances-CloudFormation.html)を使用したりできます。監視のためにオンプレミスサーバーにも [CloudWatch エージェントをインストール](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-on-premise.html)できます。

**当社の組織には複数の AWS アカウントとリージョンがあります。Amazon CloudWatch はこれらのシナリオに対応していますか。**

Amazon CloudWatch は、[クロスアカウントの可観測性](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Unified-Cross-Account.html)を提供します。これにより、お客様はリージョン内の複数のアカウントにまたがるリソースとアプリケーションの正常性を監視およびトラブルシューティングできます。Amazon CloudWatch は、[クロスアカウントおよびクロスリージョンダッシュボード](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Cross-Account-Cross-Region.html)も提供します。この機能により、お客様はマルチアカウントおよびマルチリージョンのリソースとワークロードの可視性と洞察を得ることができます。

**Amazon CloudWatch で利用できる自動化のサポートは何ですか?**

AWS Management Console を介して Amazon CloudWatch にアクセスすることに加えて、お客様は [API](https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/Welcome.html)、[AWS コマンドラインインターフェイス(CLI)](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)、[AWS SDK](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/sdk-general-information-section.html) を介してもサービスにアクセスできます。メトリクスとダッシュボードの [CloudWatch API](https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/Welcome.html) は、[AWS CLI](https://docs.aws.amazon.com/AmazonCloudWatch/latest/cli/Welcome.html) を介して、またはソフトウェア/製品との統合によって自動化できるため、リソースとアプリケーションの管理または管理に費やす時間を短縮できます。ログ用の [CloudWatch API](https://docs.aws.amazon.com/AmazonCloudWatchLogs/latest/APIReference/Welcome.html) と [AWS CLI](https://docs.aws.amazon.com/cli/latest/reference/logs/index.html) も個別に利用できます。追加のリファレンスのために、お客様向けの [CloudWatch での AWS SDK のコード例](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/service_code_examples.html)が用意されています。

**リソースの監視をすぐに開始したいのですが、推奨されるアプローチは何ですか?**

CloudWatch の自動ダッシュボードは、すべての AWS パブリックリージョンで利用でき、AWS リソースの正常性とパフォーマンスの集約ビューを提供します。これにより、お客様はすぐに監視を開始し、メトリクスとアラームのリソースベースのビューを取得し、パフォーマンスの問題の根本原因を簡単に特定できます。[自動ダッシュボード](https://docs.aws.amazon.com/prescriptive-guidance/latest/implementing-logging-monitoring-cloudwatch/cloudwatch-dashboards-visualizations.html)は、AWS サービスの推奨ベストプラクティスに基づいて構築されており、リソースを認識したまま動的に更新され、重要なパフォーマンスメトリクスの最新の状態を反映します。

関連する AWS Observability ワークショップ: [自動ダッシュボード](https://catalog.workshops.aws/observability/ja-JP/aws-native/dashboards/autogen-dashboard)

**CloudWatch で監視するものをカスタマイズしたいのですが、推奨されるアプローチは何ですか?**

[カスタムダッシュボード](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/create_dashboard.html)を使用すると、必要なだけ追加のダッシュボードを作成し、さまざまなウィジェットを使用してカスタマイズできます。カスタムダッシュボードを作成するとき、選択とカスタマイズのために使用できるさまざまなウィジェットタイプがあります。

関連する AWS Observability ワークショップ: [ダッシュボーディング](https://catalog.workshops.aws/observability/ja-JP/aws-native/ec2-monitoring/dashboarding)

**いくつかのカスタムダッシュボードを構築しました。共有する方法はありますか?**

はい、[CloudWatch ダッシュボードの共有](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch-dashboard-sharing.html)が可能です。共有には 3 つの方法があります。リンクへのアクセス権を持つすべてのユーザーがダッシュボードを表示できるように、単一のダッシュボードをパブリックに共有します。ダッシュボードを表示できる人のメールアドレスを指定することにより、単一のダッシュボードをプライベートに共有します。アカウントのすべての CloudWatch ダッシュボードを、ダッシュボードアクセス用のサードパーティのシングルサインオン (SSO) プロバイダーを指定することにより共有します。

> 関連する AWS Observability ワークショップ: [CloudWatch ダッシュボードの共有](https://catalog.workshops.aws/observability/ja-JP/aws-native/dashboards/sharingdashboard)

**アプリケーションの可観測性を向上させる必要があります。これには下層の AWS リソースが含まれます。どのように達成できますか?**

[Amazon CloudWatch Application Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch-application-insights.html) は、SQL Server データベース、.Net ベースの Web (IIS) スタック、アプリケーションサーバー、OS、ロードバランサー、キューなど、基盤となる AWS リソースを含むアプリケーションの可観測性を容易にします。 アプリケーションリソースとテクノロジスタック全体で主要なメトリクスとログを特定および設定するのに役立ちます。そうすることで、平均修復時間 (MTTR) を短縮し、アプリケーションの問題をより迅速にトラブルシューティングできます。

> 追加の詳細は FAQ をご覧ください: [AWS リソースとカスタムメトリクスの監視](https://aws.amazon.com/cloudwatch/faqs/#AWS_resource_.26_custom_metrics_monitoring)

**当社の組織はオープンソース中心です。Amazon CloudWatch はオープンソーステクノロジーを通じた監視と可観測性をサポートしていますか。**

メトリクスとトレースを収集するために、[AWS Distro for OpenTelemetry (ADOT) Collector](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-open-telemetry.html) と CloudWatch エージェントを Amazon EC2 インスタンスに並行してインストールし、OpenTelemetry SDK を使用して Amazon EC2 インスタンス上で実行されているワークロードからアプリケーショントレースとメトリクスを収集できます。

Amazon CloudWatch で OpenTelemetry メトリクスをサポートするには、[AWS EMF Exporter for OpenTelemetry Collector](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/awsemfexporter) が OpenTelemetry 形式のメトリクスを CloudWatch Embedded Metric Format(EMF)に変換します。これにより、OpenTelemetry メトリクスに統合されたアプリケーションが[高基数のアプリケーションメトリクスを CloudWatch に送信](https://aws-otel.github.io/docs/getting-started/adot-eks-add-on/config-cloudwatch)できるようになります。

ログの場合、Fluent Bit は Amazon EC2 から [CloudWatch](https://docs.fluentbit.io/manual/pipeline/outputs/cloudwatch) を含む AWS サービスへのログストリーミングの容易な拡張ポイントを作成しますログの保持と分析。新しくリリースされた [Fluent Bit プラグイン](https://github.com/aws/amazon-cloudwatch-logs-for-fluent-bit#new-higher-performance-core-fluent-bit-plugin) は、ログを Amazon CloudWatch にルーティングできます。

ダッシュボードの場合、Grafana ワークスペースコンソールの AWS データソース構成オプションを使用することにより、Amazon Managed Grafana に [Amazon CloudWatch をデータソース](https://docs.aws.amazon.com/grafana/latest/userguide/using-amazon-cloudwatch-in-AMG.html)として追加できます。この機能により、既存の CloudWatch アカウントの検出と、CloudWatch へのアクセスに必要な認証情報の構成の管理が簡素化されます。

**ワークロードにはプロメテウスからのメトリクス収集が既に構築されています。同じ方法論を使用し続けることができますか。**

お客様は、可観測性のニーズのためにすべてオープンソースのセットアップを選択できます。これについては、AWS Distro for OpenTelemetry (ADOT) Collector を、Prometheus で計装されたアプリケーションからスクレイプし、メトリクスを Prometheus Server または Amazon Managed Prometheus に送信するように構成できます。

EC2 インスタンス上の CloudWatch エージェントをインストールおよび構成して、[Prometheus からメトリクスをスクレイプ](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-PrometheusEC2.html)し、CloudWatch で監視できます。これは、EC2 上のコンテナワークロードを好み、オープンソースの Prometheus 監視と互換性のあるカスタムメトリクスが必要なお客様に役立ちます。

CloudWatch の [Prometheus 用コンテナインサイト監視](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights-Prometheus.html) は、コンテナ化されたシステムとワークロードからの Prometheus メトリクスの自動検出を自動化します。Prometheus メトリクスの検出は、Amazon Elastic Container Service (ECS)、Amazon Elastic Kubernetes Service (EKS)、および Amazon EC2 インスタンス上で実行される Kubernetes クラスターでサポートされています。

**ワークロードにはマイクロサービスコンピューティング、特に EKS/Kubernetes 関連のコンテナーが含まれています。Amazon CloudWatch を使用して環境の洞察を得るにはどうすればよいですか?**

お客様は、[Amazon Elastic Kubernetes Service (Amazon EKS)](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/deploy-container-insights-EKS.html) または Amazon EC2 上の Kubernetes プラットフォームで実行されているコンテナ化アプリケーションとマイクロサービスからメトリクスとログを収集、集約、要約するために、[CloudWatch Container Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html) を使用できます。 [Container Insights](https://aws.amazon.com/cloudwatch/faqs/#Container_Monitoring) は、Amazon EKS 用に Fargate にデプロイされたクラスターからのメトリクスの収集もサポートしています。CloudWatch は自動的に CPU、メモリ、ディスク、ネットワークなど、多くのリソースの[メトリクスを収集](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-metrics.html)します。また、コンテナの再起動失敗などの診断情報を提供して、問題を特定およびすばやく解決するのに役立ちます。

> 関連する AWS Observability ワークショップ: [EKS のコンテナインサイト](https://catalog.workshops.aws/observability/ja-JP/aws-native/insights/containerinsights/eks)

**ワークロードにはマイクロサービスコンピューティング、特に ECS 関連のコンテナーが含まれています。Amazon CloudWatch を使用して環境の洞察を得るにはどうすればよいですか?**

お客様は、[Amazon Elastic Container Service (Amazon ECS)](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/deploy-container-insights-ECS.html) または Amazon EC2 上のコンテナプラットフォームで実行されているコンテナ化アプリケーションとマイクロサービスからメトリクスとログを収集、集約、要約するために、[CloudWatch Container Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html) を使用できます。 [Container Insights](https://aws.amazon.com/cloudwatch/faqs/#Container_Monitoring) は、Amazon ECS 用に Fargate にデプロイされたクラスターからのメトリクスの収集もサポートしています。CloudWatch は自動的に CPU、メモリ、ディスク、ネットワーク
