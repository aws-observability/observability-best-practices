---
sidebar_position: 1
---

# Guide de préparation à la migration de comptes AWS Organizations

> **Avertissement :** Ce guide fournit des conseils basés sur les meilleures pratiques concernant les dépendances et considérations couramment rencontrées lors du transfert de comptes AWS entre organisations. La réussite de toute migration dépend du scénario unique de chaque client, de ses charges de travail et de ses dépendances. Les clients sont responsables de l'évaluation approfondie de leur environnement spécifique, de la validation de toutes les dépendances et du test de leur plan de migration avant exécution. Ce guide ne couvre pas toutes les dépendances ou cas particuliers possibles.

## Périmètre

Ce guide couvre la **migration de comptes entre AWS Organizations**. L'approche décrite ici utilise [Account Assessment for AWS Organizations](https://docs.aws.amazon.com/solutions/account-assessment-for-aws-organizations/) et [CFAT](https://github.com/cloud-foundations-on-aws/cloud-foundations-templates/blob/main/cfat/README.md) pour accélérer le processus de revue et d'évaluation. Selon les outils ou l'approche que vous décidez d'utiliser, les étapes peuvent varier, mais ceci fournit une méthode validée pour le faire.

:::tip
Lors du déplacement de comptes vers un environnement AWS Control Tower, utilisez ce guide comme vérification des dépendances pré-migration, puis suivez le guide [Inscrire un compte AWS existant](https://docs.aws.amazon.com/controltower/latest/userguide/enroll-account.html) en complément après le transfert du compte vers l'organisation cible.
:::

## Services clés et dépendances en un coup d'œil

Le tableau suivant résume les services et fonctionnalités AWS clés qui peuvent être impactés lors du transfert d'un compte entre organisations :

| Catégorie | Service/fonctionnalité | Impact lors du transfert |
|----------|----------------|-------------------|
| **Contrôle d'accès** | IAM Identity Center | Attributions de jeux d'autorisations supprimées ; les utilisateurs perdent l'accès |
| **Autorisation** | Politiques de contrôle des services (SCPs) | Cessent de s'appliquer immédiatement |
| **Autorisation** | Politiques de contrôle des ressources (RCPs) | Cessent de s'appliquer immédiatement |
| **Déclaratif** | Politiques déclaratives (EC2) | Cessent de s'appliquer immédiatement |
| **Gestion** | Politiques Tag, Backup, AI opt-out | Détachées du compte |
| **Infrastructure** | AWS CloudFormation StackSets | Les ressources peuvent être supprimées (dépend du paramètre de rétention) |
| **Partage de ressources** | AWS Resource Access Manager | Partages à portée organisationnelle révoqués (sauf si la rétention est activée) |
| **Délégation** | Services administrateur délégué | Doivent être désenregistrés avant le transfert ; certains services suppriment les données |
| **Conditions de politique** | `aws:PrincipalOrgID` / `aws:PrincipalOrgPaths` | Les politiques référençant l'ID de l'organisation source refuseront l'accès |
| **Facturation** | Instances réservées / Savings Plans | Avantages du partage à l'échelle de l'organisation perdus |
| **Facturation** | Tags d'allocation des coûts | Doivent être réactivés dans l'organisation cible |
| **Observability** | Amazon EventBridge inter-comptes | Les politiques de bus d'événements référençant l'ID de l'organisation cesseront de fonctionner |
| **Accès au compte** | Utilisateur root / `OrganizationAccountAccessRole` | Peut perdre tout accès si non vérifié avant le transfert |

## Vue d'ensemble

Ce guide fournit un processus étape par étape pour évaluer la préparation à la migration avant de transférer un compte AWS entre AWS Organizations. Il combine des outils automatisés ([Account Assessment for AWS Organizations](https://docs.aws.amazon.com/solutions/account-assessment-for-aws-organizations/) + [CFAT](https://github.com/cloud-foundations-on-aws/cloud-foundations-templates/blob/main/cfat/README.md)) avec des commandes CLI validées pour couvrir toutes les dépendances.

**Applicable pour :** Fusions et acquisitions, consolidation d'organisations, restructuration de comptes.

**Fonctionnalités clés exploitées :**
- [Transferts directs de comptes](https://aws.amazon.com/about-aws/whats-new/2025/11/aws-organizations-direct-account-transfers/) (Nov 2025) — aucune période autonome requise
- [AWS RAM RetainSharingOnAccountLeaveOrganization](https://aws.amazon.com/about-aws/whats-new/2026/02/aws-resource-access-manager/) (Fév 2026) — préserver les partages de ressources pendant le transfert

**Références :**
- [Migrer un compte vers une autre organisation](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_account_migration.html) — documentation AWS
- [Déplacer un compte - Partie 1 : Politiques, AWS RAM, clés de condition](https://aws.amazon.com/blogs/mt/aws-organizations-moving-an-organization-member-account-to-another-organization-part-1/) — blog AWS
- [Déplacer un compte - Partie 2 : Administrateurs délégués](https://aws.amazon.com/blogs/mt/aws-organizations-moving-an-organization-member-account-to-another-organization-part-2/) — blog AWS

---

## Phase 1 : Déployer les outils d'évaluation

### 1.1 Déployer Account Assessment for AWS Organizations

Déployez dans le compte de gestion. Fournit : Policy Explorer, scan Delegated Admin, scan Trusted Access.

:::note
Par souci de simplicité, ce guide montre le déploiement de la pile Hub dans le compte de gestion. Pour les environnements de production, AWS recommande de déployer la pile Hub dans un **compte membre séparé** (par ex., un compte de services partagés ou d'outillage de sécurité) afin de suivre le principe du moindre privilège dans le compte de gestion. La pile Org-Management est toujours déployée dans le compte de gestion, quel que soit le cas.
:::

**Pile Hub (compte de gestion) :**
```bash
aws cloudformation create-stack \
  --stack-name AccountAssessment-Hub \
  --template-url https://solutions-reference.s3.amazonaws.com/account-assessment-for-aws-organizations/latest/account-assessment-for-aws-organizations-hub.template \
  --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND \
  --parameters \
    ParameterKey=DeploymentNamespace,ParameterValue=<NAMESPACE> \
    ParameterKey=UserEmail,ParameterValue=<EMAIL> \
    "ParameterKey=AllowListedIPRanges,ParameterValue=0.0.0.0/1\,128.0.0.0/1" \
    ParameterKey=OrganizationID,ParameterValue=<ORG_ID> \
    ParameterKey=ManagementAccountId,ParameterValue=<MGMT_ACCOUNT_ID> \
  --region <REGION>
```

**Pile Org-Management (compte de gestion) :**
```bash
aws cloudformation create-stack \
  --stack-name AccountAssessment-OrgMgmt \
  --template-url https://solutions-reference.s3.amazonaws.com/account-assessment-for-aws-organizations/latest/account-assessment-for-aws-organizations-org-management.template \
  --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND \
  --parameters \
    ParameterKey=DeploymentNamespace,ParameterValue=<NAMESPACE> \
    ParameterKey=HubAccountId,ParameterValue=<HUB_ACCOUNT_ID> \
  --region <REGION>
```

**Pile Spoke (chaque compte à évaluer, via StackSet) :**
```bash
aws cloudformation create-stack-set \
  --stack-set-name AccountAssessment-Spoke \
  --template-url https://solutions-reference.s3.amazonaws.com/account-assessment-for-aws-organizations/latest/account-assessment-for-aws-organizations-spoke.template \
  --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM \
  --parameters \
    ParameterKey=DeploymentNamespace,ParameterValue=<NAMESPACE> \
    ParameterKey=HubAccountId,ParameterValue=<HUB_ACCOUNT_ID> \
  --permission-model SERVICE_MANAGED \
  --auto-deployment Enabled=true,RetainStacksOnAccountRemoval=false \
  --region <REGION>

aws cloudformation create-stack-instances \
  --stack-set-name AccountAssessment-Spoke \
  --deployment-targets OrganizationalUnitIds=<ROOT_OR_OU_ID> \
  --regions <REGION> \
  --region <REGION>
```

> **Important :** Déployez également la pile Spoke directement dans le compte de gestion (les StackSets avec SERVICE_MANAGED l'excluent) :
```bash
aws cloudformation create-stack \
  --stack-name AccountAssessment-Spoke \
  --template-url https://solutions-reference.s3.amazonaws.com/account-assessment-for-aws-organizations/latest/account-assessment-for-aws-organizations-spoke.template \
  --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND \
  --parameters \
    ParameterKey=DeploymentNamespace,ParameterValue=<NAMESPACE> \
    ParameterKey=HubAccountId,ParameterValue=<HUB_ACCOUNT_ID> \
  --region <REGION>
```

### 1.2 Exécuter CFAT (Cloud Foundation Assessment Tool)

Exécutez depuis CloudShell dans le compte de gestion :
```bash
curl -sSL https://raw.githubusercontent.com/cloud-foundations-on-aws/cloud-foundations-templates/main/cfat/run-assessment.sh | sh
```

Téléchargez les résultats : `./cfat/assessment.zip`

---

## Phase 2 : Évaluation automatisée (outil Account Assessment)

### 2.1 Lancer les scans depuis l'interface Web

1. Connectez-vous à l'interface Web Account Assessment (vérifiez vos e-mails pour les identifiants Cognito)
2. Lancez le scan **Delegated Admin** → Téléchargez le CSV
3. Lancez le scan **Trusted Access** → Téléchargez le CSV
4. Attendez le scan nocturne **Policy Explorer** (ou déclenchez-le manuellement) :

```bash
# Déclencher le scan Policy Explorer manuellement
aws lambda invoke \
  --function-name <NAMESPACE>-PolicyExplorerStartScan-<ID> \
  --payload '{"source": "manual-trigger"}' \
  --region <REGION> \
  /dev/null
```

### 2.2 Rechercher les dépendances organisationnelles dans Policy Explorer

Dans l'interface Web Policy Explorer :
1. Cliquez sur le bouton **"Add OrgId"** pour rechercher votre ID d'organisation dans les conditions de politique
2. Recherchez `aws:PrincipalOrgID`, `aws:PrincipalOrgPaths`, `aws:ResourceOrgID`
3. Téléchargez les résultats en CSV

**Ce que cela détecte :**
- Politiques basées sur les ressources avec des conditions organisationnelles (S3, KMS, SQS, SNS, Lambda, etc.)
- Politiques basées sur l'identité référençant l'organisation
- SCPs avec des conditions spécifiques à l'organisation

---

## Phase 3 : Vérifications manuelles des dépendances (commandes CLI)

Les vérifications suivantes couvrent les lacunes non prises en compte par les outils automatisés.

### 3.1 AWS CloudFormation StackSets ciblant le compte

**Risque :** Les StackSets gérés par le service SUPPRIMERONT les ressources du compte lorsqu'il quitte l'organisation (sauf si `RetainStacksOnAccountRemoval=true`).

:::info
Exécutez ces commandes depuis le **compte de gestion** ou un compte administrateur délégué pour CloudFormation StackSets. Les StackSets gérés par le service ne peuvent être gérés que depuis ces comptes.
:::

```bash
# Lister tous les StackSets actifs
aws cloudformation list-stack-sets --status ACTIVE --region <REGION>

# Pour chaque StackSet, vérifier si le compte en migration a des instances
aws cloudformation list-stack-instances \
  --stack-set-name <STACKSET_NAME> \
  --stack-instance-account <ACCOUNT_ID> \
  --region <REGION>

# Vérifier le paramètre de rétention
aws cloudformation describe-stack-set \
  --stack-set-name <STACKSET_NAME> \
  --region <REGION> \
  --query "StackSet.AutoDeployment.RetainStacksOnAccountRemoval"
```

**Action :** Pour chaque StackSet avec `RetainStacksOnAccountRemoval=false` qui déploie des ressources critiques, soit :
- Mettre à jour vers `RetainStacksOnAccountRemoval=true` avant la migration
- Soit documenter que ces ressources seront supprimées et planifier leur recréation dans l'organisation cible

### 3.2 Attributions IAM Identity Center

**Risque :** Toutes les attributions de jeux d'autorisations pour le compte en migration sont supprimées lorsqu'il quitte. Les utilisateurs perdent l'accès IAM Identity Center à ce compte.

:::info
Exécutez ces commandes depuis le **compte de gestion** ou le compte administrateur délégué Identity Center.
:::

```bash
# Obtenir l'ARN de l'instance Identity Center
aws sso-admin list-instances --region <REGION>

# Lister tous les jeux d'autorisations provisionnés pour le compte
aws sso-admin list-permission-sets-provisioned-to-account \
  --instance-arn <INSTANCE_ARN> \
  --account-id <ACCOUNT_ID> \
  --region <REGION>

# Pour chaque jeu d'autorisations, lister qui a accès
aws sso-admin list-account-assignments \
  --instance-arn <INSTANCE_ARN> \
  --account-id <ACCOUNT_ID> \
  --permission-set-arn <PERMISSION_SET_ARN> \
  --region <REGION>
```

**Action :** Documentez toutes les attributions. Dans l'Identity Center de l'organisation cible, recréez les jeux d'autorisations et attributions équivalents après la migration.

### 3.3 Partages de ressources AWS Resource Access Manager (AWS RAM)

**Risque :** Les partages AWS RAM à portée organisationnelle sont révoqués lorsque le compte quitte. Une nouvelle fonctionnalité (Fév 2026) permet la rétention.

```bash
# Vérifier les partages DÉTENUS par le compte en migration (exécuter depuis ce compte)
aws ram get-resource-shares --resource-owner SELF --region <REGION>

# Vérifier les partages consommés par le compte en migration
aws ram get-resource-shares --resource-owner OTHER-ACCOUNTS --region <REGION>

# Lister les ressources réelles dans les partages
aws ram list-resources --resource-owner OTHER-ACCOUNTS --region <REGION>
aws ram list-resources --resource-owner SELF --region <REGION>
```

**Atténuation (fonctionnalité Fév 2026) :** Activez la rétention sur les partages AWS RAM avant le transfert :
```bash
# Exécuter depuis le compte PROPRIÉTAIRE du partage
aws ram update-resource-share \
  --resource-share-arn <SHARE_ARN> \
  --retain-sharing-on-account-leave-organization \
  --region <REGION>
```

**Appliquer à l'échelle de l'organisation via SCP :**
```json
{
  "Effect": "Deny",
  "Action": ["ram:CreateResourceShare", "ram:UpdateResourceShare"],
  "Resource": "*",
  "Condition": {
    "BoolIfExists": {
      "ram:RetainSharingOnAccountLeaveOrganization": "false"
    }
  }
}
```

### 3.4 Politiques d'organisation (politiques d'autorisation, déclaratives et de gestion)

**Risque :** TOUTES les politiques d'organisation cessent de s'appliquer lorsque le compte est transféré. Cela inclut les politiques d'autorisation (SCPs, RCPs), les politiques déclaratives (EC2) et les politiques de gestion.

:::info
Exécutez ces commandes depuis le **compte de gestion** ou un compte administrateur délégué pour AWS Organizations.
:::

> **Important :** Policy Explorer dans Account Assessment ne scanne que le **contenu des SCP**. Il NE couvre PAS les RCPs, les politiques déclaratives ou les politiques de gestion. Ceux-ci doivent être vérifiés manuellement.
>
> **Astuce :** CFAT fournit un instantané initial utile — il confirme si les SCPs, RCPs, Tag Policies et Backup Policies sont activées au niveau de l'organisation. Utilisez-le comme point de départ pour savoir quels types de politiques nécessitent une investigation plus approfondie avec les commandes CLI ci-dessous.

```bash
# D'abord : découvrir tous les types de politiques activés dans l'organisation
aws organizations list-roots --query "Roots[0].PolicyTypes"

# --- POLITIQUES D'AUTORISATION ---

# SCPs appliquées au compte (également couvert par Policy Explorer pour le contenu)
aws organizations list-policies-for-target \
  --target-id <ACCOUNT_ID> \
  --filter SERVICE_CONTROL_POLICY

# RCPs appliquées au compte (NON couvert par Policy Explorer)
aws organizations list-policies-for-target \
  --target-id <ACCOUNT_ID> \
  --filter RESOURCE_CONTROL_POLICY

# --- POLITIQUES DÉCLARATIVES ---

# Politiques déclaratives (EC2 - par ex., AMIs autorisées, bloquer les snapshots publics)
aws organizations list-policies-for-target \
  --target-id <ACCOUNT_ID> \
  --filter DECLARATIVE_POLICY_EC2

# --- POLITIQUES DE GESTION ---

# Vérifier chaque type de politique de gestion activé :
aws organizations list-policies-for-target --target-id <ACCOUNT_ID> --filter TAG_POLICY
aws organizations list-policies-for-target --target-id <ACCOUNT_ID> --filter BACKUP_POLICY
aws organizations list-policies-for-target --target-id <ACCOUNT_ID> --filter AISERVICES_OPT_OUT_POLICY
aws organizations list-policies-for-target --target-id <ACCOUNT_ID> --filter BEDROCK_POLICY
aws organizations list-policies-for-target --target-id <ACCOUNT_ID> --filter CHATBOT_POLICY
aws organizations list-policies-for-target --target-id <ACCOUNT_ID> --filter INSPECTOR_POLICY
aws organizations list-policies-for-target --target-id <ACCOUNT_ID> --filter NETWORK_SECURITY_DIRECTOR_POLICY
aws organizations list-policies-for-target --target-id <ACCOUNT_ID> --filter S3_POLICY
aws organizations list-policies-for-target --target-id <ACCOUNT_ID> --filter SECURITYHUB_POLICY
aws organizations list-policies-for-target --target-id <ACCOUNT_ID> --filter UPGRADE_ROLLOUT_POLICY

# Obtenir l'OU parent du compte (les politiques peuvent être héritées)
aws organizations list-parents --child-id <ACCOUNT_ID>

# Lister les politiques au niveau de l'OU (répéter pour chaque type de politique)
aws organizations list-policies-for-target \
  --target-id <OU_ID> \
  --filter <POLICY_TYPE>

# Obtenir le contenu de la politique pour la répliquer dans l'organisation cible
aws organizations describe-policy --policy-id <POLICY_ID>

# Obtenir les politiques de gestion effectives
aws organizations describe-effective-policy \
  --policy-type TAG_POLICY \
  --target-id <ACCOUNT_ID>

aws organizations describe-effective-policy \
  --policy-type BACKUP_POLICY \
  --target-id <ACCOUNT_ID>

aws organizations describe-effective-policy \
  --policy-type AISERVICES_OPT_OUT_POLICY \
  --target-id <ACCOUNT_ID>
```

**Distinction clé :**
- **Politiques d'autorisation (SCPs, RCPs)** — Les SCPs restreignent les actions API que les principaux peuvent effectuer. Les RCPs restreignent les actions pouvant être effectuées SUR les ressources (par ex., bloquer l'accès non chiffré à Secrets Manager). Policy Explorer scanne uniquement les SCPs, pas les RCPs.
- **Politiques déclaratives (EC2)** — Appliquent des configurations d'état souhaité pour EC2 (par ex., uniquement les AMIs autorisées, bloquer les snapshots publics). NON scannées par aucun des deux outils.
- **Politiques de gestion** — Tag, Backup, AI opt-out, Bedrock, ChatBot, Inspector, SecurityHub, S3, Network Security Director, Upgrade Rollout. Détachées lors du transfert. NON scannées par aucun des deux outils.

**Action :** Pour chaque type de politique activé dans votre organisation :
1. Listez les politiques appliquées au compte (directes + héritées de l'OU/root)
2. Obtenez le contenu de la politique avec `describe-policy`
3. Répliquez dans l'organisation cible AVANT le transfert
4. Pour les politiques déclaratives : vérifiez que les ressources du compte sont conformes aux politiques de l'organisation cible également

### 3.5 Services administrateur délégué

**Risque :** Doivent être désenregistrés avant la migration. Certains services SUPPRIMENT les données lors du désenregistrement (Detective, Firewall Manager).

:::info
Exécutez ces commandes depuis le **compte de gestion**.
:::

```bash
# Lister tous les comptes administrateurs délégués
aws organizations list-delegated-administrators

# Lister les services pour le compte en migration
aws organizations list-delegated-services-for-account \
  --account-id <ACCOUNT_ID>
```

**Action :** Pour chaque service délégué :
1. Enregistrez un administrateur délégué de remplacement (si l'organisation continue)
2. Désenregistrez le compte en migration
3. Consultez le blog Partie 2 pour les commandes de désenregistrement spécifiques à chaque service et les implications de perte de données

### 3.6 Bus d'événements Amazon EventBridge inter-comptes

**Risque :** Les autorisations de livraison d'événements inter-comptes référençant l'organisation cesseront de fonctionner.

```bash
# Vérifier la politique du bus d'événements pour les autorisations basées sur l'organisation
aws events describe-event-bus --region <REGION>

# Vérifier dans toutes les régions où EventBridge est utilisé
aws events describe-event-bus --name default --region <REGION>
```

**Action :** Mettez à jour les politiques de ressources du bus d'événements pour utiliser les IDs de compte au lieu des IDs d'organisation, ou ajoutez l'ID de l'organisation cible.

### 3.7 Facturation et gestion des coûts

**Risque :** L'historique de facturation au niveau de l'organisation reste avec le compte de gestion. Les tags d'allocation des coûts doivent être réactivés.

```bash
# Lister les tags d'allocation des coûts actifs (à recréer dans l'organisation cible)
aws ce list-cost-allocation-tags --status Active

# Vérifier la configuration des rapports CUR
aws cur describe-report-definitions --region us-east-1

# Vérifier les détails de l'organisation (ensemble de fonctionnalités, pour la compatibilité avec l'organisation cible)
aws organizations describe-organization

# Lister les Savings Plans détenus par le compte en migration (exécuter depuis ce compte)
aws savingsplans list-savings-plans --states active

# Lister les instances réservées détenues par le compte en migration (exécuter depuis ce compte)
aws ec2 describe-reserved-instances --filters Name=state,Values=active --region <REGION>

# Vérifier les préférences de partage des instances réservées/Savings Plans (exécuter depuis le compte de gestion)
# Note : Utilisez la Console de facturation → Préférences → Partage de remise RI et Savings Plans
# pour voir le mode de partage (à l'échelle de l'organisation, groupe prioritaire ou groupe restreint)
```

**Action :**
- Exportez tous les rapports de facturation avant le transfert
- Documentez les tags d'allocation des coûts actifs
- Réactivez les tags d'allocation des coûts dans l'organisation cible (prend jusqu'à 24 heures)
- **Instances réservées et Savings Plans :**
  - Les instances réservées/Savings Plans **achetés par le compte en migration** suivent le compte — mais ils ne s'appliqueront PLUS à la facture consolidée de l'organisation source
  - Les instances réservées/Savings Plans **achetés par D'AUTRES comptes** dans l'organisation source qui étaient partagés avec le compte en migration ne bénéficieront PLUS au compte en migration après le transfert
  - Les instances réservées/Savings Plans s'appliquent uniquement à l'organisation où ils sont achetés — ils ne peuvent pas couvrir plusieurs organisations
  - Si le compte en migration bénéficiait du partage d'instances réservées/Savings Plans à l'échelle de l'organisation, il perd cette remise immédiatement
  - Si le compte en migration détient des instances réservées/Savings Plans qui étaient partagés à l'échelle de l'organisation, l'organisation source perd cette capacité de remise
  - **Vérifiez le mode de partage :** Le partage à l'échelle de l'organisation, en groupe prioritaire ou en groupe restreint affecte la portée de l'impact
  - Contactez le support AWS si des instances réservées/Savings Plans doivent être transférés vers un autre compte avant la migration

---

## Phase 4 : Préparation de la fondation CFAT (organisation cible)

Utilisez les résultats CFAT pour vérifier que l'**organisation cible** est prête à recevoir le compte :

| Vérification CFAT | Pourquoi c'est important pour la migration |
|------------|------------------------------|
| Control Tower déployé | Fournit des garde-fous pour le compte entrant |
| OU Sécurité existante | Le compte a besoin d'une zone d'atterrissage gouvernée |
| Compte Log Archive existant | Journalisation centralisée pour le compte migré |
| IAM Identity Center configuré | Les utilisateurs ont besoin d'un accès IAM Identity Center au nouveau compte |
| SCPs activées | Les politiques de gouvernance doivent être prêtes |
| Config Recorder activé | Surveillance de la conformité pour le nouveau compte |

---

## Phase 5 : Liste de contrôle pré-transfert

| # | Vérification | Outil | Commande CLI | Statut |
|---|-------|------|-------------|--------|
| 1 | ID Org dans les politiques basées sur les ressources | Account Assessment (Policy Explorer) | Interface Web → Add OrgId | ☐ |
| 2 | ID Org dans les politiques basées sur l'identité | Account Assessment (Policy Explorer) | Recherche interface Web | ☐ |
| 3 | Services administrateur délégué | Account Assessment (scan Delegated Admin) | `list-delegated-services-for-account` | ☐ |
| 4 | Services d'accès de confiance | Account Assessment (scan Trusted Access) | `list-aws-service-access-for-organization` | ☐ |
| 5 | StackSets ciblant le compte | Manuel | `list-stack-instances --stack-instance-account` | ☐ |
| 6 | Paramètres de rétention StackSet | Manuel | `describe-stack-set` → AutoDeployment | ☐ |
| 7 | Attributions Identity Center | Manuel | `list-permission-sets-provisioned-to-account` | ☐ |
| 8 | Partages AWS RAM (détenus) | Manuel | `get-resource-shares --resource-owner SELF` | ☐ |
| 9 | Partages AWS RAM (consommés) | Manuel | `get-resource-shares --resource-owner OTHER-ACCOUNTS` | ☐ |
| 10 | AWS RAM RetainSharing activé | Manuel | `update-resource-share --retain-sharing...` | ☐ |
| 11 | SCPs appliquées au compte (autorisation) | Account Assessment (Policy Explorer) + Manuel | `list-policies-for-target` | ☐ |
| 12 | RCPs appliquées au compte (autorisation) | Manuel (PAS dans Policy Explorer) | `list-policies-for-target --filter RESOURCE_CONTROL_POLICY` | ☐ |
| 13 | Politiques déclaratives (EC2) appliquées au compte | Manuel (PAS dans les deux outils) | `list-policies-for-target --filter DECLARATIVE_POLICY_EC2` | ☐ |
| 14 | Politiques de gestion (Tag/Backup/AI/Bedrock/ChatBot/Inspector/SecurityHub/S3/etc.) | Manuel | `describe-effective-policy` + `list-policies-for-target` | ☐ |
| 15 | EventBridge inter-comptes | Manuel | `describe-event-bus` | ☐ |
| 16 | Tags d'allocation des coûts documentés | Manuel | `list-cost-allocation-tags --status Active` | ☐ |
| 17 | Rapports CUR exportés | Manuel | `describe-report-definitions` | ☐ |
| 18 | Impact de la propriété et du partage des instances réservées/Savings Plans évalué | Manuel | `list-savings-plans` + `describe-reserved-instances` | ☐ |
| 19 | Âge de l'organisation cible ≥ 7 jours | Manuel | `describe-organization` | ☐ |
| 20 | Quota de comptes de l'organisation cible | Manuel | Vérifier les quotas de service | ☐ |
| 21 | SCPs/RCPs/Politiques déclaratives de l'organisation cible prêtes | Manuel | Répliquer depuis la source | ☐ |
| 22 | Identity Center de l'organisation cible prêt | CFAT | Exécuter CFAT sur la cible | ☐ |
| 23 | OrganizationAccountAccessRole supprimé | Manuel | Supprimer le rôle IAM dans le compte en migration | ☐ |

---

## Phase 5.5 : Procédure d'urgence — Vérifier les options de récupération du compte

**Scénario :** Si un compte est transféré sans vérifier l'accès Identity Center ou d'autres contrôles d'accès, vous pouvez perdre TOUT accès au compte. Avant le transfert, assurez-vous de pouvoir récupérer l'accès de manière indépendante.

**Pourquoi c'est important :** Une fois que le compte quitte l'organisation source :
- Les jeux d'autorisations Identity Center sont supprimés → accès IAM Identity Center perdu
- La confiance `OrganizationAccountAccessRole` peut être rompue → accès inter-comptes perdu
- Si aucun identifiant d'utilisateur root n'existe (courant pour les comptes créés dans l'organisation) → le compte est verrouillé

### Pré-transfert : Vérifier les options de récupération

```bash
# Vérifier que le compte a une adresse e-mail root valide (pouvez-vous y recevoir des e-mails ?)
aws account get-primary-email --account-id <ACCOUNT_ID> --region us-east-1

# Vérifier que le numéro de téléphone est défini (nécessaire pour la récupération MFA de l'utilisateur root)
aws account get-contact-information --account-id <ACCOUNT_ID> --region us-east-1

# Vérifier que les contacts alternatifs sont configurés
aws account get-alternate-contact --account-id <ACCOUNT_ID> --alternate-contact-type SECURITY --region us-east-1
aws account get-alternate-contact --account-id <ACCOUNT_ID> --alternate-contact-type BILLING --region us-east-1
aws account get-alternate-contact --account-id <ACCOUNT_ID> --alternate-contact-type OPERATIONS --region us-east-1
```

### Pré-transfert : Mettre à jour les informations de récupération si nécessaire

```bash
# Mettre à jour l'e-mail de l'utilisateur root (depuis le compte de gestion, nécessite l'accès de confiance Account Management)
aws account start-primary-email-update --account-id <ACCOUNT_ID> --primary-email <NEW_EMAIL> --region us-east-1
aws account accept-primary-email-update --account-id <ACCOUNT_ID> --otp <CODE> --primary-email <NEW_EMAIL> --region us-east-1

# Mettre à jour le nom du compte (fonctionnalité Avr 2025 — ne nécessite plus l'accès root)
aws account put-account-name --account-id <ACCOUNT_ID> --account-name <NEW_NAME> --region us-east-1

# Mettre à jour le numéro de téléphone / informations de contact
aws account put-contact-information --account-id <ACCOUNT_ID> --region us-east-1 \
  --contact-information '{
    "FullName": "<NAME>",
    "PhoneNumber": "<PHONE>",
    "AddressLine1": "<ADDRESS>",
    "City": "<CITY>",
    "StateOrRegion": "<STATE>",
    "PostalCode": "<ZIP>",
    "CountryCode": "<CC>"
  }'
```

### Options de récupération d'urgence (si l'accès est perdu après le transfert)

> ⚠️ **Les vérifications préalables sont essentielles.** Contacter le support AWS devrait être le DERNIER recours — cela nécessite plusieurs étapes de vérification d'identité, peut prendre des jours et ne GARANTIT PAS la récupération de l'accès. Assurez-vous que toutes les options de récupération sont vérifiées AVANT le transfert.

| Priorité | Méthode | Quand l'utiliser | Comment |
|----------|--------|-------------|-----|
| 1er | **Réinitialisation du mot de passe root** | Vous avez accès à l'e-mail root | Allez sur la connexion AWS → "Mot de passe oublié" → réinitialiser par e-mail |
| 2e | **Réinitialisation MFA de l'utilisateur root** | Appareil MFA perdu, avez le numéro de téléphone | Utilisez le flux de vérification par téléphone à la connexion |
| 3e | **Compte de gestion (organisation cible)** | Le compte est maintenant dans l'organisation cible | Utilisez `OrganizationAccountAccessRole` s'il existe, ou les APIs Account Management |
| **Dernier recours** | **Support AWS** | Pas d'accès e-mail/téléphone, toutes les autres options épuisées | Ouvrez un cas de support depuis un autre compte. Nécessite plusieurs étapes de vérification (ID de compte, informations de contact, détails de facturation). **Pas garanti de réussir et peut prendre un temps prolongé.** |

### Liste de contrôle pré-transfert pour la récupération

| # | Vérification | Statut |
|---|-------|--------|
| 1 | L'e-mail de l'utilisateur root est accessible (peut recevoir des e-mails) | ☐ |
| 2 | Le mot de passe de l'utilisateur root est connu OU peut être réinitialisé par e-mail | ☐ |
| 3 | Le numéro de téléphone du compte est à jour et accessible | ☐ |
| 4 | L'appareil MFA de l'utilisateur root est documenté/accessible | ☐ |
| 5 | Au moins un utilisateur/rôle IAM avec accès admin existe dans le compte (indépendant de l'organisation) | ☐ |
| 6 | Les contacts alternatifs (Sécurité, Facturation, Opérations) sont définis | ☐ |

> **Critique :** Pour les comptes créés via `CreateAccount` dans Organizations, les identifiants de l'utilisateur root peuvent n'avoir jamais été définis. Vous DEVEZ effectuer une réinitialisation du mot de passe de l'utilisateur root (via l'e-mail root) AVANT de transférer le compte pour vous assurer de pouvoir y accéder de manière indépendante.

---

## Phase 6 : Exécuter le transfert (transfert direct)

En utilisant la fonctionnalité de transfert direct (Nov 2025), aucune période autonome n'est requise :

```bash
# Étape 1 : Depuis le compte de gestion de l'organisation CIBLE - envoyer l'invitation
aws organizations invite-account-to-organization \
  --target '{"Type": "ACCOUNT", "Id": "<ACCOUNT_ID>"}' \
  --region <REGION>

# Étape 2 : Depuis le compte EN MIGRATION - accepter l'invitation
aws organizations accept-handshake \
  --handshake-id <HANDSHAKE_ID> \
  --region <REGION>
```

---

## Phase 7 : Validation post-transfert

```bash
# Vérifier que le compte est dans la nouvelle organisation
aws organizations describe-organization

# Déplacer le compte vers l'OU correcte
aws organizations move-account \
  --account-id <ACCOUNT_ID> \
  --source-parent-id <ROOT_ID> \
  --destination-parent-id <TARGET_OU_ID>

# Vérifier que les SCPs sont appliquées
aws organizations list-policies-for-target \
  --target-id <ACCOUNT_ID> \
  --filter SERVICE_CONTROL_POLICY

# Accepter les invitations de partage AWS RAM
aws ram accept-resource-share-invitation \
  --resource-share-invitation-arn <INVITATION_ARN> \
  --region <REGION>

# Réactiver les tags d'allocation des coûts dans l'organisation cible
aws ce update-cost-allocation-tags-status \
  --cost-allocation-tags-status '[{"TagKey": "<KEY>", "Status": "Active"}]'

# Configurer les attributions Identity Center dans l'organisation cible
aws sso-admin create-account-assignment \
  --instance-arn <TARGET_INSTANCE_ARN> \
  --target-id <ACCOUNT_ID> \
  --target-type AWS_ACCOUNT \
  --permission-set-arn <PERMISSION_SET_ARN> \
  --principal-type <USER|GROUP> \
  --principal-id <PRINCIPAL_ID> \
  --region <REGION>
```

---

## Annexe : Matrice de couverture des outils

| Catégorie de dépendance | Account Assessment | CFAT | CLI manuel |
|--------------------|-------------------|------|------------|
| Politiques basées sur les ressources (conditions organisationnelles) | ✅ Policy Explorer | ❌ | — |
| Politiques basées sur l'identité (conditions organisationnelles) | ✅ Policy Explorer | ❌ | — |
| Contenu et conditions SCP (autorisation) | ✅ Policy Explorer | ❌ | `describe-policy` |
| **RCPs (autorisation)** | ❌ | ✅ Vérifie uniquement si activé | ✅ `list-policies-for-target --filter RESOURCE_CONTROL_POLICY` |
| **Politiques déclaratives (EC2)** | ❌ | ❌ | ✅ `list-policies-for-target --filter DECLARATIVE_POLICY_EC2` |
| **Politiques de gestion (Bedrock, ChatBot, Inspector, SecurityHub, S3, etc.)** | ❌ | ❌ | ✅ `list-policies-for-target --filter <TYPE>` |
| Tag/Backup/AI opt-out (gestion) | ❌ | ✅ Vérifie uniquement si activé | ✅ `describe-effective-policy` |
| Administrateurs délégués | ✅ Scan | ❌ | `list-delegated-services-for-account` |
| Services d'accès de confiance | ✅ Scan | ✅ Liste les services | `list-aws-service-access-for-organization` |
| StackSets (ressources à risque) | ❌ | ❌ | ✅ `list-stack-instances` + `describe-stack-set` |
| Attributions Identity Center | ❌ | ✅ Vérifie si configuré | ✅ `list-account-assignments` |
| Partages de ressources AWS RAM | ❌ | ❌ | ✅ `get-resource-shares` |
| Impact de la propriété et du partage des instances réservées/Savings Plans | ❌ | ❌ | ✅ `list-savings-plans` + `describe-reserved-instances` |
| EventBridge inter-comptes | ❌ | ❌ | ✅ `describe-event-bus` |
| Tags d'allocation des coûts | ❌ | ❌ | ✅ `list-cost-allocation-tags` |
| Statut Control Tower | ❌ | ✅ | — |
| Bonnes pratiques de fondation | ❌ | ✅ Évaluation complète | — |
| Quotas d'organisation | ❌ | ❌ | ✅ Console des quotas de service |

---

## Annexe : Dates clés et disponibilité des fonctionnalités

| Fonctionnalité | Date | Impact sur la migration |
|---------|------|---------------------|
| Transferts directs de comptes | Nov 2025 | Pas de période autonome, pas de reconfiguration des paiements/contacts |
| AWS RAM RetainSharingOnAccountLeaveOrganization | Fév 2026 | Les partages de ressources persistent pendant le transfert |
| Account Assessment Policy Explorer | v1.1.0+ | Scan nocturne pour les politiques dépendantes de l'organisation |

---

*Généré à l'aide d'Account Assessment for AWS Organizations et CFAT. Toutes les commandes CLI validées avec les APIs AWS en direct.*
