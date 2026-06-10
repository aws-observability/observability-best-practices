---
sidebar_position: 1
---
# Planification et implémentation de votre zone d'atterrissage

## Activer les régions adaptées à vos besoins métier

### Choisissez votre région la plus utilisée comme région d'origine

Bien que Control Tower puisse gouverner plusieurs régions, il doit être activé depuis une seule région d'origine. Identifiez la région où vous prévoyez d'exécuter la plupart de vos charges de travail et désignez-la comme votre région d'origine Control Tower. Si vous utilisez une instance existante d'AWS Identity Center, votre région d'origine doit être la même région dans laquelle AWS Identity Center est configuré.

La région d'origine de Control Tower héberge les éléments de configuration clés de votre zone d'atterrissage. L'organisation AWS y est créée, IAM Identity Center y est activé, ainsi que les buckets S3 pour le stockage des données CloudTrail. AWS Config dans le compte Audit est également configuré pour agréger les résultats dans la région d'origine.


### Refuser les régions inutilisées, gouverner toutes les régions autorisées

Control Tower offre la possibilité de refuser l'utilisation de la plupart des régions AWS et de n'activer que le sous-ensemble correspondant à vos besoins métier. Cela réduit votre surface d'attaque, diminue la probabilité que les charges de travail génèrent des coûts inutiles et simplifie vos exigences de gouvernance et d'observabilité.

