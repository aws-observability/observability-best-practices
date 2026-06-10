---
sidebar_position: 5
---
# AWS Control Tower

### Quel probleme AWS Control Tower resout-il ?

AWS Control Tower aide les organisations avec plusieurs comptes AWS et equipes qui ont besoin d'un moyen simple pour configurer et gouverner leur [environnement AWS multi-comptes](https://docs.aws.amazon.com/whitepapers/latest/organizing-your-aws-environment/organizing-your-aws-environment.html) a grande echelle tout en assurant la conformite avec les politiques etablies.


### Y a-t-il des couts supplementaires pour utiliser AWS Control Tower ?

Il n'y a pas de frais supplementaires ni d'engagements initiaux pour utiliser AWS Control Tower. Vous ne payez que pour les services AWS actives par AWS Control Tower et les services que vous utilisez dans votre zone d'atterrissage et les controles selectionnes que vous implementez. Par exemple, vous payez pour : - Service Catalog pour le provisionnement de comptes avec Account Factory et les controles obligatoires qui sont implementes en utilisant AWS Config.


### Que sont les controles (guardrails) dans AWS Control Tower ?

Les [controles](https://docs.aws.amazon.com/controltower/latest/controlreference/controls.html), precedemment appeles guardrails, sont des regles clairement definies pour la securite, les operations et la conformite qui aident a empecher le deploiement de ressources non conformes et surveillent continuellement les ressources deployees pour la conformite.


### Quels types de controles AWS Control Tower offre-t-il ?

AWS Control Tower offre trois principaux types de controles :

1. [Controles preventifs](https://docs.aws.amazon.com/controltower/latest/controlreference/preventive-controls.html) : Ces controles empechent les actions de se produire. Ils sont implementes en utilisant les politiques de controle de service (SCP) dans AWS Organizations.
2. [Controles detectifs](https://docs.aws.amazon.com/controltower/latest/controlreference/detective-controls.html) : Ces controles detectent des evenements specifiques ou la non-conformite des ressources apres qu'ils se soient produits et fournissent des alertes via le tableau de bord. Ils sont implementes en utilisant des regles AWS Config.
3. [Controles proactifs](https://docs.aws.amazon.com/controltower/latest/controlreference/proactive-controls.html) : Ces controles verifient si les ressources sont conformes a vos politiques et objectifs d'entreprise avant que les ressources ne soient provisionnees dans vos comptes. Si les ressources ne sont pas conformes, elles ne sont pas provisionnees. Les controles proactifs sont implementes avec des hooks AWS CloudFormation.

 En combinant ces trois types de controles dans AWS Control Tower, vous pouvez surveiller si votre environnement AWS multi-comptes est securise et gere conformement aux bonnes pratiques.


### Quels services AWS Control Tower orchestre-t-il ?

AWS Control Tower orchestre [plusieurs services AWS](https://docs.aws.amazon.com/controltower/latest/userguide/integrated-services.html) pour configurer et gouverner un environnement AWS multi-comptes. Les principaux services orchestres par AWS Control Tower comprennent :
1. AWS Organizations - Utilise pour configurer un cadre de conformite et de gouvernance coherent a travers votre environnement multi-comptes
2. AWS Service Catalog - Utilise pour la fonctionnalite Account Factory qui automatise le deploiement et l'enregistrement de comptes
3. AWS IAM Identity Center (anciennement AWS SSO) - Utilise pour gerer les identites des utilisateurs et l'acces federe. De plus, AWS Control Tower s'integre avec :
4. AWS CloudTrail - Utilise dans le cadre de la creation d'une archive de journaux centralisee
5. AWS Config - Utilise pour surveiller les ressources deployees et aider a prevenir la derive par rapport aux bonnes pratiques.



### Puis-je utiliser mon fournisseur d'identite existant avec AWS Control Tower ?

AWS Control Tower offre trois options d'integration de fournisseur d'identite :
1. Magasin d'utilisateurs IAM Identity Center : C'est l'option par defaut ou AWS Control Tower configure et gere IAM Identity Center pour vous. Il cree des groupes dans le repertoire IAM Identity Center et provisionne l'acces a ces groupes pour les utilisateurs selectionnes dans les comptes membres.
2. Active Directory : Lorsque AWS Control Tower est configure avec Active Directory, AWS Control Tower ne gere pas le repertoire IAM Identity Center et n'attribue pas d'utilisateurs ou de groupes aux nouveaux comptes AWS.
3. Fournisseur d'identite externe (IdP) : Avec cette option, AWS Control Tower cree des groupes dans le repertoire IAM Identity Center et provisionne l'acces a ces groupes pour les utilisateurs selectionnes dans les comptes membres. Vous pouvez specifier des utilisateurs existants de vos IdP externes comme Microsoft Entra ID, Google Workspace ou Okta lors de la creation de comptes, et AWS Control Tower donne a ces utilisateurs l'acces aux comptes nouvellement crees lorsqu'il synchronise les utilisateurs entre IAM Identity Center et les IdP externes.
Veuillez noter que vous avez la possibilite de [gerer vous-meme](https://docs.aws.amazon.com/controltower/latest/userguide/select-idp.html) AWS IAM Identity Center plutot que de permettre a AWS Control Tower de le configurer pour vous.


### Mes donnees sont-elles chiffrees et puis-je utiliser ma propre cle AWS Key Management Service ?

AWS Control Tower offre deux options principales de chiffrement pour votre zone d'atterrissage : 1. Chiffrement par defaut : Par defaut, AWS Control Tower chiffre les donnees au repos en utilisant les cles gerees par Amazon S3 (SSE-S3) pour les ressources de votre zone d'atterrissage. 2. Chiffrement AWS KMS : Comme niveau de securite optionnel ameliore, vous pouvez configurer AWS Control Tower pour utiliser une cle AWS Key Management Service (AWS KMS) afin de securiser les services deployes par AWS Control Tower, y compris AWS CloudTrail, AWS Config et les donnees Amazon S3 associees. Si vous choisissez d'activer AWS Backup lors de la configuration d'AWS Control Tower, vous devez choisir l'une de vos cles KMS multi-regions existantes, ou creer une nouvelle cle AWS KMS. Cette cle est utilisee pour proteger vos sauvegardes inter-comptes avec le chiffrement.


### Puis-je utiliser AWS Control Tower pour limiter l'acces a certaines regions disponibles dans AWS ?


AWS Control Tower offre des capacites de [refus de region](https://docs.aws.amazon.com/controltower/latest/userguide/region-how.html) pour limiter l'acces aux services AWS dans des regions specifiques pour les comptes enregistres. Cela aide a repondre aux exigences de conformite et a gerer les couts en restreignant l'acces a des regions specifiques. La fonctionnalite fonctionne avec les options de selection de region existantes dans AWS Control Tower. Par exemple, les clients allemands peuvent restreindre l'acces aux services en dehors de Francfort. Deux niveaux de controle sont disponibles : le niveau de la zone d'atterrissage (controle original) et le [niveau OU](https://docs.aws.amazon.com/controltower/latest/userguide/region-deny.html) (controle parametre plus recent) pour une gouvernance plus granulaire. Cette personnalisation aide a appliquer des restrictions regionales adaptees a vos besoins commerciaux.



### Comment puis-je enregistrer des comptes AWS existants qui ont deja des ressources AWS Config


Pour migrer un compte existant avec des ressources AWS Config dans AWS Control Tower, vous devez suivre un [processus en 5 etapes](https://docs.aws.amazon.com/controltower/latest/userguide/existing-config-resources.html) specifique :

1. Contactez le support client AWS pour ajouter le compte a la liste d'autorisation AWS Control Tower. Incluez "Enroll accounts that have existing AWS Config resources into AWS Control Tower" dans l'objet de votre ticket. Dans le corps, fournissez le numero de votre compte de gestion, les numeros des comptes membres avec des ressources AWS Config existantes, et votre region d'accueil selectionnee pour la configuration d'AWS Control Tower. Ce processus prend generalement 2 jours ouvrables.
2. Creez un nouveau role IAM dans le compte membre en utilisant AWS CloudFormation.
3. Identifiez les regions AWS avec des ressources AWS Config preexistantes.
4. Identifiez les regions AWS sans aucune ressource AWS Config.
5. Modifiez les ressources AWS Config existantes dans chaque region pour les aligner avec les parametres d'AWS Control Tower, puis enregistrez le compte avec AWS Control Tower.




### Qu'est-ce que la derive et comment gerer la derive et la configuration de Control Tower

La derive dans AWS Control Tower se produit lorsque des modifications de configuration sont effectuees en dehors d'AWS Control Tower, causant la non-conformite des ressources avec les exigences de gouvernance. Les types courants de derive comprennent :
 1. Derive de la politique de controle - lorsque les politiques detenues par AWS Control Tower sont mises a jour de maniere inattendue. Par exemple, une SCP pour un controle est mise a jour dans la console AWS Organizations ou par programmation en utilisant l'AWS CLI.
2. Derive du controle Security Hub. Ce type de derive se produit lorsqu'un controle faisant partie du standard gere par le service AWS Security Hub : AWS Control Tower signale un etat de derive.
3. Suppression d'unites organisationnelles requises (comme l'OU de securite)
4. Suppression ou inaccessibilite des roles IAM requis (AWSControlTowerAdmin, AWSControlTowerCloudTrailRole, AWSControlTowerStackSetRole)
5. Deplacement de comptes membres d'OU enregistrees AWS Control Tower vers d'autres OU.

AWS Control Tower offre diverses [options de remediation](https://docs.aws.amazon.com/controltower/latest/userguide/resolving-drift.html) selon le type de derive detecte. Pour une liste complete des actions de remediation, veuillez consulter le guide de l'utilisateur de Control Tower.


### Quelles sont les options de personnalisation de compte AWS Control Tower ?


AWS Control Tower offre plusieurs options pour personnaliser les comptes :
1. [Account Factory Customization](https://docs.aws.amazon.com/controltower/latest/userguide/af-customization-page.html) (AFC) - Vous permet de personnaliser les comptes AWS nouveaux et existants directement depuis la console AWS Control Tower. Vous pouvez definir les exigences de compte et les implementer dans le cadre d'un workflow en utilisant des blueprints (modeles de comptes personnalises). Ces blueprints decrivent les ressources et configurations specifiques requises lors du provisionnement d'un compte.
2. [Customizations for AWS Control Tower](https://docs.aws.amazon.com/controltower/latest/userguide/cfct-overview.html) (CfCT) - CfCT est un ensemble de fonctionnalites qui vous aide a personnaliser votre zone d'atterrissage AWS Control Tower au-dela de ce qui est disponible via la console AWS Control Tower. Il vous permet d'implementer des personnalisations en utilisant des modeles AWS CloudFormation, des politiques de controle de service (SCP) et des politiques de controle de ressources (RCP) qui peuvent etre deployes sur des comptes individuels et des unites organisationnelles (OU) au sein de votre organisation. CfCT est integre avec les evenements du cycle de vie d'AWS Control Tower, assurant que vos deploiements de ressources restent synchronises avec votre zone d'atterrissage.
3. [AWS Control Tower Account Factory for Terraform](https://docs.aws.amazon.com/controltower/latest/userguide/taf-account-provisioning.html) (AFT) est une solution qui vous permet de provisionner et personnaliser des comptes AWS en utilisant Terraform. Il cree un compte de gestion AFT separe (different du compte de gestion AWS Control Tower) pour deployer les capacites AFT. AFT offre une flexibilite en supportant toute distribution Terraform (Community Edition, Cloud et Enterprise).


### Puis-je utiliser GitHub comme source de configuration pour CfCT ?


Oui, GitHub peut etre utilise comme source de configuration pour Customizations for AWS Control Tower (CfCT). Lors du deploiement de CfCT, vous avez la possibilite de selectionner GitHub (via Code Connection) comme source AWS CodePipeline au lieu de l'option Amazon S3 par defaut.


### Puis-je utiliser GitHub comme depot AFT ?


Oui, vous pouvez migrer AWS Control Tower Account Factory for Terraform (AFT) d'AWS CodeCommit vers un autre fournisseur VCS. Pour migrer de CodeCommit vers un autre fournisseur VCS, suivez ces etapes : 1. Configurez de nouveaux depots chez votre fournisseur VCS choisi 2. Ajoutez ces depots comme nouveaux remotes dans git 3. Executez git push vers le nouveau fournisseur VCS 4. Dans votre compte de gestion AWS Control Tower, mettez a jour le module Terraform (bootstrap) pour pointer vers votre nouveau fournisseur VCS 5. Effectuez terraform plan pour previsualiser les changements, puis terraform apply 6. Connectez-vous a votre compte de gestion AFT et completez les AWS CodeConnections en attente pour le nouveau fournisseur VCS. Notez que la structure du depot doit rester la meme qu'avec AWS CodeCommit pour que AFT puisse executer correctement le code souhaite.

### Puis-je utiliser OpenTofu avec AFT ?

OpenTofu est un outil open source populaire d'infrastructure as code (IaC) forke de Terraform. OpenTofu dispose d'un module - sourcefuse/arc-control-tower-aft qui pourrait supporter les fonctions AFT avec quelques ajustements, cependant, il n'est pas supporte par AWS.

### Puis-je utiliser Gitlab comme VCS pour mon CfCT ?

Non, le support Gitlab pour CfCT n'est pas encore disponible. Vous pouvez utiliser Github comme VCS a partir de la version v2.8.1.

### J'ai deja Landing Zone Accelerator (LZA) deploye, puis-je quand meme utiliser AWS Control Tower ?


AWS Control Tower et Landing Zone Accelerator (LZA) fonctionnent bien ensemble comme solutions complementaires. La bonne pratique recommandee est de deployer AWS Control Tower comme votre zone d'atterrissage fondamentale en premier, puis d'ameliorer ses capacites avec LZA selon vos besoins. LZA est une solution construite en utilisant AWS Cloud Development Kit (CDK) qui deploie des capacites fondamentales concues pour s'aligner avec les bonnes pratiques AWS et plusieurs cadres de conformite globaux. Il vous aide a gerer et gouverner votre environnement multi-comptes plus efficacement. La solution LZA configure automatiquement un environnement cloud adapte a l'hebergement de charges de travail securisees. Il peut etre deploye dans toutes les regions AWS pour aider a maintenir la coherence des operations et de la gouvernance. En integrant AWS Control Tower avec LZA, vous pouvez personnaliser votre zone d'atterrissage tout en vous assurant qu'elle reste alignee avec les bonnes pratiques et les exigences de conformite.



### Puis-je utiliser une API pour interagir avec la configuration d'AWS Control Tower ?


AWS Control Tower offre [plusieurs API](https://docs.aws.amazon.com/controltower/latest/APIReference/Welcome.html) qui vous permettent d'automatiser diverses taches : 1. API de controle : - EnableControl : Active un controle, creant des ressources AWS sur l'unite organisationnelle specifiee et ses comptes - DisableControl : Desactive un controle, supprimant les ressources AWS sur l'unite organisationnelle specifiee et ses comptes - GetControlOperation : Recupere des informations sur les operations de controle. Ces API vous permettent de gerer programmatiquement les controles (egalement appeles guardrails), de visualiser leur statut d'application et d'obtenir des informations sur les controles actives, y compris leurs regions supportees, identifiants (ARN), statut de derive et resumes de statut. 2. API de zone d'atterrissage : Aident a automatiser les taches liees a votre zone d'atterrissage 3. API de base : Aident a automatiser certaines taches comme l'enregistrement d'une unite organisationnelle (OU). Vous pouvez consulter la documentation de reference de l'API.


### Comment puis-je changer l'adresse e-mail du compte cree par Control Tower ?


Pour changer l'adresse e-mail d'un compte membre enregistre dans AWS Control Tower, vous devez suivre ces etapes : 1. Recuperez le mot de passe de l'utilisateur root du compte. 2. Connectez-vous au compte avec le mot de passe de l'utilisateur root. 3. Changez l'adresse e-mail comme vous le feriez pour tout autre compte AWS, et attendez que le changement se reflete dans AWS Organizations. Il peut y avoir un delai pendant que le changement d'adresse e-mail termine sa mise a jour. 4. Mettez a jour le produit provisionne dans Service Catalog en utilisant l'adresse e-mail qui appartenait precedemment au compte. Ce processus associe la nouvelle adresse e-mail au produit provisionne, assurant que le changement d'adresse e-mail prend effet dans AWS Control Tower. Cependant, il est important de noter que cette procedure ne vous permet pas de changer l'adresse e-mail d'un compte de gestion, d'un compte d'archive de journaux ou d'un compte d'audit.



### Considerations de connectivite inter-reseaux


AWS Control Tower attribue par defaut la meme plage CIDR (172.31.0.0/16) a chaque VPC pour chaque compte cree au sein d'une unite organisationnelle (OU). Cette configuration par defaut ne permet pas initialement le peering entre vos VPC AWS Control Tower en raison du chevauchement des adresses IP. Pour supporter le peering VPC dans AWS Control Tower, vous devez modifier la plage CIDR dans les parametres d'Account Factory pour vous assurer que les adresses IP ne se chevauchent pas entre les VPC. Lorsque vous changez la plage CIDR dans les parametres d'Account Factory, tous les nouveaux comptes crees par la suite se verront attribuer la nouvelle plage CIDR, tandis que les comptes existants conserveront leurs plages CIDR originales. Cette approche permet le peering entre les VPC avec differentes plages d'adresses IP.


### Nous avons deja des comptes de securite et de journalisation existants, puis-je utiliser le compte existant comme compte d'audit et de journalisation pour AWS Control Tower ?


Oui, AWS Control Tower offre la possibilite de specifier des comptes AWS existants comme comptes d'audit (securite) et d'archive de journaux (journalisation) lors de la configuration initiale de la zone d'atterrissage. Cette fonctionnalite elimine le besoin pour AWS Control Tower de creer de nouveaux comptes partages. Lors de la configuration de votre zone d'atterrissage, vous pouvez choisir de : 1. Laisser AWS Control Tower creer de nouveaux comptes partages pour vous, ou 2. Apporter vos propres comptes existants pour l'audit et la journalisation. Si vous choisissez d'utiliser des comptes existants, vous devrez fournir les adresses e-mail uniques associees a ces comptes pendant le processus de configuration. Cette option n'est disponible que lors de la configuration initiale de la zone d'atterrissage. L'utilisation de comptes existants facilite l'extension de la gouvernance AWS Control Tower dans vos organisations existantes ou la migration vers AWS Control Tower depuis une zone d'atterrissage alternative.


### Nous avons deja un IDP externe existant, quels changements AWS Control Tower apportera-t-il aux parametres existants si j'active Control Tower ?


Lors de la configuration d'AWS Control Tower avec un fournisseur d'identite existant, il y a differents impacts selon la source d'identite que vous choisissez : Si IAM Identity Center est deja active dans votre organisation et que vous utilisez le repertoire IAM Identity Center, AWS Control Tower ajoutera des ressources telles que des ensembles de permissions et des groupes sans supprimer votre configuration existante. Si vous utilisez un autre repertoire (externe, AD, Managed AD), AWS Control Tower ne modifiera pas votre configuration existante.


### AWS Control Tower supporte-t-il les OU imbriquees


Oui, AWS Control Tower supporte les unites organisationnelles (OU) imbriquees. Les OU imbriquees dans AWS Control Tower vous permettent d'organiser les comptes en plusieurs niveaux de hierarchie et d'appliquer les controles de maniere hierarchique. Une OU imbriquee est une OU contenue dans une autre OU, creant une hierarchie ou les politiques attachees a une OU descendent et affectent toutes les OU et comptes en dessous. La hierarchie d'OU imbriquees dans AWS Control Tower peut avoir un maximum de cinq niveaux de profondeur. Vous pouvez enregistrer des OU multi-niveaux existantes, creer de nouvelles OU imbriquees et activer des controles sur toute OU enregistree quelle que soit sa profondeur dans la hierarchie. Avec les OU imbriquees, vous pouvez aligner vos OU AWS Control Tower sur la strategie multi-comptes AWS et reduire le temps necessaire pour activer les controles sur plusieurs OU en appliquant les controles au niveau de l'OU parent.


### AWS Control Tower est-il supporte dans AWS GovCloud ?


Oui, AWS Control Tower est [supporte dans GovCloud](https://docs.aws.amazon.com/govcloud-us/latest/UserGuide/govcloud-controltower.html). Cependant, AWS Control Tower dans AWS GovCloud (US) differe des regions commerciales en raison d'exigences de conformite et operationnelles plus strictes. Dans GovCloud, vous devez utiliser des comptes d'audit et d'archive de journaux existants lors de la configuration de la zone d'atterrissage, car la creation directe de comptes n'est pas disponible. Les comptes GovCloud sont crees via l'API CreateGovCloudAccount dans la region commerciale et lies pour la facturation/le support, mais ils ne peuvent rejoindre que les organisations GovCloud. Certaines fonctionnalites, comme la creation de comptes Account Factory, la conformite RGPD, certains controles Security Hub et les politiques de controle de ressources (RCP), ne sont pas supportees.



### AWS Control Tower utilise-t-il les politiques de controle de ressources (RCP) ?

AWS Control Tower supporte desormais les controles preventifs implementes avec les politiques de controle de ressources (RCP). Ces controles bases sur les RCP aident a etablir un perimetre de donnees a travers votre environnement AWS Control Tower pour proteger les ressources contre les acces non intentionnels. Les RCP vous permettent d'appliquer des exigences telles que s'assurer que les ressources Amazon S3 d'une organisation ne sont accessibles que par les principaux IAM appartenant a l'organisation ou par un service AWS, independamment des permissions accordees dans les politiques de bucket individuelles. Les controles preventifs bases sur les RCP sont disponibles dans toutes les regions AWS ou AWS Control Tower est disponible. Vous pouvez egalement configurer des exemptions pour ces controles si vous ne souhaitez pas que certains principaux ou ressources soient gouvernes par eux. De plus, AWS Control Tower signale desormais la derive de politique de controle pour les controles implementes avec les RCP et fournit une API ResetEnabledControl pour aider a gerer la derive de controle de maniere programmatique, vous permettant de reparer la derive de controle et de reinitialiser un controle a sa configuration prevue. AWS Control Tower supporte egalement les RCP pour Customizations for AWS Control Tower (CFCT), vous permettant d'incorporer ces politiques dans vos workflows de personnalisation.


### Comment tester les politiques sur les OU avant l'implementation

L'OU de staging de politiques agit comme un environnement controle pour tester et valider les politiques AWS, les controles et les services avant de les deployer en production. Elle permet aux organisations de verifier que les nouvelles politiques, les guardrails et les configurations fonctionnent comme prevu sans impacter les comptes operationnels. Cette approche aide a prevenir les consequences inattendues et garantit l'efficacite des politiques. L'OU de staging contient generalement des comptes de test qui reproduisent la structure de l'environnement de production, permettant une validation approfondie des changements de politiques avant de les appliquer aux OU ou comptes de production. Cette pratique s'aligne avec les bonnes pratiques AWS pour la gouvernance et aide a maintenir la stabilite operationnelle lors de l'implementation de nouveaux controles.
