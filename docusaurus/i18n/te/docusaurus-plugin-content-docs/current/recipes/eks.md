# Amazon Elastic Kubernetes Service

[Amazon Elastic Kubernetes Service][eks-main] (EKS) AWS Cloud లో లేదా ఆన్-ప్రిమైసెస్‌లో Kubernetes అప్లికేషన్‌లను ప్రారంభించడానికి, నడపడానికి మరియు స్కేల్ చేయడానికి మీకు సౌలభ్యాన్ని అందిస్తుంది.

కింది రెసిపీలను చూడండి, కంప్యూట్ ఇంజిన్ ప్రకారం గ్రూప్ చేయబడ్డాయి:

## EC2 పై EKS

### లాగ్‌లు

- [EKS కోసం CloudWatch Container Insights లో Fluent Bit ఇంటిగ్రేషన్][eks-cw-fb]
- [EFK Stack తో లాగింగ్][eks-ws-efk]
- [EKS పై Fluent Bit మరియు FluentD కోసం నమూనా లాగింగ్ ఆర్కిటెక్చర్లు][eks-logging]

### మెట్రిక్స్

- [Amazon Managed Service for Prometheus తో ప్రారంభించడం][amp-gettingstarted]
- [AMP కు మెట్రిక్స్ ఇన్‌జెస్ట్ చేసి AMG లో విజువలైజ్ చేయడానికి EC2 పై EKS లో ADOT ఉపయోగించడం][ec2-eks-metrics-go-adot-ampamg]
- [Amazon Managed Service for Prometheus కోసం Grafana Cloud Agent కాన్ఫిగర్ చేయడం][gcwa-amp]
- [Prometheus మరియు Grafana ఉపయోగించి క్లస్టర్ మానిటరింగ్][eks-ws-prom-grafana]
- [Managed Prometheus మరియు Managed Grafana తో మానిటరింగ్][eks-ws-amp-amg]
- [CloudWatch Container Insights][eks-ws-cw-ci]
- [AMP వర్క్‌స్పేస్‌ల కోసం క్రాస్-రీజియన్ మెట్రిక్స్ కలెక్షన్ సెటప్][amp-xregion]
- [Amazon Managed Service for Prometheus ఉపయోగించి EKS పై App Mesh ఎన్విరాన్‌మెంట్ మానిటరింగ్][eks-am-amp-amg]
- [Amazon Managed Prometheus మరియు Amazon Managed Grafana ఉపయోగించి EKS పై Istio మానిటర్ చేయడం][eks-istio-monitoring]
- [KEDA మరియు Amazon CloudWatch తో Kubernetes వర్క్‌లోడ్ల ప్రోయాక్టివ్ ఆటోస్కేలింగ్][eks-keda-cloudwatch-scaling]
- [Amazon Managed Service for Prometheus మరియు Amazon Managed Grafana ఉపయోగించి Amazon EKS Anywhere మానిటరింగ్][eks-anywhere-monitoring]

### ట్రేసెస్

- [AWS Distro for OpenTelemetry కు X-Ray ట్రేసింగ్ మైగ్రేట్ చేయడం][eks-otel-xray]
- [X-Ray తో ట్రేసింగ్][eks-ws-xray]

## Fargate పై EKS

### లాగ్‌లు

- [AWS Fargate పై Amazon EKS కోసం Fluent Bit ఇక్కడ ఉంది][eks-fargate-logging]
- [EKS పై Fluent Bit మరియు FluentD కోసం నమూనా లాగింగ్ ఆర్కిటెక్చర్లు][eks-fb-example]

### మెట్రిక్స్

- [AMP కు మెట్రిక్స్ ఇన్‌జెస్ట్ చేసి AMG లో విజువలైజ్ చేయడానికి Fargate పై EKS లో ADOT ఉపయోగించడం][fargate-eks-metrics-go-adot-ampamg]
- [CloudWatch Container Insights][eks-ws-cw-ci]
- [AMP వర్క్‌స్పేస్‌ల కోసం క్రాస్-రీజియన్ మెట్రిక్స్ కలెక్షన్ సెటప్][amp-xregion]

### ట్రేసెస్

- [AWS X-Ray తో Fargate పై EKS లో ADOT ఉపయోగించడం][fargate-eks-xray-go-adot-amg]
- [X-Ray తో ట్రేసింగ్][eks-ws-xray]


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
[eks-keda-cloudwatch-scaling]: https://aws.amazon.com/blogs/mt/proactive-autoscaling-of-kubernetes-workloads-with-keda-using-metrics-ingested-into-amazon-cloudwatch/
[eks-anywhere-monitoring]: https://aws.amazon.com/blogs/containers/monitoring-amazon-eks-anywhere-using-amazon-managed-service-for-prometheus-and-amazon-managed-grafana/
