# Cloud Engineer 

Welcome to the Observability Best pratices guide for Cloud Engineer! This document provides you with best practices, tips, and examples for effectively managing your Observability AWS resources across different expertise levels. Whether you're just starting or are an experienced Cloud Engineer.

---

## AWS Cost Management 💸

**Goal:** Optimize your AWS costs by monitoring and controlling your spending.

| Level | Category                | Description                                                        | Tips & Examples                                               | Additional Notes                    |
|-------|-------------------------|--------------------------------------------------------------------|---------------------------------------------------------------|-------------------------------------|
| **Basic** | [Track Your Spending](https://aws-observability.github.io/observability-best-practices/guides/cost/cost-visualization/cost)       | Set up dashboards to monitor how your business activities impact costs | **Example:** Monitor marketing campaigns' effect on server costs | **Pro Tip:** Start with basic daily cost tracking  
**Common Pitfall:** Failing to set up alerts |
| **Basic** | [Budget Management](https://aws-observability.github.io/observability-best-practices/guides/operational/business/key-performance-indicators)         | Establish spenditure limits to measure project costs | **Tip:** Focus on setting budgets for each department or service | **Recommendation:** Establish clear budget placements |
| **Intermediate** | [Resource Tagging](https://aws-observability.github.io/observability-best-practices/recipes/recipes/metrics-explorer-filter-by-tags)         | Implement resource tagging to track resource usage by teams and projects | **Quick Win:** Start with these 3 tags:  
1. Project  
2. Environment  
3. Owner | **Did You Know?** You could save 20-30% after implementing tagging |
| **Intermediate** | [Cost & Usage Visibility](https://aws-observability.github.io/observability-best-practices/guides/cost/cost-visualization/cost)   | Ensure that you are only incurring the costs you need and that you are not overspending on resources you don't need | **Example:** Set up granular cost dashboards for better tracking | **Pro Tip:** Take into consideration the different [cost optimization tools](https://docs.aws.amazon.com/whitepapers/latest/cost-optimization-laying-the-foundation/reporting-cost-optimization-tools.html) AWS provides                                 |
| **Advanced** | [Smart Cost Management](https://community.aws/content/2muS34cXUidGfdzpd5EkpCcphLc/aws-serverless-how-to-stop-ec2-using-event-bridge-and-lambda)            | Automate tasks that will limit unnecesary spenditure | **Example:** Power off non-production servers during off hours | **Pro Tip:** Begin with non-production environments |
| **Advanced** | [Strategic Implementation](https://aws-observability.github.io/observability-best-practices/guides/operational/business/key-performance-indicators)   | Establish KPIs and implement FinOps Foundation principles | Create cost optimization KPIs and track them over time | **Pro Tip:** Start with the "Unit Economics" KPI - measure your cost per business output (e.g., cost per transaction, cost per customer, or cost per service).  

**Did you know?** Remember: The best KPIs are those that directly tie cloud spending to business outcomes, making it easier to demonstrate ROI and gain buy-in for FinOps initiatives. |

### Recommendations:
- **Start simple**: Begin with basic monitoring and expand to more advanced techniques as you become more comfortable with AWS tools.
- **Use tags effectively**: Tagging is one of the most powerful ways to track and allocate costs. Implementing it early can save significant time in the future.

---

## AWS Performance & Availability 🚀

**Goal:** Ensure optimal performance and availability of your AWS-hosted applications.

| Level | Component              | Description                                                        | Tips & Examples                                               | Additional Notes                    |
|-------|------------------------|--------------------------------------------------------------------|---------------------------------------------------------------|-------------------------------------|
| **Basic** | [Watch Your Apps](https://aws-observability.github.io/observability-best-practices/tools/dashboards)          | Aggregate curated historical data and see it alongside other related data | **Example:** Check if users in different regions experience delays | **Common Pitfall:** Lack of centralization for your monitoring tools |
| **Intermediate** | [Track Connection Points](https://aws-observability.github.io/observability-best-practices/signals/traces)  | Monitor how different parts of your application communicate with each other | **Quick Win:** Start by tracking the performance of your most critical service | **Did You Know?** Most outages happen due to service-to-service communication failures |
| **Advanced** | [Test your performance](https://aws-observability.github.io/observability-best-practices/tools/synthetics)     | Test & Simulate applications from the perspective of your customer to understand their experience | **Example:** Execute synthetic tests towards your application endpoints |   **Pro Tip:** Collect client side data from user session to granular [performance insights](https://aws-observability.github.io/observability-best-practices/tools/rum)                                |
|**Advanced** | [Establish Agreed & Enforce upon target for your availability](https://aws-observability.github.io/observability-best-practices/tools/slos)     | Assess your applications SLO that establishes the acceptable health & availability | Use for real-time monitoring and quick troubleshooting |   **Pro Tip:** Regularly evaluate your organization's observability [maturity](https://aws-observability.github.io/observability-best-practices/guides/observability-maturity-model) 

### Recommendations:
- **Understand user experience**: Monitoring only server-side metrics isn't enough. Be sure to track actual user experience globally.
- **Prioritize key services**: Begin monitoring your most critical application components and scale monitoring from there.

---

## AWS Security Monitoring 🔒

**Goal:** Secure your AWS infrastructure by monitoring for security vulnerabilities and incidents.

| Level | Component              | Description                                                        | Tips & Examples                                               | Additional Notes                    |
|-------|------------------------|--------------------------------------------------------------------|---------------------------------------------------------------|-------------------------------------|
| **Basic** | [Central Security Monitoring](https://aws-observability.github.io/observability-best-practices/patterns/multiaccount) | Consolidate all security logs in one central place for easy access and analysis | **Example:** Track all access to sensitive data and resources | **Pro Tip:** Start by focusing on login attempts and access patterns |
| **Intermediate** | [Expand telemetry data collection](https://aws-observability.github.io/observability-best-practices/recipes/telemetry)  | Include additional [attributes](https://aws-observability.github.io/observability-best-practices/guides/containers/oss/ecs/best-practices-metrics-collection-1) that contributes troubleshooting and auditing sessions | **Implementation:** Implement telemetry data from your applications backend code | **Example:** Send Browser name from which user has logged in from                                    |
| **Advanced** | [Change Monitoring](https://aws-observability.github.io/observability-best-practices/recipes/anomaly-detection)          | Track abrupt changes in your workloads both from internal and external sources| **Quick Win:** Set up alerts for unexpected login patterns or user activity | **Common Pitfall:** Solely depending on static alarm threshold |

### Recommendations:
- **Prioritize security**: Security should never be an afterthought. Start with basic monitoring and progress to more sophisticated configurations.
- **Automate alerts**: Setting up automatic alerts for unusual activities helps detect potential threats before they escalate.

---

## User Experience Monitoring 📈

**Goal:** Optimize user experience by monitoring application usage, speed, and behavior.

| Level | Component              | Description                                                        | Tips & Examples                                               | Additional Notes                    |
|-------|------------------------|--------------------------------------------------------------------|---------------------------------------------------------------|-------------------------------------|
| **Basic** | [Track Page Speed](https://aws-observability.github.io/observability-best-practices/tools/rum)         | Monitor how fast your pages load for real users | **Example:** Identify if your checkout page slows down during peak traffic hours | **Pro Tip:** Focus on the most important user journeys first |
| **Intermediate** | [Watch User Patterns affected by external factors](https://aws-observability.github.io/observability-best-practices/tools/internet_monitor)       | Track additional elements that can affect how users interaction with your service  | **Example** Internet Provider and Location  
**Quick Win:** Start by monitoring basic page load times | **Did You Know?** Small delays in page load times can significantly impact user retention |
| **Advanced** | [Deep Networking Usage Analysis](https://aws-observability.github.io/observability-best-practices/recipes/infra)       | Evaluate and Analyze deep into your network flow activity and statusm | **Example** [Network Synthetics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/what-is-network-monitor.html) and [Network Flow Monitor](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-NetworkFlowMonitor.html) | Track deeper network interactions and user behavior |

### Recommendations:
- **Focus on key actions**: Prioritize monitoring for actions that impact revenue or user satisfaction.
- **Monitor real user interactions**: Don't rely only on synthetic tests—real user data provides more actionable insights.

---

## Serverless Workload Monitoring ⚡

**Goal:** Effectively monitor and optimize serverless applications to ensure reliability and cost efficiency.

| Level | Component | Description | Tips & Examples | Additional Notes |
|-------|-----------|-------------|-----------------|------------------|
| **Basic** | [Lambda Function Best practices](https://aws-observability.github.io/observability-best-practices/guides/serverless/aws-native/lambda-based-observability) | Monitor core Lambda metrics and execution stats | **Example:** Track invocations, duration, and error rates  
**Quick Win:** Set up CloudWatch dashboards for Lambda insights | **Pro Tip:** Monitor cold starts and memory utilization to optimize costs |
| **Intermediate** | [Event Source Monitoring](https://docs.aws.amazon.com/lambda/latest/dg/monitoring-metrics.html) | Track performance of event sources and integrations | **Example:** Monitor SQS queue depth, API Gateway latency  
**Quick Win:** Set up dead-letter queues for failed events | **Did You Know?** Proper event source monitoring can prevent cascade failures |
| **Advanced** | [Provided Summarized Insights](https://docs.aws.amazon.com/xray/latest/devguide/xray-services-lambda.html) | Leverage CloudWatch's specialized insight tools to gain automated, detailed analytics about your workload performance, resource utilization, and operational patterns across your serverless and containerized applications. | **Example:** [Lambda Insights](https://aws-observability.github.io/observability-best-practices/guides/serverless/aws-native/lambda-based-observability#use-cloudwatch-lambda-insights-to-monitor-system-level-metrics)  
[Container Insights](https://aws-observability.github.io/observability-best-practices/patterns/adoteksfargate)| Enable Lambda Insights at the account level using AWS CloudFormation to automatically collect detailed metrics for all new Lambda functions, while using [Contributor Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContributorInsights.html) to identify top-consuming resources and potential bottlenecks. |

### Recommendations:
- **Implement structured logging**: Use consistent JSON logging format for better searchability
- **Monitor concurrency limits**: Track function concurrency to prevent throttling
- **Cost optimization**: Set up cost allocation tags and monitor per-function costs

---
