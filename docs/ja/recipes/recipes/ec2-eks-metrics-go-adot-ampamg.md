# EKS on EC2 で Amazon Managed Service for Prometheus を使用した AWS Distro for OpenTelemetry の利用

このレシピでは、[サンプルの Go アプリケーション](https://github.com/aws-observability/aws-otel-community/tree/master/sample-apps/prometheus-sample-app)にインスツルメンテーションを適用し、
[AWS Distro for OpenTelemetry(ADOT)](https://aws.amazon.com/otel) を使用してメトリクスを 
[Amazon Managed Service for Prometheus(AMP)](https://aws.amazon.com/prometheus/)にインジェストする方法を示します。
そして、[Amazon Managed Grafana(AMG)](https://aws.amazon.com/grafana/) を使用してそれらのメトリクスを可視化します。

デモのために、[Amazon Elastic Kubernetes Service(EKS)](https://aws.amazon.com/eks/) on EC2 クラスタと
[Amazon Elastic Container Registry(ECR)](https://aws.amazon.com/ecr/) レポジトリのセットアップを行います。

!!! note
    このガイドの完了には約 1 時間かかります。

## インフラストラクチャ
このレシピのインフラストラクチャを設定します。

### アーキテクチャ

ADOT パイプラインを使用すると、[ADOT Collector](https://github.com/aws-observability/aws-otel-collector) で Prometheus インスツルメンテーションされたアプリケーションをスクレイプし、スクレイプしたメトリクスを Amazon Managed Service for Prometheus にインジェストできます。

![アーキテクチャ](../images/adot-metrics-pipeline.png)

ADOT Collector には、Prometheus 固有の 2 つのコンポーネントが含まれています。

* Prometheus Receiver
* AWS Prometheus Remote Write Exporter

!!! info
    Prometheus Remote Write Exporter の詳細については、以下をご確認ください。 
    [AMP 用 Prometheus Remote Write Exporter スタートガイド](https://aws-otel.github.io/docs/getting-started/prometheus-remote-write-exporter)

### 前提条件

* AWS CLI がインストールされ、環境に[構成](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)されている必要があります。 
* 環境に [eksctl](https://docs.aws.amazon.com/eks/latest/userguide/eksctl.html) コマンドをインストールする必要があります。
* 環境に [kubectl](https://docs.aws.amazon.com/eks/latest/userguide/install-kubectl.html) をインストールする必要があります。
* [docker](https://docs.docker.com/get-docker/) が環境にインストールされている必要があります。

### EKS on EC2 クラスターの作成

このレシピのデモアプリケーションは、EKS の上で実行されます。
既存の EKS クラスターを使用するか、[cluster-config.yaml](./ec2-eks-metrics-go-adot-ampamg/cluster-config.yaml) を使用してクラスターを作成できます。

このテンプレートは、`t2.large` の EC2 2 ノードで新しいクラスターを作成します。

テンプレートファイルを編集し、`<your_region>` を 
[AMP でサポートされているリージョン](https://docs.aws.amazon.com/prometheus/latest/userguide/what-is-Amazon-Managed-Service-Prometheus.html#AMP-supported-Regions)のいずれかに設定します。

bash などのセッションで `<your_region>` を上書きするようにしてください。

```
export AWS_DEFAULT_REGION=<YOUR_REGION>
```

次のコマンドを使用してクラスターを作成します。

```
eksctl create cluster -f cluster-config.yaml
```

</your_region></your_region></your_region>

### ECR リポジトリのセットアップ

アプリケーションを EKS にデプロイするには、コンテナレジストリが必要です。
次のコマンドを使用して、アカウントに新しい ECR レジストリを作成できます。
`<your_region>` も設定してください。

```
aws ecr create-repository \
    --repository-name prometheus-sample-app \
    --image-scanning-configuration scanOnPush=true \
    --region <YOUR_REGION>
```

</your_region></your_region>

### AMPのセットアップ

AWS CLIを使用してワークスペースを作成する
```
aws amp create-workspace --alias prometheus-sample-app
```

次のコマンドでワークスペースが作成されたことを確認する:
```
aws amp list-workspaces
```

!!! info
    詳細は、[AMP スタートガイド](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-getting-started.html)をご覧ください。

### ADOT Collectorのセットアップ

[adot-collector-ec2.yaml](./ec2-eks-metrics-go-adot-ampamg/adot-collector-ec2.yaml) をダウンロードし、次のステップで説明するパラメータを使用してこのYAMLドキュメントを編集します。

この例では、ADOT Collectorの構成ではアノテーション `(scrape=true)` を使用して、スクレイプする対象エンドポイントを指示しています。 これにより、ADOT Collectorはクラスタ内の`kube-system` エンドポイントとサンプルアプリケーションのエンドポイントを区別できます。
別のサンプルアプリケーションをスクレイプしたい場合は、このリラベル構成を削除できます。

環境に対してダウンロードしたファイルを編集するには、次のステップに従ってください:

1\. `<your_region>` を現在のリージョンに置き換えます。

2\. `<your_endpoint>` をワークスペースのリモートライト URL に置き換えます。

次のクエリを実行することでAMPリモートライトURLエンドポイントを取得できます。

まず、次のようにワークスペースIDを取得します:

```
YOUR_WORKSPACE_ID=$(aws amp list-workspaces \
                    --alias prometheus-sample-app \
                    --query 'workspaces[0].workspaceId' --output text)
```

次に、ワークスペースのリモートライト URL エンドポイントを取得するには、次を使用します:

```
YOUR_ENDPOINT=$(aws amp describe-workspace \
                --workspace-id $YOUR_WORKSPACE_ID  \
                --query 'workspace.prometheusEndpoint' --output text)api/v1/remote_write
```

!!! warning
    `YOUR_ENDPOINT`が実際にリモートライトURLであること、つまりURLが `/api/v1/remote_write` で終わっていることを確認してください。


デプロイメントファイルを作成したら、次のコマンドを使用してクラスタに適用できます:

```
kubectl apply -f adot-collector-ec2.yaml
```

!!! info
    詳細は、[AWS Distro for OpenTelemetry(ADOT) Collectorのセットアップ](https://aws-otel.github.io/docs/getting-started/prometheus-remote-write-exporter/eks#aws-distro-for-opentelemetry-adot-collector-setup)をご覧ください。

</your_endpoint></your_region>

### AMGのセットアップ

[Amazon Managed Grafana – Getting Started](https://aws.amazon.com/blogs/mt/amazon-managed-grafana-getting-started/) のガイドを使用して、新しい AMG ワークスペースを設定します。

作成時に「Amazon Managed Service for Prometheus」をデータソースとして追加するようにしてください。

![Service managed permission settings](https://d2908q01vomqb2.cloudfront.net/972a67c48192728a34979d9a35164c1295401b71/2020/12/09/image008-1024x870.jpg)

## アプリケーション

このレシピでは、AWS Observability リポジトリの
[サンプルアプリケーション](https://github.com/aws-observability/aws-otel-community/tree/master/sample-apps/prometheus)
を使用します。

この Prometheus のサンプルアプリケーションは、Prometheus のメトリクスの 4 つのタイプ(カウンター、ゲージ、ヒストグラム、サマリー)をすべて生成し、それらを `/metrics` エンドポイントで公開します。

### コンテナイメージのビルド

コンテナイメージをビルドするには、まず Git リポジトリをクローンし、次のようにディレクトリを変更します。

```
git clone https://github.com/aws-observability/aws-otel-community.git && \
cd ./aws-otel-community/sample-apps/prometheus
```

まず、リージョン(上記でまだ設定していない場合)とアカウント ID をご自身の場合に当てはまるものに設定します。
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
    プロキシ golang.or のタイムアウトが原因で `go mod` が失敗する場合は、
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

[prometheus-sample-app.yaml](./ec2-eks-metrics-go-adot-ampamg/prometheus-sample-app.yaml)を編集して、ECR イメージパスを含めます。つまり、ファイル内の `ACCOUNTID` と `AWS_DEFAULT_REGION` を自分の値に置き換えます。

```
    # change the following to your container image:
    image: "ACCOUNTID.dkr.ecr.AWS_DEFAULT_REGION.amazonaws.com/prometheus-sample-app:latest"
```

これで次のコマンドを使用してサンプルアプリをクラスタにデプロイできます。

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
    次のコマンドでは、$AMP_ENDPOINT を AMP ワークスペースのエンドポイントに置き換えます。

    ```
    $ awscurl --service="aps" \
            --region="$AWS_DEFAULT_REGION" "https://$AMP_ENDPOINT/api/v1/query?query=adot_test_gauge0"
    {"status":"success","data":{"resultType":"vector","result":[{"metric":{"__name__":"adot_test_gauge0"},"value":[1606512592.493,"16.87214000011479"]}]}}
    ```

### Grafana ダッシュボードの作成

[prometheus-sample-app-dashboard.json](./ec2-eks-metrics-go-adot-ampamg/prometheus-sample-app-dashboard.json) で利用できる、サンプルアプリ用のサンプルダッシュボードをインポートできます。ダッシュボードは次のように表示されます。

![AMG の Prometheus サンプルアプリダッシュボードのスクリーンショット](../images/amg-prom-sample-app-dashboard.png)

さらに、次のガイドを使用して、Amazon Managed Grafana で独自のダッシュボードを作成してください。

* [ユーザーガイド: ダッシュボード](https://docs.aws.amazon.com/grafana/latest/userguide/dashboard-overview.html)
* [ダッシュボード作成のベストプラクティス](https://grafana.com/docs/grafana/latest/best-practices/best-practices-for-creating-dashboards/)

以上で完了です。おめでとうございます。EC2 上の EKS で ADOT を使用してメトリクスを取り込む方法を学びました。

## クリーンアップ

1. リソースとクラスタを削除する
```
kubectl delete all --all
eksctl delete cluster --name amp-eks-ec2
```
2. AMP ワークスペースを削除する
```
aws amp delete-workspace --workspace-id `aws amp list-workspaces --alias prometheus-sample-app --query 'workspaces[0].workspaceId' --output text`
```
3. amp-iamproxy-ingest-role IAM ロールを削除する
```
aws delete-role --role-name amp-iamproxy-ingest-role
```
4. コンソールから AMG ワークスペースを削除する
