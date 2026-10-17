---
title: Control Tower ランディングゾーン
sidebar_label: Control Tower ランディングゾーン
---

# Control Tower ランディングゾーン

## 概要

AWS Control Tower は、AWS サービスをオーケストレーションして、安全なマルチアカウントランディングゾーンをセットアップおよびガバナンスします。このガイドでは、ライフサイクル全体をカバーします：リージョン戦略と ID の計画、カスタマイズアプローチの選択、コントロールとドリフト管理の運用、既存の組織での Control Tower の有効化、ランディングゾーンバージョン 4.0 へのアップグレード。

ランディングゾーンのガバナンスはオブザーバビリティに直接影響します — Control Tower は、モニタリングおよびコンプライアンスパイプラインに供給する AWS Config レコーダー、CloudTrail 組織トレイル、SNS 通知を管理します。

## 使用するタイミング

- 新しいマルチアカウント AWS 環境をセットアップしており、一元化されたガバナンスが必要な場合
- ランディングゾーンのカスタマイズに AFC、CfCT、AFT、LZA のどれを選択するか決める必要がある場合
- 既存の Control Tower 環境を運用しており、ドリフト、アップデート、コントロールに関するガイダンスが必要な場合
- 既存の AWS Organization があり、Control Tower を段階的に導入したい場合
- ランディングゾーン 3.x から 4.0 にアップグレードする場合

## ガイダンス

### ランディングゾーンの計画

