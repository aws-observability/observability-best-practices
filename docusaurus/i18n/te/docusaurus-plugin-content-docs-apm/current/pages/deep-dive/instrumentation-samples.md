# వివిధ ప్రోగ్రామింగ్ భాషల కోసం Instrumentation నమూనాలు

ఈ విభాగం వివిధ ప్రోగ్రామింగ్ భాషలు మరియు frameworks అంతటా AWS Application Signals తో అప్లికేషన్లను instrument చేయడానికి మార్గదర్శకత్వం అందిస్తుంది.

## డెమో అప్లికేషన్లు

- [Application Signals PetClinic Demo](https://github.com/aws-observability/application-signals-demo) - సమగ్ర instrumentation ఉదాహరణలతో బహుళ-భాష Spring Boot microservices
- [One Observability PetAdoptions Demo](https://github.com/aws-samples/one-observability-demo) - Java, Python, .NET, Go, Rust మరియు Node.js సేవలతో పూర్తి-స్టాక్ అప్లికేషన్
- [CloudWatch Application Signals SkillBuilder Demo](https://github.com/aws-samples/sample-cloudwatch-application-signals-skillbuilder-demo) - దశల వారీ instrumentation మార్గదర్శకాలతో విద్యా ఉదాహరణలు

## Auto-Instrumentation

Auto-instrumentation ప్రసిద్ధ frameworks మరియు libraries ను స్వయంచాలకంగా గుర్తించి instrument చేయడం ద్వారా జీరో-కోడ్ observability ని అందిస్తుంది. Application Signals తో త్వరగా ప్రారంభించడానికి ఇది సిఫార్సు చేయబడిన విధానం.

### Java Spring Boot అప్లికేషన్లు

**Auto-Instrumentation సెటప్:**

```bash
java -javaagent:/path/to/aws-opentelemetry-agent.jar \
     -Dotel.service.name=my-java-app \
     -jar your-app.jar
```

**రిఫరెన్స్ Microservices:**

- **PetClinic Demo:**
  - [API Gateway Service](https://github.com/aws-observability/application-signals-demo/tree/main/spring-petclinic-api-gateway)
  - [Customers Service](https://github.com/aws-observability/application-signals-demo/tree/main/spring-petclinic-customers-service)
  - [Vets Service](https://github.com/aws-observability/application-signals-demo/tree/main/spring-petclinic-vets-service)
  - [Visits Service](https://github.com/aws-observability/application-signals-demo/tree/main/spring-petclinic-visits-service)
- **One Observability Demo:** [Pet Search Service (Java)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/microservices/petsearch-java)

### Python అప్లికేషన్లు

**Auto-Instrumentation సెటప్:**

```bash
pip install pip install aws-opentelemetry-distro
opentelemetry-instrument \
    --service_name my-python-app \
    python your_app.py
```

**రిఫరెన్స్ Microservices:**

- **One Observability Demo:**
  - [Pet List Adoptions Service (Python)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/microservices/petlistadoptions-py)
  - [Pet Food Agent - Strands (Python)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/microservices/petfoodagent-strands-py)

### Node.js అప్లికేషన్లు

**Auto-Instrumentation సెటప్:**

```bash
npm install @aws/opentelemetry-auto-instrumentation
node --require @aws/opentelemetry-auto-instrumentation \
     your_app.js
```

**రిఫరెన్స్ Microservices:**

- **One Observability Demo (Lambda):**
  - [Pet Status Updater (Node.js Lambda)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/lambda/petstatusupdater-node)
  - [Pet Food Stock Processor (Node.js Lambda)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/lambda/petfood-stock-processor-node)
  - [Pet Food Cleanup Processor (Node.js Lambda)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/lambda/petfood-cleanup-processor-node)
  - [Traffic Generator (Node.js Lambda)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/lambda/traffic-generator-node)

### .NET అప్లికేషన్లు

**Auto-Instrumentation సెటప్:**

```csharp
// Program.cs లో కాన్ఫిగర్ చేయండి
builder.Services.AddOpenTelemetry()
    .WithTracing(builder => builder
        .AddAspNetCoreInstrumentation()
        .AddOtlpExporter());
```

**రిఫరెన్స్ Microservices:**

- **PetClinic Demo:** [Payment Service (.NET)](https://github.com/aws-observability/application-signals-demo/tree/main/dotnet-petclinic-payment)
- **One Observability Demo:** [Pet Site Service (.NET)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/microservices/petsite-net)

## Manual Instrumentation

Manual instrumentation ఏ auto-instrumentation agents లేకుండా OpenTelemetry SDKs యొక్క పూర్తి ఎండ్-టు-ఎండ్ ఇంటిగ్రేషన్‌ను కలిగి ఉంటుంది. ఈ విధానం టెలిమెట్రీ సేకరణపై గరిష్ట నియంత్రణను అందిస్తుంది మరియు auto-instrumentation కు మద్దతు ఇవ్వని భాషలకు అవసరం.

### Java — Manual Spans

```java
import io.opentelemetry.api.trace.Tracer;
import io.opentelemetry.api.trace.Span;

Tracer tracer = GlobalOpenTelemetry.getTracer("my-service");

Span span = tracer.spanBuilder("custom-operation")
    .setAttribute("user.id", userId)
    .startSpan();
try {
    // మీ వ్యాపార తర్కం
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

### Go అప్లికేషన్లు (Manual మాత్రమే)

Go కి manual instrumentation అవసరం (auto-instrumentation అందుబాటులో లేదు).

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

**రిఫరెన్స్ ఇంప్లిమెంటేషన్:**

- [Pay for Adoption Service (Go)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/microservices/payforadoption-go)

### Rust అప్లికేషన్లు (Manual మాత్రమే)

**రిఫరెన్స్ ఇంప్లిమెంటేషన్:**

- [Pet Food Service (Rust)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/microservices/petfood-rs)

## కంబైన్డ్ Instrumentation (Auto + Manual)

కంబైన్డ్ instrumentation బేస్‌లైన్ టెలిమెట్రీ కోసం auto-instrumentation agents ను ఉపయోగిస్తుంది, అదే సమయంలో manual instrumentation ద్వారా కస్టమ్ spans, attributes మరియు వ్యాపార సందర్భాన్ని జోడిస్తుంది.

**రిఫరెన్స్ ఇంప్లిమెంటేషన్లు:**

- [Customers Service (Java)](https://github.com/aws-observability/application-signals-demo/tree/main/spring-petclinic-customers-service)
- [Pet Search Service (Java)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/microservices/petsearch-java)

### ముఖ్యమైన Manual Instrumentation ఉత్తమ పద్ధతులు

- **Business Context:** spans కు సంబంధిత వ్యాపార attributes (customer_id, order_value, product_category) ను ఎల్లప్పుడూ జోడించండి
- **Error Handling:** exceptions ను రికార్డ్ చేసి తగిన span status codes సెట్ చేయండి
- **Custom Metrics:** సాంకేతిక metrics తో పాటు వ్యాపార-నిర్దిష్ట metrics సృష్టించండి
- **Span Hierarchy:** సంక్లిష్ట operations ను విభజించడానికి child spans ఉపయోగించండి
- **Attribute Naming:** సాధ్యమైనంత OpenTelemetry semantic conventions ను అనుసరించండి
- **Performance Impact:** అధిక-throughput paths లో instrumentation overhead గురించి జాగ్రత్తగా ఉండండి
