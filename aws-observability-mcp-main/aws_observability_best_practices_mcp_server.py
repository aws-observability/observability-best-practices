#!/usr/bin/env python3
"""
AWS Observability MCP Server

A comprehensive Model Context Protocol (MCP) server for AWS observability analysis and optimization.
This server provides tools for analyzing AWS observability and performance by connecting to:
- CloudWatch (Logs, Metrics, Alarms, Insights)
- AWS RUM (Real User Monitoring)
- Application Signals (SLO monitoring)
- Amazon Managed Prometheus
- X-Ray (Distributed tracing)
- CloudWatch Synthetics
- Observability Best Practices Playbooks

Features:
- Application Performance Monitoring
- User Experience Analysis (RUM)
- Infrastructure Health Monitoring
- SLO Management and Analysis
- Distributed Tracing Analysis
- Log Pattern Analysis
- Metrics Correlation and Insights
- Observability Maturity Assessment

Author: AWS Observability Team
License: MIT
Repository: https://github.com/aws-observability/observability-best-practices
"""

import asyncio
import json
import logging
import sys
import os
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any, Union

import boto3
from botocore.exceptions import ClientError, NoCredentialsError
from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import Tool, TextContent

# Add the current directory to Python path for imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import and setup centralized logging
from logging_config import setup_logging, log_function_entry, log_function_exit
from observability_tools import get_observability_tools
logger = setup_logging()

# Initialize the MCP server
server = Server("aws-observability-best-practices")

@server.list_tools()
async def list_tools() -> List[Tool]:
    """List available tools for AWS observability analysis and monitoring."""
    log_function_entry(logger, "list_tools")
    try:
        tools = get_observability_tools()
        log_function_exit(logger, "list_tools", "success", None)
        logger.info(f"Successfully listed {len(tools)} MCP tools")
        return tools
    except Exception as e:
        logger.warning(f"Error listing tools: {str(e)}")
        log_function_exit(logger, "list_tools", "error", None)
        raise

@server.call_tool()
async def call_tool(name: str, arguments: Dict[str, Any]) -> List[TextContent]:
    """Handle tool calls for streamlined observability tools."""
    start_time = datetime.now()
    log_function_entry(logger, f"call_tool[{name}]", arguments=arguments)
    
    try:
        # CloudWatch Tools
        if name == "aws-observability-best-practices___get_metric_data":
            return await get_metric_data(arguments)
        elif name == "aws-observability-best-practices___get_metric_statistics":
            return await get_metric_statistics(arguments)
        elif name == "aws-observability-best-practices___analyze_metric_anomalies":
            return await analyze_metric_anomalies(arguments)
        elif name == "aws-observability-best-practices___run_metric_anomaly_detection":
            return await run_metric_anomaly_detection(arguments)
        elif name == "aws-observability-best-practices___describe_alarms":
            return await describe_alarms(arguments)
        elif name == "aws-observability-best-practices___list_dashboards":
            return await list_dashboards(arguments)
        elif name == "aws-observability-best-practices___get_dashboard":
            return await get_dashboard(arguments)
        
        # Log Analysis Tools
        elif name == "aws-observability-best-practices___analyze_log_patterns":
            return await analyze_log_patterns(arguments)
        elif name == "aws-observability-best-practices___analyze_log_retention":
            return await analyze_log_retention(arguments)
        
        # AWS Service-Specific Analysis
        elif name == "aws-observability-best-practices___run_lambda_metrics_analysis":
            return await run_lambda_metrics_analysis(arguments)
        elif name == "aws-observability-best-practices___run_ec2_metrics_analysis":
            return await run_ec2_metrics_analysis(arguments)
        elif name == "aws-observability-best-practices___run_rds_metrics_analysis":
            return await run_rds_metrics_analysis(arguments)
        elif name == "aws-observability-best-practices___get_database_insights_metrics":
            return await get_database_insights_metrics(arguments)
        
        # Real User Monitoring (RUM) Tools
        elif name == "aws-observability-best-practices___analyze_rum_performance":
            return await analyze_rum_performance(arguments)
        elif name == "aws-observability-best-practices___run_comprehensive_rum_analysis":
            return await run_comprehensive_rum_analysis(arguments)
        elif name == "aws-observability-best-practices___run_web_vitals_analysis":
            return await run_web_vitals_analysis(arguments)
        elif name == "aws-observability-best-practices___get_user_experience_metrics":
            return await get_user_experience_metrics(arguments)
        elif name == "aws-observability-best-practices___run_mobile_app_analysis":
            return await run_mobile_app_analysis(arguments)
        elif name == "aws-observability-best-practices___run_user_journey_analysis":
            return await run_user_journey_analysis(arguments)
        
        # SLO Management
        elif name == "aws-observability-best-practices___run_slo_health_assessment":
            return await run_slo_health_assessment(arguments)
        elif name == "aws-observability-best-practices___analyze_slo_breaches":
            return await analyze_slo_breaches(arguments)
        elif name == "aws-observability-best-practices___get_slo_status":
            return await get_slo_status(arguments)
        
        # Best Practices & Guidance
        elif name == "aws-observability-best-practices___get_recommendations":
            return await get_recommendations(arguments)
        
        else:
            logger.warning(f"Unknown tool requested: {name}")
            return [TextContent(type="text", text=f"Unknown tool: {name}")]
    except Exception as e:
        execution_time = (datetime.now() - start_time).total_seconds()
        logger.error(f"Error calling tool '{name}': {str(e)} (execution time: {execution_time:.2f}s)")
        return [TextContent(type="text", text=f"Error: {str(e)}")]
    
    execution_time = (datetime.now() - start_time).total_seconds()
    log_function_exit(logger, f"call_tool[{name}]", "success", execution_time)

