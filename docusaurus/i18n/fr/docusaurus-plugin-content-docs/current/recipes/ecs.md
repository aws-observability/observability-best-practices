# Amazon Elastic Container Service

[Amazon Elastic Container Service][ecs-main] (ECS) est un service d'orchestration de conteneurs
entierement gere qui vous aide a deployer, gerer et mettre a l'echelle facilement
des applications conteneurisees, avec une integration approfondie avec le reste d'AWS.

Consultez les recettes suivantes, regroupees par moteur de calcul :

## General

- [Patterns de deploiement pour le collecteur AWS Distro for OpenTelemetry avec ECS][adot-patterns-ecs]
- [Simplifier la configuration de la surveillance Amazon ECS avec AWS Distro for OpenTelemetry][ecs-adot-integration]

## ECS sur EC2

### Logs

- [Sous le capot : FireLens pour les taches Amazon ECS][firelens-uth]

### Metriques

- [Utilisation du collecteur AWS Distro for OpenTelemetry pour la collecte de metriques inter-comptes sur Amazon ECS][adot-xaccount-metrics]
- [Collecte de metriques depuis ECS avec Amazon Managed Service for Prometheus][ecs-amp]
- [Envoi des metriques Envoy depuis AWS App Mesh vers Amazon CloudWatch][ecs-appmesh-cw]

## ECS sur Fargate

### Logs

- [Exemples d'architectures de journalisation pour FireLens sur Amazon ECS et AWS Fargate avec Fluent Bit][firelens-fb]


[ecs-main]: https://aws.amazon.com/ecs/
[adot-patterns-ecs]: https://aws.amazon.com/blogs/opensource/deployment-patterns-for-the-aws-distro-for-opentelemetry-collector-with-amazon-elastic-container-service/
[firelens-uth]: https://aws.amazon.com/blogs/containers/under-the-hood-firelens-for-amazon-ecs-tasks/
[adot-xaccount-metrics]: https://aws.amazon.com/blogs/opensource/using-aws-distro-for-opentelemetry-collector-for-cross-account-metrics-collection-on-amazon-ecs/
[ecs-amp]: https://aws.amazon.com/blogs/opensource/metrics-collection-from-amazon-ecs-using-amazon-managed-service-for-prometheus/
[firelens-fb]: https://github.com/aws-samples/amazon-ecs-firelens-examples#fluent-bit-examples
[ecs-adot-integration]: https://aws.amazon.com/blogs/opensource/simplifying-amazon-ecs-monitoring-set-up-with-aws-distro-for-opentelemetry/
[ecs-appmesh-cw]: https://aws.amazon.com/blogs/containers/sending-envoy-metrics-from-aws-app-mesh-to-amazon-cloudwatch/
