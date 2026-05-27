---
sidebar_position: 2
---
# CloudTrail Trails

AWS CloudTrail monitors and records account activity throughout your AWS infrastructure to provide you with control over storage, analysis, and remediation actions. A trail is a configuration that helps deliver CloudTrail events to an Amazon Simple Storage Service (Amazon S3) bucket that you specify. 

CloudTrail offers three types of trails for monitoring and recording account activity in your AWS infrastructure. The first type is a multi-Regional trail that captures activity from all AWS Regions. By default, when creating a trail through the AWS Management Console, it applies to all Regions. The second type is a single-Region trail, exclusively available in the AWS CLI, that captures activity in a specific Region. However, we recommend using multi-Region trails for broader coverage.

Lastly, there is the organizational trail that applies to all AWS accounts within your organization when using the AWS Organizations service. This type of trail provides comprehensive coverage and centralized monitoring in a multi-account environment. 

By using these trail types, you can taylor your CloudTrail setup to meet your monitoring and recording requirements. You can do this at a Regional level or across your entire organization.  The following are some best practices for CloudTrail Trails.

### Configure CloudTrail in all AWS accounts and Regions

To get a complete record of events taken by a user, role, or service in AWS accounts, configure each trail to log events in all AWS Regions. Set up these trails in every AWS account used by your company or organization. This setup ensures every event is logged, regardless of the AWS Region where the event occurred. As a result, you can detect unexpected activity in otherwise unused Regions. Global service events (for example, AWS Identity and Access Management and Amazon Route 53) are also included and logged. If you create a trail that applies to all Regions, any new AWS Region is included automatically. If you have a multi-account setup through AWS Organizations, you can create a trail that logs all events for all AWS accounts in that organization.

### Set up separate trails for different use cases

CloudTrail supports use cases such as auditing, security monitoring, and operational troubleshooting. AWS recommends that you set up multiple trails for each use case so that you can provide each team with the knowledge they need. To do this, create trails for different users to manage. The trails can be configured to deliver log files to separate S3 buckets. For example, a security administrator can create a trail that applies to all Regions and encrypt the log files with one AWS Key Management Service (AWS KMS) key, and enable log file validation. A developer at the same company can create a trail that applies to one Region only and configure Amazon CloudWatch alarms to receive notifications of specific API activity.

### Configure CloudTrail logs to be delivered to an S3 bucket in a separate security boundary with limited access (a separate AWS account)

For auditing purposes, when you store log files in a dedicated S3 bucket in a separate administrative domain, you can enforce strict security controls and segregation of duties. Restricting access to this S3 bucket will decrease the chances of unauthorized and unfettered access to the logs. When you have these controls in place, if any AWS account credentials become compromised, the logs won’t be lost because they are stored in a separate domain. 

### Enable MFA-delete and versioning on the Amazon S3 Bucket storing log files

With multi-factor authentication (MFA) configured on this S3 bucket, you can ensure that additional authentication is required to permanently delete the bucket or an object in the bucket. In addition to MFA, versioning-enabled buckets can help you recover objects from accidental deletion or overwrite. For example, if you delete an object, Amazon S3 inserts a delete marker instead of removing the object permanently. Even though most AWS users and admins do not have any malicious intent, somebody could accidentally delete an S3 bucket that stores critical log files. When you add these safeguards, you can decrease the risk of compromised log files.

### Enable CloudTrail log file integrity validation

CloudTrail log file integrity validation lets you know if a log file has been deleted or changed. You can also use this validation to confirm that no log files were delivered to your account during a given period. These insights are valuable in security and forensic investigations. They provide an additional layer of protection to ensure the integrity of the log files. CloudTrail log file integrity validation uses industry standard algorithms: SHA-256 for hashing and SHA-256 with RSA for digital signing, which makes it computationally unfeasible to modify log files without detection. 

### Encrypt CloudTrail log files at rest

By default, the log files delivered by CloudTrail to your bucket are encrypted by Amazon server-side encryption with Amazon S3-managed encryption keys (SSE-S3). To provide a security layer that is directly manageable, you can instead use server-side encryption with AWS KMS-managed keys (SSE-KMS) for your CloudTrail log files.

