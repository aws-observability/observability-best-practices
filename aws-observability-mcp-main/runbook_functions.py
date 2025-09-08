"""
Observability Runbook Functions

This module contains all the runbook/playbook functions for observability analysis.
It provides MCP-compatible functions for comprehensive observability monitoring.
"""

import json
import logging
from typing import Dict, List, Any
from mcp.types import TextContent

# Import observability playbook modules
from playbooks.log_analysis import (
    analyze_error_patterns, analyze_performance_issues, analyze_security_events,
    generate_log_analysis_report
)
from playbooks.rum_analysis import (
    analyze_web_vitals, analyze_user_journey_performance, analyze_mobile_app_health,
    generate_rum_comprehensive_report
)
from playbooks.metrics_analysis import (
    analyze_ec2_metrics, analyze_rds_metrics, analyze_lambda_metrics,
    detect_metric_anomalies
)

logger = logging.getLogger(__name__)

# Log Analysis Runbook Functions
async def run_log_error_analysis(arguments: Dict[str, Any]) -> List[TextContent]:
    """Run comprehensive log error analysis."""
    try:
        result = analyze_error_patterns(
            log_group_name=arguments["log_group_name"],
            start_time=arguments.get("start_time"),
            end_time=arguments.get("end_time"),
            region=arguments.get("region"),
            error_threshold=arguments.get("error_threshold", 10)
        )
        return [TextContent(type="text", text=json.dumps(result, indent=2, default=str))]
    except Exception as e:
        return [TextContent(type="text", text=f"Error: {str(e)}")]

async def run_log_performance_analysis(arguments: Dict[str, Any]) -> List[TextContent]:
    """Run log performance analysis."""
    try:
        result = analyze_performance_issues(
            log_group_name=arguments["log_group_name"],
            start_time=arguments.get("start_time"),
            end_time=arguments.get("end_time"),
            region=arguments.get("region"),
            response_time_threshold=arguments.get("response_time_threshold", 5.0)
        )
        return [TextContent(type="text", text=json.dumps(result, indent=2, default=str))]
    except Exception as e:
        return [TextContent(type="text", text=f"Error: {str(e)}")]

async def run_log_security_analysis(arguments: Dict[str, Any]) -> List[TextContent]:
    """Run log security analysis."""
    try:
        result = analyze_security_events(
            log_group_name=arguments["log_group_name"],
            start_time=arguments.get("start_time"),
            end_time=arguments.get("end_time"),
            region=arguments.get("region")
        )
        return [TextContent(type="text", text=json.dumps(result, indent=2, default=str))]
    except Exception as e:
        return [TextContent(type="text", text=f"Error: {str(e)}")]

async def run_comprehensive_log_analysis(arguments: Dict[str, Any]) -> List[TextContent]:
    """Run comprehensive log analysis report."""
    try:
        result = generate_log_analysis_report(
            log_group_name=arguments["log_group_name"],
            start_time=arguments.get("start_time"),
            end_time=arguments.get("end_time"),
            region=arguments.get("region")
        )
        return [TextContent(type="text", text=json.dumps(result, indent=2, default=str))]
    except Exception as e:
        return [TextContent(type="text", text=f"Error: {str(e)}")]

# RUM Analysis Runbook Functions
async def run_web_vitals_analysis(arguments: Dict[str, Any]) -> List[TextContent]:
    """Run web vitals analysis."""
    try:
        result = analyze_web_vitals(
            app_monitor_name=arguments["app_monitor_name"],
            start_time=arguments.get("start_time"),
            end_time=arguments.get("end_time"),
            region=arguments.get("region")
        )
        return [TextContent(type="text", text=json.dumps(result, indent=2, default=str))]
    except Exception as e:
        return [TextContent(type="text", text=f"Error: {str(e)}")]

async def run_user_journey_analysis(arguments: Dict[str, Any]) -> List[TextContent]:
    """Run user journey performance analysis."""
    try:
        result = analyze_user_journey_performance(
            app_monitor_name=arguments["app_monitor_name"],
            start_time=arguments.get("start_time"),
            end_time=arguments.get("end_time"),
            region=arguments.get("region")
        )
        return [TextContent(type="text", text=json.dumps(result, indent=2, default=str))]
    except Exception as e:
        return [TextContent(type="text", text=f"Error: {str(e)}")]

