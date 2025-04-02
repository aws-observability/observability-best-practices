# AWS Observability サービスとコスト

オブザーバビリティスタックに投資する際は、オブザーバビリティ製品の **コスト** を定期的に監視することが重要です。
これにより、必要なコストのみを発生させ、不要なリソースに過剰な支出をしていないことを確認できます。




## AWS コスト最適化ツール

多くの組織は、クラウド上の IT インフラストラクチャのスケーリングに重点を置いていますが、通常、実際のクラウドコストや今後のクラウドコストについて、管理されていない、準備ができていない、または認識されていない状態です。
時間の経過とともにコストを追跡、レポート、分析するために、AWS はいくつかのコスト最適化ツールを提供しています。

[AWS Cost Explorer][cost-explorer] – 時間の経過とともに AWS の支出パターンを確認し、将来のコストを予測し、さらなる調査が必要な領域を特定し、リザーブドインスタンスの使用率を観察し、リザーブドインスタンスのカバレッジを観察し、リザーブドインスタンスの推奨事項を受け取ることができます。

[AWS Cost and Usage Report(CUR)][CUR] – アカウント全体の AWS の時間単位の使用状況を詳細に示す生データファイルで、DIY（Do-It-Yourself）分析に使用されます。AWS Cost and Usage Report には、使用しているサービスに応じて動的に列が生成されます。



## アーキテクチャの概要：AWS コストと使用状況レポートの可視化

Amazon Managed Grafana または Amazon QuickSight で AWS のコストと使用状況のダッシュボードを構築できます。以下のアーキテクチャ図は、両方のソリューションを示しています。

![Architecture diagram](../../../images/cur-architecture.png)
*アーキテクチャ図*



## Cloud Intelligence Dashboards

[Cloud Intelligence Dashboards][cid] は、AWS Cost and Usage Report (CUR) を基に構築された [Amazon QuickSight][quicksight] ダッシュボードのコレクションです。これらのダッシュボードは、独自のコスト管理と最適化 (FinOps) ツールとして機能します。詳細で粒度の高い、推奨事項に基づいたダッシュボードにより、AWS の使用状況とコストの詳細な把握が可能になります。




### 実装

1.	[Amazon Athena][amazon-athnea] との統合を有効にした [CUR レポート][cur-report] を作成します。  
*初期設定時、AWS が Amazon S3 バケットにレポートの配信を開始するまでに最大 24 時間かかる場合があります。レポートは 1 日 1 回配信されます。Cost and Usage Reports と Athena の統合を合理化および自動化するために、AWS は Athena 統合用に設定したレポートとともに、いくつかの重要なリソースを含む AWS CloudFormation テンプレートを提供しています。*

2.	[AWS CloudFormation テンプレート][cloudformation] をデプロイします。  
*このテンプレートには、AWS Glue クローラー、AWS Glue データベース、AWS Lambda イベントが含まれています。この時点で、CUR データは Amazon Athena のテーブルを通じてクエリ可能になります。*  

    - [Amazon Athena][athena-query] を使用して CUR データに対して直接クエリを実行します。  
*データに対して Athena クエリを実行するには、まず Athena コンソールを使用して AWS がデータを更新しているかどうかを確認し、その後 Athena コンソールでクエリを実行します。*

3.	Cloud Intelligence ダッシュボードをデプロイします。
    - 手動デプロイについては、AWS Well-Architected の **[コスト最適化ラボ][cost-optimization-lab]** を参照してください。
    - 自動デプロイについては、[GitHub リポジトリ][GitHub-repo] を参照してください。

Cloud Intelligence ダッシュボードは、財務チーム、エグゼクティブ、IT マネージャーに最適です。しかし、お客様からよくある質問の 1 つは、Amazon CloudWatch、AWS X-Ray、Amazon Managed Service for Prometheus、Amazon Managed Grafana などの個々の AWS オブザーバビリティ製品の組織全体のコストについての洞察を得る方法です。

次のセクションでは、これらの各製品のコストと使用状況について詳しく説明します。あらゆる規模の企業が、パフォーマンスへの影響や運用上のオーバーヘッドなしに、このプロアクティブなクラウドコスト最適化戦略を採用し、クラウドコスト分析とデータ駆動型の意思決定を通じてビジネス効率を向上させることができます。


[cost-explorer]: https://docs.aws.amazon.com/ja_jp/awsaccountbilling/latest/aboutv2/ce-what-is.html
[CUR]: https://docs.aws.amazon.com/ja_jp/cur/latest/userguide/what-is-cur.html
[cid]: https://wellarchitectedlabs.com/cost/200_labs/200_cloud_intelligence/
[quicksight]: https://aws.amazon.com/jp/quicksight/
[cur-report]: https://docs.aws.amazon.com/ja_jp/cur/latest/userguide/cur-create.html
[amazon-athnea]: https://aws.amazon.com/jp/athena/
[cloudformation]: https://docs.aws.amazon.com/ja_jp/cur/latest/userguide/use-athena-cf.html
[athena-query]: https://docs.aws.amazon.com/ja_jp/cur/latest/userguide/cur-ate-run.html
[cost-optimization-lab]: https://www.wellarchitectedlabs.com/cost/200_labs/200_cloud_intelligence/
[GitHub-repo]: https://github.com/aws-samples/aws-cudos-framework-deployment
