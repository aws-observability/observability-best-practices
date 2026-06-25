# Amazon Managed Service for Prometheus

[Amazon Managed Service for Prometheus][amp-main] (AMP) అనేది Prometheus-అనుకూల మానిటరింగ్ సర్వీస్, ఇది కంటైనరైజ్డ్ అప్లికేషన్‌లను స్కేల్ వద్ద మానిటర్ చేయడం సులభం చేస్తుంది. AMP తో, మీరు ఆపరేషనల్ మెట్రిక్స్ యొక్క ఇన్‌జెషన్, స్టోరేజ్ మరియు క్వెరీంగ్‌ను నిర్వహించడానికి అవసరమైన అంతర్లీన ఇన్‌ఫ్రాస్ట్రక్చర్‌ను నిర్వహించాల్సిన అవసరం లేకుండా కంటైనరైజ్డ్ వర్క్‌లోడ్ల పనితీరును మానిటర్ చేయడానికి Prometheus క్వెరీ భాష (PromQL) ను ఉపయోగించవచ్చు.

కింది రెసిపీలను చూడండి:

- [AMP తో ప్రారంభించడం][amp-gettingstarted]
- [AMP కు ఇన్‌జెస్ట్ చేసి AMG లో విజువలైజ్ చేయడానికి EC2 పై EKS లో ADOT ఉపయోగించడం](recipes/ec2-eks-metrics-go-adot-ampamg.md)
- [AMP లో క్రాస్-అకౌంట్ ఇన్‌జెషన్ సెటప్ చేయడం][amp-xaccount]
- [AMP ఉపయోగించి ECS నుండి మెట్రిక్స్ కలెక్షన్][amp-ecs-metrics]
- [AMP కోసం Grafana Cloud Agent కాన్ఫిగర్ చేయడం][amp-gcwa]
- [AMP వర్క్‌స్పేస్‌ల కోసం క్రాస్-రీజియన్ మెట్రిక్స్ కలెక్షన్ సెటప్][amp-xregion-metrics]
- [EKS పై సెల్ఫ్-హోస్టెడ్ Prometheus ను AMP కు మైగ్రేట్ చేయడానికి ఉత్తమ పద్ధతులు][amp-migration]
- [AMP తో ప్రారంభించడానికి వర్క్‌షాప్][amp-oow]
- [Firehose మరియు AWS Lambda ద్వారా Cloudwatch Metric Streams ను Amazon Managed Service for Prometheus కు ఎక్స్‌పోర్ట్ చేయడం](recipes/lambda-cw-metrics-go-amp.md)
- [Amazon Managed Service for Prometheus డిప్లాయ్ చేసి Alert manager కాన్ఫిగర్ చేయడానికి Infrastructure as Code గా Terraform](recipes/amp-alertmanager-terraform.md)
- [Amazon Managed Prometheus మరియు Amazon Managed Grafana ఉపయోగించి EKS పై Istio మానిటర్ చేయడం][amp-istio-monitoring]
- [Amazon Managed Service for Prometheus మరియు Amazon Managed Grafana ఉపయోగించి Amazon EKS Anywhere మానిటరింగ్][amp-anywhere-monitoring]
- [Amazon EKS Observability Accelerator పరిచయం][eks-accelerator]
- [AMP మరియు Amazon Managed Grafana తో Prometheus mixin డాష్‌బోర్డ్‌లను ఇన్‌స్టాల్ చేయడం](recipes/amp-mixin-dashboards.md)
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
- [Amazon Managed Service for Prometheus మరియు alert manager ఉపయోగించి Amazon EC2 ఆటో-స్కేలింగ్](recipes/as-ec2-using-amp-and-alertmanager.md)
