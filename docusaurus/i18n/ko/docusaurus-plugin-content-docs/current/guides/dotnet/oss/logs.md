# Logs

.NET은 메트릭 및 트레이스와 함께 Observability 삼대 요소를 완성하는 OpenTelemetry 로깅에 대한 포괄적인 지원을 제공합니다. 이 통합은 현대 Observability 플랫폼에 원활하게 흐르는 구조화되고 컨텍스트화된 로깅을 가능하게 합니다.

OpenTelemetry 로깅 구현은 .NET의 확립된 Microsoft.Extensions.Logging 추상화 위에 구축되어, 개발자가 기존 로깅 코드를 변경하지 않고도 OpenTelemetry를 도입할 수 있게 합니다. 이 하위 호환성은 신규 및 기존 애플리케이션 모두에서 도입을 간단하게 만듭니다.

## 로깅 구현

.NET 애플리케이션에서 OpenTelemetry 로그를 설정하는 데는 최소한의 구성만 필요합니다:

```c#
builder.Logging.AddOpenTelemetry(options =>
{
    options.SetResourceBuilder(ResourceBuilder.CreateDefault()
        .AddService("MyServiceName"));
    
    options.AddOtlpExporter();
});
```

OpenTelemetry 로그의 가장 강력한 기능 중 하나는 자동 컨텍스트 전파입니다. 활성 트레이스 내에서 로깅이 발생하면 로그 항목에 trace 및 span ID가 자동으로 추가되어 로그와 관련 분산 트레이스 간의 연결이 생성됩니다.

```c#
// Logs created within this span will contain its context
using var activity = MyActivitySource.StartActivity("ProcessOrder");
logger.LogInformation("Processing order {OrderId}", orderId);
```

OpenTelemetry 로그를 .NET 애플리케이션에 구현함으로써, 개발 팀은 더 넓은 Observability 에코시스템과 원활하게 통합되는 표준화된 로깅 접근 방식을 얻게 됩니다. 이 통합은 문제 해결을 위한 중요한 컨텍스트를 제공하고, 서비스 전체에서 관련 시그널을 연결하며, 분산 환경에서 더 효과적인 모니터링과 디버깅을 가능하게 합니다.
