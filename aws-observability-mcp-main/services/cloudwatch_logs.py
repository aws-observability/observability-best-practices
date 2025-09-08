"""
AWS CloudWatch Logs service module for observability-based cost optimization.

This module provides functions for analyzing CloudWatch Logs to identify
cost optimization opportunities based on observability best practices.
"""

import logging
from typing import Dict, List, Optional, Any
import boto3
from datetime import datetime, timedelta
from botocore.exceptions import ClientError
import json

logger = logging.getLogger(__name__)

def analyze_log_group_costs(
    region: Optional[str] = None,
    lookback_days: int = 30
) -> Dict[str, Any]:
    """
    Analyze CloudWatch Log Groups for cost optimization opportunities.
    
    Args:
        region: AWS region (optional)
        lookback_days: Number of days to look back for analysis
        
    Returns:
        Dictionary containing log group cost analysis and recommendations
    """
    try:
        # Create CloudWatch Logs client
        if region:
            logs_client = boto3.client('logs', region_name=region)
        else:
            logs_client = boto3.client('logs')
        
        # Get all log groups
        log_groups = []
        paginator = logs_client.get_paginator('describe_log_groups')
        
        for page in paginator.paginate():
            log_groups.extend(page.get('logGroups', []))
        
        # Analyze each log group
        analysis_results = []
        total_estimated_cost = 0.0
        
        for log_group in log_groups:
            log_group_name = log_group['logGroupName']
            
            # Get log group metrics
            try:
                # Get log stream count
                streams_response = logs_client.describe_log_streams(
                    logGroupName=log_group_name,
                    orderBy='LastEventTime',
                    descending=True,
                    limit=1
                )
                
                # Get retention period
                retention_days = log_group.get('retentionInDays', 0)  # 0 means never expire
                
                # Estimate storage cost (simplified calculation)
                # CloudWatch Logs charges $0.50 per GB ingested and $0.03 per GB stored per month
                estimated_monthly_cost = _estimate_log_group_cost(log_group, retention_days)
                total_estimated_cost += estimated_monthly_cost
                
                # Generate recommendations
                recommendations = _generate_log_group_recommendations(
                    log_group, retention_days, estimated_monthly_cost
                )
                
                analysis_results.append({
                    'logGroupName': log_group_name,
                    'retentionInDays': retention_days,
                    'estimatedMonthlyCost': estimated_monthly_cost,
                    'creationTime': log_group.get('creationTime', 0),
                    'storedBytes': log_group.get('storedBytes', 0),
                    'recommendations': recommendations
                })
                
            except ClientError as e:
                logger.warning(f"Could not analyze log group {log_group_name}: {str(e)}")
                continue
        
        # Sort by estimated cost (highest first)
        analysis_results.sort(key=lambda x: x['estimatedMonthlyCost'], reverse=True)
        
        return {
            "status": "success",
            "data": {
                "totalLogGroups": len(log_groups),
                "totalEstimatedMonthlyCost": total_estimated_cost,
                "logGroupAnalysis": analysis_results[:20],  # Top 20 most expensive
                "summary": {
                    "highCostLogGroups": len([lg for lg in analysis_results if lg['estimatedMonthlyCost'] > 50]),
                    "noRetentionLogGroups": len([lg for lg in analysis_results if lg['retentionInDays'] == 0]),
                    "potentialSavings": _calculate_potential_savings(analysis_results)
                }
            },
            "message": f"Analyzed {len(log_groups)} log groups for cost optimization opportunities"
        }
        
    except ClientError as e:
        logger.error(f"Error in CloudWatch Logs API: {str(e)}")
        return {
            "status": "error",
            "message": f"CloudWatch Logs API error: {str(e)}",
            "error_code": e.response['Error']['Code'] if 'Error' in e.response else "Unknown"
        }
        
    except Exception as e:
        logger.error(f"Unexpected error in CloudWatch Logs service: {str(e)}")
        return {
            "status": "error",
            "message": f"Unexpected error: {str(e)}"
        }

