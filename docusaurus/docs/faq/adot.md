# AWS Distro for Open Telemetry (ADOT) -  FAQ

1. **Can I use the ADOT collector to ingest metrics into AMP?
    **Yes, this functionality was introduced with the GA launch for metrics support in May 2022 and you can use the ADOT collector from EC2, via our EKS add-on, via our ECS side-car integration, and/or via our Lambda layers.
1. **Can I use the ADOT collector to collect logs and ingest them into Amazon CloudWatch or Amazon OpenSearch?**
    Not yet but we’re working on stabilizing logs upstream in OpenTelemetry and when the time comes, potentially later in 2023 or early 2024 we will support logs in ADOT, see also the [public roadmap entry](https://github.com/aws-observability/aws-otel-community/issues/11)
1. **Where can I find resource usage and performance details on the ADOT collector?**
    We have a [Performance Report](https://aws-observability.github.io/aws-otel-collector/benchmark/report) online that we keep up to date as we release collectors.
1. **Is it possible to use ADOT with Apache Kafka?**
    Yes, support to Kafka exporter and receiver was added in the ADOT collector v0.28.0. For more details, please check the [ADOT collector documentation](https://aws-otel.github.io/docs/components/kafka-receiver-exporter).
1. **How can I configure the ADOT collector?**
    The ADOT collector is configured using YAML configuration files that are stored locally. Besides that, it is possible to use configuration stored in other locations, like S3 buckets. All the supported mechanisms to configure the ADOT collector are described in detail in the [ADOT collector documentation](https://aws-otel.github.io/docs/components/confmap-providers).
1. **Can I do advanced sampling in the ADOT collector?**
    We’re working on it, please subscribe to the public [roadmap entry](https://github.com/aws-observability/aws-otel-collector/issues/1135) to keep up to date.
1. **Any tips how to scale the ADOT collector?**
    Yes! See the upstream OpenTelemetry docs on [Scaling the Collector](https://opentelemetry.io/docs/collector/scaling/).
1. **I have a fleet of ADOT collectors, how can I manage them?**
    This is an area of active development and  we expect that it will mature in 2023, see the upstream OpenTelemetry docs on [Management](https://opentelemetry.io/docs/collector/management/) for more details, specifically on the [Open Agent Management Protocol (OpAMP)](https://opentelemetry.io/docs/collector/management/#opamp).
1. **How do you monitor the health and performance of the ADOT collector?**
    1. [Monitoring the collector](https://github.com/open-telemetry/opentelemetry-collector/blob/main/docs/observability.md) - default metrics exposed on port 8080 that can be scraped by the Prometheus receiver
    2. Using the [Node Exporter](https://prometheus.io/docs/guides/node-exporter/), running node exporter would also provide several performance and health metrics about the node, pod, and operating system the collector is running in.
    3. [Kube-state-metrics (KSM)](https://github.com/kubernetes/kube-state-metrics), KSM can also produce interesting events about the collector.
    4. [Prometheus `up` metric](https://github.com/open-telemetry/opentelemetry-collector/pull/2918)
    5. A simple Grafana dashboard to get started: [https://grafana.com/grafana/dashboards/12553](.)
1. **Product FAQ** - [https://aws.amazon.com/otel/faqs/](.)

