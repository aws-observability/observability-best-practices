#!/usr/bin/env python3
"""
Prometheus MCP Server for AI Observability
Enables natural language queries against Amazon Managed Prometheus
"""
import os
import json
import sys
from datetime import datetime, timedelta
import boto3
from botocore.auth import SigV4Auth
from botocore.awsrequest import AWSRequest
import requests

class PrometheusMCPServer:
    def __init__(self):
        self.amp_endpoint = os.getenv("AMP_ENDPOINT")
        self.region = os.getenv("AWS_REGION", "us-east-1")
        self.session = boto3.Session()
        
    def _sign_request(self, url, method="GET", body=None):
        """Sign request with SigV4 for AMP"""
        credentials = self.session.get_credentials()
        request = AWSRequest(method=method, url=url, data=body)
        SigV4Auth(credentials, "aps", self.region).add_auth(request)
        return dict(request.headers)
    
    def _query_prometheus(self, query, time_range="1h"):
        """Execute PromQL query against AMP"""
        url = f"{self.amp_endpoint}/api/v1/query"
        params = {"query": query}
        
        headers = self._sign_request(url)
        response = requests.get(url, params=params, headers=headers)
        response.raise_for_status()
        
        return response.json()
    
    def get_token_usage(self, model=None, token_type="input", time_range="1h"):
        """Get token usage by model"""
        metric = f"gen_ai_usage_{token_type}_tokens_total"
        
        if model:
            query = f'sum(rate({metric}{{gen_ai_request_model="{model}"}}[{time_range}]))'
        else:
            query = f'sum by (gen_ai_request_model) (rate({metric}[{time_range}]))'
        
        result = self._query_prometheus(query, time_range)
        return self._format_result(result)
    
    def get_model_latency(self, model=None, percentile=95, time_range="1h"):
        """Get latency percentile by model"""
        metric = "gen_ai_request_duration"
        
        if model:
            query = f'histogram_quantile(0.{percentile}, rate({metric}_bucket{{gen_ai_request_model="{model}"}}[{time_range}]))'
        else:
            query = f'histogram_quantile(0.{percentile}, sum by (gen_ai_request_model, le) (rate({metric}_bucket[{time_range}])))'
        
        result = self._query_prometheus(query, time_range)
        return self._format_result(result)
    
    def get_throttle_events(self, model=None, time_range="1h"):
        """Get throttle event counts"""
        # This would track 429 errors or throttle-specific metrics
        query = 'sum by (gen_ai_request_model) (rate(gen_ai_request_errors_total{error_type="throttle"}[' + time_range + ']))'
        
        result = self._query_prometheus(query, time_range)
        return self._format_result(result)
    
    def get_cost_estimate(self, time_range="1h"):
        """Estimate cost based on token usage"""
        # Simplified cost calculation (adjust rates as needed)
        input_query = f'sum by (gen_ai_request_model) (rate(gen_ai_usage_input_tokens_total[{time_range}]))'
        output_query = f'sum by (gen_ai_request_model) (rate(gen_ai_usage_output_tokens_total[{time_range}]))'
        
        input_result = self._query_prometheus(input_query, time_range)
        output_result = self._query_prometheus(output_query, time_range)
        
        # Cost per 1M tokens (example rates)
        cost_map = {
            "anthropic.claude-3-haiku": {"input": 0.25, "output": 1.25},
            "anthropic.claude-3-sonnet": {"input": 3.00, "output": 15.00},
        }
        
        return {
            "input_tokens": self._format_result(input_result),
            "output_tokens": self._format_result(output_result),
            "cost_rates": cost_map
        }
    
    def compare_models(self, time_range="1h"):
        """Compare latency and usage across all models"""
        latency = self.get_model_latency(time_range=time_range)
        input_tokens = self.get_token_usage(token_type="input", time_range=time_range)
        output_tokens = self.get_token_usage(token_type="output", time_range=time_range)
        
        return {
            "latency_p95_ms": latency,
            "input_tokens_per_sec": input_tokens,
            "output_tokens_per_sec": output_tokens
        }
    
    def _format_result(self, result):
        """Format Prometheus result for readability"""
        if result.get("status") != "success":
            return {"error": "Query failed"}
        
        data = result.get("data", {}).get("result", [])
        
        formatted = []
        for item in data:
            metric = item.get("metric", {})
            value = item.get("value", [None, "0"])
            
            formatted.append({
                "labels": metric,
                "value": float(value[1]) if len(value) > 1 else 0,
                "timestamp": value[0] if len(value) > 0 else None
            })
        
        return formatted
    
    def handle_request(self, method, params):
        """Handle MCP tool requests"""
        handlers = {
            "get_token_usage": self.get_token_usage,
            "get_model_latency": self.get_model_latency,
            "get_throttle_events": self.get_throttle_events,
            "get_cost_estimate": self.get_cost_estimate,
            "compare_models": self.compare_models
        }
        
        handler = handlers.get(method)
        if not handler:
            return {"error": f"Unknown method: {method}"}
        
        try:
            return handler(**params)
        except Exception as e:
            return {"error": str(e)}

def main():
    """MCP Server main loop"""
    server = PrometheusMCPServer()
    
    # Read requests from stdin (MCP protocol)
    for line in sys.stdin:
        try:
            request = json.loads(line)
            method = request.get("method")
            params = request.get("params", {})
            
            result = server.handle_request(method, params)
            
            response = {
                "jsonrpc": "2.0",
                "id": request.get("id"),
                "result": result
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
