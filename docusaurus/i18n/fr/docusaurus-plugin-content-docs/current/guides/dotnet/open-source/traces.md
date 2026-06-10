# Tracing

.NET offre une prise en charge robuste du tracing OpenTelemetry, fournissant aux développeurs des outils puissants pour surveiller les flux de requêtes dans les systèmes distribués. Cette implémentation permet une visibilité de bout en bout sur le comportement de l'application et les goulots d'étranglement de performance.

Dans l'écosystème .NET, le tracing OpenTelemetry est construit autour de la classe [System.Diagnostics.Activity](https://learn.microsoft.com/en-us/dotnet/api/system.diagnostics.activity?view=net-9.0), qui est l'implémentation .NET de la spécification W3C Trace Context. Cet alignement avec les standards industriels assure l'interopérabilité avec d'autres services et outils d'observabilité.

## Implémentation des traces

La configuration du tracing OpenTelemetry dans une application .NET est simple :

```c#
builder.Services.AddOpenTelemetry()
    .WithTracing(tracing => tracing
        .AddAspNetCoreInstrumentation()
        .AddHttpClientInstrumentation()
        .AddEntityFrameworkCoreInstrumentation()
        .AddSource("MyApplication.Tracing")
        .AddOtlpExporter());
```

Un point fort de l'implémentation OpenTelemetry de .NET est l'instrumentation automatique. De nombreuses bibliothèques et frameworks courants, notamment ASP.NET Core, HttpClient, gRPC et Entity Framework Core, émettent des traces sans nécessiter de code supplémentaire. Cela fournit une visibilité immédiate sur les appels externes et les opérations de base de données.

## Traces personnalisées

La création de traces personnalisées dans le code applicatif utilise l'API ActivitySource :

```c#
// Create a source once and reuse it
private static readonly ActivitySource MyActivitySource = 
    new("MyApplication.Tracing");

// Create spans for important operations
using var activity = MyActivitySource.StartActivity("ProcessOrder");
activity?.SetTag("orderId", orderId);

// Child operations create nested spans
using var childActivity = MyActivitySource.StartActivity("ValidatePayment");
```

L'enregistrement de votre ActivitySource dans l'injection de dépendances est considéré comme une bonne pratique pour le tracing OpenTelemetry dans les applications .NET.

```c#
// During service configuration
services.AddSingleton(sp => new ActivitySource("MyCompany.MyApplication", "1.0.0"));

// Or create a wrapper service if you need more functionality
services.AddSingleton<TracingService>();

// Then inject it where needed
public class OrderProcessor
{
    private readonly ActivitySource _activitySource;
    
    public OrderProcessor(ActivitySource activitySource)
    {
        _activitySource = activitySource;
    }
    
    public void ProcessOrder(Order order)
    {
        using var activity = _activitySource.StartActivity("ProcessOrder");
        activity?.SetTag("orderId", order.Id);
        
        // Processing logic
    }
}
```

## Prochaines étapes

Maintenant que votre application est instrumentée, utilisez un agent collecteur, tel que l'OpenTelemetry Collector, l'agent CloudWatch ou Fluent Bit, pour acheminer les traces vers le backend d'observabilité de votre choix. Consultez les liens ci-dessous pour les détails et les conseils d'implémentation.

- [Observability avec OpenTelemetry](https://aws-observability.github.io/observability-best-practices/patterns/otel) - Guide complet pour implémenter OpenTelemetry dans vos applications, fournissant des modèles pour collecter, traiter et visualiser les données de télémétrie avec les services AWS afin d'atteindre une observabilité complète de la pile.

- [Exploitation de l'AWS Distro for OpenTelemetry (ADOT) Collector](https://aws-observability.github.io/observability-best-practices/guides/operational/adot-at-scale/operating-adot-collector) - Conseils pratiques pour déployer, dimensionner et gérer l'ADOT Collector dans les environnements de production, incluant les meilleures pratiques de configuration et l'intégration avec les services d'observabilité AWS.

- [Collecter des métriques, logs et traces avec l'agent CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html) - Instructions détaillées pour installer et configurer l'agent CloudWatch afin de collecter les données de télémétrie de vos applications et de votre infrastructure, avec une intégration transparente dans AWS CloudWatch.

- [AWS for Fluent Bit](https://github.com/aws/aws-for-fluent-bit?tab=readme-ov-file) - Solution légère et efficace pour collecter et transmettre les logs, métriques et traces vers plusieurs services AWS, optimisée pour les environnements conteneurisés et les déploiements Kubernetes.

- [AWS X-Ray](https://docs.aws.amazon.com/xray/latest/devguide/xray-services-adot.html) - Documentation détaillée sur l'intégration d'AWS X-Ray avec OpenTelemetry pour le tracing distribué, vous permettant d'analyser et de déboguer les applications en production à grande échelle avec des outils de visualisation et d'analyse des traces.
