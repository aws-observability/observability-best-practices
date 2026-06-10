# Amazon Managed Grafana - 常见问题

## 为什么应该选择 Amazon Managed Grafana？

**[高可用性](https://docs.aws.amazon.com/grafana/latest/userguide/disaster-recovery-resiliency.html)**：Amazon Managed Grafana 工作区具有多可用区复制的高可用性。Amazon Managed Grafana 还会持续监控工作区的健康状况，并在不影响工作区访问的情况下替换不健康的节点。Amazon Managed Grafana 管理计算和数据库节点的可用性，客户无需管理运维和维护所需的基础设施资源。

**[数据安全](https://docs.aws.amazon.com/grafana/latest/userguide/security.html)**：Amazon Managed Grafana 无需特殊配置、第三方工具或额外费用即可对静态数据进行加密。[传输中的数据](https://docs.aws.amazon.com/grafana/latest/userguide/infrastructure-security.html)也通过 TLS 进行加密。

## 支持哪些 AWS 区域？

当前支持的区域列表可在[文档的支持区域部分](https://docs.aws.amazon.com/grafana/latest/userguide/what-is-Amazon-Managed-Service-Grafana.html#AMG-supported-Regions)中查看。

## 我们的组织在多个区域有多个 AWS 账户，Amazon Managed Grafana 是否适用于这些场景？

Amazon Managed Grafana 与 [AWS Organizations](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_introduction.html) 集成，可发现组织单元 (OU) 中的 AWS 账户和资源。通过 AWS Organizations，客户可以[集中管理数据源配置和权限设置](https://docs.aws.amazon.com/grafana/latest/userguide/AMG-and-Organizations.html)，覆盖多个 AWS 账户。

## Amazon Managed Grafana 支持哪些数据源？

数据源是客户可以在 Grafana 中查询以构建 dashboard 的存储后端。Amazon Managed Grafana 支持大约 [30 多个内置数据源](https://docs.aws.amazon.com/grafana/latest/userguide/AMG-data-sources-builtin.html)，包括 Amazon CloudWatch、Amazon OpenSearch Service、AWS IoT SiteWise、AWS IoT TwinMaker、Amazon Managed Service for Prometheus、Amazon Timestream、Amazon Athena、Amazon Redshift、AWS X-Ray 等 AWS 原生服务。此外，升级到 Grafana Enterprise 的工作区还可以使用[大约 15 个以上的其他数据源](https://docs.aws.amazon.com/grafana/latest/userguide/AMG-data-sources-enterprise.html)。

## 我的工作负载的数据源位于私有 VPC 中。如何将它们安全地连接到 Amazon Managed Grafana？

[VPC 内的私有数据源](https://docs.aws.amazon.com/grafana/latest/userguide/AMG-configure-vpc.html)可以通过 AWS PrivateLink 连接到 Amazon Managed Grafana，以确保流量安全。可以通过为 [Amazon VPC endpoints](https://docs.aws.amazon.com/whitepapers/latest/aws-privatelink/what-are-vpc-endpoints.html) 附加 [IAM 资源策略](https://docs.aws.amazon.com/grafana/latest/userguide/VPC-endpoints.html#controlling-vpc)来限制从 [VPC endpoints](https://docs.aws.amazon.com/grafana/latest/userguide/AMG-configure-nac.html) 对 Amazon Managed Grafana 服务的进一步访问控制。

## Amazon Managed Grafana 提供哪些用户认证机制？

在 Amazon Managed Grafana 工作区中，[用户通过单点登录认证到 Grafana 控制台](https://docs.aws.amazon.com/grafana/latest/userguide/authentication-in-AMG.html)，支持任何符合 Security Assertion Markup Language 2.0 (SAML 2.0) 的 IDP 或 AWS IAM Identity Center（AWS Single Sign-On 的后续服务）。

> 相关博客：[使用 Grafana Teams 在 Amazon Managed Grafana 中实现细粒度访问控制](https://aws.amazon.com/blogs/mt/fine-grained-access-control-in-amazon-managed-grafana-using-grafana-teams/)

## Amazon Managed Grafana 提供哪些自动化支持？

Amazon Managed Grafana [与 AWS CloudFormation 集成](https://docs.aws.amazon.com/grafana/latest/userguide/creating-resources-with-cloudformation.html)，帮助客户建模和设置 AWS 资源，从而减少在 AWS 中创建和管理资源和基础设施所花费的时间。通过 [AWS CloudFormation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html)，客户可以重复使用模板来一致且重复地设置 Amazon Managed Grafana 资源。Amazon Managed Grafana 还提供 [API](https://docs.aws.amazon.com/grafana/latest/APIReference/Welcome.html)，支持客户通过 [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html) 进行自动化或与软件/产品集成。Amazon Managed Grafana 工作区具有 [HTTP APIs](https://docs.aws.amazon.com/grafana/latest/userguide/Using-Grafana-APIs.html)，用于自动化和集成支持。

> 相关博客：[宣布 Amazon Managed Grafana 支持私有 VPC 数据源](https://aws.amazon.com/blogs/mt/announcing-private-vpc-data-source-support-for-amazon-managed-grafana/)

## 我的组织使用 Terraform 进行自动化。Amazon Managed Grafana 是否支持 Terraform？
是的，[Amazon Managed Grafana 支持](https://aws-observability.github.io/observability-best-practices/recipes/recipes/amg-automation-tf/) Terraform 进行[自动化](https://registry.terraform.io/modules/terraform-aws-modules/managed-service-grafana/aws/latest)

> 示例：[Terraform 支持的参考实现](https://github.com/aws-observability/terraform-aws-observability-accelerator/tree/main/examples/managed-grafana-workspace)

## 我在当前的 Grafana 设置中使用了常用的 Dashboard。有没有办法在 Amazon Managed Grafana 上使用它们而不需要重新创建？

Amazon Managed Grafana 支持 [HTTP APIs](https://docs.aws.amazon.com/grafana/latest/userguide/Using-Grafana-APIs.html)，允许您轻松自动化 Dashboard、用户等的部署和管理。您可以在 GitOps/CICD 流程中使用这些 API 来自动化管理这些资源。

## Amazon Managed Grafana 是否支持告警？

[Amazon Managed Grafana 告警](https://docs.aws.amazon.com/grafana/latest/userguide/alerts-overview.html)为客户提供强大且可操作的告警，帮助近实时地了解系统中的问题，最大限度地减少服务中断。Grafana 包含更新的告警系统 Grafana alerting，它将告警信息集中在一个可搜索的视图中。

## 我的组织要求所有操作都有记录以便审计。Amazon Managed Grafana 的事件可以被记录吗？

Amazon Managed Grafana 与 [AWS CloudTrail](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html) 集成，提供用户、角色或 AWS 服务在 Amazon Managed Grafana 中采取的操作记录。CloudTrail 将所有 [Amazon Managed Grafana 的 API 调用](https://docs.aws.amazon.com/grafana/latest/userguide/logging-using-cloudtrail.html)捕获为事件。捕获的调用包括来自 Amazon Managed Grafana 控制台的调用以及对 Amazon Managed Grafana API 操作的代码调用。

## 有哪些其他可用信息？

要了解更多关于 Amazon Managed Grafana 的信息，客户可以阅读 AWS [文档](https://docs.aws.amazon.com/grafana/latest/userguide/what-is-Amazon-Managed-Service-Grafana.html)，参加关于 [Amazon Managed Grafana](https://catalog.workshops.aws/observability/en-US/aws-managed-oss/amg) 的 AWS Observability Workshop，还可以查看[产品页面](https://aws.amazon.com/grafana/)了解[功能](https://aws.amazon.com/grafana/features/?nc=sn&loc=2)、[定价](https://aws.amazon.com/grafana/pricing/?nc=sn&loc=3)详情、最新[博客文章](https://aws.amazon.com/grafana/resources/?nc=sn&loc=4&msg-blogs.sort-by=item.additionalFields.createdDate&msg-blogs.sort-order=desc#Latest_blog_posts)和[视频](https://aws.amazon.com/grafana/resources/?nc=sn&loc=4&msg-blogs.sort-by=item.additionalFields.createdDate&msg-blogs.sort-order=desc#Videos)。

**产品常见问题：** [https://aws.amazon.com/grafana/faqs/](https://aws.amazon.com/grafana/faqs/)
