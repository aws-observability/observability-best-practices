---
sidebar_position: 2
---
# Exploitation de votre zone d'atterrissage

## Envisager la création d'une zone d'atterrissage de test

Les contrôles peuvent (et doivent) être testés sur des OU hors production avant d'être appliqués aux comptes de production, mais il existe également des cas où une seconde organisation de test peut être utile. Si vous devez tester des mises à jour de zone d'atterrissage, modifier des automatisations de gestion de zone d'atterrissage ou des processus de personnalisation de comptes, il peut être utile d'avoir une organisation entièrement séparée pour éviter tout impact involontaire sur les charges de travail de production.

## Maintenir votre zone d'atterrissage à jour

Les mises à jour de zone d'atterrissage peuvent inclure des améliorations de sécurité, des optimisations de coûts et des améliorations fonctionnelles. Lorsqu'une nouvelle version de zone d'atterrissage devient disponible, vous devriez la [mettre à jour](https://docs.aws.amazon.com/controltower/latest/userguide/update-controltower.html) dès que possible. Vous pouvez le faire depuis la console AWS. Ce processus mettra à jour les composants de la zone d'atterrissage, y compris les comptes partagés (log archive, audit, backup).

Si vous mettez à jour de la version 2.x vers 3.x, notez que cela implique des [considérations supplémentaires](https://docs.aws.amazon.com/controltower/latest/userguide/lz-update-best-practices.html) concernant le passage des trails CloudTrail au niveau du compte vers ceux au niveau de l'organisation.

## Créer des comptes via Control Tower

Créez de nouveaux comptes via l'Account Factory de Control Tower pour qu'ils soient inscrits et gérés dès leur création. Bien qu'il soit possible de créer des comptes via AWS Organizations lorsque Control Tower est activé, ils ne seront pas inscrits à Control Tower, même s'ils se trouvent sous une OU gérée par Control Tower. Si vous avez des comptes dans votre organisation qui n'ont pas été créés via Control Tower, vous pouvez les inscrire pour appliquer les contrôles et les références de base de Control Tower.

### Lors de l'utilisation d'identités fédérées avec un Identity Center géré par Control Tower, utilisez un utilisateur SSO commun lors de la création de comptes

Si Identity Center est géré par Control Tower, l'Account Factory nécessite un utilisateur Identity Center comme paramètre. Cet utilisateur se verra accorder un accès administrateur au compte créé mais ne sera pas utilisable tant que la fédération d'identité est activée. Cet utilisateur ne sera pas utilisable avec des identités fédérées mais reste un paramètre obligatoire. L'utilisateur n'a pas besoin d'être unique, donc pour éviter de créer de nombreux utilisateurs Identity Center locaux inutilisés, vous pouvez utiliser le même pour plusieurs comptes. Si la fédération d'identité est par la suite désactivée, l'accès à l'adresse e-mail associée à l'utilisateur serait nécessaire pour activer un mot de passe et accéder à vos comptes.

## Maintenir vos comptes à jour

Une fois la mise à jour de la zone d'atterrissage terminée, vous devrez mettre à jour vos comptes. Vous pouvez le faire dans la console pour les comptes individuels ou en réinscrivant des OU entières (tant qu'elles ont moins de 1000 comptes). Il est également possible d'[automatiser le processus](https://docs.aws.amazon.com/controltower/latest/userguide/update-accounts-by-script.html).

C'est une bonne pratique de garder les charges de travail hors production dans une OU différente des charges de travail de production, vous permettant de tester l'impact de toute mise à jour en réinscrivant d'abord les OU hors production.


## Gérer la dérive

La dérive survient lorsque les composants de votre zone d'atterrissage AWS Control Tower, les comptes ou les unités organisationnelles (OU) ne sont plus synchronisés avec les références de base et les contrôles définis. Comprendre et gérer la dérive est essentiel pour maintenir la gouvernance et la conformité dans votre environnement AWS.

### Effectuer les modifications des comptes et OU via Control Tower pour éviter la dérive

Si vous effectuez des modifications sur les comptes, les OU ou les politiques d'organisation gérées par Control Tower (SCP, RCP) en dehors de Control Tower (ce qui arrive généralement lorsque vous effectuez des modifications directement dans la console AWS Organizations), vous pouvez provoquer une dérive.

### Vérifier régulièrement la dérive de votre zone d'atterrissage

Control Tower détecte automatiquement la dérive. Vérifiez régulièrement votre zone d'atterrissage pour détecter la dérive et remédiez si nécessaire. Vous pouvez voir le statut de dérive des OU et des comptes dans la console en naviguant vers la page Organisation, puis sélectionnez les OU ou les comptes que vous souhaitez inspecter. La dérive est également signalée dans les [notifications SNS](https://docs.aws.amazon.com/controltower/latest/userguide/sns-guidance.html) qui sont agrégées dans le compte audit. Vous pouvez vous abonner au topic aws-controltower-AggregateSecurityNotifications pour vous assurer de recevoir toutes les notifications de dérive. Comme ce topic reçoit également des notifications de non-conformité config et d'autres notifications, il peut être bruyant, vous pourriez donc vouloir abonner une Lambda pour traiter les notifications d'intérêt.


