# Managed Grafana に [**kubernetes-mixin**](https://github.com/kubernetes-monitoring/kubernetes-mixin) ダッシュボードを追加する

マネージドサービスであっても、EKS は Kubernetes コントロールプレーンから多くのメトリクスを公開し続けます。Prometheus コミュニティは、これらのメトリクスをレビューおよび調査するための一連のダッシュボードを作成しました。このドキュメントでは、Amazon Managed Service for Prometheus でホストされる環境にこれらをインストールする方法を示します。

Prometheus mixin プロジェクトは、Prometheus Operator を介して Prometheus がインストールされていることを想定していますが、Terraform ブループリントはデフォルトの Helm チャートを介して Prometheus エージェントをインストールします。スクレイピングジョブとダッシュボードが一致するようにするには、Prometheus ルールと mixin ダッシュボード構成を更新し、ダッシュボードを Grafana インスタンスにアップロードする必要があります。

## 前提条件

* EKS クラスター - 開始場所: [https://github.com/aws-ia/terraform-aws-eks-blueprints/tree/main/examples/complete-kubernetes-addons](https://github.com/aws-ia/terraform-aws-eks-blueprints/tree/main/examples/)
* Cloud9 環境
* EKS クラスターを管理するように設定された Cloud9 の kubectl
* EKS の IAM 資格情報
* AMP のインスタンス
* Amazon Managed Grafana のインスタンス

## ミックスインダッシュボードのインストール


Cloud9 インスタンスを新規作成し、テラフォームアドオンの例として AWS ブループリントを使用し、前提条件でリンクされている EKS クラスタをターゲットとします。

Cloud9 インスタンスのファイルシステムを少なくとも 20 GB に拡張します。EC2 コンソールで EBS ボリュームを 20 GB に拡張してから、Cloud9 シェルから以下のコマンドを実行します。

```
sudo growpart /dev/nvme0n1 1
sudo xfs_growfs -d /
```


awscli をバージョン 2 にアップグレードします。

```
sudo yum remove -y awscli
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
ln -s /usr/local/bin/aws /usr/bin/aws
```


前提パッケージをインストールします。

```
sudo yum install -y jsonnet
go install -a github.com/jsonnet-bundler/jsonnet-bundler/cmd/jb@latest
export PATH="$PATH:~/go/bin"
```


kubernetes-mixin プロジェクトの jsonnet ライブラリをダウンロードおよびインストールします。


```
git clone https://github.com/kubernetes-monitoring/kubernetes-mixincd kubernetes-mixin/
jb install
```


Prometheus ジョブ名と一致するように、config.libsonnet を編集し、「selectors」セクションを以下のように置き換えます。

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



Prometheus ルール、アラート、Grafana ダッシュボードをビルドします。

```
make prometheus_alerts.yaml
make prometheus_rules.yaml
make dashboards_out
```


Prometheus ルールを Managed Prometheus にアップロードします。&lt;<workspace-id>> を Managed Prometheus インスタンスの ID に、&lt;<region>> を適切な値に置き換えます。

```
base64 prometheus_rules.yaml > prometheus_rules.b64
aws amp create-rule-groups-namespace --data file://prometheus_rules.b64 --name kubernetes-mixin  --workspace-id <<WORKSPACE-ID> --region <<REGION>>
```



Cloud9 環境から「dashboard_out」フォルダの内容をダウンロードし、Grafana Web UI を使用してアップロードします。

</region></workspace-id></region></workspace-id>
