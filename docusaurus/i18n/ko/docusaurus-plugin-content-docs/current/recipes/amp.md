# Amazon Managed Service for Prometheus

[Amazon Managed Service for Prometheus][amp-main] (AMP)는 대규모 컨테이너화된 애플리케이션을
손쉽게 모니터링할 수 있는 Prometheus 호환 모니터링 서비스입니다.
AMP를 사용하면 운영 메트릭의 수집, 저장 및 쿼리에 필요한 기본 인프라를 관리할 필요 없이
Prometheus 쿼리 언어(PromQL)를 사용하여 컨테이너화된 워크로드의 성능을 모니터링할 수 있습니다.
이 서비스는 높은 가용성과 확장성을 제공하며 기존 Prometheus 호환 도구와 원활하게 통합됩니다.

다음 레시피를 확인하세요:

- [AMP 시작하기][amp-gettingstarted]
- [EKS on EC2에서 ADOT를 사용하여 AMP로 수집하고 AMG에서 시각화하기](recipes/ec2-eks-metrics-go-adot-ampamg.md)
- [AMP로의 교차 계정 수집 설정][amp-xaccount]
- [AMP를 사용한 ECS 메트릭 수집][amp-ecs-metrics]
- [AMP용 Grafana Cloud Agent 구성][amp-gcwa]
- [AMP 워크스페이스를 위한 교차 리전 메트릭 수집 설정][amp-xregion-metrics]
- [EKS의 자체 호스팅 Prometheus를 AMP로 마이그레이션하는 모범 사례][amp-migration]
- [AMP 시작하기 워크숍][amp-oow]
- [Firehose 및 AWS Lambda를 통해 CloudWatch Metric Streams를 Amazon Managed Service for Prometheus로 내보내기](recipes/lambda-cw-metrics-go-amp.md)
- [Infrastructure as Code로 Terraform을 사용하여 Amazon Managed Service for Prometheus 배포 및 Alert Manager 구성](recipes/amp-alertmanager-terraform.md)
- [Amazon Managed Prometheus 및 Amazon Managed Grafana를 사용하여 EKS에서 Istio 모니터링][amp-istio-monitoring]
- [Amazon Managed Service for Prometheus 및 Amazon Managed Grafana를 사용한 Amazon EKS Anywhere 모니터링][amp-anywhere-monitoring]
- [Amazon EKS Observability Accelerator 소개][eks-accelerator]
- [AMP 및 Amazon Managed Grafana로 Prometheus mixin 대시보드 설치하기](recipes/amp-mixin-dashboards.md)
[amp-main]: https://aws.amazon.com/prometheus/
[amp-gettingstarted]: https://aws.amazon.com/blogs/mt/getting-started-amazon-managed-service-for-prometheus/
[amp-xaccount]: https://aws.amazon.com/blogs/opensource/setting-up-cross-account-ingestion-into-amazon-managed-service-for-prometheus/
[amp-ecs-metrics]: https://aws.amazon.com/blogs/opensource/metrics-collection-from-amazon-ecs-using-amazon-managed-service-for-prometheus/
[amp-gcwa]: https://aws.amazon.com/blogs/opensource/configuring-grafana-cloud-agent-for-amazon-managed-service-for-prometheus/
[amp-xregion-metrics]: https://aws.amazon.com/blogs/opensource/set-up-cross-region-metrics-collection-for-amazon-managed-service-for-prometheus-workspaces/
[amp-migration]: https://aws.amazon.com/blogs/opensource/best-practices-for-migrating-self-hosted-prometheus-on-amazon-eks-to-amazon-managed-service-for-prometheus/
[amp-oow]: https://observability.workshop.aws/en/amp.html
[amp-istio-monitoring]: https://aws.amazon.com/blogs/mt/monitor-istio-on-eks-using-amazon-managed-prometheus-and-amazon-managed-grafana/
[amp-anywhere-monitoring]: https://aws.amazon.com/blogs/containers/monitoring-amazon-eks-anywhere-using-amazon-managed-service-for-prometheus-and-amazon-managed-grafana/
[eks-accelerator]: recipes/eks-observability-accelerator.md
- [Amazon Managed Service for Prometheus 및 Alert Manager를 사용한 Amazon EC2 오토 스케일링](recipes/as-ec2-using-amp-and-alertmanager.md)
