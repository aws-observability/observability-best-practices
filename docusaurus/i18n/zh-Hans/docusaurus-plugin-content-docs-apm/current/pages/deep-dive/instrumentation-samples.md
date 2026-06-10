# 各编程语言的检测示例

本节提供使用 AWS Application Signals 在不同编程语言和框架中检测应用程序的指导。

## 演示应用程序

- [Application Signals PetClinic Demo](https://github.com/aws-observability/application-signals-demo) - 多语言 Spring Boot 微服务，包含全面的检测示例
- [One Observability PetAdoptions Demo](https://github.com/aws-samples/one-observability-demo) - 全栈应用程序，包含 Java、Python、.NET、Go、Rust 和 Node.js 服务
- [CloudWatch Application Signals SkillBuilder Demo](https://github.com/aws-samples/sample-cloudwatch-application-signals-skillbuilder-demo) - 教育性示例，包含逐步检测指南

## 自动检测

自动检测通过自动检测和检测流行的框架和库来提供零代码的 Observability。这是快速开始使用 Application Signals 的推荐方法。

### Java Spring Boot 应用程序

**自动检测设置：**

```bash
java -javaagent:/path/to/aws-opentelemetry-agent.jar \
     -Dotel.service.name=my-java-app \
     -jar your-app.jar
```

**参考微服务：**

- **PetClinic Demo：**
  - [API Gateway Service](https://github.com/aws-observability/application-signals-demo/tree/main/spring-petclinic-api-gateway)
  - [Customers Service](https://github.com/aws-observability/application-signals-demo/tree/main/spring-petclinic-customers-service)
  - [Vets Service](https://github.com/aws-observability/application-signals-demo/tree/main/spring-petclinic-vets-service)
  - [Visits Service](https://github.com/aws-observability/application-signals-demo/tree/main/spring-petclinic-visits-service)
- **One Observability Demo：** [Pet Search Service (Java)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/microservices/petsearch-java)

### Python 应用程序

**自动检测设置：**

```bash
pip install pip install aws-opentelemetry-distro
opentelemetry-instrument \
    --service_name my-python-app \
    python your_app.py
```

**参考微服务：**

- **One Observability Demo：**
  - [Pet List Adoptions Service (Python)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/microservices/petlistadoptions-py)
  - [Pet Food Agent - Strands (Python)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/microservices/petfoodagent-strands-py)

### Node.js 应用程序

**自动检测设置：**

```bash
npm install @aws/opentelemetry-auto-instrumentation
node --require @aws/opentelemetry-auto-instrumentation \
     your_app.js
```

**参考微服务：**

- **One Observability Demo (Lambda)：**
  - [Pet Status Updater (Node.js Lambda)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/lambda/petstatusupdater-node)
  - [Pet Food Stock Processor (Node.js Lambda)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/lambda/petfood-stock-processor-node)
  - [Pet Food Cleanup Processor (Node.js Lambda)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/lambda/petfood-cleanup-processor-node)
  - [Traffic Generator (Node.js Lambda)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/lambda/traffic-generator-node)

### .NET 应用程序

**自动检测设置：**

```csharp
// Configure in Program.cs
builder.Services.AddOpenTelemetry()
    .WithTracing(builder => builder
        .AddAspNetCoreInstrumentation()
        .AddOtlpExporter());
```

**参考微服务：**

- **PetClinic Demo：** [Payment Service (.NET)](https://github.com/aws-observability/application-signals-demo/tree/main/dotnet-petclinic-payment)
- **One Observability Demo：** [Pet Site Service (.NET)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/microservices/petsite-net)

## 手动检测

手动检测涉及完整的端到端 OpenTelemetry SDK 集成，不使用任何自动检测 agent。这种方法提供了对遥测收集的最大控制，且是不支持自动检测的语言所必需的。

### Java — 手动 Spans

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

### Python — 手动 Spans

```python
from opentelemetry import trace

tracer = trace.get_tracer(__name__)

with tracer.start_as_current_span("process-payment") as span:
    span.set_attribute("payment.amount", amount)
    span.set_attribute("payment.currency", currency)
    result = process_payment(amount, currency)
    span.set_attribute("payment.success", result.success)
```

### .NET — 手动 Spans

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

### Node.js — 手动 Spans

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

### Go 应用程序（仅手动）

Go 需要手动检测（没有可用的自动检测）。

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

**参考实现：**

- [Pay for Adoption Service (Go)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/microservices/payforadoption-go)

### Rust 应用程序（仅手动）

**参考实现：**

- [Pet Food Service (Rust)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/microservices/petfood-rs)

## 组合检测（自动 + 手动）

组合检测使用自动检测 agent 获取基线遥测数据，同时通过手动检测添加自定义 spans、属性和业务上下文。

**参考实现：**

- [Customers Service (Java)](https://github.com/aws-observability/application-signals-demo/tree/main/spring-petclinic-customers-service)
- [Pet Search Service (Java)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/microservices/petsearch-java)

### 手动检测关键最佳实践

- **业务上下文：** 始终向 spans 添加相关业务属性（customer_id、order_value、product_category）
- **错误处理：** 记录异常并设置适当的 span 状态码
- **自定义 Metrics：** 在技术 metrics 之外创建业务特定的 metrics
- **Span 层次结构：** 使用子 spans 分解复杂操作
- **属性命名：** 尽可能遵循 OpenTelemetry 语义约定
- **性能影响：** 注意高吞吐量路径中检测的开销
