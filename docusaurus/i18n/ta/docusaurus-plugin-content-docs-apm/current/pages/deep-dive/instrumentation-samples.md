# பல்வேறு நிரலாக்க மொழிகளுக்கான Instrumentation மாதிரிகள்

இந்தப் பிரிவு பல்வேறு நிரலாக்க மொழிகள் மற்றும் frameworks-ல் AWS Application Signals-உடன் பயன்பாடுகளை instrument செய்வதற்கான வழிகாட்டுதலை வழங்குகிறது.

## Demo பயன்பாடுகள்

- [Application Signals PetClinic Demo](https://github.com/aws-observability/application-signals-demo) - விரிவான instrumentation எடுத்துக்காட்டுகளுடன் கூடிய பல-மொழி Spring Boot microservices
- [One Observability PetAdoptions Demo](https://github.com/aws-samples/one-observability-demo) - Java, Python, .NET, Go, Rust மற்றும் Node.js சேவைகளுடன் full-stack பயன்பாடு
- [CloudWatch Application Signals SkillBuilder Demo](https://github.com/aws-samples/sample-cloudwatch-application-signals-skillbuilder-demo) - படிப்படியான instrumentation வழிகாட்டிகளுடன் கல்வி எடுத்துக்காட்டுகள்

## Auto-Instrumentation

Auto-instrumentation பிரபலமான frameworks மற்றும் libraries-ஐ தானாக கண்டறிந்து instrument செய்வதன் மூலம் குறியீடு மாற்றமின்றி observability-ஐ வழங்குகிறது. Application Signals-உடன் விரைவாக தொடங்குவதற்கு இது பரிந்துரைக்கப்படும் அணுகுமுறையாகும்.

### Java Spring Boot பயன்பாடுகள்

**Auto-Instrumentation அமைப்பு:**

```bash
java -javaagent:/path/to/aws-opentelemetry-agent.jar \
     -Dotel.service.name=my-java-app \
     -jar your-app.jar
```

**குறிப்பு Microservices:**

- **PetClinic Demo:**
  - [API Gateway Service](https://github.com/aws-observability/application-signals-demo/tree/main/spring-petclinic-api-gateway)
  - [Customers Service](https://github.com/aws-observability/application-signals-demo/tree/main/spring-petclinic-customers-service)
  - [Vets Service](https://github.com/aws-observability/application-signals-demo/tree/main/spring-petclinic-vets-service)
  - [Visits Service](https://github.com/aws-observability/application-signals-demo/tree/main/spring-petclinic-visits-service)
- **One Observability Demo:** [Pet Search Service (Java)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/microservices/petsearch-java)

### Python பயன்பாடுகள்

**Auto-Instrumentation அமைப்பு:**

```bash
pip install pip install aws-opentelemetry-distro
opentelemetry-instrument \
    --service_name my-python-app \
    python your_app.py
```

**குறிப்பு Microservices:**

- **One Observability Demo:**
  - [Pet List Adoptions Service (Python)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/microservices/petlistadoptions-py)
  - [Pet Food Agent - Strands (Python)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/microservices/petfoodagent-strands-py)

### Node.js பயன்பாடுகள்

**Auto-Instrumentation அமைப்பு:**

```bash
npm install @aws/opentelemetry-auto-instrumentation
node --require @aws/opentelemetry-auto-instrumentation \
     your_app.js
```

**குறிப்பு Microservices:**

- **One Observability Demo (Lambda):**
  - [Pet Status Updater (Node.js Lambda)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/lambda/petstatusupdater-node)
  - [Pet Food Stock Processor (Node.js Lambda)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/lambda/petfood-stock-processor-node)
  - [Pet Food Cleanup Processor (Node.js Lambda)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/lambda/petfood-cleanup-processor-node)
  - [Traffic Generator (Node.js Lambda)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/lambda/traffic-generator-node)

### .NET பயன்பாடுகள்

**Auto-Instrumentation அமைப்பு:**

```csharp
// Program.cs-ல் கட்டமைக்கவும்
builder.Services.AddOpenTelemetry()
    .WithTracing(builder => builder
        .AddAspNetCoreInstrumentation()
        .AddOtlpExporter());
```

**குறிப்பு Microservices:**

- **PetClinic Demo:** [Payment Service (.NET)](https://github.com/aws-observability/application-signals-demo/tree/main/dotnet-petclinic-payment)
- **One Observability Demo:** [Pet Site Service (.NET)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/microservices/petsite-net)

## Manual Instrumentation

Manual instrumentation என்பது எந்த auto-instrumentation agents இல்லாமல் OpenTelemetry SDK-களின் முழுமையான end-to-end ஒருங்கிணைப்பை உள்ளடக்கியது. இந்த அணுகுமுறை telemetry சேகரிப்பின் மீது அதிகபட்ச கட்டுப்பாட்டை வழங்குகிறது, auto-instrumentation-ஐ ஆதரிக்காத மொழிகளுக்கு இது தேவைப்படுகிறது.

### Java — Manual Spans

```java
import io.opentelemetry.api.trace.Tracer;
import io.opentelemetry.api.trace.Span;

Tracer tracer = GlobalOpenTelemetry.getTracer("my-service");

Span span = tracer.spanBuilder("custom-operation")
    .setAttribute("user.id", userId)
    .startSpan();
try {
    // உங்கள் வணிக தர்க்கம்
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

### Go பயன்பாடுகள் (Manual மட்டும்)

Go-க்கு manual instrumentation தேவை (auto-instrumentation கிடைக்காது).

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

**குறிப்பு செயல்படுத்தல்:**

- [Pay for Adoption Service (Go)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/microservices/payforadoption-go)

### Rust பயன்பாடுகள் (Manual மட்டும்)

**குறிப்பு செயல்படுத்தல்:**

- [Pet Food Service (Rust)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/microservices/petfood-rs)

## Combined Instrumentation (Auto + Manual)

Combined instrumentation baseline telemetry-க்கு auto-instrumentation agents-ஐ பயன்படுத்துகிறது, அதே நேரத்தில் manual instrumentation மூலம் தனிப்பயன் spans, attributes மற்றும் வணிக context-ஐ சேர்க்கிறது.

**குறிப்பு செயல்படுத்தல்கள்:**

- [Customers Service (Java)](https://github.com/aws-observability/application-signals-demo/tree/main/spring-petclinic-customers-service)
- [Pet Search Service (Java)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/microservices/petsearch-java)

### முக்கிய Manual Instrumentation சிறந்த நடைமுறைகள்

- **வணிக Context:** Spans-க்கு தொடர்புடைய வணிக attributes-ஐ (customer_id, order_value, product_category) எப்போதும் சேர்க்கவும்
- **பிழை கையாளுதல்:** விதிவிலக்குகளை பதிவு செய்து பொருத்தமான span status codes-ஐ அமைக்கவும்
- **தனிப்பயன் மெட்ரிக்குகள்:** தொழில்நுட்ப மெட்ரிக்குகளுடன் சேர்த்து வணிக-குறிப்பிட்ட மெட்ரிக்குகளை உருவாக்கவும்
- **Span படிநிலை:** சிக்கலான செயல்பாடுகளை பிரிக்க child spans-ஐ பயன்படுத்தவும்
- **Attribute பெயரிடல்:** முடிந்தவரை OpenTelemetry semantic conventions-ஐ பின்பற்றவும்
- **செயல்திறன் தாக்கம்:** அதிக throughput paths-ல் instrumentation overhead பற்றி கவனமாக இருக்கவும்
