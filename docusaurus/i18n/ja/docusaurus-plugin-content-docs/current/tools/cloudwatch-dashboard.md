# CloudWatch ダッシュボード

## はじめに

AWS アカウントのリソースの在庫詳細、リソースのパフォーマンス、ヘルスチェックを把握することは、安定したリソース管理に重要です。Amazon CloudWatch ダッシュボードは、CloudWatch コンソールのカスタマイズ可能なホームページで、アカウントをまたがるリソースや、さまざまなリージョンに分散したリソースを単一のビューで監視できます。

[Amazon CloudWatch ダッシュボード](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Dashboards.html) を使えば、再利用可能なグラフを作成し、クラウドリソースやアプリケーションを統合ビューで視覚化できます。CloudWatch ダッシュボードを通じて、お客様はメトリクスとログデータを統合ビューで並べて表示でき、問題の診断から根本原因の理解までの時間を短縮し、平均復旧時間 (MTTR) を減らすことができます。たとえば、お客様は CPU 使用率やメモリ使用率などの主要メトリクスの現在の使用状況を視覚化し、割り当てられた容量と比較できます。また、特定のメトリクスのログパターンを相関させ、パフォーマンスや運用上の問題に対するアラームを設定できます。CloudWatch ダッシュボードを使えば、アラームの現在の状態を表示し、対処が必要な状況を素早く視覚化して注意を喚起できます。CloudWatch ダッシュボードを共有すれば、組織内外のチームやステークホルダーと表示されているダッシュボード情報を簡単に共有できます。

## ウィジェット

#### デフォルトのウィジェット

ウィジェットは、AWS 環境のリソースやアプリケーションのメトリクスとログの重要な情報やリアルタイムの詳細を表示する CloudWatch ダッシュボードの構成要素です。お客様は、要件に応じてウィジェットを追加、削除、並べ替え、サイズ変更することで、ダッシュボードをカスタマイズできます。

ダッシュボードに追加できるグラフの種類には、折れ線、数値、ゲージ、積み上げ面、棒、円があります。

**折れ線、数値、ゲージ、積み上げ面、棒、円** などの **グラフ** タイプのデフォルトウィジェットと、**テキスト、アラームステータス、ログテーブル、エクスプローラー** などのウィジェットがあり、お客様はメトリクスやログデータを追加してダッシュボードを作成するためにこれらを選択できます。

![Default Widgets](../images/cw_dashboards_widgets.png)

**追加の参考資料:**

