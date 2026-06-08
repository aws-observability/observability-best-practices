# OpenTelemetry와 .NET

OpenTelemetry의 .NET 구현은 프레임워크의 기존 계측 기능 위에 구축되기 때문에 다른 언어의 구현과 차별화됩니다. 다른 플랫폼에서는 OpenTelemetry가 완전한 텔레메트리 API를 제공해야 하지만, .NET은 이미 로깅, 메트릭, Activity를 위한 플랫폼 API를 통해 강력한 빌트인 메커니즘을 제공합니다. OpenTelemetry의 .NET 구현은 새로운 것을 만들기보다 이러한 네이티브 컴포넌트([System.Diagnostics](https://learn.microsoft.com/en-us/dotnet/api/system.diagnostics?view=net-9.0) 등)를 그대로 활용합니다. 이는 라이브러리 작성자가 이미 익숙한 표준 .NET API를 사용할 수 있으며, OpenTelemetry가 이러한 기존 계측 포인트와 원활하게 통합됨을 의미합니다.

## OpenTelemetry 라이브러리

OpenTelemetry의 .NET 구현은 세 가지 기본 패키지 카테고리로 구성됩니다:

1. **Core API** 패키지는 텔레메트리 수집을 위한 핵심 인터페이스와 구현을 포함하여 필수 기반과 기본 기능을 제공합니다.

1. **Instrumentation** 패키지는 다양한 .NET 컴포넌트와 인기 라이브러리에서 텔레메트리 데이터를 자동으로 수집하며, ASP.NET Core, HTTP 클라이언트, Entity Framework과 같은 소스에서 메트릭, 트레이스, 로그를 캡처합니다.

1. **Exporter** 패키지는 다양한 Observability 플랫폼으로의 브릿지 역할을 하며, 수집된 텔레메트리 데이터를 Jaeger, Prometheus 또는 OTLP 프로토콜을 지원하는 모든 시스템으로 전송할 수 있게 합니다.

이 컴포넌트들은 NuGet을 통해 사용 가능한 응집력 있는 시스템으로 함께 작동하여 .NET 애플리케이션을 위한 완전한 Observability 솔루션을 제공합니다.

아래 표에서 이 패키지들을 설명합니다.

| 패키지 | 설명 |
| -------- | -------- |
| [OpenTelemetry](https://github.com/open-telemetry/opentelemetry-dotnet/blob/main/src/OpenTelemetry/README.md)   | 핵심 기능을 제공하는 메인 OTEL 라이브러리    |
| [OpenTelemetry.Instrumentation.AspNetCore](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/blob/main/src/OpenTelemetry.Instrumentation.AspNetCore/README.md)    | ASP.NET Core 및 Kestrel 계측    |
| [OpenTelemetry.Instrumentation.GrpcNetClient](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/blob/main/src/OpenTelemetry.Instrumentation.GrpcNetClient/README.md)    | gRPC Client 계측    |
| [OpenTelemetry.Instrumentation.Http](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/blob/main/src/OpenTelemetry.Instrumentation.Http/README.md)    | HttpClient 및 HttpWebRequest 클래스 계측    |
| [OpenTelemetry.Instrumentation.SqlClient](https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/src/OpenTelemetry.Exporter.Console/README.md)    | Entity Framework Core 등의 데이터베이스 작업을 트레이싱하는 SqlClient 계측    |
| [OpenTelemetry.Exporter.Console](https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/src/OpenTelemetry.Exporter.Console/README.md)    | 콘솔 출력용 Exporter    |
| [OpenTelemetry.Exporter.OpenTelemetryProtocol](https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/src/OpenTelemetry.Exporter.OpenTelemetryProtocol/README.md)    | OTLP 프로토콜을 사용하는 Exporter    |
| [OpenTelemetry.Exporter.Prometheus.AspNetCore](https://github.com/open-telemetry/opentelemetry-dotnet/blob/main/src/OpenTelemetry.Exporter.Prometheus.AspNetCore/README.md)    | ASP.NET Core 엔드포인트를 사용하여 구현된 Prometheus용 Exporter    |
| [OpenTelemetry.Exporter.Zipkin](https://github.com/open-telemetry/opentelemetry-dotnet/blob/main/src/OpenTelemetry.Exporter.Zipkin/README.md)    | Zipkin 트레이싱용 Exporter    |

## AWS .NET OpenTelemetry 라이브러리

AWS는 NuGet에서 사용 가능한 최신 버전의 OpenTelemetry 패키지를 출시했습니다. 이 패키지들은 단순성을 위해 재설계되었으며 최신 OpenTelemetry 명명 규칙을 따릅니다. AWS SDK for .NET에서의 향상된 Observability 지원, Amazon Bedrock을 포함한 AWS 서비스에 대한 추가 계측과 같은 새로운 기능이 포함되어 있으며, OpenTelemetry 커뮤니티의 다양한 버그 수정, 개선 사항 및 기여도 반영되어 있습니다.

아래 표에서 이 패키지들을 설명합니다.

| 패키지 | 설명 |
| -------- | -------- |
| [OpenTelemetry.Instrumentation.AWS](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/tree/main/src/OpenTelemetry.Instrumentation.AWS)    | AWS SDK for .NET 사용 시 AWS 서비스에 대한 추가 데이터로 메트릭 및 트레이싱 호출을 향상시킵니다.    |
| [OpenTelemetry.Instrumentation.AWSLambda](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/tree/main/src/OpenTelemetry.Instrumentation.AWSLambda)    | 수신 span을 생성하기 위해 AWS Lambda Handler를 계측하는 SDK 메서드    |
| [OpenTelemetry.Resources.AWS](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/tree/main/src/OpenTelemetry.Resources.AWS)    | 애플리케이션이 실행되는 위치를 기반으로 메타데이터를 사용하여 텔레메트리를 향상시키는 AWS 전용 리소스 검출기. Amazon EC2, AWS Elastic Beanstalk, Amazon Elastic Container Service (Amazon ECS), Amazon Elastic Kubernetes Service (Amazon EKS)를 지원합니다.    |
