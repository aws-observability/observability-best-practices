# AWS Distro for OpenTelemetry를 사용한 ECS 클러스터의 서비스 메트릭 수집
## 기본 구성으로 ADOT Collector 배포
아래와 같은 태스크 정의를 사용하여 사이드카 패턴으로 ADOT Collector를 배포할 수 있습니다. 컬렉터에 사용되는 컨테이너 이미지에는 컨테이너 정의의 *command* 섹션에서 지정할 수 있는 두 가지 컬렉터 파이프라인 구성이 번들되어 있습니다. 이 값을 `--config=/etc/ecs/ecs-default-config.yaml`로 설정하면 컬렉터와 동일한 태스크 내에서 실행 중인 다른 컨테이너에서 애플리케이션 메트릭과 트레이스를 수집하여 Amazon CloudWatch와 AWS X-Ray로 전송하는 [파이프라인 구성](https://github.com/aws-observability/aws-otel-collector/blob/main/config/ecs/ecs-default-config.yaml)을 사용합니다. 구체적으로, 컬렉터는 OpenTelemetry SDK로 계측된 애플리케이션에서 전송한 메트릭을 수신하기 위한 [OpenTelemetry Protocol(OTLP) Receiver](https://github.com/open-telemetry/opentelemetry-collector/tree/main/receiver/otlpreceiver)와 StatsD 메트릭을 수집하기 위한 [StatsD Receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/statsdreceiver)를 사용합니다. 추가적으로 AWS X-Ray SDK로 계측된 애플리케이션에서 트레이스를 수집하기 위한 [AWS X-ray Receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/awsxrayreceiver)를 사용합니다.

:::info
    Amazon ECS 클러스터에 배포할 때 ADOT Collector가 사용하는 IAM 태스크 역할과 태스크 실행 역할 설정에 대한 자세한 내용은 [문서](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/deploy-container-insights-ECS-adot.html)를 참조하세요.
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
## Prometheus 메트릭 수집을 위한 ADOT Collector 배포
기본 구성과 다른 파이프라인으로 중앙 컬렉터 패턴으로 ADOT를 배포하려면 아래 표시된 태스크 정의를 사용할 수 있습니다. 여기서 컬렉터 파이프라인의 구성은 AWS SSM Parameter Store의 *otel-collector-config*이라는 파라미터에서 로드됩니다. 컬렉터는 REPLICA 서비스 스케줄러 전략을 사용하여 시작됩니다.

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
    SSM Parameter Store 파라미터 이름은 AOT_CONFIG_CONTENT라는 환경 변수를 사용하여 컬렉터에 노출되어야 합니다.
    애플리케이션에서 Prometheus 메트릭 수집을 위해 ADOT Collector를 사용하고 REPLICA 서비스 스케줄러 전략으로 배포할 때, 레플리카 수를 1로 설정해야 합니다. 컬렉터의 레플리카를 1개 이상 배포하면 대상 목적지에서 메트릭 데이터가 부정확하게 표현됩니다.
:::

아래 구성은 [Prometheus Receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/prometheusreceiver)를 사용하여 클러스터의 서비스에서 Prometheus 메트릭을 수집하도록 ADOT Collector를 활성화합니다. 수신기는 최소한 Prometheus 서버의 드롭인 대체제로 설계되었습니다. 이 수신기로 메트릭을 수집하려면 스크래핑할 대상 서비스 세트를 검색하는 메커니즘이 필요합니다. 수신기는 수십 가지의 지원되는 [서비스 검색 메커니즘](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#scrape_config)을 사용하여 스크래핑 대상의 정적 및 동적 검색을 모두 지원합니다.

Amazon ECS에는 내장된 서비스 검색 메커니즘이 없으므로 컬렉터는 Prometheus의 파일 기반 대상 검색을 활용합니다. 파일 기반 대상 검색을 위해 Prometheus 수신기를 설정하려면 컬렉터는 [Amazon ECS Observer](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/extension/observer/ecsobserver/README.md) 확장을 활용합니다. 이 확장은 ECS/EC2 API를 사용하여 실행 중인 모든 태스크에서 Prometheus 스크래핑 대상을 검색하고 구성의 *ecs_observer/task_definitions* 섹션에 나열된 서비스 이름, 태스크 정의, 컨테이너 레이블을 기반으로 필터링합니다. 검색된 모든 대상은 ADOT Collector 컨테이너에 마운트된 파일 시스템의 *result_file* 필드에 지정된 파일에 기록됩니다. 이후 Prometheus 수신기는 이 파일에 나열된 대상에서 메트릭을 스크래핑합니다.

### Amazon Managed Prometheus 작업 공간으로 메트릭 데이터 전송
Prometheus Receiver가 수집한 메트릭은 아래 구성의 *exporters* 섹션에 표시된 대로 컬렉터 파이프라인의 [Prometheus Remote Write Exporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/prometheusremotewriteexporter)를 사용하여 Amazon Managed Prometheus 작업 공간으로 전송할 수 있습니다. 내보내기는 작업 공간의 원격 쓰기 URL로 구성되며 HTTP POST 요청을 사용하여 메트릭 데이터를 전송합니다. 내장된 AWS Signature Version 4 인증기를 사용하여 작업 공간으로 전송되는 요청에 서명합니다.

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

### Amazon CloudWatch로 메트릭 데이터 전송
또는 아래 구성의 *exporters* 섹션에 표시된 대로 컬렉터 파이프라인의 [Amazon CloudWatch EMF Exporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/awsemfexporter)를 사용하여 메트릭 데이터를 Amazon CloudWatch로 전송할 수 있습니다. 이 내보내기는 메트릭 데이터를 성능 로그 이벤트로 CloudWatch에 전송합니다. 내보내기의 *metric_declaration* 필드는 생성할 임베디드 메트릭 형식 로그의 배열을 지정하는 데 사용됩니다. 아래 구성은 *http_requests_total*이라는 메트릭에 대해서만 로그 이벤트를 생성합니다. 이 데이터를 사용하여 CloudWatch는 *ClusterName*, *ServiceName*, *TaskDefinitionFamily* 차원으로 CloudWatch 네임스페이스 *ECS/ContainerInsights/Prometheus* 아래에 *http_requests_total* 메트릭을 생성합니다.


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
