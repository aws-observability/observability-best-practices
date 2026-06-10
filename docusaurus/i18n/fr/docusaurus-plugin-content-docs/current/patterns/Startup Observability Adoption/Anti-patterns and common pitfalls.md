Les startups adoptent souvent l'observabilité sous de fortes contraintes de temps et de budget, ce qui rend facile de tomber dans des schémas qui semblent adaptés sur le moment mais deviennent coûteux et fragiles au fil du temps.

Ces anti-patterns ont été dérivés d'expériences et d'informations clients centrées sur les startups, mais ils sont largement applicables aux entreprises de toutes tailles.

## Traiter l'observabilité comme une initiative ponctuelle

Positionner l'observabilité comme un projet fini avec une date de fin définie conduit à des tableaux de bord obsolètes, des alarmes désalignées ou silencieuses, et une couverture incomplète à mesure que de nouveaux services, environnements et comptes AWS sont introduits. L'observabilité doit être gérée comme une capacité permanente, avec des revues régulières et des améliorations itératives liées à l'évolution architecturale, aux patterns de déploiement et aux exigences métier et de conformité changeantes.

## Ne pas suivre une approche progressive crawl-walk-run

Concevoir une pile d'observabilité très complexe dès le début -- par exemple, des pipelines de télémétrie multi-régions, multi-tenants avec un enrichissement et un routage personnalisés extensifs -- introduit une surcharge opérationnelle significative et une charge cognitive sans valeur métier prouvée. Les startups devraient d'abord établir une base minimale mais robuste de métriques, logs, traces et alertes de niveau de service, puis introduire progressivement des capacités avancées à mesure que la complexité des charges de travail et le trafic justifient l'investissement supplémentaire.

## Collecter de la télémétrie à fort volume sans objectifs clairs

Les startups devraient définir des objectifs d'observabilité explicites, limiter la collecte de télémétrie à ces objectifs, et appliquer des stratégies d'échantillonnage, d'agrégation et de filtrage pour équilibrer la profondeur de surveillance avec la performance et le coût.

Ingérer tous les logs, métriques et traces à pleine fidélité, sans cas d'usage d'observabilité définis, génère une cardinalité excessive, une performance de requête dégradée et des coûts de stockage et d'ingestion élevés, surtout dans les charges de travail AWS à haut débit. Par exemple, réduire ou filtrer les labels non essentiels (tels que les identifiants de requête granulaires ou les identifiants utilisateur dynamiques) aide à contrôler la cardinalité. Cela réduit non seulement les dépenses d'ingestion et de stockage, mais accélère également les requêtes et simplifie les tableaux de bord, menant à une observabilité plus durable à mesure que votre système évolue.

## Verrouillage prématuré sur un seul fournisseur d'observabilité

Coupler les bibliothèques d'instrumentation, les schémas de données et les runbooks à un seul fournisseur d'observabilité dans les premières étapes augmente le risque de migration. Cela limite également la flexibilité en matière de coûts et d'architecture à mesure que le volume de données augmente.

Pour conserver des options techniques et économiques, les startups devraient commencer à utiliser des services gérés qui suivent les standards ouverts comme OpenTelemetry pour l'instrumentation et le transport de données. Elles devraient adapter des schémas de télémétrie portables et garder l'option d'envoyer des données à plusieurs backends ou à des backends alternatifs. Cette flexibilité permet des changements faciles vers des options rentables dès le début et simplifie la reconception, le tiering ou la diversification des outils d'observabilité à mesure que l'échelle et les budgets changent.

En émettant des métriques, logs et traces avec les SDKs et exporters OpenTelemetry, un service peut envoyer le même flux de télémétrie vers Amazon CloudWatch ou Application Signals aujourd'hui et, si nécessaire, vers un autre backend plus tard en changeant la configuration du collecteur ou de l'exporter plutôt que le code applicatif. Par exemple, un service de paiement instrumenté avec OpenTelemetry peut envoyer des données OpenTelemetry vers un collecteur AWS Distro for OpenTelemetry qui distribue vers CloudWatch pour les opérations quotidiennes et vers un endpoint alternatif pour un stockage à long terme spécialisé comme Amazon S3, permettant à la startup de faire évoluer son architecture d'observabilité sans être verrouillée dans les APIs et technologies d'un fournisseur et sans effort de ré-instrumentation à grande échelle.

## Adopter un modèle d'observabilité centré sur les outils plutôt que sur la culture

Simplement activer des services et fonctionnalités tels qu'Amazon CloudWatch, AWS X-Ray ou des intégrations APM (Application Performance Monitoring) tierces, sans que les équipes d'ingénierie n'instrumentent activement les chemins de code et n'utilisent la télémétrie dans leurs workflows, ne produit pas une observabilité efficace. Les équipes d'ingénierie doivent incorporer l'observabilité dans les pratiques de développement et d'opérations -- en définissant et possédant les signaux de santé, en intégrant les tableaux de bord et alertes dans la réponse aux incidents et les runbooks, et en utilisant la télémétrie pour informer la conception, la planification de capacité et les revues post-incident.

## Absence de gouvernance pour la télémétrie et les standards de métadonnées

Permettre à chaque équipe de définir indépendamment les noms de métriques, les ensembles de labels, les formats de logs et les attributs de trace produit des ensembles de données fragmentés qui sont difficiles à joindre, interroger et corréler entre les services et environnements. Les organisations devraient établir et appliquer une gouvernance de la télémétrie, incluant des conventions de nommage standardisées, des dimensions requises (telles que service, environnement, région et tenant), et des schémas partagés implémentés via des bibliothèques et templates communs.

## Négliger les indicateurs centrés sur le client et l'expérience utilisateur

Se concentrer principalement sur les signaux de niveau infrastructure tels que le CPU, la mémoire et les métriques disque tout en omettant les KPIs centrés sur l'utilisateur et métier obscurcit l'impact réel sur le client lors des incidents. Par exemple, une API peut sembler saine au niveau de l'hôte alors que les clients subissent des parcours dégradés en raison d'une latence élevée, de timeouts ou de taux d'erreur accrus sur des flux clés tels que le paiement ou l'onboarding dans une application e-commerce. Ces signaux devraient être modélisés comme des SLOs de première classe au niveau service et métier liés à l'expérience utilisateur.

## Absence de politiques de rétention et de tiering des données définies

S'appuyer sur une rétention par défaut ou illimitée pour les logs et métriques conduit à une croissance incontrôlée des coûts de stockage et d'analytique et peut dégrader la performance des requêtes et tableaux de bord au fil du temps. Les startups devraient définir des politiques de rétention par niveaux par classe de télémétrie -- par exemple, des données haute résolution à court terme pour la réponse aux incidents, des métriques sous-échantillonnées ou agrégées pour l'analyse de tendances à long terme, et des règles de cycle de vie pour archiver ou purger les données obsolètes conformément aux exigences réglementaires, opérationnelles et de coût.
