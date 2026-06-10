# Métriques

Les métriques sont essentielles en Observability car elles fournissent des données quantitatives sur les performances et le comportement du système. Cela permet l'analyse des tendances et prend en charge la surveillance proactive pour détecter les problèmes avant qu'ils n'impactent les utilisateurs.

Pour en savoir plus sur les métriques en général et les fonctionnalités d'Amazon CloudWatch pour la collecte et l'analyse des métriques, consultez [**Métriques dans Amazon CloudWatch**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/working_with_metrics.html)

[**Bien que de nombreux services AWS aient la capacité de publier des métriques d'infrastructure prêtes à l'emploi vers Amazon CloudWatch**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch-metrics-basic-detailed.html), cette section se concentrera sur la capture de métriques personnalisées à partir d'applications .NET et leur transport vers les systèmes de surveillance de métriques Amazon CloudWatch pour analyse.

### Utiliser l'appel API CloudWatch PutMetricData via le SDK AWS pour .NET

Incluez les packages NuGet Amazon.CloudWatch et Amazon.CloudWatch.Model dans votre code.

```csharp
using Amazon.CloudWatch;
using Amazon.CloudWatch.Model;
```

Construisez l'objet PutMetricDataRequest qui contient l'espace de noms, le nom et la valeur de la métrique, les dimensions et les valeurs des dimensions.

```csharp
var request = new PutMetricDataRequest
{
    Namespace = namespaceName,
    MetricData = new List<MetricDatum>
    {
        new MetricDatum
        {
            MetricName = metricName,
            Dimensions = new List<Dimension>
            {
                new Dimension
                {
                    Name = dimensionName,
                    Value = dimensionValue
                }
            },
            Value = metricValue
        }
    }
};
```

Envoyez les données de métriques vers Amazon CloudWatch en utilisant l'appel API PutMetricData.

```csharp
using var client = new AmazonCloudWatchClient();
await client.PutMetricDataAsync(request);
```

### Format de métriques intégrées CloudWatch

Le [**format de métriques intégrées CloudWatch (EMF)**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html) vous permet de créer des métriques personnalisées de manière asynchrone en écrivant des journaux dans CloudWatch Logs. Cette approche vous permet de :

* Intégrer des métriques personnalisées aux données détaillées des événements de journaux
* Faire en sorte que CloudWatch extraie automatiquement ces métriques pour la visualisation et les alarmes
* Permettre la détection d'incidents en temps réel
* Interroger les événements de journaux détaillés associés à l'aide de CloudWatch Logs Insights
* Obtenir des informations approfondies sur les causes profondes des événements opérationnels

#### Cas d'utilisation de l'EMF

* Générer des métriques personnalisées dans différents environnements de calcul

  * Générez facilement des métriques personnalisées à partir de fonctions Lambda sans nécessiter de code de regroupement personnalisé, d'effectuer des requêtes réseau bloquantes ou de dépendre de logiciels tiers. D'autres environnements de calcul (EC2, On-premises, ECS, EKS et autres environnements de conteneurs) sont pris en charge en installant le [**CloudWatch Agent**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Generation_CloudWatch_Agent.html).
    
* Lier les métriques à un contexte de haute cardinalité

    * En utilisant le format de métriques intégrées, vous pourrez visualiser et créer des alarmes sur des métriques personnalisées, mais aussi conserver le contexte original, détaillé et de haute cardinalité qui est interrogeable à l'aide de [**CloudWatch Logs Insights**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html). Par exemple, la bibliothèque injecte automatiquement des métadonnées d'environnement telles que la version de la fonction Lambda, les identifiants d'instance et d'image EC2 dans les données d'événements de journaux structurés.

Le [**dépôt open source aws-embedded-metrics-dotnet**](https://github.com/awslabs/aws-embedded-metrics-dotnet) contient tout ce dont vous avez besoin pour commencer. 

#### Installation

Incluez le package NuGet Amazon.CloudWatch.EMF dans votre code

```csharp
using Amazon.CloudWatch.EMF
```

Vous pouvez instancier un MetricsLogger qui implémente IDisposable et l'utiliser comme indiqué ci-dessous. Les métriques seront envoyées vers le récepteur configuré lorsque le logger sera disposé.

#### Utilisation

```csharp
using (var logger = new MetricsLogger()) {
    logger.SetNamespace("Canary");
    var dimensionSet = new DimensionSet();
    dimensionSet.AddDimension("Service", "aggregator");
    logger.SetDimensions(dimensionSet);
    logger.PutMetric("ProcessingLatency", 100, Unit.MILLISECONDS,StorageResolution.STANDARD);
    logger.PutMetric("Memory.HeapUsed", "1600424.0", Unit.BYTES, StorageResolution.HIGH);
    logger.PutProperty("RequestId", "422b1569-16f6-4a03-b8f0-fe3fd9b100f8");
    
}
```
#### ASP.NET Core

Nous fournissons un package d'aide qui facilite l'intégration et fournit des métriques par défaut pour les [**applications ASP.NET Core**](https://github.com/awslabs/aws-embedded-metrics-dotnet).

1. Ajoutez la configuration à votre fichier Startup.

```csharp
public void ConfigureServices(IServiceCollection services) {
    // Add the necessary services. After this is done, you will have the
    // IMetricsLogger available for dependency injection in your
    // controllers
    services.AddEmf();
}
```

2. Ajoutez le middleware pour ajouter des métriques et métadonnées par défaut à chaque requête

```csharp
public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
    // Add middleware which will set metric dimensions based on the request routing
    app.UseEmfMiddleware();
}
```

Dans tout environnement autre qu'AWS Lambda, nous recommandons d'exécuter un agent hors processus (le [**CloudWatch Agent**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Generation_CloudWatch_Agent.html) ou FireLens / Fluent-Bit) pour collecter les événements EMF. Lors de l'utilisation d'un agent hors processus, ce package mettra les données en tampon de manière asynchrone dans le processus pour gérer tout problème de communication transitoire avec l'agent. 
