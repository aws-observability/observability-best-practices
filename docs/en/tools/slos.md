# Service Level Objectives (SLOs)

Are highly available and resilient applications an active business driver for your company**?**  
If the answer is ‘**yes**’, continue reading. 

Failures are a given and everything will eventually fail over time! This becomes an even more important lesson when you are building applications that need to scale. Here comes the importance of SLOs.

SLOs measure an agreed-upon target for service availability based on critical end-user journeys. That agreed-upon target should be crafted around what matters to your customer / end-user. To build such a resilient eco-system, you should measure performance objectively and report reliability accurately using meaningful, realistic, and actionable SLOs. Now, let us get familiarized with key service level terminologies.

## Service Level Terminology

- SLI is service level indicator: a carefully defined quantitative measure of some aspect of the level of service that is provided.

- SLO is service level objective: a target value or range of values for a service level that is measured by an SLI, over a period of time.

- SLA is service level agreement: an agreement with your customers that includes consequences of missing the SLOs they contain.

The following diagram illustrates that SLA is a ‘promise/agreement’, SLO is a ‘goal/target value’, and SLI is a measurement of ‘how did the service do?’.  

![SLO data flow](../images/slo.png)

### Is there an AWS tool to monitor all of this? 

The answer is ‘**yes**’! 

[Amazon CloudWatch Application Signals](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Monitoring-Sections.html) is a new capability that makes it easy to automatically instrument and operate applications on AWS. Application Signals instruments your applications on AWS so that you can monitor the health of your application and track performance against your business objectives. Application Signals provides you with a unified, application-centric view of your applications, services, and dependencies, and helps you monitor and triage application health. Application Signals is supported and tested on Amazon EKS, Amazon ECS, and Amazon EC2 and at the time of writing this, it supports only Java applications!

Application Signals helps you set SLOs on your key performance metrics. You can use Application Signals to create service level objectives for the services for your critical business operations. By creating SLOs on these services, you will be able to track them on the SLO dashboard, giving you an at-a-glance view of your most important operations. To speed up root cause identification, Application Signals provides a comprehensive view of application performance, integrating additional performance signals from CloudWatch Synthetics, which monitors critical APIs and user interactions, and CloudWatch RUM, which monitors real user performance.

Application Signals automatically collects latency and availability metrics for every service and operation that it discovers, and these metrics are often ideal to use as SLIs. At the same time, Application Signals gives you the flexibility to use any CloudWatch metric or metric expression as an SLI! 

Application Signals automatically instruments applications based on best practices for application performance and correlates telemetry across metrics, traces, logs, real user monitoring, and synthetic monitoring for applications running on Amazon EKS. Read this [blog](https://aws.amazon.com/blogs/aws/amazon-cloudwatch-application-signals-for-automatic-instrumentation-of-your-applications-preview/) for more details.

Check this [blog](https://aws.amazon.com/blogs/mt/how-to-monitor-application-health-using-slos-with-amazon-cloudwatch-application-signals/) to learn how to set up an SLO in CloudWatch Application Signals to monitor the reliability of a service. 

Observability is a foundational element for establishing a reliable service, thereby putting your organization well on its way to operating effectively at scale. We believe, [Amazon CloudWatch Application Signals](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Monitoring-Sections.html) will be an awesome tool to help you achieve that goal.

