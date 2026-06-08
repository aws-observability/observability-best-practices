# EKS Observability : 필수 메트릭

# 현재 환경

모니터링은 인프라 및 애플리케이션 소유자가 시스템의 과거 및 현재 상태를 확인하고 이해할 수 있는 솔루션으로 정의되며, 정의된 메트릭 또는 로그를 수집하는 데 초점을 맞춥니다.

모니터링은 수년에 걸쳐 발전해 왔습니다. 문제를 디버그하고 해결하기 위한 디버그 및 덤프 로그 작업에서 시작하여 syslogs, top 등과 같은 명령줄 도구를 사용한 기본 모니터링으로 발전했고, 이를 대시보드에서 시각화할 수 있게 되었습니다. 클라우드의 등장과 규모의 증가로 우리는 그 어느 때보다 많은 것을 추적하고 있습니다. 업계는 인프라 및 애플리케이션 소유자가 시스템을 능동적으로 문제 해결하고 디버그할 수 있는 솔루션인 Observability로 더 많이 전환했습니다. Observability는 메트릭에서 도출된 패턴을 보는 데 더 초점을 맞춥니다.


# 메트릭, 왜 중요한가?

메트릭은 생성된 시간 순서로 유지되는 일련의 숫자 값입니다. 환경의 서버 수, 디스크 사용량, 초당 처리하는 요청 수 또는 이러한 요청을 완료하는 지연 시간까지 모든 것을 추적하는 데 사용됩니다. 메트릭은 시스템이 어떻게 수행되고 있는지 알려주는 데이터입니다. 소규모든 대규모든 클러스터를 운영하든, 시스템의 건강 상태와 성능에 대한 인사이트를 얻으면 개선 영역을 식별하고, 문제를 해결하고 추적하며, 전체적으로 워크로드의 성능과 효율성을 개선할 수 있습니다. 이러한 변경 사항은 클러스터에 소비하는 시간과 리소스에 영향을 미칠 수 있으며, 이는 비용으로 직결됩니다.


# 메트릭 수집

EKS 클러스터에서 메트릭을 수집하는 것은 [세 가지 컴포넌트](/recipes/telemetry/)로 구성됩니다:

