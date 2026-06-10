---
sidebar_position: 1
---
# 运维 AWS Config

### **在所有账户的所有区域启用 AWS Config**

对于运行多个 AWS 账户的客户，我们建议在整个组织中实施 AWS Config。AWS Config 是一项区域特定的服务，您需要在每个希望跟踪资源配置变更和合规评估的区域中启用它。您可以通过三种方式实现：


1. 使用 CloudFormation StackSets：
    [CloudFormation StackSets](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/what-is-cfnstacksets.html) 提供预构建模板，用于同时跨多个区域和账户启用 AWS Config，部署配置记录器到整个组织，并在所有账户中维护一致的设置。要使用 CloudFormation 在组织中部署 AWS Config，请[按照此博文操作](https://aws.amazon.com/blogs/mt/managing-aws-organizations-accounts-using-aws-config-and-aws-cloudformation-stacksets/)。
2. 使用 AWS Systems Manager Quick Setup：
     [AWS Systems Manager Quick Setup](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-quick-setup.html) 提供了一种简化的方式来在整个组织中启用 Config 记录器。要使用 Systems Manager Quick Setup 在组织中部署 AWS Config，请[按照此博文操作](https://aws.amazon.com/blogs/mt/managing-configuration-compliance-across-your-organization-with-aws-systems-manager-quick-setup/)。
3. AWS Control Tower：
    [AWS Control Tower](https://aws.amazon.com/controltower/) 帮助您从中心位置设置和安全管理多个 AWS 账户。启用后，Control Tower 会在所有注册账户中自动激活 AWS Config。要开始使用 AWS Control Tower，请参阅 [AWS Control Tower Getting Started 公开文档](https://docs.aws.amazon.com/controltower/latest/userguide/getting-started-with-control-tower.html)。



### AWS Config 记录器设置

配置 AWS Config 记录器设置时，一个重要的最佳实践是启用对[所有资源类型](https://docs.aws.amazon.com/config/latest/developerguide/select-resources.html)的跟踪。启用所有资源的额外好处是自动包含新 AWS 服务资源类型（当它们可用于 Config 跟踪时），确保您的配置管理无需人工干预即可保持最新。
关于[全局资源](https://docs.aws.amazon.com/config/latest/developerguide/select-resources.html#select-resources-global)（如 [IAM](https://aws.amazon.com/iam/)），重要的是仅在一个区域中启用记录（AWS Config 应在客户的主区域中启用）。此配置有两个目的：防止重复的配置项并帮助避免不必要的成本。如果您在多个区域中启用全局资源记录，您将遇到冗余的配置跟踪并产生多次监控相同全局资源的额外费用。例如，在跟踪 IAM 用户、角色和策略时，您应指定一个主要区域（如 us-east-1）用于全局资源记录，并在所有其他区域中禁用此功能。


### 交付方法最佳实践

实施 AWS 配置管理时，建立适当的配置项交付方法至关重要。建议的最佳实践是在中心账户中指定一个集中的 [Amazon S3 存储桶](https://aws.amazon.com/pm/serv-s3/)，该账户可以是日志账户或其他专门指定的账户。这种集中化允许更好地组织和管理配置项日志。为了在存储桶中保持清晰的组织，建议实施一个结构化的前缀系统，清楚地标识每个配置项的源账户和区域。还请为 S3 存储桶实施[安全最佳实践](https://docs.aws.amazon.com/AmazonS3/latest/userguide/security-best-practices.htm)，如：启用传输中和静态加密、禁用公共访问以及维护严格的访问控制。这些安全措施确保符合数据保护标准并最大限度地降低安全风险。

您还可以配置 AWS Config 将配置变更和合规状态更新自动流式传输到指定的 SNS 主题。对于具有多个 AWS 账户的企业环境，您可以建立中心 SNS 主题来整合这些通知。这种集中化方法使 IT 和安全团队能够高效地监控和响应整个组织的配置变更。要进行此操作，[请按照此文档](https://docs.aws.amazon.com/config/latest/developerguide/notifications-for-AWS-Config.html)。



### AWS Config 委托管理员

AWS Config 的委托管理员是 AWS 组织内被授予权限的指定成员账户，可以管理整个组织的配置设置。此管理员可以部署和管理 AWS Config 规则、处理合规包以及聚合来自多个账户的配置数据。他们对整个组织的资源配置和合规状态具有可见性，实现集中化管理和监控。要使用委托管理员进行 [AWS Config 运维和聚合，请按照此博文操作](https://aws.amazon.com/blogs/mt/using-delegated-admin-for-aws-config-operations-and-aggregation/)。

使用 AWS Config 的委托管理员是一项最佳实践，因为它通过将管理账户的使用限制为仅必要的组织任务来保护管理账户，同时将 AWS Config 特定的管理职责委托给指定的成员账户。这种方法遵循最小权限原则，降低安全风险，并通过在指定账户中集中 Config 管理来提供更好的运维控制。
