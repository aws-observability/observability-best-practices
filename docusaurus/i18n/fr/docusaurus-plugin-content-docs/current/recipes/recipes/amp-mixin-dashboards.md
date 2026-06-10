# Ajouter des tableaux de bord [**kubernetes-mixin**](https://github.com/kubernetes-monitoring/kubernetes-mixin) à Managed Grafana

Même en tant que service géré, EKS expose encore de nombreuses métriques du plan de contrôle Kubernetes. La communauté Prometheus a mis en place une série de tableaux de bord pour examiner et investiguer ces métriques. Ce document vous montrera comment les installer dans un environnement hébergé par Amazon Managed Service for Prometheus.

Le projet Prometheus mixin s'attend à ce que Prometheus soit installé via le Prometheus Operator, mais les blueprints Terraform installent l'agent Prometheus via les charts Helm par défaut. Pour que les tâches de scraping et les tableaux de bord correspondent, nous devons mettre à jour les règles Prometheus et la configuration du tableau de bord mixin, puis télécharger le tableau de bord dans notre instance Grafana.


## Prérequis

* Un cluster EKS - En partant de : [https://github.com/aws-ia/terraform-aws-eks-blueprints/tree/main/examples/complete-kubernetes-addons](https://github.com/aws-ia/terraform-aws-eks-blueprints/tree/main/)
* Un environnement Cloud9
* kubectl dans Cloud9 configuré pour gérer le cluster EKS
* Des identifiants IAM pour EKS
* Une instance d'AMP
* Une instance d'Amazon Managed Grafana


## Installer les tableaux de bord mixin


En partant d'une instance Cloud9 fraîche et en utilisant le blueprint AWS pour l'exemple complete addon de Terraform comme cluster EKS cible tel que référencé dans les Prérequis :

Étendez le système de fichiers de l'instance Cloud9 à au moins 20 Go. Dans la console EC2, étendez le volume EBS à 20 Go puis depuis le shell Cloud9, exécutez les commandes ci-dessous :

```
sudo growpart /dev/nvme0n1 1
sudo xfs_growfs -d /
```


Mettez à jour awscli vers la version 2 :

```
sudo yum remove -y awscli
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
ln -s /usr/local/bin/aws /usr/bin/aws
```


Installez les prérequis :

```
sudo yum install -y jsonnet
go install -a github.com/jsonnet-bundler/jsonnet-bundler/cmd/jb@latest
export PATH="$PATH:~/go/bin"
```


Téléchargez et installez les bibliothèques jsonnet pour le projet kubernetes-mixin :


```
git clone https://github.com/kubernetes-monitoring/kubernetes-mixincd kubernetes-mixin/
jb install
```


Modifiez config.libsonnet et remplacez la section "selectors" par ce qui suit afin de correspondre aux noms de tâches Prometheus :

```
 // Selectors are inserted between {} in Prometheus queries.
 cadvisorSelector: 'job="kubernetes-nodes-cadvisor"',
 kubeletSelector: 'job="kubernetes-nodes"',
 kubeStateMetricsSelector: 'job="kubernetes-service-endpoints"',
 nodeExporterSelector: 'job="kubernetes-service-endpoints"',
 kubeSchedulerSelector: 'job="kube-scheduler"',
 kubeControllerManagerSelector: 'job="kube-controller-manager"',
 kubeApiserverSelector: 'job="kubernetes-apiservers"',
 kubeProxySelector: 'job="kubernetes-nodes"',
 podLabel: 'pod',
 hostNetworkInterfaceSelector: 'device!~"veth.+"',
 hostMountpointSelector: 'mountpoint="/"',
 windowsExporterSelector: 'job="kubernetes-windows-exporter"',
 containerfsSelector: 'container!=""',
```



Construisez les règles Prometheus, les alertes et les tableaux de bord Grafana :

```
make prometheus_alerts.yaml
make prometheus_rules.yaml
make dashboards_out
```


Téléchargez les règles Prometheus vers Managed Prometheus. Remplacez "WORKSPACE-ID" par l'ID de votre instance Managed Prometheus et "REGION" par la valeur appropriée

```
base64 prometheus_rules.yaml > prometheus_rules.b64
aws amp create-rule-groups-namespace --data file://prometheus_rules.b64 --name kubernetes-mixin  --workspace-id <<WORKSPACE-ID> --region <<REGION>>
```



Téléchargez le contenu du dossier 'dashboard_out' depuis l'environnement Cloud9 et téléchargez-les via l'interface web Grafana.
