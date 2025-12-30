# Managed Grafana に [**kubernetes-mixin**](https://github.com/kubernetes-monitoring/kubernetes-mixin) ダッシュボードを追加する

マネージドサービスであっても、EKS は Kubernetes コントロールプレーンから多くのメトリクスを公開しています。Prometheus コミュニティは、これらのメトリクスを確認および調査するための一連のダッシュボードをまとめています。このドキュメントでは、Amazon Managed Service for Prometheus でホストされる環境にそれらをインストールする方法を説明します。

Prometheus mixin プロジェクトは、Prometheus が Prometheus Operator 経由でインストールされることを想定していますが、Terraform ブループリントはデフォルトの helm チャートを使用して Prometheus エージェントをインストールします。スクレイピングジョブとダッシュボードを整合させるために、Prometheus ルールと mixin ダッシュボード設定を更新してから、ダッシュボードを Grafana インスタンスにアップロードする必要があります。


## 前提条件

* EKS クラスター - 開始点: [https://github.com/aws-ia/terraform-aws-eks-blueprints/tree/main/examples/complete-kubernetes-addons](https://github.com/aws-ia/terraform-aws-eks-blueprints/tree/main/)
* Cloud9 環境
* EKS クラスターを管理するように設定された Cloud9 の kubectl
* EKS 用の IAM 認証情報
* AMP のインスタンス
* Amazon Managed Grafana のインスタンス


## mixin ダッシュボードのインストール


新しい Cloud9 インスタンスから開始し、前提条件にリンクされている terraform complete addon example の AWS ブループリントをターゲット EKS クラスターとして使用します。

Cloud9 インスタンスのファイルシステムを少なくとも 20 GB に拡張します。EC2 コンソールで EBS ボリュームを 20 GB に拡張してから、Cloud9 シェルで以下のコマンドを実行します。

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


前提条件をインストールします。

```
sudo yum install -y jsonnet
go install -a github.com/jsonnet-bundler/jsonnet-bundler/cmd/jb@latest
export PATH="$PATH:~/go/bin"
```


kubernetes-mixin プロジェクト用の jsonnet ライブラリをダウンロードしてインストールします。


```
git clone https://github.com/kubernetes-monitoring/kubernetes-mixincd kubernetes-mixin/
jb install
```


config.libsonnet を編集し、prometheus ジョブ名と一致するように「selectors」セクションを次のように置き換えます。

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



prometheus ルール、アラート、および grafana ダッシュボードをビルドします。

```
make prometheus_alerts.yaml
make prometheus_rules.yaml
make dashboards_out
```


prometheus ルールを managed prometheus にアップロードします。"WORKSPACE-ID" を managed prometheus インスタンスの ID に、"REGION" を適切な値に置き換えてください

```
base64 prometheus_rules.yaml > prometheus_rules.b64
aws amp create-rule-groups-namespace --data file://prometheus_rules.b64 --name kubernetes-mixin  --workspace-id <<WORKSPACE-ID> --region <<REGION>>
```



Cloud9 環境から 'dashboard_out' フォルダの内容をダウンロードし、Grafana の Web UI を使用してアップロードします。
