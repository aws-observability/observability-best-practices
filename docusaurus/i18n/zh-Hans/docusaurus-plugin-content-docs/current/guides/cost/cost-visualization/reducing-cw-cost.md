# 降低 CloudWatch 成本

## GetMetricData

通常 `GetMetricData` 是由第三方 Observability 工具和/或云财务工具在其平台中使用 CloudWatch Metrics 发起的调用导致的。

- 考虑降低第三方工具发起请求的频率。例如，将频率从 1 分钟降低到 5 分钟，应该可以将成本降低到原来的 1/5（20%）。
- 要识别趋势，可以考虑暂时关闭第三方工具的任何数据收集。

## CloudWatch Logs

- 使用此[知识中心文档][log-article]找到主要贡献者。
- 降低主要贡献者的日志级别，除非确有必要。
- 查明您是否除了 CloudWatch 之外还使用了第三方日志工具。
- 如果您在每个 VPC 上都启用了 VPC Flow Log 且流量很大，成本会迅速增加。如果仍然需要，考虑将其发送到 Amazon S3。
- 查看是否所有 AWS Lambda 函数都需要日志记录。如果不需要，在 Lambda 角色中拒绝 "logs:PutLogEvents" 权限。
- CloudTrail logs 通常是主要贡献者。将它们发送到 Amazon S3 并使用 Amazon Athena 进行查询，使用 Amazon EventBridge 进行告警/通知会更便宜。

请参阅此[知识中心文章][article]了解更多详情。


[article]: https://aws.amazon.com/premiumsupport/knowledge-center/cloudwatch-understand-and-reduce-charges/
[log-article]: https://aws.amazon.com/premiumsupport/knowledge-center/cloudwatch-logs-bill-increase/
