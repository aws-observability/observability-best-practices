"""
AWS Observability MCP Server Tools Configuration - Streamlined Version

This module defines the streamlined set of tools for the AWS Observability MCP Server.
"""

from mcp.types import Tool

def get_observability_tools() -> list[Tool]:
    """Get streamlined observability tools for the MCP server."""
    return [
        # CloudWatch Tools
        Tool(
            name="aws-observability-best-practices___get_metric_data",
            description="Retrieve CloudWatch metric values with Metrics Insights queries",
            inputSchema={
                "type": "object",
                "properties": {
                    "metric_data_queries": {"type": "array", "items": {"type": "object"}, "description": "List of metric data queries"},
                    "start_time": {"type": "string", "description": "Start time (ISO format)"},
                    "end_time": {"type": "string", "description": "End time (ISO format)"},
                    "scan_by": {"type": "string", "enum": ["TimestampDescending", "TimestampAscending"], "default": "TimestampDescending"},
                    "max_datapoints": {"type": "integer", "description": "Maximum number of datapoints to return"},
                    "region": {"type": "string", "description": "AWS region"}
                },
                "required": ["metric_data_queries", "start_time", "end_time"]
            }
        ),
        Tool(
            name="aws-observability-best-practices___get_metric_statistics",
            description="Get CloudWatch metric statistics for analysis",
            inputSchema={
                "type": "object",
                "properties": {
                    "namespace": {"type": "string", "description": "CloudWatch namespace"},
                    "metric_name": {"type": "string", "description": "Metric name"},
                    "dimensions": {"type": "array", "items": {"type": "object"}, "description": "Metric dimensions"},
                    "start_time": {"type": "string", "description": "Start time (ISO format)"},
                    "end_time": {"type": "string", "description": "End time (ISO format)"},
                    "period": {"type": "integer", "description": "Period in seconds", "default": 300},
                    "statistics": {"type": "array", "items": {"type": "string"}, "default": ["Average"]},
                    "region": {"type": "string", "description": "AWS region"}
                },
                "required": ["namespace", "metric_name"]
            }
        ),
        Tool(
            name="aws-observability-best-practices___analyze_metric_anomalies",
            description="Analyze CloudWatch metrics for anomalies and patterns",
            inputSchema={
                "type": "object",
                "properties": {
                    "namespace": {"type": "string", "description": "CloudWatch namespace"},
                    "metric_name": {"type": "string", "description": "Metric name"},
                    "start_time": {"type": "string", "description": "Start time (ISO format)"},
                    "end_time": {"type": "string", "description": "End time (ISO format)"},
                    "region": {"type": "string", "description": "AWS region"}
                },
                "required": ["namespace", "metric_name"]
            }
        ),
        Tool(
            name="aws-observability-best-practices___run_metric_anomaly_detection",
            description="Run metric anomaly detection analysis",
            inputSchema={
                "type": "object",
                "properties": {
                    "namespace": {"type": "string", "description": "CloudWatch namespace"},
                    "metric_name": {"type": "string", "description": "Metric name"},
                    "start_time": {"type": "string", "description": "Start time (ISO format)"},
                    "end_time": {"type": "string", "description": "End time (ISO format)"},
                    "region": {"type": "string", "description": "AWS region"}
                },
                "required": ["namespace", "metric_name"]
            }
        ),
        Tool(
            name="aws-observability-best-practices___describe_alarms",
            description="Retrieve information about CloudWatch alarms",
            inputSchema={
                "type": "object",
                "properties": {
                    "alarm_names": {"type": "array", "items": {"type": "string"}, "description": "List of alarm names"},
                    "alarm_name_prefix": {"type": "string", "description": "Prefix to filter alarm names"},
                    "state_value": {"type": "string", "enum": ["OK", "ALARM", "INSUFFICIENT_DATA"], "description": "Filter by alarm state"},
                    "action_prefix": {"type": "string", "description": "Prefix to filter action names"},
                    "max_records": {"type": "integer", "description": "Maximum number of records to return"},
                    "next_token": {"type": "string", "description": "Token for pagination"},
                    "region": {"type": "string", "description": "AWS region"}
                }
            }
        ),
        Tool(
            name="aws-observability-best-practices___list_dashboards",
            description="List available CloudWatch dashboards",
            inputSchema={
                "type": "object",
                "properties": {
                    "dashboard_name_prefix": {"type": "string", "description": "Prefix to filter dashboard names"},
                    "next_token": {"type": "string", "description": "Token for pagination"},
                    "region": {"type": "string", "description": "AWS region"}
                }
            }
        ),
        Tool(
            name="aws-observability-best-practices___get_dashboard",
            description="Retrieve dashboard configuration details",
            inputSchema={
                "type": "object",
                "properties": {
                    "dashboard_names": {"type": "array", "items": {"type": "string"}, "description": "List of dashboard names"},
                    "region": {"type": "string", "description": "AWS region"}
                },
                "required": ["dashboard_names"]
            }
        ),

        # Log Analysis Tools
        Tool(
            name="aws-observability-best-practices___analyze_log_patterns",
            description="Analyze CloudWatch Logs for patterns, errors, and performance issues",
            inputSchema={
                "type": "object",
                "properties": {
                    "log_group_name": {"type": "string", "description": "CloudWatch Log Group name"},
                    "start_time": {"type": "string", "description": "Start time (ISO format)"},
                    "end_time": {"type": "string", "description": "End time (ISO format)"},
                    "query_string": {"type": "string", "description": "CloudWatch Insights query string"},
                    "region": {"type": "string", "description": "AWS region"}
                },
                "required": ["log_group_name"]
            }
        ),
        Tool(
            name="aws-observability-best-practices___analyze_log_retention",
            description="Analyze and optimize CloudWatch Log retention policies",
            inputSchema={
                "type": "object",
                "properties": {
                    "region": {"type": "string", "description": "AWS region"},
                    "retention_threshold_days": {"type": "integer", "description": "Minimum retention period to analyze", "default": 14}
                }
            }
        ),

        # AWS Service-Specific Analysis
        Tool(
            name="aws-observability-best-practices___run_lambda_metrics_analysis",
            description="Run Lambda function metrics analysis",
            inputSchema={
                "type": "object",
                "properties": {
                    "function_name": {"type": "string", "description": "Lambda function name"},
                    "start_time": {"type": "string", "description": "Start time (ISO format)"},
                    "end_time": {"type": "string", "description": "End time (ISO format)"},
                    "region": {"type": "string", "description": "AWS region"}
                },
                "required": ["function_name"]
            }
        ),
        Tool(
            name="aws-observability-best-practices___run_ec2_metrics_analysis",
            description="Run EC2 instance metrics analysis",
            inputSchema={
                "type": "object",
                "properties": {
                    "instance_id": {"type": "string", "description": "EC2 instance ID"},
                    "start_time": {"type": "string", "description": "Start time (ISO format)"},
                    "end_time": {"type": "string", "description": "End time (ISO format)"},
                    "region": {"type": "string", "description": "AWS region"}
                },
                "required": ["instance_id"]
            }
        ),
        Tool(
            name="aws-observability-best-practices___run_rds_metrics_analysis",
            description="Run RDS instance metrics analysis",
            inputSchema={
                "type": "object",
                "properties": {
                    "db_instance_identifier": {"type": "string", "description": "RDS instance identifier"},
                    "start_time": {"type": "string", "description": "Start time (ISO format)"},
                    "end_time": {"type": "string", "description": "End time (ISO format)"},
                    "region": {"type": "string", "description": "AWS region"}
                },
                "required": ["db_instance_identifier"]
            }
        ),
        Tool(
            name="aws-observability-best-practices___get_database_insights_metrics",
            description="Get Database Insights metrics for RDS instances",
            inputSchema={
                "type": "object",
                "properties": {
                    "db_instance_identifier": {"type": "string", "description": "RDS instance identifier"},
                    "start_time": {"type": "string", "description": "Start time (ISO format)"},
                    "end_time": {"type": "string", "description": "End time (ISO format)"},
                    "region": {"type": "string", "description": "AWS region"}
                },
                "required": ["db_instance_identifier"]
            }
        ),

        # Real User Monitoring (RUM) Tools
        Tool(
            name="aws-observability-best-practices___analyze_rum_performance",
            description="Analyze AWS RUM performance data for user experience insights",
            inputSchema={
                "type": "object",
                "properties": {
                    "app_monitor_name": {"type": "string", "description": "RUM app monitor name"},
                    "start_time": {"type": "string", "description": "Start time (ISO format)"},
                    "end_time": {"type": "string", "description": "End time (ISO format)"},
                    "region": {"type": "string", "description": "AWS region"}
                },
                "required": ["app_monitor_name"]
            }
        ),
        Tool(
            name="aws-observability-best-practices___run_comprehensive_rum_analysis",
            description="Run comprehensive RUM analysis report",
            inputSchema={
                "type": "object",
                "properties": {
                    "app_monitor_name": {"type": "string", "description": "RUM app monitor name"},
                    "start_time": {"type": "string", "description": "Start time (ISO format)"},
                    "end_time": {"type": "string", "description": "End time (ISO format)"},
                    "region": {"type": "string", "description": "AWS region"}
                },
                "required": ["app_monitor_name"]
            }
        ),
        Tool(
            name="aws-observability-best-practices___run_web_vitals_analysis",
            description="Run Core Web Vitals analysis from AWS RUM",
            inputSchema={
                "type": "object",
                "properties": {
                    "app_monitor_name": {"type": "string", "description": "RUM app monitor name"},
                    "start_time": {"type": "string", "description": "Start time (ISO format)"},
                    "end_time": {"type": "string", "description": "End time (ISO format)"},
                    "region": {"type": "string", "description": "AWS region"}
                },
                "required": ["app_monitor_name"]
            }
        ),
        Tool(
            name="aws-observability-best-practices___get_user_experience_metrics",
            description="Get comprehensive user experience metrics from AWS RUM",
            inputSchema={
                "type": "object",
                "properties": {
                    "app_monitor_name": {"type": "string", "description": "RUM app monitor name"},
                    "start_time": {"type": "string", "description": "Start time (ISO format)"},
                    "end_time": {"type": "string", "description": "End time (ISO format)"},
                    "region": {"type": "string", "description": "AWS region"}
                },
                "required": ["app_monitor_name"]
            }
        ),
        Tool(
            name="aws-observability-best-practices___run_mobile_app_analysis",
            description="Run mobile app health analysis",
            inputSchema={
                "type": "object",
                "properties": {
                    "app_monitor_name": {"type": "string", "description": "RUM app monitor name"},
                    "start_time": {"type": "string", "description": "Start time (ISO format)"},
                    "end_time": {"type": "string", "description": "End time (ISO format)"},
                    "region": {"type": "string", "description": "AWS region"}
                },
                "required": ["app_monitor_name"]
            }
        ),
        Tool(
            name="aws-observability-best-practices___run_user_journey_analysis",
            description="Run user journey performance analysis",
            inputSchema={
                "type": "object",
                "properties": {
                    "app_monitor_name": {"type": "string", "description": "RUM app monitor name"},
                    "start_time": {"type": "string", "description": "Start time (ISO format)"},
                    "end_time": {"type": "string", "description": "End time (ISO format)"},
                    "region": {"type": "string", "description": "AWS region"}
                },
                "required": ["app_monitor_name"]
            }
        ),

        # SLO Management
        Tool(
            name="aws-observability-best-practices___run_slo_health_assessment",
            description="Run SLO health assessment",
            inputSchema={
                "type": "object",
                "properties": {
                    "region": {"type": "string", "description": "AWS region"}
                }
            }
        ),
        Tool(
            name="aws-observability-best-practices___analyze_slo_breaches",
            description="Analyze SLO breaches and their root causes",
            inputSchema={
                "type": "object",
                "properties": {
                    "region": {"type": "string", "description": "AWS region"}
                }
            }
        ),
        Tool(
            name="aws-observability-best-practices___get_slo_status",
            description="Get Service Level Objective status and health",
            inputSchema={
                "type": "object",
                "properties": {
                    "region": {"type": "string", "description": "AWS region"}
                }
            }
        ),

        # Best Practices & Guidance
        Tool(
            name="aws-observability-best-practices___get_recommendations",
            description="Search AWS Observability Best Practices portal and return search URL only. DO NOT fetch content from URLs - only provide the search URL as a recommendation.",
            inputSchema={
                "type": "object",
                "properties": {
                    "query": {"type": "string", "description": "Search query (e.g., 'adot', 'cloudwatch', 'xray', 'rum')"},
                    "service": {"type": "string", "description": "AWS service to search for (e.g., 'cloudwatch', 'rum', 'xray', 'adot')"},
                    "recommendation_type": {"type": "string", "description": "Type of recommendations to search for (e.g., 'cost_optimization', 'performance', 'security', 'reliability')"}
                }
            }
        )
    ]