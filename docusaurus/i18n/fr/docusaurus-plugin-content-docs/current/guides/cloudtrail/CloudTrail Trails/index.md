---
sidebar_position: 2
---
# Pistes CloudTrail

AWS CloudTrail surveille et enregistre l'activite des comptes a travers votre infrastructure AWS pour vous fournir le controle sur le stockage, l'analyse et les actions de remediation. Une piste est une configuration qui aide a livrer les evenements CloudTrail vers un compartiment Amazon Simple Storage Service (Amazon S3) que vous specifiez.

CloudTrail offre trois types de pistes pour la surveillance et l'enregistrement de l'activite des comptes dans votre infrastructure AWS. Le premier type est une piste multi-regions qui capture l'activite de toutes les regions AWS. Par defaut, lors de la creation d'une piste via la console de gestion AWS, elle s'applique a toutes les regions. Le deuxieme type est une piste mono-region, disponible exclusivement dans l'AWS CLI, qui capture l'activite dans une region specifique. Cependant, nous recommandons d'utiliser des pistes multi-regions pour une couverture plus large.

Enfin, il y a la piste organisationnelle qui s'applique a tous les comptes AWS au sein de votre organisation lors de l'utilisation du service AWS Organizations. Ce type de piste fournit une couverture complete et une surveillance centralisee dans un environnement multi-comptes.

En utilisant ces types de pistes, vous pouvez adapter votre configuration CloudTrail pour repondre a vos exigences de surveillance et d'enregistrement. Vous pouvez le faire au niveau regional ou a travers votre organisation entiere. Voici quelques bonnes pratiques pour les pistes CloudTrail.

### Configurer CloudTrail dans tous les comptes et regions AWS

Pour obtenir un enregistrement complet des evenements effectues par un utilisateur, un role ou un service dans les comptes AWS, configurez chaque piste pour journaliser les evenements dans toutes les regions AWS. Configurez ces pistes dans chaque compte AWS utilise par votre entreprise ou organisation. Cette configuration garantit que chaque evenement est journalise, quelle que soit la region AWS ou l'evenement s'est produit. En consequence, vous pouvez detecter une activite inattendue dans des regions autrement inutilisees. Les evenements de service globaux (par exemple, AWS Identity and Access Management et Amazon Route 53) sont egalement inclus et journalises. Si vous creez une piste qui s'applique a toutes les regions, toute nouvelle region AWS est incluse automatiquement. Si vous avez une configuration multi-comptes via AWS Organizations, vous pouvez creer une piste qui journalise tous les evenements pour tous les comptes AWS de cette organisation.

### Configurer des pistes separees pour differents cas d'utilisation

CloudTrail prend en charge des cas d'utilisation tels que l'audit, la surveillance de securite et la resolution de problemes operationnels. AWS recommande de configurer plusieurs pistes pour chaque cas d'utilisation afin de fournir a chaque equipe les connaissances dont elle a besoin. Pour ce faire, creez des pistes pour differents utilisateurs a gerer. Les pistes peuvent etre configurees pour livrer les fichiers journaux vers des compartiments S3 separes. Par exemple, un administrateur de securite peut creer une piste qui s'applique a toutes les regions et chiffrer les fichiers journaux avec une cle AWS Key Management Service (AWS KMS), et activer la validation des fichiers journaux. Un developpeur de la meme entreprise peut creer une piste qui s'applique a une seule region et configurer des alarmes Amazon CloudWatch pour recevoir des notifications d'activite API specifique.

### Configurer la livraison des journaux CloudTrail vers un compartiment S3 dans une frontiere de securite separee avec acces limite (un compte AWS separe)

A des fins d'audit, lorsque vous stockez les fichiers journaux dans un compartiment S3 dedie dans un domaine administratif separe, vous pouvez appliquer des controles de securite stricts et une segregation des taches. La restriction de l'acces a ce compartiment S3 diminuera les chances d'acces non autorise et illimite aux journaux. Lorsque vous avez ces controles en place, si des identifiants de compte AWS sont compromis, les journaux ne seront pas perdus car ils sont stockes dans un domaine separe.

