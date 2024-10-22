# EKS から Prometheus へメトリクスを送信する

Amazon Elastic Kubernetes Service (EKS) でコンテナ化されたワークロードを実行する場合、AWS Managed Prometheus (AMP) を利用してアプリケーションとインフラストラクチャからメトリクスを収集・分析できます。AMP は、Prometheus 互換のモニタリングソリューションを完全に管理されたサービスとして提供することで、Prometheus 互換のモニタリングのデプロイと管理を簡素化します。

EKS のコンテナ化されたワークロードから AMP にメトリクスを送信するには、Managed Prometheus Collector 設定を使用できます。Managed Prometheus Collector は、AMP の構成要素で、アプリケーションとサービスからメトリクスを収集し、AMP ワークスペースに送信して保存と分析を行います。

![EKS AMP](./images/eksamp.png)
*図 1: EKS から AMP へメトリクスを送信する*

## Managed Prometheus Collector の設定

1. **AMP ワークスペースの有効化**: まず、AWS アカウントに AMP ワークスペースが作成されていることを確認します。AMP ワークスペースをまだ設定していない場合は、AWS のドキュメントに従って作成してください。

2. **Managed Prometheus Collector の設定**: AMP ワークスペース内で、「Managed Prometheus Collectors」セクションに移動し、新しいコレクター設定を作成します。

3. **スクレイプ設定の定義**: コレクター設定で、コレクターがメトリクスをスクレイプする対象を指定します。EKS ワークロードの場合、Kubernetes サービス検出設定を定義して、コレクターが動的に Kubernetes Pod とサービスからメトリクスを検出してスクレイプできるようにします。

  Kubernetes サービス検出設定の例:

  ```yaml
  kubernetes_sd_configs:
    - role: pod
      namespaces:
        names:
          - namespace1
          - namespace2
```
この設定により、コレクターは namespace1 と namespace2 の Kubernetes 名前空間で実行されている Pod からメトリクスをスクレイプするよう指示されます。

4. **Prometheus アノテーションの設定**: コンテナ化されたワークロードからメトリクスを収集できるようにするには、Kubernetes Pod またはサービスに適切な Prometheus アノテーションを付ける必要があります。これらのアノテーションは、メトリクスエンドポイントやその他の設定情報を提供します。
Prometheus アノテーションの例:
```yaml
annotations:
  prometheus.io/scrape: "true"
  prometheus.io/port: "8080"
  prometheus.io/path: "/metrics"
```
これらのアノテーションは、Prometheus コレクターが Pod またはサービスのポート 8080 の /metrics エンドポイントからメトリクスをスクレイプする必要があることを示しています。

5. **インストルメンテーション付きのワークロードのデプロイ**: 適切なメトリクスエンドポイントを公開し、必要な Prometheus アノテーションを含むコンテナ化されたワークロードを EKS にデプロイします。Minikube、Helm、または AWS Cloud Development Kit (CDK) などのツールを使用して、EKS ワークロードをデプロイおよび管理できます。

6. **メトリクス収集の確認**: Managed Prometheus Collector が設定され、ワークロードがデプロイされると、収集されたメトリクスが AMP ワークスペースに表示されるはずです。AMP クエリエディターを使用して、EKS ワークロードからのメトリクスを探索および可視化できます。

## その他の考慮事項

- 認証と承認: AMP は、IAM ロールやサービスアカウントなど、さまざまな認証と承認のメカニズムをサポートしており、モニタリングデータへのアクセスを安全に保護できます。

- AWS Observability サービスとの統合: AMP を AWS CloudWatch や AWS X-Ray などの他の AWS Observability サービスと統合することで、AWS 環境全体の包括的なオブザーバビリティを実現できます。

AMP の Managed Prometheus Collector を活用することで、基盤となる Prometheus インフラストラクチャの管理やスケーリングの必要がなく、EKS コンテナ化されたワークロードからメトリクスを効率的に収集・分析できます。AMP は、EKS アプリケーションとインフラストラクチャを監視するための、完全に管理され、スケーラブルなソリューションを提供します。
