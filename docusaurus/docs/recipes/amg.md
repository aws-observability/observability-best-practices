# Amazon Managed Grafana

[Amazon Managed Grafana][amg-main] is a fully managed service based on open 
source Grafana, enabling you to analyze your metrics, logs, and traces without
having to provision servers, configure and update software, or do the heavy 
lifting involved in securing and scaling Grafana in production. You can create,
explore, and share observability dashboards with your team, connecting to
multiple data sources.

Check out the following recipes:

## Basics

- [Getting Started][amg-gettingstarted]
- [Using Terraform for automation][amg-tf-automation]

## Authentication and Access Control

- [Direct SAML integration with identity providers][amg-saml]
- [Integrating identity providers (OneLogin, Ping Identity, Okta, and Azure AD) to SSO][amg-idps]
- [Integrating Google authentication via SAMLv2][amg-google-idps]
- [Setting up Amazon Managed Grafana cross-account data source using customer managed IAM roles][amg-cross-account-access]
- [Fine-grained access control in Amazon Managed Grafana using Grafana Teams][amg-grafana-teams]

## Data sources and Visualizations

- [Using Athena in Amazon Managed Grafana][amg-plugin-athena]
- [Using Redshift in Amazon Managed Grafana][amg-plugin-redshift]
- [Viewing custom metrics from statsd with Amazon Managed Service for Prometheus and Amazon Managed Grafana][amg-amp-statsd]
- [Setting up cross-account data source using customer managed IAM roles][amg-xacc-ds]

## Others
- [Monitoring hybrid environments][amg-hybridenvs]
- [Managing Grafana and Loki in a regulated multitenant environment][grafana-loki-regenv]
- [Monitoring Amazon EKS Anywhere using Amazon Managed Service for Prometheus and Amazon Managed Grafana][amg-anywhere-monitoring]
- [Workshop for Getting Started][amg-oow]


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

