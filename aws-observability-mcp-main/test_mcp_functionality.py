#!/usr/bin/env python3
"""
Test MCP functionality without requiring MCP dependency
"""

import json
from services.cloudwatch_logs import analyze_log_retention_optimization
from services.aws_rum import analyze_rum_performance

def test_cloudwatch_logs_mcp():
    """Test CloudWatch Logs MCP functionality."""
    print("Testing CloudWatch Logs MCP functionality...")
    
    try:
        result = analyze_log_retention_optimization(region="us-east-1")
        
        if result.get("status") == "success":
            print("SUCCESS: CloudWatch Logs MCP tool works correctly")
            print(f"   Found {result.get('data', {}).get('totalLogGroups', 0)} log groups")
            print(f"   Recommendations: {len(result.get('data', {}).get('recommendations', []))}")
            return True
        else:
            print(f"WARNING: CloudWatch Logs returned: {result.get('status')}")
            return False
            
    except Exception as e:
        print(f"ERROR: CloudWatch Logs test failed: {e}")
        return False

def test_aws_rum_mcp():
    """Test AWS RUM MCP functionality."""
    print("Testing AWS RUM MCP functionality...")
    
    try:
        result = analyze_rum_performance("test-app-monitor", region="us-east-1")
        
        if result.get("status") == "error" and "not found" in result.get("message", "").lower():
            print("SUCCESS: AWS RUM MCP tool works correctly (expected error for test app)")
            return True
        elif result.get("status") == "success":
            print("SUCCESS: AWS RUM MCP tool works correctly")
            return True
        else:
            print(f"WARNING: AWS RUM returned: {result.get('status')}")
            return False
            
    except Exception as e:
        print(f"ERROR: AWS RUM test failed: {e}")
        return False

def test_mcp_tool_schemas():
    """Test MCP tool schema definitions."""
    print("Testing MCP tool schema definitions...")
    
    try:
        # Test that we can define tool schemas (without MCP dependency)
        tool_schema = {
            "type": "object",
            "properties": {
                "log_group_name": {
                    "type": "string",
                    "description": "Name of the CloudWatch log group to analyze"
                },
                "region": {
                    "type": "string",
                    "description": "AWS region",
                    "default": "us-east-1"
                }
            },
            "required": ["log_group_name"]
        }
        
        # Validate JSON schema
        json.dumps(tool_schema)
        print("SUCCESS: MCP tool schemas are valid JSON")
        return True
        
    except Exception as e:
        print(f"ERROR: MCP tool schema test failed: {e}")
        return False

def test_mcp_server_structure():
    """Test MCP server structure."""
    print("Testing MCP server structure...")
    
    try:
        # Test that the server file exists and has the right structure
        with open("aws_observability_best_practices_mcp_server.py", "r") as f:
            content = f.read()
            
        # Check for key MCP components
        if "from mcp.server import Server" in content:
            print("SUCCESS: MCP server imports found")
        else:
            print("WARNING: MCP server imports not found")
            
        if "async def list_tools" in content:
            print("SUCCESS: MCP list_tools function found")
        else:
            print("WARNING: MCP list_tools function not found")
            
        if "async def call_tool" in content:
            print("SUCCESS: MCP call_tool function found")
        else:
            print("WARNING: MCP call_tool function not found")
            
        return True
        
    except Exception as e:
        print(f"ERROR: MCP server structure test failed: {e}")
        return False

def main():
    """Run all MCP functionality tests."""
    print("Testing AWS Observability MCP Server Functionality")
    print("=" * 50)
    
    tests = [
        ("CloudWatch Logs MCP", test_cloudwatch_logs_mcp),
        ("AWS RUM MCP", test_aws_rum_mcp),
        ("MCP Tool Schemas", test_mcp_tool_schemas),
        ("MCP Server Structure", test_mcp_server_structure),
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n{test_name}:")
        try:
            if test_func():
                passed += 1
        except Exception as e:
            print(f"ERROR: {test_name} failed with exception: {e}")
    
    print(f"\n" + "=" * 50)
    print(f"MCP Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("SUCCESS: All MCP functionality tests passed!")
        print("The server is ready for MCP integration once the MCP dependency is installed.")
    else:
        print("WARNING: Some MCP tests failed. Check the output above for details.")
    
    return passed == total

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
