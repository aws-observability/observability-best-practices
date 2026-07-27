---
title: "Java Implementation Guide"
description: "Complete guide to instrumenting Java applications with AWS Application Signals across Lambda, ECS, and EKS environments"
readingTime: "15 min"
lastUpdated: "2026-01-29"
tags: ["java", "spring-boot", "instrumentation", "lambda", "ecs", "eks"]
relatedPages:
  - "/language-guides/"
  - "/examples/java-spring-boot"
  - "/getting-started/quick-start"
---

# Java Implementation Guide

Complete guide to instrumenting Java applications with AWS Application Signals using OpenTelemetry, covering Spring Boot, Quarkus, and Micronaut frameworks.

## Quick Start

### Prerequisites
- Java 8+ (Java 17+ recommended)
- AWS credentials configured
- Basic understanding of Spring Boot or Jakarta EE

### Installation Time Estimates
- **AWS Lambda**: 10-15 minutes
- **Amazon ECS**: 25-35 minutes
- **Amazon EKS**: 40-50 minutes

## Platform-Specific Implementation

### AWS Lambda

#### Using Lambda Layer (Recommended)
```java
// No code changes required - configure via Lambda console
// Add the AWS Distro for OpenTelemetry (ADOT) Lambda Layer

// Environment Variables:
// AWS_LAMBDA_EXEC_WRAPPER=/opt/otel-handler
// OTEL_SERVICE_NAME=my-java-service
// OTEL_TRACES_SAMPLER=xray
```

**Lambda Layer ARN Pattern:**
```
arn:aws:lambda:{region}:901920570463:layer:aws-otel-java-agent-{arch}-ver-1-32-0:1
```

#### Manual Instrumentation for Lambda
```java
package com.example.lambda;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import io.opentelemetry.api.GlobalOpenTelemetry;
import io.opentelemetry.api.trace.Span;
import io.opentelemetry.api.trace.Tracer;
import io.opentelemetry.context.Scope;

public class MyHandler implements RequestHandler<Map<String, Object>, String> {
    private static final Tracer tracer = GlobalOpenTelemetry.getTracer("my-service");

    @Override
    public String handleRequest(Map<String, Object> event, Context context) {
        Span span = tracer.spanBuilder("handleRequest")
            .setSpanKind(SpanKind.SERVER)
            .startSpan();
        
        try (Scope scope = span.makeCurrent()) {
            span.setAttribute("function.name", context.getFunctionName());
            span.setAttribute("request.id", context.getRequestId());
            
            // Your business logic
            String result = processEvent(event);
            
            span.setAttribute("result.size", result.length());
            return result;
        } catch (Exception e) {
            span.recordException(e);
            span.setStatus(StatusCode.ERROR, e.getMessage());
            throw e;
        } finally {
            span.end();
        }
    }
    
    private String processEvent(Map<String, Object> event) {
        // Business logic with automatic context propagation
        return "Processed: " + event.toString();
    }
}
```

**pom.xml Dependencies:**
```xml
<dependencies>
    <!-- AWS Lambda Core -->
    <dependency>
        <groupId>com.amazonaws</groupId>
        <artifactId>aws-lambda-java-core</artifactId>
        <version>1.2.3</version>
    </dependency>
    
    <!-- OpenTelemetry API -->
    <dependency>
        <groupId>io.opentelemetry</groupId>
        <artifactId>opentelemetry-api</artifactId>
        <version>1.32.0</version>
    </dependency>
    
    <!-- OpenTelemetry SDK (for manual instrumentation) -->
    <dependency>
        <groupId>io.opentelemetry</groupId>
        <artifactId>opentelemetry-sdk</artifactId>
        <version>1.32.0</version>
    </dependency>
</dependencies>
```

### Amazon ECS

#### Auto-Instrumentation with ADOT Sidecar

