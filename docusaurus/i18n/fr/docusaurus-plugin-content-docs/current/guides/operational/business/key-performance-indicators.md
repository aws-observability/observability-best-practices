## 1.0 Comprendre les KPIs ("Golden Signals")
Les organisations utilisent des indicateurs clés de performance (KPIs), également appelés "Golden Signals", qui fournissent un aperçu de la santé ou du risque de l'entreprise et des opérations. Différentes parties d'une organisation auraient des KPIs uniques adaptés à la mesure de leurs résultats respectifs. Par exemple, l'équipe produit d'une application de commerce en ligne suivrait la capacité à traiter les commandes du panier avec succès comme son KPI. Une équipe d'exploitation d'astreinte mesurerait son KPI comme le temps moyen de détection (MTTD) d'un incident. Pour l'équipe financière, un KPI de coût des ressources sous budget est important.

Les indicateurs de niveau de service (SLIs), les objectifs de niveau de service (SLOs) et les accords de niveau de service (SLAs) sont des composants essentiels de la gestion de la fiabilité des services. Ce guide décrit les bonnes pratiques pour utiliser Amazon CloudWatch et ses fonctionnalités afin de calculer et surveiller les SLIs, SLOs et SLAs, avec des exemples clairs et concis.

- **SLI (Service Level Indicator) :** Une mesure quantitative de la performance d'un service.
- **SLO (Service Level Objective) :** La valeur cible pour un SLI, représentant le niveau de performance souhaité.
- **SLA (Service Level Agreement) :** Un contrat entre un fournisseur de service et ses utilisateurs spécifiant le niveau de service attendu.

Exemples de SLIs courants :

- Disponibilité : Pourcentage de temps pendant lequel un service est opérationnel
- Latence : Temps nécessaire pour traiter une requête
- Taux d'erreur : Pourcentage de requêtes échouées

## 2.0 Découvrir les exigences des clients et des parties prenantes (en utilisant le modèle suggéré ci-dessous)

1. Commencez par la question principale : "Quelle est la valeur métier ou le problème métier dans le périmètre de la charge de travail donnée (ex. portail de paiement, passage de commande e-commerce, inscription utilisateur, rapports de données, portail de support, etc.)
2. Décomposez la valeur métier en catégories telles que l'expérience utilisateur (UX) ; l'expérience métier (BX) ; l'expérience opérationnelle (OpsX) ; l'expérience sécurité (SecX) ; l'expérience développeur (DevX)
3. Dérivez les signaux principaux, les "Golden Signals", pour chaque catégorie ; les signaux principaux autour de UX et BX constitueront typiquement les métriques métier

| ID	| Initiales	| Client	| Besoins métier	| Mesures	| Sources d'information	| À quoi ressemble le bon ?	| Alertes	| Tableaux de bord	| Rapports	|
| ---	| ---	| ---	| ---	| ---	| ---	| ---	| ---	| ---	| --- |		
|M1	|Exemple	|Utilisateur final externe	|Expérience utilisateur	|Temps de réponse (latence de page)	|Logs / Traces	|< 5s pour 99,9%	|Non	|Oui	|Non	|
|M2	|Exemple	|Métier	|Disponibilité	|RPS réussies (requêtes par seconde)	|Health Check	|>85% sur une fenêtre de 5 min	|Oui	|Oui	|Oui	|
|M3	|Exemple	|Sécurité	|Conformité	|Ressources critiques non conformes	|Données Config	|\<10 en moins de 15 jours	|Non	|Oui	|Oui	|
|M4	|Exemple	|Développeurs	|Agilité	|Temps de déploiement	|Logs de déploiement	|Toujours < 10 min	|Oui	|Non	|Oui	|
|M5	|Exemple	|Opérateurs	|Capacité	|Profondeur de file d'attente	|Logs/métriques applicatives	|Toujours < 10	|Oui	|Oui	|Oui	|

### 2.1 Golden Signals

