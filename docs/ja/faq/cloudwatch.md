# Amazon CloudWatch に関するベストプラクティス FAQ

**なぜ Amazon CloudWatch を選択する必要がありますか?**

Amazon CloudWatch は、AWS のクラウドネイティブサービスで、AWS 上のクラウドリソースとアプリケーションの監視のために、単一のプラットフォーム上で統合された可観測性を提供します。Amazon CloudWatch は、[ログ](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html)、[メトリクス](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/working_with_metrics.html)、[イベント](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/WhatIsCloudWatchEvents.html)、[アラーム](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html) の形式で監視および運用データを収集するために使用できます。また、AWS および[オンプレミスのサーバー](https://aws.amazon.com/blogs/mt/how-to-monitor-hybrid-environment-with-aws-services/)で実行されている AWS リソース、アプリケーション、サービスの[統合ビュー](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Dashboards.html)を提供します。Amazon CloudWatch は、リソースの利用率、アプリケーションのパフォーマンス、ワークロードの運用状態に関するシステム全体の可視性を得るのに役立ちます。Amazon CloudWatch は、AWS、ハイブリッド、オンプレミスのアプリケーションとインフラストラクチャリソースに対して[実行可能なインサイト](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Insights-Sections.html)を提供します。[クロスアカウントの可観測性](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Unified-Cross-Account.html) は、CloudWatch の統合された可観測性機能への追加です。

**どの AWS サービスがネイティブに Amazon CloudWatch および Amazon CloudWatch Logs と統合されていますか?**

Amazon CloudWatch は 70 を超える AWS サービスとネイティブに統合されており、アクションなしで監視とスケーラビリティを簡素化するためにインフラストラクチャメトリクスを収集できます。サポートされている[CloudWatch メトリクスを公開する AWS サービスの完全なリスト](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/aws-services-cloudwatch-metrics.html)はドキュメントをご確認ください。現在、30 を超える AWS サービスが CloudWatch にログを公開しています。サポートされている[CloudWatch Logs にログを公開する AWS サービスの完全なリスト](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/aws-services-sending-logs.html)はドキュメントをご確認ください。

**すべての AWS サービスから Amazon CloudWatch に公開されるすべての公開メトリクスのリストはどこで入手できますか?**

[メトリクスを公開するすべての AWS サービスのリスト](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/aws-services-cloudwatch-metrics.html)は、AWS のドキュメントにあります。

**Amazon CloudWatch へのメトリクスの収集と監視を開始するにはどうすればよいですか?**

[Amazon CloudWatch はさまざまな AWS サービスからメトリクスを収集](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/working_with_metrics.html)します。これらは [AWS Management Console、AWS CLI、API](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/viewing_metrics_with_cloudwatch.html) を通じて表示できます。Amazon CloudWatch は、Amazon EC2 インスタンスの[利用可能なメトリクス](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/viewing_metrics_with_cloudwatch.html)を収集します。カスタムメトリクスの場合、統合 CloudWatch エージェントを利用して収集と監視が可能です。

関連する AWS Observability ワークショップ: [メトリクス](https://catalog.workshops.aws/observability/ja-JP/aws-native/metrics)

**Amazon EC2 インスタンスは非常に細かいレベルの監視が必要です。どうすればよいですか?**

デフォルトでは、Amazon EC2 はインスタンスの基本監視として 5 分ごとにメトリクスデータを CloudWatch に送信します。インスタンスのメトリクスデータを CloudWatch に 1 分ごとに送信するには、インスタンスで[詳細モニタリング](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-cloudwatch-new.html)を有効にできます。

**アプリケーションのカスタムメトリクスを公開するオプションはありますか?**

お客様は、API または CLI を使用して、1 分の標準解像度または 1 秒間隔の高解像度の粒度を使用して、独自の[カスタムメトリクス](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/publishingMetrics.html)を CloudWatch に公開できます。

統合 CloudWatch エージェントは、Linux 上の Elastic Network Adapter (ENA) を使用する Amazon EC2 インスタンスで実行されている[EC2 インスタンスのネットワークパフォーマンスメトリクス](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-network-performance.html)や Linux サーバーの [NVIDIA GPU メトリクス](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-NVIDIA-GPU.html)、Linux と Windows サーバー上の個々のプロセスからの[プロセスメトリクス](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-procstat-process-metrics.html)など、特殊なシナリオでカスタムメトリクスを収集することもサポートしています。

関連する AWS Observability ワークショップ: [カスタムメトリクスの公開](https://catalog.workshops.aws/observability/ja-JP/aws-native/metrics/publishmetrics)

**CloudWatch エージェントを介してカスタムメトリクスを収集するためのその他のサポートは何がありますか?**

アプリケーションまたはサービスからのカスタムメトリクスは、[StatsD](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-custom-metrics-statsd.html) または [collectd](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-custom-metrics-collectd.html) プロトコルをサポートする統合 CloudWatch エージェントを使用して取得できます。StatsD は、幅広いアプリケーションからメトリクスを収集できる一般的なオープンソースソリューションです。StatsD は、Linux と Windows の両方のサーバーベースのサーバーをサポートしている独自のメトリクスを計装するのに特に便利です。collectd プロトコルは、幅広いアプリケーションのシステム統計を収集できる Linux サーバーでのみサポートされている一般的なオープンソースソリューションです。

**ワークロードには多数の短期リソースが含まれ、高基数のログが生成されます。メトリクスとログを収集および測定するための推奨アプローチは何ですか?**

[CloudWatch 埋め込みメトリクスフォーマット](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html) を使用すると、ログの形式で複雑な高基数アプリケーションデータを取り込み、Lambda 関数やコンテナなどの短期リソースから実行可能なメトリクスを生成できます。これにより、お客様は詳細なログイベントデータとともにカスタムメトリクスを埋め込むことができ、個別のコードを計装または維持する必要なく、ログデータに対する強力な分析機能を得ることができます。CloudWatch はカスタムメトリクスを自動的に抽出して、データの視覚化とリアルタイムのインシデント検出のためのアラームの設定を支援します。

関連する AWS Observability ワークショップ: [Embedded Metric Format](https://catalog.workshops.aws/observability/ja-JP/aws-native/metrics/emf)

**Amazon CloudWatch Logs へのログの収集と監視を開始するにはどうすればよいですか?**

[Amazon CloudWatch Logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html) は、既存のシステム、アプリケーション、カスタムログファイルを使用して、リアルタイムでシステムとアプリケーションを監視およびトラブルシューティングするのに役立ちます。[統合 CloudWatch エージェント](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_GettingStarted.html)をインストールして、[Amazon EC2 インスタンスとオンプレミスサーバーからのログを CloudWatch に収集](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html)できます。

関連する AWS Observability ワークショップ: [Log Insights](https://catalog.workshops.aws/observability/ja-JP/aws-native/logs/logsinsights)

**CloudWatch エージェントとは何ですか。なぜそれを使用する必要がありますか?**

[統合 CloudWatch エージェント](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html)は、MIT ライセンスのオープンソースソフトウェアで、x86-64 および ARM64 アーキテクチャを利用するほとんどのオペレーティングシステムをサポートしています。CloudWatch エージェントは、オペレーティングシステム全体で Amazon EC2 インスタンスとハイブリッド環境のオンプレミスサーバーからシステムレベルのメトリクスを収集し、Amazon EC2 インスタンスとオンプレミスサーバーからログを収集し、アプリケーションまたはサービスからカスタムメトリクスを取得するのに役立ちます。

**環境でさまざまな規模のインストールが必要です。CloudWatch エージェントは通常どのようにインストールできますか?自動化は?**

Linux と Windows Server を含むすべてのサポートされているオペレーティングシステムで、[コマンドライン](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/installing-cloudwatch-agent-commandline.html)を使用して CloudWatch エージェントをダウンロードおよび[インストール](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-on-EC2-Instance.html)したり、AWS [Systems Manager](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/installing-cloudwatch-agent-ssm.html) を使用したり、AWS [CloudFormation テンプレート](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent-New-Instances-CloudFormation.html)を使用したりできます。また、監視のために[オンプレミスサーバーに CloudWatch エージェントをインストール](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-on-premise.html)することもできます。

**Organization には複数の AWS アカウントとリージョンがあります。Amazon CloudWatch はこれらのシナリオに対応していますか。**

Amazon CloudWatch は、[クロスアカウントの可観測性](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Unified-Cross-Account.html)を提供し、リージョン内の複数のアカウントにまたがるリソースとアプリケーションの正常性を監視およびトラブルシューティングするのに役立ちます。Amazon CloudWatch は、[クロスアカウント、クロスリージョンダッシュボード](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Cross-Account-Cross-Region.html)も提供します。この機能により、マルチアカウント、マルチリージョンのリソースとワークロードの可視性と洞察力を得ることができます。

**Amazon CloudWatch で利用できる自動化のサポートは何ですか?**

AWS Management Console を介して Amazon CloudWatch にアクセスする以外にも、API、[AWS コマンドラインインターフェイス (CLI)](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)、[AWS SDK](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/sdk-general-information-section.html) を介してサービスにアクセスできます。メトリクスとダッシュボードの [CloudWatch API](https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/Welcome.html) は、[AWS CLI](https://docs.aws.amazon.com/AmazonCloudWatch/latest/cli/Welcome.html) を介して自動化したり、ソフトウェア/製品と統合したりして、リソースとアプリケーションの管理や管理に費やす時間を短縮できます。ログ用の [CloudWatch API](https://docs.aws.amazon.com/AmazonCloudWatchLogs/latest/APIReference/Welcome.html) と[AWS CLI](https://docs.aws.amazon.com/cli/latest/reference/logs/index.html) も個別に利用できます。お客様への追加リファレンスのために、[CloudWatch での AWS SDK のコード例](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/service_code_examples.html)が用意されています。

**リソースの監視をすぐに開始したいのですが、推奨されるアプローチは何ですか?**

CloudWatch の自動ダッシュボードは、すべての AWS パブリックリージョンで利用でき、AWS リソースの正常性とパフォーマンスの集約ビューを提供します。これにより、お客様は監視をすぐに開始し、リソースベースのメトリクスとアラームのビューを取得し、パフォーマンスの問題の根本原因を簡単に特定できます。[自動ダッシュボード](https://docs.aws.amazon.com/prescriptive-guidance/latest/implementing-logging-monitoring-cloudwatch/cloudwatch-dashboards-visualizations.html)は、AWS サービスの推奨ベストプラクティスで構築されており、リソースを認識したまま動的に更新され、重要なパフォーマンスメトリクスの最新の状態を反映します。

関連する AWS Observability ワークショップ: [自動ダッシュボード](https://catalog.workshops.aws/observability/ja-JP/aws-native/dashboards/autogen-dashboard)

**CloudWatch で監視するものをカスタマイズしたいのですが、推奨されるアプローチは何ですか?**

[カスタムダッシュボード](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/create_dashboard.html)を使用すると、必要なだけ追加のダッシュボードを作成し、さまざまなウィジェットを使用してカスタマイズできます。カスタムダッシュボードを作成するとき、選択とカスタマイズのために使用できるさまざまなウィジェットタイプがあります。

関連する AWS Observability ワークショップ: [ダッシュボード](https://catalog.workshops.aws/observability/ja-JP/aws-native/ec2-monitoring/dashboarding)

**いくつかのカスタムダッシュボードを構築しました。共有する方法はありますか?**

はい、[CloudWatch ダッシュボードの共有](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch-dashboard-sharing.html)が可能です。共有には 3 つの方法があります。リンクへのアクセス権を持つすべてのユーザーがダッシュボードを表示できるように、単一のダッシュボードをパブリックに共有します。ダッシュボードを表示できる人のメールアドレスを指定して、単一のダッシュボードをプライベートに共有します。アカウントのすべての CloudWatch ダッシュボードを、ダッシュボードアクセス用のサードパーティのシングルサインオン (SSO) プロバイダーを指定することによって共有します。

関連する AWS Observability ワークショップ: [CloudWatch ダッシュボードの共有](https://catalog.workshops.aws/observability/ja-JP/aws-native/dashboards/sharingdashboard)

**アプリケーションの可観測性を向上させる方法はありますか?下層の AWS リソースを含めて。**

[Amazon CloudWatch Application Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch-application-insights.html) は、SQL Server データベース、.Net ベースの Web (IIS) スタック、アプリケーションサーバー、OS、ロードバランサー、キューなど、基盤となる AWS リソースを含むアプリケーションの可観測性を容易にします。アプリケーションリソースとテクノロジスタック全体の主要なメトリクスとログを特定および設定するのに役立ちます。これにより、MTTR (平均修復時間) が短縮され、アプリケーションの問題をより迅速にトラブルシューティングできます。

追加の詳細は FAQ をご覧ください: [AWS リソースとカスタムメトリクスの監視](https://aws.amazon.com/cloudwatch/faqs/#AWS_resource_.26_custom_metrics_monitoring)

**Organization はオープンソース中心です。Amazon CloudWatch はオープンソーステクノロジーを通じた監視と可観測性をサポートしていますか。**

メトリクスとトレースを収集するために、[AWS Distro for OpenTelemetry (ADOT) Collector](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-open-telemetry.html) と CloudWatch エージェントを Amazon EC2 インスタンスに並行してインストールし、OpenTelemetry SDK を使用して Amazon EC2 インスタンス上で実行されているワークロードからアプリケーショントレースとメトリクスを収集できます。

CloudWatch で OpenTelemetry メトリクスをサポートするには、[AWS EMF Exporter for OpenTelemetry Collector](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/awsemfexporter) が OpenTelemetry 形式のメトリクスを CloudWatch Embedded Metric Format(EMF)に変換します。これにより、OpenTelemetry メトリクスに統合されたアプリケーションが[高基数のアプリケーションメトリクスを CloudWatch に送信](https://aws-otel.github.io/docs/getting-started/adot-eks-add-on/config-cloudwatch)できるようになります。

ログの場合、Fluent Bit は Amazon EC2 から [CloudWatch を含む AWS サービスへのログのストリーミング](https://docs.fluentbit.io/manual/pipeline/outputs/cloudwatch)を容易に拡張できます。ログ分析と保持のために。新しくリリースされた [Fluent Bit プラグイン](https://github.com/aws/amazon-cloudwatch-logs-for-fluent-bit#new-higher-performance-core-fluent-bit-plugin) は、ログを Amazon CloudWatch にルーティングできます。

ダッシュボードの場合、Grafana ワークスペースコンソールの AWS データソース構成オプションを使用すると、[Amazon CloudWatch をデータソースとして追加](https://docs.aws.amazon.com/grafana/latest/userguide/using-amazon-cloudwatch-in-AMG.html)できる Amazon Managed Grafana に追加できます。この機能により、既存の CloudWatch アカウントの検出と、CloudWatch へのアクセスに必要な認証情報の構成の管理が簡素化されます。

**ワークロードにはマイクロサービスコンピューティング、特に EKS/Kubernetes 関連のコンテナーが含まれています。Amazon CloudWatch を使用して環境の洞察を取得するにはどうすればよいですか?**

お客様は、[Amazon Elastic Kubernetes Service(Amazon EKS)](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/deploy-container-insights-EKS.html) または Amazon EC2 上の Kubernetes プラットフォームで実行されているコンテナ化されたアプリケーションとマイクロサービスからメトリクスとログを収集、集約、要約するために、[CloudWatch Container Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html) を使用できます。[Container Insights](https://aws.amazon.com/cloudwatch/faqs/#Container_Monitoring) は、Amazon EKS 用にデプロイされたクラスターからのメトリクスの収集もサポートしています。CloudWatch は CPU、メモリ、ディスク、ネットワークなど、多くのリソースのメトリクスを自動的に[収集](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-metrics.html)し、コンテナの再起動失敗などの診断情報を提供して、問題を特定および迅速に解決するのに役立ちます。

関連する AWS Observability ワークショップ: [EKS 上のコンテナインサイト](https://catalog.workshops.aws/observability/ja-JP/aws-native/insights/containerinsights/eks)

**ワークロードにはマイクロサービスコンピューティング、特に ECS 関連のコンテナーが含まれています。Amazon CloudWatch を使用して環境の洞察を取得するにはどうすればよいですか?**

お客様は、[Amazon Elastic Container Service(Amazon ECS)](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/deploy-container-insights-ECS.html) または Amazon EC2 上のコンテナプラットフォームで実行されているコンテナ化されたアプリケーションとマイクロサービスからメトリクスとログを収集、集約、要約するために、[CloudWatch Container Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html) を使用できます。[Container Insights](https://aws.amazon.com/cloudwatch/faqs/#Container_Monitoring) は、Amazon ECS 用にデプロイされたクラスターからのメトリクスの収集もサポートしています。CloudWatch は CPU、メモリ、ディスク、ネットワークなど、多くのリソースのメトリクスを自動的に[収集](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-metrics.html)し、コンテナの再起動失敗などの診断情報を提供して、問題を特定および迅速に解決するのに役立ちます。

関連する AWS Observability ワークショップ: [ECS 上のコンテナインサイト](https://catalog.workshops.aws/observability/ja-JP/aws-native/insights/containerinsights/ecs)

**ワークロードにはサーバーレスコンピューティング、特に AWS Lambda が含まれています。Amazon CloudWatch を使用して環境の洞察を取得するにはどうすればよいですか?**

お客様は、AWS Lambda 上で実行されているサーバーレスアプリケーションの監視とトラブルシューティングに [CloudWatch Lambda Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Lambda-Insights.html) を使用できます。[CloudWatch Lambda Insights](https://aws.amazon.com/cloudwatch/faqs/#Lambda_Monitoring) は、CPU 時間、メモリ、ディスク、ネットワークなどのシステムレベルのメトリクスを収集、集約、要約し、コールドスタートや Lambda ワーカーシャットダウンなどの診断情報を収集、集約、要約して、Lambda 関数の問題を特定および迅速に解決できるようにします。

関連する AWS Observability ワークショップ: [Lambda Insights](https://catalog.workshops.aws/observability/ja-JP/aws-native/insights/lambdainsights)

**Amazon CloudWatch Logs に多数のログを集約しています。これらのデータに対する可観測性をどのように得ることができますか?**

[CloudWatch Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html) を使用すると、システ
