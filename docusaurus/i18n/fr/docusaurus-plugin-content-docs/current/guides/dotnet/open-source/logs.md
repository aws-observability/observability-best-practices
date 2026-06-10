# Logs

.NET offre une prise en charge complète de la journalisation OpenTelemetry, complétant la triade d'observabilité aux côtés des métriques et des traces. Cette intégration permet une journalisation structurée et contextualisée qui s'intègre de manière transparente dans les plateformes d'observabilité modernes.

L'implémentation de la journalisation OpenTelemetry dans .NET s'appuie sur les abstractions établies de Microsoft.Extensions.Logging, permettant aux développeurs d'adopter OpenTelemetry sans modifier le code de journalisation existant. Cette rétrocompatibilité rend l'adoption simple aussi bien dans les nouvelles applications que dans les applications existantes.

## Implémentation de la journalisation

La configuration des logs OpenTelemetry dans une application .NET nécessite une configuration minimale :

```c#
builder.Logging.AddOpenTelemetry(options =>
{
    options.SetResourceBuilder(ResourceBuilder.CreateDefault()
        .AddService("MyServiceName"));
    
    options.AddOtlpExporter();
});
```

L'une des fonctionnalités les plus puissantes des logs OpenTelemetry dans .NET est la propagation automatique du contexte. Les entrées de journal sont automatiquement enrichies avec les identifiants de trace et de span lorsque la journalisation se produit au sein d'une trace active, créant des connexions entre les logs et les traces distribuées associées.

```c#
// Logs created within this span will contain its context
using var activity = MyActivitySource.StartActivity("ProcessOrder");
logger.LogInformation("Processing order {OrderId}", orderId);
```

En implémentant les logs OpenTelemetry dans les applications .NET, les équipes de développement obtiennent une approche standardisée de la journalisation qui s'intègre harmonieusement avec l'écosystème d'observabilité plus large. Cette intégration fournit un contexte critique pour le dépannage, connecte les signaux associés entre les services et permet une surveillance et un débogage plus efficaces dans les environnements distribués.

## Prochaines étapes

Maintenant que votre application est instrumentée, utilisez un agent collecteur, tel que l'OpenTelemetry Collector, l'agent CloudWatch ou Fluent Bit, pour acheminer les logs vers le backend d'observabilité de votre choix. Consultez les liens ci-dessous pour les détails et les conseils d'implémentation.

- [Observability avec OpenTelemetry](https://aws-observability.github.io/observability-best-practices/patterns/otel) - Guide complet pour implémenter OpenTelemetry dans vos applications, fournissant des modèles pour collecter, traiter et visualiser les données de télémétrie avec les services AWS afin d'atteindre une observabilité complète de la pile.

- [Exploitation de l'AWS Distro for OpenTelemetry (ADOT) Collector](https://aws-observability.github.io/observability-best-practices/guides/operational/adot-at-scale/operating-adot-collector) - Conseils pratiques pour déployer, dimensionner et gérer l'ADOT Collector dans les environnements de production, incluant les meilleures pratiques de configuration et l'intégration avec les services d'observabilité AWS.

- [Collecter des métriques, logs et traces avec l'agent CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html) - Instructions détaillées pour installer et configurer l'agent CloudWatch afin de collecter les données de télémétrie de vos applications et de votre infrastructure, avec une intégration transparente dans AWS CloudWatch.

- [AWS for Fluent Bit](https://github.com/aws/aws-for-fluent-bit?tab=readme-ov-file) - Solution légère et efficace pour collecter et transmettre les logs, métriques et traces vers plusieurs services AWS, optimisée pour les environnements conteneurisés et les déploiements Kubernetes.

- [ADOT Collector Amazon CloudWatch Exporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/awscloudwatchlogsexporter) - Composant spécialisé de l'OpenTelemetry Collector qui exporte les logs directement vers Amazon CloudWatch Logs, avec des options de configuration pour les groupes de logs, les flux et l'authentification AWS.
