# Managed Grafana కు [**kubernetes-mixin**](https://github.com/kubernetes-monitoring/kubernetes-mixin) dashboards Add చేయడం

Managed service అయినప్పటికీ, EKS Kubernetes control plane నుండి చాలా metrics expose చేస్తుంది. Prometheus community ఈ metrics review మరియు investigate చేయడానికి dashboards series ను assemble చేసింది. Amazon Managed Service for Prometheus ద్వారా hosted environment లో వాటిని ఎలా install చేయాలో ఈ document చూపిస్తుంది.

Prometheus mixin project Prometheus Operator ద్వారా prometheus install అవ్వాలని expect చేస్తుంది, కానీ Terraform blueprints default helm charts ద్వారా Prometheus agent install చేస్తాయి. Scraping jobs మరియు dashboards line up అవ్వడానికి, Prometheus rules మరియు mixin dashboard configuration update చేసి, ఆపై dashboard ను మన Grafana instance కు upload చేయాలి.


## Prerequisites

* EKS cluster - Starting from: [https://github.com/aws-ia/terraform-aws-eks-blueprints/tree/main/examples/complete-kubernetes-addons](https://github.com/aws-ia/terraform-aws-eks-blueprints/tree/main/)
* Cloud9 environment
* EKS cluster manage చేయడానికి Cloud9 లో configured kubectl
* EKS కోసం IAM credentials
* AMP instance
* Amazon Managed Grafana instance


## Mixin dashboards Install చేయడం


Fresh Cloud9 instance నుండి start చేస్తూ మరియు Prerequisites లో linked target EKS cluster గా AWS blueprint for terraform complete addon example ఉపయోగిస్తూ:

Cloud9 instance యొక్క file system కనీసం 20 gb కు expand చేయండి. EC2 console లో, EBS volume ను 20 GB కు extend చేసి Cloud9 shell నుండి, ఈ commands run చేయండి:

```
sudo growpart /dev/nvme0n1 1
sudo xfs_growfs -d /
```


awscli ను version 2 కు upgrade చేయండి:

```
sudo yum remove -y awscli
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
ln -s /usr/local/bin/aws /usr/bin/aws
```


Prerequisites install చేయండి:

```
sudo yum install -y jsonnet
go install -a github.com/jsonnet-bundler/jsonnet-bundler/cmd/jb@latest
export PATH="$PATH:~/go/bin"
```


kubernetes-mixin project కోసం jsonnet libraries download మరియు install చేయండి:


```
git clone https://github.com/kubernetes-monitoring/kubernetes-mixincd kubernetes-mixin/
jb install
```


config.libsonnet edit చేసి prometheus job names match చేయడానికి "selectors" section ను ఈ క్రింది వాటితో replace చేయండి:

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



Prometheus rules, alerts, మరియు grafana dashboards build చేయండి:

```
make prometheus_alerts.yaml
make prometheus_rules.yaml
make dashboards_out
```


Prometheus rules ను managed prometheus కు upload చేయండి. "WORKSPACE-ID" ను మీ managed prometheus instance ID తో మరియు "REGION" ను appropriate value తో replace చేయండి

```
base64 prometheus_rules.yaml > prometheus_rules.b64
aws amp create-rule-groups-namespace --data file://prometheus_rules.b64 --name kubernetes-mixin  --workspace-id <<WORKSPACE-ID> --region <<REGION>>
```



Cloud9 environment నుండి 'dashboard_out' folder contents download చేసి Grafana web UI ఉపయోగించి upload చేయండి.
