#!/usr/bin/env python3
"""
Multi-Cloud AI Observability Demo
Simulates LLM invocations across AWS, GCP, Azure, and On-Prem providers
"""
import os
import sys
import time
import json
import random
import boto3
from datetime import datetime

# Check dependencies
try:
    import requests
except ImportError:
    print("Installing required packages...")
    os.system(f"{sys.executable} -m pip install requests boto3 -q")
    import requests

class MultiCloudTelemetryExporter:
    """Sends telemetry to CloudWatch with multi-cloud dimensions"""
    
    def __init__(self):
        self.cloudwatch = boto3.client('cloudwatch', region_name='us-east-1')
        self.logs = boto3.client('logs', region_name='us-east-1')
        self.log_group = '/ai-observability-demo'
        self.log_stream = f'multi-cloud-demo-{int(time.time())}'
        
        # Create log stream
        try:
            self.logs.create_log_stream(
                logGroupName=self.log_group,
                logStreamName=self.log_stream
            )
        except self.logs.exceptions.ResourceAlreadyExistsException:
            pass
    
    def send_metrics(self, model, cloud_provider, input_tokens, output_tokens, latency_ms):
        """Send metrics to CloudWatch with cloud provider dimension"""
        try:
            self.cloudwatch.put_metric_data(
                Namespace='AIObservability',
                MetricData=[
                    {
                        'MetricName': 'InputTokens',
                        'Value': input_tokens,
                        'Unit': 'Count',
                        'Timestamp': datetime.utcnow(),
                        'Dimensions': [
                            {'Name': 'Model', 'Value': model},
                            {'Name': 'CloudProvider', 'Value': cloud_provider}
                        ]
                    },
                    {
                        'MetricName': 'OutputTokens',
                        'Value': output_tokens,
                        'Unit': 'Count',
                        'Timestamp': datetime.utcnow(),
                        'Dimensions': [
                            {'Name': 'Model', 'Value': model},
                            {'Name': 'CloudProvider', 'Value': cloud_provider}
                        ]
                    },
                    {
                        'MetricName': 'Latency',
                        'Value': latency_ms,
                        'Unit': 'Milliseconds',
                        'Timestamp': datetime.utcnow(),
                        'Dimensions': [
                            {'Name': 'Model', 'Value': model},
                            {'Name': 'CloudProvider', 'Value': cloud_provider}
                        ]
                    }
                ]
            )
            print(f"  ✅ Metrics sent to CloudWatch")
        except Exception as e:
            print(f"  ⚠️  CloudWatch metrics error: {e}")
    
    def send_log(self, message):
        """Send log to CloudWatch Logs"""
        try:
            self.logs.put_log_events(
                logGroupName=self.log_group,
                logStreamName=self.log_stream,
                logEvents=[
                    {
                        'timestamp': int(time.time() * 1000),
                        'message': message
                    }
                ]
            )
        except Exception as e:
            print(f"  ⚠️  CloudWatch logs error: {e}")

# Multi-cloud model configurations
CLOUD_PROVIDERS = {
    "aws": {
        "name": "AWS Bedrock",
        "models": [
            {
                "id": "anthropic.claude-3-haiku-20240307-v1:0",
                "name": "Claude 3 Haiku",
                "avg_latency": 1200,
                "input_tokens_range": (20, 50),
                "output_tokens_range": (100, 300)
            },
            {
                "id": "anthropic.claude-3-sonnet-20240229-v1:0",
                "name": "Claude 3 Sonnet",
                "avg_latency": 2500,
                "input_tokens_range": (20, 50),
                "output_tokens_range": (150, 400)
            }
        ]
    },
    "gcp": {
        "name": "Google Vertex AI",
        "models": [
            {
                "id": "gemini-1.5-pro",
                "name": "Gemini 1.5 Pro",
                "avg_latency": 1800,
                "input_tokens_range": (20, 50),
                "output_tokens_range": (120, 350)
            },
            {
                "id": "gemini-1.5-flash",
                "name": "Gemini 1.5 Flash",
                "avg_latency": 800,
                "input_tokens_range": (20, 50),
                "output_tokens_range": (80, 250)
            }
        ]
    },
    "azure": {
        "name": "Azure OpenAI",
        "models": [
            {
                "id": "gpt-4o",
                "name": "GPT-4o",
                "avg_latency": 2200,
                "input_tokens_range": (20, 50),
                "output_tokens_range": (140, 380)
            },
            {
                "id": "gpt-4o-mini",
                "name": "GPT-4o Mini",
                "avg_latency": 1000,
                "input_tokens_range": (20, 50),
                "output_tokens_range": (90, 280)
            }
        ]
    },
    "on-prem": {
        "name": "On-Premises (Ollama)",
        "models": [
            {
                "id": "llama-3.1-70b",
                "name": "Llama 3.1 70B",
                "avg_latency": 3500,
                "input_tokens_range": (20, 50),
                "output_tokens_range": (100, 300)
            },
            {
                "id": "mistral-7b",
                "name": "Mistral 7B",
                "avg_latency": 1500,
                "input_tokens_range": (20, 50),
                "output_tokens_range": (80, 250)
            }
        ]
    }
}