- AWS Observability ワークショップの [Metric Number Widgets](https://catalog.workshops.aws/observability/en-US/aws-native/dashboards/metrics-number)
- AWS Observability ワークショップの [Text Widgets](https://catalog.workshops.aws/observability/en-US/aws-native/dashboards/text-widget)
- AWS Observability ワークショップの [Alarm Widgets](https://catalog.workshops.aws/observability/en-US/aws-native/dashboards/alarm-widgets)
- [CloudWatch ダッシュボードでのウィジェットの作成と操作](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/create-and-work-with-widgets.html)に関するドキュメント

#### カスタムウィジェット

お客様は、CloudWatch ダッシュボードで[カスタムウィジェットを追加](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/create-and-work-with-widgets.html)することで、カスタム可視化を体験したり、複数のソースからの情報を表示したり、CloudWatch ダッシュボード内で直接アクションを実行するためのボタンなどのカスタムコントロールを追加することができます。カスタムウィジェットは完全にサーバーレスで、Lambda 関数によって動作し、コンテンツ、レイアウト、インタラクションを完全に制御できます。カスタムウィジェットは、複雑な Web フレームワークを学ぶ必要がなく、ダッシュボード上にカスタムデータビューやツールを簡単に構築できます。Lambda でコードを書いて HTML を作成できれば、便利なカスタムウィジェットを作成できます。

![Custom Widgets](../images/cw_dashboards_custom-widgets.png)

**追加リファレンス:**

- [カスタムウィジェット](https://catalog.workshops.aws/observability/en-US/aws-native/dashboards/custom-widgets)に関する AWS Observability ワークショップ
- GitHub の [CloudWatch カスタムウィジェットサンプル](https://github.com/aws-samples/cloudwatch-custom-widgets-samples#what-are-custom-widgets)
- ブログ: [Amazon CloudWatch ダッシュボードのカスタムウィジェットを使用する](https://aws.amazon.com/blogs/mt/introducing-amazon-cloudwatch-dashboards-custom-widgets/)

## 自動ダッシュボード

自動ダッシュボードは、Amazon CloudWatch の下にあるすべての AWS リソースの健全性とパフォーマンスの集約ビューを提供する、すべての AWS パブリックリージョンで利用可能です。これにより、お客様は監視を素早く開始し、リソースベースのメトリクスとアラームを確認し、パフォーマンス問題の根本原因を簡単に掘り下げて理解することができます。自動ダッシュボードは、AWS サービスの推奨される [ベストプラクティス](https://docs.aws.amazon.com/ja_jp/prescriptive-guidance/latest/implementing-logging-monitoring-cloudwatch/cloudwatch-dashboards-visualizations.html) に基づいて事前構築されており、リソースを認識し、重要なパフォーマンスメトリクスの最新の状態を反映するように動的に更新されます。自動サービスダッシュボードには、サービスのすべての標準 CloudWatch メトリクスが表示され、各サービスメトリクスで使用されるすべてのリソースがグラフ化され、アカウント全体で異常なリソースを素早く特定できるため、高利用率または低利用率のリソースを特定し、コストを最適化するのに役立ちます。

![自動ダッシュボード](../images/automatic-dashboard.png)

**追加の参考資料:**

- [自動ダッシュボード](https://catalog.workshops.aws/observability/en-US/aws-native/dashboards/autogen-dashboard) に関する AWS Observability ワークショップ
- YouTube の [Amazon CloudWatch ダッシュボードを使用して AWS リソースを監視する](https://www.youtube.com/watch?v=I7EFLChc07M)

#### 自動ダッシュボードでの Container Insights

[CloudWatch Container Insights](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/ContainerInsights.html) は、コンテナ化されたアプリケーションやマイクロサービスからメトリクスとログを収集、集約、要約します。Container Insights は、Amazon Elastic Container Service (Amazon ECS)、Amazon Elastic Kubernetes Service (Amazon EKS)、および Amazon EC2 上の Kubernetes プラットフォームで利用できます。Container Insights は、Amazon ECS と Amazon EKS の両方で Fargate 上にデプロイされたクラスターからメトリクスを収集することをサポートしています。CloudWatch は、CPU、メモリ、ディスク、ネットワークなど、多くのリソースのメトリクスを自動的に収集し、コンテナの再起動失敗などの診断情報も提供して、問題を迅速に特定して解決するのに役立ちます。

CloudWatch は、[埋め込みメトリックフォーマット](https://aws-observability.github.io/observability-best-practices/guides/signal-collection/emf/) を使用して、クラスター、ノード、Pod、タスク、サービスレベルで集約メトリクスを CloudWatch メトリクスとして作成します。埋め込みメトリックフォーマットは、構造化された JSON スキーマを使用したパフォーマンスログイベントで、高い基数のデータを大規模に取り込んで保存できます。Container Insights が収集するメトリクスは、[CloudWatch 自動ダッシュボード](https://docs.aws.amazon.com/ja_jp/prescriptive-guidance/latest/implementing-logging-monitoring-cloudwatch/cloudwatch-dashboards-visualizations.html)で確認でき、CloudWatch コンソールの Metrics セクションでも表示できます。

![Container Insights](../images/Container_Insights_CW_Automatic_DB.png)

#### 自動ダッシュボードでの Lambda Insights

[CloudWatch Lambda Insights](https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/monitoring-insights.html) は、AWS Lambda などのサーバーレスアプリケーションの監視とトラブルシューティングのソリューションで、Lambda 関数の動的な[自動ダッシュボード](https://docs.aws.amazon.com/ja_jp/prescriptive-guidance/latest/implementing-logging-monitoring-cloudwatch/cloudwatch-dashboards-visualizations.html)を作成します。また、CPU 時間、メモリ、ディスク、ネットワーク、コールドスタートや Lambda ワーカーのシャットダウンなどの診断情報を含むシステムレベルのメトリクスを収集、集約、要約し、Lambda 関数の問題を特定して迅速に解決するのに役立ちます。[Lambda Insights](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/Lambda-Insights.html) は、関数レベルでレイヤーとして提供される Lambda 拡張機能で、有効にすると[埋め込みメトリクスフォーマット](https://aws-observability.github.io/observability-best-practices/guides/signal-collection/emf/)を使用してログイベントからメトリクスを抽出し、エージェントは不要です。

![Lambda Insights](../images/Lambda_Insights_CW_Automatic_DB.png)

## カスタムダッシュボード

お客様は、必要な数だけ [カスタムダッシュボード](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/create_dashboard.html) を作成し、さまざまなウィジェットをカスタマイズできます。ダッシュボードは、リージョンやアカウントをまたいで表示でき、お気に入りリストに追加できます。

![Custom Dashboards](../images/CustomDashboard.png)

お客様は、CloudWatch コンソールで自動ダッシュボードやカスタムダッシュボードを [お気に入りリスト](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/add-dashboard-to-favorites.html) に追加できるので、コンソールページのナビゲーションペインからすばやく簡単にアクセスできます。

**追加の参考資料:**

- CloudWatch ダッシュボードに関する [AWS Observability ワークショップ](https://catalog.workshops.aws/observability/en-US/aws-native/dashboards/create)
- CloudWatch ダッシュボードを使ったモニタリングに関する [AWS Well-Architected Labs の Performance Efficiency](https://www.wellarchitectedlabs.com/performance-efficiency/100_labs/100_monitoring_windows_ec2_cloudwatch/)

#### CloudWatch ダッシュボードに Contributor Insights を追加する

CloudWatch には [Contributor Insights](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/ContributorInsights.html) があり、ログデータを分析し、コントリビューターデータを表示する時系列を作成できます。ここでは、トップ N のコントリビューター、一意のコントリビューターの総数、およびそれらの使用状況に関するメトリクスを確認できます。これにより、トップトーカーを見つけ、システムパフォーマンスに影響を与えているものを把握できます。たとえば、顧客は不良ホストを見つけたり、最も大量のネットワークユーザーを特定したり、最も多くのエラーを生成する URL を見つけたりできます。

Contributor Insights レポートは、CloudWatch コンソールの [新規または既存のダッシュボード](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/ContributorInsights-ViewReports.html) に追加できます。

![Contributor Insights](../images/Contributor_Insights_CW_DB.png)

#### CloudWatch ダッシュボードへの Application Insights の追加

[CloudWatch Application Insights](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/cloudwatch-application-insights.html) は、AWS 上でホストされているアプリケーションとそのアンダーライングの AWS リソースのオブザーバビリティを容易にします。これにより、アプリケーションの健全性の可視化が向上し、アプリケーションの問題のトラブルシューティングにかかる平均修復時間 (MTTR) を短縮できます。Application Insights は、監視対象のアプリケーションの潜在的な問題を示す自動ダッシュボードを提供し、お客様がアプリケーションとインフラストラクチャの継続的な問題を迅速に特定できるようサポートします。

以下に示すように、Application Insights 内の 'Export to CloudWatch' オプションは、CloudWatch コンソールにダッシュボードを追加し、お客様が重要なアプリケーションの洞察を簡単に監視できるようサポートします。

![Application Insights](../images/Application_Insights_CW_DB.png)

#### CloudWatch ダッシュボードへのサービスマップの追加

[CloudWatch ServiceLens](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/ServiceLens.html) は、トレース、メトリクス、ログ、アラーム、その他のリソースの正常性情報を 1 か所に統合することで、サービスやアプリケーションのオブザーバビリティを強化します。ServiceLens は CloudWatch と AWS X-Ray を統合し、アプリケーションのエンドツーエンドビューを提供することで、パフォーマンスのボトルネックを効率的に特定し、影響を受けるユーザーを特定するのに役立ちます。[サービスマップ](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/servicelens_service_map.html) は、サービスエンドポイントとリソースをノードとして表示し、各ノードとその接続におけるトラフィック、レイテンシ、エラーを強調表示します。表示されている各ノードは、そのサービスの部分に関連付けられたメトリクス、ログ、トレースについての詳細な洞察を提供します。

下図のようにサービスマップ内の 'Add to dashboard' オプションは、CloudWatch コンソールに新しいダッシュボードを追加するか、既存のダッシュボードに追加することができ、お客様がアプリケーションの洞察を簡単にトレースできるようサポートします。

![Service Map](../images/Service_Map_CW_DB.png)

#### CloudWatch ダッシュボードへの Metrics Explorer の追加

CloudWatch の [Metrics Explorer](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-Metrics-Explorer.html) は、タグとリソースプロパティでメトリクスをフィルタリング、集約、可視化できるタグベースのツールです。これにより、AWS サービスのオブザーバビリティが強化されます。Metrics Explorer は柔軟で動的なトラブルシューティング体験を提供するため、お客様は一度に複数のグラフを作成し、これらのグラフを使ってアプリケーションの正常性ダッシュボードを構築できます。Metrics Explorer の可視化は動的なので、Metrics Explorer ウィジェットを作成してCloudWatch ダッシュボードに追加した後にマッチするリソースが作成された場合、新しいリソースが自動的にエクスプローラーウィジェットに表示されます。

下図のように、Metrics Explorer 内の '[Add to dashboard](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/add_metrics_explorer_dashboard.html)' オプションは、CloudWatch コンソールに新しいダッシュボードを追加したり、既存のダッシュボードに追加したりできます。これにより、お客様は AWS サービスとリソースに関するグラフの洞察をより簡単に得ることができます。

![Metrics Explorer](../images/Metrics_Explorer_CW_DB.png)

## CloudWatch ダッシュボードを使って何を可視化するか

お客様は、アカウントレベルとアプリケーションレベルでダッシュボードを作成し、リージョンやアカウントにまたがるワークロードやアプリケーションを監視できます。
CloudWatch の自動ダッシュボードを使えば、サービス固有のメトリクスが事前設定された AWS サービスレベルのダッシュボードから簡単に始められます。
本番環境のアプリケーションやワークロードに関連し、重要な主要メトリクスとリソースに焦点を当てたアプリケーションおよびワークロード固有のダッシュボードを作成することをお勧めします。

#### メトリクスデータの可視化

メトリクスデータは、**平均、最小、最大、合計、サンプルカウント** によるメトリクスの統計を利用して、**折れ線グラフ、数値、ゲージ、積み上げ面グラフ、棒グラフ、円グラフ** などの CloudWatch ダッシュボードのグラフウィジェットに追加できます。[統計](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/Statistics-definitions.html) は、指定された期間のメトリクスデータの集計です。

![Metrics Data Visual](../images/graph_widget_metrics.png)

[Metric Math](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/using-metric-math.html) を使用すると、複数の CloudWatch メトリクスを照会し、これらのメトリクスに基づいて新しい時系列を作成する数式を使用できます。お客様は、結果の時系列を CloudWatch コンソールで可視化し、ダッシュボードに追加できます。お客様は、[GetMetricDataAPI](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/APIReference/API_GetMetricData.html) 操作を使用してプログラムでも Metric Math を実行できます。

**追加リファレンス:**

- [Monitoring your IoT fleet using CloudWatch](https://aws.amazon.com/blogs/iot/monitoring-your-iot-fleet-using-cloudwatch/)

#### ログデータの可視化

お客様は、CloudWatch ダッシュボードでバーチャート、ラインチャート、スタックエリアチャートを使用して、パターンを効率的に特定するためのログデータの[可視化](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/CWL_Insights-Visualizing-Log-Data.html)を実現できます。CloudWatch Logs Insights は、stats 関数と 1 つ以上の集計関数を使用するクエリに対してバーチャートの可視化を生成します。クエリが bin() 関数を使用して[時間経過に従ってデータを 1 つのフィールドでグループ化](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/CWL_Insights-Visualizing-Log-Data.html)する場合、ラインチャートとスタックエリアチャートを可視化に使用できます。

クエリが 1 つ以上のステータス関数の集計を含む場合、または bin() 関数を使用してデータを 1 つのフィールドでグループ化する場合、[時系列データ](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/CWL_Insights-Visualizing-Log-Data.html)を特性を使って可視化できます。

stats 関数として count() を使用したサンプルクエリを以下に示します。

```java
filter @message like /GET/
| parse @message '_ - - _ "GET _ HTTP/1.0" .*.*.*' as ip, timestamp, page, status, responseTime, bytes
| stats count() as request_count by status
```

上記のクエリに対する結果は、CloudWatch Logs Insights で以下のように表示されます。

![CloudWatch Logs Insights](../images/widget_logs_1.png)

クエリ結果の円グラフによる可視化を以下に示します。

![CloudWatch Logs Insights Visualization](../images/widget_logs_2.png)

**追加の参考資料:**

- CloudWatch ダッシュボードでの[ログ結果の表示](https://catalog.workshops.aws/observability/en-US/aws-native/logs/logsinsights/displayformats)に関する AWS Observability ワークショップ。
- [Amazon CloudWatch ダッシュボードで AWS WAF ログを可視化する](https://aws.amazon.com/blogs/security/visualize-aws-waf-logs-with-an-amazon-cloudwatch-dashboard/)

#### アラームの可視化

CloudWatch のメトリックアラームは、単一のメトリクスまたは CloudWatch メトリクスに基づく数式の結果を監視します。アラームは、一定期間にわたってメトリクスまたは式の値がしきい値に対して相対的に変化することに基づいて、1 つ以上のアクションを実行します。[CloudWatch ダッシュボード](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/add_remove_alarm_dashboard.html)には、ウィジェットに単一のアラームを追加でき、そのウィジェットにはアラームのメトリクスのグラフとアラームのステータスが表示されます。また、CloudWatch ダッシュボードにアラームステータスウィジェットを追加すると、複数のアラームのステータスがグリッド上に表示されます。表示されるのはアラーム名と現在のステータスのみで、グラフは表示されません。

CloudWatch ダッシュボード内のアラームウィジェットに表示されたメトリックアラームのステータスサンプルを以下に示します。

![CloudWatch Alarms](../images/widget_alarms.png)

## クロスアカウント & クロスリージョン

複数の AWS アカウントを持つお客様は、[CloudWatch クロスアカウント](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/cloudwatch_crossaccount_dashboard.html)のオブザーバビリティを設定し、中央監視アカウントでリッチなクロスアカウントダッシュボードを作成できます。このダッシュボードを通じて、アカウントの境界なくメトリクス、ログ、トレースをシームレスに検索、可視化、分析できます。

お客様はまた、[クロスアカウントクロスリージョン](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/cloudwatch_xaxr_dashboard.html)ダッシュボードを作成でき、複数の AWS アカウントと複数のリージョンからの CloudWatch データを 1 つのダッシュボードにまとめることができます。この高レベルのダッシュボードから、アプリケーション全体の統一ビューを得ることができ、アカウントへのサインイン/サインアウトやリージョン間の切り替えをすることなく、より具体的なダッシュボードにドリルダウンすることもできます。

**追加の参考資料:**

- [How to auto add new cross-account Amazon EC2 instances in a central Amazon CloudWatch dashboard](https://aws.amazon.com/blogs/mt/how-to-auto-add-new-cross-account-amazon-ec2-instances-in-a-central-amazon-cloudwatch-dashboard/)
- [Deploy Multi-Account Amazon CloudWatch Dashboards](https://aws.amazon.com/blogs/mt/deploy-multi-account-amazon-cloudwatch-dashboards/)
- [Create Cross Account & Cross Region CloudWatch Dashboards](https://www.youtube.com/watch?v=eIUZdaqColg) on YouTube

## ダッシュボードの共有

CloudWatch ダッシュボードは、チーム間、ステークホルダー、AWS アカウントへの直接アクセスがない組織外の人々と共有できます。これらの[共有ダッシュボード](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/cloudwatch-dashboard-sharing.html)は、チームエリア、監視センター、ネットワークオペレーションセンター (NOC) の大画面に表示したり、Wiki やパブリックウェブページに埋め込むこともできます。

ダッシュボードを簡単かつ安全に共有するには、3 つの方法があります。

- ダッシュボードを[パブリックに共有](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/cloudwatch-dashboard-sharing.html)して、リンクを持つ誰でもダッシュボードを閲覧できるようにする。
- ダッシュボードを[特定のメールアドレス](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/cloudwatch-dashboard-sharing.html)と共有し、それらのユーザーがダッシュボードを閲覧するためのパスワードを作成する。
- ダッシュボードを [シングルサインオン (SSO) プロバイダ](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/cloudwatch-dashboard-sharing.html)経由で AWS アカウント内で共有する。

**ダッシュボードをパブリックに共有する際の注意点**

ダッシュボードに機密情報が含まれる場合、CloudWatch ダッシュボードをパブリックに共有することは推奨されません。可能な限り、ユーザー名/パスワードまたはシングルサインオン (SSO) による認証を使用してダッシュボードを共有することをお勧めします。

ダッシュボードをパブリック アクセス可能にすると、CloudWatch はダッシュボードをホストするウェブページへのリンクを生成します。このウェブページを閲覧する人は、パブリックに共有されたダッシュボードの内容も見ることができます。このウェブページは、共有するダッシュボードのアラームと Contributor Insights ルールを照会するための一時的な認証情報と、共有するダッシュボードに表示されていなくても、アカウント内のすべてのメトリクスと EC2 インスタンスの名前とタグを照会するための認証情報を提供します。この情報をパブリックに公開することが適切かどうかを検討することをお勧めします。

ダッシュボードをウェブページでパブリックに共有できるようにすると、アカウントに次の Amazon Cognito リソースが作成されます: Cognito ユーザープール、Cognito アプリクライアント、Cognito ID プール、IAM ロール。

**資格情報 (ユーザー名とパスワードで保護されたダッシュボード) を使用してダッシュボードを共有する際の注意点**

ダッシュボードに、共有したくない機密情報が含まれている場合は、CloudWatch ダッシュボードを共有することは推奨されません。

ダッシュボードの共有が有効になると、CloudWatch はダッシュボードをホストするウェブページへのリンクを生成します。上記で指定したユーザーには、次の権限が付与されます: 共有するダッシュボードのアラームと Contributor Insights ルールに対する CloudWatch の読み取り専用アクセス権限、および共有するダッシュボードに表示されていなくても、アカウント内のすべてのメトリクスと EC2 インスタンスの名前とタグへのアクセス権限。この情報を共有ユーザーと共有することが適切かどうかを検討することをお勧めします。

ウェブページへのアクセスを指定したユーザーとダッシュボードを共有できるようにすると、アカウントに次の Amazon Cognito リソースが作成されます: Cognito ユーザープール、Cognito ユーザー、Cognito アプリクライアント、Cognito ID プール、IAM ロール。

**シングルサインオン (SSO) プロバイダを使用してダッシュボードを共有する際の注意点**

CloudWatch ダッシュボードをシングルサインオン (SSO) で共有すると、選択した SSO プロバイダに登録されているユーザーにはそのアカウントのすべてのダッシュボードへのアクセス権限が付与されます。また、この方法でダッシュボードの共有が無効になると、すべてのダッシュボードの共有が自動的に解除されます。

**追加リソース:**

- [ダッシュボードの共有](https://catalog.workshops.aws/observability/en-US/aws-native/dashboards/sharingdashboard)に関する AWS Observability ワークショップ
- ブログ: [AWS Single Sign-On を使用して Amazon CloudWatch ダッシュボードを誰とでも共有する](https://aws.amazon.com/jp/blogs/news/share-your-amazon-cloudwatch-dashboards-with-anyone-using-aws-single-sign-on/)
- ブログ: [Amazon CloudWatch ダッシュボードを共有して監視情報を伝える](https://aws.amazon.com/blogs/mt/communicate-monitoring-information-by-sharing-amazon-cloudwatch-dashboards/)

## ライブデータ

CloudWatch ダッシュボードでは、ワークロードからのメトリクスが常に公開されている場合、メトリックウィジェットを通じて[ライブデータ](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/cloudwatch-live-data.html)も表示されます。お客様は、ダッシュボード全体またはダッシュボード上の個々のウィジェットに対してライブデータを有効にすることができます。

ライブデータが **オフ** の場合、過去 1 分以上の集約期間のデータポイントのみが表示されます。たとえば、5 分間隔を使用する場合、12:35 のデータポイントは 12:35 から 12:40 の間で集約され、12:41 に表示されます。

ライブデータが **オン** の場合、対応する集約間隔でデータが公開されるとすぐに、最新のデータポイントが表示されます。表示を更新するたびに、その集約期間内で新しいデータが公開されると、最新のデータポイントが変更される可能性があります。

## アニメーション ダッシュボード

[アニメーション ダッシュボード](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/cloudwatch-animated-dashboard.html) は、時間の経過とともに取得された CloudWatch メトリクスデータを再生します。これにより、トレンドを確認したり、プレゼンテーションを行ったり、発生後の問題を分析したりできます。ダッシュボードのアニメーションウィジェットには、折れ線グラフ、積み上げ面グラフ、数値ウィジェット、メトリクスエクスプローラーウィジェットがあります。円グラフ、棒グラフ、テキストウィジェット、ログウィジェットはダッシュボードに表示されますが、アニメーション表示はされません。

## CloudWatch ダッシュボードの API/CLI サポート

お客様は AWS マネジメントコンソールから CloudWatch ダッシュボードにアクセスできるだけでなく、API、AWS コマンドラインインターフェイス (CLI)、AWS SDK からもアクセスできます。ダッシュボードの CloudWatch API は、AWS CLI を通して自動化したり、ソフトウェア/製品と統合したりするのに役立ち、リソースやアプリケーションの管理や運用にかかる時間を節約できます。

- [ListDashboards](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/APIReference/API_ListDashboards.html): アカウントのダッシュボードのリストを返します。
- [GetDashboard](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/APIReference/API_GetDashboard.html): 指定したダッシュボードの詳細を表示します。
- [DeleteDashboards](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/APIReference/API_DeleteDashboards.html): 指定したすべてのダッシュボードを削除します。
- [PutDashboard](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/APIReference/API_PutDashboard.html): ダッシュボードが存在しない場合は作成し、既存のダッシュボードを更新します。ダッシュボードを更新する場合、ここで指定した内容で全体が置き換えられます。

CloudWatch API リファレンスの [ダッシュボードの構造と構文](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/APIReference/CloudWatch-Dashboard-Body-Structure.html)

AWS コマンドラインインターフェイス (AWS CLI) は、ターミナルプログラムのコマンドプロンプトから、ブラウザベースの AWS マネジメントコンソールと同等の機能を実装するコマンドを使用して AWS サービスと対話できるオープンソースツールです。

CLI サポート:

- [list-dashboards](https://docs.aws.amazon.com/ja_jp/cli/latest/reference/cloudwatch/list-dashboards.html)
- [get-dashboard](https://docs.aws.amazon.com/ja_jp/cli/latest/reference/cloudwatch/get-dashboard.html)
- [delete-dashboards](https://docs.aws.amazon.com/ja_jp/cli/latest/reference/cloudwatch/delete-dashboards.html)
- [put-dashboard](https://docs.aws.amazon.com/ja_jp/cli/latest/reference/cloudwatch/put-dashboard.html)

**追加リファレンス:** AWS Observability ワークショップの [CloudWatch ダッシュボードと AWS CLI](https://catalog.workshops.aws/observability/en-US/aws-native/dashboards/createcli)

## CloudWatch ダッシュボードの自動化

CloudWatch ダッシュボードの作成を自動化するために、お客様は CloudFormation や Terraform などの Infrastructure as Code (IaC) ツールを使用できます。これらのツールは AWS リソースのセットアップを支援し、お客様がリソースの管理に費やす時間を減らし、AWS 上で実行されるアプリケーションに集中できるようになります。

[AWS CloudFormation](https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/aws-resource-cloudwatch-dashboard.html) では、テンプレートを使ってダッシュボードを作成できます。AWS::CloudWatch::Dashboard リソースは、Amazon CloudWatch ダッシュボードを指定します。

[Terraform](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_dashboard) にも、IaC 自動化を通じて CloudWatch ダッシュボードを作成できるモジュールがあります。

目的のウィジェットを使ってダッシュボードを手動で作成するのは簡単です。しかし、コンテンツが Auto Scaling グループでのスケールアウトやスケールインイベント時に作成または削除される EC2 インスタンスなどの動的な情報に基づいている場合、リソースソースを更新するにはある程度の労力が必要になります。自動的に [Amazon CloudWatch ダッシュボードを作成および更新する方法](https://aws.amazon.com/blogs/mt/update-your-amazon-cloudwatch-dashboards-automatically-using-amazon-eventbridge-and-aws-lambda/) を知りたい場合は、ブログ記事を参照してください。

**その他の参考ブログ:**

- [Automating Amazon CloudWatch dashboard creation for Amazon EBS volume KPIs](https://aws.amazon.com/blogs/storage/automating-amazon-cloudwatch-dashboard-creation-for-amazon-ebs-volume-kpis/)
- [Automate creation of Amazon CloudWatch alarms and dashboards with AWS Systems Manager and Ansible](https://aws.amazon.com/blogs/mt/automate-creation-of-amazon-cloudwatch-alarms-and-dashboards-with-aws-systems-manager-and-ansible/)
- [Deploying an automated Amazon CloudWatch dashboard for AWS Outposts using AWS CDK](https://aws.amazon.com/blogs/compute/deploying-an-automated-amazon-cloudwatch-dashboard-for-aws-outposts-using-aws-cdk/)

**CloudWatch ダッシュボード** に関する [製品 FAQ](https://aws.amazon.com/jp/cloudwatch/faqs/)
