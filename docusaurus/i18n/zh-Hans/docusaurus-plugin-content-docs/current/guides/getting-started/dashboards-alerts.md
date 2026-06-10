---
sidebar_position: 4
---

# Dashboard 和告警

一旦您的遥测数据开始流动，您就可以设置与用例相关的 dashboard 和告警。

## 精选 Dashboard

请务必利用精选 dashboard，您可以在 CloudWatch 控制台的各个部分找到它们。

例如，您可以在 Dashboards 下找到许多服务（如 Lambda、EC2、API Gateway 等）的自动化 dashboard。

如果您正在使用 Application Signals，您可以在 Application Signals (APM) 下找到应用程序映射和 dashboard。此外，您还可以找到未检测到的服务，这将突出显示 Observability 方面的任何差距。

## 自定义 Dashboard

您还需要设计自己的业务特定 dashboard。请参阅以下指南了解如何为卓越运营设计 dashboard：[Building Dashboards for Operational Visibility](https://aws.amazon.com/builders-library/building-dashboards-for-operational-visibility/)

## CloudWatch Alarms

您还将创建告警（或 CloudWatch 中的 Alarms）来发出服务和基础设施问题信号。您可以在监控账户中创建告警以实现集中的告警可见性，或/和在本地账户中创建单独的告警。

### 告警建议

如果您不确定如何开始，Alarm Recommendations 将帮助您。告警建议基于监控最佳实践。在创建告警之前请审查推荐的告警配置。

更多详情请参阅 [Alarm recommendations for AWS services](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html)。

## Service Level Objectives (SLOs)

您还可以创建 SLO 和相关告警来帮助您跟踪重要的 KPI。

更多信息请参阅 [CloudWatch SLOs](../../tools/slos.md)。

## 总结

这就是 CloudWatch 入门指南的全部内容。以下是我们涵盖的步骤：

1. **设置监控和源账户** – 配置跨账户 Observability 以集中来自多个 AWS 账户和区域的遥测数据
2. **设置 Unified Data Store** – 将日志数据集中到单个账户和区域以实现统一查询和分析
3. **配置 Agents/Collectors** – 部署 CloudWatch agents 和/或 OpenTelemetry collectors 以从您的应用程序和基础设施发送遥测数据
4. **Dashboard 和告警** – 创建 dashboard 以获得可见性，创建告警以监控服务的健康状况

## 后续步骤

如需更深入的特定主题指导，请参阅本最佳实践指南中的详细部分：

- [容器 (ECS/EKS)](../containers/aws-native/eks/amazon-cloudwatch-container-insights.md)
- [无服务器](../serverless/aws-native/lambda-based-observability.md)
- [运维指南](../operational/observability-driven-dev.md)
- [成本优化](../cost/cost-visualization/cost.md)
- [信号收集](../signal-collection/emf.md)
