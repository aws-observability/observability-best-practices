# Best practices for hybrid and multicloud

## Intro

We consider multicloud to be the concurrent use of more than one cloud services provider to operate your own workloads, and hybrid is the extending of your workloads across both on-premises and cloud environments. Observability across hybrid and multicloud environments may add significant complexity due to tool diversity, latency, and heterogenous workloads. Regardless, this remains a common goal for both development and business users. A rich ecosystem of products and services address this.

However, the usefulness of observability tools for cloud-native workloads can vary dramatically. Consider the different requirements of monitoring a containerized batch processing workload, compared to a real-time banking application using a serverless framework: both have logs, metrics, and traces; however, the toolchain for observing them will vary, with a number of cloud-native, open source, and ISV products available. An open-source tool such as Prometheus may be an excellent fit for one, whereas a cloud-native tool provided as a managed service could better meet your requirements.

Add to this the complexity of multicloud and hybrid, and gaining insights from your applications becomes considerably harder.

In order to deal with these added dimensions and facilitate approaches to observability, customers tend to invest in a single toolchain with a unified interface. After all, reducing the signal-to-noise ratio is usually a good thing! However, a single approach does not work for all use cases, and the operating models of various platforms may add confusion. Our goal is to help you make informed decisions that compliment your needs and reduce your mean time to remediation when issues do occur. Below are the best practices that we have learned through working with customers of all sizes, and across every industry.

:::tip
    These best practices are intended for a broad set of roles: enterprise architects, developers, DevOps, and more. We suggest evaluating them through the lens of your organization’s business needs, and how observability in distributed environments can provide as much value as possible.
:::
## Don’t let your tooling dictate your decisions

Your applications, tools, and processes exist to help achieve business outcomes, such as increasing sales and customer satisfaction. A well-advised technology strategy is one that does everything possible to help you achieve those business goals. But the things that help you get there are simply tools, and they are meant to support your strategy – not be the strategy. To make an analogy, if you needed to build a house, you would not ask your tools how to design and build it. Rather, your tools are a means to an end.

