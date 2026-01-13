# ログ記録

ログツールの選択は、データ送信、フィルタリング、保持、キャプチャ、およびデータを生成するアプリケーションとの統合に関する要件に関連しています。Amazon Web Services をオブザーバビリティに使用する場合 (オンプレミスまたは他のクラウド環境でホストしているかどうかに関係なく)、[CloudWatch エージェント](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html) または [Fluentd](https://www.fluentd.org/) などの他のツールを活用して、分析用のログデータを送信できます。

ここでは、ログ記録のための CloudWatch エージェントを実装するためのベストプラクティス、および AWS コンソールまたは API 内での CloudWatch Logs の使用について詳しく説明します。

:::info
	CloudWatch エージェントは、[メトリクスデータ](../../signals/metrics/)を CloudWatch に配信するためにも使用できます。実装の詳細については、[メトリクス](../../tools/metrics/)ページを参照してください。また、OpenTelemetry または X-Ray クライアント SDK から[トレース](../../signals/traces.md)を収集し、[AWS X-Ray](../../tools/xray.md) に送信するためにも使用できます。
:::
## CloudWatch エージェントを使用したログの収集

### 転送

オブザーバビリティに対して[クラウドファーストアプローチ](../../faq#「クラウドファースト」アプローチとは)を採用する場合、原則として、ログを取得するためにマシンにログインする必要がある場合は、アンチパターンとなります。ワークロードは、ログデータをほぼリアルタイムでログ分析システムに送信する必要があり、その送信と元のイベントとの間の遅延は、ワークロードに災害が発生した場合にポイントインタイム情報が失われる可能性を表します。

アーキテクトとして、ログデータの許容可能な損失を判断し、CloudWatch エージェントの[`force_flush_interval`](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-Configuration-File-Details.html#CloudWatch-Agent-Configuration-File-Logssection) に対応します。

 `force_flush_interval` エージェントに対して、バッファサイズに達しない限り、定期的なタイミングでデータプレーンにログデータを送信するよう指示します。バッファサイズに達した場合は、バッファされたすべてのログを即座に送信します。

:::tip
	エッジデバイスは、低レイテンシーの AWS 内ワークロードとは大きく異なる要件を持つ場合があり、はるかに長い `force_flush_interval` 設定。たとえば、低帯域幅のインターネット接続を使用する IoT デバイスでは、15 分ごとにログをフラッシュするだけで済む場合があります。
:::
:::info
	コンテナ化されたワークロードやステートレスなワークロードは、ログフラッシュ要件に特に敏感な場合があります。いつでもスケールインされる可能性のあるステートレスな Kubernetes アプリケーションや EC2 フリートを考えてみてください。これらのリソースが突然終了すると、ログが失われる可能性があり、将来それらからログを抽出する方法がなくなります。標準的な `force_flush_interval` これらのシナリオには通常適切ですが、必要に応じて下げることができます。
:::
### ロググループ

CloudWatch Logs 内では、アプリケーションに論理的に適用される各ログのコレクションを、単一の[ログ グループ](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatchLogsConcepts.html)に配信する必要があります。そのログ グループ内では、ログ ストリームを作成するソース システム間で*共通性*を持たせる必要があります。

LAMP スタックを考えてみましょう。Apache、MySQL、PHP アプリケーション、およびホスティング Linux オペレーティングシステムからのログは、それぞれ別々のロググループに属します。

このグループ化は、同じ保持期間、暗号化キー、メトリクスフィルター、サブスクリプションフィルター、Contributor Insights ルールを持つグループを扱うことができるため、非常に重要です。

:::info
	ログストリームの数に制限はなく、単一の CloudWatch Logs Insights クエリでアプリケーションのすべてのログを検索できます。Kubernetes サービスの各ポッドや、フリート内のすべての EC2 インスタンスに対して個別のログストリームを持つことは、標準的なパターンです。
:::
:::info
	ロググループのデフォルトの保持期間は*無期限*です。ベストプラクティスは、ロググループの作成時に保持期間を設定することです。

CloudWatch コンソールでいつでも設定できますが、ベストプラクティスは、Infrastructure as Code (CloudFormation、Cloud Development Kit など) を使用してロググループの作成と同時に設定するか、または `retention_in_days` CloudWatch エージェント設定内の設定。

どちらのアプローチでも、ログ保持期間を事前に設定し、プロジェクトのデータ保持要件に合わせることができます。
:::

:::info
	ログループデータは、CloudWatch Logs で常に暗号化されます。デフォルトでは、CloudWatch Logs は `server-side` 保管中のログデータの暗号化。代替として、この暗号化に AWS Key Management Service を使用できます。[AWS KMS を使用した暗号化](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/encrypt-log-data-kms.html)は、ロググループの作成時または作成後に、KMS キーをロググループに関連付けることで、ロググループレベルで有効化されます。これは、Infrastructure as Code (CloudFormation、Cloud Development Kit など) を使用して設定できます。

CloudWatch Logs のキーを管理するために AWS Key Management Service を使用するには、追加の設定とユーザーへのキーに対する権限の付与が必要です。[^1]
:::
### ログのフォーマット

CloudWatch Logs には、ログフィールドを自動的に検出し、取り込み時に JSON データをインデックス化する機能があります。この機能により、アドホッククエリとフィルタリングが容易になり、ログデータの使いやすさが向上します。ただし、自動インデックス化は構造化データにのみ適用されることに注意してください。非構造化ログデータは自動的にインデックス化されませんが、CloudWatch Logs に配信することは可能です。

非構造化ログは、正規表現を使用して検索またはクエリを実行できます。 `parse` コマンド。

:::info
	CloudWatch Logs を使用する際のログ形式に関する 2 つのベストプラクティスは次のとおりです。

1. [Log4j](https://logging.apache.org/log4j/2.x/) などの構造化ログフォーマッターを使用します。[`python-json-logger`](https://pypi.org/project/python-json-logger/)、またはフレームワークのネイティブ JSON エミッターを使用します。
	2. ログの送信先に、イベントごとに 1 行のログを送信します。

JSON ログの複数行を送信する場合、各行は単一のイベントとして解釈されることに注意してください。
:::
### `stdout` の処理

[ログシグナル](../../signals/logs/#stdout-にログを記録する)のページで説明したように、ベストプラクティスは、ログシステムをそれを生成するアプリケーションから分離することです。ただし、データを送信するには `stdout` ファイルへの書き込みは、多くの (ほとんどではないにしても) プラットフォームで一般的なパターンです。Kubernetes や [Amazon Elastic Container Service](https://aws.amazon.com/ecs/) などのコンテナオーケストレーションシステムは、この配信を管理します `stdout` ログファイルに自動的に出力され、コレクターから各ログを収集できるようになります。CloudWatch エージェントはこのファイルをリアルタイムで読み取り、ユーザーに代わってデータをロググループに転送します。

:::info
	簡素化されたアプリケーションログのパターンを使用して `stdout`可能な限り、エージェントによる収集を使用してください。
:::
### ログのフィルタリング

ログをフィルタリングする理由は多数あります。個人データの永続的な保存を防ぐ、または特定のログレベルのデータのみをキャプチャするなどです。いずれの場合も、ベストプラクティスは、このフィルタリングを発信元システムにできるだけ近い場所で実行することです。CloudWatch の場合、これは CloudWatch Logs に分析用のデータが配信される*前*を意味します。CloudWatch エージェントは、このフィルタリングを実行できます。

:::info
	[`filters`](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-Configuration-File-Details.html#CloudWatch-Agent-Configuration-File-Logssection) 機能を使用して `include` 必要なログレベルと `exclude` 望ましくないことが知られているパターン (クレジットカード番号、電話番号など)
:::
:::tip
	ログに漏洩する可能性のある特定の形式の既知データをフィルタリングすることは、時間がかかり、エラーが発生しやすい作業です。ただし、特定の種類の既知の望ましくないデータ (クレジットカード番号、社会保障番号など) を処理するワークロードの場合、これらのレコードに対するフィルタを設定することで、将来的に損害を与える可能性のあるコンプライアンス問題を防ぐことができます。たとえば、社会保障番号を含むすべてのレコードを削除することは、次のような設定で簡単に実現できます。

	```
	"filters": [
      {
        "type": "exclude",
        "expression": "\b(?!000|666|9\d{2})([0-8]\d{2}|7([0-6]\d))([-]?|\s{1})(?!00)\d\d\2(?!0000)\d{4}\b"
      }
    ]
    ```
:::

### 複数行ログ

すべてのロギングのベストプラクティスは、個別のログイベントごとに 1 行を出力する[構造化ログ](../../signals/logs/#構造化ログが成功の鍵)を使用することです。ただし、このオプションがない多くのレガシーアプリケーションや ISV サポートのアプリケーションがあります。これらのワークロードでは、CloudWatch Logs は、複数行対応プロトコルを使用して出力されない限り、各行を一意のイベントとして解釈します。CloudWatch エージェントは、[`multi_line_start_pattern`](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-Configuration-File-Details.html#CloudWatch-Agent-Configuration-File-Logssection) ディレクティブを使用します。

:::info
	を使用します。 `multi_line_start_pattern` directive を使用して、複数行のログを CloudWatch Logs に取り込む負担を軽減します。
:::
### ロギングクラスの設定

CloudWatch Logs は、2 つの[クラス](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch_Logs_Log_Classes.html)のロググループを提供しています。

- CloudWatch Logs Standard ログクラスは、リアルタイムモニタリングが必要なログや頻繁にアクセスするログに対応する、フル機能のオプションです。

- CloudWatch Logs Infrequent Access ログクラスは、ログをコスト効率よく統合するために使用できる新しいログクラスです。このログクラスは、マネージド型の取り込み、ストレージ、クロスアカウントログ分析、暗号化を含む CloudWatch Logs 機能のサブセットを、GB あたりの取り込み価格を抑えて提供します。Infrequent Access ログクラスは、アドホッククエリや、アクセス頻度の低いログに対する事後のフォレンジック分析に最適です。

:::info
	を使用します。 `log_group_class` ディレクティブを使用して、新しいロググループに使用するログループクラスを指定します。有効な値は **STANDARD** と **INFREQUENT_ACCESS** です。このフィールドを省略すると、エージェントによってデフォルトの **STANDARD** が使用されます。
:::

#### 適切なクラス指定のための既存ログの監査

CloudWatch logs Infrequent Access 層のログクラスは、CloudWatch ロギング機能のサブセットを利用します。既存のログ群を監査して、標準ログ群を Infrequent Access ログ群として再作成できるかどうかを確認することをお勧めします。これを行う良い方法は、[log-ia-checker](https://github.com/aws-observability/log-ia-checker) CLI ツールを実行することです。このツールは、指定されたリージョン内のすべてのログ群を分析し、Infrequent Access に移行できるログの出力を提供します。

## CloudWatch Logs での検索

### クエリスコープによるコスト管理

CloudWatch Logs にデータが配信されると、必要に応じて検索できるようになります。CloudWatch Logs はスキャンされたデータのギガバイトあたりで課金されることに注意してください。クエリのスコープを制御するための戦略があり、これによりスキャンされるデータを削減できます。

:::info
	ログを検索する際は、時刻と日付の範囲が適切であることを確認してください。CloudWatch Logs では、スキャンに相対的または絶対的な時間範囲を設定できます。*前日のエントリのみを検索する場合は、今日のログをスキャンする必要はありません。*
:::

:::info
	単一のクエリで複数のロググループを検索できますが、そうするとスキャンされるデータが増加します。ターゲットとする必要があるロググループを特定したら、それに合わせてクエリのスコープを縮小してください。
:::

:::tip
	各クエリが実際にスキャンするデータ量は、CloudWatch コンソールから直接確認できます。このアプローチは、効率的なクエリの作成に役立ちます。

	![Preview of the CloudWatch Logs console](../../images/cwl1.png)
:::

### 成功したクエリを他のユーザーと共有する

[CloudWatch Logs クエリ構文](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html)は複雑ではありませんが、特定のクエリをゼロから作成するのは時間がかかる場合があります。適切に記述されたクエリを同じ AWS アカウント内の他のユーザーと共有することで、アプリケーションログの調査を効率化できます。これは、[AWS Management Console](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_Insights-Saving-Queries.html) から直接、または [CloudFormation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-querydefinition.html) や [AWS CDK](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_logs.CfnQueryDefinition.html) を使用してプログラムで実現できます。これにより、ログデータを分析する必要がある他のユーザーに必要な再作業の量が削減されます。

:::info
	頻繁に繰り返されるクエリを CloudWatch Logs に保存して、ユーザー用に事前入力できるようにします。

	![The CloudWatch Logs query editor page](../../images/cwl2.png)
:::

### パターン分析

CloudWatch Logs Insights は、ログをクエリする際に機械学習アルゴリズムを使用してパターンを検出します。パターンとは、ログフィールド間で繰り返し現れる共有テキスト構造です。パターンは、大量のログイベントを少数のパターンに圧縮できることが多いため、大規模なログセットの分析に役立ちます。[^2]

:::info
	パターンを使用して、ログデータを自動的にパターンにクラスター化します。

	![The CloudWatch Logs query pattern example](../../images/pattern_analysis.png)
:::

### 以前の時間範囲との比較 (差分)

CloudWatch Logs Insights は、ログイベントの変化を時系列で比較できるため、エラーの検出とトレンドの特定に役立ちます。比較クエリはパターンを明らかにし、迅速なトレンド分析を容易にします。また、より深い調査のためにサンプルの生ログイベントを調べることもできます。クエリは、選択した期間と同じ長さの比較期間という 2 つの期間に対して分析されます。[^3]

:::info
	ログイベントの変化を時系列で比較するには、次を使用します。 `diff` コマンド。

	![The CloudWatch Logs query difference example](../../images/diff-query.png)
:::

[^1]: See [How to search through your AWS Systems Manager Session Manager console logs – Part 1](https://aws.amazon.com/blogs/mt/how-to-search-through-your-aws-systems-manager-session-manager-console-logs-part-1/) for a practical example of CloudWatch Logs log group encryption with access privileges.

[^2]: See [CloudWatch Logs Insights Pattern Analysis](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_AnalyzeLogData_Patterns.html) for more detailed insights.

[^3]: See [CloudWatch Logs Insigts Compare(diff) with previous ranges](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_AnalyzeLogData_Compare.html) for more information.
