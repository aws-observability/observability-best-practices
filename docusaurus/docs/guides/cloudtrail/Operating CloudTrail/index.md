---
sidebar_position: 1
---
# Operating CloudTrail

AWS CloudTrail can log, continuously monitor, and retain account activity related to actions across your AWS infrastructure. It will also give you a history of AWS calls for your account, including API calls made through the AWS Management Console, AWS SDKs, and command line tools. As a result, you can identify:

*   Which users and accounts called AWS APIs for services that support CloudTrail.
*   The source IP address the calls were made from.
*   When the calls occurred.

CloudTrail is enabled on your AWS account when you create it and provides an event history of all management event activity from the past 90 days. AWS recommends that you create a trail or an event data store for Lake to retain events for more than 90 days with in your AWS environment.  The following will outline some overall best practices for CloudTrail and then in the following sections will provide best practices for specific areas in CloudTrail such as CloudTrail Trails and CloudTrail Lake. 

### Register the security or logging account as a delegated administrator for CloudTrail
CloudTrail allows to configure up to 3 delegated administrators to manage the organization’s trails and Lake event data stores. A delegated administrator has permission to manage resources on behalf of the organization. Delegated administrator support enables flexibility for customers by allowing the management account to delegate CloudTrail administrative actions to an organization member account, such as a security or logging account.

With this feature, the management account of an organization remains the owner of all CloudTrail organization resources, even when those organization trails or CloudTrail Lake event data store resources are created and managed through the delegated administrator account.  This helps customers with maintaining continuity of organization-wide CloudTrail audit logs while avoiding any disruption when changes are made to their organization in AWS Organizations.  By utilizing delegated administrator for CloudTrail it helps minimize users using the management account for CloudTrail related administrative tasks which helps improve your security and compliance posture.

### Use CloudTrail Insights to monitor anomalous API activity

AWS CloudTrail Insights helps AWS users identify and respond to unusual activity associated with API calls by continuously analyzing CloudTrail management events. If you have CloudTrail Insights enabled and CloudTrail detects unusual activity, Insights events are delivered to the destination S3 bucket for your trail or the event data store for CloudTrail Lake. You can also see the type of insight and the incident time period. Unlike other types of events captured in a trail, Insights events are logged only when CloudTrail detects changes in your account’s API usage that differ significantly from the account’s typical usage patterns. CloudTrail Insights integrates with Event Bridge, allowing you to create rules to trigger specific actions based on criteria such as sending an email notification or trigger a Lambda function. As a result, you can ensure that your teams stay informed of any unusual API activity.

![CloudTrail Insights](/img/cloudops/guides/cloudtrail/cloudtrail-insights.png "CloudTrail Insights")

### Managing CloudTrail costs
When using CloudTrail, remember to consider areas to help you manage your CloudTrail spending.  The following are some best practices help control cost for CloudTrail.

-   **AWS Budgets**: AWS Budgets helps track your CloudTrail spending. You can set up a cost-based budget in AWS Budgets based on the CloudTrail service. You can also set up budget alerts to notify you when you reach a certain budget threshold via email or AWS Chatbot.

![AWS Budgets](/img/cloudops/guides/cloudtrail/cloudtrail-budgets.png "AWS Budgets")

-   **AWS Cost Anomaly Detection**: AWS Cost Anomaly Detection helps you identify and resolve unexpected spikes in your AWS spending across your organization. You can create a monitor for the AWS CloudTrail service to track your spend. The service uses machine learning to analyze historical data to calculate expected daily spend and compares it to actual spend. When your CloudTrail actual spend exceeds the expected amount beyond a certain threshold, it identifies this as an anomaly and performs a root cause analysis. You can then act quickly if AWS Cost Anomaly Detection detects anomalies related to your CloudTrail spend. 

-   **Utilize Amazon S3 Bucket Keys to reduce the cost associated to SSE-KMS for the CloudTrail S3 bucket**:  When using object-level keys for Amazon S3 server-side encryption with AWS KMS (SSE-KMS), you should consider switching to Amazon S3 Bucket Keys to help reduce AWS KMS request costs by up to 99% by decreasing the request traffic from Amazon S3 to AWS KMS. This also significantly reduces the volume of events logged in CloudTrail, helping to reduce CloudTrail charges. Some additional key benefits of using S3 Bucket Keys: 
    *   **Simplified Management:** Bucket-level keys are easier to manage compared to individual object-level keys.
    *   **Performance Improvement**: Reduced API calls to KMS can lead to improved performance for operations involving encrypted objects.
    *   **Easy Implementation:** S3 Bucket Keys can be enabled with a few clicks in the AWS Management Console without requiring changes to client applications.

-   **Multiple Trails**: The ﬁrst copy of management events for an account is included with AWS Free Tier. If you create additional trails that deliver the same management events, those subsequent deliveries incur additional CloudTrail costs. If you need multiple trails, the following recommendation can help reduce the cost of additional trails for CloudTrail:

    *   **CloudTrail Lake**: Utilize CloudTrail Lake to ingest the additional copies of your management events.  Using CloudTrail Lake can reduce your overall charges by up to 90% for additional copies of management events.  
    
    *   **Exclude AWS Key Management Service (AWS KMS) and Amazon Relational Database Service (Amazon RDS) data API events**: For any additional copies of management events, it's recommended to also exclude AWS Key Management Service (AWS KMS) and Amazon Relational Database Service (Amazon RDS) data API events. Since you may not need more than one copy of these events.  These high-volume events can generate high costs and can be excluded withing your trails or event data store page under the management filters. 

-   **Advanced Event Selectors for Data Events**: When you use data events, advanced event selectors can oﬀer granular control of data event logging. Advanced event selectors also support including or excluding values with pattern matching on partial strings. This provides enhanced control over which CloudTrail data events you want to log and pay for. For example, you can log Amazon S3 DeleteObject APIs to narrow down the CloudTrail events you receive to solely destructive actions. This can assist in identifying security issues while controlling costs.
