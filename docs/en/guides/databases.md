# Best Practices to monitor RDS and Aurora databases

### Summary 

>> Talk about RDS, Aurora, Monitoring in general, Metrics, Logging and Performance monitoring for debugging. 

Monitoring is critical part of maintaining the reliability, availability, and performance of Amazon RDS and Aurora database clusters. AWS provides several tools for monitoring your Amazon RDS resources and responding to potential incidents:

Logs, Metrics, Alarms, DevOps Guru etc

### CloudWatch Metrics

CloudWatch Metrics is a critical tool for monitoring and managing your RDS and Aurora databases. It provides valuable insights into database performance and helps you identify and resolve issues quickly. Amazon RDS sends metrics to CloudWatch for each active database instance every minute. Monitoring is enabled by default. For example, Amazon RDS sends CPU utilization, the number of database connections in use, freeable memory, network throughput, read and write IOPS information, and more.

By default, Amazon RDS publishes instance-level metrics metrics to Amazon CloudWatch in the AWS/RDS 

https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-metrics.html

Here are some best practices for using CloudWatch Metrics:

* Configure CloudWatch Metrics to monitor all critical metrics for your databases, such as CPU utilization, disk space, and database connections.
* Set up alarms to alert you when these metrics reach critical thresholds, and take action to resolve any issues as quickly as possible.
* Use CloudWatch Metrics to identify trends or patterns in your database performance, and use this information to optimize your configurations and improve your application's performance.
* Use CloudWatch Logs to capture log data from your RDS and Aurora instances and analyze it for insights into your application's behavior and performance.
Enhanced Monitoring

### CloudWatch Alarms
Using Amazon CloudWatch alarms, you watch a single metric over a time period that you specify. If the metric exceeds a given threshold, a notification is sent to an Amazon SNS topic or AWS Auto Scaling policy. CloudWatch alarms do not invoke actions because they are in a particular state. Rather the state must have changed and been maintained for a specified number of periods.


###  Enhanced Monitoring

Enhanced Monitoring is a feature of RDS and Aurora that enables you to get metrics in real time for the operating system (OS) that your DB instance runs on. When you want to see how different processes or threads use the CPU on your database instance, Enhanced Monitoring metrics are useful. By default, RDS delivers the metrics from Enhanced Monitoring into your Amazon CloudWatch Logs account. You can create metrics filters in CloudWatch from CloudWatch Logs and display the graphs on the CloudWatch dashboard.

Enhanced Monitoring is available for the following database engines:
*MariaDB
*Microsoft SQL Server
*MySQL
*Oracle
*PostgreSQL

**Different between CloudWatch and Enhanced Monitoring?**
CloudWatch gathers metrics about CPU utilization from the hypervisor for a DB instance. In contrast, Enhanced Monitoring gathers its metrics from an agent on the DB instance. A hypervisor creates and runs virtual machines (VMs). Using a hypervisor, an instance can support multiple guest VMs by virtually sharing memory and CPU. You might find differences between the CloudWatch and Enhanced Monitoring measurements, because the hypervisor layer performs a small amount of work. The differences can be greater if your DB instances use smaller instance classes. In this scenario, more virtual machines (VMs) are probably managed by the hypervisor layer on a single physical instance.


To learn about all the OS metrics available using CloudWatch Logs, please refer below:

https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_Monitoring-Available-OS-Metrics.html



Here are some best practices for using Enhanced Monitoring:

* Enable Enhanced Monitoring for all of your RDS and Aurora instances, and configure it to monitor all relevant metrics.
* Use Enhanced Monitoring to identify performance bottlenecks and troubleshoot issues with your databases.
* Monitor your databases at a high frequency using Enhanced Monitoring to get real-time insights into database performance.
* Performance Insights

https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_Monitoring.OS.html

### Performance Insights 

Performance Insights is a tool that helps you analyze database performance data and identify performance issues. It provides a visual representation of database performance metrics and helps you troubleshoot issues quickly. Here are some best practices for using Performance Insights:

