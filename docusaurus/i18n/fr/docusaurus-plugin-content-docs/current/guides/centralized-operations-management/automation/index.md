---
sidebar_position: 7
---

# Automatisation

Avec Automation, une fonctionnalité d'[AWS Systems Manager](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-automation.html), vous pouvez créer des [runbooks personnalisés](https://docs.aws.amazon.com/systems-manager/latest/userguide/automation-documents.html) avec un [concepteur visuel](https://docs.aws.amazon.com/systems-manager/latest/userguide/automation-visual-designer.html) low-code, ou choisir parmi plus de 370 runbooks prédéfinis fournis par AWS [à travers plusieurs comptes et régions AWS](https://docs.aws.amazon.com/systems-manager/latest/userguide/running-automations-multiple-accounts-regions.html). Vous pouvez exécuter des scripts Python ou PowerShell dans le cadre d'un runbook en combinaison avec d'autres [actions Systems Manager Automation](https://docs.aws.amazon.com/systems-manager/latest/userguide/automation-actions.html) telles que les approbations, les appels API AWS ou l'exécution de commandes sur vos noeuds.

L'automatisation peut permettre aux entreprises d'améliorer les performances en réduisant les erreurs et en améliorant la résilience. L'automatisation peut améliorer à la fois la sécurité et les opérations de diverses manières, voici quelques exemples :

* **Gestion de la configuration** : Les outils d'automatisation peuvent appliquer des configurations standardisées à travers les serveurs, les postes de travail et les appareils réseau, réduisant la probabilité de mauvaises configurations pouvant mener à des vulnérabilités de sécurité.
* **Gestion des correctifs** : L'automatisation peut être utilisée pour déployer des correctifs de sécurité et des mises à jour à travers les systèmes, réduisant la fenêtre de vulnérabilité aux exploits connus.
* **Playbooks de réponse aux incidents** : L'automatisation peut exécuter des playbooks de réponse aux incidents prédéfinis pour guider les équipes de sécurité à travers les étapes nécessaires pour contenir, investiguer et remédier les incidents de sécurité. Les propriétaires d'applications peuvent créer des runbooks Automation pour répondre aux incidents de panne système. Par exemple, perte de connectivité réseau, problèmes logiciels sur l'hôte physique, perte d'alimentation système. En utilisant les [alarmes Amazon CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html) pour arrêter, terminer, redémarrer ou récupérer une instance EC2.
* **Gestion de la conformité** : L'automatisation peut aider à maintenir la conformité avec les réglementations de l'industrie et les politiques internes en automatisant les processus d'audit, en générant des rapports de conformité et en appliquant les contrôles de sécurité de manière cohérente.

En tirant parti de Systems Manager Automation, vous pouvez rationaliser ce processus critique, en assurant que vos serveurs d'applications restent à jour et conformes aux politiques de sécurité de votre organisation. Cela non seulement fait gagner du temps et réduit le potentiel d'erreurs manuelles, mais fournit également une approche cohérente et reproductible pour cette tâche récurrente.

![Automatisation](/img/cloudops/guides/centralized-operations-management/automation/BP-Automation-1.png "Automatisation")

## Gérer les permissions en utilisant un rôle de service

Comme meilleure pratique de sécurité, vous pouvez créer un rôle IAM (assumable par le service SSM) pour démarrer l'automatisation. Lorsque vous utilisez un rôle de service, l'automatisation est autorisée à s'exécuter contre les ressources AWS, mais l'utilisateur qui a lancé l'automatisation a un accès restreint (ou aucun accès) à ces ressources.

Sécurité et contrôle élevés - L'administration déléguée assure une sécurité et un contrôle élevés de vos ressources AWS. Si vous souhaitez modifier les permissions, effectuez ces changements au niveau du rôle de service au lieu de plusieurs comptes IAM.

Expérience d'audit améliorée - Permet une expérience d'audit améliorée car les actions sont effectuées contre vos ressources par un rôle de service central au lieu de plusieurs comptes IAM.

