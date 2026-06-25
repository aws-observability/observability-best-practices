# 使用 CloudWatch Logs Transformation 丰富 CloudTrail 日志

## 简介

[AWS CloudTrail](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html) 提供 AWS API 活动的全面审计覆盖，为组织创建完整的安全和合规基础。当将这些 logs 传送到 [Amazon CloudWatch Logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html) 时，[CloudWatch Logs Transformation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch-Logs-Transformation.html) 使组织能够在不使用自定义 Lambda 函数、外部 ETL 管道或后处理脚本的情况下丰富和优化 CloudTrail 数据。

使用声明式 JSON 处理器配置，您可以在 CloudTrail 事件流入 CloudWatch Logs 时解析嵌套字段、添加安全上下文、分类资源并优化数据以供下游传送。本指南演示了用于安全监控、合规报告和运维效率的实际转换模式，同时维护 AWS 原生 log 管理的简单性和可靠性。

## 为什么这很重要

[将 CloudTrail logs 传送到 CloudWatch Logs](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/send-cloudtrail-events-to-cloudwatch-logs.html) 的组织通常需要增强此数据以匹配特定的运维工作流和工具要求：

- **安全团队** 希望添加自定义风险指标和分类标签以加速威胁检测工作流
- **合规团队** 需要按监管框架（PCI-DSS、HIPAA、SOC2）预分类事件以简化审计响应
- **运维团队** 管理多账户环境，希望向 CloudTrail 的技术事件数据添加业务上下文，如环境标签、成本中心或团队所有权
- **所有团队** 将数据转发到下游系统（SIEM、OpenSearch、S3）时希望优化数据结构——为工具兼容性扁平化嵌套字段或专注于安全相关字段以减少下游摄取成本

如果没有原生转换能力，团队只能构建自定义 Lambda 函数、维护外部 ETL 管道或进行后处理——为其 log 管理基础设施增加复杂性、延迟和运维开销。

## CloudWatch Logs 和 Transformation 的工作原理

### CloudWatch Logs

[Amazon CloudWatch Logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html) 作为 CloudTrail 的审计 log 目标。当 CloudTrail 将 logs 传送到 CloudWatch Logs 时，每个 API 事件成为组织在 [log 组和流](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/Working-with-log-groups-and-streams.html) 中的 log 事件，使组织能够：

- 使用 [CloudWatch Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html) 查询最近的 API 活动
- 使用 [metric 过滤器和 alarm](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/MonitoringLogData.html) 创建安全告警
- 使用[订阅过滤器](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/SubscriptionFilters.html)将 logs 转发到下游系统

### CloudWatch Logs Transformation

[CloudWatch Logs Transformation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch-Logs-Transformation.html) 使用声明式[处理器](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch-Logs-Transformation-Processors.html)在摄取期间修改 log 数据。转换定义为 JSON 配置，指定如下操作：

