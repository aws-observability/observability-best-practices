---
sidebar_position: 5
---
# Gestion des correctifs

[Patch Manager](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-patch.html), une fonctionnalité de Systems Manager, vous permet d'automatiser le processus de mise à jour de vos noeuds gérés avec des mises à jour liées à la sécurité. Vous pouvez appliquer des correctifs aux instances Amazon EC2, aux appareils edge, aux serveurs sur site et aux machines virtuelles (VM), y compris les VM dans d'autres environnements cloud.

## Pourquoi la gestion des correctifs est-elle difficile ?

![Pourquoi la gestion des correctifs est-elle difficile ?](/img/cloudops/guides/centralized-operations-management/patch-management/what-makes-patching-hard.png "Pourquoi la gestion des correctifs est-elle difficile ?")

Créer une stratégie de gestion des correctifs peut être un défi pour les organisations. Pour commencer, la gestion des correctifs dépend d'un inventaire actuel et complet des logiciels pouvant être mis à jour, incluant les applications et les systèmes d'exploitation installés sur chaque noeud dans l'environnement de l'entreprise. Deuxièmement, la gestion des correctifs à l'échelle de l'entreprise peut surcharger certaines ressources en termes de personnel et d'infrastructure.

Ensuite, l'installation de correctifs peut provoquer des effets secondaires. Un autre défi courant qui pousse souvent les organisations à la prudence est celui des problèmes involontaires ou inattendus causés par l'installation de correctifs. Il peut être étonnamment difficile d'examiner un noeud et de déterminer si un correctif particulier a réellement pris effet. Ce défi peut être rencontré sur un seul noeud, ou si vous extrapolez cela sur l'ensemble d'une flotte organisationnelle de noeuds et de systèmes d'exploitation, l'ampleur de ce défi peut rapidement devenir très accablante.

## Améliorer les choses

![Prioriser les correctifs](/img/cloudops/guides/centralized-operations-management/patch-management/prioritize.png "Prioriser les correctifs")

Pour aider à résoudre certains des défis courants, commencez par prioriser des correctifs spécifiques via des classifications pour identifier un petit sous-ensemble de correctifs que vous devez prioriser. Pour ce faire, déterminez quelles charges de travail ou applications sont les plus critiques pour votre entreprise, puis déterminez quels correctifs font la plus grande différence pour ces charges de travail. Par exemple, les serveurs de messagerie, les bases de données, les applications web, les propriétés numériques orientées client, etc.

![Comment ça fonctionne](/img/cloudops/guides/centralized-operations-management/patch-management/how-it-works.png "Comment ça fonctionne")

