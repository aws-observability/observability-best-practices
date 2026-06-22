---
sidebar_position: 6
---
# リモートおよびセッション管理

Remote and Session Management には、Run Command、Fleet Manager、Session Manager などの機能が含まれています。

## リモート管理

AWS Systems Manager のツールである Run Command を使用すると、マネージドノードの設定をリモートかつ安全に管理できます。Run Command を使用することで、一般的な管理タスクを自動化し、大規模な 1 回限りの設定変更を実行できます。Run Command は、AWS Management Console、AWS Command Line Interface (AWS CLI)、AWS Tools for Windows PowerShell、または AWS SDK から使用できます。

![Remote Management](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-1.png "Remote Management")

run コマンドの一般的なユースケースには以下が含まれます。

* **ブートストラップノード:** すべてのノードまたは特定のノードにアプリケーションをインストールまたはブートストラップできます。
* **構成管理:** Systems Manager は、[Ansible](https://aws.amazon.com/blogs/mt/running-ansible-playbooks-using-ec2-systems-manager-run-command-and-state-manager/)、[Salt States](https://aws.amazon.com/blogs/mt/running-salt-states-using-amazon-ec2-systems-manager/)、[PowerShell DSC](https://aws.amazon.com/blogs/mt/combating-configuration-drift-using-amazon-ec2-systems-manager-and-windows-powershell-dsc/) など、さまざまなドメイン固有言語 (DSL) をサポートしています。
* **ドメインへの参加:** ノードを Windows ドメインに参加させます。
* **その他の Amazon エージェントのデプロイ:** エージェント設定を Parameter Store に保存します。

### コンポジットコマンドドキュメント

これらの Systems Manager ドキュメントは、マネージドノードで実行するアクションを定義します。Systems Manager は、さまざまな事前定義済みのパブリックドキュメントを提供するとともに、ドキュメントをカスタマイズする機能も備えています。設定の一部として[コンポジットドキュメントを実行する](https://aws.amazon.com/about-aws/whats-new/2017/10/amazon-ec2-systems-manager-now-integrates-with-github/)ことができます。コンポジットドキュメントは、1 つ以上のセカンダリドキュメントを実行するタスクを実行します。

コンポジットコマンドドキュメントを活用する際に留意すべき点として、順次操作のみがサポートされており、分岐はできません。Systems Manager、プライベートまたはパブリックの GitHub、あるいは Amazon S3 に保存されているドキュメントを実行するために、AWS-RunDocument を通じてこれを有効にすることができます。これは [aws:downloadContent](http://docs.aws.amazon.com/systems-manager/latest/userguide/ssm-plugins.html#aws-downloadContent) および [aws:runDocument](http://docs.aws.amazon.com/systems-manager/latest/userguide/ssm-plugins.html#aws-rundocument) プラグインを使用することで実現されます。aws:runDocument プラグインは、Systems Manager またはローカルパスに存在するドキュメントを実行します。この例として AWS-RunPatchBaselineWithHooks が挙げられます。

### Run Command の制限

IAM ユーザー/ロールを通じて、セッション内でユーザーが実行できるコマンドを制限できます。ドキュメントでは、ユーザーがセッションを開始したときに実行されるコマンドと、ユーザーがコマンドに提供できるパラメータを定義します。ssm:SendCommand、ドキュメント名またはプレフィックス、リソースタグ、およびリソース ID に基づいてアクセスを制限できます。また、SAML セッションタグを使用して ABAC ポリシーを適用することもできます。  

![Restricting Run Command](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-2.png "Restricting Run Command")

1. 例えば、[AWS Identity and Access Management (IAM)](https://aws.amazon.com/iam/) ユーザーが所属する部門に基づいて、特定のマネージドノードへのアクセスを許可することができます。
1. Alice と Bob は、外部 Identity Provider (IdP) を使用して[AWS Management Console](http://aws.amazon.com/console) にフェデレーションします。フェデレーションされた両ユーザーは、それぞれの「department」メンバーシップ（Amber および Blue）に基づいて、Session Manager を使用して特定の EC2 インスタンスにアクセスする必要があります。

### マルチアカウントおよびマルチリージョン Run Command

* Run Command 自体はアカウント/リージョンごとです
* Automation を使用して、アカウント/リージョン間で呼び出します

AWS Systems Manager のツールである Automation は、一般的なメンテナンス、デプロイ、および修復タスクを簡素化します。複数のアカウントやリージョンをターゲットにするために活用できます。マルチアカウント/マルチリージョンの自動化では、子アカウントをターゲットにする場合、コマンドドキュメントがターゲットアカウント/リージョンに存在している必要があります。CloudFormation または Terraform を使用してコマンドドキュメントをデプロイできます。Systems Manager サービスが自動化アクションを実行できるように、必要なアクセス許可を設定しておく必要があります。詳細については、Automation セクションを参照してください。

![Multi-account and multi-Region Run Command](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-3.png "Multi-account and multi-Region Run Command")

### AWS Systems Manager State Manager アソシエーションを通じた Run Command のスケジューリング

State Manager は、AWS 上、オンプレミス、またはマルチクラウド上のマネージドノードを望ましい状態に保つプロセスを自動化するのに役立ちます。State Manager では、アソシエーションとは、ドキュメント内で表現された設定と、一貫した状態を確保するために特定のスケジュールで実行されるターゲットのセットとの間のバインディングです。ランブックを使用して State Manager アソシエーションを作成することで、オートメーションを開始できます。設定に関連付けられた Command ドキュメントは、すべてのターゲットアカウント/リージョンに存在する必要があります。

![Scheduling Run Command](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-4.png "Scheduling Run Command")

### エラー、終了、および再起動コードの処理

デフォルトでは、スクリプト内で最後に実行されたコマンドの終了コードが、スクリプト全体の終了コードとして報告されます。

* `Exit 0` ステータスは次のようになります。 `Success`
* `Exit 1` またはその他の場合*、ステータスは次のようになります。 `Failed`
* 特定の終了コードを含めることで、エラーをより迅速に特定できます。
* 再起動コード：
  * Windows： `exit 3010`
  * Linux: `exit 194`

![Scheduling Run Command](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-5.png "Scheduling Run Command")

### Amazon CloudWatch を使用した Run Command のモニタリング

AWS Systems Manager は、Run Command コマンドのステータスに関するメトリクスを CloudWatch に発行し、それらのメトリクスに基づいてアラームを設定できるようにします。Systems Manager が CloudWatch にプッシュするコマンド関連の特定のメトリクスとして、```Delivery Time Out```（配信タイムアウト）になったコマンド数、```Failed```（失敗）したコマンド数、```Successful```（成功）したコマンド数などがあります。

Run Command のモニタリングの詳細については、[Amazon CloudWatch を使用した Run Command メトリクスのモニタリング](https://docs.aws.amazon.com/systems-manager/latest/userguide/monitoring-cloudwatch-metrics.html)を参照してください。

## セッション管理

AWS Session Manager は、フルマネージドの AWS Systems Manager ツールです。インタラクティブなワンクリックのブラウザベースシェル、または AWS Command Line Interface (AWS CLI) のいずれかを使用して、マネージドノードを操作できます。Session Manager は、インバウンドポートを開いたり、踏み台ホストを維持したり、SSH キーを管理したりすることなく、安全なノード管理を提供します。マネージドノードへの制御されたアクセス、厳格なセキュリティプラクティス、ノードアクセス詳細を含むログを必要とする企業ポリシーに準拠しつつ、エンドユーザーにはマネージドノードへのシンプルなワンクリックのクロスプラットフォームアクセスを提供できます。

### ガバナンス

![Governance](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-6.png "Governance")

* ***ユーザーをデータから分離する***: Cloud Ops の重要な原則は、可能な限りユーザーをデータから分離することです。Session Manager は、認証情報を持つ誰もがサーバーにアクセスして設定を変更できる可能性のあるインバウンドネットワークポートを閉じます。Session Manager はさらに進んで、インタラクティブなセッションを一切持たずに、ユーザーを個々のコマンドの実行と結果の表示のみに制限することもできます。

* ***アクセスを一元管理する***: クラウドオペレーションでは、環境に対する変更が伸縮自在かつ絶え間なく発生する可能性があります。各サーバー上で誰が各サーバーにアクセスできるかを維持管理する代わりに、Session Manager は Identity Access Management と統合され、誰がどのノードにアクセスできるかを一元的に定義できます。

* ***ワークロードとコンポーネントへのアクセスを制御する***: 組織は IAM を使用して、ワークロードやロールに応じてノードへのアクセスを制御できます。例えば、データベース管理者は「Component: Database」とタグ付けされた任意のインスタンスにリモートアクセスでき、アプリケーション開発者は「Environment: Development」とタグ付けされた任意のインスタンスにリモートアクセスできる、といった具合です。この属性ベースのアクセス制御により、プロジェクトチームはビジネスへの価値提供に必要なだけ迅速に作業できる一方で、組織は定義されたガードレールの範囲内で運用されているという安心感を得られます。

* ***特定のロールにコマンドを制限する:*** 「ユーザーをデータから分離する」で述べたように、ロールに対してそのロールに必要な特定のコマンドセットのみの実行を許可することが可能です。例えば、アプリケーション開発者は、本番環境へのインタラクティブなアクセスを持たず、またその必要もなく、本番環境にあるアプリケーションのログファイルを「tail」できる、といったことが考えられます。

* ***ビジネス上の理由で一時的なアクセスを付与する***: オープンソースおよび商用の一時的な権限昇格ソリューションが提供する追加機能を使用すると、サーバーにアクセスする正当なビジネス上の理由がない限り、すべてのオペレーターのリモートアクセスを拒否することさえ可能です。例えば、本番環境のアプリケーションサーバーはリモートアクセスできないようにしておきます。しかし、インシデント発生時には、オペレーターがインシデントを調査するためにサーバーへの一時的なアクセスを要求し、付与を受けることができます。このアクセスは記録された理由に関連付けられ、別のオペレーターによって承認され、作業に必要な期間だけに限定されます。

### オブザーバビリティとコンプライアンス

* **VM およびコンテナのセッションアクティビティのロギングと、マネージドノードのアクセス・アクティビティのモニタリング:** Session Manager を使用して AWS コンソールからターミナルセッションを開始すると、セッションのすべてのコマンドとその結果を S3 および CloudWatch ロググループに記録できます。これにより、インタラクティブセッション中に行われたすべての変更の監査証跡を提供できます。また、CloudTrail イベントを使用して、ノードへの成功・失敗したリモートセッションをモニタリング（必要に応じてアラート発報）することもできます。例えば、定義された変更ウィンドウ外で実施されたリモートセッションを、当該ユーザーとそのマネージャーにアラートすることができます。

### 運用の簡素化

* **コンソールからのワンクリックアクセス:** Session Manager は AWS コンソールと十分に統合されており、EC2 コンソール、Session Manager コンソール、Fleet Manager コンソールから「接続」オプションを提供します。
* **SSH を管理する必要がない**: Session Manager を使用すれば、伸縮自在なノード群への SSH アクセスのために PKI インフラストラクチャを作成、配布、更新する必要がありません。IAM による一元的な認可により、フリート全体で秘密鍵を保存、保護、モニタリングする必要がなくなります。
* **セキュリティグループを開かずにアクセスを許可:** Session Manager の「ポートフォワーディング」機能を使用すると、インスタンスのリモートセッションポートへのネットワークアクセスを開いたり広げたりすることなく、ノードへの認可されたアクセスを許可できます。例えば、開発者は、自宅の開発マシンから Session Manager サービスを介して対象のインスタンスにポートフォワーディングを行い、完全に暗号化・認証されたパイプライン経由でテスト環境のデータベースインスタンスに安全にアクセスできます。
* **一元化されたアクセス:** コンソールおよび IAM との統合により、オペレーターは必要な（かつ認可された）リモートアクセスを、必要な場所どこからでも得られます。
* **「Blast Radius」の低減:** インバウンドネットワークポートをロックし、リモートアクセスを一元的にユーザーのロールが必要とするノードのみに制限することで、潜在的な侵害が引き起こす可能性のある「Blast Radius（影響範囲）」を低減します。

### IT コストの最適化

* **踏み台ホストやジャンプホストが不要:** Session Manager は、環境から踏み台ホストやジャンプホストを使用する必要性を排除し、24 時間 365 日稼働するインスタンスのコストを削減できます。これは、SSH および RDP のインバウンドネットワークポートを開いたホストと、環境内の他のノードへの SSH および RDP によるアウトバウンドアクセスを置き換えることを意味します。代わりに、アクセスはクラウド環境の他の部分と同じメカニズム（IAM）によって保護され、対象ノードへのきめ細かな認可と一時的な認証情報へのアクセスを提供します。
* **EC2 インスタンスへのアクセスに追加料金なし**: EC2 の既存のインスタンス料金以外に、Session Manager を使用して EC2 ノードやコンテナへのリモートアクセスを許可するための追加料金は必要ありません。


### Session Manager の仕組み

![Session Manager](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-7.png "Session Manager")

1. ノードには SSM エージェントがインストールされており、かつ Systems Manager サービスへのポート 443 のアウトバウンド接続が確立されている必要があります。
2. この接続は、パブリックサービスエンドポイントへの接続（すなわちインターネット経由）でも、VPC 内のプライベートエンドポイント経由の接続でもかまいません。
3. ノードには、ネットワーク経由でサービスに接続して永続的な接続を確立するための適切な権限を持つプロファイルが必要です。

**注意:** デフォルトのローカルユーザー: `ssm-user.` Linux の場合: /etc/sudoers、Windows の場合: Administrators グループ。

### Session Manager との接続の確立

![Session Manager](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-8.png "Session Manager")

1. ユーザーがそのノードにリモート接続したい場合、ユーザーはそのノードとの「セッションの開始」を試みる必要があります。****
2. Session Manager は、ユーザーがその特定の EC2 インスタンスで「セッションの開始」を許可されているかどうかを確認します。
3. IAM がユーザー/プリンシパルの権限を確認します。
4. ノードは、AWS Systems Manager への永続的な接続を通じて、認可された接続要求を認識します。
5. 次にノードは、AWS Session Manager サービスを介して、要求元のユーザーへの暗号化されたトンネルを確立します。

### Session Manager の設定

Session Manager の設定では、そのアカウント内のリージョンレベルで Session Manager の設定を構成する場所を提供します。設定がオーバーライドされない限り（例えばコマンドラインから特定の設定を渡すなど）、変更内容はそのアカウント/リージョン内のすべてのセッションに適用されます。

* **セッションの継続時間/タイムアウト**: AWS Session Manager セッションの最小継続時間は 1 分、最大は 1,440 分（24 時間）です。最大継続時間に加えて、アイドルセッションタイムアウトを構成することで、最小 1 分から最大 60 分として定義された非アクティブ期間の後にセッションを終了させることができます。
* **セッションの暗号化設定**: クライアントマシンとマネージドノード間で送信されるデータをさらに保護するための AWS KMS キー暗号化です。一部の System Manager 機能（例えばノードのユーザーパスワードのリセット）では、AWS KMS 暗号化が有効になっている必要があります。
* **Linux/MacOS の Run As サポート:** Run As 機能を使用すると、AWS Systems Manager Session Manager がマネージドノード上に作成できるシステム生成の ssm-user アカウントの認証情報の代わりに、指定したオペレーティングシステムユーザーの認証情報を使用してセッションを開始できます（ただし、RunAs は Linux および MacOS ノードでのみ利用可能です）。
* **監査およびレポート用のセッションロギング**: Session Manager を構成して、セッション履歴ログを作成し、Amazon Simple Storage Service (Amazon S3) バケットまたは Amazon CloudWatch Logs ロググループに送信します。保存されたログデータは、マネージドノードへのセッション接続や、セッション中にそれらのノード上で実行されたコマンドについて、監査やレポートを行うために使用できます。
* **シェルプロファイル/設定**: カスタマイズ可能なプロファイルにより、シェル設定、環境変数、作業ディレクトリ、セッション開始時の複数コマンドの実行など、セッション内の設定を定義できます。

### セッションの暗号化

* セッションはデフォルトで TLS 1.2 によって暗号化されます
  * KMS キーを使用して暗号化のレイヤーを追加で有効にできます
* パスワードのリセットなど、一部の Fleet Manager のアクションでは KMS 暗号化を有効にする必要があります
* KMS で暗号化されたセッションでは、セッション開始時にメッセージが表示されます

**注意:** KMS による暗号化のレイヤーを追加するには、KMS 暗号化キーを設定に追加する必要があります。Session Manager を使用するには、マネージドノードとユーザーの両方に IAM アクセス許可が必要です。KMS 暗号化を追加すると、ノードとユーザーに割り当てる必要のある権限が増えます。

### セッションのロギング

設定では、セッションのロギングを有効にできます。セッションログは、ターミナルセッション中に発行されたすべてのコマンドと表示された結果の記録です。これらを CloudWatch、S3、またはその両方に送信できます。

これにより、暗号化されたロググループおよび S3 バケットを使用できます。これらのリソースの実際の暗号化設定は CloudWatch および S3 で行われます。S3 バケットおよび CloudWatch ロググループへのアクセスは、「s3:GetEncryptionConfiguration」などの権限とともに EC2 インスタンスプロファイルに付与する必要があります。CloudWatch のロギングでは、ログを入力されたとおりにストリーミングする（推奨オプション）か、セッション終了時にログを送信できます。

**注意:** Windows Server のマネージドノードに **PowerShell Transcription** ポリシー設定を構成している場合、セッションデータを CloudWatch または S3 にストリーミングすることは***できません***。また、Linux または macOS のマネージドノードを使用している場合は、screen ユーティリティがインストールされていることを確認してください。インストールされていないと、ログデータが切り捨てられる可能性があります。

* CloudWatch のロギングにより、Session Manager は監査目的で、発行された各コマンドとユーザーに表示された結果を CloudWatch に記録できます。この情報（および CloudTrail に記録された Session Manager イベント）を使用することで、お客様はサーバー上で ssm-user ローカルユーザーを使用して実行されたコマンドに IAM アイデンティティを関連付けることができます。
  * ストリーミングされたログは json 形式で保存されます
* AWS Systems Manager Session Manager の「セッション履歴」タブは、個々の Session Manager セッションから、そのセッションの CloudWatch ログまたは S3 レコードへの直接リンクを提供します。
* セッションのロギングを記録するには、SSM、CloudWatch、S3 への必要な権限を持つ IAM ロールが用意されていることを確認する必要があります。

詳細については、[Session Manager と Amazon S3 および CloudWatch Logs の権限を持つ IAM ロールの作成を開始する](https://docs.aws.amazon.com/systems-manager/latest/userguide/getting-started-create-iam-instance-profile.html#create-iam-instance-profile-ssn-logging)を参照してください。

### セッション設定の適用方法

* 指定された設定で SSM-SessionManagerRunShell ドキュメントが作成され、そのリージョンのアカウントに適用されます
* カスタム設定は SessionManagerRunShell.json を使用して構成でき、その json ファイルを渡して SSM-SessionManagerRunShell ドキュメントを作成します
* SessionManagerRunShell.json ファイルを更新し、Update-document API を実行して SSM-SessionManagerRunShell ドキュメントを更新することで、設定を更新します

セッション設定の詳細については、[設定の構成を開始する](https://docs.aws.amazon.com/systems-manager/latest/userguide/getting-started-configure-preferences-cli.html)を参照してください。

### Session Manager を使用してインスタンスに接続するさまざまな方法とは？

1. **標準セッション:** EC2 コンソール（インスタンスへの接続）または Fleet Manager（ターミナルセッションの開始）から接続するか、両方のコンソールで Windows の場合は RDP 経由での接続を選択できます。
    1. 標準セッションは、ターミナルのコマンドラインセッションを開きます。Linux の場合はシェルを、Windows の場合は powershell セッションを開きます。
    2. ssm-user は、インスタンスでセッションが初めて開始されたときに作成されます。そして、Windows では Admin グループに、Linux では sudoers に自動的に追加されます。

**注意:** ユーザーが削除された場合、SSM エージェントはそれを再作成しないため、Session Manager の接続が失敗する原因となります。

1. **SSH:** SSH トンネルを使用すると、ローカルポートへの接続を安全なチャネルを通じてリモートマシンに転送できます。
    1. AWS CLI 経由のみ
    1. SSH キーが必要
        1. SCP 経由でのファイルコピーが可能
    1. SSH 構成ファイルを変更
    1. ロギング
        1. セッションコマンドのロギングなし
        1. 制限: セッション履歴、CloudTrail

制限事項: セッションコマンドはログに記録されません。これは、SSH がすべてのセッションデータを暗号化し、Session Manager は SSH 接続のトンネルとしてのみ機能するためです。セッションを確認するには、セッション履歴と CloudTrail を使用できます。

![Session Manager](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-10.png "Session Manager")

1. **ポートフォワーディング:**
    1. AWS CLI および session manager プラグイン経由のみ
        1. CloudShell を含む！
    1. トンネリングのユースケースを可能にする
        1. EC2、RDS、Fargate、ElastiCache へのトンネル
    1. Fleet Manager 経由での RDP を可能にする
        1. ロギング
        1. セッションコマンドのロギングなし
        1. 制限: セッション履歴と CloudTrail

**注意:** ポートフォワーディングまたは SSH を介して接続する Session Manager セッションでは、ロギングは利用できません。これは、SSH がすべてのセッションデータを暗号化し、Session Manager は SSH 接続のトンネルとしてのみ機能するためです。

portNumber に指定する値は、トラフィックのリダイレクト先となるマネージドノード上のリモートポートを表します（例えば 80）。このパラメータが指定されていない場合、Session Manager はデフォルトのリモートポートとして 80 を想定します。

localPortNumber に指定する値は、トラフィックのリダイレクト先となるクライアント上のローカルポートを表します（例えば 56789）。この値は、クライアントを使用してマネージドノードに接続するときに入力する値です。例えば、localhost:56789 のようになります。

![Session Manager](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-11.png "Session Manager")

### 標準セッションのアクセス制限

IAM が提供する最小権限の原則を使用してノードへのアクセスを制御できる要素が 2 つあります。
Session Manager が使用するユーザーアカウントがインスタンス上で実行できる操作を制限するか、ユーザーの IAM プリンシパルがセッションを開始できるインスタンスを制限することができます。

Windows のマネージドノードでは、ユーザーは利用可能な任意の Windows ユーザー（例えば、ノードがドメインに接続されている場合は AD ユーザー）を使用して RDP セッション経由で接続できます。ただし、ユーザーがターミナルセッションを使用して接続する場合、唯一の選択肢は ssm-user です。Windows ノード上で ssm-user が実行できる操作を制限するには、管理者/ユーザーが ssm-user の所属グループを変更できます（デフォルトでは Administrators グループのメンバーです）。

Linux のマネージドノードでは、ユーザーは「Run As」設定を構成して、ターミナルセッションが接続するユーザーを変更できます。デフォルトでは、これは sudo 権限を持つ ssm-user です。「Run As」を使用すると、ユーザーは ssm-user を別のデフォルトユーザーに変更できます。

あるいは、IAM ユーザーロールに設定されたタグの値に基づいて、どのユーザーとして接続できるかを決定するために使用するタグを指定することもできます。

**注意:** IAM Identity Center と許可セットを使用してユーザーアクセスを制御している場合、IAM Identity Center のユーザーはタグを設定できないため、そうしたユーザーにとっては Run As の柔軟性が低くなります。

![Session Manager](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-9.png "Session Manager")

### EC2 Instance Connect はどうか？

Session Manager が、AWS Session Manager へのアウトバウンドで認証・認可されたリンクを介してノードへのリモート接続を保護・簡素化するものであるのに対し、「EC2 Instance Connect」は EC2 Linux ホストへのインバウンド SSH 接続を簡素化するものです。

EC2 Instance Connect は、EC2 メタデータサービスを介してインスタンスと共有される短期間有効な SSH キーを生成・使用することで、SSH 管理を簡素化します。これは、リモート接続を試みるユーザーがポート 22 でインバウンドネットワークアクセスを持つことを必要とし、さらに、クロスプラットフォーム・クロスクラウドで動作する Session Manager と比べて、EC2 Instance Connect は EC2 で実行される Linux ホストにのみ適用されます。

## Fleet Manager

Fleet Manager は、あるリージョン内のアカウントのすべてのノードに対する統一されたコンソールを提供します（リージョンを変更して、他のリージョンでも同様のビューを表示できます）。System Manager に接続されているかどうか、エージェントのバージョンなどのメタデータを確認できます。オペレーターが統一されたコンソールでプラットフォームをまたいで一般的な管理タスクを実行できるようにすることで、システム管理者の効率が向上します。

![Fleet Manager](/img/cloudops/guides/centralized-operations-management/remote-and-session-management/BP-Remote-Session-Mgmt-12.png "Fleet Manager")

### Fleet Manager のユースケース

* マネージドノードに手動で接続することなく、さまざまな一般的なシステム管理タスクを実行できます。
* サーバーをリモート管理するための一元化された UI: さまざまなプラットフォームのインスタンスを、その状態、SSM エージェントのステータス、プラットフォームとともに確認できます。管理目的で UI からレポートをダウンロードできます。
  * 複数のプラットフォームで実行されているノードを、単一の統一されたコンソールから管理できます。
  * 異なるオペレーティングシステムで実行されているノードを、単一の統一されたコンソールから管理できます。
* システム管理の効率を向上させます。

### Fleet Manager はノードとどのように連携するか？

Fleet Manager は ```AWSFleetManager-*``` のプレフィックスが付いたドキュメントを呼び出します。ドキュメントは Run Command または Session Manager のいずれかを使用して結果を取得し、Fleet Manager コンソールに表示します。
