# Amazon CloudWatch

[Amazon CloudWatch][cw-main] (CW) DevOps इंजीनियरों, डेवलपर्स, साइट रिलायबिलिटी इंजीनियरों (SRE) और IT मैनेजरों के लिए बनाई गई एक मॉनिटरिंग और Observability सेवा है।
CloudWatch लॉग्स, मेट्रिक्स और इवेंट्स के रूप में मॉनिटरिंग और ऑपरेशनल डेटा एकत्र करता है, जो आपको AWS रिसोर्सेज, एप्लिकेशन और AWS तथा ऑन-प्रेमाइसेस सर्वर पर चलने वाली सेवाओं का एकीकृत दृश्य प्रदान करता है।

निम्नलिखित रेसिपी देखें:

- [RDS के लिए CW Logs, Lambda और SNS के साथ प्रोएक्टिव डेटाबेस मॉनिटरिंग बनाएं][rds-cw]
- [EKS में Kubernetes-नेटिव डेवलपर्स के लिए CloudWatch-केंद्रित Observability लागू करना][swa-eks-cw]
- [CW Synthetics के माध्यम से Canaries बनाएं][cw-synths]
- [लॉग्स क्वेरी करने के लिए CloudWatch Logs Insights][cw-logsi]
- [Lambda Insights][cw-lambda]
- [CloudWatch के माध्यम से Anomaly Detection][cw-am]
- [CloudWatch के माध्यम से Metrics Alarms][cw-alarms]
- [बैकप्रेशर से बचने के लिए कंटेनर लॉगिंग विकल्प चुनना][cw-fluentbit]
- [ECS और EKS पर AWS Distro for OpenTelemetry के साथ CloudWatch Container Insights Prometheus सपोर्ट का परिचय][cwci-adot]
- [CW Container Insights का उपयोग करके ECS कंटेनराइज्ड एप्लिकेशन और माइक्रोसर्विसेज की मॉनिटरिंग][cwci-ecs]
- [CW Container Insights का उपयोग करके EKS कंटेनराइज्ड एप्लिकेशन और माइक्रोसर्विसेज की मॉनिटरिंग][cwci-eks]
- [Firehose और AWS Lambda के माध्यम से CloudWatch Metric Streams को Amazon Managed Service for Prometheus में एक्सपोर्ट करना](recipes/lambda-cw-metrics-go-amp.md)
- [KEDA और Amazon CloudWatch के साथ Kubernetes वर्कलोड की प्रोएक्टिव ऑटोस्केलिंग][cw-keda-eks-scaling]
- [रिसोर्स टैग्स द्वारा फ़िल्टर किए गए मेट्रिक्स को एकत्रित और विज़ुअलाइज़ करने के लिए Amazon CloudWatch Metrics Explorer का उपयोग][metrics-explorer-filter-by-tags]


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
