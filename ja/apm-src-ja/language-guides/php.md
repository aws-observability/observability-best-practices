---
title: "PHP Implementation Guide"
description: "Complete guide to instrumenting PHP applications with AWS Application Signals across Lambda, ECS, and EKS environments"
readingTime: "12 min"
lastUpdated: "2026-01-29"
tags: ["php", "laravel", "symfony", "instrumentation", "lambda", "ecs", "eks"]
relatedPages:
  - "/language-guides/"
  - "/getting-started/quick-start"
---

# PHP Implementation Guide

Complete guide to instrumenting PHP applications with AWS Application Signals using OpenTelemetry, covering Laravel, Symfony, and other popular frameworks.

## Quick Start

### Prerequisites
- PHP 8.1+ (PHP 8.3+ recommended)
- Composer for dependency management
- AWS credentials configured

### Installation Time Estimates
- **AWS Lambda**: 15-20 minutes
- **Amazon ECS**: 30-40 minutes
- **Amazon EKS**: 45-55 minutes

## Platform-Specific Implementation

### AWS Lambda

#### Using Bref for PHP Lambda

**composer.json:**
```json
{
    "require": {
        "bref/bref": "^2.1",
        "bref/extra-php-extensions": "^1.0",
        "open-telemetry/sdk": "^1.0",
        "open-telemetry/exporter-otlp": "^1.0",
        "open-telemetry/contrib-auto-http": "^0.0.7",
        "aws/aws-sdk-php": "^3.290"
    },
    "autoload": {
        "psr-4": {
            "App\\": "src/"
        }
    }
}
```

**serverless.yml:**
```yaml
service: php-lambda-app

provider:
  name: aws
  region: us-east-1
  runtime: provided.al2
  environment:
    OTEL_SERVICE_NAME: php-lambda
    OTEL_TRACES_SAMPLER: xray
    OTEL_EXPORTER_OTLP_ENDPOINT: http://localhost:4317

functions:
  api:
    handler: handler.php
    layers:
      - ${bref:layer.php-83}
      - ${bref:extra.xray}
      - arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-collector-amd64-ver-0-90-1:1
    events:
      - httpApi: '*'
    environment:
      AWS_LAMBDA_EXEC_WRAPPER: /opt/otel-handler

plugins:
  - ./vendor/bref/bref
  - ./vendor/bref/extra-php-extensions
```

