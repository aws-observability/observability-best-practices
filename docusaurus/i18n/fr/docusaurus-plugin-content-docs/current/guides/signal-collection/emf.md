# CloudWatch Embedded Metric Format

## Introduction

CloudWatch Embedded Metric Format (EMF) permet aux clients d'ingerer des donnees applicatives complexes a haute cardinalite dans Amazon CloudWatch sous forme de logs et de generer des metriques exploitables. Avec Embedded Metric Format, les clients n'ont pas besoin de s'appuyer sur une architecture complexe ou d'utiliser des outils tiers pour obtenir des informations sur leurs environnements. Bien que cette fonctionnalite puisse etre utilisee dans tous les environnements, elle est particulierement utile pour les charges de travail qui ont des ressources ephemeres comme les fonctions AWS Lambda ou les conteneurs dans Amazon Elastic Container Service (Amazon ECS), Amazon Elastic Kubernetes Service (Amazon EKS), ou Kubernetes sur EC2. Embedded Metric Format permet aux clients de creer facilement des metriques personnalisees sans avoir a instrumenter ou maintenir du code separe, tout en beneficiant de puissantes capacites analytiques sur les donnees de logs.

## Comment fonctionnent les logs Embedded Metric Format (EMF)

Les environnements de calcul comme Amazon EC2, les serveurs sur site, les conteneurs dans Amazon Elastic Container Service (Amazon ECS), Amazon Elastic Kubernetes Service (Amazon EKS), ou Kubernetes sur EC2 peuvent generer et envoyer des logs Embedded Metric Format (EMF) via le CloudWatch Agent vers Amazon CloudWatch.

AWS Lambda permet aux clients de generer facilement des metriques personnalisees sans necessiter de code personnalise, d'appels reseau bloquants ou de logiciels tiers pour generer et ingerer les logs Embedded Metric Format (EMF) dans Amazon CloudWatch.

Les clients peuvent integrer des metriques personnalisees avec des donnees detaillees d'evenements de log de maniere asynchrone sans avoir besoin de fournir une declaration d'en-tete speciale tout en publiant des logs structures conformes a la [specification EMF](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Specification.html). CloudWatch extrait automatiquement les metriques personnalisees afin que les clients puissent les visualiser et configurer des alarmes pour la detection d'incidents en temps reel. Les evenements de log detailles et le contexte a haute cardinalite associes aux metriques extraites peuvent etre interroges a l'aide de CloudWatch Logs Insights pour fournir des informations approfondies sur les causes profondes des evenements operationnels.

