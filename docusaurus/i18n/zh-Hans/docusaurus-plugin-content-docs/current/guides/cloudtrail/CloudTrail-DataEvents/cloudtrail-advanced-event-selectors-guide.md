---
sidebar_position: 14
---
# 高级事件选择器

### 理解高级事件选择器

AWS CloudTrail 中的高级事件选择器通过使用基于字段的条件（支持等于、不等于、以...开头和以...结尾等运算符）定义特定的选择条件，提供对记录哪些数据事件的精细控制。这种精细化方法使组织能够仅捕获对其安全、合规和运维需求重要的数据事件，同时降低与过度事件记录相关的成本。

高级事件选择器由字段选择器、运算符和值组成。每个选择器包含一个字段选择器数组来定义选择条件，每个字段选择器指定字段名称（如 eventCategory、eventName 或 resources.type）、运算符（Equals、NotEquals、StartsWith、EndsWith）以及一个或多个要匹配的值。单个高级事件选择器中多个字段选择器之间的关系是逻辑 AND，即所有条件都必须满足才能记录事件。

![CloudTrail 高级事件选择器](/img/cloudops/guides/cloudtrail-lake/cloudtrail-data-events-advanced-selector.png "数据事件的高级事件选择器")

### 支持的字段和运算符

CloudTrail 高级事件选择器支持一组全面的字段，涵盖数据事件 AWS API 调用的各个方面。主要字段包括用于特定 API 操作的 eventName、用于 AWS 资源类型的 resources.type、用于特定资源标识符的 resources.ARN，以及用于区分读写操作的 readOnly。每个字段支持特定的运算符：Equals 和 NotEquals 用于精确匹配，而 StartsWith 和 EndsWith 支持基于模式的选择。理解这些组合对于创建有效的选择策略至关重要。

以下将提供如何使用高级事件选择器选择与 AWS 资源相关的特定数据事件的示例。

### Amazon S3

#### 关键写入操作选择器

此选择器专注于可能表明数据外泄、未授权修改或合规违规的高风险 S3 操作。通过仅记录敏感存储桶上的写入操作，组织可以检测恶意活动，同时减少 S3 事件的日志量。这种方法对于在不让安全团队被常规读取操作淹没的情况下保持安全可见性至关重要。

```json
[
  {
    "FieldSelectors": [
      {
        "Field": "eventCategory",
        "Equals": ["Data"]
      },
      {
        "Field": "resources.type",
        "Equals": ["AWS::S3::Object"]
      },
      {
        "Field": "eventName",
        "Equals": ["DeleteObject", "PutObject", "RestoreObject"]
      },
      {
        "Field": "resources.ARN",
        "StartsWith": ["arn:aws:s3:::sensitive-bucket/", "arn:aws:s3:::compliance-bucket/"]
      }
    ]
  }
]
```

### AWS Lambda 函数监控

#### 生产函数调用选择器

Lambda 调用监控对于检测未授权的函数执行和异常访问模式至关重要。此选择器定位以生产和关键函数命名模式开头的 Lambda 函数，同时排除开发命名模式的环境，减少噪音并专注于业务关键活动。基于模式的 ARN 选择自动覆盖遵循命名约定的新函数，提供可扩展的安全监控。

```json
[
  {
    "FieldSelectors": [
      {
        "Field": "eventCategory",
        "Equals": ["Data"]
      },
      {
        "Field": "resources.type",
        "Equals": ["AWS::Lambda::Function"]
      },
      {
        "Field": "eventName",
        "Equals": ["Invoke"]
      },
      {
        "Field": "resources.ARN",
        "StartsWith": ["arn:aws:lambda:us-east-1:123456789012:function:prod-", "arn:aws:lambda:us-east-1:123456789012:function:critical-"]
      }
    ]
  }
]
```

### DynamoDB 表操作

#### 写入操作和敏感表选择器

DynamoDB 会生成大量事件，因此选择性事件选择对于成本控制和安全聚焦至关重要。这些选择器捕获可能表明未授权访问或数据篡改的数据修改事件，同时排除常规读取操作。以下示例中的组合方法允许记录特定表的特定写入操作以及所定义的敏感表的所有操作，在不产生过多成本的情况下提供全面覆盖。

