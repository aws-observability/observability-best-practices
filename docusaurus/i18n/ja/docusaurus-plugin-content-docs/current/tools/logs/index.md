# ロギング

ロギングツールの選択は、データの送信、フィルタリング、保持、キャプチャ、およびデータを生成するアプリケーションとの統合に関する要件に結びついています。オブザーバビリティのために Amazon Web Services を使用する場合（[オンプレミス](../../faq#what-is-a-cloud-first-approach)や他のクラウド環境でホストしているかどうかに関わらず）、[CloudWatch エージェント](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html)や [Fluentd](https://www.fluentd.org/) などの他のツールを活用して、分析用のログデータを送信できます。

ここでは、ロギングのための CloudWatch エージェントの実装のベストプラクティスと、AWS コンソールまたは API 内での CloudWatch Logs の使用について詳しく説明します。

:::info
CloudWatch エージェントは、[メトリクスデータ](../../signals/metrics/)を CloudWatch に送信するためにも使用できます。実装の詳細については、[メトリクス](../../tools/metrics/)ページをご覧ください。また、OpenTelemetry や X-Ray クライアント SDK からの[トレース](../../signals/traces.md)を収集し、[AWS X-Ray](../../tools/xray.md) に送信するためにも使用できます。
:::



## CloudWatch エージェントを使用したログの収集




### 転送

[クラウドファーストアプローチ](../../faq#what-is-a-cloud-first-approach) をオブザーバビリティに適用する場合、原則として、ログを取得するためにマシンにログインする必要がある場合は、アンチパターンとなります。ワークロードは、ログデータをほぼリアルタイムで外部のログ分析システムに送信する必要があります。その送信と元のイベントとの間の遅延は、ワークロードに災害が発生した場合に、特定時点の情報が失われる可能性を意味します。

アーキテクトとして、ログデータの許容可能な損失を決定し、CloudWatch エージェントの [`force_flush_interval`](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-Configuration-File-Details.html) を適切に調整する必要があります。

`force_flush_interval` は、バッファサイズに達しない限り、エージェントに定期的にログデータをデータプレーンに送信するよう指示します。バッファサイズに達した場合は、バッファリングされたすべてのログを即座に送信します。

:::tip
エッジデバイスは、低遅延の AWS 内ワークロードとは大きく異なる要件を持つ場合があり、より長い `force_flush_interval` 設定が必要になる場合があります。例えば、低帯域幅のインターネット接続を使用する IoT デバイスでは、15 分ごとにログをフラッシュするだけで十分な場合があります。
:::
:::info
コンテナ化されたワークロードやステートレスなワークロードは、ログのフラッシュ要件に特に敏感である場合があります。例えば、いつでもスケールインできるステートレスな Kubernetes アプリケーションや EC2 フリートを考えてみてください。これらのリソースが突然終了した場合、将来的にログを抽出する方法がなくなり、ログが失われる可能性があります。通常、これらのシナリオには標準の `force_flush_interval` が適していますが、必要に応じて短縮することもできます。
:::



### ロググループ

CloudWatch Logs 内では、アプリケーションに論理的に適用されるログの各コレクションを、単一の[ロググループ](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/CloudWatchLogsConcepts.html)に配信する必要があります。そのロググループ内では、ログストリームを作成するソースシステム間に*共通性*を持たせることが重要です。

LAMP スタックを例に考えてみましょう。Apache、MySQL、PHP アプリケーション、ホスティング Linux オペレーティングシステムからのログは、それぞれ別のロググループに属することになります。

このグループ化は非常に重要です。これにより、同じ保持期間、暗号化キー、メトリクスフィルター、サブスクリプションフィルター、Contributor Insights ルールを使用してグループを扱うことができます。

:::info
ロググループ内のログストリーム数に制限はありません。また、単一の CloudWatch Logs Insights クエリで、アプリケーションのログ全体を検索できます。Kubernetes サービスの各 Pod や、フリート内の各 EC2 インスタンスに対して別々のログストリームを持つことは、標準的なパターンです。
:::

:::info
ロググループのデフォルトの保持期間は*無期限*です。ベストプラクティスは、ロググループ作成時に保持期間を設定することです。

CloudWatch コンソールでいつでも設定できますが、ベストプラクティスは、インフラストラクチャ as コード（CloudFormation、Cloud Development Kit など）を使用してロググループ作成と同時に設定するか、CloudWatch エージェント設定内の `retention_in_days` 設定を使用することです。

いずれのアプローチでも、ログ保持期間をプロアクティブに設定でき、プロジェクトのデータ保持要件に合わせることができます。
:::

:::info
ロググループデータは、CloudWatch Logs では常に暗号化されています。デフォルトでは、CloudWatch Logs は保存時のログデータに対して `サーバーサイド` 暗号化を使用します。代替として、この暗号化に AWS Key Management Service を使用することもできます。[AWS KMS を使用した暗号化](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/encrypt-log-data-kms.html)は、ロググループレベルで有効化され、ロググループの作成時または作成後に KMS キーを関連付けることで設定できます。これはインフラストラクチャ as コード（CloudFormation、Cloud Development Kit など）を使用して設定できます。

CloudWatch Logs のキー管理に AWS Key Management Service を使用するには、追加の設定とユーザーへのキーへのアクセス許可の付与が必要です。[^1]
:::



### ログのフォーマット

CloudWatch Logs には、取り込み時に自動的にログフィールドを検出し、JSON データをインデックス化する機能があります。
この機能により、アドホックなクエリやフィルタリングが容易になり、ログデータの使いやすさが向上します。
ただし、自動インデックス化は構造化されたデータにのみ適用されることに注意してください。
非構造化ログデータは自動的にインデックス化されませんが、CloudWatch Logs に配信することは可能です。

非構造化ログは、`parse` コマンドを使用して正規表現で検索やクエリを行うことができます。

:::info
	CloudWatch Logs を使用する際のログ形式に関する 2 つのベストプラクティス：

	1. [Log4j](https://logging.apache.org/log4j/2.x/)、[`python-json-logger`](https://pypi.org/project/python-json-logger/)、またはフレームワークのネイティブ JSON エミッターなど、構造化されたログフォーマッターを使用する。
	2. ログの送信先に 1 イベントにつき 1 行のログを送信する。

	複数行の JSON ログを送信する場合、各行が 1 つのイベントとして解釈されることに注意してください。
:::



### `stdout` の処理

[ログシグナル](../../signals/logs/#log-to-stdout) のページで説明したように、ベストプラクティスはロギングシステムを生成アプリケーションから切り離すことです。しかし、`stdout` からファイルにデータを送信することは、多くの (ほとんどの) プラットフォームで一般的なパターンです。Kubernetes や [Amazon Elastic Container Service](https://aws.amazon.com/jp/ecs/) などのコンテナオーケストレーションシステムは、この `stdout` からログファイルへの配信を自動的に管理し、コレクターから各ログを収集できるようにします。CloudWatch エージェントは、このファイルをリアルタイムで読み取り、データをロググループに転送します。

:::info
	可能な限り、アプリケーションのログを `stdout` に簡素化し、エージェントによる収集というパターンを使用してください。
:::



### ログのフィルタリング

個人データの永続的な保存を防ぐ、または特定のログレベルのデータのみを取得するなど、ログをフィルタリングする理由は多くあります。いずれの場合も、ベストプラクティスは発生元のシステムにできるだけ近い場所でこのフィルタリングを実行することです。CloudWatch の場合、これは分析のために CloudWatch Logs にデータが配信される *前* を意味します。CloudWatch エージェントはこのフィルタリングを実行できます。

:::info
	[`filters`](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-Configuration-File-Details.html) 機能を使用して、必要なログレベルを `include` し、クレジットカード番号や電話番号など、望ましくないことがわかっているパターンを `exclude` します。
:::
:::tip
	ログに漏れる可能性のある既知のデータの特定の形式をフィルタリングすることは、時間がかかり、エラーが発生しやすい場合があります。ただし、特定の種類の望ましくない既知のデータ（クレジットカード番号、社会保障番号など）を扱うワークロードの場合、これらのレコードのフィルターを設けることで、将来的に潜在的に深刻なコンプライアンス問題を防ぐことができます。例えば、社会保障番号を含むすべてのレコードを削除することは、次のような簡単な設定で可能です：

	```
	"filters": [
      {
        "type": "exclude",
        "expression": "\b(?!000|666|9\d{2})([0-8]\d{2}|7([0-6]\d))([-]?|\s{1})(?!00)\d\d\2(?!0000)\d{4}\b"
      }
    ]
    ```
:::



### マルチライン ロギング

すべてのロギングのベストプラクティスは、個別のログイベントごとに 1 行を出力する[構造化ロギング](../../signals/logs/#structured-logging-is-key-to-success)を使用することです。
しかし、この選択肢がない多くのレガシーアプリケーションや ISV サポートのアプリケーションが存在します。
これらのワークロードでは、マルチライン対応のプロトコルを使用して出力しない限り、CloudWatch Logs は各行を個別のイベントとして解釈します。
CloudWatch エージェントは [`multi_line_start_pattern`](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-Configuration-File-Details.html) ディレクティブを使用してこれを実行できます。

:::info
	`multi_line_start_pattern` ディレクティブを使用して、マルチライン ロギングを CloudWatch Logs に取り込む負担を軽減します。
:::



### ロギングクラスの設定

CloudWatch Logs は、ロググループに対して 2 つの[クラス](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/CloudWatch_Logs_Log_Classes.html)を提供しています：

- CloudWatch Logs Standard ログクラスは、リアルタイムモニタリングが必要なログや頻繁にアクセスするログに適した、フル機能のオプションです。

- CloudWatch Logs Infrequent Access ログクラスは、ログを費用対効果の高い方法で統合するために使用できる新しいログクラスです。このログクラスは、管理された取り込み、ストレージ、クロスアカウントログ分析、暗号化などの CloudWatch Logs の機能のサブセットを、GB あたりのより低い取り込み価格で提供します。Infrequent Access ログクラスは、アドホックなクエリやアクセス頻度の低いログに対する事後的なフォレンジック分析に最適です。

:::info
新しいロググループに使用するロググループクラスを指定するには、`log_group_class` ディレクティブを使用します。有効な値は **STANDARD** と **INFREQUENT_ACCESS** です。このフィールドを省略した場合、エージェントはデフォルトの **STANDARD** を使用します。
:::



## CloudWatch Logs での検索




### クエリスコープによるコスト管理

CloudWatch Logs にデータが配信されると、必要に応じてそのデータを検索できるようになります。ただし、CloudWatch Logs はスキャンされたデータ量に応じて課金されることに注意してください。クエリスコープを管理するための戦略があり、これによりスキャンされるデータ量を削減できます。

:::info
	ログを検索する際は、適切な時間と日付の範囲を設定してください。CloudWatch Logs では、スキャンの相対的または絶対的な時間範囲を設定できます。*前日のエントリのみを探している場合、今日のログのスキャンを含める必要はありません！*
:::

:::info
	1 つのクエリで複数のロググループを検索できますが、そうすることでスキャンされるデータ量が増加します。対象とするロググループを特定したら、それに合わせてクエリスコープを絞り込んでください。
:::

:::tip
	各クエリが実際にスキャンするデータ量は、CloudWatch コンソールから直接確認できます。このアプローチは、効率的なクエリを作成するのに役立ちます。

	![CloudWatch Logs コンソールのプレビュー](../../images/cwl1.png)
:::



### 成功したクエリを他のユーザーと共有する

[CloudWatch Logs のクエリ構文](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html) は複雑ではありませんが、特定のクエリをゼロから作成するのは時間がかかる場合があります。同じ AWS アカウント内の他のユーザーと適切に作成されたクエリを共有することで、アプリケーションログの調査を効率化できます。これは [AWS マネジメントコンソール](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/CWL_Insights-Saving-Queries.html) から直接、または [CloudFormation](https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/aws-resource-logs-querydefinition.html) や [AWS CDK](https://docs.aws.amazon.com/ja_jp/cdk/api/v2/docs/aws-cdk-lib.aws_logs.CfnQueryDefinition.html) を使用してプログラム的に実現できます。これにより、ログデータを分析する必要がある他のユーザーの再作業量を減らすことができます。

:::info
	頻繁に繰り返されるクエリを CloudWatch Logs に保存して、ユーザーのために事前に入力できるようにします。

	![CloudWatch Logs クエリエディターページ](../../images/cwl2.png)
:::



### パターン分析

CloudWatch Logs Insights は、ログをクエリする際に機械学習アルゴリズムを使用してパターンを見つけます。パターンとは、ログフィールド間で繰り返し発生する共通のテキスト構造です。パターンは、多数のログイベントを少数のパターンに圧縮できることが多いため、大規模なログセットを分析する際に役立ちます。[^2]

:::info
	pattern を使用して、ログデータを自動的にパターンにクラスタリングします。

	![CloudWatch Logs クエリパターンの例](../../images/pattern_analysis.png)
:::



### 前の時間範囲との比較 (diff)

CloudWatch Logs Insights では、時間の経過に伴うログイベントの変化を比較することができ、エラーの検出やトレンドの特定に役立ちます。比較クエリはパターンを明らかにし、迅速なトレンド分析を可能にします。また、より深い調査のために生のログイベントのサンプルを調べることもできます。クエリは、選択された期間と同じ長さの比較期間の 2 つの時間帯に対して分析されます。[^3]

:::info
	`diff` コマンドを使用して、時間の経過に伴うログイベントの変化を比較します。

	![CloudWatch Logs クエリの差分の例](../../images/diff-query.png)
:::

[^1]: CloudWatch Logs のロググループの暗号化とアクセス権限の実践的な例については、[AWS Systems Manager Session Manager コンソールログの検索方法 - パート 1](https://aws.amazon.com/jp/blogs/news/how-to-search-through-your-aws-systems-manager-session-manager-console-logs-part-1/) を参照してください。

[^2]: より詳細な洞察については、[CloudWatch Logs Insights パターン分析](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/CWL_AnalyzeLogData_Patterns.html) を参照してください。

[^3]: 詳細については、[CloudWatch Logs Insights 前の範囲との比較 (diff)](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/CWL_AnalyzeLogData_Compare.html) を参照してください。
