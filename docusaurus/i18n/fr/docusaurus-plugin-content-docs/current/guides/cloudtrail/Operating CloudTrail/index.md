---
sidebar_position: 1
---
# Exploiter CloudTrail

AWS CloudTrail peut journaliser, surveiller en continu et conserver l'activite des comptes liee aux actions a travers votre infrastructure AWS. Il vous fournira egalement un historique des appels AWS pour votre compte, y compris les appels API effectues via la console de gestion AWS, les SDK AWS et les outils en ligne de commande. En consequence, vous pouvez identifier :

*   Quels utilisateurs et comptes ont appele les API AWS pour les services qui prennent en charge CloudTrail.
*   L'adresse IP source a partir de laquelle les appels ont ete effectues.
*   Quand les appels ont eu lieu.

CloudTrail est active sur votre compte AWS lors de sa creation et fournit un historique d'evenements de toutes les activites d'evenements de gestion des 90 derniers jours. AWS recommande de creer une piste ou un magasin de donnees d'evenements pour Lake afin de conserver les evenements pendant plus de 90 jours dans votre environnement AWS. Ce qui suit presente quelques bonnes pratiques globales pour CloudTrail, puis les sections suivantes fourniront des bonnes pratiques pour des domaines specifiques de CloudTrail tels que CloudTrail Trails et CloudTrail Lake.

### Enregistrer le compte de securite ou de journalisation comme administrateur delegue pour CloudTrail
CloudTrail permet de configurer jusqu'a 3 administrateurs delegues pour gerer les pistes et les magasins de donnees d'evenements Lake de l'organisation. Un administrateur delegue a la permission de gerer les ressources au nom de l'organisation. Le support des administrateurs delegues offre de la flexibilite aux clients en permettant au compte de gestion de deleguer les actions administratives CloudTrail a un compte membre de l'organisation, tel qu'un compte de securite ou de journalisation.

Avec cette fonctionnalite, le compte de gestion d'une organisation reste le proprietaire de toutes les ressources organisationnelles CloudTrail, meme lorsque ces pistes d'organisation ou ces ressources de magasin de donnees d'evenements CloudTrail Lake sont creees et gerees via le compte administrateur delegue. Cela aide les clients a maintenir la continuite des journaux d'audit CloudTrail a l'echelle de l'organisation tout en evitant toute perturbation lorsque des changements sont apportes a leur organisation dans AWS Organizations. En utilisant un administrateur delegue pour CloudTrail, cela aide a minimiser les utilisateurs utilisant le compte de gestion pour les taches administratives liees a CloudTrail, ce qui ameliore votre posture de securite et de conformite.

### Utiliser CloudTrail Insights pour surveiller l'activite API anormale

AWS CloudTrail Insights aide les utilisateurs AWS a identifier et repondre a une activite inhabituelle associee aux appels API en analysant en continu les evenements de gestion CloudTrail. Si vous avez active CloudTrail Insights et que CloudTrail detecte une activite inhabituelle, les evenements Insights sont livres au compartiment S3 de destination pour votre piste ou au magasin de donnees d'evenements pour CloudTrail Lake. Vous pouvez egalement voir le type d'insight et la periode de l'incident. Contrairement aux autres types d'evenements captures dans une piste, les evenements Insights ne sont journalises que lorsque CloudTrail detecte des changements dans l'utilisation des API de votre compte qui different significativement des modeles d'utilisation typiques du compte. CloudTrail Insights s'integre avec EventBridge, vous permettant de creer des regles pour declencher des actions specifiques basees sur des criteres tels que l'envoi d'une notification par e-mail ou le declenchement d'une fonction Lambda. En consequence, vous pouvez vous assurer que vos equipes restent informees de toute activite API inhabituelle.

![CloudTrail Insights](/img/cloudops/guides/cloudtrail/cloudtrail-insights.png "CloudTrail Insights")

### Gerer les couts CloudTrail
Lors de l'utilisation de CloudTrail, n'oubliez pas de considerer les domaines qui vous aideront a gerer vos depenses CloudTrail. Voici quelques bonnes pratiques pour aider a controler les couts de CloudTrail.

