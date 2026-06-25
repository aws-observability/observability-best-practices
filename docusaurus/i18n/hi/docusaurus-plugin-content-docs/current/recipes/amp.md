# Amazon Managed Service for Prometheus

[Amazon Managed Service for Prometheus][amp-main] (AMP) एक Prometheus-संगत
मॉनिटरिंग सेवा है जो स्केल पर कंटेनराइज्ड एप्लिकेशन की मॉनिटरिंग करना आसान बनाती है।
AMP के साथ, आप ऑपरेशनल मेट्रिक्स के इंजेशन, स्टोरेज और क्वेरीइंग के लिए
आवश्यक अंतर्निहित इंफ्रास्ट्रक्चर को प्रबंधित किए बिना कंटेनराइज्ड वर्कलोड के
प्रदर्शन की मॉनिटरिंग के लिए Prometheus query language (PromQL) का उपयोग कर सकते हैं।

निम्नलिखित रेसिपी देखें:

- [AMP के साथ शुरुआत करना][amp-gettingstarted]
- [AMP में इंजेस्ट करने और AMG में विज़ुअलाइज़ करने के लिए EC2 पर EKS में ADOT का उपयोग](recipes/ec2-eks-metrics-go-adot-ampamg.md)
- [AMP में cross-account ingestion सेट अप करना][amp-xaccount]
- [AMP का उपयोग करके ECS से मेट्रिक्स संग्रह][amp-ecs-metrics]
- [AMP के लिए Grafana Cloud Agent कॉन्फ़िगर करना][amp-gcwa]
- [AMP workspaces के लिए cross-region metrics collection सेट अप करें][amp-xregion-metrics]
- [EKS पर self-hosted Prometheus को AMP में माइग्रेट करने की बेस्ट प्रैक्टिसेज़][amp-migration]
- [AMP के साथ शुरुआत करने के लिए Workshop][amp-oow]
- [Firehose और AWS Lambda के माध्यम से Cloudwatch Metric Streams को Amazon Managed Service for Prometheus में एक्सपोर्ट करना](recipes/lambda-cw-metrics-go-amp.md)
- [Amazon Managed Service for Prometheus को डिप्लॉय करने और Alert manager कॉन्फ़िगर करने के लिए Infrastructure as a Code के रूप में Terraform](recipes/amp-alertmanager-terraform.md)
- [Amazon Managed Prometheus और Amazon Managed Grafana का उपयोग करके EKS पर Istio की मॉनिटरिंग][amp-istio-monitoring]
- [Amazon Managed Service for Prometheus और Amazon Managed Grafana का उपयोग करके Amazon EKS Anywhere की मॉनिटरिंग][amp-anywhere-monitoring]
- [Amazon EKS ऑब्ज़र्वेबिलिटी Accelerator का परिचय][eks-accelerator]
- [AMP और Amazon Managed Grafana के साथ Prometheus mixin dashboards इंस्टॉल करना](recipes/amp-mixin-dashboards.md)
[amp-main]: https://aws.amazon.com/prometheus/
[amp-gettingstarted]: https://aws.amazon.com/blogs/mt/getting-started-amazon-managed-service-for-prometheus/
[amp-xaccount]: https://aws.amazon.com/blogs/opensource/setting-up-cross-account-ingestion-into-amazon-managed-service-for-prometheus/
[amp-ecs-metrics]: https://aws.amazon.com/blogs/opensource/metrics-collection-from-amazon-ecs-using-amazon-managed-service-for-prometheus/
[amp-gcwa]: https://aws.amazon.com/blogs/opensource/configuring-grafana-cloud-agent-for-amazon-managed-service-for-prometheus/
[amp-xregion-metrics]: https://aws.amazon.com/blogs/opensource/set-up-cross-region-metrics-collection-for-amazon-managed-service-for-prometheus-workspaces/
[amp-migration]: https://aws.amazon.com/blogs/opensource/best-practices-for-migrating-self-hosted-prometheus-on-amazon-eks-to-amazon-managed-service-for-prometheus/
[amp-oow]: https://ऑब्ज़र्वेबिलिटी.workshop.aws/en/amp.html
[amp-istio-monitoring]: https://aws.amazon.com/blogs/mt/monitor-istio-on-eks-using-amazon-managed-prometheus-and-amazon-managed-grafana/
[amp-anywhere-monitoring]: https://aws.amazon.com/blogs/containers/monitoring-amazon-eks-anywhere-using-amazon-managed-service-for-prometheus-and-amazon-managed-grafana/
[eks-accelerator]: recipes/eks-ऑब्ज़र्वेबिलिटी-accelerator.md
- [Amazon Managed Service for Prometheus और alert manager का उपयोग करके Amazon EC2 को Auto-scaling करना](recipes/as-ec2-using-amp-and-alertmanager.md)
