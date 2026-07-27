---
title: "Go Implementation Guide"
description: "Complete guide to instrumenting Go applications with AWS Application Signals across Lambda, ECS, and EKS environments"
readingTime: "12 min"
lastUpdated: "2026-01-29"
tags: ["go", "golang", "instrumentation", "lambda", "ecs", "eks"]
relatedPages:
  - "/language-guides/"
  - "/getting-started/quick-start"
---

# Go Implementation Guide

Complete guide to instrumenting Go applications with AWS Application Signals using OpenTelemetry, covering Gin, Echo, Chi, and other popular frameworks.

## Quick Start

### Prerequisites
- Go 1.20+ (Go 1.21+ recommended)
- AWS credentials configured
- Basic understanding of Go HTTP servers

### Installation Time Estimates
- **AWS Lambda**: 10-15 minutes
- **Amazon ECS**: 20-30 minutes
- **Amazon EKS**: 35-45 minutes

## Platform-Specific Implementation

### AWS Lambda

#### Using Lambda Layer
```bash
# Add ADOT Lambda Layer
aws lambda update-function-configuration \
  --function-name my-go-function \
  --layers arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-collector-amd64-ver-0-90-1:1 \
  --environment Variables="{
    AWS_LAMBDA_EXEC_WRAPPER=/opt/otel-handler,
    OTEL_SERVICE_NAME=my-go-service,
    OTEL_TRACES_SAMPLER=xray
  }"
```

#### Manual Instrumentation

**go.mod:**
```go
module myfunction

go 1.21

require (
    github.com/aws/aws-lambda-go v1.46.0
    github.com/aws/aws-xray-sdk-go v1.8.3
    go.opentelemetry.io/otel v1.21.0
    go.opentelemetry.io/otel/trace v1.21.0
    go.opentelemetry.io/otel/sdk v1.21.0
    go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracegrpc v1.21.0
    go.opentelemetry.io/contrib/instrumentation/github.com/aws/aws-lambda-go/otellambda v0.46.1
    go.opentelemetry.io/contrib/propagators/aws v1.21.1
)
```

**main.go:**
```go
package main

import (
    "context"
    "fmt"
    "log"
    "os"

    "github.com/aws/aws-lambda-go/lambda"
    "go.opentelemetry.io/contrib/instrumentation/github.com/aws/aws-lambda-go/otellambda"
    "go.opentelemetry.io/contrib/instrumentation/github.com/aws/aws-lambda-go/otellambda/xrayconfig"
    "go.opentelemetry.io/contrib/propagators/aws/xray"
    "go.opentelemetry.io/otel"
    "go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracegrpc"
    "go.opentelemetry.io/otel/sdk/resource"
    sdktrace "go.opentelemetry.io/otel/sdk/trace"
    semconv "go.opentelemetry.io/otel/semconv/v1.21.0"
    "go.opentelemetry.io/otel/trace"
    "google.golang.org/grpc"
    "google.golang.org/grpc/credentials/insecure"
)

var tracer trace.Tracer

func init() {
    ctx := context.Background()
    
    // Create OTLP exporter
    conn, err := grpc.DialContext(ctx, "localhost:4317",
        grpc.WithTransportCredentials(insecure.NewCredentials()),
        grpc.WithBlock(),
    )
    if err != nil {
        log.Fatalf("failed to create gRPC connection: %v", err)
    }
    
    exporter, err := otlptracegrpc.New(ctx, otlptracegrpc.WithGRPCConn(conn))
    if err != nil {
        log.Fatalf("failed to create trace exporter: %v", err)
    }
    
    // Create resource
    res, err := resource.New(ctx,
        resource.WithAttributes(
            semconv.ServiceName(getEnv("OTEL_SERVICE_NAME", "my-go-lambda")),
            semconv.ServiceVersion("1.0.0"),
        ),
    )
    if err != nil {
        log.Fatalf("failed to create resource: %v", err)
    }
    
    // Create tracer provider with X-Ray ID generator
    tp := sdktrace.NewTracerProvider(
        sdktrace.WithBatcher(exporter),
        sdktrace.WithResource(res),
        sdktrace.WithIDGenerator(xray.NewIDGenerator()),
    )
    
    otel.SetTracerProvider(tp)
    otel.SetTextMapPropagator(xray.Propagator{})
    
    tracer = otel.Tracer("my-lambda-function")
}

type OrderRequest struct {
    OrderID    string  `json:"orderId"`
    CustomerID string  `json:"customerId"`
    Amount     float64 `json:"amount"`
}

type OrderResponse struct {
    OrderID string `json:"orderId"`
    Status  string `json:"status"`
}

func HandleRequest(ctx context.Context, req OrderRequest) (*OrderResponse, error) {
    // Create custom span
    ctx, span := tracer.Start(ctx, "processOrder")
    defer span.End()
    
    span.SetAttributes(
        attribute.String("order.id", req.OrderID),
        attribute.String("customer.id", req.CustomerID),
        attribute.Float64("order.amount", req.Amount),
    )
    
    // Business logic
    if req.Amount <= 0 {
        span.SetStatus(codes.Error, "invalid amount")
        span.RecordError(fmt.Errorf("amount must be positive"))
        return nil, fmt.Errorf("amount must be positive")
    }
    
    // Process order
    result := processOrder(ctx, req)
    
    span.SetAttributes(
        attribute.String("result.status", result.Status),
    )
    
    return result, nil
}

func processOrder(ctx context.Context, req OrderRequest) *OrderResponse {
    _, span := tracer.Start(ctx, "validateAndProcess")
    defer span.End()
    
    // Validation and processing logic
    return &OrderResponse{
        OrderID: req.OrderID,
        Status:  "Processed",
    }
}

func main() {
    // Wrap handler with OTEL Lambda instrumentation
    lambda.Start(otellambda.InstrumentHandler(HandleRequest, xrayconfig.WithRecommendedOptions(tp)...))
}

func getEnv(key, fallback string) string {
    if value := os.Getenv(key); value != "" {
        return value
    }
    return fallback
}
```

