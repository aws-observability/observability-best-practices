---
sidebar_position: 3
---

# 에이전트/컬렉터 구성

모니터링 계정 구조가 갖춰지면, 애플리케이션, 서비스, 기타 인프라 구성 요소가 CloudWatch로 텔레메트리를 전송하도록 구성해야 합니다.

이 문서는 에이전트와 컬렉터 구성에 대한 상위 수준 가이드입니다. 심층적인 지침은 이 모범 사례 가이드의 다양한 섹션을 참조하세요.

## Amazon EKS

EKS의 경우, Observability를 구성하는 가장 간단한 방법은 Amazon EKS 애드온을 사용하는 것입니다. 이를 통해 Amazon EKS용 향상된 Observability가 포함된 Container Insights가 설치됩니다. 이 애드온은 클러스터에서 인프라 metrics를 전송하기 위한 CloudWatch 에이전트를 설치하고, 컨테이너 logs를 전송하기 위한 Fluent Bit를 설치하며, 애플리케이션 성능 텔레메트리를 전송하기 위한 CloudWatch Application Signals도 활성화합니다. (Application Signals, Container Insights 등이 필요하지 않은 경우 구성 가능합니다.)

일반적으로 Amazon CloudWatch Observability EKS 애드온은 DaemonSet으로 설치됩니다.

EKS에 대한 몇 가지 옵션은 다음과 같습니다:

### EKS용 CloudWatch Agent

- Amazon CloudWatch Observability EKS 애드온
- Amazon CloudWatch Observability Helm Chart

### EKS용 OTEL Collector

또는 OTEL 컬렉터를 사용하려면 다음을 수행할 수 있습니다:
- AWS Exporters 구성
- OTLP 익스포터를 로그 및 traces OTLP 엔드포인트로 지정
- 처리 파이프라인 정의
- OTEL 라이브러리를 사용한 애플리케이션 계측(필요한 경우)

## Amazon ECS

ECS의 경우, Container Insights를 활성화하여 클러스터에 대한 인프라 metrics를 수집할 수 있습니다. Application Signals를 배포하여 애플리케이션 성능 텔레메트리와 관련 traces를 수집할 수도 있습니다. logs의 경우, awslogs 드라이버를 사용하여 로그 데이터를 CloudWatch로 전송하거나 OpenTelemetry 컬렉터를 사용하여 데이터를 전송할 수 있습니다.

ECS에 대한 몇 가지 옵션은 다음과 같습니다:

### ECS용 CloudWatch Agent

- Container Insights 활성화
- Application Signals 배포(선택 사항)
- awslogs 로그 드라이버 사용

### ECS용 OTEL Collector

또는 다음을 수행할 수 있습니다:
- 사이드카로 실행
- AWS Exporters 구성
- OTLP 엔드포인트 설정
- 처리 파이프라인 정의
- 애플리케이션 계측(필요한 경우)

## Amazon EC2 및 온프레미스

CloudWatch 에이전트를 사용하여 EC2 인스턴스, 기타 가상 머신, 온프레미스 서버에서 CloudWatch로 텔레메트리 데이터를 전송할 수 있습니다.

### 배포 옵션

- **EC2용 워크로드 감지** – 에이전트를 배포하는 자동화된 방법 제공

![EC2 Workload Detection](../../images/GettingStarted/ec2workloaddetection.png)

- **Systems Manager** – AWS Systems Manager를 사용하여 에이전트 배포 및 구성
- **맞춤형 자동화** – 자체 자동화 도구 사용
- **수동 설치** – 특정 사용 사례를 위한 수동 설치

구성 파일(자동 또는 수동)을 통해 텔레메트리를 구성/사용자 지정할 수 있으며, 설정을 미세 조정하는 데 도움이 되는 마법사가 있습니다.

### EC2용 OTEL Collector

다음과 함께 OTEL 컬렉터를 사용할 수도 있습니다:

**OTLP Exporters:**

![OTLP Configuration](../../images/GettingStarted/otlp.png)

trace 및 로그 OTLP 엔드포인트에 OTLP 익스포터를 사용합니다.

**AWS 전용 Exporters:**

![ADOT Configuration](../../images/GettingStarted/adot.png)

AWS 전용 익스포터와 처리 파이프라인을 사용합니다.

## 요약

요약하면:
1. 컴퓨팅 플랫폼(EKS, ECS, EC2)에 적합한 에이전트/컬렉터를 선택합니다
2. 자동화된 방법(애드온, Helm 차트, Systems Manager) 또는 수동 설치를 사용하여 배포합니다
3. 요구 사항에 따라 텔레메트리 수집을 구성합니다
4. 선택적으로 벤더 중립 계측을 위해 OpenTelemetry를 사용합니다

상세한 구성 가이드는 이 모범 사례 가이드에서 해당하는 컴퓨팅 플랫폼과 Observability 도구에 대한 특정 섹션을 참조하세요.
