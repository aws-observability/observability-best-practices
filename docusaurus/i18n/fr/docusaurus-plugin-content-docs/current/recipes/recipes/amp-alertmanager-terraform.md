# Terraform comme Infrastructure as Code pour déployer Amazon Managed Service for Prometheus et configurer Alert Manager

Dans cette recette, nous allons démontrer comment vous pouvez utiliser [Terraform](https://www.terraform.io/) pour provisionner [Amazon Managed Service for Prometheus](https://aws.amazon.com/prometheus/) et configurer la gestion des règles et l'alert manager pour envoyer une notification à un sujet [SNS](https://docs.aws.amazon.com/sns/) si une certaine condition est remplie.


:::note
    Ce guide prendra environ 30 minutes à compléter.
:::
## Prérequis

Vous aurez besoin de ce qui suit pour compléter la configuration :

* [Cluster Amazon EKS](https://docs.aws.amazon.com/eks/latest/userguide/create-cluster.html)
* [AWS CLI version 2](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
* [Terraform CLI](https://www.terraform.io/downloads)
* [AWS Distro for OpenTelemetry(ADOT)](https://aws-otel.github.io/)
* [eksctl](https://eksctl.io/)
* [kubectl](https://docs.aws.amazon.com/eks/latest/userguide/install-kubectl.html)
* [jq](https://stedolan.github.io/jq/download/)
* [helm](https://helm.sh/)
* [Sujet SNS](https://docs.aws.amazon.com/sns/latest/dg/sns-create-topic.html)
* [awscurl](https://github.com/okigan/awscurl)

Dans cette recette, nous utiliserons une application exemple pour démontrer le scraping de métriques à l'aide d'ADOT et l'écriture distante des métriques vers l'espace de travail Amazon Managed Service for Prometheus. Forkez et clonez l'application exemple depuis le dépôt [aws-otel-community](https://github.com/aws-observability/aws-otel-community).

Cette application Prometheus exemple génère les 4 types de métriques Prometheus (counter, gauge, histogram, summary) et les expose à l'endpoint /metrics

Un endpoint de vérification de l'état existe également à /

Voici une liste de paramètres de ligne de commande optionnels pour la configuration :

listen_address : (défaut = 0.0.0.0:8080) définit l'adresse et le port sur lesquels l'application exemple est exposée. Ceci est principalement pour se conformer aux exigences du framework de test.

metric_count : (défaut=1) la quantité de chaque type de métrique à générer. La même quantité de métriques est toujours générée par type de métrique.

label_count : (défaut=1) la quantité de labels par métrique à générer.


datapoint_count : (défaut=1) le nombre de points de données par métrique à générer.

### Activer la collecte de métriques avec AWS Distro for OpenTelemetry
1. Forkez et clonez l'application exemple depuis le dépôt aws-otel-community.
Puis exécutez les commandes suivantes.

```
cd ./sample-apps/prometheus
docker build . -t prometheus-sample-app:latest
```
2. Poussez cette image vers un registre tel qu'Amazon ECR. Vous pouvez utiliser la commande suivante pour créer un nouveau dépôt ECR dans votre compte. Assurez-vous de définir "YOUR_REGION" également.

```
aws ecr create-repository \
    --repository-name prometheus-sample-app \
    --image-scanning-configuration scanOnPush=true \
    --region <YOUR_REGION>
```
3. Déployez l'application exemple dans le cluster en copiant cette configuration Kubernetes et en l'appliquant. Changez l'image pour l'image que vous venez de pousser en remplaçant `PUBLIC_SAMPLE_APP_IMAGE` dans le fichier prometheus-sample-app.yaml.

```
curl https://raw.githubusercontent.com/aws-observability/aws-otel-collector/main/examples/eks/aws-prometheus/prometheus-sample-app.yaml -o prometheus-sample-app.yaml
kubectl apply -f prometheus-sample-app.yaml
```
4. Démarrez une instance par défaut du Collecteur ADOT. Pour ce faire, entrez d'abord la commande suivante pour récupérer la configuration Kubernetes du Collecteur ADOT.

```
curl https://raw.githubusercontent.com/aws-observability/aws-otel-collector/main/examples/eks/aws-prometheus/prometheus-daemonset.yaml -o prometheus-daemonset.yaml
```
Puis modifiez le fichier modèle, en substituant l'endpoint d'écriture distante de votre espace de travail Amazon Managed Service for Prometheus pour `YOUR_ENDPOINT` et votre région pour `YOUR_REGION`.
Utilisez l'endpoint d'écriture distante qui est affiché dans la console Amazon Managed Service for Prometheus lorsque vous consultez les détails de votre espace de travail.
Vous devrez également changer `YOUR_ACCOUNT_ID` dans la section compte de service de la configuration Kubernetes par votre ID de compte AWS.

Dans cette recette, la configuration du Collecteur ADOT utilise une annotation `(scrape=true)` pour indiquer quels endpoints cibles scruter. Cela permet au Collecteur ADOT de distinguer l'endpoint de l'application exemple des endpoints kube-system dans votre cluster. Vous pouvez supprimer cela des configurations de re-labeling si vous souhaitez scruter une application exemple différente.
5. Entrez la commande suivante pour déployer le collecteur ADOT.
```
kubectl apply -f eks-prometheus-daemonset.yaml
```

### Configurer l'espace de travail avec Terraform

Maintenant, nous allons provisionner un espace de travail Amazon Managed Service for Prometheus et définir une règle d'alerte qui provoque l'envoi d'une notification par l'Alert Manager si une certaine condition (définie dans ```expr```) reste vraie pendant une période spécifiée (```for```). Le code en langage Terraform est stocké dans des fichiers texte brut avec l'extension .tf. Il existe également une variante basée sur JSON du langage qui est nommée avec l'extension .tf.json.

Nous allons maintenant utiliser le fichier [main.tf](./amp-alertmanager-terraform/main.tf) pour déployer les ressources avec Terraform. Avant d'exécuter la commande Terraform, nous allons exporter les variables `region` et `sns_topic`.

```
export TF_VAR_region=<your region>
export TF_VAR_sns_topic=<ARN of the SNS topic used by the SNS receiver>
```

Maintenant, nous allons exécuter les commandes ci-dessous pour provisionner l'espace de travail :

```
terraform init
terraform plan
terraform apply
```

Une fois les étapes ci-dessus terminées, vérifiez la configuration de bout en bout en utilisant awscurl et interrogez l'endpoint. Assurez-vous que la variable `WORKSPACE_ID` est remplacée par l'ID d'espace de travail Amazon Managed Service for Prometheus approprié.

En exécutant la commande ci-dessous, recherchez la métrique "metric:recording_rule", et si vous trouvez la métrique avec succès, alors vous avez créé une règle d'enregistrement avec succès :

```
awscurl https://aps-workspaces.us-east-1.amazonaws.com/workspaces/$WORKSPACE_ID/api/v1/rules  --service="aps"
```
Sortie exemple :
```
"status":"success","data":{"groups":[{"name":"alert-test","file":"rules","rules":[{"state":"firing","name":"metric:alerting_rule","query":"rate(adot_test_counter0[5m]) > 5","duration":0,"labels":{},"annotations":{},"alerts":[{"labels":{"alertname":"metric:alerting_rule"},"annotations":{},"state":"firing","activeAt":"2021-09-16T13:20:35.9664022Z","value":"6.96890019778219e+01"}],"health":"ok","lastError":"","type":"alerting","lastEvaluation":"2021-09-16T18:41:35.967122005Z","evaluationTime":0.018121408}],"interval":60,"lastEvaluation":"2021-09-16T18:41:35.967104769Z","evaluationTime":0.018142997},{"name":"test","file":"rules","rules":[{"name":"metric:recording_rule","query":"rate(adot_test_counter0[5m])","labels":{},"health":"ok","lastError":"","type":"recording","lastEvaluation":"2021-09-16T18:40:44.650001548Z","evaluationTime":0.018381387}],"interval":60,"lastEvaluation":"2021-09-16T18:40:44.649986468Z","evaluationTime":0.018400463}]},"errorType":"","error":""}
```

Nous pouvons également interroger l'endpoint alertmanager pour confirmer
```
awscurl https://aps-workspaces.us-east-1.amazonaws.com/workspaces/$WORKSPACE_ID/alertmanager/api/v2/alerts --service="aps" -H "Content-Type: application/json"
```
Sortie exemple :
```
[{"annotations":{},"endsAt":"2021-09-16T18:48:35.966Z","fingerprint":"114212a24ca97549","receivers":[{"name":"default"}],"startsAt":"2021-09-16T13:20:35.966Z","status":{"inhibitedBy":[],"silencedBy":[],"state":"active"},"updatedAt":"2021-09-16T18:44:35.984Z","generatorURL":"/graph?g0.expr=sum%28rate%28envoy_http_downstream_rq_time_bucket%5B1m%5D%29%29+%3E+5&g0.tab=1","labels":{"alertname":"metric:alerting_rule"}}]
```
Cela confirme que l'alerte a été déclenchée et envoyée à SNS via le récepteur SNS

## Nettoyage

Exécutez la commande suivante pour terminer l'espace de travail Amazon Managed Service for Prometheus. Assurez-vous de supprimer également le cluster EKS qui a été créé :


```
terraform destroy
```

