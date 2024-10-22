# OpenTelemetry を使用した Lambda ベースのサーバーレス観測性

このガイドでは、AWS X-Ray や Amazon CloudWatch などのネイティブ AWS モニタリングサービスと、管理されたオープンソースツールおよびテクノロジーを組み合わせて、Lambda ベースのサーバーレスアプリケーションの観測性を設定するベストプラクティスについて説明します。[AWS Distro for OpenTelemetry (ADOT)](https://aws-otel.github.io/docs/introduction)、[AWS X-Ray](https://aws.amazon.com/jp/xray)、[Amazon Managed Service for Prometheus (AMP)](https://aws.amazon.com/jp/prometheus/) などのツールと、これらのツールを使ってサーバーレスアプリケーションから実行可能な洞察を得る方法、問題のトラブルシューティングを行う方法、アプリケーションのパフォーマンスを最適化する方法について説明します。

## **主要なトピック**

このオブザーバビリティのベストプラクティスガイドのセクションでは、以下のトピックについて詳しく説明します。

* AWS Distro for OpenTelemetry (ADOT) と ADOT Lambda Layer の紹介
* ADOT Lambda Layer を使用した Lambda 関数の自動インストルメンテーション
* ADOT Collector のカスタム設定サポート
* Amazon Managed Service for Prometheus (AMP) との統合
* ADOT Lambda Layer を使用する利点と欠点
* ADOT を使用する際のコールドスタート待ち時間の管理

## **AWS Distro for OpenTelemetry (ADOT) の概要**

[AWS Distro for OpenTelemetry (ADOT)](https://aws-otel.github.io/docs/introduction) は、Cloud Native Computing Foundation (CNCF) の [OpenTelemetry (OTel)](https://opentelemetry.io/) プロジェクトの安全で、本番環境に対応した、AWS がサポートする配布物です。ADOT を使用すると、アプリケーションを 1 回インストルメント化するだけで、関連するメトリクスとトレースを複数のモニタリングソリューションに送信できます。

AWS が管理する [OpenTelemetry Lambda Layer](https://aws-otel.github.io/docs/getting-started/lambda) は、[OpenTelemetry Lambda Layer](https://github.com/open-telemetry/opentelemetry-lambda) を利用して、AWS Lambda からテレメトリデータを非同期に出力します。AWS Lambda 関数をラップし、OpenTelemetry ランタイム固有の SDK、ADOT コレクターの縮小版、AWS Lambda 関数の自動インストルメンテーションのための既定の設定をパッケージ化することで、プラグアンドプレイのユーザー体験を提供します。ADOT Lambda Layer コレクターのコンポーネントである Receivers、Exporters、Extensions は、Amazon CloudWatch、Amazon OpenSearch Service、Amazon Managed Service for Prometheus、AWS X-Ray などとの統合をサポートしています。完全なリストは[こちら](https://github.com/aws-observability/aws-otel-lambda)を参照してください。ADOT は[パートナーソリューション](https://aws.amazon.com/jp/otel/partners)との統合もサポートしています。

ADOT Lambda Layer は、自動インストルメンテーション (Python、Node.js、Java 用) と、特定のライブラリや SDK のカスタムインストルメンテーションの両方をサポートしています。自動インストルメンテーションでは、デフォルトで Lambda Layer は AWS X-Ray へのトレース出力に設定されています。カスタムインストルメンテーションの場合は、対応する[OpenTelemetry ランタイムインストルメンテーションリポジトリ](https://github.com/open-telemetry)からライブラリのインストルメンテーションを含め、関数内でそれを初期化するようにコードを変更する必要があります。

## **AWS Lambda での ADOT Lambda Layer を使用した自動インストルメンテーション**

ADOT Lambda Layer を使用すれば、コード変更なしで Lambda 関数の自動インストルメンテーションを簡単に有効化できます。既存の Java ベースの Lambda 関数に ADOT Lambda Layer を追加し、CloudWatch で実行ログとトレースを確認する例を見てみましょう。

1. [ドキュメンテーション](https://aws-otel.github.io/docs/getting-started/lambda)に従って、`ランタイム`、`リージョン`、`アーキテクチャタイプ`に基づいて Lambda Layer の ARN を選択します。Lambda 関数と同じリージョンの Lambda Layer を使用することを確認してください。たとえば、Java の自動インストルメンテーション用の Lambda Layer は `arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-java-agent-x86_64-ver-1-28-1:1` となります。
2. コンソールまたは選択した IaC を使って、Lambda 関数にレイヤーを追加します。
    * AWS コンソールでは、[手順](https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/adding-layers.html)に従って Lambda 関数にレイヤーを追加します。「Specify an ARN」の下に、上で選択したレイヤーの ARN を貼り付けます。
    * IaC オプションでは、Lambda 関数の SAM テンプレートは次のようになります。
    ```
    Layers:
    - !Sub arn:aws:lambda:${AWS::Region}:901920570463:layer:aws-otel-java-agent-arm64-ver-1-28-1:1
    ```
3. Node.js または Java の場合は環境変数 `AWS_LAMBDA_EXEC_WRAPPER=/opt/otel-handler` を、Python の場合は `AWS_LAMBDA_EXEC_WRAPPER=/opt/otel-instrument` を Lambda 関数に追加します。
4. Lambda 関数のアクティブトレーシングを有効にします。**`注意`** デフォルトでは、レイヤーは AWS X-Ray へのトレース出力に設定されています。Lambda 関数の実行ロールに必要な AWS X-Ray の許可があることを確認してください。AWS Lambda の AWS X-Ray 許可の詳細については、[AWS Lambda ドキュメンテーション](https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/services-xray.html)を参照してください。
    * `Tracing: Active`
5. Lambda Layer の設定、環境変数、X-Ray トレーシングを含む SAM テンプレートの例は次のようになります。
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
6. AWS X-Ray でのテストとトレースの可視化
直接または API (トリガーとして API が設定されている場合) を介して Lambda 関数を呼び出します。たとえば、API 経由で Lambda 関数を呼び出す (`curl` を使用) と、次のようなログが生成されます。
```
curl -X GET https://XXXXXX.execute-api.us-east-1.amazonaws.com/Prod/listBuckets
```
Lambda 関数のログ:
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

ログからわかるように、OpenTelemetry Lambda 拡張機能が起動し、opentelemetry-javaagent を使用して Lambda 関数をインストルメント化し、AWS X-Ray でトレースを生成しています。

上記の Lambda 関数呼び出しからのトレースを表示するには、AWS X-Ray コンソールに移動し、「Traces」の下のトレース ID を選択します。次のようなトレースマップとセグメントタイムラインが表示されます。
![Lambda Insights](../../../images/Serverless/oss/xray-trace.png)

## **ADOT コレクターのカスタム設定サポート**

ADOT Lambda レイヤーは、OpenTelemetry SDK と ADOT コレクターの両方のコンポーネントを組み合わせています。ADOT コレクターの設定は OpenTelemetry 標準に従います。デフォルトでは、ADOT Lambda レイヤーは [config.yaml](https://github.com/aws-observability/aws-otel-lambda/blob/main/adot/collector/config.yaml) を使用し、テレメトリデータを AWS X-Ray にエクスポートします。しかし、ADOT Lambda レイヤーは他のエクスポーターもサポートしており、メトリクスとトレースを他の宛先に送信できます。カスタム設定でサポートされている利用可能なコンポーネントの完全なリストは[こちら](https://github.com/aws-observability/aws-otel-lambda/blob/main/README.md#adot-lambda-layer-available-components)を参照してください。

## **Amazon Managed Service for Prometheus (AMP) との統合**

カスタムコレクター設定を使用して、Lambda 関数からメトリクスを Amazon Managed Prometheus (AMP) にエクスポートできます。

1. 上記の自動インストルメンテーションの手順に従って、Lambda Layer を設定し、環境変数 `AWS_LAMBDA_EXEC_WRAPPER` を設定します。
2. [手順](https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/AMP-onboard-create-workspace.html)に従って、AWS アカウントに Amazon Manager Prometheus ワークスペースを作成します。このワークスペースに Lambda 関数がメトリクスを送信します。AMP ワークスペースの `Endpoint - remote write URL` を控えておいてください。この URL は ADOT コレクター設定で設定する必要があります。
3. Lambda 関数のルートディレクトリに、前の手順で取得した AMP エンドポイントの remote write URL の詳細を含むカスタム ADOT コレクター設定ファイル (例: `collector.yaml`) を作成します。設定ファイルは S3 バケットからロードすることもできます。
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
Prometheus Remote Write Exporter は、リトライやタイムアウト設定も構成できます。詳細については、[ドキュメント](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/exporter/prometheusremotewriteexporter/README.md) を参照してください。**`注意`** `sigv4auth` 拡張子の Service 値は `aps` (Amazon Prometheus Service) にする必要があります。また、Lambda 関数の実行ロールに必要な AMP の許可があることを確認してください。AWS Lambda の AMP で必要な許可とポリシーの詳細については、AWS Managed Service for Prometheus の[ドキュメント](https://docs.aws.amazon.com/ja_jp/prometheus/latest/userguide/AMP-and-IAM.html) を参照してください。

4. 環境変数 `OPENTELEMETRY_COLLECTOR_CONFIG_FILE` を追加し、設定ファイルのパスを値に設定します。例: /var/task/`&lt;設定ファイルのパス>`.yaml。これにより、Lambda Layer 拡張子が収集器の設定ファイルを見つけることができます。
```
Function:
    Type: AWS::Serverless::Function
    Properties:
      ...
      Environment:
        Variables:
          OPENTELEMETRY_COLLECTOR_CONFIG_FILE: /var/task/collector.yaml
```
5. OpenTelemetry Metrics API を使用してメトリクスを追加するように Lambda 関数のコードを更新します。例はこちらを参照してください。
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
</workspace_remote_write_url></workspace_region>

## **ADOT Lambda レイヤーを使用するメリットとデメリット**

Lambda 関数から AWS X-Ray にトレースを送信する場合、[X-Ray SDK](https://docs.aws.amazon.com/ja_jp/xray/latest/devguide/xray-sdk-nodejs.html) または [AWS Distro for OpenTelemetry (ADOT) Lambda レイヤー](https://aws-otel.github.io/docs/getting-started/lambda) のいずれかを使用できます。X-Ray SDK は、さまざまな AWS サービスの簡単な計装をサポートしていますが、トレースを X-Ray にのみ送信できます。一方、Lambda レイヤーの一部として含まれている ADOT コレクターは、各言語で多数のライブラリの計装をサポートしています。これを使用して、メトリクスとトレースを収集し、AWS X-Ray や Amazon CloudWatch、Amazon OpenSearch Service、Amazon Managed Service for Prometheus、その他の [パートナー](https://aws-otel.github.io/docs/components/otlp-exporter#appdynamics) ソリューションにデータを送信できます。

ただし、ADOT が提供する柔軟性のため、Lambda 関数では追加のメモリが必要になり、コールドスタート時の待ち時間に大きな影響が出る可能性があります。そのため、低レイテンシを最適化し、OpenTelemetry の高度な機能を必要としない場合は、ADOT よりも AWS X-Ray SDK を使用する方が適切かもしれません。詳細な比較とトレーシングツールの選択ガイダンスについては、AWS ドキュメントの [ADOT と X-Ray SDK の選択](https://docs.aws.amazon.com/ja_jp/xray/latest/devguide/xray-instrumenting-your-app.html) を参照してください。

## **ADOT を使用する際のコールドスタート待ち時間の管理**
Java 用の ADOT Lambda レイヤーはエージェントベースであり、自動インストルメンテーションを有効にすると、Java エージェントは OTel [サポート対象](https://github.com/open-telemetry/opentelemetry-java-instrumentation/tree/main/instrumentation)のすべてのライブラリをインストルメントしようとします。これにより、Lambda 関数のコールドスタート待ち時間が大幅に増加します。そのため、アプリケーションで使用されているライブラリ/フレームワークに対してのみ自動インストルメンテーションを有効にすることをおすすめします。

特定のインストルメンテーションのみを有効にするには、以下の環境変数を使用できます。

* `OTEL_INSTRUMENTATION_COMMON_DEFAULT_ENABLED`: false に設定すると、レイヤーの自動インストルメンテーションを無効にし、個別にインストルメンテーションを有効にする必要があります。
* `OTEL_INSTRUMENTATION_<name>_ENABLED`: 特定のライブラリまたはフレームワークの自動インストルメンテーションを有効にするには true に設定します。"NAME" は有効にするインストルメンテーションに置き換えてください。利用可能なインストルメンテーションのリストについては、「特定のエージェントインストルメンテーションの抑制」を参照してください。

たとえば、Lambda と AWS SDK の自動インストルメンテーションのみを有効にするには、以下の環境変数を設定します。
```
OTEL_INSTRUMENTATION_COMMON_DEFAULT_ENABLED=false
OTEL_INSTRUMENTATION_AWS_LAMBDA_ENABLED=true
OTEL_INSTRUMENTATION_AWS_SDK_ENABLED=true
```
</name>

## **その他のリソース**

* [OpenTelemetry](https://opentelemetry.io)
* [AWS Distro for OpenTelemetry (ADOT)](https://aws-otel.github.io/docs/introduction)
* [ADOT Lambda Layer](https://aws-otel.github.io/docs/getting-started/lambda)

## **概要**

このオープンソーステクノロジーを使用した AWS Lambda ベースのサーバーレスアプリケーションのオブザーバビリティベストプラクティスガイドでは、AWS Distro for OpenTelemetry (ADOT) と Lambda Layer、およびそれらを使って AWS Lambda 関数にインストルメンテーションを行う方法について説明しました。自動インストルメンテーションを簡単に有効にする方法と、シンプルな構成で ADOT コレクターをカスタマイズしてオブザーバビリティシグナルを複数の宛先に送信する方法を説明しました。ADOT を使用する長所と短所、および Lambda 関数のコールドスタート待ち時間に与える影響を強調し、コールドスタート時間を管理するためのベストプラクティスを推奨しました。これらのベストプラクティスを採用することで、アプリケーションに一度だけインストルメンテーションを行えば、ベンダーに依存せずにログ、メトリクス、トレースを複数のモニタリングソリューションに送信できます。

さらに深く学習したい場合は、[AWS One Observability Workshop](https://catalog.workshops.aws/observability/en-US) の AWS 管理オープンソースオブザーバビリティモジュールを実践することを強くお勧めします。
