# AWS Distro for Open Telemetry (ADOT) -  FAQ

1. **Can I use the ADOT collector to ingest metrics into AMP?
    **Yes, this functionality was introduced with the GA launch for metrics support in May 2022 and you can use the ADOT collector from EC2, via our EKS add-on, via our ECS side-car integration, and/or via our Lambda layers.
1. **Can I use the ADOT collector to collect logs and ingest them into Amazon CloudWatch or Amazon OpenSearch?**
    Not yet but we’re working on stabilizing logs upstream in OpenTelemetry and when the time comes, potentially later in 2023 or early 2024 we will support logs in ADOT, see also the [public roadmap entry](https://github.com/aws-observability/aws-otel-community/issues/11)
1. **Where can I find resource usage and performance details on the ADOT collector?**
    We have a [Performance Report](https://aws-observability.github.io/aws-otel-collector/benchmark/report) online that we keep up to date as we release collectors.
1. **Is it possible to use ADOT with Apache Kafka?**
    We’re working on it, please subscribe to the public roadmap entries [here](https://github.com/aws-observability/aws-otel-collector/issues/1755) and  [here](https://github.com/aws-observability/aws-otel-collector/issues/1756) to keep up to date.
1. **Can I do advanced sampling in the ADOT collector?**
    We’re working on it, please subscribe to the public [roadmap entry](https://github.com/aws-observability/aws-otel-collector/issues/1135) to keep up to date.
1. **Does ADOT support trace propagation across AWS services such as Event Bridge or SQS?
    **Technically, that’s not ADOT but AWS X-Ray. We are working on expanding the number and types of AWS services that propagate and/or generate spans. If you have a use case depending on this, please reach out to us.
1. **Will I be able to use the W3C trace header to ingest spans into AWS X-Ray using ADOT?**
    Yes, later in 2023. We’re working on supporting W3C trace context propagation.
1. **Any tips how to scale the ADOT collector?**
    Yes! See the upstream OpenTelemetry docs on [Scaling the Collector](https://opentelemetry.io/docs/collector/scaling/).
1. **I have a fleet of ADOT collectors, how can I manage them?**
    This is an area of active development and  we expect that it will mature in 2023, see the upstream OpenTelemetry docs on [Management](https://opentelemetry.io/docs/collector/management/) for more details, specifically on the [Open Agent Management Protocol (OpAMP)](https://opentelemetry.io/docs/collector/management/#opamp).
1. **How do you monitor the health and performance of the ADOT collector?**
    1. [Monitoring the collector](https://github.com/open-telemetry/opentelemetry-collector/blob/main/docs/monitoring.md) - default metrics exposed on port 8080 that can be scraped by the Prometheus receiver
    2. Using the [Node Exporter](https://prometheus.io/docs/guides/node-exporter/), running node exporter would also provide several performance and health metrics about the node, pod, and operating system the collector is running in.
    3. [Kube-state-metrics (KSM)](https://github.com/kubernetes/kube-state-metrics), KSM can also produce interesting events about the collector.
    4. [Prometheus `up` metric](https://github.com/open-telemetry/opentelemetry-collector/pull/2918)
    5. A simple Grafana dashboard to get started: [https://grafana.com/grafana/dashboards/12553]()
1. **Product FAQ** - [https://aws.amazon.com/otel/faqs/]()

