# Amazon CloudWatch

[Amazon CloudWatch][cw-main] (CW) 是一项为 DevOps 工程师、开发人员、站点可靠性工程师 (SRE) 和 IT 管理人员构建的监控和可观测性服务。CloudWatch 以 logs、metrics 和事件的形式收集监控和运营数据，为您提供 AWS 资源、应用程序以及在 AWS 和本地服务器上运行的服务的统一视图。

查看以下实用方案：

- [使用 CW Logs、Lambda 和 SNS 构建 RDS 主动数据库监控][rds-cw]
- [在 EKS 中为 Kubernetes 原生开发人员实施以 CloudWatch 为中心的可观测性][swa-eks-cw]
- [通过 CW Synthetics 创建 Canaries][cw-synths]
- [使用 CloudWatch Logs Insights 查询日志][cw-logsi]
- [Lambda Insights][cw-lambda]
- [通过 CloudWatch 进行异常检测][cw-am]
- [通过 CloudWatch 配置 Metrics 告警][cw-alarms]
- [选择容器日志选项以避免背压][cw-fluentbit]
- [在 ECS 和 EKS 上使用 AWS Distro for OpenTelemetry 引入 CloudWatch Container Insights Prometheus 支持][cwci-adot]
- [使用 CW Container Insights 监控 ECS 容器化应用程序和微服务][cwci-ecs]
- [使用 CW Container Insights 监控 EKS 容器化应用程序和微服务][cwci-eks]
- [通过 Firehose 和 AWS Lambda 将 CloudWatch Metric Streams 导出到 Amazon Managed Service for Prometheus](recipes/lambda-cw-metrics-go-amp.md)
- [使用 KEDA 和 Amazon CloudWatch 实现 Kubernetes 工作负载的主动自动扩展][cw-keda-eks-scaling]
- [使用 Amazon CloudWatch Metrics Explorer 聚合和可视化按资源标签过滤的 metrics][metrics-explorer-filter-by-tags]


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