**task-definition.json:**
```json
{
  "family": "java-app-task",
  "containerDefinitions": [
    {
      "name": "java-app",
      "image": "my-java-app:latest",
      "environment": [
        {
          "name": "JAVA_TOOL_OPTIONS",
          "value": "-javaagent:/opt/aws-opentelemetry-agent.jar"
        },
        {
          "name": "OTEL_SERVICE_NAME",
          "value": "my-java-service"
        },
        {
          "name": "OTEL_TRACES_SAMPLER",
          "value": "xray"
        },
        {
          "name": "OTEL_EXPORTER_OTLP_ENDPOINT",
          "value": "http://localhost:4317"
        },
        {
          "name": "OTEL_PROPAGATORS",
          "value": "xray,tracecontext,b3,b3multi"
        },
        {
          "name": "OTEL_RESOURCE_ATTRIBUTES",
          "value": "service.name=my-java-service,service.namespace=production"
        }
      ],
      "dependsOn": [
        {
          "containerName": "aws-otel-collector",
          "condition": "START"
        }
      ]
    },
    {
      "name": "aws-otel-collector",
      "image": "public.ecr.aws/aws-observability/aws-otel-collector:latest",
      "environment": [
        {
          "name": "AWS_REGION",
          "value": "us-east-1"
        }
      ],
      "command": ["--config=/etc/ecs/ecs-default-config.yaml"]
    }
  ]
}
```

**Dockerfile with Java Agent:**
```dockerfile
FROM eclipse-temurin:17-jre

# Download ADOT Java Agent
ADD https://github.com/aws-observability/aws-otel-java-instrumentation/releases/latest/download/aws-opentelemetry-agent.jar /opt/aws-opentelemetry-agent.jar

# Copy application
COPY target/my-app.jar /app/app.jar

WORKDIR /app

ENV JAVA_TOOL_OPTIONS="-javaagent:/opt/aws-opentelemetry-agent.jar"

ENTRYPOINT ["java", "-jar", "app.jar"]
```

#### Spring Boot Application with Manual Instrumentation

```java
package com.example.springboot;

import io.opentelemetry.api.OpenTelemetry;
import io.opentelemetry.api.trace.Span;
import io.opentelemetry.api.trace.Tracer;
import io.opentelemetry.context.Context;
import io.opentelemetry.context.Scope;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

@Service
public class OrderService {
    private final Tracer tracer;
    
    @Autowired
    public OrderService(OpenTelemetry openTelemetry) {
        this.tracer = openTelemetry.getTracer("order-service");
    }
    
    public Order processOrder(OrderRequest request) {
        Span span = tracer.spanBuilder("processOrder")
            .setParent(Context.current())
            .setAttribute("order.id", request.getId())
            .setAttribute("order.amount", request.getAmount())
            .startSpan();
        
        try (Scope scope = span.makeCurrent()) {
            // Validate order
            validateOrder(request);
            
            // Process payment (nested span auto-created if instrumented)
            paymentService.processPayment(request.getPaymentInfo());
            
            // Create order
            Order order = createOrder(request);
            
            span.setAttribute("order.status", order.getStatus());
            return order;
        } catch (InvalidOrderException e) {
            span.recordException(e);
            span.setStatus(StatusCode.ERROR, "Invalid order");
            throw e;
        } finally {
            span.end();
        }
    }
    
    private void validateOrder(OrderRequest request) {
        Span span = tracer.spanBuilder("validateOrder")
            .startSpan();
        
        try (Scope scope = span.makeCurrent()) {
            // Validation logic
            if (request.getAmount() <= 0) {
                throw new InvalidOrderException("Amount must be positive");
            }
            span.setAttribute("validation.result", "passed");
        } finally {
            span.end();
        }
    }
}
```

**Spring Boot Configuration:**
```java
package com.example.springboot.config;

import io.opentelemetry.api.OpenTelemetry;
import io.opentelemetry.api.common.Attributes;
import io.opentelemetry.exporter.otlp.trace.OtlpGrpcSpanExporter;
import io.opentelemetry.sdk.OpenTelemetrySdk;
import io.opentelemetry.sdk.resources.Resource;
import io.opentelemetry.sdk.trace.SdkTracerProvider;
import io.opentelemetry.sdk.trace.export.BatchSpanProcessor;
import io.opentelemetry.semconv.resource.attributes.ResourceAttributes;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenTelemetryConfig {
    
    @Value("${otel.exporter.otlp.endpoint:http://localhost:4317}")
    private String otlpEndpoint;
    
    @Value("${spring.application.name}")
    private String serviceName;
    
    @Bean
    public OpenTelemetry openTelemetry() {
        Resource resource = Resource.getDefault()
            .merge(Resource.create(Attributes.of(
                ResourceAttributes.SERVICE_NAME, serviceName,
                ResourceAttributes.SERVICE_NAMESPACE, "production",
                ResourceAttributes.SERVICE_VERSION, "1.0.0"
            )));
        
        OtlpGrpcSpanExporter spanExporter = OtlpGrpcSpanExporter.builder()
            .setEndpoint(otlpEndpoint)
            .build();
        
        SdkTracerProvider tracerProvider = SdkTracerProvider.builder()
            .addSpanProcessor(BatchSpanProcessor.builder(spanExporter).build())
            .setResource(resource)
            .build();
        
        return OpenTelemetrySdk.builder()
            .setTracerProvider(tracerProvider)
            .buildAndRegisterGlobal();
    }
}
```

