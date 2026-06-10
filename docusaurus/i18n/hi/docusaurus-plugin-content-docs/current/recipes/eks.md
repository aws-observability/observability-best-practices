# Amazon Elastic Kubernetes Service

[Amazon Elastic Kubernetes Service][eks-main] (EKS) आपको AWS क्लाउड या ऑन-प्रेमाइसेस में
Kubernetes एप्लिकेशन शुरू करने, चलाने और स्केल करने की सुविधा प्रदान करता है।

निम्नलिखित रेसिपी देखें, कंप्यूट इंजन के अनुसार समूहित:

## EC2 पर EKS

### लॉग्स

- [EKS के लिए CloudWatch Container Insights में Fluent Bit एकीकरण][eks-cw-fb]
- [EFK Stack के साथ लॉगिंग][eks-ws-efk]
- [EKS पर Fluent Bit और FluentD के लिए सैंपल लॉगिंग आर्किटेक्चर][eks-logging]

### मेट्रिक्स

- [Amazon Managed Service for Prometheus के साथ शुरुआत करना][amp-gettingstarted]
- [AMP में मेट्रिक्स इंजेस्ट करने और AMG में विज़ुअलाइज़ करने के लिए EC2 पर EKS में ADOT का उपयोग][ec2-eks-metrics-go-adot-ampamg]
- [Amazon Managed Service for Prometheus के लिए Grafana Cloud Agent कॉन्फ़िगर करना][gcwa-amp]
- [Prometheus और Grafana का उपयोग करके क्लस्टर मॉनिटरिंग][eks-ws-prom-grafana]
- [Managed Prometheus और Managed Grafana के साथ मॉनिटरिंग][eks-ws-amp-amg]
- [CloudWatch Container Insights][eks-ws-cw-ci]
- [AMP वर्कस्पेसेस के लिए क्रॉस-रीजन मेट्रिक्स संग्रह सेट अप करना][amp-xregion]
- [Amazon Managed Service for Prometheus का उपयोग करके EKS पर App Mesh एनवायरनमेंट की मॉनिटरिंग][eks-am-amp-amg]
- [Amazon Managed Prometheus और Amazon Managed Grafana का उपयोग करके EKS पर Istio की मॉनिटरिंग][eks-istio-monitoring]
- [KEDA और Amazon CloudWatch के साथ Kubernetes वर्कलोड की प्रोएक्टिव ऑटोस्केलिंग][eks-keda-cloudwatch-scaling]
- [Amazon Managed Service for Prometheus और Amazon Managed Grafana का उपयोग करके Amazon EKS Anywhere की मॉनिटरिंग][eks-anywhere-monitoring]

### ट्रेसेस

- [AWS Distro for OpenTelemetry में X-Ray ट्रेसिंग का माइग्रेशन][eks-otel-xray]
- [X-Ray के साथ ट्रेसिंग][eks-ws-xray]

## Fargate पर EKS

### लॉग्स

- [AWS Fargate पर Amazon EKS के लिए Fluent Bit अब उपलब्ध है][eks-fargate-logging]
- [EKS पर Fluent Bit और FluentD के लिए सैंपल लॉगिंग आर्किटेक्चर][eks-fb-example]

### मेट्रिक्स

- [AMP में मेट्रिक्स इंजेस्ट करने और AMG में विज़ुअलाइज़ करने के लिए Fargate पर EKS में ADOT का उपयोग][fargate-eks-metrics-go-adot-ampamg]
- [CloudWatch Container Insights][eks-ws-cw-ci]
- [AMP वर्कस्पेसेस के लिए क्रॉस-रीजन मेट्रिक्स संग्रह सेट अप करना][amp-xregion]

### ट्रेसेस

- [AWS X-Ray के साथ Fargate पर EKS में ADOT का उपयोग][fargate-eks-xray-go-adot-amg]
- [X-Ray के साथ ट्रेसिंग][eks-ws-xray]


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
