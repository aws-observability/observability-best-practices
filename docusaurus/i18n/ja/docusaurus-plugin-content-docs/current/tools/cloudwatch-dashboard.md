# CloudWatch ダッシュボード




## はじめに

AWS アカウントのリソースの在庫詳細、リソースのパフォーマンス、およびヘルスチェックを把握することは、安定したリソース管理にとって重要です。Amazon CloudWatch ダッシュボードは、CloudWatch コンソールでカスタマイズ可能なホームページであり、クロスアカウントや異なるリージョンにまたがるリソースであっても、1 つのビューでリソースを監視するために使用できます。

[Amazon CloudWatch ダッシュボード](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Dashboards.html) を使用することで、お客様は再利用可能なグラフを作成し、クラウドリソースとアプリケーションを統合されたビューで可視化できます。CloudWatch ダッシュボードを通じて、お客様はメトリクスとログのデータを統合されたビューで並べて表示し、素早くコンテキストを把握し、問題の診断から根本原因の理解へと移行でき、平均復旧時間（MTTR）を短縮できます。たとえば、お客様は CPU 使用率やメモリなどの主要なメトリクスの現在の使用率を可視化し、割り当てられた容量と比較できます。また、特定のメトリクスのログパターンを相関付け、パフォーマンスや運用上の問題についてアラームを設定することもできます。CloudWatch ダッシュボードは、アラームの現在のステータスを表示することで、お客様がアクションが必要な状況を素早く可視化し、注意を向けることができます。CloudWatch ダッシュボードの共有機能により、お客様は表示されているダッシュボード情報を、組織内外のチームや関係者と簡単に共有できます。




## ウィジェット




#### デフォルトのウィジェット

ウィジェットは CloudWatch ダッシュボードの構成要素であり、AWS 環境におけるリソースやアプリケーションのメトリクスとログに関する重要な情報とほぼリアルタイムの詳細を表示します。
お客様は要件に応じてウィジェットの追加、削除、再配置、サイズ変更を行い、ダッシュボードを希望する表示にカスタマイズできます。

ダッシュボードに追加できるグラフの種類には、折れ線グラフ、数値、ゲージ、積み上げ面グラフ、棒グラフ、円グラフがあります。

デフォルトのウィジェットタイプには、**グラフ** タイプの **折れ線グラフ、数値、ゲージ、積み上げ面グラフ、棒グラフ、円グラフ** があり、その他にも **テキスト、アラームステータス、ログテーブル、エクスプローラー** などのウィジェットがあり、お客様はメトリクスやログデータを追加してダッシュボードを構築することができます。

![Default Widgets](../images/cw_dashboards_widgets.png)

**追加のリファレンス:**

