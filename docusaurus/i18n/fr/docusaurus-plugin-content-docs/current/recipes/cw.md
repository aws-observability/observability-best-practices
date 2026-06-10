# Amazon CloudWatch

[Amazon CloudWatch][cw-main] (CW) est un service de surveillance et d'Observability concu
pour les ingenieurs DevOps, les developpeurs, les ingenieurs de fiabilite de site (SRE) et les responsables informatiques.
CloudWatch collecte des donnees de surveillance et operationnelles sous forme de logs, metriques
et evenements, vous offrant une vue unifiee des ressources AWS, des applications
et des services qui s'executent sur AWS et sur les serveurs sur site.

Consultez les recettes suivantes :

- [Mettre en place une surveillance proactive de base de donnees pour RDS avec CW Logs, Lambda et SNS][rds-cw]
- [Implementer une Observability centree sur CloudWatch pour les developpeurs natifs Kubernetes dans EKS][swa-eks-cw]
- [Creer des Canaries via CW Synthetics][cw-synths]
- [CloudWatch Logs Insights pour interroger les logs][cw-logsi]
- [Lambda Insights][cw-lambda]
- [Detection d'anomalies via CloudWatch][cw-am]
- [Alarmes de metriques via CloudWatch][cw-alarms]
- [Choisir les options de journalisation des conteneurs pour eviter la contre-pression][cw-fluentbit]
- [Presentation du support Prometheus de CloudWatch Container Insights avec AWS Distro for OpenTelemetry sur ECS et EKS][cwci-adot]
- [Surveillance des applications conteneurisees ECS et des microservices avec CW Container Insights][cwci-ecs]
- [Surveillance des applications conteneurisees EKS et des microservices avec CW Container Insights][cwci-eks]
- [Exportation des flux de metriques CloudWatch via Firehose et AWS Lambda vers Amazon Managed Service for Prometheus](recipes/lambda-cw-metrics-go-amp.md)
- [Mise a l'echelle proactive des charges de travail Kubernetes avec KEDA et Amazon CloudWatch][cw-keda-eks-scaling]
- [Utilisation d'Amazon CloudWatch Metrics Explorer pour agreger et visualiser les metriques filtrees par tags de ressources][metrics-explorer-filter-by-tags]


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
