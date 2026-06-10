# Amazon CloudWatch - FAQ

## Pourquoi devrais-je choisir Amazon CloudWatch ?

Amazon CloudWatch est un service natif du cloud AWS qui fournit une observability unifiee sur une plateforme unique pour surveiller les ressources cloud AWS et les applications que vous executez sur AWS. Amazon CloudWatch peut etre utilise pour collecter des donnees de surveillance et operationnelles sous forme de [logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html), suivre les [metriques](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/working_with_metrics.html), les [evenements](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/WhatIsCloudWatchEvents.html) et configurer des [alarmes](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html). Il fournit egalement une [vue unifiee](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Dashboards.html) des ressources AWS, des applications et des services qui s'executent sur AWS et [sur les serveurs sur site](https://aws.amazon.com/blogs/mt/how-to-monitor-hybrid-environment-with-aws-services/). Amazon CloudWatch vous aide a obtenir une visibilite a l'echelle du systeme sur l'utilisation des ressources, les performances applicatives et la sante operationnelle de vos charges de travail. Amazon CloudWatch fournit des [informations exploitables](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Insights-Sections.html) pour les applications et ressources d'infrastructure AWS, hybrides et sur site. L'[observability multi-comptes](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Unified-Cross-Account.html) est un ajout a la capacite d'observability unifiee de CloudWatch.

## Quels services AWS sont nativement integres avec Amazon CloudWatch et Amazon CloudWatch Logs ?

Amazon CloudWatch s'integre nativement avec plus de 70 services AWS, permettant aux clients de collecter des metriques d'infrastructure pour une surveillance et une evolutivite simplifiees sans aucune action. Veuillez consulter la documentation pour une liste complete des [services AWS qui publient des metriques CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/aws-services-cloudwatch-metrics.html). Actuellement, plus de 30 services AWS publient des logs vers CloudWatch. Veuillez consulter la documentation pour une liste complete des [services AWS qui publient des logs vers CloudWatch Logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/aws-services-sending-logs.html).

## Ou puis-je obtenir la liste de toutes les metriques publiees de tous les services AWS vers Amazon CloudWatch ?

La liste de tous les [services AWS qui publient des metriques](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/aws-services-cloudwatch-metrics.html) vers Amazon CloudWatch se trouve dans la documentation AWS.

## Comment demarrer la collecte et la surveillance des metriques avec Amazon CloudWatch ?

[Amazon CloudWatch collecte des metriques](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/working_with_metrics.html) depuis divers services AWS qui peuvent etre visualisees via [AWS Management Console, AWS CLI ou une API](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/viewing_metrics_with_cloudwatch.html). Amazon CloudWatch collecte les [metriques disponibles](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/viewing_metrics_with_cloudwatch.html) pour les instances Amazon EC2. Pour des metriques personnalisees supplementaires, les clients peuvent utiliser l'agent unifie CloudWatch pour collecter et surveiller.