- [parseJSON](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch-Logs-Transformation-Processors.html#CloudWatch-Logs-Transformation-parseJSON)：解析 JSON 结构并提取嵌套字段
- [copyValue](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch-Logs-Transformation-Processors.html#CloudWatch-Logs-Transformation-copyValue)：将值复制到新字段以进行丰富
- [substituteString](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch-Logs-Transformation-Processors.html#CloudWatch-Logs-Transformation-substituteString)：执行基于模式的字符串替换
- [deleteKeys](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch-Logs-Transformation-Processors.html#CloudWatch-Logs-Transformation-deleteKeys)：删除不必要的字段

应用到 log 组后，转换在存储之前自动对每个传入的 log 事件执行。原始版本和转换版本都保留在 CloudWatch Logs 中，[订阅过滤器](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/SubscriptionFilters.html)将转换后的数据转发到下游系统，CloudWatch Logs Insights 查询显示转换后的版本进行分析。请注意，[GetLogEvents](https://docs.aws.amazon.com/AmazonCloudWatchLogs/latest/APIReference/API_GetLogEvents.html) 和 [FilterLogEvents](https://docs.aws.amazon.com/AmazonCloudWatchLogs/latest/APIReference/API_FilterLogEvents.html) API 返回原始 log 版本，而非转换后的版本。

## 解决方案

CloudWatch Logs Transformation 通过提供原生的实时丰富功能来解决这些挑战，消除自定义基础设施同时提供即时的运维价值。以下部分提供了组织如何跨四个关键领域利用转换的示例：

### 安全监控

组织可以通过向 CloudTrail 全面的事件数据添加丰富字段来简化威胁检测：

- **即时威胁检测**：添加 `is_root_user` 标志以进行即时过滤（参见[用例 #4：Root 用户活动检测](#4-root-用户活动检测)）
- **资源敏感性标记**：根据命名模式自动分类 S3 存储桶（参见[用例 #1：S3 数据分类](#1-s3-数据分类用于敏感资源识别)）
- **简化告警**：使用丰富字段上的 [metric 过滤器](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/MonitoringLogData.html)创建 [CloudWatch alarm](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html)，无需复杂的 JSON 解析
- **SIEM 就绪数据**：为与安全工具的无缝集成扁平化嵌套字段（参见[用例 #2：扁平化嵌套字段](#2-为-siem-集成扁平化嵌套字段)）

### 优化数据传送

- **精简下游传送**：在通过订阅过滤器发送到 S3、OpenSearch 或第三方 SIEM 之前删除冗长字段（参见[用例 #3：通过字段精简优化下游传送](#3-通过字段精简优化下游传送)）
- **选择性字段保留**：仅保留安全关键数据，丢弃运维噪音
- **改善查询性能**：更小、更扁平的 log 结构意味着更快的 CloudWatch Logs Insights 查询
- **降低下游成本**：仅向外部系统发送相关数据，降低其摄取和存储成本

:::info
**注意**：原始和转换后的 logs 都存储在 CloudWatch Logs 中。主要好处是优化通过订阅过滤器发送到下游系统的数据，而非减少 [CloudWatch Logs 存储成本](https://aws.amazon.com/cloudwatch/pricing/)。
:::

### 运维效率

- **环境标记**：根据账户 ID 自动将事件标记为 `production`、`staging` 或 `development`（参见[用例 #5：多账户环境标记](#5-多账户环境标记)）
- **标准化字段名称**：扁平化嵌套字段以实现跨所有账户的一致查询（参见[用例 #2：扁平化嵌套字段](#2-为-siem-集成扁平化嵌套字段)）
- **业务上下文**：在摄取时添加合规框架标签（参见[用例 #6：合规框架标记](#6-合规框架标记)）
- **简化跨账户分析**：在 CloudWatch Logs Insights 中使用一致的字段名称查询所有账户

### 合规和审计就绪

- **合规框架标记**：自动标记 PCI-DSS、HIPAA 或 SOC2 相关事件（参见[用例 #6：合规框架标记](#6-合规框架标记)）
- **Root 用户监控**：为合规审计标记 root 用户活动（参见[用例 #4：Root 用户活动检测](#4-root-用户活动检测)）
- **保留优化**：为不同的保留策略将关键审计数据与运维 logs 分离
- **更快的审计响应**：预分类的 logs 在合规审查期间实现即时过滤

## 常见用例和解决方案

以下示例演示了 [CloudTrail logs](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-event-reference-record-contents.html) 的实际转换模式。每个用例包含具体挑战、解决该挑战的处理器配置以及由此带来的好处。

### 1. S3 数据分类用于敏感资源识别

**挑战**：安全团队难以快速识别哪些 CloudTrail 事件涉及敏感或生产 S3 存储桶。

**解决方案**：根据存储桶命名模式自动分类 S3 资源。

```json
[
  {
    "parseJSON": {
      "source": "@message"
    }
  },
  {
    "copyValue": {
      "entries": [
        {
          "source": "resources.0.ARN",
          "target": "data_classification"
        }
      ]
    }
  },
  {
    "substituteString": {
      "entries": [
        {
          "source": "data_classification",
          "from": ".*-prod-.*",
          "to": "sensitive"
        },
        {
          "source": "data_classification",
          "from": "^arn:aws:s3:::.*",
          "to": "normal"
        }
      ]
    }
  }
]
```

**好处**：安全分析师可以通过 `data_classification` 字段过滤以即时识别敏感资源访问。

### 2. 为 SIEM 集成扁平化嵌套字段

**挑战**：SIEM 工具需要扁平的字段结构。

**解决方案**：提取并扁平化常用查询的嵌套字段。

```json
[
  {
    "parseJSON": {
      "source": "@message"
    }
  },
  {
    "copyValue": {
      "entries": [
        {
          "source": "userIdentity.type",
          "target": "user_type",
          "overwriteIfExists": true
        },
        {
          "source": "sourceIPAddress",
          "target": "source_ip",
          "overwriteIfExists": true
        },
        {
          "source": "awsRegion",
          "target": "region",
          "overwriteIfExists": true
        }
      ]
    }
  }
]
```

### 3. 通过字段精简优化下游传送

**挑战**：CloudTrail 数据事件生成大量数据。

**解决方案**：在通过订阅过滤器转发之前删除字段。

```json
[
  {
    "parseJSON": {
      "source": "@message"
    }
  },
  {
    "deleteKeys": {
      "withKeys": [
        "responseElements",
        "requestParameters"
      ]
    }
  }
]
```

:::info
**重要**：原始和转换后的 logs 都存储在 CloudWatch Logs 中。订阅过滤器转发转换后的版本，可在下游系统中节省成本。
:::

### 4. Root 用户活动检测

**挑战**：识别 root 用户活动需要解析 `userIdentity.type` 字段。

**解决方案**：为 root 用户检测添加显式布尔标志。

```json
[
  {
    "parseJSON": {
      "source": "@message"
    }
  },
  {
    "copyValue": {
      "entries": [
        {
          "source": "userIdentity.type",
          "target": "is_root_user",
          "overwriteIfExists": true
        }
      ]
    }
  },
  {
    "substituteString": {
      "entries": [
        {
          "source": "is_root_user",
          "from": "Root",
          "to": "true"
        },
        {
          "source": "is_root_user",
          "from": "(IAMUser|AssumedRole|FederatedUser|AWSAccount|AWSService)",
          "to": "false"
        }
      ]
    }
  }
]
```

### 5. 多账户环境标记

**挑战**：拥有多个 AWS 账户的组织需要快速识别每个 CloudTrail 事件来自哪个环境。

**解决方案**：将账户 ID 映射到环境标签。

```json
[
  {
    "parseJSON": {
      "source": "@message"
    }
  },
  {
    "copyValue": {
      "entries": [
        {
          "source": "recipientAccountId",
          "target": "environment",
          "overwriteIfExists": true
        }
      ]
    }
  },
  {
    "substituteString": {
      "entries": [
        {
          "source": "environment",
          "from": "111122223333",
          "to": "production"
        }
      ]
    }
  },
  {
    "substituteString": {
      "entries": [
        {
          "source": "environment",
          "from": "444455556666",
          "to": "staging"
        }
      ]
    }
  },
  {
    "substituteString": {
      "entries": [
        {
          "source": "environment",
          "from": "[0-9]{12}",
          "to": "development"
        }
      ]
    }
  }
]
```

### 6. 合规框架标记

**挑战**：合规团队需要在审计期间快速过滤与特定监管框架相关的 CloudTrail 事件。

**解决方案**：根据合规相关模式自动标记事件。

:::info
**注意**：以下是如何添加与合规框架相关标签的示例。下面示例中显示的 eventName 映射与任何特定框架无关。
:::

```json
[
  {
    "parseJSON": {
      "source": "@message"
    }
  },
  {
    "copyValue": {
      "entries": [
        {
          "source": "eventName",
          "target": "compliance_framework",
          "overwriteIfExists": true
        }
      ]
    }
  },
  {
    "substituteString": {
      "entries": [
        {
          "source": "compliance_framework",
          "from": ".*(CreateKey|DeleteKey|DisableKey|ScheduleKeyDeletion|PutKeyPolicy).*",
          "to": "PCI-DSS,HIPAA"
        }
      ]
    }
  },
  {
    "substituteString": {
      "entries": [
        {
          "source": "compliance_framework",
          "from": ".*(CreateAccessKey|DeleteAccessKey|UpdateAccessKey|CreateUser|DeleteUser).*",
          "to": "SOC2,PCI-DSS"
        }
      ]
    }
  },
  {
    "substituteString": {
      "entries": [
        {
          "source": "compliance_framework",
          "from": ".*(PutBucketEncryption|DeleteBucketEncryption|PutBucketPolicy|DeleteBucketPolicy).*",
          "to": "HIPAA,PCI-DSS"
        }
      ]
    }
  }
]
```

## 最佳实践

### 设计原则

1. **从简单开始**：从基本转换开始，按需添加复杂性
2. **彻底测试**：在生产部署前使用示例 CloudTrail 事件验证转换
3. **记录模式**：维护正则表达式模式及其预期匹配的文档
4. **版本控制**：在源代码控制中跟踪转换配置以进行变更管理

### 安全考虑

1. **避免 PII 暴露**：不要在没有适当数据处理控制的情况下将 PII 添加到自定义字段
2. **验证模式**：确保正则表达式模式不会无意中暴露敏感数据
3. **审计转换**：定期审查转换逻辑的安全影响
4. **保留审计完整性**：确保转换不会删除合规或取证分析所需的字段

## 实施步骤

1. **识别需求**：确定哪些 [CloudTrail 字段](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-event-reference-record-contents.html)需要丰富或修改
2. **设计转换逻辑**：规划处理器链和预期结果
3. **创建测试事件**：生成示例 CloudTrail 事件进行验证
4. **配置转换**：[将处理器配置应用](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch-Logs-Transformation.html#CloudWatch-Logs-Transformation-Permissions)到您的 log 组
5. **验证结果**：使用 [CloudWatch Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html) 查询转换后的 logs 以验证正确处理
6. **监控和迭代**：根据运维反馈持续改进转换

## 结论

CloudWatch Logs Transformation 使组织能够通过在摄取时丰富事件的安全上下文、扁平化复杂 JSON 结构和优化下游传送来最大化传送到 CloudWatch Logs 的 CloudTrail 数据的价值——全部通过 AWS 原生能力实现。安全和运维团队可以将其 CloudTrail 事件转化为可操作的情报，而无需自定义处理基础设施的运维开销。