**handler.php:**
```php
<?php

use Bref\Context\Context;
use Bref\Event\Http\HttpRequestEvent;
use Bref\Event\Http\HttpResponse;
use OpenTelemetry\API\Globals;
use OpenTelemetry\API\Trace\SpanKind;
use OpenTelemetry\API\Trace\StatusCode;
use OpenTelemetry\SDK\Trace\TracerProviderFactory;
use OpenTelemetry\Contrib\Otlp\SpanExporter;
use OpenTelemetry\SDK\Trace\SpanProcessor\BatchSpanProcessor;

require __DIR__ . '/vendor/autoload.php';

// Initialize OpenTelemetry
$tracerProvider = (new TracerProviderFactory())->create();
$exporter = new SpanExporter(
    transport: (new \OpenTelemetry\Contrib\Otlp\GrpcTransportFactory())->create(
        endpoint: getenv('OTEL_EXPORTER_OTLP_ENDPOINT') ?: 'http://localhost:4317'
    )
);
$tracerProvider->addSpanProcessor(new BatchSpanProcessor($exporter));
Globals::registerTracerProvider($tracerProvider);

$tracer = Globals::tracerProvider()->getTracer('php-lambda');

return function (HttpRequestEvent $event, Context $context) use ($tracer) {
    // Create span for request
    $span = $tracer->spanBuilder('handleRequest')
        ->setSpanKind(SpanKind::KIND_SERVER)
        ->startSpan();
    
    $scope = $span->activate();
    
    try {
        $span->setAttribute('faas.execution', $context->getRequestId());
        $span->setAttribute('faas.id', $context->getInvokedFunctionArn());
        $span->setAttribute('http.method', $event->getMethod());
        $span->setAttribute('http.path', $event->getPath());
        
        // Parse request body
        $body = json_decode($event->getBody(), true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new \InvalidArgumentException('Invalid JSON');
        }
        
        // Process request
        $result = processOrder($tracer, $body);
        
        $span->setAttribute('order.id', $result['orderId']);
        $span->setStatus(StatusCode::STATUS_OK);
        
        return new HttpResponse(
            json_encode($result),
            ['Content-Type' => 'application/json'],
            200
        );
        
    } catch (\Throwable $e) {
        $span->recordException($e);
        $span->setStatus(StatusCode::STATUS_ERROR, $e->getMessage());
        
        return new HttpResponse(
            json_encode(['error' => $e->getMessage()]),
            ['Content-Type' => 'application/json'],
            500
        );
    } finally {
        $span->end();
        $scope->detach();
    }
};

function processOrder($tracer, array $data): array
{
    $span = $tracer->spanBuilder('processOrder')
        ->startSpan();
    
    $scope = $span->activate();
    
    try {
        $span->setAttribute('order.amount', $data['amount'] ?? 0);
        $span->setAttribute('customer.id', $data['customerId'] ?? '');
        
        // Validate
        if (($data['amount'] ?? 0) <= 0) {
            throw new \InvalidArgumentException('Amount must be positive');
        }
        
        // Simulated processing
        usleep(50000); // 50ms
        
        $orderId = uniqid('order_', true);
        $span->setAttribute('order.id', $orderId);
        
        return [
            'orderId' => $orderId,
            'customerId' => $data['customerId'],
            'amount' => $data['amount'],
            'status' => 'processed'
        ];
        
    } finally {
        $span->end();
        $scope->detach();
    }
}
```

### Amazon ECS

#### Dockerfile

```dockerfile
FROM php:8.3-fpm-alpine

# Install system dependencies
RUN apk add --no-cache \
    nginx \
    supervisor \
    postgresql-dev \
    libzip-dev \
    unzip \
    git \
    curl

# Install PHP extensions
RUN docker-php-ext-install \
    pdo \
    pdo_pgsql \
    opcache \
    zip

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy application files
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-scripts

COPY . .

RUN composer dump-autoload --optimize

# Configure nginx
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Optimize PHP for production
RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"

EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
```

**composer.json:**
```json
{
    "require": {
        "php": "^8.3",
        "laravel/framework": "^11.0",
        "open-telemetry/sdk": "^1.0",
        "open-telemetry/exporter-otlp": "^1.0",
        "open-telemetry/opentelemetry-auto-laravel": "^0.0.15",
        "open-telemetry/contrib-instrumentation-pdo": "^0.0.2"
    }
}
```

**bootstrap/app.php (Laravel 11):**
```php
<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use OpenTelemetry\API\Globals;
use OpenTelemetry\SDK\Trace\TracerProviderFactory;
use OpenTelemetry\Contrib\Otlp\SpanExporter;
use OpenTelemetry\SDK\Trace\SpanProcessor\BatchSpanProcessor;
use OpenTelemetry\SDK\Resource\ResourceInfo;
use OpenTelemetry\SDK\Resource\ResourceInfoFactory;
use OpenTelemetry\SemConv\ResourceAttributes;

// Initialize OpenTelemetry
$resource = ResourceInfoFactory::emptyResource()->merge(ResourceInfo::create([
    ResourceAttributes::SERVICE_NAME => env('OTEL_SERVICE_NAME', 'laravel-app'),
    ResourceAttributes::SERVICE_VERSION => '1.0.0',
    ResourceAttributes::SERVICE_NAMESPACE => env('SERVICE_NAMESPACE', 'production'),
    ResourceAttributes::DEPLOYMENT_ENVIRONMENT => env('DEPLOYMENT_ENVIRONMENT', 'ecs'),
]));

$exporter = new SpanExporter(
    transport: (new \OpenTelemetry\Contrib\Otlp\GrpcTransportFactory())->create(
        endpoint: env('OTEL_EXPORTER_OTLP_ENDPOINT', 'http://localhost:4317')
    )
);

$tracerProvider = (new TracerProviderFactory())->create(
    spanProcessors: [new BatchSpanProcessor($exporter)],
    resource: $resource
);

Globals::registerTracerProvider($tracerProvider);

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->append(\OpenTelemetry\Contrib\Instrumentation\Laravel\Middlewares\Trace::class);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
```