* Enable Performance Insights for all of your RDS and Aurora instances.
* Use Performance Insights to identify performance bottlenecks and troubleshoot issues with your databases.
* Use the query profiling feature of Performance Insights to identify slow-running queries and optimize database performance.

### DevOps Guru for RDS

DevOps Guru for RDS is a powerful tool that can help you proactively identify and resolve issues with your RDS and Aurora databases. Here are some best practices for using DevOps Guru for RDS:

* Configure DevOps Guru to monitor all of your RDS and Aurora instances, and set up alerts to notify you of any anomalies or issues.
* Use the DevOps Guru dashboard to monitor your database performance, and look for patterns or trends that may indicate issues or opportunities for optimization.
* Use the recommendations provided by DevOps Guru to improve your database performance and optimize your configurations.

### Database Audit Logs

Database Audit Logs provide a detailed record of all actions taken on your RDS and Aurora databases, enabling you to monitor for unauthorized access, data changes, and other potentially harmful activities. Here are some best practices for using Database Audit Logs:

* Enable Database Audit Logs for all of your RDS and Aurora instances, and configure them to capture all relevant data.
* Use a centralized log management solution, such as Amazon CloudWatch Logs or Amazon Kinesis Data Streams, to collect and analyze your Database Audit Logs.
* Monitor your Database Audit Logs regularly for suspicious activity, and take action to investigate and resolve any issues as quickly

### Database Slow Query and Error Logs

Slow query logs help you find slow-performing queries in the database so you can investigate the reasons behind the slowness and tune the queries if needed. Error logs help you to find the query errors, which further helps you find the changes in the application due to those errors. 

Monitoring the slow query log and error log by creating a CloudWatch dashboard using Amazon CloudWatch Logs Insights (which enables you to interactively search and analyze your log data in Amazon CloudWatch Logs). 

### Amazon Managed Grafana
Amazon Managed Grafana is a fully managed service that makes it easy to visualize and analyze data from RDS and Aurora databases. Here are some best practices for using Amazon Managed Grafana:

* Use Amazon Managed Grafana to create dashboards that provide insights into your database performance and health.
* Use Amazon Managed Grafana to visualize data from CloudWatch Metrics, Enhanced Monitoring, and Performance Insights.
* Use Amazon Managed Grafana to create alerts based on specific metrics, so you can be notified when performance issues arise.

![image.png](../images/amg-rds-aurora.png)


###  AWS CloudTrail Logs

CloudTrail provides a record of actions taken by a user, role, or an AWS service in Amazon RDS. CloudTrail captures all API calls for Amazon RDS as events, including calls from the console and from code calls to Amazon RDS API operations. Using the information collected by CloudTrail, you can determine the request that was made to Amazon RDS, the IP address from which the request was made, who made the request, when it was made, and additional details. For more information, see Monitoring Amazon RDS API calls in AWS CloudTrail.

## Reference material / Call to action

[Blog - Monitor RDS and Aurora databases with Amazon Managed Grafana](https://aws.amazon.com/blogs/mt/monitoring-amazon-rds-and-amazon-aurora-using-amazon-managed-grafana/)

[Video - Monitor RDS and Aurora databases with Amazon Managed Grafana](https://www.youtube.com/watch?v=Uj9UJ1mXwEA)

[Blog - Monitor RDS and Aurora databases with Amazon CloudWatch](https://aws.amazon.com/blogs/database/creating-an-amazon-cloudwatch-dashboard-to-monitor-amazon-rds-and-amazon-aurora-mysql/)

[Blog - Build proactive database monitoring for Amazon RDS with Amazon CloudWatch Logs, AWS Lambda, and Amazon SNS](https://aws.amazon.com/blogs/database/build-proactive-database-monitoring-for-amazon-rds-with-amazon-cloudwatch-logs-aws-lambda-and-amazon-sns/)

[Official Doc - Amazon Aurora Monitoring Guide](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/MonitoringOverview.html)

[Hands-on Workshop - Observe and Identify SQL Perfomrance Issues in Amazon Aurora](https://awsauroralabsmy.com/provisioned/perf-observability/)


