# EKS on EC2 で AWS Distro for OpenTelemetry を使用して Amazon Managed Service for Prometheus と連携する

このレシピでは、[サンプル Go アプリケーション](https://github.com/aws-observability/aws-otel-community/tree/master/sample-apps/prometheus-sample-app)を計装し、[AWS Distro for OpenTelemetry (ADOT)](https://aws.amazon.com/otel) を使用して [Amazon Managed Service for Prometheus (AMP)](https://aws.amazon.com/prometheus/) にメトリクスを取り込む方法を示します。次に、[Amazon Managed Grafana (AMG)](https://aws.amazon.com/grafana/) を使用してメトリクスを可視化します。

[Amazon Elastic Kubernetes Service (EKS)](https://aws.amazon.com/eks/) on EC2 クラスターと [Amazon Elastic Container Registry (ECR)](https://aws.amazon.com/ecr/) リポジトリをセットアップして、完全なシナリオを実演します。

:::note
    このガイドは完了までに約 1 時間かかります。
:::
## インフラストラクチャ
次のセクションでは、このレシピのインフラストラクチャをセットアップします。

### アーキテクチャ


ADOT パイプラインを使用すると、[ADOT Collector](https://github.com/aws-observability/aws-otel-collector) を使用して Prometheus でインストルメント化されたアプリケーションをスクレイピングし、スクレイピングされたメトリクスを Amazon Managed Service for Prometheus に取り込むことができます。

![Architecture](../images/adot-metrics-pipeline.png)

ADOT Collector には、Prometheus に固有の 2 つのコンポーネントが含まれています。

* Prometheus Receiver
* AWS Prometheus Remote Write Exporter

:::info
    Prometheus Remote Write Exporter の詳細については、以下を確認してください。
    [AMP 向け Prometheus Remote Write Exporter の開始方法](https://aws-otel.github.io/docs/getting-started/prometheus-remote-write-exporter)
:::

### 前提条件

* AWS CLI が環境に[インストール](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html)され、[設定](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)されていること。
* 環境に [eksctl](https://docs.aws.amazon.com/eks/latest/userguide/eksctl.html) コマンドをインストールする必要があります。
* 環境に [kubectl](https://docs.aws.amazon.com/eks/latest/userguide/install-kubectl.html) をインストールする必要があります。
* 環境に [docker](https://docs.docker.com/get-docker/) がインストールされていること。

### EC2 上に EKS クラスターを作成する

このレシピのデモアプリケーションは EKS 上で実行されます。
既存の EKS クラスターを使用するか、[cluster-config.yaml](./ec2-eks-metrics-go-adot-ampamg/cluster-config.yaml) を使用して新しいクラスターを作成できます。

このテンプレートは、2 つの EC2 を持つ新しいクラスターを作成します `t2.large` ノード。

テンプレートファイルを編集して設定します。 `<YOUR_REGION>` [AMP がサポートされているリージョン](https://docs.aws.amazon.com/prometheus/latest/userguide/what-is-Amazon-Managed-Service-Prometheus.html#AMP-supported-Regions)のいずれかに設定します。

必ず上書きしてください `<YOUR_REGION>` セッション内で設定します。例えば bash の場合は次のようにします。
```
export AWS_DEFAULT_REGION=<YOUR_REGION>
```

以下のコマンドを使用してクラスターを作成します。
```
eksctl create cluster -f cluster-config.yaml
```

### ECR リポジトリをセットアップする

アプリケーションを EKS にデプロイするには、コンテナレジストリが必要です。
次のコマンドを使用して、アカウントに新しい ECR レジストリを作成できます。
必ず設定してください `<YOUR_REGION>` も同様です。

```
aws ecr create-repository \
    --repository-name prometheus-sample-app \
    --image-scanning-configuration scanOnPush=true \
    --region <YOUR_REGION>
```

### AMP をセットアップする


AWS CLI を使用してワークスペースを作成します
```
aws amp create-workspace --alias prometheus-sample-app
```

次のコマンドを使用してワークスペースが作成されたことを確認します。
```
aws amp list-workspaces
```

:::info
    詳細については、[AMP 入門](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-getting-started.html)ガイドを参照してください。
:::

### ADOT Collector をセットアップする

[adot-collector-ec2.yaml](./ec2-eks-metrics-go-adot-ampamg/adot-collector-ec2.yaml) をダウンロードし、次の手順で説明するパラメータを使用してこの YAML ドキュメントを編集します。

この例では、ADOT Collector の設定でアノテーションを使用します `(scrape=true)`
スクレイピングするターゲットエンドポイントを指定します。これにより、ADOT Collector はサンプルアプリのエンドポイントを区別できます `kube-system` クラスター内のエンドポイン��。
別のサンプルアプリをスクレイピングする場合は、再ラベル設定からこれを削除できます。

ダウンロードしたファイルを環境に合わせて編集するには、次の手順を実行します。

1\. 置き換えます `<YOUR_REGION>` 現在のリージョンに置き換えてください。

2\. 置き換えます `<YOUR_ENDPOINT>` ワークスペースのリモート書き込み URL を使用します。

以下のクエリを実行して、AMP リモート書き込み URL エンドポイントを取得します。

まず、次のようにワークスペース ID を取得します。

```
YOUR_WORKSPACE_ID=$(aws amp list-workspaces \
                    --alias prometheus-sample-app \
                    --query 'workspaces[0].workspaceId' --output text)
```

次のコマンドを使用して、ワークスペースのリモート書き込み URL エンドポイント URL を取得します。

```
YOUR_ENDPOINT=$(aws amp describe-workspace \
                --workspace-id $YOUR_WORKSPACE_ID  \
                --query 'workspace.prometheusEndpoint' --output text)api/v1/remote_write
```

:::warning
    次のことを確認してください。 `YOUR_ENDPOINT` は実際にはリモート書き込み URL です。つまり、
    URL の末尾は次のようになります `/api/v1/remote_write`.
:::
デプロイメントファイルを作成した後、次のコマンドを使用してクラスターに適用できます。

```
kubectl apply -f adot-collector-ec2.yaml
```

:::info
    詳細については、[AWS Distro for OpenTelemetry (ADOT) Collector のセットアップ](https://aws-otel.github.io/docs/getting-started/prometheus-remote-write-exporter/eks#aws-distro-for-opentelemetry-adot-collector-setup)を参照してください。
:::

### AMG をセットアップする

[Amazon Managed Grafana – Getting Started](https://aws.amazon.com/blogs/mt/amazon-managed-grafana-getting-started/) ガイドを使用して、新しい AMG ワークスペースをセットアップします。

作成時に「Amazon Managed Service for Prometheus」をデータソースとして追加してください。

![Service managed permission settings](https://d2908q01vomqb2.cloudfront.net/972a67c48192728a34979d9a35164c1295401b71/2020/12/09/image008-1024x870.jpg)


## アプリケーション

このレシピでは、AWS Observability リポジトリの[サンプルアプリケーション](https://github.com/aws-observability/aws-otel-community/tree/master/sample-apps/prometheus)を使用します。

この Prometheus サンプルアプリは、4 つすべての Prometheus メトリクスタイプ（counter、gauge、histogram、summary）を生成し、それらを公開します。 `/metrics` エンドポイント。

### コンテナイメージをビルドする

コンテナイメージをビルドするには、まず Git リポジトリをクローンし、次のようにディレクトリに移動します。

```
git clone https://github.com/aws-observability/aws-otel-community.git && \
cd ./aws-otel-community/sample-apps/prometheus
```

まず、リージョン（上記でまだ設定していない場合）とアカウント ID を、お客様のケースに該当するものに設定します。
置き換えます `<YOUR_REGION>` を現在のリージョンに置き換えます。たとえば、Bash シェルでは次のようになります。

```
export AWS_DEFAULT_REGION=<YOUR_REGION>
export ACCOUNTID=`aws sts get-caller-identity --query Account --output text`
```

次に、コンテナイメージをビルドします。

```
docker build . -t "$ACCOUNTID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/prometheus-sample-app:latest"
```

:::note
    もし `go mod` プロキシによる環境での失敗や golang.or の I/O タイムアウトが発生する場合は、Dockerfile を編集することで go mod プロキシをバイパスできます。

Docker ファイルの次の行を変更します。
    ```
    RUN GO111MODULE=on go mod download
    ```
    に変更します。
    ```
    RUN GOPROXY=direct GO111MODULE=on go mod download
    ```
:::
これで、先ほど作成した ECR リポジトリにコンテナイメージをプッシュできます。

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

### サンプルアプリケーションをデプロイする

[prometheus-sample-app.yaml](./ec2-eks-metrics-go-adot-ampamg/prometheus-sample-app.yaml) を編集して、ECR イメージパスを含めます。つまり、置き換えます `ACCOUNTID` および `AWS_DEFAULT_REGION` ファイル内の値を独自の値に置き換えます。

```
    # change the following to your container image:
    image: "ACCOUNTID.dkr.ecr.AWS_DEFAULT_REGION.amazonaws.com/prometheus-sample-app:latest"
```

次のコマンドを使用して、サンプルアプリをクラスターにデプロイできます。

```
kubectl apply -f prometheus-sample-app.yaml
```

## エンドツーエンド

インフラストラクチャとアプリケーションが配置されたので、セットアップをテストし、EKS で実行されている Go アプリからメトリクスを AMP に送信し、AMG で可視化します。

### パイプラインが動作していることを確認する

ADOT Collector がサンプルアプリの Pod をスクレイピングし、メトリクスを AMP に取り込んでいるかを確認するために、Collector のログを確認します。

次のコマンドを入力して、ADOT コレクターのログを確認します。

```
kubectl -n adot-col logs adot-collector -f
```

サンプルアプリからスクレイピングされたメトリクスのログ出力の一例は、次のようになります。

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

:::tip
    AMP がメトリクスを受信したかどうかを確認するには、[awscurl](https://github.com/okigan/awscurl) を使用できます。
    このツールを使用すると、AWS Sigv4 認証を使用してコマンドラインから HTTP リクエストを送信できます。
    そのため、AMP からクエリを実行するための適切な権限を持つ AWS 認証情報をローカルに設定する必要があります。
    次のコマンドで置き換えてください `$AMP_ENDPOINT` AMP ワークスペースのエンドポイントを使用します。

    ```
    $ awscurl --service="aps" \
            --region="$AWS_DEFAULT_REGION" "https://$AMP_ENDPOINT/api/v1/query?query=adot_test_gauge0"
    {"status":"success","data":{"resultType":"vector","result":[{"metric":{"__name__":"adot_test_gauge0"},"value":[1606512592.493,"16.87214000011479"]}]}}
    ```
:::
### Grafana ダッシュボードを作成する

サンプルアプリ用のダッシュボードの例を [prometheus-sample-app-dashboard.json](./ec2-eks-metrics-go-adot-ampamg/prometheus-sample-app-dashboard.json) からインポートできます。次のように表示されます。

![Screen shot of the Prometheus sample app dashboard in AMG](../images/amg-prom-sample-app-dashboard.png)

さらに、以下のガイドを使用して、Amazon Managed Grafana で独自のダッシュボードを作成します。

* [ユーザーガイド: ダッシュボード](https://docs.aws.amazon.com/grafana/latest/userguide/dashboard-overview.html)
* [ダッシュボード作成のベストプラクティス](https://grafana.com/docs/grafana/latest/best-practices/best-practices-for-creating-dashboards/)

これで完了です。おめでとうございます。EC2 上の EKS で ADOT を使用してメトリクスを取り込む方法を学習しました。

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
4. コンソールから AMG ワークスペースを削除して、AMG ワークスペースを削除します。
