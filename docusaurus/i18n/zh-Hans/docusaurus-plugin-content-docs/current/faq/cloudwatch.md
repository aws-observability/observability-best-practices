# Amazon CloudWatch - 常见问题

## 为什么应该选择 Amazon CloudWatch？

Amazon CloudWatch 是一项 AWS 云原生服务，在单一平台上提供统一的 observability，用于监控 AWS 云资源和您在 AWS 上运行的应用程序。Amazon CloudWatch 可用于以[日志](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html)、[metrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/working_with_metrics.html)、[事件](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/WhatIsCloudWatchEvents.html)和[告警](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html)的形式收集监控和运营数据。它还提供了 AWS 资源、应用程序以及在 AWS 和[本地服务器](https://aws.amazon.com/blogs/mt/how-to-monitor-hybrid-environment-with-aws-services/)上运行的服务的[统一视图](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Dashboards.html)。Amazon CloudWatch 帮助您获得对资源利用率、应用程序性能和工作负载运行状况的全系统可见性。Amazon CloudWatch 为 AWS、混合和本地应用程序及基础设施资源提供[可操作的洞察](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Insights-Sections.html)。[跨账户 observability](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Unified-Cross-Account.html) 是 CloudWatch 统一 observability 功能的补充。

## 哪些 AWS 服务与 Amazon CloudWatch 和 Amazon CloudWatch Logs 原生集成？

Amazon CloudWatch 与超过 70 多种 AWS 服务原生集成，允许客户无需任何操作即可收集基础设施 metrics，实现简化的监控和可扩展性。请查看文档获取[发布 CloudWatch metrics 的 AWS 服务](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/aws-services-cloudwatch-metrics.html)完整列表。目前，超过 30 种 AWS 服务将日志发布到 CloudWatch。请查看文档获取[将日志发布到 CloudWatch Logs 的 AWS 服务](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/aws-services-sending-logs.html)完整列表。

## 在哪里获取所有 AWS 服务发布到 Amazon CloudWatch 的 metrics 列表？

所有[发布 metrics 的 AWS 服务](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/aws-services-cloudwatch-metrics.html)到 Amazon CloudWatch 的列表在 AWS 文档中。

## 在哪里开始收集和监控 Amazon CloudWatch 的 metrics？

[Amazon CloudWatch 收集 metrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/working_with_metrics.html) 来自各种 AWS 服务，可通过 [AWS 管理控制台、AWS CLI 或 API](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/viewing_metrics_with_cloudwatch.html) 查看。Amazon CloudWatch 为 Amazon EC2 实例收集[可用 metrics](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/viewing_metrics_with_cloudwatch.html)。对于额外的自定义 metrics，客户可以使用统一的 CloudWatch agent 来收集和监控。

> 相关 AWS Observability Workshop：[Metrics](https://catalog.workshops.aws/observability/en-US/aws-native/metrics)

## 我的 Amazon EC2 实例需要非常精细的监控级别，该怎么做？

默认情况下，Amazon EC2 以 5 分钟周期将 metric 数据发送到 CloudWatch，作为实例的基本监控。要以 1 分钟周期将实例的 metric 数据发送到 CloudWatch，可以在实例上启用[详细监控](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-cloudwatch-new.html)。

## 我想为应用程序发布自己的 metrics，有选项吗？

客户还可以使用 API 或 CLI 将自己的[自定义 metrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/publishingMetrics.html) 发布到 CloudWatch，支持 1 分钟粒度的标准分辨率或低至 1 秒间隔的高分辨率粒度。

CloudWatch agent 还支持在特殊场景中从 EC2 实例收集自定义 metrics，如使用 Elastic Network Adapter (ENA) 的 Linux 上运行的 EC2 实例的[网络性能 metrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-network-performance.html)、Linux 服务器的 [NVIDIA GPU metrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-NVIDIA-GPU.html)，以及使用 procstat 插件从 Linux 和 Windows 服务器上的[单个进程](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-procstat-process-metrics.html)收集进程 metrics。

> 相关 AWS Observability Workshop：[发布自定义 metrics](https://catalog.workshops.aws/observability/en-US/aws-native/metrics/publishmetrics)

## 通过 Amazon CloudWatch agent 收集自定义 metrics 还有哪些支持？

应用程序或服务的自定义 metrics 可以使用支持 [StatsD](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-custom-metrics-statsd.html) 或 [collectd](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-custom-metrics-collectd.html) 协议的统一 CloudWatch agent 来检索。StatsD 是一种流行的开源解决方案，可以从各种应用程序中收集 metrics。StatsD 特别适合用于检测自己的 metrics，支持基于 Linux 和 Windows 的服务器。collectd 协议是一种仅在 Linux 服务器上支持的流行开源解决方案，其插件可以为各种应用程序收集系统统计信息。

## 我的工作负载包含大量临时资源并生成高基数日志，收集和测量 metrics 和日志的推荐方法是什么？

[CloudWatch 嵌入式 metric 格式](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html)使客户能够以日志形式摄取复杂的高基数应用数据，并从 Lambda 函数和容器等临时资源生成可操作的 metrics。通过这种方式，客户可以在详细的日志事件数据中嵌入自定义 metrics，无需检测或维护单独的代码，同时获得对日志数据的强大分析能力，CloudWatch 可以自动提取自定义 metrics 以帮助可视化数据并对其设置告警以进行实时事件检测。

> 相关 AWS Observability Workshop：[嵌入式 Metric 格式](https://catalog.workshops.aws/observability/en-US/aws-native/metrics/emf)

## 在哪里开始收集和监控 Amazon CloudWatch 的日志？

[Amazon CloudWatch Logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html) 帮助客户使用现有的系统、应用程序和自定义日志文件近实时地监控和排除系统及应用程序故障。客户可以安装[统一 CloudWatch Agent](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_GettingStarted.html) 将 [Amazon EC2 实例和本地服务器的日志](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html)收集到 CloudWatch。

> 相关 AWS Observability Workshop：[Log Insights](https://catalog.workshops.aws/observability/en-US/aws-native/logs/logsinsights)

## 什么是 CloudWatch agent，为什么应该使用它？

[统一 CloudWatch Agent](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html) 是 MIT 许可证下的开源软件，支持使用 x86-64 和 ARM64 架构的大多数操作系统。CloudWatch Agent 帮助从 Amazon EC2 实例和混合环境中跨操作系统的本地服务器收集系统级 metrics，从应用程序或服务检索自定义 metrics，以及从 Amazon EC2 实例和本地服务器收集日志。

## 我的环境需要各种规模的安装，那么 CloudWatch agent 如何正常安装和使用自动化安装？

在所有支持的操作系统（包括 Linux 和 Windows 服务器）上，客户可以使用[命令行](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/installing-cloudwatch-agent-commandline.html)、AWS [Systems Manager](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/installing-cloudwatch-agent-ssm.html) 或 AWS [CloudFormation 模板](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent-New-Instances-CloudFormation.html)来下载和[安装 CloudWatch agent](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-on-EC2-Instance.html)。您还可以在[本地服务器上安装 CloudWatch agent](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-on-premise.html) 进行监控。

## 我们的组织在多个区域有多个 AWS 账户，Amazon CloudWatch 是否支持这些场景？

Amazon CloudWatch 提供[跨账户 observability](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Unified-Cross-Account.html)，帮助客户监控和排除跨区域内多个账户的资源和应用程序的健康状况。Amazon CloudWatch 还提供[跨账户、跨区域 dashboard](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Cross-Account-Cross-Region.html)。通过此功能，客户可以获得对其多账户、多区域资源和工作负载的可见性和洞察。

## Amazon CloudWatch 有哪些自动化支持？

除了通过 AWS 管理控制台访问 Amazon CloudWatch 外，客户还可以通过 API、[AWS 命令行界面 (CLI)](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) 和 [AWS SDK](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/sdk-general-information-section.html) 访问该服务。[CloudWatch API](https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/Welcome.html) 用于 metrics 和 dashboard，有助于通过 [AWS CLI](https://docs.aws.amazon.com/AmazonCloudWatch/latest/cli/Welcome.html) 实现自动化或与软件/产品集成，使您花更少的时间管理或维护资源和应用程序。[CloudWatch API](https://docs.aws.amazon.com/AmazonCloudWatchLogs/latest/APIReference/Welcome.html) 用于日志，连同 [AWS CLI](https://docs.aws.amazon.com/cli/latest/reference/logs/index.html) 也单独提供。[使用 AWS SDK 的 CloudWatch 代码示例](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/service_code_examples.html)可供客户参考。

## 我想快速开始监控资源，推荐的方法是什么？

CloudWatch 中的自动 Dashboard 在所有 AWS 公有区域可用，提供所有 AWS 资源健康状况和性能的聚合视图。这帮助客户快速开始监控、基于资源的 metrics 和告警视图，并轻松深入了解性能问题的根本原因。[自动 Dashboard](https://docs.aws.amazon.com/prescriptive-guidance/latest/implementing-logging-monitoring-cloudwatch/cloudwatch-dashboards-visualizations.html) 使用 AWS 服务推荐的最佳实践预先构建，保持资源感知，并动态更新以反映重要性能 metrics 的最新状态。

相关 AWS Observability Workshop：[自动 Dashboard](https://catalog.workshops.aws/observability/en-US/aws-native/dashboards/autogen-dashboard)

## 我想自定义在 CloudWatch 中监控的内容，推荐的方法是什么？

使用[自定义 Dashboard](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/create_dashboard.html)，客户可以创建所需数量的额外 dashboard，使用不同的小部件并进行相应自定义。创建自定义 dashboard 时，有多种小部件类型可供选择进行定制。

相关 AWS Observability Workshop：[Dashboard](https://catalog.workshops.aws/observability/en-US/aws-native/ec2-monitoring/dashboarding)

## 我已经构建了一些自定义 dashboard，有没有办法共享？

是的，[共享 CloudWatch dashboard](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch-dashboard-sharing.html) 是可能的。有三种共享方式。通过允许任何拥有链接的人查看 dashboard 来公开共享单个 dashboard。通过指定允许查看 dashboard 的人员的电子邮件地址来私密共享单个 dashboard。通过指定第三方单点登录 (SSO) 提供商来共享账户中所有 CloudWatch dashboard 的 dashboard 访问权限。

> 相关 AWS Observability Workshop：[共享 CloudWatch Dashboard](https://catalog.workshops.aws/observability/en-US/aws-native/dashboards/sharingdashboard)

## 我想改善应用程序及其底层 AWS 资源的 observability，如何实现？

[Amazon CloudWatch Application Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch-application-insights.html) 为您的应用程序及底层 AWS 资源（如 SQL Server 数据库、基于 .Net 的 Web (IIS) 堆栈、应用服务器、操作系统、负载均衡器、队列等）提供 observability。它帮助客户识别和设置跨应用程序资源和技术堆栈的关键 metrics 和日志。通过这样做，它减少了平均修复时间 (MTTR) 并更快地排除应用程序问题。

> 更多详情请参阅常见问题：[AWS 资源和自定义 metrics 监控](https://aws.amazon.com/cloudwatch/faqs/#AWS_resource_.26_custom_metrics_monitoring)

## 我的组织以开源为中心，Amazon CloudWatch 是否支持通过开源技术进行监控和 observability？

对于收集 metrics 和 traces，[AWS Distro for OpenTelemetry (ADOT) Collector](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-open-telemetry.html) 连同 CloudWatch agent 可以在 Amazon EC2 实例上并行安装，OpenTelemetry SDK 可用于从运行在 Amazon EC2 实例上的工作负载收集应用程序 traces 和 metrics。

为了在 Amazon CloudWatch 中支持 OpenTelemetry metrics，[AWS EMF Exporter for OpenTelemetry Collector](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/awsemfexporter) 将 OpenTelemetry 格式 metrics 转换为 CloudWatch 嵌入式 Metric 格式 (EMF)，使集成 OpenTelemetry metrics 的应用程序能够将高基数[应用 metrics 发送到 CloudWatch](https://aws-otel.github.io/docs/getting-started/adot-eks-add-on/config-cloudwatch)。

对于日志，Fluent Bit 帮助创建一个简单的扩展点，用于将[来自 Amazon EC2 的日志](https://docs.fluentbit.io/manual/pipeline/outputs/cloudwatch)流式传输到包括 Amazon CloudWatch 在内的 AWS 服务，进行日志保留和分析。新推出的 [Fluent Bit 插件](https://github.com/aws/amazon-cloudwatch-logs-for-fluent-bit#new-higher-performance-core-fluent-bit-plugin)可以将日志路由到 Amazon CloudWatch。

对于 Dashboard，Amazon Managed Grafana 可以通过 Grafana 工作区控制台中的 AWS 数据源配置选项将 [Amazon CloudWatch 添加为数据源](https://docs.aws.amazon.com/grafana/latest/userguide/using-amazon-cloudwatch-in-AMG.html)。此功能通过发现现有 CloudWatch 账户并管理访问 CloudWatch 所需的认证凭证配置来简化将 CloudWatch 添加为数据源的过程。

## 我们的工作负载已经使用 Prometheus 从环境中收集 metrics，我可以继续使用相同的方法吗？

客户可以选择为其 observability 需求建立全开源设置。为此，AWS Distro for OpenTelemetry (ADOT) Collector 可以配置为从 Prometheus 检测的应用程序中抓取并将 metrics 发送到 Prometheus Server 或 Amazon Managed Prometheus。

EC2 实例上的 CloudWatch agent 可以安装并配置 [Prometheus 来抓取 metrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-PrometheusEC2.html) 以在 CloudWatch 中进行监控。这对于偏好在 EC2 上运行容器工作负载并需要与开源 Prometheus 监控兼容的自定义 metrics 的客户很有帮助。

CloudWatch [Container Insights Prometheus 监控](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights-Prometheus.html)自动发现来自容器化系统和工作负载的 Prometheus metrics。发现 Prometheus metrics 支持 Amazon Elastic Container Service (ECS)、Amazon Elastic Kubernetes Service (EKS) 和运行在 Amazon EC2 实例上的 Kubernetes 集群。

## 我的工作负载包含微服务计算，特别是 EKS/Kubernetes 相关容器，如何使用 Amazon CloudWatch 来获取环境洞察？

客户可以使用 [CloudWatch Container Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html) 来收集、聚合和汇总来自运行在 [Amazon Elastic Kubernetes Service (Amazon EKS)](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/deploy-container-insights-EKS.html) 或 Amazon EC2 上的 Kubernetes 平台上的容器化应用程序和微服务的 metrics 和日志。[Container Insights](https://aws.amazon.com/cloudwatch/faqs/#Container_Monitoring) 还支持从部署在 Amazon EKS 的 Fargate 上的集群收集 metrics。CloudWatch 自动[收集 metrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-metrics.html)，涵盖 CPU、内存、磁盘和网络等多种资源，还[提供诊断信息](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-reference.html)（如容器重启失败），帮助隔离问题并快速解决。

> 相关 AWS Observability Workshop：[EKS 上的 Container Insights](https://catalog.workshops.aws/observability/en-US/aws-native/insights/containerinsights/eks)

## 我的工作负载包含微服务计算，特别是 ECS 相关容器，如何使用 Amazon CloudWatch 来获取环境洞察？

客户可以使用 [CloudWatch Container Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html) 来收集、聚合和汇总来自运行在 [Amazon Elastic Container Service (Amazon ECS)](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/deploy-container-insights-ECS.html) 或 Amazon EC2 上的容器平台上的容器化应用程序和微服务的 metrics 和日志。[Container Insights](https://aws.amazon.com/cloudwatch/faqs/#Container_Monitoring) 还支持从部署在 Amazon ECS 的 Fargate 上的集群收集 metrics。CloudWatch 自动[收集 metrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-metrics.html)，涵盖 CPU、内存、磁盘和网络等多种资源，还[提供诊断信息](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-reference.html)（如容器重启失败），帮助隔离问题并快速解决。

> 相关 AWS Observability Workshop：[ECS 上的 Container Insights](https://catalog.workshops.aws/observability/en-US/aws-native/insights/containerinsights/ecs)

## 我的工作负载包含无服务器计算，特别是 AWS Lambda，如何使用 Amazon CloudWatch 来获取环境洞察？

客户可以使用 [CloudWatch Lambda Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Lambda-Insights.html) 来监控和排除运行在 AWS Lambda 上的无服务器应用程序的故障。[CloudWatch Lambda Insights](https://aws.amazon.com/cloudwatch/faqs/#Lambda_Monitoring) 收集、聚合和汇总系统级 metrics，包括 CPU 时间、内存、磁盘和网络，还收集、聚合和汇总诊断信息（如冷启动和 Lambda worker 关闭），帮助客户隔离 Lambda 函数的问题并快速解决。

> 相关 AWS Observability Workshop：[Lambda Insights](https://catalog.workshops.aws/observability/en-US/aws-native/insights/lambdainsights)

## 我将大量日志聚合到 Amazon CloudWatch Logs，如何获取这些数据的 observability？

[CloudWatch Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html) 使客户能够交互式地搜索、分析日志数据，并执行查询以高效有效地响应 Amazon CloudWatch Logs 中的运营问题。如果发生问题，客户可以使用 [CloudWatch Logs Insights](https://aws.amazon.com/cloudwatch/faqs/#Log_analytics) 来识别潜在原因并验证已部署的修复。

## 如何在 Amazon CloudWatch Logs 中查询日志？

Amazon CloudWatch Logs 中的 CloudWatch Logs Insights 使用[查询语言](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html)来查询日志组。

## 如何管理存储在 Amazon CloudWatch Logs 中的日志以进行成本优化、合规保留或额外处理？

默认情况下，Amazon CloudWatch Logs 的[日志组](https://aws.amazon.com/cloudwatch/faqs/#Log_management)[永久保留且永不过期](https://docs.aws.amazon.com/managedservices/latest/userguide/log-customize-retention.html)。客户可以调整每个日志组的保留策略，选择 1 天到 10 年之间的保留期限，具体取决于他们想要保留日志多长时间以优化成本或满足合规目的。

客户可以将日志数据从[日志组导出到 Amazon S3 桶](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/S3Export.html)，并使用这些数据进行自定义处理和分析，或加载到其他系统。

客户还可以在 CloudWatch Logs 中配置日志组，通过 CloudWatch Logs 订阅近实时地[将数据流式传输到 Amazon OpenSearch Service](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_OpenSearch_Stream.html) 集群。这样做有助于客户执行交互式日志分析、实时应用程序监控、搜索等。

## 我的工作负载生成的日志可能包含敏感数据，在 Amazon CloudWatch 中有没有办法保护它们？

客户可以利用 CloudWatch Logs 中的[日志数据保护功能](https://aws.amazon.com/cloudwatch/faqs/#Log_data_protection)，帮助客户[定义自己的规则和策略来自动](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/mask-sensitive-log-data.html#mask-sensitive-log-data-start)检测和屏蔽从系统和应用程序收集的日志中的敏感数据。

相关 AWS Observability Workshop：[数据保护](https://catalog.workshops.aws/observability/en-US/aws-native/logs/dataprotection)

## 我想在系统和应用程序发生异常带或意外变化时了解情况。Amazon CloudWatch 如何在发生时提醒我？

[Amazon CloudWatch 异常检测](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Anomaly_Detection.html)应用统计和机器学习算法持续分析系统和应用程序的单一时间序列，确定正常基线，并以最少的用户干预发现异常。这些算法创建异常检测模型，生成代表正常 metric 行为的预期值范围。客户可以根据过去 metric 数据的分析和异常阈值设置的值来[创建告警](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Create_Anomaly_Detection_Alarm.html)。

> 相关 AWS Observability Workshop：[异常检测](https://catalog.workshops.aws/observability/en-US/aws-native/metrics/alarms/anomalydetection)

## 我在 Amazon CloudWatch 中设置了 metric 告警，但是收到频繁的告警噪音。如何控制和调优？

客户可以将多个告警组合为告警层次结构作为[复合告警](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Create_Composite_Alarm.html)，通过在多个[告警](https://aws.amazon.com/cloudwatch/faqs/#Alarms)同时触发时仅触发一次来减少告警噪音。复合告警通过帮助客户分组资源（如应用程序、AWS 区域或可用区）来支持整体状态。

> 相关 AWS Observability Workshop：[告警](https://catalog.workshops.aws/observability/en-US/aws-native/metrics/alarms)

## 我面向互联网的工作负载遇到了性能和可用性问题，如何排除故障？

[Amazon CloudWatch Internet Monitor](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-InternetMonitor.html) 提供了对互联网问题如何影响托管在 AWS 上的应用程序与最终用户之间的性能和可用性的可见性。使用 [Internet Monitor](https://aws.amazon.com/cloudwatch/faqs/#Internet_Monitoring)，您可以快速识别影响应用程序性能和可用性的因素，以便追踪和解决问题，这可以显著减少诊断互联网问题所需的时间。

## 我的工作负载在 AWS 上，我想在最终用户遇到影响或延迟之前收到通知。如何获得更好的可见性并改善面向客户的工作负载的 observability？

客户可以使用 [Amazon CloudWatch Synthetics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries.html) 创建金丝雀（canary），即按计划运行的可配置脚本，来监控您的 endpoint 和 API。金丝雀遵循与客户相同的路径并执行相同的操作，这使得即使在没有实时流量到达应用程序时也能持续验证最终用户体验。金丝雀帮助您在客户发现问题之前发现问题。金丝雀检查 endpoint 的可用性和延迟，并可以存储由无头 Chromium 浏览器渲染的加载时间数据和 UI 截图。

> 相关 AWS Observability Workshop：[CloudWatch Synthetics](https://catalog.workshops.aws/observability/en-US/aws-native/app-monitoring/synthetics)

## 如何通过识别客户端性能来观测最终用户体验并解决实时问题？

[CloudWatch RUM](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM.html) 可以执行真实用户监控，从实际用户会话中近实时地收集和查看关于 Web 应用程序性能的客户端数据。收集的数据有助于快速识别和调试客户端性能问题，还有助于可视化和分析页面加载时间、客户端错误和用户行为。查看这些数据时，客户可以看到所有聚合在一起的数据，还可以按客户使用的浏览器和设备查看细分。CloudWatch RUM 帮助可视化应用程序性能中的异常，并找到相关的调试数据，如错误消息、堆栈跟踪和用户会话。

> 相关 AWS Observability Workshop：[CloudWatch RUM](https://catalog.workshops.aws/observability/en-US/aws-native/app-monitoring/rum)

## 我的组织要求记录所有操作以供审计。Amazon CloudWatch 事件可以被记录吗？

Amazon CloudWatch 与 [AWS CloudTrail](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html) 集成，提供用户、角色或 AWS 服务在 Amazon CloudWatch 中执行的操作记录。CloudTrail 将所有 [Amazon CloudWatch 的 API 调用](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/logging_cw_api_calls.html)捕获为事件，包括来自控制台的调用和对 API 操作的代码调用。

## 还有哪些其他信息可用？

如需更多信息，客户可以阅读 [CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html)、[CloudWatch Events](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/WhatIsCloudWatchEvents.html) 和 [CloudWatch Logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html) 的 AWS 文档，浏览 [AWS 原生 Observability](https://catalog.workshops.aws/observability/en-US/aws-native) 上的 AWS Observability Workshop，还可以查看[产品页面](https://aws.amazon.com/cloudwatch/)了解[功能](https://aws.amazon.com/cloudwatch/features/)和[定价](https://aws.amazon.com/cloudwatch/pricing/)详情。额外的 [CloudWatch 教程](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-tutorials.html)展示了客户使用案例场景。

**产品常见问题：** [https://aws.amazon.com/cloudwatch/faqs/](https://aws.amazon.com/cloudwatch/faqs/)
