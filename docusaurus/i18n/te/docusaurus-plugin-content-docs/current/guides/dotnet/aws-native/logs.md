# Logs

Logs మీ application లో events గురించి rich, contextual information అందిస్తాయి. Debugging మరియు ఏదో ఎందుకు తప్పు జరిగిందో అర్థం చేసుకోవడానికి అవి చాలా అవసరం.

ఈ section .NET applications నుండి logs emit చేయడానికి మరియు AWS యొక్క native log service - Amazon CloudWatch Logs కు send చేయడానికి best practices గా ఉపయోగించగల recipes అందిస్తుంది.

### Amazon EC2 instances లేదా on-premises servers లో log files నుండి Amazon CloudWatch Logs కు logs stream చేయండి

మీ ఇప్పటికే ఉన్న .NET applications log files కు logs write చేస్తే మరియు మీ code కు ఏ మార్పులు లేకుండా log storage మరియు analysis కోసం Amazon CloudWatch logs ఉపయోగించాలనుకుంటే ఈ approach ఉపయోగించవచ్చు.

**Step 1:** మీ application run అయ్యే Amazon EC2 instance లేదా On-premises server పై CW Agent install చేయండి. CW Agent install చేయడానికి instructions [**ఇక్కడ**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-on-EC2-Instance.html) కనుగొనవచ్చు.

**Step 2:** తర్వాత, CloudWatch agent కు CloudWatch కు logs write చేయడానికి permissions అందించాలి. CloudWatch agent కు logs write చేయడానికి అవసరమైన permissions grant చేయడానికి IAM role, IAM user, లేదా రెండూ create చేయండి. Amazon EC2 instances పై agent ఉపయోగించబోతుంటే, IAM role create చేయాలి. On-premises servers పై agent ఉపయోగించబోతుంటే, IAM user create చేయాలి. **CloudWatchAgentServerPolicy** CloudWatch కు logs write చేయడానికి అవసరమైన permissions include చేసే AWS managed IAM Policy.

CW Agent కు permissions అందించడానికి [**ఈ instructions follow చేయండి**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/create-iam-roles-for-cloudwatch-agent-commandline.html).

**Step 3:** ఏదైనా servers పై CloudWatch agent run చేయడానికి ముందు, ఒకటి లేదా అంతకంటే ఎక్కువ CloudWatch agent configuration files create చేయాలి. Agent configuration file అనేది agent collect చేయాల్సిన metrics, logs, మరియు traces మరియు వాటిని ఎక్కడ send చేయాలో (CloudWatch లో ఏ log group లేదా namespace) specify చేసే JSON file. దీన్ని [**wizard ఉపయోగించి**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/create-cloudwatch-agent-configuration-file-wizard.html) లేదా scratch నుండి [**మీరే create చేయడం**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-Configuration-File-Details.html) ద్వారా create చేయవచ్చు.

Agent configuration file నాలుగు sections కలిగి ఉంటుంది: agent, metrics, logs, మరియు traces. మీరు ముందుగా (step 2 లో) create చేసిన credentials ను **agent** section లో అందించవచ్చు. **logs** section ఏ log files CloudWatch Logs కు publish చేయాలో specify చేస్తుంది. Server Windows Server run చేస్తుంటే Windows Event Log నుండి events కూడా include చేయవచ్చు. **agent** మరియు **logs** sections configure చేయడానికి detailed instructions [**ఇక్కడ**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-Configuration-File-Details.html) కనుగొనవచ్చు.

**Step 4:** పై అన్ని విషయాలు place లో ఉన్న తర్వాత, మీరు [**CloudWatch agent start చేయవచ్చు**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-on-premise.html#start-CloudWatch-Agent-on-premise-SSM-onprem).

### .NET applications నుండి CloudWatch Logs కు logs write చేయడానికి AWS SDK for .NET ఉపయోగించండి

Service యొక్క APIs ఉపయోగించి నేరుగా Amazon CloudWatch Logs కు logs write చేయాలనుకుంటే, AWS SDK for .NET ఉపయోగించి చేయవచ్చు.

[**AWS SDK for .NET**](https://docs.aws.amazon.com/sdk-for-net/) AWS Services తో interact అయ్యే .NET applications develop చేయడం సులభం చేసే libraries అందిస్తుంది. Libraries NuGet packages రూపంలో అందించబడతాయి.

Amazon CloudWatch Logs తో interact చేయడానికి, AWSSDK.CloudWatchLogs NuGet package అందించే AmazonCloudWatchLogsClient class ఉపయోగించాలి.

**Step 1:** AWS CloudWatch Logs NuGet package install చేయండి

```csharp
dotnet add package AWSSDK.CloudWatchLogs
```

**Step 2:** AWS credentials సెటప్ చేయండి

మీ app కు Cloud Watch Logs కు write చేయడానికి అవసరమైన permissions ఉన్నాయని ensure చేయండి. IAM role assign చేయడం, AWS credentials file ఉపయోగించడం, లేదా environment variables సెటప్ చేయడం ద్వారా చేయవచ్చు. ఉదాహరణకు, కింది policy log groups మరియు log streams create చేయడానికి అలాగే వాటికి logs write చేయడానికి permissions అందిస్తుంది.

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

**Step 3:** CloudWatchLogs Client initialize చేయండి. కింది namespaces మరియు classes AWSSDK.CloudWatchLogs NuGet package లో భాగం.

```csharp
using Amazon.CloudWatchLogs;
using Amazon.CloudWatchLogs.Model;

var client = new AmazonCloudWatchLogsClient();
```

**Step 4:** అవసరమైతే Log Group మరియు Log Stream create చేయండి. Log groups మరియు Log streams వంటి Amazon CloudWatch Logs concepts గురించి [**ఇక్కడ**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatchLogsConcepts.html) మరింత చదవచ్చు

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

**Step 5:** మీ logs ను Amazon CloudWatch Logs కు send చేయండి

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

### Amazon CloudWatch Logs కు structured logs send చేయడానికి popular .NET logging frameworks ఉపయోగించండి

AmazonCloudWatchLogsClient చాలా flexibility మరియు CloudWatch Logs కు low-level API access అందించినప్పటికీ, ఇది significant amount of boilerplate code result చేస్తుంది. అదనంగా, AmazonCloudWatchLogsClient out-of-the-box integrate కాని .NET developer community లో structured logging కోసం అనేక popular third-party logging frameworks ఉన్నాయి.

[**aws-logging-dotnet**](https://github.com/aws/aws-logging-dotnet) repository Amazon CloudWatch Logs తో integrate చేయడానికి ఈ popular logging framework providers అనేకం కోసం plugins కలిగి ఉంది. Standard ASP.NET ILogger framework, NLog, Apache log4net, లేదా Serilog ఉపయోగించే మీ application ను Amazon CloudWatch Logs కు logs send చేయడానికి ఎలా wire up చేయాలో [**repository**](https://github.com/aws/aws-logging-dotnet) detailed information కలిగి ఉంది.

### AWS Lambda functions లో Logging

https://aws.amazon.com/blogs/compute/introducing-advanced-logging-controls-for-aws-lambda-functions/

https://aws.amazon.com/blogs/developer/structured-logging-for-net-lambda/


### Lambda కోసం PowerTools

https://docs.powertools.aws.dev/lambda/dotnet/core/logging/#using-aws-lambda-advanced-logging-controls-alc
