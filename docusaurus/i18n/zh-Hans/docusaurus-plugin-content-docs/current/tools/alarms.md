# 告警

Amazon CloudWatch 告警允许您围绕 CloudWatch Metrics 和 Logs 定义阈值，并根据 CloudWatch 中配置的规则接收通知。

**基于 CloudWatch metrics 的告警：**

CloudWatch 告警允许您定义 CloudWatch metrics 的阈值，并在 metrics 超出范围时接收通知。每个 metric 可以触发多个告警，每个告警可以关联多个操作。您可以通过两种不同的方式基于 CloudWatch metrics 设置 metric 告警。

1. **静态阈值**：静态阈值代表 metric 不应违反的硬性限制。您必须定义静态阈值的范围，如上限和下限，以了解正常操作期间的行为。如果 metric 值低于或高于静态阈值，您可以配置 CloudWatch 生成告警。

2. **异常检测**：异常检测通常被识别为与大多数数据显著偏离的罕见项目、事件或观察结果，不符合正常行为的明确定义。CloudWatch 异常检测分析过去的 metric 数据并创建预期值模型。预期值考虑了 metric 中典型的每小时、每日和每周模式。您可以根据需要对每个 metric 应用异常检测，CloudWatch 应用机器学习算法为每个启用的 metric 定义上限和下限，仅在 metrics 超出预期值时生成告警。

:::tip
	静态阈值最适合用于您对其有深入了解的 metrics，例如工作负载中已识别的性能断点或基础设施组件的绝对限制。
:::
:::info
	当您对特定 metric 随时间的性能没有可见性时，或者当 metric 值之前未在负载测试或异常流量下被观察到时，请对告警使用异常检测模型。
:::
![CloudWatch 告警类型](../images/cwalarm1.png)

您可以按照以下说明了解如何在 CloudWatch 中设置静态和基于异常检测的告警。

[静态阈值告警](https://catalog.us-east-1.prod.workshops.aws/workshops/31676d37-bbe9-4992-9cd1-ceae13c5116c/en-US/alarms/mericalarm)

[CloudWatch 异常检测告警](https://catalog.us-east-1.prod.workshops.aws/workshops/31676d37-bbe9-4992-9cd1-ceae13c5116c/en-US/alarms/adalarm)

:::info
	为了减少告警疲劳或减少生成的告警数量带来的噪音，您有两种高级方法来配置告警：

	1. **复合告警**：复合告警包含一个规则表达式，该表达式考虑了已创建的其他告警的告警状态。复合告警仅在满足规则的所有条件时才进入 `ALARM` 状态。复合告警规则表达式中指定的告警可以包括 metric 告警和其他复合告警。复合告警有助于[通过聚合来对抗告警疲劳](../signals/alarms.md#fight-alarm-fatigue-with-aggregation)。

	2. **基于 Metric math 的告警**：Metric math 表达式可用于构建更有意义的 KPI 并对其设置告警。您可以组合多个 metrics 并创建组合利用率 metric，然后对其设置告警。
:::

以下说明将指导您如何设置复合告警和基于 Metric math 的告警。

[复合告警](https://catalog.us-east-1.prod.workshops.aws/workshops/31676d37-bbe9-4992-9cd1-ceae13c5116c/en-US/alarms/compositealarm)

[Metric Math 告警](https://aws.amazon.com/blogs/mt/create-a-metric-math-alarm-using-amazon-cloudwatch/)

**基于 CloudWatch Logs 的告警**

您可以使用 CloudWatch Metric 过滤器基于 CloudWatch Logs 创建告警。Metric 过滤器将日志数据转换为数字 CloudWatch metrics，您可以对其进行绘图或设置告警。设置 metrics 后，您可以对从 CloudWatch Logs 生成的 CloudWatch metrics 使用静态或基于异常检测的告警。

您可以在这里找到如何设置 [CloudWatch logs 上的 metric 过滤器](https://aws.amazon.com/blogs/mt/quantify-custom-application-metrics-with-amazon-cloudwatch-logs-and-metric-filters/)的示例。
