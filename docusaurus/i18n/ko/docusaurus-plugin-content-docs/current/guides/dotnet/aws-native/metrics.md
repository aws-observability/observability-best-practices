# Metrics

Metrics(메트릭)는 시스템 성능과 동작에 대한 정량적 데이터를 제공하기 때문에 Observability에서 필수적입니다. 이를 통해 추세 분석이 가능하고 사용자에게 영향을 미치기 전에 문제를 감지하는 사전 예방적 모니터링을 지원합니다.

메트릭의 일반적인 내용과 메트릭 수집 및 분석을 위한 Amazon CloudWatch의 기능에 대해 알아보려면 [**Amazon CloudWatch의 메트릭**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/working_with_metrics.html)을 방문하세요.

[**많은 AWS 서비스가 인프라 메트릭을 기본적으로 Amazon CloudWatch에 게시하는 기능을 갖추고 있지만**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch-metrics-basic-detailed.html), 이 섹션에서는 .NET 애플리케이션에서 사용자 지정 메트릭을 캡처하여 분석을 위해 Amazon CloudWatch 메트릭 모니터링 시스템으로 전송하는 방법에 중점을 둡니다.

### AWS SDK for .NET을 통한 CloudWatch PutMetricData API 호출 사용

코드에 Amazon.CloudWatch 및 Amazon.CloudWatch.Model NuGet 패키지를 포함합니다.

```csharp
using Amazon.CloudWatch;
using Amazon.CloudWatch.Model;
```

네임스페이스, 메트릭 이름과 값, 디멘전 및 디멘전 값을 포함하는 PutMetricDataRequest 객체를 구성합니다.

```csharp
var request = new PutMetricDataRequest
{
    Namespace = namespaceName,
    MetricData = new List<MetricDatum>
    {
        new MetricDatum
        {
            MetricName = metricName,
            Dimensions = new List<Dimension>
            {
                new Dimension
                {
                    Name = dimensionName,
                    Value = dimensionValue
                }
            },
            Value = metricValue
        }
    }
};
```

PutMetricData API 호출을 사용하여 메트릭 데이터를 Amazon CloudWatch로 전송합니다.

```csharp
using var client = new AmazonCloudWatchClient();
await client.PutMetricDataAsync(request);
```

### CloudWatch embedded metric format

[**CloudWatch embedded metric format (EMF)**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html)을 사용하면 CloudWatch Logs에 로그를 기록하는 방식으로 비동기적으로 사용자 지정 메트릭을 생성할 수 있습니다. 이 방법을 통해 다음이 가능합니다:

* 상세한 로그 이벤트 데이터와 함께 사용자 지정 메트릭을 포함
* CloudWatch가 시각화 및 알람을 위해 이러한 메트릭을 자동으로 추출
* 실시간 인시던트 감지 지원
* CloudWatch Logs Insights를 사용하여 관련된 상세 로그 이벤트 쿼리
* 운영 이벤트의 근본 원인에 대한 심층적인 인사이트 확보

#### EMF 사용 사례

* 다양한 컴퓨팅 환경에서 사용자 지정 메트릭 생성

  * 커스텀 배치 코드가 필요하지 않고, 블로킹 네트워크 요청을 하거나 서드파티 소프트웨어에 의존하지 않으면서 Lambda 함수에서 손쉽게 사용자 지정 메트릭을 생성할 수 있습니다. 다른 컴퓨팅 환경(EC2, 온프레미스, ECS, EKS 및 기타 컨테이너 환경)은 [**CloudWatch Agent**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Generation_CloudWatch_Agent.html)를 설치하여 지원됩니다.
    
* 높은 카디널리티 컨텍스트와 메트릭 연결

    * Embedded Metric Format을 사용하면 사용자 지정 메트릭에 대한 시각화와 알람을 설정할 수 있을 뿐만 아니라, [**CloudWatch Logs Insights**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html)를 사용하여 쿼리할 수 있는 원본의 상세하고 높은 카디널리티의 컨텍스트도 유지됩니다. 예를 들어, 라이브러리는 Lambda 함수 버전, EC2 인스턴스 및 이미지 ID와 같은 환경 메타데이터를 구조화된 로그 이벤트 데이터에 자동으로 주입합니다.

시작하는 데 필요한 모든 것은 [**aws-embedded-metrics-dotnet 오픈소스 리포지토리**](https://github.com/awslabs/aws-embedded-metrics-dotnet)에서 확인할 수 있습니다. 

#### 설치

코드에 Amazon.CloudWatch.EMF NuGet 패키지를 포함합니다.

```csharp
using Amazon.CloudWatch.EMF
```

IDisposable을 구현하는 MetricsLogger를 인스턴스화하여 아래와 같이 사용할 수 있습니다. Logger가 dispose될 때 메트릭이 구성된 싱크로 flush됩니다.

#### 사용법

```csharp
using (var logger = new MetricsLogger()) {
    logger.SetNamespace("Canary");
    var dimensionSet = new DimensionSet();
    dimensionSet.AddDimension("Service", "aggregator");
    logger.SetDimensions(dimensionSet);
    logger.PutMetric("ProcessingLatency", 100, Unit.MILLISECONDS,StorageResolution.STANDARD);
    logger.PutMetric("Memory.HeapUsed", "1600424.0", Unit.BYTES, StorageResolution.HIGH);
    logger.PutProperty("RequestId", "422b1569-16f6-4a03-b8f0-fe3fd9b100f8");
    
}
```
#### ASP.NET Core

[**ASP.NET Core 애플리케이션**](https://github.com/awslabs/aws-embedded-metrics-dotnet)의 온보딩을 지원하고 기본 메트릭을 제공하는 헬퍼 패키지를 제공합니다.

1. Startup 파일에 구성을 추가합니다.

```csharp
public void ConfigureServices(IServiceCollection services) {
    // 필요한 서비스를 추가합니다. 이 작업이 완료되면
    // 컨트롤러에서 의존성 주입을 통해
    // IMetricsLogger를 사용할 수 있습니다
    services.AddEmf();
}
```

2. 각 요청에 기본 메트릭과 메타데이터를 추가하는 미들웨어를 추가합니다.

```csharp
public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
    // 요청 라우팅을 기반으로 메트릭 디멘전을 설정하는 미들웨어를 추가합니다
    app.UseEmfMiddleware();
}
```

AWS Lambda 이외의 환경에서는 EMF 이벤트를 수집하기 위해 아웃오브프로세스 에이전트([**CloudWatch Agent**](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Generation_CloudWatch_Agent.html) 또는 FireLens / Fluent-Bit)를 실행하는 것을 권장합니다. 아웃오브프로세스 에이전트를 사용할 경우, 이 패키지는 에이전트와의 일시적인 통신 문제를 처리하기 위해 프로세스 내에서 데이터를 비동기적으로 버퍼링합니다. 
