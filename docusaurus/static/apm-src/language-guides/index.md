
# Language-Specific Implementation Guides

Step-by-step implementation guides for AWS Application Signals and CloudWatch APM. Each guide provides complete deployment instructions with AWS CLI commands, no CDK required.

## Available Implementations



#### ☕ [Java](java-lambda.md)
Deploy Java Lambda functions with Application Signals auto-instrumentation using AWS Lambda layers.

**Time to complete:** 15-20 minutes

[**View Guide →**](java-lambda.md)

---

#### 🔷 [.NET](dotnet-lambda.md)
Deploy .NET Lambda functions with Application Signals using the AWS Lambda layer for OpenTelemetry.

**Time to complete:** 15-20 minutes

[**View Guide →**](dotnet-lambda.md)

---

#### 🐍 [Python](python-lambda.md)
Deploy Python Lambda functions with automatic Application Signals instrumentation via Lambda layers.

**Time to complete:** 15-20 minutes

[**View Guide →**](python-lambda.md)

---

#### 🟢 [Node.js](nodejs-lambda.md)
Deploy Node.js Lambda functions with AWS Application Signals using the official Lambda layer.

**Time to complete:** 15-20 minutes

[**View Guide →**](nodejs-lambda.md)

---

### 🐳 Amazon ECS

#### ☕ [Java](java-ecs.md)
Deploy Java Spring Boot applications on ECS Fargate with Application Signals. Pure AWS CLI approach.

**Time to complete:** 30-45 minutes

[**View Guide →**](java-ecs.md)

---

#### 🔷 [.NET](dotnet-ecs.md)
Deploy ASP.NET Core applications on ECS with Application Signals auto-instrumentation.

**Time to complete:** 30-45 minutes

[**View Guide →**](dotnet-ecs.md)

---

#### 🐍 [Python](python-ecs.md)
Deploy Python FastAPI/Flask applications on ECS Fargate with Application Signals.

**Time to complete:** 30-45 minutes

[**View Guide →**](python-ecs.md)

---

#### 🟢 [Node.js](nodejs-ecs.md)
Deploy Node.js Express applications on ECS with complete Application Signals setup.

**Time to complete:** 30-45 minutes

[**View Guide →**](nodejs-ecs.md)

---

### ☸️ Amazon EKS

#### ☕ [Java](java-eks.md)
Deploy Java microservices on EKS with Application Signals using ADOT Operator.

**Time to complete:** 45-60 minutes

[**View Guide →**](java-eks.md)

---

#### 🔷 [.NET](dotnet-eks.md)
Deploy .NET applications on EKS with Application Signals and automatic instrumentation.

**Time to complete:** 45-60 minutes

[**View Guide →**](dotnet-eks.md)

---

#### 🐍 [Python](python-eks.md)
Deploy Python applications on EKS with Application Signals using ADOT collector.

**Time to complete:** 45-60 minutes

[**View Guide →**](python-eks.md)

---

#### 🟢 [Node.js](nodejs-eks.md)
Deploy Node.js microservices on EKS with complete Application Signals instrumentation.

**Time to complete:** 45-60 minutes

[**View Guide →**](nodejs-eks.md)



---

## Implementation Comparison

| Platform | Complexity | Time to Deploy | Auto-Instrumentation | Agent Required |
|----------|-----------|----------------|---------------------|----------------|
| **Lambda** | Very Simple | 15-20 min | ✅ Full | ❌ No |
| **ECS** | Moderate | 30-45 min | ✅ Full | ✅ Yes (Sidecar) |
| **EKS** | Complex | 45-60 min | ✅ Full | ✅ Yes (DaemonSet) |
| **EC2** | Moderate | 30-40 min | ✅ Full | ✅ Yes (Agent) |

---

## What You'll Learn

Each guide covers:

### ✅ **Complete Setup**
- Prerequisites and required tools
- IAM roles and permissions
- AWS CLI commands (no CDK required)
- Architecture diagrams

### ✅ **Step-by-Step Instructions**
- Numbered steps with exact commands
- Environment variable configuration
- Task definitions and deployment specs
- Verification procedures

### ✅ **Application Signals Integration**
- Auto-instrumentation configuration
- ADOT collector/agent setup
- Trace and metric collection
- CloudWatch console verification

### ✅ **Testing & Verification**
- Generate traffic scripts
- Check metrics and traces
- Verify service discovery
- Console navigation

### ✅ **Troubleshooting**
- Common issues and solutions
- Debug commands
- Log inspection
- IAM permission fixes

---

## Prerequisites (All Guides)

### Required Tools
- **AWS CLI v2** (latest version)
- **AWS Account** with appropriate permissions
- **Docker** (for ECS/EKS guides)
- **kubectl** (for EKS guides only)
- Language-specific tools (JDK, Node.js, Python, .NET SDK)

