# 使用 AWS Distro for OpenTelemetry 在 ECS 集群中收集系统 metrics
[AWS Distro for OpenTelemetry](https://aws-otel.github.io/docs/introduction) (ADOT) 是 [OpenTelemetry](https://opentelemetry.io/) 项目的一个安全的、由 AWS 官方支持的发行版。使用 ADOT，您可以从多个来源收集遥测数据，并将相关的 metrics、traces 和 logs 发送到多个监控解决方案。ADOT 可以通过两种不同的模式部署在 Amazon ECS 集群上。

## ADOT Collector 的部署模式
1. 在 sidecar 模式中，ADOT collector 运行在集群中每个任务内部，仅处理该任务内应用容器收集的遥测数据。只有当您需要 collector 从 Amazon ECS [Task Metadata Endpoint](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-metadata-endpoint.html) 读取任务元数据并从中生成资源使用 metrics（如 CPU、内存、网络和磁盘）时，才需要使用此部署模式。
![ADOT architecture](../../../../images/ADOT-sidecar.png)

2. 在集中式 collector 模式中，集群上部署单个 ADOT collector 实例来处理集群上所有运行任务的遥测数据。这是最常用的部署模式。collector 使用 REPLICA 或 DAEMON 服务调度策略进行部署。
![ADOT architecture](../../../../images/ADOT-central.png)

ADOT collector 架构有 pipeline 的概念。单个 collector 可以包含多个 pipeline。每个 pipeline 专门处理三种类型遥测数据中的一种，即 metrics、traces 和 logs。您可以为每种类型的遥测数据配置多个 pipeline。这种灵活的架构允许单个 collector 执行多个可观测性代理的角色，否则这些代理都需要部署在集群上。它显著减少了集群上可观测性代理的部署开销。组成 pipeline 的 collector 主要组件分为三类：Receiver、Processor 和 Exporter。还有称为 Extensions 的辅助组件，它们提供可添加到 collector 的功能，但不属于 pipeline 的一部分。

:::info
    请参阅 OpenTelemetry [文档](https://opentelemetry.io/docs/collector/configuration/#basics)以获取关于 Receivers、Processors、Exporters 和 Extensions 的详细说明。
:::

## 部署 ADOT Collector 以收集 ECS 任务 metrics

要收集 ECS 任务级别的资源利用率 metrics，应使用 sidecar 模式部署 ADOT collector，任务定义如下所示。collector 使用的容器镜像捆绑了多种 pipeline 配置。您可以根据需求选择其中一种，并在容器定义的 *command* 部分指定配置文件路径。将此值设置为 `--config=/etc/ecs/container-insights/otel-task-metrics-config.yaml` 将使用一个 [pipeline 配置](https://github.com/aws-observability/aws-otel-collector/blob/main/config/ecs/container-insights/otel-task-metrics-config.yaml)，该配置从与 collector 运行在同一任务中的其他容器收集资源利用率 metrics 和 traces，并将它们发送到 Amazon CloudWatch 和 AWS X-Ray。具体来说，collector 使用 [AWS ECS Container Metrics Receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/awsecscontainermetricsreceiver)，从 [Amazon ECS Task Metadata Endpoint](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-metadata-endpoint-v4.html) 读取任务元数据和 docker 统计信息，并从中生成资源使用 metrics（如 CPU、内存、网络和磁盘）。

```javascript
{
    "family":"AdotTask",
    "taskRoleArn":"arn:aws:iam::123456789012:role/ECS-ADOT-Task-Role",
    "executionRoleArn":"arn:aws:iam::123456789012:role/ECS-Task-Execution-Role",
    "networkMode":"awsvpc",
    "containerDefinitions":[
       {
          "name":"application-container",
          "image":"..."
       },
       {
          "name":"aws-otel-collector",
          "image":"public.ecr.aws/aws-observability/aws-otel-collector:latest",
          "cpu":512,
          "memory":1024,
          "command": [
            "--config=/etc/ecs/container-insights/otel-task-metrics-config.yaml"
          ],          
          "portMappings":[
             {
                "containerPort":2000,
                "protocol":"udp"
             }
          ],             
          "essential":true
       }
    ],
    "requiresCompatibilities":[
       "EC2"
    ],
    "cpu":"1024",
    "memory":"2048"
 }
```
:::info
    请参阅[文档](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/deploy-container-insights-ECS-adot.html)了解设置 ADOT collector 在 Amazon ECS 集群上部署时使用的 IAM 任务角色和任务执行角色的详细信息。
:::

:::info
    [AWS ECS Container Metrics Receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/awsecscontainermetricsreceiver) 仅适用于 ECS Task Metadata Endpoint V4。使用平台版本 1.4.0 或更高版本的 Fargate 上的 Amazon ECS 任务，以及运行 Amazon ECS 容器代理 1.39.0 或更高版本的 Amazon EC2 上的 Amazon ECS 任务可以使用此 receiver。有关更多信息，请参阅 [Amazon ECS Container Agent Versions](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-agent-versions.html)
:::

如默认 [pipeline 配置](https://github.com/aws-observability/aws-otel-collector/blob/main/config/ecs/container-insights/otel-task-metrics-config.yaml)所示，collector 的 pipeline 首先使用 [Filter Processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/filterprocessor)，它过滤出与 CPU、内存、网络和磁盘使用相关的[一部分 metrics](https://github.com/aws-observability/aws-otel-collector/blob/09d59966404c2928aaaf6920f27967a84d898254/config/ecs/container-insights/otel-task-metrics-config.yaml#L25)。然后使用 [Metrics Transform Processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/metricstransformprocessor) 执行一组[转换操作](https://github.com/aws-observability/aws-otel-collector/blob/09d59966404c2928aaaf6920f27967a84d898254/config/ecs/container-insights/otel-task-metrics-config.yaml#L39)来更改这些 metrics 的名称并更新其属性。最后，使用 [Amazon CloudWatch EMF Exporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/awsemfexporter) 将 metrics 作为性能日志事件发送到 CloudWatch。使用此默认配置将在 CloudWatch 命名空间 *ECS/ContainerInsights* 下收集以下资源使用 metrics。

- MemoryUtilized
- MemoryReserved
- CpuUtilized
- CpuReserved
- NetworkRxBytes
- NetworkTxBytes
- StorageReadBytes
- StorageWriteBytes

:::info
    请注意，这些与 [Container Insights 为 Amazon ECS 收集的 metrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-metrics-ECS.html) 相同，当您在集群或账户级别启用 Container Insights 时，这些 metrics 会在 CloudWatch 中立即可用。因此，启用 Container Insights 是在 CloudWatch 中收集 ECS 资源使用 metrics 的推荐方法。
:::

AWS ECS Container Metrics Receiver 从 Amazon ECS Task Metadata Endpoint 读取并发出 52 个唯一 metrics。receiver 收集的完整 metrics 列表[在此文档中记录](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/awsecscontainermetricsreceiver#available-metrics)。您可能不想将所有 metrics 发送到首选目标。如果您需要更精确地控制 ECS 资源使用 metrics，可以创建自定义 pipeline 配置，使用您选择的 processors/transformers 过滤和转换可用 metrics，并根据您选择的 exporters 将它们发送到目标。请参阅文档中的[其他示例](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/awsecscontainermetricsreceiver#full-configuration-examples)了解用于捕获 ECS 任务级别 metrics 的 pipeline 配置。

如果您想使用自定义 pipeline 配置，可以使用下面所示的任务定义，并使用 sidecar 模式部署 collector。在这里，collector pipeline 的配置从 AWS SSM Parameter Store 中名为 *otel-collector-config* 的参数加载。

:::note
    SSM Parameter Store 参数名称必须通过名为 AOT_CONFIG_CONTENT 的环境变量暴露给 collector。
:::

```javascript
{
    "family":"AdotTask",
    "taskRoleArn":"arn:aws:iam::123456789012:role/ECS-ADOT-Task-Role",
    "executionRoleArn":"arn:aws:iam::123456789012:role/ECS-Task-Execution-Role",
    "networkMode":"awsvpc",
    "containerDefinitions":[
       {
          "name":"application-container",
          "image":"..."
       },        
       {
          "name":"aws-otel-collector",
          "image":"public.ecr.aws/aws-observability/aws-otel-collector:latest",
          "cpu":512,
          "memory":1024,
          "secrets":[
             {
                "name":"AOT_CONFIG_CONTENT",
                "valueFrom":"arn:aws:ssm:us-east-1:123456789012:parameter/otel-collector-config"
             }
          ],          
          "portMappings":[
             {
                "containerPort":2000,
                "protocol":"udp"
             }
          ],             
          "essential":true
       }
    ],
    "requiresCompatibilities":[
       "EC2"
    ],
    "cpu":"1024",
    "memory":"2048"
 }
```

## 部署 ADOT Collector 以收集 ECS 容器实例 metrics

要从 ECS 集群收集 EC2 实例级别的 metrics，可以使用如下所示的任务定义部署 ADOT collector。它应使用 daemon 服务调度策略进行部署。您可以选择容器镜像中捆绑的 pipeline 配置。容器定义中 *command* 部分的配置文件路径应设置为 `--config=/etc/ecs/otel-instance-metrics-config.yaml`。collector 使用 [AWS Container Insights Receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/awscontainerinsightreceiver#aws-container-insights-receiver) 来收集多种资源（如 CPU、内存、磁盘和网络）的 EC2 实例级别基础设施 metrics。metrics 使用 [Amazon CloudWatch EMF Exporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/awsemfexporter) 作为性能日志事件发送到 CloudWatch。此配置下 collector 的功能等同于在托管在 EC2 上的 Amazon ECS 集群上部署 CloudWatch 代理。

:::info
    在 AWS Fargate 上运行的 ECS 集群不支持用于收集 EC2 实例级别 metrics 的 ADOT Collector 部署
:::

```javascript
{
    "family":"AdotTask",
    "taskRoleArn":"arn:aws:iam::123456789012:role/ECS-ADOT-Task-Role",
    "executionRoleArn":"arn:aws:iam::123456789012:role/ECS-Task-Execution-Role",
    "networkMode":"awsvpc",
    "containerDefinitions":[
       {
          "name":"application-container",
          "image":"..."
       },
       {
          "name":"aws-otel-collector",
          "image":"public.ecr.aws/aws-observability/aws-otel-collector:latest",
          "cpu":512,
          "memory":1024,
          "command": [
            "--config=/etc/ecs/otel-instance-metrics-config.yaml"
          ],          
          "portMappings":[
             {
                "containerPort":2000,
                "protocol":"udp"
             }
          ],             
          "essential":true
       }
    ],
    "requiresCompatibilities":[
       "EC2"
    ],
    "cpu":"1024",
    "memory":"2048"
 }
```
