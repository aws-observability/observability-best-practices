# Amazon Managed Grafana - FAQ

## Pourquoi devrais-je choisir Amazon Managed Grafana ?

**[Haute disponibilité](https://docs.aws.amazon.com/grafana/latest/userguide/disaster-recovery-resiliency.html)** : Les espaces de travail Amazon Managed Grafana sont hautement disponibles avec une réplication multi-AZ. Amazon Managed Grafana surveille également en continu la santé des espaces de travail et remplace les nœuds défaillants, sans impacter l'accès aux espaces de travail. Amazon Managed Grafana gère la disponibilité des nœuds de calcul et de base de données afin que les clients n'aient pas à gérer les ressources d'infrastructure nécessaires à l'administration et à la maintenance.

**[Sécurité des données](https://docs.aws.amazon.com/grafana/latest/userguide/security.html)** : Amazon Managed Grafana chiffre les données au repos sans configuration spéciale, outils tiers ou coût supplémentaire. Les [données en transit](https://docs.aws.amazon.com/grafana/latest/userguide/infrastructure-security.html) sont également chiffrées via TLS.

## Quelles régions AWS sont prises en charge ?

La liste actuelle des régions prises en charge est disponible dans la [section Régions prises en charge de la documentation.](https://docs.aws.amazon.com/grafana/latest/userguide/what-is-Amazon-Managed-Service-Grafana.html#AMG-supported-Regions)

## Nous avons plusieurs comptes AWS dans plusieurs régions au sein de notre Organisation. Amazon Managed Grafana fonctionne-t-il dans ces scénarios ?

Amazon Managed Grafana s'intègre avec [AWS Organizations](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_introduction.html) pour découvrir les comptes AWS et les ressources dans les unités organisationnelles (OU). Avec AWS Organizations, les clients peuvent [gérer de manière centralisée la configuration des sources de données et les paramètres de permissions](https://docs.aws.amazon.com/grafana/latest/userguide/AMG-and-Organizations.html) pour plusieurs comptes AWS.

## Quelles sources de données sont prises en charge dans Amazon Managed Grafana ?

Les sources de données sont des backends de stockage que les clients peuvent interroger dans Grafana pour créer des tableaux de bord dans Amazon Managed Grafana. Amazon Managed Grafana prend en charge environ [30+ sources de données intégrées](https://docs.aws.amazon.com/grafana/latest/userguide/AMG-data-sources-builtin.html) incluant des services natifs AWS comme Amazon CloudWatch, Amazon OpenSearch Service, AWS IoT SiteWise, AWS IoT TwinMaker, Amazon Managed Service for Prometheus, Amazon Timestream, Amazon Athena, Amazon Redshift, AWS X-Ray et bien d'autres. De plus, [environ 15+ autres sources de données](https://docs.aws.amazon.com/grafana/latest/userguide/AMG-data-sources-enterprise.html) sont également disponibles pour les espaces de travail mis à niveau dans Grafana Enterprise.

## Les sources de données de mes charges de travail se trouvent dans des VPC privés. Comment puis-je les connecter à Amazon Managed Grafana de manière sécurisée ?

Les [sources de données privées au sein d'un VPC](https://docs.aws.amazon.com/grafana/latest/userguide/AMG-configure-vpc.html) peuvent être connectées à Amazon Managed Grafana via AWS PrivateLink pour maintenir le trafic sécurisé. Un contrôle d'accès supplémentaire au service Amazon Managed Grafana depuis les [points de terminaison VPC](https://docs.aws.amazon.com/grafana/latest/userguide/AMG-configure-nac.html) peut être restreint en attachant une [politique de ressource IAM](https://docs.aws.amazon.com/grafana/latest/userguide/VPC-endpoints.html#controlling-vpc) pour les [points de terminaison Amazon VPC](https://docs.aws.amazon.com/whitepapers/latest/aws-privatelink/what-are-vpc-endpoints.html).

## Quel mécanisme d'authentification des utilisateurs est disponible dans Amazon Managed Grafana ?

Dans l'espace de travail Amazon Managed Grafana, [les utilisateurs sont authentifiés sur la console Grafana](https://docs.aws.amazon.com/grafana/latest/userguide/authentication-in-AMG.html) par authentification unique en utilisant n'importe quel IDP prenant en charge Security Assertion Markup Language 2.0 (SAML 2.0) ou AWS IAM Identity Center (successeur d'AWS Single Sign-On).

> Blog associé : [Fine-grained access control in Amazon Managed Grafana using Grafana Teams](https://aws.amazon.com/blogs/mt/fine-grained-access-control-in-amazon-managed-grafana-using-grafana-teams/)

## Quel type de support d'automatisation est disponible pour Amazon Managed Grafana ?

Amazon Managed Grafana est [intégré avec AWS CloudFormation](https://docs.aws.amazon.com/grafana/latest/userguide/creating-resources-with-cloudformation.html), qui aide les clients à modéliser et configurer les ressources AWS afin qu'ils puissent passer moins de temps à créer et gérer les ressources et l'infrastructure dans AWS. Avec [AWS CloudFormation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html), les clients peuvent réutiliser des modèles pour configurer les ressources Amazon Managed Grafana de manière cohérente et répétable. Amazon Managed Grafana dispose également d'une [API](https://docs.aws.amazon.com/grafana/latest/APIReference/Welcome.html) disponible qui permet aux clients d'automatiser via [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html) ou de s'intégrer avec des logiciels/produits. Les espaces de travail Amazon Managed Grafana disposent d'[API HTTP](https://docs.aws.amazon.com/grafana/latest/userguide/Using-Grafana-APIs.html) pour le support d'automatisation et d'intégration.

> Blog associé : [Announcing Private VPC data source support for Amazon Managed Grafana](https://aws.amazon.com/blogs/mt/announcing-private-vpc-data-source-support-for-amazon-managed-grafana/)

## Mon organisation utilise Terraform pour l'automatisation. Amazon Managed Grafana prend-il en charge Terraform ?
Oui, [Amazon Managed Grafana prend en charge](https://aws-observability.github.io/observability-best-practices/recipes/recipes/amg-automation-tf/) Terraform pour l'[automatisation](https://registry.terraform.io/modules/terraform-aws-modules/managed-service-grafana/aws/latest)

> Exemple : [Implémentation de référence pour le support Terraform](https://github.com/aws-observability/terraform-aws-observability-accelerator/tree/main/examples/managed-grafana-workspace)

## J'utilise des tableaux de bord couramment utilisés dans ma configuration Grafana actuelle. Existe-t-il un moyen de les utiliser sur Amazon Managed Grafana plutôt que de les recréer ?

Amazon Managed Grafana prend en charge les [API HTTP](https://docs.aws.amazon.com/grafana/latest/userguide/Using-Grafana-APIs.html) qui vous permettent d'automatiser facilement le déploiement et la gestion des tableaux de bord, des utilisateurs et bien plus encore. Vous pouvez utiliser ces API dans vos processus GitOps/CICD pour automatiser la gestion de ces ressources.

## Amazon Managed Grafana prend-il en charge les alertes ?

Les [alertes Amazon Managed Grafana](https://docs.aws.amazon.com/grafana/latest/userguide/alerts-overview.html) fournissent aux clients des alertes robustes et exploitables qui aident à détecter les problèmes dans les systèmes en temps quasi réel, minimisant les perturbations des services. Grafana inclut l'accès à un système d'alerte mis à jour, Grafana alerting, qui centralise les informations d'alerte dans une vue unique et consultable.

## Mon organisation exige que toutes les actions soient enregistrées pour les audits. Les événements Amazon Managed Grafana peuvent-ils être enregistrés ?

Amazon Managed Grafana est intégré avec [AWS CloudTrail](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html), qui fournit un enregistrement des actions effectuées par un utilisateur, un rôle ou un service AWS dans Amazon Managed Grafana. CloudTrail capture tous les [appels API pour Amazon Managed Grafana](https://docs.aws.amazon.com/grafana/latest/userguide/logging-using-cloudtrail.html) en tant qu'événements. Les appels capturés incluent les appels depuis la console Amazon Managed Grafana et les appels de code vers les opérations de l'API Amazon Managed Grafana.

## Quelles informations supplémentaires sont disponibles ?

Pour des informations supplémentaires sur Amazon Managed Grafana, les clients peuvent consulter la [documentation](https://docs.aws.amazon.com/grafana/latest/userguide/what-is-Amazon-Managed-Service-Grafana.html) AWS, parcourir l'atelier AWS Observability sur [Amazon Managed Grafana](https://catalog.workshops.aws/observability/en-US/aws-managed-oss/amg) et également consulter la [page produit](https://aws.amazon.com/grafana/) pour connaître les [fonctionnalités](https://aws.amazon.com/grafana/features/?nc=sn&loc=2), les détails de [tarification](https://aws.amazon.com/grafana/pricing/?nc=sn&loc=3), les derniers [articles de blog](https://aws.amazon.com/grafana/resources/?nc=sn&loc=4&msg-blogs.sort-by=item.additionalFields.createdDate&msg-blogs.sort-order=desc#Latest_blog_posts) et les [vidéos](https://aws.amazon.com/grafana/resources/?nc=sn&loc=4&msg-blogs.sort-by=item.additionalFields.createdDate&msg-blogs.sort-order=desc#Videos).

**FAQ produit :** [https://aws.amazon.com/grafana/faqs/](https://aws.amazon.com/grafana/faqs/)
