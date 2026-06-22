#!/usr/bin/env python3
"""
Fix CloudWatch Dashboard to show all models and cloud providers
"""
import boto3
import json

def fix_dashboard():
    cloudwatch = boto3.client('cloudwatch', region_name='us-east-1')
    
    # Get all available models and cloud providers from metrics
    print("🔍 Discovering available models and cloud providers...")
    
    response = cloudwatch.list_metrics(
        Namespace='AIObservability',
        MetricName='InputTokens'
    )
    
    models_by_provider = {}
    for metric in response.get('Metrics', []):
        dimensions = {d['Name']: d['Value'] for d in metric.get('Dimensions', [])}
        model = dimensions.get('Model')
        provider = dimensions.get('CloudProvider')
        
        if model and provider:
            if provider not in models_by_provider:
                models_by_provider[provider] = []
            if model not in models_by_provider[provider]:
                models_by_provider[provider].append(model)
    
    print(f"✅ Found {len(models_by_provider)} cloud providers:")
    for provider, models in models_by_provider.items():
        print(f"   • {provider.upper()}: {len(models)} models")
    
    # Build dashboard with all models
    widgets = []
    y_position = 0
    
    # Widget 1: Input Tokens by Cloud Provider (all models)
    input_metrics = []
    for provider, models in models_by_provider.items():
        for model in models:
            input_metrics.append([
                "AIObservability", "InputTokens", 
                "Model", model, 
                "CloudProvider", provider,
                {"stat": "Sum", "label": f"{provider.upper()}: {model.split('.')[-1] if '.' in model else model}"}
            ])
    
    if input_metrics:
        widgets.append({
            "type": "metric",
            "x": 0,
            "y": y_position,
            "width": 12,
            "height": 6,
            "properties": {
                "metrics": input_metrics,
                "view": "timeSeries",
                "stacked": False,
                "region": "us-east-1",
                "title": "Input Tokens - All Models & Providers",
                "period": 300,
                "yAxis": {"left": {"label": "Tokens"}}
            }
        })
    
    # Widget 2: Output Tokens by Cloud Provider (all models)
    output_metrics = []
    for provider, models in models_by_provider.items():
        for model in models:
            output_metrics.append([
                "AIObservability", "OutputTokens", 
                "Model", model, 
                "CloudProvider", provider,
                {"stat": "Sum", "label": f"{provider.upper()}: {model.split('.')[-1] if '.' in model else model}"}
            ])
    
    if output_metrics:
        widgets.append({
            "type": "metric",
            "x": 12,
            "y": y_position,
            "width": 12,
            "height": 6,
            "properties": {
                "metrics": output_metrics,
                "view": "timeSeries",
                "stacked": False,
                "region": "us-east-1",
                "title": "Output Tokens - All Models & Providers",
                "period": 300,
                "yAxis": {"left": {"label": "Tokens"}}
            }
        })
    
    y_position += 6
    
    # Widget 3: Latency by Cloud Provider (all models)
    latency_metrics = []
    for provider, models in models_by_provider.items():
        for model in models:
            latency_metrics.append([
                "AIObservability", "Latency", 
                "Model", model, 
                "CloudProvider", provider,
                {"stat": "Average", "label": f"{provider.upper()}: {model.split('.')[-1] if '.' in model else model}"}
            ])
    
    if latency_metrics:
        widgets.append({
            "type": "metric",
            "x": 0,
            "y": y_position,
            "width": 24,
            "height": 6,
            "properties": {
                "metrics": latency_metrics,
                "view": "timeSeries",
                "stacked": False,
                "region": "us-east-1",
                "title": "Latency (ms) - All Models & Providers",
                "period": 300,
                "yAxis": {"left": {"label": "Milliseconds"}}
            }
        })
    
    y_position += 6
    
    # Widget 4: Total Requests by Provider (Number Widget)
    request_metrics = []
    for provider, models in models_by_provider.items():
        for model in models:
            model_short = model.split('.')[-1] if '.' in model else model
            request_metrics.append([
                "AIObservability", "InputTokens", 
                "Model", model, 
                "CloudProvider", provider,
                {"stat": "SampleCount", "label": f"{provider.upper()}: {model_short}", "period": 300}
            ])
    
    if request_metrics:
        widgets.append({
            "type": "metric",
            "x": 0,
            "y": y_position,
            "width": 12,
            "height": 6,
            "properties": {
                "metrics": request_metrics,
                "view": "singleValue",
                "region": "us-east-1",
                "title": "Request Count by Provider (Last 5 min)",
                "period": 300,
                "stat": "SampleCount",
                "setPeriodToTimeRange": False
            }
        })
    
    # Widget 5: Total Token Usage - Time Series with shorter period
    summary_metrics = []
    
    # Add all input token metrics
    for provider, models in models_by_provider.items():
        for model in models:
            model_short = model.split('.')[-1] if '.' in model else model
            summary_metrics.append([
                "AIObservability", "InputTokens", 
                "Model", model, 
                "CloudProvider", provider,
                {"stat": "Sum", "label": f"{provider.upper()}: {model_short} (Input)"}
            ])
    
    # Add all output token metrics
    for provider, models in models_by_provider.items():
        for model in models:
            model_short = model.split('.')[-1] if '.' in model else model
            summary_metrics.append([
                "AIObservability", "OutputTokens", 
                "Model", model, 
                "CloudProvider", provider,
                {"stat": "Sum", "label": f"{provider.upper()}: {model_short} (Output)"}
            ])
    
    if summary_metrics:
        widgets.append({
            "type": "metric",
            "x": 12,
            "y": y_position,
            "width": 12,
            "height": 6,
            "properties": {
                "metrics": summary_metrics,
                "view": "timeSeries",
                "stacked": False,
                "region": "us-east-1",
                "title": "Total Token Usage by Model (Input + Output)",
                "period": 300,
                "stat": "Sum",
                "yAxis": {"left": {"label": "Tokens"}},
                "legend": {"position": "bottom"}
            }
        })
    
    y_position += 6
    
    # Widget 6: Recent Logs
    widgets.append({
        "type": "log",
        "x": 0,
        "y": y_position,
        "width": 24,
        "height": 6,
        "properties": {
            "query": "SOURCE '/ai-observability-demo'\n| fields @timestamp, @message\n| sort @timestamp desc\n| limit 20",
            "region": "us-east-1",
            "title": "Recent Logs",
            "stacked": False
        }
    })
    
    dashboard_body = {"widgets": widgets}
    
    try:
        cloudwatch.put_dashboard(
            DashboardName='AI-Observability-Demo',
            DashboardBody=json.dumps(dashboard_body)
        )
        print("\n✅ CloudWatch dashboard fixed successfully!")
        print(f"\n📊 Dashboard now shows:")
        print(f"   • {len(input_metrics)} input token metrics")
        print(f"   • {len(output_metrics)} output token metrics")
        print(f"   • {len(latency_metrics)} latency metrics")
        print(f"   • Across {len(models_by_provider)} cloud providers")
        print("\n🔗 View dashboard:")
        print("https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#dashboards:name=AI-Observability-Demo")
    except Exception as e:
        print(f"❌ Error updating dashboard: {e}")

if __name__ == "__main__":
    fix_dashboard()
