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
