# Tracing

.NET 为 OpenTelemetry tracing 提供了强大的支持，为开发人员提供了监控分布式系统中请求流的强大工具。该实现使得应用程序行为和性能瓶颈的端到端可见性成为可能。

在 .NET 生态系统中，OpenTelemetry tracing 建立在 [System.Diagnostics.Activity](https://learn.microsoft.com/en-us/dotnet/api/system.diagnostics.activity?view=net-9.0) 类之上，这是 .NET 对 W3C Trace Context 规范的实现。与行业标准的对齐确保了与其他服务和可观测性工具的互操作性。

## Traces 实现

在 .NET 应用程序中配置 OpenTelemetry tracing 非常简单：

```c#
builder.Services.AddOpenTelemetry()
    .WithTracing(tracing => tracing
        .AddAspNetCoreInstrumentation()
        .AddHttpClientInstrumentation()
        .AddEntityFrameworkCoreInstrumentation()
        .AddSource("MyApplication.Tracing")
        .AddOtlpExporter());
```

.NET 的 OpenTelemetry 实现的一个关键优势是自动检测。许多常见的库和框架——包括 ASP.NET Core、HttpClient、gRPC 和 Entity Framework Core——无需额外代码即可发出 traces。这为外部调用和数据库操作提供了即时可见性。

## 自定义 Traces

在应用程序代码中创建自定义 traces 使用 ActivitySource API：

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

在依赖注入中注册 ActivitySource 被认为是 .NET 应用程序中 OpenTelemetry tracing 的最佳实践。

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
