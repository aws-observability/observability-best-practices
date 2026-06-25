# CloudWatch Logs Insights 示例查询

[CloudWatch Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html) 提供了一个强大的平台，用于分析和查询 CloudWatch 日志数据。它允许您使用类似 SQL 的查询语言交互式地搜索日志数据，该语言具有几个简单但强大的命令。

CloudWatch Logs Insights 为以下类别提供了开箱即用的示例查询：

- Lambda
- VPC Flow Logs
- CloudTrail
- 常见查询
- Route 53
- AWS AppSync
- NAT Gateway

在最佳实践指南的本节中，我们提供了一些当前未包含在开箱即用示例中的其他类型日志的示例查询。此列表将随时间演变和变化，您可以通过在 GitHub 上提交 [issue](https://github.com/aws-observability/aws-observability/issues) 来提交您自己的示例供审查。

## API Gateway

### 最近 20 条包含 HTTP 方法类型的消息

```
filter @message like /$METHOD/ 
| fields @timestamp, @message
| sort @timestamp desc
| limit 20
```

此查询将返回包含特定 HTTP 方法的最近 20 条日志消息，按时间戳降序排列。将 **METHOD** 替换为您要查询的方法。以下是使用此查询的示例：

```
filter @message like /POST/ 
| fields @timestamp, @message
| sort @timestamp desc
| limit 20
```

:::tip
    您可以更改 $limit 值以返回不同数量的消息。
:::

### 按 IP 排序的前 20 个高流量来源

```
fields @timestamp, @message
| stats count() by ip
| sort ip asc
| limit 20
```

此查询将返回按 IP 排序的前 20 个高流量来源。这对于检测针对 API 的恶意活动很有用。

作为下一步，您可以添加额外的方法类型过滤器。例如，此查询将按 IP 显示高流量来源，但仅限于"PUT"方法调用：

```
fields @timestamp, @message
| filter @message like /PUT/
| stats count() by ip
| sort ip asc
| limit 20
```

## CloudTrail Logs

### 按错误类别分组的 API 限流错误

```
stats count(errorCode) as eventCount by eventSource, eventName, awsRegion, userAgent, errorCode
| filter errorCode = 'ThrottlingException' 
| sort eventCount desc
```

此查询允许您查看按类别分组并按降序显示的 API 限流错误。

:::tip
    要使用此查询，您首先需要确保[将 CloudTrail 日志发送到 CloudWatch](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/send-cloudtrail-events-to-cloudwatch-logs.html)。
:::
    
### 折线图中的 Root 账户活动

```
fields @timestamp, @message, userIdentity.type 
| filter userIdentity.type='Root' 
| stats count() as RootActivity by bin(5m)
```

使用此查询，您可以在折线图中可视化 root 账户活动。此查询随时间聚合 root 活动，计算每 5 分钟间隔内 root 活动的发生次数。
:::tip
     [在图表中可视化日志数据](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_Insights-Visualizing-Log-Data.html)
:::

## VPC Flow Logs

### 过滤选定源 IP 地址且操作为 REJECT 的流日志

```
fields @timestamp, @message, @logStream, @log  | filter srcAddr like '$SOURCEIP' and action = 'REJECT'
| sort @timestamp desc
| limit 20
```

此查询将返回来自 $SOURCEIP 包含"REJECT"的最近 20 条日志消息。这可用于检测流量是否被显式拒绝，或者问题是否属于某种客户端网络配置问题。

:::tip
    确保将 '$SOURCEIP' 替换为您感兴趣的 IP 地址值
:::

```
fields @timestamp, @message, @logStream, @log  | filter srcAddr like '10.0.0.5' and action = 'REJECT'
| sort @timestamp desc
| limit 20
```

### 按可用区分组网络流量

```
stats sum(bytes / 1048576) as Traffic_MB by azId as AZ_ID 
| sort Traffic_MB desc
```

此查询检索按可用区 (AZ) 分组的网络流量数据。它通过求和字节数并转换为 MB 来计算总流量。结果按每个 AZ 的流量大小降序排列。


### 按流方向分组网络流量

```
stats sum(bytes / 1048576) as Traffic_MB by flowDirection as Flow_Direction 
| sort by Bytes_MB desc
```

此查询旨在分析按流方向（入站或出站）分组的网络流量。


### 按源和目标 IP 地址排列的前 10 大数据传输

```
stats sum(bytes / 1048576) as Data_Transferred_MB by srcAddr as Source_IP, dstAddr as Destination_IP 
| sort Data_Transferred_MB desc 
| limit 10
```

此查询检索按源和目标 IP 地址排列的前 10 大数据传输。此查询可用于识别特定源和目标 IP 地址之间最显著的数据传输。

## Amazon SNS Logs

### 按原因统计短信消息失败数量

```
filter status = "FAILURE"
| stats count(*) by delivery.providerResponse as FailureReason
| sort delivery.providerResponse desc
```

上述查询列出按原因降序排列的发送失败计数。此查询可用于查找发送失败的原因。

### 由于无效电话号码导致的短信消息失败

```
fields notification.messageId as MessageId, delivery.destination as PhoneNumber
| filter status = "FAILURE" and delivery.providerResponse = "Invalid phone number"
| limit 100
```

此查询返回由于无效电话号码而发送失败的消息。这可用于识别需要更正的电话号码。

### 按短信类型统计消息失败

```
fields delivery.smsType
| filter status = "FAILURE"
| stats count(notification.messageId), avg(delivery.dwellTimeMs), sum(delivery.priceInUSD) by delivery.smsType
```

此查询返回每种短信类型（事务型或推广型）的计数、平均停留时间和费用。此查询可用于建立阈值以触发纠正措施。可以修改查询以仅过滤特定短信类型（如果只有该短信类型需要纠正措施）。

### SNS 失败通知统计

```
fields @MessageID 
| filter status = "FAILURE"
| stats count(delivery.deliveryId) as FailedDeliveryCount, avg(delivery.dwellTimeMs) as AvgDwellTime, max(delivery.dwellTimeMs) as MaxDwellTime by notification.messageId as MessageID
| limit 100
```

此查询返回每条失败消息的计数、平均停留时间和费用。此查询可用于建立阈值以触发纠正措施。



