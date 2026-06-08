# Logs

Logs(로그)는 애플리케이션의 이벤트에 대한 풍부한 컨텍스트 정보를 제공합니다. 디버깅과 문제 원인을 파악하는 데 매우 필수적입니다. 

이 섹션에서는 .NET 애플리케이션에서 로그를 생성하고 AWS의 네이티브 로그 서비스인 Amazon CloudWatch Logs로 전송하기 위한 모범 사례 레시피를 제공합니다.

### Amazon EC2 인스턴스 또는 온프레미스 서버의 로그 파일을 Amazon CloudWatch Logs로 스트리밍

기존 .NET 애플리케이션이 로그 파일에 로그를 기록하고 있으며, 코드 변경 없이 Amazon CloudWatch Logs를 로그 저장 및 분석에 활용하고자 할 때 이 방법을 사용할 수 있습니다.

**Step 1:** 애플리케이션이 실행 중인 Amazon EC2 인스턴스 또는 온프레미스 서버에 CW Agent를 설치합니다. CW Agent 설치 방법은 [**여기**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-on-EC2-Instance.html)에서 확인할 수 있습니다.

**Step 2:** 다음으로 CloudWatch Agent가 CloudWatch에 로그를 기록할 수 있도록 권한을 부여해야 합니다. CloudWatch Agent가 로그를 기록하는 데 필요한 권한을 부여하기 위해 IAM 역할, IAM 사용자 또는 둘 다를 생성합니다. Amazon EC2 인스턴스에서 Agent를 사용할 경우 IAM 역할을 생성해야 하고, 온프레미스 서버에서 사용할 경우 IAM 사용자를 생성해야 합니다. **CloudWatchAgentServerPolicy**는 CloudWatch에 로그를 기록하는 데 필요한 권한을 포함하는 AWS 관리형 IAM 정책입니다.

CW Agent에 권한을 부여하려면 [**이 지침을 따르세요**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/create-iam-roles-for-cloudwatch-agent-commandline.html).

**Step 3:** CloudWatch Agent를 서버에서 실행하기 전에, 하나 이상의 CloudWatch Agent 구성 파일을 생성해야 합니다. Agent 구성 파일은 Agent가 수집할 메트릭, 로그, 트레이스와 전송 대상(CloudWatch의 로그 그룹이나 네임스페이스 등)을 지정하는 JSON 파일입니다. [**마법사를 사용하여**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/create-cloudwatch-agent-configuration-file-wizard.html) 생성하거나 [**직접 처음부터 작성**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-Configuration-File-Details.html)할 수 있습니다.

Agent 구성 파일에는 agent, metrics, logs, traces의 네 가지 섹션이 있습니다. 이전 단계(Step 2)에서 생성한 자격 증명을 **agent** 섹션에서 제공할 수 있습니다. **logs** 섹션은 CloudWatch Logs에 게시할 로그 파일을 지정합니다. 서버가 Windows Server를 실행하는 경우 Windows Event Log의 이벤트도 포함할 수 있습니다. **agent** 및 **logs** 섹션을 구성하는 자세한 방법은 [**여기**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-Configuration-File-Details.html)에서 확인할 수 있습니다.

