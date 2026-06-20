組織は、既存の従来型デスクトップソリューションを置き換え、ノートパソコンやデスクトップの維持にかかるコストと労力をクラウドの従量課金モデルに移行するソリューション (DAAS) として、仮想クラウドベースのデスクトップである [Amazon Workspaces](https://docs.aws.amazon.com/workspaces/latest/adminguide/amazon-workspaces.html) の採用を開始しています。Amazon Workspaces を使用する組織は、Day 2 オペレーションのために Workspaces 環境を監視するこれらのマネージドサービスのサポートが必要になります。Amazon Managed Service for Prometheus や Amazon Managed Grafana などのクラウドベースのマネージド型オープンソース監視ソリューションは、IT チームがコストを削減するために監視ソリューションを迅速にセットアップして運用するのに役立ちます。Amazon Workspace の CPU、メモリ、ネットワーク、またはディスクアクティビティを監視することで、Amazon Workspaces 環境のトラブルシューティング時の推測作業を排除できます。

Amazon Workspaces 環境でマネージド型モニタリングソリューションを使用すると、組織に次のようなメリットがもたらされます。

* サービスデスクスタッフは、Amazon Managed Service for Prometheus や Amazon Managed Grafana などのマネージド監視サービスを活用することで、推測に頼ることなく、調査が必要な Amazon Workspace の問題を迅速に特定してドリルダウンできます
* サービスデスクスタッフは、Amazon Managed Service for Prometheus の履歴データを使用して、イベント発生後に Amazon Workspace の問題を調査できます
* Amazon Workspaces の問題についてビジネスユーザーに質問する時間の無駄な長電話を排除します

このブログ投稿では、Amazon Managed Service for Prometheus、Amazon Managed Grafana、および Amazon Elastic Compute Cloud (EC2) 上の Prometheus サーバーをセットアップして、Amazon Workspaces の監視ソリューションを提供します。Active Directory グループポリシーオブジェクト (GPO) を使用して、新しい Amazon Workspace への Prometheus エージェントのデプロイを自動化します。

**ソリューションアーキテクチャ**

次の図は、Amazon Managed Service for Prometheus や Amazon Managed Grafana などの AWS ネイティブマネージドサービスを使用して Amazon Workspaces 環境を監視するソリューションを示しています。このソリューションは、Amazon Elastic Compute Cloud (EC2) インスタンス上に Prometheus サーバーをデプロイし、Amazon Workspace 上の prometheus エージェントを定期的にポーリングして、メトリクスを Amazon Managed Service for Prometheus にリモート書き込みします。Amazon Managed Grafana を使用して、Amazon Workspaces インフラストラクチャのメトリクスをクエリおよび可視化します。
![Screenshot](prometheus.drawio-dotted.drawio.png)