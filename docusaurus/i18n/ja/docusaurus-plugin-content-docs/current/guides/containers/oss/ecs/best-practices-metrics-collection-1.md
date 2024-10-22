# ECS クラスターで AWS Distro for OpenTelemetry を使用してシステムメトリクスを収集する
[AWS Distro for OpenTelemetry](https://aws-otel.github.io/docs/introduction) (ADOT) は、[OpenTelemetry](https://opentelemetry.io/) プロジェクトの安全で AWS がサポートする配布版です。ADOT を使用すると、複数のソースからテレメトリデータを収集し、関連付けられたメトリクス、トレース、ログを複数のモニタリングソリューションに送信できます。ADOT は Amazon ECS クラスターに 2 つの異なるパターンで展開できます。

## ADOT コレクターのデプロイパターン
1. サイドカーパターンでは、ADOT コレクターがクラスター内の各タスクで実行され、そのタスク内のアプリケーションコンテナからのみテレメトリデータを処理します。このデプロイパターンは、コレクターが Amazon ECS の [Task Metadata Endpoint](https://docs.aws.amazon.com/ja_jp/AmazonECS/latest/developerguide/task-metadata-endpoint.html) からタスクメタデータを読み取り、それらからリソース使用量メトリクス (CPU、メモリ、ネットワーク、ディスクなど) を生成する必要がある場合にのみ必要です。
![ADOT アーキテクチャ](../../../../images/ADOT-sidecar.png)

2. 中央コレクターパターンでは、単一の ADOT コレクターインスタンスがクラスターにデプロイされ、クラスター上で実行されているすべてのタスクからテレメトリデータを処理します。これは最も一般的に使用されるデプロイパターンです。コレクターは、REPLICA または DAEMON サービススケジューラー戦略を使用してデプロイされます。
![ADOT アーキテクチャ](../../../../images/ADOT-central.png)

ADOT コレクターのアーキテクチャにはパイプラインという概念があります。単一のコレクターに複数のパイプラインを含めることができます。各パイプラインは、メトリクス、トレース、ログの 3 種類のテレメトリデータのうち 1 つを処理するために専用されています。各種類のテレメトリデータに対して複数のパイプラインを構成できます。この柔軟なアーキテクチャにより、単一のコレクターが複数のオブザーバビリティエージェントの役割を果たすことができ、それらをクラスターにデプロイする必要がなくなります。これにより、クラスター上のオブザーバビリティエージェントの展開フットプリントが大幅に削減されます。パイプラインを構成するコレクターの主要コンポーネントは、Receiver、Processor、Exporter の 3 つのカテゴリにグループ化されています。Extensions と呼ばれる二次的なコンポーネントは、コレクターに追加できる機能を提供しますが、パイプラインの一部ではありません。

info
    Receiver、Processor、Exporter、Extensions の詳細については、OpenTelemetry の[ドキュメント](https://opentelemetry.io/docs/collector/configuration/#basics)を参照してください。


## ECS タスクメトリクスの収集のための ADOT コレクターのデプロイ

ECS タスクレベルでリソース使用率メトリクスを収集するには、ADOT コレクターをサイドカーパターンを使用してタスク定義で次のように展開する必要があります。コレクターに使用されるコンテナイメージには、いくつかのパイプラインコンフィギュレーションがバンドルされています。要件に基づいて 1 つを選択し、コンテナ定義の *command* セクションでコンフィギュレーションファイルのパスを指定できます。この値を `--config=/etc/ecs/container-insights/otel-task-metrics-config.yaml` に設定すると、[パイプラインコンフィギュレーション](https://github.com/aws-observability/aws-otel-collector/blob/main/config/ecs/container-insights/otel-task-metrics-config.yaml) が使用され、リソース使用率メトリクスとコレクターと同じタスク内の他のコンテナからのトレースが収集され、Amazon CloudWatch と AWS X-Ray に送信されます。具体的には、コレクターは [AWS ECS Container Metrics Receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/awsecscontainermetricsreceiver) を使用して、[Amazon ECS Task Metadata Endpoint](https://docs.aws.amazon.com/ja_jp/AmazonECS/latest/developerguide/task-metadata-endpoint-v4.html) からタスクメタデータとdocker統計を読み取り、それらからリソース使用率メトリクス (CPU、メモリ、ネットワーク、ディスクなど) を生成します。

```javascript
{
    "family":"AdotTask",
    "taskRoleArn":"arn:aws:iam::123456789012:role/ECS-ADOT-Task-Role",
    "executionRoleArn":"arn:aws:iam::123456789012:role/ECS-Task-Execution-Role",
    "networkMode":"awsvpc",
    "containerDefinitions":[
       {
          "name":"application-container",
          "image":"..."
       },
       {
          "name":"aws-otel-collector",
          "image":"public.ecr.aws/aws-observability/aws-otel-collector:latest",
          "cpu":512,
          "memory":1024,
          "command": [
            "--config=/etc/ecs/container-insights/otel-task-metrics-config.yaml"
          ],          
          "portMappings":[
             {
                "containerPort":2000,
                "protocol":"udp"
             }
          ],             
          "essential":true
       }
    ],
    "requiresCompatibilities":[
       "EC2"
    ],
    "cpu":"1024",
    "memory":"2048"
 }
```

info
    ADOT コレクターが Amazon ECS クラスターにデプロイされるときに使用する IAM タスクロールとタスク実行ロールの設定の詳細については、[ドキュメント](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/deploy-container-insights-ECS-adot.html) を参照してください。


info
    [AWS ECS Container Metrics Receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/awsecscontainermetricsreceiver) は、ECS Task Metadata Endpoint V4 でのみ動作します。プラットフォームバージョン 1.4.0 以降の Fargate 上の Amazon ECS タスクと、少なくとも 1.39.0 バージョンの Amazon ECS コンテナエージェントを実行している Amazon EC2 上の Amazon ECS タスクは、このレシーバーを利用できます。詳細については、[Amazon ECS Container Agent Versions](https://docs.aws.amazon.com/ja_jp/AmazonECS/latest/developerguide/ecs-agent-versions.html) を参照してください。


デフォルトの [パイプラインコンフィギュレーション](https://github.com/aws-observability/aws-otel-collector/blob/main/config/ecs/container-insights/otel-task-metrics-config.yaml) に示されているように、コレクターのパイプラインは最初に [Filter Processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/filterprocessor) を使用して、[CPU、メモリ、ネットワーク、ディスク使用率に関連するメトリクスのサブセット](https://github.com/aws-observability/aws-otel-collector/blob/09d59966404c2928aaaf6920f27967a84d898254/config/ecs/container-insights/otel-task-metrics-config.yaml#L25) をフィルタリングします。次に、[Metrics Transform Processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/metricstransformprocessor) を使用して、[一連の変換](https://github.com/aws-observability/aws-otel-collector/blob/09d59966404c2928aaaf6920f27967a84d898254/config/ecs/container-insights/otel-task-metrics-config.yaml#L39) を実行し、これらのメトリクスの名前を変更し、属性を更新します。最後に、メトリクスは [Amazon CloudWatch EMF Exporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/awsemfexporter) を使用して、パフォーマンスログイベントとして CloudWatch に送信されます。このデフォルトの設定を使用すると、CloudWatch 名前空間 *ECS/ContainerInsights* の下で次のリソース使用率メトリクスが収集されます。

- MemoryUtilized
- MemoryReserved
- CpuUtilized
- CpuReserved
- NetworkRxBytes
- NetworkTxBytes
- StorageReadBytes
- StorageWriteBytes

info
    これらは、[Container Insights for Amazon ECS で収集されるメトリクス](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/Container-Insights-metrics-ECS.html) と同じものであり、クラスターまたはアカウントレベルで Container Insights を有効にすると、CloudWatch で簡単に利用できるようになります。したがって、ECS リソース使用率メトリクスを CloudWatch で収集するには、Container Insights を有効にすることが推奨されます。


AWS ECS Container Metrics Receiver は、Amazon ECS Task Metadata Endpoint から読み取った 52 種類のユニークなメトリクスを出力します。レシーバーが収集するメトリクスの完全なリストは[こちら](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/awsecscontainermetricsreceiver#available-metrics)に文書化されています。これらすべてを希望の宛先に送信する必要はないかもしれません。ECS リソース使用率メトリクスをより明示的に制御したい場合は、カスタムパイプラインコンフィギュレーションを作成し、利用可能なメトリクスをプロセッサ/トランスフォーマーの選択でフィルタリングおよび変換し、エクスポーターの選択に基づいて宛先に送信できます。ECS タスクレベルのメトリクスをキャプチャするためのパイプラインコンフィギュレーションの[追加の例](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/awsecscontainermetricsreceiver#full-configuration-examples)については、ドキュメントを参照してください。

カスタムパイプラインコンフィギュレーションを使用したい場合は、以下のタスク定義を使用し、サイドカーパターンでコレクターをデプロイできます。ここでは、コレクターパイプラインの設定が AWS SSM Parameter Store の *otel-collector-config* という名前のパラメーターから読み込まれます。

note
    SSM Parameter Store パラメーター名は、AOT_CONFIG_CONTENT という名前の環境変数を介してコレクターに公開する必要があります。


```javascript
{
    "family":"AdotTask",
    "taskRoleArn":"arn:aws:iam::123456789012:role/ECS-ADOT-Task-Role",
    "executionRoleArn":"arn:aws:iam::123456789012:role/ECS-Task-Execution-Role",
    "networkMode":"awsvpc",
    "containerDefinitions":[
       {
          "name":"application-container",
          "image":"..."
       },        
       {
          "name":"aws-otel-collector",
          "image":"public.ecr.aws/aws-observability/aws-otel-collector:latest",
          "cpu":512,
          "memory":1024,
          "secrets":[
             {
                "name":"AOT_CONFIG_CONTENT",
                "valueFrom":"arn:aws:ssm:us-east-1:123456789012:parameter/otel-collector-config"
             }
          ],          
          "portMappings":[
             {
                "containerPort":2000,
                "protocol":"udp"
             }
          ],             
          "essential":true
       }
    ],
    "requiresCompatibilities":[
       "EC2"
    ],
    "cpu":"1024",
    "memory":"2048"
 }
```

## ECS コンテナインスタンスのメトリクス収集のための ADOT Collector のデプロイ

ECS クラスターから EC2 インスタンスレベルのメトリクスを収集するには、以下に示すように ADOT Collector をタスク定義としてデプロイできます。デーモンサービススケジューラー戦略を使用してデプロイする必要があります。コンテナイメージにバンドルされたパイプライン構成を選択できます。コンテナ定義の *command* セクションでの構成ファイルのパスは `--config=/etc/ecs/otel-instance-metrics-config.yaml` に設定する必要があります。Collector は [AWS Container Insights Receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/awscontainerinsightreceiver#aws-container-insights-receiver) を使用して、CPU、メモリ、ディスク、ネットワークなど、さまざまなリソースの EC2 インスタンスレベルのインフラストラクチャメトリクスを収集します。メトリクスは [Amazon CloudWatch EMF Exporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/awsemfexporter) を使用して、パフォーマンスログイベントとして CloudWatch に送信されます。この構成での Collector の機能は、EC2 上でホストされている Amazon ECS クラスターに CloudWatch エージェントをデプロイする機能と同等です。

info
    EC2 インスタンスレベルのメトリクスを収集するための ADOT Collector のデプロイは、AWS Fargate 上の ECS クラスターではサポートされていません。


```javascript
{
    "family":"AdotTask",
    "taskRoleArn":"arn:aws:iam::123456789012:role/ECS-ADOT-Task-Role",
    "executionRoleArn":"arn:aws:iam::123456789012:role/ECS-Task-Execution-Role",
    "networkMode":"awsvpc",
    "containerDefinitions":[
       {
          "name":"application-container",
          "image":"..."
       },
       {
          "name":"aws-otel-collector",
          "image":"public.ecr.aws/aws-observability/aws-otel-collector:latest",
          "cpu":512,
          "memory":1024,
          "command": [
            "--config=/etc/ecs/otel-instance-metrics-config.yaml"
          ],          
          "portMappings":[
             {
                "containerPort":2000,
                "protocol":"udp"
             }
          ],             
          "essential":true
       }
    ],
    "requiresCompatibilities":[
       "EC2"
    ],
    "cpu":"1024",
    "memory":"2048"
 }
```
