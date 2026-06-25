---
title: ".NET Implementation Guide"
description: "Complete guide to instrumenting .NET applications with AWS Application Signals across Lambda, ECS, and EKS environments"
readingTime: "15 min"
lastUpdated: "2026-01-29"
tags: ["dotnet", "csharp", "aspnet", "instrumentation", "lambda", "ecs", "eks"]
relatedPages:
  - "/language-guides/"
  - "/getting-started/quick-start"
---

# .NET Implementation Guide

Complete guide to instrumenting .NET applications (C#, F#) with AWS Application Signals using OpenTelemetry, covering ASP.NET Core, Minimal APIs, and Azure Functions patterns.

## Quick Start

### Prerequisites
- .NET 6.0+ (LTS recommended: .NET 8.0)
- AWS credentials configured
- Basic understanding of ASP.NET Core or .NET Lambda

### Installation Time Estimates
- **AWS Lambda**: 12-18 minutes
- **Amazon ECS**: 30-40 minutes
- **Amazon EKS**: 45-55 minutes

## Platform-Specific Implementation

### AWS Lambda

#### Using Lambda Layer (Recommended)
```bash
# AWS CLI - Add ADOT .NET Layer
aws lambda update-function-configuration \
  --function-name my-dotnet-function \
  --layers arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-collector-amd64-ver-0-90-1:1 \
  --environment Variables="{
    AWS_LAMBDA_EXEC_WRAPPER=/opt/otel-handler,
    OTEL_SERVICE_NAME=my-dotnet-service,
    OTEL_TRACES_SAMPLER=xray,
    OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317
  }"
```

#### Manual Instrumentation for Lambda

**Project File (*.csproj):**
```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <GenerateRuntimeConfigurationFiles>true</GenerateRuntimeConfigurationFiles>
    <AWSProjectType>Lambda</AWSProjectType>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Amazon.Lambda.Core" Version="2.2.0" />
    <PackageReference Include="Amazon.Lambda.Serialization.SystemTextJson" Version="2.4.0" />
    
    <!-- OpenTelemetry packages -->
    <PackageReference Include="OpenTelemetry" Version="1.7.0" />
    <PackageReference Include="OpenTelemetry.Api" Version="1.7.0" />
    <PackageReference Include="OpenTelemetry.Instrumentation.AWS" Version="1.0.1" />
    <PackageReference Include="OpenTelemetry.Instrumentation.AWSLambda" Version="1.2.0" />
    <PackageReference Include="OpenTelemetry.Exporter.OpenTelemetryProtocol" Version="1.7.0" />
    <PackageReference Include="AWSSDK.XRay" Version="3.7.300" />
  </ItemGroup>
</Project>
```

**Lambda Function Handler:**
```csharp
using Amazon.Lambda.Core;
using OpenTelemetry;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;
using System.Diagnostics;

[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace MyLambdaFunction;

public class Function
{
    private static readonly ActivitySource ActivitySource = new("MyLambdaFunction");
    private static readonly TracerProvider TracerProvider;
    
    static Function()
    {
        TracerProvider = Sdk.CreateTracerProviderBuilder()
            .AddSource("MyLambdaFunction")
            .SetResourceBuilder(ResourceBuilder.CreateDefault()
                .AddService("my-dotnet-lambda"))
            .AddAWSInstrumentation()
            .AddAWSLambdaConfigurations()
            .AddOtlpExporter()
            .Build();
    }
    
    public async Task<string> FunctionHandler(OrderRequest request, ILambdaContext context)
    {
        using var activity = ActivitySource.StartActivity("ProcessOrder", ActivityKind.Server);
        
        activity?.SetTag("faas.execution", context.AwsRequestId);
        activity?.SetTag("faas.id", context.InvokedFunctionArn);
        activity?.SetTag("order.id", request.OrderId);
        activity?.SetTag("order.amount", request.Amount);
        
        try
        {
            LambdaLogger.Log($"Processing order: {request.OrderId}");
            
            // Business logic
            var result = await ProcessOrderAsync(request);
            
            activity?.SetTag("result.status", result.Status);
            activity?.SetStatus(ActivityStatusCode.Ok);
            
            return $"Order {request.OrderId} processed successfully";
        }
        catch (Exception ex)
        {
            LambdaLogger.Log($"Error processing order: {ex.Message}");
            activity?.SetStatus(ActivityStatusCode.Error, ex.Message);
            activity?.RecordException(ex);
            throw;
        }
    }
    
    private async Task<OrderResult> ProcessOrderAsync(OrderRequest request)
    {
        using var activity = ActivitySource.StartActivity("ValidateAndProcess");
        
        // Validation
        if (request.Amount <= 0)
        {
            throw new ArgumentException("Amount must be positive");
        }
        
        // Simulated async processing
        await Task.Delay(100);
        
        return new OrderResult { Status = "Completed", OrderId = request.OrderId };
    }
}

public record OrderRequest(string OrderId, decimal Amount, string CustomerId);
public record OrderResult { public string Status { get; init; } public string OrderId { get; init; } }
```

### Amazon ECS

#### Auto-Instrumentation with ADOT Collector

**Dockerfile:**
```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["MyWebApi/MyWebApi.csproj", "MyWebApi/"]
RUN dotnet restore "MyWebApi/MyWebApi.csproj"
COPY . .
WORKDIR "/src/MyWebApi"
RUN dotnet build "MyWebApi.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "MyWebApi.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Install OpenTelemetry .NET Auto-Instrumentation
RUN apt-get update && apt-get install -y wget unzip && \
    wget https://github.com/open-telemetry/opentelemetry-dotnet-instrumentation/releases/latest/download/otel-dotnet-auto-install.sh && \
    chmod +x otel-dotnet-auto-install.sh && \
    ./otel-dotnet-auto-install.sh

# Set environment variables for auto-instrumentation
ENV CORECLR_ENABLE_PROFILING=1
ENV CORECLR_PROFILER={918728DD-259F-4A6A-AC2B-B85E1B658318}
ENV CORECLR_PROFILER_PATH=/opt/opentelemetry/OpenTelemetry.AutoInstrumentation.Native.so
ENV DOTNET_ADDITIONAL_DEPS=/opt/opentelemetry/AdditionalDeps
ENV DOTNET_SHARED_STORE=/opt/opentelemetry/store
ENV DOTNET_STARTUP_HOOKS=/opt/opentelemetry/net/OpenTelemetry.AutoInstrumentation.StartupHook.dll
ENV OTEL_DOTNET_AUTO_HOME=/opt/opentelemetry

ENTRYPOINT ["dotnet", "MyWebApi.dll"]
```

**ECS Task Definition:**
```json
{
  "family": "dotnet-app-task",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "containerDefinitions": [
    {
      "name": "dotnet-app",
      "image": "my-dotnet-app:latest",
      "portMappings": [
        {
          "containerPort": 80,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "ASPNETCORE_ENVIRONMENT",
          "value": "Production"
        },
        {
          "name": "OTEL_SERVICE_NAME",
          "value": "my-dotnet-service"
        },
        {
          "name": "OTEL_EXPORTER_OTLP_ENDPOINT",
          "value": "http://localhost:4317"
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
          "awslogs-group": "/ecs/dotnet-app",
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
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/otel-collector",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "collector"
        }
      }
    }
  ]
}
```

#### ASP.NET Core with Manual Instrumentation

**Program.cs (Minimal API):**
```csharp
using OpenTelemetry;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;
using OpenTelemetry.Metrics;
using System.Diagnostics;

var builder = WebApplication.CreateBuilder(args);

// Configure OpenTelemetry
builder.Services.AddOpenTelemetry()
    .ConfigureResource(resource => resource
        .AddService(
            serviceName: builder.Configuration["ServiceName"] ?? "my-dotnet-service",
            serviceVersion: "1.0.0",
            serviceInstanceId: Environment.MachineName))
    .WithTracing(tracing => tracing
        .AddAspNetCoreInstrumentation(options =>
        {
            options.RecordException = true;
            options.Filter = (httpContext) =>
            {
                // Exclude health checks from tracing
                return !httpContext.Request.Path.StartsWithSegments("/health");
            };
        })
        .AddHttpClientInstrumentation()
        .AddSqlClientInstrumentation(options =>
        {
            options.SetDbStatementForText = true;
            options.RecordException = true;
        })
        .AddEntityFrameworkCoreInstrumentation()
        .AddOtlpExporter(options =>
        {
            options.Endpoint = new Uri(
                builder.Configuration["OTEL_EXPORTER_OTLP_ENDPOINT"] ?? 
                "http://localhost:4317");
        }))
    .WithMetrics(metrics => metrics
        .AddAspNetCoreInstrumentation()
        .AddHttpClientInstrumentation()
        .AddRuntimeInstrumentation()
        .AddProcessInstrumentation()
        .AddOtlpExporter());

builder.Services.AddControllers();
builder.Services.AddHealthChecks();

var app = builder.Build();

app.MapHealthChecks("/health");
app.MapControllers();

app.Run();
```

**Controller with Custom Spans:**
```csharp
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace MyWebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private static readonly ActivitySource ActivitySource = new("MyWebApi.Orders");
    private readonly IOrderService _orderService;
    private readonly ILogger<OrdersController> _logger;
    
    public OrdersController(IOrderService orderService, ILogger<OrdersController> logger)
    {
        _orderService = orderService;
        _logger = logger;
    }
    
    [HttpGet("{id}")]
    public async Task<ActionResult<Order>> GetOrder(string id)
    {
        using var activity = ActivitySource.StartActivity("GetOrder");
        activity?.SetTag("order.id", id);
        
        try
        {
            var order = await _orderService.GetOrderAsync(id);
            
            if (order == null)
            {
                activity?.SetTag("order.found", false);
                return NotFound();
            }
            
            activity?.SetTag("order.found", true);
            activity?.SetTag("order.status", order.Status);
            activity?.SetTag("order.amount", order.TotalAmount);
            
            return Ok(order);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving order {OrderId}", id);
            activity?.SetStatus(ActivityStatusCode.Error, ex.Message);
            activity?.RecordException(ex);
            throw;
        }
    }
    
    [HttpPost]
    public async Task<ActionResult<Order>> CreateOrder([FromBody] CreateOrderRequest request)
    {
        using var activity = ActivitySource.StartActivity("CreateOrder");
        activity?.SetTag("order.customer_id", request.CustomerId);
        activity?.SetTag("order.item_count", request.Items.Count);
        
        try
        {
            var order = await _orderService.CreateOrderAsync(request);
            
            activity?.SetTag("order.id", order.Id);
            activity?.SetTag("order.total", order.TotalAmount);
            
            return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, order);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating order");
            activity?.SetStatus(ActivityStatusCode.Error, ex.Message);
            activity?.RecordException(ex);
            throw;
        }
    }
}
```

**Service Layer with Nested Spans:**
```csharp
using System.Diagnostics;

namespace MyWebApi.Services;

public class OrderService : IOrderService
{
    private static readonly ActivitySource ActivitySource = new("MyWebApi.OrderService");
    private readonly IDbConnection _dbConnection;
    private readonly IPaymentService _paymentService;
    private readonly IInventoryService _inventoryService;
    
    public async Task<Order> CreateOrderAsync(CreateOrderRequest request)
    {
        using var activity = ActivitySource.StartActivity("CreateOrderAsync");
        activity?.SetTag("customer.id", request.CustomerId);
        
        // Validate inventory
        using (var validateActivity = ActivitySource.StartActivity("ValidateInventory"))
        {
            var available = await _inventoryService.CheckAvailabilityAsync(request.Items);
            validateActivity?.SetTag("items.available", available);
            
            if (!available)
            {
                throw new InvalidOperationException("Items not available");
            }
        }
        
        // Process payment
        using (var paymentActivity = ActivitySource.StartActivity("ProcessPayment"))
        {
            var paymentResult = await _paymentService.ProcessAsync(request.PaymentInfo);
            paymentActivity?.SetTag("payment.transaction_id", paymentResult.TransactionId);
            paymentActivity?.SetTag("payment.amount", paymentResult.Amount);
        }
        
        // Create order in database
        using (var dbActivity = ActivitySource.StartActivity("SaveOrderToDatabase"))
        {
            var order = new Order
            {
                Id = Guid.NewGuid().ToString(),
                CustomerId = request.CustomerId,
                Items = request.Items,
                Status = "Confirmed",
                CreatedAt = DateTime.UtcNow
            };
            
            await _dbConnection.InsertAsync(order);
            dbActivity?.SetTag("order.id", order.Id);
            
            activity?.SetTag("order.created", true);
            return order;
        }
    }
}
```

### Amazon EKS

#### Using ADOT Operator

**OpenTelemetry Instrumentation CRD:**
```yaml
apiVersion: opentelemetry.io/v1alpha1
kind: Instrumentation
metadata:
  name: dotnet-instrumentation
  namespace: dotnet-apps
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
  dotnet:
    image: ghcr.io/open-telemetry/opentelemetry-operator/autoinstrumentation-dotnet:latest
    env:
      - name: OTEL_EXPORTER_OTLP_ENDPOINT
        value: http://adot-collector.observability:4317
      - name: OTEL_TRACES_SAMPLER
        value: parentbased_traceidratio
      - name: OTEL_TRACES_SAMPLER_ARG
        value: "1.0"
```

**Deployment with Auto-Instrumentation:**
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: dotnet-apps

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: aspnet-api
  namespace: dotnet-apps
spec:
  replicas: 3
  selector:
    matchLabels:
      app: aspnet-api
  template:
    metadata:
      labels:
        app: aspnet-api
      annotations:
        instrumentation.opentelemetry.io/inject-dotnet: "true"
    spec:
      serviceAccountName: aspnet-api-sa
      containers:
      - name: api
        image: my-aspnet-api:latest
        ports:
        - containerPort: 80
          name: http
        env:
        - name: ASPNETCORE_ENVIRONMENT
          value: Production
        - name: OTEL_SERVICE_NAME
          value: aspnet-api
        - name: OTEL_RESOURCE_ATTRIBUTES
          value: service.namespace=production,deployment.environment=eks
        - name: ConnectionStrings__DefaultConnection
          valueFrom:
            secretKeyRef:
              name: db-connection
              key: connection-string
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health/live
            port: 80
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: aspnet-api-service
  namespace: dotnet-apps
spec:
  selector:
    app: aspnet-api
  ports:
  - port: 80
    targetPort: 80
  type: LoadBalancer
```

**ConfigMap for appsettings:**
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: aspnet-config
  namespace: dotnet-apps
data:
  appsettings.Production.json: |
    {
      "Logging": {
        "LogLevel": {
          "Default": "Information",
          "Microsoft.AspNetCore": "Warning",
          "OpenTelemetry": "Information"
        }
      },
      "OpenTelemetry": {
        "ServiceName": "aspnet-api",
        "ExporterEndpoint": "http://adot-collector.observability:4317",
        "Sampler": {
          "Type": "ParentBasedTracerIdRatioBased",
          "Argument": 1.0
        }
      },
      "AllowedHosts": "*"
    }
```

## Framework-Specific Guides

### ASP.NET Core MVC

**Startup Configuration:**
```csharp
public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddControllersWithViews();
        
        // Add OpenTelemetry
        services.AddOpenTelemetry()
            .ConfigureResource(r => r.AddService("my-mvc-app"))
            .WithTracing(builder =>
            {
                builder
                    .AddAspNetCoreInstrumentation(options =>
                    {
                        options.Filter = httpContext =>
                        {
                            // Don't trace static files
                            return !httpContext.Request.Path.StartsWithSegments("/static");
                        };
                        options.EnrichWithHttpRequest = (activity, request) =>
                        {
                            activity.SetTag("user.id", request.HttpContext.User?.Identity?.Name);
                        };
                        options.EnrichWithHttpResponse = (activity, response) =>
                        {
                            activity.SetTag("response.content_type", response.ContentType);
                        };
                    })
                    .AddHttpClientInstrumentation()
                    .AddSqlClientInstrumentation()
                    .AddOtlpExporter();
            });
    }
    
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }
        
        app.UseRouting();
        app.UseAuthorization();
        
        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllerRoute(
                name: "default",
                pattern: "{controller=Home}/{action=Index}/{id?}");
        });
    }
}
```

### Blazor Server

**Program.cs:**
```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRazorPages();
builder.Services.AddServerSideBlazor();

// OpenTelemetry for Blazor
builder.Services.AddOpenTelemetry()
    .ConfigureResource(r => r.AddService("blazor-app"))
    .WithTracing(builder =>
    {
        builder
            .AddAspNetCoreInstrumentation()
            .AddSource("BlazorApp.*")
            .AddOtlpExporter();
    });

var app = builder.Build();

app.UseStaticFiles();
app.UseRouting();
app.MapBlazorHub();
app.MapFallbackToPage("/_Host");

app.Run();
```

**Blazor Component with Tracing:**
```csharp
@page "/orders"
@using System.Diagnostics
@inject IOrderService OrderService

<h3>Orders</h3>

@if (orders == null)
{
    <p>Loading...</p>
}
else
{
    <table class="table">
        @foreach (var order in orders)
        {
            <tr>
                <td>@order.Id</td>
                <td>@order.Status</td>
                <td>@order.Total</td>
            </tr>
        }
    </table>
}

@code {
    private static readonly ActivitySource ActivitySource = new("BlazorApp.Orders");
    private List<Order>? orders;

    protected override async Task OnInitializedAsync()
    {
        using var activity = ActivitySource.StartActivity("LoadOrders");
        
        try
        {
            orders = await OrderService.GetOrdersAsync();
            activity?.SetTag("orders.count", orders.Count);
        }
        catch (Exception ex)
        {
            activity?.SetStatus(ActivityStatusCode.Error);
            activity?.RecordException(ex);
        }
    }
}
```

### gRPC Services

**Project File:**
```xml
<ItemGroup>
  <PackageReference Include="Grpc.AspNetCore" Version="2.60.0" />
  <PackageReference Include="OpenTelemetry.Instrumentation.GrpcNetClient" Version="1.7.0-beta.1" />
</ItemGroup>
```

**gRPC Service:**
```csharp
using Grpc.Core;
using System.Diagnostics;

namespace MyGrpcService;

public class OrderService : Orders.OrdersBase
{
    private static readonly ActivitySource ActivitySource = new("MyGrpcService.Orders");
    private readonly ILogger<OrderService> _logger;
    
    public OrderService(ILogger<OrderService> logger)
    {
        _logger = logger;
    }
    
    public override async Task<OrderResponse> CreateOrder(
        CreateOrderRequest request,
        ServerCallContext context)
    {
        using var activity = ActivitySource.StartActivity("CreateOrder");
        activity?.SetTag("grpc.method", "CreateOrder");
        activity?.SetTag("customer.id", request.CustomerId);
        
        try
        {
            // Process order
            var orderId = Guid.NewGuid().ToString();
            
            activity?.SetTag("order.id", orderId);
            
            return new OrderResponse
            {
                OrderId = orderId,
                Status = "Created"
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating order");
            activity?.SetStatus(ActivityStatusCode.Error);
            activity?.RecordException(ex);
            throw new RpcException(new Status(StatusCode.Internal, ex.Message));
        }
    }
}
```

## Database Instrumentation

### Entity Framework Core

**Automatic Instrumentation:**
```csharp
builder.Services.AddOpenTelemetry()
    .WithTracing(builder =>
    {
        builder.AddEntityFrameworkCoreInstrumentation(options =>
        {
            options.SetDbStatementForText = true;  // Include SQL in spans
            options.EnrichWithIDbCommand = (activity, command) =>
            {
                activity.SetTag("db.row_count", command.ExecuteNonQuery());
            };
        });
    });
```

### ADO.NET / Dapper

**SqlClient Instrumentation:**
```csharp
builder.Services.AddOpenTelemetry()
    .WithTracing(builder =>
    {
        builder.AddSqlClientInstrumentation(options =>
        {
            options.SetDbStatementForText = true;
            options.SetDbStatementForStoredProcedure = true;
            options.RecordException = true;
            options.EnableConnectionLevelAttributes = true;
        });
    });
```

**Custom Database Spans:**
```csharp
using System.Data;
using System.Diagnostics;
using Dapper;

public class ProductRepository
{
    private static readonly ActivitySource ActivitySource = new("MyApp.Repository");
    private readonly IDbConnection _connection;
    
    public async Task<Product?> GetProductAsync(string id)
    {
        using var activity = ActivitySource.StartActivity("GetProduct");
        activity?.SetTag("product.id", id);
        activity?.SetTag("db.operation", "SELECT");
        
        const string sql = "SELECT * FROM Products WHERE Id = @Id";
        
        var product = await _connection.QueryFirstOrDefaultAsync<Product>(sql, new { Id = id });
        
        activity?.SetTag("product.found", product != null);
        
        return product;
    }
}
```

## Asynchronous Processing

### Background Services

```csharp
using System.Diagnostics;

public class OrderProcessingBackgroundService : BackgroundService
{
    private static readonly ActivitySource ActivitySource = new("MyApp.BackgroundService");
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<OrderProcessingBackgroundService> _logger;
    
    public OrderProcessingBackgroundService(
        IServiceProvider serviceProvider,
        ILogger<OrderProcessingBackgroundService> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }
    
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using var activity = ActivitySource.StartActivity("ProcessPendingOrders");
            
            try
            {
                using var scope = _serviceProvider.CreateScope();
                var orderService = scope.ServiceProvider.GetRequiredService<IOrderService>();
                
                var processed = await orderService.ProcessPendingOrdersAsync();
                activity?.SetTag("orders.processed", processed);
                
                _logger.LogInformation("Processed {Count} orders", processed);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing orders");
                activity?.SetStatus(ActivityStatusCode.Error);
                activity?.RecordException(ex);
            }
            
            await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
        }
    }
}
```

### Message Queue Processing

```csharp
using System.Diagnostics;
using System.Text.Json;
using Azure.Messaging.ServiceBus;

public class MessageProcessor
{
    private static readonly ActivitySource ActivitySource = new("MyApp.MessageProcessor");
    
    public async Task ProcessMessageAsync(ServiceBusReceivedMessage message)
    {
        // Extract trace context from message
        var parentContext = ExtractTraceContext(message);
        
        using var activity = ActivitySource.StartActivity(
            "ProcessMessage",
            ActivityKind.Consumer,
            parentContext);
        
        activity?.SetTag("messaging.system", "servicebus");
        activity?.SetTag("messaging.destination", message.Subject);
        activity?.SetTag("messaging.message_id", message.MessageId);
        
        try
        {
            var orderEvent = JsonSerializer.Deserialize<OrderEvent>(message.Body);
            
            // Process the message
            await ProcessOrderEventAsync(orderEvent);
            
            activity?.SetStatus(ActivityStatusCode.Ok);
        }
        catch (Exception ex)
        {
            activity?.SetStatus(ActivityStatusCode.Error);
            activity?.RecordException(ex);
            throw;
        }
    }
    
    private ActivityContext ExtractTraceContext(ServiceBusReceivedMessage message)
    {
        // Extract W3C Trace Context from message properties
        if (message.ApplicationProperties.TryGetValue("traceparent", out var traceParent))
        {
            return ActivityContext.Parse(traceParent.ToString(), null);
        }
        
        return default;
    }
}
```

## Custom Metrics

```csharp
using OpenTelemetry.Metrics;
using System.Diagnostics.Metrics;

public class BusinessMetrics
{
    private static readonly Meter Meter = new("MyApp.Business", "1.0.0");
    
    private readonly Counter<long> _ordersProcessed;
    private readonly Histogram<double> _orderValue;
    private readonly Counter<long> _paymentErrors;
    
    public BusinessMetrics()
    {
        _ordersProcessed = Meter.CreateCounter<long>(
            "orders.processed",
            unit: "orders",
            description: "Number of orders processed");
        
        _orderValue = Meter.CreateHistogram<double>(
            "orders.value",
            unit: "USD",
            description: "Distribution of order values");
        
        _paymentErrors = Meter.CreateCounter<long>(
            "payment.errors",
            unit: "errors",
            description: "Number of payment processing errors");
    }
    
    public void RecordOrderProcessed(string orderType, double value)
    {
        _ordersProcessed.Add(1, new KeyValuePair<string, object?>("order.type", orderType));
        _orderValue.Record(value, new KeyValuePair<string, object?>("order.type", orderType));
    }
    
    public void RecordPaymentError(string errorType)
    {
        _paymentErrors.Add(1, new KeyValuePair<string, object?>("error.type", errorType));
    }
}

// Register in DI
builder.Services.AddSingleton<BusinessMetrics>();

// Configure metrics export
builder.Services.AddOpenTelemetry()
    .WithMetrics(metrics => metrics
        .AddMeter("MyApp.Business")
        .AddAspNetCoreInstrumentation()
        .AddRuntimeInstrumentation()
        .AddOtlpExporter());
```

## Performance Best Practices

### Sampling Configuration
```csharp
builder.Services.AddOpenTelemetry()
    .WithTracing(builder =>
    {
        // Parent-based sampling - always sample if parent is sampled
        builder.SetSampler(new ParentBasedSampler(
            new TraceIdRatioBasedSampler(0.1))); // Sample 10% of root traces
    });
```

### Batch Processing
```csharp
builder.Services.AddOpenTelemetry()
    .WithTracing(builder =>
    {
        builder.AddOtlpExporter(options =>
        {
            options.BatchExportProcessorOptions = new()
            {
                MaxQueueSize = 2048,
                ScheduledDelayMilliseconds = 5000,
                ExporterTimeoutMilliseconds = 30000,
                MaxExportBatchSize = 512
            };
        });
    });
```

### Memory Optimization
```csharp
// Limit attribute value length
builder.Services.AddOpenTelemetry()
    .WithTracing(builder =>
    {
        builder.SetResourceBuilder(ResourceBuilder.CreateDefault()
            .AddService("my-service")
            .AddAttributes(new Dictionary<string, object>
            {
                ["deployment.environment"] = "production"
            }));
        
        // Limit span attributes
        builder.AddAspNetCoreInstrumentation(options =>
        {
            options.RecordException = true;
            options.Filter = context => !context.Request.Path.StartsWithSegments("/health");
        });
    });
```

## Troubleshooting

### Enable Debug Logging
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "OpenTelemetry": "Debug",
      "OpenTelemetry.Instrumentation": "Debug"
    }
  }
}
```

### Verify Instrumentation
```bash
# Check if profiler is loaded
docker exec <container-id> printenv | grep CORECLR

