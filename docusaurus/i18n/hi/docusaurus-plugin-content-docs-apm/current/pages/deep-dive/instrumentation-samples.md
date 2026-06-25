# विभिन्न प्रोग्रामिंग भाषाओं के लिए Instrumentation सैंपल

यह खंड विभिन्न प्रोग्रामिंग भाषाओं और फ्रेमवर्क में AWS Application Signals के साथ एप्लिकेशन को instrument करने के लिए मार्गदर्शन प्रदान करता है।

## डेमो एप्लिकेशन

- [Application Signals PetClinic डेमो](https://github.com/aws-observability/application-signals-demo) - व्यापक instrumentation उदाहरणों के साथ बहु-भाषा Spring Boot माइक्रोसर्विसेज
- [One Observability PetAdoptions डेमो](https://github.com/aws-samples/one-observability-demo) - Java, Python, .NET, Go, Rust, और Node.js सर्विसेज के साथ फुल-स्टैक एप्लिकेशन
- [CloudWatch Application Signals SkillBuilder डेमो](https://github.com/aws-samples/sample-cloudwatch-application-signals-skillbuilder-demo) - चरण-दर-चरण instrumentation गाइड के साथ शैक्षिक उदाहरण

## Auto-Instrumentation

Auto-instrumentation लोकप्रिय फ्रेमवर्क और लाइब्रेरी को स्वचालित रूप से detect और instrument करके बिना कोड बदले Observability प्रदान करता है। Application Signals के साथ जल्दी शुरू करने के लिए यह अनुशंसित दृष्टिकोण है।

### Java Spring Boot एप्लिकेशन

**Auto-Instrumentation सेटअप:**

```bash
java -javaagent:/path/to/aws-opentelemetry-agent.jar \
     -Dotel.service.name=my-java-app \
     -jar your-app.jar
```

**संदर्भ माइक्रोसर्विसेज:**

- **PetClinic डेमो:**
  - [API Gateway Service](https://github.com/aws-observability/application-signals-demo/tree/main/spring-petclinic-api-gateway)
  - [Customers Service](https://github.com/aws-observability/application-signals-demo/tree/main/spring-petclinic-customers-service)
  - [Vets Service](https://github.com/aws-observability/application-signals-demo/tree/main/spring-petclinic-vets-service)
  - [Visits Service](https://github.com/aws-observability/application-signals-demo/tree/main/spring-petclinic-visits-service)
- **One Observability डेमो:** [Pet Search Service (Java)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/microservices/petsearch-java)

### Python एप्लिकेशन

**Auto-Instrumentation सेटअप:**

```bash
pip install pip install aws-opentelemetry-distro
opentelemetry-instrument \
    --service_name my-python-app \
    python your_app.py
```

**संदर्भ माइक्रोसर्विसेज:**

- **One Observability डेमो:**
  - [Pet List Adoptions Service (Python)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/microservices/petlistadoptions-py)
  - [Pet Food Agent - Strands (Python)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/microservices/petfoodagent-strands-py)

### Node.js एप्लिकेशन

**Auto-Instrumentation सेटअप:**

```bash
npm install @aws/opentelemetry-auto-instrumentation
node --require @aws/opentelemetry-auto-instrumentation \
     your_app.js
```

**संदर्भ माइक्रोसर्विसेज:**

- **One Observability डेमो (Lambda):**
  - [Pet Status Updater (Node.js Lambda)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/lambda/petstatusupdater-node)
  - [Pet Food Stock Processor (Node.js Lambda)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/lambda/petfood-stock-processor-node)
  - [Pet Food Cleanup Processor (Node.js Lambda)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/lambda/petfood-cleanup-processor-node)
  - [Traffic Generator (Node.js Lambda)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/lambda/traffic-generator-node)

### .NET एप्लिकेशन

**Auto-Instrumentation सेटअप:**

```csharp
// Program.cs में कॉन्फ़िगर करें
builder.Services.AddOpenTelemetry()
    .WithTracing(builder => builder
        .AddAspNetCoreInstrumentation()
        .AddOtlpExporter());
```

**संदर्भ माइक्रोसर्विसेज:**

- **PetClinic डेमो:** [Payment Service (.NET)](https://github.com/aws-observability/application-signals-demo/tree/main/dotnet-petclinic-payment)
- **One Observability डेमो:** [Pet Site Service (.NET)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/microservices/petsite-net)

## Manual Instrumentation

Manual instrumentation में बिना किसी auto-instrumentation agent के OpenTelemetry SDK का पूर्ण एंड-टू-एंड एकीकरण शामिल है। यह दृष्टिकोण टेलीमेट्री संग्रह पर अधिकतम नियंत्रण प्रदान करता है और उन भाषाओं के लिए आवश्यक है जो auto-instrumentation का समर्थन नहीं करतीं।

### Java — Manual Spans

```java
import io.opentelemetry.api.trace.Tracer;
import io.opentelemetry.api.trace.Span;

Tracer tracer = GlobalOpenTelemetry.getTracer("my-service");

Span span = tracer.spanBuilder("custom-operation")
    .setAttribute("user.id", userId)
    .startSpan();
try {
    // आपका बिज़नेस लॉजिक
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

### Go एप्लिकेशन (केवल Manual)

Go को manual instrumentation की आवश्यकता होती है (auto-instrumentation उपलब्ध नहीं)।

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

**संदर्भ कार्यान्वयन:**

- [Pay for Adoption Service (Go)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/microservices/payforadoption-go)

### Rust एप्लिकेशन (केवल Manual)

**संदर्भ कार्यान्वयन:**

- [Pet Food Service (Rust)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/microservices/petfood-rs)

## संयुक्त Instrumentation (Auto + Manual)

संयुक्त instrumentation बेसलाइन टेलीमेट्री के लिए auto-instrumentation agents का उपयोग करता है जबकि manual instrumentation के माध्यम से कस्टम spans, attributes, और बिज़नेस संदर्भ जोड़ता है।

**संदर्भ कार्यान्वयन:**

- [Customers Service (Java)](https://github.com/aws-observability/application-signals-demo/tree/main/spring-petclinic-customers-service)
- [Pet Search Service (Java)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/microservices/petsearch-java)

### प्रमुख Manual Instrumentation सर्वोत्तम कार्यप्रणालियाँ

- **बिज़नेस संदर्भ:** हमेशा spans में प्रासंगिक बिज़नेस attributes (customer_id, order_value, product_category) जोड़ें
- **त्रुटि प्रबंधन:** exceptions रिकॉर्ड करें और उचित span status codes सेट करें
- **कस्टम मेट्रिक्स:** तकनीकी मेट्रिक्स के साथ बिज़नेस-विशिष्ट मेट्रिक्स बनाएं
- **Span पदानुक्रम:** जटिल ऑपरेशन को विभाजित करने के लिए child spans का उपयोग करें
- **Attribute नामकरण:** जहां संभव हो OpenTelemetry semantic conventions का पालन करें
- **प्रदर्शन प्रभाव:** उच्च-थ्रूपुट पथों में instrumentation ओवरहेड के प्रति सचेत रहें

