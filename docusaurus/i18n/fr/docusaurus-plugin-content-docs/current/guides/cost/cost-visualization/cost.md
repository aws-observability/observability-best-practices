# Services AWS Observability et coûts

Lorsque vous investissez dans votre stack Observability, il est important de surveiller le **coût** de vos produits d'observabilité de manière régulière. Cela vous permet de vous assurer que vous n'engagez que les coûts nécessaires et que vous ne dépensez pas trop pour des ressources dont vous n'avez pas besoin.

## Outils AWS pour l'optimisation des coûts

L'objectif principal de la plupart des organisations est de faire évoluer leur infrastructure informatique dans le cloud, et elles sont généralement incontrôlées, non préparées et ignorantes de leurs dépenses cloud réelles ou à venir. Pour vous aider à suivre, rapporter et analyser les coûts au fil du temps, AWS fournit plusieurs outils d'optimisation des coûts :

[AWS Cost Explorer][cost-explorer] – Visualisez les tendances de dépenses AWS au fil du temps, projetez les coûts futurs, identifiez les domaines nécessitant une investigation plus approfondie, observez l'utilisation des instances réservées, observez la couverture des instances réservées et recevez des recommandations d'instances réservées.

[AWS Cost and Usage Report (CUR)][CUR] – Fichiers de données brutes granulaires détaillant votre utilisation AWS horaire à travers les comptes, utilisés pour une analyse en libre-service (DIY). L'AWS Cost and Usage Report dispose de colonnes dynamiques qui se remplissent en fonction des services que vous utilisez.

## Vue d'ensemble de l'architecture : Visualisation de l'AWS Cost and Usage Report

Vous pouvez créer des tableaux de bord de coût et d'utilisation AWS dans Amazon Managed Grafana ou Amazon QuickSight. Le diagramme d'architecture suivant illustre les deux solutions.

![Architecture diagram](../../../images/cur-architecture.png)
*Diagramme d'architecture*

## Cloud Intelligence Dashboards

Les [Cloud Intelligence Dashboards][cid] sont une collection de tableaux de bord [Amazon QuickSight][quicksight] construits sur l'AWS Cost and Usage Report (CUR). Ces tableaux de bord fonctionnent comme votre propre outil de gestion et d'optimisation des coûts (FinOps). Vous obtenez des tableaux de bord approfondis, granulaires et orientés par des recommandations qui peuvent vous aider à obtenir une vue détaillée de votre utilisation et de vos coûts AWS.

### Implémentation

1.	Créez un [rapport CUR][cur-report] avec l'intégration [Amazon Athena][amazon-athnea] activée.
*Lors de la configuration initiale, il peut falloir jusqu'à 24 heures pour qu'AWS commence à livrer les rapports dans votre bucket Amazon S3. Les rapports sont livrés une fois par jour. Pour rationaliser et automatiser l'intégration de vos Cost and Usage Reports avec Athena, AWS fournit un modèle AWS CloudFormation avec plusieurs ressources clés en plus des rapports que vous avez configurés pour l'intégration Athena.*

2.	Déployez le [modèle AWS CloudFormation][cloudformation].
*Ce modèle inclut un crawler AWS Glue, une base de données AWS Glue et un événement AWS Lambda. À ce stade, les données CUR sont disponibles via des tables dans Amazon Athena pour vos requêtes.*

    - Exécutez des requêtes [Amazon Athena][athena-query] directement sur vos données CUR.
*Pour exécuter des requêtes Athena sur vos données, utilisez d'abord la console Athena pour vérifier si AWS actualise vos données, puis exécutez votre requête dans la console Athena.*

3.	Déployez les Cloud Intelligence Dashboards.
    - Pour un déploiement manuel, consultez le **[laboratoire d'optimisation des coûts][cost-optimization-lab]** AWS Well-Architected.
    - Pour un déploiement automatisé, consultez le [dépôt GitHub][GitHub-repo].

Les Cloud Intelligence Dashboards sont excellents pour les équipes financières, les dirigeants et les responsables informatiques. Cependant, une question courante que nous recevons des clients est comment obtenir des informations sur le coût organisationnel de chaque produit AWS Observability comme Amazon CloudWatch, AWS X-Ray, Amazon Managed Service for Prometheus et Amazon Managed Grafana.

Dans la section suivante, vous approfondirez le coût et l'utilisation de chacun de ces produits. Les entreprises de toute taille peuvent adopter cette approche proactive de stratégie d'optimisation des coûts cloud et améliorer l'efficacité métier grâce à l'analytique des coûts cloud et aux décisions basées sur les données, sans impact sur les performances ni surcharge opérationnelle.


[cost-explorer]: https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/ce-what-is.html
[CUR]: https://docs.aws.amazon.com/cur/latest/userguide/what-is-cur.html
[cid]: https://wellarchitectedlabs.com/cost/200_labs/200_cloud_intelligence/
[quicksight]: https://aws.amazon.com/quicksight/
[cur-report]: https://docs.aws.amazon.com/cur/latest/userguide/cur-create.html
[amazon-athnea]: https://aws.amazon.com/athena/
[cloudformation]: https://docs.aws.amazon.com/cur/latest/userguide/use-athena-cf.html
[athena-query]: https://docs.aws.amazon.com/cur/latest/userguide/cur-ate-run.html
[cost-optimization-lab]: https://www.wellarchitectedlabs.com/cost/200_labs/200_cloud_intelligence/
[GitHub-repo]: https://github.com/aws-samples/aws-cudos-framework-deployment
