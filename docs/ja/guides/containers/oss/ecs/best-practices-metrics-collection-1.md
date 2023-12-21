# AWS Distro for OpenTelemetry を使用した ECS クラスターのシステムメトリクスの収集
[AWS Distro for OpenTelemetry](https://aws-otel.github.io/docs/introduction)(ADOT) は、[OpenTelemetry](https://opentelemetry.io/) プロジェクトの安全な AWS 対応ディストリビューションです。ADOT を使用すると、複数のソースからテレメトリデータを収集し、相関するメトリクス、トレース、ログを複数のモニタリングソリューションに送信できます。ADOT は、Amazon ECS クラスターに 2 つの異なるパターンでデプロイできます。

## ADOT Collector のデプロイメントパターン

1. サイドカーパターンでは、ADOT Collector がクラスタ内の各タスク内で実行され、そのタスク内のアプリケーションコンテナから収集したテレメトリデータのみを処理します。 このデプロイメントパターンは、コレクターが Amazon ECS の [Task Metadata Endpoint](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-metadata-endpoint.html) からタスクメタデータを読み取り、そこからリソース使用量メトリクス(CPU、メモリ、ネットワーク、ディスクなど)を生成する必要がある場合にのみ必要です。

![ADOT アーキテクチャ](../../../../images/ADOT-sidecar.png)

2. セントラルコレクターパターンでは、ADOT コレクターのシングルインスタンスがクラスター上にデプロイされ、クラスター上で実行されているすべてのタスクからのテレメトリデータを処理します。 これが最も一般的に使用されるデプロイメントパターンです。 コレクターは、REPLICA または DAEMON サービススケジューラー戦略を使用してデプロイされます。

![ADOT アーキテクチャ](../../../../images/ADOT-central.png)

ADOT Collector アーキテクチャにはパイプラインの概念があります。 単一のコレクターに複数のパイプラインを含めることができます。 各パイプラインは、メトリクス、トレース、ログの 3 つのテレメトリデータの種類のいずれかを処理するために専用されています。 各種テレメトリデータについて複数のパイプラインを構成できます。 この汎用性の高いアーキテクチャにより、複数の可観測性エージェントの役割を実行する単一のコレクターを配置できるため、そうでない場合はクラスター上にデプロイする必要があります。 これにより、クラスター上の可観測性エージェントのデプロイメントフットプリントが大幅に削減されます。 パイプラインを構成するコレクターの主要コンポーネントは、Receiver、Processor、Exporter の 3 つのカテゴリにグループ化されます。 拡張機能と呼ばれる二次コンポーネントは、コレクターに追加できる機能を提供しますが、パイプラインの一部ではありません。

!!! info
    Receiver、Processor、Exporter、Extensions の詳細な説明については、OpenTelemetry の [ドキュメント](https://opentelemetry.io/docs/collector/configuration/#basics) を参照してください。

## ECS タスクメトリクス収集のための ADOT Collector のデプロイ

ECS タスクレベルでリソース利用メトリクスを収集するには、以下に示すタスク定義を使用してサイドカー パターンで ADOT Collector をデプロイする必要があります。Collector に使用されるコンテナイメージには、いくつかのパイプライン構成がバンドルされています。要件に基づいてそれらのいずれかを選択し、コンテナ定義の *command* セクションで構成ファイルパスを指定できます。この値を `--config=/etc/ecs/container-insights/otel-task-metrics-config.yaml` に設定すると、Collector と同じタスク内の他のコンテナからリソース利用メトリクスとトレースを収集し、それらを Amazon CloudWatch と AWS X-Ray に送信する[パイプライン構成](https://github.com/aws-observability/aws-otel-collector/blob/main/config/ecs/container-insights/otel-task-metrics-config.yaml) が使用されます。具体的には、Collector は [Amazon ECS Task Metadata Endpoint](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-metadata-endpoint-v4.html) からタスクメタデータと docker 統計を読み取る [AWS ECS Container Metrics Receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/awsecscontainermetricsreceiver) を使用し、そこからリソース使用メトリクス(CPU、メモリ、ネットワーク、ディスクなど)を生成します。

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
!!! info
    Amazon ECS クラスターにデプロイされた ADOT Collector が使用する IAM タスクロールとタスク実行ロールの設定についての詳細は、[ドキュメント](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/deploy-container-insights-ECS-adot.html)を参照してください。
    
!!! info 
    [AWS ECS Container Metrics Receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/awsecscontainermetricsreceiver) は、ECS Task Metadata Endpoint V4 でのみ機能します。Fargate 上のバージョン 1.4.0 以降のプラットフォームを使用している Amazon ECS タスクと、バージョン 1.39.0 以降の Amazon ECS コンテナエージェントを実行している Amazon EC2 上の Amazon ECS タスクは、このレシーバーを利用できます。詳細については、[Amazon ECS Container Agent Versions](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-agent-versions.html) を参照してください。

デフォルトの[パイプライン構成](https://github.com/aws-observability/aws-otel-collector/blob/main/config/ecs/container-insights/otel-task-metrics-config.yaml)で見られるように、Collector のパイプラインは最初に CPU、メモリ、ネットワーク、ディスク使用量に関連する[一部のメトリクス](https://github.com/aws-observability/aws-otel-collector/blob/09d59966404c2928aaaf6920f27967a84d898254/config/ecs/container-insights/otel-task-metrics-config.yaml#L25)をフィルタリングする [Filter Processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/filterprocessor) を使用します。次に、これらのメトリクスの名前を変更し、その属性を更新する一連の [変換](https://github.com/aws-observability/aws-otel-collector/blob/09d59966404c2928aaaf6920f27967a84d898254/config/ecs/container-insights/otel-task-metrics-config.yaml#L39) を実行する [Metrics Transform Processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/metricstransformprocessor) を使用します。最後に、メトリクスは [Amazon CloudWatch EMF Exporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/awsemfexporter) を使用してパフォーマンスログイベントとして CloudWatch に送信されます。このデフォルトの構成を使用すると、CloudWatch 名前空間 *ECS/ContainerInsights* の下に次のリソース使用メトリクスが収集されます。

- MemoryUtilized
- MemoryReserved 
- CpuUtilized
- CpuReserved
- NetworkRxBytes
- NetworkTxBytes
- StorageReadBytes  
- StorageWriteBytes

!!! info
    これらは [Container Insights for Amazon ECS によって収集されるメトリクス](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-metrics-ECS.html)と同じであり、クラスターまたはアカウントレベルでコンテナインサイトを有効にすると CloudWatch で簡単に利用できるようになります。したがって、CloudWatch で ECS リソース使用メトリクスを収集するための推奨アプローチは、コンテナインサイトを有効にすることです。

AWS ECS Container Metrics Receiver は、Amazon ECS Task Metadata Endpoint から読み取った 52 の一意のメトリクスを発行します。レシーバーによって収集されるメトリクスの完全なリストは、[ここで文書化されています](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/awsecscontainermetricsreceiver#available-metrics)。すべてを希望の宛先に送信したくない場合があります。ECS リソース使用メトリクスをより明示的に制御したい場合は、使用可能なメトリクスを選択したプロセッサ/トランスフォーマーでフィルタリングおよび変換するカスタムパイプライン構成を作成し、エクスポーターの選択に基づいて宛先に送信できます。ECS タスクレベルのメトリクスをキャプチャするパイプライン構成の[追加の例](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/awsecscontainermetricsreceiver#full-configuration-examples)については、ドキュメントを参照してください。

カスタムパイプライン構成を使用する場合は、以下に示すタスク定義を使用して Collector をサイドカー パターンでデプロイできます。ここでは、Collector パイプラインの構成は、AWS SSM パラメータストアの *otel-collector-config* という名前のパラメータからロードされます。

!!! important
    SSM パラメータストアパラメータ名は、AOT_CONFIG_CONTENT という名前の環境変数を使用して Collector に公開する必要があります。


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

## ECS コンテナインスタンスメトリクス収集のための ADOT Collector のデプロイ

ECS クラスターから EC2 インスタンスレベルのメトリクスを収集するには、以下のようにタスク定義を使用して ADOT Collector をデプロイできます。デーモンサービススケジューラー戦略を使用してデプロイする必要があります。コンテナイメージにバンドルされているパイプライン構成を選択できます。コンテナ定義の *command* セクション内の構成ファイルパスは、`--config=/etc/ecs/otel-instance-metrics-config.yaml` に設定する必要があります。Collector は [AWS Container Insights Receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/awscontainerinsightreceiver#aws-container-insights-receiver) を使用して、CPU、メモリ、ディスク、ネットワークなどのリソースの EC2 インスタンスレベルのインフラストラクチャメトリクスを収集します。メトリクスは、[Amazon CloudWatch EMF Exporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/awsemfexporter) を使用してパフォーマンスログイベントとして CloudWatch に送信されます。この構成での Collector の機能は、EC2 でホストされる Amazon ECS クラスターに CloudWatch エージェントをデプロイすることと同等です。

!!! info
    EC2 インスタンスレベルのメトリクスの収集のための ADOT Collector のデプロイは、AWS Fargate で実行されている ECS クラスターではサポートされていません。

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
