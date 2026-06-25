---
sidebar_position: 4
---
# CloudTrail 数据事件

根据 AWS CloudTrail 最佳实践，您应该在多区域跟踪级别为安全敏感的工作负载记录数据事件。对于具有严格合规要求的工作负载，我们建议您启用数据事件以审计资源级别的活动。记录数据事件提供了在数据级别进行审计的能力，包括您启用可见性的资源内部的更改。

CloudTrail 通过提供额外的可观测性来提供帮助，并支持多种服务的数据事件。这些数据事件可用于帮助您达成关键的合规、风险和安全目标。这类事件的一些示例包括对象级别的 API 活动，如删除、更新和放置项目。CloudTrail 数据事件提供的增强可见性示例包括：Amazon Bedrock 中代理别名或知识库上的 API 活动、Amazon Q Business 中应用程序或数据源上的活动，或 SageMaker 特征存储上的 API 活动。这些提供了关键的风险管理优势，例如：

* 监控对个人数据和敏感信息的访问
* 个人数据和敏感数据修改的可见性
* 审计处理个人数据和敏感信息的应用程序中的活动
* 检测潜在的数据泄露和隐私事件
* 促进隐私审计和合规报告

### 数据事件的高级事件选择器
使用数据事件时，高级事件选择器可以更精细地控制哪些 CloudTrail 事件被摄取到您的事件数据存储中。通过高级事件选择器，您可以包含或排除 EventSource、EventName、userIdentity.arn 和 ResourceARN 等字段上的值。高级事件选择器还支持使用部分字符串的模式匹配来包含或排除值。这提高了安全、合规和运维调查的效率和精确度，同时有助于降低成本。例如，您可以基于 userIdentity.arn 属性筛选 CloudTrail 事件，以排除由特定 IAM 角色或用户生成的事件。您可以排除用于监控目的的服务所使用的专用 IAM 角色，该角色会频繁进行 API 调用。这使您能够显著减少摄取到 CloudTrail Lake 的 CloudTrail 事件量，在保持对相关用户和系统活动可见性的同时降低成本。

![CloudTrail Lake 数据事件](/img/cloudops/guides/cloudtrail-lake/cloudtrail-data-events-advanced-selector.png "数据事件的高级事件选择器")

### **特定工作负载**

以下各节将提供一些使用跟踪和事件数据存储可用资源类型监控和审计特定工作负载的最佳实践。例如，在记录 Amazon S3 的数据事件时，您需要捕获 `PutObject` API 操作以记录对 Amazon S3 对象的所有资源级别操作。这将提供对 Amazon S3 对象资源级别操作的可见性。

### **Amazon SNS 和 Amazon SQS**

根据 Amazon SNS 安全最佳实践和 Amazon SQS 安全最佳实践，建议考虑使用 VPC endpoints 来访问 Amazon SNS 和 Amazon SQS。例如，如果您有必须能够交互但绝对不能暴露到互联网的 Amazon SNS 主题或 Amazon SQS 队列，使用 VPC endpoints 可以控制访问权限，仅允许特定 VPC 内的主机向 Amazon SNS 主题发布或向 Amazon SQS 队列发送消息。

