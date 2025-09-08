# OpenTelemetry with .NET

OpenTelemetry in .NET stands out from implementations in other languages because it builds upon the framework's existing instrumentation capabilities. While other platforms require OpenTelemetry to provide complete telemetry APIs, .NET already offers robust built-in mechanisms through its platform APIs for logging, metrics, and activities. The OpenTelemetry .NET implementation simply leverages these native components (like [System.Diagnostics](https://learn.microsoft.com/en-us/dotnet/api/system.diagnostics?view=net-9.0)) rather than creating new ones. This means library authors can use the standard .NET APIs they're already familiar with, and OpenTelemetry seamlessly integrates with these existing instrumentation points.

## OpenTelementry Libraries

OpenTelemetry in .NET is structured around three fundamental package categories:

1. **The Core API** packages provide the essential foundation and base functionality, including core interfaces and implementations for telemetry collection.

1. **Instrumentation** packages automatically collect telemetry data from various .NET components and popular libraries, capturing metrics, traces, and logs from sources like ASP.NET Core, HTTP clients, and Entity Framework.

1. **Exporter** packages serve as bridges to different observability platforms, allowing you to send your collected telemetry data to various destinations such as Jaeger, Prometheus, or any system supporting the OTLP protocol.

These components work together as a cohesive system, available through NuGet, to provide a complete observability solution for .NET applications.

The table below describes these packages.

| Package | Description |
| -------- | -------- |
| [OpenTelemetry](https://github.com/open-telemetry/opentelemetry-dotnet/blob/main/src/OpenTelemetry/README.md)   | Main OTEL library that provides the core functionality    |
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