### Amazon ECS

#### Dockerfile with ADOT Collector

```dockerfile
FROM golang:1.21-alpine AS builder

WORKDIR /app

# Copy go mod files
COPY go.mod go.sum ./
RUN go mod download

# Copy source
COPY . .

# Build
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

# Final image
FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /root/

COPY --from=builder /app/main .

# Install ADOT Collector (optional, can use sidecar instead)
# For auto-instrumentation, use environment variables

EXPOSE 8080

CMD ["./main"]
```

**ECS Task Definition:**
```json
{
  "family": "go-app-task",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "go-app",
      "image": "my-go-app:latest",
      "portMappings": [
        {
          "containerPort": 8080,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "OTEL_SERVICE_NAME",
          "value": "my-go-service"
        },
        {
          "name": "OTEL_EXPORTER_OTLP_ENDPOINT",
          "value": "localhost:4317"
        },
        {
          "name": "OTEL_TRACES_SAMPLER",
          "value": "parentbased_traceidratio"
        },
        {
          "name": "OTEL_TRACES_SAMPLER_ARG",
          "value": "1.0"
        },
        {
          "name": "OTEL_RESOURCE_ATTRIBUTES",
          "value": "service.namespace=production,deployment.environment=ecs"
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
          "awslogs-group": "/ecs/go-app",
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

#### Go HTTP Server with Instrumentation

**main.go:**
```go
package main

import (
    "context"
    "fmt"
    "log"
    "net/http"
    "os"
    "os/signal"
    "syscall"
    "time"

    "github.com/gin-gonic/gin"
    "go.opentelemetry.io/contrib/instrumentation/github.com/gin-gonic/gin/otelgin"
    "go.opentelemetry.io/otel"
    "go.opentelemetry.io/otel/attribute"
    "go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracegrpc"
    "go.opentelemetry.io/otel/propagation"
    "go.opentelemetry.io/otel/sdk/resource"
    sdktrace "go.opentelemetry.io/otel/sdk/trace"
    semconv "go.opentelemetry.io/otel/semconv/v1.21.0"
    "go.opentelemetry.io/otel/trace"
    "google.golang.org/grpc"
    "google.golang.org/grpc/credentials/insecure"
)

var tracer trace.Tracer

