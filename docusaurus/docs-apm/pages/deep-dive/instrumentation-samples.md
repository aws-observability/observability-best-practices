# Instrumentation Samples for Various Programming Languages

This section provides guidance for instrumenting applications with AWS Application Signals across different programming languages and frameworks.

## Demo Applications

- [Application Signals PetClinic Demo](https://github.com/aws-observability/application-signals-demo) - Multi-language Spring Boot microservices with comprehensive instrumentation examples
- [One Observability PetAdoptions Demo](https://github.com/aws-samples/one-observability-demo) - Full-stack application with Java, Python, .NET, Go, Rust, and Node.js services
- [CloudWatch Application Signals SkillBuilder Demo](https://github.com/aws-samples/sample-cloudwatch-application-signals-skillbuilder-demo) - Educational examples with step-by-step instrumentation guides

## Auto-Instrumentation

Auto-instrumentation provides zero-code observability by automatically detecting and instrumenting popular frameworks and libraries. This is the recommended approach for getting started quickly with Application Signals.

### Java Spring Boot Applications

**Auto-Instrumentation Setup:**

```bash
java -javaagent:/path/to/aws-opentelemetry-agent.jar \
     -Dotel.service.name=my-java-app \
     -jar your-app.jar
```

**Reference Microservices:**

- **PetClinic Demo:**
  - [API Gateway Service](https://github.com/aws-observability/application-signals-demo/tree/main/spring-petclinic-api-gateway)
  - [Customers Service](https://github.com/aws-observability/application-signals-demo/tree/main/spring-petclinic-customers-service)
  - [Vets Service](https://github.com/aws-observability/application-signals-demo/tree/main/spring-petclinic-vets-service)
  - [Visits Service](https://github.com/aws-observability/application-signals-demo/tree/main/spring-petclinic-visits-service)
- **One Observability Demo:** [Pet Search Service (Java)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/microservices/petsearch-java)

### Python Applications

**Auto-Instrumentation Setup:**

```bash
pip install pip install aws-opentelemetry-distro
opentelemetry-instrument \
    --service_name my-python-app \
    python your_app.py
```

**Reference Microservices:**

- **One Observability Demo:**
  - [Pet List Adoptions Service (Python)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/microservices/petlistadoptions-py)
  - [Pet Food Agent - Strands (Python)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/microservices/petfoodagent-strands-py)

### Node.js Applications

**Auto-Instrumentation Setup:**

```bash
npm install @aws/opentelemetry-auto-instrumentation
node --require @aws/opentelemetry-auto-instrumentation \
     your_app.js
```

**Reference Microservices:**

- **One Observability Demo (Lambda):**
  - [Pet Status Updater (Node.js Lambda)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/lambda/petstatusupdater-node)
  - [Pet Food Stock Processor (Node.js Lambda)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/lambda/petfood-stock-processor-node)
  - [Pet Food Cleanup Processor (Node.js Lambda)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/lambda/petfood-cleanup-processor-node)
  - [Traffic Generator (Node.js Lambda)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/lambda/traffic-generator-node)

### .NET Applications

**Auto-Instrumentation Setup:**

```csharp
// Configure in Program.cs
builder.Services.AddOpenTelemetry()
    .WithTracing(builder => builder
        .AddAspNetCoreInstrumentation()
        .AddOtlpExporter());
```

**Reference Microservices:**

- **PetClinic Demo:** [Payment Service (.NET)](https://github.com/aws-observability/application-signals-demo/tree/main/dotnet-petclinic-payment)
- **One Observability Demo:** [Pet Site Service (.NET)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/microservices/petsite-net)

## Manual Instrumentation

Manual instrumentation involves complete end-to-end integration of OpenTelemetry SDKs without any auto-instrumentation agents. This approach provides maximum control over telemetry collection and is required for languages that don't support auto-instrumentation.

### Java — Manual Spans

```java
import io.opentelemetry.api.trace.Tracer;
import io.opentelemetry.api.trace.Span;

Tracer tracer = GlobalOpenTelemetry.getTracer("my-service");

Span span = tracer.spanBuilder("custom-operation")
    .setAttribute("user.id", userId)
    .startSpan();
try {
    // Your business logic
    processOrder(order);
} finally {
    span.end();
}
```

### Python — Manual Spans

```python
from opentelemetry import trace

tracer = trace.get_tracer(__name__)

with tracer.start_as_current_span("process-payment") as span:
    span.set_attribute("payment.amount", amount)
    span.set_attribute("payment.currency", currency)
    result = process_payment(amount, currency)
    span.set_attribute("payment.success", result.success)
```

### .NET — Manual Spans

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

### Node.js — Manual Spans

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

### Go Applications (Manual Only)

Go requires manual instrumentation (no auto-instrumentation available).

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

**Reference Implementation:**

- [Pay for Adoption Service (Go)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/microservices/payforadoption-go)

### Rust Applications (Manual Only)

**Reference Implementation:**

- [Pet Food Service (Rust)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/microservices/petfood-rs)

## Combined Instrumentation (Auto + Manual)

Combined instrumentation uses auto-instrumentation agents for baseline telemetry while adding custom spans, attributes, and business context through manual instrumentation.

**Reference Implementations:**

- [Customers Service (Java)](https://github.com/aws-observability/application-signals-demo/tree/main/spring-petclinic-customers-service)
- [Pet Search Service (Java)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/microservices/petsearch-java)

### Key Manual Instrumentation Best Practices

- **Business Context:** Always add relevant business attributes (customer_id, order_value, product_category) to spans
- **Error Handling:** Record exceptions and set appropriate span status codes
- **Custom Metrics:** Create business-specific metrics alongside technical metrics
- **Span Hierarchy:** Use child spans to break down complex operations
- **Attribute Naming:** Follow OpenTelemetry semantic conventions where possible
- **Performance Impact:** Be mindful of instrumentation overhead in high-throughput paths
