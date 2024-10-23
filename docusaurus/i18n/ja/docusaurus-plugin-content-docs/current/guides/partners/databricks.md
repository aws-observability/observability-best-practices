# AWS における Databricks のモニタリングとオブザーバビリティのベストプラクティス

Databricks は、データ分析や AI/ML ワークロードを管理するためのプラットフォームです。このガイドは、[AWS 上の Databricks](https://aws.amazon.com/jp/solutions/partners/databricks/) を実行しているお客様を対象に、AWS ネイティブのオブザーバビリティサービスやオープンソースのマネージドサービスを使用してこれらのワークロードをモニタリングする方法をサポートすることを目的としています。



## Databricks をモニタリングする理由

Databricks クラスターを管理する運用チームは、統合されたカスタマイズ可能なダッシュボードを利用することで、以下のような利点を得られます：

- ワークロードのステータス、エラー、パフォーマンスのボトルネックを追跡できる
- 時間経過に伴う総リソース使用量や、エラーの割合など、望ましくない動作に対してアラートを設定できる
- 根本原因分析や追加のカスタムメトリクスの抽出のために、ログを一元化できる




## 監視すべき項目

Databricks は、クラスターインスタンスで Apache Spark を実行しており、これにはメトリクスを公開するネイティブ機能があります。これらのメトリクスは、ドライバー、ワーカー、およびクラスターで実行されているワークロードに関する情報を提供します。

Spark を実行しているインスタンスには、ストレージ、CPU、メモリ、ネットワーキングに関する追加の有用な情報があります。Databricks クラスターのパフォーマンスに影響を与える可能性のある外部要因を理解することが重要です。多数のインスタンスを持つクラスターの場合、ボトルネックと全体的な健全性を理解することも同様に重要です。



## モニタリング方法

コレクターとその依存関係をインストールするには、Databricks の初期化スクリプトが必要です。これらのスクリプトは、Databricks クラスターの各インスタンスで起動時に実行されます。

また、Databricks クラスターの権限には、インスタンスプロファイルを使用してメトリクスとログを送信する権限も必要です。

最後に、Databricks クラスターの Spark 設定でメトリクス名前空間を設定することがベストプラクティスです。その際、`testApp` をクラスターの適切な参照に置き換えてください。

![Databricks Spark Config](../../images/databricks_spark_config.png)
*図 1: メトリクス名前空間の Spark 設定例*



## Databricks の優れたオブザーバビリティソリューションの主要な要素

**1) メトリクス:** メトリクスは、一定期間にわたって測定されたアクティビティや特定のプロセスを表す数値です。Databricks には以下のような種類のメトリクスがあります：

CPU、メモリ、ディスク、ネットワークなどのシステムリソースレベルのメトリクス。
カスタムメトリクスソース、StreamingQueryListener、QueryExecutionListener を使用したアプリケーションメトリクス。
MetricsSystem によって公開される Spark メトリクス。

**2) ログ:** ログは発生した一連のイベントを表現し、それらについて線形的なストーリーを語ります。Databricks には以下のような種類のログがあります：

- イベントログ
- 監査ログ
- ドライバーログ：stdout、stderr、log4j カスタムログ（構造化ログを有効化）
- エグゼキューターログ：stdout、stderr、log4j カスタムログ（構造化ログを有効化）

**3) トレース:** スタックトレースはエンド・ツー・エンドの可視性を提供し、ステージ全体の流れを示します。これは、エラーやパフォーマンスの問題を引き起こすステージやコードを特定するためのデバッグが必要な場合に役立ちます。

**4) ダッシュボード:** ダッシュボードは、アプリケーションやサービスのゴールデンメトリクスの優れた概要ビューを提供します。

**5) アラート:** アラートは、注意が必要な状況についてエンジニアに通知します。



## AWS ネイティブのオブザーバビリティオプション

Ganglia UI や Log Delivery などのネイティブソリューションは、システムメトリクスの収集や Apache Spark™ メトリクスのクエリに優れたソリューションです。しかし、いくつかの改善点があります：

