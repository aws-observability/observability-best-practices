# Amazon Managed Service for Prometheus を使用して EKS 上で構成された App Mesh 環境を監視する

このレシピでは、[Amazon Elastic Kubernetes Service](https://aws.amazon.com/jp/eks/) (EKS) クラスター上の [App Mesh](https://docs.aws.amazon.com/ja_jp/app-mesh/) Envoy メトリクスを [Amazon Managed Service for Prometheus](https://aws.amazon.com/jp/prometheus/) (AMP) に取り込み、[Amazon Managed Grafana](https://aws.amazon.com/jp/grafana/) (AMG) でカスタムダッシュボードを作成して、マイクロサービスの正常性とパフォーマンスを監視する方法を示します。

実装の一環として、AMP ワークスペースを作成し、Kubernetes 用の App Mesh コントローラをインストールし、Envoy コンテナを Pod に注入します。
EKS クラスター内で構成された [Grafana Agent](https://github.com/grafana/agent) を使用して Envoy メトリクスを収集し、AMP に書き込みます。
最後に、AMG ワークスペースを作成し、AMP をデータソースとして構成し、カスタムダッシュボードを作成します。

note
    このガイドの完了には約 45 分かかります。


## インフラストラクチャ
次のセクションでは、このレシピのインフラストラクチャを設定します。

### アーキテクチャ

![Architecture](../images/monitoring-appmesh-environment.png)

Grafana エージェントは Envoy メトリクスをスクレイピングし、AMP のリモートライトエンドポイントを通して AMP に取り込むように設定されています。

info
Prometheus Remote Write Exporter の詳細については、[Getting Started with Prometheus Remote Write Exporter for AMP](https://aws-otel.github.io/docs/getting-started/prometheus-remote-write-exporter) を参照してください。


### 前提条件

* AWS CLI が環境内に[インストール](https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/cli-chap-install.html)され、[設定](https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/cli-chap-configure.html)されている必要があります。
* 環境内に [eksctl](https://docs.aws.amazon.com/ja_jp/eks/latest/userguide/eksctl.html) コマンドをインストールする必要があります。
* 環境内に [kubectl](https://docs.aws.amazon.com/ja_jp/eks/latest/userguide/install-kubectl.html) をインストールする必要があります。
* 環境内に [Docker](https://docs.docker.com/get-docker/) がインストールされている必要があります。
* AWS アカウントに AMP ワークスペースが設定されている必要があります。
* [Helm](https://www.eksworkshop.com/beginner/060_helm/helm_intro/install/index.html) をインストールする必要があります。
* [AWS-SSO](https://docs.aws.amazon.com/ja_jp/singlesignon/latest/userguide/step1.html) を有効にする必要があります。

### EKS クラスターをセットアップする

まず、サンプルアプリケーションを実行するために App Mesh を有効にした EKS クラスターを作成します。
`eksctl` CLI を使用して、[eks-cluster-config.yaml](./servicemesh-monitoring-ampamg/eks-cluster-config.yaml) を使ってクラスターをデプロイします。
このテンプレートは、EKS で新しいクラスターを作成します。

テンプレートファイルを編集し、AMP で利用可能なリージョンのいずれかにリージョンを設定します。

* `us-east-1`
* `us-east-2`
* `us-west-2`
* `eu-central-1`
* `eu-west-1`

セッション内でこのリージョンを上書きすることを確認してください。例えば、Bash シェルの場合は次のようになります。

```
export AWS_REGION=eu-west-1
```

次のコマンドを使用してクラスターを作成します。

```
eksctl create cluster -f eks-cluster-config.yaml
```
これにより、`AMP-EKS-CLUSTER` という名前の EKS クラスターと、App Mesh コントローラーが EKS で使用する `appmesh-controller` という名前のサービスアカウントが作成されます。

### App Mesh コントローラーをインストールする

次に、以下のコマンドを実行して [App Mesh コントローラー](https://docs.aws.amazon.com/ja_jp/app-mesh/latest/userguide/getting-started-kubernetes.html) をインストールし、カスタムリソース定義 (CRD) を設定します。

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
ワークスペースは、テナントに専用の論理的な Cortex サーバーです。ワークスペースは、更新、一覧表示、説明、削除などの管理、およびメトリクスの取り込みとクエリを許可するための細かいアクセス制御をサポートしています。

AWS CLI を使用してワークスペースを作成します。

```
aws amp create-workspace --alias AMP-APPMESH --region $AWS_REGION
```

必要な Helm リポジトリを追加します。

```
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts && \
helm repo add kube-state-metrics https://kubernetes.github.io/kube-state-metrics 
```

AMP の詳細については、[AMP Getting started](https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/AMP-getting-started.html) ガイドを参照してください。

### メトリクスのスクレイピングとインゲスト

AMP は Kubernetes クラスター内のコンテナ化されたワークロードからオペレーショナルメトリクスを直接スクレイピングすることはできません。
この作業を実行するには、Prometheus サーバーまたは [AWS Distro for OpenTelemetry Collector](https://github.com/aws-observability/aws-otel-collector) や Grafana Agent などの OpenTelemetry エージェントをデプロイして管理する必要があります。
このレシピでは、Grafana Agent を設定して Envoy メトリクスをスクレイピングし、AMP と AMG を使ってそれらを分析する手順を説明します。

#### Grafana Agent の設定

Grafana Agent は、完全な Prometheus サーバーを実行する代わりに使用できる軽量な選択肢です。
Prometheus エクスポーターの検出とスクレイピングに必要な部分を維持し、メトリクスを Prometheus 互換のバックエンドに送信します。Grafana Agent には、AWS Identity and Access Management (IAM) 認証用の AWS Signature Version 4 (Sigv4) のネイティブサポートも含まれています。

ここでは、Prometheus メトリクスを AMP に送信するための IAM ロールの設定手順を説明します。
Grafana Agent を EKS クラスターにインストールし、メトリクスを AMP に転送します。

#### 権限の設定
Grafana Agent は、EKS クラスター内で実行されているコンテナ化されたワークロードからオペレーショナルメトリクスをスクレイピングし、それらを AMP に送信します。AMP に送信されるデータは、Sigv4 を使用して各クライアントリクエストを認証および承認するため、有効な AWS 認証情報で署名される必要があります。

Grafana Agent は、Kubernetes サービスアカウントのアイデンティティの下で実行されるように EKS クラスターにデプロイできます。サービスアカウントの IAM ロール (IRSA) を使用すると、IAM ロールを Kubernetes サービスアカウントに関連付けることができ、そのサービスアカウントを使用する任意の Pod に IAM 権限を提供できます。

以下のように IRSA 設定を準備します。

```
kubectl create namespace grafana-agent

export WORKSPACE=$(aws amp list-workspaces | jq -r '.workspaces[] | select(.alias=="AMP-APPMESH").workspaceId')
export ROLE_ARN=$(aws iam get-role --role-name EKS-GrafanaAgent-AMP-ServiceAccount-Role --query Role.Arn --output text)
export NAMESPACE="grafana-agent"
export REMOTE_WRITE_URL="https://aps-workspaces.$AWS_REGION.amazonaws.com/workspaces/$WORKSPACE/api/v1/remote_write"
```

[gca-permissions.sh](./servicemesh-monitoring-ampamg/gca-permissions.sh) シェルスクリプトを使用して、以下の手順を自動化できます (プレースホルダー変数 `YOUR_EKS_CLUSTER_NAME` を自分の EKS クラスター名に置き換えることに注意してください)。

* AMP ワークスペースへのリモートライト権限を持つ IAM ポリシーを持つ `EKS-GrafanaAgent-AMP-ServiceAccount-Role` という名前の IAM ロールを作成します。
* `grafana-agent` 名前空間の下に、IAM ロールに関連付けられた `grafana-agent` という名前の Kubernetes サービスアカウントを作成します。
* IAM ロールと Amazon EKS クラスターでホストされている OIDC プロバイダー間の信頼関係を作成します。

`gca-permissions.sh` スクリプトを実行するには、`kubectl` と `eksctl` CLI ツールが必要で、Amazon EKS クラスターにアクセスできるように設定する必要があります。

次に、Envoy メトリクスを抽出するスクレイプ設定と Grafana Agent のデプロイ用の [grafana-agent.yaml](./servicemesh-monitoring-ampamg/grafana-agent.yaml) マニフェストファイルを作成します。

note
    執筆時点では、Fargate 上の EKS ではデーモンセットがサポートされていないため、この解決策は機能しません。

この例では、`grafana-agent` というデーモンセットと `grafana-agent-deployment` というデプロイメントをデプロイします。`grafana-agent` デーモンセットはクラスター上の Pod からメトリクスを収集し、`grafana-agent-deployment` デプロイメントは EKS コントロールプレーンなどのクラスター外のサービスからメトリクスを収集します。

```
kubectl apply -f grafana-agent.yaml
```
`grafana-agent` がデプロイされると、メトリクスを収集し、指定された AMP ワークスペースに取り込みます。次に、サンプルアプリケーションを EKS クラスターにデプロイし、メトリクスの分析を開始します。

## サンプルアプリケーション

アプリケーションをインストールし、Envoy コンテナを注入するには、Kubernetes 用の AppMesh コントローラを使用します。

まず、例のリポジトリをクローンしてベースアプリケーションをインストールします。

```
git clone https://github.com/aws/aws-app-mesh-examples.git
```

そして、リソースをクラスターに適用します。

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

次に、App Mesh コントローラをインストールし、デプロイメントを meshify します。

```
kubectl apply -f aws-app-mesh-examples/examples/apps/djapp/2_meshed_application/
kubectl rollout restart deployment -n prod dj jazz-v1 metal-v1
```

これで、各 Pod に 2 つのコンテナが実行されているはずです。

```
$ kubectl -n prod get all
NAME                        READY   STATUS    RESTARTS   AGE
dj-7948b69dff-z6djf         2/2     Running   0          57s
jazz-v1-7cdc4fc4fc-wzc5d    2/2     Running   0          57s
metal-v1-7f499bb988-qtx7k   2/2     Running   0          57s
```

5 分間トラフィックを生成し、後で AMG で可視化します。

```
dj_pod=`kubectl get pod -n prod --no-headers -l app=dj -o jsonpath='{.items[*].metadata.name}'`

loop_counter=0
while [ $loop_counter -le 300 ] ; do \
kubectl exec -n prod -it $dj_pod  -c dj \
-- curl jazz.prod.svc.cluster.local:9080 ; echo ; loop_counter=$[$loop_counter+1] ; \
done
```

### AMG ワークスペースを作成する

AMG ワークスペースを作成するには、[AMG の概要](https://aws.amazon.com/jp/blogs/news/amazon-managed-grafana-getting-started/)のブログ記事の手順に従ってください。
ダッシュボードにユーザーアクセスを許可するには、AWS SSO を有効にする必要があります。ワークスペースを作成した後、個々のユーザーまたはユーザーグループに Grafana ワークスペースへのアクセス権を割り当てることができます。
デフォルトでは、ユーザーのユーザータイプは viewer です。ユーザーの役割に基づいてユーザータイプを変更してください。AMP ワークスペースをデータソースとして追加し、次にダッシュボードの作成を開始します。

この例では、ユーザー名は `grafana-admin` で、ユーザータイプは `Admin` です。
必要なデータソースを選択します。構成を確認し、`Create workspace` を選択します。

![AMP ワークスペースの作成](../images/workspace-creation.png)

### AMG データソースを設定する
AMG で AMP をデータソースとして設定するには、`Data sources` セクションで `Configure in Grafana` を選択し、ブラウザで Grafana ワークスペースを起動します。
Grafana ワークスペースの URL をブラウザで直接開くこともできます。

![Configuring Datasource](../images/configuring-amp-datasource.png)

スクリーンショットからわかるように、ダウンストリームレイテンシ、接続数、レスポンスコードなどの Envoy メトリクスを確認できます。
表示されているフィルターを使用して、特定のアプリケーションの Envoy メトリクスを詳しく確認できます。

### AMG ダッシュボードを設定する

データソースが設定されたら、カスタムダッシュボードをインポートして Envoy メトリクスを分析します。
これには事前に定義されたダッシュボードを使用するので、`Import` (下図参照) を選択し、
ID `11022` を入力します。これにより Envoy Global ダッシュボードがインポートされ、
Envoy メトリクスの分析を開始できます。

![Custom Dashboard](../images/import-dashboard.png)

### AMG でアラートを設定する
メトリクスが意図したしきい値を超えた場合に、Grafana アラートを設定できます。
AMG では、ダッシュボードでアラートの評価頻度と通知の送信方法を設定できます。
アラート規則を作成する前に、通知チャネルを作成する必要があります。

この例では、Amazon SNS を通知チャネルとして設定します。SNS トピックには `grafana` を接頭辞として付ける必要があります。デフォルトの [サービス管理された権限](https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/AMG-manage-permissions.html) を使用する場合、通知がトピックに正常に公開されます。

`grafana-notification` という名前の SNS トピックを作成するには、次のコマンドを使用します。

```
aws sns create-topic --name grafana-notification
```

次に、メールアドレスでサブスクライブします。以下のコマンドでリージョンとアカウント ID を指定してください。

```
aws sns subscribe \
    --topic-arn arn:aws:sns:<region>:<account-id>:grafana-notification \
	--protocol email \
	--notification-endpoint <email-id>
```

次に、Grafana ダッシュボードから新しい通知チャネルを追加します。
新しい通知チャネル `grafana-notification` を設定します。タイプには、ドロップダウンから AWS SNS を選択します。トピックには、作成した SNS トピックの ARN を使用します。認証プロバイダーには、AWS SDK Default を選択します。

![通知チャネルの作成](../images/alert-configuration.png)

次に、1 分間のダウンストリームレイテンシーが 5 ミリ秒を超えた場合にアラートを設定します。
ダッシュボードで、ドロップダウンからダウンストリームレイテンシーを選択し、編集を選択します。
グラフパネルのアラートタブで、アラート規則の評価頻度と、アラートの状態を変更して通知を開始する条件を設定します。

次の設定では、ダウンストリームレイテンシーがしきい値を超えた場合にアラートが作成され、設定された grafana-alert-notification チャネルを通じて SNS トピックに通知が送信されます。

![アラート設定](../images/downstream-latency.png)
</email-id></account-id></region>

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
4. AMG ワークスペースをコンソールから削除します。