### Résoudre la dérive pour assurer la conformité

Si votre zone d'atterrissage est en dérive, vous ne pouvez pas déterminer avec précision si vos ressources sont conformes aux contrôles que vous avez activés. Réparez la dérive lorsque vous la détectez pour vous assurer que vos exigences de gouvernance sont satisfaites. Consultez la documentation pour quelques exemples de [dérive réparable](https://docs.aws.amazon.com/controltower/latest/userguide/drift.html#repairable-changes-to-resources).

* Si des comptes ou des OU sont en dérive, vous pourrez peut-être résoudre le problème en mettant à jour le compte ou en réinscrivant l'OU dans la console.
* Pour les contrôles, de nombreux types de dérive peuvent être résolus en appelant l'API ResetEnabledControl.
* De nombreux types de dérive peuvent être résolus automatiquement avec une réinitialisation de la zone d'atterrissage. Cela peut être fait via les paramètres de la zone d'atterrissage en cliquant sur le bouton Réinitialiser dans la section Versions.


## Ne pas supprimer les OU ou comptes requis par Control Tower

Comme mentionné dans la section précédente sur l'extension de votre zone d'atterrissage, supprimer ou déplacer l'OU Security ou les comptes gérés par Control Tower, ou supprimer toutes les autres OU pour ne laisser que l'OU Security, provoquera une dérive de la zone d'atterrissage. Dans cet état, Control Tower ne fonctionnera pas jusqu'à ce que vous ayez réinitialisé votre zone d'atterrissage.

## Ne pas supprimer les rôles requis