def simulate_llm_invocation(cloud_provider, model_config, prompt, exporter):
    """Simulate an LLM invocation with realistic metrics"""
    
    provider_name = CLOUD_PROVIDERS[cloud_provider]["name"]
    model_name = model_config["name"]
    model_id = model_config["id"]
    
    print(f"\n📝 Prompt: {prompt}")
    print(f"🤖 Model: {model_name} ({provider_name})")
    
    # Simulate processing time
    base_latency = model_config["avg_latency"]
    latency_ms = base_latency + random.randint(-200, 500)
    time.sleep(latency_ms / 1000)
    
    # Generate realistic token counts
    input_tokens = random.randint(*model_config["input_tokens_range"])
    output_tokens = random.randint(*model_config["output_tokens_range"])
    
    print(f"✅ Success: {input_tokens} input tokens, {output_tokens} output tokens, {latency_ms}ms")
    print(f"☁️  Cloud Provider: {cloud_provider.upper()}")
    
    # Send telemetry
    exporter.send_metrics(model_id, cloud_provider, input_tokens, output_tokens, latency_ms)
    exporter.send_log(
        f"{provider_name} - {model_name}: {input_tokens}in/{output_tokens}out - {latency_ms}ms"
    )
    
    return {
        "cloud_provider": cloud_provider,
        "model": model_id,
        "input_tokens": input_tokens,
        "output_tokens": output_tokens,
        "latency_ms": latency_ms
    }

def main():
    """Run multi-cloud demo"""
    print("=" * 80)
    print("🌍 Multi-Cloud AI Observability Demo")
    print("=" * 80)
    print("\nThis demo simulates LLM invocations across:")
    print("  • AWS Bedrock (Claude 3 Haiku, Claude 3 Sonnet)")
    print("  • Google Vertex AI (Gemini 1.5 Pro, Gemini 1.5 Flash)")
    print("  • Azure OpenAI (GPT-4o, GPT-4o Mini)")
    print("  • On-Premises (Llama 3.1 70B, Mistral 7B)")
    print("\nAll telemetry is sent to CloudWatch with cloud provider dimensions.")
    print("=" * 80)
    
    # Initialize exporter
    print("\n📊 Initializing telemetry exporter...")
    exporter = MultiCloudTelemetryExporter()
    print("✅ Exporter ready")
    
    # Test prompts
    prompts = [
        "Explain quantum computing in one sentence.",
        "What are the benefits of serverless architecture?",
        "Describe the CAP theorem briefly.",
        "What is the difference between AI and ML?",
        "Explain microservices architecture."
    ]
    
    # Run invocations across all clouds
    results = []
    iteration = 1
    
    for prompt in prompts:
        print(f"\n{'=' * 80}")
        print(f"Test {iteration}/{len(prompts)}")
        print('=' * 80)
        
        # Randomly select a cloud provider and model
        cloud_provider = random.choice(list(CLOUD_PROVIDERS.keys()))
        model_config = random.choice(CLOUD_PROVIDERS[cloud_provider]["models"])
        
        try:
            result = simulate_llm_invocation(cloud_provider, model_config, prompt, exporter)
            results.append(result)
            time.sleep(1)
        except Exception as e:
            print(f"❌ Error: {e}")
        
        iteration += 1
    
    # Summary
    print("\n" + "=" * 80)
    print("📊 Multi-Cloud Invocation Summary")
    print("=" * 80)
    
    # Group by cloud provider
    by_cloud = {}
    for result in results:
        cloud = result['cloud_provider']
        if cloud not in by_cloud:
            by_cloud[cloud] = []
        by_cloud[cloud].append(result)
    
    for cloud, invocations in by_cloud.items():
        provider_name = CLOUD_PROVIDERS[cloud]["name"]
        count = len(invocations)
        total_tokens = sum(inv['input_tokens'] + inv['output_tokens'] for inv in invocations)
        avg_latency = sum(inv['latency_ms'] for inv in invocations) / count
        
        print(f"\n{provider_name} ({cloud.upper()}):")
        print(f"  • Invocations: {count}")
        print(f"  • Total Tokens: {total_tokens}")
        print(f"  • Avg Latency: {avg_latency:.0f}ms")
    
    print("\n" + "=" * 80)
    print("✅ Multi-cloud demo completed!")
    print("\n📊 View your telemetry:")
    print("  • CloudWatch Dashboard: https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#dashboards:name=AI-Observability-Demo")
    print("  • Grafana: https://g-45577447e2.grafana-workspace.us-east-1.amazonaws.com")
    print("\n💡 In Grafana, use the Cloud Provider filter to see data by provider!")
    print("=" * 80)

if __name__ == "__main__":
    main()
