# Kubecost を使用したコストの可視化とリソースの適切なサイズ調整
Kubecost は、Kubernetes 環境での支出とリソース効率の可視化を顧客に提供します。
高レベルでは、Amazon EKS のコストモニタリングは Kubecost とともにデプロイされます。これには、オープンソースのモニタリングシステムおよび時系列データベースである Prometheus が含まれます。
Kubecost は Prometheus からメトリクスを読み取り、コスト割り当て計算を実行し、メトリクスを Prometheus に書き戻します。
最後に、Kubecost フロントエンドが Prometheus からメトリクスを読み取り、Kubecost ユーザーインターフェイス (UI) に表示します。
アーキテクチャは、次の図によって示されます。

![Architecture](../../images/kubecost-architecture.png)

## Kubecost を使用する理由

お客様がアプリケーションをモダナイズし、Amazon EKS を使用してワークロードをデプロイするにつれて、アプリケーションを実行するために必要なコンピューティングリソースを統合することで効率性が向上します。ただし、この利用効率の向上は、アプリケーションコストの測定がより困難になるというトレードオフが伴います。今日、テナントごとにコストを配分するために、次の方法のいずれかを使用できます。

* ハードマルチテナンシー - 専用の AWS アカウントで個別の EKS クラスターを実行します。 
* ソフトマルチテナンシー – 共有 EKS クラスターで複数のノードグループを実行します。
* 消費ベースの課金 – 共有 EKS クラスターで発生したコストをリソース消費量で計算します。

ハードマルチテナンシーでは、ワークロードが個別の EKS クラスターにデプロイされ、クラスターとその依存関係にかかるコストを特定できるため、各テナントの支出を判断するためのレポートを実行する必要がありません。 

