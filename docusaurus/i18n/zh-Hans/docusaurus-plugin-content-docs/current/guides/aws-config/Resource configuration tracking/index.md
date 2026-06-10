---
sidebar_position: 2
---
# 资源配置跟踪

AWS Config 记录和跟踪[受支持的 AWS 资源](https://docs.aws.amazon.com/config/latest/developerguide/resource-config-reference.html)的配置，在您的 AWS 账户中创建这些资源及其当前和历史配置的清单。它还创建配置变更的时间线，并维护有关 AWS 基础设施中资源属性、关系和依赖项的详细信息。用户可以通过 AWS 管理控制台或通过 AWS CLI 以编程方式[查看合规历史记录和时间线](https://docs.aws.amazon.com/config/latest/developerguide/view-manage-resource-console.html)，并能够查询任何时间点的特定配置状态。


![AWS Config Cost Visualization](/img/cloudops/guides/config/resourcetimeline.png)

### AWS Config 自定义资源

AWS Config 允许您通过[自定义 config 资源](https://docs.aws.amazon.com/config/latest/developerguide/customresources.html)将其配置跟踪功能扩展到受支持的 AWS 资源之外。此功能使您能够监控不受支持的 AWS 资源并跟踪外部资源，如本地服务器、GitHub 仓库和其他第三方资源。配置完成后，您可以将第三方资源配置数据发布到 AWS Config，并通过 AWS Config 控制台和 API 查看和监控您的完整资源清单。此外，您可以使用 AWS Config 规则、合规包、最佳实践、内部策略和法规要求来评估配置合规性。

按照[此博文](https://aws.amazon.com/blogs/mt/using-aws-config-custom-resources-to-track-any-resource-on-aws/)了解如何使用 AWS Config 监控非标准功能。[此博文](https://aws.amazon.com/blogs/mt/simplify-compliance-management-of-multicloud-or-hybrid-resources-with-aws-config/)提供了如何监控托管在其他云提供商上的资源的演练。
