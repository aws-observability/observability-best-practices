# Ingénieurs en fiabilité de site (SRE)

L'ingénierie de la fiabilité de site (SRE) est une pratique d'ingénierie logicielle qui se concentre sur l'amélioration de la fiabilité et des performances des systèmes logiciels. L'un des objectifs clés du SRE est d'améliorer la fiabilité des systèmes logiciels dans des domaines tels que la disponibilité, les performances, la latence, l'efficacité, la capacité et la réponse aux incidents. Parmi les métriques que les équipes SRE mesurent pour valider leurs objectifs, on trouve les accords de niveau de service (SLA), les objectifs de niveau de service (SLO), les indicateurs de niveau de service (SLI) et les budgets d'erreur.

Voici les domaines d'intervention SRE et les meilleures pratiques pour guider votre stratégie d'observabilité.

## Réponse aux incidents et gestion de crise
La réponse aux incidents comprend la surveillance, la détection et la réaction aux événements ou interruptions non planifiés avec pour objectif de minimiser le temps moyen de résolution d'un incident (MTTR) et de satisfaire les accords de niveau de service (SLA).

### Quelques meilleures pratiques autour de la réponse aux incidents et de la gestion de crise sont :
- La détection, la réponse et le confinement rapides sont cruciaux pour garantir que l'incident est atténué en un minimum de temps et que tout impact supplémentaire est évité.

- Construire un système d'astreinte robuste avec la rationalisation des plannings d'astreinte et l'incorporation de runbooks opérationnels pour une atténuation efficace des incidents.

- Construire un processus efficace d'analyse post-incident. Une analyse des causes racines devrait typiquement inclure les éléments suivants :

    - Analyse d'impact - Identifier quels systèmes, processus internes et utilisateurs finaux ont été impactés par cet incident ainsi que l'impact financier éventuel que cela a pu causer.

    - Cause racine et résolution - Effectuer une analyse des causes racines de l'événement et identifier les opportunités de mise en place de garde-fous pour éviter la récurrence du scénario à l'avenir.

    - Surveillance et alarmes - Identifier si les seuils de métriques et d'alarmes qui ont été configurés signalent les bons signaux et s'il existe une opportunité de prévention d'un incident potentiel.

    - Actions et apprentissages - Assigner des propriétaires aux actions et en assurer le suivi. Il est important d'établir un mécanisme de retour d'information dans lequel les apprentissages de l'incident sont incorporés dans le cycle de vie du produit pour éviter les défaillances futures.

## Objectifs de niveau de service et métriques clés

 Les SLI (Service Level Indicators) sont les mesures/métriques réelles. Exemples : temps de réponse en millisecondes, pourcentage de disponibilité du système, taux d'erreur par million de requêtes, débit en requêtes par seconde, utilisation des ressources (CPU, mémoire, etc.)

 Les SLO (Service Level Objectives) sont les objectifs cibles définis à l'aide des SLI. Ils définissent ce que signifie un « bon service ». Par exemple : 95 % des requêtes se termineront en moins de 200 ms, 99,9 % de disponibilité par mois, taux d'erreur inférieur à 0,1 % sur 30 jours. La relation entre les SLI et les SLO peut être définie comme suit :

         SLI (métrique) + Cible + Fenêtre temporelle = SLO
         Exemple : Temps de réponse (SLI) + Moins de 200 ms + Mesuré sur 30 jours = SLO



#### Meilleures pratiques pour les SLI et SLO
- Établir un cadre SMART pour les SLO
    - Spécifique : Métrique et seuil clairs (« temps de réponse inférieur à 200 ms »).
    - Mesurable : Peut être suivi avec des outils de surveillance.
    - Atteignable : Réaliste compte tenu des capacités du système.
    - Pertinent : Important pour l'expérience utilisateur.
    - Temporellement défini : Mesuré sur une période définie (par ex. 30 jours).

- Choisir des SLI qui impactent directement l'expérience utilisateur.

- Définir des objectifs SLO réalistes basés sur les besoins métier.

- Surveillance régulière et ajustement.

- Documentation et communication claires.

- Avoir différents SLO pour différents niveaux de service si nécessaire.

- Identifier les métriques clés telles que :

    - Latence : Mesurer le temps nécessaire pour qu'un système réponde à une requête, en suivant à la fois les latences de succès et d'erreur.
    - Trafic : Surveiller le volume de requêtes ou de données passant par le système pour comprendre les patterns d'utilisation et les besoins de mise à l'échelle.
    - Erreurs : Suivre la fréquence et les types d'erreurs survenant dans le système.
    - Saturation : Surveiller l'utilisation des ressources critiques comme le CPU et la mémoire pour identifier les goulots d'étranglement potentiels.


Voici un exemple de document SLO :

    Service: User Authentication API
    SLO: 99.9% of authentication requests will complete in under 500ms
    Measurement Window: Rolling 30-day period
    SLI: Response time measured at server
    Exclusions: Planned maintenance windows



## Planification de capacité et mise à l'échelle
La planification de capacité et la préparation aux événements sont des éléments essentiels pour assurer la fiabilité du système.

#### Quelques meilleures pratiques sont :

- Implémenter un calendrier d'événements complet qui inclura des composants clés tels que les patterns de trafic utilisateur attendus, la distribution géographique des utilisateurs, les régions AWS cibles, les heures de pointe de l'événement, etc.

- Effectuer des tests de préparation aux événements qui incluront la validation de la mise à l'échelle du système, le benchmarking des performances et les tests de seuils de capacité.

- Valider les mécanismes de basculement tels que les procédures de sauvegarde et de restauration, les runbooks de basculement de région, les protocoles de réponse aux incidents, les procédures d'atténuation.


