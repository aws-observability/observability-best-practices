# 数据科学家、AI/ML、MLOps 工程师

数据工程和机器学习运维中的 Observability 对于维护可靠、高性能和可信赖的数据管道和 ML 模型至关重要。如果没有适当的 Observability，ML 系统就会变成难以维护、调试和改进的黑盒。这可能导致不可靠的预测、成本增加和潜在的业务影响。

以下是指导您在数据和 ML 运维中制定 Observability 策略的关键最佳实践。

## 最佳实践
使用 CloudWatch [logs](https://aws-observability.github.io/observability-best-practices/tools/logs/)、[metrics](https://aws-observability.github.io/observability-best-practices/tools/metrics) 和 [traces](https://aws-observability.github.io/observability-best-practices/tools/xray) 进行监控。为所有资源实施标签策略，为关键事件创建 metric 过滤器，设置[异常检测](https://aws-observability.github.io/observability-best-practices/tools/metrics#anomaly-detection)并使用 [CloudWatch alarms](https://aws-observability.github.io/observability-best-practices/tools/alarms) 配置告警阈值。

### 数据质量保证
它确保在整个数据生命周期中监控数据质量、管道性能和基础设施健康状况。

关键监控领域包括：
- ETL 管道吞吐量、处理时间和错误率
- 数据模式中的异常检测，用于数据质量、特征漂移检测、训练/推理数据的分布分析

### 模型性能监控
通过与 Amazon CloudWatch 的集成，AWS 自动捕获详细的训练参数、超参数、管道执行 metrics、作业性能 metrics 和基础设施利用率 metrics，从而实现对训练作业的彻底分析和调试。模型版本控制和注册表功能确保系统地跟踪模型迭代、元数据和审批状态，使模型血缘管理变得容易。

[Amazon SageMaker Model Monitor](https://docs.aws.amazon.com/sagemaker/latest/dg/how-it-works-model-monitor.html) 持续监控生产环境中的机器学习模型。它提供自动告警系统，当模型质量出现偏差（如数据漂移和异常）时触发告警。该系统与 [Amazon CloudWatch Logs](https://aws-observability.github.io/observability-best-practices/tools/logs/#search-with-cloudwatch-logs) 集成用于收集监控数据，从而实现已部署模型的早期检测和主动维护。

创建一种机制来使用 CloudWatch metrics 或 [ADOT](https://aws-observability.github.io/observability-best-practices/guides/operational/adot-at-scale/operating-adot-collector) 以及 [Amazon OpenSearch Service (OpenSearch Service)](https://aws-observability.github.io/observability-best-practices/patterns/opensearch) 等服务来聚合和分析模型预测 endpoint metrics（如准确性和延迟）。OpenSearch Service 支持 Kibana 用于 dashboard 和可视化。可追溯性允许分析可能影响当前运营性能的变更。

### 基础设施监控
AWS 提供对资源利用率、存储模式和计算效率的深度可见性。CloudWatch Metrics 和 [OpenTelemetry](https://aws-observability.github.io/observability-best-practices/patterns/otel) 捕获有关 CPU 使用率、内存分配和 I/O 操作的实时数据，而 CloudWatch Logs 聚合日志数据以进行分析。[AWS X-Ray](https://aws-observability.github.io/observability-best-practices/tools/xray) 帮助跟踪服务依赖关系并识别 ML 管道各阶段的系统瓶颈，从而实现高效的资源优化和成本管理。

### 合规性和治理
跨多个账户和模型版本、血缘和审批工作流跟踪的 ML 资源集中治理至关重要。AWS CloudTrail 维护所有 API 活动的审计日志，这对于法规合规性和治理至关重要。

### 业务影响分析
CloudWatch 中的[自定义 metrics](https://aws-observability.github.io/observability-best-practices/tools/metrics#collecting-metrics) 可以跟踪业务特定的 KPI，通过 QuickSight dashboard 实现 ML 计划投资回报率的实时可视化。Amazon QuickSight 创建交互式 dashboard，将技术 metrics 转化为业务洞察，将 ML 性能与业务 KPI 联系起来。Amazon CloudWatch [ServiceLens](https://aws-observability.github.io/observability-best-practices/tools/rum#enable-active-tracing) 有助于监控用户体验影响。

## 参考资料
- [AWS Observability Workshop](https://catalog.workshops.aws/observability/en-US)
- [AWS Observability Best Practices](https://aws-observability.github.io/observability-best-practices/)
- [AWS Well-Architected Framework Machine Learning Lens](https://docs.aws.amazon.com/wellarchitected/latest/machine-learning-lens/machine-learning-lens.html)
- [Sagemaker Logging and Monitoring](https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-incident-response.html)
- [Metrics for monitoring Amazon SageMaker AI](https://docs.aws.amazon.com/sagemaker/latest/dg/monitoring-cloudwatch.html) with Amazon CloudWatch