Le [contrôle global de refus de région](https://docs.aws.amazon.com/controltower/latest/userguide/region-deny.html) peut être défini lorsque vous créez ou mettez à jour votre zone d'atterrissage. Cela fonctionne conjointement avec la liste des régions gouvernées par Control Tower, c'est-à-dire que si la région n'est pas activée pour la gouvernance, elle sera refusée. Pour restreindre davantage l'utilisation des régions pour une unité organisationnelle (OU) spécifique, vous pouvez également implémenter le [contrôle de refus de région OU](https://docs.aws.amazon.com/controltower/latest/controlreference/ou-region-deny.html). Ces deux contrôles sont implémentés à l'aide de [Service Control Policies (SCP)](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html). Si une région n'est pas refusée, les utilisateurs peuvent y déployer des ressources, sous réserve des permissions IAM. Assurez-vous qu'aucune ressource n'est utilisée dans une région avant de la refuser pour éviter tout impact sur vos charges de travail.

La région d'origine de Control Tower est gouvernée par défaut et ne peut pas être désgouvernée.

Les SCP de refus de région de Control Tower incluent des exceptions que Control Tower nécessite pour fonctionner.

## Utiliser AWS Identity Center pour simplifier le contrôle d'accès

C'est une bonne pratique AWS d'éviter l'utilisation d'utilisateurs IAM et d'exiger plutôt la [fédération d'identité](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html#bp-users-federation-idp) pour accorder l'accès humain aux ressources AWS. Cela atténue une grande partie du risque de compromission des identifiants car vous n'avez plus besoin d'utiliser des identifiants AWS à longue durée de vie. Pour une gestion centralisée des accès, nous recommandons d'utiliser [AWS IAM Identity Center](https://docs.aws.amazon.com/singlesignon/latest/userguide/getting-started.html) pour gérer l'accès à vos comptes et les permissions au sein de ces comptes.

Identity Center peut être activé dans une seule région et être disponible globalement pour les utilisateurs. Si Identity Center n'est pas activé pour votre organisation, Control Tower l'activera pour vous dans votre région d'origine Control Tower. Si Identity Center est déjà activé, il doit être activé dans votre région d'origine Control Tower sinon les [vérifications préalables](https://docs.aws.amazon.com/controltower/latest/userguide/getting-started-prereqs.html) échoueront.

AWS Identity Center prend en charge les ensembles de permissions, qui peuvent être assignés aux comptes de votre organisation AWS et servent de modèle pour la création de rôles IAM dans ces comptes. Lorsque vous associez un utilisateur ou un groupe Identity Center à un ensemble de permissions particulier dans un compte particulier, cela permet à cet utilisateur ou groupe d'assumer le rôle défini par l'ensemble de permissions dans ce compte. Si vous autorisez Control Tower à gérer Identity Center, il créera des [groupes et ensembles de permissions préconfigurés](https://docs.aws.amazon.com/controltower/latest/userguide/sso-groups.html) et les assignera aux comptes pour vous fournir une base d'accès utilisateur.


### Intégrer votre fournisseur d'identité d'entreprise

Identity Center peut être utilisé pour gérer les utilisateurs et les groupes, mais si vous avez un fournisseur d'identité d'entreprise existant, vous devriez le [connecter à Identity Center](https://docs.aws.amazon.com/singlesignon/latest/userguide/tutorials.html) pour maintenir une source unique de vérité pour vos identités.

Si vous utilisez des utilisateurs fédérés et que vous souhaitez utiliser la configuration par défaut des groupes et ensembles de permissions que Control Tower met en place dans Identity Center, vous pouvez créer des groupes avec les mêmes noms dans votre fournisseur en amont et les synchroniser avec Identity Center. Vous pouvez ensuite assigner des utilisateurs à ces groupes dans le fournisseur d'identité pour leur donner accès à vos comptes inscrits.

### Progresser vers l'accès à privilèges minimaux

Les ensembles de permissions par défaut créés par Control Tower sont conçus pour des cas d'utilisation courants comme **AdministratorAccess** et **DeveloperAccess**. Pour les charges de travail de production, en particulier celles impliquant des données sensibles ou d'autres situations où la sécurité et la conformité sont des préoccupations critiques, la bonne pratique exige de réduire les permissions au minimum d'accès nécessaire. Cela peut être réalisé en utilisant des ensembles de permissions personnalisés pour accorder spécifiquement les permissions requises et/ou en appliquant des politiques de contrôle de service pour refuser l'accès inutile. [AWS IAM Access Analyzer](https://docs.aws.amazon.com/IAM/latest/UserGuide/what-is-access-analyzer.html) peut aider à identifier les permissions nécessaires, supprimer les permissions inutilisées et rédiger des politiques à privilèges minimaux.


### Activer un compte administrateur délégué

Control Tower active Identity Center dans le compte de gestion de l'organisation. C'est une bonne pratique de minimiser le besoin pour quiconque d'avoir accès au compte de gestion car il contrôle le reste de votre organisation AWS et ne peut pas être contraint par des contrôles préventifs (SCP) dans la même mesure que les comptes membres. Pour cette raison, vous devriez [activer un compte administrateur délégué pour Identity Center](https://docs.aws.amazon.com/singlesignon/latest/userguide/delegated-admin.html).

Les ensembles de permissions déployés dans le compte de gestion ne peuvent pas être gérés depuis le compte administrateur délégué. Nous recommandons de créer des ensembles de permissions dédiés pour le compte de gestion (par exemple MA_Administrator) qui ne sont assumables que par un ensemble très restreint d'utilisateurs.

### Appliquer des contraintes supplémentaires sur les rôles gérés par Control Tower

Control Tower crée [divers rôles](https://docs.aws.amazon.com/controltower/latest/userguide/roles-how.html) dans les comptes membres qui peuvent être assumés par les services AWS.

Pour se protéger contre le problème du [confused deputy inter-services](https://docs.aws.amazon.com/IAM/latest/UserGuide/confused-deputy.html), vous pouvez définir une [Resource Control Policy (RCP)](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_rcps_examples.html) pour empêcher les identités extérieures à votre organisation AWS de tromper les services pour qu'ils assument des rôles en leur nom.

Vous pouvez également ajouter des conditions aux rôles Control Tower [pour restreindre davantage l'accès](https://docs.aws.amazon.com/controltower/latest/userguide/conditions-for-role-trust.html), mais sachez que toute modification de ces rôles peut être écrasée lors des mises à jour de la zone d'atterrissage.


## Protéger vos données avec AWS Backup

L'[intégration AWS Backup](https://docs.aws.amazon.com/controltower/latest/userguide/backup.html/) de Control Tower peut vous aider à mettre en place une solution de sauvegarde basée sur les bonnes pratiques avec un coffre-fort de sauvegarde dans chaque compte membre, un coffre-fort central dans un compte partagé et quelques politiques de sauvegarde standard (horaire, hebdomadaire, quotidienne, mensuelle). La sauvegarde peut être activée au niveau de l'OU et des ressources individuelles peuvent être étiquetées pour les cibler selon le calendrier de sauvegarde approprié.

Vous pouvez déployer des plans de sauvegarde supplémentaires dans les comptes selon vos besoins, en utilisant votre méthode de personnalisation Control Tower de choix ([AFC](https://docs.aws.amazon.com/controltower/latest/userguide/af-customization-page.html), [CfCT](https://docs.aws.amazon.com/controltower/latest/userguide/cfct-overview.html), [AFT](https://docs.aws.amazon.com/controltower/latest/userguide/aft-overview.html), [StackSets](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/what-is-cfnstacksets.html)). Ceux-ci peuvent réutiliser le rôle [aws-controltower-BackupRole](https://docs.aws.amazon.com/controltower/latest/userguide/backup-resources.html) ou vous pouvez créer de nouveaux rôles selon vos besoins.

Si vous avez une solution de sauvegarde existante, vous pouvez choisir de ne pas utiliser cette intégration.


## Étendre la structure de votre organisation AWS pour répondre aux besoins métier

### Suivre les bonnes pratiques multi-comptes d'AWS Organizations

En général, suivez les bonnes pratiques d'AWS Organizations relatives à la [stratégie multi-comptes](https://docs.aws.amazon.com/whitepapers/latest/organizing-your-aws-environment/organizing-your-aws-environment.html) et à la conception de vos unités organisationnelles (OU) lors de l'utilisation de Control Tower. Gardez les choses simples - commencez avec les OU dont vous avez besoin pour prendre en charge vos exigences différentielles de gouvernance, de sécurité et de politique, et évitez l'imbrication profonde - Control Tower prend en charge un maximum de cinq niveaux d'imbrication.


### Ne pas modifier ni supprimer l'OU Security de Control Tower

L'une des rares limitations que Control Tower impose à votre organisation est que vous ne pouvez pas créer de comptes ou d'OU supplémentaires sous l'OU Security et vous ne pouvez pas déplacer ou supprimer les comptes créés par Control Tower (log archive, audit) sans casser votre environnement Control Tower.


### Ne pas supprimer toutes les OU pour ne laisser que l'OU Security

Control Tower s'attend à avoir au moins deux OU, dont l'une doit être l'OU Security. Vous pouvez supprimer l'OU Sandbox créée lorsque vous activez Control Tower, mais uniquement si vous avez au moins une autre OU dans votre organisation.
