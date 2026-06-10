# Objectifs de niveau de service (SLOs)

Les applications hautement disponibles et résilientes sont-elles un moteur commercial actif pour votre entreprise **?**  
Si la réponse est '**oui**', continuez la lecture.

Les pannes sont inévitables et tout finira par échouer avec le temps ! Cela devient une leçon encore plus importante lorsque vous construisez des applications qui doivent évoluer à grande échelle. C'est là qu'intervient l'importance des SLOs.

Les SLOs mesurent un objectif convenu pour la disponibilité du service, basé sur les parcours critiques des utilisateurs finaux. Cet objectif convenu doit être élaboré autour de ce qui compte pour votre client / utilisateur final. Pour construire un tel écosystème résilient, vous devez mesurer les performances de manière objective et rapporter la fiabilité avec précision en utilisant des SLOs significatifs, réalistes et exploitables. Familiarisons-nous maintenant avec les terminologies clés des niveaux de service.

## Terminologie des niveaux de service

- SLI est l'indicateur de niveau de service : une mesure quantitative soigneusement définie d'un aspect du niveau de service fourni.

- SLO est l'objectif de niveau de service : une valeur cible ou une plage de valeurs pour un niveau de service mesuré par un SLI, sur une période de temps.

- SLA est l'accord de niveau de service : un accord avec vos clients qui inclut les conséquences du non-respect des SLOs qu'il contient.

Le diagramme suivant illustre que le SLA est une 'promesse/accord', le SLO est un 'objectif/valeur cible', et le SLI est une mesure de 'comment le service s'est-il comporté ?'.

![Flux de données SLO](../images/slo.png)

### Existe-t-il un outil AWS pour surveiller tout cela ?

La réponse est '**oui**' !

[Amazon CloudWatch Application Signals](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Monitoring-Sections.html) est une nouvelle fonctionnalité qui facilite l'instrumentation et l'exploitation automatiques des applications sur AWS. Application Signals instrumente vos applications sur AWS afin que vous puissiez surveiller la santé de votre application et suivre les performances par rapport à vos objectifs métier. Application Signals vous fournit une vue unifiée et centrée sur l'application de vos applications, services et dépendances, et vous aide à surveiller et trier la santé de l'application. Application Signals est pris en charge et testé sur Amazon EKS, Amazon ECS et Amazon EC2, et au moment de la rédaction de cet article, il ne prend en charge que les applications Java !

Application Signals vous aide à définir des SLOs sur vos métriques de performance clés. Vous pouvez utiliser Application Signals pour créer des objectifs de niveau de service pour les services de vos opérations métier critiques. En créant des SLOs sur ces services, vous pourrez les suivre sur le tableau de bord SLO, ce qui vous donne une vue d'ensemble de vos opérations les plus importantes. Pour accélérer l'identification des causes racines, Application Signals fournit une vue complète des performances applicatives, intégrant des signaux de performance supplémentaires provenant de CloudWatch Synthetics, qui surveille les API critiques et les interactions utilisateur, et de CloudWatch RUM, qui surveille les performances des utilisateurs réels.

Application Signals collecte automatiquement les métriques de latence et de disponibilité pour chaque service et opération qu'il découvre, et ces métriques sont souvent idéales à utiliser comme SLIs. En même temps, Application Signals vous offre la flexibilité d'utiliser n'importe quelle métrique CloudWatch ou expression de métrique comme SLI !

Application Signals instrumente automatiquement les applications selon les meilleures pratiques pour la performance applicative et corrèle la télémétrie entre les métriques, traces, journaux, la surveillance des utilisateurs réels et la surveillance synthétique pour les applications exécutées sur Amazon EKS. Lisez ce [blog](https://aws.amazon.com/blogs/aws/amazon-cloudwatch-application-signals-for-automatic-instrumentation-of-your-applications-preview/) pour plus de détails.

Consultez ce [blog](https://aws.amazon.com/blogs/mt/how-to-monitor-application-health-using-slos-with-amazon-cloudwatch-application-signals/) pour apprendre comment configurer un SLO dans CloudWatch Application Signals afin de surveiller la fiabilité d'un service.

L'Observability est un élément fondamental pour établir un service fiable, plaçant ainsi votre organisation sur la bonne voie pour opérer efficacement à grande échelle. Nous croyons qu'[Amazon CloudWatch Application Signals](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Monitoring-Sections.html) sera un outil formidable pour vous aider à atteindre cet objectif.
