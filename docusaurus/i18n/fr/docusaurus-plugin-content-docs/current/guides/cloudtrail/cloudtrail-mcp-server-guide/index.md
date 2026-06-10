# Utilisation du serveur MCP CloudTrail pour la securite, l'audit et les operations

## Introduction

Le serveur [CloudTrail Model Context Protocol (MCP)](https://awslabs.github.io/mcp/servers/cloudtrail-mcp-server) permet aux agents comme [Kiro](https://kiro.dev/cli/) d'interroger et d'analyser les evenements [AWS CloudTrail](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html) directement via le langage naturel. En connectant vos agents aux evenements CloudTrail dans [CloudWatch Logs](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/send-cloudtrail-events-to-cloudwatch-logs.html) ou [CloudTrail Lake](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-lake.html), vous pouvez investiguer des incidents de securite, auditer l'activite des comptes, resoudre des problemes operationnels et generer des rapports de conformite, le tout via des invites conversationnelles au lieu d'ecrire des requetes SQL complexes ou d'analyser manuellement des journaux JSON.

## Pourquoi c'est important

Les equipes de securite, de conformite et d'operations passent un temps considerable a analyser les journaux CloudTrail pour comprendre l'activite des comptes AWS :

- **Les equipes de securite** doivent investiguer rapidement les activites suspectes, tracer les tentatives d'acces non autorises et identifier l'etendue des incidents de securite potentiels sur plusieurs comptes
- **Les equipes de conformite** doivent generer des rapports d'audit montrant qui a accede a quelles ressources, quand les modifications ont ete effectuees et si les activites sont conformes aux politiques organisationnelles
- **Les equipes d'operations** resolvent les perturbations de service en tracant les appels API, en identifiant les changements de configuration et en comprenant la sequence d'evenements menant aux problemes
- **Toutes les equipes** ont du mal avec la syntaxe des requetes CloudWatch Logs Insights, l'analyse JSON et la correlation d'evenements a travers les periodes et les comptes

Sans le serveur MCP CloudTrail, les equipes recourent a l'ecriture de requetes complexes, a l'analyse manuelle de journaux JSON ou a la construction de tableaux de bord personnalises, ajoutant du temps, de la complexite et un potentiel d'erreur humaine aux flux de travail critiques de securite et operationnels.

## Comment ca fonctionne

Le serveur MCP CloudTrail traduit les questions en langage naturel en requetes sur vos donnees CloudTrail, les execute et retourne des resultats lisibles avec contexte et informations.

**Sources de donnees prises en charge :**

- **CloudWatch Logs** : Utilise la [syntaxe de requete CloudWatch Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html) - Le serveur MCP decouvre automatiquement les groupes de journaux disponibles
- **CloudTrail Lake** : Utilise des [requetes SQL](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/query-create-edit-query.html) - Le serveur MCP decouvre automatiquement les magasins de donnees d'evenements disponibles pour CloudTrail Lake

**Capacites cles :**

- Requetes en langage naturel au lieu d'ecrire de la syntaxe de requete
- Support multi-comptes
- Analyse temporelle et correlation d'evenements
- Investigation de securite, rapports de conformite et resolution de problemes operationnels

## Exigences de configuration

Pour utiliser le serveur MCP CloudTrail, vous avez besoin de :

**Pour CloudWatch Logs :**
- [AWS CloudTrail configure pour envoyer des evenements vers CloudWatch Logs](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/send-cloudtrail-events-to-cloudwatch-logs.html)
- Permissions IAM : `logs:StartQuery`, `logs:GetQueryResults`, `logs:DescribeLogGroups`
- Le serveur MCP decouvrira automatiquement les groupes de journaux CloudTrail disponibles

**Pour CloudTrail Lake :**
- [Magasin de donnees d'evenements CloudTrail Lake](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/query-event-data-store.html) cree et configure
- Permissions IAM : `cloudtrail:StartQuery`, `cloudtrail:GetQueryResults`, `cloudtrail:DescribeEventDataStores`, `cloudtrail:ListEventDataStores` (voir [Permissions CloudTrail Lake](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/lake-permissions.html))
- Le serveur MCP decouvrira automatiquement les magasins de donnees d'evenements CloudTrail Lake disponibles

**Pour les deux :**
- Serveur MCP configure dans votre agent
- Identifiants AWS avec les permissions appropriees

## Configuration

Pour configurer le serveur MCP CloudTrail dans votre agent, suivez les instructions de configuration dans la [documentation des serveurs AWS MCP](https://awslabs.github.io/mcp/). Le serveur MCP decouvre automatiquement les sources de donnees CloudTrail disponibles (CloudWatch Logs et CloudTrail Lake) dans votre compte AWS.

**Dans vos invites**, vous pouvez optionnellement specifier quelle source de donnees interroger :

```
Using CloudWatch Logs, show me all failed login attempts in the last 24 hours.
```

```
Using CloudTrail Lake, show me all IAM policy changes in the last 90 days.
```

## Exemples d'invites pour des taches reelles

### Invites d'investigation de securite

#### 1. Investiguer les tentatives de connexion echouees

**Invite :**
```
Show me all failed console login attempts in the last 24 hours. 
Include the username, source IP address, and timestamp.
```

**Ce que ca fait :** Identifie les attaques potentielles par force brute ou les identifiants compromis en analysant les [enregistrements d'evenements CloudTrail](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-event-reference-record-contents.html)

**Cas d'utilisation :** L'equipe de securite recoit une alerte concernant plusieurs connexions echouees et doit evaluer le niveau de menace

---

#### 2. Identifier l'escalade de privileges

**Invite :**
```
Show me all IAM policy changes in the last 48 hours. 
Focus on policies that grant admin permissions or modify IAM roles.
```

**Ce que ca fait :** Detecte les tentatives potentielles d'escalade de privileges

**Cas d'utilisation :** L'equipe de securite investigue si un acteur a obtenu des permissions elevees

---

### Invites de conformite et d'audit

#### 3. Generer un rapport d'activite utilisateur

**Invite :**
```
Generate a complete audit report for IAM user demo.user for the month of January 2024. 
Include all API calls, resources accessed, and any permission changes.
```

**Ce que ca fait :** Cree une piste d'audit complete de l'activite utilisateur

**Cas d'utilisation :** Besoin de fournir une chronologie d'activite pour une certaine periode

---

#### 4. Suivre l'utilisation de la MFA

**Invite :**
```
Show me all console logins in the last month. Which users logged in without MFA? 
How many times did each user login?
```

**Ce que ca fait :** Valide la conformite MFA a travers l'organisation

**Cas d'utilisation :** La politique de securite exige la MFA pour tous les utilisateurs ; identifier les comptes non conformes

---

### Invites de resolution de problemes operationnels

#### 5. Investiguer une panne de service

**Invite :**
```
Our application stopped working at 2024-01-15 14:30 UTC. Show me all API calls 
related to our production VPC (vpc-abc123) in the 30 minutes before the outage. 
What changed?
```

**Ce que ca fait :** Identifie les changements de configuration qui ont cause la perturbation du service

**Cas d'utilisation :** L'equipe d'operations doit identifier rapidement la cause racine de la panne

---

#### 6. Debugger les problemes de permissions IAM

**Invite :**
```
User reports they can't create EC2 instances. Show me all EC2 RunInstances calls 
from user demo.user in the last 2 hours, including any access denied errors. 
What permissions are missing?
```

**Ce que ca fait :** Diagnostique les problemes de permissions IAM

**Cas d'utilisation :** Un utilisateur ne peut pas effectuer les taches requises ; identifier les permissions manquantes

---

### Invites avancees multi-comptes

#### 7. Revue de securite inter-comptes

**Invite :**
```
Across all our AWS accounts, show me any security group rules that allow inbound 
traffic from 0.0.0.0/0 on ports other than 80 and 443. When were these rules created 
and by whom?
```

**Ce que ca fait :** Identifie les risques de securite a travers l'ensemble de l'organisation AWS

**Cas d'utilisation :** L'equipe de securite effectue une revue de la posture de securite a l'echelle de l'organisation

**Note :** Necessite CloudTrail Lake avec un [magasin de donnees d'evenements d'organisation](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-lake-organizations.html) pour les requetes multi-comptes ou une piste d'organisation livree a CloudWatch Logs.

---

#### 8. Conformite a travers les comptes

**Invite :**
```
For production accounts (account IDs: 111111111111, 222222222222, 333333333333), 
show me any CloudTrail configuration changes in the last year. Has logging ever 
been disabled?
```

**Ce que ca fait :** Valide la conformite de la journalisation d'audit a travers l'organisation

**Cas d'utilisation :** L'audit de conformite necessite la preuve d'une journalisation continue

---

### Combiner CloudTrail avec les journaux de flux VPC

Lorsque CloudTrail et les [journaux de flux VPC](https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html) sont envoyes a CloudWatch Logs, vous pouvez correler les actions API avec le trafic reseau pour des investigations de securite completes.

#### 9. Resoudre les problemes de connectivite

**Invite :**
```
Application team reports connectivity issues to RDS database at 10:15 AM today. 
Check VPC Flow Logs for rejected connections to the database subnet around that time, 
then check CloudTrail for any security group, NACL, or route table changes in the 
30 minutes before the issue started.
```

**Ce que ca fait :** Identifie si les problemes de connectivite proviennent de changements de configuration ou de problemes reseau

**Cas d'utilisation :** L'equipe d'operations doit resoudre rapidement une panne applicative

---

#### 10. Detecter les mouvements lateraux

**Invite :**
```
CloudTrail shows user demo.user assumed role "ProductionAdmin" at 2:30 PM. 
Check VPC Flow Logs for all network connections initiated from instances 
accessed by that role in the following hour. Are there any unusual internal 
connections or port scans?
```

**Ce que ca fait :** Identifie les mouvements lateraux potentiels apres une escalade de privileges

**Cas d'utilisation :** L'equipe de securite investigue si des identifiants compromis ont ete utilises pour acceder a des ressources supplementaires

---

## Bonnes pratiques

**Invites efficaces :**
- Soyez specifique avec les plages de temps et incluez le contexte (identifiants de compte, noms de ressources, identites d'utilisateurs)
- Posez des questions de suivi pour affiner les resultats
- Demandez des informations exploitables : "que dois-je faire ?" ou "est-ce normal ?"

**Optimisation des requetes :**
- Commencez large, puis affinez
- Utilisez les identifiants de ressources pour des resultats plus rapides
- Combinez les questions connexes en une seule invite

**Securite :**
- Protegez les donnees sensibles dans les resultats de requete
- Validez les conclusions a travers plusieurs points de donnees
- Limitez l'acces au serveur MCP aux utilisateurs autorises


## Conclusion

Le serveur MCP CloudTrail transforme l'analyse des evenements CloudTrail d'une tache technique d'ecriture de requetes en une conversation naturelle avec vos agents. Les equipes de securite peuvent investiguer les incidents plus rapidement, les equipes de conformite peuvent generer des rapports d'audit sans effort, et les equipes d'operations peuvent resoudre les problemes sans apprendre une syntaxe de requete complexe.

Commencez avec les invites de base pour vos taches les plus courantes -- investiguer les connexions echouees, suivre les changements IAM ou resoudre les pannes -- puis adaptez-les a votre environnement specifique. La nature conversationnelle du serveur MCP signifie que vous pouvez affiner vos questions de maniere iterative, obtenant des reponses plus precises au fur et a mesure que vous explorez vos donnees CloudTrail.

Pour plus d'informations, consultez la [documentation des serveurs AWS MCP](https://awslabs.github.io/mcp/) et [MCP pour Kiro](https://kiro.dev/docs/mcp/).
