# Metrics

.NET은 메트릭이 트레이스 및 로그와 함께 핵심 축인 애플리케이션 Observability의 표준으로 OpenTelemetry를 채택했습니다. 이 통합은 개발자가 최소한의 오버헤드로 애플리케이션 성능을 모니터링할 수 있게 합니다.

.NET 에코시스템에서 OpenTelemetry 메트릭은 애플리케이션 메트릭을 측정하고 노출하기 위한 표준화된 접근 방식을 제공합니다. .NET 6에서 도입되고 .NET 8에서 크게 향상된 이 프레임워크는 메트릭 데이터의 수집 및 내보내기에 대한 빌트인 지원을 제공합니다.

이 프레임워크는 ASP.NET Core, HTTP 클라이언트, Entity Framework과 같은 일반적인 컴포넌트에 대한 자동 계측을 제공하여, 추가 코드 없이도 유용한 메트릭을 수집합니다.

.NET의 OpenTelemetry는 여러 내보내기 형식을 지원하며, 메트릭에는 Prometheus가 특히 인기가 높습니다. 이러한 유연성 덕분에 팀은 일관된 수집 방식을 유지하면서도 선호하는 Observability 플랫폼과 통합할 수 있습니다.

OpenTelemetry 메트릭을 채택함으로써 .NET 애플리케이션은 개발 환경에서 복잡한 프로덕션 배포까지 확장 가능한 벤더 중립적이고 표준화된 모니터링 접근 방식의 이점을 누릴 수 있으며, 애플리케이션 상태와 성능에 대한 중요한 가시성을 제공합니다.

## 메트릭 구현

.NET 8 애플리케이션에서 OpenTelemetry 메트릭을 구현하는 것은 매우 간단해졌습니다. 구성 프로세스는 현대 .NET 애플리케이션의 핵심인 의존성 주입 시스템을 활용합니다. 개발자는 의도가 명확하고 구성 옵션이 검색 가능한 fluent API를 사용하여 애플리케이션 부트스트랩 과정에서 메트릭 수집을 구성할 수 있습니다:

```c#
var builder = WebApplication.CreateBuilder(args);

// Add OpenTelemetry metrics
builder.Services.AddOpenTelemetry()
    .WithMetrics(metrics => metrics
        .AddAspNetCoreInstrumentation()
        .AddHttpClientInstrumentation()
        .AddRuntimeInstrumentation()
        .AddOtlpExporter());
```

## 사용자 지정 메트릭

개발자는 System.Diagnostics.Metrics 네임스페이스를 사용하여 사용자 지정 메트릭을 생성할 수 있습니다:

```c#
using var meter = new Meter("MyApplication.Metrics");
var orderCounter = meter.CreateCounter<int>("orders.processed");

// Recording values
orderCounter.Add(1, new("customer", customerId));
```