Le plugin de sortie Amazon CloudWatch pour [Fluent Bit](https://docs.fluentbit.io/manual/pipeline/outputs/cloudwatch) permet aux clients d'ingerer des donnees de metriques et de logs dans le service Amazon CloudWatch, y compris la prise en charge de l'[Embedded Metric Format](https://github.com/aws/aws-for-fluent-bit) (EMF).

![CloudWatch EMF Architecture](../../images/EMF-Arch.png)

## Quand utiliser les logs Embedded Metric Format (EMF)

Traditionnellement, la surveillance est structuree en trois categories. La premiere categorie est la verification classique de l'etat de sante d'une application. La deuxieme categorie est les « metriques », a travers lesquelles les clients instrumentent leur application en utilisant des modeles comme les compteurs, les minuteries et les jauges. La troisieme categorie est les « logs », qui sont inestimables pour l'observabilite globale de l'application. Les logs fournissent aux clients des informations continues sur le comportement de leur application. Desormais, les clients disposent d'un moyen d'ameliorer considerablement la facon dont ils peuvent observer leur application, sans avoir a faire de sacrifices en matiere de granularite ou de richesse des donnees en unifiant et simplifiant toute l'instrumentation de leur application tout en beneficiant d'incroyables capacites analytiques grace aux logs Embedded Metric Format (EMF).

Les [logs Embedded Metric Format (EMF)](https://aws.amazon.com/blogs/mt/enhancing-workload-observability-using-amazon-cloudwatch-embedded-metric-format/) sont ideaux pour les environnements qui generent des donnees applicatives a haute cardinalite, pouvant faire partie des logs EMF sans avoir a augmenter les dimensions des metriques. Cela permet toujours aux clients de decouper et d'analyser les donnees applicatives en interrogeant les logs EMF via CloudWatch Logs Insights et CloudWatch Metrics Insights sans avoir besoin de mettre chaque attribut comme dimension de metrique.

Les clients qui agregent des [donnees de telemetrie de millions d'appareils Telco ou IoT](https://aws.amazon.com/blogs/mt/how-bt-uses-amazon-cloudwatch-to-monitor-millions-of-devices/) ont besoin d'informations sur les performances de leurs appareils et de la capacite d'approfondir rapidement la telemetrie unique que les appareils rapportent. Ils ont egalement besoin de resoudre les problemes plus facilement et plus rapidement sans avoir a fouiller dans d'enormes quantites de donnees pour fournir un service de qualite. En utilisant les logs Embedded Metric Format (EMF), les clients peuvent accomplir une observabilite a grande echelle en combinant metriques et logs en une seule entite et ameliorer le depannage avec une efficacite des couts et de meilleures performances.

## Generation des logs Embedded Metric Format (EMF)

Les methodes suivantes peuvent etre utilisees pour generer des logs Embedded Metric Format :

1. Generer et envoyer les logs EMF via un agent (comme [CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Generation_CloudWatch_Agent.html) ou Fluent-Bit ou Firelens) en utilisant des bibliotheques clientes open source.

   - Des bibliotheques clientes open source sont disponibles dans les langages suivants pour creer des logs EMF :
     - [Node.Js](https://github.com/awslabs/aws-embedded-metrics-node)
     - [Python](https://github.com/awslabs/aws-embedded-metrics-python)
     - [Java](https://github.com/awslabs/aws-embedded-metrics-java)
     - [C#](https://github.com/awslabs/aws-embedded-metrics-dotnet)
   - Les logs EMF peuvent etre generes en utilisant AWS Distro for OpenTelemetry (ADOT). ADOT est une distribution securisee, prete pour la production et supportee par AWS du projet OpenTelemetry, faisant partie de la Cloud Native Computing Foundation (CNCF). OpenTelemetry est une initiative open source qui fournit des API, des bibliotheques et des agents pour collecter des traces distribuees, des logs et des metriques pour la surveillance des applications et supprime les frontieres et restrictions entre les formats specifiques aux fournisseurs. Deux composants sont requis pour cela : une source de donnees conforme a OpenTelemetry et un [collecteur ADOT](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/awsemfexporter) active pour une utilisation avec les logs [CloudWatch EMF](https://aws-otel.github.io/docs/getting-started/cloudwatch-metrics#cloudwatch-emf-exporter-awsemf).

2. Les logs construits manuellement conformes a la [specification definie au format JSON](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Specification.html) peuvent etre envoyes via l'[agent CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Generation_CloudWatch_Agent.html) ou l'[API PutLogEvents](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Generation_PutLogEvents.html) vers CloudWatch.

## Visualisation des logs Embedded Metric Format dans la console CloudWatch

Apres avoir genere les logs Embedded Metric Format (EMF) qui extraient des metriques, les clients peuvent [les visualiser dans la console CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_View.html) sous Metriques. Les metriques integrees ont les dimensions specifiees lors de la generation des logs. Les metriques integrees generees a l'aide des bibliotheques clientes ont ServiceType, ServiceName et LogGroup comme dimensions par defaut.

- **ServiceName** : Le nom du service est substitue ; cependant, pour les services ou le nom ne peut pas etre deduit (par exemple, un processus Java s'executant sur EC2), une valeur par defaut de Unknown est utilisee si elle n'est pas explicitement definie.
- **ServiceType** : Le type du service est substitue ; cependant, pour les services ou le type ne peut pas etre deduit (par exemple, un processus Java s'executant sur EC2), une valeur par defaut de Unknown est utilisee si elle n'est pas explicitement definie.
- **LogGroupName** : Les clients peuvent optionnellement configurer le groupe de logs de destination vers lequel les metriques doivent etre livrees, pour les plateformes basees sur un agent. Cette valeur est transmise de la bibliotheque a l'agent dans la charge utile Embedded Metric. Si un LogGroup n'est pas fourni, la valeur par defaut sera derivee du nom du service : -metrics
- **LogStreamName** : Les clients peuvent optionnellement configurer le flux de logs de destination vers lequel les metriques doivent etre livrees, pour les plateformes basees sur un agent. Cette valeur sera transmise de la bibliotheque a l'agent dans la charge utile Embedded Metric. Si un LogStreamName n'est pas fourni, la valeur par defaut sera derivee par l'agent (ce sera probablement le nom d'hote).
- **NameSpace** : Substitue l'espace de noms CloudWatch. Si non defini, une valeur par defaut de aws-embedded-metrics est utilisee.

Un exemple de log EMF ressemble a ceci dans les logs de la console CloudWatch :

```json
2023-05-19T15:20:39.391Z 238196b6-c8da-4341-a4b7-0c322e0ef5bb INFO
{
    "LogGroup": "emfTestFunction",
    "ServiceName": "emfTestFunction",
    "ServiceType": "AWS::Lambda::Function",
    "Service": "Aggregator",
    "AccountId": "XXXXXXXXXXXX",
    "RequestId": "422b1569-16f6-4a03-b8f0-fe3fd9b100f8",
    "DeviceId": "61270781-c6ac-46f1-baf7-22c808af8162",
    "Payload": {
        "sampleTime": 123456789,
        "temperature": 273,
        "pressure": 101.3
    },
    "executionEnvironment": "AWS_Lambda_nodejs18.x",
    "memorySize": "256",
    "functionVersion": "$LATEST",
    "logStreamId": "2023/05/19/[$LATEST]f3377848231140c185570caa9f97abc8",
    "_aws": {
        "Timestamp": 1684509639390,
        "CloudWatchMetrics": [
            {
                "Dimensions": [
                    [
                        "LogGroup",
                        "ServiceName",
                        "ServiceType",
                        "Service"
                    ]
                ],
                "Metrics": [
                    {
                        "Name": "ProcessingLatency",
                        "Unit": "Milliseconds"
                    }
                ],
                "Namespace": "aws-embedded-metrics"
            }
        ]
    },
    "ProcessingLatency": 100
}
```

Pour le meme log EMF, les metriques extraites ressemblent a ce qui suit, et peuvent etre interrogees dans **CloudWatch Metrics**.

![CloudWatch EMF Metrics](../../images/emf_extracted_metrics.png)

Les clients peuvent interroger les evenements de log detailles associes aux metriques extraites en utilisant **CloudWatch Logs Insights** pour obtenir des informations approfondies sur les causes profondes des evenements operationnels. L'un des avantages de l'extraction de metriques a partir des logs EMF est que les clients peuvent filtrer les logs par la metrique unique (nom de metrique plus ensemble de dimensions unique) et les valeurs de metriques, pour obtenir le contexte des evenements qui ont contribue a la valeur agregee de la metrique.

Pour les memes logs EMF discutes ci-dessus, un exemple de requete ayant ProcessingLatency comme metrique et Service comme dimension pour obtenir un identifiant de requete ou un identifiant d'appareil impacte est montre ci-dessous comme requete d'exemple dans CloudWatch Logs Insights.

```json
filter ProcessingLatency < 200 and Service = "Aggregator"
| fields @requestId, @ingestionTime, @DeviceId
```

![CloudWatch EMF Logs](../../images/emf_extracted_CWLogs.png)

## Alarmes sur les metriques creees avec les logs EMF

La creation d'[alarmes sur les metriques generees par EMF](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Alarms.html) suit le meme schema que la creation d'alarmes sur toute autre metrique. Le point cle a noter ici est que la generation de metriques EMF depend du flux de publication des logs, car le processus CloudWatch Logs traite les logs EMF et transforme les metriques. Il est donc important de publier les logs en temps opportun afin que les points de donnees des metriques soient crees dans la periode de temps pendant laquelle les alarmes sont evaluees.

Pour les memes logs EMF discutes ci-dessus, un exemple d'alarme est cree et montre ci-dessous en utilisant la metrique ProcessingLatency comme point de donnees avec un seuil.

![CloudWatch EMF Alarm](../../images/EMF-Alarm.png)

## Dernieres fonctionnalites des logs EMF

Les clients peuvent envoyer des logs EMF a CloudWatch Logs en utilisant l'[API PutLogEvents](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Generation_PutLogEvents.html) et peuvent optionnellement inclure l'en-tete HTTP `x-amzn-logs-format: json/emf` pour indiquer a CloudWatch Logs que les metriques doivent etre extraites, mais ce n'est plus necessaire.

Amazon CloudWatch prend en charge l'[extraction de metriques haute resolution](https://aws.amazon.com/about-aws/whats-new/2023/02/amazon-cloudwatch-high-resolution-metric-extraction-structured-logs/) avec une granularite allant jusqu'a 1 seconde a partir de logs structures en utilisant Embedded Metric Format (EMF). Les clients peuvent fournir un parametre optionnel [StorageResolution](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_concepts.html#Resolution_definition) dans les logs de specification EMF avec une valeur de 1 ou 60 (par defaut) pour indiquer la resolution souhaitee (en secondes) de la metrique. Les clients peuvent publier a la fois des metriques de resolution standard (60 secondes) et de haute resolution (1 seconde) via EMF, permettant une visibilite granulaire sur la sante et les performances de leurs applications.

Amazon CloudWatch fournit une [visibilite amelioree des erreurs](https://aws.amazon.com/about-aws/whats-new/2023/01/amazon-cloudwatch-enhanced-error-visibility-embedded-metric-format-emf/) dans Embedded Metric Format (EMF) avec deux metriques d'erreur ([EMFValidationErrors et EMFParsingErrors](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch-Logs-Monitoring-CloudWatch-Metrics.html)). Cette visibilite amelioree aide les clients a identifier et corriger rapidement les erreurs lors de l'utilisation d'EMF, simplifiant ainsi le processus d'instrumentation.

Avec la complexite croissante de la gestion des applications modernes, les clients ont besoin de plus de flexibilite lors de la definition et de l'analyse des metriques personnalisees. Par consequent, le nombre maximal de dimensions de metriques a ete augmente de 10 a 30. Les clients peuvent creer des metriques personnalisees en utilisant des [logs EMF avec jusqu'a 30 dimensions](https://aws.amazon.com/about-aws/whats-new/2022/08/amazon-cloudwatch-metrics-increases-throughput/).

## References supplementaires :

- Atelier One Observability sur [Embedded Metric Format avec une fonction AWS Lambda](https://catalog.workshops.aws/observability/en-US/aws-native/metrics/emf/clientlibrary) en utilisant la bibliotheque NodeJS.
- Atelier Serverless Observability sur les [metriques asynchrones utilisant Embedded Metrics Format](https://serverless-observability.workshop.aws/en/030_cloudwatch/async_metrics_emf.html) (EMF)
- [Exemple de code Java utilisant l'API PutLogEvents](https://catalog.workshops.aws/observability/en-US/aws-native/metrics/emf/putlogevents) pour envoyer des logs EMF a CloudWatch Logs
- Article de blog : [Lowering costs and focusing on our customers with Amazon CloudWatch embedded custom metrics](https://aws.amazon.com/blogs/mt/lowering-costs-and-focusing-on-our-customers-with-amazon-cloudwatch-embedded-custom-metrics/)
