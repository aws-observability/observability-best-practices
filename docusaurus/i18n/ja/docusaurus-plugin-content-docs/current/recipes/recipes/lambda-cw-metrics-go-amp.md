# CloudWatch Metric Streams から Firehose と AWS Lambda を経由して Amazon Managed Service for Prometheus へメトリクスをエクスポートする

このレシピでは、[CloudWatch Metric Stream](https://console.aws.amazon.com/cloudwatch/home#metric-streams:streamsList) を設定し、[Kinesis Data Firehose](https://aws.amazon.com/jp/kinesis/data-firehose/) と [AWS Lambda](https://aws.amazon.com/jp/lambda) を使用して [Amazon Managed Service for Prometheus (AMP)](https://aws.amazon.com/jp/prometheus/) にメトリクスを取り込む方法を示します。

[AWS Cloud Development Kit (CDK)](https://aws.amazon.com/jp/cdk/) を使用して、Firehose Delivery Stream、Lambda、S3 バケットを作成するスタックを設定し、完全なシナリオを実演します。

note
    このガイドを完了するのに約 30 分かかります。


## インフラストラクチャ
次のセクションでは、このレシピのインフラストラクチャを設定します。

CloudWatch Metric Streams を使用すると、ストリーミングメトリクスデータを HTTP エンドポイントまたは [S3 バケット](https://aws.amazon.com/jp/s3) に転送できます。

### 前提条件

* AWS CLI が[インストール](https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/cli-chap-install.html)され、環境内で[設定](https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/cli-chap-configure.html)されていること。
* 環境内に [AWS CDK Typescript](https://docs.aws.amazon.com/ja_jp/cdk/latest/guide/work-with-cdk-typescript.html) がインストールされていること。
* Node.js と Go がインストールされていること。
* [リポジトリ](https://github.com/aws-observability/observability-best-practices/)がローカルマシンにクローンされていること。このプロジェクトのコードは `/sandbox/CWMetricStreamExporter` にあります。

### AMP ワークスペースを作成する

このレシピのデモアプリケーションは AMP の上で実行されます。
次のコマンドで AMP ワークスペースを作成してください。

```
aws amp create-workspace --alias prometheus-demo-recipe
```

次のコマンドでワークスペースが作成されたことを確認してください。
```
aws amp list-workspaces
```

alert{type="info"}
詳細については、[AMP の開始方法](https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/AMP-getting-started.html)ガイドを参照してください。


### 依存関係をインストールする

aws-o11y-recipes リポジトリのルートから、次のコマンドで CWMetricStreamExporter ディレクトリに移動します。

```
cd sandbox/CWMetricStreamExporter
```

これ以降、このディレクトリがリポジトリのルートと見なされます。

次のコマンドで `/cdk` ディレクトリに移動します。

```
cd cdk
```

次のコマンドで CDK の依存関係をインストールします。

```
npm install
```

リポジトリのルートに戻り、次のコマンドで `/lambda` ディレクトリに移動します。

```
cd lambda
```

`/lambda` フォルダに移動したら、次のコマンドで Go の依存関係をインストールします。

```
go get
```

これで、すべての依存関係がインストールされました。

### 設定ファイルを変更する

リポジトリのルートで `config.yaml` を開き、`{workspace}` を新しく作成したワークスペース ID に置き換え、AMP ワークスペースがある AWS リージョンに変更して、AMP ワークスペース URL を変更します。

例えば、次のように変更します。

```
AMP:
    remote_write_url: "https://aps-workspaces.us-east-2.amazonaws.com/workspaces/{workspaceId}/api/v1/remote_write"
    region: us-east-2
```

Firehose Delivery Stream と S3 バケットの名前を好みの名前に変更してください。

### スタックをデプロイする

`config.yaml` に AMP ワークスペース ID を設定したら、CloudFormation にスタックをデプロイする時間です。CDK と Lambda コードをビルドするには、リポジトリのルートで次のコマンドを実行します。

```
npm run build
```

このビルドステップでは、Go の Lambda バイナリがビルドされ、CDK が CloudFormation にデプロイされます。

スタックをデプロイするために、次の IAM の変更を承認してください。

![CDK をデプロイする際の IAM の変更のスクリーンショット](../images/cdk-amp-iam-changes.png)

次のコマンドを実行して、スタックが作成されたことを確認します。

```
aws cloudformation list-stacks
```

`CDK Stack` という名前のスタックが作成されているはずです。

## CloudWatch ストリームの作成

CloudWatch コンソールに移動します。例えば、
`https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#metric-streams:streamsList`
から「Create metric stream」をクリックします。

必要なメトリクスを選択します。すべてのメトリクスか、選択した名前空間からのメトリクスのみです。

CDK によって作成された既存の Firehose を使用して、Metric Stream を構成します。
出力フォーマットを OpenTelemetry 0.7 から JSON に変更します。
Metric Stream の名前を好みに合わせて変更し、「Create metric stream」をクリックします。

![CloudWatch Metric Stream 構成のスクリーンショット](../images/cloudwatch-metric-stream-configuration.png)

Lambda 関数の呼び出しを確認するには、[Lambda コンソール](https://console.aws.amazon.com/lambda/home)に移動し、関数 `KinesisMessageHandler` をクリックします。
`Monitor` タブと `Logs` サブタブをクリックし、`Recent Invocations` に Lambda 関数がトリガーされたエントリがあるはずです。

note
    Monitor タブに呼び出しが表示されるまで最大 5 分かかる場合があります。

以上です! おめでとうございます。メトリクスが CloudWatch から Amazon Managed Service for Prometheus にストリーミングされるようになりました。

## クリーンアップ

まず、CloudFormation スタックを削除します。

```
cd cdk
cdk destroy
```

AMP ワークスペースを削除します。

```
aws amp delete-workspace --workspace-id \
    `aws amp list-workspaces --alias prometheus-sample-app --query 'workspaces[0].workspaceId' --output text`
```

最後に、コンソールから CloudWatch Metric Stream を削除します。