**リージョン戦略**：最も一般的に使用するリージョンを Control Tower のホームリージョンに指定してください。[グローバルリージョン拒否コントロール](https://docs.aws.amazon.com/controltower/latest/userguide/region-deny.html)を有効にして未使用のリージョンを制限し、攻撃対象領域を削減してガバナンスを簡素化してください。

**ID**：すべての人間のアクセスに AWS IAM Identity Center を使用してください。単一の信頼のソースを維持するために、企業の ID プロバイダーを統合してください。デフォルトの `AdministratorAccess` 権限セットをスコープされたカスタムポリシーに置き換えることで、最小権限に向けて取り組んでください。

**委任管理**：管理アカウントの使用を最小限に抑えるために、Identity Center と AWS Config の委任管理者アカウントを有効にしてください。

**組織構造**：[マルチアカウントのベストプラクティス](https://docs.aws.amazon.com/whitepapers/latest/organizing-your-aws-environment/organizing-your-aws-environment.html)に従ってください。ネストは 5 レベル以下に保ってください。Security OU またはそのアカウントを変更または削除しないでください。

### ランディングゾーンのカスタマイズ

1 つのカスタマイズアプローチを選択し、コミットしてください：

| 機能 | AFC | CfCT | AFT | LZA |
|------|-----|------|-----|-----|
| サービスマネージド | はい | いいえ | いいえ | いいえ |
| IaC エンジン | CloudFormation/Terraform | CloudFormation | Terraform | CDK |
| 運用オーバーヘッド | 低 | 中 | 高 | 中 |
| カスタマイズの柔軟性 | 限定的 | 高 | 最高 | 高 |
| プロアクティブコントロールの適用 | はい | はい | いいえ | はい |

- **AFC** — 最もシンプルなオプション。アカウントあたり 1 つのブループリント。管理するインフラストラクチャなし。
- **CfCT** — 管理アカウント内の Code Pipeline。SCP、RCP、CloudFormation テンプレートをサポート。
- **AFT** — アカウント作成を含む完全な Terraform ライフサイクル。最高の柔軟性ですが最も高い運用オーバーヘッド。
- **LZA** — 高度に規制された環境向けの意見のある CDK ベースのソリューション。

すべてのプラットフォームサービス（ネットワーキング、セキュリティツール、オブザーバビリティ）をバージョン管理、ピアレビュー、自動プロビジョニングのために Infrastructure as Code で定義してください。

### ランディングゾーンの運用

**最新の状態を維持**：セキュリティの改善と機能強化のために、ランディングゾーンのアップデートを迅速に適用してください。アップデート後は、メンバーアカウントにベースラインを反映させるために OU を再登録してください。

**アカウントの作成**：常に Account Factory を通じてアカウントを作成し、作成時に登録・ガバナンスされるようにしてください。Organizations で直接作成されたアカウントは登録されません。

**ドリフト管理**：Control Tower はドリフトを自動的に検出します。通知を受け取るために、監査アカウントで `aws-controltower-AggregateSecurityNotifications` をサブスクライブしてください。ドリフトは迅速に解決してください — ドリフトしたランディングゾーンではコンプライアンスを正確に判断できません。

**コントロール**：ガバナンスを適用するために、[コントロールカタログ](https://docs.aws.amazon.com/controltower/latest/controlreference/controls-reference.html)からコントロールを適用してください。必ず非本番 OU で最初にテストしてください。ワークロードをブロックせずに非準拠を特定するために、同等の予防的コントロールの前に検出的コントロールのデプロイを検討してください。

**修復**：非準拠リソースの手動または自動修復のために、Config ルールに [Systems Manager Automation ドキュメント](https://docs.aws.amazon.com/config/latest/developerguide/remediation.html)を関連付けてください。

**コスト意識**：AWS Config レコーダーのコスト（特に動的な環境で）を監視し、Control Tower の組織トレイルを有効にした後に既存の CloudTrail 管理トレイルを削除し、スパイクアラートのために[コスト異常検出](https://docs.aws.amazon.com/cost-management/latest/userguide/getting-started-ad.html)を使用してください。

### 既存の組織での有効化

**前提条件**：
- Control Tower を有効にする前に、Config と CloudTrail の信頼されたアクセスを無効にしてください
- 既存の Identity Center リージョンの競合を解決してください（ホームリージョンと一致する必要があります）
- 共有アカウント作成のための十分なアカウントクォータを確保してください

**CloudTrail に関する考慮事項**：既存の組織トレイルがある場合、非アクティブなトレイルへの課金を避けるために、信頼されたアクセスを無効にする前にログ記録を停止してください。カバレッジの短い空白に備えてメンテナンスウィンドウを計画してください。

**ガバナンスの拡張**：Control Tower を有効にしても、既存のアカウントは自動的に登録されません。ベースラインを適用するために OU 全体を登録してください（バッチあたり最大 1000 アカウント）。ターゲットアカウントに `AWSControlTowerExecution` ロールが存在することを確認し、登録前に既存の Config リソースを削除してください。

**既存のコントロール**：既存の SCP は引き続き適用されます。Control Tower のプロビジョニングアクションをブロックしないことを確認してください。Control Tower の外部で定義された Config ルールのコンプライアンス状態は Control Tower ダッシュボードに表示されません — 統合ビューには [Config リソースコンプライアンスダッシュボード](https://catalog.workshops.aws/awscid/en-US/dashboards/additional/config-resource-compliance-dashboard)を検討してください。

### ランディングゾーン 4.0 へのアップグレード

ランディングゾーン 4.0 では、すべてのサービス統合がオプションになり、スタンドアロンの `ConfigBaseline` が導入され、ドリフト通知が EventBridge に移行され、組織を再構成することなく AWS Control Catalog から 1,200 以上のコントロールにアクセスできるようになります。

![アップグレード時の Control Tower ランディングゾーンバージョン選択](/img/cloudops/guides/control-tower/upgrade/image.png)

**主な変更点**：
- AWS Config データが専用の S3 バケットに保存される（CloudTrail とは別）
- Config アグリゲーターが監査アカウントにサービスリンクアグリゲーターとして移動
- Config の委任管理者が監査アカウントで登録される

**アップグレード前**：
1. すべての組織ドリフトを解決してください
2. 設定をバックアップしてください：OU 構造、Config アグリゲーター、StackSet テンプレート、コントロールの有効化状態
3. `AWSControlTowerBP-*` StackSet からクローズされたアカウントのスタックインスタンスを削除してください
4. Control Tower ベースラインスタックに終了保護がないことを確認してください
5. S3 から Config データを読み取るワークフローを特定し、切り替えを調整してください

**アップグレード後**：
- 新しいベースラインを適用するために OU を再登録してください（子 OU にはカスケードしません）
- 監査アカウントでカスタム Config 高度なクエリを再作成してください
- ダウンストリームダッシュボードを新しい `aws-controltower-config-logs-*` バケットを参照するよう更新してください
- 新しいサービスリンクアグリゲーターでの完全なデータ集約には 24〜48 時間かかります

![アップグレード後の監査アカウントでの Config アグリゲーターの検証](/img/cloudops/guides/control-tower/upgrade/Pastedimage20260219215025.png)

> **重要**：このアップグレードは元に戻せません。まず非本番の組織でテストしてください。

## 関連リソース

- [AWS Config コンプライアンスモニタリング](../aws-config-compliance/)
- [AWS Organizations とリージョン](../aws-organizations-and-regions/)
- [クロスアカウントオブザーバビリティ](../cross-account-observability/)
