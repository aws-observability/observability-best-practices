# Amazon CloudWatch Container Insights

Dans cette section du guide des meilleures pratiques d'Observability, nous allons approfondir les sujets suivants lies a Amazon CloudWatch Container Insights :

* Introduction a Amazon CloudWatch Container Insights
* Utilisation d'Amazon CloudWatch Container Insights avec AWS Distro for Open Telemetry
* Integration de Fluent Bit dans CloudWatch Container Insights pour Amazon EKS
* Optimisation des couts avec Container Insights sur Amazon EKS
* Utilisation d'EKS Blueprints pour configurer Container Insights

### Introduction

[Amazon CloudWatch Container Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html) aide les clients a collecter, agreger et synthetiser les metriques et les journaux des applications conteneurisees et des microservices. Les donnees de metriques sont collectees sous forme d'evenements de journal de performance en utilisant le [format de metrique integre](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html). Ces evenements de journal de performance utilisent un schema JSON structure qui permet l'ingestion et le stockage de donnees a haute cardinalite a grande echelle. A partir de ces donnees, CloudWatch cree des metriques agregees au niveau du cluster, du noeud, du pod, de la tache et du service en tant que metriques CloudWatch. Les metriques collectees par Container Insights sont disponibles dans les tableaux de bord automatiques de CloudWatch. Container Insights est disponible pour les clusters Amazon EKS avec des groupes de noeuds autogeres, des groupes de noeuds manages et des profils AWS Fargate.

