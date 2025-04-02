# Opentelemetry with .NET

.NET's OpenTelemetry implementation stands out due to its unique integration with the framework's built-in observability features. Instead of providing separate APIs, OpenTelemetry in .NET leverages the framework's native instrumentation capabilities for [logging](https://learn.microsoft.com/en-us/dotnet/api/microsoft.extensions.logging.ilogger-1?view=net-9.0-pp), [metrics](https://learn.microsoft.com/en-us/dotnet/api/system.diagnostics.metrics.meter?view=net-9.0), and [traces](https://learn.microsoft.com/en-us/dotnet/api/system.diagnostics.activitysource?view=net-9.0).

## OpenTelementry Libraries

OpenTelemetry for .NET consists of several NuGet packages organized into three main categories:

- Core API - Provides the fundamental building blocks and interfaces
- Instrumentation Packages - Automatically collect data from the .NET runtime, libraries, or framework components.
- Exporter Packages - Use these to send signals to various AMP backends like prometheus, Jaeger, Zipkin, or OTLP.

| Package | Description |
| -------- | -------- |
| [OpenTelemetry]https://github.com/open-telemetry/opentelemetry-dotnet/blob/main/src/OpenTelemetry/README.md)   | Main OTEL library that provides the core functionality    |
| [OpenTelemetry.Instrumentation.AspNetCore](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/blob/main/src/OpenTelemetry.Instrumentation.AspNetCore/README.md)    | Instrumentation for ASP.NET Core and Kestrel    |
| [OpenTelemetry.Instrumentation.GrpcNetClient](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/blob/main/src/OpenTelemetry.Instrumentation.GrpcNetClient/README.md)    | Instrumentation for gRPC Client    |
| [OpenTelemetry.Instrumentation.Http](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/blob/main/src/OpenTelemetry.Instrumentation.Http/README.md)    | Instrumentation for HttpClient and HttpWebRequest classes    |
| [OpenTelemetry.Instrumentation.SqlClient](https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/src/OpenTelemetry.Exporter.Console/README.md)    | Instrumentation for SqlClient used to trace database operations like Entity Framework Core    |
| [OpenTelemetry.Exporter.Console](https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/src/OpenTelemetry.Exporter.Console/README.md)    | Exporter using the OTLP protocol    |
| [OpenTelemetry.Exporter.OpenTelemetryProtocol](https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/src/OpenTelemetry.Exporter.OpenTelemetryProtocol/README.md)    | Exporter using the OTLP protocol    |
| [OpenTelemetry.Exporter.Prometheus.AspNetCore](https://github.com/open-telemetry/opentelemetry-dotnet/blob/main/src/OpenTelemetry.Exporter.Prometheus.AspNetCore/README.md)    | Exporter for Prometheus implemented using an ASP.NET Core endpoint    |
| [OpenTelemetry.Exporter.Zipkin](https://github.com/open-telemetry/opentelemetry-dotnet/blob/main/src/OpenTelemetry.Exporter.Zipkin/README.md)    | Exporter for Zipkin tracing    |

## AWS .NET OpenTelemetry Libraries

AWS released their latest iteration of OpenTelemetry packages which are available in NuGet. The packages have been reworked for simplicity and to conform to the latest OpenTelemetry naming conventions. They include new features like support for enhanced observability in AWS SDK for .NET and additional instrumentation for AWS services, including Amazon Bedrock, as well as multiple bug fixes, enhancements and contributions by the OpenTelemetry community. 

The table below describes these packages.

| Package | Description |
| -------- | -------- |
| [OpenTelemetry.Instrumentation.AWS](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/tree/main/src/OpenTelemetry.Instrumentation.AWS)    | Enhances metrics and tracing calls with additional data about AWS services while using AWS SDK for .NET.    |
| [OpenTelemetry.Instrumentation.AWSLambda](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/tree/main/src/OpenTelemetry.Instrumentation.AWSLambda)    | SDK methods to instrument AWS Lambda Handler to create incoming spans    |
| [OpenTelemetry.Resources.AWS](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/tree/main/src/OpenTelemetry.Resources.AWS)    | AWS specific resource detectors to enhance telemetry with metadata based on where your application is running. Includes support for Amazon EC2, AWS Elastic Beanstalk, Amazon Elastic Container Service (Amazon ECS), and Amazon Elastic Kubernetes Service (Amazon EKS)    |
| [OpenTelemetry.Extensions.AWS](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/tree/main/src/OpenTelemetry.Extensions.AWS)    | Supports Trace Context propagation via AWS X-Ray. |