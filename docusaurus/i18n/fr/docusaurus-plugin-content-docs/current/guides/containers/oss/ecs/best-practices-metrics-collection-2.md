# Collecte de metriques de service dans un cluster ECS avec AWS Distro for OpenTelemetry 
## Deploiement du collecteur ADOT avec la configuration par defaut
Le collecteur ADOT peut etre deploye a l'aide d'une definition de tache comme indique ci-dessous, en utilisant le modele sidecar. L'image de conteneur utilisee pour le collecteur est fournie avec deux configurations de pipeline de collecteur qui peuvent etre specifiees dans la section *command* de la definition du conteneur. En definissant cette valeur a `--config=/etc/ecs/ecs-default-config.yaml`, on utilisera une [configuration de pipeline](https://github.com/aws-observability/aws-otel-collector/blob/main/config/ecs/ecs-default-config.yaml) qui collectera les metriques applicatives et les traces des autres conteneurs s'executant dans la meme tache que le collecteur et les enverra a Amazon CloudWatch et AWS X-Ray. Plus precisement, le collecteur utilise un [recepteur OpenTelemetry Protocol (OTLP)](https://github.com/open-telemetry/opentelemetry-collector/tree/main/receiver/otlpreceiver) pour recevoir les metriques envoyees par les applications instrumentees avec les SDK OpenTelemetry ainsi qu'un [recepteur StatsD](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/statsdreceiver) pour collecter les metriques StatsD. De plus, il utilise un [recepteur AWS X-Ray](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/awsxrayreceiver) pour collecter les traces des applications instrumentees avec le SDK AWS X-Ray.

:::info
    Consultez la [documentation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/deploy-container-insights-ECS-adot.html) pour obtenir des details sur la configuration du role IAM de tache et du role d'execution de tache que le collecteur ADOT utilisera lorsqu'il sera deploye sur un cluster Amazon ECS.
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
            "--config=/etc/ecs/ecs-default-config.yaml"
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
## Deploiement du collecteur ADOT pour la collecte de metriques Prometheus
Pour deployer ADOT avec le modele de collecteur central, avec un pipeline different de la configuration par defaut, la definition de tache ci-dessous peut etre utilisee. Ici, la configuration du pipeline du collecteur est chargee a partir d'un parametre nomme *otel-collector-config* dans AWS SSM Parameter Store. Le collecteur est lance en utilisant la strategie de planification de service REPLICA. 

```javascript
{
    "family":"AdotTask",
    "taskRoleArn":"arn:aws:iam::123456789012:role/ECS-ADOT-Task-Role",
    "executionRoleArn":"arn:aws:iam::123456789012:role/ECS-Task-Execution-Role",
    "networkMode":"awsvpc",
    "containerDefinitions":[
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

:::note
    Le nom du parametre SSM Parameter Store doit etre expose au collecteur via une variable d'environnement nommee AOT_CONFIG_CONTENT.
    Lorsque vous utilisez le collecteur ADOT pour la collecte de metriques Prometheus a partir d'applications et que vous le deployez avec la strategie de planification de service REPLICA, assurez-vous de definir le nombre de replicas a 1. Deployer plus d'un replica du collecteur entrainera une representation incorrecte des donnees de metriques dans la destination cible.
:::

La configuration ci-dessous permet au collecteur ADOT de collecter des metriques Prometheus a partir des services du cluster en utilisant un [recepteur Prometheus](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/prometheusreceiver). Le recepteur est concu pour etre au minimum un remplacement direct du serveur Prometheus. Pour collecter des metriques avec ce recepteur, vous avez besoin d'un mecanisme de decouverte de l'ensemble des services cibles a scruter. Le recepteur prend en charge la decouverte statique et dynamique des cibles de scraping en utilisant l'un des dizaines de [mecanismes de decouverte de services](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#scrape_config) pris en charge. 

Comme Amazon ECS ne dispose pas de mecanisme integre de decouverte de services, le collecteur s'appuie sur le support de Prometheus pour la decouverte de cibles basee sur des fichiers. Pour configurer le recepteur Prometheus pour la decouverte de cibles basee sur des fichiers, le collecteur utilise l'extension [Amazon ECS Observer](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/extension/observer/ecsobserver/README.md). L'extension utilise les API ECS/EC2 pour decouvrir les cibles de scraping Prometheus a partir de toutes les taches en cours d'execution et les filtrer en fonction des noms de services, des definitions de taches et des labels de conteneurs listes dans la section *ecs_observer/task_definitions* de la configuration. Toutes les cibles decouvertes sont ecrites dans le fichier specifie par le champ *result_file*, qui reside sur le systeme de fichiers monte dans le conteneur du collecteur ADOT. Ensuite, le recepteur Prometheus scrute les metriques des cibles listees dans ce fichier. 

### Envoi des donnees de metriques vers un espace de travail Amazon Managed Prometheus
Les metriques collectees par le recepteur Prometheus peuvent etre envoyees vers un espace de travail Amazon Managed Prometheus en utilisant un [exporteur Prometheus Remote Write](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/prometheusremotewriteexporter) dans le pipeline du collecteur, comme indique dans la section *exporters* de la configuration ci-dessous. L'exporteur est configure avec l'URL d'ecriture distante de l'espace de travail et envoie les donnees de metriques via des requetes HTTP POST. Il utilise l'authentificateur integre AWS Signature Version 4 pour signer les requetes envoyees a l'espace de travail. 

```yaml
extensions:
  health_check:
  sigv4auth:
    region: us-east-1
  ecs_observer:
    refresh_interval: 60s 
    cluster_name: 'ecs-ec2-cluster'
    cluster_region: us-east-1
    result_file: '/etc/ecs_sd_targets.yaml' 
    services:
      - name_pattern: '^WebAppService$'
    task_definitions:
      - job_name: "webapp-tasks"
        arn_pattern: '.*:task-definition/WebAppTask:[0-9]+'
        metrics_path: '/metrics'
        metrics_ports:
          - 3000

receivers:
  awsxray:
  prometheus:
    config:
      scrape_configs:
        - job_name: ecs_services
          file_sd_configs:
            - files:
                - '/etc/ecs_sd_targets.yaml'
              refresh_interval: 30s
          relabel_configs: 
            - source_labels: [ __meta_ecs_cluster_name ] 
              action: replace
              target_label: cluster
            - source_labels: [ __meta_ecs_service_name ] 
              action: replace
              target_label: service
            - source_labels: [ __meta_ecs_task_definition_family ] 
              action: replace
              target_label: taskdefinition       
            - source_labels: [ __meta_ecs_task_container_name ] 
              action: replace
              target_label: container                        

processors:
    filter/include:
      metrics:
        include:
          match_type: regexp
          metric_names:
            - ^http_requests_total$  

exporters:
  awsxray:
  prometheusremotewrite:
    endpoint: https://aps-workspaces.us-east-1.amazonaws.com/workspaces/WORKSPACE_ID/api/v1/remote_write
    auth:
      authenticator: sigv4auth
    resource_to_telemetry_conversion:
      enabled: true

service:
  extensions:
    - ecs_observer
    - health_check
    - sigv4auth
  pipelines:
    metrics:
      receivers: [prometheus]
      exporters: [prometheusremotewrite]       
    traces:
      receivers: [awsxray]
      exporters: [awsxray]       
```    

### Envoi des donnees de metriques vers Amazon CloudWatch
Alternativement, les donnees de metriques peuvent etre envoyees vers Amazon CloudWatch en utilisant l'[exporteur Amazon CloudWatch EMF](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/awsemfexporter) dans le pipeline du collecteur, comme indique dans la section *exporters* de la configuration ci-dessous. Cet exporteur envoie les donnees de metriques a CloudWatch sous forme d'evenements de journaux de performance. Le champ *metric_declaration* dans l'exporteur est utilise pour specifier le tableau de journaux avec format de metriques integre a generer. La configuration ci-dessous generera des evenements de journaux uniquement pour une metrique nommee *http_requests_total*. En utilisant ces donnees, CloudWatch creera la metrique *http_requests_total* sous l'espace de noms CloudWatch *ECS/ContainerInsights/Prometheus* avec les dimensions *ClusterName*, *ServiceName* et *TaskDefinitionFamily*.


```yaml
extensions:
  health_check:
  sigv4auth:
    region: us-east-1
  ecs_observer:
    refresh_interval: 60s 
    cluster_name: 'ecs-ec2-cluster'
    cluster_region: us-east-1
    result_file: '/etc/ecs_sd_targets.yaml' 
    services:
      - name_pattern: '^WebAppService$'
    task_definitions:
      - job_name: "webapp-tasks"
        arn_pattern: '.*:task-definition/WebAppTask:[0-9]+'
        metrics_path: '/metrics'
        metrics_ports:
          - 3000

receivers:
  awsxray:
  prometheus:
    config:
      global:
        scrape_interval: 15s
        scrape_timeout: 10s
      scrape_configs:
        - job_name: ecs_services
          file_sd_configs::
            - files:
                - '/etc/ecs_sd_targets.yaml'
          relabel_configs: 
            - source_labels: [ __meta_ecs_cluster_name ] 
              action: replace
              target_label: ClusterName
            - source_labels: [ __meta_ecs_service_name ] 
              action: replace
              target_label: ServiceName
            - source_labels: [ __meta_ecs_task_definition_family ] 
              action: replace
              target_label: TaskDefinitionFamily       
            - source_labels: [ __meta_ecs_task_container_name ] 
              action: replace
              target_label: container          

processors:
    filter/include:
      metrics:
        include:
          match_type: regexp
          metric_names:
            - ^http_requests_total$  

exporters:
  awsxray:
  awsemf:
    namespace: ECS/ContainerInsights/Prometheus
    log_group_name: '/aws/ecs/containerinsights/{ClusterName}/prometheus'
    dimension_rollup_option: NoDimensionRollup
    metric_declarations:
      - dimensions: [[ClusterName, ServiceName, TaskDefinitionFamily]]
        metric_name_selectors:
          - http_requests_total

service:
  extensions:
    - ecs_observer
    - health_check
    - sigv4auth
  pipelines:
    metrics:
      receivers: [prometheus]
      processors: [filter/include]
      exporters: [awsemf]       
    traces:
      receivers: [awsxray]
      exporters: [awsxray]       
```
