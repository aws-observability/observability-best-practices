組織は、従来のデスクトップソリューションを置き換え、ラップトップやデスクトップのメンテナンスコストと手間をクラウドの従量課金モデルに移行するソリューション (DAAS) として、[Amazon Workspaces](https://docs.aws.amazon.com/ja_jp/workspaces/latest/adminguide/amazon-workspaces.html) を仮想クラウドベースのデスクトップとして採用し始めています。Amazon Workspaces を利用する組織は、Day 2 オペレーションのためにこれらのマネージドサービスのサポートが必要になります。Amazon Managed Service for Prometheus や Amazon Managed Grafana などのクラウドベースのマネージド オープンソース モニタリングソリューションを利用すれば、IT チームはコストを節約しながらモニタリングソリューションを素早く設定して運用できます。Amazon Workspace の CPU、メモリ、ネットワーク、ディスク アクティビティをモニタリングすれば、Amazon Workspaces 環境のトラブルシューティング時の推測を排除できます。

Amazon Workspaces 環境でマネージドモニタリングソリューションを利用すると、組織に次のようなメリットがあります。

* サービスデスク担当者は、Amazon Managed Service for Prometheus や Amazon Managed Grafana などのマネージドモニタリングサービスを活用することで、推測作業なしで調査が必要な Amazon Workspace の問題を素早く特定して掘り下げることができます。
* サービスデスク担当者は、Amazon Managed Service for Prometheus の履歴データを使って、イベント発生後に Amazon Workspace の問題を調査できます。
* Amazon Workspaces の問題について、ビジネスユーザーに無駄な質問をする長い電話をなくすことができます。

この投稿では、Amazon Managed Service for Prometheus、Amazon Managed Grafana、および Amazon Elastic Compute Cloud (EC2) 上の Prometheus サーバーを設定し、Amazon Workspaces 向けのモニタリングソリューションを提供します。Active Directory Group Policy Objects (GPO) を使って、新しい Amazon Workspace に Prometheus エージェントを自動的にデプロイします。

**ソリューションアーキテクチャ**

次の図は、Amazon Managed Service for Prometheus や Amazon Managed Grafana などの AWS ネイティブマネージドサービスを使って Amazon Workspaces 環境を監視するソリューションを示しています。このソリューションでは、Amazon Elastic Compute Cloud (EC2) インスタンス上に Prometheus サーバーをデプロイし、定期的に Amazon Workspace 上の Prometheus エージェントからメトリクスを収集し、Amazon Managed Service for Prometheus にリモート書き込みします。Amazon Managed Grafana を使って、Amazon Workspaces インフラストラクチャのメトリクスを照会し可視化します。
![Screenshot](prometheus.drawio-dotted.drawio.png)
