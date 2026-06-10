# Managed Grafana-வில் [**kubernetes-mixin**](https://github.com/kubernetes-monitoring/kubernetes-mixin) டாஷ்போர்டுகளை சேர்த்தல்

நிர்வகிக்கப்படும் சேவையாக இருந்தாலும், EKS Kubernetes control plane-இலிருந்து பல மெட்ரிக்குகளை வெளிப்படுத்துகிறது. Prometheus சமூகம் இந்த மெட்ரிக்குகளை மதிப்பாய்வு செய்து ஆராய்வதற்கான தொடர்ச்சியான டாஷ்போர்டுகளை ஒன்று சேர்த்துள்ளது. Amazon Managed Service for Prometheus மூலம் host செய்யப்படும் சூழலில் அவற்றை எவ்வாறு நிறுவுவது என்பதை இந்த ஆவணம் காட்டும்.

Prometheus mixin project Prometheus Operator வழியாக prometheus நிறுவப்படுவதை எதிர்பார்க்கிறது, ஆனால் Terraform blueprints default helm charts வழியாக Prometheus agent-ஐ நிறுவுகின்றன. Scraping jobs மற்றும் dashboards பொருந்த, Prometheus rules மற்றும் mixin dashboard configuration-ஐ புதுப்பிக்க வேண்டும், பின்னர் dashboard-ஐ நமது Grafana instance-க்கு upload செய்ய வேண்டும்.


## முன்நிபந்தனைகள்

* ஒரு EKS கிளஸ்டர் - இதிலிருந்து தொடங்குதல்: [https://github.com/aws-ia/terraform-aws-eks-blueprints/tree/main/examples/complete-kubernetes-addons](https://github.com/aws-ia/terraform-aws-eks-blueprints/tree/main/)
* ஒரு Cloud9 சூழல்
* EKS கிளஸ்டரை நிர்வகிக்க Cloud9-ல் kubectl கட்டமைக்கப்பட்டிருக்க வேண்டும்
* EKS-க்கான IAM credentials
* AMP instance
* Amazon Managed Grafana instance


## Mixin dashboards நிறுவுதல்


புதிய Cloud9 instance-இலிருந்து தொடங்கி, முன்நிபந்தனைகளில் இணைக்கப்பட்ட terraform complete addon example-ஐ target EKS கிளஸ்டராகப் பயன்படுத்துதல்:

Cloud9 instance-இன் file system-ஐ குறைந்தது 20 GB-க்கு விரிவாக்கவும். EC2 console-ல், EBS volume-ஐ 20 GB-க்கு விரிவாக்கி, Cloud9 shell-இலிருந்து கீழே உள்ள கட்டளைகளை இயக்கவும்:

```
sudo growpart /dev/nvme0n1 1
sudo xfs_growfs -d /
```


awscli-ஐ version 2-க்கு மேம்படுத்தவும்:

```
sudo yum remove -y awscli
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
ln -s /usr/local/bin/aws /usr/bin/aws
```


முன்நிபந்தனைகளை நிறுவுதல்:

```
sudo yum install -y jsonnet
go install -a github.com/jsonnet-bundler/jsonnet-bundler/cmd/jb@latest
export PATH="$PATH:~/go/bin"
```


kubernetes-mixin project-க்கான jsonnet libraries-ஐ பதிவிறக்கி நிறுவுதல்:


```
git clone https://github.com/kubernetes-monitoring/kubernetes-mixincd kubernetes-mixin/
jb install
```


config.libsonnet-ஐ திருத்தி, prometheus job names-உடன் பொருந்த "selectors" பிரிவை பின்வருவனவற்றுடன் மாற்றவும்:

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



Prometheus rules, alerts மற்றும் grafana dashboards-ஐ build செய்தல்:

```
make prometheus_alerts.yaml
make prometheus_rules.yaml
make dashboards_out
```


Prometheus rules-ஐ managed prometheus-க்கு upload செய்தல். "WORKSPACE-ID"-ஐ உங்கள் managed prometheus instance-இன் ID-யுடனும் "REGION"-ஐ பொருத்தமான மதிப்புடனும் மாற்றவும்

```
base64 prometheus_rules.yaml > prometheus_rules.b64
aws amp create-rule-groups-namespace --data file://prometheus_rules.b64 --name kubernetes-mixin  --workspace-id <<WORKSPACE-ID> --region <<REGION>>
```



Cloud9 சூழலிலிருந்து 'dashboard_out' folder-இன் உள்ளடக்கங்களைப் பதிவிறக்கி, Grafana web UI பயன்படுத்தி அவற்றை upload செய்யவும்.
