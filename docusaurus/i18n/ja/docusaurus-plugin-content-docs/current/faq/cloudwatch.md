# Amazon CloudWatch - FAQ

**なぜ Amazon CloudWatch を選ぶべきですか?**

Amazon CloudWatch は、AWS クラウドリソースと AWS 上で実行されているアプリケーションを単一のプラットフォームで統合的に監視できる、AWS クラウドネイティブのサービスです。Amazon CloudWatch は、[ログ](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html)の形式で監視とオペレーショナルデータを収集し、[メトリクス](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/working_with_metrics.html)を追跡し、[イベント](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/events/WhatIsCloudWatchEvents.html)を設定し、[アラーム](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html)を設定できます。また、AWS 上で実行されているリソース、アプリケーション、サービスの[統合ビュー](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Dashboards.html)と[オンプレミスサーバー](https://aws.amazon.com/blogs/mt/how-to-monitor-hybrid-environment-with-aws-services/)を提供します。Amazon CloudWatch は、リソース使用率、アプリケーションのパフォーマンス、ワークロードの運用状況に関するシステム全体の可視性を提供します。Amazon CloudWatch は、AWS、ハイブリッド、オンプレミスのアプリケーションとインフラストラクチャリソースに対して[アクションを起こす洞察](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-Insights-Sections.html)を提供します。[クロスアカウントのオブザーバビリティ](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-Unified-Cross-Account.html)は、CloudWatch の統合オブザーバビリティ機能に追加されました。

**どの AWS サービスが Amazon CloudWatch と Amazon CloudWatch Logs に統合されていますか?**

Amazon CloudWatch は 70 以上の AWS サービスと統合されており、お客様は簡素化された監視とスケーラビリティのためにインフラストラクチャメトリクスを収集できます。サポートされている[CloudWatch メトリクスを公開する AWS サービス](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/aws-services-cloudwatch-metrics.html)の完全なリストについては、ドキュメントを参照してください。現在、30 以上の AWS サービスが CloudWatch Logs にログを公開しています。サポートされている[CloudWatch Logs にログを公開する AWS サービス](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/aws-services-sending-logs.html)の完全なリストについては、ドキュメントを参照してください。

**Amazon CloudWatch にすべての AWS サービスから公開されているメトリクスのリストはどこで確認できますか?**

[Amazon CloudWatch にメトリクスを公開する AWS サービス](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/aws-services-cloudwatch-metrics.html)のリストは、AWS ドキュメントにあります。

**Amazon CloudWatch へのメトリクスの収集と監視を開始するにはどうすればよいですか?**

[Amazon CloudWatch は様々な AWS サービスからメトリクスを収集](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/working_with_metrics.html)し、[AWS マネジメントコンソール、AWS CLI、API](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/viewing_metrics_with_cloudwatch.html)で確認できます。Amazon CloudWatch は、Amazon EC2 インスタンスの[利用可能なメトリクス](https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/viewing_metrics_with_cloudwatch.html)を収集します。追加のカスタムメトリクスについては、統合 CloudWatch エージェントを使用して収集と監視を行うことができます。

> 関連する AWS Observability ワークショップ: [Metrics](https://catalog.workshops.aws/observability/en-US/aws-native/metrics)

**Amazon EC2 インスタンスでは非常に詳細なレベルの監視が必要です。どうすればよいですか?**

デフォルトでは、Amazon EC2 はインスタンスの基本監視として 5 分間隔でメトリクスデータを CloudWatch に送信します。インスタンスのメトリクスデータを 1 分間隔で CloudWatch に送信するには、[詳細監視](https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/using-cloudwatch-new.html)をインスタンスで有効にできます。

**自分のアプリケーションで独自のメトリクスを公開したいのですが、その方法はありますか?**

お客様は、API または CLI を使用して、標準解像度の 1 分間隔または高解像度の 1 秒間隔で、[カスタムメトリクス](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/publishingMetrics.html)を CloudWatch に公開することができます。

CloudWatch エージェントは、Linux で Elastic Network Adapter (ENA) を使用する [EC2 インスタンスのネットワークパフォーマンスメトリクス](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-network-performance.html)、Linux サーバーからの [NVIDIA GPU メトリクス](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-NVIDIA-GPU.html)、Linux および Windows サーバー上の[個別のプロセス](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-procstat-process-metrics.html)からのプロセスメトリクス (procstat プラグインを使用) など、特殊なシナリオでカスタムメトリクスを EC2 インスタンスから収集することをサポートしています。

> 関連する AWS Observability ワークショップ: [Public custom metrics](https://catalog.workshops.aws/observability/en-US/aws-native/metrics/publishmetrics)

**Amazon CloudWatch エージェントを使用してカスタムメトリクスを収集するための追加のサポートはありますか?**

アプリケーションやサービスからのカスタムメトリクスは、[StatsD](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-custom-metrics-statsd.html)または[collectd](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-custom-metrics-collectd.html)プロトコルをサポートする統合 CloudWatch エージェントを使用して取得できます。StatsD は、さまざまなアプリケーションからメトリクスを収集できるポピュラーなオープンソースソリューションです。StatsD は、Linux および Windows ベースのサーバーでの独自のメトリクスの計装に特に役立ちます。collectd プロトコルは、Linux サーバーでのみサポートされているポピュラーなオープンソースソリューションで、さまざまなアプリケーションのシステム統計を収集できるプラグインが用意されています。

**ワークロードには多くの一時的なリソースが含まれ、高い基数のログが生成されます。メトリクスとログの収集と測定にはどのようなアプローチが推奨されますか?**

[CloudWatch 組み込みメトリクスフォーマット](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html)により、お客様は複雑な高基数のアプリケーションデータをログの形式で取り込み、Lambda 関数やコンテナなどの一時的なリソースからアクションを起こすメトリクスを生成できます。これにより、お客様は別のコードを計装したり保守したりする必要なく、カスタムメトリクスを詳細なログイベントデータとともに埋め込むことができ、ログデータに対する強力な分析機能を得ることができます。また、CloudWatch は自動的にカスタムメトリクスを抽出して、データの可視化とリアルタイムのインシデント検出のためのアラーム設定を支援します。

> 関連する AWS Observability ワークショップ: [Embedded Metric Format](https://catalog.workshops.aws/observability/en-US/aws-native/metrics/emf)

**Amazon CloudWatch へのログの収集と監視を開始するにはどうすればよいですか?**

[Amazon CloudWatch Logs](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html)は、既存のシステム、アプリケーション、カスタムログファイルを使用して、システムとアプリケーションをほぼリアルタイムで監視およびトラブルシューティングできるようにします。お客様は[統合 CloudWatch エージェント](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/CWL_GettingStarted.html)をインストールして、[Amazon EC2 インスタンスとオンプレミスサーバーからログを CloudWatch に収集](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html)できます。

> 関連する AWS Observability ワークショップ: [Log Insights](https://catalog.workshops.aws/observability/en-US/aws-native/logs/logsinsights)

**CloudWatch エージェントとは何ですか?なぜ使用する必要がありますか?**

[統合 CloudWatch エージェント](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html)は、x86-64 および ARM64 アーキテクチャをサポートするほとんどのオペレーティングシステムで動作するオープンソースソフトウェア (MIT ライセンス) です。CloudWatch エージェントは、Amazon EC2 インスタンスとオンプレミスサーバーからシステムレベルのメトリクスを収集し、ハイブリッド環境全体でオペレーティングシステムにわたってカスタムメトリクスをアプリケーションやサービスから取得し、Amazon EC2 インスタンスとオンプレミスサーバーからログを収集します。

**環境にはさまざまなスケールのインストールが必要です。CloudWatch エージェントを通常どおりインストールし、自動化することはできますか?**

サポートされているすべてのオペレーティングシステム (Linux および Windows サーバー) で、お客様は[コマンドライン](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/installing-cloudwatch-agent-commandline.html)、AWS [Systems Manager](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/installing-cloudwatch-agent-ssm.html)、または AWS [CloudFormation テンプレート](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent-New-Instances-CloudFormation.html)を使用して CloudWatch エージェントを[インストール](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-on-EC2-Instance.html)できます。また、[オンプレミスサーバーに CloudWatch エージェントをインストール](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-on-premise.html)して監視することもできます。

**当社には複数の AWS アカウントと複数のリージョンがあります。Amazon CloudWatch はこのようなシナリオに対応していますか?**

Amazon CloudWatch は[クロスアカウントのオブザーバビリティ](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-Unified-Cross-Account.html)を提供し、リージョン内の複数のアカウントにまたがるリソースとアプリケーションの健全性を監視およびトラブルシューティングできるようにします。Amazon CloudWatch は[クロスアカウント、クロスリージョンのダッシュボード](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/Cross-Account-Cross-Region.html)も提供します。この機能により、お客様はマルチアカウント、マルチリージョンのリソースとワークロードの可視性と洞察を得ることができます。

**Amazon CloudWatch には自動化のサポートがありますか?**

お客様は AWS マネジメントコンソールから Amazon CloudWatch にアクセスできるほか、API、[AWS コマンドラインインターフェイス (CLI)](https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/getting-started-install.html)、[AWS SDK](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/sdk-general-information-section.html) からもアクセスできます。メトリクスとダッシュボードの [CloudWatch API](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/APIReference/Welcome.html) は、[AWS CLI](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/cli/Welcome.html) を通じて自動化したり、ソフトウェア/製品と統合したりできるため、リソースやアプリケーションの管理や運用にかかる時間を節約できます。ログの [CloudWatch API](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatchLogs/latest/APIReference/Welcome.html) と [AWS CLI](https://docs.aws.amazon.com/ja_jp/cli/latest/reference/logs/index.html) も別途用意されています。お客様の参考のために、[AWS SDK
