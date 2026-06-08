# Amazon Elastic Container Service

[Amazon Elastic Container Service][ecs-main] (ECS)는 AWS와 긴밀하게 통합되어 컨테이너화된 애플리케이션을 쉽게 배포, 관리 및 확장할 수 있도록 지원하는 완전관리형 컨테이너 오케스트레이션 서비스입니다.

다음 레시피를 컴퓨팅 엔진별로 그룹화하여 확인하세요:

## 일반

- [ECS에서의 AWS Distro for OpenTelemetry Collector 배포 패턴][adot-patterns-ecs]
- [AWS Distro for OpenTelemetry를 활용한 Amazon ECS 모니터링 설정 간소화][ecs-adot-integration]

## EC2 기반 ECS

### 로그

- [Amazon ECS 태스크를 위한 FireLens 내부 동작 방식][firelens-uth]

### 메트릭

- [AWS Distro for OpenTelemetry Collector를 사용한 Amazon ECS에서의 교차 계정 메트릭 수집][adot-xaccount-metrics]
- [Amazon Managed Service for Prometheus를 사용한 ECS에서의 메트릭 수집][ecs-amp]
- [AWS App Mesh에서 Amazon CloudWatch로 Envoy 메트릭 전송하기][ecs-appmesh-cw]

## Fargate 기반 ECS

### 로그

- [Amazon ECS 및 AWS Fargate에서 Fluent Bit을 사용한 FireLens 로깅 아키텍처 샘플][firelens-fb]


[ecs-main]: https://aws.amazon.com/ecs/
[adot-patterns-ecs]: https://aws.amazon.com/blogs/opensource/deployment-patterns-for-the-aws-distro-for-opentelemetry-collector-with-amazon-elastic-container-service/
[firelens-uth]: https://aws.amazon.com/blogs/containers/under-the-hood-firelens-for-amazon-ecs-tasks/
[adot-xaccount-metrics]: https://aws.amazon.com/blogs/opensource/using-aws-distro-for-opentelemetry-collector-for-cross-account-metrics-collection-on-amazon-ecs/
[ecs-amp]: https://aws.amazon.com/blogs/opensource/metrics-collection-from-amazon-ecs-using-amazon-managed-service-for-prometheus/
[firelens-fb]: https://github.com/aws-samples/amazon-ecs-firelens-examples#fluent-bit-examples
[ecs-adot-integration]: https://aws.amazon.com/blogs/opensource/simplifying-amazon-ecs-monitoring-set-up-with-aws-distro-for-opentelemetry/
[ecs-appmesh-cw]: https://aws.amazon.com/blogs/containers/sending-envoy-metrics-from-aws-app-mesh-to-amazon-cloudwatch/
