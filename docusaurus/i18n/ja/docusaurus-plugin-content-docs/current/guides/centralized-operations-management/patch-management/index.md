---
sidebar_position: 5
---
# パッチ管理

[Patch Manager](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-patch.html) は Systems Manager の機能であり、セキュリティ関連の更新プログラムを使用して管理対象ノードへのパッチ適用プロセスを自動化できます。Amazon EC2 インスタンス、エッジデバイス、オンプレミスのサーバーおよび仮想マシン (VM)（他のクラウド環境の VM を含む）にパッチを適用できます。

## パッチ適用が難しい理由とは？

![What makes patching hard?](/img/cloudops/guides/centralized-operations-management/patch-management/what-makes-patching-hard.png "What makes patching hard?")

パッチ適用戦略の策定は、組織にとって困難な場合があります。まず、パッチ管理は、企業環境内の各ノードにインストールされているアプリケーションやオペレーティングシステムを含む、パッチ適用可能なソフトウェアの最新かつ完全なインベントリを保持することに依存しています。次に、エンタープライズのパッチ管理は、人員とインフラストラクチャの両面で一部のリソースに過負荷をかける可能性があります。

次に、パッチのインストールは副作用を引き起こす可能性があります。組織が慎重な姿勢をとる原因となるもう一つの一般的な課題は、パッチのインストールによって引き起こされる意図しない、または予期しない問題です。ノードを調べて、特定のパッチが実際に適用されたかどうかを判断することは、驚くほど難しい場合があります。この課題は単一のノードで直面することもありますが、組織全体のノードとオペレーティングシステムのフリート全体に拡大すると、その課題の規模はすぐに非常に圧倒的なものになる可能性があります。

## より良くするために

![Prioritizing patching](/img/cloudops/guides/centralized-operations-management/patch-management/prioritize.png "Prioritizing patching")

一般的な課題のいくつかに対処するために、まず分類によって特定のパッチを優先順位付けし、優先すべきパッチの小さなサブセットを特定することから始めます。これを行うには、ビジネスにとって最も重要なワークロードやアプリケーションを特定し、それらのワークロードに最も大きな影響を与えるパッチを判断します。例えば、メールサーバー、データベース、Web アプリケーション、顧客向けデジタルプロパティなどが挙げられます。

![How it works](/img/cloudops/guides/centralized-operations-management/patch-management/how-it-works.png "How it works")

