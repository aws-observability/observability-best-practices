# 使用 Container Insights 收集系统 metrics
系统 metrics 涉及底层资源，包括服务器上的物理组件，如 CPU、内存、磁盘和网络接口。
使用 [CloudWatch Container Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html) 从部署到 Amazon ECS 的容器化应用中收集、聚合和汇总系统 metrics。Container Insights 还提供诊断信息，例如容器重启失败，帮助快速隔离和解决问题。它适用于部署在 EC2 和 Fargate 上的 Amazon ECS 集群。

Container Insights 使用[嵌入式 metrics 格式](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html)以性能日志事件的形式收集数据。这些性能日志事件是使用结构化 JSON 模式的条目，支持大规模摄取和存储高基数数据。从这些数据中，CloudWatch 在集群、节点、服务和任务级别创建聚合 metrics 作为 CloudWatch metrics。

:::note
	要使 Container Insights metrics 显示在 CloudWatch 中，您必须在 Amazon ECS 集群上启用 Container Insights。这可以在账户级别或单个集群级别完成。要在账户级别启用，使用以下 AWS CLI 命令：

    ```
    aws ecs put-account-setting --name "containerInsights" --value "enabled
    ```

    要在单个集群级别启用，使用以下 AWS CLI 命令：

    ```
    aws ecs update-cluster-settings --cluster $CLUSTER_NAME --settings name=containerInsights,value=enabled
    ```
:::

## 收集集群级别和服务级别 metrics
默认情况下，CloudWatch Container Insights 在任务、服务和集群级别收集 metrics。Amazon ECS 代理在 EC2 容器实例上为每个任务收集这些 metrics（适用于 ECS on EC2 和 ECS on Fargate），并将它们作为性能日志事件发送到 CloudWatch。您无需在集群上部署任何代理。从中提取 metrics 的这些日志事件收集在名为 */aws/ecs/containerinsights/$CLUSTER_NAME/performance* 的 CloudWatch 日志组下。从这些事件中提取的完整 metrics 列表[在此文档中记录](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-metrics-ECS.html)。Container Insights 收集的 metrics 可以在 CloudWatch 控制台的预构建 dashboard 中查看，方法是从导航页面选择 *Container Insights*，然后从下拉列表中选择 *performance monitoring*。它们也可以在 CloudWatch 控制台的 *Metrics* 部分查看。

![Container Insights metrics dashboard](../../../../images/ContainerInsightsMetrics.png)

:::note
    如果您在 Amazon EC2 实例上使用 Amazon ECS，并且希望从 Container Insights 收集网络和存储 metrics，请使用包含 Amazon ECS 代理版本 1.29 的 AMI 启动该实例。
:::

:::warning
    Container Insights 收集的 metrics 按自定义 metrics 收费。有关 CloudWatch 定价的更多信息，请参阅 [Amazon CloudWatch 定价](https://aws.amazon.com/cloudwatch/pricing/)
:::

## 收集实例级别 metrics
将 CloudWatch 代理部署到托管在 EC2 上的 Amazon ECS 集群，可以从集群收集实例级别的 metrics。代理作为 daemon 服务部署，从集群中每个 EC2 容器实例发送实例级别 metrics 作为性能日志事件。从这些事件中提取的完整实例级别 metrics 列表[在此文档中记录](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-metrics-ECS.html)

:::info
    将 CloudWatch 代理部署到 Amazon ECS 集群以收集实例级别 metrics 的步骤记录在 [Amazon CloudWatch 用户指南](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/deploy-container-insights-ECS-instancelevel.html)中。请注意，此选项不适用于托管在 Fargate 上的 Amazon ECS 集群。
:::
    
## 使用 Logs Insights 分析性能日志事件
Container Insights 使用嵌入式 metrics 格式的性能日志事件收集 metrics。每个日志事件可能包含在系统资源（如 CPU 和内存）或 ECS 资源（如任务和服务）上观察到的性能数据。Container Insights 从 Amazon ECS 在集群、服务、任务和容器级别收集的性能日志事件示例[在此列出](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-reference-performance-logs-ECS.html)。CloudWatch 仅基于这些日志事件中的部分性能数据生成 metrics。但您可以使用这些日志事件通过 CloudWatch Logs Insights 查询对性能数据进行更深入的分析。

Logs Insights 查询的用户界面位于 CloudWatch 控制台中，方法是从导航页面选择 *Logs Insights*。当您选择一个日志组时，CloudWatch Logs Insights 会自动检测日志组中性能日志事件的字段，并在右侧窗格的 *Discovered* 字段中显示它们。查询执行的结果显示为此日志组中随时间变化的日志事件柱状图。此柱状图显示与您的查询和时间范围匹配的日志组中事件的分布。

![Logs Insights dashboard](../../../../images/LogInsights.png)

:::info
    以下是一个 Logs Insights 示例查询，用于显示 CPU 和内存使用的容器级别 metrics。
    
    ```
    stats avg(CpuUtilized) as CPU, avg(MemoryUtilized) as Mem by TaskId, ContainerName | sort Mem, CPU desc
    ```
:::
