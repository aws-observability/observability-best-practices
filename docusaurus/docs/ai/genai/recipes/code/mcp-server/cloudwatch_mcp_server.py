#!/usr/bin/env python3
"""
CloudWatch MCP Server for AI Observability
Enables natural language queries against Amazon CloudWatch metrics
"""
import json
import sys
from datetime import datetime, timedelta
import boto3

class CloudWatchMCPServer:
    def __init__(self):
        self.region = "us-east-1"
        self.namespace = "AIObservability"
        self.cloudwatch = boto3.client('cloudwatch', region_name=self.region)
        
    def _get_metric_statistics(self, metric_name, dimensions, statistic, period=300, hours=1):
        """Query CloudWatch for metric statistics"""
        end_time = datetime.utcnow()
        start_time = end_time - timedelta(hours=hours)
        
        try:
            response = self.cloudwatch.get_metric_statistics(
                Namespace=self.namespace,
                MetricName=metric_name,
                Dimensions=dimensions,
                StartTime=start_time,
                EndTime=end_time,
                Period=period,
                Statistics=[statistic]
            )
            
            return response.get('Datapoints', [])
        except Exception as e:
            return {"error": str(e)}
    
    def _list_dimension_values(self, metric_name, dimension_name):
        """List all unique values for a dimension"""
        try:
            response = self.cloudwatch.list_metrics(
                Namespace=self.namespace,
                MetricName=metric_name
            )
            
            values = set()
            for metric in response.get('Metrics', []):
                for dim in metric.get('Dimensions', []):
                    if dim['Name'] == dimension_name:
                        values.add(dim['Value'])
            
            return sorted(list(values))
        except Exception as e:
            return {"error": str(e)}
    
    def get_token_usage(self, model=None, token_type="input", hours=1):
        """Get token usage by model
        
        Args:
            model: Model name (e.g., 'anthropic.claude-3-haiku-20240307-v1:0') or None for all
            token_type: 'input' or 'output'
            hours: Time range in hours (default: 1)
        """
        metric_name = f"{token_type.capitalize()}Tokens"
        
        if model:
            # Query across all cloud providers for this model
            providers = self._list_dimension_values(metric_name, 'CloudProvider')
            total = 0
            for provider in providers:
                dimensions = [
                    {'Name': 'Model', 'Value': model},
                    {'Name': 'CloudProvider', 'Value': provider}
                ]
                datapoints = self._get_metric_statistics(metric_name, dimensions, 'Sum', hours=hours)
                total += sum(dp.get('Sum', 0) for dp in datapoints)
            
            return {
                "model": model,
                "token_type": token_type,
                "total_tokens": total,
                "time_range_hours": hours
            }
        else:
            # Get all models across all cloud providers
            response = self.cloudwatch.list_metrics(
                Namespace=self.namespace,
                MetricName=metric_name
            )
            
            # Aggregate by model across all providers
            model_totals = {}
            for metric in response.get('Metrics', []):
                dimensions = {d['Name']: d['Value'] for d in metric.get('Dimensions', [])}
                model_name = dimensions.get('Model')
                provider = dimensions.get('CloudProvider')
                
                if model_name and provider:
                    dims = [
                        {'Name': 'Model', 'Value': model_name},
                        {'Name': 'CloudProvider', 'Value': provider}
                    ]
                    datapoints = self._get_metric_statistics(metric_name, dims, 'Sum', hours=hours)
                    total = sum(dp.get('Sum', 0) for dp in datapoints)
                    
                    if model_name not in model_totals:
                        model_totals[model_name] = 0
                    model_totals[model_name] += total
            
            results = [
                {"model": model, "total_tokens": int(total)}
                for model, total in model_totals.items()
            ]
            
            # Sort by token usage
            results.sort(key=lambda x: x['total_tokens'], reverse=True)
            
            return {
                "token_type": token_type,
                "time_range_hours": hours,
                "models": results
            }
    
    def get_model_latency(self, model=None, hours=1):
        """Get latency statistics by model
        
        Args:
            model: Model name or None for all
            hours: Time range in hours (default: 1)
        """
        metric_name = "Latency"
        
        if model:
            # Query across all cloud providers for this model
            providers = self._list_dimension_values(metric_name, 'CloudProvider')
            all_datapoints = []
            for provider in providers:
                dimensions = [
                    {'Name': 'Model', 'Value': model},
                    {'Name': 'CloudProvider', 'Value': provider}
                ]
                datapoints = self._get_metric_statistics(metric_name, dimensions, 'Average', hours=hours)
                all_datapoints.extend(datapoints)
            
            if all_datapoints:
                avg_latency = sum(dp.get('Average', 0) for dp in all_datapoints) / len(all_datapoints)
                max_latency = max(dp.get('Average', 0) for dp in all_datapoints)
                min_latency = min(dp.get('Average', 0) for dp in all_datapoints)
            else:
                avg_latency = max_latency = min_latency = 0
            
            return {
                "model": model,
                "avg_latency_ms": round(avg_latency, 2),
                "max_latency_ms": round(max_latency, 2),
                "min_latency_ms": round(min_latency, 2),
                "time_range_hours": hours,
                "datapoints": len(all_datapoints)
            }
        else:
            # Get all models across all cloud providers
            response = self.cloudwatch.list_metrics(
                Namespace=self.namespace,
                MetricName=metric_name
            )
            
            # Aggregate by model across all providers
            model_latencies = {}
            for metric in response.get('Metrics', []):
                dimensions = {d['Name']: d['Value'] for d in metric.get('Dimensions', [])}
                model_name = dimensions.get('Model')
                provider = dimensions.get('CloudProvider')
                
                if model_name and provider:
                    dims = [
                        {'Name': 'Model', 'Value': model_name},
                        {'Name': 'CloudProvider', 'Value': provider}
                    ]
                    datapoints = self._get_metric_statistics(metric_name, dims, 'Average', hours=hours)
                    
                    if datapoints:
                        avg = sum(dp.get('Average', 0) for dp in datapoints) / len(datapoints)
                        
                        if model_name not in model_latencies:
                            model_latencies[model_name] = []
                        model_latencies[model_name].extend([dp.get('Average', 0) for dp in datapoints])
            
            results = []
            for model_name, latencies in model_latencies.items():
                if latencies:
                    avg_latency = sum(latencies) / len(latencies)
                    results.append({
                        "model": model_name,
                        "avg_latency_ms": round(avg_latency, 2)
                    })
            
            # Sort by latency
            results.sort(key=lambda x: x['avg_latency_ms'], reverse=True)
            
            return {
                "time_range_hours": hours,
                "models": results
            }
    
    def get_request_count(self, model=None, hours=1):
        """Get total request count
        
        Args:
            model: Model name or None for all
            hours: Time range in hours (default: 1)
        """
        metric_name = "InputTokens"
        
        if model:
            # Query across all cloud providers for this model
            providers = self._list_dimension_values(metric_name, 'CloudProvider')
            total = 0
            for provider in providers:
                dimensions = [
                    {'Name': 'Model', 'Value': model},
                    {'Name': 'CloudProvider', 'Value': provider}
                ]
                datapoints = self._get_metric_statistics(metric_name, dimensions, 'SampleCount', hours=hours)
                total += sum(dp.get('SampleCount', 0) for dp in datapoints)
            
            return {
                "model": model,
                "total_requests": int(total),
                "time_range_hours": hours
            }
        else:
            # Get all models across all cloud providers
            response = self.cloudwatch.list_metrics(
                Namespace=self.namespace,
                MetricName=metric_name
            )
            
            # Aggregate by model across all providers
            model_requests = {}
            for metric in response.get('Metrics', []):
                dimensions = {d['Name']: d['Value'] for d in metric.get('Dimensions', [])}
                model_name = dimensions.get('Model')
                provider = dimensions.get('CloudProvider')
                
                if model_name and provider:
                    dims = [
                        {'Name': 'Model', 'Value': model_name},
                        {'Name': 'CloudProvider', 'Value': provider}
                    ]
                    datapoints = self._get_metric_statistics(metric_name, dims, 'SampleCount', hours=hours)
                    total = sum(dp.get('SampleCount', 0) for dp in datapoints)
                    
                    if model_name not in model_requests:
                        model_requests[model_name] = 0
                    model_requests[model_name] += total
            
            results = [
                {"model": model, "total_requests": int(total)}
                for model, total in model_requests.items()
            ]
            
            results.sort(key=lambda x: x['total_requests'], reverse=True)
            
            return {
                "time_range_hours": hours,
                "models": results
            }
    
    def get_cost_estimate(self, hours=1):
        """Estimate cost based on token usage
        
        Args:
            hours: Time range in hours (default: 1)
        """
        # Get input and output tokens for all models
        input_data = self.get_token_usage(token_type="input", hours=hours)
        output_data = self.get_token_usage(token_type="output", hours=hours)
        
        # Cost per 1M tokens (example rates for Claude 3 Haiku)
        cost_per_1m_input = 0.25
        cost_per_1m_output = 1.25
        
        results = []
        for model_input in input_data.get('models', []):
            model_name = model_input['model']
            input_tokens = model_input['total_tokens']
            
            # Find matching output tokens
            output_tokens = 0
            for model_output in output_data.get('models', []):
                if model_output['model'] == model_name:
                    output_tokens = model_output['total_tokens']
                    break
            
            # Calculate cost
            input_cost = (input_tokens / 1_000_000) * cost_per_1m_input
            output_cost = (output_tokens / 1_000_000) * cost_per_1m_output
            total_cost = input_cost + output_cost
            
            results.append({
                "model": model_name,
                "input_tokens": int(input_tokens),
                "output_tokens": int(output_tokens),
                "estimated_cost_usd": round(total_cost, 4)
            })
        
        total_cost = sum(r['estimated_cost_usd'] for r in results)
        
        return {
            "time_range_hours": hours,
            "total_estimated_cost_usd": round(total_cost, 4),
            "cost_breakdown": results,
            "note": "Costs are estimates based on Claude 3 Haiku pricing ($0.25/$1.25 per 1M tokens)"
        }
    
    def compare_models(self, hours=1):
        """Compare latency and usage across all models
        
        Args:
            hours: Time range in hours (default: 1)
        """
        latency = self.get_model_latency(hours=hours)
        input_tokens = self.get_token_usage(token_type="input", hours=hours)
        output_tokens = self.get_token_usage(token_type="output", hours=hours)
        requests = self.get_request_count(hours=hours)
        
        return {
            "time_range_hours": hours,
            "latency": latency,
            "input_tokens": input_tokens,
            "output_tokens": output_tokens,
            "requests": requests
        }
    
    def handle_tool_call(self, tool_name, arguments):
        """Handle MCP tool requests"""
        handlers = {
            "get_token_usage": self.get_token_usage,
            "get_model_latency": self.get_model_latency,
            "get_request_count": self.get_request_count,
            "get_cost_estimate": self.get_cost_estimate,
            "compare_models": self.compare_models
        }
        
        handler = handlers.get(tool_name)
        if not handler:
            return {"error": f"Unknown tool: {tool_name}"}
        
        try:
            return handler(**arguments)
        except Exception as e:
            return {"error": str(e)}

