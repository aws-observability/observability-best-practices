# 百分位数的重要性

百分位数在监控和报告中很重要，因为与仅依赖平均值相比，它们提供了更详细和准确的数据分布视图。平均值有时会隐藏重要信息，如异常值或数据中的变化，这些可能会显著影响性能和用户体验。百分位数则可以揭示这些隐藏的细节，更好地了解数据的分布情况。

在 [Amazon CloudWatch](https://aws.amazon.com/cloudwatch/) 中，百分位数可用于监控和报告各种 metrics，如应用程序和基础设施中的响应时间、延迟和错误率。通过在百分位数上设置告警，您可以在特定百分位值超过阈值时收到通知，从而在影响更多客户之前采取行动。

要在 CloudWatch 中使用[百分位数](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_concepts.html#Percentiles)，请在 CloudWatch 控制台的**所有 metrics** 中选择您的 metric，使用现有 metric 并将**统计数据**设置为 **p99**，然后您可以将 p 后面的值编辑为您想要的任何百分位数。然后您可以查看百分位数图表，将它们添加到 [CloudWatch dashboard](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Dashboards.html) 并在这些 metrics 上设置告警。例如，您可以设置一个告警，在响应时间的第 95 百分位数超过某个阈值时通知您，表明相当大比例的用户正在经历缓慢的响应时间。

下面的直方图是在 [Amazon Managed Grafana](https://aws.amazon.com/grafana/) 中使用来自 [CloudWatch RUM](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM.html) 日志的 [CloudWatch Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html) 查询创建的。使用的查询是：

```
fields @timestamp, event_details.duration
| filter event_type = "com.amazon.rum.performance_navigation_event"
| sort @timestamp desc
```

直方图绘制了以毫秒为单位的页面加载时间。通过此视图，可以清楚地看到异常值。如果使用平均值，这些数据将被隐藏。

![直方图](../../../images/percentiles-histogram.png)

使用平均值在 CloudWatch 中显示的相同数据表明页面加载时间不到两秒。您可以从上面的直方图中看到，大多数页面实际上加载时间不到一秒，而我们有异常值。

![直方图](../../../images/percentiles-average.png)

再次使用相同数据的百分位数（p99）表明存在问题，CloudWatch 图表现在显示 99% 的页面加载时间少于 23 秒。

![直方图](../../../images/percentiles-p99.png)

为了使这更容易可视化，下面的图表比较了平均值和第 99 百分位数。在这种情况下，目标页面加载时间为两秒，可以使用替代的 [CloudWatch 统计数据](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Statistics-definitions.html#Percentile-versus-Trimmed-Mean)和 [metric math](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/using-metric-math.html) 进行其他计算。在这种情况下，使用了百分位排名 (PR)，统计数据为 **PR(:2000)** 来显示 92.7% 的页面加载在 2000ms 的目标内完成。

![直方图](../../../images/percentiles-comparison.png)

在 CloudWatch 中使用百分位数可以帮助您更深入地了解系统性能，尽早发现问题，并通过识别否则会被隐藏的异常值来改善客户体验。



