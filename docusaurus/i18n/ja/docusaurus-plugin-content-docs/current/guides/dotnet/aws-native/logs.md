# ログ

ログは、アプリケーション内のイベントに関する豊富なコンテキスト情報を提供します。ログは、何が問題だったのかをデバッグして理解するために非常に重要です。

このセクションでは、.NET アプリケーションからログを出力し、AWS のネイティブログサービスである Amazon CloudWatch Logs に送信するためのベストプラクティスとして使用できるレシピを提供します。

### Amazon EC2 インスタンスまたはオンプレミスサーバー上のログファイルから Amazon CloudWatch Logs にログをストリーミングする

既存の .NET アプリケーションがログファイルにログを書き込んでおり、コードを変更せずに Amazon CloudWatch logs をログの保存と分析に使用したい場合に、このアプローチを使用できます。

**ステップ 1:** アプリケーションが実行されている Amazon EC2 インスタンスまたはオンプレミスサーバーに CW Agent をインストールします。CW Agent のインストール手順は[**こちら**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-on-EC2-Instance.html)を参照してください。

**ステップ 2:** 次に、CloudWatch エージェントが CloudWatch にログを書き込むための権限を付与する必要があります。CloudWatch エージェントが CloudWatch にログを書き込むために必要な権限を付与する IAM ロール、IAM ユーザー、またはその両方を作成します。Amazon EC2 インスタンスでエージェントを使用する場合は、IAM ロールを作成する必要があります。オンプレミスサーバーでエージェントを使用する場合は、IAM ユーザーを作成する必要があります。**CloudWatchAgentServerPolicy** は、CloudWatch にログを書き込むために必要な権限を含む AWS マネージド IAM ポリシーです。

[**こちらの手順に従って**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/create-iam-roles-for-cloudwatch-agent-commandline.html) CW Agent にアクセス許可を付与します。

**ステップ 3:** サーバーで CloudWatch エージェントを実行する前に、1 つ以上の CloudWatch エージェント設定ファイルを作成する必要があります。エージェント設定ファイルは、エージェントが収集するメトリクス、ログ、トレース、およびそれらの送信先 (CloudWatch のロググループや名前空間など) を指定する JSON ファイルです。[**ウィザードを使用**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/create-cloudwatch-agent-configuration-file-wizard.html)するか、[**自分で一から作成**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-Configuration-File-Details.html)することができます。

エージェント設定ファイルには、agent、metrics、logs、traces の 4 つのセクションがあります。以前に作成した認証情報（ステップ 2）は、**agent** セクションで指定できます。**logs** セクションでは、CloudWatch Logs に発行するログファイルを指定します。サーバーが Windows Server で実行されている場合は、Windows Event Log からのイベントを含めることができます。**agent** セクションと **logs** セクションを設定する詳細な手順については、[**こちら**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-Configuration-File-Details.html)を参照してください。

**ステップ 4:** 上記のすべての準備が整ったら、[**CloudWatch エージェントを起動**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-on-premise.html#start-CloudWatch-Agent-on-premise-SSM-onprem)できます。 

### AWS SDK for .NET を使用して .NET アプリケーションから CloudWatch Logs にログを書き込む

サービスの API を使用して Amazon CloudWatch Logs に直接ログを書き込む場合は、AWS SDK for .NET を使用して実行できます。

[**AWS SDK for .NET**](https://docs.aws.amazon.com/sdk-for-net/) は、AWS サービスと連携する .NET アプリケーションの開発を容易にするライブラリを提供します。ライブラリは NuGet パッケージの形式で提供されます。

Amazon CloudWatch Logs を操作するには、AWSSDK.CloudWatchLogs NuGet パッケージによって提供される AmazonCloudWatchLogsClient クラスを使用する必要があります。

**ステップ 1:** AWS CloudWatch Logs NuGet パッケージをインストールします。

```csharp
dotnet add package AWSSDK.CloudWatchLogs
```

**ステップ 2:** AWS 認証情報を設定します。

アプリケーションが Cloud Watch Logs に書き込むために必要な権限を持っていることを確認してください。IAM ロールの割り当て、AWS 認証情報ファイルの使用、または環境変数の設定のいずれかを使用します。たとえば、以下のポリシーは、ロググループとログストリームを作成し、それらにログを書き込む権限を提供します。

```json
{
    "Effect": "Allow",
    "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
    ],
    "Resource": "*"
}
```

**ステップ 3:** CloudWatchLogs クライアントを初期化します。以下の名前空間とクラスは、AWSSDK.CloudWatchLogs NuGet パッケージの一部です。

```csharp
using Amazon.CloudWatchLogs;
using Amazon.CloudWatchLogs.Model;

var client = new AmazonCloudWatchLogsClient();
```

**ステップ 4:** 必要に応じて、ロググループとログストリームを作成します。ロググループやログストリームなどの Amazon CloudWatch Logs の概念の詳細については、[**こちら**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatchLogsConcepts.html)を参照してください。

```csharp
string logGroupName = "MyAppLogGroup";
string logStreamName = "MyAppLogStream";

// Create Log Group (skip if already exists)
try
{
    await client.CreateLogGroupAsync(new CreateLogGroupRequest
    {
        LogGroupName = logGroupName
    });
}
catch (ResourceAlreadyExistsException) { }

// Create Log Stream (skip if already exists)
try
{
    await client.CreateLogStreamAsync(new CreateLogStreamRequest
    {
        LogGroupName = logGroupName,
        LogStreamName = logStreamName
    });
}
catch (ResourceAlreadyExistsException) { }
```

**ステップ 5:** ログを Amazon CloudWatch Logs に送信します

```csharp
var logEvents = new List<InputLogEvent>
{
    new InputLogEvent
    {
        Message = "Hello CloudWatch from .NET!",
        Timestamp = DateTime.UtcNow
    }
};

var putLogRequest = new PutLogEventsRequest
{
    LogGroupName = logGroupName,
    LogStreamName = logStreamName,
    LogEvents = logEvents
};

await client.PutLogEventsAsync(putLogRequest);
```

### 一般的な .NET ログ記録フレームワークを使用して構造化ログを Amazon CloudWatch Logs に送信する

AmazonCloudWatchLogsClient を使用すると、CloudWatch Logs への柔軟性と低レベル API アクセスが提供されますが、大量の定型コードが必要になります。さらに、.NET 開発者コミュニティでは構造化ログ記録のための人気のあるサードパーティログ記録フレームワークがいくつかありますが、AmazonCloudWatchLogsClient はそれらとすぐには統合できません。

[**aws-logging-dotnet**](https://github.com/aws/aws-logging-dotnet) リポジトリには、これらの人気のあるロギングフレームワークプロバイダーの多くを Amazon CloudWatch Logs と統合するためのプラグインが含まれています。この[**リポジトリ**](https://github.com/aws/aws-logging-dotnet)には、標準の ASP.NET ILogger フレームワーク、NLog、Apache log4net、または Serilog を使用するアプリケーションを Amazon CloudWatch Logs にログを送信するように設定する方法に関する詳細情報が含まれています。

### AWS Lambda 関数でのログ記録

https://aws.amazon.com/blogs/compute/introducing-advanced-logging-controls-for-aws-lambda-functions/

https://aws.amazon.com/blogs/developer/structured-logging-for-net-lambda/


### PowerTools for Lambda

https://docs.powertools.aws.dev/lambda/dotnet/core/logging/#using-aws-lambda-advanced-logging-controls-alc