> Atelier AWS Observability associe : [Metrics](https://catalog.workshops.aws/observability/en-US/aws-native/metrics)

## Mon instance Amazon EC2 necessite un niveau de surveillance tres granulaire, que dois-je faire ?

Par defaut, Amazon EC2 envoie des donnees de metriques a CloudWatch par periodes de 5 minutes en tant que surveillance de base pour une instance. Pour envoyer des donnees de metriques pour votre instance a CloudWatch par periodes d'1 minute, la [surveillance detaillee](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-cloudwatch-new.html) peut etre activee sur l'instance.

## Je veux publier mes propres metriques pour mon application. Y a-t-il une option ?

Les clients peuvent egalement publier leurs propres [metriques personnalisees](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/publishingMetrics.html) vers CloudWatch en utilisant l'API ou le CLI avec une resolution standard de granularite d'1 minute ou une granularite haute resolution jusqu'a un intervalle d'1 seconde.

L'agent CloudWatch prend egalement en charge la collecte de metriques personnalisees depuis les instances EC2 dans des scenarios specialises comme les [metriques de performance reseau pour les instances EC2](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-network-performance.html) executant Linux qui utilisent l'Elastic Network Adapter (ENA), les [metriques GPU NVIDIA](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-NVIDIA-GPU.html) depuis les serveurs Linux et les metriques de processus utilisant le plugin procstat depuis des [processus individuels](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-procstat-process-metrics.html) sur les serveurs Linux et Windows.

> Atelier AWS Observability associe : [Public custom metrics](https://catalog.workshops.aws/observability/en-US/aws-native/metrics/publishmetrics)

## Quel support supplementaire est disponible pour la collecte de metriques personnalisees via l'agent Amazon CloudWatch ?

Les metriques personnalisees des applications ou services peuvent etre recuperees en utilisant l'agent unifie CloudWatch avec la prise en charge des protocoles [StatsD](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-custom-metrics-statsd.html) ou [collectd](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-custom-metrics-collectd.html). StatsD est une solution open-source populaire qui peut collecter des metriques depuis une grande variete d'applications. StatsD est particulierement utile pour instrumenter ses propres metriques, prenant en charge les serveurs bases sur Linux et Windows. Le protocole collectd est une solution open-source populaire supportee uniquement sur les serveurs Linux avec des plugins qui peuvent collecter des statistiques systeme pour une grande variete d'applications.

## Ma charge de travail contient beaucoup de ressources ephemeres et genere des logs en haute cardinalite, quelle est l'approche recommandee pour collecter et mesurer les metriques et les logs ?

Le [format de metrique integre CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html) permet aux clients d'ingerer des donnees applicatives complexes en haute cardinalite sous forme de logs et de generer des metriques exploitables depuis des ressources ephemeres telles que les fonctions Lambda et les conteneurs. Ce faisant, les clients peuvent integrer des metriques personnalisees aux cotes de donnees d'evenements de logs detaillees sans avoir a instrumenter ou maintenir du code separe, tout en obtenant de puissantes capacites analytiques sur leurs donnees de logs et CloudWatch peut automatiquement extraire les metriques personnalisees pour aider a visualiser les donnees et configurer des alarmes pour la detection d'incidents en temps reel.

> Atelier AWS Observability associe : [Embedded Metric Format](https://catalog.workshops.aws/observability/en-US/aws-native/metrics/emf)

## Comment demarrer la collecte et la surveillance des logs avec Amazon CloudWatch ?

[Amazon CloudWatch Logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html) aide les clients a surveiller et depanner les systemes et applications en quasi temps reel en utilisant les fichiers de logs systeme, applicatifs et personnalises existants. Les clients peuvent installer l'[agent unifie CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_GettingStarted.html) pour collecter les [logs depuis les instances Amazon EC2 et les serveurs sur site](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html) vers CloudWatch.

> Atelier AWS Observability associe : [Log Insights](https://catalog.workshops.aws/observability/en-US/aws-native/logs/logsinsights)

## Qu'est-ce que l'agent CloudWatch et pourquoi devrais-je l'utiliser ?

L'[agent unifie CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html) est un logiciel open-source sous licence MIT qui prend en charge la plupart des systemes d'exploitation utilisant les architectures x86-64 et ARM64. L'agent CloudWatch aide a collecter les metriques au niveau systeme depuis les instances Amazon EC2 et les serveurs sur site dans un environnement hybride a travers les systemes d'exploitation, recuperer les metriques personnalisees des applications ou services et collecter les logs depuis les instances Amazon EC2 et les serveurs sur site.

## J'ai toutes les echelles d'installation requises dans mon environnement, comment l'agent CloudWatch peut-il etre installe normalement et en utilisant l'automatisation ?

Sur tous les systemes d'exploitation supportes incluant les serveurs Linux et Windows, les clients peuvent telecharger et [installer l'agent CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-on-EC2-Instance.html) en utilisant la [ligne de commande](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/installing-cloudwatch-agent-commandline.html), en utilisant AWS [Systems Manager](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/installing-cloudwatch-agent-ssm.html), ou en utilisant un [template AWS CloudFormation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent-New-Instances-CloudFormation.html). Vous pouvez egalement installer l'[agent CloudWatch sur les serveurs sur site](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-on-premise.html) pour la surveillance.

## Nous avons plusieurs comptes AWS dans plusieurs regions dans notre Organisation, est-ce qu'Amazon CloudWatch fonctionne pour ces scenarios ?

Amazon CloudWatch fournit l'[observability multi-comptes](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Unified-Cross-Account.html) qui aide les clients a surveiller et depanner la sante des ressources et applications qui s'etendent sur plusieurs comptes au sein d'une region. Amazon CloudWatch fournit egalement un [tableau de bord multi-comptes et multi-regions](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Cross-Account-Cross-Region.html). Avec cette fonctionnalite, les clients peuvent obtenir une visibilite et des informations sur leurs ressources et charges de travail multi-comptes et multi-regions.

## Quel type de support d'automatisation est disponible pour Amazon CloudWatch ?

En plus d'acceder a Amazon CloudWatch via AWS Management Console, les clients peuvent egalement acceder au service via l'API, l'[interface de ligne de commande AWS (CLI)](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) et les [SDK AWS](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/sdk-general-information-section.html). L'[API CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/Welcome.html) pour les metriques et tableaux de bord aide a automatiser via [AWS CLI](https://docs.aws.amazon.com/AmazonCloudWatch/latest/cli/Welcome.html) ou a s'integrer avec des logiciels/produits pour que vous puissiez passer moins de temps a gerer ou administrer les ressources et applications. L'[API CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatchLogs/latest/APIReference/Welcome.html) pour les logs ainsi que l'[AWS CLI](https://docs.aws.amazon.com/cli/latest/reference/logs/index.html) sont egalement disponibles separement. Des [exemples de code pour CloudWatch utilisant les SDK AWS](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/service_code_examples.html) sont disponibles pour les clients comme reference supplementaire.

## Je veux demarrer rapidement la surveillance des ressources, quelle est l'approche recommandee ?

Les tableaux de bord automatiques dans CloudWatch sont disponibles dans toutes les regions publiques AWS et fournissent une vue agregee de la sante et des performances de toutes les ressources AWS. Cela aide les clients a demarrer rapidement la surveillance, une vue des metriques basee sur les ressources et les alarmes, et a approfondir facilement pour comprendre la cause racine des problemes de performance. Les [tableaux de bord automatiques](https://docs.aws.amazon.com/prescriptive-guidance/latest/implementing-logging-monitoring-cloudwatch/cloudwatch-dashboards-visualizations.html) sont preconstruits avec les bonnes pratiques recommandees par les services AWS, restent conscients des ressources et se mettent a jour dynamiquement pour refleter le dernier etat des metriques de performance importantes.

Atelier AWS Observability associe : [Automatic Dashboards](https://catalog.workshops.aws/observability/en-US/aws-native/dashboards/autogen-dashboard)

## Je veux personnaliser ce que je surveille dans CloudWatch, quelle est l'approche recommandee ?

Avec les [tableaux de bord personnalises](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/create_dashboard.html), les clients peuvent creer autant de tableaux de bord supplementaires qu'ils le souhaitent avec differents widgets et les personnaliser en consequence. Lors de la creation d'un tableau de bord personnalise, il existe une variete de types de widgets disponibles a choisir pour la personnalisation.

Atelier AWS Observability associe : [Dashboarding](https://catalog.workshops.aws/observability/en-US/aws-native/ec2-monitoring/dashboarding)

## J'ai construit quelques tableaux de bord personnalises, y a-t-il un moyen de les partager ?

Oui, le [partage des tableaux de bord CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch-dashboard-sharing.html) est possible. Il existe trois facons de partager. Partager un seul tableau de bord publiquement en permettant a toute personne ayant acces au lien de voir le tableau de bord. Partager un seul tableau de bord de maniere privee en specifiant les adresses e-mail des personnes autorisees a voir le tableau de bord. Partager tous les tableaux de bord CloudWatch du compte en specifiant un fournisseur d'authentification unique (SSO) tiers pour l'acces aux tableaux de bord.

> Atelier AWS Observability associe : [Sharing CloudWatch Dashboards](https://catalog.workshops.aws/observability/en-US/aws-native/dashboards/sharingdashboard)

## Je veux ameliorer l'observability de mon application y compris les ressources AWS sous-jacentes, comment puis-je y parvenir ?

[Amazon CloudWatch Application Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch-application-insights.html) facilite l'observability de vos applications ainsi que des ressources AWS sous-jacentes comme les bases de donnees SQL Server, la pile web basee sur .Net (IIS), les serveurs d'application, le systeme d'exploitation, les equilibreurs de charge, les files d'attente, etc. Il aide les clients a identifier et configurer les metriques et logs cles a travers les ressources applicatives et la pile technologique. Ce faisant, il reduit le temps moyen de reparation (MTTR) et permet un depannage plus rapide des problemes applicatifs.

> Details supplementaires dans la FAQ : [AWS resource & custom metrics monitoring](https://aws.amazon.com/cloudwatch/faqs/#AWS_resource_.26_custom_metrics_monitoring)

## Mon Organisation est centree sur l'open-source, est-ce qu'Amazon CloudWatch prend en charge la surveillance et l'observability via les technologies open-source ?

Pour la collecte de metriques et de traces, le [collecteur AWS Distro for OpenTelemetry (ADOT)](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-open-telemetry.html) ainsi que l'agent CloudWatch peuvent etre installes cote a cote sur une instance Amazon EC2 et les SDK OpenTelemetry peuvent etre utilises pour collecter les traces et metriques applicatives depuis vos charges de travail s'executant sur les instances Amazon EC2.

Pour prendre en charge les metriques OpenTelemetry dans Amazon CloudWatch, l'[exporteur AWS EMF pour OpenTelemetry Collector](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/awsemfexporter) convertit les metriques au format OpenTelemetry vers le format de metrique integre CloudWatch (EMF), ce qui permet aux applications integrees avec les metriques OpenTelemetry d'envoyer des [metriques applicatives en haute cardinalite vers CloudWatch](https://aws-otel.github.io/docs/getting-started/adot-eks-add-on/config-cloudwatch).

Pour les logs, Fluent Bit aide a creer un point d'extension facile pour diffuser les [logs depuis Amazon EC2](https://docs.fluentbit.io/manual/pipeline/outputs/cloudwatch) vers les services AWS incluant Amazon CloudWatch pour la retention et l'analyse des logs. Le [plugin Fluent Bit](https://github.com/aws/amazon-cloudwatch-logs-for-fluent-bit#new-higher-performance-core-fluent-bit-plugin) recemment lance peut router les logs vers Amazon CloudWatch.

Pour les tableaux de bord, Amazon Managed Grafana peut etre ajoute avec [Amazon CloudWatch comme source de donnees](https://docs.aws.amazon.com/grafana/latest/userguide/using-amazon-cloudwatch-in-AMG.html) en utilisant l'option de configuration de source de donnees AWS dans la console de l'espace de travail Grafana. Cette fonctionnalite simplifie l'ajout de CloudWatch comme source de donnees en decouvrant les comptes CloudWatch existants et en gerant la configuration des identifiants d'authentification necessaires pour acceder a CloudWatch.

## Notre charge de travail est deja construite pour collecter des metriques en utilisant Prometheus depuis l'environnement. Puis-je continuer a utiliser la meme methodologie ?

Les clients peuvent choisir d'avoir une configuration entierement open-source pour leurs besoins d'observability. Pour cela, le collecteur AWS Distro for OpenTelemetry (ADOT) peut etre configure pour scraper depuis une application instrumentee Prometheus et envoyer les metriques au serveur Prometheus ou a Amazon Managed Prometheus.

L'agent CloudWatch sur les instances EC2 peut etre installe et configure avec [Prometheus pour scraper les metriques](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-PrometheusEC2.html) pour la surveillance dans CloudWatch. Cela peut etre utile aux clients qui preferent les charges de travail conteneurisees sur EC2 et necessitent des metriques personnalisees compatibles avec la surveillance open-source Prometheus.

La [surveillance Container Insights pour Prometheus](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights-Prometheus.html) de CloudWatch automatise la decouverte des metriques Prometheus depuis les systemes et charges de travail conteneurises. La decouverte des metriques Prometheus est prise en charge pour Amazon Elastic Container Service (ECS), Amazon Elastic Kubernetes Service (EKS) et les clusters Kubernetes s'executant sur les instances Amazon EC2.

## Mes charges de travail contiennent du calcul microservices, notamment des conteneurs lies a EKS/Kubernetes, comment utiliser Amazon CloudWatch pour obtenir des informations sur l'environnement ?

Les clients peuvent utiliser [CloudWatch Container Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html) pour collecter, agreger et resumer les metriques et logs des applications conteneurisees et des microservices s'executant sur [Amazon Elastic Kubernetes Service (Amazon EKS)](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/deploy-container-insights-EKS.html) ou les plateformes Kubernetes sur Amazon EC2. [Container Insights](https://aws.amazon.com/cloudwatch/faqs/#Container_Monitoring) prend egalement en charge la collecte de metriques depuis les clusters deployes sur Fargate pour Amazon EKS. CloudWatch [collecte automatiquement des metriques](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-metrics.html) pour de nombreuses ressources, telles que le CPU, la memoire, le disque et le reseau et fournit egalement des [informations de diagnostic](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-reference.html), telles que les echecs de redemarrage de conteneurs, pour aider a isoler les problemes et les resoudre rapidement.

> Atelier AWS Observability associe : [Container Insights on EKS](https://catalog.workshops.aws/observability/en-US/aws-native/insights/containerinsights/eks)

## Mes charges de travail contiennent du calcul microservices, notamment des conteneurs lies a ECS, comment utiliser Amazon CloudWatch pour obtenir des informations sur l'environnement ?

Les clients peuvent utiliser [CloudWatch Container Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html) pour collecter, agreger et resumer les metriques et logs des applications conteneurisees et des microservices s'executant sur [Amazon Elastic Container Service (Amazon ECS)](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/deploy-container-insights-ECS.html) ou les plateformes de conteneurs sur Amazon EC2. [Container Insights](https://aws.amazon.com/cloudwatch/faqs/#Container_Monitoring) prend egalement en charge la collecte de metriques depuis les clusters deployes sur Fargate pour Amazon ECS. CloudWatch [collecte automatiquement des metriques](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-metrics.html) pour de nombreuses ressources, telles que le CPU, la memoire, le disque et le reseau et fournit egalement des [informations de diagnostic](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-reference.html), telles que les echecs de redemarrage de conteneurs, pour aider a isoler les problemes et les resoudre rapidement.

> Atelier AWS Observability associe : [Container Insights on ECS](https://catalog.workshops.aws/observability/en-US/aws-native/insights/containerinsights/ecs)

## Mes charges de travail contiennent du calcul serverless, notamment AWS Lambda, comment utiliser Amazon CloudWatch pour obtenir des informations sur l'environnement ?

Les clients peuvent utiliser [CloudWatch Lambda Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Lambda-Insights.html) pour la surveillance et le depannage des applications serverless s'executant sur AWS Lambda. [CloudWatch Lambda Insights](https://aws.amazon.com/cloudwatch/faqs/#Lambda_Monitoring) collecte, agrege et resume les metriques au niveau systeme incluant le temps CPU, la memoire, le disque et le reseau et collecte, agrege et resume egalement les informations de diagnostic telles que les demarrages a froid et les arrets de workers Lambda pour aider les clients a isoler les problemes avec les fonctions Lambda et les resoudre rapidement.

> Atelier AWS Observability associe : [Lambda Insights](https://catalog.workshops.aws/observability/en-US/aws-native/insights/lambdainsights)

## J'agrege beaucoup de logs dans Amazon CloudWatch Logs, comment obtenir de l'observability sur ces donnees ?

[CloudWatch Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html) permet aux clients de rechercher interactivement, d'analyser les donnees de logs et d'effectuer des requetes pour repondre efficacement aux problemes operationnels dans Amazon CloudWatch Logs. Si un probleme survient, les clients peuvent utiliser [CloudWatch Logs Insights](https://aws.amazon.com/cloudwatch/faqs/#Log_analytics) pour identifier les causes potentielles et valider les correctifs deployes.

## Comment interroger les logs dans Amazon CloudWatch Logs ?

CloudWatch Logs Insights dans Amazon CloudWatch Logs utilise un [langage de requete](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html) pour interroger les groupes de logs.

## Comment gerer les logs stockes dans Amazon CloudWatch Logs pour l'optimisation des couts, la retention de conformite ou le traitement supplementaire ?

Par defaut, les [LogGroups](https://aws.amazon.com/cloudwatch/faqs/#Log_management) d'Amazon CloudWatch Logs sont [conserves indefiniment et n'expirent jamais](https://docs.aws.amazon.com/managedservices/latest/userguide/log-customize-retention.html). Les clients peuvent ajuster la politique de retention de chaque groupe de logs pour choisir une periode de retention entre un jour et 10 ans, selon la duree pendant laquelle ils souhaitent conserver les logs pour optimiser les couts ou pour la conformite.

Les clients peuvent exporter les donnees de logs depuis les [groupes de logs vers un bucket Amazon S3](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/S3Export.html) et utiliser ces donnees pour un traitement et une analyse personnalises, ou pour les charger dans d'autres systemes.

Les clients peuvent egalement configurer les groupes de logs dans CloudWatch Logs pour [diffuser les donnees vers votre cluster Amazon OpenSearch Service](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_OpenSearch_Stream.html) en quasi temps reel via un abonnement CloudWatch Logs. Ce faisant, cela aide les clients a effectuer des analyses de logs interactives, une surveillance applicative en temps reel, des recherches et plus encore.

## Mes charges de travail generent des logs qui pourraient contenir des donnees sensibles, y a-t-il un moyen de les proteger dans Amazon CloudWatch ?

Les clients peuvent utiliser la [fonctionnalite de protection des donnees de logs](https://aws.amazon.com/cloudwatch/faqs/#Log_data_protection) dans CloudWatch Logs qui aide les clients a [definir leurs propres regles et politiques pour detecter et masquer automatiquement](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/mask-sensitive-log-data.html#mask-sensitive-log-data-start) les donnees sensibles dans les logs collectes depuis les systemes et applications.

Atelier AWS Observability associe : [Data Protection](https://catalog.workshops.aws/observability/en-US/aws-native/logs/dataprotection)

## Je voudrais connaitre les bandes d'anomalie ou les changements inattendus lorsqu'ils surviennent dans mes systemes et applications. Comment Amazon CloudWatch peut-il m'alerter lorsque cela se produit ?

[Amazon CloudWatch Anomaly Detection](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Anomaly_Detection.html) applique des algorithmes statistiques et d'apprentissage automatique pour analyser en continu les series temporelles uniques des systemes et applications, determiner les lignes de base normales et faire remonter les anomalies avec une intervention utilisateur minimale. Les algorithmes creent un modele de detection d'anomalies qui genere une plage de valeurs attendues representant le comportement normal des metriques. Les clients peuvent [creer des alarmes](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Create_Anomaly_Detection_Alarm.html) basees sur l'analyse des donnees de metriques passees et une valeur definie pour le seuil d'anomalie.

> Atelier AWS Observability associe : [Anomaly Detection](https://catalog.workshops.aws/observability/en-US/aws-native/metrics/alarms/anomalydetection)

## J'ai configure une alarme de metriques dans Amazon CloudWatch, mais je recois des bruits d'alarme frequents. Comment puis-je controler et affiner cela ?

Les clients peuvent combiner plusieurs alarmes dans des hierarchies d'alarmes en tant qu'[alarme composite](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Create_Composite_Alarm.html) pour reduire le bruit des alarmes en ne se declenchant qu'une seule fois lorsque plusieurs [alarmes](https://aws.amazon.com/cloudwatch/faqs/#Alarms) se declenchent simultanement. Les alarmes composites prennent en charge un etat global en aidant les clients a regrouper les ressources comme une application, une region AWS ou une zone de disponibilite.

> Atelier AWS Observability associe : [Alarms](https://catalog.workshops.aws/observability/en-US/aws-native/metrics/alarms)

## Ma charge de travail exposee a Internet rencontre des problemes de performance et de disponibilite, comment puis-je depanner ?

[Amazon CloudWatch Internet Monitor](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-InternetMonitor.html) fournit une visibilite sur la facon dont les problemes Internet impactent la performance et la disponibilite entre vos applications hebergees sur AWS et vos utilisateurs finaux. Avec [Internet Monitor](https://aws.amazon.com/cloudwatch/faqs/#Internet_Monitoring), vous pouvez rapidement identifier ce qui impacte la performance et la disponibilite de votre application, afin de pouvoir suivre et traiter les problemes, ce qui peut reduire considerablement le temps necessaire pour diagnostiquer les problemes Internet.

## J'ai ma charge de travail sur AWS et je veux etre notifie avant meme que les utilisateurs finaux ne subissent un impact ou une latence dans l'acces a l'application. Comment obtenir une meilleure visibilite et ameliorer l'observability de ma charge de travail orientee client ?

Les clients peuvent utiliser [Amazon CloudWatch Synthetics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries.html) pour creer des canaries, des scripts configurables qui s'executent selon un calendrier, pour surveiller vos endpoints et API. Les canaries suivent les memes routes et effectuent les memes actions qu'un client, ce qui permet de verifier continuellement l'experience utilisateur final meme lorsqu'il n'y a pas de trafic en direct vers vos applications. Les canaries vous aident a decouvrir les problemes avant meme vos clients. Les canaries verifient la disponibilite et la latence des endpoints et peuvent stocker les donnees de temps de chargement et des captures d'ecran de l'interface utilisateur telle que rendue par un navigateur Chromium headless.

> Atelier AWS Observability associe : [CloudWatch Synthetics](https://catalog.workshops.aws/observability/en-US/aws-native/app-monitoring/synthetics)

## Comment puis-je observer l'experience utilisateur final en identifiant les performances cote client et en resolvant les problemes en temps reel ?

[CloudWatch RUM](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM.html) peut effectuer une surveillance des utilisateurs reels pour collecter et visualiser les donnees cote client sur les performances de votre application web a partir de sessions utilisateur reelles en quasi temps reel. Ces donnees collectees aident a identifier et deboguer rapidement les problemes de performance cote client et aident egalement a visualiser et analyser les temps de chargement des pages, les erreurs cote client et le comportement des utilisateurs. Lors de la visualisation de ces donnees, les clients peuvent les voir toutes agregees ensemble et egalement voir les repartitions par les navigateurs et appareils que leurs clients utilisent. CloudWatch RUM aide a visualiser les anomalies dans les performances de votre application et a trouver les donnees de debogage pertinentes telles que les messages d'erreur, les traces de pile et les sessions utilisateur.

> Atelier AWS Observability associe : [CloudWatch RUM](https://catalog.workshops.aws/observability/en-US/aws-native/app-monitoring/rum)

## Mon Organisation exige que toutes les actions soient enregistrees pour les audits. Les evenements Amazon CloudWatch peuvent-ils etre enregistres ?

Amazon CloudWatch est integre avec [AWS CloudTrail](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html), qui fournit un enregistrement des actions effectuees par un utilisateur, un role ou un service AWS dans Amazon CloudWatch. CloudTrail capture tous les [appels API pour Amazon CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/logging_cw_api_calls.html) en tant qu'evenements qui incluent les appels depuis la console et les appels de code aux operations API.

## Quelles informations supplementaires sont disponibles ?

Pour des informations supplementaires, les clients peuvent lire la documentation AWS pour [CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html), [CloudWatch Events](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/WhatIsCloudWatchEvents.html) et [CloudWatch Logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html), parcourir l'atelier AWS Observability sur [AWS Native Observability](https://catalog.workshops.aws/observability/en-US/aws-native) et egalement consulter la [page produit](https://aws.amazon.com/cloudwatch/) pour connaitre les [fonctionnalites](https://aws.amazon.com/cloudwatch/features/) et les details de [tarification](https://aws.amazon.com/cloudwatch/pricing/). Des [tutoriels supplementaires sur CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-tutorials.html) illustrant des scenarios d'utilisation client.

**FAQ Produit :** [https://aws.amazon.com/cloudwatch/faqs/](https://aws.amazon.com/cloudwatch/faqs/)
