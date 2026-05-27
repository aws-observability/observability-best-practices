#!/usr/bin/env python3
"""
AI Observability Demo Application
Demonstrates OpenTelemetry instrumentation for LLM workloads
"""
import os
import time
import boto3
from opentelemetry import trace, metrics
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.sdk.metrics import MeterProvider
from opentelemetry.sdk.metrics.export import PeriodicExportingMetricReader
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.exporter.otlp.proto.grpc.metric_exporter import OTLPMetricExporter
from opentelemetry.sdk.resources import Resource
from opentelemetry.semconv.resource import ResourceAttributes
import requests
import json

# Configure OpenTelemetry
resource = Resource(attributes={
    ResourceAttributes.SERVICE_NAME: "ai-observability-demo",
    ResourceAttributes.SERVICE_VERSION: "1.0.0",
})

# Setup tracing
trace_provider = TracerProvider(resource=resource)
otlp_trace_exporter = OTLPSpanExporter(
    endpoint=os.getenv("OTEL_EXPORTER_OTLP_ENDPOINT", "otel-collector:4317"),
    insecure=True
)
trace_provider.add_span_processor(BatchSpanProcessor(otlp_trace_exporter))
trace.set_tracer_provider(trace_provider)
tracer = trace.get_tracer(__name__)

# Setup metrics
otlp_metric_exporter = OTLPMetricExporter(
    endpoint=os.getenv("OTEL_EXPORTER_OTLP_ENDPOINT", "otel-collector:4317"),
    insecure=True
)
metric_reader = PeriodicExportingMetricReader(otlp_metric_exporter, export_interval_millis=5000)
meter_provider = MeterProvider(resource=resource, metric_readers=[metric_reader])
metrics.set_meter_provider(meter_provider)
meter = metrics.get_meter(__name__)

# Create metrics
token_counter = meter.create_counter(
    "gen_ai.usage.input_tokens.total",
    description="Total input tokens consumed",
    unit="tokens"
)
output_token_counter = meter.create_counter(
    "gen_ai.usage.output_tokens.total",
    description="Total output tokens generated",
    unit="tokens"
)
latency_histogram = meter.create_histogram(
    "gen_ai.request.duration",
    description="LLM request duration",
    unit="ms"
)

def invoke_bedrock(prompt: str, model_id: str = "anthropic.claude-3-haiku-20240307-v1:0"):
    """Invoke AWS Bedrock with OpenTelemetry instrumentation"""
    with tracer.start_as_current_span("bedrock.invoke") as span:
        span.set_attribute("gen_ai.system", "aws.bedrock")
        span.set_attribute("gen_ai.request.model", model_id)
        span.set_attribute("gen_ai.operation.name", "invoke")
        
        start_time = time.time()
        
        try:
            bedrock = boto3.client('bedrock-runtime', region_name='us-east-1')
            
            body = json.dumps({
                "anthropic_version": "bedrock-2023-05-31",
                "max_tokens": 1024,
                "messages": [{"role": "user", "content": prompt}]
            })
            
            response = bedrock.invoke_model(
                modelId=model_id,
                body=body
            )
            
            response_body = json.loads(response['body'].read())
            
            # Extract token usage
            input_tokens = response_body.get('usage', {}).get('input_tokens', 0)
            output_tokens = response_body.get('usage', {}).get('output_tokens', 0)
            
            # Record metrics
            duration_ms = (time.time() - start_time) * 1000
            
            token_counter.add(input_tokens, {
                "gen_ai.request.model": model_id,
                "cloud.provider": "aws"
            })
            output_token_counter.add(output_tokens, {
                "gen_ai.request.model": model_id,
                "cloud.provider": "aws"
            })
            latency_histogram.record(duration_ms, {
                "gen_ai.request.model": model_id,
                "cloud.provider": "aws"
            })
            
            # Add span attributes
            span.set_attribute("gen_ai.usage.input_tokens", input_tokens)
            span.set_attribute("gen_ai.usage.output_tokens", output_tokens)
            span.set_attribute("gen_ai.response.finish_reason", response_body.get('stop_reason', 'unknown'))
            
            print(f"✓ Bedrock {model_id}: {input_tokens} input tokens, {output_tokens} output tokens, {duration_ms:.2f}ms")
            
            return response_body
            
        except Exception as e:
            span.set_attribute("error", True)
            span.set_attribute("error.message", str(e))
            print(f"✗ Bedrock error: {e}")
            raise

def invoke_litellm(prompt: str, model: str = "bedrock/anthropic.claude-3-haiku-20240307-v1:0"):
    """Invoke LiteLLM proxy with OpenTelemetry instrumentation"""
    with tracer.start_as_current_span("litellm.invoke") as span:
        span.set_attribute("gen_ai.system", "litellm")
        span.set_attribute("gen_ai.request.model", model)
        span.set_attribute("gen_ai.operation.name", "chat.completions")
        
        start_time = time.time()
        
        try:
            litellm_url = os.getenv("LITELLM_URL", "http://litellm-proxy:4000")
            api_key = os.getenv("LITELLM_API_KEY", "demo-master-key")
            
            response = requests.post(
                f"{litellm_url}/chat/completions",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": model,
                    "messages": [{"role": "user", "content": prompt}],
                    "max_tokens": 1024
                },
                timeout=30
            )
            
            response.raise_for_status()
            data = response.json()
            
            # Extract token usage
            usage = data.get('usage', {})
            input_tokens = usage.get('prompt_tokens', 0)
            output_tokens = usage.get('completion_tokens', 0)
            
            # Record metrics
            duration_ms = (time.time() - start_time) * 1000
            
            cloud_provider = "azure" if "azure" in model else "aws"
            
            token_counter.add(input_tokens, {
                "gen_ai.request.model": model,
                "cloud.provider": cloud_provider
            })
            output_token_counter.add(output_tokens, {
                "gen_ai.request.model": model,
                "cloud.provider": cloud_provider
            })
            latency_histogram.record(duration_ms, {
                "gen_ai.request.model": model,
                "cloud.provider": cloud_provider
            })
            
            # Add span attributes
            span.set_attribute("gen_ai.usage.input_tokens", input_tokens)
            span.set_attribute("gen_ai.usage.output_tokens", output_tokens)
            
            print(f"✓ LiteLLM {model}: {input_tokens} input tokens, {output_tokens} output tokens, {duration_ms:.2f}ms")
            
            return data
            
        except Exception as e:
            span.set_attribute("error", True)
            span.set_attribute("error.message", str(e))
            print(f"✗ LiteLLM error: {e}")
            raise

def main():
    """Run demo workload"""
    print("🚀 Starting AI Observability Demo...")
    print("=" * 60)
    
    prompts = [
        "Explain quantum computing in one sentence.",
        "What are the benefits of serverless architecture?",
        "Describe the CAP theorem briefly."
    ]
    
    for i, prompt in enumerate(prompts, 1):
        print(f"\n📝 Prompt {i}: {prompt}")
        
        try:
            # Invoke Bedrock directly
            invoke_bedrock(prompt)
            time.sleep(1)
            
            # Invoke via LiteLLM proxy
            invoke_litellm(prompt)
            time.sleep(2)
            
        except Exception as e:
            print(f"Error processing prompt: {e}")
    
    print("\n" + "=" * 60)
    print("✅ Demo completed. Check Grafana for metrics and traces!")
    
    # Keep running to allow metrics to be exported
    print("⏳ Waiting 10 seconds for final metric export...")
    time.sleep(10)

if __name__ == "__main__":
    main()
