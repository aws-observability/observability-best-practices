# AWS における Databricks のモニタリングとオブザーバビリティのベストプラクティス

Databricks は、データ分析と AI/ML ワークロードを管理するためのプラットフォームです。このガイドは、[Databricks on AWS](https://aws.amazon.com/solutions/partners/databricks/) を実行しているお客様が、AWS ネイティブサービスまたはオープンソースマネージドサービスを使用してこれらのワークロードを監視できるよう支援することを目的としています。

## Databricks を監視する理由

Databricks クラスターを管理する運用チームは、統合されたカスタマイズされたダッシュボードを使用することで、ワークロードのステータス、エラー、パフォーマンスのボトルネックを追跡し、時間経過に伴う総リソース使用量やエラーの割合などの望ましくない動作に関するアラートを設定し、根本原因分析のための一元化されたログ記録や追加のカスタマイズされたメトリクスの抽出を行うことができます。

## 監視対象

Databricks はクラスターインスタンスで Apache Spark を実行しており、メトリクスを公開するネイティブ機能を備えています。これらのメトリクスは、ドライバー、ワーカー、およびクラスターで実行されているワークロードに関する情報を提供します。

Spark を実行しているインスタンスには、ストレージ、CPU、メモリ、ネットワーキングに関する追加の有用な情報があります。Databricks クラスターのパフォーマンスに影響を与える可能性のある外部要因を理解することが重要です。多数のインスタンスを持つクラスターの場合、ボトルネックと全体的な健全性を理解することも重要です。

## 監視方法

コレクターとその依存関係をインストールするには、Databricks init スクリプトが必要です。これらは、起動時に Databricks クラスターの各インスタンスで実行されるスクリプトです。

Databricks クラスターのアクセス許可には、インスタンスプロファイルを使用してメトリクスとログを送信するためのアクセス許可も必要です。

最後に、Databricks クラスターの Spark 設定でメトリクス名前空間を設定することがベストプラクティスです。 `testApp` クラスターへの適切な参照を使用します。

![Databricks Spark Config](../../images/databricks_spark_config.png)
*図 1: メトリクス名前空間 Spark 設定の例*

## DataBricks に適した優れた Observability ソリューションの主要な要素

**1) メトリクス:** メトリクスは、一定期間にわたって測定されたアクティビティまたは特定のプロセスを説明する数値です。Databricks におけるさまざまなタイプのメトリクスは次のとおりです。

CPU、メモリ、ディスク、ネットワークなどのシステムリソースレベルのメトリクス。
Custom Metrics Source、StreamingQueryListener、QueryExecutionListener を使用したアプリケーションメトリクス。
MetricsSystem によって公開される Spark メトリクス。

**2) ログ:** ログは、発生した一連のイベントを表現したもので、それらについての線形のストーリーを伝えます。Databricks には以下のような異なるタイプのログがあります。

- イベントログ
- 監査ログ
- ドライバーログ: stdout、stderr、log4j カスタムログ (構造化ログを有効化)
- Executor ログ: stdout、stderr、log4j カスタムログ (構造化ログを有効化)

**3) トレース:** スタックトレースはエンドツーエンドの可視性を提供し、ステージ全体のフロー全体を示します。これは、どのステージ/コードがエラー/パフォーマンスの問題を引き起こしているかを特定するためにデバッグする必要がある場合に役立ちます。

**4) ダッシュボード:** ダッシュボードは、アプリケーション/サービスのゴールデンメトリクスの優れた概要ビューを提供します。

**5) アラート:** アラートは、注意が必要な状態についてエンジニアに通知します。

## AWS ネイティブオブザーバビリティオプション

Ganglia UI や Log Delivery などのネイティブソリューションは、システムメトリクスの収集や Apache Spark™ メトリクスのクエリに優れたソリューションです。ただし、改善できる領域もあります。

- Ganglia はアラートをサポートしていません。
- Ganglia はログから派生したメトリクスの作成をサポートしていません (例: ERROR ログの増加率)。
- カスタムダッシュボードを使用して、データの正確性、データの鮮度、またはエンドツーエンドのレイテンシーに関連する SLO (Service Level Objectives) と SLI (Service Level Indicators) を追跡し、ganglia で可視化することはできません。

