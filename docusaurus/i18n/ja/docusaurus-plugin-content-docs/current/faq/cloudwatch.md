# Amazon CloudWatch - よくある質問

**Amazon CloudWatch を選ぶべき理由は何ですか？**

Amazon CloudWatch は、AWS クラウドリソースと AWS 上で実行するアプリケーションを単一のプラットフォームで統合的に監視するための AWS クラウドネイティブサービスです。Amazon CloudWatch を使用して、[ログ](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html)の形式でモニタリングおよび運用データを収集し、[メトリクス](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/working_with_metrics.html)を追跡し、[イベント](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/events/WhatIsCloudWatchEvents.html)を管理し、[アラーム](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html)を設定することができます。また、AWS リソース、アプリケーション、および AWS 上で実行されるサービスと[オンプレミスサーバー](https://aws.amazon.com/blogs/mt/how-to-monitor-hybrid-environment-with-aws-services/)の[統合ビュー](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Dashboards.html)も提供します。Amazon CloudWatch は、ワークロードのリソース使用率、アプリケーションパフォーマンス、および運用状態についてシステム全体の可視性を提供します。Amazon CloudWatch は、AWS、ハイブリッド、およびオンプレミスのアプリケーションとインフラストラクチャリソースに対する[実用的な洞察](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-Insights-Sections.html)を提供します。[クロスアカウント監視](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-Unified-Cross-Account.html)は、CloudWatch の統合監視機能に追加されたものです。

**Amazon CloudWatch および Amazon CloudWatch Logs にネイティブに統合されている AWS サービスはどれですか？**

Amazon CloudWatch は 70 以上の AWS サービスとネイティブに統合されており、お客様は簡素化されたモニタリングとスケーラビリティのためにインフラストラクチャメトリクスを収集することができます。サポートされている [CloudWatch メトリクスを公開する AWS サービス](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/aws-services-cloudwatch-metrics.html)の完全なリストについてはドキュメントをご確認ください。現在、30 以上の AWS サービスが CloudWatch にログを公開しています。サポートされている [CloudWatch Logs にログを公開する AWS サービス](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/aws-services-sending-logs.html)の完全なリストについてはドキュメントをご確認ください。

**すべての AWS サービスから Amazon CloudWatch に公開されているすべてのメトリクスのリストはどこで入手できますか？**

[CloudWatch にメトリクスを公開するすべての AWS サービス](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/aws-services-cloudwatch-metrics.html)のリストは AWS ドキュメントにあります。

**Amazon CloudWatch へのメトリクスの収集と監視を始めるにはどうすればよいですか？**

[Amazon CloudWatch はメトリクスを収集](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/working_with_metrics.html)し、様々な AWS サービスから[AWS マネジメントコンソール、AWS CLI、または API](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/viewing_metrics_with_cloudwatch.html) を通じて表示することができます。Amazon CloudWatch は Amazon EC2 インスタンスの[利用可能なメトリクス](https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/viewing_metrics_with_cloudwatch.html)を収集します。追加のカスタムメトリクスについては、お客様は統合 CloudWatch エージェントを使用して収集および監視することができます。

> 関連する AWS Observability ワークショップ: [メトリクス](https://catalog.workshops.aws/observability/en-US/aws-native/metrics)

**Amazon EC2 インスタンスに非常に詳細なレベルの監視が必要な場合はどうすればよいですか？**

デフォルトでは、Amazon EC2 は 5 分間隔でメトリクスデータを CloudWatch に送信し、インスタンスの基本モニタリングを行います。インスタンスのメトリクスデータを 1 分間隔で CloudWatch に送信するには、インスタンスで[詳細モニタリング](https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/using-cloudwatch-new.html)を有効にすることができます。

**アプリケーション用の独自のメトリクスを公開したいのですが、オプションはありますか？**

お客様は、API または CLI を使用して、標準解像度の 1 分間隔または高解像度の 1 秒間隔まで、[カスタムメトリクス](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/publishingMetrics.html)を CloudWatch に公開することもできます。

CloudWatch エージェントは、Elastic Network Adapter (ENA) を使用する Linux 上で実行される EC2 インスタンスの[ネットワークパフォーマンスメトリクス](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-network-performance.html)、Linux サーバーからの [NVIDIA GPU メトリクス](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-NVIDIA-GPU.html)、procstat プラグインを使用した Linux および Windows サーバー上の[個別プロセス](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-procstat-process-metrics.html)からのプロセスメトリクスなど、特殊なシナリオでの EC2 インスタンスからのカスタムメトリクスの収集もサポートしています。

> 関連する AWS Observability ワークショップ: [パブリックカスタムメトリクス](https://catalog.workshops.aws/observability/en-US/aws-native/metrics/publishmetrics)

**Amazon CloudWatch エージェントを通じてカスタムメトリクスを収集するためのさらなるサポートは何がありますか？**

アプリケーションやサービスからのカスタムメトリクスは、[StatsD](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-custom-metrics-statsd.html) または [collectd](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-custom-metrics-collectd.html) プロトコルをサポートする統合 CloudWatch エージェントを使用して取得できます。StatsD は、幅広いアプリケーションからメトリクスを収集できる人気のあるオープンソースソリューションです。StatsD は特に独自のメトリクスを計測するのに役立ち、Linux と Windows ベースのサーバーの両方をサポートしています。collectd プロトコルは、Linux サーバーのみでサポートされる人気のあるオープンソースソリューションで、幅広いアプリケーションのシステム統計を収集できるプラグインを備えています。

**ワークロードに多くの一時的なリソースが含まれ、高カーディナリティのログを生成する場合、メトリクスとログを収集および測定するための推奨アプローチは何ですか？**

[CloudWatch 埋め込みメトリクスフォーマット](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html)を使用すると、お客様は複雑な高カーディナリティのアプリケーションデータをログの形式で取り込み、Lambda 関数やコンテナなどの一時的なリソースから実用的なメトリクスを生成することができます。これにより、お客様は詳細なログイベントデータと一緒にカスタムメトリクスを埋め込むことができ、別のコードを計測または維持する必要がなく、ログデータに対する強力な分析機能を得ることができます。また、CloudWatch は自動的にカスタムメトリクスを抽出し、データの可視化やリアルタイムのインシデント検出のためのアラーム設定に役立ちます。

> 関連する AWS Observability ワークショップ: [埋め込みメトリクスフォーマット](https://catalog.workshops.aws/observability/en-US/aws-native/metrics/emf)

**Amazon CloudWatch でのログの収集と監視を始めるにはどうすればよいですか？**

[Amazon CloudWatch Logs](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html) は、既存のシステム、アプリケーション、およびカスタムログファイルを使用して、ほぼリアルタイムでシステムとアプリケーションを監視およびトラブルシューティングするのに役立ちます。お客様は [統合 CloudWatch エージェント](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/CWL_GettingStarted.html)をインストールして、[Amazon EC2 インスタンスとオンプレミスサーバーからログを収集](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html)し、CloudWatch に送信することができます。

> 関連する AWS Observability ワークショップ: [Log Insights](https://catalog.workshops.aws/observability/en-US/aws-native/logs/logsinsights)

**CloudWatch エージェントとは何で、なぜ使用すべきですか？**

[統合 CloudWatch エージェント](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html)は、MIT ライセンスのオープンソースソフトウェアで、x86-64 および ARM64 アーキテクチャを利用するほとんどのオペレーティングシステムをサポートしています。CloudWatch エージェントは、Amazon EC2 インスタンスとハイブリッド環境のオンプレミスサーバーからオペレーティングシステム全体のシステムレベルのメトリクスを収集し、アプリケーションやサービスからカスタムメトリクスを取得し、Amazon EC2 インスタンスとオンプレミスサーバーからログを収集するのに役立ちます。

**環境内にあらゆる規模のインストールが必要な場合、CloudWatch エージェントを通常どおりにインストールし、自動化を使用するにはどうすればよいですか？**

Linux と Windows サーバーを含むすべてのサポートされているオペレーティングシステムで、お客様は [コマンドライン](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/installing-cloudwatch-agent-commandline.html)、[AWS Systems Manager](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/installing-cloudwatch-agent-ssm.html)、または [AWS CloudFormation テンプレート](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent-New-Instances-CloudFormation.html)を使用して [CloudWatch エージェントをダウンロードしてインストール](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-on-EC2-Instance.html)することができます。また、監視のために [オンプレミスサーバーに CloudWatch エージェントをインストール](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-on-premise.html)することもできます。

**組織内に複数のリージョンにまたがる複数の AWS アカウントがある場合、Amazon CloudWatch はこれらのシナリオで機能しますか？**

Amazon CloudWatch は [クロスアカウント監視](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-Unified-Cross-Account.html)を提供し、お客様が複数のアカウントにまたがるリージョン内のリソースとアプリケーションの健全性を監視およびトラブルシューティングするのに役立ちます。Amazon CloudWatch はまた、[クロスアカウント、クロスリージョンダッシュボード](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/Cross-Account-Cross-Region.html)を提供します。この機能により、お客様はマルチアカウント、マルチリージョンのリソースとワークロードの可視性と洞察を得ることができます。

**Amazon CloudWatch にはどのような自動化サポートがありますか？**

AWS マネジメントコンソールを通じて Amazon CloudWatch にアクセスする以外に、お客様は API、[AWS コマンドラインインターフェイス (CLI)](https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/getting-started-install.html)、および [AWS SDK](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/sdk-general-information-section.html) を通じてもサービスにアクセスできます。メトリクスとダッシュボード用の [CloudWatch API](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/APIReference/Welcome.html) は、[AWS CLI](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/cli/Welcome.html) を通じた自動化やソフトウ