def analyze_log_retention_optimization(
    region: Optional[str] = None,
    retention_threshold_days: int = 14
) -> Dict[str, Any]:
    """
    Analyze log retention policies for optimization opportunities.
    
    Args:
        region: AWS region (optional)
        retention_threshold_days: Minimum retention period to consider for analysis
        
    Returns:
        Dictionary containing retention optimization recommendations
    """
    try:
        # Create CloudWatch Logs client
        if region:
            logs_client = boto3.client('logs', region_name=region)
        else:
            logs_client = boto3.client('logs')
        
        # Get all log groups
        log_groups = []
        paginator = logs_client.get_paginator('describe_log_groups')
        
        for page in paginator.paginate():
            log_groups.extend(page.get('logGroups', []))
        
        # Analyze retention policies
        no_retention = []
        long_retention = []
        short_retention = []
        
        for log_group in log_groups:
            retention_days = log_group.get('retentionInDays', 0)
            
            if retention_days == 0:
                no_retention.append({
                    'logGroupName': log_group['logGroupName'],
                    'storedBytes': log_group.get('storedBytes', 0),
                    'creationTime': log_group.get('creationTime', 0)
                })
            elif retention_days > 90:  # More than 3 months
                long_retention.append({
                    'logGroupName': log_group['logGroupName'],
                    'retentionInDays': retention_days,
                    'storedBytes': log_group.get('storedBytes', 0)
                })
            elif retention_days < retention_threshold_days:
                short_retention.append({
                    'logGroupName': log_group['logGroupName'],
                    'retentionInDays': retention_days,
                    'storedBytes': log_group.get('storedBytes', 0)
                })
        
        # Generate recommendations
        recommendations = []
        
        if no_retention:
            recommendations.append({
                'type': 'no_retention_policy',
                'priority': 'high',
                'description': f'{len(no_retention)} log groups have no retention policy',
                'suggestion': 'Set appropriate retention periods to control costs',
                'affectedLogGroups': no_retention[:10]  # Top 10
            })
        
        if long_retention:
            recommendations.append({
                'type': 'excessive_retention',
                'priority': 'medium',
                'description': f'{len(long_retention)} log groups have retention > 90 days',
                'suggestion': 'Review if long retention is necessary for compliance',
                'affectedLogGroups': long_retention[:10]
            })
        
        return {
            "status": "success",
            "data": {
                "totalLogGroups": len(log_groups),
                "noRetentionCount": len(no_retention),
                "longRetentionCount": len(long_retention),
                "shortRetentionCount": len(short_retention),
                "recommendations": recommendations
            },
            "message": f"Analyzed retention policies for {len(log_groups)} log groups"
        }
        
    except Exception as e:
        logger.error(f"Error analyzing log retention: {str(e)}")
        return {
            "status": "error",
            "message": f"Error analyzing log retention: {str(e)}"
        }

def get_log_insights_queries(
    log_group_name: str,
    query_string: str,
    start_time: Optional[str] = None,
    end_time: Optional[str] = None,
    region: Optional[str] = None
) -> Dict[str, Any]:
    """
    Execute CloudWatch Insights queries for cost analysis.
    
    Args:
        log_group_name: Name of the log group to query
        query_string: CloudWatch Insights query string
        start_time: Start time for query (ISO format)
        end_time: End time for query (ISO format)
        region: AWS region (optional)
        
    Returns:
        Dictionary containing query results
    """
    try:
        # Create CloudWatch Logs client
        if region:
            logs_client = boto3.client('logs', region_name=region)
        else:
            logs_client = boto3.client('logs')
        
        # Set default time range if not provided
        if not start_time:
            end_datetime = datetime.utcnow()
            start_datetime = end_datetime - timedelta(hours=1)
            start_time = int(start_datetime.timestamp())
            end_time = int(end_datetime.timestamp())
        elif not end_time:
            end_time = int(datetime.utcnow().timestamp())
        
        # Start query
        response = logs_client.start_query(
            logGroupName=log_group_name,
            startTime=start_time,
            endTime=end_time,
            queryString=query_string
        )
        
        query_id = response['queryId']
        
        # Wait for query to complete
        import time
        while True:
            result = logs_client.get_query_results(queryId=query_id)
            if result['status'] in ['Complete', 'Failed', 'Cancelled']:
                break
            time.sleep(1)
        
        if result['status'] == 'Complete':
            return {
                "status": "success",
                "data": {
                    "queryId": query_id,
                    "results": result.get('results', []),
                    "statistics": result.get('statistics', {}),
                    "queryString": query_string,
                    "logGroupName": log_group_name
                },
                "message": f"Query completed successfully for {log_group_name}"
            }
        else:
            return {
                "status": "error",
                "message": f"Query failed with status: {result['status']}"
            }
        
    except Exception as e:
        logger.error(f"Error executing CloudWatch Insights query: {str(e)}")
        return {
            "status": "error",
            "message": f"Error executing query: {str(e)}"
        }

