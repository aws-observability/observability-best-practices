# Amazon Managed Service for Prometheus を使用して EKS 上の App Mesh 環境を監視する

このレシピでは、[Amazon Elastic Kubernetes Service](https://aws.amazon.com/jp/eks/) (EKS) クラスターの [App Mesh](https://docs.aws.amazon.com/ja_jp/app-mesh/) Envoy メトリクスを [Amazon Managed Service for Prometheus](https://aws.amazon.com/jp/prometheus/) (AMP) に取り込み、[Amazon Managed Grafana](https://aws.amazon.com/jp/grafana/) (AMG) 上にカスタムダッシュボードを作成してマイクロサービスの健全性とパフォーマンスを監視する方法を説明します。

実装の一環として、AMP ワークスペースを作成し、Kubernetes 用の App Mesh コントローラーをインストールして、Pod に Envoy コンテナを注入します。EKS クラスターで設定された [Grafana Agent](https://github.com/grafana/agent) を使用して Envoy メトリクスを収集し、AMP に書き込みます。最後に、AMG ワークスペースを作成し、AMP をデータソースとして設定してカスタムダッシュボードを作成します。

:::note
    このガイドは完了までに約 45 分かかります。
:::



## インフラストラクチャ
以下のセクションでは、このレシピのインフラストラクチャをセットアップします。




### アーキテクチャ


![Architecture](../images/monitoring-appmesh-environment.png)

Grafana エージェントは、Envoy メトリクスをスクレイピングし、AMP リモートライトエンドポイントを通じて AMP に取り込むように設定されています。

:::info 
    AMP の Prometheus Remote Write Exporter の詳細については、
    [Getting Started with Prometheus Remote Write Exporter for AMP](https://aws-otel.github.io/docs/getting-started/prometheus-remote-write-exporter) をご覧ください。
:::



### 前提条件

* 環境に AWS CLI が[インストール](https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/cli-chap-install.html)され、[設定](https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/cli-chap-configure.html)されていること。
* 環境に [eksctl](https://docs.aws.amazon.com/ja_jp/eks/latest/userguide/eksctl.html) コマンドをインストールする必要があります。
* 環境に [kubectl](https://docs.aws.amazon.com/ja_jp/eks/latest/userguide/install-kubectl.html) をインストールする必要があります。
* 環境に [Docker](https://docs.docker.com/get-docker/) がインストールされていること。
* AWS アカウントで AMP ワークスペースが設定されていること。
* [Helm](https://www.eksworkshop.com/beginner/060_helm/helm_intro/install/index.html) をインストールする必要があります。
* [AWS-SSO](https://docs.aws.amazon.com/ja_jp/singlesignon/latest/userguide/step1.html) を有効にする必要があります。



### EKS クラスターのセットアップ

まず、サンプルアプリケーションを実行するために App Mesh を有効にした EKS クラスターを作成します。
`eksctl` CLI を使用して、[eks-cluster-config.yaml](./servicemesh-monitoring-ampamg/eks-cluster-config.yaml) でクラスターをデプロイします。
このテンプレートは、EKS で新しいクラスターを作成します。

テンプレートファイルを編集し、AMP が利用可能な以下のリージョンのいずれかを設定してください：

* `us-east-1`
* `us-east-2`
* `us-west-2`
* `eu-central-1`
* `eu-west-1`

セッションでこのリージョンを上書きしてください。例えば、Bash シェルでは以下のようにします：

```
export AWS_REGION=eu-west-1
```

以下のコマンドを使用してクラスターを作成します：

```
eksctl create cluster -f eks-cluster-config.yaml
```
これにより、`AMP-EKS-CLUSTER` という名前の EKS クラスターと、EKS の App Mesh コントローラーが使用する `appmesh-controller` という名前のサービスアカウントが作成されます。



### App Mesh Controller のインストール

次に、以下のコマンドを実行して [App Mesh Controller](https://docs.aws.amazon.com/ja_jp/app-mesh/latest/userguide/getting-started-kubernetes.html) をインストールし、カスタムリソース定義 (CRD) を設定します。

```
helm repo add eks https://aws.github.io/eks-charts
```

```
helm upgrade -i appmesh-controller eks/appmesh-controller \
     --namespace appmesh-system \
     --set region=${AWS_REGION} \
     --set serviceAccount.create=false \
     --set serviceAccount.name=appmesh-controller
```



### AMP のセットアップ
AMP ワークスペースは、Envoy から収集された Prometheus メトリクスを取り込むために使用されます。
ワークスペースは、テナント専用の論理的な Cortex サーバーです。
ワークスペースは、更新、一覧表示、説明、削除などの管理操作の認可、およびメトリクスの取り込みとクエリに対して、きめ細かなアクセス制御をサポートしています。

AWS CLI を使用してワークスペースを作成します：

```
aws amp create-workspace --alias AMP-APPMESH --region $AWS_REGION
```

必要な Helm リポジトリを追加します：

```
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts && \
helm repo add kube-state-metrics https://kubernetes.github.io/kube-state-metrics 
```

AMP の詳細については、[AMP Getting started](https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/AMP-getting-started.html) ガイドを参照してください。



### メトリクスのスクレイピングと取り込み

AMP は、Kubernetes クラスター内のコンテナ化されたワークロードから運用メトリクスを直接スクレイプすることはできません。
この作業を実行するには、Prometheus サーバーまたは [AWS Distro for OpenTelemetry Collector](https://github.com/aws-observability/aws-otel-collector) や Grafana Agent などの OpenTelemetry エージェントをデプロイして管理する必要があります。
このレシピでは、Grafana Agent を設定して Envoy メトリクスをスクレイプし、AMP と AMG を使用して分析する手順を説明します。



#### Grafana Agent の設定

Grafana Agent は、完全な Prometheus サーバーを実行する代替となる軽量なソリューションです。
Prometheus エクスポーターの検出とスクレイピング、および Prometheus 互換のバックエンドへのメトリクスの送信に必要な部分を維持します。
また、Grafana Agent には AWS Identity and Access Management (IAM) 認証のための AWS Signature Version 4 (Sigv4) のネイティブサポートも含まれています。

ここでは、Prometheus メトリクスを AMP に送信するための IAM ロールを設定する手順を説明します。
EKS クラスターに Grafana Agent をインストールし、メトリクスを AMP に転送します。



#### アクセス許可の設定
Grafana Agent は、EKS クラスターで実行されているコンテナ化されたワークロードから運用メトリクスを収集し、AMP に送信します。
AMP に送信されるデータは、マネージドサービスの各クライアントリクエストを認証および承認するために、Sigv4 を使用して有効な AWS 認証情報で署名する必要があります。

Grafana Agent は、Kubernetes サービスアカウントの ID で実行されるように EKS クラスターにデプロイできます。
IAM ロールをサービスアカウント (IRSA) で使用することで、IAM ロールを Kubernetes サービスアカウントに関連付け、そのサービスアカウントを使用する Pod に IAM アクセス許可を付与できます。

以下のように IRSA のセットアップを準備します：

```
kubectl create namespace grafana-agent

export WORKSPACE=$(aws amp list-workspaces | jq -r '.workspaces[] | select(.alias=="AMP-APPMESH").workspaceId')
export ROLE_ARN=$(aws iam get-role --role-name EKS-GrafanaAgent-AMP-ServiceAccount-Role --query Role.Arn --output text)
export NAMESPACE="grafana-agent"
export REMOTE_WRITE_URL="https://aps-workspaces.$AWS_REGION.amazonaws.com/workspaces/$WORKSPACE/api/v1/remote_write"
```

[gca-permissions.sh](./servicemesh-monitoring-ampamg/gca-permissions.sh) シェルスクリプトを使用して、以下の手順を自動化できます（プレースホルダー変数 `YOUR_EKS_CLUSTER_NAME` を EKS クラスターの名前に置き換えてください）：

* AMP ワークスペースへのリモート書き込み権限を持つ IAM ポリシーを含む `EKS-GrafanaAgent-AMP-ServiceAccount-Role` という名前の IAM ロールを作成します。
* IAM ロールに関連付けられた `grafana-agent` 名前空間の下に `grafana-agent` という名前の Kubernetes サービスアカウントを作成します。
* IAM ロールと Amazon EKS クラスターでホストされている OIDC プロバイダー間の信頼関係を作成します。

`gca-permissions.sh` スクリプトを実行するには、`kubectl` と `eksctl` の CLI ツールが必要です。
これらは Amazon EKS クラスターにアクセスできるように設定されている必要があります。

次に、Envoy メトリクスを抽出するスクレイプ設定を含むマニフェストファイル [grafana-agent.yaml](./servicemesh-monitoring-ampamg/grafana-agent.yaml) を作成し、Grafana Agent をデプロイします。

:::note
    執筆時点では、Fargate 上の EKS ではデーモンセットがサポートされていないため、このソリューションは機能しません。
:::
この例では、`grafana-agent` という名前のデーモンセットと `grafana-agent-deployment` という名前のデプロイメントをデプロイします。
`grafana-agent` デーモンセットはクラスター上の Pod からメトリクスを収集し、`grafana-agent-deployment` デプロイメントは EKS コントロールプレーンなど、クラスター上に存在しないサービスからメトリクスを収集します。

```
kubectl apply -f grafana-agent.yaml
```
`grafana-agent` がデプロイされると、メトリクスを収集し、指定された AMP ワークスペースに取り込みます。
次に、EKS クラスターにサンプルアプリケーションをデプロイし、メトリクスの分析を開始します。



## サンプルアプリケーション

アプリケーションをインストールし Envoy コンテナを注入するために、Kubernetes 用の AppMesh コントローラーを使用します。

まず、サンプルリポジトリをクローンしてベースアプリケーションをインストールします：

```
git clone https://github.com/aws/aws-app-mesh-examples.git
```

次に、クラスターにリソースを適用します：

```
kubectl apply -f aws-app-mesh-examples/examples/apps/djapp/1_base_application
```

Pod のステータスを確認し、実行中であることを確認します：

```
$ kubectl -n prod get all

NAME                            READY   STATUS    RESTARTS   AGE
pod/dj-cb77484d7-gx9vk          1/1     Running   0          6m8s
pod/jazz-v1-6b6b6dd4fc-xxj9s    1/1     Running   0          6m8s
pod/metal-v1-584b9ccd88-kj7kf   1/1     Running   0          6m8s
```

次に、App Mesh コントローラーをインストールし、デプロイメントをメッシュ化します：

```
kubectl apply -f aws-app-mesh-examples/examples/apps/djapp/2_meshed_application/
kubectl rollout restart deployment -n prod dj jazz-v1 metal-v1
```

これで、各 Pod で 2 つのコンテナが実行されているのが確認できます：

```
$ kubectl -n prod get all
NAME                        READY   STATUS    RESTARTS   AGE
dj-7948b69dff-z6djf         2/2     Running   0          57s
jazz-v1-7cdc4fc4fc-wzc5d    2/2     Running   0          57s
metal-v1-7f499bb988-qtx7k   2/2     Running   0          57s
```

5 分間トラフィックを生成し、後ほど AMG で可視化します：

```
dj_pod=`kubectl get pod -n prod --no-headers -l app=dj -o jsonpath='{.items[*].metadata.name}'`

loop_counter=0
while [ $loop_counter -le 300 ] ; do \
kubectl exec -n prod -it $dj_pod  -c dj \
-- curl jazz.prod.svc.cluster.local:9080 ; echo ; loop_counter=$[$loop_counter+1] ; \
done
```



### AMG ワークスペースの作成

AMG ワークスペースを作成するには、[Getting Started with AMG](https://aws.amazon.com/jp/blogs/news/amazon-managed-grafana-getting-started/) のブログ記事の手順に従ってください。
ダッシュボードへのユーザーアクセスを許可するには、AWS SSO を有効にする必要があります。
ワークスペースの作成後、個々のユーザーまたはユーザーグループに Grafana ワークスペースへのアクセスを割り当てることができます。
デフォルトでは、ユーザータイプは viewer です。
ユーザーロールに基づいてユーザータイプを変更してください。
AMP ワークスペースをデータソースとして追加し、ダッシュボードの作成を開始します。

この例では、ユーザー名は `grafana-admin`、ユーザータイプは `Admin` です。
必要なデータソースを選択します。
設定を確認し、`Create workspace` を選択します。

![Creating AMP Workspace](../images/workspace-creation.png)



### AMG データソースの設定
AMG で AMP をデータソースとして設定するには、`Data sources` セクションで `Configure in Grafana` を選択します。これにより、ブラウザで Grafana ワークスペースが起動します。
また、ブラウザで Grafana ワークスペースの URL を手動で起動することもできます。

![Configuring Datasource](../images/configuring-amp-datasource.png)

スクリーンショットからわかるように、ダウンストリームのレイテンシー、接続数、レスポンスコードなどの Envoy メトリクスを表示できます。
表示されているフィルターを使用して、特定のアプリケーションの Envoy メトリクスを詳しく調べることができます。



### AMG ダッシュボードの設定

データソースの設定が完了したら、カスタムダッシュボードをインポートして Envoy メトリクスを分析します。
ここでは事前に定義されたダッシュボードを使用するため、以下に示すように `Import` を選択し、ID `11022` を入力します。
これにより Envoy Global ダッシュボードがインポートされ、Envoy メトリクスの分析を開始できます。

![Custom Dashboard](../images/import-dashboard.png)



### AMG でアラートを設定する
メトリクスが意図した閾値を超えた場合に Grafana アラートを設定できます。
AMG では、ダッシュボードでアラートの評価頻度を設定し、通知を送信することができます。
アラートルールを作成する前に、通知チャネルを作成する必要があります。

この例では、Amazon SNS を通知チャネルとして設定します。
[サービスマネージド権限](https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/AMG-manage-permissions.html) のデフォルト設定を使用する場合、通知を正常にトピックに発行するには、SNS トピックの名前に `grafana` というプレフィックスを付ける必要があります。

以下のコマンドを使用して、`grafana-notification` という名前の SNS トピックを作成します：

```
aws sns create-topic --name grafana-notification
```

そして、メールアドレスでサブスクライブします。
以下のコマンドでリージョンとアカウント ID を指定してください：

```
aws sns subscribe \
    --topic-arn arn:aws:sns:<region>:<account-id>:grafana-notification \
	--protocol email \
	--notification-endpoint <email-id>
```

次に、Grafana ダッシュボードから新しい通知チャネルを追加します。
grafana-notification という名前の新しい通知チャネルを設定します。
Type には、ドロップダウンから AWS SNS を選択します。
Topic には、作成した SNS トピックの ARN を使用します。
Auth provider には、AWS SDK Default を選択します。

![Creating Notification Channel](../images/alert-configuration.png)

次に、1 分間のダウンストリームレイテンシーが 5 ミリ秒を超えた場合のアラートを設定します。
ダッシュボードで、ドロップダウンから Downstream latency を選択し、Edit を選択します。
グラフパネルの Alert タブで、アラートルールの評価頻度と、アラートの状態を変更して通知を開始するための条件を設定します。

以下の設定では、ダウンストリームレイテンシーが閾値を超えた場合にアラートが作成され、設定された grafana-alert-notification チャネルを通じて SNS トピックに通知が送信されます。

![Alert Configuration](../images/downstream-latency.png)



## クリーンアップ

1. リソースとクラスターを削除します:
```
kubectl delete all --all
eksctl delete cluster --name AMP-EKS-CLUSTER
```
2. AMP ワークスペースを削除します:
```
aws amp delete-workspace --workspace-id `aws amp list-workspaces --alias prometheus-sample-app --query 'workspaces[0].workspaceId' --output text`
```
3. amp-iamproxy-ingest-role IAM ロールを削除します:
```
aws delete-role --role-name amp-iamproxy-ingest-role
```
4. コンソールから AMG ワークスペースを削除します。
