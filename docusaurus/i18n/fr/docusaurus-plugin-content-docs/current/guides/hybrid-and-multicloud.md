# Bonnes pratiques pour les environnements hybrides et multicloud

## Introduction

Nous considérons le multicloud comme l'utilisation simultanée de plus d'un fournisseur de services cloud pour exploiter vos propres charges de travail, et l'hybride comme l'extension de vos charges de travail à la fois sur des environnements on-premises et cloud. L'Observability dans les environnements hybrides et multicloud peut ajouter une complexité significative en raison de la diversité des outils, de la latence et des charges de travail hétérogènes. Néanmoins, cela reste un objectif courant tant pour les utilisateurs du développement que pour les utilisateurs métier. Un riche écosystème de produits et services répond à ce besoin.

Cependant, l'utilité des outils d'Observability pour les charges de travail cloud-native peut varier considérablement. Considérez les différentes exigences de la surveillance d'une charge de travail de traitement par lots conteneurisée, par rapport à une application bancaire en temps réel utilisant un framework serverless : les deux ont des logs, des métriques et des traces ; cependant, la chaîne d'outils pour les observer variera, avec un certain nombre de produits cloud-native, open source et ISV disponibles. Un outil open source tel que Prometheus peut être un excellent choix pour l'un, tandis qu'un outil cloud-native fourni en tant que service géré pourrait mieux répondre à vos exigences.

Ajoutez à cela la complexité du multicloud et de l'hybride, et obtenir des informations exploitables de vos applications devient considérablement plus difficile.

Afin de gérer ces dimensions supplémentaires et faciliter les approches de l'Observability, les clients ont tendance à investir dans une chaîne d'outils unique avec une interface unifiée. Après tout, réduire le rapport signal/bruit est généralement une bonne chose ! Cependant, une approche unique ne fonctionne pas pour tous les cas d'utilisation, et les modèles opérationnels des différentes plateformes peuvent ajouter de la confusion. Notre objectif est de vous aider à prendre des décisions éclairées qui complètent vos besoins et réduisent votre temps moyen de remédiation lorsque des problèmes surviennent. Voici les bonnes pratiques que nous avons apprises en travaillant avec des clients de toutes tailles et dans tous les secteurs d'activité.

:::tip
    Ces bonnes pratiques sont destinées à un large éventail de rôles : architectes d'entreprise, développeurs, DevOps, et plus encore. Nous suggérons de les évaluer à travers le prisme des besoins métier de votre organisation, et de la manière dont l'Observability dans les environnements distribués peut apporter autant de valeur que possible.
:::
## Ne laissez pas vos outils dicter vos décisions

Vos applications, outils et processus existent pour vous aider à atteindre des résultats métier, comme l'augmentation des ventes et de la satisfaction client. Une stratégie technologique bien avisée est celle qui fait tout son possible pour vous aider à atteindre ces objectifs métier. Mais les éléments qui vous aident à y parvenir sont simplement des outils, et ils sont destinés à soutenir votre stratégie - pas à être la stratégie. Pour faire une analogie, si vous deviez construire une maison, vous ne demanderiez pas à vos outils comment la concevoir et la construire. Vos outils sont plutôt un moyen pour atteindre une fin.

Dans un environnement unique et homogène, les décisions concernant l'outillage sont plus faciles. Après tout, si vous exécutez une seule application dans un seul environnement, alors votre outillage peut facilement être le même partout. Mais pour les environnements hybrides et multicloud, les choses sont moins claires, et garder un oeil sur vos résultats métier - et [la valeur ajoutée](https://arxiv.org/abs/2303.13402) par l'observation de vos charges de travail dans ces environnements - est critique. Chaque fournisseur de services cloud (CSP) dispose de ses propres solutions d'Observability natives, ainsi qu'un riche ensemble de partenaires et de fournisseurs de logiciels indépendants (ISV) que vous pouvez également utiliser.

Le simple fait d'opérer dans plusieurs environnements ne signifie pas qu'un outil unique pour chaque charge de travail est conseillé, ni même recommandé. Cela peut potentiellement signifier l'utilisation de plusieurs services, frameworks ou fournisseurs pour observer vos charges de travail. Voir "[un tableau de bord unique est moins important que le contexte de votre charge de travail](#un-tableau-de-bord-unique-est-moins-important-que-le-contexte-de-votre-charge-de-travail)" ci-dessous pour les détails sur la façon dont votre modèle opérationnel doit refléter vos besoins. Quoi qu'il en soit, lors de l'implémentation de vos outils, n'oubliez pas de créer des "[portes à double sens](https://aws.amazon.com/executive-insights/content/how-amazon-defines-and-operationalizes-a-day-1-culture/)" afin de pouvoir faire évoluer votre solution d'Observability à l'avenir.

Voici quelques exemples de résultats "outil d'abord" à éviter :

