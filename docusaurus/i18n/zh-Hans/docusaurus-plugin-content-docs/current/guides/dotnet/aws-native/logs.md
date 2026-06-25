# Logs

Logs 提供有关应用程序中事件的丰富上下文信息。它们对于调试和理解出错原因非常重要。

本节提供可作为最佳实践使用的方法，用于从 .NET 应用程序发送 logs 到 AWS 原生日志服务——Amazon CloudWatch Logs。

### 从 Amazon EC2 实例或本地服务器上的日志文件流式传输 logs 到 Amazon CloudWatch Logs

当您现有的 .NET 应用程序将 logs 写入日志文件，并且您希望使用 Amazon CloudWatch Logs 进行日志存储和分析而无需更改代码时，可以使用此方法。

**步骤 1：** 在运行应用程序的 Amazon EC2 实例或本地服务器上安装 CW Agent。安装 CW Agent 的说明可在[**此处**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-on-EC2-Instance.html)找到。

**步骤 2：** 接下来，我们需要向 CloudWatch agent 提供将 logs 写入 CloudWatch 的权限。您可以创建 IAM 角色、IAM 用户或两者兼有，以授予 CloudWatch agent 将 logs 写入 CloudWatch 所需的权限。如果您要在 Amazon EC2 实例上使用 agent，则必须创建 IAM 角色。如果您要在本地服务器上使用 agent，则必须创建 IAM 用户。**CloudWatchAgentServerPolicy** 是一个 AWS 托管 IAM 策略，包含将 logs 写入 CloudWatch 所需的权限。

[**按照这些说明**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/create-iam-roles-for-cloudwatch-agent-commandline.html)向 CW Agent 提供权限。

**步骤 3：** 在任何服务器上运行 CloudWatch agent 之前，您必须创建一个或多个 CloudWatch agent 配置文件。agent 配置文件是一个 JSON 文件，指定 agent 要收集的 metrics、logs 和 traces 以及发送目标（如 CloudWatch 中的哪个日志组或命名空间）。您可以通过[**使用向导**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/create-cloudwatch-agent-configuration-file-wizard.html)创建它，也可以从头[**自行创建**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-Configuration-File-Details.html)。

agent 配置文件有四个部分：agent、metrics、logs 和 traces。您可以在 **agent** 部分提供之前创建的凭证（步骤 2）。**logs** 部分指定将哪些日志文件发布到 CloudWatch Logs。如果服务器运行 Windows Server，这可以包括来自 Windows 事件日志的事件。配置 **agent** 和 **logs** 部分的详细说明可在[**此处**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-Configuration-File-Details.html)找到。

**步骤 4：** 一旦以上所有内容就绪，您就可以[**启动 CloudWatch agent**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-on-premise.html#start-CloudWatch-Agent-on-premise-SSM-onprem)。

### 使用 AWS SDK for .NET 从 .NET 应用程序将 logs 写入 CloudWatch Logs

如果您想使用服务的 API 直接将 logs 写入 Amazon CloudWatch Logs，可以使用 AWS SDK for .NET 来实现。

[**AWS SDK for .NET**](https://docs.aws.amazon.com/sdk-for-net/) 提供的库使开发与 AWS 服务交互的 .NET 应用程序更加容易。这些库以 NuGet 包的形式提供。

要与 Amazon CloudWatch Logs 交互，您需要使用 AWSSDK.CloudWatchLogs NuGet 包提供的 AmazonCloudWatchLogsClient 类。

**步骤 1：** 安装 AWS CloudWatch Logs NuGet 包

```csharp
dotnet add package AWSSDK.CloudWatchLogs
```

**步骤 2：** 设置 AWS 凭证

确保您的应用程序具有写入 CloudWatch Logs 所需的权限。可以通过分配 IAM 角色、使用 AWS 凭证文件或设置环境变量来实现。例如，以下策略提供创建日志组和日志流以及向其写入 logs 的权限。

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

**步骤 3：** 初始化 CloudWatchLogs 客户端。以下命名空间和类是 AWSSDK.CloudWatchLogs NuGet 包的一部分。

```csharp
using Amazon.CloudWatchLogs;
using Amazon.CloudWatchLogs.Model;

var client = new AmazonCloudWatchLogsClient();
```

**步骤 4：** 如果需要，创建日志组和日志流。您可以在[**此处**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatchLogsConcepts.html)了解更多关于日志组和日志流等 Amazon CloudWatch Logs 概念的信息。

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

**步骤 5：** 将 logs 发送到 Amazon CloudWatch Logs

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

### 使用流行的 .NET 日志框架将结构化 logs 发送到 Amazon CloudWatch Logs

虽然使用 AmazonCloudWatchLogsClient 提供了很大的灵活性和对 CloudWatch Logs 的低级 API 访问，但它会产生大量的样板代码。此外，.NET 开发者社区中有几个流行的第三方结构化日志框架，AmazonCloudWatchLogsClient 无法开箱即用地与之集成。

[**aws-logging-dotnet**](https://github.com/aws/aws-logging-dotnet) 仓库包含许多这些流行日志框架提供程序的插件，用于与 Amazon CloudWatch Logs 集成。该[**仓库**](https://github.com/aws/aws-logging-dotnet)包含关于如何将使用标准 ASP.NET ILogger 框架、NLog、Apache log4net 或 Serilog 的应用程序连接起来以将 logs 发送到 Amazon CloudWatch Logs 的详细信息。

### 在 AWS Lambda 函数中记录日志

https://aws.amazon.com/blogs/compute/introducing-advanced-logging-controls-for-aws-lambda-functions/

https://aws.amazon.com/blogs/developer/structured-logging-for-net-lambda/


### PowerTools for Lambda

https://docs.powertools.aws.dev/lambda/dotnet/core/logging/#using-aws-lambda-advanced-logging-controls-alc
