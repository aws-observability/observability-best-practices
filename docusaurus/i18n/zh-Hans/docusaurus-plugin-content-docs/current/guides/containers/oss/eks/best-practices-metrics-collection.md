# EKS 可观测性：关键 Metrics

# 现状

监控被定义为一种解决方案，使基础设施和应用所有者能够查看和了解其系统的历史和当前状态，重点在于收集定义好的 metrics 或 logs。

监控多年来一直在演进。我们从使用调试和转储 logs 来调试和排查问题开始，到使用 syslogs、top 等命令行工具进行基本监控，再到能够在 dashboard 中将其可视化。在云计算出现和规模增长的背景下，我们今天跟踪的内容比以往任何时候都多。行业已经更多地转向可观测性，它被定义为一种允许基础设施和应用所有者主动排查和调试其系统的解决方案。可观测性更关注从 metrics 中得出的模式。


# Metrics，为什么重要？

Metrics 是一系列按照创建时间排序的数值。它们用于跟踪从您环境中的服务器数量、磁盘使用情况、每秒处理的请求数到完成这些请求的延迟等各种信息。Metrics 是告诉您系统运行状况的数据。无论您运行的是小型还是大型集群，获取系统健康和性能的洞察可以帮助您识别改进领域、排查和追踪问题的能力，以及整体提升工作负载的性能和效率。这些变化可以影响您在集群上花费的时间和资源，直接转化为成本。


# Metrics 收集