Si les [rôles requis par Control Tower](https://docs.aws.amazon.com/controltower/latest/userguide/roles-how.html) sont manquants ou inaccessibles, vous verrez une page d'erreur vous demandant de réinitialiser votre zone d'atterrissage.

## Activer les contrôles pour appliquer vos exigences de gouvernance

Suivez les [bonnes pratiques pour l'application des contrôles](https://aws.amazon.com/blogs/mt/best-practices-for-applying-controls-with-aws-control-tower/)

Identifiez les contrôles Control Tower adaptés à vos exigences dans le catalogue de contrôles AWS. Les contrôles peuvent être recherchés en fonction des métadonnées incluant l'implémentation, le comportement, le propriétaire, le service et le framework via :

* La console Control Tower
* La [documentation du catalogue Control Tower](https://docs.aws.amazon.com/controltower/latest/controlreference/controls-reference.html)
* [Amazon Q](https://docs.aws.amazon.com/controltower/latest/controlreference/q-search.html)


Si nécessaire, vous pouvez définir des contrôles personnalisés en utilisant les services sous-jacents, mais ceux-ci ne seront pas inclus dans les tableaux de bord Control Tower ni dans les métriques de conformité :

* [SCP](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html) et [RCP](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_rcps.html) d'AWS Organizations pour les contrôles préventifs
* [Règles Config](https://docs.aws.amazon.com/config/latest/developerguide/evaluate-config_develop-rules.html) AWS pour les contrôles détectifs
* [Hooks CloudFormation](https://docs.aws.amazon.com/cloudformation-cli/latest/hooks-userguide/what-is-cloudformation-hooks.html) AWS pour les contrôles proactifs
* [Contrôles CSPM Security Hub](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-controls-reference.html) AWS

Si vous déployez des politiques personnalisées (SCP ou RCP), assurez-vous que les [rôles de service Control Tower](https://docs.aws.amazon.com/controltower/latest/userguide/awscontroltowerexecution.html) ne sont pas refusés car cela peut provoquer des erreurs ou rendre Control Tower inopérant.


Testez toujours les contrôles avant de les déployer sur les comptes de production.

* Déployez d'abord sur des OU hors production et/ou sur une organisation de test
* Envisagez de déployer des contrôles détectifs équivalents pour identifier et résoudre la non-conformité avant de déployer un nouveau contrôle préventif

## Comprendre l'héritage des contrôles

Les contrôles sont un élément fondamental d'AWS Control Tower et comprendre leur fonctionnement est nécessaire pour une exploitation réussie de la zone d'atterrissage.

* Les contrôles obligatoires ne peuvent pas être désactivés et protègent spécifiquement les ressources Control Tower. Ils ne s'appliqueront pas aux charges de travail utilisateur.
* Les comptes inscrits à Control Tower héritent des contrôles de l'OU parente
    * Les contrôles préventifs basés sur les politiques AWS Organizations sont hérités dans les OU imbriquées, les autres ne le sont pas.
    * Les contrôles préventifs basés sur les politiques AWS Organizations s'appliquent aux comptes non inscrits dans les OU enregistrées à Control Tower, les autres ne s'appliquent pas.

## Mettre à jour les contrôles Config pour utiliser les règles liées au service

Depuis [juin 2025](https://aws.amazon.com/about-aws/whats-new/2025/06/aws-control-tower-service-linked-aws-config-managed-rules/), Control Tower prend en charge les règles Config gérées liées au service AWS. Auparavant, les règles étaient déployées via des StackSets. Les règles liées au service sont déployées directement dans les comptes par le service et ne peuvent pas être modifiées ou supprimées par les utilisateurs sauf via Control Tower. Cela améliore la vitesse de déploiement et prévient la dérive involontaire.


## Ne pas déplacer les comptes via AWS Organizations

Déplacer des comptes entre les OU directement via AWS Organizations, que ce soit dans la console ou via l'API, provoquera une dérive dans Control Tower.

Si vous devez déplacer des comptes entre les OU, faites-le en [mettant à jour le compte via la console Control Tower](https://docs.aws.amazon.com/controltower/latest/userguide/updating-account-factory-accounts.html#update-account-in-console) ou en [mettant à jour le produit provisionné du compte dans Service Catalog](https://docs.aws.amazon.com/controltower/latest/userguide/updating-account-factory-accounts.html#update-provisioned-product). Si vous avez déplacé un compte dans Organizations, [mettre à jour le compte](https://docs.aws.amazon.com/controltower/latest/userguide/governance-drift.html#drift-account-moved) devrait résoudre la dérive.


## Vérifier l'état de conformité

Vérifiez régulièrement l'état de conformité de vos comptes et OU et prenez des mesures pour remédier à la non-conformité.

Le tableau de bord Control Tower vous montrera l'état de conformité de vos contrôles Control Tower appliqués. Actuellement, il ne montrera pas l'état de conformité des règles Config appliquées en dehors de Control Tower (y compris celles détenues par Security Hub).

Envisagez d'implémenter le [tableau de bord de conformité des ressources Config](https://catalog.workshops.aws/awscid/en-US/dashboards/additional/config-resource-compliance-dashboard) du projet Cloud Intelligence Dashboards pour obtenir une vue complète de la conformité Config à travers votre organisation.

Abonnez-vous aux [topics SNS dans le compte audit](https://docs.aws.amazon.com/controltower/latest/controlreference/receive-notifications.html) pour recevoir des notifications sur les changements de conformité.

## Revoir périodiquement les contrôles activés

Revoyez régulièrement les contrôles appliqués à vos comptes et OU pour vous assurer qu'ils continuent de répondre à vos besoins métier et que vous profitez des nouveaux contrôles.


## Agir sur la non-conformité

Vous devriez définir des [Documents Systems Manager](https://docs.aws.amazon.com/systems-manager/latest/userguide/documents.html) et les associer à vos règles Config activées afin qu'ils puissent être utilisés pour [remédier à la non-conformité](https://docs.aws.amazon.com/config/latest/developerguide/remediation.html). La remédiation peut être déclenchée [manuellement](https://docs.aws.amazon.com/config/latest/developerguide/setup-manualremediation.html) ou configurée pour [s'exécuter automatiquement](https://docs.aws.amazon.com/config/latest/developerguide/setup-autoremediation.html).



## Surveiller et optimiser les coûts de la zone d'atterrissage

### Assurez-vous d'avoir une visibilité sur les coûts de votre zone d'atterrissage.

* Utilisez [AWS Cost Explorer](https://docs.aws.amazon.com/cost-management/latest/userguide/ce-what-is.html) dans le compte de gestion pour une visibilité sur les dépenses AWS à l'échelle de l'organisation
* Configurez [AWS Cost Anomaly Detection](https://docs.aws.amazon.com/cost-management/latest/userguide/getting-started-ad.html) et abonnez-vous aux notifications.
* Envisagez d'implémenter les Cloud Intelligence Dashboards pour activer facilement les [exportations de données Cost & Usage Report](https://docs.aws.amazon.com/cur/latest/userguide/dataexports-create.html), l'intégration Athena et des tableaux de bord de coûts QuickSight détaillés

### Soyez conscient des causes courantes de pics de coûts

* Lorsque vous activez Control Tower avec l'intégration CloudTrail, assurez-vous de supprimer tout trail de gestion préexistant pour éviter les frais CloudTrail
* Control Tower utilise AWS Config pour suivre l'état des ressources. C'est important pour maintenir la conformité mais peut être coûteux à suivre pour les charges de travail éphémères qui changent fréquemment. Il n'y a actuellement pas d'option intégrée dans Control Tower pour modifier l'enregistreur Config dans les comptes membres, mais envisagez [cette solution de contournement](https://aws.amazon.com/blogs/mt/customize-aws-config-resource-tracking-in-aws-control-tower-environment/) pour désactiver l'enregistreur Config pour les comptes avec des coûts Config excessifs et des exigences de conformité moins strictes.
