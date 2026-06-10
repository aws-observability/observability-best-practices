---
sidebar_position: 4
---
# Evenements de donnees CloudTrail

Selon les bonnes pratiques AWS CloudTrail, vous devriez enregistrer les evenements de donnees pour les charges de travail sensibles en matiere de securite au niveau d'une piste multi-regions. Pour les charges de travail avec des exigences de conformite intensives, nous recommandons d'activer les evenements de donnees pour auditer l'activite au niveau des ressources. La journalisation des evenements de donnees offre la capacite d'auditer au niveau des donnees, y compris les modifications a l'interieur de la ressource pour laquelle vous activez la visibilite.

CloudTrail aide en fournissant une observabilite supplementaire et prend en charge les evenements de donnees pour une grande variete de services. Ces evenements de donnees peuvent etre utilises pour vous aider a atteindre vos objectifs critiques de conformite, de gestion des risques et de securite. Quelques exemples de ces types d'evenements incluent les activites API au niveau des objets telles que supprimer, mettre a jour et ajouter des elements. Des exemples de la visibilite amelioree fournie par les evenements de donnees CloudTrail incluent l'activite API sur un alias d'agent ou une base de connaissances dans Amazon Bedrock, l'activite sur une application ou une source de donnees dans Amazon Q Business, ou l'activite API SageMaker sur un magasin de fonctionnalites. Ceux-ci offrent des avantages cles en matiere de gestion des risques tels que :

* Surveillance de l'acces aux donnees personnelles et aux informations sensibles
* Visibilite sur les modifications des donnees personnelles et des donnees sensibles
* Audit des activites dans les applications qui traitent des donnees personnelles et des informations sensibles
* Detection de violations de donnees potentielles et d'incidents de confidentialite
* Facilitation des audits de confidentialite et des rapports de conformite

### Selecteurs d'evenements avances pour les evenements de donnees
Lorsque vous utilisez des evenements de donnees, les selecteurs d'evenements avances offrent un plus grand controle sur les evenements CloudTrail ingeres dans vos magasins de donnees d'evenements. Avec les selecteurs d'evenements avances, vous pouvez inclure ou exclure des valeurs sur des champs tels que EventSource, EventName, userIdentity.arn et ResourceARN. Les selecteurs d'evenements avances prennent egalement en charge l'inclusion ou l'exclusion de valeurs avec correspondance de motifs sur des chaines partielles. Cela augmente l'efficacite et la precision de vos investigations de securite, de conformite et operationnelles tout en aidant a reduire les couts. Par exemple, vous pouvez filtrer les evenements CloudTrail en fonction de l'attribut userIdentity.arn pour exclure les evenements generes par des roles ou utilisateurs IAM specifiques. Vous pouvez exclure un role IAM dedie utilise par un service qui effectue des appels API frequents a des fins de surveillance. Cela vous permet de reduire significativement le volume d'evenements CloudTrail ingeres dans CloudTrail Lake, diminuant les couts tout en maintenant la visibilite sur les activites pertinentes des utilisateurs et du systeme.

![Evenements de donnees CloudTrail Lake](/img/cloudops/guides/cloudtrail-lake/cloudtrail-data-events-advanced-selector.png "Selecteurs d'evenements avances pour les evenements de donnees")

### **Specifique a la charge de travail**

Les sections suivantes fourniront quelques bonnes pratiques sur la surveillance et l'audit de charges de travail specifiques en utilisant les types de ressources disponibles pour les pistes et les magasins de donnees d'evenements. Par exemple, lors de la journalisation des evenements de donnees pour Amazon S3, vous voudriez capturer les operations API `PutObject` pour enregistrer toutes les operations au niveau des ressources effectuees sur les objets Amazon S3. Cela fournirait une visibilite sur les actions effectuees au niveau des ressources pour les objets Amazon S3.

### **Amazon SNS et Amazon SQS**

