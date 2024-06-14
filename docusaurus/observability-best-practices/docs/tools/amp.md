# Amazon Managed Service for Prometheus

[Prometheus](https://prometheus.io/) is a popular open source monitoring tool that provides wide ranging metrics capabilities and insights about resources such as compute nodes and application related performance data. 

Prometheus uses a *pull* model to collect data, where as CloudWatch uses a *push* model. Prometheus and CloudWatch are used for some overlapping use cases, though their operating models are very different and are priced differently.

[Amazon Managed Service for Prometheus](https://aws.amazon.com/prometheus/) is widely used in containerized applications hosted in Kubernetes and [Amazon ECS](https://aws.amazon.com/ecs/).

You can add Prometheus metric capabilities on your EC2 instance or ECS/EKS cluster using the [CloudWatch agent](../tools/cloudwatch_agent/) or [AWS Distro for OpenTelemetry](https://aws-otel.github.io/). The CloudWatch agent with Prometheus support discovers and collects Prometheus metrics to monitor, troubleshoot, and alarm on application performance degradation and failures faster. This also reduces the number of monitoring tools required to improve observability.

CloudWatch Container Insights monitoring for Prometheus automates the discovery of Prometheus metrics from containerized systems and workloads https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ ContainerInsights-Prometheus.html