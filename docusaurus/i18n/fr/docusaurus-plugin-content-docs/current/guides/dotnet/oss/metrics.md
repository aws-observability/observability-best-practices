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