|Catégorie	|Signal	|Notes	|Références	|
|---	|---	|---	|---	|
|UX	|Performance (Latence)	|Voir M1 dans le modèle	|Whitepaper : [Availability and Beyond (Measuring latency)](https://docs.aws.amazon.com/whitepapers/latest/availability-and-beyond-improving-resilience/measuring-availability.html#latency)	|
|BX	|Disponibilité	|Voir M2 dans le modèle	|Whitepaper : [Availability and Beyond (Measuring availability)](https://docs.aws.amazon.com/whitepapers/latest/availability-and-beyond-improving-resilience/measuring-availability.html)	|
|BX	|Plan de continuité d'activité (BCP)	|Score de résilience Amazon Resilience Hub (ARH) par rapport aux RTO/RPO définis	|Docs : [ARH user guide (Understanding resilience scores)](https://docs.aws.amazon.com/resilience-hub/latest/userguide/resil-score.html)	|
|SecX	|(Non)-Conformité	|Voir M3 dans le modèle	|Docs : [AWS Control Tower user guide (Compliance status in the console)](https://docs.aws.amazon.com/controltower/latest/userguide/compliance-statuses.html)	|
|DevX	|Agilité	|Voir M4 dans le modèle	|Docs : [DevOps Monitoring Dashboard on AWS (DevOps metrics list)](https://docs.aws.amazon.com/solutions/latest/devops-monitoring-dashboard-on-aws/devops-metrics-list.html)	|
|OpsX	|Capacité (Quotas)	|Voir M5 dans le modèle	|Docs : [Amazon CloudWatch user guide (Visualizing your service quotas and setting alarms)](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Quotas-Visualize-Alarms.html)	|
|OpsX	|Anomalies budgétaires	|	|Docs :<br/> 1. [AWS Billing and Cost Management (AWS Cost Anomaly Detection)](https://docs.aws.amazon.com/cost-management/latest/userguide/getting-started-ad.html) <br/> 2. [AWS Budgets](https://aws.amazon.com/aws-cost-management/aws-budgets/)	|



## 3.0 Orientations de haut niveau 'TLG'


### 3.1 TLG Général

1. Travaillez avec les équipes métier, architecture et sécurité pour aider à affiner les exigences métier, de conformité et de gouvernance et vous assurer qu'elles reflètent avec précision les besoins métier. Cela inclut [l'établissement des objectifs de temps de récupération et de point de récupération](https://aws.amazon.com/blogs/mt/establishing-rpo-and-rto-targets-for-cloud-applications/) (RTOs, RPOs). Formulez des méthodes pour mesurer les exigences telles que la [mesure de la disponibilité](https://docs.aws.amazon.com/whitepapers/latest/availability-and-beyond-improving-resilience/measuring-availability.html) et la latence (ex. le temps de fonctionnement pourrait permettre un petit pourcentage de défauts sur une fenêtre de 5 min).

2. Construisez une [stratégie de tagging](https://docs.aws.amazon.com/whitepapers/latest/tagging-best-practices/defining-and-publishing-a-tagging-schema.html) efficace avec un schéma spécialement conçu qui s'aligne sur divers résultats fonctionnels métier. Cela devrait couvrir en particulier l'[Observability opérationnelle](https://docs.aws.amazon.com/whitepapers/latest/tagging-best-practices/operational-observability.html) et la [gestion des incidents](https://docs.aws.amazon.com/whitepapers/latest/tagging-best-practices/incident-management.html).

3. Dans la mesure du possible, utilisez des seuils dynamiques pour les alarmes (en particulier pour les métriques qui n'ont pas de KPIs de référence) en utilisant la [détection d'anomalies CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Anomaly_Detection.html) qui fournit des algorithmes d'apprentissage automatique pour établir les lignes de référence. Lors de l'utilisation des services AWS disponibles qui publient des métriques CW (ou d'autres sources comme les métriques Prometheus) pour configurer des alarmes, envisagez de créer des [alarmes composites](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Create_Composite_Alarm.html) pour réduire le bruit des alarmes. Exemple : une alarme composite qui comprend une métrique métier indicative de la disponibilité (suivie par les requêtes réussies) et la latence, lorsqu'elle est configurée pour alerter lorsque les deux passent en dessous d'un seuil critique pendant les déploiements, pourrait être un indicateur déterministe de bug de déploiement.

4. (NOTE : Nécessite AWS Business support ou supérieur) AWS publie des événements d'intérêt en utilisant le service AWS Health liés à vos ressources dans le Personal Health Dashboard. Tirez parti du framework [AWS Health Aware (AHA)](https://aws.amazon.com/blogs/mt/aws-health-aware-customize-aws-health-alerts-for-organizational-and-personal-aws-accounts/) (qui utilise AWS Health) pour ingérer des alertes proactives et en temps réel agrégées à travers votre AWS Organization depuis un compte central (tel qu'un compte de gestion). Ces alertes peuvent être envoyées aux plateformes de communication préférées comme Slack et s'intègrent aux outils ITSM comme ServiceNow et Jira.
![Image: AWS Health Aware 'AHA'](../../../images/AHA-Integration.jpg)

5. Tirez parti d'Amazon CloudWatch [Application Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch-application-insights.html) pour configurer les meilleurs moniteurs pour les ressources et analyser continuellement les données à la recherche de signes de problèmes avec vos applications. Il fournit également des tableaux de bord automatisés qui montrent les problèmes potentiels avec les applications surveillées pour isoler/dépanner rapidement les problèmes d'application/infrastructure. Tirez parti de [Container Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html) pour agréger les métriques et les logs des conteneurs et qui peut être intégré de manière transparente avec CloudWatch Application Insights.
![Image: CW Application Insights](../../../images/CW-ApplicationInsights.jpg)

6. Tirez parti d'[AWS Resilience Hub](https://aws.amazon.com/resilience-hub/) pour analyser les applications par rapport aux RTOs et RPOs définis. Validez si les exigences de disponibilité, de latence et de continuité d'activité sont satisfaites en utilisant des expériences contrôlées avec des outils comme [AWS Fault Injection Simulator](https://aws.amazon.com/fis/). Effectuez des revues Well-Architected supplémentaires et des analyses approfondies spécifiques aux services pour vous assurer que les charges de travail sont conçues pour répondre aux exigences métier en suivant les bonnes pratiques AWS.

7. Pour plus de détails, référez-vous aux autres sections du guide [AWS Observability Best Practices](https://aws-observability.github.io/observability-best-practices/), au whitepaper AWS Cloud Adoption Framework : [Operations Perspective](https://docs.aws.amazon.com/whitepapers/latest/aws-caf-operations-perspective/observability.html) et au contenu du whitepaper AWS Well-Architected Framework Operational Excellence Pillar sur '[Understanding workload health](https://docs.aws.amazon.com/wellarchitected/latest/operational-excellence-pillar/understanding-workload-health.html)'.
    

### 3.2 TLG par domaine (accent sur les métriques métier c.-à-d. UX, BX)

Des exemples appropriés sont fournis ci-dessous en utilisant des services tels que CloudWatch (CW) (Réf : Services AWS qui publient des [métriques CloudWatch documentation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/aws-services-cloudwatch-metrics.html))

#### 3.2.1 Canaries (transactions synthétiques) et Real-User Monitoring (RUM)

* TLG : L'un des moyens les plus simples et les plus efficaces pour comprendre l'expérience client est de simuler le trafic client avec des Canaries (transactions synthétiques) qui sondent régulièrement vos services et enregistrent des métriques.

|Service AWS	|Fonctionnalité	|Mesure	|Métrique	|Exemple	|Notes	|
|---	|---	|---	|---	|---	|---	|
|CW	|Synthetics	|Disponibilité	|**SuccessPercent**	|(Ex. SuccessPercent > 90 ou CW Anomaly Detection pour une période de 1min)<br/>**[Metric Math où m1 est SuccessPercent si les Canaries s'exécutent chaque jour de semaine 7h-8h (CloudWatchSynthetics) : ** <br/>`IF(((DAY(m1)<6) AND (HOUR(m1)>7 AND HOUR(m1)<8)),m1)]`	|	|
|	|	|	|	|	|	|
|CW	|Synthetics	|Disponibilité	|VisualMonitoringSuccessPercent	|(Ex. VisualMonitoringSuccessPercent > 90 pour une période de 5 min pour les comparaisons de captures d'écran UI)<br/>**[Metric Math où m1 est SuccessPercent si les Canaries s'exécutent chaque jour de semaine 7h-8h (CloudWatchSynthetics) : ** <br/>`IF(((DAY(m1)<6) AND (HOUR(m1)>7 AND HOUR(m1)<8)),m1)`	|Si le client attend que le canary corresponde à une capture d'écran UI prédéterminée	|
|	|	|	|	|	|	|
|CW	|RUM	|Temps de réponse	|Apdex Score	|(Ex. Score Apdex : <br/> NavigationFrustratedCount < 'N' valeur attendue)	|	|
|	|	|	|	|	|	|


#### 3.2.2 API Frontend


|Service AWS	|Fonctionnalité	|Mesure	|Métrique	|Exemple	|Notes	|
|---	|---	|---	|---	|---	|---	|
|CloudFront	|	|Disponibilité	|Total error rate	|(Ex. [Total error rate] < 10 ou CW Anomaly Detection pour une période de 1min)	|Disponibilité comme mesure du taux d'erreur	|
|	|	|	|	|	|	|
|CloudFront	|(Nécessite l'activation de métriques supplémentaires)	|Performance	|Cache hit rate	|(Ex. Cache hit rate < 10 CW Anomaly Detection pour une période de 1min)	|	|
|	|	|	|	|	|	|
|Route53	|Health checks	|Disponibilité (multi-régions)	|HealthCheckPercentageHealthy	|(Ex. [Minimum de HealthCheckPercentageHealthy] > 90 ou CW Anomaly Detection pour une période de 1min)	|	|
|	|	|	|	|	|	|
|Route53	|Health checks	|Latence	|TimeToFirstByte	|(Ex. [p99 TimeToFirstByte] < 100 ms ou CW Anomaly Detection pour une période de 1min)	|	|
|	|	|	|	|	|	|
|API Gateway	|	|Disponibilité	|Count	|(Ex. [(4XXError + 5XXError) / Count) * 100] < 10 ou CW Anomaly Detection pour une période de 1min)	|Disponibilité comme mesure des requêtes "abandonnées"	|
|	|	|	|	|	|	|
|API Gateway	|	|Latence	|Latency (ou IntegrationLatency c.-à-d. latence backend)	|(Ex. p99 Latency < 1 sec ou CW Anomaly Detection pour une période de 1min)	|p99 aura une plus grande tolérance que les percentiles inférieurs comme p90. (p50 est équivalent à la moyenne)	|
|	|	|	|	|	|	|
|API Gateway	|	|Performance	|CacheHitCount (et Misses)	|(Ex. [CacheMissCount / (CacheHitCount + CacheMissCount)  * 100] < 10 ou CW Anomaly Detection pour une période de 1min)	|Performance comme mesure du Cache (Misses)	|
|	|	|	|	|	|	|
|Application Load Balancer (ALB)	|	|Disponibilité	|RejectedConnectionCount	|(Ex.[RejectedConnectionCount/(RejectedConnectionCount + RequestCount) * 100] < 10 CW Anomaly Detection pour une période de 1min)	|Disponibilité comme mesure des requêtes rejetées en raison du dépassement du nombre maximum de connexions	|
|	|	|	|	|	|	|
|Application Load Balancer (ALB)	|	|Latence	|TargetResponseTime	|(Ex. p99 TargetResponseTime < 1 sec ou CW Anomaly Detection pour une période de 1min)	|p99 aura une plus grande tolérance que les percentiles inférieurs comme p90. (p50 est équivalent à la moyenne)	|
|	|	|	|	|	|	|


#### 3.2.3 Serverless

|Service AWS	|Fonctionnalité	|Mesure	|Métrique	|Exemple	|Notes	|
|---	|---	|---	|---	|---	|---	|
|S3	|Request metrics	|Disponibilité	|AllRequests	|(Ex. [(4XXErrors + 5XXErrors) / AllRequests) * 100] < 10 ou CW Anomaly Detection pour une période de 1min)	|Disponibilité comme mesure des requêtes "abandonnées"	|
|	|	|	|	|	|	|
|S3	|Request metrics	|Latence (globale)	|TotalRequestLatency	|(Ex. [p99 TotalRequestLatency] < 100 ms ou CW Anomaly Detection pour une période de 1min)	|	|
|	|	|	|	|	|	|
|DynamoDB (DDB)	|	|Disponibilité	|ThrottledRequests	|(Ex. [ThrottledRequests] < 100 ou CW Anomaly Detection pour une période de 1min)	|Disponibilité comme mesure des requêtes "limitées"	|
|	|	|	|	|	|	|
|DynamoDB (DDB)	|	|Latence	|SuccessfulRequestLatency	|(Ex. [p99 SuccessfulRequestLatency] < 100 ms ou CW Anomaly Detection pour une période de 1min)	|	|
|	|	|	|	|	|	|
|Step Functions	|	|Disponibilité	|ExecutionsFailed	|(Ex. ExecutionsFailed = 0)<br/>**[ex. Metric Math où m1 est ExecutionsFailed (Step function Execution) heure UTC : `IF(((DAY(m1)<6 OR ** ** DAY(m1)==7) AND (HOUR(m1)>21 AND HOUR(m1)<7)),m1)]`	|En supposant un flux métier qui exige l'achèvement des step functions comme une opération quotidienne 21h-7h pendant les jours de semaine (opérations métier de début de journée)	|
|	|	|	|	|	|	|


#### 3.2.4 Compute et conteneurs

|Service AWS	|Fonctionnalité	|Mesure	|Métrique	|Exemple	|Notes	|
|---	|---	|---	|---	|---	|---	|
|EKS	|Métriques Prometheus	|Disponibilité	|APIServer Request Success Ratio	|(ex. Métrique Prometheus comme [APIServer Request Success Ratio](https://raw.githubusercontent.com/aws-samples/amazon-cloudwatch-container-insights/latest/k8s-deployment-manifest-templates/deployment-mode/service/cwagent-prometheus/sample_cloudwatch_dashboards/kubernetes_api_server/cw_dashboard_kubernetes_api_server.json))	|Voir les [bonnes pratiques pour la surveillance des métriques du plan de contrôle EKS](https://aws.github.io/aws-eks-best-practices/reliability/docs/controlplane/#monitor-control-plane-metrics) et [EKS observability](https://docs.aws.amazon.com/eks/latest/userguide/eks-observe.html) pour plus de détails.	|
|	|	|	|	|	|	|
|EKS	|Métriques Prometheus	|Performance	|apiserver_request_duration_seconds, etcd_request_duration_seconds	|apiserver_request_duration_seconds, etcd_request_duration_seconds	|	|
|	|	|	|	|	|	|
|ECS	|	|Disponibilité	|Service RUNNING task count	|Service RUNNING task count	|Voir la [documentation](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/cloudwatch-metrics.html#cw_running_task_count) des métriques CW ECS	|
|	|	|	|	|	|	|
|ECS	|	|Performance	|TargetResponseTime	|(ex. [p99 TargetResponseTime] < 100 ms ou CW Anomaly Detection pour une période de 1min)	|Voir la [documentation](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/cloudwatch-metrics.html#cw_running_task_count) des métriques CW ECS	|
|	|	|	|	|	|	|
|EC2 (.NET Core)	|CW Agent Performance Counters	|Disponibilité	|(ex. [ASP.NET Application Errors Total/Sec](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/appinsights-metrics-ec2.html#appinsights-metrics-ec2-built-in) < 'N')	|(ex. [ASP.NET Application Errors Total/Sec](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/appinsights-metrics-ec2.html#appinsights-metrics-ec2-built-in) < 'N')	|Voir la [documentation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/appinsights-metrics-ec2.html#appinsights-metrics-ec2-built-in) EC2 CW Application Insights	|
|	|	|	|	|	|	|


#### 3.2.5 Bases de données (RDS)

|Service AWS	|Fonctionnalité	|Mesure	|Métrique	|Exemple	|Notes	|
|---	|---	|---	|---	|---	|---	|
|RDS Aurora	|Performance Insights (PI)	|Disponibilité	|Average active sessions	|(Ex. Average active sessions avec CW Anomaly Detection pour une période de 1min)	|Voir la [documentation](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/USER_PerfInsights.Overview.ActiveSessions.html#USER_PerfInsights.Overview.ActiveSessions.AAS) RDS Aurora CW PI	|
|	|	|	|	|	|	|
|RDS Aurora	|	|Reprise après sinistre (DR)	|AuroraGlobalDBRPOLag	|(Ex. AuroraGlobalDBRPOLag < 30000 ms pour une période de 1min)	|Voir la [documentation](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.AuroraMonitoring.Metrics.html) RDS Aurora CW	|
|	|	|	|	|	|	|
|RDS Aurora	|	|Performance	|Commit Latency, Buffer Cache Hit Ratio, DDL Latency, DML Latency	|(Ex. Commit Latency avec CW Anomaly Detection pour une période de 1min)	|Voir la [documentation](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/USER_PerfInsights.Overview.ActiveSessions.html#USER_PerfInsights.Overview.ActiveSessions.AAS) RDS Aurora CW PI	|
|	|	|	|	|	|	|
|RDS (MSSQL)	|PI	|Performance	|SQL Compilations	|(Ex. <br/>SQL Compilations > 'M' pour une période de 5 min)	|Voir la [documentation](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PerfInsights_Counters.html#USER_PerfInsights_Counters.SQLServer) RDS CW PI	|
|	|	|	|	|	|	|


## 4.0 Utilisation d'Amazon CloudWatch et Metric Math pour calculer les SLIs, SLOs et SLAs

### 4.1 Amazon CloudWatch et Metric Math

Amazon CloudWatch fournit des services de surveillance et d'Observability pour les ressources AWS. Metric Math vous permet d'effectuer des calculs en utilisant les données de métriques CloudWatch, ce qui en fait un outil idéal pour calculer les SLIs, SLOs et SLAs.

#### 4.1.1 Activation du Detailed Monitoring

Activez le Detailed Monitoring pour vos ressources AWS afin d'obtenir une granularité de données de 1 minute, permettant des calculs de SLI plus précis.

#### 4.1.2 Organisation des métriques avec Namespaces et Dimensions

Utilisez les Namespaces et Dimensions pour catégoriser et filtrer les métriques pour une analyse plus facile. Par exemple, utilisez les Namespaces pour regrouper les métriques liées à un service spécifique, et les Dimensions pour différencier les différentes instances de ce service.

### 4.2 Calcul des SLIs avec Metric Math

#### 4.2.1 Disponibilité

Pour calculer la disponibilité, divisez le nombre de requêtes réussies par le nombre total de requêtes :

```
availability = 100 * (successful_requests / total_requests)
```


**Exemple :**

Supposons que vous ayez un API Gateway avec les métriques suivantes :
- `4XXError` : Nombre d'erreurs client 4xx
- `5XXError` : Nombre d'erreurs serveur 5xx
- `Count` : Nombre total de requêtes

Utilisez Metric Math pour calculer la disponibilité :

```
availability = 100 * ((Count - 4XXError - 5XXError) / Count)
```


#### 4.2.2 Latence

Pour calculer la latence moyenne, utilisez les statistiques `SampleCount` et `Sum` fournies par CloudWatch :

```
average_latency = Sum / SampleCount
```


**Exemple :**

Supposons que vous ayez une fonction Lambda avec la métrique suivante :
- `Duration` : Temps nécessaire pour exécuter la fonction

Utilisez Metric Math pour calculer la latence moyenne :

```
average_latency = Duration.Sum / Duration.SampleCount
```


#### 4.2.3 Taux d'erreur

Pour calculer le taux d'erreur, divisez le nombre de requêtes échouées par le nombre total de requêtes :

```
error_rate = 100 * (failed_requests / total_requests)
```


**Exemple :**

En utilisant l'exemple API Gateway précédent :

```
error_rate = 100 * ((4XXError + 5XXError) / Count)
```


### 4.4 Définition et surveillance des SLOs

#### 4.4.1 Définition d'objectifs réalistes

Définissez les objectifs SLO en fonction des attentes des utilisateurs et des données de performance historiques. Fixez des objectifs réalisables pour assurer un équilibre entre la fiabilité du service et l'utilisation des ressources.

#### 4.4.2 Surveillance des SLOs avec CloudWatch

Créez des alarmes CloudWatch pour surveiller vos SLIs et vous notifier lorsqu'ils approchent ou dépassent les objectifs SLO. Cela vous permet d'aborder les problèmes de manière proactive et de maintenir la fiabilité du service.

#### 4.4.3 Révision et ajustement des SLOs

Révisez périodiquement vos SLOs pour vous assurer qu'ils restent pertinents à mesure que votre service évolue. Ajustez les objectifs si nécessaire et communiquez tout changement aux parties prenantes.

### 4.5 Définition et mesure des SLAs

#### 4.5.1 Définition d'objectifs réalistes

Définissez les objectifs SLA en fonction des données de performance historiques et des attentes des utilisateurs. Fixez des objectifs réalisables pour assurer un équilibre entre la fiabilité du service et l'utilisation des ressources.

#### 4.5.2 Surveillance et alerting

Configurez des alarmes CloudWatch pour surveiller les SLIs et vous notifier lorsqu'ils approchent ou dépassent les objectifs SLA. Cela vous permet d'aborder les problèmes de manière proactive et de maintenir la fiabilité du service.

#### 4.5.3 Révision régulière des SLAs

Révisez périodiquement les SLAs pour vous assurer qu'ils restent pertinents à mesure que votre service évolue. Ajustez les objectifs si nécessaire et communiquez tout changement aux parties prenantes.

### 4.6 Mesure de la performance SLA ou SLO sur une période définie

Pour mesurer la performance SLA ou SLO sur une période définie, comme un mois calendaire, utilisez les données de métriques CloudWatch avec des plages de temps personnalisées.

**Exemple :**

Supposons que vous ayez un API Gateway avec un objectif SLO de 99,9% de disponibilité. Pour mesurer la disponibilité pour le mois d'avril, utilisez l'expression Metric Math suivante :

```
availability = 100 * ((Count - 4XXError - 5XXError) / Count)
```


Ensuite, configurez la requête de données de métriques CloudWatch avec une plage de temps personnalisée :

- **Start Time :** `2023-04-01T00:00:00Z`
- **End Time :** `2023-04-30T23:59:59Z`
- **Period :** `2592000` (30 jours en secondes)

Enfin, utilisez la statistique `AVG` pour calculer la disponibilité moyenne sur le mois. Si la disponibilité moyenne est égale ou supérieure à l'objectif SLO, vous avez atteint votre objectif.

## 5.0 Résumé

Les indicateurs clés de performance (KPIs), également appelés "Golden Signals", doivent s'aligner sur les exigences métier et des parties prenantes. Le calcul des SLIs, SLOs et SLAs en utilisant Amazon CloudWatch et Metric Math est crucial pour la gestion de la fiabilité des services. Suivez les bonnes pratiques décrites dans ce guide pour surveiller et maintenir efficacement la performance de vos ressources AWS. N'oubliez pas d'activer le Detailed Monitoring, d'organiser les métriques avec les Namespaces et Dimensions, d'utiliser Metric Math pour les calculs de SLI, de définir des objectifs SLO et SLA réalistes, et d'établir des systèmes de surveillance et d'alerting avec les alarmes CloudWatch. En appliquant ces bonnes pratiques, vous pouvez assurer une fiabilité de service optimale, une meilleure utilisation des ressources et une satisfaction client améliorée.