# Import observability service modules
from services.cloudwatch_logs import analyze_log_group_costs, analyze_log_retention_optimization, get_log_insights_queries
from services.aws_rum import analyze_rum_performance, get_user_experience_metrics, analyze_mobile_app_performance

# Import observability runbook functions
from runbook_functions import (
    run_log_error_analysis, run_log_performance_analysis, run_log_security_analysis,
    run_comprehensive_log_analysis, run_web_vitals_analysis, run_user_journey_analysis,
    run_mobile_app_analysis, run_comprehensive_rum_analysis, run_ec2_metrics_analysis,
    run_rds_metrics_analysis, run_lambda_metrics_analysis, run_metric_anomaly_detection,
    run_infrastructure_health_check, run_observability_gap_analysis,
    run_app_performance_analysis, run_user_experience_analysis, run_slo_health_assessment
)

# CloudWatch Logs Functions
async def analyze_log_patterns(arguments: Dict[str, Any]) -> List[TextContent]:
    """Analyze CloudWatch Logs for patterns, errors, and performance issues."""
    try:
        log_group_name = arguments["log_group_name"]
        start_time = arguments.get("start_time")
        end_time = arguments.get("end_time")
        query_string = arguments.get("query_string", "fields @timestamp, @message | filter @message like /error/ | sort @timestamp desc | limit 20")
        region = arguments.get("region")
        
        result = get_log_insights_queries(log_group_name, query_string, start_time, end_time, region)
        return [TextContent(type="text", text=json.dumps(result, indent=2, default=str))]
        
    except Exception as e:
        return [TextContent(type="text", text=f"Error: {str(e)}")]

async def analyze_log_retention(arguments: Dict[str, Any]) -> List[TextContent]:
    """Analyze and optimize CloudWatch Log retention policies."""
    try:
        region = arguments.get("region")
        retention_threshold_days = arguments.get("retention_threshold_days", 14)
        
        result = analyze_log_retention_optimization(region, retention_threshold_days)
        return [TextContent(type="text", text=json.dumps(result, indent=2, default=str))]
        
    except Exception as e:
        return [TextContent(type="text", text=f"Error: {str(e)}")]

async def execute_insights_queries(arguments: Dict[str, Any]) -> List[TextContent]:
    """Execute CloudWatch Insights queries for log analysis."""
    try:
        log_group_name = arguments["log_group_name"]
        query_string = arguments["query_string"]
        start_time = arguments.get("start_time")
        end_time = arguments.get("end_time")
        region = arguments.get("region")
        
        result = get_log_insights_queries(log_group_name, query_string, start_time, end_time, region)
        return [TextContent(type="text", text=json.dumps(result, indent=2, default=str))]
        
    except Exception as e:
        return [TextContent(type="text", text=f"Error: {str(e)}")]

# CloudWatch Metrics Functions
async def get_metric_statistics(arguments: Dict[str, Any]) -> List[TextContent]:
    """Retrieve CloudWatch metric statistics for analysis."""
    try:
        namespace = arguments["namespace"]
        metric_name = arguments["metric_name"]
        dimensions = arguments.get("dimensions", [])
        start_time = arguments.get("start_time")
        end_time = arguments.get("end_time")
        period = arguments.get("period", 300)
        statistics = arguments.get("statistics", ["Average"])
        region = arguments.get("region")
        
        # Create CloudWatch client
        if region:
            cloudwatch = boto3.client('cloudwatch', region_name=region)
        else:
            cloudwatch = boto3.client('cloudwatch')
        
        # Set default time range if not provided
        if not start_time:
            end_datetime = datetime.utcnow()
            start_datetime = end_datetime - timedelta(hours=1)
            start_time = start_datetime
            end_time = end_datetime
        elif not end_time:
            end_time = datetime.utcnow()
        
        response = cloudwatch.get_metric_statistics(
            Namespace=namespace,
            MetricName=metric_name,
            Dimensions=dimensions,
            StartTime=start_time,
            EndTime=end_time,
            Period=period,
            Statistics=statistics
        )
        
        result = {
            "status": "success",
            "data": response,
            "message": f"Retrieved metric statistics for {namespace}/{metric_name}"
        }
        
        return [TextContent(type="text", text=json.dumps(result, indent=2, default=str))]
        
    except Exception as e:
        return [TextContent(type="text", text=f"Error: {str(e)}")]

