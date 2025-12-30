# CloudWatch Container Insights 

## はじめに

Amazon CloudWatch Container Insights は、コンテナ化されたアプリケーションとマイクロサービスからメトリクスとログを収集、集約、要約するための強力なツールです。このドキュメントでは、EKS Fargate ワークロードにおける ADOT と CloudWatch Container Insights の統合について、その設計、デプロイプロセス、およびメリットを含めた概要を説明します。

## EKS Fargate 向け ADOT Collector の設計

ADOT Collector は、3 つの主要コンポーネントで構成されるパイプラインアーキテクチャを使用します。

1. Receiver: 指定された形式でデータを受け入れ、内部形式に変換します。
2. Processor: データに対してバッチ処理、フィルタリング、変換などのタスクを実行します。
3. Exporter: メトリクス、ログ、またはトレースの送信先を決定します。

EKS Fargate の場合、ADOT Collector は Prometheus Receiver を使用して Kubernetes API サーバーからメトリクスをスクレイピングします。このサーバーはワーカーノード上の kubelet のプロキシとして機能します。このアプローチは、EKS Fargate のネットワーク制限により kubelet への直接アクセスが妨げられるため必要です。収集されたメトリクスは、フィルタリング、名前変更、データ集約、変換のための一連のプロセッサーを通過します。最後に、AWS CloudWatch EMF Exporter がメトリクスを埋め込みメトリクス形式 (EMF) に変換し、CloudWatch Logs に送信します。

![CI EKS fargate with ADOT](./images/cieksfargateadot.png)
*図 1: EKS Fargate 上の ADOT を使用した Container Insights*
<!--https://aws.amazon.com/blogs/containers/introducing-amazon-cloudwatch-container-insights-for-amazon-eks-fargate-using-aws-distro-for-opentelemetry/
-->
## デプロイプロセス

EKS Fargate クラスターに ADOT Collector をデプロイするには、次の手順を実行します。

1. Kubernetes を使用して EKS クラスターを作成します。
2. Fargate ポッド実行ロールを設定します。
3. 必要な名前空間に対して Fargate プロファイルを定義します。
4. 必要な権限を持つ ADOT Collector 用の IAM ロールを作成します。
5. 提供されたマニフェストを使用して、ADOT Collector を Kubernetes StatefulSet としてデプロイします。
6. メトリクス収集をテストするためにサンプルワークロードをデプロイします。


## メリットとデメリット

### 長所

1. 統合監視: EKS EC2 と Fargate ワークロード全体で一貫した監視エクスペリエンスを提供します。
2. スケーラビリティ: 単一の ADOT Collector インスタンスで、EKS クラスター内のすべてのワーカーノードからメトリクスを検出して収集できます。
3. 豊富なメトリクス: CPU、メモリ、ディスク、ネットワーク使用量を含む包括的なシステムメトリクスのセットを収集します。
4. 簡単な統合: 既存の CloudWatch ダッシュボードとアラームとシームレスに統合されます。
5. コスト効率: 追加の監視インフラストラクチャを必要とせずに Fargate ワークロードの監視を可能にします。

### デメリット

1. 設定の複雑さ: ADOT Collector のセットアップには、IAM ロール、Fargate プロファイル、Kubernetes リソースの慎重な設定が必要です。
2. リソースのオーバーヘッド: ADOT Collector 自体が Fargate クラスター上のリソースを消費するため、キャパシティプランニングで考慮する必要があります。

AWS Distro for OpenTelemetry と CloudWatch Container Insights for EKS Fargate ワークロードの統合は、コンテナ化されたアプリケーションを監視するための強力なソリューションを提供します。これにより、さまざまな EKS デプロイオプション全体で統一された監視エクスペリエンスが提供され、OpenTelemetry フレームワークのスケーラビリティと柔軟性が活用されます。Fargate ワークロードからシステムメトリクスの収集を有効にすることで、この統合により、お客様はアプリケーションのパフォーマンスに関するより深い洞察を得て、情報に基づいたスケーリングの決定を行い、リソース使用率を最適化できます。