# Exemples d'instrumentation pour differents langages de programmation

Cette section fournit des conseils pour instrumenter les applications avec AWS Application Signals a travers differents langages de programmation et frameworks.

## Applications de demonstration

- [Application Signals PetClinic Demo](https://github.com/aws-observability/application-signals-demo) - Microservices Spring Boot multi-langages avec des exemples d'instrumentation complets
- [One Observability PetAdoptions Demo](https://github.com/aws-samples/one-observability-demo) - Application full-stack avec des services Java, Python, .NET, Go, Rust et Node.js
- [CloudWatch Application Signals SkillBuilder Demo](https://github.com/aws-samples/sample-cloudwatch-application-signals-skillbuilder-demo) - Exemples educatifs avec des guides d'instrumentation etape par etape

## Auto-instrumentation

L'auto-instrumentation fournit une Observability sans code en detectant et instrumentant automatiquement les frameworks et bibliotheques populaires. C'est l'approche recommandee pour demarrer rapidement avec Application Signals.

### Applications Java Spring Boot

**Configuration de l'auto-instrumentation :**

```bash
java -javaagent:/path/to/aws-opentelemetry-agent.jar \
     -Dotel.service.name=my-java-app \
     -jar your-app.jar
```

**Microservices de reference :**

- **PetClinic Demo :**
  - [API Gateway Service](https://github.com/aws-observability/application-signals-demo/tree/main/spring-petclinic-api-gateway)
  - [Customers Service](https://github.com/aws-observability/application-signals-demo/tree/main/spring-petclinic-customers-service)
  - [Vets Service](https://github.com/aws-observability/application-signals-demo/tree/main/spring-petclinic-vets-service)
  - [Visits Service](https://github.com/aws-observability/application-signals-demo/tree/main/spring-petclinic-visits-service)
- **One Observability Demo :** [Pet Search Service (Java)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/microservices/petsearch-java)

### Applications Python

**Configuration de l'auto-instrumentation :**

```bash
pip install pip install aws-opentelemetry-distro
opentelemetry-instrument \
    --service_name my-python-app \
    python your_app.py
```

**Microservices de reference :**

- **One Observability Demo :**
  - [Pet List Adoptions Service (Python)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/microservices/petlistadoptions-py)
  - [Pet Food Agent - Strands (Python)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/microservices/petfoodagent-strands-py)

### Applications Node.js

**Configuration de l'auto-instrumentation :**

```bash
npm install @aws/opentelemetry-auto-instrumentation
node --require @aws/opentelemetry-auto-instrumentation \
     your_app.js
```

**Microservices de reference :**

- **One Observability Demo (Lambda) :**
  - [Pet Status Updater (Node.js Lambda)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/lambda/petstatusupdater-node)
  - [Pet Food Stock Processor (Node.js Lambda)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/lambda/petfood-stock-processor-node)
  - [Pet Food Cleanup Processor (Node.js Lambda)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/lambda/petfood-cleanup-processor-node)
  - [Traffic Generator (Node.js Lambda)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/lambda/traffic-generator-node)

### Applications .NET

**Configuration de l'auto-instrumentation :**

```csharp
// Configure in Program.cs
builder.Services.AddOpenTelemetry()
    .WithTracing(builder => builder
        .AddAspNetCoreInstrumentation()
        .AddOtlpExporter());
```

**Microservices de reference :**

- **PetClinic Demo :** [Payment Service (.NET)](https://github.com/aws-observability/application-signals-demo/tree/main/dotnet-petclinic-payment)
- **One Observability Demo :** [Pet Site Service (.NET)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/microservices/petsite-net)

## Instrumentation manuelle

L'instrumentation manuelle implique une integration complete de bout en bout des SDK OpenTelemetry sans aucun agent d'auto-instrumentation. Cette approche offre un controle maximal sur la collecte de telemetrie et est requise pour les langages qui ne prennent pas en charge l'auto-instrumentation.

### Java — Spans manuels

```java
import io.opentelemetry.api.trace.Tracer;
import io.opentelemetry.api.trace.Span;

Tracer tracer = GlobalOpenTelemetry.getTracer("my-service");

Span span = tracer.spanBuilder("custom-operation")
    .setAttribute("user.id", userId)
    .startSpan();
try {
    // Votre logique metier
    processOrder(order);
} finally {
    span.end();
}
```

### Python — Spans manuels

```python
from opentelemetry import trace

tracer = trace.get_tracer(__name__)

with tracer.start_as_current_span("process-payment") as span:
    span.set_attribute("payment.amount", amount)
    span.set_attribute("payment.currency", currency)
    result = process_payment(amount, currency)
    span.set_attribute("payment.success", result.success)
```

### .NET — Spans manuels

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

### Node.js — Spans manuels

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

### Applications Go (instrumentation manuelle uniquement)

Go necessite une instrumentation manuelle (pas d'auto-instrumentation disponible).

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

**Implementation de reference :**

- [Pay for Adoption Service (Go)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/microservices/payforadoption-go)

### Applications Rust (instrumentation manuelle uniquement)

**Implementation de reference :**

- [Pet Food Service (Rust)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/microservices/petfood-rs)

## Instrumentation combinee (Auto + Manuelle)

L'instrumentation combinee utilise des agents d'auto-instrumentation pour la telemetrie de base tout en ajoutant des spans personnalises, des attributs et un contexte metier via l'instrumentation manuelle.

**Implementations de reference :**

- [Customers Service (Java)](https://github.com/aws-observability/application-signals-demo/tree/main/spring-petclinic-customers-service)
- [Pet Search Service (Java)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/microservices/petsearch-java)

### Meilleures pratiques d'instrumentation manuelle

- **Contexte metier :** Ajoutez toujours des attributs metier pertinents (customer_id, order_value, product_category) aux spans
- **Gestion des erreurs :** Enregistrez les exceptions et definissez les codes de statut de span appropries
- **Metriques personnalisees :** Creez des metriques specifiques au metier en plus des metriques techniques
- **Hierarchie des spans :** Utilisez des spans enfants pour decomposer les operations complexes
- **Nommage des attributs :** Suivez les conventions semantiques OpenTelemetry lorsque c'est possible
- **Impact sur les performances :** Soyez attentif a l'overhead de l'instrumentation dans les chemins a haut debit
