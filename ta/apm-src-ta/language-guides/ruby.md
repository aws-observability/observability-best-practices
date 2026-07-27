---
title: "Ruby Implementation Guide"
description: "Complete guide to instrumenting Ruby applications with AWS Application Signals across Lambda, ECS, and EKS environments"
readingTime: "12 min"
lastUpdated: "2026-01-29"
tags: ["ruby", "rails", "sinatra", "instrumentation", "lambda", "ecs", "eks"]
relatedPages:
  - "/language-guides/"
  - "/getting-started/quick-start"
---

# Ruby Implementation Guide

Complete guide to instrumenting Ruby applications with AWS Application Signals using OpenTelemetry, covering Ruby on Rails, Sinatra, and other popular frameworks.

## Quick Start

### Prerequisites
- Ruby 2.7+ (Ruby 3.2+ recommended)
- Bundler for dependency management
- AWS credentials configured

### Installation Time Estimates
- **AWS Lambda**: 12-18 minutes
- **Amazon ECS**: 25-35 minutes
- **Amazon EKS**: 40-50 minutes

## Platform-Specific Implementation

### AWS Lambda

#### Using Lambda Layer
```bash
# Add ADOT Lambda Layer
aws lambda update-function-configuration \
  --function-name my-ruby-function \
  --layers arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-ruby-amd64-ver-1-0-1:1 \
  --environment Variables="{
    AWS_LAMBDA_EXEC_WRAPPER=/opt/otel-handler,
    OTEL_SERVICE_NAME=my-ruby-service,
    OTEL_TRACES_SAMPLER=xray
  }"
```

#### Manual Instrumentation

**Gemfile:**
```ruby
source 'https://rubygems.org'

gem 'aws-sdk-lambda'
gem 'opentelemetry-sdk', '~> 1.3'
gem 'opentelemetry-exporter-otlp', '~> 0.26'
gem 'opentelemetry-instrumentation-all', '~> 0.50'
gem 'opentelemetry-instrumentation-aws_lambda', '~> 0.1'
gem 'opentelemetry-propagator-xray', '~> 0.1'
```

**handler.rb:**
```ruby
require 'json'
require 'opentelemetry/sdk'
require 'opentelemetry/exporter/otlp'
require 'opentelemetry/instrumentation/aws_lambda'
require 'opentelemetry/propagator/xray'

# Configure OpenTelemetry
OpenTelemetry::SDK.configure do |c|
  c.service_name = ENV.fetch('OTEL_SERVICE_NAME', 'ruby-lambda')
  c.service_version = '1.0.0'
  
  # Use X-Ray ID generator for AWS
  c.id_generator = OpenTelemetry::Propagator::XRay::IDGenerator
  
  # Add OTLP exporter
  c.add_span_processor(
    OpenTelemetry::SDK::Trace::Export::BatchSpanProcessor.new(
      OpenTelemetry::Exporter::OTLP::Exporter.new(
        endpoint: ENV.fetch('OTEL_EXPORTER_OTLP_ENDPOINT', 'http://localhost:4317')
      )
    )
  )
  
  # Use X-Ray propagator
  c.propagators = [
    OpenTelemetry::Propagator::XRay::TextMapPropagator.new
  ]
end

# Get tracer
TRACER = OpenTelemetry.tracer_provider.tracer('lambda-handler')

def lambda_handler(event:, context:)
  # Create span
  TRACER.in_span('process_order', 
    kind: :server,
    attributes: {
      'faas.execution' => context.request_id,
      'faas.id' => context.invoked_function_arn,
      'order.id' => event['orderId']
    }
  ) do |span|
    
    begin
      # Business logic
      order_id = event['orderId']
      customer_id = event['customerId']
      amount = event['amount']
      
      span.set_attribute('order.amount', amount)
      span.set_attribute('customer.id', customer_id)
      
      # Validate
      if amount <= 0
        raise ArgumentError, 'Amount must be positive'
      end
      
      # Process order
      result = process_order(order_id, customer_id, amount)
      
      span.set_attribute('result.status', result[:status])
      
      {
        statusCode: 200,
        body: JSON.generate(result)
      }
      
    rescue StandardError => e
      span.record_exception(e)
      span.status = OpenTelemetry::Trace::Status.error(e.message)
      
      {
        statusCode: 500,
        body: JSON.generate({ error: e.message })
      }
    end
  end
end

def process_order(order_id, customer_id, amount)
  TRACER.in_span('validate_and_process') do |span|
    # Simulated processing
    sleep 0.1
    
    span.set_attribute('validation.passed', true)
    
    {
      orderId: order_id,
      customerId: customer_id,
      amount: amount,
      status: 'processed'
    }
  end
end
```