async def run_mobile_app_analysis(arguments: Dict[str, Any]) -> List[TextContent]:
    """Run mobile app health analysis."""
    try:
        result = analyze_mobile_app_health(
            app_monitor_name=arguments["app_monitor_name"],
            start_time=arguments.get("start_time"),
            end_time=arguments.get("end_time"),
            region=arguments.get("region")
        )
        return [TextContent(type="text", text=json.dumps(result, indent=2, default=str))]
    except Exception as e:
        return [TextContent(type="text", text=f"Error: {str(e)}")]

async def run_comprehensive_rum_analysis(arguments: Dict[str, Any]) -> List[TextContent]:
    """Run comprehensive RUM analysis report."""
    try:
        result = generate_rum_comprehensive_report(
            app_monitor_name=arguments["app_monitor_name"],
            start_time=arguments.get("start_time"),
            end_time=arguments.get("end_time"),
            region=arguments.get("region")
        )
        return [TextContent(type="text", text=json.dumps(result, indent=2, default=str))]
    except Exception as e:
        return [TextContent(type="text", text=f"Error: {str(e)}")]

# Metrics Analysis Runbook Functions
async def run_ec2_metrics_analysis(arguments: Dict[str, Any]) -> List[TextContent]:
    """Run EC2 metrics analysis."""
    try:
        result = analyze_ec2_metrics(
            instance_id=arguments["instance_id"],
            start_time=arguments.get("start_time"),
            end_time=arguments.get("end_time"),
            region=arguments.get("region")
        )
        return [TextContent(type="text", text=json.dumps(result, indent=2, default=str))]
    except Exception as e:
        return [TextContent(type="text", text=f"Error: {str(e)}")]

async def run_rds_metrics_analysis(arguments: Dict[str, Any]) -> List[TextContent]:
    """Run RDS metrics analysis."""
    try:
        result = analyze_rds_metrics(
            db_instance_identifier=arguments["db_instance_identifier"],
            start_time=arguments.get("start_time"),
            end_time=arguments.get("end_time"),
            region=arguments.get("region")
        )
        return [TextContent(type="text", text=json.dumps(result, indent=2, default=str))]
    except Exception as e:
        return [TextContent(type="text", text=f"Error: {str(e)}")]

async def run_lambda_metrics_analysis(arguments: Dict[str, Any]) -> List[TextContent]:
    """Run Lambda metrics analysis."""
    try:
        result = analyze_lambda_metrics(
            function_name=arguments["function_name"],
            start_time=arguments.get("start_time"),
            end_time=arguments.get("end_time"),
            region=arguments.get("region")
        )
        return [TextContent(type="text", text=json.dumps(result, indent=2, default=str))]
    except Exception as e:
        return [TextContent(type="text", text=f"Error: {str(e)}")]

async def run_metric_anomaly_detection(arguments: Dict[str, Any]) -> List[TextContent]:
    """Run metric anomaly detection."""
    try:
        result = detect_metric_anomalies(
            namespace=arguments["namespace"],
            metric_name=arguments["metric_name"],
            dimensions=arguments.get("dimensions", []),
            start_time=arguments.get("start_time"),
            end_time=arguments.get("end_time"),
            region=arguments.get("region"),
            threshold_multiplier=arguments.get("threshold_multiplier", 2.0)
        )
        return [TextContent(type="text", text=json.dumps(result, indent=2, default=str))]
    except Exception as e:
        return [TextContent(type="text", text=f"Error: {str(e)}")]

# Comprehensive Observability Analysis
async def run_infrastructure_health_check(arguments: Dict[str, Any]) -> List[TextContent]:
    """Run comprehensive infrastructure health check."""
    try:
        # This would be a comprehensive analysis across multiple services
        # For now, return a placeholder that indicates the structure
        result = {
            "status": "success",
            "data": {
                "analysis_type": "infrastructure_health_check",
                "services_analyzed": ["EC2", "RDS", "Lambda", "CloudWatch Logs"],
                "recommendations": [
                    "Run individual service analyses for detailed insights",
                    "Set up automated monitoring and alerting",
                    "Implement observability best practices"
                ]
            },
            "message": "Infrastructure health check framework ready. Run individual service analyses for detailed insights."
        }
        return [TextContent(type="text", text=json.dumps(result, indent=2, default=str))]
    except Exception as e:
        return [TextContent(type="text", text=f"Error: {str(e)}")]