### Activer la suppression MFA et le versionnage sur le compartiment Amazon S3 stockant les fichiers journaux

Avec l'authentification multi-facteurs (MFA) configuree sur ce compartiment S3, vous pouvez vous assurer qu'une authentification supplementaire est requise pour supprimer definitivement le compartiment ou un objet dans le compartiment. En plus de la MFA, les compartiments avec versionnage active peuvent vous aider a recuperer des objets d'une suppression ou d'un ecrasement accidentel. Par exemple, si vous supprimez un objet, Amazon S3 insere un marqueur de suppression au lieu de supprimer definitivement l'objet. Meme si la plupart des utilisateurs et administrateurs AWS n'ont aucune intention malveillante, quelqu'un pourrait accidentellement supprimer un compartiment S3 qui stocke des fichiers journaux critiques. Lorsque vous ajoutez ces protections, vous pouvez diminuer le risque de fichiers journaux compromis.

### Activer la validation de l'integrite des fichiers journaux CloudTrail

La validation de l'integrite des fichiers journaux CloudTrail vous permet de savoir si un fichier journal a ete supprime ou modifie. Vous pouvez egalement utiliser cette validation pour confirmer qu'aucun fichier journal n'a ete livre a votre compte pendant une periode donnee. Ces informations sont precieuses dans les investigations de securite et medico-legales. Elles fournissent une couche de protection supplementaire pour assurer l'integrite des fichiers journaux. La validation de l'integrite des fichiers journaux CloudTrail utilise des algorithmes standards de l'industrie : SHA-256 pour le hachage et SHA-256 avec RSA pour la signature numerique, ce qui rend informatiquement irrealisable la modification des fichiers journaux sans detection.

### Chiffrer les fichiers journaux CloudTrail au repos

Par defaut, les fichiers journaux livres par CloudTrail a votre compartiment sont chiffres par le chiffrement cote serveur Amazon avec des cles de chiffrement gerees par Amazon S3 (SSE-S3). Pour fournir une couche de securite directement gerable, vous pouvez plutot utiliser le chiffrement cote serveur avec des cles gerees par AWS KMS (SSE-KMS) pour vos fichiers journaux CloudTrail.

### Activer les evenements de donnees pour les pistes

Les evenements de donnees offrent une visibilite sur les operations de ressources effectuees sur ou dans S3 et AWS Lambda. Ces evenements sont egalement connus sous le nom d'operations du plan de donnees. Les evenements de donnees sont souvent des activites a volume eleve, surtout si vous stockez des donnees sensibles sur S3 ou si vous avez des operations commerciales cles effectuees via des fonctions Lambda. La visibilite sur tout acces inattendu aux donnees sensibles vous permet de prendre des mesures correctives pour proteger vos donnees. Parce que certains rapports de conformite (par exemple, FedRAMP et PCI-DSS) necessitent que les evenements de donnees soient actives, AWS recommande d'utiliser les regles gerees AWS Config ou un modele de Conformance Pack appropriate pour verifier qu'au moins une piste enregistre les evenements de donnees S3 pour tous les compartiments S3.

### Utiliser les selecteurs d'evenements avances avec les evenements de donnees

Lorsque vous utilisez des evenements de donnees, les selecteurs d'evenements avances offrent un controle plus granulaire de la journalisation des evenements de donnees. Avec les selecteurs d'evenements avances, vous pouvez inclure ou exclure des valeurs sur des champs tels que EventSource, EventName et ResourceARN. Les selecteurs d'evenements avances prennent egalement en charge l'inclusion ou l'exclusion de valeurs avec correspondance de motifs sur des chaines partielles, similaire aux expressions regulieres. Cela fournit plus de controle sur les evenements de donnees CloudTrail que vous souhaitez journaliser et payer. Par exemple, vous pouvez journaliser les API S3 DeleteObject pour limiter les evenements CloudTrail que vous recevez aux seules actions destructives afin d'identifier les problemes de securite tout en controlant les couts. Gardez a l'esprit que lorsque vous utilisez CloudTrail pour l'audit, c'est une bonne pratique d'enregistrer tous les evenements de donnees. Cependant, lorsque vous utilisez des evenements de donnees pour la surveillance operationnelle ou d'autres cas d'utilisation, les selecteurs d'evenements avances peuvent etre tres utiles.