À partir de là, vous pouvez créer des [références de correctifs](https://docs.aws.amazon.com/systems-manager/latest/userguide/patch-manager-patch-baselines.html) pour chaque charge de travail, ce qui aide à déterminer les correctifs applicables à marquer comme manquants lors des opérations de scan de correctifs. Le scan vous aide à déterminer le niveau de conformité par rapport aux références que vous avez établies.

Vous pouvez ensuite commencer à planifier des opérations récurrentes d'installation de correctifs pour appliquer les mises à jour pendant les périodes de maintenance routinières ou installer les mises à jour à la demande lors de publications de correctifs urgents. Après l'installation des correctifs, vous pouvez confirmer le résultat en utilisant les données de conformité des correctifs fournies par Patch Manager.

## Que se passe-t-il dans le système d'exploitation pendant la mise à jour ?

Une question courante des clients est : comment Patch Manager scanne ou installe-t-il les correctifs ? Lorsqu'une opération de correctif est initiée, qu'elle soit planifiée ou ad-hoc, l'opération est mise en file d'attente dans les points de terminaison Systems Manager. L'agent SSM récupère alors la commande de scan ou d'installation. L'agent SSM récupère les règles d'approbation de la référence de correctifs et initie un scan ou une installation en utilisant le gestionnaire de paquets du système d'exploitation local, c'est-à-dire Windows Update, yum, apt-get. Une fois l'opération terminée, l'agent SSM rapporte les données de conformité des correctifs à Patch Manager.

![Mise à jour du système d'exploitation par Patch Management](/img/cloudops/guides/centralized-operations-management/patch-management/os-patching.png "Mise à jour du système d'exploitation par Patch Management")

### Connectivité à la source des correctifs

Si vos noeuds gérés n'ont pas de connexion directe à Internet et que vous utilisez un Amazon Virtual Private Cloud (Amazon VPC) avec un point de terminaison VPC, vous devez vous assurer que les noeuds ont accès aux dépôts de correctifs source.

Sur les noeuds Linux, les mises à jour de correctifs sont typiquement téléchargées depuis les dépôts distants configurés sur le noeud. Par conséquent, le noeud doit pouvoir se connecter aux dépôts pour que la mise à jour puisse être effectuée. Les noeuds gérés Windows Server doivent pouvoir se connecter au catalogue Windows Update ou à Windows Server Update Services (WSUS). Pour plus d'informations, consultez [Prérequis de Patch Manager](https://docs.aws.amazon.com/systems-manager/latest/userguide/patch-manager-prerequisites.html).

## Définir les critères de correctifs

Patch Manager fournit des [références de correctifs prédéfinies](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-patch-baselines.html) pour chacun des systèmes d'exploitation supportés par Patch Manager. Vous pouvez utiliser ces références telles qu'elles sont actuellement configurées (vous ne pouvez pas les personnaliser) ou créer vos propres références de correctifs personnalisées. Les références de correctifs personnalisées vous offrent un plus grand contrôle sur les correctifs approuvés ou rejetés pour votre environnement.

Au sein d'une référence de correctifs personnalisée, vous pouvez :

* Définir quels correctifs sont approuvés
* Utiliser des délais d'approbation automatique pour les limites
* Définir des exceptions de correctifs
* Définir des dépôts de correctifs personnalisés pour Linux
* Définir des critères de correctifs pour plusieurs versions de systèmes d'exploitation

## Différents types de mise à jour

Il existe deux approches générales que vous pouvez adopter avec votre solution de mise à jour : centralisée ou décentralisée.

| Mise à jour centralisée | Mise à jour décentralisée |
| -------------------- | ---------------------- |
| L'équipe centrale déploie les opérations de scan de correctifs | Transfère plus de responsabilité au propriétaire de l'application/du compte |
| L'équipe centrale déploie les opérations d'installation de correctifs | L'équipe centrale déploie les opérations de scan de correctifs et le reporting de conformité est toujours centralisé |
| Flexibilité limitée autour de la planification et des opérations effectuées | Les propriétaires sont responsables des opérations d'installation de correctifs et l'équipe centrale peut fournir des briques de base, par exemple via AWS Service Catalog |
| L'équipe centrale est typiquement responsable du dépannage | Permet au propriétaire de définir la planification pour l'installation |
| Plus courant dans les environnements hautement réglementés ou sécurisés | L'équipe centrale devrait avoir une option d'installation de correctifs à la demande |

### Exemples de solutions de mise à jour centralisée pour les organisations multi-comptes

**Option 1 :** Une solution de mise à jour centralisée peut être établie en utilisant les [configurations Quick Setup Patch Policy](https://docs.aws.amazon.com/systems-manager/latest/userguide/quick-setup-patch-manager.html). Les politiques de correctifs permettent aux clients de scanner et planifier l'installation de correctifs pour plusieurs références de correctifs à travers les comptes AWS et les régions AWS. Pour plus d'informations, consultez [Mise à jour à travers une AWS Organization - Politiques de correctifs](/guides/centralized-operations-management/patch-management/#patching-across-an-aws-organization---patch-policies).

![Patch Management Option 1 de mise à jour centralisée](/img/cloudops/guides/centralized-operations-management/patch-management/patch-policy-architecture.png "Patch Management Option 1 de mise à jour centralisée")

**Option 2 :** Une autre option pour une solution centralisée est de planifier une opération de mise à jour multi-comptes et multi-régions en utilisant une combinaison d'[Amazon EventBridge](https://aws.amazon.com/eventbridge/), [AWS Lambda](https://aws.amazon.com/lambda/) et [Systems Manager Automation](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-automation.html). Pour plus d'informations, consultez [Planifier une mise à jour centralisée multi-comptes et multi-régions avec AWS Systems Manager Automation](https://aws.amazon.com/blogs/mt/scheduling-centralized-multi-account-multi-region-patching-aws-systems-manager-automation/).

![Patch Management Option 2 de mise à jour centralisée](/img/cloudops/guides/centralized-operations-management/patch-management/scheduled-mamr-patching-automation.png "Patch Management Option 2 de mise à jour centralisée")

### Exemple de solution de mise à jour décentralisée en libre-service pour les organisations multi-comptes

Différents propriétaires d'applications peuvent avoir des exigences différentes en termes d'opérations de correctifs, de timing, de fréquence de mise à jour et de flexibilité pour tester les correctifs dans des environnements inférieurs (DEV ou UAT). En utilisant [AWS Service Catalog](https://aws.amazon.com/servicecatalog/), les équipes centrales peuvent créer des produits qui servent de briques de base pour la mise à jour en libre-service. Les propriétaires d'applications/comptes peuvent alors déployer ces produits dans leur environnement et n'ont qu'à fournir quelques paramètres, comme la planification, sans avoir à construire une solution eux-mêmes. Pour plus d'informations, consultez [Une solution de mise à jour en libre-service pour les organisations multi-comptes](https://aws.amazon.com/blogs/mt/a-self-service-patching-solution-for-multi-account-organisations/).

![Mise à jour en libre-service avec Service Catalog](/img/cloudops/guides/centralized-operations-management/patch-management/self-service-patching.png "Mise à jour en libre-service avec Service Catalog")

## Mise à jour sur place vs Réhydratation

La réhydratation (repavage, rafraîchissement) est le processus de création de nouveaux serveurs avec les derniers correctifs installés et de décommissionnement des anciens noeuds. C'est une pratique courante pour les instances EC2 dans un Auto Scaling Group, les groupes de noeuds gérés dans un cluster de conteneurs (ECS / EKS) et les AMI préconfigurées avec les exigences de charge de travail applicative.

| Mise à jour sur place | Réhydratation |
| -------------- | ----------- |
| Généralement effectuée à une fréquence plus élevée que la réhydratation (hebdomadaire, bihebdomadaire) | Généralement effectuée mensuellement ou trimestriellement. Certains clients la font toutes les 2 semaines ! |
| Idéale pour les noeuds de longue durée qui ne peuvent pas être facilement remplacés (mutable) | Idéale pour les charges de travail qui ne nécessitent pas beaucoup de configuration post-lancement (immuable) |
| Le flux de travail d'installation de correctifs peut nécessiter des sauvegardes | Utilisez des services comme EC2 Image Builder pour s'intégrer avec les groupes Auto Scaling |
| | Peut encore nécessiter un mécanisme de mise à jour sur place. Par exemple, si un correctif de vulnérabilité zero-day est publié mais que les noeuds ne peuvent pas être remplacés avant le prochain cycle de réhydratation |

Vous pouvez avoir besoin des deux méthodes, mise à jour sur place et réhydratation, dans votre environnement selon la charge de travail applicative.

## Mise à jour à travers une AWS Organization - Politiques de correctifs

Pour standardiser les exigences de mise à jour dans une AWS Organization, vous pouvez utiliser les [politiques de correctifs dans Quick Setup](https://docs.aws.amazon.com/systems-manager/latest/userguide/patch-manager-policies.html). Vous pouvez appliquer une politique de correctifs à travers une organisation entière pour plusieurs systèmes d'exploitation, à travers plusieurs comptes et régions, et examiner la conformité des ressources pour les noeuds gérés cibles.

L'utilisation de Quick Setup sur plusieurs comptes aide à garantir que votre organisation maintient des configurations cohérentes. De plus, Quick Setup vérifie périodiquement la dérive de configuration et tente de la remédier. La dérive de configuration se produit chaque fois qu'un utilisateur apporte une modification à un service ou une fonctionnalité qui entre en conflit avec les sélections faites via Quick Setup.

![Architecture de la politique de correctifs](/img/cloudops/guides/centralized-operations-management/patch-management/patch-policy-detailed-architecture.png "Architecture de la politique de correctifs")

### Comment ça fonctionne

1. Vous créez la politique de correctifs en utilisant Quick Setup et les paramètres sélectionnés sont envoyés à CloudFormation.
1. CloudFormation crée un stack set avec les paramètres définis et les comptes et régions cibles définis. Ceci est généré par Quick Setup lors du déploiement.
1. CloudFormation crée des instances de stack dans chaque compte et région cible.
1. Les instances de stack créent des [associations State Manager](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-state.html) pour le scan de correctifs défini et une association pour l'installation de correctifs, si sélectionné. Ces associations sont appliquées selon les planifications fournies lors de la création de la politique de correctifs.
1. Dans le compte de gestion, une association State Manager démarre un runbook Automation pour invoquer une fonction Lambda une fois par jour.
1. La fonction Lambda stocke les références de correctifs spécifiées sous forme de fichier JSON dans un bucket S3. De plus, la fonction Lambda évalue les références de correctifs personnalisées spécifiées dans Quick Setup pour tout changement. Si des modifications sont apportées aux références de correctifs personnalisées, la fonction Lambda met à jour le fichier JSON dans le bucket S3.
1. Les noeuds gérés récupèrent alors le fichier JSON de référence de correctifs central pendant les opérations de mise à jour pour scanner ou installer les mises à jour.

**Note :** Actuellement, pour déployer les politiques de correctifs via Quick Setup, vous devez utiliser le compte de gestion au sein de votre AWS Organization. Pour déployer des politiques de correctifs en dehors du compte de gestion, consultez [Comment déployer des politiques de correctifs en dehors de Quick Setup](https://catalog.us-east-1.prod.workshops.aws/workshops/7c0ea253-6462-41cd-af76-3850c92458fa/en-US).

## Mise à jour à la demande

Il y a des moments où vous pourriez avoir besoin de mettre à jour des noeuds en dehors de vos cycles de mise à jour routiniers, comme dans des scénarios de vulnérabilité urgents.

**Option 1 :** [Patch now](https://docs.aws.amazon.com/systems-manager/latest/userguide/patch-manager-patch-now-on-demand.html) (*un seul compte/région*)

* En utilisant l'option **Patch now** dans Patch Manager, vous pouvez exécuter rapidement des opérations de mise à jour à la demande. Cependant, **Patch now** ne permet la mise à jour que dans un seul compte AWS et une seule région à la fois. Il ne peut pas non plus utiliser les références de correctifs définies dans les politiques de correctifs. Vous pouvez créer une référence différente qui effectuera un scan de correctifs ou installera les correctifs applicables basés sur des règles d'approbation différentes de vos références de politique de correctifs.

**Option 2 :** Automation *(multi-comptes/régions)*

* Pour effectuer une opération de mise à jour à la demande à travers les comptes et les régions, vous pouvez utiliser Automation qui prend en charge [l'exécution d'automatisations dans plusieurs comptes et régions AWS](https://docs.aws.amazon.com/systems-manager/latest/userguide/running-automations-multiple-accounts-regions.html). Vous pouvez tirer parti des rôles IAM déployés dans les comptes cibles pour effectuer des actions. Vous pouvez intégrer avec les politiques de correctifs ou des exigences de mise à jour autonomes.

## Intégrer la gestion et la remédiation des vulnérabilités

[Amazon Inspector](https://aws.amazon.com/inspector) fournit des scans continus de vulnérabilités sur les instances Amazon EC2 et les images de conteneurs stockées dans Amazon Elastic Container Registry (Amazon ECR). Ces scans évaluent les vulnérabilités logicielles et l'exposition réseau involontaire. Amazon Inspector utilise l'agent Systems Manager (SSM) pour collecter l'inventaire des applications logicielles des instances EC2. Ensuite, Inspector scanne ces données et identifie les vulnérabilités logicielles, une étape cruciale dans la gestion des vulnérabilités.

Vous devriez effectuer des opérations régulières de mise à jour pour résoudre les vulnérabilités identifiées par Amazon Inspector en fonction de la sévérité des vulnérabilités. Vous pouvez utiliser AWS Systems Manager Patch Manager pour automatiser le processus de mise à jour des noeuds gérés par Systems Manager en utilisant l'agent SSM.

Il peut y avoir des vulnérabilités zero-day ou d'autres vulnérabilités de haute et critique sévérité pour lesquelles des correctifs sont disponibles. Cependant, vous pourriez ne pas vouloir attendre la planification régulière de mise à jour pour les remédier. Dans ces cas, des mécanismes de mise à jour à la demande devraient exister.

Pour en savoir plus, consultez :

* [AWS on Air: LockDown - The Magical World of Vulnerability Management](https://www.linkedin.com/events/awsonair-lockdown-themagicalwor7061737757479481344/comments/)
* [Automatiser la gestion et la remédiation des vulnérabilités dans AWS avec Amazon Inspector et AWS Systems Manager – Partie 1](https://aws.amazon.com/blogs/mt/automate-vulnerability-management-and-remediation-in-aws-using-amazon-inspector-and-aws-systems-manager-part-1/)
* [Automatiser la gestion et la remédiation des vulnérabilités dans AWS avec Amazon Inspector et AWS Systems Manager – Partie 2](https://aws.amazon.com/blogs/mt/automate-vulnerability-management-and-remediation-in-aws-using-amazon-inspector-and-aws-systems-manager-part-2/)

![Automatiser la gestion et la remédiation des vulnérabilités](/img/cloudops/guides/centralized-operations-management/patch-management/vulnerability-remediation-architecture.png "Automatiser la gestion et la remédiation des vulnérabilités")

## Examiner la conformité des correctifs

Le tableau de bord de Patch Manager fournit un instantané de la conformité des correctifs dans le compte AWS et la région actuels. Le reporting de conformité vous permet de déterminer la conformité des correctifs pour les noeuds. Vous pouvez également examiner plus de détails sur les correctifs installés et quelle était la sévérité et la criticité de ces correctifs en utilisant la console Fleet Manager.

Bien que ces vues soient spécifiques au compte AWS et à la région locaux, vous pouvez créer un reporting centralisé de conformité des correctifs pour l'ensemble de l'AWS Organization.

## Créer un reporting de bout en bout de gestion des correctifs et d'inventaire dans une AWS Organization

:::tip
Saviez-vous que vous pouvez utiliser [Amazon Quick Suite](https://aws.amazon.com/quicksuite/) pour réduire un processus manuel en plusieurs étapes en quelques invites simples, vous permettant de générer rapidement des visualisations perspicaces de conformité des correctifs et d'inventaire. Découvrez comment les capacités alimentées par l'IA vous aident à créer des tableaux de bord dynamiques, économisant un temps précieux tout en maintenant la précision et fournissant des informations en temps réel sur le statut de mise à jour de votre organisation dans le blog : [Créer des tableaux de bord d'entreprise de mise à jour et d'inventaire avec Amazon Quick Suite](https://aws.amazon.com/blogs/mt/building-enterprise-patching-and-inventory-dashboards-using-amazon-q-in-amazon-quicksuite/).
:::

Pour créer un rapport sur la conformité des correctifs à travers votre AWS Organization, vous pouvez utiliser les [synchronisations de données de ressources](https://docs.aws.amazon.com/systems-manager/latest/userguide/inventory-create-resource-data-sync.html) de Systems Manager pour envoyer les données d'inventaire collectées de tous vos noeuds gérés vers un seul bucket Amazon S3. La synchronisation des données de ressources met alors automatiquement à jour les données centralisées lorsque de nouvelles données d'inventaire sont collectées.

En utilisant un [crawler AWS Glue](https://docs.aws.amazon.com/glue/latest/dg/add-crawler.html), vous pouvez automatiquement créer des bases de données et des tables à partir des données de conformité des correctifs dans S3, puis interroger les données de conformité des correctifs avec [Amazon Athena](https://aws.amazon.com/athena/). Cette solution utilise [Amazon QuickSight](https://aws.amazon.com/quicksight/) pour visualiser les données d'inventaire et de conformité des correctifs, cependant, vous pouvez utiliser tout outil de BI ou d'analyse capable de récupérer les données du bucket S3.

**Note :** Vous devez créer une synchronisation de données de ressources dans chaque compte et région où vous souhaitez collecter les données d'inventaire de vos noeuds.

![Reporting de gestion des correctifs de bout en bout](/img/cloudops/guides/centralized-operations-management/patch-management/architecture-diagram-ssm-org-reporting.png "Reporting de gestion des correctifs de bout en bout")

1. Créez des synchronisations de données de ressources Systems Manager dans chaque compte/région.
1. Agrégez de manière centralisée les données de conformité des correctifs dans un seul bucket Amazon S3.
1. Créez automatiquement des bases de données et des tables en utilisant un AWS Glue Crawler.
1. Interrogez les données de correctifs ou d'inventaire en utilisant Amazon Athena.
1. Visualisez la conformité des correctifs en utilisant Amazon QuickSight.

## Comprendre les métadonnées d'inventaire AWS Systems Manager

Les synchronisations de données de ressources poussent les données vers les buckets S3 basées sur les actions prises à partir d'actions à la demande (enregistrement ou terminaison d'instances / exécution d'un scan ou d'une installation de correctifs), d'actions planifiées (collecte d'inventaire logiciel, collecte de métadonnées d'inventaire personnalisé, exécution d'une installation de correctifs et évaluation de la conformité avec Chef InSpec).

![Métadonnées d'inventaire](/img/cloudops/guides/centralized-operations-management/patch-management/resource-data-sync-inventory-metadata.png "Métadonnées d'inventaire")

Source : [Comprendre les métadonnées d'inventaire AWS Systems Manager](https://aws.amazon.com/blogs/mt/understanding-aws-systems-manager-inventory-metadata/)
