# EC2 のモニタリングとオブザーバビリティ

## はじめに

継続的なモニタリングとオブザーバビリティにより、クラウド環境の俊敏性が向上し、カスタマーエクスペリエンスが改善され、リスクが軽減されます。Wikipedia によると、[オブザーバビリティ](https://en.wikipedia.org/wiki/Observability)とは、システムの外部出力の知識からシステムの内部状態をどの程度推測できるかを示す尺度です。オブザーバビリティという用語自体は制御理論の分野に由来しており、基本的には、システム内のコンポーネントが生成している外部信号/出力を学習することで、その内部状態を推測できることを意味します。

モニタリングとオブザーバビリティの違いは、モニタリングはシステムが動作しているかどうかを示すのに対し、オブザーバビリティはシステムが動作していない理由を示すという点です。モニタリングは通常、事後対応的な手段であるのに対し、オブザーバビリティの目標は、主要業績評価指標を事前対応的な方法で改善できるようにすることです。システムは観測されない限り、制御または最適化することはできません。メトリクス、ログ、またはトレースの収集を通じてワークロードを計装し、適切なモニタリングおよびオブザーバビリティツールを使用して有意義なインサイトと詳細なコンテキストを取得することで、お客様は環境を制御および最適化できます。

![three-pillars](../images/three-pillars.png)

AWS は、お客様が監視からオブザーバビリティへと変革し、エンドツーエンドのサービス可視性を完全に実現できるよう支援します。この記事では、Amazon Elastic Compute Cloud (Amazon EC2) に焦点を当て、AWS ネイティブツールとオープンソースツールを通じて AWS Cloud 環境におけるサービスの監視とオブザーバビリティを向上させるためのベストプラクティスについて説明します。

## Amazon EC2

[Amazon Elastic Compute Cloud](https://aws.amazon.com/ec2/) (Amazon EC2) は、Amazon Web Services (AWS) Cloud における高度にスケーラブルなコンピューティングプラットフォームです。Amazon EC2 により、事前のハードウェア投資が不要になるため、お客様は使用した分だけ支払いながら、アプリケーションをより迅速に開発およびデプロイできます。EC2 が提供する主な機能には、インスタンスと呼ばれる仮想コンピューティング環境、Amazon Machine Images と呼ばれるインスタンスの事前設定済みテンプレート、インスタンスタイプとして利用可能な CPU、メモリ、ストレージ、ネットワーキング容量などのリソースのさまざまな設定があります。

## AWS ネイティブツールを使用したモニタリングとオブザーバビリティ

### Amazon CloudWatch

[Amazon CloudWatch](https://aws.amazon.com/cloudwatch/) は、AWS、ハイブリッド、およびオンプレミスのアプリケーションとインフラストラクチャリソースに対して、データと実用的なインサイトを提供する監視および管理サービスです。CloudWatch は、ログ、メトリクス、イベントの形式で監視データと運用データを収集します。また、AWS リソース、アプリケーション、および AWS とオンプレミスサーバーで実行されるサービスの統合ビューを提供します。CloudWatch は、リソース使用率、アプリケーションパフォーマンス、運用状態に関するシステム全体の可視性を得るのに役立ちます。

![CloudWatch Overview](../images/cloudwatch-intro.png)

### 統合 CloudWatch エージェント

Unified CloudWatch Agent は、MIT ライセンスの下で提供されるオープンソースソフトウェアであり、x86-64 および ARM64 アーキテクチャを利用するほとんどのオペレーティングシステムをサポートしています。CloudWatch Agent は、オペレーティングシステム全体のハイブリッド環境において Amazon EC2 インスタンスとオンプレミスサーバーからシステムレベルのメトリクスを収集し、アプリケーションやサービスからカスタムメトリクスを取得し、Amazon EC2 インスタンスとオンプレミスサーバーからログを収集するのに役立ちます。

![CloudWatch Agent](../images/cw-agent.png)

### Amazon EC2 インスタンスへの CloudWatch エージェントのインストール

#### コマンドラインインストール

CloudWatch Agent は[コマンドライン](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/installing-cloudwatch-agent-commandline.html)を通じてインストールできます。さまざまなアーキテクチャとさまざまなオペレーティングシステムに必要なパッケージは[ダウンロード](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/download-cloudwatch-agent-commandline.html)できます。CloudWatch エージェントが Amazon EC2 インスタンスから情報を読み取り、CloudWatch に書き込むための権限を提供する必要な [IAM ロール](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/create-iam-roles-for-cloudwatch-agent-commandline.html)を作成します。必要な IAM ロールが作成されたら、必要な Amazon EC2 インスタンスに CloudWatch エージェントを[インストールして実行](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-commandline-fleet.html)できます。 

:::info
    ドキュメント：[コマンドラインを使用した CloudWatch エージェントのインストール](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/installing-cloudwatch-agent-commandline.html)

AWS Observability Workshop: [CloudWatch エージェントのセットアップとインストール](https://catalog.workshops.aws/observability/en-US/aws-native/ec2-monitoring/install-ec2)
:::

#### AWS Systems Manager を使用したインストール

CloudWatch Agent は、[AWS Systems Manager](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/installing-cloudwatch-agent-ssm.html) を通じてインストールすることもできます。CloudWatch エージェントが Amazon EC2 インスタンスから情報を読み取り、CloudWatch に書き込み、AWS Systems Manager と通信するための権限を提供する必要な IAM ロールを作成します。EC2 インスタンスに CloudWatch エージェントをインストールする前に、必要な EC2 インスタンスに SSM エージェントを[インストールまたは更新](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/download-CloudWatch-Agent-on-EC2-Instance-SSM-first.html#update-SSM-Agent-EC2instance-first)します。CloudWatch エージェントは AWS Systems Manager を通じてダウンロードできます。収集するメトリクス (カスタムメトリクスを含む) やログを指定するために JSON 設定ファイルを作成できます。必要な IAM ロールが作成され、設定ファイルが作成されたら、必要な Amazon EC2 インスタンスに CloudWatch エージェントをインストールして実行できます。 

:::info
    ドキュメント：[AWS Systems Manager を使用した CloudWatch エージェントのインストール](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/installing-cloudwatch-agent-ssm.html)

AWS Observability Workshop: [AWS Systems Manager Quick Setup を使用した CloudWatch エージェントのインストール](https://catalog.workshops.aws/observability/en-US/aws-native/ec2-monitoring/install-ec2/ssm-quicksetup)

関連ブログ記事：[Amazon CloudWatch Agent with AWS Systems Manager Integration – Unified Metrics & Log Collection for Linux & Windows](https://aws.amazon.com/blogs/aws/new-amazon-cloudwatch-agent-with-aws-systems-manager-integration-unified-metrics-log-collection-for-linux-windows/)

YouTube 動画: [CloudWatch エージェントを使用して Amazon EC2 インスタンスからメトリクスとログを収集する](https://www.youtube.com/watch?v=vAnIhIwE5hY)
:::

#### ハイブリッド環境のオンプレミスサーバーへの CloudWatch Agent のインストール 

サーバーがオンプレミスとクラウドの両方に存在するハイブリッドな顧客環境では、Amazon CloudWatch で統合されたオブザーバビリティを実現するために同様のアプローチを取ることができます。CloudWatch エージェントは、Amazon S3 から直接ダウンロードするか、AWS Systems Manager を通じてダウンロードできます。オンプレミスサーバーが Amazon CloudWatch にデータを送信するための IAM ユーザーを作成します。オンプレミスサーバーにエージェントをインストールして起動します。 

:::note
    ドキュメント：[オンプレミスサーバーへの CloudWatch エージェントのインストール](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-on-premise.html)
:::

### Amazon CloudWatch を使用した Amazon EC2 インスタンスのモニタリング

Amazon EC2 インスタンスとアプリケーションの信頼性、可用性、パフォーマンスを維持するための重要な側面は、[継続的なモニタリング](https://catalog.workshops.aws/observability/en-US/aws-native/ec2-monitoring)です。必要な Amazon EC2 インスタンスに CloudWatch Agent をインストールすることで、インスタンスの健全性とパフォーマンスを監視することが、安定した環境を維持するために必要です。ベースラインとして、CPU 使用率、ネットワーク使用率、ディスクパフォーマンス、ディスク読み取り/書き込み、メモリ使用率、ディスクスワップ使用率、ディスク容量使用率、ページファイル使用率、および EC2 インスタンスのログ収集などの項目が推奨されます。

#### 基本モニタリングと詳細モニタリング

Amazon CloudWatch は、Amazon EC2 からの生データを収集して処理し、読み取り可能なほぼリアルタイムのメトリクスに変換します。デフォルトでは、Amazon EC2 はインスタンスの基本モニタリングとして、5 分間隔でメトリクスデータを CloudWatch に送信します。インスタンスのメトリクスデータを 1 分間隔で CloudWatch に送信するには、インスタンスで[詳細モニタリング](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-cloudwatch-new.html)を有効にすることができます。

#### モニタリングのための自動および手動ツール

AWS は、顧客が Amazon EC2 を監視し、問題が発生したときに報告するのに役立つ、自動化されたツールと手動のツールの 2 種類を提供しています。これらのツールの一部は少し設定が必要で、いくつかは手動による介入が必要です。
[自動化された監視ツール](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/monitoring_automated_manual.html#monitoring_automated_tools)には、AWS システムステータスチェック、インスタンスステータスチェック、Amazon CloudWatch アラーム、Amazon EventBridge、Amazon CloudWatch Logs、CloudWatch エージェント、AWS Management Pack for Microsoft System Center Operations Manager が含まれます。[手動監視](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/monitoring_automated_manual.html#monitoring_manual_tools)ツールには、この記事の下部の別のセクションで詳しく説明するダッシュボードが含まれます。

:::note
    ドキュメント: [自動モニタリングと手動モニタリング](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/monitoring_automated_manual.html)
:::
### CloudWatch Agent を使用した Amazon EC2 インスタンスからのメトリクス

メトリクスは CloudWatch の基本的な概念です。メトリクスは、CloudWatch に発行される時系列のデータポイントのセットを表します。メトリクスは監視する変数として、データポイントはその変数の時間経過に伴う値として考えることができます。たとえば、特定の EC2 インスタンスの CPU 使用率は、Amazon EC2 が提供するメトリクスの 1 つです。

![cw-metrics](../images/cw-metrics.png)

#### CloudWatch エージェントを使用したデフォルトメトリクス

Amazon CloudWatch は Amazon EC2 インスタンスからメトリクスを収集します。これらは AWS Management Console、AWS CLI、または API を通じて表示できます。利用可能なメトリクスは、基本モニタリングでは 5 分間隔、詳細モニタリング (有効にした場合) では 1 分間隔でカバーされるデータポイントです。

![default-metrics](../images/default-metrics.png)

#### CloudWatch エージェントを使用したカスタムメトリクス

お客様は、API または CLI を使用して、1 分間隔の標準解像度または 1 秒間隔までの高解像度で、独自のカスタムメトリクスを CloudWatch に発行することもできます。統合 CloudWatch エージェントは、[StatsD](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-custom-metrics-statsd.html) および [collectd](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-custom-metrics-collectd.html) を通じたカスタムメトリクスの取得をサポートしています。

アプリケーションまたはサービスからのカスタムメトリクスは、StatsD プロトコルを使用する CloudWatch エージェントで取得できます。StatsD は、さまざまなアプリケーションからメトリクスを収集できる人気のオープンソースソリューションです。StatsD は、独自のメトリクスを計測する場合に特に便利で、Linux ベースと Windows ベースの両方のサーバーをサポートしています。

アプリケーションやサービスからのカスタムメトリクスは、collectd プロトコルを使用する CloudWatch エージェントを通じて取得することもできます。collectd は、Linux サーバーでのみサポートされている人気のあるオープンソースソリューションで、さまざまなアプリケーションのシステム統計を収集できるプラグインを備えています。CloudWatch エージェントがすでに収集できるシステムメトリクスと collectd からの追加メトリクスを組み合わせることで、システムとアプリケーションの監視、分析、トラブルシューティングをより適切に行うことができます。

#### CloudWatch エージェントを使用した追加のカスタムメトリクス

CloudWatch エージェントは、EC2 インスタンスからのカスタムメトリクスの収集をサポートしています。一般的な例をいくつか示します。

- Elastic Network Adapter (ENA) を使用する Linux 上で実行されている EC2 インスタンスのネットワークパフォーマンスメトリクス。
- Linux サーバーからの Nvidia GPU メトリクス。
- Linux および Windows サーバー上の個々のプロセスからの procstat プラグインを使用したプロセスメトリクス。

### CloudWatch エージェントを使用した Amazon EC2 インスタンスからのログ

Amazon CloudWatch Logs は、既存のシステム、アプリケーション、カスタムログファイルを使用して、ほぼリアルタイムでシステムとアプリケーションの監視とトラブルシューティングを行うのに役立ちます。Amazon EC2 インスタンスとオンプレミスサーバーから CloudWatch にログを収集するには、統合 CloudWatch Agent をインストールする必要があります。最新の統合 CloudWatch Agent は、ログと高度なメトリクスの両方を収集できるため、推奨されます。また、さまざまなオペレーティングシステムもサポートしています。インスタンスが Instance Metadata Service Version 2 (IMDSv2) を使用している場合は、統合エージェントが必要です。

![cw-logs](../images/cw-logs.png)

統合 CloudWatch エージェントによって収集されたログは、処理されて Amazon CloudWatch Logs に保存されます。ログは、Windows または Linux サーバー、および Amazon EC2 とオンプレミスサーバーの両方から収集できます。CloudWatch エージェント設定ウィザードを使用して、CloudWatch エージェントのセットアップを定義する設定 JSON ファイルをセットアップできます。

![logs-view](../images/logs-view.png)

:::note
    AWS Observability Workshop: [ログ](https://catalog.workshops.aws/observability/en-US/aws-native/logs)
:::

### Amazon EC2 インスタンスイベント

イベントは、AWS 環境の変化を示します。AWS リソースとアプリケーションは、状態が変化したときにイベントを生成できます。CloudWatch Events は、AWS リソースとアプリケーションの変化を記述するシステムイベントのほぼリアルタイムのストリームを提供します。たとえば、Amazon EC2 は、EC2 インスタンスの状態が pending から running に変化したときにイベントを生成します。お客様は、カスタムアプリケーションレベルのイベントを生成し、CloudWatch Events に発行することもできます。

お客様は、ステータスチェックとスケジュールされたイベントを表示することで、[Amazon EC2 インスタンスのステータスを監視](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/monitoring-instances-status-check.html)できます。ステータスチェックは、Amazon EC2 によって実行される自動チェックの結果を提供します。これらの自動チェックは、特定の問題がインスタンスに影響を与えているかどうかを検出します。ステータスチェック情報は、Amazon CloudWatch によって提供されるデータと組み合わせることで、各インスタンスの詳細な運用可視性を提供します。

#### Amazon EC2 インスタンスイベント用の Amazon EventBridge ルール

Amazon CloudWatch Events は Amazon EventBridge を使用してシステムイベントを自動化し、リソースの変更や問題などのアクションに自動的に応答できます。Amazon EC2 を含む AWS サービスからのイベントは、ほぼリアルタイムで CloudWatch Events に配信され、お客様はイベントがルールに一致したときに適切なアクションを実行する EventBridge ルールを作成できます。
アクションには、AWS Lambda 関数の呼び出し、Amazon EC2 Run Command の呼び出し、Amazon Kinesis Data Streams へのイベントのリレー、AWS Step Functions ステートマシンのアクティブ化、Amazon SNS トピックへの通知、Amazon SQS キューへの通知、内部または外部のインシデント対応アプリケーションまたは SIEM ツールへのパイプなどがあります。

:::note
    AWS Observability Workshop: [インシデント対応 - EventBridge ルール](https://catalog.workshops.aws/observability/en-US/aws-native/ec2-monitoring/incident-response/create-eventbridge-rule)
:::

#### Amazon EC2 インスタンスの Amazon CloudWatch アラーム

Amazon [CloudWatch アラーム](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html)は、指定した期間にわたってメトリクスを監視し、複数の期間にわたって指定されたしきい値に対するメトリクスの値に基づいて 1 つ以上のアクションを実行できます。アラームは、状態が変化したときにのみアクションを呼び出します。アクションは、Amazon Simple Notification Service (Amazon SNS) トピックまたは Amazon EC2 Auto Scaling に送信される通知、あるいは [EC2 インスタンスの停止、終了、再起動、または復旧](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/UsingAlarmActions.html)などの他の適切なアクションを実行できます。

![CloudWatch Alarm](../images/cw-alarm.png)

アラームがトリガーされると、アクションとして SNS トピックにメール通知が送信されます。

![sns-alert](../images/sns-alert.png)

#### Auto Scaling インスタンスのモニタリング

Amazon EC2 Auto Scaling は、アプリケーションの負荷を処理するために、適切な数の Amazon EC2 インスタンスが利用可能であることを保証します。[Amazon EC2 Auto Scaling メトリクス](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-cloudwatch-monitoring.html)は Auto Scaling グループに関する情報を収集し、AWS/AutoScaling 名前空間に含まれます。Auto Scaling インスタンスからの CPU やその他の使用状況データを表す Amazon EC2 インスタンスメトリクスは、AWS/EC2 名前空間に含まれます。 

### CloudWatch でのダッシュボード作成

AWS アカウント内のリソースのインベントリ詳細、リソースのパフォーマンス、およびヘルスチェックを把握することは、安定したリソース管理にとって重要です。[Amazon CloudWatch ダッシュボード](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Dashboards.html)は、CloudWatch コンソールのカスタマイズ可能なホームページで、異なるリージョンに分散しているリソースであっても、単一のビューでリソースを監視するために使用できます。利用可能な Amazon EC2 インスタンスの詳細な表示と詳細を取得する方法があります

#### CloudWatch の自動ダッシュボード

Automatic Dashboards は、CloudWatch 配下の Amazon EC2 インスタンスを含むすべての AWS リソースの健全性とパフォーマンスの集約されたビューを提供する、すべての AWS パブリックリージョンで利用可能です。これにより、お客様は監視を迅速に開始し、メトリクスとアラームのリソースベースのビューを利用し、パフォーマンス問題の根本原因を簡単に掘り下げて理解できます。Automatic Dashboards は、AWS サービスが推奨する[ベストプラクティス](https://docs.aws.amazon.com/prescriptive-guidance/latest/implementing-logging-monitoring-cloudwatch/cloudwatch-dashboards-visualizations.html)で事前構築されており、リソースを認識し、重要なパフォーマンスメトリクスの最新状態を反映するように動的に更新されます。

![ec2 dashboard](../images/ec2-auto-dashboard.png)

#### CloudWatch のカスタムダッシュボード

[カスタムダッシュボード](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/create_dashboard.html)を使用すると、お客様はさまざまなウィジェットを含む追加のダッシュボードを必要な数だけ作成し、それに応じてカスタマイズできます。ダッシュボードは、クロスリージョンおよびクロスアカウントビュー用に設定でき、お気に入りリストに追加できます。

![ec2 custom dashboard](../images/ec2-custom-dashboard.png)

#### CloudWatch のリソースヘルスダッシュボード

CloudWatch ServiceLens の Resource Health は、お客様が[Amazon EC2 ホストの健全性とパフォーマンス](https://aws.amazon.com/blogs/mt/introducing-cloudwatch-resource-health-monitor-ec2-hosts/)をアプリケーション全体で自動的に検出、管理、可視化するために使用できるフルマネージドソリューションです。お客様は、CPU やメモリなどのパフォーマンスディメンションごとにホストの健全性を可視化し、インスタンスタイプ、インスタンスの状態、セキュリティグループなどのフィルターを使用して、単一のビューで数百のホストを詳細に分析できます。EC2 ホストのグループを並べて比較でき、個々のホストに関する詳細なインサイトを提供します。

![ec2 resource health](../images/ec2-resource-health.png)

## オープンソースツールを使用した監視とオブザーバビリティ

### AWS Distro for OpenTelemetry を使用した Amazon EC2 インスタンスのモニタリング

[AWS Distro for OpenTelemetry (ADOT)](https://aws.amazon.com/otel) は、OpenTelemetry プロジェクトの安全で本番環境対応の AWS サポート付きディストリビューションです。Cloud Native Computing Foundation の一部である OpenTelemetry は、アプリケーション監視のための分散トレースとメトリクスを収集するオープンソースの API、ライブラリ、エージェントを提供します。AWS Distro for OpenTelemetry を使用すると、お客様はアプリケーションを一度計装するだけで、相関するメトリクスとトレースを複数の AWS およびパートナーの監視ソリューションに送信できます。

![AWS Distro for Open Telemetry Overview](../images/adot.png)

AWS Distro for OpenTelemetry (ADOT) は、アプリケーションのパフォーマンスと健全性を監視するためのデータを簡単に関連付けることができる分散監視フレームワークを提供します。これは、サービスの可視性向上と保守において重要です。

ADOT の主要コンポーネントは、SDK、自動計装エージェント、コレクター、およびバックエンドサービスにデータを送信するエクスポーターです。

[OpenTelemetry SDK](https://github.com/aws-observability): AWS リソース固有のメタデータの収集を有効にするため、X-Ray トレース形式とコンテキストに対する OpenTelemetry SDK のサポートを提供します。OpenTelemetry SDK は、AWS X-Ray と CloudWatch から取り込まれたトレースとメトリクスデータを関連付けます。

[自動計装エージェント](https://aws-otel.github.io/docs/getting-started/java-sdk/auto-instr): OpenTelemetry Java 自動計装エージェントに、AWS SDK と AWS X-Ray トレースデータのサポートが追加されました。

[OpenTelemetry Collector](https://github.com/open-telemetry/opentelemetry-collector): ディストリビューションに含まれるコレクターは、アップストリームの OpenTelemetry コレクターを使用して構築されています。AWS X-Ray、Amazon CloudWatch、Amazon Managed Service for Prometheus を含む AWS サービスにデータを送信するために、AWS 固有のエクスポーターがアップストリームコレクターに追加されています。 

![adot architecture](../images/adot-arch.png)

#### ADOT Collector と Amazon CloudWatch を使用したメトリクスとトレース

AWS Distro for OpenTelemetry (ADOT) Collector は CloudWatch エージェントと共に Amazon EC2 インスタンスにサイドバイサイドでインストールでき、OpenTelemetry SDK を使用して Amazon EC2 インスタンス上で実行されているワークロードからアプリケーショントレースとメトリクスを収集できます。

Amazon CloudWatch で OpenTelemetry メトリクスをサポートするために、[AWS EMF Exporter for OpenTelemetry Collector](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/awsemfexporter) は OpenTelemetry 形式のメトリクスを CloudWatch Embedded Metric Format(EMF) に変換します。これにより、OpenTelemetry メトリクスに統合されたアプリケーションが高カーディナリティのアプリケーションメトリクスを CloudWatch に送信できるようになります。[X-Ray エクスポーター](https://aws-otel.github.io/docs/getting-started/x-ray#configuring-the-aws-x-ray-exporter)を使用すると、OTLP 形式で収集されたトレースを [AWS X-ray](https://aws.amazon.com/xray/) にエクスポートできます。

![adot emf architecture](../images/adot-emf.png)

Amazon EC2 上の ADOT Collector は、AWS CloudFormation を使用するか、[AWS Systems Manager Distributor](https://catalog.workshops.aws/observability/en-US/aws-managed-oss/ec2-monitoring/configure-adot-collector) を使用してインストールし、アプリケーションメトリクスを収集できます。

### Prometheus を使用した Amazon EC2 インスタンスのモニタリング

[Prometheus](https://prometheus.io/) は、システムの監視とアラートのためのスタンドアロンのオープンソースプロジェクトであり、独立して保守されています。Prometheus はメトリクスを時系列データとして収集および保存します。つまり、メトリクス情報は、記録されたタイムスタンプとともに、ラベルと呼ばれるオプションのキーと値のペアと一緒に保存されます。

![Prometheus Architecture](../images/Prometheus.png)

Prometheus はコマンドラインフラグを介して設定され、すべての設定の詳細は prometheus.yaml ファイルで管理されます。設定ファイル内の 'scrape_config' セクションでは、ターゲットとそれらをスクレイピングする方法を指定するパラメータを指定します。[Prometheus Service Discovery](https://github.com/prometheus/prometheus/tree/main/discovery) (SD) は、メトリクスをスクレイピングするエンドポイントを見つける方法論です。Amazon EC2 サービスディスカバリ設定により、AWS EC2 インスタンスからスクレイピングターゲットを取得できます。これらは次の場所で設定されます `ec2_sd_config`.


#### Prometheus と Amazon CloudWatch によるメトリクス

EC2 インスタンス上の CloudWatch エージェントは、Prometheus と共にインストールおよび設定することで、CloudWatch での監視用にメトリクスをスクレイピングできます。これは、EC2 上のコンテナワークロードを好み、オープンソースの Prometheus 監視と互換性のあるカスタムメトリクスを必要とするお客様に役立ちます。CloudWatch エージェントのインストールは、前のセクションで説明した手順に従って実行できます。Prometheus 監視を使用する CloudWatch エージェントは、Prometheus メトリクスをスクレイピングするために 2 つの設定が必要です。1 つは、Prometheus ドキュメントの「scrape_config」に記載されている標準的な Prometheus 設定です。もう 1 つは、[CloudWatch エージェント設定](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-PrometheusEC2.html#CloudWatch-Agent-PrometheusEC2-configure)です。

#### Prometheus と ADOT Collector を使用したメトリクス

お客様は、オブザーバビリティのニーズに対して、すべてオープンソースのセットアップを選択できます。その場合、AWS Distro for OpenTelemetry (ADOT) Collector を設定して、Prometheus でインストルメント化されたアプリケーションからスクレイピングし、メトリクスを Prometheus Server に送信できます。このフローには 3 つの OpenTelemetry コンポーネントが関与しており、それらは Prometheus Receiver、Prometheus Remote Write Exporter、および Sigv4 Authentication Extension です。Prometheus Receiver は Prometheus 形式のメトリクスデータを受信します。Prometheus Exporter は Prometheus 形式でデータをエクスポートします。Sigv4 Authenticator 拡張機能は、AWS サービスへのリクエストを行うための Sigv4 認証を提供します。

![adot prometheus architecture](../images/adot-prom-arch.png)

#### Prometheus Node Exporter

[Prometheus Node Exporter](https://github.com/prometheus/node_exporter) は、クラウド環境向けのオープンソースの時系列監視およびアラートシステムです。Amazon EC2 インスタンスに Node Exporter を実装して、ノードレベルのメトリクスをタイムスタンプ付きの時系列データとして収集および保存できます。Node exporter は Prometheus exporter であり、URL http://localhost:9100/metrics を介してさまざまなホストメトリクスを公開できます。

![prometheus metrics screenshot](../images/prom-metrics.png)

 メトリクスが作成されると、[Amazon Managed Prometheus](https://aws.amazon.com/prometheus/) に送信できます。

![amp overview](../images/amp-overview.png)

### Fluent Bit プラグインを使用した Amazon EC2 インスタンスからのログのストリーミング

[Fluent Bit](https://fluentbit.io/) は、大規模なデータ収集を処理するためのオープンソースでマルチプラットフォームのログプロセッサツールです。さまざまな情報源、多様なデータ形式、データの信頼性、セキュリティ、柔軟なルーティング、複数の宛先を扱う多様なデータの収集と集約を行います。

![fluent architecture](../images/fluent-arch.png)

Fluent Bit は、Amazon EC2 から Amazon CloudWatch を含む AWS サービスへログをストリーミングするための簡単な拡張ポイントを作成し、ログの保持と分析を可能にします。新しくリリースされた [Fluent Bit プラグイン](https://github.com/aws/amazon-cloudwatch-logs-for-fluent-bit#new-higher-performance-core-fluent-bit-plugin)は、ログを Amazon CloudWatch にルーティングできます。

### Amazon Managed Grafana によるダッシュボード作成

[Amazon Managed Grafana](https://aws.amazon.com/grafana/) は、オープンソースの Grafana プロジェクトをベースにしたフルマネージドサービスで、豊富でインタラクティブかつセキュアなデータ可視化機能を提供し、複数のデータソースにわたるメトリクス、ログ、トレースを即座にクエリ、関連付け、分析、モニタリング、アラーム設定できます。お客様はインタラクティブなダッシュボードを作成し、自動的にスケールされ、高可用性でエンタープライズセキュアなサービスを通じて、組織内の誰とでも共有できます。Amazon Managed Grafana を使用することで、お客様は AWS アカウント、AWS リージョン、データソース全体でダッシュボードへのユーザーおよびチームアクセスを管理できます。

![grafana overview](../images/grafana-overview.png)

Amazon Managed Grafana は、Grafana ワークスペースコンソールの AWS データソース設定オプションを使用して、Amazon CloudWatch をデータソースとして追加できます。この機能により、既存の CloudWatch アカウントを検出し、CloudWatch へのアクセスに必要な認証情報の設定を管理することで、CloudWatch をデータソースとして追加する作業が簡素化されます。Amazon Managed Grafana は、[Prometheus データソース](https://docs.aws.amazon.com/grafana/latest/userguide/prometheus-data-source.html)もサポートしています。つまり、自己管理型 Prometheus サーバーと Amazon Managed Service for Prometheus ワークスペースの両方をデータソースとして使用できます。

Amazon Managed Grafana には、さまざまなパネルが付属しており、適切なクエリを簡単に構築し、表示プロパティをカスタマイズできるため、お客様は必要なダッシュボードを作成できます。

![grafana dashboard](../images/grafana-dashboard.png)

## まとめ

モニタリングは、システムが正常に動作しているかどうかを把握するために役立ちます。オブザーバビリティは、システムが正常に動作していない理由を理解するために役立ちます。優れたオブザーバビリティにより、認識する必要があることを知らなかった質問に答えることができます。モニタリングとオブザーバビリティは、システムの内部状態を測定する道を開き、その出力から推測できるようにします。

クラウド上でマイクロサービス、サーバーレス、非同期アーキテクチャで実行される最新のアプリケーションは、メトリクス、ログ、トレース、イベントの形式で大量のデータを生成します。Amazon CloudWatch は、Amazon Distro for OpenTelemetry、Amazon Managed Prometheus、Amazon Managed Grafana などのオープンソースツールと連携して、お客様が統合プラットフォーム上でこれらのデータを収集、アクセス、関連付けできるようにします。お客様がデータサイロを解消し、システム全体の可視性を簡単に獲得し、問題を迅速に解決できるよう支援します。 















