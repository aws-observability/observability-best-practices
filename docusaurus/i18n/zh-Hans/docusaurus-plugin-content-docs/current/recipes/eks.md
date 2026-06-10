# Amazon Elastic Kubernetes Service

[Amazon Elastic Kubernetes Service][eks-main]（EKS）让您能够灵活地在 AWS Cloud 或本地环境中启动、运行和扩展 Kubernetes 应用程序。

请查看以下方案，按计算引擎分组：

## EKS on EC2

### Logs

- [CloudWatch Container Insights 中的 Fluent Bit 集成（适用于 EKS）][eks-cw-fb]
- [使用 EFK Stack 记录日志][eks-ws-efk]
- [EKS 上 Fluent Bit 和 FluentD 的示例日志架构][eks-logging]

### Metrics

- [Amazon Managed Service for Prometheus 入门][amp-gettingstarted]
- [在 EC2 上的 EKS 中使用 ADOT 将 metrics 摄入 AMP 并在 AMG 中可视化][ec2-eks-metrics-go-adot-ampamg]
- [为 Amazon Managed Service for Prometheus 配置 Grafana Cloud Agent][gcwa-amp]
- [使用 Prometheus 和 Grafana 监控集群][eks-ws-prom-grafana]
- [使用 Managed Prometheus 和 Managed Grafana 进行监控][eks-ws-amp-amg]
- [CloudWatch Container Insights][eks-ws-cw-ci]
- [为 AMP 工作区设置跨区域 metrics 收集][amp-xregion]
- [使用 Amazon Managed Service for Prometheus 监控 EKS 上的 App Mesh 环境][eks-am-amp-amg]
- [使用 Amazon Managed Prometheus 和 Amazon Managed Grafana 监控 EKS 上的 Istio][eks-istio-monitoring]
- [使用 KEDA 和 Amazon CloudWatch 对 Kubernetes 工作负载进行主动自动扩展][eks-keda-cloudwatch-scaling]
- [使用 Amazon Managed Service for Prometheus 和 Amazon Managed Grafana 监控 Amazon EKS Anywhere][eks-anywhere-monitoring]

### Traces

- [将 X-Ray tracing 迁移到 AWS Distro for OpenTelemetry][eks-otel-xray]
- [使用 X-Ray 进行 tracing][eks-ws-xray]

## EKS on Fargate

### Logs

- [Fluent Bit for Amazon EKS on AWS Fargate 现已推出][eks-fargate-logging]
- [EKS 上 Fluent Bit 和 FluentD 的示例日志架构][eks-fb-example]

### Metrics

- [在 Fargate 上的 EKS 中使用 ADOT 将 metrics 摄入 AMP 并在 AMG 中可视化][fargate-eks-metrics-go-adot-ampamg]
- [CloudWatch Container Insights][eks-ws-cw-ci]
- [为 AMP 工作区设置跨区域 metrics 收集][amp-xregion]

### Traces

- [在 Fargate 上的 EKS 中使用 ADOT 与 AWS X-Ray][fargate-eks-xray-go-adot-amg]
- [使用 X-Ray 进行 tracing][eks-ws-xray]


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
