# Reducing CloudWatch cost

## GetMetricData

Typically `GetMetricData` is caused by calls from 3rd party Observability tools and/or cloud financial tools using the CloudWatch Metrics in their platform. 

- Consider reducing the frequency with which the 3rd party tool is making requests. For example, reducing frequency from 1 min to 5 mins should result in a 1/5 (20%) of the cost.
- To identify the trend, consider turning off any data collection from 3rd party tools for a short while.

## CloudWatch Logs 

- Find the top contributors using this [knowledge center document][log-article].
- Reduce the logging level of top contributors unless deemed necessary.
- Find out if you are using 3rd party tooling for logging in addition to Cloud Watch.
- VPC Flow Log costs can add up quick if you have enabled it on every VPC and has a lot of traffic. If you still need it, consider delivering it to Amazon S3.
- See if logging is necessary on all AWS Lamda functions. If it’s not, deny “logs:PutLogEvents” permissions in the Lambda role.
- CloudTrail logs are often a top contributor. Sending them to Amazon S3 and using Amazon Athena to query and Amazon EventBridge for alarms/notifications is cheaper.

Refer this [knowledge center article][article] for further details.


[article]: https://aws.amazon.com/premiumsupport/knowledge-center/cloudwatch-understand-and-reduce-charges/
[log-article]: https://aws.amazon.com/premiumsupport/knowledge-center/cloudwatch-logs-bill-increase/