### AWS Permissions Required
- **Lambda:** Function creation, layer attachment, CloudWatch
- **ECS:** Full ECS access, ECR, IAM, CloudWatch
- **EKS:** EKS cluster access, kubectl permissions, CloudWatch

### Knowledge Assumed
- Basic AWS CLI usage
- Basic Docker commands (for containers)
- Basic understanding of your platform (Lambda/ECS/EKS)
- Language-specific knowledge

---

## Quick Start by Use Case

### **I want the simplest setup**
→ Choose **Lambda** implementation for your language
- No containers, no agents, just add a layer
- 15 minutes to full Application Signals

### **I'm running microservices**
→ Choose **ECS** for managed containers
- Automatic scaling and load balancing
- 30 minutes to complete setup

### **I need Kubernetes**
→ Choose **EKS** for full K8s features
- ADOT Operator for auto-instrumentation
- 45 minutes with existing cluster

### **I have existing EC2 instances**
→ Choose **EC2** implementation
- Install agent on running instances
- 30 minutes per instance

---

## Getting Started

1. **Select Your Platform**
   - Lambda (simplest, fastest)
   - ECS (containerized apps)
   - EKS (Kubernetes workloads)
   - EC2 (traditional instances)

2. **Select Your Language**
   - Java (Spring Boot, Micronaut)
   - Python (Flask, FastAPI, Django)
   - Node.js (Express, NestJS)
   - .NET (ASP.NET Core)

3. **Follow the Guide**
   - Each step is numbered and tested
   - Copy-paste AWS CLI commands
   - Verify at each checkpoint

4. **View in Console**
   - Navigate to CloudWatch → Application Signals
   - See your service in the service map
   - Explore traces and metrics

---

## Key Features Across All Languages

### **Automatic Instrumentation**
All implementations provide zero-code instrumentation for:
- HTTP/HTTPS requests and responses
- Database queries (SQL, NoSQL)
- AWS SDK calls (S3, DynamoDB, SNS, SQS)
- Message queues (Kafka, RabbitMQ)
- External API calls
- Background jobs

### **AWS Application Signals**
Every implementation includes:
- **Service Discovery:** Automatic service detection
- **Service Maps:** Visual topology of dependencies
- **Metrics:** Latency, errors, faults per operation
- **Traces:** End-to-end distributed tracing
- **SLO Monitoring:** Track service level objectives
- **Anomaly Detection:** Automatic issue identification

### **CloudWatch Integration**
Seamless integration with:
- CloudWatch Metrics
- CloudWatch Logs
- X-Ray Traces
- CloudWatch Dashboards
- CloudWatch Alarms
- Container Insights (ECS/EKS)
- Lambda Insights (Lambda)

---

## Architecture Patterns

### **Lambda Architecture**
```
Lambda Function (your code)
  ↓
AWS Lambda Layer (ADOT)
  ↓
Application Signals
```

**Benefits:**
- No infrastructure management
- Automatic scaling
- Pay per invocation
- Simplest setup

---

### **ECS Architecture**
```
Task Definition:
  ├── Init Container (ADOT files)
  ├── CloudWatch Agent (sidecar)
  └── App Container (your code)
        ↓
Application Signals
```

**Benefits:**
- Managed container orchestration
- Auto-scaling
- Load balancer integration
- No Kubernetes complexity

---

### **EKS Architecture**
```
Namespace:
  ├── ADOT Operator (cluster-wide)
  ├── ADOT Collector (DaemonSet)
  └── Application Pods (auto-instrumented)
        ↓
Application Signals
```

**Benefits:**
- Full Kubernetes features
- Advanced orchestration
- Multi-tenant support
- Helm charts available

---

## Language-Specific Notes

### **Java**
- **Auto-Instrumentation:** Full support via javaagent
- **Frameworks:** Spring Boot, Micronaut, Quarkus, Jakarta EE
- **Agent Size:** ~12 MB
- **Performance Impact:** < 2%
- **Best For:** Enterprise applications, microservices

### **Python**
- **Auto-Instrumentation:** Full support via ADOT layer
- **Frameworks:** Flask, Django, FastAPI, Celery
- **Package Size:** ~8 MB
- **Performance Impact:** < 3%
- **Best For:** Data processing, web APIs, ML inference

### **Node.js**
- **Auto-Instrumentation:** Full support via require hook
- **Frameworks:** Express, NestJS, Fastify, Koa
- **Package Size:** ~5 MB
- **Performance Impact:** < 2%
- **Best For:** REST APIs, GraphQL, real-time apps

### **.NET**
- **Auto-Instrumentation:** Full support via profiler
- **Frameworks:** ASP.NET Core, Entity Framework, gRPC
- **Package Size:** ~10 MB
- **Performance Impact:** < 2%
- **Best For:** Enterprise apps, Windows workloads

---

## Common Configuration

### **Environment Variables (All Languages)**

