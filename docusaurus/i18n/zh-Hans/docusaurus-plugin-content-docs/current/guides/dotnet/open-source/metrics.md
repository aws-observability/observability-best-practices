# Metrics

.NET 已将 OpenTelemetry 作为应用程序可观测性的标准，metrics 是与 traces 和日志并列的关键支柱。此集成使开发人员能够以最小的开销监控应用程序性能。

在 .NET 生态系统中，OpenTelemetry metrics 提供了一种标准化的方法来测量和暴露应用程序 metrics。从 .NET 6 开始并在 .NET 8 中显著增强，该框架提供了对收集和导出 metrics 数据的内置支持。

该框架为 ASP.NET Core、HTTP 客户端和 Entity Framework 等常见组件提供自动 instrumentation，无需额外代码即可收集有价值的 metrics。

.NET 中的 OpenTelemetry 支持多种导出格式，其中 Prometheus 在 metrics 方面特别流行。这种灵活性允许团队在保持一致收集方法的同时与其首选的可观测性平台集成。

通过采用 OpenTelemetry metrics，.NET 应用程序受益于一种厂商中立的标准化监控方法，可从开发环境扩展到复杂的生产部署，提供对应用程序健康和性能的关键可见性。

## Metrics 实现

在 .NET 8 应用程序中实现 OpenTelemetry metrics 变得非常简单。配置过程利用了现代 .NET 应用程序核心的依赖注入系统。开发人员可以在应用程序引导过程中使用 fluent API 配置 metrics 收集，使意图清晰且配置选项易于发现：

```c#
var builder = WebApplication.CreateBuilder(args);

// Add OpenTelemetry metrics
builder.Services.AddOpenTelemetry()
    .WithMetrics(metrics => metrics
        .AddAspNetCoreInstrumentation()
        .AddHttpClientInstrumentation()
        .AddRuntimeInstrumentation()
        .AddOtlpExporter());
```

## 自定义 Metrics

开发人员可以使用 System.Diagnostics.Metrics 命名空间创建自定义 metrics：

```c#
using var meter = new Meter("MyApplication.Metrics");
var orderCounter = meter.CreateCounter<int>("orders.processed");

// Recording values
orderCounter.Add(1, new("customer", customerId));
```

## 后续步骤

现在您的应用程序已完成 instrumentation，请使用 collector 代理（如 OpenTelemetry Collector、CloudWatch Agent 或 Fluent Bit）将 metrics 路由到您选择的可观测性后端。请参阅以下链接获取详细信息和实施指导。

- [使用 OpenTelemetry 实现可观测性](https://aws-observability.github.io/aws-observability/patterns/otel) - 在应用程序中实现 OpenTelemetry 的全面指南，提供使用 AWS 服务收集、处理和可视化遥测数据以实现全栈可观测性的模式。

- [操作 AWS Distro for OpenTelemetry (ADOT) Collector](https://aws-observability.github.io/aws-observability/guides/operational/adot-at-scale/operating-adot-collector) - 在生产环境中部署、扩展和管理 ADOT Collector 的实用指导，包括配置最佳实践和与 AWS 可观测性服务的集成。

- [使用 CloudWatch agent 收集 metrics、logs 和 traces](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html) - 安装和配置 CloudWatch agent 以从应用程序和基础设施收集遥测数据的分步说明，与 AWS CloudWatch 无缝集成。

- [AWS for Fluent Bit](https://github.com/aws/aws-for-fluent-bit?tab=readme-ov-file) - 轻量高效的解决方案，用于收集和转发日志、metrics 和 traces 到多个 AWS 服务，针对容器化环境和 Kubernetes 部署进行了优化。

- [CloudWatch EMF](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html) - 在日志事件中嵌入 metrics 数据的规范，允许您从应用程序日志中提取和可视化 metrics，无需单独的 metrics 管道，非常适合 serverless 和容器化应用程序。

- [Amazon Managed Grafana - 入门](https://aws.amazon.com/blogs/mt/amazon-managed-grafana-getting-started/) - 设置 Amazon Managed Grafana 以创建 metrics 数据强大可视化的教程，包含配置数据源、创建 dashboard 和实施告警的分步说明。
