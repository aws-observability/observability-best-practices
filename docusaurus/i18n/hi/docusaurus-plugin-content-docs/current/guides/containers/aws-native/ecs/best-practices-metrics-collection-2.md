# Container Insights के साथ सर्विस मेट्रिक्स एकत्र करना
सर्विस मेट्रिक्स एप्लिकेशन-स्तरीय मेट्रिक्स हैं जो आपके कोड में इंस्ट्रूमेंटेशन जोड़कर कैप्चर किए जाते हैं। इन मेट्रिक्स को एक एप्लिकेशन से दो अलग-अलग तरीकों से कैप्चर किया जा सकता है।

1. Push दृष्टिकोण: यहाँ, एक एप्लिकेशन मेट्रिक्स डेटा सीधे एक गंतव्य को भेजता है। उदाहरण के लिए, CloudWatch PutMetricData API का उपयोग करके, एक एप्लिकेशन CloudWatch को metric data points पब्लिश कर सकता है। एक एप्लिकेशन OpenTelemetry Protocol (OTLP) का उपयोग करके gRPC या HTTP के माध्यम से OpenTelemetry Collector जैसे एजेंट को भी डेटा भेज सकता है।
2. Pull दृष्टिकोण: यहाँ, एप्लिकेशन एक पूर्वनिर्धारित फ़ॉर्मेट में HTTP endpoint पर मेट्रिक्स डेटा एक्सपोज़ करता है। फिर डेटा एक एजेंट द्वारा स्क्रैप किया जाता है जिसकी इस endpoint तक पहुँच है और फिर गंतव्य को भेजा जाता है।

![Push approach for metric collection](../../../../images/PushPullApproach.png)

## Prometheus के लिए CloudWatch Container Insights मॉनिटरिंग
[Prometheus](https://prometheus.io/docs/introduction/overview/) एक लोकप्रिय ओपन-सोर्स सिस्टम मॉनिटरिंग और अलर्टिंग टूलकिट है। यह pull दृष्टिकोण का उपयोग करके कंटेनराइज़्ड एप्लिकेशन से मेट्रिक्स एकत्र करने के लिए वास्तविक मानक के रूप में उभरा है। Prometheus का उपयोग करके मेट्रिक्स कैप्चर करने के लिए, आपको पहले Prometheus [client library](https://prometheus.io/docs/instrumenting/clientlibs/) का उपयोग करके अपने एप्लिकेशन कोड को इंस्ट्रूमेंट करना होगा।

[CloudWatch Container Insights monitoring for Prometheus](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights-Prometheus.html) आपको Amazon ECS क्लस्टर में Prometheus की क्षमताओं का लाभ उठाने में सक्षम बनाता है। यह EC2 और Fargate पर डिप्लॉय किए गए Amazon ECS क्लस्टर्स के लिए उपलब्ध है। CloudWatch एजेंट का उपयोग Prometheus server के ड्रॉप-इन रिप्लेसमेंट के रूप में किया जा सकता है।

:::info
    Amazon ECS क्लस्टर पर Prometheus मेट्रिक्स कलेक्शन के साथ CloudWatch एजेंट डिप्लॉय करने के चरण [Amazon CloudWatch User Guide](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights-Prometheus-install-ECS.html) में दस्तावेज़ित हैं
:::
:::warning
    Prometheus के लिए Container Insights मॉनिटरिंग द्वारा एकत्र किए गए मेट्रिक्स कस्टम मेट्रिक्स के रूप में शुल्कित किए जाते हैं। CloudWatch प्राइसिंग के बारे में अधिक जानकारी के लिए, [Amazon CloudWatch Pricing](https://aws.amazon.com/cloudwatch/pricing/) देखें
:::
### Amazon ECS क्लस्टर्स पर टारगेट्स की ऑटोडिस्कवरी
CloudWatch एजेंट Prometheus दस्तावेज़ में [scrape_config](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#scrape_config) सेक्शन के तहत मानक Prometheus scrape कॉन्फ़िगरेशन को सपोर्ट करता है। चूँकि Amazon ECS में कोई बिल्ट-इन सर्विस डिस्कवरी मैकेनिज्म नहीं है, एजेंट Prometheus के फ़ाइल-आधारित टारगेट डिस्कवरी सपोर्ट पर निर्भर करता है।

पहला पैरामीटर Prometheus ग्लोबल कॉन्फ़िगरेशन रखता है:

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

दूसरा पैरामीटर कॉन्फ़िगरेशन रखता है जो एजेंट को स्क्रैपिंग टारगेट्स खोजने में मदद करता है:

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

### Prometheus मेट्रिक्स को CloudWatch में इम्पोर्ट करना
एजेंट द्वारा एकत्र किए गए मेट्रिक्स कॉन्फ़िगरेशन के *metric_declaration* सेक्शन में निर्दिष्ट फ़िल्टरिंग नियमों के आधार पर परफ़ॉर्मेंस लॉग events के रूप में CloudWatch को भेजे जाते हैं। ऊपर दिया गया सैंपल कॉन्फ़िगरेशन केवल *http_requests_total* नामक मेट्रिक के लिए लॉग events जनरेट करेगा। इस डेटा का उपयोग करके, CloudWatch *ECS/ContainerInsights/Prometheus* CloudWatch namespace के तहत *ClusterName* और *TaskGroup* डाइमेंशन के साथ *http_requests_total* मेट्रिक बनाएगा।
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
