# Amazon CloudWatch

[Amazon CloudWatch][cw-main] (CW)는 DevOps 엔지니어, 개발자, 사이트 신뢰성 엔지니어(SRE) 및 IT 관리자를 위해 구축된 모니터링 및 Observability 서비스입니다.
CloudWatch는 로그, 메트릭, 이벤트의 형태로 모니터링 및 운영 데이터를 수집하여 AWS 리소스, 애플리케이션, AWS 및 온프레미스 서버에서 실행되는 서비스에 대한 통합 뷰를 제공합니다.

다음 레시피를 확인하세요:

- [CloudWatch Logs, Lambda 및 SNS를 사용한 RDS 능동적 데이터베이스 모니터링 구축][rds-cw]
- [EKS에서 Kubernetes 네이티브 개발자를 위한 CloudWatch 중심 Observability 구현][swa-eks-cw]
- [CW Synthetics를 통한 Canary 생성][cw-synths]
- [로그 쿼리를 위한 CloudWatch Logs Insights][cw-logsi]
- [Lambda Insights][cw-lambda]
- [CloudWatch를 통한 이상 탐지][cw-am]
- [CloudWatch를 통한 메트릭 알람][cw-alarms]
- [백프레셔를 방지하기 위한 컨테이너 로깅 옵션 선택][cw-fluentbit]
- [ECS 및 EKS에서 AWS Distro for OpenTelemetry를 활용한 CloudWatch Container Insights Prometheus 지원 소개][cwci-adot]
- [CW Container Insights를 사용한 ECS 컨테이너화된 애플리케이션 및 마이크로서비스 모니터링][cwci-ecs]
- [CW Container Insights를 사용한 EKS 컨테이너화된 애플리케이션 및 마이크로서비스 모니터링][cwci-eks]
- [Firehose 및 AWS Lambda를 통해 CloudWatch Metric Streams를 Amazon Managed Service for Prometheus로 내보내기](recipes/lambda-cw-metrics-go-amp.md)
- [KEDA 및 Amazon CloudWatch를 활용한 Kubernetes 워크로드 능동적 오토스케일링][cw-keda-eks-scaling]
- [Amazon CloudWatch Metrics Explorer를 사용하여 리소스 태그로 필터링된 메트릭 집계 및 시각화][metrics-explorer-filter-by-tags]


[cw-main]: https://aws.amazon.com/cloudwatch/
[rds-cw]: https://aws.amazon.com/blogs/database/build-proactive-database-monitoring-for-amazon-rds-with-amazon-cloudwatch-logs-aws-lambda-and-amazon-sns/
[swa-eks-cw]: https://aws.amazon.com/blogs/opensource/implementing-cloudwatch-centric-observability-for-kubernetes-native-developers-in-amazon-elastic-kubernetes-service/
[cw-synths]: https://observability.workshop.aws/en/synthetics.html
[cw-logsi]: https://observability.workshop.aws/en/logsinsights.html
[cw-lambda]: https://observability.workshop.aws/en/logsinsights.html
[cw-am]: https://observability.workshop.aws/en/anomalydetection.html
[cw-alarms]: https://observability.workshop.aws/en/alarms/_mericalarm.html
[cw-fluentbit]: https://aws.amazon.com/blogs/containers/choosing-container-logging-options-to-avoid-backpressure/
[cwci-adot]: https://aws.amazon.com/blogs/containers/introducing-cloudwatch-container-insights-prometheus-support-with-aws-distro-for-opentelemetry-on-amazon-ecs-and-amazon-eks/
[cwci-ecs]: https://observability.workshop.aws/en/containerinsights/ecs.html
[cwci-eks]: https://observability.workshop.aws/en/containerinsights/eks.html
[cw-keda-eks-scaling]: https://aws.amazon.com/blogs/mt/proactive-autoscaling-of-kubernetes-workloads-with-keda-using-metrics-ingested-into-amazon-cloudwatch/
[metrics-explorer-filter-by-tags]: recipes/metrics-explorer-filter-by-tags.md
