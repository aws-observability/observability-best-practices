# Terraform を使用した Infrastructure as Code による Amazon Managed Service for Prometheus のデプロイと Alert Manager の設定

このレシピでは、[Terraform](https://www.terraform.io/) を使用して [Amazon Managed Service for Prometheus](https://aws.amazon.com/jp/prometheus/) をプロビジョニングし、特定の条件が満たされた場合に [SNS](https://docs.aws.amazon.com/ja_jp/sns/) トピックに通知を送信するためのルール管理と Alert Manager の設定方法を説明します。

:::note
    このガイドは約 30 分で完了します。
:::



## 前提条件

セットアップを完了するには、以下が必要です：

* [Amazon EKS クラスター](https://docs.aws.amazon.com/ja_jp/eks/latest/userguide/create-cluster.html)
* [AWS CLI バージョン 2](https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/install-cliv2.html)
* [Terraform CLI](https://www.terraform.io/downloads)
* [AWS Distro for OpenTelemetry (ADOT)](https://aws-otel.github.io/)
* [eksctl](https://eksctl.io/)
* [kubectl](https://docs.aws.amazon.com/ja_jp/eks/latest/userguide/install-kubectl.html)
* [jq](https://stedolan.github.io/jq/download/)
* [helm](https://helm.sh/)
* [SNS トピック](https://docs.aws.amazon.com/ja_jp/sns/latest/dg/sns-create-topic.html)
* [awscurl](https://github.com/okigan/awscurl)

このレシピでは、ADOT を使用したメトリクスのスクレイピングと、Amazon Managed Service for Prometheus ワークスペースへのメトリクスのリモートライトを実演するために、サンプルアプリケーションを使用します。[aws-otel-community](https://github.com/aws-observability/aws-otel-community) リポジトリからサンプルアプリをフォークしてクローンしてください。

この Prometheus サンプルアプリは、4 つの Prometheus メトリクスタイプ（カウンター、ゲージ、ヒストグラム、サマリー）をすべて生成し、/metrics エンドポイントで公開します。

ヘルスチェックエンドポイントも / に存在します。

以下は、設定のためのオプションのコマンドラインフラグのリストです：

listen_address：（デフォルト = 0.0.0.0:8080）サンプルアプリが公開されるアドレスとポートを定義します。これは主にテストフレームワークの要件に準拠するためのものです。

metric_count：（デフォルト = 1）生成する各タイプのメトリクスの量。メトリクスタイプごとに常に同じ量のメトリクスが生成されます。

label_count：（デフォルト = 1）生成するメトリクスごとのラベルの量。

datapoint_count：（デフォルト = 1）生成するメトリクスごとのデータポイントの数。



### AWS Distro for OpenTelemetry を使用したメトリクス収集の有効化
1. aws-otel-community のリポジトリからサンプルアプリをフォークしてクローンします。
次に、以下のコマンドを実行します。

```
cd ./sample-apps/prometheus
docker build . -t prometheus-sample-app:latest
```
2. このイメージを Amazon ECR などのレジストリにプッシュします。以下のコマンドを使用して、アカウントに新しい ECR リポジトリを作成できます。「YOUR_REGION」を設定することを忘れないでください。

```
aws ecr create-repository \
    --repository-name prometheus-sample-app \
    --image-scanning-configuration scanOnPush=true \
    --region <YOUR_REGION>
```
3. この Kubernetes 設定をコピーして適用することで、クラスターにサンプルアプリをデプロイします。prometheus-sample-app.yaml ファイルの `PUBLIC_SAMPLE_APP_IMAGE` を、先ほどプッシュしたイメージに変更します。

```
curl https://raw.githubusercontent.com/aws-observability/aws-otel-collector/main/examples/eks/aws-prometheus/prometheus-sample-app.yaml -o prometheus-sample-app.yaml
kubectl apply -f prometheus-sample-app.yaml
```
4. ADOT Collector のデフォルトインスタンスを起動します。まず、以下のコマンドを入力して、ADOT Collector の Kubernetes 設定を取得します。

```
curl https://raw.githubusercontent.com/aws-observability/aws-otel-collector/main/examples/eks/aws-prometheus/prometheus-daemonset.yaml -o prometheus-daemonset.yaml
```
次に、テンプレートファイルを編集し、Amazon Managed Service for Prometheus ワークスペースの remote_write エンドポイントを `YOUR_ENDPOINT` に、リージョンを `YOUR_REGION` に置き換えます。
remote_write エンドポイントは、Amazon Managed Service for Prometheus コンソールでワークスペースの詳細を確認したときに表示されるものを使用します。
また、Kubernetes 設定のサービスアカウントセクションの `YOUR_ACCOUNT_ID` を AWS アカウント ID に変更する必要があります。

このレシピでは、ADOT Collector の設定でアノテーション `(scrape=true)` を使用して、スクレイプするターゲットエンドポイントを指定しています。これにより、ADOT Collector はクラスター内のサンプルアプリのエンドポイントを kube-system エンドポイントと区別できます。別のサンプルアプリをスクレイプする場合は、再ラベル設定からこれを削除できます。
5. 以下のコマンドを入力して、ADOT Collector をデプロイします。
```
kubectl apply -f eks-prometheus-daemonset.yaml
```



### Terraform を使用してワークスペースを設定する

ここでは、Amazon Managed Service for Prometheus ワークスペースをプロビジョニングし、特定の条件（`expr` で定義）が指定された期間（`for`）の間、真である場合に Alert Manager が通知を送信するアラートルールを定義します。Terraform 言語のコードは、.tf ファイル拡張子を持つプレーンテキストファイルに保存されます。また、.tf.json ファイル拡張子を持つ JSON ベースの言語バリアントもあります。

ここでは、[main.tf](./amp-alertmanager-terraform/main.tf) を使用して Terraform でリソースをデプロイします。Terraform コマンドを実行する前に、`region` と `sns_topic` 変数をエクスポートします。

```
export TF_VAR_region=<あなたのリージョン>
export TF_VAR_sns_topic=<SNS レシーバーが使用する SNS トピックの ARN>
```

次に、以下のコマンドを実行してワークスペースをプロビジョニングします：

```
terraform init
terraform plan
terraform apply
```

上記の手順が完了したら、awscurl を使用してエンドポイントにクエリを実行し、セットアップを確認します。`WORKSPACE_ID` 変数が適切な Amazon Managed Service for Prometheus ワークスペース ID に置き換えられていることを確認してください。

以下のコマンドを実行し、"metric:recording_rule" メトリクスを探します。このメトリクスが見つかれば、レコーディングルールの作成に成功しています：

```
awscurl https://aps-workspaces.us-east-1.amazonaws.com/workspaces/$WORKSPACE_ID/api/v1/rules  --service="aps"
```
サンプル出力：
```
"status":"success","data":{"groups":[{"name":"alert-test","file":"rules","rules":[{"state":"firing","name":"metric:alerting_rule","query":"rate(adot_test_counter0[5m]) \u003e 5","duration":0,"labels":{},"annotations":{},"alerts":[{"labels":{"alertname":"metric:alerting_rule"},"annotations":{},"state":"firing","activeAt":"2021-09-16T13:20:35.9664022Z","value":"6.96890019778219e+01"}],"health":"ok","lastError":"","type":"alerting","lastEvaluation":"2021-09-16T18:41:35.967122005Z","evaluationTime":0.018121408}],"interval":60,"lastEvaluation":"2021-09-16T18:41:35.967104769Z","evaluationTime":0.018142997},{"name":"test","file":"rules","rules":[{"name":"metric:recording_rule","query":"rate(adot_test_counter0[5m])","labels":{},"health":"ok","lastError":"","type":"recording","lastEvaluation":"2021-09-16T18:40:44.650001548Z","evaluationTime":0.018381387}],"interval":60,"lastEvaluation":"2021-09-16T18:40:44.649986468Z","evaluationTime":0.018400463}]},"errorType":"","error":""}
```

さらに、alertmanager エンドポイントにクエリを実行して確認できます：
```
awscurl https://aps-workspaces.us-east-1.amazonaws.com/workspaces/$WORKSPACE_ID/alertmanager/api/v2/alerts --service="aps" -H "Content-Type: application/json"
```
サンプル出力：
```
[{"annotations":{},"endsAt":"2021-09-16T18:48:35.966Z","fingerprint":"114212a24ca97549","receivers":[{"name":"default"}],"startsAt":"2021-09-16T13:20:35.966Z","status":{"inhibitedBy":[],"silencedBy":[],"state":"active"},"updatedAt":"2021-09-16T18:44:35.984Z","generatorURL":"/graph?g0.expr=sum%28rate%28envoy_http_downstream_rq_time_bucket%5B1m%5D%29%29+%3E+5\u0026g0.tab=1","labels":{"alertname":"metric:alerting_rule"}}]
```
これにより、アラートがトリガーされ、SNS レシーバーを介して SNS に送信されたことが確認できます。



## クリーンアップ

以下のコマンドを実行して、Amazon Managed Service for Prometheus ワークスペースを終了します。作成した EKS クラスターも必ず削除してください：

```
terraform destroy
```