def _estimate_log_group_cost(log_group: Dict[str, Any], retention_days: int) -> float:
    """Estimate monthly cost for a log group."""
    stored_bytes = log_group.get('storedBytes', 0)
    
    # Convert bytes to GB
    stored_gb = stored_bytes / (1024 ** 3)
    
    # CloudWatch Logs pricing (as of 2024)
    # $0.50 per GB ingested, $0.03 per GB stored per month
    # This is a simplified estimation
    monthly_storage_cost = stored_gb * 0.03
    
    return round(monthly_storage_cost, 2)

def _generate_log_group_recommendations(
    log_group: Dict[str, Any], 
    retention_days: int, 
    estimated_cost: float
) -> List[Dict[str, Any]]:
    """Generate cost optimization recommendations for a log group."""
    recommendations = []
    
    # No retention policy
    if retention_days == 0:
        recommendations.append({
            'type': 'set_retention',
            'priority': 'high',
            'description': 'No retention policy set - logs will never expire',
            'suggestion': 'Set appropriate retention period (7-30 days for most use cases)',
            'potentialSavings': f'${estimated_cost:.2f}/month'
        })
    
    # High cost log groups
    if estimated_cost > 100:
        recommendations.append({
            'type': 'high_cost',
            'priority': 'high',
            'description': f'High monthly cost: ${estimated_cost:.2f}',
            'suggestion': 'Review log volume and consider log filtering or sampling',
            'potentialSavings': f'${estimated_cost * 0.3:.2f}/month (30% reduction)'
        })
    
    # Long retention for non-critical logs
    if retention_days > 30 and 'application' not in log_group['logGroupName'].lower():
        recommendations.append({
            'type': 'reduce_retention',
            'priority': 'medium',
            'description': f'Long retention period: {retention_days} days',
            'suggestion': 'Consider reducing retention to 7-14 days for non-critical logs',
            'potentialSavings': f'${estimated_cost * 0.2:.2f}/month'
        })
    
    return recommendations

def _calculate_potential_savings(analysis_results: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Calculate potential savings from log group optimizations."""
    total_cost = sum(lg['estimatedMonthlyCost'] for lg in analysis_results)
    
    # Estimate savings from different optimization strategies
    no_retention_savings = sum(
        lg['estimatedMonthlyCost'] * 0.5  # 50% savings from setting retention
        for lg in analysis_results 
        if lg['retentionInDays'] == 0
    )
    
    high_cost_savings = sum(
        lg['estimatedMonthlyCost'] * 0.3  # 30% savings from optimization
        for lg in analysis_results 
        if lg['estimatedMonthlyCost'] > 50
    )
    
    return {
        'totalMonthlyCost': round(total_cost, 2),
        'noRetentionSavings': round(no_retention_savings, 2),
        'highCostSavings': round(high_cost_savings, 2),
        'totalPotentialSavings': round(no_retention_savings + high_cost_savings, 2),
        'savingsPercentage': round(((no_retention_savings + high_cost_savings) / total_cost * 100), 1) if total_cost > 0 else 0
    }