async def create_cloudwatch_alarms(arguments: Dict[str, Any]) -> List[TextContent]:
    """Create CloudWatch alarms for monitoring."""
    try:
        alarm_name = arguments["alarm_name"]
        metric_name = arguments["metric_name"]
        namespace = arguments["namespace"]
        threshold = arguments["threshold"]
        comparison_operator = arguments["comparison_operator"]
        evaluation_periods = arguments.get("evaluation_periods", 1)
        region = arguments.get("region")
        
        # Create CloudWatch client
        if region:
            cloudwatch = boto3.client('cloudwatch', region_name=region)
        else:
            cloudwatch = boto3.client('cloudwatch')
        
        response = cloudwatch.put_metric_alarm(
            AlarmName=alarm_name,
            ComparisonOperator=comparison_operator,
            EvaluationPeriods=evaluation_periods,
            MetricName=metric_name,
            Namespace=namespace,
            Period=300,
            Statistic='Average',
            Threshold=threshold,
            ActionsEnabled=True,
            AlarmDescription=f'Alarm for {metric_name} in {namespace}'
        )
        
        result = {
            "status": "success",
            "data": response,
            "message": f"Created alarm {alarm_name} for {namespace}/{metric_name}"
        }
        
        return [TextContent(type="text", text=json.dumps(result, indent=2, default=str))]
        
    except Exception as e:
        return [TextContent(type="text", text=f"Error: {str(e)}")]

async def analyze_metric_anomalies(arguments: Dict[str, Any]) -> List[TextContent]:
    """Analyze CloudWatch metrics for anomalies and patterns."""
    try:
        namespace = arguments["namespace"]
        metric_name = arguments["metric_name"]
        start_time = arguments.get("start_time")
        end_time = arguments.get("end_time")
        region = arguments.get("region")
        
        # This is a simplified implementation
        # In a real implementation, you would use CloudWatch Anomaly Detection
        result = {
            "status": "success",
            "data": {
                "namespace": namespace,
                "metric_name": metric_name,
                "anomalies": [],
                "message": "Anomaly detection not yet implemented"
            },
            "message": f"Analyzed {namespace}/{metric_name} for anomalies"
        }
        
        return [TextContent(type="text", text=json.dumps(result, indent=2, default=str))]
        
    except Exception as e:
        return [TextContent(type="text", text=f"Error: {str(e)}")]

# AWS RUM Functions
async def analyze_rum_performance(arguments: Dict[str, Any]) -> List[TextContent]:
    """Analyze AWS RUM performance data for user experience insights."""
    try:
        app_monitor_name = arguments["app_monitor_name"]
        start_time = arguments.get("start_time")
        end_time = arguments.get("end_time")
        region = arguments.get("region")
        
        result = analyze_rum_performance(app_monitor_name, start_time, end_time, region)
        return [TextContent(type="text", text=json.dumps(result, indent=2, default=str))]
        
    except Exception as e:
        return [TextContent(type="text", text=f"Error: {str(e)}")]

async def get_user_experience_metrics(arguments: Dict[str, Any]) -> List[TextContent]:
    """Get comprehensive user experience metrics from AWS RUM."""
    try:
        app_monitor_name = arguments["app_monitor_name"]
        start_time = arguments.get("start_time")
        end_time = arguments.get("end_time")
        region = arguments.get("region")
        
        result = get_user_experience_metrics(app_monitor_name, start_time, end_time, region)
        return [TextContent(type="text", text=json.dumps(result, indent=2, default=str))]
        
    except Exception as e:
        return [TextContent(type="text", text=f"Error: {str(e)}")]

async def analyze_mobile_app_performance(arguments: Dict[str, Any]) -> List[TextContent]:
    """Analyze mobile app performance using AWS RUM."""
    try:
        app_monitor_name = arguments["app_monitor_name"]
        start_time = arguments.get("start_time")
        end_time = arguments.get("end_time")
        region = arguments.get("region")
        
        result = analyze_mobile_app_performance(app_monitor_name, start_time, end_time, region)
        return [TextContent(type="text", text=json.dumps(result, indent=2, default=str))]
        
    except Exception as e:
        return [TextContent(type="text", text=f"Error: {str(e)}")]

# X-Ray Tracing Functions (Placeholder implementations)
async def analyze_trace_performance(arguments: Dict[str, Any]) -> List[TextContent]:
    """Analyze X-Ray traces for performance bottlenecks."""
    result = {"status": "success", "message": "X-Ray tracing analysis not yet implemented"}
    return [TextContent(type="text", text=json.dumps(result, indent=2, default=str))]