### Amazon EKS

#### Using ADOT Operator

**Deploy ADOT Operator:**
```bash
kubectl apply -f https://github.com/open-telemetry/opentelemetry-operator/releases/latest/download/opentelemetry-operator.yaml
```

**OpenTelemetryCollector Configuration:**
```yaml
apiVersion: opentelemetry.io/v1alpha1
kind: OpenTelemetryCollector
metadata:
  name: adot-collector
  namespace: observability
spec:
  mode: daemonset
  config: |
    receivers:
      otlp:
        protocols:
          grpc:
            endpoint: 0.0.0.0:4317
          http:
            endpoint: 0.0.0.0:4318
    
    processors:
      batch:
        timeout: 10s
        send_batch_size: 1024
      
      resourcedetection:
        detectors: [env, eks]
        timeout: 5s
      
      attributes:
        actions:
          - key: service.namespace
            value: production
            action: insert
    
    exporters:
      awsxray:
        region: us-east-1
      
      awsemf:
        namespace: ApplicationSignals
        region: us-east-1
        dimension_rollup_option: NoDimensionRollup
    
    service:
      pipelines:
        traces:
          receivers: [otlp]
          processors: [resourcedetection, attributes, batch]
          exporters: [awsxray]
        metrics:
          receivers: [otlp]
          processors: [resourcedetection, attributes, batch]
          exporters: [awsemf]
```

**Java Deployment with Auto-Instrumentation:**
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: java-app

---
apiVersion: opentelemetry.io/v1alpha1
kind: Instrumentation
metadata:
  name: java-instrumentation
  namespace: java-app
spec:
  exporter:
    endpoint: http://adot-collector.observability:4317
  propagators:
    - tracecontext
    - baggage
    - b3
  sampler:
    type: parentbased_traceidratio
    argument: "1.0"
  java:
    image: public.ecr.aws/aws-observability/adot-autoinstrumentation-java:latest
    env:
      - name: OTEL_TRACES_SAMPLER
        value: parentbased_traceidratio
      - name: OTEL_TRACES_SAMPLER_ARG
        value: "1.0"

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: spring-boot-app
  namespace: java-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: spring-boot-app
  template:
    metadata:
      labels:
        app: spring-boot-app
      annotations:
        instrumentation.opentelemetry.io/inject-java: "true"
    spec:
      serviceAccountName: spring-boot-sa
      containers:
      - name: app
        image: my-spring-boot-app:latest
        ports:
        - containerPort: 8080
        env:
        - name: OTEL_SERVICE_NAME
          value: spring-boot-app
        - name: OTEL_RESOURCE_ATTRIBUTES
          value: service.namespace=production,deployment.environment=eks
        - name: SPRING_PROFILES_ACTIVE
          value: production
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"

---
apiVersion: v1
kind: Service
metadata:
  name: spring-boot-service
  namespace: java-app
spec:
  selector:
    app: spring-boot-app
  ports:
  - port: 80
    targetPort: 8080
  type: LoadBalancer
```

## Framework-Specific Guides

### Spring Boot

**Auto-Instrumentation Coverage:**
- Spring Web MVC controllers
- Spring WebFlux (reactive)
- Spring Data JPA/JDBC
- RestTemplate and WebClient
- Spring Kafka
- Spring RabbitMQ
- Spring Cloud Gateway
- Spring Security

**application.yml Configuration:**
```yaml
spring:
  application:
    name: my-spring-boot-app
  
management:
  endpoints:
    web:
      exposure:
        include: health,metrics,prometheus
  metrics:
    export:
      prometheus:
        enabled: true
    distribution:
      percentiles-histogram:
        http.server.requests: true

