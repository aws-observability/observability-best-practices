組織は、従来のデスクトップソリューションを置き換え、ラップトップやデスクトップの維持にかかるコストと労力をクラウドの従量課金モデルに移行するソリューション (DAAS) として、クラウドベースの仮想デスクトップである [Amazon Workspaces](https://docs.aws.amazon.com/ja_jp/workspaces/latest/adminguide/amazon-workspaces.html) の採用を開始しています。Amazon Workspaces を使用する組織は、Day 2 運用のために Workspaces 環境を監視するためのこれらのマネージドサービスのサポートを必要とします。Amazon Managed Service for Prometheus や Amazon Managed Grafana のようなクラウドベースのマネージドオープンソース監視ソリューションは、IT チームが迅速に監視ソリューションをセットアップし、運用してコストを削減するのに役立ちます。Amazon Workspace からの CPU、メモリ、ネットワーク、またはディスクアクティビティの監視により、Amazon Workspaces 環境のトラブルシューティング時の推測作業が不要になります。

Amazon Workspaces 環境におけるマネージド監視ソリューションは、以下の組織的利点をもたらします：

* サービスデスクのスタッフは、Amazon Managed Service for Prometheus や Amazon Managed Grafana などのマネージド監視サービスを活用することで、調査が必要な Amazon Workspace の問題を推測作業なしで迅速に特定し、掘り下げることができます
* サービスデスクのスタッフは、Amazon Managed Service for Prometheus の履歴データを使用して、イベント後に Amazon Workspace の問題を調査できます
* Amazon Workspaces の問題について、ビジネスユーザーに質問する時間を無駄にする長い通話を排除します

このブログ記事では、Amazon Workspaces の監視ソリューションを提供するために、Amazon Managed Service for Prometheus、Amazon Managed Grafana、および Amazon Elastic Compute Cloud (EC2) 上の Prometheus サーバーをセットアップします。Active Directory グループポリシーオブジェクト (GPO) を使用して、新しい Amazon Workspace への Prometheus エージェントのデプロイメントを自動化します。

**ソリューションアーキテクチャ**

以下の図は、Amazon Managed Service for Prometheus や Amazon Managed Grafana などの AWS ネイティブのマネージドサービスを使用して Amazon Workspaces 環境を監視するソリューションを示しています。このソリューションでは、Amazon Elastic Compute Cloud (EC2) インスタンス上に Prometheus サーバーをデプロイし、定期的に Amazon Workspace 上の Prometheus エージェントをポーリングし、メトリクスを Amazon Managed Service for Prometheus にリモートライトします。Amazon Managed Grafana を使用して、Amazon Workspaces インフラストラクチャのメトリクスをクエリおよび可視化します。
![Screenshot](prometheus.drawio-dotted.drawio.png)
