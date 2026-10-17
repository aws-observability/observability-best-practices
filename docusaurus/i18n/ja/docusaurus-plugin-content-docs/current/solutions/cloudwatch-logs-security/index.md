---
title: CloudWatch Logs セキュリティベストプラクティス
sidebar_label: CloudWatch Logs セキュリティ
---

import RelatedEvents from '@site/src/components/RelatedEvents';

# CloudWatch Logs のセキュリティベストプラクティス

Amazon CloudWatch Logs のセキュリティ確保は、コンプライアンスの維持、機密データの保護、適切な監査証跡の確保に不可欠です。このガイドでは、重要な削除保護機能を含め、ロググループに対する堅牢な権限制御とセキュリティポリシーを実装するための包括的なベストプラクティスを提供します。

## 概要

Amazon CloudWatch Logs は、システム、アプリケーション、AWS サービスからのログを単一のスケーラブルなサービスに一元化することを可能にします（[Amazon CloudWatch Logs とは](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html)）。しかし、適切なセキュリティ制御がなければ、ログデータは資産ではなく脆弱性になる可能性があります。このガイドでは、最小権限アクセス、暗号化、リソースベースポリシー、削除保護、包括的な監査の実装に焦点を当て、ロググループの安全性とコンプライアンスを維持します。


## 使用するタイミング

- **ログデータに機密情報が含まれている場合** — ログデータには、ユーザーアクティビティ、システム設定、API コール、潜在的に個人識別情報（PII）が含まれることがよくあります。ログへの不正アクセスは、インフラストラクチャ、アプリケーションの動作、ビジネスオペレーションに関する重要なセキュリティ詳細を公開する可能性があります。
- **ロググループの偶発的または悪意のある削除を防止する必要がある場合** — ロググループの偶発的または悪意のある削除は、重要な監査証跡の損失やコンプライアンス違反につながる可能性があります。
- **規制コンプライアンス要件を満たす必要がある場合** — 多くの規制フレームワークでは、アクセス制限、保存時および転送中の暗号化、保持ポリシー、削除保護、監査証跡など、ログデータに関する特定の制御が求められます。適切な権限管理と削除保護は、これらの要件を満たすための基盤です。
- **セキュリティと運用効率のバランスを取りたい場合** — 適切に構造化された権限により、チームは必要なログにアクセスしつつ、不要な変更や削除を防止できます。このバランスは、データの整合性を維持しながら、セキュリティと運用効率の両方をサポートします。



## ガイダンス

CloudWatch Logs のセキュリティは、複数層のアクセス制御、削除保護、暗号化メカニズムが連携してログデータを保護することで機能します。包括的なセキュリティの実装には、IAM ポリシー、削除保護、暗号化、リソースポリシー、継続的なモニタリングを組み合わせた多層アプローチが必要です。

### 1. CloudWatch Logs の階層とセキュリティ境界

CloudWatch Logs のアーキテクチャを理解することは、効果的なセキュリティ制御の実装に不可欠です。適切なログ構成と階層設計は、他のすべてのセキュリティ対策の基盤となります。

CloudWatch Logs は、セキュリティ制御に直接影響する 2 レベルの階層を使用します（[ロググループとログストリームの操作](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/Working-with-log-groups-and-streams.html)）：

*   **ロググループ**：保持ポリシー、暗号化設定、アクセス権限、削除保護を定義するトップレベルコンテナです。各ロググループは、独自の IAM ポリシーと KMS 暗号化キーを持つセキュリティ境界として機能します
*   **ログストリーム**：ロググループ内のログイベントの個別のシーケンスで、通常は単一のソース（EC2 インスタンス、Lambda 関数、アプリケーションプロセスなど）を表します。ログストリームは親ロググループからセキュリティ設定を継承しますが、きめ細かいアクセス制御のために IAM ポリシーで個別にターゲット指定できます

#### セキュリティ駆動のロググループ設計

セキュリティ要件とアクセスパターンに合わせてロググループ構造を設計してください（[CloudWatch Logs 権限リファレンス](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/permissions-reference-cwl.html)）：

