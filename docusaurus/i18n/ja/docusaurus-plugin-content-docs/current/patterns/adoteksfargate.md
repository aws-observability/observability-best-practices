# CloudWatch Container Insights

## はじめに

Amazon CloudWatch Container Insights は、コンテナ化されたアプリケーションやマイクロサービスからメトリクスとログを収集、集約、要約するための強力なツールです。
このドキュメントでは、EKS Fargate ワークロードに対する ADOT と CloudWatch Container Insights の統合について、その設計、デプロイプロセス、メリットを概説します。

## EKS Fargate 向けの ADOT Collector の設計

ADOT Collector は、以下の 3 つの主要コンポーネントからなるパイプラインアーキテクチャを使用しています。

1. Receiver: 指定された形式のデータを受け入れ、内部形式に変換します。
2. Processor: データのバッチ処理、フィルタリング、変換などのタスクを実行します。
3. Exporter: メトリクス、ログ、トレースの送信先を決定します。

EKS Fargate では、ADOT Collector は Prometheus Receiver を使用して、Kubernetes API サーバーからメトリクスをスクレイピングします。Kubernetes API サーバーは、ワーカーノード上の kubelet のプロキシとして機能します。この方法が必要なのは、EKS Fargate のネットワーク制限により、kubelet に直接アクセスできないためです。収集されたメトリクスは、フィルタリング、名前変更、データ集約、変換などの一連のプロセッサを通過します。最後に、AWS CloudWatch EMF Exporter がメトリクスを埋め込みメトリックフォーマット (EMF) に変換し、CloudWatch Logs に送信します。

![CI EKS fargate with ADOT](./images/cieksfargateadot.png)
*図 1: EKS Fargate での ADOT を使った Container Insights*
<!--https://aws.amazon.com/jp/blogs/news/introducing-amazon-cloudwatch-container-insights-for-amazon-eks-fargate-using-aws-distro-for-opentelemetry/
-->

## デプロイプロセス

EKS Fargate クラスターに ADOT Collector をデプロイするには:

1. Kubernetes で EKS クラスターを作成します。
2. Fargate Pod 実行ロールを設定します。
3. 必要な名前空間に Fargate プロファイルを定義します。
4. 必要な権限を持つ ADOT Collector 用の IAM ロールを作成します。
5. 提供されたマニフェストを使用して、Kubernetes StatefulSet として ADOT Collector をデプロイします。
6. メトリクス収集をテストするためのサンプルワークロードをデプロイします。

## 長所と短所

### 長所:

1. 統一されたモニタリング: EKS EC2 および Fargate ワークロードに対して一貫したモニタリング体験を提供します。
2. スケーラビリティ: 単一の ADOT コレクターインスタンスで、EKS クラスター内のすべてのワーカーノードを検出してメトリクスを収集できます。
3. 豊富なメトリクス: CPU、メモリ、ディスク、ネットワーク使用量など、包括的なシステムメトリクスを収集します。
4. 簡単な統合: 既存の CloudWatch ダッシュボードやアラームとシームレスに統合できます。
5. コスト効率が良い: 追加のモニタリングインフラストラクチャを必要とせずに、Fargate ワークロードのモニタリングが可能です。

### デメリット:

1. 構成の複雑さ: ADOT Collector のセットアップには、IAM ロール、Fargate プロファイル、Kubernetes リソースの慎重な構成が必要です。
2. リソースのオーバーヘッド: ADOT Collector 自体が Fargate クラスターのリソースを消費するため、容量計画でこれを考慮する必要があります。

EKS Fargate ワークロードでの AWS Distro for OpenTelemetry と CloudWatch Container Insights の統合は、コンテナ化されたアプリケーションを監視するための強力なソリューションを提供します。これにより、さまざまな EKS デプロイメントオプションにわたって統一された監視体験が可能になり、OpenTelemetry フレームワークのスケーラビリティと柔軟性を活用できます。Fargate ワークロードからのシステムメトリクスの収集を可能にすることで、この統合によりお客様はアプリケーションのパフォーマンスを深く洞察し、適切なスケーリング判断を下し、リソース活用を最適化できます。
