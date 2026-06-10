# 实时成本监控

Amazon Managed Service for Prometheus 是一种无服务器的、与 Prometheus 兼容的容器 metrics 监控服务，可以更轻松地大规模安全监控容器环境。Amazon Managed Service for Prometheus 的定价模型基于 Metric 样本摄取量、查询样本处理量和 Metrics 存储量。您可以在[此处][pricing]找到最新的定价详情。

作为托管服务，Amazon Managed Service for Prometheus 会随着工作负载的扩缩自动调整运营 metrics 的摄取、存储和查询。我们的一些客户向我们咨询如何实时跟踪 `metric samples ingestion rate` 及其成本的指导。下面让我们探讨如何实现这一目标。

### 解决方案
Amazon Managed Service for Prometheus 向 Amazon CloudWatch [发布使用 metrics][vendedmetrics]。这些 metrics 可用于帮助您更好地了解 Amazon Managed Service for Prometheus 工作区的情况。这些发布的 metrics 可以在 CloudWatch 的 `AWS/Usage` 和 `AWS/Prometheus` 命名空间中找到，这些 [metrics][AMPMetrics] 在 CloudWatch 中无需额外费用即可使用。您随时可以创建 CloudWatch dashboard 来进一步探索和可视化这些 metrics。

今天，您将使用 Amazon CloudWatch 作为 Amazon Managed Grafana 的数据源，并在 Grafana 中构建 dashboard 来可视化这些 metrics。架构图说明了以下内容。

- Amazon Managed Service for Prometheus 将发布的 metrics 发送到 Amazon CloudWatch

- Amazon CloudWatch 作为 Amazon Managed Grafana 的数据源

- 用户访问在 Amazon Managed Grafana 中创建的 dashboard

![prometheus-ingestion-rate](../../../images/ampmetricsingestionrate.png)

### Amazon Managed Grafana Dashboard

在 Amazon Managed Grafana 中创建的 dashboard 将使您能够可视化：

1. 每个工作区的 Prometheus 摄取速率
![prometheus-ingestion-rate-dash1](../../../images/ampwsingestionrate-1.png)

2. 每个工作区的 Prometheus 摄取速率和实时成本
   对于实时成本跟踪，您将使用基于官方 [AWS 定价文档][pricing]中 `Metrics Ingested Tier` 的 `First 2 billion samples` 定价的 `math expression`。数学运算以数字和时间序列作为输入，并将它们转换为不同的数字和时间序列，请参阅此[文档][mathexpression]以进一步自定义以满足您的业务需求。
![prometheus-ingestion-rate-dash2](../../../images/ampwsingestionrate-2.png)

3. 每个工作区的 Prometheus 活跃序列
![prometheus-ingestion-rate-dash3](../../../images/ampwsingestionrate-3.png)


Grafana 中的 dashboard 由一个 JSON 对象表示，该对象存储其 dashboard 的元数据。Dashboard 元数据包括 dashboard 属性、面板的元数据、模板变量、面板查询等。

您可以在<mark>[此处](AmazonPrometheusMetrics.json)</mark>访问上述 dashboard 的 **JSON 模板**。

通过上述 dashboard，您现在可以识别每个工作区的摄取速率，并根据 Amazon Managed Service for Prometheus 的 metrics 摄取速率监控每个工作区的实时成本。您可以使用其他 Grafana [dashboard 面板][panels]来构建适合您需求的可视化效果。

[pricing]: https://aws.amazon.com/prometheus/pricing/
[AMPMetrics]: https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-CW-usage-metrics.html
[vendedmetrics]: https://aws.amazon.com/blogs/mt/introducing-vended-metrics-for-amazon-managed-service-for-prometheus/
[mathexpression]: https://grafana.com/docs/grafana/latest/panels-visualizations/query-transform-data/expression-queries/#math
[panels]: https://docs.aws.amazon.com/grafana/latest/userguide/Grafana-panels.html
