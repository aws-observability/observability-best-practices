# .NET での OpenTelemetry

.NET における OpenTelemetry は、フレームワークの既存のインストルメンテーション機能を基盤としているため、他の言語での実装とは異なる特徴があります。他のプラットフォームでは OpenTelemetry が完全なテレメトリ API を提供する必要がありますが、.NET はログ、メトリクス、アクティビティのためのプラットフォーム API を通じて、すでに堅牢な組み込みメカニズムを提供しています。OpenTelemetry .NET 実装は、新しいコンポーネントを作成するのではなく、これらのネイティブコンポーネント ([System.Diagnostics](https://learn.microsoft.com/en-us/dotnet/api/system.diagnostics?view=net-9.0) など) を単純に活用します。これは、ライブラリ作成者がすでに使い慣れている標準的な .NET API を使用でき、OpenTelemetry がこれらの既存のインストルメンテーションポイントとシームレスに統合されることを意味します。

## OpenTelemetry ライブラリ

.NET における OpenTelemetry は、3 つの基本的なパッケージカテゴリを中心に構成されています。

1. **Core API** パッケージは、テレメトリ収集のためのコアインターフェースと実装を含む、必須の基盤とベース機能を提供します。

1. **Instrumentation** パッケージは、さまざまな .NET コンポーネントや人気のあるライブラリからテレメトリデータを自動的に収集し、ASP.NET Core、HTTP クライアント、Entity Framework などのソースからメトリクス、トレース、ログをキャプチャします。

1. **Exporter** パッケージは、さまざまなオブザーバビリティプラットフォームへの橋渡しとして機能し、収集したテレメトリデータを Jaeger、Prometheus、または OTLP プロトコルをサポートする任意のシステムなど、さまざまな宛先に送信できるようにします。

これらのコンポーネントは、NuGet を通じて利用可能な統合されたシステムとして連携し、.NET アプリケーションに完全なオブザーバビリティソリューションを提供します。

以下の表は、これらのパッケージについて説明しています。

| パッケージ | 説明 |
| -------- | -------- |
| [OpenTelemetry](https://github.com/open-telemetry/opentelemetry-dotnet/blob/main/src/OpenTelemetry/README.md)   | コア機能を提供するメインの OTEL ライブラリです    |
| [OpenTelemetry.Instrumentation.AspNetCore](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/blob/main/src/OpenTelemetry.Instrumentation.AspNetCore/README.md)    | ASP.NET Core と Kestrel 向けのインストルメンテーションです    |
| [OpenTelemetry.Instrumentation.GrpcNetClient](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/blob/main/src/OpenTelemetry.Instrumentation.GrpcNetClient/README.md)    | gRPC クライアント向けのインストルメンテーションです    |
| [OpenTelemetry.Instrumentation.Http](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/blob/main/src/OpenTelemetry.Instrumentation.Http/README.md)    | HttpClient および HttpWebRequest クラス向けのインストルメンテーションです    |
| [OpenTelemetry.Instrumentation.SqlClient](https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/src/OpenTelemetry.Exporter.Console/README.md)    | Entity Framework Core などのデータベース操作をトレースするために使用される SqlClient 向けのインストルメンテーションです    |
| [OpenTelemetry.Exporter.Console](https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/src/OpenTelemetry.Exporter.Console/README.md)    | OTLP プロトコルを使用するエクスポーターです    |
| [OpenTelemetry.Exporter.OpenTelemetryProtocol](https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/src/OpenTelemetry.Exporter.OpenTelemetryProtocol/README.md)    | OTLP プロトコルを使用するエクスポーターです    |
| [OpenTelemetry.Exporter.Prometheus.AspNetCore](https://github.com/open-telemetry/opentelemetry-dotnet/blob/main/src/OpenTelemetry.Exporter.Prometheus.AspNetCore/README.md)    | ASP.NET Core エンドポイントを使用して実装された Prometheus 向けのエクスポーターです    |
| [OpenTelemetry.Exporter.Zipkin](https://github.com/open-telemetry/opentelemetry-dotnet/blob/main/src/OpenTelemetry.Exporter.Zipkin/README.md)    | Zipkin トレーシング向けのエクスポーターです    |

## AWS .NET OpenTelemetry ライブラリ

AWS は、NuGet で利用可能な OpenTelemetry パッケージの最新版をリリースしました。これらのパッケージは、シンプルさと最新の OpenTelemetry 命名規則への準拠を目的として再設計されています。AWS SDK for .NET における強化されたオブザーバビリティのサポートや、Amazon Bedrock を含む AWS サービスの追加インストルメンテーション、さらに複数のバグ修正、機能強化、OpenTelemetry コミュニティによる貢献などの新機能が含まれています。

以下の表は、これらのパッケージについて説明しています。

| パッケージ | 説明 |
| -------- | -------- |
| [OpenTelemetry.Instrumentation.AWS](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/tree/main/src/OpenTelemetry.Instrumentation.AWS)    | AWS SDK for .NET の使用時に、AWS サービスに関する追加データでメトリクスとトレーシングの呼び出しを強化します。    |
| [OpenTelemetry.Instrumentation.AWSLambda](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/tree/main/src/OpenTelemetry.Instrumentation.AWSLambda)    | 受信スパンを作成するために AWS Lambda ハンドラーをインストルメントする SDK メソッドです    |
| [OpenTelemetry.Resources.AWS](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/tree/main/src/OpenTelemetry.Resources.AWS)    | アプリケーションの実行場所に基づくメタデータでテレメトリを強化する AWS 固有のリソースディテクターです。Amazon EC2、AWS Elastic Beanstalk、Amazon Elastic Container Service (Amazon ECS)、Amazon Elastic Kubernetes Service (Amazon EKS) のサポートが含まれます    |
| [OpenTelemetry.Extensions.AWS](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/tree/main/src/OpenTelemetry.Extensions.AWS)    | AWS X-Ray を介した Trace Context の伝播をサポートします。 |