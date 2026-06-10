# EKS Observability : Metriques essentielles

# Contexte actuel

La surveillance est definie comme une solution qui permet aux proprietaires d'infrastructure et d'applications de voir et de comprendre l'etat historique et actuel de leurs systemes, en se concentrant sur la collecte de metriques ou de journaux definis.  

La surveillance a evolue au fil des annees. Nous avons commence par travailler avec des journaux de debogage et des dumps pour deboguer et resoudre les problemes, puis nous sommes passes a une surveillance de base utilisant des outils en ligne de commande comme syslogs, top, etc., avant de progresser vers la possibilite de les visualiser dans un tableau de bord. Avec l'avenement du cloud et l'augmentation de l'echelle, nous suivons aujourd'hui plus que jamais. L'industrie s'est davantage orientee vers l'Observability, qui est definie comme une solution permettant aux proprietaires d'infrastructure et d'applications de depanner et deboguer activement leurs systemes. L'Observability se concentre davantage sur l'analyse des modeles derives des metriques.


# Metriques, pourquoi est-ce important ?

Les metriques sont une serie de valeurs numeriques conservees dans l'ordre de leur creation. Elles sont utilisees pour tout suivre, du nombre de serveurs dans votre environnement, a leur utilisation de disque, au nombre de requetes qu'ils traitent par seconde, ou a la latence pour completer ces requetes. Les metriques sont des donnees qui vous indiquent comment vos systemes fonctionnent. Que vous executiez un petit ou un grand cluster, obtenir des informations sur la sante et les performances de vos systemes vous permet d'identifier les domaines d'amelioration, la capacite de depanner et de tracer un probleme, ainsi que d'ameliorer les performances et l'efficacite de vos charges de travail dans leur ensemble. Ces changements peuvent impacter le temps et les ressources que vous consacrez a votre cluster, ce qui se traduit directement en couts.


# Collecte de metriques

La collecte de metriques d'un cluster EKS se compose de [trois composants](https://aws-observability.github.io/observability-best-practices/recipes/telemetry/) :

