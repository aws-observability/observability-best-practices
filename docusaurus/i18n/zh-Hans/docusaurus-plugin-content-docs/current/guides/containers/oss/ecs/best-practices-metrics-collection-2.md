# 在 ECS 集群中使用 AWS Distro for OpenTelemetry 收集服务 metrics
## 使用默认配置部署 ADOT Collector
ADOT collector 可以使用如下所示的任务定义以 sidecar 模式部署。collector 使用的容器镜像捆绑了两个 collector pipeline 配置，可在容器定义的 *command* 部分指定。将此值设置为 `--config=/etc/ecs/ecs-default-config.yaml` 将使用一个 [pipeline 配置](https://github.com/aws-observability/aws-otel-collector/blob/main/config/ecs/ecs-default-config.yaml)，该配置将从与 collector 在同一任务中运行的其他容器收集应用程序 metrics 和 traces，并将它们发送到 Amazon CloudWatch 和 AWS X-Ray。具体来说，collector 使用 [OpenTelemetry Protocol (OTLP) Receiver](https://github.com/open-telemetry/opentelemetry-collector/tree/main/receiver/otlpreceiver) 接收由 OpenTelemetry SDK 检测的应用程序发送的 metrics，以及 [StatsD Receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/statsdreceiver) 收集 StatsD metrics。此外，它使用 [AWS X-ray Receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/awsxrayreceiver) 从使用 AWS X-Ray SDK 检测的应用程序收集 traces。

:::info
    参阅[文档](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/deploy-container-insights-ECS-adot.html)了解有关设置 ADOT collector 在 Amazon ECS 集群上部署时使用的 IAM 任务角色和任务执行角色的详情。
:::

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
## 部署 ADOT Collector 用于 Prometheus metrics 收集
要使用中心 collector 模式部署 ADOT，使用与默认配置不同的 pipeline，可以使用以下任务定义。这里，collector pipeline 的配置从 AWS SSM Parameter Store 中名为 *otel-collector-config* 的参数加载。collector 使用 REPLICA 服务调度策略启动。

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

:::note
    SSM Parameter Store 参数名必须使用名为 AOT_CONFIG_CONTENT 的环境变量暴露给 collector。
    当使用 ADOT collector 从应用程序收集 Prometheus metrics 并使用 REPLICA 服务调度策略部署时，确保将副本数设置为 1。部署多个 collector 副本将导致目标目的地中 metrics 数据的不正确表示。
:::

以下配置使 ADOT collector 能够使用 [Prometheus Receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/prometheusreceiver) 从集群中的服务收集 Prometheus metrics。该 receiver 旨在至少作为 Prometheus 服务器的直接替代品。要使用此 receiver 收集 metrics，您需要一种发现要抓取的目标服务集的机制。该 receiver 支持使用数十种受支持的[服务发现机制](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#scrape_config)进行静态和动态目标发现。

由于 Amazon ECS 没有任何内置的服务发现机制，collector 依赖 Prometheus 对基于文件的目标发现的支持。要设置 Prometheus receiver 的基于文件的目标发现，collector 使用 [Amazon ECS Observer](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/extension/observer/ecsobserver/README.md) 扩展。该扩展使用 ECS/EC2 API 从所有运行的任务中发现 Prometheus 抓取目标，并根据配置中 *ecs_observer/task_definitions* 部分列出的服务名称、任务定义和容器标签进行过滤。所有发现的目标写入 *result_file* 字段指定的文件中，该文件位于挂载到 ADOT collector 容器的文件系统上。随后，Prometheus receiver 从此文件中列出的目标抓取 metrics。

### 将 metrics 数据发送到 Amazon Managed Prometheus 工作区
Prometheus Receiver 收集的 metrics 可以使用 collector pipeline 中的 [Prometheus Remote Write Exporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/prometheusremotewriteexporter) 发送到 Amazon Managed Prometheus 工作区，如下面配置的 *exporters* 部分所示。该 exporter 配置了工作区的 remote write URL，并使用 HTTP POST 请求发送 metrics 数据。它使用内置的 AWS Signature Version 4 认证器对发送到工作区的请求进行签名。

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

### 将 metrics 数据发送到 Amazon CloudWatch
或者，可以使用 collector pipeline 中的 [Amazon CloudWatch EMF Exporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/awsemfexporter) 将 metrics 数据发送到 Amazon CloudWatch，如下面配置的 *exporters* 部分所示。此 exporter 将 metrics 数据作为性能日志事件发送到 CloudWatch。exporter 中的 *metric_declaration* 字段用于指定要生成的嵌入 metric 格式的日志数组。以下配置将仅为名为 *http_requests_total* 的 metric 生成日志事件。使用此数据，CloudWatch 将在 CloudWatch 命名空间 *ECS/ContainerInsights/Prometheus* 下创建 metric *http_requests_total*，维度为 *ClusterName*、*ServiceName* 和 *TaskDefinitionFamily*。


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
