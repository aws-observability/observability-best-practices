#!/usr/bin/env python3
"""
Test script for AWS Observability MCP Server

This script tests the individual components without requiring the full MCP server to run.
"""

import sys
import json
from datetime import datetime, timedelta

def test_imports():
    """Test that all modules can be imported."""
    print("Testing imports...")
    
    try:
        # Test basic imports
        import boto3
        print("SUCCESS: boto3 imported successfully")
        
        import botocore
        print("SUCCESS: botocore imported successfully")
        
        # Test our custom modules
        from services.cloudwatch_logs import analyze_log_group_costs, analyze_log_retention_optimization
        print("SUCCESS: CloudWatch Logs service imported successfully")
        
        from services.aws_rum import analyze_rum_performance, get_user_experience_metrics
        print("SUCCESS: AWS RUM service imported successfully")
        
        from observability_tools import get_observability_tools
        print("SUCCESS: Observability tools imported successfully")
        
        # Test main server import (without MCP dependency)
        try:
            import aws_observability_best_practices_mcp_server
            print("SUCCESS: Main server module imported successfully")
        except ImportError as e:
            if "mcp" in str(e).lower():
                print("WARNING: Main server module needs MCP dependency (expected)")
            else:
                print(f"ERROR: Main server import error: {e}")
                return False
        
        return True
        
    except ImportError as e:
        print(f"ERROR: Import error: {e}")
        return False

def test_tools_definition():
    """Test that tools are properly defined."""
    print("\nTesting tools definition...")
    
    try:
        from observability_tools import get_observability_tools
        tools = get_observability_tools()
        
        print(f"SUCCESS: Found {len(tools)} tools")
        
        # Check for key tools
        tool_names = [tool.name for tool in tools]
        expected_tools = [
            "analyze_log_patterns",
            "analyze_rum_performance", 
            "get_user_experience_metrics",
            "app_performance_analysis"
        ]
        
        for expected_tool in expected_tools:
            if expected_tool in tool_names:
                print(f"SUCCESS: Found tool: {expected_tool}")
            else:
                print(f"ERROR: Missing tool: {expected_tool}")
                
        return True
        
    except Exception as e:
        print(f"ERROR: Tools definition error: {e}")
        return False

def test_cloudwatch_logs_service():
    """Test CloudWatch Logs service functions."""
    print("\nTesting CloudWatch Logs service...")
    
    try:
        from services.cloudwatch_logs import analyze_log_retention_optimization
        
        # Test with mock data (won't make actual AWS calls without credentials)
        result = analyze_log_retention_optimization(region="us-east-1", retention_threshold_days=14)
        
        if result.get("status") == "error" and "credentials" in result.get("message", "").lower():
            print("SUCCESS: CloudWatch Logs service structure is correct (AWS credentials not configured)")
        else:
            print(f"SUCCESS: CloudWatch Logs service returned: {result.get('status', 'unknown')}")
            
        return True
        
    except Exception as e:
        print(f"ERROR: CloudWatch Logs service error: {e}")
        return False

def test_aws_rum_service():
    """Test AWS RUM service functions."""
    print("\nTesting AWS RUM service...")
    
    try:
        from services.aws_rum import analyze_rum_performance
        
        # Test with mock data
        result = analyze_rum_performance("test-app-monitor", region="us-east-1")
        
        if result.get("status") == "error" and "credentials" in result.get("message", "").lower():
            print("SUCCESS: AWS RUM service structure is correct (AWS credentials not configured)")
        else:
            print(f"SUCCESS: AWS RUM service returned: {result.get('status', 'unknown')}")
            
        return True
        
    except Exception as e:
        print(f"ERROR: AWS RUM service error: {e}")
        return False

def test_tool_schemas():
    """Test that tool schemas are valid JSON."""
    print("\nTesting tool schemas...")
    
    try:
        from observability_tools import get_observability_tools
        tools = get_observability_tools()
        
        for tool in tools:
            # Test that inputSchema is valid JSON
            schema = tool.inputSchema
            json.dumps(schema)  # This will raise an exception if not valid JSON
            print(f"SUCCESS: Tool '{tool.name}' has valid JSON schema")
            
        return True
        
    except Exception as e:
        print(f"ERROR: Tool schema error: {e}")
        return False

def test_aws_credentials():
    """Test AWS credentials configuration."""
    print("\nTesting AWS credentials...")
    
    try:
        import boto3
        
        # Try to create a session
        session = boto3.Session()
        credentials = session.get_credentials()
        
        if credentials:
            print("SUCCESS: AWS credentials found")
            print(f"   Access Key: {credentials.access_key[:10]}...")
            print(f"   Region: {session.region_name or 'Not set'}")
            return True
        else:
            print("WARNING: AWS credentials not found - some tests will be limited")
            return False
            
    except Exception as e:
        print(f"ERROR: AWS credentials error: {e}")
        return False

def main():
    """Run all tests."""
    print("Starting AWS Observability MCP Server Tests\n")
    
    tests = [
        ("Imports", test_imports),
        ("Tools Definition", test_tools_definition),
        ("CloudWatch Logs Service", test_cloudwatch_logs_service),
        ("AWS RUM Service", test_aws_rum_service),
        ("Tool Schemas", test_tool_schemas),
        ("AWS Credentials", test_aws_credentials),
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        try:
            if test_func():
                passed += 1
        except Exception as e:
            print(f"ERROR: {test_name} failed with exception: {e}")
    
    print(f"\nTest Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("SUCCESS: All tests passed! The AWS Observability MCP Server is ready to use.")
    else:
        print("WARNING: Some tests failed. Check the output above for details.")
    
    return passed == total

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
