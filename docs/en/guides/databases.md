# Best Practices to monitor RDS and Aurora databases

### CloudWatch Metrics

CloudWatch Metrics is a critical tool for monitoring and managing your RDS and Aurora databases. It provides valuable insights into database performance and helps you identify and resolve issues quickly. Amazon RDS sends metrics to CloudWatch for each active database instance every minute. Monitoring is enabled by default. For example, Amazon RDS sends CPU utilization, the number of database connections in use, freeable memory, network throughput, read and write IOPS information, and more.

Here are some best practices for using CloudWatch Metrics:

* Configure CloudWatch Metrics to monitor all critical metrics for your databases, such as CPU utilization, disk space, and database connections.
* Set up alarms to alert you when these metrics reach critical thresholds, and take action to resolve any issues as quickly as possible.
* Use CloudWatch Metrics to identify trends or patterns in your database performance, and use this information to optimize your configurations and improve your application's performance.
* Use CloudWatch Logs to capture log data from your RDS and Aurora instances and analyze it for insights into your application's behavior and performance.
Enhanced Monitoring

###  Enhanced Monitoring

Enhanced Monitoring is a feature of RDS and Aurora that provides a more detailed view of database performance metrics. It enables you to monitor metrics at a higher frequency and provides additional metrics that are not available through CloudWatch Metrics. Here are some best practices for using Enhanced Monitoring:

Enable Enhanced Monitoring for all of your RDS and Aurora instances, and configure it to monitor all relevant metrics.
Use Enhanced Monitoring to identify performance bottlenecks and troubleshoot issues with your databases.
Monitor your databases at a high frequency using Enhanced Monitoring to get real-time insights into database performance.
Performance Insights

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

## Reference material / Call to action

[Blog - Monitor RDS and Aurora databases with Amazon Managed Grafana](https://aws.amazon.com/blogs/mt/monitoring-amazon-rds-and-amazon-aurora-using-amazon-managed-grafana/)

[Video - Monitor RDS and Aurora databases with Amazon Managed Grafana](https://www.youtube.com/watch?v=Uj9UJ1mXwEA)

[Blog - Monitor RDS and Aurora databases with Amazon CloudWatch](https://aws.amazon.com/blogs/database/creating-an-amazon-cloudwatch-dashboard-to-monitor-amazon-rds-and-amazon-aurora-mysql/)

[Official Doc - Amazon Aurora Monitoring Guide](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/MonitoringOverview.html)

[Hands-on Workshop - Observe and Identify SQL Perfomrance Issues in Amazon Aurora](https://awsauroralabsmy.com/provisioned/perf-observability/)


