# 日志

.NET 为 OpenTelemetry 日志提供全面支持，与 metrics 和 traces 一起构成 observability 三大支柱。此集成实现了结构化、上下文化的日志记录，可无缝流入现代 observability 平台。

.NET 中的 OpenTelemetry 日志实现建立在成熟的 Microsoft.Extensions.Logging 抽象之上，允许开发人员在不更改现有日志代码的情况下采用 OpenTelemetry。这种向后兼容性使得在新应用程序和现有应用程序中的采用都很简单。

## 日志实现

在 .NET 应用程序中设置 OpenTelemetry 日志只需最少的配置：

```c#
builder.Logging.AddOpenTelemetry(options =>
{
    options.SetResourceBuilder(ResourceBuilder.CreateDefault()
        .AddService("MyServiceName"));
    
    options.AddOtlpExporter();
});
```

.NET 中 OpenTelemetry 日志最强大的功能之一是自动上下文传播。当日志记录发生在活动 trace 中时，日志条目会自动使用 trace 和 span ID 进行增强，从而在日志和相关的分布式 traces 之间创建连接。

```c#
// Logs created within this span will contain its context
using var activity = MyActivitySource.StartActivity("ProcessOrder");
logger.LogInformation("Processing order {OrderId}", orderId);
```

通过在 .NET 应用程序中实现 OpenTelemetry 日志，开发团队获得了一种标准化的日志记录方法，可与更广泛的 observability 生态系统顺畅集成。此集成为故障排除提供关键上下文，连接跨服务的相关信号，并在分布式环境中实现更有效的监控和调试。

## 后续步骤

现在您的应用程序已完成 instrumentation，请使用 collector 代理（如 OpenTelemetry Collector、CloudWatch Agent 或 Fluent Bit）将日志路由到您选择的 observability 后端。请参阅以下链接获取详细信息和实施指导。

- [使用 OpenTelemetry 实现 Observability](https://aws-observability.github.io/observability-best-practices/patterns/otel) - 在应用程序中实现 OpenTelemetry 的全面指南，提供使用 AWS 服务收集、处理和可视化遥测数据以实现全栈 observability 的模式。

- [操作 AWS Distro for OpenTelemetry (ADOT) Collector](https://aws-observability.github.io/observability-best-practices/guides/operational/adot-at-scale/operating-adot-collector) - 在生产环境中部署、扩展和管理 ADOT Collector 的实用指导，包括配置最佳实践和与 AWS observability 服务的集成。

- [使用 CloudWatch agent 收集 metrics、logs 和 traces](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html) - 安装和配置 CloudWatch agent 以从应用程序和基础设施收集遥测数据的分步说明，与 AWS CloudWatch 无缝集成。

- [AWS for Fluent Bit](https://github.com/aws/aws-for-fluent-bit?tab=readme-ov-file) - 轻量高效的解决方案，用于收集和转发日志、metrics 和 traces 到多个 AWS 服务，针对容器化环境和 Kubernetes 部署进行了优化。

- [ADOT Collector Amazon CloudWatch Exporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/awscloudwatchlogsexporter) - 专用的 OpenTelemetry Collector 组件，可将日志直接导出到 Amazon CloudWatch Logs，提供日志组、流和 AWS 身份验证的配置选项。
