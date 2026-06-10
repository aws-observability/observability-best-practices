# AWS Distro for OpenTelemetry பயன்படுத்தி ECS கிளஸ்டரில் சர்வீஸ் மெட்ரிக்குகளை சேகரித்தல்
## இயல்பு கட்டமைப்புடன் ADOT Collector-ஐ டிப்ளாய் செய்தல்
ADOT collector-ஐ கீழே காட்டப்பட்டுள்ளபடி ஒரு டாஸ்க் டெஃபினிஷன் பயன்படுத்தி sidecar pattern-ல் டிப்ளாய் செய்யலாம். Collector-க்கு பயன்படுத்தப்படும் கண்டெய்னர் இமேஜ் இரண்டு collector pipeline கட்டமைப்புகளுடன் தொகுக்கப்பட்டுள்ளது, அவை கண்டெய்னர் டெஃபினிஷனின் *command* பிரிவில் குறிப்பிடலாம். இந்த மதிப்பை `--config=/etc/ecs/ecs-default-config.yaml` என அமைப்பது, collector-உடன் ஒரே டாஸ்க்கில் இயங்கும் மற்ற கண்டெய்னர்களிலிருந்து அப்ளிகேஷன் மெட்ரிக்குகளையும் ட்ரேஸ்களையும் சேகரித்து Amazon CloudWatch மற்றும் AWS X-Ray-க்கு அனுப்பும் [pipeline கட்டமைப்பை](https://github.com/aws-observability/aws-otel-collector/blob/main/config/ecs/ecs-default-config.yaml) பயன்படுத்தும். குறிப்பாக, collector ஒரு [OpenTelemetry Protocol (OTLP) Receiver](https://github.com/open-telemetry/opentelemetry-collector/tree/main/receiver/otlpreceiver)-ஐ பயன்படுத்தி OpenTelemetry SDK-களுடன் instrumented செய்யப்பட்ட அப்ளிகேஷன்களால் அனுப்பப்படும் மெட்ரிக்குகளை பெறுகிறது, அத்துடன் StatsD மெட்ரிக்குகளை சேகரிக்க ஒரு [StatsD Receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/statsdreceiver)-ஐயும் பயன்படுத்துகிறது. கூடுதலாக, AWS X-Ray SDK-யுடன் instrumented செய்யப்பட்ட அப்ளிகேஷன்களிலிருந்து ட்ரேஸ்களை சேகரிக்க ஒரு [AWS X-ray Receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/awsxrayreceiver)-ஐ பயன்படுத்துகிறது.

:::info
    Amazon ECS கிளஸ்டரில் ADOT collector டிப்ளாய் செய்யும்போது பயன்படுத்தும் IAM task role மற்றும் task execution role அமைப்பது பற்றிய விவரங்களுக்கு [ஆவணத்தைப்](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/deploy-container-insights-ECS-adot.html) பார்க்கவும்.
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
## Prometheus மெட்ரிக்குகள் சேகரிப்புக்காக ADOT Collector-ஐ டிப்ளாய் செய்தல்
இயல்பு கட்டமைப்பிலிருந்து வேறுபட்ட pipeline-உடன் மையப்படுத்தப்பட்ட collector pattern-ல் ADOT-ஐ டிப்ளாய் செய்ய, கீழே காட்டப்பட்டுள்ள டாஸ்க் டெஃபினிஷன் பயன்படுத்தலாம். இங்கே, collector pipeline-இன் கட்டமைப்பு AWS SSM Parameter Store-ல் உள்ள *otel-collector-config* என்ற parameter-லிருந்து ஏற்றப்படுகிறது. Collector REPLICA சர்வீஸ் scheduler strategy பயன்படுத்தி தொடங்கப்படுகிறது.

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
    SSM Parameter Store parameter பெயர் AOT_CONFIG_CONTENT என்ற environment variable பயன்படுத்தி collector-க்கு வெளிப்படுத்தப்பட வேண்டும்.
    அப்ளிகேஷன்களிலிருந்து Prometheus மெட்ரிக்குகள் சேகரிப்புக்காக ADOT collector-ஐ பயன்படுத்தி REPLICA சர்வீஸ் scheduler strategy-யுடன் டிப்ளாய் செய்யும்போது, replica count-ஐ 1 ஆக அமைக்கவும். ஒன்றுக்கு மேற்பட்ட replica-க்களை டிப்ளாய் செய்வது இலக்கு இடத்தில் மெட்ரிக்குகள் தரவின் தவறான பிரதிநிதித்துவத்தை விளைவிக்கும்.
:::

கீழே காட்டப்பட்டுள்ள கட்டமைப்பு, கிளஸ்டரில் உள்ள சர்வீஸ்களிலிருந்து Prometheus மெட்ரிக்குகளை [Prometheus Receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/prometheusreceiver) பயன்படுத்தி சேகரிக்க ADOT collector-ஐ இயக்குகிறது. இந்த receiver Prometheus server-க்கு குறைந்தபட்சமாக ஒரு drop-in replacement ஆக இருக்க வடிவமைக்கப்பட்டுள்ளது. இந்த receiver-உடன் மெட்ரிக்குகளை சேகரிக்க, scrape செய்யப்பட வேண்டிய இலக்கு சர்வீஸ்களை கண்டறிவதற்கான ஒரு mechanism தேவை. Receiver ஆதரிக்கப்படும் பல [service-discovery mechanisms](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#scrape_config)-ல் ஒன்றைப் பயன்படுத்தி static மற்றும் dynamic target discovery இரண்டையும் ஆதரிக்கிறது.

Amazon ECS-ல் உள்ளமைந்த service discovery mechanism இல்லாததால், collector Prometheus-இன் file-based target discovery ஆதரவை நம்பியுள்ளது. File-based target discovery-க்கு Prometheus receiver-ஐ அமைக்க, collector [Amazon ECS Observer](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/extension/observer/ecsobserver/README.md) extension-ஐ பயன்படுத்துகிறது. இந்த extension ECS/EC2 API-ஐ பயன்படுத்தி இயங்கும் அனைத்து டாஸ்க்குகளிலிருந்தும் Prometheus scrape targets-ஐ கண்டறிந்து, கட்டமைப்பில் *ecs_observer/task_definitions* பிரிவின் கீழ் பட்டியலிடப்பட்ட சர்வீஸ் பெயர்கள், டாஸ்க் டெஃபினிஷன்கள் மற்றும் கண்டெய்னர் labels அடிப்படையில் அவற்றை வடிகட்டுகிறது. கண்டறியப்பட்ட அனைத்து targets-ம் *result_file* புலத்தால் குறிப்பிடப்பட்ட கோப்பில் எழுதப்படுகின்றன, இது ADOT collector கண்டெய்னருக்கு mount செய்யப்பட்ட file system-ல் உள்ளது. பின்னர், Prometheus receiver இந்த கோப்பில் பட்டியலிடப்பட்ட targets-லிருந்து மெட்ரிக்குகளை scrape செய்கிறது.

### Amazon Managed Prometheus workspace-க்கு மெட்ரிக்குகள் தரவை அனுப்புதல்
Prometheus Receiver-ஆல் சேகரிக்கப்பட்ட மெட்ரிக்குகளை, கீழே உள்ள கட்டமைப்பின் *exporters* பிரிவில் காட்டப்பட்டுள்ளபடி, collector pipeline-ல் [Prometheus Remote Write Exporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/prometheusremotewriteexporter) பயன்படுத்தி Amazon Managed Prometheus workspace-க்கு அனுப்பலாம். Exporter workspace-இன் remote write URL-உடன் கட்டமைக்கப்பட்டு HTTP POST requests பயன்படுத்தி மெட்ரிக்குகள் தரவை அனுப்புகிறது. Workspace-க்கு அனுப்பப்படும் requests-ஐ sign செய்ய உள்ளமைந்த AWS Signature Version 4 authenticator-ஐ பயன்படுத்துகிறது.

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

### Amazon CloudWatch-க்கு மெட்ரிக்குகள் தரவை அனுப்புதல்
மாற்றாக, கீழே உள்ள கட்டமைப்பின் *exporters* பிரிவில் காட்டப்பட்டுள்ளபடி, collector pipeline-ல் [Amazon CloudWatch EMF Exporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/awsemfexporter) பயன்படுத்தி மெட்ரிக்குகள் தரவை Amazon CloudWatch-க்கு அனுப்பலாம். இந்த exporter மெட்ரிக்குகள் தரவை CloudWatch-க்கு performance log events ஆக அனுப்புகிறது. Exporter-ல் உள்ள *metric_declaration* புலம் உருவாக்கப்பட வேண்டிய embedded metric format logs-இன் array-ஐ குறிப்பிட பயன்படுகிறது. கீழே உள்ள கட்டமைப்பு *http_requests_total* என்ற மெட்ரிக்குக்கு மட்டுமே log events உருவாக்கும். இந்த தரவைப் பயன்படுத்தி, CloudWatch *ECS/ContainerInsights/Prometheus* என்ற CloudWatch namespace-ன் கீழ் *ClusterName*, *ServiceName* மற்றும் *TaskDefinitionFamily* dimensions-உடன் *http_requests_total* மெட்ரிக்கை உருவாக்கும்.


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
