"""
AWS RUM (Real User Monitoring) service module for observability analysis.

This module provides functions for analyzing AWS RUM data to identify
user experience issues and performance optimization opportunities.
"""

import logging
from typing import Dict, List, Optional, Any
import boto3
from datetime import datetime, timedelta
from botocore.exceptions import ClientError
import json

logger = logging.getLogger(__name__)

def analyze_rum_performance(
    app_monitor_name: str,
    start_time: Optional[str] = None,
    end_time: Optional[str] = None,
    region: Optional[str] = None
) -> Dict[str, Any]:
    """
    Analyze AWS RUM performance data for user experience insights.
    
    Args:
        app_monitor_name: Name of the RUM app monitor
        start_time: Start time for analysis (ISO format)
        end_time: End time for analysis (ISO format)
        region: AWS region (optional)
        
    Returns:
        Dictionary containing RUM performance analysis
    """
    try:
        # Create RUM client
        if region:
            rum_client = boto3.client('rum', region_name=region)
        else:
            rum_client = boto3.client('rum')
        
        # Set default time range if not provided
        if not start_time:
            end_datetime = datetime.utcnow()
            start_datetime = end_datetime - timedelta(hours=24)
            start_time = start_datetime.isoformat() + 'Z'
            end_time = end_datetime.isoformat() + 'Z'
        elif not end_time:
            end_time = datetime.utcnow().isoformat() + 'Z'
        
        # Get app monitor details
        try:
            app_monitor = rum_client.get_app_monitor(Name=app_monitor_name)
        except ClientError as e:
            if e.response['Error']['Code'] == 'ResourceNotFoundException':
                return {
                    "status": "error",
                    "message": f"App monitor '{app_monitor_name}' not found"
                }
            raise
        
        # Get RUM data using CloudWatch Logs Insights
        # RUM data is stored in CloudWatch Logs
        logs_client = boto3.client('logs', region_name=region) if region else boto3.client('logs')
        
        # RUM log group name pattern
        log_group_name = f"/aws/rum/{app_monitor_name}"
        
        # Query for performance metrics
        performance_query = """
        fields @timestamp, @message
        | filter @message like /performance/
        | parse @message '"pageLoadTime":*' as pageLoadTime
        | parse @message '"domContentLoaded":*' as domContentLoaded
        | parse @message '"firstContentfulPaint":*' as firstContentfulPaint
        | parse @message '"largestContentfulPaint":*' as largestContentfulPaint
        | parse @message '"firstInputDelay":*' as firstInputDelay
        | parse @message '"cumulativeLayoutShift":*' as cumulativeLayoutShift
        | stats avg(pageLoadTime) as avgPageLoadTime, 
                avg(domContentLoaded) as avgDomContentLoaded,
                avg(firstContentfulPaint) as avgFirstContentfulPaint,
                avg(largestContentfulPaint) as avgLargestContentfulPaint,
                avg(firstInputDelay) as avgFirstInputDelay,
                avg(cumulativeLayoutShift) as avgCumulativeLayoutShift
        """
        
        # Execute the query
        query_response = _execute_cloudwatch_insights_query(
            logs_client, log_group_name, performance_query, start_time, end_time
        )
        
        # Query for error data
        error_query = """
        fields @timestamp, @message
        | filter @message like /error/ or @message like /exception/
        | parse @message '"errorMessage":*' as errorMessage
        | parse @message '"errorType":*' as errorType
        | parse @message '"url":*' as url
        | stats count() as errorCount by errorType, url
        | sort errorCount desc
        | limit 10
        """
        
        error_response = _execute_cloudwatch_insights_query(
            logs_client, log_group_name, error_query, start_time, end_time
        )
        
        # Query for geographic performance
        geo_query = """
        fields @timestamp, @message
        | filter @message like /performance/
        | parse @message '"country":*' as country
        | parse @message '"pageLoadTime":*' as pageLoadTime
        | stats avg(pageLoadTime) as avgPageLoadTime by country
        | sort avgPageLoadTime desc
        | limit 10
        """
        
        geo_response = _execute_cloudwatch_insights_query(
            logs_client, log_group_name, geo_query, start_time, end_time
        )
        
        # Analyze the results
        analysis = _analyze_rum_data(query_response, error_response, geo_response)
        
        return {
            "status": "success",
            "data": {
                "appMonitorName": app_monitor_name,
                "timeRange": {
                    "startTime": start_time,
                    "endTime": end_time
                },
                "performanceMetrics": analysis.get('performance', {}),
                "errorAnalysis": analysis.get('errors', {}),
                "geographicAnalysis": analysis.get('geographic', {}),
                "recommendations": analysis.get('recommendations', [])
            },
            "message": f"Analyzed RUM performance data for {app_monitor_name}"
        }
        
    except ClientError as e:
        logger.error(f"Error in AWS RUM API: {str(e)}")
        return {
            "status": "error",
            "message": f"AWS RUM API error: {str(e)}",
            "error_code": e.response['Error']['Code'] if 'Error' in e.response else "Unknown"
        }
        
    except Exception as e:
        logger.error(f"Unexpected error in AWS RUM service: {str(e)}")
        return {
            "status": "error",
            "message": f"Unexpected error: {str(e)}"
        }

