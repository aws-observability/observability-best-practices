# 追踪

.NET 为 OpenTelemetry 追踪提供强大支持，为开发人员提供了监控分布式系统中请求流的强大工具。此实现可实现对应用程序行为和性能瓶颈的端到端可见性。

在 .NET 生态系统中，OpenTelemetry 追踪是围绕 [System.Diagnostics.Activity](https://learn.microsoft.com/en-us/dotnet/api/system.diagnostics.activity?view=net-9.0) 类构建的，这是 .NET 对 W3C Trace Context 规范的实现。与行业标准的一致性确保了与其他服务和 observability 工具的互操作性。

## Traces 实现

在 .NET 应用程序中配置 OpenTelemetry 追踪非常简单：

```c#
builder.Services.AddOpenTelemetry()
    .WithTracing(tracing => tracing
        .AddAspNetCoreInstrumentation()
        .AddHttpClientInstrumentation()
        .AddEntityFrameworkCoreInstrumentation()
        .AddSource("MyApplication.Tracing")
        .AddOtlpExporter());
```

.NET OpenTelemetry 实现的一个关键优势是自动 instrumentation。许多常见的库和框架（包括 ASP.NET Core、HttpClient、gRPC 和 Entity Framework Core）无需额外代码即可发出 traces。这为外部调用和数据库操作提供了即时可见性。

## 自定义 Traces

使用 ActivitySource API 在应用程序代码中创建自定义 traces：

```c#
// Create a source once and reuse it
private static readonly ActivitySource MyActivitySource = 
    new("MyApplication.Tracing");

// Create spans for important operations
using var activity = MyActivitySource.StartActivity("ProcessOrder");
activity?.SetTag("orderId", orderId);

// Child operations create nested spans
using var childActivity = MyActivitySource.StartActivity("ValidatePayment");
```

在依赖注入中注册 ActivitySource 被认为是 .NET 应用程序中 OpenTelemetry 追踪的最佳实践。

```c#
// During service configuration
services.AddSingleton(sp => new ActivitySource("MyCompany.MyApplication", "1.0.0"));

// Or create a wrapper service if you need more functionality
services.AddSingleton<TracingService>();

// Then inject it where needed
public class OrderProcessor
{
    private readonly ActivitySource _activitySource;
    
    public OrderProcessor(ActivitySource activitySource)
    {
        _activitySource = activitySource;
    }
    
    public void ProcessOrder(Order order)
    {
        using var activity = _activitySource.StartActivity("ProcessOrder");
        activity?.SetTag("orderId", order.Id);
        
        // Processing logic
    }
}
```

## 后续步骤

现在您的应用程序已完成 instrumentation，请使用 collector 代理（如 OpenTelemetry Collector、CloudWatch Agent 或 Fluent Bit）将 traces 路由到您选择的 observability 后端。请参阅以下链接获取详细信息和实施指导。

- [使用 OpenTelemetry 实现 Observability](https://aws-observability.github.io/observability-best-practices/patterns/otel) - 在应用程序中实现 OpenTelemetry 的全面指南，提供使用 AWS 服务收集、处理和可视化遥测数据以实现全栈 observability 的模式。

- [操作 AWS Distro for OpenTelemetry (ADOT) Collector](https://aws-observability.github.io/observability-best-practices/guides/operational/adot-at-scale/operating-adot-collector) - 在生产环境中部署、扩展和管理 ADOT Collector 的实用指导，包括配置最佳实践和与 AWS observability 服务的集成。

- [使用 CloudWatch agent 收集 metrics、logs 和 traces](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html) - 安装和配置 CloudWatch agent 以从应用程序和基础设施收集遥测数据的分步说明，与 AWS CloudWatch 无缝集成。

- [AWS for Fluent Bit](https://github.com/aws/aws-for-fluent-bit?tab=readme-ov-file) - 轻量高效的解决方案，用于收集和转发日志、metrics 和 traces 到多个 AWS 服务，针对容器化环境和 Kubernetes 部署进行了优化。

- [AWS X-Ray](https://docs.aws.amazon.com/xray/latest/devguide/xray-services-adot.html) - 将 AWS X-Ray 与 OpenTelemetry 集成进行分布式追踪的详细文档，允许您使用 trace 可视化和分析工具大规模分析和调试生产应用程序。
