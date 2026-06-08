# Managed Grafana에 [**kubernetes-mixin**](https://github.com/kubernetes-monitoring/kubernetes-mixin) 대시보드 추가

관리형 서비스임에도 불구하고 EKS는 Kubernetes 컨트롤 플레인의 많은 메트릭을 노출합니다. Prometheus 커뮤니티에서는 이러한 메트릭을 검토하고 조사하기 위한 일련의 대시보드를 구성했습니다. 이 문서에서는 Amazon Managed Service for Prometheus에서 호스팅되는 환경에 이를 설치하는 방법을 보여줍니다.

Prometheus mixin 프로젝트는 Prometheus가 Prometheus Operator를 통해 설치될 것을 기대하지만, Terraform blueprint는 기본 helm 차트를 통해 Prometheus agent를 설치합니다. 스크레이핑 작업과 대시보드가 일치하려면 Prometheus 규칙과 mixin 대시보드 구성을 업데이트한 후 대시보드를 Grafana 인스턴스에 업로드해야 합니다.


## 사전 요구 사항

* EKS 클러스터 - 시작점: [https://github.com/aws-ia/terraform-aws-eks-blueprints/tree/main/examples/complete-kubernetes-addons](https://github.com/aws-ia/terraform-aws-eks-blueprints/tree/main/)
* Cloud9 환경
* EKS 클러스터를 관리하도록 Cloud9에 구성된 kubectl
* EKS용 IAM 자격 증명
* AMP 인스턴스
* Amazon Managed Grafana 인스턴스


## mixin 대시보드 설치


새로운 Cloud9 인스턴스에서 시작하여 사전 요구 사항에 링크된 AWS blueprint for terraform complete addon 예제를 대상 EKS 클러스터로 사용합니다:

Cloud9 인스턴스의 파일 시스템을 최소 20GB로 확장합니다. EC2 콘솔에서 EBS 볼륨을 20GB로 확장한 후 Cloud9 셸에서 아래 명령을 실행합니다:

```
sudo growpart /dev/nvme0n1 1
sudo xfs_growfs -d /
```


awscli를 버전 2로 업그레이드합니다:

```
sudo yum remove -y awscli
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
ln -s /usr/local/bin/aws /usr/bin/aws
```


필수 구성 요소를 설치합니다:

```
sudo yum install -y jsonnet
go install -a github.com/jsonnet-bundler/jsonnet-bundler/cmd/jb@latest
export PATH="$PATH:~/go/bin"
```


kubernetes-mixin 프로젝트의 jsonnet 라이브러리를 다운로드하고 설치합니다:


```
git clone https://github.com/kubernetes-monitoring/kubernetes-mixincd kubernetes-mixin/
jb install
```


config.libsonnet을 편집하고 Prometheus job 이름과 일치하도록 "selectors" 섹션을 다음으로 교체합니다:

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



Prometheus 규칙, 알림, Grafana 대시보드를 빌드합니다:

```
make prometheus_alerts.yaml
make prometheus_rules.yaml
make dashboards_out
```


Prometheus 규칙을 Managed Prometheus에 업로드합니다. "WORKSPACE-ID"를 Managed Prometheus 인스턴스의 ID로, "REGION"을 적절한 값으로 교체합니다.

```
base64 prometheus_rules.yaml > prometheus_rules.b64
aws amp create-rule-groups-namespace --data file://prometheus_rules.b64 --name kubernetes-mixin  --workspace-id <<WORKSPACE-ID> --region <<REGION>>
```



Cloud9 환경에서 'dashboard_out' 폴더의 내용을 다운로드하고 Grafana 웹 UI를 사용하여 업로드합니다.
