---
sidebar_position: 6
---

# 集中运营管理

## 什么是集中运营管理？

AWS 提供了[集中运营管理](https://aws.amazon.com/cloudops/centralized-operations-management/)解决方案，您可以使用它来管理和运维 AWS 上、本地、混合环境中以及边缘的应用程序。通过自动化、集成、内置最佳实践和混合功能，从中心位置运维您的应用程序。如果您希望增强 IT 服务管理（ITSM）工具以提高效率和一致性，可以使用 AWS 自动化您当前的集成和投资，同时使用一体化运维工具。

客户使用 [AWS Systems Manager](https://aws.amazon.com/systems-manager/) 来大规模管理和运维本地、混合和 AWS 上的资源。Systems Manager 促进节点（例如 Amazon EC2 实例、其他云上的节点和本地节点）上的运维任务，如使用安全相关更新进行补丁修复、无需管理 SSH 密钥或维护堡垒机即可连接到节点，以及大规模自动化运维命令。在 AWS 中，当节点上有一个完全正常运行的 SSM Agent 在本地、混合或 AWS 上工作时，该节点被视为受管节点。

Systems Manager 的核心功能专注于使用场景。Agent 是利用 AWS Systems Manager 功能的主要组件。一旦节点由 Systems Manager 管理，您就能解锁其他功能，如远程管理、补丁管理和会话管理，同时自动化运维任务。

![AWS Systems Manager](/img/cloudops/guides/centralized-operations-management/BP-SSM-1.png "AWS Systems Manager")
