# Metrics

.NET has embraced OpenTelemetry as the standard for application observability, with metrics being a key pillar alongside traces and logs. This integration enables developers to monitor application performance with minimal overhead.

In the .NET ecosystem, OpenTelemetry metrics provide a standardized approach to measuring and exposing application metrics. Starting with .NET 6 and significantly enhanced in .NET 8, the framework offers built-in support for collecting and exporting metric data.

The framework provides automatic instrumentation for common components like ASP.NET Core, HTTP clients, and Entity Framework, collecting valuable metrics without additional code.

OpenTelemetry in .NET supports multiple export formats, with Prometheus being particularly popular for metrics. This flexibility allows teams to integrate with their preferred observability platforms while maintaining a consistent collection approach.

By adopting OpenTelemetry metrics, .NET applications benefit from a vendor-neutral, standardized approach to monitoring that scales from development environments to complex production deployments, providing crucial visibility into application health and performance.

## Metrics Implementation

Implementing OpenTelemetry metrics in .NET 8 applications has become remarkably straightforward. The configuration process leverages the dependency injection system that's central to modern .NET applications. Developers can configure metrics collection during the application bootstrap process using a fluent API that makes the intent clear and configuration options discoverable:

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

## Custom Metrics

Developers can create custom metrics using the System.Diagnostics.Metrics namespace:

```c#
using var meter = new Meter("MyApplication.Metrics");
var orderCounter = meter.CreateCounter<int>("orders.processed");

// Recording values
orderCounter.Add(1, new("customer", customerId));
```
