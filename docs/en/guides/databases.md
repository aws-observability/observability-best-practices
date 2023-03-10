# Monitor Amazon RDS and Aurora databases

Monitoring is critical part of maintaining the reliability, availability, and performance of Amazon RDS and Aurora database clusters. AWS provides several tools for monitoring health of your Amazon RDS and Aurora databases resources, detect issues before they become critical and optimize performance for consistent user experiance.  This guide provides the observability best practices to ensure your databases are running smoothly. 

## Performance guidelines

As a best practice, you want to start with establishing a baseline for your workloads. Acceptable values for performance metrics depend on how your application is doing relative to your baseline. Then, you can investigate consistent or trending variances from your baseline. 

In general, the following metrics are often the source of performance issues:

**High CPU or RAM consumption** – High values for CPU or RAM consumption might be appropriate, if they're in keeping with your goals for your application (like throughput or concurrency) and are expected.

**Disk space consumption** – Investigate disk space consumption if space used is consistently at or above 85 percent of the total disk space. See if it is possible to delete data from the instance or archive data to a different system to free up space.

**Network traffic** – For network traffic, talk with your system administrator to understand what expected throughput is for your domain network and internet connection. Investigate network traffic if throughput is consistently lower than expected.

**Database connections** – If you see high numbers of user connections and also decreases in instance performance and response time, consider constraining database connections. The best number of user connections for your DB instance varies based on your instance class and the complexity of the operations being performed. To determine the number of database connections, associate your DB instance with a parameter group where the User Connections parameter is set to a value other than 0 (unlimited). You can either use an existing parameter group or create a new one. 

**IOPS metrics** – The expected values for IOPS metrics depend on disk specification and server configuration, so use your baseline to know what is typical. Investigate if values are consistently different than your baseline. For best IOPS performance, make sure that your typical working set fits into memory to minimize read and write operations.

When performance falls outside your established baseline, you might need to make changes to optimize your database availability for your workload. For example, you might need to change the instance class of your DB instance. Or you might need to change the number of DB instances and read replicas that are available for clients.


## Monitoring Options

### Amazon CloudWatch metrics

CloudWatch Metrics is a critical tool for monitoring and managing your RDS and Aurora databases. It provides valuable insights into database performance and helps you identify and resolve issues quickly. Amazon RDS sends metrics to CloudWatch for each active database instance at 1 minute granularity. Monitoring is enabled by default. It is available for 15 days. Amazon RDS publishes instance-level metrics metrics to Amazon CloudWatch in the AWS/RDS namespace.

Using CloudWatch Metrics, you can identify trends or patterns in your database performance, and use this information to optimize your configurations and improve your application's performance. Here are few of the key metrics which you want to monitor :

* CPU Utilization
* DB Connections
* Free Memory
* Network throughput
* Read/Write Latency
* Read/Write IOPS

Then, you can set up alarms to alert you when these metrics reach critical thresholds, and take action to resolve any issues as quickly as possible. 

![db_cw_metrics.png](../images/db_cw_metrics.png)

For more information on CloudWatch metrics, go to https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-metrics.html .

#### CloudWatch Log Insights

You can use CloudWatch Logs to capture log data from your RDS and Aurora instances and analyze it for insights into your application's behavior and performance.

> TODO: add more details

> TODO: Add dashboard image

#### CloudWatch Alarms
Using Amazon CloudWatch alarms, you watch a single metric over a time period that you specify. If the metric exceeds a given threshold, a notification is sent to an Amazon SNS topic or AWS Auto Scaling policy. CloudWatch alarms do not invoke actions because they are in a particular state. Rather the state must have changed and been maintained for a specified number of periods.

> TODO: Add dashboard image

#### Database Audit Logs

Database Audit Logs provide a detailed record of all actions taken on your RDS and Aurora databases, enabling you to monitor for unauthorized access, data changes, and other potentially harmful activities. Here are some best practices for using Database Audit Logs:

* Enable Database Audit Logs for all of your RDS and Aurora instances, and configure them to capture all relevant data.
* Use a centralized log management solution, such as Amazon CloudWatch Logs or Amazon Kinesis Data Streams, to collect and analyze your Database Audit Logs.
* Monitor your Database Audit Logs regularly for suspicious activity, and take action to investigate and resolve any issues as quickly

#### Database Slow Query and Error Logs

Slow query logs help you find slow-performing queries in the database so you can investigate the reasons behind the slowness and tune the queries if needed. Error logs help you to find the query errors, which further helps you find the changes in the application due to those errors. 

Monitoring the slow query log and error log by creating a CloudWatch dashboard using Amazon CloudWatch Logs Insights (which enables you to interactively search and analyze your log data in Amazon CloudWatch Logs). 

## Open-source Observability Tools

