# ECS クラスターで AWS Distro for OpenTelemetry を使用したサービスメトリクスの収集

## ADOT Collector のデフォルト設定でのデプロイ

ADOT Collector は、以下に示すタスク定義を使用してサイドカーパターンでデプロイできます。Collector に使用されるコンテナイメージには、コンテナ定義の *command* セクションで指定できる 2 つの Collector パイプライン構成がバンドルされています。この値を `--config=/etc/ecs/ecs-default-config.yaml` に設定すると、Collector と同じタスク内で実行されている他のコンテナからのアプリケーションメトリクスとトレースを収集し、Amazon CloudWatch と AWS X-Ray に送信する[パイプライン構成](https://github.com/aws-observability/aws-otel-collector/blob/main/config/ecs/ecs-default-config.yaml)が使用されます。具体的には、Collector は OpenTelemetry SDK で計装されたアプリケーションから送信されたメトリクスを受信するために [OpenTelemetry Protocol (OTLP) Receiver](https://github.com/open-telemetry/opentelemetry-collector/tree/main/receiver/otlpreceiver) と、StatsD メトリクスを収集するための [StatsD Receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/statsdreceiver) を使用します。さらに、AWS X-Ray SDK で計装されたアプリケーションからトレースを収集する [AWS X-ray Receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/awsxrayreceiver) を使用します。

!!! info
    Amazon ECS クラスターにデプロイされた ADOT Collector が使用する IAM タスクロールとタスク実行ロールの設定についての詳細は、[ドキュメント](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/deploy-container-insights-ECS-adot.html)を参照してください。

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
            "--config=/etc/ecs/ecs-default-config.yaml"
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

## Prometheus メトリクス収集のための ADOT Collector のデプロイ

デフォルトの構成とは異なるパイプラインを使用して、セントラルコレクターパターンで ADOT をデプロイするには、以下のタスク定義を使用できます。ここでは、コレクターパイプラインの構成は、AWS SSM パラメータストアの *otel-collector-config* という名前のパラメータからロードされます。コレクターは REPLICA サービススケジューラー戦略を使用して起動されます。

```javascript
{
    "family":"AdotTask",
    "taskRoleArn":"arn:aws:iam::123456789012:role/ECS-ADOT-Task-Role",
    "executionRoleArn":"arn:aws:iam::123456789012:role/ECS-Task-Execution-Role",
    "networkMode":"awsvpc",
    "containerDefinitions":[
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

!!! important
    SSM パラメータストアのパラメータ名は、AOT_CONFIG_CONTENT という名前の環境変数を使用してコレクターに公開する必要があります。
    
!!! important
    アプリケーションからの Prometheus メトリクスの収集のために ADOT コレクターを使用し、REPLICA サービススケジューラー戦略でデプロイする場合は、レプリカの数を 1 に設定する必要があります。コレクターのレプリカを 2 つ以上デプロイすると、ターゲットの宛先でメトリクスデータの不正な表現が発生します。

以下の構成では、ADOT コレクターがクラスタ内のサービスから [Prometheus Receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/prometheusreceiver) を使用して Prometheus メトリクスを収集できるようになります。このレシーバーは、最小限 Prometheus サーバーのドロップイン置換を意図しています。このレシーバーを使用してメトリクスを収集するには、スクレイプするターゲットサービスのセットを検出するメカニズムが必要です。このレシーバーは、サポートされている数十の [サービス検出メカニズム](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#scrape_config) のいずれかを使用して、スクレイプターゲットの静的および動的検出の両方をサポートしています。

Amazon ECS には組み込みのサービス検出メカニズムがないため、コレクターは Prometheus のファイルベースのターゲット検出のサポートに依存しています。Prometheus レシーバーをターゲットのファイルベースの検出のために設定するには、コレクターは [Amazon ECS Observer](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/extension/observer/ecsobserver/README.md) 拡張機能を利用します。この拡張機能は ECS/EC2 API を使用して、実行中のすべてのタスクから Prometheus スクレイプターゲットを検出し、構成の *ecs_observer/task_definitions* セクションにリストされているサービス名、タスク定義、コンテナラベルに基づいてフィルタリングします。検出されたすべてのターゲットは、*result_file* フィールドで指定されたファイルに書き込まれます。このファイルは ADOT コレクターコンテナにマウントされたファイルシステム上に存在します。その後、Prometheus レシーバーはこのファイルにリストされているターゲットからメトリクスをスクレイプします。

### Amazon Managed Prometheus ワークスペースへのメトリクスデータの送信

Prometheus Receiver によって収集されたメトリクスは、以下の構成の *exporters* セクションで示されているように、コレクターパイプライン内の [Prometheus Remote Write Exporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/prometheusremotewriteexporter) を使用して、Amazon Managed Prometheus ワークスペースに送信できます。エクスポーターはワークスペースのリモートライト URL で構成され、メトリクスデータを HTTP POST リクエストを使用して送信します。リクエストに AWS Signature Version 4 認証を適用するために、組み込みの AWS Signature Version 4 認証機を利用します。

```yaml
extensions:
  health_check:
  sigv4auth:
    region: us-east-1
  ecs_observer:
    refresh_interval: 60s 
    cluster_name: 'ecs-ec2-cluster'
    cluster_region: us-east-1
    result_file: '/etc/ecs_sd_targets.yaml' 
    services:
      - name_pattern: '^WebAppService$'
    task_definitions:
      - job_name: "webapp-tasks"
        arn_pattern: '.*:task-definition/WebAppTask:[0-9]+'
        metrics_path: '/metrics'
        metrics_ports:
          - 3000

receivers:
  awsxray:
  prometheus:
    config:
      scrape_configs:
        - job_name: ecs_services
          file_sd_configs:
            - files:
                - '/etc/ecs_sd_targets.yaml'
              refresh_interval: 30s
          relabel_configs: 
            - source_labels: [ __meta_ecs_cluster_name ] 
              action: replace
              target_label: cluster
            - source_labels: [ __meta_ecs_service_name ] 
              action: replace
              target_label: service
            - source_labels: [ __meta_ecs_task_definition_family ] 
              action: replace
              target_label: taskdefinition       
            - source_labels: [ __meta_ecs_task_container_name ] 
              action: replace
              target_label: container                        

processors:
    filter/include:
      metrics:
        include:
          match_type: regexp
          metric_names:
            - ^http_requests_total$  

exporters:
  awsxray:
  prometheusremotewrite:
    endpoint: https://aps-workspaces.us-east-1.amazonaws.com/workspaces/WORKSPACE_ID/api/v1/remote_write
    auth:
      authenticator: sigv4auth
    resource_to_telemetry_conversion:
      enabled: true

service:
  extensions:
    - ecs_observer
    - health_check
    - sigv4auth
  pipelines:
    metrics:
      receivers: [prometheus]
      exporters: [prometheusremotewrite]       
    traces:
      receivers: [awsxray]
      exporters: [awsxray]       
```

### Amazon CloudWatch へのメトリクスデータの送信

あるいは、以下の構成の *exporters* セクションで示されているように、コレクターパイプラインで [Amazon CloudWatch EMF Exporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/awsemfexporter) を使用して、メトリクスデータを Amazon CloudWatch に送信することもできます。このエクスポーターは、メトリクスデータをパフォーマンスログイベントとして CloudWatch に送信します。エクスポーターの *metric_declaration* フィールドは、生成する必要がある埋め込みメトリクス形式のログの配列を指定するために使用されます。以下の構成では、*http_requests_total* という名前のメトリクスのログイベントのみが生成されます。このデータを使用すると、CloudWatch は *ClusterName*、*ServiceName*、*TaskDefinitionFamily* のディメンションを使用して、CloudWatch 名前空間 *ECS/ContainerInsights/Prometheus* の下にメトリクス *http_requests_total* を作成します。


```yaml
extensions:
  health_check:
  sigv4auth:
    region: us-east-1
  ecs_observer:
    refresh_interval: 60s 
    cluster_name: 'ecs-ec2-cluster'
    cluster_region: us-east-1
    result_file: '/etc/ecs_sd_targets.yaml' 
    services:
      - name_pattern: '^WebAppService$'
    task_definitions:
      - job_name: "webapp-tasks"
        arn_pattern: '.*:task-definition/WebAppTask:[0-9]+'
        metrics_path: '/metrics'
        metrics_ports:
          - 3000

receivers:
  awsxray:
  prometheus:
    config:
      global:
        scrape_interval: 15s
        scrape_timeout: 10s
      scrape_configs:
        - job_name: ecs_services
          file_sd_configs::
            - files:
                - '/etc/ecs_sd_targets.yaml'
          relabel_configs: 
            - source_labels: [ __meta_ecs_cluster_name ] 
              action: replace
              target_label: ClusterName
            - source_labels: [ __meta_ecs_service_name ] 
              action: replace
              target_label: ServiceName
            - source_labels: [ __meta_ecs_task_definition_family ] 
              action: replace
              target_label: TaskDefinitionFamily       
            - source_labels: [ __meta_ecs_task_container_name ] 
              action: replace
              target_label: container          

processors:
    filter/include:
      metrics:
        include:
          match_type: regexp
          metric_names:
            - ^http_requests_total$  

exporters:
  awsxray:
  awsemf:
    namespace: ECS/ContainerInsights/Prometheus
    log_group_name: '/aws/ecs/containerinsights/{ClusterName}/prometheus'
    dimension_rollup_option: NoDimensionRollup
    metric_declarations:
      - dimensions: [[ClusterName, ServiceName, TaskDefinitionFamily]]
        metric_name_selectors:
          - http_requests_total

service:
  extensions:
    - ecs_observer
    - health_check
    - sigv4auth
  pipelines:
    metrics:
      receivers: [prometheus]
      processors: [filter/include]
      exporters: [awsemf]       
    traces:
      receivers: [awsxray]
      exporters: [awsxray]       
```
