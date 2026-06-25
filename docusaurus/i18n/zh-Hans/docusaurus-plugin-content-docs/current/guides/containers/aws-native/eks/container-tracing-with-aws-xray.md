# 使用 AWS X-Ray 进行容器追踪

在可观测性最佳实践指南的这一部分中，我们将深入探讨以下与使用 AWS X-Ray 进行容器追踪相关的主题：

* AWS X-Ray 简介
* 使用 Amazon EKS 附加组件为 AWS Distro for OpenTelemetry 收集 Traces
* 结论

### 简介

[AWS X-Ray](https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html) 是一项服务，它收集关于应用程序处理的请求的数据，并提供工具供您查看、过滤和获取洞察，以识别问题和优化机会。对于应用程序的任何被追踪的请求，您不仅可以看到请求和响应的详细信息，还可以看到应用程序对下游 AWS 资源、微服务、数据库和 Web API 的调用信息。

对应用程序进行 instrument 涉及发送传入和传出请求以及应用程序内其他事件的 trace 数据，以及每个请求的元数据。许多 instrument 场景仅需要配置更改。例如，您可以对 Java 应用程序发出的所有传入 HTTP 请求和对 AWS 服务的下游调用进行 instrument。有多种 SDK、agent 和工具可用于对应用程序进行 X-Ray tracing 的 instrument。有关更多信息，请参阅[对应用程序进行 instrument](https://docs.aws.amazon.com/xray/latest/devguide/xray-instrumenting-your-app.html)。

我们将通过使用 Amazon EKS 附加组件为 AWS Distro for OpenTelemetry 从 Amazon EKS 集群收集 traces 来了解容器化应用程序追踪。

### 使用 Amazon EKS 附加组件为 AWS Distro for OpenTelemetry 收集 Traces

[AWS X-Ray](https://aws.amazon.com/xray/) 提供应用程序追踪功能，对所有已部署的微服务提供深入洞察。使用 X-Ray，每个请求在流经相关微服务时都可以被追踪。这为 DevOps 团队提供了理解服务如何与对等服务交互所需的洞察，使他们能够更快地分析和调试问题。

[AWS Distro for OpenTelemetry (ADOT)](https://aws-otel.github.io/docs/introduction) 是 OpenTelemetry 项目的安全、AWS 支持的发行版。用户只需对应用程序进行一次 instrument，即可使用 ADOT 将相关的 metrics 和 traces 发送到多个监控解决方案。Amazon EKS 现在允许用户在集群启动并运行后随时将 ADOT 作为附加组件启用。ADOT 附加组件包含最新的安全补丁和错误修复，并经过 AWS 验证可与 Amazon EKS 配合使用。

ADOT 附加组件是 Kubernetes Operator 的一种实现，它是 Kubernetes 的软件扩展，利用自定义资源来管理应用程序及其组件。该附加组件监视名为 OpenTelemetryCollector 的自定义资源，并根据自定义资源中指定的配置设置管理 ADOT Collector 的生命周期。

ADOT Collector 具有 pipeline 的概念，它由三种关键类型的组件组成，即 receiver、processor 和 exporter。[receiver](https://opentelemetry.io/docs/collector/configuration/#receivers) 是数据进入 collector 的方式。它以特定格式接受数据，将其转换为内部格式，并传递给 pipeline 中定义的 [processor](https://opentelemetry.io/docs/collector/configuration/#processors) 和 [exporter](https://opentelemetry.io/docs/collector/configuration/#exporters)。它可以是拉取或推送模式。Processor 是一个可选组件，用于在数据被接收和导出之间执行批处理、过滤和转换等任务。Exporter 用于确定将 metrics、logs 或 traces 发送到哪个目标。Collector 架构允许通过 Kubernetes YAML manifest 设置多个这样的 pipeline 实例。

下图展示了配置了 traces pipeline 的 ADOT Collector，它将遥测数据发送到 AWS X-Ray。Traces pipeline 由一个 [AWS X-Ray Receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/awsxrayreceiver) 实例和 [AWS X-Ray Exporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/awsxrayexporter) 组成，将 traces 发送到 AWS X-Ray。

![Tracing-1](../../../../images/Containers/aws-native/eks/tracing-1.jpg)

*图：使用 Amazon EKS 附加组件为 AWS Distro for OpenTelemetry 收集 Traces。*

让我们深入了解在 EKS 集群中安装 ADOT 附加组件，然后从工作负载收集遥测数据的详细信息。以下是安装 ADOT 附加组件之前需要的先决条件列表。

* 支持 Kubernetes 1.19 或更高版本的 EKS 集群。您可以使用[此处概述的方法](https://docs.aws.amazon.com/eks/latest/userguide/create-cluster.html)之一创建 EKS 集群。
* [Certificate Manager](https://cert-manager.io/)，如果尚未安装在集群中。可以按照[此文档](https://cert-manager.io/docs/installation/)使用默认配置进行安装。
* 专门用于 EKS 附加组件的 Kubernetes RBAC 权限，以在集群中安装 ADOT 附加组件。这可以通过使用 kubectl 等 CLI 工具将[此 YAML](https://amazon-eks.s3.amazonaws.com/docs/addons-otel-permissions.yaml) 文件中的设置应用到集群来完成。

您可以使用以下命令检查不同 EKS 版本启用的附加组件列表：

`aws eks describe-addon-versions`

JSON 输出应列出 ADOT 附加组件以及其他附加组件，如下所示。请注意，创建 EKS 集群时，EKS 附加组件不会自动在其上安装任何附加组件。


```
{
   "addonName":"adot",
   "type":"observability",
   "addonVersions":[
      {
         "addonVersion":"v0.45.0-eksbuild.1",
         "architecture":[
            "amd64"
         ],
         "compatibilities":[
            {
               "clusterVersion":"1.22",
               "platformVersions":[
                  "*"
               ],
               "defaultVersion":true
            },
            {
               "clusterVersion":"1.21",
               "platformVersions":[
                  "*"
               ],
               "defaultVersion":true
            },
            {
               "clusterVersion":"1.20",
               "platformVersions":[
                  "*"
               ],
               "defaultVersion":true
            },
            {
               "clusterVersion":"1.19",
               "platformVersions":[
                  "*"
               ],
               "defaultVersion":true
            }
         ]
      }
   ]
}
```

接下来，您可以使用以下命令安装 ADOT 附加组件：

`aws eks create-addon --addon-name adot --addon-version v0.45.0-eksbuild.1 --cluster-name $CLUSTER_NAME `

版本字符串必须与之前显示的输出中 *addonVersion* 字段的值匹配。成功执行此命令的输出如下：

```
{
    "addon": {
        "addonName": "adot",
        "clusterName": "k8s-production-cluster",
        "status": "ACTIVE",
        "addonVersion": "v0.45.0-eksbuild.1",
        "health": {
            "issues": []
        },
        "addonArn": "arn:aws:eks:us-east-1:123456789000:addon/k8s-production-cluster/adot/f0bff97c-0647-ef6f-eecf-0b2a13f7491b",
        "createdAt": "2022-04-04T10:36:56.966000+05:30",
        "modifiedAt": "2022-04-04T10:38:09.142000+05:30",
        "tags": {}
    }
}
```

在继续下一步之前，请等待附加组件处于 ACTIVE 状态。可以使用以下命令检查附加组件的状态：

`aws eks describe-addon --addon-name adot --cluster-name $CLUSTER_NAME`

#### 部署 ADOT Collector

ADOT 附加组件是 Kubernetes Operator 的一种实现，它是 Kubernetes 的软件扩展，利用自定义资源来管理应用程序及其组件。该附加组件监视名为 OpenTelemetryCollector 的自定义资源，并根据自定义资源中指定的配置设置管理 ADOT Collector 的生命周期。下图展示了其工作原理。

![Tracing-1](../../../../images/Containers/aws-native/eks/tracing-2.jpg)

*图：部署 ADOT Collector。*

接下来，让我们看看如何部署 ADOT Collector。[此处的 YAML 配置文件](https://github.com/aws-observability/aws-o11y-recipes/blob/main/sandbox/eks-addon-adot/otel-collector-xray-prometheus-complete.yaml)定义了一个 OpenTelemetryCollector 自定义资源。当部署到 EKS 集群时，这将触发 ADOT 附加组件来配置一个包含 traces 和 metrics pipeline 及组件的 ADOT Collector，如上面的第一个图所示。Collector 作为 Kubernetes Deployment 启动到 `aws-otel-eks` namespace 中，名称为 `${custom-resource-name}-collector`。同时还会启动一个同名的 ClusterIP service。让我们深入了解组成此 collector pipeline 的各个组件。

Traces pipeline 中的 AWS X-Ray Receiver 接受 [X-Ray Segment 格式](https://docs.aws.amazon.com/xray/latest/devguide/xray-api-segmentdocuments.html)的 segment 或 span，这使其能够处理由 X-Ray SDK instrument 的微服务发送的 segment。它配置为在 UDP 端口 2000 上监听流量，并作为 Cluster IP service 公开。根据此配置，想要向此 receiver 发送 trace 数据的工作负载应配置环境变量 `AWS_XRAY_DAEMON_ADDRESS` 设置为 `observability-collector.aws-otel-eks:2000`。Exporter 使用 [PutTraceSegments](https://docs.aws.amazon.com/xray/latest/api/API_PutTraceSegments.html) API 将这些 segment 直接发送到 X-Ray。

ADOT Collector 配置为在名为 `aws-otel-collector` 的 Kubernetes service account 身份下启动，该 service account 通过 ClusterRoleBinding 和 ClusterRole 授予这些权限，如[配置](https://github.com/aws-observability/aws-o11y-recipes/blob/main/sandbox/eks-addon-adot/otel-collector-xray-prometheus-complete.yaml)中所示。Exporter 需要 IAM 权限才能将数据发送到 X-Ray。这通过使用 EKS 支持的 [IAM roles for service accounts](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html) 功能将 service account 与 IAM 角色关联来完成。IAM 角色应与 AWS 托管策略（如 AWSXRayDaemonWriteAccess）关联。[此处的辅助脚本](https://github.com/aws-observability/aws-o11y-recipes/blob/main/sandbox/eks-addon-adot/adot-irsa.sh)可在设置 CLUSTER_NAME 和 REGION 变量后使用，以创建名为 `EKS-ADOT-ServiceAccount-Role` 的 IAM 角色，该角色被授予这些权限并与 `aws-otel-collector` service account 关联。

#### Traces 收集的端到端测试

现在让我们将所有内容整合在一起，测试从部署到 EKS 集群的工作负载收集 traces。下图展示了此测试使用的设置。它由一个前端服务（公开一组 REST API 并与 S3 交互）和一个数据存储服务（与 Aurora PostgreSQL 数据库实例交互）组成。这些服务使用 X-Ray SDK 进行 instrument。ADOT Collector 通过使用上一节讨论的 YAML manifest 部署 OpenTelemetryCollector 自定义资源以 Deployment 模式启动。Postman 客户端用作外部流量生成器，目标为前端服务。

![Tracing-3](../../../../images/Containers/aws-native/eks/tracing-3.jpg)

*图：Traces 收集的端到端测试。*

下图显示了 X-Ray 使用从服务捕获的 segment 数据生成的服务图，以及每个 segment 的平均响应延迟。

![Tracing-4](../../../../images/Containers/aws-native/eks/tracing-4.jpg)

*图：CloudWatch Service Map 控制台。*

请查看[使用 OTLP Receiver 和 AWS X-Ray Exporter 将 traces 发送到 AWS X-Ray 的 Traces pipeline](https://github.com/aws-observability/aws-otel-community/blob/master/sample-configs/operator/collector-config-xray.yaml) 获取与 traces pipeline 配置相关的 OpenTelemetryCollector 自定义资源定义。想要将 ADOT Collector 与 AWS X-Ray 结合使用的客户可以从这些配置模板开始，将占位符变量替换为基于其目标环境的值，并使用 EKS 的 ADOT 附加组件快速将 collector 部署到 Amazon EKS 集群。


### 使用 EKS Blueprints 设置使用 AWS X-Ray 的容器追踪

[EKS Blueprints](https://aws.amazon.com/blogs/containers/bootstrapping-clusters-with-eks-blueprints/) 是一组基础设施即代码 (IaC) 模块，可帮助您跨账户和区域配置和部署一致的、功能齐全的 EKS 集群。您可以使用 EKS Blueprints 轻松引导 EKS 集群，配合 [Amazon EKS 附加组件](https://docs.aws.amazon.com/eks/latest/userguide/eks-add-ons.html)以及广泛的流行开源附加组件，包括 Prometheus、Karpenter、Nginx、Traefik、AWS Load Balancer Controller、Container Insights、Fluent Bit、Keda、Argo CD 等。EKS Blueprints 在两个流行的 IaC 框架中实现，即 [HashiCorp Terraform](https://github.com/aws-ia/terraform-aws-eks-blueprints) 和 [AWS Cloud Development Kit (AWS CDK)](https://github.com/aws-quickstart/cdk-eks-blueprints)，帮助您自动化基础设施部署。

作为使用 EKS Blueprints 创建 Amazon EKS 集群过程的一部分，您可以设置 AWS X-Ray 作为 Day 2 运维工具，将容器化应用程序和微服务的 metrics 和 logs 收集、聚合和汇总到 Amazon CloudWatch 控制台。

## 结论

在可观测性最佳实践指南的这一部分中，我们学习了如何使用 AWS X-Ray 对 Amazon EKS 上的应用程序进行容器追踪，通过使用 Amazon EKS 附加组件为 AWS Distro for OpenTelemetry 收集 traces。如需进一步了解，请查看[使用 Amazon EKS 附加组件为 AWS Distro for OpenTelemetry 收集 Metrics 和 Traces 到 Amazon Managed Service for Prometheus 和 Amazon CloudWatch](https://aws.amazon.com/blogs/containers/metrics-and-traces-collection-using-amazon-eks-add-ons-for-aws-distro-for-opentelemetry/)。最后，我们简要介绍了如何使用 EKS Blueprints 作为在 Amazon EKS 集群创建过程中设置使用 AWS X-Ray 的容器追踪的工具。如需进一步深入了解，我们强烈建议您在 AWS [https://catalog.workshops.aws/observability/en-US](https://catalog.workshops.aws/observability/en-US) 的 **AWS 原生** 可观测性类别下练习 X-Ray Traces 模块。
