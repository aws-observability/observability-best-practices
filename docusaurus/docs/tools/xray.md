# AWS X-Ray
 
## Sampling rules

Sampling rules using X-Ray can be configured in the AWS Console, through local configuration file, or both. The local configuration will override those set in the console. 

:::info
	Use the X-Ray console, API, or CloudFormation whenever possible. This allows you to change the sampling behaviour of an application at runtime.
:::
You can set sample rates separately for each of these criteria:

* Service name (e.g. billing, payments)
* Service type (e.g. EC2, Container)
* HTTP method
* URL path
* Resource ARN
* Host (e.g. www.example.com)

The best practice is to set a sample rate that collects enough data to diagnose issues and understand performance profiles, while not collecting so much data that it is unmanageable. For example, sampling 1% of traffic to a landing page, but 10% of requests to a payment page, would align well with a strong observability practice.

Some transactions you may wish to capture 100% of. Be cautious though as traces are not intended for forensic audits of access to your workload!

:::warning
	As traces are not intended to be used for auditing or forensic analysis, avoid sample rates of 100%. This can set a false expectation that X-Ray (by default using a UDP emitter) will never lose a transaction trace.
:::
As a rule, capturing transaction traces should never create an onerous load on your staff, or your AWS bill. Add traces to your environment slowly while you learn the volume of data that your workload emits.

:::info
	By default, the X-Ray SDK records the first request each second, and five percent of any additional requests.
	Always set a reservoir size that you can tolerate. The reservoir size determines the maximum number of requests per second that you will capture. This protects you from malicious attack, unwanted charges, and configuration errors.
:::
## Daemon configuration

The X-Ray daemon is intended to offload the effort of sending telemetry to the X-Ray dataplane for analysis. As such, it should not consume too many resources on the server, container, or instance on which the source application runs.

:::info
	The best practice is to run the X-Ray daemon on another instance or container, thereby enforcing the separation of concerns and allowing your source system to be unencumbered. 
:::

:::info
	In a container orchestration pattern, such as Kubernetes, operating your X-Ray daemon as a sidecar is a common practice.
:::
The daemon has safe default settings and can operate in EC2, ECS, EKS, or Fargate environments without futher configuration in most instances. For hybrid and other cloud environments though, you may with to adjust the `Endpoint` to reflect a [VPC endpoint](https://docs.aws.amazon.com/vpc/latest/privatelink/concepts.html) if you are using a Direct Connect or VPN to integrate your remote environments.

:::tip
	If you must run the X-Ray daemon on the same instance or virtual machine as the source application, consider setting the `TotalBufferSizeMB` setting to ensure X-ray does not consume more system resources than you can afford.
:::
## Annotations

AWS X-Ray supports arbitrary metadata to be sent along with your traces. These are called *annotations*. They are a powerful feature that allows you to group your traces logically. Annotations are indexed as well, making for an easy way to find traces that pertain to a single entity.

When you use auto-instrumentation SDKs for X-Ray, annotations may not appear automatically. You need to add them to your code, which greatly enriches your traces and creates ways for you to generate X-Ray Insights, metrics based off of your annotations, alarms and anomaly detection models from your system behaviour, and automate ticketing and remediation when a component impacting your users is observed.

:::info
	Use annotations to understand the flow of data in your environment.
:::

:::info
	Create alarms based on the performance and results of your annotated traces.
:::