# Amazon Elastic Container Service

[Amazon Elastic Container Service][ecs-main] (ECS) என்பது containerized applications-ஐ எளிதாக deploy செய்யவும், நிர்வகிக்கவும், scale செய்யவும் உதவும் முழுமையாக managed container orchestration சேவை ஆகும், மற்ற AWS-உடன் ஆழமாக ஒருங்கிணைக்கிறது.

compute engine-ன் அடிப்படையில் grouped செய்யப்பட்ட பின்வரும் recipes-ஐ பாருங்கள்:

## பொதுவானவை

- [ECS-உடன் AWS Distro for OpenTelemetry Collector-க்கான Deployment patterns][adot-patterns-ecs]
- [AWS Distro for OpenTelemetry-உடன் Amazon ECS monitoring setup-ஐ எளிமைப்படுத்துதல்][ecs-adot-integration]

## EC2-ல் ECS

### லாக்குகள்

- [Amazon ECS Tasks-க்கான FireLens - உள்ளே என்ன நடக்கிறது][firelens-uth]

### மெட்ரிக்குகள்

- [Amazon ECS-ல் cross-account metrics collection-க்கு AWS Distro for OpenTelemetry collector பயன்படுத்துதல்][adot-xaccount-metrics]
- [Amazon Managed Service for Prometheus பயன்படுத்தி ECS-லிருந்து Metrics collection][ecs-amp]
- [AWS App Mesh-லிருந்து Envoy metrics-ஐ Amazon CloudWatch-க்கு அனுப்புதல்][ecs-appmesh-cw]

## Fargate-ல் ECS

### லாக்குகள்

- [Amazon ECS மற்றும் AWS Fargate-ல் Fluent Bit பயன்படுத்தி FireLens-க்கான Sample logging architectures][firelens-fb]


[ecs-main]: https://aws.amazon.com/ecs/
[adot-patterns-ecs]: https://aws.amazon.com/blogs/opensource/deployment-patterns-for-the-aws-distro-for-opentelemetry-collector-with-amazon-elastic-container-service/
[firelens-uth]: https://aws.amazon.com/blogs/containers/under-the-hood-firelens-for-amazon-ecs-tasks/
[adot-xaccount-metrics]: https://aws.amazon.com/blogs/opensource/using-aws-distro-for-opentelemetry-collector-for-cross-account-metrics-collection-on-amazon-ecs/
[ecs-amp]: https://aws.amazon.com/blogs/opensource/metrics-collection-from-amazon-ecs-using-amazon-managed-service-for-prometheus/
[firelens-fb]: https://github.com/aws-samples/amazon-ecs-firelens-examples#fluent-bit-examples
[ecs-adot-integration]: https://aws.amazon.com/blogs/opensource/simplifying-amazon-ecs-monitoring-set-up-with-aws-distro-for-opentelemetry/
[ecs-appmesh-cw]: https://aws.amazon.com/blogs/containers/sending-envoy-metrics-from-aws-app-mesh-to-amazon-cloudwatch/
