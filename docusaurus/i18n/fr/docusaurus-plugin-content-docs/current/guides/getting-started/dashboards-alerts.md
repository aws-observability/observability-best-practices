---
sidebar_position: 4
---

# Tableaux de bord et alertes

Une fois que votre télémétrie est en cours de transmission, vous pouvez configurer des tableaux de bord et des alertes pertinents pour votre cas d'utilisation.

## Tableaux de bord prédéfinis

Assurez-vous de tirer parti des tableaux de bord prédéfinis que vous pouvez trouver dans différentes parties de la console CloudWatch.

Par exemple, vous trouverez des tableaux de bord automatisés pour de nombreux services (tels que Lambda, EC2, API Gateway, et bien d'autres) sous Dashboards.

Si vous utilisez Application Signals, vous trouverez des cartes d'application et des tableaux de bord sous Application Signals (APM). De plus, vous trouverez les services non instrumentés qui mettront en évidence les lacunes en matière d'observabilité.

## Tableaux de bord personnalisés

Vous devrez également concevoir vos propres tableaux de bord spécifiques à votre activité. Consultez ce guide sur la conception de vos tableaux de bord pour l'excellence opérationnelle : [Building Dashboards for Operational Visibility](https://aws.amazon.com/builders-library/building-dashboards-for-operational-visibility/)

## Alarmes CloudWatch

Vous créerez également des alertes (ou Alarmes dans CloudWatch) pour signaler tout problème avec vos services et votre infrastructure. Vous pouvez créer des alarmes dans votre compte de surveillance pour une visibilité centralisée des alarmes ou/et des alarmes individuelles dans les comptes locaux.

### Recommandations d'alarmes

Si vous ne savez pas par où commencer, les recommandations d'alarmes vous aideront. Les recommandations d'alarmes sont basées sur les bonnes pratiques de surveillance. Examinez les configurations d'alarmes recommandées avant de créer une alarme.

Pour plus de détails, consultez [Alarm recommendations for AWS services](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html).

## Objectifs de niveau de service (SLOs)

Vous pouvez également créer des SLOs et des alarmes associées pour vous aider à suivre les KPIs importants.

Pour plus d'informations, consultez [CloudWatch SLOs](../../tools/slos.md).

## Résumé

Ceci conclut le guide de démarrage sur CloudWatch. Voici les étapes que nous avons couvertes :

1. **Configurer les comptes de surveillance et sources** – Configuration de l'observabilité inter-comptes pour centraliser les données de télémétrie provenant de plusieurs comptes et régions AWS
2. **Configurer le magasin de données unifié** – Centralisation des données de journaux dans un seul compte et une seule région pour une interrogation et une analyse unifiées
3. **Configurer les agents/collecteurs** – Déploiement des agents CloudWatch et/ou des collecteurs OpenTelemetry pour envoyer la télémétrie depuis vos applications et votre infrastructure
4. **Tableaux de bord et alertes** – Création de tableaux de bord pour la visibilité et d'alarmes pour surveiller la santé de vos services

## Étapes suivantes

Pour des conseils plus approfondis sur des sujets spécifiques, consultez les sections détaillées tout au long de ce guide de bonnes pratiques :

- [Conteneurs (ECS/EKS)](../containers/aws-native/eks/amazon-cloudwatch-container-insights.md)
- [Serverless](../serverless/aws-native/lambda-based-observability.md)
- [Guides opérationnels](../operational/observability-driven-dev.md)
- [Optimisation des coûts](../cost/cost-visualization/cost.md)
- [Collecte de signaux](../signal-collection/emf.md)
