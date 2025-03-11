# Developers
Observability is crucial for developers as it enhances productivity, improves application performance, and drives business success through better decision-making and faster issue resolution. This guide provides best practices and recommendations for leveraging observability effectively.

## Why Observability Matters for Developers 
Developers use observability for several key purposes:
- **Quick Issue Identification and Resolution:**
    - Observability allows developers to identify and diagnose issues quickly, reducing the time to resolve problems (MTTR) and improving overall software delivery performance
    - It helps developers understand how their systems behave in production, enabling them to make informed decisions and improve operations
- **Improve Customer Experience:**
    - By analyzing system behavior, developers can optimize performance and reliability, leading to better customer experiences and increased user satisfaction
    - Observability tools help monitor user interactions, allowing developers to identify and address UI/UX issues promptly
- **Enhanced Team Efficiency and Innovation:**
    - Observability platforms provide a single source of truth for operational data, facilitating cross-team collaboration and reducing troubleshooting time
    - Developers can focus more on innovation and less on manual debugging, thanks to automated insights and alerts
- **Data-Driven Decision Making:**
    - Observability provides detailed insights into system performance, enabling developers to make data-driven decisions about code improvements and resource allocation
    - It helps organizations optimize investments and accelerate time to market by identifying areas for improvement
- **Complexity Management:**
    - Observability helps manage the complexity of modern cloud-native and multi-cloud environments by providing a comprehensive view of system interdependencies
    - It allows developers to distill complexity and focus on relevant data, promoting more efficient development processes

