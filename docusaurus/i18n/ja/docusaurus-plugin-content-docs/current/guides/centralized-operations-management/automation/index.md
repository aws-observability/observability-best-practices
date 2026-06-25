---
sidebar_position: 7
---
# 自動化

Automation ([AWS Systems Manager](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-automation.html) の機能) を使用すると、ローコードの[ビジュアルデザイナー](https://docs.aws.amazon.com/systems-manager/latest/userguide/automation-visual-designer.html)で[カスタムランブック](https://docs.aws.amazon.com/systems-manager/latest/userguide/automation-documents.html)を作成したり、AWS が提供する 370 以上の定義済みランブックから[複数のアカウントおよび AWS リージョンにわたって](https://docs.aws.amazon.com/systems-manager/latest/userguide/running-automations-multiple-accounts-regions.html)選択したりすることができます。承認、AWS API 呼び出し、ノードでのコマンド実行などの他の[Systems Manager Automation アクション](https://docs.aws.amazon.com/systems-manager/latest/userguide/automation-actions.html)と組み合わせて、ランブックの一部として Python または PowerShell スクリプトを実行することができます。

自動化により、エラーを削減し、回復性を向上させることで、ビジネスのパフォーマンスを改善できます。自動化はセキュリティと運用の両方をさまざまな方法で強化できます。以下にいくつかの例を示します。

* **構成管理**: 自動化ツールは、サーバー、ワークステーション、ネットワークデバイス全体に標準化された構成を適用し、セキュリティの脆弱性につながる設定ミスの可能性を低減できます。
* **パッチ管理**: 自動化を使用してシステム全体にセキュリティパッチとアップデートを展開し、既知のエクスプロイトに対する脆弱性の期間を短縮できます。
* **インシデントレスポンスプレイブック**: 自動化は、事前定義されたインシデントレスポンスプレイブックを実行し、セキュリティチームがセキュリティインシデントの封じ込め、調査、修復に必要な手順を案内します。アプリケーションオーナーは、システム障害インシデント（例：ネットワーク接続の喪失、物理ホスト上のソフトウェアの問題、システム電源の喪失）に対応するための Automation ランブックを作成できます。[Amazon CloudWatch アラーム](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html)を使用して、EC2 インスタンスの停止、終了、再起動、または復旧を行います。
* **コンプライアンス管理**: 自動化は、監査プロセスの自動化、コンプライアンスレポートの生成、セキュリティコントロールの一貫した適用により、業界規制および内部ポリシーへのコンプライアンス維持を支援できます。

Systems Manager Automation を活用することで、この重要なプロセスを効率化し、アプリケーションサーバーが組織のセキュリティポリシーに準拠した最新の状態を維持できるようになります。これにより、時間を節約し、手動によるエラーの可能性を低減するだけでなく、この定期的なタスクに対して一貫性のある再現可能なアプローチを提供します。

![Automation](/img/cloudops/guides/centralized-operations-management/automation/BP-Automation-1.png "Automation")

## サービスロールを使用したアクセス許可の管理

セキュリティのベストプラクティスとして、オートメーションを開始するために SSM サービスが引き受け可能な IAM ロールを作成できます。サービスロールを使用すると、オートメーションは AWS リソースに対して実行することが許可されますが、オートメーションを実行したユーザーはそれらのリソースへのアクセスが制限されます（またはアクセスできません）。

セキュリティとコントロールの強化 - 委任管理により、AWS リソースのセキュリティとコントロールが強化されます。権限を変更する場合は、複数の IAM アカウントではなく、サービスロールで変更を行ってください。

強化された監査エクスペリエンス - 複数の IAM アカウントではなく、中央サービスロールによってリソースに対してアクションが実行されるため、強化された監査エクスペリエンスが可能になります。

次の状況では、Automation のサービスロールを指定する必要があります。1/ 委任管理を使用する場合。2/ ランブックを実行する Systems Manager State Manager アソシエーションを作成する場合。3/ 12 時間以上実行されることが予想される操作がある場合。4/ AWS API オペレーションを呼び出すか AWS リソースに対して操作を行うために aws:executeScript アクションを使用する、Amazon が所有していないランブックを実行する場合。

![Managing permissions](/img/cloudops/guides/centralized-operations-management/automation/BP-Automation-2.png "Managing permissions")

サービスロールを作成した後、そのアカウントの Systems Manager Automation のみがロールを引き受けることができるように、信頼ポリシーを編集することをお勧めします。ロールポリシーについては、ランブックで定義されたオートメーションアクションを実行するために必要な権限のみをアタッチしてください。オートメーションを開始する IAM エンティティは、必要なオートメーションランブックを開始することが許可されています。このエンティティは、オートメーションサービスロールを Systems Manager に渡すことが許可されています。このエンティティには、AWS リソースと直接やり取りするための権限は付与されていません。それらの権限はサービスロールに委任されています。

* サービスロールの信頼ポリシー
  * Systems Manager によって引き受け可能
* サービスロールポリシー – 最小アクセスポリシー
  * オートメーションアクションを実行するために必要な権限のみを付与
* IAM ユーザー/グループ/ロールポリシー
  * サービスロールをオートメーションに渡すことを許可
  * オートメーション実行の開始/停止/説明の権限を許可
  * オートメーション外のリソースを管理するための権限は不要

## オートメーションランブックの作成

独自の自動化ランブックを作成する方法は複数あります。プログラムでドキュメントを作成するには、CreateDocument API を使用するか、SSM Documents CDK ライブラリを使用できます。また、CloudFormation を使用してドキュメントを作成することもできます。

AWS Systems Manager Automation は、自動化ランブックの作成を支援するローコードのビジュアルデザインエクスペリエンスを提供します。このビジュアルデザインエクスペリエンスは、ドラッグアンドドロップインターフェイスを提供し、独自のコードを追加するオプションも備えているため、ランブックをより簡単に作成および編集できます。

ランブックを作成する際、ビジュアルデザインエクスペリエンスが作業を検証し、コードを自動生成します。生成されたコードを確認したり、ローカル開発用にエクスポートしたりすることができます。完了したら、ランブックを保存して実行し、Systems Manager Automation コンソールで結果を確認できます。

ビジュアルデザインエクスペリエンスでは、Automation は Amazon CodeGuru Security と統合され、Python スクリプトのセキュリティポリシー違反や脆弱性の検出を支援します。

利用可能なオプション：

* AWS API を活用するか、CloudFormation を使用してドキュメントを作成します
* [Automation ランブックのビジュアルデザインエクスペリエンス](https://docs.aws.amazon.com/systems-manager/latest/userguide/automation-visual-designer.html)
* [Visual Studio Code Toolkit](https://docs.aws.amazon.com/toolkit-for-vscode/latest/userguide/systems-manager-automation-docs.html)
* [CDK for Systems Manager Documents](https://github.com/cdklabs/cdk-ssm-documents)

Systems Manager では、ランブックを AWS アカウント間で共有できます。これにより、効果的なコラボレーションが可能になり、ベストプラクティスの採用が促進されます。たとえば、中央アカウントがセキュリティのベストプラクティスを自動化ランブックとして定義し、組織内の他のアカウントと共有できます。これにより、AWS 環境全体でセキュリティ対策の一貫した実装が確保されます。

デフォルトでは、SSM は AWS Organization Unit (OU) を使用したランブックの共有をサポートしていません。この制限を回避するためのソリューションが利用可能です。

![Automation runbooks](/img/cloudops/guides/centralized-operations-management/automation/BP-Automation-3.png "Automation runbooks")

このソリューションは、EventBridge Rule、Lambda 関数、Step Function State Machine、SNS トピックなど、複数の AWS リソースを使用します。デプロイ後、CreateAccount または InviteAccountToOrganization API 呼び出しを通じて AWS Organizations に新しいアカウントが追加されるたびに、ワークフローがトリガーされます。このワークフローは、指定された AWS Organizations の子アカウントおよびすべての指定されたリージョンにおいて、新しく追加されたアカウント ID に対する SSM Document の共有権限を追加します。詳細については、[AWS Organizations SSM Document 共有権限の自動化](https://github.com/aws-samples/aws-management-and-governance-samples/tree/master/AWSSystemsManager/AWS-Org-SSM-Permissions)をご覧ください。

## オートメーションの実行

* **シンプルな自動化** – 現在のリージョンとアカウント
* **手動自動化** – インタラクティブなステップバイステップの実行。各ステップを手動で実行します。トラブルシューティングの目的に役立ちます。
* **マルチアカウント・マルチリージョン自動化** – 中央アカウントから複数の AWS リージョンおよび AWS アカウント、または AWS Organizations の組織単位 (OU) にわたって自動化を実行します。
* **スケールでの実行** – タグ、リソースグループ、またはパラメータ値を使用してターゲットを指定します。
* **レートコントロール** – 同時実行数とエラーしきい値。影響範囲を制御します。同時実行数の値により、自動化を同時に実行できるリソースの数が決まります。
* **アダプティブ同時実行** – 最大 500 の同時自動化。自動化の設定で有効にします。
* **CloudWatch アラーム統合** – 自動化を監視するために CloudWatch アラームをアタッチします。アラームがアクティブになると、自動化は停止されます。
* **セキュリティ** – IAM アクセスコントロール。
  * IAM ポリシーを使用することで、管理者は組織内のどの個人ユーザーまたはグループが自動化を使用できるか、またどのランブックにアクセスできるかを制御できます。
  * 自動化では、IAM サービスロールを使用したアクセス委任が可能です。サービスロールを使用すると、自動化は AWS リソースに対して実行できますが、自動化を実行したユーザーはそれらのリソースへのアクセスが制限されます (またはアクセスできません)。

## 複数のアカウントとリージョンでの Automation の実行

![Running Automation](/img/cloudops/guides/centralized-operations-management/automation/BP-Automation-4.png "Running Automation")

複数のリージョンおよびアカウントまたは OU にわたる自動化の実行は、次のように機能します。

1. 自動化を実行するすべてのリソースが、すべての リージョンおよびアカウントまたは OU で同一のタグを使用していることを確認します。使用していない場合は、AWS リソースグループに追加してそのグループをターゲットにすることができます。詳細については、*AWS Resource Groups and Tags User Guide* の[リソースグループとは？](https://docs.aws.amazon.com/ARG/latest/userguide/)を参照してください。
1. Automation の中央アカウントとして設定するアカウントにサインインします。
1. このトピックの[マルチリージョンおよびマルチアカウント自動化のための管理アカウントのアクセス許可の設定](https://docs.aws.amazon.com/systems-manager/latest/userguide/running-automations-multiple-accounts-regions.html)の手順を使用して、以下の IAM ロールを作成します。
1. **AWS-SystemsManager-AutomationAdministrationRole** - このロールは、複数のアカウントおよび OU で自動化を実行するためのアクセス許可をユーザーに付与します。
1. **AWS-SystemsManager-AutomationExecutionRole** - このロールは、ターゲットアカウントで自動化を実行するためのアクセス許可をユーザーに付与します。
1. 自動化を実行するランブック、リージョン、およびアカウントまたは OU を選択します。

**マルチアカウント/リージョン Automation に関する考慮事項:**

* リソースグループをターゲットにする場合、リソースグループは各ターゲットアカウントおよびリージョンに存在している必要があります
  * リソースグループ名は、各ターゲットアカウントおよびリージョンで完全に同一である必要があります
* Automations は OU を再帰的に処理しません
  * Automation はアカウントを含む OU のみをターゲットにできます
* マルチアカウント/リージョン用に必要な IAM ロールを CloudFormation または IaC を使用して作成することをお客様に推奨します