### Amazon ECS

#### Dockerfile

```dockerfile
FROM ruby:3.2-alpine

WORKDIR /app

# Install dependencies
RUN apk add --no-cache build-base postgresql-dev

# Copy Gemfile
COPY Gemfile Gemfile.lock ./
RUN bundle install --without development test

# Copy application
COPY . .

# Expose port
EXPOSE 3000

# Start application
CMD ["bundle", "exec", "puma", "-C", "config/puma.rb"]
```

**Gemfile for ECS:**
```ruby
source 'https://rubygems.org'

gem 'rails', '~> 7.1'
gem 'puma', '~> 6.0'
gem 'pg', '~> 1.5'

# OpenTelemetry
gem 'opentelemetry-sdk', '~> 1.3'
gem 'opentelemetry-exporter-otlp', '~> 0.26'
gem 'opentelemetry-instrumentation-all', '~> 0.50'
gem 'opentelemetry-instrumentation-rails', '~> 0.30'
gem 'opentelemetry-instrumentation-pg', '~> 0.27'
gem 'opentelemetry-instrumentation-rack', '~> 0.24'
gem 'opentelemetry-instrumentation-action_pack', '~> 0.9'
gem 'opentelemetry-instrumentation-active_record', '~> 0.7'
```

**config/initializers/opentelemetry.rb:**
```ruby
require 'opentelemetry/sdk'
require 'opentelemetry/exporter/otlp'
require 'opentelemetry/instrumentation/all'

OpenTelemetry::SDK.configure do |c|
  c.service_name = ENV.fetch('OTEL_SERVICE_NAME', 'rails-app')
  c.service_version = '1.0.0'
  
  # Configure resource attributes
  c.resource = OpenTelemetry::SDK::Resources::Resource.create(
    'service.name' => ENV.fetch('OTEL_SERVICE_NAME', 'rails-app'),
    'service.version' => '1.0.0',
    'service.namespace' => ENV.fetch('SERVICE_NAMESPACE', 'production'),
    'deployment.environment' => ENV.fetch('DEPLOYMENT_ENVIRONMENT', 'ecs')
  )
  
  # Configure OTLP exporter
  c.add_span_processor(
    OpenTelemetry::SDK::Trace::Export::BatchSpanProcessor.new(
      OpenTelemetry::Exporter::OTLP::Exporter.new(
        endpoint: ENV.fetch('OTEL_EXPORTER_OTLP_ENDPOINT', 'http://localhost:4317'),
        headers: {},
        compression: 'gzip'
      ),
      max_queue_size: 2048,
      max_export_batch_size: 512,
      schedule_delay_millis: 5000
    )
  )
  
  # Configure sampling
  c.sampler = OpenTelemetry::SDK::Trace::Samplers::ParentBased.new(
    root: OpenTelemetry::SDK::Trace::Samplers::TraceIdRatioBased.new(1.0)
  )
  
  # Auto-instrument all supported libraries
  c.use_all
end
```

