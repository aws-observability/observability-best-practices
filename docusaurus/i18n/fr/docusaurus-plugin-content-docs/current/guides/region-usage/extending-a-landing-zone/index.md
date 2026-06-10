---
sidebar_position: 2
---
# Étendre une zone d'atterrissage AWS

À mesure qu'AWS étend sa présence mondiale, les organisations ont besoin d'une approche structurée pour étendre leur présence cloud vers de nouvelles régions. Alors qu'AWS lance de nouvelles régions, les organisations cherchent à élargir leur empreinte. Ce guide présente les considérations clés et les meilleures pratiques pour étendre votre AWS Organization ou zone d'atterrissage.

## Construire les fondations

Mettre en place une fondation cloud robuste avec des contrôles de gouvernance complets n'est pas seulement une bonne pratique — c'est une nécessité critique dans l'environnement cloud dynamique d'aujourd'hui. Les organisations qui investissent du temps dans l'établissement de cadres de gouvernance solides dès le départ se trouvent mieux positionnées pour évoluer, s'adapter et maintenir la sécurité à mesure qu'elles grandissent. Pensez-y comme à la construction d'une maison : sans fondation solide, tout ajout ou modification devient de plus en plus risqué et complexe. Les contrôles de gouvernance cloud, incluant les Service Control Policies (SCPs), les garde-fous et les cadres de conformité, agissent comme les plans architecturaux et les codes de construction qui garantissent que votre infrastructure cloud reste sécurisée, conforme et gérable. Lors de l'expansion vers de nouvelles régions, avoir ces contrôles en place rend le processus d'extension plus fluide et sécurisé. Les organisations découvrent souvent que la mise en place rétroactive des contrôles de gouvernance est significativement plus difficile et gourmande en ressources que leur implémentation lors de la configuration initiale. Cette approche proactive de la gouvernance aide non seulement à prévenir les incidents de sécurité et les violations de conformité, mais fournit également la flexibilité nécessaire pour s'adapter aux besoins commerciaux changeants tout en maintenant l'excellence opérationnelle.

## Approche Organisation d'abord vs Control Tower : différences clés

Lors de l'extension vers une nouvelle région, les clients disposent de deux chemins principaux selon leur configuration existante. AWS Organizations fournit une approche manuelle mais hautement flexible, permettant un contrôle granulaire sur les détails d'implémentation. Ce chemin nécessite une configuration pratique de chaque service et une implémentation personnalisée des Service Control Policies, mais offre une flexibilité maximale pour des exigences spécifiques. En revanche, AWS Control Tower offre une approche plus rationalisée et automatisée grâce à Account Factory accompagnée de contrôles de gouvernance pré-construits et de garde-fous standardisés. Control Tower simplifie considérablement le processus de configuration multi-comptes, bien qu'il puisse avoir moins de flexibilité qu'une approche purement Organizations. Le choix entre ces chemins dépend souvent de votre infrastructure existante et de vos exigences de gouvernance spécifiques.

## Gouvernance et contrôles de sécurité

Un avantage lors de l'extension vers de nouvelles régions AWS est que certains services fondamentaux, comme CloudTrail et AWS Billing, intègrent automatiquement les nouvelles régions dans leurs configurations existantes. CloudTrail, lorsqu'il est configuré pour toutes les régions, commencera automatiquement à journaliser l'activité API dans les nouvelles régions dès qu'elles deviennent disponibles pour votre compte, sans nécessiter de configuration supplémentaire. De même, AWS Billing consolide automatiquement les coûts à travers toutes les régions actives, fournissant une gestion unifiée des coûts et des rapports via AWS Cost Explorer et AWS Bills.

Cependant, il est important de noter que bien que ces services s'adaptent automatiquement, d'autres services de sécurité et opérationnels comme les Service Control Policies, GuardDuty, Security Hub et AWS Config nécessitent toujours une activation régionale explicite pour assurer une couverture complète de votre empreinte étendue.

## Contrôle d'accès

