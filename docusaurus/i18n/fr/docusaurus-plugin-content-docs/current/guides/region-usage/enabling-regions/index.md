---
sidebar_position: 1
---
# Comment activer une nouvelle région AWS

Avant de passer aux étapes techniques, il est crucial de comprendre que les régions AWS se divisent en deux catégories : les régions par défaut et les régions opt-in. Les [régions AWS disponibles](https://docs.aws.amazon.com/global-infrastructure/latest/regions/aws-regions.html), comme US East (N. Virginia), Europe (Ireland) ou Asia Pacific (Sydney) (introduites avant le 20 mars 2019), sont activées par défaut pour tous les comptes AWS. Cependant, d'autres telles qu'Asia Pacific (New Zealand) ou Mexico (Central), comme plusieurs autres régions AWS plus récentes (introduites après le 20 mars 2019), sont des [régions opt-in](https://docs.aws.amazon.com/global-infrastructure/latest/regions/aws-regions.html). Cela signifie que vous devrez l'activer explicitement pour votre ou vos comptes AWS avant de pouvoir commencer à déployer des ressources. Cette exigence d'opt-in fait partie de la stratégie d'AWS pour aider les clients à maintenir un meilleur contrôle sur leur expansion géographique et à se conformer aux exigences spécifiques de souveraineté des données.

Explorons maintenant comment activer ces régions opt-in...

## Considérations de bonnes pratiques

Bien que l'activation de la région soit simple, profitez de cette occasion pour planifier votre stratégie régionale. Réfléchissez aux charges de travail que vous déploierez en premier et à la manière dont vous organiserez vos ressources entre les régions si vous utilisez plusieurs régions AWS. N'oubliez pas, ce n'est que la première étape de votre parcours AWS. Une fois la région activée, vous pouvez procéder à la configuration de votre réseau, de votre sécurité et d'autres services fondamentaux.

Pour vous aider à réussir, nous recommandons de considérer les points suivants avant d'activer une nouvelle région dans votre organisation :

* Quelles unités organisationnelles (OUs) ont besoin d'accéder à la nouvelle région
* L'impact sur les SCPs et les limites de permissions existantes
* Les modifications nécessaires à votre stratégie de balisage et d'allocation des coûts
* Les modifications requises pour les politiques de conformité et de sécurité

Avant d'ajouter la région si vous utilisez un environnement Control Tower, examinez :

* Les configurations de contrôles actuelles qui pourraient nécessiter une réplication
* Les événements de cycle de vie existants qui pourraient être impactés
* Les contrôles personnalisés et l'automatisation qui doivent être étendus
* Les configurations de partage de ressources qui doivent s'appliquer à la nouvelle région
* Les configurations réseau qui doivent être répliquées


## Comment activer une nouvelle région dans un seul compte AWS

Pour les organisations qui débutent leur parcours AWS, l'activation d'une nouvelle région dans un seul compte AWS est un processus simple. Voici comment commencer :

1. Tout d'abord, connectez-vous à votre Console de gestion AWS avec un compte utilisateur disposant de privilèges administratifs. Une fois connecté, cherchez le nom de votre compte dans la barre de navigation en haut à droite et cliquez dessus pour révéler un menu déroulant. Sélectionnez « Paramètres du compte » dans ce menu.
2. Dans la page Paramètres du compte, faites défiler vers le bas jusqu'à trouver la section « Régions ». C'est ici qu'AWS liste toutes les régions opt-in disponibles pour votre compte. Cherchez la région à laquelle vous souhaitez adhérer dans la liste des régions. À côté, vous trouverez un bouton ou un interrupteur d'activation.
3. Cliquez pour activer la région et attendez que le processus se termine. Cela ne prend généralement que quelques minutes, mais il est important de laisser le processus se terminer avant de tenter de déployer des ressources dans la nouvelle région.


## Activer de nouvelles régions AWS en utilisant AWS Organizations

Pour les organisations opérant déjà dans un environnement AWS multi-comptes, l'expansion vers une nouvelle région nécessite une approche réfléchie et systématique. La plupart des clients AWS établis ont déjà construit des structures de comptes sophistiquées, utilisant AWS Organizations pour la gouvernance, la consolidation de la facturation et les Service Control Policies (SCPs). Explorons comment ces clients peuvent efficacement activer de nouvelles régions dans l'ensemble de leur patrimoine AWS.

L'implémentation technique commence par votre compte de gestion Organizations (anciennement connu sous le nom de compte maître). En tant que client AWS expérimenté, vous connaissez ce compte critique qui sert de racine à votre structure organisationnelle.

Commencez par activer la région dans votre compte de gestion :

1. Connectez-vous à votre compte de gestion Organizations
2. Naviguez vers le service AWS Organizations
3. Sélectionnez le compte de gestion dans la liste des comptes AWS
4. Accédez à l'onglet Paramètres du compte
5. Localisez la région requise dans la liste des régions
6. Activez la région et attendez la fin du processus

Pour chaque compte membre de l'Organisation, vous devrez systématiquement activer la région en fonction de votre stratégie organisationnelle. Envisagez d'utiliser AWS CloudFormation StackSets ou des scripts AWS CLI pour automatiser ce processus sur plusieurs comptes, surtout si vous gérez des dizaines ou des centaines de comptes.

## Ajouter de nouvelles régions à votre environnement Control Tower

Pour les entreprises utilisant AWS Control Tower pour gérer leur environnement multi-comptes, l'activation de nouvelles régions nécessite une prise en compte de votre structure de gouvernance existante. Votre organisation a probablement investi des efforts significatifs dans l'établissement de garde-fous, de contrôles de conformité et de processus de provisionnement automatisé de comptes. La mise à jour de la zone d'atterrissage est particulièrement cruciale car elle garantit que tous les contrôles de gouvernance de Control Tower s'étendent à la nouvelle région. Cela inclut :

* L'implémentation des garde-fous
* La surveillance de la conformité
* Les contrôles de sécurité
* Les configurations de partage de ressources

Explorons comment étendre ces contrôles à la nouvelle région, en commençant par votre compte de gestion Organizations :

1. D'abord, activez la région au niveau Organizations :
    1. Naviguez vers AWS Organizations
    2. Sélectionnez votre compte de gestion
    3. Accédez aux paramètres du compte
    4. Activez la région opt-in
    5. Attendez la fin du processus
2. Puis étendez Control Tower à la nouvelle région :
    1. Accédez à la console Control Tower
    2. Allez dans les paramètres de la zone d'atterrissage
    3. Sélectionnez « Modifier les paramètres »
    4. Progressez jusqu'à « Mettre à jour les paramètres de région »
    5. Sélectionnez la ou les régions requises
    6. Complétez le flux de mise à jour de la zone d'atterrissage


Après que Control Tower ait terminé la mise à jour, vous devrez :

* Ré-enregistrer les OUs existantes pour appliquer les paramètres mis à jour de la zone d'atterrissage ou
* Mettre à jour les comptes existants via Account Factory
* Vérifier que les garde-fous sont correctement implémentés dans la nouvelle région
* Confirmer que les alarmes CloudWatch et les règles AWS Config fonctionnent
* Examiner et mettre à jour les SCPs (Service Control Policies) gérées par le client pertinentes

N'oubliez pas, l'activation réussie d'une région dans Control Tower nécessite de la patience — laissez le temps à tous les processus automatisés de se terminer et vérifiez chaque étape avant de procéder au déploiement des charges de travail. Prenez le temps d'évaluer l'impact sur les structures de gouvernance existantes et assurez-vous que tous les contrôles nécessaires sont en place avant de déployer les charges de travail.

## Ce qui se passe après l'activation de votre nouvelle région AWS

L'activation réussie de la nouvelle région n'est que le début de votre parcours d'expansion régionale. À mesure que la région devient visible dans le sélecteur de régions de votre Console de gestion AWS, il est temps de réfléchir stratégiquement à la manière d'exploiter cette nouvelle infrastructure tout en maintenant les standards de gouvernance et de sécurité de votre organisation. Certains services, comme la journalisation CloudTrail ou les rapports de coûts et d'utilisation, intègreront automatiquement la nouvelle région.

Votre priorité immédiate devrait être d'étendre votre infrastructure AWS existante et vos cadres de gouvernance à la nouvelle région. Nous couvrons ce sujet dans notre guide Étendre votre zone d'atterrissage AWS à une nouvelle région.

N'oubliez pas que bien que les étapes techniques pour activer une région puissent être simples, la véritable valeur provient d'une planification soigneuse, d'une implémentation systématique et d'une validation approfondie. Vos investissements existants dans l'automatisation, la gouvernance et la sécurité devraient s'étendre de manière transparente à votre nouvelle région, créant un environnement cohérent, sécurisé et conforme dans l'ensemble de votre empreinte AWS. Consultez nos orientations supplémentaires sur l'extension de vos fondations et de la gouvernance dans la section suivante.
