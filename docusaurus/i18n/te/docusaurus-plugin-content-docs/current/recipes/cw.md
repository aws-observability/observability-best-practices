# Amazon CloudWatch

[Amazon CloudWatch][cw-main] (CW) DevOps ఇంజనీర్లు, డెవలపర్లు, site reliability engineers (SREs), మరియు IT మేనేజర్ల కోసం నిర్మించబడిన మానిటరింగ్ మరియు observability సేవ.
CloudWatch లాగ్‌లు, మెట్రిక్స్, మరియు ఈవెంట్‌ల రూపంలో మానిటరింగ్ మరియు ఆపరేషనల్ డేటాను సేకరిస్తుంది, AWS రిసోర్స్‌లు, అప్లికేషన్‌లు, మరియు AWS పై మరియు on-premises సర్వర్‌లపై రన్ అయ్యే సేవల యొక్క ఏకీకృత వ్యూను మీకు అందిస్తుంది.

కింది రెసిపీలను చూడండి:

- [CW Logs, Lambda, మరియు SNS తో RDS కోసం proactive database monitoring నిర్మించండి][rds-cw]
- [EKS లో Kubernetes-native డెవలపర్ల కోసం CloudWatch-centric observability ను అమలు చేయడం][swa-eks-cw]
- [CW Synthetics ద్వారా Canaries సృష్టించండి][cw-synths]
- [లాగ్‌ల క్వెరీయింగ్ కోసం Cloudwatch Logs Insights][cw-logsi]
- [Lambda Insights][cw-lambda]
- [CloudWatch ద్వారా Anomaly Detection][cw-am]
- [CloudWatch ద్వారా Metrics Alarms][cw-alarms]
- [Backpressure నివారించడానికి container logging options ఎంచుకోవడం][cw-fluentbit]
- [ECS మరియు EKS పై AWS Distro for OpenTelemetry తో CloudWatch Container Insights Prometheus Support పరిచయం][cwci-adot]
- [CW Container Insights ఉపయోగించి ECS containerized Applications మరియు Microservices మానిటరింగ్][cwci-ecs]
- [CW Container Insights ఉపయోగించి EKS containerized Applications మరియు Microservices మానిటరింగ్][cwci-eks]
- [Firehose మరియు AWS Lambda ద్వారా Cloudwatch Metric Streams ను Amazon Managed Service for Prometheus కు ఎక్స్‌పోర్ట్ చేయడం](recipes/lambda-cw-metrics-go-amp.md)
- [KEDA మరియు Amazon CloudWatch తో Kubernetes workloads యొక్క Proactive autoscaling][cw-keda-eks-scaling]
- [రిసోర్స్ tags ద్వారా ఫిల్టర్ చేయబడిన మెట్రిక్స్‌ను aggregate మరియు visualize చేయడానికి Amazon CloudWatch Metrics explorer ఉపయోగించడం][metrics-explorer-filter-by-tags]


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
