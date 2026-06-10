# Tracage de conteneurs avec AWS X-Ray

Dans cette section du guide des meilleures pratiques d'Observability, nous allons approfondir les sujets suivants lies au tracage de conteneurs avec AWS X-Ray :

* Introduction a AWS X-Ray
* Collecte de traces utilisant les add-ons Amazon EKS pour AWS Distro for OpenTelemetry
* Conclusion

### Introduction

[AWS X-Ray](https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html) est un service qui collecte des donnees sur les requetes que votre application traite, et fournit des outils que vous pouvez utiliser pour visualiser, filtrer et obtenir des informations sur ces donnees afin d'identifier les problemes et les opportunites d'optimisation. Pour toute requete tracee vers votre application, vous pouvez voir des informations detaillees non seulement sur la requete et la reponse, mais aussi sur les appels que votre application effectue vers les ressources AWS en aval, les microservices, les bases de donnees et les API web.

L'instrumentation de votre application implique l'envoi de donnees de trace pour les requetes entrantes et sortantes et d'autres evenements au sein de votre application, ainsi que les metadonnees de chaque requete. De nombreux scenarios d'instrumentation ne necessitent que des modifications de configuration. Par exemple, vous pouvez instrumenter toutes les requetes HTTP entrantes et les appels en aval vers les services AWS que votre application Java effectue. Il existe plusieurs SDKs, agents et outils qui peuvent etre utilises pour instrumenter votre application pour le tracage X-Ray. Consultez [Instrumenting your application](https://docs.aws.amazon.com/xray/latest/devguide/xray-instrumenting-your-app.html) pour plus d'informations.

Nous allons apprendre le tracage d'applications conteneurisees en collectant des traces de votre cluster Amazon EKS en utilisant les add-ons Amazon EKS pour AWS Distro for OpenTelemetry.

### Collecte de traces utilisant les add-ons Amazon EKS pour AWS Distro for OpenTelemetry

[AWS X-Ray](https://aws.amazon.com/xray/) fournit une fonctionnalite de tracage d'applications, offrant des informations approfondies sur tous les microservices deployes. Avec X-Ray, chaque requete peut etre tracee au fur et a mesure qu'elle traverse les microservices impliques. Cela fournit a vos equipes DevOps les informations dont elles ont besoin pour comprendre comment vos services interagissent avec leurs pairs et leur permet d'analyser et de deboguer les problemes beaucoup plus rapidement.

[AWS Distro for OpenTelemetry (ADOT)](https://aws-otel.github.io/docs/introduction) est une distribution securisee et supportee par AWS du projet OpenTelemetry. Les utilisateurs peuvent instrumenter leurs applications une seule fois et, en utilisant ADOT, envoyer des metriques et des traces correlees a plusieurs solutions de surveillance. Amazon EKS permet maintenant aux utilisateurs d'activer ADOT en tant qu'add-on a tout moment apres que le cluster soit en fonctionnement. L'add-on ADOT inclut les derniers correctifs de securite et corrections de bugs et est valide par AWS pour fonctionner avec Amazon EKS.

L'add-on ADOT est une implementation d'un Kubernetes Operator, qui est une extension logicielle de Kubernetes utilisant des ressources personnalisees pour gerer les applications et leurs composants. L'add-on surveille une ressource personnalisee nommee OpenTelemetryCollector et gere le cycle de vie d'un ADOT Collector base sur les parametres de configuration specifies dans la ressource personnalisee.

L'ADOT Collector a le concept de pipeline qui comprend trois types cles de composants, a savoir le recepteur, le processeur et l'exportateur. Un [recepteur](https://opentelemetry.io/docs/collector/configuration/#receivers) est la maniere dont les donnees entrent dans le collecteur. Il accepte les donnees dans un format specifique, les traduit dans le format interne et les transmet aux [processeurs](https://opentelemetry.io/docs/collector/configuration/#processors) et [exportateurs](https://opentelemetry.io/docs/collector/configuration/#exporters) definis dans le pipeline. Il peut etre base sur un modele pull ou push. Un processeur est un composant optionnel utilise pour effectuer des taches telles que le traitement par lots, le filtrage et les transformations sur les donnees entre la reception et l'exportation. Un exportateur est utilise pour determiner vers quelle destination envoyer les metriques, les journaux ou les traces. L'architecture du collecteur permet de configurer plusieurs instances de tels pipelines via un manifeste YAML Kubernetes.

Le diagramme suivant illustre un ADOT Collector configure avec un pipeline de traces, qui envoie les donnees de telemetrie a AWS X-Ray. Le pipeline de traces comprend une instance d'[AWS X-Ray Receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/awsxrayreceiver) et d'[AWS X-Ray Exporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/awsxrayexporter) et envoie les traces a AWS X-Ray.

![Tracing-1](../../../../images/Containers/aws-native/eks/tracing-1.jpg)

*Figure : Collecte de traces utilisant les add-ons Amazon EKS pour AWS Distro for OpenTelemetry.*

Examinons les details de l'installation de l'add-on ADOT dans un cluster EKS puis collectons les donnees de telemetrie des charges de travail. Voici une liste de prerequis necessaires avant de pouvoir installer l'add-on ADOT.

* Un cluster EKS supportant Kubernetes version 1.19 ou superieure. Vous pouvez creer le cluster EKS en utilisant l'une des [approches decrites ici](https://docs.aws.amazon.com/eks/latest/userguide/create-cluster.html).
* [Certificate Manager](https://cert-manager.io/), s'il n'est pas deja installe dans le cluster. Il peut etre installe avec la configuration par defaut selon [cette documentation](https://cert-manager.io/docs/installation/).
* Les permissions RBAC Kubernetes specifiquement pour les add-ons EKS pour installer l'add-on ADOT dans votre cluster. Cela peut etre fait en appliquant les [parametres dans ce fichier YAML](https://amazon-eks.s3.amazonaws.com/docs/addons-otel-permissions.yaml) au cluster en utilisant un outil CLI tel que kubectl.

Vous pouvez verifier la liste des add-ons actives pour differentes versions d'EKS en utilisant la commande suivante :

`aws eks describe-addon-versions`

La sortie JSON devrait lister l'add-on ADOT parmi d'autres, comme indique ci-dessous. Notez que lorsqu'un cluster EKS est cree, les add-ons EKS n'installent aucun add-on dessus.


```
{
   "addonName":"adot",
   "type":"observability",
   "addonVersions":[
      {
         "addonVersion":"v0.45.0-eksbuild.1",
         "architecture":[
            "amd64"
         ],
         "compatibilities":[
            {
               "clusterVersion":"1.22",
               "platformVersions":[
                  "*"
               ],
               "defaultVersion":true
            },
            {
               "clusterVersion":"1.21",
               "platformVersions":[
                  "*"
               ],
               "defaultVersion":true
            },
            {
               "clusterVersion":"1.20",
               "platformVersions":[
                  "*"
               ],
               "defaultVersion":true
            },
            {
               "clusterVersion":"1.19",
               "platformVersions":[
                  "*"
               ],
               "defaultVersion":true
            }
         ]
      }
   ]
}
```

Ensuite, vous pouvez installer l'add-on ADOT avec la commande suivante :

`aws eks create-addon --addon-name adot --addon-version v0.45.0-eksbuild.1 --cluster-name $CLUSTER_NAME `

La chaine de version doit correspondre a la valeur du champ *addonVersion* dans la sortie precedemment montree. La sortie d'une execution reussie de cette commande est la suivante :

```
{
    "addon": {
        "addonName": "adot",
        "clusterName": "k8s-production-cluster",
        "status": "ACTIVE",
        "addonVersion": "v0.45.0-eksbuild.1",
        "health": {
            "issues": []
        },
        "addonArn": "arn:aws:eks:us-east-1:123456789000:addon/k8s-production-cluster/adot/f0bff97c-0647-ef6f-eecf-0b2a13f7491b",
        "createdAt": "2022-04-04T10:36:56.966000+05:30",
        "modifiedAt": "2022-04-04T10:38:09.142000+05:30",
        "tags": {}
    }
}
```

Attendez que l'add-on soit au statut ACTIVE avant de passer a l'etape suivante. Le statut de l'add-on peut etre verifie avec la commande suivante :

`aws eks describe-addon --addon-name adot --cluster-name $CLUSTER_NAME`

#### Deploiement de l'ADOT Collector

L'add-on ADOT est une implementation d'un Kubernetes Operator, qui est une extension logicielle de Kubernetes utilisant des ressources personnalisees pour gerer les applications et leurs composants. L'add-on surveille une ressource personnalisee nommee OpenTelemetryCollector et gere le cycle de vie d'un ADOT Collector base sur les parametres de configuration specifies dans la ressource personnalisee. La figure suivante montre une illustration du fonctionnement.

![Tracing-1](../../../../images/Containers/aws-native/eks/tracing-2.jpg)

*Figure : Deploiement de l'ADOT Collector.*

Ensuite, examinons comment deployer un ADOT Collector. Le [fichier de configuration YAML ici](https://github.com/aws-observability/aws-o11y-recipes/blob/main/sandbox/eks-addon-adot/otel-collector-xray-prometheus-complete.yaml) definit une ressource personnalisee OpenTelemetryCollector. Lorsqu'il est deploye sur un cluster EKS, cela declenchera l'add-on ADOT pour provisionner un ADOT Collector qui inclut des pipelines de traces et de metriques avec des composants, comme montre dans la premiere illustration ci-dessus. Le collecteur est lance dans le namespace `aws-otel-eks` en tant que Deployment Kubernetes avec le nom `${custom-resource-name}-collector`. Un service ClusterIP avec le meme nom est egalement lance. Examinons les composants individuels qui constituent les pipelines de ce collecteur.

L'AWS X-Ray Receiver dans le pipeline de traces accepte les segments ou spans au [format X-Ray Segment](https://docs.aws.amazon.com/xray/latest/devguide/xray-api-segmentdocuments.html), ce qui lui permet de traiter les segments envoyes par les microservices instrumentes avec le SDK X-Ray. Il est configure pour ecouter le trafic sur le port UDP 2000 et est expose en tant que service Cluster IP. Selon cette configuration, les charges de travail qui souhaitent envoyer des donnees de trace a ce recepteur doivent etre configurees avec la variable d'environnement `AWS_XRAY_DAEMON_ADDRESS` definie a `observability-collector.aws-otel-eks:2000`. L'exportateur envoie ces segments directement a X-Ray en utilisant l'API [PutTraceSegments](https://docs.aws.amazon.com/xray/latest/api/API_PutTraceSegments.html).

L'ADOT Collector est configure pour etre lance sous l'identite d'un compte de service Kubernetes nomme `aws-otel-collector`, auquel sont accordees ces permissions en utilisant un ClusterRoleBinding et un ClusterRole, egalement montres dans la [configuration](https://github.com/aws-observability/aws-o11y-recipes/blob/main/sandbox/eks-addon-adot/otel-collector-xray-prometheus-complete.yaml). Les exportateurs ont besoin de permissions IAM pour envoyer des donnees a X-Ray. Cela se fait en associant le compte de service a un role IAM en utilisant la fonctionnalite [IAM roles for service accounts](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html) supportee par EKS. Le role IAM doit etre associe aux politiques gerees par AWS telles que AWSXRayDaemonWriteAccess. Le [script d'aide ici](https://github.com/aws-observability/aws-o11y-recipes/blob/main/sandbox/eks-addon-adot/adot-irsa.sh) peut etre utilise, apres avoir defini les variables CLUSTER_NAME et REGION, pour creer un role IAM nomme `EKS-ADOT-ServiceAccount-Role` auquel sont accordees ces permissions et qui est associe au compte de service `aws-otel-collector`.

#### Test de bout en bout de la collecte de traces

Mettons maintenant tout cela ensemble et testons la collecte de traces a partir de charges de travail deployees sur un cluster EKS. L'illustration suivante montre la configuration utilisee pour ce test. Elle comprend un service front-end qui expose un ensemble d'API REST et interagit avec S3 ainsi qu'un service datastore qui, a son tour, interagit avec une instance de base de donnees Aurora PostgreSQL. Les services sont instrumentes avec le SDK X-Ray. L'ADOT Collector est lance en mode Deployment en deployant une ressource personnalisee OpenTelemetryCollector en utilisant le manifeste YAML discute dans la derniere section. Le client Postman est utilise comme generateur de trafic externe, ciblant le service front-end.

![Tracing-3](../../../../images/Containers/aws-native/eks/tracing-3.jpg)

*Figure : Test de bout en bout de la collecte de traces.*

L'image suivante montre le graphe de service genere par X-Ray en utilisant les donnees de segments capturees des services, avec la latence de reponse moyenne pour chaque segment.

![Tracing-4](../../../../images/Containers/aws-native/eks/tracing-4.jpg)

Figure : Console CloudWatch Service Map.*

Veuillez consulter [Traces pipeline with OTLP Receiver and AWS X-Ray Exporter sending traces to AWS X-Ray](https://github.com/aws-observability/aws-otel-community/blob/master/sample-configs/operator/collector-config-xray.yaml) pour les definitions de ressources personnalisees OpenTelemetryCollector qui concernent les configurations de pipeline de traces. Les clients qui souhaitent utiliser l'ADOT Collector en conjonction avec AWS X-Ray peuvent commencer avec ces modeles de configuration, remplacer les variables de substitution par des valeurs basees sur leurs environnements cibles et deployer rapidement le collecteur sur leurs clusters Amazon EKS en utilisant l'add-on EKS pour ADOT.


### Utilisation d'EKS Blueprints pour configurer le tracage de conteneurs avec AWS X-Ray

[EKS Blueprints](https://aws.amazon.com/blogs/containers/bootstrapping-clusters-with-eks-blueprints/) est une collection de modules Infrastructure as Code (IaC) qui vous aideront a configurer et deployer des clusters EKS coherents et complets a travers les comptes et les regions. Vous pouvez utiliser EKS Blueprints pour facilement amorcer un cluster EKS avec les [add-ons Amazon EKS](https://docs.aws.amazon.com/eks/latest/userguide/eks-add-ons.html) ainsi qu'un large eventail d'add-ons open source populaires, notamment Prometheus, Karpenter, Nginx, Traefik, AWS Load Balancer Controller, Container Insights, Fluent Bit, Keda, Argo CD, et plus encore. EKS Blueprints est implemente dans deux frameworks IaC populaires, [HashiCorp Terraform](https://github.com/aws-ia/terraform-aws-eks-blueprints) et [AWS Cloud Development Kit (AWS CDK)](https://github.com/aws-quickstart/cdk-eks-blueprints), qui vous aident a automatiser les deploiements d'infrastructure.

Dans le cadre de votre processus de creation de cluster Amazon EKS avec EKS Blueprints, vous pouvez configurer AWS X-Ray en tant qu'outil operationnel Day 2 pour collecter, agreger et synthetiser les metriques et les journaux des applications conteneurisees et des microservices dans la console Amazon CloudWatch.

## Conclusion

Dans cette section du guide des meilleures pratiques d'Observability, nous avons appris a utiliser AWS X-Ray pour le tracage de conteneurs de vos applications sur Amazon EKS en collectant des traces a l'aide des add-ons Amazon EKS pour AWS Distro for OpenTelemetry. Pour approfondir, veuillez consulter [Metrics and traces collection using Amazon EKS add-ons for AWS Distro for OpenTelemetry to Amazon Managed Service for Prometheus and Amazon CloudWatch.](https://aws.amazon.com/blogs/containers/metrics-and-traces-collection-using-amazon-eks-add-ons-for-aws-distro-for-opentelemetry/) Enfin, nous avons brievement parle de l'utilisation d'EKS Blueprints comme vehicule pour configurer le tracage de conteneurs avec AWS X-Ray lors du processus de creation du cluster Amazon EKS. Pour approfondir davantage, nous vous recommandons fortement de pratiquer le module X-Ray Traces dans la categorie Observability **native AWS** du [One Observability Workshop](https://catalog.workshops.aws/observability/en-US).
