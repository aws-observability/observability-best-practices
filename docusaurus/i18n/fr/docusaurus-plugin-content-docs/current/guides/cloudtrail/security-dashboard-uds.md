---
sidebar_position: 2
title: Tableau de bord de visibilité de sécurité utilisant CloudWatch Unified Data Store
---

# Tableau de bord de visibilité de sécurité utilisant CloudWatch Unified Data Store

Amazon CloudWatch [Unified Data Store](https://aws.amazon.com/blogs/aws/amazon-cloudwatch-introduces-unified-data-management-and-analytics-for-operations-security-and-compliance/) fournit un moyen centralisé de découvrir, organiser et interroger vos données de journaux à travers les services AWS sans avoir besoin de connaître les noms individuels des groupes de journaux. Pour rendre cela possible, CloudWatch Unified Data Store utilise des [facettes](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatchLogs-Facets.html) — des champs dans vos données de journaux que CloudWatch met en avant pour le filtrage interactif, le regroupement et l'analyse. Les facettes par défaut comme `@data_source_name`, `@data_source_type` et `@data_format` sont automatiquement disponibles sur tous les groupes de journaux de classe Standard sans aucune configuration requise. Dans la console [CloudWatch Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html), vous pouvez sélectionner des valeurs de facettes pour explorer vos données visuellement, ou les référencer dans vos requêtes pour restreindre efficacement la portée de recherche aux seuls groupes de journaux et événements correspondants.

Grâce à ces facettes, CloudWatch catégorise automatiquement les journaux par leur [source de données](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/supported-aws-services-data-sources.html) d'origine — comme AWS CloudTrail et Amazon VPC Flow Logs — vous permettant d'interroger toutes vos données de journaux CloudTrail ou VPC Flow Logs à travers vos groupes de journaux en utilisant la facette `@data_source_name`, quel que soit le nombre de groupes de journaux existants ou leur nom.

Avec la [centralisation des journaux inter-comptes et inter-régions CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatchLogs_Centralization.html), vous pouvez construire des analyses de sécurité par-dessus cette fondation. Ce guide vous accompagne dans le déploiement d'un exemple de [tableau de bord CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Dashboards.html) pré-construit via AWS CloudFormation qui exploite les sources de données CloudWatch pour fournir une visibilité quasi temps réel sur votre activité CloudTrail et VPC Flow Logs. Il explique ce que chaque widget fournit et décrit comment utiliser le tableau de bord pour la surveillance de sécurité, l'investigation d'incidents et la visibilité de conformité.

## Pourquoi ce tableau de bord est important

Les équipes de sécurité ont besoin d'une visibilité centralisée et quasi temps réel sur l'activité API et le trafic réseau à travers leurs comptes AWS. Sans un tableau de bord centralisé, les équipes doivent manuellement exécuter des requêtes sur plusieurs groupes de journaux, corréler les données entre CloudTrail et VPC Flow Logs, et reconstituer le contexte de sécurité à partir de sources disparates.

Ce tableau de bord répond à plusieurs défis clés :

- **Pas de dépendance aux noms de groupes de journaux** : Utilise [`SOURCE logGroups() | filterIndex @data_source_name`](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax-FilterIndex.html) pour découvrir dynamiquement CloudTrail et VPC Flow Logs via les facettes par défaut de CloudWatch Unified Data Store, quel que soit le nom des groupes de journaux dans votre compte.
- **Support double format** : Déploie soit une version Standard (noms de champs AWS natifs) soit OCSF (Open Cybersecurity Schema Framework) du tableau de bord selon votre préférence de format de journaux.
- **Corrélation inter-services** : Place les données d'activité API CloudTrail et réseau VPC Flow Log côte à côte pour une corrélation visuelle des événements de sécurité.
- **Portable entre comptes** : Le même template CloudFormation fonctionne dans n'importe quel compte qui a des journaux CloudTrail et VPC Flow Logs transmis à CloudWatch Logs, sans modification de paramètres nécessaire pour les noms de groupes de journaux.

## Prérequis

Avant le déploiement, vérifiez que votre compte dispose des sources de données requises :

```bash
aws logs list-aggregate-log-group-summaries --group-by DATA_SOURCE_NAME_AND_TYPE
```

Vous devriez voir des entrées pour `aws_cloudtrail` et `amazon_vpc` dans la sortie. Si celles-ci sont absentes, assurez-vous que :

1. **[CloudTrail](https://aws.amazon.com/about-aws/whats-new/2025/12/key-enhancements-cloudtrail-events-cloudwatch/)** est configuré pour livrer les journaux à CloudWatch Logs.
2. **[VPC Flow Logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/telemetry-config-rules.html)** sont configurés pour livrer à CloudWatch Logs pour au moins un VPC.

## Déployer le tableau de bord

1. Téléchargez le template **[CloudWatch_Dashboard_CloudTrail_VPC.yaml](https://raw.githubusercontent.com/aws-samples/aws-management-and-governance-samples/refs/heads/master/AWSCloudTrail/cloudwatch-dashboards/CloudWatch_Dashboard_CloudTrail_VPC.yaml)**.
1. Naviguez vers **CloudFormation** > **Create stack** > **With new resources**.
1. Téléversez le template `CloudWatch_Dashboard_CloudTrail_VPC.yaml`.
1. Configurez les paramètres :
   - **DashboardName** : Un nom pour votre tableau de bord (par défaut : `CloudTrail-VPC-Dashboard`).
   - **LogFormat** : Choisissez `Standard` pour les noms de champs natifs AWS CloudTrail/VPC Flow Log, ou `OCSF` pour les champs normalisés Open Cybersecurity Schema Framework.
1. Vérifiez et créez la pile.

### Paramètres CloudFormation

| Paramètre                          | Valeur par défaut           | Description                                                                                      |
|------------------------------------|----------------------------|--------------------------------------------------------------------------------------------------|
| `DashboardName`                    | `CloudTrail-VPC-Dashboard`    | Nom du tableau de bord CloudWatch                                                                |
| `LogFormat`                        | `Standard`                 | `Standard` (champs AWS natifs) ou `OCSF` (schéma normalisé)                                    |

## Fonctionnement des requêtes

Chaque requête [CloudWatch Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html) de ce tableau de bord utilise le même modèle :

```
SOURCE logGroups() | filterIndex @data_source_name in ["aws_cloudtrail"]
| <votre logique de requête ici>
```

- [`SOURCE logGroups()`](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax-Source.html) indique à CloudWatch de rechercher dans tous les groupes de journaux du compte.
- [`filterIndex @data_source_name in [...]`](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax-FilterIndex.html) utilise la facette par défaut `@data_source_name` pour restreindre la recherche aux seuls groupes de journaux contenant la source de données spécifiée. CloudWatch fournit automatiquement cela comme facette par défaut sur tous les groupes de journaux de classe Standard — aucune configuration personnalisée nécessaire.
- Pour les requêtes CloudTrail, le nom de la source de données est `aws_cloudtrail`.
- Pour les requêtes VPC Flow Log, le nom de la source de données est `amazon_vpc`.

Cette approche signifie que vous n'avez jamais besoin de connaître ou configurer le nom réel du groupe de journaux. Le tableau de bord fonctionne de manière identique que votre groupe de journaux CloudTrail soit nommé `aws-cloudtrail-logs`, `aws/cloudtrail/managementevents` ou tout autre nom personnalisé.

## Bonnes pratiques de sécurité

### Restreindre l'accès au tableau de bord avec IAM

En tant que bonne pratique, appliquez des contrôles d'accès au moindre privilège à tout tableau de bord CloudWatch qui affiche des données de sécurité.

Voici un exemple de politique IAM qui accorde un accès en lecture seule au tableau de bord et refuse les modifications. Attachez-la aux rôles ou groupes IAM qui devraient avoir un accès en consultation uniquement :

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowDashboardReadOnly",
      "Effect": "Allow",
      "Action": [
        "cloudwatch:GetDashboard",
        "cloudwatch:ListDashboards"
      ],
      "Resource": "arn:aws:cloudwatch::ACCOUNT_ID:dashboard/CloudTrail-VPC-Dashboard"
    },
    {
      "Sid": "DenyDashboardModification",
      "Effect": "Deny",
      "Action": [
        "cloudwatch:PutDashboard",
        "cloudwatch:DeleteDashboards"
      ],
      "Resource": "arn:aws:cloudwatch::ACCOUNT_ID:dashboard/CloudTrail-VPC-Dashboard"
    }
  ]
}
```

Remplacez `ACCOUNT_ID` par votre identifiant de compte AWS et `CloudTrail-VPC-Dashboard` par le nom réel de votre tableau de bord si vous l'avez personnalisé.

Pour l'équipe d'opérations de sécurité qui doit maintenir le tableau de bord, utilisez une politique séparée qui autorise à la fois la lecture et l'écriture :

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowDashboardFullAccess",
      "Effect": "Allow",
      "Action": [
        "cloudwatch:GetDashboard",
        "cloudwatch:ListDashboards",
        "cloudwatch:PutDashboard",
        "cloudwatch:DeleteDashboards"
      ],
      "Resource": "arn:aws:cloudwatch::ACCOUNT_ID:dashboard/CloudTrail-VPC-Dashboard"
    }
  ]
}
```

