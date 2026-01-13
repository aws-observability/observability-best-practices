# .NET での OpenTelemetry

.NET における OpenTelemetry は、フレームワークの既存のインストルメンテーション機能を基盤としているため、他の言語での実装とは異なる特徴があります。他のプラットフォームでは OpenTelemetry が完全なテレメトリ API を提供する必要がありますが、.NET はログ、メトリクス、アクティビティのためのプラットフォーム API を通じて、すでに堅牢な組み込みメカニズムを提供しています。OpenTelemetry .NET 実装は、新しいコンポーネントを作成するのではなく、これらのネイティブコンポーネント ([System.Diagnostics](https://learn.microsoft.com/en-us/dotnet/api/system.diagnostics?view=net-9.0) など) を単純に活用します。これは、ライブラリ作成者がすでに慣れ親しんでいる標準的な .NET API を使用でき、OpenTelemetry がこれらの既存のインストルメンテーションポイントとシームレスに統合されることを意味します。

## OpenTelemetry ライブラリ

.NET における OpenTelemetry は、3 つの基本的なパッケージカテゴリを中心に構成されています。

1. **Core API** パッケージは、テレメトリ収集のためのコアインターフェースと実装を含む、必須の基盤とベース機能を提供します。

1. **Instrumentation** パッケージは、さまざまな .NET コンポーネントや人気のあるライブラリからテレメトリデータを自動的に収集し、ASP.NET Core、HTTP クライアント、Entity Framework などのソースからメトリクス、トレース、ログをキャプチャします。

1. **Exporter** パッケージは、さまざまなオブザーバビリティプラットフォームへの橋渡しとして機能し、収集したテレメトリデータを Jaeger、Prometheus、または OTLP プロトコルをサポートする任意のシステムなど、さまざまな宛先に送信できるようにします。

これらのコンポーネントは、NuGet を通じて利用可能な統合されたシステムとして連携し、.NET アプリケーションに完全なオブザーバビリティソリューションを提供します。

以下の表は、これらのパッケージについて説明しています。

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

## AWS .NET OpenTelemetry ライブラリ

AWS は、NuGet で利用可能な OpenTelemetry パッケージの最新版をリリースしました。これらのパッケージは、シンプルさと最新の OpenTelemetry 命名規則への準拠を目的として再設計されています。AWS SDK for .NET における強化されたオブザーバビリティのサポートや、Amazon Bedrock を含む AWS サービスの追加インストルメンテーション、さらに複数のバグ修正、機能強化、OpenTelemetry コミュニティによる貢献などの新機能が含まれています。

以下の表は、これらのパッケージについて説明しています。

| Package | Description |
| -------- | -------- |
| [OpenTelemetry.Instrumentation.AWS](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/tree/main/src/OpenTelemetry.Instrumentation.AWS)    | Enhances metrics and tracing calls with additional data about AWS services while using AWS SDK for .NET.    |
| [OpenTelemetry.Instrumentation.AWSLambda](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/tree/main/src/OpenTelemetry.Instrumentation.AWSLambda)    | SDK methods to instrument AWS Lambda Handler to create incoming spans    |
| [OpenTelemetry.Resources.AWS](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/tree/main/src/OpenTelemetry.Resources.AWS)    | AWS specific resource detectors to enhance telemetry with metadata based on where your application is running. Includes support for Amazon EC2, AWS Elastic Beanstalk, Amazon Elastic Container Service (Amazon ECS), and Amazon Elastic Kubernetes Service (Amazon EKS)    |