**ECS Task Definition:**
```json
{
  "family": "php-laravel-task",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "containerDefinitions": [
    {
      "name": "laravel-app",
      "image": "my-laravel-app:latest",
      "portMappings": [
        {
          "containerPort": 80,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "APP_ENV",
          "value": "production"
        },
        {
          "name": "OTEL_SERVICE_NAME",
          "value": "laravel-app"
        },
        {
          "name": "OTEL_EXPORTER_OTLP_ENDPOINT",
          "value": "http://localhost:4317"
        },
        {
          "name": "SERVICE_NAMESPACE",
          "value": "production"
        },
        {
          "name": "DEPLOYMENT_ENVIRONMENT",
          "value": "ecs"
        }
      ],
      "dependsOn": [
        {
          "containerName": "aws-otel-collector",
          "condition": "START"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/laravel-app",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    },
    {
      "name": "aws-otel-collector",
      "image": "public.ecr.aws/aws-observability/aws-otel-collector:latest",
      "command": ["--config=/etc/ecs/ecs-default-config.yaml"],
      "environment": [
        {
          "name": "AWS_REGION",
          "value": "us-east-1"
        }
      ]
    }
  ]
}
```

#### Laravel Controller with Custom Spans

**app/Http/Controllers/OrderController.php:**
```php
<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Services\PaymentService;
use Illuminate\Http\Request;
use OpenTelemetry\API\Globals;
use OpenTelemetry\API\Trace\SpanKind;
use OpenTelemetry\API\Trace\StatusCode;

class OrderController extends Controller
{
    private $tracer;
    
    public function __construct(
        private PaymentService $paymentService
    ) {
        $this->tracer = Globals::tracerProvider()->getTracer('laravel-app');
    }
    
    public function show(string $id)
    {
        $span = $this->tracer->spanBuilder('getOrder')
            ->setSpanKind(SpanKind::KIND_SERVER)
            ->startSpan();
        
        $scope = $span->activate();
        
        try {
            $span->setAttribute('order.id', $id);
            $span->setAttribute('http.method', request()->method());
            $span->setAttribute('http.route', request()->route()->uri());
            
            $order = Order::find($id);
            
            if (!$order) {
                $span->setAttribute('order.found', false);
                $span->setStatus(StatusCode::STATUS_ERROR, 'Order not found');
                
                return response()->json(['error' => 'Order not found'], 404);
            }
            
            $span->setAttribute('order.found', true);
            $span->setAttribute('order.status', $order->status);
            $span->setAttribute('order.amount', $order->amount);
            
            return response()->json($order);
            
        } catch (\Throwable $e) {
            $span->recordException($e);
            $span->setStatus(StatusCode::STATUS_ERROR, $e->getMessage());
            
            return response()->json(['error' => $e->getMessage()], 500);
        } finally {
            $span->end();
            $scope->detach();
        }
    }
    
    public function store(Request $request)
    {
        $span = $this->tracer->spanBuilder('createOrder')
            ->setSpanKind(SpanKind::KIND_SERVER)
            ->startSpan();
        
        $scope = $span->activate();
        
        try {
            $validated = $request->validate([
                'customer_id' => 'required|string',
                'amount' => 'required|numeric|min:0.01',
                'items' => 'required|array',
            ]);
            
            $span->setAttribute('customer.id', $validated['customer_id']);
            $span->setAttribute('order.amount', $validated['amount']);
            $span->setAttribute('order.item_count', count($validated['items']));
            
            // Process payment
            $paymentResult = $this->processPayment($validated);
            $span->setAttribute('payment.transaction_id', $paymentResult['transaction_id']);
            
            // Create order
            $order = Order::create([
                'customer_id' => $validated['customer_id'],
                'amount' => $validated['amount'],
                'items' => json_encode($validated['items']),
                'status' => 'confirmed',
                'transaction_id' => $paymentResult['transaction_id'],
            ]);
            
            $span->setAttribute('order.id', $order->id);
            $span->setAttribute('order.status', $order->status);
            $span->setStatus(StatusCode::STATUS_OK);
            
            return response()->json($order, 201);
            
        } catch (\Throwable $e) {
            $span->recordException($e);
            $span->setStatus(StatusCode::STATUS_ERROR, $e->getMessage());
            
            return response()->json(['error' => $e->getMessage()], 422);
        } finally {
            $span->end();
            $scope->detach();
        }
    }
    
    private function processPayment(array $data): array
    {
        $span = $this->tracer->spanBuilder('processPayment')
            ->startSpan();
        
        $scope = $span->activate();
        
        try {
            $span->setAttribute('payment.amount', $data['amount']);
            
            $result = $this->paymentService->process($data);
            
            $span->setAttribute('payment.success', true);
            
            return $result;
        } finally {
            $span->end();
            $scope->detach();
        }
    }
}
```

