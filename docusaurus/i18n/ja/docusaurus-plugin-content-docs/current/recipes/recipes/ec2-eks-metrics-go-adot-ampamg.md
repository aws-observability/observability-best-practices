# EC2 上の EKS で Amazon Managed Service for Prometheus と AWS Distro for OpenTelemetry を使用する

このレシピでは、[サンプルの Go アプリケーション](https://github.com/aws-observability/aws-otel-community/tree/master/sample-apps/prometheus-sample-app)を計装し、[AWS Distro for OpenTelemetry (ADOT)](https://aws.amazon.com/jp/otel) を使用してメトリクスを [Amazon Managed Service for Prometheus (AMP)](https://aws.amazon.com/jp/prometheus/) に取り込む方法を示します。
次に、[Amazon Managed Grafana (AMG)](https://aws.amazon.com/jp/grafana/) を使用してメトリクスを可視化します。

完全なシナリオを実演するために、[Amazon Elastic Kubernetes Service (EKS)](https://aws.amazon.com/jp/eks/) on EC2 クラスターと [Amazon Elastic Container Registry (ECR)](https://aws.amazon.com/jp/ecr/) リポジトリを設定します。

note
    このガイドを完了するのに約 1 時間かかります。


## インフラストラクチャ
次のセクションでは、このレシピのインフラストラクチャを設定します。

### アーキテクチャ

ADOT パイプラインにより、[ADOT Collector](https://github.com/aws-observability/aws-otel-collector) を使用して Prometheus で計測されたアプリケーションからメトリクスを収集し、収集したメトリクスを Amazon Managed Service for Prometheus に取り込むことができます。

![Architecture](../images/adot-metrics-pipeline.png)

ADOT Collector には、Prometheus 固有の 2 つのコンポーネントが含まれています。

* Prometheus Receiver
* AWS Prometheus Remote Write Exporter

info
    Prometheus Remote Write Exporter の詳細については、以下を参照してください。
    [Getting Started with Prometheus Remote Write Exporter for AMP](https://aws-otel.github.io/docs/getting-started/prometheus-remote-write-exporter)


### 前提条件

* AWS CLI が環境内に[インストール](https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/cli-chap-install.html)され、[設定](https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/cli-chap-configure.html)されている。
* 環境内に [eksctl](https://docs.aws.amazon.com/ja_jp/eks/latest/userguide/eksctl.html) コマンドをインストールする必要がある。
* 環境内に [kubectl](https://docs.aws.amazon.com/ja_jp/eks/latest/userguide/install-kubectl.html) をインストールする必要がある。
* 環境内に [docker](https://docs.docker.com/get-docker/) がインストールされている。

### EC2 上に EKS クラスターを作成する

このレシピのデモアプリケーションは EKS 上で実行されます。
既存の EKS クラスターを使用するか、[cluster-config.yaml](./ec2-eks-metrics-go-adot-ampamg/cluster-config.yaml) を使用して新しいクラスターを作成できます。

このテンプレートは、2 つの EC2 `t2.large` ノードを持つ新しいクラスターを作成します。

テンプレートファイルを編集し、`<your_region>` を [AMP でサポートされているリージョン](https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/what-is-Amazon-Managed-Service-Prometheus.html) の 1 つに設定してください。

セッションで `<your_region>` を上書きしていることを確認してください。例えば bash の場合:
```
export AWS_DEFAULT_REGION=<YOUR_REGION>
```

次のコマンドを使用してクラスターを作成します。
```
eksctl create cluster -f cluster-config.yaml
```
</your_region></your_region></your_region>

### ECR リポジトリを設定する

アプリケーションを EKS にデプロイするには、コンテナレジストリが必要です。
次のコマンドを使用して、アカウントに新しい ECR レジストリを作成できます。
`<your_region>` も設定することを忘れずに行ってください。

```
aws ecr create-repository \
    --repository-name prometheus-sample-app \
    --image-scanning-configuration scanOnPush=true \
    --region <YOUR_REGION>
```
</your_region></your_region>

### AMP のセットアップ

AWS CLI を使用してワークスペースを作成します。
```
aws amp create-workspace --alias prometheus-sample-app
```

次のコマンドを使用してワークスペースが作成されたことを確認します。
```
aws amp list-workspaces
```

alert{type="info"}
詳細については、[AMP の開始方法](https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/AMP-getting-started.html)ガイドを参照してください。


### ADOT コレクターのセットアップ

[adot-collector-ec2.yaml](./ec2-eks-metrics-go-adot-ampamg/adot-collector-ec2.yaml) をダウンロードし、次のステップで説明されているパラメーターでこの YAML ドキュメントを編集します。

この例では、ADOT コレクターの設定は、スクレイピングするターゲットエンドポイントを指示するアノテーション `(scrape=true)` を使用しています。
これにより、ADOT コレクターはクラスター内の `kube-system` エンドポイントからサンプルアプリのエンドポイントを区別できます。
別のサンプルアプリをスクレイピングする場合は、この再ラベル付け設定を削除できます。

ダウンロードしたファイルを環境に合わせて編集するには、次の手順に従ってください。

1\. `<your_region>` を現在のリージョンに置き換えます。

2\. `<your_endpoint>` をワークスペースのリモートライトURLに置き換えます。

AMP のリモートライト URL エンドポイントを取得するには、次のクエリを実行します。

まず、次のようにワークスペース ID を取得します。

```
YOUR_WORKSPACE_ID=$(aws amp list-workspaces \
                    --alias prometheus-sample-app \
                    --query 'workspaces[0].workspaceId' --output text)
```

次に、ワークスペースのリモートライト URL エンドポイントを取得します。

```
YOUR_ENDPOINT=$(aws amp describe-workspace \
                --workspace-id $YOUR_WORKSPACE_ID  \
                --query 'workspace.prometheusEndpoint' --output text)api/v1/remote_write
```

warning
    `YOUR_ENDPOINT` がリモートライト URL であることを確認してください。
    つまり、URL は `/api/v1/remote_write` で終わっている必要があります。

デプロイメントファイルを作成したら、次のコマンドを使用してクラスターにこれを適用できます。

```
kubectl apply -f adot-collector-ec2.yaml
```

info
    詳細については、[AWS Distro for OpenTelemetry (ADOT) コレクターのセットアップ](https://aws-otel.github.io/docs/getting-started/prometheus-remote-write-exporter/eks#aws-distro-for-opentelemetry-adot-collector-setup) を参照してください。

</your_endpoint></your_region>

### AMG のセットアップ

[Amazon Managed Grafana - Getting Started](https://aws.amazon.com/jp/blogs/news/amazon-managed-grafana-getting-started/) ガイドを使用して、新しい AMG ワークスペースを設定します。

作成時に "Amazon Managed Service for Prometheus" をデータソースとして追加することを忘れずに行ってください。

![Service managed permission settings](https://d2908q01vomqb2.cloudfront.net/972a67c48192728a34979d9a35164c1295401b71/2020/12/09/image008-1024x870.jpg)

## アプリケーション

このレシピでは、AWS Observability リポジトリの [サンプルアプリケーション](https://github.com/aws-observability/aws-otel-community/tree/master/sample-apps/prometheus) を使用します。

この Prometheus サンプルアプリは、4 種類すべての Prometheus メトリクスタイプ (カウンター、ゲージ、ヒストグラム、サマリー) を生成し、`/metrics` エンドポイントで公開します。

### コンテナイメージのビルド

コンテナイメージをビルドするには、まず Git リポジトリをクローンし、次のようにディレクトリに移動します。

```
git clone https://github.com/aws-observability/aws-otel-community.git && \
cd ./aws-otel-community/sample-apps/prometheus
```

まず、お使いの環境に合わせてリージョン (上記で設定していない場合) とアカウント ID を設定します。
`<your_region>` を現在のリージョンに置き換えてください。
例えば、Bash シェルでは次のようになります。

```
export AWS_DEFAULT_REGION=<YOUR_REGION>
export ACCOUNTID=`aws sts get-caller-identity --query Account --output text`
```

次に、コンテナイメージをビルドします。

```
docker build . -t "$ACCOUNTID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/prometheus-sample-app:latest"
```

note
    環境で proxy.golang.or i/o タイムアウトのため `go mod` が失敗する場合は、Dockerfile を編集して go mod プロキシをバイパスできます。

    Dockerfile の次の行を変更します。
    ```
    RUN GO111MODULE=on go mod download
    ```
    次のように変更します。
    ```
    RUN GOPROXY=direct GO111MODULE=on go mod download
    ```

これで、前に作成した ECR リポジトリにコンテナイメージをプッシュできます。

そのために、まず デフォルトの ECR レジストリにログインします。

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

### サンプルアプリをデプロイする

[prometheus-sample-app.yaml](./ec2-eks-metrics-go-adot-ampamg/prometheus-sample-app.yaml) を編集し、ECR イメージパスを含めます。つまり、ファイル内の `ACCOUNTID` と `AWS_DEFAULT_REGION` を自身の値に置き換えます。

```
    # change the following to your container image:
    image: "ACCOUNTID.dkr.ecr.AWS_DEFAULT_REGION.amazonaws.com/prometheus-sample-app:latest"
```

これで、次のコマンドを使ってクラスターにサンプルアプリをデプロイできます。

```
kubectl apply -f prometheus-sample-app.yaml
```

## エンドツーエンド

インフラストラクチャとアプリケーションが準備できたので、セットアップをテストします。
EKS で実行されている Go アプリからメトリクスを AMP に送信し、AMG で可視化します。

### パイプラインが機能していることを確認する

ADOT コレクターがサンプルアプリの Pod をスクレイピングし、メトリクスを AMP に取り込んでいるかどうかを確認するには、コレクターのログを確認します。

次のコマンドを入力して、ADOT コレクターのログを確認します。

```
kubectl -n adot-col logs adot-collector -f
```

サンプルアプリからスクレイピングされたメトリクスの出力例は、次のようになります。

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

tip
    AMP がメトリクスを受信したかどうかを確認するには、[awscurl](https://github.com/okigan/awscurl) を使用できます。
    このツールを使用すると、AWS Sigv4 認証を使用して、コマンドラインから HTTP リクエストを送信できます。
    ただし、AMP からクエリを実行する正しい権限を持つ AWS 認証情報をローカルに設定する必要があります。
    次のコマンドで `$AMP_ENDPOINT` を AMP ワークスペースのエンドポイントに置き換えてください。

    ```
    $ awscurl --service="aps" \
            --region="$AWS_DEFAULT_REGION" "https://$AMP_ENDPOINT/api/v1/query?query=adot_test_gauge0"
    {"status":"success","data":{"resultType":"vector","result":[{"metric":{"__name__":"adot_test_gauge0"},"value":[1606512592.493,"16.87214000011479"]}]}}
    ```


### Grafana ダッシュボードを作成する

サンプルアプリ用の例ダッシュボードを [prometheus-sample-app-dashboard.json](./ec2-eks-metrics-go-adot-ampamg/prometheus-sample-app-dashboard.json) から インポートできます。ダッシュボードは次のように表示されます。

![Amazon Managed Grafana の Prometheus サンプルアプリダッシュボードのスクリーンショット](../images/amg-prom-sample-app-dashboard.png)

さらに、Amazon Managed Grafana で独自のダッシュボードを作成するには、次のガイドを参照してください。

* [ユーザーガイド: ダッシュボード](https://docs.aws.amazon.com/ja_jp/grafana/latest/userguide/dashboard-overview.html)
* [ダッシュボード作成のベストプラクティス](https://grafana.com/docs/grafana/latest/best-practices/best-practices-for-creating-dashboards/)

以上で、EC2 上の EKS で ADOT を使ってメトリクスを取り込む方法を学びました。おめでとうございます。

## クリーンアップ

1. リソースとクラスターを削除します
```
kubectl delete all --all
eksctl delete cluster --name amp-eks-ec2
```
2. AMP ワークスペースを削除します
```
aws amp delete-workspace --workspace-id `aws amp list-workspaces --alias prometheus-sample-app --query 'workspaces[0].workspaceId' --output text`
```
3. amp-iamproxy-ingest-role IAM ロールを削除します
```
aws delete-role --role-name amp-iamproxy-ingest-role
```
4. AMG ワークスペースをコンソールから削除します。
