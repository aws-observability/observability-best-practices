#!/usr/bin/env python3
"""
Simplified AI Observability Demo - No Docker Required
Runs directly on your local machine and sends telemetry to AWS
"""
import os
import sys
import time
import json
import boto3
from datetime import datetime

# Check dependencies
try:
    import requests
except ImportError:
    print("Installing required packages...")
    os.system(f"{sys.executable} -m pip install requests boto3 -q")
    import requests

class SimpleOTELExporter:
    """Simplified OTEL exporter that sends directly to CloudWatch and X-Ray"""
    
    def __init__(self):
        self.cloudwatch = boto3.client('cloudwatch', region_name='us-east-1')
        self.xray = boto3.client('xray', region_name='us-east-1')
        self.logs = boto3.client('logs', region_name='us-east-1')
        self.log_group = '/ai-observability-demo'
        self.log_stream = f'local-demo-{int(time.time())}'
        
        # Create log group and stream
        try:
            self.logs.create_log_group(logGroupName=self.log_group)
        except self.logs.exceptions.ResourceAlreadyExistsException:
            pass
        
        try:
            self.logs.create_log_stream(
                logGroupName=self.log_group,
                logStreamName=self.log_stream
            )
        except self.logs.exceptions.ResourceAlreadyExistsException:
            pass
    
    def send_metrics(self, model, input_tokens, output_tokens, latency_ms, cloud_provider="aws"):
        """Send metrics to CloudWatch"""
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
        except Exception as e:
            print(f"  ⚠️  CloudWatch metrics error: {e}")
    
    def send_trace(self, model, input_tokens, output_tokens, latency_ms):
        """Send trace to X-Ray"""
        try:
            # Generate proper X-Ray trace ID and segment ID
            current_time = int(time.time())
            trace_id = f"1-{hex(current_time)[2:]}-{os.urandom(12).hex()}"
            segment_id = os.urandom(8).hex()
            
            start_time = time.time() - (latency_ms / 1000)
            end_time = time.time()
            
            segment = {
                "name": "ai-observability-demo",
                "id": segment_id,
                "trace_id": trace_id,
                "start_time": start_time,
                "end_time": end_time,
                "annotations": {
                    "model": model,
                    "input_tokens": input_tokens,
                    "output_tokens": output_tokens
                },
                "metadata": {
                    "ai": {
                        "system": "aws.bedrock",
                        "operation": "invoke",
                        "latency_ms": latency_ms
                    }
                },
                "subsegments": []
            }
            
            self.xray.put_trace_segments(
                TraceSegmentDocuments=[json.dumps(segment)]
            )
        except Exception as e:
            print(f"  ⚠️  X-Ray trace error: {e}")
    
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

def invoke_bedrock(prompt, model_id="anthropic.claude-3-haiku-20240307-v1:0", exporter=None):
    """Invoke AWS Bedrock with telemetry"""
    print(f"\n📝 Prompt: {prompt}")
    print(f"🤖 Model: {model_id}")
    
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
        latency_ms = (time.time() - start_time) * 1000
        
        input_tokens = response_body.get('usage', {}).get('input_tokens', 0)
        output_tokens = response_body.get('usage', {}).get('output_tokens', 0)
        
        print(f"✅ Success: {input_tokens} input tokens, {output_tokens} output tokens, {latency_ms:.2f}ms")
        
        # Send telemetry
        if exporter:
            exporter.send_metrics(model_id, input_tokens, output_tokens, latency_ms)
            exporter.send_trace(model_id, input_tokens, output_tokens, latency_ms)
            exporter.send_log(f"Bedrock invocation: {model_id} - {input_tokens}in/{output_tokens}out - {latency_ms:.2f}ms")
        
        return response_body
        
    except Exception as e:
        print(f"❌ Error: {e}")
        if exporter:
            exporter.send_log(f"Error: {str(e)}")
        raise

def main():
    """Run the demo"""
    print("=" * 70)
    print("🚀 AI Observability Demo - Local Mode (No Docker)")
    print("=" * 70)
    print("\nThis demo will:")
    print("  1. Invoke AWS Bedrock Claude models")
    print("  2. Send metrics to CloudWatch")
    print("  3. Send traces to AWS X-Ray")
    print("  4. Send logs to CloudWatch Logs")
    print("\n" + "=" * 70)
    
    # Initialize exporter
    print("\n📊 Initializing telemetry exporter...")
    exporter = SimpleOTELExporter()
    print("✅ Exporter ready")
    
    # Test prompts
    prompts = [
        "Explain quantum computing in one sentence.",
        "What are the benefits of serverless architecture?",
        "Describe the CAP theorem briefly."
    ]
    
    for i, prompt in enumerate(prompts, 1):
        print(f"\n{'=' * 70}")
        print(f"Test {i}/{len(prompts)}")
        print('=' * 70)
        
        try:
            invoke_bedrock(prompt, exporter=exporter)
            time.sleep(2)
        except Exception as e:
            print(f"Skipping due to error: {e}")
    
    print("\n" + "=" * 70)
    print("✅ Demo completed!")
    print("\n📊 View your telemetry:")
    print(f"  • CloudWatch Metrics: https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#metricsV2:graph=~();namespace=AIObservability")
    print(f"  • X-Ray Traces: https://console.aws.amazon.com/xray/home?region=us-east-1#/traces")
    print(f"  • CloudWatch Logs: https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#logsV2:log-groups/log-group/$252Fai-observability-demo")
    print("=" * 70)

if __name__ == "__main__":
    main()
