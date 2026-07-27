---
title: "Python Instrumentation Guide"
description: "Complete guide to instrumenting Python applications with CloudWatch APM"
audience: ["developer"]
difficulty: "intermediate"
category: "implementation"
tags: ["python", "django", "flask", "fastapi", "instrumentation"]
estimatedReadTime: 15
lastUpdated: "2026-01-26"
relatedPages: ["language-guides", "examples/python"]
---

# Python Instrumentation Guide

Comprehensive guide for implementing CloudWatch APM in Python applications. Covers automatic instrumentation, manual instrumentation, and framework-specific configurations for Django, Flask, FastAPI, and more.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Automatic Instrumentation](#automatic-instrumentation)
- [Manual Instrumentation](#manual-instrumentation)
- [Framework Guides](#framework-guides)
- [Configuration](#configuration)
- [Best Practices](#best-practices)

---

## Prerequisites

- **Python**: 3.7 or higher
- **pip**: Package installer for Python
- **AWS Account**: With CloudWatch access
- **AWS Credentials**: Configured via AWS CLI, environment variables, or IAM roles

## Quick Start

### 1. Install Dependencies

```bash
# Install OpenTelemetry distribution
pip install opentelemetry-distro[otlp]

# Bootstrap auto-instrumentation
opentelemetry-bootstrap -a install
```

### 2. Configure Environment Variables

```bash
export OTEL_SERVICE_NAME="my-python-app"
export OTEL_TRACES_EXPORTER="otlp"
export OTEL_METRICS_EXPORTER="otlp"
export OTEL_EXPORTER_OTLP_ENDPOINT="http://localhost:4317"
export OTEL_RESOURCE_ATTRIBUTES="deployment.environment=production"
```

### 3. Run Your Application

```bash
# With auto-instrumentation
opentelemetry-instrument python app.py

# Or set it in your code
python app.py
```

---

## Automatic Instrumentation

Automatic instrumentation provides zero-code observability for popular Python libraries and frameworks.

### Supported Libraries

The Python OpenTelemetry distribution automatically instruments:

- **Web Frameworks**: Flask, Django, FastAPI, Pyramid, Tornado, Starlette
- **HTTP Clients**: requests, urllib, urllib3, httpx, aiohttp
- **Databases**: psycopg2, mysql-connector, pymongo, redis, SQLAlchemy
- **Message Queues**: celery, kafka-python, pika (RabbitMQ)
- **AWS Services**: boto3, botocore
- **Others**: grpc, jinja2, logging

### Installation

```bash
# Install the distro with OTLP support
pip install opentelemetry-distro[otlp]

# Bootstrap will install instrumentation libraries
opentelemetry-bootstrap -a install
```

### Running with Auto-Instrumentation

```bash
# Method 1: Using opentelemetry-instrument
opentelemetry-instrument \
  --traces_exporter otlp \
  --metrics_exporter otlp \
  --service_name my-python-app \
  python app.py

# Method 2: Using environment variables
export OTEL_SERVICE_NAME="my-python-app"
export OTEL_TRACES_EXPORTER="otlp"
opentelemetry-instrument python app.py
```

---

## Manual Instrumentation

For custom business logic, use manual instrumentation to create custom spans and metrics.

### Basic Setup

```python
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.resources import Resource

# Configure resource with service information
resource = Resource(attributes={
    "service.name": "my-python-app",
    "service.version": "1.0.0",
    "deployment.environment": "production"
})

# Create tracer provider
tracer_provider = TracerProvider(resource=resource)

# Configure OTLP exporter
otlp_exporter = OTLPSpanExporter(
    endpoint="http://localhost:4317",
    insecure=True
)

# Add span processor
tracer_provider.add_span_processor(
    BatchSpanProcessor(otlp_exporter)
)

# Set global tracer provider
trace.set_tracer_provider(tracer_provider)

# Get tracer for your application
tracer = trace.get_tracer(__name__)
```

### Creating Spans

```python
from opentelemetry import trace

tracer = trace.get_tracer(__name__)

# Basic span
with tracer.start_as_current_span("process_order") as span:
    # Your business logic
    order_id = process_order()
    
    # Add attributes
    span.set_attribute("order.id", order_id)
    span.set_attribute("order.amount", 99.99)
    span.set_attribute("customer.tier", "premium")

# Nested spans
with tracer.start_as_current_span("checkout") as parent_span:
    parent_span.set_attribute("cart.items", 3)
    
    with tracer.start_as_current_span("validate_payment"):
        validate_payment()
    
    with tracer.start_as_current_span("process_shipment"):
        process_shipment()
```

### Adding Events and Errors

```python
from opentelemetry import trace
from opentelemetry.trace import Status, StatusCode

tracer = trace.get_tracer(__name__)

with tracer.start_as_current_span("risky_operation") as span:
    try:
        # Add event
        span.add_event("Starting database transaction")
        
        # Your operation
        result = perform_database_operation()
        
        span.add_event("Transaction completed", {
            "rows_affected": result.row_count
        })
        
    except Exception as e:
        # Record exception
        span.record_exception(e)
        span.set_status(Status(StatusCode.ERROR, str(e)))
        raise
```

### Custom Metrics

```python
from opentelemetry import metrics
from opentelemetry.sdk.metrics import MeterProvider
from opentelemetry.sdk.metrics.export import PeriodicExportingMetricReader
from opentelemetry.exporter.otlp.proto.grpc.metric_exporter import OTLPMetricExporter

# Setup metrics
metric_exporter = OTLPMetricExporter(endpoint="http://localhost:4317")
metric_reader = PeriodicExportingMetricReader(metric_exporter)
meter_provider = MeterProvider(metric_readers=[metric_reader])
metrics.set_meter_provider(meter_provider)

# Get meter
meter = metrics.get_meter(__name__)

# Create instruments
request_counter = meter.create_counter(
    "http.server.requests",
    description="Total HTTP requests",
    unit="1"
)

request_duration = meter.create_histogram(
    "http.server.duration",
    description="HTTP request duration",
    unit="ms"
)

# Use metrics
request_counter.add(1, {"method": "GET", "endpoint": "/api/users"})
request_duration.record(125.5, {"method": "GET", "status": "200"})
```

---

## Framework Guides

### Django

#### Installation

```bash
pip install opentelemetry-distro[otlp]
pip install opentelemetry-instrumentation-django
```

#### Configuration

```python
# settings.py

# Add to INSTALLED_APPS
INSTALLED_APPS = [
    # ... other apps
]

# Add OpenTelemetry middleware
MIDDLEWARE = [
    'opentelemetry.instrumentation.django.middleware.otel_middleware',
    # ... other middleware
]

# Configure OpenTelemetry
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.instrumentation.django import DjangoInstrumentor
from opentelemetry.sdk.resources import Resource

resource = Resource(attributes={
    "service.name": "django-app",
    "service.version": "1.0.0"
})

tracer_provider = TracerProvider(resource=resource)
trace.set_tracer_provider(tracer_provider)

otlp_exporter = OTLPSpanExporter(endpoint="http://localhost:4317")
tracer_provider.add_span_processor(BatchSpanProcessor(otlp_exporter))

# Instrument Django
DjangoInstrumentor().instrument()
```

#### Custom Instrumentation

```python
# views.py
from opentelemetry import trace
from django.http import JsonResponse

tracer = trace.get_tracer(__name__)

def user_profile(request, user_id):
    with tracer.start_as_current_span("fetch_user_profile") as span:
        span.set_attribute("user.id", user_id)
        
        # Your view logic
        user = get_user(user_id)
        
        span.set_attribute("user.tier", user.tier)
        
        return JsonResponse({"user": user.to_dict()})
```

---

### Flask

#### Installation

```bash
pip install opentelemetry-distro[otlp]
pip install opentelemetry-instrumentation-flask
```

#### Basic Setup

```python
from flask import Flask
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.instrumentation.flask import FlaskInstrumentor
from opentelemetry.sdk.resources import Resource

# Initialize Flask app
app = Flask(__name__)

# Configure OpenTelemetry
resource = Resource(attributes={
    "service.name": "flask-app",
    "service.version": "1.0.0"
})

tracer_provider = TracerProvider(resource=resource)
trace.set_tracer_provider(tracer_provider)

otlp_exporter = OTLPSpanExporter(endpoint="http://localhost:4317")
tracer_provider.add_span_processor(BatchSpanProcessor(otlp_exporter))

# Instrument Flask
FlaskInstrumentor().instrument_app(app)

@app.route('/api/orders')
def get_orders():
    return {"orders": []}

if __name__ == '__main__':
    app.run()
```

#### Adding Custom Spans

```python
from opentelemetry import trace

tracer = trace.get_tracer(__name__)

@app.route('/api/process', methods=['POST'])
def process_data():
    with tracer.start_as_current_span("process_user_data") as span:
        data = request.get_json()
        span.set_attribute("data.size", len(data))
        
        # Process data
        result = perform_processing(data)
        
        span.set_attribute("processing.duration_ms", result.duration)
        
        return {"status": "success", "result": result}
```

---

### FastAPI

#### Installation

```bash
pip install opentelemetry-distro[otlp]
pip install opentelemetry-instrumentation-fastapi
```

#### Setup

```python
from fastapi import FastAPI
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.sdk.resources import Resource

# Initialize FastAPI app
app = FastAPI()

# Configure OpenTelemetry
resource = Resource(attributes={
    "service.name": "fastapi-app",
    "service.version": "1.0.0"
})

tracer_provider = TracerProvider(resource=resource)
trace.set_tracer_provider(tracer_provider)

otlp_exporter = OTLPSpanExporter(endpoint="http://localhost:4317")
tracer_provider.add_span_processor(BatchSpanProcessor(otlp_exporter))

# Instrument FastAPI
FastAPIInstrumentor.instrument_app(app)

@app.get("/api/users/{user_id}")
async def get_user(user_id: int):
    return {"user_id": user_id}
```

#### Async Instrumentation

```python
from opentelemetry import trace
import asyncio

tracer = trace.get_tracer(__name__)

@app.post("/api/async-process")
async def async_process():
    with tracer.start_as_current_span("async_operation"):
        # Async operations are automatically traced
        result1 = await fetch_data_async()
        result2 = await process_data_async(result1)
        
        return {"result": result2}
```

---

## Configuration

### Environment Variables

```bash
# Service identification
export OTEL_SERVICE_NAME="my-python-app"
export OTEL_SERVICE_VERSION="1.0.0"

# Exporters
export OTEL_TRACES_EXPORTER="otlp"
export OTEL_METRICS_EXPORTER="otlp"
export OTEL_LOGS_EXPORTER="otlp"

# OTLP endpoint
export OTEL_EXPORTER_OTLP_ENDPOINT="http://localhost:4317"
export OTEL_EXPORTER_OTLP_PROTOCOL="grpc"

# Resource attributes
export OTEL_RESOURCE_ATTRIBUTES="deployment.environment=production,team=backend"

# Sampling
export OTEL_TRACES_SAMPLER="parentbased_traceidratio"
export OTEL_TRACES_SAMPLER_ARG="0.1"  # 10% sampling

# Propagators
export OTEL_PROPAGATORS="tracecontext,baggage,xray"
```

### Programmatic Configuration

```python
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor, ConsoleSpanExporter
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.trace.sampling import ParentBasedTraceIdRatio
from opentelemetry.sdk.resources import Resource

# Custom sampling
sampler = ParentBasedTraceIdRatio(0.1)  # 10% sampling

# Resource configuration
resource = Resource(attributes={
    "service.name": "my-python-app",
    "service.version": "1.0.0",
    "service.namespace": "production",
    "deployment.environment": "production",
    "cloud.provider": "aws",
    "cloud.region": "us-east-1"
})

# Create tracer provider
tracer_provider = TracerProvider(
    resource=resource,
    sampler=sampler
)

# Add exporters
otlp_exporter = OTLPSpanExporter(
    endpoint="http://localhost:4317",
    insecure=True
)
tracer_provider.add_span_processor(BatchSpanProcessor(otlp_exporter))

# Set global provider
trace.set_tracer_provider(tracer_provider)
```

---

## Best Practices

### 1. Use Context Managers

Always use context managers for spans to ensure proper cleanup:

```python
with tracer.start_as_current_span("operation"):
    # Your code here
    pass
```

### 2. Add Meaningful Attributes

```python
span.set_attribute("user.id", user_id)
span.set_attribute("order.total", order.total)
span.set_attribute("payment.method", "credit_card")
span.set_attribute("custom.business_metric", value)
```

### 3. Use Semantic Conventions

Follow OpenTelemetry semantic conventions:

```python
from opentelemetry.semconv.trace import SpanAttributes

span.set_attribute(SpanAttributes.HTTP_METHOD, "GET")
span.set_attribute(SpanAttributes.HTTP_URL, request.url)
span.set_attribute(SpanAttributes.HTTP_STATUS_CODE, 200)
span.set_attribute(SpanAttributes.DB_SYSTEM, "postgresql")
span.set_attribute(SpanAttributes.DB_STATEMENT, query)
```

### 4. Handle Errors Properly

```python
try:
    result = risky_operation()
except Exception as e:
    span = trace.get_current_span()
    span.record_exception(e)
    span.set_status(Status(StatusCode.ERROR, str(e)))
    raise
```

### 5. Configure Appropriate Sampling

```python
# Production: Use adaptive sampling
from opentelemetry.sdk.trace.sampling import ParentBasedTraceIdRatio
sampler = ParentBasedTraceIdRatio(0.1)  # 10% sampling

# Development: Sample everything
from opentelemetry.sdk.trace.sampling import AlwaysOn
sampler = AlwaysOn()
```

### 6. Use Batch Processing

```python
# Batch export for better performance
from opentelemetry.sdk.trace.export import BatchSpanProcessor

processor = BatchSpanProcessor(
    otlp_exporter,
    max_queue_size=2048,
    schedule_delay_millis=5000,
    max_export_batch_size=512
)
```

---

## Troubleshooting

### No Traces Appearing

1. **Check exporter endpoint**:
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

2. **Verify AWS credentials**:
```bash
aws sts get-caller-identity
```

3. **Test OTLP endpoint**:
```bash
telnet localhost 4317
```

### Performance Issues

1. **Reduce sampling rate**:
```bash
export OTEL_TRACES_SAMPLER_ARG="0.01"  # 1% sampling
```

2. **Adjust batch processor**:
```python
processor = BatchSpanProcessor(
    exporter,
    max_queue_size=512,  # Reduce from default 2048
    schedule_delay_millis=10000  # Increase from 5000
)
```

### Import Errors

```bash
# Reinstall with all dependencies
pip uninstall opentelemetry-distro
pip install opentelemetry-distro[otlp] --force-reinstall
```

---

## Next Steps

- **[View Python Examples](../examples/python.md)**
- **[Configure Dashboards](../monitoring/dashboards.md)**
- **[Set Up Alerts](../monitoring/alerts.md)**
- **[Optimize Costs](../cost-optimization/index.md)**
- **[Advanced Instrumentation](../implementation/advanced-instrumentation.md)**