**Step 4:** 위의 모든 설정이 완료되면 [**CloudWatch Agent를 시작**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-on-premise.html#start-CloudWatch-Agent-on-premise-SSM-onprem)할 수 있습니다. 

### AWS SDK for .NET을 사용하여 .NET 애플리케이션에서 CloudWatch Logs로 로그 기록

Amazon CloudWatch Logs의 API를 사용하여 직접 로그를 기록하려면 AWS SDK for .NET을 활용할 수 있습니다. 

[**AWS SDK for .NET**](https://docs.aws.amazon.com/sdk-for-net/)은 AWS 서비스와 상호작용하는 .NET 애플리케이션 개발을 쉽게 해주는 라이브러리를 제공합니다. 라이브러리는 NuGet 패키지 형태로 제공됩니다.

Amazon CloudWatch Logs와 상호작용하려면 AWSSDK.CloudWatchLogs NuGet 패키지에서 제공하는 AmazonCloudWatchLogsClient 클래스를 사용해야 합니다.

**Step 1:** AWS CloudWatch Logs NuGet 패키지를 설치합니다.

```csharp
dotnet add package AWSSDK.CloudWatchLogs
```

**Step 2:** AWS 자격 증명을 설정합니다.

애플리케이션이 CloudWatch Logs에 기록할 수 있는 적절한 권한을 갖추고 있는지 확인합니다. IAM 역할 할당, AWS 자격 증명 파일 사용 또는 환경 변수 설정을 통해 권한을 부여할 수 있습니다. 예를 들어, 아래 정책은 로그 그룹 및 로그 스트림을 생성하고 로그를 기록할 수 있는 권한을 제공합니다.

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

**Step 3:** CloudWatchLogs 클라이언트를 초기화합니다. 아래의 네임스페이스와 클래스는 AWSSDK.CloudWatchLogs NuGet 패키지에 포함되어 있습니다.

```csharp
using Amazon.CloudWatchLogs;
using Amazon.CloudWatchLogs.Model;

var client = new AmazonCloudWatchLogsClient();
```

**Step 4:** 필요한 경우 로그 그룹과 로그 스트림을 생성합니다. 로그 그룹 및 로그 스트림과 같은 Amazon CloudWatch Logs 개념에 대한 자세한 내용은 [**여기**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatchLogsConcepts.html)에서 확인할 수 있습니다.

```csharp
string logGroupName = "MyAppLogGroup";
string logStreamName = "MyAppLogStream";

// 로그 그룹 생성 (이미 존재하면 건너뜀)
try
{
    await client.CreateLogGroupAsync(new CreateLogGroupRequest
    {
        LogGroupName = logGroupName
    });
}
catch (ResourceAlreadyExistsException) { }

// 로그 스트림 생성 (이미 존재하면 건너뜀)
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

**Step 5:** Amazon CloudWatch Logs로 로그를 전송합니다.

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

### 인기 있는 .NET 로깅 프레임워크를 사용하여 Amazon CloudWatch Logs로 구조화된 로그 전송

AmazonCloudWatchLogsClient를 사용하면 CloudWatch Logs에 대한 높은 유연성과 저수준 API 액세스가 가능하지만, 상당한 양의 보일러플레이트 코드가 필요합니다. 또한 .NET 개발자 커뮤니티에서 구조화된 로깅에 널리 사용되는 서드파티 로깅 프레임워크가 여러 개 있으며, AmazonCloudWatchLogsClient는 이러한 프레임워크와 기본적으로 통합되지 않습니다.

[**aws-logging-dotnet**](https://github.com/aws/aws-logging-dotnet) 리포지토리에는 이러한 인기 로깅 프레임워크 프로바이더와 Amazon CloudWatch Logs를 통합하기 위한 플러그인이 포함되어 있습니다. 이 [**리포지토리**](https://github.com/aws/aws-logging-dotnet)에는 표준 ASP.NET ILogger 프레임워크, NLog, Apache log4net 또는 Serilog를 사용하는 애플리케이션을 Amazon CloudWatch Logs로 로그를 전송하도록 연결하는 방법에 대한 상세한 정보가 있습니다.

### AWS Lambda 함수에서의 로깅

AWS Lambda 함수에서의 고급 로깅 제어에 대한 자세한 내용은 다음 리소스를 참조하세요:

- [AWS Lambda 함수의 고급 로깅 제어 소개](https://aws.amazon.com/blogs/compute/introducing-advanced-logging-controls-for-aws-lambda-functions/)
- [.NET Lambda를 위한 구조화된 로깅](https://aws.amazon.com/blogs/developer/structured-logging-for-net-lambda/)


### PowerTools for Lambda

AWS Lambda Advanced Logging Controls (ALC)와 함께 PowerTools를 활용하여 로깅 기능을 향상시킬 수 있습니다. 자세한 내용은 [PowerTools for Lambda 로깅 문서](https://docs.powertools.aws.dev/lambda/dotnet/core/logging/#using-aws-lambda-advanced-logging-controls-alc)를 참조하세요.
