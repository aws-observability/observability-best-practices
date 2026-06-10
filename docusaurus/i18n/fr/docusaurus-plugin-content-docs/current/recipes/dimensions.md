# Dimensions

Dans le contexte de ce site, nous considerons l'espace o11y selon six dimensions.
Examiner chaque dimension independamment est benefique d'un point de vue synthetique,
c'est-a-dire lorsque vous essayez de construire une solution d'observabilite concrete
pour une charge de travail donnee, couvrant des aspects lies au developpement comme le
langage de programmation utilise ainsi que des sujets operationnels, par exemple
l'environnement d'execution comme les conteneurs ou les fonctions Lambda.

![espace o11y](images/o11y-space.png)


:::note
    "Qu'est-ce qu'un signal ?"
    Quand nous disons signal ici, nous entendons tout type de donnees et metadonnees
    d'observabilite, y compris les entrees de journal, les metriques et les traces.
    Sauf si nous voulons ou devons etre plus specifiques, nous utilisons "signal" et
    il devrait etre clair d'apres le contexte quelles restrictions peuvent s'appliquer.
:::

Examinons maintenant chacune des six dimensions une par une :

## Destinations

Dans cette dimension, nous considerons tous les types de destinations de signaux, y compris
le stockage a long terme et les interfaces graphiques qui vous permettent de consommer des
signaux. En tant que developpeur, vous souhaitez acceder a une interface utilisateur ou une
API qui vous permet de decouvrir, rechercher et correler des signaux pour depanner votre
service. Dans un role d'infrastructure ou de plateforme, vous souhaitez acceder a une
interface utilisateur ou une API qui vous permet de gerer, decouvrir, rechercher et
correler des signaux pour comprendre l'etat de l'infrastructure.

![Capture d'ecran Grafana](images/grafana.png)

En fin de compte, c'est la dimension la plus interessante d'un point de vue humain.
Cependant, pour pouvoir en recolter les benefices, nous devons d'abord investir un
peu de travail : nous devons instrumenter notre logiciel et nos dependances externes
et ingerer les signaux dans les destinations.

Alors, comment les signaux arrivent-ils dans les destinations ? Bonne question, ce sont les...

## Agents

Comment les signaux sont collectes et achemines vers les outils d'analyse. Les signaux
peuvent provenir de deux sources : soit le code source de votre application (voir aussi
la section langages), soit des elements dont votre application depend, comme l'etat gere
dans les magasins de donnees ainsi que l'infrastructure comme les VPC (voir aussi la
section infrastructure et donnees).

Les agents font partie de la telemetrie que vous utiliseriez pour collecter et ingerer
des signaux. L'autre partie est constituee des applications instrumentees et des
composants d'infrastructure comme les bases de donnees.

## Langages

Cette dimension concerne le langage de programmation que vous utilisez pour ecrire votre
service ou application. Ici, nous traitons des SDK et des bibliotheques, comme les
[SDK X-Ray][xraysdks] ou ce qu'OpenTelemetry fournit dans le contexte de
l'[instrumentation][otelinst]. Vous voulez vous assurer qu'une solution d'observabilite
prend en charge votre langage de programmation de choix pour un type de signal donne
comme les journaux ou les metriques.

## Infrastructure et bases de donnees

Avec cette dimension, nous entendons tout type de dependances externes a l'application,
qu'il s'agisse d'infrastructure comme le VPC dans lequel le service s'execute ou d'un
magasin de donnees comme RDS ou DynamoDB ou d'une file d'attente comme SQS.

