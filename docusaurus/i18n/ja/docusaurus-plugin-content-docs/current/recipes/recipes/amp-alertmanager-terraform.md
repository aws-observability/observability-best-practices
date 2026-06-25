# Terraform を Infrastructure as Code として使用した Amazon Managed Service for Prometheus のデプロイと Alert Manager の設定

このレシピでは、[Terraform](https://www.terraform.io/) を使用して [Amazon Managed Service for Prometheus](https://aws.amazon.com/prometheus/) をプロビジョニングし、特定の条件が満たされた場合に [SNS](https://docs.aws.amazon.com/sns/) トピックに通知を送信するようにルール管理と Alert Manager を設定する方法を実演します。


:::note
    このガイドの完了には約 30 分かかります。
:::
## 前提条件

セットアップを完了するには以下が必要です。

* [Amazon EKS クラスター](https://docs.aws.amazon.com/eks/latest/userguide/create-cluster.html)
* [AWS CLI バージョン 2](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
* [Terraform CLI](https://www.terraform.io/downloads)
* [AWS Distro for OpenTelemetry(ADOT)](https://aws-otel.github.io/)
* [eksctl](https://eksctl.io/)
* [kubectl](https://docs.aws.amazon.com/eks/latest/userguide/install-kubectl.html)
* [jq](https://stedolan.github.io/jq/download/)
* [helm](https://helm.sh/)
* [SNS トピック](https://docs.aws.amazon.com/sns/latest/dg/sns-create-topic.html)
* [awscurl](https://github.com/okigan/awscurl)

このレシピでは、ADOT を使用したメトリクスのスクレイピングと Amazon Managed Service for Prometheus ワークスペースへのメトリクスのリモートライトを実演するためにサンプルアプリケーションを使用します。[aws-otel-community](https://github.com/aws-observability/aws-otel-community) リポジトリからサンプルアプリをフォークしてクローンしてください。

この Prometheus サンプルアプリは、4 つの Prometheus メトリクスタイプ（counter、gauge、histogram、summary）すべてを生成し、/metrics エンドポイントで公開します。

ヘルスチェックエンドポイントも / に存在します。

以下は設定用のオプションのコマンドラインフラグの一覧です。

listen_address: (デフォルト = 0.0.0.0:8080) サンプルアプリが公開されるアドレスとポートを定義します。これは主にテストフレームワークの要件に準拠するためのものです。

metric_count: (デフォルト=1) 生成する各タイプのメトリクスの量。メトリクスタイプごとに常に同じ量のメトリクスが生成されます。

label_count: (デフォルト=1) メトリクスごとに生成するラベルの量。


datapoint_count: (デフォルト=1) メトリクスごとに生成するデータポイントの数。

### AWS Distro for OpenTelemetry を使用したメトリクス収集の有効化
1. aws-otel-community リポジトリからサンプルアプリをフォークしてクローンします。
次に以下のコマンドを実行します。

```
cd ./sample-apps/prometheus
docker build . -t prometheus-sample-app:latest
```
2. このイメージを Amazon ECR などのレジストリにプッシュします。以下のコマンドを使用して、アカウントに新しい ECR リポジトリを作成できます。「YOUR_REGION」も設定してください。

```
aws ecr create-repository \
    --repository-name prometheus-sample-app \
    --image-scanning-configuration scanOnPush=true \
    --region <YOUR_REGION>
```
3. この Kubernetes 設定をコピーして適用し、クラスターにサンプルアプリをデプロイします。prometheus-sample-app.yaml ファイルの `PUBLIC_SAMPLE_APP_IMAGE` を、先ほどプッシュしたイメージに置き換えてください。

```
curl https://raw.githubusercontent.com/aws-observability/aws-otel-collector/main/examples/eks/aws-prometheus/prometheus-sample-app.yaml -o prometheus-sample-app.yaml
kubectl apply -f prometheus-sample-app.yaml
```
4. ADOT コレクターのデフォルトインスタンスを起動します。まず、以下のコマンドを入力して ADOT コレクターの Kubernetes 設定を取得します。

```
curl https://raw.githubusercontent.com/aws-observability/aws-otel-collector/main/examples/eks/aws-prometheus/prometheus-daemonset.yaml -o prometheus-daemonset.yaml
```
次に、テンプレートファイルを編集し、`YOUR_ENDPOINT` を Amazon Managed Service for Prometheus ワークスペースの remote_write エンドポイントに、`YOUR_REGION` をリージョンに置き換えます。
ワークスペースの詳細を確認する際に Amazon Managed Service for Prometheus コンソールに表示される remote_write エンドポイントを使用してください。
また、Kubernetes 設定のサービスアカウントセクションの `YOUR_ACCOUNT_ID` を AWS アカウント ID に変更する必要があります。

このレシピでは、ADOT コレクターの設定はアノテーション `(scrape=true)` を使用して、どのターゲットエンドポイントをスクレイピングするかを指定します。これにより、ADOT コレクターはクラスター内の kube-system エンドポイントとサンプルアプリのエンドポイントを区別できます。異なるサンプルアプリをスクレイピングする場合は、re-label 設定からこれを削除できます。
5. 以下のコマンドを入力して ADOT コレクターをデプロイします。
```
kubectl apply -f eks-prometheus-daemonset.yaml
```

### Terraform によるワークスペースの設定

ここでは、Amazon Managed Service for Prometheus ワークスペースをプロビジョニングし、特定の条件（```expr``` で定義）が指定された期間（```for```）にわたって真である場合に Alert Manager が通知を送信するアラートルールを定義します。Terraform 言語のコードは .tf ファイル拡張子のプレーンテキストファイルに保存されます。.tf.json ファイル拡張子の JSON ベースのバリアントもあります。

[main.tf](./amp-alertmanager-terraform/main.tf) を使用して Terraform でリソースをデプロイします。Terraform コマンドを実行する前に、`region` と `sns_topic` 変数をエクスポートします。

```
export TF_VAR_region=<your region>
export TF_VAR_sns_topic=<ARN of the SNS topic used by the SNS receiver>
```

次に、以下のコマンドを実行してワークスペースをプロビジョニングします。

```
terraform init
terraform plan
terraform apply
```

上記のステップが完了したら、awscurl を使用してエンドポイントをクエリし、セットアップをエンドツーエンドで検証します。`WORKSPACE_ID` 変数を適切な Amazon Managed Service for Prometheus ワークスペース ID に置き換えてください。

以下のコマンドを実行し、メトリクス「metric:recording_rule」を探します。メトリクスが見つかれば、レコーディングルールの作成に成功しています。

```
awscurl https://aps-workspaces.us-east-1.amazonaws.com/workspaces/$WORKSPACE_ID/api/v1/rules  --service="aps"
```
サンプル出力:
```
"status":"success","data":{"groups":[{"name":"alert-test","file":"rules","rules":[{"state":"firing","name":"metric:alerting_rule","query":"rate(adot_test_counter0[5m]) \u003e 5","duration":0,"labels":{},"annotations":{},"alerts":[{"labels":{"alertname":"metric:alerting_rule"},"annotations":{},"state":"firing","activeAt":"2021-09-16T13:20:35.9664022Z","value":"6.96890019778219e+01"}],"health":"ok","lastError":"","type":"alerting","lastEvaluation":"2021-09-16T18:41:35.967122005Z","evaluationTime":0.018121408}],"interval":60,"lastEvaluation":"2021-09-16T18:41:35.967104769Z","evaluationTime":0.018142997},{"name":"test","file":"rules","rules":[{"name":"metric:recording_rule","query":"rate(adot_test_counter0[5m])","labels":{},"health":"ok","lastError":"","type":"recording","lastEvaluation":"2021-09-16T18:40:44.650001548Z","evaluationTime":0.018381387}],"interval":60,"lastEvaluation":"2021-09-16T18:40:44.649986468Z","evaluationTime":0.018400463}]},"errorType":"","error":""}
```

さらに、alertmanager エンドポイントをクエリして確認できます。
```
awscurl https://aps-workspaces.us-east-1.amazonaws.com/workspaces/$WORKSPACE_ID/alertmanager/api/v2/alerts --service="aps" -H "Content-Type: application/json"
```
サンプル出力:
```
[{"annotations":{},"endsAt":"2021-09-16T18:48:35.966Z","fingerprint":"114212a24ca97549","receivers":[{"name":"default"}],"startsAt":"2021-09-16T13:20:35.966Z","status":{"inhibitedBy":[],"silencedBy":[],"state":"active"},"updatedAt":"2021-09-16T18:44:35.984Z","generatorURL":"/graph?g0.expr=sum%28rate%28envoy_http_downstream_rq_time_bucket%5B1m%5D%29%29+%3E+5\u0026g0.tab=1","labels":{"alertname":"metric:alerting_rule"}}]
```
これにより、アラートがトリガーされ、SNS レシーバーを介して SNS に送信されたことが確認できます。

## クリーンアップ

以下のコマンドを実行して Amazon Managed Service for Prometheus ワークスペースを終了します。作成した EKS クラスターも削除してください。


```
terraform destroy
```
