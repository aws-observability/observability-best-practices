"""
Log Analysis Playbook

This module implements comprehensive log analysis playbooks for observability.
It provides functions to analyze CloudWatch logs for errors, patterns, and performance issues.
"""

import logging
import boto3
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
from services.cloudwatch_logs import analyze_log_retention_optimization, get_log_insights_queries

logger = logging.getLogger(__name__)

def analyze_error_patterns(
    log_group_name: str,
    start_time: Optional[str] = None,
    end_time: Optional[str] = None,
    region: Optional[str] = None,
    error_threshold: int = 10
) -> Dict[str, Any]:
    """
    Analyze error patterns in CloudWatch logs.
    
    Args:
        log_group_name: CloudWatch log group name
        start_time: Start time for analysis (ISO format)
        end_time: End time for analysis (ISO format)
        region: AWS region
        error_threshold: Minimum number of errors to report
        
    Returns:
        Dictionary containing error pattern analysis
    """
    try:
        # Set default time range if not provided
        if not start_time:
            end_datetime = datetime.utcnow()
            start_datetime = end_datetime - timedelta(hours=24)
            start_time = start_datetime.isoformat() + 'Z'
            end_time = end_datetime.isoformat() + 'Z'
        elif not end_time:
            end_time = datetime.utcnow().isoformat() + 'Z'
        
        # Query for error patterns
        error_query = """
        fields @timestamp, @message
        | filter @message like /error|Error|ERROR|exception|Exception|EXCEPTION|fail|Fail|FAIL/
        | stats count() as error_count by @message
        | sort error_count desc
        | limit 20
        """
        
        result = get_log_insights_queries(
            log_group_name=log_group_name,
            query_string=error_query,
            start_time=start_time,
            end_time=end_time,
            region=region
        )
        
        if result.get("status") == "success":
            error_data = result.get("data", {}).get("results", [])
            high_volume_errors = [
                error for error in error_data 
                if error.get("error_count", 0) >= error_threshold
            ]
            
            return {
                "status": "success",
                "data": {
                    "log_group": log_group_name,
                    "time_range": {"start": start_time, "end": end_time},
                    "total_errors": len(error_data),
                    "high_volume_errors": high_volume_errors,
                    "error_patterns": error_data[:10],  # Top 10 patterns
                    "recommendations": _generate_error_recommendations(high_volume_errors)
                },
                "message": f"Analyzed error patterns in {log_group_name}"
            }
        else:
            return result
            
    except Exception as e:
        logger.error(f"Error analyzing error patterns: {str(e)}")
        return {
            "status": "error",
            "message": f"Error analyzing error patterns: {str(e)}"
        }

def analyze_performance_issues(
    log_group_name: str,
    start_time: Optional[str] = None,
    end_time: Optional[str] = None,
    region: Optional[str] = None,
    response_time_threshold: float = 5.0
) -> Dict[str, Any]:
    """
    Analyze performance issues in application logs.
    
    Args:
        log_group_name: CloudWatch log group name
        start_time: Start time for analysis (ISO format)
        end_time: End time for analysis (ISO format)
        region: AWS region
        response_time_threshold: Response time threshold in seconds
        
    Returns:
        Dictionary containing performance analysis
    """
    try:
        # Set default time range if not provided
        if not start_time:
            end_datetime = datetime.utcnow()
            start_datetime = end_datetime - timedelta(hours=24)
            start_time = start_datetime.isoformat() + 'Z'
            end_time = end_datetime.isoformat() + 'Z'
        elif not end_time:
            end_time = datetime.utcnow().isoformat() + 'Z'
        
        # Query for performance issues
        performance_query = f"""
        fields @timestamp, @message
        | filter @message like /response_time|duration|latency|slow|timeout/
        | parse @message /response_time[\\s=:]+(?<response_time>\\d+\\.?\\d*)/
        | where response_time > {response_time_threshold}
        | stats count() as slow_requests, avg(response_time) as avg_response_time by @message
        | sort slow_requests desc
        | limit 20
        """
        
        result = get_log_insights_queries(
            log_group_name=log_group_name,
            query_string=performance_query,
            start_time=start_time,
            end_time=end_time,
            region=region
        )
        
        if result.get("status") == "success":
            performance_data = result.get("data", {}).get("results", [])
            
            return {
                "status": "success",
                "data": {
                    "log_group": log_group_name,
                    "time_range": {"start": start_time, "end": end_time},
                    "threshold_seconds": response_time_threshold,
                    "slow_requests": performance_data,
                    "total_slow_requests": len(performance_data),
                    "recommendations": _generate_performance_recommendations(performance_data)
                },
                "message": f"Analyzed performance issues in {log_group_name}"
            }
        else:
            return result
            
    except Exception as e:
        logger.error(f"Error analyzing performance issues: {str(e)}")
        return {
            "status": "error",
            "message": f"Error analyzing performance issues: {str(e)}"
        }

