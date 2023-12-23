組織は、既存の従来のデスクトップソリューションを置き換え、ラップトップとデスクトップのメンテナンスコストと労力をクラウドのペイアズユーゴー型モデルに移行するソリューション(DAAS)として、[Amazon Workspaces](https://docs.aws.amazon.com/workspaces/latest/adminguide/amazon-workspaces.html) を仮想クラウドベースのデスクトップとして採用し始めています。 Amazon Workspaces を使用している組織は、これらのマネージドサービスのサポートが必要になり、Day 2 オペレーションの Workspaces 環境を監視できるようになります。 Amazon Managed Service for Prometheus や Amazon Managed Grafana などのクラウドベースのマネージドオープンソースモニタリングソリューションは、IT チームが迅速にモニタリングソリューションを設定し運用できるようにし、コストを節約できます。 Amazon Workspace からの CPU、メモリ、ネットワーク、ディスクアクティビティのモニタリングにより、Amazon Workspaces 環境のトラブルシューティング時の推測作業がなくなります。

Amazon Workspaces 環境でのマネージドモニタリングソリューションにより、以下のような組織的メリットが得られます。

* サービスデスクスタッフは、Amazon Managed Service for Prometheus や Amazon Managed Grafana などのマネージドモニタリングサービスを活用することで、調査が必要な Amazon Workspace の問題をすぐに特定し、推測することなくドリルダウンできます。
* サービスデスクスタッフは、Amazon Managed Service for Prometheus の履歴データを使用して、イベント発生後に Amazon Workspace の問題を調査できます。 
* Amazon Workspaces の問題についてビジネスユーザーに時間のかかる質問をする必要がなくなり、時間の無駄がなくなります。


このブログ記事では、Amazon Workspaces のモニタリングソリューションを提供するために、Amazon Managed Service for Prometheus、Amazon Managed Grafana、Amazon Elastic Compute Cloud(EC2) 上の Prometheus サーバーを設定します。 新しい Amazon Workspace での Prometheus エージェントの自動デプロイに Active Directory グループ ポリシー オブジェクト(GPO)を使用します。

**ソリューションアーキテクチャ**

次の図は、Amazon Managed Service for Prometheus や Amazon Managed Grafana などの AWS ネイティブのマネージドサービスを使用して Amazon Workspaces 環境を監視するソリューションを示しています。 このソリューションでは、Amazon Elastic Compute Cloud(EC2)インスタンス上に Prometheus サーバーをデプロイし、定期的に Amazon Workspace 上の Prometheus エージェントにポーリングを行い、メトリクスを Amazon Managed Service for Prometheus にリモートライトします。 Amazon Managed Grafana を使用して、Amazon Workspaces インフラストラクチャ上のメトリクスをクエリおよび可視化します。
![Screenshot](prometheus.drawio-dotted.drawio.png)
