# Kubecost の使用
Kubecost は、Kubernetes 環境における支出とリソース効率の可視性をお客様に提供します。大まかに言えば、Amazon EKS コスト監視は Kubecost とともにデプロイされ、これにはオープンソースの監視システムおよび時系列データベースである Prometheus が含まれます。Kubecost は Prometheus からメトリクスを読み取り、コスト配分計算を実行して、メトリクスを Prometheus に書き戻します。最後に、Kubecost フロントエンドが Prometheus からメトリクスを読み取り、Kubecost ユーザーインターフェイス (UI) に表示します。このアーキテクチャを次の図に示します。

![Architecture](../../images/kubecost-architecture.png)

## Kubecost を使用する理由
お客様がアプリケーションを最新化し、Amazon EKS を使用してワークロードをデプロイすると、アプリケーションの実行に必要なコンピューティングリソースを統合することで効率性が向上します。ただし、この使用率の効率化は、アプリケーションコストの測定が困難になるというトレードオフを伴います。現在、テナント別にコストを配分するには、次のいずれかの方法を使用できます。

* ハードマルチテナンシー — 専用の AWS アカウントで個別の EKS クラスターを実行します。
* ソフトマルチテナンシー — 共有 EKS クラスターで複数のノードグループを実行します。
* 消費ベースの課金 — リソース消費を使用して、共有 EKS クラスターで発生したコストを計算します。

ハードマルチテナンシーでは、ワークロードは個別の EKS クラスターにデプロイされ、各テナントの支出を決定するためにレポートを実行することなく、クラスターとその依存関係に対して発生したコストを特定できます。
ソフトマルチテナンシーでは、[Node Selectors](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector) や [Node Affinity](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity) などの Kubernetes 機能を使用して、Kubernetes Scheduler に専用のノードグループでテナントのワークロードを実行するよう指示できます。ノードグループ内の EC2 インスタンスに識別子（製品名やチーム名など）でタグを付け、[タグ](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/cost-alloc-tags.html)を使用してコストを配分できます。
上記の 2 つのアプローチの欠点は、未使用の容量が発生し、密にパックされたクラスターを実行する際に得られるコスト削減を完全に活用できない可能性があることです。Elastic Load Balancing やネットワーク転送料金などの共有リソースのコストを配分する方法が依然として必要です。

マルチテナント Kubernetes クラスターでコストを追跡する最も効率的な方法は、ワークロードが消費するリソースの量に基づいて発生したコストを分散することです。このパターンにより、異なるワークロードがノードを共有できるため、EC2 インスタンスの使用率を最大化でき、ノード上のポッド密度を高めることができます。ただし、ワークロードまたは名前空間ごとにコストを計算することは困難な作業です。ワークロードのコスト責任を理解するには、一定期間中に消費または予約されたすべてのリソースを集計し、リソースのコストと使用期間に基づいて料金を評価する必要があります。これこそが、Kubecost が取り組むことに専念している課題です。