func initTracer() (*sdktrace.TracerProvider, error) {
    ctx := context.Background()
    
    // Create OTLP exporter
    endpoint := getEnv("OTEL_EXPORTER_OTLP_ENDPOINT", "localhost:4317")
    conn, err := grpc.DialContext(ctx, endpoint,
        grpc.WithTransportCredentials(insecure.NewCredentials()),
    )
    if err != nil {
        return nil, fmt.Errorf("failed to create gRPC connection: %w", err)
    }
    
    exporter, err := otlptracegrpc.New(ctx, otlptracegrpc.WithGRPCConn(conn))
    if err != nil {
        return nil, fmt.Errorf("failed to create trace exporter: %w", err)
    }
    
    // Create resource
    res, err := resource.New(ctx,
        resource.WithAttributes(
            semconv.ServiceName(getEnv("OTEL_SERVICE_NAME", "go-api")),
            semconv.ServiceVersion("1.0.0"),
            semconv.DeploymentEnvironment(getEnv("ENVIRONMENT", "production")),
        ),
    )
    if err != nil {
        return nil, fmt.Errorf("failed to create resource: %w", err)
    }
    
    // Create tracer provider
    tp := sdktrace.NewTracerProvider(
        sdktrace.WithBatcher(exporter,
            sdktrace.WithMaxExportBatchSize(512),
            sdktrace.WithBatchTimeout(5*time.Second),
        ),
        sdktrace.WithResource(res),
        sdktrace.WithSampler(sdktrace.ParentBased(sdktrace.TraceIDRatioBased(1.0))),
    )
    
    otel.SetTracerProvider(tp)
    otel.SetTextMapPropagator(propagation.NewCompositeTextMapPropagator(
        propagation.TraceContext{},
        propagation.Baggage{},
    ))
    
    tracer = otel.Tracer("go-api")
    
    return tp, nil
}

func main() {
    // Initialize tracer
    tp, err := initTracer()
    if err != nil {
        log.Fatalf("failed to initialize tracer: %v", err)
    }
    defer func() {
        if err := tp.Shutdown(context.Background()); err != nil {
            log.Printf("Error shutting down tracer provider: %v", err)
        }
    }()
    
    // Create Gin router
    router := gin.Default()
    
    // Add OpenTelemetry middleware
    router.Use(otelgin.Middleware("go-api"))
    
    // Routes
    router.GET("/health", healthHandler)
    router.GET("/api/orders/:id", getOrderHandler)
    router.POST("/api/orders", createOrderHandler)
    
    // Start server
    srv := &http.Server{
        Addr:    ":8080",
        Handler: router,
    }
    
    go func() {
        log.Println("Starting server on :8080")
        if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
            log.Fatalf("listen: %s\n", err)
        }
    }()
    
    // Graceful shutdown
    quit := make(chan os.Signal, 1)
    signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
    <-quit
    
    log.Println("Shutting down server...")
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()
    
    if err := srv.Shutdown(ctx); err != nil {
        log.Fatal("Server forced to shutdown:", err)
    }
    
    log.Println("Server exiting")
}

func healthHandler(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{"status": "healthy"})
}

func getOrderHandler(c *gin.Context) {
    ctx := c.Request.Context()
    orderID := c.Param("id")
    
    // Create custom span
    _, span := tracer.Start(ctx, "getOrder")
    defer span.End()
    
    span.SetAttributes(
        attribute.String("order.id", orderID),
    )
    
    // Fetch order (simulated)
    order := fetchOrder(ctx, orderID)
    
    if order == nil {
        span.SetAttributes(attribute.Bool("order.found", false))
        c.JSON(http.StatusNotFound, gin.H{"error": "order not found"})
        return
    }
    
    span.SetAttributes(
        attribute.Bool("order.found", true),
        attribute.String("order.status", order.Status),
        attribute.Float64("order.amount", order.Amount),
    )
    
    c.JSON(http.StatusOK, order)
}

