---
sidebar_position: 3
---

# Migration de CloudTrail Lake vers Amazon CloudWatch

## Vue d'ensemble

Ce guide fournit une approche etape par etape pour migrer d'AWS CloudTrail Lake vers Amazon CloudWatch comme destination principale pour l'analyse de vos evenements CloudTrail. Il vous accompagne a travers une migration structuree en trois phases -- exportation des donnees historiques, activation de la nouvelle ingestion CloudTrail via des regles d'activation de telemetrie, et configuration de la centralisation inter-comptes/inter-regions -- afin que vous puissiez unifier l'activite CloudTrail avec vos autres telemetries operationnelles et de securite dans le magasin de donnees unifie CloudWatch. Le guide couvre egalement l'estimation des couts, la traduction des requetes du SQL CloudTrail Lake vers CloudWatch Logs Insights, l'optimisation de la tarification de la centralisation, les bonnes pratiques de securite pour vos groupes de journaux et la creation de tableaux de bord pour une visibilite de securite en quasi-temps reel.

### Pourquoi migrer ?

Les organisations utilisant CloudTrail Lake aujourd'hui font face a un defi commun : les donnees CloudTrail sont isolees des autres telemetries operationnelles et de securite, rendant les investigations d'incidents lentes et fragmentees a travers plusieurs outils et langages de requete. [Amazon CloudWatch Unified Data Store](https://aws.amazon.com/blogs/aws/amazon-cloudwatch-introduces-unified-data-management-and-analytics-for-operations-security-and-compliance/) resout ce probleme en fournissant un referentiel centralise qui reunit l'activite CloudTrail aux cotes des journaux de flux VPC, des journaux AWS WAF, des journaux applicatifs et des donnees de securite tierces -- permettant une analyse correlee via [CloudWatch Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html) et des outils compatibles Apache Iceberg comme [Amazon Athena](https://docs.aws.amazon.com/athena/latest/ug/what-is.html) et [Amazon Redshift](https://docs.aws.amazon.com/redshift/latest/mgmt/welcome.html).

### Avantages cles de la migration

1. **Telemetrie unifiee** : Correlez les journaux a travers les services AWS (CloudTrail, VPC Flow Logs, WAF, Route 53, EKS, NLB et plus), les sources tierces (CrowdStrike, SentinelOne, Okta, Palo Alto Networks et autres) et les journaux applicatifs personnalises dans une seule interface de requete via le magasin de donnees unifie CloudWatch.
2. **Decouverte automatique du schema** : CloudWatch decouvre et indexe automatiquement les champs CloudTrail avec des facettes par defaut comme `@data_source_name` pour la decouverte dynamique des groupes de journaux. Pour plus d'informations, voir [Data source discovery and management](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/data-source-discovery-management.html).
3. **Pas de dependance au nom du groupe de journaux** : Interrogez toutes les donnees CloudTrail en utilisant `SOURCE logGroups() | filterIndex @data_source_name in ["aws_cloudtrail"]` independamment du nom du groupe de journaux.
4. **Enrichissement natif** : Utilisez [CloudWatch Logs Transformation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch-Logs-Transformation.html) pour ajouter du contexte de securite, des etiquettes de conformite et des labels d'environnement au moment de l'ingestion sans fonctions Lambda personnalisees.
5. **Centralisation inter-comptes/inter-regions** : Consolidez les donnees CloudTrail de tous les comptes et regions dans une seule destination pour la securite, la conformite et la reponse aux incidents. Pour plus d'informations, voir [Cross-account cross-Region log centralization](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatchLogs_Centralization.html).
6. **Une plateforme, plus de valeur** : Le magasin de donnees unifie CloudWatch va au-dela des services de requete autonomes en unifiant les journaux AWS, les sources de securite tierces et les donnees applicatives personnalisees dans une seule plateforme avec normalisation integree et correlation inter-sources.

### Approche de migration en trois phases

La migration suit une approche structuree en trois phases :

![Approche de migration en trois phases CloudTrail Lake](/img/cloudops/guides/cloudtrail-lake/cloudtrail_lake_to_cloudwatch/three-phase-migration-approach.png "Approche de migration en trois phases CloudTrail Lake")

### Estimer les couts de migration

Une fois que vous migrez de CloudTrail Lake vers CloudWatch, les nouveaux evenements CloudTrail seront ingeres directement dans CloudWatch Logs de maniere continue. Comprendre les implications en termes de couts de cette migration est important pour la planification budgetaire et l'optimisation des couts.

Pour estimer votre cout mensuel projete CloudWatch Logs, examinez votre utilisation actuelle de CloudTrail Lake dans **AWS Cost Explorer** en filtrant par le service CloudTrail et en regroupant par type d'utilisation. Consultez [Viewing your CloudTrail cost and usage with AWS Cost Explorer](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-costs.html) pour identifier les types d'utilisation CloudTrail Lake pour votre magasin de donnees d'evenements (tels que les octets d'ingestion). Cost Explorer affiche la valeur d'ingestion en Go, que vous pouvez utiliser pour estimer votre cout d'ingestion CloudWatch Logs en utilisant la derniere [tarification CloudWatch](https://aws.amazon.com/cloudwatch/pricing/) pour la livraison CloudTrail et l'ingestion CloudWatch Logs.

:::info
Note : Cette estimation couvre uniquement les couts d'ingestion et de livraison et n'inclut aucun cout supplementaire associe a CloudWatch Logs tel que le stockage et les requetes.
:::

---

## Phase 1 -- Exporter les donnees historiques de CloudTrail Lake vers CloudWatch

L'exportation de vos donnees historiques CloudTrail Lake vers CloudWatch assure la continuite de votre piste d'audit et permet l'interrogation unifiee entre les evenements historiques et les nouveaux evenements. Cette phase se concentre sur le deplacement des donnees de vos magasins de donnees d'evenements (EDS) existants vers CloudWatch Logs.

### Exportation des donnees CloudTrail Lake vers CloudWatch - Executer l'exportation

1. Naviguez vers la [console CloudTrail](https://console.aws.amazon.com/cloudtrailv2/#/lake).
1. Dans le menu de navigation de gauche, choisissez **Lake**.
1. Choisissez les **Event Data Stores**.
1. Choisissez votre **Event Data Store** pour les evenements CloudTrail.
1. Dans le menu deroulant **Actions**, choisissez **Export to CloudWatch**.

    ![Menu Actions du magasin de donnees d'evenements CloudTrail Lake montrant l'option Export to CloudWatch.](/img/cloudops/guides/cloudtrail-lake/cloudtrail_lake_to_cloudwatch/cloudtrail_lake_to_cloudwatch_01.png "Menu Actions du magasin de donnees d'evenements CloudTrail Lake montrant l'option Export to CloudWatch.")

1. Choisissez la **plage de temps** pour exporter les donnees du magasin de donnees d'evenements.
1. Configurez le **role IAM** en utilisant les instructions fournies pour creer un nouveau role IAM ou fournir un role IAM existant que CloudTrail utilisera pour acceder a vos donnees pour l'exportation.
1. Choisissez **Export**.

    ![Ecran de configuration d'exportation vers CloudWatch montrant la selection de plage de temps et la configuration du role IAM.](/img/cloudops/guides/cloudtrail-lake/cloudtrail_lake_to_cloudwatch/cloudtrail_lake_to_cloudwatch_02.png "Ecran de configuration d'exportation vers CloudWatch montrant la selection de plage de temps et la configuration du role IAM.")

:::info
Les donnees exportees utilisent la classe de stockage Infrequent Access, necessitant CloudWatch Logs Insights pour interroger les informations de journal. Les groupes de journaux crees avec le stockage Infrequent Access n'affichent pas les resultats d'exportation directement dans les Log Streams sur la console. De plus, les donnees anterieures a 2023 ne peuvent pas etre migrees de CloudTrail Lake vers Amazon CloudWatch. Si vous avez besoin d'acceder aux evenements plus anciens que 2023, vous pouvez continuer a les interroger directement dans CloudTrail Lake, ou exporter les donnees vers un compartiment S3. Pour plus d'informations, consultez la documentation suivante sur [Exporting data from CloudTrail Lake Event Data Store to CloudWatch](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-lake-export-cloudwatch.html) et pour l'exportation d'un sous-ensemble d'evenements AWS CloudTrail Lake vers Amazon S3, consultez ce [blog AWS](https://aws.amazon.com/blogs/mt/exporting-a-subset-of-aws-cloudtrail-lake-events-to-amazon-s3/).
:::

---

## Phase 2 -- Activer la nouvelle ingestion CloudTrail via les regles d'activation de telemetrie

Avec vos donnees historiques CloudTrail Lake maintenant accessibles dans CloudWatch, l'etape suivante consiste a commencer a ingerer de nouveaux evenements CloudTrail directement dans le [magasin de donnees unifie CloudWatch](https://aws.amazon.com/blogs/aws/amazon-cloudwatch-introduces-unified-data-management-and-analytics-for-operations-security-and-compliance/). Cette etape est independante de toute piste CloudTrail existante ou magasin de donnees d'evenements CloudTrail Lake. Elle etablit un nouveau chemin dedie pour que l'activite CloudTrail soit transmise a CloudWatch. En utilisant les capacites de [configuration de telemetrie](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/telemetry-config-rules.html) de CloudWatch, vous pouvez configurer l'ingestion automatisee des evenements CloudTrail directement via CloudWatch. Une fois activee, chaque nouvel evenement CloudTrail est livre aux cotes de vos autres telemetries operationnelles et de securite, pret pour l'interrogation unifiee, les alertes et l'analyse.

### Creer une regle d'activation de telemetrie pour CloudTrail

1. Ouvrez la [console CloudWatch](https://console.aws.amazon.com/cloudwatch/).
1. Dans le panneau de navigation de gauche, cliquez sur **Ingestion**.
1. Cliquez sur le bouton **Enable Resource Discovery**.
1. CloudWatch creera automatiquement les roles lies au service necessaires.
1. Dans l'onglet **Data Sources**, localisez **AWS CloudTrail** dans la liste des services disponibles.
1. Choisissez **Configure telemetry** a cote de **AWS CloudTrail**.
1. Sur la page **Specify Scope**, laissez le **Rule name** par defaut et choisissez **Next**. (**Note :** Pour les regles au niveau de l'organisation, vous pouvez configurer la portee du compte source dans les parametres de selection).

    ![Onglet des regles d'activation de la configuration de telemetrie CloudWatch montrant l'assistant d'ajout de regle pour CloudTrail.](/img/cloudops/guides/cloudtrail-lake/cloudtrail_lake_to_cloudwatch/cloudtrail_lake_to_cloudwatch_03.png "Onglet des regles d'activation de la configuration de telemetrie CloudWatch montrant l'assistant d'ajout de regle pour CloudTrail.")

1. Sur la page **Specify Destination**, effectuez les etapes suivantes :
    -   Pour **Send to**, laissez la valeur par defaut CloudWatch Logs.
    -   Pour **Log group name pattern**, laissez la valeur par defaut `aws/cloudtrail/[event-type]`.
    -   Pour **Retention period**, choisissez la periode de retention selon vos exigences de conformite. (**Note :** L'integration CloudWatch vers CloudTrail livre les journaux directement aux comptes membres. La periode de retention que vous configurez ici s'applique aux groupes de journaux dans chaque compte membre. La periode de retention peut etre differente du groupe de journaux source et du groupe de journaux centralise. Pour des informations supplementaires, consultez la section [Optimisation des couts de stockage des journaux pour la centralisation CloudWatch Logs](/guides/cloudtrail/CloudTrail%20Lake/cloudtrail_lake_to_cloudwatch#optimizing-log-storage-costs-for-cloudwatch-logs-centralization))
1. Choisissez **Next**.

    ![Onglet des regles d'activation de la configuration de telemetrie CloudWatch montrant la section Specify destination pour CloudTrail.](/img/cloudops/guides/cloudtrail-lake/cloudtrail_lake_to_cloudwatch/cloudtrail_lake_to_cloudwatch_04.png "Onglet des regles d'activation de la configuration de telemetrie CloudWatch montrant la section Specify destination pour CloudTrail.")

1. Sur la page **Select Data Options**, pour **Event type**, selectionnez les evenements que vous souhaitez ingerer -- soit **Management events** soit **Data events**.

    ![Onglet des regles d'activation de la configuration de telemetrie CloudWatch montrant les options de selection de donnees pour CloudTrail.](/img/cloudops/guides/cloudtrail-lake/cloudtrail_lake_to_cloudwatch/cloudtrail_lake_to_cloudwatch_05.png "Onglet des regles d'activation de la configuration de telemetrie CloudWatch montrant les options de selection de donnees pour CloudTrail.")

1. Choisissez **Next**.
1. Sur la page **Review and Create**, passez en revue les parametres de configuration et choisissez **Configure CloudTrail enablement**.

Les regles de configuration de telemetrie sont alors creees pour demarrer l'ingestion des evenements CloudTrail. Les groupes de journaux sont ensuite crees avec le modele de denomination ci-dessous.

| Type d'evenement    | Modele de nom du groupe de journaux | Description            |
|---------------------|-------------------------------------|------------------------|
| Evenements de gestion | `aws/cloudtrail/managementevents`  | Tous les evenements de gestion |
| Evenements de donnees | `aws/cloudtrail/dataevents`        | Tous les evenements de donnees |

### Valider l'ingestion CloudTrail

Apres avoir active l'ingestion directe de CloudTrail dans CloudWatch, envisagez de maintenir a la fois votre magasin de donnees d'evenements CloudTrail Lake et votre ingestion CloudTrail pour CloudWatch en fonctionnement parallele. Validez votre ingestion CloudWatch en l'executant pendant au moins un jour pour confirmer que tous les evenements CloudTrail sont captures comme prevu. Si votre validation necessite plus de temps, examinez le cout potentiel de l'execution des deux services en parallele et consultez votre equipe de compte AWS pour obtenir des conseils avant de proceder. Apres une validation reussie, vous pouvez alors arreter l'ingestion sur votre magasin de donnees d'evenements CloudTrail Lake.

:::info
Pour plus d'informations, voir [Working with telemetry enablement rules](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/telemetry-config-rules.html) et [Simplified enablement of CloudTrail events in CloudWatch](https://aws.amazon.com/about-aws/whats-new/2025/12/key-enhancements-cloudtrail-events-cloudwatch/).
:::

---

## Phase 3 -- Configurer la centralisation inter-comptes/inter-regions

Vous avez migre vos donnees historiques CloudTrail Lake dans CloudWatch, active l'ingestion CloudTrail avec les regles d'activation de telemetrie et il est maintenant temps de tout rassembler dans un compte centralise pour la surveillance unifiee, l'analyse et la conformite.

Avoir les donnees CloudTrail qui circulent dans le magasin de donnees unifie CloudWatch dans chaque compte individuel est une premiere etape, mais centraliser toute l'activite CloudTrail dans un seul compte de destination fournit a vos equipes de securite, equipes de conformite et intervenants en cas d'incident une vue unifiee de toute l'activite API a travers l'ensemble de votre organisation AWS -- un tableau de bord unique pour la surveillance de securite et la reponse aux incidents.

[La centralisation inter-comptes inter-regions de CloudWatch Logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatchLogs_Centralization.html) s'integre avec [AWS Organizations](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_introduction.html) pour collecter les donnees de journaux de plusieurs comptes membres dans un emplacement central en utilisant des regles de centralisation. Vous definissez des regles qui repliquent automatiquement les donnees de journaux de plusieurs comptes et regions AWS dans votre compte centralise.

Chaque compte membre conserve sa propre copie des journaux pour l'acces local et le depannage, tandis que vos equipes centrales de securite et de conformite recoivent leur propre copie consolidee pour la visibilite et l'analyse a l'echelle de l'organisation.

### Comprendre l'architecture de centralisation

![Architecture de centralisation CloudWatch](/img/cloudops/guides/cloudtrail-lake/cloudtrail_lake_to_cloudwatch/LogsCentralization.png "Architecture de centralisation CloudWatch")

### Prerequis pour la centralisation

- **[AWS Organizations](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_introduction.html)** est configure et tous les comptes source/destination appartiennent a l'organisation
- **[L'acces de confiance](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_integrate_services.html)** est active pour CloudWatch dans AWS Organizations

### Creer la regle de centralisation

1. Naviguez vers la [**console CloudWatch**](https://console.aws.amazon.com/cloudwatch/home) dans le compte de **gestion** ou d'**administrateur delegue** de l'organisation.
2. Choisissez **Settings**.
3. Naviguez vers l'onglet **Organization**.
4. Choisissez **Configure rule**.
5. Sur la page **Specify Source Details**, specifiez les details de la source, puis choisissez **Next** :
    - **Centralization rule name** : Entrez un nom unique pour la regle de centralisation (par ex., `cloudtrail-centralization`).
    - **Source accounts** : Definissez les criteres de selection des sources pour choisir les comptes depuis lesquels les donnees de telemetrie seront centralisees. Vous pouvez selectionner par identifiant de compte, identifiant d'unite organisationnelle (UO) ou l'organisation entiere. Vous pouvez fournir les criteres de selection en utilisant le mode **Builder** (base sur les clics) ou **Editor** (texte libre).
        - Cles prises en charge : `OrganizationId` | `OrganizationUnitId` | `AccountId` | `*`
        - Operateurs pris en charge : `=` | `IN` | `OR`
    - **Source Regions** : Selectionnez les regions depuis lesquelles vous souhaitez centraliser les journaux.

    ![Specification des details de la source pour la centralisation des journaux](/img/cloudops/guides/cloudtrail-lake/cloudtrail_lake_to_cloudwatch/cloudtrail_lake_to_cloudwatch_06.png "Specification des details de la source pour la centralisation des journaux")

6. Sur la page **Specify Destination**, specifiez les details de la destination, puis choisissez **Next** :
    - **Destination account** : Selectionnez un compte dans l'organisation qui agit comme destination centrale pour les donnees de telemetrie.
    - **Destination Region** : Selectionnez une region principale qui stocke une copie des donnees de telemetrie centralisees.
    - **Backup Region** (optionnel) : Selectionnez une region de sauvegarde au sein de votre compte de destination pour maintenir une copie synchronisee de vos journaux, assurant la disponibilite des donnees si la region principale subit une panne.

    ![Specification des details de la destination pour la centralisation des journaux](/img/cloudops/guides/cloudtrail-lake/cloudtrail_lake_to_cloudwatch/cloudtrail_lake_to_cloudwatch_07.png "Specification des details de la destination pour la centralisation des journaux")

7. Sur la page **Specify Telemetry Data**, specifiez les donnees de telemetrie en configurant les champs suivants, puis choisissez **Next** :
    - **Log groups** : Choisissez **Filter log groups** pour centraliser uniquement les groupes de journaux CloudTrail. Vous pouvez fournir les criteres de selection en utilisant le mode **Builder** (base sur les clics) ou **Editor** (texte libre).
        - **Data source selection criteria** : Utilisez ceci pour filtrer par le nom et le type de source de donnees que CloudWatch Logs attribue automatiquement a vos journaux. Pour CloudTrail, definissez : `DataSourceName = "aws_cloudtrail"`. Vous pouvez egalement filtrer par `DataSourceType` pour cibler des types d'evenements specifiques tels que les evenements de gestion ou de donnees.
     
    - **KMS Encrypted Log Groups** : Choisissez l'une des options suivantes pour gerer les groupes de journaux chiffres par KMS :
        - **Centraliser les groupes de journaux source chiffres avec des cles KMS gerees par le client en utilisant une cle KMS geree par le client specifique a la destination** : Centralise les groupes de journaux chiffres des comptes source vers la destination en utilisant l'ARN de la cle KMS de destination fourni. Si vous selectionnez cette option, vous devez fournir l'ARN de la cle de chiffrement de destination et un ARN de cle de chiffrement de destination de sauvegarde (necessaire uniquement si vous avez selectionne une region de sauvegarde a l'etape precedente). La cle KMS specifiee doit avoir les permissions pour que CloudWatch Logs puisse chiffrer.
        - **Centraliser les groupes de journaux chiffres avec des cles KMS gerees par le client dans le compte de destination avec une cle KMS appartenant a AWS** : Centralise les groupes de journaux chiffres par KMS dans les comptes source vers des groupes de journaux de destination chiffres en utilisant une cle KMS appartenant a AWS.
        - **Ne pas centraliser les groupes de journaux chiffres avec des cles KMS gerees par le client** : Ignore la centralisation des evenements de journal provenant de groupes de journaux source chiffres avec des cles KMS gerees par le client.

    ![Specifier les donnees de telemetrie pour la centralisation des journaux](/img/cloudops/guides/cloudtrail-lake/cloudtrail_lake_to_cloudwatch/cloudtrail_lake_to_cloudwatch_08.png "Specifier les donnees de telemetrie pour la centralisation des journaux")

    :::info
    Le filtrage supplementaire par nom de groupe de journaux est egalement disponible en utilisant les **Log group selection criteria**. Pour plus d'informations, voir [Cross-account cross-Region log centralization](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatchLogs_Centralization.html).
    :::

8. Sur la page **Review and Configure**, passez en revue la regle de centralisation, effectuez optionnellement des modifications de derniere minute et choisissez **Create Centralization policy**.

Apres la creation et l'activation de la regle de centralisation, les evenements de journal commenceront a se consolider dans le compte central. Les groupes de journaux avec des noms identiques sont fusionnes pour rationaliser la gestion des journaux, tandis que les flux de journaux sont annexes avec leur identifiant de compte source d'origine et les identifiants de region source. De plus, les evenements de journal sont enrichis avec de nouveaux champs systeme (@aws.account et @aws.region), permettant une tracabilite claire de l'origine des donnees de journal.

:::info
La fonctionnalite de centralisation des journaux CloudWatch ne traite que les nouvelles donnees de journal qui arrivent dans les comptes source apres la creation de la regle de centralisation. Les donnees de journal historiques (journaux qui existaient avant la creation de la regle) ne sont pas centralisees.
:::

### Valider les regles de centralisation

**Verifier la sante de la regle :**

1. Naviguez vers **CloudWatch** -> **Settings** -> onglet **Organization** -> **Manage rules**
2. Verifiez que le statut de la regle est **HEALTHY**

**Surveiller les metriques de centralisation :**

- **IncomingCopiedBytes** : Volume de donnees de journal en octets non comprimes repliques dans le compte de destination (devrait etre non nul et constant)
- **IncomingCopiedLogEvents** : Nombre d'evenements de journal repliques dans le compte de destination
- **OutgoingCopiedBytes** : Volume de donnees de journal en octets non comprimes envoyes depuis les comptes source vers le compte de destination
- **OutgoingCopiedLogEvents** : Nombre d'evenements de journal envoyes depuis les comptes source vers le compte de destination
- **CentralizationError** : Nombre d'erreurs rencontrees pendant la replication ; devrait etre zero -- configurez des alarmes pour toute erreur
- **CentralizationThrottled** : Nombre de fois ou le traitement de centralisation a ete limite ; surveillez la limitation qui pourrait impacter la replication

### Optimisation des couts de stockage des journaux pour la centralisation CloudWatch Logs

La centralisation de CloudWatch Logs offre une structure de tarification rentable pour la gestion des journaux a travers plusieurs comptes et regions. La premiere copie des journaux centralises n'entraine pas de frais d'ingestion supplementaires ni de couts de transfert de donnees inter-regions, les clients payant les couts de stockage CloudWatch standard et la tarification des fonctionnalites. Pour toute copie supplementaire au-dela de la premiere centralisation, il y a un frais supplementaire par Go (l'utilisation de la fonctionnalite de region de sauvegarde cree egalement une copie supplementaire). Pour les details de tarification actuels, consultez la [page de tarification CloudWatch](https://aws.amazon.com/cloudwatch/pricing/). Pour vous aider a optimiser les couts tout en utilisant la centralisation de CloudWatch Logs, nous recommandons d'implementer les bonnes pratiques suivantes :

1. **Implementer une strategie de retention par niveaux**

    Vous pouvez reduire significativement les couts de stockage en implementant une politique de retention a deux niveaux.

    - Configurez vos comptes source avec des periodes de retention a court terme (**7-30 jours**) pour gerer les besoins operationnels immediats.
    - Pour votre compte centralise, definissez des periodes de retention plus longues (**90+ jours**) pour repondre aux exigences de conformite et supporter l'analyse historique.

2. **Utiliser la centralisation selective**

    Lors de la creation de copies supplementaires de vos journaux, soyez strategique avec votre approche de centralisation :

    - Exploitez les **filtres de groupes de journaux** pour centraliser uniquement des applications ou services specifiques.
    - Identifiez et centralisez uniquement les journaux qui correspondent a vos exigences metier.
    - Evitez de centraliser des donnees de journal inutiles qui ne servent pas un cas d'utilisation specifique.

3. **Strategie de sauvegarde**

    Considerez ces facteurs lors de la planification de votre strategie de sauvegarde :

    - Soyez conscient que les copies de sauvegarde sont traitees comme des copies supplementaires et entrainent un frais supplementaire par Go. Consultez la [page de tarification CloudWatch](https://aws.amazon.com/cloudwatch/pricing/) pour les taux actuels.
    - Activez la centralisation de sauvegarde uniquement lorsque vous avez une exigence specifique de sauvegarde dediee dans un compte central.
    - Envisagez d'utiliser vos comptes source comme copies de sauvegarde pour eliminer les frais supplementaires.

En implementant ces strategies d'optimisation, vous pouvez maintenir une gestion efficace des journaux tout en controlant vos couts.


### Arreter l'ingestion CloudTrail Lake

Apres avoir active l'ingestion des evenements CloudTrail dans CloudWatch et confirme que les evenements circulent correctement pendant au moins 24 heures, il est temps de desactiver l'ingestion vers votre magasin de donnees d'evenements CloudTrail Lake. Cela empeche les frais d'ingestion en double a travers les deux services. Vos donnees historiques dans CloudTrail Lake restent entierement accessibles pour l'interrogation meme apres l'arret de la nouvelle ingestion.

1. Naviguez vers la **console CloudTrail** -> **Lake** -> **Event data stores**
2. Selectionnez le **Event Data Store**
3. Choisissez **Stop ingestion** (cela preserve les donnees existantes pour l'interrogation)
4. Confirmez l'action

:::info
Arreter l'ingestion ne supprime PAS les donnees existantes. Vous pouvez toujours interroger les donnees historiques dans CloudTrail Lake jusqu'a l'expiration de la periode de retention ou la suppression de l'EDS.
:::
---

### Tableau de bord de visibilite de securite utilisant le magasin de donnees unifie CloudWatch

Avec les donnees CloudTrail centralisees dans CloudWatch, vous pouvez deployer un tableau de bord CloudWatch pre-construit qui exploite les facettes par defaut du magasin de donnees unifie CloudWatch comme `@data_source_name` pour decouvrir et interroger dynamiquement votre activite CloudTrail a travers tous les groupes de journaux -- sans aucune dependance aux noms de groupes de journaux. Le tableau de bord fournit une visibilite en quasi-temps reel sur les modeles d'activite API, les evenements de securite et la posture de conformite, placant les donnees CloudTrail et VPC Flow Log cote a cote pour la correlation inter-services lors des investigations d'incidents.

Pour un guide de deploiement etape par etape utilisant AWS CloudFormation, y compris les descriptions des widgets du tableau de bord et les explications des requetes, voir [Security Visibility Dashboard using CloudWatch Unified Data Store](https://aws-samples.github.io/solutions/AWS%20CloudTrail/security-dashboard-uds).

---

## Guide de traduction des requetes -- SQL CloudTrail Lake vers CloudWatch Logs Insights

L'un des aspects les plus critiques de la migration est la traduction de vos requetes SQL CloudTrail Lake existantes en equivalents CloudWatch Logs Insights. [CloudWatch Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html) prend en charge trois langages de requete : **Logs Insights QL**, **OpenSearch PPL** et **OpenSearch SQL** -- vous donnant de la flexibilite dans la facon dont vous interrogez vos donnees.

:::info
CloudWatch Logs Insights prend en charge la generation de requetes en langage naturel. Vous pouvez decrire ce que vous recherchez en francais courant, et la capacite assistee par l'IA genere une requete et fournit une explication ligne par ligne. Cela est particulierement utile lors de la traduction de requetes SQL CloudTrail Lake complexes.
:::

---

## Bonnes pratiques de securite pour l'environnement migre

La securisation de vos donnees CloudTrail dans CloudWatch necessite une approche complete et multi-couches combinant des politiques IAM, le chiffrement, la protection contre la suppression, les politiques basees sur les ressources et la surveillance continue. Des controles de securite appropriees garantissent que vos donnees de journal restent un atout pour l'audit et la conformite plutot qu'une vulnerabilite, couvrant l'acces a privilege minimum, la conception de groupes de journaux basee sur la classification des donnees et la protection contre la suppression accidentelle ou malveillante de pistes d'audit critiques.

Pour des conseils detailles sur la mise en oeuvre de ces controles, y compris la conception de la hierarchie des groupes de journaux, la gestion granulaire des permissions et les bonnes pratiques de chiffrement, voir [Security Best Practices for CloudWatch Logs](https://aws-observability.github.io/observability-best-practices/tools/logs/security/cloudwatch-logs-security-best-practices/).