```json
[
  {
    "FieldSelectors": [
      {
        "Field": "eventCategory",
        "Equals": ["Data"]
      },
      {
        "Field": "resources.type",
        "Equals": ["AWS::DynamoDB::Table"]
      },
      {
        "Field": "eventName",
        "Equals": ["PutItem", "UpdateItem", "DeleteItem", "BatchWriteItem"]
      },
      {
        "Field": "resources.ARN",
        "Equals": ["arn:aws:dynamodb:us-east-1:123456789012:table/UserData"]
      }
    ]
  },
  {
    "FieldSelectors": [
      {
        "Field": "eventCategory",
        "Equals": ["Data"]
      },
      {
        "Field": "resources.type",
        "Equals": ["AWS::DynamoDB::Table"]
      },
      {
        "Field": "resources.ARN",
        "StartsWith": ["arn:aws:dynamodb:us-east-1:123456789012:table/Financial"]
      }
    ]
  }
]
```

### Amazon SQS 队列监控

#### 管理操作选择器

SQS 管理操作可能代表一定的安全风险，因为它们可以中断消息流并修改队列权限。此选择器示例专注于可能表明权限提升或服务中断企图的队列管理活动。通过排除高流量消息操作，此方法在保持对安全相关管理更改的可见性的同时降低了日志记录成本。

```json
[
  {
    "FieldSelectors": [
      {
        "Field": "eventCategory",
        "Equals": ["Data"]
      },
      {
        "Field": "resources.type",
        "Equals": ["AWS::SQS::Queue"]
      },
      {
        "Field": "eventName",
        "Equals": ["CreateQueue", "DeleteQueue", "SetQueueAttributes", "AddPermission", "RemovePermission"]
      }
    ]
  }
]
```

### Amazon SNS 主题操作

#### 主题管理和关键主题选择器

SNS 监控需要在管理监督与关键主题的消息流可见性之间取得平衡。这些选择器捕获可能影响通知交付的主题管理操作，并监控安全敏感主题上的所有活动。多选择器方法允许全面监控关键通信渠道，同时通过选择性主题选择减少整体日志量。

```json
[
  {
    "FieldSelectors": [
      {
        "Field": "eventCategory",
        "Equals": ["Data"]
      },
      {
        "Field": "resources.type",
        "Equals": ["AWS::SNS::Topic"]
      },
      {
        "Field": "eventName",
        "Equals": ["CreateTopic", "DeleteTopic", "Subscribe", "Unsubscribe", "SetTopicAttributes"]
      }
    ]
  },
  {
    "FieldSelectors": [
      {
        "Field": "eventCategory",
        "Equals": ["Data"]
      },
      {
        "Field": "resources.type",
        "Equals": ["AWS::SNS::Topic"]
      },
      {
        "Field": "resources.ARN",
        "Equals": ["arn:aws:sns:us-east-1:123456789012:security-alerts"]
      }
    ]
  },
  {
    "FieldSelectors": [
      {
        "Field": "eventCategory",
        "Equals": ["Data"]
      },
      {
        "Field": "resources.type",
        "Equals": ["AWS::SNS::Topic"]
      },
      {
        "Field": "resources.ARN",
        "StartsWith": ["arn:aws:sns:us-east-1:123456789012:compliance-"]
      }
    ]
  }
]
```

### 基于用户身份的选择器

#### 特权用户监控选择器

用户身份选择允许您包含或排除由特定 IAM 身份执行的操作事件。以下示例演示了两种方法：从 S3 对象日志记录中排除特定服务角色以减少自动化流程产生的噪音，以及仅记录 DynamoDB 表操作的特权角色以专注于高风险活动。

```json
[
  {
    "FieldSelectors": [
      {
        "Field": "eventCategory",
        "Equals": ["Data"]
      },
      {
        "Field": "resources.type",
        "Equals": ["AWS::S3::Object"]
      },
      {
        "Field": "userIdentity.arn",
        "NotStartsWith": ["arn:aws:sts::123456789012:assumed-role/service-role/backup-automation-role", "arn:aws:sts::123456789012:assumed-role/service-role/monitoring-role"]
      }
    ]
  },
  {
    "FieldSelectors": [
      {
        "Field": "eventCategory",
        "Equals": ["Data"]
      },
      {
        "Field": "resources.type",
        "Equals": ["AWS::DynamoDB::Table"]
      },
      {
        "Field": "userIdentity.arn",
        "StartsWith": ["arn:aws:sts::123456789012:assumed-role/AdminRole/", "arn:aws:sts::123456789012:assumed-role/SecurityRole/"]
      }
    ]
  }
]
```

