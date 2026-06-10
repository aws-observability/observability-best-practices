# Collecte de metriques systeme avec Container Insights
Les metriques systeme concernent les ressources de bas niveau qui incluent les composants physiques d'un serveur tels que le CPU, la memoire, les disques et les interfaces reseau.
Utilisez [CloudWatch Container Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html) pour collecter, agreger et synthetiser les metriques systeme des applications conteneurisees deployees sur Amazon ECS. Container Insights fournit egalement des informations de diagnostic, telles que les echecs de redemarrage de conteneurs, pour aider a isoler les problemes et les resoudre rapidement. Il est disponible pour les clusters Amazon ECS deployes sur EC2 et Fargate.

Container Insights collecte les donnees sous forme d'evenements de journal de performance en utilisant le [format de metrique integre](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html). Ces evenements de journal de performance sont des entrees qui utilisent un schema JSON structure permettant l'ingestion et le stockage de donnees a haute cardinalite a grande echelle. A partir de ces donnees, CloudWatch cree des metriques agregees au niveau du cluster, du noeud, du service et de la tache en tant que metriques CloudWatch.

:::note
	Pour que les metriques Container Insights apparaissent dans CloudWatch, vous devez activer Container Insights sur vos clusters Amazon ECS. Cela peut etre fait au niveau du compte ou au niveau du cluster individuel. Pour activer au niveau du compte, utilisez la commande AWS CLI suivante :

    ```
    aws ecs put-account-setting --name "containerInsights" --value "enabled
    ```

    Pour activer au niveau du cluster individuel, utilisez la commande AWS CLI suivante :

    ```
    aws ecs update-cluster-settings --cluster $CLUSTER_NAME --settings name=containerInsights,value=enabled
    ```
:::

## Collecte de metriques au niveau du cluster et du service
Par defaut, CloudWatch Container Insights collecte les metriques au niveau de la tache, du service et du cluster. L'agent Amazon ECS collecte ces metriques pour chaque tache sur une instance de conteneur EC2 (pour ECS sur EC2 et ECS sur Fargate) et les envoie a CloudWatch sous forme d'evenements de journal de performance. Vous n'avez pas besoin de deployer d'agents sur le cluster. Ces evenements de journal a partir desquels les metriques sont extraites sont collectes sous le groupe de journaux CloudWatch nomme */aws/ecs/containerinsights/$CLUSTER_NAME/performance*. La liste complete des metriques extraites de ces evenements est [documentee ici](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-metrics-ECS.html). Les metriques collectees par Container Insights sont facilement visualisables dans des tableaux de bord preconstruits disponibles dans la console CloudWatch en selectionnant *Container Insights* depuis la page de navigation puis en selectionnant *performance monitoring* dans la liste deroulante. Elles sont egalement visibles dans la section *Metrics* de la console CloudWatch.

![Container Insights metrics dashboard](../../../../images/ContainerInsightsMetrics.png)

:::note
    Si vous utilisez Amazon ECS sur une instance Amazon EC2 et que vous souhaitez collecter les metriques reseau et stockage de Container Insights, lancez cette instance avec une AMI qui inclut la version 1.29 de l'agent Amazon ECS.
:::

:::warning
    Les metriques collectees par Container Insights sont facturees en tant que metriques personnalisees. Pour plus d'informations sur la tarification CloudWatch, consultez [Amazon CloudWatch Pricing](https://aws.amazon.com/cloudwatch/pricing/)
:::

## Collecte de metriques au niveau de l'instance
Le deploiement de l'agent CloudWatch sur un cluster Amazon ECS heberge sur EC2 vous permet de collecter des metriques au niveau de l'instance a partir du cluster. L'agent est deploye en tant que service daemon et envoie les metriques au niveau de l'instance sous forme d'evenements de journal de performance depuis chaque instance de conteneur EC2 dans le cluster. La liste complete des metriques au niveau de l'instance extraites de ces evenements est [documentee ici](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-metrics-ECS.html)

:::info
    Les etapes pour deployer l'agent CloudWatch sur un cluster Amazon ECS afin de collecter les metriques au niveau de l'instance sont documentees dans le [Guide de l'utilisateur Amazon CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/deploy-container-insights-ECS-instancelevel.html). Notez que cette option n'est pas disponible pour les clusters Amazon ECS heberges sur Fargate.
:::
    
## Analyse des evenements de journal de performance avec Logs Insights
Container Insights collecte des metriques en utilisant des evenements de journal de performance avec le format de metrique integre. Chaque evenement de journal peut contenir des donnees de performance observees sur les ressources systeme telles que le CPU et la memoire, ou les ressources ECS telles que les taches et les services. Des exemples d'evenements de journal de performance que Container Insights collecte a partir d'un Amazon ECS au niveau du cluster, du service, de la tache et du conteneur sont [listes ici](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-reference-performance-logs-ECS.html). CloudWatch genere des metriques basees uniquement sur certaines des donnees de performance dans ces evenements de journal. Mais vous pouvez utiliser ces evenements de journal pour effectuer une analyse plus approfondie des donnees de performance en utilisant les requetes CloudWatch Logs Insights.

L'interface utilisateur pour executer des requetes Logs Insights est disponible dans la console CloudWatch en selectionnant *Logs Insights* depuis la page de navigation. Lorsque vous selectionnez un groupe de journaux, CloudWatch Logs Insights detecte automatiquement les champs dans les evenements de journal de performance du groupe de journaux et les affiche dans *Discovered* fields dans le volet de droite. Les resultats d'une execution de requete sont affiches sous forme d'un graphique a barres des evenements de journal dans ce groupe de journaux au fil du temps. Ce graphique a barres montre la distribution des evenements dans le groupe de journaux qui correspondent a votre requete et a la plage de temps.

![Logs Insights dashboard](../../../../images/LogInsights.png)

:::info
    Voici un exemple de requete Logs Insights pour afficher les metriques au niveau du conteneur pour l'utilisation du CPU et de la memoire.
    
    ```
    stats avg(CpuUtilized) as CPU, avg(MemoryUtilized) as Mem by TaskId, ContainerName | sort Mem, CPU desc
    ```
:::
