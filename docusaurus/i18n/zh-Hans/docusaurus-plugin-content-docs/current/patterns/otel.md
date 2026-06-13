# 使用 OpenTelemetry 实现可观测性

OpenTelemetry 是一个开源、供应商中立的可观测性框架，提供标准化的方式来收集和导出遥测数据，包括 logs、metrics 和 traces。通过利用 OpenTelemetry，组织可以实施全面的可观测性管道，同时确保供应商独立性并面向未来的可观测性策略。

## 使用 OpenTelemetry 收集 Metrics 和洞察

1. **检测**：使用 OpenTelemetry 的第一步是使用 OpenTelemetry 库或 SDK 对您的应用程序和服务进行检测。这些库自动捕获并导出来自应用程序代码的遥测数据，例如 metrics、traces 和 logs。

2. **Metrics 收集**：OpenTelemetry 提供了一种标准化的方式来收集和导出应用程序的 metrics。这些 metrics 可以包括系统 metrics（CPU、内存、磁盘使用率）、应用程序级别的 metrics（请求率、错误率、延迟）以及特定于您应用程序的自定义业务 metrics。

3. **分布式追踪**：OpenTelemetry 支持分布式追踪，使您能够在请求和操作传播通过分布式系统时对其进行追踪。这提供了对请求端到端流程的宝贵洞察，识别瓶颈并排除性能问题。

4. **日志记录**：虽然 OpenTelemetry 的主要焦点是 metrics 和 traces，但它也提供了结构化日志 API，可用于捕获和导出日志数据。这确保了 logs 与其他遥测数据相关联，提供系统行为的整体视图。

5. **导出器**：OpenTelemetry 支持各种导出器，允许您将遥测数据发送到不同的后端或可观测性平台。流行的导出器包括 Prometheus、Jaeger、Zipkin 以及云原生可观测性解决方案如 AWS CloudWatch、Azure Monitor 和 Google Cloud Operations。

6. **数据处理和分析**：遥测数据导出后，您可以利用可观测性平台、监控工具或自定义数据处理管道来分析和可视化收集的 metrics、traces 和 logs。此分析可以提供系统性能洞察、识别瓶颈，并帮助故障排除和根本原因分析。
![Otel](./images/otel.png)
*图 1：EKS 集群使用 ADOT 和 FluentBit 发送可观测性信号*
<!--Ref: https://aws.amazon.com/blogs/architecture/amazon-cloudwatch-insights-for-amazon-eks-on-ec2-using-aws-distro-for-opentelemetry-helm-charts/-->

## 使用 OpenTelemetry 的好处

1. **供应商中立**：OpenTelemetry 是一个开源、供应商中立的项目，确保您的可观测性策略不绑定到特定的供应商或平台。这种灵活性允许您根据需要在可观测性后端之间切换或组合多个解决方案。

2. **标准化**：OpenTelemetry 提供了一种标准化的方式来收集和导出遥测数据，实现不同组件和系统之间一致的数据格式和互操作性。

3. **面向未来**：通过采用 OpenTelemetry，您可以面向未来地保护您的可观测性策略。随着项目的发展和新功能及集成的添加，您现有的检测可以轻松更新，无需进行重大代码更改。

4. **全面的可观测性**：OpenTelemetry 支持多种遥测信号（metrics、traces 和 logs），提供系统行为和性能的全面视图。

5. **生态系统和社区支持**：OpenTelemetry 拥有不断增长的集成、工具生态系统和活跃的贡献者社区，确保持续的开发和支持。

通过利用 OpenTelemetry 实现可观测性，组织可以深入了解其系统，实现主动监控、高效故障排除和数据驱动的决策，同时在其可观测性策略中保持灵活性和供应商独立性。
