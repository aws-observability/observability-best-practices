---
sidebar_position: 1
---
# Rapports centralisés de conformité des correctifs

## Qu'est-ce que la conformité des correctifs ?

La conformité des correctifs est le processus qui garantit que toutes les ressources informatiques disposent des dernières mises à jour de sécurité et corrections de bogues installées conformément aux politiques organisationnelles. Un système est considéré comme « conforme aux correctifs » lorsque tous les correctifs requis définis dans votre ligne de base de correctifs ont été appliqués avec succès. Les systèmes non conformes peuvent présenter des mises à jour de sécurité critiques manquantes, exposant potentiellement votre organisation à des vulnérabilités de sécurité pouvant être exploitées par des acteurs malveillants.

Dans les environnements cloud modernes couvrant plusieurs comptes AWS et régions, la gestion décentralisée des correctifs crée des défis importants, notamment des lacunes de visibilité, des rapports incohérents, des réponses retardées aux vulnérabilités, des processus d'audit complexes et des efforts dupliqués entre les équipes. Ces défis peuvent entraîner une exposition prolongée à la sécurité et une utilisation inefficace des ressources dans toute votre organisation.

Les rapports centralisés de conformité des correctifs répondent à ces défis en consolidant les données de tous les comptes et régions en un seul emplacement, fournissant une vue complète de votre posture de sécurité. Cette approche offre de nombreux avantages : une source unique de vérité pour le statut de conformité, une sensibilisation en temps réel aux vulnérabilités, des métriques cohérentes entre les environnements, un audit simplifié, des capacités d'analyse des tendances, une efficacité améliorée des ressources et la base pour des flux de travail de remédiation automatisés.

