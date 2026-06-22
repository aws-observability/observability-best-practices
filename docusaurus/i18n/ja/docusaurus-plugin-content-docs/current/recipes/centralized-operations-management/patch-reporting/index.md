---
sidebar_position: 1
---
# 一元化されたパッチコンプライアンスレポート

## パッチコンプライアンスとは何ですか？

パッチコンプライアンスとは、組織のポリシーに従って、すべてのコンピューティングリソースに最新のセキュリティアップデートとバグ修正が適用されていることを確認するプロセスです。パッチベースラインで定義されたすべての必須パッチが正常に適用されている場合、システムは「パッチコンプライアント」とみなされます。コンプライアンスに準拠していないシステムには、重要なセキュリティアップデートが適用されていない可能性があり、悪意のある攻撃者に悪用される可能性のあるセキュリティ脆弱性に組織がさらされるリスクがあります。

複数の AWS アカウントとリージョンにまたがる現代のクラウド環境では、分散化されたパッチ管理により、可視性のギャップ、一貫性のないレポート、脆弱性への対応の遅延、複雑な監査プロセス、チーム間での作業の重複など、重大な課題が生じます。これらの課題は、組織全体でセキュリティリスクへの露出が長期化し、リソースの非効率な使用につながる可能性があります。

集中型パッチコンプライアンスレポートは、すべてのアカウントとリージョンのデータを単一の場所に統合し、セキュリティ体制の包括的なビューを提供することで、これらの課題に対処します。このアプローチは、コンプライアンスステータスの単一の信頼できる情報源、脆弱性のリアルタイム把握、環境全体にわたる一貫したメトリクス、簡素化された監査、トレンド分析機能、リソース効率の向上、および自動修復ワークフローの基盤など、多くのメリットをもたらします。

