# Tracing

.NET offers robust support for OpenTelemetry tracing, providing developers with powerful tools to monitor request flows across distributed systems. This implementation enables end-to-end visibility into application behavior and performance bottlenecks.

In the .NET ecosystem, OpenTelemetry tracing is built around the [System.Diagnostics.Activity](https://learn.microsoft.com/en-us/dotnet/api/system.diagnostics.activity?view=net-9.0) class, which is .NET's implementation of the W3C Trace Context specification. This alignment with industry standards ensures interoperability with other services and observability tools.

## Traces Implementation

Configuring OpenTelemetry tracing in a .NET application is straightforward:

```c#
builder.Services.AddOpenTelemetry()
    .WithTracing(tracing => tracing
        .AddAspNetCoreInstrumentation()
        .AddHttpClientInstrumentation()
        .AddEntityFrameworkCoreInstrumentation()
        .AddSource("MyApplication.Tracing")
        .AddOtlpExporter());
```

A key strength of .NET's OpenTelemetry implementation is automatic instrumentation. Many common libraries and frameworks—including ASP.NET Core, HttpClient, gRPC, and Entity Framework Core—emit traces without requiring additional code. This provides immediate visibility into external calls and database operations.

## Custom Traces

Creating custom traces in application code uses the ActivitySource API:

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

Registering your ActivitySource in dependency injection is considered a best practice for OpenTelemetry tracing in .NET applications.

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

## Next Steps

Now that your application is instrumented, use a collector agent—such as the OpenTelemetry Collector, CloudWatch Agent, or Fluent Bit—to route traces to the observability backend of your choice. Refer to the links below for details and implementation guidance.

- [Observability with OpenTelemetry](https://aws-observability.github.io/observability-best-practices/patterns/otel) - Comprehensive guide to implementing OpenTelemetry across your applications, providing patterns for collecting, processing, and visualizing telemetry data with AWS services to achieve full-stack observability.

- [Operating the AWS Distro for OpenTelemetry (ADOT) Collector](https://aws-observability.github.io/observability-best-practices/guides/operational/adot-at-scale/operating-adot-collector) - Practical guidance for deploying, scaling, and managing the ADOT Collector in production environments, including configuration best practices and integration with AWS observability services.

- [Collect metrics, logs, and traces with the CloudWatch agent](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html) - Step-by-step instructions for installing and configuring the CloudWatch agent to collect telemetry data from your applications and infrastructure, with seamless integration into AWS CloudWatch.

- [AWS for Fluent Bit](https://github.com/aws/aws-for-fluent-bit?tab=readme-ov-file) - Lightweight and efficient solution for collecting and forwarding logs, metrics, and traces to multiple AWS services, optimized for containerized environments and Kubernetes deployments.

- [AWS XRay](https://docs.aws.amazon.com/xray/latest/devguide/xray-services-adot.html) - Detailed documentation on integrating AWS X-Ray with OpenTelemetry for distributed tracing, allowing you to analyze and debug production applications at scale with trace visualization and analysis tools.
