# Agregation des journaux

Dans cette section du guide des meilleures pratiques d'Observability, nous allons approfondir les sujets suivants lies a la journalisation Amazon EKS avec les services natifs AWS :

* Introduction a la journalisation AWS EKS
* Journalisation du plan de controle Amazon EKS
* Journalisation du plan de donnees Amazon EKS
* Journalisation des applications Amazon EKS
* Agregation unifiee des journaux depuis Amazon EKS et d'autres plateformes de calcul utilisant les services natifs AWS
* Conclusion

### Introduction

La journalisation Amazon EKS peut etre divisee en trois types : la journalisation du plan de controle, la journalisation des noeuds et la journalisation des applications. Le [plan de controle Kubernetes](https://kubernetes.io/docs/concepts/overview/components/#control-plane-components) est un ensemble de composants qui gerent les clusters Kubernetes et produisent des journaux utilises a des fins d'audit et de diagnostic. Avec Amazon EKS, vous pouvez [activer les journaux pour differents composants du plan de controle](https://docs.aws.amazon.com/eks/latest/userguide/control-plane-logs.html) et les envoyer a CloudWatch.

Kubernetes execute egalement des composants systeme tels que `kubelet` et `kube-proxy` sur chaque noeud Kubernetes qui execute vos pods. Ces composants ecrivent des journaux dans chaque noeud et vous pouvez configurer CloudWatch et Container Insights pour capturer ces journaux pour chaque noeud Amazon EKS.

Les conteneurs sont regroupes en [pods](https://kubernetes.io/docs/concepts/workloads/pods/) au sein d'un cluster Kubernetes et sont planifies pour s'executer sur vos noeuds Kubernetes. La plupart des applications conteneurisees ecrivent sur la sortie standard et la sortie d'erreur standard, et le moteur de conteneur redirige la sortie vers un pilote de journalisation. Dans Kubernetes, les journaux de conteneurs se trouvent dans le repertoire `/var/log/pods` sur un noeud. Vous pouvez configurer CloudWatch et Container Insights pour capturer ces journaux pour chacun de vos pods Amazon EKS.

Il existe trois approches courantes pour capturer les journaux et les envoyer vers un systeme centralise d'agregation de journaux dans Kubernetes :

* Agent au niveau du noeud, comme un [DaemonSet Fluentd](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-setup-logs.html). C'est le patron recommande.
* Conteneur sidecar, comme un conteneur sidecar Fluentd.
* Ecriture directe vers le systeme de collecte de journaux. Dans cette approche, l'application est responsable de l'envoi des journaux. C'est l'option la moins recommandee car vous devrez inclure le SDK du systeme d'agregation de journaux dans votre code d'application au lieu de reutiliser des solutions communautaires comme Fluentd. Ce patron viole egalement le *principe de separation des responsabilites*, selon lequel l'implementation de la journalisation doit etre independante de l'application. Cela vous permet de modifier l'infrastructure de journalisation sans impacter ni modifier votre application.

Nous allons maintenant plonger dans chacune de ces categories de journalisation pour Amazon EKS tout en abordant l'agregation unifiee des journaux depuis Amazon EKS et d'autres plateformes de calcul.

### Journalisation du plan de controle Amazon EKS

Un cluster Amazon EKS se compose d'un plan de controle haute disponibilite a locataire unique pour votre cluster Kubernetes et des noeuds Amazon EKS qui executent vos conteneurs. Les noeuds du plan de controle s'executent dans un compte gere par AWS. Les noeuds du plan de controle du cluster Amazon EKS sont integres a CloudWatch et vous pouvez activer la journalisation pour des composants specifiques du plan de controle. Des journaux sont fournis pour chaque instance de composant du plan de controle Kubernetes. AWS gere la sante de vos noeuds du plan de controle et fournit un [accord de niveau de service (SLA) pour le endpoint Kubernetes](http://aws.amazon.com/eks/sla/).

La [journalisation du plan de controle Amazon EKS](https://docs.aws.amazon.com/eks/latest/userguide/control-plane-logs.html) comprend les types de journaux de plan de controle de cluster suivants. Chaque type de journal correspond a un composant du plan de controle Kubernetes. Pour en savoir plus sur ces composants, consultez [Kubernetes Components](https://kubernetes.io/docs/concepts/overview/components/) dans la documentation Kubernetes.

* **Serveur API (`api`)** -- Le serveur API de votre cluster est le composant du plan de controle qui expose l'API Kubernetes. Si vous activez les journaux du serveur API lors du lancement du cluster, ou peu apres, les journaux incluent les indicateurs du serveur API qui ont ete utilises pour demarrer le serveur API. Pour plus d'informations, consultez [`kube-apiserver`](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-apiserver/) et la [politique d'audit](https://github.com/kubernetes/kubernetes/blob/master/cluster/gce/gci/configure-helper.sh#L1129-L1255) dans la documentation Kubernetes.
* **Audit (`audit`)** -- Les journaux d'audit Kubernetes fournissent un enregistrement des utilisateurs individuels, administrateurs ou composants systeme qui ont affecte votre cluster. Pour plus d'informations, consultez [Auditing](https://kubernetes.io/docs/tasks/debug-application-cluster/audit/) dans la documentation Kubernetes.
* **Authenticator (`authenticator`)** -- Les journaux de l'authenticateur sont uniques a Amazon EKS. Ces journaux representent le composant du plan de controle qu'Amazon EKS utilise pour l'authentification [Role Based Access Control](https://kubernetes.io/docs/reference/access-authn-authz/rbac/) (RBAC) de Kubernetes utilisant les identifiants IAM. Pour plus d'informations, consultez [Cluster management](https://docs.aws.amazon.com/eks/latest/userguide/eks-managing.html).
* **Controller manager (`controllerManager`)** -- Le controller manager gere les boucles de controle principales qui sont fournies avec Kubernetes. Pour plus d'informations, consultez [kube-controller-manager](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-controller-manager/) dans la documentation Kubernetes.
* **Scheduler (`scheduler`)** -- Le composant scheduler gere quand et ou executer les pods dans votre cluster. Pour plus d'informations, consultez [kube-scheduler](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-scheduler/) dans la documentation Kubernetes.

Veuillez suivre la section [activation et desactivation des journaux du plan de controle](https://docs.aws.amazon.com/eks/latest/userguide/control-plane-logs.html#:~:text=the%20Kubernetes%20documentation.-,Enabling%20and%20disabling%20control%20plane%20logs,-By%20default%2C%20cluster) et activer les journaux du plan de controle via la console AWS ou via AWS CLI.

#### Interrogation des journaux du plan de controle depuis la console CloudWatch

Apres avoir active la journalisation du plan de controle sur votre cluster Amazon EKS, vous pouvez trouver les journaux du plan de controle EKS dans le groupe de journaux `/aws/eks/cluster-name/cluster`. Pour plus d'informations, consultez [Viewing cluster control plane logs](https://docs.aws.amazon.com/eks/latest/userguide/control-plane-logs.html#viewing-control-plane-logs). Veuillez vous assurer de remplacer `cluster-name` par le nom de votre cluster.

Vous pouvez utiliser CloudWatch Logs Insights pour rechercher dans les donnees de journaux du plan de controle EKS. Pour plus d'informations, consultez [Analyzing log data with CloudWatch Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html). Il est important de noter que vous ne pouvez voir les evenements de journal dans CloudWatch Logs qu'apres avoir active la journalisation du plan de controle dans un cluster. Avant de selectionner une plage de temps pour executer des requetes dans CloudWatch Logs Insights, verifiez que vous avez active la journalisation du plan de controle. Veuillez consulter la capture d'ecran ci-dessous montrant un exemple de requete de journal du plan de controle EKS avec la sortie de la requete.

![LOG-AGGREG-1](../../../../images/Containers/aws-native/eks/log-aggreg-1.jpg)

*Figure : CloudWatch Logs Insights.*

#### Exemples de requetes pour les cas d'usage EKS courants sur CloudWatch Logs Insights

Pour trouver le createur du cluster, recherchez l'entite IAM mappee a l'utilisateur **kubernetes-admin**.

```
fields @logStream, @timestamp, @message| sort @timestamp desc
| filter @logStream like /authenticator/
| filter @message like "username=kubernetes-admin"
| limit 50
```

Exemple de sortie :

```

@logStream, @timestamp @messageauthenticator-71976 ca11bea5d3083393f7d32dab75b,2021-08-11-10:09:49.020,"time=""2021-08-11T10:09:43Z"" level=info msg=""access granted"" arn=""arn:aws:iam::12345678910:user/awscli"" client=""127.0.0.1:51326"" groups=""[system:masters]"" method=POST path=/authenticate sts=sts.eu-west-1.amazonaws.com uid=""heptio-authenticator-aws:12345678910:ABCDEFGHIJKLMNOP"" username=kubernetes-admin"
```

Dans cette sortie, l'utilisateur IAM **arn:aws:iam::[12345678910](tel:12345678910):user/awscli** est mappe a l'utilisateur **kubernetes-admin**.

Pour trouver les requetes qu'un utilisateur specifique a effectuees, recherchez les operations que l'utilisateur **kubernetes-admin** a effectuees.

```

fields @logStream, @timestamp, @message| filter @logStream like /^kube-apiserver-audit/
| filter strcontains(user.username,"kubernetes-admin")
| sort @timestamp desc
| limit 50
```

Exemple de sortie :

```

@logStream,@timestamp,@messagekube-apiserver-audit-71976ca11bea5d3083393f7d32dab75b,2021-08-11 09:29:13.095,"{...""requestURI"":""/api/v1/namespaces/kube-system/endpoints?limit=500";","string""verb"":""list"",""user"":{""username"":""kubernetes-admin"",""uid"":""heptio-authenticator-aws:12345678910:ABCDEFGHIJKLMNOP"",""groups"":[""system:masters"",""system:authenticated""],""extra"":{""accessKeyId"":[""ABCDEFGHIJKLMNOP""],""arn"":[""arn:aws:iam::12345678910:user/awscli""],""canonicalArn"":[""arn:aws:iam::12345678910:user/awscli""],""sessionName"":[""""]}},""sourceIPs"":[""12.34.56.78""],""userAgent"":""kubectl/v1.22.0 (darwin/amd64) kubernetes/c2b5237"",""objectRef"":{""resource"":""endpoints"",""namespace"":""kube-system"",""apiVersion"":""v1""}...}"
```

Pour trouver les appels API qu'un userAgent specifique a effectues, vous pouvez utiliser cette requete exemple :

```

fields @logStream, @timestamp, userAgent, verb, requestURI, @message| filter @logStream like /kube-apiserver-audit/
| filter userAgent like /kubectl\/v1.22.0/
| sort @timestamp desc
| filter verb like /(get)/
```

Exemple de sortie abrege :

```

@logStream,@timestamp,userAgent,verb,requestURI,@messagekube-apiserver-audit-71976ca11bea5d3083393f7d32dab75b,2021-08-11 14:06:47.068,kubectl/v1.22.0 (darwin/amd64) kubernetes/c2b5237,get,/apis/metrics.k8s.io/v1beta1?timeout=32s,"{""kind"":""Event"",""apiVersion"":""audit.k8s.io/v1"",""level"":""Metadata"",""auditID"":""863d9353-61a2-4255-a243-afaeb9183524"",""stage"":""ResponseComplete"",""requestURI"":""/apis/metrics.k8s.io/v1beta1?timeout=32s"",""verb"":""get"",""user"":{""username"":""kubernetes-admin"",""uid"":""heptio-authenticator-aws:12345678910:AIDAUQGC5HFOHXON7M22F"",""groups"":[""system:masters"",""system:authenticated""],""extra"":{""accessKeyId"":[""ABCDEFGHIJKLMNOP""],""arn"":[""arn:aws:iam::12345678910:user/awscli""],""canonicalArn"":[""arn:aws:iam::12345678910:user/awscli""],""sourceIPs"":[""12.34.56.78""],""userAgent"":""kubectl/v1.22.0 (darwin/amd64) kubernetes/c2b5237""...}"
```

Pour trouver les modifications mutantes apportees au ConfigMap **aws-auth**, vous pouvez utiliser cette requete exemple :

```

fields @logStream, @timestamp, @message| filter @logStream like /^kube-apiserver-audit/
| filter requestURI like /\/api\/v1\/namespaces\/kube-system\/configmaps/
| filter objectRef.name = "aws-auth"
| filter verb like /(create|delete|patch)/
| sort @timestamp desc
| limit 50
```

Exemple de sortie abrege :

```

@logStream,@timestamp,@messagekube-apiserver-audit-f01c77ed8078a670a2eb63af6f127163,2021-10-27 05:43:01.850,{""kind"":""Event"",""apiVersion"":""audit.k8s.io/v1"",""level"":""RequestResponse"",""auditID"":""8f9a5a16-f115-4bb8-912f-ee2b1d737ff1"",""stage"":""ResponseComplete"",""requestURI"":""/api/v1/namespaces/kube-system/configmaps/aws-auth?timeout=19s"",""verb"":""patch"",""responseStatus"": {""metadata"": {},""code"": 200 },""requestObject"": {""data"": { contents of aws-auth ConfigMap } },""requestReceivedTimestamp"":""2021-10-27T05:43:01.033516Z"",""stageTimestamp"":""2021-10-27T05:43:01.042364Z"" }
```

Pour trouver les requetes qui ont ete refusees, vous pouvez utiliser cette requete exemple :

```

fields @logStream, @timestamp, @message| filter @logStream like /^authenticator/
| filter @message like "denied"
| sort @timestamp desc
| limit 50
```

Exemple de sortie :

```

@logStream,@timestamp,@messageauthenticator-8c0c570ea5676c62c44d98da6189a02b,2021-08-08 20:04:46.282,"time=""2021-08-08T20:04:44Z"" level=warning msg=""access denied"" client=""127.0.0.1:52856"" error=""sts getCallerIdentity failed: error from AWS (expected 200, got 403)"" method=POST path=/authenticate"
```

Pour trouver le noeud sur lequel un pod a ete planifie, interrogez les journaux **kube-scheduler**.

```

fields @logStream, @timestamp, @message| sort @timestamp desc
| filter @logStream like /kube-scheduler/
| filter @message like "aws-6799fc88d8-jqc2r"
| limit 50
```

Exemple de sortie :

```

@logStream,@timestamp,@messagekube-scheduler-bb3ea89d63fd2b9735ba06b144377db6,2021-08-15 12:19:43.000,"I0915 12:19:43.933124       1 scheduler.go:604] ""Successfully bound pod to node"" pod=""kube-system/aws-6799fc88d8-jqc2r"" node=""ip-192-168-66-187.eu-west-1.compute.internal"" evaluatedNodes=3 feasibleNodes=2"
```

Dans cet exemple de sortie, le pod **aws-6799fc88d8-jqc2r** a ete planifie sur le noeud **ip-192-168-66-187.eu-west-1.compute.internal**.

Pour trouver les erreurs serveur HTTP 5xx pour les requetes au serveur API Kubernetes, vous pouvez utiliser cette requete exemple :

```

fields @logStream, @timestamp, responseStatus.code, @message| filter @logStream like /^kube-apiserver-audit/
| filter responseStatus.code >= 500
| limit 50
```

Exemple de sortie abrege :

```

@logStream,@timestamp,responseStatus.code,@messagekube-apiserver-audit-4d5145b53c40d10c276ad08fa36d1f11,2021-08-04 07:22:06.518,503,"...""requestURI"":""/apis/metrics.k8s.io/v1beta1?timeout=32s"",""verb"":""get"",""user"":{""username"":""system:serviceaccount:kube-system:resourcequota-controller"",""uid"":""36d9c3dd-f1fd-4cae-9266-900d64d6a754"",""groups"":[""system:serviceaccounts"",""system:serviceaccounts:kube-system"",""system:authenticated""]},""sourceIPs"":[""12.34.56.78""],""userAgent"":""kube-controller-manager/v1.21.2 (linux/amd64) kubernetes/d2965f0/system:serviceaccount:kube-system:resourcequota-controller"",""responseStatus"":{""metadata"":{},""code"":503},..."}}"
```

Pour resoudre les problemes d'activation d'un CronJob, recherchez les appels API effectues par le **cronjob-controller**.

```

fields @logStream, @timestamp, @message| filter @logStream like /kube-apiserver-audit/
| filter user.username like "system:serviceaccount:kube-system:cronjob-controller"
| display @logStream, @timestamp, @message, objectRef.namespace, objectRef.name
| sort @timestamp desc
| limit 50
```

Exemple de sortie abrege :

```

{ "kind": "Event", "apiVersion": "audit.k8s.io/v1", "objectRef": { "resource": "cronjobs", "namespace": "default", "name": "hello", "apiGroup": "batch", "apiVersion": "v1" }, "responseObject": { "kind": "CronJob", "apiVersion": "batch/v1", "spec": { "schedule": "*/1 * * * *" }, "status": { "lastScheduleTime": "2021-08-09T07:19:00Z" } } }
```

Dans cet exemple de sortie, le job **hello** dans le namespace **default** s'execute chaque minute et a ete planifie pour la derniere fois a **2021-08-09T07:19:00Z**.

Pour trouver les appels API effectues par le **replicaset-controller**, vous pouvez utiliser cette requete exemple :

```

fields @logStream, @timestamp, @message| filter @logStream like /kube-apiserver-audit/
| filter user.username like "system:serviceaccount:kube-system:replicaset-controller"
| display @logStream, @timestamp, requestURI, verb, user.username
| sort @timestamp desc
| limit 50
```

Exemple de sortie :

```

@logStream,@timestamp,requestURI,verb,user.usernamekube-apiserver-audit-8c0c570ea5676c62c44d98da6189a02b,2021-08-10 17:13:53.281,/api/v1/namespaces/kube-system/pods,create,system:serviceaccount:kube-system:replicaset-controller
kube-apiserver-audit-4d5145b53c40d10c276ad08fa36d1f11,2021-08-04 0718:44.561,/apis/apps/v1/namespaces/kube-system/replicasets/coredns-6496b6c8b9/status,update,system:serviceaccount:kube-system:replicaset-controller
```

Pour trouver les operations effectuees sur une ressource Kubernetes, vous pouvez utiliser cette requete exemple :

```

fields @logStream, @timestamp, @message| filter @logStream like /^kube-apiserver-audit/
| filter verb == "delete" and requestURI like "/api/v1/namespaces/default/pods/my-app"
| sort @timestamp desc
| limit 10
```

La requete precedente filtre les appels API **delete** sur le namespace **default** pour le pod **my-app**.
Exemple de sortie abrege :

```

@logStream,@timestamp,@messagekube-apiserver-audit-e7b3cb08c0296daf439493a6fc9aff8c,2021-08-11 14:09:47.813,"...""requestURI"":""/api/v1/namespaces/default/pods/my-app"",""verb"":""delete"",""user"":{""username""""kubernetes-admin"",""uid"":""heptio-authenticator-aws:12345678910:ABCDEFGHIJKLMNOP"",""groups"":[""system:masters"",""system:authenticated""],""extra"":{""accessKeyId"":[""ABCDEFGHIJKLMNOP""],""arn"":[""arn:aws:iam::12345678910:user/awscli""],""canonicalArn"":[""arn:aws:iam::12345678910:user/awscli""],""sessionName"":[""""]}},""sourceIPs"":[""12.34.56.78""],""userAgent"":""kubectl/v1.22.0 (darwin/amd64) kubernetes/c2b5237"",""objectRef"":{""resource"":""pods"",""namespace"":""default"",""name"":""my-app"",""apiVersion"":""v1""},""responseStatus"":{""metadata"":{},""code"":200},""requestObject"":{""kind"":""DeleteOptions"",""apiVersion"":""v1"",""propagationPolicy"":""Background""},
..."
```

Pour recuperer le nombre de codes de reponse HTTP pour les appels effectues au serveur API Kubernetes, vous pouvez utiliser cette requete exemple :

```

fields @logStream, @timestamp, @message| filter @logStream like /^kube-apiserver-audit/
| stats count(*) as count by responseStatus.code
| sort count desc
```

Exemple de sortie :

```

responseStatus.code,count200,35066
201,525
403,125
404,116
101,2
```

Pour trouver les modifications apportees aux DaemonSets/Addons dans le namespace **kube-system**, vous pouvez utiliser cette requete exemple :

```

filter @logStream like /^kube-apiserver-audit/| fields @logStream, @timestamp, @message
| filter verb like /(create|update|delete)/ and strcontains(requestURI,"/apis/apps/v1/namespaces/kube-system/daemonsets")
| sort @timestamp desc
| limit 50
```

Exemple de sortie :

```

{ "kind": "Event", "apiVersion": "audit.k8s.io/v1", "level": "RequestResponse", "auditID": "93e24148-0aa6-4166-8086-a689b0031612", "stage": "ResponseComplete", "requestURI": "/apis/apps/v1/namespaces/kube-system/daemonsets/aws-node?fieldManager=kubectl-set", "verb": "patch", "user": { "username": "kubernetes-admin", "groups": [ "system:masters", "system:authenticated" ] }, "userAgent": "kubectl/v1.22.2 (darwin/amd64) kubernetes/8b5a191", "objectRef": { "resource": "daemonsets", "namespace": "kube-system", "name": "aws-node", "apiGroup": "apps", "apiVersion": "v1" }, "requestObject": { "REDACTED": "REDACTED" }, "requestReceivedTimestamp": "2021-08-09T08:07:21.868376Z", "stageTimestamp": "2021-08-09T08:07:21.883489Z", "annotations": { "authorization.k8s.io/decision": "allow", "authorization.k8s.io/reason": "" } }
```

Dans cet exemple de sortie, l'utilisateur **kubernetes-admin** a utilise **kubectl** v1.22.2 pour patcher le DaemonSet **aws-node**.

Pour trouver l'utilisateur qui a supprime un noeud, vous pouvez utiliser cette requete exemple :

```

fields @logStream, @timestamp, @message| filter @logStream like /^kube-apiserver-audit/
| filter verb == "delete" and requestURI like "/api/v1/nodes"
| sort @timestamp desc
| limit 10
```

Exemple de sortie abrege :

```

@logStream,@timestamp,@messagekube-apiserver-audit-e503271cd443efdbd2050ae8ca0794eb,2022-03-25 07:26:55.661,"{"kind":"Event","
```

Enfin, si vous avez commence a utiliser la fonctionnalite de journalisation du plan de controle, nous vous recommandons fortement d'en apprendre davantage sur [Understanding and Cost Optimizing Amazon EKS Control Plane Logs](https://aws.amazon.com/blogs/containers/understanding-and-cost-optimizing-amazon-eks-control-plane-logs/).

### Journalisation du plan de donnees Amazon EKS

Nous recommandons d'utiliser [CloudWatch Container Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-setup-logs.html) pour capturer les journaux et les metriques pour Amazon EKS. [Container Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html) implemente les metriques au niveau du cluster, du noeud et du pod avec l'agent CloudWatch, et [Fluent Bit](https://fluentbit.io/) ou [Fluentd](https://www.fluentd.org/) pour la capture des journaux vers CloudWatch. Container Insights fournit egalement des tableaux de bord automatiques avec des vues en couches de vos metriques CloudWatch capturees. Container Insights est deploye en tant que DaemonSet CloudWatch et DaemonSet Fluent Bit qui s'execute sur chaque noeud Amazon EKS. Les noeuds Fargate ne sont pas pris en charge par Container Insights car les noeuds sont geres par AWS et ne prennent pas en charge les DaemonSets. La journalisation Fargate pour Amazon EKS est couverte separement dans ce guide.

Le tableau suivant montre les groupes de journaux CloudWatch et les journaux captures par la [configuration par defaut de capture de journaux Fluentd ou Fluent Bit](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-setup-logs-FluentBit.html) pour Amazon EKS.

|`/aws/containerinsights/Cluster_Name/host`	|Journaux de `/var/log/dmesg`, `/var/log/secure`, et `/var/log/messages`.	|
|---	|---	|
|`/aws/containerinsights/Cluster_Name/dataplane`	|Les journaux dans `/var/log/journal` pour `kubelet.service`, `kubeproxy.service`, et `docker.service`.	|

Si vous ne souhaitez pas utiliser Container Insights avec Fluent Bit ou Fluentd pour la journalisation, vous pouvez capturer les journaux des noeuds et des conteneurs avec l'agent CloudWatch installe sur les noeuds Amazon EKS. Les noeuds Amazon EKS sont des instances EC2, ce qui signifie que vous devez les inclure dans votre approche standard de journalisation au niveau systeme pour Amazon EC2. Si vous installez l'agent CloudWatch en utilisant Distributor et State Manager, alors les noeuds Amazon EKS sont egalement inclus dans l'installation, la configuration et la mise a jour de l'agent CloudWatch. Le tableau suivant montre les journaux specifiques a Kubernetes que vous devez capturer si vous n'utilisez pas Container Insights avec Fluent Bit ou Fluentd pour la journalisation.


|`var/log/aws-routed-eni/ipamd.log``/var/log/aws-routed-eni/plugin.log`	|Les journaux du daemon L-IPAM se trouvent ici	|
|---	|---	|

Veuillez consulter les [recommandations pour la journalisation des noeuds Amazon EKS](https://docs.aws.amazon.com/prescriptive-guidance/latest/implementing-logging-monitoring-cloudwatch/kubernetes-eks-logging.html) pour en savoir plus sur la journalisation du plan de donnees.

### Journalisation des applications Amazon EKS

La journalisation des applications Amazon EKS devient inevitable lors de l'execution d'applications a grande echelle dans un environnement Kubernetes. Pour collecter les journaux d'application, vous devez installer un agregateur de journaux, tel que [Fluent Bit](https://fluentbit.io/), [Fluentd](https://www.fluentd.org/), ou [CloudWatch Container Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html), dans votre cluster Amazon EKS.

[Fluent Bit](https://fluentbit.io/) est un processeur et transfereur de journaux open source ecrit en C++, ce qui signifie que vous pouvez collecter des donnees a partir de differentes sources, les enrichir avec des filtres et les envoyer vers plusieurs destinations. [Fluentd](https://www.fluentd.org/) est un collecteur de donnees open source pour une couche de journalisation unifiee, ecrit en Ruby. Fluentd agit comme une couche de journalisation unifiee qui peut agreger des donnees provenant de multiples sources, unifier des donnees avec differents formats en objets au format JSON et les router vers differentes destinations de sortie. Le choix d'un collecteur de journaux est important pour l'utilisation du CPU et de la memoire lorsque vous surveillez des milliers de serveurs. Si vous avez plusieurs clusters Amazon EKS, vous pouvez utiliser Fluent Bit comme un expediteur leger pour collecter des donnees de differents noeuds dans le cluster et les transferer a Fluentd pour l'agregation, le traitement et le routage vers une destination de sortie prise en charge.

Nous recommandons d'utiliser Fluent Bit comme collecteur et transfereur de journaux pour envoyer les journaux d'application et de cluster a CloudWatch. Vous pouvez ensuite diffuser les journaux vers Amazon OpenSearch Service en utilisant un filtre d'abonnement dans CloudWatch. Cette option est presentee dans le diagramme d'architecture de cette section.

![LOG-AGGREG-2](../../../../images/Containers/aws-native/eks/log-aggreg-2.jpg)

*Figure : Architecture de journalisation des applications Amazon EKS.*

Le diagramme montre le flux de travail suivant lorsque les journaux d'application des clusters Amazon EKS sont diffuses vers Amazon OpenSearch Service. Le service Fluent Bit dans le cluster Amazon EKS pousse les journaux vers CloudWatch. La fonction AWS Lambda diffuse les journaux vers Amazon OpenSearch Service en utilisant un filtre d'abonnement. Vous pouvez ensuite utiliser Kibana pour visualiser les journaux dans les index configures. Vous pouvez egalement diffuser les journaux en utilisant Amazon Kinesis Data Firehose et les stocker dans un bucket S3 pour l'analyse et l'interrogation avec [Amazon Athena](https://docs.aws.amazon.com/athena/latest/ug/what-is.html).

Dans la plupart des clusters, l'utilisation de Fluentd ou Fluent Bit pour l'agregation des journaux necessite peu d'optimisation. Cela change lorsque vous traitez des clusters plus grands avec des milliers de pods et de noeuds. Nous avons publie nos resultats de l'etude de l'[impact de Fluentd et Fluent Bit dans les clusters avec des milliers de pods](https://aws.amazon.com/blogs/containers/fluentd-considerations-and-actions-required-at-scale-in-amazon-eks/). Pour approfondir, nous vous recommandons de consulter l'[amelioration de Fluent Bit concue pour reduire le volume d'appels API](https://aws.amazon.com/blogs/containers/capturing-logs-at-scale-with-fluent-bit-and-amazon-eks/) qu'il effectue vers les serveurs API Kubernetes en utilisant l'option *Use_Kubelet*. La fonctionnalite `Use_Kubelet` de Fluent Bit lui permet de recuperer les metadonnees des pods depuis le kubelet sur l'hote. Les clients Amazon EKS peuvent utiliser Fluent Bit pour capturer les journaux dans des clusters qui executent des dizaines de milliers de pods avec cette fonctionnalite activee sans surcharger le serveur API Kubernetes. Nous recommandons d'activer cette fonctionnalite meme si vous n'executez pas un grand cluster Kubernetes.

#### Journalisation pour Amazon EKS sur Fargate

Avec Amazon EKS sur Fargate, vous pouvez deployer des pods sans allouer ni gerer vos noeuds Kubernetes. Cela elimine le besoin de capturer les journaux au niveau systeme pour vos noeuds Kubernetes. Pour capturer les journaux de vos pods Fargate, vous pouvez utiliser Fluent Bit pour transferer les journaux directement vers CloudWatch. Cela vous permet de router automatiquement les journaux vers CloudWatch sans configuration supplementaire ni conteneur sidecar pour vos pods Amazon EKS sur Fargate. Pour plus d'informations a ce sujet, consultez [Fargate logging](https://docs.aws.amazon.com/eks/latest/userguide/fargate-logging.html) dans la documentation Amazon EKS et [Fluent Bit for Amazon EKS](http://aws.amazon.com/blogs/containers/fluent-bit-for-amazon-eks-on-aws-fargate-is-here/) sur le blog AWS. Cette solution capture les flux d'entree/sortie (I/O) `STDOUT` et `STDERR` de votre conteneur et les envoie a CloudWatch via Fluent Bit, base sur la configuration Fluent Bit etablie pour le cluster Amazon EKS sur Fargate.

Avec le support Fluent Bit pour Amazon EKS, vous n'avez plus besoin d'executer un sidecar pour router les journaux de conteneurs depuis les pods Amazon EKS fonctionnant sur Fargate. Avec le nouveau support de journalisation integre, vous pouvez selectionner une destination de votre choix pour envoyer les enregistrements. Amazon EKS sur Fargate utilise une version de Fluent Bit pour AWS, une distribution conforme upstream de Fluent Bit geree par AWS.

![LOG-AGGREG-3](../../../../images/Containers/aws-native/eks/log-aggreg-3.jpg)

*Figure : Journalisation pour Amazon EKS sur Fargate.*

Veuillez en apprendre davantage sur le support Fluent Bit pour Amazon EKS dans [Fargate logging](https://docs.aws.amazon.com/eks/latest/userguide/fargate-logging.html) dans la documentation Amazon EKS.

Pour certaines raisons, pour les pods fonctionnant sur AWS Fargate ou vous devez utiliser le patron sidecar, vous pouvez executer un conteneur sidecar Fluentd (ou [Fluent Bit](http://fluentbit.io/)) pour capturer les journaux produits par vos applications. Cette option necessite que l'application ecrive les journaux sur le systeme de fichiers au lieu de `stdout` ou `stderr`. Une consequence de cette approche est que vous ne pourrez pas utiliser `kubectl` logs pour voir les journaux de conteneur. Pour faire apparaitre les journaux dans `kubectl logs`, vous pouvez ecrire les journaux d'application a la fois sur `stdout` et sur le systeme de fichiers simultanement.

Les [pods sur Fargate obtiennent 20 Go de stockage ephemere](https://docs.aws.amazon.com/eks/latest/userguide/fargate-pod-configuration.html), qui est disponible pour tous les conteneurs appartenant a un pod. Vous pouvez configurer votre application pour ecrire les journaux sur le systeme de fichiers local et instruire Fluentd de surveiller le repertoire (ou fichier) de journaux. Fluentd lira les evenements depuis la fin des fichiers de journaux et enverra les evenements vers une destination comme CloudWatch pour le stockage. Assurez-vous de faire une rotation reguliere des journaux pour empecher les journaux d'utiliser tout le volume.

Veuillez en apprendre davantage sur [How to capture application logs when using Amazon EKS on AWS Fargate](https://aws.amazon.com/blogs/containers/how-to-capture-application-logs-when-using-amazon-eks-on-aws-fargate/) pour operer et observer vos applications Kubernetes a grande echelle sur AWS Fargate. Nous utiliserons egalement `tee` pour ecrire dans un fichier et sur `stdout` afin de voir les journaux dans `kubectl logs` avec cette approche.

### Agregation unifiee des journaux depuis Amazon EKS et d'autres plateformes de calcul utilisant les services natifs AWS

De nos jours, les clients souhaitent unifier et centraliser les journaux a travers differentes plateformes de calcul telles qu'[Amazon Elastic Kubernetes Service](https://aws.amazon.com/eks/) (Amazon EKS), [Amazon Elastic Compute Cloud](https://aws.amazon.com/ec2/) (Amazon EC2), [Amazon Elastic Container Service](https://aws.amazon.com/ecs/) (Amazon ECS), [Amazon Kinesis Data Firehose](https://aws.amazon.com/kinesis/data-firehose/) et [AWS Lambda](https://aws.amazon.com/lambda/) en utilisant des agents, des routeurs de journaux et des extensions. Nous pouvons ensuite utiliser [Amazon OpenSearch Service](https://aws.amazon.com/opensearch-service/) avec OpenSearch Dashboards pour visualiser et analyser les journaux, collectes a travers differentes plateformes de calcul pour obtenir des informations sur les applications.

Un systeme d'agregation de journaux unifie offre les avantages suivants :

* Un point d'acces unique a tous les journaux a travers differentes plateformes de calcul
* Aide a definir et standardiser les transformations des journaux avant qu'ils ne soient delivres aux systemes en aval comme [Amazon Simple Storage Service](http://aws.amazon.com/s3) (Amazon S3), Amazon OpenSearch Service, [Amazon Redshift](https://aws.amazon.com/redshift/) et d'autres services
* La capacite d'utiliser Amazon OpenSearch Service pour indexer rapidement, et OpenSearch Dashboards pour rechercher et visualiser les journaux de ses routeurs, applications et autres appareils

Le diagramme suivant montre l'architecture qui effectue l'agregation des journaux a travers differentes plateformes de calcul telles qu'[Amazon Elastic Kubernetes Service](https://aws.amazon.com/eks/) (Amazon EKS), [Amazon Elastic Compute Cloud](https://aws.amazon.com/ec2/) (Amazon EC2), [Amazon Elastic Container Service](https://aws.amazon.com/ecs/) (Amazon ECS) et [AWS Lambda](https://aws.amazon.com/lambda/).

![LOG-AGGREG-4](../../../../images/Containers/aws-native/eks/log-aggreg-4.jpg)

*Figure : Agregation des journaux a travers differentes plateformes de calcul.*

L'architecture utilise divers outils d'agregation de journaux tels que des agents de journaux, des routeurs de journaux et des extensions Lambda pour collecter les journaux de multiples plateformes de calcul et les delivrer a Kinesis Data Firehose. Kinesis Data Firehose diffuse les journaux vers Amazon OpenSearch Service. Les enregistrements de journaux qui ne parviennent pas a etre persistes dans Amazon OpenSearch Service seront ecrits dans AWS S3. Pour mettre cette architecture a l'echelle, chacune de ces plateformes de calcul diffuse les journaux vers un flux de livraison Firehose different, ajoute en tant qu'index separe et fait une rotation toutes les 24 heures.

Pour approfondir, consultez [comment unifier et centraliser les journaux a travers differentes plateformes de calcul](https://aws.amazon.com/blogs/big-data/unify-log-aggregation-and-analytics-across-compute-platforms/) telles qu'[Amazon Elastic Kubernetes Service](https://aws.amazon.com/eks/) (Amazon EKS), [Amazon Elastic Compute Cloud](https://aws.amazon.com/ec2/) (Amazon EC2), [Amazon Elastic Container Service](https://aws.amazon.com/ecs/) (Amazon ECS) et [AWS Lambda](https://aws.amazon.com/lambda/) en utilisant Kinesis Data Firehose et Amazon OpenSearch Service. Cette approche vous permet d'analyser rapidement les journaux et la cause profonde des defaillances, en utilisant une seule plateforme plutot que differentes plateformes pour differents services.

## Conclusion

Dans cette section du guide des meilleures pratiques d'Observability, nous avons commence par approfondir les trois types de journalisation Kubernetes : la journalisation du plan de controle, la journalisation des noeuds et la journalisation des applications. Ensuite, nous avons appris l'agregation unifiee des journaux depuis Amazon EKS et d'autres plateformes de calcul en utilisant les services natifs AWS tels que Kinesis Data Firehose et Amazon OpenSearch Service. Pour approfondir davantage, nous vous recommandons fortement de pratiquer les modules Logs et Insights dans la categorie Observability native AWS du [One Observability Workshop](https://catalog.workshops.aws/observability/en-US).
