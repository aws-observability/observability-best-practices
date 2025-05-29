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

One of the most powerful features of OpenTelemetry logs in .NET is automatic context propagation. Log entries are automatically enriched with trace and span IDs when logging occurs within an active trace, creating connections between logs and the related distributed traces.

```c#
// Logs created within this span will contain its context
using var activity = MyActivitySource.StartActivity("ProcessOrder");
logger.LogInformation("Processing order {OrderId}", orderId);
```

By implementing OpenTelemetry logs in .NET applications, development teams gain a standardized approach to logging that integrates smoothly with the broader observability ecosystem. This integration provides critical context for troubleshooting, connects related signals across services, and enables more effective monitoring and debugging in distributed environments.

## Next Steps

Now that your application is instrumented, use a collector agent—such as the OpenTelemetry Collector, CloudWatch Agent, or Fluent Bit—to route logs to the observability backend of your choice. Refer to the links below for details and implementation guidance.

- [Observability with OpenTelemetry](https://aws-observability.github.io/observability-best-practices/patterns/otel) - Comprehensive guide to implementing OpenTelemetry across your applications, providing patterns for collecting, processing, and visualizing telemetry data with AWS services to achieve full-stack observability.

- [Operating the AWS Distro for OpenTelemetry (ADOT) Collector](https://aws-observability.github.io/observability-best-practices/guides/operational/adot-at-scale/operating-adot-collector) - Practical guidance for deploying, scaling, and managing the ADOT Collector in production environments, including configuration best practices and integration with AWS observability services.

- [Collect metrics, logs, and traces with the CloudWatch agent](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html) - Step-by-step instructions for installing and configuring the CloudWatch agent to collect telemetry data from your applications and infrastructure, with seamless integration into AWS CloudWatch.

- [AWS for Fluent Bit](https://github.com/aws/aws-for-fluent-bit?tab=readme-ov-file) - Lightweight and efficient solution for collecting and forwarding logs, metrics, and traces to multiple AWS services, optimized for containerized environments and Kubernetes deployments.

- [ADOT Collector Amazon Cloudwatch Exporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/awscloudwatchlogsexporter) - Specialized OpenTelemetry Collector component that exports logs directly to Amazon CloudWatch Logs, with configuration options for log groups, streams, and AWS authentication.
