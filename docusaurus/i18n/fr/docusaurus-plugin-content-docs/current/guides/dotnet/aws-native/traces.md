# Traces

Les traces suivent le traitement des requêtes à travers des systèmes distribués complexes, fournissant des informations détaillées sur le flux des requêtes à travers les composants individuels, y compris les ressources AWS en aval, les microservices, les bases de données et les API. Cela aide à l'optimisation des performances en identifiant les goulots d'étranglement et les problèmes de latence.

Dans cette section, vous trouverez des liens vers la documentation AWS et des dépôts open source qui fournissent des informations sur l'utilisation du AWS X-Ray SDK for .NET pour instrumenter les applications .NET afin de créer et d'envoyer des informations de trace à AWS X-Ray via le daemon X-Ray.

Pour en savoir plus sur AWS X-Ray et ses concepts fondamentaux, consultez les sections [**Qu'est-ce qu'AWS X-Ray**](https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html) et [**Concepts**](https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html) du guide du développeur AWS X-Ray.

Le X-Ray SDK for .NET est une bibliothèque pour instrumenter les applications web C# .NET, les applications web .NET Core et les fonctions .NET Core sur AWS Lambda. Il fournit des classes et des méthodes pour générer et envoyer des données de trace au daemon X-Ray. Cela inclut les informations sur les requêtes entrantes servies par l'application et les appels que l'application effectue vers les services AWS en aval, les API web HTTP et les bases de données SQL.

## Options pour les agents et les SDK

Vous avez le choix entre le daemon AWS X-Ray, l'agent CloudWatch et l'AWS Distro for OpenTelemetry (ADOT) Collector pour collecter les traces depuis les instances Amazon EC2 et les serveurs sur site et les envoyer à AWS X-Ray. Choisissez celui qui convient le mieux à votre cas d'utilisation afin de minimiser le nombre d'agents que vous devez gérer.

Pour en savoir plus sur la configuration du daemon X-Ray pour collecter et envoyer les traces de votre application et de votre infrastructure, lisez le guide du [**daemon AWS X-Ray**](https://docs.aws.amazon.com/xray/latest/devguide/xray-daemon.html). Si votre choix se porte sur l'agent CloudWatch, le [**guide utilisateur Amazon CloudWatch**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html) fournira les instructions pour configurer l'agent CloudWatch.

Pour instrumenter votre application afin de générer des traces, vous avez le choix entre OpenTelemetry et le X-Ray SDK for .NET. Les conseils pour choisir entre ces options sont disponibles [**ici**](https://docs.aws.amazon.com/xray/latest/devguide/xray-instrumenting-your-app.html#xray-instrumenting-choosing).

## AWS X-Ray SDK for .NET
 
Le X-Ray SDK for .NET est un projet open source. Le X-Ray SDK for .NET est pris en charge pour les applications ciblant .NET Framework 4.5 ou ultérieur. Pour les applications .NET Core, le SDK nécessite .NET Core 2.0 ou ultérieur.

Voici les liens pour commencer.

[**Guide du développeur AWS X-Ray SDK for .NET**](https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-dotnet.html) - La documentation explique l'installation via NuGet, les options de configuration et les diverses capacités d'instrumentation, y compris le tracing automatique des requêtes HTTP et la surveillance des appels de services AWS. Elle couvre la façon dont les développeurs peuvent créer des segments personnalisés, ajouter des annotations et utiliser des règles d'échantillonnage pour gérer la collecte de données. Le guide offre des informations complètes pour intégrer le tracing X-Ray dans les applications ASP.NET, aidant les développeurs à obtenir une visibilité sur les performances de l'application et à résoudre efficacement les problèmes.

[**Le dépôt du projet open source du SDK - aws-xray-sdk-dotnet**](https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-dotnet.html) - Le dépôt aws-xray-sdk-dotnet héberge le code open source du X-Ray SDK for .NET d'Amazon. Les développeurs peuvent voir l'implémentation de cet outil de tracing qui prend en charge la surveillance des applications distribuées dans les environnements .NET Core et .NET Framework. Le dépôt contient le code source pour l'instrumentation automatique des requêtes HTTP, les appels de services AWS et les capacités d'instrumentation personnalisées. Vous pouvez examiner comment le SDK s'intègre avec les frameworks ASP.NET et implémente les règles d'échantillonnage. Ce projet GitHub offre de la transparence sur les fonctionnalités du SDK tout en permettant aux développeurs de signaler des problèmes ou de contribuer des améliorations au code.

Ci-dessous se trouvent les manuels de référence de l'API qui décrivent de manière exhaustive les composants du .NET X-Ray SDK.

[**La référence API pour .NET Framework**](https://docs.aws.amazon.com/xray-sdk-for-dotnet/latest/reference/html/d0b774be-200e-4897-9ce6-4e43c3f6f5de.htm)

[**La référence API pour .NET (Core)**](https://docs.aws.amazon.com/xray-sdk-for-dotnetcore/latest/reference/html/bdf06719-4833-4e03-8ce5-31debb71506c.htm)

Des exemples d'applications pour apprendre à utiliser le X-Ray SDK for .NET dans vos applications ASP.NET et ASP.NET Core sont liés ci-dessous

[**Exemples d'applications ASP.NET et ASP.NET Core**](https://github.com/aws-samples/aws-xray-dotnet-webapp)
