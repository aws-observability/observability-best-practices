# Site Reliability Engineers & Observability

Site reliability engineering (SRE) is a software engineering practice that focuses on improving the reliability and performance of software systems. One of the key goals of SRE is to improve software system reliability in areas like availability, performance, latency, efficiency, capacity, and incident response. Some of the metrics that SRE teams measure to validate their goals against are Service Level Agreements (SLA), Service Level Objectives (SLO), Service Level Indicators (SLI) and Error budgets. 

Below are the SRE focus areas and best practices to guide your observability strategy. 

## Incident response and crisis management
Incident response includes monitoring, detecting, and reacting to unplanned events or interruptions with a goal to minimize the Mean Time to Resolve an Incident (MTTR) and satisfy service level agreements (SLAs). 

### Some of the best practices around incident response and crisis management are:
- Rapid detection, response and containment is crucial to ensure the incident is mitigated in minimal time and further impact is avoided. 

- Build a robust on-call system with streamlining the on-call schedules and incorporating operation runbooks for effective incident mitigation.  

- Build an effective post incident analysis process. A root cause analysis should typically include the following

    - Impact analysis - Identify what systems, internal processes, end-users were impacted because of this incident along with financial impact if any this might have caused. 

    - Root Cause & Resolution - Conduct root cause analysis of the event and identify opportunities to implement guardrails to avoid the recurrence of the scenario in the 
    future.
    
    - Monitoring and Alarming - Identify if the metric and alarm thresholds that have been set up are reporting the correct signals and if there is an opportunity for     prevention of a potential incident.  
    
    - Action items & Learning - Assign owners to the action items and follow up on those.  It is important to establish  feedback mechanism wherein the learnings from the incident are incorporated in the product lifecycle to avoid future failures. 

## Service-level objectives and key metrics

 SLIs (Service Level Indicators) are the actual measurements/metrics. Examples include: Response time in milliseconds, System uptime percentage, Error rate per million requests, Throughput in requests per second, Resource utilization (CPU, memory, etc.)
 
 SLOs (Service Level Objectives) are the target goals set using SLIs. They define what "good service" means. Examples such as  95% of requests will complete in under 200ms, 99.9% uptime per month, Error rate below 0.1% over 30 days. The relationship between SLIs and SLOs can be defined as below 

         SLI (metric) + Target + Time Window = SLO
         Example: Response time (SLI) + Under 200ms + Measured over 30 days = SLO

  


#### Best Practices for SLIs and SLOs are as below
- Establish a SMART framework for SLOs
    - Specific:  Clear metric and threshold ("response time under 200ms").
    - Measurable: Can be tracked with monitoring tools.
    - Achievable: Realistic given system capabilities.
    - Relevant: Matters to user experience.
    - Time-bound: Measured over defined period (e.g., 30 days).

- Choose SLIs that directly impact user experience.

- Set realistic SLO targets based on business needs.

- Regular monitoring and adjustment.

- Clear documentation and communication.

- Have different SLOs for different service tiers if needed.

- Identify Key Metrics such as 

    - Latency: Measure the time it takes for a system to respond to a request, tracking both successful and error latencies.
    - Traffic: Monitor the volume of requests or data passing through the system to understand usage patterns and scale requirements.
    - Errors: Track the frequency and types of errors occurring within the system.
    - Saturation: Monitor the utilization of critical resources like CPU and memory to identify potential bottlenecks.


Here is an example SLO document

    Service: User Authentication API
    SLO: 99.9% of authentication requests will complete in under 500ms
    Measurement Window: Rolling 30-day period
    SLI: Response time measured at server
    Exclusions: Planned maintenance windows



## Capacity planning and scaling
Capacity Planning and event readiness are essential elements to ensure system reliability. 

#### Some of the best practices are 

- Implement a comprehensive events calendar that will include key components such as expected user traffic patterns, geographic distribution of users, target AWS regions, peak time of the event etc. 

- Conduct event readiness testing that would include system scaling validation, performance benchmarking and capacity threshold testing.

- Validate failover mechanisms such as back up and restore procedures, region switch over runbooks, incident response protocols, mitigation procedures. 