def main():
    """MCP Server main loop"""
    server = CloudWatchMCPServer()
    
    # MCP protocol: read JSON-RPC requests from stdin
    for line in sys.stdin:
        try:
            request = json.loads(line.strip())
            
            if request.get("method") == "initialize":
                # Handle initialization
                response = {
                    "jsonrpc": "2.0",
                    "id": request.get("id"),
                    "result": {
                        "protocolVersion": "2024-11-05",
                        "capabilities": {
                            "tools": {}
                        },
                        "serverInfo": {
                            "name": "ai-observability",
                            "version": "1.0.0"
                        }
                    }
                }
            elif request.get("method") == "tools/list":
                # Return available tools
                response = {
                    "jsonrpc": "2.0",
                    "id": request.get("id"),
                    "result": {
                        "tools": [
                            {
                                "name": "get_token_usage",
                                "description": "Get token usage (input or output) by model over a time range",
                                "inputSchema": {
                                    "type": "object",
                                    "properties": {
                                        "model": {"type": "string", "description": "Model name (optional, returns all if omitted)"},
                                        "token_type": {"type": "string", "enum": ["input", "output"], "default": "input"},
                                        "hours": {"type": "number", "default": 1, "description": "Time range in hours"}
                                    }
                                }
                            },
                            {
                                "name": "get_model_latency",
                                "description": "Get latency statistics (avg, min, max) by model",
                                "inputSchema": {
                                    "type": "object",
                                    "properties": {
                                        "model": {"type": "string", "description": "Model name (optional, returns all if omitted)"},
                                        "hours": {"type": "number", "default": 1, "description": "Time range in hours"}
                                    }
                                }
                            },
                            {
                                "name": "get_request_count",
                                "description": "Get total request count by model",
                                "inputSchema": {
                                    "type": "object",
                                    "properties": {
                                        "model": {"type": "string", "description": "Model name (optional, returns all if omitted)"},
                                        "hours": {"type": "number", "default": 1, "description": "Time range in hours"}
                                    }
                                }
                            },
                            {
                                "name": "get_cost_estimate",
                                "description": "Estimate cost based on token usage (uses Claude 3 Haiku pricing)",
                                "inputSchema": {
                                    "type": "object",
                                    "properties": {
                                        "hours": {"type": "number", "default": 1, "description": "Time range in hours"}
                                    }
                                }
                            },
                            {
                                "name": "compare_models",
                                "description": "Compare latency, token usage, and request counts across all models",
                                "inputSchema": {
                                    "type": "object",
                                    "properties": {
                                        "hours": {"type": "number", "default": 1, "description": "Time range in hours"}
                                    }
                                }
                            }
                        ]
                    }
                }
            elif request.get("method") == "tools/call":
                # Execute tool
                tool_name = request.get("params", {}).get("name")
                arguments = request.get("params", {}).get("arguments", {})
                
                result = server.handle_tool_call(tool_name, arguments)
                
                response = {
                    "jsonrpc": "2.0",
                    "id": request.get("id"),
                    "result": {
                        "content": [
                            {
                                "type": "text",
                                "text": json.dumps(result, indent=2)
                            }
                        ]
                    }
                }
            else:
                response = {
                    "jsonrpc": "2.0",
                    "id": request.get("id"),
                    "error": {"code": -32601, "message": "Method not found"}
                }
            
            print(json.dumps(response), flush=True)
            
        except Exception as e:
            error_response = {
                "jsonrpc": "2.0",
                "id": request.get("id") if 'request' in locals() else None,
                "error": {"code": -32603, "message": str(e)}
            }
            print(json.dumps(error_response), flush=True)

if __name__ == "__main__":
    main()