## Automatisation et scripting pour la gestion d'infrastructure
 L'automatisation est clé pour un fonctionnement efficace de l'infrastructure. L'automatisation crée une infrastructure plus fiable, évolutive et efficace tout en libérant les équipes pour se concentrer sur les initiatives stratégiques plutôt que sur la maintenance de routine. Parmi les avantages de l'automatisation :

* Fiabilité améliorée des systèmes avec peu ou pas d'intervention humaine.

* Évolutivité améliorée permettant à l'application de se mettre à l'échelle automatiquement en fonction du trafic et de la demande.

* Résolution d'incidents rapide et automatisée, taux d'erreur réduits et MTBF (Mean Time Between Failures) amélioré.

* Coûts opérationnels réduits et meilleure utilisation des ressources.

#### Quelques stratégies clés d'automatisation incluent :

* Implémentation de l'Infrastructure as Code (IaC) avec le contrôle de version des changements d'infrastructure.

* Intégration continue / Déploiement continu (CI/CD) incluant les tests automatisés et les capacités de rollback.

* Systèmes auto-réparateurs avec des vérifications de santé intégrées et une récupération automatique.


## Stratégies de surveillance et d'alerte pour les équipes SRE
Une surveillance et des alertes efficaces sont cruciales pour que les équipes d'ingénierie de la fiabilité de site (SRE) puissent assurer de manière proactive la fiabilité et les performances des applications distribuées basées sur des microservices. Surveiller un système distribué avec potentiellement des centaines de microservices peut être un défi. Quelle que soit la complexité de l'architecture, nous devons commencer par identifier les métriques clés et travailler à rebours à partir de l'impact qu'elles ont sur les performances de l'application et l'expérience utilisateur.

#### Collecter une télémétrie complète
- S'assurer que les données de télémétrie collectées fournissent des informations suffisantes sur la santé et les performances de chaque composant d'architecture. Évaluer continuellement la pertinence et l'exploitabilité des données collectées.

#### Stratégie d'alerte

- Définir des alertes actionnables - Les alertes générées à partir des données de télémétrie doivent être actionnables, permettant aux équipes SRE d'identifier et de répondre rapidement aux problèmes. Les alertes doivent être basées sur des seuils et des patterns significatifs et prédictifs de problèmes potentiels.

- Optimiser le routage et l'escalade des alertes - Implémenter un processus bien défini de routage et d'escalade des alertes pour garantir que les bonnes équipes et personnes sont notifiées des problèmes critiques. Revoir et affiner continuellement le routage des alertes pour améliorer la réactivité et minimiser la fatigue d'alerte.

#### Tableaux de bord et visualisation

- Créer des tableaux de bord complets - Développer des tableaux de bord qui fournissent une vue holistique de l'état de l'application, incluant les métriques opérationnelles clés, les données de planification de coûts et de capacité, et la santé de l'infrastructure. S'assurer que les tableaux de bord incluent des seuils et des indicateurs qui peuvent efficacement prédire et prévenir les problèmes.

- Permettre la prise de décision basée sur les données - Utiliser les informations obtenues à partir des tableaux de bord pour informer les processus de prise de décision basés sur les données, tels que la planification de capacité, l'optimisation des performances et les stratégies de réponse aux incidents.


## Lignes directrices pour l'ingénierie du chaos et l'expérimentation

L'objectif de l'ingénierie du chaos est de tester la fiabilité de l'application et de comprendre comment une application répond à des événements perturbateurs tels que des pannes, des pics soudains de trafic et d'autres événements externes. L'ingénierie du chaos aide les équipes à évaluer les goulots d'étranglement de performance, le comportement de l'application et à implémenter des stratégies pour remédier aux défaillances dans un scénario réel.

### Meilleures pratiques autour de l'ingénierie du chaos

- Commencer petit et augmenter progressivement la complexité - Cela inclut la construction d'une hypothèse (par ex., si le trafic sur l'application augmente de 30 %, comment se comportera-t-elle),

- Définir un état stable.

- Introduire des défaillances par des expériences.

- Observer le comportement du système et prendre des actions correctives de résilience.

- Implémenter une surveillance robuste - Pour une ingénierie du chaos efficace, assurez-vous de collecter les données de télémétrie pertinentes telles que les logs, les métriques, les traces, etc.

- Toujours avoir un plan de rollback - Intégrer l'ingénierie du chaos dans le pipeline CI/CD vous permet d'automatiser et de tester vos plans de rollback.

- Apprendre de chaque expérience, documenter les résultats, améliorer la résilience du système et intégrer l'ingénierie du chaos dans votre cycle de développement.

En implémentant systématiquement ces pratiques d'ingénierie du chaos, les organisations peuvent significativement améliorer la résilience de leurs systèmes, réduire les temps d'arrêt inattendus et construire des services plus fiables. Rappelez-vous, l'objectif n'est pas de créer le chaos, mais de construire des systèmes capables de résister à des conditions chaotiques.


## Références
- [AWS Observability Workshop](https://catalog.workshops.aws/observability/en-US)
- [AWS Observability Best Practices](https://aws-observability.github.io/observability-best-practices/)
- [Amazon CloudWatch Intelligent Operations](https://aws.amazon.com/cloudwatch/features/intelligent-operations/)
- [Resilience analysis framework](https://docs.aws.amazon.com/prescriptive-guidance/latest/resilience-analysis-framework/introduction.html)
- [Chaos Engineering with AWS Fault Injection Simulator](https://aws.amazon.com/blogs/architecture/chaos-testing-with-aws-fault-injection-simulator-and-aws-codepipeline/)
