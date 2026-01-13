# EKS on Fargate で AWS Distro for OpenTelemetry を AWS X-Ray と使用する

このレシピでは、サンプル Go アプリケーションをインストルメント化し、[AWS Distro for OpenTelemetry (ADOT)](https://aws.amazon.com/otel) を使用して [AWS X-Ray](https://aws.amazon.com/xray/) にトレースを取り込み、[Amazon Managed Grafana](https://aws.amazon.com/grafana/) でトレースを可視化する方法を紹介します。

[Amazon Elastic Kubernetes Service (EKS)](https://aws.amazon.com/eks/) を [AWS Fargate](https://aws.amazon.com/fargate/) クラスター上にセットアップし、[Amazon Elastic Container Registry (ECR)](https://aws.amazon.com/ecr/) リポジトリを使用して完全なシナリオを実演します。

:::note
    このガイドは完了までに約 1 時間かかります。
:::
## インフラストラクチャ
次のセクションでは、このレシピのインフラストラクチャをセットアップします。 

### アーキテクチャ

ADOT パイプラインを使用すると、[ADOT Collector](https://github.com/aws-observability/aws-otel-collector) を使用して、インストルメント化されたアプリからトレースを収集し、X-Ray に取り込むことができます。

![ADOT default pipeline](../images/adot-default-pipeline.png)


### 前提条件

* AWS CLI が環境に[インストール](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html)され、[設定](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)されている必要があります。
* 環境に [eksctl](https://docs.aws.amazon.com/eks/latest/userguide/eksctl.html) コマンドをインストールする必要があります。
* 環境に [kubectl](https://docs.aws.amazon.com/eks/latest/userguide/install-kubectl.html) をインストールする必要があります。
* 環境に [Docker](https://docs.docker.com/get-docker/) がインストールされている必要があります。
* [aws-observability/aws-o11y-recipes](https://github.com/aws-observability/aws-o11y-recipes/) リポジトリがローカル環境にクローンされている必要があります。

### EKS on Fargate クラスターを作成する

デモアプリケーションは、EKS on Fargate クラスターで実行する Kubernetes アプリです。まず、提供されている[cluster_config.yaml](./fargate-eks-xray-go-adot-amg/cluster-config.yaml)を使用して EKS クラスターを作成します。

以下のコマンドを使用してクラスターを作成します。

```
eksctl create cluster -f cluster-config.yaml
```

### ECR リポジトリを作成する

アプリケーションを EKS にデプロイするには、コンテナリポジトリが必要です。プライベート ECR レジストリを使用しますが、コンテナイメージを共有したい場合は ECR Public を使用することもできます。

まず、次のように環境変数を設定します (お使いのリージョンに置き換えてください)。

```
export REGION="eu-west-1"
export ACCOUNTID=`aws sts get-caller-identity --query Account --output text`
```

以下のコマンドを使用して、アカウントに新しい ECR リポジトリを作成できます。 

```
aws ecr create-repository \
    --repository-name ho11y \
    --image-scanning-configuration scanOnPush=true \
    --region $REGION
```

### ADOT Collector をセットアップする

[adot-collector-fargate.yaml](./fargate-eks-xray-go-adot-amg/adot-collector-fargate.yaml) をダウンロードし、次の手順で説明するパラメータを使用してこの YAML ドキュメントを編集します。


```
kubectl apply -f adot-collector-fargate.yaml
```

### Managed Grafana をセットアップする

[Amazon Managed Grafana – Getting Started](https://aws.amazon.com/blogs/mt/amazon-managed-grafana-getting-started/) ガイドを使用して新しいワークスペースをセットアップし、[X-Ray をデータソースとして追加](https://docs.aws.amazon.com/grafana/latest/userguide/x-ray-data-source.html)します。

## シグナルジェネレーター

使用するのは `ho11y`。これは、レシピリポジトリの [sandbox](https://github.com/aws-observability/observability-best-practices/tree/main/sandbox/ho11y) から利用可能な合成シグナルジェネレーターです。ローカル環境にリポジトリをまだクローンしていない場合は、今すぐ実行してください。

```
git clone https://github.com/aws-observability/aws-o11y-recipes.git
```

### コンテナイメージをビルドする
次のことを確認してください。 `ACCOUNTID` および `REGION` 環境変数が設定されている場合の例を示します。

```
export REGION="eu-west-1"
export ACCOUNTID=`aws sts get-caller-identity --query Account --output text`
```
ビルドするには `ho11y` コンテナイメージに変更するには、まず `./sandbox/ho11y/`
ディレクトリに移動し、コンテナイメージをビルドします。

:::note
    次のビルドステップでは、Docker デーモンまたは同等の OCI イメージビルドツールが実行されていることを前提としています。
:::

```
docker build . -t "$ACCOUNTID.dkr.ecr.$REGION.amazonaws.com/ho11y:latest"
```

### コンテナイメージをプッシュする
次に、先ほど作成した ECR リポジトリにコンテナイメージをプッシュできます。
そのために、まずデフォルトの ECR レジストリにログインします。

```
aws ecr get-login-password --region $REGION | \
    docker login --username AWS --password-stdin \
    "$ACCOUNTID.dkr.ecr.$REGION.amazonaws.com"
```

最後に、上記で作成した ECR リポジトリにコンテナイメージをプッシュします。

```
docker push "$ACCOUNTID.dkr.ecr.$REGION.amazonaws.com/ho11y:latest"
```

### シグナルジェネレーターをデプロイする

[x-ray-sample-app.yaml](./fargate-eks-xray-go-adot-amg/x-ray-sample-app.yaml) を編集して、ECR イメージパスを含めます。つまり、置き換えます `ACCOUNTID` および `REGION` ファイル内の独自の値に置き換えます（全体で 3 か所）。

``` 
    # change the following to your container image:
    image: "ACCOUNTID.dkr.ecr.REGION.amazonaws.com/ho11y:latest"
```

次のコマンドを使用して、サンプルアプリをクラスターにデプロイできます。

```
kubectl -n example-app apply -f x-ray-sample-app.yaml
```

## エンドツーエンド

インフラストラクチャとアプリケーションが配置されたので、セットアップをテストし、トレースを送信します。 `ho11y` EKS で実行されているものを X-Ray に送信し、AMG で可視化します。

### パイプラインの検証

ADOT コレクターがトレースを取り込んでいるかどうかを確認するには `ho11y`、サービスの 1 つをローカルで利用可能にして呼び出します。

まず、次のようにトラフィックを転送します。

```
kubectl -n example-app port-forward svc/frontend 8765:80
```

上記のコマンドを使用すると、 `frontend` マイクロサービス (a `ho11y` 2 つの他のインスタンスと通信するように設定されたインスタンス `ho11y` instances) がローカル環境で利用可能であり、次のように呼び出すことができます (トレースの作成がトリガーされます)。

```
$ curl localhost:8765/
{"traceId":"1-6193a9be-53693f29a0119ee4d661ba0d"}
```

:::tip
    呼び出しを自動化する場合は、 `curl` 呼び出し
    a `while true` ループ。
:::
セットアップを確認するには、[CloudWatch の X-Ray ビュー](https://console.aws.amazon.com/cloudwatch/home#xray:service-map/)にアクセスしてください。以下のような画面が表示されます。

![Screen shot of the X-Ray console in CW](../images/x-ray-cw-ho11y.png)

シグナルジェネレーターのセットアップとアクティブ化、および OpenTelemetry パイプラインのセットアップが完了したので、Grafana でトレースを使用する方法を見ていきましょう。

### Grafana ダッシュボード

[x-ray-sample-dashboard.json](./fargate-eks-xray-go-adot-amg/x-ray-sample-dashboard.json) から利用可能なサンプルダッシュボードをインポートできます。次のように表示されます。

![Screen shot of the X-Ray dashboard in AMG](../images/x-ray-amg-ho11y-dashboard.png)

さらに、下部のトレースのいずれかをクリックすると `downstreams` パネルで、それを詳しく調べて「Explore」タブで次のように表示できます。

![Screen shot of the X-Ray dashboard in AMG](../images/x-ray-amg-ho11y-explore.png)

ここから、以下のガイドを使用して Amazon Managed Grafana で独自のダッシュボードを作成できます。

* [ユーザーガイド: ダッシュボード](https://docs.aws.amazon.com/grafana/latest/userguide/dashboard-overview.html)
* [ダッシュボード作成のベストプラクティス](https://grafana.com/docs/grafana/latest/best-practices/best-practices-for-creating-dashboards/)

これで完了です。おめでとうございます。Fargate 上の EKS で ADOT を使用してトレースを取り込む方法を学習しました。

## クリーンアップ

まず Kubernetes リソースを削除し、EKS クラスターを破棄します。

```
kubectl delete all --all && \
eksctl delete cluster --name xray-eks-fargate
```
最後に、AWS コンソールから削除して Amazon Managed Grafana ワークスペースを削除します。 
