# Amazon Elastic Kubernetes Service

[Amazon Elastic Kubernetes Service][eks-main] (EKS)는 AWS 클라우드 또는 온프레미스에서 Kubernetes 애플리케이션을 시작, 실행 및 확장할 수 있는 유연성을 제공합니다.

다음 레시피를 컴퓨팅 엔진별로 그룹화하여 확인하세요:

## EC2 기반 EKS

### 로그

- [EKS를 위한 CloudWatch Container Insights에서의 Fluent Bit 통합][eks-cw-fb]
- [EFK 스택을 사용한 로깅][eks-ws-efk]
- [EKS에서 Fluent Bit 및 FluentD를 위한 로깅 아키텍처 샘플][eks-logging]

### 메트릭

- [Amazon Managed Service for Prometheus 시작하기][amp-gettingstarted]
- [EC2 기반 EKS에서 ADOT를 사용하여 AMP로 메트릭을 수집하고 AMG에서 시각화하기][ec2-eks-metrics-go-adot-ampamg]
- [Amazon Managed Service for Prometheus를 위한 Grafana Cloud Agent 구성][gcwa-amp]
- [Prometheus 및 Grafana를 사용한 클러스터 모니터링][eks-ws-prom-grafana]
- [Managed Prometheus 및 Managed Grafana를 사용한 모니터링][eks-ws-amp-amg]
- [CloudWatch Container Insights를 사용한 모니터링][eks-ws-cw-ci]
- [AMP 워크스페이스를 위한 교차 리전 메트릭 수집 설정][amp-xregion]
- [Amazon Managed Service for Prometheus를 사용한 EKS에서의 App Mesh 환경 모니터링][eks-am-amp-amg]
- [Amazon Managed Prometheus 및 Amazon Managed Grafana를 사용한 EKS에서의 Istio 모니터링][eks-istio-monitoring]
- [KEDA 및 Amazon CloudWatch를 활용한 Kubernetes 워크로드의 능동적 오토스케일링][eks-keda-cloudwatch-scaling]
- [Amazon Managed Service for Prometheus 및 Amazon Managed Grafana를 사용한 Amazon EKS Anywhere 모니터링][eks-anywhere-monitoring]

### 트레이스

- [X-Ray 트레이싱에서 AWS Distro for OpenTelemetry로 마이그레이션하기][eks-otel-xray]
- [X-Ray를 사용한 트레이싱][eks-ws-xray]

## Fargate 기반 EKS

### 로그

- [AWS Fargate 기반 Amazon EKS를 위한 Fluent Bit 출시][eks-fargate-logging]
- [EKS에서 Fluent Bit 및 FluentD를 위한 로깅 아키텍처 샘플][eks-fb-example]

### 메트릭

- [Fargate 기반 EKS에서 ADOT를 사용하여 AMP로 메트릭을 수집하고 AMG에서 시각화하기][fargate-eks-metrics-go-adot-ampamg]
- [CloudWatch Container Insights를 사용한 모니터링][eks-ws-cw-ci]
- [AMP 워크스페이스를 위한 교차 리전 메트릭 수집 설정][amp-xregion]

### 트레이스

- [Fargate 기반 EKS에서 ADOT와 AWS X-Ray 사용하기][fargate-eks-xray-go-adot-amg]
- [X-Ray를 사용한 트레이싱][eks-ws-xray]


[eks-main]: https://aws.amazon.com/eks/
[eks-cw-fb]: https://aws.amazon.com/blogs/containers/fluent-bit-integration-in-cloudwatch-container-insights-for-eks/
[eks-ws-efk]: https://www.eksworkshop.com/intermediate/230_logging/
[eks-logging]: https://github.com/aws-samples/amazon-eks-fluent-logging-examples
[amp-gettingstarted]: https://aws.amazon.com/blogs/mt/getting-started-amazon-managed-service-for-prometheus/
[ec2-eks-metrics-go-adot-ampamg]: recipes/ec2-eks-metrics-go-adot-ampamg.md
[gcwa-amp]: https://aws.amazon.com/blogs/opensource/configuring-grafana-cloud-agent-for-amazon-managed-service-for-prometheus/
[eks-ws-prom-grafana]: https://www.eksworkshop.com/intermediate/240_monitoring/
[eks-ws-amp-amg]: https://www.eksworkshop.com/intermediate/246_monitoring_amp_amg/
[eks-ws-cw-ci]: https://www.eksworkshop.com/intermediate/250_cloudwatch_container_insights/
[fargate-eks-metrics-go-adot-ampamg]: recipes/fargate-eks-metrics-go-adot-ampamg.md
[amp-xregion]: https://aws.amazon.com/blogs/opensource/set-up-cross-region-metrics-collection-for-amazon-managed-service-for-prometheus-workspaces/
[eks-otel-xray]: https://aws.amazon.com/blogs/opensource/migrating-x-ray-tracing-to-aws-distro-for-opentelemetry/
[eks-ws-xray]: https://www.eksworkshop.com/intermediate/245_x-ray/x-ray/
[eks-fargate-logging]: https://aws.amazon.com/blogs/containers/fluent-bit-for-amazon-eks-on-aws-fargate-is-here/
[eks-fb-example]: https://github.com/aws-samples/amazon-eks-fluent-logging-examples
[eks-am-amp-amg]: recipes/servicemesh-monitoring-ampamg.md
[fargate-eks-xray-go-adot-amg]: recipes/fargate-eks-xray-go-adot-amg.md
[eks-istio-monitoring]: https://aws.amazon.com/blogs/mt/monitor-istio-on-eks-using-amazon-managed-prometheus-and-amazon-managed-grafana/
[eks-keda-cloudwatch-scaling]: https://aws.amazon.com/blogs/mt/proactive-autoscaling-of-kubernetes-workloads-with-keda-using-metrics-ingested-into-amazon-cloudwatch/
[eks-anywhere-monitoring]: https://aws.amazon.com/blogs/containers/monitoring-amazon-eks-anywhere-using-amazon-managed-service-for-prometheus-and-amazon-managed-grafana/
