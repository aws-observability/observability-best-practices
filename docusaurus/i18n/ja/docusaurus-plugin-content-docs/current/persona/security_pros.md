# セキュリティの専門家

組織のセキュリティの専門家は、クラウドインフラストラクチャ、アプリケーション、リソースを効果的に保護するために、さまざまな役割と責任を担っており、それぞれに異なるスキルセットとツールが必要です。堅牢なクラウドセキュリティフレームワークを設計するセキュリティアーキテクトから、脅威を[監視して対応する](https://aws.amazon.com/jp/cloudops/monitoring-and-observability/)セキュリティオペレーションチームまで、AWS でのセキュリティの取り組みには、役割に応じたベストプラクティスとツールが必要です。

このガイドでは、主要なセキュリティペルソナに合わせたセキュリティアプローチを説明します。セキュリティアーキテクトは [AWS Well-Architected Framework](https://aws.amazon.com/jp/architecture/well-architected/) のセキュリティの柱の実装とセキュアなランディングゾーンの設計に焦点を当て、セキュリティオペレーションチームは AWS Security Hub と Amazon GuardDuty を使用して脅威の検出と対応を行い、コンプライアンスマネージャーは AWS Audit Manager と AWS Config を活用して規制基準を維持し、セキュリティエンジニアは AWS IAM、AWS KMS、AWS Network Firewall などのサービスを使用してインフラストラクチャのセキュリティを実装します。

これらのペルソナ固有の要件を理解することで、組織は各セキュリティ役割に固有の課題と責任に対処しながら、AWS 環境全体で強力なセキュリティ態勢を維持する包括的なセキュリティプログラムを構築できます。




## セキュアなコーディング手法とセキュアな開発ライフサイクル

AWS は「セキュリティバイデザイン」の原則を通じて、ソフトウェア開発の基礎的な要素としてセキュリティを重視しています。[セキュアなコーディング手法](/observability-best-practices/ja/persona/developer) を実装することで、開発ライフサイクル全体を通してセキュリティ管理とコンプライアンス要件を統合できます。これらの手法は OWASP Top 10 などの業界標準に準拠し、アプリケーションのライフサイクル全体を通して堅牢なセキュリティ態勢を維持するのに役立ちます。

- Infrastructure as Code (IaC) を実装して、一貫性のあるバージョン管理されたセキュリティ設定を確保し、セキュリティスキャンを統合した AWS CodeBuild を使用し、自動化されたセキュリティテスト用に AWS CodePipeline をデプロイします。

- [AWS 責任共有モデル](https://aws.amazon.com/jp/compliance/shared-responsibility-model/) がセキュリティ責任の理解を導き、Amazon CodeGuru Reviewer などのサービスがセキュリティ脆弱性を自動的に特定し、修復手順を提案します。

- AWS は、設計から開発、テスト、デプロイ、保守までのすべてのフェーズでセキュリティ管理を実装することを推奨しています。主要な手法には、AWS Secrets Manager を使用した安全な認証情報の取り扱い、AWS WAF を使用したアプリケーション保護、Amazon Inspector を使用した継続的なセキュリティ評価の実施などがあります。




## ID とアクセス管理のベストプラクティス

AWS では、ID とアクセス管理 (IAM) 戦略の基礎として、最小権限の原則を実装することを推奨しています。
日々のクラウド運用では、ルートアカウントを使用する代わりに、個別の IAM ユーザーを作成することから始め、強力なパスワードポリシーを実装し、認証情報を定期的にローテーションする必要があります。
AWS は、特に機密性の高い操作において、特権ユーザーとルートアカウントに対する多要素認証 (MFA) の使用を推奨しています。

- AWS Organizations を使用すると、複数のアカウントを一元的に管理し、サービスコントロールポリシー (SCP) とリソースコントロールポリシー (RCP) を使用して、組織全体の権限に対するガードレールを確立できます。
きめ細かなアクセス制御には、IAM タグを使用した属性ベースのアクセス制御 (ABAC) を使用でき、維持が必要なポリシーの数を削減できます。

- AWS IAM Identity Center (旧 AWS Single Sign-On) を使用して、AWS アカウントとビジネスアプリケーション全体のアクセスを一元的に管理できます。

- AWS IAM Access Analyzer を使用した定期的なアクセスレビューにより、未使用の権限を特定して削除できます。また、AWS CloudTrail はセキュリティ分析とコンプライアンス監査のための詳細な API アクティビティログを提供します。

これらのプラクティスは、AWS Well-Architected Framework の[セキュリティの柱](https://docs.aws.amazon.com/ja_jp/wellarchitected/latest/security-pillar/welcome.html)に沿っており、大規模な ID 管理を行いながら強力なセキュリティ態勢を維持するのに役立ちます。



## データの暗号化と保護のガイドライン

AWS は、多層防御アプローチを通じて包括的なデータ保護機能を提供し、保管時および転送時の暗号化を重視しています。

- AWS Key Management Service (AWS KMS) を使用して暗号化キーを作成および制御することで保管時のデータを保護し、AWS Certificate Manager (ACM) は TLS 証明書を使用して転送時のデータを保護します。

- Amazon S3 データについては、AWS KMS キー (SSE-KMS)、S3 管理キー (SSE-S3)、またはお客様提供のキー (SSE-C) を使用してサーバー側の暗号化を実装できます。AWS では、コンプライアンス要件に応じて、AWS マネージドキーまたはカスタマーマネージドキーを使用して、Amazon EBS ボリューム、RDS インスタンス、DynamoDB テーブルをデフォルトで暗号化することを推奨しています。

- データの主権を維持するために、AWS CloudHSM をハードウェアベースのキーストレージとして使用し、AWS Macie を使用して機密データを自動的に検出および保護できます。データ転送時には、AWS PrivateLink を使用してパブリックインターネットを使用せずに AWS サービスへの安全な接続を提供し、AWS Transfer Family は SFTP、FTPS、FTP プロトコルを使用して安全なファイル転送を確保します。

- さらに、Amazon S3 Object Lock とバージョニングを実装することで、偶発的または悪意のある削除から保護し、AWS Backup は AWS リソース全体で暗号化されたバックアップを作成します。これらの暗号化メカニズムは、HIPAA、PCI DSS、GDPR などのコンプライアンス基準に準拠しています。



## コンプライアンスとリスク管理フレームワーク

AWS は、グローバルな標準と規制に準拠した堅牢なコンプライアンスとリスク管理プログラムを維持しながら、お客様独自のコンプライアンスの取り組みのためのツールとリソースを提供しています。
AWS コンプライアンスプログラムは、ISO 27001、SOC レポート、PCI DSS などのサードパーティ監査、認証、証明を通じて AWS が実装する包括的な管理を理解するのに役立ちます。

- AWS Audit Manager を使用して、業界標準と内部ポリシーに対する AWS の使用状況を継続的に評価できます。また、AWS Config は詳細なリソース構成の追跡とコンプライアンスの監視を提供します。

- 規制対象業界向けに、AWS Control Tower は AWS のベストプラクティスに基づくガードレールを使用して、安全でコンプライアンスに準拠したマルチアカウント環境の確立と維持を支援します。

- AWS Security Hub は、アカウント全体のセキュリティ調査結果とコンプライアンスチェックを一元化し、自動セキュリティ評価のための Amazon Inspector や脅威検出のための Amazon GuardDuty などのサービスと統合します。

- AWS Artifact は、セキュリティとコンプライアンスレポートのオンデマンドアクセスを提供し、監査人へのコンプライアンスの実証を可能にします。AWS リスクとコンプライアンスホワイトペーパーは、AWS 共有責任モデルの概要を説明し、AWS が管理するコンプライアンス要件とお客様の責任として残る要件を理解するのに役立ちます。

これらのツールとフレームワークは、HIPAA、GDPR、FedRAMP、および地域のデータ保護法を含む様々な規制要件をサポートしています。




## 脆弱性管理と侵入テスト戦略

AWS は、自動化ツールと手動評価機能を組み合わせた体系的なアプローチにより、包括的な脆弱性管理と侵入テストをサポートしています。

- Amazon EC2 インスタンス、NAT Gateway、Elastic Load Balancer を含む 8 つの特定のサービスについては、事前承認なしで許可された侵入テストを実施できます。AWS Inspector は、アプリケーションの脆弱性とセキュリティのベストプラクティスからの逸脱を自動的に評価し、Amazon GuardDuty は脅威や不正な動作を検出するための継続的なセキュリティ監視を提供します。

- コンテナセキュリティについては、Amazon ECR スキャンがコンテナイメージの脆弱性を特定し、AWS Systems Manager Patch Manager が AWS リソース全体のパッチ管理プロセスを自動化します。AWS Security Hub を使用することで、複数の AWS サービスやパートナーツールからのセキュリティ調査結果を集約し、優先順位付けすることでセキュリティ態勢を強化できます。また AWS では、潜在的なセキュリティ問題をより深く調査するために、Amazon Detective を実装することを推奨しています。

- Web アプリケーションについては、AWS WAF が一般的な攻撃手法から保護し、AWS Shield が DDoS 保護を提供します。AWS Marketplace では、AWS 環境と統合する脆弱性スキャンや侵入テストのための追加のサードパーティセキュリティツールを提供しています。

定期的なセキュリティ評価は、潜在的な脆弱性を特定しながらコンプライアンスを維持するために、AWS 利用規約とセキュリティテストガイドラインに従う必要があります。



## インシデント対応と脅威ハンティング技術

AWS は、統合されたセキュリティサービスと自動化機能を通じて、インシデント対応と積極的な脅威ハンティングのための包括的なフレームワークを提供しています。

- AWS Security Hub をセキュリティアラートの中央管理センターとして実装し、Amazon GuardDuty は機械学習を使用して AWS アカウントとワークロード全体で継続的な脅威検出を実行できます。

- インシデント対応の自動化には、AWS Systems Manager Incident Manager を使用して、事前定義された対応計画と自動化されたランブックでセキュリティインシデントを管理、解決、分析できます。

- Amazon Detective は、潜在的なセキュリティ問題の根本原因を特定するためのセキュリティデータの分析と可視化を支援し、AWS CloudWatch Logs Insights は脅威ハンティングのためのリアルタイムログ分析を可能にします。

- AWS CloudTrail Lake 機能を使用すると、フォレンジック調査のために API アクティビティ履歴全体に対して SQL ベースのクエリを実行できます。

- Amazon EventBridge を使用してセキュリティイベントへの自動応答を実装し、AWS Lambda でサーバーレスインシデント修復を行うことで、セキュリティ態勢を強化できます。AWS では、ネットワークの可観測性のための [VPC Flow Logs](/observability-best-practices/ja/patterns/vpcflowlogs) と、ネットワークトラフィック分析のための DNS クエリログの確立を推奨しています。また、AWS Config はコンプライアンス分析とインシデント調査のためのリソース構成を記録します。

これらの機能は、Amazon Kinesis Data Firehose を通じて既存のセキュリティ情報およびイベント管理 (SIEM) ソリューションと統合され、集中的なセキュリティ監視と自動化されたインシデント対応ワークフローを実現します。



## まとめ

組織内のセキュリティペルソナをサポートするこれらのセキュリティサービス、ツール、プラクティスを実装することで、お客様はセキュリティチームの効率的な業務を可能にしながら、AWS ワークロードをより適切に保護できます。

まず組織の主要なセキュリティペルソナを特定し、その責任を適切な AWS サービスとツールにマッピングすることから始めます。

クラウド環境の進化に合わせて、これらのロールベースのセキュリティプラクティスを定期的にレビューし、更新することを忘れないでください。

AWS Security Hub と AWS Organizations を使用して、アカウント全体の可視性を維持し、ペルソナの要件に基づいてセキュリティチェックを自動化できます。

セキュリティのベストプラクティスの実装に関する詳細なガイダンスについては、AWS アカウントチームにご相談ください。アカウントチームは、お客様の組織のニーズに合わせた包括的なセキュリティ戦略の設計をサポートします。
