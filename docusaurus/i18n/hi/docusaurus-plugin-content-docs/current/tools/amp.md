# Amazon Managed Service for Prometheus

[Prometheus](https://prometheus.io/) एक लोकप्रिय ओपन सोर्स monitoring टूल है जो कंप्यूट नोड्स और एप्लिकेशन से संबंधित प्रदर्शन डेटा जैसे संसाधनों के बारे में व्यापक metrics क्षमताएँ और अंतर्दृष्टि प्रदान करता है।

Prometheus डेटा एकत्र करने के लिए *pull* मॉडल का उपयोग करता है, जबकि CloudWatch *push* मॉडल का उपयोग करता है। Prometheus और CloudWatch कुछ ओवरलैपिंग उपयोग मामलों के लिए उपयोग किए जाते हैं, हालाँकि उनके ऑपरेटिंग मॉडल बहुत भिन्न हैं और उनकी कीमतें अलग-अलग तरीके से निर्धारित होती हैं।

[Amazon Managed Service for Prometheus](https://aws.amazon.com/prometheus/) Kubernetes और [Amazon ECS](https://aws.amazon.com/ecs/) में होस्ट किए गए कंटेनराइज़्ड एप्लिकेशन में व्यापक रूप से उपयोग किया जाता है।

आप [CloudWatch agent](./cloudwatch_agent.md) या [AWS Distro for OpenTelemetry](https://aws-otel.github.io/) का उपयोग करके अपने EC2 इंस्टेंस या ECS/EKS क्लस्टर पर Prometheus metric क्षमताएँ जोड़ सकते हैं। Prometheus सपोर्ट वाला CloudWatch agent एप्लिकेशन प्रदर्शन गिरावट और विफलताओं पर तेज़ी से monitor, troubleshoot और alarm करने के लिए Prometheus metrics की खोज और संग्रह करता है। यह observability में सुधार के लिए आवश्यक monitoring टूल्स की संख्या भी कम करता है।

Prometheus के लिए CloudWatch Container Insights monitoring कंटेनराइज़्ड सिस्टम और वर्कलोड से Prometheus metrics की स्वचालित खोज को सक्षम करता है https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ ContainerInsights-Prometheus.html
