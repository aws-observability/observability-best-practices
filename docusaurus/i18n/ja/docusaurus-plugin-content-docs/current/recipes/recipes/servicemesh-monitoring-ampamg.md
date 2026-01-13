# Amazon Managed Service for Prometheus を使用して EKS 上に構成された App Mesh 環境を監視する

このレシピでは、[Amazon Elastic Kubernetes Service](https://aws.amazon.com/eks/) (EKS) クラスター内の [App Mesh](https://docs.aws.amazon.com/app-mesh/) Envoy メトリクスを [Amazon Managed Service for Prometheus](https://aws.amazon.com/prometheus/) (AMP) に取り込み、[Amazon Managed Grafana](https://aws.amazon.com/grafana/) (AMG) でカスタムダッシュボードを作成してマイクロサービスの健全性とパフォーマンスを監視する方法を紹介します。

実装の一環として、AMP ワークスペースを作成し、App Mesh Controller for Kubernetes をインストールし、Envoy コンテナをポッドに注入します。EKS クラスターに設定された [Grafana Agent](https://github.com/grafana/agent) を使用して Envoy メトリクスを収集し、AMP に書き込みます。最後に、AMG ワークスペースを作成し、AMP をデータソースとして設定し、カスタムダッシュボードを作成します。

:::note
    このガイドは完了までに約 45 分かかります。
:::
## インフラストラクチャ
次のセクションでは、このレシピのインフラストラクチャをセットアップします。 

### アーキテクチャ


![Architecture](../images/monitoring-appmesh-environment.png)

Grafana エージェントは、Envoy メトリクスをスクレイピングし、AMP リモート書き込みエンドポイントを通じて AMP に取り込むように設定されています。 

:::info 
    Prometheus Remote Write Exporter の詳細については、[AMP 用 Prometheus Remote Write Exporter の開始方法](https://aws-otel.github.io/docs/getting-started/prometheus-remote-write-exporter)を参照してください。
:::

### 前提条件

* AWS CLI が環境に[インストール](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html)され、[設定](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)されている必要があります。
* 環境に [eksctl](https://docs.aws.amazon.com/eks/latest/userguide/eksctl.html) コマンドをインストールする必要があります。
* 環境に [kubectl](https://docs.aws.amazon.com/eks/latest/userguide/install-kubectl.html) をインストールする必要があります。
* 環境に [Docker](https://docs.docker.com/get-docker/) がインストールされている必要があります。
* AWS アカウントに AMP ワークスペースが設定されている必要があります。
* [Helm](https://www.eksworkshop.com/beginner/060_helm/helm_intro/install/index.html) をインストールする必要があります。
* [AWS-SSO](https://docs.aws.amazon.com/singlesignon/latest/userguide/step1.html) を有効にする必要があります。

### EKS クラスターのセットアップ

まず、サンプルアプリケーションを実行するために App Mesh を有効にした EKS クラスターを作成します。 `eksctl` CLI を使用して、[eks-cluster-config.yaml](./servicemesh-monitoring-ampamg/eks-cluster-config.yaml) を使ってクラスターをデプロイします。
このテンプレートは、EKS で新しいクラスターを作成します。

テンプレートファイルを編集し、AMP で利用可能なリージョンのいずれかにリージョンを設定します。

* `us-east-1`
* `us-east-2`
* `us-west-2`
* `eu-central-1`
* `eu-west-1`

セッションでこのリージョンを上書きしてください。たとえば、Bash シェルでは次のようにします。

```
export AWS_REGION=eu-west-1
```

以下のコマンドを使用してクラスターを作成します。

```
eksctl create cluster -f eks-cluster-config.yaml
```
これにより、次の名前の EKS クラスターが作成されます `AMP-EKS-CLUSTER` という名前のサービスアカウント `appmesh-controller` EKS の App Mesh コントローラーによって使用されます。

### App Mesh Controller をインストールする

次に、以下のコマンドを実行して [App Mesh Controller](https://docs.aws.amazon.com/app-mesh/latest/userguide/getting-started-kubernetes.html) をインストールし、Custom Resource Definitions (CRD) を設定します。 

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

### AMP をセットアップする 
AMP ワークスペースは、Envoy から収集された Prometheus メトリクスを取り込むために使用されます。
ワークスペースは、テナント専用の論理的な Cortex サーバーです。ワークスペースは、更新、一覧表示、説明、削除などの管理を承認するための詳細なアクセス制御と、メトリクスの取り込みとクエリをサポートします。

AWS CLI を使用してワークスペースを作成します。

```
aws amp create-workspace --alias AMP-APPMESH --region $AWS_REGION
```

必要な Helm リポジトリを追加します。

```
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts && \
helm repo add kube-state-metrics https://kubernetes.github.io/kube-state-metrics 
```

AMP の詳細については、[AMP Getting started](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-getting-started.html) ガイドを参照してください。

### メトリクスのスクレイピングと取り込み

AMP は、Kubernetes クラスター内のコンテナ化されたワークロードから運用メトリクスを直接スクレイピングしません。
このタスクを実行するには、Prometheus サーバーまたは [AWS Distro for OpenTelemetry Collector](https://github.com/aws-observability/aws-otel-collector) や Grafana Agent などの OpenTelemetry エージェントをデプロイして管理する必要があります。このレシピでは、Grafana Agent を設定して Envoy メトリクスをスクレイピングし、AMP と AMG を使用してそれらを分析するプロセスを説明します。

#### Grafana Agent を設定する

Grafana Agent は、完全な Prometheus サーバーを実行する代わりとなる軽量な選択肢です。Prometheus エクスポーターを検出してスクレイピングし、Prometheus 互換のバックエンドにメトリクスを送信するために必要な部分を保持します。Grafana Agent には、AWS Identity and Access Management (IAM) 認証のための AWS Signature Version 4 (Sigv4) のネイティブサポートも含まれています。

Prometheus メトリクスを AMP に送信するための IAM ロールを設定する手順を説明します。
EKS クラスターに Grafana Agent をインストールし、メトリクスを AMP に転送します。

#### アクセス許可を設定する
Grafana Agent は、EKS クラスターで実行されているコンテナ化されたワークロードから運用メトリクスをスクレイピングし、AMP に送信します。AMP に送信されるデータは、マネージドサービスへの各クライアントリクエストを認証および承認するために、Sigv4 を使用して有効な AWS 認証情報で署名する必要があります。

Grafana Agent を EKS クラスターにデプロイして、Kubernetes サービスアカウントの ID で実行できます。
サービスアカウント用の IAM ロール (IRSA) を使用すると、IAM ロールを Kubernetes サービスアカウントに関連付けることができ、
そのサービスアカウントを使用するすべての Pod に IAM アクセス許可を付与できます。

IRSA のセットアップを次のように準備します。

```
kubectl create namespace grafana-agent

export WORKSPACE=$(aws amp list-workspaces | jq -r '.workspaces[] | select(.alias=="AMP-APPMESH").workspaceId')
export ROLE_ARN=$(aws iam get-role --role-name EKS-GrafanaAgent-AMP-ServiceAccount-Role --query Role.Arn --output text)
export NAMESPACE="grafana-agent"
export REMOTE_WRITE_URL="https://aps-workspaces.$AWS_REGION.amazonaws.com/workspaces/$WORKSPACE/api/v1/remote_write"
```

[gca-permissions.sh](./servicemesh-monitoring-ampamg/gca-permissions.sh) シェルスクリプトを使用して、以下の手順を自動化できます (プレースホルダー変数を置き換える必要があることに注意してください 
`YOUR_EKS_CLUSTER_NAME` EKS クラスターの名前を指定します。

* 次の名前の IAM ロールを作成します `EKS-GrafanaAgent-AMP-ServiceAccount-Rol`AMP ワークスペースへのリモート書き込み権限を持つ IAM ポリシーを使用します。
* 次の名前の Kubernetes サービスアカウントを作成します `grafana-agent` の下にある `grafana-agent` IAM ロールに関連付けられた namespace。
* IAM ロールと Amazon EKS クラスターでホストされている OIDC プロバイダーとの間に信頼関係を作成します。

必要なもの `kubectl` および `eksctl` を実行するための CLI ツール `gca-permissions.sh` スクリプト。
Amazon EKS クラスターにアクセスするように設定する必要があります。

次に、Envoy メトリクスを抽出するためのスクレイプ設定を含むマニフェストファイル [grafana-agent.yaml](./servicemesh-monitoring-ampamg/grafana-agent.yaml) を作成し、Grafana Agent をデプロイします。 

:::note
    執筆時点では、このソリューションは Fargate 上の EKS では動作しません。
    これは、Fargate でデーモンセットがサポートされていないためです。
:::
この例では、次の名前の daemon set をデプロイします `grafana-agent` という名前のデプロイメントと 
`grafana-agent-deployment`。この `grafana-agent` daemon set はクラスター上のポッドからメトリクスを収集し、 `grafana-agent-deployment` デプロイメントは、EKS コントロールプレーンなど、クラスター上に存在しないサービスからメトリクスを収集します。

```
kubectl apply -f grafana-agent.yaml
```
After the `grafana-agent` がデプロイされると、メトリクスを収集し、指定された AMP ワークスペースに取り込みます。次に、EKS クラスターにサンプルアプリケーションをデプロイし、メトリクスの分析を開始します。

## サンプルアプリケーション

アプリケーションをインストールし、Envoy コンテナを挿入するには、Kubernetes 用の AppMesh コントローラーを使用します。

まず、examples リポジトリをクローンしてベースアプリケーションをインストールします。

```
git clone https://github.com/aws/aws-app-mesh-examples.git
```

次に、リソースをクラスターに適用します。

```
kubectl apply -f aws-app-mesh-examples/examples/apps/djapp/1_base_application
```

Pod のステータスを確認し、実行中であることを確認します。

```
$ kubectl -n prod get all

NAME                            READY   STATUS    RESTARTS   AGE
pod/dj-cb77484d7-gx9vk          1/1     Running   0          6m8s
pod/jazz-v1-6b6b6dd4fc-xxj9s    1/1     Running   0          6m8s
pod/metal-v1-584b9ccd88-kj7kf   1/1     Running   0          6m8s
```

次に、App Mesh コントローラーをインストールし、デプロイメントをメッシュ化します。

```
kubectl apply -f aws-app-mesh-examples/examples/apps/djapp/2_meshed_application/
kubectl rollout restart deployment -n prod dj jazz-v1 metal-v1
```

各 Pod で 2 つのコンテナが実行されていることが確認できます。

```
$ kubectl -n prod get all
NAME                        READY   STATUS    RESTARTS   AGE
dj-7948b69dff-z6djf         2/2     Running   0          57s
jazz-v1-7cdc4fc4fc-wzc5d    2/2     Running   0          57s
metal-v1-7f499bb988-qtx7k   2/2     Running   0          57s
```

5 分間トラフィックを生成します。後で AMG で可視化します。

```
dj_pod=`kubectl get pod -n prod --no-headers -l app=dj -o jsonpath='{.items[*].metadata.name}'`

loop_counter=0
while [ $loop_counter -le 300 ] ; do \
kubectl exec -n prod -it $dj_pod  -c dj \
-- curl jazz.prod.svc.cluster.local:9080 ; echo ; loop_counter=$[$loop_counter+1] ; \
done
```

### AMG ワークスペースを作成する

AMG ワークスペースを作成するには、[Getting Started with AMG](https://aws.amazon.com/blogs/mt/amazon-managed-grafana-getting-started/) ブログ記事の手順に従ってください。
ダッシュボードへのユーザーアクセスを許可するには、AWS SSO を有効にする必要があります。ワークスペースを作成した後、個々のユーザーまたはユーザーグループに Grafana ワークスペースへのアクセスを割り当てることができます。
デフォルトでは、ユーザーのユーザータイプはビューアーになります。ユーザーロールに基づいてユーザータイプを変更してください。AMP ワークスペースをデータソースとして追加し、ダッシュボードの作成を開始します。

この例では、ユーザー名は `grafana-admin` ユーザータイプは `Admin`必要なデータソースを選択します。設定を確認してから、次を選択します `Create workspace`.

![Creating AMP Workspace](../images/workspace-creation.png)

### AMG データソースを設定する 
AMG で AMP をデータソースとして設定するには、 `Data sources` セクションで、次を選択します 
`Configure in Grafana`これによりブラウザで Grafana ワークスペースが起動します。
Grafana ワークスペースの URL をブラウザで手動で起動することもできます。

![Configuring Datasource](../images/configuring-amp-datasource.png)

スクリーンショットからわかるように、ダウンストリームレイテンシー、接続、レスポンスコード、その他の Envoy メトリクスを表示できます。表示されているフィルターを使用して、特定のアプリケーションの Envoy メトリクスにドリルダウンできます。

### AMG ダッシュボードを設定する

データソースの設定が完了したら、カスタムダッシュボードをインポートして Envoy メトリクスを分析します。
ここでは事前定義されたダッシュボードを使用するため、次を選択します `Import` (以下に示します)、次に ID を入力します `11022`これにより、Envoy Global ダッシュボードがインポートされ、Envoy メトリクスの分析を開始できます。

![Custom Dashboard](../images/import-dashboard.png)

### AMG でアラートを設定する
メトリクスが意図したしきい値を超えて増加した場合に、Grafana アラートを設定できます。
AMG を使用すると、ダッシュボードでアラートを評価する頻度を設定し、通知を送信できます。
アラートルールを作成する前に、通知チャネルを作成する必要があります。

この例では、Amazon SNS を通知チャネルとして設定します。SNS トピックには次のプレフィックスを付ける必要があります `grafana` サービスマネージド型のアクセス許可、つまり[サービスマネージド型のアクセス許可](https://docs.aws.amazon.com/grafana/latest/userguide/AMG-manage-permissions.html#AMG-service-managed-account)を使用する場合、通知がトピックに正常に発行されるようにします。

以下のコマンドを使用して、次の名前の SNS トピックを作成します `grafana-notification`:

```
aws sns create-topic --name grafana-notification
```

メールアドレスを使用してサブスクライブします。以下のコマンドでリージョンとアカウント ID を必ず指定してください。

```
aws sns subscribe \
    --topic-arn arn:aws:sns:<region>:<account-id>:grafana-notification \
	--protocol email \
	--notification-endpoint <email-id>
```

Grafana ダッシュボードから新しい通知チャネルを追加します。
grafana-notification という名前の新しい通知チャネルを設定します。Type には、ドロップダウンから AWS SNS を使用します。Topic には、先ほど作成した SNS トピックの ARN を使用します。
Auth provider には、AWS SDK Default を選択します。

![Creating Notification Channel](../images/alert-configuration.png)

ダウンストリームレイテンシーが 1 分間で 5 ミリ秒を超えた場合のアラートを設定します。
ダッシュボードで、ドロップダウンから Downstream latency を選択し、Edit を選択します。
グラフパネルの Alert タブで、アラートルールを評価する頻度と、アラートが状態を変更して通知を開始するために満たす必要がある条件を設定します。

次の設定では、ダウンストリームレイテンシーがしきい値を超えた場合にアラートが作成され、設定された grafana-alert-notification チャネルを通じて SNS トピックに通知が送信されます。

![Alert Configuration](../images/downstream-latency.png)

## クリーンアップ

1. リソースとクラスターを削除します。
```
kubectl delete all --all
eksctl delete cluster --name AMP-EKS-CLUSTER
```
2. AMP ワークスペースを削除します。
```
aws amp delete-workspace --workspace-id `aws amp list-workspaces --alias prometheus-sample-app --query 'workspaces[0].workspaceId' --output text`
```
3. amp-iamproxy-ingest-role IAM ロールを削除します。
```
aws delete-role --role-name amp-iamproxy-ingest-role
```
4. コンソールから AMG ワークスペースを削除して、AMG ワークスペースを削除します。 