*   **アプリケーション分離**：異なるアプリケーション、特に機密データを扱う場合は個別のロググループを作成し、きめ細かい IAM ポリシーを有効にし、アプリケーション間のログアクセスを防止してください
*   **環境分離**：本番、ステージング、開発環境で別々のロググループを使用し、異なるアクセス制御と保持ポリシーを適用してください
*   **データ分類**：機密レベル（パブリック、内部、機密、制限付き）別にログをグループ化し、適切な暗号化、アクセス制御、保持ポリシーを適用してください
*   **コンプライアンス境界**：監査ログ、セキュリティログ、特別な取り扱いとより長い保持期間が必要なコンプライアンス関連データ用に専用のロググループを作成してください

#### ログストリームによるきめ細かいアクセス制御

ロググループがプライマリセキュリティ境界を提供する一方、ログストリームはきめ細かいアクセスパターンを可能にします（[CloudWatch Logs のアクション、リソース、条件キー](https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazoncloudwatchlogs.html)）：

*   **インスタンスレベルアクセス**：IAM ポリシーでログストリーム名を使用して、特定の EC2 インスタンスまたはコンテナからのログのみにユーザーアクセスを付与してください
*   **時間ベースアクセス**：作成時間または命名パターンに基づいてログストリームへのアクセスを制限するポリシーを実装してください
*   **サービス固有ストリーム**：アプリケーションが指定されたログストリームにのみ書き込み、同じロググループ内の他のストリームへのアクセスを防止できるようにしてください
*   **監査証跡の整合性**：ログストリームの不変性（一度作成されるとログイベントは変更できない）を監査およびコンプライアンス戦略の一部として使用してください

### 2. アイデンティティベースポリシー（IAM ポリシー）

*   IAM ポリシーを使用して、ロググループとログストリームの作成、読み取り、管理を制御してください（[CloudWatch Logs のアイデンティティベースポリシーの使用](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/iam-identity-based-access-control-cwl.html)）
    - **最小権限の原則を適用する**：組織のニーズに基づいて特定のロググループへのアクセスを制限するカスタマーマネージドポリシーを作成してください
    - **具体的なリソース ARN を使用する**：IAM ポリシーではワイルドカード（*）を使用する代わりに、常に明示的なロググループ ARN を指定してください。これにより権限昇格を防止し、ユーザーが意図したロググループのみにアクセスできるようにします
    - **管理権限と運用権限を分離する**：異なる権限レベル用に個別のポリシーを作成してください。例えば、アナリスト向けの読み取り専用アクセス、アプリケーション向けの書き込み権限、インフラストラクチャチーム向けの管理権限です。これらを単一の過度に寛容なポリシーに統合しないでください
    - **削除操作を明示的に拒否する**：重要なロググループでは、削除保護を超える追加の保護として、削除操作に対する明示的な拒否ステートメントを実装してください

