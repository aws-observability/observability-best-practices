# Choosing a tracing agent

## Choose the right agent

AWS directly supports two toolsets for [trace](../../signals/traces/) collection (plus our wealth of [observability partners](https://aws.amazon.com/products/management-and-governance/partners/): 

* The [AWS Distro for OpenTelemetry](https://aws-otel.github.io/), commonly called ADOT
* The X-Ray [SDKs](https://docs.aws.amazon.com/xray/latest/devguide/xray-instrumenting-your-app.html) and [daemon](https://docs.aws.amazon.com/xray/latest/devguide/xray-daemon.html)

The selection of which tool or tools to use is a principal decision you must make as you evolve your observability solution. These tools are not mutually-exclusive, and you can mix them together as necessary. And there is a best practice for making this selection. However, first you should understand the current state of [OpenTelemetry (OTEL)](https://opentelemetry.io/).

OTEL is the current industry standard specification for observabillity signalling, and contains definitions for each of the three core signal types: [metrics](../../signals/metrics/), [traces](../../signals/traces/), and [logs](../../signals/logs). However, OTEL has not always existed and has evolved out of earlier specifications such as [OpenMetrics](https://openmetrics.io) and [OpenTracing](https://opentracing.io). Observability vendors began openly supporting OpenTelemetry Line Protocol (OTLP) in recent years. 

AWS X-Ray and CloudWatch pre-date the OTEL specification, as do other leading observability solutions. However, the AWS X-Ray service readily accepts OTEL traces using ADOT. ADOT has the integrations already built into it to emit telemetry into X-Ray directly, as well as to other ISV solutions.

Any transaction tracing solution requires an agent and an integration into the underlying application in order to collect signals. And this, in turn, creates [technical debt](../../faq/#what-is-technical-debt) in the form of libraries that must be tested, maintained, and upgraded, as well as possibly retooling if you choose to change your solution in the future.

The SDKs included with X-Ray are part of a tightly integrated instrumentation solution offered by AWS. ADOT is part of a broader industry solution in which X-Ray is only one of many tracing solutions. You can implement end-to-end tracing in X-Ray using either approach, but it’s important to understand the differences in order to determine the most useful approach for you.

:::info
	We recommend instrumenting your application with the AWS Distro for OpenTelemetry if you need the following:

    * The ability to send traces to multiple different tracing backends without having to re-instrument your code. For example, of you wish to shift from using the X-Ray console to [Zipkin](https://zipkin.io), then only configuration of the collector would change, leaving your applicaiton code untouched.

    * Support for a large number of library instrumentations for each language, maintained by the OpenTelemetry community. 
:::

:::info
	We recommend choosing an X-Ray SDK for instrumenting your application if you need the following:

    * A tightly integrated single-vendor solution.

    * Integration with X-Ray centralized sampling rules, including the ability to configure sampling rules from the X-Ray console and automatically use them across multiple hosts, when using Node.js, Python, Ruby, or .NET
:::