- AWS Observability Workshop の [Metric Number Widgets](https://catalog.workshops.aws/observability/en-US/aws-native/dashboards/metrics-number)
- AWS Observability Workshop の [Text Widgets](https://catalog.workshops.aws/observability/en-US/aws-native/dashboards/text-widget)
- AWS Observability Workshop の [Alarm Widgets](https://catalog.workshops.aws/observability/en-US/aws-native/dashboards/alarm-widgets)
- ドキュメント [CloudWatch ダッシュボードでのウィジェットの作成と操作](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/create-and-work-with-widgets.html)



#### カスタムウィジェット

CloudWatch ダッシュボードでは、[カスタムウィジェットを追加](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/create-and-work-with-widgets.html)して、カスタムビジュアライゼーションの表示、複数のソースからの情報の表示、ボタンなどのカスタムコントロールを追加して CloudWatch ダッシュボードで直接アクションを実行することもできます。

カスタムウィジェットは Lambda 関数によって完全にサーバーレスで動作し、コンテンツ、レイアウト、インタラクションを完全にコントロールできます。

カスタムウィジェットは、複雑な Web フレームワークを学ぶ必要なく、ダッシュボード上にカスタムデータビューやツールを構築する簡単な方法です。

Lambda でコードを書き、HTML を作成できれば、有用なカスタムウィジェットを作成できます。

![Custom Widgets](../images/cw_dashboards_custom-widgets.png)

**追加のリファレンス:**

- AWS オブザーバビリティワークショップの[カスタムウィジェット](https://catalog.workshops.aws/observability/en-US/aws-native/dashboards/custom-widgets)
- GitHub の [CloudWatch カスタムウィジェットサンプル](https://github.com/aws-samples/cloudwatch-custom-widgets-samples#what-are-custom-widgets)
- ブログ: [Amazon CloudWatch ダッシュボードのカスタムウィジェットの使用](https://aws.amazon.com/blogs/mt/introducing-amazon-cloudwatch-dashboards-custom-widgets/)



## 自動ダッシュボード

自動ダッシュボードは、すべての AWS パブリックリージョンで利用可能で、Amazon CloudWatch 配下のすべての AWS リソースの健全性とパフォーマンスの集約ビューを提供します。
これにより、お客様はモニタリングをすぐに開始でき、メトリクスとアラームのリソースベースのビューを確認し、パフォーマンスの問題の根本原因を容易に特定することができます。
自動ダッシュボードは AWS サービスが推奨する[ベストプラクティス](https://docs.aws.amazon.com/ja_jp/prescriptive-guidance/latest/implementing-logging-monitoring-cloudwatch/cloudwatch-dashboards-visualizations.html)に基づいて事前に構築されており、リソースを認識し、重要なパフォーマンスメトリクスの最新状態を動的に更新します。
自動サービスダッシュボードは、サービスの標準的な CloudWatch メトリクスをすべて表示し、各サービスメトリクスに使用されるすべてのリソースをグラフ化し、アカウント全体で異常なリソースを素早く特定することができ、使用率の高いリソースや低いリソースを特定してコストを最適化するのに役立ちます。

![Automatic Dashboards](../images/automatic-dashboard.png)

**追加のリファレンス:**

- AWS オブザーバビリティワークショップの[自動ダッシュボード](https://catalog.workshops.aws/observability/en-US/aws-native/dashboards/autogen-dashboard)
- YouTube の[Monitor AWS Resources Using Amazon CloudWatch Dashboards](https://www.youtube.com/watch?v=I7EFLChc07M)




#### Container Insights の自動ダッシュボード

[CloudWatch Container Insights](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/ContainerInsights.html) は、コンテナ化されたアプリケーションとマイクロサービスのメトリクスとログを収集、集約、要約します。
Container Insights は、Amazon Elastic Container Service (Amazon ECS)、Amazon Elastic Kubernetes Service (Amazon EKS)、および Amazon EC2 上の Kubernetes プラットフォームで利用できます。
Container Insights は、Amazon ECS と Amazon EKS の両方で Fargate にデプロイされたクラスターからのメトリクス収集をサポートしています。
CloudWatch は、CPU、メモリ、ディスク、ネットワークなどの多くのリソースのメトリクスを自動的に収集し、コンテナの再起動失敗などの診断情報も提供して、問題の特定と迅速な解決を支援します。

CloudWatch は、[埋め込みメトリクスフォーマット](https://aws-observability.github.io/observability-best-practices/guides/signal-collection/emf/) を使用して、クラスター、ノード、Pod、タスク、サービスレベルの集約メトリクスを CloudWatch メトリクスとして作成します。
これは、高カーディナリティデータをスケーラブルに取り込み、保存できる構造化された JSON スキーマを使用するパフォーマンスログイベントです。
Container Insights が収集するメトリクスは、[CloudWatch 自動ダッシュボード](https://docs.aws.amazon.com/ja_jp/prescriptive-guidance/latest/implementing-logging-monitoring-cloudwatch/cloudwatch-dashboards-visualizations.html) で利用でき、CloudWatch コンソールのメトリクスセクションでも表示できます。

![Container Insights](../images/Container_Insights_CW_Automatic_DB.png)




#### Lambda Insights の自動ダッシュボード

[CloudWatch Lambda Insights](https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/monitoring-insights.html) は、AWS Lambda などのサーバーレスアプリケーション向けのモニタリングとトラブルシューティングのソリューションで、Lambda 関数の[自動ダッシュボード](https://docs.aws.amazon.com/ja_jp/prescriptive-guidance/latest/implementing-logging-monitoring-cloudwatch/cloudwatch-dashboards-visualizations.html)を動的に作成します。

また、CPU 時間、メモリ、ディスク、ネットワークなどのシステムレベルのメトリクスや、コールドスタートや Lambda ワーカーのシャットダウンなどの診断情報を収集、集約、要約して、Lambda 関数の問題を特定し、迅速に解決するのに役立ちます。

[Lambda Insights](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/Lambda-Insights.html) は、関数レベルでレイヤーとして提供される Lambda 拡張機能です。有効にすると、[埋め込みメトリクスフォーマット](https://aws-observability.github.io/observability-best-practices/guides/signal-collection/emf/)を使用してログイベントからメトリクスを抽出し、エージェントを必要としません。

![Lambda Insights](../images/Lambda_Insights_CW_Automatic_DB.png)



## カスタムダッシュボード

お客様は、[カスタムダッシュボード](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/create_dashboard.html) を必要な数だけ作成し、異なるウィジェットを使用して必要に応じてカスタマイズすることができます。
ダッシュボードはリージョン間やアカウント間での表示が可能で、お気に入りリストに追加することができます。

![Custom Dashboards](../images/CustomDashboard.png)

お客様は、自動作成されたダッシュボードやカスタムダッシュボードを CloudWatch コンソールの[お気に入りリスト](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/add-dashboard-to-favorites.html)に追加することで、コンソールのナビゲーションペインから素早く簡単にアクセスできます。

**参考資料：**

- [CloudWatch ダッシュボード](https://catalog.workshops.aws/observability/en-US/aws-native/dashboards/create)に関する AWS オブザーバビリティワークショップ
- [CloudWatch ダッシュボードを使用したモニタリング](https://www.wellarchitectedlabs.com/performance-efficiency/100_labs/100_monitoring_windows_ec2_cloudwatch/)に関する AWS Well-Architected Labs のパフォーマンス効率




#### CloudWatch ダッシュボードへの Contributor Insights の追加

CloudWatch は [Contributor Insights](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/ContributorInsights.html) を提供し、ログデータを分析して、コントリビューターデータを表示する時系列を作成します。これにより、上位 N 個のコントリビューター、ユニークなコントリビューターの総数、およびその使用状況に関するメトリクスを確認できます。これは、最も影響の大きいトーカーを見つけ、システムパフォーマンスに影響を与えているユーザーや要因を理解するのに役立ちます。例えば、問題のあるホストの特定、ネットワーク使用量の多いユーザーの特定、最もエラーを生成する URL の発見などが可能です。

Contributor Insights レポートは、CloudWatch コンソールの[新規または既存のダッシュボード](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/ContributorInsights-ViewReports.html)に追加できます。

![Contributor Insights](../images/Contributor_Insights_CW_DB.png)



#### CloudWatch ダッシュボードへの Application Insights の追加

[CloudWatch Application Insights](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/cloudwatch-application-insights.html) は、AWS でホストされているアプリケーションとその基盤となる AWS リソースのオブザーバビリティを容易にします。
これにより、アプリケーションの健全性の可視性が向上し、アプリケーションの問題をトラブルシューティングするための平均修復時間 (MTTR) を短縮できます。
Application Insights は、監視対象のアプリケーションの潜在的な問題を示す自動化されたダッシュボードを提供し、アプリケーションとインフラストラクチャで発生している問題を迅速に特定するのに役立ちます。

以下に示すように、Application Insights の「Export to CloudWatch」オプションは、CloudWatch コンソールにダッシュボードを追加し、重要なアプリケーションのインサイトを簡単に監視できるようにします。

![Application Insights](../images/Application_Insights_CW_DB.png)



#### CloudWatch ダッシュボードへのサービスマップの追加

[CloudWatch ServiceLens](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/ServiceLens.html) は、トレース、メトリクス、ログ、アラーム、その他のリソースの健全性情報を 1 か所に統合することで、サービスとアプリケーションのオブザーバビリティを強化します。
ServiceLens は CloudWatch と AWS X-Ray を統合し、アプリケーションのエンドツーエンドのビューを提供することで、パフォーマンスのボトルネックの特定と影響を受けるユーザーの識別を効率的に行うことができます。
[サービスマップ](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/servicelens_service_map.html) は、サービスエンドポイントとリソースをノードとして表示し、各ノードとその接続のトラフィック、レイテンシー、エラーを強調表示します。
表示される各ノードは、サービスのその部分に関連付けられた相関のあるメトリクス、ログ、トレースに関する詳細なインサイトを提供します。

以下に示すように、サービスマップ内の「ダッシュボードに追加」オプションを使用すると、CloudWatch コンソールで新しいダッシュボードまたは既存のダッシュボードにサービスマップを追加でき、お客様はアプリケーションのインサイトを簡単にトレースできます。

![Service Map](../images/Service_Map_CW_DB.png)



#### CloudWatch ダッシュボードへの Metrics Explorer の追加

CloudWatch の [Metrics explorer](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-Metrics-Explorer.html) は、タグベースのツールで、AWS サービスのオブザーバビリティを向上させるために、タグとリソースプロパティでメトリクスをフィルタリング、集計、可視化することができます。
Metrics explorer は柔軟でダイナミックなトラブルシューティング体験を提供し、一度に複数のグラフを作成し、これらのグラフを使用してアプリケーションの健全性ダッシュボードを構築することができます。
Metrics explorer の可視化は動的であり、Metrics explorer ウィジェットを作成して CloudWatch ダッシュボードに追加した後に一致するリソースが作成された場合、新しいリソースは自動的にエクスプローラーウィジェットに表示されます。

以下に示すように、Metrics Explorer 内の「[ダッシュボードに追加](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/add_metrics_explorer_dashboard.html)」オプションを使用すると、CloudWatch コンソールで新しいダッシュボードまたは既存のダッシュボードに追加でき、AWS サービスとリソースについてより多くのグラフインサイトを簡単に得ることができます。

![Metrics Explorer](../images/Metrics_Explorer_CW_DB.png)



## CloudWatch ダッシュボードで可視化するもの

お客様は、アカウントレベルとアプリケーションレベルでダッシュボードを作成し、リージョンやアカウントをまたいでワークロードとアプリケーションをモニタリングできます。
CloudWatch の自動ダッシュボードを使用すれば、AWS サービスレベルのダッシュボードをすぐに利用開始でき、サービス固有のメトリクスが事前に設定されています。
本番環境のアプリケーションやワークロードに関連する重要なメトリクスとリソースに焦点を当てた、アプリケーションおよびワークロード固有のダッシュボードを作成することをお勧めします。



#### メトリクスデータの可視化

メトリクスデータは、**Line、Number、Gauge、Stacked area、Bar、Pie** などのグラフウィジェットを通じて CloudWatch ダッシュボードに追加できます。これらは **Average、Minimum、Maximum、Sum、SampleCount** を通じてメトリクスの統計情報をサポートしています。[統計情報](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/Statistics-definitions.html) は、指定された期間にわたるメトリクスデータの集計です。

![Metrics Data Visual](../images/graph_widget_metrics.png)

[Metric Math](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/using-metric-math.html) を使用すると、複数の CloudWatch メトリクスを照会し、数式を使用してこれらのメトリクスに基づく新しい時系列を作成できます。お客様は CloudWatch コンソールで結果の時系列を可視化し、ダッシュボードに追加できます。また、[GetMetricDataAPI](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/APIReference/API_GetMetricData.html) オペレーションを使用してプログラムで Metric Math を実行することもできます。

**追加のリファレンス:**

- [Monitoring your IoT fleet using CloudWatch](https://aws.amazon.com/blogs/iot/monitoring-your-iot-fleet-using-cloudwatch/)



#### ログデータの可視化

CloudWatch ダッシュボードでは、[ログデータの可視化](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/CWL_Insights-Visualizing-Log-Data.html) を棒グラフ、折れ線グラフ、積み上げ面グラフで表示し、パターンをより効率的に特定できます。

CloudWatch Logs Insights は、stats 関数と 1 つ以上の集計関数を使用して棒グラフを生成できるクエリの可視化を生成します。

クエリで bin() 関数を使用して時間軸で[データをグループ化](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/CWL_Insights-Visualizing-Log-Data.html)する場合、折れ線グラフと積み上げ面グラフを可視化に使用できます。

クエリに 1 つ以上のステータス関数の集計が含まれている場合、または bin() 関数を使用して 1 つのフィールドでデータをグループ化する場合、[時系列データ](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/CWL_Insights-Visualizing-Log-Data.html)を特性を使用して可視化できます。

stats 関数として count() を使用したサンプルクエリを以下に示します。

```java
filter @message like /GET/
| parse @message '_ - - _ "GET _ HTTP/1.0" .*.*.*' as ip, timestamp, page, status, responseTime, bytes
| stats count() as request_count by status
```

上記のクエリの結果は、CloudWatch Logs Insights で以下のように表示されます。

![CloudWatch Logs Insights](../images/widget_logs_1.png)

クエリ結果の円グラフによる可視化を以下に示します。

![CloudWatch Logs Insights Visualization](../images/widget_logs_2.png)

**追加のリファレンス：**

- CloudWatch ダッシュボードでの[ログ結果の表示](https://catalog.workshops.aws/observability/en-US/aws-native/logs/logsinsights/displayformats)に関する AWS オブザーバビリティワークショップ
- [Amazon CloudWatch ダッシュボードを使用した AWS WAF ログの可視化](https://aws.amazon.com/blogs/security/visualize-aws-waf-logs-with-an-amazon-cloudwatch-dashboard/)




#### アラームの可視化

CloudWatch のメトリクスアラームは、単一のメトリクスまたは CloudWatch メトリクスに基づく数式の結果を監視します。アラームは、一定期間にわたるしきい値に対するメトリクスまたは数式の値に基づいて、1 つ以上のアクションを実行します。[CloudWatch ダッシュボード](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/add_remove_alarm_dashboard.html) には、単一のアラームをウィジェットとして追加でき、アラームのメトリクスのグラフとアラームのステータスを表示できます。また、CloudWatch ダッシュボードにアラームステータスウィジェットを追加することで、グリッド内に複数のアラームのステータスを表示できます。アラーム名と現在のステータスのみが表示され、グラフは表示されません。

以下は、CloudWatch ダッシュボード内のアラームウィジェットに表示されたメトリクスアラームステータスのサンプルです。

![CloudWatch Alarms](../images/widget_alarms.png)



## クロスアカウントとクロスリージョン

複数の AWS アカウントを持つお客様は、[CloudWatch クロスアカウント](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/cloudwatch_crossaccount_dashboard.html) オブザーバビリティを設定できます。
これにより、中央のモニタリングアカウントでクロスアカウントのダッシュボードを作成し、アカウントの境界を意識することなく、メトリクス、ログ、トレースをシームレスに検索、可視化、分析することができます。

また、お客様は [クロスアカウントクロスリージョン](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/cloudwatch_xaxr_dashboard.html) ダッシュボードを作成することもできます。
これにより、複数の AWS アカウントと複数のリージョンの CloudWatch データを 1 つのダッシュボードにまとめることができます。
このハイレベルなダッシュボードから、アプリケーション全体の統合されたビューを得ることができ、アカウントのサインイン・サインアウトやリージョンの切り替えを行うことなく、より詳細なダッシュボードにドリルダウンすることもできます。

**追加のリファレンス：**

- [新しいクロスアカウントの Amazon EC2 インスタンスを中央の Amazon CloudWatch ダッシュボードに自動追加する方法](https://aws.amazon.com/blogs/mt/how-to-auto-add-new-cross-account-amazon-ec2-instances-in-a-central-amazon-cloudwatch-dashboard/)
- [マルチアカウント Amazon CloudWatch ダッシュボードのデプロイ](https://aws.amazon.com/blogs/mt/deploy-multi-account-amazon-cloudwatch-dashboards/)
- YouTube の [クロスアカウントとクロスリージョンの CloudWatch ダッシュボードの作成](https://www.youtube.com/watch?v=eIUZdaqColg)



## ダッシュボードの共有

CloudWatch ダッシュボードは、チーム間、ステークホルダー、そして AWS アカウントへの直接アクセス権を持たない組織外の人々と共有することができます。これらの[共有ダッシュボード](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/cloudwatch-dashboard-sharing.html)は、チームエリア、モニタリングやネットワークオペレーションセンター (NOC) の大画面に表示したり、Wiki やパブリックウェブページに埋め込んだりすることもできます。

簡単かつ安全に共有するための 3 つの方法があります。

- ダッシュボードを[パブリックに共有](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/cloudwatch-dashboard-sharing.html)することで、リンクを持つ誰もがダッシュボードを閲覧できます。
- ダッシュボードを閲覧できる人の[特定のメールアドレスに共有](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/cloudwatch-dashboard-sharing.html)することができます。各ユーザーは、ダッシュボードを閲覧するために独自のパスワードを作成します。
- [シングルサインオン (SSO) プロバイダー](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/cloudwatch-dashboard-sharing.html)を通じて、AWS アカウント内でダッシュボードを共有できます。

**パブリックにダッシュボードを共有する際の注意点**

ダッシュボードに機密情報や秘密情報が含まれている場合、CloudWatch ダッシュボードのパブリックな共有は推奨されません。可能な限り、ダッシュボードを共有する際はユーザー名/パスワードまたはシングルサインオン (SSO) による認証を使用することを推奨します。

ダッシュボードをパブリックにアクセス可能にすると、CloudWatch はダッシュボードをホストする Web ページへのリンクを生成します。Web ページを閲覧する誰もが、パブリックに共有されたダッシュボードの内容を見ることができます。Web ページは、共有するダッシュボード内のアラームとコントリビューターインサイトルール、およびダッシュボードに表示されていない場合でも、アカウント内のすべてのメトリクスと EC2 インスタンスの名前とタグを照会する API を呼び出すための一時的な認証情報をリンクを通じて提供します。この情報をパブリックに公開することが適切かどうかを検討することをお勧めします。

ダッシュボードをパブリックに Web ページで共有を有効にすると、以下の Amazon Cognito リソースがアカウントに作成されることにご注意ください：Cognito ユーザープール、Cognito アプリクライアント、Cognito ID プール、IAM ロール。

**認証情報を使用してダッシュボードを共有する際の注意点（ユーザー名とパスワードで保護されたダッシュボード）**

ダッシュボードに、共有するユーザーと共有したくない機密情報や秘密情報が含まれている場合、CloudWatch ダッシュボードの共有は推奨されません。

ダッシュボードの共有を有効にすると、CloudWatch はダッシュボードをホストする Web ページへのリンクを生成します。上記で指定したユーザーには、以下の権限が付与されます：共有するダッシュボード内のアラームとコントリビューターインサイトルール、およびダッシュボードに表示されていない場合でも、アカウント内のすべてのメトリクスと EC2 インスタンスの名前とタグに対する CloudWatch の読み取り専用権限。この情報を共有するユーザーに公開することが適切かどうかを検討することをお勧めします。

Web ページへのアクセスを指定したユーザーとダッシュボードの共有を有効にすると、以下の Amazon Cognito リソースがアカウントに作成されることにご注意ください：Cognito ユーザープール、Cognito ユーザー、Cognito アプリクライアント、Cognito ID プール、IAM ロール。

**SSO プロバイダーを使用してダッシュボードを共有する際の注意点**

シングルサインオン (SSO) を使用して CloudWatch ダッシュボードを共有する場合、選択した SSO プロバイダーに登録されているユーザーには、共有されているアカウント内のすべてのダッシュボードにアクセスする権限が付与されます。また、この方法でダッシュボードの共有を無効にすると、すべてのダッシュボードの共有が自動的に解除されます。

**追加の参考資料：**

- AWS Observability Workshop の[ダッシュボードの共有](https://catalog.workshops.aws/observability/en-US/aws-native/dashboards/sharingdashboard)
- ブログ：[Share your Amazon CloudWatch Dashboards with anyone using AWS Single Sign-On](https://aws.amazon.com/jp/blogs/news/share-your-amazon-cloudwatch-dashboards-with-anyone-using-aws-single-sign-on/)
- ブログ：[Communicate monitoring information by sharing Amazon CloudWatch dashboards](https://aws.amazon.com/blogs/mt/communicate-monitoring-information-by-sharing-amazon-cloudwatch-dashboards/)



## ライブデータ

CloudWatch ダッシュボードは、ワークロードからのメトリクスが継続的に発行されている場合、メトリクスウィジェットを通じて[ライブデータ](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/cloudwatch-live-data.html)も表示します。
お客様は、ダッシュボード全体、またはダッシュボード上の個別のウィジェットに対してライブデータを有効にするかを選択できます。

ライブデータが**オフ**の場合、過去 1 分以上の集計期間を持つデータポイントのみが表示されます。
例えば、5 分間の期間を使用する場合、12:35 のデータポイントは 12:35 から 12:40 まで集計され、12:41 に表示されます。

ライブデータが**オン**の場合、対応する集計間隔内でデータが発行されるとすぐに、最新のデータポイントが表示されます。
表示を更新するたびに、その集計期間内に新しいデータが発行されると、最新のデータポイントが変更される可能性があります。



## アニメーション化されたダッシュボード

[アニメーション化されたダッシュボード](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/cloudwatch-animated-dashboard.html) は、時系列で収集された CloudWatch メトリクスデータを再生することで、お客様がトレンドを確認したり、プレゼンテーションを行ったり、問題発生後の分析を行うことができます。
ダッシュボードのアニメーション化されたウィジェットには、折れ線グラフ、積み上げ面グラフ、数値ウィジェット、メトリクスエクスプローラーウィジェットが含まれます。
円グラフ、棒グラフ、テキストウィジェット、ログウィジェットはダッシュボードに表示されますが、アニメーション化されません。



## CloudWatch ダッシュボードの API/CLI サポート

お客様は AWS マネジメントコンソールを通じて CloudWatch ダッシュボードにアクセスできるだけでなく、API、AWS コマンドラインインターフェイス (CLI)、AWS SDK を通じてもサービスにアクセスできます。
CloudWatch ダッシュボードの API は、AWS CLI を通じた自動化やソフトウェア/製品との統合を支援し、リソースやアプリケーションの管理や運用にかける時間を削減できます。

- [ListDashboards](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/APIReference/API_ListDashboards.html): アカウントのダッシュボード一覧を返します
- [GetDashboard](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/APIReference/API_GetDashboard.html): 指定したダッシュボードの詳細を表示します
- [DeleteDashboards](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/APIReference/API_DeleteDashboards.html): 指定したすべてのダッシュボードを削除します
- [PutDashboard](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/APIReference/API_PutDashboard.html): ダッシュボードが存在しない場合は作成し、既存のダッシュボードを更新します。ダッシュボードを更新すると、内容全体がここで指定した内容に置き換えられます

CloudWatch API リファレンスの [ダッシュボードの本文構造と構文](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/APIReference/CloudWatch-Dashboard-Body-Structure.html)

AWS Command Line Interface (AWS CLI) は、ブラウザベースの AWS マネジメントコンソールが提供する機能と同等の機能を、ターミナルプログラムのコマンドプロンプトから実装するコマンドラインシェルを使用して、AWS サービスと対話できるようにするオープンソースツールです。

CLI サポート:

- [list-dashboards](https://docs.aws.amazon.com/ja_jp/cli/latest/reference/cloudwatch/list-dashboards.html)
- [get-dashboard](https://docs.aws.amazon.com/ja_jp/cli/latest/reference/cloudwatch/get-dashboard.html)
- [delete-dashboards](https://docs.aws.amazon.com/ja_jp/cli/latest/reference/cloudwatch/delete-dashboards.html)
- [put-dashboard](https://docs.aws.amazon.com/ja_jp/cli/latest/reference/cloudwatch/put-dashboard.html)

**追加リファレンス:** [CloudWatch ダッシュボードと AWS CLI](https://catalog.workshops.aws/observability/en-US/aws-native/dashboards/createcli) に関する AWS オブザーバビリティワークショップ



## CloudWatch ダッシュボードの自動化

CloudWatch ダッシュボードの作成を自動化するために、お客様は CloudFormation や Terraform などの Infrastructure as Code (IaC) ツールを使用できます。これらのツールは AWS リソースのセットアップを支援し、お客様はリソースの管理に費やす時間を減らし、AWS で実行されるアプリケーションに集中できます。

[AWS CloudFormation](https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-dashboard.html) はテンプレートを通じてダッシュボードの作成をサポートしています。AWS::CloudWatch::Dashboard リソースは Amazon CloudWatch ダッシュボードを指定します。

[Terraform](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_dashboard) も IaC 自動化を通じて CloudWatch ダッシュボードを作成するモジュールを提供しています。

必要なウィジェットを使用してダッシュボードを手動で作成することは簡単です。しかし、Auto Scaling グループのスケールアウトやスケールインイベント中に作成または削除される EC2 インスタンスなど、動的な情報に基づくコンテンツの場合、リソースソースの更新には労力が必要になる場合があります。Amazon EventBridge と AWS Lambda を使用して [Amazon CloudWatch ダッシュボードを自動的に作成および更新](https://aws.amazon.com/blogs/mt/update-your-amazon-cloudwatch-dashboards-automatically-using-amazon-eventbridge-and-aws-lambda/) する方法については、ブログ記事を参照してください。

**参考ブログ記事：**

- [Amazon EBS ボリュームの KPI 用の Amazon CloudWatch ダッシュボード作成の自動化](https://aws.amazon.com/blogs/storage/automating-amazon-cloudwatch-dashboard-creation-for-amazon-ebs-volume-kpis/)
- [AWS Systems Manager と Ansible を使用した Amazon CloudWatch アラームとダッシュボードの作成の自動化](https://aws.amazon.com/blogs/mt/automate-creation-of-amazon-cloudwatch-alarms-and-dashboards-with-aws-systems-manager-and-ansible/)
- [AWS CDK を使用した AWS Outposts 用の自動化された Amazon CloudWatch ダッシュボードのデプロイ](https://aws.amazon.com/blogs/compute/deploying-an-automated-amazon-cloudwatch-dashboard-for-aws-outposts-using-aws-cdk/)

[CloudWatch ダッシュボード](https://aws.amazon.com/jp/cloudwatch/faqs/) に関する **製品 FAQ**
