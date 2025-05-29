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

## Next Steps

Now that your application is instrumented, use a collector agent—such as the OpenTelemetry Collector, CloudWatch Agent, or Fluent Bit—to route metrics to the observability backend of your choice. Refer to the links below for details and implementation guidance.

- [Observability with OpenTelemetry](https://aws-observability.github.io/observability-best-practices/patterns/otel) - Comprehensive guide to implementing OpenTelemetry across your applications, providing patterns for collecting, processing, and visualizing telemetry data with AWS services to achieve full-stack observability.

- [Operating the AWS Distro for OpenTelemetry (ADOT) Collector](https://aws-observability.github.io/observability-best-practices/guides/operational/adot-at-scale/operating-adot-collector) - Practical guidance for deploying, scaling, and managing the ADOT Collector in production environments, including configuration best practices and integration with AWS observability services.

- [Collect metrics, logs, and traces with the CloudWatch agent](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html) - Step-by-step instructions for installing and configuring the CloudWatch agent to collect telemetry data from your applications and infrastructure, with seamless integration into AWS CloudWatch.

- [AWS for Fluent Bit](https://github.com/aws/aws-for-fluent-bit?tab=readme-ov-file) - Lightweight and efficient solution for collecting and forwarding logs, metrics, and traces to multiple AWS services, optimized for containerized environments and Kubernetes deployments.

- [CloudWatch EMF](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html) -Specification for embedding metric data in log events, allowing you to extract and visualize metrics from application logs without requiring a separate metrics pipeline, ideal for serverless and containerized applications.

- [Amazon Managed Grafana – Getting Started](https://aws.amazon.com/blogs/mt/amazon-managed-grafana-getting-started/) - Tutorial for setting up Amazon Managed Grafana to create powerful visualizations of your metrics data, with step-by-step instructions for configuring data sources, creating dashboards, and implementing alerts.