:::tip
    Kubecost のハンズオン体験については、[One Observability Workshop](https://catalog.workshops.aws/observability/en-US/aws-managed-oss/amp/ingest-kubecost-metrics) をご覧ください。
:::

## 推奨事項
### コスト配分
Kubecost Cost Allocation ダッシュボードを使用すると、すべてのネイティブ Kubernetes 概念（namespace、k8s label、service など）全体で割り当てられた支出と最適化の機会をすばやく確認できます。また、チーム、製品/プロジェクト、部門、環境などの組織的な概念にコストを割り当てることもできます。日付範囲やフィルターを変更して、特定のワークロードに関する洞察を導き出し、レポートを保存できます。Kubernetes のコストを最適化するには、効率性とクラスターのアイドルコストに注意を払う必要があります。

![Allocations](../../images/allocations.png)

### 効率性

Pod リソース効率は、特定の時間枠におけるリソース使用率とリソースリクエストの比率として定義されます。これはコスト加重され、次のように表現できます。
```
(((CPU Usage / CPU Requested) * CPU Cost) + ((RAM Usage / RAM Requested) * RAM Cost)) / (RAM Cost + CPU Cost)
```
ここで CPU Usage = 時間枠における rate(container_cpu_usage_seconds_total) RAM Usage = 時間枠における avg(container_memory_working_set_bytes)

AWS では明示的な RAM、CPU、GPU の価格が提供されていないため、Kubecost モデルは提供されたベース CPU、GPU、RAM 価格入力の比率にフォールバックします。これらのパラメータのデフォルト値は、クラウドプロバイダーの限界リソースレートに基づいていますが、Kubecost 内でカスタマイズできます。これらのベースリソース (RAM/CPU/GPU) 価格は、プロバイダーからの請求レートに基づいて、プロビジョニングされたノードの合計価格と各コンポーネントの合計が等しくなるように正規化されます。

最大限の効率性を目指し、ワークロードを微調整して目標を達成することは、各サービスチームの責任です。

### アイドルコスト
クラスターのアイドルコストは、割り当てられたリソースのコストと、それらが実行されるハードウェアのコストとの差として定義されます。割り当ては、使用量とリクエストの最大値として定義されます。次のように表すこともできます。
```
idle_cost = sum(node_cost) - (cpu_allocation_cost + ram_allocation_cost + gpu_allocation_cost)
where allocation = max(request, usage)
```

したがって、アイドルコストは、Kubernetes スケジューラが既存のワークロードを中断することなくポッドをスケジュールできるスペースのコストとして考えることもできますが、現在は使用されていません。設定方法に応じて、ワークロード、クラスター、またはノード単位で配分できます。


### ネットワークコスト

Kubecost は、これらのコストを生成するワークロードにネットワーク転送コストを割り当てるためにベストエフォートを使用します。ネットワークコストを正確に判断する方法は、[AWS Cloud Integration](https://www.ibm.com/docs/en/kubecost/self-hosted/3.x?topic=integration-aws-cloud-using-irsaeks-pod-identities) と [Network costs daemonset](https://docs.kubecost.com/install-and-configure/advanced-configuration/network-costs-configuration) の組み合わせを使用することです。

効率性スコアとアイドルコストを考慮して、ワークロードを微調整し、クラスターを完全に活用できるようにする必要があります。これにより、次のトピックであるクラスターの適切なサイジングに進みます。

### ワークロードの適切なサイジング

Kubecost は、Kubernetes ネイティブのメトリクスに基づいて、ワークロードのライトサイジング推奨事項を提供します。kubecost UI の節約パネルは、開始するのに最適な場所です。

![Savings](../../images/savings.png)

![Right-sizing](../../images/right-sizing.png)

Kubecost は以下に関する推奨事項を提供できます。

* 過剰プロビジョニングおよび不足プロビジョニングされたコンテナリクエストの両方を確認して、コンテナリクエストを適切なサイズに調整する
* 未使用容量への過剰支出を停止するために、クラスターノードの数とサイズを調整する
* 有意義なトラフィックレートを送受信しないポッドをスケールダウン、削除、またはサイズ変更する
* スポットノードに対応可能なワークロードを特定する
* どのポッドからも使用されていないボリュームを特定する

Kubecost には、Cluster Controller コンポーネントを有効にしている場合、コンテナリソースリクエストに関する推奨事項を自動的に実装できるプレリリース機能もあります。自動リクエスト適正化を使用すると、過度な YAML や複雑な kubectl コマンドをテストすることなく、クラスタ全体のリソース割り当てを即座に最適化できます。クラスタ内のリソースの過剰割り当てを簡単に排除でき、クラスタの適正化やその他の最適化による大幅なコスト削減への道を開きます。

### Kubecost と Amazon Managed Service for Prometheus の統合

Kubecost は、オープンソースの Prometheus プロジェクトを時系列データベースとして活用し、Prometheus 内のデータを後処理してコスト配分計算を実行します。クラスターのサイズとワークロードの規模によっては、Prometheus サーバーがメトリクスをスクレイピングして保存することが負担になる可能性があります。このような場合、Amazon Managed Service for Prometheus (Prometheus 互換のマネージド型モニタリングサービス) を使用してメトリクスを確実に保存し、Kubernetes のコストを大規模に簡単に監視できるようにすることができます。

[Kubecost サービスアカウント用の IAM ロール](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html)を設定する必要があります。クラスターの OIDC プロバイダーを使用して、クラスターのサービスアカウントに IAM アクセス許可を付与します。kubecost-cost-analyzer と kubecost-prometheus-server サービスアカウントに適切なアクセス許可を付与する必要があります。これらは、ワークスペースとの間でメトリクスを送信および取得するために使用されます。コマンドラインで次のコマンドを実行します。

```
eksctl create iamserviceaccount \ 
--name kubecost-cost-analyzer \ 
--namespace kubecost \ 
--cluster <CLUSTER_NAME> \
--region <REGION> \ 
--attach-policy-arn arn:aws:iam::aws:policy/AmazonPrometheusQueryAccess \ 
--attach-policy-arn arn:aws:iam::aws:policy/AmazonPrometheusRemoteWriteAccess \ 
--override-existing-serviceaccounts \ 
--approve 

eksctl create iamserviceaccount \ 
--name kubecost-prometheus-server \ 
--namespace kubecost \ 
--cluster <CLUSTER_NAME> --region <REGION> \ 
--attach-policy-arn arn:aws:iam::aws:policy/AmazonPrometheusQueryAccess \ 
--attach-policy-arn arn:aws:iam::aws:policy/AmazonPrometheusRemoteWriteAccess \ 
--override-existing-serviceaccounts \ 
--approve

```
`CLUSTER_NAME` は、Kubecost をインストールする Amazon EKS クラスターの名前で、「REGION」は Amazon EKS クラスターのリージョンです。

完了したら、以下のように Kubecost helm チャートをアップグレードする必要があります。
```
helm upgrade -i kubecost \
oci://public.ecr.aws/kubecost/cost-analyzer --version <$VERSION> \
--namespace kubecost --create-namespace \
-f https://tinyurl.com/kubecost-amazon-eks \
-f https://tinyurl.com/kubecost-amp \
--set global.amp.prometheusServerEndpoint=${QUERYURL} \
--set global.amp.remoteWriteService=${REMOTEWRITEURL}
```
### Kubecost UI へのアクセス

Kubecost は、kubectl port-forward、ingress、またはロードバランサーを通じてアクセスできる Web ダッシュボードを提供します。Kubecost のエンタープライズ版は、[SSO/SAML](https://www.ibm.com/docs/en/kubecost/self-hosted/3.x?topic=configuration-user-management-oidc) を使用したダッシュボードへのアクセス制限と、さまざまなレベルのアクセス権限の提供もサポートしています。たとえば、チームのビューを担当する製品のみに制限できます。

AWS 環境では、[AWS Load Balancer Controller](https://docs.aws.amazon.com/eks/latest/userguide/aws-load-balancer-controller.html) を使用して Kubecost を公開し、[Amazon Cognito](https://aws.amazon.com/cognito/) を認証、認可、ユーザー管理に使用することを検討してください。詳細については、[Application Load Balancer と Amazon Cognito を使用して Kubernetes ウェブアプリのユーザーを認証する方法](https://aws.amazon.com/blogs/containers/how-to-use-application-load-balancer-and-amazon-cognito-to-authenticate-users-for-your-kubernetes-web-apps/)を参照してください。


### マルチクラスタービュー

FinOps チームは、EKS クラスターをレビューして、ビジネスオーナーと推奨事項を共有したいと考えるでしょう。大規模に運用する場合、各クラスターにログインして推奨事項を確認することは、チームにとって困難になります。マルチクラスターを使用すると、グローバルに集約されたすべてのクラスターコストを単一画面で表示できます。Kubecost が複数のクラスターを持つ環境でサポートするオプションは 3 つあります。Kubecost Free、Kubecost Business、Kubecost Enterprise です。Free モードと Business モードでは、クラウド請求の調整は各クラスターレベルで実行されます。Enterprise モードでは、クラウド請求の調整は、Kubecost UI を提供し、メトリクスが保存される共有バケットを使用するプライマリクラスターで実行されます。
メトリクスの保持期間が無制限になるのは、Enterprise モードを使用する場合のみであることに注意することが重要です。

### 参考資料
* [One Observability Workshop での Kubecost ハンズオン体験](https://catalog.workshops.aws/observability/en-US/aws-managed-oss/amp/ingest-kubecost-metrics)
* [ブログ - Kubecost と Amazon Managed Service for Prometheus の統合](https://aws.amazon.com/blogs/mt/integrating-kubecost-with-amazon-managed-service-for-prometheus/)
