---
sidebar_position: 3
---
# Personnalisation de votre zone d'atterrissage


Control Tower définit un point de départ pour une zone d'atterrissage bien gouvernée, mais la plupart des clients ont besoin d'implémenter des services de plateforme supplémentaires pour leurs charges de travail. Cela peut inclure la mise en réseau centralisée, les services de sécurité, les services d'observabilité centralisés, etc.

## Utiliser l'infrastructure en tant que code

Les services de plateforme supplémentaires doivent être définis et déployés en utilisant l'infrastructure en tant que code (IaC), ce qui :

* Garantit des configurations identiques à travers tous les comptes et régions
* Active le contrôle de version et la gestion des changements, prenant en charge la revue par les pairs et le retour arrière, tout en assurant que tous les changements sont enregistrés et auditables
* Prend en charge le provisionnement rapide et automatisé des comptes où le déploiement peut être déclenché en réponse aux événements de cycle de vie Control Tower

## Choisir la bonne option de personnalisation

Choisir la bonne approche de personnalisation dès le début est crucial car cela aura un impact significatif sur votre modèle opérationnel et votre flexibilité à l'avenir. Le choix dépend de facteurs tels que les préférences d'infrastructure en tant que code de votre organisation, les exigences opérationnelles et le niveau souhaité de flexibilité de personnalisation. Nous recommandons d'implémenter une seule option de personnalisation pour votre zone d'atterrissage.

Il existe quatre options principales pour personnaliser Control Tower avec du code :

* AWS Organizations StackSets
* Account Factory Customization (AFC)
* Customization for AWS Control Tower (CfCT)
* Account Factory for Terraform (AFT)
* Landing Zone Accelerator (LZA)

### CloudFormation StackSets

