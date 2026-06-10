# Data Scientists, ingénieurs AI/ML et MLOps

L'observability dans l'ingénierie des données et les opérations de machine learning est cruciale pour maintenir des pipelines de données et des modèles ML fiables, performants et dignes de confiance. Sans une observability appropriée, les systèmes ML deviennent des boîtes noires difficiles à maintenir, déboguer et améliorer. Cela peut entraîner des prédictions peu fiables, des coûts accrus et des impacts potentiels sur l'activité.

Voici les meilleures pratiques clés pour guider votre stratégie d'observability dans les opérations de données et ML.

## Meilleures pratiques
Utilisez les [logs](https://aws-observability.github.io/observability-best-practices/tools/logs/), les [métriques](https://aws-observability.github.io/observability-best-practices/tools/metrics) et les [traces](https://aws-observability.github.io/observability-best-practices/tools/xray) CloudWatch pour la surveillance. Implémentez une stratégie de balisage pour toutes les ressources, créez des filtres de métriques pour les événements critiques, configurez la [détection d'anomalies](https://aws-observability.github.io/observability-best-practices/tools/metrics#anomaly-detection) et configurez les seuils d'alerte à l'aide des [alarmes CloudWatch](https://aws-observability.github.io/observability-best-practices/tools/alarms).

### Assurance qualité des données
Elle garantit la surveillance de la qualité des données, des performances des pipelines et de la santé de l'infrastructure tout au long du cycle de vie des données.

Les domaines clés de surveillance incluent :
- Débit des pipelines ETL, temps de traitement et taux d'erreur
- Détection d'anomalies dans les modèles de données pour la qualité des données, détection de dérive des features, analyse de distribution pour les données d'entraînement/inférence

### Surveillance des performances des modèles
Grâce à l'intégration avec Amazon CloudWatch, AWS capture automatiquement les paramètres d'entraînement détaillés, les hyperparamètres, les métriques d'exécution de pipeline, les métriques de performance des jobs et les métriques d'utilisation de l'infrastructure, permettant une analyse et un débogage approfondis des jobs d'entraînement. Les capacités de versionnement et de registre des modèles assurent un suivi systématique des itérations de modèles, des métadonnées et des états d'approbation, facilitant la gestion de la lignée des modèles.

[Amazon SageMaker Model Monitor](https://docs.aws.amazon.com/sagemaker/latest/dg/how-it-works-model-monitor.html) surveille en continu les modèles de machine learning dans les environnements de production. Il fournit des systèmes d'alerte automatisés qui se déclenchent lorsqu'il y a des écarts dans la qualité du modèle, comme la dérive des données et les anomalies. Le système s'intègre avec [Amazon CloudWatch Logs](https://aws-observability.github.io/observability-best-practices/tools/logs/#search-with-cloudwatch-logs) pour la collecte des données de surveillance, permettant une détection précoce et une maintenance proactive des modèles déployés.

Créez un mécanisme pour agréger et analyser les métriques des endpoints de prédiction de modèles comme la précision et la latence en utilisant les métriques CloudWatch ou [ADOT](https://aws-observability.github.io/observability-best-practices/guides/operational/adot-at-scale/operating-adot-collector) et des services tels qu'[Amazon OpenSearch Service (OpenSearch Service)](https://aws-observability.github.io/observability-best-practices/patterns/opensearch). OpenSearch Service prend en charge Kibana pour les tableaux de bord et la visualisation. La traçabilité permet l'analyse des changements qui pourraient impacter les performances opérationnelles actuelles.

### Surveillance de l'infrastructure
AWS fournit une visibilité approfondie sur l'utilisation des ressources, les modèles de stockage et l'efficacité computationnelle. Les métriques CloudWatch et [OpenTelemetry](https://aws-observability.github.io/observability-best-practices/patterns/otel) capturent des données en temps réel sur l'utilisation CPU, l'allocation mémoire et les opérations d'E/S, tandis que CloudWatch Logs agrège les données de logs pour analyse. [AWS X-Ray](https://aws-observability.github.io/observability-best-practices/tools/xray) aide à tracer les dépendances de services et à identifier les goulots d'étranglement du système à travers les étapes du pipeline ML, permettant une optimisation efficace des ressources et une gestion des coûts.

### Conformité et gouvernance
La gouvernance centralisée des ressources ML à travers plusieurs comptes et le suivi des versions de modèles, de la lignée et des flux de travail d'approbation est cruciale. AWS CloudTrail maintient des journaux d'audit de toutes les activités API, essentiels pour la conformité réglementaire et la gouvernance.

### Analyse de l'impact métier
Les [métriques personnalisées](https://aws-observability.github.io/observability-best-practices/tools/metrics#collecting-metrics) dans CloudWatch peuvent suivre les KPI spécifiques à l'entreprise, permettant la visualisation en temps réel du ROI des initiatives ML via les tableaux de bord QuickSight. Amazon QuickSight crée des tableaux de bord interactifs qui traduisent les métriques techniques en insights métier, connectant les performances ML aux KPI métier. Amazon CloudWatch [ServiceLens](https://aws-observability.github.io/observability-best-practices/tools/rum#enable-active-tracing) aide à surveiller les impacts sur l'expérience utilisateur.

## Références
- [AWS Observability Workshop](https://catalog.workshops.aws/observability/en-US)
- [AWS Observability Best Practices](https://aws-observability.github.io/observability-best-practices/)
- [AWS Well-Architected Framework Machine Learning Lens](https://docs.aws.amazon.com/wellarchitected/latest/machine-learning-lens/machine-learning-lens.html)
- [Sagemaker Logging and Monitoring](https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-incident-response.html)
- [Metrics for monitoring Amazon SageMaker AI](https://docs.aws.amazon.com/sagemaker/latest/dg/monitoring-cloudwatch.html) with Amazon CloudWatch
