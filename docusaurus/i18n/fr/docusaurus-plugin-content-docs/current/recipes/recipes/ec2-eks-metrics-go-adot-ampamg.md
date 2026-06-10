# Utiliser AWS Distro for OpenTelemetry dans EKS sur EC2 avec Amazon Managed Service for Prometheus

Dans cette recette, nous vous montrons comment instrumenter une [application Go exemple](https://github.com/aws-observability/aws-otel-community/tree/master/sample-apps/prometheus-sample-app) et utiliser [AWS Distro for OpenTelemetry (ADOT)](https://aws.amazon.com/otel) pour ingérer des métriques dans [Amazon Managed Service for Prometheus (AMP)](https://aws.amazon.com/prometheus/).
Ensuite, nous utilisons [Amazon Managed Grafana (AMG)](https://aws.amazon.com/grafana/) pour visualiser les métriques.

Nous allons configurer un cluster [Amazon Elastic Kubernetes Service (EKS)](https://aws.amazon.com/eks/) sur EC2 et un registre [Amazon Elastic Container Registry (ECR)](https://aws.amazon.com/ecr/) pour démontrer un scénario complet.

:::note
    Ce guide prendra environ 1 heure à compléter.
:::
## Infrastructure
Dans la section suivante, nous allons mettre en place l'infrastructure pour cette recette.

### Architecture


Le pipeline ADOT nous permet d'utiliser le [Collecteur ADOT](https://github.com/aws-observability/aws-otel-collector) pour scruter une application instrumentée avec Prometheus et ingérer les métriques récoltées dans Amazon Managed Service for Prometheus.

![Architecture](../images/adot-metrics-pipeline.png)

Le Collecteur ADOT inclut deux composants spécifiques à Prometheus :

* le Prometheus Receiver, et
* l'AWS Prometheus Remote Write Exporter.

:::info
    Pour plus d'informations sur le Prometheus Remote Write Exporter, consultez :
    [Getting Started with Prometheus Remote Write Exporter for AMP](https://aws-otel.github.io/docs/getting-started/prometheus-remote-write-exporter)
:::

### Prérequis

* L'AWS CLI est [installée](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html) et [configurée](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html) dans votre environnement.
* Vous devez installer la commande [eksctl](https://docs.aws.amazon.com/eks/latest/userguide/eksctl.html) dans votre environnement.
* Vous devez installer [kubectl](https://docs.aws.amazon.com/eks/latest/userguide/install-kubectl.html) dans votre environnement.
* Vous avez [docker](https://docs.docker.com/get-docker/) installé dans votre environnement.

### Créer un cluster EKS sur EC2

Notre application de démonstration dans cette recette s'exécutera sur EKS.
Vous pouvez utiliser un cluster EKS existant ou en créer un en utilisant [cluster-config.yaml](./ec2-eks-metrics-go-adot-ampamg/cluster-config.yaml).

Ce modèle créera un nouveau cluster avec deux noeuds EC2 `t2.large`.

Modifiez le fichier modèle et définissez `<YOUR_REGION>` sur l'une des [régions prises en charge pour AMP](https://docs.aws.amazon.com/prometheus/latest/userguide/what-is-Amazon-Managed-Service-Prometheus.html#AMP-supported-Regions).

Assurez-vous de remplacer `<YOUR_REGION>` dans votre session, par exemple en bash :
```
export AWS_DEFAULT_REGION=<YOUR_REGION>
```

Créez votre cluster en utilisant la commande suivante.
```
eksctl create cluster -f cluster-config.yaml
```

### Configurer un registre ECR

Pour déployer notre application sur EKS, nous avons besoin d'un registre de conteneurs.
Vous pouvez utiliser la commande suivante pour créer un nouveau registre ECR dans votre compte.
Assurez-vous de définir `<YOUR_REGION>` également.

```
aws ecr create-repository \
    --repository-name prometheus-sample-app \
    --image-scanning-configuration scanOnPush=true \
    --region <YOUR_REGION>
```

### Configurer AMP


Créez un espace de travail en utilisant l'AWS CLI
```
aws amp create-workspace --alias prometheus-sample-app
```

Vérifiez que l'espace de travail est créé en utilisant :
```
aws amp list-workspaces
```

:::info
    Pour plus de détails, consultez le guide [AMP Getting started](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-getting-started.html).
:::

### Configurer le Collecteur ADOT

Téléchargez [adot-collector-ec2.yaml](./ec2-eks-metrics-go-adot-ampamg/adot-collector-ec2.yaml) et modifiez ce document YAML avec les paramètres décrits dans les étapes suivantes.

Dans cet exemple, la configuration du Collecteur ADOT utilise une annotation `(scrape=true)` pour indiquer quels endpoints cibles scruter. Cela permet au Collecteur ADOT de distinguer l'endpoint de l'application exemple des endpoints `kube-system` dans votre cluster.
Vous pouvez supprimer cela des configurations de re-labeling si vous souhaitez scruter une application exemple différente.

Utilisez les étapes suivantes pour modifier le fichier téléchargé selon votre environnement :

1\. Remplacez `<YOUR_REGION>` par votre région actuelle.

2\. Remplacez `<YOUR_ENDPOINT>` par l'URL d'écriture distante de votre espace de travail.

Obtenez l'URL de l'endpoint d'écriture distante AMP en exécutant les requêtes suivantes.

Tout d'abord, obtenez l'ID de l'espace de travail comme ceci :

```
YOUR_WORKSPACE_ID=$(aws amp list-workspaces \
                    --alias prometheus-sample-app \
                    --query 'workspaces[0].workspaceId' --output text)
```

Maintenant obtenez l'URL de l'endpoint d'écriture distante pour votre espace de travail en utilisant :

```
YOUR_ENDPOINT=$(aws amp describe-workspace \
                --workspace-id $YOUR_WORKSPACE_ID  \
                --query 'workspace.prometheusEndpoint' --output text)api/v1/remote_write
```

:::warning
    Assurez-vous que `YOUR_ENDPOINT` est bien l'URL d'écriture distante, c'est-à-dire que
    l'URL doit se terminer par `/api/v1/remote_write`.
:::
Après avoir créé le fichier de déploiement, nous pouvons maintenant l'appliquer à notre cluster en utilisant la commande suivante :

```
kubectl apply -f adot-collector-ec2.yaml
```

:::info
    Pour plus d'informations, consultez la [configuration du Collecteur AWS Distro for OpenTelemetry (ADOT)](https://aws-otel.github.io/docs/getting-started/prometheus-remote-write-exporter/eks#aws-distro-for-opentelemetry-adot-collector-setup).
:::

### Configurer AMG

Configurez un nouvel espace de travail AMG en utilisant le guide [Amazon Managed Grafana - Getting Started](https://aws.amazon.com/blogs/mt/amazon-managed-grafana-getting-started/).

Assurez-vous d'ajouter "Amazon Managed Service for Prometheus" comme source de données lors de la création.

![Paramètres de permissions gérés par le service](https://d2908q01vomqb2.cloudfront.net/972a67c48192728a34979d9a35164c1295401b71/2020/12/09/image008-1024x870.jpg)


## Application

Dans cette recette, nous utiliserons une [application exemple](https://github.com/aws-observability/aws-otel-community/tree/master/sample-apps/prometheus) du dépôt AWS Observability.

Cette application Prometheus exemple génère les quatre types de métriques Prometheus (counter, gauge, histogram, summary) et les expose à l'endpoint `/metrics`.

### Construire l'image conteneur

Pour construire l'image conteneur, clonez d'abord le dépôt Git et changez de répertoire comme suit :

```
git clone https://github.com/aws-observability/aws-otel-community.git && \
cd ./aws-otel-community/sample-apps/prometheus
```

Tout d'abord, définissez la région (si ce n'est pas déjà fait ci-dessus) et l'ID de compte applicables à votre cas.
Remplacez `<YOUR_REGION>` par votre région actuelle. Par exemple, dans le shell Bash cela ressemblerait à :

```
export AWS_DEFAULT_REGION=<YOUR_REGION>
export ACCOUNTID=`aws sts get-caller-identity --query Account --output text`
```

Ensuite, construisez l'image conteneur :

```
docker build . -t "$ACCOUNTID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/prometheus-sample-app:latest"
```

:::note
    Si `go mod` échoue dans votre environnement en raison d'un timeout i/o de proxy.golang.org,
    vous pouvez contourner le proxy go mod en modifiant le Dockerfile.

    Changez la ligne suivante dans le Dockerfile :
    ```
    RUN GO111MODULE=on go mod download
    ```
    en :
    ```
    RUN GOPROXY=direct GO111MODULE=on go mod download
    ```
:::
Maintenant vous pouvez pousser l'image conteneur vers le dépôt ECR que vous avez créé précédemment.

Pour cela, connectez-vous d'abord au registre ECR par défaut :

```
aws ecr get-login-password --region $AWS_DEFAULT_REGION | \
    docker login --username AWS --password-stdin \
    "$ACCOUNTID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com"
```

Et enfin, poussez l'image conteneur vers le dépôt ECR que vous avez créé ci-dessus :

```
docker push "$ACCOUNTID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/prometheus-sample-app:latest"
```

### Déployer l'application exemple

Modifiez [prometheus-sample-app.yaml](./ec2-eks-metrics-go-adot-ampamg/prometheus-sample-app.yaml) pour contenir votre chemin d'image ECR. C'est-à-dire, remplacez `ACCOUNTID` et `AWS_DEFAULT_REGION` dans le fichier par vos propres valeurs :

```
    # change the following to your container image:
    image: "ACCOUNTID.dkr.ecr.AWS_DEFAULT_REGION.amazonaws.com/prometheus-sample-app:latest"
```

Maintenant vous pouvez déployer l'application exemple sur votre cluster en utilisant :

```
kubectl apply -f prometheus-sample-app.yaml
```

## De bout en bout

Maintenant que vous avez l'infrastructure et l'application en place, nous allons tester la configuration, en envoyant des métriques depuis l'application Go s'exécutant dans EKS vers AMP et les visualiser dans AMG.

### Vérifier que votre pipeline fonctionne

Pour vérifier si le collecteur ADOT scrute le pod de l'application exemple et ingère les métriques dans AMP, nous examinons les logs du collecteur.

Entrez la commande suivante pour suivre les logs du collecteur ADOT :

```
kubectl -n adot-col logs adot-collector -f
```

Un exemple de sortie dans les logs des métriques scrutées depuis l'application exemple devrait ressembler à ceci :

```
...
Resource labels:
     -> service.name: STRING(kubernetes-service-endpoints)
     -> host.name: STRING(192.168.16.238)
     -> port: STRING(8080)
     -> scheme: STRING(http)
InstrumentationLibraryMetrics #0
Metric #0
Descriptor:
     -> Name: test_gauge0
     -> Description: This is my gauge
     -> Unit:
     -> DataType: DoubleGauge
DoubleDataPoints #0
StartTime: 0
Timestamp: 1606511460471000000
Value: 0.000000
...
```

:::tip
    Pour vérifier si AMP a reçu les métriques, vous pouvez utiliser [awscurl](https://github.com/okigan/awscurl).
    Cet outil vous permet d'envoyer des requêtes HTTP depuis la ligne de commande avec l'authentification AWS Sigv4,
    vous devez donc avoir les identifiants AWS configurés localement avec les permissions correctes pour interroger AMP.
    Dans la commande suivante, remplacez `$AMP_ENDPOINT` par l'endpoint de votre espace de travail AMP :

    ```
    $ awscurl --service="aps" \
            --region="$AWS_DEFAULT_REGION" "https://$AMP_ENDPOINT/api/v1/query?query=adot_test_gauge0"
    {"status":"success","data":{"resultType":"vector","result":[{"metric":{"__name__":"adot_test_gauge0"},"value":[1606512592.493,"16.87214000011479"]}]}}
    ```
:::
### Créer un tableau de bord Grafana

Vous pouvez importer un tableau de bord exemple, disponible via [prometheus-sample-app-dashboard.json](./ec2-eks-metrics-go-adot-ampamg/prometheus-sample-app-dashboard.json), pour l'application exemple qui ressemble à ceci :

![Capture d'écran du tableau de bord de l'application Prometheus exemple dans AMG](../images/amg-prom-sample-app-dashboard.png)

De plus, utilisez les guides suivants pour créer votre propre tableau de bord dans Amazon Managed Grafana :

* [User Guide: Dashboards](https://docs.aws.amazon.com/grafana/latest/userguide/dashboard-overview.html)
* [Best practices for creating dashboards](https://grafana.com/docs/grafana/latest/best-practices/best-practices-for-creating-dashboards/)

Voilà, félicitations, vous avez appris à utiliser ADOT dans EKS sur EC2 pour ingérer des métriques.

## Nettoyage

1. Supprimez les ressources et le cluster
```
kubectl delete all --all
eksctl delete cluster --name amp-eks-ec2
```
2. Supprimez l'espace de travail AMP
```
aws amp delete-workspace --workspace-id `aws amp list-workspaces --alias prometheus-sample-app --query 'workspaces[0].workspaceId' --output text`
```
3. Supprimez le rôle IAM amp-iamproxy-ingest-role
```
aws delete-role --role-name amp-iamproxy-ingest-role
```
4. Supprimez l'espace de travail AMG en le supprimant depuis la console.
