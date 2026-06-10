# Logs

Logs आपके application में events के बारे में समृद्ध, contextual जानकारी प्रदान करते हैं। ये debugging और यह समझने के लिए कि कुछ गलत क्यों हुआ, बहुत आवश्यक हैं। 

यह अनुभाग ऐसी recipes प्रदान करता है जिनका उपयोग .NET applications से AWS की native log service - Amazon CloudWatch Logs में logs emit और send करने के लिए सर्वोत्तम प्रथाओं के रूप में किया जा सकता है।

### Amazon EC2 instances या on-premises servers पर log files से Amazon CloudWatch Logs में logs stream करें

आप इस दृष्टिकोण का उपयोग तब कर सकते हैं जब आपकी मौजूदा .NET applications log files में logs लिखती हैं और आप अपने code में कोई बदलाव किए बिना log storage और analysis के लिए Amazon CloudWatch logs का उपयोग करना चाहते हैं।

**Step 1:** Amazon EC2 instance या On-premises server पर CW Agent install करें जहां आपका application चलता है। CW Agent install करने के निर्देश [**यहां**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-on-EC2-Instance.html) मिल सकते हैं।

**Step 2:** इसके बाद, हमें CloudWatch agent को CloudWatch में logs लिखने के लिए permissions प्रदान करने की आवश्यकता है। आप एक IAM role, एक IAM user, या दोनों बनाते हैं ताकि CloudWatch agent को CloudWatch में logs लिखने के लिए आवश्यक permissions मिलें। यदि आप Amazon EC2 instances पर agent का उपयोग करने जा रहे हैं, तो आपको एक IAM role बनाना होगा। यदि आप on-premises servers पर agent का उपयोग करने जा रहे हैं, तो आपको एक IAM user बनाना होगा। **CloudWatchAgentServerPolicy** एक AWS managed IAM Policy है जिसमें CloudWatch में logs लिखने के लिए आवश्यक permissions शामिल हैं।

CW Agent को permissions प्रदान करने के लिए [**इन निर्देशों का पालन करें**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/create-iam-roles-for-cloudwatch-agent-commandline.html)।

**Step 3:** CloudWatch agent को किसी भी server पर चलाने से पहले, आपको एक या अधिक CloudWatch agent configuration files बनानी होंगी। Agent configuration file एक JSON file है जो specify करती है कि agent को कौन से metrics, logs, और traces collect करने हैं और उन्हें कहां भेजना है (जैसे CloudWatch में कौन सा log group या namespace)। आप इसे [**wizard का उपयोग करके**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/create-cloudwatch-agent-configuration-file-wizard.html) या [**स्वयं**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-Configuration-File-Details.html) scratch से बनाकर बना सकते हैं।

Agent configuration file में चार sections हैं: agent, metrics, logs, और traces। आप **agent** section में पहले (step 2) बनाए गए credentials प्रदान कर सकते हैं। **logs** section specify करता है कि कौन सी log files CloudWatch Logs में publish की जाती हैं। इसमें Windows Event Log से events शामिल हो सकते हैं यदि server Windows Server चलाता है। **agent** और **logs** sections को configure करने के विस्तृत निर्देश [**यहां**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-Configuration-File-Details.html) मिल सकते हैं।

**Step 4:** एक बार जब उपरोक्त सभी चीजें स्थापित हो जाएं, तो आप [**CloudWatch agent शुरू**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-on-premise.html#start-CloudWatch-Agent-on-premise-SSM-onprem) कर सकते हैं। 

### .NET applications से CloudWatch Logs में logs लिखने के लिए AWS SDK for .NET का उपयोग करें

यदि आप सेवा की APIs का उपयोग करके सीधे Amazon CloudWatch Logs में logs लिखना चाहते हैं, तो आप AWS SDK for .NET का उपयोग करके ऐसा कर सकते हैं। 

[**AWS SDK for .NET**](https://docs.aws.amazon.com/sdk-for-net/) ऐसी libraries प्रदान करता है जो AWS Services के साथ interact करने वाले .NET applications विकसित करना आसान बनाती हैं। Libraries NuGet packages के रूप में प्रदान की जाती हैं।

AmazonCloudWatch Logs के साथ interact करने के लिए, आपको AWSSDK.CloudWatchLogs NuGet package द्वारा प्रदान किए गए AmazonCloudWatchLogsClient class का उपयोग करना होगा।

**Step 1:** AWS CloudWatch Logs NuGet package install करें

```csharp
dotnet add package AWSSDK.CloudWatchLogs
```

**Step 2:** AWS credentials set up करें

सुनिश्चित करें कि आपके app में Cloud Watch Logs में लिखने के लिए आवश्यक permissions हैं। या तो IAM role assign करके, AWS credentials file का उपयोग करके, या environment variables सेट करके। उदाहरण के लिए, नीचे की policy log groups और log streams बनाने और उनमें logs लिखने की permissions प्रदान करती है।

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

**Step 3:** CloudWatchLogs Client initialize करें। नीचे दिए गए namespaces और classes AWSSDK.CloudWatchLogs NuGet package का हिस्सा हैं।

```csharp
using Amazon.CloudWatchLogs;
using Amazon.CloudWatchLogs.Model;

var client = new AmazonCloudWatchLogsClient();
```

**Step 4:** यदि आवश्यक हो तो Log Group और Log Stream बनाएं। आप इन Amazon CloudWatch Logs concepts जैसे Log groups और Log streams के बारे में अधिक [**यहां**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatchLogsConcepts.html) पढ़ सकते हैं।

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

**Step 5:** अपने logs Amazon CloudWatch Logs में भेजें

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

### Amazon CloudWatch Logs में structured logs भेजने के लिए लोकप्रिय .NET logging frameworks का उपयोग करें

हालांकि AmazonCloudWatchLogsClient बहुत flexibility और CloudWatch Logs तक low-level API access प्रदान करता है, इसके परिणामस्वरूप बहुत अधिक boilerplate code आता है। इसके अतिरिक्त, structured logging के लिए .NET developer community में कई लोकप्रिय third-party logging frameworks हैं जिनके साथ AmazonCloudWatchLogsClient out-of-the-box integrate नहीं होता।

[**aws-logging-dotnet**](https://github.com/aws/aws-logging-dotnet) repository में Amazon CloudWatch Logs के साथ integrate करने के लिए इनमें से कई लोकप्रिय logging framework providers के plugins शामिल हैं। [**repository**](https://github.com/aws/aws-logging-dotnet) में विस्तृत जानकारी है कि standard ASP.NET ILogger framework, NLog, Apache log4net, या Serilog का उपयोग करने वाले अपने application को AmazonCloudWatch Logs में logs भेजने के लिए कैसे wire up करें।

### AWS Lambda functions में Logging

https://aws.amazon.com/blogs/compute/introducing-advanced-logging-controls-for-aws-lambda-functions/

https://aws.amazon.com/blogs/developer/structured-logging-for-net-lambda/


### PowerTools for Lambda

https://docs.powertools.aws.dev/lambda/dotnet/core/logging/#using-aws-lambda-advanced-logging-controls-alc