### Turn on data events for trails

Data events provide visibility into the resource operations performed on or in S3 and AWS Lambda. These events are also known as data plane operations. Data events are often high-volume activities, especially if you are storing sensitive data on S3 or have key business operations occurring through Lambda functions. Visibility into any unexpected access to sensitive data lets you take corrective action to protect your data. Because some compliance reports (for example, FedRAMP and PCI-DSS ) require data events to be turned on, AWS recommends that you use AWS Config managed rules or an appropriate Conformance Pack Sample Templates to check that at least one trail is logging S3 data events for all S3 buckets. 

### Use advanced event selectors with data events

When you use data events, advanced event selectors offer more granular control of data event logging. With advanced event selectors, you can include or exclude values on fields such as EventSource, EventName, and ResourceARN. Advanced event selectors also support including or excluding values with pattern matching on partial strings, similar to regular expressions. This provides more control over which CloudTrail data events you want to log and pay for. For example, you can log S3 DeleteObject APIs to narrow the CloudTrail events you receive to only destructive actions to identify security issues while controlling costs. Keep in mind that when you use CloudTrail for auditing, it is a best practice to record all data events. However, when you use data events for operational monitoring or other use cases, advanced event selectors can be very helpful.

### Integrate CloudTrail with Amazon CloudWatch Logs

Amazon CloudWatch helps you collect monitoring and operational data in the form of logs, metrics, and events. When you integrate CloudTrail with CloudWatch Logs, you can monitor and receive alerts for specific events captured by CloudTrail in near real time. For example, you can set up alarms and notifications for anomalous AWS API activity. 

When you integrate CloudTrail with CloudWatch Logs, you can also visualize data produced by CloudWatch Insights. These insights allow you to extract the data you need, which simplifies the process of querying. For example, you can use CloudWatch Logs to stream the logs to Amazon Elasticsearch Service in near real time, and then access the Kibana endpoint to visualize the data.

### Apply Trails to all Regions
To capture all actions performed by an IAM identity or service in your AWS account, configure each trail to log events in all Regions. By logging events in all Regions, you ensure that all events that occur in your AWS account are logged, regardless of which Region they occur in.

### Deliver CloudTrail logs to a central S3 bucket
Configure CloudTrail logs to be delivered to a central S3 bucket in a separate AWS account with limited access. You can define an Amazon S3 access policy to limit the permissions of who can access the logs delivered by CloudTrail. This can help minimize unauthorized access to the logs.

### Configure data protection on S3 bucket storing log files 
To do this, perform the following actions:

*   Turn on multi-factor authentication (MFA) to add an extra level of security to the S3 bucket. MFA requires two forms of authentication for any requests made to delete the bucket or objects in the bucket. 
*   Turn on versioning on the S3 bucket to help recover objects from unwanted deletions or changes. Adding this extra layer of protection can help reduce the risk of changes to your files. 
*   Turn on encryption for CloudTrail log files to add an additional safeguard to encrypt the log files delivered to your S3 bucket. 
*   Configure log file validation to ensure that the log files delivered by CloudTrail did not change after they were delivered.

### Configure object lifecycle management on the S3 bucket
The trail for CloudTrail default is to store log files indefinitely in the S3 bucket configured for the trail. You can use the Amazon S3 object lifecycle management rules to define your own retention policy to better meet your business and auditing needs. For example, you might want to archive log files that are over 1 year old to a different storage tier like Amazon Simple Storage Service Glacier (Amazon S3 Glacier). Another example is to delete log files after a certain amount of time has passed.

### Limit access to the AWSCloudTrail_FullAccess policy
Following are some of the reasons to limit access to this policy:

*   Users with the AWSCloudTrail_FullAccess policy can disable or reconfigure the critical and significant auditing functions in their AWS accounts.
*   This policy is not intended to be shared or applied broadly to IAM identities in your AWS account. Limit the application of this policy to individuals who you expect to act as AWS account administrators. 