从 EKS 集群收集 metrics 由[三个组件](https://aws-observability.github.io/aws-observability/recipes/telemetry/)组成：

1. 来源：metrics 的来源，如本指南中列出的那些。
2. 代理：在 EKS 环境中运行的应用（通常称为代理），收集 metrics 监控数据并将此数据推送到第二个组件。此组件的一些示例包括 [AWS Distro for OpenTelemetry (ADOT)](https://aws-otel.github.io/) 和 [CloudWatch Agent](https://aws-observability.github.io/aws-observability/tools/cloudwatch_agent/)
3. 目标：监控数据存储和分析解决方案，此组件通常是针对[时间序列格式数据](https://aws-observability.github.io/aws-observability/signals/metrics/)优化的数据服务。此组件的一些示例包括 [Amazon Managed Service for Prometheus](https://aws.amazon.com/prometheus/) 和 [AWS CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/deploy-container-insights-EKS.html)。

注意：在本节中，配置示例是指向 [aws-observability](https://aws-observability.github.io/terraform-aws-aws-observability/) 相关章节的链接。这是为了确保您获得关于 EKS metrics 收集实现的最新指导和示例。

## 托管开源解决方案

[AWS Distro for OpenTelemetry (ADOT)](https://aws-otel.github.io/) 是 [OpenTelemetry](https://opentelemetry.io/) 项目的受支持版本，使用户能够将相关的 metrics 和 traces 发送到各种监控数据收集解决方案，如 [Amazon Managed Service for Prometheus](https://aws.amazon.com/prometheus/) 和 [AWS CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/deploy-container-insights-EKS.html)。ADOT 可以通过 [EKS Managed Add-ons](https://docs.aws.amazon.com/eks/latest/userguide/eks-add-ons.html) 安装到 EKS 集群上，并配置收集 metrics（如本页所列）和工作负载 traces。AWS 已验证 ADOT 附加组件与 Amazon EKS 兼容，并定期更新最新的错误修复和安全补丁。[ADOT 最佳实践和更多信息。](https://aws-observability.github.io/aws-observability/guides/operational/adot-at-scale/operating-adot-collector/)


## ADOT + AMP

使用 AWS Distro for OpenTelemetry (ADOT)、Amazon Managed Service for Prometheus (AMP) 和 Amazon Managed Service for Grafana (AMG) 快速启动并运行的最佳方式是利用 aws-observability 的[基础设施监控示例](https://aws-observability.github.io/terraform-aws-aws-observability/eks/)。加速器示例在您的环境中部署工具和服务，并提供开箱即用的 metrics 收集、告警规则和 Grafana dashboard。

请参阅 AWS 文档了解有关安装、配置和操作 [EKS Managed Add-on for ADOT](https://docs.aws.amazon.com/eks/latest/userguide/opentelemetry.html) 的更多信息。

### 来源

EKS metrics 来自整体解决方案不同层级的多个位置。下表总结了关键 metrics 部分中提到的 metrics 来源。


|层级	|来源	|工具	|安装和更多信息	|Helm Chart	|
|---	|---	|---	|---	|---	|
|Control Plane	|*api server endpoint*/metrics	|不适用 - api server 直接以 prometheus 格式暴露 metrics 	|https://docs.aws.amazon.com/eks/latest/userguide/prometheus.html	|不适用	|
|Cluster State	|*kube-state-metrics-http-endpoint*:8080/metrics	|kube-state-metrics	|https://github.com/kubernetes/kube-state-metrics#overview	|https://github.com/kubernetes/kube-state-metrics#helm-chart	|
|Kube Proxy	|*kube-proxy-http*:10249/metrics	|不适用 - kube proxy 直接以 prometheus 格式暴露 metrics	|https://kubernetes.io/docs/reference/command-line-tools-reference/kube-proxy/	|不适用	|
|VPC CNI	|*vpc-cni-metrics-helper*/metrics	|cni-metrics-helper	|https://github.com/aws/amazon-vpc-cni-k8s/blob/master/cmd/cni-metrics-helper/README.md	|https://github.com/aws/amazon-vpc-cni-k8s/tree/master/charts/cni-metrics-helper	|
|Core DNS	|*core-dns*:9153/metrics	|不适用 - core DNS 直接以 prometheus 格式暴露 metrics	|https://github.com/coredns/coredns/tree/master/plugin/metrics	|不适用	|
|Node	|*prom-node-exporter-http*:9100/metrics	|prom-node-exporter	|https://github.com/prometheus/node_exporter
https://prometheus.io/docs/guides/node-exporter/#node-exporter-metrics	|https://github.com/prometheus-community/helm-charts/tree/main/charts/prometheus-node-exporter	|
|Kubelet/Pod	|*kubelet*/metrics/cadvisor	|kubelet 或通过 api server 代理 	|https://kubernetes.io/docs/concepts/cluster-administration/system-metrics/	|不适用	|

### 代理：AWS Distro for OpenTelemetry

AWS 推荐通过 AWS EKS ADOT 托管附加组件在 EKS 集群上安装、配置和操作 ADOT。此附加组件利用 ADOT operator/collector 自定义资源模型，允许您在集群上部署、配置和管理多个 ADOT collector。有关此附加组件的安装、高级配置和操作的详细信息，请查看此[文档](https://aws-otel.github.io/docs/getting-started/adot-eks-add-on)。

注意：AWS EKS ADOT 托管附加组件的 Web 控制台可用于 [ADOT 附加组件的高级配置](https://docs.aws.amazon.com/eks/latest/userguide/deploy-collector-advanced-configuration.html)。

ADOT collector 配置有两个组件。

1. [collector 配置](https://github.com/aws-observability/aws-otel-community/blob/master/sample-configs/operator/collector-config-amp.yaml)，包括 collector 部署模式（deployment、daemonset 等）。
2. [OpenTelemetry Pipeline 配置](https://opentelemetry.io/docs/collector/configuration/)，包括 metrics 收集所需的 receivers、processors 和 exporters。示例配置片段：

```
config: |
    extensions:
      sigv4auth:
        region: <YOUR_AWS_REGION>
        service: "aps"

    receivers:
      #
      # Scrape configuration for the Prometheus Receiver
      # This is the same configuration used when Prometheus is installed using the community Helm chart
      #  
      prometheus:
        config:
          global:
            scrape_interval: 60s
            scrape_timeout: 10s

          scrape_configs:
          - job_name: kubernetes-apiservers
            bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token
            kubernetes_sd_configs:
            - role: endpoints
            relabel_configs:
            - action: keep
              regex: default;kubernetes;https
              source_labels:
              - __meta_kubernetes_namespace
              - __meta_kubernetes_service_name
              - __meta_kubernetes_endpoint_port_name
            scheme: https
            tls_config:
              ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
              insecure_skip_verify: true

              ...
              ...

    exporters:
      prometheusremotewrite:
        endpoint: <YOUR AMP WRITE ENDPOINT URL>
        auth:
          authenticator: sigv4auth
      logging:
        loglevel: warn
    extensions:
      sigv4auth:
        region: <YOUR_AWS_REGION>
        service: aps
      health_check:
      pprof:
        endpoint: :1888
      zpages:
        endpoint: :55679
    processors:
      batch/metrics:
        timeout: 30s
        send_batch_size: 500
    service:
      extensions: [pprof, zpages, health_check, sigv4auth]
      pipelines:
        metrics:
          receivers: [prometheus]
          processors: [batch/metrics]
          exporters: [logging, prometheusremotewrite]
```

完整的最佳实践 collector 配置、ADOT pipeline 配置和 Prometheus 抓取配置可以在 [可观测性 Accelerator 的 Helm Chart](https://github.com/aws-observability/terraform-aws-aws-observability/blob/main/modules/eks-monitoring/otel-config/templates/opentelemetrycollector.yaml) 中找到。


### 目标：Amazon Managed Service for Prometheus

ADOT collector pipeline 利用 Prometheus Remote Write 功能将 metrics 导出到 AMP 实例。示例配置片段，注意 AMP WRITE ENDPOINT URL

```
    exporters:
      prometheusremotewrite:
        endpoint: <YOUR AMP WRITE ENDPOINT URL>
        auth:
          authenticator: sigv4auth
      logging:
        loglevel: warn
```

完整的最佳实践 collector 配置、ADOT pipeline 配置和 Prometheus 抓取配置可以在 [可观测性 Accelerator 的 Helm Chart](https://github.com/aws-observability/terraform-aws-aws-observability/blob/main/modules/eks-monitoring/otel-config/templates/opentelemetrycollector.yaml) 中找到。

AMP 配置和使用的最佳实践在[此处](https://aws-observability.github.io/aws-observability/recipes/amp/)。

# 哪些是相关的 metrics？

只有少数 metrics 可用的日子已经过去了，如今情况恰恰相反，有数百个 metrics 可用。能够确定哪些是相关的 metrics 对于构建具有可观测性优先思维的系统非常重要。

本指南概述了可供您使用的不同 metrics 分组，并解释了在为基础设施和应用构建可观测性时应关注哪些 metrics。下面列出的 metrics 是我们基于最佳实践推荐监控的 metrics 列表。

以下各节中列出的 metrics 是对 [aws-observability Grafana Dashboards](https://github.com/aws-observability/terraform-aws-aws-observability/tree/main/modules/eks-monitoring) 和 [Kube Prometheus Stack Dashboards](https://monitoring.mixins.dev/) 中突出显示的 metrics 的补充。

## Control Plane Metrics

Amazon EKS control plane 由 AWS 为您管理，运行在 AWS 管理的账户中。它由运行 Kubernetes 组件（如 etcd 和 Kubernetes API server）的 control plane 节点组成。Kubernetes 发布各种事件以使用户了解集群中的活动，例如启动和终止 pod、deployment、namespace 等。Amazon EKS control plane 是一个关键组件，您需要对其进行跟踪，以确保核心组件能够正常运行并执行集群所需的基本活动。

Control Plane API Server 暴露了数千个 metrics，下表列出了我们建议监控的关键 control plane metrics。

|名称	|Metric	|描述	|原因	|
|---	|---	|---	|---	|
|API Server 总请求数	|apiserver_request_total	|按动词、dry run 值、组、版本、资源、范围、组件和 HTTP 响应码分类的 apiserver 请求计数器。	|	|
|API Server 延迟	|apiserver_request_duration_seconds	|按动词、dry run 值、组、版本、资源、子资源、范围和组件分类的响应延迟分布（秒）。	|	|
|请求延迟	|rest_client_request_duration_seconds	|请求延迟（秒）。按动词和 URL 分类。	|	|
|总请求数	|rest_client_requests_total	|HTTP 请求数，按状态码、方法和主机分类。	|	|
|API Server 请求持续时间	|apiserver_request_duration_seconds_bucket	|测量每个到 Kubernetes API server 的请求延迟（秒）	|	|
|API server 请求延迟总和	|apiserver_request_latencies_sum	|跟踪 K8 API server 处理请求总时间的累积计数器	|	|
|API server 注册的 watchers	|apiserver_registered_watchers	|给定资源当前注册的 watchers 数量	|	|
|API server 对象数量	|apiserver_storage_object	|上次检查时按类型分类的存储对象数量。	|	|
|Admission controller 延迟	|apiserver_admission_controller_admission_duration_seconds	|Admission controller 延迟直方图（秒），按名称标识，按操作和 API 资源及类型（validate 或 admit）分类。	|	|
|Etcd 延迟	|etcd_request_duration_seconds	|按操作和对象类型分类的 Etcd 请求延迟（秒）。	|	|
|Etcd 数据库大小	|apiserver_storage_db_total_size_in_bytes	|Etcd 数据库大小。	|这有助于您主动监控 etcd 数据库使用情况，避免超出限制。	|

## Cluster State metrics

Cluster State Metrics 由 `kube-state-metrics` (KSM) 生成。KSM 是一个作为 pod 在集群中运行的实用工具，监听 Kubernetes API Server，以 Prometheus metrics 的形式为您提供集群状态和 Kubernetes 对象的洞察。在这些 metrics 可用之前需要[安装](https://github.com/kubernetes/kube-state-metrics) KSM。这些 metrics 被 Kubernetes 用于有效地进行 pod 调度，重点关注内部各种对象（如 deployment、replica sets、nodes 和 pods）的健康状况。Cluster state metrics 暴露 pod 的状态、容量和可用性信息。跟踪集群执行调度任务的情况对于了解性能、提前发现问题和监控集群健康至关重要。下表列出了应跟踪的关键 metrics。

|名称	|Metric	|描述	|
|---	|---	|---	|
|节点状态	|kube_node_status_condition	|节点的当前健康状态。返回一组节点条件和每个条件的 `true`、`false` 或 `unknown`	|
|期望 pods	|kube_deployment_spec_replicas 或 kube_daemonset_status_desired_number_scheduled	|为 Deployment 或 DaemonSet 指定的 pod 数量	|
|当前 pods	|kube_deployment_status_replicas 或 kube_daemonset_status_current_number_scheduled	|Deployment 或 DaemonSet 中当前运行的 pod 数量	|
|Pod 容量	|kube_node_status_capacity_pods	|节点上允许的最大 pod 数	|
|可用 pods	|kube_deployment_status_replicas_available 或 kube_daemonset_status_number_available	|Deployment 或 DaemonSet 中当前可用的 pod 数量	|
|不可用 pods	|kube_deployment_status_replicas_unavailable 或 kube_daemonset_status_number_unavailable	|Deployment 或 DaemonSet 中当前不可用的 pod 数量	|
|Pod 就绪状态	|kube_pod_status_ready	|pod 是否准备好为客户端请求提供服务	|
|Pod 状态	|kube_pod_status_phase	|pod 的当前状态；值为 pending/running/succeeded/failed/unknown	|
|Pod 等待原因	|kube_pod_container_status_waiting_reason	|容器处于等待状态的原因	|
|Pod 终止状态	|kube_pod_container_status_terminated	|容器当前是否处于终止状态	|
|等待调度的 Pods	|pending_pods	|等待节点分配的 pod 数量	|
|Pod 调度尝试次数	|pod_scheduling_attempts	|进行 pod 调度的尝试次数	|

## Cluster Add-on Metrics

Cluster add-on 是为 Kubernetes 应用提供支持性运维能力的软件。这包括可观测性代理或允许集群与底层 AWS 网络、计算和存储资源交互的 Kubernetes 驱动程序等软件。Add-on 软件通常由 Kubernetes 社区、AWS 等云提供商或第三方供应商构建和维护。Amazon EKS 会为每个集群自动安装自管理的 add-on，如 Amazon VPC CNI plugin for Kubernetes、`kube-proxy` 和 CoreDNS。

这些 Cluster add-on 在网络、域名解析等不同领域提供运维支持。它们为您提供关键支持基础设施和组件如何运行的洞察。跟踪 add-on metrics 对于了解集群的运维健康状况非常重要。

以下是您应该考虑监控的关键 add-on 及其核心 metrics。

## Amazon VPC CNI Plugin

Amazon EKS 通过 Amazon VPC Container Network Interface (VPC CNI) 插件实现集群网络。CNI 插件允许 Kubernetes Pod 拥有与 VPC 网络上相同的 IP 地址。更具体地说，Pod 内的所有容器共享一个网络 namespace，它们可以使用本地端口相互通信。VPC CNI add-on 使您能够持续确保 Amazon EKS 集群的安全性和稳定性，并减少安装、配置和更新 add-on 所需的工作量。

VPC CNI add-on metrics 由 CNI Metrics Helper 暴露。监控 IP 地址分配对于确保集群健康和避免 IP 耗尽问题至关重要。[这里是最新的网络最佳实践和要收集监控的 VPC CNI metrics](https://aws.github.io/aws-eks-best-practices/networking/vpc-cni/#monitor-ip-address-inventory)。

## CoreDNS Metrics

CoreDNS 是一个灵活的、可扩展的 DNS 服务器，可以作为 Kubernetes 集群 DNS。CoreDNS pod 为集群中的所有 pod 提供名称解析。运行 DNS 密集型工作负载有时会因 DNS 限流而遇到间歇性 CoreDNS 故障，这可能影响应用。

查看跟踪关键 [CoreDNS 性能 metrics 的最新最佳实践](https://aws.github.io/aws-eks-best-practices/reliability/docs/dataplane/#monitor-coredns-metrics)和[监控 CoreDNS 流量以发现 DNS 限流问题](https://aws.github.io/aws-eks-best-practices/networking/monitoring/)


## Pod/Container Metrics

跟踪应用所有层级的使用情况非常重要，这包括仔细查看集群内运行的节点和 pod。在 pod 维度可用的所有 metrics 中，以下 metrics 列表对您了解集群上运行的工作负载状态具有实际用途。跟踪 CPU、内存和网络使用情况有助于诊断和排查应用相关问题。跟踪工作负载 metrics 可让您了解资源利用率，以便合理调整在 EKS 上运行的工作负载。

|Metric	|示例 PromQL 查询	|维度	|
|---	|---	|---	|
|每个 namespace 运行的 pods 数	|count by(namespace) (kube_pod_info)	|每集群按 Namespace	|
|每个 pod 每个容器的 CPU 使用率	|sum(rate(container_cpu_usage_seconds_total\{container!=""\}[5m])) by (namespace, pod)	|每集群按 Namespace 按 Pod	|
|每个 pod 的内存利用率	|sum(container_memory_usage_bytes\{container!=""\}) by (namespace, pod)	|每集群按 Namespace 按 Pod	|
|每个 pod 接收的网络字节数	|sum by(pod) (rate(container_network_receive_bytes_total[5m]))	|每集群按 Namespace 按 Pod	|
|每个 pod 传输的网络字节数	|sum by(pod) (rate(container_network_transmit_bytes_total[5m]))	|每集群按 Namespace 按 Pod	|
|每个容器的重启次数	|increase(kube_pod_container_status_restarts_total[15m]) > 3	|每集群按 Namespace 按 Pod	|

## Node Metrics

Kube State Metrics 和 Prometheus node exporter 收集集群中节点的 metrics 统计信息。跟踪节点的状态、CPU 使用率、内存、文件系统和流量对于了解节点利用率非常重要。了解节点资源的利用情况对于正确选择实例类型和存储以有效运行您期望在集群上运行的工作负载类型至关重要。以下 metrics 是您应该跟踪的一些关键 metrics。


|Metric	|示例 PromQL 查询	|维度	|
|---	|---	|---	|
|节点 CPU 利用率	|sum(rate(container_cpu_usage_seconds_total\{container!=""\}[5m])) by (node)	|每集群按 Node	|
|节点内存利用率	|sum(container_memory_usage_bytes\{container!=""\}) by (node)	|每集群按 Node	|
|节点网络总字节数	|sum by (instance) (rate(node_network_receive_bytes_total[3m]))+sum by (instance) (rate(node_network_transmit_bytes_total[3m]))	|每集群按 Node	|
|节点 CPU 预留容量	|sum(kube_node_status_capacity\{cluster!=""\}) by (node)	|每集群按 Node	|
|每个节点运行的 Pod 数	|sum(kubelet_running_pods) by (instance)	|每集群按 Node	||节点文件系统使用率	|rate(container_fs_reads_bytes_total\{job="kubelet", device=~"mmcblk.p.+|.*nvme.+|rbd.+|sd.+|vd.+|xvd.+|dm-.+|dasd.+", container!="", cluster="", namespace!=""\}[$__rate_interval]) + rate(container_fs_writes_bytes_total\{job="kubelet", device=~"mmcblk.p|.*nvme.+|rbd.+|sd.+|vd.+|xvd.+|dm-.+|dasd.+",container!="", cluster="", namespace!=""\}	|每集群按 Node	|
|集群 CPU 利用率	|sum(rate(node_cpu_seconds_total\{mode!="idle",mode!="iowait",mode!="steal"\}[5m]))	|每集群	|
|集群内存利用率	|1 - sum(:node_memory_MemAvailable_bytes:sum\{cluster=""\}) / sum(node_memory_MemTotal_bytes\job="node-exporter",cluster=""\})	|每集群	|
|集群网络总字节数	|sum(rate(node_network_receive_bytes_total[3m]))+sum(rate(node_network_transmit_bytes_total[3m]))	|每集群	|
|运行的 Pod 数	|sum(kubelet_running_pod_count\{cluster=""\})	|每集群	|
|运行的容器数	|sum(kubelet_running_container_count\{cluster=""\})	|每集群	|
|集群 CPU 限制	|sum(kube_node_status_allocatable\{resource="cpu"\})	|每集群	|
|集群内存限制	|sum(kube_node_status_allocatable\{resource="memory"\})	|每集群	|
|集群节点数	|count(kube_node_info) OR sum(kubelet_node_name\{cluster=""\})	|每集群	|

# 其他资源

## AWS 服务

[https://aws-otel.github.io/](https://aws-otel.github.io/)

[https://aws.amazon.com/prometheus](https://aws.amazon.com/prometheus)

[https://aws.amazon.com/cloudwatch/features/](https://aws.amazon.com/cloudwatch/features/)

## 博客

[https://aws.amazon.com/blogs/containers/](https://aws.amazon.com/blogs/containers/)

[https://aws.amazon.com/blogs/containers/metrics-and-traces-collection-using-amazon-eks-add-ons-for-aws-distro-for-opentelemetry/](https://aws.amazon.com/blogs/containers/metrics-and-traces-collection-using-amazon-eks-add-ons-for-aws-distro-for-opentelemetry/)

[https://aws.amazon.com/blogs/containers/](https://aws.amazon.com/blogs/containers/)

[https://aws.amazon.com/blogs/containers/introducing-amazon-cloudwatch-container-insights-for-amazon-eks-fargate-using-aws-distro-for-opentelemetry/](https://aws.amazon.com/blogs/containers/introducing-amazon-cloudwatch-container-insights-for-amazon-eks-fargate-using-aws-distro-for-opentelemetry/)

## 基础设施即代码资源

[https://github.com/aws-observability/terraform-aws-observability-accelerator](https://github.com/aws-observability/terraform-aws-observability-accelerator)

[https://github.com/aws-ia/terraform-aws-eks-blueprints](https://github.com/aws-ia/terraform-aws-eks-blueprints)
