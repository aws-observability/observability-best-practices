# Fargate 上の EKS で AWS X-Ray とともに AWS Distro for OpenTelemetry を使用する

このレシピでは、サンプルの Go アプリケーションにインスツルメンテーションを適用し、[AWS Distro for OpenTelemetry(ADOT)](https://aws.amazon.com/otel) を使用してトレースを [AWS X-Ray](https://aws.amazon.com/xray/) にインジェストし、トレースを [Amazon Managed Grafana](https://aws.amazon.com/grafana/) で可視化する方法を示します。

[Amazon Elastic Kubernetes Service(EKS)](https://aws.amazon.com/eks/) クラスターを [AWS Fargate](https://aws.amazon.com/fargate/) 上にセットアップし、完全なシナリオを示すために [Amazon Elastic Container Registry(ECR)](https://aws.amazon.com/ecr/) リポジトリを使用します。

!!! note
    このガイドの完了には約 1 時間かかります。

## インフラストラクチャ
このレシピのインフラストラクチャを設定します。

### アーキテクチャ

ADOT パイプラインを使用することで、
[ADOT Collector](https://github.com/aws-observability/aws-otel-collector) を利用して、
インスツルメンテーションされたアプリケーションからトレースを収集し、
X-Ray にインジェストすることができます。

![ADOT デフォルトパイプライン](../images/adot-default-pipeline.png)

### 前提条件

* AWS CLI がインストールされ、環境に構成されています。
* eksctl コマンドを環境にインストールする必要があります。
* kubectl を環境にインストールする必要があります。
* Docker が環境にインストールされています。 
* aws-observability/aws-o11y-recipes リポジトリがローカル環境にクローンされています。

### Fargate 上に EKS クラスターを作成する

デモアプリケーションは、Fargate 上の EKS クラスターで実行する Kubernetes アプリケーションです。
そのため、まず最初に提供されている [cluster_config.yaml](./fargate-eks-xray-go-adot-amg/cluster-config.yaml) を使用して EKS クラスターを作成します。

次のコマンドを使用してクラスターを作成します。

```
eksctl create cluster -f cluster-config.yaml
```

### ECR リポジトリの作成

アプリケーションを EKS にデプロイするには、コンテナリポジトリが必要です。
プライベートな ECR レジストリを使用しますが、コンテナイメージを共有したい場合は ECR Public も使用できます。

まず、次のように環境変数を設定します(リージョンはご自身のものに置き換えてください)。

```
export REGION="eu-west-1"
export ACCOUNTID=`aws sts get-caller-identity --query Account --output text`
```

次のコマンドを使用して、アカウントに新しい ECR リポジトリを作成できます。

```
aws ecr create-repository \
    --repository-name ho11y \
    --image-scanning-configuration scanOnPush=true \
    --region $REGION
```

### ADOT Collector のセットアップ

[adot-collector-fargate.yaml](./fargate-eks-xray-go-adot-amg/adot-collector-fargate.yaml) をダウンロードし、次のステップで説明するパラメータを使用してこの YAML ドキュメントを編集します。


```
kubectl apply -f adot-collector-fargate.yaml
```

### Managed Grafanaのセットアップ

[Amazon Managed Grafana – Getting Started](https://aws.amazon.com/blogs/mt/amazon-managed-grafana-getting-started/) ガイドを使用して新しいワークスペースをセットアップし、[X-Ray をデータソースとして追加](https://docs.aws.amazon.com/grafana/latest/userguide/x-ray-data-source.html)します。

## シグナルジェネレーター

レシピリポジトリの[sandbox](https://github.com/aws-observability/observability-best-practices/tree/main/sandbox/ho11y) で利用できる合成シグナルジェネレーターである `ho11y` を使用します。
したがって、まだローカル環境にリポジトリをクローンしていない場合は、次のようにクローンしてください。

```
git clone https://github.com/aws-observability/aws-o11y-recipes.git
```

### コンテナイメージのビルド
`ACCOUNTID` と `REGION` の環境変数が設定されていることを確認してください。
例:

```
export REGION="eu-west-1"
export ACCOUNTID=`aws sts get-caller-identity --query Account --output text`
```

`ho11y` コンテナイメージをビルドするには、まず `./sandbox/ho11y/` ディレクトリに移動し、コンテナイメージをビルドします。

!!! note
    次のビルド手順は、Docker デーモンまたは同等の OCI イメージビルドツールが実行されていることを前提としています。

```
docker build . -t "$ACCOUNTID.dkr.ecr.$REGION.amazonaws.com/ho11y:latest"
```

### コンテナイメージのプッシュ
次に、前述の作成した ECR リポジトリにコンテナイメージをプッシュできます。
そのために、まずデフォルトの ECR レジストリにログインします。

```
aws ecr get-login-password --region $REGION | \
    docker login --username AWS --password-stdin \
    "$ACCOUNTID.dkr.ecr.$REGION.amazonaws.com"
```

そして最後に、上記で作成した ECR リポジトリにコンテナイメージをプッシュします。

```
docker push "$ACCOUNTID.dkr.ecr.$REGION.amazonaws.com/ho11y:latest"
```

### シグナルジェネレーターのデプロイ

ECR イメージパスを含むように [x-ray-sample-app.yaml](./fargate-eks-xray-go-adot-amg/x-ray-sample-app.yaml) を編集してください。つまり、ファイル内の `ACCOUNTID` と `REGION` を自分の値に置き換えてください(全体で 3 か所)。

``` 
    # change the following to your container image:
    image: "ACCOUNTID.dkr.ecr.REGION.amazonaws.com/ho11y:latest"
```

次のコマンドを使用して、サンプルアプリをクラスタにデプロイできます。

```
kubectl -n example-app apply -f x-ray-sample-app.yaml
```

## エンドツーエンド

インフラとアプリケーションが整ったので、EKS で実行している `ho11y` から X-Ray へトレースを送信し、AMG で可視化することでセットアップをテストします。

### パイプラインの検証

`ho11y` からのトレースが ADOT コレクタにインジェストされていることを確認するには、サービスの1つをローカルで利用可能にして呼び出します。

まず、トラフィックを次のように転送します。

```
kubectl -n example-app port-forward svc/frontend 8765:80
```

上記のコマンドで、`frontend` マイクロサービス(`ho11y` インスタンスで構成され、他の2つの `ho11y` インスタンスと通信するように構成されている)がローカル環境で利用できるようになり、次のように呼び出すことができます(トレースの作成をトリガーします)。

```
$ curl localhost:8765/
{"traceId":"1-6193a9be-53693f29a0119ee4d661ba0d"}
```

!!! tip
    呼び出しを自動化したい場合は、`curl` 呼び出しを `while true` ループでラップできます。

セットアップを確認するには、[CloudWatch の X-Ray ビュー](https://console.aws.amazon.com/cloudwatch/home#xray:service-map/) を参照してください。以下のように表示されるはずです。

![CW の X-Ray コンソールのスクリーンショット](../images/x-ray-cw-ho11y.png)

シグナルジェネレータのセットアップとアクティブ化、OpenTelemetry パイプラインのセットアップが完了したので、Grafana でトレースを消費する方法を見ていきましょう。

### Grafana ダッシュボード

[x-ray-sample-dashboard.json](./fargate-eks-xray-go-adot-amg/x-ray-sample-dashboard.json) からインポートできるサンプルダッシュボードがあり、次のように表示されます。

![AMG の X-Ray ダッシュボードのスクリーンショット](../images/x-ray-amg-ho11y-dashboard.png)

さらに、下部の `downstreams` パネルのトレースをクリックすると、次のようにそれを掘り下げて「Explore」タブで表示できます。

![AMG の X-Ray ダッシュボードのスクリーンショット](../images/x-ray-amg-ho11y-explore.png)

ここから、以下のガイドを使用して Amazon Managed Grafana で独自のダッシュボードを作成できます。

* [ユーザーガイド: ダッシュボード](https://docs.aws.amazon.com/grafana/latest/userguide/dashboard-overview.html)
* [ダッシュボード作成のベストプラクティス](https://grafana.com/docs/grafana/latest/best-practices/best-practices-for-creating-dashboards/)

おめでとうございます。Fargate 上の EKS で ADOT を使用してトレースを取り込む方法を学び終えました。

## クリーンアップ

まず、Kubernetes リソースを削除し、EKS クラスターを破壊します。

```
kubectl delete all --all && \
eksctl delete cluster --name xray-eks-fargate
```

最後に、AWS コンソールから Amazon Managed Grafana ワークスペースを削除してください。
