---
title: .NET Application Monitoring
sidebar_label: .NET Monitoring
---

# .NET Application Monitoring

## Overview

Monitor .NET applications running on AWS with full observability across metrics, logs, and traces. This entry covers two complementary paths: the **CloudWatch-native** approach using the AWS SDK, CloudWatch Agent, and X-Ray SDK, and the **OpenTelemetry** approach using the OTel .NET SDK with OTLP export to CloudWatch and X-Ray.

OpenTelemetry in .NET is unique because it builds on the framework's existing instrumentation APIs (`System.Diagnostics`, `ILogger`, `Meter`) rather than replacing them. Library authors instrument using standard .NET APIs, and the OTel SDK seamlessly collects that telemetry. This makes adoption straightforward for teams already using ASP.NET Core.

Choose OpenTelemetry when you want vendor-neutral instrumentation with flexibility to switch backends. Choose the CloudWatch-native path when you want the simplest integration with AWS services and are committed to the CloudWatch ecosystem.

For full setup details, see [CloudWatch Application Signals documentation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Signals.html).

## Prerequisites

- .NET 6.0+ (or .NET Framework 4.6.2+ for X-Ray SDK)
- AWS account with IAM permissions for CloudWatch Logs, CloudWatch Metrics, and X-Ray
- For EC2/on-premises: CloudWatch Agent installed
- For Lambda: Lambda execution role with `AWSXRayDaemonWriteAccess` and `CloudWatchLambdaInsightsExecutionRolePolicy`
- NuGet access to install required packages

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     .NET Application                             │
│                                                                 │
│  ┌─────────────────────┐      ┌──────────────────────────────┐  │
│  │  OTel SDK           │      │  AWS SDK / X-Ray SDK         │  │
│  │  (Traces, Metrics,  │      │  (PutMetricData, PutLog,     │  │
│  │   Logs via OTLP)    │      │   X-Ray segments)            │  │
│  └──────────┬──────────┘      └───────────────┬──────────────┘  │
└─────────────┼─────────────────────────────────┼─────────────────┘
              │ OTLP                             │ Direct API / Agent
              ▼                                 ▼
┌──────────────────────┐          ┌──────────────────────────┐
│  CloudWatch Agent /  │          │  CloudWatch / X-Ray      │
│  ADOT Collector      │          │  (Direct ingest)         │
└──────────┬───────────┘          └────────────┬─────────────┘
           │                                   │
           ▼                                   ▼
┌────────────────────────────────────────────────────────────┐
│          Amazon CloudWatch + AWS X-Ray                      │
│  (Metrics, Logs Insights, ServiceMap, Traces)              │
└────────────────────────────────────────────────────────────┘
```

## Deploy

### Path A: OpenTelemetry (recommended for new applications)

**1. Install NuGet packages:**

```bash
dotnet add package OpenTelemetry
dotnet add package OpenTelemetry.Instrumentation.AspNetCore
dotnet add package OpenTelemetry.Instrumentation.Http
dotnet add package OpenTelemetry.Instrumentation.AWS
dotnet add package OpenTelemetry.Resources.AWS
dotnet add package OpenTelemetry.Extensions.AWS
dotnet add package OpenTelemetry.Exporter.OpenTelemetryProtocol
```

**2. Configure the OTel SDK in `Program.cs`:**

```csharp
using OpenTelemetry;
using OpenTelemetry.Trace;
using OpenTelemetry.Metrics;
using OpenTelemetry.Logs;
using OpenTelemetry.Resources;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenTelemetry()
    .ConfigureResource(res => res
        .AddService("my-dotnet-app")
        .AddAWSECSDetector()
        .AddAWSEKSDetector()
        .AddAWSEC2Detector())
    .WithTracing(tracing => tracing
        .AddAspNetCoreInstrumentation()
        .AddHttpClientInstrumentation()
        .AddAWSInstrumentation()
        .AddOtlpExporter())
    .WithMetrics(metrics => metrics
        .AddAspNetCoreInstrumentation()
        .AddHttpClientInstrumentation()
        .AddOtlpExporter());

builder.Logging.AddOpenTelemetry(logging =>
    logging.AddOtlpExporter());
```

**3. Deploy the ADOT Collector or CloudWatch Agent** to receive OTLP and export to CloudWatch/X-Ray. See [ADOT Collector setup](https://aws-otel.github.io/docs/getting-started/collector).

### Path B: CloudWatch-native

**1. Logs — install the logging plugin:**

```bash
dotnet add package AWS.Logger.SeriLog  # or AWS.Logger.NLog, AWS.Logger.AspNetCore
```

Or use the CloudWatch Agent to stream application log files. See [CloudWatch Agent log collection](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-Configuration-File-Details.html).

**2. Metrics — use CloudWatch EMF for zero-latency custom metrics:**

```bash
dotnet add package Amazon.CloudWatch.EMF
```

```csharp
using (var logger = new MetricsLogger()) {
    logger.SetNamespace("MyApp");
    var dim = new DimensionSet();
    dim.AddDimension("Service", "OrderProcessor");
    logger.SetDimensions(dim);
    logger.PutMetric("ProcessingLatency", 42, Unit.MILLISECONDS);
}
```

**3. Traces — instrument with X-Ray SDK:**

See [X-Ray SDK for .NET developer guide](https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-dotnet.html) for ASP.NET Core auto-instrumentation and manual segment creation.

## Validate

1. **Logs:** Open CloudWatch Logs console → verify your log group contains recent events:
   ```bash
   aws logs filter-log-events --log-group-name /my-dotnet-app --limit 5
   ```

2. **Metrics:** Query custom metrics in CloudWatch:
   ```bash
   aws cloudwatch list-metrics --namespace MyApp
   ```

3. **Traces:** Open the X-Ray console → Service Map and verify your application node appears with connected downstream services.

4. **OTel path:** Confirm the ADOT Collector is forwarding by checking collector logs for `exporterhelper` success messages.

## Troubleshoot

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| No logs in CloudWatch | Missing IAM permissions | Ensure role has `logs:CreateLogGroup`, `logs:CreateLogStream`, `logs:PutLogEvents` |
| Traces not appearing in X-Ray | ADOT Collector not running or misconfigured | Verify collector endpoint, check `OTEL_EXPORTER_OTLP_ENDPOINT` env var |
| Metrics namespace empty | EMF logs not reaching CloudWatch Agent | Confirm Agent is running and EMF TCP/UDP endpoint is reachable (default `tcp://127.0.0.1:25888`) |
| OTel spans missing AWS attributes | Resource detectors not added | Add `.AddAWSEC2Detector()` or appropriate detector to resource configuration |
| High cardinality metrics rejected | Too many unique dimension combinations | Reduce dimensions; CloudWatch limits 30 dimensions per metric |

## Related Solutions

- [EKS Application Signals](../eks-application-signals/) — Application-level monitoring for containerized .NET apps on EKS
- [Lambda Monitoring](../lambda-monitoring/) — Observability for .NET Lambda functions