**app/Models/Order.php:**
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OpenTelemetry\API\Globals;

class Order extends Model
{
    protected $fillable = [
        'customer_id',
        'amount',
        'items',
        'status',
        'transaction_id',
    ];
    
    protected $casts = [
        'items' => 'array',
        'amount' => 'decimal:2',
    ];
    
    public static function findWithDetails(string $orderId): ?self
    {
        $tracer = Globals::tracerProvider()->getTracer('order-model');
        
        $span = $tracer->spanBuilder('findOrderWithDetails')
            ->startSpan();
        
        $scope = $span->activate();
        
        try {
            $span->setAttribute('db.operation', 'SELECT');
            $span->setAttribute('db.table', 'orders');
            $span->setAttribute('order.id', $orderId);
            
            $order = self::with('customer', 'items')->find($orderId);
            
            $span->setAttribute('order.found', $order !== null);
            
            if ($order) {
                $span->setAttribute('order.item_count', $order->items->count());
            }
            
            return $order;
        } finally {
            $span->end();
            $scope->detach();
        }
    }
}
```

### Amazon EKS

#### Deployment Configuration

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: php-apps

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: laravel-app
  namespace: php-apps
spec:
  replicas: 3
  selector:
    matchLabels:
      app: laravel-app
  template:
    metadata:
      labels:
        app: laravel-app
    spec:
      serviceAccountName: laravel-app-sa
      containers:
      - name: app
        image: my-laravel-app:latest
        ports:
        - containerPort: 80
          name: http
        env:
        - name: APP_ENV
          value: production
        - name: APP_KEY
          valueFrom:
            secretKeyRef:
              name: laravel-secrets
              key: app-key
        - name: OTEL_SERVICE_NAME
          value: laravel-app
        - name: OTEL_EXPORTER_OTLP_ENDPOINT
          value: http://adot-collector.observability:4317
        - name: SERVICE_NAMESPACE
          value: production
        - name: DEPLOYMENT_ENVIRONMENT
          value: eks
        - name: DB_CONNECTION
          value: pgsql
        - name: DB_HOST
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: host
        - name: DB_DATABASE
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: database
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /up
            port: 80
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /up
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: laravel-app-service
  namespace: php-apps
spec:
  selector:
    app: laravel-app
  ports:
  - port: 80
    targetPort: 80
  type: LoadBalancer
```

## Framework-Specific Guides

### Symfony

**config/packages/opentelemetry.yaml:**
```yaml
open_telemetry:
  service_name: '%env(OTEL_SERVICE_NAME)%'
  exporter:
    otlp:
      endpoint: '%env(OTEL_EXPORTER_OTLP_ENDPOINT)%'
  resource:
    attributes:
      service.name: '%env(OTEL_SERVICE_NAME)%'
      service.version: '1.0.0'
      service.namespace: '%env(SERVICE_NAMESPACE)%'
  instrumentation:
    doctrine: true
    http_client: true
```

