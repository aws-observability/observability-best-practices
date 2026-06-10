# 从 EKS 推送 Metrics 到 Prometheus

在 Amazon Elastic Kubernetes Service (EKS) 上运行容器化工作负载时，您可以利用 AWS Managed Prometheus (AMP) 从应用程序和基础设施中收集和分析 metrics。AMP 通过提供完全托管的 Prometheus 兼容监控解决方案，简化了 Prometheus 兼容监控的部署和管理。

要将 EKS 容器化工作负载的 metrics 推送到 AMP，您可以使用 Managed Prometheus Collector 配置。Managed Prometheus Collector 是 AMP 的一个组件，它从您的应用程序和服务中抓取 metrics，并将其发送到 AMP 工作区进行存储和分析。

![EKS AMP](./images/eksamp.png)
*图 1: 从 EKS 发送 metrics 到 AMP*

## 配置 Managed Prometheus Collector

1. **启用 AMP 工作区**：首先，确保您的 AWS 账户中已创建 AMP 工作区。如果尚未设置 AMP 工作区，请按照 AWS 文档创建一个。

2. **配置 Managed Prometheus Collector**：在您的 AMP 工作区中，导航到"Managed Prometheus Collectors"部分并创建新的 collector 配置。

3. **定义抓取配置**：在 collector 配置中，指定 collector 应从哪些目标抓取 metrics。对于 EKS 工作负载，您可以定义 Kubernetes 服务发现配置，允许 collector 动态发现和抓取 Kubernetes Pod 和 Service 的 metrics。

  Kubernetes 服务发现配置示例：

  ```yaml
  kubernetes_sd_configs:
    - role: pod
      namespaces:
        names:
          - namespace1
          - namespace2
```          
此配置指示 collector 从运行在 namespace1 和 namespace2 Kubernetes namespace 中的 Pod 抓取 metrics。

4. **配置 Prometheus 注解**：要从容器化工作负载启用 metrics 收集，您需要使用适当的 Prometheus 注解来标注 Kubernetes Pod 或 Service。这些注解提供有关 metrics endpoint 和其他配置设置的信息。
Prometheus 注解示例：
```yaml
annotations:
  prometheus.io/scrape: "true"
  prometheus.io/port: "8080"
  prometheus.io/path: "/metrics"
```  
这些注解表明 Prometheus collector 应从 Pod 或 Service 的 8080 端口的 /metrics endpoint 抓取 metrics。

5. **部署带有检测的工作负载**：将容器化工作负载部署到 EKS，确保它们公开适当的 metrics endpoint 并包含必要的 Prometheus 注解。您可以使用 Minikube、Helm 或 AWS Cloud Development Kit (CDK) 等工具来部署和管理 EKS 工作负载。

6. **验证 Metrics 收集**：配置 Managed Prometheus Collector 并部署工作负载后，您应该能在 AMP 工作区中看到收集到的 metrics。您可以使用 AMP 查询编辑器来探索和可视化来自 EKS 工作负载的 metrics。

## 其他注意事项

- 认证和授权：AMP 支持各种认证和授权机制，包括 IAM 角色和 service account，以保护对监控数据的访问安全。

- 与 AWS Observability 服务集成：您可以将 AMP 与其他 AWS observability 服务（如 AWS CloudWatch 和 AWS X-Ray）集成，实现 AWS 环境中的全面 observability。

通过利用 AMP 中的 Managed Prometheus Collector，您可以高效地从 EKS 容器化工作负载中收集和分析 metrics，无需管理和扩展底层 Prometheus 基础设施。AMP 为监控 EKS 应用程序和基础设施提供了完全托管且可扩展的解决方案。