1. 소스: 이 가이드에 나열된 것과 같이 메트릭이 생성되는 곳.
2. 에이전트: EKS 환경에서 실행되는 애플리케이션으로, 종종 에이전트라고 불리며, 모니터링 데이터를 수집하고 이 데이터를 두 번째 컴포넌트로 푸시합니다. 이 컴포넌트의 예로는 [AWS Distro for OpenTelemetry(ADOT)](https://aws-otel.github.io/)와 [CloudWatch Agent](/tools/cloudwatch_agent/)가 있습니다.
3. 목적지: 모니터링 데이터 저장 및 분석 솔루션으로, 일반적으로 [시계열 형식 데이터](/signals/metrics/)에 최적화된 데이터 서비스입니다. 이 컴포넌트의 예로는 [Amazon Managed Service for Prometheus](https://aws.amazon.com/prometheus/)와 [AWS CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/deploy-container-insights-EKS.html)가 있습니다.

참고: 이 섹션에서 구성 예시는 [AWS Observability Accelerator](https://aws-observability.github.io/terraform-aws-observability-accelerator/)의 관련 섹션에 대한 링크입니다. 이는 EKS 메트릭 수집 구현에 대한 최신 안내와 예시를 제공하기 위한 것입니다.

## 관리형 오픈 소스 솔루션

[AWS Distro for OpenTelemetry(ADOT)](https://aws-otel.github.io/)는 사용자가 상관관계 있는 메트릭과 트레이스를 [Amazon Managed Service for Prometheus](https://aws.amazon.com/prometheus/)와 [AWS CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/deploy-container-insights-EKS.html)와 같은 다양한 모니터링 데이터 수집 솔루션으로 전송할 수 있게 하는 [OpenTelemetry](https://opentelemetry.io/) 프로젝트의 지원 버전입니다. ADOT는 [EKS 관리형 애드온](https://docs.aws.amazon.com/eks/latest/userguide/eks-add-ons.html)을 통해 EKS 클러스터에 설치할 수 있으며 이 페이지에 나열된 것과 같은 메트릭과 워크로드 트레이스를 수집하도록 구성할 수 있습니다. AWS는 ADOT 애드온이 Amazon EKS와 호환됨을 검증했으며, 최신 버그 수정 및 보안 패치로 정기적으로 업데이트됩니다. [ADOT 모범 사례 및 추가 정보.](/guides/operational/adot-at-scale/operating-adot-collector/)


## ADOT + AMP

AWS Distro for OpenTelemetry(ADOT), Amazon Managed Service for Prometheus(AMP), Amazon Managed Service for Grafana(AMG)를 시작하는 가장 빠른 방법은 AWS Observability Accelerator의 [인프라 모니터링 예시](https://aws-observability.github.io/terraform-aws-observability-accelerator/eks/)를 활용하는 것입니다. Accelerator 예시는 기본 메트릭 수집, 알림 규칙, Grafana 대시보드가 포함된 도구와 서비스를 환경에 배포합니다.

ADOT의 설치, 구성 및 운영에 대한 추가 정보는 [EKS 관리형 ADOT 애드온](https://docs.aws.amazon.com/eks/latest/userguide/opentelemetry.html)에 대한 AWS 문서를 참조하세요.

### 소스

EKS 메트릭은 전체 솔루션의 다양한 계층에 있는 여러 위치에서 생성됩니다. 다음은 필수 메트릭 섹션에서 호출되는 메트릭 소스를 요약한 표입니다.


|계층	|소스	|도구	|설치 및 추가 정보	|Helm Chart	|
|---	|---	|---	|---	|---	|
|컨트롤 플레인	|*api server endpoint*/metrics	|N/A - api server가 prometheus 형식으로 메트릭을 직접 노출	|https://docs.aws.amazon.com/eks/latest/userguide/prometheus.html	|N/A	|
|클러스터 상태	|*kube-state-metrics-http-endpoint*:8080/metrics	|kube-state-metrics	|https://github.com/kubernetes/kube-state-metrics#overview	|https://github.com/kubernetes/kube-state-metrics#helm-chart	|
|Kube Proxy	|*kube-proxy-http*:10249/metrics	|N/A - kube proxy가 prometheus 형식으로 메트릭을 직접 노출	|https://kubernetes.io/docs/reference/command-line-tools-reference/kube-proxy/	|N/A	|
|VPC CNI	|*vpc-cni-metrics-helper*/metrics	|cni-metrics-helper	|https://github.com/aws/amazon-vpc-cni-k8s/blob/master/cmd/cni-metrics-helper/README.md	|https://github.com/aws/amazon-vpc-cni-k8s/tree/master/charts/cni-metrics-helper	|
|Core DNS	|*core-dns*:9153/metrics	|N/A - core DNS가 prometheus 형식으로 메트릭을 직접 노출	|https://github.com/coredns/coredns/tree/master/plugin/metrics	|N/A	|
|노드	|*prom-node-exporter-http*:9100/metrics	|prom-node-exporter	|https://github.com/prometheus/node_exporter https://prometheus.io/docs/guides/node-exporter/#node-exporter-metrics	|https://github.com/prometheus-community/helm-charts/tree/main/charts/prometheus-node-exporter	|
|Kubelet/Pod	|*kubelet*/metrics/cadvisor	|kubelet 또는 api server를 통해 프록시됨	|https://kubernetes.io/docs/concepts/cluster-administration/system-metrics/	|N/A	|

### 에이전트: AWS Distro for OpenTelemetry

AWS는 AWS EKS ADOT 관리형 애드온을 통해 EKS 클러스터에 ADOT를 설치, 구성, 운영하는 것을 권장합니다. 이 애드온은 ADOT 오퍼레이터/컬렉터 커스텀 리소스 모델을 활용하여 클러스터에 여러 ADOT 컬렉터를 배포, 구성, 관리할 수 있습니다. 이 애드온의 설치, 고급 구성 및 운영에 대한 자세한 정보는 이 [문서](https://aws-otel.github.io/docs/getting-started/adot-eks-add-on)를 확인하세요.

참고: AWS EKS ADOT 관리형 애드온 웹 콘솔은 [ADOT 애드온의 고급 구성](https://docs.aws.amazon.com/eks/latest/userguide/deploy-collector-advanced-configuration.html)에 사용할 수 있습니다.

ADOT 컬렉터 구성에는 두 가지 컴포넌트가 있습니다.

1. 컬렉터 배포 모드(deployment, daemonset 등)를 포함하는 [컬렉터 구성](https://github.com/aws-observability/aws-otel-community/blob/master/sample-configs/operator/collector-config-amp.yaml).
2. 메트릭 수집에 필요한 수신기, 프로세서, 내보내기를 포함하는 [OpenTelemetry 파이프라인 구성](https://opentelemetry.io/docs/collector/configuration/). 구성 스니펫 예시:

```
config: |
    extensions:
      sigv4auth:
        region: <YOUR_AWS_REGION>
        service: "aps"

    receivers:
      #
      # Scrape configuration for the Prometheus Receiver
      # This is the same configuration used when Prometheus is installed using the community Helm chart
      #  
      prometheus:
        config:
          global:
            scrape_interval: 60s
            scrape_timeout: 10s

          scrape_configs:
          - job_name: kubernetes-apiservers
            bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token
            kubernetes_sd_configs:
            - role: endpoints
            relabel_configs:
            - action: keep
              regex: default;kubernetes;https
              source_labels:
              - __meta_kubernetes_namespace
              - __meta_kubernetes_service_name
              - __meta_kubernetes_endpoint_port_name
            scheme: https
            tls_config:
              ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
              insecure_skip_verify: true

              ...
              ...

    exporters:
      prometheusremotewrite:
        endpoint: <YOUR AMP WRITE ENDPOINT URL>
        auth:
          authenticator: sigv4auth
      logging:
        loglevel: warn
    extensions:
      sigv4auth:
        region: <YOUR_AWS_REGION>
        service: aps
      health_check:
      pprof:
        endpoint: :1888
      zpages:
        endpoint: :55679
    processors:
      batch/metrics:
        timeout: 30s
        send_batch_size: 500
    service:
      extensions: [pprof, zpages, health_check, sigv4auth]
      pipelines:
        metrics:
          receivers: [prometheus]
          processors: [batch/metrics]
          exporters: [logging, prometheusremotewrite]
```

완전한 모범 사례 컬렉터 구성, ADOT 파이프라인 구성 및 Prometheus 스크래핑 구성은 [Observability Accelerator의 Helm Chart](https://github.com/aws-observability/terraform-aws-observability-accelerator/blob/main/modules/eks-monitoring/otel-config/templates/opentelemetrycollector.yaml)에서 찾을 수 있습니다.


### 목적지: Amazon Managed Service for Prometheus

ADOT 컬렉터 파이프라인은 Prometheus Remote Write 기능을 활용하여 AMP 인스턴스로 메트릭을 내보냅니다. 구성 스니펫 예시, AMP WRITE ENDPOINT URL에 주목하세요:

```
    exporters:
      prometheusremotewrite:
        endpoint: <YOUR AMP WRITE ENDPOINT URL>
        auth:
          authenticator: sigv4auth
      logging:
        loglevel: warn
```

완전한 모범 사례 컬렉터 구성, ADOT 파이프라인 구성 및 Prometheus 스크래핑 구성은 [Observability Accelerator의 Helm Chart](https://github.com/aws-observability/terraform-aws-observability-accelerator/blob/main/modules/eks-monitoring/otel-config/templates/opentelemetrycollector.yaml)에서 찾을 수 있습니다.

AMP 구성 및 사용에 대한 모범 사례는 [여기](/recipes/amp/)에 있습니다.

# 관련 메트릭은 무엇인가?

메트릭이 거의 없던 시대는 지났습니다. 오늘날에는 반대로 수백 개의 메트릭을 사용할 수 있습니다. 관련 메트릭을 결정할 수 있는 것은 Observability 우선 사고방식으로 시스템을 구축하는 데 있어 중요합니다.

이 가이드는 사용 가능한 메트릭의 다양한 그룹을 설명하고 인프라 및 애플리케이션에 Observability를 구축할 때 어떤 것에 집중해야 하는지 설명합니다. 아래 메트릭 목록은 모범 사례를 기반으로 모니터링을 권장하는 메트릭 목록입니다.

다음 섹션에 나열된 메트릭은 [AWS Observability Accelerator Grafana 대시보드](https://github.com/aws-observability/terraform-aws-observability-accelerator/tree/main/modules/eks-monitoring)와 [Kube Prometheus Stack 대시보드](https://monitoring.mixins.dev/)에서 강조된 메트릭에 추가됩니다.

## 컨트롤 플레인 메트릭

Amazon EKS 컨트롤 플레인은 AWS에서 관리하며 AWS에서 관리하는 계정에서 실행됩니다. etcd 및 Kubernetes API 서버와 같은 Kubernetes 컴포넌트를 실행하는 컨트롤 플레인 노드로 구성됩니다. Kubernetes는 파드, 배포, 네임스페이스의 시작 및 종료와 같은 클러스터의 활동에 대해 사용자에게 알리기 위해 다양한 이벤트를 게시합니다. Amazon EKS 컨트롤 플레인은 핵심 컴포넌트가 제대로 기능하고 클러스터에 필요한 기본 활동을 수행할 수 있는지 확인하기 위해 추적해야 하는 중요한 컴포넌트입니다.

컨트롤 플레인 API Server는 수천 개의 메트릭을 노출하며, 아래 표는 모니터링을 권장하는 필수 컨트롤 플레인 메트릭을 나열합니다.

|이름	|메트릭	|설명	|이유	|
|---	|---	|---	|---	|
|API Server 총 요청	|apiserver_request_total	|각 verb, dry run 값, 그룹, 버전, 리소스, 범위, 컴포넌트, HTTP 응답 코드별 apiserver 요청 카운터.	|	|
|API Server 지연	|apiserver_request_duration_seconds	|각 verb, dry run 값, 그룹, 버전, 리소스, 서브리소스, 범위, 컴포넌트별 응답 지연 분포(초).	|	|
|요청 지연	|rest_client_request_duration_seconds	|verb 및 URL별 요청 지연(초).	|	|
|총 요청	|rest_client_requests_total	|상태 코드, 메서드, 호스트별로 분류된 HTTP 요청 수.	|	|
|API Server 요청 기간	|apiserver_request_duration_seconds_bucket	|Kubernetes API 서버에 대한 각 요청의 지연을 초 단위로 측정	|	|
|API Server 요청 지연 합계	|apiserver_request_latencies_sum	|K8 API 서버가 요청을 처리하는 데 걸리는 총 시간을 추적하는 누적 카운터	|	|
|API Server 등록된 watchers	|apiserver_registered_watchers	|주어진 리소스에 대해 현재 등록된 watchers 수	|	|
|API Server 오브젝트 수	|apiserver_storage_object	|마지막 검사 시점에 kind별로 분류된 저장된 오브젝트 수.	|	|
|Admission controller 지연	|apiserver_admission_controller_admission_duration_seconds	|이름으로 식별되고 각 작업, API 리소스, 유형(validate 또는 admit)별로 분류된 Admission controller 지연 히스토그램(초).	|	|
|Etcd 지연	|etcd_request_duration_seconds	|각 작업 및 오브젝트 유형별 Etcd 요청 지연(초).	|	|
|Etcd DB 크기	|apiserver_storage_db_total_size_in_bytes	|Etcd 데이터베이스 크기.	|etcd 데이터베이스 사용량을 사전에 모니터링하고 한도 초과를 방지하는 데 도움이 됩니다.	|

## 클러스터 상태 메트릭

클러스터 상태 메트릭은 `kube-state-metrics`(KSM)에 의해 생성됩니다. KSM은 클러스터에서 파드로 실행되는 유틸리티로 Kubernetes API Server를 청취하여 클러스터 상태와 클러스터 내 Kubernetes 오브젝트에 대한 인사이트를 Prometheus 메트릭으로 제공합니다. 이 메트릭을 사용하려면 먼저 KSM을 [설치](https://github.com/kubernetes/kube-state-metrics)해야 합니다. 이러한 메트릭은 Kubernetes가 효과적으로 파드 스케줄링을 수행하는 데 사용되며, 배포, 레플리카 셋, 노드, 파드와 같은 내부 오브젝트의 건강 상태에 초점을 맞춥니다. 클러스터 상태 메트릭은 상태, 용량, 가용성에 대한 파드 정보를 노출합니다. 클러스터의 스케줄링 작업 성능을 추적하여 성능을 추적하고, 문제를 사전에 파악하며, 클러스터의 건강 상태를 모니터링하는 것이 필수적입니다.

|이름	|메트릭	|설명	|
|---	|---	|---	|
|노드 상태	|kube_node_status_condition	|노드의 현재 건강 상태. 노드 조건 세트와 각각에 대해 `true`, `false` 또는 `unknown`을 반환	|
|원하는 파드 수	|kube_deployment_spec_replicas 또는 kube_daemonset_status_desired_number_scheduled	|Deployment 또는 DaemonSet에 지정된 파드 수	|
|현재 파드 수	|kube_deployment_status_replicas 또는 kube_daemonset_status_current_number_scheduled	|Deployment 또는 DaemonSet에서 현재 실행 중인 파드 수	|
|파드 용량	|kube_node_status_capacity_pods	|노드에서 허용되는 최대 파드 수	|
|사용 가능한 파드	|kube_deployment_status_replicas_available 또는 kube_daemonset_status_number_available	|Deployment 또는 DaemonSet에서 현재 사용 가능한 파드 수	|
|사용 불가능한 파드	|kube_deployment_status_replicas_unavailable 또는 kube_daemonset_status_number_unavailable	|Deployment 또는 DaemonSet에서 현재 사용 불가능한 파드 수	|
|파드 준비 상태	|kube_pod_status_ready	|파드가 클라이언트 요청을 처리할 준비가 되었는지 여부	|
|파드 상태	|kube_pod_status_phase	|파드의 현재 상태; 값은 pending/running/succeeded/failed/unknown	|
|파드 대기 이유	|kube_pod_container_status_waiting_reason	|컨테이너가 대기 상태에 있는 이유	|
|파드 종료 상태	|kube_pod_container_status_terminated	|컨테이너가 현재 종료된 상태인지 여부	|
|스케줄링 대기 중인 파드	|pending_pods	|노드 할당을 대기 중인 파드 수	|
|파드 스케줄링 시도	|pod_scheduling_attempts	|파드 스케줄링 시도 횟수	|

## 클러스터 애드온 메트릭

클러스터 애드온은 Kubernetes 애플리케이션에 운영 지원 기능을 제공하는 소프트웨어입니다. 여기에는 Observability 에이전트나 클러스터가 네트워킹, 컴퓨팅, 스토리지를 위한 기본 AWS 리소스와 상호작용할 수 있게 하는 Kubernetes 드라이버와 같은 소프트웨어가 포함됩니다. Amazon EKS는 모든 클러스터에 대해 Amazon VPC CNI 플러그인, `kube-proxy`, CoreDNS와 같은 자체 관리형 애드온을 자동으로 설치합니다.

이러한 클러스터 애드온은 네트워킹, 도메인 이름 확인 등 다양한 영역에서 운영 지원을 제공합니다. 중요한 지원 인프라와 컴포넌트가 어떻게 운영되고 있는지에 대한 인사이트를 제공합니다. 애드온 메트릭을 추적하는 것은 클러스터의 운영 건강 상태를 이해하는 데 중요합니다.

아래는 필수 메트릭과 함께 모니터링을 고려해야 하는 필수 애드온입니다.

## Amazon VPC CNI 플러그인

Amazon EKS는 Amazon VPC Container Network Interface(VPC CNI) 플러그인을 통해 클러스터 네트워킹을 구현합니다. CNI 플러그인을 통해 Kubernetes Pod는 VPC 네트워크에서와 동일한 IP 주소를 가질 수 있습니다. 보다 구체적으로, Pod 내의 모든 컨테이너는 네트워크 네임스페이스를 공유하며 로컬 포트를 사용하여 서로 통신할 수 있습니다. VPC CNI 애드온을 사용하면 Amazon EKS 클러스터의 보안과 안정성을 지속적으로 보장하고 애드온 설치, 구성, 업데이트에 필요한 노력을 줄일 수 있습니다.

VPC CNI 애드온 메트릭은 CNI Metrics Helper에 의해 노출됩니다. IP 주소 할당 모니터링은 건강한 클러스터를 보장하고 IP 고갈 문제를 방지하는 데 기본적입니다. [최신 네트워킹 모범 사례와 수집 및 모니터링할 VPC CNI 메트릭은 여기](https://aws.github.io/aws-eks-best-practices/networking/vpc-cni/#monitor-ip-address-inventory)에서 확인하세요.

## CoreDNS 메트릭

CoreDNS는 Kubernetes 클러스터 DNS로 사용할 수 있는 유연하고 확장 가능한 DNS 서버입니다. CoreDNS 파드는 클러스터의 모든 파드에 대한 이름 확인을 제공합니다. DNS 집약적인 워크로드를 실행하면 DNS 스로틀링으로 인해 간헐적인 CoreDNS 실패가 발생할 수 있으며, 이는 애플리케이션에 영향을 미칠 수 있습니다.

핵심 [CoreDNS 성능 메트릭 추적을 위한 최신 모범 사례](https://aws.github.io/aws-eks-best-practices/reliability/docs/dataplane/#monitor-coredns-metrics)와 [DNS 스로틀링 문제에 대한 CoreDNS 트래픽 모니터링](https://aws.github.io/aws-eks-best-practices/networking/monitoring/)을 확인하세요.


## Pod/컨테이너 메트릭

애플리케이션의 모든 계층에서 사용량을 추적하는 것이 중요하며, 여기에는 클러스터 내에서 실행되는 노드와 파드를 자세히 살펴보는 것이 포함됩니다. 파드 차원에서 사용 가능한 모든 메트릭 중에서, 이 메트릭 목록은 클러스터에서 실행되는 워크로드의 상태를 이해하는 데 실질적으로 유용합니다. CPU, 메모리, 네트워크 사용량을 추적하면 애플리케이션 관련 문제를 진단하고 해결할 수 있습니다. 워크로드 메트릭을 추적하면 EKS에서 실행되는 워크로드를 적정 크기로 조정하기 위한 리소스 활용에 대한 인사이트를 제공합니다.

|메트릭	|PromQL 쿼리 예시	|차원	|
|---	|---	|---	|
|네임스페이스별 실행 중인 파드 수	|count by(namespace) (kube_pod_info)	|네임스페이스별 클러스터당	|
|파드당 컨테이너별 CPU 사용량	|sum(rate(container_cpu_usage_seconds_total\{container!=""\}[5m])) by (namespace, pod)	|네임스페이스별 파드별 클러스터당	|
|파드당 메모리 사용률	|sum(container_memory_usage_bytes\{container!=""\}) by (namespace, pod)	|네임스페이스별 파드별 클러스터당	|
|파드당 수신 네트워크 바이트	|sum by(pod) (rate(container_network_receive_bytes_total[5m]))	|네임스페이스별 파드별 클러스터당	|
|파드당 전송 네트워크 바이트	|sum by(pod) (rate(container_network_transmit_bytes_total[5m]))	|네임스페이스별 파드별 클러스터당	|
|컨테이너당 컨테이너 재시작 횟수	|increase(kube_pod_container_status_restarts_total[15m]) > 3	|네임스페이스별 파드별 클러스터당	|

## 노드 메트릭

Kube State Metrics와 Prometheus node exporter는 클러스터의 노드에 대한 메트릭 통계를 수집합니다. 노드의 상태, CPU 사용량, 메모리, 파일 시스템, 트래픽을 추적하는 것은 노드 활용도를 이해하는 데 중요합니다. 노드 리소스가 어떻게 활용되고 있는지 이해하는 것은 클러스터에서 실행할 워크로드 유형에 맞는 인스턴스 유형과 스토리지를 효과적으로 선택하는 데 중요합니다. 아래 메트릭은 추적해야 하는 필수 메트릭 중 일부입니다.


|메트릭	|PromQL 쿼리 예시	|차원	|
|---	|---	|---	|
|노드 CPU 사용률	|sum(rate(container_cpu_usage_seconds_total\{container!=""\}[5m])) by (node)	|노드별 클러스터당	|
|노드 메모리 사용률	|sum(container_memory_usage_bytes\{container!=""\}) by (node)	|노드별 클러스터당	|
|노드 네트워크 총 바이트	|sum by (instance) (rate(node_network_receive_bytes_total[3m]))+sum by (instance) (rate(node_network_transmit_bytes_total[3m]))	|노드별 클러스터당	|
|노드 CPU 예약 용량	|sum(kube_node_status_capacity\{cluster!=""\}) by (node)	|노드별 클러스터당	|
|노드당 실행 중인 파드 수	|sum(kubelet_running_pods) by (instance)	|노드별 클러스터당	||노드 파일시스템 사용량	|rate(container_fs_reads_bytes_total\{job="kubelet", device=~"mmcblk.p.+\|.*nvme.+\|rbd.+\|sd.+\|vd.+\|xvd.+\|dm-.+\|dasd.+", container!="", cluster="", namespace!=""\}[$__rate_interval]) + rate(container_fs_writes_bytes_total\{job="kubelet", device=~"mmcblk.p\|.*nvme.+\|rbd.+\|sd.+\|vd.+\|xvd.+\|dm-.+\|dasd.+",container!="", cluster="", namespace!=""\}	|노드별 클러스터당	|
|클러스터 CPU 사용률	|sum(rate(node_cpu_seconds_total\{mode!="idle",mode!="iowait",mode!="steal"\}[5m]))	|클러스터당	|
|클러스터 메모리 사용률	|1 - sum(:node_memory_MemAvailable_bytes:sum\{cluster=""\}) / sum(node_memory_MemTotal_bytes\job="node-exporter",cluster=""\})	|클러스터당	|
|클러스터 네트워크 총 바이트	|sum(rate(node_network_receive_bytes_total[3m]))+sum(rate(node_network_transmit_bytes_total[3m]))	|클러스터당	|
|실행 중인 파드 수	|sum(kubelet_running_pod_count\{cluster=""\})	|클러스터당	|
|실행 중인 컨테이너 수	|sum(kubelet_running_container_count\{cluster=""\})	|클러스터당	|
|클러스터 CPU 제한	|sum(kube_node_status_allocatable\{resource="cpu"\})	|클러스터당	|
|클러스터 메모리 제한	|sum(kube_node_status_allocatable\{resource="memory"\})	|클러스터당	|
|클러스터 노드 수	|count(kube_node_info) OR sum(kubelet_node_name\{cluster=""\})	|클러스터당	|

# 추가 리소스

## AWS 서비스

[https://aws-otel.github.io/](https://aws-otel.github.io/)

[https://aws.amazon.com/prometheus](https://aws.amazon.com/prometheus)

[https://aws.amazon.com/cloudwatch/features/](https://aws.amazon.com/cloudwatch/features/)

## 블로그

[https://aws.amazon.com/blogs/containers/](https://aws.amazon.com/blogs/containers/)

[https://aws.amazon.com/blogs/containers/metrics-and-traces-collection-using-amazon-eks-add-ons-for-aws-distro-for-opentelemetry/](https://aws.amazon.com/blogs/containers/metrics-and-traces-collection-using-amazon-eks-add-ons-for-aws-distro-for-opentelemetry/)

[https://aws.amazon.com/blogs/containers/](https://aws.amazon.com/blogs/containers/)

[https://aws.amazon.com/blogs/containers/introducing-amazon-cloudwatch-container-insights-for-amazon-eks-fargate-using-aws-distro-for-opentelemetry/](https://aws.amazon.com/blogs/containers/introducing-amazon-cloudwatch-container-insights-for-amazon-eks-fargate-using-aws-distro-for-opentelemetry/)

## Infrastructure as Code 리소스

[https://github.com/aws-observability/terraform-aws-observability-accelerator](https://github.com/aws-observability/terraform-aws-observability-accelerator)

[https://github.com/aws-ia/terraform-aws-eks-blueprints](https://github.com/aws-ia/terraform-aws-eks-blueprints)
