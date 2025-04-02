# Logs

.NET provides comprehensive support for OpenTelemetry logging, completing the observability triad alongside metrics and traces. This integration enables structured, contextualized logging that flows seamlessly into modern observability platforms.

The OpenTelemetry logging implementation in .NET builds upon the established Microsoft.Extensions.Logging abstractions, allowing developers to adopt OpenTelemetry without changing existing logging code. This backward compatibility makes adoption straightforward in both new and existing applications.

## Logging Implementation

Setting up OpenTelemetry logs in a .NET application requires minimal configuration:

```c#
builder.Logging.AddOpenTelemetry(options =>
{
    options.SetResourceBuilder(ResourceBuilder.CreateDefault()
        .AddService("MyServiceName"));
    
    options.AddOtlpExporter();
});
```

One of the most powerful features of OpenTelemetry logs in .NET is automatic context propagation. Log entries are automatically enriched with trace and span IDs when logging occurs within an active trace, creating connections between logs and the related distributed traces"

```c#
// Logs created within this span will contain its context
using var activity = MyActivitySource.StartActivity("ProcessOrder");
logger.LogInformation("Processing order {OrderId}", orderId);
```

By implementing OpenTelemetry logs in .NET applications, development teams gain a standardized approach to logging that integrates smoothly with the broader observability ecosystem. This integration provides critical context for troubleshooting, connects related signals across services, and enables more effective monitoring and debugging in distributed environments.