**ECS Task Definition:**
```json
{
  "family": "ruby-rails-task",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "containerDefinitions": [
    {
      "name": "rails-app",
      "image": "my-rails-app:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "RAILS_ENV",
          "value": "production"
        },
        {
          "name": "OTEL_SERVICE_NAME",
          "value": "rails-app"
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
          "awslogs-group": "/ecs/rails-app",
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

#### Rails Controller with Custom Spans

**app/controllers/orders_controller.rb:**
```ruby
class OrdersController < ApplicationController
  before_action :set_tracer
  
  def show
    order_id = params[:id]
    
    @tracer.in_span('fetch_order',
      attributes: {
        'order.id' => order_id,
        'http.method' => request.method,
        'http.route' => request.path
      }
    ) do |span|
      
      begin
        @order = Order.find(order_id)
        
        span.set_attribute('order.found', true)
        span.set_attribute('order.status', @order.status)
        span.set_attribute('order.amount', @order.amount)
        
        render json: @order, status: :ok
        
      rescue ActiveRecord::RecordNotFound => e
        span.set_attribute('order.found', false)
        span.record_exception(e)
        
        render json: { error: 'Order not found' }, status: :not_found
      end
    end
  end
  
  def create
    @tracer.in_span('create_order',
      attributes: {
        'customer.id' => order_params[:customer_id]
      }
    ) do |span|
      
      begin
        # Validate order
        validate_order_params(order_params)
        
        # Process payment
        payment_result = process_payment(order_params)
        span.set_attribute('payment.transaction_id', payment_result[:transaction_id])
        
        # Create order
        @order = Order.create!(order_params.merge(
          status: 'confirmed',
          transaction_id: payment_result[:transaction_id]
        ))
        
        span.set_attribute('order.id', @order.id)
        span.set_attribute('order.status', @order.status)
        
        render json: @order, status: :created
        
      rescue StandardError => e
        span.record_exception(e)
        span.status = OpenTelemetry::Trace::Status.error(e.message)
        
        render json: { error: e.message }, status: :unprocessable_entity
      end
    end
  end
  
  private
  
  def set_tracer
    @tracer = OpenTelemetry.tracer_provider.tracer('rails-app')
  end
  
  def order_params
    params.require(:order).permit(:customer_id, :amount, :items)
  end
  
  def validate_order_params(params)
    @tracer.in_span('validate_order') do |span|
      if params[:amount].to_f <= 0
        raise ArgumentError, 'Amount must be positive'
      end
      
      span.set_attribute('validation.passed', true)
    end
  end
  
  def process_payment(params)
    @tracer.in_span('process_payment',
      attributes: {
        'payment.amount' => params[:amount]
      }
    ) do |span|
      
      # Simulated payment processing
      sleep 0.05
      
      transaction_id = SecureRandom.uuid
      span.set_attribute('payment.success', true)
      
      { transaction_id: transaction_id, status: 'approved' }
    end
  end
end
```

**app/models/order.rb:**
```ruby
class Order < ApplicationRecord
  belongs_to :customer
  has_many :order_items
  
  validates :amount, numericality: { greater_than: 0 }
  validates :customer_id, presence: true
  
  # Custom span for complex queries
  def self.find_with_details(order_id)
    tracer = OpenTelemetry.tracer_provider.tracer('order-model')
    
    tracer.in_span('find_order_with_details',
      attributes: {
        'db.operation' => 'SELECT',
        'db.table' => 'orders',
        'order.id' => order_id
      }
    ) do |span|
      
      order = includes(:order_items, :customer).find(order_id)
      
      span.set_attribute('order.item_count', order.order_items.count)
      span.set_attribute('order.total', order.amount)
      
      order
    end
  end
end
```

### Amazon EKS

#### Deployment with OpenTelemetry

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: ruby-apps

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: rails-app
  namespace: ruby-apps
spec:
  replicas: 3
  selector:
    matchLabels:
      app: rails-app
  template:
    metadata:
      labels:
        app: rails-app
    spec:
      serviceAccountName: rails-app-sa
      containers:
      - name: app
        image: my-rails-app:latest
        ports:
        - containerPort: 3000
          name: http
        env:
        - name: RAILS_ENV
          value: production
        - name: OTEL_SERVICE_NAME
          value: rails-app
        - name: OTEL_EXPORTER_OTLP_ENDPOINT
          value: http://adot-collector.observability:4317
        - name: SERVICE_NAMESPACE
          value: production
        - name: DEPLOYMENT_ENVIRONMENT
          value: eks
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: rails-app-service
  namespace: ruby-apps
spec:
  selector:
    app: rails-app
  ports:
  - port: 80
    targetPort: 3000
  type: LoadBalancer
```

## Framework-Specific Guides

### Sinatra

**app.rb:**
```ruby
require 'sinatra'
require 'opentelemetry/sdk'
require 'opentelemetry/instrumentation/all'

# Configure OpenTelemetry
OpenTelemetry::SDK.configure do |c|
  c.service_name = 'sinatra-app'
  c.use_all
end

# Get tracer
TRACER = OpenTelemetry.tracer_provider.tracer('sinatra-app')

get '/api/users/:id' do
  user_id = params[:id]
  
  TRACER.in_span('get_user',
    attributes: {
      'user.id' => user_id,
      'http.method' => request.request_method,
      'http.route' => request.path
    }
  ) do |span|
    
    begin
      user = fetch_user(user_id)
      
      span.set_attribute('user.found', !user.nil?)
      
      if user
        content_type :json
        user.to_json
      else
        status 404
        { error: 'User not found' }.to_json
      end
      
    rescue StandardError => e
      span.record_exception(e)
      span.status = OpenTelemetry::Trace::Status.error(e.message)
      
      status 500
      { error: e.message }.to_json
    end
  end
end

post '/api/orders' do
  request.body.rewind
  data = JSON.parse(request.body.read)
  
  TRACER.in_span('create_order',
    attributes: {
      'customer.id' => data['customerId'],
      'order.amount' => data['amount']
    }
  ) do |span|
    
    order = create_order(data)
    
    span.set_attribute('order.id', order[:id])
    
    status 201
    content_type :json
    order.to_json
  end
end

def fetch_user(user_id)
  TRACER.in_span('database.fetch_user') do |span|
    span.set_attribute('db.operation', 'SELECT')
    # Database query logic
    { id: user_id, name: 'John Doe' }
  end
end

def create_order(data)
  TRACER.in_span('process_order_creation') do |span|
    # Order creation logic
    {
      id: SecureRandom.uuid,
      customerId: data['customerId'],
      amount: data['amount'],
      status: 'pending'
    }
  end
end
```