Les requêtes du tableau de bord nécessitent également les permissions `logs:StartQuery`, `logs:GetQueryResults` et `logs:FilterLogEvents` sur les groupes de journaux pertinents. Assurez-vous que les rôles IAM disposent de ces permissions limitées aux groupes de journaux CloudTrail et VPC Flow Log.

### Compléter le tableau de bord avec des alarmes CloudWatch

Le tableau de bord vous montre ce qui se passe mais ne vous notifiera pas quand quelque chose ne va pas. Pour être alerté sur les événements de sécurité critiques, configurez des [alarmes CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html) alimentées par des [filtres de métriques CloudWatch Logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/MonitoringLogData.html). Voici quelques-unes à considérer :

| Événement | Modèle de filtre de métriques |
|---|---|
| Utilisation du compte root | `{ $.userIdentity.type = "Root" && $.userIdentity.invokedBy NOT EXISTS && $.eventType != "AwsServiceEvent" }` |
| Escalade de privilèges | `{ ($.eventName = "AttachRolePolicy") \|\| ($.eventName = "PutRolePolicy") \|\| ($.eventName = "CreateAccessKey") \|\| ($.eventName = "CreateLoginProfile") }` |
| Échecs de connexion console | `{ ($.eventName = "ConsoleLogin") && ($.errorMessage = "Failed authentication") }` |

