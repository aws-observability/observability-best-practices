# CloudWatch メトリクスストリームを Firehose と AWS Lambda を介して Amazon Managed Service for Prometheus にエクスポートする

このレシピでは、[CloudWatch メトリクスストリーム](https://console.aws.amazon.com/cloudwatch/home#metric-streams:streamsList) を設定し、[Kinesis Data Firehose](https://aws.amazon.com/jp/kinesis/data-firehose/) と [AWS Lambda](https://aws.amazon.com/jp/lambda) を使用して [Amazon Managed Service for Prometheus (AMP)](https://aws.amazon.com/jp/prometheus/) にメトリクスを取り込む方法を紹介します。

完全なシナリオを示すために、[AWS Cloud Development Kit (CDK)](https://aws.amazon.com/jp/cdk/) を使用してスタックをセットアップし、Firehose 配信ストリーム、Lambda、S3 バケットを作成します。

:::note
    このガイドは約 30 分で完了します。
:::



## インフラストラクチャ
以下のセクションでは、このレシピのインフラストラクチャをセットアップします。

CloudWatch Metric Streams を使用すると、ストリーミングメトリクスデータを HTTP エンドポイントまたは [S3 バケット](https://aws.amazon.com/jp/s3) に転送できます。



### 前提条件

* AWS CLI が環境に[インストール](https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/cli-chap-install.html)され、[設定](https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/cli-chap-configure.html)されていること。
* [AWS CDK Typescript](https://docs.aws.amazon.com/ja_jp/cdk/latest/guide/work-with-cdk-typescript.html) が環境にインストールされていること。
* Node.js と Go がインストールされていること。
* [リポジトリ](https://github.com/aws-observability/observability-best-practices/) がローカルマシンにクローンされていること。このプロジェクトのコードは `/sandbox/CWMetricStreamExporter` にあります。



### AMP ワークスペースの作成

このレシピのデモアプリケーションは AMP 上で実行されます。
以下のコマンドを使用して AMP ワークスペースを作成してください：

```
aws amp create-workspace --alias prometheus-demo-recipe
```

以下のコマンドを使用して、ワークスペースが作成されたことを確認してください：
```
aws amp list-workspaces
```

:::info
    詳細については、[AMP 入門ガイド](https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/AMP-getting-started.html)をご覧ください。
:::



### 依存関係のインストール

aws-o11y-recipes リポジトリのルートから、以下のコマンドを使用して CWMetricStreamExporter ディレクトリに移動します：

```
cd sandbox/CWMetricStreamExporter
```

これ以降、このディレクトリをリポジトリのルートとして扱います。

以下のコマンドを使用して `/cdk` ディレクトリに移動します：

```
cd cdk
```

次のコマンドを使用して CDK の依存関係をインストールします：

```
npm install
```

リポジトリのルートに戻り、以下のコマンドを使用して `/lambda` ディレクトリに移動します：

```
cd lambda
```

`/lambda` フォルダに移動したら、以下のコマンドを使用して Go の依存関係をインストールします：

```
go get
```

これで全ての依存関係がインストールされました。



### 設定ファイルの変更

リポジトリのルートにある `config.yaml` を開き、AMP ワークスペース URL を変更します。
`{workspace}` を新しく作成したワークスペース ID に置き換え、AMP ワークスペースが存在するリージョンを指定します。

例えば、以下のように変更します：

```
AMP:
    remote_write_url: "https://aps-workspaces.us-east-2.amazonaws.com/workspaces/{workspaceId}/api/v1/remote_write"
    region: us-east-2
```

Firehose 配信ストリームと S3 バケットの名前を好みに応じて変更してください。



### スタックのデプロイ

`config.yaml` を AMP ワークスペース ID で修正したら、スタックを CloudFormation にデプロイする時です。
CDK と Lambda コードをビルドするには、リポジトリのルートで次のコマンドを実行します：

```
npm run build
```

このビルドステップでは、Go Lambda バイナリがビルドされ、CDK が CloudFormation にデプロイされます。

スタックをデプロイするには、以下の IAM の変更を承認してください：

![CDK をデプロイする際の IAM 変更のスクリーンショット](../images/cdk-amp-iam-changes.png)

次のコマンドを実行して、スタックが作成されたことを確認します：

```
aws cloudformation list-stacks
```

`CDK Stack` という名前のスタックが作成されているはずです。



## CloudWatch ストリームの作成

CloudWatch コンソールに移動します。例えば、
`https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#metric-streams:streamsList`
にアクセスし、「メトリクスストリームの作成」をクリックします。

必要なメトリクスを選択します。すべてのメトリクスか、選択した名前空間からのみかを選びます。

CDK によって作成された既存の Firehose を使用してメトリクスストリームを設定します。
出力形式を OpenTelemetry 0.7 ではなく JSON に変更します。
メトリクスストリーム名を好みに合わせて変更し、「メトリクスストリームの作成」をクリックします。

![CloudWatch メトリクスストリーム設定のスクリーンショット](../images/cloudwatch-metric-stream-configuration.png)

Lambda 関数の呼び出しを確認するには、[Lambda コンソール](https://console.aws.amazon.com/lambda/home)に移動し、
`KinesisMessageHandler` 関数をクリックします。「モニタリング」タブと「ログ」サブタブをクリックし、「最近の呼び出し」の下に Lambda 関数がトリガーされたエントリが表示されるはずです。

:::note
    モニタリングタブに呼び出しが表示されるまで、最大 5 分かかる場合があります。
:::

以上です！おめでとうございます。これで、メトリクスが CloudWatch から Amazon Managed Service for Prometheus にストリーミングされるようになりました。



## クリーンアップ

まず、CloudFormation スタックを削除します：

```
cd cdk
cdk destroy
```

AMP ワークスペースを削除します：

```
aws amp delete-workspace --workspace-id \
    `aws amp list-workspaces --alias prometheus-sample-app --query 'workspaces[0].workspaceId' --output text`
```

最後に、コンソールから CloudWatch メトリクスストリームを削除します。
