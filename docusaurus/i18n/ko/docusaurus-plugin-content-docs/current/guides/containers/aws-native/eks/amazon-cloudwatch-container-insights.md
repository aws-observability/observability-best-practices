# Amazon CloudWatch Container Insights

Observability 모범 사례 가이드의 이 섹션에서는 Amazon CloudWatch Container Insights와 관련된 다음 주제를 심층적으로 다룹니다:

* Amazon CloudWatch Container Insights 소개
* AWS Distro for Open Telemetry와 함께 Amazon CloudWatch Container Insights 사용
* Amazon EKS용 CloudWatch Container Insights의 Fluent Bit 통합
* Amazon EKS에서 Container Insights를 통한 비용 절감
* EKS Blueprints를 사용한 Container Insights 설정

### 소개

[Amazon CloudWatch Container Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html)는 컨테이너화된 애플리케이션과 마이크로서비스에서 메트릭과 로그를 수집, 집계, 요약하는 데 도움을 줍니다. 메트릭 데이터는 [임베디드 메트릭 형식](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html)을 사용하여 성능 로그 이벤트로 수집됩니다. 이러한 성능 로그 이벤트는 구조화된 JSON 스키마를 사용하여 높은 카디널리티 데이터를 대규모로 수집하고 저장할 수 있습니다. 이 데이터를 기반으로 CloudWatch는 클러스터, 노드, 파드, 태스크, 서비스 수준에서 집계된 메트릭을 CloudWatch 메트릭으로 생성합니다. Container Insights가 수집하는 메트릭은 CloudWatch 자동 대시보드에서 확인할 수 있습니다. Container Insights는 자체 관리형 노드 그룹, 관리형 노드 그룹, AWS Fargate 프로필이 있는 Amazon EKS 클러스터에서 사용할 수 있습니다.