async def identify_bottlenecks(arguments: Dict[str, Any]) -> List[TextContent]:
    """Identify performance bottlenecks using X-Ray traces."""
    result = {"status": "success", "message": "Bottleneck identification not yet implemented"}
    return [TextContent(type="text", text=json.dumps(result, indent=2, default=str))]

async def analyze_service_dependencies(arguments: Dict[str, Any]) -> List[TextContent]:
    """Analyze service dependencies using X-Ray traces."""
    result = {"status": "success", "message": "Service dependency analysis not yet implemented"}
    return [TextContent(type="text", text=json.dumps(result, indent=2, default=str))]

# Application Signals Functions (Placeholder implementations)
async def get_slo_status(arguments: Dict[str, Any]) -> List[TextContent]:
    """Get Service Level Objective status and health."""
    result = {"status": "success", "message": "SLO status retrieval not yet implemented"}
    return [TextContent(type="text", text=json.dumps(result, indent=2, default=str))]

async def analyze_slo_breaches(arguments: Dict[str, Any]) -> List[TextContent]:
    """Analyze SLO breaches and their root causes."""
    result = {"status": "success", "message": "SLO breach analysis not yet implemented"}
    return [TextContent(type="text", text=json.dumps(result, indent=2, default=str))]

async def get_performance_insights(arguments: Dict[str, Any]) -> List[TextContent]:
    """Get performance insights from Application Signals."""
    result = {"status": "success", "message": "Performance insights retrieval not yet implemented"}
    return [TextContent(type="text", text=json.dumps(result, indent=2, default=str))]

# Observability Playbook Functions (Placeholder implementations)
async def app_performance_analysis(arguments: Dict[str, Any]) -> List[TextContent]:
    """Comprehensive application performance analysis playbook."""
    result = {"status": "success", "message": "Application performance analysis playbook not yet implemented"}
    return [TextContent(type="text", text=json.dumps(result, indent=2, default=str))]

async def user_experience_analysis(arguments: Dict[str, Any]) -> List[TextContent]:
    """User experience analysis playbook using RUM data."""
    result = {"status": "success", "message": "User experience analysis playbook not yet implemented"}
    return [TextContent(type="text", text=json.dumps(result, indent=2, default=str))]

async def infrastructure_health_check(arguments: Dict[str, Any]) -> List[TextContent]:
    """Infrastructure health monitoring playbook."""
    result = {"status": "success", "message": "Infrastructure health check playbook not yet implemented"}
    return [TextContent(type="text", text=json.dumps(result, indent=2, default=str))]

async def observability_gap_analysis(arguments: Dict[str, Any]) -> List[TextContent]:
    """Identify gaps in observability coverage."""
    result = {"status": "success", "message": "Observability gap analysis not yet implemented"}
    return [TextContent(type="text", text=json.dumps(result, indent=2, default=str))]

async def slo_health_assessment(arguments: Dict[str, Any]) -> List[TextContent]:
    """Comprehensive SLO health assessment."""
    result = {"status": "success", "message": "SLO health assessment not yet implemented"}
    return [TextContent(type="text", text=json.dumps(result, indent=2, default=str))]

# Additional AWS service functions for observability
async def get_database_insights_metrics(arguments: Dict[str, Any]) -> List[TextContent]:
    """Get Database Insights metrics for an RDS instance."""
    try:
        db_instance_identifier = arguments["db_instance_identifier"]
        start_time = arguments.get("start_time")
        end_time = arguments.get("end_time")
        region = arguments.get("region")
        
        # Import the database insights function
        from services.database_insights import get_database_insights_metrics
        
        result = get_database_insights_metrics(
            db_instance_identifier=db_instance_identifier,
            start_time=start_time,
            end_time=end_time,
            region=region
        )
        
        return [TextContent(type="text", text=json.dumps(result, indent=2, default=str))]
        
    except Exception as e:
        return [TextContent(type="text", text=f"Error: {str(e)}")]

async def get_aws_observability_guidance(arguments: Dict[str, Any]) -> List[TextContent]:
    """Get AWS Observability Best Practices guidance and recommendations."""
    try:
        question = arguments["question"]
        context = arguments.get("context")
        
        # Import the AWS best practices function
        from services.aws_best_practices import get_aws_observability_guidance as get_guidance
        
        result = get_guidance(
            question=question,
            context=context
        )
        
        return [TextContent(type="text", text=json.dumps(result, indent=2, default=str))]
        
    except Exception as e:
        return [TextContent(type="text", text=f"Error: {str(e)}")]

