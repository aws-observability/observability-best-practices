# AWS における Databricks のモニタリングとオブザーバビリティのベストプラクティス

Databricks は、データ分析や AI/ML ワークロードを管理するプラットフォームです。このガイドは、AWS のネイティブなオブザーバビリティ サービスまたはオープンソースのマネージドサービスを使用して、[AWS 上の Databricks](https://aws.amazon.com/solutions/partners/databricks/) を実行しているお客様のこれらのワークロードのモニタリングをサポートすることを目的としています。

## Databricks を監視する理由

Databricks クラスタを管理する運用チームは、ワークロードのステータス、エラー、パフォーマンスのボトルネックを追跡するための統合カスタマイズダッシュボード;時間経過に伴うリソース使用量合計やエラー発生率などの望ましくない動作に対するアラート;根本原因分析のための集中ログや、カスタマイズメトリクスの抽出などの恩恵を受けます。

## 監視する項目

Databricks はクラスターインスタンスで Apache Spark を実行します。Spark にはメトリクスを公開するネイティブ機能があります。これらのメトリクスは、ドライバー、ワーカー、クラスターで実行されているワークロードに関する情報を提供します。

Spark を実行しているインスタンスには、ストレージ、CPU、メモリ、ネットワークに関する追加の有用な情報があります。Databricks クラスターのパフォーマンスに影響を与え得る外部要因を理解することが重要です。インスタンスの多いクラスターの場合、ボトルネックと全体的な健全性を理解することもまた重要です。

## モニタリングの方法

コレクタとその依存関係をインストールするには、Databricks の init スクリプトが必要です。 これらは、Databricks クラスタの各インスタンスのブート時に実行されるスクリプトです。

Databricks クラスターのアクセス許可も、インスタンスプロファイルを使用してメトリクスとログを送信するアクセス許可が必要です。

最後に、クラスタへの適切な参照に `testApp` を置き換えて、Databricks クラスターの Spark 設定でメトリクス名前空間を設定することがベストプラクティスです。

![Databricks Spark Config](../../images/databricks_spark_config.png)
*図 1: メトリクス名前空間の Spark 設定の例*

## DataBricksの良いオブザーバビリティソリューションの主要部分

**1) メトリクス:** メトリクスとは、一定期間に測定されたアクティビティや特定のプロセスを記述する数字です。Databricks でのメトリクスの種類は以下の通りです。

- システムリソースレベルのメトリクス(CPU、メモリ、ディスク、ネットワークなど)
- Custom Metrics Source、StreamingQueryListener、QueryExecutionListener を使用したアプリケーションメトリクス  
- MetricsSystem によって公開される Spark メトリクス

**2) ログ:** ログは発生した一連のイベントを表すもので、それらについて線形的なストーリーを伝えます。Databricks でのログの種類は以下の通りです。

- イベントログ  
- 監査ログ
- ドライバーログ: 標準出力、標準エラー出力、log4j カスタムログ(構造化ロギングの有効化)
- エグゼキューターログ: 標準出力、標準エラー出力、log4j カスタムログ(構造化ロギングの有効化)

**3) トレース:** スタックトレースはエンドツーエンドの可視性を提供し、ステージ全体のフローを示します。これは、エラーやパフォーマンスの問題を引き起こすステージやコードを特定するためのデバッグに役立ちます。

**4) ダッシュボード:** ダッシュボードは、アプリケーションやサービスの重要なメトリクスの概要を素晴らしい形で提供します。

**5) アラート:** アラートは、注意が必要な条件についてエンジニアに通知します。

## AWS ネイティブのオブザーバビリティオプション

Ganglia UI や Log Delivery などのネイティブソリューションは、システムメトリクスの収集や Apache SparkTM メトリクスのクエリに適したソリューションです。しかし、改善の余地がある分野もあります。

