# Amazon Elastic Container Service

[Amazon Elastic Container Service][ecs-main] (ECS) అనేది పూర్తిగా నిర్వహించబడే కంటైనర్
ఆర్కెస్ట్రేషన్ సేవ, ఇది కంటైనరైజ్డ్ అప్లికేషన్‌లను సులభంగా డిప్లాయ్ చేయడం, నిర్వహించడం, మరియు స్కేల్ చేయడంలో మీకు సహాయపడుతుంది, మిగిలిన AWS తో లోతుగా ఇంటిగ్రేట్ చేస్తుంది.

కింది రెసిపీలను కంప్యూట్ ఇంజిన్ ప్రకారం సమూహం చేసి చూడండి:

## సాధారణం

- [ECS తో AWS Distro for OpenTelemetry Collector కోసం డిప్లాయ్‌మెంట్ ప్యాటర్న్‌లు][adot-patterns-ecs]
- [AWS Distro for OpenTelemetry తో Amazon ECS మానిటరింగ్ సెటప్ సరళీకరణ][ecs-adot-integration]

## EC2 పై ECS

### లాగ్‌లు

- [Amazon ECS Tasks కోసం FireLens లోపలి వైపు][firelens-uth]

### మెట్రిక్స్

- [Amazon ECS పై cross-account మెట్రిక్స్ సేకరణ కోసం AWS Distro for OpenTelemetry collector ఉపయోగించడం][adot-xaccount-metrics]
- [Amazon Managed Service for Prometheus ఉపయోగించి ECS నుండి మెట్రిక్స్ సేకరణ][ecs-amp]
- [AWS App Mesh నుండి Amazon CloudWatch కు Envoy మెట్రిక్స్ పంపడం][ecs-appmesh-cw]

## Fargate పై ECS

### లాగ్‌లు

- [Fluent Bit ఉపయోగించి Amazon ECS మరియు AWS Fargate పై FireLens కోసం నమూనా లాగింగ్ ఆర్కిటెక్చర్‌లు][firelens-fb]


[ecs-main]: https://aws.amazon.com/ecs/
[adot-patterns-ecs]: https://aws.amazon.com/blogs/opensource/deployment-patterns-for-the-aws-distro-for-opentelemetry-collector-with-amazon-elastic-container-service/
[firelens-uth]: https://aws.amazon.com/blogs/containers/under-the-hood-firelens-for-amazon-ecs-tasks/
[adot-xaccount-metrics]: https://aws.amazon.com/blogs/opensource/using-aws-distro-for-opentelemetry-collector-for-cross-account-metrics-collection-on-amazon-ecs/
[ecs-amp]: https://aws.amazon.com/blogs/opensource/metrics-collection-from-amazon-ecs-using-amazon-managed-service-for-prometheus/
[firelens-fb]: https://github.com/aws-samples/amazon-ecs-firelens-examples#fluent-bit-examples
[ecs-adot-integration]: https://aws.amazon.com/blogs/opensource/simplifying-amazon-ecs-monitoring-set-up-with-aws-distro-for-opentelemetry/
[ecs-appmesh-cw]: https://aws.amazon.com/blogs/containers/sending-envoy-metrics-from-aws-app-mesh-to-amazon-cloudwatch/
