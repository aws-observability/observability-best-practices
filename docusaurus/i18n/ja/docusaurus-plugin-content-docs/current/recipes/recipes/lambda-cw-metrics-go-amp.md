# CloudWatch メトリクスストリームを Firehose と AWS Lambda を使用して Amazon Managed Service for Prometheus にエクスポートする

このレシピでは、[CloudWatch メトリクスストリーム](https://console.aws.amazon.com/cloudwatch/home#metric-streams:streamsList) を設定し、[Kinesis Data Firehose](https://aws.amazon.com/jp/kinesis/data-firehose/) と [AWS Lambda](https://aws.amazon.com/jp/lambda) を使用して [Amazon Managed Service for Prometheus (AMP)](https://aws.amazon.com/jp/prometheus/) にメトリクスを取り込む方法を説明します。

完全なシナリオを実演するために、[AWS Cloud Development Kit (CDK)](https://aws.amazon.com/jp/cdk/) を使用して、Firehose 配信ストリーム、Lambda、S3 バケットを作成するスタックをセットアップします。

:::note
    このガイドは完了までに約 30 分かかります。
:::



## インフラストラクチャ
以下のセクションでは、このレシピのインフラストラクチャをセットアップします。

CloudWatch Metric Streams を使用すると、ストリーミングメトリクスデータを HTTP エンドポイントまたは [S3 バケット](https://aws.amazon.com/jp/s3) に転送できます。



### 前提条件

* AWS CLI が環境に[インストール](https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/cli-chap-install.html)され、[設定](https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/cli-chap-configure.html)されていること。
* [AWS CDK Typescript](https://docs.aws.amazon.com/ja_jp/cdk/latest/guide/work-with-cdk-typescript.html) が環境にインストールされていること。
* Node.js と Go がインストールされていること。
* [リポジトリ](https://github.com/aws-observability/observability-best-practices/)がローカルマシンにクローンされていること。このプロジェクトのコードは `/sandbox/CWMetricStreamExporter` にあります。



### AMP ワークスペースの作成

このレシピのデモアプリケーションは AMP 上で実行されます。
以下のコマンドで AMP ワークスペースを作成します：

```
aws amp create-workspace --alias prometheus-demo-recipe
```

以下のコマンドでワークスペースが作成されたことを確認します：
```
aws amp list-workspaces
```

:::info
    詳細については、[AMP 入門](https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/AMP-getting-started.html) ガイドをご確認ください。
:::



### 依存関係のインストール

aws-o11y-recipes リポジトリのルートから、以下のコマンドを使用して CWMetricStreamExporter ディレクトリに移動します：

```
cd sandbox/CWMetricStreamExporter
```

以降、これをリポジトリのルートとして扱います。

以下のコマンドを使用して `/cdk` ディレクトリに移動します：

```
cd cdk
```

以下のコマンドを使用して CDK の依存関係をインストールします：

```
npm install
```

リポジトリのルートに戻り、以下のコマンドを使用して `/lambda` ディレクトリに移動します：

```
cd lambda
```

`/lambda` フォルダで、以下のコマンドを使用して Go の依存関係をインストールします：

```
go get
```

これですべての依存関係がインストールされました。



### 設定ファイルの変更

リポジトリのルートにある `config.yaml` を開き、新しく作成したワークスペース ID と AMP ワークスペースが存在するリージョンを使用して、AMP ワークスペース URL の `{workspace}` を置き換えます。

例えば、以下のように変更します：

```
AMP:
    remote_write_url: "https://aps-workspaces.us-east-2.amazonaws.com/workspaces/{workspaceId}/api/v1/remote_write"
    region: us-east-2
```

Firehose Delivery Stream と S3 バケットの名前を任意のものに変更してください。



### スタックのデプロイ

`config.yaml` に AMP ワークスペース ID を設定したら、CloudFormation にスタックをデプロイする準備が整いました。
CDK と Lambda コードをビルドするには、リポジトリのルートで次のコマンドを実行します：

```
npm run build
```

このビルドステップでは、Go Lambda バイナリがビルドされ、CDK が CloudFormation にデプロイされます。

スタックをデプロイするには、以下の IAM の変更を承認してください：

![Screen shot of the IAM Changes when deploying the CDK](../images/cdk-amp-iam-changes.png)

次のコマンドを実行して、スタックが作成されたことを確認します：

```
aws cloudformation list-stacks
```

`CDK Stack` という名前のスタックが作成されているはずです。



## CloudWatch ストリームの作成

CloudWatch コンソールに移動します。例えば、
`https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#metric-streams:streamsList` 
にアクセスし、「Create metric stream」をクリックします。

必要なメトリクスを選択します。すべてのメトリクスか、選択した名前空間のメトリクスのみを選択できます。

CDK によって作成された既存の Firehose を使用して、メトリクスストリームを設定します。
出力形式を OpenTelemetry 0.7 から JSON に変更します。
メトリクスストリーム名を任意のものに変更し、「Create metric stream」をクリックします。

![Screen shot of the Cloudwatch Metric Stream Configuration](../images/cloudwatch-metric-stream-configuration.png)

Lambda 関数の呼び出しを確認するには、[Lambda コンソール](https://console.aws.amazon.com/lambda/home)に移動し、`KinesisMessageHandler` 関数をクリックします。
`Monitor` タブと `Logs` サブタブをクリックすると、「Recent Invocations」の下に Lambda 関数がトリガーされたエントリが表示されるはずです。

:::note
    Monitor タブに呼び出しが表示されるまで、最大 5 分かかる場合があります。
:::
以上です！おめでとうございます。これで CloudWatch から Amazon Managed Service for Prometheus へメトリクスのストリーミングが開始されました。



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
