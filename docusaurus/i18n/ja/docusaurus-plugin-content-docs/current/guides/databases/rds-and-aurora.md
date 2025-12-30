# Amazon RDS および Aurora データベースのモニタリング

モニタリングは、Amazon RDS および Aurora データベースクラスターの信頼性、可用性、パフォーマンスを維持するための重要な要素です。AWS は、Amazon RDS および Aurora データベースリソースの健全性を監視し、問題が深刻化する前に検出し、一貫したユーザーエクスペリエンスのためにパフォーマンスを最適化するためのいくつかのツールを提供しています。このガイドでは、データベースがスムーズに実行されていることを確認するためのオブザーバビリティのベストプラクティスを提供します。 

## パフォーマンスガイドライン

ベストプラクティスとして、ワークロードのベースラインパフォーマンスを確立することから始めることをお勧めします。DB インスタンスをセットアップし、一般的なワークロードで実行する際に、すべてのパフォーマンスメトリクスの平均値、最大値、最小値を取得します。これを複数の異なる間隔（例：1 時間、24 時間、1 週間、2 週間）で実行します。これにより、何が正常であるかを把握できます。ピーク時とオフピーク時の両方の運用時間を比較すると役立ちます。この情報を使用して、パフォーマンスが標準レベルを下回っている時期を特定できます。
 
## モニタリングオプション

### Amazon CloudWatch メトリクス

