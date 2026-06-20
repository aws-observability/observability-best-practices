# 日志

.NET 为 OpenTelemetry 日志提供全面支持，与 metrics 和 traces 一起构成可观测性三大支柱。此集成实现了结构化、上下文化的日志记录，可无缝流入现代可观测性平台。

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

通过在 .NET 应用程序中实现 OpenTelemetry 日志，开发团队获得了一种标准化的日志记录方法，可与更广泛的可观测性生态系统顺畅集成。此集成为故障排除提供关键上下文，连接跨服务的相关信号，并在分布式环境中实现更有效的监控和调试。
