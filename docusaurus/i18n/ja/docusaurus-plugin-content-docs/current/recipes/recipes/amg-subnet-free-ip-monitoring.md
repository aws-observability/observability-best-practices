# サブネット内の空き IP の監視

このレシピでは、サブネット内の利用可能な IP を監視するための監視スタックをセットアップする方法を説明します。

[AWS Cloud Development Kit (CDK)](https://aws.amazon.com/cdk/) を使用してスタックをセットアップし、Lambda、CloudWatch ダッシュボード、およびサブネット内の利用可能な空き IP を監視するための CloudWatch アラームを作成します。

:::note
    このガイドは完了までに約 30 分かかります。
:::
## インフラストラクチャ
次のセクションでは、このレシピのインフラストラクチャをセットアップします。

ここにデプロイされた Lambda は、一定間隔で EC2 API を呼び出し、空き IP メトリクスを [CloudWatch Metrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/working_with_metrics.html) に送信します。

### 前提条件

* AWS CLI が環境に[インストール](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html)され、[設定](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)されていること。
* [AWS CDK Typescript](https://docs.aws.amazon.com/cdk/latest/guide/work-with-cdk-typescript.html) が環境にインストールされていること。
* Node.js。
* [リポジトリ](https://github.com/aws-observability/observability-best-practices/)がローカルマシンにクローンされていること。このプロジェクトのコードは以下にあります `/sandbox/grafana_subnet_ip_monitoring`.

### 依存関係のインストール

次のコマンドを使用して、ディレクトリを grafana_subnet_ip_monitoring に変更します。

```
cd sandbox/grafana_subnet_ip_monitoring
```

これが今後、リポジトリのルートとみなされます。

以下のコマンドを使用して CDK の依存関係をインストールします。

```
npm install
```

すべての依存関係がインストールされました。

### 設定ファイルを変更する

リポジトリのルートで、次を開きます `lib/vpc_monitoring_stack.ts` を変更します。 `subnetIds`, `alarmEmail` および `monitoringFrequencyMinutes` 要件に基づいて設定します。

たとえば、以下のように変更します。

```
    const subnet_monitoring_stack = new SubnetMonitoringStack(this, 'SubnetIpMonitoringStack', {
      env: { 
        account: process.env.CDK_DEFAULT_ACCOUNT, 
        region: process.env.CDK_DEFAULT_REGION 
      },
      subnetIds: [
        'subnet-03e46f16d7dc01c0a', // Replace with your subnet IDs
        'subnet-0713ae10e4a8da850',
        'subnet-00a36dd76f1c51d97'
      ],
      ipThreshold: 50, // Alert when available IPs drop below 50
      alarmEmail: 'abc123@email.com', // Replace your email
      monitoringFrequencyMinutes: 5, // Check every 5 minutes
      evaluationPeriods: 2 // Require 2 consecutive breaches to trigger alarm
    });
```


### スタックをデプロイする

上記の変更を行ったら、スタックを CloudFormation にデプロイします。CDK スタックをデプロイするには、次のコマンドを実行します。

```
cdk bootstrap
cdk deploy --all
```

## クリーンアップ

CloudFormation スタックを削除します。

```
cdk destroy
```