- Ganglia はアラートをサポートしていません。 
- Ganglia はログから派生したメトリクス(例: ERROR ログの成長率)をサポートしていません。
- データ正確性、データ新鮮度、エンドツーエンドのレイテンシに関連する SLO(サービスレベル目標)および SLI(サービスレベルインジケータ)を追跡するためのカスタムダッシュボードを使用できず、Ganglia で視覚化することができません。

[Amazon CloudWatch](https://aws.amazon.com/cloudwatch/) は、AWS 上の Databricks クラスターを監視および管理するための重要なツールです。クラスターのパフォーマンスに関する貴重な洞察を提供し、問題をすばやく特定および解決するのに役立ちます。Databricks と CloudWatch の統合および構造化ロギングの有効化は、これらの分野の改善に役立ちます。CloudWatch Application Insights は、ログに含まれるフィールドを自動的に検出するのに役立ち、CloudWatch Logs Insights は、より高速なデバッグと分析のための目的構築型クエリ言語を提供します。

![Databricks With CloudWatch](../../images/databricks_cw_arch.png)
*図 2: Databricks CloudWatch アーキテクチャ*

CloudWatch を使用して Databricks を監視する方法の詳細については、以下を参照してください。 
[How to Monitor Databricks with Amazon CloudWatch](https://aws.amazon.com/blogs/mt/how-to-monitor-databricks-with-amazon-cloudwatch/)

## オープンソースのソフトウェア オブザーバビリティ オプション

[Amazon Managed Service for Prometheus](https://aws.amazon.com/prometheus/) は、メトリクスを保存し、それらのメトリクス上に作成されたアラートを管理する、サーバーレスなマネージド型の Prometheus 互換モニタリングサービスです。Prometheus は人気のオープンソースモニタリングテクノロジーで、Kubernetes に次いで Cloud Native Computing Foundation に属する 2 番目のプロジェクトです。

[Amazon Managed Grafana](https://aws.amazon.com/grafana/) は、Grafana のマネージドサービスです。Grafana は、時系列データの可視化のためのオープンソーステクノロジーで、一般的にオブザーバビリティに使用されます。Grafana を使用して、Amazon Managed Service for Prometheus、Amazon CloudWatch などのさまざまなソースからのデータを可視化できます。Databricks のメトリクスとアラートの可視化に使用されます。

[AWS Distro for OpenTelemetry](https://aws-otel.github.io/) は、トレースとメトリクスを収集するためのオープンソースの標準、ライブラリ、サービスを提供する OpenTelemetry プロジェクトの AWS 対応ディストリビューションです。OpenTelemetry を通じて、Prometheus や StatsD などのさまざまなオブザーバビリティデータ形式を収集し、このデータをエンリッチして、CloudWatch や Amazon Managed Service for Prometheus などのさまざまなデスティネーションに送信できます。

### ユースケース

AWS ネイティブサービスは、Databricks クラスターを管理するために必要なオブザーバビリティを提供しますが、オープンソースのマネージドサービスを使用するのが最適なシナリオもあります。

Prometheus と Grafana は非常に人気のあるテクノロジーで、すでに多くの企業で使用されています。オブザーバビリティのための AWS オープンソースサービスを使用すると、運用チームは同じ既存のインフラストラクチャ、同じクエリ言語、既存のダッシュボードとアラートを使用して、これらのサービスのインフラストラクチャ、スケーラビリティ、パフォーマンスを管理する大変な作業なしに、Databricks ワークロードを監視できます。

ADOT は、CloudWatch と Prometheus などの異なるデスティネーションにメトリクスとトレースを送信したり、OTLP と StatsD などの異なるタイプのデータソースと連携したりする必要があるチームにとって、最良の選択肢です。

最後に、Amazon Managed Grafana は CloudWatch と Prometheus を含むさまざまなデータソースをサポートしているため、複数のツールを使用することを決定したチームのデータの相関関係を支援し、すべての Databricks クラスタのオブザーバビリティを可能にするテンプレートの作成と、インフラストラクチャ as コードを通じたプロビジョニングと構成を可能にする強力な API を提供します。

![Databricks OpenSource Observability Diagram](../../images/databricks_oss_diagram.png)
*図 3: Databricks オープンソース オブザーバビリティ アーキテクチャ*

AWS Managed オープンソース オブザーバビリティ サービスを使用して Databricks クラスタからメトリクスを観測するには、メトリクスとアラートの両方を可視化する Amazon Managed Grafana ワークスペースと、Amazon Managed Grafana ワークスペースでデータソースとして構成されている Amazon Managed Service for Prometheus ワークスペースが必要です。

収集する必要がある重要な 2 つの種類のメトリクスがあります。Spark メトリクスとノードメトリクスです。

Spark メトリクスには、クラスタ内の現在のワーカー数やエグゼキュタ数、処理中のノード間でのデータ交換時に発生するシャッフル数、データが RAM からディスクへ、ディスクから RAM へ移動する際のスピル数などの情報が含まれます。これらのメトリクスを公開するには、バージョン 3.0 から利用可能な Spark ネイティブ Prometheus を Databricks 管理コンソールで有効にし、`init_script` を介して構成する必要があります。

ディスク使用量、CPU 時間、メモリ、ストレージパフォーマンスなどのノードメトリクスを追跡するには、`node_exporter` を使用します。これは、重要なメトリクスのみを公開する以外、特別な構成なしに使用できます。

各ノードに ADOT Collector をインストールし、Spark と `node_exporter` が公開するメトリクスをスクレイピング、`cluster_name` などのメタデータを注入し、これらのメトリクスを Prometheus ワークスペースに送信する必要があります。

ADOT Collector と `node_exporter` の両方を `init_script` を介してインストールおよび構成する必要があります。

Databricks クラスタは、Prometheus ワークスペースにメトリクスを書き込む権限を持つ IAM ロールで構成する必要があります。

## ベストプラクティス

### 価値のあるメトリクスを優先する

Spark と node_exporter はどちらも、同じメトリクスのいくつかの形式でいくつかのメトリクスを公開します。監視とインシデント対応に役立つメトリクスをフィルタリングせずに、問題を検出する平均時間が増加し、サンプルを保存するコストが増加し、価値のある情報が見つけにくく、理解しにくくなります。OpenTelemetry プロセッサを使用すると、価値のあるメトリクスのみをフィルタリングして保持したり、意味のないメトリクスをフィルタリングしたり、AMP に送信する前にメトリクスを集計および計算したりすることができます。

### アラート疲れを避ける

貴重なメトリクスが AMP に取り込まれたら、アラートの設定が不可欠です。
ただし、すべてのリソース使用量のバーストに対してアラートを出すと、アラート疲れを引き起こす可能性があります。
これは、過度のノイズによってアラートの重要度への信頼性が低下し、重要なイベントが検出されなくなることを意味します。
AMP のアラートルールグループ機能を使用して、つながった複数のアラートによって個別の通知が生成されるというあいまいさを避ける必要があります。
また、アラートに適切な重要度を割り当て、ビジネスの優先事項を反映する必要があります。

### Amazon Managed Grafana ダッシュボードの再利用

Amazon Managed Grafana は、Grafana ネイティブのテンプレート機能を利用しています。これにより、すべての既存および新しい Databricks クラスターのダッシュボードを作成できます。各クラスターごとに視覚化を手動で作成および保守する必要がなくなります。この機能を使用するには、メトリクスにクラスターごとにこれらのメトリクスをグループ化するのに適切なラベルがあることが重要です。ここでも、OpenTelemetry プロセッサを使用することで実現できます。

## 参考文献とその他の情報

- [Amazon Managed Service for Prometheus ワークスペースの作成](https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/AMP-onboard-create-workspace.html)
- [Amazon Managed Grafana ワークスペースの作成](https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/Amazon-Managed-Grafana-create-workspace.html)  
- [Amazon Managed Service for Prometheus データソースの設定](https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/prometheus-data-source.html)
- [Databricks 初期化スクリプト](https://docs.databricks.com/ja/clusters/init-scripts.html)
