#!/usr/bin/env python3
"""
Test individual AWS Observability services without MCP dependency
"""

import json
from services.cloudwatch_logs import analyze_log_retention_optimization
from services.aws_rum import analyze_rum_performance

def test_cloudwatch_logs():
    """Test CloudWatch Logs service directly."""
    print("Testing CloudWatch Logs service...")
    
    try:
        result = analyze_log_retention_optimization(region="us-east-1")
        print(f"Result: {json.dumps(result, indent=2)}")
        return True
    except Exception as e:
        print(f"Error: {e}")
        return False

def test_aws_rum():
    """Test AWS RUM service directly."""
    print("Testing AWS RUM service...")
    
    try:
        result = analyze_rum_performance("test-app", region="us-east-1")
        print(f"Result: {json.dumps(result, indent=2)}")
        return True
    except Exception as e:
        print(f"Error: {e}")
        return False

if __name__ == "__main__":
    test_cloudwatch_logs()
    test_aws_rum()
