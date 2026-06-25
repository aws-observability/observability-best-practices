# Metrics

.NET 已将 OpenTelemetry 作为应用程序可观测性的标准，metrics 是与 traces 和 logs 并列的关键支柱。这种集成使开发人员能够以最小的开销监控应用程序性能。

在 .NET 生态系统中，OpenTelemetry metrics 提供了一种标准化的方法来测量和暴露应用程序 metrics。从 .NET 6 开始，并在 .NET 8 中得到显著增强，该框架提供了对收集和导出 metric 数据的内置支持。

该框架为 ASP.NET Core、HTTP 客户端和 Entity Framework 等常见组件提供自动检测，无需额外代码即可收集有价值的 metrics。

.NET 中的 OpenTelemetry 支持多种导出格式，其中 Prometheus 在 metrics 方面特别流行。这种灵活性允许团队与其首选的可观测性平台集成，同时保持一致的收集方法。

通过采用 OpenTelemetry metrics，.NET 应用程序受益于一种厂商中立的、标准化的监控方法，该方法可从开发环境扩展到复杂的生产部署，提供对应用程序健康状况和性能的关键可见性。

## Metrics 实现

在 .NET 8 应用程序中实现 OpenTelemetry metrics 已变得非常简单。配置过程利用了现代 .NET 应用程序核心的依赖注入系统。开发人员可以在应用程序引导过程中使用流畅的 API 配置 metrics 收集，使意图清晰且配置选项易于发现：

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