AWS Systems Manager fournit la base de cette centralisation grâce à Patch Manager pour automatiser les processus de correction, les [synchronisations de données de ressources](https://docs.aws.amazon.com/systems-manager/latest/userguide/inventory-create-resource-data-sync.html) pour agréger les données de conformité dans un bucket S3 central, et des services d'analyse comme AWS Glue, Amazon Athena et Amazon QuickSight pour transformer, interroger et visualiser les données. La solution décrite dans cette recette exploite ces composants pour créer un système de rapports complet qui fonctionne dans toute votre organisation AWS, permettant des opérations plus efficaces et une remédiation plus rapide des vulnérabilités.

:::tip
La synchronisation de données de ressources fournit les métadonnées d'inventaire et de conformité des correctifs sous forme de fichier JSON. Comme alternative à l'utilisation d'Athena et QuickSight, vous pouvez utiliser n'importe quel outil de BI ou d'analyse capable d'extraire les données du bucket S3.
:::

## Objectif

L'objectif de cette recette est de fournir des modèles CloudFormation d'exemple pouvant être utilisés pour provisionner les ressources nécessaires aux rapports centralisés de conformité des correctifs. Cette recette ne couvre pas le déploiement des opérations de scan ou d'installation de correctifs.

Pour plus d'informations sur la préparation des nœuds gérés pour l'application de correctifs, consultez [Application de correctifs aux nœuds gérés à l'aide d'AWS Systems Manager et du balisage](/guides/centralized-operations-management/patch-nodes-using-tags/).

## Prérequis

Avant de commencer le déploiement, assurez-vous de disposer des éléments suivants :

* Configuration d'AWS Organizations : une organisation AWS correctement configurée avec un compte de gestion et des comptes membres.
* Nœuds gérés configurés : les instances Amazon Elastic Compute Cloud (EC2), les appareils principaux AWS Internet of Things (IoT) Greengrass, les serveurs sur site, les appareils en périphérie et les machines virtuelles doivent être des nœuds gérés par Systems Manager pour effectuer des opérations de correction et signaler la conformité des correctifs.
* Opérations de correction implémentées : au minimum, une opération de scan des correctifs doit être configurée et exécutée au moins une fois. Sans cela, il n'y aura pas de données de conformité à signaler. Pour plus d'informations sur les différents types de correction et comment les implémenter, consultez le [Guide des meilleures pratiques de gestion des correctifs](/guides/centralized-operations-management/patch-management) et la section [Différents types de correction](/guides/centralized-operations-management/patch-management#different-types-of-patching).
* Permissions IAM : les permissions appropriées pour déployer des modèles CloudFormation et créer les ressources requises dans le compte de rapports central et les comptes membres.
* Amazon QuickSight : pour visualiser les informations de conformité des correctifs à l'aide de QuickSight, vous devez [vous inscrire à QuickSight](https://docs.aws.amazon.com/quicksight/latest/user/signing-up.html).
* Permissions Amazon QuickSight pour S3 : vous devez vous assurer que QuickSight dispose des permissions pour accéder aux buckets S3 créés dans la [Phase 1 : Configuration du compte central](#phase-1--configuration-du-compte-central). Plus d'informations sont fournies dans [Prérequis à compléter avant de déployer le modèle CloudFormation pour QuickSight](#prérequis-à-compléter-avant-de-déployer-le-modèle-cloudformation-pour-quicksight).

## Considérations

### Synchronisation de données de ressources

Actuellement, la ressource `AWS::SSM::ResourceDataSync` dans AWS CloudFormation ne prend pas en charge la propriété `DestinationDataSharing` au sein de la propriété [S3Destination](https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-properties-ssm-resourcedatasync-s3destination.html), qui est nécessaire pour créer une synchronisation de données de ressources d'inventaire prenant en charge une politique de bucket S3 simplifiée.

Pour cette raison, cette recette utilise une ressource CloudFormation personnalisée dans la section [Modèle CloudFormation d'exemple pour la synchronisation de données de ressources organisationnelle](#modèle-cloudformation-dexemple-pour-la-synchronisation-de-données-de-ressources-organisationnelle) afin d'utiliser une fonction Lambda pour créer la synchronisation de données de ressources.

Alternatives à l'utilisation de la ressource personnalisée pour créer la synchronisation de données de ressources :

1. Utiliser la synchronisation de données de ressources standard prise en charge par CloudFormation.
    1. Pour y parvenir, vous devez créer et utiliser une politique de bucket qui accorde des permissions basées sur les identifiants de compte AWS. Pour plus d'informations et un exemple de politique de bucket S3, consultez [Avant de commencer](https://docs.aws.amazon.com/systems-manager/latest/userguide/inventory-create-resource-data-sync.html#datasync-before-you-begin).
    1. Mettre à jour la politique de bucket S3 dans le [Modèle CloudFormation d'exemple pour les rapports centraux utilisant Athena](#modèle-cloudformation-dexemple-pour-les-rapports-centraux-utilisant-athena) pour utiliser la nouvelle politique qui liste les identifiants de compte AWS.
    1. Utiliser les StackSets CloudFormation pour déployer la ressource `AWS::SSM::ResourceDataSync`. Pour un exemple d'extrait de ressource CloudFormation, consultez [Créer une synchronisation de données de ressources SyncToDestination](https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-resource-ssm-resourcedatasync.html#aws-resource-ssm-resourcedatasync--examples--Create_a_SyncToDestination_resource_data_sync).
1. Utiliser une méthode alternative pour créer la synchronisation de données de ressources organisationnelle, par exemple, via des scripts utilisant AWS CLI ou d'autres SDK.

### Considérations de coûts

La mise en œuvre de rapports centralisés de conformité des correctifs implique plusieurs services AWS, chacun avec des coûts associés :

1. [Tarification Amazon S3](https://aws.amazon.com/s3/pricing/) :
    * Coûts de stockage standard pour les données d'inventaire et de conformité des correctifs
    * Coûts de transfert de données pour la synchronisation des données à partir de plusieurs comptes et régions
      * Le coût augmente linéairement avec le nombre de nœuds gérés et la fréquence de scan
1. [Tarification AWS Glue](https://aws.amazon.com/glue/pricing/) :
    * Coûts du crawler
    * Pour la configuration par défaut (exécution quotidienne du crawler)
1. [Tarification Amazon Athena](https://aws.amazon.com/athena/pricing/) :
    * Coûts des requêtes
    * Le coût varie en fonction de la complexité et de la fréquence des requêtes
    * L'utilisation du partitionnement et du filtrage peut réduire considérablement les coûts
1. [Tarification AWS Lambda](https://aws.amazon.com/lambda/pricing/) :
    * Coûts minimaux pour la fonction Lambda de ressource personnalisée
    * Le niveau gratuit couvre généralement cette utilisation pour la plupart des implémentations
1. [Tarification Amazon QuickSight](https://aws.amazon.com/quicksight/pricing/) (optionnel) :
    * Licences auteur et licences lecteur

## Vue d'ensemble de l'architecture

### Compte de rapports central

Dans le diagramme suivant, le compte **Rapports Centraux** est un compte AWS au sein de votre organisation AWS dédié au stockage des métadonnées de correctifs et d'inventaire, ainsi qu'aux requêtes ou à la visualisation.

:::warning
Il n'est **pas recommandé** d'utiliser le [compte de gestion de l'organisation AWS](https://docs.aws.amazon.com/managedservices/latest/userguide/management-account.html) comme **compte de rapports central**. Les [meilleures pratiques AWS pour le compte de gestion](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_best-practices_mgmt-acct.html#bp_mgmt-acct_use-mgmt) recommandent d'utiliser le compte de gestion et ses utilisateurs et rôles uniquement pour les tâches qui **doivent** être effectuées par ce compte. Stockez toutes vos ressources AWS dans d'autres comptes AWS de l'organisation et gardez-les hors du compte de gestion.
:::

![Architecture du compte de rapports central](/img/cloudops/recipes/central-reporting/architecture-diagram-reporting-account.png "Architecture du compte de rapports central")

1. Le crawler Glue s'exécute une fois par jour pour explorer le bucket S3 qui héberge les métadonnées fournies par la synchronisation de données de ressources.
1. Le crawler Glue met à jour la base de données et les tables en fonction des métadonnées dans le bucket S3.
1. Une fois l'exécution du crawler Glue terminée, un événement est envoyé à EventBridge.
1. Une règle EventBridge invoque la fonction Lambda.
1. La fonction Lambda supprime une colonne en double pour la table AWS:InstanceInformation.
    :::info
    La table `AWS:InstanceInformation` inclut une colonne nommée `resourcetype`, qui est également une clé de partition, ce qui provoque l'échec des requêtes Athena. La règle EventBridge est déclenchée par l'exécution du crawler Glue, qui invoque ensuite la fonction Lambda pour supprimer la colonne.
    :::
1. Athena interroge la base de données et les tables Glue en fonction des requêtes que vous exécutez.
1. (Optionnellement) Vous pouvez créer un tableau de bord QuickSight pour visualiser les informations de conformité des correctifs. **Note :** QuickSight n'est pas inclus dans le modèle CloudFormation d'exemple.

### Compte(s) membre(s)/Région(s) avec des nœuds gérés

![Architecture pour la synchronisation de données de ressources de l'organisation AWS](/img/cloudops/recipes/central-reporting/architecture-diagram-ssm-org-resource-data-sync.png "Architecture pour la synchronisation de données de ressources de l'organisation AWS")

1. Le StackSet CloudFormation dans le compte administrateur délégué crée des instances de pile dans les comptes/régions AWS cibles pour créer les ressources requises.
1. L'instance de pile crée un rôle de service IAM, une fonction Lambda et une ressource CloudFormation personnalisée.
1. La fonction Lambda crée une synchronisation de données de ressources Systems Manager pour AWS Organizations.
1. La synchronisation de données de ressources envoie les métadonnées d'inventaire et de conformité des correctifs vers le bucket S3 spécifié dans le [compte de rapports central](#compte-de-rapports-central).

### Chronologie du processus

Le diagramme suivant affiche la chronologie du processus d'interrogation de la conformité des correctifs pour les nœuds gérés.

![Chronologie du processus pour les opérations de correction](/img/cloudops/recipes/central-reporting/architecture-diagram-org-patch-reporting-combined.png "Chronologie du processus pour les opérations de correction")

1. Suite à un scan de correctifs, une installation ou une opération de collecte de métadonnées d'inventaire, l'agent SSM sur le nœud géré renvoie les données à Systems Manager.
1. Les mises à jour des métadonnées de correctifs et d'inventaire sont identifiées par la synchronisation de données de ressources en fonction des actions effectuées.
1. La synchronisation de données de ressources envoie les métadonnées vers le bucket S3 spécifié dans le compte de rapports central.
1. Vous pouvez ensuite utiliser Athena pour interroger les résultats suite à l'opération.

Comme indiqué dans le diagramme ci-dessus, vous pouvez enregistrer des nœuds gérés hybrides pour la correction ou la collecte de métadonnées d'inventaire et les données seront envoyées dans le même bucket S3 que les instances EC2.

## Étapes de déploiement

### Liste de contrôle du déploiement

Ci-dessous, vous trouverez une liste de contrôle pour les étapes de déploiement incluses dans cette recette.

#### Tâches du compte de rapports central

* [ ] Déployer la pile CloudFormation pour les ressources Athena
* [ ] Noter les noms des buckets S3 à partir des sorties de la pile
* [ ] Configurer les permissions QuickSight pour les buckets S3
* [ ] Déployer la pile CloudFormation pour la visualisation QuickSight
* [ ] Vérifier l'accès à l'analyse QuickSight

#### Tâches des comptes membres (via StackSets)

* [ ] Déployer le StackSet CloudFormation de synchronisation de données de ressources organisationnelle
* [ ] Vérifier que les synchronisations de données de ressources sont créées dans les comptes membres

### Phase 1 : Configuration du compte central

#### Modèle CloudFormation d'exemple pour les rapports centraux utilisant Athena

Ci-dessous, vous trouverez des détails sur les ressources créées par le modèle CloudFormation et leur objectif.

[Modèle CloudFormation d'exemple pour les rapports centraux utilisant Athena](https://github.com/aws-samples/cloud-operations-best-practices/blob/main/cloud-operations-best-practices/static/cfn-templates/patch-reporting/patch-reporting.yaml)

| Nom de la ressource | Objectif |
| -------- | ------ |
| **Ressources KMS** | |
| ManagedInstanceDataEncryptionKey | Clé gérée par le client (CMK) pour chiffrer les métadonnées des nœuds gérés dans le bucket S3 de synchronisation de données de ressources. |
| ManagedInstanceDataEncryptionKeyAlias | Alias pour la CMK. |
| **Ressources S3** | |
| AthenaQueryResultsBucket | Bucket S3 pour stocker les résultats des requêtes Athena. |
| ResourceSyncBucket | Bucket S3 utilisé pour stocker les métadonnées des nœuds gérés fournies par la synchronisation de données de ressources. |
| ResourceSyncBucketPolicy | Politique de bucket S3 pour le bucket S3 de synchronisation de données de ressources. |
| **Ressources Glue** | |
| GlueDatabase | Base de données Glue pour les métadonnées de synchronisation de données de ressources. |
| GlueCrawler | Crawler Glue pour créer la base de données et les tables. |
| GlueCrawlerRole | Rôle IAM utilisé par le crawler Glue. |
| DeleteGlueTableColumnFunctionRole | Rôle IAM pour la fonction Lambda DeleteGlueTableColumnFunction. |
| DeleteGlueTableColumnFunction | Fonction Lambda pour supprimer la clé de partition `resourcetype` en double. |
| DeleteGlueTableColumnFunctionEventRule | Règle Amazon EventBridge pour invoquer la fonction Lambda DeleteGlueTableColumnFunction. |
| DeleteGlueTableColumnFunctionCloudWatchPermission | Attribution des permissions EventBridge pour invoquer la fonction Lambda DeleteGlueTableColumnFunction. |
| **Ressources Athena** | |
| AthenaWorkGroup | Groupe de travail Athena pour les requêtes nommées. |
| AthenaQueryCompliantPatch | Exemple de requête pour lister les nœuds gérés conformes pour la correction. |
| AthenaQueryNonCompliantPatch | Exemple de requête pour lister les nœuds gérés non conformes pour la correction. |
| AthenaQueryComplianceSummaryPatch | Exemple de requête pour fournir un résumé de conformité des correctifs pour les nœuds gérés. |
| AthenaQueryPatchSummary | Exemple de requête pour fournir un résumé des correctifs pour les nœuds gérés. |
| AthenaQueryInstanceList | Exemple de requête pour retourner une liste des nœuds gérés non terminés. |
| AthenaQueryInstanceApplications | Exemple de requête pour retourner une liste des nœuds gérés non terminés et leurs applications installées. |
| AthenaQuerySSMAgent | Exemple de requête pour lister les versions de l'agent SSM installées sur les nœuds gérés. |
| **Ressources de nettoyage S3** | |
| S3CleanupLambdaExecutionRole | Rôle IAM pour nettoyer les buckets S3 |
| S3BucketCleanup | Fonction Lambda pour nettoyer les buckets S3 |
| S3Cleanup | Ressource personnalisée pour nettoyer les buckets S3 |

#### Déployer une pile CloudFormation pour Athena dans le compte de rapports central

1. Téléchargez le [Modèle CloudFormation d'exemple pour les rapports centraux utilisant Athena](https://github.com/aws-samples/cloud-operations-best-practices/blob/main/cloud-operations-best-practices/static/cfn-templates/patch-reporting/patch-reporting.yaml) sur votre machine locale.
1. Dans le compte de rapports central et la région, accédez à la [console AWS CloudFormation](https://console.aws.amazon.com/cloudformation/home).
1. Dans le volet de navigation de gauche, choisissez **Stacks**, puis choisissez **Create stack**.
1. Dans la liste déroulante, choisissez **With new resources (standard)**.
1. Sur la page **Create stack**, sélectionnez **Upload a template file**, sélectionnez **Choose file**, choisissez le fichier `patch-reporting.yaml`, puis choisissez **Next**.
1. Sur la page **Specify stack details**, effectuez les étapes suivantes :
    1. Pour **Stack name**, entrez un nom descriptif, tel que `patch-reporting`.
    1. Pour **Organization ID**, entrez l'ID de l'organisation AWS pour votre organisation AWS. Par exemple, `o-abcde12345`.
    :::tip
    Pour plus d'informations sur la façon de récupérer l'ID de l'organisation AWS, consultez [Affichage des détails d'une organisation depuis le compte de gestion](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_view_org.html).
    :::
    1. Pour **Enable Glue Crawler Schedule**, choisissez d'activer ou de désactiver l'exécution planifiée du crawler Glue.
    1. Pour **Glue Crawler Schedule (cron)**, entrez une expression de planification cron pour le crawler Glue.
    1. Pour **Enable KMS permissions for QuickSight service role**, choisissez d'activer ou de désactiver les permissions KMS pour le rôle de service IAM QuickSight. **Note** : si vous n'accordez pas les permissions KMS, vous ne pourrez pas visualiser les données de conformité des correctifs à l'aide de QuickSight.
    1. Choisissez **Next**.
1. Sur la page **Configure stack options**, ajoutez les balises requises, sélectionnez **I acknowledge that AWS CloudFormation might create IAM resources with custom names**, puis choisissez **Next**.
1. Sur la page **Review and create**, vérifiez toutes les informations, puis choisissez **Submit** pour créer votre pile.

Après le rafraîchissement de la page, le statut de votre pile devrait être `CREATE_IN_PROGRESS`. Lorsque le statut passe à `CREATE_COMPLETE`, vous pouvez ensuite déployer la visualisation QuickSight.

:::tip
Notez les noms des buckets Amazon S3 pour **AthenaQueryResultsBucket** et **ResourceDataSyncBucketName** qui se trouvent dans l'onglet **Outputs** de la pile CloudFormation. Vous aurez besoin de ces deux valeurs dans la section suivante pour déployer QuickSight.

![Sorties de la pile CloudFormation montrant le nom du bucket S3 de synchronisation de données de ressources](/img/cloudops/recipes/central-reporting/patch-reporting-cfn-outputs.png "Sorties de la pile CloudFormation montrant le nom du bucket S3 de synchronisation de données de ressources")
:::

#### Modèle CloudFormation d'exemple pour la visualisation Amazon QuickSight

Ci-dessous, vous trouverez des détails sur les ressources créées par le modèle CloudFormation et leur objectif.

[Modèle CloudFormation d'exemple pour la visualisation Amazon QuickSight](https://github.com/aws-samples/cloud-operations-best-practices/blob/main/cloud-operations-best-practices/static/cfn-templates/patch-reporting/quicksight.yaml)

| Nom de la ressource | Objectif |
| -------- | ------ |
| SSMDataSyncSource | Source de données QuickSight pointant vers le groupe de travail Athena, patch-workgroup. |
| ApplicationDataSet | Jeu de données QuickSight pour les métadonnées d'application |
| ComplianceItemDataSet | Jeu de données QuickSight pour les métadonnées d'éléments de conformité |
| ComplianceSummaryDataSet | Jeu de données QuickSight pour les métadonnées de résumé de conformité |
| InstanceDetailedInformationDataSet | Jeu de données QuickSight pour les métadonnées d'informations détaillées d'instance |
| InstanceInformationDataSet | Jeu de données QuickSight pour les métadonnées d'informations d'instance |
| TagDataSet | Jeu de données QuickSight pour les métadonnées de balises |
| JoinedDataSet | Jeu de données QuickSight qui joint aws_instanceinformation, aws_compliancesummary, aws_tag |
| ManagedNodeAnalysis | Tableau de bord d'analyse QuickSight |

:::tip
Le modèle CloudFormation d'exemple utilise la méthode `DIRECT_QUERY` qui permet d'interroger la source de données en quasi-temps réel. Une alternative est d'utiliser SPICE pour mettre en cache les données dans QuickSight. Si vous utilisez SPICE, le modèle d'exemple inclut également des exemples de planifications de rafraîchissement aux lignes 551-647. Pour plus d'informations sur le mode à utiliser, consultez [Meilleures pratiques pour Amazon QuickSight SPICE et le mode de requête directe](https://aws.amazon.com/blogs/business-intelligence/best-practices-for-amazon-quicksight-spice-and-direct-query-mode/)
:::

#### Prérequis à compléter avant de déployer le modèle CloudFormation pour QuickSight

Pour que QuickSight puisse accéder aux métadonnées de conformité des correctifs et d'inventaire, vous devez accorder l'accès à QuickSight pour les buckets S3 créés dans [Déployer une pile CloudFormation pour Athena dans le compte de rapports central](#déployer-une-pile-cloudformation-pour-athena-dans-le-compte-de-rapports-central) : `ssm-res-sync-athena-query-results-us-east-1-$AccountId` et `ssm-resource-sync-us-east-1-$AccountId`.

![Permissions QuickSight pour les buckets S3](/img/cloudops/recipes/central-reporting/quicksight-athena-resources.png "Permissions QuickSight pour les buckets S3")

Pour plus d'informations sur l'attribution de l'accès, consultez [Je ne peux pas me connecter à Amazon S3](https://docs.aws.amazon.com/quicksight/latest/user/troubleshoot-connect-S3.html).

#### Déployer une pile CloudFormation pour QuickSight dans le compte de rapports central

1. Téléchargez le [Modèle CloudFormation d'exemple pour la visualisation Amazon QuickSight](https://github.com/aws-samples/cloud-operations-best-practices/blob/main/cloud-operations-best-practices/static/cfn-templates/patch-reporting/quicksight.yaml) sur votre machine locale.
1. Dans le compte de rapports central et la région, accédez à la [console AWS CloudFormation](https://console.aws.amazon.com/cloudformation/home).
1. Dans le volet de navigation de gauche, choisissez **Stacks**, puis choisissez **Create stack**.
1. Dans la liste déroulante, choisissez **With new resources (standard)**.
1. Sur la page **Create stack**, sélectionnez **Upload a template file**, sélectionnez **Choose file**, choisissez le fichier `quicksight.yaml`, puis choisissez **Next**.
1. Sur la page **Specify stack details**, effectuez les étapes suivantes :
    1. Pour **Stack name**, entrez un nom descriptif, tel que `quicksight`.
    1. Pour **QuickSightUser**, entrez le nom de l'utilisateur QuickSight auquel les permissions seront accordées pour les sources de données et le tableau de bord d'analyse QuickSight.
    1. Pour **Workgroup**, laissez la valeur par défaut `patch-workgroup`.
    1. Choisissez **Next**.
1. Sur la page **Configure stack options**, ajoutez les balises requises, puis choisissez **Next**.
1. Sur la page **Review and create**, vérifiez toutes les informations, puis choisissez **Submit** pour créer votre pile.

Après le rafraîchissement de la page, le statut de votre pile devrait être `CREATE_IN_PROGRESS`. Lorsque le statut passe à `CREATE_COMPLETE`, déployez les synchronisations de données de ressources dans le(s) compte(s) membre(s)/région(s).

### Phase 2 : Configuration des comptes membres

#### Modèle CloudFormation d'exemple pour la synchronisation de données de ressources organisationnelle

Ci-dessous, vous trouverez des détails sur les ressources créées par le modèle CloudFormation et leur objectif.

[Modèle CloudFormation d'exemple pour la synchronisation de données de ressources organisationnelle](https://github.com/aws-samples/cloud-operations-best-practices/blob/main/cloud-operations-best-practices/static/cfn-templates/patch-reporting/organization-resource-data-sync.yaml)

| Nom de la ressource | Objectif |
| -------- | ------ |
| **Ressources de synchronisation de données de ressources** | |
| ResourceDataSyncLambdaRole | Rôle de service IAM pour Lambda afin de créer la synchronisation de données de ressources organisationnelle |
| ResourceDataSyncLambdaFunction | Fonction Lambda pour créer la synchronisation de données de ressources organisationnelle |
| ResourceDataSyncCustomResource | Ressource personnalisée CFN pour invoquer la fonction Lambda |

#### Déployer un StackSet CloudFormation

La procédure suivante utilisera un compte administrateur délégué pour CloudFormation afin de déployer un StackSet avec des [permissions gérées par le service](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-orgs-associate-stackset-with-org.html) pour déployer la synchronisation de données de ressources compatible avec l'organisation AWS.

1. Téléchargez le [Modèle CloudFormation d'exemple pour les synchronisations de données de ressources organisationnelles](https://github.com/aws-samples/cloud-operations-best-practices/blob/main/cloud-operations-best-practices/static/cfn-templates/patch-reporting/organizational-resource-data-sync.yaml) sur votre machine locale.
1. Dans le compte administrateur délégué pour CloudFormation, accédez à la [console AWS CloudFormation](https://console.aws.amazon.com/cloudformation/home).
1. Dans le volet de navigation de gauche, choisissez **StackSets**, puis choisissez **Create StackSet**.
1. Sur la page **Choose a template**, effectuez les étapes suivantes :
    1. Pour **Permission model**, laissez l'option par défaut sélectionnée, **Service-managed permissions**.
    1. Pour **Prerequisite - Prepare template**, laissez l'option par défaut sélectionnée, **Template is ready**.
    1. Pour **Specify template**, choisissez **Upload a template file**, sélectionnez **Choose file**, choisissez le fichier `organization-resource-data-sync.yaml`, puis choisissez **Next**.
1. Sur la page **Specify StackSet details**, effectuez les étapes suivantes :
    1. Pour **StackSet name**, entrez un nom descriptif, tel que `org-resource-data-sync`.
    1. Pour **Name of the resource data sync S3 bucket**, entrez le nom du bucket S3 que vous avez créé dans la section précédente.
    :::tip
    Dans le compte de rapports central, vous pouvez trouver le nom du bucket S3 dans les **Outputs** de la pile CloudFormation provisionnée.
    ![Sorties de la pile CloudFormation montrant le nom du bucket S3 de synchronisation de données de ressources](/img/cloudops/recipes/central-reporting/patch-reporting-cfn-outputs.png "Sorties de la pile CloudFormation montrant le nom du bucket S3 de synchronisation de données de ressources")
    :::
    1. Pour **Prefix for the resource data sync S3 bucket**, entrez un nom pour le préfixe utilisé pour le bucket S3, tel que `ResourceDataSync`.
    1. Pour **AWS Region for the resource data sync S3 bucket**, entrez la région pour le bucket S3 de synchronisation de données de ressources.
    1. Pour **Name of the resource data sync**, entrez le nom de la synchronisation de données de ressources.
    1. Choisissez **Next**.
1. Sur la page **Configure StackSet options**, ajoutez les balises requises, sélectionnez **I acknowledge that AWS CloudFormation might create IAM resources**, puis choisissez **Next**.
1. Sur la page **Set deployment options**, effectuez les étapes suivantes :
    1. Pour **Deployment targets**, choisissez de déployer vers l'organisation ou vers des unités organisationnelles (OU) spécifiques.
    :::tip
    Il est recommandé de déployer les synchronisations de données de ressources dans tous les comptes et régions où vous avez des nœuds gérés par AWS Systems Manager pour garantir que toutes les métadonnées d'inventaire et de correctifs disponibles sont agrégées dans un seul bucket S3 pour les requêtes, les rapports et la visualisation.
    :::
    1. Pour **Specify Regions**, sélectionnez les régions où vous souhaitez déployer la synchronisation de données de ressources.
    1. Laissez toutes les autres options à leurs valeurs par défaut et choisissez **Next**.
1. Sur la page **Review**, vérifiez toutes les informations, puis choisissez **Submit** pour créer votre StackSet.

Après le rafraîchissement de la page, vous pourrez voir votre StackSet. Le statut passera à `SUCCEEDED` après sa création.

## Phase 3 : Vérification et tests

### Vérifier les métadonnées dans le bucket S3 de synchronisation de données de ressources

Dans le compte de rapports central, accédez à la [console Amazon S3](https://console.aws.amazon.com/s3/home) et sélectionnez le bucket S3 créé par CloudFormation nommé de manière similaire à `ssm-resource-sync-${region}-${account-id}`. Dans le bucket S3, sélectionnez le préfixe de bucket que vous avez fourni lors du [déploiement du StackSet CloudFormation](#déployer-un-stackset-cloudformation).

Dans le bucket, vous pouvez voir les différents types de données synchronisés automatiquement par la synchronisation de données de ressources. Si vous avez précédemment configuré la collecte de métadonnées d'inventaire et effectué au moins une opération de scan de correctifs, vous devriez voir des dossiers supplémentaires (par exemple `AWS:Application`, `AWS:AWSComponent`) dans le bucket S3. Chaque dossier représente des [métadonnées collectées par l'inventaire](https://docs.aws.amazon.com/systems-manager/latest/userguide/inventory-schema.html).

![Dossiers du bucket S3 pour les métadonnées de synchronisation de données de ressources](/img/cloudops/recipes/central-reporting/s3-bucket-objects.png "Dossiers du bucket S3 pour les métadonnées de synchronisation de données de ressources")

Au sein de chacun des préfixes de type de données, il y aura un préfixe pour chaque compte utilisant la synchronisation de données de ressources avec ce bucket S3. Celui-ci est suivi d'un préfixe pour chaque région qui signale l'inventaire, puis d'un préfixe pour le type de ressource, qui sera généralement `ManagedInstanceInventory`. Ensuite, dans ce préfixe, il y aura un fichier JSON pour chaque instance qui signale des données d'inventaire.

### Vérifier l'accès à l'analyse QuickSight

Vérifiez que vous avez accès au tableau de bord d'analyse QuickSight créé par CloudFormation en accédant à la [console QuickSight](https://quicksight.aws.amazon.com/sn/start/analyses).

Si vous ne voyez pas l'analyse nommée **Managed Node Analysis CFN**, assurez-vous que vous êtes connecté à QuickSight avec le même utilisateur que celui spécifié dans le paramètre CloudFormation `QuickSightUser`. Vous pouvez vérifier l'utilisateur avec lequel vous êtes connecté à QuickSight en sélectionnant votre profil dans le coin supérieur droit.

![Analyse QuickSight créée par CloudFormation](/img/cloudops/recipes/central-reporting/quicksight-analysis.png "Analyse QuickSight créée par CloudFormation")

## Interroger la conformité des correctifs

### Examiner le crawler Glue

Maintenant que la synchronisation de données de ressources a synchronisé les données Systems Manager vers le bucket S3, nous pouvons utiliser un crawler Glue pour créer des tables à partir des fichiers JSON. Le crawler Glue est configuré pour s'exécuter une fois par jour à 00:00 UTC. Vous pouvez soit attendre que le crawler Glue s'exécute, soit exécuter manuellement le crawler et générer des tables à interroger dans Athena.

1. Ouvrez la [console AWS Glue](https://console.aws.amazon.com/glue/home/v2/home) et dans le volet de navigation, choisissez **Crawlers** sous l'en-tête **Data Catalog**.
1. Sélectionnez le **SSM-GlueCrawler** et choisissez **Run**.

Le crawler devrait s'exécuter pendant environ 2 à 4 minutes avant de s'arrêter. Une fois que le crawler est revenu à l'état Ready, vérifiez que des tables ont été ajoutées à la base de données résultante en choisissant **Tables** dans le volet de navigation.

### Interroger à l'aide d'Athena

1. Connectez-vous au [compte AWS de rapports central](#compte-de-rapports-central) où vous avez déployé les ressources KMS, S3, Glue et Athena.
1. Ouvrez la [console Amazon Athena](https://console.aws.amazon.com/athena/home) et dans le volet de navigation, choisissez **Query editor**.
1. Dans le coin supérieur droit, pour **Workgroup**, choisissez **patch-workgroup**.
1. Pour **Workgroup patch-workgroup settings**, choisissez **Acknowledge**.
1. Choisissez l'onglet **Saved queries** pour voir les exemples de requêtes.
1. Sélectionnez une requête enregistrée, telle que **QueryNonCompliantPatch**, et choisissez **Run**.
1. Validez que les résultats de la requête sont retournés pour les nœuds gérés auxquels il manque des mises à jour et qui ne sont pas conformes.

![Résultats de la requête Athena pour QueryNonCompliantPatch](/img/cloudops/recipes/central-reporting/athena-query-results.png "Résultats de la requête Athena pour QueryNonCompliantPatch")

:::warning
Pour utiliser les **Saved queries** nommées **QuerySSMAgentVersion** et **QueryInstanceApplications**, vous devez activer [Systems Manager Inventory](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-inventory.html). Vous pouvez rapidement activer Systems Manager Inventory lors de l'intégration à la [console unifiée Systems Manager](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-setting-up-organizations.html).
:::

### Exemples de requêtes Athena supplémentaires

#### Regrouper les mises à jour pour les nœuds gérés non conformes

L'exemple de requête Athena suivant regroupe les mises à jour non conformes par nœud géré.

<Tabs
    defaultValue="query"
    values={[
        {label: 'Requête', value: 'query'},
        {label: 'Résultats', value: 'results'},
    ]}>
<TabItem value="query">

```sql
-- Query to aggregate non-compliant patch compliance items by resource (limited to 20 results)
SELECT 
    ci.resourceid,
    ci.status,
    ci.patchstate,
    LISTAGG(DISTINCT ci.id, ', ') WITHIN GROUP (ORDER BY ci.id) AS ids
FROM 
    aws_complianceitem ci
WHERE 
    ci.compliancetype = 'Patch'
    AND ci.status = 'NON_COMPLIANT'
GROUP BY 
    ci.resourceid,
    ci.status,
    ci.patchstate
ORDER BY 
    ci.resourceid
LIMIT 20;
```

</TabItem>

<TabItem value="results">

![Exemples de résultats de requête lors du regroupement des mises à jour par nœud géré](/img/cloudops/recipes/central-reporting/group-updates-per-node.png "Exemples de résultats de requête lors du regroupement des mises à jour par nœud géré")

</TabItem>
</Tabs>

#### Filtrer les nœuds gérés non actifs

Les synchronisations de données de ressources envoient les métadonnées d'inventaire et de conformité des correctifs vers les buckets S3. Lorsqu'une instance EC2 gérée est arrêtée ou terminée, les métadonnées `AWS:InstanceInformation` sont mises à jour pour refléter le nouvel état. Pour les nœuds gérés hybrides, ce statut est mis à jour en fonction de l'état de connectivité de l'agent SSM. Ces valeurs sont indiquées dans la clé `InstanceStatus` qui peut avoir les valeurs suivantes :

* `Active` - L'agent SSM (sur l'instance EC2 ou le nœud géré hybride) est activement en cours d'exécution et communique avec AWS Systems Manager.
* `Stopped` - L'instance EC2 est dans un état `Stopped`.
* `Terminated` - L'instance EC2 a été terminée (supprimée).
* `ConnectionLost` - L'agent SSM sur le nœud géré hybride ne peut pas communiquer avec AWS Systems Manager.

:::tip
Les synchronisations de données de ressources ne suppriment pas les fichiers JSON du bucket S3 spécifié. Pour nettoyer automatiquement les fichiers JSON de métadonnées des nœuds gérés pour les instances EC2 terminées ou les nœuds gérés hybrides désenregistrés, vous pouvez utiliser les [politiques de cycle de vie S3](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html) pour supprimer automatiquement les objets. Par exemple, vous pouvez implémenter une politique de bucket S3 qui expire les objets obsolètes qui n'ont pas été mis à jour depuis 60 jours. Le modèle CloudFormation d'exemple dans la section, [Modèle CloudFormation d'exemple pour la synchronisation de données de ressources organisationnelle](#modèle-cloudformation-dexemple-pour-la-synchronisation-de-données-de-ressources-organisationnelle), inclut une `LifecycleConfiguration` commentée commençant à la ligne 154.
:::

Vous pouvez utiliser `InstanceStatus` pour filtrer les instances arrêtées ou terminées ou les nœuds gérés hybrides dans un état de connexion perdue dans vos requêtes Athena. Par exemple, la requête suivante retourne les métadonnées `AWS:InstanceInformation` uniquement pour les nœuds gérés `Active`.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs
    defaultValue="query"
    values={[
        {label: 'Requête', value: 'query'},
        {label: 'Résultats', value: 'results'},
    ]}>
<TabItem value="query">

```sql
-- Query to return only Active managed nodes
SELECT 
    ii.accountid,
    ii.region,
    ii.resourceid,
    ii.computername,
    ii.ipaddress,
    ii.instancestatus,
    ii.platformtype,
    ii.platformname,
    ii.platformversion,
    ii.agenttype,
    ii.agentversion,
    ii.capturetime
FROM 
    aws_instanceinformation ii
WHERE 
    ii.instancestatus = 'Active'
LIMIT 20;
```

</TabItem>

<TabItem value="results">

![Exemples de résultats de requête pour retourner uniquement les nœuds gérés actifs](/img/cloudops/recipes/central-reporting/active-instance-query-results.png "Exemples de résultats de requête pour retourner uniquement les nœuds gérés actifs")

</TabItem>
</Tabs>

## Visualiser la conformité des correctifs à l'aide de QuickSight

La pile CloudFormation déployée dans [Déployer une pile CloudFormation pour QuickSight dans le compte de rapports central](#déployer-une-pile-cloudformation-pour-quicksight-dans-le-compte-de-rapports-central) a créé des jeux de données QuickSight et un tableau de bord d'analyse vide afin que vous puissiez commencer à visualiser les métadonnées de conformité des correctifs et d'inventaire.

Pour créer des visuels QuickSight, suivez les procédures dans les deux sujets listés ci-dessous :

1. [Partie 1 : Créer des visuels QuickSight basés sur les métadonnées des nœuds gérés](https://catalog.workshops.aws/getting-started-with-com/en-US/advanced-workshops/organization-patch-reporting/create-quicksight-visuals-and-dashboard)
1. [Partie 2 : Créer des visuels AWS QuickSight pour les informations de conformité des correctifs](https://catalog.workshops.aws/getting-started-with-com/en-US/advanced-workshops/organization-patch-reporting/create-quicksight-visuals-for-patch-compliance)

En suivant les deux sujets ci-dessus, vous pouvez créer un tableau de bord QuickSight avec deux feuilles qui ressemblent à ceci :

<Tabs
    defaultValue="instanceinfo"
    values={[
        {label: 'Informations d\'instance', value: 'instanceinfo'},
        {label: 'Conformité des correctifs', value: 'patchcompliance'},
    ]}>
<TabItem value="instanceinfo">

![Exemple de tableau de bord QuickSight pour les informations d'instance](/img/cloudops/recipes/central-reporting/example-instance-information-dashboard.png "Exemple de tableau de bord QuickSight pour les informations d'instance")

</TabItem>

<TabItem value="patchcompliance">

![Exemple de tableau de bord QuickSight pour la conformité des correctifs](/img/cloudops/recipes/central-reporting/example-patch-compliance-dashboard.png "Exemple de tableau de bord QuickSight pour la conformité des correctifs")

</TabItem>
</Tabs>

## Nettoyage des ressources déployées

:::warning
Les modèles CloudFormation d'exemple de cette recette suppriment le contenu des buckets S3 lors de la suppression de la pile CloudFormation du compte de rapports central.
:::

Pour nettoyer les ressources d'exemple créées dans la [Phase 2 : Configuration des comptes membres](#phase-2--configuration-des-comptes-membres), vous devez d'abord [supprimer les instances de pile dans votre StackSet](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stackinstances-delete.html) puis [supprimer le StackSet](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-delete.html).

Pour nettoyer les ressources d'exemple créées dans la [Phase 1 : Configuration du compte central](#phase-1--configuration-du-compte-central), effectuez les étapes suivantes :

1. Supprimez les ressources dans la pile `quicksight` déployée dans la section [Déployer une pile CloudFormation pour QuickSight dans le compte de rapports central](#déployer-une-pile-cloudformation-pour-athena-dans-le-compte-de-rapports-central).
1. Supprimez les ressources dans la pile `patch-reporting` déployée dans la section [Déployer une pile CloudFormation pour Athena dans le compte de rapports central](#déployer-une-pile-cloudformation-pour-athena-dans-le-compte-de-rapports-central).

Pour plus d'informations sur la suppression des piles CloudFormation, consultez [Supprimer une pile depuis la console CloudFormation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-console-delete-stack.html).

## Étapes suivantes

Ci-dessous, vous trouverez une série de blogs AWS connexes pouvant servir de référence pour améliorer vos opérations de correction et vos mécanismes de rapports.

* [Automatiser les rapports de correction Systems Manager via des notifications par e-mail et Slack dans une organisation AWS](https://aws.amazon.com/blogs/mt/automate-systems-manager-patching-reports-via-email-and-slack-notifications-in-an-aws-organization/)
  * *Dans cet article de blog, nous explorons comment automatiser la création et la distribution de rapports de correction, en rationalisant le processus de suivi des opérations de correction. En exploitant les services AWS tels qu'AWS Lambda, Amazon EventBridge, AWS Step Functions et Amazon DynamoDB, vous pouvez consolider les détails d'exécution de Systems Manager Patch Manager à partir de plusieurs comptes, générer des rapports complets et les distribuer via des notifications par e-mail et Slack, donnant à votre équipe les informations nécessaires pour maintenir une infrastructure sécurisée et conforme.*
* [Dépannage de la correction AWS Systems Manager simplifié grâce aux recommandations automatisées d'Amazon Bedrock](https://aws.amazon.com/blogs/mt/troubleshooting-aws-systems-manager-patching-made-easy-with-amazon-bedrocks-automated-recommendations/)
  * *Dans cet article, nous explorons comment Amazon Bedrock peut simplifier le processus de dépannage des échecs de correction de Systems Manager. Les capacités d'analyse automatisée et de recommandation de Bedrock peuvent vous aider à identifier rapidement les causes profondes des problèmes de correction et à implémenter les bonnes solutions, vous faisant gagner un temps et des efforts précieux.*
* [Visualiser les informations d'AWS Systems Manager Patch Manager à l'aide d'Amazon QuickSight](https://aws.amazon.com/blogs/mt/visualize-aws-systems-manager-patch-manager-information-using-amazon-quicksight/)
  * *Dans cet article de blog, apprenez à créer un tableau de bord Amazon QuickSight pour visualiser les informations critiques de correctifs et d'inventaire afin d'accélérer le MTTR. Vous pouvez également utiliser des filtres pour rechercher un compte AWS spécifique, une région AWS spécifique, un nom Amazon Elastic Compute Cloud (Amazon EC2), ou vérifier les packages installés/manquants.*
* [Automatiser la gestion et la remédiation des vulnérabilités dans AWS à l'aide d'Amazon Inspector et d'AWS Systems Manager – Partie 1](https://aws.amazon.com/blogs/mt/automate-vulnerability-management-and-remediation-in-aws-using-amazon-inspector-and-aws-systems-manager-part-1/)
  * *Dans la partie 1 de cette série, vous apprendrez à remédier aux résultats d'Inspector pour une vulnérabilité spécifique affectant plusieurs instances EC2. Dans la partie 2, vous apprendrez à invoquer directement le runbook d'automatisation Systems Manager pour remédier à tous les résultats d'Amazon Inspector pour les instances EC2 en utilisant des balises de ressources et la sévérité des résultats d'Amazon Inspector.*

## Glossaire terminologique technique

| Terme | Définition |
|---|---|
| AWS Glue Crawler | Un service qui découvre et catalogue automatiquement les métadonnées à partir de sources de données, créant des tables dans le catalogue de données AWS Glue. |
| AWS Organizations | Un service pour gérer et gouverner de manière centralisée plusieurs comptes AWS en tant qu'organisation unique. |
| Custom Resource | Un type de ressource CloudFormation qui vous permet d'écrire une logique de provisionnement personnalisée dans les modèles. |
| Delegated Administrator | Un compte AWS auquel des permissions ont été accordées pour administrer certains services AWS au nom d'une organisation AWS. |
| Managed Node | Tout serveur (instance EC2 ou VM sur site ou dans d'autres clouds) configuré pour être géré par AWS Systems Manager. Nécessite l'installation et la configuration correcte de l'agent SSM. |
| Patch Baseline | Un ensemble de règles qui définissent quels correctifs doivent être installés sur vos nœuds gérés, y compris les règles d'approbation pour différents niveaux de sévérité. |
| Patch Compliance | L'état d'un nœud géré concernant les correctifs requis. Un nœud est conforme lorsque tous les correctifs requis sont installés conformément à la ligne de base de correctifs associée. |
| Patch Group | Un mécanisme de regroupement basé sur les balises qui associe les nœuds gérés à des lignes de base de correctifs spécifiques. |
| Resource Data Sync | Une fonctionnalité de Systems Manager qui agrège automatiquement les données d'inventaire des nœuds gérés vers un bucket S3 central, permettant des rapports consolidés. |
| Service-Managed Permissions | Un modèle de permissions StackSet qui utilise AWS Organizations pour déployer des instances de pile dans les comptes de votre organisation. |
| SSM Agent | Un logiciel AWS installé sur les nœuds gérés qui permet à Systems Manager de mettre à jour, gérer et configurer ces ressources. |
| StackSet | Une fonctionnalité CloudFormation qui vous permet de créer, mettre à jour ou supprimer des piles dans plusieurs comptes et régions avec une seule opération. |