# Additional CloudWatch Metrics Functions
async def get_metric_data(arguments: Dict[str, Any]) -> List[TextContent]:
    """Retrieve CloudWatch metric values with support for Metrics Insights queries and metric math."""
    try:
        metric_data_queries = arguments["metric_data_queries"]
        start_time = arguments["start_time"]
        end_time = arguments["end_time"]
        scan_by = arguments.get("scan_by", "TimestampDescending")
        max_datapoints = arguments.get("max_datapoints")
        region = arguments.get("region")
        
        # Create CloudWatch client
        if region:
            cloudwatch = boto3.client('cloudwatch', region_name=region)
        else:
            cloudwatch = boto3.client('cloudwatch')
        
        # Prepare parameters
        params = {
            'MetricDataQueries': metric_data_queries,
            'StartTime': start_time,
            'EndTime': end_time,
            'ScanBy': scan_by
        }
        
        if max_datapoints:
            params['MaxDatapoints'] = max_datapoints
        
        response = cloudwatch.get_metric_data(**params)
        
        result = {
            "status": "success",
            "data": response,
            "message": f"Retrieved metric data for {len(metric_data_queries)} queries"
        }
        
        return [TextContent(type="text", text=json.dumps(result, indent=2, default=str))]
        
    except Exception as e:
        return [TextContent(type="text", text=f"Error: {str(e)}")]

async def list_metrics(arguments: Dict[str, Any]) -> List[TextContent]:
    """List available CloudWatch metrics (up to 500 results per call)."""
    try:
        namespace = arguments.get("namespace")
        metric_name = arguments.get("metric_name")
        dimensions = arguments.get("dimensions", [])
        next_token = arguments.get("next_token")
        region = arguments.get("region")
        
        # Create CloudWatch client
        if region:
            cloudwatch = boto3.client('cloudwatch', region_name=region)
        else:
            cloudwatch = boto3.client('cloudwatch')
        
        # Prepare parameters
        params = {}
        if namespace:
            params['Namespace'] = namespace
        if metric_name:
            params['MetricName'] = metric_name
        if dimensions:
            params['Dimensions'] = dimensions
        if next_token:
            params['NextToken'] = next_token
        
        response = cloudwatch.list_metrics(**params)
        
        result = {
            "status": "success",
            "data": response,
            "message": f"Listed {len(response.get('Metrics', []))} metrics"
        }
        
        return [TextContent(type="text", text=json.dumps(result, indent=2, default=str))]
        
    except Exception as e:
        return [TextContent(type="text", text=f"Error: {str(e)}")]

async def get_metric_widget_image(arguments: Dict[str, Any]) -> List[TextContent]:
    """Generate snapshot graphs of CloudWatch metrics as bitmap images."""
    try:
        metric_widget = arguments["metric_widget"]
        output_format = arguments.get("output_format", "png")
        region = arguments.get("region")
        
        # Create CloudWatch client
        if region:
            cloudwatch = boto3.client('cloudwatch', region_name=region)
        else:
            cloudwatch = boto3.client('cloudwatch')
        
        response = cloudwatch.get_metric_widget_image(
            MetricWidget=metric_widget,
            OutputFormat=output_format
        )
        
        result = {
            "status": "success",
            "data": {
                "metric_widget_image": response['MetricWidgetImage'],
                "output_format": output_format
            },
            "message": f"Generated metric widget image in {output_format} format"
        }
        
        return [TextContent(type="text", text=json.dumps(result, indent=2, default=str))]
        
    except Exception as e:
        return [TextContent(type="text", text=f"Error: {str(e)}")]

# CloudWatch Alarms Functions
async def describe_alarms(arguments: Dict[str, Any]) -> List[TextContent]:
    """Retrieve information about CloudWatch alarms."""
    try:
        alarm_names = arguments.get("alarm_names", [])
        alarm_name_prefix = arguments.get("alarm_name_prefix")
        state_value = arguments.get("state_value")
        action_prefix = arguments.get("action_prefix")
        max_records = arguments.get("max_records")
        next_token = arguments.get("next_token")
        region = arguments.get("region")
        
        # Create CloudWatch client
        if region:
            cloudwatch = boto3.client('cloudwatch', region_name=region)
        else:
            cloudwatch = boto3.client('cloudwatch')
        
        # Prepare parameters
        params = {}
        if alarm_names:
            params['AlarmNames'] = alarm_names
        if alarm_name_prefix:
            params['AlarmNamePrefix'] = alarm_name_prefix
        if state_value:
            params['StateValue'] = state_value
        if action_prefix:
            params['ActionPrefix'] = action_prefix
        if max_records:
            params['MaxRecords'] = max_records
        if next_token:
            params['NextToken'] = next_token
        
        response = cloudwatch.describe_alarms(**params)
        
        result = {
            "status": "success",
            "data": response,
            "message": f"Retrieved {len(response.get('MetricAlarms', []))} alarms"
        }
        
        return [TextContent(type="text", text=json.dumps(result, indent=2, default=str))]
        
    except Exception as e:
        return [TextContent(type="text", text=f"Error: {str(e)}")]

