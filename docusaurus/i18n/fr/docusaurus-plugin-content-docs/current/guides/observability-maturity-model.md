# Modèle de maturité de l'observabilité AWS

## Introduction

À sa base, l'observabilité est la capacité de comprendre et d'obtenir des informations sur l'état interne d'un système en analysant ses sorties externes. Ce concept a évolué depuis les approches de surveillance traditionnelles qui se concentrent sur des métriques ou événements prédéfinis, vers une approche plus holistique qui englobe la collecte, l'analyse et la visualisation des données générées par les différents composants d'un environnement. Un système ne peut être contrôlé ou optimisé que s'il est observé. Une stratégie d'observabilité efficace permet aux équipes d'identifier et de résoudre rapidement les problèmes, d'optimiser l'utilisation des ressources et d'obtenir des informations sur la santé globale de leurs systèmes. L'observabilité donne la capacité de détecter, d'investiguer et de remédier efficacement aux problèmes, ce qui peut et devrait améliorer la disponibilité opérationnelle globale et la santé des charges de travail.

![Pourquoi l'observabilité](../images/Why_is_Observability_Important.png)

La différence entre la surveillance et l'observabilité est que la surveillance indique si un système fonctionne ou non, tandis que l'observabilité indique pourquoi le système ne fonctionne pas. La surveillance est généralement une mesure réactive alors que l'objectif de l'observabilité est de pouvoir améliorer vos indicateurs clés de performance (KPI) de manière proactive. La surveillance et l'observabilité continues augmentent l'agilité, améliorent l'expérience client et réduisent les risques dans l'environnement cloud.

## Modèle de maturité de l'observabilité

Le modèle de maturité de l'observabilité sert de cadre essentiel pour les organisations cherchant à optimiser l'observabilité et les processus de gestion de leurs charges de travail. Ce modèle fournit une feuille de route complète pour que les entreprises puissent évaluer leurs capacités actuelles, identifier les domaines d'amélioration et investir stratégiquement dans les bons outils et processus pour atteindre une observabilité optimale. À l'ère du cloud computing, des microservices, des systèmes éphémères et distribués, l'observabilité est devenue un facteur critique pour assurer la fiabilité et les performances des services numériques. En fournissant une approche structurée pour améliorer l'observabilité, ce modèle permet aux organisations d'obtenir une compréhension et un contrôle plus profonds de leurs systèmes, ouvrant la voie à une entreprise plus résiliente, efficace et performante.

## Étapes du modèle de maturité de l'observabilité

À mesure que les organisations étendent leurs charges de travail, le modèle de maturité de l'observabilité devrait également mûrir. Cependant, le chemin vers la maturité de l'observabilité ne croît pas toujours avec la charge de travail. L'intention est d'aider les clients à atteindre le niveau de maturité requis à mesure qu'ils étendent et développent leurs capacités organisationnelles.

1.  La première étape du modèle de maturité de l'observabilité implique généralement l'établissement d'une compréhension de base de l'état actuel de l'organisation. Cela implique d'évaluer les outils et processus de surveillance existants, ainsi que d'identifier les lacunes en matière de visibilité ou de fonctionnalité. À cette étape, les organisations peuvent faire le point sur leurs capacités actuelles et fixer des objectifs réalistes d'amélioration en commençant même aux premières phases du cycle d'ingénierie.

2.  À l'étape suivante, les organisations évoluent vers une approche plus sophistiquée en adoptant des stratégies et services d'observabilité avancés. Cela peut inclure la mise en place d'alertes proactives, du traçage distribué pour obtenir des informations sur les interactions entre systèmes disparates, grâce à quoi les organisations peuvent commencer à récolter les bénéfices d'une visibilité accrue, réduire la charge cognitive et améliorer l'efficacité du dépannage.

3.  À mesure que les entreprises progressent à travers la troisième étape du modèle de maturité de l'observabilité, elles peuvent exploiter des capacités supplémentaires telles que la remédiation automatisée, l'intelligence artificielle et les technologies d'apprentissage automatique pour automatiser la détection d'anomalies et l'analyse des causes racines. Ces fonctionnalités avancées permettent aux organisations non seulement de détecter les problèmes mais aussi de prendre des actions correctives avant qu'ils n'impactent les utilisateurs finaux ou ne perturbent les opérations métier. En intégrant les outils d'observabilité avec d'autres systèmes critiques tels que les plateformes de gestion des incidents, les organisations peuvent rationaliser leurs processus de réponse aux incidents et minimiser le temps nécessaire pour résoudre les problèmes.

4.  L'étape finale du modèle de maturité de l'observabilité implique l'exploitation de la richesse des données générées par les outils de surveillance et d'observabilité pour conduire l'amélioration continue. Cela peut impliquer l'utilisation d'analyses avancées pour identifier les patterns et tendances dans les performances des charges de travail, ainsi que la réinjection de ces informations dans les processus d'ingénierie et d'opérations pour optimiser l'allocation des ressources, l'architecture et les stratégies de déploiement.

![Étapes du modèle de maturité de l'observabilité](../images/AWS-Observability-maturity-model.png)

### Étape 1 : Surveillance fondamentale - Collecte des données de télémétrie

Adoptée comme le strict minimum et fonctionnant en silos, la surveillance de base a une stratégie indéfinie de ce qui est nécessaire pour surveiller la totalité des systèmes ou charges de travail d'une organisation. La plupart du temps, différentes équipes comme les propriétaires d'applications, le centre d'opérations réseau (NOC) ou les équipes CloudOps ou DevOps utilisent différents outils pour leurs besoins de surveillance, d'où cette approche a peu de valeur en termes de débogage transversal ou d'optimisation de l'environnement.

Typiquement, les clients à cette étape ont des solutions disparates pour surveiller leurs charges de travail. Différentes équipes, la plupart du temps, collectent les mêmes données de manières différentes puisqu'il n'y a pas ou peu de partenariat avec les autres. Les équipes tendent à optimiser ce dont elles ont besoin en travaillant avec les données qu'elles obtiennent. De plus, les équipes ne peuvent pas utiliser les données des autres car les données obtenues d'une autre équipe pourraient être dans un format dissemblable. Créer un plan pour identifier les charges de travail critiques, viser une solution unifiée pour l'observabilité, définir les métriques et les logs sont des aspects clés à ce niveau. Concevoir votre charge de travail pour capturer la [télémétrie](https://docs.aws.amazon.com/wellarchitected/latest/operational-excellence-pillar/implement-observability.html) essentielle qu'elle fournit est nécessaire pour comprendre son état interne et la [santé de la charge de travail](https://docs.aws.amazon.com/wellarchitected/latest/operational-excellence-pillar/utilizing-workload-observability.html).

Pour construire une fondation vers l'amélioration du niveau de maturité, l'instrumentation des charges de travail par la collecte de métriques, de logs, de traces et l'obtention d'informations significatives en utilisant les bons outils de surveillance et d'observabilité aident les clients à contrôler et optimiser l'environnement. L'instrumentation fait référence à la mesure, au suivi et à la capture de données clés des environnements qui peuvent être utilisées pour observer le comportement et les performances des charges de travail. Les exemples incluent les métriques applicatives telles que les erreurs, les transactions réussies ou non, et les métriques d'infrastructure telles que l'utilisation du CPU et des ressources de disque.

### Étape 2 : Surveillance intermédiaire - Analyse et informations de télémétrie

À cette étape, les clients voient leurs organisations devenir plus claires en termes de collecte de signaux provenant de divers environnements comme le sur site et le cloud. Ils ont élaboré des mécanismes pour collecter les métriques, les logs et les traces des charges de travail car ceux-ci forment la structure fondamentale de l'observabilité, créé des visualisations, des stratégies d'alerte et ont également la capacité de prioriser les problèmes basés sur des critères bien définis. Au lieu d'être réactifs et de deviner, les clients ont un workflow qui invoque les actions requises et les équipes pertinentes sont capables d'analyser et de dépanner sur la base des informations capturées et des connaissances historiques. Les clients à ce niveau travaillent à accomplir les pratiques d'observabilité de leurs environnements qui pourraient être traditionnels ou modernes, hautement évolutifs, distribués, agiles et en architecture de microservices.

![Piliers de l'observabilité](../images/three-pillars.png)

Bien que la surveillance semble fonctionner correctement dans la plupart des cas, les organisations tendent à passer plus de temps à déboguer les problèmes et par conséquent le temps moyen de résolution (MTTR) global n'est pas cohérent ou significativement amélioré sur une période de temps. De plus, il y a un temps cognitif et un effort plus élevés que prévu pour déboguer les problèmes, d'où une réponse aux incidents plus longue. Il tend à y avoir une situation de surcharge de données qui submerge également les opérations. Nous trouvons que la plupart des entreprises sont bloquées à cette étape sans réaliser où elles pourraient aller ensuite. Les actions spécifiques qui peuvent être prises pour amener l'organisation au niveau suivant sont : 1) Revoir les conceptions d'architecture de vos systèmes à intervalles réguliers et déployer des politiques et pratiques pour réduire l'impact et les temps d'arrêt menant à moins d'alertes. 2) Prévenir la fatigue d'alerte en définissant des [KPI](https://aws-observability.github.io/observability-best-practices/guides/operational/business/key-performance-indicators/) actionnables, en ajoutant un contexte précieux aux résultats d'alerte, en catégorisant par sévérité/urgence, en envoyant à différents outils et équipes pour aider les ingénieurs à résoudre les problèmes plus rapidement.

Analysez ces alertes de manière régulière et automatisez la remédiation pour les alertes communes et répétées. Partagez et communiquez les résultats d'alerte avec les équipes pertinentes pour fournir un retour d'information sur l'amélioration opérationnelle et des processus.

Développez un plan pour construire progressivement un graphe de connaissances qui vous aide à corréler différentes entités et à comprendre les dépendances entre les différentes parties d'un système. Il permet aux clients de visualiser l'impact des changements sur un système, aidant à prédire et atténuer les problèmes potentiels.

### Étape 3 : Observabilité avancée - Corrélation et détection d'anomalies

À cette étape, les organisations sont capables de comprendre clairement la cause racine des problèmes sans avoir à passer beaucoup de temps en dépannage. Lorsqu'un problème survient, les alertes fournissent suffisamment d'informations contextuelles aux équipes pertinentes comme le centre d'opérations réseau (NOC) ou les équipes CloudOps ou DevOps. L'équipe de surveillance est capable de regarder une alerte et de déterminer immédiatement la cause racine du problème par la corrélation des signaux comme les métriques, les logs ainsi que les traces. Les traces sont des données collectées de votre application sur les requêtes qui peuvent être utilisées avec des outils pour visualiser, filtrer et obtenir des informations pour identifier les problèmes et les opportunités d'optimisation. Les requêtes tracées de votre application fournissent des informations détaillées non seulement sur la requête et la réponse, mais aussi sur les appels que votre application fait aux ressources AWS en aval, aux microservices, aux bases de données et aux API web. Ils peuvent regarder une trace, trouver les événements de log correspondants au fur et à mesure que les traces sont capturées et aussi regarder les métriques de l'infrastructure et des applications en obtenant une vue à 360° de la situation dans laquelle ils se trouvent.

Les équipes appropriées peuvent prendre des actions de remédiation immédiatement en fournissant un correctif qui résout le problème. Dans ce scénario, le MTTR est très petit, les objectifs de niveau de service (SLO) sont au vert, et le taux de consommation du budget d'erreur est tolérable. Typiquement, les clients à ce niveau ont accompli les pratiques d'observabilité de leurs environnements modernes, agiles, hautement évolutifs et de microservices.

Il y a de nombreuses organisations qui ont atteint ce niveau de sophistication et de maturité dans leurs environnements d'observabilité. Cette étape donne déjà aux organisations la capacité de supporter une infrastructure complexe, d'opérer leurs systèmes avec une haute disponibilité, de fournir une plus haute disponibilité de niveau de service (SLA) pour leurs applications et d'atteindre l'innovation métier en fournissant une infrastructure fiable. Les clients utilisent également des détecteurs d'anomalies pour surveiller les anomalies et les valeurs aberrantes qui ne correspondent pas aux patterns habituels et disposent de mécanismes d'alerte en quasi temps réel.

Cependant, les équipes dans ces organisations veulent toujours aller au-delà de l'art du possible. Les équipes voudraient comprendre les problèmes récurrents, créer une base de connaissances qu'elles peuvent utiliser pour modéliser des scénarios afin de prédire les problèmes qui pourraient survenir à l'avenir. C'est alors que les clients passent à l'étape suivante du modèle de maturité, dans laquelle ils obtiennent des informations sur l'inconnu. Pour y arriver, de nouveaux outils sont nécessaires et aussi de nouvelles compétences et techniques pour stocker et utiliser les données doivent être identifiées. On peut utiliser l'intelligence artificielle pour les opérations IT (AIOps) pour créer des systèmes qui corrèlent automatiquement les signaux, identifient la cause racine, créent des plans de résolution basés sur des modèles entraînés en utilisant les données collectées dans le passé.

![Observabilité avec AIOps](../images/o11y4AIOps.png)

### Étape 4 : Observabilité proactive - Identification automatique et proactive des causes racines

Ici, les données d'observabilité ne sont pas seulement utilisées « après » qu'un problème survient, mais utilisent les données en temps réel « avant » qu'un problème survienne. En utilisant des modèles bien entraînés, les identifications de problèmes sont faites de manière proactive et les résolutions sont accomplies plus facilement et simplement. En analysant les signaux collectés, le système de surveillance est capable de fournir automatiquement des informations sur le problème et également de présenter des option(s) de résolution pour résoudre le problème.

Les fournisseurs de logiciels d'observabilité étendent continuellement leurs capacités dans cet espace et cela n'a fait que s'accélérer avec la popularisation de l'IA générative, de sorte que les organisations aspirant à atteindre un tel niveau de maturité peuvent l'accomplir avec facilité. Une fois cette étape mûrie et prenant forme, les clients voient une situation où les services d'observabilité sont capables de créer automatiquement des tableaux de bord dynamiques. Les tableaux de bord ne peuvent contenir que les informations pertinentes pour le problème en cours. Cela économisera du temps et des coûts dans l'interrogation et la visualisation de données qui ne comptent pas vraiment. Avec l'IA générative (GenAI) et le calcul pour effectuer l'apprentissage automatique démocratisés jour après jour, nous pourrions voir les capacités de surveillance proactive devenir plus courantes à l'avenir qu'elles ne le sont maintenant.

Un aperçu du portefeuille d'observabilité fournissant une image holistique, avec diverses solutions natives AWS et open source pour la collecte de données, le traitement des données, les informations et l'analyse de données que les clients peuvent utiliser en choisissant les solutions appropriées pour leurs besoins d'observabilité de bout en bout.

![Stack d'observabilité AWS](../images/AWS_O11y_Stack.png)

## AWS Well-Architected et Cloud Adoption Framework pour l'observabilité

Les organisations peuvent exploiter [AWS Well-Architected](https://aws.amazon.com/architecture/well-architected/) et le [Cloud Adoption Framework](https://docs.aws.amazon.com/whitepapers/latest/aws-caf-operations-perspective/observability.html) pour améliorer leurs capacités d'observabilité et surveiller et dépanner efficacement leur environnement cloud.

AWS Well-Architected et le Cloud Adoption Framework pour l'observabilité fournissent une approche structurée pour la conception, le déploiement et l'exploitation des charges de travail, assurant que les meilleures pratiques sont suivies. Cela conduit à une meilleure disponibilité, des performances système améliorées, une évolutivité et une fiabilité accrues. Ces cadres fournissent également aux organisations un ensemble standardisé de pratiques et des conseils prescriptifs, facilitant la collaboration, le partage de connaissances et l'implémentation de solutions cohérentes à travers l'organisation.

Pour exploiter efficacement, les organisations doivent comprendre les composants clés appelés les piliers ([excellence opérationnelle](https://docs.aws.amazon.com/wellarchitected/latest/framework/operational-excellence.html), sécurité, [fiabilité](https://docs.aws.amazon.com/wellarchitected/latest/framework/reliability.html), [efficacité des performances](https://docs.aws.amazon.com/wellarchitected/latest/framework/performance-efficiency.html), optimisation des coûts et durabilité) du cadre AWS Well-Architected, qui fournissent une approche holistique pour la conception et l'exploitation de l'environnement cloud. D'autre part, le Cloud Adoption Framework fournit une approche structurée de l'adoption du cloud, se concentrant sur des domaines tels que l'entreprise, les personnes, la gouvernance et la plateforme. En alignant ces composants avec les exigences d'observabilité, les organisations peuvent construire des charges de travail robustes et évolutives.

L'implémentation des cadres AWS Well-Architected et Cloud Adoption pour l'observabilité implique quelques étapes. Premièrement, les organisations doivent évaluer leur état actuel et identifier les domaines d'amélioration. Cela peut être fait en effectuant une évaluation du modèle de maturité de l'observabilité, qui évalue les charges de travail par rapport à ces cadres. Sur la base des résultats de l'évaluation, les organisations peuvent prioriser et planifier leurs initiatives d'observabilité. Cela inclut la définition des exigences de surveillance et de journalisation, la sélection des services AWS appropriés, et l'implémentation de l'infrastructure et des outils nécessaires. Enfin, les organisations doivent surveiller et optimiser en continu leurs solutions d'observabilité pour assurer une efficacité continue.

De plus, les clients peuvent utiliser l'[outil AWS Well-Architected](https://aws.amazon.com/well-architected-tool/) qui est un service dans AWS pour documenter et mesurer leur charge de travail en utilisant les meilleures pratiques du cadre AWS Well-Architected. Cet outil fournit un processus cohérent pour mesurer leurs charges de travail à travers les piliers du cadre AWS Well-Architected, aidant à documenter les décisions qu'ils prennent, fournissant des recommandations pour améliorer leurs charges de travail, et les guidant pour rendre leurs charges de travail plus fiables, sécurisées, efficaces et rentables.

## Évaluation

L'évaluation du modèle de maturité de l'observabilité peut être utilisée pour évaluer votre état actuel d'observabilité et identifier les domaines d'amélioration. Une évaluation de chaque étape implique l'évaluation des pratiques de surveillance et de gestion existantes à travers les différentes équipes, l'identification des lacunes et des domaines d'amélioration, et la détermination de la préparation globale pour l'étape suivante est impérative. Une évaluation de maturité commence par l'esquisse des processus métier, l'inventaire des charges de travail et la découverte des outils, l'identification des défis actuels et la compréhension des priorités et objectifs organisationnels.

L'évaluation aide à identifier les métriques et KPI ciblés qui posent les fondations pour le développement et l'optimisation ultérieurs de la disposition existante. L'évaluation de votre modèle de maturité de l'observabilité joue un rôle crucial pour s'assurer que votre entreprise est préparée à gérer la nature complexe et dynamique des systèmes modernes. Elle aide à identifier les angles morts et les zones de faiblesse qui pourraient potentiellement conduire à des défaillances du système ou des problèmes de performance.

De plus, des évaluations régulières garantissent que votre entreprise reste agile et adaptable. Cela vous permet de suivre le rythme des technologies et méthodologies en évolution, garantissant ainsi que vos systèmes sont toujours au sommet de l'efficacité et de la fiabilité.

L'évaluation est conçue pour vous aider à examiner l'état de votre stratégie d'observabilité par rapport aux meilleures pratiques AWS, identifier les opportunités d'amélioration et suivre les progrès au fil du temps. Les questions ci-dessous devraient vous aider à évaluer votre niveau actuel de maturité d'observabilité. Pour faire réaliser une évaluation en utilisant notre outil « AWS Observability Maturity Model Assessment » sans frais pour vous, veuillez contacter votre équipe de compte AWS.

**Logs**

1. Comment collectez-vous les logs ?
2. Comment utilisez-vous les logs ?
3. Comment accédez-vous aux logs ?
4. Quelle est votre politique de rétention des logs pour la conformité sécuritaire et réglementaire ?
5. Utilisez-vous aujourd'hui des capacités ML/IA ?

**Métriques**

6. Quels types de métriques collectez-vous ?
7. Comment utilisez-vous les métriques ?
8. Comment accédez-vous aux métriques ?

**Traces**

9. Comment collectez-vous les traces ?
10. Comment utilisez-vous les traces ?

**Tableaux de bord et alertes**

11. Comment utilisez-vous les alarmes ?
12. Comment utilisez-vous les tableaux de bord ?

**Organisation**

13. Avez-vous une stratégie d'observabilité d'entreprise ?
14. Comment utilisez-vous les SLO ?

## Construire la stratégie d'observabilité

Une fois que l'organisation a identifié son étape d'observabilité, elle devrait commencer à construire la stratégie pour optimiser les processus et outils actuels et également commencer à travailler vers la maturité. Les organisations veulent s'assurer que leurs clients ont une excellente expérience client, donc elles commencent par ces exigences client et travaillent à rebours à partir de là. Ensuite, travaillez avec vos parties prenantes car elles comprennent très bien ces exigences. Avec l'objectif d'une stratégie d'observabilité, les organisations doivent d'abord définir leurs objectifs d'observabilité car ils doivent être alignés avec les objectifs métier globaux et doivent clairement articuler ce que l'organisation vise à atteindre à travers la stratégie, fournissant une feuille de route pour construire et implémenter le plan d'observabilité.

Ensuite, les organisations doivent identifier les métriques clés (KPI) qui fourniront des informations sur les performances du système. Celles-ci pourraient aller de la latence et des taux d'erreur à l'utilisation des ressources et aux volumes de transactions. Il est important de noter que le choix des métriques dépendra largement de la nature de l'entreprise et de ses besoins spécifiques.

Une fois les métriques clés identifiées, les organisations peuvent alors décider des outils et technologies nécessaires pour la collecte de données. Le choix de l'outil devrait être basé sur son alignement avec les objectifs de l'organisation, sa facilité d'intégration avec les systèmes existants, l'optimisation des coûts, l'atteinte de l'évolutivité, la satisfaction des besoins des clients et l'amélioration de l'expérience client globale.

Enfin, les organisations devraient également encourager une culture qui valorise l'observabilité. Cela implique de former les membres de l'équipe sur l'importance de l'observabilité, de les encourager à surveiller proactivement les performances du système, et de favoriser une culture d'apprentissage continu et d'amélioration. Cette stratégie crée un cycle vertueux de processus continu de collecte, d'action et d'amélioration pour la meilleure expérience client possible.

![Cycle vertueux de l'observabilité](../images/o11y-virtuous-cycle.png)

En résumé, pour construire une stratégie d'observabilité, les trois aspects principaux à considérer sont : 1) ce qui doit être collecté, 2) quels sont tous les systèmes et charges de travail qui doivent être observés et 3) comment réagir lorsqu'il y a des problèmes et quels mécanismes doivent être en place pour les remédier.

## Conclusion

Le modèle de maturité de l'observabilité sert de feuille de route pour les organisations pour évaluer leur état actuel et chercher des moyens d'améliorer leur capacité à comprendre, analyser et répondre au comportement des charges de travail et de l'infrastructure. En suivant une approche structurée pour évaluer les capacités actuelles, adopter des techniques de surveillance avancées et exploiter des informations basées sur les données, les entreprises peuvent atteindre un niveau supérieur d'observabilité et prendre des décisions plus éclairées sur leurs charges de travail et infrastructure. Ce modèle décrit les capacités et pratiques clés que les organisations doivent développer pour progresser à travers les différents niveaux de maturité, atteignant finalement un état où elles peuvent pleinement exploiter les bénéfices de l'observabilité proactive.

## Ressources utiles

- [Building an effective observability strategy](https://youtu.be/7PQv9eYCJW8?si=gsn0qPyIMhrxU6sy) - AWS re:Invent 2023
- [AWS Observability Best Practices](https://aws-observability.github.io/observability-best-practices/)
- [What is observability and Why does it matter?](https://aws.amazon.com/blogs/mt/what-is-observability-and-why-does-it-matter-part-1/)
- [How to develop an Observability strategy?](https://aws.amazon.com/blogs/mt/how-to-develop-an-observability-strategy/)
- [Guidance for Deep Application Observability on AWS](https://aws.amazon.com/solutions/guidance/deep-application-observability-on-aws/)
- [How Discovery increased operational efficiency with AWS observability](https://www.youtube.com/watch?v=zm30JNYmxlY) - AWS re:Invent 2022
- [Developing an observability strategy](https://www.youtube.com/watch?v=Ub3ATriFapQ) - AWS re:Invent 2022
- [Explore Cloud Native Observability with AWS](https://www.youtube.com/watch?v=UW7aT25Mbng) - AWS Virtual Workshop
- [Increase availability with AWS observability solutions](https://www.youtube.com/watch?v=_d_9xCfVBTM) - AWS re:Invent 2020
- [Observability best practices at Amazon](https://www.youtube.com/watch?v=zZPzXEBW4P8) - AWS re:Invent 2022
- [Observability: Best practices for modern applications](https://www.youtube.com/watch?v=YiegAlC_yyc) - AWS re:Invent 2022
- [Observability the open-source way](https://www.youtube.com/watch?v=2IJPpdp9xU0) - AWS re:Invent 2022
- [Elevate your Observability Strategy with AIOps](https://www.youtube.com/watch?v=L4b_eDSAwfE)
- [Let's Architect! Monitoring production systems at scale](https://aws.amazon.com/blogs/architecture/lets-architect-monitoring-production-systems-at-scale/)
- [Full-stack observability and application monitoring with AWS](https://www.youtube.com/watch?v=or7uFFyHIX0) - AWS Summit SF 2022