AWS Systems Manager は、パッチプロセスを自動化する Patch Manager、コンプライアンスデータを中央の S3 バケットに集約する[リソースデータ同期](https://docs.aws.amazon.com/systems-manager/latest/userguide/inventory-create-resource-data-sync.html)、そしてデータを変換・クエリ・可視化する AWS Glue、Amazon Athena、Amazon QuickSight などの分析サービスを通じて、この一元化の基盤を提供します。このレシピで説明するソリューションは、これらのコンポーネントを活用して、AWS 組織全体にわたる包括的なレポートシステムを構築し、より効率的な運用と迅速な脆弱性修復を実現します。

:::tip
リソースデータ同期は、JSON ファイルの形式でインベントリおよびパッチコンプライアンスのメタデータを提供します。Athena と QuickSight を使用する代替手段として、S3 バケットからデータを取得できる任意の BI またはアナリティクスツールを使用することができます。
:::

## 目的

このレシピの目的は、集中型パッチコンプライアンスレポートに必要なリソースをプロビジョニングするために使用できる CloudFormation テンプレートのサンプルを提供することです。このレシピでは、パッチスキャンまたはインストール操作のデプロイについては説明しません。

マネージドノードのパッチ適用の準備方法の詳細については、[AWS Systems Manager とタグ付けを使用したマネージドノードのパッチ適用](/guides/centralized-operations-management/patch-nodes-using-tags/)を参照してください。

## 前提条件

デプロイを開始する前に、以下を確認してください。

* AWS Organizations のセットアップ: 管理アカウントとメンバーアカウントを持つ、適切に設定された AWS Organization。
* マネージドノードの設定: パッチ操作を実行してパッチコンプライアンスをレポートするには、Amazon Elastic Compute Cloud (EC2) インスタンス、AWS Internet of Things (IoT) Greengrass コアデバイス、オンプレミスサーバー、エッジデバイス、および VM が Systems Manager マネージドノードである必要があります。
* パッチ操作の実装: 少なくとも、パッチスキャン操作を設定して 1 回以上実行する必要があります。これを行わないと、レポートするコンプライアンスデータが存在しません。さまざまな種類のパッチ適用とその実装方法の詳細については、[パッチ管理ベストプラクティスガイド](/guides/centralized-operations-management/patch-management)および[さまざまな種類のパッチ適用](/guides/centralized-operations-management/patch-management#さまざまな種類のパッチ適用)のセクションを参照してください。
* IAM アクセス許可: CloudFormation テンプレートをデプロイし、中央レポートアカウントとメンバーアカウントの両方で必要なリソースを作成するための適切なアクセス許可。
* Amazon QuickSight: QuickSight を使用してパッチコンプライアンス情報を可視化するには、[QuickSight にサインアップ](https://docs.aws.amazon.com/quicksight/latest/user/signing-up.html)する必要があります。
* Amazon QuickSight の S3 へのアクセス許可: [フェーズ 1: 中央アカウントのセットアップ](#フェーズ-1-中央アカウントのセットアップ)で作成された S3 バケットへのアクセス許可が QuickSight に付与されていることを確認する必要があります。詳細については、[QuickSight 用 CloudFormation テンプレートをデプロイする前に完了すべき前提条件](#quicksight-の-cloudformation-テンプレートをデプロイする前に完了すべき前提条件)を参照してください。

## 考慮事項

### リソースデータ同期

現在、AWS CloudFormation の `AWS::SSM::ResourceDataSync` リソースは、[S3Destination](https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-properties-ssm-resourcedatasync-s3destination.html) プロパティ内の `DestinationDataSharing` プロパティをサポートしていません。このプロパティは、簡略化された S3 バケットポリシーをサポートするインベントリリソースデータ同期を作成するために必要です。

このため、このレシピでは [組織リソースデータ同期のサンプル CloudFormation テンプレート](#組織リソースデータ同期のサンプル-cloudformation-テンプレート) セクションのカスタム CloudFormation リソースを使用して、Lambda 関数でリソースデータ同期を作成します。

リソースデータ同期を作成するためのカスタムリソース使用の代替手段：

1. CloudFormation でサポートされている標準のリソースデータ同期を使用します。
    1. これを実現するには、AWS アカウント ID に基づいてアクセス許可を付与するバケットポリシーを作成して使用する必要があります。詳細とS3 バケットポリシーの例については、[始める前に](https://docs.aws.amazon.com/systems-manager/latest/userguide/inventory-create-resource-data-sync.html#datasync-before-you-begin)を参照してください。
    1. [Athena を使用した集中レポートのサンプル CloudFormation テンプレート](#athena-を使用した集中レポートのサンプル-cloudformation-テンプレート)の S3 バケットポリシーを更新して、AWS アカウント ID を列挙した新しいポリシーを使用します。
    1. CloudFormation StackSets を使用して `AWS::SSM::ResourceDataSync` リソースをデプロイします。CloudFormation リソーススニペットの例については、[SyncToDestination リソースデータ同期の作成](https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-resource-ssm-resourcedatasync.html#aws-resource-ssm-resourcedatasync--examples--Create_a_SyncToDestination_resource_data_sync)を参照してください。
1. AWS CLI やその他の SDK を使用したスクリプトなど、別の方法を使用して組織リソースデータ同期を作成します。

### コストに関する考慮事項

集中型パッチコンプライアンスレポートの実装には、複数の AWS サービスが関与し、それぞれにコストが発生します。

1. [Amazon S3 の料金](https://aws.amazon.com/s3/pricing/):
    * インベントリおよびパッチコンプライアンスデータの標準ストレージコスト
    * 複数のアカウントおよびリージョンからデータを同期するためのデータ転送コスト
      * コストは管理対象ノード数とスキャン頻度に比例して増加します
1. [AWS Glue の料金](https://aws.amazon.com/glue/pricing/):
    * クローラーのコスト
    * デフォルト設定（毎日のクローラー実行）の場合
1. [Amazon Athena の料金](https://aws.amazon.com/athena/pricing/):
    * クエリのコスト
    * コストはクエリの複雑さと頻度によって異なります
    * パーティション分割とフィルタリングを使用することでコストを大幅に削減できます
1. [AWS Lambda の料金](https://aws.amazon.com/lambda/pricing/):
    * カスタムリソース Lambda 関数の最小コスト
    * ほとんどの実装では、無料利用枠でこの使用量をカバーできます
1. [Amazon QuickSight の料金](https://aws.amazon.com/quicksight/pricing/)（オプション）:
    * 作成者ライセンスおよびリーダーライセンス

## アーキテクチャの概要

### 集中レポートアカウント

以下の図では、**Central Reporting** アカウントは、パッチおよびインベントリメタデータの保存、クエリ、または可視化専用の AWS Organization 内の AWS アカウントです。

:::warning
[AWS Organization 管理アカウント](https://docs.aws.amazon.com/managedservices/latest/userguide/management-account.html)を**セントラルレポートアカウント**として使用することは**推奨されません**。[管理アカウントの AWS ベストプラクティス](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_best-practices_mgmt-acct.html#bp_mgmt-acct_use-mgmt)では、管理アカウントとそのユーザーおよびロールは、そのアカウントのみが実行**しなければならない**タスクに使用することを推奨しています。すべての AWS リソースは組織内の他の AWS アカウントに保存し、管理アカウントには含めないようにしてください。
:::

![Architecture for the central reporting account](/img/cloudops/recipes/central-reporting/architecture-diagram-reporting-account.png "Architecture for the central reporting account")

1. Glue クローラーは 1 日 1 回実行され、リソースデータ同期が提供するメタデータをホストする S3 バケットをクロールします。
1. Glue クローラーは、S3 バケット内のメタデータに基づいてデータベースとテーブルを更新します。
1. Glue クローラーの実行が完了すると、EventBridge にイベントが送信されます。
1. EventBridge ルールが Lambda 関数を呼び出します。
1. Lambda 関数は、AWS:InstanceInformation テーブルの重複列を削除します。
    :::info
    The `AWS:InstanceInformation` という名前の列を含むテーブル `resourcetype`、これはパーティションキーでもあり、Athena クエリが失敗する原因となります。EventBridge ルールは Glue クローラーの実行によってトリガーされ、その後 Lambda 関数を呼び出してその列を削除します。
    :::
1. Athena は、実行するクエリに基づいて Glue データベースとテーブルにクエリを実行します。
1. （オプション）QuickSight ダッシュボードを作成して、パッチコンプライアンス情報を視覚化できます。**注:** QuickSight はサンプルの CloudFormation テンプレートには含まれていません。

### マネージドノードを持つメンバーアカウント/リージョン

![Architecture for the AWS Organization resource data sync](/img/cloudops/recipes/central-reporting/architecture-diagram-ssm-org-resource-data-sync.png "Architecture for the AWS Organization resource data sync")

1. 委任された管理者アカウントの CloudFormation StackSet は、必要なリソースを作成するために、ターゲットの AWS アカウント/リージョンにスタックインスタンスを作成します。
1. スタックインスタンスは、IAM サービスロール、Lambda 関数、およびカスタム CloudFormation リソースを作成します。
1. Lambda 関数は、AWS Organizations 用の Systems Manager リソースデータ同期を作成します。
1. リソースデータ同期は、インベントリおよびパッチコンプライアンスメタデータを[中央レポートアカウント](#集中レポートアカウント)で指定された S3 バケットに送信します。

### プロセスタイムライン

次の図は、マネージドノードのパッチコンプライアンスをクエリするプロセスのタイムラインを示しています。

![Process timeline for patching operations](/img/cloudops/recipes/central-reporting/architecture-diagram-org-patch-reporting-combined.png "Process timeline for patching operations")

1. パッチスキャン、インストール、またはインベントリメタデータ収集操作の後、マネージドノード上の SSM エージェントが Systems Manager にデータを報告します。
1. パッチおよびインベントリメタデータの更新は、実行されたアクションに基づいてリソースデータ同期によって識別されます。
1. リソースデータ同期は、中央レポートアカウントで指定された S3 バケットにメタデータを送信します。
1. その後、操作の結果を Athena を使用してクエリできます。

上記の図に示されているように、パッチ適用またはインベントリメタデータ収集のためにハイブリッドマネージドノードを登録でき、データは EC2 インスタンスと同じ S3 バケットに流れ込みます。

## デプロイ手順

### デプロイチェックリスト

このレシピに含まれるデプロイ手順のチェックリストを以下に示します。

#### 集中レポートアカウントのタスク

* [ ] Athena リソース用の CloudFormation スタックをデプロイする
* [ ] スタックの出力から S3 バケット名を記録する
* [ ] S3 バケットの QuickSight 権限を設定する
* [ ] QuickSight 可視化用の CloudFormation スタックをデプロイする
* [ ] QuickSight 分析へのアクセスを確認する

#### メンバーアカウントのタスク (StackSets 経由)

* [ ] 組織リソースデータ同期 CloudFormation StackSet をデプロイする
* [ ] メンバーアカウントにリソースデータ同期が作成されていることを確認する

### フェーズ 1: 中央アカウントのセットアップ

#### Athena を使用した集中レポートのサンプル CloudFormation テンプレート

以下に、CloudFormation テンプレートによって作成されるリソースとその目的についての詳細を示します。

[Athena を使用した集中レポートのサンプル CloudFormation テンプレート](https://github.com/aws-samples/cloud-operations-best-practices/blob/main/cloud-operations-best-practices/static/cfn-templates/patch-reporting/patch-reporting.yaml)

| リソース名 | 目的 |
| -------- | ------ |
| **KMS リソース** | |
| ManagedInstanceDataEncryptionKey | リソースデータ同期 S3 バケット内のマネージドノードメタデータを暗号化するためのカスタマーマネージドキー (CMK)。 |
| ManagedInstanceDataEncryptionKeyAlias | CMK のエイリアス。 |
| **S3 リソース** | |
| AthenaQueryResultsBucket | Athena のクエリ結果を保存する S3 バケット。 |
| ResourceSyncBucket | リソースデータ同期によって提供されるマネージドノードメタデータを保存するために使用される S3 バケット。 |
| ResourceSyncBucketPolicy | リソースデータ同期 S3 バケットの S3 バケットポリシー。 |
| **Glue リソース** | |
| GlueDatabase | リソースデータ同期メタデータ用の Glue データベース。 |
| GlueCrawler | データベースとテーブルを作成する Glue クローラー。 |
| GlueCrawlerRole | Glue クローラーが使用する IAM ロール。 |
| DeleteGlueTableColumnFunctionRole | DeleteGlueTableColumnFunction Lambda 関数用の IAM ロール。 |
| DeleteGlueTableColumnFunction | 重複した `resourcetype` パーティションキーを削除する Lambda 関数。 |
| DeleteGlueTableColumnFunctionEventRule | DeleteGlueTableColumnFunction Lambda 関数を呼び出す Amazon EventBridge ルール。 |
| DeleteGlueTableColumnFunctionCloudWatchPermission | EventBridge に DeleteGlueTableColumnFunction Lambda 関数を呼び出すアクセス許可を付与します。 |
| **Athena リソース** | |
| AthenaWorkGroup | 名前付きクエリ用の Athena ワークグループ。 |
| AthenaQueryCompliantPatch | パッチ適用に準拠しているマネージドノードを一覧表示するクエリの例。 |
| AthenaQueryNonCompliantPatch | パッチ適用に非準拠のマネージドノードを一覧表示するクエリの例。 |
| AthenaQueryComplianceSummaryPatch | マネージドノードのパッチコンプライアンスサマリーを提供するクエリの例。 |
| AthenaQueryPatchSummary | マネージドノードのパッチサマリーを提供するクエリの例。 |
| AthenaQueryInstanceList | 終了していないマネージドノードのリストを返すクエリの例。 |
| AthenaQueryInstanceApplications | 終了していないマネージドノードとそれらにインストールされているアプリケーションのリストを返すクエリの例。 |
| AthenaQuerySSMAgent | マネージドノードにインストールされている SSM Agent のバージョンを一覧表示するクエリの例。 |
| **S3 クリーンアップリソース** | |
| S3CleanupLambdaExecutionRole | S3 バケットをクリーンアップする IAM ロール |
| S3BucketCleanup | S3 バケットをクリーンアップする Lambda 関数 |
| S3Cleanup | S3 バケットをクリーンアップするカスタムリソース |

#### 中央レポートアカウントに Athena 用の CloudFormation スタックをデプロイする

1. [Athena を使用した中央レポート作成用のサンプル CloudFormation テンプレート](https://github.com/aws-samples/cloud-operations-best-practices/blob/main/cloud-operations-best-practices/static/cfn-templates/patch-reporting/patch-reporting.yaml)をローカルマシンにダウンロードします。
1. 中央レポートアカウントとリージョンで、[AWS CloudFormation コンソール](https://console.aws.amazon.com/cloudformation/home)に移動します。
1. 左側のナビゲーションペインで、**スタック**を選択し、**スタックの作成**を選択します。
1. ドロップダウンリストから、**新しいリソースを使用 (標準)**を選択します。
1. **スタックの作成**ページで、**テンプレートファイルのアップロード**を選択し、**ファイルの選択**を選択して、 `patch-reporting.yaml` ファイルを選択し、**次へ**を選択します。
1. **スタックの詳細を指定**ページで、次の手順を実行します。
    1. **スタック名**に、次のような説明的な名前を入力します。 `patch-reporting`.
    1. **Organization ID** には、AWS Organization の AWS Organization ID を入力します。例えば、 `o-abcde12345`.
    :::tip
    AWS Organization ID の取得方法の詳細については、[管理アカウントから組織の詳細を表示する](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_view_org.html)を参照してください。
    :::
    1. **Enable Glue Crawler Schedule** で、Glue クローラーのスケジュール実行を有効または無効にするかを選択します。
    1. **Glue Crawler Schedule (cron)** で、Glue クローラーの cron スケジュール式を入力します。
    1. **Enable KMS permissions for QuickSight service role** で、QuickSight IAM サービスロールの KMS 権限を有効または無効にするかを選択します。**注意**: KMS 権限を付与しない場合、QuickSight を使用してパッチコンプライアンスデータを視覚化できません。
    1. **Next** を選択します。
1. **Configure stack options** ページで、必要なタグを追加し、**I acknowledge that AWS CloudFormation might create IAM resources with custom names** を選択してから、**Next** を選択します。
1. **Review and create** ページで、すべての情報を確認してから **Submit** を選択してスタックを作成します。

ページを更新すると、スタックのステータスが次のようになります。 `CREATE_IN_PROGRESS`ステータスが次に変わったとき `CREATE_COMPLETE`、QuickSight のビジュアライゼーションをデプロイできます。

:::tip
CloudFormation スタックの **Outputs** タブで確認できる **AthenaQueryResultsBucket** と **ResourceDataSyncBucketName** の Amazon S3 バケット名をメモしておいてください。次のセクションで QuickSight をデプロイする際に、これら 2 つの値が必要になります。

![Outputs of the CloudFormation stack to show the resource data sync S3 bucket name](/img/cloudops/recipes/central-reporting/patch-reporting-cfn-outputs.png "Outputs of the CloudFormation stack to show the resource data sync S3 bucket name")
:::

#### Amazon QuickSight 可視化のサンプル CloudFormation テンプレート

以下に、CloudFormation テンプレートによって作成されるリソースとその目的についての詳細を示します。

[Amazon QuickSight 可視化のサンプル CloudFormation テンプレート](https://github.com/aws-samples/cloud-operations-best-practices/blob/main/cloud-operations-best-practices/static/cfn-templates/patch-reporting/quicksight.yaml)

| リソース名 | 目的 |
| -------- | ------ |
| SSMDataSyncSource | Athena ワークグループ patch-workgroup を指す QuickSight データソース。 |
| ApplicationDataSet | アプリケーションメタデータ用の QuickSight データセット |
| ComplianceItemDataSet | コンプライアンスアイテムメタデータ用の QuickSight データセット |
| ComplianceSummaryDataSet | コンプライアンスサマリーメタデータ用の QuickSight データセット |
| InstanceDetailedInformationDataSet | インスタンス詳細情報メタデータ用の QuickSight データセット |
| InstanceInformationDataSet | インスタンス情報メタデータ用の QuickSight データセット |
| TagDataSet | タグメタデータ用の QuickSight データセット |
| JoinedDataSet | aws_instanceinformation、aws_compliancesummary、aws_tag を結合する QuickSight データセット |
| ManagedNodeAnalysis | QuickSight 分析ダッシュボード |

:::tip
サンプル CloudFormation テンプレートは、 `DIRECT_QUERY` データソースのほぼリアルタイムのクエリを可能にするメソッドです。代替手段として、SPICE を使用して QuickSight にデータをキャッシュする方法があります。SPICE を使用する場合、サンプルテンプレートには 551〜647 行目にリフレッシュスケジュールの例も含まれています。使用するモードの詳細については、[Amazon QuickSight SPICE とダイレクトクエリモードのベストプラクティス](https://aws.amazon.com/blogs/business-intelligence/best-practices-for-amazon-quicksight-spice-and-direct-query-mode/)を参照してください。
:::

#### QuickSight の CloudFormation テンプレートをデプロイする前に完了すべき前提条件

QuickSight がパッチコンプライアンスおよびインベントリメタデータにアクセスできるようにするには、[中央レポートアカウントで Athena 用の CloudFormation スタックをデプロイする](#中央レポートアカウントに-athena-用の-cloudformation-スタックをデプロイする)で作成された S3 バケットへのアクセスを QuickSight に付与する必要があります。 `ssm-res-sync-athena-query-results-us-east-1-$AccountId` および `ssm-resource-sync-us-east-1-$AccountId`.

![QuickSight permissions to S3 buckets](/img/cloudops/recipes/central-reporting/quicksight-athena-resources.png "QuickSight permissions to S3 buckets")

アクセスを許可する方法の詳細については、[Amazon S3 に接続できない](https://docs.aws.amazon.com/quicksight/latest/user/troubleshoot-connect-S3.html)を参照してください。

#### 中央レポートアカウントに QuickSight 用の CloudFormation スタックをデプロイする

1. [Amazon QuickSight 可視化用のサンプル CloudFormation テンプレート](https://github.com/aws-samples/cloud-operations-best-practices/blob/main/cloud-operations-best-practices/static/cfn-templates/patch-reporting/quicksight.yaml)をローカルマシンにダウンロードします。
1. 中央レポートアカウントとリージョンで、[AWS CloudFormation コンソール](https://console.aws.amazon.com/cloudformation/home)に移動します。
1. 左側のナビゲーションペインで、**スタック**を選択し、**スタックの作成**を選択します。
1. ドロップダウンリストから、**新しいリソースを使用 (標準)**を選択します。
1. **スタックの作成**ページで、**テンプレートファイルのアップロード**を選択し、**ファイルの選択**を選択して、 `quicksight.yaml` ファイルを選択し、**次へ**を選択します。
1. **スタックの詳細を指定**ページで、次の手順を実行します。
    1. **スタック名**に、次のような説明的な名前を入力します。 `quicksight`
    1. **QuickSightUser** には、QuickSight データソースおよび分析ダッシュボードへのアクセス許可を付与する QuickSight ユーザーの名前を入力します。
    1. **Workgroup** には、デフォルト値のままにします。 `patch-workgroup`.
    1. **次へ** を選択します。
1. **スタックオプションの設定** ページで、必要なタグを追加し、**次へ** を選択します。
1. **確認と作成** ページで、すべての情報を確認し、**送信** を選択してスタックを作成します。

ページを更新すると、スタックのステータスが次のようになります。 `CREATE_IN_PROGRESS`ステータスが次に変わったとき `CREATE_COMPLETE`、メンバーアカウントおよびリージョンにリソースデータ同期をデプロイします。

### フェーズ 2: メンバーアカウントの設定

#### 組織リソースデータ同期のサンプル CloudFormation テンプレート

以下に、CloudFormation テンプレートによって作成されるリソースとその目的についての詳細を示します。

[組織リソースデータ同期のサンプル CloudFormation テンプレート](https://github.com/aws-samples/cloud-operations-best-practices/blob/main/cloud-operations-best-practices/static/cfn-templates/patch-reporting/organization-resource-data-sync.yaml)

| リソース名 | 目的 |
| -------- | ------ |
| **リソースデータ同期リソース** | |
| ResourceDataSyncLambdaRole | 組織リソースデータ同期を作成する Lambda 用の IAM サービスロール |
| ResourceDataSyncLambdaFunction | 組織リソースデータ同期を作成する Lambda 関数 |
| ResourceDataSyncCustomResource | Lambda 関数を呼び出す CFN カスタムリソース |

#### CloudFormation StackSet をデプロイする

以下のウォークスルーでは、CloudFormation の委任管理者アカウントを使用して、AWS Organization と互換性のあるリソースデータ同期をデプロイするために、[サービス管理権限](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-orgs-associate-stackset-with-org.html)を持つ StackSet をデプロイします。

1. [組織リソースデータ同期用のサンプル CloudFormation テンプレート](https://github.com/aws-samples/cloud-operations-best-practices/blob/main/cloud-operations-best-practices/static/cfn-templates/patch-reporting/organizational-resource-data-sync.yaml)をローカルマシンにダウンロードします。
1. CloudFormation の委任管理者アカウントで、[AWS CloudFormation コンソール](https://console.aws.amazon.com/cloudformation/home)に移動します。
1. 左側のナビゲーションペインで **StackSets** を選択し、**Create StackSet** を選択します。
1. **Choose a template** ページで、以下の手順を実行します。
    1. **Permission model** については、デフォルトのオプション **Service-managed permissions** をそのまま選択した状態にします。
    1. **Prerequisite - Prepare template** については、デフォルトのオプション **Template is ready** をそのまま選択した状態にします。
    1. **Specify template** については、**Upload a template file** を選択し、**Choose file** を選択して、ファイルを選択します。 `organization-resource-data-sync.yaml` ファイルを選択し、**次へ**を選択します。
1. **StackSet の詳細を指定**ページで、次の手順を実行します。
    1. **StackSet 名**に、わかりやすい名前を入力します（例： `org-resource-data-sync`.
    1. **Name of the resource data sync S3 bucket** に、前のセクションで作成した S3 バケットの名前を入力します。
    :::tip
    中央レポートアカウントでは、プロビジョニングされた CloudFormation スタックの **Outputs** で S3 バケット名を確認できます。
    ![Outputs of the CloudFormation stack to show the resource data sync S3 bucket name](/img/cloudops/recipes/central-reporting/patch-reporting-cfn-outputs.png "Outputs of the CloudFormation stack to show the resource data sync S3 bucket name")
    :::
    1. **リソースデータ同期 S3 バケットのプレフィックス**に、S3 バケットに使用するプレフィックスの名前（例： `ResourceDataSync`）を入力します。
    1. **リソースデータ同期 S3 バケットの AWS Region** には、リソースデータ同期 S3 バケットのリージョンを入力します。
    1. **リソースデータ同期の名前** には、リソースデータ同期の名前を入力します。
    1. **次へ** を選択します。
1. **StackSet オプションの設定** ページで、必要なタグを追加し、**AWS CloudFormation が IAM リソースを作成する可能性があることを承認します** を選択してから、**次へ** を選択します。
1. **デプロイオプションの設定** ページで、次の手順を実行します。
    1. **デプロイターゲット** で、組織全体または特定の組織単位 (OU) へのデプロイを選択します。
    :::tip
    利用可能なすべてのインベントリおよびパッチメタデータをクエリ、レポート、および可視化のために単一の S3 バケットに集約するため、AWS Systems Manager によって管理されるノードが存在するすべてのアカウントおよびリージョンにリソースデータ同期をデプロイすることをお勧めします。
    :::
    1. **リージョンの指定** で、リソースデータ同期をデプロイするリージョンを選択します。
    1. その他のオプションはすべてデフォルトのままにして、**次へ** を選択します。
1. **レビュー** ページで、すべての情報を確認し、**送信** を選択して StackSet を作成します。

ページが更新されると、StackSet が表示されるようになります。ステータスは次のように変わります。 `SUCCEEDED` 作成された後。

## フェーズ 3: 検証とテスト

### リソースデータ同期 S3 バケットのメタデータを確認する

中央レポートアカウントで、[Amazon S3 コンソール](https://console.aws.amazon.com/s3/home)に移動し、CloudFormation によって作成された S3 バケットを選択します。バケット名は以下のような形式になっています。 `ssm-resource-sync-${region}-${account-id}`. S3 バケットで、[CloudFormation StackSet をデプロイ](#cloudformation-stackset-をデプロイする)したときに指定したバケットプレフィックスを選択します。

バケット内には、リソースデータ同期によって自動的に同期されるさまざまなデータタイプを確認できます。以前に Inventory メタデータの収集を設定し、少なくとも 1 回のパッチスキャン操作を実行している場合は、追加のフォルダーが表示されます（例： `AWS:Application`, `AWS:AWSComponent`) は S3 バケット内にあります。各フォルダは[Inventory によって収集されたメタデータ](https://docs.aws.amazon.com/systems-manager/latest/userguide/inventory-schema.html)を表しています。

![S3 bucket folders for resource data sync metadata](/img/cloudops/recipes/central-reporting/s3-bucket-objects.png "S3 bucket folders for resource data sync metadata")

各データタイププレフィックス内には、この S3 バケットでリソースデータ同期を使用している各アカウントのプレフィックスが存在します。その後に、インベントリをレポートしている各リージョンのプレフィックス、そしてリソースタイプのプレフィックスが続きます。リソースタイプは通常、 `ManagedInstanceInventory`そのプレフィックス内に、インベントリデータを報告する各インスタンスの JSON ファイルが存在します。

### QuickSight 分析へのアクセスを確認する

[QuickSight コンソール](https://quicksight.aws.amazon.com/sn/start/analyses)に移動して、CloudFormation によって作成された QuickSight Analysis ダッシュボードへのアクセス権があることを確認します。

**Managed Node Analysis CFN** という名前の分析が表示されない場合は、CloudFormation パラメータで指定したのと同じユーザーとして QuickSight にログインしていることを確認してください。 `QuickSightUser`QuickSight にログインしているユーザーを確認するには、右上隅のプロフィールを選択してください。

![QuickSight analysis created by CloudFormation](/img/cloudops/recipes/central-reporting/quicksight-analysis.png "QuickSight analysis created by CloudFormation")

## パッチコンプライアンスのクエリ

### Glue クローラーを確認する

リソースデータ同期によって Systems Manager のデータが S3 バケットに同期されたので、Glue クローラーを使用して JSON ファイルからテーブルを作成できます。Glue クローラーは毎日 00:00 UTC に実行されるように設定されています。Glue クローラーの実行を待つか、クローラーを手動で実行して Athena でクエリするテーブルを生成することができます。

1. [AWS Glue コンソール](https://console.aws.amazon.com/glue/home/v2/home)を開き、ナビゲーションペインで **Data Catalog** ヘッダーの下にある **Crawlers** を選択します。
1. **SSM-GlueCrawler** を選択し、**Run** を選択します。

クローラーは停止するまで約 2〜4 分間実行されます。クローラーが準備完了状態に戻ったら、ナビゲーションペインで **Tables** を選択して、テーブルが結果のデータベースに追加されたことを確認します。

### Athena を使用したクエリ

1. KMS、S3、Glue、および Athena リソースをデプロイした[中央レポート AWS アカウント](#集中レポートアカウント)にログインします。
1. [Amazon Athena コンソール](https://console.aws.amazon.com/athena/home)を開き、ナビゲーションペインで **Query editor** を選択します。
1. 右上隅の **Workgroup** で、**patch-workgroup** を選択します。
1. **Workgroup patch-workgroup settings** で、**Acknowledge** を選択します。
1. **Saved queries** タブを選択して、サンプルクエリを確認します。
1. **QueryNonCompliantPatch** などの保存済みクエリを選択し、**Run** を選択します。
1. 更新が不足しており、非準拠のマネージドノードに対してクエリ結果が返されることを確認します。

![Athena query results for QueryNonCompliantPatch](/img/cloudops/recipes/central-reporting/athena-query-results.png "Athena query results for QueryNonCompliantPatch")

:::warning
**QuerySSMAgentVersion** および **QueryInstanceApplications** という名前の**保存済みクエリ**を使用するには、[Systems Manager Inventory](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-inventory.html) を有効にする必要があります。[Systems Manager 統合コンソール](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-setting-up-organizations.html)へのオンボーディング時に、Systems Manager Inventory をすばやく有効にすることができます。
:::

### Athena のサンプルクエリの追加

#### 非準拠のマネージドノードのグループ更新

次の Athena クエリの例では、非準拠の更新をマネージドノード別にグループ化します。

<Tabs
    defaultValue="query"
    values={[
        {label: 'クエリ', value: 'query'},
        {label: '結果', value: 'results'},
    ]}>
<TabItem value="query">

```sql
-- Query to aggregate non-compliant patch compliance items by resource (limited to 20 results)
SELECT 
    ci.resourceid,
    ci.status,
    ci.patchstate,
    LISTAGG(DISTINCT ci.id, ', ') WITHIN GROUP (ORDER BY ci.id) AS ids
FROM 
    aws_complianceitem ci
WHERE 
    ci.compliancetype = 'Patch'
    AND ci.status = 'NON_COMPLIANT'
GROUP BY 
    ci.resourceid,
    ci.status,
    ci.patchstate
ORDER BY 
    ci.resourceid
LIMIT 20;
```

</TabItem>

<TabItem value="results">

![Example query results when grouping updates per managed node](/img/cloudops/recipes/central-reporting/group-updates-per-node.png "Example query results when grouping updates per managed node")

</TabItem>
</Tabs>

#### アクティブでないマネージドノードを除外する

リソースデータ同期は、インベントリとパッチコンプライアンスのメタデータを S3 バケットに送信します。管理対象の EC2 インスタンスが停止または終了されると、 `AWS:InstanceInformation` メタデータは新しい状態を反映するように更新されます。ハイブリッド管理ノードの場合、このステータスは SSM エージェントの接続状態に基づいて更新されます。これらの値は、 `InstanceStatus` 以下の値を持つことができるキー：

* `Active` - SSM エージェント（EC2 またはハイブリッド管理ノード上）が正常に動作し、AWS Systems Manager と通信しています。
* `Stopped` - EC2 インスタンスが `Stopped` 状態。
* `Terminated` - EC2 インスタンスが終了（削除）されました。
* `ConnectionLost` - ハイブリッドマネージドノード上の SSM エージェントが AWS Systems Manager と通信できません。

:::tip
リソースデータ同期は、指定された S3 バケットから JSON ファイルを削除しません。終了した EC2 インスタンスまたは登録解除されたハイブリッドマネージドノードのメタデータ JSON ファイルを自動的にクリーンアップするには、[S3 ライフサイクルポリシー](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html)を使用してオブジェクトを自動的に削除できます。たとえば、60 日間更新されていない古いオブジェクトを期限切れにする S3 バケットポリシーを実装することができます。セクション「[組織リソースデータ同期のサンプル CloudFormation テンプレート](#組織リソースデータ同期のサンプル-cloudformation-テンプレート)」のサンプル CloudFormation テンプレートには、コメントアウトされた `LifecycleConfiguration` 154 行目から始まります。
:::

使用できます `InstanceStatus` Athena クエリで停止または終了したインスタンス、あるいは接続が切断された状態のハイブリッド管理ノードを除外するために使用します。たとえば、次のクエリは以下を返します。 `AWS:InstanceInformation` のメタデータのみ `Active` マネージドノード。

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs
    defaultValue="query"
    values={[
        {label: 'クエリ', value: 'query'},
        {label: '結果', value: 'results'},
    ]}>
<TabItem value="query">

```sql
-- Query to return only Active managed nodes
SELECT 
    ii.accountid,
    ii.region,
    ii.resourceid,
    ii.computername,
    ii.ipaddress,
    ii.instancestatus,
    ii.platformtype,
    ii.platformname,
    ii.platformversion,
    ii.agenttype,
    ii.agentversion,
    ii.capturetime
FROM 
    aws_instanceinformation ii
WHERE 
    ii.instancestatus = 'Active'
LIMIT 20;
```

</TabItem>

<TabItem value="results">

![Example query results to return only active managed nodes](/img/cloudops/recipes/central-reporting/active-instance-query-results.png "Example query results to return only active managed nodes")

</TabItem>
</Tabs>

## QuickSight を使用してパッチコンプライアンスを可視化する

[中央レポートアカウントに QuickSight 用の CloudFormation スタックをデプロイする](#中央レポートアカウントに-quicksight-用の-cloudformation-スタックをデプロイする)でデプロイされた CloudFormation スタックにより、QuickSight データセットと空の分析ダッシュボードが作成され、パッチコンプライアンスとインベントリメタデータの可視化を開始できます。

QuickSight のビジュアルを作成するには、以下に示す 2 つのトピックの手順に従ってください。

1. [パート 1: マネージドノードのメタデータに基づいて QuickSight ビジュアルを作成する](https://catalog.workshops.aws/getting-started-with-com/en-US/advanced-workshops/organization-patch-reporting/create-quicksight-visuals-and-dashboard)
1. [パート 2: パッチコンプライアンスに関する情報の AWS QuickSight ビジュアルを作成する](https://catalog.workshops.aws/getting-started-with-com/en-US/advanced-workshops/organization-patch-reporting/create-quicksight-visuals-for-patch-compliance)

上記の 2 つのトピックに従うことで、次のような 2 つのシートを持つ QuickSight ダッシュボードを作成できます。

<Tabs
    defaultValue="instanceinfo"
    values={[
        {label: 'インスタンス情報', value: 'instanceinfo'},
        {label: 'パッチコンプライアンス', value: 'patchcompliance'},
    ]}>
<TabItem value="instanceinfo">

![Example QuickSight dashboard for instance information](/img/cloudops/recipes/central-reporting/example-instance-information-dashboard.png "Example QuickSight dashboard for instance information")

</TabItem>

<TabItem value="patchcompliance">

![Example QuickSight dashboard for patch compliance](/img/cloudops/recipes/central-reporting/example-patch-compliance-dashboard.png "Example QuickSight dashboard for patch compliance")

</TabItem>
</Tabs>

## デプロイされたリソースのクリーンアップ

:::warning
このレシピのサンプル CloudFormation テンプレートは、セントラルレポートアカウントの CloudFormation スタックを削除する際に、S3 バケットの内容を削除します。
:::

[フェーズ 2: メンバーアカウントの設定](#フェーズ-2-メンバーアカウントの設定)で作成したサンプルリソースをクリーンアップするには、まず[StackSet のスタックインスタンスを削除](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stackinstances-delete.html)してから、[StackSet を削除](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-delete.html)する必要があります。

[フェーズ 1: 中央アカウントのセットアップ](#フェーズ-1-中央アカウントのセットアップ)で作成したサンプルリソースをクリーンアップするには、次の手順を実行します。

1. スタック内のリソースを削除します。 `quicksight`、[中央レポートアカウントに QuickSight 用の CloudFormation スタックをデプロイする](#中央レポートアカウントに-athena-用の-cloudformation-スタックをデプロイする)セクションでデプロイされたものです。
1. スタック内のリソースを削除します。 `patch-reporting`、[中央レポートアカウントに Athena 用の CloudFormation スタックをデプロイする](#中央レポートアカウントに-athena-用の-cloudformation-スタックをデプロイする)セクションでデプロイされます。

CloudFormation スタックの削除方法については、[CloudFormation コンソールからスタックを削除する](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-console-delete-stack.html)を参照してください。

## 次のステップ

以下に、パッチ操作とレポートメカニズムを改善するための参考として使用できる、関連する AWS ブログシリーズを紹介します。

* [AWS Organization 内でメールと Slack 通知を使用して Systems Manager パッチレポートを自動化する](https://aws.amazon.com/blogs/mt/automate-systems-manager-patching-reports-via-email-and-slack-notifications-in-an-aws-organization/)
  * *このブログ記事では、パッチレポートの作成と配信を自動化し、パッチ適用操作の追跡プロセスを効率化する方法を説明します。AWS Lambda、Amazon EventBridge、AWS Step Functions、Amazon DynamoDB などの AWS サービスを活用することで、複数のアカウントから Systems Manager Patch Manager の実行詳細を統合し、包括的なレポートを生成して、メールと Slack 通知で配信できます。これにより、安全でコンプライアンスに準拠したインフラストラクチャを維持するために必要なインサイトをチームに提供できます。*
* [Amazon Bedrock の自動推奨機能で AWS Systems Manager パッチ適用のトラブルシューティングを簡単に](https://aws.amazon.com/blogs/mt/troubleshooting-aws-systems-manager-patching-made-easy-with-amazon-bedrocks-automated-recommendations/)
  * *この記事では、Amazon Bedrock が Systems Manager パッチ適用の失敗に対するトラブルシューティングプロセスをどのように簡素化できるかを説明します。Bedrock の自動分析および推奨機能を使用することで、パッチ適用の問題の根本原因を迅速に特定し、適切な解決策を実装できるため、貴重な時間と労力を節約できます。*
* [Amazon QuickSight を使用して AWS Systems Manager Patch Manager の情報を可視化する](https://aws.amazon.com/blogs/mt/visualize-aws-systems-manager-patch-manager-information-using-amazon-quicksight/)
  * *このブログ記事では、重要なパッチとインベントリ情報を可視化して MTTR を短縮するための Amazon QuickSight ダッシュボードの構築方法を説明します。また、フィルターを使用して特定の AWS アカウント、特定の AWS リージョン、Amazon Elastic Compute Cloud (Amazon EC2) 名を検索したり、インストール済み/未適用のパッケージを確認したりすることもできます。*
* [Amazon Inspector と AWS Systems Manager を使用して AWS での脆弱性管理と修復を自動化する – パート 1](https://aws.amazon.com/blogs/mt/automate-vulnerability-management-and-remediation-in-aws-using-amazon-inspector-and-aws-systems-manager-part-1/)
  * *このシリーズのパート 1 では、複数の EC2 インスタンスに影響する特定の脆弱性に対する Inspector の検出結果を修復する方法を説明します。パート 2 では、リソースタグと Amazon Inspector の検出結果の重大度を使用して、EC2 インスタンスに対するすべての Amazon Inspector の検出結果を修復するために Systems Manager Automation ランブックを直接呼び出す方法を説明します。*

## 技術用語集

| 用語 | 定義 |
|---|---|
| AWS Glue Crawler | データソースからメタデータを自動的に検出してカタログ化し、AWS Glue データカタログにテーブルを作成するサービス。 |
| AWS Organizations | 複数の AWS アカウントを単一の組織として一元的に管理・統制するためのサービス。 |
| Custom Resource | テンプレート内でカスタムのプロビジョニングロジックを記述できる CloudFormation のリソースタイプ。 |
| Delegated Administrator | AWS 組織を代理して特定の AWS サービスを管理するアクセス許可が付与された AWS アカウント。 |
| Managed Node | AWS Systems Manager による管理用に設定された任意のサーバー（EC2 インスタンス、またはオンプレミスや他のクラウド上の VM）。SSM Agent がインストールされ、適切に設定されている必要があります。 |
| Patch Baseline | マネージドノードにどのパッチをインストールすべきかを定義する一連のルール。重大度レベルごとの承認ルールを含みます。 |
| Patch Compliance | 必要なパッチに関するマネージドノードの状態。関連付けられたパッチベースラインに従って必要なすべてのパッチがインストールされている場合、ノードは準拠しています。 |
| Patch Group | マネージドノードを特定のパッチベースラインに関連付ける、タグベースのグループ化メカニズム。 |
| Resource Data Sync | マネージドノードからのインベントリデータを中央の S3 バケットに自動的に集約し、統合レポートを可能にする Systems Manager の機能。 |
| Service-Managed Permissions | AWS Organizations を使用して組織内のアカウントにスタックインスタンスをデプロイする StackSet のアクセス許可モデル。 |
| SSM Agent | マネージドノードにインストールされる AWS ソフトウェアで、Systems Manager がこれらのリソースを更新、管理、設定できるようにします。 |
| StackSet | 単一の操作で複数のアカウントとリージョンにまたがってスタックを作成、更新、削除できる CloudFormation の機能。 |
