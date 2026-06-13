# 使用 Kubecost

Kubecost 为客户提供 Kubernetes 环境中支出和资源效率的可见性。从高层次来看，Amazon EKS 成本监控通过 Kubecost 部署，其中包含 Prometheus——一个开源监控系统和时间序列数据库。Kubecost 从 Prometheus 读取 metrics，然后执行成本分配计算，并将 metrics 写回 Prometheus。最后，Kubecost 前端从 Prometheus 读取 metrics 并在 Kubecost 用户界面（UI）上显示。其架构如下图所示：

![Architecture](../../images/kubecost-architecture.png)

## 使用 Kubecost 的理由
随着客户将应用程序现代化并使用 Amazon EKS 部署工作负载，他们通过整合运行应用程序所需的计算资源来提高效率。然而，这种利用率效率的提升伴随着衡量应用程序成本难度增加的权衡。今天，您可以使用以下方法之一按租户分配成本：

* 硬多租户 — 在专用 AWS 账户中运行独立的 EKS 集群。
* 软多租户 — 在共享的 EKS 集群中运行多个节点组。
* 基于消耗的计费 — 使用资源消耗来计算共享 EKS 集群中产生的成本。

使用硬多租户时，工作负载部署在独立的 EKS 集群中，您可以识别集群及其依赖项产生的成本，而无需运行报告来确定每个租户的支出。
使用软多租户时，您可以使用 Kubernetes 功能（如 [Node Selectors](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector) 和 [Node Affinity](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity)）来指示 Kubernetes Scheduler 在专用节点组上运行租户的工作负载。您可以使用标识符（如产品名称或团队名称）标记节点组中的 EC2 实例，并使用[标签](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/cost-alloc-tags.html)来分配成本。
上述两种方法的缺点是您可能最终会有未使用的容量，并且可能无法充分利用运行密集型集群带来的成本节约。您仍然需要方法来分配共享资源（如 Elastic Load Balancing、网络传输费用）的成本。

在多租户 Kubernetes 集群中跟踪成本的最有效方式是根据工作负载消耗的资源量来分配产生的成本。这种模式允许您最大化 EC2 实例的利用率，因为不同的工作负载可以共享节点，从而允许您增加节点上的 pod 密度。然而，按工作负载或 namespace 计算成本是一项具有挑战性的任务。了解工作负载的成本责任需要聚合在一个时间范围内消耗或保留的所有资源，并根据资源成本和使用持续时间评估费用。这正是 Kubecost 致力于解决的挑战。

