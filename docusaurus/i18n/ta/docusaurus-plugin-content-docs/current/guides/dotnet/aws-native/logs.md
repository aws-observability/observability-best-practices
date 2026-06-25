# லாக்குகள்

லாக்குகள் உங்கள் பயன்பாட்டில் நிகழ்வுகள் பற்றிய செழுமையான, சூழல்சார்ந்த தகவல்களை வழங்குகின்றன. பிழைத்திருத்தம் மற்றும் ஏன் ஏதாவது தவறாக நடந்தது என்பதைப் புரிந்துகொள்ள அவை மிகவும் அவசியமானவை.

இந்த பிரிவு .NET பயன்பாடுகளிலிருந்து AWS இன் நேட்டிவ் லாக் சேவையான Amazon CloudWatch Logs க்கு லாக்குகளை வெளியிடுவதற்கும் அனுப்புவதற்கும் சிறந்த நடைமுறைகளாகப் பயன்படுத்தக்கூடிய செய்முறைகளை வழங்குகிறது.

### Amazon EC2 இன்ஸ்டன்ஸ்கள் அல்லது ஆன்-பிரிமைசஸ் சர்வர்களிலிருந்து லாக் கோப்புகளை Amazon CloudWatch Logs க்கு ஸ்ட்ரீம் செய்தல்

உங்கள் ஏற்கனவே உள்ள .NET பயன்பாடுகள் லாக் கோப்புகளில் லாக்குகளை எழுதும் போது, உங்கள் குறியீட்டில் மாற்றங்கள் இல்லாமல் லாக் சேமிப்பு மற்றும் பகுப்பாய்விற்கு Amazon CloudWatch Logs ஐப் பயன்படுத்த விரும்பும் போது இந்த அணுகுமுறையைப் பயன்படுத்தலாம்.

**படி 1:** உங்கள் பயன்பாடு இயங்கும் Amazon EC2 இன்ஸ்டன்ஸ் அல்லது ஆன்-பிரிமைசஸ் சர்வரில் CW Agent ஐ நிறுவுங்கள். CW Agent ஐ நிறுவுவதற்கான வழிமுறைகளை [**இங்கே**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-on-EC2-Instance.html) காணலாம்.

**படி 2:** அடுத்ததாக, CloudWatch agent க்கு CloudWatch க்கு லாக்குகளை எழுத அனுமதிகளை வழங்க வேண்டும். CloudWatch agent க்கு CloudWatch க்கு லாக்குகளை எழுத தேவையான அனுமதிகளை வழங்க IAM role, IAM user அல்லது இரண்டையும் உருவாக்குங்கள். Amazon EC2 இன்ஸ்டன்ஸ்களில் agent ஐப் பயன்படுத்தப் போகிறீர்கள் என்றால், IAM role ஐ உருவாக்க வேண்டும். ஆன்-பிரிமைசஸ் சர்வர்களில் agent ஐப் பயன்படுத்தப் போகிறீர்கள் என்றால், IAM user ஐ உருவாக்க வேண்டும். **CloudWatchAgentServerPolicy** என்பது CloudWatch க்கு லாக்குகளை எழுத தேவையான அனுமதிகளை உள்ளடக்கிய AWS நிர்வகிக்கப்படும் IAM Policy ஆகும்.

CW Agent க்கு அனுமதிகளை வழங்க [**இந்த வழிமுறைகளைப் பின்பற்றுங்கள்**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/create-iam-roles-for-cloudwatch-agent-commandline.html).

**படி 3:** எந்த சர்வர்களிலும் CloudWatch agent ஐ இயக்குவதற்கு முன், ஒன்று அல்லது அதற்கு மேற்பட்ட CloudWatch agent கட்டமைப்பு கோப்புகளை உருவாக்க வேண்டும். Agent கட்டமைப்பு கோப்பு என்பது agent சேகரிக்க வேண்டிய மெட்ரிக்குகள், லாக்குகள் மற்றும் ட்ரேஸ்கள் மற்றும் அவற்றை எங்கு அனுப்ப வேண்டும் (CloudWatch இல் எந்த log group அல்லது namespace போன்றவை) என்பதைக் குறிப்பிடும் JSON கோப்பாகும். [**wizard ஐப் பயன்படுத்தி**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/create-cloudwatch-agent-configuration-file-wizard.html) அல்லது புதிதாக [**நீங்களே உருவாக்கி**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-Configuration-File-Details.html) இதை உருவாக்கலாம்.

Agent கட்டமைப்பு கோப்பில் நான்கு பிரிவுகள் உள்ளன: agent, metrics, logs மற்றும் traces. முன்பு உருவாக்கிய நற்சான்றிதழ்களை (படி 2) **agent** பிரிவில் வழங்கலாம். **logs** பிரிவு CloudWatch Logs க்கு எந்த லாக் கோப்புகள் வெளியிடப்படுகின்றன என்பதைக் குறிப்பிடுகிறது. சர்வர் Windows Server ஐ இயக்கினால் இது Windows Event Log இலிருந்து நிகழ்வுகளை உள்ளடக்கலாம். **agent** மற்றும் **logs** பிரிவுகளை கட்டமைப்பதற்கான விரிவான வழிமுறைகளை [**இங்கே**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-Configuration-File-Details.html) காணலாம்.

