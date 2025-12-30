# AWS オブザーバビリティサービスとコスト

Observability スタックに投資する際には、Observability 製品の**コスト**を定期的に監視することが重要です。これにより、必要なコストのみが発生していること、および不要なリソースに過剰な支出をしていないことを確認できます。

## コスト最適化のための AWS ツール

ほとんどの組織の中心的な焦点は、クラウド上の IT インフラストラクチャの拡張にありますが、通常、実際のクラウド支出や今後のクラウド支出について、制御されておらず、準備ができておらず、認識していません。時間の経過とともにコストを追跡、レポート、分析するために、AWS はいくつかのコスト最適化ツールを提供しています。

[AWS Cost Explorer][cost-explorer] – 時間経過に伴う AWS 支出のパターンを確認し、将来のコストを予測し、さらなる調査が必要な領域を特定し、リザーブドインスタンスの使用率を観察し、リザーブドインスタンスのカバレッジを観察し、リザーブドインスタンスの推奨事項を受け取ります。

[AWS Cost and Usage Report(CUR)][CUR] – アカウント全体の時間単位の AWS 使用状況を詳細に記録した粒度の高い生データファイルで、Do-It-Yourself (DIY) 分析に使用されます。AWS Cost and Usage Report には、使用するサービスに応じて入力される動的な列があります。

## アーキテクチャ概要: AWS Cost and Usage Report の可視化

Amazon Managed Grafana または Amazon QuickSight で AWS のコストと使用状況のダッシュボードを構築できます。次のアーキテクチャ図は、両方のソリューションを示しています。

![Architecture diagram](../../../images/cur-architecture.png)
*アーキテクチャ図*

## Cloud Intelligence Dashboards

[Cloud Intelligence Dashboards][cid] は、AWS Cost and Usage report (CUR) 上に構築された [Amazon QuickSight][quicksight] ダッシュボードのコレクションです。これらのダッシュボードは、独自のコスト管理と最適化 (FinOps) ツールとして機能します。詳細で粒度が細かく、推奨事項に基づいたダッシュボードを利用でき、AWS の使用状況とコストの詳細なビューを取得できます。

### 実装

1. [Amazon Athena][amazon-athnea] 統合を有効にした [CUR レポート][cur-report]を作成します。  
*初期設定中、AWS が Amazon S3 バケットへのレポート配信を開始するまでに最大 24 時間かかる場合があります。レポートは 1 日 1 回配信されます。Cost and Usage Reports と Athena の統合を効率化および自動化するために、AWS は、Athena 統合用に設定したレポートとともに、いくつかの主要なリソースを含む AWS CloudFormation テンプレートを提供しています。*

2. [AWS CloudFormation テンプレート][cloudformation]をデプロイします。  
*このテンプレートには、AWS Glue クローラー、AWS Glue データベース、および AWS Lambda イベントが含まれています。この時点で、CUR データは Amazon Athena のテーブルを通じて利用可能になり、クエリを実行できます。*

- CUR データに対して直接 [Amazon Athena][athena-query] クエリを実行します。  
*データに対して Athena クエリを実行するには、まず Athena コンソールを使用して AWS がデータを更新しているかどうかを確認し、次に Athena コンソールでクエリを実行します。*

3. Cloud Intelligence ダッシュボードをデプロイします。
    - 手動デプロイの場合は、AWS Well-Architected **[Cost Optimization lab][cost-optimization-lab]** を参照してください。
    - 自動デプロイの場合は、[GitHub repo][GitHub-repo] を参照してください。

Cloud Intelligence ダッシュボードは、財務チーム、経営幹部、IT マネージャーにとって優れたツールです。しかし、お客様からよくいただく質問の 1 つは、Amazon CloudWatch、AWS X-Ray、Amazon Managed Service for Prometheus、Amazon Managed Grafana などの個々の AWS Observability 製品の組織全体のコストに関するインサイトを得る方法です。

次のセクションでは、これらの各製品のコストと使用状況について詳しく説明します。あらゆる規模の企業が、パフォーマンスへの影響や運用上のオーバーヘッドなしに、クラウドコスト分析とデータ駆動型の意思決定を通じて、このプロアクティブなクラウドコスト最適化戦略を採用し、ビジネス効率を向上させることができます。


[cost-explorer]: https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/ce-what-is.html
[CUR]: https://docs.aws.amazon.com/cur/latest/userguide/what-is-cur.html
[cid]: https://wellarchitectedlabs.com/cost/200_labs/200_cloud_intelligence/
[quicksight]: https://aws.amazon.com/quicksight/
[cur-report]: https://docs.aws.amazon.com/cur/latest/userguide/cur-create.html
[amazon-athnea]: https://aws.amazon.com/athena/
[cloudformation]: https://docs.aws.amazon.com/cur/latest/userguide/use-athena-cf.html
[athena-query]: https://docs.aws.amazon.com/cur/latest/userguide/cur-ate-run.html
[cost-optimization-lab]: https://www.wellarchitectedlabs.com/cost/200_labs/200_cloud_intelligence/
[GitHub-repo]: https://github.com/aws-samples/aws-cudos-framework-deployment