[Amazon CloudWatch](https://aws.amazon.com/cloudwatch/) は、AWS 上の Databricks クラスターを監視および管理するための重要なツールです。クラスターのパフォーマンスに関する貴重な洞察を提供し、問題を迅速に特定して解決するのに役立ちます。Databricks を CloudWatch と統合し、構造化ログを有効にすることで、これらの領域を改善できます。CloudWatch Application Insights は、ログに含まれるフィールドを自動的に検出するのに役立ち、CloudWatch Logs Insights は、より高速なデバッグと分析のための専用のクエリ言語を提供します。

![Databricks With CloudWatch](../../images/databricks_cw_arch.png)
*図 2: Databricks CloudWatch アーキテクチャ*

CloudWatch を使用して Databricks を監視する方法の詳細については、次を参照してください。
[Amazon CloudWatch で Databricks を監視する方法](https://aws.amazon.com/blogs/mt/how-to-monitor-databricks-with-amazon-cloudwatch/)

## オープンソースソフトウェアのオブザーバビリティオプション

[Amazon Managed Service for Prometheus](https://aws.amazon.com/prometheus/) は、Prometheus 互換のマネージド型サーバーレス監視サービスで、メトリクスの保存と、これらのメトリクス上に作成されたアラートの管理を担当します。Prometheus は人気のあるオープンソース監視技術であり、Kubernetes に次いで Cloud Native Computing Foundation に属する 2 番目のプロジェクトです。

[Amazon Managed Grafana](https://aws.amazon.com/grafana/) は、Grafana のマネージドサービスです。Grafana は、時系列データの可視化のためのオープンソーステクノロジーであり、一般的にオブザーバビリティのために使用されます。Grafana を使用して、Amazon Managed Service for Prometheus、Amazon CloudWatch など、複数のソースからのデータを可視化できます。これは、Databricks のメトリクスとアラートを可視化するために使用されます。

[AWS Distro for OpenTelemetry](https://aws-otel.github.io/) は、AWS がサポートする OpenTelemetry プロジェクトのディストリビューションであり、トレースとメトリクスを収集するためのオープンソース標準、ライブラリ、およびサービスを提供します。OpenTelemetry を通じて、Prometheus や StatsD などのさまざまなオブザーバビリティデータ形式を収集し、このデータを強化して、CloudWatch や Amazon Managed Service for Prometheus などの複数の送信先に送信できます。

### ユースケース

AWS ネイティブサービスは Databricks クラスターを管理するために必要なオブザーバビリティを提供しますが、オープンソースのマネージドサービスを使用することが最適な選択となるシナリオもあります。

Prometheus と Grafana はどちらも非常に人気のある技術であり、すでに多くの企業で使用されています。AWS のオープンソースオブザーバビリティサービスを使用することで、運用チームは同じ既存のインフラストラクチャ、同じクエリ言語、既存のダッシュボードとアラートを使用して Databricks ワークロードを監視できます。これらのサービスのインフラストラクチャ、スケーラビリティ、パフォーマンスを管理する負担はありません。

ADOT は、CloudWatch や Prometheus などの異なる送信先にメトリクスとトレースを送信する必要がある場合や、OTLP や StatsD などの異なるタイプのデータソースを扱う必要があるチームにとって最適な代替手段です。

最後に、Amazon Managed Grafana は CloudWatch や Prometheus を含む多くの異なるデータソースをサポートしており、複数のツールの使用を決定したチームのデータを相関させるのに役立ちます。これにより、すべての Databricks クラスターのオブザーバビリティを実現するテンプレートの作成が可能になり、Infrastructure as Code を通じてプロビジョニングと設定を可能にする強力な API が提供されます。

![Databricks OpenSource Observability Diagram](../../images/databricks_oss_diagram.png)
*図 3: Databricks オープンソースオブザーバビリティアーキテクチャ*

AWS Managed Open Source Services for Observability を使用して Databricks クラスターからメトリクスを監視するには、メトリクスとアラートの両方を可視化するための Amazon Managed Grafana ワークスペースと、Amazon Managed Grafana ワークスペースでデータソースとして設定された Amazon Managed Service for Prometheus ワークスペースが必要です。

収集する必要がある重要なメトリクスには、Spark メトリクスとノードメトリクスの 2 種類があります。

Spark メトリクスは、クラスター内の現在のワーカー数やエグゼキューター、処理中にノード間でデータ交換が発生する際のシャッフル、データが RAM からディスクへ、またはディスクから RAM へ移動する際のスピルなどの情報を提供します。これらのメトリクスを公開するには、バージョン 3.0 以降で利用可能な Spark ネイティブの Prometheus を Databricks 管理コンソールで有効にし、次の方法で設定する必要があります `init_script`.

ディスク使用量、CPU 時間、メモリ、ストレージパフォーマンスなどのノードメトリクスを追跡するために、次を使用します `node_exporter`これ以上の設定なしで使用できますが、重要なメトリクスのみを公開する必要があります。

ADOT Collector は、クラスターの各ノードにインストールする必要があります。Spark と両方によって公開されるメトリクスをスクレイピングします。 `node_exporter`、これらのメトリクスをフィルタリングし、次のようなメタデータを挿入します `cluster_name`、これらのメトリクスを Prometheus ワークスペースに送信します。

ADOT Collector と `node _exporter` を通じてインストールおよび設定する必要があります `init_script`.

Databricks クラスタは、Prometheus ワークスペースにメトリクスを書き込む権限を持つ IAM ロールで構成する必要があります。

## ベストプラクティス

### 価値のあるメトリクスを優先する

Spark と node_exporter はどちらも複数のメトリクスを公開し、同じメトリクスに対して複数の形式を提供します。監視とインシデント対応に有用なメトリクスをフィルタリングしない場合、問題の検出にかかる平均時間が増加し、サンプルの保存コストが増加し、貴重な情報の発見と理解が困難になります。OpenTelemetry プロセッサーを使用することで、価値のあるメトリクスのみをフィルタリングして保持したり、意味のないメトリクスを除外したりすることが可能です。また、AMP に送信する前にメトリクスを集約および計算することもできます。

### アラート疲れを回避する

貴重なメトリクスが AMP に取り込まれたら、アラートを設定することが不可欠です。ただし、リソース使用量の急増のたびにアラートを発行すると、アラート疲れが発生する可能性があります。つまり、ノイズが多すぎるとアラートの重要度に対する信頼性が低下し、重要なイベントが検出されないままになります。AMP のアラートルールグループ機能を使用して、曖昧さを回避する必要があります。つまり、複数の関連するアラートが個別の通知を生成することを防ぎます。また、アラートには適切な重要度を設定する必要があり、ビジネスの優先順位を反映する必要があります。

### Amazon Managed Grafana ダッシュボードを再利用する

Amazon Managed Grafana は Grafana のネイティブテンプレート機能を活用しており、既存および新規のすべての Databricks クラスターに対してダッシュボードを作成できます。これにより、各クラスターの可視化を手動で作成および維持する必要がなくなります。この機能を使用するには、クラスターごとにこれらのメトリクスをグループ化するために、メトリクスに正しいラベルを付けることが重要です。繰り返しになりますが、これは OpenTelemetry プロセッサーで可能です。

## 参考資料と詳細情報

- [Amazon Managed Service for Prometheus ワークスペースを作成する](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-onboard-create-workspace.html)
- [Amazon Managed Grafana ワークスペースを作成する](https://docs.aws.amazon.com/grafana/latest/userguide/Amazon-Managed-Grafana-create-workspace.html)
- [Amazon Managed Service for Prometheus データソースを設定する](https://docs.aws.amazon.com/grafana/latest/userguide/prometheus-data-source.html)
- [Databricks Init Scripts](https://docs.databricks.com/clusters/init-scripts.html)
