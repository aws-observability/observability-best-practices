# サーバーレス Observability の AWS Lambda ベース

分散システムとサーバーレスコンピューティングの世界では、Observability を実現することがアプリケーションの信頼性とパフォーマンスを確保する鍵となります。これは従来のモニタリングよりも広範囲です。Amazon CloudWatch や AWS X-Ray などの AWS Observability ツールを活用することで、サーバーレスアプリケーションの洞察を得て、問題のトラブルシューティングを行い、アプリケーションのパフォーマンスを最適化できます。このガイドでは、Lambda ベースのサーバーレスアプリケーションの Observability を実装するための重要な概念、ツール、およびベストプラクティスを学びます。

インフラストラクチャまたはアプリケーションの Observability を実装する前の最初のステップは、主要な目的を決定することです。これは、ユーザーエクスペリエンスの向上、開発者生産性の向上、サービスレベル目標 (SLO) の達成、ビジネス収益の増加、またはアプリケーションの種類に応じた他の特定の目的となる可能性があります。そのため、これらの主要な目的を明確に定義し、それらをどのように測定するかを確立してください。その後、そこから逆算して Observability 戦略を設計します。詳細については、「[Monitor what matters](https://aws-observability.github.io/observability-best-practices/guides/#monitor-what-matters)」を参照してください。

## オブザーバビリティの3本柱

オブザーバビリティには3つの主要な柱があります。

* ログ: アプリケーションやシステム内で発生した個別のイベント (障害、エラー、状態変化など) の時刻付きの記録
* メトリクス: さまざまな時間間隔で測定された数値データ (時系列データ)。SLI (リクエストレート、エラーレート、期間、CPU 使用率など)
* トレース: 1人のユーザーが複数のアプリケーションやシステム (通常はマイクロサービス) を横断する経路を表す

AWS では、ログ、メトリクスの監視、トレーシングを容易にするためのネイティブとオープンソースのツールの両方を提供しており、AWS Lambda アプリケーションに関する実行可能な洞察を得ることができます。

## **ログ**

オブザーバビリティのベストプラクティスガイドのこのセクションでは、以下のトピックについて詳しく説明します。

* 非構造化ログと構造化ログ
* CloudWatch Logs Insights
* ログ相関 ID
* Lambda Powertools を使用したコードサンプル
* CloudWatch ダッシュボードを使用したログの可視化
* CloudWatch Logs の保持期間

ログは、アプリケーション内で発生した個別のイベントです。これには、障害、エラー、実行パス、その他のイベントが含まれます。ログは、非構造化、半構造化、または構造化形式で記録できます。

### **構造化ログと非構造化ログ**

開発者は、アプリケーション内で `print` や `console.log` ステートメントを使用して、シンプルなログメッセージから始めることが多くあります。これらは、大規模に自動的に解析するのが難しく、特に多くのログメッセージを異なるロググループに生成できる AWS Lambda ベースのアプリケーションでは、CloudWatch にこれらのログを統合するのが困難で、分析が難しくなります。ログ内の関連情報を見つけるには、テキストマッチや正規表現を使う必要があります。非構造化ログの例は次のようになります。

```
[2023-07-19T19:59:07Z]  INFO  Request started
[2023-07-19T19:59:07Z]  INFO  AccessDenied: Could not access resource
[2023-07-19T19:59:08Z]  INFO  Request finished
```

ご覧のとおり、ログメッセージに一貫した構造がないため、有用な洞察を得るのが難しくなっています。また、コンテキスト情報を追加するのも難しくなります。

一方、構造化ログは、ログ情報を JSON などの一貫したフォーマットでログに記録する方法で、ログをテキストではなくデータとして扱えるようにします。これにより、クエリやフィルタリングが簡単になります。開発者は、ログを自動的に効率的に保存、取得、分析できるようになります。また、デバッグも容易になります。構造化ログは、ログレベルを使ってさまざまな環境でログの詳細レベルを簡単に変更できます。**ログレベルに注意を払ってください。** 多すぎるログを記録すると、コストが増加しアプリケーションのスループットが低下します。個人を特定できる情報はログに記録する前に編集する必要があります。構造化ログの例は次のようになります。

```
{
   "correlationId": "9ac54d82-75e0-4f0d-ae3c-e84ca400b3bd",
   "requestId": "58d9c96e-ae9f-43db-a353-c48e7a70bfa8",
   "level": "INFO",
   "message": "AccessDenied",
   "function-name": "demo-observability-function",
   "cold-start": true
}
```

**`CloudWatch ログに構造化され集中管理されたログを出力することを推奨します`**。これにより、トランザクションの運用情報、さまざまなコンポーネント間の相関 ID、アプリケーションのビジネス結果を出力できます。

### **CloudWatch Logs Insights**
JSON 形式のログでフィールドを自動的に検出できる CloudWatch Logs Insights を使用します。さらに、JSON ログを拡張して、アプリケーション固有のカスタムメタデータをログに記録し、ログの検索、フィルタリング、集計に使用できます。

### **ロギングの相関 ID**

例えば、API Gateway から受信した HTTP リクエストの場合、相関 ID は `requestContext.requestId` パスに設定されます。これは Lambda powertools を使って、ダウンストリームの Lambda 関数から簡単に抽出してログに記録できます。分散システムでは、多くの場合、リクエストを処理するために複数のサービスとコンポーネントが連携して動作します。そのため、相関 ID をログに記録し、ダウンストリームのシステムに渡すことが、エンドツーエンドのトレースとデバッグにとって重要になります。相関 ID は、リクエストの最初に割り当てられる一意の識別子です。リクエストが異なるサービスを経由する際、相関 ID がログに含まれるため、リクエストの全経路をトレースできます。AWS Lambda のログに手動で相関 ID を挿入するか、[AWS Lambda powertools](https://docs.powertools.aws.dev/lambda/python/latest/core/logger/#setting-a-correlation-id) のようなツールを使って、API Gateway から相関 ID を簡単に取得し、アプリケーションログとともにログに記録できます。例えば、HTTP リクエストの相関 ID は、API Gateway で開始され、その後 Lambda 関数などのバックエンドサービスに渡される request-id になります。

### **Lambda Powertools を使用したコードサンプル**

ベストプラクティスとして、リクエストライフサイクルの可能な限り早い段階で相関 ID を生成することをおすすめします。API Gateway やアプリケーションロードバランサーなど、サーバーレスアプリケーションのエントリポイントで生成するのが望ましいです。UUID、リクエスト ID、分散システム全体でリクエストを追跡できる他の一意の属性を使用してください。カスタムヘッダー、ボディ、メタデータの一部として相関 ID を各リクエストに渡してください。ダウンストリームサービスのすべてのログエントリとトレースに相関 ID が含まれるようにしてください。

Lambda 関数のログに手動で相関 ID をキャプチャして含めるか、[AWS Lambda Powertools](https://docs.powertools.aws.dev/lambda/python/latest/core/logger/#setting-a-correlation-id) のようなツールを使用できます。Lambda Powertools を使えば、サポートされているアップストリームサービスの事前定義された [パスマッピング](https://github.com/aws-powertools/powertools-lambda-python/blob/08a0a7b68d2844d36c33ab8156640f4ea9632d0c/aws_lambda_powertools/logging/correlation_paths.py) から相関 ID を簡単に取得し、アプリケーションログに自動的に追加できます。また、エラーメッセージすべてに相関 ID を追加して、障害発生時にルートの原因を簡単にデバッグ・特定し、元のリクエストにつなげられるようにしてください。

以下のサーバーレスアーキテクチャで、相関 ID を含む構造化ログを作成し、CloudWatch で表示する方法をコードサンプルで示します。

![アーキテクチャ](../../../images/Serverless/aws-native/apigw_lambda.png)

```
// Initializing Logger
Logger log = LogManager.getLogger();

// Uses @Logger annotation from Lambda Powertools, which takes optional parameter correlationIdPath to extract correlation Id from the API Gateway header and inserts correlation_id to the Lambda function logs in a structured format.
@Logging(correlationIdPath = "/headers/path-to-correlation-id")
public APIGatewayProxyResponseEvent handleRequest(final APIGatewayProxyRequestEvent input, final Context context) {
  ...
  // The log statement below will also have additional correlation_id
  log.info("Success")
  ...
}
```

この例では、Java ベースの Lambda 関数が Lambda Powertools ライブラリを使用して、API Gateway リクエストから受け取った `correlation_id` をログに記録しています。

コードサンプルの CloudWatch ログサンプル:

```
{
   "level": "INFO",
   "message": "Success",
   "function-name": "demo-observability-function",
   "cold-start": true,
   "lambda_request_id": "52fdfc07-2182-154f-163f-5f0f9a621d72",
   "correlation_id": "<correlation_id_value>"
}_
```
</correlation_id_value>

### **CloudWatch ダッシュボードを使用したログの可視化**

構造化された JSON 形式でデータをログに記録すると、[CloudWatch Logs Insights](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/AnalyzingLogData.html) が自動的に JSON 出力内の値を検出し、メッセージをフィールドとして解析します。CloudWatch Logs Insights は、複数のログストリームを検索およびフィルタリングするための、目的に特化した [SQL に似たクエリ言語](https://serverlessland.com/snippets?type=CloudWatch+Logs+Insights) を提供します。glob 式や正規表現のパターンマッチングを使用して、複数のロググループに対してクエリを実行できます。さらに、カスタムクエリを作成し、再実行する際に毎回作り直す必要がないよう保存することもできます。

![CloudWatch Dashboard](../../../images/Serverless/aws-native/cw_dashboard.png)
CloudWatch Logs Insights では、1 つ以上の集約関数を使用してクエリから折れ線グラフ、棒グラフ、積み上げ面グラフなどの可視化を生成できます。これらの可視化を簡単に CloudWatch ダッシュボードに追加できます。以下のサンプルダッシュボードは、Lambda 関数の実行時間のパーセンタイルレポートを示しています。このようなダッシュボードにより、アプリケーションのパフォーマンス改善に注力すべき箇所が一目でわかります。平均レイテンシーは確認すべきメトリクスですが、**`平均レイテンシーではなく p99 を最適化することを目指すべきです。`**

![CloudWatch Dashboard](../../../images/Serverless/aws-native/cw_percentile.png)
(プラットフォーム、関数、拡張機能の) ログを CloudWatch 以外の場所に送信するには、Lambda 拡張機能と [Lambda Telemetry API](https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/telemetry-api.html) を使用できます。多くの [パートナーソリューション](https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/extensions-api-partners.html) が、Lambda Telemetry API を使用し、それらのシステムとの統合を容易にする Lambda レイヤーを提供しています。

CloudWatch Logs Insights を最大限に活用するには、構造化ログ記録の形式でログにどのようなデータを取り込む必要があるかを検討し、それによってアプリケーションの正常性を適切にモニタリングできるようにすることが重要です。

### **CloudWatch Logs の保持期間**

デフォルトでは、Lambda 関数の stdout に書き込まれたすべてのメッセージが Amazon CloudWatch のログストリームに保存されます。Lambda 関数の実行ロールには、CloudWatch ログストリームを作成し、ストリームにログイベントを書き込む権限が必要です。CloudWatch は、データの取り込み量と使用されたストレージに応じて課金されることに注意が必要です。そのため、ログ出力を減らすことで、関連コストを最小限に抑えることができます。**`デフォルトでは CloudWatch ログは無期限に保持され、期限切れになることはありません。ログストレージコストを削減するために、ログ保持ポリシーを設定することをお勧めします`**。そして、すべてのロググループに対してポリシーを適用する必要があります。環境ごとに異なる保持ポリシーを設定したい場合があります。ログの保持期間は AWS コンソールで手動で設定できますが、一貫性とベストプラクティスを確保するために、Infrastructure as Code (IaC) のデプロイの一部として設定する必要があります。以下は、Lambda 関数のログ保持期間の設定方法を示す CloudFormation テンプレートのサンプルです。

```
Resources:
  Function:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: .
      Runtime: python3.8
      Handler: main.handler
      Tracing: Active

  # Explicit log group that refers to the Lambda function
  LogGroup:
    Type: AWS::Logs::LogGroup
    Properties:
      LogGroupName: !Sub "/aws/lambda/${Function}"
      # Explicit retention time
      RetentionInDays: 7
```

この例では、Lambda 関数と対応するロググループを作成しています。**`RetentionInDays`** プロパティは **7 日間** に設定されているため、このロググループのログは自動的に削除される前に 7 日間保持され、ログストレージコストを管理できます。

## **メトリクス**

オブザーバビリティのベストプラクティスガイドのこのセクションでは、以下のトピックについて詳しく説明します。

* 既存のメトリクスを監視し、アラートを設定する
* カスタムメトリクスを公開する
* 埋め込みメトリクスを使用して、ログからメトリクスを自動生成する
* CloudWatch Lambda Insights を使用してシステムレベルのメトリクスを監視する
* CloudWatch アラームを作成する

### **標準のメトリクスを監視してアラートを設定する**

メトリクスとは、さまざまな時間間隔で測定される数値データ (時系列データ) およびサービスレベル指標 (リクエストレート、エラーレート、期間、CPU など) のことです。AWS サービスには、アプリケーションの運用状況を監視するための多数の標準メトリクスが用意されています。アプリケーションに適用可能な主要なメトリクスを特定し、それらを使ってアプリケーションのパフォーマンスを監視してください。主要なメトリクスの例としては、関数エラー、キュー長、ステートマシン実行の失敗、API レスポンス時間などがあります。

標準のメトリクスを使う上での課題は、CloudWatch ダッシュボードでそれらをどのように分析するかを知ることです。たとえば、同時実行数を見る場合、最大値、平均値、パーセンタイルのどれを見ればよいのでしょうか。監視すべき適切な統計情報は、メトリクスごとに異なります。

ベストプラクティスとしては、Lambda 関数の `ConcurrentExecutions` メトリクスについては、`Count` 統計を見て、アカウントおよびリージョンの制限に近づいているか、または該当する場合は Lambda の予約済み同時実行数の制限に近づいているかを確認します。
`Duration` メトリクス (イベントの処理にかかる時間を示す) については、`Average` または `Max` 統計を見ます。API のレイテンシを測定する場合は、API Gateway の `Latency` メトリクスの `Percentile` 統計を見ます。P50、P90、P99 は、平均値よりもレイテンシを監視する上で優れた方法です。

監視すべきメトリクスがわかったら、アプリケーションのコンポーネントが健全でない場合に通知を受けられるよう、これらの主要なメトリクスにアラートを設定します。例:

* AWS Lambda の場合、Duration、Errors、Throttling、ConcurrentExecutions にアラートを設定します。ストリームベースの呼び出しの場合は IteratorAge にアラートを設定します。非同期呼び出しの場合は DeadLetterErrors にアラートを設定します。
* Amazon API Gateway の場合、IntegrationLatency、Latency、5XXError、4XXError にアラートを設定します。
* Amazon SQS の場合、ApproximateAgeOfOldestMessage、ApproximateNumberOfMessageVisible にアラートを設定します。
* AWS Step Functions の場合、ExecutionThrottled、ExecutionsFailed、ExecutionsTimedOut にアラートを設定します。

### **カスタムメトリクスの公開**

アプリケーションの目的のビジネスと顧客の成果に基づいて、主要なパフォーマンス指標 (KPI) を特定します。KPI を評価して、アプリケーションの成功と運用上の健全性を判断します。主要なメトリクスはアプリケーションの種類によって異なりますが、例としては訪問サイト、注文数、購入した航空券、ページロード時間、ユニークビジター数などがあります。

AWS CloudWatch にカスタムメトリクスを公開する1つの方法は、CloudWatch メトリクス SDK の `putMetricData` API を呼び出すことです。しかし、`putMetricData` API 呼び出しは同期的です。Lambda 関数の実行時間が長くなり、アプリケーション内の他の API 呼び出しをブロックする可能性があり、パフォーマンスのボトルネックにつながります。また、Lambda 関数の実行時間が長くなると、コストが高くなります。さらに、CloudWatch に送信されるカスタムメトリクスの数と、行われる API 呼び出し数 (つまり PutMetricData API 呼び出し) の両方に対して課金されます。

**`カスタムメトリクスを公開するより効率的で費用対効果の高い方法は、`** [CloudWatch Embedded Metrics Format](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html) (EMF) を使うことです。CloudWatch Embedded Metric 形式を使うと、CloudWatch ログに書き込まれたログとして **`非同期的に`** カスタムメトリクスを生成できるため、アプリケーションのパフォーマンスが向上し、コストが下がります。EMF を使えば、詳細なログイベントデータとともにカスタムメトリクスを埋め込むことができ、CloudWatch がこれらのカスタムメトリクスを自動的に抽出するので、組み込みのメトリクスと同様に可視化やアラームの設定ができます。埋め込みメトリクス形式でログを送信すると、[CloudWatch Logs Insights](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/AnalyzingLogData.html) を使ってクエリできますが、メトリクスのコストではなく、クエリのコストのみが課金されます。

これを実現するには、[EMF 仕様](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Specification.html)に従ってログを生成し、`PutLogEvents` API を使って CloudWatch に送信します。プロセスを簡素化するために、**EMF 形式のメトリクス作成をサポートするクライアントライブラリが2つあります**。

* 低レベルのクライアントライブラリ ([aws-embedded-metrics](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Libraries.html))
* Lambda Powertools [Metrics](https://docs.powertools.aws.dev/lambda/java/core/metrics/)

### **[CloudWatch Lambda Insights](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/Lambda-Insights.html) を使用してシステムレベルのメトリクスを監視する**

CloudWatch Lambda Insights は、CPU 時間、メモリ使用量、ディスク使用率、ネットワークパフォーマンスなど、システムレベルのメトリクスを提供します。
Lambda Insights は、**`コールドスタート`** や Lambda ワーカーのシャットダウンなどの診断情報も収集、集約、要約します。
Lambda Insights は、Lambda レイヤーとしてパッケージ化された CloudWatch Lambda 拡張機能を利用しています。
有効にすると、システムレベルのメトリクスを収集し、その Lambda 関数の呼び出しごとに埋め込みメトリクス形式で 1 つのパフォーマンスログイベントを CloudWatch Logs に送信します。

note
    CloudWatch Lambda Insights はデフォルトで有効になっていないため、Lambda 関数ごとに有効にする必要があります。


AWS コンソールまたは Infrastructure as Code (IaC) で有効にできます。
AWS Serverless Application Model (SAM) を使用して有効にする例を次に示します。
Lambda 関数に `LambdaInsightsExtension` 拡張レイヤーを追加し、さらに管理ポリシー `CloudWatchLambdaInsightsExecutionRolePolicy` を追加します。
これにより、Lambda 関数がログストリームを作成し、`PutLogEvents` API を呼び出してログを書き込む権限が付与されます。

```
// Add LambdaInsightsExtension Layer to your function resource
Resources:
  MyFunction:
    Type: AWS::Serverless::Function
    Properties:
      Layers:
        - !Sub "arn:aws:lambda:${AWS::Region}:580247275435:layer:LambdaInsightsExtension:14"
        
// Add IAM policy to enable Lambda function to write logs to CloudWatch
Resources:
  MyFunction:
    Type: AWS::Serverless::Function
    Properties:
      Policies:
        - `CloudWatchLambdaInsightsExecutionRolePolicy`
```

CloudWatch コンソールで、Lambda Insights 以下にこれらのシステムレベルのパフォーマンスメトリクスを表示できます。

![Lambda Insights](../../../images/Serverless/aws-native/lambda_insights.png)

### **CloudWatch アラームの作成**
メトリクスが閾値を超えた場合に必要なアクションを実行する CloudWatch アラームを作成することは、オブザーバビリティにおいて重要な部分です。Amazon [CloudWatch アラーム](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html) は、アプリケーションやインフラストラクチャのメトリクスが静的または動的に設定された閾値を超えた場合に、アラートを送信したり、修復アクションを自動化するために使用されます。

メトリクスにアラームを設定するには、一連のアクションをトリガーする閾値を選択します。固定された閾値は静的閾値と呼ばれます。たとえば、5 分間の期間で 10% を超えた場合にアクティブ化するように、Lambda 関数の `Throttles` メトリクスにアラームを設定できます。これは、Lambda 関数がアカウントとリージョンの最大同時実行数に達した可能性があることを意味します。

サーバーレスアプリケーションでは、SNS (Simple Notification Service) を使用してアラートを送信するのが一般的です。これにより、ユーザーはメール、SMS、その他のチャネルでアラートを受け取ることができます。さらに、SNS トピックに Lambda 関数をサブスクライブすることで、アラームの原因となった問題を自動的に修復することができます。

例えば、SQS キューからポーリングし、ダウンストリームサービスを呼び出す Lambda 関数 A があるとします。ダウンストリームサービスがダウンしていて応答しない場合、Lambda 関数は SQS からポーリングを続け、失敗しながらダウンストリームサービスを呼び出し続けます。これらのエラーを監視し、SNS を使用して CloudWatch アラームを生成して適切なチームに通知することができますが、SNS サブスクリプションを介して別の Lambda 関数 B を呼び出し、Lambda 関数 A のイベントソースマッピングを無効化して SQS キューからのポーリングを停止することもできます。これにより、ダウンストリームサービスが復旧するまで待機できます。

個々のメトリクスにアラームを設定するのは良いですが、時にはアプリケーションの運用状況とパフォーマンスをよりよく理解するために、複数のメトリクスを監視する必要があります。そのような場合は、[メトリック数式](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/using-metric-math.html) 式を使用して複数のメトリクスに基づいてアラームを設定する必要があります。

例えば、AWS Lambda のエラーを監視したいが、アラームをトリガーしないための少数のエラーは許容したい場合、エラー率をパーセンテージ形式で表す式を作成できます。つまり、ErrorRate = errors / invocation * 100 とし、設定された評価期間内で ErrorRate が 20% を超えた場合にアラートを送信するアラームを作成します。

## **トレーシング**

オブザーバビリティのベストプラクティスガイドのこのセクションでは、以下のトピックについて詳しく説明します。

* 分散トレーシングと AWS X-Ray の概要
* 適切なサンプリングルールの適用
* X-Ray SDK を使用して他のサービスとのやり取りをトレースする
* X-Ray SDK を使用して統合サービスをトレースするためのコードサンプル

### 分散トレーシングと AWS X-Ray の概要

ほとんどのサーバーレスアプリケーションは、複数の AWS サービスを使用する複数のマイクロサービスで構成されています。サーバーレスアーキテクチャの性質上、分散トレーシングが不可欠です。パフォーマンスモニタリングとエラートラッキングを効果的に行うには、ソースの呼び出し元からすべてのダウンストリームサービスにわたってトランザクションを追跡することが重要です。個々のサービスのログを使用してこれを実現することは可能ですが、AWS X-Ray のようなトレーシングツールを使用する方が速く効率的です。詳細については、[Instrumenting your application with AWS X-Ray](https://docs.aws.amazon.com/ja_jp/xray/latest/devguide/xray-instrumenting-your-app.html) を参照してください。

AWS X-Ray を使用すると、関係するマイクロサービスを通過するリクエストを追跡できます。X-Ray サービスマップを使用すると、さまざまな統合ポイントを理解し、アプリケーションのパフォーマンス低下を特定できます。数クリックするだけで、アプリケーションのどのコンポーネントがエラー、スロットリング、または待ち時間の問題を引き起こしているかを素早く特定できます。サービスグラフの下では、個々のトレースを確認して、各マイクロサービスで実際にかかった時間を特定することもできます。

![X-Ray Trace](../../../images/Serverless/aws-native/xray_trace.png)

**`ベストプラクティスとして、ダウンストリームの呼び出しやモニタリングが必要な特定の機能に対してコードにカスタムサブセグメントを作成してください。`** たとえば、外部 HTTP API への呼び出しや SQL データベースクエリを監視するためにサブセグメントを作成できます。

たとえば、ダウンストリームサービスに呼び出しを行う関数にカスタムサブセグメントを作成するには、`captureAsyncFunc` 関数 (node.js の場合) を使用します。

```
var AWSXRay = require('aws-xray-sdk');

app.use(AWSXRay.express.openSegment('MyApp'));

app.get('/', function (req, res) {
  var host = 'api.example.com';

  // start of the subsegment
  AWSXRay.captureAsyncFunc('send', function(subsegment) {
    sendRequest(host, function() {
      console.log('rendering!');
      res.render('index');

      // end of the subsegment
      subsegment.close();
    });
  });
});
```

この例では、アプリケーションは `sendRequest` 関数への呼び出しに対して `send` という名前のカスタムサブセグメントを作成します。`captureAsyncFunc` は、非同期呼び出しが完了したときにコールバック関数内で閉じる必要があるサブセグメントを渡します。

### **適切なサンプリングルールを適用する**

AWS X-Ray SDK はデフォルトですべてのリクエストをトレースするわけではありません。代表的なリクエストのサンプルを高コストなく提供するために、保守的なサンプリングルールを適用しています。ただし、特定の要件に基づいてすべてのリクエストをトレースするために、[デフォルトのサンプリングルールをカスタマイズ](https://docs.aws.amazon.com/ja_jp/xray/latest/devguide/xray-console-sampling.html)するか、サンプリングを完全に無効にすることができます。

AWS X-Ray は監査やコンプライアンスツールとして使用することを意図していないことに注意が必要です。**`アプリケーションの種類ごとに異なるサンプリングレートを設定する`** ことを検討すべきです。たとえば、バックグラウンドポーリングやヘルスチェックなどの大量の読み取り専用の呼び出しは、発生する可能性のある問題を特定するのに十分なデータを提供しながら、より低いレートでサンプリングできます。また、**`環境ごとに異なるサンプリングレートを設定する`** こともできます。たとえば、開発環境ではエラーやパフォーマンス問題を簡単にトラブルシューティングできるように、すべてのリクエストをトレースしたい場合があります。一方、本番環境ではトレース数を少なくすることができます。**`広範囲にわたるトレースは、コストの増加につながる可能性があることも念頭に置く必要があります`**。サンプリングルールの詳細については、[_X-Ray コンソールでのサンプリングルールの構成_](https://docs.aws.amazon.com/ja_jp/xray/latest/devguide/xray-console-sampling.html) を参照してください。

### **X-Ray SDK を使用して他の AWS サービスとのやり取りを追跡する**

X-Ray トレーシングは AWS Lambda や Amazon API Gateway などのサービスで簡単に有効にできますが、他のサービスではコードにインストルメンテーションを行う追加の手順が必要です。X-Ray と統合されている AWS サービスの完全なリストは[こちら](https://docs.aws.amazon.com/ja_jp/xray/latest/devguide/xray-services.html)です。

X-Ray と統合されていないサービス (DynamoDB など) への呼び出しを追跡するには、AWS SDK の呼び出しを AWS X-Ray SDK でラップすることで追跡できます。たとえば、Node.js を使用する場合は、以下のコード例に従って AWS SDK の呼び出しをすべて追跡できます。

### **X-Ray SDK を使用して統合サービスをトレースするためのコードサンプル**

```
//... FROM (old code)
const AWS = require('aws-sdk');

//... TO (new code)
const AWSXRay = require('aws-xray-sdk-core');
const AWS = AWSXRay.captureAWS(require('aws-sdk'));
...
```

note
個々の AWS SDK クライアントを計装するには、`AWSXRay.captureAWSClient` の呼び出しで AWS SDK クライアントをラップします。`captureAWS` と `captureAWSClient` を一緒に使用しないでください。これにより、トレースが重複してしまいます。


## **その他のリソース**

[CloudWatch Logs Insights](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/AnalyzingLogData.html)

[CloudWatch Lambda Insights](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/Lambda-Insights.html)

[Embedded Metrics Library](https://github.com/awslabs/aws-embedded-metrics-java)

## 概要

この AWS Lambda ベースのサーバーレスアプリケーションのオブザーバビリティベストプラクティスガイドでは、Amazon CloudWatch や AWS X-Ray などのネイティブ AWS サービスを使用したログ、メトリクス、トレーシングなどの重要な側面を強調しました。アプリケーションにオブザーバビリティのベストプラクティスを簡単に追加するために、AWS Lambda Powertools ライブラリの使用をお勧めしました。これらのベストプラクティスを採用することで、サーバーレスアプリケーションに関する貴重な洞察を得ることができ、エラーの検出と性能の最適化が早くなります。

さらに深く学ぶために、AWS の [One Observability Workshop](https://catalog.workshops.aws/observability/en-US) の AWS ネイティブオブザーバビリティモジュールを実践することを強くお勧めします。