def get_user_experience_metrics(
    app_monitor_name: str,
    start_time: Optional[str] = None,
    end_time: Optional[str] = None,
    region: Optional[str] = None
) -> Dict[str, Any]:
    """
    Get comprehensive user experience metrics from AWS RUM.
    
    Args:
        app_monitor_name: Name of the RUM app monitor
        start_time: Start time for analysis (ISO format)
        end_time: End time for analysis (ISO format)
        region: AWS region (optional)
        
    Returns:
        Dictionary containing user experience metrics
    """
    try:
        # Create RUM client
        if region:
            rum_client = boto3.client('rum', region_name=region)
        else:
            rum_client = boto3.client('rum')
        
        # Set default time range if not provided
        if not start_time:
            end_datetime = datetime.utcnow()
            start_datetime = end_datetime - timedelta(hours=24)
            start_time = start_datetime.isoformat() + 'Z'
            end_time = end_datetime.isoformat() + 'Z'
        elif not end_time:
            end_time = datetime.utcnow().isoformat() + 'Z'
        
        # Get app monitor details
        app_monitor = rum_client.get_app_monitor(Name=app_monitor_name)
        
        # Get RUM data using CloudWatch Logs Insights
        logs_client = boto3.client('logs', region_name=region) if region else boto3.client('logs')
        log_group_name = f"/aws/rum/{app_monitor_name}"
        
        # Web Vitals query
        web_vitals_query = """
        fields @timestamp, @message
        | filter @message like /performance/
        | parse @message '"largestContentfulPaint":*' as lcp
        | parse @message '"firstInputDelay":*' as fid
        | parse @message '"cumulativeLayoutShift":*' as cls
        | parse @message '"firstContentfulPaint":*' as fcp
        | stats avg(lcp) as avgLCP, 
                avg(fid) as avgFID,
                avg(cls) as avgCLS,
                avg(fcp) as avgFCP,
                count() as totalSessions
        """
        
        web_vitals_response = _execute_cloudwatch_insights_query(
            logs_client, log_group_name, web_vitals_query, start_time, end_time
        )
        
        # Device and browser analysis
        device_query = """
        fields @timestamp, @message
        | filter @message like /performance/
        | parse @message '"deviceType":*' as deviceType
        | parse @message '"browser":*' as browser
        | parse @message '"pageLoadTime":*' as pageLoadTime
        | stats avg(pageLoadTime) as avgPageLoadTime, count() as sessionCount by deviceType, browser
        | sort avgPageLoadTime desc
        """
        
        device_response = _execute_cloudwatch_insights_query(
            logs_client, log_group_name, device_query, start_time, end_time
        )
        
        # User journey analysis
        journey_query = """
        fields @timestamp, @message
        | filter @message like /navigation/
        | parse @message '"from":*' as fromPage
        | parse @message '"to":*' as toPage
        | parse @message '"duration":*' as duration
        | stats count() as navigationCount, avg(duration) as avgDuration by fromPage, toPage
        | sort navigationCount desc
        | limit 20
        """
        
        journey_response = _execute_cloudwatch_insights_query(
            logs_client, log_group_name, journey_query, start_time, end_time
        )
        
        # Analyze the results
        metrics = _analyze_user_experience_metrics(
            web_vitals_response, device_response, journey_response
        )
        
        return {
            "status": "success",
            "data": {
                "appMonitorName": app_monitor_name,
                "timeRange": {
                    "startTime": start_time,
                    "endTime": end_time
                },
                "webVitals": metrics.get('webVitals', {}),
                "deviceAnalysis": metrics.get('deviceAnalysis', {}),
                "userJourney": metrics.get('userJourney', {}),
                "insights": metrics.get('insights', [])
            },
            "message": f"Retrieved user experience metrics for {app_monitor_name}"
        }
        
    except Exception as e:
        logger.error(f"Error getting user experience metrics: {str(e)}")
        return {
            "status": "error",
            "message": f"Error getting user experience metrics: {str(e)}"
        }