### Grape API

**config.ru:**
```ruby
require 'grape'
require 'opentelemetry/sdk'
require 'opentelemetry/instrumentation/all'

OpenTelemetry::SDK.configure do |c|
  c.service_name = 'grape-api'
  c.use_all
end

class API < Grape::API
  format :json
  
  helpers do
    def tracer
      @tracer ||= OpenTelemetry.tracer_provider.tracer('grape-api')
    end
  end
  
  resource :products do
    desc 'Get a product'
    params do
      requires :id, type: String, desc: 'Product ID'
    end
    get ':id' do
      tracer.in_span('get_product',
        attributes: {
          'product.id' => params[:id]
        }
      ) do |span|
        
        product = find_product(params[:id])
        
        span.set_attribute('product.found', !product.nil?)
        
        error!('Product not found', 404) unless product
        
        product
      end
    end
    
    desc 'Create a product'
    params do
      requires :name, type: String
      requires :price, type: Float
    end
    post do
      tracer.in_span('create_product') do |span|
        product = create_product(params)
        span.set_attribute('product.id', product[:id])
        product
      end
    end
  end
end

run API
```

## Database Instrumentation

### ActiveRecord (Auto-instrumented)

ActiveRecord queries are automatically instrumented when using `opentelemetry-instrumentation-active_record`:

```ruby
# Automatically traced
@orders = Order.where(customer_id: customer_id)
             .includes(:items)
             .order(created_at: :desc)
             .limit(10)
```

### Custom Database Spans

```ruby
class OrderRepository
  def initialize
    @tracer = OpenTelemetry.tracer_provider.tracer('order-repository')
  end
  
  def find_orders_with_aggregates(customer_id)
    @tracer.in_span('complex_order_query',
      attributes: {
        'db.operation' => 'SELECT',
        'db.table' => 'orders',
        'customer.id' => customer_id
      }
    ) do |span|
      
      orders = Order.connection.execute(<<-SQL)
        SELECT 
          o.id,
          o.customer_id,
          o.amount,
          COUNT(oi.id) as item_count,
          SUM(oi.quantity) as total_quantity
        FROM orders o
        LEFT JOIN order_items oi ON oi.order_id = o.id
        WHERE o.customer_id = '#{customer_id}'
        GROUP BY o.id
      SQL
      
      span.set_attribute('result.count', orders.count)
      
      orders.to_a
    end
  end
end
```

### Redis Instrumentation

```ruby
# Gemfile
gem 'opentelemetry-instrumentation-redis', '~> 0.25'

# Configuration (automatically picks up Redis calls)
require 'redis'
require 'opentelemetry/instrumentation/redis'

redis = Redis.new(url: ENV['REDIS_URL'])

# Automatically traced
redis.get('user:123')
redis.setex('session:abc', 3600, session_data)
```

## Background Jobs

### Sidekiq

**Gemfile:**
```ruby
gem 'sidekiq', '~> 7.0'
gem 'opentelemetry-instrumentation-sidekiq', '~> 0.25'
```

**config/initializers/sidekiq.rb:**
```ruby
require 'opentelemetry/instrumentation/sidekiq'

Sidekiq.configure_server do |config|
  config.redis = { url: ENV['REDIS_URL'] }
end

Sidekiq.configure_client do |config|
  config.redis = { url: ENV['REDIS_URL'] }
end
```