## Best practices for code quality
- **Monitor Issue Tracking Metrics:**
    - Use tools like JIRA or Trello or other issue tracking platforms to track metrics such as:
        - How many times a ticket moves from code review to test review and back to in progress. A high number may indicate lack of skills, high complexity, or inadequate tooling.
        - How many times a ticket is blocked due to external dependencies. A high number could indicate high coupling between dependencies and/or high complexity.
    - **Recommendations:**
        - Use a tool like [Amazon Q Developer](https://aws.amazon.com/q/developer) to boost productivity and code quality with automated code reviews. Amazon Q Developer can speed up software development tasks by up to 80%, contributes to higher-quality code by reducing the likelihood of human error during rapid development cycles.
        - Schedule regular reviews of metrics as part of retrospectives to identify improvements and foster a mindset of continuous improvement
        
- **Instrument Code for Performance Metrics:**
    - Instrument your code to be able to measure the following which provide an indirect measure of code quality by assessing the performance efficiency and scalability of the code implementation 
        - **RED Method:** Monitor Requests, Errors, and Duration for microservices. This provides insights into service performance and reliability.
        - **USE Method:** Track Utilization, Saturation, and Errors for system resources. This helps identify bottlenecks and resource constraints.
    - Add instrumentation around calls to all external dependencies in the request processing path, like other services, database, cache, etc.. This can provide you with required information to investigate sudden changes in request processing time as well as enable faster identification of the root cause of an issue
    - **Recommendations:** 
        - Set a SLO(Service Level Objective) on the request latency and error rate and use that to drive improvements for better quality and performance
        - Add validation of instrumentation to automated tests that exercise critical data flow and request processing paths
        - Build an automated load test task to create a baseline of system performance and code quality measure
        - Ensure instrumentation has added context to be able to identify performance impact of a single request
        - Configure and make use of auto-instrumentation provided by the SDKs to reduce the manual work involved with adding instrumentation


## Efficient logging and monitoring
- Use structured log formats eg. json. For existing applications, consider using log transformation features to inject more context, add or remove fields
- Use wide event format containing adequate metadata to be able to derive meaninful signals and cross correlate across the signals.
- Use OpenTelemetry or ADOT SDKs which inject additional context into the logs which enables cross signal correlation and reduction in Mean Time To Identify(MTTI) therefore reducing Mean Time To Recover(MTTR)
- Use log levels appropriately - these can help you control the volume of logs and therefore the cost of ingestion. 
    - Use ERROR for any unexpected and expected error conditions. Add as much additional context to be able to accelerate root cause analysis.
    - Use INFO for general run time events like user login, which can provide context and are important
    - Use DEBUG for logging the calls in the processing path to get a deeper understanding of the application's flow and states. 
- Avoid logging any data that may be considered sensitive such as PII or PHI. Where the requirement exists, consider using the data protection policy or redacting the data on ingestion. Use IAM policies to control who can view the raw data.
- Use the embedded metric format(EMF) to embed metrics within logs, reducing the number of API calls to the Observability platform, reducing cost. 
    - Avoid using EMF for metrics with high cardinality dimensions such as requestId
- **Alerts:** 
    - Use anomaly detection to avoid setting rigid thresholds for alerts. This can avoid the overhead of updating the thresholds as the system usage changes over time and reduce alert noise.
    - Use metric math and combination alerts to reduce the number of individual alerts that are generated for a particular failure. 
    - Only alert when a SLO is at risk of/is failing. This can avoid your team being woken unnecessarily and reduce the cognitive and context overload
    - Only alert if someone can take action on notification of failure
    - Automate resolution of the alert where possible. For example, leverage the native platform configuration like autoscaling, automatic failover to replica or standby instance, etc.
    - Add adequate context to the alert notification to ensure that the person who is notified can quickly identify the dashboards to look at, playbook to use and service that is impacted
- **Dashboards:**
    - Create one or more dashboards per persona/stakeholder. 
        - Application developers would require enough context to diagnose issues, understand the performance of the application
        - Platform engineers would require dashboards with context to identify the impact to SLOs and infrastructure components requiring attention and their impact on services using them 
        - Product managers would require dashboards showing the user journey, product feature usage metrics, adoption rates, abandonment points, etc
        - Business stakeholders would be interested in widgets demonstrating product adoption rates, subscriber fall off or anything that can be related to impacting business performance and revenue
    - Use a consistent timezone across all dashboards eg. UTC 
    - Use the same time range across all widgets on a dashboard
    - Use annotations to add more context to dashboards
    - Ensure only widgets which add context to aid in error resolutions are on the dashboard. Too many widgets can add noise and cognitive overload, that leads to higher MTTR
        - Move other nice to have widgets to another dashboard or to the bottom of the dashboard if there are not already too many widgets. Too many widgets will impact the load time and result in higher stress and cognitive overload.
    - Ensure the entire dashboard fits on a single screen and trends are visible with the resolution and screen size of a laptop
    - Have a widget with a description of the dashboard and guidance on how to use the dashboard
    - Configure and display thresholds on widgets
    - Do not stuff more metrics into a single widget which can result in trends and spikes being smoothed and defeat the purpose. This also makes diangosis hard.
    - Use dynamically adjusted Y-axis to allow for trends and spikes to be visible
- **Recommendations:**
    - **Controlling Cost:**
        - **Identify Stakeholders:** 
            - Determine the different personas interested in feature performance, such as functionality, availability, security, cost, sales, and product usage.
            - Stakeholders can include development teams, end customers, internal business stakeholders, platform operations teams, or application developers.
        - **Identify key outcomes:**
            - For each stakeholder, define quantifiable outcomes (e.g., error rates, request processing duration, number of logins per minute, number of products purchased per minute, number of abandoned carts, etc) that are typically measured using Service Level Objectives (SLOs).
            - Use these SLOs per persona to identify required instrumentation
        - **Choose the right signal:**
            - A wide log with enough context can be converted into metrics and traces giving one source of truth, controlling cost and enabling signal correlation
            - Run an [Observability Strategy Workshop](https://catalog.us-east-1.prod.workshops.aws/workshops/e31f4fcc-1944-4e46-815d-26fc9eafabce/en-US/5-practical-examples/5-1petstore-site-exercise/scenario1) to identify the right signals to be instrumentated into the application
    - **Choose the right signal:**
        - Logs and traces help you find out the root cause of a failure or unexpected behaviour. Ensure to add logs which can help you answer questions like "why did a particular request fail?" or "what would I need to know for the SLO related to request duration if there is an increase in the p50 or p99 for the request processing time?"
        - Metrics are good to understand baseline performance, predict trends and anomalies. They can proactively give you an indication of something not working as expected. Custom metrics are however expensive. 
    - **Reduce Alert Fatigue:**
        - Depending on the configuration, alerts can proactively or reactively highlight an issue in the system. Too many alerts can lead to alert fatigue and inefficient teams, leading to bad code quality and product delivery. 
    - **Periodic Reviews and Continuous Improvement:**
        - Have a periodic roster for a member on the team to monitor the dashboards and report on any new trends or patterns identified.
        - Allocate a portion of each release to improve signals, tweak alert thresholds and dashboards based on gaps identified during retrospectives and roster observations 
        - Prioritize fixing the root cause of a recurring alert based on effort to resolve and number of times the alert triggers

## Profiling and performance optimization
- **Real User Monitoring(RUM):**
    - Use tools like [AWS X-Ray](https://aws.amazon.com/xray/) or New Relic to monitor real user interactions and identify performance bottlenecks. Focus on key conversion points and measure both technical performance as well as business outcomes (conversion rates, abandonment points).
    - Prioritize monitoring of critical user paths like checkout flows and registration processes. 
    - Establish baseline performance and user behavior to quickly be able to identify anomalies and trends that may impact business outcomes
- **Synthetics:**
    - Employ tools like [Amazon Cloudwatch Synthetics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries.html) to simulate user interactions and test application performance under various conditions. Synthetic canaries can help identify issues before user impact is detected.
    - Validate health checks and system uptime with Synthetic canaries.
- **Profiling tools:**
    - Use tools like [AWS X-Ray](https://aws.amazon.com/xray/) for profiling to identify performance bottlenecks and optimize resource utilization
    - Set dynamic sampling rates that adjust based on traffic patterns and maintain adequate retention of error traces and outliers. This ensures comprehensive visibility into critical issues while managing data volume and costs effectively.
    - Use tail sampling to configure your collector with multiple sampling policies that prioritize high-value traces based on error status, duration thresholds, and custom attributes. This will ensure that the traces sampled include the ones that will be of most value
- **OpenTelemetry:**
    - Use [OpenTelemetry](https://opentelemetry.io/) for auto-instrumentation to simplify the collection of performance metrics and traces. Validate the telemetry provided by auto instrumentation before adding manual instrumentation and then look to tune the auto instrumentation based on requirements to control signals and cost.

## Error handling and debugging techniques 
- **General:**
    - Design retry mechanisms with exponential backoff for transient failures. Implement [circuit breakers](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/circuit-breaker.html) for external dependencies. This is particularly helpful in distributed systems and prevents excessive load on the downstream component/service. This may not be applicable in all scenarios so do perform due diligence before adopting this design.
    - Create fallback mechanisms for critical operations and maintain clear rollback procedures for failed transactions. 
    - Add input validation at all entry points. 
    - Ensure retryable operations are idempotent. 
- **Logging:**
    - Maintain a repository of saved [Cloudwatch Log Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_Insights-Saving-Queries.html) queries. Use folders to group the queries 
    - Don't silence errors. Always log or handle appropriately.
    - Add a form of identification like correlation id or request id to the logs in addition to any other relevant context.
- **Playbooks and runbooks:**
    - When writing playbooks, include clear actionable steps with permissions required, tools and expected outcomes. 
    - Include verification steps, rollback procedures, and links to relevant dashboards in playbooks and run books. 
    - Version playbooks and update them after incidents including the learnings and key insights.
- **Tuning sampling rules:**
    - Implement dynamic sampling rules based on service criticality and traffic patterns. 
    - Set higher sampling rates for error conditions and business-critical paths.
    - Review and adjust sampling rules regularly based on operational needs and cost considerations.

## Code reviews and collaboration strategies
- **Ticket elaboration:**
    - Identify Observability requirements as part of the feature elaboration process. This may include 
        - Impacted Stakeholders and related SLOs
        - Required telemetry/signals
        - Required alerts 
        - List of dashboards to be created or updated
- **Blamesless retrospectives:**
    - After every incident, conduct a blameless retrospective to look for opportunities to improve processes or add automation. Always factor in cost of change and ensure you leave each post mortem exercise with at least one agreed upon actionable item which also has a timeline for completion associated with it.
- **Operational Readiness Reviews:** 
    - Participate in operational readiness reviews with the platform and operations team to identify gaps in observability posture - this can be a checklist and a mandatory exercise before deployments to production. For large organisations with multiple teams, to avoid this process becoming a bottleneck, conduct these periodically, per new feature and release cadence.
- **Recommendations:**
    - Use a tool like [AWS Systems Manager Incident Manager](https://docs.aws.amazon.com/incident-manager/latest/userguide/analysis.html) to help guide you through the post-incident analysis
    - Refer the [Operational Readiness Review](https://docs.aws.amazon.com/wellarchitected/latest/operational-readiness-reviews/wa-operational-readiness-reviews.html) for inspiration on questions to include in your operational readiness review checklist or process. 
    - Always share learnings from retrospectives, operational readiness reviews - this could be via a wiki or mail group subscriptions

## API design and documentation guidelines
- **Versioning:**
    - Ensure APIs are versioned and the version is added as context for every request processed
    - Where sending custom metrics, add a dimension on the version if applicable
    - Add an annotation or identifier on dashboards to clearly distinguish a cutover from one version to another 
    - Ensure you track the requests to each version and a widget to visualize usage of the versions. This is to ascertain that requests are being routed as expected and also to reduce the time to identify the root cause. This can provide increased confidence when deprecating and removing an older version
- **Backwards Compatibilty:**
    - Ensure there are no requests to older versions before removing the code paths related to an older API version
- **Batch APIs:**
    - Emit signals for the status of each individual request as well as for the overall batch request
    - Ensure context is added to the logs identifying the batch request id and individual request

