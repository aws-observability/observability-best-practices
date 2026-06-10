# 将 [**kubernetes-mixin**](https://github.com/kubernetes-monitoring/kubernetes-mixin) dashboard 添加到 Managed Grafana

即使作为托管服务，EKS 仍然暴露了 Kubernetes 控制平面的许多 metrics。Prometheus 社区整理了一系列 dashboard 来查看和调查这些 metrics。本文档将展示如何在由 Amazon Managed Service for Prometheus 托管的环境中安装它们。

Prometheus mixin 项目期望通过 Prometheus Operator 安装 Prometheus，但 Terraform blueprints 通过默认的 helm charts 安装 Prometheus agent。为了使抓取作业和 dashboard 对齐，我们需要更新 Prometheus 规则和 mixin dashboard 配置，然后将 dashboard 上传到 Grafana 实例。


## 前提条件

* 一个 EKS 集群 - 从以下开始：[https://github.com/aws-ia/terraform-aws-eks-blueprints/tree/main/examples/complete-kubernetes-addons](https://github.com/aws-ia/terraform-aws-eks-blueprints/tree/main/)
* 一个 Cloud9 环境
* 在 Cloud9 中配置 kubectl 以管理 EKS 集群
* 用于 EKS 的 IAM 凭证
* 一个 AMP 实例
* 一个 Amazon Managed Grafana 实例


## 安装 mixin dashboard


从一个新的 Cloud9 实例开始，使用前提条件中链接的 AWS blueprint for terraform complete addon 示例作为目标 EKS 集群：

将 Cloud9 实例的文件系统扩展至至少 20 GB。在 EC2 控制台中，将 EBS 卷扩展到 20 GB，然后在 Cloud9 shell 中运行以下命令：

```
sudo growpart /dev/nvme0n1 1
sudo xfs_growfs -d /
```


升级 awscli 到版本 2：

```
sudo yum remove -y awscli
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
ln -s /usr/local/bin/aws /usr/bin/aws
```


安装前提条件：

```
sudo yum install -y jsonnet
go install -a github.com/jsonnet-bundler/jsonnet-bundler/cmd/jb@latest
export PATH="$PATH:~/go/bin"
```


下载并安装 kubernetes-mixin 项目的 jsonnet 库：


```
git clone https://github.com/kubernetes-monitoring/kubernetes-mixincd kubernetes-mixin/
jb install
```


编辑 config.libsonnet，将 "selectors" 部分替换为以下内容以匹配 prometheus 作业名称：

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



构建 prometheus 规则、告警和 grafana dashboard：

```
make prometheus_alerts.yaml
make prometheus_rules.yaml
make dashboards_out
```


将 prometheus 规则上传到 Amazon Managed Service for Prometheus。将 "WORKSPACE-ID" 替换为您的 Amazon Managed Service for Prometheus 实例的 ID，将 "REGION" 替换为相应的值：

```
base64 prometheus_rules.yaml > prometheus_rules.b64
aws amp create-rule-groups-namespace --data file://prometheus_rules.b64 --name kubernetes-mixin  --workspace-id <<WORKSPACE-ID> --region <<REGION>>
```



从 Cloud9 环境下载 'dashboard_out' 文件夹的内容，并使用 Grafana Web UI 上传它们。
