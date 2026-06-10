# Amazon CloudWatch

[Amazon CloudWatch][cw-main] (CW) என்பது DevOps engineers, developers, site reliability engineers (SREs) மற்றும் IT managers-க்காக உருவாக்கப்பட்ட monitoring மற்றும் observability சேவை ஆகும்.
CloudWatch logs, metrics மற்றும் events வடிவில் monitoring மற்றும் operational data-ஐ சேகரித்து, AWS resources, applications மற்றும் AWS மற்றும் on-premises servers-ல் இயங்கும் services-ன் ஒருங்கிணைந்த பார்வையை வழங்குகிறது.

பின்வரும் recipes-ஐ பாருங்கள்:

- [CW Logs, Lambda மற்றும் SNS-உடன் RDS-க்கான proactive database monitoring உருவாக்குதல்][rds-cw]
- [EKS-ல் Kubernetes-native developers-க்கு CloudWatch-centric observability செயல்படுத்துதல்][swa-eks-cw]
- [CW Synthetics வழியாக Canaries உருவாக்குதல்][cw-synths]
- [Logs-ஐ Query செய்ய Cloudwatch Logs Insights][cw-logsi]
- [Lambda Insights][cw-lambda]
- [CloudWatch வழியாக Anomaly Detection][cw-am]
- [CloudWatch வழியாக Metrics Alarms][cw-alarms]
- [Backpressure-ஐ தவிர்க்க container logging options தேர்வு][cw-fluentbit]
- [ECS மற்றும் EKS-ல் AWS Distro for OpenTelemetry-உடன் CloudWatch Container Insights Prometheus Support அறிமுகம்][cwci-adot]
- [CW Container Insights பயன்படுத்தி ECS containerized Applications மற்றும் Microservices-ஐ Monitoring செய்தல்][cwci-ecs]
- [CW Container Insights பயன்படுத்தி EKS containerized Applications மற்றும் Microservices-ஐ Monitoring செய்தல்][cwci-eks]
- [Firehose மற்றும் AWS Lambda வழியாக Cloudwatch Metric Streams-ஐ Amazon Managed Service for Prometheus-க்கு Export செய்தல்](recipes/lambda-cw-metrics-go-amp.md)
- [KEDA மற்றும் Amazon CloudWatch-உடன் Kubernetes workloads-ன் Proactive autoscaling][cw-keda-eks-scaling]
- [Resource tags மூலம் வடிகட்டப்பட்ட metrics-ஐ aggregate மற்றும் visualize செய்ய Amazon CloudWatch Metrics explorer பயன்படுத்துதல்][metrics-explorer-filter-by-tags]


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
[cw-keda-eks-scaling]: https://aws.amazon.com/blogs/mt/proactive-autoscaling-of-kubernetes-workloads-with-keda-using-metrics-ingested-into-amazon-cloudwatch/
[metrics-explorer-filter-by-tags]: recipes/metrics-explorer-filter-by-tags.md
