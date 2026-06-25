# 将 GitOps 和 Grafana Operator 与 Amazon Managed Grafana 配合使用

## 如何使用本指南

本可观测性最佳实践指南面向希望了解如何将 [grafana-operator](https://github.com/grafana-operator/grafana-operator#:~:text=The%20grafana%2Doperator%20is%20a,an%20easy%20and%20scalable%20way.) 作为 Kubernetes operator 部署在 Amazon EKS 集群上，以 Kubernetes 原生方式在 Amazon Managed Grafana 中创建和管理 Grafana 资源和 dashboard 生命周期的开发人员和架构师。

## 简介

客户使用 Grafana 作为开源分析和监控解决方案的可观测性平台。我们看到在 Amazon EKS 上运行工作负载的客户希望将注意力转向工作负载本身，并依赖 Kubernetes 原生控制器来部署和管理外部资源（如云资源）的生命周期。我们看到客户安装 [AWS Controllers for Kubernetes (ACK)](https://aws-controllers-k8s.github.io/community/docs/community/overview/) 来创建、部署和管理 AWS 服务。如今许多客户选择将 Prometheus 和 Grafana 实现卸载到托管服务，在 AWS 中这些服务是 [Amazon Managed Service for Prometheus](https://docs.aws.amazon.com/prometheus/?icmpid=docs_homepage_mgmtgov) 和 [Amazon Managed Grafana](https://docs.aws.amazon.com/grafana/?icmpid=docs_homepage_mgmtgov)，用于监控其工作负载。

客户在使用 Grafana 时面临的一个常见挑战是，如何从 Kubernetes 集群中在外部 Grafana 实例（如 Amazon Managed Grafana）中创建和管理 Grafana 资源和 dashboard 的生命周期。客户在寻找方法来完全自动化和管理整个系统的基础设施和应用程序部署（包括在 Amazon Managed Grafana 中创建 Grafana 资源）时面临挑战，希望使用基于 Git 的工作流。在本可观测性最佳实践指南中，我们将重点关注以下主题：

* Grafana Operator 简介 - 一个从 Kubernetes 集群管理外部 Grafana 实例的 Kubernetes operator
* GitOps 简介 - 使用基于 Git 的工作流创建和管理基础设施的自动化机制
* 在 Amazon EKS 上使用 Grafana Operator 管理 Amazon Managed Grafana
* 在 Amazon EKS 上使用 GitOps 与 Flux 管理 Amazon Managed Grafana

## Grafana Operator 简介

[grafana-operator](https://github.com/grafana-operator/grafana-operator#:~:text=The%20grafana%2Doperator%20is%20a,an%20easy%20and%20scalable%20way.) 是一个为帮助您在 Kubernetes 内管理 Grafana 实例而构建的 Kubernetes operator。Grafana Operator 使您能够以声明式方式在多个实例之间轻松且可扩展地管理和创建 Grafana dashboard、datasources 等。Grafana operator 现在支持管理托管在外部环境（如 Amazon Managed Grafana）上的 dashboard、datasources 等资源。这最终使我们能够使用 CNCF 项目（如 [Flux](https://fluxcd.io/)）的 GitOps 机制从 Amazon EKS 集群创建和管理 Amazon Managed Grafana 中资源的生命周期。

## GitOps 简介

### 什么是 GitOps 和 Flux

GitOps 是一种软件开发和运维方法论，使用 Git 作为部署配置的唯一事实来源。它涉及将应用程序或基础设施的期望状态保存在 Git 仓库中，并使用基于 Git 的工作流来管理和部署变更。GitOps 是一种管理应用程序和基础设施部署的方式，使整个系统在 Git 仓库中以声明式方式描述。它是一种运维模型，为您提供利用版本控制、不可变制品和自动化最佳实践来管理多个 Kubernetes 集群状态的能力。

Flux 是一个 GitOps 工具，可以自动化 Kubernetes 上应用程序的部署。它通过持续监控 Git 仓库的状态并将任何变更应用到集群来工作。Flux 与 GitHub、[GitLab](https://dzone.com/articles/auto-deploy-spring-boot-app-using-gitlab-cicd/) 和 Bitbucket 等各种 Git 提供商集成。当仓库发生变更时，Flux 会自动检测并相应地更新集群。

### 使用 Flux 的优势

* **自动化部署**：Flux 自动化了部署过程，减少了人为错误，让开发人员可以专注于其他任务。
* **基于 Git 的工作流**：Flux 利用 Git 作为事实来源，使跟踪和回滚变更更加容易。
* **声明式配置**：Flux 使用 [Kubernetes](https://dzone.com/articles/kubernetes-full-stack-example-with-kong-ingress-co/) manifests 来定义集群的期望状态，使管理和跟踪变更更加容易。

### 采用 Flux 的挑战

* **有限的自定义**：Flux 仅支持有限的自定义集，可能不适用于所有用例。
* **学习曲线陡峭**：Flux 对新用户有较陡的学习曲线，需要对 Kubernetes 和 Git 有深入的了解。

## 在 Amazon EKS 上使用 Grafana Operator 管理 Amazon Managed Grafana 中的资源

如前所述，Grafana Operator 使我们能够使用 Kubernetes 集群以 Kubernetes 原生方式在 Amazon Managed Grafana 中创建和管理资源的生命周期。下面的架构图演示了如何将 Kubernetes 集群作为控制平面，使用 Grafana Operator 从 Amazon EKS 集群以 Kubernetes 原生方式设置与 AMG 的身份认证、将 Amazon Managed Service for Prometheus 添加为数据源以及在 Amazon Managed Grafana 上创建 dashboard。

![GitOPS-WITH-AMG-2](../../../images/Operational/gitops-with-amg/gitops-with-amg-2.jpg)

请参阅我们的博文 [Using Open Source Grafana Operator on your Kubernetes cluster to manage Amazon Managed Grafana](https://aws.amazon.com/blogs/mt/using-open-source-grafana-operator-on-your-kubernetes-cluster-to-manage-amazon-managed-grafana/)，了解如何在 Amazon EKS 集群上部署上述解决方案的详细演示。

## 在 Amazon EKS 上使用 GitOps 与 Flux 管理 Amazon Managed Grafana 中的资源

如上所述，Flux 自动化了 Kubernetes 上应用程序的部署。它通过持续监控 Git 仓库（如 GitHub）的状态来工作，当仓库发生变更时，Flux 会自动检测并相应地更新集群。请参考以下架构，我们将演示如何从 Kubernetes 集群使用 Grafana Operator 和使用 Flux 的 GitOps 机制，以 Kubernetes 原生方式将 Amazon Managed Service for Prometheus 添加为数据源并在 Amazon Managed Grafana 中创建 dashboard。

![GitOPS-WITH-AMG-1](../../../images/Operational/gitops-with-amg/gitops-with-amg-1.jpg)

请参阅我们的 https://catalog.workshops.aws/observability/en-US/aws-managed-oss/gitops-with-amg 模块 - [GitOps with Amazon Managed Grafana](https://catalog.workshops.aws/observability/en-US/aws-managed-oss/gitops-with-amg)。此模块在您的 EKS 集群上设置所需的"Day 2"运维工具，包括：

* [External Secrets Operator](https://github.com/external-secrets/external-secrets/tree/main/deploy/charts/external-secrets) 已成功安装，用于从 AWS Secret Manager 读取 Amazon Managed Grafana 密钥
* [Prometheus Node Exporter](https://github.com/prometheus/node_exporter) 用于测量各种机器资源，如内存、磁盘和 CPU 利用率
* [Grafana Operator](https://github.com/grafana-operator/grafana-operator) 用于使用 Kubernetes 集群以 Kubernetes 原生方式在 Amazon Managed Grafana 中创建和管理资源的生命周期
* [Flux](https://fluxcd.io/) 用于使用 GitOps 机制自动化 Kubernetes 上应用程序的部署

## 总结

在本可观测性最佳实践指南的这一部分中，我们了解了如何将 Grafana Operator 和 GitOps 与 Amazon Managed Grafana 配合使用。我们从学习 GitOps 和 Grafana Operator 开始。然后重点介绍了如何在 Amazon EKS 上使用 Grafana Operator 管理 Amazon Managed Grafana 中的资源，以及如何在 Amazon EKS 上使用 GitOps 与 Flux 管理 Amazon Managed Grafana 中的资源，以 Kubernetes 原生方式设置与 AMG 的身份认证、在 Amazon Managed Grafana 上从 Amazon EKS 集群添加 AWS 数据源。
