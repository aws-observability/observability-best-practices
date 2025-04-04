# 顧客のサブネットにおける空き IP アドレスのモニタリング

このレシピでは、サブネット内の利用可能な IP アドレスをモニタリングするためのモニタリングスタックのセットアップ方法を説明します。

[AWS Cloud Development Kit (CDK)](https://aws.amazon.com/jp/cdk/) を使用してスタックをセットアップし、サブネット内の利用可能な空き IP アドレスをモニタリングするための Lambda、CloudWatch ダッシュボード、CloudWatch アラームを作成します。

:::note
    このガイドは完了までに約 30 分かかります。
:::



## インフラストラクチャ
以下のセクションでは、このレシピのインフラストラクチャをセットアップします。

ここでデプロイされる Lambda は、一定の間隔で EC2 API を呼び出し、空き IP メトリクスを [Cloudwatch Metrics](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/working_with_metrics.html) に送信します。



### 前提条件

* AWS CLI が環境に[インストール](https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/cli-chap-install.html)され、[設定](https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/cli-chap-configure.html)されていること。
* [AWS CDK Typescript](https://docs.aws.amazon.com/ja_jp/cdk/latest/guide/work-with-cdk-typescript.html) が環境にインストールされていること。
* Node.js がインストールされていること。
* [リポジトリ](https://github.com/aws-observability/observability-best-practices/)がローカルマシンにクローンされていること。このプロジェクトのコードは `/sandbox/grafana_subnet_ip_monitoring` にあります。



### 依存関係のインストール

以下のコマンドで grafana_subnet_ip_monitoring ディレクトリに移動します：

```
cd sandbox/grafana_subnet_ip_monitoring
```

以降、このディレクトリをリポジトリのルートとして扱います。

以下のコマンドで CDK の依存関係をインストールします：

```
npm install
```

これで全ての依存関係がインストールされました。



### 設定ファイルの変更

リポジトリのルートで、`lib/vpc_monitoring_stack.ts` を開き、要件に応じて `subnetIds`、`alarmEmail`、`monitoringFrequencyMinutes` を変更します。

例えば、以下のように変更します：

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



### スタックのデプロイ

上記の変更が完了したら、スタックを CloudFormation にデプロイする時です。CDK スタックをデプロイするには、以下のコマンドを実行します：

```
cdk bootstrap
cdk deploy --all
```



## クリーンアップ

CloudFormation スタックを削除します:

```
cdk destroy
```
