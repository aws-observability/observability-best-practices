# Kubernetes 工作负载资源优化最佳实践
随着 Kubernetes 的采用持续加速，许多组织正在转向基于微服务的架构。最初的关注点大多集中在设计和构建新的云原生架构以支持应用程序。随着环境的增长，我们开始看到客户将重点转向优化资源分配。资源优化是运维团队在安全之后最关注的第二大问题。
让我们讨论如何优化资源分配并在 Kubernetes 环境中对应用程序进行合理的资源配置。这包括在 Amazon EKS 上运行的应用程序，使用托管节点组、自管理节点组和 AWS Fargate 进行部署。

## 在 Kubernetes 上进行应用资源优化的原因
在 Kubernetes 中，资源优化通过设置应用的资源规格来实现。这些设置直接影响：

* 性能 — 如果没有适当的资源规格，Kubernetes 应用将任意竞争资源，这可能对应用性能产生不利影响。
* 成本优化 — 使用过大资源规格部署的应用将导致成本增加和基础设施利用不足。
* 自动扩缩 — Kubernetes Cluster Autoscaler 和 Horizontal Pod Autoscaling 需要资源规格才能正常运行。

Kubernetes 中最常见的资源规格是 [CPU 和内存的 requests 和 limits](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#requests-and-limits)。

## Requests 和 Limits

容器化应用在 Kubernetes 上作为 Pod 部署。CPU 和内存的 requests 和 limits 是 Pod 定义的可选部分。CPU 以 [Kubernetes CPU](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#meaning-of-cpu) 为单位指定，而内存以字节为单位指定，通常为 [mebibytes (Mi)](https://simple.wikipedia.org/wiki/Mebibyte)。

Requests 和 limits 在 Kubernetes 中各自发挥不同的功能，对调度和资源限制的影响也不同。

## 建议
应用所有者需要为其 CPU 和内存资源 requests 选择"正确"的值。理想的方式是在开发环境中对应用进行负载测试，并使用可观测性工具测量资源使用情况。虽然这对您组织中最关键的应用可能有意义，但对集群中部署的每个容器化应用来说可能不太可行。让我们讨论可以帮助我们优化和调整工作负载大小的工具：

### Vertical Pod Autoscaler (VPA)
[VPA](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler) 是由 Autoscaling 特别兴趣小组 (SIG) 拥有的 Kubernetes 子项目。它旨在基于观察到的应用性能自动设置 Pod requests。VPA 默认使用 [Kubernetes Metric Server](https://github.com/kubernetes-sigs/metrics-server) 收集资源使用情况，但也可以选择配置为使用 Prometheus 作为数据源。
VPA 有一个推荐引擎，用于测量应用性能并提出资源配置建议。VPA 推荐引擎可以独立部署，这样 VPA 不会执行任何自动扩缩操作。通过为每个应用创建 VerticalPodAutoscaler 自定义资源来配置，VPA 会在对象的 status 字段中更新资源配置建议。
为集群中的每个应用创建 VerticalPodAutoscaler 对象，然后尝试读取和解释 JSON 结果，在大规模情况下是很有挑战性的。[Goldilocks](https://github.com/FairwindsOps/goldilocks) 是一个使这变得简单的开源项目。

### Goldilocks
Goldilocks 是 Fairwinds 的一个开源项目，旨在帮助组织将 Kubernetes 应用的资源 requests 设置得"恰到好处"。Goldilocks 的默认配置是选择加入模型。您可以通过向 namespace 添加 goldilocks.fairwinds.com/enabled: true 标签来选择监控哪些工作负载。


![Goldilocks-Architecture](../../../../images/goldilocks-architecture.png)

Metrics Server 从运行在工作节点上的 Kubelet 收集资源 metrics，并通过 Metrics API 将其暴露给 Vertical Pod Autoscaler 使用。Goldilocks controller 监视带有 goldilocks.fairwinds.com/enabled: true 标签的 namespace，并为这些 namespace 中的每个工作负载创建 VerticalPodAutoscaler 对象。

要为 namespace 启用资源建议，运行以下命令：

```
kubectl create ns javajmx-sample
kubectl label ns javajmx-sample goldilocks.fairwinds.com/enabled=true
```

要在 Amazon EKS 集群中部署 goldilocks，运行以下命令：

```
helm repo add fairwinds-stable https://charts.fairwinds.com/stable
helm upgrade --install goldilocks fairwinds-stable/goldilocks --namespace goldilocks --create-namespace --set vpa.enabled=true
```

Goldilocks-dashboard 将在端口 8080 上暴露 dashboard，我们可以通过它获取资源建议。运行以下命令来访问 dashboard：

```
kubectl -n goldilocks port-forward svc/goldilocks-dashboard 8080:80
```
然后在浏览器中打开 http://localhost:8080

![Goldilocks-Dashboard](../../../../images/goldilocks-dashboard.png)


让我们分析示例 namespace，查看 Goldilocks 提供的建议。我们应该能够看到 deployment 的建议。
![Goldilocks-Recommendation](../../../../images/goldilocks-recommendation.png)

我们可以看到 javajmx-sample 工作负载的 request 和 limit 建议。每个服务质量 (QoS) 下的 Current 列表示当前配置的 CPU 和内存 request 及 limits。Guaranteed 和 Burstable 列表示相应 QoS 的推荐 CPU 和内存 request limits。

 我们可以清楚地注意到，我们过度配置了资源，Goldilocks 已经给出了优化 CPU 和内存 request 的建议。对于 Guaranteed QoS，CPU request 和 limits 建议为 15m 和 15m，而当前为 100m 和 300m；内存 request 和 limits 建议为 105M 和 105M，而当前为 180Mi 和 300Mi。
您可以简单地复制感兴趣的 QoS 类的相应 manifest 文件，并部署经过合理配置和优化的工作负载。

### 使用 cAdvisor metrics 了解限流并合理配置资源
当我们配置 limits 时，我们是在告诉 Linux 节点特定的容器化应用在特定时间段内可以运行多长时间。我们这样做是为了保护节点上的其他工作负载免受异常进程占用不合理数量 CPU 周期的影响。我们定义的不是主板上的物理"核心"数量；而是在暂停容器以避免压倒其他应用之前，单个容器中的进程或线程组可以运行多长时间。

有一个实用的 cAdvisor metrics 叫做 `container_cpu_cfs_throttled_seconds_total`，它将所有被限流的 5 ms 时间片加在一起，让我们了解进程超出配额的程度。这个 metrics 以秒为单位，所以我们除以 10 得到 100 ms，这是与容器关联的实际时间周期。

用于了解前三个 pod 在 100 ms 时间内 CPU 使用情况的 PromQL 查询。
```
topk(3, max by (pod, container)(rate(container_cpu_usage_seconds_total{image!="", instance="$instance"}[$__rate_interval]))) / 10
```
 观察到 400 ms 的 vCPU 使用量。

![Throttled-Period](../../../../images/throttled-period.png)

PromQL 给出每秒的限流情况，每秒有 10 个周期。要获得每个周期的限流，我们除以 10。如果我们想知道需要增加多少 limits 设置，可以乘以 10（例如，400 ms * 10 = 4000 m）。

虽然上述工具提供了识别资源优化机会的方法，但应用团队应该花时间确定给定应用是 CPU 密集型还是内存密集型，并分配资源以防止限流/过度配置。

