# 日志

日志工具的选择与您对数据传输、过滤、保留、采集以及与生成数据的应用集成的需求密切相关。在使用 Amazon Web Services 进行 Observability 时（无论您是在本地还是在其他云环境中托管），您可以利用 [CloudWatch agent](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html) 或其他工具（如 [Fluentd](https://www.fluentd.org/)）来发送日志数据进行分析。

在此，我们将详细介绍使用 CloudWatch agent 进行日志记录的最佳实践，以及在 AWS 控制台或 API 中使用 CloudWatch Logs。

:::info
	CloudWatch agent 还可用于将 [metric 数据](../../signals/metrics) 传送到 CloudWatch。有关实施详情，请参阅 [metrics](../metrics) 页面。它还可以用于从 OpenTelemetry 或 X-Ray 客户端 SDK 收集 [traces](../../signals/traces.md)，并将其发送到 [AWS X-Ray](../xray.md)。
:::
## 使用 CloudWatch agent 收集日志

### 转发

采用[云优先方法](../../faq/general.md#what-is-a-cloud-first-approach)进行 Observability 时，一般原则是：如果您需要登录到机器上才能获取日志，那么这就是一种反模式。您的工作负载应该近乎实时地将日志数据发送到外部的日志分析系统，传输与原始事件之间的延迟代表着在灾难降临工作负载时可能丢失的时间点信息。

作为架构师，您需要确定日志数据的可接受损失量，并相应地调整 CloudWatch agent 的 [`force_flush_interval`](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-Configuration-File-Details.html#CloudWatch-Agent-Configuration-File-Logssection)。

`force_flush_interval` 指示 agent 按固定频率将日志数据发送到数据平面，除非达到缓冲区大小限制，在这种情况下它会立即发送所有缓冲的日志。

:::tip
	边缘设备的需求可能与低延迟的 AWS 内部工作负载非常不同，可能需要更长的 `force_flush_interval` 设置。例如，低带宽互联网连接上的 IoT 设备可能只需要每 15 分钟刷新一次日志。
:::
:::info
	容器化或无状态工作负载可能对日志刷新要求特别敏感。考虑一个可以随时被缩容的无状态 Kubernetes 应用或 EC2 集群。当这些资源突然被终止时，日志可能会丢失，将来无法从中提取日志。标准的 `force_flush_interval` 通常适用于这些场景，但如果需要可以降低。
:::
### 日志组

在 CloudWatch Logs 中，逻辑上适用于某个应用的每组日志应该被传送到单个[日志组](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatchLogsConcepts.html)。在该日志组中，创建日志流的源系统之间应该具有*共性*。

考虑一个 LAMP 技术栈：来自 Apache、MySQL、PHP 应用和托管 Linux 操作系统的日志应分别属于不同的日志组。

这种分组至关重要，因为它允许您对各组使用相同的保留期、加密密钥、metric filters、subscription filters 和 Contributor Insights 规则。

:::info
	日志组中的日志流数量没有限制，您可以在单个 CloudWatch Logs Insights 查询中搜索应用的所有日志。为 Kubernetes 服务中的每个 pod 或集群中的每个 EC2 实例设置单独的日志流是标准模式。
:::
:::info
	日志组的默认保留期是*无限期*。最佳实践是在创建日志组时设置保留期。

	虽然您可以随时在 CloudWatch 控制台中进行设置，但最佳实践是使用基础设施即代码（CloudFormation、Cloud Development Kit 等）在创建日志组的同时进行设置，或者在 CloudWatch agent 配置中使用 `retention_in_days` 设置。

	两种方法都可以让您主动设置日志保留期，与项目的数据保留要求保持一致。
:::

:::info
	日志组数据在 CloudWatch Logs 中始终是加密的。默认情况下，CloudWatch Logs 对静态日志数据使用`服务端`加密。作为替代方案，您可以使用 AWS Key Management Service 进行此加密。[使用 AWS KMS 加密](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/encrypt-log-data-kms.html) 在日志组级别启用，通过将 KMS 密钥与日志组关联（在创建日志组时或创建后均可）。这可以使用基础设施即代码（CloudFormation、Cloud Development Kit 等）进行配置。

	使用 AWS Key Management Service 管理 CloudWatch Logs 的密钥需要额外的配置并为用户授予密钥权限。[^1]
:::
### 日志格式

CloudWatch Logs 能够在接入时自动发现日志字段并索引 JSON 数据。此功能有助于即席查询和过滤，提高日志数据的可用性。但需要注意的是，自动索引仅适用于结构化数据。非结构化日志数据不会被自动索引，但仍然可以传送到 CloudWatch Logs。

非结构化日志仍然可以使用 `parse` 命令的正则表达式进行搜索或查询。

:::info
	使用 CloudWatch Logs 时日志格式的两个最佳实践：

	1. 使用结构化日志格式化器，如 [Log4j](https://logging.apache.org/log4j/2.x/)、[`python-json-logger`](https://pypi.org/project/python-json-logger/) 或您框架的原生 JSON 输出器。
	2. 每个事件发送单行日志到日志目的地。

	注意，发送多行 JSON 日志时，每行将被解释为单个事件。
:::
### 处理 `stdout`

如我们在[日志信号](../../signals/logs#log-to-stdout)页面中讨论的，最佳实践是将日志系统与生成它们的应用解耦。然而，将 `stdout` 数据发送到文件是许多（如果不是大多数）平台的常见模式。容器编排系统如 Kubernetes 或 [Amazon Elastic Container Service](https://aws.amazon.com/ecs/) 自动管理 `stdout` 到日志文件的传送，允许收集器收集每条日志。CloudWatch agent 然后实时读取此文件并代您将数据转发到日志组。

:::info
	尽可能使用简化的应用日志到 `stdout`、由 agent 收集的模式。
:::
### 日志过滤

过滤日志有很多原因，例如防止个人数据的持久存储，或仅捕获特定日志级别的数据。无论如何，最佳实践是尽可能在靠近源系统的地方执行过滤。对于 CloudWatch，这意味着*在*数据传送到 CloudWatch Logs 进行分析*之前*。CloudWatch agent 可以为您执行此过滤。

:::info
	使用 [`filters`](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-Configuration-File-Details.html#CloudWatch-Agent-Configuration-File-Logssection) 功能来 `include` 您想要的日志级别，并 `exclude` 已知不需要的模式，例如信用卡号、电话号码等。
:::
:::tip
	过滤某些可能泄漏到日志中的已知数据形式可能耗时且容易出错。但是，对于处理特定类型已知不需要数据（例如信用卡号、社会安全号码）的工作负载，为这些记录设置过滤器可以防止将来可能出现的合规问题。例如，删除所有包含社会安全号码的记录可以像这个配置一样简单：

	```
	"filters": [
      {
        "type": "exclude",
        "expression": "\b(?!000|666|9\d{2})([0-8]\d{2}|7([0-6]\d))([-]?|\s{1})(?!00)\d\d\2(?!0000)\d{4}\b"
      }
    ]
    ```
:::

### 多行日志

所有日志记录的最佳实践是使用[结构化日志](../../signals/logs#structured-logging-is-key-to-success)，每个离散日志事件发出一行。但是，有许多旧版和 ISV 支持的应用没有此选项。对于这些工作负载，CloudWatch Logs 会将每行解释为唯一事件，除非它们使用多行感知协议发出。CloudWatch agent 可以通过 [`multi_line_start_pattern`](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-Configuration-File-Details.html#CloudWatch-Agent-Configuration-File-Logssection) 指令执行此操作。

:::info
	使用 `multi_line_start_pattern` 指令来减轻将多行日志接入 CloudWatch Logs 的负担。
:::
### 配置日志类别

CloudWatch Logs 提供两个[类别](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch_Logs_Log_Classes.html)的日志组：

- CloudWatch Logs 标准日志类别是一个功能完整的选项，适用于需要实时监控或经常访问的日志。

- CloudWatch Logs 低频访问日志类别是一种新的日志类别，您可以用它来经济高效地整合日志。此日志类别提供 CloudWatch Logs 功能的子集，包括托管接入、存储、跨账户日志分析和加密，且每 GB 接入价格更低。低频访问日志类别非常适合即席查询和对不经常访问的日志进行事后取证分析。

:::info
	使用 `log_group_class` 指令指定新日志组使用的日志组类别。有效值为 **STANDARD** 和 **INFREQUENT_ACCESS**。如果省略此字段，agent 默认使用 **STANDARD**。
:::

#### 审计现有日志以确定正确的类别

CloudWatch Logs 低频访问层日志类别使用 CloudWatch 日志功能的子集。建议审计现有日志组，检查是否有标准日志组可以重新创建为低频访问日志组。一个好方法是运行 [log-ia-checker](https://github.com/aws-observability/log-ia-checker) CLI 工具。此工具将分析给定区域中的所有日志组，并输出可以转换为低频访问的日志。

## 使用 CloudWatch Logs 搜索

### 通过查询范围管理成本

数据传送到 CloudWatch Logs 后，您现在可以根据需要搜索它。请注意，CloudWatch Logs 按扫描的数据量（每 GB）收费。有一些策略可以控制您的查询范围，从而减少扫描的数据量。

:::info
	搜索日志时，请确保您的时间和日期范围是合适的。CloudWatch Logs 允许您为扫描设置相对或绝对时间范围。*如果您只是在查找前一天的条目，则无需包含对今天日志的扫描！*
:::

:::info
	您可以在单个查询中搜索多个日志组，但这样做会导致更多数据被扫描。当您确定了需要目标定位的日志组后，相应地缩小查询范围。
:::

:::tip
	您可以直接从 CloudWatch 控制台查看每个查询实际扫描了多少数据。这种方法可以帮助您创建高效的查询。

	![CloudWatch Logs 控制台预览](../../images/cwl1.png)
:::

### 与他人共享成功的查询

虽然 [CloudWatch Logs 查询语法](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html)并不复杂，但从头编写某些查询仍然可能很耗时。与同一 AWS 账户中的其他用户共享写好的查询可以简化应用日志的调查。这可以直接从 [AWS 管理控制台](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_Insights-Saving-Queries.html)完成，也可以使用 [CloudFormation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-querydefinition.html) 或 [AWS CDK](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_logs.CfnQueryDefinition.html) 编程实现。这样做可以减少其他需要分析日志数据的人所需的重复工作。

:::info
	将经常重复的查询保存到 CloudWatch Logs 中，以便为用户预填充。

	![CloudWatch Logs 查询编辑器页面](../../images/cwl2.png)
:::

### 模式分析

CloudWatch Logs Insights 在您查询日志时使用机器学习算法来查找模式。模式是日志字段中反复出现的共享文本结构。模式对于分析大型日志集非常有用，因为大量日志事件通常可以压缩为几个模式。[^2]

:::info
	使用 pattern 自动将日志数据聚类为模式。

	![CloudWatch Logs 查询模式示例](../../images/pattern_analysis.png)
:::

### 与之前时间范围的比较（diff）

CloudWatch Logs Insights 支持比较日志事件随时间的变化，有助于错误检测和趋势识别。比较查询揭示模式，便于快速趋势分析，并能够查看示例原始日志事件进行更深入的调查。查询在两个时间段进行分析：选定的时间段和等长的比较时间段。[^3]

:::info
	使用 `diff` 命令比较日志事件随时间的变化。

	![CloudWatch Logs 查询差异示例](../../images/diff-query.png)
:::

[^1]: 有关 CloudWatch Logs 日志组加密及访问权限的实际示例，请参阅 [How to search through your AWS Systems Manager Session Manager console logs – Part 1](https://aws.amazon.com/blogs/mt/how-to-search-through-your-aws-systems-manager-session-manager-console-logs-part-1/)。

[^2]: 有关更详细的见解，请参阅 [CloudWatch Logs Insights Pattern Analysis](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_AnalyzeLogData_Patterns.html)。

[^3]: 有关更多信息，请参阅 [CloudWatch Logs Insights Compare(diff) with previous ranges](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_AnalyzeLogData_Compare.html)。