そこから各ワークロードの[パッチベースライン](https://docs.aws.amazon.com/systems-manager/latest/userguide/patch-manager-patch-baselines.html)を作成できます。これにより、パッチスキャン操作を実行する際に不足としてマークされる適用可能なパッチを特定するのに役立ちます。スキャンにより、設定したベースラインに対するコンプライアンスのレベルを確認できます。

その後、定期的なメンテナンス期間中に更新を適用するためのパッチインストール操作を定期的にスケジュールしたり、緊急のパッチリリース時にオンデマンドで更新をインストールしたりすることができます。パッチのインストール後、Patch Manager が提供するパッチコンプライアンスデータを使用して結果を確認できます。

## パッチ適用中に OS 内で何が起こるか？

お客様からよく寄せられる質問として、Patch Manager はどのようにパッチのスキャンまたはインストールを行うのかというものがあります。スケジュールされたものであれアドホックなものであれ、パッチ操作が開始されると、その操作は Systems Manager エンドポイントのキューに追加されます。SSM エージェントはその後、スキャンまたはインストールのコマンドを取得します。SSM エージェントはパッチベースラインの承認ルールを取得し、ローカル OS パッケージマネージャー（Windows Update、yum、apt-get など）を使用してスキャンまたはインストールを開始します。操作が完了すると、SSM エージェントはパッチコンプライアンスデータを Patch Manager に報告します。

![Patch Management OS Patching](/img/cloudops/guides/centralized-operations-management/patch-management/os-patching.png "Patch Management OS Patching")

### パッチソースへの接続

マネージドノードがインターネットへの直接接続を持たず、VPC エンドポイントを使用した Amazon Virtual Private Cloud (Amazon VPC) を使用している場合は、ノードがソースパッチリポジトリ (リポジトリ) にアクセスできることを確認する必要があります。

Linux ノードでは、パッチの更新は通常、ノードに設定されたリモートリポジトリからダウンロードされます。そのため、パッチ適用を実行するには、ノードがリポジトリに接続できる必要があります。Windows Server マネージドノードは、Windows Update カタログまたは Windows Server Update Services (WSUS) に接続できる必要があります。詳細については、[Patch Manager の前提条件](https://docs.aws.amazon.com/systems-manager/latest/userguide/patch-manager-prerequisites.html)を参照してください。

## パッチ基準の定義

Patch Manager は、Patch Manager がサポートする各オペレーティングシステムに対して[事前定義済みのパッチベースライン](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-patch-baselines.html)を提供しています。これらのベースラインは現在の設定のまま使用することも（カスタマイズはできません）、独自のカスタムパッチベースラインを作成することもできます。カスタムパッチベースラインを使用すると、環境に対して承認または拒否するパッチをより細かく制御できます。

カスタムパッチベースラインでは、以下のことができます。

* 承認されるパッチを定義する
* カットオフに自動承認の遅延を使用する
* パッチの例外を定義する
* Linux のカスタムパッチリポジトリを定義する
* 複数のオペレーティングシステムバージョンのパッチ基準を定義する

## さまざまな種類のパッチ適用

パッチ適用ソリューションには、集中型と分散型の 2 つの一般的なアプローチがあります。

| 集中型パッチ適用 | 分散型パッチ適用 |
| -------------------- | ---------------------- |
| 中央チームがパッチスキャン操作をデプロイする | より多くの責任をアプリケーション/アカウントオーナーに移す |
| 中央チームがパッチインストール操作をデプロイする | 中央チームがパッチスキャン操作をデプロイし、コンプライアンスレポートは引き続き一元化される |
| スケジュールや実行される操作に関する柔軟性が限定的 | オーナーがパッチインストール操作を担当し、中央チームは AWS Service Catalog などを通じてビルディングブロックを提供できる |
| 通常、中央チームがトラブルシューティングを担当する | オーナーがインストールのスケジュールを定義できる |
| 規制やセキュリティが厳しい環境でより一般的 | 中央チームはオンデマンドのパッチインストールのオーバーライドを持つべき |

### マルチアカウント組織における集中パッチ適用ソリューションの例

**オプション 1:** [Quick Setup Patch Policy configurations](https://docs.aws.amazon.com/systems-manager/latest/userguide/quick-setup-patch-manager.html) を使用して、一元化されたパッチ適用ソリューションを確立できます。パッチポリシーにより、お客様は AWS アカウントおよび AWS リージョン全体にわたって複数のパッチベースラインのスキャンとパッチインストールのスケジュールを設定できます。詳細については、[AWS Organization 全体へのパッチ適用 - パッチポリシー](/guides/centralized-operations-management/patch-management/#patching-across-an-aws-organization---patch-policies)を参照してください。

![Patch Management Centralized Patching Option 1](/img/cloudops/guides/centralized-operations-management/patch-management/patch-policy-architecture.png "Patch Management Centralized Patching Option 1")

**オプション 2:** 集中管理ソリューションのもう 1 つのオプションとして、[Amazon EventBridge](https://aws.amazon.com/eventbridge/)、[AWS Lambda](https://aws.amazon.com/lambda/)、および [Systems Manager Automation](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-automation.html) を組み合わせて、マルチアカウントおよびマルチリージョンのパッチ適用オペレーションをスケジュールする方法があります。詳細については、「[AWS Systems Manager Automation を使用した集中管理型マルチアカウントおよびマルチリージョンパッチ適用のスケジュール設定](https://aws.amazon.com/blogs/mt/scheduling-centralized-multi-account-multi-region-patching-aws-systems-manager-automation/)」を参照してください。

![Patch Management Centralized Patching Option 2](/img/cloudops/guides/centralized-operations-management/patch-management/scheduled-mamr-patching-automation.png "Patch Management Centralized Patching Option 2")

### マルチアカウント組織向けの分散型セルフサービスパッチ適用ソリューションの例

アプリケーションオーナーによって、パッチ操作、パッチ適用のタイミング、パッチ適用の頻度、および下位環境（DEV または UAT）でのパッチテストの柔軟性に関する要件が異なる場合があります。[AWS Service Catalog](https://aws.amazon.com/servicecatalog/) を使用することで、中央チームはセルフサービスパッチ適用のビルディングブロックとして機能するプロダクトを作成できます。アプリケーション/アカウントオーナーは、これらのプロダクトを自分の環境にデプロイし、ソリューションを自分で構築することなく、スケジュールなどのいくつかのパラメータを指定するだけで済みます。詳細については、[マルチアカウント組織向けのセルフサービスパッチ適用ソリューション](https://aws.amazon.com/blogs/mt/a-self-service-patching-solution-for-multi-account-organisations/)を参照してください。

![Self-service patching using Service Catalog](/img/cloudops/guides/centralized-operations-management/patch-management/self-service-patching.png "Self-service patching using Service Catalog")

## インプレースパッチと再ハイドレーション

リハイドレーション（再舗装、リフレッシュ）とは、最新のパッチがインストールされた新しいサーバーを起動し、古いノードを廃止するプロセスです。Auto Scaling Group 内の EC2 インスタンス、コンテナクラスター（ECS / EKS）内のマネージドノードグループ、およびアプリケーションワークロード要件に合わせて事前設定された AMI において一般的に採用されているプラクティスです。

| インプレースパッチ | 再ハイドレーション |
| -------------- | ----------- |
| 再ハイドレーションよりも高い頻度で実行されることが一般的（毎週、隔週） | 毎月または四半期ごとに実行されることが一般的。一部のお客様は 2 週間ごとに実行しています! |
| 簡単に置き換えられない長期稼働ノード（ミュータブル）に最適 | 起動後の設定をあまり必要としないワークロード（イミュータブル）に最適 |
| パッチインストールのワークフローでバックアップの取得が必要になる場合がある | EC2 Image Builder のようなサービスを使用して Auto Scaling グループと統合する |
| | インプレースでパッチを適用するメカニズムが依然として必要になる場合がある。例えば、ゼロデイ脆弱性のパッチがリリースされたが、次の再ハイドレーションサイクルまでノードを置き換えられない場合など |

アプリケーションのワークロードに応じて、環境内でインプレースパッチと再ハイドレーションの両方の方法が必要になる場合があります。

## AWS Organization 全体へのパッチ適用 - パッチポリシー {#patching-across-an-aws-organization---patch-policies}

AWS Organization でパッチ適用要件を標準化するには、[Quick Setup 内のパッチポリシー](https://docs.aws.amazon.com/systems-manager/latest/userguide/patch-manager-policies.html)を使用できます。複数のオペレーティングシステムに対して組織全体にパッチポリシーを適用し、複数のアカウントおよびリージョンにわたって適用することができ、対象のマネージドノードのリソースコンプライアンスを確認できます。

複数のアカウントにわたって Quick Setup を使用することで、組織が一貫した設定を維持できるようになります。さらに、Quick Setup は定期的に設定のドリフトを確認し、修正を試みます。設定ドリフトは、ユーザーが Quick Setup で行った選択と競合するサービスや機能への変更を行った場合に発生します。

![Patch Policy architecture](/img/cloudops/guides/centralized-operations-management/patch-management/patch-policy-detailed-architecture.png "Patch Policy architecture")

### 仕組み

1. Quick Setup を使用してパッチポリシーを作成すると、選択したパラメータが CloudFormation に送信されます。
1. CloudFormation は、定義されたパラメータ、対象アカウント、およびリージョンを使用してスタックセットを作成します。これはデプロイ時に Quick Setup によって生成されます。
1. CloudFormation は、各対象アカウントおよびリージョンにスタックインスタンスを作成します。
1. スタックインスタンスは、定義されたパッチスキャン用の[State Manager アソシエーション](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-state.html)と、選択した場合はパッチインストール用のアソシエーションを作成します。これらのアソシエーションは、パッチポリシーの作成時に指定したスケジュールを使用して適用されます。
1. 管理アカウントでは、State Manager アソシエーションが Automation ランブックを起動し、1 日 1 回 Lambda 関数を呼び出します。
1. Lambda 関数は、指定されたパッチベースラインを JSON ファイルとして S3 バケットに保存します。さらに、Lambda 関数は Quick Setup 内で指定されたカスタムパッチベースラインの変更を評価します。カスタムパッチベースラインに変更が加えられた場合、Lambda 関数は S3 バケット内の JSON ファイルを更新します。
1. 管理対象ノードは、パッチ適用操作中に中央パッチベースラインの JSON ファイルを取得し、更新のスキャンまたはインストールを行います。

**注意:** 現在、Quick Setup を通じてパッチポリシーをデプロイするには、AWS Organization 内の管理アカウントを使用する必要があります。管理アカウント外でパッチポリシーをデプロイするには、[Quick Setup 外でパッチポリシーをデプロイする方法](https://catalog.us-east-1.prod.workshops.aws/workshops/7c0ea253-6462-41cd-af76-3850c92458fa/en-US)を参照してください。

## オンデマンドパッチ適用

緊急の脆弱性シナリオなど、定期的なパッチ適用サイクル以外でノードにパッチを適用する必要がある場合があります。

**オプション 1:** [今すぐパッチを適用](https://docs.aws.amazon.com/systems-manager/latest/userguide/patch-manager-patch-now-on-demand.html)（*シングルアカウント/リージョン*）

* Patch Manager の **Patch now** オプションを使用すると、オンデマンドのパッチ適用操作を迅速に実行できます。ただし、**Patch now** では、一度に 1 つの AWS アカウントと Region 内でのパッチ適用のみが可能です。また、パッチポリシー内で定義されたパッチベースラインを使用することもできません。パッチポリシーのベースラインとは異なる承認ルールに基づいて、パッチスキャンを実行したり、該当するパッチをインストールしたりする別のベースラインを作成することができます。

**オプション 2:** 自動化 *(マルチアカウント/Region)*

* アカウントおよびリージョンをまたいでオンデマンドのパッチ適用操作を実行するには、[複数の AWS リージョンおよびアカウントでオートメーションを実行する](https://docs.aws.amazon.com/systems-manager/latest/userguide/running-automations-multiple-accounts-regions.html)ことをサポートする Automation を活用できます。ターゲットアカウントにデプロイされた IAM ロールを活用してアクションを実行できます。Patch Policies またはスタンドアロンのパッチ適用要件と統合できます。

## 脆弱性管理と修復の統合

[Amazon Inspector](https://aws.amazon.com/inspector) は、Amazon EC2 インスタンスおよび Amazon Elastic Container Registry (Amazon ECR) に保存されているコンテナイメージに対して、継続的な脆弱性スキャンを提供します。これらのスキャンは、ソフトウェアの脆弱性および意図しないネットワークへの露出を評価します。Amazon Inspector は Systems Manager (SSM) エージェントを使用して、EC2 インスタンスのソフトウェアアプリケーションインベントリを収集します。その後、Inspector はこのデータをスキャンしてソフトウェアの脆弱性を特定します。これは脆弱性管理における重要なステップです。

Amazon Inspector によって特定された脆弱性の重大度に基づいて、脆弱性を解決するための定期的なパッチ適用操作を実施する必要があります。AWS Systems Manager Patch Manager を使用して、SSM エージェントを使用して Systems Manager が管理するノードへのパッチ適用プロセスを自動化できます。

ゼロデイ脆弱性やその他の高深刻度・重大な脆弱性でパッチが利用可能な場合があります。しかし、それらを修正するために定期的なパッチ適用スケジュールを待ちたくない場合もあります。このような場合には、オンデマンドでパッチを適用するメカニズムが存在する必要があります。

詳細については、以下を参照してください。

* [AWS on Air: LockDown - The Magical World of Vulnerability Management](https://www.linkedin.com/events/awsonair-lockdown-themagicalwor7061737757479481344/comments/)
* [Amazon Inspector と AWS Systems Manager を使用して AWS での脆弱性管理と修復を自動化する – パート 1](https://aws.amazon.com/blogs/mt/automate-vulnerability-management-and-remediation-in-aws-using-amazon-inspector-and-aws-systems-manager-part-1/)
* [Amazon Inspector と AWS Systems Manager を使用して AWS での脆弱性管理と修復を自動化する – パート 2](https://aws.amazon.com/blogs/mt/automate-vulnerability-management-and-remediation-in-aws-using-amazon-inspector-and-aws-systems-manager-part-2/)

![Automate vulnerability management and remediation](/img/cloudops/guides/centralized-operations-management/patch-management/vulnerability-remediation-architecture.png "Automate vulnerability management and remediation")

## パッチコンプライアンスの確認

Patch Manager ダッシュボードは、現在の AWS アカウントとリージョン内のパッチコンプライアンスのスナップショットを提供します。コンプライアンスレポートにより、ノードのパッチコンプライアンスを確認できます。また、Fleet Manager コンソールを使用して、インストールされたパッチの詳細、およびそれらのパッチの重大度と重要度を確認することもできます。

これらのビューはローカルの AWS アカウントとリージョンに固有のものですが、AWS Organization 全体の一元化されたパッチコンプライアンスレポートを作成することができます。

## AWS Organization におけるエンドツーエンドのパッチ管理とインベントリレポートの作成

:::tip
[Amazon Quick Suite](https://aws.amazon.com/quicksuite/) を使用すると、複数ステップの手動プロセスをいくつかの簡単なプロンプトに簡略化し、パッチ適用のコンプライアンスとインベントリの視覚化を迅速に生成できることをご存知ですか？AI を活用した機能が動的なダッシュボードの作成を支援し、精度を維持しながら貴重な時間を節約し、組織のパッチ適用状況をリアルタイムで把握できます。詳細については、ブログ [Amazon Quick Suite を使用したエンタープライズパッチ適用およびインベントリダッシュボードの構築](https://aws.amazon.com/blogs/mt/building-enterprise-patching-and-inventory-dashboards-using-amazon-q-in-amazon-quicksuite/) をご覧ください。
:::

AWS Organization 全体のパッチコンプライアンスに関するレポートを作成するには、Systems Manager の[リソースデータ同期](https://docs.aws.amazon.com/systems-manager/latest/userguide/inventory-create-resource-data-sync.html)を使用して、すべてのマネージドノードから収集したインベントリデータを単一の Amazon S3 バケットに送信できます。リソースデータ同期は、新しいインベントリデータが収集されると、一元化されたデータを自動的に更新します。

[AWS Glue クローラー](https://docs.aws.amazon.com/glue/latest/dg/add-crawler.html)を使用すると、S3 のパッチコンプライアンスデータからデータベースとテーブルを自動的に作成し、[Amazon Athena](https://aws.amazon.com/athena/) でパッチコンプライアンスデータをクエリできます。このソリューションでは、[Amazon QuickSight](https://aws.amazon.com/quicksight/) を使用してインベントリとパッチコンプライアンスデータを視覚化しますが、S3 バケットからデータを取得できる任意の BI またはアナリティクスツールを使用することもできます。

**注意:** ノードからインベントリデータを収集するすべてのアカウントおよびリージョンで、リソースデータ同期を作成する必要があります。

![End-to-end patch management reporting](/img/cloudops/guides/centralized-operations-management/patch-management/architecture-diagram-ssm-org-reporting.png "End-to-end patch management reporting")

1. 各アカウント/リージョンで Systems Manager リソースデータ同期を作成します。
1. 単一の Amazon S3 バケットにパッチコンプライアンスデータを一元的に集約します。
1. AWS Glue Crawler を使用してデータベースとテーブルを自動的に作成します。
1. Amazon Athena を使用してパッチまたはインベントリデータをクエリします。
1. Amazon QuickSight を使用してパッチコンプライアンスを可視化します。

## AWS Systems Manager Inventory メタデータの理解

リソースデータ同期は、オンデマンドアクション（インスタンスの登録または終了、パッチスキャンまたはインストールの実行）やスケジュールされたアクション（ソフトウェアインベントリの収集、カスタムインベントリメタデータの収集、パッチインストールの実行、Chef InSpec を使用したコンプライアンスの評価）に基づいて、S3 バケットにデータをプッシュします。

![Inventory metadata](/img/cloudops/guides/centralized-operations-management/patch-management/resource-data-sync-inventory-metadata.png "Inventory metadata")

ソース: [AWS Systems Manager インベントリメタデータについて](https://aws.amazon.com/blogs/mt/understanding-aws-systems-manager-inventory-metadata/)
