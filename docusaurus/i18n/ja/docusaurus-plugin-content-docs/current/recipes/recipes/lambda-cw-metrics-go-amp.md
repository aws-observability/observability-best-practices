# Firehose と AWS Lambda を使用して CloudWatch Metric Streams を Amazon Managed Service for Prometheus にエクスポートする

このレシピでは、[CloudWatch Metric Stream](https://console.aws.amazon.com/cloudwatch/home#metric-streams:streamsList) を構成し、[Kinesis Data Firehose](https://aws.amazon.com/kinesis/data-firehose/) と [AWS Lambda](https://aws.amazon.com/lambda) を使用して [Amazon Managed Service for Prometheus (AMP)](https://aws.amazon.com/prometheus/) にメトリクスを取り込む方法を説明します。

[AWS Cloud Development Kit (CDK)](https://aws.amazon.com/cdk/) を使用して、Firehose Delivery Stream、Lambda、S3 Bucket を作成するスタックをセットアップし、完全なシナリオを実証します。

:::note
    このガイドは完了までに約 30 分かかります。
:::
## インフラストラクチャ
次のセクションでは、このレシピのインフラストラクチャをセットアップします。

CloudWatch Metric Streams を使用すると、ストリーミングメトリクスデータを HTTP エンドポイントまたは [S3 バケット](https://aws.amazon.com/s3)に転送できます。

### 前提条件

* AWS CLI が環境に[インストール](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html)され、[設定](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)されていること。
* [AWS CDK Typescript](https://docs.aws.amazon.com/cdk/latest/guide/work-with-cdk-typescript.html) が環境にインストールされていること。
* Node.js と Go。
* [リポジトリ](https://github.com/aws-observability/observability-best-practices/)がローカルマシンにクローンされていること。このプロジェクトのコードは以下にあります `/sandbox/CWMetricStreamExporter`.

### AMP ワークスペースを作成する

このレシピのデモアプリケーションは AMP 上で実行されます。
次のコマンドを使用して AMP Workspace を作成します。

```
aws amp create-workspace --alias prometheus-demo-recipe
```

次のコマンドでワークスペースが作成されていることを確認します。
```
aws amp list-workspaces
```

:::info
    詳細については、[AMP 入門](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-getting-started.html)ガイドを参照してください。
:::
### 依存関係のインストール

aws-o11y-recipes リポジトリのルートから、次のコマンドを使用して CWMetricStreamExporter にディレクトリを変更します。

```
cd sandbox/CWMetricStreamExporter
```

これが今後、リポジトリのルートとみなされます。

ディレクトリを変更します `/cdk` 次のコマンドを使用します。

```
cd cdk
```

以下のコマンドを使用して CDK の依存関係をインストールします。

```
npm install
```

リポジトリのルートにディレクトリを戻してから、次のディレクトリに移動します `/lambda` 次のコマンドを使用します。

```
cd lambda
```

いったん `/lambda` フォルダで、次のコマンドを使用して Go の依存関係をインストールします。

```
go get
```

すべての依存関係がインストールされました。

### 設定ファイルを変更する

リポジトリのルートで、次を開きます `config.yaml` AMP ワークスペース URL を変更します。次の部分を置き換えてください。 `{workspace}` 新しく作成されたワークスペース ID と、AMP ワークスペースが存在するリージョンを使用します。

たとえば、次のように変更します。

```
AMP:
    remote_write_url: "https://aps-workspaces.us-east-2.amazonaws.com/workspaces/{workspaceId}/api/v1/remote_write"
    region: us-east-2
```

Firehose Delivery Stream と S3 Bucket の名前を任意の名前に変更します。

### スタックをデプロイする

一度 `config.yaml` AMP ワークスペース ID で変更されたら、スタックを CloudFormation にデプロイします。CDK と Lambda コードをビルドするには、リポジトリのルートで次のコマンドを実行します。

```
npm run build
```

このビルドステップにより、Go Lambda バイナリがビルドされ、CDK が CloudFormation にデプロイされます。

スタックをデプロイするために、次の IAM 変更を承認します。

![Screen shot of the IAM Changes when deploying the CDK](../images/cdk-amp-iam-changes.png)

以下のコマンドを実行して、スタックが作成されたことを確認します。

```
aws cloudformation list-stacks
```

名前によるスタック `CDK Stack` が作成されているはずです。

## CloudWatch ストリームを作成する

CloudWatch コンソールに移動します。例えば 
`https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#metric-streams:streamsList` 
「メトリクスストリームを作成」をクリックします。

必要なメトリクスを選択します。すべてのメトリクスか、選択した名前空間のみのメトリクスのいずれかを選択できます。

CDK によって作成された既存の Firehose を使用して Metric Stream を設定します。
出力形式を OpenTelemetry 0.7 ではなく JSON に変更します。
Metric Stream 名を任意の名前に変更し、「Create metric stream」をクリックします。

![Screen shot of the Cloudwatch Metric Stream Configuration](../images/cloudwatch-metric-stream-configuration.png)

Lambda 関数の呼び出しを確認するには、[Lambda コンソール](https://console.aws.amazon.com/lambda/home)に移動して、関数をクリックします `KinesisMessageHandler`. 次をクリックします。 `Monitor` tab と `Logs` サブタブの下にあります。 `Recent Invocations` Lambda 関数がトリガーされたエントリが表示されます。

:::note
    呼び出しが Monitor タブに表示されるまで、最大 5 分かかる場合があります。
:::
これで完了です。おめでとうございます。メトリクスが CloudWatch から Amazon Managed Service for Prometheus にストリーミングされるようになりました。

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

最後に、コンソールから削除して CloudWatch Metric Stream を削除します。
