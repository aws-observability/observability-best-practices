---
sidebar_position: 4
---
# Considerations supplementaires lors de l'activation de Control Tower dans une organisation AWS existante

## Comptes Control Tower

Control Tower doit etre active dans le compte de gestion de votre organisation AWS. Il n'est pas possible d'avoir plusieurs zones d'atterrissage dans une seule organisation AWS.

Lorsque vous activez initialement Control Tower, il n'inscrit pas automatiquement les comptes existants de votre organisation, mais il cree deux UO, les [comptes partages](https://docs.aws.amazon.com/controltower/latest/userguide/accounts.html#special-accounts) et les [ressources qu'ils contiennent](https://docs.aws.amazon.com/controltower/latest/userguide/shared-account-resources.html). Votre organisation doit disposer d'un quota suffisant pour permettre cela.

Si vous devez [utiliser des comptes existants](https://aws.amazon.com/blogs/mt/use-existing-logging-and-security-account-with-aws-control-tower/) pour les comptes d'archivage des journaux ou d'audit lors de la configuration de Control Tower, vous pouvez le faire, mais vous devrez [supprimer l'enregistreur de configuration](https://docs.aws.amazon.com/cli/latest/reference/configservice/delete-configuration-recorder.html) et le [canal de livraison de configuration](https://docs.aws.amazon.com/cli/latest/reference/configservice/delete-delivery-channel.html). Il est generalement plus simple de laisser Control Tower creer ces comptes et de copier les journaux historiques si necessaire, mais dans certains cas, par exemple lorsque vous avez des integrations de journaux existantes avec des services non-AWS, il peut etre necessaire de reutiliser des comptes existants.

## Identity Center

Nous recommandons fortement d'utiliser AWS Identity Center avec Control Tower pour fournir l'authentification a vos utilisateurs. Si vous choisissez de ne pas laisser Control Tower gerer Identity Center et que vous n'avez pas deja Identity Center active, Control Tower ne l'activera pas et vous devrez mettre en oeuvre une solution d'identite alternative pour votre organisation.

Si vous n'avez pas de configuration Identity Center existante et que vous optez pour la gestion d'Identity Center, Control Tower activera le service et pourra ou non provisionner des groupes et des ensembles de permissions, [selon votre choix de source d'identite](https://docs.aws.amazon.com/controltower/latest/userguide/getting-started-prereqs.html#sso-considerations).

Si vous avez deja Identity Center configure, il doit etre dans la meme region que la region d'origine de votre Control Tower. Si vous optez pour la gestion par Control Tower et que vous utilisez le repertoire local IAM Identity Center, Control Tower creera des utilisateurs, des groupes et des ensembles de permissions pour vous. Si vous utilisez un autre repertoire, [Control Tower n'effectuera aucune modification](https://docs.aws.amazon.com/controltower/latest/userguide/about-extending-governance.html#sso-and-existing-orgs).

Si vous avez une solution d'identite existante qui utilise des utilisateurs IAM ou la federation IAM, vous devriez adopter Identity Center. L'activation de Control Tower et d'Identity Center n'aura pas d'impact sur vos utilisateurs, roles et politiques IAM existants et n'affectera pas la configuration SAML IAM existante. Cela vous permettra d'executer les deux systemes en parallele pendant une periode de transition jusqu'a ce que vous soyez pret a supprimer vos anciens utilisateurs IAM / federation IAM.



## CloudTrail

Si vous avez l'intention d'activer la gestion de CloudTrail par Control Tower dans une organisation existante, vous devrez [desactiver l'acces de confiance](https://docs.aws.amazon.com/organizations/latest/userguide/services-that-can-integrate-cloudtrail.html#integrate-disable-ta-cloudtrail) pour CloudTrail afin de passer les [verifications pre-vol](https://docs.aws.amazon.com/controltower/latest/userguide/getting-started-prereqs.html) d'AWS Control Tower.


Si vous refusez la gestion de CloudTrail par Control Tower, vous serez responsable du deploiement des pistes, de la centralisation de la journalisation et de la mise en oeuvre de toute mesure de securite pour proteger vos pistes. Control Tower [creera une piste organisationnelle](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/creating-trail-organization.html) quoi qu'il arrive, mais lorsque vous refusez, son statut sera defini sur desactive. Nous recommandons de laisser Control Tower gerer CloudTrail pour vous.


Si vous avez une **organisation existante avec des pistes au niveau du compte** et que vous activez la gestion de CloudTrail dans Control Tower, il creera une nouvelle piste de gestion d'organisation, configuree pour journaliser dans un compartiment du compte d'archivage des journaux. Il ne touchera pas vos pistes existantes, donc si elles enregistrent, vous pouvez vous attendre a voir une augmentation significative des couts CloudTrail dans votre organisation, car seule la premiere copie des evenements de gestion dans chaque region pour un compte est gratuite. L'arret de l'enregistrement des pistes au niveau du compte empechera les couts supplementaires.

Si vous avez une **organisation existante avec une piste organisationnelle** et que vous optez pour la gestion par Control Tower, vous devrez [desactiver l'acces de confiance](https://docs.aws.amazon.com/organizations/latest/userguide/services-that-can-integrate-cloudtrail.html#integrate-disable-ta-cloudtrail). Lorsque vous faites cela, toutes les pistes organisationnelles de vos comptes deviendront non fonctionnelles de toute facon, vous devriez donc [arreter la journalisation](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-turning-off-logging.html) pour votre piste existante afin d'eviter d'etre facture pour l'enregistrement lorsqu'elle redevient active. Ensuite, desactivez l'acces de confiance et activez Control Tower. Cela entrainera une courte periode pendant laquelle vous n'aurez pas de donnees CloudTrail pour votre organisation, donc cela doit etre planifie pendant une periode de maintenance.


## Config

Il n'est pas possible de refuser la gestion de Config par Control Tower.

Si vous activez Control Tower dans une organisation existante, vous devrez vous assurer que [l'acces de confiance pour Config est desactive](https://docs.aws.amazon.com/organizations/latest/userguide/services-that-can-integrate-config.html#integrate-disable-ta-config) pour passer les [verifications pre-lancement](https://docs.aws.amazon.com/controltower/latest/userguide/getting-started-prereqs.html) de Control Tower. Control Tower activera l'acces de confiance pendant le processus d'activation.

Si vous prevoyez d'utiliser des comptes existants pour les comptes d'archivage des journaux et d'audit, vous devrez [supprimer toutes les ressources Config](https://docs.aws.amazon.com/controltower/latest/userguide/existing-config-resources.html) de ces comptes au prealable.




## Sauvegarde

L'[integration AWS Backup](https://docs.aws.amazon.com/controltower/latest/userguide/backup.html) de Control Tower peut vous aider a configurer une solution de sauvegarde de base avec un coffre dans chaque compte membre, un coffre central dans un compte partage et quelques politiques de sauvegarde de base. Cela peut etre active au niveau de l'UO et les ressources individuelles peuvent etre etiquetees pour les cibler selon le calendrier de sauvegarde correspondant.

Si vous avez deja une solution de sauvegarde, vous pouvez refuser l'integration Backup.

L'integration Control Tower ne deploie pas de coffre logiquement isole et ne fournit pas de configuration pour la sauvegarde inter-regions par defaut.


## Extension de la gouvernance aux UO et comptes existants

L'activation de Control Tower dans une organisation existante n'etend pas automatiquement la gouvernance aux UO et comptes existants de l'organisation. Vous devrez utiliser Control Tower pour [inscrire les comptes existants](https://docs.aws.amazon.com/controltower/latest/userguide/enroll-account.html) afin de les placer sous la gouvernance de Control Tower.
 
Il existe certains [prerequis](https://docs.aws.amazon.com/controltower/latest/userguide/enrollment-prerequisites.html) pour que les comptes puissent etre inscrits :

* Votre zone d'atterrissage ne doit pas etre dans un etat de derive
* Le compte doit etre membre de l'organisation
* Le role [AWSControlTowerExecution](https://docs.aws.amazon.com/controltower/latest/userguide/awscontroltowerexecution.html) doit etre present et disposer des permissions AdministratorAccess
* L'organisation doit avoir [l'acces de confiance StackSets active](https://docs.aws.amazon.com/organizations/latest/userguide/services-that-can-integrate-cloudformation.html) pour que le role AWSControlTowerExecution puisse [deployer les ressources Control Tower](https://docs.aws.amazon.com/controltower/latest/userguide/enroll-account.html#what-happens-during-account-enrollment) dans le compte que vous inscrivez.
* Les ressources AWS Config existantes doivent etre [supprimees](https://docs.aws.amazon.com/controltower/latest/userguide/enroll-account.html#example-config-cli-commands). Si cela n'est pas possible, il existe un [processus](https://docs.aws.amazon.com/controltower/latest/userguide/existing-config-resources.html) pour travailler avec le support client afin d'activer l'utilisation des ressources Config existantes. Notez que ce n'est pas une option pour les comptes d'archivage des journaux et d'audit existants, qui doivent avoir leurs ressources Config supprimees.

La maniere la plus efficace d'integrer des comptes AWS existants dans AWS Control Tower est d'[enregistrer une UO entiere](https://docs.aws.amazon.com/controltower/latest/userguide/importing-existing.html). Lorsque vous enregistrez une UO, ses comptes membres sont inscrits dans la zone d'atterrissage AWS Control Tower. Le role AWSControlTowerExecution est ajoute aux comptes pour vous. L'UO peut contenir jusqu'a 1000 comptes.



## Controles existants

Si vous inscrivez des comptes existants dans des UO avec des controles preventifs en place (SCP, RCP), assurez-vous que ceux-ci [n'empechent pas les actions de provisionnement ou d'inscription](https://docs.aws.amazon.com/controltower/latest/userguide/quick-account-provisioning.html#common-causes-for-enrollment-failure). Alternativement, si vous avez besoin de ces controles en place, inscrivez les comptes dans une UO d'inscription dediee puis deplacez-les vers leur destination finale.

AWS Organizations a certaines [limites de service](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_reference_limits.html) que vous devez veiller a ne pas depasser lors de l'extension de la gouvernance aux comptes et UO avec des controles preventifs existants :

* Taille maximale de politique pour les RCP et SCP : 5120 caracteres
* Imbrication maximale d'UO de 5 niveaux
* Maximum 5 RCP, 5 SCP directement attaches a une UO ou un compte


Pour les controles detectifs, si vous avez des regles Config existantes definies dans un compte, celles-ci resteront meme si vous supprimez l'enregistreur Config afin d'inscrire votre compte. Lorsque vous inscrivez le compte dans Control Tower et qu'il cree un nouvel enregistreur, les regles devraient reprendre l'evaluation.

L'etat de conformite des regles Config definies en dehors de Control Tower ne sera pas visible depuis le tableau de bord de Control Tower.

Si vous utilisez des regles Config personnalisees et que vous souhaitez obtenir une vue complete de la conformite a travers l'ensemble de votre organisation AWS, envisagez d'implementer le [tableau de bord de conformite des ressources Config](https://catalog.workshops.aws/awscid/en-US/dashboards/additional/config-resource-compliance-dashboard) du cadre [Cloud Intelligence Dashboards](https://catalog.workshops.aws/awscid/en-US).