#### Amazon Managed Grafana
Amazon Managed Grafana is a fully managed service that makes it easy to visualize and analyze data from RDS and Aurora databases. Here are some best practices for using Amazon Managed Grafana:

* Use Amazon Managed Grafana to create dashboards that provide insights into your database performance and health.
* Use Amazon Managed Grafana to visualize data from CloudWatch Metrics, Enhanced Monitoring, and Performance Insights.
* Use Amazon Managed Grafana to create alerts based on specific metrics, so you can be notified when performance issues arise.

![image.png](../images/amg-rds-aurora.png)


## Performance Insights and operating-system metrics

####  Enhanced Monitoring

Enhanced Monitoring enables you to get finer grain metrics in real time for the operating system (OS) that your DB instance runs on. 

RDS delivers the metrics from Enhanced Monitoring into your Amazon CloudWatch Logs account. By default, these metrics are stored for 30 days and stored in RDSOSMetrics Log group in Amazon CloudWatch. You have to option to choose granularity in between 1s to 60s. You can create custom metrics filters in CloudWatch from CloudWatch Logs and display the graphs on the CloudWatch dashboard.

Enhanced monitoring also include the OS level process list. 

 Enhanced Monitoring is available currently for the following database engines:
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

![db-enhanced-monitoring.png](../images/db_enhanced_monitoring.png)

#### Performance Insights 

Performance Insights is a tool that helps you analyze database performance data and identify performance issues. It provides a visual representation of database performance metrics and helps you troubleshoot issues quickly. Here are some best practices for using Performance Insights:

* Enable Performance Insights for all of your RDS and Aurora instances.
* Use Performance Insights to identify performance bottlenecks and troubleshoot issues with your databases.
* Use the query profiling feature of Performance Insights to identify slow-running queries and optimize database performance.

Allow you to pin point on the root cause but rather than chasing symptoms.

![db_perf_insights.png](../images/db_perf_insights.png)

## ML Based Performance Bottlenecks detection

#### DevOps Guru for RDS

With DevOps Guru for RDS, you can monitor your databases for performance bottlenecks and operational issues. It uses Performance Insights metrics, analyzes them using Machine Learning (ML) to provide database-specific analyses of performance issues, and recommends corrective actions. When DevOps Guru for RDS detects a performance bottleneck or operational issue, it displays its findings in the DevOps Guru Console and sends notifications via AWS services, such as Amazon EventBridge and Amazon Simple Notification Service (SNS). This enables the developers to automatically manage and take real-time action on performance and operational issues before they become customer-impacting outages.

## Security Observability

####  AWS CloudTrail Logs

CloudTrail provides a record of actions taken by a user, role, or an AWS service in Amazon RDS. CloudTrail captures all API calls for Amazon RDS as events, including calls from the console and from code calls to Amazon RDS API operations. Using the information collected by CloudTrail, you can determine the request that was made to Amazon RDS, the IP address from which the request was made, who made the request, when it was made, and additional details. For more information, see Monitoring Amazon RDS API calls in AWS CloudTrail.

## MySQL Specific Options

* General Logs
* Slow query logs
* Processlist
* InnoDB Monitor
* Global Status
* Performance Schema
* Sys Schema
* Information_schema.Innodb_metrics

## PostgreSQL Specific Options
* Publish your database logs (Postgresql.log and Upgrade.log) to Amazon CloudWatch.
* Enable Query Logs. Query information will be included in the Postgresql.log file.
   - log_min_duration_statements
   - log_statement

   Query information will be included in the Postgresql.log file.

> TODO: Add CLI commands to do that

## References for more information

[Blog - Monitor RDS and Aurora databases with Amazon Managed Grafana](https://aws.amazon.com/blogs/mt/monitoring-amazon-rds-and-amazon-aurora-using-amazon-managed-grafana/)

[Video - Monitor RDS and Aurora databases with Amazon Managed Grafana](https://www.youtube.com/watch?v=Uj9UJ1mXwEA)

[Blog - Monitor RDS and Aurora databases with Amazon CloudWatch](https://aws.amazon.com/blogs/database/creating-an-amazon-cloudwatch-dashboard-to-monitor-amazon-rds-and-amazon-aurora-mysql/)

[Blog - Build proactive database monitoring for Amazon RDS with Amazon CloudWatch Logs, AWS Lambda, and Amazon SNS](https://aws.amazon.com/blogs/database/build-proactive-database-monitoring-for-amazon-rds-with-amazon-cloudwatch-logs-aws-lambda-and-amazon-sns/)

[Official Doc - Amazon Aurora Monitoring Guide](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/MonitoringOverview.html)

[Hands-on Workshop - Observe and Identify SQL Perfomrance Issues in Amazon Aurora](https://awsauroralabsmy.com/provisioned/perf-observability/)


