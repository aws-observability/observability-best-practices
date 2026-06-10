# Métriques

.NET a adopté OpenTelemetry comme standard pour l'observabilité des applications, les métriques étant un pilier clé aux côtés des traces et des logs. Cette intégration permet aux développeurs de surveiller les performances des applications avec un minimum de surcharge.

Dans l'écosystème .NET, les métriques OpenTelemetry fournissent une approche standardisée pour mesurer et exposer les métriques applicatives. À partir de .NET 6 et avec des améliorations significatives dans .NET 8, le framework offre une prise en charge intégrée pour la collecte et l'exportation des données métriques.

Le framework fournit une instrumentation automatique pour les composants courants comme ASP.NET Core, les clients HTTP et Entity Framework, collectant des métriques précieuses sans code supplémentaire.

OpenTelemetry dans .NET prend en charge plusieurs formats d'exportation, Prometheus étant particulièrement populaire pour les métriques. Cette flexibilité permet aux équipes de s'intégrer avec leurs plateformes d'observabilité préférées tout en maintenant une approche de collecte cohérente.

En adoptant les métriques OpenTelemetry, les applications .NET bénéficient d'une approche de surveillance standardisée et indépendante des fournisseurs qui s'adapte des environnements de développement aux déploiements de production complexes, offrant une visibilité cruciale sur la santé et les performances de l'application.

## Implémentation des métriques

L'implémentation des métriques OpenTelemetry dans les applications .NET 8 est devenue remarquablement simple. Le processus de configuration s'appuie sur le système d'injection de dépendances qui est au coeur des applications .NET modernes. Les développeurs peuvent configurer la collecte des métriques pendant le processus de démarrage de l'application en utilisant une API fluide qui rend l'intention claire et les options de configuration découvrables :

```c#
var builder = WebApplication.CreateBuilder(args);

// Add OpenTelemetry metrics
builder.Services.AddOpenTelemetry()
    .WithMetrics(metrics => metrics
        .AddAspNetCoreInstrumentation()
        .AddHttpClientInstrumentation()
        .AddRuntimeInstrumentation()
        .AddOtlpExporter());
```

## Métriques personnalisées

Les développeurs peuvent créer des métriques personnalisées en utilisant l'espace de noms System.Diagnostics.Metrics :

```c#
using var meter = new Meter("MyApplication.Metrics");
var orderCounter = meter.CreateCounter<int>("orders.processed");

// Recording values
orderCounter.Add(1, new("customer", customerId));
```

## Prochaines étapes

Maintenant que votre application est instrumentée, utilisez un agent collecteur, tel que l'OpenTelemetry Collector, l'agent CloudWatch ou Fluent Bit, pour acheminer les métriques vers le backend d'observabilité de votre choix. Consultez les liens ci-dessous pour les détails et les conseils d'implémentation.

- [Observability avec OpenTelemetry](https://aws-observability.github.io/observability-best-practices/patterns/otel) - Guide complet pour implémenter OpenTelemetry dans vos applications, fournissant des modèles pour collecter, traiter et visualiser les données de télémétrie avec les services AWS afin d'atteindre une observabilité complète de la pile.

- [Exploitation de l'AWS Distro for OpenTelemetry (ADOT) Collector](https://aws-observability.github.io/observability-best-practices/guides/operational/adot-at-scale/operating-adot-collector) - Conseils pratiques pour déployer, dimensionner et gérer l'ADOT Collector dans les environnements de production, incluant les meilleures pratiques de configuration et l'intégration avec les services d'observabilité AWS.

- [Collecter des métriques, logs et traces avec l'agent CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html) - Instructions détaillées pour installer et configurer l'agent CloudWatch afin de collecter les données de télémétrie de vos applications et de votre infrastructure, avec une intégration transparente dans AWS CloudWatch.

- [AWS for Fluent Bit](https://github.com/aws/aws-for-fluent-bit?tab=readme-ov-file) - Solution légère et efficace pour collecter et transmettre les logs, métriques et traces vers plusieurs services AWS, optimisée pour les environnements conteneurisés et les déploiements Kubernetes.

- [CloudWatch EMF](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html) - Spécification pour incorporer des données métriques dans les événements de log, vous permettant d'extraire et de visualiser des métriques à partir des logs applicatifs sans nécessiter un pipeline de métriques séparé, idéal pour les applications serverless et conteneurisées.

- [Amazon Managed Grafana - Premiers pas](https://aws.amazon.com/blogs/mt/amazon-managed-grafana-getting-started/) - Tutoriel pour configurer Amazon Managed Grafana afin de créer des visualisations puissantes de vos données métriques, avec des instructions détaillées pour configurer les sources de données, créer des tableaux de bord et implémenter des alertes.
