# Amazon Managed Service for Prometheus

[Prometheus](https://prometheus.io/)는 컴퓨팅 노드 및 애플리케이션 관련 성능 데이터와 같은 리소스에 대한 광범위한 메트릭 기능과 인사이트를 제공하는 인기 있는 오픈 소스 모니터링 도구입니다.

Prometheus는 데이터를 수집하기 위해 *pull* 모델을 사용하는 반면, CloudWatch는 *push* 모델을 사용합니다. Prometheus와 CloudWatch는 일부 겹치는 사용 사례에 사용되지만, 운영 모델이 매우 다르고 가격 책정 방식도 다릅니다.

[Amazon Managed Service for Prometheus](https://aws.amazon.com/prometheus/)는 Kubernetes 및 [Amazon ECS](https://aws.amazon.com/ecs/)에서 호스팅되는 컨테이너화된 애플리케이션에 널리 사용됩니다.

[CloudWatch agent](./cloudwatch_agent.md) 또는 [AWS Distro for OpenTelemetry](https://aws-otel.github.io/)를 사용하여 EC2 인스턴스 또는 ECS/EKS 클러스터에 Prometheus 메트릭 기능을 추가할 수 있습니다. Prometheus를 지원하는 CloudWatch agent는 애플리케이션 성능 저하 및 장애를 더 빠르게 모니터링, 문제 해결 및 경보하기 위해 Prometheus 메트릭을 검색하고 수집합니다. 이를 통해 Observability를 개선하는 데 필요한 모니터링 도구의 수도 줄일 수 있습니다.

Prometheus용 CloudWatch Container Insights 모니터링은 컨테이너화된 시스템 및 워크로드에서 Prometheus 메트릭의 자동 검색을 지원합니다. https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ ContainerInsights-Prometheus.html
