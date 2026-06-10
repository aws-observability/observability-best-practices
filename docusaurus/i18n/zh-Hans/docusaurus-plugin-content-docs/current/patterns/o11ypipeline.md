# ADOT Observability 管道

Observability 管道由多个组件组成，这些组件协同工作，从各种来源收集、管理和分析 observability 数据。

## EKS 集群

EKS（Elastic Kubernetes Service）集群承载 observability 管道的主要组件。

### 安装 ADOT Operator Helm Chart

ADOT（AWS Distro for OpenTelemetry）Operator 使用 Helm chart 安装。它管理 observability 管道组件的部署和配置。

### 用户配置的 Collector

用户配置的 collector 由 operator 管理，包含以下组件：

- Collector 作为 Deployment：collector 作为 Kubernetes deployment 部署，确保高可用性和可扩展性。
- Collector-0、Collector-1、Collector-2：部署多个 collector 实例来处理传入的 observability 数据。它们协同工作以分配工作负载并确保可靠的数据收集。

![OTEL pipeline](./images/otelpipeline.png)
*图 1: OpenTelemetry 管道*

### 持久卷

持久卷用于存储收集的 observability 数据。它确保数据持久性，并允许长期存储和分析。

### Kubernetes 节点

Kubernetes 节点承载应用程序 pod 和作为 sidecar 的 collector。

- 应用程序容器：应用程序容器运行实际的应用程序代码并生成 observability 数据。
- Collector 作为 Sidecar：collector 作为 sidecar 容器与应用程序容器并行运行。它收集应用程序生成的 observability 数据。

## 抓取目标

Observability 管道从各种抓取目标收集数据，例如：

- 抓取 traces/metrics：管道从应用程序和基础设施组件抓取 traces 和 metrics。

## AWS Prometheus Remote Write Exporter

AWS Prometheus Remote Write Exporter 用于将收集的 observability 数据导出到 AWS 服务。

## AWS CloudWatch EMF Exporter

AWS CloudWatch EMF（Embedded Metric Format）Exporter 用于将 metrics 导出到 AWS CloudWatch。

## AWS X-Ray Tracing Exporter

AWS X-Ray Tracing Exporter 用于将 tracing 数据导出到 AWS X-Ray，进行分布式追踪和性能分析。

Observability 管道从抓取目标收集数据，使用 collector 进行处理，然后将数据导出到各种 AWS 服务进行进一步分析和可视化。


## 使用 ADOT 收集 Metrics 和洞察

1. **检测（Instrumentation）**：与 OpenTelemetry 类似，ADOT 提供库和 SDK 来检测您的应用程序和服务，捕获 metrics、traces 和日志等遥测数据。

2. **Metrics 收集**：ADOT 支持收集和导出系统级和应用级 metrics，包括 AWS 服务 metrics，提供对资源利用率和应用程序性能的洞察。

3. **分布式追踪**：ADOT 支持跨 AWS 服务、容器和本地环境的分布式追踪，允许您端到端地追踪请求和操作。

4. **日志记录**：ADOT 包含对结构化日志记录的支持，将日志数据与其他遥测信号相关联，实现全面的 observability。

5. **AWS 服务集成**：ADOT 与 AWS X-Ray、AWS CloudWatch、Amazon Managed Service for Prometheus 和 AWS Distro for OpenTelemetry Operator 等 AWS 服务紧密集成，支持在 AWS 生态系统内无缝收集和分析遥测数据。

6. **自动检测**：ADOT 为流行的框架和库提供自动检测功能，简化了现有应用程序的检测过程。

7. **数据处理和分析**：ADOT 收集的遥测数据可以导出到 AWS X-Ray、Amazon Managed Service for Prometheus 和 AWS CloudWatch 等 AWS observability 服务，利用 AWS 原生分析和可视化工具。

## 使用 ADOT 的优势

1. **AWS 原生集成**：ADOT 设计为与 AWS 服务和基础设施无缝集成，在 AWS 生态系统内提供一致的 observability 体验。

2. **性能和可扩展性**：ADOT 针对性能和可扩展性进行了优化，能够在大规模 AWS 环境中高效地收集和分析遥测数据。

3. **安全性和合规性**：ADOT 遵循 AWS 安全最佳实践，并符合各种行业标准，确保安全合规的 observability 实践。

4. **AWS 支持**：作为 AWS 支持的发行版，ADOT 受益于 AWS 广泛的文档、支持渠道和对 OpenTelemetry 项目的长期承诺。

## OpenTelemetry 和 ADOT 的区别

虽然 ADOT 和 OpenTelemetry 共享许多核心功能，但存在一些关键区别：

1. **AWS 集成**：ADOT 专为 AWS 环境设计，并与 AWS 服务紧密集成，而 OpenTelemetry 是一个厂商中立的项目。

2. **AWS 优化**：ADOT 针对 AWS 环境中的性能、可扩展性和安全性进行了优化，利用 AWS 原生服务和最佳实践。

3. **AWS 支持**：ADOT 受益于官方 AWS 支持、文档和长期承诺，而 OpenTelemetry 依赖社区支持。

4. **AWS 特定功能**：ADOT 包含 AWS 特定功能和 AWS 服务的自动检测，而 OpenTelemetry 专注于通用 observability。

5. **厂商中立性**：OpenTelemetry 是一个厂商中立的项目，允许与各种 observability 平台集成，而 ADOT 主要专注于 AWS observability 服务。

通过利用 ADOT，组织可以在 AWS 生态系统内实现全面的 observability，受益于 AWS 原生集成、优化的性能和 AWS 支持，同时仍然保持利用 OpenTelemetry 功能和社区贡献的灵活性。
