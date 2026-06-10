---
sidebar_position: 4
---
# AWS Config 成本优化

### 定价

[AWS Config 定价](https://aws.amazon.com/config/pricing/)主要基于两个维度：

1. 配置项记录：

    * 持续记录
        持续实时监控和记录 AWS 环境中的每个配置变更。这提供了对所有资源修改的全面可见性，允许您在变更发生时跟踪和审计。
    * 定期记录
        对资源配置进行每日快照，仅在与前 24 小时状态不同时记录变更。这种方法在监督和成本效率之间提供了平衡，在减少数据量的同时捕获重大变更。

1. 规则和合规包评估：
    AWS Config 对 config 规则评估收费，无论是单独评估还是作为合规包的一部分。

有关 AWS Config 定价的最新详情，[请参阅此链接](https://aws.amazon.com/config/pricing/)。

虽然以上是主要的定价组件，但其他因素可能影响使用 AWS Config 的总成本：

1. [AWS Lambda](https://aws.amazon.com/lambda/pricing/) 成本：如果您使用通过 Lambda 函数实现的自定义规则，则适用标准 Lambda 定价。
2. [Amazon S3](https://aws.amazon.com/s3/pricing/) 存储：在 S3 中存储配置快照和历史文件会产生成本。
3. 数据传输：AWS 服务或区域之间的数据传输可能会产生费用。



### 成本优化建议

#### 分析 Config 成本

[AWS Cost Explorer](https://aws.amazon.com/aws-cost-management/aws-cost-explorer/) 通过过滤服务使用情况和分析成本维度来提供对 AWS Config 成本的洞察。为此，请导航到您的[计费和成本管理控制台](https://us-east-1.console.aws.amazon.com/costmanagement/home#/home)并从左侧面板选择 **Cost Explorer**。从右侧面板，配置参数（如所需时间）并根据所需详细程度选择首选粒度（每日或每月）。在 **Group by** 部分的 **Dimensions** 下选择 **Usage Type**。在 **Filters** 下，导航到 **Service** 并选择 **Config**。

![AWS Config Cost Visualization](/img/cloudops/guides/config/configcost.png)

[Amazon CloudWatch](https://aws.amazon.com/cloudwatch/) 的 "ConfigurationItemsRecorded" metric 有助于识别生成最多配置项的资源类型。请参阅关于[如何使用 CloudWatch Metrics 分析 AWS Config 资源变更](https://aws.amazon.com/blogs/mt/analyzing-aws-config-resource-changes-using-cloudwatch-metrics/)的博文。对于详细分析，[Amazon Athena](https://aws.amazon.com/athena/) 可用于查询[成本和使用报告](https://aws.amazon.com/aws-cost-management/aws-cost-and-usage-reporting/)，配合 [AWS CloudTrail](https://aws.amazon.com/cloudtrail/) 和 [CloudTrail Lake](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-lake.html) 帮助估算 config 记录器成本并跟踪频繁评估的规则。请参阅关于如何[使用 Athena 分析 AWS Config 数据](https://aws.amazon.com/blogs/mt/use-amazon-athena-and-aws-cloudtrail-to-estimate-billing-for-aws-config-rule-evaluations/)的博文。

对于成本警报，通过 [AWS Budgets](https://aws.amazon.com/aws-cost-management/aws-budgets/) 在成本超过预定义阈值时实施主动成本管理。此外，[AWS Cost Anomaly Detection](https://aws.amazon.com/aws-cost-management/aws-cost-anomaly-detection/) 服务提供对异常支出模式的持续监控，使识别和解决成本峰值更加容易。您还可以创建 [CloudWatch 计费警报](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/monitor_estimated_charges_with_cloudwatch.html)，在估计费用超过定义的阈值时通知您。

#### 在持续记录和定期记录之间选择

实施 AWS Config 时，选择适当的记录方法对于平衡成本和合规要求至关重要。[持续记录](https://docs.aws.amazon.com/config/latest/developerguide/config-concepts.html#continuous-recording)对于资源相对稳定的静态工作负载通常更具成本效益。此选项特别推荐用于对实时监控和配置变更即时可见性有严格安全和合规要求的环境。关键基础设施组件（如生产数据库、核心网络资源或敏感数据处理系统）通常受益于持续记录。另一方面，[定期记录](https://docs.aws.amazon.com/config/latest/developerguide/config-concepts.html#periodic-recording)对于高度动态的工作负载可能更经济，例如容器化环境中的临时资源或频繁扩展的基础设施。示例包括使用自动扩展组的开发环境、容器编排平台或临时测试环境。但需要注意，定期记录应仅用于合规要求较低的工作负载，因为它提供的是 24 小时基础的更新而非实时更新。此外，定期记录中每个配置项交付的成本高于持续记录，因此在某些场景中，定期记录的总成本实际上可能超过持续记录。这两种记录方法之间的选择通常与特定用例相一致，例如定期快照可能足够的运维规划，或需要持续监控的合规审计。组织在做出此决定时应仔细评估其安全要求、运维模式和预算约束。


#### 资源排除

AWS Config 通过[资源排除](https://docs.aws.amazon.com/config/latest/developerguide/select-resources.html)功能提供成本优化，允许组织战略性地管理其配置监控成本。通过排除与风险概况不太相关或生成大量配置项的特定资源类型，您可以在维持基本安全监控的同时显著降低成本。此功能可以通过 AWS 管理控制台和 CLI 中的 AWS Config 设置进行访问和配置。但是，您应该在仔细考虑和适当的利益相关者参与下进行资源排除。组织应让其安全和运维团队参与，对哪些资源对监控和合规要求至关重要以及哪些可以安全排除进行全面评估。目标是在成本效率和维护稳健治理姿态之间取得最佳平衡。例如，虽然临时开发资源可能是排除的候选对象，但关键生产基础设施通常应保持在持续监控之下。在实施任何排除之前，建议查看 [AWS 安全最佳实践](https://docs.aws.amazon.com/config/latest/developerguide/security-best-practices.html)并参考 [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)，以确保您的决策符合安全和合规要求。此外，组织应随着业务需求和安全要求的演变定期审查其排除策略。

值得注意的是，[AWS Control Tower](https://aws.amazon.com/controltower/) 目前不支持 config 记录器自定义。但是，如[此博文所述](https://aws.amazon.com/blogs/mt/customize-aws-config-resource-tracking-in-aws-control-tower-environment/)，在添加原生支持之前，有一种在 Control Tower 环境中自定义 AWS Config 资源跟踪的解决方法。


#### 顶级配置项

有时 [AWS::Config::ResourceCompliance](https://docs.aws.amazon.com/config/latest/developerguide/view-compliance-history.html) 通常是最具影响力的配置项生成器之一，特别是对于有大量规则评估的客户。此资源类型在 AWS Config 控制台中提供合规状态的时间线视图。虽然它提供了有价值的洞察，但它可以显著增加配置项成本，特别是在评估大型资源时。如果是这种情况，您可以考虑排除它以降低成本。

对于历史合规检查，客户可以利用 CloudTrail 数据作为免费替代方案。您的客户可以修改以下查询以与 Athena、第三方解决方案配合使用，或者如果已启用 CloudTrail Lake 则在其中使用。


```
SELECT
    eventTime,awsRegion, recipientAccountId, element_at(additionalEventData, 'configRuleName'
    ) as configRuleName, json_extract_scalar(json_array_get(element_at(requestParameters,'evaluations'
        ),0
        ),'$.complianceType'
    ) as Compliance, json_extract_scalar(json_array_get(element_at(requestParameters,'evaluations'
        ),0
        ),'$.complianceResourceType'
    ) as ResourceType, json_extract_scalar(json_array_get(element_at(requestParameters,'evaluations'
        ),0
        ),'$.complianceResourceId'
    ) as ResourceName
FROM
    $EDS_ID
WHERE
    eventName='PutEvaluations'
    and eventTime > '2022-03-17 00:00:00'
    AND eventTime < '2022-03-18 00:00:00'
    And json_extract_scalar(json_array_get(element_at(requestParameters,'evaluations'
        ),0
        ),'$.complianceType'
    ) IN ('COMPLIANT','NON_COMPLIANT')
```



#### AWS Config 间接关系

AWS Config 中有两种类型的关系：
直接关系：

* 从资源配置数据中提取的简单 A->B 关系
* 直接从 describe API 调用中获取
* 示例：Amazon EC2 实例与其安全组之间的关系是直接的，因为安全组包含在 Amazon EC2 实例的 describe API 响应中。

间接关系：

* 较旧的资源类型可能通过检查多个资源配置来记录其配置
* 示例：安全组与 Amazon EC2 实例之间的关系是间接的，因为描述安全组不会返回与其关联的实例的任何信息。在这种情况下，AWS Config 会创建两个配置项。

您可以在[此链接](https://docs.aws.amazon.com/config/latest/developerguide/faq.html)中了解更多关于哪些资源支持间接关系的信息。

要退出间接关系，我们建议您联系您的[技术客户经理](https://aws.amazon.com/premiumsupport/plans/enterprise/)。

#### 规则管理和评估注意事项

管理 AWS Config 规则时，请考虑规则删除和重新评估操作，因为这些可能会显著影响成本。当删除评估大量资源的规则时，一种具有成本效益的方法是首先停止[资源合规记录](https://docs.aws.amazon.com/config/latest/developerguide/stop-start-recorder.html)，然后删除规则，最后重新启动合规记录。此操作不会影响您存储的数据，但会在记录器停止期间影响您对资源配置的可见性。此顺序过程有助于防止配置项生成和相关成本的不必要峰值。

#### API 调用优化

高效的 API 操作可以降低 AWS Config 成本。修改资源时（如向 [EC2 实例](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/Using_Tags.html)添加多个标签），建议将变更合并为单个 API 调用而不是进行多个单独调用。例如，在一个 API 调用中添加 10 个标签比进行 10 个单独调用更高效，因为每个调用都会生成 API 变更记录和资源合规配置项。

#### 自定义规则和 Lambda 函数优化

对于自定义规则实施，优先使用 [CloudFormation Guard](https://docs.aws.amazon.com/cfn-guard/latest/ug/what-is-guard.html) 而不是 Lambda 函数以降低执行成本。但是，如果必须使用基于 Lambda 的自定义规则，请通过以下方式优化：

* 使用特定目标缩小评估资源的范围。基于范围的规则仅支持基于事件的评估，不支持定期评估
* 实施资源标签以获得更好的控制
* 添加逻辑来处理已删除资源的评估终止
* 使用特定于资源的触发器而不是评估所有资源

#### 合规包和规则去重

定期审计规则和[合规包](https://docs.aws.amazon.com/config/latest/developerguide/conformance-packs.html)对于消除冗余至关重要。例如，如果多个合规包包含相同的规则（如 CloudTrail 启用检查）而该规则已经由 [AWS Security Hub](https://aws.amazon.com/security-hub/) 评估，请考虑删除重复规则以避免不必要的评估成本。审查并整合不同合规标准中重叠的规则以在优化成本的同时保持有效性。请按照[此博文发现重复的 AWS Config 规则](https://aws.amazon.com/blogs/security/discover-duplicate-aws-config-rules-for-streamlined-compliance/)。

#### 优化 AWS Config 中的全局资源记录

在多个区域实施 AWS Config 时，您可以优化全局资源的记录以控制成本并防止重复数据收集。最佳实践是将全局资源记录限制在 AWS 环境中的单个区域。这可以通过 AWS CloudFormation 模板管理，仅在一个指定区域中将 'IncludeGlobalResourceTypes' 属性设置为 'true'。这种方法对于全局性质的资源（如 IAM 用户、角色和策略）很重要。通过实施此方法，组织可以避免跨多个区域对全局资源记录的不必要重复，从而在维护对全局资源全面可见性的同时实现显著的成本节约。

#### 集成服务优化

AWS Config 与各种 AWS 服务交互，每种服务都对总成本有所贡献。为这些集成服务实施最佳实践以优化其各自的成本：
