# Amazon Managed Service for Prometheus

[Amazon Managed Service for Prometheus][amp-main] (AMP) 是一项兼容 Prometheus 的监控服务，可以轻松地大规模监控容器化应用程序。借助 AMP，您可以使用 Prometheus 查询语言 (PromQL) 来监控容器化工作负载的性能，而无需管理用于摄取、存储和查询操作指标所需的底层基础设施。

请查看以下实践方案：

- [AMP 入门][amp-gettingstarted]
- [在 EC2 上的 EKS 中使用 ADOT 将数据摄取到 AMP 并在 AMG 中可视化](recipes/ec2-eks-metrics-go-adot-ampamg.md)
- [设置跨账户摄取到 AMP][amp-xaccount]
- [使用 AMP 从 ECS 收集 Metrics][amp-ecs-metrics]
- [为 AMP 配置 Grafana Cloud Agent][amp-gcwa]
- [为 AMP 工作区设置跨区域 Metrics 收集][amp-xregion-metrics]
- [将 EKS 上自托管 Prometheus 迁移到 AMP 的最佳实践][amp-migration]
- [AMP 入门研讨会][amp-oow]
- [通过 Firehose 和 AWS Lambda 将 CloudWatch Metric Streams 导出到 Amazon Managed Service for Prometheus](recipes/lambda-cw-metrics-go-amp.md)
- [使用 Terraform 作为基础设施即代码部署 Amazon Managed Service for Prometheus 并配置 Alert Manager](recipes/amp-alertmanager-terraform.md)
- [使用 Amazon Managed Prometheus 和 Amazon Managed Grafana 监控 EKS 上的 Istio][amp-istio-monitoring]
- [使用 Amazon Managed Service for Prometheus 和 Amazon Managed Grafana 监控 Amazon EKS Anywhere][amp-anywhere-monitoring]
- [Amazon EKS Observability Accelerator 简介][eks-accelerator]
- [使用 AMP 和 Amazon Managed Grafana 安装 Prometheus mixin dashboards](recipes/amp-mixin-dashboards.md)
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
- [使用 Amazon Managed Service for Prometheus 和 Alert Manager 自动扩展 Amazon EC2](recipes/as-ec2-using-amp-and-alertmanager.md)
