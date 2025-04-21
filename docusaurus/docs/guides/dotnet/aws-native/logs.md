# Logs

Logs provide rich, contextual information about events in your application.  They are very essential for debugging and understanding why something went wrong. 

This section provides recipes that can be used as best practices for emitting and sending logs from .NET applications to the AWS' native log service - Amazon CloudWatch Logs.

### Stream logs from log files on Amazon EC2 instances or on-premises servers to Amazon CloudWatch Logs


| **Dimension** | **Value** |
| -------- | -------- |
| **Destination** | Amazon CloudWatch Logs |
| **Agent** | CloudWatch Agent (CW Agent) |
| **Compute Engine** | Amazon EC2 or On-Premises servers |
| **OS** | Windows or Linux |

This recipe is best used when your existing .NET applications write logs to log files and you want to use the Amazon CloudWatch logs for log storage and analysis without any changes to your code.

**Step 1:** Install the CW Agent on the Amazon EC2 instance or the On-premises server where your application runs. Instructions for installing the CW Agent can be found [**here**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-on-EC2-Instance.html).

**Step 2:** Next, we need to provide permissions to the CloudWatch agent to write logs to CloudWatch. You create an IAM role, an IAM user, or both to grant permissions that the CloudWatch agent needs to write logs to CloudWatch. If you're going to use the agent on Amazon EC2 instances, you must create an IAM role. If you're going to use the agent on on-premises servers, you must create an IAM user. **CloudWatchAgentServerPolicy** is an AWS managed IAM Policy that includes necessary permissions to write logs to CloudWatch.

[**Follow these instructions**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/create-iam-roles-for-cloudwatch-agent-commandline.html) to provide the permissions to the CW Agent.

**Step 3:** Before running the CloudWatch agent on any servers, you must create one or more CloudWatch agent configuration files. The agent configuration file is a JSON file that specifies the metrics, logs, and traces that the agent is to collect and where to send them (like which log group or namespace in CloudWatch). You can create it by [**using a wizard**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/create-cloudwatch-agent-configuration-file-wizard.html) or by [**creating it yourself**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-Configuration-File-Details.html) from scratch.

The agent configuration file has four sections: agent, metrics, logs, and traces. You can provide the credentails you created previously (step 2) in the **agent** section. The **logs** section specifies what log files are published to CloudWatch Logs. This can include events from the Windows Event Log if the server runs Windows Server. Detailed instructions to configure the **agent** and the **logs** sections can be found [**here**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-Configuration-File-Details.html).

**Step 4:** Once you have all of the above things in place, you can [**start the CloudWatch agent**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-on-premise.html#start-CloudWatch-Agent-on-premise-SSM-onprem). 

### Use AWS SDK for .NET to write logs from .NET applications to CloudWatch Logs

[**AWS SDK for .NET**](https://docs.aws.amazon.com/sdk-for-net/) provides libraries that make it easier to develop .NET applications that interact with AWS Services. The libraries are provided in the form of NuGet packages.

To interact with AmazonCloudWatch Logs, you'll need to use the AmazonCloudWatchLogsClient class provided by the AWSSDK.CloudWatchLogs NuGet package.

**Step 1:** Install the AWS CloudWatch Logs NuGet package

```csharp
dotnet add package AWSSDK.CloudWatchLogs
```

**Step 2:** Set up AWS credentials

Make sure your app has the necessary permissions to write to Cloud Watch Logs. Either through assigning an IAM role, using an AWS credentials file, or setting up environment variables. For example, the below policy provides permissions to create log groups and log streams as well as writing logs to them.

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

**Step 3:** Initialize the CloudWatchLogs Client. The below namespaces and classes are part of the AWSSDK.CloudWatchLogs NuGet package.

```csharp
using Amazon.CloudWatchLogs;
using Amazon.CloudWatchLogs.Model;

var client = new AmazonCloudWatchLogsClient();
```

**Step 4:** Create a Log Group and Log Stream if needed. You can read more about these Amazon CloudWatch Logs concepts like Log groups and Log streams [**here**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatchLogsConcepts.html)

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

**Step 5:** Send your logs to Amazon CloudWatch Logs

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

### Use popular .NET logging frameworks to send structured logs to Amazon CloudWatch Logs

Although using the AmazonCloudWatchLogsClient provides a lot of flexibility and low-level API access to CloudWatch Logs, it results in a significant amount of boilerplate code. Additionally, there are several popular third-party logging frameworks among the .NET developer community for structured logging that the AmazonCloudWatchLogsClient does not integrate with out-of-the-box.

The [**aws-logging-dotnet**](https://github.com/aws/aws-logging-dotnet) repository contains plugins for many of these popular logging framework providers to integrate with Amazon CloudWatch Logs. The [**repository**](https://github.com/aws/aws-logging-dotnet) contains detailed information on how to wire up your application that uses the standard ASP.NET ILogger framework, NLog, Apache log4net, or Serilog to send logs to AmazonCloudWatch Logs.