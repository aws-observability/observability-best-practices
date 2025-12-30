# Infrastructure as Code として Terraform を使用して Amazon Managed Service for Prometheus をデプロイし、Alert manager を設定する

このレシピでは、[Terraform](https://www.terraform.io/) を使用して [Amazon Managed Service for Prometheus](https://aws.amazon.com/prometheus/) をプロビジョニングし、ルール管理とアラートマネージャーを設定して、特定の条件が満たされた場合に [SNS](https://docs.aws.amazon.com/sns/) トピックに通知を送信する方法を説明します。


:::note
    このガイドは完了までに約 30 分かかります。
:::
## 前提条件

セットアップを完了するには、以下が必要です。

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

このレシピでは、ADOT を使用したメトリクスのスクレイピングと、Amazon Managed Service for Prometheus ワークスペースへのメトリクスのリモート書き込みを実証するために、サンプルアプリケーションを使用します。[aws-otel-community](https://github.com/aws-observability/aws-otel-community) のリポジトリからサンプルアプリをフォークしてクローンしてください。

この Prometheus サンプルアプリは、4 つすべての Prometheus メトリクスタイプ (counter、gauge、histogram、summary) を生成し、/metrics エンドポイントで公開します

ヘルスチェックエンドポイントは / にも存在します

設定用のオプションのコマンドラインフラグのリストは次のとおりです。

listen_address: (デフォルト = 0.0.0.0:8080) サンプルアプリが公開されるアドレスとポートを定義します。これは主にテストフレームワークの要件に準拠するためのものです。

metric_count: (デフォルト=1) 生成する各タイプのメトリクスの量。メトリクスタイプごとに常に同じ量のメトリクスが生成されます。

label_count: (デフォルト=1) メトリクスごとに生成するラベルの数。

datapoint_count: (デフォルト=1) 生成するメトリクスあたりのデータポイント数。

### AWS Distro for OpenTelemetry を使用したメトリクス収集の有効化
1. aws-otel-community のリポジトリからサンプルアプリをフォークしてクローンします。
次に、以下のコマンドを実行します。

```
cd ./sample-apps/prometheus
docker build . -t prometheus-sample-app:latest
```
2. このイメージを Amazon ECR などのレジストリにプッシュします。次のコマンドを使用して、アカウントに新しい ECR リポジトリを作成できます。「YOUR_REGION」も必ず設定してください。

```
aws ecr create-repository \
    --repository-name prometheus-sample-app \
    --image-scanning-configuration scanOnPush=true \
    --region <YOUR_REGION>
```
3. この Kubernetes 設定をコピーして適用することで、クラスターにサンプルアプリをデプロイします。イメージを、先ほどプッシュしたイメージに変更します。次の部分を置き換えてください `PUBLIC_SAMPLE_APP_IMAGE` に `prometheus-sample-app.yaml` ファイル。

```
curl https://raw.githubusercontent.com/aws-observability/aws-otel-collector/main/examples/eks/aws-prometheus/prometheus-sample-app.yaml -o prometheus-sample-app.yaml
kubectl apply -f prometheus-sample-app.yaml
```
4. ADOT Collector のデフォルトインスタンスを起動します。これを行うには、まず次のコマンドを入力して、ADOT Collector の Kubernetes 設定をプルします。

```
curl https://raw.githubusercontent.com/aws-observability/aws-otel-collector/main/examples/eks/aws-prometheus/prometheus-daemonset.yaml -o prometheus-daemonset.yaml
```
次に、テンプレートファイルを編集し、Amazon Managed Service for Prometheus ワークスペースの remote_write エンドポイントを次のように置き換えます。 `YOUR_ENDPOINT` とリージョンを `YOUR_REGION`Amazon Managed Service for Prometheus コンソールでワークスペースの詳細を確認したときに表示される remote_write エンドポイントを使用します。
また、変更する必要があります `YOUR_ACCOUNT_ID` Kubernetes 設定のサービスアカウントセクションで、AWS アカウント ID に変更します。

このレシピでは、ADOT Collector の設定でアノテーションを使用します `(scrape=true)` スクレイプするターゲットエンドポイントを指定します。これにより、ADOT Collector はクラスター内の kube-system エンドポイントからサンプルアプリのエンドポイントを区別できます。別のサンプルアプリをスクレイプする場合は、re-label 設定からこれを削除できます。
5. 次のコマンドを入力して ADOT Collector をデプロイします。
```
kubectl apply -f eks-prometheus-daemonset.yaml
```

### Terraform を使用してワークスペースを設定する

次に、Amazon Managed Service for Prometheus ワークスペースをプロビジョニングし、アラートルールを定義します。Alert Manager は、定義された条件が満たされたときに通知を送信します。 `expr` フィールドが、指定された期間において true を保持する `for` フィールド。Terraform 言語のコードは、.tf ファイル拡張子を持つプレーンテキストファイルに保存されます。また、.tf.json ファイル拡張子で命名される JSON ベースの言語バリアントもあります。

ここで、[main.tf](./amp-alertmanager-terraform/main.tf) を使用して、terraform でリソースをデプロイします。terraform コマンドを実行する前に、次をエクスポートします `region` および `sns_topic` 変数。

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

上記の手順が完了したら、awscurl を使用してエンドポイントをクエリし、セットアップをエンドツーエンドで検証します。次のことを確認してください。 `WORKSPACE_ID` 変数は、適切な Amazon Managed Service for Prometheus ワークスペース ID に置き換えられます。

以下のコマンドを実行すると、メトリクス「metric:recording_rule」を探します。メトリクスが正常に見つかった場合、記録ルールが正常に作成されています。

```
awscurl https://aps-workspaces.us-east-1.amazonaws.com/workspaces/$WORKSPACE_ID/api/v1/rules  --service="aps"
```
サンプル出力:
```
"status":"success","data":{"groups":[{"name":"alert-test","file":"rules","rules":[{"state":"firing","name":"metric:alerting_rule","query":"rate(adot_test_counter0[5m]) \u003e 5","duration":0,"labels":{},"annotations":{},"alerts":[{"labels":{"alertname":"metric:alerting_rule"},"annotations":{},"state":"firing","activeAt":"2021-09-16T13:20:35.9664022Z","value":"6.96890019778219e+01"}],"health":"ok","lastError":"","type":"alerting","lastEvaluation":"2021-09-16T18:41:35.967122005Z","evaluationTime":0.018121408}],"interval":60,"lastEvaluation":"2021-09-16T18:41:35.967104769Z","evaluationTime":0.018142997},{"name":"test","file":"rules","rules":[{"name":"metric:recording_rule","query":"rate(adot_test_counter0[5m])","labels":{},"health":"ok","lastError":"","type":"recording","lastEvaluation":"2021-09-16T18:40:44.650001548Z","evaluationTime":0.018381387}],"interval":60,"lastEvaluation":"2021-09-16T18:40:44.649986468Z","evaluationTime":0.018400463}]},"errorType":"","error":""}
```

alertmanager エンドポイントをさらにクエリして、同じ内容を確認できます。
```
awscurl https://aps-workspaces.us-east-1.amazonaws.com/workspaces/$WORKSPACE_ID/alertmanager/api/v2/alerts --service="aps" -H "Content-Type: application/json"
```
サンプル出力:
```
[{"annotations":{},"endsAt":"2021-09-16T18:48:35.966Z","fingerprint":"114212a24ca97549","receivers":[{"name":"default"}],"startsAt":"2021-09-16T13:20:35.966Z","status":{"inhibitedBy":[],"silencedBy":[],"state":"active"},"updatedAt":"2021-09-16T18:44:35.984Z","generatorURL":"/graph?g0.expr=sum%28rate%28envoy_http_downstream_rq_time_bucket%5B1m%5D%29%29+%3E+5\u0026g0.tab=1","labels":{"alertname":"metric:alerting_rule"}}]
```
これにより、アラートがトリガーされ、SNS レシーバー経由で SNS に送信されたことが確認されます。

## クリーンアップ

以下のコマンドを実行して、Amazon Managed Service for Prometheus ワークスペースを終了します。作成された EKS クラスターも削除されていることを確認してください。


```
terraform destroy
```

