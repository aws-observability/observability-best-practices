# Amazon Managed Service for Prometheus - 常见问题

## 目前支持哪些 AWS 区域？是否可以从其他区域收集 metrics？

请参阅我们的[文档](https://docs.aws.amazon.com/prometheus/latest/userguide/what-is-Amazon-Managed-Service-Prometheus.html)了解我们支持的最新区域列表。请告诉我们您希望支持哪些区域，以便我们更好地确定现有产品功能请求 (PFR) 的优先级。您始终可以从任何区域收集数据并将其发送到我们支持的特定区域。以下博客提供了更多详情：[Amazon Managed Service for Prometheus 的跨区域 metrics 收集](https://aws.amazon.com/blogs/opensource/set-up-cross-region-metrics-collection-for-amazon-managed-service-for-prometheus-workspaces/)。

## 在 Cost Explorer 或 [CloudWatch 作为 AWS 计费费用](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/gs_monitor_estimated_charges_with_cloudwatch.html)中查看计量和/或计费需要多长时间？

我们会在摄取的 metric 样本上传到 S3 后（每 2 小时一次）立即对其进行计量。查看 Amazon Managed Service for Prometheus 的计量和费用报告可能需要长达 3 小时。

## Prometheus 服务只能从集群（EKS/ECS）中抓取 metrics 吗？

对于其他计算环境的文档不足，我们深表歉意。您可以使用 Prometheus server 从 [EC2 抓取 Prometheus metrics](https://aws.amazon.com/blogs/opensource/using-amazon-managed-service-for-prometheus-to-monitor-ec2-environments/) 以及任何其他可以安装 Prometheus server 的计算环境，只要您配置了 remote write 并设置了 [AWS SigV4 proxy](https://github.com/awslabs/aws-sigv4-proxy)。[EC2 博客](https://aws.amazon.com/blogs/opensource/using-amazon-managed-service-for-prometheus-to-monitor-ec2-environments/)链接中有一个"Running aws-sigv4-proxy"部分，可以向您展示如何运行它。我们确实需要添加更多文档来帮助客户简化在其他计算环境上运行 AWS SigV4 的方式。

## 如何将 Amazon Managed Service for Prometheus 连接到 Grafana？有相关文档吗？

我们使用 [Grafana 中默认可用的 Prometheus 数据源](https://grafana.com/docs/grafana/latest/datasources/prometheus/)通过 PromQL 查询 Amazon Managed Service for Prometheus。以下是一些帮助您入门的文档和博客：
1. [服务文档](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-onboard-query.html)
1. [在 EC2 上设置 Grafana](https://aws.amazon.com/blogs/opensource/setting-up-grafana-on-ec2-to-query-metrics-from-amazon-managed-service-for-prometheus/)

## 减少发送到 Amazon Managed Service for Prometheus 的样本数量有哪些最佳实践？

要减少摄取到 Amazon Managed Service for Prometheus 的样本数量，客户可以延长抓取间隔（例如，从 30 秒改为 1 分钟）或减少抓取的序列数量。更改抓取间隔对样本数量的影响比减少序列数量更为显著，将抓取间隔加倍可以将摄取的样本量减半。

## 如何将 CloudWatch metrics 发送到 Amazon Managed Service for Prometheus？

我们建议使用 [CloudWatch metric streams 将 CloudWatch metrics 发送到 Amazon Managed Service for Prometheus](https://aws-observability.github.io/aws-observability/recipes/recipes/lambda-cw-metrics-go-amp/)。此集成的一些潜在不足之处包括：
1. 需要一个 Lambda 函数来调用 Amazon Managed Service for Prometheus API，
1. 在将 CloudWatch metrics 摄取到 Amazon Managed Service for Prometheus 之前无法用元数据（如 AWS 标签）来丰富它们，
1. metrics 只能按命名空间过滤（粒度不够细）。作为替代方案，客户可以使用 Prometheus Exporters 将 CloudWatch metrics 数据发送到 Amazon Managed Service for Prometheus：(1) CloudWatch Exporter：基于 Java 的抓取工具，使用 CW ListMetrics 和 GetMetricStatistics (GMS) API。

[**Yet Another CloudWatch Exporter (YACE)**](https://github.com/nerdswords/yet-another-cloudwatch-exporter) 是将 metrics 从 CloudWatch 导入 Amazon Managed Service for Prometheus 的另一个选择。这是一个基于 Go 的工具，使用 CW ListMetrics、GetMetricData (GMD) 和 GetMetricStatistics (GMS) API。使用此工具的一些缺点是您必须部署代理并自行管理其生命周期，这需要经过深思熟虑。

## Amazon Managed Service for Prometheus 兼容哪个版本的 Prometheus？

Amazon Managed Service for Prometheus 兼容 [Prometheus 2.x](https://github.com/prometheus/prometheus/blob/main/RELEASE.md)。Amazon Managed Service for Prometheus 基于开源的 [CNCF Cortex 项目](https://cortexmetrics.io/)作为其数据平面。Cortex 致力于与 Prometheus 保持 100% 的 API 兼容性（在 /prometheus/* 和 /api/prom/* 下）。Amazon Managed Service for Prometheus 支持 Prometheus 兼容的 PromQL 查询和 Remote write metric 摄取，以及 Prometheus 数据模型中现有的 metric 类型，包括 Gauge、Counters、Summary 和 Histogram。我们目前未公开[所有 Cortex API](https://cortexmetrics.io/docs/api/)。我们支持的兼容 API 列表可以[在这里找到](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-APIReference.html)。如果 Amazon Managed Service for Prometheus 缺少客户所需的任何功能，客户可以与他们的客户团队合作开设新的或影响现有的产品功能请求 (PFR)。

## 您推荐使用哪个收集器将 metrics 摄取到 Amazon Managed Service for Prometheus？我应该使用 Agent 模式的 Prometheus 吗？

我们支持使用 Prometheus servers（包括 agent 模式）、OpenTelemetry agent 和 AWS Distro for OpenTelemetry agent 作为客户可以用来向 Amazon Managed Service for Prometheus 发送 metrics 数据的代理。AWS Distro for OpenTelemetry 是由 AWS 打包和保护的 OpenTelemetry 项目的下游发行版。这三种方式都可以使用，您可以根据您团队的个人需求和偏好选择最适合的一种。

## Amazon Managed Service for Prometheus 的性能如何随工作区大小扩展？

目前，Amazon Managed Service for Prometheus 支持单个工作区中最多 2 亿个活跃时间序列。当我们宣布新的最大限制时，我们确保服务在摄取和查询方面的性能和可靠性属性继续得到维护。无论工作区中有多少活跃序列，对相同大小数据集的查询不应出现性能下降。

**产品常见问题：** [https://aws.amazon.com/prometheus/faqs/](https://aws.amazon.com/prometheus/faqs/)
