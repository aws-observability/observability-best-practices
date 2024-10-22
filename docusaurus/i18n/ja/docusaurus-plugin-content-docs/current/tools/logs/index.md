# ログ

ログツールの選択は、データ転送、フィルタリング、保持、キャプチャ、およびデータを生成するアプリケーションとの統合に関する要件に関連しています。Amazon Web Services を可観測性のために使用する場合 (オンプレミス環境や他のクラウド環境でホストされているかどうかに関係なく)、[CloudWatch エージェント](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html) または [Fluentd](https://www.fluentd.org/) などの別のツールを利用して、分析用のログデータを出力できます。

ここでは、ログ用の CloudWatch エージェントの実装とAWSコンソールまたは API での CloudWatch Logs の使用に関するベストプラクティスについて説明します。

alert{type="info"}
CloudWatch エージェントは、[メトリクスデータ](../../signals/metrics/) を CloudWatch に配信するためにも使用できます。実装の詳細については、[メトリクス](../../tools/metrics/)ページを参照してください。また、OpenTelemetry または X-Ray クライアント SDK から[トレース](../../signals/traces.md)を収集し、[AWS X-Ray](../../tools/xray.md)に送信するためにも使用できます。


## CloudWatch エージェントによるログの収集

### 転送

オブザーバビリティに [クラウドファーストアプローチ](../../faq#what-is-a-cloud-first-approach) を取る場合、ルールとして、ログを取得するためにマシンにログインする必要がある場合は、アンチパターンとなります。ワークロードは、ログデータをリアルタイムで外部のログ分析システムに出力する必要があります。そのデータ転送とイベント発生の間の遅延は、ワークロードに障害が発生した場合、その時点の情報が失われる可能性があります。

アーキテクトとして、ログデータの許容される損失量を決定し、CloudWatch エージェントの [`force_flush_interval`](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-Configuration-File-Details.html) を調整する必要があります。

`force_flush_interval` は、エージェントにバッファサイズに達する前に、定期的にログデータをデータプレーンに送信するよう指示します。バッファサイズに達した場合は、すぐにバッファ内のすべてのログを送信します。

tip
	エッジデバイスは、低レイテンシーの AWS 内のワークロードとは要件が大きく異なる可能性があり、より長い `force_flush_interval` 設定が必要になる場合があります。たとえば、低帯域幅のインターネット接続の IoT デバイスでは、15 分ごとにログをフラッシュする必要があるかもしれません。

info
	コンテナ化されたワークロードやステートレスワークロードは、ログフラッシュの要件に特に敏感な場合があります。いつでも縮小できるステートレス Kubernetes アプリケーションや EC2 フリートを考えてみましょう。これらのリソースが突然終了すると、将来的にログを抽出する方法がなくなり、ログが失われる可能性があります。標準の `force_flush_interval` は通常、このようなシナリオに適していますが、必要に応じて短くすることができます。


### ロググループ

CloudWatch Logs 内では、アプリケーションに論理的に適用される各ログコレクションは、単一の [ロググループ](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/CloudWatchLogsConcepts.html) に配信されるべきです。そのロググループ内では、ログストリームを作成するソースシステム間に *共通性* があることが望ましいです。

LAMP スタックを考えてみましょう。Apache、MySQL、PHP アプリケーション、ホストの Linux オペレーティングシステムからのログはそれぞれ別々のロググループに属するべきです。

このグループ分けは非常に重要です。なぜなら、同じ保持期間、暗号化キー、メトリックフィルター、サブスクリプションフィルター、Contributor Insights ルールを持つグループを同じように扱えるからです。

info
ロググループ内のログストリームの数に制限はありません。CloudWatch Logs Insights クエリで、アプリケーション全体のログを検索できます。Kubernetes サービスの各 Pod、または EC2 インスタンスフリートの各インスタンスに対して別々のログストリームを持つことは標準的なパターンです。

info
ロググループのデフォルトの保持期間は *無期限* です。ベストプラクティスは、ロググループ作成時に保持期間を設定することです。

CloudWatch コンソールでいつでも設定できますが、ベストプラクティスは、インフラストラクチャ as コード (CloudFormation、Cloud Development Kit など) を使ってロググループ作成時に設定するか、CloudWatch エージェントの設定内の `retention_in_days` 設定を使うことです。

どちらのアプローチでも、プロジェクトのデータ保持要件に合わせてログの保持期間をプロアクティブに設定できます。


info
CloudWatch Logs のロググループデータは常に暗号化されています。デフォルトでは、CloudWatch Logs は保存時のログデータに `サーバー側` の暗号化を使用します。代替として、この暗号化に AWS Key Management Service を使うこともできます。[AWS KMS を使った暗号化](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/encrypt-log-data-kms.html) は、ロググループを作成するときまたは既存のロググループに KMS キーを関連付けることで、ロググループレベルで有効にできます。これはインフラストラクチャ as コード (CloudFormation、Cloud Development Kit など) で設定できます。

CloudWatch Logs で AWS Key Management Service を使ってキーを管理するには、追加の設定とユーザーへのキーへのアクセス許可付与が必要です。[^1]


### ログのフォーマット

CloudWatch Logs には、ログ取り込み時に自動的にログフィールドを検出し、JSON データをインデックス化する機能があります。この機能により、アドホックなクエリやフィルタリングが可能になり、ログデータの利用性が向上します。ただし、自動インデックス化は構造化データにのみ適用されることに注意が必要です。非構造化のログデータは自動的にインデックス化されませんが、CloudWatch Logs に配信することはできます。

非構造化のログは、`parse` コマンドを使用した正規表現による検索やクエリが可能です。

info
CloudWatch Logs を使用する際のログフォーマットのベストプラクティスは次の 2 つです。

1. [Log4j](https://logging.apache.org/log4j/2.x/)、[`python-json-logger`](https://pypi.org/project/python-json-logger/)、またはフレームワークのネイティブ JSON エミッターなど、構造化ログフォーマッターを使用する。
2. イベントごとに 1 行のログをログ送信先に送信する。

複数行の JSON ログを送信した場合、各行が 1 つのイベントとして解釈されることに注意してください。


### `stdout` の扱い

[ログシグナル](../../signals/logs/#log-to-stdout)のページで説明したように、ベストプラクティスはログシステムとそれを生成するアプリケーションを分離することです。しかし、`stdout` からファイルにデータを送信することは、多くのプラットフォーム (そうでないものも含む) で一般的なパターンです。Kubernetes や [Amazon Elastic Container Service](https://aws.amazon.com/jp/ecs/) などのコンテナオーケストレーションシステムは、`stdout` からログファイルへの配信を自動的に管理し、各ログをコレクターで収集できるようにしています。CloudWatch エージェントはこのファイルをリアルタイムで読み取り、ロググループにデータを転送します。

info
	できる限り、`stdout` への簡素化されたアプリケーションログ出力とエージェントによる収集のパターンを使用してください。


### ログのフィルタリング

ログをフィルタリングする理由は多くあります。例えば、個人データの永続的な保存を防ぐため、または特定のログレベルのデータのみをキャプチャするためです。いずれの場合でも、ベストプラクティスは、発信元システムに可能な限り近い場所でこのフィルタリングを実行することです。CloudWatch の場合、これは CloudWatch Logs に分析用のデータが配信される *前* に行う必要があります。CloudWatch エージェントがこのフィルタリングを行えます。

alert{type="info"}
[`filters`](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-Configuration-File-Details.html) 機能を使用して、取り込みたいログレベルを `include` し、望ましくない既知のパターン (クレジットカード番号、電話番号など) を `exclude` してください。

alert{type="tip"}
ログに漏れ込む可能性のある特定の形式の既知のデータをフィルタリングすることは、時間がかかり、エラーが発生しやすい作業です。ただし、特定の種類の望ましくないデータ (クレジットカード番号、社会保障番号など) を扱うワークロードの場合、これらのレコードに対するフィルタを設定することで、将来的に深刻なコンプライアンス問題を防ぐことができます。例えば、社会保障番号を含むすべてのレコードを削除するには、次の構成で簡単に行えます。

```
	"filters": [
      {
        "type": "exclude",
        "expression": "\b(?!000|666|9\d{2})([0-8]\d{2}|7([0-6]\d))([-]?|\s{1})(?!00)\d\d\2(?!0000)\d{4}\b"
      }
    ]
    ```


### 複数行のログ

すべてのログに対するベストプラクティスは、[構造化されたログ](../../signals/logs/#structured-logging-is-key-to-success)を使用し、個々のログイベントごとに 1 行を出力することです。ただし、この機能がない従来のアプリケーションやISVサポートされているアプリケーションが多数あります。このようなワークロードの場合、CloudWatch Logs は複数行対応のプロトコルを使用して出力されない限り、各行を個別のイベントとして解釈します。CloudWatch エージェントは [`multi_line_start_pattern`](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-Configuration-File-Details.html) ディレクティブを使用してこれを実行できます。

info
`multi_line_start_pattern` ディレクティブを使用すると、CloudWatch Logs への複数行ログの取り込み負荷を軽減できます。


### ログクラスの設定

CloudWatch Logs には、[クラス](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/CloudWatch_Logs_Log_Classes.html)が 2 つあります。

- CloudWatch Logs 標準ログクラスは、リアルタイムモニタリングが必要なログや頻繁にアクセスするログに適した、フル機能のオプションです。

- CloudWatch Logs 低頻度アクセスログクラスは、コスト効率の良いログの統合に使用できる新しいログクラスです。このログクラスには、マネージド型のインジェスト、ストレージ、クロスアカウントログ分析、低価格のインジェスト料金での暗号化など、CloudWatch Logs の機能の一部が含まれています。低頻度アクセスログクラスは、アドホックなクエリや、アクセス頻度の低いログの事後分析に最適です。

info
`log_group_class` ディレクティブを使用して、新しいロググループに使用するロググループクラスを指定します。有効な値は **STANDARD** と **INFREQUENT_ACCESS** です。このフィールドを省略すると、エージェントによってデフォルトの **STANDARD** が使用されます。


## CloudWatch Logs での検索

### クエリスコープでコストを管理する

CloudWatch Logs にデータが配信されると、必要に応じてそのデータを検索できるようになります。ただし、CloudWatch Logs はスキャンされたデータの量に応じて課金されることに注意してください。スキャンされるデータ量を抑えるための戦略があり、それによってコストを削減できます。

info
ログを検索する際は、時間と日付の範囲が適切であることを確認してください。CloudWatch Logs では、スキャンの相対時間範囲または絶対時間範囲を設定できます。*前日のエントリだけを探している場合は、当日のログをスキャンする必要はありません!*


info
1 つのクエリで複数のロググループを検索できますが、その場合はより多くのデータがスキャンされます。対象のロググループを特定したら、クエリスコープを絞り込んでください。


tip
実際にスキャンされるデータ量は CloudWatch コンソールから直接確認できます。この方法を使えば、効率的なクエリを作成できます。

![CloudWatch Logs コンソールのプレビュー](../../images/cwl1.png)


### 他のユーザーと成功したクエリを共有する

[CloudWatch Logs クエリ構文](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html)は複雑ではありませんが、特定のクエリを最初から書くのは時間がかかる場合があります。
同じ AWS アカウント内の他のユーザーと適切に書かれたクエリを共有すれば、アプリケーションログの調査を効率化できます。
これは [AWS マネジメントコンソール](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/CWL_Insights-Saving-Queries.html)から直接、または [CloudFormation](https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/aws-resource-logs-querydefinition.html) や [AWS CDK](https://docs.aws.amazon.com/ja_jp/cdk/api/v2/docs/aws-cdk-lib.aws_logs.CfnQueryDefinition.html) を使ってプログラムで実行できます。
これにより、ログデータを分析する必要がある他のユーザーの作業を減らすことができます。

info
	繰り返し使用するクエリは CloudWatch Logs に保存しておくと、ユーザーに事前入力されます。

	![CloudWatch Logs クエリエディタページ](../../images/cwl2.png)


### パターン分析

CloudWatch Logs Insights は、ログをクエリするときに機械学習アルゴリズムを使用してパターンを見つけます。パターンとは、ログフィールド間で繰り返し現れる共有テキスト構造のことです。多くのログイベントがしばしば数パターンに圧縮できるため、パターンは大規模なログセットを分析するのに役立ちます。[^2]

info
パターンを使用して、ログデータを自動的にパターンにクラスタリングできます。

![CloudWatch Logs クエリパターンの例](../../images/pattern_analysis.png)


### 前の期間との比較 (diff)

CloudWatch Logs Insights を使用すると、ログイベントの変化を時間の経過とともに比較できます。これにより、エラーの検出やトレンドの特定が容易になります。比較クエリを使用すると、パターンが明らかになり、トレンド分析が簡単になります。さらに、サンプルの生ログイベントを調べることで、より深い調査が可能です。クエリは、選択した期間と同じ長さの比較期間の 2 つの期間に対して分析されます。[^3]

info
`diff` コマンドを使用して、ログイベントの変化を時間の経過とともに比較できます。

![CloudWatch Logs クエリの差分の例](../../images/diff-query.png)


[^1]: CloudWatch Logs ロググループの暗号化とアクセス権限の実践的な例については、[How to search through your AWS Systems Manager Session Manager console logs – Part 1](https://aws.amazon.com/jp/blogs/news/how-to-search-through-your-aws-systems-manager-session-manager-console-logs-part-1/) を参照してください。

[^2]: より詳細な Insights については、[CloudWatch Logs Insights Pattern Analysis](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/CWL_AnalyzeLogData_Patterns.html) を参照してください。

[^3]: 詳細については、[CloudWatch Logs Insigts Compare(diff) with previous ranges](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/CWL_AnalyzeLogData_Compare.html) を参照してください。
