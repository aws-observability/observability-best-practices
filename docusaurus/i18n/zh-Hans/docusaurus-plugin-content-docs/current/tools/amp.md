# Amazon Managed Service for Prometheus

[Prometheus](https://prometheus.io/) 是一个流行的开源监控工具，提供广泛的 metrics 功能和对计算节点及应用程序相关性能数据等资源的洞察。

Prometheus 使用*拉取*模型来收集数据，而 CloudWatch 使用*推送*模型。Prometheus 和 CloudWatch 用于一些重叠的用例，但它们的运行模型非常不同，定价也不同。

[Amazon Managed Service for Prometheus](https://aws.amazon.com/prometheus/) 广泛用于托管在 Kubernetes 和 [Amazon ECS](https://aws.amazon.com/ecs/) 上的容器化应用程序。

您可以使用 [CloudWatch agent](./cloudwatch_agent.md) 或 [AWS Distro for OpenTelemetry](https://aws-otel.github.io/) 在您的 EC2 实例或 ECS/EKS 集群上添加 Prometheus metric 功能。支持 Prometheus 的 CloudWatch agent 可以发现和收集 Prometheus metrics，用于监控、故障排除和对应用程序性能下降和故障进行告警。这也减少了提高 Observability 所需的监控工具数量。

CloudWatch Container Insights 对 Prometheus 的监控可以自动发现容器化系统和工作负载中的 Prometheus metrics https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ ContainerInsights-Prometheus.html