**Worker with Custom Spans:**
```ruby
class OrderProcessingWorker
  include Sidekiq::Worker
  
  def perform(order_id)
    tracer = OpenTelemetry.tracer_provider.tracer('background-worker')
    
    tracer.in_span('process_order_background',
      attributes: {
        'order.id' => order_id,
        'job.name' => self.class.name
      }
    ) do |span|
      
      order = Order.find(order_id)
      
      # Process order
      process_order(tracer, order)
      
      span.set_attribute('order.status', order.status)
    end
  end
  
  private
  
  def process_order(tracer, order)
    tracer.in_span('validate_order') do
      # Validation logic
      order.validate!
    end
    
    tracer.in_span('charge_payment') do
      # Payment processing
      order.charge!
    end
    
    tracer.in_span('send_confirmation') do
      # Send email
      OrderMailer.confirmation(order).deliver_now
    end
  end
end
```

## HTTP Client Instrumentation

### Net::HTTP (Auto-instrumented)

```ruby
# Gemfile
gem 'opentelemetry-instrumentation-net_http', '~> 0.22'

# Automatically traced
require 'net/http'

uri = URI('https://api.example.com/data')
response = Net::HTTP.get_response(uri)
```

### Faraday

```ruby
# Gemfile
gem 'faraday', '~> 2.0'
gem 'opentelemetry-instrumentation-faraday', '~> 0.24'

# Usage
conn = Faraday.new(url: 'https://api.example.com') do |faraday|
  faraday.adapter Faraday.default_adapter
end

# Automatically traced
response = conn.get('/users/123')
```

## Custom Metrics

```ruby
require 'opentelemetry/sdk'

class BusinessMetrics
  def initialize
    meter = OpenTelemetry.meter_provider.meter('business-metrics')
    
    @orders_processed = meter.create_counter(
      'orders.processed',
      unit: 'orders',
      description: 'Number of orders processed'
    )
    
    @order_value = meter.create_histogram(
      'orders.value',
      unit: 'USD',
      description: 'Order value distribution'
    )
  end
  
  def record_order(order_type, value)
    attributes = {
      'order.type' => order_type
    }
    
    @orders_processed.add(1, attributes: attributes)
    @order_value.record(value, attributes: attributes)
  end
end
```

## Performance Best Practices

### Batch Processing Configuration

```ruby
OpenTelemetry::SDK.configure do |c|
  c.add_span_processor(
    OpenTelemetry::SDK::Trace::Export::BatchSpanProcessor.new(
      exporter,
      max_queue_size: 2048,
      max_export_batch_size: 512,
      schedule_delay_millis: 5000,
      exporter_timeout_millis: 30000
    )
  )
end
```

### Sampling Strategy

```ruby
# Sample 10% of traces
OpenTelemetry::SDK.configure do |c|
  c.sampler = OpenTelemetry::SDK::Trace::Samplers::ParentBased.new(
    root: OpenTelemetry::SDK::Trace::Samplers::TraceIdRatioBased.new(0.1)
  )
end
```

## Troubleshooting

### Enable Debug Logging

```ruby
# config/environments/development.rb
config.log_level = :debug

# Or set environment variable
ENV['OTEL_LOG_LEVEL'] = 'debug'
```

### Verify Instrumentation

```ruby
# Check loaded instrumentations
OpenTelemetry::Instrumentation.registry.each do |name, instrumentation|
  puts "#{name}: #{instrumentation.installed? ? 'installed' : 'not installed'}"
end
```

### Common Issues

**1. Missing Spans:**
```ruby
# Ensure processors are configured
OpenTelemetry::SDK.configure do |c|
  c.add_span_processor(
    OpenTelemetry::SDK::Trace::Export::BatchSpanProcessor.new(exporter)
  )
end
```

**2. Bundler Issues:**
```bash
bundle update opentelemetry-sdk
bundle install
```

## Migration from X-Ray SDK

```ruby
# Before (X-Ray SDK)
require 'aws-xray-sdk'

XRay.recorder.begin_subsegment 'myOperation'
XRay.recorder.add_annotation :userId, user_id
XRay.recorder.end_subsegment

# After (OpenTelemetry)
require 'opentelemetry/sdk'

tracer.in_span('myOperation') do |span|
  span.set_attribute('userId', user_id)
end
```

## Next Steps

- Review [Cost optimization strategies](/cost-optimization/)
- Learn about [Transaction Search](/implementation/transaction-search)
- Check [Configuration reference](/configuration/reference)

## Additional Resources

- [OpenTelemetry Ruby Documentation](https://opentelemetry.io/docs/instrumentation/ruby/)
- [AWS Distro for OpenTelemetry - Ruby](https://aws-otel.github.io/docs/getting-started/ruby-sdk)
- [Rails OpenTelemetry Guide](https://github.com/open-telemetry/opentelemetry-ruby-contrib/tree/main/instrumentation/rails)