**src/Controller/ApiController.php:**
```php
<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use OpenTelemetry\API\Globals;

#[Route('/api')]
class ApiController extends AbstractController
{
    private $tracer;
    
    public function __construct()
    {
        $this->tracer = Globals::tracerProvider()->getTracer('symfony-app');
    }
    
    #[Route('/products/{id}', methods: ['GET'])]
    public function getProduct(string $id): JsonResponse
    {
        $span = $this->tracer->spanBuilder('getProduct')
            ->startSpan();
        
        $scope = $span->activate();
        
        try {
            $span->setAttribute('product.id', $id);
            
            $product = $this->fetchProduct($id);
            
            $span->setAttribute('product.found', $product !== null);
            
            return $this->json($product);
        } finally {
            $span->end();
            $scope->detach();
        }
    }
    
    private function fetchProduct(string $id): ?array
    {
        $span = $this->tracer->spanBuilder('database.fetchProduct')
            ->startSpan();
        
        $scope = $span->activate();
        
        try {
            $span->setAttribute('db.operation', 'SELECT');
            
            // Database query logic
            return [
                'id' => $id,
                'name' => 'Product Name',
                'price' => 99.99
            ];
        } finally {
            $span->end();
            $scope->detach();
        }
    }
}
```

## Database Instrumentation

### PDO Auto-Instrumentation

**composer.json:**
```json
{
    "require": {
        "open-telemetry/contrib-instrumentation-pdo": "^0.0.2"
    }
}
```

**Auto-instrumented PDO:**
```php
<?php

use OpenTelemetry\Contrib\Instrumentation\Pdo\PdoInstrumentation;

// Register PDO instrumentation
PdoInstrumentation::register();

// PDO calls are now automatically traced
$pdo = new PDO('pgsql:host=localhost;dbname=mydb', 'user', 'password');
$stmt = $pdo->prepare('SELECT * FROM orders WHERE customer_id = ?');
$stmt->execute([$customerId]);
$orders = $stmt->fetchAll();
```

### Eloquent (Laravel)

```php
<?php

// Eloquent queries are automatically instrumented
use App\Models\Order;

// Automatically traced
$orders = Order::where('customer_id', $customerId)
    ->with('items')
    ->orderBy('created_at', 'desc')
    ->get();
```

## HTTP Client Instrumentation

### Guzzle

**composer.json:**
```json
{
    "require": {
        "guzzlehttp/guzzle": "^7.8",
        "open-telemetry/contrib-auto-guzzle": "^0.0.3"
    }
}
```

**Usage:**
```php
<?php

use GuzzleHttp\Client;
use OpenTelemetry\Contrib\Instrumentation\Guzzle\GuzzleInstrumentation;

// Register Guzzle instrumentation
GuzzleInstrumentation::register();

$client = new Client();

// Automatically traced
$response = $client->get('https://api.example.com/data');
```

## Background Jobs

### Laravel Queue

