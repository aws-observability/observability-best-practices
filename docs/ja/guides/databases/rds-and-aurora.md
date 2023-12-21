# Amazon RDS と Aurora データベースのモニタリング

モニタリングは、Amazon RDS および Aurora データベースクラスターの信頼性、可用性、パフォーマンスを維持するうえで重要な部分です。AWS は、Amazon RDS および Aurora データベースリソースの正常性を監視し、重大な問題になる前に問題を検出し、一貫したユーザーエクスペリエンスのためにパフォーマンスを最適化するいくつかのツールを提供しています。このガイドでは、データベースがスムーズに実行されていることを確認するためのオブザーバビリティのベストプラクティスを提供します。

## パフォーマンスガイドライン

ベストプラクティスとして、ワークロードのベースライン パフォーマンスを確立することから始めることをおすすめします。DB インスタンスをセットアップして一般的なワークロードで実行したときに、すべてのパフォーマンス メトリクスの平均値、最大値、最小値をキャプチャします。いくつかの異なるインターバル(例: 1時間、24時間、1週間、2週間など)でこれを行ってください。これにより、何が正常なのかについての考え方が得られます。運用のピーク時間帯とオフピーク時間帯の両方の比較を取得することが役立ちます。次に、この情報を使用して、パフォーマンスが標準レベルを下回っているときを特定できます。

## モニタリングオプション

### Amazon CloudWatch メトリクス