func createOrderHandler(c *gin.Context) {
    ctx := c.Request.Context()
    
    var req OrderRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    
    // Create custom span
    _, span := tracer.Start(ctx, "createOrder")
    defer span.End()
    
    span.SetAttributes(
        attribute.String("customer.id", req.CustomerID),
        attribute.Float64("order.amount", req.Amount),
    )
    
    // Process order
    order, err := processOrderCreation(ctx, req)
    if err != nil {
        span.RecordError(err)
        span.SetStatus(codes.Error, err.Error())
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    
    span.SetAttributes(
        attribute.String("order.id", order.ID),
        attribute.String("order.status", order.Status),
    )
    
    c.JSON(http.StatusCreated, order)
}

func fetchOrder(ctx context.Context, orderID string) *Order {
    _, span := tracer.Start(ctx, "database.fetchOrder")
    defer span.End()
    
    span.SetAttributes(
        attribute.String("db.operation", "SELECT"),
        attribute.String("db.table", "orders"),
    )
    
    // Simulated database call
    time.Sleep(50 * time.Millisecond)
    
    return &Order{
        ID:         orderID,
        CustomerID: "customer-123",
        Amount:     99.99,
        Status:     "confirmed",
    }
}

func processOrderCreation(ctx context.Context, req OrderRequest) (*Order, error) {
    _, span := tracer.Start(ctx, "processOrderCreation")
    defer span.End()
    
    // Validate
    if err := validateOrder(ctx, req); err != nil {
        span.RecordError(err)
        return nil, err
    }
    
    // Create order
    order := &Order{
        ID:         generateOrderID(),
        CustomerID: req.CustomerID,
        Amount:     req.Amount,
        Status:     "pending",
    }
    
    // Save to database
    if err := saveOrder(ctx, order); err != nil {
        span.RecordError(err)
        return nil, err
    }
    
    return order, nil
}

func validateOrder(ctx context.Context, req OrderRequest) error {
    _, span := tracer.Start(ctx, "validateOrder")
    defer span.End()
    
    if req.Amount <= 0 {
        return fmt.Errorf("amount must be positive")
    }
    
    if req.CustomerID == "" {
        return fmt.Errorf("customer ID is required")
    }
    
    span.SetAttributes(attribute.Bool("validation.passed", true))
    return nil
}

func saveOrder(ctx context.Context, order *Order) error {
    _, span := tracer.Start(ctx, "database.saveOrder")
    defer span.End()
    
    span.SetAttributes(
        attribute.String("db.operation", "INSERT"),
        attribute.String("db.table", "orders"),
    )
    
    // Simulated database call
    time.Sleep(30 * time.Millisecond)
    
    return nil
}

type Order struct {
    ID         string  `json:"id"`
    CustomerID string  `json:"customerId"`
    Amount     float64 `json:"amount"`
    Status     string  `json:"status"`
}

type OrderRequest struct {
    CustomerID string  `json:"customerId"`
    Amount     float64 `json:"amount"`
}

func generateOrderID() string {
    return fmt.Sprintf("order-%d", time.Now().Unix())
}

func getEnv(key, fallback string) string {
    if value := os.Getenv(key); value != "" {
        return value
    }
    return fallback
}
```

### Amazon EKS

#### Deployment with ADOT Operator

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: go-apps

---
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
    
    processors:
      batch:
        timeout: 10s
      
      resourcedetection:
        detectors: [env, eks]
    
    exporters:
      awsxray:
        region: us-east-1
      
      awsemf:
        namespace: ApplicationSignals
        region: us-east-1
    
    service:
      pipelines:
        traces:
          receivers: [otlp]
          processors: [resourcedetection, batch]
          exporters: [awsxray]
        metrics:
          receivers: [otlp]
          processors: [resourcedetection, batch]
          exporters: [awsemf]

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: go-api
  namespace: go-apps
spec:
  replicas: 3
  selector:
    matchLabels:
      app: go-api
  template:
    metadata:
      labels:
        app: go-api
    spec:
      serviceAccountName: go-api-sa
      containers:
      - name: api
        image: my-go-api:latest
        ports:
        - containerPort: 8080
          name: http
        env:
        - name: OTEL_SERVICE_NAME
          value: go-api
        - name: OTEL_EXPORTER_OTLP_ENDPOINT
          value: adot-collector.observability:4317
        - name: OTEL_RESOURCE_ATTRIBUTES
          value: service.namespace=production,deployment.environment=eks
        - name: ENVIRONMENT
          value: production
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 10
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: go-api-service
  namespace: go-apps
spec:
  selector:
    app: go-api
  ports:
  - port: 80
    targetPort: 8080
  type: LoadBalancer
```

## Framework-Specific Guides

### Echo Framework

```go
package main

import (
    "github.com/labstack/echo/v4"
    "github.com/labstack/echo/v4/middleware"
    "go.opentelemetry.io/contrib/instrumentation/github.com/labstack/echo/otelecho"
    "go.opentelemetry.io/otel"
)

func main() {
    e := echo.New()
    
    // Middleware
    e.Use(middleware.Logger())
    e.Use(middleware.Recover())
    
    // OpenTelemetry middleware
    e.Use(otelecho.Middleware("echo-api"))
    
    // Routes
    e.GET("/api/users/:id", getUserHandler)
    
    e.Start(":8080")
}

func getUserHandler(c echo.Context) error {
    ctx := c.Request().Context()
    tracer := otel.Tracer("echo-api")
    
    _, span := tracer.Start(ctx, "getUserHandler")
    defer span.End()
    
    userID := c.Param("id")
    span.SetAttributes(attribute.String("user.id", userID))
    
    // Business logic
    user := fetchUser(ctx, userID)
    
    return c.JSON(200, user)
}
```

### Chi Router

```go
package main

import (
    "net/http"
    
    "github.com/go-chi/chi/v5"
    "github.com/go-chi/chi/v5/middleware"
    "go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp"
    "go.opentelemetry.io/otel"
)

func main() {
    r := chi.NewRouter()
    
    // Middleware
    r.Use(middleware.Logger)
    r.Use(middleware.Recoverer)
    
    // OpenTelemetry middleware
    r.Use(func(next http.Handler) http.Handler {
        return otelhttp.NewHandler(next, "chi-api")
    })
    
    // Routes
    r.Get("/api/products/{id}", getProductHandler)
    
    http.ListenAndServe(":8080", r)
}

func getProductHandler(w http.ResponseWriter, r *http.Request) {
    ctx := r.Context()
    tracer := otel.Tracer("chi-api")
    
    productID := chi.URLParam(r, "id")
    
    _, span := tracer.Start(ctx, "getProduct")
    defer span.End()
    
    span.SetAttributes(attribute.String("product.id", productID))
    
    // Business logic
    product := fetchProduct(ctx, productID)
    
    json.NewEncoder(w).Encode(product)
}
```

## Database Instrumentation

### SQL Database (using pgx for PostgreSQL)

```go
import (
    "github.com/jackc/pgx/v5/pgxpool"
    "go.opentelemetry.io/contrib/instrumentation/github.com/jackc/pgx/v5/otelpgx"
)

func initDB(ctx context.Context) (*pgxpool.Pool, error) {
    config, err := pgxpool.ParseConfig(os.Getenv("DATABASE_URL"))
    if err != nil {
        return nil, err
    }
    
    // Add OpenTelemetry tracer
    config.ConnConfig.Tracer = otelpgx.NewTracer()
    
    pool, err := pgxpool.NewWithConfig(ctx, config)
    if err != nil {
        return nil, err
    }
    
    return pool, nil
}

func queryOrders(ctx context.Context, db *pgxpool.Pool, customerID string) ([]Order, error) {
    _, span := tracer.Start(ctx, "queryOrders")
    defer span.End()
    
    span.SetAttributes(
        attribute.String("db.operation", "SELECT"),
        attribute.String("customer.id", customerID),
    )
    
    query := "SELECT id, customer_id, amount, status FROM orders WHERE customer_id = $1"
    
    rows, err := db.Query(ctx, query, customerID)
    if err != nil {
        span.RecordError(err)
        return nil, err
    }
    defer rows.Close()
    
    var orders []Order
    for rows.Next() {
        var order Order
        if err := rows.Scan(&order.ID, &order.CustomerID, &order.Amount, &order.Status); err != nil {
            span.RecordError(err)
            return nil, err
        }
        orders = append(orders, order)
    }
    
    span.SetAttributes(attribute.Int("result.count", len(orders)))
    
    return orders, nil
}
```

### MongoDB

```go
import (
    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
    "go.opentelemetry.io/contrib/instrumentation/go.mongodb.org/mongo-driver/mongo/otelmongo"
)

func initMongo(ctx context.Context) (*mongo.Client, error) {
    opts := options.Client()
    opts.ApplyURI(os.Getenv("MONGODB_URI"))
    
    // Add OpenTelemetry monitor
    opts.Monitor = otelmongo.NewMonitor()
    
    client, err := mongo.Connect(ctx, opts)
    if err != nil {
        return nil, err
    }
    
    return client, nil
}
```

## HTTP Client Instrumentation

```go
import (
    "go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp"
)

func createHTTPClient() *http.Client {
    return &http.Client{
        Transport: otelhttp.NewTransport(http.DefaultTransport),
        Timeout:   30 * time.Second,
    }
}

func callExternalAPI(ctx context.Context, client *http.Client) error {
    _, span := tracer.Start(ctx, "callExternalAPI")
    defer span.End()
    
    req, err := http.NewRequestWithContext(ctx, "GET", "https://api.example.com/data", nil)
    if err != nil {
        span.RecordError(err)
        return err
    }
    
    resp, err := client.Do(req)
    if err != nil {
        span.RecordError(err)
        return err
    }
    defer resp.Body.Close()
    
    span.SetAttributes(
        attribute.Int("http.status_code", resp.StatusCode),
    )
    
    return nil
}
```

## Custom Metrics

```go
import (
    "go.opentelemetry.io/otel/metric"
)

type Metrics struct {
    ordersProcessed metric.Int64Counter
    orderValue      metric.Float64Histogram
    activeOrders    metric.Int64UpDownCounter
}

func initMetrics(meter metric.Meter) (*Metrics, error) {
    ordersProcessed, err := meter.Int64Counter(
        "orders.processed",
        metric.WithDescription("Number of orders processed"),
        metric.WithUnit("{orders}"),
    )
    if err != nil {
        return nil, err
    }
    
    orderValue, err := meter.Float64Histogram(
        "orders.value",
        metric.WithDescription("Order value distribution"),
        metric.WithUnit("USD"),
    )
    if err != nil {
        return nil, err
    }
    
    activeOrders, err := meter.Int64UpDownCounter(
        "orders.active",
        metric.WithDescription("Number of active orders"),
        metric.WithUnit("{orders}"),
    )
    if err != nil {
        return nil, err
    }
    
    return &Metrics{
        ordersProcessed: ordersProcessed,
        orderValue:      orderValue,
        activeOrders:    activeOrders,
    }, nil
}

func (m *Metrics) RecordOrder(ctx context.Context, orderType string, value float64) {
    attrs := attribute.NewSet(
        attribute.String("order.type", orderType),
    )
    
    m.ordersProcessed.Add(ctx, 1, metric.WithAttributeSet(attrs))
    m.orderValue.Record(ctx, value, metric.WithAttributeSet(attrs))
}
```

## Performance Best Practices

### Connection Pooling
```go
// Configure trace provider with optimized batching
tp := sdktrace.NewTracerProvider(
    sdktrace.WithBatcher(exporter,
        sdktrace.WithMaxExportBatchSize(512),
        sdktrace.WithBatchTimeout(5*time.Second),
        sdktrace.WithMaxQueueSize(2048),
    ),
    sdktrace.WithResource(res),
)
```

### Sampling
```go
// Use parent-based sampling
sampler := sdktrace.ParentBased(
    sdktrace.TraceIDRatioBased(0.1), // Sample 10% of root traces
)

tp := sdktrace.NewTracerProvider(
    sdktrace.WithSampler(sampler),
    // ... other options
)
```

## Troubleshooting

### Enable Debug Logging
```go
import (
    "go.opentelemetry.io/otel"
    "go.opentelemetry.io/otel/sdk/trace"
)

// Set global error handler
otel.SetErrorHandler(otel.ErrorHandlerFunc(func(err error) {
    log.Printf("OTEL Error: %v", err)
}))
```

### Verify Spans
```bash
# Check if spans are being exported
export OTEL_LOG_LEVEL=debug
./myapp
```

## Migration from X-Ray SDK

```go
// Before (X-Ray SDK)
import "github.com/aws/aws-xray-sdk-go/xray"

seg := xray.NewSegment("myOperation", nil, nil)
seg.AddAnnotation("userId", userId)
seg.Close(nil)

// After (OpenTelemetry)
import "go.opentelemetry.io/otel"

ctx, span := tracer.Start(ctx, "myOperation")
defer span.End()
span.SetAttributes(attribute.String("userId", userId))
```

## Next Steps

- Review [Cost optimization strategies](/cost-optimization/)
- Learn about [Transaction Search](/implementation/transaction-search)
- Check [Configuration reference](/configuration/reference)

## Additional Resources

- [OpenTelemetry Go Documentation](https://opentelemetry.io/docs/instrumentation/go/)
- [AWS Distro for OpenTelemetry - Go](https://aws-otel.github.io/docs/getting-started/go-sdk)
