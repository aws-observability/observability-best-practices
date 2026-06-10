---
sidebar_position: 14
---
# Selecteurs d'evenements avances

### Comprendre les selecteurs d'evenements avances

Les selecteurs d'evenements avances dans AWS CloudTrail fournissent un controle granulaire sur les evenements de donnees enregistres en definissant des criteres de selection specifiques en utilisant des conditions basees sur des champs avec des operateurs comme equals, not equals, starts with et ends with. Cette approche granulaire permet aux organisations de capturer uniquement les evenements de donnees pertinents pour leurs exigences de securite, de conformite et operationnelles tout en reduisant les couts associes a une journalisation excessive des evenements.

Les selecteurs d'evenements avances sont constitues de selecteurs de champs, d'operateurs et de valeurs. Chaque selecteur contient un tableau de selecteurs de champs qui definissent les criteres de selection, chaque selecteur de champ specifiant un nom de champ (tel que eventCategory, eventName ou resources.type), un operateur (Equals, NotEquals, StartsWith, EndsWith) et une ou plusieurs valeurs avec lesquelles comparer. La relation entre plusieurs selecteurs de champs au sein d'un seul selecteur d'evenements avance est un AND logique, ce qui signifie que toutes les conditions doivent etre remplies pour qu'un evenement soit enregistre.

