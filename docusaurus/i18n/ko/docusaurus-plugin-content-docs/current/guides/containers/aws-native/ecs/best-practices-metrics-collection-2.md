# Container Insights를 사용한 서비스 메트릭 수집
서비스 메트릭(metrics)은 코드에 계측(instrumentation)을 추가하여 캡처하는 애플리케이션 수준의 지표입니다. 이러한 메트릭은 두 가지 방식으로 애플리케이션에서 수집할 수 있습니다.

1. Push 방식: 애플리케이션이 메트릭 데이터를 직접 대상으로 전송하는 방식입니다. 예를 들어, CloudWatch PutMetricData API를 사용하여 애플리케이션이 CloudWatch에 메트릭 데이터 포인트를 게시할 수 있습니다. 또한 OpenTelemetry Protocol(OTLP)을 통해 gRPC나 HTTP로 OpenTelemetry Collector 같은 에이전트에 데이터를 전송할 수도 있습니다. 에이전트는 이후 메트릭 데이터를 최종 대상으로 전송합니다.
2. Pull 방식: 애플리케이션이 사전 정의된 형식으로 HTTP 엔드포인트에 메트릭 데이터를 노출하는 방식입니다. 이 엔드포인트에 접근할 수 있는 에이전트가 데이터를 스크래핑한 후 대상으로 전송합니다.

![Push approach for metric collection](../../../../images/PushPullApproach.png)

## Prometheus용 CloudWatch Container Insights 모니터링
[Prometheus](https://prometheus.io/docs/introduction/overview/)는 널리 사용되는 오픈 소스 시스템 모니터링 및 알림 도구입니다. 컨테이너화된 애플리케이션에서 Pull 방식으로 메트릭을 수집하는 사실상의 표준으로 자리잡았습니다. Prometheus를 사용하여 메트릭을 캡처하려면 먼저 모든 주요 프로그래밍 언어로 제공되는 Prometheus [클라이언트 라이브러리](https://prometheus.io/docs/instrumenting/clientlibs/)를 사용하여 애플리케이션 코드를 계측해야 합니다. 메트릭은 일반적으로 HTTP를 통해 애플리케이션에서 노출되며 Prometheus 서버가 이를 읽습니다.
Prometheus 서버가 애플리케이션의 HTTP 엔드포인트를 스크래핑하면, 클라이언트 라이브러리가 추적 중인 모든 메트릭의 현재 상태를 서버로 전송합니다. 서버는 자체 관리하는 로컬 스토리지에 메트릭을 저장하거나 CloudWatch와 같은 원격 대상으로 메트릭 데이터를 전송할 수 있습니다.

[Prometheus용 CloudWatch Container Insights 모니터링](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights-Prometheus.html)을 사용하면 Amazon ECS 클러스터에서 Prometheus의 기능을 활용할 수 있습니다. EC2와 Fargate에 배포된 Amazon ECS 클러스터에서 사용 가능합니다. CloudWatch 에이전트를 Prometheus 서버의 드롭인 대체제로 사용할 수 있어 Observability를 개선하는 데 필요한 모니터링 도구의 수를 줄일 수 있습니다. 이 에이전트는 Amazon ECS에 배포된 컨테이너화된 애플리케이션에서 Prometheus 메트릭을 자동으로 검색하고 메트릭 데이터를 성능 로그 이벤트로 CloudWatch에 전송합니다.

:::info
    Amazon ECS 클러스터에서 Prometheus 메트릭 수집과 함께 CloudWatch 에이전트를 배포하는 단계는 [Amazon CloudWatch 사용자 가이드](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights-Prometheus-install-ECS.html)에 문서화되어 있습니다.
:::
:::warning
    Prometheus용 Container Insights 모니터링에서 수집하는 메트릭은 사용자 지정 메트릭으로 요금이 부과됩니다. CloudWatch 요금에 대한 자세한 내용은 [Amazon CloudWatch 요금](https://aws.amazon.com/cloudwatch/pricing/)을 참조하세요.
:::
### Amazon ECS 클러스터에서의 대상 자동 검색
CloudWatch 에이전트는 Prometheus 문서의 [scrape_config](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#scrape_config) 섹션에 있는 표준 Prometheus 스크래핑 구성을 지원합니다. Prometheus는 수십 가지의 지원되는 [서비스 검색 메커니즘](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#scrape_config)을 사용하여 스크래핑 대상의 정적 및 동적 검색을 모두 지원합니다. Amazon ECS에는 내장된 서비스 검색 메커니즘이 없으므로 에이전트는 Prometheus의 파일 기반 대상 검색을 활용합니다. 파일 기반 대상 검색을 위해 에이전트를 설정하려면 에이전트 시작에 사용되는 태스크 정의에 정의된 두 가지 [구성 매개변수](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights-Prometheus-Setup-configure-ECS.html)가 필요합니다. 이러한 매개변수를 사용자 지정하여 에이전트가 수집하는 메트릭을 세밀하게 제어할 수 있습니다.

첫 번째 매개변수에는 다음 샘플과 같은 Prometheus 글로벌 구성이 포함됩니다:

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

두 번째 매개변수에는 에이전트가 스크래핑 대상을 검색하는 데 도움이 되는 구성이 포함됩니다. 에이전트는 주기적으로 Amazon ECS에 API 호출을 수행하여 이 구성의 *ecs_service_discovery* 섹션에 정의된 태스크 정의 패턴과 일치하는 실행 중인 ECS 태스크의 메타데이터를 검색합니다. 검색된 모든 대상은 CloudWatch 에이전트 컨테이너에 마운트된 파일 시스템의 결과 파일 */tmp/cwagent_ecs_auto_sd.yaml*에 기록됩니다. 아래 샘플 구성은 에이전트가 *BackendTask* 접두사로 명명된 모든 태스크에서 메트릭을 스크래핑하도록 합니다. Amazon ECS 클러스터에서의 대상 자동 검색에 대한 [상세 가이드](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights-Prometheus-Setup-autodiscovery-ecs.html)를 참조하세요.

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

### Prometheus 메트릭을 CloudWatch로 가져오기
에이전트가 수집한 메트릭은 구성의 *metric_declaration* 섹션에 지정된 필터링 규칙에 따라 성능 로그 이벤트로 CloudWatch에 전송됩니다. 이 섹션은 생성할 임베디드 메트릭 형식 로그의 배열을 지정하는 데에도 사용됩니다. 위의 샘플 구성은 아래와 같이 *job:backends* 레이블이 있는 *http_requests_total*이라는 메트릭에 대해서만 로그 이벤트를 생성합니다. 이 데이터를 사용하여 CloudWatch는 *ClusterName*과 *TaskGroup* 차원으로 CloudWatch 네임스페이스 *ECS/ContainerInsights/Prometheus* 아래에 *http_requests_total* 메트릭을 생성합니다.
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
