# EKS에서 Prometheus로 메트릭 전송하기

Amazon Elastic Kubernetes Service(EKS)에서 컨테이너화된 워크로드를 실행할 때, AWS Managed Prometheus(AMP)를 활용하여 애플리케이션과 인프라에서 메트릭을 수집하고 분석할 수 있습니다. AMP는 완전 관리형 Prometheus 호환 모니터링 솔루션을 제공하여 Prometheus 기반 모니터링의 배포와 관리를 간소화합니다.

EKS 컨테이너화된 워크로드에서 AMP로 메트릭을 전송하려면 Managed Prometheus Collector 구성을 사용할 수 있습니다. Managed Prometheus Collector는 애플리케이션과 서비스에서 메트릭을 스크래핑하여 저장 및 분석을 위해 AMP 워크스페이스로 전송하는 AMP의 구성 요소입니다.

![EKS AMP](./images/eksamp.png)
*그림 1: EKS에서 AMP로 메트릭 전송*

## Managed Prometheus Collector 구성

1. **AMP 워크스페이스 활성화**: 먼저 AWS 계정에 AMP 워크스페이스가 생성되어 있는지 확인합니다. AMP 워크스페이스를 아직 설정하지 않았다면 AWS 문서를 참고하여 생성합니다.

2. **Managed Prometheus Collector 구성**: AMP 워크스페이스 내에서 **Managed Prometheus Collectors** 섹션으로 이동하여 새 Collector 구성을 생성합니다.

3. **스크래핑 구성 정의**: Collector 구성에서 메트릭을 스크래핑할 대상을 지정합니다. EKS 워크로드의 경우 Kubernetes 서비스 디스커버리 구성을 정의하여 Collector가 Kubernetes Pod 및 Service에서 메트릭을 동적으로 검색하고 스크래핑할 수 있습니다.

  Kubernetes 서비스 디스커버리 구성 예시:

  ```yaml
  kubernetes_sd_configs:
    - role: pod
      namespaces:
        names:
          - namespace1
          - namespace2
```          
이 구성은 Collector가 namespace1과 namespace2 Kubernetes 네임스페이스에서 실행 중인 Pod의 메트릭을 스크래핑하도록 지시합니다.

4. **Prometheus 어노테이션 구성**: 컨테이너화된 워크로드에서 메트릭 수집을 활성화하려면 Kubernetes Pod 또는 Service에 적절한 Prometheus 어노테이션을 추가해야 합니다. 이 어노테이션은 메트릭 엔드포인트 및 기타 구성 설정에 대한 정보를 제공합니다.
Prometheus 어노테이션 예시:
```yaml
annotations:
  prometheus.io/scrape: "true"
  prometheus.io/port: "8080"
  prometheus.io/path: "/metrics"
```  
이 어노테이션은 Prometheus Collector가 Pod 또는 Service의 포트 8080에 있는 /metrics 엔드포인트에서 메트릭을 스크래핑해야 함을 나타냅니다.

5. **계측이 포함된 워크로드 배포**: 적절한 메트릭 엔드포인트를 노출하고 필요한 Prometheus 어노테이션을 포함하는 컨테이너화된 워크로드를 EKS에 배포합니다. Minikube, Helm 또는 AWS Cloud Development Kit(CDK)와 같은 도구를 사용하여 EKS 워크로드를 배포하고 관리할 수 있습니다.

6. **메트릭 수집 확인**: Managed Prometheus Collector가 구성되고 워크로드가 배포되면 AMP 워크스페이스에 수집된 메트릭이 표시됩니다. AMP 쿼리 에디터를 사용하여 EKS 워크로드의 메트릭을 탐색하고 시각화할 수 있습니다.

## 추가 고려사항

- 인증 및 권한 부여: AMP는 IAM 역할과 서비스 어카운트를 포함한 다양한 인증 및 권한 부여 메커니즘을 지원하여 모니터링 데이터에 대한 접근을 보호합니다.

- AWS Observability 서비스와의 통합: AMP를 Amazon CloudWatch, AWS X-Ray 등 다른 AWS Observability 서비스와 통합하여 AWS 환경 전반에 걸친 포괄적인 Observability를 달성할 수 있습니다.

AMP의 Managed Prometheus Collector를 활용하면 기본 Prometheus 인프라를 관리하고 확장할 필요 없이 EKS 컨테이너화된 워크로드에서 효율적으로 메트릭을 수집하고 분석할 수 있습니다. AMP는 EKS 애플리케이션과 인프라를 모니터링하기 위한 완전 관리형 확장 가능한 솔루션을 제공합니다.