:::tip
    查看我们的 [https://catalog.workshops.aws/observability/en-US/aws-managed-oss/amp/ingest-kubecost-metrics](https://catalog.workshops.aws/observability/en-US/aws-managed-oss/amp/ingest-kubecost-metrics) 获取 Kubecost 的动手体验。
:::

## 建议
### 成本分配
Kubecost Cost Allocation dashboard 允许您快速查看所有原生 Kubernetes 概念（如 namespace、k8s 标签和 service）的已分配支出和优化机会。它还允许将成本分配给组织概念，如团队、产品/项目、部门或环境。您可以修改日期范围和过滤器来获取特定工作负载的见解并保存报告。要优化 Kubernetes 成本，您应该关注效率和集群空闲成本。

![Allocations](../../images/allocations.png)

### 效率

Pod 资源效率定义为给定时间窗口内的资源利用率与资源请求的比值。它是成本加权的，可以表示如下：
```
(((CPU Usage / CPU Requested) * CPU Cost) + ((RAM Usage / RAM Requested) * RAM Cost)) / (RAM Cost + CPU Cost)
```
其中 CPU Usage = rate(container_cpu_usage_seconds_total) 在时间窗口内 RAM Usage = avg(container_memory_working_set_bytes) 在时间窗口内

由于 AWS 不提供明确的 RAM、CPU 或 GPU 价格，Kubecost 模型回退到提供的基础 CPU、GPU 和 RAM 价格输入的比率。这些参数的默认值基于云提供商的边际资源费率，但可以在 Kubecost 中自定义。这些基础资源（RAM/CPU/GPU）价格经过归一化处理，以确保每个组件的总和等于根据提供商计费费率配置的节点总价格。

每个服务团队有责任朝着最大效率前进，并微调工作负载以实现目标。

### 空闲成本
集群空闲成本定义为已分配资源成本与运行这些资源的硬件成本之间的差异。分配定义为使用量和请求量的最大值。它也可以表示如下：
```
idle_cost = sum(node_cost) - (cpu_allocation_cost + ram_allocation_cost + gpu_allocation_cost)
```
其中 allocation = max(request, usage)

因此，空闲成本也可以被视为 Kubernetes 调度器可以在不中断任何现有工作负载的情况下调度 pod 的空间成本，但该空间目前未被使用。它可以分配给工作负载、集群或按节点分配，具体取决于您的配置方式。


### 网络成本

Kubecost 尽最大努力将网络传输成本分配给产生这些成本的工作负载。确定网络成本的准确方式是结合使用 [AWS Cloud Integration](https://www.ibm.com/docs/en/kubecost/self-hosted/3.x?topic=integration-aws-cloud-using-irsaeks-pod-identities) 和 [Network costs daemonset](https://docs.kubecost.com/install-and-configure/advanced-configuration/network-costs-configuration)。

您需要考虑效率分数和空闲成本来微调工作负载，以确保充分利用集群的全部潜力。这将我们引向下一个主题，即集群合理调整。

### 工作负载合理调整

Kubecost 基于 Kubernetes 原生 metrics 为您的工作负载提供合理调整建议。Kubecost UI 中的 savings 面板是一个很好的起点。

![Savings](../../images/savings.png)

![Right-sizing](../../images/right-sizing.png)

Kubecost 可以为您提供以下建议：

* 通过查看过度配置和配置不足的 container 请求来合理调整 container 资源请求
* 调整集群节点的数量和大小以停止在未使用容量上的过度支出
* 缩减、删除/调整不发送或接收有意义流量速率的 pod
* 识别适合 Spot 节点的工作负载
* 识别未被任何 pod 使用的卷


Kubecost 还有一个预发布功能，如果您启用了 Cluster Controller 组件，可以自动实施其对 container 资源请求的建议。使用自动请求合理调整允许您立即优化整个集群的资源分配，无需测试过多的 YAML 或复杂的 kubectl 命令。您可以轻松消除集群中的资源过度分配，从而为通过集群合理调整和其他优化实现大幅节约铺平道路。

### 将 Kubecost 与 Amazon Managed Service for Prometheus 集成

Kubecost 利用开源 Prometheus 项目作为时间序列数据库，并对 Prometheus 中的数据进行后处理以执行成本分配计算。根据集群大小和工作负载规模，Prometheus 服务器抓取和存储 metrics 可能会变得不堪重负。在这种情况下，您可以使用 Amazon Managed Service for Prometheus——一种兼容 Prometheus 的托管监控服务来可靠地存储 metrics，并使您能够轻松地大规模监控 Kubernetes 成本。

您必须为 Kubecost 服务账户设置 [IAM roles](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html)。使用集群的 OIDC 提供程序，您可以向集群的服务账户授予 IAM 权限。您必须向 kubecost-cost-analyzer 和 kubecost-prometheus-server 服务账户授予适当的权限。这些将用于从工作区发送和检索 metrics。在命令行上运行以下命令：

```
eksctl create iamserviceaccount \ 
--name kubecost-cost-analyzer \ 
--namespace kubecost \ 
--cluster <CLUSTER_NAME> \
--region <REGION> \ 
--attach-policy-arn arn:aws:iam::aws:policy/AmazonPrometheusQueryAccess \ 
--attach-policy-arn arn:aws:iam::aws:policy/AmazonPrometheusRemoteWriteAccess \ 
--override-existing-serviceaccounts \ 
--approve 

eksctl create iamserviceaccount \ 
--name kubecost-prometheus-server \ 
--namespace kubecost \ 
--cluster <CLUSTER_NAME> --region <REGION> \ 
--attach-policy-arn arn:aws:iam::aws:policy/AmazonPrometheusQueryAccess \ 
--attach-policy-arn arn:aws:iam::aws:policy/AmazonPrometheusRemoteWriteAccess \ 
--override-existing-serviceaccounts \ 
--approve

```
`CLUSTER_NAME` 是您要安装 Kubecost 的 Amazon EKS 集群名称，"REGION" 是 Amazon EKS 集群的区域。

完成后，您需要按如下方式升级 Kubecost helm chart：
```
helm upgrade -i kubecost \
oci://public.ecr.aws/kubecost/cost-analyzer --version <$VERSION> \
--namespace kubecost --create-namespace \
-f https://tinyurl.com/kubecost-amazon-eks \
-f https://tinyurl.com/kubecost-amp \
--set global.amp.prometheusServerEndpoint=${QUERYURL} \
--set global.amp.remoteWriteService=${REMOTEWRITEURL}
```
### 访问 Kubecost UI

Kubecost 提供了一个 Web dashboard，您可以通过 kubectl port-forward、ingress 或负载均衡器访问。Kubecost 企业版还支持使用 [SSO/SAML](https://www.ibm.com/docs/en/kubecost/self-hosted/3.x?topic=configuration-user-management-oidc) 限制对 dashboard 的访问，并提供不同级别的访问权限。例如，将团队的视图限制为仅显示他们负责的产品。

在 AWS 环境中，考虑使用 [AWS Load Balancer Controller](https://docs.aws.amazon.com/eks/latest/userguide/aws-load-balancer-controller.html) 来暴露 Kubecost，并使用 [Amazon Cognito](https://aws.amazon.com/cognito/) 进行身份验证、授权和用户管理。您可以在此了解更多信息：[How to use Application Load Balancer and Amazon Cognito to authenticate users for your Kubernetes web apps](https://aws.amazon.com/blogs/containers/how-to-use-application-load-balancer-and-amazon-cognito-to-authenticate-users-for-your-kubernetes-web-apps/)


### 多集群视图

您的 FinOps 团队可能需要审查 EKS 集群以与业务负责人分享建议。在大规模运营时，团队登录每个集群查看建议变得具有挑战性。多集群允许您拥有全球所有聚合集群成本的统一视图。Kubecost 为具有多个集群的环境支持三种选项：Kubecost Free、Kubecost Business 和 Kubecost Enterprise。在免费和商业模式下，云计费对账将在每个集群级别执行。在企业模式下，云计费对账将在提供 Kubecost UI 的主集群中执行，并使用存储 metrics 的共享存储桶。
需要注意的是，只有在使用企业模式时，metrics 保留才是无限的。

### 参考资料
* [https://catalog.workshops.aws/observability/en-US/aws-managed-oss/amp/ingest-kubecost-metrics 上的 Kubecost 动手体验](https://catalog.workshops.aws/observability/en-US/aws-managed-oss/amp/ingest-kubecost-metrics)
* [博客 - Integrating Kubecost with Amazon Managed Service for Prometheus](https://aws.amazon.com/blogs/mt/integrating-kubecost-with-amazon-managed-service-for-prometheus/)
