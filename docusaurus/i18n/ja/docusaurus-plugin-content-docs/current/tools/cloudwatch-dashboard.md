# CloudWatch ダッシュボード

## はじめに

AWS アカウント内のリソースのインベントリ詳細、リソースのパフォーマンス、およびヘルスチェックを把握することは、安定したリソース管理にとって重要です。Amazon CloudWatch ダッシュボードは、CloudWatch コンソールでカスタマイズ可能なホームページであり、リソースが複数のアカウントにまたがっている場合や、異なるリージョンに分散している場合でも、単一のビューでリソースを監視するために使用できます。

[Amazon CloudWatch ダッシュボード](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Dashboards.html)を使用すると、再利用可能なグラフを作成し、クラウドリソースとアプリケーションを統合ビューで可視化できます。CloudWatch ダッシュボードを通じて、メトリクスとログデータを統合ビューで並べてグラフ化することで、コンテキストを素早く把握し、問題の診断から根本原因の理解へと移行し、平均復旧時間または解決時間 (MTTR) を短縮できます。たとえば、CPU 使用率やメモリなどの主要なメトリクスの現在の使用率を可視化し、割り当てられた容量と比較できます。また、特定のメトリクスのログパターンを関連付けて、パフォーマンスや運用上の問題についてアラートを設定することもできます。CloudWatch ダッシュボードは、アラームの現在のステータスを表示することで、迅速に可視化し、アクションのための注意を促すのにも役立ちます。CloudWatch ダッシュボードの共有により、表示されたダッシュボード情報を、組織内外のチームや関係者に簡単に共有できます。

## ウィジェット

#### デフォルトウィジェット

ウィジェットは CloudWatch ダッシュボードの構成要素であり、AWS 環境内のリソースやアプリケーションのメトリクスとログに関する重要な情報とほぼリアルタイムの詳細を表示します。お客様は、要件に応じてウィジェットを追加、削除、再配置、またはサイズ変更することで、ダッシュボードを希望する表示形式にカスタマイズできます。

ダッシュボードに追加できるグラフの種類には、Line、Number、Gauge、Stacked area、Bar、Pie があります。

**Line、Number、Gauge、Stacked area、Bar、Pie** などのデフォルトのウィジェットタイプは **Graph** タイプであり、**Text、Alarm Status、Logs table、Explorer** などの他のウィジェットも、メトリクスまたは Logs データを追加してダッシュボードを構築するために選択できます。

![Default Widgets](../images/cw_dashboards_widgets.png)

**関連リファレンス:**