비용 최적화 관점에서 Container Insights 비용 관리를 돕기 위해, CloudWatch는 로그 데이터에서 가능한 모든 메트릭을 자동으로 생성하지 않습니다. 하지만 CloudWatch Logs Insights를 사용하여 원시 성능 로그 이벤트를 분석하면 추가 메트릭과 추가 세분화 수준을 확인할 수 있습니다. Container Insights에서 수집하는 메트릭은 사용자 지정 메트릭으로 요금이 부과됩니다. CloudWatch 요금에 대한 자세한 내용은 [Amazon CloudWatch 요금](https://aws.amazon.com/cloudwatch/pricing/)을 참조하세요.

Amazon EKS에서 Container Insights는 Amazon Elastic Container Registry를 통해 Amazon이 제공하는 컨테이너화된 버전의 [CloudWatch 에이전트](https://gallery.ecr.aws/cloudwatch-agent/cloudwatch-agent)를 사용하여 클러스터에서 실행 중인 모든 컨테이너를 검색합니다. 그런 다음 성능 스택의 모든 계층에서 성능 데이터를 수집합니다. Container Insights는 수집하는 로그와 메트릭에 대해 AWS KMS 키를 사용한 암호화를 지원합니다. 이 암호화를 활성화하려면 Container Insights 데이터를 수신하는 로그 그룹에 대해 AWS KMS 암호화를 수동으로 활성화해야 합니다. 이렇게 하면 CloudWatch Container Insights가 제공된 AWS KMS 키를 사용하여 데이터를 암호화합니다. 대칭 키만 지원되며 비대칭 AWS KMS 키는 로그 그룹 암호화에 지원되지 않습니다. Container Insights는 Linux 인스턴스에서만 지원됩니다. Amazon EKS용 Container Insights는 [다음](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html#:~:text=Container%20Insights%20for%20Amazon%20EKS%20and%20Kubernetes%20is%20supported%20in%20the%20following%20Regions%3A) AWS 리전에서 지원됩니다.

### AWS Distro for Open Telemetry와 함께 Amazon CloudWatch Container Insights 사용

이제 Amazon EKS 워크로드에서 Container Insights 메트릭 수집을 활성화하는 옵션 중 하나인 [AWS Distro for OpenTelemetry(ADOT)](https://aws-otel.github.io/docs/introduction)에 대해 심층적으로 살펴보겠습니다. [AWS Distro for OpenTelemetry(ADOT)](https://aws-otel.github.io/docs/introduction)는 [OpenTelemetry](https://opentelemetry.io/docs/) 프로젝트의 안전한 AWS 지원 배포판입니다. ADOT를 사용하면 애플리케이션을 한 번만 계측하여 상관관계가 있는 메트릭과 트레이스를 여러 모니터링 솔루션으로 전송할 수 있습니다. CloudWatch Container Insights를 위한 ADOT 지원을 통해, 고객은 [Amazon Elastic Cloud Compute](https://aws.amazon.com/pm/ec2/?trk=ps_a134p000004f2ZFAAY&trkCampaign=acq_paid_search_brand&sc_channel=PS&sc_campaign=acquisition_US&sc_publisher=Google&sc_category=Cloud%20Computing&sc_country=US&sc_geo=NAMER&sc_outcome=acq&sc_detail=amazon%20ec2&sc_content=EC2_e&sc_matchtype=e&sc_segment=467723097970&sc_medium=ACQ-P|PS-GO|Brand|Desktop|SU|Cloud%20Computing|EC2|US|EN|Text&s_kwcid=AL!4422!3!467723097970!e!!g!!amazon%20ec2&ef_id=Cj0KCQiArt6PBhCoARIsAMF5waj-FXPUD0G-cm0dJ05Mz6aXDvqEGu-S7pCXwvVusULN6ZbPbc_Alg8aArOHEALw_wcB:G:s&s_kwcid=AL!4422!3!467723097970!e!!g!!amazon%20ec2)(Amazon EC2)에서 실행되는 Amazon EKS 클러스터의 CPU, 메모리, 디스크, 네트워크 사용량과 같은 시스템 메트릭을 수집할 수 있으며, Amazon CloudWatch 에이전트와 동일한 경험을 제공합니다. ADOT Collector는 이제 Amazon EKS 및 Amazon EKS용 AWS Fargate 프로필에 대한 CloudWatch Container Insights 지원이 가능합니다. 고객은 이제 Amazon EKS 클러스터에 배포된 파드의 CPU 및 메모리 사용률과 같은 컨테이너 및 파드 메트릭을 수집하고 기존 CloudWatch Container Insights 경험을 변경하지 않고 CloudWatch 대시보드에서 확인할 수 있습니다. 이를 통해 트래픽에 대응하여 스케일 업 또는 스케일 다운 여부를 결정하고 비용을 절감할 수 있습니다.

ADOT Collector에는 수신기(receiver), 프로세서(processor), 내보내기(exporter)의 세 가지 핵심 유형의 컴포넌트로 구성되는 [파이프라인 개념](https://opentelemetry.io/docs/collector/configuration/)이 있습니다. [수신기](https://opentelemetry.io/docs/collector/configuration/#receivers)는 데이터가 컬렉터로 들어오는 방식입니다. 지정된 형식의 데이터를 수락하고 내부 형식으로 변환한 다음 파이프라인에 정의된 [프로세서](https://opentelemetry.io/docs/collector/configuration/#processors) 및 [내보내기](https://opentelemetry.io/docs/collector/configuration/#exporters)로 전달합니다. Pull 또는 Push 기반일 수 있습니다. 프로세서는 수신과 내보내기 사이에 배치, 필터링, 변환과 같은 작업을 수행하는 선택적 컴포넌트입니다. 내보내기는 메트릭, 로그 또는 트레이스를 어떤 대상으로 보낼지 결정하는 데 사용됩니다. 컬렉터 아키텍처를 통해 YAML 구성으로 여러 파이프라인 인스턴스를 정의할 수 있습니다. 다음 다이어그램은 Amazon EKS 및 Fargate 프로필이 있는 Amazon EKS에 배포된 ADOT Collector 인스턴스의 파이프라인 컴포넌트를 보여줍니다.

![CW-ADOT-EKS](../../../../images/Containers/aws-native/eks/cw-adot-collector-pipeline-eks.jpg)

*그림: Amazon EKS에 배포된 ADOT Collector 인스턴스의 파이프라인 컴포넌트*

위 아키텍처에서는 파이프라인에서 [AWS Container Insights Receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/awscontainerinsightreceiver) 인스턴스를 사용하여 Kubelet에서 직접 메트릭을 수집합니다. AWS Container Insights Receiver(`awscontainerinsightreceiver`)는 [CloudWatch Container Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html)를 지원하는 AWS 전용 수신기입니다. CloudWatch Container Insights는 컨테이너화된 애플리케이션과 마이크로서비스에서 메트릭과 로그를 수집, 집계, 요약합니다. 데이터는 [임베디드 메트릭 형식](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html)을 사용하여 성능 로그 이벤트로 수집됩니다. EMF 데이터에서 Amazon CloudWatch는 클러스터, 노드, 파드, 태스크, 서비스 수준에서 집계된 CloudWatch 메트릭을 생성할 수 있습니다. 다음은 `awscontainerinsightreceiver` 구성 예시입니다:

```
receivers:
  awscontainerinsightreceiver:
    # all parameters are optional
    collection_interval: 60s
    container_orchestrator: eks
    add_service_as_attribute: true 
    prefer_full_pod_name: false 
    add_full_pod_name_metric_label: false 
```

이를 위해 위 구성을 사용하여 Amazon EKS에 DaemonSet으로 컬렉터를 배포합니다. 또한 이 수신기가 Kubelet에서 직접 수집하는 더 완전한 메트릭 세트에 접근할 수 있습니다. 둘 이상의 ADOT Collector 인스턴스가 있으면 클러스터의 모든 노드에서 리소스 메트릭을 수집하기에 충분합니다. 단일 ADOT Collector 인스턴스는 높은 부하 시 과부하될 수 있으므로 항상 둘 이상의 컬렉터를 배포하는 것이 좋습니다.

![CW-ADOT-FARGATE](../../../../images/Containers/aws-native/eks/cw-adot-collector-pipeline.jpg)

*그림: Fargate 프로필이 있는 Amazon EKS에 배포된 ADOT Collector 인스턴스의 파이프라인 컴포넌트*

위 아키텍처에서, Kubernetes 클러스터의 워커 노드에 있는 kubelet은 */metrics/cadvisor* 엔드포인트에서 CPU, 메모리, 디스크, 네트워크 사용량과 같은 리소스 메트릭을 노출합니다. 하지만 EKS Fargate 네트워킹 아키텍처에서는 파드가 해당 워커 노드의 kubelet에 직접 접근할 수 없습니다. 따라서 ADOT Collector는 Kubernetes API Server를 호출하여 워커 노드의 kubelet에 대한 연결을 프록시하고, 해당 노드의 워크로드에 대한 kubelet의 cAdvisor 메트릭을 수집합니다. 이러한 메트릭은 Prometheus 형식으로 제공됩니다. 따라서 컬렉터는 Prometheus 서버의 드롭인 대체제로 [Prometheus Receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/prometheusreceiver) 인스턴스를 사용하여 Kubernetes API server 엔드포인트에서 이러한 메트릭을 스크래핑합니다. Kubernetes 서비스 검색을 사용하여 수신기는 EKS 클러스터의 모든 워커 노드를 검색할 수 있습니다. 따라서 둘 이상의 ADOT Collector 인스턴스가 있으면 클러스터의 모든 노드에서 리소스 메트릭을 수집하기에 충분합니다. 단일 ADOT Collector 인스턴스는 높은 부하 시 과부하될 수 있으므로 항상 둘 이상의 컬렉터를 배포하는 것이 좋습니다.

메트릭은 필터링, 이름 변경, 데이터 집계 및 변환 등을 수행하는 일련의 프로세서를 거칩니다. 다음은 위에서 설명한 Amazon EKS용 ADOT Collector 인스턴스의 파이프라인에서 사용되는 프로세서 목록입니다.

* [Filter Processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/filterprocessor)는 AWS OpenTelemetry 배포의 일부로, 이름을 기반으로 메트릭을 포함하거나 제외할 수 있습니다. 불필요한 메트릭을 필터링하기 위해 메트릭 수집 파이프라인의 일부로 사용할 수 있습니다. 예를 들어, Container Insights가 이름 접두사 `pod_`를 가진 파드 수준 메트릭만 수집하되 이름 접두사 `pod_network`를 가진 네트워킹 관련 메트릭은 제외하도록 할 수 있습니다.

```
      # filter out only renamed metrics which we care about
      filter:
        metrics:
          include:
            match_type: regexp
            metric_names:
              - new_container_.*
              - pod_.*
```

* [Metrics Transform Processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/metricstransformprocessor)는 메트릭 이름을 변경하고, 레이블 키와 값을 추가, 이름 변경 또는 삭제하는 데 사용할 수 있습니다. 또한 레이블이나 레이블 값에 대한 스케일링과 집계를 수행하는 데에도 사용할 수 있습니다.

```
     metricstransform/rename:
        transforms:
          - include: container_spec_cpu_quota
            new_name: new_container_cpu_limit_raw
            action: insert
            match_type: regexp
            experimental_match_labels: {"container": "\\S"}
```

* [Cumulative to Delta Processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/cumulativetodeltaprocessor)는 단조 증가하는 누적 합계 및 히스토그램 메트릭을 단조 증가하는 델타 메트릭으로 변환합니다. 비단조 합계와 지수 히스토그램은 제외됩니다.

```
` # convert cumulative sum datapoints to delta
 cumulativetodelta:
    metrics:
        - pod_cpu_usage_seconds_total 
        - pod_network_rx_errors`
```

* [Delta to Rate Processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/deltatorateprocessor)는 델타 합계 메트릭을 비율 메트릭으로 변환합니다. 이 비율은 게이지입니다.

```
` # convert delta to rate
    deltatorate:
        metrics:
            - pod_memory_hierarchical_pgfault 
            - pod_memory_hierarchical_pgmajfault 
            - pod_network_rx_bytes 
            - pod_network_rx_dropped 
            - pod_network_rx_errors 
            - pod_network_tx_errors 
            - pod_network_tx_packets 
            - new_container_memory_pgfault 
            - new_container_memory_pgmajfault 
            - new_container_memory_hierarchical_pgfault 
            - new_container_memory_hierarchical_pgmajfault`
```

* [Metrics Generation Processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/metricsgenerationprocessor)는 주어진 규칙에 따라 기존 메트릭을 사용하여 새로운 메트릭을 생성하는 데 사용할 수 있습니다.

```
      experimental_metricsgeneration/1:
        rules:
          - name: pod_memory_utilization_over_pod_limit
            unit: Percent
            type: calculate
            metric1: pod_memory_working_set
            metric2: pod_memory_limit
            operation: percent
```

파이프라인의 최종 컴포넌트는 [AWS CloudWatch EMF Exporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/awsemfexporter)로, 메트릭을 임베디드 메트릭 형식(EMF)으로 변환한 다음 [PutLogEvents](https://docs.aws.amazon.com/AmazonCloudWatchLogs/latest/APIReference/API_PutLogEvents.html) API를 사용하여 CloudWatch Logs로 직접 전송합니다. 다음은 Amazon EKS에서 실행되는 각 워크로드에 대해 ADOT Collector가 CloudWatch로 전송하는 메트릭 목록입니다.

* pod_cpu_utilization_over_pod_limit
* pod_cpu_usage_total
* pod_cpu_limit
* pod_memory_utilization_over_pod_limit
* pod_memory_working_set
* pod_memory_limit
* pod_network_rx_bytes
* pod_network_tx_bytes

각 메트릭은 다음 차원 세트와 연결되며 *ContainerInsights*라는 CloudWatch 네임스페이스에 수집됩니다.

* ClusterName, LaunchType
* ClusterName, Namespace, LaunchType
* ClusterName, Namespace, PodName, LaunchType

추가적으로 [ADOT용 Container Insights Prometheus 지원](https://aws.amazon.com/blogs/containers/introducing-cloudwatch-container-insights-prometheus-support-with-aws-distro-for-opentelemetry-on-amazon-ecs-and-amazon-eks/)과 [Amazon EKS에서 ADOT Collector를 배포하여 CloudWatch Container Insights를 통해 Amazon EKS 리소스 메트릭 시각화](https://aws.amazon.com/blogs/containers/introducing-amazon-cloudwatch-container-insights-for-amazon-eks-fargate-using-aws-distro-for-opentelemetry/)를 참조하여 Amazon EKS 클러스터에서 ADOT Collector 파이프라인을 설정하고 CloudWatch Container Insights에서 Amazon EKS 리소스 메트릭을 시각화하는 방법을 알아보세요. 또한 [Amazon CloudWatch Container Insights로 컨테이너화된 애플리케이션 쉽게 모니터링하기](https://community.aws/tutorials/navigating-amazon-eks/eks-monitor-containerized-applications#step-3-use-cloudwatch-logs-insights-query-to-search-and-analyze-container-logs)를 참조하세요. 이 문서에는 Amazon EKS 클러스터 구성, 컨테이너화된 애플리케이션 배포, Container Insights를 사용한 애플리케이션 성능 모니터링에 대한 단계별 안내가 포함되어 있습니다.

### Amazon EKS용 CloudWatch Container Insights의 Fluent Bit 통합

[Fluent Bit](https://fluentbit.io/)는 다양한 소스에서 데이터와 로그를 수집하고 통합하여 CloudWatch Logs를 포함한 여러 대상으로 전송할 수 있는 오픈 소스 멀티 플랫폼 로그 프로세서 및 포워더입니다. [Docker](https://www.docker.com/) 및 [Kubernetes](https://kubernetes.io/) 환경과도 완벽하게 호환됩니다. 새로 출시된 Fluent Bit 데몬셋을 사용하면 EKS 클러스터의 컨테이너 로그를 CloudWatch Logs로 전송하여 로그 저장 및 분석을 할 수 있습니다.

경량 특성 덕분에 EKS 워커 노드의 Container Insights에서 기본 로그 포워더로 Fluent Bit를 사용하면 애플리케이션 로그를 효율적이고 안정적으로 CloudWatch Logs로 스트리밍할 수 있습니다. Fluent Bit를 사용하면 Container Insights는 파드 수준에서 CPU 및 메모리 사용률 측면에서 특히 리소스 효율적인 방식으로 수천 개의 비즈니스 크리티컬 로그를 대규모로 제공할 수 있습니다. 즉, 이전에 사용되던 로그 포워더인 FluentD에 비해 Fluent Bit는 메모리 및 CPU에 대해 더 작은 리소스 풋프린트를 가지므로 더 효율적입니다. 반면 Fluent Bit 및 관련 플러그인을 포함하는 [AWS for Fluent Bit 이미지](https://github.com/aws/aws-for-fluent-bit)는 AWS 생태계 내에서 통합된 경험을 제공하는 것을 목표로 하여 새로운 AWS 기능을 더 빠르게 도입할 수 있는 추가적인 유연성을 제공합니다.

아래 아키텍처는 EKS용 CloudWatch Container Insights에서 사용하는 개별 컴포넌트를 보여줍니다:

![CW-COMPONENTS](../../../../images/Containers/aws-native/eks/cw-components.jpg)

*그림: EKS용 CloudWatch Container Insights에서 사용하는 개별 컴포넌트.*

컨테이너를 사용할 때는 가능하면 Docker JSON 로깅 드라이버를 사용하여 표준 출력(stdout)과 표준 에러 출력(stderr) 방법으로 애플리케이션 로그를 포함한 모든 로그를 푸시하는 것이 좋습니다. 이러한 이유로 EKS에서는 로깅 드라이버가 기본적으로 구성되어 있으며, 컨테이너화된 애플리케이션이 `stdout` 또는 `stderr`에 쓰는 모든 내용이 워커 노드의 `"/var/log/containers"` 아래 JSON 파일로 스트리밍됩니다. Container Insights는 기본적으로 이러한 로그를 세 가지 범주로 분류하고 Fluent Bit 내에서 각 범주에 대한 전용 입력 스트림과 CloudWatch Logs 내의 독립적인 로그 그룹을 생성합니다. 이러한 범주는 다음과 같습니다:

* 애플리케이션 로그: `"/var/log/containers/*.log"` 아래에 저장된 모든 애플리케이션 로그는 전용 `/aws/containerinsights/Cluster_Name/application` 로그 그룹으로 스트리밍됩니다. kube-proxy 및 aws-node 로그와 같은 비 애플리케이션 로그는 기본적으로 제외됩니다. 하지만 CoreDNS 로그와 같은 추가 Kubernetes 애드온 로그도 처리되어 이 로그 그룹으로 스트리밍됩니다.
* 호스트 로그: 각 EKS 워커 노드의 시스템 로그는 `/aws/containerinsights/Cluster_Name/host` 로그 그룹으로 스트리밍됩니다. 이러한 시스템 로그에는 `"/var/log/messages,/var/log/dmesg,/var/log/secure"` 파일의 내용이 포함됩니다. 컨테이너화된 워크로드의 스테이트리스하고 동적인 특성을 고려하면, EKS 워커 노드가 스케일링 활동 중에 자주 종료되므로 Fluent Bit로 실시간으로 이러한 로그를 스트리밍하고 노드가 종료된 후에도 CloudWatch Logs에서 사용할 수 있게 하는 것은 EKS 워커 노드의 Observability와 건강 상태 모니터링 측면에서 매우 중요합니다. 또한 많은 경우 워커 노드에 로그인하지 않고도 클러스터 문제를 디버그하거나 해결할 수 있으며 이러한 로그를 보다 체계적으로 분석할 수 있습니다.
* 데이터 플레인 로그: EKS는 이미 [컨트롤 플레인 로그](https://docs.aws.amazon.com/eks/latest/userguide/control-plane-logs.html)를 제공합니다. Container Insights의 Fluent Bit 통합을 통해 모든 워커 노드에서 실행되며 실행 중인 파드를 유지 관리하는 EKS 데이터 플레인 컴포넌트에서 생성되는 로그가 데이터 플레인 로그로 캡처됩니다. 이러한 로그도 `'/aws/containerinsights/Cluster_Name/dataplane'` 아래의 전용 CloudWatch 로그 그룹으로 스트리밍됩니다. kube-proxy, aws-node, Docker 런타임 로그가 이 로그 그룹에 저장됩니다. 컨트롤 플레인 로그에 더해 데이터 플레인 로그를 CloudWatch Logs에 저장하면 EKS 클러스터의 전체적인 그림을 제공하는 데 도움이 됩니다.

추가적으로 Fluent Bit 구성, Fluent Bit 모니터링 및 로그 분석과 같은 주제에 대해 [Amazon EKS와 Fluent Bit 통합](https://aws.amazon.com/blogs/containers/fluent-bit-integration-in-cloudwatch-container-insights-for-eks/)에서 자세히 알아보세요.

### Amazon EKS에서 Container Insights를 통한 비용 절감

기본 구성에서 Container Insights 수신기는 [수신기 문서](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/awscontainerinsightreceiver#available-metrics-and-resource-attributes)에 정의된 전체 메트릭 세트를 수집합니다. 수집되는 메트릭과 차원의 수가 많으며, 대규모 클러스터의 경우 메트릭 수집 및 저장 비용이 크게 증가합니다. 가치 있는 메트릭만 전송하고 비용을 절감하도록 ADOT Collector를 구성하는 두 가지 접근 방식을 보여드리겠습니다.

#### 프로세서 사용

이 접근 방식은 위에서 논의한 대로 [EMF 로그](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html)의 크기를 줄이기 위해 메트릭이나 속성을 필터링하는 OpenTelemetry 프로세서를 도입하는 것입니다. *Filter*와 *Resource*라는 두 프로세서의 기본 사용법을 보여드리겠습니다.

[Filter 프로세서](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/processor/filterprocessor/README.md)는 `otel-agent-conf`라는 `ConfigMap`에 포함할 수 있습니다:

```
processors:
  # filter processors example
  filter/include:
    # any names NOT matching filters are excluded from remainder of pipeline
    metrics:
      include:
        match_type: regexp
        metric_names:
          # re2 regexp patterns
          - ^pod_.*
  filter/exclude:
    # any names matching filters are excluded from remainder of pipeline
    metrics:
      exclude:
        match_type: regexp
        metric_names:
          - ^pod_network.*
```

[Resource 프로세서](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/processor/resourceprocessor/README.md)도 AWS OpenTelemetry Distro에 내장되어 있으며 불필요한 메트릭 속성을 제거하는 데 사용할 수 있습니다. 예를 들어, EMF 로그에서 `Kubernetes`와 `Sources` 필드를 제거하려면 파이프라인에 리소스 프로세서를 추가할 수 있습니다:

```
  # resource processors example
  resource:
    attributes:
    - key: Sources
      action: delete
    - key: kubernetes
      action: delete
```

#### 메트릭 및 차원 사용자 정의

이 접근 방식에서는 CloudWatch Logs로 전송하려는 메트릭 세트만 생성하도록 CloudWatch EMF 내보내기를 구성합니다. CloudWatch EMF 내보내기 구성의 [metric_declaration](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/5ccdbe08c6a2a43b7c6c7f9c0031a4b0348394a9/exporter/awsemfexporter/README.md#metric_declaration) 섹션을 사용하여 내보낼 메트릭과 차원의 세트를 정의할 수 있습니다. 예를 들어 기본 구성에서 파드 메트릭만 유지할 수 있습니다. 다른 차원에 관심이 없다면 차원 세트를 `[PodName, Namespace, ClusterName]`만 유지하여 메트릭 수를 줄일 수 있습니다. 이 `metric_declaration` 섹션은 다음과 같습니다:

```
  awsemf:
    namespace: ContainerInsights
    log_group_name: '/aws/containerinsights/{ClusterName}/performance'
    log_stream_name: '{NodeName}'
    resource_to_telemetry_conversion:
      enabled: true
    dimension_rollup_option: NoDimensionRollup
    parse_json_encoded_attr_values: [Sources, kubernetes]
    # Customized metric declaration section
    metric_declarations:
      # pod metrics
      - dimensions: [[PodName, Namespace, ClusterName]]
        metric_name_selectors:
          - pod_cpu_utilization
          - pod_memory_utilization
          - pod_cpu_utilization_over_pod_limit
          - pod_memory_utilization_over_pod_limit
```

이 구성은 기본 구성의 여러 차원에 대한 55개의 서로 다른 메트릭 대신 단일 차원 `[PodName, Namespace, ClusterName]`에 대해 다음 네 가지 메트릭만 생성하고 스트리밍합니다:

* pod_cpu_utilization
* pod_memory_utilization
* pod_cpu_utilization_over_pod_limit
* pod_memory_utilization_over_pod_limit

이 구성을 사용하면 기본적으로 구성된 모든 메트릭 대신 관심 있는 메트릭만 전송할 수 있습니다. 결과적으로 Container Insights의 메트릭 수집 비용을 상당히 줄일 수 있습니다. 이러한 유연성을 통해 Container Insights 고객에게 내보내는 메트릭에 대한 높은 수준의 제어를 제공합니다. `awsemf` 내보내기 구성을 수정하여 메트릭을 사용자 정의하는 것도 매우 유연하며, 전송하려는 메트릭과 차원을 모두 사용자 정의할 수 있습니다. 이는 CloudWatch로 전송되는 로그에만 적용됩니다.

위에서 논의한 두 가지 접근 방식은 상호 배타적이지 않습니다. 실제로 두 가지를 결합하여 모니터링 시스템에 수집하려는 메트릭을 높은 수준으로 유연하게 사용자 정의할 수 있습니다. 이 접근 방식을 사용하여 다음 그래프에 표시된 것처럼 메트릭 저장 및 처리와 관련된 비용을 절감합니다.

![CW-COST-EXPLORER](../../../../images/Containers/aws-native/eks/cw-cost-explorer.jpg)

*그림: AWS Cost Explorer*

위의 AWS Cost Explorer 그래프에서 소규모 EKS 클러스터(워커 노드 20개, 파드 220개)에서 ADOT Collector의 서로 다른 구성을 사용한 CloudWatch 관련 일일 비용을 확인할 수 있습니다. *8월 15일*은 기본 구성으로 ADOT Collector를 사용한 CloudWatch 요금을 보여줍니다. *8월 16일*에는 [EMF 내보내기 사용자 정의](https://aws.amazon.com/blogs/containers/cost-savings-by-customizing-metrics-sent-by-container-insights-in-amazon-eks/#customize-emf-exporter) 접근 방식을 사용하여 약 30%의 비용 절감을 확인할 수 있습니다. *8월 17일*에는 [프로세서](https://aws.amazon.com/blogs/containers/cost-savings-by-customizing-metrics-sent-by-container-insights-in-amazon-eks/#processors) 접근 방식을 사용하여 약 45%의 비용 절감을 달성했습니다.
Container Insights에서 전송하는 메트릭을 사용자 정의할 때의 트레이드오프를 고려해야 합니다. 모니터링 대상 클러스터의 가시성을 희생하면서 모니터링 비용을 줄일 수 있기 때문입니다. 또한 대시보드에서 사용하는 메트릭과 차원을 전송하지 않도록 선택할 수 있으므로 AWS 콘솔 내 Container Insights에서 제공하는 기본 대시보드가 사용자 정의된 메트릭에 의해 영향을 받을 수 있습니다. 추가 학습을 위해 [Amazon EKS에서 Container Insights가 전송하는 메트릭 사용자 정의를 통한 비용 절감](https://aws.amazon.com/blogs/containers/cost-savings-by-customizing-metrics-sent-by-container-insights-in-amazon-eks/)을 확인하세요.

### EKS Blueprints를 사용한 Container Insights 설정

[EKS Blueprints](https://aws.amazon.com/blogs/containers/bootstrapping-clusters-with-eks-blueprints/)는 계정과 리전 전반에 걸쳐 일관되고 배터리가 포함된 EKS 클러스터를 구성하고 배포하는 데 도움이 되는 Infrastructure as Code(IaC) 모듈 모음입니다. EKS Blueprints를 사용하면 [Amazon EKS 애드온](https://docs.aws.amazon.com/eks/latest/userguide/eks-add-ons.html)뿐만 아니라 Prometheus, Karpenter, Nginx, Traefik, AWS Load Balancer Controller, Container Insights, Fluent Bit, Keda, Argo CD 등 다양한 인기 오픈 소스 애드온으로 EKS 클러스터를 쉽게 부트스트랩할 수 있습니다. EKS Blueprints는 인프라 배포를 자동화하는 데 도움이 되는 두 가지 인기 IaC 프레임워크인 [HashiCorp Terraform](https://github.com/aws-ia/terraform-aws-eks-blueprints)과 [AWS Cloud Development Kit(AWS CDK)](https://github.com/aws-quickstart/cdk-eks-blueprints)로 구현되어 있습니다.

EKS Blueprints를 사용한 Amazon EKS 클러스터 생성 프로세스의 일부로, Day 2 운영 도구로서 Container Insights를 설정하여 컨테이너화된 애플리케이션과 마이크로서비스에서 메트릭과 로그를 수집, 집계, 요약하여 Amazon CloudWatch 콘솔로 보낼 수 있습니다.

### 결론

Observability 모범 사례 가이드의 이 섹션에서는 CloudWatch Container Insights에 대한 심층적인 세부 사항을 다루었습니다. Amazon CloudWatch Container Insights 소개와 Amazon EKS에서 컨테이너화된 워크로드를 관찰하는 데 어떻게 도움이 되는지 살펴보았습니다. AWS Distro for Open Telemetry와 함께 Amazon CloudWatch Container Insights를 사용하여 Container Insight 메트릭 수집을 활성화하고 Amazon CloudWatch 콘솔에서 컨테이너화된 워크로드의 메트릭을 시각화하는 방법을 심층적으로 다루었습니다. 다음으로 Amazon EKS용 CloudWatch Container Insights의 Fluent Bit 통합에 대해 깊이 다루어 Fluent Bit 내에서 전용 입력 스트림과 CloudWatch Logs 내의 애플리케이션, 호스트, 데이터 플레인 로그를 위한 독립적인 로그 그룹을 생성하는 방법을 살펴보았습니다. 그런 다음 프로세서, 메트릭 차원과 같은 두 가지 접근 방식을 통해 CloudWatch Container Insights로 비용을 절감하는 방법에 대해 이야기했습니다. 마지막으로 Amazon EKS 클러스터 생성 프로세스 중에 Container Insights를 설정하기 위한 수단으로 EKS Blueprints를 사용하는 방법에 대해 간략히 이야기했습니다. [CloudWatch Container Insights 모듈](https://catalog.workshops.aws/observability/en-US/aws-native/insights/containerinsights)에서 [One Observability Workshop](https://catalog.workshops.aws/observability/en-US)을 통해 실습 경험을 할 수 있습니다.
