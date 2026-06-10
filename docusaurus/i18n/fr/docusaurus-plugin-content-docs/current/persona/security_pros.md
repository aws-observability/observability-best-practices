# Professionnels de la sécurité

Les professionnels de la sécurité dans les organisations opèrent à travers des rôles et responsabilités divers, chacun nécessitant des ensembles de compétences et des outils variés pour protéger efficacement l'infrastructure cloud, les applications et les ressources. Des architectes de sécurité qui conçoivent des cadres de sécurité cloud robustes aux équipes d'opérations de sécurité qui [surveillent et répondent](https://aws.amazon.com/cloudops/monitoring-and-observability/) aux menaces, votre parcours de sécurité avec AWS exige des meilleures pratiques et des outils spécifiques à chaque rôle.

Ce guide décrit des approches de sécurité adaptées pour les personas de sécurité clés : les architectes de sécurité se concentrent sur l'implémentation du pilier sécurité du [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/) et la conception de zones d'atterrissage sécurisées, les équipes d'opérations de sécurité utilisent AWS Security Hub et Amazon GuardDuty pour la détection et la réponse aux menaces, les responsables de la conformité exploitent AWS Audit Manager et AWS Config pour maintenir les standards réglementaires, et les ingénieurs de sécurité implémentent la sécurité de l'infrastructure en utilisant des services tels qu'AWS IAM, AWS KMS et AWS Network Firewall.

Comprendre ces exigences spécifiques aux personas aide les organisations à construire des programmes de sécurité complets qui répondent aux défis et responsabilités uniques de chaque rôle de sécurité tout en maintenant une posture de sécurité forte dans vos environnements AWS.

## Pratiques de codage sécurisé et cycle de développement sécurisé

AWS met l'accent sur la sécurité comme élément fondamental du développement logiciel à travers ses principes de « sécurité par conception ». Vous pouvez implémenter des [pratiques de codage sécurisé](https://aws-observability.github.io/observability-best-practices/persona/developer), qui intègrent les contrôles de sécurité et les exigences de conformité tout au long du cycle de développement. Ces pratiques s'alignent avec les standards de l'industrie tels que le OWASP Top 10 et aident à maintenir une posture de sécurité robuste tout au long du cycle de vie de votre application.

- Implémenter l'infrastructure as code (IaC) pour assurer des configurations de sécurité cohérentes et versionnées, utiliser AWS CodeBuild avec l'analyse de sécurité intégrée, et déployer AWS CodePipeline pour les tests de sécurité automatisés.

- Le [modèle de responsabilité partagée AWS](https://aws.amazon.com/compliance/shared-responsibility-model/) vous guide dans la compréhension des responsabilités en matière de sécurité, tandis que des services tels qu'Amazon CodeGuru Reviewer identifient automatiquement les vulnérabilités de sécurité et suggèrent des étapes de remédiation.

- AWS recommande d'implémenter des contrôles de sécurité à toutes les phases — de la conception et du développement en passant par les tests, le déploiement et la maintenance. Les pratiques clés incluent l'utilisation d'AWS Secrets Manager pour la gestion sécurisée des identifiants, l'implémentation d'AWS WAF pour la protection des applications, et l'utilisation d'Amazon Inspector pour les évaluations de sécurité continues.

## Meilleures pratiques de gestion des identités et des accès

AWS recommande d'implémenter le principe du moindre privilège comme pierre angulaire de votre stratégie de gestion des identités et des accès (IAM). Vous devriez commencer par créer des utilisateurs IAM individuels au lieu d'utiliser le compte root pour vos opérations cloud quotidiennes, implémenter des politiques de mots de passe fortes et effectuer une rotation régulière des identifiants. AWS valide l'utilisation de l'authentification multi-facteurs (MFA) pour les utilisateurs privilégiés et le compte root, en particulier pour les opérations sensibles.

- AWS Organizations vous permet de gérer et gouverner de manière centralisée plusieurs comptes tout en utilisant des politiques de contrôle de service (SCP) et des politiques de contrôle des ressources (RCP) pour établir des garde-fous pour les autorisations dans votre organisation. Pour un contrôle d'accès granulaire, vous pouvez utiliser le contrôle d'accès basé sur les attributs (ABAC) avec les tags IAM, réduisant le nombre de politiques que vous devez maintenir.

- Vous pouvez rationaliser la gestion des accès en utilisant AWS IAM Identity Center (anciennement AWS Single Sign-On) pour gérer de manière centralisée l'accès à travers les comptes AWS et les applications métier.

- Des révisions d'accès régulières utilisant AWS IAM Access Analyzer aident à identifier et supprimer les autorisations inutilisées, tandis qu'AWS CloudTrail fournit une journalisation détaillée de l'activité API pour l'analyse de sécurité et l'audit de conformité.

Ces pratiques s'alignent avec le [pilier sécurité](https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/welcome.html) du AWS Well-Architected Framework et aident à maintenir une posture de sécurité forte tout en gérant les identités à grande échelle.

## Directives de chiffrement et de protection des données

AWS fournit des capacités complètes de protection des données à travers une approche de défense en profondeur, mettant l'accent sur le chiffrement au repos et en transit.

- Vous pouvez protéger les données au repos en utilisant AWS Key Management Service (AWS KMS) pour créer et contrôler les clés de chiffrement, tandis qu'AWS Certificate Manager (ACM) aide à sécuriser les données en transit avec des certificats TLS.

- Pour vos données Amazon S3, vous pouvez implémenter le chiffrement côté serveur en utilisant les clés AWS KMS (SSE-KMS), les clés gérées par S3 (SSE-S3) ou les clés fournies par le client (SSE-C). AWS recommande de chiffrer par défaut les volumes Amazon EBS, les instances RDS et les tables DynamoDB, en utilisant soit des clés gérées par AWS soit des clés gérées par le client selon vos exigences de conformité.

- Pour maintenir la souveraineté des données, vous pouvez utiliser AWS CloudHSM pour le stockage matériel des clés et AWS Macie pour découvrir et protéger automatiquement les données sensibles. Lors du transfert de données, AWS PrivateLink fournit une connectivité sécurisée aux services AWS sans utiliser l'internet public, tandis qu'AWS Transfer Family assure des transferts de fichiers sécurisés en utilisant les protocoles SFTP, FTPS et FTP.

- De plus, l'implémentation d'Amazon S3 Object Lock et du versioning aide à protéger contre la suppression accidentelle ou malveillante, tandis qu'AWS Backup crée des sauvegardes chiffrées à travers vos ressources AWS. Ces mécanismes de chiffrement s'alignent avec les standards de conformité tels que HIPAA, PCI DSS et RGPD.

## Cadres de conformité et de gestion des risques

AWS maintient un programme robuste de conformité et de gestion des risques qui s'aligne avec les standards et réglementations mondiaux tout en vous fournissant des outils et des ressources pour votre propre parcours de conformité. Le programme de conformité AWS vous aide à comprendre les contrôles complets qu'AWS implémente à travers des audits tiers, des certifications et des attestations telles qu'ISO 27001, les rapports SOC et PCI DSS.

- Vous pouvez utiliser AWS Audit Manager pour évaluer en continu votre utilisation d'AWS par rapport aux standards de l'industrie et aux politiques internes, tandis qu'AWS Config fournit un suivi détaillé de la configuration des ressources et une surveillance de la conformité.

- Pour les industries réglementées, AWS Control Tower aide à établir et maintenir un environnement multi-comptes sécurisé et conforme en utilisant des garde-fous basés sur les meilleures pratiques AWS.

- AWS Security Hub centralise les résultats de sécurité et les vérifications de conformité entre les comptes, en s'intégrant avec des services comme Amazon Inspector pour les évaluations de sécurité automatisées et Amazon GuardDuty pour la détection des menaces.

- AWS Artifact fournit un accès à la demande aux rapports de sécurité et de conformité, vous permettant de démontrer la conformité aux auditeurs. Le livre blanc AWS Risk and Compliance décrit le modèle de responsabilité partagée AWS, vous aidant à comprendre quelles exigences de conformité sont gérées par AWS et lesquelles restent de votre responsabilité.

Ces outils et cadres supportent diverses exigences réglementaires incluant HIPAA, RGPD, FedRAMP et les lois régionales de protection des données.

## Stratégies de gestion des vulnérabilités et de tests de pénétration

AWS supporte la gestion complète des vulnérabilités et les tests de pénétration à travers une approche structurée qui combine des outils automatisés avec des capacités d'évaluation manuelle.

- Vous pouvez effectuer des tests de pénétration autorisés sur votre infrastructure AWS sans approbation préalable pour huit services spécifiques, incluant les instances Amazon EC2, les passerelles NAT et les Elastic Load Balancers. AWS Inspector évalue automatiquement les applications pour les vulnérabilités et les écarts par rapport aux meilleures pratiques de sécurité, tandis qu'Amazon GuardDuty fournit une surveillance de sécurité continue pour détecter les menaces et les comportements non autorisés.

- Pour la sécurité des conteneurs, l'analyse Amazon ECR aide à identifier les vulnérabilités dans les images de conteneurs, et AWS Systems Manager Patch Manager automatise le processus de gestion des correctifs à travers vos ressources AWS. Vous pouvez renforcer votre posture de sécurité en utilisant AWS Security Hub pour agréger et prioriser les résultats de sécurité provenant de multiples services AWS et outils partenaires. AWS recommande également d'implémenter Amazon Detective pour analyser et visualiser les données de sécurité pour une investigation plus approfondie des problèmes de sécurité potentiels.

- Pour les applications web, AWS WAF aide à protéger contre les techniques d'exploitation courantes, tandis qu'AWS Shield fournit une protection DDoS. L'AWS Marketplace propose des outils de sécurité tiers supplémentaires pour l'analyse des vulnérabilités et les tests de pénétration qui s'intègrent avec votre environnement AWS.

Les évaluations de sécurité régulières doivent suivre la politique d'utilisation acceptable d'AWS et les directives de tests de sécurité pour maintenir la conformité tout en identifiant les vulnérabilités potentielles.

## Techniques de réponse aux incidents et de chasse aux menaces

AWS fournit un cadre complet pour la réponse aux incidents et la chasse proactive aux menaces à travers des services de sécurité intégrés et des capacités d'automatisation.

- Vous pouvez implémenter AWS Security Hub comme votre centre de commande central pour les alertes de sécurité, tandis qu'Amazon GuardDuty utilise l'apprentissage automatique pour effectuer une détection continue des menaces à travers vos comptes et charges de travail AWS.

- Pour l'automatisation de la réponse aux incidents, vous pouvez utiliser AWS Systems Manager Incident Manager pour gérer, résoudre et analyser les incidents de sécurité avec des plans de réponse prédéfinis et des runbooks automatisés.

- Amazon Detective vous aide à analyser et visualiser les données de sécurité pour identifier la cause racine des problèmes de sécurité potentiels, tandis qu'AWS CloudWatch Logs Insights permet l'analyse des logs en temps réel pour la chasse aux menaces.

- La fonctionnalité AWS CloudTrail Lake vous permet d'exécuter des requêtes SQL sur l'historique de votre activité API pour les investigations forensiques.

- Vous pouvez améliorer votre posture de sécurité en implémentant Amazon EventBridge pour la réponse automatisée aux événements de sécurité, et AWS Lambda pour la remédiation serverless des incidents. AWS recommande d'établir des [VPC Flow Logs pour l'observabilité réseau](https://aws-observability.github.io/observability-best-practices/patterns/vpcflowlogs) et la journalisation des requêtes DNS pour l'analyse du trafic réseau, tandis qu'AWS Config enregistre les configurations des ressources pour l'analyse de conformité et l'investigation des incidents.

Ces capacités s'intègrent avec vos solutions existantes de gestion des informations et événements de sécurité (SIEM) à travers Amazon Kinesis Data Firehose, permettant une surveillance de sécurité centralisée et des workflows de réponse automatisée aux incidents.

## Conclusion

En implémentant ces services de sécurité, outils et pratiques supportant les personas de sécurité dans une organisation, les clients peuvent mieux protéger leurs charges de travail AWS tout en donnant à vos équipes de sécurité les moyens de travailler plus efficacement. Commencez par identifier les personas de sécurité clés de votre organisation, puis associez leurs responsabilités aux services et outils AWS appropriés. N'oubliez pas de revoir et de mettre à jour régulièrement ces pratiques de sécurité basées sur les rôles à mesure que votre environnement cloud évolue. Vous pouvez utiliser AWS Security Hub et AWS Organizations pour maintenir la visibilité entre les comptes et automatiser les vérifications de sécurité basées sur les exigences des personas. Pour plus de conseils sur l'implémentation des meilleures pratiques de sécurité, contactez l'équipe de votre compte AWS qui peut vous aider à concevoir une stratégie de sécurité complète adaptée aux besoins de votre organisation.
