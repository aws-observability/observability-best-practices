# Collecte de metriques de service avec Container Insights
Les metriques de service sont des metriques au niveau applicatif qui sont capturees en ajoutant de l'instrumentation a votre code. Ces metriques peuvent etre capturees a partir d'une application en utilisant deux approches differentes. 

1. Approche push : Ici, une application envoie les donnees de metriques directement vers une destination. Par exemple, en utilisant l'API CloudWatch PutMetricData, une application peut publier des points de donnees de metriques vers CloudWatch. Une application peut egalement envoyer les donnees via gRPC ou HTTP en utilisant le protocole OpenTelemetry (OTLP) vers un agent tel que le collecteur OpenTelemetry. Ce dernier enverra ensuite les donnees de metriques vers la destination finale.
2. Approche pull : Ici, l'application expose les donnees de metriques a un point de terminaison HTTP dans un format predefini. Les donnees sont ensuite scrutees par un agent qui a acces a ce point de terminaison puis envoyees vers la destination.

![Approche push pour la collecte de metriques](../../../../images/PushPullApproach.png)

## Surveillance CloudWatch Container Insights pour Prometheus
[Prometheus](https://prometheus.io/docs/introduction/overview/) est un toolkit populaire open source de surveillance et d'alerte des systemes. Il est devenu la norme de facto pour la collecte de metriques utilisant l'approche pull a partir d'applications conteneurisees. Pour capturer des metriques avec Prometheus, vous devrez d'abord instrumenter votre code applicatif en utilisant la [bibliotheque cliente](https://prometheus.io/docs/instrumenting/clientlibs/) Prometheus qui est disponible dans tous les principaux langages de programmation. Les metriques sont generalement exposees par l'application via HTTP, pour etre lues par le serveur Prometheus.
Lorsque le serveur Prometheus scrute le point de terminaison HTTP de votre application, la bibliotheque cliente envoie l'etat actuel de toutes les metriques suivies au serveur. Le serveur peut soit stocker les metriques dans un stockage local qu'il gere, soit envoyer les donnees de metriques vers une destination distante telle que CloudWatch.

[CloudWatch Container Insights monitoring for Prometheus](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights-Prometheus.html) vous permet d'exploiter les capacites de Prometheus dans un cluster Amazon ECS. Il est disponible pour les clusters Amazon ECS deployes sur EC2 et Fargate. L'agent CloudWatch peut etre utilise comme remplacement direct d'un serveur Prometheus, reduisant le nombre d'outils de surveillance necessaires pour ameliorer l'observabilite. Il automatise la decouverte des metriques Prometheus a partir d'applications conteneurisees deployees sur Amazon ECS et envoie les donnees de metriques a CloudWatch sous forme d'evenements de journaux de performance. 

:::info
    Les etapes pour deployer l'agent CloudWatch avec la collecte de metriques Prometheus sur un cluster Amazon ECS sont documentees dans le [Guide de l'utilisateur Amazon CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights-Prometheus-install-ECS.html)
:::
:::warning
    Les metriques collectees par Container Insights monitoring for Prometheus sont facturees en tant que metriques personnalisees. Pour plus d'informations sur la tarification CloudWatch, consultez [Tarification Amazon CloudWatch](https://aws.amazon.com/cloudwatch/pricing/)
