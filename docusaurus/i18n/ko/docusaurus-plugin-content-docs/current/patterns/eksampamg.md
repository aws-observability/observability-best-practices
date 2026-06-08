# AWS 오픈소스 서비스를 활용한 EKS 모니터링
<!-- Workloads with Node Exporter, Amazon Managed Prometheus, and Grafana Visualization
-->
컨테이너화된 애플리케이션과 Kubernetes 환경에서 모니터링과 Observability는 워크로드의 안정성, 성능, 효율성을 보장하는 데 매우 중요합니다. Amazon Elastic Kubernetes Service(EKS)는 컨테이너화된 애플리케이션을 배포하고 관리하기 위한 강력하고 확장 가능한 플랫폼을 제공하며, Node Exporter, Amazon Managed Prometheus, Grafana와 같은 도구와 결합하면 EKS 워크로드를 위한 포괄적인 모니터링 솔루션을 구현할 수 있습니다.

Node Exporter는 호스트 머신에서 다양한 하드웨어 및 커널 관련 메트릭을 노출하는 Prometheus exporter입니다. EKS 클러스터에 Node Exporter를 DaemonSet으로 배포하면 각 워커 노드에서 CPU, 메모리, 디스크, 네트워크 사용량은 물론 다양한 시스템 수준 메트릭을 수집할 수 있습니다.

Amazon Managed Prometheus는 AWS에서 제공하는 완전 관리형 서비스로, Prometheus 모니터링 인프라의 배포, 관리, 확장을 간소화합니다. Node Exporter를 Amazon Managed Prometheus와 통합하면 Prometheus 인스턴스를 직접 관리하고 확장하는 오버헤드 없이 노드 수준 메트릭을 고가용성과 확장성 있는 방식으로 수집하고 저장할 수 있습니다.

Grafana는 Prometheus와 원활하게 통합되는 강력한 오픈소스 데이터 시각화 및 모니터링 도구입니다. Grafana를 Amazon Managed Prometheus 인스턴스에 연결하도록 구성하면 EKS 워크로드와 기반 인프라의 상태 및 성능에 대한 실시간 인사이트를 제공하는 풍부하고 커스터마이징 가능한 대시보드를 만들 수 있습니다.

![EKS AMP AMG](./images/eksnodeexporterampamg.png)
*그림 1: EKS 노드 메트릭을 AMP로 전송하고 AMG로 시각화*


EKS 클러스터에 이 모니터링 스택을 배포하면 여러 이점을 얻을 수 있습니다:

1. 포괄적인 가시성: Node Exporter에서 메트릭을 수집하고 Grafana에서 시각화함으로써 애플리케이션 수준부터 기반 인프라까지 EKS 워크로드에 대한 엔드투엔드 가시성을 확보하여 문제를 사전에 식별하고 해결할 수 있습니다.

2. 확장성과 안정성: Amazon Managed Prometheus와 Grafana는 고확장성과 고안정성을 위해 설계되어 성능이나 가용성을 저하시키지 않고 EKS 워크로드가 확장됨에 따라 모니터링 솔루션이 원활하게 성장할 수 있습니다.

3. 중앙집중식 모니터링: Amazon Managed Prometheus가 중앙집중식 모니터링 플랫폼 역할을 하여 여러 EKS 클러스터의 메트릭을 통합할 수 있으며, 서로 다른 환경이나 리전에 걸쳐 워크로드를 모니터링하고 비교할 수 있습니다.

4. 커스텀 대시보드 및 알림: Grafana의 강력한 대시보드 및 알림 기능을 통해 특정 모니터링 요구에 맞는 커스텀 시각화를 생성하고, 관련 메트릭을 표면화하며, 중요 이벤트나 임계값에 대한 알림을 설정할 수 있습니다.

5. AWS 서비스와의 통합: Amazon Managed Prometheus는 Amazon CloudWatch, AWS X-Ray 등 다른 AWS 서비스와 원활하게 통합되어 통합 모니터링 솔루션 내에서 다양한 소스의 메트릭을 상관 분석하고 시각화할 수 있습니다.

EKS 클러스터에 이 모니터링 스택을 구현하려면 다음 일반 단계를 따릅니다:

1. EKS 워커 노드에 Node Exporter를 DaemonSet으로 배포하여 노드 수준 메트릭을 수집합니다.
2. Amazon Managed Prometheus 워크스페이스를 설정하고 Node Exporter에서 메트릭을 스크래핑하도록 구성합니다.
3. EKS 클러스터 내에 또는 별도 서비스로 Grafana를 설치 및 구성하고 Amazon Managed Prometheus 워크스페이스에 연결합니다.
4. 모니터링 요구사항에 따라 커스텀 Grafana 대시보드를 생성하고 알림을 구성합니다.

이 모니터링 솔루션은 강력한 기능을 제공하지만, Node Exporter, Prometheus, Grafana로 인한 잠재적 오버헤드와 리소스 소비를 고려하는 것이 중요합니다. 모니터링 구성 요소가 애플리케이션 워크로드와 리소스를 경합하지 않도록 신중한 계획과 리소스 할당이 필요합니다.

또한 모니터링 솔루션이 데이터 보안, 접근 제어, 보존 정책에 대한 모범 사례를 준수하는지 확인해야 합니다. 안전한 통신 채널, 인증 메커니즘, 데이터 암호화를 구현하여 모니터링 데이터의 기밀성과 무결성을 유지하는 것이 중요합니다.

결론적으로, EKS 클러스터에 Node Exporter, Amazon Managed Prometheus, Grafana를 배포하면 컨테이너화된 워크로드를 위한 포괄적인 모니터링 솔루션을 제공합니다. 이 도구들을 활용하면 애플리케이션의 성능과 상태에 대한 깊은 인사이트를 얻어 사전 문제 탐지, 효율적인 리소스 활용, 정보에 기반한 의사결정이 가능합니다. 다만 리소스 소비, 보안, 규정 준수 요구사항을 고려하여 이 모니터링 스택을 신중하게 계획하고 구현하여 EKS 워크로드를 위한 효과적이고 견고한 모니터링 솔루션을 보장하는 것이 필수적입니다.
