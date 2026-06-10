# Amazon Managed Service for Prometheus

[Amazon Managed Service for Prometheus][amp-main] (AMP) est un service de surveillance compatible avec Prometheus qui facilite la surveillance des applications conteneurisées à grande échelle. Avec AMP, vous pouvez utiliser le langage de requête Prometheus (PromQL) pour surveiller les performances des charges de travail conteneurisées sans avoir à gérer l'infrastructure sous-jacente nécessaire à l'ingestion, au stockage et à l'interrogation des métriques opérationnelles.

Consultez les recettes suivantes :

- [Démarrer avec AMP][amp-gettingstarted]
- [Utilisation d'ADOT dans EKS sur EC2 pour ingérer dans AMP et visualiser dans AMG](recipes/ec2-eks-metrics-go-adot-ampamg.md)
- [Configuration de l'ingestion inter-comptes dans AMP][amp-xaccount]
- [Collecte de métriques depuis ECS avec AMP][amp-ecs-metrics]
- [Configuration de Grafana Cloud Agent pour AMP][amp-gcwa]
- [Configuration de la collecte de métriques inter-régions pour les espaces de travail AMP][amp-xregion-metrics]
- [Bonnes pratiques pour la migration de Prometheus auto-hébergé sur EKS vers AMP][amp-migration]
- [Atelier de démarrage avec AMP][amp-oow]
- [Exportation de CloudWatch Metric Streams via Firehose et AWS Lambda vers Amazon Managed Service for Prometheus](recipes/lambda-cw-metrics-go-amp.md)
- [Terraform comme Infrastructure as Code pour déployer Amazon Managed Service for Prometheus et configurer Alert manager](recipes/amp-alertmanager-terraform.md)
- [Surveiller Istio sur EKS avec Amazon Managed Prometheus et Amazon Managed Grafana][amp-istio-monitoring]
- [Surveillance d'Amazon EKS Anywhere avec Amazon Managed Service for Prometheus et Amazon Managed Grafana][amp-anywhere-monitoring]
- [Présentation d'Amazon EKS Observability Accelerator][eks-accelerator]
- [Installation des tableaux de bord Prometheus mixin avec AMP et Amazon Managed Grafana](recipes/amp-mixin-dashboards.md)
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
- [Auto-scaling Amazon EC2 avec Amazon Managed Service for Prometheus et alert manager](recipes/as-ec2-using-amp-and-alertmanager.md)
