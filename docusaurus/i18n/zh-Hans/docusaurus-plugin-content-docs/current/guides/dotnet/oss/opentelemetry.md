# OpenTelemetry 与 .NET

.NET 中的 OpenTelemetry 与其他语言的实现不同，因为它建立在框架现有的检测能力之上。虽然其他平台需要 OpenTelemetry 提供完整的遥测 API，但 .NET 已经通过其平台 API 为 logging、metrics 和 activities 提供了强大的内置机制。OpenTelemetry .NET 实现只是利用这些原生组件（如 [System.Diagnostics](https://learn.microsoft.com/en-us/dotnet/api/system.diagnostics?view=net-9.0)），而不是创建新的组件。这意味着库作者可以使用他们已经熟悉的标准 .NET API，而 OpenTelemetry 可以与这些现有的检测点无缝集成。

## OpenTelemetry 库

.NET 中的 OpenTelemetry 围绕三个基本包类别构建：

1. **核心 API** 包提供基本基础和核心功能，包括遥测收集的核心接口和实现。

1. **检测** 包自动从各种 .NET 组件和流行库收集遥测数据，从 ASP.NET Core、HTTP 客户端和 Entity Framework 等源捕获 metrics、traces 和 logs。

1. **导出器** 包充当不同 Observability 平台的桥梁，允许您将收集的遥测数据发送到各种目标，如 Jaeger、Prometheus 或任何支持 OTLP 协议的系统。

这些组件通过 NuGet 提供，作为一个完整的系统协同工作，为 .NET 应用程序提供完整的 Observability 解决方案。

下表描述了这些包。

| 包 | 描述 |
| -------- | -------- |
| [OpenTelemetry](https://github.com/open-telemetry/opentelemetry-dotnet/blob/main/src/OpenTelemetry/README.md)   | 提供核心功能的主要 OTEL 库    |
| [OpenTelemetry.Instrumentation.AspNetCore](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/blob/main/src/OpenTelemetry.Instrumentation.AspNetCore/README.md)    | ASP.NET Core 和 Kestrel 的检测    |
| [OpenTelemetry.Instrumentation.GrpcNetClient](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/blob/main/src/OpenTelemetry.Instrumentation.GrpcNetClient/README.md)    | gRPC 客户端的检测    |
| [OpenTelemetry.Instrumentation.Http](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/blob/main/src/OpenTelemetry.Instrumentation.Http/README.md)    | HttpClient 和 HttpWebRequest 类的检测    |
| [OpenTelemetry.Instrumentation.SqlClient](https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/src/OpenTelemetry.Exporter.Console/README.md)    | SqlClient 的检测，用于跟踪数据库操作（如 Entity Framework Core）    |
| [OpenTelemetry.Exporter.Console](https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/src/OpenTelemetry.Exporter.Console/README.md)    | 使用 OTLP 协议的导出器    |
| [OpenTelemetry.Exporter.OpenTelemetryProtocol](https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/src/OpenTelemetry.Exporter.OpenTelemetryProtocol/README.md)    | 使用 OTLP 协议的导出器    |
| [OpenTelemetry.Exporter.Prometheus.AspNetCore](https://github.com/open-telemetry/opentelemetry-dotnet/blob/main/src/OpenTelemetry.Exporter.Prometheus.AspNetCore/README.md)    | 使用 ASP.NET Core endpoint 实现的 Prometheus 导出器    |
| [OpenTelemetry.Exporter.Zipkin](https://github.com/open-telemetry/opentelemetry-dotnet/blob/main/src/OpenTelemetry.Exporter.Zipkin/README.md)    | Zipkin tracing 的导出器    |

## AWS .NET OpenTelemetry 库

AWS 发布了最新版本的 OpenTelemetry 包，可在 NuGet 上获取。这些包经过重新设计，更加简洁并符合最新的 OpenTelemetry 命名约定。它们包含新功能，如对 AWS SDK for .NET 增强 Observability 的支持，以及对 AWS 服务（包括 Amazon Bedrock）的额外检测，还有多个错误修复、增强功能和 OpenTelemetry 社区的贡献。

下表描述了这些包。

| 包 | 描述 |
| -------- | -------- |
| [OpenTelemetry.Instrumentation.AWS](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/tree/main/src/OpenTelemetry.Instrumentation.AWS)    | 在使用 AWS SDK for .NET 时，通过额外的 AWS 服务数据增强 metrics 和 tracing 调用。    |
| [OpenTelemetry.Instrumentation.AWSLambda](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/tree/main/src/OpenTelemetry.Instrumentation.AWSLambda)    | 用于检测 AWS Lambda Handler 以创建传入 span 的 SDK 方法    |
| [OpenTelemetry.Resources.AWS](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/tree/main/src/OpenTelemetry.Resources.AWS)    | AWS 特定的资源检测器，用于根据应用程序运行位置增强遥测元数据。包括对 Amazon EC2、AWS Elastic Beanstalk、Amazon Elastic Container Service (Amazon ECS) 和 Amazon Elastic Kubernetes Service (Amazon EKS) 的支持    |
| [OpenTelemetry.Extensions.AWS](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/tree/main/src/OpenTelemetry.Extensions.AWS)    | 支持通过 AWS X-Ray 进行 Trace Context 传播。 |
