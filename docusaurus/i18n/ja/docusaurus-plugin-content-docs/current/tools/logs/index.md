# ログ記録

ロギングツールの選択は、データ転送、フィルタリング、保持、キャプチャ、およびデータを生成するアプリケーションとの統合に関する要件に依存します。オブザーバビリティに Amazon Web Services を使用する場合（オンプレミスまたは別のクラウド環境でホストしているかどうかに関わらず）、[CloudWatch エージェント](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html) または [Fluentd](https://www.fluentd.org/) などの別のツールを活用して、分析用のロギングデータを送信できます。

ここでは、ログ記録のための CloudWatch エージェントの実装と、AWS コンソールまたは API 内での CloudWatch Logs の使用に関するベストプラクティスについて詳しく説明します。

:::info
	CloudWatch エージェントは、CloudWatch への[メトリクスデータ](../../signals/metrics)の配信にも使用できます。実装の詳細については、[メトリクス](../metrics)ページを参照してください。また、OpenTelemetry または X-Ray クライアント SDK から[トレース](../../signals/traces.md)を収集し、[AWS X-Ray](../xray.md)に送信するためにも使用できます。
:::
## CloudWatch エージェントを使用したログの収集

### フォワーディング

[クラウドファーストアプローチ](../../faq/general.md#what-is-a-cloud-first-approach)を可観測性に適用する場合、原則として、ログを取得するためにマシンにログインする必要がある場合はアンチパターンです。ワークロードはログデータをほぼリアルタイムでログ分析システムに送信する必要があり、その送信と元のイベントの間のレイテンシーは、ワークロードに障害が発生した場合にポイントインタイムの情報が失われる可能性を示しています。

アーキテクトとして、ログデータの許容損失を決定し、CloudWatch エージェントの[`force_flush_interval`](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-Configuration-File-Details.html#CloudWatch-Agent-Configuration-File-Logssection) に対応するために使用します。

`force_flush_interval` は、バッファサイズに達した場合を除き、エージェントに対して定期的なペースでログデータをデータプレーンに送信するよう指示します。バッファサイズに達した場合は、バッファリングされたすべてのログを即座に送信します。

:::tip
	エッジデバイスは、低レイテンシーの AWS 内ワークロードとは大きく異なる要件を持つ場合があり、はるかに長い `force_flush_interval` 設定が必要になることがあります。たとえば、低帯域幅のインターネット接続上の IoT デバイスでは、15 分ごとにログをフラッシュするだけで十分な場合があります。
:::
:::info
	コンテナ化またはステートレスなワークロードは、ログのフラッシュ要件に特に敏感である場合があります。いつでもスケールインできるステートレスな Kubernetes アプリケーションや EC2 フリートを考えてみてください。これらのリソースが突然終了すると、ログが失われる可能性があり、将来的にそれらからログを抽出する方法がなくなります。標準的な `force_flush_interval` これらのシナリオには通常適切ですが、必要に応じて下げることもできます。
:::
### ロググループ

CloudWatch Logs では、アプリケーションに論理的に適用されるログの各コレクションは、単一の[ロググループ](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatchLogsConcepts.html)に配信される必要があります。そのロググループ内では、内部にログストリームを作成するソースシステム間で*共通性*を持たせることが重要です。

LAMP スタックを例に考えると、Apache、MySQL、PHP アプリケーション、およびホスティング Linux オペレーティングシステムからのログは、それぞれ別のロググループに属することになります。

このグループ化は、同じ保持期間、暗号化キー、メトリクスフィルター、サブスクリプションフィルター、および Contributor Insights ルールを持つグループを統一的に扱えるため、非常に重要です。

:::info
	ロググループ内のログストリーム数に制限はなく、単一の CloudWatch Logs Insights クエリでアプリケーションのすべてのログを検索できます。Kubernetes サービスの各 Pod ごと、またはフリート内のすべての EC2 インスタンスごとに個別のログストリームを持つことは、標準的なパターンです。
:::
:::info
	ログ グループのデフォルトの保持期間は*無期限*です。ベストプラクティスは、ログ グループの作成時に保持期間を設定することです。

CloudWatch コンソールでいつでも設定できますが、ベストプラクティスは、インフラストラクチャをコード（CloudFormation、Cloud Development Kit など）として使用してロググループの作成と同時に行うか、または `retention_in_days` CloudWatch エージェント設定内の設定。

どちらのアプローチでも、ログの保持期間をプロアクティブに設定でき、プロジェクトのデータ保持要件に合わせることができます。
:::

:::info
	ロググループのデータは、CloudWatch Logs で常に暗号化されています。デフォルトでは、CloudWatch Logs は `server-side` 保存中のログデータの暗号化。代替手段として、この暗号化に AWS Key Management Service を使用することができます。[AWS KMS を使用した暗号化](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/encrypt-log-data-kms.html)はロググループレベルで有効化され、ロググループの作成時または作成後に KMS キーをロググループに関連付けることで設定できます。これはインフラストラクチャをコード（CloudFormation、Cloud Development Kit など）として使用して設定できます。

AWS Key Management Service を使用して CloudWatch Logs のキーを管理するには、追加の設定とユーザーへのキーに対する権限の付与が必要です。[^1]
:::
### ログのフォーマット

CloudWatch Logs には、ログフィールドを自動的に検出し、取り込み時に JSON データをインデックス化する機能があります。この機能により、アドホッククエリとフィルタリングが容易になり、ログデータの使いやすさが向上します。ただし、自動インデックス化は構造化データにのみ適用される点に注意が必要です。非構造化ログデータは自動的にインデックス化されませんが、CloudWatch Logs に配信することは可能です。

非構造化ログは、正規表現を使用して検索またはクエリを実行することができます。 `parse` コマンド。

:::info
	CloudWatch Logs を使用する際のログフォーマットに関する 2 つのベストプラクティス：

1. [Log4j](https://logging.apache.org/log4j/2.x/) などの構造化ログフォーマッターを使用します。[`python-json-logger`](https://pypi.org/project/python-json-logger/)、またはフレームワーク独自の JSON エミッターを使用します。
	2. ログの送信先に、イベントごとに 1 行のログを送信します。

複数行の JSON ログを送信する場合、各行は単一のイベントとして解釈されることに注意してください。
:::
### `stdout` の処理

[ログシグナル](../../signals/logs#stdout-へのログ出力)のページで説明したように、ベストプラクティスはログシステムをそれを生成するアプリケーションから切り離すことです。ただし、データを送信するには `stdout` ファイルへの書き込みは、多くの（ほとんどではないにしても）プラットフォームで一般的なパターンです。Kubernetes や [Amazon Elastic Container Service](https://aws.amazon.com/ecs/) などのコンテナオーケストレーションシステムは、この配信を管理します。 `stdout` ログファイルに自動的に書き込まれ、コレクターによって各ログを収集できるようになります。CloudWatch エージェントはこのファイルをリアルタイムで読み取り、お客様に代わってロググループにデータを転送します。

:::info
	簡略化されたアプリケーションログのパターンを使用して `stdout`、できる限りエージェントによる収集を使用します。
:::
### ログのフィルタリング

ログをフィルタリングする理由は多数あります。たとえば、個人データの永続的な保存を防ぐことや、特定のログレベルのデータのみをキャプチャすることなどが挙げられます。いずれの場合も、ベストプラクティスは、このフィルタリングを発生元のシステムにできる限り近い場所で実行することです。CloudWatch の場合、これは分析のために CloudWatch Logs にデータが配信される*前*に実行することを意味します。CloudWatch エージェントはこのフィルタリングを代わりに実行できます。

:::info
	[`filters`](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-Configuration-File-Details.html#CloudWatch-Agent-Configuration-File-Logssection) 機能を使用して `include` 必要なログレベルと `exclude` クレジットカード番号、電話番号など、望ましくないことが既知のパターン。
:::
:::tip
	ログに漏洩する可能性のある既知の特定のデータ形式をフィルタリングすることは、時間がかかりエラーが発生しやすい作業です。しかし、特定の種類の既知の望ましくないデータ（クレジットカード番号、社会保障番号など）を扱うワークロードでは、これらのレコードにフィルターを設けることで、将来的に深刻なコンプライアンス問題を防ぐことができます。例えば、社会保障番号を含むすべてのレコードを削除するには、次のような設定で簡単に実現できます。

	```
	"filters": [
      {
        "type": "exclude",
        "expression": "\b(?!000|666|9\d{2})([0-8]\d{2}|7([0-6]\d))([-]?|\s{1})(?!00)\d\d\2(?!0000)\d{4}\b"
      }
    ]
    ```
:::

### マルチラインロギング

すべてのロギングにおけるベストプラクティスは、個々のログイベントごとに 1 行を出力する[構造化ロギング](../../signals/logs#構造化ログは成功の鍵)を使用することです。ただし、このオプションを持たないレガシーアプリケーションや ISV サポートアプリケーションも多く存在します。これらのワークロードでは、マルチライン対応プロトコルを使用して出力されない限り、CloudWatch Logs は各行を個別のイベントとして解釈します。CloudWatch エージェントは [`multi_line_start_pattern`](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-Configuration-File-Details.html#CloudWatch-Agent-Configuration-File-Logssection) ディレクティブでこれを実行できます。

:::info
	使用してください `multi_line_start_pattern` 複数行のログを CloudWatch Logs に取り込む負担を軽減するためのディレクティブです。
:::
### ログクラスの設定

CloudWatch Logs は、ロググループの 2 つの[クラス](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch_Logs_Log_Classes.html)を提供しています。

- CloudWatch Logs Standard ログクラスは、リアルタイムモニタリングが必要なログや頻繁にアクセスするログに対応した、フル機能のオプションです。

- CloudWatch Logs の低頻度アクセスログクラスは、ログをコスト効率よく統合するために使用できる新しいログクラスです。このログクラスは、マネージドインジェスト、ストレージ、クロスアカウントログ分析、暗号化など CloudWatch Logs 機能のサブセットを提供し、GB あたりのインジェスト料金が低く抑えられています。低頻度アクセスログクラスは、アドホッククエリや、アクセス頻度の低いログに対する事後のフォレンジック分析に最適です。

:::info
	使用してください `log_group_class` 新しいロググループに使用するロググループクラスを指定するディレクティブです。有効な値は **STANDARD** と **INFREQUENT_ACCESS** です。このフィールドを省略した場合、エージェントはデフォルトの **STANDARD** を使用します。
:::

#### 適切なクラス指定のための既存ログの監査

CloudWatch ログの Infrequent Access ティアログクラスは、CloudWatch ログ機能のサブセットを利用します。既存のロググループを監査して、標準ロググループのいずれかを Infrequent Access ロググループとして再作成できるかどうかを確認することをお勧めします。これを行う良い方法は、[log-ia-checker](https://github.com/aws-observability/log-ia-checker) CLI ツールを実行することです。このツールは、指定されたリージョン内のすべてのロググループを分析し、Infrequent Access に移行できるログの出力を提供します。

## CloudWatch Logs で検索する

### クエリスコープによるコスト管理

CloudWatch Logs にデータが配信されると、必要に応じて検索できるようになります。CloudWatch Logs はスキャンされたデータの GB 単位で課金されることに注意してください。クエリのスコープを制御し、スキャンされるデータ量を削減するための戦略があります。

:::info
	ログを検索する際は、時間と日付の範囲が適切であることを確認してください。CloudWatch Logs では、スキャンの相対的または絶対的な時間範囲を設定できます。*前日のエントリのみを検索している場合は、今日のログをスキャンに含める必要はありません！*
:::

:::info
	1 つのクエリで複数のロググループを検索できますが、そうするとスキャンされるデータ量が増加します。対象とする必要のあるロググループを特定したら、それに合わせてクエリのスコープを絞り込んでください。
:::

:::tip
	各クエリが実際にスキャンするデータ量は、CloudWatch コンソールから直接確認できます。このアプローチは、効率的なクエリの作成に役立ちます。

	![Preview of the CloudWatch Logs console](../../images/cwl1.png)
:::

### 成功したクエリを他のユーザーと共有する

[CloudWatch Logs のクエリ構文](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html)はそれほど複雑ではありませんが、特定のクエリをゼロから記述するのは時間がかかる場合があります。同じ AWS アカウント内の他のユーザーと適切に記述されたクエリを共有することで、アプリケーションログの調査を効率化できます。これは、[AWS Management Console](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_Insights-Saving-Queries.html) から直接行うか、[CloudFormation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-querydefinition.html) または [AWS CDK](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_logs.CfnQueryDefinition.html) を使用してプログラム的に実現できます。そうすることで、ログデータを分析する必要がある他のユーザーの手間を軽減できます。

:::info
	よく繰り返されるクエリを CloudWatch Logs に保存することで、ユーザーに対してあらかじめ入力された状態で提供できます。

	![The CloudWatch Logs query editor page](../../images/cwl2.png)
:::

### パターン分析

CloudWatch Logs Insights は、ログをクエリする際にパターンを見つけるために機械学習アルゴリズムを使用します。パターンとは、ログフィールド間で繰り返し現れる共通のテキスト構造です。大量のログイベントを少数のパターンに圧縮できることが多いため、パターンは大規模なログセットの分析に役立ちます。[^2]

:::info
	パターンを使用して、ログデータを自動的にパターンにクラスタリングします。

	![The CloudWatch Logs query pattern example](../../images/pattern_analysis.png)
:::

### 前の時間範囲との比較 (diff)

CloudWatch Logs Insights は、時間の経過に伴うログイベントの変化の比較を可能にし、エラー検出とトレンド識別を支援します。比較クエリはパターンを明らかにし、迅速なトレンド分析を容易にするとともに、より深い調査のためにサンプルの生ログイベントを検査する機能も備えています。クエリは、選択した期間と同じ長さの比較期間という 2 つの時間帯に対して分析されます。[^3]

:::info
	ログイベントの変化を時系列で比較するには `diff` コマンド。

	![The CloudWatch Logs query difference example](../../images/diff-query.png)
:::

[^1]: アクセス権限を伴う CloudWatch Logs ロググループ暗号化の実践的な例については、[How to search through your AWS Systems Manager Session Manager console logs – Part 1](https://aws.amazon.com/blogs/mt/how-to-search-through-your-aws-systems-manager-session-manager-console-logs-part-1/) を参照してください。

[^2]: より詳細なインサイトについては、[CloudWatch Logs Insights Pattern Analysis](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_AnalyzeLogData_Patterns.html) を参照してください。

[^3]: 詳細については、[CloudWatch Logs Insigts Compare(diff) with previous ranges](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_AnalyzeLogData_Compare.html) を参照してください。