Selon les bonnes pratiques de securite d'Amazon SNS et d'Amazon SQS, il est recommande d'envisager l'utilisation de points de terminaison VPC pour acceder a Amazon SNS et Amazon SQS. Par exemple, si vous avez des sujets Amazon SNS ou des files Amazon SQS avec lesquels vous devez pouvoir interagir, mais qui ne doivent absolument pas etre exposes a Internet, l'utilisation de points de terminaison VPC pour controler l'acces uniquement aux hotes au sein d'un VPC particulier pour publier ou envoyer des messages a un sujet Amazon SNS ou une file Amazon SQS.

En activant les evenements de donnees pour Amazon SNS dans CloudTrail, vous pourrez auditer les actions API `Publish` et `PublishBatch` pour tous vos sujets Amazon SNS. De meme, pour les [evenements de donnees pour Amazon SQS](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-logging-using-cloudtrail.html#sqs-data-events-in-cloud-trail), assurez-vous que l'action API `SendMessage` audite que les points de terminaison VPC sont utilises lors de l'envoi de messages aux files Amazon SQS depuis des instances au sein de votre VPC, sans traverser Internet.

La requete ci-dessous affichera les actions API pour les evenements [Publish](https://docs.aws.amazon.com/sns/latest/api/API_Publish.html) d'Amazon SNS, indiquant que des messages etaient publies sur un sujet Amazon SNS. Les resultats montreront egalement quelle entite [IAM](https://aws.amazon.com/iam/) a effectue cette action et l'identifiant specifique du point de terminaison VPC par lequel le message a ete envoye. Cependant, s'il n'y a pas d'identifiant de point de terminaison VPC, l'appel API Publish a ete effectue sans utiliser un point de terminaison VPC.

#### Requete SQL :

```
SELECT eventTime,
    substr(userIdentity.arn, strpos(userIdentity.arn, '/') +1) as IAM, 
    recipientAccountId, 
    awsRegion, 
    eventName,sourceIPAddress, 
    substr(element_At(requestParameters, 'topicArn'), 
    strpos(element_At(requestParameters, 'topicArn'), '.com/') +18) as Topic, 
    vpcEndpointId
FROM $EDS_ID
    WHERE eventSource = 'sns.amazonaws.com'
    AND eventName = 'Publish'
    AND eventtime >= '2024-06-24 00:00:00'
    AND eventtime <= '2024-06-24 23:59:59'
```

De maniere similaire a ce qui a ete montre pour la requete Amazon SNS, la requete ci-dessous affichera les actions API pour les evenements [SendMessage](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/APIReference/API_SendMessage.html) d'Amazon SQS, indiquant que des messages etaient envoyes a une file Amazon SQS specifique. Ces resultats montreront egalement quelle entite [IAM](https://aws.amazon.com/iam/) a effectue l'action et l'identifiant specifique du point de terminaison VPC vers lequel le message a ete envoye.

#### Requete SQL :

```
SELECT eventTime, 
    substr(userIdentity.arn, strpos(userIdentity.arn, '/') +1) as IAM, 
    recipientAccountId, 
    awsRegion, 
    eventName,sourceIPAddress, 
    substr(element_At(requestParameters, 'queueUrl'), 
    strpos(element_At(requestParameters, 'queueUrl'), '.com/') +18) as Queue, 
    vpcEndpointId
FROM $EDS_ID
WHERE eventSource = 'sqs.amazonaws.com'
    AND eventName = 'SendMessage'
    AND eventtime >= '2024-06-24 00:00:00'
    AND eventtime <= '2024-06-24 23:59:59'
```

### Amazon Q for Business

Pour les charges de travail Amazon Q for Business, vous pouvez configurer les evenements de donnees pour **AWS::QBusiness::Application** et **AWS::S3::Object**. **AWS::QBusiness::Application** journalise les activites du plan de donnees liees a votre application Amazon Q Business et **AWS::S3::Object** enregistre les evenements de donnees pour le compartiment Amazon S3 source. Une fois les evenements de donnees configures pour votre piste ou magasin de donnees d'evenements, les evenements commenceront a etre generes pour Amazon Q Business et Amazon S3.

La requete ci-dessous affichera les appels API a [BatchDeleteDocument](https://docs.aws.amazon.com/amazonq/latest/api-reference/API_BatchDeleteDocument.html) indiquant la suppression d'un ou plusieurs documents qui etaient utilises dans notre application Amazon Q Business.

#### Requete SQL :

```
SELECT
    eventName, COUNT(*) AS numberOfCallsFROM
<event-data-store-ID>
WHERE
    eventSource='qbusiness.amazonaws.com' AND eventTime > date_add('day', -1, now())
Group
BY eventName ORDER BY COUNT(*) DESC
```

La requete ci-dessous aidera a trouver l'identite IAM associee a l'appel API BatchDeleteDocument.

#### Requete SQL :

```
SELECT
 sourceIPAddress, eventTime, userIdentity.principalid
 FROM
 <event-data-store-ID>
 WHERE
 eventName='BatchDeleteDocument' AND eventTime > date_add('day', -1, now())
```

La requete ci-dessous identifie quel travail a declenche la synchronisation de la source de donnees S3 avec les applications Amazon Q Business en recherchant l'appel API StartDataSourceSyncJob.

#### Requete SQL :

```
SELECT
 sourceIPAddress, eventTime, userIdentity.arn AS user
 FROM
 <event-data-store-ID>
 WHERE
 eventName='StartDataSourceSyncJob' AND eventTime > date_add('day', -1, now())
```

La requete suivante montrera si des objets ont ete supprimes du compartiment S3 connecte comme source de donnees a notre application Q Business en verifiant l'evenement API DeleteObject :

#### Requete SQL :

```
SELECT
 sourceIPAddress, eventTime, userIdentity.arn AS user
 FROM
 <event-data-store-ID>
 WHERE
 userIdentity.arn IS NOT NULL AND eventName='DeleteObject'
 AND element_at(requestParameters, 'bucketName') like '<enter-S3-bucket-name>'
 AND eventTime > '[2024-05-09 00](tel:2024050900):00:00'
```

### Amazon Q Developer

L'un des evenements que vous pouvez suivre en utilisant les evenements de donnees pour Amazon Q Developer est **'StartCodeAnalysis'**, qui suit les analyses de securite effectuees par Amazon Q Developer pour les IDE VS Code et JetBrains.

La requete ci-dessous recuperera une liste de tous les utilisateurs qui ont initie une analyse de securite. Cela aidera a identifier quels utilisateurs utilisent Amazon Q Developer pour analyser le code au sein de votre organisation et determiner la source de leurs requetes.

```
SELECT
userIdentity.onbehalfof.userid, eventTime, SourceIPAddress
FROM
    <event-data-store-ID>
WHERE
    eventName = 'StartCodeAnalysis'
```

### Amazon Bedrock

Les evenements de donnees CloudTrail pour Amazon Bedrock suivent les evenements API pour Agents for Bedrock et les bases de connaissances Amazon Bedrock a travers les actions de type de ressource 'AWS::Bedrock::AgentAlias' et 'AWS::Bedrock::KnowledgeBase'.

Par exemple, si l'administrateur d'une application de chat souhaite auditer les evenements lies a l'invocation des agents Bedrock, il peut utiliser la requete suivante, qui aidera a determiner les details sur les parametres de [requete](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_agent-runtime_InvokeAgent.html#API_agent-runtime_InvokeAgent_RequestSyntax) et de [reponse](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_agent-runtime_InvokeAgent.html#API_agent-runtime_InvokeAgent_ResponseSyntax) envoyes avec l'alias d'agent invoque.

```
SELECT
UserIdentity,eventTime,eventName,UserAgent,requestParameters,resourcesFROM
<event-data-store-ID>
WHERE
    eventName = 'InvokeAgent'
```

De plus, la requete ci-dessous fournira des details sur la base de connaissances invoquee, ainsi que les parametres de requete et de reponse retournes :

```
SELECT
UserIdentity,eventTime,eventName,UserAgent,requestParameters,resourcesFROM
<event-data-store-ID>
WHERE
    eventName = 'RetrieveAndGenerate'
```
