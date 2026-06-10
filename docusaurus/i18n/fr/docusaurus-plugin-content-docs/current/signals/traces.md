# Traces

Les traces représentent le parcours complet des requêtes lorsqu'elles traversent les différents composants d'une application.

Contrairement aux logs ou aux métriques, les *traces* sont composées d'événements provenant de plus d'une application ou d'un service, avec un contexte sur la connexion entre les services comme la latence de réponse, les défaillances de service, les paramètres de requête et les métadonnées.

:::tip
    Il existe une similarité conceptuelle entre les [logs](./logs.md) et les traces, cependant une trace est destinée à être considérée dans un contexte inter-services, alors que les logs sont généralement limités à l'exécution d'un seul service ou d'une seule application.
::::::tip
Les développeurs d'aujourd'hui tendent vers la construction d'applications modulaires et distribuées. Certains les appellent [Architecture Orientée Services](https://en.wikipedia.org/wiki/Service-oriented_architecture), d'autres les désignent comme des [microservices](https://aws.amazon.com/microservices/). Quel que soit le nom, lorsque quelque chose ne va pas dans ces applications faiblement couplées, le simple fait de regarder les logs ou les événements peut ne pas être suffisant pour remonter à la cause racine d'un incident. Avoir une visibilité complète sur le flux des requêtes est essentiel et c'est là que les traces ajoutent de la valeur. À travers une série d'événements causalement liés qui décrivent le flux de requête de bout en bout, les traces vous aident à obtenir cette visibilité.

Les traces sont un pilier essentiel de l'observabilité car elles fournissent les informations de base sur le flux de la requête lorsqu'elle entre et quitte le système.

:::tip
    Les cas d'utilisation courants des traces incluent le profilage de performance, le débogage de problèmes en production et l'analyse de cause racine des défaillances.
:::
## Instrumentez tous vos points d'intégration

Lorsque toute la fonctionnalité et le code de votre charge de travail se trouvent au même endroit, il est facile de regarder le code source pour voir comment une requête est transmise entre différentes fonctions. Au niveau système, vous savez sur quelle machine l'application s'exécute et si quelque chose ne va pas, vous pouvez trouver rapidement la cause racine. Imaginez faire cela dans une architecture basée sur des microservices où différents composants sont faiblement couplés et s'exécutent dans un environnement distribué. Se connecter à de nombreux systèmes pour voir leurs logs de chaque requête interconnectée serait impraticable, sinon impossible.

C'est là que l'observabilité peut aider. L'instrumentation est une étape clé vers l'augmentation de cette observabilité. En termes généraux, l'instrumentation consiste à mesurer les événements dans votre application à l'aide de code.

Une approche d'instrumentation typique consisterait à attribuer un identifiant de trace unique pour chaque requête entrant dans le système et à transporter cet identifiant de trace lorsqu'il passe par différents composants tout en ajoutant des métadonnées supplémentaires.

:::info
    Chaque connexion d'un service à un autre devrait être instrumentée pour émettre des traces vers un collecteur central. Cette approche vous aide à voir les aspects autrement opaques de votre charge de travail.
:::
:::info
    L'instrumentation de votre application peut être un processus largement automatisé lors de l'utilisation d'un agent ou d'une bibliothèque d'auto-instrumentation.
:::

## Le temps de transaction et le statut comptent, alors mesurez-les !

Une application bien instrumentée peut produire une trace de bout en bout, qui peut être visualisée soit comme un graphique en cascade comme ceci :

![Trace en cascade](../images/waterfall-trace.png)

Ou comme une carte de services :

![Trace carte de services](../images/service-map-trace.png)

Il est important que vous mesuriez les temps de transaction et les codes de réponse pour chaque interaction. Cela aidera à calculer les temps de traitement globaux et à les suivre pour assurer la conformité avec vos SLA, SLO ou KPI métier.

:::info
    Ce n'est qu'en comprenant et en enregistrant les temps de réponse et les codes de statut de vos interactions que vous pouvez voir les facteurs contribuant aux patterns de requêtes globaux et à la santé de la charge de travail.
:::
## Les métadonnées, annotations et étiquettes sont vos meilleurs alliés

Les traces sont persistées et se voient attribuer un ID unique, chaque trace étant décomposée en *spans* ou *segments* (selon vos outils) qui enregistrent chaque étape dans le chemin de la requête. Un span indique les entités avec lesquelles la trace interagit, et, comme la trace parente, chaque span se voit attribuer un ID unique et un horodatage et peut inclure des données et métadonnées supplémentaires. Ces informations sont utiles pour le débogage car elles vous donnent l'heure et l'emplacement exacts où un problème s'est produit.

Cela s'explique mieux par un exemple pratique. Une application e-commerce peut être divisée en de nombreux domaines : authentification, autorisation, expédition, inventaire, traitement des paiements, fulfillment, recherche de produits, recommandations et bien d'autres. Plutôt que de chercher dans les traces de tous ces domaines interconnectés, l'étiquetage de votre trace avec un ID client vous permet de rechercher uniquement les interactions spécifiques à cette seule personne. Cela vous aide à restreindre votre recherche instantanément lors du diagnostic d'un problème opérationnel.

:::info
    Bien que la convention de nommage puisse varier entre les fournisseurs, chaque trace peut être augmentée avec des métadonnées, des étiquettes ou des annotations, et celles-ci sont consultables à travers toute votre charge de travail. Les ajouter nécessite du code de votre part, mais augmente considérablement l'observabilité de votre charge de travail.
:::
:::warning
    Les traces ne sont pas des logs, soyez donc économe avec les métadonnées que vous incluez dans vos traces. Et les données de traces ne sont pas destinées à la forensique et à l'audit, même avec un taux d'échantillonnage élevé.
:::
