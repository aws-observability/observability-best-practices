# Surveillance des utilisateurs réels

Avec CloudWatch RUM, vous pouvez effectuer une surveillance des utilisateurs réels pour collecter et visualiser des données côté client sur les performances de votre application web à partir de sessions d'utilisateurs réels en quasi temps réel. Les données que vous pouvez visualiser et analyser incluent les temps de chargement des pages, les erreurs côté client et le comportement des utilisateurs. Lorsque vous consultez ces données, vous pouvez les voir agrégées ensemble, ainsi que ventilées par les navigateurs et appareils que vos clients utilisent.

![Tableau de bord du moniteur d'application RUM montrant la ventilation par appareil](../images/rum2.png)

## Client web

Le client web CloudWatch RUM est développé et construit en utilisant Node.js version 16 ou supérieure. Le code est [disponible publiquement](https://github.com/aws-observability/aws-rum-web) sur GitHub. Vous pouvez utiliser le client avec des applications [Angular](https://github.com/aws-observability/aws-rum-web/blob/main/docs/cdn_angular.md) et [React](https://github.com/aws-observability/aws-rum-web/blob/main/docs/cdn_react.md).

CloudWatch RUM est conçu pour ne créer aucun impact perceptible sur le temps de chargement, les performances et le temps de déchargement de votre application.

:::note
    Les données des utilisateurs finaux que vous collectez pour CloudWatch RUM sont conservées pendant 30 jours puis automatiquement supprimées. Si vous souhaitez conserver les événements RUM plus longtemps, vous pouvez choisir que le moniteur d'application envoie des copies des événements à CloudWatch Logs dans votre compte.
:::
:::tip
    Si éviter les interruptions potentielles par les bloqueurs de publicités est une préoccupation pour votre application web, vous pouvez souhaiter héberger le client web sur votre propre réseau de diffusion de contenu, ou même à l'intérieur de votre propre site web. Notre [documentation sur GitHub](https://github.com/aws-observability/aws-rum-web/blob/main/docs/cdn_installation.md) fournit des conseils sur l'hébergement du client web depuis votre propre domaine d'origine.
:::

## Autoriser votre application

Pour utiliser CloudWatch RUM, votre application doit être autorisée via l'une des trois options suivantes.

1. Utiliser l'authentification d'un fournisseur d'identité existant que vous avez déjà configuré.
1. Utiliser un pool d'identités Amazon Cognito existant
1. Laisser CloudWatch RUM créer un nouveau pool d'identités Amazon Cognito pour l'application

:::info
    Laisser CloudWatch RUM créer un nouveau pool d'identités Amazon Cognito pour l'application nécessite le moins d'effort à configurer. C'est l'option par défaut.
:::
:::tip
    CloudWatch RUM peut être configuré pour séparer les utilisateurs non authentifiés des utilisateurs authentifiés. Voir [cet article de blog](https://aws.amazon.com/blogs/mt/how-to-isolate-signed-in-users-from-guest-users-within-amazon-cloudwatch-rum/) pour plus de détails.
:::
## Protection des données et confidentialité

Le client CloudWatch RUM peut utiliser des cookies pour aider à collecter des données sur les utilisateurs finaux. Ceci est utile pour la fonctionnalité de parcours utilisateur, mais n'est pas obligatoire. Voir [notre documentation détaillée pour les informations relatives à la confidentialité](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM-privacy.html).[^1]

:::tip
    Bien que la collecte de télémétrie d'applications web utilisant RUM soit sûre et n'expose pas d'informations personnellement identifiables (PII) à travers la console ou CloudWatch Logs, soyez conscient que vous pouvez collecter des [attributs personnalisés](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM-custom-metadata.html) via le client web. Veillez à ne pas exposer de données sensibles en utilisant ce mécanisme.
:::

## Extrait de code client

Bien que l'extrait de code pour le client web CloudWatch RUM soit automatiquement généré, vous pouvez également modifier manuellement l'extrait de code pour configurer le client selon vos besoins.
:::info
    Utilisez un mécanisme de consentement aux cookies pour activer dynamiquement la création de cookies dans les applications monopage. Voir [cet article de blog](https://aws.amazon.com/blogs/mt/how-and-when-to-enable-session-cookies-with-amazon-cloudwatch-rum/) pour plus d'informations.
:::
### Désactiver la collecte d'URLs

Empêchez la collecte d'URLs de ressources qui pourraient contenir des informations personnelles.

:::info
    Si votre application utilise des URLs contenant des informations personnellement identifiables (PII), nous recommandons fortement de désactiver la collecte d'URLs de ressources en définissant `recordResourceUrl: false` dans la configuration de l'extrait de code, avant de l'insérer dans votre application.
:::

### Activer le traçage actif

Activez le traçage de bout en bout en définissant `addXRayTraceIdHeader: true` dans le client web. Cela permet au client web CloudWatch RUM d'ajouter un en-tête de trace X-Ray aux requêtes HTTP.

Si vous activez ce paramètre optionnel, les requêtes XMLHttpRequest et fetch effectuées pendant les sessions utilisateur échantillonnées par le moniteur d'application sont tracées. Vous pouvez alors voir les traces et segments de ces sessions utilisateur dans le tableau de bord RUM, la console CloudWatch ServiceLens et la console X-Ray.

Cochez la case pour activer le traçage actif lors de la configuration de votre moniteur d'application dans la console AWS pour que le paramètre soit automatiquement activé dans votre extrait de code.

![Configuration du traçage actif pour le moniteur d'application RUM](../images/rum1.png)

### Insertion de l'extrait

Insérez l'extrait de code que vous avez copié ou téléchargé dans la section précédente à l'intérieur de l'élément `<head>` de votre application. Insérez-le avant l'élément `<body>` ou tout autre élément `<script>`.

:::info
    Si votre application comporte plusieurs pages, insérez l'extrait de code dans un composant d'en-tête partagé qui est inclus dans toutes les pages.
:::

:::warning
    Il est essentiel que le client web soit placé aussi tôt que possible dans l'élément `<head>` ! Contrairement aux traceurs web passifs qui sont chargés en bas du HTML d'une page, pour que RUM capture le maximum de données de performance, il doit être instancié tôt dans le processus de rendu de la page.
:::
## Utiliser des métadonnées personnalisées

Vous pouvez ajouter des métadonnées personnalisées aux [métadonnées d'événement](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM-datacollected.html#CloudWatch-RUM-datacollected-metadata) par défaut des événements CloudWatch RUM. Les attributs de session sont ajoutés à tous les événements de la session d'un utilisateur. Les attributs de page sont ajoutés uniquement aux pages spécifiées.

:::info
    Évitez d'utiliser les mots-clés réservés mentionnés sur [cette page](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM-custom-metadata.html#CloudWatch-RUM-custom-metadata-syntax) comme noms de clés pour vos attributs personnalisés
:::
## Utiliser les groupes de pages

:::info
    Utilisez les groupes de pages pour associer différentes pages de votre application entre elles afin de pouvoir consulter des analyses agrégées pour des groupes de pages. Par exemple, vous pourriez vouloir voir les temps de chargement agrégés de toutes vos pages par type et par langue.

    ```
    awsRum.recordPageView({ pageId: '/home', pageTags: ['en', 'landing']})
    ```
:::
## Utiliser les métriques étendues

Il existe un [ensemble de métriques par défaut](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM-metrics.html) automatiquement collectées par CloudWatch RUM qui sont publiées dans l'espace de noms de métriques nommé `AWS/RUM`. Ce sont des [métriques fournies](./metrics.md#vended-metrics) gratuites que RUM crée en votre nom.

:::info
    Envoyez n'importe quelle métrique CloudWatch RUM vers CloudWatch avec des dimensions supplémentaires afin que les métriques vous donnent une vue plus fine.
:::
Les dimensions suivantes sont prises en charge pour les métriques étendues :

- BrowserName
- CountryCode - format ISO-3166 (code à deux lettres)
- DeviceType
- FileType
- OSName
- PageId

Cependant, vous pouvez créer vos propres métriques et alarmes basées sur elles en utilisant nos [conseils depuis cette page](https://aws.amazon.com/blogs/mt/create-metrics-and-alarms-for-specific-web-pages-amazon-cloudwatch-rum/). Cette approche vous permet de surveiller les performances pour n'importe quel point de données, URI ou autre composant dont vous avez besoin.

[^1]: Voir notre [article de blog](https://aws.amazon.com/blogs/mt/how-and-when-to-enable-session-cookies-with-amazon-cloudwatch-rum/) discutant des considérations lors de l'utilisation de cookies avec CloudWatch RUM.