## Automation and scripting for infrastructure management
 Automation is key for efficient operation of infrastructure. Automation creates a more reliable, scalable, and efficient infrastructure while freeing up teams to focus on strategic initiatives rather than routine maintenance. Some of the benefits of automation include 

* Enhanced reliability of the systems with little to no human intervention.

* Improved scalability allowing the application to auto scale according to traffic and demand.  

* Rapid & automated incident resolution, reduced error rates and improved MTBF (Mean Time Between Failures).

* Reduced operational costs and better resource utilization. 

#### Some of the key automation strategies include

* Implementation of Infrastructure as Code (IaC) along with version control infrastructure changes.

* Continuous Integration/Continuous Deployment (CI/CD) including automated testing and rollback capabilities.

* Self-healing Systems with integrated health checks and automatic recovery.


## Monitoring and alerting strategies for SRE teams
Effective monitoring and alerting are crucial for Site Reliability Engineering (SRE) teams to proactively ensure the reliability and performance of distributed, microservice-based applications. Monitoring a distributed system with potentially hundreds of microservices can be a challenge. Regardless of the complexity of architecture, we need to start with identifying key metrics and work backwards from the impact that they have on the application performance and user experience. 

#### Collect Comprehensive Telemetry 
- Ensure that the telemetry data being collected provides sufficient insights into the health and performance of each architecture component. Continuously evaluate the relevance and actionability of the collected data.

#### Alerting Strategy

- Define Actionable Alerts - The alerts generated from the telemetry data should be actionable, allowing SRE teams to quickly identify and respond to issues. Alerts should be based on thresholds and patterns that are meaningful and predictive of potential problems.

- Optimize Alert Routing and Escalation - Implement a well-defined alert routing and escalation process to ensure that the right teams and individuals are notified of critical issues. Continuously review and refine the alert routing to improve responsiveness and minimize alert fatigue.

#### Dashboarding and Visualization

- Create Comprehensive Dashboards - Develop dashboards that provide a holistic view of the application's state, including key operational metrics, cost and capacity planning data, and infrastructure health. Ensure that the dashboards include thresholds and indicators that can effectively predict and prevent problems.

- Enable Data-Driven Decision Making - Use the insights gained from the dashboards to inform data-driven decision-making processes, such as capacity planning, performance optimization, and incident response strategies.


## Chaos engineering and experimentation guidelines

The goal of chaos engineering is to test the application reliability and to understand how an application responds to disruptive events such as outages, sudden spike in traffic and other external events. Chaos engineering helps teams evaluate performance bottlenecks, application behavior and implement strategies to remediate faults in a real world scenario. 

### Best practices around Chaos engineering 

- Start small and gradually increase complexity - This would include building a hypothesis (for eg, if the traffic on the application increases by 30%, how would it perform),      

- Define a steady state.

- Introduce faults through experiments.

-  Observe system behavior and take corrective resilience action. 

- Implement robust monitoring - For effective chaos engineering, ensure you are collecting relevant telemetry data such as logs, metrics, traces etc.

- Always have a rollback plan - Integrating Chaos Engineering into CI/CD pipeline ensure you are able to automate and test your rollback plans. 

- Learn from each experiment, document the findings, improve system resilience and integrate chaos engineering into your development lifecycle. 

By systematically implementing these Chaos Engineering practices, organizations can significantly improve their system's resilience, reduce unexpected downtime, and build more reliable services. Remember, the goal is not to create chaos, but to build systems that can withstand chaotic conditions.


## References
- [AWS Observability Workshop](https://catalog.workshops.aws/observability/en-US)
- [AWS Observability Best Practices](https://aws-observability.github.io/observability-best-practices/)
- [Amazon CloudWatch Intelligent Operations](https://aws.amazon.com/cloudwatch/features/intelligent-operations/)
- [Resilience analysis framework](https://docs.aws.amazon.com/prescriptive-guidance/latest/resilience-analysis-framework/introduction.html)
- [Chaos Engineering with AWS Fault Injection Simulator](https://aws.amazon.com/blogs/architecture/chaos-testing-with-aws-fault-injection-simulator-and-aws-codepipeline/) 