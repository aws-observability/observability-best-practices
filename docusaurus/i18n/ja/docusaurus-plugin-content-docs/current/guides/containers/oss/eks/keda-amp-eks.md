# AMP と EKS で KEDA を使用したアプリケーションの自動スケーリング

# 現状

Amazon EKS アプリケーションのトラフィック増加への対応は困難であり、手動スケーリングは非効率的でエラーが発生しやすくなります。オートスケーリングは、リソース割り当てのためのより優れたソリューションを提供します。KEDA は、さまざまなメトリクスとイベントに基づいて Kubernetes のオートスケーリングを可能にし、Amazon Managed Service for Prometheus は EKS クラスターに対して安全なメトリクス監視を提供します。このソリューションは、KEDA と Amazon Managed Service for Prometheus を組み合わせ、Requests Per Second (RPS) メトリクスに基づくオートスケーリングを実証します。このアプローチは、ワークロードの需要に合わせた自動スケーリングを提供し、ユーザーは自身の EKS ワークロードに適用できます。Amazon Managed Grafana は、スケーリングパターンの監視と可視化に使用され、ユーザーはオートスケーリングの動作に関する洞察を得て、それらをビジネスイベントと関連付けることができます。


# KEDA を使用した AMP メトリクスに基づくアプリケーションの自動スケーリング 

![keda-arch](../../../../images/Containers/oss/eks/arch.png)

このソリューションは、自動スケーリングパイプラインを作成するための AWS とオープンソースソフトウェアの統合を実証します。マネージド Kubernetes のための Amazon EKS、メトリクス収集のための AWS Distro for Open Telemetry (ADOT)、イベント駆動型オートスケーリングのための KEDA、メトリクスストレージのための Amazon Managed Service for Prometheus、および可視化のための Amazon Managed Grafana を組み合わせています。このアーキテクチャには、EKS への KEDA のデプロイ、メトリクスをスクレイピングするための ADOT の設定、KEDA ScaledObject を使用したオートスケーリングルールの定義、およびスケーリングを監視するための Grafana ダッシュボードの使用が含まれます。オートスケーリングプロセスは、マイクロサービスへのユーザーリクエストから始まり、ADOT がメトリクスを収集し、それらを Prometheus に送信します。KEDA は定期的にこれらのメトリクスをクエリし、スケーリングの必要性を判断し、Horizontal Pod Autoscaler (HPA) と連携してポッドレプリカを調整します。このセットアップにより、Kubernetes マイクロサービスのメトリクス駆動型オートスケーリングが可能になり、さまざまな使用率指標に基づいてスケールできる柔軟なクラウドネイティブアーキテクチャを提供します。



# AMP メトリクスを使用した KEDA によるクロスアカウント EKS アプリケーションスケーリング
この場合、KEDA EKS が ID 末尾 117 の AWS アカウントで実行されており、中央 AMP アカウント ID の末尾が 814 であると仮定します。KEDA EKS アカウントで、以下のようにクロスアカウント IAM ロールを設定します。

![keda1](../../../../images/Containers/oss/eks/keda1.png)

また、信頼関係を以下のように更新する必要があります。
![keda2](../../../../images/Containers/oss/eks/keda2.png)

EKS クラスター内では、ここで IRSA が使用されているため、Pod identity を使用していないことがわかります。
![keda3](../../../../images/Containers/oss/eks/keda3.png)

中央の AMP アカウントでは、以下のように AMP アクセスを設定しています
![keda4](../../../../images/Containers/oss/eks/keda4.png)

信頼関係にもアクセス権があります
![keda5](../../../../images/Containers/oss/eks/keda5.png)

以下のようにワークスペース ID をメモしてください
![keda6](../../../../images/Containers/oss/eks/keda6.png)

## KEDA 設定
セットアップが完了したら、以下のように keda が実行されていることを確認します。セットアップ手順については、以下で共有されているブログリンクを参照してください

![keda7](../../../../images/Containers/oss/eks/keda7.png)

上記で定義した中央の AMP ロールを設定で使用するようにしてください。
![keda8](../../../../images/Containers/oss/eks/keda8.png)

KEDA スケーラー設定で、以下のように中央の AMP アカウントを指定します。
![keda9](../../../../images/Containers/oss/eks/keda9.png)

これで、Pod が適切にスケーリングされていることを確認できます。
![keda10](../../../../images/Containers/oss/eks/keda10.png)


## ブログ

[https://aws.amazon.com/blogs/mt/autoscaling-kubernetes-workloads-with-keda-using-amazon-managed-service-for-prometheus-metrics/](https://aws.amazon.com/blogs/mt/autoscaling-kubernetes-workloads-with-keda-using-amazon-managed-service-for-prometheus-metrics/)
