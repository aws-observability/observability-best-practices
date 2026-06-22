---
sidebar_position: 3
---
# CloudTrail Lake から Amazon CloudWatch への移行

## 概要

このガイドでは、CloudTrail イベント分析のプライマリ送信先を AWS CloudTrail Lake から Amazon CloudWatch に移行するためのステップバイステップのアプローチを提供します。履歴データのエクスポート、テレメトリ有効化ルールによる新しい CloudTrail インジェストの有効化、クロスアカウント/クロスリージョンの集中管理のセットアップという構造化された 3 フェーズの移行を順を追って説明します。これにより、CloudWatch Unified Data Store で CloudTrail アクティビティをその他の運用およびセキュリティテレメトリと統合できます。このガイドでは、コスト見積もり、CloudTrail Lake SQL から CloudWatch Logs Insights へのクエリ変換、集中管理の料金最適化、ロググループのセキュリティベストプラクティス、ニアリアルタイムのセキュリティ可視性のためのダッシュボード構築についても説明します。

### なぜ移行するのか？

現在 CloudTrail Lake を使用している組織は、共通の課題に直面しています。CloudTrail データが他の運用およびセキュリティテレメトリから分離されているため、インシデント調査が遅くなり、複数のツールやクエリ言語にまたがって断片化してしまいます。[Amazon CloudWatch Unified Data Store](https://aws.amazon.com/blogs/aws/amazon-cloudwatch-introduces-unified-data-management-and-analytics-for-operations-security-and-compliance/) は、CloudTrail アクティビティを VPC Flow Logs、AWS WAF ログ、アプリケーションログ、およびサードパーティのセキュリティデータと一元化されたリポジトリに集約することでこの問題を解決し、[CloudWatch Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html) や [Amazon Athena](https://docs.aws.amazon.com/athena/latest/ug/what-is.html)、[Amazon Redshift](https://docs.aws.amazon.com/redshift/latest/mgmt/welcome.html) などの Apache Iceberg 互換ツールを通じた相関分析を可能にします。

### 移行の主なメリット

1. **統合テレメトリ**: CloudWatch 統合データストアを通じて、単一のクエリインターフェイスで AWS サービス（CloudTrail、VPC Flow Logs、WAF、Route 53、EKS、NLB など）、サードパーティソース（CrowdStrike、SentinelOne、Okta、Palo Alto Networks など）、およびカスタムアプリケーションログにわたるログを相関させます。
2. **自動スキーマ検出**: CloudWatch は CloudTrail フィールドをデフォルトのファセットとともに自動的に検出してインデックス化します。 `@data_source_name` 動的なロググループの検出に使用します。詳細については、[データソースの検出と管理](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/data-source-discovery-management.html)を参照してください。
3. **ロググループ名への依存なし**: すべての CloudTrail データのクエリに使用します `SOURCE logGroups() | filterIndex @data_source_name in ["aws_cloudtrail"]` ロググループの命名に関係なく適用されます。
4. **ネイティブエンリッチメント**: [CloudWatch Logs Transformation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch-Logs-Transformation.html) を使用して、カスタム Lambda 関数を使わずに取り込み時にセキュリティコンテキスト、コンプライアンスタグ、および環境ラベルを追加します。
5. **クロスアカウント/クロスリージョンの集約**: すべてのアカウントとリージョンの CloudTrail データを単一の宛先に統合し、セキュリティ、コンプライアンス、およびインシデント対応に活用します。詳細については、[クロスアカウントクロスリージョンのログ集約](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatchLogs_Centralization.html)を参照してください。
6. **単一プラットフォームでより多くの価値**: CloudWatch の統合データストアは、スタンドアロンのクエリサービスを超え、AWS ログ、サードパーティのセキュリティソース、およびカスタムアプリケーションデータを、組み込みの正規化とクロスソース相関を備えた単一プラットフォームに統合します。

### 3 フェーズの移行アプローチ

移行は、構造化された 3 フェーズのアプローチに従います。

![CloudTrail Lake Three-Phase Migration Approach](/img/cloudops/guides/cloudtrail-lake/cloudtrail_lake_to_cloudwatch/three-phase-migration-approach.png "CloudTrail Lake Three-Phase Migration Approach")

### 移行コストの見積もり

CloudTrail Lake から CloudWatch に移行すると、新しい CloudTrail イベントは継続的に CloudWatch Logs に直接取り込まれます。このような移行のコストへの影響を理解することは、予算計画とコスト最適化において重要です。

予測される月次 CloudWatch Logs コストを見積もるには、**AWS Cost Explorer** で CloudTrail サービスでフィルタリングし、使用タイプでグループ化することで、現在の CloudTrail Lake の使用状況を確認してください。イベントデータストアの CloudTrail Lake 使用タイプ（インジェストバイト数など）を特定するには、[AWS Cost Explorer を使用した CloudTrail のコストと使用状況の表示](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-costs.html)を参照してください。Cost Explorer はインジェスト値を GB 単位で表示します。この値を使用して、CloudTrail 配信および CloudWatch Logs インジェストの最新の[CloudWatch 料金](https://aws.amazon.com/cloudwatch/pricing/)に基づいて CloudWatch Logs インジェストコストを見積もることができます。

:::info
注意: この見積もりはインジェスチョンと配信コストのみを対象としており、ストレージやクエリなど CloudWatch Logs に関連する追加コストは含まれていません。
:::

---

## フェーズ 1 — CloudTrail Lake から CloudWatch への過去データのエクスポート

過去の CloudTrail Lake データを CloudWatch にエクスポートすることで、監査証跡の継続性が確保され、過去のイベントと新しいイベントにわたる統合クエリが可能になります。このフェーズでは、既存のイベントデータストア (EDS) から CloudWatch Logs へのデータ移行に焦点を当てます。

### CloudTrail Lake データを CloudWatch にエクスポートしてエクスポートを実行する

1. [CloudTrail コンソール](https://console.aws.amazon.com/cloudtrailv2/#/lake)に移動します。
1. 左側のナビゲーションメニューで、**Lake** を選択します。
1. **Event Data Stores** を選択します。
1. CloudTrail イベント用の **Event Data Store** を選択します。
1. **Actions** ドロップダウンから、**Export to CloudWatch** を選択します。

    ![CloudTrail Lake Event Data Store Actions menu showing the Export to CloudWatch option.](/img/cloudops/guides/cloudtrail-lake/cloudtrail_lake_to_cloudwatch/cloudtrail_lake_to_cloudwatch_01.png "CloudTrail Lake Event Data Store Actions menu showing the Export to CloudWatch option.")

1. イベントデータストアのデータをエクスポートする**時間範囲**を選択します。
1. 提供された手順に従って **IAM ロール**を設定し、新しい IAM ロールを作成するか、CloudTrail がエクスポート用のデータにアクセスするために使用する既存の IAM ロールを指定します。
1. **エクスポート**を選択します。

    ![Export to CloudWatch configuration screen showing time range selection and IAM role configuration.](/img/cloudops/guides/cloudtrail-lake/cloudtrail_lake_to_cloudwatch/cloudtrail_lake_to_cloudwatch_02.png "Export to CloudWatch configuration screen showing time range selection and IAM role configuration.")

:::info
エクスポートされたデータは低頻度アクセスストレージクラスを使用するため、ログ情報をクエリするには CloudWatch Logs Insights が必要です。低頻度アクセスストレージで作成されたロググループは、コンソールの Log Streams にエクスポート結果を直接表示しません。また、2023 年以前のデータを CloudTrail Lake から Amazon CloudWatch に移行することはできません。2023 年より古いイベントへのアクセスが必要な場合は、CloudTrail Lake 内で直接クエリを続けるか、データを S3 バケットにエクスポートすることができます。詳細については、[CloudTrail Lake イベントデータストアから CloudWatch へのデータのエクスポート](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-lake-export-cloudwatch.html)に関する以下のドキュメントを参照してください。また、AWS CloudTrail Lake イベントのサブセットを Amazon S3 にエクスポートする方法については、こちらの[AWS ブログ](https://aws.amazon.com/blogs/mt/exporting-a-subset-of-aws-cloudtrail-lake-events-to-amazon-s3/)を参照してください。
:::

---

## フェーズ 2 — Telemetry Enablement Rules を使用した新しい CloudTrail インジェストの有効化

履歴の CloudTrail Lake データが CloudWatch でアクセス可能になったので、次のステップは新しい CloudTrail イベントを[CloudWatch Unified Data Store](https://aws.amazon.com/blogs/aws/amazon-cloudwatch-introduces-unified-data-management-and-analytics-for-operations-security-and-compliance/)に直接取り込み始めることです。このステップは、既存の CloudTrail Trails や CloudTrail Lake イベントデータストアとは独立しています。CloudTrail のアクティビティが CloudWatch に流れ込む新しい専用パスを確立します。CloudWatch の[テレメトリ設定](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/telemetry-config-rules.html)機能を使用することで、CloudWatch を通じて CloudTrail イベントの自動取り込みを設定できます。有効にすると、すべての新しい CloudTrail イベントが他の運用およびセキュリティテレメトリと並んで配信され、統合されたクエリ、アラート、および分析の準備が整います。

### CloudTrail のテレメトリ有効化ルールの作成 

1. [CloudWatch コンソール](https://console.aws.amazon.com/cloudwatch/)を開きます。
1. 左側のナビゲーションペインで、**Ingestion** をクリックします。
1. **Enable Resource Discovery** ボタンをクリックします。
1. CloudWatch は必要なサービスにリンクされたロールを自動的に作成します。
1. **Data Sources** タブで、利用可能なサービスの一覧から **AWS CloudTrail** を見つけます。
1. **AWS CloudTrail** の横にある **Configure telemetry** を選択します。
1. **Specify Scope** ページで、デフォルトの **Rule name** をそのままにして **Next** を選択します。（**注:** 組織レベルのルールの場合、選択設定でソースアカウントのスコープを設定できます）。

    ![CloudWatch Telemetry config Enablement rules tab showing the Add rule wizard for CloudTrail.](/img/cloudops/guides/cloudtrail-lake/cloudtrail_lake_to_cloudwatch/cloudtrail_lake_to_cloudwatch_03.png "CloudWatch Telemetry config Enablement rules tab showing the Add rule wizard for CloudTrail.")

1. **[送信先の指定]** ページで、次の手順を実行します。
    -   **[送信先]** については、デフォルトの CloudWatch Logs のままにします。
    -   **[ロググループ名パターン]** については、デフォルトのままにします。 `aws/cloudtrail/[event-type]`.
    -   **保持期間**については、コンプライアンス要件に応じた保持期間を選択してください。（**注:** CloudWatch から CloudTrail への統合は、ログをメンバーアカウントに直接配信します。ここで設定する保持期間は、各メンバーアカウントのロググループに適用されます。保持期間はソースロググループおよび集中ロググループとは異なる場合があります。詳細については、[CloudWatch Logs 集中管理のログストレージコストの最適化](/guides/cloudtrail/CloudTrail%20Lake/cloudtrail_lake_to_cloudwatch#cloudwatch-logs-集約のログストレージコストの最適化)のセクションを参照してください。）
1. **次へ**を選択します。

    ![CloudWatch Telemetry config Enablement rules tab showing the Specify destination section for CloudTrail.](/img/cloudops/guides/cloudtrail-lake/cloudtrail_lake_to_cloudwatch/cloudtrail_lake_to_cloudwatch_04.png "CloudWatch Telemetry config Enablement rules tab showing the Specify destination section for CloudTrail.")

1. **[データオプションの選択]** ページで、**[イベントタイプ]** に対して、取り込むイベントを選択します。**[管理イベント]** または **[データイベント]** のいずれかを選択してください。

    ![CloudWatch Telemetry config Enablement rules tab showing the Select data options for CloudTrail.](/img/cloudops/guides/cloudtrail-lake/cloudtrail_lake_to_cloudwatch/cloudtrail_lake_to_cloudwatch_05.png "CloudWatch Telemetry config Enablement rules tab showing the Select data options for CloudTrail.")

1. **次へ**を選択します。
1. **確認と作成**ページで、設定内容を確認し、**CloudTrail の有効化を設定**を選択します。

テレメトリ設定ルールが作成され、CloudTrail イベントの取り込みが開始されます。その後、以下の命名パターンでロググループが作成されます。

| イベントタイプ | ロググループ名パターン | 説明 |
|-------------------|-------------------------------------|----------------------|
| 管理イベント | `aws/cloudtrail/managementevents`  | すべての管理イベント |
| データイベント | `aws/cloudtrail/dataevents`        | すべてのデータイベント |

### CloudTrail インジェストの検証

CloudTrail から CloudWatch への直接取り込みを有効にした後、CloudTrail Lake イベントデータストアと CloudWatch 向け CloudTrail 取り込みの両方を並行して実行し続けることを検討してください。CloudWatch の取り込みを少なくとも 1 日間実行して、すべての CloudTrail イベントが期待どおりにキャプチャされていることを確認することで、CloudWatch の取り込みを検証してください。検証にさらに時間が必要な場合は、両方のサービスを並行して実行する際の潜在的なコストを確認し、続行する前に AWS アカウントチームにガイダンスを求めてください。検証が成功したら、CloudTrail Lake イベントデータストアへの取り込みを停止できます。

:::info
詳細については、「[テレメトリ有効化ルールの使用](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/telemetry-config-rules.html)」および「[CloudWatch での CloudTrail イベントの簡略化された有効化](https://aws.amazon.com/about-aws/whats-new/2025/12/key-enhancements-cloudtrail-events-cloudwatch/)」を参照してください。
:::

---

## フェーズ 3 — クロスアカウント/クロスリージョンの集中管理を設定する

過去の CloudTrail Lake データを CloudWatch に移行し、テレメトリ有効化ルールを使用して CloudTrail の取り込みを有効にしました。次は、統合された監視、分析、およびコンプライアンスのために、すべてを一元化されたアカウントにまとめる時です。

各アカウントで CloudTrail データを CloudWatch Unified Data Store に流すことは最初のステップですが、すべての CloudTrail アクティビティを単一の送信先アカウントに集約することで、セキュリティチーム、コンプライアンスチーム、およびインシデント対応者に、AWS Organization 全体のすべての API アクティビティの統合ビュー（セキュリティモニタリングとインシデント対応のための単一のガラス窓）を提供できます。

[CloudWatch Logs のクロスアカウント・クロスリージョン集約](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatchLogs_Centralization.html)は、[AWS Organizations](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_introduction.html) と統合し、集約ルールを使用して複数のメンバーアカウントから 1 か所にログデータを収集します。複数のアカウントおよび AWS リージョンからログデータを自動的にレプリケートして集約アカウントに送信するルールを定義します。

各メンバーアカウントはローカルアクセスとトラブルシューティングのためにログの独自のコピーを保持し、中央のセキュリティおよびコンプライアンスチームは組織全体の可視性と分析のために独自の統合コピーを受け取ります。

### 集中管理アーキテクチャの理解

![CloudWatch Centralization Architecture](/img/cloudops/guides/cloudtrail-lake/cloudtrail_lake_to_cloudwatch/LogsCentralization.png "CloudWatch Centralization Architecture")

### 集中管理の前提条件

- **[AWS Organizations](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_introduction.html)** がセットアップされており、すべてのソース/デスティネーションアカウントが組織に属している
- **[信頼されたアクセス](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_integrate_services.html)** が AWS Organizations の CloudWatch で有効になっている

### 集約ルールの作成

1. 組織の**管理**アカウントまたは**委任管理者**アカウントで[**CloudWatch コンソール**](https://console.aws.amazon.com/cloudwatch/home)に移動します。
2. **設定**を選択します。
3. **組織**タブに移動します。
4. **ルールの設定**を選択します。
5. **ソースの詳細を指定**ページで、ソースの詳細を指定し、**次へ**を選択します。
    - **集約ルール名**: 集約ルールの一意の名前を入力します（例： `cloudtrail-centralization`).
    - **ソースアカウント**: テレメトリデータを集約するアカウントを選択するためのソース選択基準を定義します。アカウント ID、組織単位 (OU) ID、または組織全体で選択できます。選択基準は **Builder**（クリックベース）または **Editor**（フリーフォームテキスト）モードを使用して指定できます。
        - サポートされているキー: `OrganizationId` | `OrganizationUnitId` | `AccountId` | `*`
        - サポートされているオペレーター: `=` | `IN` | `OR`
    - **ソースリージョン**: ログを一元化する元のリージョンを選択します。

    ![Specifying Source Details for Log Centralization](/img/cloudops/guides/cloudtrail-lake/cloudtrail_lake_to_cloudwatch/cloudtrail_lake_to_cloudwatch_06.png "Specifying Source Details for Log Centralization")

6. **[宛先の指定]** ページで、宛先の詳細を指定し、**[次へ]** を選択します。
    - **宛先アカウント**: テレメトリデータの一元的な宛先として機能する組織内のアカウントを選択します。
    - **宛先リージョン**: 一元化されたテレメトリデータのコピーを保存するプライマリリージョンを選択します。
    - **バックアップリージョン**（オプション）: プライマリリージョンで障害が発生した場合にデータの可用性を確保するため、宛先アカウント内のバックアップリージョンを選択して、ログの同期されたコピーを維持します。

    ![Specifying Destination Details for Log Centralization](/img/cloudops/guides/cloudtrail-lake/cloudtrail_lake_to_cloudwatch/cloudtrail_lake_to_cloudwatch_07.png "Specifying Destination Details for Log Centralization")

7. **[テレメトリデータの指定]** ページで、以下のフィールドを設定してテレメトリデータを指定し、**[次へ]** を選択します。
    - **ロググループ**: **[ロググループのフィルタリング]** を選択して、CloudTrail ロググループのみを一元化します。**Builder**（クリックベース）または **Editor**（フリーフォームテキスト）モードを使用して選択条件を指定できます。
        - **データソース選択条件**: CloudWatch Logs がログに自動的に割り当てるデータソース名とタイプでフィルタリングするために使用します。CloudTrail の場合は、以下を設定します。 `DataSourceName = "aws_cloudtrail"`。また、次の条件でフィルタリングすることもできます。 `DataSourceType` 管理イベントやデータイベントなど、特定のイベントタイプをターゲットにします。

- **KMS 暗号化ロググループ**: KMS 暗号化されたロググループを処理するには、以下のいずれかのオプションを選択してください。
        - **宛先固有のカスタマーマネージド KMS キーを使用して、カスタマーマネージド KMS キーで暗号化されたソースロググループを一元化する**: 指定された宛先 KMS キー ARN を使用して、ソースアカウントから宛先へ暗号化されたロググループを一元化します。このオプションを選択する場合は、宛先暗号化キー ARN とバックアップ宛先暗号化キー ARN（前のステップでバックアップリージョンを選択した場合にのみ必要）を指定する必要があります。指定した KMS キーには、CloudWatch Logs が暗号化を行うための権限が必要です。
        - **AWS 所有の KMS キーを使用して、カスタマーマネージド KMS キーで暗号化されたロググループを宛先アカウントに一元化する**: ソースアカウント内の KMS 暗号化されたロググループを、AWS 所有の KMS キーで暗号化された宛先ロググループに一元化します。
        - **カスタマーマネージド KMS キーで暗号化されたロググループを一元化しない**: カスタマーマネージド KMS キーで暗号化されたソースロググループからのログイベントの一元化をスキップします。

    ![Specify telemetry data for Log Centralization](/img/cloudops/guides/cloudtrail-lake/cloudtrail_lake_to_cloudwatch/cloudtrail_lake_to_cloudwatch_08.png "Specify telemetry data for Log Centralization")

    :::info
    **ロググループ選択基準**を使用して、ロググループ名による追加フィルタリングも利用できます。詳細については、[クロスアカウントのクロスリージョンログ一元化](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatchLogs_Centralization.html)を参照してください。
    :::

8. **[確認と設定]** ページで、集約ルールを確認し、必要に応じて最終的な編集を行い、**[集約ポリシーの作成]** を選択します。

集約ルールが作成されて有効化されると、ログイベントは中央アカウントへの統合が開始されます。同一名のロググループはマージされてログ管理が効率化され、ログストリームには送信元アカウント ID と送信元 Region の識別子が付加されます。さらに、ログイベントには新しいシステムフィールド（@aws.account および @aws.region）が追加され、ログデータの送信元を明確にトレースできるようになります。

:::info
CloudWatch ログ一元化機能は、一元化ルールを作成した後にソースアカウントに届く新しいログデータのみを処理します。過去のログデータ（ルール作成前に存在していたログ）は一元化されません。
:::

### 集中化ルールの検証

**ルールの正常性を確認します。**

1. **CloudWatch** → **Settings** → **Organization** タブ → **Manage rules** に移動します。
2. ルールのステータスが **HEALTHY** であることを確認します。

**集中管理メトリクスのモニタリング：**

- **IncomingCopiedBytes**: 宛先アカウントにレプリケートされた非圧縮バイト単位のログデータ量（ゼロ以外で一定であること）
- **IncomingCopiedLogEvents**: 宛先アカウントにレプリケートされたログイベントの数
- **OutgoingCopiedBytes**: ソースアカウントから宛先アカウントに送信された非圧縮バイト単位のログデータ量
- **OutgoingCopiedLogEvents**: ソースアカウントから宛先アカウントに送信されたログイベントの数
- **CentralizationError**: レプリケーション中に発生したエラーの数。ゼロであるべきです — エラーが発生した場合はアラームを設定してください
- **CentralizationThrottled**: 集約処理がスロットリングされた回数。レプリケーションに影響する可能性のあるスロットリングを監視してください

### CloudWatch Logs 集約のログストレージコストの最適化

CloudWatch Logs の集中管理は、複数のアカウントおよびリージョンにわたるログ管理に対してコスト効率の高い料金体系を提供します。集中管理されたログの最初のコピーには、追加の取り込み料金やリージョン間のデータ転送コストは発生せず、お客様は標準の CloudWatch ストレージコストおよび機能の料金をお支払いいただきます。最初の集中管理を超える追加コピーについては、GB あたりの追加料金が発生します（バックアップリージョン機能を使用した場合も追加コピーが作成されます）。現在の料金の詳細については、[CloudWatch の料金ページ](https://aws.amazon.com/cloudwatch/pricing/)をご覧ください。CloudWatch Logs の集中管理を使用しながらコストを最適化するために、以下のベストプラクティスの実装をお勧めします。

1. **階層型保持戦略を実装する**

    2 層の保持ポリシーを実装することで、ストレージコストを大幅に削減できます。

    - ソースアカウントは、即時の運用ニーズに対応するために短期保持期間（**7〜30 日**）を設定してください。
    - 集中管理アカウントには、コンプライアンス要件を満たし、履歴分析をサポートするために、より長い保持期間（**90 日以上**）を設定してください。

2. **選択的な一元化を使用する**

    ログの追加コピーを作成する際は、集中管理のアプローチを戦略的に行ってください。

    - **ロググループフィルター**を活用して、特定のアプリケーションやサービスのみを一元化します。
    - ビジネス要件に合致するログのみを特定して一元化します。
    - 特定のユースケースに役立たない不要なログデータの一元化は避けます。

3. **バックアップ戦略**

    バックアップ戦略を計画する際は、次の要素を考慮してください。

    - バックアップコピーは追加コピーとして扱われ、GB あたりの追加料金が発生することに注意してください。現在の料金については、[CloudWatch の料金ページ](https://aws.amazon.com/cloudwatch/pricing/)を参照してください。
    - 専用バックアップを中央アカウントに集約する特定の要件がある場合にのみ、バックアップの一元化を有効にしてください。
    - 追加料金を排除するために、ソースアカウントをバックアップコピーとして活用することを検討してください。

これらの最適化戦略を実装することで、コストを管理しながら効果的なログ管理を維持できます。


### CloudTrail Lake インジェストの停止

CloudTrail イベントの CloudWatch への取り込みを有効にし、少なくとも 24 時間にわたってイベントが正しく流れていることを確認したら、CloudTrail Lake イベントデータストアへの取り込みを無効にします。これにより、両サービス間での重複した取り込み料金を防ぐことができます。CloudTrail Lake 内の過去のデータは、新しい取り込みを停止した後もクエリのために完全にアクセス可能な状態が維持されます。

1. **CloudTrail コンソール** → **Lake** → **イベントデータストア**に移動します
2. **イベントデータストア**を選択します
3. **取り込みの停止**を選択します（これにより、クエリ用の既存データが保持されます）
4. アクションを確認します

:::info
取り込みを停止しても、既存のデータは削除されません。保持期間が終了するか、EDS を削除するまで、CloudTrail Lake の履歴データを引き続きクエリできます。
:::
---

### CloudWatch Unified Data Store を使用したセキュリティ可視性ダッシュボード

CloudWatch に集約された CloudTrail データを使用すると、CloudWatch Unified Data Store のデフォルトファセットを活用した事前構築済みの CloudWatch Dashboard をデプロイできます。例えば、 `@data_source_name` すべてのロググループにわたって CloudTrail アクティビティを動的に検出およびクエリできます。ロググループ名への依存は一切ありません。このダッシュボードは、API アクティビティパターン、セキュリティイベント、コンプライアンス状況をほぼリアルタイムで可視化し、インシデント調査時のクロスサービス相関のために CloudTrail と VPC Flow Log のデータを並べて表示します。

AWS CloudFormation を使用したステップバイステップのデプロイガイド（ダッシュボードウィジェットの説明とクエリの解説を含む）については、[CloudWatch Unified Data Store を使用したセキュリティ可視性ダッシュボード](https://aws-samples.github.io/solutions/AWS%20CloudTrail/security-dashboard-uds)を参照してください。

---

## クエリ変換ガイド — CloudTrail Lake SQL から CloudWatch Logs Insights へ

移行において最も重要な側面の一つは、既存の CloudTrail Lake SQL クエリを CloudWatch Logs Insights の同等のクエリに変換することです。[CloudWatch Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html) は、**Logs Insights QL**、**OpenSearch PPL**、**OpenSearch SQL** の 3 つのクエリ言語をサポートしており、データのクエリ方法に柔軟性をもたらします。

:::info
CloudWatch Logs Insights は自然言語によるクエリ生成をサポートしています。平易な英語で検索内容を記述すると、AI アシスト機能がクエリを生成し、行ごとの説明を提供します。これは、複雑な CloudTrail Lake SQL クエリを変換する際に特に役立ちます。
:::

---

## 移行された環境のセキュリティベストプラクティス

CloudWatch における CloudTrail データのセキュリティ確保には、IAM ポリシー、暗号化、削除保護、リソースベースのポリシー、および継続的なモニタリングを組み合わせた、包括的な多層アプローチが必要です。適切なセキュリティコントロールにより、ログデータが脆弱性ではなく監査およびコンプライアンスのための資産であり続けることが保証されます。これには、最小権限アクセス、データ分類に基づくロググループ設計、および重要な監査証跡の誤削除や悪意ある削除に対する保護が含まれます。

これらのコントロールの実装に関する詳細なガイダンス（ロググループ階層の設計、きめ細かな権限管理、暗号化のベストプラクティスを含む）については、[CloudWatch Logs のセキュリティのベストプラクティス](/observability-best-practices/ja/tools/logs/security/cloudwatch-logs-security-best-practices/)を参照してください。
