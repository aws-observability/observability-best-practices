# CloudWatch Container Insights 

## 소개

Amazon CloudWatch Container Insights는 컨테이너화된 애플리케이션과 마이크로서비스에서 메트릭과 로그를 수집, 집계, 요약하는 강력한 도구입니다. 이 문서에서는 EKS Fargate 워크로드에 대한 ADOT과 CloudWatch Container Insights 통합의 설계, 배포 프로세스 및 이점을 설명합니다.

## EKS Fargate용 ADOT Collector 설계

ADOT Collector는 세 가지 주요 구성 요소로 이루어진 파이프라인 아키텍처를 사용합니다:

1. Receiver: 지정된 형식의 데이터를 수신하여 내부 형식으로 변환합니다.
2. Processor: 배치 처리, 필터링, 변환 등의 작업을 수행합니다.
3. Exporter: 메트릭, 로그 또는 트레이스를 전송할 대상을 결정합니다.

EKS Fargate 환경에서 ADOT Collector는 Prometheus Receiver를 사용하여 Kubernetes API 서버로부터 메트릭을 스크래핑합니다. API 서버는 워커 노드의 kubelet에 대한 프록시 역할을 합니다. 이 접근 방식은 EKS Fargate의 네트워킹 제한으로 인해 kubelet에 직접 접근할 수 없기 때문에 필요합니다. 수집된 메트릭은 필터링, 이름 변경, 데이터 집계, 변환을 위한 일련의 프로세서를 거칩니다. 최종적으로 AWS CloudWatch EMF Exporter가 메트릭을 Embedded Metric Format(EMF)으로 변환하여 CloudWatch Logs로 전송합니다.

![CI EKS fargate with ADOT](./images/cieksfargateadot.png)
*그림 1: EKS Fargate에서 ADOT을 활용한 Container Insights*
<!--https://aws.amazon.com/blogs/containers/introducing-amazon-cloudwatch-container-insights-for-amazon-eks-fargate-using-aws-distro-for-opentelemetry/
-->
## 배포 프로세스

EKS Fargate 클러스터에 ADOT Collector를 배포하려면 다음 단계를 따릅니다:

1. Kubernetes로 EKS 클러스터를 생성합니다.
2. Fargate Pod 실행 역할을 설정합니다.
3. 필요한 네임스페이스에 대한 Fargate 프로필을 정의합니다.
4. 필요한 권한을 갖춘 ADOT Collector용 IAM 역할을 생성합니다.
5. 제공된 매니페스트를 사용하여 ADOT Collector를 Kubernetes StatefulSet으로 배포합니다.
6. 메트릭 수집을 테스트하기 위한 샘플 워크로드를 배포합니다.


## 장단점

### 장점:

1. 통합 모니터링: EKS EC2와 Fargate 워크로드 전반에 걸쳐 일관된 모니터링 경험을 제공합니다.
2. 확장성: 단일 ADOT Collector 인스턴스로 EKS 클러스터의 모든 워커 노드에서 메트릭을 검색하고 수집할 수 있습니다.
3. 풍부한 메트릭: CPU, 메모리, 디스크, 네트워크 사용량을 포함한 포괄적인 시스템 메트릭을 수집합니다.
4. 손쉬운 통합: 기존 CloudWatch 대시보드 및 알람과 원활하게 통합됩니다.
5. 비용 효율성: 추가 모니터링 인프라 없이 Fargate 워크로드를 모니터링할 수 있습니다.

### 단점:

1. 구성 복잡성: ADOT Collector를 설정하려면 IAM 역할, Fargate 프로필, Kubernetes 리소스를 신중하게 구성해야 합니다.
2. 리소스 오버헤드: ADOT Collector 자체가 Fargate 클러스터의 리소스를 소비하므로 용량 계획 시 이를 고려해야 합니다.


AWS Distro for OpenTelemetry와 CloudWatch Container Insights의 통합은 EKS Fargate 워크로드의 컨테이너화된 애플리케이션을 모니터링하기 위한 강력한 솔루션을 제공합니다. 다양한 EKS 배포 옵션에 걸쳐 통합된 모니터링 경험을 제공하며 OpenTelemetry 프레임워크의 확장성과 유연성을 활용합니다. Fargate 워크로드에서 시스템 메트릭을 수집할 수 있게 함으로써 고객이 애플리케이션 성능에 대한 깊은 인사이트를 얻고, 정보에 기반한 스케일링 결정을 내리며, 리소스 활용을 최적화할 수 있도록 합니다.
