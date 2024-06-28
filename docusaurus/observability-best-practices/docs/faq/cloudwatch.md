# Amazon CloudWatch - FAQ

**Why should I choose Amazon CloudWatch?**

Amazon CloudWatch is an AWS cloud native service which provides unified observability on a single platform for monitoring AWS cloud resources and the applications you run on AWS. Amazon CloudWatch can be used to collect monitoring and operational data in the form of [logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html), track [metrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/working_with_metrics.html), [events](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/WhatIsCloudWatchEvents.html)and set [alarms](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html). It also provides a [unified view](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Dashboards.html) of AWS resources, applications, and services that run on AWS and [on-premises servers](https://aws.amazon.com/blogs/mt/how-to-monitor-hybrid-environment-with-aws-services/). Amazon CloudWatch helps you gain system-wide visibility into resource utilization, application performance, and operational health of your workloads. Amazon CloudWatch provides [actionable insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Insights-Sections.html) for AWS, hybrid, and on-premises applications and infrastructure resources. [Cross-account observability](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Unified-Cross-Account.html) is an addition to CloudWatch’s unified observability capability.

**Which AWS Services are natively integrated with Amazon CloudWatch and Amazon CloudWatch Logs?**

Amazon CloudWatch natively integrates with more than 70+ AWS services allowing customers to collect infrastructure metrics for simplified monitoring and scalability with no action. Please check the documentation for a complete list of supported [AWS services that publish CloudWatch metrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/aws-services-cloudwatch-metrics.html). Currently, more than 30 AWS services publish logs to CloudWatch. Please check the documentation for a complete list of supported [AWS services that publish logs to CloudWatch Logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/aws-services-sending-logs.html).

**Where do I get the list of all the published metrics from all AWS Services to Amazon CloudWatch?**

The list of all the [AWS Services that publish metrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/aws-services-cloudwatch-metrics.html) to Amazon CloudWatch is in AWS documentation.

**Where do I get started for collecting & monitoring metrics to Amazon CloudWatch?**

[Amazon CloudWatch collects metrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/working_with_metrics.html) from various AWS Services which can be viewed through [AWS Management Console, AWS CLI, or an API](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/viewing_metrics_with_cloudwatch.html). Amazon CloudWatch collects [available metrics](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/viewing_metrics_with_cloudwatch.html) for Amazon EC2 Instances. For additional custom metrics customers can make use of unified CloudWatch agent to collect and monitor.

> Related AWS Observability Workshop: [Metrics](https://catalog.workshops.aws/observability/en-US/aws-native/metrics)

**My Amazon EC2 Instance requires very granular level of monitoring, what do I do?**

By default, Amazon EC2 sends metric data to CloudWatch in 5-minute periods as Basic Monitoring for an instance. To send metric data for your instance to CloudWatch in 1-minute periods, [detailed monitoring](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-cloudwatch-new.html) can be enabled on the instance.

**I want to publish own metrics for my application. Is there an option?**

Customers can also publish their own [custom metrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/publishingMetrics.html) to CloudWatch using the API or CLI through standard resolution of 1 minute granularity or high resolution granularity down to 1 sec interval.

The CloudWatch agent also supports collecting custom metrics from EC2 instances in specialized scenarios like [Network performance metrics for EC2 instances](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-network-performance.html) running on Linux that use the Elastic Network Adapter (ENA), [NVIDIA GPU metrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-NVIDIA-GPU.html) from Linux servers and Process metrics using procstat plugin from [individual processes](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-procstat-process-metrics.html) on Linux & Windows servers.

> Related AWS Observability Workshop: [Public custom metrics](https://catalog.workshops.aws/observability/en-US/aws-native/metrics/publishmetrics)

**What more support is available for collecting custom metrics through Amazon CloudWatch agent?**

Custom metrics from applications or services can be retrieved using the unified CloudWatch agent with support for [StatsD](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-custom-metrics-statsd.html)or [collectd](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-custom-metrics-collectd.html)protocols. StatsD is a popular open-source solution that can gather metrics from a wide variety of applications. StatsD is especially useful for instrumenting own metrics, which supports both Linux and Windows based servers. collectd protocol is a popular open-source solution supported only on Linux Servers with plugins that can gather system statistics for a wide variety of applications.

**My workload contains lot of ephemeral resources and generates logs in high-cardinality, what is the recommended approach collecting and measuring the metrics and logs?**

[CloudWatch embedded metric format](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html) enables customers to ingest complex high-cardinality application data in the form of logs and to generate actionable metrics from ephemeral resources such as Lambda functions and containers. By doing so, customers can embed custom metrics alongside detailed log event data without having to instrument or maintain separate code, while gaining powerful analytical capabilities on your log data and CloudWatch can automatically extract the custom metrics to help visualize the data and set alarm on them for real-time incident detection.

> Related AWS Observability Workshop: [Embedded Metric Format](https://catalog.workshops.aws/observability/en-US/aws-native/metrics/emf)

**Where do I get started for collecting & monitoring logs to Amazon CloudWatch?**

[Amazon CloudWatch Logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html) helps customers monitor and troubleshoot systems and applications in near real time using existing system, application and custom log files. Customers can install the [unified CloudWatch Agent](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_GettingStarted.html) to collect [logs from Amazon EC2 Instances and on-premise servers](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html) to CloudWatch.

> Related AWS Observability Workshop: [Log Insights](https://catalog.workshops.aws/observability/en-US/aws-native/logs/logsinsights)

**What is CloudWatch agent and why should I use that?**

The [Unified CloudWatch Agent](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html) is an open-source software under the MIT license which supports most operating systems utilizing x86-64 and ARM64 architectures. The CloudWatch Agent helps collect system-level metrics from Amazon EC2 Instances & on-premise servers in a hybrid environment across operating systems, retrieve custom metrics from applications or services and collect logs from Amazon EC2 instances and on-premises servers.

**I’ve all scales of installation required in my environment, so how can the CloudWatch agent be installed normally and using automation?**

On all the supported operating systems including Linux and Windows Servers, customers can download and [install the CloudWatch agent](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-on-EC2-Instance.html) using the [command line](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/installing-cloudwatch-agent-commandline.html), using AWS [Systems Manager](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/installing-cloudwatch-agent-ssm.html), or using an AWS [CloudFormation template](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent-New-Instances-CloudFormation.html). You can also install the [CloudWatch agent on on-premise servers](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-on-premise.html) for monitoring.

**We have multiple AWS accounts in multiple regions in our Organization, does Amazon CloudWatch work for these scenarios.**

Amazon CloudWatch provides [cross-account observability](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Unified-Cross-Account.html)which helps customers monitor and troubleshoot health of resources and applications that span multiple accounts within a region. Amazon CloudWatch also provides a [cross-account, cross-region dashboard](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Cross-Account-Cross-Region.html). With this functionality customers can gain visibility and insights of their multi-account, multi-region resources and workloads.

**What kind of automation support is available for Amazon CloudWatch?**

Apart from accessing Amazon CloudWatch through the AWS Management Console customers can also access the service via API, [AWS command-line interface (CLI)](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) and [AWS SDKs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/sdk-general-information-section.html). [CloudWatch API](https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/Welcome.html) for metrics & dashboards help in automating through [AWS CLI](https://docs.aws.amazon.com/AmazonCloudWatch/latest/cli/Welcome.html)or integrating with software/products so that you can spend less time managing or administering the resources and applications. [CloudWatch API](https://docs.aws.amazon.com/AmazonCloudWatchLogs/latest/APIReference/Welcome.html) for logs along with [AWS CLI](https://docs.aws.amazon.com/cli/latest/reference/logs/index.html) are also available separately. [Code examples for CloudWatch using AWS SDKs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/service_code_examples.html) are available for customers for additional reference.

**I want to get started with monitoring resources quickly, what is the recommended approach?**

Automatic Dashboards in CloudWatch are available in all AWS public regions which provides an aggregated view of the health and performance of all AWS resources. This helps customers quickly get started with monitoring, resource-based view of metrics and alarms, and easily drill-down to understand the root cause of performance issues. [Automatic Dashboards](https://docs.aws.amazon.com/prescriptive-guidance/latest/implementing-logging-monitoring-cloudwatch/cloudwatch-dashboards-visualizations.html) are pre-built with AWS service recommended best practices, remain resource aware, and dynamically update to reflect the latest state of important performance metrics.

Related AWS Observability Workshop: [Automatic Dashboards](https://catalog.workshops.aws/observability/en-US/aws-native/dashboards/autogen-dashboard)

**I want to customize what I want to monitor in CloudWatch, what is the recommended approach?**

With [Custom Dashboard](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/create_dashboard.html) customers can create as many additional dashboards as they want with different widgets and customize it accordingly. When creating a custom dashboard, there are a variety of widget types that are available to pick and choose for customization.

Related AWS Observability Workshop: [Dashboarding](https://catalog.workshops.aws/observability/en-US/aws-native/ec2-monitoring/dashboarding)

**I’ve built few custom dashboards , is there a way to share it?**

Yes, [sharing of CloudWatch dashboards](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch-dashboard-sharing.html) is possible. There are three ways to share. Sharing a single dashboard publicly by allowing anyone with access to the link to view the dashboard. Sharing a single dashboard privately by specifying the email addresses of the people who are allowed to view the dashboard. Sharing all of the CloudWatch dashboards in the account by specifying a third-party single sign-on (SSO) provider for dashboard access.

> Related AWS Observability Workshop: [Sharing CloudWatch Dashboards](https://catalog.workshops.aws/observability/en-US/aws-native/dashboards/sharingdashboard)

**I want to improve the observability of my application including the aws resources underneath, how can I accomplish?**

[Amazon CloudWatch Application Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch-application-insights.html) facilitates observability for your applications along with the underlying AWS resources like SQL Server database, .Net based web (IIS) stack, application servers, OS, load balancers, queues, etc. It helps customers identify and set up key metrics and logs across application resources & technology stack. By doing so, it reduces mean time to repair (MTTR) & troubleshoot application issues faster.

> Additional details in FAQ: [AWS resource & custom metrics monitoring](https://aws.amazon.com/cloudwatch/faqs/#AWS_resource_.26_custom_metrics_monitoring)

**My Organization is open-source centric, does Amazon CloudWatch support monitoring & observability through open-source technologies.**

For collecting metrics and traces, [AWS Distro for OpenTelemetry (ADOT) Collector](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-open-telemetry.html) along with the CloudWatch agent can be installed side-by-side on Amazon EC2 Instance and OpenTelemetry SDKs can be used to collect application traces & metrics from your workloads running on Amazon EC2 Instances.

To support OpenTelemetry metrics in Amazon CloudWatch, [AWS EMF Exporter for OpenTelemetry Collector](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/awsemfexporter) converts OpenTelemetry format metrics to CloudWatch Embedded Metric Format(EMF) which enables applications integrated in OpenTelemetry metrics to be able to send high-cardinality [application metrics to CloudWatch](https://aws-otel.github.io/docs/getting-started/adot-eks-add-on/config-cloudwatch).

For logs, Fluent Bit helps create an easy extension point for streaming [logs from Amazon EC2](https://docs.fluentbit.io/manual/pipeline/outputs/cloudwatch) to AWS services including Amazon CloudWatch for log retention and analytics. The newly-launched [Fluent Bit plugin](https://github.com/aws/amazon-cloudwatch-logs-for-fluent-bit#new-higher-performance-core-fluent-bit-plugin) can route logs to Amazon CloudWatch.

For Dashboards, Amazon Managed Grafana can be added with [Amazon CloudWatch as a data source](https://docs.aws.amazon.com/grafana/latest/userguide/using-amazon-cloudwatch-in-AMG.html) by using the AWS data source configuration option in the Grafana workspace console. This feature simplifies adding CloudWatch as a data source by discovering existing CloudWatch accounts and manage the configuration of the authentication credentials that are required to access CloudWatch.

**Our workload is already built to collect metrics using Prometheus from the environment. Can I continue using the same methodology.**

Customers can choose to have an all open-source setup for their observability needs. For which, AWS Distro for OpenTelemetry (ADOT) Collector can be configured to scrape from a Prometheus-instrumented application and send the metrics to Prometheus Server or Amazon Managed Prometheus.

The CloudWatch agent on EC2 instances can be installed & configured with [Prometheus to scrape metrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-PrometheusEC2.html) for monitoring in CloudWatch. This can be helpful to customers who prefer container workloads on EC2 and require custom metrics that are compatible with open source Prometheus monitoring.

CloudWatch [Container Insights monitoring for Prometheus](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights-Prometheus.html) automates the discovery of Prometheus metrics from containerized systems and workloads. Discovering Prometheus metrics is supported for Amazon Elastic Container Service (ECS), Amazon Elastic Kubernetes Service (EKS) and Kubernetes clusters running on Amazon EC2 instances.

**My workloads contain microservices compute, especially EKS/Kubernetes related containers, how do I use Amazon CloudWatch to gain insights into the environment?**

Customers can use [CloudWatch Container Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html) to collect, aggregate, and summarize metrics & logs from containerized applications and microservices running on [Amazon Elastic Kubernetes Service (Amazon EKS)](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/deploy-container-insights-EKS.html) or Kubernetes platforms on Amazon EC2. [Container Insights](https://aws.amazon.com/cloudwatch/faqs/#Container_Monitoring) also supports collecting metrics from clusters deployed on Fargate for Amazon EKS. CloudWatch automatically [collects metrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-metrics.html) for many resources, such as CPU, memory, disk & network and also [provides diagnostic information](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-reference.html), such as container restart failures, to help isolate issues and resolve them quickly.

> Related AWS Observability Workshop: [Container Insights on EKS](https://catalog.workshops.aws/observability/en-US/aws-native/insights/containerinsights/eks)

**My workloads contain microservices compute, especially ECS related containers, how do I use Amazon CloudWatch to gain insights into the environment?**

Customers can use [CloudWatch Container Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html) to collect, aggregate, and summarize metrics & logs from containerized applications and microservices running on [Amazon Elastic Container Service (Amazon ECS)](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/deploy-container-insights-ECS.html) or container platforms on Amazon EC2. [Container Insights](https://aws.amazon.com/cloudwatch/faqs/#Container_Monitoring) also supports collecting metrics from clusters deployed on Fargate for Amazon ECS. CloudWatch automatically [collects metrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-metrics.html) for many resources, such as CPU, memory, disk & network and also [provides diagnostic information](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-reference.html), such as container restart failures, to help isolate issues and resolve them quickly.

> Related AWS Observability Workshop: [Container Insights on ECS](https://catalog.workshops.aws/observability/en-US/aws-native/insights/containerinsights/ecs)

**My workloads contain serverless compute, especially AWS Lambda, how do I use Amazon CloudWatch to gain insights into the environment?**

Customers can use [CloudWatch Lambda Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Lambda-Insights.html) for monitoring and troubleshooting serverless applications running on AWS Lambda. [CloudWatch Lambda Insights](https://aws.amazon.com/cloudwatch/faqs/#Lambda_Monitoring) collects, aggregates, and summarizes system-level metrics including CPU time, memory, disk, and network & also collects, aggregates, and summarizes diagnostic information such as cold starts and Lambda worker shutdowns to help customers isolate issues with Lambda functions and resolve them quickly.

> Related AWS Observability Workshop: [Lambda Insights](https://catalog.workshops.aws/observability/en-US/aws-native/insights/lambdainsights)

**I aggregate lot of logs into Amazon CloudWatch logs, how do I gain observability into those data?**

[CloudWatch Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html) enables customers to interactively search, analyze log data and have customers perform queries to efficiently and effectively respond to operational issues in Amazon CloudWatch Logs. If an issue occurs, customers can use [CloudWatch Logs Insights](https://aws.amazon.com/cloudwatch/faqs/#Log_analytics) to identify potential causes and validate deployed fixes.

**How do I query logs in Amazon CloudWatch Logs?**

CloudWatch Logs Insights in Amazon CloudWatch Logs use a [query language](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html) to query log groups.

**How do I manage logs stored in Amazon CloudWatch Logs for cost optimization, compliance retention or for additional processing?**

By default, [LogGroups](https://aws.amazon.com/cloudwatch/faqs/#Log_management)Amazon CloudWatch Logs are[kept indefinitely and never expire](https://docs.aws.amazon.com/managedservices/latest/userguide/log-customize-retention.html). Customers can adjust the retention policy of each log group to choose a retention period between one day and 10 years, depending up on how long they want to retain the logs to optimize cost or for compliance purposes.

Customers can export log data from [log groups to Amazon S3 bucket](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/S3Export.html) and use this data in custom processing and analysis, or to load onto other systems.

Customers can also configure log groups in CloudWatch Logs to [stream data to your Amazon OpenSearch Service](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_OpenSearch_Stream.html) cluster in near real-time through a CloudWatch Logs subscription. By doing so, it helps customers to perform interactive log analytics, real-time application monitoring, search, and more.

**My workloads generate logs which could have sensitive data, is there a way to protect them in Amazon CloudWatch?**

Customers can make use of [Log data protection feature](https://aws.amazon.com/cloudwatch/faqs/#Log_data_protection) in CloudWatch Logs that helps customers [define own rules and policies to automatically](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/mask-sensitive-log-data.html#mask-sensitive-log-data-start) detect and mask sensitive data within logs that are collected from systems and applications.

Related AWS Observability Workshop: [Data Protection](https://catalog.workshops.aws/observability/en-US/aws-native/logs/dataprotection)

**I would like to know anomaly bands or unexpected changes when it happens to my systems & applications. How can Amazon CloudWatch alert me when it occurs.**

[Amazon CloudWatch Anomaly Detection](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Anomaly_Detection.html) applies statistical and machine learning algorithms to continuously analyze single time series of systems and applications, determine normal baselines, and surface anomalies with minimal user intervention. The algorithms create an anomaly detection model that generates a range of expected values that represent normal metric behavior. Customers can [create alarm](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Create_Anomaly_Detection_Alarm.html) based on the analysis of past metric data and a value set for the anomaly threshold.

> Related AWS Observability Workshop: [Anomaly Detection](https://catalog.workshops.aws/observability/en-US/aws-native/metrics/alarms/anomalydetection)

**I’ve setup metric alarm in Amazon CloudWatch, however I’m getting frequent alarm noises. How can I control and fine tune this?**

Customers can combine multiple alarms into alarm hierarchies as [composite alarm](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Create_Composite_Alarm.html) to reduce alarm noise by triggering just once when multiple [alarms](https://aws.amazon.com/cloudwatch/faqs/#Alarms) fire simultaneously. Composite alarms support an overall state by helping customers in grouping resources like an application, AWS Region, or AZ.

> Related AWS Observability Workshop: [Alarms](https://catalog.workshops.aws/observability/en-US/aws-native/metrics/alarms)

**My workload facing the internet is experiencing performance and availability issues, how do I troubleshoot?**

[Amazon CloudWatch Internet Monitor](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-InternetMonitor.html) provides visibility into how internet issues impact the performance and availability between your applications hosted on AWS and your end users. With [Internet Monitor](https://aws.amazon.com/cloudwatch/faqs/#Internet_Monitoring), you can quickly identify what's impacting your application's performance and availability, so that you can track down and address issues which can significantly reduce the time it takes to diagnose internet issues.

**I've my workload on AWS and I want to get notified even before the end users experience an impact or latency in accessing the application. How do I get better visibility and improve the observability of my customer facing workload?**

Customers can use [Amazon CloudWatch Synthetics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries.html) to create canaries, configurable scripts that run on a schedule, to monitor your endpoints and APIs. Canaries follow the same routes and perform the same actions as a customer, which makes it possible to continually verify end user experience even when there are no live traffic to your applications. Canaries help you discover issues even before your customers do. Canaries check the availability and latency of endpoints and can store load time data and screenshots of the UI as rendered by a headless Chromium browser.

> Related AWS Observability Workshop: [CloudWatch Synthetics](https://catalog.workshops.aws/observability/en-US/aws-native/app-monitoring/synthetics)

**I've my workload on AWS and I want to observe end user experience by identifying client-side performance issues and action a faster resolution if there are any real-time issues.**

[CloudWatch RUM](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM.html) can perform real user monitoring to collect and view client-side data about your web application performance from actual user sessions in near real time. This collected data helps quickly identify and debug client-side performance issues and also helps to visualize and analyze page load times, client-side errors, and user behavior. When viewing this data, customers can see it all aggregated together and also see breakdowns by the browsers and devices that your customers use. CloudWatch RUM helps visualize anomalies in your application performance and find relevant debugging data such as error messages, stack traces, and user sessions.

> Related AWS Observability Workshop: [CloudWatch RUM](https://catalog.workshops.aws/observability/en-US/aws-native/app-monitoring/rum)

**My Organization requires all actions be recorded for audits. Can Amazon CloudWatch events be recorded?**

Amazon CloudWatch is integrated with [AWS CloudTrail](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html), which provides a record of actions taken by a user, a role, or an AWS service in Amazon CloudWatch. CloudTrail captures all [API calls for Amazon CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/logging_cw_api_calls.html) as events that include calls from the console and code calls to API operations.

**What more information is available?**

For additional information customers can read the AWS Documentation for [CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html), [CloudWatch Events](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/WhatIsCloudWatchEvents.html) and [CloudWatch Logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html), go through the AWS Observability Workshop on [AWS Native Observability](https://catalog.workshops.aws/observability/en-US/aws-native) and also check the [product page](https://aws.amazon.com/cloudwatch/) to know the [features](https://aws.amazon.com/cloudwatch/features/), and [pricing](https://aws.amazon.com/cloudwatch/pricing/) details. Additional [tutorials on CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-tutorials.html) illustrating customer use case scenarios.

**Product FAQ:** [https://aws.amazon.com/cloudwatch/faqs/](https://aws.amazon.com/cloudwatch/faqs/)