Utilisez une [alarme basée sur une requête CloudWatch Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Create_Metrics_Insights_Alarm.html) sur le nombre de REJECT sur une fenêtre glissante. | Détecte le balayage de ports ou les attaques réseau actives. |

Routez les actions d'alarme vers un [topic SNS](https://docs.aws.amazon.com/sns/latest/dg/welcome.html) qui notifie votre équipe d'opérations de sécurité par e-mail, Slack ou votre plateforme de gestion d'incidents.

### Chiffrement et rétention des groupes de journaux

CloudWatch Logs chiffre toutes les données de journaux au repos par défaut en utilisant des clés gérées par AWS — aucune configuration nécessaire. Cependant, si votre organisation exige des clés de chiffrement gérées par le client pour la conformité, vous pouvez associer une [clé KMS à chaque groupe de journaux](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/encrypt-log-data-kms.html). Cela vous donne un contrôle total sur la rotation des clés, les politiques d'accès et les pistes d'audit via CloudTrail.

Ce template crée uniquement le tableau de bord — il ne crée ni ne gère les groupes de journaux sous-jacents, il ne peut donc pas imposer de paramètres de chiffrement ou de rétention sur ceux-ci. Assurez-vous que les groupes de journaux CloudTrail et VPC Flow Log pour le tableau de bord ont des paramètres appropriés appliqués :

