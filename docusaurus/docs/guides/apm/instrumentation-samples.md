# Instrumentation Samples for Various Programming Languages

This section provides guidance for instrumenting applications with AWS Application Signals across different programming languages and frameworks.

## Demo Applications

- [Application Signals PetClinic Demo](https://github.com/aws-observability/application-signals-demo) - Multi-language Spring Boot microservices with comprehensive instrumentation examples
- [One Observability PetAdoptions Demo](https://github.com/aws-samples/one-observability-demo) - Full-stack application with Java, Python, .NET, Go, Rust, and Node.js services
- [CloudWatch Application Signals SkillBuilder Demo](https://github.com/aws-samples/sample-cloudwatch-application-signals-skillbuilder-demo) - Educational examples with step-by-step instrumentation guides

## Auto-Instrumentation

Auto-instrumentation provides zero-code observability by automatically detecting and instrumenting popular frameworks and libraries. This is the recommended approach for getting started quickly with Application Signals.

### Java Spring Boot Applications

**Reference Microservices:**
- **PetClinic Demo:**
  - [API Gateway Service](https://github.com/aws-observability/application-signals-demo/tree/main/spring-petclinic-api-gateway)
  - [Customers Service](https://github.com/aws-observability/application-signals-demo/tree/main/spring-petclinic-customers-service)
  - [Vets Service](https://github.com/aws-observability/application-signals-demo/tree/main/spring-petclinic-vets-service)
  - [Visits Service](https://github.com/aws-observability/application-signals-demo/tree/main/spring-petclinic-visits-service)
- **One Observability Demo:** [Pet Search Service (Java)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/microservices/petsearch-java)

### Python Applications

**Reference Microservices:**
- **One Observability Demo:**
  - [Pet List Adoptions Service (Python)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/microservices/petlistadoptions-py)
  - [Pet Food Agent - Strands (Python)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/microservices/petfoodagent-strands-py)

### Node.js Applications

**Reference Microservices:**
- **One Observability Demo (Lambda):**
  - [Pet Status Updater (Node.js Lambda)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/lambda/petstatusupdater-node)
  - [Pet Food Stock Processor (Node.js Lambda)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/lambda/petfood-stock-processor-node)
  - [Pet Food Cleanup Processor (Node.js Lambda)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/lambda/petfood-cleanup-processor-node)
  - [Traffic Generator (Node.js Lambda)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/lambda/traffic-generator-node)

### .NET Applications

**Reference Microservices:**
- **PetClinic Demo:** [Payment Service (.NET)](https://github.com/aws-observability/application-signals-demo/tree/main/dotnet-petclinic-payment)
- **One Observability Demo:** [Pet Site Service (.NET)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/microservices/petsite-net)


## Manual Instrumentation

Manual instrumentation involves complete end-to-end integration of OpenTelemetry SDKs without any auto-instrumentation agents. This approach provides maximum control over telemetry collection and is required for languages that don't support auto-instrumentation.

### Go Applications

**Reference Implementation:**
- [Pay for Adoption Service (Go)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/microservices/payforadoption-go)

### Rust Applications

**Reference Implementation:**
- [Pet Food Service (Rust)](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/microservices/petfood-rs)

## Combined Instrumentation (Auto + Manual)

Combined instrumentation uses auto-instrumentation agents for baseline telemetry while adding custom spans, attributes, and business context through manual instrumentation.

### Java Spring Boot - Custom Business Context with Auto-Instrumentation

**Reference Implementation:** [Customers Service](https://github.com/aws-observability/application-signals-demo/tree/main/spring-petclinic-customers-service) and [Pet Search Service](https://github.com/aws-samples/one-observability-demo/tree/main/src/applications/microservices/petsearch-java)

### Key Manual Instrumentation Best Practices

- **Business Context:** Always add relevant business attributes (customer_id, order_value, product_category) to spans
- **Error Handling:** Record exceptions and set appropriate span status codes
- **Custom Metrics:** Create business-specific metrics alongside technical metrics
- **Span Hierarchy:** Use child spans to break down complex operations
- **Attribute Naming:** Follow OpenTelemetry semantic conventions where possible
- **Performance Impact:** Be mindful of instrumentation overhead in high-throughput paths