### 组织跟踪和事件数据存储 (EDS) 选择器

#### 账户级排除选择器

对于组织跟踪或事件数据存储 (EDS) 配置，您可以从 S3 数据事件日志记录中排除整个账户以降低成本并专注于关键账户。此选择器通过使用 userIdentity.arn 字段匹配来自该账户的任何身份，排除特定账户的所有 S3 数据事件。此方法特别适用于从全面日志记录中排除开发或测试账户，同时保持对生产账户的覆盖。


```json
[
  {
    "FieldSelectors": [
      {
        "Field": "eventCategory",
        "Equals": ["Data"]
      },
      {
        "Field": "resources.type",
        "Equals": ["AWS::S3::Object"]
      },
      {
        "Field": "userIdentity.arn",
        "NotStartsWith": ["arn:aws:sts::111122223333:", "arn:aws:iam::111122223333:"]
      }
    ]
  }
]
```

:::info
请注意，userIdentity ARN 类型可能超出上面显示的 STS 和 IAM 示例范围。建议验证组织内当前使用的所有 userIdentity ARN 类型。
:::

#### 多 S3 存储桶排除选择器

管理组织范围的日志记录时，您可能需要排除生成大量低价值事件的多个 S3 存储桶，例如备份存储桶、临时存储或自动化处理存储桶。此选择器演示了如何排除多个特定存储桶，同时保持对所有其他 S3 资源的日志记录。该方法使用多个 NotStartsWith 条件来高效排除不同的存储桶 ARN 模式。

```json
[
  {
    "FieldSelectors": [
      {
        "Field": "eventCategory",
        "Equals": ["Data"]
      },
      {
        "Field": "resources.type",
        "Equals": ["AWS::S3::Object"]
      },
      {
        "Field": "resources.ARN",
        "NotStartsWith": [
          "arn:aws:s3:::backup-bucket-",
          "arn:aws:s3:::temp-processing-",
          "arn:aws:s3:::automated-logs-",
          "arn:aws:s3:::dev-sandbox-"
        ]
      }
    ]
  }
]
```

### 其他支持的字段示例

#### 写入操作选择器

readOnly 字段选择器对于专注于代表环境实际更改的事件至关重要。通过仅选择写入操作，组织可以在保持对可能影响安全或合规的所有操作的可见性的同时减少日志量。此选择器与特定资源类型或事件源结合使用时特别有效。

#### 特定服务事件源选择器

事件源选择允许对特定 AWS 服务进行有针对性的监控，而无需资源类型选择的复杂性。此方法非常适合某些服务需要全面日志记录的合规场景，无论涉及的具体资源如何。该选择器在确保指定服务完全覆盖的同时显著减少跨服务噪音。

#### 特定 API 操作监控

事件名称选择提供对 CloudTrail 日志记录最精细的控制，允许组织监控跨所有服务的特定 API 操作。此方法对于检测特定攻击模式、监控关键操作或满足精确合规要求非常有价值。该选择器在提供对高风险操作的精准可见性的同时大幅减少日志量。

#### 资源类型组合选择

将资源类型选择与操作类型选择相结合可创建强大的有针对性的监控能力。以下示例演示了三种不同的方法：记录 S3 对象的写入操作、捕获特定 DynamoDB 写入操作，以及记录 S3 存储桶的写入操作。这种组合允许组织记录特定类型资源的特定类型操作，在最小化不必要日志记录的同时提供精确的安全覆盖。

```json
[
  {
    "FieldSelectors": [
      {
        "Field": "eventCategory",
        "Equals": ["Data"]
      },
      {
        "Field": "resources.type",
        "Equals": ["AWS::S3::Object"]
      },
      {
        "Field": "readOnly",
        "Equals": ["false"]
      }
    ]
  },
  {
    "FieldSelectors": [
      {
        "Field": "eventCategory",
        "Equals": ["Data"]
      },
      {
        "Field": "resources.type",
        "Equals": ["AWS::DynamoDB::Table"]
      },
      {
        "Field": "eventName",
        "Equals": ["PutItem", "UpdateItem", "DeleteItem"]
      }
    ]
  },
  {
    "FieldSelectors": [
      {
        "Field": "eventCategory",
        "Equals": ["Data"]
      },
      {
        "Field": "resources.type",
        "Equals": ["AWS::S3::Bucket"]
      },
      {
        "Field": "readOnly",
        "Equals": ["false"]
      }
    ]
  }
]
```

