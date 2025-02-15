# Amazon Managed Grafana - FAQ

**Why should I choose Amazon Managed Grafana?**

**[High Availability](https://docs.aws.amazon.com/grafana/latest/userguide/disaster-recovery-resiliency.html)**: Amazon Managed Grafana workspaces are highly available with multi-az replication. Amazon Managed Grafana also continuously monitors for the health of workspaces and replaces unhealthy nodes, without impacting access to the workspaces. Amazon Managed Grafana manages the availability of compute and database nodes so customers don’t have to manage the infrastructure resources required for the administration & maintenance.

**[Data Security](https://docs.aws.amazon.com/grafana/latest/userguide/security.html)**: Amazon Managed Grafana encrypts the data at rest without any special configuration, third-party tools, or additional cost. [Data in-transit](https://docs.aws.amazon.com/grafana/latest/userguide/infrastructure-security.html) area also encrypted via TLS.

**Which AWS regions are supported?**

Current list of supported Regions is available in the [Supported Regions section in the documentation.](https://docs.aws.amazon.com/grafana/latest/userguide/what-is-Amazon-Managed-Service-Grafana.html#AMG-supported-Regions)

**We have multiple AWS accounts in multiple regions in our Organization, does Amazon Managed Grafana work for these scenarios**

Amazon Managed Grafana integrates with [AWS Organizations](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_introduction.html) to discover AWS accounts and resources in Organizational Units (OUs). With AWS Organizations customers can [centrally manage data source configuration and permission settings](https://docs.aws.amazon.com/grafana/latest/userguide/AMG-and-Organizations.html) for multiple AWS accounts.

**What data sources are supported in Amazon Managed Grafana?**

Data sources are storage backends that customers can query in Grafana to build dashboards in Amazon Managed Grafana. Amazon Managed Grafana supports about [30+ built-in data sources](https://docs.aws.amazon.com/grafana/latest/userguide/AMG-data-sources-builtin.html) including AWS native services like Amazon CloudWatch, Amazon OpenSearch Service, AWS IoT SiteWise, AWS IoT TwinMaker, Amazon Managed Service for Prometheus, Amazon Timestream, Amazon Athena, Amazon Redshift, AWS X-Ray and many others. Additionally, [about 15+ other data sources](https://docs.aws.amazon.com/grafana/latest/userguide/AMG-data-sources-enterprise.html) are also available for upgraded workspaces in Grafana Enterprise.

**Data sources of my workloads are in private VPCs. How do I connect them to Amazon Managed Grafana securely?**

Private [data sources within a VPC](https://docs.aws.amazon.com/grafana/latest/userguide/AMG-configure-vpc.html) can be connected to Amazon Managed Grafana through AWS PrivateLink to keep the traffic secure. Further access control to Amazon Managed Grafana service from the [VPC endpoints](https://docs.aws.amazon.com/grafana/latest/userguide/AMG-configure-nac.html) can be restricted by attaching an [IAM resource policy](https://docs.aws.amazon.com/grafana/latest/userguide/VPC-endpoints.html#controlling-vpc) for [Amazon VPC endpoints](https://docs.aws.amazon.com/whitepapers/latest/aws-privatelink/what-are-vpc-endpoints.html).

**What User Authentication mechanism is available in Amazon Managed Grafana?**

In Amazon Managed Grafana workspace, [users are authenticated to the Grafana console](https://docs.aws.amazon.com/grafana/latest/userguide/authentication-in-AMG.html) by single sign-on using any IDP that supports Security Assertion Markup Language 2.0 (SAML 2.0) or AWS IAM Identity Center (successor to AWS Single Sign-On).

> Related blog: [Fine-grained access control in Amazon Managed Grafana using Grafana Teams](https://aws.amazon.com/blogs/mt/fine-grained-access-control-in-amazon-managed-grafana-using-grafana-teams/)

**What kind of automation support is available for Amazon Managed Grafana?**

Amazon Managed Grafana is [integrated with AWS CloudFormation](https://docs.aws.amazon.com/grafana/latest/userguide/creating-resources-with-cloudformation.html), which helps customers in modeling and setting up AWS resources so that customers can spend less time creating and managing resources and infrastructure in AWS. With [AWS CloudFormation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html) customers can reuse templates to set up Amazon Managed Grafana resources consistently and repeatedly. Amazon Managed Grafana also has [API](https://docs.aws.amazon.com/grafana/latest/APIReference/Welcome.html)available which supports customers in automating through [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html) or integrating with software/products. Amazon Managed Grafana workspaces has [HTTP APIs](https://docs.aws.amazon.com/grafana/latest/userguide/Using-Grafana-APIs.html) for automation and integration support.

> Related blog: [Announcing Private VPC data source support for Amazon Managed Grafana](https://aws.amazon.com/blogs/mt/announcing-private-vpc-data-source-support-for-amazon-managed-grafana/)

**My Organization uses Terraform for automation. Does Amazon Managed Grafana support Terraform?**
Yes, [Amazon Managed Grafana supports](https://aws-observability.github.io/observability-best-practices/recipes/recipes/amg-automation-tf/) Terraform for [automation](https://registry.terraform.io/modules/terraform-aws-modules/managed-service-grafana/aws/latest)

> Example: [Reference implementation for Terraform support](https://github.com/aws-observability/terraform-aws-observability-accelerator/tree/main/examples/managed-grafana-workspace)

**I am using commonly used Dashboards in my current Grafana setup. Is there a way to use them on Amazon Managed Grafana rather than re-creating again?**

Amazon Managed Grafana supports [HTTP APIs](https://docs.aws.amazon.com/grafana/latest/userguide/Using-Grafana-APIs.html) that allow you to easily automate deployment and management of Dashboards, users and much more. You can use these APIs in your GitOps/CICD processes to automate management of these resources.

**Does Amazon Managed Grafana support Alerts?**

[Amazon Managed Grafana alerting](https://docs.aws.amazon.com/grafana/latest/userguide/alerts-overview.html) provides customers with robust and actionable alerts that help learn about problems in the systems in near real time, minimizing disruption to services. Grafana includes access to an updated alerting system, Grafana alerting, that centralizes alerting information in a single, searchable view.

**My Organization requires all actions be recorded for audits. Can Amazon Managed Grafana events be recorded?**

Amazon Managed Grafana is integrated with [AWS CloudTrail](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html), which provides a record of actions taken by a user, a role, or an AWS service in Amazon Managed Grafana. CloudTrail captures all [API calls for Amazon Managed Grafana](https://docs.aws.amazon.com/grafana/latest/userguide/logging-using-cloudtrail.html)as events. The calls that are captured include calls from the Amazon Managed Grafana console and code calls to the Amazon Managed Grafana API operations.

**What more information is available?**

For additional information on Amazon Managed Grafana customers can read the AWS [Documentation](https://docs.aws.amazon.com/grafana/latest/userguide/what-is-Amazon-Managed-Service-Grafana.html), go through the AWS Observability Workshop on [Amazon Managed Grafana](https://catalog.workshops.aws/observability/en-US/aws-managed-oss/amg) and also check the [product page](https://aws.amazon.com/grafana/) to know the [features](https://aws.amazon.com/grafana/features/?nc=sn&loc=2), [pricing](https://aws.amazon.com/grafana/pricing/?nc=sn&loc=3) details, latest [blog posts](https://aws.amazon.com/grafana/resources/?nc=sn&loc=4&msg-blogs.sort-by=item.additionalFields.createdDate&msg-blogs.sort-order=desc#Latest_blog_posts) and [videos](https://aws.amazon.com/grafana/resources/?nc=sn&loc=4&msg-blogs.sort-by=item.additionalFields.createdDate&msg-blogs.sort-order=desc#Videos).

**Product FAQ:** [https://aws.amazon.com/grafana/faqs/](https://aws.amazon.com/grafana/faqs/)