# OpenTelemetry-specific (when using spring-cloud-starter-sleuth-otel)
spring:
  sleuth:
    otel:
      config:
        trace-id-ratio-based: 1.0
      exporter:
        otlp:
          endpoint: http://localhost:4317
```

**Controller with Custom Spans:**
```java
package com.example.controller;

import io.opentelemetry.api.trace.Span;
import io.opentelemetry.api.trace.Tracer;
import io.opentelemetry.context.Scope;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/api/v1/products")
public class ProductController {
    
    private final Tracer tracer;
    private final ProductService productService;
    
    @Autowired
    public ProductController(Tracer tracer, ProductService productService) {
        this.tracer = tracer;
        this.productService = productService;
    }
    
    @GetMapping("/{id}")
    public Product getProduct(@PathVariable String id) {
        Span span = tracer.spanBuilder("getProduct")
            .setAttribute("product.id", id)
            .startSpan();
        
        try (Scope scope = span.makeCurrent()) {
            Product product = productService.findById(id);
            span.setAttribute("product.category", product.getCategory());
            span.setAttribute("product.price", product.getPrice());
            return product;
        } finally {
            span.end();
        }
    }
    
    @PostMapping
    public Product createProduct(@RequestBody ProductRequest request) {
        // Automatically instrumented - no manual span needed
        return productService.createProduct(request);
    }
}
```

### Quarkus

**Maven Dependencies:**
```xml
<dependencies>
    <!-- Quarkus OpenTelemetry -->
    <dependency>
        <groupId>io.quarkus</groupId>
        <artifactId>quarkus-opentelemetry</artifactId>
    </dependency>
    
    <dependency>
        <groupId>io.quarkus</groupId>
        <artifactId>quarkus-opentelemetry-exporter-otlp</artifactId>
    </dependency>
</dependencies>
```

**application.properties:**
```properties
quarkus.application.name=my-quarkus-app

# OpenTelemetry Configuration
quarkus.otel.exporter.otlp.endpoint=http://localhost:4317
quarkus.otel.traces.enabled=true
quarkus.otel.metrics.enabled=true
quarkus.otel.traces.sampler=parentbased_traceidratio
quarkus.otel.traces.sampler.arg=1.0

# Resource attributes
quarkus.otel.resource.attributes=service.namespace=production,deployment.environment=eks
```

**Quarkus REST Resource:**
```java
package com.example.quarkus;

import io.opentelemetry.api.trace.Span;
import io.opentelemetry.api.trace.Tracer;
import io.opentelemetry.instrumentation.annotations.WithSpan;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

@Path("/api/users")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class UserResource {
    
    @Inject
    Tracer tracer;
    
    @Inject
    UserService userService;
    
    @GET
    @Path("/{id}")
    @WithSpan("getUserById")  // Automatic span creation
    public User getUser(@PathParam("id") String id) {
        Span currentSpan = Span.current();
        currentSpan.setAttribute("user.id", id);
        
        return userService.findById(id);
    }
    
    @POST
    @WithSpan("createUser")
    public User createUser(UserRequest request) {
        return userService.createUser(request);
    }
}
```

### Micronaut

**build.gradle:**
```gradle
dependencies {
    implementation("io.micronaut:micronaut-tracing-opentelemetry")
    implementation("io.micronaut.tracing:micronaut-tracing-opentelemetry-http")
    implementation("io.opentelemetry:opentelemetry-exporter-otlp")
}
```

**application.yml:**
```yaml
micronaut:
  application:
    name: my-micronaut-app

otel:
  traces:
    exporter: otlp
  exporter:
    otlp:
      endpoint: http://localhost:4317
  resource:
    attributes:
      service.name: my-micronaut-app
      service.namespace: production
```

## Database Instrumentation

### JDBC Auto-Instrumentation
Automatically captures:
- Query text and parameters
- Connection pool metrics
- Query execution time
- Database type and version

**Supported Databases:**
- PostgreSQL
- MySQL/MariaDB
- Oracle
- SQL Server
- MongoDB
- DynamoDB
- Redis

### JPA/Hibernate Custom Spans
```java
package com.example.repository;

import io.opentelemetry.api.trace.Span;
import io.opentelemetry.api.trace.Tracer;
import io.opentelemetry.instrumentation.annotations.WithSpan;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Repository;