async def describe_alarms_for_metric(arguments: Dict[str, Any]) -> List[TextContent]:
    """Get alarms associated with specific metrics."""
    try:
        namespace = arguments["namespace"]
        metric_name = arguments["metric_name"]
        dimensions = arguments.get("dimensions", [])
        period = arguments.get("period")
        statistic = arguments.get("statistic")
        extended_statistic = arguments.get("extended_statistic")
        region = arguments.get("region")
        
        # Create CloudWatch client
        if region:
            cloudwatch = boto3.client('cloudwatch', region_name=region)
        else:
            cloudwatch = boto3.client('cloudwatch')
        
        # Prepare parameters
        params = {
            'Namespace': namespace,
            'MetricName': metric_name
        }
        if dimensions:
            params['Dimensions'] = dimensions
        if period:
            params['Period'] = period
        if statistic:
            params['Statistic'] = statistic
        if extended_statistic:
            params['ExtendedStatistic'] = extended_statistic
        
        response = cloudwatch.describe_alarms_for_metric(**params)
        
        result = {
            "status": "success",
            "data": response,
            "message": f"Retrieved alarms for {namespace}/{metric_name}"
        }
        
        return [TextContent(type="text", text=json.dumps(result, indent=2, default=str))]
        
    except Exception as e:
        return [TextContent(type="text", text=f"Error: {str(e)}")]

async def describe_alarm_history(arguments: Dict[str, Any]) -> List[TextContent]:
    """View alarm state change history."""
    try:
        alarm_name = arguments.get("alarm_name")
        alarm_types = arguments.get("alarm_types", [])
        start_date = arguments.get("start_date")
        end_date = arguments.get("end_date")
        max_records = arguments.get("max_records")
        next_token = arguments.get("next_token")
        scan_by = arguments.get("scan_by", "TimestampDescending")
        region = arguments.get("region")
        
        # Create CloudWatch client
        if region:
            cloudwatch = boto3.client('cloudwatch', region_name=region)
        else:
            cloudwatch = boto3.client('cloudwatch')
        
        # Prepare parameters
        params = {'ScanBy': scan_by}
        if alarm_name:
            params['AlarmName'] = alarm_name
        if alarm_types:
            params['AlarmTypes'] = alarm_types
        if start_date:
            params['StartDate'] = start_date
        if end_date:
            params['EndDate'] = end_date
        if max_records:
            params['MaxRecords'] = max_records
        if next_token:
            params['NextToken'] = next_token
        
        response = cloudwatch.describe_alarm_history(**params)
        
        result = {
            "status": "success",
            "data": response,
            "message": f"Retrieved {len(response.get('AlarmHistoryItems', []))} alarm history items"
        }
        
        return [TextContent(type="text", text=json.dumps(result, indent=2, default=str))]
        
    except Exception as e:
        return [TextContent(type="text", text=f"Error: {str(e)}")]

async def describe_anomaly_detectors(arguments: Dict[str, Any]) -> List[TextContent]:
    """List anomaly detection models."""
    try:
        anomaly_detector_types = arguments.get("anomaly_detector_types", [])
        dimensions = arguments.get("dimensions", [])
        metric_name = arguments.get("metric_name")
        namespace = arguments.get("namespace")
        next_token = arguments.get("next_token")
        region = arguments.get("region")
        
        # Create CloudWatch client
        if region:
            cloudwatch = boto3.client('cloudwatch', region_name=region)
        else:
            cloudwatch = boto3.client('cloudwatch')
        
        # Prepare parameters
        params = {}
        if anomaly_detector_types:
            params['AnomalyDetectorTypes'] = anomaly_detector_types
        if dimensions:
            params['Dimensions'] = dimensions
        if metric_name:
            params['MetricName'] = metric_name
        if namespace:
            params['Namespace'] = namespace
        if next_token:
            params['NextToken'] = next_token
        
        response = cloudwatch.describe_anomaly_detectors(**params)
        
        result = {
            "status": "success",
            "data": response,
            "message": f"Retrieved {len(response.get('AnomalyDetectors', []))} anomaly detectors"
        }
        
        return [TextContent(type="text", text=json.dumps(result, indent=2, default=str))]
        
    except Exception as e:
        return [TextContent(type="text", text=f"Error: {str(e)}")]

# CloudWatch Dashboards Functions
async def get_dashboard(arguments: Dict[str, Any]) -> List[TextContent]:
    """Retrieve dashboard configuration details."""
    try:
        dashboard_names = arguments["dashboard_names"]
        region = arguments.get("region")
        
        # Create CloudWatch client
        if region:
            cloudwatch = boto3.client('cloudwatch', region_name=region)
        else:
            cloudwatch = boto3.client('cloudwatch')
        
        response = cloudwatch.get_dashboard(DashboardNames=dashboard_names)
        
        result = {
            "status": "success",
            "data": response,
            "message": f"Retrieved {len(dashboard_names)} dashboards"
        }
        
        return [TextContent(type="text", text=json.dumps(result, indent=2, default=str))]
        
    except Exception as e:
        return [TextContent(type="text", text=f"Error: {str(e)}")]