![Selecteurs d'evenements avances CloudTrail](/img/cloudops/guides/cloudtrail-lake/cloudtrail-data-events-advanced-selector.png "Selecteurs d'evenements avances pour les evenements de donnees")

### Champs et operateurs pris en charge

Les selecteurs d'evenements avances CloudTrail prennent en charge un ensemble complet de champs qui couvrent tous les aspects des appels API AWS pour les evenements de donnees. Les champs principaux incluent eventName pour les operations API specifiques, resources.type pour les types de ressources AWS, resources.ARN pour les identifiants de ressources specifiques et readOnly pour distinguer entre les operations de lecture et d'ecriture. Chaque champ prend en charge des operateurs specifiques : Equals et NotEquals fonctionnent avec des correspondances exactes, tandis que StartsWith et EndsWith permettent une selection basee sur des motifs. La comprehension de ces combinaisons est cruciale pour creer des strategies de selection efficaces.

Ce qui suit fournira des exemples sur la facon dont les selecteurs d'evenements avances peuvent etre utilises pour selectionner des evenements de donnees specifiques lies a vos ressources AWS.

### Amazon S3

#### Selecteur d'operations d'ecriture critiques

Ce selecteur se concentre sur les operations S3 a haut risque qui pourraient indiquer une exfiltration de donnees, des modifications non autorisees ou des violations de conformite. En enregistrant uniquement les operations d'ecriture sur les compartiments sensibles, les organisations peuvent detecter les activites malveillantes tout en reduisant le volume de journaux des evenements S3. Cette approche est essentielle pour maintenir la visibilite de securite sans submerger les equipes de securite avec les operations de lecture de routine.

```json
[
  {
    "FieldSelectors": [
      {
        "Field": "eventCategory",
        "Equals": ["Data"]
      },
      {
        "Field": "resources.type",
        "Equals": ["AWS::S3::Object"]
      },
      {
        "Field": "eventName",
        "Equals": ["DeleteObject", "PutObject", "RestoreObject"]
      },
      {
        "Field": "resources.ARN",
        "StartsWith": ["arn:aws:s3:::sensitive-bucket/", "arn:aws:s3:::compliance-bucket/"]
      }
    ]
  }
]
```

### Surveillance des fonctions AWS Lambda

#### Selecteur d'invocation de fonctions de production

La surveillance des invocations Lambda est cruciale pour detecter l'execution non autorisee de fonctions et les modeles d'acces inhabituels. Ce selecteur cible les fonctions Lambda qui commencent par les modeles de denomination pour les fonctions de production et critiques tout en excluant les environnements de denomination de developpement, reduisant le bruit et se concentrant sur les activites critiques pour l'entreprise. La selection ARN basee sur les motifs couvre automatiquement les nouvelles fonctions qui suivent les conventions de denomination, fournissant une surveillance de securite evolutive.

```json
[
  {
    "FieldSelectors": [
      {
        "Field": "eventCategory",
        "Equals": ["Data"]
      },
      {
        "Field": "resources.type",
        "Equals": ["AWS::Lambda::Function"]
      },
      {
        "Field": "eventName",
        "Equals": ["Invoke"]
      },
      {
        "Field": "resources.ARN",
        "StartsWith": ["arn:aws:lambda:us-east-1:123456789012:function:prod-", "arn:aws:lambda:us-east-1:123456789012:function:critical-"]
      }
    ]
  }
]
```

### Operations sur les tables DynamoDB

#### Selecteur d'operations d'ecriture et de tables sensibles

DynamoDB genere des volumes eleves d'evenements, rendant la selection selective des evenements essentielle pour le controle des couts et la concentration sur la securite. Ces selecteurs capturent les evenements de modification de donnees qui pourraient indiquer un acces non autorise ou une falsification de donnees tout en excluant les operations de lecture de routine. L'approche combinee dans l'exemple suivant permet l'enregistrement d'operations d'ecriture specifiques pour des tables specifiques et de toutes les operations sur les tables sensibles definies, fournissant une couverture complete sans couts excessifs.

```json
[
  {
    "FieldSelectors": [
      {
        "Field": "eventCategory",
        "Equals": ["Data"]
      },
      {
        "Field": "resources.type",
        "Equals": ["AWS::DynamoDB::Table"]
      },
      {
        "Field": "eventName",
        "Equals": ["PutItem", "UpdateItem", "DeleteItem", "BatchWriteItem"]
      },
      {
        "Field": "resources.ARN",
        "Equals": ["arn:aws:dynamodb:us-east-1:123456789012:table/UserData"]
      }
    ]
  },
  {
    "FieldSelectors": [
      {
        "Field": "eventCategory",
        "Equals": ["Data"]
      },
      {
        "Field": "resources.type",
        "Equals": ["AWS::DynamoDB::Table"]
      },
      {
        "Field": "resources.ARN",
        "StartsWith": ["arn:aws:dynamodb:us-east-1:123456789012:table/Financial"]
      }
    ]
  }
]
```

### Surveillance des files Amazon SQS

#### Selecteur d'operations administratives

Les operations administratives SQS peuvent representer un certain risque de securite car elles peuvent perturber le flux de messages et modifier les permissions des files. Cet exemple de selecteur se concentre sur les activites de gestion des files qui pourraient indiquer des tentatives d'escalade de privileges ou de perturbation de service. En excluant les operations de messages a volume eleve, cette approche reduit les couts de journalisation tout en maintenant la visibilite sur les changements administratifs pertinents pour la securite.

```json
[
  {
    "FieldSelectors": [
      {
        "Field": "eventCategory",
        "Equals": ["Data"]
      },
      {
        "Field": "resources.type",
        "Equals": ["AWS::SQS::Queue"]
      },
      {
        "Field": "eventName",
        "Equals": ["CreateQueue", "DeleteQueue", "SetQueueAttributes", "AddPermission", "RemovePermission"]
      }
    ]
  }
]
```

### Operations sur les sujets Amazon SNS

#### Selecteur de gestion de sujets et de sujets critiques

La surveillance SNS necessite d'equilibrer la supervision administrative avec la visibilite du flux de messages pour les sujets critiques. Ces selecteurs capturent les operations de gestion de sujets qui pourraient affecter la livraison des notifications et surveillent toutes les activites sur les sujets sensibles en matiere de securite. L'approche multi-selecteur permet une surveillance complete des canaux de communication critiques tout en reduisant le volume global de journaux via une selection selective de sujets.

```json
[
  {
    "FieldSelectors": [
      {
        "Field": "eventCategory",
        "Equals": ["Data"]
      },
      {
        "Field": "resources.type",
        "Equals": ["AWS::SNS::Topic"]
      },
      {
        "Field": "eventName",
        "Equals": ["CreateTopic", "DeleteTopic", "Subscribe", "Unsubscribe", "SetTopicAttributes"]
      }
    ]
  },
  {
    "FieldSelectors": [
      {
        "Field": "eventCategory",
        "Equals": ["Data"]
      },
      {
        "Field": "resources.type",
        "Equals": ["AWS::SNS::Topic"]
      },
      {
        "Field": "resources.ARN",
        "Equals": ["arn:aws:sns:us-east-1:123456789012:security-alerts"]
      }
    ]
  },
  {
    "FieldSelectors": [
      {
        "Field": "eventCategory",
        "Equals": ["Data"]
      },
      {
        "Field": "resources.type",
        "Equals": ["AWS::SNS::Topic"]
      },
      {
        "Field": "resources.ARN",
        "StartsWith": ["arn:aws:sns:us-east-1:123456789012:compliance-"]
      }
    ]
  }
]
```

### Selecteurs bases sur l'identite utilisateur

#### Selecteur de surveillance des utilisateurs privilegies

La selection par identite utilisateur vous permet d'inclure ou d'exclure des evenements pour les actions effectuees par des identites IAM specifiques. L'exemple suivant demontre deux approches : exclure des roles de service specifiques de la journalisation des objets S3 pour reduire le bruit des processus automatises, et enregistrer uniquement les roles privilegies pour les operations sur les tables DynamoDB afin de se concentrer sur les activites a haut risque.

```json
[
  {
    "FieldSelectors": [
      {
        "Field": "eventCategory",
        "Equals": ["Data"]
      },
      {
        "Field": "resources.type",
        "Equals": ["AWS::S3::Object"]
      },
      {
        "Field": "userIdentity.arn",
        "NotStartsWith": ["arn:aws:sts::123456789012:assumed-role/service-role/backup-automation-role", "arn:aws:sts::123456789012:assumed-role/service-role/monitoring-role"]
      }
    ]
  },
  {
    "FieldSelectors": [
      {
        "Field": "eventCategory",
        "Equals": ["Data"]
      },
      {
        "Field": "resources.type",
        "Equals": ["AWS::DynamoDB::Table"]
      },
      {
        "Field": "userIdentity.arn",
        "StartsWith": ["arn:aws:sts::123456789012:assumed-role/AdminRole/", "arn:aws:sts::123456789012:assumed-role/SecurityRole/"]
      }
    ]
  }
]
```

### Selecteurs pour pistes organisationnelles et magasins de donnees d'evenements (EDS)

#### Selecteur d'exclusion au niveau du compte

Pour les pistes organisationnelles ou les configurations de magasins de donnees d'evenements (EDS), vous pouvez exclure des comptes entiers de la journalisation des evenements de donnees S3 pour reduire les couts et vous concentrer sur les comptes critiques. Ce selecteur exclut tous les evenements de donnees S3 d'un compte specifique en utilisant le champ userIdentity.arn pour correspondre a toute identite de ce compte. Cette approche est particulierement utile pour exclure les comptes de developpement ou de test d'une journalisation complete tout en maintenant la couverture pour les comptes de production.


```json
[
  {
    "FieldSelectors": [
      {
        "Field": "eventCategory",
        "Equals": ["Data"]
      },
      {
        "Field": "resources.type",
        "Equals": ["AWS::S3::Object"]
      },
      {
        "Field": "userIdentity.arn",
        "NotStartsWith": ["arn:aws:sts::111122223333:", "arn:aws:iam::111122223333:"]
      }
    ]
  }
]
```

:::info
Veuillez noter que les types d'ARN userIdentity peuvent s'etendre au-dela des exemples STS et IAM presentes ci-dessus. Il est recommande de verifier tous les types d'ARN userIdentity actuellement utilises au sein de votre organisation.
:::

#### Selecteur d'exclusion de compartiments S3 multiples

Lors de la gestion de la journalisation a l'echelle de l'organisation, vous pouvez avoir besoin d'exclure plusieurs compartiments S3 qui generent des evenements a volume eleve et faible valeur, tels que les compartiments de sauvegarde, le stockage temporaire ou les compartiments de traitement automatise. Ce selecteur demontre comment exclure plusieurs compartiments specifiques tout en maintenant la journalisation pour toutes les autres ressources S3. L'approche utilise plusieurs conditions NotStartsWith pour exclure efficacement differents motifs d'ARN de compartiments.

```json
[
  {
    "FieldSelectors": [
      {
        "Field": "eventCategory",
        "Equals": ["Data"]
      },
      {
        "Field": "resources.type",
        "Equals": ["AWS::S3::Object"]
      },
      {
        "Field": "resources.ARN",
        "NotStartsWith": [
          "arn:aws:s3:::backup-bucket-",
          "arn:aws:s3:::temp-processing-",
          "arn:aws:s3:::automated-logs-",
          "arn:aws:s3:::dev-sandbox-"
        ]
      }
    ]
  }
]
```

### Exemples de champs supplementaires pris en charge

#### Selecteur d'operations d'ecriture

Le selecteur de champ readOnly est crucial pour se concentrer sur les evenements qui representent des changements reels dans votre environnement. En selectionnant uniquement les operations d'ecriture, les organisations peuvent reduire le volume de journaux tout en maintenant la visibilite sur toutes les actions qui pourraient avoir un impact sur la securite ou la conformite. Ce selecteur est particulierement efficace lorsqu'il est combine avec des types de ressources ou des sources d'evenements specifiques.

#### Selecteur de source d'evenements specifique au service

La selection par source d'evenements permet une surveillance ciblee de services AWS specifiques sans la complexite de la selection par type de ressource. Cette approche est ideale pour les scenarios de conformite ou certains services necessitent une journalisation complete independamment des ressources specifiques impliquees. Le selecteur reduit significativement le bruit inter-services tout en assurant une couverture complete des services designes.

#### Surveillance d'operations API specifiques

La selection par nom d'evenement fournit le controle le plus granulaire sur la journalisation CloudTrail, permettant aux organisations de surveiller des operations API specifiques a travers tous les services. Cette approche est precieuse pour detecter des modeles d'attaque specifiques, surveiller des operations critiques ou repondre a des exigences de conformite precises. Le selecteur reduit considerablement le volume de journaux tout en fournissant une visibilite chirurgicale sur les operations a haut risque.

#### Selection par combinaison de types de ressources

La combinaison de la selection par type de ressource avec la selection par type d'operation cree des capacites de surveillance puissantes et ciblees. L'exemple suivant demontre trois approches differentes : enregistrer les operations d'ecriture sur les objets S3, capturer des operations d'ecriture DynamoDB specifiques et journaliser les operations d'ecriture sur les compartiments S3. Cette combinaison permet aux organisations d'enregistrer des types specifiques de ressources pour des types specifiques d'operations, fournissant une couverture de securite precise tout en minimisant la journalisation inutile.

```json
[
  {
    "FieldSelectors": [
      {
        "Field": "eventCategory",
        "Equals": ["Data"]
      },
      {
        "Field": "resources.type",
        "Equals": ["AWS::S3::Object"]
      },
      {
        "Field": "readOnly",
        "Equals": ["false"]
      }
    ]
  },
  {
    "FieldSelectors": [
      {
        "Field": "eventCategory",
        "Equals": ["Data"]
      },
      {
        "Field": "resources.type",
        "Equals": ["AWS::DynamoDB::Table"]
      },
      {
        "Field": "eventName",
        "Equals": ["PutItem", "UpdateItem", "DeleteItem"]
      }
    ]
  },
  {
    "FieldSelectors": [
      {
        "Field": "eventCategory",
        "Equals": ["Data"]
      },
      {
        "Field": "resources.type",
        "Equals": ["AWS::S3::Bucket"]
      },
      {
        "Field": "readOnly",
        "Equals": ["false"]
      }
    ]
  }
]
```

## Strategies d'optimisation des couts

### Analyse et reduction du volume d'evenements

Une optimisation efficace des couts commence par la comprehension de votre volume d'evenements actuel et l'identification des opportunites de reduction sans compromettre les exigences de securite ou de conformite. Analysez vos journaux CloudTrail pour identifier les evenements a volume eleve et determiner quels evenements peuvent etre exclus en toute securite. Cette analyse peut vous aider a determiner votre strategie de selecteurs d'evenements avances.

### Approches de selection strategiques

Mettez en oeuvre une approche de selection en couches qui priorise les evenements de securite et de conformite tout en excluant progressivement les activites operationnelles de routine. Commencez par des criteres d'inclusion larges pour les evenements pertinents pour la securite, puis ajoutez des exclusions specifiques pour les operations de routine connues. Par exemple, incluez toutes les operations d'ecriture mais excluez les processus automatises specifiques qui generent des evenements previsibles et a faible risque. Utilisez les operateurs StartsWith et EndsWith pour creer des selecteurs bases sur des motifs qui peuvent exclure efficacement des categories entieres d'evenements de routine tout en maintenant la couverture des activites inattendues ou potentiellement malveillantes.

### Gestion des couts basee sur les ressources

Organisez votre strategie de selection autour de la criticite et des niveaux de sensibilite des ressources. Implementez une journalisation complete pour les ressources de production, les magasins de donnees sensibles et les services critiques pour la securite tout en appliquant des criteres de selection plus agressifs aux environnements de developpement et de test. Utilisez les motifs d'ARN de ressources pour appliquer automatiquement les niveaux de journalisation appropries en fonction des conventions de denomination. Cette approche garantit que les efforts d'optimisation des couts ne compromettent pas la surveillance de securite pour vos actifs les plus importants tout en reduisant la charge de journalisation inutile pour les ressources moins critiques.

## Considerations de securite et de conformite

### Maintenir la visibilite de securite

Tout en optimisant les couts via les selecteurs d'evenements avances, maintenir une visibilite de securite complete reste primordial. Assurez-vous que votre strategie de selection capture tous les evenements qui pourraient indiquer des incidents de securite. La revue et le test reguliers de vos selecteurs d'evenements garantissent que les capacites de surveillance de securite restent efficaces a mesure que votre environnement evolue.

### Integration des exigences de conformite

Differents cadres de conformite ont des exigences specifiques pour la journalisation d'audit qui doivent etre prises en compte lors de la conception des selecteurs d'evenements avances. Mappez vos exigences de conformite sur des evenements CloudTrail specifiques et assurez-vous que vos selecteurs d'evenements avances capturent toutes les activites necessaires. Documentez vos decisions de selection et maintenez la preuve que votre strategie de journalisation repond aux exigences reglementaires.

### Preparation a la reponse aux incidents

Concevez vos selecteurs d'evenements avances en tenant compte des exigences de reponse aux incidents, en vous assurant de capturer suffisamment de details pour soutenir l'analyse medico-legale et les activites de chasse aux menaces. Incluez les evenements qui fournissent du contexte autour des incidents de securite, tels que les evenements d'authentification, les modeles d'acces reseau et les changements de configuration des ressources. Tenez compte des exigences de chronologie pour la reponse aux incidents et assurez-vous que votre strategie de journalisation fournit des donnees historiques adequates a des fins d'investigation. Testez vos selecteurs d'evenements contre des scenarios d'incidents connus pour valider qu'ils capturent les informations necessaires pour une reponse efficace.

## Bonnes pratiques de mise en oeuvre

### Strategie de deploiement par phases

Mettez en oeuvre les selecteurs d'evenements avances en utilisant une approche par phases qui permet les tests et l'affinement avant le deploiement complet. Commencez par une mise en oeuvre pilote dans un environnement de non-production pour valider votre logique de selection et mesurer l'impact sur le volume d'evenements et les couts. Etendez progressivement la mise en oeuvre tout en surveillant l'efficacite de votre strategie de selection. Cette approche vous permet d'identifier et de resoudre les problemes avant qu'ils n'affectent vos capacites de journalisation de production et offre des opportunites d'affiner vos selecteurs en fonction des modeles d'utilisation reels.

### Surveillance et validation

Etablissez une surveillance complete pour vos selecteurs d'evenements avances CloudTrail afin de vous assurer qu'ils continuent de repondre a vos exigences de securite et de conformite au fil du temps. Implementez des verifications de validation automatisees qui verifient que vos selecteurs d'evenements capturent les evenements attendus et n'excluent pas par inadvertance des activites critiques. La revue reguliere de l'efficacite de votre selection aide a maintenir l'equilibre entre l'optimisation des couts et la visibilite de securite.

## Techniques de selection avancees

### Selection de ressources basee sur les motifs

Exploitez les operateurs StartsWith et EndsWith pour creer des selecteurs sophistiques bases sur des motifs qui peuvent gerer efficacement un grand nombre de ressources. Par exemple, utilisez les conventions de denomination dans vos ARN de ressources pour appliquer automatiquement les niveaux de journalisation appropries en fonction de l'environnement, de la sensibilite ou de l'unite commerciale. La selection basee sur les motifs est particulierement efficace pour les organisations avec des standards de denomination coherents et peut reduire significativement la complexite de la gestion des selecteurs d'evenements dans de grands environnements AWS. Cette approche fournit egalement une couverture automatique pour les nouvelles ressources qui suivent les modeles de denomination etablis.

### Mise en oeuvre de la logique multi-conditions

Les selecteurs d'evenements avances prennent en charge des conditions logiques complexes qui peuvent etre utilisees pour creer des regles de selection sophistiquees. Combinez plusieurs selecteurs de champs au sein d'un seul selecteur d'evenements avance pour creer des conditions AND, ou utilisez plusieurs selecteurs d'evenements avances pour creer des conditions OR. Par exemple, vous pourriez creer un selecteur qui capture toutes les operations d'ecriture sur des ressources sensibles OU toute operation effectuee par des utilisateurs privilegies. Comprendre comment combiner efficacement les conditions vous permet de creer des regles de selection precises qui capturent exactement les evenements dont vous avez besoin tout en excluant tout le reste.