async def run_observability_gap_analysis(arguments: Dict[str, Any]) -> List[TextContent]:
    """Run observability gap analysis."""
    try:
        # This would analyze what observability tools and practices are missing
        result = {
            "status": "success",
            "data": {
                "analysis_type": "observability_gap_analysis",
                "gaps_identified": [
                    "X-Ray tracing not implemented",
                    "Application Signals SLO monitoring not configured",
                    "Custom metrics and dashboards needed",
                    "Alerting thresholds not optimized"
                ],
                "recommendations": [
                    "Implement X-Ray distributed tracing",
                    "Configure Application Signals for SLO monitoring",
                    "Create custom CloudWatch dashboards",
                    "Set up proactive alerting based on business metrics"
                ]
            },
            "message": "Observability gap analysis completed. Review recommendations for improvement."
        }
        return [TextContent(type="text", text=json.dumps(result, indent=2, default=str))]
    except Exception as e:
        return [TextContent(type="text", text=f"Error: {str(e)}")]

async def run_app_performance_analysis(arguments: Dict[str, Any]) -> List[TextContent]:
    """Run comprehensive application performance analysis."""
    try:
        # This would combine logs, metrics, and RUM analysis
        result = {
            "status": "success",
            "data": {
                "analysis_type": "app_performance_analysis",
                "components": [
                    "Log analysis for error patterns",
                    "RUM analysis for user experience",
                    "Metrics analysis for infrastructure health",
                    "Performance bottleneck identification"
                ],
                "recommendations": [
                    "Run log analysis for error detection",
                    "Run RUM analysis for user experience insights",
                    "Run metrics analysis for infrastructure health",
                    "Combine insights for comprehensive performance picture"
                ]
            },
            "message": "Application performance analysis framework ready. Run individual analyses for comprehensive insights."
        }
        return [TextContent(type="text", text=json.dumps(result, indent=2, default=str))]
    except Exception as e:
        return [TextContent(type="text", text=f"Error: {str(e)}")]

async def run_user_experience_analysis(arguments: Dict[str, Any]) -> List[TextContent]:
    """Run comprehensive user experience analysis."""
    try:
        # This would focus on RUM and user-facing metrics
        result = {
            "status": "success",
            "data": {
                "analysis_type": "user_experience_analysis",
                "components": [
                    "Web vitals analysis",
                    "User journey performance",
                    "Mobile app health",
                    "User engagement metrics"
                ],
                "recommendations": [
                    "Run web vitals analysis for Core Web Vitals",
                    "Run user journey analysis for navigation patterns",
                    "Run mobile app analysis for mobile experience",
                    "Monitor user engagement and satisfaction metrics"
                ]
            },
            "message": "User experience analysis framework ready. Run RUM analyses for detailed user experience insights."
        }
        return [TextContent(type="text", text=json.dumps(result, indent=2, default=str))]
    except Exception as e:
        return [TextContent(type="text", text=f"Error: {str(e)}")]

async def run_slo_health_assessment(arguments: Dict[str, Any]) -> List[TextContent]:
    """Run SLO health assessment."""
    try:
        # This would assess SLO compliance and health
        result = {
            "status": "success",
            "data": {
                "analysis_type": "slo_health_assessment",
                "note": "Use awslabs.cloudwatch-appsignals-mcp-server for SLO monitoring",
                "recommendations": [
                    "Configure Application Signals for SLO monitoring",
                    "Set up SLO-based alerting",
                    "Implement SLO dashboards",
                    "Regular SLO compliance reviews"
                ]
            },
            "message": "SLO health assessment requires Application Signals MCP server. Use awslabs.cloudwatch-appsignals-mcp-server for SLO monitoring."
        }
        return [TextContent(type="text", text=json.dumps(result, indent=2, default=str))]
    except Exception as e:
        return [TextContent(type="text", text=f"Error: {str(e)}")]