async def list_dashboards(arguments: Dict[str, Any]) -> List[TextContent]:
    """List available CloudWatch dashboards."""
    try:
        dashboard_name_prefix = arguments.get("dashboard_name_prefix")
        next_token = arguments.get("next_token")
        region = arguments.get("region")
        
        # Create CloudWatch client
        if region:
            cloudwatch = boto3.client('cloudwatch', region_name=region)
        else:
            cloudwatch = boto3.client('cloudwatch')
        
        # Prepare parameters
        params = {}
        if dashboard_name_prefix:
            params['DashboardNamePrefix'] = dashboard_name_prefix
        if next_token:
            params['NextToken'] = next_token
        
        response = cloudwatch.list_dashboards(**params)
        
        result = {
            "status": "success",
            "data": response,
            "message": f"Listed {len(response.get('DashboardEntries', []))} dashboards"
        }
        
        return [TextContent(type="text", text=json.dumps(result, indent=2, default=str))]
        
    except Exception as e:
        return [TextContent(type="text", text=f"Error: {str(e)}")]

# Contributor Insights Functions
async def describe_insight_rules(arguments: Dict[str, Any]) -> List[TextContent]:
    """List Contributor Insights rules."""
    try:
        max_results = arguments.get("max_results")
        next_token = arguments.get("next_token")
        region = arguments.get("region")
        
        # Create CloudWatch client
        if region:
            cloudwatch = boto3.client('cloudwatch', region_name=region)
        else:
            cloudwatch = boto3.client('cloudwatch')
        
        # Prepare parameters
        params = {}
        if max_results:
            params['MaxResults'] = max_results
        if next_token:
            params['NextToken'] = next_token
        
        response = cloudwatch.describe_insight_rules(**params)
        
        result = {
            "status": "success",
            "data": response,
            "message": f"Retrieved {len(response.get('InsightRules', []))} insight rules"
        }
        
        return [TextContent(type="text", text=json.dumps(result, indent=2, default=str))]
        
    except Exception as e:
        return [TextContent(type="text", text=f"Error: {str(e)}")]

async def list_managed_insight_rules(arguments: Dict[str, Any]) -> List[TextContent]:
    """List managed Contributor Insights rules."""
    try:
        resource_arn = arguments.get("resource_arn")
        max_results = arguments.get("max_results")
        next_token = arguments.get("next_token")
        region = arguments.get("region")
        
        # Create CloudWatch client
        if region:
            cloudwatch = boto3.client('cloudwatch', region_name=region)
        else:
            cloudwatch = boto3.client('cloudwatch')
        
        # Prepare parameters
        params = {}
        if resource_arn:
            params['ResourceARN'] = resource_arn
        if max_results:
            params['MaxResults'] = max_results
        if next_token:
            params['NextToken'] = next_token
        
        response = cloudwatch.list_managed_insight_rules(**params)
        
        result = {
            "status": "success",
            "data": response,
            "message": f"Retrieved {len(response.get('ManagedInsightRules', []))} managed insight rules"
        }
        
        return [TextContent(type="text", text=json.dumps(result, indent=2, default=str))]
        
    except Exception as e:
        return [TextContent(type="text", text=f"Error: {str(e)}")]

async def get_insight_rule_report(arguments: Dict[str, Any]) -> List[TextContent]:
    """Get time series data from Contributor Insights rules."""
    try:
        rule_name = arguments["rule_name"]
        start_time = arguments["start_time"]
        end_time = arguments["end_time"]
        period = arguments.get("period")
        max_contributor_count = arguments.get("max_contributor_count")
        metrics = arguments.get("metrics", [])
        order_by = arguments.get("order_by")
        region = arguments.get("region")
        
        # Create CloudWatch client
        if region:
            cloudwatch = boto3.client('cloudwatch', region_name=region)
        else:
            cloudwatch = boto3.client('cloudwatch')
        
        # Prepare parameters
        params = {
            'RuleName': rule_name,
            'StartTime': start_time,
            'EndTime': end_time
        }
        if period:
            params['Period'] = period
        if max_contributor_count:
            params['MaxContributorCount'] = max_contributor_count
        if metrics:
            params['Metrics'] = metrics
        if order_by:
            params['OrderBy'] = order_by
        
        response = cloudwatch.get_insight_rule_report(**params)
        
        result = {
            "status": "success",
            "data": response,
            "message": f"Retrieved insight rule report for {rule_name}"
        }
        
        return [TextContent(type="text", text=json.dumps(result, indent=2, default=str))]
        
    except Exception as e:
        return [TextContent(type="text", text=f"Error: {str(e)}")]