@Repository
public class OrderRepository {
    
    private final EntityManager entityManager;
    private final Tracer tracer;
    
    @WithSpan("complexOrderQuery")
    public List<Order> findOrdersWithDetails(String customerId, LocalDate startDate) {
        Span span = Span.current();
        span.setAttribute("customer.id", customerId);
        span.setAttribute("query.date_range.start", startDate.toString());
        
        String jpql = "SELECT o FROM Order o " +
                     "JOIN FETCH o.items " +
                     "WHERE o.customerId = :customerId " +
                     "AND o.orderDate >= :startDate";
        
        List<Order> orders = entityManager
            .createQuery(jpql, Order.class)
            .setParameter("customerId", customerId)
            .setParameter("startDate", startDate)
            .getResultList();
        
        span.setAttribute("result.count", orders.size());
        return orders;
    }
}
```

## Asynchronous Processing

### CompletableFuture Tracing
```java
package com.example.async;

import io.opentelemetry.api.trace.Span;
import io.opentelemetry.api.trace.Tracer;
import io.opentelemetry.context.Context;
import io.opentelemetry.context.Scope;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

@Service
public class AsyncService {
    
    private final Tracer tracer;
    
    @Async
    public CompletableFuture<String> processAsync(String data) {
        // Capture current context
        Context context = Context.current();
        
        return CompletableFuture.supplyAsync(() -> {
            // Propagate context to async thread
            try (Scope scope = context.makeCurrent()) {
                Span span = tracer.spanBuilder("asyncProcessing")
                    .setAttribute("data.size", data.length())
                    .startSpan();
                
                try (Scope spanScope = span.makeCurrent()) {
                    // Async work
                    String result = expensiveOperation(data);
                    span.setAttribute("result.size", result.length());
                    return result;
                } finally {
                    span.end();
                }
            }
        });
    }
    
    private String expensiveOperation(String data) {
        // Simulated expensive operation
        return data.toUpperCase();
    }
}
```

### Spring @Async with Context Propagation
```java
package com.example.config;

import io.opentelemetry.context.Context;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.task.TaskDecorator;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;

@Configuration
@EnableAsync
public class AsyncConfig {
    
    @Bean(name = "taskExecutor")
    public Executor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5);
        executor.setMaxPoolSize(10);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("async-");
        
        // Propagate OpenTelemetry context
        executor.setTaskDecorator(new ContextPropagatingTaskDecorator());
        
        executor.initialize();
        return executor;
    }
    
    private static class ContextPropagatingTaskDecorator implements TaskDecorator {
        @Override
        public Runnable decorate(Runnable runnable) {
            Context context = Context.current();
            return () -> {
                try (io.opentelemetry.context.Scope scope = context.makeCurrent()) {
                    runnable.run();
                }
            };
        }
    }
}
```

## Custom Metrics

```java
package com.example.metrics;

import io.opentelemetry.api.OpenTelemetry;
import io.opentelemetry.api.common.Attributes;
import io.opentelemetry.api.metrics.LongCounter;
import io.opentelemetry.api.metrics.Meter;
import io.opentelemetry.api.metrics.LongHistogram;
import org.springframework.stereotype.Component;

@Component
public class BusinessMetrics {
    
    private final LongCounter orderCounter;
    private final LongHistogram orderValue;
    private final LongCounter errorCounter;
    
    public BusinessMetrics(OpenTelemetry openTelemetry) {
        Meter meter = openTelemetry.getMeter("business-metrics");
        
        orderCounter = meter
            .counterBuilder("orders.processed")
            .setDescription("Number of orders processed")
            .setUnit("orders")
            .build();
        
        orderValue = meter
            .histogramBuilder("orders.value")
            .setDescription("Order value distribution")
            .setUnit("USD")
            .ofLongs()
            .build();
        
        errorCounter = meter
            .counterBuilder("orders.errors")
            .setDescription("Number of order processing errors")
            .setUnit("errors")
            .build();
    }
    
    public void recordOrder(String orderType, long value) {
        Attributes attributes = Attributes.builder()
            .put("order.type", orderType)
            .build();
        
        orderCounter.add(1, attributes);
        orderValue.record(value, attributes);
    }
    
