# EKS から Prometheus へのメトリクスの送信

Amazon Elastic Kubernetes Service (EKS) でコンテナ化されたワークロードを実行する場合、AWS Managed Prometheus (AMP) を活用してアプリケーションとインフラストラクチャからメトリクスを収集・分析できます。
AMP は、完全マネージド型の Prometheus 互換のモニタリングソリューションを提供することで、Prometheus 互換のモニタリングのデプロイと管理を簡素化します。

EKS のコンテナ化されたワークロードから AMP にメトリクスを送信するには、Managed Prometheus Collector の設定を使用できます。
Managed Prometheus Collector は AMP のコンポーネントで、アプリケーションやサービスからメトリクスを収集し、保存と分析のために AMP ワークスペースに送信します。

![EKS AMP](./images/eksamp.png)
*図 1: EKS から AMP へのメトリクスの送信*



## Managed Prometheus Collector の設定

1. **AMP ワークスペースの有効化**: まず、AWS アカウントに AMP ワークスペースが作成されていることを確認します。まだ AMP ワークスペースを設定していない場合は、AWS ドキュメントに従って作成してください。

2. **Managed Prometheus Collector の設定**: AMP ワークスペース内で、「Managed Prometheus Collectors」セクションに移動し、新しいコレクター設定を作成します。

3. **スクレイプ設定の定義**: コレクター設定で、メトリクスを収集するターゲットを指定します。EKS ワークロードの場合、Kubernetes サービスディスカバリー設定を定義して、コレクターが Kubernetes Pod とサービスからメトリクスを動的に検出し収集できるようにします。

  Kubernetes サービスディスカバリー設定の例:

  ```yaml
  kubernetes_sd_configs:
    - role: pod
      namespaces:
        names:
          - namespace1
          - namespace2
```          
この設定は、コレクターに namespace1 と namespace2 の Kubernetes 名前空間で実行されている Pod からメトリクスを収集するように指示します。

4. **Prometheus アノテーションの設定**: コンテナ化されたワークロードからメトリクスを収集するには、Kubernetes Pod またはサービスに適切な Prometheus アノテーションを付ける必要があります。これらのアノテーションは、メトリクスエンドポイントやその他の設定情報を提供します。
Prometheus アノテーションの例:
```yaml
annotations:
  prometheus.io/scrape: "true"
  prometheus.io/port: "8080"
  prometheus.io/path: "/metrics"
```  
これらのアノテーションは、Prometheus コレクターが Pod またはサービスのポート 8080 の /metrics エンドポイントからメトリクスを収集すべきことを示しています。

5. **計装されたワークロードのデプロイ**: コンテナ化されたワークロードを EKS にデプロイし、適切なメトリクスエンドポイントを公開し、必要な Prometheus アノテーションが含まれていることを確認します。Minikube、Helm、AWS Cloud Development Kit (CDK) などのツールを使用して、EKS ワークロードのデプロイと管理を行うことができます。

6. **メトリクス収集の確認**: Managed Prometheus Collector が設定され、ワークロードがデプロイされると、収集されたメトリクスが AMP ワークスペースに表示されるはずです。AMP クエリエディターを使用して、EKS ワークロードからのメトリクスを探索し、視覚化することができます。




## その他の考慮事項

- 認証と認可：AMP は、モニタリングデータへのアクセスを保護するために、IAM ロールやサービスアカウントなど、さまざまな認証および認可メカニズムをサポートしています。

- AWS オブザーバビリティサービスとの統合：AWS 環境全体の包括的なオブザーバビリティを実現するために、AMP を AWS CloudWatch や AWS X-Ray などの他の AWS オブザーバビリティサービスと統合できます。

AMP の Managed Prometheus Collector を活用することで、基盤となる Prometheus インフラストラクチャを管理・スケーリングすることなく、EKS コンテナワークロードからメトリクスを効率的に収集・分析できます。
AMP は、EKS アプリケーションとインフラストラクチャのモニタリングのためのフルマネージドでスケーラブルなソリューションを提供します。
