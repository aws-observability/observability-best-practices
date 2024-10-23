# AWS Lambda ベースのサーバーレスオブザーバビリティと OpenTelemetry

このガイドでは、AWS X-Ray や Amazon CloudWatch などのネイティブな AWS モニタリングサービスと共に、マネージドオープンソースツールおよびテクノロジーを使用して、Lambda ベースのサーバーレスアプリケーションのオブザーバビリティを構成するためのベストプラクティスを説明します。[AWS Distro for OpenTelemetry (ADOT)](https://aws-otel.github.io/docs/introduction)、[AWS X-Ray](https://aws.amazon.com/jp/xray)、[Amazon Managed Service for Prometheus (AMP)](https://aws.amazon.com/jp/prometheus/) などのツールを取り上げ、これらのツールを使用してサーバーレスアプリケーションに関する実用的な洞察を得る方法、問題のトラブルシューティング方法、アプリケーションパフォーマンスの最適化方法について説明します。



## **主要なトピック**

オブザーバビリティのベストプラクティスガイドのこのセクションでは、以下のトピックについて詳しく説明します：

* AWS Distro for OpenTelemetry (ADOT) と ADOT Lambda レイヤーの紹介
* ADOT Lambda レイヤーを使用した Lambda 関数の自動計装
* ADOT Collector のカスタム設定サポート
* Amazon Managed Service for Prometheus (AMP) との統合
* ADOT Lambda レイヤー使用の長所と短所
* ADOT 使用時のコールドスタートレイテンシーの管理



## **AWS Distro for OpenTelemetry (ADOT) の紹介**

[AWS Distro for OpenTelemetry (ADOT)](https://aws-otel.github.io/docs/introduction) は、Cloud Native Computing Foundation (CNCF) の [OpenTelemetry (OTel)](https://opentelemetry.io/) プロジェクトの、安全で本番環境に対応した AWS がサポートするディストリビューションです。ADOT を使用すると、アプリケーションを一度だけ計装し、相関のあるメトリクスとトレースを複数の監視ソリューションに送信できます。

AWS のマネージド [OpenTelemetry Lambda Layer](https://aws-otel.github.io/docs/getting-started/lambda) は、[OpenTelemetry Lambda Layer](https://github.com/open-telemetry/opentelemetry-lambda) を利用して、AWS Lambda からテレメトリデータを非同期でエクスポートします。AWS Lambda 関数をラップし、OpenTelemetry ランタイム固有の SDK、縮小版の ADOT コレクター、AWS Lambda 関数の自動計装用の設定をパッケージングすることで、プラグアンドプレイのユーザーエクスペリエンスを提供します。ADOT Lambda Layer コレクターのコンポーネント（Receivers、Exporters、Extensions など）は、Amazon CloudWatch、Amazon OpenSearch Service、Amazon Managed Service for Prometheus、AWS X-Ray などとの統合をサポートしています。完全なリストは[こちら](https://github.com/aws-observability/aws-otel-lambda)でご覧いただけます。ADOT は[パートナーソリューション](https://aws.amazon.com/jp/otel/partners)との統合もサポートしています。

ADOT Lambda Layer は、自動計装（Python、NodeJS、Java 向け）と、特定のライブラリや SDK 向けのカスタム計装の両方をサポートしています。自動計装では、デフォルトで Lambda Layer は AWS X-Ray にトレースをエクスポートするように設定されています。カスタム計装の場合は、対応する [OpenTelemetry ランタイム計装リポジトリ](https://github.com/open-telemetry) からライブラリ計装を含め、関数内でそれを初期化するようにコードを変更する必要があります。



## **AWS Lambda での ADOT Lambda レイヤーを使用した自動計装**

ADOT Lambda レイヤーを使用することで、コードを変更せずに Lambda 関数の自動計装を簡単に有効にできます。既存の Java ベースの Lambda 関数に ADOT Lambda レイヤーを追加し、CloudWatch で実行ログとトレースを表示する例を見てみましょう。

1. [ドキュメント](https://aws-otel.github.io/docs/getting-started/lambda) に従って、`ランタイム`、`リージョン`、`アーキテクチャタイプ` に基づいて Lambda レイヤーの ARN を選択します。Lambda 関数と同じリージョンの Lambda レイヤーを使用してください。例えば、Java の自動計装用の Lambda レイヤーは `arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-java-agent-x86_64-ver-1-28-1:1` となります。

2. コンソールまたは任意の IaC を使用して、Lambda 関数にレイヤーを追加します。
    * AWS コンソールの場合、[手順](https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/adding-layers.html) に従って Lambda 関数にレイヤーを追加します。「ARN を指定」で、上記で選択したレイヤー ARN を貼り付けます。
    * IaC オプションの場合、Lambda 関数の SAM テンプレートは次のようになります：
    ```
    Layers:
    - !Sub arn:aws:lambda:${AWS::Region}:901920570463:layer:aws-otel-java-agent-arm64-ver-1-28-1:1
    ```

3. Lambda 関数に環境変数を追加します。Node.js または Java の場合は `AWS_LAMBDA_EXEC_WRAPPER=/opt/otel-handler`、Python の場合は `AWS_LAMBDA_EXEC_WRAPPER=/opt/otel-instrument` を追加します。

4. Lambda 関数のアクティブトレースを有効にします。**`注意`** デフォルトでは、レイヤーは AWS X-Ray にトレースをエクスポートするように設定されています。Lambda 関数の実行ロールに必要な AWS X-Ray 権限があることを確認してください。AWS Lambda の AWS X-Ray 権限について詳しくは、[AWS Lambda ドキュメント](https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/services-xray.html) を参照してください。
    * `Tracing: Active`

5. Lambda レイヤー設定、環境変数、X-Ray トレースを含む SAM テンプレートの例は次のようになります：
```
Resources:
  ListBucketsFunction:
    Type: AWS::Serverless::Function
    Properties:
      Handler: com.example.App::handleRequest
      ...
      ProvisionedConcurrencyConfig:
        ProvisionedConcurrentExecutions: 1
      Policies:
        - AWSXrayWriteOnlyAccess
        - AmazonS3ReadOnlyAccess
      Environment:
        Variables:
          AWS_LAMBDA_EXEC_WRAPPER: /opt/otel-handler
      Tracing: Active
      Layers:
        - !Sub arn:aws:lambda:${AWS::Region}:901920570463:layer:aws-otel-java-agent-amd64-ver-1-28-1:1
      Events:
        HelloWorld:
          Type: Api
          Properties:
            Path: /listBuckets
            Method: get
```

6. AWS X-Ray でのトレースのテストと可視化
Lambda 関数を直接、または API を介して（API がトリガーとして設定されている場合）呼び出します。例えば、API を介して Lambda 関数を呼び出す（`curl` を使用）と、以下のようなログが生成されます：
```
curl -X GET https://XXXXXX.execute-api.us-east-1.amazonaws.com/Prod/listBuckets
```
Lambda 関数のログ：
<pre><code>
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
[otel.javaagent 2023-09-24 15:28:16:862 +0000] [main] INFO io.opentelemetry.javaagent.tooling.VersionLogger - opentelemetry-javaagent - version: 1.28.0-adot-lambda1-aws
EXTENSION Name: collector State: Ready Events: [INVOKE, SHUTDOWN]
START RequestId: ed8f8444-3c29-40fe-a4a1-aca7af8cd940 Version: 3
...
END RequestId: ed8f8444-3c29-40fe-a4a1-aca7af8cd940
REPORT RequestId: ed8f8444-3c29-40fe-a4a1-aca7af8cd940 Duration: 5144.38 ms Billed Duration: 5145 ms Memory Size: 1024 MB Max Memory Used: 345 MB Init Duration: 27769.64 ms
<b>XRAY TraceId: 1-65105691-384f7da75714148655fa631b SegmentId: 2c52a147021ebd20 Sampled: true</b>
</code></pre>

ログから分かるように、OpenTelemetry Lambda 拡張機能が opentelemetry-javaagent を使用して Lambda 関数のリスニングと計装を開始し、AWS X-Ray でトレースを生成しています。

上記の Lambda 関数呼び出しからのトレースを表示するには、AWS X-Ray コンソールに移動し、トレースの下でトレース ID を選択します。以下のようなトレースマップとセグメントタイムラインが表示されるはずです：
![Lambda Insights](../../../images/Serverless/oss/xray-trace.png)



## **ADOT Collector のカスタム設定サポート**

ADOT Lambda レイヤーは、OpenTelemetry SDK と ADOT Collector コンポーネントの両方を組み合わせています。ADOT Collector の設定は OpenTelemetry 標準に従っています。デフォルトでは、ADOT Lambda レイヤーは [config.yaml](https://github.com/aws-observability/aws-otel-lambda/blob/main/adot/collector/config.yaml) を使用し、テレメトリデータを AWS X-Ray にエクスポートします。しかし、ADOT Lambda レイヤーは他のエクスポーターもサポートしており、メトリクスとトレースを他の宛先に送信することができます。カスタム設定でサポートされている利用可能なコンポーネントの完全なリストは[こちら](https://github.com/aws-observability/aws-otel-lambda/blob/main/README.md#adot-lambda-layer-available-components)で確認できます。



## **Amazon Managed Service for Prometheus (AMP) との統合**

カスタムコレクター設定を使用して、Lambda 関数からのメトリクスを Amazon Managed Prometheus (AMP) にエクスポートできます。

1. 上記の自動計装の手順に従って、Lambda レイヤーを設定し、環境変数 `AWS_LAMBDA_EXEC_WRAPPER` を設定します。
2. [手順](https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/AMP-onboard-create-workspace.html) に従って、Lambda 関数がメトリクスを送信する先の AWS アカウントに Amazon Managed Prometheus ワークスペースを作成します。AMP ワークスペースの `Endpoint - remote write URL` をメモしておきます。これは ADOT コレクター設定で設定する必要があります。
3. Lambda 関数のルートディレクトリに、前のステップで取得した AMP エンドポイントのリモート書き込み URL の詳細を含むカスタム ADOT コレクター設定ファイル (例: `collector.yaml`) を作成します。設定ファイルを S3 バケットからロードすることもできます。
ADOT コレクター設定ファイルのサンプル：
```



#ルートディレクトリにある collector.yaml



#環境変数 'OPENTELEMETRY_COLLECTOR_CONFIG_FILE' を '/var/task/collector.yaml' に設定する

extensions:
  sigv4auth:
    service: "aps"
    region: "<workspace_region>"

receivers:
  otlp:
    protocols:
      grpc:
      http:

exporters:
  logging:
  prometheusremotewrite:
    endpoint: "<workspace_remote_write_url>"
    namespace: test
    auth:
      authenticator: sigv4auth

service:
  extensions: [sigv4auth]
  pipelines:
    traces:
      receivers: [otlp]
      exporters: [awsxray]
    metrics:
      receivers: [otlp]
      exporters: [logging, prometheusremotewrite]
```
Prometheus Remote Write Exporter は、リトライとタイムアウトの設定も構成できます。詳細については、[ドキュメント](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/exporter/prometheusremotewriteexporter/README.md) を参照してください。**`注意`** `sigv4auth` 拡張機能のサービス値は `aps` (amazon prometheus service) である必要があります。また、Lambda 関数の実行ロールに必要な AMP 権限があることを確認してください。AWS Lambda の AMP に必要な権限とポリシーの詳細については、AWS Managed Service for Prometheus の [ドキュメント](https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/AMP-and-IAM.html) を参照してください。

4. 環境変数 `OPENTELEMETRY_COLLECTOR_CONFIG_FILE` を追加し、設定ファイルのパスを値として設定します。例：/var/task/`<設定ファイルへのパス>`.yaml。これにより、Lambda Layer 拡張機能にコレクター設定の場所を指示します。
```
Function:
    Type: AWS::Serverless::Function
    Properties:
      ...
      Environment:
        Variables:
          OPENTELEMETRY_COLLECTOR_CONFIG_FILE: /var/task/collector.yaml
```
5. OpenTelemetry Metrics API を使用してメトリクスを追加するように Lambda 関数コードを更新します。こちらの例を参照してください。
```
// メーターを取得
Meter meter = GlobalOpenTelemetry.getMeterProvider()
    .meterBuilder("aws-otel")
    .setInstrumentationVersion("1.0")
    .build();

// カウンターを構築（例：LongCounter）
LongCounter counter = meter
    .counterBuilder("processed_jobs")
    .setDescription("Processed jobs")
    .setUnit("1")
    .build();

// API ユーザーが記録する属性への参照を保持することをお勧めします
Attributes attributes = Attributes.of(stringKey("Key"), "SomeWork");

// データを記録
counter.add(123, attributes);
```



## **ADOT Lambda レイヤーを使用する利点と欠点**

Lambda 関数から AWS X-Ray にトレースを送信する場合、[X-Ray SDK](https://docs.aws.amazon.com/ja_jp/xray/latest/devguide/xray-sdk-nodejs.html) または [AWS Distro for OpenTelemetry (ADOT) Lambda レイヤー](https://aws-otel.github.io/docs/getting-started/lambda) のいずれかを使用できます。X-Ray SDK は様々な AWS サービスの簡単な計装をサポートしていますが、トレースを X-Ray にのみ送信できます。一方、Lambda レイヤーの一部として含まれる ADOT コレクターは、各言語に対して多数のライブラリ計装をサポートしています。これを使用して、メトリクスとトレースを収集し、AWS X-Ray や Amazon CloudWatch、Amazon OpenSearch Service、Amazon Managed Service for Prometheus、その他の [パートナー](https://aws-otel.github.io/docs/components/otlp-exporter#appdynamics) ソリューションなどの監視ソリューションに送信できます。

ただし、ADOT が提供する柔軟性のため、Lambda 関数には追加のメモリが必要になる場合があり、コールドスタートのレイテンシーに顕著な影響を与える可能性があります。したがって、低レイテンシーのために Lambda 関数を最適化し、OpenTelemetry の高度な機能が不要な場合は、ADOT よりも AWS X-Ray SDK を使用する方が適している場合があります。詳細な比較と適切なトレースツールの選択に関するガイダンスについては、AWS ドキュメントの [ADOT と X-Ray SDK の選択](https://docs.aws.amazon.com/ja_jp/xray/latest/devguide/xray-instrumenting-your-app.html) を参照してください。



## **ADOT 使用時のコールドスタートレイテンシーの管理**
Java 用の ADOT Lambda レイヤーはエージェントベースです。つまり、自動計装を有効にすると、Java エージェントは OTel の[サポートされている](https://github.com/open-telemetry/opentelemetry-java-instrumentation/tree/main/instrumentation)すべてのライブラリを計装しようとします。これにより、Lambda 関数のコールドスタートレイテンシーが大幅に増加します。そのため、アプリケーションで使用されているライブラリやフレームワークに対してのみ自動計装を有効にすることをお勧めします。

特定の計装のみを有効にするには、以下の環境変数を使用できます：

* `OTEL_INSTRUMENTATION_COMMON_DEFAULT_ENABLED`：false に設定すると、レイヤーでの自動計装が無効になり、各計装を個別に有効にする必要があります。
* `OTEL_INSTRUMENTATION_<NAME>_ENABLED`：特定のライブラリやフレームワークの自動計装を有効にするには true に設定します。「NAME」を有効にしたい計装に置き換えてください。利用可能な計装のリストについては、特定のエージェント計装の抑制を参照してください。

例えば、Lambda と AWS SDK の自動計装のみを有効にするには、以下の環境変数を設定します：
```
OTEL_INSTRUMENTATION_COMMON_DEFAULT_ENABLED=false
OTEL_INSTRUMENTATION_AWS_LAMBDA_ENABLED=true
OTEL_INSTRUMENTATION_AWS_SDK_ENABLED=true
```



## **追加リソース**

* [OpenTelemetry](https://opentelemetry.io)
* [AWS Distro for OpenTelemetry (ADOT)](https://aws-otel.github.io/docs/introduction)
* [ADOT Lambda レイヤー](https://aws-otel.github.io/docs/getting-started/lambda)



## **まとめ**

オープンソース技術を使用した AWS Lambda ベースのサーバーレスアプリケーションのためのこのオブザーバビリティのベストプラクティスガイドでは、AWS Distro for OpenTelemetry (ADOT) と Lambda レイヤーについて説明し、AWS Lambda 関数を計測する方法を紹介しました。
簡単な設定で自動計測を有効にし、ADOT コレクターをカスタマイズして複数の宛先にオブザーバビリティシグナルを送信する方法を説明しました。
ADOT の使用に関する長所と短所を強調し、Lambda 関数のコールドスタートレイテンシーにどのような影響を与えるかを説明し、コールドスタート時間を管理するためのベストプラクティスも推奨しました。
これらのベストプラクティスを採用することで、アプリケーションを一度だけ計測し、ベンダーに依存しない方法で複数の監視ソリューションにログ、メトリクス、トレースを送信することができます。

さらに深く掘り下げるために、[AWS One Observability Workshop](https://catalog.workshops.aws/observability/en-US) の AWS マネージドオープンソースオブザーバビリティモジュールを実践することを強くおすすめします。
