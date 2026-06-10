# Amazon Elastic Container Service

[Amazon Elastic Container Service][ecs-main] (ECS) एक पूर्णतः प्रबंधित कंटेनर
ऑर्केस्ट्रेशन सर्विस है जो कंटेनराइज्ड एप्लिकेशन को आसानी से डिप्लॉय, प्रबंधित और स्केल
करने में मदद करती है, AWS के बाकी हिस्सों के साथ गहराई से एकीकृत है।

निम्नलिखित रेसिपी देखें, कंप्यूट इंजन के अनुसार समूहित:

## सामान्य

- [ECS के साथ AWS Distro for OpenTelemetry Collector के लिए डिप्लॉयमेंट पैटर्न][adot-patterns-ecs]
- [AWS Distro for OpenTelemetry के साथ Amazon ECS मॉनिटरिंग सेटअप को सरल बनाना][ecs-adot-integration]

## EC2 पर ECS

### लॉग्स

- [Amazon ECS Tasks के लिए FireLens की गहराई में][firelens-uth]

### मेट्रिक्स

- [Amazon ECS पर क्रॉस-अकाउंट मेट्रिक्स संग्रह के लिए AWS Distro for OpenTelemetry collector का उपयोग][adot-xaccount-metrics]
- [Amazon Managed Service for Prometheus का उपयोग करके ECS से मेट्रिक्स संग्रह][ecs-amp]
- [AWS App Mesh से Amazon CloudWatch को Envoy मेट्रिक्स भेजना][ecs-appmesh-cw]

## Fargate पर ECS

### लॉग्स

- [Amazon ECS और AWS Fargate पर FireLens के लिए Fluent Bit का उपयोग करके सैंपल लॉगिंग आर्किटेक्चर][firelens-fb]


[ecs-main]: https://aws.amazon.com/ecs/
[adot-patterns-ecs]: https://aws.amazon.com/blogs/opensource/deployment-patterns-for-the-aws-distro-for-opentelemetry-collector-with-amazon-elastic-container-service/
[firelens-uth]: https://aws.amazon.com/blogs/containers/under-the-hood-firelens-for-amazon-ecs-tasks/
[adot-xaccount-metrics]: https://aws.amazon.com/blogs/opensource/using-aws-distro-for-opentelemetry-collector-for-cross-account-metrics-collection-on-amazon-ecs/
[ecs-amp]: https://aws.amazon.com/blogs/opensource/metrics-collection-from-amazon-ecs-using-amazon-managed-service-for-prometheus/
[firelens-fb]: https://github.com/aws-samples/amazon-ecs-firelens-examples#fluent-bit-examples
[ecs-adot-integration]: https://aws.amazon.com/blogs/opensource/simplifying-amazon-ecs-monitoring-set-up-with-aws-distro-for-opentelemetry/
[ecs-appmesh-cw]: https://aws.amazon.com/blogs/containers/sending-envoy-metrics-from-aws-app-mesh-to-amazon-cloudwatch/
