# OpenTelemetry avec .NET

OpenTelemetry dans .NET se distingue des implémentations dans d'autres langages car il s'appuie sur les capacités d'instrumentation existantes du framework. Alors que d'autres plateformes nécessitent qu'OpenTelemetry fournisse des API de télémétrie complètes, .NET offre déjà des mécanismes intégrés robustes via ses API de plateforme pour la journalisation, les métriques et les activités. L'implémentation OpenTelemetry pour .NET exploite simplement ces composants natifs (comme [System.Diagnostics](https://learn.microsoft.com/en-us/dotnet/api/system.diagnostics?view=net-9.0)) plutôt que d'en créer de nouveaux. Cela signifie que les auteurs de bibliothèques peuvent utiliser les API .NET standard qu'ils connaissent déjà, et OpenTelemetry s'intègre de manière transparente avec ces points d'instrumentation existants.

## Bibliothèques OpenTelemetry

OpenTelemetry dans .NET est structuré autour de trois catégories fondamentales de packages :

1. **Les packages de l'API Core** fournissent la fondation essentielle et les fonctionnalités de base, incluant les interfaces et implémentations principales pour la collecte de télémétrie.

1. **Les packages d'instrumentation** collectent automatiquement les données de télémétrie à partir de divers composants .NET et bibliothèques populaires, capturant les métriques, traces et logs provenant de sources comme ASP.NET Core, les clients HTTP et Entity Framework.

1. **Les packages d'exportation** servent de ponts vers différentes plateformes d'observabilité, vous permettant d'envoyer vos données de télémétrie collectées vers diverses destinations telles que Jaeger, Prometheus ou tout système prenant en charge le protocole OTLP.

Ces composants fonctionnent ensemble comme un système cohérent, disponible via NuGet, pour fournir une solution d'observabilité complète pour les applications .NET.

Le tableau ci-dessous décrit ces packages.

| Package | Description |
| -------- | -------- |
| [OpenTelemetry](https://github.com/open-telemetry/opentelemetry-dotnet/blob/main/src/OpenTelemetry/README.md)   | Bibliothèque OTEL principale qui fournit les fonctionnalités de base    |
| [OpenTelemetry.Instrumentation.AspNetCore](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/blob/main/src/OpenTelemetry.Instrumentation.AspNetCore/README.md)    | Instrumentation pour ASP.NET Core et Kestrel    |
| [OpenTelemetry.Instrumentation.GrpcNetClient](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/blob/main/src/OpenTelemetry.Instrumentation.GrpcNetClient/README.md)    | Instrumentation pour le client gRPC    |
| [OpenTelemetry.Instrumentation.Http](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/blob/main/src/OpenTelemetry.Instrumentation.Http/README.md)    | Instrumentation pour les classes HttpClient et HttpWebRequest    |
| [OpenTelemetry.Instrumentation.SqlClient](https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/src/OpenTelemetry.Exporter.Console/README.md)    | Instrumentation pour SqlClient utilisée pour tracer les opérations de base de données comme Entity Framework Core    |
| [OpenTelemetry.Exporter.Console](https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/src/OpenTelemetry.Exporter.Console/README.md)    | Exportateur utilisant le protocole OTLP    |
| [OpenTelemetry.Exporter.OpenTelemetryProtocol](https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/src/OpenTelemetry.Exporter.OpenTelemetryProtocol/README.md)    | Exportateur utilisant le protocole OTLP    |
| [OpenTelemetry.Exporter.Prometheus.AspNetCore](https://github.com/open-telemetry/opentelemetry-dotnet/blob/main/src/OpenTelemetry.Exporter.Prometheus.AspNetCore/README.md)    | Exportateur pour Prometheus implémenté via un endpoint ASP.NET Core    |
| [OpenTelemetry.Exporter.Zipkin](https://github.com/open-telemetry/opentelemetry-dotnet/blob/main/src/OpenTelemetry.Exporter.Zipkin/README.md)    | Exportateur pour le tracing Zipkin    |

## Bibliothèques AWS .NET OpenTelemetry

AWS a publié sa dernière itération de packages OpenTelemetry disponibles sur NuGet. Les packages ont été retravaillés pour plus de simplicité et pour se conformer aux dernières conventions de nommage OpenTelemetry. Ils incluent de nouvelles fonctionnalités comme la prise en charge de l'observabilité améliorée dans le AWS SDK for .NET et une instrumentation supplémentaire pour les services AWS, y compris Amazon Bedrock, ainsi que de nombreuses corrections de bugs, améliorations et contributions de la communauté OpenTelemetry.

Le tableau ci-dessous décrit ces packages.

| Package | Description |
| -------- | -------- |
| [OpenTelemetry.Instrumentation.AWS](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/tree/main/src/OpenTelemetry.Instrumentation.AWS)    | Enrichit les appels de métriques et de tracing avec des données supplémentaires sur les services AWS lors de l'utilisation du AWS SDK for .NET.    |
| [OpenTelemetry.Instrumentation.AWSLambda](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/tree/main/src/OpenTelemetry.Instrumentation.AWSLambda)    | Méthodes SDK pour instrumenter le handler AWS Lambda afin de créer des spans entrants    |
| [OpenTelemetry.Resources.AWS](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/tree/main/src/OpenTelemetry.Resources.AWS)    | Détecteurs de ressources spécifiques à AWS pour enrichir la télémétrie avec des métadonnées basées sur l'endroit où votre application s'exécute. Inclut la prise en charge d'Amazon EC2, AWS Elastic Beanstalk, Amazon Elastic Container Service (Amazon ECS) et Amazon Elastic Kubernetes Service (Amazon EKS)    |
| [OpenTelemetry.Extensions.AWS](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/tree/main/src/OpenTelemetry.Extensions.AWS)    | Prend en charge la propagation du Trace Context via AWS X-Ray. |
