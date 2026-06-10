# Amazon Managed Service for Prometheus

[Amazon Managed Service for Prometheus][amp-main] (AMP) என்பது Prometheus-இணக்கமான கண்காணிப்பு சேவையாகும், இது கண்டெய்னர்மயமான பயன்பாடுகளை அளவில் கண்காணிப்பதை எளிதாக்குகிறது. AMP மூலம், செயல்பாட்டு மெட்ரிக்குகளின் உள்ளிடுதல், சேமிப்பு மற்றும் வினவலை நிர்வகிக்கத் தேவையான அடிப்படை உள்கட்டமைப்பை நிர்வகிக்காமல் கண்டெய்னர்மயமான பணிச்சுமைகளின் செயல்திறனை கண்காணிக்க Prometheus வினவல் மொழியை (PromQL) பயன்படுத்தலாம்.

பின்வரும் செய்முறைகளைப் பாருங்கள்:

- [AMP-உடன் தொடங்குதல்][amp-gettingstarted]
- [EC2-இல் EKS-இல் ADOT பயன்படுத்தி AMP-க்கு உள்ளிட்டு AMG-இல் காட்சிப்படுத்துதல்](recipes/ec2-eks-metrics-go-adot-ampamg.md)
- [AMP-க்கு குறுக்கு-கணக்கு உள்ளிடுதலை அமைத்தல்][amp-xaccount]
- [AMP பயன்படுத்தி ECS-இலிருந்து மெட்ரிக்குகள் சேகரிப்பு][amp-ecs-metrics]
- [AMP-க்கான Grafana Cloud Agent கட்டமைத்தல்][amp-gcwa]
- [AMP பணியிடங்களுக்கான குறுக்கு-பிராந்திய மெட்ரிக்குகள் சேகரிப்பை அமைத்தல்][amp-xregion-metrics]
- [EKS-இல் சுய-ஹோஸ்ட் செய்யப்பட்ட Prometheus-ஐ AMP-க்கு இடம்பெயர்ப்பதற்கான சிறந்த நடைமுறைகள்][amp-migration]
- [AMP-உடன் தொடங்குவதற்கான பயிலரங்கு][amp-oow]
- [Firehose மற்றும் AWS Lambda வழியாக Cloudwatch Metric Streams-ஐ Amazon Managed Service for Prometheus-க்கு ஏற்றுமதி செய்தல்](recipes/lambda-cw-metrics-go-amp.md)
- [Amazon Managed Service for Prometheus-ஐ டிப்ளாய் செய்து Alert manager-ஐ கட்டமைக்க Infrastructure as Code ஆக Terraform](recipes/amp-alertmanager-terraform.md)
- [Amazon Managed Prometheus மற்றும் Amazon Managed Grafana பயன்படுத்தி EKS-இல் Istio-ஐ கண்காணித்தல்][amp-istio-monitoring]
- [Amazon Managed Service for Prometheus மற்றும் Amazon Managed Grafana பயன்படுத்தி Amazon EKS Anywhere கண்காணித்தல்][amp-anywhere-monitoring]
- [Amazon EKS Observability Accelerator அறிமுகம்][eks-accelerator]
- [AMP மற்றும் Amazon Managed Grafana மூலம் Prometheus mixin டாஷ்போர்டுகளை நிறுவுதல்](recipes/amp-mixin-dashboards.md)
[amp-main]: https://aws.amazon.com/prometheus/
[amp-gettingstarted]: https://aws.amazon.com/blogs/mt/getting-started-amazon-managed-service-for-prometheus/
[amp-xaccount]: https://aws.amazon.com/blogs/opensource/setting-up-cross-account-ingestion-into-amazon-managed-service-for-prometheus/
[amp-ecs-metrics]: https://aws.amazon.com/blogs/opensource/metrics-collection-from-amazon-ecs-using-amazon-managed-service-for-prometheus/
[amp-gcwa]: https://aws.amazon.com/blogs/opensource/configuring-grafana-cloud-agent-for-amazon-managed-service-for-prometheus/
[amp-xregion-metrics]: https://aws.amazon.com/blogs/opensource/set-up-cross-region-metrics-collection-for-amazon-managed-service-for-prometheus-workspaces/
[amp-migration]: https://aws.amazon.com/blogs/opensource/best-practices-for-migrating-self-hosted-prometheus-on-amazon-eks-to-amazon-managed-service-for-prometheus/
[amp-oow]: https://observability.workshop.aws/en/amp.html
[amp-istio-monitoring]: https://aws.amazon.com/blogs/mt/monitor-istio-on-eks-using-amazon-managed-prometheus-and-amazon-managed-grafana/
[amp-anywhere-monitoring]: https://aws.amazon.com/blogs/containers/monitoring-amazon-eks-anywhere-using-amazon-managed-service-for-prometheus-and-amazon-managed-grafana/
[eks-accelerator]: recipes/eks-observability-accelerator.md
- [Amazon Managed Service for Prometheus மற்றும் alert manager பயன்படுத்தி Amazon EC2 தானியங்கி-அளவிடுதல்](recipes/as-ec2-using-amp-and-alertmanager.md)
