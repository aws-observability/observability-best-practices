# ECS 워크로드 모니터링
<!--with ADOT, AWS X-Ray, and Amazon Managed Service for Prometheus-->

## 소개

컨테이너화된 애플리케이션 환경에서 효과적인 모니터링은 안정성과 성능을 유지하는 데 매우 중요합니다. 이 문서에서는 AWS Distro for OpenTelemetry(ADOT), AWS X-Ray, Amazon Managed Service for Prometheus를 활용한 Amazon Elastic Container Service(ECS) 워크로드의 고급 모니터링 솔루션을 설명합니다.

## 아키텍처 개요

모니터링 아키텍처는 애플리케이션과 ADOT Collector를 모두 호스팅하는 ECS 태스크를 중심으로 구성됩니다. 이 설정을 통해 애플리케이션 환경에서 직접 포괄적인 데이터를 수집할 수 있습니다.

![ECS AMP](./images/ecs.png)
*그림 1: ECS에서 AMP 및 X-Ray로 메트릭 전송*

## 핵심 구성 요소

### ECS 태스크
ECS 태스크는 애플리케이션과 모니터링 구성 요소를 캡슐화하는 기본 단위입니다.

### 샘플 애플리케이션
ECS 태스크 내에서 컨테이너화된 애플리케이션이 실행되며, 이것이 모니터링 대상 워크로드입니다.

### AWS Distro for OpenTelemetry(ADOT) Collector
애플리케이션과 함께 배포된 ADOT Collector는 텔레메트리 데이터의 중앙 집계 지점 역할을 합니다. 애플리케이션에서 메트릭과 트레이스를 모두 수집합니다.

### AWS X-Ray
X-Ray는 ADOT Collector로부터 트레이스 데이터를 수신하여 요청 흐름과 서비스 종속성에 대한 상세한 인사이트를 제공합니다.

### Amazon Managed Service for Prometheus
이 서비스는 ADOT Collector가 수집한 메트릭을 저장하고 관리하며, 메트릭 저장 및 쿼리를 위한 확장 가능한 솔루션을 제공합니다.

## 데이터 흐름

1. 샘플 애플리케이션이 운영 중에 텔레메트리 데이터를 생성합니다.
2. 동일한 ECS 태스크에서 실행되는 ADOT Collector가 애플리케이션에서 이 데이터를 수집합니다.
3. 트레이스 데이터는 분산 트레이싱 분석을 위해 AWS X-Ray로 전달됩니다.
4. 메트릭은 저장 및 추후 분석을 위해 Amazon Managed Service for Prometheus로 전송됩니다.

## 이점

- **포괄적인 모니터링**: 메트릭과 트레이스를 모두 캡처하여 애플리케이션 성능에 대한 전체적인 뷰를 제공합니다.
- **확장성**: 관리형 서비스를 활용하여 대량의 텔레메트리 데이터를 처리합니다.
- **통합**: ECS 및 기타 AWS 서비스와 원활하게 동작합니다.
- **운영 오버헤드 감소**: 관리형 서비스를 활용하여 인프라 관리의 필요성을 최소화합니다.

## 구현 시 고려사항

- ECS 태스크가 X-Ray 및 Prometheus로 데이터를 전송할 수 있도록 적절한 IAM 역할과 권한을 구성해야 합니다.
- ECS 태스크 내의 리소스 할당은 애플리케이션과 ADOT Collector를 모두 고려해야 합니다.
- 완전한 Observability 솔루션을 위해 메트릭 및 트레이스와 함께 로그 수집 구현을 고려합니다.

## 결론

이 아키텍처는 OpenTelemetry의 강력한 기능과 AWS 관리형 서비스를 결합하여 ECS 워크로드를 위한 견고한 모니터링 솔루션을 제공합니다. 애플리케이션 성능과 동작에 대한 깊은 인사이트를 제공하여 컨테이너화된 환경에서의 빠른 문제 해결과 정보에 기반한 의사결정을 가능하게 합니다.
