# Amazon Managed Service for Prometheus

[Prometheus](https://prometheus.io/) est un outil de surveillance open source populaire qui fournit de vastes capacités métriques et des informations sur les ressources telles que les noeuds de calcul et les données de performance des applications.

Prometheus utilise un modèle *pull* pour collecter les données, tandis que CloudWatch utilise un modèle *push*. Prometheus et CloudWatch sont utilisés pour certains cas d'usage communs, bien que leurs modèles opérationnels soient très différents et qu'ils soient tarifés différemment.

[Amazon Managed Service for Prometheus](https://aws.amazon.com/prometheus/) est largement utilisé dans les applications conteneurisées hébergées dans Kubernetes et [Amazon ECS](https://aws.amazon.com/ecs/).

Vous pouvez ajouter des capacités de métriques Prometheus sur votre instance EC2 ou votre cluster ECS/EKS en utilisant l'[agent CloudWatch](./cloudwatch_agent.md) ou [AWS Distro for OpenTelemetry](https://aws-otel.github.io/). L'agent CloudWatch avec le support Prometheus découvre et collecte les métriques Prometheus pour surveiller, dépanner et alerter plus rapidement sur la dégradation des performances et les défaillances des applications. Cela réduit également le nombre d'outils de surveillance nécessaires pour améliorer l'observabilité.

CloudWatch Container Insights monitoring pour Prometheus automatise la découverte des métriques Prometheus à partir des systèmes et charges de travail conteneurisés https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ ContainerInsights-Prometheus.html
