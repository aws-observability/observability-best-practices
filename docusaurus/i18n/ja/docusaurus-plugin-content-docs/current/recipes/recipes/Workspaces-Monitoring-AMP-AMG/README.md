組織は、従来のデスクトップソリューションを置き換えるクラウドベースの仮想デスクトップソリューション (DaaS) として、[Amazon Workspaces](https://docs.aws.amazon.com/ja_jp/workspaces/latest/adminguide/amazon-workspaces.html) を採用し始めています。これにより、ラップトップやデスクトップの維持管理にかかるコストと労力を、クラウドの従量課金モデルに移行できます。Amazon Workspaces を使用する組織は、Day 2 運用のために Workspaces 環境を監視するためのマネージドサービスのサポートを必要とします。Amazon Managed Service for Prometheus や Amazon Managed Grafana などのクラウドベースのマネージド型オープンソース監視ソリューションは、IT チームが迅速に監視ソリューションを構築・運用してコストを削減するのに役立ちます。Amazon Workspace からの CPU、メモリ、ネットワーク、ディスクアクティビティを監視することで、Amazon Workspaces 環境のトラブルシューティングにおける推測作業を排除できます。

Amazon Workspaces 環境におけるマネージド監視ソリューションは、以下のような組織的なメリットをもたらします：

* サービスデスクのスタッフは、Amazon Managed Service for Prometheus や Amazon Managed Grafana などのマネージド監視サービスを活用することで、調査が必要な Amazon Workspace の問題を推測作業なしで素早く特定し、詳細を確認できます
* サービスデスクのスタッフは、Amazon Managed Service for Prometheus の履歴データを使用して、イベント発生後に Amazon Workspace の問題を調査できます
* Amazon Workspaces の問題について、ビジネスユーザーへの質問に時間を費やす長時間の通話を排除できます

このブログ投稿では、Amazon Workspaces の監視ソリューションを提供するために、Amazon Managed Service for Prometheus、Amazon Managed Grafana、および Amazon Elastic Compute Cloud (EC2) 上の Prometheus サーバーをセットアップします。Active Directory グループポリシーオブジェクト (GPO) を使用して、新しい Amazon Workspace への Prometheus エージェントのデプロイを自動化します。

**ソリューションアーキテクチャ**

以下の図は、Amazon Managed Service for Prometheus や Amazon Managed Grafana などの AWS ネイティブのマネージドサービスを使用して Amazon Workspaces 環境を監視するソリューションを示しています。このソリューションでは、Amazon Elastic Compute Cloud (EC2) インスタンス上に Prometheus サーバーをデプロイし、定期的に Amazon Workspace 上の Prometheus エージェントをポーリングして、メトリクスを Amazon Managed Service for Prometheus にリモート書き込みします。Amazon Managed Grafana を使用して、Amazon Workspaces インフラストラクチャのメトリクスのクエリと可視化を行います。
![Screenshot](prometheus.drawio-dotted.drawio.png)
