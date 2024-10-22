# AWS Observability サービスとコスト

Observability スタックに投資する際は、Observability 製品の **コスト** を定期的に監視することが重要です。これにより、必要なコストのみを発生させ、不要なリソースに過剰な支出をしていないことを確認できます。

## AWS のコスト最適化ツール

ほとんどの組織の中核的な焦点は、クラウド上の IT インフラストラクチャのスケーリングにあります。しかし、通常は実際の、または今後のクラウド支出を制御、準備、認識できていません。時間の経過に伴うコストを追跡、報告、分析するのに役立つため、AWS はいくつかのコスト最適化ツールを提供しています。

[AWS Cost Explorer][cost-explorer] - 時間の経過に伴う AWS 支出のパターンを確認し、将来のコストを予測し、さらなる調査が必要な領域を特定し、Reserved Instance の利用状況を観察し、Reserved Instance の適用範囲を観察し、Reserved Instance の推奨事項を受け取ることができます。

[AWS Cost and Usage Report(CUR)][CUR] - アカウント全体での時間単位の AWS 利用状況の詳細な生データファイルで、自分で分析するための (DIY) 分析に使用されます。AWS Cost and Usage Report には、使用するサービスに応じて動的に列が設定されます。

## アーキテクチャの概要: AWS Cost and Usage Report の可視化

Amazon Managed Grafana または Amazon QuickSight で、AWS コストと使用状況のダッシュボードを構築できます。
次のアーキテクチャ図は、両方のソリューションを示しています。

![Architecture diagram](../../../images/cur-architecture.png)
*アーキテクチャ図*

## クラウドインテリジェンスダッシュボード

[クラウドインテリジェンスダッシュボード][cid] は、AWS コストと使用状況レポート (CUR) に基づいて構築された [Amazon QuickSight][quicksight] ダッシュボードのコレクションです。これらのダッシュボードは、コスト管理と最適化 (FinOps) ツールとして機能します。詳細で粒度の細かい、推奨に基づいたダッシュボードを提供し、AWS の使用状況とコストの詳細な状況を把握できます。

### 実装

1. [Amazon Athena][amazon-athnea] との統合が有効になっている [CUR レポート][cur-report] を作成します。
*初期設定中、AWS がレポートを Amazon S3 バケットに配信するまでに最大 24 時間かかる可能性があります。レポートは 1 日に 1 回配信されます。AWS は、Athena との統合のために設定したレポートと共に、主要なリソースを含む AWS CloudFormation テンプレートを提供しており、Cost and Usage Reports と Athena の統合をストリームライン化し、自動化できます。*

2. [AWS CloudFormation テンプレート][cloudformation] をデプロイします。
*このテンプレートには、AWS Glue クロウラー、AWS Glue データベース、AWS Lambda イベントが含まれています。この時点で、CUR データが Amazon Athena のテーブルを通じて利用可能になり、クエリを実行できるようになります。*

    - CUR データに対して直接 [Amazon Athena][athena-query] クエリを実行します。
*データに対して Athena クエリを実行するには、まず Athena コンソールで AWS がデータを更新しているかを確認し、次に Athena コンソールでクエリを実行します。*

3. Cloud Intelligence ダッシュボードをデプロイします。
    - 手動デプロイの場合は、AWS Well-Architected **[Cost Optimization ラボ][cost-optimization-lab]** を参照してください。
    - 自動デプロイの場合は、[GitHub リポジトリ][GitHub-repo] を参照してください。

Cloud Intelligence ダッシュボードは、財務チーム、経営陣、IT マネージャーに最適です。しかし、お客様から頻繁に寄せられる質問の 1 つは、Amazon CloudWatch、AWS X-Ray、Amazon Managed Service for Prometheus、Amazon Managed Grafana などの個々の AWS Observability 製品の組織全体でのコストについての洞察を得る方法です。

次のセクションでは、これらの製品それぞれのコストと使用状況について詳しく説明します。どのような規模の企業でも、このプロアクティブなクラウドコスト最適化戦略を採用し、パフォーマンスへの影響やオペレーショナルオーバーヘッドなしでクラウドコスト分析とデータ主導の意思決定を通じてビジネス効率を改善できます。
