# CloudWatch Contributor Insights

## 概述
Amazon CloudWatch Contributor Insights 帮助您分析 log 数据以识别影响 metrics 的主要贡献者。它通过创建实时排名和统计数据，使您能够了解哪些实体正在影响系统的行为和性能。

## 功能
- 实时分析 log 数据
- 为常见 AWS 服务提供内置规则
- 自定义规则创建功能
- 自动数据处理和排名
- 与 CloudWatch dashboard 和 alarm 集成

## 实施

### 内置规则
CloudWatch Contributor Insights 为常见 AWS 服务提供预构建规则：
- VPC Flow Logs 分析
- Application Load Balancer logs
- Amazon API Gateway logs
- AWS Lambda logs

### 自定义规则
通过定义以下内容创建自定义规则：
1. Log 组作为源文档。贡献者字段进行分析
3. Metrics 和聚合
4. 时间窗口和采样率

自定义规则示例：
```yaml
{
	"AggregateOn": "Count",
	"Contribution": {
		"Filters": [],
		"Keys": [
			"$.pettype"
		]
	},c
	"LogFormat": "JSON",
	"Schema": {
		"Name": "CloudWatchLogRule",
		"Version": 1
	},
	"LogGroupARNs": [
		"arn:aws:logs:[region]:[account]:log-group:[API Gateway Log Group Name]"
	]
}
```

![CloudWatch Contributor Insights 控制台预览](../../../images/contrib1.png)

## 最佳实践

### 规则配置
- 使用描述性的规则名称
- 尽可能从内置规则开始
- 实施有针对性的 log 过滤
- 配置适当的时间窗口

### 性能优化
- 限制活动规则数量
- 设置最佳采样率
- 使用适当的聚合周期
- 仅为需要的 log 组启用规则

### 成本管理
- 定期监控规则使用情况
- 删除未使用的规则
- 实施 log 过滤
- 定期审查采样率

### 安全性
- 遵循最小权限原则
- 加密敏感数据
- 定期规则审计
- 监控模式变化

## 常见问题和解决方案

### 规则未匹配 Logs
**问题**：规则未处理预期的 logs
**解决方案**：
- 验证 log 格式与规则配置匹配
- 检查字段名称是否正确
- 验证 JSON 结构

### 数据缺失
**问题**：贡献者数据中存在间隔
**解决方案**：
- 检查采样率配置
- 验证 log 投递
- 审查时间窗口设置

### 性能问题
**问题**：规则处理缓慢
**解决方案**：
- 优化活动规则数量
- 调整采样率
- 审查贡献阈值

## 集成

### CloudWatch Dashboard
创建主要贡献者的可视化：
```yaml
{
  "widgets": [
    {
      "type": "metric",
      "properties": {
        "view": "bar",
        "region": "us-east-1",
        "title": "Top Contributors",
        "period": 300
      }
    }
  ]
}
```

### CloudWatch Alarm
设置贡献者模式的告警：
```yaml
{
  "AlarmName": "HighContributorCount",
  "MetricName": "UniqueContributors",
  "Threshold": 100,
  "Period": 300,
  "EvaluationPeriods": 2
}
```

## 工具和资源

### AWS CLI 命令
```bash
# Create a rule
aws cloudwatch put-insight-rule --rule-name MyRule --rule-definition file://rule.json

# Delete a rule
aws cloudwatch delete-insight-rule --rule-name MyRule
```

### 相关服务
- Amazon CloudWatch
- CloudWatch Logs
- CloudWatch Alarms
- Amazon EventBridge

### 附加资源
- [官方文档](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContributorInsights.html)
- [规则语法参考](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContributorInsights-RuleSyntax.html)
- [AWS CLI 参考](https://docs.aws.amazon.com/cli/latest/reference/cloudwatch/put-insight-rule.html)