[Amazon CloudWatch](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/monitoring-cloudwatch.html) は、[RDS](https://aws.amazon.com/rds/) および [Aurora](https://aws.amazon.com/rds/aurora/) データベースの監視と管理に不可欠なツールです。データベースのパフォーマンスに関する貴重な洞察を提供し、問題をすばやく特定および解決するのに役立ちます。Amazon RDS および Aurora データベースの両方が、アクティブな各データベースインスタンスについて 1 分間隔の粒度でメトリクスを CloudWatch に送信します。監視はデフォルトで有効になっており、メトリクスは 15 日間利用できます。RDS および Aurora は、**AWS/RDS** 名前空間でインスタンスレベルのメトリクスを Amazon CloudWatch に公開します。

CloudWatch メトリクスを使用することで、データベースのパフォーマンスの傾向やパターンを特定し、この情報を使用して構成を最適化し、アプリケーションのパフォーマンスを向上させることができます。ここでは、監視する主要なメトリクスを示します。

* **CPU 利用率** - 使用されているコンピュータ処理容量の割合。
* **DB 接続** - DB インスタンスに接続されているクライアントセッションの数。インスタンスのパフォーマンスと応答時間の低下と合わせて、大量のユーザー接続を確認した場合は、データベース接続を制限することを検討してください。DB インスタンスの最適なユーザー接続数は、インスタンスクラスと実行される操作の複雑さによって異なります。データベース接続数を判断するには、DB インスタンスをパラメータグループと関連付けます。
* **使用可能メモリ** - DB インスタンスで利用できる RAM の量(メガバイト単位)。[監視] タブのメトリクスにおける赤線は、CPU、メモリ、ストレージメトリクスについて 75% でマークされています。インスタンスメモリ消費が頻繁にその線を超える場合は、ワークロードを確認するかインスタンスをアップグレードする必要があることを示しています。 
* **ネットワークスループット** - DB インスタンスへの流入および流出ネットワークトラフィックの速度(秒あたりのバイト数)。
* **読み取り/書き込みレイテンシ** - 読み取りまたは書き込み操作の平均時間(ミリ秒)。
* **読み取り/書き込み IOPS** - 1 秒あたりの平均ディスク読み取りまたは書き込み操作回数。  
* **空きストレージ領域** - 現在 DB インスタンスで使用されていないディスク領域の量(メガバイト)。使用済み領域が全ディスク領域の 85% 以上に一貫して達している場合は、ディスク領域の消費を調査してください。インスタンスからデータを削除したり、データをアーカイブしてシステムの領域を解放できるかどうかを確認してください。

![db_cw_metrics.png](../../images/db_cw_metrics.png)

パフォーマンス関連の問題をトラブルシューティングする第一歩は、最も使用頻度が高く費用のかかるクエリをチューニングすることです。チューニングによってシステムリソースへのプレッシャーが下がるかどうかを確認してください。詳細については、[クエリのチューニング](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_BestPractices.html#CHAP_BestPractices.TuningQueries) を参照してください。

クエリがチューニングされていても問題が続く場合は、データベースインスタンスクラスのアップグレードを検討してください。リソース(CPU、RAM、ディスク領域、ネットワーク帯域幅、I/O 容量)が多いインスタンスにアップグレードできます。

その後、これらのメトリクスが重要なしきい値に達したときにアラートが発生するようにアラームを設定し、問題をできるだけ早く解決するためのアクションを実行できます。

CloudWatch メトリクスの詳細については、[Amazon RDS 用の Amazon CloudWatch メトリクス](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/rds-metrics.html) および [CloudWatch コンソールと AWS CLI での DB インスタンスメトリクスの表示](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/metrics_dimensions.html) を参照してください。

#### CloudWatch Logs Insights

[CloudWatch Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html) を使用すると、Amazon CloudWatch Logs のログデータを対話形式で検索および分析できます。操作上の問題により効率的かつ効果的に対応するためのクエリを実行できます。問題が発生した場合は、CloudWatch Logs Insights を使用して潜在的な原因を特定し、導入された修正を検証できます。

RDS または Aurora データベースクラスターから CloudWatch にログをパブリッシュするには、[RDS または Aurora for MySQL インスタンスのログを CloudWatch にパブリッシュ](https://repost.aws/knowledge-center/rds-aurora-mysql-logs-cloudwatch) を参照してください。

CloudWatch を使用した RDS または Aurora ログの監視の詳細については、[Amazon RDS ログファイルの監視](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_LogAccess.html) を参照してください。

#### CloudWatch アラーム

データベースクラスターのパフォーマンスが低下した場合を特定するために、主要なパフォーマンスメトリクスを定期的に監視およびアラートする必要があります。[Amazon CloudWatch アラーム](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html) を使用すると、指定した期間にわたって単一のメトリクスを監視できます。メトリクスが指定したしきい値を超えると、Amazon SNS トピックまたは AWS オートスケーリングポリシーに通知が送信されます。CloudWatch アラームは、特定の状態にあるため単にアクションを起動するわけではありません。むしろ、状態が変更され、アラームをトリガーするために指定された期間中に維持されている必要があります。アラームは、アラームの状態変化が発生したときにのみアクションを起動します。アラーム状態であること自体では不十分です。

CloudWatch アラームの設定方法は以下のとおりです。

* AWS Management Console に移動し、[https://console.aws.amazon.com/rds/]() で Amazon RDS コンソールを開きます。
* ナビゲーションペインで [Databases] を選択し、DB インスタンスを選択します。
* [Logs & events] を選択します。

[CloudWatch alarms] セクションで、[Create alarm] を選択します。

![db_cw_alarm.png](../../images/db_cw_alarm.png)

* [Send notifications] で [Yes] を選択し、[Send notifications to] で [New email or SMS topic] を選択します。
* [Topic name] に通知の名前を入力し、[With these recipients] にカンマ区切りのメールアドレスと電話番号のリストを入力します。  
* [Metric] でアラームの統計とメトリクスを選択します。
* [Threshold] で、メトリクスがしきい値より大きいか小さいか等しいかを指定し、しきい値を指定します。
* [Evaluation period] で、アラームの評価期間を選択します。[consecutive period(s) of] で、アラームをトリガーするためにしきい値に達していなければならない期間を選択します。
* [Name of alarm] にアラームの名前を入力します。
* [Create Alarm] を選択します。  

アラームが [CloudWatch alarms] セクションに表示されます。  

Multi-AZ DB クラスターレプリカの遅延の Amazon CloudWatch アラームの作成例は[こちら](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/multi-az-db-cluster-cloudwatch-alarm.html)をご覧ください。

#### データベース監査ログ

データベース監査ログは、RDS および Aurora データベースで実行されたすべてのアクションの詳細な記録を提供します。これにより、不正アクセス、データ変更、その他の有害なアクティビティを監視できます。データベース監査ログのベストプラクティスを以下に示します。

* すべての RDS および Aurora インスタンスでデータベース監査ログを有効にし、関連するすべてのデータをキャプチャするよう設定してください。
* Amazon CloudWatch Logs や Amazon Kinesis Data Streams などの集中ログ管理ソリューションを使用して、データベース監査ログを収集および分析してください。 
* データベース監査ログを定期的に監視し、疑わしいアクティビティがあれば迅速に調査および解決してください。

データベース監査ログの設定方法の詳細は、[Configuring an Audit Log to Capture database activities for Amazon RDS and Aurora](https://aws.amazon.com/blogs/database/configuring-an-audit-log-to-capture-database-activities-for-amazon-rds-for-mysql-and-amazon-aurora-with-mysql-compatibility/) を参照してください。

#### データベースの遅いクエリとエラーログ

遅いクエリのログは、データベース内のパフォーマンスの低いクエリを見つけるのに役立ちます。これにより、遅さの原因を調査し、必要に応じてクエリをチューニングできます。エラーログは、クエリのエラーを見つけるのに役立ち、これによりそれらのエラーによるアプリケーションの変更を見つけることができます。

CloudWatch Logs Insights (Amazon CloudWatch Logs で対話的にログデータを検索および分析できる) を使用して CloudWatch ダッシュボードを作成することにより、遅いクエリログとエラーログを監視できます。

Amazon RDS のエラーログ、遅いクエリログ、一般ログを有効にして監視するには、[RDS MySQL 用の遅いクエリログと一般ログの管理](https://repost.aws/knowledge-center/rds-mysql-logs) を参照してください。Aurora PostgreSQL 用の遅いクエリログを有効にするには、[PostgreSQL 用の遅いクエリログの有効化](https://catalog.us-east-1.prod.workshops.aws/workshops/31babd91-aa9a-4415-8ebf-ce0a6556a216/en-US/postgresql-logs/enable-slow-query-log) を参照してください。

## パフォーマンスインサイトとオペレーティングシステムメトリクス

#### 強化モニタリング

[強化モニタリング](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/USER_Monitoring.OS.html) を使用すると、DB インスタンスが実行されているオペレーティングシステム (OS) の細かい粒度のメトリクスをリアルタイムで取得できます。

RDS は強化モニタリングからのメトリクスを Amazon CloudWatch Logs アカウントに配信します。 デフォルトでは、これらのメトリクスは 30 日間保存され、Amazon CloudWatch の **RDSOSMetrics** ロググループに保存されます。 1 秒から 60 秒の間で粒度を選択できます。 CloudWatch Logs から CloudWatch でカスタムメトリクスフィルターを作成し、グラフを CloudWatch ダッシュボードに表示できます。

![db_enhanced_monitoring_loggroup.png](../../images/db_enhanced_monitoring_loggroup.png)

強化モニタリングには、OS レベルのプロセスリストも含まれます。 現在、強化モニタリングは次のデータベースエンジンで利用できます:

* MariaDB
* Microsoft SQL Server  
* MySQL
* Oracle
* PostgreSQL

**CloudWatch と強化モニタリングの違い**

CloudWatch は、DB インスタンスのハイパーバイザから CPU 使用率に関するメトリクスを収集します。対照的に、強化モニタリングは、DB インスタンス上のエージェントからメトリクスを収集します。 ハイパーバイザは仮想マシン (VM) を作成および実行します。 ハイパーバイザを使用すると、インスタンスはメモリと CPU を仮想的に共有することで、複数のゲスト VM をサポートできます。 ハイパーバイザ層は少量の作業を実行するため、CloudWatch と強化モニタリングの測定値が異なる場合があります。 インスタンスが小さいインスタンスクラスを使用している場合、差は大きくなる可能性があります。 このシナリオでは、複数の仮想マシン (VM) が物理インスタンス上のハイパーバイザ層によって管理されている可能性が高くなります。

強化モニタリングで利用できるすべてのメトリクスの詳細については、[強化モニタリングの OS メトリクス](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/USER_Monitoring-Available-OS-Metrics.html) を参照してください。


![db-enhanced-monitoring.png](../../images/db_enhanced_monitoring.png)

#### パフォーマンスインサイト

[Amazon RDS Performance Insights](https://aws.amazon.com/rds/performance-insights/) は、データベースの負荷をすばやく評価し、アクションを取る必要があるタイミングと場所を判断するのに役立つデータベースパフォーマンスチューニングおよびモニタリング機能です。Performance Insights ダッシュボードを使用すると、db クラスターのデータベース負荷を視覚化し、待ち時間、SQL ステートメント、ホスト、ユーザー別に負荷をフィルタリングできます。これにより、症状を追跡するのではなく、根本原因にスポットライトを当てることができます。Performance Insights は、アプリケーションのパフォーマンスに影響を与えない軽量のデータ収集方法を使用し、どの SQL ステートメントが負荷の原因であるかと、なぜそうなっているかを簡単に確認できるようにします。

Performance Insights は 7 日間の無料のパフォーマンス履歴保持を提供し、料金を支払うことで最大 2 年間まで延長できます。Performance Insights は RDS 管理コンソールまたは AWS CLI から有効にできます。Performance Insights は、カスタマーやサードパーティが Performance Insights を独自のカスタムツールと統合できるように、パブリックに利用可能な API も公開しています。  

!!! 注意
	現在、RDS Performance Insights は Aurora (PostgreSQL および MySQL 互換エディション)、Amazon RDS for PostgreSQL、MySQL、MariaDB、SQL Server、Oracle 用のみ利用できます。

**DBLoad** は、平均アクティブセッション数を表す主要メトリックです。Performance Insights では、このデータが **db.load.avg** メトリックとしてクエリされます。

![db_perf_insights.png](../../images/db_perf_insights.png)

Aurora での Performance Insights の使用方法の詳細については、以下を参照してください。 [Monitoring DB load with Performance Insights on Amazon Aurora](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/USER_PerfInsights.html)。

## オープンソースのオブザーバビリティツール

#### Amazon Managed Grafana

[Amazon Managed Grafana](https://aws.amazon.com/grafana/) は、Amazon RDS や Aurora データベースからのデータを可視化および分析するのに役立つ、完全マネージドなサービスです。

Amazon CloudWatch の **AWS/RDS ネームスペース** には、Amazon RDS と Amazon Aurora で実行されているデータベースエンティティに適用される主要なメトリクスが含まれています。 Amazon Managed Grafana で RDS/Aurora データベースの正常性と潜在的なパフォーマンスの問題を追跡および確認するには、CloudWatch データソースを利用できます。

![amg-rds-aurora.png](../../images/amg-rds-aurora.png)

現時点では、CloudWatch で利用できるのは基本的な Performance Insights メトリクスのみであり、データベースのパフォーマンスを分析し、データベース内のボトルネックを特定するには不十分です。 Amazon Managed Grafana で RDS Performance Insight メトリクスを可視化し、シングルパネでの可視性を実現するには、カスタム Lambda 関数を使用してすべての RDS Performance Insights メトリクスを収集し、カスタム CloudWatch メトリクスネームスペースに公開できます。 これらのメトリクスが Amazon CloudWatch で利用できるようになったら、Amazon Managed Grafana で可視化できます。

RDS Performance Insights メトリクスを収集するカスタム Lambda 関数をデプロイするには、次の GitHub リポジトリをクローンし、install.sh スクリプトを実行します。

```
$ git clone https://github.com/aws-observability/observability-best-practices.git
$ cd sandbox/monitor-aurora-with-grafana

$ chmod +x install.sh
$ ./install.sh
```

上記のスクリプトは、AWS CloudFormation を使用してカスタム Lambda 関数と IAM ロールをデプロイします。Lambda 関数は自動的に 10 分ごとにトリガーされ、RDS Performance Insights API を呼び出してカスタムメトリクスを /AuroraMonitoringGrafana/PerformanceInsights という名前の Amazon CloudWatch のカスタムネームスペースに公開します。

![db_performanceinsights_amg.png](../../images/db_performanceinsights_amg.png)

カスタム Lambda 関数のデプロイと Grafana ダッシュボードの詳細な手順については、[Amazon Managed Grafana での Performance Insights](https://aws.amazon.com/blogs/mt/monitoring-amazon-rds-and-amazon-aurora-using-amazon-managed-grafana/) を参照してください。

データベースの意図しない変更をすばやく特定し、アラートを使用して通知することで、中断を最小限に抑えるためのアクションを実行できます。Amazon Managed Grafana は、SNS、Slack、PagerDuty など、アラート通知を送信できる複数の通知チャネルをサポートしています。 [Grafana アラート](https://docs.aws.amazon.com/grafana/latest/userguide/alerts-overview.html) では、Amazon Managed Grafana でのアラートの設定方法の詳細を確認できます。

<!-- blank line -->
<figure class="video_container">
<iframe allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="" frameborder="0" height="315" src="https://www.youtube.com/embed/Uj9UJ1mXwEA" title="YouTube video player" width="560"></iframe>
</figure>
<!-- blank line -->

## AIOps - マシンラーニングベースのパフォーマンスボトルネック検出

#### Amazon DevOps Guru for RDS

[Amazon DevOps Guru for RDS](https://aws.amazon.com/devops-guru/features/devops-guru-for-rds/) を使用すると、パフォーマンスのボトルネックや運用上の問題のためにデータベースを監視できます。Performance Insights メトリクスを使用し、機械学習(ML)で分析して、パフォーマンスの問題に関するデータベース固有の分析を提供し、修正アクションを推奨します。DevOps Guru for RDS は、ホストリソースの過剰利用、データベースのボトルネック、SQL クエリの誤動作など、さまざまなパフォーマンス関連のデータベースの問題を特定および分析できます。問題または異常な動作が検出されると、DevOps Guru for RDS は調査結果を DevOps Guru コンソールに表示し、[Amazon EventBridge](https://aws.amazon.com/jp/eventbridge/) または [Amazon Simple Notification Service(SNS)](https://aws.amazon.com/jp/sns/) を使用して通知を送信するため、DevOps または SRE チームは、顧客に影響を及ぼす障害になる前に、パフォーマンスと運用上の問題に対してリアルタイムでアクションを実行できます。

DevOps Guru for RDS は、データベース メトリクスのベースラインを確立します。ベースライニングとは、一定期間データベース パフォーマンス メトリクスを分析して、通常の動作を確立することを意味します。Amazon DevOps Guru for RDS は、確立されたベースラインに対する異常を検出するために機械学習を使用します。ワークロード パターンが変更された場合、DevOps Guru for RDS は、新しい通常値に対して異常を検出するために使用される新しいベースラインを確立します。

!!! 注意
	新しいデータベース インスタンスの場合、Amazon DevOps Guru for RDS は、データベースの使用パターンの分析と通常の動作と見なされるものの確立が必要なため、最初のベースラインを確立するまでに最大 2 日かかります。


![db_dgr_anomaly.png.png](../../images/db_dgr_anomaly.png)

![db_dgr_recommendation.png](../../images/db_dgr_recommendation.png)

開始方法の詳細については、[ML を使用した Amazon Aurora 関連の問題の検出、診断、解決のための新しい Amazon DevOps Guru for RDS](https://aws.amazon.com/jp/blogs/news/new-amazon-devops-guru-for-rds-to-detect-diagnose-and-resolve-amazon-aurora-related-issues-using-ml/) をご覧ください。

<!-- blank line -->
<figure class="video_container">
<iframe allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="" frameborder="0" height="315" src="https://www.youtube.com/embed/N3NNYgzYUDA" title="YouTube video player" width="560"></iframe>
</figure>
<!-- blank line -->

## 監査とガバナンス

#### AWS CloudTrail ログ

[AWS CloudTrail](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html) は、RDS でユーザー、ロール、AWS サービスによって実行されたアクションの記録を提供します。CloudTrail はコンソールからの呼び出しや RDS API オペレーションへのコード呼び出しを含む、RDS のすべての API 呼び出しをイベントとしてキャプチャします。CloudTrail で収集した情報を使用することで、RDS へのリクエストの内容、リクエストの発信元 IP アドレス、リクエストを行った人、リクエストの日時、その他の詳細を確認できます。 詳細については、[Monitoring Amazon RDS API calls in AWS CloudTrail](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/logging-using-cloudtrail.html) を参照してください。

詳細は、[Monitoring Amazon RDS API calls in AWS CloudTrail](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/logging-using-cloudtrail.html) を参照してください。

## 詳細情報の参照

[ブログ - Amazon Managed Grafana を使用した RDS と Aurora データベースの監視](https://aws.amazon.com/blogs/mt/monitoring-amazon-rds-and-amazon-aurora-using-amazon-managed-grafana/)

[動画 - Amazon Managed Grafana を使用した RDS と Aurora データベースの監視](https://www.youtube.com/watch?v=Uj9UJ1mXwEA)

[ブログ - Amazon CloudWatch を使用した RDS と Aurora データベースの監視](https://aws.amazon.com/blogs/database/creating-an-amazon-cloudwatch-dashboard-to-monitor-amazon-rds-and-amazon-aurora-mysql/)

[ブログ - Amazon CloudWatch Logs、AWS Lambda、Amazon SNS を使用した Amazon RDS のプロアクティブなデータベース監視の構築](https://aws.amazon.com/blogs/database/build-proactive-database-monitoring-for-amazon-rds-with-amazon-cloudwatch-logs-aws-lambda-and-amazon-sns/)

[公式ドキュメント - Amazon Aurora の監視ガイド](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/MonitoringOverview.html)

[ハンズオンワークショップ - Amazon Aurora の SQL パフォーマンスの問題の観察と特定](https://awsauroralabsmy.com/provisioned/perf-observability/)
