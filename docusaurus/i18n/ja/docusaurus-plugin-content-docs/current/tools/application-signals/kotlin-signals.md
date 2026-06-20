# Kotlin サービス向けの Application Signals

## はじめに

Kotlin Web アプリケーションのパフォーマンスと健全性を監視することは、異なるコンポーネント間の複雑な相互作用により困難な場合があります。[Kotlin](https://kotlinlang.org/) Web サービスは通常、Java Archive (jar) ファイルにビルドされ、Java を実行する任意のプラットフォームにデプロイできます。これらのアプリケーションは、データベース、外部 API、キャッシュレイヤーなどの複数の相互接続されたコンポーネントを含む分散環境内で動作することがよくあります。この複雑さにより、平均解決時間 (MTTR) が大幅に増加する可能性があります。

このガイドでは、Linux EC2 サーバーで実行されている Kotlin Web サービスを自動計装する方法を説明します。[CloudWatch Application Signals](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Monitoring-Sections.html) を有効にすると、[AWS Distro for OpenTelemetry](https://aws-otel.github.io/docs/introduction) (ADOT) Java Auto-Instrumentation Agent を使用してアプリケーションからテレメトリを収集でき、コードを変更することなくアプリケーションからメトリクスとトレースを収集できます。呼び出し量、可用性、レイテンシー、障害、エラーなどの主要なメトリクスを活用して、アプリケーションサービスの現在の運用状態をすばやく確認してトリアージし、長期的なパフォーマンスとビジネス目標を満たしているかどうかを検証できます。

## 前提条件

- CloudWatch Application Signals と対話するための適切な [IAM アクセス許可](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Application_Signals_Permissions.html)を持つ Linux EC2 インスタンス。このガイドでは [Amazon Linux](https://aws.amazon.com/linux/amazon-linux-2023/) インスタンスを使用しているため、別のものを使用している場合はコマンドが若干異なる可能性があります。
- インスタンスに [SSH](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/connect-linux-inst-ssh.html) 接続する機能。

## ソリューションの概要

高レベルでは、実行する手順は次のとおりです。

- CloudWatch Application Signals を有効にします。
- fat jar で [ktor web サービス](https://ktor.io/)をデプロイします。
- web サービスから Application Signals を受信するように設定された CloudWatch エージェントをインストールします。
- [ADOT](https://aws-otel.github.io/docs/getting-started/java-sdk/auto-instr#introduction) Auto Instrumentation Agent をダウンロードします。
- kotlin サービス jar を java エージェントと一緒に実行して、サービスを自動計装します。
- いくつかのテストを実行してテレメトリを生成します。

### アーキテクチャ図

![Architecture](./images/kotlin-arch.png)

### CloudWatch Application Signals を有効にする

ステップ 1 の手順に従ってください。[Application Signals を有効にする](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Signals-Enable-EC2.html#CloudWatch-Application-Signals-EC2-Grant)をアカウントで実行します。

### Ktor Web サービスをデプロイする
[Ktor](https://ktor.io/) は、Web サービスを作成するための人気のある Kotlin フレームワークです。非同期サーバーサイドアプリケーションをすばやく開始できます。

作業ディレクトリを作成します
```
mkdir kotlin-signals && cd kotlin-signals
```

Ktor サンプルリポジトリをクローンします。
```
git clone https://github.com/ktorio/ktor-samples.git && cd ktor-samples/structured-logging
```

アプリケーションをビルドします。
```
./gradlew build && cd build/libs
```

アプリケーションが実行されることをテストします
```
java -jar structured-logging-all.jar
```

サービスが正しくビルドされ実行されたと仮定して、次のコマンドで停止できます。 `ctrl + c`

### CloudWatch エージェントを設定する
Amazon Linux インスタンスには、デフォルトで CloudWatch エージェントがインストールされています。インスタンスにインストールされていない場合は、[インストール](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-on-EC2-Instance.html)する必要があります。

インストールが完了したら、設定ファイルを作成できます。
```
sudo nano /opt/aws/amazon-cloudwatch-agent/bin/app-signals-config.json
```

以下の設定をファイルにコピーして貼り付けます。
```
{
    "traces": {
        "traces_collected": {
            "app_signals": {}
        }
    },
    "logs": {
        "metrics_collected": {
            "app_signals": {}
        }
    }
}
```

ファイルを保存し、作成した設定で CloudWatch エージェントを起動します。
```
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -s -c file:/opt/aws/amazon-cloudwatch-agent/bin/app-signals-config.json
```

### ADOT Auto Instrumentation Agent をダウンロードする

jar ファイルを含むディレクトリに移動します。このデモンストレーションを簡単にするために、ここにエージェントを配置します。実際のシナリオでは、独自のフォルダに配置することになるでしょう。

```
cd kotlin-signals/ktor-samples/structured-logging/build/libs
```

Auto Instrumentation Agent をダウンロードします。
```
wget https://github.com/aws-observability/aws-otel-java-instrumentation/releases/latest/download/aws-opentelemetry-agent.jar
```

### ADOT エージェントで Ktor サービスを実行する
```
OTEL_RESOURCE_ATTRIBUTES=service.name=KotlinApp,service.namespace=MyKotlinService,aws.hostedin.environment=EC2 \
OTEL_AWS_APPLICATION_SIGNALS_ENABLED=true \
OTEL_AWS_APPLICATION_SIGNALS_EXPORTER_ENDPOINT=http://localhost:4316/v1/metrics \
OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf \
OTEL_EXPORTER_OTLP_TRACES_ENDPOINT=http://localhost:4316/v1/traces \
OTEL_METRICS_EXPORTER=none \
OTEL_LOGS_EXPORT=none \
java -javaagent:aws-opentelemetry-agent.jar -jar structured-logging-all.jar
```

### サービスへのトラフィックを生成してテレメトリを作成する
```
for i in {1..1800}; do curl http://localhost:8080 && sleep 2; done
```

## テレメトリの確認

CloudWatch の「Services」セクションに Kotlin Service が表示されるようになります。

![kotlin-service](./images/kotlin-services.png)

「サービスマップ」でサービスを確認することもできます

![kotlin-service-map](./images/kotlin-service-map.png)

インストルメンテーションは、レイテンシーなどの貴重なメトリクスを提供します。

![kotlin-metrics](./images/kotlin-metrics.png)

### 次のステップ

ここから次のステップとして、サービスの [SLO](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-ServiceLevelObjectives.html) の作成を含む [Application Signals エクスペリエンス](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Monitoring-Sections.html)をさらに探索することができます。もう 1 つの良い次のステップは、Ktor でより多くの Kotlin マイクロサービスを作成して、より複雑なバックエンドを構築し始めることです。分散型の複雑な環境では、Application Signals のようなツールで最も多くのメリットが得られます。

### クリーンアップ

EC2 インスタンスを終了し、 `/aws/appsignals/generic` ログループ。
