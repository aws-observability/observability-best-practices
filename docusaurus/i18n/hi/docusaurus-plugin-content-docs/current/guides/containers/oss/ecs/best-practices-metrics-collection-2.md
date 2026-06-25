# AWS Distro for OpenTelemetry का उपयोग करके ECS क्लस्टर में सर्विस मेट्रिक्स एकत्र करना
## डिफॉल्ट कॉन्फ़िगरेशन के साथ ADOT Collector को डिप्लॉय करना
ADOT collector को नीचे दिखाए गए task definition का उपयोग करके sidecar पैटर्न से डिप्लॉय किया जा सकता है। collector के लिए उपयोग की जाने वाली कंटेनर इमेज दो collector pipeline कॉन्फ़िगरेशन के साथ बंडल की गई है, जिन्हें कंटेनर definition के *command* सेक्शन में निर्दिष्ट किया जा सकता है। इस वैल्यू को `--config=/etc/ecs/ecs-default-config.yaml` सेट करने से एक [pipeline कॉन्फ़िगरेशन](https://github.com/aws-observability/aws-otel-collector/blob/main/config/ecs/ecs-default-config.yaml) का उपयोग होगा जो collector के साथ एक ही task में चल रहे अन्य कंटेनरों से एप्लिकेशन मेट्रिक्स और ट्रेसेस एकत्र करेगा और उन्हें Amazon CloudWatch और AWS X-Ray को भेजेगा। विशेष रूप से, collector एक [OpenTelemetry Protocol (OTLP) Receiver](https://github.com/open-telemetry/opentelemetry-collector/tree/main/receiver/otlpreceiver) का उपयोग करता है जो OpenTelemetry SDKs से इंस्ट्रूमेंट किए गए एप्लिकेशन द्वारा भेजे गए मेट्रिक्स प्राप्त करता है, साथ ही एक [StatsD Receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/statsdreceiver) का उपयोग StatsD मेट्रिक्स एकत्र करने के लिए करता है। इसके अतिरिक्त, यह AWS X-Ray SDK से इंस्ट्रूमेंट किए गए एप्लिकेशन से ट्रेसेस एकत्र करने के लिए एक [AWS X-ray Receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/awsxrayreceiver) का उपयोग करता है।

:::info
    Amazon ECS क्लस्टर पर ADOT collector को डिप्लॉय करते समय उपयोग किए जाने वाले IAM task role और task execution role को सेटअप करने के विवरण के लिए [डॉक्यूमेंटेशन](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/deploy-container-insights-ECS-adot.html) देखें।
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
## Prometheus मेट्रिक्स संग्रह के लिए ADOT Collector को डिप्लॉय करना
डिफॉल्ट कॉन्फ़िगरेशन से भिन्न pipeline के साथ central collector पैटर्न का उपयोग करके ADOT को डिप्लॉय करने के लिए, नीचे दिखाई गई task definition का उपयोग किया जा सकता है। यहां, collector pipeline का कॉन्फ़िगरेशन AWS SSM Parameter Store में *otel-collector-config* नामक पैरामीटर से लोड किया जाता है। collector को REPLICA सर्विस शेड्यूलर स्ट्रैटेजी का उपयोग करके लॉन्च किया जाता है।

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
    SSM Parameter Store पैरामीटर नाम को AOT_CONFIG_CONTENT नामक environment variable का उपयोग करके collector के लिए उपलब्ध कराना आवश्यक है।
    जब एप्लिकेशन से Prometheus मेट्रिक्स संग्रह के लिए ADOT collector का उपयोग करते हुए REPLICA सर्विस शेड्यूलर स्ट्रैटेजी के साथ डिप्लॉय करें, तो सुनिश्चित करें कि आप replica count को 1 पर सेट करें। collector की 1 से अधिक replica डिप्लॉय करने से लक्ष्य गंतव्य में मेट्रिक्स डेटा का गलत प्रतिनिधित्व होगा।
:::

नीचे दिखाया गया कॉन्फ़िगरेशन ADOT collector को [Prometheus Receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/prometheusreceiver) का उपयोग करके क्लस्टर में सर्विसेस से Prometheus मेट्रिक्स एकत्र करने में सक्षम बनाता है। यह receiver न्यूनतम रूप से Prometheus server के लिए एक drop-in replacement होने के लिए डिज़ाइन किया गया है। इस receiver के साथ मेट्रिक्स एकत्र करने के लिए, आपको scrape किए जाने वाले target सर्विसेस के सेट की खोज करने के लिए एक तंत्र की आवश्यकता होती है। receiver दर्जनों समर्थित [service-discovery mechanisms](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#scrape_config) में से किसी एक का उपयोग करके scraping targets की static और dynamic दोनों discovery को सपोर्ट करता है।

चूंकि Amazon ECS में कोई built-in service discovery mechanism नहीं है, इसलिए collector targets की file-based discovery के लिए Prometheus के सपोर्ट पर निर्भर करता है। targets की file-based discovery के लिए Prometheus receiver को सेटअप करने के लिए, collector [Amazon ECS Observer](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/extension/observer/ecsobserver/README.md) extension का उपयोग करता है। यह extension सभी चल रहे tasks से Prometheus scrape targets की खोज करने और कॉन्फ़िगरेशन में *ecs_observer/task_definitions* सेक्शन के तहत सूचीबद्ध service names, task definitions और container labels के आधार पर उन्हें फ़िल्टर करने के लिए ECS/EC2 API का उपयोग करता है। सभी खोजे गए targets *result_file* फ़ील्ड द्वारा निर्दिष्ट फ़ाइल में लिखे जाते हैं, जो ADOT collector कंटेनर पर माउंट किए गए file system पर स्थित होती है। इसके बाद, Prometheus receiver इस फ़ाइल में सूचीबद्ध targets से मेट्रिक्स scrape करता है।

### Amazon Managed Prometheus workspace को मेट्रिक्स डेटा भेजना
Prometheus Receiver द्वारा एकत्र किए गए मेट्रिक्स को collector pipeline में [Prometheus Remote Write Exporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/prometheusremotewriteexporter) का उपयोग करके Amazon Managed Prometheus workspace को भेजा जा सकता है, जैसा कि नीचे दिए गए कॉन्फ़िगरेशन के *exporters* सेक्शन में दिखाया गया है। exporter को workspace के remote write URL के साथ कॉन्फ़िगर किया जाता है और यह HTTP POST requests का उपयोग करके मेट्रिक्स डेटा भेजता है। यह workspace को भेजे जाने वाले requests पर हस्ताक्षर करने के लिए built-in AWS Signature Version 4 authenticator का उपयोग करता है।

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

### Amazon CloudWatch को मेट्रिक्स डेटा भेजना
वैकल्पिक रूप से, मेट्रिक्स डेटा को collector pipeline में [Amazon CloudWatch EMF Exporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/awsemfexporter) का उपयोग करके Amazon CloudWatch को भेजा जा सकता है, जैसा कि नीचे दिए गए कॉन्फ़िगरेशन के *exporters* सेक्शन में दिखाया गया है। यह exporter मेट्रिक्स डेटा को performance log events के रूप में CloudWatch को भेजता है। exporter में *metric_declaration* फ़ील्ड का उपयोग embedded metric format के साथ जनरेट किए जाने वाले logs के array को निर्दिष्ट करने के लिए किया जाता है। नीचे दिया गया कॉन्फ़िगरेशन केवल *http_requests_total* नामक मेट्रिक के लिए log events जनरेट करेगा। इस डेटा का उपयोग करके, CloudWatch *ClusterName*, *ServiceName* और *TaskDefinitionFamily* dimensions के साथ CloudWatch namespace *ECS/ContainerInsights/Prometheus* के तहत मेट्रिक *http_requests_total* बनाएगा।


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
