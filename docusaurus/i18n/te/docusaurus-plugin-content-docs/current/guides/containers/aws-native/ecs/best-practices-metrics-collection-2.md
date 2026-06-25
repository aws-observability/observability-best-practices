# Container Insights తో service metrics సేకరించడం
Service metrics అనేవి మీ code కు instrumentation ను add చేయడం ద్వారా capture చేయబడే application-level metrics. ఈ metrics రెండు విభిన్న approaches ను ఉపయోగించి application నుండి capture చేయవచ్చు.

1. Push approach: ఇక్కడ, application metrics data ను నేరుగా destination కు పంపుతుంది. ఉదాహరణకు, CloudWatch PutMetricData API ని ఉపయోగించి, application CloudWatch కు metric data points ను publish చేయవచ్చు. Application gRPC లేదా HTTP ద్వారా OpenTelemetry Protocol (OTLP) ను ఉపయోగించి OpenTelemetry Collector వంటి agent కు data పంపవచ్చు. తర్వాత అది metrics data ను final destination కు పంపుతుంది.
2. Pull approach: ఇక్కడ, application ముందుగా నిర్వచించిన format లో HTTP endpoint వద్ద metrics data ను expose చేస్తుంది. ఈ endpoint కు access ఉన్న agent ద్వారా data scrape చేయబడి, destination కు పంపబడుతుంది.

![Push approach for metric collection](../../../../images/PushPullApproach.png)

## Prometheus కోసం CloudWatch Container Insights monitoring
[Prometheus](https://prometheus.io/docs/introduction/overview/) ఒక popular open-source systems monitoring మరియు alerting toolkit. Containerized applications నుండి pull approach ను ఉపయోగించి metrics collect చేయడానికి ఇది de facto standard గా ఉద్భవించింది. Prometheus ను ఉపయోగించి metrics capture చేయడానికి, మీరు మొదట అన్ని ప్రధాన programming languages లో అందుబాటులో ఉన్న Prometheus [client library](https://prometheus.io/docs/instrumenting/clientlibs/) ని ఉపయోగించి మీ application code ను instrument చేయాలి. Metrics సాధారణంగా application ద్వారా HTTP పై expose చేయబడతాయి, Prometheus server ద్వారా read చేయబడటానికి.
Prometheus server మీ application యొక్క HTTP endpoint ను scrape చేసినప్పుడు, client library track చేయబడిన అన్ని metrics యొక్క current state ను server కు పంపుతుంది. Server metrics ను తాను manage చేసే local storage లో store చేయవచ్చు లేదా CloudWatch వంటి remote destination కు metrics data ను పంపవచ్చు.

[Prometheus కోసం CloudWatch Container Insights monitoring](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights-Prometheus.html) Amazon ECS cluster లో Prometheus capabilities ను leverage చేయడానికి మిమ్మల్ని ఎనేబుల్ చేస్తుంది. ఇది EC2 మరియు Fargate పై deploy చేయబడిన Amazon ECS clusters కోసం అందుబాటులో ఉంటుంది. CloudWatch agent Prometheus server కోసం drop-in replacement గా ఉపయోగించవచ్చు, observability ను మెరుగుపరచడానికి అవసరమైన monitoring tools సంఖ్యను తగ్గిస్తుంది. ఇది Amazon ECS కు deploy చేయబడిన containerized applications నుండి Prometheus metrics discovery ను automate చేసి, metrics data ను CloudWatch కు performance log events గా పంపుతుంది.

:::info
    Amazon ECS cluster పై Prometheus metrics collection తో CloudWatch agent ను deploy చేసే steps [Amazon CloudWatch User Guide](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights-Prometheus-install-ECS.html) లో documented చేయబడ్డాయి.
:::
:::warning
    Prometheus కోసం Container Insights monitoring ద్వారా collect చేయబడిన metrics custom metrics గా charge చేయబడతాయి. CloudWatch pricing గురించి మరింత సమాచారం కోసం, [Amazon CloudWatch Pricing](https://aws.amazon.com/cloudwatch/pricing/) చూడండి.
:::
### Amazon ECS clusters పై targets యొక్క Autodiscovery
CloudWatch agent Prometheus documentation లోని [scrape_config](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#scrape_config) section కింద standard Prometheus scrape configurations కు మద్దతు ఇస్తుంది. Prometheus dozens of supported [service-discovery mechanisms](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#scrape_config) లో ఒకదాన్ని ఉపయోగించి scraping targets యొక్క static మరియు dynamic discovery రెండింటికీ మద్దతు ఇస్తుంది. Amazon ECS కు built-in service discovery mechanism లేనందున, agent Prometheus యొక్క file-based discovery of targets మద్దతును ఉపయోగిస్తుంది. Targets యొక్క file-based discovery కోసం agent ను setup చేయడానికి, agent కు రెండు [configuration parameters](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights-Prometheus-Setup-configure-ECS.html) అవసరం, ఇవి రెండూ agent ను launch చేయడానికి ఉపయోగించే task definition లో define చేయబడతాయి. Agent ద్వారా collect చేయబడిన metrics పై granular control కోసం మీరు ఈ parameters ను customize చేయవచ్చు.

మొదటి parameter Prometheus global configuration ను contain చేస్తుంది, ఇది కింది sample లాగా కనిపిస్తుంది:

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

రెండవ parameter scraping targets ను discover చేయడంలో agent కు సహాయపడే configuration ను contain చేస్తుంది. Agent periodically Amazon ECS కు API calls చేసి ఈ configuration యొక్క *ecs_service_discovery* section లో define చేయబడిన task definition patterns కు match అయ్యే running ECS tasks యొక్క metadata ను retrieve చేస్తుంది. Discover చేయబడిన అన్ని targets result file */tmp/cwagent_ecs_auto_sd.yaml* లో write చేయబడతాయి, ఇది CloudWatch agent container కు mount చేయబడిన file system పై ఉంటుంది. కింది sample configuration agent *BackendTask* prefix తో name చేయబడిన అన్ని tasks నుండి metrics scrape చేయడానికి result ఇస్తుంది. Amazon ECS Cluster లో targets యొక్క autodiscovery కోసం [detailed guide](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights-Prometheus-Setup-autodiscovery-ecs.html) ను refer చేయండి.

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

### Prometheus metrics ను CloudWatch లోకి import చేయడం
Agent ద్వారా collect చేయబడిన metrics configuration యొక్క *metric_declaration* section లో specify చేయబడిన filtering rules ఆధారంగా CloudWatch కు performance log events గా పంపబడతాయి. ఈ section embedded metric format తో generate చేయబడే logs array ను specify చేయడానికి కూడా ఉపయోగించబడుతుంది. పై sample configuration *job:backends* label తో *http_requests_total* అనే metric కోసం మాత్రమే log events ను generate చేస్తుంది. ఈ data ను ఉపయోగించి, CloudWatch *ECS/ContainerInsights/Prometheus* CloudWatch namespace కింద *ClusterName* మరియు *TaskGroup* dimensions తో *http_requests_total* metric ను create చేస్తుంది.
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
