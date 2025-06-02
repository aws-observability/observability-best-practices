# AWS X-Ray を使用した Fargate 上の EKS における AWS Distro for OpenTelemetry の使用

このレシピでは、サンプルの Go アプリケーションを計装し、[AWS Distro for OpenTelemetry (ADOT)](https://aws.amazon.com/jp/otel) を使用して [AWS X-Ray](https://aws.amazon.com/jp/xray/) にトレースを取り込み、[Amazon Managed Grafana](https://aws.amazon.com/jp/grafana/) でトレースを可視化する方法を説明します。

完全なシナリオを実演するために、[AWS Fargate](https://aws.amazon.com/jp/fargate/) 上に [Amazon Elastic Kubernetes Service (EKS)](https://aws.amazon.com/jp/eks/) クラスターをセットアップし、[Amazon Elastic Container Registry (ECR)](https://aws.amazon.com/jp/ecr/) リポジトリを使用します。

:::note
    このガイドは完了までに約 1 時間かかります。
:::



## インフラストラクチャ
以下のセクションでは、このレシピのインフラストラクチャをセットアップします。




### アーキテクチャ

ADOT パイプラインを使用することで、[ADOT Collector](https://github.com/aws-observability/aws-otel-collector) を使用して計装されたアプリケーションからトレースを収集し、X-Ray に取り込むことができます。

![ADOT default pipeline](../images/adot-default-pipeline.png)




### 前提条件

* AWS CLI が環境に[インストール](https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/cli-chap-install.html)され、[設定](https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/cli-chap-configure.html)されていること。
* 環境に [eksctl](https://docs.aws.amazon.com/ja_jp/eks/latest/userguide/eksctl.html) コマンドがインストールされていること。
* 環境に [kubectl](https://docs.aws.amazon.com/ja_jp/eks/latest/userguide/install-kubectl.html) がインストールされていること。
* 環境に [Docker](https://docs.docker.com/get-docker/) がインストールされていること。
* [aws-observability/aws-o11y-recipes](https://github.com/aws-observability/aws-o11y-recipes/) リポジトリがローカル環境にクローンされていること。



### EKS on Fargate クラスターの作成

デモアプリケーションは、EKS on Fargate クラスターで実行する Kubernetes アプリケーションです。
まず、提供されている [cluster_config.yaml](./fargate-eks-xray-go-adot-amg/cluster-config.yaml) を使用して EKS クラスターを作成します。

以下のコマンドを使用してクラスターを作成します：

```
eksctl create cluster -f cluster-config.yaml
```



### ECR リポジトリの作成

EKS にアプリケーションをデプロイするには、コンテナリポジトリが必要です。
プライベートな ECR レジストリを使用しますが、コンテナイメージを共有したい場合は ECR Public を使用することもできます。

まず、以下のように環境変数を設定します（お使いのリージョンに置き換えてください）：

```
export REGION="eu-west-1"
export ACCOUNTID=`aws sts get-caller-identity --query Account --output text`
```

以下のコマンドを使用して、アカウントに新しい ECR リポジトリを作成できます：

```
aws ecr create-repository \
    --repository-name ho11y \
    --image-scanning-configuration scanOnPush=true \
    --region $REGION
```



### ADOT Collector のセットアップ

[adot-collector-fargate.yaml](./fargate-eks-xray-go-adot-amg/adot-collector-fargate.yaml) をダウンロードし、次のステップで説明するパラメータを使用して YAML ドキュメントを編集します。

```
kubectl apply -f adot-collector-fargate.yaml
```



### Managed Grafana のセットアップ

[Amazon Managed Grafana – Getting Started](https://aws.amazon.com/jp/blogs/news/amazon-managed-grafana-getting-started/) ガイドを使用して新しいワークスペースをセットアップし、[データソースとして X-Ray を追加](https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/x-ray-data-source.html) します。




## シグナルジェネレーター

レシピリポジトリの [sandbox](https://github.com/aws-observability/observability-best-practices/tree/main/sandbox/ho11y) で利用可能な合成シグナルジェネレーター `ho11y` を使用します。
まだリポジトリをローカル環境にクローンしていない場合は、以下のコマンドを実行してください：

```
git clone https://github.com/aws-observability/aws-o11y-recipes.git
```



### コンテナイメージのビルド
`ACCOUNTID` と `REGION` の環境変数が設定されていることを確認してください。
例えば以下のようにします：

```
export REGION="eu-west-1"
export ACCOUNTID=`aws sts get-caller-identity --query Account --output text`
```
`ho11y` コンテナイメージをビルドするには、まず `./sandbox/ho11y/` ディレクトリに移動し、コンテナイメージをビルドします：

:::note
    以下のビルドステップでは、Docker デーモンまたは同等の OCI イメージビルドツールが実行されていることを前提としています。
:::

```
docker build . -t "$ACCOUNTID.dkr.ecr.$REGION.amazonaws.com/ho11y:latest"
```



### コンテナイメージのプッシュ
次に、先ほど作成した ECR リポジトリにコンテナイメージをプッシュします。
まず、デフォルトの ECR レジストリにログインします：

```
aws ecr get-login-password --region $REGION | \
    docker login --username AWS --password-stdin \
    "$ACCOUNTID.dkr.ecr.$REGION.amazonaws.com"
```

最後に、先ほど作成した ECR リポジトリにコンテナイメージをプッシュします：

```
docker push "$ACCOUNTID.dkr.ecr.$REGION.amazonaws.com/ho11y:latest"
```



### シグナルジェネレーターのデプロイ

[x-ray-sample-app.yaml](./fargate-eks-xray-go-adot-amg/x-ray-sample-app.yaml) を編集して、ECR イメージパスを含めます。
ファイル内の `ACCOUNTID` と `REGION` を、自分の値に置き換えてください（全部で 3 箇所あります）：

```
    # change the following to your container image:
    image: "ACCOUNTID.dkr.ecr.REGION.amazonaws.com/ho11y:latest"
```

これで、以下のコマンドを使用してサンプルアプリをクラスターにデプロイできます：

```
kubectl -n example-app apply -f x-ray-sample-app.yaml
```



## エンド・ツー・エンド

インフラストラクチャとアプリケーションの準備が整ったので、セットアップをテストしていきます。
EKS で実行されている `ho11y` から X-Ray にトレースを送信し、AMG で可視化します。




### パイプラインの検証

ADOT コレクターが `ho11y` からトレースを取り込んでいるかを確認するために、サービスの 1 つをローカルで利用可能にして呼び出します。

まず、以下のようにトラフィックを転送します：

```
kubectl -n example-app port-forward svc/frontend 8765:80
```

上記のコマンドにより、`frontend` マイクロサービス（他の 2 つの `ho11y` インスタンスと通信するように設定された `ho11y` インスタンス）がローカル環境で利用可能になり、以下のように呼び出すことができます（トレースの作成がトリガーされます）：

```
$ curl localhost:8765/
{"traceId":"1-6193a9be-53693f29a0119ee4d661ba0d"}
```

:::tip
    呼び出しを自動化したい場合は、`curl` コマンドを `while true` ループで囲むことができます。
:::

セットアップを確認するには、[CloudWatch の X-Ray ビュー](https://console.aws.amazon.com/cloudwatch/home#xray:service-map/) にアクセスしてください。以下のような画面が表示されるはずです：

![Screen shot of the X-Ray console in CW](../images/x-ray-cw-ho11y.png)

これでシグナル生成器のセットアップが完了し、アクティブになり、OpenTelemetry パイプラインもセットアップされました。次に、Grafana でトレースを使用する方法を見ていきましょう。



### Grafana ダッシュボード

[x-ray-sample-dashboard.json](./fargate-eks-xray-go-adot-amg/x-ray-sample-dashboard.json) から、以下のようなサンプルダッシュボードをインポートできます。

![Screen shot of the X-Ray dashboard in AMG](../images/x-ray-amg-ho11y-dashboard.png)

さらに、下部の `downstreams` パネルでトレースをクリックすると、以下のように「Explore」タブで詳細を確認できます。

![Screen shot of the X-Ray dashboard in AMG](../images/x-ray-amg-ho11y-explore.png)

以下のガイドを参照して、Amazon Managed Grafana で独自のダッシュボードを作成できます。

* [ユーザーガイド: ダッシュボード](https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/dashboard-overview.html)
* [ダッシュボード作成のベストプラクティス](https://grafana.com/docs/grafana/latest/best-practices/best-practices-for-creating-dashboards/)

以上で完了です。おめでとうございます！EKS on Fargate で ADOT を使用してトレースを取り込む方法を学習しました。



## クリーンアップ

まず、Kubernetes リソースを削除し、EKS クラスターを破棄します。

```
kubectl delete all --all && \
eksctl delete cluster --name xray-eks-fargate
```
最後に、AWS コンソールから Amazon Managed Grafana ワークスペースを削除します。
