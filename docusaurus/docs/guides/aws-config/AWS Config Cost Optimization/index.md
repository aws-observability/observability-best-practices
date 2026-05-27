---
sidebar_position: 4
---
# AWS Config Cost Optimization

### Pricing

[AWS Config pricing](https://aws.amazon.com/config/pricing/) is primarily based on two main dimensions:

1. Configuration Item Recording : 

    * Continuous Recording
        Continuously monitors and records every configuration change in your AWS environment in real-time. This provides comprehensive visibility into all resource modifications, allowing you to track and audit changes as they occur. 
    * Periodic Recording
        Takes daily snapshots of your resource configurations, recording changes only when they differ from the previous 24-hour state. This approach offers a balance between oversight and cost efficiency, capturing significant changes while reducing data volume. 

1. Rule and Conformance Pack Evaluations:
    AWS Config charges for config rule evaluations, individual or as part of a conformance pack.

For current details on AWS Config pricing, [please refer to this link](https://aws.amazon.com/config/pricing/).

While the above are the primary pricing components, other factors can influence the total cost of using AWS Config:

1. [AWS Lambda](https://aws.amazon.com/lambda/pricing/) costs: If you're using custom rules implemented via Lambda functions, standard Lambda pricing applies.
2. [Amazon S3](https://aws.amazon.com/s3/pricing/) storage: Costs are incurred for storing configuration snapshots and history files in S3.
3. Data Transfer: Charges may apply for data transfer between AWS services or regions.



### Cost Optimization recommendations

#### Analyzing Config Costs

[AWS Cost Explorer](https://aws.amazon.com/aws-cost-management/aws-cost-explorer/) provides insights into AWS Config costs by filtering service usage and analyzing cost dimensions.  To do so, navigate to your  [Billing and Cost Management console](https://us-east-1.console.aws.amazon.com/costmanagement/home#/home) and select **Cost Explorer** from left panel. From right panel, configure parameters such as your desired time and choose your preferred granularity (daily or monthly) based on the level of detail you need. Select **Usage Type** from **Dimensions** under **Group by** section. Under **Filters**, navigate to **Service** and choose **Config**.

![AWS Config Cost Visualization](/img/cloudops/guides/config/configcost.png)

[Amazon CloudWatch's](https://aws.amazon.com/cloudwatch/) "ConfigurationItemsRecorded" metric helps identify resource types generating the most configuration items.  Please refer to blog on [how to analyze AWS Config Resource Changes Using CloudWatch Metrics](https://aws.amazon.com/blogs/mt/analyzing-aws-config-resource-changes-using-cloudwatch-metrics/).  For detailed analysis, [Amazon Athena](https://aws.amazon.com/athena/) can be used to query [Cost and Usage Reports](https://aws.amazon.com/aws-cost-management/aws-cost-and-usage-reporting/) with [AWS CloudTrail](https://aws.amazon.com/cloudtrail/) and [CloudTrail Lake](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-lake.html) to help estimate config recorder costs and track frequently evaluated rules. Please refer to blog on how to [use Athena to Analyze AWS Config Data](https://aws.amazon.com/blogs/mt/use-amazon-athena-and-aws-cloudtrail-to-estimate-billing-for-aws-config-rule-evaluations/)

For cost alerts,  implement proactive cost management through [AWS Budgets](https://aws.amazon.com/aws-cost-management/aws-budgets/) when costs exceed predefined thresholds.  Also, [AWS Cost Anomaly Detection](https://aws.amazon.com/aws-cost-management/aws-cost-anomaly-detection/) service provides continuous monitoring for unusual spending patterns, making it easier to identify and address cost spikes quickly. You can also create [CloudWatch billing alarms](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/monitor_estimated_charges_with_cloudwatch.html) that notify you when your estimated charges exceed a defined threshold.  

#### Choosing Between Continuous and Periodic Recording

When implementing AWS Config, selecting the appropriate recording method is crucial for balancing costs with compliance requirements. [Continuous recording](https://docs.aws.amazon.com/config/latest/developerguide/config-concepts.html#continuous-recording) is often more cost-effective for static workloads where resources remain relatively stable over time. This option is particularly recommended for environments with stringent security and compliance requirements that demand real-time monitoring and immediate visibility into configuration changes. Critical infrastructure components, such as production databases, core networking resources, or sensitive data processing systems, typically benefit from continuous recording. On the other hand, [periodic recording](https://docs.aws.amazon.com/config/latest/developerguide/config-concepts.html#periodic-recording) can be more economical for highly dynamic workloads, such as ephemeral resources in containerized environments or infrastructure that frequently scales up and down. Examples include development environments using auto-scaling groups, container orchestration platforms, or temporary testing environments. However, it's important to note that periodic recording should only be implemented for workloads with lower compliance requirements, as it provides updates on a 24-hour basis rather than in real-time. Also for periodic recording, the cost per configuration item delivered is higher than in continuous recording, so in certain scenarios, the total cost of periodic recording might actually exceed that of continuous recording. The choice between these recording methods often aligns with specific use cases, such as operational planning where periodic snapshots might suffice, or compliance auditing where continuous monitoring is necessary. Organizations should carefully evaluate their security requirements, operational patterns, and budget constraints when making this decision.


#### Resource Exclusion

AWS Config offers cost optimization through [resource exclusion](https://docs.aws.amazon.com/config/latest/developerguide/select-resources.html) capability, allowing organizations to strategically manage their configuration monitoring costs. By excluding specific resource types that are less relevant to your risk profile or those generating high volumes of configuration items, you can significantly reduce costs while maintaining essential security monitoring. This feature can be accessed and configured through the AWS Config settings in the AWS Management Console and CLI. However, you should approach resource exclusion with careful consideration and proper stakeholder involvement. Organizations should engage their security and operations teams to conduct a thorough assessment of which resources are critical for monitoring and compliance requirements, and which can be safely excluded. The goal is to strike an optimal balance between cost efficiency and maintaining robust governance posture. For example, while temporary development resources might be candidates for exclusion, critical production infrastructure should typically remain under continuous monitoring. Before implementing any exclusions, it's recommended to review [AWS's Security Best Practices](https://docs.aws.amazon.com/config/latest/developerguide/security-best-practices.html) and consult the [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/) to ensure your decisions align with security and compliance requirements. Additionally, organizations should regularly review their exclusion policies as business needs and security requirements evolve over time. 

It's worth noting that [AWS Control Tower](https://aws.amazon.com/controltower/) currently doesn't support config recorder customization. However, there is a workaround as [outlined in this blog](https://aws.amazon.com/blogs/mt/customize-aws-config-resource-tracking-in-aws-control-tower-environment/) for customizing AWS Config resource tracking in Control Tower environments until native support is added.


#### Top Configuration Items

At times [AWS::Config::ResourceCompliance](https://docs.aws.amazon.com/config/latest/developerguide/view-compliance-history.html) is often one of the most impactful CI generators, especially for customers with numerous rule evaluations. This resource type provides a timeline view of compliance status in the AWS Config console. While it offers valuable insights, it can significantly increase configuration item costs, particularly when evaluating large resources. If that is the case, you can consider its exclusion to reduce costs.

For historical compliance checks, customers can utilize CloudTrail data as a cost-free alternative. Your customers can alter the below query to work with either Athena, 3rd party solutions, or use it in CloudTrail Lake if they have it enabled. 


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



#### AWS Config Indirect Relationship

There are two types of relationships AWS Config:
Direct Relationships:

* Straightforward A→B relationship extracted from a  resource's configuration data
* Pulled directly from the describe API calls
* Example: The relationship between an Amazon EC2  instance and its security group is direct because the security groups are  included in the describe API response for the Amazon EC2 instance.

Indirect Relationships:

* Older resource types might have their configuration recorded  by examining multiple resources configurations
* Example: The relationship between a security  group and an Amazon EC2 instance is indirect because describing a security  group does not return any information about the instances it is associated  with. In this case AWS Config  creates two configuration items.

You can learn more about what resources support indirect relationships [in this link](https://docs.aws.amazon.com/config/latest/developerguide/faq.html).

To opt out of indirect relationships,  we recommend you reach out to your [Technical Account Manager](https://aws.amazon.com/premiumsupport/plans/enterprise/).

#### Rule Management and Evaluation Considerations 

When managing AWS Config rules, consider rule deletion and re-evaluation actions, as these can significantly impact costs. When deleting rules that evaluate large numbers of resources, a cost-effective approach is to first stop [resource compliance recording](https://docs.aws.amazon.com/config/latest/developerguide/stop-start-recorder.html), then delete the rules, and finally restart the compliance recording. This action will not impact your stored data but will impact your visibility into resource configuration while recorder is stopped. This sequential process helps prevent unnecessary spikes in configuration item generation and associated costs.

#### API Call Optimization 

Efficient API operations can reduce AWS Config costs. When modifying resources, such as adding multiple tags to an [EC2 instance](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/Using_Tags.html), it's recommended to consolidate changes into a single API call rather than making multiple individual calls. For example, adding 10 tags in one API call is more efficient than making 10 separate calls, as each call generates both an API change record and a resource compliance configuration item.

#### Custom Rules and Lambda Function Optimization 

For custom rule implementation, using [CloudFormation Guard](https://docs.aws.amazon.com/cfn-guard/latest/ug/what-is-guard.html) is preferred over Lambda functions to reduce execution costs. However, if Lambda-based custom rules are necessary, optimize them by:

* Narrowing the scope of evaluated resources using specific targeting. Scope based rules are only supported for event-based evaluations not periodic 
* Implementing resource tagging for better control
* Adding logic to handle the termination of evaluation for deleted resources
* Using resource-specific triggers rather than evaluating all resources

#### Conformance Pack and Rule Deduplication 

Regular auditing of rules and [conformance packs](https://docs.aws.amazon.com/config/latest/developerguide/conformance-packs.html) is essential to eliminate redundancy.  For instance, if multiple conformance packs include the same rule (such as CloudTrail enablement checks) that's already being evaluated by [AWS Security Hub](https://aws.amazon.com/security-hub/), consider removing the duplicate rules to avoid unnecessary evaluation costs. Review and consolidate overlapping rules across different compliance standards to maintain effectiveness while optimizing costs. Please follow [this blog to discover duplicate AWS Config rules](https://aws.amazon.com/blogs/security/discover-duplicate-aws-config-rules-for-streamlined-compliance/).

#### Optimizing Global Resource Recording in AWS Config

When implementing AWS Config across multiple regions, you can optimize the recording of global resources to control costs and prevent duplicate data collection. The best practice is to limit global resource recording to a single region within your AWS environment. This can be managed through AWS CloudFormation templates by setting the 'IncludeGlobalResourceTypes' property to 'true' in only one designated region. This approach is important for resources like IAM users, roles, and policies that are global in nature. By implementing this approach, organizations can avoid unnecessary duplication of global resource recording across multiple regions, leading to significant cost savings while maintaining comprehensive visibility into their global resources. 

#### Integrated Services Optimization 

AWS Config interacts with various AWS services, each contributing to the overall cost. Implement best practices for these integrated services to optimize their individual costs: