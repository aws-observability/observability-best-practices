# Managed Grafana に [**kubernetes-mixin**](https://github.com/kubernetes-monitoring/kubernetes-mixin) ダッシュボードを追加する

マネージドサービスであっても、EKS は Kubernetes コントロールプレーンからの多くのメトリクスを公開しています。Prometheus コミュニティはこれらのメトリクスを確認・調査するためのダッシュボードシリーズを作成しています。このドキュメントでは、Amazon Managed Service for Prometheus でホストされている環境にそれらをインストールする方法を示します。

Prometheus mixin プロジェクトは、Prometheus Operator を介して Prometheus がインストールされることを前提としていますが、Terraform ブループリントではデフォルトの Helm チャートを介して Prometheus エージェントをインストールします。スクレイピングジョブとダッシュボードを合わせるために、Prometheus ルールと mixin ダッシュボード設定を更新し、ダッシュボードを Grafana インスタンスにアップロードする必要があります。

## 前提条件

* EKS クラスター - 開始点: [https://github.com/aws-ia/terraform-aws-eks-blueprints/tree/main/examples/complete-kubernetes-addons](https://github.com/aws-ia/terraform-aws-eks-blueprints/tree/main/)
* Cloud9 環境
* Cloud9 で EKS クラスターを管理するように設定された kubectl
* EKS 用の IAM 認証情報
* AMP のインスタンス
* Amazon Managed Grafana のインスタンス

## mixin ダッシュボードのインストール

新しい Cloud9 インスタンスから始め、前提条件でリンクされている EKS クラスターを Terraform の完全な addon 例のターゲットとして使用します。

Cloud9 インスタンスのファイルシステムを少なくとも 20GB に拡張します。EC2 コンソールで EBS ボリュームを 20GB に拡張し、Cloud9 シェルから以下のコマンドを実行します。

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

config.libsonnet を編集し、Prometheus ジョブ名と一致するように "selectors" セクションを以下のように置き換えます。

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

Prometheus のルール、アラート、Grafana ダッシュボードをビルドします。

```
make prometheus_alerts.yaml
make prometheus_rules.yaml
make dashboards_out
```

Managed Prometheus にプロメテウスルールをアップロードします。"WORKSPACE-ID" を Managed Prometheus インスタンスの ID に、"REGION" を適切な値に置き換えてください。

```
base64 prometheus_rules.yaml > prometheus_rules.b64
aws amp create-rule-groups-namespace --data file://prometheus_rules.b64 --name kubernetes-mixin  --workspace-id <<WORKSPACE-ID> --region <<REGION>>
```

Cloud9 環境から 'dashboard_out' フォルダの内容をダウンロードし、Grafana Web UI を使ってアップロードします。
</region></workspace-id>
