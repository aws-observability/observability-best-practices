# ECS クラスターで AWS Distro for OpenTelemetry を使用してサービスメトリクスを収集する

## デフォルト設定で ADOT コレクターをデプロイする
ADOT コレクターは、サイドカーパターンを使用して、以下に示すようなタスク定義を使ってデプロイできます。コレクターに使用されるコンテナイメージには、2 つのコレクタパイプラインの設定が同梱されており、コンテナ定義の *command* セクションで指定できます。この値 `--config=/etc/ecs/ecs-default-config.yaml` を設定すると、[パイプライン設定](https://github.com/aws-observability/aws-otel-collector/blob/main/config/ecs/ecs-default-config.yaml) が使用され、コレクターと同じタスク内で実行されている他のコンテナからアプリケーションのメトリクスとトレースを収集し、Amazon CloudWatch と AWS X-Ray に送信します。具体的には、コレクターは OpenTelemetry SDK で計装されたアプリケーションから送信されるメトリクスを受信する [OpenTelemetry プロトコル (OTLP) レシーバー](https://github.com/open-telemetry/opentelemetry-collector/tree/main/receiver/otlpreceiver) と、StatsD メトリクスを収集する [StatsD レシーバー](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/statsdreceiver) を使用します。さらに、AWS X-Ray SDK で計装されたアプリケーションからトレースを収集する [AWS X-Ray レシーバー](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/awsxrayreceiver) を使用します。

info
    Amazon ECS クラスターに ADOT コレクターをデプロイする際に使用する IAM タスクロールとタスク実行ロールの設定については、[ドキュメント](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/deploy-container-insights-ECS-adot.html) を参照してください。


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

## Prometheus メトリクスの収集のための ADOT Collector のデプロイ
デフォルトの設定とは異なるパイプラインを使用して、ADOT を中央コレクターパターンでデプロイするには、以下のタスク定義を使用できます。ここでは、コレクターパイプラインの設定が AWS SSM Parameter Store の *otel-collector-config* という名前のパラメーターから読み込まれます。コレクターは REPLICA サービススケジューラー戦略を使用して起動されます。

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

note
    SSM Parameter Store のパラメーター名は、AOT_CONFIG_CONTENT という名前の環境変数を使用してコレクターに公開する必要があります。
    Prometheus メトリクスの収集に ADOT コレクターを使用し、REPLICA サービススケジューラー戦略でデプロイする場合は、レプリカ数を 1 に設定してください。コレクターのレプリカを 1 つ以上デプロイすると、ターゲット宛先でのメトリクスデータの表現が正しくなくなります。


以下の設定により、ADOT コレクターは [Prometheus Receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/prometheusreceiver) を使用してクラスター内のサービスから Prometheus メトリクスを収集できるようになります。このレシーバーは、Prometheus サーバーの最小限の置き換えとして意図されています。このレシーバーでメトリクスを収集するには、スクレイピングするターゲットサービスのセットを検出するメカニズムが必要です。レシーバーは、サポートされている数十の [サービス検出メカニズム](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#scrape_config) のいずれかを使用して、スクレイピングターゲットの静的および動的な検出をサポートしています。

Amazon ECS には組み込みのサービス検出メカニズムがないため、コレクターは Prometheus のファイルベースのターゲット検出サポートに依存しています。ファイルベースのターゲット検出のための Prometheus レシーバーをセットアップするため、コレクターは [Amazon ECS Observer](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/extension/observer/ecsobserver/README.md) 拡張機能を利用しています。この拡張機能は ECS/EC2 API を使用して、実行中のすべてのタスクから Prometheus スクレイピングターゲットを検出し、設定の *ecs_observer/task_definitions* セクションにリストされているサービス名、タスク定義、コンテナラベルに基づいてフィルタリングします。検出されたすべてのターゲットは、ADOT コレクターコンテナにマウントされているファイルシステム上の *result_file* フィールドで指定されたファイルに書き込まれます。その後、Prometheus レシーバーはこのファイルに記載されているターゲットからメトリクスをスクレイピングします。

### Amazon Managed Prometheus ワークスペースへのメトリクスデータの送信
Prometheus Receiver によって収集されたメトリクスは、コレクタパイプラインの *exporters* セクションに示されているように、[Prometheus Remote Write Exporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/prometheusremotewriteexporter) を使用して Amazon Managed Prometheus ワークスペースに送信できます。エクスポータは、ワークスペースのリモートライトURLで構成され、HTTPのPOSTリクエストを使用してメトリクスデータを送信します。組み込みのAWS Signature Version 4認証機構を利用して、ワークスペースに送信されるリクエストに署名します。

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
あるいは、コレクタパイプラインの *exporters* セクションに示されているように、[Amazon CloudWatch EMF Exporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/awsemfexporter) を使用して、メトリクスデータを Amazon CloudWatch に送信することができます。このエクスポータは、メトリクスデータを CloudWatch にパフォーマンスログイベントとして送信します。エクスポータの *metric_declaration* フィールドは、生成される埋め込みメトリクス形式のログの配列を指定するために使用されます。以下の構成では、*http_requests_total* という名前のメトリクスに対してのみログイベントが生成されます。このデータを使用して、CloudWatch は *ECS/ContainerInsights/Prometheus* という CloudWatch 名前空間の下に *ClusterName*、*ServiceName*、*TaskDefinitionFamily* というディメンションを持つ *http_requests_total* メトリクスを作成します。

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
