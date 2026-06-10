# Meilleures pratiques de surveillance et d'Observability pour Databricks sur AWS

Databricks est une plateforme de gestion des charges de travail d'analyse de donnees et d'IA/ML. Ce guide vise a accompagner les clients utilisant [Databricks sur AWS](https://aws.amazon.com/solutions/partners/databricks/) dans la surveillance de ces charges de travail a l'aide des services natifs AWS pour l'observabilite ou des services open source manages.

## Pourquoi surveiller Databricks

Les equipes d'exploitation gerant des clusters Databricks beneficient d'un tableau de bord integre et personnalise pour suivre l'etat des charges de travail, les erreurs et les goulots d'etranglement de performance ; d'alertes sur les comportements indesirables, tels que l'utilisation totale des ressources dans le temps ou le pourcentage d'erreurs ; et d'une journalisation centralisee pour l'analyse des causes profondes, ainsi que l'extraction de metriques personnalisees supplementaires.

## Quoi surveiller

Databricks execute Apache Spark dans ses instances de cluster, qui dispose de fonctionnalites natives pour exposer des metriques. Ces metriques fournissent des informations concernant les drivers, les workers et les charges de travail executees dans le cluster.

Les instances executant Spark disposeront d'informations supplementaires utiles sur le stockage, le CPU, la memoire et le reseau. Il est important de comprendre quels facteurs externes pourraient affecter les performances d'un cluster Databricks. Dans le cas de clusters avec de nombreuses instances, comprendre les goulots d'etranglement et l'etat de sante general est egalement important.

## Comment surveiller

Pour installer les collecteurs et leurs dependances, des scripts d'initialisation Databricks seront necessaires. Ce sont des scripts executes dans chaque instance d'un cluster Databricks au demarrage.

Les permissions du cluster Databricks devront egalement autoriser l'envoi de metriques et de logs en utilisant des profils d'instance.

Enfin, il est recommande de configurer l'espace de noms des metriques dans la configuration Spark du cluster Databricks, en remplacant `testApp` par une reference appropriee au cluster.

![Databricks Spark Config](../../images/databricks_spark_config.png)
*Figure 1 : exemple de configuration de l'espace de noms des metriques Spark*

## Elements cles d'une bonne solution d'Observability pour Databricks

**1) Metriques :** Les metriques sont des nombres qui decrivent une activite ou un processus particulier mesure sur une periode de temps. Voici les differents types de metriques sur Databricks :

Metriques au niveau des ressources systeme, telles que le CPU, la memoire, le disque et le reseau.
Metriques applicatives utilisant Custom Metrics Source, StreamingQueryListener et QueryExecutionListener.
Metriques Spark exposees par MetricsSystem.

**2) Logs :** Les logs sont une representation d'evenements en serie qui se sont produits, et ils racontent une histoire lineaire a leur sujet. Voici les differents types de logs sur Databricks :

- Logs d'evenements
- Logs d'audit
- Logs du driver : stdout, stderr, logs log4j personnalises (activer la journalisation structuree)
- Logs des executeurs : stdout, stderr, logs log4j personnalises (activer la journalisation structuree)

**3) Traces :** Les traces de pile offrent une visibilite de bout en bout, et elles montrent le flux complet a travers les etapes. Cela est utile lorsque vous devez debugger pour identifier quelles etapes/codes causent des erreurs/problemes de performance.

**4) Tableaux de bord :** Les tableaux de bord fournissent une excellente vue resumee des metriques essentielles d'une application/service.

**5) Alertes :** Les alertes notifient les ingenieurs des conditions qui necessitent une attention.

## Options d'Observability natives AWS

Les solutions natives, telles que l'interface Ganglia et la livraison de logs, sont d'excellentes solutions pour collecter les metriques systeme et interroger les metriques Apache Spark. Cependant, certains domaines peuvent etre ameliores :

- Ganglia ne prend pas en charge les alertes.
- Ganglia ne prend pas en charge la creation de metriques derivees des logs (par exemple, le taux de croissance des logs ERROR).
- Vous ne pouvez pas utiliser de tableaux de bord personnalises pour suivre les SLO (Service Level Objectives) et les SLI (Service Level Indicators) lies a l'exactitude des donnees, a la fraicheur des donnees ou a la latence de bout en bout, puis les visualiser avec Ganglia.