ソフトマルテナンシーでは、[Node Selectors](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector) や [Node Affinity](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity) などの Kubernetes 機能を使用して、Kubernetes スケジューラーにテナントのワークロードを専用のノードグループで実行するように指示できます。ノードグループの EC2 インスタンスに識別子 (製品名やチーム名など) のタグを付け、[タグ](https://docs.aws.amazon.com/ja_jp/awsaccountbilling/latest/aboutv2/cost-alloc-tags.html) を使用してコストを配分できます。 

上記2つのアプローチの欠点は、未使用の容量が発生し、密にパックされたクラスターを実行するときに得られるコスト削減のメリットを十分に活用できないことです。Elastic Load Balancing やネットワーク転送料金などの共有リソースのコストを割り当てる方法がまだ必要です。

マルチテナント Kubernetes クラスターでコストを追跡する最も効率的な方法は、ワークロードによって消費されたリソース量に基づいて発生したコストを配分することです。このパターンにより、異なるワークロードがノードを共有できるため、ノードの pod 密度を高めることができ、EC2 インスタンスの利用を最大化できます。ただし、ワークロードまたは名前空間ごとにコストを計算することは非常に困難な作業です。ワークロードのコスト責任を理解するには、特定の期間中に消費または予約されたすべてのリソースを集計し、リソースのコストと使用期間に基づいて料金を評価する必要があります。これは、Kubecost が対処しようとしている正確な課題です。


!!! tip
    Kubecost のハンズオン体験のために、[One Observability ワークショップ](https://catalog.workshops.aws/observability/ja-JP/aws-managed-oss/amp/ingest-kubecost-metrics) をご覧ください。

## おすすめ

### コスト配分
Kubecost のコスト配分ダッシュボードを使用すると、ネイティブの Kubernetes の概念(名前空間、k8s ラベル、サービスなど)にわたる割り当て支出と最適化の機会をすばやく確認できます。また、チーム、製品/プロジェクト、部門、環境などの組織の概念にコストを割り当てることもできます。日付範囲やフィルターを変更して、特定のワークロードに関する洞察を導き出し、レポートを保存できます。 Kubernetes のコストを最適化するには、効率とクラスタのアイドルコストに注意を払う必要があります。

![Allocations](../../images/allocations.png)

### 効率性

Pod のリソース効率性は、特定の時間ウィンドウでのリソース利用率とリソース要求の比率として定義されます。これはコスト重視で、次のように表すことができます。
```
(((CPU Usage / CPU Requested) * CPU Cost) + ((RAM Usage / RAM Requested) * RAM Cost)) / (RAM Cost + CPU Cost)
```
ここで、CPU 使用量 = 時間ウィンドウにおける rate(container_cpu_usage_seconds_total)
RAM 使用量 = 時間ウィンドウにおける avg(container_memory_working_set_bytes)

AWS では明示的な RAM、CPU、GPU の価格が提供されていないため、Kubecost モデルは入力された基本的な CPU、GPU、RAM 価格の比率にフォールバックします。これらのパラメータのデフォルト値は、クラウドプロバイダの限界リソースレートに基づいていますが、Kubecost 内でカスタマイズすることができます。これらの基本リソース(RAM/CPU/GPU)価格は、プロバイダーからの課金レートに基づいてプロビジョニングされたノードの総価格の合計が等しくなるように正規化されます。

各サービスチームは、最大限の効率性を目指し、ワークロードを調整して目標を達成する責任があります。

### アイドルコスト
クラスタのアイドルコストは、割り当てられたリソースのコストと、それらが実行されているハードウェアのコストの差分として定義されます。割り当ては、使用量とリクエストの最大値として定義されます。次のようにも表すことができます。

```
idle_cost = sum(node_cost) - (cpu_allocation_cost + ram_allocation_cost + gpu_allocation_cost)
```
ここで、割り当て = 最大(リクエスト、使用量)

したがって、アイドルコストは、既存のワークロードを中断することなく、Kubernetes スケジューラがポッドをスケジュールできるスペースのコストとしても考えることができますが、現在はそうなっていません。ワークロードやクラスタ、ノードに分散させるように構成できます。

### ネットワークコスト

Kubecost はベストエフォートで、ネットワーク転送コストをそれらのコストを発生させるワークロードに割り当てます。
ネットワークコストを正確に判断するには、[AWS Cloud Integration](https://docs.kubecost.com/install-and-configure/install/cloud-integration/aws-cloud-integrations) と [Network costs daemonset](https://docs.kubecost.com/install-and-configure/advanced-configuration/network-costs-configuration) の組み合わせを使用します。

効率スコアとアイドルコストを考慮に入れ、クラスターの完全なポテンシャルを利用することを確認するために、ワークロードを微調整する必要があります。
これで、クラスターの Rightsizing という次のトピックに移ります。

### ワークロードの最適化

Kubecost は、Kubernetes ネイティブのメトリクスに基づいて、ワークロードの最適化推奨を提供します。kubecost UI の savings パネルは、最適化を開始するのに適しています。

![Savings](../../images/savings.png)

![Right-sizing](../../images/right-sizing.png)

Kubecost は以下の最適化を推奨できます:

* 過剰プロビジョニングおよび不足プロビジョニングの両方のコンテナリクエストを確認することにより、コンテナリクエストを適切にサイジング
* 未使用の容量に対する過剰支出を停止するために、クラスターノードの数とサイズを調整
* 有意なレートのトラフィックを送受信しない Pod をスケールダウン、削除、リサイズ
* スポットノードに対応可能なワークロードの特定 
* どの Pod からも使用されていないボリュームの特定

Kubecost には、Cluster Controller コンポーネントが有効になっている場合、コンテナリソースリクエストの推奨を自動的に実装できるプレリリース機能もあります。自動リクエストの最適化を使用すると、複雑な YAML のテストや kubectl コマンドを使用することなく、クラスタ全体でリソース割り当てを即座に最適化できます。クラスタのリソースの過剰割り当てを簡単に排除できるため、クラスタの最適化やその他の最適化による大幅なコスト削減の道が開かれます。

### Kubecost と Amazon Managed Service for Prometheus の統合

Kubecost は、Prometheus プロジェクトを時系列データベースとして利用し、Prometheus のデータを後処理してコスト割り当て計算を実行します。 クラスターのサイズやワークロードのスケールによっては、Prometheus サーバーがメトリクスをスクレイプおよび保存することが困難になる場合があります。 そのような場合は、Amazon Managed Service for Prometheus という、管理された Prometheus 互換のモニタリングサービスを使用して、メトリクスを信頼性高く保存し、Kubernetes のコストを大規模に簡単に監視できるようにすることができます。

[Kubecost サービスアカウントの IAM ロールを設定](https://docs.aws.amazon.com/ja_jp/eks/latest/userguide/iam-roles-for-service-accounts.html)する必要があります。 クラスターの OIDC プロバイダーを使用することで、クラスターのサービスアカウントに IAM アクセス許可を付与します。 kubecost-cost-analyzer および kubecost-prometheus-server のサービスアカウントに適切なアクセス許可を付与する必要があります。 これらは、ワークスペースからメトリクスを送受信するために使用されます。 コマンドラインで次のコマンドを実行します:

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

`CLUSTER_NAME` は Kubecost をインストールする Amazon EKS クラスターの名前で、<region> は Amazon EKS クラスターのリージョンです。

完了したら、次のように Kubecost helm チャートをアップグレードする必要があります:

```
helm upgrade -i kubecost \
oci://public.ecr.aws/kubecost/cost-analyzer --version <$VERSION> \
--namespace kubecost --create-namespace \
-f https://tinyurl.com/kubecost-amazon-eks \
-f https://tinyurl.com/kubecost-amp \
--set global.amp.prometheusServerEndpoint=${QUERYURL} \
--set global.amp.remoteWriteService=${REMOTEWRITEURL}
```

</region></region></cluster_name></region></cluster_name>

### Kubecost UI へのアクセス

Kubecost は、kubectl port-forward、ingress、ロードバランサーを介してアクセスできる Web ダッシュボードを提供します。Kubecost のエンタープライズ版では、[SSO/SAML](https://docs.kubecost.com/install-and-configure/advanced-configuration/user-management-oidc) を使用したダッシュボードへのアクセス制限や、異なるレベルのアクセス権限の付与もサポートしています。たとえば、チームの表示をそのチームが担当する製品に限定する、といったことができます。

AWS 環境では、Kubecost を公開するために [AWS Load Balancer Controller](https://docs.aws.amazon.com/eks/latest/userguide/aws-load-balancer-controller.html) の使用を検討し、認証、認可、ユーザー管理には [Amazon Cognito](https://aws.amazon.com/cognito/) を使用することをおすすめします。こちらの記事 [How to use Application Load Balancer and Amazon Cognito to authenticate users for your Kubernetes web apps](https://aws.amazon.com/blogs/containers/how-to-use-application-load-balancer-and-amazon-cognito-to-authenticate-users-for-your-kubernetes-web-apps/) で、より詳しく学ぶことができます。

### マルチクラスタービュー

FinOps チームは、ビジネスオーナーとの推奨事項を共有するために EKS クラスターを確認したいと考えているでしょう。大規模に運用する場合、チームが推奨事項を表示するために各クラスタにログインすることは困難になります。マルチクラスターを使用すると、グローバルに集計されたすべてのクラスターコストを一括して表示できます。Kubecost がサポートしている複数のクラスターを持つ環境には、Kubecost Free、Kubecost Business、Kubecost Enterprise の 3 つのオプションがあります。Free モードと Business モードでは、クラウド課金との差分調整は各クラスターレベルで実行されます。Enterprise モードでは、メトリクスが保存されている共有バケットを使用し、kubecost UI を提供するプライマリークラスターでクラウド課金との差分調整が実行されます。
メトリクスの保持が無制限になるのは、Enterprise モードを使用している場合のみであることに注意してください。

### 参考文献
* [One Observability ワークショップでの Kubecost のハンズオン体験](https://catalog.workshops.aws/observability/ja-JP/aws-managed-oss/amp/ingest-kubecost-metrics)
* [ブログ - Kubecost と Amazon Managed Service for Prometheus の統合](https://aws.amazon.com/blogs/mt/integrating-kubecost-with-amazon-managed-service-for-prometheus/)