*   CloudWatch にログを記録する Lambda 関数については、IAM ロールに最低限必要な権限（`logs:CreateLogGroup`、`logs:CreateLogStream`、`logs:PutLogEvents`）が含まれていることを確認してください（[Lambda 実行ロール](https://docs.aws.amazon.com/lambda/latest/dg/lambda-intro-execution-role.html)）

*   ロググループを変更または削除できる特権アカウントには MFA を実装してください（[アクセス権限の管理の概要](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/iam-access-control-overview-cwl.html)）

*   **タグベースのアクセス制御を実装する**：ロググループのリソースタグと IAM 条件キー（`aws:ResourceTag`）を組み合わせて、環境（本番/開発）、チーム所有権、データ分類レベルなどの属性に基づいてアクセスを動的に制御してください（[CloudWatch Logs のアクション、リソース、条件キー](https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazoncloudwatchlogs.html)）

### 3. 重要なロググループの削除保護

削除保護は、Amazon CloudWatch Logs が導入した重要なセキュリティ機能で、ロググループとそれに関連するログストリームの偶発的または悪意のある削除を防止します。有効にすると、明示的に無効化されるまですべての削除操作がブロックされ、重要な運用およびコンプライアンスデータの保護に役立ちます。この機能は、トラブルシューティング、分析、規制要件のために保持する必要がある監査ログ、コンプライアンス記録、本番アプリケーションログの保護に特に有用です。（[ロググループの削除からの保護](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/protecting-log-groups-from-deletion.html)）

#### 主な特徴：
- **予防的制御**：削除の試行が発生する前に阻止する予防的セキュリティ制御として機能します
- **明示的な無効化が必要**：削除操作を行う前に明示的に無効化する必要があります
- **ログストリームにも適用**：ロググループとその中のすべてのログストリームを保護します
- **パフォーマンスへの影響なし**：ログの取り込み、クエリ、その他の操作に影響しません
- **監査証跡**：削除保護ステータスのすべての変更は CloudTrail に記録されます

#### 重要なユースケース — 削除保護を有効にする場合：
- **監査ログ**：コンプライアンスを維持し監査証跡の改ざんを防止するため、すべての監査ログで削除保護を有効にする必要があります
- **セキュリティログ**：AWS CloudTrail、VPC Flow Logs、アプリケーションセキュリティログを含むセキュリティ関連のログ
- **コンプライアンスログ**：規制コンプライアンスに必要なすべてのログ
- **本番アプリケーションログ**：トラブルシューティングとインシデント対応に必要な本番ログ
- **長期保持ログ**：1 年を超える保持要件を持つすべてのログ

#### 実装のベストプラクティス：
-   **重要なロググループで有効にする**：すべての重要なログについて、ロググループの作成時または既存のロググループで削除保護を有効にしてください。これは偶発的または悪意のある削除に対する最初の防御線です
-   **デプロイを自動化する**：AWS CloudFormation、AWS CDK、Terraform などの Infrastructure as Code（IaC）ツールを使用して、新しいロググループの作成時に削除保護を自動的に有効にしてください。これにより、環境全体で一貫したセキュリティポスチャが確保されます
-   **手順を文書化する**：削除保護をいつ、どのように無効にするかについて、明確なドキュメントとランブックを作成してください。承認ワークフロー、正当化要件、再有効化手順を含め、絶対に必要な場合にのみ一時的に無効にされるようにしてください
-   **変更を監視する**：重要なロググループで削除保護が無効になった場合を検出する CloudWatch アラームとメトリクスフィルターを作成してください。発生時にセキュリティチームに即座にアラートし、変更が承認されたものかどうかを調査してください
-   **多層防御**：削除操作を明示的に拒否する IAM ポリシーと組み合わせて削除保護を使用してください。これにより多層防御が提供されます — 削除保護が無効になっても、IAM ポリシーが不正な削除を防止できます

#### 複数の保護レイヤーの組み合わせ：
-   ロググループで削除保護を有効にする（[ロググループの削除からの保護](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/protecting-log-groups-from-deletion.html)）
-   `logs:DeleteLogGroup` と `logs:PutLogGroupDeletionProtection` に対する明示的な Deny ステートメントを持つ IAM ポリシーを使用する（[CloudWatch Logs 権限リファレンス](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/permissions-reference-cwl.html)）
-   組織レベルでサービスコントロールポリシー（SCP）を適用する（[サービスコントロールポリシー](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html)）
-   重要な操作に MFA 削除要件を有効にする（[AWS Re:Post：CloudWatch でのログまたはロググループの復元または削除防止](https://repost.aws/knowledge-center/cloudwatch-prevent-logs-deletion)）
-   AWS Config を使用して削除保護ステータスを監視する（[AWS Config](https://docs.aws.amazon.com/config/latest/developerguide/how-does-config-work.html)）
-   無効化された場合に保護を再有効化する自動修復を実装する（[AWS Config による非準拠リソースの修復](https://docs.aws.amazon.com/config/latest/developerguide/remediation.html)）

### 4. カスタマーマネージド KMS キーによる暗号化

機密ロググループにはカスタマーマネージド KMS キーを実装し、暗号化キーの完全な制御を維持し、キーローテーションを有効にし、キー使用の詳細な監査証跡を作成してください。

#### 暗号化アーキテクチャ

*   CloudWatch Logs は、AES-GCM を使用したサーバーサイド暗号化でデフォルトでログデータを保存時に暗号化します（[AWS Key Management Service を使用した CloudWatch Logs のログデータの暗号化](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/encrypt-log-data-kms.html)）
*   制御を強化するために、AWS KMS カスタマーマネージドキーを使用してロググループを暗号化し、暗号化キーとアクセスポリシーを管理できるようにしてください（[AWS Key Management Service を使用した CloudWatch Logs のログデータの暗号化](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/encrypt-log-data-kms.html)）
*   ロググループの作成時に暗号化を設定するか、既存のものを KMS 暗号化を使用するように更新してください（[AWS Re:Post：AWS KMS を使用した CloudWatch Logs のログデータの暗号化](https://repost.aws/knowledge-center/cloudwatch-encrypt-log-data)）

#### 暗号化のベストプラクティス：
*   **機密ログに KMS 暗号化を有効にする**：機密データを含むロググループには、カスタマーマネージド KMS キーを関連付けてください。これにより、キーポリシーによる制御が強化され、キーローテーションが可能になり、すべての暗号化/復号操作の詳細な CloudTrail ログが作成されます
*   **適切な KMS キーポリシーを設定する**：KMS キーポリシーは、CloudWatch Logs サービスプリンシパル（`logs.amazonaws.com`）に暗号化と復号のためにキーを使用する権限を付与する必要があります。特定のロググループと AWS アカウントに使用を制限する条件を含めてください
*   **キーローテーションを実装する**：CloudWatch Logs で使用する KMS キーの自動キーローテーションを有効にしてください。AWS はカスタマーマネージドキーを毎年自動的にローテーションしながら、以前のキーバージョンで暗号化されたデータへのアクセスを維持します
*   **KMS キーの使用を監視する**：CloudTrail を使用して、ログ暗号化キーに関連するすべての KMS API コールを監視してください。過度な復号操作や不正なキーアクセス試行などの異常なパターンに対して CloudWatch アラームを設定してください

### 5. Data Protection ポリシー

CloudWatch Logs Data Protection は、機械学習とパターンマッチングを使用して、ロググループ内の機密データを検出、保護、監査する機能です（[マスキングによる機密ログデータの保護](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/mask-sensitive-log-data.html)）。この機能は、個人識別情報（PII）、認証情報、金融データなどの機密情報についてログイベントを自動的にスキャンし、設定に基づいてデータを監査またはマスクします。Data Protection ポリシーはログイベントの取り込み時にリアルタイムで機能し、アプリケーションやログソースの変更を必要とせずに即座に保護を提供します。

*   **Data Protection ポリシーを設定する**：マネージドデータ識別子を使用して機密情報を自動的に検出・マスクする CloudWatch Logs Data Protection ポリシーを実装してください（[個人識別情報（PII）](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/protect-sensitive-log-data-types-pii.html)）
*   **保護操作を選択する**：セキュリティ要件に基づいて、監査操作（機密データの監視と報告）または非識別化操作（リアルタイムでの機密データのマスキング）のいずれかを設定してください（[CloudWatch Logs マネージドデータ識別子](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL-managed-data-identifiers.html)）
*   **包括的なデータカバレッジ**：以下を含む複数のカテゴリの機密データを保護します：
    - **認証情報**：AWS シークレットキー、SSH プライベートキー、PGP プライベートキー、PKCS プライベートキー
    - **金融情報**：クレジットカード番号、銀行口座番号、セキュリティコード
    - **個人情報**：メールアドレス、氏名、住所、IP アドレス、車両識別番号
    - **地域固有**：運転免許証、税金 ID、郵便番号などの国固有の識別子
*   **キーワード近接検出**：機密データパターンから 30 文字以内のキーワードをスキャンする高度な検出を活用し、偽陽性を削減します
*   **グローバルカバレッジ**：Data Protection ポリシーはロググループの地理的位置に関係なく機能し、ISO 国コードを使用した地域固有のデータ識別子をサポートします
*   **Amazon Macie との統合**：AWS 環境全体での機密データの検出と分類を強化するために、CloudWatch Logs と組み合わせて Amazon Macie を使用してください（[AWS ブログ：Amazon CloudWatch Logs Data Protection で機密ログデータの検出と保護を支援する方法](https://aws.amazon.com/blogs/mt/how-amazon-cloudwatch-logs-data-protection-can-help-detect-and-protect-sensitive-log-data/)）

### 6. ログの保持とライフサイクル管理

CloudWatch Logs のログ保持は、ログイベントが自動的に削除されるまでの保存期間を制御し、コンプライアンス要件とストレージコストのバランスを取るのに役立ちます（[CloudWatch Logs でのログデータ保持の変更](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/Working-with-log-groups-and-streams.html#SettingLogRetention)）。デフォルトでは、CloudWatch Logs はログデータを無期限に保存しますが、ロググループレベルで 1 日から 10 年の保持期間を設定できます。適切なライフサイクル管理により、規制要件、運用ニーズ、コスト最適化の目標に基づいて機密データが適切な期間保持され、不要になったデータが自動的にパージされます。

*   **保持期間を設定する**：コンプライアンス要件と運用ニーズに基づいて、ロググループの適切な保持期間を設定してください。デフォルトではログデータは無期限に保存されますが、1 日から 10 年の保持期間を設定できます（[CloudWatch Logs でのログデータ保持の変更](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/Working-with-log-groups-and-streams.html#SettingLogRetention)）
*   **データ分類ベースのポリシーを適用する**：データの機密性と分類に基づいて異なる保持ポリシーを実装してください：
    - **重要/監査ログ**：コンプライアンス要件のための長期保持（7 年以上）
    - **セキュリティログ**：フォレンジック分析のための延長保持（1〜3 年）
    - **アプリケーションログ**：トラブルシューティングのための中期保持（30〜90 日）
    - **デバッグ/開発ログ**：コスト最適化のための短期保持（1〜7 日）
*   **コスト最適化**：コンプライアンスニーズとストレージコストのバランスを取るために、保持期間を定期的に見直し、調整してください。保持期間が満了すると、古いログデータは自動的に削除されます
*   **ライフサイクル管理のためのタグ付け**：環境、アプリケーション、データ分類、保持要件別にロググループを分類するための一貫したタグ付け戦略を使用して、自動化されたポリシー適用を実現してください（[Amazon CloudWatch Logs でのロググループのタグ付け](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/Working-with-log-groups-and-streams.html#log-group-tagging)）
*   **一元化との統合**：ログの一元化を使用する場合、コンプライアンス要件を維持するために、ソースアカウントと宛先アカウントの間で保持ポリシーが一貫して適用されるようにしてください

### 7. ログ送信先のリソースベースポリシー

CloudWatch Logs のリソースベースポリシーは、クロスアカウントサブスクリプションを有効にするために**送信先**に特化して使用されます（[クロスアカウント・クロスリージョンサブスクリプション](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CrossAccountSubscriptions.html)）。アイデンティティベースの IAM ポリシーを使用するロググループとは異なり、送信先はリソースベースポリシーをサポートしており、Kinesis Data Streams、Kinesis Data Firehose、Lambda 関数などの送信先リソースにどの外部 AWS アカウントがロググループをサブスクライブできるかを指定します（[アクセス権限の管理の概要](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/iam-access-control-overview-cwl.html#resource-based-policies-cwl)）。

#### 送信先とリソースベースポリシーを使用する場合：

*   **ログ送信先**：送信先は、サブスクリプションフィルターからログデータを受信できる AWS サービス（Kinesis Data Streams、Kinesis Data Firehose、Lambda 関数）を表す CloudWatch Logs リソースです
*   **クロスアカウントログストリーミング**：他の AWS アカウントが一元化された処理インフラストラクチャにログデータをストリーミングすることを許可する場合、送信先にリソースベースポリシーを使用してください
*   **一元化されたログ処理**：複数のアカウントが中央アカウントの Kinesis ストリームまたは Firehose にログを送信し、統合された分析、セキュリティモニタリング、コンプライアンス処理を行うシナリオを有効にします
*   **サードパーティ統合**：厳格なアクセス制御を維持しながら、パートナーアカウントやサービスプロバイダーが処理システムにログデータを送信することを許可します

#### 送信先のリソースベースポリシーのベストプラクティス：
*   **正確なソースアカウントを指定する**：送信先ポリシーでは、サブスクリプションの作成を許可する AWS アカウント ID を明示的に指定してください。アカウント ID にワイルドカード（*）を使用しないでください（[ステップ 1：送信先を作成する](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CreateDestination.html)）
*   **最小権限アクセスを使用する**：必要最小限の権限のみを付与してください — 通常は特定の送信先 ARN に対する `logs:PutSubscriptionFilter` のみです
*   **条件キーを実装する**：ソース IP 制限、時間ベースアクセス、MFA 要件などの追加のセキュリティレイヤーを追加するために IAM 条件キーを使用してください
*   **定期的なポリシー監査**：送信先ポリシーが現在の要件を引き続き反映していることを定期的に確認してください。廃止されたアカウントのアクセスを削除し、過度に寛容なポリシーを厳格化してください
*   **サブスクリプションアクティビティを監視する**：CloudTrail を使用して `PutSubscriptionFilter` および `DeleteSubscriptionFilter` API コールを監視し、どのアカウントが送信先へのサブスクリプションを作成または削除しているかを追跡してください

### 8. AWS Organizations によるログの一元化

ログの一元化は AWS Organizations の機能で、クロスアカウントおよびクロスリージョンの一元化ルールを使用して、複数のメンバーアカウントと AWS リージョンから一元化されたアカウントにログデータを自動的にレプリケートします（[クロスアカウント・クロスリージョンログの一元化](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatchLogs_Centralization.html)）。この機能は、リソースベースポリシーやクロスアカウント IAM ロールを必要とせずに、AWS インフラストラクチャ全体の一元化されたモニタリング、分析、コンプライアンスのためのログ統合を効率化します。バックアップリージョンの設定やソースアカウントからコピーされたロググループの暗号化動作の完全な制御など、運用およびセキュリティ要件を満たすための設定の柔軟性を提供します。

#### AWS セキュリティリファレンスアーキテクチャとの整合

AWS セキュリティリファレンスアーキテクチャ（AWS SRA）のベストプラクティスに従い、CloudWatch Logs の一元化は全体的なセキュリティアカウント構造と整合させる必要があります（[AWS セキュリティリファレンスアーキテクチャ](https://docs.aws.amazon.com/prescriptive-guidance/latest/security-reference-architecture/introduction.html)）：

*   **Log Archive アカウントを委任管理者に指定する**：AWS Organization の CloudWatch 委任管理者として専用の Log Archive アカウントを設定してください。このアカウントは、すべてのセキュリティ関連ログの取り込みとアーカイブに専用であり、制御されたアクセスメカニズムを持つ不変のストレージを提供します
*   **Security OU に一元化する**：すべての CloudWatch Logs 一元化ルールを、Security 組織単位（OU）内の Log Archive アカウントにログをレプリケートするよう設定し、本番ワークロードからの分離と一貫したセキュリティ制御を確保してください
*   **既存のログインフラストラクチャと統合する**：Log Archive アカウントの既存のセキュリティインフラストラクチャ（カスタマーマネージド KMS 暗号化キー、IAM アクセス制御パターン、VPC エンドポイント、他のセキュリティログ用に既に確立されているモニタリングフレームワーク）を活用し、一元化されたロググループのプライマリストレージとして CloudWatch Logs を維持してください
*   **多層防御を実装する**：他の重要なログに使用されるのと同じセキュリティ原則（最小権限アクセス、カスタマーマネージド KMS キーによる暗号化、不変性のための削除保護、包括的なモニタリング）を適用してください

#### ログ一元化のベストプラクティス：
*   **組織構造を確立する**：Log Archive アカウントを CloudWatch 委任管理者に指定し、組織全体のすべてのメンバーアカウントからログをレプリケートする一元化ルールを作成してください
*   **一貫したセキュリティ制御を適用する**：以下を含む、すべての一元化されたロググループに統一されたセキュリティポリシーを実装してください：
    - **暗号化**：他のセキュリティログ用に Log Archive アカウントで既に確立されているものと同じカスタマーマネージド KMS キーを使用してください
    - **アクセスポリシー**：既存のログアクセス制御と職務分離に整合する一貫した IAM ポリシーを適用してください
    - **保持期間**：コンプライアンス要件を満たし、既存のログライフサイクル管理と統合する保持ポリシーを設定してください
*   **一元化の健全性を監視する**：CloudWatch メトリクスとコンソールモニタリングを使用して、一元化ルールの健全性ステータスを追跡し、レプリケーションの問題を特定し、すべてのメンバーアカウントからの継続的なログフローを確保してください
*   **既存のログソースと統合する**：CloudWatch Logs の一元化を、Log Archive アカウントに既にフローしている他のログソース（CloudTrail、VPC Flow Logs、GuardDuty の検出結果）と連携させ、統一されたログ管理と分析を実現してください
*   **データレジデンシー向けに複数の一元化ルールを設定する**：データレジデンシーとコンプライアンス要件に対応するために、複数の一元化ルールを使用してください：
    - **リージョンデータレジデンシー**：GDPR、データ主権法、組織ポリシーなどの規制で求められる特定の地理的境界内にログデータが留まるよう、異なるリージョン用に別々の一元化ルールを作成してください
    - **コンプライアンスベースの分離**：業界固有のコンプライアンス要件を満たすために、異なるタイプの機密データ（金融、医療、個人データ）に対して個別の一元化ルールを設定してください
    - **マルチリージョンバックアップ戦略**：データレジデンシーの制約を尊重しながら、災害復旧のために重要なログを複数のリージョンにレプリケートする一元化ルールを実装してください
    - **選択的ログルーティング**：データ分類とレジデンシー要件に基づいて、特定のログタイプを適切な宛先アカウントとリージョンにルーティングするために一元化ルールフィルターを使用してください
*   **一元化の健全性を監視する**：CloudWatch メトリクスとコンソールモニタリングを使用して、一元化ルールの健全性ステータスを追跡し、レプリケーションの問題を特定してください
*   **一元化されたセキュリティ制御を実装する**：統一されたセキュリティポスチャを維持するために、すべての一元化されたロググループに一貫したセキュリティポリシー、暗号化設定、アクセス制御を適用してください

### 9. CloudWatch Logs 用の VPC エンドポイント

VPC エンドポイントを使用して、VPC と CloudWatch Logs 間のプライベート接続を確立し、ログトラフィックを AWS ネットワーク内に保持し、ネットワーク分離によるセキュリティを強化してください。

*   **プライベート接続を有効にする**：インターフェース VPC エンドポイントを使用して、インターネットを経由せずに CloudWatch Logs にログを送信してください（[CloudWatch Logs でのインターフェース VPC エンドポイントの使用](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/cloudwatch-logs-and-interface-VPC.html)）
*   **複数のエンドポイントのサポート**：CloudWatch Logs には 2 つの VPC エンドポイントが必要です：
    - 標準 CloudWatch Logs API 用の `com.amazonaws.region.logs`
    - StartLiveTail や GetLogObject などのストリーミング API 用の `com.amazonaws.region.stream-logs`
*   **FIPS エンドポイントのサポート**：コンプライアンスに必要な場合は、FIPS 準拠エンドポイント（`logs-fips` と `stream-logs-fips`）を使用してください
*   **VPC エンドポイントポリシーを実装する**：VPC エンドポイントを介した CloudWatch Logs アクションを制限するためにエンドポイントポリシーを使用してください。例えば、ログの作成と取り込みのみを許可し、管理操作を防止します
*   **VPC コンテキストキーを活用する**：IAM ポリシーで `aws:SourceVpc` と `aws:SourceVpce` 条件キーを使用して、CloudWatch Logs が特定の VPC エンドポイントを介してのみアクセスできるようにしてください
*   **ネットワーク境界セキュリティ**：機密のセキュリティおよび監査情報を含むログは、制御されたネットワーク境界内に留まり、パブリックエンドポイントを介した偶発的なデータ流出を防止します

### 10. モニタリングと監査

#### 包括的なロギングの有効化：
*   **CloudTrail ロギングを有効にする**：CloudTrail がすべてのリージョンで有効になっており、CloudWatch Logs API コールを記録するよう設定されていることを確認してください。モニタリングと分析のために、CloudTrail イベントを CloudWatch Logs ロググループに直接送信するよう設定してください（[CloudWatch Logs へのイベント送信](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/send-cloudtrail-events-to-cloudwatch-logs.html)）
*   不正アクセスの試行や異常なパターンを検出するために CloudWatch アラームを設定してください（[Amazon CloudWatch アラームの使用](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html)）
*   Organizations を使用して複数のアカウントにわたる一元化されたロギングを実装してください（[CloudWatch Logs でのクロスアカウントログデータの共有](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CrossAccountSubscriptions.html)）
*   IAM ポリシーによるログ削除の防止を通じて、不変の監査証跡を維持してください
*   異なる機密レベルのアプリケーション用に個別のロググループを作成してください

#### モニタリングのベストプラクティス：
*   **ログ取り込みメトリクスを監視する**：組み込みの CloudWatch メトリクスを使用して、ログ取り込みパターンを追跡し、異常を検出してください（[CloudWatch Logs メトリクス](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch-Logs-Monitoring-CloudWatch-Metrics.html)）：
    - **IncomingLogEvents**：セキュリティインシデント、アプリケーションの問題、不正なログソースを示す可能性のある異常なスパイクや低下を検出するために、取り込まれたログイベント数を監視してください
    - **IncomingBytes**：潜在的なデータ流出の試みや過度のロギングによるサービス拒否攻撃を特定するために、取り込まれるログデータ量を追跡してください
    - **DeliveryErrors**：ログ送信先の改ざんや監査証跡に影響するインフラストラクチャの問題を示す可能性のある、ログ配信の失敗を監視してください
    - **ベースラインしきい値を設定する**：通常の取り込みパターンを確立し、許容可能な分散範囲を超える逸脱に対して CloudWatch アラームを作成してください

*   **異常検出に CloudWatch Contributor Insights を活用する**：Contributor Insights を使用して、ログデータパターンを分析し、異常なアクティビティを特定してください（[CloudWatch Contributor Insights を使用した高カーディナリティデータの分析](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContributorInsights.html)）：
    - **トップトーカー分析**：最大量のログコントリビューター（IP アドレス、ユーザーエージェント、API エンドポイント）を特定し、潜在的な悪用、ボットアクティビティ、セキュリティ脅威を検出してください
    - **エラーパターン検出**：エラーログを分析して、セキュリティインシデントを示す可能性のある異常なエラーパターン、認証失敗の試行、疑わしいアクセスパターンを特定してください
    - **リソース使用量モニタリング**：どのユーザー、アプリケーション、サービスが最も多くのログデータを生成しているかを追跡し、潜在的な悪用や不正なアクティビティを特定してください
    - **時間ベース分析**：時系列分析を使用して、侵害を示す可能性のある営業時間外の異常なアクティビティパターンや予期しないトラフィックスパイクを検出してください
*   **セキュリティイベントアラームを作成する**：不正なロググループの削除、削除保護の変更、権限の変更、暗号化キーの関連付け解除、異常なクエリパターンなどの疑わしいアクティビティを検出するために、メトリクスフィルターとアラームを設定してください（[メトリクスフィルターの作成](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/MonitoringLogData.html)）
*   セキュリティメトリクスとアクセスパターンを可視化するために CloudWatch ダッシュボードを設定してください（[Amazon CloudWatch ダッシュボードの使用](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Dashboards.html)）
*   高度なログ分析と異常検出には CloudWatch Logs Insights を使用してください（[CloudWatch Logs Insights によるログデータの分析](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html)）
*   CloudWatch Logs の設定変更を監視するために AWS Config を使用してください（[Amazon EventBridge による AWS Config のモニタリング](https://docs.aws.amazon.com/config/latest/developerguide/monitor-config-with-cloudwatchevents.html)）
*   ロギングに関連するセキュリティの検出結果を集約・優先順位付けするために AWS Security Hub を実装してください（[AWS Security Hub ユーザーガイド](https://docs.aws.amazon.com/securityhub/latest/userguide/what-is-securityhub.html)）
*   **失敗したアクセス試行を監視する**：CloudWatch Logs への失敗した API コール（AccessDenied エラー）を追跡するメトリクスフィルターを作成してください。不正アクセスの試行や権限昇格を示唆するパターンの場合にセキュリティチームにアラートしてください
*   **削除保護のモニタリングを実装する**：明示的な拒否ステートメントを持つ IAM ポリシーと CloudWatch アラームを使用して、削除保護の無効化や保護されたロググループの削除の試行を監視してください。組織全体の保護のために AWS Organizations サービスコントロールポリシー（SCP）の使用を検討してください

## 関連リソース

Amazon CloudWatch Logs のセキュリティ確保には、アイデンティティベースポリシー、削除保護、暗号化、Data Protection ポリシー、継続的なモニタリングを組み合わせた包括的な多層アプローチが必要であり、重要なログデータを保護します。

- [Amazon CloudWatch Logs セキュリティのドキュメント](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/security.html)
- [Amazon CloudWatch Logs とは](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html)
- [CloudWatch Logs 権限リファレンス](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/permissions-reference-cwl.html)
- [ロググループの削除からの保護](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/protecting-log-groups-from-deletion.html)
- [AWS KMS を使用した CloudWatch Logs のログデータの暗号化](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/encrypt-log-data-kms.html)
- [マスキングによる機密ログデータの保護](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/mask-sensitive-log-data.html)
- [クロスアカウント・クロスリージョンログの一元化](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatchLogs_Centralization.html)
- [CloudWatch Logs でのインターフェース VPC エンドポイントの使用](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/cloudwatch-logs-and-interface-VPC.html)

## 関連イベント

<RelatedEvents />
