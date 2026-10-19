---
title: "Node.js Instrumentation Guide"
description: "Complete guide to instrumenting Node.js and TypeScript applications with CloudWatch APM"
audience: ["developer"]
difficulty: "intermediate"
category: "implementation"
tags: ["nodejs", "typescript", "express", "nestjs", "instrumentation"]
estimatedReadTime: 15
lastUpdated: "2026-01-26"
relatedPages: ["language-guides", "examples/nodejs"]
---

# Node.js Instrumentation Guide

Comprehensive guide for implementing CloudWatch APM in Node.js and TypeScript applications. Covers automatic instrumentation, manual instrumentation, and framework-specific configurations for Express, NestJS, Fastify, and more.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Automatic Instrumentation](#automatic-instrumentation)
- [Manual Instrumentation](#manual-instrumentation)
- [Framework Guides](#framework-guides)
- [TypeScript Support](#typescript-support)
- [Best Practices](#best-practices)

---

## Prerequisites

- **Node.js**: 14.0 or higher (18.x LTS recommended)
- **npm/yarn**: Package manager
- **AWS Account**: With CloudWatch access
- **AWS Credentials**: Configured via AWS CLI, environment variables, or IAM roles

## Quick Start

### 1. Install Dependencies

```bash
# Using npm
npm install @opentelemetry/sdk-node \
  @opentelemetry/auto-instrumentations-node \
  @opentelemetry/exporter-trace-otlp-grpc \
  @opentelemetry/exporter-metrics-otlp-grpc

# Using yarn
yarn add @opentelemetry/sdk-node \
  @opentelemetry/auto-instrumentations-node \
  @opentelemetry/exporter-trace-otlp-grpc \
  @opentelemetry/exporter-metrics-otlp-grpc
```

### 2. Create Instrumentation File

Create `instrumentation.js` or `tracing.js`:

```javascript
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-grpc');
const { OTLPMetricExporter } = require('@opentelemetry/exporter-metrics-otlp-grpc');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');

const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'my-nodejs-app',
    [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
  }),
  traceExporter: new OTLPTraceExporter({
    url: 'http://localhost:4317',
  }),
  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({
      url: 'http://localhost:4317',
    }),
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();

// Graceful shutdown
process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch((error) => console.log('Error terminating tracing', error))
    .finally(() => process.exit(0));
});

module.exports = sdk;
```

### 3. Run Your Application

```bash
# Method 1: Require instrumentation file first
node -r ./instrumentation.js app.js

# Method 2: Import in your main file (at the very top)
# app.js:
require('./instrumentation');
const express = require('express');
// ... rest of your app
```

---

## Automatic Instrumentation

Automatic instrumentation provides zero-code observability for popular Node.js libraries.

### Supported Libraries

- **HTTP**: http, https, http2
- **Web Frameworks**: Express, Fastify, Koa, Hapi, NestJS
- **Databases**: pg (PostgreSQL), mysql, mongodb, redis, ioredis
- **ORMs**: Sequelize, TypeORM, Prisma, Mongoose
- **GraphQL**: @apollo/server, graphql
- **Message Queues**: amqplib (RabbitMQ), kafkajs
- **AWS SDK**: @aws-sdk/client-* (v3), aws-sdk (v2)
- **HTTP Clients**: axios, got, node-fetch, undici

### Installation

```bash
npm install @opentelemetry/auto-instrumentations-node
```

### Configuration

```javascript
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');

const sdk = new NodeSDK({
  instrumentations: [
    getNodeAutoInstrumentations({
      // Enable/disable specific instrumentations
      '@opentelemetry/instrumentation-fs': {
        enabled: false, // Disable filesystem instrumentation
      },
      '@opentelemetry/instrumentation-http': {
        enabled: true,
        requestHook: (span, request) => {
          span.setAttribute('custom.request.id', request.headers['x-request-id']);
        },
      },
      '@opentelemetry/instrumentation-express': {
        enabled: true,
        requestHook: (span, info) => {
          span.setAttribute('http.route', info.route);
        },
      },
    }),
  ],
});
```

---

## Manual Instrumentation

For custom business logic, use manual instrumentation to create custom spans and metrics.

### Basic Setup

```javascript
const { trace } = require('@opentelemetry/api');

// Get tracer
const tracer = trace.getTracer('my-app', '1.0.0');

// Create span
function processOrder(orderId) {
  return tracer.startActiveSpan('processOrder', (span) => {
    try {
      // Add attributes
      span.setAttribute('order.id', orderId);
      span.setAttribute('order.status', 'processing');
      
      // Your business logic
      const result = performProcessing(orderId);
      
      span.setAttribute('order.total', result.total);
      span.setStatus({ code: SpanStatusCode.OK });
      
      return result;
    } catch (error) {
      span.recordException(error);
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error.message,
      });
      throw error;
    } finally {
      span.end();
    }
  });
}
```

### Creating Nested Spans

```javascript
const { trace, SpanStatusCode } = require('@opentelemetry/api');

const tracer = trace.getTracer('my-app');

async function checkout(userId, cartId) {
  return tracer.startActiveSpan('checkout', async (parentSpan) => {
    try {
      parentSpan.setAttribute('user.id', userId);
      parentSpan.setAttribute('cart.id', cartId);
      
      // Nested span for payment
      const payment = await tracer.startActiveSpan('process-payment', async (paymentSpan) => {
        try {
          const result = await processPayment(cartId);
          paymentSpan.setAttribute('payment.amount', result.amount);
          paymentSpan.setAttribute('payment.method', result.method);
          return result;
        } finally {
          paymentSpan.end();
        }
      });
      
      // Nested span for inventory
      await tracer.startActiveSpan('update-inventory', async (inventorySpan) => {
        try {
          await updateInventory(cartId);
          inventorySpan.setAttribute('inventory.updated', true);
        } finally {
          inventorySpan.end();
        }
      });
      
      parentSpan.setStatus({ code: SpanStatusCode.OK });
      return { success: true, payment };
    } catch (error) {
      parentSpan.recordException(error);
      parentSpan.setStatus({ 
        code: SpanStatusCode.ERROR, 
        message: error.message 
      });
      throw error;
    } finally {
      parentSpan.end();
    }
  });
}
```

### Adding Events

```javascript
function processData(data) {
  return tracer.startActiveSpan('process-data', (span) => {
    try {
      span.addEvent('Processing started', {
        'data.size': data.length,
        'timestamp': new Date().toISOString(),
      });
      
      const result = transform(data);
      
      span.addEvent('Processing completed', {
        'result.size': result.length,
        'duration_ms': span.duration,
      });
      
      return result;
    } finally {
      span.end();
    }
  });
}
```

### Custom Metrics

```javascript
const { metrics } = require('@opentelemetry/api');

// Get meter
const meter = metrics.getMeter('my-app');

// Create instruments
const requestCounter = meter.createCounter('http.requests', {
  description: 'Total HTTP requests',
  unit: '1',
});

const requestDuration = meter.createHistogram('http.request.duration', {
  description: 'HTTP request duration',
  unit: 'ms',
});

const activeConnections = meter.createUpDownCounter('http.active_connections', {
  description: 'Active HTTP connections',
  unit: '1',
});

// Use metrics
function handleRequest(req, res) {
  const startTime = Date.now();
  activeConnections.add(1);
  
  requestCounter.add(1, {
    method: req.method,
    route: req.route.path,
  });
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    requestDuration.record(duration, {
      method: req.method,
      status: res.statusCode,
    });
    activeConnections.add(-1);
  });
}
```

---

## Framework Guides

### Express.js

#### Basic Setup

```javascript
// instrumentation.js - must be required FIRST
require('./tracing');

// app.js
const express = require('express');
const { trace, SpanStatusCode } = require('@opentelemetry/api');

const app = express();
const tracer = trace.getTracer('express-app');

app.use(express.json());

// Custom middleware with tracing
app.use((req, res, next) => {
  const span = trace.getActiveSpan();
  if (span) {
    span.setAttribute('custom.request.id', req.headers['x-request-id']);
    span.setAttribute('custom.user.agent', req.headers['user-agent']);
  }
  next();
});

// Route with custom span
app.get('/api/users/:id', async (req, res) => {
  return tracer.startActiveSpan('get-user', async (span) => {
    try {
      span.setAttribute('user.id', req.params.id);
      
      const user = await fetchUser(req.params.id);
      span.setAttribute('user.found', !!user);
      
      res.json({ user });
    } catch (error) {
      span.recordException(error);
      span.setStatus({ code: SpanStatusCode.ERROR });
      res.status(500).json({ error: error.message });
    } finally {
      span.end();
    }
  });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

#### Error Handling

```javascript
// Error handling middleware
app.use((err, req, res, next) => {
  const span = trace.getActiveSpan();
  if (span) {
    span.recordException(err);
    span.setStatus({
      code: SpanStatusCode.ERROR,
      message: err.message,
    });
  }
  
  res.status(500).json({ error: err.message });
});
```

---

### NestJS

#### Setup

```typescript
// main.ts
import './tracing'; // Must be first import
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
```

#### Service with Tracing

```typescript
// user.service.ts
import { Injectable } from '@nestjs/common';
import { trace, SpanStatusCode } from '@opentelemetry/api';

@Injectable()
export class UserService {
  private readonly tracer = trace.getTracer('user-service');

  async findUser(id: string) {
    return this.tracer.startActiveSpan('UserService.findUser', async (span) => {
      try {
        span.setAttribute('user.id', id);
        
        const user = await this.userRepository.findOne(id);
        span.setAttribute('user.found', !!user);
        
        return user;
      } catch (error) {
        span.recordException(error);
        span.setStatus({ code: SpanStatusCode.ERROR });
        throw error;
      } finally {
        span.end();
      }
    });
  }
}
```

#### Custom Decorator

```typescript
// tracing.decorator.ts
import { trace, SpanStatusCode } from '@opentelemetry/api';

export function Traced(spanName?: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    const tracer = trace.getTracer('app');

    descriptor.value = async function (...args: any[]) {
      const name = spanName || `${target.constructor.name}.${propertyKey}`;
      
      return tracer.startActiveSpan(name, async (span) => {
        try {
          const result = await originalMethod.apply(this, args);
          span.setStatus({ code: SpanStatusCode.OK });
          return result;
        } catch (error) {
          span.recordException(error);
          span.setStatus({ code: SpanStatusCode.ERROR });
          throw error;
        } finally {
          span.end();
        }
      });
    };

    return descriptor;
  };
}

// Usage
class OrderService {
  @Traced('process-order')
  async processOrder(orderId: string) {
    // Your logic
  }
}
```

---

### Fastify

#### Setup

```javascript
const fastify = require('fastify')();
const { trace } = require('@opentelemetry/api');

// Fastify is automatically instrumented
fastify.get('/api/users/:id', async (request, reply) => {
  const tracer = trace.getTracer('fastify-app');
  
  return tracer.startActiveSpan('fetch-user', async (span) => {
    try {
      span.setAttribute('user.id', request.params.id);
      
      const user = await getUser(request.params.id);
      
      return { user };
    } finally {
      span.end();
    }
  });
});

fastify.listen({ port: 3000 });
```

---

## TypeScript Support

### Setup with TypeScript

```typescript
// tracing.ts
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'my-typescript-app',
    [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
  }),
  traceExporter: new OTLPTraceExporter({
    url: 'http://localhost:4317',
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();

export default sdk;
```

### Usage in TypeScript

```typescript
import { trace, Span, SpanStatusCode } from '@opentelemetry/api';

interface Order {
  id: string;
  total: number;
  items: OrderItem[];
}

class OrderService {
  private tracer = trace.getTracer('order-service');

  async processOrder(orderId: string): Promise<Order> {
    return this.tracer.startActiveSpan(
      'OrderService.processOrder',
      async (span: Span) => {
        try {
          span.setAttribute('order.id', orderId);
          
          const order = await this.fetchOrder(orderId);
          span.setAttribute('order.total', order.total);
          span.setAttribute('order.items_count', order.items.length);
          
          span.setStatus({ code: SpanStatusCode.OK });
          return order;
        } catch (error) {
          span.recordException(error as Error);
          span.setStatus({ 
            code: SpanStatusCode.ERROR,
            message: (error as Error).message,
          });
          throw error;
        } finally {
          span.end();
        }
      }
    );
  }
}
```

---

## Best Practices

### 1. Initialize Tracing First

Always require/import tracing before any other modules:

```javascript
// ✅ Correct
require('./tracing');
const express = require('express');

// ❌ Wrong
const express = require('express');
require('./tracing');
```

### 2. Use Semantic Conventions

```javascript
const { SemanticAttributes } = require('@opentelemetry/semantic-conventions');

span.setAttribute(SemanticAttributes.HTTP_METHOD, 'GET');
span.setAttribute(SemanticAttributes.HTTP_STATUS_CODE, 200);
span.setAttribute(SemanticAttributes.DB_SYSTEM, 'postgresql');
```

### 3. Handle Async Operations

```javascript
// ✅ Correct - maintain context
async function process() {
  return tracer.startActiveSpan('operation', async (span) => {
    try {
      await asyncOperation();
    } finally {
      span.end();
    }
  });
}

// ❌ Wrong - context lost
async function process() {
  const span = tracer.startSpan('operation');
  await asyncOperation(); // Context not propagated
  span.end();
}
```

### 4. Configure Sampling

```javascript
const { ParentBasedSampler, TraceIdRatioBasedSampler } = require('@opentelemetry/sdk-trace-base');

const sdk = new NodeSDK({
  sampler: new ParentBasedSampler({
    root: new TraceIdRatioBasedSampler(0.1), // 10% sampling
  }),
});
```

### 5. Graceful Shutdown

```javascript
process.on('SIGTERM', async () => {
  try {
    await sdk.shutdown();
    console.log('Tracing shutdown complete');
  } catch (error) {
    console.error('Error during shutdown:', error);
  } finally {
    process.exit(0);
  }
});
```

---

## Troubleshooting

### Traces Not Appearing

1. **Check initialization order**:
```javascript
// Must be first
require('./tracing');
```

2. **Verify endpoint**:
```javascript
console.log(process.env.OTEL_EXPORTER_OTLP_ENDPOINT);
```

3. **Enable debug logging**:
```javascript
const { diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api');
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);
```

### Memory Leaks

1. **Limit batch size**:
```javascript
const { BatchSpanProcessor } = require('@opentelemetry/sdk-trace-base');

const processor = new BatchSpanProcessor(exporter, {
  maxQueueSize: 100,
  maxExportBatchSize: 10,
});
```

2. **Use appropriate sampling**:
```javascript
sampler: new TraceIdRatioBasedSampler(0.01), // 1% sampling
```

---

## Next Steps

- **[View Node.js Examples](../examples/nodejs.md)**
- **[TypeScript Configuration](typescript-config.md)**
- **[Performance Optimization](../performance/nodejs-optimization.md)**
- **[Monitoring Best Practices](../monitoring/best-practices.md)**
