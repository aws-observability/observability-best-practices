# さまざまなプログラミング言語のインストルメンテーションサンプル

このセクションでは、さまざまなプログラミング言語とフレームワークにわたって、AWS Application Signals を使用してアプリケーションをインストルメント化するためのガイダンスを提供します。

## デモアプリケーション

- [Application Signals PetClinic デモ](https://github.com/aws-observability/application-signals-demo) - 包括的なインストルメンテーション例を含むマルチ言語 Spring Boot マイクロサービス
- [One Observability PetAdoptions デモ](https://github.com/aws-samples/one-observability-demo) - Java、Python、.NET、Go、Rust、Node.js サービスを含むフルスタックアプリケーション
- [CloudWatch Application Signals SkillBuilder デモ](https://github.com/aws-samples/sample-cloudwatch-application-signals-skillbuilder-demo) - ステップバイステップのインストルメンテーションガイドを含む教育用サンプル

## 自動インストルメンテーション

自動インストルメンテーションは、一般的なフレームワークやライブラリを自動的に検出してインストルメント化することで、コードを変更せずにオブザーバビリティを実現します。これは、Application Signals をすぐに使い始めるための推奨アプローチです。

### Java Spring Boot アプリケーション

**自動インストルメンテーションのセットアップ：**

```bash
java -javaagent:/path/to/aws-opentelemetry-agent.jar \
     -Dotel.service.name=my-java-app \
     -jar your-app.jar
```

**参照マイクロサービス：**

- **PetClinic デモ:**
  - [API Gateway サービス](https://github.com/aws-observability/application-signals-demo/tree/main/spring-petclinic-api-gateway)
  - [Customers サービス](https://github.com/aws-observability/application-signals-demo/tree/main/spring-petclinic-customers-service)
  - [Vets サービス](https://github.com/aws-observability/application-signals-demo/tree/main/spring-petclinic-vets-service)
  - [Visits サービス](https://github.com/aws-observability/application-signals-demo/tree/main/spring-petclinic-visits-service)
- **One Observability デモ:** [Pet Search サービス (Java)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/microservices/petsearch-java)

### Python アプリケーション

**自動インストルメンテーションのセットアップ：**

```bash
pip install pip install aws-opentelemetry-distro
opentelemetry-instrument \
    --service_name my-python-app \
    python your_app.py
```

**参照マイクロサービス：**

- **One Observability デモ:**
  - [ペットリスト導入サービス (Python)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/microservices/petlistadoptions-py)
  - [ペットフードエージェント - Strands (Python)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/microservices/petfoodagent-strands-py)

### Node.js アプリケーション

**自動インストルメンテーションのセットアップ：**

```bash
npm install @aws/opentelemetry-auto-instrumentation
node --require @aws/opentelemetry-auto-instrumentation \
     your_app.js
```

**参照マイクロサービス：**

- **One Observability デモ (Lambda):**
  - [Pet Status Updater (Node.js Lambda)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/lambda/petstatusupdater-node)
  - [Pet Food Stock Processor (Node.js Lambda)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/lambda/petfood-stock-processor-node)
  - [Pet Food Cleanup Processor (Node.js Lambda)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/lambda/petfood-cleanup-processor-node)
  - [Traffic Generator (Node.js Lambda)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/lambda/traffic-generator-node)

### .NET アプリケーション

**自動インストルメンテーションのセットアップ:**

```csharp
// Configure in Program.cs
builder.Services.AddOpenTelemetry()
    .WithTracing(builder => builder
        .AddAspNetCoreInstrumentation()
        .AddOtlpExporter());
```

**参照マイクロサービス：**

- **PetClinic デモ:** [Payment Service (.NET)](https://github.com/aws-observability/application-signals-demo/tree/main/dotnet-petclinic-payment)
- **One Observability デモ:** [Pet Site Service (.NET)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/microservices/petsite-net)

## 手動インストルメンテーション

手動インストルメンテーションは、自動インストルメンテーションエージェントを使用せずに OpenTelemetry SDK を完全にエンドツーエンドで統合するアプローチです。このアプローチはテレメトリ収集に対する最大限の制御を提供し、自動インストルメンテーションをサポートしていない言語に必要です。

### Java — 手動スパン

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

### Python — 手動スパン

```python
from opentelemetry import trace

tracer = trace.get_tracer(__name__)

with tracer.start_as_current_span("process-payment") as span:
    span.set_attribute("payment.amount", amount)
    span.set_attribute("payment.currency", currency)
    result = process_payment(amount, currency)
    span.set_attribute("payment.success", result.success)
```

### .NET — 手動スパン

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

### Node.js — 手動スパン

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

### Go アプリケーション (手動のみ)

Go は手動インストルメンテーションが必要です（自動インストルメンテーションは利用できません）。

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

**参照実装：**

- [導入支援サービスの料金 (Go)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/microservices/payforadoption-go)

### Rust アプリケーション（手動のみ）

**参照実装：**

- [ペットフードサービス (Rust)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/microservices/petfood-rs)

## 組み合わせたインストルメンテーション（自動 + 手動）

組み合わせたインストルメンテーションは、自動インストルメンテーションエージェントをベースラインテレメトリに使用しながら、手動インストルメンテーションを通じてカスタムスパン、属性、およびビジネスコンテキストを追加します。

**参考実装：**

- [Customers Service (Java)](https://github.com/aws-observability/application-signals-demo/tree/main/spring-petclinic-customers-service)
- [Pet Search Service (Java)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/microservices/petsearch-java)

### 主要な手動インストルメンテーションのベストプラクティス

- **ビジネスコンテキスト:** スパンに関連するビジネス属性（customer_id、order_value、product_category）を常に追加する
- **エラー処理:** 例外を記録し、適切なスパンステータスコードを設定する
- **カスタムメトリクス:** 技術的なメトリクスと並行して、ビジネス固有のメトリクスを作成する
- **スパン階層:** 子スパンを使用して複雑な操作を分解する
- **属性の命名:** 可能な限り OpenTelemetry のセマンティック規則に従う
- **パフォーマンスへの影響:** スループットの高いパスでのインストルメンテーションのオーバーヘッドに注意する