**app/Jobs/ProcessOrder.php:**
```php
<?php

namespace App\Jobs;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use OpenTelemetry\API\Globals;
use OpenTelemetry\API\Trace\StatusCode;

class ProcessOrder implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    
    public function __construct(
        private string $orderId
    ) {}
    
    public function handle(): void
    {
        $tracer = Globals::tracerProvider()->getTracer('queue-worker');
        
        $span = $tracer->spanBuilder('processOrderJob')
            ->startSpan();
        
        $scope = $span->activate();
        
        try {
            $span->setAttribute('order.id', $this->orderId);
            $span->setAttribute('job.name', self::class);
            $span->setAttribute('job.queue', $this->queue);
            
            $order = Order::find($this->orderId);
            
            // Process order
            $this->validateOrder($tracer, $order);
            $this->chargePayment($tracer, $order);
            $this->sendConfirmation($tracer, $order);
            
            $span->setAttribute('job.status', 'completed');
            $span->setStatus(StatusCode::STATUS_OK);
            
        } catch (\Throwable $e) {
            $span->recordException($e);
            $span->setStatus(StatusCode::STATUS_ERROR, $e->getMessage());
            throw $e;
        } finally {
            $span->end();
            $scope->detach();
        }
    }
    
    private function validateOrder($tracer, Order $order): void
    {
        $span = $tracer->spanBuilder('validateOrder')->startSpan();
        $scope = $span->activate();
        
        try {
            // Validation logic
            if ($order->amount <= 0) {
                throw new \Exception('Invalid order amount');
            }
            
            $span->setAttribute('validation.passed', true);
        } finally {
            $span->end();
            $scope->detach();
        }
    }
    
    private function chargePayment($tracer, Order $order): void
    {
        $span = $tracer->spanBuilder('chargePayment')->startSpan();
        $scope = $span->activate();
        
        try {
            // Payment processing logic
            $span->setAttribute('payment.amount', $order->amount);
        } finally {
            $span->end();
            $scope->detach();
        }
    }
    
    private function sendConfirmation($tracer, Order $order): void
    {
        $span = $tracer->spanBuilder('sendConfirmation')->startSpan();
        $scope = $span->activate();
        
        try {
            // Email sending logic
            $span->setAttribute('email.sent', true);
        } finally {
            $span->end();
            $scope->detach();
        }
    }
}
```

## Custom Metrics

```php
<?php

namespace App\Services;

use OpenTelemetry\API\Globals;
use OpenTelemetry\API\Metrics\CounterInterface;
use OpenTelemetry\API\Metrics\HistogramInterface;

class BusinessMetrics
{
    private CounterInterface $ordersProcessed;
    private HistogramInterface $orderValue;
    
    public function __construct()
    {
        $meter = Globals::meterProvider()->getMeter('business-metrics');
        
        $this->ordersProcessed = $meter->createCounter(
            'orders.processed',
            'orders',
            'Number of orders processed'
        );
        
        $this->orderValue = $meter->createHistogram(
            'orders.value',
            'USD',
            'Order value distribution'
        );
    }
    
    public function recordOrder(string $orderType, float $value): void
    {
        $this->ordersProcessed->add(1, [
            'order.type' => $orderType
        ]);
        
        $this->orderValue->record($value, [
            'order.type' => $orderType
        ]);
    }
}
```

## Performance Best Practices

### OpCache Configuration

**php.ini:**
```ini
[opcache]
opcache.enable=1
opcache.memory_consumption=256
opcache.interned_strings_buffer=16
opcache.max_accelerated_files=20000
opcache.validate_timestamps=0
opcache.revalidate_freq=0
opcache.fast_shutdown=1
```

### Batch Span Processing

```php
<?php

use OpenTelemetry\SDK\Trace\SpanProcessor\BatchSpanProcessor;

$processor = new BatchSpanProcessor(
    $exporter,
    maxQueueSize: 2048,
    scheduledDelayMillis: 5000,
    exportTimeoutMillis: 30000,
    maxExportBatchSize: 512
);
```

## Troubleshooting

### Enable Debug Logging

**.env:**
```
OTEL_LOG_LEVEL=debug
OTEL_PHP_TRACES_PROCESSOR=batch
```

### Check Loaded Extensions

```php
<?php
var_dump(extension_loaded('opentelemetry'));
var_dump(get_loaded_extensions());
```

### Verify Spans

```bash
# Enable verbose logging
export OTEL_LOG_LEVEL=debug
php artisan serve
```

## Next Steps

- Review [Cost optimization strategies](/cost-optimization/)
- Learn about [Transaction Search](/implementation/transaction-search)
- Check [Configuration reference](/configuration/reference)

## Additional Resources

- [OpenTelemetry PHP Documentation](https://opentelemetry.io/docs/instrumentation/php/)
- [AWS Distro for OpenTelemetry](https://aws-otel.github.io/)
- [Laravel OpenTelemetry Package](https://github.com/open-telemetry/opentelemetry-php-contrib/tree/main/src/Instrumentation/Laravel)