Il est possible de définir des ressources d'infrastructure dans CloudFormation et de les déployer sur des comptes spécifiques en utilisant la fonctionnalité native [CloudFormation StackSets](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/what-is-cfnstacksets.html). Un StackSet vous permet de créer des stacks à travers les régions en utilisant un seul modèle. CloudFormation peut [déployer automatiquement des stacks supplémentaires vers les nouveaux comptes AWS Organizations](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-orgs-manage-auto-deployment.html) lorsqu'ils sont ajoutés à votre organisation ou unités organisationnelles (OU) cibles, avec [certaines limitations](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-orgs-manage-auto-deployment.html#stacksets-orgs-auto-deployment-considerations).

Les StackSets peuvent être utiles pour déployer des modèles simples avec des dépendances minimales (et sont utilisés par Control Tower lui-même pour déployer des éléments comme les rôles IAM de base) mais l'absence de CI/CD et le manque d'intégration ou de connaissance du processus de provisionnement des comptes de Control Tower est un défi pour des personnalisations plus complexes.

Si vous recherchez un service géré pour déployer des personnalisations simples dans CloudFormation, envisagez AFC. Si vous recherchez une solution basée sur CloudFormation qui prend en charge le CI/CD, envisagez CfCT.


### Account Factory Customization (AFC)

[AFC](https://docs.aws.amazon.com/controltower/latest/userguide/af-customization-page.html) est une fonctionnalité native de Control Tower qui s'intègre directement au workflow de provisionnement des comptes d'AWS Control Tower. Elle vous permet de définir des blueprints (dans CloudFormation ou Terraform, selon ce que vous utilisez pour le provisionnement des comptes) qui sont utilisés pour établir une base de référence d'un compte avec des ressources et des configurations lors de son provisionnement.

Les blueprints peuvent être mis à jour et versionnés dans Service Catalog. Le processus de mise à jour des comptes Control Tower peut être utilisé pour appliquer la base de référence mise à jour. Bien que vous puissiez définir plusieurs blueprints dans AFC, il n'est pas encore possible d'établir la base de référence d'un compte avec plus d'un seul blueprint. Cela rend difficile l'utilisation d'AFC pour des personnalisations plus complexes.

Utilisez AFC si vous avez besoin d'une personnalisation simple, qu'une seule base de référence par compte est suffisante et que vous ne voulez pas gérer de ressources pour votre processus de personnalisation.


### Customizations for AWS Control Tower (CfCT)

[CfCT](https://docs.aws.amazon.com/controltower/latest/userguide/cfct-overview.html) est une solution AWS qui implémente un pipeline AWS Code Pipeline dans le compte de gestion Control Tower, dans la région d'origine de Control Tower. Celui-ci est soutenu par un dépôt de modèles CloudFormation dans S3 ou GitHub. Il prend en charge le déploiement de modèles CloudFormation, de SCP et de RCP vers les comptes et OU cibles de votre organisation. CfCT ne prend pas en charge l'automatisation de la création de comptes. Au lieu de cela, il est intégré aux événements de cycle de vie de Control Tower afin que la personnalisation puisse être automatiquement déclenchée pour les nouveaux comptes créés via l'Account Factory de Control Tower.

Utilisez CfCT si vous avez des compétences CloudFormation en interne et êtes prêt à maintenir et [mettre à jour](https://docs.aws.amazon.com/controltower/latest/userguide/update-stack.html) la solution dans votre compte de gestion.



### Account Factory for Terraform (AFT)

[AFT](https://docs.aws.amazon.com/controltower/latest/userguide/taf-account-provisioning.html) utilise Terraform, et donc des appels API AWS directs, pour gérer l'ensemble du processus de création et de personnalisation des comptes. C'est une solution extrêmement flexible pour la personnalisation mais cela se fait au prix d'une surcharge de gestion accrue. Contrairement à CfCT, AFT peut automatiser l'ensemble du processus, de la création de compte à la personnalisation de compte. Il est également conçu pour gérer les fichiers d'état Terraform des personnalisations de comptes.

Notez également que les contrôles proactifs de Control Tower (implémentés comme des règles CloudFormation Guard) ne s'appliqueront pas car les ressources ne sont pas déployées via CloudFormation.

Utilisez AFT si vous avez des compétences Terraform en interne et êtes expérimenté dans la mise en place et la maintenance de l'état et des processus Terraform, gérez plusieurs dépôts et coordonnez entre différentes équipes qui pourraient créer et personnaliser des comptes.


### Landing Zone Accelerator (LZA)

[LZA](https://aws.amazon.com/solutions/implementations/landing-zone-accelerator-on-aws/) est une solution AWS pour implémenter un environnement multi-comptes sécurisé basé sur les bonnes pratiques AWS et les frameworks de sécurité. Bien que LZA ne nécessite pas AWS Control Tower, [il est recommandé](https://docs.aws.amazon.com/controltower/latest/userguide/about-lza.html) d'utiliser Control Tower comme votre zone d'atterrissage fondamentale et d'implémenter LZA par-dessus. LZA fournit des déploiements opiniâtres de fonctions courantes de zone d'atterrissage, y compris les outils de sécurité et les services de réseau partagés, avec une personnalisation limitée disponible via des fichiers de configuration. Cela permet aux clients AWS ayant des exigences strictes de sécurité et de conformité de configurer rapidement leurs fondations cloud.

Utilisez LZA si vous êtes dans un domaine fortement réglementé ; avez besoin d'une zone d'atterrissage sécurisée et conforme déployée rapidement ; êtes à l'aise avec une approche plus opiniâtre du déploiement d'infrastructure ; êtes prêt à maintenir la solution ; et êtes préparé à comprendre et gérer le code CDK sous-jacent si des problèmes surviennent.


| Fonctionnalité | Account Factory Customization (AFC) | Customizations for AWS Control Tower (CfCT) | Account Factory for Terraform (AFT) | Landing Zone Accelerator (LZA) |
| ------- | ------------------------------------ | -------------------------------------------- | ------------------------------------ | ------------------------------- |
| Géré par le service | Oui | Non | Non | Non |
| Moteur IaC | CloudFormation, Terraform | CloudFormation | Terraform | CDK |
| Déploie des SCP | Non | Oui | Oui | Oui |
| Prend en charge plusieurs packages de configuration | Non | Oui | Oui | Oui |
| Courbe d'apprentissage | Faible | Moyenne | Élevée | Faible |
| Surcharge opérationnelle | Faible | Moyenne | Élevée | Moyenne |
| Support API | Non | Oui | Oui | Oui |
| Intégration du contrôle de version | Non | Oui | Oui | Oui |
| Administration déléguée | Non | Non | Oui | Oui |
| Provisionnement de comptes | Direct | Via événements de cycle de vie uniquement | Direct | Direct |
| Gestion par console | Oui | Limitée | Limitée | Limitée |
| Complexité de déploiement | Faible | Moyenne | Élevée | Moyenne |
| Flexibilité de personnalisation | Limitée | Élevée | Maximale | Élevée |
| Contrôles proactifs applicables | Oui | Oui | Non | Oui |
