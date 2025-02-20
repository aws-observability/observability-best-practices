# AWS Distro for Open Telemetry (ADOT) -  FAQ

## Can I use the ADOT collector to ingest metrics into AMP?

Yes, this functionality was introduced with the GA launch for metrics support in May 2022 and you can use the ADOT collector from EC2, via our EKS add-on, via our ECS side-car integration, and/or via our Lambda layers.

## Can I use the ADOT collector to collect logs and ingest them into Amazon CloudWatch or Amazon OpenSearch?

Yes. [Log support](https://aws.amazon.com/about-aws/whats-new/2023/11/logs-support-aws-distro-opentelemetry/) has been available since Nov 22, 2023. You can view the [Logging Exporter](https://aws-otel.github.io/docs/components/misc-exporters) page for more details.

## Where can I find resource usage and performance details on the ADOT collector?

We have a [Performance Report](https://aws-observability.github.io/aws-otel-collector/benchmark/report) online that we keep up to date as we release collectors.

## Is it possible to use ADOT with Apache Kafka?

Yes, support to Kafka exporter and receiver was added in the ADOT collector v0.28.0. For more details, please check the [ADOT collector documentation](https://aws-otel.github.io/docs/components/kafka-receiver-exporter).
.
## How can I configure the ADOT collector?

The ADOT collector is configured using YAML configuration files that are stored locally. Besides that, it is possible to use configuration stored in other locations, like S3 buckets. All the supported mechanisms to configure the ADOT collector are described in detail in the [ADOT collector documentation](https://aws-otel.github.io/docs/components/confmap-providers).

## Can I do advanced sampling in the ADOT collector?

Yes. [Advanced Sampling](https://aws.amazon.com/about-aws/whats-new/2023/05/aws-distro-opentelemetry-advanced-sampling/) launched May 15, 2023. View the [Getting Started with Advanced Sampling using AWS Distro for OpenTelemetry](https://aws-otel.github.io/docs/getting-started/advanced-sampling) page for more details.

## Any tips how to scale the ADOT collector?

Yes! See the upstream OpenTelemetry docs on [Scaling the Collector](https://opentelemetry.io/docs/collector/scaling/).

## I have a fleet of ADOT collectors, how can I manage them?

This is an area of active development and we expect that it will mature in 2023, see the upstream OpenTelemetry docs on [Management](https://opentelemetry.io/docs/collector/management/) for more details, specifically on the [Open Agent Management Protocol (OpAMP)](https://opentelemetry.io/docs/collector/management/#opamp).

## How do you monitor the health and performance of the ADOT collector?

1. [Monitoring the collector](https://github.com/open-telemetry/opentelemetry-collector/blob/main/docs/observability.md) - default metrics exposed on port 8080 that can be scraped by the Prometheus receiver
2. Using the [Node Exporter](https://prometheus.io/docs/guides/node-exporter/), running node exporter would also provide several performance and health metrics about the node, pod, and operating system the collector is running in.
3. [Kube-state-metrics (KSM)](https://github.com/kubernetes/kube-state-metrics), KSM can also produce interesting events about the collector.
4. [Prometheus `up` metric](https://github.com/open-telemetry/opentelemetry-collector/pull/2918)
5. A simple Grafana dashboard to get started: [https://grafana.com/grafana/dashboards/12553]()

**Product FAQ:** [https://aws.amazon.com/otel/faqs/](https://aws.amazon.com/otel/faqs/)