Les situations suivantes nécessitent de spécifier un rôle de service pour Automation : 1/ Lorsque vous souhaitez utiliser l'administration déléguée. 2/ Lorsque vous créez une association Systems Manager State Manager qui exécute un runbook. 3/ Lorsque vous avez des opérations que vous prévoyez de durer plus de 12 heures. 4/ Lorsque vous exécutez un runbook non détenu par Amazon qui utilise l'action aws:executeScript pour appeler une opération API AWS ou agir sur une ressource AWS.

![Gérer les permissions](/img/cloudops/guides/centralized-operations-management/automation/BP-Automation-2.png "Gérer les permissions")

Après avoir créé votre rôle de service, nous recommandons de modifier la politique de confiance pour s'assurer que seul Systems Manager Automation dans ce compte est autorisé à assumer le rôle. Pour la politique du rôle, attachez uniquement les permissions requises pour exécuter les actions d'automatisation définies dans le runbook. L'entité IAM qui démarre l'automatisation est autorisée à démarrer les runbooks d'automatisation requis. L'entité est autorisée à passer le rôle de service d'automatisation à Systems Manager. Cette entité n'a pas de permissions pour interagir directement avec les ressources AWS. Ces permissions sont déléguées au rôle de service.

* Politique de confiance du rôle de service
  * Assumable par Systems Manager
* Politique du rôle de service - Politique d'accès minimal
  * Accorder uniquement les permissions requises pour exécuter les actions d'automatisation
* Politique utilisateur/groupe/rôle IAM
  * Autoriser à passer le rôle de service à l'automatisation
  * Autoriser les permissions pour démarrer/arrêter/décrire les exécutions d'Automation
  * Aucune permission requise pour gérer les ressources en dehors d'Automation

## Créer des runbooks Automation

Il existe plusieurs façons de créer vos propres runbooks d'automatisation. Pour créer le document de manière programmatique, vous pouvez utiliser l'API CreateDocument, ou utiliser la bibliothèque CDK SSM Documents. Vous pouvez également créer le document en utilisant CloudFormation.

AWS Systems Manager Automation fournit une expérience de conception visuelle low-code qui vous aide à créer des runbooks d'automatisation. L'expérience de conception visuelle fournit une interface glisser-déposer avec la possibilité d'ajouter votre propre code afin de pouvoir créer et modifier des runbooks plus facilement.

Lors de la création d'un runbook, l'expérience de conception visuelle valide votre travail et génère automatiquement du code. Vous pouvez examiner le code généré ou l'exporter pour un développement local. Lorsque vous avez terminé, vous pouvez sauvegarder votre runbook, l'exécuter et examiner les résultats dans la console Systems Manager Automation.

Dans l'expérience de conception visuelle, Automation s'intègre avec Amazon CodeGuru Security pour vous aider à détecter les violations de politique de sécurité et les vulnérabilités dans vos scripts Python.

Options disponibles :

