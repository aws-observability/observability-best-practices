# Amazon Managed Service for Prometheus

[Amazon Managed Service for Prometheus][amp-main] (AMP) is a Prometheus-compatible
monitoring service that makes it easy to monitor containerized applications at scale. 
With AMP, you can use the Prometheus query language (PromQL) to monitor the
performance of containerized workloads without having to manage the underlying 
infrastructure required to manage the ingestion, storage, and querying of operational
metrics.

Check out the following recipes:

- [Getting Started with AMP][amp-gettingstarted]
- [Using ADOT in EKS on EC2 to ingest to AMP and visualize in AMG](recipes/ec2-eks-metrics-go-adot-ampamg.md)
- [Setting up cross-account ingestion into AMP][amp-xaccount]
- [Metrics collection from ECS using AMP][amp-ecs-metrics]
- [Configuring Grafana Cloud Agent for AMP][amp-gcwa]
- [Set up cross-region metrics collection for AMP workspaces][amp-xregion-metrics]
- [Best practices for migrating self-hosted Prometheus on EKS to AMP][amp-migration]
- [Workshop for Getting Started with AMP][amp-oow]
- [Exporting Cloudwatch Metric Streams via Firehose and AWS Lambda to Amazon Managed Service for Prometheus](recipes/lambda-cw-metrics-go-amp.md)
- [Terraform as Infrastructure as a Code to deploy Amazon Managed Service for Prometheus and configure Alert manager](recipes/amp-alertmanager-terraform.md)
- [Monitor Istio on EKS using Amazon Managed Prometheus and Amazon Managed Grafana][amp-istio-monitoring]
- [Monitoring Amazon EKS Anywhere using Amazon Managed Service for Prometheus and Amazon Managed Grafana][amp-anywhere-monitoring]
- [Introducing Amazon EKS Observability Accelerator][eks-accelerator]
[amp-main]: https://aws.amazon.com/prometheus/
[amp-gettingstarted]: https://aws.amazon.com/blogs/mt/getting-started-amazon-managed-service-for-prometheus/
[amp-xaccount]: https://aws.amazon.com/blogs/opensource/setting-up-cross-account-ingestion-into-amazon-managed-service-for-prometheus/
[amp-ecs-metrics]: https://aws.amazon.com/blogs/opensource/metrics-collection-from-amazon-ecs-using-amazon-managed-service-for-prometheus/
[amp-gcwa]: https://aws.amazon.com/blogs/opensource/configuring-grafana-cloud-agent-for-amazon-managed-service-for-prometheus/
[amp-xregion-metrics]: https://aws.amazon.com/blogs/opensource/set-up-cross-region-metrics-collection-for-amazon-managed-service-for-prometheus-workspaces/
[amp-migration]: https://aws.amazon.com/blogs/opensource/best-practices-for-migrating-self-hosted-prometheus-on-amazon-eks-to-amazon-managed-service-for-prometheus/
[amp-oow]: https://observability.workshop.aws/en/amp.html
[amp-istio-monitoring]: https://aws.amazon.com/blogs/mt/monitor-istio-on-eks-using-amazon-managed-prometheus-and-amazon-managed-grafana/
[amp-anywhere-monitoring]: https://aws.amazon.com/blogs/containers/monitoring-amazon-eks-anywhere-using-amazon-managed-service-for-prometheus-and-amazon-managed-grafana/
[eks-accelerator]: recipes/eks-observability-accelerator.md
- [Auto-scaling Amazon EC2 using Amazon Managed Service for Prometheus and alert manager](recipes/as-ec2-using-amp-and-alertmanager.md)