def analyze_mobile_app_performance(
    app_monitor_name: str,
    start_time: Optional[str] = None,
    end_time: Optional[str] = None,
    region: Optional[str] = None
) -> Dict[str, Any]:
    """
    Analyze mobile app performance using AWS RUM.
    
    Args:
        app_monitor_name: Name of the RUM app monitor
        start_time: Start time for analysis (ISO format)
        end_time: End time for analysis (ISO format)
        region: AWS region (optional)
        
    Returns:
        Dictionary containing mobile app performance analysis
    """
    try:
        # Create RUM client
        if region:
            rum_client = boto3.client('rum', region_name=region)
        else:
            rum_client = boto3.client('rum')
        
        # Set default time range if not provided
        if not start_time:
            end_datetime = datetime.utcnow()
            start_datetime = end_datetime - timedelta(hours=24)
            start_time = start_datetime.isoformat() + 'Z'
            end_time = end_datetime.isoformat() + 'Z'
        elif not end_time:
            end_time = datetime.utcnow().isoformat() + 'Z'
        
        # Get RUM data using CloudWatch Logs Insights
        logs_client = boto3.client('logs', region_name=region) if region else boto3.client('logs')
        log_group_name = f"/aws/rum/{app_monitor_name}"
        
        # Mobile app performance query
        mobile_query = """
        fields @timestamp, @message
        | filter @message like /mobile/ or @message like /app/
        | parse @message '"appVersion":*' as appVersion
        | parse @message '"osVersion":*' as osVersion
        | parse @message '"deviceModel":*' as deviceModel
        | parse @message '"crashCount":*' as crashCount
        | parse @message '"sessionDuration":*' as sessionDuration
        | parse @message '"screenLoadTime":*' as screenLoadTime
        | stats avg(sessionDuration) as avgSessionDuration,
                avg(screenLoadTime) as avgScreenLoadTime,
                sum(crashCount) as totalCrashes,
                count() as totalSessions by appVersion, osVersion, deviceModel
        | sort totalCrashes desc
        """
        
        mobile_response = _execute_cloudwatch_insights_query(
            logs_client, log_group_name, mobile_query, start_time, end_time
        )
        
        # Crash analysis
        crash_query = """
        fields @timestamp, @message
        | filter @message like /crash/ or @message like /error/
        | parse @message '"crashReason":*' as crashReason
        | parse @message '"stackTrace":*' as stackTrace
        | parse @message '"appVersion":*' as appVersion
        | stats count() as crashCount by crashReason, appVersion
        | sort crashCount desc
        | limit 10
        """
        
        crash_response = _execute_cloudwatch_insights_query(
            logs_client, log_group_name, crash_query, start_time, end_time
        )
        
        # Analyze mobile performance
        analysis = _analyze_mobile_performance(mobile_response, crash_response)
        
        return {
            "status": "success",
            "data": {
                "appMonitorName": app_monitor_name,
                "timeRange": {
                    "startTime": start_time,
                    "endTime": end_time
                },
                "performanceMetrics": analysis.get('performance', {}),
                "crashAnalysis": analysis.get('crashes', {}),
                "recommendations": analysis.get('recommendations', [])
            },
            "message": f"Analyzed mobile app performance for {app_monitor_name}"
        }
        
    except Exception as e:
        logger.error(f"Error analyzing mobile app performance: {str(e)}")
        return {
            "status": "error",
            "message": f"Error analyzing mobile app performance: {str(e)}"
        }

