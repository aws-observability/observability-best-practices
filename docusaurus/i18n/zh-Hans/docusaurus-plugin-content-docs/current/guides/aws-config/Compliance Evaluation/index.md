---
sidebar_position: 3
---
# 合规性评估

AWS Config 提供两种主要的规则类型来评估 AWS 环境中的资源配置。第一种类型是[托管规则](https://docs.aws.amazon.com/config/latest/developerguide/managed-rules-by-aws-config.html)，是 AWS 提供的预构建规则，涵盖各种安全、运维和合规用例。托管规则是预配置的规则模板，用于根据最佳实践和常见合规标准评估您的 AWS 资源。第二种类型是[自定义规则](https://docs.aws.amazon.com/config/latest/developerguide/evaluate-config_develop-rules.html)，允许组织创建自己的规则，使其能够实施特定于组织的合规要求和检查。

自定义规则可以通过 AWS Lambda 函数创建，您可以编写评估 AWS 资源是否合规的逻辑。AWS Config 还允许[使用 Guard 自定义策略创建自定义规则](https://aws.amazon.com/blogs/mt/announcing-aws-config-custom-rules-using-guard-custom-policy/)。[Guard 自定义策略](https://docs.aws.amazon.com/config/latest/developerguide/evaluate-config_develop-rules.html)简化了创建自定义规则的过程，因为您无需创建 Lambda 函数。Guard 自定义策略允许您定义策略即代码，使用 [Guard 领域特定语言 (DSL)](https://docs.aws.amazon.com/cfn-guard/latest/ug/writing-rules.html) 根据定义的策略评估资源。

AWS Config 与 [Systems Manager 自动化文档](https://aws.amazon.com/blogs/mt/remediate-noncompliant-aws-config-rules-with-aws-systems-manager-automation-runbooks/)原生集成，用于修复操作。您可以使用 AWS Systems Manager 自动化文档创建自己的自定义修复操作，并可以选择通过 AWS Config 进行手动或自动修复。

此外，AWS 还提供[服务关联规则](https://docs.aws.amazon.com/config/latest/developerguide/service-linked-rules.html)，这些规则由其他 AWS 服务自动创建和管理，用于评估特定于这些服务的资源配置。例如，AWS Security Hub 可以在 AWS Config 中创建服务关联规则来评估安全最佳实践和标准。您还可以部署[组织规则](https://docs.aws.amazon.com/config/latest/developerguide/config-rule-multi-account-deployment.html)，允许您跨 AWS Organizations 结构中的多个账户部署和管理规则，更轻松地在整个 AWS 环境中维护一致的合规性。

### 合规包：

与将托管规则或自定义规则单独部署到特定区域和账户不同，最佳实践是将它们捆绑到[合规包](https://docs.aws.amazon.com/config/latest/developerguide/conformance-packs.html)中。AWS 合规包提供单一控制点来跨多个账户和区域部署和监控数百条规则，确保大规模一致的安全和合规标准。它们提供[常见框架的预构建模板](https://docs.aws.amazon.com/config/latest/developerguide/conformancepack-sample-templates.html)（如 HIPAA、NIST、PCI-DSS），并允许创建自定义规则，显著减少合规管理所需的时间和精力。这些包代表了不可变的 Config 规则组，确保只能通过对合规包本身的正式更新来进行更改。这种方法为合规规则提供了更好的治理和控制。


#### 组织部署：

AWS 使您能够利用组织合规包在 AWS Organization 中自动部署。此功能扩展到合规包和单个 Config 规则。AWS Config 还支持委托管理员功能，允许您指定特定账户来管理跨组织的合规包部署。请按照此文档[使用委托管理员部署合规包](https://aws.amazon.com/blogs/mt/deploy-aws-config-rules-and-conformance-packs-using-a-delegated-admin/)，维护不可变性等优势。


### AWS Config Rules Development Kit (RDK)

AWS Config [Rules Development Kit](https://github.com/awslabs/aws-config-rdk) (RDK) 可在 AWS samples GitHub 仓库中获取，简化了自定义 Config 规则的创建。它提供样板代码模板，只需最少的修改即可实现资源评估。RDK 支持各种部署场景，包括上述的集中化 Lambda 函数方法。

请参阅此博文了解如何使用 AWS Config RDK [大规模构建和运维自定义 AWS Config 规则](https://aws.amazon.com/blogs/mt/aws-config-rule-development-kit-library-build-and-operate-rules-at-scale/)。

#### 集中化 Lambda 函数

在需要多个自定义规则的多账户环境中，建议将 Lambda 函数集中在单个账户（如安全或合规账户）中。其他账户的自定义规则可以调用这些集中化的函数。

### 全局资源管理

对于评估全局资源（如 IAM 规则）的规则，仅在一个区域中部署它们以避免重复成本和冗余 API 调用。此做法优化了成本效率和资源利用率，同时维持有效的合规监控。


### 评估管理

在管理规则评估时，请注意删除评估结果或触发重新评估的选项。频繁使用这些功能将为资源生成新的[配置项](https://docs.aws.amazon.com/config/latest/APIReference/API_ConfigurationItem.html)，可能影响存储和处理需求。



## 跨账户聚合和查询

随着组织在多个区域和账户中启用 AWS Config，集中数据以获得全面可见性和管理变得至关重要。[AWS Config 聚合器](https://docs.aws.amazon.com/config/latest/developerguide/aggregate-data.html)提供免费功能，将来自各个区域和账户的配置相关数据整合到单个指定的聚合器账户中。这种集中化提供了 AWS 环境的统一视图，使跨组织监控 Config 规则评估、合规包评估和整体合规状态更加容易。要部署组织范围的聚合器，[请按照此博文操作](https://aws.amazon.com/blogs/mt/org-aggregator-delegated-admin/)。

中心账户中的聚合数据解锁了[高级查询](https://docs.aws.amazon.com/config/latest/developerguide/querying-AWS-resources.html)功能。此功能允许您跨 AWS 环境执行复杂查询，提供资源配置和合规状态的洞察。例如，您可以使用简单的类 SQL 语法轻松识别跨账户的所有未附加 EBS 卷。这些高级查询提供运维和合规相关数据，增强您有效管理和优化 AWS 基础设施的能力。

S3 中的 [AWS Config 配置快照数据](https://docs.aws.amazon.com/config/latest/developerguide/deliver-snapshot-cli.html)可以使用 [Amazon Athena](https://aws.amazon.com/athena/) 查询，客户可以使用 [Amazon QuickSight](https://aws.amazon.com/quicksight) 创建自定义可视化。要了解如何聚合 AWS Config 数据、执行高级查询和创建自定义清单 dashboard，[请按照 AWS Config 监控研讨会操作](https://catalog.workshops.aws/cloudops-accelerator/en-US/inventory/monitoring-resources-with-aws-config)。另请参阅 [AWS Config 资源合规 Dashboard](https://catalog.workshops.aws/awscid/en-US/dashboards/additional/config-resource-compliance-dashboard#aws-config-aggregator-dashboard) 研讨会，展示如何[在 AWS Organizations 上部署 AWS Config dashboard](https://catalog.workshops.aws/awscid/en-US/dashboards/additional/config-resource-compliance-dashboard#aws-config-aggregator-dashboard)。
