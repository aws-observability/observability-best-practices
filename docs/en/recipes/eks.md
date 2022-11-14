# Amazon Elastic Kubernetes Service

[Amazon Elastic Kubernetes Service][eks-main] (EKS) gives you the flexibility to 
start, run, and scale Kubernetes applications in the AWS Cloud or on-premises. 

Check out the following recipes, grouped by compute engine:

## EKS on EC2

### Logs

- [Fluent Bit Integration in CloudWatch Container Insights for EKS][eks-cw-fb]
- [Logging with EFK Stack][eks-ws-efk]
- [Sample logging architectures for Fluent Bit and FluentD on EKS][eks-logging]

### Metrics

- [Getting Started with Amazon Managed Service for Prometheus][amp-gettingstarted]
- [Using ADOT in EKS on EC2 to ingest metrics to AMP and visualize in AMG][ec2-eks-metrics-go-adot-ampamg]
- [Configuring Grafana Cloud Agent for Amazon Managed Service for Prometheus][gcwa-amp]
- [Monitoring cluster using Prometheus and Grafana][eks-ws-prom-grafana]
- [Monitoring with Managed Prometheus and Managed Grafana][eks-ws-amp-amg]
- [CloudWatch Container Insights][eks-ws-cw-ci]
- [Set up cross-region metrics collection for AMP workspaces][amp-xregion]
- [Monitoring App Mesh environment on EKS using Amazon Managed Service for Prometheus][eks-am-amp-amg]
- [Monitor Istio on EKS using Amazon Managed Prometheus and Amazon Managed Grafana][eks-istio-monitoring]
- [Proactive autoscaling of Kubernetes workloads with KEDA and Amazon CloudWatch][eks-keda-cloudwatch-scaling]
- [Monitoring Amazon EKS Anywhere using Amazon Managed Service for Prometheus and Amazon Managed Grafana][eks-anywhere-monitoring]

### Traces

- [Migrating X-Ray tracing to AWS Distro for OpenTelemetry][eks-otel-xray]
- [Tracing with X-Ray][eks-ws-xray]

## EKS on Fargate

### Logs

- [Fluent Bit for Amazon EKS on AWS Fargate is here][eks-fargate-logging]
- [Sample logging architectures for Fluent Bit and FluentD on EKS][eks-fb-example]

### Metrics

- [Using ADOT in EKS on Fargate to ingest metrics to AMP and visualize in AMG][fargate-eks-metrics-go-adot-ampamg]
- [CloudWatch Container Insights][eks-ws-cw-ci]
- [Set up cross-region metrics collection for AMP workspaces][amp-xregion]

### Traces

- [Using ADOT in EKS on Fargate with AWS X-Ray][fargate-eks-xray-go-adot-amg]
- [Tracing with X-Ray][eks-ws-xray]


[eks-main]: https://aws.amazon.com/eks/
[eks-cw-fb]: https://aws.amazon.com/blogs/containers/fluent-bit-integration-in-cloudwatch-container-insights-for-eks/
[eks-ws-efk]: https://www.eksworkshop.com/intermediate/230_logging/
[eks-logging]: https://github.com/aws-samples/amazon-eks-fluent-logging-examples
[amp-gettingstarted]: https://aws.amazon.com/blogs/mt/getting-started-amazon-managed-service-for-prometheus/
[ec2-eks-metrics-go-adot-ampamg]: recipes/ec2-eks-metrics-go-adot-ampamg.md
[gcwa-amp]: https://aws.amazon.com/blogs/opensource/configuring-grafana-cloud-agent-for-amazon-managed-service-for-prometheus/
[eks-ws-prom-grafana]: https://www.eksworkshop.com/intermediate/240_monitoring/
[eks-ws-amp-amg]: https://www.eksworkshop.com/intermediate/246_monitoring_amp_amg/
[eks-ws-cw-ci]: https://www.eksworkshop.com/intermediate/250_cloudwatch_container_insights/
[fargate-eks-metrics-go-adot-ampamg]: recipes/fargate-eks-metrics-go-adot-ampamg.md
[amp-xregion]: https://aws.amazon.com/blogs/opensource/set-up-cross-region-metrics-collection-for-amazon-managed-service-for-prometheus-workspaces/
[eks-otel-xray]: https://aws.amazon.com/blogs/opensource/migrating-x-ray-tracing-to-aws-distro-for-opentelemetry/
[eks-ws-xray]: https://www.eksworkshop.com/intermediate/245_x-ray/x-ray/
[eks-fargate-logging]: https://aws.amazon.com/blogs/containers/fluent-bit-for-amazon-eks-on-aws-fargate-is-here/
[eks-fb-example]: https://github.com/aws-samples/amazon-eks-fluent-logging-examples
[eks-am-amp-amg]: recipes/servicemesh-monitoring-ampamg.md
[fargate-eks-xray-go-adot-amg]: recipes/fargate-eks-xray-go-adot-amg.md
[eks-istio-monitoring]: https://aws.amazon.com/blogs/mt/monitor-istio-on-eks-using-amazon-managed-prometheus-and-amazon-managed-grafana/
[eks-keda-cloudwatch-scaling]: https://aws-blogs-prod.amazon.com/mt/proactive-autoscaling-of-kubernetes-workloads-with-keda-using-metrics-ingested-into-amazon-cloudwatch/
[eks-anywhere-monitoring]: https://aws.amazon.com/blogs/containers/monitoring-amazon-eks-anywhere-using-amazon-managed-service-for-prometheus-and-amazon-managed-grafana/
