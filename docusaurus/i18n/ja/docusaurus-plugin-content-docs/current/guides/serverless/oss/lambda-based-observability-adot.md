# OpenTelemetry を使用した AWS Lambda ベースのサーバーレスオブザーバビリティ

このガイドでは、AWS X-Ray や Amazon CloudWatch などのネイティブ AWS モニタリングサービスと、マネージド型オープンソースツールおよびテクノロジーを組み合わせて、Lambda ベースのサーバーレスアプリケーションのオブザーバビリティを設定するためのベストプラクティスについて説明します。[AWS Distro for OpenTelemetry (ADOT)](https://aws-otel.github.io/docs/introduction)、[AWS X-Ray](https://aws.amazon.com/xray)、[Amazon Managed Service for Prometheus (AMP)](https://aws.amazon.com/prometheus/) などのツールと、これらのツールを使用してサーバーレスアプリケーションに関する実用的なインサイトを取得し、問題をトラブルシューティングし、アプリケーションのパフォーマンスを最適化する方法について説明します。

## **取り上げる主なトピック**

このオブザーバビリティのベストプラクティスガイドのセクションでは、以下のトピックについて詳しく説明します。

* AWS Distro for OpenTelemetry (ADOT) と ADOT Lambda Layer の概要
* ADOT Lambda Layer を使用した Lambda 関数の自動インストルメンテーション
* ADOT Collector のカスタム設定サポート
* Amazon Managed Service for Prometheus (AMP) との統合
* ADOT Lambda Layer を使用する際の長所と短所
* ADOT を使用する際のコールドスタートレイテンシーの管理


## **AWS Distro for OpenTelemetry (ADOT) の概要**

[AWS Distro for OpenTelemetry (ADOT)](https://aws-otel.github.io/docs/introduction) は、Cloud Native Computing Foundation (CNCF) の [OpenTelemetry (OTel)](https://opentelemetry.io/) プロジェクトの、安全で本番環境に対応した AWS サポートのディストリビューションです。ADOT を使用すると、アプリケーションを一度だけ計装し、相関するメトリクスとトレースを複数のモニタリングソリューションに送信できます。

AWS のマネージド型 [OpenTelemetry Lambda Layer](https://aws-otel.github.io/docs/getting-started/lambda) は、[OpenTelemetry Lambda Layer](https://github.com/open-telemetry/opentelemetry-lambda) を利用してテレメトリデータをエクスポートします。AWS Lambda 関数をラップし、OpenTelemetry ランタイム固有の SDK、ADOT コレクターの軽量版、AWS Lambda 関数の自動計装用のすぐに使える設定をパッケージ化することで、プラグアンドプレイのユーザーエクスペリエンスを提供します。ADOT Lambda Layer コレクターコンポーネント (Receivers、Exporters、Extensions など) は、Amazon CloudWatch、Amazon OpenSearch Service、Amazon Managed Service for Prometheus、AWS X-Ray などとの統合をサポートしています。完全なリストは[こちら](https://github.com/aws-observability/aws-otel-lambda)をご覧ください。ADOT は[パートナーソリューション](https://aws.amazon.com/otel/partners)との統合もサポートしています。

ADOT Lambda Layer は、自動計装 (Python、NodeJS、Java 向け) と、特定のライブラリおよび SDK セットのカスタム計装の両方をサポートしています。自動計装では、デフォルトで Lambda Layer が AWS X-Ray にトレースをエクスポートするように設定されています。カスタム計装の場合は、それぞれの [OpenTelemetry ランタイム計装リポジトリ](https://github.com/open-telemetry)から対応するライブラリ計装を含め、関数内で初期化するようにコードを変更する必要があります。

## **AWS Lambda で ADOT Lambda Layer を使用した自動インストルメンテーション**

ADOT Lambda Layer を使用すると、コードを変更することなく Lambda 関数の自動計装を簡単に有効にできます。既存の Java ベースの Lambda 関数に ADOT Lambda Layer を追加し、CloudWatch で実行ログとトレースを表示する例を見てみましょう。

1. Lambda Layer の ARN を選択します。以下に基づいて選択してください。 `runtime`, `region` および `arch type` [ドキュメント](https://aws-otel.github.io/docs/getting-started/lambda)に従ってください。Lambda 関数と同じリージョンの Lambda Layer を使用してください。たとえば、Java 自動計装用の Lambda Layer は次のようになります `arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-java-agent-x86_64-ver-1-28-1:1`
2. Console または任意の IaC を使用して、Lambda 関数に Layer を追加します。
    * AWS Console を使用する場合は、[手順](https://docs.aws.amazon.com/lambda/latest/dg/adding-layers.html)に従って Lambda 関数に Layer を追加します。ARN の指定で、上記で選択した Layer ARN を貼り付けます。
    * IaC オプションを使用する場合、Lambda 関数の SAM テンプレートは次のようになります。
    ```
    Layers:
    - !Sub arn:aws:lambda:${AWS::Region}:901920570463:layer:aws-otel-java-agent-arm64-ver-1-28-1:1
    ```
3. 環境変数を追加します `AWS_LAMBDA_EXEC_WRAPPER=/opt/otel-handler` Node.js または Java の場合、および `AWS_LAMBDA_EXEC_WRAPPER=/opt/otel-instrument` Python 用を Lambda 関数に追加します。
4. Lambda 関数の Active Tracing を有効にします。**`Note`** デフォルトでは、レイヤーは AWS X-Ray にトレースをエクスポートするように設定されています。Lambda 関数の実行ロールに必要な AWS X-Ray 権限があることを確認してください。AWS Lambda の AWS X-Ray 権限の詳細については、[AWS Lambda ドキュメント](https://docs.aws.amazon.com/lambda/latest/dg/services-xray.html#services-xray-permissions)を参照してください。
    * `Tracing: Active`
5. Lambda Layer 設定、環境変数、X-Ray トレーシングを含む SAM テンプレートの例は次のようになります。
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
Lambda 関数を直接、または API 経由で呼び出します (API がトリガーとして設定されている場合)。例えば、API 経由で Lambda 関数を呼び出す場合 (次を使用 `curl`) は以下のようなログを生成します。
```
curl -X GET https://XXXXXX.execute-api.us-east-1.amazonaws.com/Prod/listBuckets
```
Lambda 関数のログ。
<pre><code>
OpenJDK 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
[otel.javaagent 2023-09-24 15:28:16:862 +0000][main] INFO io.opentelemetry.javaagent.tooling.VersionLogger - opentelemetry-javaagent - version: 1.28.0-adot-lambda1-aws
EXTENSION Name: collector State: Ready Events: [INVOKE, SHUTDOWN]
START RequestId: ed8f8444-3c29-40fe-a4a1-aca7af8cd940 Version: 3
...
END RequestId: ed8f8444-3c29-40fe-a4a1-aca7af8cd940
REPORT RequestId: ed8f8444-3c29-40fe-a4a1-aca7af8cd940 Duration: 5144.38 ms Billed Duration: 5145 ms Memory Size: 1024 MB Max Memory Used: 345 MB Init Duration: 27769.64 ms
<b>XRAY TraceId: 1-65105691-384f7da75714148655fa631b SegmentId: 2c52a147021ebd20 Sampled: true</b>
</code></pre>

ログから確認できるように、OpenTelemetry Lambda エクステンションはリスニングを開始し、opentelemetry-javaagent を使用して Lambda 関数をインストルメント化し、AWS X-Ray でトレースを生成します。

上記の Lambda 関数呼び出しからトレースを表示するには、AWS X-Ray コンソールに移動し、Traces でトレース ID を選択します。以下のように、Trace Map と Segments Timeline が表示されます。
![Lambda Insights](../../../images/Serverless/oss/xray-trace.png)


## **ADOT Collector のカスタム設定のサポート**

ADOT Lambda Layer は、OpenTelemetry SDK と ADOT Collector コンポーネントの両方を組み合わせたものです。ADOT Collector の設定は OpenTelemetry 標準に従います。デフォルトでは、ADOT Lambda Layer は [config.yaml](https://github.com/aws-observability/aws-otel-lambda/blob/main/adot/collector/config.yaml) を使用し、テレメトリデータを AWS X-Ray にエクスポートします。ただし、ADOT Lambda Layer は他のエクスポーターもサポートしており、メトリクスとトレースを他の送信先に送信できます。カスタム設定でサポートされている利用可能なコンポーネントの完全なリストは[こちら](https://github.com/aws-observability/aws-otel-lambda/blob/main/README.md#adot-lambda-layer-available-components)で確認できます。

## **Amazon Managed Service for Prometheus (AMP) との統合**

カスタムコレクター設定を使用して、Lambda 関数から Amazon Managed Prometheus (AMP) にメトリクスをエクスポートできます。

1. 上記の自動インストルメンテーションの手順に従って、Lambda Layer を設定し、環境変数を設定します `AWS_LAMBDA_EXEC_WRAPPER`.
2. [手順](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-onboard-create-workspace.html)に従って、AWS アカウントに Amazon Manager Prometheus ワークスペースを作成します。Lambda 関数はこのワークスペースにメトリクスを送信します。次の情報をメモしてください `Endpoint - remote write URL` AMP ワークスペースから取得します。これを ADOT コレクター設定で構成する必要があります。
3. カスタム ADOT コレクター設定ファイルを作成します（例： `collector.yaml`) を Lambda 関数のルートディレクトリに配置し、前のステップで取得した AMP エンドポイントのリモート書き込み URL の詳細を記述します。設定ファイルは S3 バケットから読み込むこともできます。
サンプル ADOT コレクター設定ファイル:
```
#collector.yaml in the root directory
#Set an environemnt variable 'OPENTELEMETRY_COLLECTOR_CONFIG_FILE' to '/var/task/collector.yaml'

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
Prometheus Remote Write Exporter は、リトライとタイムアウトの設定も可能です。詳細については、[ドキュメント](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/exporter/prometheusremotewriteexporter/README.md)を参照してください。**`Note`** のサービス値 `sigv4auth` 拡張子は次のようにする必要があります `aps` (amazon prometheus service)。また、Lambda 関数の実行ロールに必要な AMP 権限があることを確認してください。AWS Lambda の AMP に必要な権限とポリシーの詳細については、AWS Managed Service for Prometheus の[ドキュメント](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-and-IAM.html#AMP-IAM-policies-built-in)を参照してください。

4. 環境変数を追加します `OPENTELEMETRY_COLLECTOR_CONFIG_FILE` 値を設定ファイルのパスに設定します。例：/var/task/`<path to config file>`.yaml。これにより、Lambda Layer 拡張機能にコレクター設定の場所を伝えます。
```
Function:
    Type: AWS::Serverless::Function
    Properties:
      ...
      Environment:
        Variables:
          OPENTELEMETRY_COLLECTOR_CONFIG_FILE: /var/task/collector.yaml
```
5. OpenTelemetry Metrics API を使用してメトリクスを追加するように Lambda 関数コードを更新します。例についてはこちらを確認してください。
```
// get meter
Meter meter = GlobalOpenTelemetry.getMeterProvider()
    .meterBuilder("aws-otel")
    .setInstrumentationVersion("1.0")
    .build();

// Build counter e.g. LongCounter
LongCounter counter = meter
    .counterBuilder("processed_jobs")
    .setDescription("Processed jobs")
    .setUnit("1")
    .build();

// It is recommended that the API user keep a reference to Attributes they will record against
Attributes attributes = Attributes.of(stringKey("Key"), "SomeWork");

// Record data
counter.add(123, attributes);
```

## **ADOT Lambda Layer を使用する利点と欠点**

Lambda 関数から AWS X-Ray にトレースを送信する場合、[X-Ray SDK](https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-nodejs.html) または [AWS Distro for OpenTelemetry (ADOT) Lambda Layer](https://aws-otel.github.io/docs/getting-started/lambda) のいずれかを使用できます。X-Ray SDK はさまざまな AWS サービスの簡単なインストルメンテーションをサポートしていますが、X-Ray にのみトレースを送信できます。一方、Lambda Layer の一部として含まれている ADOT コレクターは、各言語の多数のライブラリインストルメンテーションをサポートしています。これを使用して、メトリクスとトレースを収集し、AWS X-Ray や、Amazon CloudWatch、Amazon OpenSearch Service、Amazon Managed Service for Prometheus、その他の[パートナー](https://aws-otel.github.io/docs/components/otlp-exporter#appdynamics)ソリューションなどの他のモニタリングソリューションに送信できます。

ただし、ADOT が提供する柔軟性により、Lambda 関数は追加のメモリを必要とする場合があり、コールドスタートのレイテンシーに顕著な影響を与える可能性があります。そのため、低レイテンシー向けに Lambda 関数を最適化しており、OpenTelemetry の高度な機能が不要な場合は、ADOT よりも AWS X-Ray SDK を使用する方が適している可能性があります。詳細な比較と適切なトレーシングツールの選択に関するガイダンスについては、[ADOT と X-Ray SDK の選択](https://docs.aws.amazon.com/xray/latest/devguide/xray-instrumenting-your-app.html#xray-instrumenting-choosing)に関する AWS ドキュメントを参照してください。


## **ADOT 使用時のコールドスタートレイテンシーの管理**
ADOT Lambda Layer for Java はエージェントベースです。つまり、自動計装を有効にすると、Java Agent は OTel で[サポートされている](https://github.com/open-telemetry/opentelemetry-java-instrumentation/tree/main/instrumentation)すべてのライブラリを計装しようとします。これにより、Lambda 関数のコールドスタートレイテンシーが大幅に増加します。そのため、アプリケーションで使用されているライブラリ/フレームワークに対してのみ自動計装を有効にすることをお勧めします。

特定のインストルメンテーションのみを有効にするには、次の環境変数を使用できます。

* `OTEL_INSTRUMENTATION_COMMON_DEFAULT_ENABLED`: false に設定すると、Layer での自動インストルメンテーションが無効になり、各インストルメンテーションを個別に有効にする必要があります。
* `OTEL_INSTRUMENTATION_<NAME>_ENABLED`: 特定のライブラリまたはフレームワークの自動インストルメンテーションを有効にするには、true に設定します。「NAME」を有効にするインストルメンテーションに置き換えてください。利用可能なインストルメンテーションのリストについては、「Suppressing specific agent instrumentation」を参照してください。

たとえば、Lambda と AWS SDK に対してのみ自動インストルメンテーションを有効にするには、次の環境変数を設定します。
```
OTEL_INSTRUMENTATION_COMMON_DEFAULT_ENABLED=false
OTEL_INSTRUMENTATION_AWS_LAMBDA_ENABLED=true
OTEL_INSTRUMENTATION_AWS_SDK_ENABLED=true
```

## **その他のリソース**

* [OpenTelemetry](https://opentelemetry.io)
* [AWS Distro for OpenTelemetry (ADOT)](https://aws-otel.github.io/docs/introduction)
* [ADOT Lambda Layer](https://aws-otel.github.io/docs/getting-started/lambda)

## **概要**

Open Source テクノロジーを使用した AWS Lambda ベースのサーバーレスアプリケーションのこのオブザーバビリティベストプラクティスガイドでは、AWS Distro for OpenTelemetry (ADOT) と Lambda Layer、および AWS Lambda 関数を計装する方法について説明しました。自動計装を簡単に有効にする方法と、シンプルな設定で ADOT コレクターをカスタマイズして複数の送信先にオブザーバビリティシグナルを送信する方法について説明しました。ADOT を使用する利点と欠点、Lambda 関数のコールドスタートレイテンシーに与える影響を強調し、コールドスタート時間を管理するためのベストプラクティスも推奨しました。これらのベストプラクティスを採用することで、アプリケーションを一度計装するだけで、ベンダーに依存しない方法でログ、メトリクス、トレースを複数のモニタリングソリューションに送信できます。

さらに深く学習するには、[AWS One Observability Workshop](https://catalog.workshops.aws/observability/en-US) の AWS マネージド型オープンソース Observability モジュールを実践することを強くお勧めします。
