# AWS Distro for Open Telemetry (ADOT) - FAQ

## Puis-je utiliser le collecteur ADOT pour ingérer des métriques dans AMP ?

Oui, cette fonctionnalité a été introduite avec le lancement GA pour le support des métriques en mai 2022 et vous pouvez utiliser le collecteur ADOT depuis EC2, via notre add-on EKS, via notre intégration side-car ECS et/ou via nos couches Lambda.

## Puis-je utiliser le collecteur ADOT pour collecter des logs et les ingérer dans Amazon CloudWatch ou Amazon OpenSearch ?

Oui. Le [support des logs](https://aws.amazon.com/about-aws/whats-new/2023/11/logs-support-aws-distro-opentelemetry/) est disponible depuis le 22 novembre 2023. Vous pouvez consulter la page [Logging Exporter](https://aws-otel.github.io/docs/components/misc-exporters) pour plus de détails.

## Où puis-je trouver les détails d'utilisation des ressources et de performance du collecteur ADOT ?

Nous avons un [rapport de performance](https://aws-observability.github.io/aws-otel-collector/benchmark/report) en ligne que nous maintenons à jour au fur et à mesure que nous publions des collecteurs.

## Est-il possible d'utiliser ADOT avec Apache Kafka ?

Oui, le support de l'exporteur et du récepteur Kafka a été ajouté dans le collecteur ADOT v0.28.0. Pour plus de détails, veuillez consulter la [documentation du collecteur ADOT](https://aws-otel.github.io/docs/components/kafka-receiver-exporter).
.
## Comment puis-je configurer le collecteur ADOT ?

Le collecteur ADOT est configuré à l'aide de fichiers de configuration YAML stockés localement. En outre, il est possible d'utiliser une configuration stockée dans d'autres emplacements, comme des buckets S3. Tous les mécanismes pris en charge pour configurer le collecteur ADOT sont décrits en détail dans la [documentation du collecteur ADOT](https://aws-otel.github.io/docs/components/confmap-providers).

## Puis-je effectuer un échantillonnage avancé dans le collecteur ADOT ?

Oui. L'[échantillonnage avancé](https://aws.amazon.com/about-aws/whats-new/2023/05/aws-distro-opentelemetry-advanced-sampling/) a été lancé le 15 mai 2023. Consultez la page [Getting Started with Advanced Sampling using AWS Distro for OpenTelemetry](https://aws-otel.github.io/docs/getting-started/advanced-sampling) pour plus de détails.

## Des conseils pour mettre à l'échelle le collecteur ADOT ?

Oui ! Consultez la documentation OpenTelemetry en amont sur le [Scaling the Collector](https://opentelemetry.io/docs/collector/scaling/).

## J'ai une flotte de collecteurs ADOT, comment puis-je les gérer ?

C'est un domaine en développement actif et nous nous attendons à ce qu'il mûrisse en 2023, consultez la documentation OpenTelemetry en amont sur la [gestion](https://opentelemetry.io/docs/collector/management/) pour plus de détails, en particulier sur l'[Open Agent Management Protocol (OpAMP)](https://opentelemetry.io/docs/collector/management/#opamp).

## Comment surveillez-vous la santé et la performance du collecteur ADOT ?

1. [Surveillance du collecteur](https://github.com/open-telemetry/opentelemetry-collector/blob/main/docs/observability.md) - métriques par défaut exposées sur le port 8080 qui peuvent être récupérées par le récepteur Prometheus
2. En utilisant le [Node Exporter](https://prometheus.io/docs/guides/node-exporter/), l'exécution du node exporter fournira également plusieurs métriques de performance et de santé concernant le nœud, le pod et le système d'exploitation sur lequel le collecteur s'exécute.
3. [Kube-state-metrics (KSM)](https://github.com/kubernetes/kube-state-metrics), KSM peut également produire des événements intéressants concernant le collecteur.
4. [Métrique `up` de Prometheus](https://github.com/open-telemetry/opentelemetry-collector/pull/2918)
5. Un tableau de bord Grafana simple pour commencer : [https://grafana.com/grafana/dashboards/12553](https://grafana.com/grafana/dashboards/12553)

**FAQ produit :** [https://aws.amazon.com/otel/faqs/](https://aws.amazon.com/otel/faqs/)
