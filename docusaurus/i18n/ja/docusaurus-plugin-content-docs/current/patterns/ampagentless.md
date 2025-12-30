# EKS から Prometheus へのメトリクスのプッシュ

Amazon Elastic Kubernetes Service (EKS) でコンテナ化されたワークロードを実行する場合、AWS Managed Prometheus (AMP) を活用して、アプリケーションとインフラストラクチャからメトリクスを収集および分析できます。AMP は、完全マネージド型の Prometheus 互換モニタリングソリューションを提供することで、Prometheus 互換モニタリングのデプロイと管理を簡素化します。

EKS コンテナ化されたワークロードから AMP にメトリクスをプッシュするには、Managed Prometheus Collector 設定を使用できます。Managed Prometheus Collector は AMP のコンポーネントで、アプリケーションやサービスからメトリクスをスクレイピングし、保存と分析のために AMP ワークスペースに送信します。

![EKS AMP](./images/eksamp.png)
*図 1: EKS から AMP へのメトリクスの送信*

## Managed Prometheus Collector の設定

1. **AMP Workspace を有効化する**: まず、AWS アカウントに AMP ワークスペースが作成されていることを確認します。AMP ワークスペースをまだセットアップしていない場合は、AWS ドキュメントに従って作成してください。

2. **Managed Prometheus Collector を設定する**: AMP ワークスペース内で、「Managed Prometheus Collectors」セクションに移動し、新しいコレクター設定を作成します。

3. **スクレイプ設定の定義**: コレクター設定で、コレクターがメトリクスをスクレイプするターゲットを指定します。EKS ワークロードの場合、Kubernetes サービスディスカバリー設定を定義することで、コレクターが Kubernetes Pod と Service からメトリクスを動的に検出してスクレイプできるようになります。

Kubernetes サービスディスカバリー設定の例:

  ```yaml
  kubernetes_sd_configs:
    - role: pod
      namespaces:
        names:
          - namespace1
          - namespace2
```          
この設定は、namespace1 と namespace2 の Kubernetes 名前空間で実行されている Pod からメトリクスをスクレイピングするようコレクターに指示します。

4. **Prometheus アノテーションの設定**: コンテナ化されたワークロードからメトリクスを収集できるようにするには、適切な Prometheus アノテーションを使用して Kubernetes Pod または Service にアノテーションを付ける必要があります。これらのアノテーションは、メトリクスエンドポイントやその他の設定に関する情報を提供します。
Prometheus アノテーションの例:
```yaml
annotations:
  prometheus.io/scrape: "true"
  prometheus.io/port: "8080"
  prometheus.io/path: "/metrics"
```  
これらのアノテーションは、Prometheus コレクターが Pod または Service のポート 8080 の /metrics エンドポイントからメトリクスをスクレイピングする必要があることを示しています。

5. **インストルメンテーションを使用したワークロードのデプロイ**: コンテナ化されたワークロードを EKS にデプロイし、適切なメトリクスエンドポイントを公開し、必要な Prometheus アノテーションを含めるようにします。Minikube、Helm、または AWS Cloud Development Kit (CDK) などのツールを使用して、EKS ワークロードをデプロイおよび管理できます。

6. **メトリクス収集の検証**: Managed Prometheus Collector が設定され、ワークロードがデプロイされると、収集されたメトリクスが AMP ワークスペースに表示されます。AMP クエリエディタを使用して、EKS ワークロードからのメトリクスを探索および視覚化できます。

## 追加の考慮事項

- 認証と承認: AMP は、監視データへのアクセスを保護するために、IAM ロールやサービスアカウントを含むさまざまな認証および承認メカニズムをサポートしています。

- AWS Observability Services との統合: AMP を AWS CloudWatch や AWS X-Ray などの他の AWS オブザーバビリティサービスと統合して、AWS 環境全体にわたる包括的なオブザーバビリティを実現できます。

AMP の Managed Prometheus Collector を活用することで、基盤となる Prometheus インフラストラクチャを管理およびスケーリングする必要なく、EKS コンテナ化されたワークロードからメトリクスを効率的に収集および分析できます。AMP は、EKS アプリケーションとインフラストラクチャを監視するための、フルマネージドでスケーラブルなソリューションを提供します。