:::tip
    "Points communs"
    Un point que toutes les sources de cette dimension ont en commun est qu'elles sont
    situees en dehors de votre application (ainsi que de l'environnement de calcul dans
    lequel votre application s'execute) et avec cela, vous devez les traiter comme une
    boite opaque.
:::

Cette dimension inclut, sans s'y limiter :

- L'infrastructure AWS, par exemple les [VPC flow logs][vpcfl].
- Les API secondaires telles que les [journaux du plan de controle Kubernetes][kubecpl].
- Les signaux des magasins de donnees, tels que [S3][s3mon], [RDS][rdsmon] ou [SQS][sqstrace].


## Unite de calcul

La facon dont vous empaquetez, planifiez et executez votre code. Par exemple, dans Lambda
c'est une fonction et dans [ECS][ecs] et [EKS][eks], cette unite est un conteneur
s'executant dans des taches (ECS) ou des pods (EKS), respectivement. Les environnements
conteneurises comme Kubernetes offrent souvent deux options concernant les deploiements
de telemetrie : en tant que sidecars ou en tant que processus daemon par noeud (instance).

## Moteur de calcul

Cette dimension fait reference a l'environnement d'execution de base, qui peut (dans le
cas d'une instance EC2, par exemple) ou ne peut pas (offres serverless telles que Fargate
ou Lambda) etre de votre responsabilite a provisionner et patcher. Selon le moteur de
calcul que vous utilisez, la partie telemetrie peut deja faire partie de l'offre, par
exemple, [EKS sur Fargate][firelensef] a le routage de journaux via Fluent Bit integre.


[aes]: https://aws.amazon.com/elasticsearch-service/ "Amazon Elasticsearch Service"
[adot]: https://aws-otel.github.io/ "AWS Distro for OpenTelemetry"
[amg]: https://aws.amazon.com/grafana/ "Amazon Managed Grafana"
[amp]: https://aws.amazon.com/prometheus/ "Amazon Managed Service for Prometheus"
[batch]: https://aws.amazon.com/batch/ "AWS Batch"
[beans]: https://aws.amazon.com/elasticbeanstalk/ "AWS Elastic Beanstalk"
[cw]: https://aws.amazon.com/cloudwatch/ "Amazon CloudWatch"
[dimensions]: ../dimensions
[ec2]: https://aws.amazon.com/ec2/ "Amazon EC2"
[ecs]: https://aws.amazon.com/ecs/ "Amazon Elastic Container Service"
[eks]: https://aws.amazon.com/eks/ "Amazon Elastic Kubernetes Service"
[fargate]: https://aws.amazon.com/fargate/ "AWS Fargate"
[fluentbit]: https://fluentbit.io/ "Fluent Bit"
[firelensef]: https://aws.amazon.com/blogs/containers/fluent-bit-for-amazon-eks-on-aws-fargate-is-here/ "Fluent Bit for Amazon EKS on AWS Fargate is here"
[jaeger]: https://www.jaegertracing.io/ "Jaeger"
[kafka]: https://kafka.apache.org/ "Apache Kafka"
[kubecpl]: https://docs.aws.amazon.com/eks/latest/userguide/control-plane-logs.html "Amazon EKS control plane logging"
[lambda]: https://aws.amazon.com/lambda/ "AWS Lambda"
[lightsail]: https://aws.amazon.com/lightsail/ "Amazon Lightsail"
[otel]: https://opentelemetry.io/ "OpenTelemetry"
[otelinst]: https://opentelemetry.io/docs/concepts/instrumenting/
[promex]: https://prometheus.io/docs/instrumenting/exporters/ "Prometheus exporters and integrations"
[rdsmon]: https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Overview.LoggingAndMonitoring.html "Logging and monitoring in Amazon RDS"
[s3]: https://aws.amazon.com/s3/ "Amazon S3"
[s3mon]: https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-incident-response.html "Logging and monitoring in Amazon S3"
[sqstrace]: https://docs.aws.amazon.com/xray/latest/devguide/xray-services-sqs.html "Amazon SQS and AWS X-Ray"
[vpcfl]: https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html "VPC Flow Logs"
[xray]: https://aws.amazon.com/xray/ "AWS X-Ray"
[xraysdks]: https://docs.aws.amazon.com/xray/index.html
