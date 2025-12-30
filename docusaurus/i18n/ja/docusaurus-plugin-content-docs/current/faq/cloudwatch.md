# Amazon CloudWatch - FAQ

## Amazon CloudWatch を選択する理由

Amazon CloudWatch は、AWS クラウドリソースと AWS 上で実行するアプリケーションを単一のプラットフォームで統合的に監視できる AWS クラウドネイティブサービスです。Amazon CloudWatch を使用すると、[ログ](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html)の形式で監視データと運用データを収集し、[メトリクス](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/working_with_metrics.html)、[イベント](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/WhatIsCloudWatchEvents.html)を追跡し、[アラーム](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html)を設定できます。また、AWS 上で実行される AWS リソース、アプリケーション、サービス、および[オンプレミスサーバー](https://aws.amazon.com/blogs/mt/how-to-monitor-hybrid-environment-with-aws-services/)の[統合ビュー](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Dashboards.html)も提供します。Amazon CloudWatch は、リソース使用率、アプリケーションパフォーマンス、ワークロードの運用状態をシステム全体で可視化するのに役立ちます。Amazon CloudWatch は、AWS、ハイブリッド、オンプレミスのアプリケーションとインフラストラクチャリソースに対する[実用的なインサイト](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Insights-Sections.html)を提供します。[クロスアカウントオブザーバビリティ](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Unified-Cross-Account.html)は、CloudWatch の統合オブザーバビリティ機能への追加機能です。

## Amazon CloudWatch および Amazon CloudWatch Logs とネイティブに統合されている AWS サービスはどれですか？

Amazon CloudWatch は 70 以上の AWS サービスとネイティブに統合されており、お客様はインフラストラクチャメトリクスを収集して、アクションなしで監視とスケーラビリティを簡素化できます。サポートされている [CloudWatch メトリクスを発行する AWS サービス](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/aws-services-cloudwatch-metrics.html)の完全なリストについては、ドキュメントを確認してください。現在、30 以上の AWS サービスが CloudWatch にログを発行しています。サポートされている [CloudWatch Logs にログを発行する AWS サービス](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/aws-services-sending-logs.html)の完全なリストについては、ドキュメントを確認してください。

## Amazon CloudWatch に発行されるすべての AWS サービスのメトリクスのリストはどこで入手できますか?

Amazon CloudWatch に[メトリクスを発行するすべての AWS サービス](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/aws-services-cloudwatch-metrics.html)のリストは、AWS ドキュメントに記載されています。

## Amazon CloudWatch へのメトリクスの収集と監視を始めるにはどうすればよいですか？

[Amazon CloudWatch はメトリクスを収集します](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/working_with_metrics.html)。さまざまな AWS サービスから取得でき、[AWS Management Console、AWS CLI、または API](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/viewing_metrics_with_cloudwatch.html) を通じて表示できます。Amazon CloudWatch は Amazon EC2 インスタンスの[利用可能なメトリクス](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/viewing_metrics_with_cloudwatch.html)を収集します。追加のカスタムメトリクスについては、統合 CloudWatch エージェントを使用して収集および監視できます。

> 関連する AWS Observability ワークショップ: [メトリクス](https://catalog.workshops.aws/observability/en-US/aws-native/metrics)

## Amazon EC2 インスタンスに非常に詳細なレベルの監視が必要な場合、どうすればよいですか?

デフォルトでは、Amazon EC2 はインスタンスの基本モニタリングとして、5 分間隔でメトリクスデータを CloudWatch に送信します。インスタンスのメトリクスデータを 1 分間隔で CloudWatch に送信するには、インスタンスで[詳細モニタリング](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-cloudwatch-new.html)を有効にすることができます。

## 自分のアプリケーション用に独自のメトリクスを発行したいのですが、オプションはありますか？

お客様は、API または CLI を使用して、標準解像度の 1 分間隔または高解像度の 1 秒間隔で、独自の[カスタムメトリクス](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/publishingMetrics.html)を CloudWatch に発行することもできます。

CloudWatch エージェントは、Elastic Network Adapter (ENA) を使用する Linux で実行される EC2 インスタンスの[ネットワークパフォーマンスメトリクス](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-network-performance.html)、Linux サーバーからの [NVIDIA GPU メトリクス](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-NVIDIA-GPU.html)、Linux および Windows サーバー上の[個別プロセス](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-procstat-process-metrics.html)からの procstat プラグインを使用したプロセスメトリクスなど、特殊なシナリオにおける EC2 インスタンスからのカスタムメトリクスの収集もサポートしています。

> 関連する AWS Observability Workshop: [パブリックカスタムメトリクス](https://catalog.workshops.aws/observability/en-US/aws-native/metrics/publishmetrics)

## Amazon CloudWatch エージェントを通じてカスタムメトリクスを収集するために利用できる追加のサポートは何ですか？

アプリケーションまたはサービスからのカスタムメトリクスは、[StatsD](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-custom-metrics-statsd.html) または [collectd](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-custom-metrics-collectd.html) プロトコルをサポートする統合 CloudWatch エージェントを使用して取得できます。StatsD は、さまざまなアプリケーションからメトリクスを収集できる人気のオープンソースソリューションです。StatsD は、独自のメトリクスを計測する場合に特に便利で、Linux と Windows ベースの両方のサーバーをサポートしています。collectd プロトコルは、Linux サーバーでのみサポートされている人気のオープンソースソリューションで、さまざまなアプリケーションのシステム統計を収集できるプラグインを備えています。

## ワークロードに大量の一時的なリソースが含まれており、高カーディナリティのログが生成される場合、メトリクスとログを収集および測定するための推奨アプローチは何ですか？

[CloudWatch embedded metric format](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html) を使用すると、複雑で高カーディナリティのアプリケーションデータをログの形式で取り込み、Lambda 関数やコンテナなどの一時的なリソースから実用的なメトリクスを生成できます。これにより、個別のコードを実装または保守することなく、詳細なログイベントデータと共にカスタムメトリクスを埋め込むことができ、ログデータに対する強力な分析機能を獲得できます。CloudWatch は自動的にカスタムメトリクスを抽出してデータの可視化を支援し、リアルタイムのインシデント検出のためにアラームを設定できます。

> 関連する AWS Observability Workshop: [Embedded Metric Format](https://catalog.workshops.aws/observability/en-US/aws-native/metrics/emf)

## Amazon CloudWatch へのログの収集と監視を開始するにはどうすればよいですか？

[Amazon CloudWatch Logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html) は、既存のシステム、アプリケーション、カスタムログファイルを使用して、ほぼリアルタイムでシステムとアプリケーションの監視とトラブルシューティングを行うのに役立ちます。お客様は [統合 CloudWatch エージェント](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_GettingStarted.html)をインストールして、[Amazon EC2 インスタンスとオンプレミスサーバーからログを収集](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html)し、CloudWatch に送信できます。

> 関連する AWS Observability ワークショップ: [Log Insights](https://catalog.workshops.aws/observability/en-US/aws-native/logs/logsinsights)

## CloudWatch エージェントとは何ですか？なぜ使用する必要がありますか？

[Unified CloudWatch Agent](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html) は、MIT ライセンスの下で提供されるオープンソースソフトウェアであり、x86-64 および ARM64 アーキテクチャを利用するほとんどのオペレーティングシステムをサポートしています。CloudWatch Agent は、オペレーティングシステム全体のハイブリッド環境において Amazon EC2 インスタンスとオンプレミスサーバーからシステムレベルのメトリクスを収集し、アプリケーションやサービスからカスタムメトリクスを取得し、Amazon EC2 インスタンスとオンプレミスサーバーからログを収集するのに役立ちます。

## 環境内で必要なすべての規模のインストールがあるため、CloudWatch エージェントを通常の方法と自動化を使用してインストールするにはどうすればよいですか?

Linux および Windows Server を含むすべてのサポート対象オペレーティングシステムにおいて、お客様は[コマンドライン](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/installing-cloudwatch-agent-commandline.html)、AWS [Systems Manager](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/installing-cloudwatch-agent-ssm.html)、または AWS [CloudFormation テンプレート](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent-New-Instances-CloudFormation.html)を使用して、[CloudWatch エージェントをダウンロードしてインストール](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-on-EC2-Instance.html)できます。また、監視のために[オンプレミスサーバーに CloudWatch エージェントをインストール](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-on-premise.html)することもできます。

## 組織内の複数のリージョンに複数の AWS アカウントがありますが、Amazon CloudWatch はこれらのシナリオに対応していますか?

Amazon CloudWatch は[クロスアカウントオブザーバビリティ](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Unified-Cross-Account.html)を提供しており、リージョン内の複数のアカウントにまたがるリソースとアプリケーションの健全性を監視およびトラブルシューティングするのに役立ちます。Amazon CloudWatch は[クロスアカウント、クロスリージョンダッシュボード](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Cross-Account-Cross-Region.html)も提供しています。この機能により、お客様はマルチアカウント、マルチリージョンのリソースとワークロードの可視性と洞察を得ることができます。

## Amazon CloudWatch ではどのような自動化サポートが利用できますか？

AWS Management Console を通じて Amazon CloudWatch にアクセスする以外に、お客様は API、[AWS コマンドラインインターフェイス (CLI)](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)、および [AWS SDK](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/sdk-general-information-section.html) を介してサービスにアクセスすることもできます。メトリクスとダッシュボード用の [CloudWatch API](https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/Welcome.html) は、[AWS CLI](https://docs.aws.amazon.com/AmazonCloudWatch/latest/cli/Welcome.html) を通じた自動化や、ソフトウェア/製品との統合に役立ち、リソースやアプリケーションの管理や運用にかける時間を削減できます。ログ用の [CloudWatch API](https://docs.aws.amazon.com/AmazonCloudWatchLogs/latest/APIReference/Welcome.html) も [AWS CLI](https://docs.aws.amazon.com/cli/latest/reference/logs/index.html) と共に別途利用可能です。[AWS SDK を使用した CloudWatch のコード例](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/service_code_examples.html)も、お客様の追加リファレンスとして利用できます。

## リソースの監視をすぐに始めたいのですが、推奨されるアプローチは何ですか？

CloudWatch の自動ダッシュボードは、すべての AWS パブリックリージョンで利用可能であり、すべての AWS リソースの健全性とパフォーマンスの集約されたビューを提供します。これにより、お客様は監視を迅速に開始でき、メトリクスとアラームのリソースベースのビューを利用し、パフォーマンス問題の根本原因を簡単に掘り下げて理解できます。[自動ダッシュボード](https://docs.aws.amazon.com/prescriptive-guidance/latest/implementing-logging-monitoring-cloudwatch/cloudwatch-dashboards-visualizations.html)は、AWS サービスの推奨ベストプラクティスに基づいて事前構築されており、リソースを認識し、重要なパフォーマンスメトリクスの最新状態を反映するように動的に更新されます。

関連する AWS Observability Workshop: [自動ダッシュボード](https://catalog.workshops.aws/observability/en-US/aws-native/dashboards/autogen-dashboard)

## CloudWatch で監視する内容をカスタマイズしたい場合、推奨されるアプローチは何ですか?

[カスタムダッシュボード](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/create_dashboard.html)を使用すると、お客様はさまざまなウィジェットを含む追加のダッシュボードを必要な数だけ作成し、それに応じてカスタマイズできます。カスタムダッシュボードを作成する際には、カスタマイズのために選択できるさまざまなウィジェットタイプが用意されています。

関連する AWS Observability Workshop: [ダッシュボード](https://catalog.workshops.aws/observability/en-US/aws-native/ec2-monitoring/dashboarding)

## いくつかのカスタムダッシュボードを作成しましたが、共有する方法はありますか？

はい、[CloudWatch ダッシュボードの共有](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch-dashboard-sharing.html)は可能です。共有には 3 つの方法があります。リンクにアクセスできるすべてのユーザーがダッシュボードを表示できるようにして、単一のダッシュボードを公開的に共有する方法。ダッシュボードの表示を許可するユーザーのメールアドレスを指定して、単一のダッシュボードを非公開で共有する方法。ダッシュボードアクセス用のサードパーティのシングルサインオン (SSO) プロバイダーを指定して、アカウント内のすべての CloudWatch ダッシュボードを共有する方法です。

> 関連する AWS Observability ワークショップ: [CloudWatch ダッシュボードの共有](https://catalog.workshops.aws/observability/en-US/aws-native/dashboards/sharingdashboard)

## 基盤となる AWS リソースを含むアプリケーションのオブザーバビリティを向上させたいのですが、どのように実現できますか?

[Amazon CloudWatch Application Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch-application-insights.html) は、SQL Server データベース、.Net ベースの Web (IIS) スタック、アプリケーションサーバー、OS、ロードバランサー、キューなど、基盤となる AWS リソースとともに、アプリケーションのオブザーバビリティを促進します。これにより、お客様はアプリケーションリソースとテクノロジースタック全体で主要なメトリクスとログを特定し、設定することができます。これにより、平均修復時間 (MTTR) を短縮し、アプリケーションの問題をより迅速にトラブルシューティングできます。

> FAQ の追加詳細: [AWS リソースとカスタムメトリクスのモニタリング](https://aws.amazon.com/cloudwatch/faqs/#AWS_resource_.26_custom_metrics_monitoring)

## 私の組織はオープンソース中心ですが、Amazon CloudWatch はオープンソーステクノロジーを通じた監視とオブザーバビリティをサポートしていますか?

メトリクスとトレースを収集するには、[AWS Distro for OpenTelemetry (ADOT) Collector](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-open-telemetry.html) を CloudWatch エージェントと共に Amazon EC2 インスタンスにサイドバイサイドでインストールし、OpenTelemetry SDK を使用して Amazon EC2 インスタンス上で実行されているワークロードからアプリケーショントレースとメトリクスを収集できます。

Amazon CloudWatch で OpenTelemetry メトリクスをサポートするために、[AWS EMF Exporter for OpenTelemetry Collector](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/awsemfexporter) は OpenTelemetry 形式のメトリクスを CloudWatch Embedded Metric Format(EMF) に変換します。これにより、OpenTelemetry メトリクスに統合されたアプリケーションが、高カーディナリティの[アプリケーションメトリクスを CloudWatch に送信](https://aws-otel.github.io/docs/getting-started/adot-eks-add-on/config-cloudwatch)できるようになります。

ログについては、Fluent Bit を使用することで、[Amazon EC2 からのログ](https://docs.fluentbit.io/manual/pipeline/outputs/cloudwatch)をログの保持と分析のための Amazon CloudWatch を含む AWS サービスにストリーミングするための簡単な拡張ポイントを作成できます。新しくリリースされた [Fluent Bit プラグイン](https://github.com/aws/amazon-cloudwatch-logs-for-fluent-bit#new-higher-performance-core-fluent-bit-plugin)は、ログを Amazon CloudWatch にルーティングできます。

ダッシュボードについては、Grafana ワークスペースコンソールの AWS データソース設定オプションを使用して、[Amazon CloudWatch をデータソースとして](https://docs.aws.amazon.com/grafana/latest/userguide/using-amazon-cloudwatch-in-AMG.html) Amazon Managed Grafana に追加できます。この機能により、既存の CloudWatch アカウントを検出し、CloudWatch へのアクセスに必要な認証情報の設定を管理することで、CloudWatch をデータソースとして追加する作業が簡素化されます。

## ワークロードは既に環境から Prometheus を使用してメトリクスを収集するように構築されています。同じ方法を引き続き使用できますか？

お客様は、オブザーバビリティのニーズに対して、すべてオープンソースのセットアップを選択できます。その場合、AWS Distro for OpenTelemetry (ADOT) Collector を設定して、Prometheus でインストルメント化されたアプリケーションからスクレイピングし、メトリクスを Prometheus Server または Amazon Managed Prometheus に送信できます。

EC2 インスタンス上の CloudWatch エージェントは、CloudWatch での監視のために [Prometheus でメトリクスをスクレイピング](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-PrometheusEC2.html)するようにインストールおよび設定できます。これは、EC2 上のコンテナワークロードを好み、オープンソースの Prometheus 監視と互換性のあるカスタムメトリクスを必要とするお客様に役立ちます。

CloudWatch [Container Insights monitoring for Prometheus](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights-Prometheus.html) は、コンテナ化されたシステムとワークロードからの Prometheus メトリクスの検出を自動化します。Prometheus メトリクスの検出は、Amazon Elastic Container Service (ECS)、Amazon Elastic Kubernetes Service (EKS)、および Amazon EC2 インスタンス上で実行される Kubernetes クラスターでサポートされています。

## ワークロードにマイクロサービスコンピューティング、特に EKS/Kubernetes 関連のコンテナが含まれている場合、Amazon CloudWatch を使用して環境に関するインサイトを取得するにはどうすればよいですか?

お客様は [CloudWatch Container Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html) を使用して、[Amazon Elastic Kubernetes Service (Amazon EKS)](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/deploy-container-insights-EKS.html) または Amazon EC2 上の Kubernetes プラットフォームで実行されているコンテナ化されたアプリケーションとマイクロサービスからメトリクスとログを収集、集約、要約できます。[Container Insights](https://aws.amazon.com/cloudwatch/faqs/#Container_Monitoring) は、Amazon EKS 用の Fargate にデプロイされたクラスターからのメトリクス収集もサポートしています。CloudWatch は、CPU、メモリ、ディスク、ネットワークなどの多くのリソースの[メトリクスを自動的に収集](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-metrics.html)し、コンテナの再起動失敗などの[診断情報を提供](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-reference.html)して、問題を迅速に特定して解決できるようにします。

> 関連する AWS Observability ワークショップ: [EKS の Container Insights](https://catalog.workshops.aws/observability/en-US/aws-native/insights/containerinsights/eks)

## マイクロサービスコンピューティング、特に ECS 関連のコンテナを含むワークロードで、Amazon CloudWatch を使用して環境に関するインサイトを得るにはどうすればよいですか?

お客様は [CloudWatch Container Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html) を使用して、[Amazon Elastic Container Service (Amazon ECS)](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/deploy-container-insights-ECS.html) または Amazon EC2 上のコンテナプラットフォームで実行されているコンテナ化されたアプリケーションとマイクロサービスからメトリクスとログを収集、集約、要約できます。[Container Insights](https://aws.amazon.com/cloudwatch/faqs/#Container_Monitoring) は、Amazon ECS 用の Fargate にデプロイされたクラスターからのメトリクス収集もサポートしています。CloudWatch は、CPU、メモリ、ディスク、ネットワークなどの多くのリソースから自動的に[メトリクスを収集](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-metrics.html)し、コンテナの再起動失敗などの[診断情報を提供](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-reference.html)して、問題を迅速に特定して解決できるようにします。

> 関連する AWS Observability ワークショップ: [ECS の Container Insights](https://catalog.workshops.aws/observability/en-US/aws-native/insights/containerinsights/ecs)

## ワークロードにサーバーレスコンピューティング、特に AWS Lambda が含まれている場合、Amazon CloudWatch を使用して環境に関するインサイトを得るにはどうすればよいですか?

お客様は、AWS Lambda 上で実行されるサーバーレスアプリケーションの監視とトラブルシューティングに [CloudWatch Lambda Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Lambda-Insights.html) を使用できます。[CloudWatch Lambda Insights](https://aws.amazon.com/cloudwatch/faqs/#Lambda_Monitoring) は、CPU 時間、メモリ、ディスク、ネットワークなどのシステムレベルのメトリクスを収集、集約、要約し、コールドスタートや Lambda ワーカーのシャットダウンなどの診断情報も収集、集約、要約することで、お客様が Lambda 関数の問題を特定し、迅速に解決できるよう支援します。

> 関連する AWS Observability Workshop: [Lambda Insights](https://catalog.workshops.aws/observability/en-US/aws-native/insights/lambdainsights)

## 大量のログを Amazon CloudWatch Logs に集約していますが、これらのデータのオブザーバビリティを得るにはどうすればよいですか?

[CloudWatch Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html) を使用すると、お客様はログデータをインタラクティブに検索、分析し、Amazon CloudWatch Logs の運用上の問題に効率的かつ効果的に対応するためのクエリを実行できます。問題が発生した場合、お客様は [CloudWatch Logs Insights](https://aws.amazon.com/cloudwatch/faqs/#Log_analytics) を使用して潜在的な原因を特定し、デプロイされた修正を検証できます。

## Amazon CloudWatch Logs でログをクエリするにはどうすればよいですか?

Amazon CloudWatch Logs の CloudWatch Logs Insights は、[クエリ言語](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html)を使用してロググループをクエリします。

## コスト最適化、コンプライアンス保持、または追加処理のために Amazon CloudWatch Logs に保存されたログを管理するにはどうすればよいですか?

デフォルトでは、Amazon CloudWatch Logs の [LogGroups](https://aws.amazon.com/cloudwatch/faqs/#Log_management) は[無期限に保持され、期限切れになることはありません](https://docs.aws.amazon.com/managedservices/latest/userguide/log-customize-retention.html)。お客様は、各ロググループの保持ポリシーを調整して、コストを最適化するため、またはコンプライアンス目的でログを保持する期間に応じて、1 日から 10 年の間の保持期間を選択できます。

お客様は、[ログ グループから Amazon S3 バケットにログ データをエクスポート](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/S3Export.html)し、このデータをカスタム処理や分析に使用したり、他のシステムに読み込んだりすることができます。

お客様は、CloudWatch Logs のロググループを設定して、CloudWatch Logs サブスクリプションを通じてほぼリアルタイムで [Amazon OpenSearch Service にデータをストリーミング](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_OpenSearch_Stream.html)することもできます。これにより、インタラクティブなログ分析、リアルタイムアプリケーションモニタリング、検索などの実行が可能になります。

## ワークロードが機密データを含む可能性のあるログを生成する場合、Amazon CloudWatch でそれらを保護する方法はありますか？

お客様は、CloudWatch Logs の[ログデータ保護機能](https://aws.amazon.com/cloudwatch/faqs/#Log_data_protection)を利用できます。この機能は、システムやアプリケーションから収集されるログ内の機密データを自動的に検出してマスクするための[独自のルールとポリシーを定義する](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/mask-sensitive-log-data.html#mask-sensitive-log-data-start)ことを支援します。

関連する AWS Observability Workshop: [データ保護](https://catalog.workshops.aws/observability/en-US/aws-native/logs/dataprotection)

## システムやアプリケーションに異常バンドや予期しない変化が発生した際に、それを知りたいと考えています。Amazon CloudWatch は発生時にどのようにアラートを送信できますか？

[Amazon CloudWatch Anomaly Detection](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Anomaly_Detection.html) は、統計および機械学習アルゴリズムを適用して、システムとアプリケーションの単一の時系列を継続的に分析し、正常なベースラインを決定し、最小限のユーザー介入で異常を検出します。このアルゴリズムは、正常なメトリクスの動作を表す期待値の範囲を生成する異常検出モデルを作成します。お客様は、過去のメトリクスデータの分析と異常しきい値に設定された値に基づいて[アラームを作成](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Create_Anomaly_Detection_Alarm.html)できます。

> 関連する AWS Observability Workshop: [異常検知](https://catalog.workshops.aws/observability/en-US/aws-native/metrics/alarms/anomalydetection)

## Amazon CloudWatch でメトリクスアラームを設定しましたが、頻繁にアラーム通知が発生しています。これを制御して微調整するにはどうすればよいですか?

お客様は、複数のアラームを[コンポジットアラーム](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Create_Composite_Alarm.html)としてアラーム階層に組み合わせることで、複数の[アラーム](https://aws.amazon.com/cloudwatch/faqs/#Alarms)が同時に発火した際に一度だけトリガーすることでアラームノイズを削減できます。コンポジットアラームは、アプリケーション、AWS リージョン、または AZ などのリソースをグループ化することで、全体的な状態をサポートします。

> 関連する AWS Observability ワークショップ: [アラーム](https://catalog.workshops.aws/observability/en-US/aws-native/metrics/alarms)

## インターネットに公開されているワークロードでパフォーマンスと可用性の問題が発生していますが、どのようにトラブルシューティングすればよいですか?

[Amazon CloudWatch Internet Monitor](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-InternetMonitor.html) は、AWS でホストされているアプリケーションとエンドユーザー間のパフォーマンスと可用性にインターネットの問題がどのように影響するかを可視化します。[Internet Monitor](https://aws.amazon.com/cloudwatch/faqs/#Internet_Monitoring) を使用すると、アプリケーションのパフォーマンスと可用性に影響を与えている要因を迅速に特定できるため、問題を追跡して対処することができ、インターネットの問題を診断するのにかかる時間を大幅に短縮できます。

## AWS でワークロードを実行しており、エンドユーザーがアプリケーションへのアクセスで影響や遅延を経験する前に通知を受け取りたいと考えています。顧客向けワークロードの可視性を高め、オブザーバビリティを向上させるにはどうすればよいですか？

お客様は [Amazon CloudWatch Synthetics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries.html) を使用して Canary を作成できます。Canary は、スケジュールに従って実行される設定可能なスクリプトで、エンドポイントと API を監視します。Canary は顧客と同じルートをたどり、同じアクションを実行するため、アプリケーションへのライブトラフィックがない場合でも、エンドユーザーエクスペリエンスを継続的に検証できます。Canary は、お客様が気付く前に問題を発見するのに役立ちます。Canary はエンドポイントの可用性とレイテンシーをチェックし、ヘッドレス Chromium ブラウザでレンダリングされた UI の読み込み時間データとスクリーンショットを保存できます。

> 関連する AWS Observability ワークショップ: [CloudWatch Synthetics](https://catalog.workshops.aws/observability/en-US/aws-native/app-monitoring/synthetics)

## クライアント側のパフォーマンスを特定してエンドユーザーエクスペリエンスを観察し、リアルタイムの問題を解決するにはどうすればよいですか？

[CloudWatch RUM](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM.html) は、実際のユーザーセッションから Web アプリケーションのパフォーマンスに関するクライアント側のデータをほぼリアルタイムで収集および表示するリアルユーザーモニタリングを実行できます。この収集されたデータは、クライアント側のパフォーマンスの問題を迅速に特定およびデバッグするのに役立ち、ページの読み込み時間、クライアント側のエラー、ユーザーの行動を視覚化および分析するのにも役立ちます。このデータを表示する際、お客様はすべてを集約して表示できるだけでなく、お客様が使用するブラウザやデバイスごとの内訳も確認できます。CloudWatch RUM は、アプリケーションのパフォーマンスの異常を視覚化し、エラーメッセージ、スタックトレース、ユーザーセッションなどの関連するデバッグデータを見つけるのに役立ちます。

> 関連する AWS Observability ワークショップ: [CloudWatch RUM](https://catalog.workshops.aws/observability/en-US/aws-native/app-monitoring/rum)

## 私の組織では、監査のためにすべてのアクションを記録する必要があります。Amazon CloudWatch イベントを記録できますか？

Amazon CloudWatch は [AWS CloudTrail](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html) と統合されており、Amazon CloudWatch でユーザー、ロール、または AWS サービスによって実行されたアクションの記録を提供します。CloudTrail は、コンソールからの呼び出しと API オペレーションへのコード呼び出しを含むイベントとして、[Amazon CloudWatch のすべての API 呼び出し](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/logging_cw_api_calls.html)をキャプチャします。

## 他にどのような情報が利用できますか？

お客様は、[CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html)、[CloudWatch Events](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/WhatIsCloudWatchEvents.html)、[CloudWatch Logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html) の AWS ドキュメントを読んだり、[AWS ネイティブオブザーバビリティ](https://catalog.workshops.aws/observability/en-US/aws-native)に関する AWS Observability Workshop を受講したり、[製品ページ](https://aws.amazon.com/cloudwatch/)で[機能](https://aws.amazon.com/cloudwatch/features/)や[料金](https://aws.amazon.com/cloudwatch/pricing/)の詳細を確認したりすることで、追加情報を入手できます。お客様のユースケースシナリオを説明する [CloudWatch のチュートリアル](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-tutorials.html)も追加で用意されています。

**製品 FAQ:** [https://aws.amazon.com/cloudwatch/faqs/](https://aws.amazon.com/cloudwatch/faqs/)