[Amazon CloudWatch](https://aws.amazon.com/cloudwatch/) est un outil essentiel pour surveiller et gerer vos clusters Databricks sur AWS. Il fournit des informations precieuses sur les performances du cluster et vous aide a identifier et resoudre rapidement les problemes. L'integration de Databricks avec CloudWatch et l'activation de la journalisation structuree peuvent aider a ameliorer ces domaines. CloudWatch Application Insights peut vous aider a decouvrir automatiquement les champs contenus dans les logs, et CloudWatch Logs Insights fournit un langage de requete specialise pour un debogage et une analyse plus rapides.

![Databricks With CloudWatch](../../images/databricks_cw_arch.png)
*Figure 2 : Architecture Databricks CloudWatch*

Pour plus d'informations sur l'utilisation de CloudWatch pour surveiller Databricks, consultez :
[How to Monitor Databricks with Amazon CloudWatch](https://aws.amazon.com/blogs/mt/how-to-monitor-databricks-with-amazon-cloudwatch/)

## Options d'observabilite open source

[Amazon Managed Service for Prometheus](https://aws.amazon.com/prometheus/) est un service de surveillance compatible Prometheus, manage et serverless, qui sera responsable du stockage des metriques et de la gestion des alertes creees sur la base de ces metriques. Prometheus est une technologie de surveillance open source populaire, etant le deuxieme projet appartenant a la Cloud Native Computing Foundation, juste apres Kubernetes.

[Amazon Managed Grafana](https://aws.amazon.com/grafana/) est un service manage pour Grafana. Grafana est une technologie open source de visualisation de donnees temporelles, couramment utilisee pour l'observabilite. Nous pouvons utiliser Grafana pour visualiser des donnees provenant de plusieurs sources, telles qu'Amazon Managed Service for Prometheus, Amazon CloudWatch et bien d'autres. Il sera utilise pour visualiser les metriques et alertes Databricks.

[AWS Distro for OpenTelemetry](https://aws-otel.github.io/) est la distribution du projet OpenTelemetry supportee par AWS, qui fournit des standards open source, des bibliotheques et des services pour la collecte de traces et de metriques. Grace a OpenTelemetry, nous pouvons collecter plusieurs formats differents de donnees d'observabilite, tels que Prometheus ou StatsD, enrichir ces donnees et les envoyer vers plusieurs destinations, telles que CloudWatch ou Amazon Managed Service for Prometheus.

### Cas d'utilisation

Bien que les services natifs AWS fournissent l'observabilite necessaire pour gerer les clusters Databricks, il existe certains scenarios ou l'utilisation de services open source manages est le meilleur choix.

Prometheus et Grafana sont des technologies tres populaires et sont deja utilisees dans de nombreuses entreprises. Les services open source AWS pour l'observabilite permettront aux equipes d'exploitation d'utiliser la meme infrastructure existante, le meme langage de requete, ainsi que les tableaux de bord et alertes existants pour surveiller les charges de travail Databricks, sans la charge operationnelle de gerer l'infrastructure, la scalabilite et les performances de ces services.

ADOT est la meilleure alternative pour les equipes qui ont besoin d'envoyer des metriques et des traces vers differentes destinations, telles que CloudWatch et Prometheus, ou de travailler avec differents types de sources de donnees, telles qu'OTLP et StatsD.

Enfin, Amazon Managed Grafana prend en charge de nombreuses sources de donnees differentes, y compris CloudWatch et Prometheus, et aide a correler les donnees pour les equipes qui decident d'utiliser plus d'un outil, permettant la creation de modeles qui activeront l'observabilite pour tous les clusters Databricks, et une API puissante qui permet son provisionnement et sa configuration via l'Infrastructure as Code.

![Databricks OpenSource Observability Diagram](../../images/databricks_oss_diagram.png)
*Figure 3 : Architecture d'Observability Open Source pour Databricks*

Pour observer les metriques d'un cluster Databricks en utilisant les services open source manages AWS pour l'observabilite, vous aurez besoin d'un espace de travail Amazon Managed Grafana pour visualiser a la fois les metriques et les alertes, et d'un espace de travail Amazon Managed Service for Prometheus, configure comme source de donnees dans l'espace de travail Amazon Managed Grafana.

Il existe deux types importants de metriques qui doivent etre collectees : les metriques Spark et les metriques de noeud.

Les metriques Spark apporteront des informations telles que le nombre actuel de workers dans le cluster, ou d'executeurs ; les shuffles, qui se produisent lorsque les noeuds echangent des donnees pendant le traitement ; ou les spills, lorsque les donnees passent de la RAM au disque et du disque a la RAM. Pour exposer ces metriques, le Prometheus natif de Spark - disponible depuis la version 3.0 - doit etre active via la console de gestion Databricks et configure via un `init_script`.

Pour suivre les metriques de noeud, telles que l'utilisation du disque, le temps CPU, la memoire et les performances de stockage, nous utilisons le `node_exporter`, qui peut etre utilise sans configuration supplementaire, mais ne devrait exposer que les metriques importantes.

Un collecteur ADOT doit etre installe dans chaque noeud du cluster, collectant les metriques exposees par Spark et le `node_exporter`, filtrant ces metriques, injectant des metadonnees telles que `cluster_name`, et envoyant ces metriques a l'espace de travail Prometheus.

Le collecteur ADOT et le `node_exporter` doivent etre installes et configures via un `init_script`.

Le cluster Databricks doit etre configure avec un role IAM ayant la permission d'ecrire des metriques dans l'espace de travail Prometheus.

## Meilleures pratiques

### Prioriser les metriques de valeur

Spark et node_exporter exposent tous deux plusieurs metriques, et plusieurs formats pour les memes metriques. Sans filtrer les metriques utiles pour la surveillance et la reponse aux incidents, le temps moyen de detection des problemes augmente, les couts de stockage des echantillons augmentent, et les informations precieuses seront plus difficiles a trouver et a comprendre. En utilisant les processeurs OpenTelemetry, il est possible de filtrer et de ne conserver que les metriques de valeur, ou de filtrer les metriques qui n'ont pas de sens ; d'agreger et de calculer les metriques avant de les envoyer a AMP.

### Eviter la fatigue d'alerte

Une fois que les metriques de valeur sont ingerees dans AMP, il est essentiel de configurer des alertes. Cependant, alerter sur chaque pic d'utilisation des ressources peut causer une fatigue d'alerte, c'est-a-dire quand trop de bruit diminuera la confiance dans la severite des alertes et laissera des evenements importants non detectes. La fonctionnalite de regroupement des regles d'alerte d'AMP devrait etre utilisee pour eviter l'ambiguite, c'est-a-dire plusieurs alertes connectees generant des notifications separees. De plus, les alertes doivent recevoir la severite appropriee, et celle-ci doit refleter les priorites commerciales.

### Reutiliser les tableaux de bord Amazon Managed Grafana

Amazon Managed Grafana exploite la fonctionnalite native de modeles de Grafana, qui permet la creation de tableaux de bord pour tous les clusters Databricks existants et nouveaux. Cela elimine le besoin de creer et de maintenir manuellement des visualisations pour chaque cluster. Pour utiliser cette fonctionnalite, il est important d'avoir les bons labels dans les metriques pour regrouper ces metriques par cluster. Encore une fois, c'est possible avec les processeurs OpenTelemetry.

## References et informations supplementaires

- [Create Amazon Managed Service for Prometheus workspace](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-onboard-create-workspace.html)
- [Create Amazon Managed Grafana workspace](https://docs.aws.amazon.com/grafana/latest/userguide/Amazon-Managed-Grafana-create-workspace.html)
- [Configure Amazon Managed Service for Prometheus datasource](https://docs.aws.amazon.com/grafana/latest/userguide/prometheus-data-source.html)
- [Databricks Init Scripts](https://docs.databricks.com/clusters/init-scripts.html)