Du point de vue de l'optimisation des couts et pour vous aider a gerer les couts de Container Insights, CloudWatch ne cree pas automatiquement toutes les metriques possibles a partir des donnees de journal. Cependant, vous pouvez visualiser des metriques supplementaires et des niveaux de granularite additionnels en utilisant CloudWatch Logs Insights pour analyser les evenements de journal de performance bruts. Les metriques collectees par Container Insights sont facturees en tant que metriques personnalisees. Pour plus d'informations sur la tarification CloudWatch, consultez [Amazon CloudWatch Pricing](https://aws.amazon.com/cloudwatch/pricing/).

Dans Amazon EKS, Container Insights utilise une version conteneurisee de l'[agent CloudWatch](https://gallery.ecr.aws/cloudwatch-agent/cloudwatch-agent) fournie par Amazon via Amazon Elastic Container Registry pour decouvrir tous les conteneurs en cours d'execution dans un cluster. Il collecte ensuite les donnees de performance a chaque niveau de la pile de performance. Container Insights prend en charge le chiffrement avec la cle AWS KMS pour les journaux et les metriques qu'il collecte. Pour activer ce chiffrement, vous devez activer manuellement le chiffrement AWS KMS pour le groupe de journaux qui recoit les donnees de Container Insights. Cela a pour effet que CloudWatch Container Insights chiffre ces donnees en utilisant la cle AWS KMS fournie. Seules les cles symetriques sont prises en charge et les cles AWS KMS asymetriques ne sont pas prises en charge pour chiffrer vos groupes de journaux. Container Insights est pris en charge uniquement sur les instances Linux. Container Insights pour Amazon EKS est pris en charge dans [ces](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html#:~:text=Container%20Insights%20for%20Amazon%20EKS%20and%20Kubernetes%20is%20supported%20in%20the%20following%20Regions%3A) regions AWS.

### Utilisation d'Amazon CloudWatch Container Insights avec AWS Distro for Open Telemetry

Nous allons maintenant approfondir [AWS Distro for OpenTelemetry (ADOT)](https://aws-otel.github.io/docs/introduction) qui est l'une des options pour permettre la collecte de metriques Container Insights a partir des charges de travail Amazon EKS. [AWS Distro for OpenTelemetry (ADOT)](https://aws-otel.github.io/docs/introduction) est une distribution securisee et supportee par AWS du projet [OpenTelemetry](https://opentelemetry.io/docs/). Avec ADOT, les utilisateurs peuvent instrumenter leurs applications une seule fois pour envoyer des metriques et des traces correlees a plusieurs solutions de surveillance. Avec le support ADOT pour CloudWatch Container Insights, les clients peuvent collecter des metriques systeme telles que l'utilisation du CPU, de la memoire, du disque et du reseau a partir de clusters Amazon EKS fonctionnant sur [Amazon Elastic Cloud Compute](https://aws.amazon.com/pm/ec2/?trk=ps_a134p000004f2ZFAAY&trkCampaign=acq_paid_search_brand&sc_channel=PS&sc_campaign=acquisition_US&sc_publisher=Google&sc_category=Cloud%20Computing&sc_country=US&sc_geo=NAMER&sc_outcome=acq&sc_detail=amazon%20ec2&sc_content=EC2_e&sc_matchtype=e&sc_segment=467723097970&sc_medium=ACQ-P|PS-GO|Brand|Desktop|SU|Cloud%20Computing|EC2|US|EN|Text&s_kwcid=AL!4422!3!467723097970!e!!g!!amazon%20ec2&ef_id=Cj0KCQiArt6PBhCoARIsAMF5waj-FXPUD0G-cm0dJ05Mz6aXDvqEGu-S7pCXwvVusULN6ZbPbc_Alg8aArOHEALw_wcB:G:s&s_kwcid=AL!4422!3!467723097970!e!!g!!amazon%20ec2) (Amazon EC2), offrant la meme experience que l'agent Amazon CloudWatch. ADOT Collector est maintenant disponible avec le support de CloudWatch Container Insights pour Amazon EKS et le profil AWS Fargate pour Amazon EKS. Les clients peuvent desormais collecter des metriques de conteneurs et de pods telles que l'utilisation du CPU et de la memoire pour leurs pods deployes sur un cluster Amazon EKS et les visualiser dans les tableaux de bord CloudWatch sans aucune modification de leur experience CloudWatch Container Insights existante. Cela permettra aux clients de determiner egalement s'il faut augmenter ou diminuer la capacite pour repondre au trafic et economiser des couts.

L'ADOT Collector a le [concept de pipeline](https://opentelemetry.io/docs/collector/configuration/) qui comprend trois types cles de composants, a savoir le recepteur, le processeur et l'exportateur. Un [recepteur](https://opentelemetry.io/docs/collector/configuration/#receivers) est la maniere dont les donnees entrent dans le collecteur. Il accepte les donnees dans un format specifie, les traduit dans le format interne et les transmet aux [processeurs](https://opentelemetry.io/docs/collector/configuration/#processors) et [exportateurs](https://opentelemetry.io/docs/collector/configuration/#exporters) definis dans le pipeline. Il peut etre base sur un modele pull ou push. Un processeur est un composant optionnel utilise pour effectuer des taches telles que le traitement par lots, le filtrage et les transformations sur les donnees entre la reception et l'exportation. Un exportateur est utilise pour determiner vers quelle destination envoyer les metriques, les journaux ou les traces. L'architecture du collecteur permet de definir plusieurs instances de tels pipelines via une configuration YAML. Les diagrammes suivants illustrent les composants de pipeline dans une instance d'ADOT Collector deployee sur Amazon EKS et Amazon EKS avec un profil Fargate.

![CW-ADOT-EKS](../../../../images/Containers/aws-native/eks/cw-adot-collector-pipeline-eks.jpg)

*Figure : Composants de pipeline dans une instance d'ADOT Collector deployee sur Amazon EKS*

Dans l'architecture ci-dessus, nous utilisons une instance d'[AWS Container Insights Receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/awscontainerinsightreceiver) dans le pipeline et collectons les metriques directement depuis le Kubelet. AWS Container Insights Receiver (`awscontainerinsightreceiver`) est un recepteur specifique a AWS qui prend en charge [CloudWatch Container Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html). CloudWatch Container Insights collecte, agrege et synthetise les metriques et les journaux de vos applications conteneurisees et microservices. Les donnees sont collectees sous forme d'evenements de journal de performance en utilisant le [format de metrique integre](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html). A partir des donnees EMF, Amazon CloudWatch peut creer les metriques CloudWatch agregees au niveau du cluster, du noeud, du pod, de la tache et du service. Voici un exemple de configuration `awscontainerinsightreceiver` :

```
receivers:
  awscontainerinsightreceiver:
    # all parameters are optional
    collection_interval: 60s
    container_orchestrator: eks
    add_service_as_attribute: true 
    prefer_full_pod_name: false 
    add_full_pod_name_metric_label: false 
```

Cela implique le deploiement du collecteur en tant que DaemonSet en utilisant la configuration ci-dessus sur Amazon EKS. Vous aurez egalement acces a un ensemble plus complet de metriques collectees par ce recepteur directement depuis le Kubelet. Avoir plus d'une instance d'ADOT Collector suffira pour collecter les metriques de ressources de tous les noeuds d'un cluster. Avoir une seule instance d'ADOT Collector peut etre ecrasant lors de charges elevees, il est donc toujours recommande de deployer plus d'un collecteur.

![CW-ADOT-FARGATE](../../../../images/Containers/aws-native/eks/cw-adot-collector-pipeline.jpg)

*Figure : Composants de pipeline dans une instance d'ADOT Collector deployee sur Amazon EKS avec un profil Fargate*

Dans l'architecture ci-dessus, le kubelet sur un noeud worker dans un cluster Kubernetes expose les metriques de ressources telles que l'utilisation du CPU, de la memoire, du disque et du reseau au endpoint */metrics/cadvisor*. Cependant, dans l'architecture reseau d'EKS Fargate, un pod n'est pas autorise a atteindre directement le kubelet sur ce noeud worker. Par consequent, l'ADOT Collector appelle le serveur API Kubernetes pour proxifier la connexion au kubelet sur un noeud worker, et collecter les metriques cAdvisor du kubelet pour les charges de travail sur ce noeud. Ces metriques sont rendues disponibles au format Prometheus. Par consequent, le collecteur utilise une instance de [Prometheus Receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/prometheusreceiver) comme remplacement direct d'un serveur Prometheus et scrape ces metriques depuis le endpoint du serveur API Kubernetes. En utilisant la decouverte de services Kubernetes, le recepteur peut decouvrir tous les noeuds worker dans un cluster EKS. Par consequent, plus d'une instance d'ADOT Collector suffira pour collecter les metriques de ressources de tous les noeuds d'un cluster. Avoir une seule instance d'ADOT Collector peut etre ecrasant lors de charges elevees, il est donc toujours recommande de deployer plus d'un collecteur.

Les metriques passent ensuite par une serie de processeurs qui effectuent le filtrage, le renommage, l'agregation et la conversion des donnees, etc. Voici la liste des processeurs utilises dans le pipeline d'une instance d'ADOT Collector pour Amazon EKS illustree ci-dessus.

* [Filter Processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/filterprocessor) fait partie de la distribution AWS OpenTelemetry pour inclure ou exclure des metriques en fonction de leur nom. Il peut etre utilise dans le pipeline de collecte de metriques pour filtrer les metriques non desirees. Par exemple, supposons que vous souhaitiez que Container Insights ne collecte que les metriques au niveau du pod (avec le prefixe de nom `pod_`) en excluant celles pour le reseau, avec le prefixe de nom `pod_network`.

```
      # filter out only renamed metrics which we care about
      filter:
        metrics:
          include:
            match_type: regexp
            metric_names:
              - new_container_.*
              - pod_.*
```

* [Metrics Transform Processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/metricstransformprocessor) peut etre utilise pour renommer des metriques, et ajouter, renommer ou supprimer des cles et valeurs de labels. Il peut egalement etre utilise pour effectuer des mises a l'echelle et des agregations sur les metriques a travers les labels ou les valeurs de labels.

```
     metricstransform/rename:
        transforms:
          - include: container_spec_cpu_quota
            new_name: new_container_cpu_limit_raw
            action: insert
            match_type: regexp
            experimental_match_labels: {"container": "\\S"}
```

* [Cumulative to Delta Processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/cumulativetodeltaprocessor) convertit les metriques de somme cumulative monotone et d'histogramme en metriques delta monotones. Les sommes non monotones et les histogrammes exponentiels sont exclus.

```
` # convert cumulative sum datapoints to delta
 cumulativetodelta:
    metrics:
        - pod_cpu_usage_seconds_total 
        - pod_network_rx_errors`
```

* [Delta to Rate Processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/deltatorateprocessor) pour convertir les metriques de somme delta en metriques de taux. Ce taux est une jauge.

```
` # convert delta to rate
    deltatorate:
        metrics:
            - pod_memory_hierarchical_pgfault 
            - pod_memory_hierarchical_pgmajfault 
            - pod_network_rx_bytes 
            - pod_network_rx_dropped 
            - pod_network_rx_errors 
            - pod_network_tx_errors 
            - pod_network_tx_packets 
            - new_container_memory_pgfault 
            - new_container_memory_pgmajfault 
            - new_container_memory_hierarchical_pgfault 
            - new_container_memory_hierarchical_pgmajfault`
```

* [Metrics Generation Processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/metricsgenerationprocessor) peut etre utilise pour creer de nouvelles metriques en utilisant des metriques existantes selon une regle donnee.

```
      experimental_metricsgeneration/1:
        rules:
          - name: pod_memory_utilization_over_pod_limit
            unit: Percent
            type: calculate
            metric1: pod_memory_working_set
            metric2: pod_memory_limit
            operation: percent
```

Le composant final du pipeline est [AWS CloudWatch EMF Exporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/awsemfexporter), qui convertit les metriques au format de metrique integre (EMF) puis les envoie directement a CloudWatch Logs en utilisant l'API [PutLogEvents](https://docs.aws.amazon.com/AmazonCloudWatchLogs/latest/APIReference/API_PutLogEvents.html). La liste suivante de metriques est envoyee a CloudWatch par l'ADOT Collector pour chacune des charges de travail fonctionnant sur Amazon EKS.

* pod_cpu_utilization_over_pod_limit
* pod_cpu_usage_total
* pod_cpu_limit
* pod_memory_utilization_over_pod_limit
* pod_memory_working_set
* pod_memory_limit
* pod_network_rx_bytes
* pod_network_tx_bytes

Chaque metrique sera associee aux ensembles de dimensions suivants et collectee sous l'espace de noms CloudWatch nomme *ContainerInsights*.

* ClusterName, LaunchType
* ClusterName, Namespace, LaunchType
* ClusterName, Namespace, PodName, LaunchType

De plus, veuillez en apprendre davantage sur le [support Prometheus de Container Insights pour ADOT](https://aws.amazon.com/blogs/containers/introducing-cloudwatch-container-insights-prometheus-support-with-aws-distro-for-opentelemetry-on-amazon-ecs-and-amazon-eks/) et le [deploiement de l'ADOT Collector sur Amazon EKS pour visualiser les metriques de ressources Amazon EKS en utilisant CloudWatch Container Insights](https://aws.amazon.com/blogs/containers/introducing-amazon-cloudwatch-container-insights-for-amazon-eks-fargate-using-aws-distro-for-opentelemetry/) pour configurer le pipeline de l'ADOT Collector dans votre cluster Amazon EKS et comment visualiser vos metriques de ressources Amazon EKS dans CloudWatch Container Insights. De plus, veuillez consulter [Easily Monitor Containerized Applications with Amazon CloudWatch Container Insights](https://community.aws/tutorials/navigating-amazon-eks/eks-monitor-containerized-applications#step-3-use-cloudwatch-logs-insights-query-to-search-and-analyze-container-logs), qui inclut des instructions etape par etape sur la configuration d'un cluster Amazon EKS, le deploiement d'une application conteneurisee et la surveillance des performances de l'application en utilisant Container Insights.

### Integration de Fluent Bit dans CloudWatch Container Insights pour Amazon EKS

[Fluent Bit](https://fluentbit.io/) est un processeur et transfereur de journaux open source et multiplateforme qui vous permet de collecter des donnees et des journaux a partir de differentes sources, de les unifier et de les envoyer vers differentes destinations, y compris CloudWatch Logs. Il est egalement entierement compatible avec les environnements [Docker](https://www.docker.com/) et [Kubernetes](https://kubernetes.io/). En utilisant le DaemonSet Fluent Bit nouvellement lance, vous pouvez envoyer les journaux de conteneurs de vos clusters EKS vers CloudWatch Logs pour le stockage et l'analyse des journaux.

Grace a sa nature legere, l'utilisation de Fluent Bit comme transfereur de journaux par defaut dans Container Insights sur les noeuds worker EKS vous permettra de diffuser les journaux d'application vers CloudWatch Logs de maniere efficace et fiable. Avec Fluent Bit, Container Insights est capable de delivrer des milliers de journaux critiques pour l'entreprise a grande echelle de maniere efficiente en termes de ressources, en particulier en termes d'utilisation du CPU et de la memoire au niveau du pod. En d'autres termes, compare a FluentD, qui etait le transfereur de journaux utilise precedemment, Fluent Bit a une empreinte de ressources plus petite et est, par consequent, plus efficace en termes de memoire et de CPU. D'autre part, l'[image AWS for Fluent Bit](https://github.com/aws/aws-for-fluent-bit), qui inclut Fluent Bit et les plugins associes, donne a Fluent Bit une flexibilite supplementaire pour adopter plus rapidement les nouvelles fonctionnalites AWS car l'image vise a fournir une experience unifiee au sein de l'ecosysteme AWS.

L'architecture ci-dessous montre les composants individuels utilises par CloudWatch Container Insights pour EKS :

![CW-COMPONENTS](../../../../images/Containers/aws-native/eks/cw-components.jpg)

*Figure : Composants individuels utilises par CloudWatch Container Insights pour EKS.*

Lorsque vous travaillez avec des conteneurs, il est recommande de pousser tous les journaux, y compris les journaux d'application, via la sortie standard (stdout) et la sortie d'erreur standard (stderr) chaque fois que possible en utilisant le pilote de journalisation Docker JSON. Pour cette raison, dans EKS, le pilote de journalisation est configure par defaut et tout ce qu'une application conteneurisee ecrit sur `stdout` ou `stderr` est diffuse dans un fichier JSON sous `"/var/log/containers"` sur le noeud worker. Container Insights classifie ces journaux en trois categories differentes par defaut et cree des flux d'entree dedies pour chaque categorie dans Fluent Bit et des groupes de journaux independants dans CloudWatch Logs. Ces categories sont :

* Journaux d'application : Tous les journaux d'application stockes sous `"/var/log/containers/*.log"` sont diffuses dans le groupe de journaux dedie `/aws/containerinsights/Cluster_Name/application`. Tous les journaux non applicatifs tels que les journaux kube-proxy et aws-node sont exclus par defaut. Cependant, les journaux d'add-ons Kubernetes supplementaires, tels que les journaux CoreDNS, sont egalement traites et diffuses dans ce groupe de journaux.
* Journaux de l'hote : Les journaux systeme pour chaque noeud worker EKS sont diffuses dans le groupe de journaux `/aws/containerinsights/Cluster_Name/host`. Ces journaux systeme incluent le contenu des fichiers `"/var/log/messages,/var/log/dmesg,/var/log/secure"`. Compte tenu de la nature sans etat et dynamique des charges de travail conteneurisees, ou les noeuds worker EKS sont souvent termines lors des activites de mise a l'echelle, diffuser ces journaux en temps reel avec Fluent Bit et avoir ces journaux disponibles dans CloudWatch Logs, meme apres la terminaison du noeud, est critique en termes d'observabilite et de surveillance de la sante des noeuds worker EKS. Cela vous permet egalement de deboguer ou de resoudre les problemes de cluster sans vous connecter aux noeuds worker dans de nombreux cas et d'analyser ces journaux de maniere plus systematique.
* Journaux du plan de donnees : EKS fournit deja les [journaux du plan de controle](https://docs.aws.amazon.com/eks/latest/userguide/control-plane-logs.html). Avec l'integration Fluent Bit dans Container Insights, les journaux generes par les composants du plan de donnees EKS, qui s'executent sur chaque noeud worker et sont responsables du maintien des pods en cours d'execution, sont captures en tant que journaux du plan de donnees. Ces journaux sont egalement diffuses dans un groupe de journaux CloudWatch dedie sous `/aws/containerinsights/Cluster_Name/dataplane`. Les journaux kube-proxy, aws-node et Docker runtime sont sauvegardes dans ce groupe de journaux. En plus des journaux du plan de controle, avoir les journaux du plan de donnees stockes dans CloudWatch Logs aide a fournir une image complete de vos clusters EKS.

De plus, veuillez en apprendre davantage sur des sujets tels que les configurations Fluent Bit, la surveillance Fluent Bit et l'analyse des journaux dans [Fluent Bit Integration with Amazon EKS](https://aws.amazon.com/blogs/containers/fluent-bit-integration-in-cloudwatch-container-insights-for-eks/).

### Optimisation des couts avec Container Insights sur Amazon EKS

Avec la configuration par defaut, le recepteur Container Insights collecte l'ensemble complet des metriques tel que defini par la [documentation du recepteur](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/awscontainerinsightreceiver#available-metrics-and-resource-attributes). Le nombre de metriques et de dimensions collectees est eleve, et pour les grands clusters, cela augmentera considerablement les couts d'ingestion et de stockage des metriques. Nous allons demontrer deux approches differentes que vous pouvez utiliser pour configurer l'ADOT Collector afin de n'envoyer que les metriques qui apportent de la valeur et d'economiser des couts.

#### Utilisation des processeurs

Cette approche implique l'introduction de processeurs OpenTelemetry comme discute ci-dessus pour filtrer les metriques ou les attributs afin de reduire la taille des [journaux EMF](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html). Nous allons demontrer l'utilisation basique de deux processeurs, a savoir *Filter* et *Resource.*

Les [processeurs Filter](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/processor/filterprocessor/README.md) peuvent etre inclus dans le `ConfigMap` nomme `otel-agent-conf` :

```
processors:
  # filter processors example
  filter/include:
    # any names NOT matching filters are excluded from remainder of pipeline
    metrics:
      include:
        match_type: regexp
        metric_names:
          # re2 regexp patterns
          - ^pod_.*
  filter/exclude:
    # any names matching filters are excluded from remainder of pipeline
    metrics:
      exclude:
        match_type: regexp
        metric_names:
          - ^pod_network.*
```

Le [processeur Resource](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/processor/resourceprocessor/README.md) est egalement integre dans la distribution AWS OpenTelemetry et peut etre utilise pour supprimer les attributs de metriques non desires. Par exemple, si vous souhaitez supprimer les champs `Kubernetes` et `Sources` des journaux EMF, vous pouvez ajouter le processeur Resource au pipeline :

```
  # resource processors example
  resource:
    attributes:
    - key: Sources
      action: delete
    - key: kubernetes
      action: delete
```

#### Personnaliser les metriques et les dimensions

Dans cette approche, vous allez configurer l'exportateur CloudWatch EMF pour generer uniquement l'ensemble de metriques que vous souhaitez envoyer a CloudWatch Logs. La section [metric_declaration](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/5ccdbe08c6a2a43b7c6c7f9c0031a4b0348394a9/exporter/awsemfexporter/README.md#metric_declaration) de la configuration de l'exportateur CloudWatch EMF peut etre utilisee pour definir l'ensemble de metriques et de dimensions que vous souhaitez exporter. Par exemple, vous pouvez ne garder que les metriques de pod de la configuration par defaut. Cette section `metric_declaration` ressemblera a ce qui suit et pour reduire le nombre de metriques, vous pouvez ne garder que l'ensemble de dimensions `[PodName, Namespace, ClusterName]` si les autres ne vous interessent pas :

```
  awsemf:
    namespace: ContainerInsights
    log_group_name: '/aws/containerinsights/{ClusterName}/performance'
    log_stream_name: '{NodeName}'
    resource_to_telemetry_conversion:
      enabled: true
    dimension_rollup_option: NoDimensionRollup
    parse_json_encoded_attr_values: [Sources, kubernetes]
    # Customized metric declaration section
    metric_declarations:
      # pod metrics
      - dimensions: [[PodName, Namespace, ClusterName]]
        metric_name_selectors:
          - pod_cpu_utilization
          - pod_memory_utilization
          - pod_cpu_utilization_over_pod_limit
          - pod_memory_utilization_over_pod_limit
```

Cette configuration produira et diffusera les quatre metriques suivantes dans une seule dimension `[PodName, Namespace, ClusterName]` plutot que 55 metriques differentes pour plusieurs dimensions dans la configuration par defaut :

* pod_cpu_utilization
* pod_memory_utilization
* pod_cpu_utilization_over_pod_limit
* pod_memory_utilization_over_pod_limit

Avec cette configuration, vous n'enverrez que les metriques qui vous interessent plutot que toutes les metriques configurees par defaut. En consequence, vous pourrez diminuer considerablement le cout d'ingestion des metriques pour Container Insights. Avoir cette flexibilite fournira aux clients de Container Insights un haut niveau de controle sur les metriques exportees. La personnalisation des metriques en modifiant la configuration de l'exportateur `awsemf` est egalement tres flexible, et vous pouvez personnaliser a la fois les metriques que vous souhaitez envoyer et leurs dimensions. Notez que cela ne s'applique qu'aux journaux envoyes a CloudWatch.

Les deux approches presentees ci-dessus ne sont pas mutuellement exclusives. En fait, elles peuvent toutes les deux etre combinees pour un haut degre de flexibilite dans la personnalisation des metriques que nous souhaitons ingerer dans notre systeme de surveillance. Nous utilisons cette approche pour diminuer les couts associes au stockage et au traitement des metriques, comme le montre le graphique suivant.

![CW-COST-EXPLORER](../../../../images/Containers/aws-native/eks/cw-cost-explorer.jpg)

*Figure : AWS Cost Explorer*

Dans le graphique AWS Cost Explorer precedent, nous pouvons voir le cout quotidien associe a CloudWatch en utilisant differentes configurations sur l'ADOT Collector dans un petit cluster EKS (20 noeuds worker, 220 pods). Le *15 aout* montre la facture CloudWatch en utilisant l'ADOT Collector avec la configuration par defaut. Le *16 aout*, nous avons utilise l'approche [Customize EMF exporter](https://aws.amazon.com/blogs/containers/cost-savings-by-customizing-metrics-sent-by-container-insights-in-amazon-eks/#customize-emf-exporter) et pouvons constater environ 30% d'economies. Le *17 aout*, nous avons utilise l'approche [Processors](https://aws.amazon.com/blogs/containers/cost-savings-by-customizing-metrics-sent-by-container-insights-in-amazon-eks/#processors), qui realise environ 45% d'economies.
Vous devez considerer les compromis de la personnalisation des metriques envoyees par Container Insights car vous pourrez diminuer les couts de surveillance en sacrifiant la visibilite du cluster surveille. Mais aussi, le tableau de bord integre fourni par Container Insights dans la console AWS peut etre impacte par les metriques personnalisees car vous pouvez choisir de ne pas envoyer les metriques et dimensions utilisees par le tableau de bord. Pour en savoir plus, veuillez consulter [Cost savings by customizing metrics sent by Container Insights in Amazon EKS](https://aws.amazon.com/blogs/containers/cost-savings-by-customizing-metrics-sent-by-container-insights-in-amazon-eks/).

### Utilisation d'EKS Blueprints pour configurer Container Insights

[EKS Blueprints](https://aws.amazon.com/blogs/containers/bootstrapping-clusters-with-eks-blueprints/) est une collection de modules Infrastructure as Code (IaC) qui vous aideront a configurer et deployer des clusters EKS coherents et complets a travers les comptes et les regions. Vous pouvez utiliser EKS Blueprints pour facilement amorcer un cluster EKS avec les [add-ons Amazon EKS](https://docs.aws.amazon.com/eks/latest/userguide/eks-add-ons.html) ainsi qu'un large eventail d'add-ons open source populaires, notamment Prometheus, Karpenter, Nginx, Traefik, AWS Load Balancer Controller, Container Insights, Fluent Bit, Keda, Argo CD, et plus encore. EKS Blueprints est implemente dans deux frameworks IaC populaires, [HashiCorp Terraform](https://github.com/aws-ia/terraform-aws-eks-blueprints) et [AWS Cloud Development Kit (AWS CDK)](https://github.com/aws-quickstart/cdk-eks-blueprints), qui vous aident a automatiser les deploiements d'infrastructure.

Dans le cadre de votre processus de creation de cluster Amazon EKS avec EKS Blueprints, vous pouvez configurer Container Insights en tant qu'outil operationnel Day 2 pour collecter, agreger et synthetiser les metriques et les journaux des applications conteneurisees et des microservices dans la console Amazon CloudWatch.

### Conclusion

Dans cette section du guide des meilleures pratiques d'Observability, nous avons couvert de nombreux details approfondis sur CloudWatch Container Insights, incluant une introduction a Amazon CloudWatch Container Insights et comment il peut vous aider a observer vos charges de travail conteneurisees sur Amazon EKS. Nous avons approfondi l'utilisation d'Amazon CloudWatch Container Insights avec AWS Distro for Open Telemetry pour permettre la collecte de metriques Container Insights afin de visualiser les metriques de vos charges de travail conteneurisees sur la console Amazon CloudWatch. Ensuite, nous avons couvert en profondeur l'integration de Fluent Bit dans CloudWatch Container Insights pour Amazon EKS afin de creer des flux d'entree dedies dans Fluent Bit et des groupes de journaux independants dans CloudWatch Logs pour les journaux d'application, d'hote et du plan de donnees. Ensuite, nous avons parle de deux approches differentes telles que les processeurs et les dimensions de metriques pour realiser des economies avec CloudWatch Container Insights. Enfin, nous avons brievement parle de l'utilisation d'EKS Blueprints comme vehicule pour configurer Container Insights lors du processus de creation du cluster Amazon EKS. Vous pouvez acquerir une experience pratique avec le [module CloudWatch Container Insights](https://catalog.workshops.aws/observability/en-US/aws-native/insights/containerinsights) dans le [One Observability Workshop](https://catalog.workshops.aws/observability/en-US).