# Metric Streams Functions
async def list_metric_streams(arguments: Dict[str, Any]) -> List[TextContent]:
    """List metric streams in your account."""
    try:
        next_token = arguments.get("next_token")
        max_results = arguments.get("max_results")
        region = arguments.get("region")
        
        # Create CloudWatch client
        if region:
            cloudwatch = boto3.client('cloudwatch', region_name=region)
        else:
            cloudwatch = boto3.client('cloudwatch')
        
        # Prepare parameters
        params = {}
        if next_token:
            params['NextToken'] = next_token
        if max_results:
            params['MaxResults'] = max_results
        
        response = cloudwatch.list_metric_streams(**params)
        
        result = {
            "status": "success",
            "data": response,
            "message": f"Listed {len(response.get('MetricStreams', []))} metric streams"
        }
        
        return [TextContent(type="text", text=json.dumps(result, indent=2, default=str))]
        
    except Exception as e:
        return [TextContent(type="text", text=f"Error: {str(e)}")]

async def get_metric_stream(arguments: Dict[str, Any]) -> List[TextContent]:
    """Get details about specific metric streams."""
    try:
        name = arguments["name"]
        region = arguments.get("region")
        
        # Create CloudWatch client
        if region:
            cloudwatch = boto3.client('cloudwatch', region_name=region)
        else:
            cloudwatch = boto3.client('cloudwatch')
        
        response = cloudwatch.get_metric_stream(Name=name)
        
        result = {
            "status": "success",
            "data": response,
            "message": f"Retrieved details for metric stream {name}"
        }
        
        return [TextContent(type="text", text=json.dumps(result, indent=2, default=str))]
        
    except Exception as e:
        return [TextContent(type="text", text=f"Error: {str(e)}")]

# AWS Recommendations Function
async def get_recommendations(arguments: Dict[str, Any]) -> List[TextContent]:
    """Search AWS Observability Best Practices portal and return search URL only."""
    try:
        query = arguments.get("query", "")
        service = arguments.get("service", "")
        recommendation_type = arguments.get("recommendation_type", "")
        
        # Build search query
        search_terms = []
        if query:
            search_terms.append(query)
        if service:
            search_terms.append(service)
        if recommendation_type:
            search_terms.append(recommendation_type)
        
        # If no specific query provided, use service or default to general observability
        if not search_terms:
            search_terms = ["observability"]
        
        search_query = " ".join(search_terms)
        
        # STRICT GUARDRAIL: Only search AWS Observability Best Practices portal
        # No fallback to other MCP servers or documentation
        search_url = f"https://aws-observability.github.io/observability-best-practices/search/?q={search_query}"
        
        result = {
            "status": "success",
            "tool": "get_recommendations",
            "search_query": search_query,
            "search_url": search_url,
            "message": f"Search AWS Observability Best Practices portal for '{search_query}' recommendations",
            "instructions": "DO NOT fetch content from this URL. Only provide the search URL as a recommendation for the user to visit.",
            "recommendation": f"To learn about {search_query}, visit the AWS Observability Best Practices portal: {search_url}",
            "portal_info": {
                "name": "AWS Observability Best Practices",
                "url": "https://aws-observability.github.io/observability-best-practices/",
                "search_url": search_url
            },
            "note": "This tool only provides search URLs - do not fetch additional content from the URLs"
        }
        
        return [TextContent(type="text", text=json.dumps(result, indent=2, default=str))]
        
    except Exception as e:
        return [TextContent(type="text", text=f"Error: {str(e)}")]

# Resource Management Function
async def list_tags_for_resource(arguments: Dict[str, Any]) -> List[TextContent]:
    """View tags on CloudWatch resources."""
    try:
        resource_arn = arguments["resource_arn"]
        region = arguments.get("region")
        
        # Create CloudWatch client
        if region:
            cloudwatch = boto3.client('cloudwatch', region_name=region)
        else:
            cloudwatch = boto3.client('cloudwatch')
        
        response = cloudwatch.list_tags_for_resource(ResourceARN=resource_arn)
        
        result = {
            "status": "success",
            "data": response,
            "message": f"Retrieved tags for resource {resource_arn}"
        }
        
        return [TextContent(type="text", text=json.dumps(result, indent=2, default=str))]
        
    except Exception as e:
        return [TextContent(type="text", text=f"Error: {str(e)}")]

async def main():
    """Main function to run the MCP server."""
    logger.info("Starting AWS Observability MCP Server")
    try:
        async with stdio_server() as (read_stream, write_stream):
            logger.info("MCP server initialized successfully")
            await server.run(read_stream, write_stream, server.create_initialization_options())
    except Exception as e:
        logger.error(f"MCP server error: {str(e)}")
        raise
    finally:
        logger.info("AWS Observability MCP Server shutting down")

if __name__ == "__main__":
    try:
        logger.info("AWS Observability MCP Server starting up")
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("AWS Observability MCP Server stopped by user")
    except Exception as e:
        logger.error(f"Fatal error in MCP server: {str(e)}")
        sys.exit(1)