AWS Identity and Access Management (IAM) est l'un de ces magnifiques services globaux « configurer et oublier » qui fonctionne simplement dans l'ensemble de votre empreinte AWS. Lorsque vous vous étendez dans une région, vos utilisateurs, rôles et politiques IAM existants sont déjà prêts — aucune configuration supplémentaire nécessaire ! C'est comme avoir votre équipe de sécurité déjà stationnée au nouvel emplacement avant votre arrivée. Vos principaux IAM existants auront automatiquement les mêmes permissions que dans les autres régions (en supposant que vos politiques n'incluent pas de restrictions spécifiques à une région). Cette nature globale d'IAM fait gagner énormément de temps et aide à maintenir des contrôles d'accès cohérents dans l'ensemble de votre présence AWS croissante. N'oubliez pas — bien qu'IAM soit global, certaines politiques basées sur les ressources et les rôles liés aux services peuvent nécessiter une considération régionale, alors gardez cela dans votre liste de vérification d'expansion.

## Service Control Policies

Si vous utilisez AWS Control Tower, bonne nouvelle — les garde-fous intégrés et leurs Service Control Policies (SCPs) associées étendront automatiquement leur protection à toute nouvelle région une fois qu'elle est activée dans Control Tower. C'est comme avoir une force de sécurité automatique qui se déploie elle-même ! Cependant, si vous utilisez des SCPs personnalisées (que ce soit dans Control Tower ou AWS Organizations), vous devrez retrousser vos manches et mettre à jour manuellement ces politiques pour inclure la nouvelle région. C'est particulièrement important pour les politiques qui utilisent des contrôles spécifiques à une région ou des déclarations de régions autorisées. Par exemple, si vous avez une SCP qui liste explicitement les régions autorisées, vous devrez ajouter la nouvelle région à cette liste, par exemple :

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AllowedRegions",
            "Effect": "Deny",
            "NotAction": [
                "cloudfront:*",
                "iam:*",
                "route53:*",
                "support:*"
            ],
            "Resource": "*",
            "Condition": {
                "StringNotLike": {
                    "aws:RequestedRegion": [
                        "ap-southeast-2",
                        "ap-southeast-4"  // Adding Asia Pacific (Melbourne) region
                    ]
                }
            }
        }
    ]
}
```

Sans ces modifications, vos équipes pourraient se demander pourquoi elles ne peuvent pas lancer de ressources. N'oubliez pas de tester ces mises à jour de politiques dans un environnement hors production d'abord — nous voulons toujours minimiser l'impact sur les clients.


## AWS Config

Comme les Service Control Policies, lorsque vous utilisez AWS Control Tower, AWS Config bénéficie d'un traitement VIP — il est automatiquement activé et configuré dans toute nouvelle région une fois que Control Tower la prend en charge. Les règles, agrégateurs et enregistreurs apparaissent tout simplement. Cependant, si vous exécutez AWS Config via Organizations sans Control Tower, vous devrez tracer ce chemin manuellement. Cela signifie retrousser ses manches pour activer Config dans la nouvelle région, déployer vos règles (n'oubliez pas les personnalisées !) et configurer les agrégateurs si vous les utilisez. De nombreux clients utilisent CloudFormation StackSets pour automatiser ce processus. N'oubliez pas, que ce soit automatisé ou manuel, maintenir une couverture AWS Config cohérente est crucial pour vos besoins de gouvernance et de conformité !

## Services de sécurité supplémentaires

Plongeons dans le monde des services de sécurité AWS et ce que vous devez savoir lors de l'expansion vers de nouvelles régions. Contrairement à IAM qui a une portée globale, la plupart des services de sécurité AWS nécessitent une stratégie de déploiement régional — pensez-y comme à l'ouverture de nouveaux bureaux de sécurité à chaque emplacement où vous opérez.

Tout d'abord, parlons de l'équipe de sécurité de rêve : GuardDuty, Security Hub, Macie et Detective. Chacun de ces services doit être explicitement activé dans la nouvelle région. Ce n'est pas une situation de « déplacer et transférer » — vous devrez délibérément activer chaque service. Mais c'est là que cela devient intéressant avec Organizations — les paramètres de votre compte administrateur délégué sont en fait globaux. Une fois que vous avez désigné un compte comme administrateur délégué pour un service de sécurité, ce compte maintient ses pouvoirs spéciaux dans toutes les régions.

Cependant, il reste du travail à faire. Même avec un compte administrateur délégué, vous devrez activer chaque service de sécurité dans la nouvelle région. Par exemple, avec Security Hub, votre compte administrateur délégué devra activer le service dans la nouvelle région puis configurer l'agrégation des résultats des comptes membres. Il en va de même pour GuardDuty — bien que votre désignation d'administrateur délégué soit conservée, vous devrez activer la détection des menaces dans la nouvelle région et configurer les comptes membres en conséquence.

Voici un conseil de pro : de nombreux développeurs utilisent AWS CloudFormation StackSets ou d'autres outils pour automatiser ce processus d'activation régionale. Nous avons constaté que l'automatisation est essentielle pour maintenir des contrôles de sécurité cohérents entre les régions. Envisagez de créer un modèle « bootstrap de sécurité pour nouvelle région » qui active et configure tous vos services de sécurité requis — votre futur vous vous en remerciera !

Et n'oubliez pas l'agrégation régionale ! Si vous utilisez Security Hub ou GuardDuty comme outils centraux de surveillance de la sécurité, vous voudrez configurer l'agrégation inter-régions pour maintenir cette vue consolidée unique. La bonne nouvelle est qu'une fois que vous avez configuré votre compte administrateur délégué et activé le service dans la nouvelle région, l'ajouter à votre configuration d'agrégation ne prend généralement que quelques clics.


## Obtenir de la visibilité

Parlons de certains services souvent négligés mais très importants qui nécessitent une attention lors de l'expansion vers de nouvelles régions. Pendant que vous planifiez votre expansion régionale, n'oubliez pas vos outils de visibilité opérationnelle — ils ont aussi besoin d'attention. Resource Explorer, notre service de recherche unifiée pratique, nécessite que vous ajoutiez de nouvelles régions à vos paramètres d'agrégateur si vous voulez maintenir cette vue consolidée de toutes vos ressources AWS. De même, IAM Access Analyzer, votre gardien des permissions, doit être activé dans la nouvelle région et ajouté à votre configuration d'agrégation pour maintenir des informations complètes sur les permissions. Et n'oublions pas CloudWatch Logs ! Si vous utilisez la journalisation centralisée inter-comptes et inter-régions, vous devrez mettre à jour vos paramètres de routage et de réplication des journaux pour inclure la nouvelle région. Conseil de pro : de nombreux développeurs créent un compte de journalisation centralisé et utilisent un récepteur CloudWatch Logs d'observabilité inter-régions pour maintenir une source unique de vérité. Nous recommandons de documenter ces configurations d'agrégation dans votre guide d'expansion régionale — votre futur vous appréciera d'avoir toutes ces étapes en un seul endroit !

## Qu'est-ce qui manque ?

Avant de vous lancer dans cette nouvelle région, parlons de votre inventaire de services AWS — c'est plus passionnant que cela n'en a l'air. En raisonnant à rebours à partir d'une expansion régionale réussie, vous voudrez créer une évaluation complète de votre empreinte de services AWS. Pensez au-delà des services évidents — bien sûr, nous avons couvert les services organisationnels, les outils de sécurité et de conformité, les configurations de surveillance et de journalisation, et vous connaissez EC2 et S3. Mais qu'en est-il de ces vérifications de santé Route 53, des plans AWS Backup, ou de ces AWS Private Certificate Authorities que vous avez configurées il y a des mois ? Créez une liste de contrôle des services qui inclut votre infrastructure principale et vos services de support. Conseil de pro : utilisez AWS Resource Explorer ou AWS Config pour vous aider à découvrir tous les services que vous utilisez actuellement — vous pourriez trouver des trésors oubliés ! Pour chaque service, documentez s'il est global, régional ou s'il nécessite une configuration régionale spécifique. Cette évaluation deviendra votre guide d'expansion, assurant que vous maintenez des capacités cohérentes entre les régions tout en évitant les moments « oups, on a oublié ce service ». N'oubliez pas, une expansion régionale bien planifiée est une expansion régionale réussie !

## Sur le sujet des zones d'atterrissage

Plongeons dans le concept des zones d'atterrissage AWS et le rôle important de la région d'origine — c'est une connaissance cruciale pour quiconque gère des déploiements multi-régions !

Pensez à votre zone d'atterrissage AWS comme votre siège cloud, avec la région d'origine servant de bureau principal. Lorsque vous configurez initialement AWS Control Tower ou implémentez une solution de zone d'atterrissage personnalisée, vous choisissez une région d'origine — et cette décision est plus significative que beaucoup ne le réalisent. C'est comme planter un drapeau qui dit « C'est ici que vivent nos configurations principales ! »

Dans votre région d'origine, des services critiques comme Control Tower et ses composants de gestion s'installent. Cela inclut les configurations d'Account Factory, les archives de journaux d'audit, les pipelines de déploiement et d'autres services fondamentaux. Lorsque vous étendez votre zone d'atterrissage à de nouvelles régions, vous ouvrez essentiellement des bureaux secondaires tout en maintenant votre siège dans la région d'origine. La nouvelle région hérite des contrôles de gouvernance et peut être pleinement utilisée, mais les configurations principales et les composants de gestion restent dans la région d'origine.

Voici où cela devient intéressant — et par intéressant, je veux dire difficile ! Déplacer la région d'origine de votre zone d'atterrissage n'est pas comme changer votre région par défaut dans la console AWS. C'est plus comme essayer de déplacer le siège de votre entreprise vers une nouvelle ville tout en maintenant l'activité en marche. Vous devriez décommissionner et redéployer les services principaux, reconfigurer l'agrégation de journalisation, restructurer les configurations organisationnelles et potentiellement reconstruire les pipelines d'automatisation. Beaucoup de ces services, comme les données de configuration de Control Tower, les journaux d'audit et la gestion d'AWS Organizations, sont étroitement couplés avec la région d'origine.

Illustrons ce qu'impliquerait typiquement le déplacement d'une région d'origine :

* Décommissionner Control Tower dans la région d'origine actuelle
* Reconfigurer les structures de comptes principaux
* Décommissionner et redéployer la configuration d'IAM Identity Center
* Reconstruire les architectures de journalisation et d'audit
* Redéployer les configurations d'automatisation et de pipelines
* Restructurer les configurations de services inter-comptes et inter-régions
* Migrer les données historiques et les archives

C'est pourquoi le choix de votre région d'origine est l'une de ces décisions « mesurez deux fois, coupez une fois ». Nous recommandons de sélectionner une région d'origine qui s'aligne avec votre stratégie géographique à long terme et vos exigences de conformité. Bien que l'extension vers de nouvelles régions soit simple, le déplacement de la région d'origine de votre zone d'atterrissage est une entreprise significative qui nécessite une planification et une exécution minutieuses.

Conseil de pro : lors de la conception de votre zone d'atterrissage, documentez minutieusement les dépendances de votre région d'origine. Même si vous ne prévoyez jamais de la déplacer, comprendre ces relations vous aidera à prendre de meilleures décisions architecturales lors de l'expansion vers de nouvelles régions. N'oubliez pas, le choix de votre région d'origine ne limite pas votre capacité à opérer dans d'autres régions — c'est simplement le centre de contrôle de votre environnement AWS.

## Conclusion

En conclusion, l'extension de votre zone d'atterrissage AWS ou de votre Organisation vers une région nécessite une planification réfléchie et une compréhension globale des comportements régionaux des services AWS. Nous avons couvert les aspects critiques : des contrôles de gouvernance fondamentaux et des services de sécurité aux outils de visibilité opérationnelle et aux considérations relatives aux zones d'atterrissage. N'oubliez pas que bien que certains services comme IAM et CloudTrail adoptent automatiquement les nouvelles régions, d'autres nécessitent une activation et une configuration explicites. Votre parcours d'expansion devrait être guidé par un inventaire de services bien documenté et une compréhension claire des implications de la région d'origine de votre zone d'atterrissage. En suivant ces meilleures pratiques et considérations, vous serez bien équipé pour maintenir une sécurité, une conformité et une excellence opérationnelle cohérentes dans toute votre empreinte AWS en expansion. La clé du succès réside dans une préparation approfondie, la compréhension des exigences spécifiques à chaque service et le maintien d'une fondation de gouvernance solide. À mesure qu'AWS continue de développer son infrastructure mondiale, ces principes serviront de boussole pour vos futures expansions régionales. 
