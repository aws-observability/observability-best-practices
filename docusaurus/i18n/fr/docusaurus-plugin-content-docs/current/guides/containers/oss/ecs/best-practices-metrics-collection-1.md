# Collecte de metriques systeme dans un cluster ECS avec AWS Distro for OpenTelemetry 
[AWS Distro for OpenTelemetry](https://aws-otel.github.io/docs/introduction) (ADOT) est une distribution securisee et prise en charge par AWS du projet [OpenTelemetry](https://opentelemetry.io/). En utilisant ADOT, vous pouvez collecter des donnees de telemetrie provenant de multiples sources et envoyer des metriques, traces et journaux correles vers plusieurs solutions de surveillance. ADOT peut etre deploye sur un cluster Amazon ECS selon deux modeles differents. 

## Modeles de deploiement pour le collecteur ADOT 
1. Dans le modele sidecar, le collecteur ADOT s'execute a l'interieur de chaque tache du cluster et traite les donnees de telemetrie collectees uniquement a partir des conteneurs d'application de cette tache. Ce modele de deploiement est necessaire uniquement lorsque vous avez besoin que le collecteur lise les metadonnees de tache depuis le [point de terminaison de metadonnees de tache](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-metadata-endpoint.html) Amazon ECS, et genere des metriques d'utilisation des ressources (telles que CPU, memoire, reseau et disque) a partir de celles-ci. 
![Architecture ADOT](../../../../images/ADOT-sidecar.png)

2. Dans le modele de collecteur central, une seule instance du collecteur ADOT est deployee sur le cluster et traite les donnees de telemetrie de toutes les taches en cours d'execution sur le cluster. C'est le modele de deploiement le plus couramment utilise. Le collecteur est deploye en utilisant soit la strategie de planification de service REPLICA soit DAEMON.
![Architecture ADOT](../../../../images/ADOT-central.png)

L'architecture du collecteur ADOT repose sur le concept de pipeline. Un seul collecteur peut contenir plus d'un pipeline. Chaque pipeline est dedie au traitement de l'un des trois types de donnees de telemetrie, a savoir les metriques, les traces et les journaux. Vous pouvez configurer plusieurs pipelines pour chaque type de donnees de telemetrie. Cette architecture polyvalente permet ainsi a un seul collecteur de remplir le role de plusieurs agents d'observabilite qui devraient autrement etre deployes sur le cluster. Elle reduit considerablement l'empreinte de deploiement des agents d'observabilite sur le cluster. Les composants principaux d'un collecteur qui constituent un pipeline sont regroupes en trois categories, a savoir le recepteur (Receiver), le processeur (Processor) et l'exporteur (Exporter). Il existe des composants secondaires appeles Extensions qui fournissent des fonctionnalites pouvant etre ajoutees au collecteur, mais qui ne font pas partie des pipelines. 

:::info
    Consultez la [documentation](https://opentelemetry.io/docs/collector/configuration/#basics) OpenTelemetry pour une explication detaillee des Receivers, Processors, Exporters et Extensions.
:::

## Deploiement du collecteur ADOT pour la collecte de metriques de taches ECS

Pour collecter des metriques d'utilisation des ressources au niveau des taches ECS, le collecteur ADOT doit etre deploye en utilisant le modele sidecar, avec une definition de tache comme indique ci-dessous. L'image de conteneur utilisee pour le collecteur est fournie avec plusieurs configurations de pipeline. Vous pouvez en choisir une en fonction de vos besoins et specifier le chemin du fichier de configuration dans la section *command* de la definition du conteneur. En definissant cette valeur a `--config=/etc/ecs/container-insights/otel-task-metrics-config.yaml`, on utilisera une [configuration de pipeline](https://github.com/aws-observability/aws-otel-collector/blob/main/config/ecs/container-insights/otel-task-metrics-config.yaml) qui collecte les metriques d'utilisation des ressources et les traces des autres conteneurs s'executant dans la meme tache que le collecteur et les envoie a Amazon CloudWatch et AWS X-Ray. Plus precisement, le collecteur utilise un [recepteur AWS ECS Container Metrics](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/awsecscontainermetricsreceiver) qui lit les metadonnees de tache et les statistiques Docker depuis le [point de terminaison de metadonnees de tache Amazon ECS](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-metadata-endpoint-v4.html), et genere des metriques d'utilisation des ressources (telles que CPU, memoire, reseau et disque) a partir de celles-ci. 

```javascript
{
    "family":"AdotTask",
    "taskRoleArn":"arn:aws:iam::123456789012:role/ECS-ADOT-Task-Role",
    "executionRoleArn":"arn:aws:iam::123456789012:role/ECS-Task-Execution-Role",
    "networkMode":"awsvpc",
    "containerDefinitions":[
       {
          "name":"application-container",
          "image":"..."
       },
       {
          "name":"aws-otel-collector",
          "image":"public.ecr.aws/aws-observability/aws-otel-collector:latest",
          "cpu":512,
          "memory":1024,
          "command": [
            "--config=/etc/ecs/container-insights/otel-task-metrics-config.yaml"
          ],          
          "portMappings":[
             {
                "containerPort":2000,
                "protocol":"udp"
             }
          ],             
          "essential":true
       }
    ],
    "requiresCompatibilities":[
       "EC2"
    ],
    "cpu":"1024",
    "memory":"2048"
 }
```
:::info
    Consultez la [documentation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/deploy-container-insights-ECS-adot.html) pour obtenir des details sur la configuration du role IAM de tache et du role d'execution de tache que le collecteur ADOT utilisera lorsqu'il sera deploye sur un cluster Amazon ECS.
:::

:::info
    Le [recepteur AWS ECS Container Metrics](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/awsecscontainermetricsreceiver) fonctionne uniquement avec le point de terminaison de metadonnees de tache ECS V4. Les taches Amazon ECS sur Fargate qui utilisent la version de plateforme 1.4.0 ou ulterieure et les taches Amazon ECS sur Amazon EC2 qui executent au moins la version 1.39.0 de l'agent de conteneur Amazon ECS peuvent utiliser ce recepteur. Pour plus d'informations, consultez [Versions de l'agent de conteneur Amazon ECS](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-agent-versions.html)
:::

Comme on peut le voir dans la [configuration de pipeline](https://github.com/aws-observability/aws-otel-collector/blob/main/config/ecs/container-insights/otel-task-metrics-config.yaml) par defaut, le pipeline du collecteur utilise d'abord le [processeur de filtrage](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/filterprocessor) qui filtre un [sous-ensemble de metriques](https://github.com/aws-observability/aws-otel-collector/blob/09d59966404c2928aaaf6920f27967a84d898254/config/ecs/container-insights/otel-task-metrics-config.yaml#L25) relatives a l'utilisation du CPU, de la memoire, du reseau et du disque. Ensuite, il utilise le [processeur de transformation de metriques](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/metricstransformprocessor) qui effectue un ensemble de [transformations](https://github.com/aws-observability/aws-otel-collector/blob/09d59966404c2928aaaf6920f27967a84d898254/config/ecs/container-insights/otel-task-metrics-config.yaml#L39) pour modifier les noms de ces metriques ainsi que mettre a jour leurs attributs. Enfin, les metriques sont envoyees a CloudWatch sous forme d'evenements de journaux de performance en utilisant l'[exporteur Amazon CloudWatch EMF](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/awsemfexporter). L'utilisation de cette configuration par defaut entrainera la collecte des metriques d'utilisation des ressources suivantes sous l'espace de noms CloudWatch *ECS/ContainerInsights*.

- MemoryUtilized
- MemoryReserved
- CpuUtilized
- CpuReserved
- NetworkRxBytes
- NetworkTxBytes
- StorageReadBytes
- StorageWriteBytes

:::info
    Notez que ce sont les memes [metriques collectees par Container Insights pour Amazon ECS](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-metrics-ECS.html) et qui sont rendues disponibles dans CloudWatch lorsque vous activez Container Insights au niveau du cluster ou du compte. Par consequent, l'activation de Container Insights est l'approche recommandee pour collecter les metriques d'utilisation des ressources ECS dans CloudWatch.
:::

Le recepteur AWS ECS Container Metrics emet 52 metriques uniques qu'il lit depuis le point de terminaison de metadonnees de tache Amazon ECS. La liste complete des metriques collectees par le recepteur est [documentee ici](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/awsecscontainermetricsreceiver#available-metrics). Vous ne souhaitez peut-etre pas toutes les envoyer vers votre destination preferee. Si vous voulez un controle plus explicite sur les metriques d'utilisation des ressources ECS, vous pouvez creer une configuration de pipeline personnalisee, en filtrant et transformant les metriques disponibles avec les processeurs/transformateurs de votre choix et les envoyer vers une destination en fonction des exporteurs de votre choix. Consultez la documentation pour des [exemples supplementaires](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/awsecscontainermetricsreceiver#full-configuration-examples) de configurations de pipeline pour capturer les metriques au niveau des taches ECS.

Si vous souhaitez utiliser une configuration de pipeline personnalisee, vous pouvez utiliser la definition de tache ci-dessous et deployer le collecteur en utilisant le modele sidecar. Ici, la configuration du pipeline du collecteur est chargee a partir d'un parametre nomme *otel-collector-config* dans AWS SSM Parameter Store. 

:::note
    Le nom du parametre SSM Parameter Store doit etre expose au collecteur via une variable d'environnement nommee AOT_CONFIG_CONTENT.
:::

```javascript
{
    "family":"AdotTask",
    "taskRoleArn":"arn:aws:iam::123456789012:role/ECS-ADOT-Task-Role",
    "executionRoleArn":"arn:aws:iam::123456789012:role/ECS-Task-Execution-Role",
    "networkMode":"awsvpc",
    "containerDefinitions":[
       {
          "name":"application-container",
          "image":"..."
       },        
       {
          "name":"aws-otel-collector",
          "image":"public.ecr.aws/aws-observability/aws-otel-collector:latest",
          "cpu":512,
          "memory":1024,
          "secrets":[
             {
                "name":"AOT_CONFIG_CONTENT",
                "valueFrom":"arn:aws:ssm:us-east-1:123456789012:parameter/otel-collector-config"
             }
          ],          
          "portMappings":[
             {
                "containerPort":2000,
                "protocol":"udp"
             }
          ],             
          "essential":true
       }
    ],
    "requiresCompatibilities":[
       "EC2"
    ],
    "cpu":"1024",
    "memory":"2048"
 }
```

## Deploiement du collecteur ADOT pour la collecte de metriques d'instances de conteneur ECS

Pour collecter des metriques au niveau des instances EC2 de votre cluster ECS, le collecteur ADOT peut etre deploye a l'aide d'une definition de tache comme indique ci-dessous. Il doit etre deploye avec la strategie de planification de service daemon. Vous pouvez choisir une configuration de pipeline integree dans l'image de conteneur. Le chemin du fichier de configuration dans la section *command* de la definition du conteneur doit etre defini a `--config=/etc/ecs/otel-instance-metrics-config.yaml`. Le collecteur utilise le [recepteur AWS Container Insights](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/awscontainerinsightreceiver#aws-container-insights-receiver) pour collecter des metriques d'infrastructure au niveau de l'instance EC2 pour de nombreuses ressources telles que CPU, memoire, disque et reseau. Les metriques sont envoyees a CloudWatch sous forme d'evenements de journaux de performance en utilisant l'[exporteur Amazon CloudWatch EMF](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/awsemfexporter). La fonctionnalite du collecteur avec cette configuration est equivalente a celle du deploiement de l'agent CloudWatch sur un cluster Amazon ECS heberge sur EC2.

:::info
    Le deploiement du collecteur ADOT pour la collecte de metriques au niveau des instances EC2 n'est pas pris en charge sur les clusters ECS s'executant sur AWS Fargate
:::

```javascript
{
    "family":"AdotTask",
    "taskRoleArn":"arn:aws:iam::123456789012:role/ECS-ADOT-Task-Role",
    "executionRoleArn":"arn:aws:iam::123456789012:role/ECS-Task-Execution-Role",
    "networkMode":"awsvpc",
    "containerDefinitions":[
       {
          "name":"application-container",
          "image":"..."
       },
       {
          "name":"aws-otel-collector",
          "image":"public.ecr.aws/aws-observability/aws-otel-collector:latest",
          "cpu":512,
          "memory":1024,
          "command": [
            "--config=/etc/ecs/otel-instance-metrics-config.yaml"
          ],          
          "portMappings":[
             {
                "containerPort":2000,
                "protocol":"udp"
             }
          ],             
          "essential":true
       }
    ],
    "requiresCompatibilities":[
       "EC2"
    ],
    "cpu":"1024",
    "memory":"2048"
 }
```
