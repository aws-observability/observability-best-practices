# Traces

Traces(트레이스)는 다운스트림 AWS 리소스, 마이크로서비스, 데이터베이스, API를 포함한 개별 구성 요소를 통한 요청 흐름에 대한 상세한 정보를 제공하여 복잡한 분산 시스템을 통한 요청 처리를 추적합니다. 이를 통해 병목 현상과 지연 문제를 식별하여 성능 최적화에 도움이 됩니다.

이 섹션에서는 AWS X-Ray SDK for .NET을 사용하여 .NET 애플리케이션을 계측하고 X-Ray 데몬을 통해 AWS X-Ray로 트레이스 정보를 생성 및 전송하는 방법에 대한 AWS 문서와 오픈소스 리포지토리 링크를 제공합니다.

AWS X-Ray의 핵심 개념에 대해 알아보려면 AWS X-Ray 개발자 가이드의 [**AWS X-Ray란 무엇인가**](https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html) 및 [**개념**](https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html) 섹션을 방문하세요.

X-Ray SDK for .NET은 C# .NET 웹 애플리케이션, .NET Core 웹 애플리케이션, AWS Lambda의 .NET Core 함수를 계측하기 위한 라이브러리입니다. 애플리케이션이 처리하는 수신 요청, 다운스트림 AWS 서비스 호출, HTTP 웹 API 호출, SQL 데이터베이스 호출에 대한 정보를 포함하여 트레이스 데이터를 생성하고 X-Ray 데몬으로 전송하기 위한 클래스와 메서드를 제공합니다.

## 에이전트 및 SDK 옵션

Amazon EC2 인스턴스와 온프레미스 서버에서 트레이스를 수집하여 AWS X-Ray로 전송하기 위해 AWS X-Ray 데몬, CloudWatch Agent, AWS Distro for OpenTelemetry (ADOT) Collector 중에서 선택할 수 있습니다. 관리해야 하는 에이전트 수를 최소화할 수 있도록 사용 사례에 적합한 것을 선택하세요. 

애플리케이션과 인프라에서 트레이스를 수집하고 전송하기 위한 X-Ray 데몬 구성 방법은 [**AWS X-Ray 데몬**](https://docs.aws.amazon.com/xray/latest/devguide/xray-daemon.html) 가이드를 참조하세요. CloudWatch Agent를 사용하려면 [**Amazon CloudWatch 사용자 가이드**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html)에서 CloudWatch Agent의 설정 및 구성 지침을 확인할 수 있습니다.

트레이스를 생성하기 위한 애플리케이션 계측에는 OpenTelemetry와 X-Ray SDK for .NET 중에서 선택할 수 있습니다. 이러한 옵션 간의 선택 가이드는 [**여기**](https://docs.aws.amazon.com/xray/latest/devguide/xray-instrumenting-your-app.html#xray-instrumenting-choosing)에서 확인할 수 있습니다. 

## AWS X-Ray SDK for .NET
 
X-Ray SDK for .NET은 오픈소스 프로젝트입니다. X-Ray SDK for .NET은 .NET Framework 4.5 이상을 대상으로 하는 애플리케이션에서 지원됩니다. .NET Core 애플리케이션의 경우 SDK에는 .NET Core 2.0 이상이 필요합니다.

시작하는 데 도움이 되는 링크는 다음과 같습니다.

[**AWS X-Ray SDK for .NET 개발자 가이드**](https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-dotnet.html) - 이 문서에서는 NuGet을 통한 설치, 구성 옵션, 자동 HTTP 요청 트레이싱 및 AWS 서비스 호출 모니터링을 포함한 다양한 계측 기능을 설명합니다. 개발자가 사용자 지정 세그먼트를 생성하고, 어노테이션을 추가하며, 데이터 수집을 관리하기 위한 샘플링 규칙을 활용하는 방법을 다룹니다. ASP.NET 애플리케이션에 X-Ray 트레이싱을 통합하기 위한 포괄적인 정보를 제공하여, 개발자가 애플리케이션 성능에 대한 가시성을 확보하고 문제를 효과적으로 해결할 수 있도록 합니다.

[**SDK 오픈소스 프로젝트 리포지토리 - aws-xray-sdk-dotnet**](https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-dotnet.html) - aws-xray-sdk-dotnet 리포지토리에는 Amazon의 X-Ray SDK for .NET 오픈소스 코드가 포함되어 있습니다. 개발자는 .NET Core 및 .NET Framework 환경에서 분산 애플리케이션 모니터링을 지원하는 이 트레이싱 도구의 구현을 확인할 수 있습니다. 리포지토리에는 HTTP 요청 자동 계측, AWS 서비스 호출, 사용자 지정 계측 기능의 소스 코드가 포함되어 있습니다. SDK가 ASP.NET 프레임워크와 통합되는 방식과 샘플링 규칙이 구현되는 방식을 검토할 수 있습니다. 이 GitHub 프로젝트는 SDK의 기능에 대한 투명성을 제공하면서 개발자가 이슈를 보고하거나 코드베이스에 개선 사항을 기여할 수 있게 합니다.

아래는 .NET X-Ray SDK의 구성 요소를 포괄적으로 설명하는 API 레퍼런스 매뉴얼입니다. 

[**.NET Framework용 API 레퍼런스**](https://docs.aws.amazon.com/xray-sdk-for-dotnet/latest/reference/html/d0b774be-200e-4897-9ce6-4e43c3f6f5de.htm)

[**.NET (Core)용 API 레퍼런스**](https://docs.aws.amazon.com/xray-sdk-for-dotnetcore/latest/reference/html/bdf06719-4833-4e03-8ce5-31debb71506c.htm)

ASP.NET 및 ASP.NET Core 애플리케이션에서 X-Ray SDK for .NET을 사용하는 방법을 배울 수 있는 샘플 애플리케이션은 아래에 링크되어 있습니다.

[**샘플 ASP.NET 및 ASP.NET Core 애플리케이션**](https://github.com/aws-samples/aws-xray-dotnet-webapp)