In a single, homogeneous environment, the decisions around tooling are easier. After all, if you run a single application in one environment, then you tooling can easily be the same across the board. But for hybrid and multicloud environments things are less clear, and keeping an eye on your business outcomes - and [the value added](https://arxiv.org/abs/2303.13402) by observing your workloads across these environments - is critical. Each Cloud Services Provider (CSP) has their own native observability solutions, and a rich set of partner and Independent Software Vendors (ISVs) whom you can use as well.

Just because you operate in multiple environments does not mean that a single tool for every workload is advisable, nor even recommended. This can potentially mean using multiple services, frameworks, or providers, to observe your workloads. See "[a single pane of glass is less important than your workload’s context](#a-single-pane-of-glass-is-less-important-than-your-workloads-context)” below for details of how your operating model needs to reflect your needs. Regardless, when implementing your tools, remember to create “[two-way doors](https://aws.amazon.com/executive-insights/content/how-amazon-defines-and-operationalizes-a-day-1-culture/)” so you can evolve your observability solution in the future.

Here are some examples of “tool-first” outcomes to avoid:

1.	Focusing on implementation of a single tool without a two-way door to upgrade it, or move to a new solution in the future, may create technical debt that is otherwise avoidable. This can happen when the tool is the solution, and one day may become the problem you need to solve.
2.	A company standard to use a single tool due to a volume discount may end-up without features they would benefit from. This may be “cost over quality”, and inadvertently creates a monolithic anti-pattern. This may discourage the collection of telemetry in order to remain under a volume threshold, thereby de-incentivizing the use of observability tooling.
3.	Not collecting an entire type of telemetry (usually traces) due to a lack of existing trace collection infrastructure, but a rich set of log and metric collectors, can lead to an incomplete observability solution.
4.	Support staff having been trained on only a single toolchain, in the desire to reduce labour and training costs, thereby reducing the potential value of other observability patterns.

:::info
    If your tooling is dictating your observability strategy, then you need to invert the approach. Tools are meant to enable and empower observability, not to limit your choices.
:::

:::info
    Tool sprawl is a very real issue that companies struggle with, however a radical shift to a singular toolchain can likewise reduce your observability solution’s usefulness. Hybrid and multicloud workloads have technologies that are unique to each platform, and higher-level services from each CSP are useful – though the trade-offs in using a single-source product require a value-based analysis. See “[Invest in OpenTelemetry](#invest-in-opentelemetry)” for an approach that mitigates some of these risks.
:::

## (Observability) data has gravity

All data has gravity – which is to say that it attracts workloads, solutions, tools, people, processes, and projects around it. For example, a database with your customer transactions in it will be the attractive force that brings compute and analytics workloads to it. This has direct implications for where you place your workloads, in which environment, and how you operate them going-forward. And the same is true for observability signals, though the gravity this data creates is tied to your workload and organizational context (see "[a single pane of glass is less important than your workload’s context](#a-single-pane-of-glass-is-less-important-than-your-workloads-context)”).

One cannot completely separate the context of your observability telemetry from the underlying workload and data that it relates to. The same rule applies here: your telemetry is data, and it has gravity to it. This should influence where you place your telemetry agents, collectors, or systems that aggregate and analyze signals.

:::tip
    The value of observability data over time is considerably less than most other data types. You could call it the “half-life” of observability data. Consider the additional latency in relaying telemetry to another environment as a potential forced devaluation of this data prior to its potential use, and then weigh that against the requirements you have for alerting when issues occur.
:::

:::info
    The best practice is to emit data between environments only when there is business value to be gained from this aggregation. Having a single source for querying data does not solve many business needs on its own, and may create a more expensive solution than desired, with more points of failure.
:::

## A single pane of glass is less important than your workload’s context

A common ask is for a “single pane of glass” to observe all of your workloads. This arises from a natural desire to view as much data as possible, but in as simple a way as can be achieved, and reduce churn, frustration, and diagnosis time. Creating this one interface to see your entire observability solution at once is useful, but can come with the trade-off of separating your telemetry from the context it came from.

For example, a dashboard with the CPU utilization of a hundred servers may show some anomalous spikes in consumption, but this does nothing to explain why this has happened, or what the contributing factors are for this behavior. And the importance of this metric may not be immediately clear.

We have seen customers sometimes pursue the single pane of glass so aggressively that all business context is lost, and trying to see everything in one tool can actually dilute the value of that data. Your dashboards, and your tools, need to [tell a story](https://aws-observability.github.io/observability-best-practices/tools/dashboards/). And this story needs to include the business metrics and outcomes that are impacted by events in your workloads.

Moreover, your tooling needs to align to your operating model. A single pane of glass can add value when your support teams are global with access to all of your environments, but if they are limited to only accessing a single workload, in a single CSP or hybrid environment, then there is no value added through this approach. In these instances, allowing teams to create dashboards within each environment natively may hasten time to value, and be more flexible changes in the future.

:::info
    The value of observability data is deeply integrated into the application from which it came. Your telemetry requires contextual awareness that comes from its environment. In hybrid and multicloud environments, the differences between technologies makes the need for context even greater (though systems such as Kubernetes can be similar between different cloud providers and on-premises).
:::

:::info
    When building a single pane of glass for distributed system, display your business metrics and Service Level Objectives (SLOs) in the same view as other data (such as infrastructure metrics) that contributes to these SLOs. This gives context that may otherwise be lacking.
:::

:::tip
    A single pane of glass can help to rapidly diagnose issues and reduce Time to Detection (MTTD) and thereby Mean Time to Resolution (MTTR), but only if the meaning of telemetry data can be preserved. Without this, a single pane of glass approach can increase the time to value, or become a net-negative for operations teams.
:::

:::info
    If the value of a single pane of glass cannot be determined, or if workloads are bound entirely to a single CSP or on-premises environment, consider only rolling-up top-level business metrics to a single pane of glass, leaving the raw metrics and other contributing factors in their original environments.
:::

## Invest in OpenTelemetry

Across the observability vendor landscape, OpenTelemetry (OTel) has become the de-facto standard. OTEL can marshal each of your telemetry types into one or many collectors, which can include cloud-native services, or a wide variety of SaaS and ISV products. OTel agents and collectors communicate using the OpenTelemetry Protocol (OTLP), which encapsulates signals into a format allowing a wide variety of deployment patterns.

To collect transaction traces with the most value, and with your business and infrastructure context, you will need to integrate trace collection into your application. Some auto-instrumentation agents can perform this with almost no effort. However, the most sophisticated use cases do require code changes on your behalf to support transaction traces. This creates some technical debt and ties-down your workload to a particular technology.

OTel captures logs, metrics, and traces using a concept of a span. Spans contain these signals grouped together from a single transaction, packaging them into a contextualized, searchable object. This means you can view your signals from a single application event in one simple entity. For example, a user logging into a web site, and the requests this creates to all the downstream services this integrates with, can be presented as a single span.

:::tip
    OTel is not limited to application traces, and is widely used for logs and metrics. And many [ISV products accept OTLP directly today](https://opentelemetry.io/ecosystem/vendors/).
:::

:::info
    By instrumenting your applications using OTel, you remove the need to replace this instrumentation at the application layer in the future, should you choose to move from one observability platform to another. This turns part of your observability solution into a [two-way door](https://aws.amazon.com/executive-insights/content/how-amazon-defines-and-operationalizes-a-day-1-culture/).
:::

:::info
    OTel is future-proofing, scalable, and makes it easier to change your collection and analysis systems in the future without having to change application code, making it an efficient [shift to the left](https://www.youtube.com/watch?v=99r7cxKW8Rg).
:::    