    public void recordError(String errorType) {
        Attributes attributes = Attributes.builder()
            .put("error.type", errorType)
            .build();
        
        errorCounter.add(1, attributes);
    }
}
```

## Performance Best Practices

### JVM Tuning for Observability
```bash
# Recommended JVM flags for production
JAVA_OPTS="-XX:+UseG1GC \
           -XX:MaxGCPauseMillis=200 \
           -XX:InitiatingHeapOccupancyPercent=45 \
           -Xms2g -Xmx2g \
           -XX:+HeapDumpOnOutOfMemoryError \
           -XX:HeapDumpPath=/var/log/heapdump.hprof \
           -Djava.security.egd=file:/dev/urandom"

# OpenTelemetry-specific
OTEL_OPTS="-Dotel.traces.sampler=parentbased_traceidratio \
           -Dotel.traces.sampler.arg=0.1 \
           -Dotel.metric.export.interval=60000 \
           -Dotel.bsp.schedule.delay=5000 \
           -Dotel.bsp.max.queue.size=2048 \
           -Dotel.bsp.max.export.batch.size=512"
```

### Sampling Strategies
```java
// Custom sampler for production
import io.opentelemetry.sdk.trace.samplers.Sampler;

public class ProductionSampler {
    public static Sampler create() {
        return Sampler.parentBasedBuilder(
            Sampler.traceIdRatioBased(0.1) // Sample 10% of traces
        )
        .setRemoteParentSampled(Sampler.alwaysOn())  // Always sample if parent sampled
        .setRemoteParentNotSampled(Sampler.alwaysOff()) // Never sample if parent not sampled
        .build();
    }
}
```

### Reducing Overhead
- Use batch span processor (default)
- Implement sampling at ingestion
- Disable SQL parameter capture in production
- Use async exporters
- Tune batch size and delays

## Troubleshooting

### Common Issues

**1. Traces Not Appearing**
```bash
# Check ADOT collector logs
kubectl logs -n observability deployment/adot-collector

# Verify Java agent is loaded
java -javaagent:/opt/aws-opentelemetry-agent.jar -version

# Check environment variables
env | grep OTEL
```

**2. High Memory Usage**
```bash
# Monitor Java heap
jmap -heap <pid>

# Check span queue size
jcmd <pid> VM.flags | grep otel

# Reduce batch size
export OTEL_BSP_MAX_QUEUE_SIZE=512
export OTEL_BSP_MAX_EXPORT_BATCH_SIZE=128
```

**3. Missing Database Spans**
```yaml
# Enable JDBC instrumentation explicitly
environment:
  - name: OTEL_INSTRUMENTATION_JDBC_ENABLED
    value: "true"
  - name: OTEL_INSTRUMENTATION_JDBC_STATEMENT_SANITIZER_ENABLED
    value: "true"
```

### Debug Logging
```java
// application.properties
logging.level.io.opentelemetry=DEBUG
logging.level.com.amazonaws.xray=DEBUG

# Or via environment
export OTEL_LOG_LEVEL=DEBUG
```

## Migration from X-Ray SDK

```java
// Before (X-Ray SDK)
import com.amazonaws.xray.AWSXRay;
import com.amazonaws.xray.entities.Subsegment;

Subsegment subsegment = AWSXRay.beginSubsegment("myOperation");
try {
    // operation
    subsegment.putAnnotation("userId", userId);
} finally {
    AWSXRay.endSubsegment();
}

// After (OpenTelemetry)
import io.opentelemetry.api.trace.Span;
import io.opentelemetry.api.trace.Tracer;

Span span = tracer.spanBuilder("myOperation").startSpan();
try (Scope scope = span.makeCurrent()) {
    // operation
    span.setAttribute("userId", userId);
} finally {
    span.end();
}
```

## Next Steps

- Explore [Spring Boot example](/examples/java-spring-boot)
- Review [Cost optimization strategies](/cost-optimization/)
- Learn about [Transaction Search](/implementation/transaction-search)
- Check [Configuration reference](/configuration/reference)

## Additional Resources

- [AWS Distro for OpenTelemetry - Java](https://aws-otel.github.io/docs/getting-started/java-sdk)
- [OpenTelemetry Java Documentation](https://opentelemetry.io/docs/instrumentation/java/)
- [Spring Boot OpenTelemetry Integration](https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html#actuator.metrics.export.otlp)
