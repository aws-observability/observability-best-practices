# EKS から Prometheus へのメトリクスの送信

Amazon Elastic Kubernetes Service (EKS) でコンテナ化されたワークロードを実行する場合、AWS Managed Prometheus (AMP) を活用してアプリケーションとインフラストラクチャからメトリクスを収集し分析できます。
AMP は、完全マネージド型の Prometheus 互換モニタリングソリューションを提供することで、Prometheus 互換のモニタリングのデプロイと管理を簡素化します。

EKS のコンテナ化されたワークロードから AMP にメトリクスを送信するには、Managed Prometheus Collector の設定を使用できます。
Managed Prometheus Collector は AMP のコンポーネントで、アプリケーションやサービスからメトリクスをスクレイピングし、保存と分析のために AMP ワークスペースに送信します。

![EKS AMP](./images/eksamp.png)
*図 1：EKS から AMP へのメトリクスの送信*



## Managed Prometheus Collector の設定

1. **AMP ワークスペースの有効化**: まず、AWS アカウントに AMP ワークスペースが作成されていることを確認します。AMP ワークスペースをまだ設定していない場合は、AWS のドキュメントに従って作成してください。

2. **Managed Prometheus Collector の設定**: AMP ワークスペース内で、「Managed Prometheus Collectors」セクションに移動し、新しいコレクター設定を作成します。

3. **スクレイプ設定の定義**: コレクター設定で、コレクターがメトリクスをスクレイプするターゲットを指定します。EKS ワークロードの場合、Kubernetes サービスディスカバリー設定を定義して、コレクターが Kubernetes の Pod とサービスからメトリクスを動的に検出してスクレイプできるようにします。

  Kubernetes サービスディスカバリー設定の例:

  ```yaml
  kubernetes_sd_configs:
    - role: pod
      namespaces:
        names:
          - namespace1
          - namespace2
```          
この設定は、コレクターに namespace1 と namespace2 の Kubernetes 名前空間で実行されている Pod からメトリクスをスクレイプするよう指示します。

4. **Prometheus アノテーションの設定**: コンテナ化されたワークロードからのメトリクス収集を有効にするには、適切な Prometheus アノテーションで Kubernetes の Pod またはサービスにアノテーションを付ける必要があります。これらのアノテーションは、メトリクスエンドポイントやその他の設定情報を提供します。
Prometheus アノテーションの例:
```yaml
annotations:
  prometheus.io/scrape: "true"
  prometheus.io/port: "8080"
  prometheus.io/path: "/metrics"
```  
これらのアノテーションは、Prometheus コレクターが Pod またはサービスのポート 8080 の /metrics エンドポイントからメトリクスをスクレイプすべきことを示しています。

5. **計装されたワークロードのデプロイ**: 適切なメトリクスエンドポイントを公開し、必要な Prometheus アノテーションを含むコンテナ化されたワークロードを EKS にデプロイします。Minikube、Helm、AWS Cloud Development Kit (CDK) などのツールを使用して、EKS ワークロードをデプロイおよび管理できます。

6. **メトリクス収集の確認**: Managed Prometheus Collector が設定され、ワークロードがデプロイされたら、収集されたメトリクスが AMP ワークスペースに表示されるはずです。AMP クエリエディターを使用して、EKS ワークロードからのメトリクスを探索および可視化できます。



## 追加の考慮事項

- 認証と認可：AMP は、IAM ロールやサービスアカウントなど、さまざまな認証および認可メカニズムをサポートしており、モニタリングデータへのアクセスを安全に保護します。

- AWS オブザーバビリティサービスとの統合：AMP を AWS CloudWatch や AWS X-Ray などの他の AWS オブザーバビリティサービスと統合することで、AWS 環境全体の包括的なオブザーバビリティを実現できます。

AMP の Managed Prometheus Collector を活用することで、基盤となる Prometheus インフラストラクチャを管理・スケーリングする必要なく、EKS コンテナ化ワークロードからメトリクスを効率的に収集・分析できます。AMP は、EKS アプリケーションとインフラストラクチャのモニタリングのためのフルマネージドでスケーラブルなソリューションを提供します。