- AWS Observability Workshop の[メトリクス数値ウィジェット](https://catalog.workshops.aws/observability/en-US/aws-native/dashboards/metrics-number)
- AWS Observability Workshop の[テキストウィジェット](https://catalog.workshops.aws/observability/en-US/aws-native/dashboards/text-widget)
- AWS Observability Workshop の[アラームウィジェット](https://catalog.workshops.aws/observability/en-US/aws-native/dashboards/alarm-widgets)
- [CloudWatch ダッシュボードでのウィジェットの作成と操作](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/create-and-work-with-widgets.html)に関するドキュメント

#### カスタムウィジェット

お客様は、CloudWatch ダッシュボードに[カスタムウィジェットを追加](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/create-and-work-with-widgets.html)して、カスタム可視化を体験したり、複数のソースからの情報を表示したり、CloudWatch ダッシュボードで直接アクションを実行するボタンなどのカスタムコントロールを追加したりすることもできます。カスタムウィジェットは Lambda 関数を利用した完全なサーバーレスで、コンテンツ、レイアウト、インタラクションを完全に制御できます。カスタムウィジェットは、複雑な Web フレームワークを学習する必要なく、ダッシュボード上にカスタムデータビューやツールを構築する簡単な方法です。Lambda でコードを記述し、HTML を作成できれば、便利なカスタムウィジェットを作成できます。

![Custom Widgets](../images/cw_dashboards_custom-widgets.png)

**関連リファレンス:**

- AWS Observability Workshop の[カスタムウィジェット](https://catalog.workshops.aws/observability/en-US/aws-native/dashboards/custom-widgets)
- GitHub の [CloudWatch Custom Widgets Samples](https://github.com/aws-samples/cloudwatch-custom-widgets-samples#what-are-custom-widgets)
- ブログ: [Amazon CloudWatch ダッシュボードのカスタムウィジェットの使用](https://aws.amazon.com/blogs/mt/introducing-amazon-cloudwatch-dashboards-custom-widgets/)

## 自動ダッシュボード

自動ダッシュボードは、すべての AWS パブリックリージョンで利用可能で、Amazon CloudWatch 配下のすべての AWS リソースの健全性とパフォーマンスの集約されたビューを提供します。これにより、お客様は監視を迅速に開始でき、メトリクスとアラームのリソースベースのビューを利用し、パフォーマンス問題の根本原因を簡単に掘り下げて理解できます。自動ダッシュボードは、AWS サービスが推奨する[ベストプラクティス](https://docs.aws.amazon.com/prescriptive-guidance/latest/implementing-logging-monitoring-cloudwatch/cloudwatch-dashboards-visualizations.html)で事前に構築されており、リソースを認識し、重要なパフォーマンスメトリクスの最新状態を反映するように動的に更新されます。自動サービスダッシュボードは、サービスのすべての標準 CloudWatch メトリクスを表示し、各サービスメトリクスに使用されるすべてのリソースをグラフ化し、お客様がアカウント全体で外れ値のリソースを迅速に特定できるようにします。これにより、使用率が高いまたは低いリソースを特定でき、コストの最適化に役立ちます。

![Automatic Dashboards](../images/automatic-dashboard.png)

**関連リファレンス:**

- AWS Observability Workshop の[自動ダッシュボード](https://catalog.workshops.aws/observability/en-US/aws-native/dashboards/autogen-dashboard)
- YouTube の[Amazon CloudWatch ダッシュボードを使用した AWS リソースのモニタリング](https://www.youtube.com/watch?v=I7EFLChc07M)

#### 自動ダッシュボードの Container Insights

[CloudWatch Container Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html) は、コンテナ化されたアプリケーションとマイクロサービスからメトリクスとログを収集、集約、要約します。Container Insights は、Amazon Elastic Container Service (Amazon ECS)、Amazon Elastic Kubernetes Service (Amazon EKS)、および Amazon EC2 上の Kubernetes プラットフォームで利用できます。Container Insights は、Amazon ECS と Amazon EKS の両方について、Fargate にデプロイされたクラスターからのメトリクス収集をサポートしています。CloudWatch は、CPU、メモリ、ディスク、ネットワークなどの多くのリソースのメトリクスを自動的に収集し、コンテナの再起動失敗などの診断情報も提供することで、問題を迅速に特定して解決できるようにします。

CloudWatch は、クラスター、ノード、ポッド、タスク、およびサービスレベルで集約されたメトリクスを、[埋め込みメトリクスフォーマット](/observability-best-practices/ja/guides/signal-collection/emf/)を使用して CloudWatch メトリクスとして作成します。これは、高カーディナリティデータを大規模に取り込んで保存できるようにする構造化 JSON スキーマを使用するパフォーマンスログイベントです。Container Insights が収集するメトリクスは、[CloudWatch 自動ダッシュボード](https://docs.aws.amazon.com/prescriptive-guidance/latest/implementing-logging-monitoring-cloudwatch/cloudwatch-dashboards-visualizations.html#use-automatic-dashboards)で利用でき、CloudWatch コンソールのメトリクスセクションでも表示できます。

![Container Insights](../images/Container_Insights_CW_Automatic_DB.png)

#### 自動ダッシュボードの Lambda Insights

[CloudWatch Lambda Insights](https://docs.aws.amazon.com/lambda/latest/dg/monitoring-insights.html) は、AWS Lambda などのサーバーレスアプリケーション向けのモニタリングおよびトラブルシューティングソリューションであり、Lambda 関数用の動的な[自動ダッシュボード](https://docs.aws.amazon.com/prescriptive-guidance/latest/implementing-logging-monitoring-cloudwatch/cloudwatch-dashboards-visualizations.html#use-automatic-dashboards)を作成します。また、CPU 時間、メモリ、ディスク、ネットワークなどのシステムレベルのメトリクスと、コールドスタートや Lambda ワーカーのシャットダウンなどの診断情報を収集、集約、要約し、Lambda 関数の問題を特定して迅速に解決するのに役立ちます。[Lambda Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Lambda-Insights.html) は、関数レベルでレイヤーとして提供される Lambda 拡張機能であり、有効にすると [embedded metric format](/observability-best-practices/ja/guides/signal-collection/emf/) を使用してログイベントからメトリクスを抽出し、エージェントを必要としません。

![Lambda Insights](../images/Lambda_Insights_CW_Automatic_DB.png)

## カスタムダッシュボード

お客様は、さまざまなウィジェットを使用して必要な数の追加ダッシュボードを作成し、それに応じてカスタマイズできる[カスタムダッシュボード](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/create_dashboard.html)を作成することもできます。ダッシュボードは、クロスリージョンおよびクロスアカウントビュー用に設定でき、お気に入りリストに追加できます。

![Custom Dashboards](../images/CustomDashboard.png)

お客様は、CloudWatch コンソールの[お気に入りリスト](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/add-dashboard-to-favorites.html)に自動ダッシュボードまたはカスタムダッシュボードを追加できます。これにより、コンソールページのナビゲーションペインから簡単にアクセスできるようになります。

**関連リファレンス:**

- [CloudWatch ダッシュボード](https://catalog.workshops.aws/observability/en-US/aws-native/dashboards/create)に関する AWS Observability Workshop
- [CloudWatch ダッシュボードによるモニタリング](https://www.wellarchitectedlabs.com/performance-efficiency/100_labs/100_monitoring_windows_ec2_cloudwatch/)に関するパフォーマンス効率のための AWS Well-Architected Labs

#### Contributor Insights を CloudWatch ダッシュボードに追加する

CloudWatch は[Contributor Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContributorInsights.html) を提供しており、ログデータを分析して、上位 N 件のコントリビューター、一意のコントリビューターの総数、およびそれらの使用状況に関するメトリクスを表示する時系列を作成できます。これにより、最も通信量の多い送信元を見つけ、システムパフォーマンスに影響を与えているのが誰または何であるかを把握できます。たとえば、顧客は不良ホストを見つけたり、最も多くのネットワークを使用しているユーザーを特定したり、最も多くのエラーを生成している URL を見つけたりできます。

Contributor Insights レポートは、CloudWatch コンソールの[新規または既存のダッシュボード](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContributorInsights-ViewReports.html)に追加できます。

![Contributor Insights](../images/Contributor_Insights_CW_DB.png)

#### Application Insights を CloudWatch ダッシュボードに追加する

[CloudWatch Application Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch-application-insights.html) は、AWS でホストされているアプリケーションとその基盤となる AWS リソースの可観測性を促進します。これにより、アプリケーションの健全性に対する可視性が向上し、アプリケーションの問題をトラブルシューティングする平均修復時間 (MTTR) の短縮に役立ちます。Application Insights は、監視対象のアプリケーションの潜在的な問題を示す自動化されたダッシュボードを提供し、顧客がアプリケーションとインフラストラクチャの進行中の問題を迅速に特定できるよう支援します。

以下に示すように、Application Insights 内の「Export to CloudWatch」オプションは、CloudWatch コンソールにダッシュボードを追加し、お客様が重要なアプリケーションのインサイトを簡単に監視できるようにします。

![Application Insights](../images/Application_Insights_CW_DB.png)

#### CloudWatch ダッシュボードへの Service Map の追加

[CloudWatch ServiceLens](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ServiceLens.html) は、トレース、メトリクス、ログ、アラーム、その他のリソースヘルス情報を 1 か所に統合することで、サービスとアプリケーションの可観測性を強化します。ServiceLens は CloudWatch と AWS X-Ray を統合し、アプリケーションのエンドツーエンドのビューを提供することで、お客様がパフォーマンスのボトルネックをより効率的に特定し、影響を受けるユーザーを識別できるようにします。[サービスマップ](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/servicelens_service_map.html)は、サービスエンドポイントとリソースをノードとして表示し、各ノードとその接続のトラフィック、レイテンシー、エラーを強調表示します。表示される各ノードは、サービスのその部分に関連付けられた相関メトリクス、ログ、トレースに関する詳細なインサイトを提供します。

以下に示すように、Service Map 内の「ダッシュボードに追加」オプションを使用すると、CloudWatch コンソールで新しいダッシュボードまたは既存のダッシュボードに追加でき、顧客がアプリケーションを簡単にトレースしてインサイトを得ることができます。

![Service Map](../images/Service_Map_CW_DB.png)

#### Metrics Explorer を CloudWatch ダッシュボードに追加する

CloudWatch の [Metrics explorer](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Metrics-Explorer.html) は、タグベースのツールであり、お客様がタグとリソースプロパティによってメトリクスをフィルタリング、集約、視覚化して、AWS サービスの可観測性を向上させることができます。Metrics explorer は柔軟で動的なトラブルシューティング体験を提供するため、お客様は一度に複数のグラフを作成し、これらのグラフを使用してアプリケーションヘルスダッシュボードを構築できます。Metrics explorer の視覚化は動的であるため、Metrics explorer ウィジェットを作成して CloudWatch ダッシュボードに追加した後に一致するリソースが作成された場合、新しいリソースは自動的に explorer ウィジェットに表示されます。

以下に示すように、Metrics Explorer 内の「[ダッシュボードに追加](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/add_metrics_explorer_dashboard.html)」オプションを使用すると、CloudWatch コンソールで新しいダッシュボードまたは既存のダッシュボードに追加でき、お客様が AWS サービスとリソースに関するグラフインサイトを簡単に取得できるようになります。

![Metrics Explorer](../images/Metrics_Explorer_CW_DB.png)

## CloudWatch ダッシュボードを使用して可視化する内容

お客様は、アカウントレベルおよびアプリケーションレベルでダッシュボードを作成し、リージョンやアカウントをまたいでワークロードとアプリケーションを監視できます。お客様は CloudWatch 自動ダッシュボードを使用してすぐに開始できます。これは、サービス固有のメトリクスで事前設定された AWS サービスレベルのダッシュボードです。本番環境のアプリケーションやワークロードに関連し、重要な主要メトリクスとリソースに焦点を当てた、アプリケーションおよびワークロード固有のダッシュボードを作成することをお勧めします。

#### メトリクスデータの可視化

メトリクスデータは、**折れ線、数値、ゲージ、積み上げ面、棒、円**などのグラフウィジェットを通じて CloudWatch ダッシュボードに追加できます。これらは、**平均、最小、最大、合計、サンプル数**によるメトリクスの統計によってサポートされています。[統計](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Statistics-definitions.html)は、指定された期間におけるメトリクスデータの集計です。

![Metrics Data Visual](../images/graph_widget_metrics.png)

[メトリクス演算](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/using-metric-math.html)を使用すると、複数の CloudWatch メトリクスをクエリし、数式を使用してこれらのメトリクスに基づいた新しい時系列を作成できます。お客様は、結果として得られる時系列を CloudWatch コンソールで可視化し、ダッシュボードに追加できます。また、お客様は [GetMetricDataAPI](https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_GetMetricData.html) オペレーションを使用して、プログラムでメトリクス演算を実行することもできます。

**追加リファレンス:**

- [CloudWatch を使用した IoT フリートのモニタリング](https://aws.amazon.com/blogs/iot/monitoring-your-iot-fleet-using-cloudwatch/)

#### ログデータの可視化

お客様は、CloudWatch ダッシュボードで棒グラフ、折れ線グラフ、積み上げ面グラフを使用して[ログデータの可視化](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_Insights-Visualizing-Log-Data.html)を実現し、パターンをより効率的に識別できます。CloudWatch Logs Insights は、stats 関数と棒グラフを生成できる 1 つ以上の集計関数を使用するクエリの可視化を生成します。クエリが bin() 関数を使用して時間経過に伴う 1 つのフィールドで[データをグループ化](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_Insights-Visualizing-Log-Data.html#CWL_Insights-Visualizing-ByFields)する場合、折れ線グラフと積み上げ面グラフを可視化に使用できます。

[時系列データ](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_Insights-Visualizing-Log-Data.html#CWL_Insights-Visualizing-TimeSeries)は、クエリに 1 つ以上のステータス関数の集計が含まれている場合、またはクエリが bin() 関数を使用して 1 つのフィールドでデータをグループ化している場合、特性を使用して可視化できます。

count() を統計関数として使用したサンプルクエリを以下に示します。

```java
filter @message like /GET/
| parse @message '_ - - _ "GET _ HTTP/1.0" .*.*.*' as ip, timestamp, page, status, responseTime, bytes
| stats count() as request_count by status
```

上記のクエリの結果は、CloudWatch Logs Insights に以下のように表示されます。

![CloudWatch Logs Insights](../images/widget_logs_1.png)

クエリ結果を円グラフとして視覚化したものを以下に示します。

![CloudWatch Logs Insights Visualization](../images/widget_logs_2.png)

**追加リファレンス:**

- CloudWatch ダッシュボードでの[ログ結果の表示](https://catalog.workshops.aws/observability/en-US/aws-native/logs/logsinsights/displayformats)に関する AWS Observability Workshop
- [Amazon CloudWatch ダッシュボードで AWS WAF ログを可視化する](https://aws.amazon.com/blogs/security/visualize-aws-waf-logs-with-an-amazon-cloudwatch-dashboard/)

#### アラームの可視化

CloudWatch のメトリクスアラームは、単一のメトリクスまたは CloudWatch メトリクスに基づく数式の結果を監視します。アラームは、一定期間におけるしきい値に対するメトリクスまたは数式の値に基づいて、1 つ以上のアクションを実行します。[CloudWatch ダッシュボード](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/add_remove_alarm_dashboard.html)には、ウィジェットに単一のアラームを追加でき、アラームのメトリクスのグラフとアラームステータスが表示されます。また、CloudWatch ダッシュボードにアラームステータスウィジェットを追加して、複数のアラームのステータスをグリッド形式で表示できます。アラーム名と現在のステータスのみが表示され、グラフは表示されません。

CloudWatch ダッシュボード内のアラームウィジェットでキャプチャされたサンプルメトリクスアラームステータスを以下に示します。

![CloudWatch Alarms](../images/widget_alarms.png)

## クロスアカウント & クロスリージョン

複数の AWS アカウントを持つお客様は、[CloudWatch クロスアカウント](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_crossaccount_dashboard.html)オブザーバビリティを設定し、中央監視アカウントでリッチなクロスアカウントダッシュボードを作成できます。これにより、アカウントの境界を越えてメトリクス、ログ、トレースをシームレスに検索、可視化、分析できます。

お客様は、[クロスアカウント・クロスリージョン](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_xaxr_dashboard.html)ダッシュボードを作成することもできます。これは、複数の AWS アカウントと複数のリージョンからの CloudWatch データを単一のダッシュボードに集約します。この高レベルのダッシュボードから、お客様はアプリケーション全体の統合ビューを取得でき、アカウントへのサインインとサインアウトやリージョン間の切り替えを行うことなく、より具体的なダッシュボードにドリルダウンすることもできます。

**関連リファレンス:**

- [中央の Amazon CloudWatch ダッシュボードに新しいクロスアカウント Amazon EC2 インスタンスを自動追加する方法](https://aws.amazon.com/blogs/mt/how-to-auto-add-new-cross-account-amazon-ec2-instances-in-a-central-amazon-cloudwatch-dashboard/)
- [マルチアカウント Amazon CloudWatch ダッシュボードをデプロイする](https://aws.amazon.com/blogs/mt/deploy-multi-account-amazon-cloudwatch-dashboards/)
- YouTube の[クロスアカウントおよびクロスリージョン CloudWatch ダッシュボードを作成する](https://www.youtube.com/watch?v=eIUZdaqColg)

## ダッシュボードの共有

CloudWatch ダッシュボードは、チーム間の人々、ステークホルダー、および AWS アカウントへの直接アクセス権を持たない組織外の人々と共有できます。これらの[共有ダッシュボード](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch-dashboard-sharing.html)は、チームエリア、監視センター、ネットワークオペレーションセンター (NOC) の大画面に表示したり、Wiki やパブリック Web ページに埋め込んだりすることもできます。

ダッシュボードを簡単かつ安全に共有するには、3 つの方法があります。

- ダッシュボードは[公開共有](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch-dashboard-sharing.html#share-cloudwatch-dashboard-public)できるため、リンクを持つすべてのユーザーがダッシュボードを表示できます。
- ダッシュボードは、ダッシュボードを表示できるユーザーの[特定のメールアドレスに共有](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch-dashboard-sharing.html#share-cloudwatch-dashboard-email-addresses)できます。これらの各ユーザーは、ダッシュボードを表示するために入力する独自のパスワードを作成します。
- ダッシュボードは、[シングルサインオン (SSO) プロバイダー](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch-dashboard-sharing.html#share-cloudwatch-dashboards-setup-SSO)を通じてアクセスできる AWS アカウント内で共有できます。

**ダッシュボードを公開で共有する際の注意事項**

CloudWatch ダッシュボードに機密情報や秘密情報が含まれている場合、ダッシュボードを公開で共有することは推奨されません。可能な限り、ダッシュボードを共有する際は、ユーザー名/パスワードまたはシングルサインオン (SSO) による認証を使用することが推奨されます。

ダッシュボードを一般公開すると、CloudWatch はダッシュボードをホストする Web ページへのリンクを生成します。Web ページを閲覧するすべてのユーザーは、一般公開されたダッシュボードのコンテンツも表示できます。Web ページは、リンクを通じて一時的な認証情報を提供し、共有するダッシュボード内のアラームとコントリビューターインサイトルールをクエリする API を呼び出すことができます。また、共有するダッシュボードに表示されていない場合でも、アカウント内のすべてのメトリクスとすべての EC2 インスタンスの名前とタグにアクセスできます。この情報を一般公開することが適切かどうかを検討することをお勧めします。

ダッシュボードの Web ページへの公開共有を有効にすると、アカウントに次の Amazon Cognito リソースが作成されることに注意してください。Cognito ユーザープール、Cognito アプリクライアント、Cognito ID プール、および IAM ロール。

**認証情報を使用してダッシュボードを共有する際の注意事項（ユーザー名とパスワードで保護されたダッシュボード）**

CloudWatch ダッシュボードに、ダッシュボードを共有するユーザーと共有したくない機密情報や秘密情報が含まれている場合、ダッシュボードの共有は推奨されません。

ダッシュボードの共有が有効になっている場合、CloudWatch はダッシュボードをホストする Web ページへのリンクを生成します。上記で指定したユーザーには、次のアクセス許可が付与されます。共有するダッシュボード内のアラームとコントリビューターインサイトルールに対する CloudWatch の読み取り専用アクセス許可、および共有するダッシュボードに表示されていない場合でも、アカウント内のすべてのメトリクスとすべての EC2 インスタンスの名前とタグに対するアクセス許可。共有するユーザーがこの情報を利用できるようにすることが適切かどうかを検討することをお勧めします。

Web ページへのアクセスのために指定したユーザーに対してダッシュボードの共有を有効にすると、アカウントに次の Amazon Cognito リソースが作成されることに注意してください。Cognito ユーザープール、Cognito ユーザー、Cognito アプリクライアント、Cognito Identity プール、および IAM ロール。

**SSO プロバイダーを使用してダッシュボードを共有する際の注意事項**

CloudWatch ダッシュボードがシングルサインオン (SSO) を使用して共有される場合、選択された SSO プロバイダーに登録されているユーザーは、共有されているアカウント内のすべてのダッシュボードにアクセスする権限が付与されます。また、この方法でダッシュボードの共有が無効化されると、すべてのダッシュボードが自動的に共有解除されます。

**関連リファレンス:**

- AWS Observability Workshop の[ダッシュボードの共有](https://catalog.workshops.aws/observability/en-US/aws-native/dashboards/sharingdashboard)
- ブログ: [AWS Single Sign-On を使用して Amazon CloudWatch ダッシュボードを誰とでも共有する](https://aws.amazon.com/blogs/mt/share-your-amazon-cloudwatch-dashboards-with-anyone-using-aws-single-sign-on/)
- ブログ: [Amazon CloudWatch ダッシュボードを共有してモニタリング情報を伝達する](https://aws.amazon.com/blogs/mt/communicate-monitoring-information-by-sharing-amazon-cloudwatch-dashboards/)

## ライブデータ

CloudWatch ダッシュボードは、ワークロードからメトリクスが継続的に発行されている場合、メトリクスウィジェットを通じて[ライブデータ](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch-live-data.html)も表示します。お客様は、ダッシュボード全体、またはダッシュボード上の個々のウィジェットに対してライブデータを有効にすることができます。

ライブデータが**オフ**の場合、過去の少なくとも 1 分間の集計期間を持つデータポイントのみが表示されます。たとえば、5 分間隔を使用している場合、12:35 のデータポイントは 12:35 から 12:40 まで集計され、12:41 に表示されます。

ライブデータが**オン**の場合、対応する集計間隔でデータが発行されるとすぐに、最新のデータポイントが表示されます。表示を更新するたびに、その集計期間内に新しいデータが発行されると、最新のデータポイントが変わる可能性があります。

## アニメーションダッシュボード

[アニメーション化されたダッシュボード](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch-animated-dashboard.html)は、時間の経過とともにキャプチャされた CloudWatch メトリクスデータを再生します。これにより、トレンドの確認、プレゼンテーションの作成、または発生後の問題の分析が可能になります。ダッシュボード内のアニメーション化されたウィジェットには、折れ線ウィジェット、積み上げ面グラフウィジェット、数値ウィジェット、およびメトリクスエクスプローラーウィジェットが含まれます。円グラフ、棒グラフ、テキストウィジェット、およびログウィジェットはダッシュボードに表示されますが、アニメーション化されません。

## CloudWatch Dashboard の API/CLI サポート

AWS Management Console を通じて CloudWatch ダッシュボードにアクセスする以外に、お客様は API、AWS コマンドラインインターフェイス (CLI)、および AWS SDK を介してサービスにアクセスすることもできます。ダッシュボード用の CloudWatch API は、AWS CLI を通じた自動化や、ソフトウェア/製品との統合を支援し、リソースやアプリケーションの管理や運用に費やす時間を削減できます。

- [ListDashboards](https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_ListDashboards.html): アカウントのダッシュボードのリストを返します
- [GetDashboard](https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_GetDashboard.html): 指定したダッシュボードの詳細を表示します。
- [DeleteDashboards](https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_DeleteDashboards.html): 指定したすべてのダッシュボードを削除します。
- [PutDashboard](https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_PutDashboard.html): ダッシュボードがまだ存在しない場合は作成し、既存のダッシュボードがある場合は更新します。ダッシュボードを更新すると、コンテンツ全体がここで指定した内容に置き換えられます。

CloudWatch API リファレンスの[ダッシュボード本文の構造と構文](https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/CloudWatch-Dashboard-Body-Structure.html)を参照してください。

AWS Command Line Interface (AWS CLI) は、コマンドラインシェルでコマンドを使用して AWS サービスと対話できるオープンソースツールです。ターミナルプログラムのコマンドプロンプトから、ブラウザベースの AWS Management Console が提供する機能と同等の機能を実装します。

CLI サポート

- [list-dashboards](https://docs.aws.amazon.com/cli/latest/reference/cloudwatch/list-dashboards.html)
- [get-dashboard](https://docs.aws.amazon.com/cli/latest/reference/cloudwatch/get-dashboard.html)
- [delete-dashboards](https://docs.aws.amazon.com/cli/latest/reference/cloudwatch/delete-dashboards.html)
- [put-dashboard](https://docs.aws.amazon.com/cli/latest/reference/cloudwatch/put-dashboard.html)

**追加リファレンス:** [CloudWatch ダッシュボードと AWS CLI](https://catalog.workshops.aws/observability/en-US/aws-native/dashboards/createcli) に関する AWS Observability Workshop

## CloudWatch ダッシュボードの自動化

CloudWatch ダッシュボードの作成を自動化するために、お客様は CloudFormation や Terraform などの Infrastructure as a Code (IaaC) ツールを使用できます。これらのツールは AWS リソースのセットアップを支援し、お客様がリソースの管理に費やす時間を削減し、AWS で実行されるアプリケーションにより多くの時間を集中できるようにします。

[AWS CloudFormation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-dashboard.html) は、テンプレートを通じたダッシュボードの作成をサポートしています。AWS::CloudWatch::Dashboard リソースは、Amazon CloudWatch ダッシュボードを指定します。

[Terraform](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_dashboard) には、IaaC 自動化を通じて CloudWatch ダッシュボードの作成をサポートするモジュールもあります。

目的のウィジェットを使用してダッシュボードを手動で作成することは簡単です。ただし、Auto Scaling グループのスケールアウトおよびスケールインイベント中に作成または削除される EC2 インスタンスなど、動的な情報に基づいてコンテンツを作成する場合、リソースソースを更新するには多少の労力が必要になることがあります。Amazon EventBridge と AWS Lambda を使用して [Amazon CloudWatch ダッシュボードを自動的に作成および更新](https://aws.amazon.com/blogs/mt/update-your-amazon-cloudwatch-dashboards-automatically-using-amazon-eventbridge-and-aws-lambda/)する方法については、ブログ記事を参照してください。

**参考ブログ:**

- [Amazon EBS ボリューム KPI の Amazon CloudWatch ダッシュボード作成の自動化](https://aws.amazon.com/blogs/storage/automating-amazon-cloudwatch-dashboard-creation-for-amazon-ebs-volume-kpis/)
- [AWS Systems Manager と Ansible を使用した Amazon CloudWatch アラームとダッシュボードの作成の自動化](https://aws.amazon.com/blogs/mt/automate-creation-of-amazon-cloudwatch-alarms-and-dashboards-with-aws-systems-manager-and-ansible/)
- [AWS CDK を使用した AWS Outposts 向け Amazon CloudWatch ダッシュボードの自動デプロイ](https://aws.amazon.com/blogs/compute/deploying-an-automated-amazon-cloudwatch-dashboard-for-aws-outposts-using-aws-cdk/)

[CloudWatch ダッシュボード](https://aws.amazon.com/cloudwatch/faqs/#Dashboards)の**製品 FAQ**