-   **AWS Budgets** : AWS Budgets vous aide a suivre vos depenses CloudTrail. Vous pouvez configurer un budget base sur les couts dans AWS Budgets base sur le service CloudTrail. Vous pouvez egalement configurer des alertes de budget pour vous notifier lorsque vous atteignez un certain seuil de budget par e-mail ou AWS Chatbot.

![AWS Budgets](/img/cloudops/guides/cloudtrail/cloudtrail-budgets.png "AWS Budgets")

-   **AWS Cost Anomaly Detection** : AWS Cost Anomaly Detection vous aide a identifier et resoudre les pics inattendus dans vos depenses AWS a travers votre organisation. Vous pouvez creer un moniteur pour le service AWS CloudTrail afin de suivre vos depenses. Le service utilise l'apprentissage automatique pour analyser les donnees historiques afin de calculer les depenses quotidiennes attendues et les compare aux depenses reelles. Lorsque vos depenses CloudTrail reelles depassent le montant attendu au-dela d'un certain seuil, il identifie cela comme une anomalie et effectue une analyse des causes racines. Vous pouvez alors agir rapidement si AWS Cost Anomaly Detection detecte des anomalies liees a vos depenses CloudTrail.

-   **Utiliser les cles de compartiment Amazon S3 pour reduire le cout associe au SSE-KMS pour le compartiment S3 CloudTrail** : Lors de l'utilisation de cles au niveau des objets pour le chiffrement cote serveur Amazon S3 avec AWS KMS (SSE-KMS), vous devriez envisager de passer aux cles de compartiment Amazon S3 pour aider a reduire les couts de requetes AWS KMS jusqu'a 99 % en diminuant le trafic de requetes d'Amazon S3 vers AWS KMS. Cela reduit egalement significativement le volume d'evenements journalises dans CloudTrail, aidant a reduire les frais CloudTrail. Quelques avantages supplementaires de l'utilisation des cles de compartiment S3 :
    *   **Gestion simplifiee :** Les cles au niveau du compartiment sont plus faciles a gerer par rapport aux cles individuelles au niveau des objets.
    *   **Amelioration des performances** : La reduction des appels API vers KMS peut entrainer une amelioration des performances pour les operations impliquant des objets chiffres.
    *   **Mise en oeuvre facile :** Les cles de compartiment S3 peuvent etre activees en quelques clics dans la console de gestion AWS sans necessiter de modifications des applications clientes.

-   **Pistes multiples** : La premiere copie des evenements de gestion pour un compte est incluse dans le niveau gratuit AWS. Si vous creez des pistes supplementaires qui livrent les memes evenements de gestion, ces livraisons subsequentes entrainent des couts CloudTrail supplementaires. Si vous avez besoin de plusieurs pistes, les recommandations suivantes peuvent aider a reduire le cout des pistes supplementaires pour CloudTrail :

    *   **CloudTrail Lake** : Utilisez CloudTrail Lake pour ingerer les copies supplementaires de vos evenements de gestion. L'utilisation de CloudTrail Lake peut reduire vos frais globaux jusqu'a 90 % pour les copies supplementaires d'evenements de gestion.
    
    *   **Exclure les evenements AWS Key Management Service (AWS KMS) et Amazon Relational Database Service (Amazon RDS) Data API** : Pour toute copie supplementaire d'evenements de gestion, il est recommande d'exclure egalement les evenements AWS Key Management Service (AWS KMS) et Amazon Relational Database Service (Amazon RDS) Data API. Puisque vous n'avez peut-etre pas besoin de plus d'une copie de ces evenements. Ces evenements a volume eleve peuvent generer des couts importants et peuvent etre exclus dans vos pages de pistes ou de magasins de donnees d'evenements sous les filtres de gestion.

-   **Selecteurs d'evenements avances pour les evenements de donnees** : Lorsque vous utilisez des evenements de donnees, les selecteurs d'evenements avances peuvent offrir un controle granulaire de la journalisation des evenements de donnees. Les selecteurs d'evenements avances prennent egalement en charge l'inclusion ou l'exclusion de valeurs avec correspondance de motifs sur des chaines partielles. Cela fournit un controle ameliore sur les evenements de donnees CloudTrail que vous souhaitez journaliser et payer. Par exemple, vous pouvez journaliser les API Amazon S3 DeleteObject pour limiter les evenements CloudTrail que vous recevez aux seules actions destructives. Cela peut aider a identifier les problemes de securite tout en controlant les couts.
