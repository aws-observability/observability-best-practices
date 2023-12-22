# Fargate 上の EKS で AWS Distro for OpenTelemetry を Amazon Managed Service for Prometheus と共に利用する

このレシピでは、[サンプルの Go アプリケーション](https://github.com/aws-observability/aws-otel-community/tree/master/sample-apps/prometheus-sample-app)にインスツルメンテーションを施し、
[AWS Distro for OpenTelemetry(ADOT)](https://aws.amazon.com/otel) を使用してメトリクスを 
[Amazon Managed Service for Prometheus](https://aws.amazon.com/prometheus/)にインジェストする方法を示します。
そして、[Amazon Managed Grafana](https://aws.amazon.com/grafana/) を使用してそれらのメトリクスを可視化します。

[Amazon Elastic Kubernetes Service(EKS)](https://aws.amazon.com/eks/) 上に
[AWS Fargate](https://aws.amazon.com/fargate/) クラスタをセットアップし、
[Amazon Elastic Container Registry(ECR)](https://aws.amazon.com/ecr/) レポジトリを使用して、
完全なシナリオをデモンストレーションします。

!!! note
    このガイドの完了には約 1 時間かかります。

## インフラストラクチャ
このレシピのインフラストラクチャを設定します。

### アーキテクチャ

ADOT パイプラインを使用することで、[ADOT Collector](https://github.com/aws-observability/aws-otel-collector) を利用して Prometheus で計測されたアプリケーションをスクレイピングし、スクレイプされたメトリクスを Amazon Managed Service for Prometheus にインジェストできます。

![アーキテクチャ](../images/adot-metrics-pipeline.png)

ADOT Collector には、Prometheus 固有の 2 つのコンポーネントが含まれています。

* Prometheus Receiver
* AWS Prometheus Remote Write Exporter

!!! info
    Prometheus Remote Write Exporter の詳細は以下をご確認ください。 
    [Getting Started with Prometheus Remote Write Exporter for AMP](https://aws-otel.github.io/docs/getting-started/prometheus-remote-write-exporter)

### 前提条件

* AWS CLI がインストールされ、環境に[構成](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)されている必要があります。
* 環境に [eksctl](https://docs.aws.amazon.com/eks/latest/userguide/eksctl.html) コマンドをインストールする必要があります。
* 環境に [kubectl](https://docs.aws.amazon.com/eks/latest/userguide/install-kubectl.html) をインストールする必要があります。  
* [Docker](https://docs.docker.com/get-docker/) が環境にインストールされている必要があります。

### Fargate 上に EKS クラスターを作成する

デモアプリケーションは、Fargate 上の EKS クラスターで実行する Kubernetes アプリケーションです。
そこで、まず提供されている [cluster-config.yaml](./fargate-eks-metrics-go-adot-ampamg/cluster-config.yaml) テンプレートファイルを使用して、EKS クラスターを作成します。
`<your_region>` を [AMP でサポートされているリージョン](https://docs.aws.amazon.com/prometheus/latest/userguide/what-is-Amazon-Managed-Service-Prometheus.html#AMP-supported-Regions) のいずれかに変更してください。

シェルセッションで `<your_region>` を設定することを確認してください。たとえば、Bash の場合は次のように設定します。

```
export AWS_DEFAULT_REGION=<YOUR_REGION>
```

次のコマンドを使用してクラスターを作成します。

```
eksctl create cluster -f cluster-config.yaml
```

</your_region></your_region></your_region>

### ECR リポジトリの作成

アプリケーションを EKS にデプロイするには、コンテナリポジトリが必要です。
次のコマンドを使用して、アカウントに新しい ECR リポジトリを作成できます。
`<your_region>` も設定するようにしてください。

```
aws ecr create-repository \
    --repository-name prometheus-sample-app \
    --image-scanning-configuration scanOnPush=true \
    --region <YOUR_REGION>
```

</your_region></your_region>

### AMPのセットアップ

まず、AWS CLIを使用してAmazon Managed Service for Prometheusワークスペースを次のコマンドで作成します。

```
aws amp create-workspace --alias prometheus-sample-app
```

次のコマンドでワークスペースが作成されたことを確認します。

```
aws amp list-workspaces
```

!!! info
    詳細は、[AMP スタートガイド](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-getting-started.html)をご確認ください。

### ADOT Collectorのセットアップ

[adot-collector-fargate.yaml](./fargate-eks-metrics-go-adot-ampamg/adot-collector-fargate.yaml) をダウンロードし、次のステップで説明するパラメータを使用してこのYAMLドキュメントを編集します。

この例では、ADOT Collectorの構成では `(scrape=true)` というアノテーションを使用して、スクレイプする対象のエンドポイントを伝えています。 これにより、ADOT Collectorはクラスタ内の`kube-system` エンドポイントとサンプルアプリのエンドポイントを区別できます。
別のサンプルアプリをスクレイプしたい場合は、このre-label構成を削除できます。

環境に合わせてダウンロードしたファイルを編集するには、次のステップに従ってください:

1\. `<your_region>` を現在のリージョンに置き換えます。

2\. `<your_endpoint>` をワークスペースのリモートライト URL に置き換えます。

次のクエリを実行することでAMPリモートライトURLエンドポイントを取得できます。

まず、次のようにワークスペースIDを取得します:

```
YOUR_WORKSPACE_ID=$(aws amp list-workspaces \
                    --alias prometheus-sample-app \
                    --query 'workspaces[0].workspaceId' --output text)
```

次に、ワークスペースのリモートライト URL エンドポイントを取得します:

```
YOUR_ENDPOINT=$(aws amp describe-workspace \
                --workspace-id $YOUR_WORKSPACE_ID  \
                --query 'workspace.prometheusEndpoint' --output text)api/v1/remote_write
```

!!! warning
    `YOUR_ENDPOINT`が実際にリモートライトURLであること、つまりURLが `/api/v1/remote_write` で終わっていることを確認してください。


デプロイメントファイルを作成したら、次のコマンドを使用してクラスタに適用できます:

```
kubectl apply -f adot-collector-fargate.yaml
```

!!! info
    詳細は、[AWS Distro for OpenTelemetry(ADOT) Collectorのセットアップ](https://aws-otel.github.io/docs/getting-started/prometheus-remote-write-exporter/eks#aws-distro-for-opentelemetry-adot-collector-setup)をご覧ください。

</your_endpoint></your_region>

### AMGのセットアップ

[Amazon Managed Grafana – Getting Started](https://aws.amazon.com/blogs/mt/amazon-managed-grafana-getting-started/) ガイドを使用して、新しい AMG ワークスペースをセットアップします。

作成時に「Amazon Managed Service for Prometheus」をデータソースとして追加するようにしてください。

![Service managed permission settings](../images/amg-console-create-workspace-managed-permissions.jpg)

## アプリケーション

このレシピでは、AWS Observability リポジトリの
[サンプルアプリケーション](https://github.com/aws-observability/aws-otel-community/tree/master/sample-apps/prometheus-sample-app)
を使用します。

この Prometheus サンプルアプリケーションは、すべての 4 つの Prometheus メトリクスタイプ
(カウンター、ゲージ、ヒストグラム、サマリー)を生成し、`/metrics` エンドポイントで公開します。

### コンテナイメージのビルド

コンテナイメージをビルドするには、まず Git リポジトリをクローンし、次のようにディレクトリを変更します。

```
git clone https://github.com/aws-observability/aws-otel-community.git && \
cd ./aws-otel-community/sample-apps/prometheus
```

まず、リージョン(上記でまだ設定していない場合)とアカウント ID をご自身の場合に該当するものに設定します。
`<your_region>` を現在のリージョンに置き換えます。
たとえば、Bash シェルでは次のようになります。

```
export AWS_DEFAULT_REGION=<YOUR_REGION>
export ACCOUNTID=`aws sts get-caller-identity --query Account --output text`
```

次に、コンテナイメージをビルドします。

```
docker build . -t "$ACCOUNTID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/prometheus-sample-app:latest"
```  

!!! note
    proxy.golang.or のタイムアウトが原因で `go mod` が失敗する場合は、
    Dockerfile を編集して go mod プロキシをバイパスできます。

    Dockerfile の次の行を変更します。
    ```
    RUN GO111MODULE=on go mod download
    ```
    を次のように変更します。
    ```
    RUN GOPROXY=direct GO111MODULE=on go mod download
    ```

これで、前に作成した ECR リポジトリにコンテナイメージをプッシュできるようになりました。

そのために、まずデフォルトの ECR レジストリにログインします。

```
aws ecr get-login-password --region $AWS_DEFAULT_REGION | \
    docker login --username AWS --password-stdin \
    "$ACCOUNTID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com"
```

最後に、上記で作成した ECR リポジトリにコンテナイメージをプッシュします。

```
docker push "$ACCOUNTID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/prometheus-sample-app:latest"
```

</your_region></your_region>

### サンプルアプリのデプロイ

ECR イメージパスを含むように [prometheus-sample-app.yaml](./fargate-eks-metrics-go-adot-ampamg/prometheus-sample-app.yaml) を編集してください。つまり、ファイル内の `ACCOUNTID` と `AWS_DEFAULT_REGION` を自分の値に置き換えます。

```
    # change the following to your container image:
    image: "ACCOUNTID.dkr.ecr.AWS_DEFAULT_REGION.amazonaws.com/prometheus-sample-app:latest"
```

次のコマンドを使用して、サンプルアプリをクラスタにデプロイできます。

```
kubectl apply -f prometheus-sample-app.yaml
```

## エンドツーエンド

インフラとアプリケーションが整ったので、EKS で実行されている Go アプリから AMP にメトリクスを送信し、AMG で可視化するという設定をテストします。

### パイプラインが機能していることを確認する

サンプルアプリのポッドから ADOT コレクターがスクレイピングしてメトリクスを AMP に取り込んでいることを確認するには、コレクターログを確認します。

ADOT コレクターログをフォローするために、次のコマンドを入力します。

```
kubectl -n adot-col logs adot-collector -f
```

サンプルアプリからスクレイプされたメトリクスのログ出力の一例は、次のようになります。

```
...
Resource labels:
     -> service.name: STRING(kubernetes-service-endpoints)
     -> host.name: STRING(192.168.16.238)
     -> port: STRING(8080)
     -> scheme: STRING(http)
InstrumentationLibraryMetrics #0
Metric #0
Descriptor:
     -> Name: test_gauge0
     -> Description: This is my gauge
     -> Unit:
     -> DataType: DoubleGauge
DoubleDataPoints #0
StartTime: 0
Timestamp: 1606511460471000000
Value: 0.000000
...
```

!!! tip
    AMP がメトリクスを受信したかどうかを確認するには、[awscurl](https://github.com/okigan/awscurl) を使用できます。
    このツールを使用すると、AWS Sigv4 認証を使用してコマンドラインから HTTP リクエストを送信できるため、
    AMP からクエリするための適切なアクセス許可を持つ AWS 資格情報をローカルに設定する必要があります。
    次のコマンドで、$AMP_ENDPOINT を AMP ワークスペースのエンドポイントに置き換えます。

    ```
    $ awscurl --service="aps" \
            --region="$AWS_DEFAULT_REGION" "https://$AMP_ENDPOINT/api/v1/query?query=adot_test_gauge0"
    {"status":"success","data":{"resultType":"vector","result":[{"metric":{"__name__":"adot_test_gauge0"},"value":[1606512592.493,"16.87214000011479"]}]}}
    ```

### Grafana ダッシュボードの作成

[prometheus-sample-app-dashboard.json](./fargate-eks-metrics-go-adot-ampamg/prometheus-sample-app-dashboard.json) で利用できる、サンプルアプリ用のサンプルダッシュボードをインポートできます。ダッシュボードは次のように表示されます。

![AMG の Prometheus サンプルアプリダッシュボードのスクリーンショット](../images/amg-prom-sample-app-dashboard.png)

さらに、次のガイドを使用して、Amazon Managed Grafana で独自のダッシュボードを作成してください。

* [ユーザーガイド: ダッシュボード](https://docs.aws.amazon.com/grafana/latest/userguide/dashboard-overview.html)
* [ダッシュボード作成のベストプラクティス](https://grafana.com/docs/grafana/latest/best-practices/best-practices-for-creating-dashboards/)

以上で完了です。おめでとうございます。Fargate 上の EKS で ADOT を使用してメトリクスを取り込む方法を学びました。

## クリーンアップ

まず、Kubernetes リソースを削除し、EKS クラスターを破棄します。

```
kubectl delete all --all && \
eksctl delete cluster --name amp-eks-fargate
```

Amazon Managed Service for Prometheus ワークスペースを削除します。

```
aws amp delete-workspace --workspace-id \
    `aws amp list-workspaces --alias prometheus-sample-app --query 'workspaces[0].workspaceId' --output text`
```

IAM ロールを削除します。

```
aws delete-role --role-name adot-collector-role
```

最後に、AWS コンソールから Amazon Managed Grafana ワークスペースを削除します。
