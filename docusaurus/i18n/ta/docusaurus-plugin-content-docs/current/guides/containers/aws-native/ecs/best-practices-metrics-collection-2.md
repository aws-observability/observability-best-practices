# Container Insights பயன்படுத்தி சேவை மெட்ரிக்குகளை சேகரித்தல்
சேவை மெட்ரிக்குகள் என்பது உங்கள் code-இல் instrumentation சேர்ப்பதன் மூலம் capture செய்யப்படும் application-level மெட்ரிக்குகள் ஆகும். இந்த மெட்ரிக்குகளை இரண்டு வெவ்வேறு அணுகுமுறைகள் மூலம் application-இலிருந்து capture செய்யலாம்.

1. Push அணுகுமுறை: இங்கே, application மெட்ரிக்குகள் தரவை நேரடியாக ஒரு இலக்குக்கு அனுப்புகிறது. உதாரணமாக, CloudWatch PutMetricData API பயன்படுத்தி, application metric data points-ஐ CloudWatch-க்கு publish செய்யலாம். Application OpenTelemetry Protocol (OTLP) மூலம் gRPC அல்லது HTTP வழியாக OpenTelemetry Collector போன்ற agent-க்கு தரவை அனுப்பலாம். பின்னர் agent மெட்ரிக்குகள் தரவை இறுதி இலக்குக்கு அனுப்பும்.
2. Pull அணுகுமுறை: இங்கே, application மெட்ரிக்குகள் தரவை முன்-வரையறுக்கப்பட்ட format-இல் HTTP endpoint-இல் வெளிப்படுத்துகிறது. இந்த endpoint-க்கு அணுகல் உள்ள agent தரவை scrape செய்து இலக்குக்கு அனுப்புகிறது.

![Push approach for metric collection](../../../../images/PushPullApproach.png)

