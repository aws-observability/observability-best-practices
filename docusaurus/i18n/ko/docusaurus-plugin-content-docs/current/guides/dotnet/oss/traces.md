# Tracing

.NET은 OpenTelemetry 트레이싱에 대한 강력한 지원을 제공하여 개발자에게 분산 시스템 전반에 걸친 요청 흐름을 모니터링하기 위한 강력한 도구를 제공합니다. 이 구현은 애플리케이션 동작과 성능 병목 현상에 대한 종단 간 가시성을 제공합니다.

.NET 에코시스템에서 OpenTelemetry 트레이싱은 W3C Trace Context 사양의 .NET 구현인 [System.Diagnostics.Activity](https://learn.microsoft.com/en-us/dotnet/api/system.diagnostics.activity?view=net-9.0) 클래스를 중심으로 구축됩니다. 이러한 업계 표준과의 정렬은 다른 서비스 및 Observability 도구와의 상호 운용성을 보장합니다.

## 트레이스 구현

.NET 애플리케이션에서 OpenTelemetry 트레이싱을 구성하는 것은 간단합니다:

```c#
builder.Services.AddOpenTelemetry()
    .WithTracing(tracing => tracing
        .AddAspNetCoreInstrumentation()
        .AddHttpClientInstrumentation()
        .AddEntityFrameworkCoreInstrumentation()
        .AddSource("MyApplication.Tracing")
        .AddOtlpExporter());
```

.NET의 OpenTelemetry 구현의 핵심 강점은 자동 계측입니다. ASP.NET Core, HttpClient, gRPC, Entity Framework Core를 포함한 많은 일반적인 라이브러리와 프레임워크가 추가 코드 없이 트레이스를 생성합니다. 이를 통해 외부 호출과 데이터베이스 작업에 대한 즉각적인 가시성을 얻을 수 있습니다.

## 사용자 지정 트레이스

애플리케이션 코드에서 사용자 지정 트레이스를 생성하려면 ActivitySource API를 사용합니다:

```c#
// 소스를 한 번 생성하고 재사용합니다
private static readonly ActivitySource MyActivitySource = 
    new("MyApplication.Tracing");

// 중요한 작업에 대해 span을 생성합니다
using var activity = MyActivitySource.StartActivity("ProcessOrder");
activity?.SetTag("orderId", orderId);

// 하위 작업은 중첩된 span을 생성합니다
using var childActivity = MyActivitySource.StartActivity("ValidatePayment");
```

.NET 애플리케이션에서 OpenTelemetry 트레이싱의 모범 사례로 ActivitySource를 의존성 주입에 등록하는 것이 권장됩니다. 

```c#
// 서비스 구성 시
services.AddSingleton(sp => new ActivitySource("MyCompany.MyApplication", "1.0.0"));

// 더 많은 기능이 필요한 경우 래퍼 서비스를 생성합니다
services.AddSingleton<TracingService>();

// 필요한 곳에 주입합니다
public class OrderProcessor
{
    private readonly ActivitySource _activitySource;
    
    public OrderProcessor(ActivitySource activitySource)
    {
        _activitySource = activitySource;
    }
    
    public void ProcessOrder(Order order)
    {
        using var activity = _activitySource.StartActivity("ProcessOrder");
        activity?.SetTag("orderId", order.Id);
        
        // 처리 로직
    }
}
```