[Amazon CloudWatch](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/monitoring-cloudwatch.html) は、[RDS](https://aws.amazon.com/rds/) および [Aurora](https://aws.amazon.com/rds/aurora/) データベースの監視と管理に不可欠なツールです。データベースのパフォーマンスに関する貴重な洞察を提供し、問題を迅速に特定して解決するのに役立ちます。Amazon RDS と Aurora データベースの両方が、アクティブな各データベースインスタンスのメトリクスを 1 分間隔で CloudWatch に送信します。モニタリングはデフォルトで有効になっており、メトリクスは 15 日間利用できます。RDS と Aurora は、インスタンスレベルのメトリクスを **AWS/RDS** 名前空間の Amazon CloudWatch に発行します。

CloudWatch Metrics を使用すると、データベースのパフォーマンスの傾向やパターンを特定し、この情報を使用して設定を最適化し、アプリケーションのパフォーマンスを向上させることができます。監視すべき主要なメトリクスは次のとおりです。

* **CPU Utilization** - 使用されているコンピュータ処理能力の割合。
* **DB Connections** - DB インスタンスに接続されているクライアントセッションの数。インスタンスのパフォーマンスと応答時間の低下と併せてユーザー接続数が多い場合は、データベース接続の制約を検討してください。DB インスタンスに最適なユーザー接続数は、インスタンスクラスと実行される操作の複雑さによって異なります。データベース接続数を確認するには、DB インスタンスをパラメータグループに関連付けます。
* **Freeable Memory** - DB インスタンスで使用可能な RAM の容量 (メガバイト単位)。Monitoring タブのメトリクスでは、CPU、メモリ、ストレージメトリクスの 75% に赤い線が表示されます。インスタンスのメモリ消費量が頻繁にこの線を超える場合は、ワークロードを確認するか、インスタンスをアップグレードする必要があることを示しています。
* **Network throughput** - DB インスタンスとの間のネットワークトラフィックの速度 (バイト/秒)。
* **Read/Write Latency** - 読み取りまたは書き込み操作の平均時間 (ミリ秒単位)。
* **Read/Write IOPS** - 1 秒あたりのディスク読み取りまたは書き込み操作の平均数。
* **Free Storage Space** - DB インスタンスで現在使用されていないディスク容量 (メガバイト単位)。使用済み容量が総ディスク容量の 85% 以上で一貫している場合は、ディスク容量の消費を調査してください。インスタンスからデータを削除するか、別のシステムにデータをアーカイブして容量を解放できるかどうかを確認してください。

![db_cw_metrics.png](../../images/db_cw_metrics.png)

パフォーマンス関連の問題をトラブルシューティングする場合、最初のステップは、最も使用頻度が高く、コストのかかるクエリをチューニングすることです。チューニングを行うことで、システムリソースへの負荷が軽減されるかどうかを確認します。詳細については、[クエリのチューニング](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_BestPractices.html#CHAP_BestPractices.TuningQueries)を参照してください。

クエリがチューニングされていても問題が解決しない場合は、データベースインスタンスクラスのアップグレードを検討してください。より多くのリソース (CPU、RAM、ディスク容量、ネットワーク帯域幅、I/O 容量) を持つインスタンスにアップグレードできます。

その後、これらのメトリクスが重要なしきい値に達したときにアラートを発するようにアラームを設定し、問題をできるだけ迅速に解決するためのアクションを実行できます。

CloudWatch メトリクスの詳細については、[Amazon RDS の Amazon CloudWatch メトリクス](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-metrics.html)および[CloudWatch コンソールと AWS CLI での DB インスタンスメトリクスの表示](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/metrics_dimensions.html)を参照してください。

#### CloudWatch Logs Insights

[CloudWatch Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html) を使用すると、Amazon CloudWatch Logs でログデータをインタラクティブに検索および分析できます。クエリを実行して、運用上の問題により効率的かつ効果的に対応できます。問題が発生した場合、CloudWatch Logs Insights を使用して潜在的な原因を特定し、デプロイされた修正を検証できます。

RDS または Aurora データベースクラスタから CloudWatch にログを発行するには、[Amazon RDS または Aurora for MySQL インスタンスのログを CloudWatch に発行する](https://repost.aws/knowledge-center/rds-aurora-mysql-logs-cloudwatch)を参照してください。

CloudWatch で RDS または Aurora ログをモニタリングする方法の詳細については、[Amazon RDS ログファイルのモニタリング](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_LogAccess.html)を参照してください。

#### CloudWatch アラーム

データベースクラスターのパフォーマンスが低下している時期を特定するには、主要なパフォーマンスメトリクスを定期的に監視し、アラートを設定する必要があります。[Amazon CloudWatch アラーム](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html)を使用すると、指定した期間にわたって単一のメトリクスを監視できます。メトリクスが指定されたしきい値を超えると、Amazon SNS トピックまたは AWS Auto Scaling ポリシーに通知が送信されます。CloudWatch アラームは、特定の状態にあるという理由だけでアクションを呼び出すことはありません。むしろ、状態が変化し、指定された期間数にわたって維持されている必要があります。アラームは、アラーム状態が変化した場合にのみアクションを呼び出します。アラーム状態にあるだけでは不十分です。

CloudWatch アラームを設定するには

* AWS マネジメントコンソールに移動し、[https://console.aws.amazon.com/rds/](https://console.aws.amazon.com/rds/) で Amazon RDS コンソールを開きます。
* ナビゲーションペインで、[Databases] を選択し、DB インスタンスを選択します。
* [Logs & events] を選択します。

CloudWatch アラームセクションで、Create alarm を選択します。

![db_cw_alarm.png](../../images/db_cw_alarm.png)

* Send notifications で、Yes を選択し、Send notifications to で、New email or SMS topic を選択します。
* Topic name に、通知の名前を入力し、With these recipients に、カンマ区切りのメールアドレスと電話番号のリストを入力します。
* Metric で、設定するアラーム統計とメトリクスを選択します。
* Threshold で、メトリクスがしきい値より大きい、小さい、または等しいかを指定し、しきい値を指定します。
* Evaluation period で、アラームの評価期間を選択します。consecutive period(s) of で、アラームをトリガーするためにしきい値に達している必要がある期間を選択します。
* Name of alarm に、アラームの名前を入力します。
* Create Alarm を選択します。

アラームは CloudWatch アラームセクションに表示されます。

Multi-AZ DB クラスターのレプリカラグに対する Amazon CloudWatch アラームを作成するには、この[例](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/multi-az-db-cluster-cloudwatch-alarm.html)を参照してください。 

#### データベース監査ログ

データベース監査ログは、RDS および Aurora データベースで実行されたすべてのアクションの詳細な記録を提供し、不正アクセス、データ変更、その他の潜在的に有害なアクティビティを監視できるようにします。データベース監査ログを使用するためのベストプラクティスをいくつか示します。

* すべての RDS および Aurora インスタンスで Database Audit Logs を有効にし、関連するすべてのデータをキャプチャするように設定します。
* Amazon CloudWatch Logs や Amazon Kinesis Data Streams などの一元化されたログ管理ソリューションを使用して、Database Audit Logs を収集および分析します。
* Database Audit Logs を定期的に監視して不審なアクティビティを検出し、問題を迅速に調査して解決するための措置を講じます。

データベース監査ログの設定方法の詳細については、[Amazon RDS と Aurora のデータベースアクティビティをキャプチャするための監査ログの設定](https://aws.amazon.com/blogs/database/configuring-an-audit-log-to-capture-database-activities-for-amazon-rds-for-mysql-and-amazon-aurora-with-mysql-compatibility/)を参照してください。

#### データベースのスロークエリおよびエラーログ

スロークエリログは、データベース内のパフォーマンスが低いクエリを見つけるのに役立ちます。これにより、遅延の原因を調査し、必要に応じてクエリをチューニングできます。エラーログは、クエリエラーを見つけるのに役立ち、さらにそれらのエラーによるアプリケーションの変更を見つけるのに役立ちます。

Amazon CloudWatch Logs Insights (Amazon CloudWatch Logs でログデータをインタラクティブに検索および分析できます) を使用して CloudWatch ダッシュボードを作成することで、スロークエリログとエラーログを監視できます。

Amazon RDS のエラーログ、スロークエリログ、および一般ログを有効化して監視するには、[RDS MySQL のスロークエリログと一般ログの管理](https://repost.aws/knowledge-center/rds-mysql-logs)を参照してください。Aurora PostgreSQL のスロークエリログを有効化するには、[PostgreSQL のスロークエリログの有効化](https://catalog.us-east-1.prod.workshops.aws/workshops/31babd91-aa9a-4415-8ebf-ce0a6556a216/en-US/postgresql-logs/enable-slow-query-log)を参照してください。

## Performance Insights とオペレーティングシステムメトリクス

####  拡張モニタリング

[拡張モニタリング](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_Monitoring.OS.html)を使用すると、DB インスタンスが実行されているオペレーティングシステム (OS) のきめ細かなメトリクスをリアルタイムで取得できます。

RDS は、拡張モニタリングのメトリクスを Amazon CloudWatch Logs アカウントに配信します。デフォルトでは、これらのメトリクスは 30 日間保存され、Amazon CloudWatch の **RDSOSMetrics** ロググループに格納されます。1 秒から 60 秒の間で粒度を選択できます。CloudWatch Logs から CloudWatch でカスタムメトリクスフィルターを作成し、CloudWatch ダッシュボードにグラフを表示できます。

![db_enhanced_monitoring_loggroup.png](../../images/db_enhanced_monitoring_loggroup.png)

拡張モニタリングには、OS レベルのプロセスリストも含まれます。現在、拡張モニタリングは以下のデータベースエンジンで利用できます。

* MariaDB
* Microsoft SQL Server
* MySQL
* Oracle
* PostgreSQL

**CloudWatch と拡張モニタリングの違い**
CloudWatch は、DB インスタンスのハイパーバイザーから CPU 使用率に関するメトリクスを収集します。対照的に、拡張モニタリングは DB インスタンス上のエージェントからメトリクスを収集します。ハイパーバイザーは仮想マシン (VM) を作成して実行します。ハイパーバイザーを使用することで、インスタンスはメモリと CPU を仮想的に共有することにより、複数のゲスト VM をサポートできます。ハイパーバイザー層が少量の作業を実行するため、CloudWatch と拡張モニタリングの測定値に違いが見られる場合があります。DB インスタンスで小さいインスタンスクラスを使用している場合、この違いはさらに大きくなる可能性があります。このシナリオでは、単一の物理インスタンス上でハイパーバイザー層によって管理される仮想マシン (VM) の数が多くなる可能性があります。

Enhanced Monitoring で利用可能なすべてのメトリクスについては、[Enhanced Monitoring の OS メトリクス](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_Monitoring-Available-OS-Metrics.html)を参照してください。


![db-enhanced-monitoring.png](../../images/db_enhanced_monitoring.png)

#### Performance Insights 

[Amazon RDS Performance Insights](https://aws.amazon.com/rds/performance-insights/) は、データベースのパフォーマンスチューニングおよび監視機能であり、データベースの負荷を迅速に評価し、いつどこでアクションを実行すべきかを判断するのに役立ちます。Performance Insights ダッシュボードを使用すると、データベースクラスターのデータベース負荷を視覚化し、待機、SQL ステートメント、ホスト、またはユーザーごとに負荷をフィルタリングできます。症状を追いかけるのではなく、根本原因を特定することができます。Performance Insights は、アプリケーションのパフォーマンスに影響を与えない軽量なデータ収集方法を使用し、どの SQL ステートメントが負荷を引き起こしているか、またその理由を簡単に確認できるようにします。

Performance Insights は、7 日間の無料パフォーマンス履歴保持を提供し、有料で最大 2 年間まで延長できます。Performance Insights は、RDS 管理コンソールまたは AWS CLI から有効にできます。Performance Insights は、顧客やサードパーティが独自のカスタムツールと Performance Insights を統合できるように、公開 API も提供しています。

:::note
	現在、RDS Performance Insights は、Aurora (PostgreSQL 互換エディションおよび MySQL 互換エディション)、Amazon RDS for PostgreSQL、MySQL、MariaDB、SQL Server、Oracle でのみ利用可能です。
:::

**DBLoad** は、データベースのアクティブセッションの平均数を表す主要なメトリクスです。Performance Insights では、このデータは **db.load.avg** メトリクスとしてクエリされます。

![db_perf_insights.png](../../images/db_perf_insights.png)

Aurora で Performance Insights を使用する方法の詳細については、[Amazon Aurora での Performance Insights による DB 負荷のモニタリング](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/USER_PerfInsights.html)を参照してください。 


## オープンソースのオブザーバビリティツール

#### Amazon Managed Grafana
[Amazon Managed Grafana](https://aws.amazon.com/grafana/) は、RDS および Aurora データベースからのデータを簡単に可視化および分析できるフルマネージドサービスです。

Amazon CloudWatch の **AWS/RDS 名前空間**には、Amazon RDS および Amazon Aurora で実行されているデータベースエンティティに適用される主要なメトリクスが含まれています。Amazon Managed Grafana で RDS/Aurora データベースの健全性と潜在的なパフォーマンスの問題を可視化および追跡するには、CloudWatch データソースを活用できます。 

![amg-rds-aurora.png](../../images/amg-rds-aurora.png)

現時点では、CloudWatch で利用できるのは基本的な Performance Insights メトリクスのみであり、データベースのパフォーマンスを分析してボトルネックを特定するには不十分です。RDS Performance Insight メトリクスを Amazon Managed Grafana で可視化し、単一画面での可視性を実現するために、カスタム Lambda 関数を使用してすべての RDS Performance Insights メトリクスを収集し、カスタム CloudWatch メトリクス名前空間に発行できます。これらのメトリクスが Amazon CloudWatch で利用可能になれば、Amazon Managed Grafana で可視化できます。

RDS Performance Insights メトリクスを収集するカスタム Lambda 関数をデプロイするには、次の GitHub リポジトリをクローンして install.sh スクリプトを実行します。

```
$ git clone https://github.com/aws-observability/observability-best-practices.git
$ cd sandbox/monitor-aurora-with-grafana

$ chmod +x install.sh
$ ./install.sh
```

上記のスクリプトは、AWS CloudFormation を使用してカスタム Lambda 関数と IAM ロールをデプロイします。Lambda 関数は 10 分ごとに自動的にトリガーされ、RDS Performance Insights API を呼び出して、Amazon CloudWatch の /AuroraMonitoringGrafana/PerformanceInsights カスタム名前空間にカスタムメトリクスを発行します。

![db_performanceinsights_amg.png](../../images/db_performanceinsights_amg.png)

カスタム Lambda 関数のデプロイと Grafana ダッシュボードの詳細な手順については、[Amazon Managed Grafana での Performance Insights](https://aws.amazon.com/blogs/mt/monitoring-amazon-rds-and-amazon-aurora-using-amazon-managed-grafana/) を参照してください。

データベースの意図しない変更を迅速に特定し、アラートを使用して通知することで、中断を最小限に抑えるためのアクションを実行できます。Amazon Managed Grafana は、SNS、Slack、PagerDuty などの複数の通知チャネルをサポートしており、アラート通知を送信できます。[Grafana Alerting](https://docs.aws.amazon.com/grafana/latest/userguide/alerts-overview.html) では、Amazon Managed Grafana でアラートを設定する方法の詳細情報を確認できます。

<!-- blank line -->
<figure class="video_container">
  <iframe width="560" height="315" src="https://www.youtube.com/embed/Uj9UJ1mXwEA" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</figure>
<!-- blank line -->

## AIOps - 機械学習ベースのパフォーマンスボトルネック検出

#### Amazon DevOps Guru for RDS

[Amazon DevOps Guru for RDS](https://aws.amazon.com/devops-guru/features/devops-guru-for-rds/) を使用すると、データベースのパフォーマンスボトルネックや運用上の問題を監視できます。Performance Insights メトリクスを使用し、機械学習 (ML) を使用してそれらを分析することで、パフォーマンス問題のデータベース固有の分析を提供し、是正措置を推奨します。DevOps Guru for RDS は、ホストリソースの過剰使用、データベースのボトルネック、SQL クエリの誤動作など、さまざまなパフォーマンス関連のデータベース問題を特定して分析できます。問題または異常な動作が検出されると、DevOps Guru for RDS は DevOps Guru コンソールに検出結果を表示し、[Amazon EventBridge](https://aws.amazon.com/pm/eventbridge) または [Amazon Simple Notification Service (SNS)](https://aws.amazon.com/pm/sns) を使用して通知を送信することで、DevOps チームや SRE チームが顧客に影響を与える障害になる前に、パフォーマンスや運用上の問題に対してリアルタイムでアクションを実行できるようにします。

DevOps Guru for RDS は、データベースメトリクスのベースラインを確立します。ベースライン化では、一定期間にわたってデータベースパフォーマンスメトリクスを分析し、正常な動作を確立します。Amazon DevOps Guru for RDS は、ML を使用して、確立されたベースラインに対する異常を検出します。ワークロードパターンが変化した場合、DevOps Guru for RDS は新しいベースラインを確立し、それを使用して新しい正常状態に対する異常を検出します。 

:::note
	新しいデータベースインスタンスの場合、Amazon DevOps Guru for RDS は初期ベースラインを確立するまでに最大 2 日かかります。これは、データベースの使用パターンを分析し、正常な動作と見なされるものを確立する必要があるためです。
:::

![db_dgr_anomaly.png.png](../../images/db_dgr_anomaly.png)

![db_dgr_recommendation.png](../../images/db_dgr_recommendation.png)

開始方法の詳細については、[Amazon DevOps Guru for RDS to Detect, Diagnose, and Resolve Amazon Aurora-Related Issues using ML](https://aws.amazon.com/blogs/aws/new-amazon-devops-guru-for-rds-to-detect-diagnose-and-resolve-amazon-aurora-related-issues-using-ml/) を参照してください。

<!-- blank line -->
<figure class="video_container">
  <iframe width="560" height="315" src="https://www.youtube.com/embed/N3NNYgzYUDA" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</figure>
<!-- blank line -->

## 監査とガバナンス

####  AWS CloudTrail Logs

[AWS CloudTrail](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html) は、RDS でユーザー、ロール、または AWS サービスによって実行されたアクションの記録を提供します。CloudTrail は、コンソールからの呼び出しや RDS API オペレーションへのコード呼び出しを含む、RDS のすべての API 呼び出しをイベントとしてキャプチャします。CloudTrail によって収集された情報を使用して、RDS に対して行われたリクエスト、リクエストが行われた IP アドレス、リクエストを行ったユーザー、リクエストが行われた日時、およびその他の詳細を判断できます。詳細については、[AWS CloudTrail での Amazon RDS API 呼び出しのモニタリング](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/logging-using-cloudtrail.html)を参照してください。

詳細については、[AWS CloudTrail での Amazon RDS API 呼び出しのモニタリング](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/logging-using-cloudtrail.html)を参照してください。

## 詳細情報の参照先

[ブログ - Amazon Managed Grafana で RDS および Aurora データベースをモニタリングする](https://aws.amazon.com/blogs/mt/monitoring-amazon-rds-and-amazon-aurora-using-amazon-managed-grafana/)

[動画 - Amazon Managed Grafana で RDS および Aurora データベースをモニタリングする](https://www.youtube.com/watch?v=Uj9UJ1mXwEA)

[ブログ - Amazon CloudWatch で RDS および Aurora データベースをモニタリングする](https://aws.amazon.com/blogs/database/creating-an-amazon-cloudwatch-dashboard-to-monitor-amazon-rds-and-amazon-aurora-mysql/)

[ブログ - Amazon CloudWatch Logs、AWS Lambda、Amazon SNS を使用した Amazon RDS のプロアクティブなデータベースモニタリングの構築](https://aws.amazon.com/blogs/database/build-proactive-database-monitoring-for-amazon-rds-with-amazon-cloudwatch-logs-aws-lambda-and-amazon-sns/)

[公式ドキュメント - Amazon Aurora モニタリングガイド](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/MonitoringOverview.html)

[ハンズオンワークショップ - Amazon Aurora における SQL パフォーマンスの問題の観察と特定](https://catalog.workshops.aws/awsauroramysql/en-US/provisioned/perfobserve)


