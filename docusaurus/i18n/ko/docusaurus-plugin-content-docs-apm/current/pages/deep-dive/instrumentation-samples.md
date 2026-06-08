# 다양한 프로그래밍 언어별 계측 샘플

이 섹션에서는 다양한 프로그래밍 언어와 프레임워크에서 AWS Application Signals를 사용하여 애플리케이션을 계측하는 방법을 안내합니다.

## 데모 애플리케이션

- [Application Signals PetClinic 데모](https://github.com/aws-observability/application-signals-demo) - 종합적인 계측 예제를 포함한 다중 언어 Spring Boot 마이크로서비스
- [One Observability PetAdoptions 데모](https://github.com/aws-samples/one-observability-demo) - Java, Python, .NET, Go, Rust, Node.js 서비스를 포함한 풀스택 애플리케이션
- [CloudWatch Application Signals SkillBuilder 데모](https://github.com/aws-samples/sample-cloudwatch-application-signals-skillbuilder-demo) - 단계별 계측 가이드가 포함된 교육용 예제

## 자동 계측

자동 계측은 인기 있는 프레임워크와 라이브러리를 자동으로 감지하고 계측하여 코드 변경 없이 Observability를 제공합니다. Application Signals를 빠르게 시작하기 위한 권장 방법입니다.

### Java Spring Boot 애플리케이션

**자동 계측 설정:**

```bash
java -javaagent:/path/to/aws-opentelemetry-agent.jar \
     -Dotel.service.name=my-java-app \
     -jar your-app.jar
```

**참조 마이크로서비스:**

- **PetClinic 데모:**
  - [API Gateway Service](https://github.com/aws-observability/application-signals-demo/tree/main/spring-petclinic-api-gateway)
  - [Customers Service](https://github.com/aws-observability/application-signals-demo/tree/main/spring-petclinic-customers-service)
  - [Vets Service](https://github.com/aws-observability/application-signals-demo/tree/main/spring-petclinic-vets-service)
  - [Visits Service](https://github.com/aws-observability/application-signals-demo/tree/main/spring-petclinic-visits-service)
- **One Observability 데모:** [Pet Search Service (Java)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/microservices/petsearch-java)

### Python 애플리케이션

**자동 계측 설정:**

```bash
pip install pip install aws-opentelemetry-distro
opentelemetry-instrument \
    --service_name my-python-app \
    python your_app.py
```

**참조 마이크로서비스:**

- **One Observability 데모:**
  - [Pet List Adoptions Service (Python)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/microservices/petlistadoptions-py)
  - [Pet Food Agent - Strands (Python)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/microservices/petfoodagent-strands-py)

### Node.js 애플리케이션

**자동 계측 설정:**

```bash
npm install @aws/opentelemetry-auto-instrumentation
node --require @aws/opentelemetry-auto-instrumentation \
     your_app.js
```

**참조 마이크로서비스:**

- **One Observability 데모 (Lambda):**
  - [Pet Status Updater (Node.js Lambda)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/lambda/petstatusupdater-node)
  - [Pet Food Stock Processor (Node.js Lambda)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/lambda/petfood-stock-processor-node)
  - [Pet Food Cleanup Processor (Node.js Lambda)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/lambda/petfood-cleanup-processor-node)
  - [Traffic Generator (Node.js Lambda)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/lambda/traffic-generator-node)

### .NET 애플리케이션

**자동 계측 설정:**

```csharp
// Program.cs에서 구성
builder.Services.AddOpenTelemetry()
    .WithTracing(builder => builder
        .AddAspNetCoreInstrumentation()
        .AddOtlpExporter());
```

**참조 마이크로서비스:**

- **PetClinic 데모:** [Payment Service (.NET)](https://github.com/aws-observability/application-signals-demo/tree/main/dotnet-petclinic-payment)
- **One Observability 데모:** [Pet Site Service (.NET)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/microservices/petsite-net)

## 수동 계측

수동 계측은 자동 계측 에이전트 없이 OpenTelemetry SDK를 완전히 엔드투엔드로 통합하는 방식입니다. 이 방법은 텔레메트리 수집에 대한 최대한의 제어를 제공하며, 자동 계측을 지원하지 않는 언어에서 필수적입니다.

### Java — 수동 Span

```java
import io.opentelemetry.api.trace.Tracer;
import io.opentelemetry.api.trace.Span;

Tracer tracer = GlobalOpenTelemetry.getTracer("my-service");

Span span = tracer.spanBuilder("custom-operation")
    .setAttribute("user.id", userId)
    .startSpan();
try {
    // 비즈니스 로직
    processOrder(order);
} finally {
    span.end();
}
```

### Python — 수동 Span

```python
from opentelemetry import trace

tracer = trace.get_tracer(__name__)

with tracer.start_as_current_span("process-payment") as span:
    span.set_attribute("payment.amount", amount)
    span.set_attribute("payment.currency", currency)
    result = process_payment(amount, currency)
    span.set_attribute("payment.success", result.success)
```

### .NET — 수동 Span

```csharp
using OpenTelemetry.Trace;

var tracer = tracerProvider.GetTracer("my-service");

using var span = tracer.StartActiveSpan("validate-user");
try
{
    span.SetAttribute("user.email", user.Email);
    var isValid = await ValidateUserAsync(user);
    span.SetAttribute("validation.result", isValid);
    return isValid;
}
catch (Exception ex)
{
    span.SetStatus(Status.Error, ex.Message);
    throw;
}
```

### Node.js — 수동 Span

```javascript
const { trace } = require('@opentelemetry/api');

const tracer = trace.getTracer('my-service');

async function processOrder(order) {
    const span = tracer.startSpan('process-order');
    span.setAttribute('order.id', order.id);
    span.setAttribute('order.amount', order.amount);

    try {
        await validateOrder(order);
        await chargePayment(order);
        span.setAttribute('order.status', 'completed');
    } catch (error) {
        span.setStatus({ code: trace.SpanStatusCode.ERROR, message: error.message });
        throw error;
    } finally {
        span.end();
    }
}
```

### Go 애플리케이션 (수동 계측만 가능)

Go는 수동 계측이 필요합니다 (자동 계측 미지원).

```go
import (
    "go.opentelemetry.io/otel"
    "go.opentelemetry.io/otel/attribute"
)

tracer := otel.Tracer("my-service")

_, span := tracer.Start(ctx, "process-request")
span.SetAttributes(
    attribute.String("user.id", userID),
    attribute.Float64("request.duration", duration),
)
defer span.End()
```

**참조 구현:**

- [Pay for Adoption Service (Go)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/microservices/payforadoption-go)

### Rust 애플리케이션 (수동 계측만 가능)

**참조 구현:**

- [Pet Food Service (Rust)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/microservices/petfood-rs)

## 결합 계측 (자동 + 수동)

결합 계측은 기본 텔레메트리를 위해 자동 계측 에이전트를 사용하면서, 수동 계측을 통해 커스텀 span, 속성 및 비즈니스 컨텍스트를 추가하는 방식입니다.

**참조 구현:**

- [Customers Service (Java)](https://github.com/aws-observability/application-signals-demo/tree/main/spring-petclinic-customers-service)
- [Pet Search Service (Java)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/microservices/petsearch-java)

### 주요 수동 계측 모범 사례

- **비즈니스 컨텍스트:** 항상 관련 비즈니스 속성(customer_id, order_value, product_category)을 span에 추가
- **오류 처리:** 예외를 기록하고 적절한 span 상태 코드를 설정
- **커스텀 메트릭:** 기술 메트릭과 함께 비즈니스 관련 메트릭 생성
- **Span 계층 구조:** 복잡한 작업을 분해하기 위해 하위 span 사용
- **속성 명명:** 가능한 경우 OpenTelemetry 시맨틱 규칙 준수
- **성능 영향:** 높은 처리량 경로에서 계측 오버헤드에 주의