```bash
# Service Identification
OTEL_SERVICE_NAME="my-service"
OTEL_RESOURCE_ATTRIBUTES="service.name=my-service,deployment.environment=production"

# Exporters
OTEL_EXPORTER_OTLP_ENDPOINT="http://localhost:4316"
OTEL_TRACES_EXPORTER="otlp"
OTEL_METRICS_EXPORTER="otlp"

# Sampling
OTEL_TRACES_SAMPLER="xray"
OTEL_TRACES_SAMPLER_ARG="endpoint=http://localhost:2000"

# Application Signals
OTEL_AWS_APPLICATION_SIGNALS_ENABLED="true"
OTEL_AWS_APPLICATION_SIGNALS_EXPORTER_ENDPOINT="http://localhost:4316/v1/metrics"
```

---

## Migration from Other APM Solutions

### **From Datadog**
- Similar service map visualization
- Comparable metric collection
- Lower cost at scale
- No agent per host (Lambda)

### **From New Relic**
- Native AWS integration
- Better Lambda support
- Automatic instrumentation
- Pay only for CloudWatch usage

### **From AppDynamics**
- Simpler deployment
- No license per server
- AWS-native architecture
- Faster time to value

---

## Cost Optimization

### **Sampling Strategies**
```bash
# Production: 10% sampling
OTEL_TRACES_SAMPLER_ARG="0.1"

# Development: 100% sampling
OTEL_TRACES_SAMPLER_ARG="1.0"

# Adaptive: X-Ray managed sampling
OTEL_TRACES_SAMPLER="xray"
```

### **Metric Reduction**
- Use metric filters in CloudWatch
- Set appropriate retention periods
- Archive old logs to S3
- Use CloudWatch Logs Insights for queries

---

## Support & Resources

### **Documentation**
- [AWS Application Signals Documentation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Monitoring-Sections.html)
- [ADOT Documentation](https://aws-otel.github.io/docs/introduction)
- [OpenTelemetry Specification](https://opentelemetry.io/docs/specs/otel/)

### **Code Examples**
- [AWS Samples Repository](https://github.com/aws-samples/)
- [ADOT Examples](https://github.com/aws-observability/aws-otel-community)

### **Support Channels**
- [AWS Support Console](https://console.aws.amazon.com/support/)
- [AWS re:Post](https://repost.aws/)
- [GitHub Issues](https://github.com/aws-observability/aws-otel-community/issues)

---

## Next Steps

1. **Choose your implementation guide** from the links above
2. **Follow the numbered steps** with AWS CLI commands
3. **Verify each checkpoint** before moving forward
4. **Generate test traffic** to populate metrics
5. **View in CloudWatch console** to see your service
6. **Set up dashboards and alarms** for monitoring
7. **Optimize sampling** based on traffic and cost

---

## What's Included in Each Guide

### 📋 **Prerequisites Section**
- Required tools checklist
- AWS permissions needed
- Knowledge assumptions
- Environment setup

### 🏗️ **Architecture Overview**
- Container architecture (ECS/EKS)
- Layer architecture (Lambda)
- Flow diagrams
- Component explanations

### 🔧 **Implementation Steps**
- Numbered, copy-paste commands
- IAM role creation
- Docker build and push (containers)
- Task/pod definition creation
- Service deployment

### ✅ **Verification Steps**
- Health check commands
- Metric verification
- Trace inspection
- Service discovery checks
- Console navigation

### 🐛 **Troubleshooting Section**
- Common error messages
- Debug commands
- Permission fixes
- Configuration issues

### 🧹 **Cleanup Instructions**
- Remove all created resources
- Delete IAM roles
- Clean up registries
- Cost prevention

---

## Success Criteria

After completing any guide, you should have:

✅ **Application deployed** on your chosen platform  
✅ **Application Signals enabled** with auto-instrumentation  
✅ **Service visible** in CloudWatch Application Signals console  
✅ **Metrics flowing** to CloudWatch (5-10 minutes after traffic)  
✅ **Traces available** in X-Ray console  
✅ **Service map displaying** dependencies correctly  
✅ **Operations tracked** per endpoint/function  

**Time to first trace:** 2-5 minutes after deployment  
**Time to service discovery:** 5-10 minutes after traffic generation

---

## Frequently Asked Questions

**Q: Do I need to modify my application code?**  
A: No! Auto-instrumentation works without code changes.

**Q: Which platform should I choose?**  
A: Lambda for simplest setup, ECS for managed containers, EKS for Kubernetes.

**Q: What's the performance impact?**  
A: < 3% overhead for most applications with recommended sampling.

**Q: Can I add custom metrics?**  
A: Yes! Each guide shows how to add custom spans and metrics.

**Q: How much does it cost?**  
A: Based on CloudWatch usage: logs, metrics, traces. Use sampling to control costs.

**Q: Is this production-ready?**  
A: Yes! All configurations follow AWS best practices.

**Q: Can I use this with existing applications?**  
A: Yes! Guides work with new or existing applications.

---

[**Select Your Implementation Guide Above ↑**](#available-implementations)
