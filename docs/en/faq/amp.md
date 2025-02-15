# Amazon Managed Service for Prometheus - FAQ

**Which AWS Regions are supported currently and is it possible to collect metrics from other regions?** 

See our [documentation](https://docs.aws.amazon.com/prometheus/latest/userguide/what-is-Amazon-Managed-Service-Prometheus.html) for updated list of Regions that we support. We plan to support all commercial regions in 2023. Please let us know which regions you would like so that we can better prioritize our existing Product Feature Requests (PFRs). You can always collect data from any regions and send it to a specific region that we support. Here’s a blog for more details: [Cross-region metrics collection for Amazon Managed Service for Prometheus](https://aws.amazon.com/blogs/opensource/set-up-cross-region-metrics-collection-for-amazon-managed-service-for-prometheus-workspaces/).

**How long does it take to see metering and/or billing in Cost Explorer or **
 [CloudWatch as AWS billing charges](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/gs_monitor_estimated_charges_with_cloudwatch.html)?**

We meter blocks of ingested metric samples as soon as they are uploaded to S3 every 2 hours. It can take up to 3 hours to see metering and charges reported for Amazon Managed Service for Prometheus.

**As far as I can see the Prometheus Service is only able to scrape metrics from a cluster (EKS/ECS) Is that correct?**

We apologize for the lack of documentation for other compute environments. You can use Prometheus server to scrape [Prometheus metrics from EC2](https://aws.amazon.com/blogs/opensource/using-amazon-managed-service-for-prometheus-to-monitor-ec2-environments/) and any other compute environments where you can install a Prometheus server today as long as you configure the remote write and setup the [AWS SigV4 proxy](https://github.com/awslabs/aws-sigv4-proxy). The link to the [EC2 blog](https://aws.amazon.com/blogs/opensource/using-amazon-managed-service-for-prometheus-to-monitor-ec2-environments/) has a section “Running aws-sigv4-proxy” that can show you how to run it. We do need to add more documentation to help our customers simplify how to run AWS SigV4 on other compute environments.

**How would one connect this service to Grafana? Is there some documentation about this?**

We use the default [Prometheus data source available in Grafana](https://grafana.com/docs/grafana/latest/datasources/prometheus/) to query Amazon Managed Service for Prometheus using PromQL. Here’s some documentation and a blog that will help you get started:
1. [Service docs](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-onboard-query.html)
1. [Grafana setup on EC2](https://aws.amazon.com/blogs/opensource/setting-up-grafana-on-ec2-to-query-metrics-from-amazon-managed-service-for-prometheus/)

**What are some of the best practices to reduce the number of samples being sent to Amazon Managed Service for Prometheus?**

To reduce the number of samples being ingested into Amazon Managed Service for Prometheus, customers can extend their scrape interval (e.g., change from 30s to 1min) or decrease the number of series they are scraping. Changing the scrape interval will have a more dramatic impact on the number of samples than decreasing the number of series, with doubling the scrape interval halving the volume of samples ingested.

**How to send CloudWatch metrics to Amazon Managed Service for Prometheus?**

We recommend utilizing [CloudWatch metric streams to send CloudWatch metrics to Amazon Managed Service for Prometheus](https://aws-observability.github.io/observability-best-practices/recipes/recipes/lambda-cw-metrics-go-amp/). Some possible shortcomings of this integration are,
1. A Lambda function is required to call the Amazon Managed Service for Prometheus APIs,
1. No ability to enrich CloudWatch metrics with metadata (e.g., with AWS tags) before ingesting them to Amazon Managed Service for Prometheus,
1. Metrics can only be filtered by namespace (not granular enough). As an alternative, customers can utilize Prometheus Exporters to send CloudWatch metrics data to Amazon Managed Service for Prometheus: (1) CloudWatch  Exporter: Java based scraping that uses CW ListMetrics and  GetMetricStatistics (GMS) APIs.

[**Yet Another CloudWatch Exporter (YACE)**](https://github.com/nerdswords/yet-another-cloudwatch-exporter) is another option to get metrics from CloudWatch into Amazon Managed Service for Prometheus. This is a Go based tool that uses the CW ListMetrics, GetMetricData (GMD), and  GetMetricStatistics (GMS) APIs. Some disadvantages in using this could be that you will have to deploy the agent and have to manage the life-cycle yourself which has to be done thoughtfully.

**What version of Prometheus are you compatible with?**

Amazon Managed Service for Prometheus is compatible with [Prometheus 2.x](https://github.com/prometheus/prometheus/blob/main/RELEASE.md). Amazon Managed Service for Prometheus is based on the open source [CNCF Cortex project](https://cortexmetrics.io/) as its data plane. Cortex strives to be 100% API compatible with Prometheus (under /prometheus/* and /api/prom/*). Amazon Managed Service for Prometheus supports Prometheus-compatible PromQL queries and Remote write metric ingestion and the Prometheus data model for existing metric types including Gauge, Counters, Summary, and Histogram. We do not currently expose [all Cortex APIs](https://cortexmetrics.io/docs/api/). The list of compatible APIs we support can be [found here](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-APIReference.html). Customers can work with their account team to open new or influence existing Product Features Requests (PFRs) if we are missing any features required from Amazon Managed Service for Prometheus.

**What collector do you recommend for ingesting metrics into Amazon Managed Service for Prometheus? Should I utilize Prometheus in Agent mode?**

We support the usage of Prometheus servers inclusive of agent mode, the OpenTelemetry agent, and the AWS Distro for OpenTelemetry agent as agents that customers can use to send metrics data to Amazon Managed Service for Prometheus. The AWS Distro for OpenTelemetry is a downstream distribution of the OpenTelemetry project packaged and secured by AWS. Any of the three should be fine, and you’re welcome to pick whichever best suits your individual team’s needs and preferences.

**How does Amazon Managed Service for Prometheus’s performance scale with the size of a workspace?**

Currently, Amazon Managed Service for Prometheus supports up to 200M active time series in a single workspace. When we announce a new max limit, we’re ensuring that the performance and reliability properties of the service continue to be maintained across ingest and query. Queries across the same size dataset should not see a performance degradation regardless of the number of active series in a workspace.

**Product FAQ:** [https://aws.amazon.com/prometheus/faqs/](https://aws.amazon.com/prometheus/faqs/)
