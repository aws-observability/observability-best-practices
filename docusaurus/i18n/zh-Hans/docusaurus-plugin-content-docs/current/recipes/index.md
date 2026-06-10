# 方案

在这里，您将找到精心策划的指南、操作方法以及指向其他资源的链接，帮助您将 observability（o11y）应用于各种用例。这包括托管服务，如 [Amazon Managed Service for Prometheus][amp] 和 [Amazon Managed Grafana][amg]，以及代理，例如 [OpenTelemetry][otel] 和 [Fluent Bit][fluentbit]。这里的内容不仅限于 AWS 工具，还引用了许多开源项目。

我们希望同等满足开发人员和基础设施人员的需求，因此许多方案"覆盖面很广"。我们鼓励您探索并找到最适合您目标的解决方案。

:::info
    这里的内容来源于我们的解决方案架构师、专业服务团队与客户的实际合作，以及其他客户的反馈。您在这里找到的所有内容都已由我们的实际客户在其自身环境中实施。
:::

我们对 o11y 领域的思考方式如下：我们将其分解为[六个维度][dimensions]，您可以将它们组合起来得出特定的解决方案：

| 维度 | 示例 |
|---------------|--------------|
| 目的地  | [Prometheus][amp] &middot; [Grafana][amg] &middot; [OpenSearch][aes] &middot; [CloudWatch][cw] &middot; [Jaeger][jaeger] |
| 代理        | [ADOT][adot] &middot; [Fluent Bit][fluentbit] &middot; CW agent &middot; X-Ray agent |
| 语言     | [Java][java] &middot; Python &middot; .NET &middot; [JavaScript][nodejs] &middot; Go &middot; Rust |
| 基础设施与数据库  |  [RDS][rds] &middot; [DynamoDB][dynamodb] &middot; [MSK][msk] |
| 计算单元 | [Batch][batch] &middot; [ECS][ecs] &middot; [EKS][eks] &middot; [AEB][beans] &middot; [Lambda][lambda] &middot; [AppRunner][apprunner] |
| 计算引擎 | [Fargate][fargate] &middot; [EC2][ec2] &middot; [Lightsail][lightsail] |

:::note
    "示例解决方案需求"
    我需要一个日志解决方案，用于在 Fargate 上的 EKS 中运行的 Python 应用，目标是将日志存储到 S3 存储桶中以供进一步消费。
:::

以下是一个适合此需求的技术栈：

1. *目的地*：一个用于进一步消费数据的 S3 存储桶
1. *代理*：FluentBit 从 EKS 发送日志数据
1. *语言*：Python
1. *基础设施与数据库*：不适用
1. *计算单元*：Kubernetes（EKS）
1. *计算引擎*：EC2

并非每个维度都需要指定，有时很难决定从哪里开始。尝试不同的路径并比较某些方案的优缺点。

为了简化导航，我们将六个维度分组为以下类别：

- **按计算**：涵盖计算引擎和单元
- **按基础设施与数据**：涵盖基础设施和数据库
- **按语言**：涵盖语言
- **按目的地**：涵盖遥测和分析
- **任务**：涵盖异常检测、告警、故障排查等

[了解更多关于维度的信息...](https://aws-observability.github.io/observability-best-practices/recipes/dimensions/)

## 使用方法

您可以使用顶部导航菜单浏览到特定的索引页面，从粗略选择开始。例如，`按计算` -> `EKS` -> `Fargate` -> `Logs`。

或者，您可以按 `/` 或 `s` 键搜索网站：

![o11y 空间](images/search.png)

:::info
   "许可证"
  本站发布的所有方案均通过 [MIT-0][mit0] 许可证提供，这是对通常 MIT 许可证的修改版本，移除了署名要求。
:::

## 如何贡献

在 [讨论区][discussion] 发起讨论，说明您计划做什么，我们会从那里开始合作。

## 了解更多

本站的方案是最佳实践集合。此外，还有许多地方可以让您了解更多关于我们使用的开源项目的状态以及方案中涉及的托管服务，请查看：

- [observability @ aws][o11yataws]，一个 AWS 人员讨论其项目和服务的播放列表。
- [AWS observability workshops](https://aws-observability.github.io/observability-best-practices/recipes/workshops/)，以结构化的方式试用各种产品。
- [AWS 监控和 observability][o11yhome] 主页，包含案例研究和合作伙伴的链接。

[aes]: aes.md "Amazon Elasticsearch Service"
[adot]: https://aws-otel.github.io/ "AWS Distro for OpenTelemetry"
[amg]: amg.md "Amazon Managed Grafana"
[amp]: amp.md "Amazon Managed Service for Prometheus"
[batch]: https://aws.amazon.com/batch/ "AWS Batch"
[beans]: https://aws.amazon.com/elasticbeanstalk/ "AWS Elastic Beanstalk"
[cw]: cw.md "Amazon CloudWatch"
[dimensions]: dimensions.md
[dynamodb]: dynamodb.md "Amazon DynamoDB"
[ec2]: https://aws.amazon.com/ec2/ "Amazon EC2"
[ecs]: ecs.md "Amazon Elastic Container Service"
[eks]: eks.md "Amazon Elastic Kubernetes Service"
[fargate]: https://aws.amazon.com/fargate/ "AWS Fargate"
[fluentbit]: https://fluentbit.io/ "Fluent Bit"
[jaeger]: https://www.jaegertracing.io/ "Jaeger"
[kafka]: https://kafka.apache.org/ "Apache Kafka"
[apprunner]: apprunner.md "AWS App Runner"
[lambda]: lambda.md "AWS Lambda"
[lightsail]: https://aws.amazon.com/lightsail/ "Amazon Lightsail"
[otel]: https://opentelemetry.io/ "OpenTelemetry"
[java]: java.md
[nodejs]: nodejs.md
[rds]: rds.md "Amazon Relational Database Service"
[msk]: msk.md "Amazon Managed Streaming for Apache Kafka"
[mit0]: https://github.com/aws/mit-0 "MIT-0"
[discussion]: https://github.com/aws-observability/observability-best-practices/discussions "Discussions"
[o11yataws]: https://www.youtube.com/playlist?list=PLaiiCkpc1U7Wy7XwkpfgyOhIf_06IK3U_ "Observability @ AWS YouTube playlist"
[o11yhome]: https://aws.amazon.com/products/management-and-governance/use-cases/monitoring-and-observability/ "AWS Observability home"