- Ganglia はアラートをサポートしていません。
- Ganglia はログから派生したメトリクス（例：ERROR ログの増加率）の作成をサポートしていません。
- データの正確性、データの鮮度、またはエンドツーエンドのレイテンシーに関連する SLO（Service Level Objectives）と SLI（Service Level Indicators）を追跡し、それらを Ganglia で可視化するためのカスタムダッシュボードを使用できません。

[Amazon CloudWatch](https://aws.amazon.com/jp/cloudwatch/) は、AWS 上の Databricks クラスターを監視および管理するための重要なツールです。クラスターのパフォーマンスに関する貴重な洞察を提供し、問題を迅速に特定して解決するのに役立ちます。Databricks と CloudWatch を統合し、構造化ログを有効にすることで、これらの領域を改善できます。CloudWatch Application Insights は、ログに含まれるフィールドを自動的に発見するのに役立ち、CloudWatch Logs Insights は、より迅速なデバッグと分析のための目的に特化したクエリ言語を提供します。

![Databricks With CloudWatch](../../images/databricks_cw_arch.png)
*図 2：Databricks CloudWatch アーキテクチャ*

CloudWatch を使用して Databricks を監視する方法の詳細については、以下を参照してください：
[Amazon CloudWatch を使用して Databricks を監視する方法](https://aws.amazon.com/blogs/mt/how-to-monitor-databricks-with-amazon-cloudwatch/)



## オープンソースソフトウェアのオブザーバビリティオプション

[Amazon Managed Service for Prometheus](https://aws.amazon.com/jp/prometheus/) は、Prometheus 互換のモニタリングを提供するマネージド型のサーバーレスサービスで、メトリクスの保存と、これらのメトリクス上に作成されたアラートの管理を担当します。Prometheus は人気のあるオープンソースのモニタリング技術で、Kubernetes に次いで Cloud Native Computing Foundation に所属する 2 番目のプロジェクトです。

[Amazon Managed Grafana](https://aws.amazon.com/jp/grafana/) は、Grafana のマネージドサービスです。Grafana は時系列データの可視化のためのオープンソース技術で、オブザーバビリティによく使用されます。Grafana を使用して、Amazon Managed Service for Prometheus、Amazon CloudWatch など、さまざまなソースからのデータを可視化できます。Databricks のメトリクスとアラートの可視化に使用されます。

[AWS Distro for OpenTelemetry](https://aws-otel.github.io/) は、AWS がサポートする OpenTelemetry プロジェクトのディストリビューションで、トレースとメトリクスを収集するためのオープンソース標準、ライブラリ、サービスを提供します。OpenTelemetry を通じて、Prometheus や StatsD などのさまざまなオブザーバビリティデータ形式を収集し、このデータを強化して、CloudWatch や Amazon Managed Service for Prometheus などの複数の宛先に送信できます。



### ユースケース

AWS ネイティブサービスは Databricks クラスターを管理するために必要なオブザーバビリティを提供しますが、オープンソースのマネージドサービスを使用することが最適な選択肢となるシナリオもあります。

Prometheus と Grafana は非常に人気のあるテクノロジーであり、多くの企業ですでに使用されています。AWS のオープンソースオブザーバビリティサービスを使用することで、運用チームは既存のインフラストラクチャ、同じクエリ言語、既存のダッシュボードとアラートを使用して Databricks ワークロードを監視できます。これらのサービスのインフラストラクチャ、スケーラビリティ、パフォーマンスを管理する手間をかけずに実現できます。

ADOT は、CloudWatch や Prometheus などの異なる送信先にメトリクスとトレースを送信する必要がある場合や、OTLP や StatsD などの異なるタイプのデータソースを扱う必要がある場合に最適な選択肢です。

最後に、Amazon Managed Grafana は CloudWatch や Prometheus を含む多くの異なるデータソースをサポートしており、複数のツールを使用することを決めたチームがデータを相関させるのに役立ちます。これにより、すべての Databricks クラスターのオブザーバビリティを可能にするテンプレートの作成や、Infrastructure as Code を通じてプロビジョニングと設定を行うための強力な API が提供されます。

![Databricks OpenSource Observability Diagram](../../images/databricks_oss_diagram.png)
*図 3: Databricks オープンソースオブザーバビリティアーキテクチャ*

AWS マネージドオープンソースオブザーバビリティサービスを使用して Databricks クラスターからメトリクスを観測するには、メトリクスとアラートの両方を可視化するための Amazon Managed Grafana ワークスペースと、Amazon Managed Grafana ワークスペースのデータソースとして設定された Amazon Managed Service for Prometheus ワークスペースが必要です。

収集すべき重要なメトリクスには、Spark メトリクスとノードメトリクスの 2 種類があります。

Spark メトリクスは、クラスター内の現在のワーカー数やエグゼキューター数、処理中にノード間でデータを交換する際のシャッフル、データが RAM からディスクへ、ディスクから RAM へ移動するスピルなどの情報をもたらします。これらのメトリクスを公開するには、Databricks 管理コンソールを通じて Spark ネイティブの Prometheus（バージョン 3.0 以降で利用可能）を有効にし、`init_script` を通じて設定する必要があります。

ディスク使用量、CPU 時間、メモリ、ストレージパフォーマンスなどのノードメトリクスを追跡するために、`node_exporter` を使用します。これは追加の設定なしで使用できますが、重要なメトリクスのみを公開するべきです。

ADOT Collector をクラスターの各ノードにインストールし、Spark と `node_exporter` の両方が公開するメトリクスをスクレイピングし、これらのメトリクスをフィルタリングし、`cluster_name` などのメタデータを注入して、これらのメトリクスを Prometheus ワークスペースに送信する必要があります。

ADOT Collector と `node_exporter` の両方を `init_script` を通じてインストールおよび設定する必要があります。

Databricks クラスターは、Prometheus ワークスペースにメトリクスを書き込む権限を持つ IAM ロールで設定する必要があります。



## ベストプラクティス




### 価値のあるメトリクスを優先する

Spark と node_exporter は、どちらも多数のメトリクスと、同じメトリクスに対する複数のフォーマットを公開しています。モニタリングとインシデント対応に有用なメトリクスをフィルタリングしないと、問題検出までの平均時間が増加し、サンプルの保存コストが上がり、価値ある情報の発見と理解が困難になります。OpenTelemetry のプロセッサを使用することで、価値のあるメトリクスのみをフィルタリングして保持したり、意味のないメトリクスを除外したりすることができます。また、AMP に送信する前にメトリクスを集計して計算することも可能です。



### アラート疲れを避ける

価値のあるメトリクスが AMP に取り込まれたら、アラートを設定することが重要です。しかし、リソース使用量のすべてのバーストに対してアラートを設定すると、アラート疲れを引き起こす可能性があります。これは、ノイズが多すぎるとアラートの重要度への信頼が低下し、重要なイベントが検出されなくなる状況です。AMP のアラートルールグループ機能を使用して、複数の関連するアラートが別々の通知を生成するような曖昧さを避けるべきです。また、アラートには適切な重要度を設定し、ビジネスの優先順位を反映させる必要があります。



### Amazon Managed Grafana ダッシュボードの再利用

Amazon Managed Grafana は、Grafana のネイティブなテンプレート機能を活用しています。これにより、既存および新規の Databricks クラスターすべてに対してダッシュボードを作成できます。各クラスターに対して手動でビジュアライゼーションを作成し、維持する必要がなくなります。この機能を使用するには、メトリクスに正しいラベルを付けて、クラスターごとにメトリクスをグループ化することが重要です。これも OpenTelemetry プロセッサーを使用することで可能です。



## 参考資料と詳細情報

- [Amazon Managed Service for Prometheus ワークスペースの作成](https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/AMP-onboard-create-workspace.html)
- [Amazon Managed Grafana ワークスペースの作成](https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/Amazon-Managed-Grafana-create-workspace.html)
- [Amazon Managed Service for Prometheus データソースの設定](https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/prometheus-data-source.html)
- [Databricks 初期化スクリプト](https://docs.databricks.com/clusters/init-scripts.html)