## Prometheus-க்கான CloudWatch Container Insights monitoring
[Prometheus](https://prometheus.io/docs/introduction/overview/) என்பது பிரபலமான open-source systems monitoring மற்றும் alerting toolkit ஆகும். Containerized applications-இலிருந்து pull அணுகுமுறை பயன்படுத்தி மெட்ரிக்குகளை சேகரிப்பதற்கான de facto standard ஆக இது உருவெடுத்துள்ளது. Prometheus பயன்படுத்தி மெட்ரிக்குகளை capture செய்ய, முதலில் அனைத்து முக்கிய programming languages-இலும் கிடைக்கும் Prometheus [client library](https://prometheus.io/docs/instrumenting/clientlibs/) பயன்படுத்தி உங்கள் application code-ஐ instrument செய்ய வேண்டும். மெட்ரிக்குகள் பொதுவாக application-ஆல் HTTP வழியாக வெளிப்படுத்தப்படுகின்றன, Prometheus server படிக்கும்.
Prometheus server உங்கள் application-இன் HTTP endpoint-ஐ scrape செய்யும்போது, client library கண்காணிக்கப்படும் அனைத்து மெட்ரிக்குகளின் தற்போதைய நிலையை server-க்கு அனுப்புகிறது. Server மெட்ரிக்குகளை தான் நிர்வகிக்கும் local storage-இல் சேமிக்கலாம் அல்லது CloudWatch போன்ற remote destination-க்கு மெட்ரிக்குகள் தரவை அனுப்பலாம்.

[Prometheus-க்கான CloudWatch Container Insights monitoring](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights-Prometheus.html) Amazon ECS கிளஸ்டரில் Prometheus-இன் திறன்களை பயன்படுத்த உதவுகிறது. EC2 மற்றும் Fargate-இல் deploy செய்யப்பட்ட Amazon ECS கிளஸ்டர்களுக்கு இது கிடைக்கிறது. CloudWatch agent-ஐ Prometheus server-க்கு drop-in replacement ஆக பயன்படுத்தலாம், observability மேம்படுத்த தேவையான monitoring tools-இன் எண்ணிக்கையை குறைக்கிறது. இது Amazon ECS-இல் deploy செய்யப்பட்ட containerized applications-இலிருந்து Prometheus மெட்ரிக்குகளை தானாக கண்டறிந்து மெட்ரிக்குகள் தரவை CloudWatch-க்கு performance log events ஆக அனுப்புகிறது.

:::info
    Amazon ECS கிளஸ்டரில் Prometheus மெட்ரிக்குகள் சேகரிப்புடன் CloudWatch agent-ஐ deploy செய்யும் படிகள் [Amazon CloudWatch User Guide](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights-Prometheus-install-ECS.html)-இல் ஆவணப்படுத்தப்பட்டுள்ளன.
:::
:::warning
    Prometheus-க்கான Container Insights monitoring சேகரிக்கும் மெட்ரிக்குகள் custom metrics ஆக கட்டணம் வசூலிக்கப்படும். CloudWatch pricing பற்றிய மேலும் தகவலுக்கு, [Amazon CloudWatch Pricing](https://aws.amazon.com/cloudwatch/pricing/) பார்க்கவும்.
:::
### Amazon ECS கிளஸ்டர்களில் targets-இன் தானியங்கி கண்டுபிடிப்பு
CloudWatch agent Prometheus documentation-இல் உள்ள [scrape_config](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#scrape_config) பகுதியின் கீழ் standard Prometheus scrape configurations-ஐ ஆதரிக்கிறது. Prometheus ஆதரிக்கப்படும் பல [service-discovery mechanisms](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#scrape_config) பயன்படுத்தி scraping targets-இன் static மற்றும் dynamic discovery-ஐ ஆதரிக்கிறது. Amazon ECS-இல் built-in service discovery mechanism இல்லாததால், agent Prometheus-இன் file-based target discovery-ஐ நம்பியுள்ளது. File-based target discovery-க்கு agent-ஐ setup செய்ய, agent தொடங்க பயன்படுத்தும் task definition-இல் வரையறுக்கப்பட்ட இரண்டு [configuration parameters](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights-Prometheus-Setup-configure-ECS.html) தேவை. Agent சேகரிக்கும் மெட்ரிக்குகள் மீது granular control பெற இந்த parameters-ஐ customize செய்யலாம்.

முதல் parameter பின்வரும் sample போன்ற Prometheus global configuration-ஐ கொண்டுள்ளது:

```
global:
  scrape_interval: 30s
  scrape_timeout: 10s
scrape_configs:
  - job_name: cwagent_ecs_auto_sd
    sample_limit: 10000
    file_sd_configs:
      - files: [ "/tmp/cwagent_ecs_auto_sd.yaml" ] 
```

இரண்டாவது parameter agent-க்கு scraping targets கண்டறிய உதவும் configuration-ஐ கொண்டுள்ளது. Agent அவ்வப்போது Amazon ECS-க்கு API calls செய்து, இந்த configuration-இன் *ecs_service_discovery* பகுதியில் வரையறுக்கப்பட்ட task definition patterns-உடன் பொருந்தும் இயங்கும் ECS tasks-இன் metadata-ஐ retrieve செய்கிறது. கண்டறியப்பட்ட அனைத்து targets-ம் CloudWatch agent container-க்கு mount செய்யப்பட்ட file system-இல் உள்ள result file */tmp/cwagent_ecs_auto_sd.yaml*-இல் எழுதப்படுகின்றன. கீழே உள்ள sample configuration agent *BackendTask* prefix-உடன் பெயரிடப்பட்ட அனைத்து tasks-இலிருந்தும் மெட்ரிக்குகளை scrape செய்யும் முடிவை தரும். Amazon ECS Cluster-இல் targets-இன் autodiscovery-க்கான [விரிவான வழிகாட்டியை](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights-Prometheus-Setup-autodiscovery-ecs.html) பார்க்கவும்.

```
{
   "logs":{
      "metrics_collected":{
         "prometheus":{
            "log_group_name":"/aws/ecs/containerinsights/{ClusterName}/prometheus"
            "prometheus_config_path":"env:PROMETHEUS_CONFIG_CONTENT",
            "ecs_service_discovery":{
               "sd_frequency":"1m",
               "sd_result_file":"/tmp/cwagent_ecs_auto_sd.yaml",
               "task_definition_list":[
                  {
                     "sd_job_name":"backends",
                     "sd_metrics_ports":"3000",
                     "sd_task_definition_arn_pattern":".*:task-definition/BackendTask:[0-9]+",
                     "sd_metrics_path":"/metrics"
                  }
               ]
            },
            "emf_processor":{
               "metric_declaration":[
                  {
                     "source_labels":[
                        "job"
                     ],
                     "label_matcher":"^backends$",
                     "dimensions":[
                        [
                           "ClusterName",
                           "TaskGroup"
                        ]
                     ],
                     "metric_selectors":[
                        "^http_requests_total$"
                     ]
                  }
               ]
            }
         }
      },
      "force_flush_interval":5
   }
}
```

### Prometheus மெட்ரிக்குகளை CloudWatch-க்கு import செய்தல்
Agent சேகரிக்கும் மெட்ரிக்குகள் configuration-இன் *metric_declaration* பகுதியில் குறிப்பிடப்பட்ட filtering rules அடிப்படையில் performance log events ஆக CloudWatch-க்கு அனுப்பப்படுகின்றன. இந்த பகுதி உருவாக்கப்பட வேண்டிய embedded metric format logs-இன் array-ஐ குறிப்பிடவும் பயன்படுகிறது. மேலே உள்ள sample configuration, கீழே காட்டப்பட்டுள்ளபடி, *job:backends* label-உடன் *http_requests_total* என்ற metric-க்கு மட்டும் log events உருவாக்கும். இந்த தரவைப் பயன்படுத்தி, CloudWatch *ECS/ContainerInsights/Prometheus* என்ற CloudWatch namespace-இன் கீழ் *ClusterName* மற்றும் *TaskGroup* dimensions-உடன் *http_requests_total* metric-ஐ உருவாக்கும்.
```
{
   "CloudWatchMetrics":[
      {
         "Metrics":[
            {
               "Name":"http_requests_total"
            }
         ],
         "Dimensions":[
            [
               "ClusterName",
               "TaskGroup"
            ]
         ],
         "Namespace":"ECS/ContainerInsights/Prometheus"
      }
   ],
   "ClusterName":"ecs-sarathy-cluster",
   "LaunchType":"EC2",
   "StartedBy":"ecs-svc/4964126209508453538",
   "TaskDefinitionFamily":"BackendAlarmTask",
   "TaskGroup":"service:BackendService",
   "TaskRevision":"4",
   "Timestamp":"1678226606712",
   "Version":"0",
   "container_name":"go-backend",
   "exported_job":"storebackend",
   "http_requests_total":36,
   "instance":"10.10.100.191:3000",
   "job":"backends",
   "path":"/popular/category",
   "prom_metric_type":"counter"
}
```
