# 服务级别目标 (SLOs)

高可用性和弹性应用程序是否是贵公司的业务驱动力**？**  
如果答案是"**是**"，请继续阅读。

故障是不可避免的，一切终将随时间推移而发生故障！当您构建需要扩展的应用程序时，这一教训变得更加重要。这就是 SLOs 重要性的体现。

SLOs 基于关键的最终用户旅程来衡量服务可用性的约定目标。该约定目标应围绕对您的客户/最终用户重要的内容来制定。要构建这样一个弹性的生态系统，您应该客观地衡量性能，并使用有意义、现实且可操作的 SLOs 准确报告可靠性。现在，让我们熟悉关键的服务级别术语。

## 服务级别术语

- SLI 是服务级别指标：对所提供服务水平的某些方面进行精确定义的定量度量。

- SLO 是服务级别目标：由 SLI 在一段时间内衡量的服务级别的目标值或值范围。

- SLA 是服务级别协议：与客户签订的协议，包括未达到其中 SLOs 的后果。

下图说明 SLA 是"承诺/协议"，SLO 是"目标/目标值"，SLI 是"服务表现如何？"的衡量。

![SLO 数据流](../images/slo.png)

### 是否有 AWS 工具来监控所有这些？

答案是"**是**"！

[Amazon CloudWatch Application Signals](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Monitoring-Sections.html) 是一项新功能，可以轻松地自动检测和运营 AWS 上的应用程序。Application Signals 检测您在 AWS 上的应用程序，以便您可以监控应用程序的健康状况并跟踪业务目标的绩效。Application Signals 为您提供应用程序、服务和依赖关系的统一、以应用程序为中心的视图，帮助您监控和分类应用程序健康状况。Application Signals 在 Amazon EKS、Amazon ECS 和 Amazon EC2 上受支持并经过测试，在撰写本文时仅支持 Java 应用程序！

Application Signals 帮助您在关键性能指标上设置 SLOs。您可以使用 Application Signals 为关键业务操作的服务创建服务级别目标。通过在这些服务上创建 SLOs，您将能够在 SLO dashboard 上跟踪它们，从而一目了然地了解最重要的操作。为了加速根本原因识别，Application Signals 提供了应用程序性能的综合视图，集成了来自 CloudWatch Synthetics（监控关键 API 和用户交互）和 CloudWatch RUM（监控真实用户性能）的额外性能信号。

Application Signals 自动收集它发现的每个服务和操作的延迟和可用性指标，这些指标通常非常适合用作 SLIs。同时，Application Signals 让您可以灵活地使用任何 CloudWatch 指标或指标表达式作为 SLI！

Application Signals 基于应用程序性能最佳实践自动检测应用程序，并关联在 Amazon EKS 上运行的应用程序的 metrics、traces、logs、real user monitoring 和 synthetic monitoring 的遥测数据。阅读这篇[博客](https://aws.amazon.com/blogs/aws/amazon-cloudwatch-application-signals-for-automatic-instrumentation-of-your-applications-preview/)了解更多详情。

查看这篇[博客](https://aws.amazon.com/blogs/mt/how-to-monitor-application-health-using-slos-with-amazon-cloudwatch-application-signals/)了解如何在 CloudWatch Application Signals 中设置 SLO 来监控服务的可靠性。

Observability 是建立可靠服务的基础要素，从而使您的组织能够有效地大规模运营。我们相信，[Amazon CloudWatch Application Signals](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Monitoring-Sections.html) 将是帮助您实现该目标的出色工具。
