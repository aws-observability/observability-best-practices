# Amazon CloudWatch

[Amazon CloudWatch][cw-main] (CW) is a monitoring and observability service built 
for DevOps engineers, developers, site reliability engineers (SREs), and IT managers.
CloudWatch collects monitoring and operational data in the form of logs, metrics, 
and events, providing you with a unified view of AWS resources, applications, 
and services that run on AWS and on-premises servers.

Check out the following recipes:

- [Build proactive database monitoring for RDS with CW Logs, Lambda, and SNS][rds-cw]
- [Implementing CloudWatch-centric observability for Kubernetes-native developers in EKS][swa-eks-cw]
- [Create Canaries via CW Synthetics][cw-synths]
- [Cloudwatch Logs Insights for Quering Logs][cw-logsi]
- [Lambda Insights][cw-lambda]
- [Anomaly Detection via CloudWatch][cw-am]
- [Metrics Alarms via CloudWatch][cw-alarms]
- [Choosing container logging options to avoid backpressure][cw-fluentbit]
- [Introducing CloudWatch Container Insights Prometheus Support with AWS Distro for OpenTelemetry on ECS and EKS][cwci-adot]
- [Monitoring ECS containerized Applications and Microservices using CW Container Insights][cwci-ecs]
- [Monitoring EKS containerized Applications and Microservices using CW Container Insights][cwci-eks]
- [Exporting Cloudwatch Metric Streams via Firehose and AWS Lambda to Amazon Managed Service for Prometheus](recipes/lambda-cw-metrics-go-amp.md)
- [Proactive autoscaling of Kubernetes workloads with KEDA and Amazon CloudWatch][cw-keda-eks-scaling]
- [Using Amazon CloudWatch Metrics explorer to aggregate and visualize metrics filtered by resource tags][metrics-explorer-filter-by-tags]


[cw-main]: https://aws.amazon.com/cloudwatch/
[rds-cw]: https://aws.amazon.com/blogs/database/build-proactive-database-monitoring-for-amazon-rds-with-amazon-cloudwatch-logs-aws-lambda-and-amazon-sns/
[swa-eks-cw]: https://aws.amazon.com/blogs/opensource/implementing-cloudwatch-centric-observability-for-kubernetes-native-developers-in-amazon-elastic-kubernetes-service/
[cw-synths]: https://observability.workshop.aws/en/synthetics.html
[cw-logsi]: https://observability.workshop.aws/en/logsinsights.html
[cw-lambda]: https://observability.workshop.aws/en/logsinsights.html
[cw-am]: https://observability.workshop.aws/en/anomalydetection.html
[cw-alarms]: https://observability.workshop.aws/en/alarms/_mericalarm.html
[cw-fluentbit]: https://aws.amazon.com/blogs/containers/choosing-container-logging-options-to-avoid-backpressure/
[cwci-adot]: https://aws.amazon.com/blogs/containers/introducing-cloudwatch-container-insights-prometheus-support-with-aws-distro-for-opentelemetry-on-amazon-ecs-and-amazon-eks/
[cwci-ecs]: https://observability.workshop.aws/en/containerinsights/ecs.html
[cwci-eks]: https://observability.workshop.aws/en/containerinsights/eks.html
[cw-keda-eks-scaling]: https://aws-blogs-prod.amazon.com/mt/proactive-autoscaling-of-kubernetes-workloads-with-keda-using-metrics-ingested-into-amazon-cloudwatch/
[metrics-explorer-filter-by-tags]: recipes/metrics-explorer-filter-by-tags.md