### Integrer CloudTrail avec Amazon CloudWatch Logs

Amazon CloudWatch vous aide a collecter des donnees de surveillance et operationnelles sous forme de journaux, metriques et evenements. Lorsque vous integrez CloudTrail avec CloudWatch Logs, vous pouvez surveiller et recevoir des alertes pour des evenements specifiques captures par CloudTrail en quasi-temps reel. Par exemple, vous pouvez configurer des alarmes et des notifications pour une activite API AWS anormale.

Lorsque vous integrez CloudTrail avec CloudWatch Logs, vous pouvez egalement visualiser les donnees produites par CloudWatch Insights. Ces informations vous permettent d'extraire les donnees dont vous avez besoin, ce qui simplifie le processus d'interrogation. Par exemple, vous pouvez utiliser CloudWatch Logs pour diffuser les journaux vers Amazon Elasticsearch Service en quasi-temps reel, puis acceder au point de terminaison Kibana pour visualiser les donnees.

### Appliquer les pistes a toutes les regions
Pour capturer toutes les actions effectuees par une identite IAM ou un service dans votre compte AWS, configurez chaque piste pour journaliser les evenements dans toutes les regions. En journalisant les evenements dans toutes les regions, vous vous assurez que tous les evenements qui se produisent dans votre compte AWS sont journalises, quelle que soit la region dans laquelle ils se produisent.

### Livrer les journaux CloudTrail vers un compartiment S3 central
Configurez la livraison des journaux CloudTrail vers un compartiment S3 central dans un compte AWS separe avec acces limite. Vous pouvez definir une politique d'acces Amazon S3 pour limiter les permissions de qui peut acceder aux journaux livres par CloudTrail. Cela peut aider a minimiser l'acces non autorise aux journaux.

### Configurer la protection des donnees sur le compartiment S3 stockant les fichiers journaux
Pour ce faire, effectuez les actions suivantes :

*   Activez l'authentification multi-facteurs (MFA) pour ajouter un niveau de securite supplementaire au compartiment S3. La MFA necessite deux formes d'authentification pour toute demande de suppression du compartiment ou des objets dans le compartiment.
*   Activez le versionnage sur le compartiment S3 pour aider a recuperer les objets des suppressions ou modifications non souhaitees. L'ajout de cette couche de protection supplementaire peut aider a reduire le risque de modifications de vos fichiers.
*   Activez le chiffrement pour les fichiers journaux CloudTrail pour ajouter une protection supplementaire pour chiffrer les fichiers journaux livres a votre compartiment S3.
*   Configurez la validation des fichiers journaux pour vous assurer que les fichiers journaux livres par CloudTrail n'ont pas change apres leur livraison.

### Configurer la gestion du cycle de vie des objets sur le compartiment S3
La piste CloudTrail stocke par defaut les fichiers journaux indefiniment dans le compartiment S3 configure pour la piste. Vous pouvez utiliser les regles de gestion du cycle de vie des objets Amazon S3 pour definir votre propre politique de retention afin de mieux repondre a vos besoins commerciaux et d'audit. Par exemple, vous pourriez vouloir archiver les fichiers journaux de plus d'un an vers un niveau de stockage different comme Amazon Simple Storage Service Glacier (Amazon S3 Glacier). Un autre exemple est de supprimer les fichiers journaux apres qu'un certain temps se soit ecoule.

### Limiter l'acces a la politique AWSCloudTrail_FullAccess
Voici quelques raisons de limiter l'acces a cette politique :

*   Les utilisateurs avec la politique AWSCloudTrail_FullAccess peuvent desactiver ou reconfigurer les fonctions d'audit critiques et significatives dans leurs comptes AWS.
*   Cette politique n'est pas destinee a etre partagee ou appliquee largement aux identites IAM dans votre compte AWS. Limitez l'application de cette politique aux individus que vous attendez a agir en tant qu'administrateurs de compte AWS.
