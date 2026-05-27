---
sidebar_position: 3
---
# Compliance Evaluation

AWS Config provides two primary types of rules for evaluating resource configurations within your AWS environment. The first type, [Managed Rules](https://docs.aws.amazon.com/config/latest/developerguide/managed-rules-by-aws-config.html), are pre-built rules provided by AWS, covering various security, operational, and compliance use cases. Managed Rules are pre-configured rule templates that evaluate your AWS resources against best practices and common compliance standards. The second type [Custom Rules](https://docs.aws.amazon.com/config/latest/developerguide/evaluate-config_develop-rules.html), allows organizations to create their own rules enabling them to implement organization-specific compliance requirements and checks.

Custom rules can be created through AWS Lambda functions, where you code the logic that evaluates if your AWS resources are complaint or not. AWS Config also allows for the [creation of custom rules using Guard Custom policy](https://aws.amazon.com/blogs/mt/announcing-aws-config-custom-rules-using-guard-custom-policy/). [Guard Custom policy](https://docs.aws.amazon.com/config/latest/developerguide/evaluate-config_develop-rules.html) simplify the process of creating custom rules as you won’t need to create Lambda functions. Guard Custom policy lets you define your policy-as-code to evaluate your resource against the policy that’s defined using the [Guard domain-specific language (DSL)](https://docs.aws.amazon.com/cfn-guard/latest/ug/writing-rules.html).

AWS Config is natively integrated natively with [Systems Manager Automation documents](https://aws.amazon.com/blogs/mt/remediate-noncompliant-aws-config-rules-with-aws-systems-manager-automation-runbooks/) for remediation actions.  You can create your own custom remediation actions using AWS Systems Manager Automation documents and will have the option to choose manual or automatic remediation through AWS Config. 

Additionally, AWS also provides [Service-Linked Rules](https://docs.aws.amazon.com/config/latest/developerguide/service-linked-rules.html), which are automatically created and managed by other AWS services to evaluate resource configurations specific to those services. For example, AWS Security Hub can create service-linked rules in AWS Config to evaluate security best practices and standards. You can also deploy [Organization Rules](https://docs.aws.amazon.com/config/latest/developerguide/config-rule-multi-account-deployment.html), which allow you to deploy and manage rules across multiple accounts in your AWS Organizations structure, making it easier to maintain consistent compliance across your entire AWS environment. 

### Conformance Packs:

Instead of deploying managed rules or custom rules individually to specific regions and accounts, a best practice is to bundle them into [Conformance Packs](https://docs.aws.amazon.com/config/latest/developerguide/conformance-packs.html).  AWS Conformance Packs provide a single point of control to deploy and monitor hundreds of rules across multiple accounts and regions, ensuring consistent security and compliance standards at scale. They offer [pre-built templates for common frameworks](https://docs.aws.amazon.com/config/latest/developerguide/conformancepack-sample-templates.html) (like HIPAA, NIST, PCI-DSS) and allow custom rule creation, significantly reducing the time and effort needed for compliance management. These packs represent immutable groups of Config rules, ensuring that changes can only be made through formal updates to the conformance pack itself. This approach provides better governance and control over your compliance rules.


#### Organizational Deployment: 

AWS enables you to leverage organizational conformance packs for automatic deployment across your AWS Organization. This capability extends to both conformance packs and individual Config rules. AWS Config also supports delegated administrator functionality, allowing you to designate a specific account for managing conformance pack deployments across your organization. Follow this documentation to [deploy conformance packs using a delegated admin](https://aws.amazon.com/blogs/mt/deploy-aws-config-rules-and-conformance-packs-using-a-delegated-admin/) maintaining benefits such as immutable 


### AWS Config Rules Development Kit (RDK) 

The AWS Config [Rules Development Kit](https://github.com/awslabs/aws-config-rdk) (RDK), available in the AWS samples GitHub repository, streamlines the creation of custom Config rules. It provides boilerplate code templates that require minimal modification for implementing resource evaluations. The RDK supports various deployment scenarios, including the centralized Lambda function approach mentioned above.

Please refer to this blog to [build and operate custom AWS Config rules at scale](https://aws.amazon.com/blogs/mt/aws-config-rule-development-kit-library-build-and-operate-rules-at-scale/) using AWS Config RDK.

#### Centralize Lambda Functions

In multi-account environments where multiple custom rules are required, it's recommended to centralize Lambda functions in a single account (such as a security or compliance account). Custom rules from other accounts can then invoke these centralized functions. 

### Global Resource Management

For rules evaluating global resources (such as IAM rules), deploy them in only one region to avoid duplicate costs and redundant API calls. This practice optimizes both cost efficiency and resource utilization while maintaining effective compliance monitoring.


### Evaluation Management

When managing rule evaluations, be mindful of the options to delete evaluation results or trigger re-evaluations. Frequent use of these features will generate new [configuration items](https://docs.aws.amazon.com/config/latest/APIReference/API_ConfigurationItem.html) for resources, potentially impacting storage and processing requirements.



## Cross-Account Aggregation and Querying

As organizations enable AWS Config across multiple regions and accounts, it becomes crucial to centralize the data for comprehensive visibility and management. [AWS Config Aggregators](https://docs.aws.amazon.com/config/latest/developerguide/aggregate-data.html) offer a free feature to consolidate configuration-related data from various regions and accounts into a single, designated aggregator account. This centralization provides a unified view of your AWS environment, enabling easier monitoring of Config rule evaluations, conformance pack assessments, and overall compliance status across your organization.  To deploy organization wide aggregator, [please follow this blog](https://aws.amazon.com/blogs/mt/org-aggregator-delegated-admin/).

This aggregated data in the central account unlocks [advanced querying](https://docs.aws.amazon.com/config/latest/developerguide/querying-AWS-resources.html)  capabilities. This feature allows you to perform complex queries across your AWS environment, providing insights into resource configurations and compliance states. For instance, you can easily identify all unattached EBS volumes across your accounts using a simple SQL-like syntax. These advanced queries offer both operational and compliance-related data, enhancing your ability to manage and optimize your AWS infrastructure effectively.

[AWS Config configuration snapshot data](https://docs.aws.amazon.com/config/latest/developerguide/deliver-snapshot-cli.html) in S3 can be queried using [Amazon Athena](https://aws.amazon.com/athena/) and customers can create custom visualizations using [Amazon QuickSight](https://aws.amazon.com/quicksight). To learn, how to aggregate AWS Config data, perform advanced queries,  and create customized inventory dashboards,  [please follow the monitoring with AWS Config workshop](https://catalog.workshops.aws/cloudops-accelerator/en-US/inventory/monitoring-resources-with-aws-config). Please also refer to the workshop on [AWS Config Resource Compliance Dashboard](https://catalog.workshops.aws/awscid/en-US/dashboards/additional/config-resource-compliance-dashboard#aws-config-aggregator-dashboard) that shows you how to  [deploy the AWS Config dashboard on AWS Organizations](https://catalog.workshops.aws/awscid/en-US/dashboards/additional/config-resource-compliance-dashboard#aws-config-aggregator-dashboard). 