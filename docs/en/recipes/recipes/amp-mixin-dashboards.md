# Adding [**kubernetes-mixin**](https://github.com/kubernetes-monitoring/kubernetes-mixin) dashboards to Managed Grafana

Even as a managed service, EKS still exposes many of the metrics from the Kubernetes control plane. The Prometheus community has put together a series of dashboards to review and investigate these metrics. This document will show you how to install them in an environment hosted by Amazon Managed Service for Prometheus.

The Prometheus mixin project expects prometheus to be installed via the Prometheus Operator, but the Terraform blueprints install the Prometheus agent via the default helm charts. In order for the scraping jobs and the dashboards to line up, we need to update the Prometheus rules and the mixin dashboard configuration, then upload the dashboard to our Grafana instance.


## Prerequisites

* An EKS cluster - Starting from: [https://github.com/aws-ia/terraform-aws-eks-blueprints/tree/main/examples/complete-kubernetes-addons](https://github.com/aws-ia/terraform-aws-eks-blueprints/tree/main/examples/complete-kubernetes-addons)
* A Cloud9 environment
* kubectl in Cloud9 configured to manage the EKS cluster
* IAM credentials for EKS
* An instance of AMP
* An instance of Amazon Managed Grafana


## Installing the mixin dashboards


Starting from a fresh Cloud9 instance and using the AWS blueprint for terraform complete addon example as the target EKS cluster as linked in the Prerequisites:

Expand the file system of the Cloud9 instance to at least 20 gb. In the EC2 console, extend the EBS volume to 20 GB thenfrom the Cloud9 shell, run the commands below:

```
sudo growpart /dev/nvme0n1 1
sudo xfs_growfs -d /
```


Upgrade awscli to version 2:

```
sudo yum remove -y awscli
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
ln -s /usr/local/bin/aws /usr/bin/aws
```


Install prerequisites: 

```
sudo yum install -y jsonnet
go install -a github.com/jsonnet-bundler/jsonnet-bundler/cmd/jb@latest
export PATH="$PATH:~/go/bin"
```


Download and install the jsonnet libraries for the kubernetes-mixin project:


```
git clone https://github.com/kubernetes-monitoring/kubernetes-mixincd kubernetes-mixin/
jb install
```


Edit config.libsonnet and replace the “selectors“ section with the following in order to match the prometheus job names:

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



Build the prometheus rules, alerts, and grafana dashboards:

```
make prometheus_alerts.yaml
make prometheus_rules.yaml
make dashboards_out
```


Upload the prometheus rules to managed prometheus. Replace <<WORKSPACE-ID>> with the ID of your managed prometheus instance and <<REGION>> with the appropriate value

```
base64 prometheus_rules.yaml > prometheus_rules.b64
aws amp create-rule-groups-namespace --data file://prometheus_rules.b64 --name kubernetes-mixin  --workspace-id <<WORKSPACE-ID> --region <<REGION>>
```



Download the contents of the ‘dashboard_out’ folder from the Cloud9 environment and upload them using the Grafana web UI.