* Tirer parti des API AWS ou créer des documents en utilisant CloudFormation
* [Expérience de conception visuelle pour les runbooks Automation](https://docs.aws.amazon.com/systems-manager/latest/userguide/automation-visual-designer.html)
* [Visual Studio Code Toolkit](https://docs.aws.amazon.com/toolkit-for-vscode/latest/userguide/systems-manager-automation-docs.html)
* [CDK pour Systems Manager Documents](https://github.com/cdklabs/cdk-ssm-documents)

Systems Manager permet aux runbooks d'être partagés entre les comptes AWS. Cela permet une collaboration efficace et favorise l'adoption des meilleures pratiques. Par exemple, un compte central peut définir les meilleures pratiques de sécurité comme des runbooks d'automatisation et les partager avec d'autres comptes au sein de l'organisation. Cela assure une implémentation cohérente des mesures de sécurité dans l'ensemble de l'environnement AWS.

Par défaut, SSM ne supporte pas le partage de runbooks en utilisant une unité organisationnelle (OU) AWS Organizations. Il existe une solution disponible pour contourner cette limitation.

![Runbooks Automation](/img/cloudops/guides/centralized-operations-management/automation/BP-Automation-3.png "Runbooks Automation")

La solution utilise plusieurs ressources AWS, incluant une règle EventBridge, des fonctions Lambda, une machine à états Step Function et un topic SNS. Une fois déployée, la solution déclenchera un flux de travail chaque fois qu'un nouveau compte est ajouté à une AWS Organization via l'appel API CreateAccount ou InviteAccountToOrganization. Le flux de travail ajoutera les permissions de partage de document SSM pour l'ID de compte nouvellement ajouté dans un compte enfant AWS Organizations désigné et toutes les régions spécifiées. En savoir plus sur [Automatiser les permissions de partage de documents SSM dans AWS Organizations](https://github.com/aws-samples/aws-management-and-governance-samples/tree/master/AWSSystemsManager/AWS-Org-SSM-Permissions).

## Exécuter Automation

* **Automatisation simple** - Région et compte actuels
* **Automatisation manuelle** - Exécution interactive étape par étape. Chaque étape exécutée manuellement. Utile à des fins de dépannage.
* **Automatisation multi-comptes multi-régions** - Exécuter l'automatisation à travers plusieurs régions AWS et comptes AWS ou unités organisationnelles (OUs) AWS Organizations depuis un compte central.
* **Exécution à grande échelle** - Ciblage en utilisant les tags, les groupes de ressources ou les valeurs de paramètres
* **Contrôle du taux** - Concurrence et seuil d'erreur. Contrôle le rayon d'explosion. La valeur de concurrence détermine combien de ressources sont autorisées à exécuter l'automatisation simultanément.
* **Concurrence adaptative** - Jusqu'à 500 automatisations simultanées. Activez-la dans les préférences d'Automation.
* **Intégration avec les alarmes CloudWatch** - Attachez une alarme CloudWatch pour surveiller l'automatisation. Si l'alarme s'active, l'automatisation est arrêtée.
* **Sécurité** - Contrôle d'accès IAM.
  * En utilisant les politiques IAM, les administrateurs peuvent contrôler quels utilisateurs ou groupes individuels dans votre organisation peuvent utiliser Automation et à quels runbooks ils peuvent accéder.
  * Automation permet la délégation d'accès en utilisant un rôle de service IAM. Lorsque vous utilisez un rôle de service, l'automatisation est autorisée à s'exécuter contre les ressources AWS, mais l'utilisateur qui a lancé l'automatisation a un accès restreint (ou aucun accès) à ces ressources.

## Exécuter Automation dans plusieurs comptes et régions

![Exécuter Automation](/img/cloudops/guides/centralized-operations-management/automation/BP-Automation-4.png "Exécuter Automation")

L'exécution d'automatisations à travers plusieurs régions et comptes ou OUs fonctionne comme suit :

1. Vérifiez que toutes les ressources sur lesquelles vous souhaitez exécuter l'automatisation, dans toutes les régions et comptes ou OUs, utilisent des tags identiques. Si ce n'est pas le cas, vous pouvez les ajouter à un groupe de ressources AWS et cibler ce groupe. Pour plus d'informations, consultez [Que sont les groupes de ressources ?](https://docs.aws.amazon.com/ARG/latest/userguide/) dans le *Guide de l'utilisateur AWS Resource Groups and Tags*.
1. Connectez-vous au compte que vous souhaitez configurer comme compte central d'Automation.
1. Utilisez la procédure [Configuration des permissions du compte de gestion pour l'automatisation multi-régions et multi-comptes](https://docs.aws.amazon.com/systems-manager/latest/userguide/running-automations-multiple-accounts-regions.html) dans ce sujet pour créer les rôles IAM suivants :
1. **AWS-SystemsManager-AutomationAdministrationRole** - Ce rôle donne à l'utilisateur la permission d'exécuter des automatisations dans plusieurs comptes et OUs.
1. **AWS-SystemsManager-AutomationExecutionRole** - Ce rôle donne à l'utilisateur la permission d'exécuter des automatisations dans les comptes ciblés.
1. Choisissez le runbook, les régions et les comptes ou OUs où vous souhaitez exécuter l'automatisation.

**Considérations pour l'automatisation multi-comptes/régions :**

* Lors du ciblage de groupes de ressources, le groupe de ressources doit exister dans chaque compte et région cible
  * Le nom du groupe de ressources doit être exactement le même dans chaque compte et région cible
* Les automatisations ne s'exécutent pas de manière récursive à travers les OUs
  * Automation ne peut cibler que les OUs qui contiennent des comptes
* Il est recommandé aux clients de créer les rôles IAM requis pour le multi-comptes/régions en utilisant CloudFormation ou IaC