1. Sources : d'ou proviennent les metriques comme celles listees dans ce guide.
2. Agents : Applications s'executant dans l'environnement EKS, souvent appelees agent, qui collectent les donnees de surveillance des metriques et poussent ces donnees vers le deuxieme composant. Quelques exemples de ce composant sont [AWS Distro for OpenTelemetry (ADOT)](https://aws-otel.github.io/) et [CloudWatch Agent](https://aws-observability.github.io/observability-best-practices/tools/cloudwatch_agent/)
3. Destinations : Une solution de stockage et d'analyse des donnees de surveillance, ce composant est generalement un service de donnees optimise pour les [donnees au format serie temporelle](https://aws-observability.github.io/observability-best-practices/signals/metrics/). Quelques exemples de ce composant sont [Amazon Managed Service for Prometheus](https://aws.amazon.com/prometheus/) et [AWS CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/deploy-container-insights-EKS.html).

Note : Dans cette section, les exemples de configuration sont des liens vers les sections pertinentes de l'[AWS Observability Accelerator](https://aws-observability.github.io/terraform-aws-observability-accelerator/). Ceci est fait pour s'assurer que vous obtenez des recommandations et des exemples a jour sur les implementations de collecte de metriques EKS.

## Solution Open Source geree

[AWS Distro for OpenTelemetry (ADOT)](https://aws-otel.github.io/) est une version prise en charge du projet [OpenTelemetry](https://opentelemetry.io/) qui permet aux utilisateurs d'envoyer des metriques et des traces correlees vers diverses solutions de collecte de donnees de surveillance comme [Amazon Managed Service for Prometheus](https://aws.amazon.com/prometheus/) et [AWS CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/deploy-container-insights-EKS.html). ADOT peut etre installe via les [EKS Managed Add-ons](https://docs.aws.amazon.com/eks/latest/userguide/eks-add-ons.html) sur un cluster EKS et configure pour collecter des metriques (comme celles listees sur cette page) et des traces de charges de travail. AWS a valide que l'add-on ADOT est compatible avec Amazon EKS, et il est regulierement mis a jour avec les derniers correctifs de bugs et de securite. [Meilleures pratiques ADOT et plus d'informations.](https://aws-observability.github.io/observability-best-practices/guides/operational/adot-at-scale/operating-adot-collector/)


## ADOT + AMP

Le moyen le plus rapide pour commencer avec AWS Distro for OpenTelemetry (ADOT), Amazon Managed Service for Prometheus (AMP) et Amazon Managed Service for Grafana (AMG) est d'utiliser l'[exemple de surveillance d'infrastructure](https://aws-observability.github.io/terraform-aws-observability-accelerator/eks/) de l'AWS Observability Accelerator. Les exemples de l'accelerateur deploient les outils et services dans votre environnement avec une collecte de metriques prete a l'emploi, des regles d'alerte et des tableaux de bord Grafana.

Veuillez consulter la documentation AWS pour plus d'informations sur l'installation, la configuration et l'exploitation de l'[EKS Managed Add-on pour ADOT](https://docs.aws.amazon.com/eks/latest/userguide/opentelemetry.html).

### Sources

Les metriques EKS sont creees a partir de multiples emplacements a differentes couches d'une solution globale. Voici un tableau resumant les sources de metriques mentionnees dans la section des metriques essentielles.


|Couche	|Source	|Outil	|Installation et plus d'informations	|Helm Chart	|
|---	|---	|---	|---	|---	|
|Plan de controle	|*api server endpoint*/metrics	|N/A - le serveur API expose les metriques au format Prometheus directement 	|https://docs.aws.amazon.com/eks/latest/userguide/prometheus.html	|N/A	|
|Etat du cluster	|*kube-state-metrics-http-endpoint*:8080/metrics	|kube-state-metrics	|https://github.com/kubernetes/kube-state-metrics#overview	|https://github.com/kubernetes/kube-state-metrics#helm-chart	|
|Kube Proxy	|*kube-proxy-http*:10249/metrics	|N/A - kube proxy expose les metriques au format Prometheus directement	|https://kubernetes.io/docs/reference/command-line-tools-reference/kube-proxy/	|N/A	|
|VPC CNI	|*vpc-cni-metrics-helper*/metrics	|cni-metrics-helper	|https://github.com/aws/amazon-vpc-cni-k8s/blob/master/cmd/cni-metrics-helper/README.md	|https://github.com/aws/amazon-vpc-cni-k8s/tree/master/charts/cni-metrics-helper	|
|Core DNS	|*core-dns*:9153/metrics	|N/A - Core DNS expose les metriques au format Prometheus directement	|https://github.com/coredns/coredns/tree/master/plugin/metrics	|N/A	|
|Noeud	|*prom-node-exporter-http*:9100/metrics	|prom-node-exporter	|https://github.com/prometheus/node_exporter
https://prometheus.io/docs/guides/node-exporter/#node-exporter-metrics	|https://github.com/prometheus-community/helm-charts/tree/main/charts/prometheus-node-exporter	|
|Kubelet/Pod	|*kubelet*/metrics/cadvisor	|kubelet ou via proxy par le serveur API 	|https://kubernetes.io/docs/concepts/cluster-administration/system-metrics/	|N/A	|

### Agent : AWS Distro for OpenTelemetry

AWS recommande l'installation, la configuration et l'exploitation d'ADOT sur votre cluster EKS via l'add-on gere AWS EKS ADOT. Cet add-on utilise le modele operateur/ressource personnalisee du collecteur ADOT vous permettant de deployer, configurer et gerer plusieurs collecteurs ADOT sur votre cluster. Pour des informations detaillees sur l'installation, la configuration avancee et l'exploitation de cet add-on, consultez cette [documentation](https://aws-otel.github.io/docs/getting-started/adot-eks-add-on).

Note : La console web de l'add-on gere AWS EKS ADOT peut etre utilisee pour la [configuration avancee de l'add-on ADOT](https://docs.aws.amazon.com/eks/latest/userguide/deploy-collector-advanced-configuration.html).

Il y a deux composants dans la configuration du collecteur ADOT.

1. La [configuration du collecteur](https://github.com/aws-observability/aws-otel-community/blob/master/sample-configs/operator/collector-config-amp.yaml) qui inclut le mode de deploiement du collecteur (deployment, daemonset, etc).
2. La [configuration du pipeline OpenTelemetry](https://opentelemetry.io/docs/collector/configuration/) qui inclut quels recepteurs, processeurs et exporteurs sont necessaires pour la collecte de metriques. Exemple de snippet de configuration :

```
config: |
    extensions:
      sigv4auth:
        region: <YOUR_AWS_REGION>
        service: "aps"

    receivers:
      #
      # Scrape configuration for the Prometheus Receiver
      # This is the same configuration used when Prometheus is installed using the community Helm chart
      #  
      prometheus:
        config:
          global:
            scrape_interval: 60s
            scrape_timeout: 10s

          scrape_configs:
          - job_name: kubernetes-apiservers
            bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token
            kubernetes_sd_configs:
            - role: endpoints
            relabel_configs:
            - action: keep
              regex: default;kubernetes;https
              source_labels:
              - __meta_kubernetes_namespace
              - __meta_kubernetes_service_name
              - __meta_kubernetes_endpoint_port_name
            scheme: https
            tls_config:
              ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
              insecure_skip_verify: true

              ...
              ...

    exporters:
      prometheusremotewrite:
        endpoint: <YOUR AMP WRITE ENDPOINT URL>
        auth:
          authenticator: sigv4auth
      logging:
        loglevel: warn
    extensions:
      sigv4auth:
        region: <YOUR_AWS_REGION>
        service: aps
      health_check:
      pprof:
        endpoint: :1888
      zpages:
        endpoint: :55679
    processors:
      batch/metrics:
        timeout: 30s
        send_batch_size: 500
    service:
      extensions: [pprof, zpages, health_check, sigv4auth]
      pipelines:
        metrics:
          receivers: [prometheus]
          processors: [batch/metrics]
          exporters: [logging, prometheusremotewrite]
```

Une configuration complete de collecteur conforme aux meilleures pratiques, une configuration de pipeline ADOT et une configuration de scraping Prometheus peuvent etre trouvees ici en tant que [Helm Chart dans l'Observability Accelerator](https://github.com/aws-observability/terraform-aws-observability-accelerator/blob/main/modules/eks-monitoring/otel-config/templates/opentelemetrycollector.yaml).


### Destination : Amazon Managed Service for Prometheus

Le pipeline du collecteur ADOT utilise les capacites de Prometheus Remote Write pour exporter les metriques vers une instance AMP. Exemple de snippet de configuration, notez l'URL du point de terminaison d'ecriture AMP

```
    exporters:
      prometheusremotewrite:
        endpoint: <YOUR AMP WRITE ENDPOINT URL>
        auth:
          authenticator: sigv4auth
      logging:
        loglevel: warn
```

Une configuration complete de collecteur conforme aux meilleures pratiques, une configuration de pipeline ADOT et une configuration de scraping Prometheus peuvent etre trouvees ici en tant que [Helm Chart dans l'Observability Accelerator](https://github.com/aws-observability/terraform-aws-observability-accelerator/blob/main/modules/eks-monitoring/otel-config/templates/opentelemetrycollector.yaml).

Les meilleures pratiques sur la configuration et l'utilisation d'AMP sont [ici](https://aws-observability.github.io/observability-best-practices/recipes/amp/).

# Quelles sont les metriques pertinentes ?

L'epoque ou vous aviez peu de metriques disponibles est revolue, aujourd'hui c'est le contraire, il y a des centaines de metriques disponibles. Etre capable de determiner quelles sont les metriques pertinentes est important pour construire un systeme avec une mentalite Observability-first.

Ce guide decrit les differents regroupements de metriques disponibles et explique sur lesquelles vous devriez vous concentrer lorsque vous integrez l'observabilite dans votre infrastructure et vos applications. La liste de metriques ci-dessous est celle que nous recommandons de surveiller en fonction des meilleures pratiques.

Les metriques listees dans les sections suivantes s'ajoutent aux metriques mises en evidence dans les [tableaux de bord Grafana de l'AWS Observability Accelerator](https://github.com/aws-observability/terraform-aws-observability-accelerator/tree/main/modules/eks-monitoring) et les [tableaux de bord Kube Prometheus Stack](https://monitoring.mixins.dev/).

## Metriques du plan de controle

Le plan de controle Amazon EKS est gere par AWS pour vous et s'execute dans un compte gere par AWS. Il se compose de noeuds du plan de controle qui executent les composants Kubernetes, tels qu'etcd et le serveur API Kubernetes. Kubernetes publie divers evenements pour informer les utilisateurs des activites dans le cluster, comme le demarrage et l'arret de pods, de deploiements, de namespaces, et plus encore. Le plan de controle Amazon EKS est un composant critique que vous devez surveiller pour vous assurer que les composants principaux sont en mesure de fonctionner correctement et d'effectuer les activites fondamentales requises par votre cluster.

Le serveur API du plan de controle expose des milliers de metriques, le tableau ci-dessous liste les metriques essentielles du plan de controle que nous recommandons de surveiller.

|Nom	|Metrique	|Description	|Raison	|
|---	|---	|---	|---	|
|Total des requetes du serveur API	|apiserver_request_total	|Compteur des requetes du serveur API reparties par verbe, valeur dry run, groupe, version, ressource, portee, composant et code de reponse HTTP.	|	|
|Latence du serveur API	|apiserver_request_duration_seconds	|Distribution de la latence de reponse en secondes pour chaque verbe, valeur dry run, groupe, version, ressource, sous-ressource, portee et composant.	|	|
|Latence des requetes	|rest_client_request_duration_seconds	|Latence des requetes en secondes. Repartie par verbe et URL.	|	|
|Total des requetes	|rest_client_requests_total	|Nombre de requetes HTTP, partitionnees par code d'etat, methode et hote.	|	|
|Duree des requetes du serveur API	|apiserver_request_duration_seconds_bucket	|Mesure la latence pour chaque requete au serveur API Kubernetes en secondes	|	|
|Somme de latence des requetes du serveur API	|apiserver_request_latencies_sum	|Compteur cumulatif qui suit le temps total pris par le serveur API K8 pour traiter les requetes	|	|
|Watchers enregistres du serveur API	|apiserver_registered_watchers	|Le nombre de watchers actuellement enregistres pour une ressource donnee	|	|
|Nombre d'objets du serveur API	|apiserver_storage_object	|Nombre d'objets stockes au moment de la derniere verification, reparti par type.	|	|
|Latence du controleur d'admission	|apiserver_admission_controller_admission_duration_seconds	|Histogramme de latence du controleur d'admission en secondes, identifie par nom et reparti pour chaque operation et ressource API et type (validate ou admit).	|	|
|Latence etcd	|etcd_request_duration_seconds	|Latence des requetes etcd en secondes pour chaque operation et type d'objet.	|	|
|Taille de la base de donnees etcd	|apiserver_storage_db_total_size_in_bytes	|Taille de la base de donnees etcd.	|Cela vous aide a surveiller proactivement l'utilisation de la base de donnees etcd et a eviter de depasser la limite.	|

## Metriques d'etat du cluster

Les metriques d'etat du cluster sont generees par `kube-state-metrics` (KSM). KSM est un utilitaire qui s'execute en tant que pod dans le cluster, ecoutant le serveur API Kubernetes, vous fournissant des informations sur l'etat de votre cluster et les objets Kubernetes de votre cluster sous forme de metriques Prometheus. KSM devra etre [installe](https://github.com/kubernetes/kube-state-metrics) avant que ces metriques ne soient disponibles. Ces metriques sont utilisees par Kubernetes pour effectuer efficacement la planification des pods, et se concentrent sur la sante de divers objets a l'interieur, tels que les deploiements, les replica sets, les noeuds et les pods. Les metriques d'etat du cluster exposent les informations des pods sur le statut, la capacite et la disponibilite. Il est essentiel de suivre les performances de planification de votre cluster pour que vous puissiez surveiller les performances, anticiper les problemes et controler la sante de votre cluster. Le tableau ci-dessous liste les metriques essentielles qui doivent etre suivies.

|Nom	|Metrique	|Description	|
|---	|---	|---	|
|Statut du noeud	|kube_node_status_condition	|Etat de sante actuel du noeud. Retourne un ensemble de conditions du noeud et `true`, `false` ou `unknown` pour chacune	|
|Pods desires	|kube_deployment_spec_replicas ou kube_daemonset_status_desired_number_scheduled	|Nombre de pods specifies pour un Deployment ou DaemonSet	|
|Pods actuels	|kube_deployment_status_replicas ou kube_daemonset_status_current_number_scheduled	|Nombre de pods actuellement en cours d'execution dans un Deployment ou DaemonSet	|
|Capacite de pods	|kube_node_status_capacity_pods	|Maximum de pods autorises sur le noeud	|
|Pods disponibles	|kube_deployment_status_replicas_available ou kube_daemonset_status_number_available	|Nombre de pods actuellement disponibles pour un Deployment ou DaemonSet	|
|Pods indisponibles	|kube_deployment_status_replicas_unavailable ou kube_daemonset_status_number_unavailable	|Nombre de pods actuellement indisponibles pour un Deployment ou DaemonSet	|
|Etat de preparation des pods	|kube_pod_status_ready	|Si un pod est pret a servir les requetes des clients	|
|Statut du pod	|kube_pod_status_phase	|Statut actuel du pod ; la valeur serait pending/running/succeeded/failed/unknown	|
|Raison d'attente du pod	|kube_pod_container_status_waiting_reason	|Raison pour laquelle un conteneur est en etat d'attente	|
|Statut de terminaison du pod	|kube_pod_container_status_terminated	|Si le conteneur est actuellement en etat termine ou non	|
|Pods en attente de planification	|pending_pods	|Nombre de pods en attente d'assignation a un noeud	|
|Tentatives de planification de pods	|pod_scheduling_attempts	|Nombre de tentatives effectuees pour planifier des pods	|

## Metriques des add-ons de cluster

Les add-ons de cluster sont des logiciels qui fournissent des capacites operationnelles de support aux applications Kubernetes. Cela inclut des logiciels comme les agents d'observabilite ou les pilotes Kubernetes qui permettent au cluster d'interagir avec les ressources AWS sous-jacentes pour le reseau, le calcul et le stockage. Les logiciels d'add-on sont generalement construits et maintenus par la communaute Kubernetes, les fournisseurs cloud comme AWS ou des fournisseurs tiers. Amazon EKS installe automatiquement des add-ons autogeres tels que le plugin Amazon VPC CNI pour Kubernetes, `kube-proxy` et CoreDNS pour chaque cluster.

Ces add-ons de cluster fournissent un support operationnel dans differents domaines comme le reseau, la resolution de noms de domaine, etc. Ils vous fournissent des informations sur le fonctionnement de l'infrastructure et des composants de support critiques. Le suivi des metriques des add-ons est important pour comprendre la sante operationnelle de votre cluster.

Voici les add-ons essentiels que vous devriez envisager de surveiller ainsi que leurs metriques essentielles.

## Plugin Amazon VPC CNI

Amazon EKS implemente le reseau de cluster via le plugin Amazon VPC Container Network Interface (VPC CNI). Le plugin CNI permet aux Pods Kubernetes d'avoir la meme adresse IP que sur le reseau VPC. Plus precisement, tous les conteneurs a l'interieur du Pod partagent un espace de noms reseau, et ils peuvent communiquer entre eux en utilisant des ports locaux. L'add-on VPC CNI vous permet de garantir en continu la securite et la stabilite de vos clusters Amazon EKS et de reduire l'effort necessaire pour installer, configurer et mettre a jour les add-ons.

Les metriques de l'add-on VPC CNI sont exposees par le CNI Metrics Helper. La surveillance de l'allocation d'adresses IP est fondamentale pour assurer un cluster sain et eviter les problemes d'epuisement d'IP. [Voici les dernieres meilleures pratiques de reseau et les metriques VPC CNI a collecter et surveiller](https://aws.github.io/aws-eks-best-practices/networking/vpc-cni/#monitor-ip-address-inventory).

## Metriques CoreDNS

CoreDNS est un serveur DNS flexible et extensible qui peut servir de DNS de cluster Kubernetes. Les pods CoreDNS fournissent la resolution de noms pour tous les pods du cluster. L'execution de charges de travail intensives en DNS peut parfois rencontrer des echecs CoreDNS intermittents dus au throttling DNS, et cela peut impacter les applications.  

Consultez les dernieres meilleures pratiques pour le suivi des [metriques de performance CoreDNS cles ici](https://aws.github.io/aws-eks-best-practices/reliability/docs/dataplane/#monitor-coredns-metrics) et la [surveillance du trafic CoreDNS pour les problemes de throttling DNS](https://aws.github.io/aws-eks-best-practices/networking/monitoring/)


## Metriques de Pod/Conteneur

Le suivi de l'utilisation a travers toutes les couches de votre application est important, cela inclut un examen plus approfondi de vos noeuds et pods s'executant dans votre cluster. Parmi toutes les metriques disponibles au niveau du pod, cette liste de metriques est d'utilite pratique pour comprendre l'etat des charges de travail s'executant sur votre cluster. Le suivi de l'utilisation du CPU, de la memoire et du reseau permet de diagnostiquer et de depanner les problemes lies aux applications. Le suivi de vos metriques de charge de travail vous fournit des informations sur l'utilisation de vos ressources pour dimensionner correctement vos charges de travail s'executant sur EKS.

|Metrique	|Exemple de requete PromQL	|Dimension	|
|---	|---	|---	|
|Nombre de pods en cours d'execution par namespace	|count by(namespace) (kube_pod_info)	|Par cluster par namespace	|
|Utilisation CPU par conteneur par pod	|sum(rate(container_cpu_usage_seconds_total\{container!=""\}[5m])) by (namespace, pod)	|Par cluster par namespace par pod	|
|Utilisation memoire par pod	|sum(container_memory_usage_bytes\{container!=""\}) by (namespace, pod)	|Par cluster par namespace par pod	|
|Octets reseau recus par pod	|sum by(pod) (rate(container_network_receive_bytes_total[5m]))	|Par cluster par namespace par pod	|
|Octets reseau transmis par pod	|sum by(pod) (rate(container_network_transmit_bytes_total[5m]))	|Par cluster par namespace par pod	|
|Nombre de redemarrages de conteneur par conteneur	|increase(kube_pod_container_status_restarts_total[15m]) > 3	|Par cluster par namespace par pod	|

## Metriques de noeud

Kube State Metrics et Prometheus node exporter collectent des statistiques de metriques sur les noeuds de votre cluster. Le suivi du statut de vos noeuds, de l'utilisation du CPU, de la memoire, du systeme de fichiers et du trafic est important pour comprendre l'utilisation de vos noeuds. Comprendre comment les ressources de vos noeuds sont utilisees est important pour selectionner correctement les types d'instances et le stockage pour supporter efficacement les types de charges de travail que vous prevoyez d'executer sur votre cluster. Les metriques ci-dessous font partie des metriques essentielles que vous devriez suivre.


|Metrique	|Exemple de requete PromQL	|Dimension	|
|---	|---	|---	|
|Utilisation CPU du noeud	|sum(rate(container_cpu_usage_seconds_total\{container!=""\}[5m])) by (node)	|Par cluster par noeud	|
|Utilisation memoire du noeud	|sum(container_memory_usage_bytes\{container!=""\}) by (node)	|Par cluster par noeud	|
|Total octets reseau du noeud	|sum by (instance) (rate(node_network_receive_bytes_total[3m]))+sum by (instance) (rate(node_network_transmit_bytes_total[3m]))	|Par cluster par noeud	|
|Capacite CPU reservee du noeud	|sum(kube_node_status_capacity\{cluster!=""\}) by (node)	|Par cluster par noeud	|
|Nombre de pods en cours d'execution par noeud	|sum(kubelet_running_pods) by (instance)	|Par cluster par noeud	||Utilisation du systeme de fichiers du noeud	|rate(container_fs_reads_bytes_total\{job="kubelet", device=~"mmcblk.p.+|.*nvme.+|rbd.+|sd.+|vd.+|xvd.+|dm-.+|dasd.+", container!="", cluster="", namespace!=""\}[$__rate_interval]) + rate(container_fs_writes_bytes_total\{job="kubelet", device=~"mmcblk.p|.*nvme.+|rbd.+|sd.+|vd.+|xvd.+|dm-.+|dasd.+",container!="", cluster="", namespace!=""\}	|Par cluster par noeud	|
|Utilisation CPU du cluster	|sum(rate(node_cpu_seconds_total\{mode!="idle",mode!="iowait",mode!="steal"\}[5m]))	|Par cluster	|
|Utilisation memoire du cluster	|1 - sum(:node_memory_MemAvailable_bytes:sum\{cluster=""\}) / sum(node_memory_MemTotal_bytes\job="node-exporter",cluster=""\})	|Par cluster	|
|Total octets reseau du cluster	|sum(rate(node_network_receive_bytes_total[3m]))+sum(rate(node_network_transmit_bytes_total[3m]))	|Par cluster	|
|Nombre de pods en cours d'execution	|sum(kubelet_running_pod_count\{cluster=""\})	|Par cluster	|
|Nombre de conteneurs en cours d'execution	|sum(kubelet_running_container_count\{cluster=""\})	|Par cluster	|
|Limite CPU du cluster	|sum(kube_node_status_allocatable\{resource="cpu"\})	|Par cluster	|
|Limite memoire du cluster	|sum(kube_node_status_allocatable\{resource="memory"\})	|Par cluster	|
|Nombre de noeuds du cluster	|count(kube_node_info) OR sum(kubelet_node_name\{cluster=""\})	|Par cluster	|

# Ressources supplementaires

## Services AWS

[https://aws-otel.github.io/](https://aws-otel.github.io/)

[https://aws.amazon.com/prometheus](https://aws.amazon.com/prometheus)

[https://aws.amazon.com/cloudwatch/features/](https://aws.amazon.com/cloudwatch/features/)

## Blogs

[https://aws.amazon.com/blogs/containers/](https://aws.amazon.com/blogs/containers/)

[https://aws.amazon.com/blogs/containers/metrics-and-traces-collection-using-amazon-eks-add-ons-for-aws-distro-for-opentelemetry/](https://aws.amazon.com/blogs/containers/metrics-and-traces-collection-using-amazon-eks-add-ons-for-aws-distro-for-opentelemetry/)

[https://aws.amazon.com/blogs/containers/](https://aws.amazon.com/blogs/containers/)

[https://aws.amazon.com/blogs/containers/introducing-amazon-cloudwatch-container-insights-for-amazon-eks-fargate-using-aws-distro-for-opentelemetry/](https://aws.amazon.com/blogs/containers/introducing-amazon-cloudwatch-container-insights-for-amazon-eks-fargate-using-aws-distro-for-opentelemetry/)

## Ressources Infrastructure as Code

[https://github.com/aws-observability/terraform-aws-observability-accelerator](https://github.com/aws-observability/terraform-aws-observability-accelerator)

[https://github.com/aws-ia/terraform-aws-eks-blueprints](https://github.com/aws-ia/terraform-aws-eks-blueprints)
