組織は、既存の従来のデスクトップソリューションをクラウドのペイアスユーゴー型モデルに移行し、ラップトップやデスクトップのメンテナンスコストと労力を転嫁するソリューション(DAAS)として、[Amazon Workspaces](https://docs.aws.amazon.com/workspaces/latest/adminguide/amazon-workspaces.html) を仮想クラウドベースのデスクトップとして採用し始めています。 Amazon Workspaces を使用する組織は、これらのマネージドサービスのサポートが必要になり、デイ 2 オペレーションの Workspaces 環境を監視するでしょう。 Amazon Managed Service for Prometheus や Amazon Managed Grafana などのクラウドベースのオープンソース監視ソリューションは、IT チームが迅速に監視ソリューションのセットアップと運用を行い、コストを節約するのに役立ちます。 Amazon Workspace からの CPU、メモリ、ネットワーク、ディスクアクティビティを監視することで、Amazon Workspaces 環境のトラブルシューティング時の推測作業が不要になります。

Amazon Workspaces 環境でのマネージド監視ソリューションによって、以下のような組織的メリットが得られます。

* サービスデスクスタッフは、Amazon Managed Service for Prometheus や Amazon Managed Grafana などのマネージド監視サービスを活用することで、調査が必要な Amazon Workspace の問題をすぐに特定し、推測することなくドリルダウンできます。
* サービスデスクスタッフは、Amazon Managed Service for Prometheus の履歴データを使用して、イベント後に Amazon Workspace の問題を調査できます。 
* Amazon Workspaces の問題についてビジネスユーザーに時間のかかる質問をする必要がなくなります。


このブログ記事では、Amazon Workspaces の監視ソリューションを提供するために、Amazon Managed Service for Prometheus、Amazon Managed Grafana、Amazon Elastic Compute Cloud(EC2)上の Prometheus サーバーを設定します。 アクティブディレクトリのグループポリシーオブジェクト(GPO)を使用して、新しい Amazon Workspace 上の Prometheus エージェントを自動的にデプロイします。

**ソリューションアーキテクチャ**

次の図は、Amazon Managed Service for Prometheus や Amazon Managed Grafana などの AWS ネイティブマネージドサービスを使用して Amazon Workspaces 環境を監視するソリューションを示しています。 このソリューションでは、定期的に Amazon Workspace 上の prometheus エージェントをポーリングし、メトリクスを Amazon Managed Service for Prometheus にリモートライトする Amazon Elastic Compute Cloud(EC2)インスタンス上に Prometheus サーバーをデプロイします。 Amazon Workspaces インフラストラクチャ上のメトリクスをクエリおよび視覚化するために Amazon Managed Grafana を使用します。
![Screenshot](prometheus.drawio-dotted.drawio.png)
