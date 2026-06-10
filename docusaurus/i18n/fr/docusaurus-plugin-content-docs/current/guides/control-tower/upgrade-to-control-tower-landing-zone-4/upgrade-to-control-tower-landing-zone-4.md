---
sidebar_position: 5
---
# Mise a niveau vers AWS Control Tower Landing Zone 4.0

## Introduction

Si vous utilisez AWS Control Tower Landing Zone 3.x, vous pouvez maintenant passer a la version 4.0 pour obtenir plus de flexibilite dans la facon dont vous appliquez les controles de gouvernance a travers votre organisation AWS. Cet article vous guide a travers les principaux changements architecturaux, vous aide a comprendre l'impact de la migration et fournit des conseils etape par etape pour une mise a niveau reussie.

Dans les versions precedentes d'AWS Control Tower (3.x et anterieures), l'activation de la zone d'atterrissage vous obligeait a accepter une structure organisationnelle predefinie avec des integrations de services obligatoires. Landing Zone 4.0 supprime ces contraintes, vous permettant de :

- Acceder a plus de 1 200 controles depuis [AWS Control Catalog](https://docs.aws.amazon.com/controltower/latest/userguide/control-catalog.html) sans restructurer votre organisation existante
- Vous avez maintenant la liberte de choisir quels services AWS activer en fonction de vos besoins specifiques. Les integrations de services ne sont plus obligatoires, vous permettant de :
  - Activer [AWS Config](https://aws.amazon.com/config/) pour les controles detectifs uniquement si necessaire
  - Gerer [AWS CloudTrail](https://aws.amazon.com/cloudtrail/) independamment si vous avez des solutions de journalisation d'audit existantes
  - Opter pour [AWS IAM Identity Center](https://aws.amazon.com/iam/identity-center/) en fonction de votre strategie de gestion des identites
  - Controler l'integration [AWS Backup](https://aws.amazon.com/backup/) selon vos exigences de sauvegarde
- Definir votre propre hierarchie d'unites organisationnelles (UO) tout en appliquant la gouvernance AWS Control Tower
- Deployer une zone d'atterrissage minimale avec uniquement l'integration [AWS Organizations](https://aws.amazon.com/organizations/) et les controles, sans necessiter de comptes d'integration de services dedies

Ce modele dedie aux controles est particulierement precieux pour les entreprises avec des zones d'atterrissage existantes, car il vous permet d'adopter la gouvernance AWS Control Tower de maniere incrementale. Vous pouvez appliquer des controles et une surveillance de conformite sans la restructuration extensive requise dans les versions precedentes.

Pour des conseils supplementaires sur la maximisation de la valeur du AWS Control Catalog, consultez la documentation AWS : [Search and discover governance controls with Control Catalog in AWS Control Tower](https://aws.amazon.com/blogs/mt/search-and-discover-governance-controls-with-control-catalog-in-aws-control-tower/).

## Avantages et changements architecturaux

Landing Zone 4.0 introduit des ameliorations significatives qui offrent une plus grande flexibilite et une efficacite operationnelle. La comparaison suivante met en evidence les differences cles entre la version 3.x et la version 4.0 :

| Fonctionnalite | Version 3.x | Version 4.0 |
|---------|-------------|-------------|
| Integrations de services | Obligatoires | Optionnelles |
| Compartiment S3 [AWS Config](https://aws.amazon.com/config/) | Partage avec [AWS CloudTrail](https://aws.amazon.com/cloudtrail/) | Compartiment dedie |
| Aggregateur AWS Config | Aggregateurs organisation + compte | Aggregateur lie au service |
| Administrateur delegue | Aucun | Compte d'audit pour AWS Config |
| Structure des UO | UO de securite obligatoire | Flexible, definie par le client |
| Champ Manifest | Requis | Optionnel |
| Ligne de base Config | Partie de AWSControlTowerBaseline | ConfigBaseline autonome |
| Notifications de derive | [Amazon SNS](https://aws.amazon.com/sns/) | [Amazon EventBridge](https://aws.amazon.com/eventbridge/) |



## Prerequis

Avant de mettre a niveau vers AWS Control Tower Landing Zone 4.0, assurez-vous de remplir les exigences suivantes :

> **Important** : Cette mise a niveau est irreversible. AWS Control Tower ne prend pas en charge le retour a une version precedente de la zone d'atterrissage. Une fois que vous passez a Landing Zone 4.0, vous ne pouvez pas revenir a la version 3.x. Il est fortement recommande de tester la mise a niveau dans un environnement de non-production d'abord et de faire des sauvegardes completes avant de proceder.

#### Prerequis generaux

1. **Resoudre la derive organisationnelle** : Il est fortement recommande de resoudre toutes les derives organisationnelles avant de passer a Landing Zone 4.0. Vous pouvez verifier la derive dans la console AWS Control Tower. Une derive non resolue avant la mise a niveau peut persister apres la mise a niveau et apres le re-enregistrement de l'UO, necessitant potentiellement un cas de support AWS pour la resoudre.

2. **Examiner les prerequis AWS Control Tower** : Assurez-vous que votre environnement repond a tous les [prerequis standard AWS Control Tower](https://docs.aws.amazon.com/controltower/latest/userguide/getting-started-prereqs.html).

3. **Examiner les dependances des integrations de services** : Comprenez les dependances entre les lignes de base. Si vous prevoyez de desactiver l'integration AWS Config a l'avenir, vous devez egalement desactiver les integrations Security Roles, AWS IAM Identity Center et AWS Backup en raison des dependances de services.

4. **Effectuer des sauvegardes completes** : Avant la mise a niveau, documentez et sauvegardez votre configuration actuelle :
   - Exportez la structure organisationnelle (UO, comptes, associations compte-UO)
   - Capturez ou exportez les parametres actuels de la zone d'atterrissage, les vues de l'aggregateur Config et les configurations des sujets SNS
   - Exportez les regles Config et les configurations des aggregateurs
   - Exportez les modeles et parametres de CloudFormation StackSet
   - Documentez les versions actuelles des lignes de base par UO et le statut d'activation des controles par UO
   - Sauvegardez les modeles CloudFormation CfCT si applicable

```bash
# Export organizational units
aws organizations list-organizational-units-for-parent \
  --parent-id <ROOT_ID> > org_units_backup.json

# Export all accounts
aws organizations list-accounts > accounts_backup.json

# Export Config rules
aws configservice describe-config-rules > config_rules_backup.json

# Export Config aggregators
aws configservice describe-configuration-aggregators > aggregators_backup.json

# Export Control Tower IAM roles
aws iam get-role --role-name AWSControlTowerExecution > ct_exec_role_backup.json
aws iam get-role --role-name AWSControlTowerCloudTrailRole > ct_cloudtrail_role_backup.json
```

### Prerequis AWS CloudFormation StackSet

#### Supprimer les instances de pile des comptes fermes/suspendus

Lorsque des comptes AWS sont fermes, leurs instances de pile AWS CloudFormation dans les StackSets `AWSControlTowerBP-*` du compte de gestion ne sont **pas automatiquement supprimees**. Pendant la mise a niveau, AWS Control Tower tente de mettre a jour ces StackSets et echoue car il ne peut pas assumer `AWSControlTowerExecution` dans les comptes fermes. C'est une [limitation documentee](https://docs.aws.amazon.com/controltower/latest/userguide/troubleshooting.html#unable-to-update-landing-zone).

Dans les organisations qui ont ferme des comptes au fil du temps, cela peut faire que la mise a niveau se bloque pendant que chaque operation de StackSet expire sequentiellement. Pour eviter cela, executez la verification pre-vol et la remediation suivantes avant la mise a niveau :

**Verification pre-vol :**

```bash
# Identify closed/suspended accounts
CLOSED=$(aws organizations list-accounts \
  --query "Accounts[?Status!='ACTIVE'].Id" --output text)

# Check for orphaned stack instances in AWS Control Tower StackSets
for SS in $(aws cloudformation list-stack-sets --status ACTIVE \
  --query "Summaries[?starts_with(StackSetName,'AWSControlTowerBP-')].StackSetName" \
  --output text); do
  for ACCT in $CLOSED; do
    COUNT=$(aws cloudformation list-stack-instances --stack-set-name "$SS" \
      --query "length(Summaries[?Account=='${ACCT}'])" --output text)
    [ "$COUNT" -gt 0 ] && echo "BLOCKER: $SS has $COUNT instances for closed account $ACCT"
  done
done
```

**Remediation suggeree :**

```bash
# For each StackSet flagged as BLOCKER in the pre-flight check above,
# remove the orphaned instances for the closed account
aws cloudformation delete-stack-instances \
  --stack-set-name "<stackset-name>" \
  --accounts '["<closed-account-id>"]' \
  --regions '["us-east-1","us-west-2"]' \
  --retain-stacks \
  --no-cli-pager
```

> **Important** : Le drapeau [`--retain-stacks`](https://docs.aws.amazon.com/cli/latest/reference/cloudformation/delete-stack-instances.html) est requis. Sans lui, AWS CloudFormation tente d'assumer `AWSControlTowerExecution` dans le compte ferme pour supprimer la pile, ce qui echouera.

#### Verifier l'absence de protection contre la terminaison sur les piles de base AWS Control Tower

La mise a niveau v4.0 supprime ou remplace certaines piles AWS CloudFormation dans les comptes membres (en particulier les lignes de base liees a AWS Config). Si ces piles ont la protection contre la terminaison activee, les operations de StackSet echouent et la mise a niveau se bloque.

AWS Control Tower n'active **pas** la protection contre la terminaison sur ses piles de base -- il utilise des [SCP (controles preventifs obligatoires)](https://docs.aws.amazon.com/prescriptive-guidance/latest/designing-control-tower-landing-zone/mandatory.html) a la place. Cependant, la protection contre la terminaison peut avoir ete activee en dehors d'AWS Control Tower, par exemple :

- **Remediation automatique CSPM d'AWS Security Hub** -- [CloudFormation.3](https://docs.aws.amazon.com/securityhub/latest/userguide/cloudformation-controls.html) recommande la protection contre la terminaison sur toutes les piles. La remediation automatique l'active sur chaque pile, y compris celles gerees par AWS Control Tower.
- **[AWS Landing Zone Accelerator](https://docs.aws.amazon.com/solutions/latest/landing-zone-accelerator-on-aws/problem-validationerror.html)**, qui active la protection contre la terminaison sur ses piles provisionnees par defaut.

**Verification pre-vol (executer depuis le compte de gestion) :**

```bash
# Assume role into a member account
CREDS=$(aws sts assume-role \
  --role-arn "arn:aws:iam::<member-account-id>:role/AWSControlTowerExecution" \
  --role-session-name "tp-check" --query Credentials --output json)

export AWS_ACCESS_KEY_ID=$(echo $CREDS | jq -r .AccessKeyId)
export AWS_SECRET_ACCESS_KEY=$(echo $CREDS | jq -r .SecretAccessKey)
export AWS_SESSION_TOKEN=$(echo $CREDS | jq -r .SessionToken)

# Check AWS Control Tower baseline stacks for termination protection
aws cloudformation describe-stacks --region <region> \
  --query "Stacks[?starts_with(StackName,'StackSet-AWSControlTowerBP-')].\
  [StackName,EnableTerminationProtection]" --output table
```

**Remediation suggeree :**

```bash
aws cloudformation update-termination-protection \
  --no-enable-termination-protection \
  --stack-name "<stack-name>" --region <region>
```

### Prerequis AWS CloudTrail

Si vous effectuez la mise a niveau via l'API et que l'integration AWS CloudTrail est activee :

1. **Mettre a jour la politique du role IAM** : Detachez la politique en ligne existante de `AWSControlTowerCloudTrailRole` et attachez la nouvelle politique geree `AWSControlTowerCloudTrailRolePolicy`.

```bash
# Detach inline policy
aws iam delete-role-policy \
  --role-name AWSControlTowerCloudTrailRole \
  --policy-name <inline-policy-name>

# Attach new managed policy
aws iam attach-role-policy \
  --role-name AWSControlTowerCloudTrailRole \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSControlTowerCloudTrailRolePolicy
```

2. **Comprendre les configurations de replication S3 sur le compartiment S3** : Le SCP obligatoire (CTS3PV8) pour proteger le compartiment S3 gere par Control Tower pour CloudTrail bloque maintenant l'action *s3:PutReplicationConfiguration*. Puisque LZ 4.0 continue d'utiliser le compartiment CloudTrail existant, toute configuration de replication actuelle continuera a fonctionner normalement. Cependant, vous ne pourrez pas modifier ou recreer les regles de replication apres la mise a niveau. Si vous devez modifier les parametres de replication apres la mise a niveau, la solution de contournement est d'assumer le role AWSControlTowerExecution (qui est exempte du SCP) pour mettre a jour la regle de replication, bien que cela doive etre utilise avec prudence car cela contourne les garde-fous protecteurs de Control Tower.

### Prerequis AWS Config

1. **Comprendre les changements de stockage des donnees** : Sachez que les donnees AWS Config seront stockees dans un nouveau compartiment S3 dedie apres la mise a niveau. Les donnees historiques resteront dans le compartiment partage original et ne seront pas migrees automatiquement. Les nouvelles donnees Config peuvent prendre jusqu'a 24 heures pour apparaitre dans le nouveau compartiment apres la fin de la mise a niveau.

2. **Identifier les flux de travail dependants** : Documentez tous les flux de travail, scripts et outils qui accedent aux donnees AWS Config directement depuis les compartiments S3, y compris :
   - Les outils d'agregation de journaux (Splunk, Datadog, etc.)
   - Les integrations SIEM
   - Les tableaux de bord personnalises (conformite des etiquettes, conformite des correctifs, etc.)
   - Les outils de rapport de conformite automatises
   

   Identifiez les proprietaires de chaque dependance et coordonnez le timing du basculement avant la mise a niveau.

3. **Comprendre les configurations de replication S3 sur le compartiment S3** : Le SCP obligatoire (CTS3PV7) pour proteger le compartiment S3 gere par Control Tower pour Config bloque maintenant l'action **s3:PutReplicationConfiguration**. En consequence, vous ne pourrez pas configurer la replication S3 sur ce compartiment apres la mise a niveau. Si vous avez besoin de la replication pour le nouveau compartiment Config, la solution de contournement est d'assumer le role **AWSControlTowerExecution** (qui est exempte du SCP) pour creer la regle de replication, bien que cela doive etre utilise avec prudence car cela contourne les garde-fous protecteurs de Control Tower.

4. **Inventorier les requetes avancees AWS Config personnalisees** : Si vous avez des requetes avancees AWS Config personnalisees creees dans le compte de gestion contre l'aggregateur au niveau de l'organisation, celles-ci devront etre recreees dans le compte d'audit apres la mise a niveau. L'aggregateur Config passe du compte de gestion au compte d'audit, donc les requetes inter-comptes depuis le compte de gestion ne fonctionneront plus. Documentez toutes les requetes personnalisees avant la mise a niveau.

5. **Examiner les abonnements aux sujets SNS** : Examinez tous les abonnements sur les sujets SNS AWS Control Tower, en particulier les points de terminaison HTTPS pour les integrations tierces (ServiceNow, PagerDuty, etc.). Verifiez que ces abonnements continueront a recevoir des notifications apres la mise a niveau.

6. **Identifier les comptes avec des ressources Config pre-existantes** : Si vous avez des comptes inscrits avec des canaux de livraison AWS Config pre-existants non crees par Control Tower, ces canaux de livraison ne seront pas automatiquement mis a jour pour pointer vers le nouveau compartiment S3 Config. Identifiez ces comptes avant la mise a niveau. Voir la documentation AWS sur [Enroll accounts that have existing AWS Config resources](https://docs.aws.amazon.com/controltower/latest/userguide/existing-config-resources.html).


## Processus de mise a niveau

Cette section fournit des conseils etape par etape pour mettre a niveau votre zone d'atterrissage AWS Control Tower de la version 3.x a la version 4.0.

### Etape 1 : Preparer la mise a niveau

1. **Acceder a la console AWS Control Tower** dans votre compte de gestion dans votre region d'origine.

2. **Examiner la version de la zone d'atterrissage** : Naviguez vers la page des parametres de la zone d'atterrissage et verifiez votre version actuelle.

![Examiner la version de la zone d'atterrissage](/img/cloudops/guides/control-tower/upgrade/image.png)

3. **Verifier la derive** : Sur la page des parametres de la zone d'atterrissage, verifiez que votre zone d'atterrissage affiche "No drift detected". Si une derive est detectee, resolvez-la avant de proceder. Les comptes deja dans un etat de derive avant la mise a niveau peuvent rester en derive apres la mise a niveau et apres le re-enregistrement de l'UO, necessitant potentiellement un cas de support AWS pour la resoudre.

4. **Examiner les integrations de services activees** : Notez quelles integrations de services sont actuellement activees (AWS Config, AWS CloudTrail, AWS IAM Identity Center, AWS Backup).

### Etape 2 : Lancer la mise a niveau

Vous pouvez passer a Landing Zone 4.0 en utilisant soit la console AWS Control Tower, soit l'AWS CLI/API.

#### Mise a niveau via la console

1. **Naviguez vers les parametres de la zone d'atterrissage** dans la console AWS Control Tower.

2. Selectionnez la version 4.0 de la zone d'atterrissage et **cliquez sur le bouton "Update"** pour commencer le processus de mise a niveau.
![Mise a niveau via la console](/img/cloudops/guides/control-tower/upgrade/Pastedimage20260219204716.png)

3. Sur la page suivante, confirmez que la version 4.0 de la zone d'atterrissage est selectionnee et configurez optionnellement l'inscription automatique des comptes. Veuillez noter qu'apres la mise a niveau, il n'est pas possible de revenir a la version precedente. Cliquez sur Next.
![Selection de la version de la zone d'atterrissage](/img/cloudops/guides/control-tower/upgrade/Pastedimage20260219205257.png)

4. Examinez vos regions gouvernees et les parametres de controle de refus de region, puis cliquez sur Next

![Regions gouvernees](/img/cloudops/guides/control-tower/upgrade/Pastedimage20260219205556.png)
5. C'est la page ou vous pouvez mettre a jour les "integrations de services", puis cliquez sur Next
![Integrations de services 1](/img/cloudops/guides/control-tower/upgrade/Pastedimage20260219205749.png)
![Integrations de services 2](/img/cloudops/guides/control-tower/upgrade/Pastedimage20260219205825.png)

![Integrations de services 3](/img/cloudops/guides/control-tower/upgrade/Pastedimage20260219205843.png)
5. Examinez les parametres de la zone d'atterrissage puis **confirmez la mise a niveau** : Cliquez sur "Update landing zone" pour commencer le processus de mise a niveau.

   ![Examiner et mettre a jour](/img/cloudops/guides/control-tower/upgrade/Pastedimage20260219210023.png)
![Examiner les parametres d'integration](/img/cloudops/guides/control-tower/upgrade/Pastedimage20260219210107.png)

![Examiner les parametres d'integration](/img/cloudops/guides/control-tower/upgrade/Pastedimage20260219210132.png)
6. **Surveiller la progression de la mise a niveau** : Le processus de mise a niveau prend generalement 30 a 60 minutes. Vous pouvez surveiller la progression dans la console AWS Control Tower.


### Etape 3 : Verifier l'achevement de la mise a niveau

1. **Verifier le statut de la zone d'atterrissage** : Dans la console AWS Control Tower, verifiez que le statut de la zone d'atterrissage affiche "Active" et que la version affiche "4.0".

   ![Verifier l'achevement de la mise a niveau](/img/cloudops/guides/control-tower/upgrade/Pastedimage20260219210908.png)

2. **Examiner les integrations de services** : Confirmez que toutes les integrations de services precedemment activees restent activees et fonctionnelles.

3. **Verifier les erreurs de mise a niveau** : Examinez la console AWS Control Tower pour tout message d'erreur ou avertissement.

### Etape 4 : Verifier la nouvelle ligne de base Config

- **Nouvelle ligne de base `ConfigBaseline` :** Il existe maintenant une `ConfigBaseline` separee au niveau de l'UO pour le support des controles detectifs sans necessiter la `AWSControlTowerBaseline` complete. Voir la liste des [types de lignes de base au niveau de l'UO](https://docs.aws.amazon.com//controltower/latest/userguide/types-of-baselines.html#ou-baseline-types) pour plus d'informations. Pour les clients existants qui utilisent la zone d'atterrissage par defaut, toutes les integrations de services sont maintenant optionnelles, avec la reserve des exigences de dependances decrites dans [Key changes](https://docs.aws.amazon.com/controltower/latest/userguide/key-changes-lz-v4.html).

![Verifier la ligne de base](/img/cloudops/guides/control-tower/upgrade/Pastedimage20260219222252.png)

### Etape 5 : Verifier les changements AWS Config

Apres la mise a niveau vers Landing Zone 4.0, AWS Config subit des changements architecturaux significatifs. Suivez ces etapes de verification :

#### Verifier l'enregistrement de l'administrateur delegue

Confirmez que le compte d'audit est enregistre comme administrateur delegue AWS Config :

```bash
# Check delegated administrator for AWS Config
aws organizations list-delegated-administrators \
  --service-principal config.amazonaws.com \
  --region <your-home-region>
```

La sortie attendue devrait montrer l'identifiant de votre compte d'audit.

#### Verifier l'aggregateur Config lie au service

Confirmez que l'aggregateur Config lie au service (SLCA) existe dans votre compte d'audit. Le nouvel aggregateur est nomme `aws-controltower-ConfigAggregatorForOrganizations` et est deploye dans le compte d'audit (contrairement a l'ancien aggregateur du meme nom qui residait dans le compte de gestion) :

```bash
# Describe configuration aggregators in Audit account
aws configservice describe-configuration-aggregators \
  --region <your-home-region>
```

Vous devriez voir l'aggregateur `aws-controltower-ConfigAggregatorForOrganizations` dans le compte d'audit. Notez que bien qu'il partage le meme nom que l'ancien aggregateur qui etait dans le compte de gestion, c'est une ressource differente deployee dans un compte different.

![Verifier l'aggregateur](/img/cloudops/guides/control-tower/upgrade/Pastedimage20260219215025.png)

#### Verifier la suppression des anciens aggregateurs
Confirmez que les anciens aggregateurs ont ete supprimes :

1. Dans le **compte de gestion**, verifiez que `aws-controltower-ConfigAggregatorForOrganizations` n'existe plus
2. Dans le **compte d'audit**, verifiez que `aws-controltower-GuardRailsComplianceAggregator` n'existe plus

```bash
# In the management account - check for old aggregator (should return empty or not found)
aws configservice describe-configuration-aggregators \
  --region <your-home-region>
```

**Examiner les aggregateurs Config personnalises**
Si vous avez des aggregateurs AWS Config personnalises en dehors des conventions de denomination AWS Control Tower, verifiez qu'ils continuent de fonctionner. AWS Control Tower ne gere que les aggregateurs avec des modeles de denomination specifiques. Les aggregateurs personnalises ne sont pas affectes et peuvent fonctionner en parallele avec le nouveau SLCA.

#### Verifier la migration des requetes Config personnalisees

Si vous aviez des requetes avancees AWS Config personnalisees dans le compte de gestion qui s'executaient contre l'ancien aggregateur au niveau de l'organisation, ces requetes ne peuvent maintenant s'executer que localement dans le compte de gestion (pas inter-comptes). Pour executer des requetes inter-comptes, recreez-les dans le compte d'audit ou reside le nouvel aggregateur `aws-controltower-ConfigAggregatorForOrganizations`.

```bash
# In the Audit account - verify the new aggregator shows all member accounts
aws configservice describe-configuration-aggregator-sources-status \
  --configuration-aggregator-name aws-controltower-ConfigAggregatorForOrganizations \
  --region <your-home-region>
```

#### Verifier la creation du nouveau compartiment S3

Confirmez que le nouveau compartiment S3 AWS Config dedie existe dans le compte d'audit :

```bash
# List S3 buckets in Audit account
aws s3 ls | grep aws-controltower-config-logs
```

Modele de denomination de compartiment attendu : `aws-controltower-config-logs-<AUDIT_ACCOUNT>-<REGION_STRING>-<SUFFIX_STRING>`

![Verifier le compartiment S3 AWS Config](/img/cloudops/guides/control-tower/upgrade/Pastedimage20260219215231.png)

> **Note** : Les donnees Config des comptes membres peuvent prendre jusqu'a 24 heures pour apparaitre dans le nouveau compartiment S3 apres la mise a niveau. Les tableaux de bord et les outils de conformite lisant depuis S3 afficheront des donnees obsoletes pendant cette fenetre. Pour un acces aux donnees en quasi-temps reel, utilisez l'API de l'aggregateur Config.

#### Verifier que le compartiment CloudTrail est inchange

Confirmez qu'AWS CloudTrail continue d'utiliser le compartiment existant dans le compte Log Archive :

```bash
# List S3 buckets in Log Archive account
aws s3 ls | grep aws-controltower-logs
```

Modele de denomination de compartiment attendu : `aws-controltower-logs-<LOGGING_ACCOUNT>-<HOME_REGION>`

Testez le flux de donnees en verifiant les horodatages recents :

```bash
# Check recent CloudTrail logs
aws s3 ls s3://aws-controltower-logs-<LOGGING_ACCOUNT>-<HOME_REGION>/ --recursive | tail -20
```

#### Verifier les canaux de livraison Config

Verifiez que les canaux de livraison AWS Config dans tous les comptes inscrits pointent vers le nouveau compartiment S3 :

```bash
# Describe delivery channels
aws configservice describe-delivery-channels \
  --region <your-home-region>
```

Le `s3BucketName` devrait referencer le nouveau compartiment `aws-controltower-config-logs-*`.

![Verifier le compartiment S3 AWS Config](/img/cloudops/guides/control-tower/upgrade/Pastedimage20260219215431.png)

Si vous avez des comptes inscrits avec des canaux de livraison Config pre-existants non crees par Control Tower, vous devez les mettre a jour manuellement pour pointer vers le nouveau compartiment :

```bash
# Update pre-existing delivery channels to new bucket
aws configservice put-delivery-channel \
  --delivery-channel name=<CHANNEL_NAME>,s3BucketName=aws-controltower-config-logs-<AUDIT_ACCOUNT>-<REGION>-<SUFFIX>
```

#### Verifier l'agregation de donnees SLCA

Prevoyez 24 a 48 heures pour l'agregation complete des donnees apres la fin de la mise a niveau. Ensuite, verifiez que le nouvel aggregateur Config lie au service peut agreger les donnees de tous les enregistreurs AWS Config dans l'organisation, y compris les comptes non geres par AWS Control Tower :

```bash
# Get aggregated compliance summary
aws configservice get-aggregate-compliance-details-by-config-rule \
  --configuration-aggregator-name aws-controltower-ConfigAggregatorForOrganizations \
  --config-rule-name <any-config-rule-name> \
  --account-id <test-account-id> \
  --aws-region <region> \
  --region <your-home-region>
```

#### Verifier les tableaux de bord et outils en aval

Apres que les donnees Config commencent a circuler vers le nouveau compartiment (jusqu'a 24 heures), verifiez que tous les tableaux de bord et outils dependants recoivent des donnees fraiches :

- Tableaux de bord de conformite des etiquettes
- Tableaux de bord de conformite des correctifs
- Integrations SIEM
- Tout outil de rapport de conformite personnalise

Les tableaux de bord qui referencent encore l'ancien compartiment `aws-controltower-logs-*` afficheront des donnees obsoletes d'avant la mise a niveau. Mettez-les a jour pour pointer vers le nouveau compartiment `aws-controltower-config-logs-*`, ou de preference refactorisez-les pour utiliser l'API de l'aggregateur Config.


### Etape 6 : Verifier les changements AWS CloudTrail

AWS CloudTrail subit des changements minimaux dans Landing Zone 4.0, mais vous devriez verifier les points suivants :

#### Verifier la mise a jour de la politique du role IAM

Si vous avez effectue la mise a niveau via l'API, confirmez que `AWSControlTowerCloudTrailRole` utilise la nouvelle politique geree :

```bash
# List attached policies for CloudTrail role
aws iam list-attached-role-policies \
  --role-name AWSControlTowerCloudTrailRole
```

La sortie attendue devrait inclure `AWSControlTowerCloudTrailRolePolicy`.

#### Verifier que la journalisation CloudTrail continue

Confirmez que la piste organisationnelle continue de journaliser :

```bash
# Describe trails
aws cloudtrail describe-trails \
  --region <your-home-region>
```

Verifiez que le statut de la piste est actif et qu'elle journalise vers le compartiment S3 attendu.

### Etape 7 : Verifier les changements de sujets SNS

Landing Zone 4.0 introduit des sujets SNS dedies pour chaque integration de service. Verifiez les sujets SNS dans le compte d'audit :

```bash
# List SNS topics in Audit account
aws sns list-topics --region <your-home-region>
```

Sujets SNS attendus dans le compte d'audit :
- `aws-controltower-AllConfigNotifications` - Recoit toujours les evenements AWS Config
- `aws-controltower-AggregateSecurityNotifications` - Existe toujours mais uniquement pour les notifications non liees a la derive
- `aws-controltower-AggregateConfigurationNotifications` - Continue de fonctionner pour les notifications de conformite

![Verifier les sujets SNS](/img/cloudops/guides/control-tower/upgrade/Pastedimage20260219211445.png)

Pour les clients qui effectuent la mise a niveau avec `AWSControlTowerBaseline` active, les sujets SNS existants et leurs abonnements dans le compte d'audit sont preserves et continuent de fonctionner sans changement. Le changement principal concerne les clients qui desactivent ensuite `AWSControlTowerBaseline` -- dans ce cas, les notifications de derive passent d'Amazon SNS a Amazon EventBridge dans le compte de gestion.

> **Note** : Certains sujets SNS existants (tels que `aws-controltower-AggregateSecurityNotifications`) peuvent n'avoir aucun abonne actif. C'est attendu et reflete le comportement d'avant la mise a niveau -- ces sujets agissent comme des espaces reserves et n'indiquent pas un probleme.

Examinez tous les abonnements aux sujets SNS, en particulier les points de terminaison HTTPS pour les integrations tierces (ServiceNow, PagerDuty, etc.), pour confirmer qu'ils continuent de recevoir des notifications apres la mise a niveau.

### Etape 8 : Verifier les changements de controles

Avec AWS Control Tower Landing Zone 4.0, il y a eu plusieurs changements aux controles obligatoires. Pour verifier les changements, suivez la documentation [Changes in Landing Zone 4.0 controls](https://docs.aws.amazon.com/controltower/latest/controlreference/mandatory-controls.html#changes-in-landing-zone-40)


## Re-enregistrer les unites organisationnelles

Apres la mise a niveau vers Landing Zone 4.0, vous devriez re-enregistrer vos UO pour appliquer les nouvelles versions de lignes de base aux comptes membres. C'est un processus incremental qui peut etre fait par phases.

#### Comprendre le re-enregistrement des UO

Lorsque AWS Control Tower est mis a jour vers la version 4.0, le re-enregistrement des UO devient necessaire en raison de la nouvelle structure de dependances des lignes de base. Veuillez consulter la documentation sur la [[compatibilite des lignes de base avec les versions de zones d'atterrissage AWS Control Tower.]]

Lorsque vous re-enregistrez une UO :
- AWS Control Tower met a jour tous les comptes membres au sein de cette UO avec la nouvelle version de la ligne de base
- Les SCP geres par Control Tower sont temporairement inactifs pendant leur rafraichissement (generalement quelques minutes)
- Les SCP personnalises restent appliques et ne sont pas impactes
- Les charges de travail continuent de fonctionner sans interruption
- Vous pouvez traiter jusqu'a 1 000 comptes par UO en un seul lot

> **Important** : Le re-enregistrement d'une UO parente ne se propage pas aux UO enfants. Chaque UO dans la hierarchie doit etre re-enregistree individuellement. Prevoyez de re-enregistrer chaque UO enfant separement, en commencant par les UO de niveau superieur et en descendant. Cela peut ajouter un temps significatif au deploiement si vous avez une hierarchie d'UO profonde.


#### Strategie de deploiement par phases

**Approche recommandee** :

1. **Activation hierarchique** : Commencez par les UO de niveau superieur avant de proceder aux UO enfants. N'oubliez pas que chaque UO enfant doit etre re-enregistree separement -- cela ne se propage pas.
2. **Versions de lignes de base mixtes** : Acceptable pendant les periodes de transition (hybride 3.x et 4.0)
3. **Traitement par lots** : Utilisez "Re-register OU" pour mettre a jour tous les comptes au sein d'une UO (jusqu'a 1 000 comptes par lot)
4. **Surveiller chaque UO** : Verifiez le re-enregistrement reussi avant de proceder a l'UO suivante

#### Re-enregistrer une UO via la console

1. Naviguez vers la page **OU** dans la console AWS Control Tower
2. Selectionnez l'UO que vous souhaitez re-enregistrer
3. Cliquez sur **Re-register OU**
4. Examinez les comptes qui seront mis a jour
5. Cliquez sur **Re-register OU** pour confirmer
6. Surveillez la progression du re-enregistrement dans la console

**Note** : Apres la migration, vous pourriez avoir besoin de re-enregistrer manuellement certaines UO pour deployer les nouvelles versions de lignes de base. C'est un comportement attendu et garantit que vous avez le controle sur le moment ou les mises a jour des lignes de base sont appliquees.

> **Depannage** : Si un compte etait deja dans un etat de derive avant la mise a niveau, il peut rester en derive apres le re-enregistrement. Dans ce cas, ouvrez un cas de support avec AWS Support dans le compte affecte pour investiguer et resoudre la derive persistante.

## Ressources supplementaires

- [AWS Control Tower User Guide](https://docs.aws.amazon.com/controltower/latest/userguide/)
- [AWS Control Tower API Reference](https://docs.aws.amazon.com/controltower/latest/APIReference/)
- [AWS Control Catalog](https://docs.aws.amazon.com/controltower/latest/userguide/control-catalog.html)
- [AWS Config User Guide](https://docs.aws.amazon.com/config/latest/developerguide/)
- [AWS CloudTrail User Guide](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/)
- [AWS Organizations User Guide](https://docs.aws.amazon.com/organizations/latest/userguide/)