# Expected output:
# CORECLR_ENABLE_PROFILING=1
# CORECLR_PROFILER={918728DD-259F-4A6A-AC2B-B85E1B658318}
```

### Common Issues

**1. Traces Not Appearing**
```csharp
// Ensure TracerProvider is built
builder.Services.AddOpenTelemetry()
    .WithTracing(builder => builder
        .AddAspNetCoreInstrumentation()
        .AddOtlpExporter());  // Don't forget this!
```

**2. Missing Dependencies**
```bash
dotnet add package OpenTelemetry.Extensions.Hosting
dotnet add package OpenTelemetry.Instrumentation.AspNetCore
dotnet add package OpenTelemetry.Exporter.OpenTelemetryProtocol
```

## Migration from X-Ray SDK

```csharp
// Before (X-Ray .NET SDK)
using Amazon.XRay.Recorder.Core;

AWSXRayRecorder.Instance.BeginSubsegment("myOperation");
try
{
    // operation
    AWSXRayRecorder.Instance.AddAnnotation("userId", userId);
}
finally
{
    AWSXRayRecorder.Instance.EndSubsegment();
}

// After (OpenTelemetry)
using System.Diagnostics;

using var activity = ActivitySource.StartActivity("myOperation");
activity?.SetTag("userId", userId);
// operation
// automatically ends when disposed
```

## Next Steps

- Review [Cost optimization strategies](/cost-optimization/)
- Learn about [Transaction Search](/implementation/transaction-search)
- Check [Configuration reference](/configuration/reference)

## Additional Resources

- [OpenTelemetry .NET Documentation](https://opentelemetry.io/docs/instrumentation/net/)
- [AWS Distro for OpenTelemetry - .NET](https://aws-otel.github.io/docs/getting-started/dotnet-sdk)
- [ASP.NET Core OpenTelemetry](https://learn.microsoft.com/en-us/aspnet/core/log-mon/metrics/metrics)