def _execute_cloudwatch_insights_query(
    logs_client, log_group_name: str, query_string: str, 
    start_time: str, end_time: str
) -> Dict[str, Any]:
    """Execute a CloudWatch Insights query."""
    try:
        # Convert ISO timestamps to Unix timestamps
        start_ts = int(datetime.fromisoformat(start_time.replace('Z', '+00:00')).timestamp())
        end_ts = int(datetime.fromisoformat(end_time.replace('Z', '+00:00')).timestamp())
        
        # Start query
        response = logs_client.start_query(
            logGroupName=log_group_name,
            startTime=start_ts,
            endTime=end_ts,
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
                "results": result.get('results', []),
                "statistics": result.get('statistics', {})
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

def _analyze_rum_data(performance_response: Dict, error_response: Dict, geo_response: Dict) -> Dict[str, Any]:
    """Analyze RUM data and generate insights."""
    analysis = {
        'performance': {},
        'errors': {},
        'geographic': {},
        'recommendations': []
    }
    
    # Analyze performance data
    if performance_response.get('status') == 'success' and performance_response.get('results'):
        results = performance_response['results']
        if results:
            perf_data = results[0]
            analysis['performance'] = {
                'avgPageLoadTime': perf_data.get('avgPageLoadTime', 0),
                'avgDomContentLoaded': perf_data.get('avgDomContentLoaded', 0),
                'avgFirstContentfulPaint': perf_data.get('avgFirstContentfulPaint', 0),
                'avgLargestContentfulPaint': perf_data.get('avgLargestContentfulPaint', 0),
                'avgFirstInputDelay': perf_data.get('avgFirstInputDelay', 0),
                'avgCumulativeLayoutShift': perf_data.get('avgCumulativeLayoutShift', 0)
            }
            
            # Generate performance recommendations
            if perf_data.get('avgPageLoadTime', 0) > 3000:  # 3 seconds
                analysis['recommendations'].append({
                    'type': 'performance',
                    'priority': 'high',
                    'description': 'Page load time is above 3 seconds',
                    'suggestion': 'Optimize images, enable compression, and minimize JavaScript'
                })
    
    # Analyze error data
    if error_response.get('status') == 'success' and error_response.get('results'):
        error_results = error_response['results']
        analysis['errors'] = {
            'topErrors': error_results[:5],
            'totalErrorTypes': len(error_results)
        }
        
        if error_results:
            analysis['recommendations'].append({
                'type': 'error_handling',
                'priority': 'medium',
                'description': f'Found {len(error_results)} different error types',
                'suggestion': 'Review and fix the most common errors to improve user experience'
            })
    
    # Analyze geographic data
    if geo_response.get('status') == 'success' and geo_response.get('results'):
        geo_results = geo_response['results']
        analysis['geographic'] = {
            'topSlowRegions': geo_results[:5],
            'totalRegions': len(geo_results)
        }
    
    return analysis

def _analyze_user_experience_metrics(web_vitals_response: Dict, device_response: Dict, journey_response: Dict) -> Dict[str, Any]:
    """Analyze user experience metrics."""
    metrics = {
        'webVitals': {},
        'deviceAnalysis': {},
        'userJourney': {},
        'insights': []
    }
    
    # Analyze Web Vitals
    if web_vitals_response.get('status') == 'success' and web_vitals_response.get('results'):
        results = web_vitals_response['results']
        if results:
            vitals_data = results[0]
            metrics['webVitals'] = {
                'lcp': vitals_data.get('avgLCP', 0),
                'fid': vitals_data.get('avgFID', 0),
                'cls': vitals_data.get('avgCLS', 0),
                'fcp': vitals_data.get('avgFCP', 0),
                'totalSessions': vitals_data.get('totalSessions', 0)
            }
            
            # Web Vitals recommendations
            if vitals_data.get('avgLCP', 0) > 2500:  # 2.5 seconds
                metrics['insights'].append({
                    'type': 'web_vitals',
                    'priority': 'high',
                    'description': 'Largest Contentful Paint is above 2.5 seconds',
                    'suggestion': 'Optimize images and critical resources'
                })
    
    # Analyze device performance
    if device_response.get('status') == 'success' and device_response.get('results'):
        metrics['deviceAnalysis'] = {
            'devicePerformance': device_response['results'][:10]
        }
    
    # Analyze user journey
    if journey_response.get('status') == 'success' and journey_response.get('results'):
        metrics['userJourney'] = {
            'navigationPatterns': journey_response['results'][:10]
        }
    
    return metrics

def _analyze_mobile_performance(mobile_response: Dict, crash_response: Dict) -> Dict[str, Any]:
    """Analyze mobile app performance."""
    analysis = {
        'performance': {},
        'crashes': {},
        'recommendations': []
    }
    
    # Analyze performance metrics
    if mobile_response.get('status') == 'success' and mobile_response.get('results'):
        results = mobile_response['results']
        analysis['performance'] = {
            'devicePerformance': results[:10],
            'totalSessions': sum(int(r.get('totalSessions', 0)) for r in results)
        }
    
    # Analyze crashes
    if crash_response.get('status') == 'success' and crash_response.get('results'):
        crash_results = crash_response['results']
        analysis['crashes'] = {
            'topCrashes': crash_results[:5],
            'totalCrashTypes': len(crash_results)
        }
        
        if crash_results:
            analysis['recommendations'].append({
                'type': 'crash_fix',
                'priority': 'high',
                'description': f'Found {len(crash_results)} different crash types',
                'suggestion': 'Prioritize fixing the most common crashes to improve app stability'
            })
    
    return analysis