在 CloudTrail 中启用 Amazon SNS 的数据事件后，您将能够审计所有 Amazon SNS 主题的 `Publish` 和 `PublishBatch` API 操作。类似地，对于 [Amazon SQS 的数据事件](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-logging-using-cloudtrail.html#sqs-data-events-in-cloud-trail)，确保 `SendMessage` API 操作将审计 VPC 内的实例是否使用 VPC Endpoints 向 Amazon SQS 队列发送消息，而不是通过互联网传输。

以下查询将显示 Amazon SNS 的 [Publish](https://docs.aws.amazon.com/sns/latest/api/API_Publish.html) 事件的 API 操作，表明消息正在发布到 Amazon SNS 主题。结果还将显示哪个 [IAM](https://aws.amazon.com/iam/) 实体执行了此操作以及消息发送所使用的特定 VPC endpoint ID。但是，如果没有 VPC endpoint ID，则 Publish API 调用是在不使用 VPC Endpoint 的情况下进行的。

#### SQL 查询：

```
SELECT eventTime,
    substr(userIdentity.arn, strpos(userIdentity.arn, '/') +1) as IAM, 
    recipientAccountId, 
    awsRegion, 
    eventName,sourceIPAddress, 
    substr(element_At(requestParameters, 'topicArn'), 
    strpos(element_At(requestParameters, 'topicArn'), '.com/') +18) as Topic, 
    vpcEndpointId
FROM $EDS_ID
    WHERE eventSource = 'sns.amazonaws.com'
    AND eventName = 'Publish'
    AND eventtime >= '2024-06-24 00:00:00'
    AND eventtime <= '2024-06-24 23:59:59'
```

与 Amazon SNS 查询类似，以下查询将显示 Amazon SQS 的 [SendMessage](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/APIReference/API_SendMessage.html) 事件的 API 操作，表明消息正在发送到特定的 Amazon SQS 队列。这些结果还将显示哪个 [IAM](https://aws.amazon.com/iam/) 实体执行了该操作以及消息发送到的特定 VPC endpoint ID。

#### SQL 查询：

```
SELECT eventTime, 
    substr(userIdentity.arn, strpos(userIdentity.arn, '/') +1) as IAM, 
    recipientAccountId, 
    awsRegion, 
    eventName,sourceIPAddress, 
    substr(element_At(requestParameters, 'queueUrl'), 
    strpos(element_At(requestParameters, 'queueUrl'), '.com/') +18) as Queue, 
    vpcEndpointId
FROM $EDS_ID
WHERE eventSource = 'sqs.amazonaws.com'
    AND eventName = 'SendMessage'
    AND eventtime >= '2024-06-24 00:00:00'
    AND eventtime <= '2024-06-24 23:59:59'
```

### Amazon Q for Business

对于 Amazon Q for Business 工作负载，您可以配置 **AWS::QBusiness::Application** 和 **AWS::S3::Object** 的数据事件。**AWS::QBusiness::Application** 记录与 Amazon Q Business 应用程序相关的数据面活动，**AWS::S3::Object** 记录源 Amazon S3 存储桶的数据事件。为您的跟踪或事件数据存储配置数据事件后，将开始为 Amazon Q Business 和 Amazon S3 生成事件。

以下查询将显示对 [BatchDeleteDocument](https://docs.aws.amazon.com/amazonq/latest/api-reference/API_BatchDeleteDocument.html) 的 API 调用，表示在 Amazon Q Business 应用程序中使用的一个或多个文档被删除。

#### SQL 查询：

```
SELECT
    eventName, COUNT(*) AS numberOfCallsFROM
<event-data-store-ID>
WHERE
    eventSource='qbusiness.amazonaws.com' AND eventTime > date_add('day', -1, now())
Group
BY eventName ORDER BY COUNT(*) DESC
```

以下查询将帮助查找与 BatchDeleteDocument API 调用相关联的 IAM 身份。

#### SQL 查询：

```
SELECT
 sourceIPAddress, eventTime, userIdentity.principalid
 FROM
 <event-data-store-ID>
 WHERE
 eventName='BatchDeleteDocument' AND eventTime > date_add('day', -1, now())
```

以下查询显示哪个任务触发了 S3 数据源与 Amazon Q Business 应用程序的同步（通过查找 StartDataSourceSyncJob API 调用）。

#### SQL 查询：

```
SELECT
 sourceIPAddress, eventTime, userIdentity.arn AS user
 FROM
 <event-data-store-ID>
 WHERE
 eventName='StartDataSourceSyncJob' AND eventTime > date_add('day', -1, now())
```

以下查询将显示是否有对象从作为 Q Business 应用程序数据源连接的 S3 存储桶中被删除（通过检查 DeleteObject API 事件）：

#### SQL 查询：

```
SELECT
 sourceIPAddress, eventTime, userIdentity.arn AS user
 FROM
 <event-data-store-ID>
 WHERE
 userIdentity.arn IS NOT NULL AND eventName='DeleteObject'
 AND element_at(requestParameters, 'bucketName') like '<enter-S3-bucket-name>'
 AND eventTime > '[2024-05-09 00](tel:2024050900):00:00'
```

### Amazon Q Developer

使用 Amazon Q Developer 数据事件可以跟踪的事件之一是 **'StartCodeAnalysis'**，它追踪 Amazon Q Developer 为 VS Code 和 JetBrains IDE 执行的安全扫描。

以下查询将检索所有发起安全扫描的用户列表。这将帮助识别组织中哪些用户使用 Amazon Q Developer 来分析代码，并确定其请求的来源。

```
SELECT
userIdentity.onbehalfof.userid, eventTime, SourceIPAddress
FROM
    <event-data-store-ID>
WHERE
    eventName = 'StartCodeAnalysis'
```

### Amazon Bedrock

Amazon Bedrock 的 CloudTrail 数据事件通过 'AWS::Bedrock::AgentAlias' 和 'AWS::Bedrock::KnowledgeBase' 资源类型操作跟踪 Agents for Bedrock 和 Amazon Bedrock 知识库的 API 事件。

例如，如果聊天应用程序的管理员想要审计与 Bedrock 代理调用相关的事件，可以使用以下查询，它将帮助确定随调用的代理别名一起发送的[请求](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_agent-runtime_InvokeAgent.html#API_agent-runtime_InvokeAgent_RequestSyntax)和[响应](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_agent-runtime_InvokeAgent.html#API_agent-runtime_InvokeAgent_ResponseSyntax)参数的详细信息。

```
SELECT
UserIdentity,eventTime,eventName,UserAgent,requestParameters,resourcesFROM
<event-data-store-ID>
WHERE
    eventName = 'InvokeAgent'
```

此外，以下查询将提供调用的知识库的详细信息，以及返回的请求和响应参数：

```
SELECT
UserIdentity,eventTime,eventName,UserAgent,requestParameters,resourcesFROM
<event-data-store-ID>
WHERE
    eventName = 'RetrieveAndGenerate'
```