:::
### Decouverte automatique des cibles sur les clusters Amazon ECS
L'agent CloudWatch prend en charge les configurations de scraping Prometheus standard dans la section [scrape_config](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#scrape_config) de la documentation Prometheus. Prometheus prend en charge la decouverte statique et dynamique des cibles de scraping en utilisant l'un des dizaines de [mecanismes de decouverte de services](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#scrape_config) pris en charge. Comme Amazon ECS ne dispose pas de mecanisme integre de decouverte de services, l'agent s'appuie sur le support de Prometheus pour la decouverte de cibles basee sur des fichiers. Pour configurer l'agent pour la decouverte de cibles basee sur des fichiers, l'agent a besoin de deux [parametres de configuration](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights-Prometheus-Setup-configure-ECS.html), qui sont tous deux definis dans la definition de tache utilisee pour lancer l'agent. Vous pouvez personnaliser ces parametres pour avoir un controle granulaire sur les metriques collectees par l'agent.

Le premier parametre contient la configuration globale Prometheus qui ressemble a l'exemple suivant :

```
global:
  scrape_interval: 30s
  scrape_timeout: 10s
scrape_configs:
  - job_name: cwagent_ecs_auto_sd
    sample_limit: 10000
    file_sd_configs:
      - files: [ "/tmp/cwagent_ecs_auto_sd.yaml" ] 
```

Le second parametre contient la configuration qui aide l'agent a decouvrir les cibles de scraping. L'agent effectue periodiquement des appels API vers Amazon ECS pour recuperer les metadonnees des taches ECS en cours d'execution qui correspondent aux modeles de definition de tache definis dans la section *ecs_service_discovery* de cette configuration. Toutes les cibles decouvertes sont ecrites dans le fichier resultat */tmp/cwagent_ecs_auto_sd.yaml* qui reside sur le systeme de fichiers monte dans le conteneur de l'agent CloudWatch. L'exemple de configuration ci-dessous entrainera le scraping par l'agent des metriques de toutes les taches nommees avec le prefixe *BackendTask*. Consultez le [guide detaille](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights-Prometheus-Setup-autodiscovery-ecs.html) pour la decouverte automatique des cibles dans un cluster Amazon ECS.

```
{
   "logs":{
      "metrics_collected":{
         "prometheus":{
            "log_group_name":"/aws/ecs/containerinsights/{ClusterName}/prometheus"
            "prometheus_config_path":"env:PROMETHEUS_CONFIG_CONTENT",
            "ecs_service_discovery":{
               "sd_frequency":"1m",
               "sd_result_file":"/tmp/cwagent_ecs_auto_sd.yaml",
               "task_definition_list":[
                  {
                     "sd_job_name":"backends",
                     "sd_metrics_ports":"3000",
                     "sd_task_definition_arn_pattern":".*:task-definition/BackendTask:[0-9]+",
                     "sd_metrics_path":"/metrics"
                  }
               ]
            },
            "emf_processor":{
               "metric_declaration":[
                  {
                     "source_labels":[
                        "job"
                     ],
                     "label_matcher":"^backends$",
                     "dimensions":[
                        [
                           "ClusterName",
                           "TaskGroup"
                        ]
                     ],
                     "metric_selectors":[
                        "^http_requests_total$"
                     ]
                  }
               ]
            }
         }
      },
      "force_flush_interval":5
   }
}
```

### Importation des metriques Prometheus dans CloudWatch
Les metriques collectees par l'agent sont envoyees a CloudWatch sous forme d'evenements de journaux de performance bases sur les regles de filtrage specifiees dans la section *metric_declaration* de la configuration. Cette section est egalement utilisee pour specifier le tableau de journaux avec format de metriques integre a generer. L'exemple de configuration ci-dessus generera des evenements de journaux, comme indique ci-dessous, uniquement pour une metrique nommee *http_requests_total* avec le label *job:backends*. En utilisant ces donnees, CloudWatch creera la metrique *http_requests_total* sous l'espace de noms CloudWatch *ECS/ContainerInsights/Prometheus* avec les dimensions *ClusterName* et *TaskGroup*.
```
{
   "CloudWatchMetrics":[
      {
         "Metrics":[
            {
               "Name":"http_requests_total"
            }
         ],
         "Dimensions":[
            [
               "ClusterName",
               "TaskGroup"
            ]
         ],
         "Namespace":"ECS/ContainerInsights/Prometheus"
      }
   ],
   "ClusterName":"ecs-sarathy-cluster",
   "LaunchType":"EC2",
   "StartedBy":"ecs-svc/4964126209508453538",
   "TaskDefinitionFamily":"BackendAlarmTask",
   "TaskGroup":"service:BackendService",
   "TaskRevision":"4",
   "Timestamp":"1678226606712",
   "Version":"0",
   "container_name":"go-backend",
   "exported_job":"storebackend",
   "http_requests_total":36,
   "instance":"10.10.100.191:3000",
   "job":"backends",
   "path":"/popular/category",
   "prom_metric_type":"counter"
}
```
