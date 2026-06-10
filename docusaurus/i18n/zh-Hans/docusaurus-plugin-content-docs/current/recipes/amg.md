# Amazon Managed Grafana

[Amazon Managed Grafana][amg-main] 是一项基于开源 Grafana 的完全托管服务，使您能够分析 metrics、logs 和 traces，而无需配置服务器、配置和更新软件，或承担在生产环境中保护和扩展 Grafana 的繁重工作。您可以创建、探索和与团队共享 observability dashboards，连接多个数据源。

请查看以下方案：

## 基础

- [入门指南][amg-gettingstarted]
- [使用 Terraform 实现自动化][amg-tf-automation]

## 身份验证与访问控制

- [与身份提供商的直接 SAML 集成][amg-saml]
- [将身份提供商（OneLogin、Ping Identity、Okta 和 Azure AD）集成到 SSO][amg-idps]
- [通过 SAMLv2 集成 Google 身份验证][amg-google-idps]
- [使用客户管理的 IAM 角色设置 Amazon Managed Grafana 跨账户数据源][amg-cross-account-access]
- [使用 Grafana Teams 在 Amazon Managed Grafana 中实现细粒度访问控制][amg-grafana-teams]

## 数据源与可视化

- [在 Amazon Managed Grafana 中使用 Athena][amg-plugin-athena]
- [在 Amazon Managed Grafana 中使用 Redshift][amg-plugin-redshift]
- [使用 Amazon Managed Service for Prometheus 和 Amazon Managed Grafana 查看来自 statsd 的自定义 metrics][amg-amp-statsd]
- [使用客户管理的 IAM 角色设置跨账户数据源][amg-xacc-ds]

## 其他
- [监控混合环境][amg-hybridenvs]
- [在受管控的多租户环境中管理 Grafana 和 Loki][grafana-loki-regenv]
- [使用 Amazon Managed Service for Prometheus 和 Amazon Managed Grafana 监控 Amazon EKS Anywhere][amg-anywhere-monitoring]
- [入门动手实验][amg-oow]
- [监控子网中的空闲 IP][amg-subnet-free-ip-monitoring]


[amg-main]: https://aws.amazon.com/grafana/
[amg-gettingstarted]: https://aws.amazon.com/blogs/mt/amazon-managed-grafana-getting-started/
[amg-saml]: https://aws.amazon.com/blogs/mt/amazon-managed-grafana-supports-direct-saml-integration-with-identity-providers/
[amg-idps]: https://aws.amazon.com/blogs/opensource/integrating-identity-providers-such-as-onelogin-ping-identity-okta-and-azure-ad-to-sso-into-aws-managed-service-for-grafana/
[amg-google-idps]: recipes/amg-google-auth-saml.md
[amg-hybridenvs]: https://aws.amazon.com/blogs/mt/monitoring-hybrid-environments-using-amazon-managed-service-for-grafana/
[amg-xacc-ds]: https://aws.amazon.com/blogs/opensource/setting-up-amazon-managed-grafana-cross-account-data-source-using-customer-managed-iam-roles/
[grafana-loki-regenv]: https://aws.amazon.com/blogs/opensource/how-to-manage-grafana-and-loki-in-a-regulated-multitenant-environment/
[amg-oow]: https://observability.workshop.aws/en/amg.html
[amg-tf-automation]: recipes/amg-automation-tf.md
[amg-plugin-athena]: recipes/amg-athena-plugin.md
[amg-plugin-redshift]: recipes/amg-redshift-plugin.md
[amg-cross-account-access]: https://aws.amazon.com/blogs/opensource/setting-up-amazon-managed-grafana-cross-account-data-source-using-customer-managed-iam-roles/
[amg-anywhere-monitoring]: https://aws.amazon.com/blogs/containers/monitoring-amazon-eks-anywhere-using-amazon-managed-service-for-prometheus-and-amazon-managed-grafana/
[amg-amp-statsd]: https://aws.amazon.com/blogs/mt/viewing-custom-metrics-from-statsd-with-amazon-managed-service-for-prometheus-and-amazon-managed-grafana/
[amg-grafana-teams]: https://aws.amazon.com/blogs/mt/fine-grained-access-control-in-amazon-managed-grafana-using-grafana-teams/
[amg-subnet-free-ip-monitoring]: https://aws-observability.github.io/observability-best-practices/recipes/recipes/amg-subnet-free-ip-monitoring/
