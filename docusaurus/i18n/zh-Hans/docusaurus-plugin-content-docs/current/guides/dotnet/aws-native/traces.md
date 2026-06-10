# Traces

Traces 跟踪复杂分布式系统中的请求处理，提供有关请求流经各个组件（包括下游 AWS 资源、微服务、数据库和 API）的详细信息。这将通过识别瓶颈和延迟问题来帮助进行性能优化。

在本节中，您将看到 AWS 文档和开源仓库的链接，这些链接提供了使用 AWS X-Ray SDK for .NET 来检测 .NET 应用程序以创建和通过 X-Ray daemon 将 trace 信息发送到 AWS X-Ray 的相关信息。

要了解 AWS X-Ray 及其核心概念，请访问 AWS X-Ray 开发者指南中的 [**什么是 AWS X-Ray**](https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html) 和 [**概念**](https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html) 部分。

X-Ray SDK for .NET 是一个用于检测 C# .NET Web 应用程序、.NET Core Web 应用程序和 AWS Lambda 上的 .NET Core 函数的库。它提供用于生成和发送 trace 数据到 X-Ray daemon 的类和方法。这包括有关应用程序处理的传入请求的信息，以及应用程序对下游 AWS 服务、HTTP Web API 和 SQL 数据库的调用。

## Agent 和 SDK 选项

您可以选择 AWS X-Ray daemon、CloudWatch agent 和 AWS Distro for OpenTelemetry (ADOT) collector 来从 Amazon EC2 实例和本地服务器收集 traces 并将其发送到 AWS X-Ray。选择适合您用例的工具，以便最大限度地减少需要管理的 agent 数量。

要了解如何配置 X-Ray daemon 以从您的应用程序和基础设施收集和发送 traces，请阅读 [**AWS X-Ray daemon**](https://docs.aws.amazon.com/xray/latest/devguide/xray-daemon.html) 指南。如果您选择使用 CloudWatch agent，[**Amazon CloudWatch 用户指南**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html)将提供设置和配置 CloudWatch agent 的说明。

要检测您的应用程序以生成 traces，您可以选择 OpenTelemetry 和 X-Ray SDK for .NET。选择这些选项的指导可在[**此处**](https://docs.aws.amazon.com/xray/latest/devguide/xray-instrumenting-your-app.html#xray-instrumenting-choosing)获得。

## AWS X-Ray SDK for .NET
 
X-Ray SDK for .NET 是一个开源项目。X-Ray SDK for .NET 支持面向 .NET Framework 4.5 或更高版本的应用程序。对于 .NET Core 应用程序，SDK 需要 .NET Core 2.0 或更高版本。

以下是帮助您入门的链接。

[**AWS X-Ray SDK for .NET 开发者指南**](https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-dotnet.html) - 该文档解释了通过 NuGet 安装、配置选项以及各种检测功能，包括自动 HTTP 请求 tracing 和 AWS 服务调用监控。它涵盖了开发人员如何创建自定义段、添加注释以及利用采样规则来管理数据收集。该指南为将 X-Ray tracing 集成到 ASP.NET 应用程序中提供了全面的信息，帮助开发人员了解应用程序性能并有效地排除问题。

[**SDK 开源项目仓库 - aws-xray-sdk-dotnet**](https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-dotnet.html) - aws-xray-sdk-dotnet 仓库包含 Amazon X-Ray SDK for .NET 的开源代码。开发人员可以查看此 tracing 工具的实现，该工具支持跨 .NET Core 和 .NET Framework 环境的分布式应用程序监控。该仓库包含 HTTP 请求自动检测、AWS 服务调用和自定义检测功能的源代码。您可以查看 SDK 如何与 ASP.NET 框架集成以及如何实现采样规则。此 GitHub 项目提供了 SDK 功能的透明度，同时允许开发人员报告问题或为代码库贡献改进。

以下是全面描述 .NET X-Ray SDK 组件的 API 参考手册。

[**The API Reference for .NET Framework**](https://docs.aws.amazon.com/xray-sdk-for-dotnet/latest/reference/html/d0b774be-200e-4897-9ce6-4e43c3f6f5de.htm)

[**The API Reference for .NET (Core)**](https://docs.aws.amazon.com/xray-sdk-for-dotnetcore/latest/reference/html/bdf06719-4833-4e03-8ce5-31debb71506c.htm)

以下是用于学习在 ASP.NET 和 ASP.NET Core 应用程序中使用 X-Ray SDK for .NET 的示例应用程序链接

[**示例 ASP.NET 和 ASP.NET Core 应用程序**](https://github.com/aws-samples/aws-xray-dotnet-webapp)
