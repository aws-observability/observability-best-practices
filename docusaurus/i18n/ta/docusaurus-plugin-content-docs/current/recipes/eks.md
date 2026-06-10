# Amazon Elastic Kubernetes Service

[Amazon Elastic Kubernetes Service][eks-main] (EKS) AWS Cloud அல்லது ஆன்-பிரமிஸில் Kubernetes பயன்பாடுகளைத் தொடங்க, இயக்க மற்றும் அளவிட உங்களுக்கு நெகிழ்வுத்தன்மையை வழங்குகிறது.

கம்ப்யூட் எஞ்சின் வாரியாக தொகுக்கப்பட்ட பின்வரும் செய்முறைகளைப் பாருங்கள்:

## EC2-இல் EKS

### லாக்குகள்

- [EKS-க்கான CloudWatch Container Insights-இல் Fluent Bit ஒருங்கிணைப்பு][eks-cw-fb]
- [EFK Stack மூலம் லாக்கிங்][eks-ws-efk]
- [EKS-இல் Fluent Bit மற்றும் FluentD-க்கான மாதிரி லாக்கிங் கட்டமைப்புகள்][eks-logging]

### மெட்ரிக்குகள்

- [Amazon Managed Service for Prometheus-உடன் தொடங்குதல்][amp-gettingstarted]
- [EC2-இல் EKS-இல் ADOT பயன்படுத்தி AMP-க்கு மெட்ரிக்குகளை உள்ளிட்டு AMG-இல் காட்சிப்படுத்துதல்][ec2-eks-metrics-go-adot-ampamg]
- [Amazon Managed Service for Prometheus-க்கான Grafana Cloud Agent கட்டமைத்தல்][gcwa-amp]
- [Prometheus மற்றும் Grafana பயன்படுத்தி கிளஸ்டர் கண்காணிப்பு][eks-ws-prom-grafana]
- [Managed Prometheus மற்றும் Managed Grafana மூலம் கண்காணிப்பு][eks-ws-amp-amg]
- [CloudWatch Container Insights][eks-ws-cw-ci]
- [AMP பணியிடங்களுக்கான குறுக்கு-பிராந்திய மெட்ரிக்குகள் சேகரிப்பை அமைத்தல்][amp-xregion]
- [Amazon Managed Service for Prometheus பயன்படுத்தி EKS-இல் App Mesh சூழலை கண்காணித்தல்][eks-am-amp-amg]
- [Amazon Managed Prometheus மற்றும் Amazon Managed Grafana பயன்படுத்தி EKS-இல் Istio-ஐ கண்காணித்தல்][eks-istio-monitoring]
- [KEDA மற்றும் Amazon CloudWatch மூலம் Kubernetes பணிச்சுமைகளின் முன்கூட்டிய தானியங்கி அளவிடுதல்][eks-keda-cloudwatch-scaling]
- [Amazon Managed Service for Prometheus மற்றும் Amazon Managed Grafana பயன்படுத்தி Amazon EKS Anywhere கண்காணித்தல்][eks-anywhere-monitoring]

### ட்ரேஸ்கள்

- [X-Ray ட்ரேசிங்-ஐ AWS Distro for OpenTelemetry-க்கு இடம்பெயர்த்தல்][eks-otel-xray]
- [X-Ray மூலம் ட்ரேசிங்][eks-ws-xray]

## Fargate-இல் EKS

### லாக்குகள்

- [AWS Fargate-இல் Amazon EKS-க்கான Fluent Bit இங்கே உள்ளது][eks-fargate-logging]
- [EKS-இல் Fluent Bit மற்றும் FluentD-க்கான மாதிரி லாக்கிங் கட்டமைப்புகள்][eks-fb-example]

### மெட்ரிக்குகள்

- [Fargate-இல் EKS-இல் ADOT பயன்படுத்தி AMP-க்கு மெட்ரிக்குகளை உள்ளிட்டு AMG-இல் காட்சிப்படுத்துதல்][fargate-eks-metrics-go-adot-ampamg]
- [CloudWatch Container Insights][eks-ws-cw-ci]
- [AMP பணியிடங்களுக்கான குறுக்கு-பிராந்திய மெட்ரிக்குகள் சேகரிப்பை அமைத்தல்][amp-xregion]

### ட்ரேஸ்கள்

- [Fargate-இல் EKS-இல் AWS X-Ray-உடன் ADOT பயன்படுத்துதல்][fargate-eks-xray-go-adot-amg]
- [X-Ray மூலம் ட்ரேசிங்][eks-ws-xray]


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