- **Chiffrement KMS** : Si requis, associez une clé KMS au groupe de journaux en utilisant `aws logs associate-kms-key` ou via CloudFormation lors de la création du groupe de journaux.
- **Politique de rétention** : Par défaut, CloudWatch Logs conserve les données de journaux indéfiniment. Définissez une [politique de rétention](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/Working-with-log-groups-and-streams.html#SettingLogRetention) qui équilibre vos exigences de conformité avec les coûts.

### Recommandations supplémentaires

- **Activez la protection contre la suppression de la pile CloudFormation** après le déploiement pour éviter une suppression accidentelle.
- **Utilisez des [Service Control Policies (SCPs)](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html)** dans AWS Organizations pour restreindre `cloudwatch:PutDashboard` et `cloudwatch:DeleteDashboards` à des rôles administrateurs spécifiques à travers tous les comptes.
- **Activez la journalisation CloudTrail pour les appels API CloudWatch** afin que toute modification du tableau de bord soit auditable via l'événement `PutDashboard` dans CloudTrail.

## Sections du tableau de bord et référence des widgets

Le tableau de bord est organisé en six sections. Ci-dessous se trouve la version au format Standard — la version OCSF a des widgets équivalents utilisant les noms de champs OCSF (`api.operation`, `src_endpoint.ip`, `actor.user.name`, etc.).

---

### Section 1 : Vue d'ensemble de la sécurité

Cette section fournit une vue d'ensemble de la posture de sécurité à travers votre environnement AWS.

| Widget                                                       | Type                      | Source de données | Ce qu'il affiche                                                                                                       | Pourquoi c'est important                                                                                                                                                                        |
|--------------------------------------------------------------|---------------------------|-------------------|------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Tendance du taux d'erreur dans le temps                      | Série temporelle          | CloudTrail        | Nombre d'erreurs API agrégées par intervalles de 5 minutes dans le temps.                                              | Un pic soudain d'erreurs peut indiquer des attaques par force brute, une automatisation mal configurée ou des identifiants compromis. Utilisez ceci comme premier indicateur que quelque chose d'inhabituel se produit. |
| Principaux codes d'erreur (Unauthorized / Access Denied)     | Tableau                   | CloudTrail        | Codes d'erreur d'accès refusé et non autorisé les plus fréquents, ventilés par code d'erreur, nom d'événement API, compte et région. | Identifie quels appels API spécifiques sont refusés et dans quels comptes. Les modèles ici peuvent révéler du bourrage d'identifiants, des erreurs de configuration de permissions ou des tentatives de mouvement latéral. |
| Types d'identité utilisateur                                 | Camembert                 | CloudTrail        | Distribution des appels API par type d'identité (IAMUser, AssumedRole, Root, FederatedUser, AWSService, etc.).         | Un environnement sain devrait montrer principalement des appels AssumedRole et AWSService. Une activité Root ou IAMUser significative peut nécessiter une investigation.                        |
| Actions VPC Flow                                             | Camembert                 | VPC Flow Logs     | Ratio des actions ACCEPT vs REJECT à travers tous les enregistrements VPC flow log.                                    | Un ratio REJECT élevé peut indiquer un balayage de ports, des groupes de sécurité mal configurés ou des tentatives d'attaque actives contre votre périmètre réseau.                            |
| Activité du compte root                                      | Tableau                   | CloudTrail        | Appels API récents effectués avec le compte root, incluant le nom de l'événement, l'IP source, le compte et la région. | L'utilisation du compte root devrait être rare et bien justifiée. Toute activité root inattendue est un événement de sécurité prioritaire qui devrait être investigué immédiatement.            |

---

### Section 2 : Insights de sécurité corrélés — CloudTrail + VPC Flow Logs

Cette section place les données de sécurité de la couche API et de la couche réseau côte à côte pour une corrélation visuelle.

| Widget                                                       | Type                      | Source de données | Ce qu'il affiche                                                                                                       | Pourquoi c'est important                                                                                                                                                                        |
|--------------------------------------------------------------|---------------------------|-------------------|------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| IPs suspectes : erreurs API                                  | Tableau                   | CloudTrail        | Adresses IP externes (non-RFC1918) générant le plus d'erreurs API, regroupées par compte et région.                    | Les IPs externes avec un nombre élevé d'erreurs tentent probablement un accès non autorisé. Croisez celles-ci avec le widget de REJECT réseau pour voir si les mêmes IPs sont également bloquées au niveau réseau. |
| IPs avec REJECT réseau                                       | Tableau                   | VPC Flow Logs     | Adresses IP externes avec le plus d'actions REJECT, ventilées par port de destination.                                 | Montre quelles IPs externes sont bloquées par les groupes de sécurité ou les NACLs. Quand la même IP apparaît dans ce widget et dans le widget d'erreurs API, cela suggère fortement une activité malveillante. |
| Référence croisée : IPs externes dans les journaux CloudTrail | Tableau (pleine largeur)  | CloudTrail        | Toutes les IPs externes effectuant des appels API, avec le nombre total d'appels API et le nombre d'erreurs par IP, compte et région. | Fournit une vue complète de l'activité des IPs externes. Les IPs avec un nombre élevé d'appels API mais peu d'erreurs peuvent être des services légitimes ; les IPs avec un ratio d'erreurs élevé nécessitent une investigation. |
| Chronologie de l'activité API                                | Série temporelle          | CloudTrail        | Volume total d'appels API dans le temps par intervalles de 10 minutes.                                                 | Établit une base de référence de l'activité API normale. Les déviations par rapport à cette base peuvent indiquer des attaques automatisées, des perturbations de service ou des identifiants compromis exécutant des scripts. |
| Chronologie du trafic réseau                                 | Série temporelle (empilée)| VPC Flow Logs     | Nombre de flux réseau dans le temps, empilés par action ACCEPT/REJECT.                                                 | Visualise les modèles de trafic réseau et la proportion de trafic bloqué dans le temps. Une tendance REJECT croissante peut indiquer une attaque en cours.                                     |

---

### Section 3 : Sécurité réseau — Analyse de l'activité réseau

Analyse approfondie des données VPC Flow Log pour une visibilité de sécurité au niveau réseau.

| Widget                                                       | Type                      | Source de données | Ce qu'il affiche                                                                                                       | Pourquoi c'est important                                                                                                                                                                        |
|--------------------------------------------------------------|---------------------------|-------------------|------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Principales connexions réseau bloquées                       | Tableau                   | VPC Flow Logs     | Paires IP source/destination avec le plus d'actions REJECT et le total d'octets transférés.                            | Identifie les tentatives de connexion bloquées les plus persistantes. Des connexions bloquées à haut volume depuis une seule IP source peuvent indiquer une attaque ciblée ou une application mal configurée. |
| Principaux ports de destination                              | Graphique à barres        | VPC Flow Logs     | Ports de destination les plus fréquemment ciblés à travers tous les enregistrements flow log.                          | Les ports courants comme 443 (HTTPS) et 80 (HTTP) sont attendus. Des ports inhabituels (par ex., 22, 3389, 445) recevant un trafic élevé peuvent indiquer des tentatives de balayage ou d'exploitation. |
| Octets de trafic réseau dans le temps                        | Série temporelle (empilée)| VPC Flow Logs     | Total d'octets transférés dans le temps, empilés par ACCEPT/REJECT.                                                   | Suit les tendances de volume de transfert de données. Des augmentations soudaines des octets acceptés pourraient indiquer une exfiltration de données ; des augmentations des octets rejetés suggèrent un blocage actif du trafic malveillant. |
| Principales IPs sources externes                             | Tableau                   | VPC Flow Logs     | IPs externes avec le plus de connexions et le total d'octets, regroupées par action (ACCEPT/REJECT).                  | Identifie les IPs externes les plus actives communiquant avec vos VPCs. Utile pour identifier les partenaires légitimes, CDNs ou acteurs de menaces potentiels.                                |

---

### Section 4 : Gestion des identités et des accès

Axée sur l'activité IAM et les événements d'authentification depuis CloudTrail.

| Widget                                                       | Type                      | Source de données | Ce qu'il affiche                                                                                                       | Pourquoi c'est important                                                                                                                                                                        |
|--------------------------------------------------------------|---------------------------|-------------------|------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Indicateurs d'escalade de privilèges IAM                     | Tableau                   | CloudTrail        | Appels API IAM à haut risque (CreateUser, AttachUserPolicy, AttachRolePolicy, PutUserPolicy, PutRolePolicy, CreateAccessKey, CreateLoginProfile) regroupés par nom d'événement, ARN utilisateur, compte et région. | Ces appels API peuvent accorder des permissions élevées. Des occurrences inattendues peuvent indiquer qu'un attaquant établit une persistance ou escalade ses privilèges après une compromission initiale. |
| Principaux appels API                                        | Graphique à barres        | CloudTrail        | Les 10 APIs les plus fréquemment appelées à travers tous les événements CloudTrail.                                    | Établit à quoi ressemble l'activité API "normale". Des APIs inhabituelles apparaissant dans le top 10 peuvent indiquer une nouvelle automatisation, une mauvaise configuration ou une activité malveillante. |
| Événements d'authentification                                | Tableau                   | CloudTrail        | Tentatives de connexion à la console AWS, regroupées par succès/échec (errorCode), ARN utilisateur, compte et région.  | Les échecs de connexion à la console peuvent indiquer du bourrage d'identifiants ou des attaques par force brute. Les connexions réussies depuis des utilisateurs ou régions inattendus devraient être investigués. |
| Tentatives d'authentification dans le temps                  | Série temporelle (empilée)| CloudTrail        | Tentatives de connexion à la console dans le temps par intervalles de 30 minutes, empilées par succès/échec.           | Visualise les modèles d'authentification. Une rafale de connexions échouées suivie d'un succès peut indiquer un compte compromis.                                                              |

---

### Section 5 : Distribution et analyse de l'activité

Analyse plus large des modèles d'activité API pour la sensibilisation opérationnelle et sécuritaire.

| Widget                                                       | Type                      | Source de données | Ce qu'il affiche                                                                                                       | Pourquoi c'est important                                                                                                                                                                        |
|--------------------------------------------------------------|---------------------------|-------------------|------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Principales IPs sources par volume d'activité                | Tableau                   | CloudTrail        | IPs externes générant le plus d'activité API, regroupées par compte et région.                                         | Identifie les appelants externes les plus actifs. Des IPs inattendues avec des volumes d'activité élevés peuvent indiquer des identifiants compromis utilisés depuis une infrastructure externe. |
| Événements par type d'événement                              | Camembert                 | CloudTrail        | Distribution des types d'événements CloudTrail (AwsApiCall, AwsConsoleSignIn, AwsServiceEvent, etc.).                  | Fournit un contexte sur la nature de l'activité. Une augmentation soudaine des événements AwsConsoleSignIn ou l'apparition d'un nouveau type d'événement peut nécessiter une attention.         |
| Tendance d'activité par source d'événement                   | Série temporelle (empilée)| CloudTrail        | Volume d'appels API dans le temps, ventilé par service AWS (eventSource).                                              | Montre quels services sont les plus actifs et comment les modèles d'activité changent dans le temps. Un service qui devient soudainement très actif peut indiquer des actions automatisées ou un incident. |
| Événements par région                                        | Camembert                 | CloudTrail        | Distribution des appels API à travers les régions AWS.                                                                 | L'activité dans des régions inattendues peut indiquer un attaquant opérant depuis une région où vous n'avez normalement pas de ressources. C'est un indicateur courant de compromission.        |
| Principaux services                                          | Camembert                 | CloudTrail        | Les services AWS les plus appelés par nombre d'événements.                                                             | Établit votre base de référence d'utilisation des services. De nouveaux services apparaissant ou des proportions inhabituelles peuvent indiquer une création de ressources non autorisée.       |
| Appels API en lecture vs écriture                            | Graphique à barres        | CloudTrail        | Ratio des appels API en lecture seule vs mutatifs (écriture).                                                          | Un environnement sain a typiquement plus d'appels en lecture qu'en écriture. Une augmentation soudaine des appels en écriture peut indiquer une création, modification ou suppression de ressources en masse — potentiellement malveillante. |

---

### Section 6 : Chronologie détaillée des événements de sécurité

| Widget                                                       | Type                      | Source de données | Ce qu'il affiche                                                                                                       | Pourquoi c'est important                                                                                                                                                                        |
|--------------------------------------------------------------|---------------------------|-------------------|------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Chronologie des événements de sécurité — Erreurs et accès refusé | Tableau (pleine largeur) | CloudTrail        | Les 100 erreurs API les plus récentes avec un contexte complet : horodatage, nom d'événement, code d'erreur, message d'erreur, ARN utilisateur, IP source, compte et région. | C'est votre point de départ pour l'investigation. Quand une alerte se déclenche ou que vous remarquez des anomalies dans les widgets ci-dessus, venez ici pour voir les événements bruts avec un contexte complet pour la réponse aux incidents. |

---
![CloudTrail Dashboard](/img/cloudops/solutions/cloudtrail-dashboards/example-dashboard-01.png)

![CloudTrail Dashboard](/img/cloudops/solutions/cloudtrail-dashboards/example-dashboard-02.png)

## Nettoyage

Pour supprimer le tableau de bord et toutes les ressources associées :

```bash
aws cloudformation delete-stack --stack-name CloudTrail-VPC-Dashboard
```

:::note
Remplacez **CloudTrail-VPC-Dashboard** par le nom de la pile CloudFormation utilisé dans la section Déploiement
:::

## Conclusion

Ce tableau de bord CloudWatch fournit une visibilité de sécurité centralisée et quasi temps réel à travers l'activité API CloudTrail et les données réseau VPC Flow Log en utilisant les sources de données CloudWatch Unified Data Store. En exploitant la facette par défaut `@data_source_name`, le tableau de bord découvre automatiquement les bons groupes de journaux sans nécessiter de configuration de noms de groupes de journaux, le rendant portable à travers n'importe quel compte AWS. Déployez-le via CloudFormation en quelques minutes pour obtenir une visibilité de sécurité immédiate pour la détection de menaces, l'investigation d'incidents et la surveillance de conformité.