def analyze_security_events(
    log_group_name: str,
    start_time: Optional[str] = None,
    end_time: Optional[str] = None,
    region: Optional[str] = None
) -> Dict[str, Any]:
    """
    Analyze security events in application logs.
    
    Args:
        log_group_name: CloudWatch log group name
        start_time: Start time for analysis (ISO format)
        end_time: End time for analysis (ISO format)
        region: AWS region
        
    Returns:
        Dictionary containing security event analysis
    """
    try:
        # Set default time range if not provided
        if not start_time:
            end_datetime = datetime.utcnow()
            start_datetime = end_datetime - timedelta(hours=24)
            start_time = start_datetime.isoformat() + 'Z'
            end_time = end_datetime.isoformat() + 'Z'
        elif not end_time:
            end_time = datetime.utcnow().isoformat() + 'Z'
        
        # Query for security events
        security_query = """
        fields @timestamp, @message
        | filter @message like /unauthorized|Unauthorized|UNAUTHORIZED|forbidden|Forbidden|FORBIDDEN|access denied|Access Denied|ACCESS DENIED|authentication|Authentication|AUTHENTICATION|login|Login|LOGIN|logout|Logout|LOGOUT|security|Security|SECURITY|breach|Breach|BREACH|attack|Attack|ATTACK|injection|Injection|INJECTION/
        | stats count() as event_count by @message
        | sort event_count desc
        | limit 20
        """
        
        result = get_log_insights_queries(
            log_group_name=log_group_name,
            query_string=security_query,
            start_time=start_time,
            end_time=end_time,
            region=region
        )
        
        if result.get("status") == "success":
            security_data = result.get("data", {}).get("results", [])
            
            return {
                "status": "success",
                "data": {
                    "log_group": log_group_name,
                    "time_range": {"start": start_time, "end": end_time},
                    "security_events": security_data,
                    "total_events": len(security_data),
                    "recommendations": _generate_security_recommendations(security_data)
                },
                "message": f"Analyzed security events in {log_group_name}"
            }
        else:
            return result
            
    except Exception as e:
        logger.error(f"Error analyzing security events: {str(e)}")
        return {
            "status": "error",
            "message": f"Error analyzing security events: {str(e)}"
        }

def generate_log_analysis_report(
    log_group_name: str,
    start_time: Optional[str] = None,
    end_time: Optional[str] = None,
    region: Optional[str] = None
) -> Dict[str, Any]:
    """
    Generate comprehensive log analysis report.
    
    Args:
        log_group_name: CloudWatch log group name
        start_time: Start time for analysis (ISO format)
        end_time: End time for analysis (ISO format)
        region: AWS region
        
    Returns:
        Dictionary containing comprehensive log analysis report
    """
    try:
        # Run all analysis functions
        error_analysis = analyze_error_patterns(log_group_name, start_time, end_time, region)
        performance_analysis = analyze_performance_issues(log_group_name, start_time, end_time, region)
        security_analysis = analyze_security_events(log_group_name, start_time, end_time, region)
        
        # Compile comprehensive report
        report = {
            "status": "success",
            "data": {
                "log_group": log_group_name,
                "time_range": {"start": start_time, "end": end_time},
                "analysis_timestamp": datetime.utcnow().isoformat() + 'Z',
                "error_analysis": error_analysis,
                "performance_analysis": performance_analysis,
                "security_analysis": security_analysis,
                "summary": {
                    "total_errors": error_analysis.get("data", {}).get("total_errors", 0),
                    "total_slow_requests": performance_analysis.get("data", {}).get("total_slow_requests", 0),
                    "total_security_events": security_analysis.get("data", {}).get("total_events", 0)
                }
            },
            "message": f"Generated comprehensive log analysis report for {log_group_name}"
        }
        
        return report
        
    except Exception as e:
        logger.error(f"Error generating log analysis report: {str(e)}")
        return {
            "status": "error",
            "message": f"Error generating log analysis report: {str(e)}"
        }

def _generate_error_recommendations(error_data: List[Dict]) -> List[str]:
    """Generate recommendations based on error analysis."""
    recommendations = []
    
    if not error_data:
        recommendations.append("No high-volume errors detected. Monitor for new error patterns.")
        return recommendations
    
    recommendations.append(f"Found {len(error_data)} high-volume error patterns that need attention.")
    
    for error in error_data[:3]:  # Top 3 errors
        error_message = error.get("@message", "")
        error_count = error.get("error_count", 0)
        recommendations.append(f"Error pattern '{error_message[:100]}...' occurred {error_count} times.")
    
    recommendations.append("Consider implementing error alerting and automated remediation.")
    recommendations.append("Review application code for potential bug fixes.")
    
    return recommendations

def _generate_performance_recommendations(performance_data: List[Dict]) -> List[str]:
    """Generate recommendations based on performance analysis."""
    recommendations = []
    
    if not performance_data:
        recommendations.append("No performance issues detected above threshold.")
        return recommendations
    
    recommendations.append(f"Found {len(performance_data)} slow request patterns.")
    
    for perf in performance_data[:3]:  # Top 3 slow requests
        avg_time = perf.get("avg_response_time", 0)
        count = perf.get("slow_requests", 0)
        recommendations.append(f"Average response time: {avg_time:.2f}s for {count} requests.")
    
    recommendations.append("Consider optimizing database queries and application logic.")
    recommendations.append("Review caching strategies and CDN configuration.")
    
    return recommendations

def _generate_security_recommendations(security_data: List[Dict]) -> List[str]:
    """Generate recommendations based on security analysis."""
    recommendations = []
    
    if not security_data:
        recommendations.append("No security events detected in the time period.")
        return recommendations
    
    recommendations.append(f"Found {len(security_data)} security-related events.")
    
    for event in security_data[:3]:  # Top 3 security events
        event_message = event.get("@message", "")
        event_count = event.get("event_count", 0)
        recommendations.append(f"Security event '{event_message[:100]}...' occurred {event_count} times.")
    
    recommendations.append("Review authentication and authorization mechanisms.")
    recommendations.append("Consider implementing security monitoring and alerting.")
    recommendations.append("Audit user access patterns and permissions.")
    
    return recommendations