1.	Se concentrer sur l'implémentation d'un outil unique sans porte à double sens pour le mettre à niveau, ou passer à une nouvelle solution à l'avenir, peut créer une dette technique qui serait autrement évitable. Cela peut arriver lorsque l'outil est la solution, et qu'un jour il peut devenir le problème à résoudre.
2.	Une norme d'entreprise d'utiliser un outil unique en raison d'une remise sur volume peut se retrouver sans fonctionnalités dont elle bénéficierait. Cela peut être "le coût avant la qualité", et crée involontairement un anti-pattern monolithique. Cela peut décourager la collecte de télémétrie afin de rester sous un seuil de volume, désincitant ainsi l'utilisation d'outils d'Observability.
3.	Ne pas collecter un type entier de télémétrie (généralement les traces) en raison d'un manque d'infrastructure de collecte de traces existante, mais avec un riche ensemble de collecteurs de logs et de métriques, peut conduire à une solution d'Observability incomplète.
4.	Le personnel de support ayant été formé sur une seule chaîne d'outils, dans le désir de réduire les coûts de main-d'oeuvre et de formation, réduit ainsi la valeur potentielle d'autres patterns d'Observability.

:::info
    Si votre outillage dicte votre stratégie d'Observability, alors vous devez inverser l'approche. Les outils sont destinés à permettre et à renforcer l'Observability, pas à limiter vos choix.
:::

:::info
    La prolifération des outils est un problème très réel avec lequel les entreprises luttent, cependant un changement radical vers une chaîne d'outils unique peut également réduire l'utilité de votre solution d'Observability. Les charges de travail hybrides et multicloud ont des technologies uniques à chaque plateforme, et les services de niveau supérieur de chaque CSP sont utiles - bien que les compromis dans l'utilisation d'un produit mono-source nécessitent une analyse basée sur la valeur. Voir "[Investissez dans OpenTelemetry](#investissez-dans-opentelemetry)" pour une approche qui atténue certains de ces risques.
:::

## Les données (d'Observability) ont une gravité

Toutes les données ont une gravité - c'est-à-dire qu'elles attirent les charges de travail, les solutions, les outils, les personnes, les processus et les projets autour d'elles. Par exemple, une base de données contenant vos transactions clients sera la force d'attraction qui amène les charges de travail de calcul et d'analyse vers elle. Cela a des implications directes sur l'endroit où vous placez vos charges de travail, dans quel environnement, et comment vous les exploitez à l'avenir. Et il en va de même pour les signaux d'Observability, bien que la gravité que ces données créent soit liée au contexte de votre charge de travail et de votre organisation (voir "[un tableau de bord unique est moins important que le contexte de votre charge de travail](#un-tableau-de-bord-unique-est-moins-important-que-le-contexte-de-votre-charge-de-travail)").

On ne peut pas complètement séparer le contexte de votre télémétrie d'Observability de la charge de travail et des données sous-jacentes auxquelles elle se rapporte. La même règle s'applique ici : votre télémétrie est une donnée, et elle a une gravité. Cela devrait influencer l'endroit où vous placez vos agents de télémétrie, collecteurs ou systèmes qui agrègent et analysent les signaux.

:::tip
    La valeur des données d'Observability dans le temps est considérablement moindre que celle de la plupart des autres types de données. On pourrait appeler cela la "demi-vie" des données d'Observability. Considérez la latence supplémentaire dans le relais de la télémétrie vers un autre environnement comme une dévaluation forcée potentielle de ces données avant leur utilisation potentielle, puis pesez cela par rapport aux exigences que vous avez en matière d'alerte lorsque des problèmes surviennent.
:::

:::info
    La bonne pratique consiste à émettre des données entre environnements uniquement lorsqu'il y a une valeur métier à tirer de cette agrégation. Avoir une source unique pour interroger les données ne résout pas à elle seule de nombreux besoins métier, et peut créer une solution plus coûteuse que souhaitée, avec plus de points de défaillance.
:::

## Un tableau de bord unique est moins important que le contexte de votre charge de travail

Une demande courante est celle d'un "tableau de bord unique" pour observer toutes vos charges de travail. Cela découle d'un désir naturel de visualiser autant de données que possible, mais de la manière la plus simple possible, et de réduire la frustration, l'agitation et le temps de diagnostic. Créer cette interface unique pour voir l'ensemble de votre solution d'Observability en une seule fois est utile, mais peut s'accompagner du compromis de séparer votre télémétrie du contexte dont elle provient.

Par exemple, un tableau de bord avec l'utilisation CPU d'une centaine de serveurs peut montrer des pics anomaux de consommation, mais cela n'explique pas pourquoi cela s'est produit, ni quels sont les facteurs contributifs à ce comportement. Et l'importance de cette métrique peut ne pas être immédiatement claire.

