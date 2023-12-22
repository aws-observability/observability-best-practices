# Terraform を使って Amazon Managed Service for Prometheus をデプロイし、アラートマネージャーを設定する

このレシピでは、[Terraform](https://www.terraform.io/) を使用して [Amazon Managed Service for Prometheus](https://aws.amazon.com/prometheus/) をプロビジョニングし、特定の条件が満たされた場合に [SNS](https://docs.aws.amazon.com/sns/) トピックに通知を送信するために、ルール管理とアラートマネージャーを設定する方法を示します。


!!! note
    このガイドを完了するのに約 30 分かかります。

## 前提条件

セットアップを完了するには、次のものが必要です。

* [Amazon EKS クラスター](https://docs.aws.amazon.com/ja_jp/eks/latest/userguide/create-cluster.html)
* [AWS CLI バージョン 2](https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/install-cliv2.html)
* [Terraform CLI](https://www.terraform.io/downloads)
* [AWS Distro for OpenTelemetry(ADOT)](https://aws-otel.github.io/)
* [eksctl](https://eksctl.io/)
* [kubectl](https://docs.aws.amazon.com/ja_jp/eks/latest/userguide/install-kubectl.html)
* [jq](https://stedolan.github.io/jq/download/)
* [helm](https://helm.sh/)
* [SNS トピック](https://docs.aws.amazon.com/ja_jp/sns/latest/dg/sns-create-topic.html)
* [awscurl](https://github.com/okigan/awscurl)

このレシピでは、サンプルアプリケーションを使用して、ADOT を使用したメトリクス スクレイピングと Amazon Managed Service for Prometheus ワークスペースへのリモートライトをデモンストレーションします。サンプルアプリを [aws-otel-community](https://github.com/aws-observability/aws-otel-community) のリポジトリからフォークしてクローンしてください。

この Prometheus サンプルアプリは、すべての 4 つの Prometheus メトリクスタイプ(カウンター、ゲージ、ヒストグラム、サマリー)を生成し、/metrics エンドポイントで公開します。

ヘルスチェックエンドポイントも / に存在します。

以下は、構成のためのオプションのコマンドラインフラグのリストです。

listen_address: (デフォルト = 0.0.0.0:8080) サンプルアプリが公開されるアドレスとポートを定義します。これは主にテストフレームワークの要件に準拠するためです。

metric_count: (デフォルト=1) 生成する各タイプのメトリクスの量。メトリクスタイプごとに常に同じ量のメトリクスが生成されます。

label_count: (デフォルト=1) 生成するメトリクスごとのラベルの量。


datapoint_count: (デフォルト=1) 生成するメトリクスごとのデータポイントの数。

### AWS Distro for OpenTelemetry を使用したメトリクス収集の有効化
1. aws-otel-community のリポジトリからサンプルアプリをフォークしてクローンします。
その後、次のコマンドを実行します。

```
cd ./sample-apps/prometheus
docker build . -t prometheus-sample-app:latest
```
2. このイメージを Amazon ECR などのレジストリにプッシュします。次のコマンドを使用して、アカウントに新しい ECR リポジトリを作成できます。<your_region> も設定してください。

```
aws ecr create-repository \
    --repository-name prometheus-sample-app \
    --image-scanning-configuration scanOnPush=true \
    --region <YOUR_REGION>
```
3. クラスターにサンプルアプリをデプロイするには、この Kubernetes の構成をコピーして適用します。prometheus-sample-app.yaml ファイルの `PUBLIC_SAMPLE_APP_IMAGE` を置き換えて、プッシュしたイメージにイメージを変更します。

```
curl https://raw.githubusercontent.com/aws-observability/aws-otel-collector/main/examples/eks/aws-prometheus/prometheus-sample-app.yaml -o prometheus-sample-app.yaml
kubectl apply -f prometheus-sample-app.yaml
```
4. ADOT Collector のデフォルトインスタンスを起動します。まず、ADOT Collector の Kubernetes 構成をプルする次のコマンドを入力します。

```
curl https://raw.githubusercontent.com/aws-observability/aws-otel-collector/main/examples/eks/aws-prometheus/prometheus-daemonset.yaml -o prometheus-daemonset.yaml
```
次に、テンプレートファイルを編集し、Amazon Managed Service for Prometheus ワークスペースの remote_write エンドポイントを `YOUR_ENDPOINT` で、リージョンを `YOUR_REGION` で置き換えます。
ワークスペースの詳細を表示しているときに Amazon Managed Service for Prometheus コンソールに表示されている remote_write エンドポイントを使用します。
Kubernetes 構成のサービスアカウントセクションで、`YOUR_ACCOUNT_ID` を AWS アカウント ID に変更する必要があります。

このレシピでは、ADOT Collector 構成はアノテーション `(scrape=true)` を使用して、どのターゲットエンドポイントをスクレイプするかを指示します。これにより、ADOT Collector はクラスター内の kube-system エンドポイントとサンプルアプリエンドポイントを区別できます。別のサンプルアプリをスクレイプする場合は、これを再ラベル構成から削除できます。
5. 次のコマンドを入力して、ADOT コレクターをデプロイします。
```
kubectl apply -f eks-prometheus-daemonset.yaml
```

</your_region></your_region>

### Terraform でワークスペースを設定する

ここで、Amazon Managed Service for Prometheus ワークスペースをプロビジョニングし、特定の条件 (```expr``` で定義) が指定された期間 (```for```) 満たされた場合に、Alert Manager が通知を送信するようにアラートルールを定義します。Terraform 言語のコードは、.tf 拡張子のプレーンテキストファイルに保存されます。.tf.json ファイル拡張子で名前が付けられている JSON ベースのバリアントもあります。

ここで、[main.tf](./amp-alertmanager-terraform/main.tf) を使用して、Terraform でリソースをデプロイします。Terraform コマンドを実行する前に、`region` と `sns_topic` 変数をエクスポートします。

```
export TF_VAR_region=<your region>
export TF_VAR_sns_topic=<ARN of the SNS topic used by the SNS receiver>
```

次に、以下のコマンドを実行してワークスペースをプロビジョニングします:

```
terraform init
terraform plan
terraform apply
```

上記の手順が完了したら、awscurl を使用してエンドポイントをクエリすることで、セットアップをエンドツーエンドで検証します。`WORKSPACE_ID` 変数が適切な Amazon Managed Service for Prometheus ワークスペース ID に置き換えられていることを確認してください。

次のコマンドを実行すると、「metric:recording_rule」メトリクスを探し、メトリクスを正常に見つけた場合は recording rule の作成に成功したことを意味します:

```
awscurl https://aps-workspaces.us-east-1.amazonaws.com/workspaces/$WORKSPACE_ID/api/v1/rules  --service="aps"
```

サンプル出力:
```
"status":"success","data":{"groups":[{"name":"alert-test","file":"rules","rules":[{"state":"firing","name":"metric:alerting_rule","query":"rate(adot_test_counter0[5m]) \u003e 5","duration":0,"labels":{},"annotations":{},"alerts":[{"labels":{"alertname":"metric:alerting_rule"},"annotations":{},"state":"firing","activeAt":"2021-09-16T13:20:35.9664022Z","value":"6.96890019778219e+01"}],"health":"ok","lastError":"","type":"alerting","lastEvaluation":"2021-09-16T18:41:35.967122005Z","evaluationTime":0.018121408}],"interval":60,"lastEvaluation":"2021-09-16T18:41:35.967104769Z","evaluationTime":0.018142997},{"name":"test","file":"rules","rules":[{"name":"metric:recording_rule","query":"rate(adot_test_counter0[5m])","labels":{},"health":"ok","lastError":"","type":"recording","lastEvaluation":"2021-09-16T18:40:44.650001548Z","evaluationTime":0.018381387}],"interval":60,"lastEvaluation":"2021-09-16T18:40:44.649986468Z","evaluationTime":0.018400463}]},"errorType":"","error":""}
```

さらに、アラートがトリガーされ、SNS Receiver 経由で SNS に送信されたことを確認するために、alertmanager エンドポイントをクエリできます。

```
awscurl https://aps-workspaces.us-east-1.amazonaws.com/workspaces/$WORKSPACE_ID/alertmanager/api/v2/alerts --service="aps" -H "Content-Type: application/json"
```

サンプル出力:
```
[{"annotations":{},"endsAt":"2021-09-16T18:48:35.966Z","fingerprint":"114212a24ca97549","receivers":[{"name":"default"}],"startsAt":"2021-09-16T13:20:35.966Z","status":{"inhibitedBy":[],"silencedBy":[],"state":"active"},"updatedAt":"2021-09-16T18:44:35.984Z","generatorURL":"/graph?g0.expr=sum%28rate%28envoy_http_downstream_rq_time_bucket%5B1m%5D%29%29+%3E+5\u0026g0.tab=1","labels":{"alertname":"metric:alerting_rule"}}]
```
これは、アラートがトリガーされ、SNS Receiver を介して SNS に送信されたことを確認しています。

</sns></your>

## クリーンアップ

以下のコマンドを実行して、Amazon Managed Service for Prometheus ワークスペースを終了してください。作成された EKS クラスターも削除するようにしてください。

```
terraform destroy
```