**படி 4:** மேலே உள்ள அனைத்தும் தயாராக இருந்தால், [**CloudWatch agent ஐத் தொடங்கலாம்**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-on-premise.html#start-CloudWatch-Agent-on-premise-SSM-onprem).

### .NET பயன்பாடுகளிலிருந்து CloudWatch Logs க்கு லாக்குகளை எழுத AWS SDK for .NET ஐப் பயன்படுத்துதல்

Amazon CloudWatch Logs க்கு நேரடியாக சேவையின் API களைப் பயன்படுத்தி லாக்குகளை எழுத விரும்பினால், AWS SDK for .NET ஐப் பயன்படுத்தி அவ்வாறு செய்யலாம்.

[**AWS SDK for .NET**](https://docs.aws.amazon.com/sdk-for-net/) AWS சேவைகளுடன் தொடர்புகொள்ளும் .NET பயன்பாடுகளை எளிதாக உருவாக்க நூலகங்களை வழங்குகிறது. நூலகங்கள் NuGet தொகுப்புகளின் வடிவத்தில் வழங்கப்படுகின்றன.

Amazon CloudWatch Logs உடன் தொடர்புகொள்ள, AWSSDK.CloudWatchLogs NuGet தொகுப்பால் வழங்கப்படும் AmazonCloudWatchLogsClient வகுப்பைப் பயன்படுத்த வேண்டும்.

**படி 1:** AWS CloudWatch Logs NuGet தொகுப்பை நிறுவுங்கள்

```csharp
dotnet add package AWSSDK.CloudWatchLogs
```

**படி 2:** AWS நற்சான்றிதழ்களை அமைக்கவும்

உங்கள் பயன்பாட்டிற்கு Cloud Watch Logs க்கு எழுத தேவையான அனுமதிகள் இருப்பதை உறுதி செய்யுங்கள். IAM role ஐ ஒதுக்குவதன் மூலம், AWS நற்சான்றிதழ் கோப்பைப் பயன்படுத்துவதன் மூலம் அல்லது சூழல் மாறிகளை அமைப்பதன் மூலம் செய்யலாம். எடுத்துக்காட்டாக, கீழே உள்ள policy log groups மற்றும் log streams ஐ உருவாக்குவதற்கும் அவற்றில் லாக்குகளை எழுதுவதற்கும் அனுமதிகளை வழங்குகிறது.

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

**படி 3:** CloudWatchLogs Client ஐ துவக்கவும். கீழே உள்ள namespaces மற்றும் classes AWSSDK.CloudWatchLogs NuGet தொகுப்பின் பகுதியாகும்.

```csharp
using Amazon.CloudWatchLogs;
using Amazon.CloudWatchLogs.Model;

var client = new AmazonCloudWatchLogsClient();
```

**படி 4:** தேவைப்பட்டால் Log Group மற்றும் Log Stream ஐ உருவாக்கவும். Log groups மற்றும் Log streams போன்ற Amazon CloudWatch Logs கருத்துக்கள் பற்றி மேலும் [**இங்கே**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatchLogsConcepts.html) படிக்கலாம்.

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

**படி 5:** உங்கள் லாக்குகளை Amazon CloudWatch Logs க்கு அனுப்புங்கள்

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

### பிரபலமான .NET லாக்கிங் கட்டமைப்புகளைப் பயன்படுத்தி Amazon CloudWatch Logs க்கு கட்டமைக்கப்பட்ட லாக்குகளை அனுப்புதல்

AmazonCloudWatchLogsClient நிறைய நெகிழ்வுத்தன்மையையும் CloudWatch Logs க்கு குறைந்த-நிலை API அணுகலையும் வழங்கினாலும், இது கணிசமான அளவு boilerplate குறியீட்டை விளைவிக்கிறது. கூடுதலாக, .NET டெவலப்பர் சமூகத்தில் கட்டமைக்கப்பட்ட லாக்கிங்கிற்கான பல பிரபலமான மூன்றாம் தரப்பு லாக்கிங் கட்டமைப்புகள் உள்ளன, அவற்றுடன் AmazonCloudWatchLogsClient out-of-the-box ஒருங்கிணைக்கப்படவில்லை.

[**aws-logging-dotnet**](https://github.com/aws/aws-logging-dotnet) களஞ்சியம் Amazon CloudWatch Logs உடன் ஒருங்கிணைக்க இந்த பிரபலமான லாக்கிங் கட்டமைப்பு வழங்குநர்களுக்கான plugins களை உள்ளடக்கியது. இந்த [**களஞ்சியம்**](https://github.com/aws/aws-logging-dotnet) நிலையான ASP.NET ILogger கட்டமைப்பு, NLog, Apache log4net அல்லது Serilog ஐப் பயன்படுத்தும் உங்கள் பயன்பாட்டை Amazon CloudWatch Logs க்கு லாக்குகளை அனுப்ப எவ்வாறு இணைப்பது என்பது பற்றிய விரிவான தகவல்களை உள்ளடக்கியது.

### AWS Lambda செயல்பாடுகளில் லாக்கிங்

https://aws.amazon.com/blogs/compute/introducing-advanced-logging-controls-for-aws-lambda-functions/

https://aws.amazon.com/blogs/developer/structured-logging-for-net-lambda/


### Lambda க்கான PowerTools

https://docs.powertools.aws.dev/lambda/dotnet/core/logging/#using-aws-lambda-advanced-logging-controls-alc