Nous avons vu des clients parfois poursuivre le tableau de bord unique de manière si agressive que tout contexte métier est perdu, et essayer de tout voir dans un seul outil peut en réalité diluer la valeur de ces données. Vos tableaux de bord, et vos outils, doivent [raconter une histoire](https://aws-observability.github.io/observability-best-practices/tools/dashboards/). Et cette histoire doit inclure les métriques métier et les résultats qui sont impactés par les événements dans vos charges de travail.

De plus, votre outillage doit s'aligner sur votre modèle opérationnel. Un tableau de bord unique peut apporter de la valeur lorsque vos équipes de support sont globales avec accès à tous vos environnements, mais si elles sont limitées à l'accès à une seule charge de travail, dans un seul CSP ou environnement hybride, alors il n'y a pas de valeur ajoutée par cette approche. Dans ces cas, permettre aux équipes de créer des tableaux de bord au sein de chaque environnement nativement peut accélérer le temps de mise en valeur, et être plus flexible aux changements futurs.

:::info
    La valeur des données d'Observability est profondément intégrée dans l'application dont elles proviennent. Votre télémétrie nécessite une conscience contextuelle qui vient de son environnement. Dans les environnements hybrides et multicloud, les différences entre les technologies rendent le besoin de contexte encore plus grand (bien que des systèmes comme Kubernetes puissent être similaires entre différents fournisseurs cloud et on-premises).
:::

:::info
    Lors de la construction d'un tableau de bord unique pour un système distribué, affichez vos métriques métier et vos objectifs de niveau de service (SLO) dans la même vue que les autres données (telles que les métriques d'infrastructure) qui contribuent à ces SLO. Cela donne un contexte qui pourrait autrement faire défaut.
:::

:::tip
    Un tableau de bord unique peut aider à diagnostiquer rapidement les problèmes et à réduire le temps de détection (MTTD) et par conséquent le temps moyen de résolution (MTTR), mais uniquement si la signification des données de télémétrie peut être préservée. Sans cela, une approche de tableau de bord unique peut augmenter le temps de mise en valeur, ou devenir un négatif net pour les équipes d'exploitation.
:::

:::info
    Si la valeur d'un tableau de bord unique ne peut être déterminée, ou si les charges de travail sont entièrement liées à un seul CSP ou environnement on-premises, envisagez de ne remonter que les métriques métier de haut niveau vers un tableau de bord unique, en laissant les métriques brutes et autres facteurs contributifs dans leurs environnements d'origine.
:::

## Investissez dans OpenTelemetry

À travers le paysage des fournisseurs d'Observability, OpenTelemetry (OTel) est devenu le standard de facto. OTel peut acheminer chacun de vos types de télémétrie vers un ou plusieurs collecteurs, qui peuvent inclure des services cloud-native, ou une grande variété de produits SaaS et ISV. Les agents et collecteurs OTel communiquent en utilisant le protocole OpenTelemetry (OTLP), qui encapsule les signaux dans un format permettant une grande variété de patterns de déploiement.

Pour collecter des traces de transactions avec le plus de valeur, et avec votre contexte métier et d'infrastructure, vous devrez intégrer la collecte de traces dans votre application. Certains agents d'auto-instrumentation peuvent effectuer cela avec presque aucun effort. Cependant, les cas d'utilisation les plus sophistiqués nécessitent des modifications de code de votre part pour prendre en charge les traces de transactions. Cela crée une certaine dette technique et lie votre charge de travail à une technologie particulière.

OTel capture les logs, les métriques et les traces en utilisant un concept de span. Les spans contiennent ces signaux regroupés à partir d'une seule transaction, les empaquetant dans un objet contextualisé et recherchable. Cela signifie que vous pouvez visualiser vos signaux à partir d'un seul événement applicatif dans une entité simple. Par exemple, un utilisateur se connectant à un site web, et les requêtes que cela crée vers tous les services en aval avec lesquels il s'intègre, peuvent être présentés comme un seul span.

:::tip
    OTel ne se limite pas aux traces applicatives, et est largement utilisé pour les logs et les métriques. Et de nombreux [produits ISV acceptent directement OTLP aujourd'hui](https://opentelemetry.io/ecosystem/vendors/).
:::

:::info
    En instrumentant vos applications avec OTel, vous supprimez la nécessité de remplacer cette instrumentation au niveau applicatif à l'avenir, si vous choisissez de passer d'une plateforme d'Observability à une autre. Cela transforme une partie de votre solution d'Observability en une [porte à double sens](https://aws.amazon.com/executive-insights/content/how-amazon-defines-and-operationalizes-a-day-1-culture/).
:::

:::info
    OTel est pérenne, évolutif, et facilite le changement de vos systèmes de collecte et d'analyse à l'avenir sans avoir à modifier le code applicatif, ce qui en fait un [shift to the left](https://www.youtube.com/watch?v=99r7cxKW8Rg) efficace.
:::    
