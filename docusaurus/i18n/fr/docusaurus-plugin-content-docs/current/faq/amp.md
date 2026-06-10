# Amazon Managed Service for Prometheus - FAQ

## Quelles régions AWS sont actuellement prises en charge et est-il possible de collecter des métriques depuis d'autres régions ?

Consultez notre [documentation](https://docs.aws.amazon.com/prometheus/latest/userguide/what-is-Amazon-Managed-Service-Prometheus.html) pour la liste mise à jour des régions que nous prenons en charge. Veuillez nous indiquer quelles régions vous souhaitez afin que nous puissions mieux prioriser nos demandes de fonctionnalités produit (PFR) existantes. Vous pouvez toujours collecter des données depuis n'importe quelle région et les envoyer vers une région spécifique que nous prenons en charge. Voici un blog pour plus de détails : [Cross-region metrics collection for Amazon Managed Service for Prometheus](https://aws.amazon.com/blogs/opensource/set-up-cross-region-metrics-collection-for-amazon-managed-service-for-prometheus-workspaces/).

## Combien de temps faut-il pour voir la mesure et/ou la facturation dans Cost Explorer ou [CloudWatch en tant que frais de facturation AWS](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/gs_monitor_estimated_charges_with_cloudwatch.html) ?

Nous mesurons les blocs d'échantillons de métriques ingérés dès qu'ils sont téléchargés sur S3 toutes les 2 heures. Cela peut prendre jusqu'à 3 heures pour voir la mesure et les frais rapportés pour Amazon Managed Service for Prometheus.

## Le service Prometheus ne peut-il récupérer des métriques qu'à partir d'un cluster (EKS/ECS) ?

Nous nous excusons pour le manque de documentation pour les autres environnements de calcul. Vous pouvez utiliser le serveur Prometheus pour récupérer des [métriques Prometheus depuis EC2](https://aws.amazon.com/blogs/opensource/using-amazon-managed-service-for-prometheus-to-monitor-ec2-environments/) et tout autre environnement de calcul où vous pouvez installer un serveur Prometheus aujourd'hui, à condition de configurer le remote write et de mettre en place le [proxy AWS SigV4](https://github.com/awslabs/aws-sigv4-proxy). Le lien vers le [blog EC2](https://aws.amazon.com/blogs/opensource/using-amazon-managed-service-for-prometheus-to-monitor-ec2-environments/) contient une section "Running aws-sigv4-proxy" qui peut vous montrer comment l'exécuter. Nous devons ajouter plus de documentation pour aider nos clients à simplifier l'exécution d'AWS SigV4 sur d'autres environnements de calcul.

## Comment connecter Amazon Managed Service for Prometheus à Grafana ? Existe-t-il une documentation ?

Nous utilisons la [source de données Prometheus par défaut disponible dans Grafana](https://grafana.com/docs/grafana/latest/datasources/prometheus/) pour interroger Amazon Managed Service for Prometheus en utilisant PromQL. Voici quelques documentations et un blog qui vous aideront à démarrer :
1. [Documentation du service](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-onboard-query.html)
1. [Configuration de Grafana sur EC2](https://aws.amazon.com/blogs/opensource/setting-up-grafana-on-ec2-to-query-metrics-from-amazon-managed-service-for-prometheus/)

## Quelles sont les meilleures pratiques pour réduire le nombre d'échantillons envoyés à Amazon Managed Service for Prometheus ?

Pour réduire le nombre d'échantillons ingérés dans Amazon Managed Service for Prometheus, les clients peuvent allonger leur intervalle de scraping (par exemple, passer de 30s à 1min) ou diminuer le nombre de séries qu'ils récupèrent. Modifier l'intervalle de scraping aura un impact plus important sur le nombre d'échantillons que la diminution du nombre de séries, puisque doubler l'intervalle de scraping réduit de moitié le volume d'échantillons ingérés.

## Comment puis-je envoyer des métriques CloudWatch à Amazon Managed Service for Prometheus ?

Nous recommandons d'utiliser les [flux de métriques CloudWatch pour envoyer des métriques CloudWatch à Amazon Managed Service for Prometheus](https://aws-observability.github.io/observability-best-practices/recipes/recipes/lambda-cw-metrics-go-amp/). Quelques limitations possibles de cette intégration sont :
1. Une fonction Lambda est requise pour appeler les API Amazon Managed Service for Prometheus,
1. Pas de possibilité d'enrichir les métriques CloudWatch avec des métadonnées (par exemple, avec des tags AWS) avant de les ingérer dans Amazon Managed Service for Prometheus,
1. Les métriques ne peuvent être filtrées que par namespace (pas assez granulaire). En alternative, les clients peuvent utiliser des exporteurs Prometheus pour envoyer des données de métriques CloudWatch à Amazon Managed Service for Prometheus : (1) CloudWatch Exporter : scraping basé sur Java qui utilise les API CW ListMetrics et GetMetricStatistics (GMS).

[**Yet Another CloudWatch Exporter (YACE)**](https://github.com/nerdswords/yet-another-cloudwatch-exporter) est une autre option pour obtenir des métriques de CloudWatch dans Amazon Managed Service for Prometheus. C'est un outil basé sur Go qui utilise les API CW ListMetrics, GetMetricData (GMD) et GetMetricStatistics (GMS). Quelques inconvénients à utiliser cet outil sont que vous devrez déployer l'agent et gérer son cycle de vie vous-même, ce qui doit être fait de manière réfléchie.

## Avec quelle version de Prometheus Amazon Managed Service for Prometheus est-il compatible ?

Amazon Managed Service for Prometheus est compatible avec [Prometheus 2.x](https://github.com/prometheus/prometheus/blob/main/RELEASE.md). Amazon Managed Service for Prometheus est basé sur le projet open source [CNCF Cortex](https://cortexmetrics.io/) comme plan de données. Cortex s'efforce d'être 100% compatible API avec Prometheus (sous /prometheus/* et /api/prom/*). Amazon Managed Service for Prometheus prend en charge les requêtes PromQL compatibles Prometheus et l'ingestion de métriques par Remote write ainsi que le modèle de données Prometheus pour les types de métriques existants incluant Gauge, Counters, Summary et Histogram. Nous n'exposons pas actuellement [toutes les API Cortex](https://cortexmetrics.io/docs/api/). La liste des API compatibles que nous prenons en charge est [disponible ici](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-APIReference.html). Les clients peuvent travailler avec leur équipe de compte pour ouvrir de nouvelles demandes de fonctionnalités produit (PFR) ou influencer les PFR existantes si des fonctionnalités requises manquent dans Amazon Managed Service for Prometheus.

## Quel collecteur recommandez-vous pour l'ingestion de métriques dans Amazon Managed Service for Prometheus ? Devrais-je utiliser Prometheus en mode Agent ?

Nous prenons en charge l'utilisation de serveurs Prometheus incluant le mode agent, l'agent OpenTelemetry et l'agent AWS Distro for OpenTelemetry comme agents que les clients peuvent utiliser pour envoyer des données de métriques à Amazon Managed Service for Prometheus. AWS Distro for OpenTelemetry est une distribution en aval du projet OpenTelemetry empaquetée et sécurisée par AWS. N'importe lequel des trois devrait convenir, et vous êtes libre de choisir celui qui correspond le mieux aux besoins et préférences de votre équipe.

## Comment la performance d'Amazon Managed Service for Prometheus évolue-t-elle avec la taille d'un espace de travail ?

Actuellement, Amazon Managed Service for Prometheus prend en charge jusqu'à 200M de séries temporelles actives dans un seul espace de travail. Lorsque nous annonçons une nouvelle limite maximale, nous nous assurons que les propriétés de performance et de fiabilité du service continuent d'être maintenues pour l'ingestion et les requêtes. Les requêtes sur un ensemble de données de même taille ne devraient pas voir de dégradation de performance quel que soit le nombre de séries actives dans un espace de travail.

**FAQ produit :** [https://aws.amazon.com/prometheus/faqs/](https://aws.amazon.com/prometheus/faqs/)
