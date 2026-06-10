# 云工程师

作为管理复杂 AWS 基础设施的云工程师，Observability 对于维护可靠和高效的运营至关重要。在当今微服务、容器和无服务器架构的世界中，对系统拥有清晰的可见性对于成功至关重要。

本指南探索了云工程师的关键 Observability 最佳实践，重点关注大规模监控、故障排除和优化 AWS 环境的实用策略。

---

## AWS 成本管理

**目标：** 通过监控和控制支出来优化您的 AWS 成本。

| 级别 | 类别                | 描述                                                        | 提示和示例                                               | 附加说明                    |
|-------|-------------------------|--------------------------------------------------------------------|---------------------------------------------------------------|-------------------------------------|
| **基础** | [跟踪支出](https://aws-observability.github.io/observability-best-practices/guides/cost/cost-visualization/cost)       | 设置 dashboard 来监控业务活动如何影响成本 | **示例：** 监控营销活动对服务器成本的影响 | **专业提示：** 从基本的每日成本跟踪开始  
**常见陷阱：** 未设置告警 |
| **基础** | [预算管理](https://aws-observability.github.io/observability-best-practices/guides/operational/business/key-performance-indicators)         | 建立支出限制以衡量项目成本 | **提示：** 专注于为每个部门或服务设置预算 | **建议：** 建立清晰的预算分配 |
| **中级** | [资源标签](https://aws-observability.github.io/observability-best-practices/recipes/recipes/metrics-explorer-filter-by-tags)         | 实施资源标签以按团队和项目跟踪资源使用情况 | **快速见效：** 从这 3 个标签开始：  
1. Project  
2. Environment  
3. Owner | **您知道吗？** 实施标签后可以节省 20-30% |
| **中级** | [成本和使用可见性](https://aws-observability.github.io/observability-best-practices/guides/cost/cost-visualization/cost)   | 确保您只产生所需的成本，不会在不需要的资源上过度支出 | **示例：** 设置精细的成本 dashboard 以更好地跟踪 | **专业提示：** 考虑 AWS 提供的不同[成本优化工具](https://docs.aws.amazon.com/whitepapers/latest/cost-optimization-laying-the-foundation/reporting-cost-optimization-tools.html)                                 |
| **高级** | [智能成本管理](https://community.aws/content/2muS34cXUidGfdzpd5EkpCcphLc/aws-serverless-how-to-stop-ec2-using-event-bridge-and-lambda)            | 自动化限制不必要支出的任务 | **示例：** 在非工作时间关闭非生产服务器 | **专业提示：** 从非生产环境开始 |
| **高级** | [战略实施](https://aws-observability.github.io/observability-best-practices/guides/operational/business/key-performance-indicators)   | 建立 KPI 并实施 FinOps Foundation 原则 | 创建成本优化 KPI 并持续跟踪 | **专业提示：** 从"单位经济"KPI 开始——衡量每个业务输出的成本（如每笔交易成本、每位客户成本或每项服务成本）。  

**您知道吗？** 请记住：最好的 KPI 是那些将云支出与业务成果直接关联的 KPI，这使得更容易展示投资回报率并获得 FinOps 计划的支持。 |

### 建议：
- **从简单开始**：从基本监控开始，随着您对 AWS 工具越来越熟悉，再扩展到更高级的技术。
- **有效使用标签**：标签是跟踪和分配成本最强大的方式之一。尽早实施可以在将来节省大量时间。

---

## AWS 性能和可用性

**目标：** 确保 AWS 托管应用程序的最佳性能和可用性。

| 级别 | 组件              | 描述                                                        | 提示和示例                                               | 附加说明                    |
|-------|------------------------|--------------------------------------------------------------------|---------------------------------------------------------------|-------------------------------------|
| **基础** | [监控应用](https://aws-observability.github.io/observability-best-practices/tools/dashboards)          | 聚合精选的历史数据并与其他相关数据一起查看 | **示例：** 检查不同区域的用户是否遇到延迟 | **常见陷阱：** 监控工具缺乏集中化 |
| **中级** | [跟踪连接点](https://aws-observability.github.io/observability-best-practices/signals/traces)  | 监控应用程序不同部分之间的通信方式 | **快速见效：** 从跟踪最关键服务的性能开始 | **您知道吗？** 大多数故障是由于服务间通信失败导致的 |
| **高级** | [测试性能](https://aws-observability.github.io/observability-best-practices/tools/synthetics)     | 从客户角度测试和模拟应用程序以了解他们的体验 | **示例：** 对应用程序端点执行合成测试 |   **专业提示：** 从用户会话收集客户端数据以获取精细的[性能洞察](https://aws-observability.github.io/observability-best-practices/tools/rum)                                |
|**高级** | [建立并执行可用性目标](https://aws-observability.github.io/observability-best-practices/tools/slos)     | 评估应用程序的 SLO 以建立可接受的健康状况和可用性 | 用于实时监控和快速故障排除 |   **专业提示：** 定期评估组织的 Observability [成熟度](https://aws-observability.github.io/observability-best-practices/guides/observability-maturity-model) 

### 建议：
- **了解用户体验**：仅监控服务器端指标是不够的。确保在全球范围内跟踪实际用户体验。
- **优先关注关键服务**：从监控最关键的应用程序组件开始，然后从那里扩展监控范围。

---

## AWS 安全监控

**目标：** 通过监控安全漏洞和事件来保护您的 AWS 基础设施。

| 级别 | 组件              | 描述                                                        | 提示和示例                                               | 附加说明                    |
|-------|------------------------|--------------------------------------------------------------------|---------------------------------------------------------------|-------------------------------------|
| **基础** | [集中安全监控](https://aws-observability.github.io/observability-best-practices/patterns/multiaccount) | 将所有安全日志整合到一个集中位置以便于访问和分析 | **示例：** 跟踪对敏感数据和资源的所有访问 | **专业提示：** 从关注登录尝试和访问模式开始 |
| **中级** | [扩展遥测数据收集](https://aws-observability.github.io/observability-best-practices/recipes/telemetry)  | 包含有助于故障排除和审计会话的额外[属性](https://aws-observability.github.io/observability-best-practices/guides/containers/oss/ecs/best-practices-metrics-collection-1) | **实施：** 从应用程序后端代码实施遥测数据 | **示例：** 发送用户登录所用的浏览器名称                                    |
| **高级** | [变更监控](https://aws-observability.github.io/observability-best-practices/recipes/anomaly-detection)          | 跟踪来自内部和外部源的工作负载中的突然变化 | **快速见效：** 设置意外登录模式或用户活动的告警 | **常见陷阱：** 仅依赖静态告警阈值 |

### 建议：
- **优先考虑安全**：安全不应该是事后才考虑的。从基本监控开始，逐步发展到更复杂的配置。
- **自动化告警**：设置异常活动的自动告警有助于在潜在威胁升级之前检测到它们。

---

## 用户体验监控

**目标：** 通过监控应用程序使用情况、速度和行为来优化用户体验。

| 级别 | 组件              | 描述                                                        | 提示和示例                                               | 附加说明                    |
|-------|------------------------|--------------------------------------------------------------------|---------------------------------------------------------------|-------------------------------------|
| **基础** | [跟踪页面速度](https://aws-observability.github.io/observability-best-practices/tools/rum)         | 监控真实用户的页面加载速度 | **示例：** 识别结账页面在高峰时段是否变慢 | **专业提示：** 首先关注最重要的用户旅程 |
| **中级** | [监控受外部因素影响的用户模式](https://aws-observability.github.io/observability-best-practices/tools/internet_monitor)       | 跟踪可能影响用户与服务交互的其他因素  | **示例：** 互联网提供商和位置  
**快速见效：** 从监控基本页面加载时间开始 | **您知道吗？** 页面加载时间的微小延迟可能显著影响用户留存率 |
| **高级** | [深度网络使用分析](https://aws-observability.github.io/observability-best-practices/recipes/infra)       | 深入评估和分析您的网络流量活动和状态 | **示例：** [Network Synthetics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/what-is-network-monitor.html) 和 [Network Flow Monitor](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-NetworkFlowMonitor.html) | 跟踪更深层的网络交互和用户行为 |

### 建议：
- **关注关键操作**：优先监控影响收入或用户满意度的操作。
- **监控真实用户交互**：不要仅依赖合成测试——真实用户数据提供更具可操作性的洞察。

---

## 无服务器工作负载监控

**目标：** 有效监控和优化无服务器应用程序以确保可靠性和成本效率。

| 级别 | 组件 | 描述 | 提示和示例 | 附加说明 |
|-------|-----------|-------------|-----------------|------------------|
| **基础** | [Lambda 函数最佳实践](https://aws-observability.github.io/observability-best-practices/guides/serverless/aws-native/lambda-based-observability) | 监控核心 Lambda 指标和执行统计 | **示例：** 跟踪调用次数、持续时间和错误率  
**快速见效：** 为 Lambda insights 设置 CloudWatch dashboard | **专业提示：** 监控冷启动和内存利用率以优化成本 |
| **中级** | [事件源监控](https://docs.aws.amazon.com/lambda/latest/dg/monitoring-metrics.html) | 跟踪事件源和集成的性能 | **示例：** 监控 SQS 队列深度、API Gateway 延迟  
**快速见效：** 为失败事件设置死信队列 | **您知道吗？** 正确的事件源监控可以防止级联故障 |
| **高级** | [提供汇总洞察](https://docs.aws.amazon.com/xray/latest/devguide/xray-services-lambda.html) | 利用 CloudWatch 的专业洞察工具获取关于工作负载性能、资源利用率和跨无服务器及容器化应用程序运营模式的自动化详细分析。 | **示例：** [Lambda Insights](https://aws-observability.github.io/observability-best-practices/guides/serverless/aws-native/lambda-based-observability#use-cloudwatch-lambda-insights-to-monitor-system-level-metrics)  
[Container Insights](https://aws-observability.github.io/observability-best-practices/patterns/adoteksfargate)| 使用 AWS CloudFormation 在账户级别启用 Lambda Insights 以自动为所有新的 Lambda 函数收集详细指标，同时使用 [Contributor Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContributorInsights.html) 识别消耗最多的资源和潜在瓶颈。 |

### 建议：
- **实施结构化日志**：使用一致的 JSON 日志格式以提高可搜索性
- **监控并发限制**：跟踪函数并发以防止节流
- **成本优化**：设置成本分配标签并监控每个函数的成本

---
