# 为什么 X-Ray 客户应该采用 Application Signals 和 Transaction Search

## 可观测性需求的演进

随着应用程序的复杂性和规模不断增长，客户的可观测性需求也发生了显著变化。虽然 [AWS X-Ray](https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html) 一直是可靠的分布式 tracing 解决方案，但现代应用场景需要更全面的可见性。

## 技术架构差异

**X-Ray 传统方案：**

![X-Ray 架构](/apm-src/assets/images/deep-dive/X-ray.png)

**Application Signals 和 Transaction Search：**

![Application Signals 和 Transaction Search 架构](/apm-src/assets/images/deep-dive/ap%20ts.png)

## 迁移的主要优势

| 能力 | X-Ray | Application Signals 和 Transaction Search |
|---|---|---|
| **数据接入** | 100% 事务（配置后） | 100% 事务（配置后） |
| **吞吐量限制** | 高流量时受 X-Ray 服务配额限制 | 使用 CloudWatch Logs 具有更高吞吐容量 |
| **成本模型** | 按 trace 定价（100% 时昂贵） | Application Signals 捆绑定价 |
| **存储格式** | X-Ray 专有格式 | OpenTelemetry 标准格式 |
| **存储后端** | X-Ray 优化存储 | CloudWatch Logs 带选择性索引 |
| **分析** | 仅 X-Ray 控制台 | Transaction Search + X-Ray trace 分析 |
| **查询能力** | X-Ray 控制台和 API | Transaction Search 可视化分析 + X-Ray |
| **索引** | 所有 traces 均被索引 | 选择性索引（可配置百分比） |
| **业务上下文** | 有限的自定义属性 | 丰富的 OTEL span 属性 + 业务上下文 |

## 核心价值主张

### 1. 更高吞吐量和可扩展性
- **CloudWatch Logs 比 X-Ray 处理更高的吞吐量**，使客户能够跟踪所有应用事件而不会达到服务限制
- **Logs 作为 trace 数据存储** 消除了高流量应用中 X-Ray 的吞吐量限制
- **可扩展的基础设施** 专为大规模日志接入量设计

### 2. 增强的分析和集成能力
- **原生 CloudWatch Logs 功能** 可用于 span 数据分析：
  - **Metrics Filters**：从 span 属性和模式创建自定义 metrics
  - **Subscription Filters**：将 span 数据流式传输到其他 AWS 服务（Lambda、Kinesis 等）
  - **Log Insights**：超越传统 trace 分析的高级查询能力
- **Transaction Search 提供高级可视化查询界面** 用于 span 级别分析
- **OTEL 格式支持** 在 spans 中使用自定义属性提供更丰富的业务上下文

### 3. 经济高效的 100% 采样
- **捆绑定价** 使完全可见性相比按 trace 定价的 X-Ray 更具成本效益。请参阅 [CloudWatch 定价页面](https://aws.amazon.com/cloudwatch/pricing/) 中的 **示例 13**
- **可预测的成本** 基于数据量而非 trace 数量
- **选择性索引** 在保持完整数据访问的同时优化存储成本

## 利用 CloudWatch Logs 功能处理 Span 数据

由于 Transaction Search 将 span 数据存储在 CloudWatch Logs（`aws/spans` 日志组）中，您可以利用所有原生 CloudWatch Logs 功能：

**Metrics Filters：**
```bash
# Create custom metrics from span attributes
aws logs put-metric-filter \
  --log-group-name "aws/spans" \
  --filter-name "HighLatencyRequests" \
  --filter-pattern '[timestamp, request_id, span_id, trace_id, duration > 5000]' \
  --metric-transformations \
    metricName=HighLatencySpans,metricNamespace=CustomApp/Performance,metricValue=1
```

**Subscription Filters：**
```bash
# Stream span data to Lambda for real-time processing
aws logs put-subscription-filter \
  --log-group-name "aws/spans" \
  --filter-name "ErrorSpanProcessor" \
  --filter-pattern '[..., status_code="ERROR"]' \
  --destination-arn "arn:aws:lambda:region:account:function:ProcessErrorSpans"
```

**Log Insights 查询：**
```sql
-- Find all spans with specific business attributes
fields @timestamp, attributes.customer_id, attributes.order_value, duration
| filter attributes.service_name = "payment-service"
| filter attributes.customer_tier = "premium"
| stats avg(duration) by attributes.customer_id
| sort avg(duration) desc
```

**集成机会：**
- **实时告警**：使用 subscription filters 触发 Lambda 函数进行即时事件响应
- **商业智能**：通过 Kinesis Data Streams 将 span 数据导出到分析平台
- **自定义 Dashboard**：使用从 span 属性派生的 metrics 创建 CloudWatch dashboard
- **合规审计**：使用 Log Insights 查询 spans 进行合规报告