## 成本优化策略

### 事件量分析和缩减

有效的成本优化从了解您当前的事件量并识别在不影响安全或合规要求的情况下减少事件量的机会开始。分析您的 CloudTrail 日志以识别高流量事件，并确定哪些事件可以安全排除。此分析可以帮助您确定高级事件选择器策略。

### 策略性选择方法

实施分层选择方法，优先考虑安全和合规事件，同时逐步排除常规运维活动。从安全相关事件的广泛包含条件开始，然后为已知的常规操作添加特定排除。例如，包含所有写入操作但排除生成可预测、低风险事件的特定自动化流程。使用 StartsWith 和 EndsWith 运算符创建基于模式的选择器，可以高效排除整类常规事件，同时保持对意外或潜在恶意活动的覆盖。

### 基于资源的成本管理

围绕资源的关键性和敏感级别组织您的选择策略。对生产资源、敏感数据存储和安全关键服务实施全面日志记录，同时对开发和测试环境应用更积极的选择条件。使用资源 ARN 模式根据命名约定自动应用适当的日志记录级别。此方法确保成本优化工作不会损害对最重要资产的安全监控，同时减少对不太关键资源的不必要日志记录开销。

## 安全和合规考虑事项

### 保持安全可见性

在通过高级事件选择器优化成本的同时，保持全面的安全可见性仍然至关重要。确保您的选择策略捕获所有可能表明安全事件的事件。定期审查和测试您的事件选择器可确保安全监控能力在环境演变时保持有效。

### 合规要求集成

不同的合规框架对审计日志记录有特定要求，在设计高级事件选择器时必须考虑这些要求。将合规要求映射到特定的 CloudTrail 事件，并确保您的高级事件选择器捕获所有必要的活动。记录您的选择决策，并维护证据证明您的日志记录策略满足监管要求。

### 事故响应准备

在设计高级事件选择器时考虑事故响应需求，确保捕获足够的详细信息以支持取证分析和威胁狩猎活动。包含围绕安全事件提供上下文的事件，如身份验证事件、网络访问模式和资源配置更改。考虑事故响应的时间线要求，确保您的日志记录策略为调查提供充足的历史数据。针对已知的事件场景测试您的事件选择器，以验证它们捕获了有效响应所需的信息。

## 实施最佳实践

### 分阶段部署策略

使用分阶段方法实施高级事件选择器，允许在全面部署之前进行测试和优化。从非生产环境中的试点实施开始，验证您的选择逻辑并衡量对事件量和成本的影响。在监控选择策略有效性的同时逐步扩展实施。此方法允许您在问题影响生产日志记录能力之前识别和解决问题，并提供基于实际使用模式优化选择器的机会。

### 监控和验证

为您的 CloudTrail 高级事件选择器建立全面的监控，以确保它们持续满足您的安全和合规要求。实施自动化验证检查，确认您的事件选择器正在捕获预期事件，且未无意中排除关键活动。定期审查选择有效性有助于保持成本优化和安全可见性之间的平衡。

## 高级选择技术

### 基于模式的资源选择

利用 StartsWith 和 EndsWith 运算符创建复杂的基于模式的选择器，可以高效管理大量资源。例如，在资源 ARN 中使用命名约定，根据环境、敏感性或业务单元自动应用适当的日志记录级别。基于模式的选择对于具有一致命名标准的组织特别有效，可以显著降低在大型 AWS 环境中管理事件选择器的复杂性。此方法还为遵循已建立命名模式的新资源提供自动覆盖。

### 多条件逻辑实现

高级事件选择器支持复杂的逻辑条件，可用于创建精密的选择规则。在单个高级事件选择器中组合多个字段选择器以创建 AND 条件，或使用多个高级事件选择器创建 OR 条件。例如，您可以创建一个选择器来捕获敏感资源上的所有写入操作或特权用户执行的任何操作。理解如何有效组合条件使您能够创建精确的选择规则，准确捕获您需要的事件，同时排除其他所有内容。
