# AWS Distro for OpenTelemetry ఉపయోగించి ECS క్లస్టర్‌లో సర్వీస్ మెట్రిక్స్ సేకరించడం
## డీఫాల్ట్ కాన్ఫిగరేషన్‌తో ADOT Collector డిప్లాయ్ చేయడం
ADOT collector ను క్రింద చూపిన విధంగా టాస్క్ డెఫినిషన్ ఉపయోగించి sidecar పాటర్న్‌తో డిప్లాయ్ చేయవచ్చు. Collector కోసం ఉపయోగించే కంటైనర్ ఇమేజ్ రెండు collector పైప్‌లైన్ కాన్ఫిగరేషన్‌లతో బండిల్ చేయబడింది, వాటిని కంటైనర్ డెఫినిషన్ యొక్క *command* సెక్షన్‌లో స్పెసిఫై చేయవచ్చు. ఈ విలువను `--config=/etc/ecs/ecs-default-config.yaml` గా సెట్ చేయడం వలన [పైప్‌లైన్ కాన్ఫిగరేషన్](https://github.com/aws-observability/aws-otel-collector/blob/main/config/ecs/ecs-default-config.yaml) ఉపయోగించబడుతుంది, ఇది collector తో సమానమైన టాస్క్‌లో రన్ అవుతున్న ఇతర కంటైనర్ల నుండి అప్లికేషన్ మెట్రిక్స్ మరియు ట్రేసెస్‌ను సేకరించి Amazon CloudWatch మరియు AWS X-Ray కు పంపుతుంది. ప్రత్యేకంగా, collector OpenTelemetry SDKలతో ఇన్‌స్ట్రుమెంట్ చేయబడిన అప్లికేషన్‌ల నుండి పంపబడిన మెట్రిక్స్‌ను స్వీకరించడానికి [OpenTelemetry Protocol (OTLP) Receiver](https://github.com/open-telemetry/opentelemetry-collector/tree/main/receiver/otlpreceiver) ను ఉపయోగిస్తుంది, అలాగే StatsD మెట్రిక్స్‌ను సేకరించడానికి [StatsD Receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/statsdreceiver) ను ఉపయోగిస్తుంది. అదనంగా, AWS X-Ray SDK తో ఇన్‌స్ట్రుమెంట్ చేయబడిన అప్లికేషన్‌ల నుండి ట్రేసెస్‌ను సేకరించడానికి [AWS X-ray Receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/awsxrayreceiver) ను ఉపయోగిస్తుంది.

:::info
    Amazon ECS క్లస్టర్‌లో ADOT collector డిప్లాయ్ చేసినప్పుడు ఉపయోగించే IAM టాస్క్ రోల్ మరియు టాస్క్ ఎక్జిక్యూషన్ రోల్ సెటప్ చేయడం గురించి వివరాల కోసం [డాక్యుమెంటేషన్](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/deploy-container-insights-ECS-adot.html) చూడండి.
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
## Prometheus మెట్రిక్స్ సేకరణ కోసం ADOT Collector డిప్లాయ్ చేయడం
డీఫాల్ట్ కాన్ఫిగరేషన్ కంటే భిన్నమైన పైప్‌లైన్‌తో, సెంట్రల్ collector పాటర్న్‌తో ADOT ను డిప్లాయ్ చేయడానికి, క్రింద చూపిన టాస్క్ డెఫినిషన్ ఉపయోగించవచ్చు. ఇక్కడ, collector పైప్‌లైన్ కాన్ఫిగరేషన్ AWS SSM Parameter Store లోని *otel-collector-config* అనే పారామీటర్ నుండి లోడ్ చేయబడుతుంది. Collector REPLICA సర్వీస్ షెడ్యూలర్ స్ట్రాటజీ ఉపయోగించి లాంచ్ చేయబడుతుంది.

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
    SSM Parameter Store పారామీటర్ పేరు AOT_CONFIG_CONTENT అనే ఎన్విరాన్‌మెంట్ వేరియబుల్ ఉపయోగించి collector కు ఎక్స్‌పోజ్ చేయాలి.
    Prometheus మెట్రిక్స్ సేకరణ కోసం ADOT collector ను అప్లికేషన్‌ల నుండి ఉపయోగించి REPLICA సర్వీస్ షెడ్యూలర్ స్ట్రాటజీతో డిప్లాయ్ చేసినప్పుడు, రెప్లికా కౌంట్ 1 గా సెట్ చేయండి. Collector యొక్క 1 కంటే ఎక్కువ రెప్లికాలను డిప్లాయ్ చేయడం వలన టార్గెట్ డెస్టినేషన్‌లో మెట్రిక్స్ డేటా యొక్క తప్పుడు ప్రాతినిధ్యం ఏర్పడుతుంది.
:::

క్రింద చూపిన కాన్ఫిగరేషన్ ADOT collector ను [Prometheus Receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/prometheusreceiver) ఉపయోగించి క్లస్టర్‌లోని సర్వీసుల నుండి Prometheus మెట్రిక్స్ సేకరించడానికి అనుమతిస్తుంది. ఈ receiver Prometheus సర్వర్‌కు కనిష్ట drop-in రీప్లేస్‌మెంట్‌గా ఉద్దేశించబడింది. ఈ receiver తో మెట్రిక్స్ సేకరించడానికి, స్క్రేప్ చేయవలసిన టార్గెట్ సర్వీసుల సెట్‌ను కనుగొనడానికి ఒక మెకానిజం అవసరం. Receiver డజన్ల కొద్దీ మద్దతు ఉన్న [సర్వీస్-డిస్కవరీ మెకానిజమ్‌లను](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#scrape_config) ఉపయోగించి స్టాటిక్ మరియు డైనమిక్ టార్గెట్ డిస్కవరీ రెండింటినీ సపోర్ట్ చేస్తుంది.

Amazon ECS కు ఏదైనా అంతర్నిర్మిత సర్వీస్ డిస్కవరీ మెకానిజం లేనందున, collector Prometheus యొక్క ఫైల్-ఆధారిత టార్గెట్ డిస్కవరీ సపోర్ట్‌పై ఆధారపడుతుంది. ఫైల్-ఆధారిత టార్గెట్ డిస్కవరీ కోసం Prometheus receiver ను సెటప్ చేయడానికి, collector [Amazon ECS Observer](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/extension/observer/ecsobserver/README.md) extension ను ఉపయోగిస్తుంది. ఈ extension అన్ని రన్నింగ్ టాస్క్‌ల నుండి Prometheus స్క్రేప్ టార్గెట్‌లను కనుగొనడానికి ECS/EC2 API ను ఉపయోగిస్తుంది మరియు కాన్ఫిగరేషన్‌లోని *ecs_observer/task_definitions* సెక్షన్‌లో జాబితా చేయబడిన సర్వీస్ పేర్లు, టాస్క్ డెఫినిషన్‌లు మరియు కంటైనర్ లేబుల్‌ల ఆధారంగా వాటిని ఫిల్టర్ చేస్తుంది. కనుగొనబడిన అన్ని టార్గెట్‌లు *result_file* ఫీల్డ్ ద్వారా స్పెసిఫై చేయబడిన ఫైల్‌లో రాయబడతాయి, ఇది ADOT collector కంటైనర్‌కు మౌంట్ చేయబడిన ఫైల్ సిస్టమ్‌లో ఉంటుంది. తరువాత, Prometheus receiver ఈ ఫైల్‌లో జాబితా చేయబడిన టార్గెట్‌ల నుండి మెట్రిక్స్ స్క్రేప్ చేస్తుంది.

### Amazon Managed Prometheus వర్క్‌స్పేస్‌కు మెట్రిక్స్ డేటా పంపడం
Prometheus Receiver ద్వారా సేకరించబడిన మెట్రిక్స్‌ను, క్రింద కాన్ఫిగరేషన్‌లోని *exporters* సెక్షన్‌లో చూపిన విధంగా, collector పైప్‌లైన్‌లో [Prometheus Remote Write Exporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/prometheusremotewriteexporter) ఉపయోగించి Amazon Managed Prometheus వర్క్‌స్పేస్‌కు పంపవచ్చు. Exporter వర్క్‌స్పేస్ యొక్క remote write URL తో కాన్ఫిగర్ చేయబడింది మరియు HTTP POST రిక్వెస్ట్‌లను ఉపయోగించి మెట్రిక్స్ డేటాను పంపుతుంది. ఇది వర్క్‌స్పేస్‌కు పంపబడిన రిక్వెస్ట్‌లను సంతకం చేయడానికి అంతర్నిర్మిత AWS Signature Version 4 authenticator ను ఉపయోగిస్తుంది.

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

### Amazon CloudWatch కు మెట్రిక్స్ డేటా పంపడం
ప్రత్యామ్నాయంగా, క్రింద కాన్ఫిగరేషన్‌లోని *exporters* సెక్షన్‌లో చూపిన విధంగా, collector పైప్‌లైన్‌లో [Amazon CloudWatch EMF Exporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/awsemfexporter) ఉపయోగించి మెట్రిక్స్ డేటాను Amazon CloudWatch కు పంపవచ్చు. ఈ exporter మెట్రిక్స్ డేటాను CloudWatch కు పెర్ఫార్మెన్స్ లాగ్ ఈవెంట్‌లుగా పంపుతుంది. Exporter లోని *metric_declaration* ఫీల్డ్ జనరేట్ చేయవలసిన ఎంబెడెడ్ మెట్రిక్ ఫార్మాట్‌తో లాగ్‌ల అర్రేను స్పెసిఫై చేయడానికి ఉపయోగించబడుతుంది. క్రింద కాన్ఫిగరేషన్ *http_requests_total* అనే మెట్రిక్ కోసం మాత్రమే లాగ్ ఈవెంట్‌లను జనరేట్ చేస్తుంది. ఈ డేటాను ఉపయోగించి, CloudWatch *ECS/ContainerInsights/Prometheus* అనే CloudWatch నేమ్‌స్పేస్ కింద *ClusterName*, *ServiceName* మరియు *TaskDefinitionFamily* డైమెన్షన్‌లతో *http_requests_total* మెట్రిక్‌ను సృష్టిస్తుంది.


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
