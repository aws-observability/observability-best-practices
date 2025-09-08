"""
Metrics Analysis Playbook

This module implements comprehensive metrics analysis playbooks for observability.
It provides functions to analyze CloudWatch metrics for performance, anomalies, and infrastructure health.
"""

import logging
import boto3
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
from botocore.exceptions import ClientError

logger = logging.getLogger(__name__)

def analyze_ec2_metrics(
    instance_id: str,
    start_time: Optional[str] = None,
    end_time: Optional[str] = None,
    region: Optional[str] = None
) -> Dict[str, Any]:
    """
    Analyze EC2 instance metrics for performance and health.
    
    Args:
        instance_id: EC2 instance ID
        start_time: Start time for analysis (ISO format)
        end_time: End time for analysis (ISO format)
        region: AWS region
        
    Returns:
        Dictionary containing EC2 metrics analysis
    """
    try:
        # Set default time range if not provided
        if not start_time:
            end_datetime = datetime.utcnow()
            start_datetime = end_datetime - timedelta(hours=24)
            start_time = start_datetime
            end_time = end_datetime
        elif not end_time:
            end_time = datetime.utcnow()
        
        # Create CloudWatch client
        if region:
            cloudwatch = boto3.client('cloudwatch', region_name=region)
        else:
            cloudwatch = boto3.client('cloudwatch')
        
        # Define metrics to analyze
        metrics_to_analyze = [
            'CPUUtilization',
            'NetworkIn',
            'NetworkOut',
            'DiskReadOps',
            'DiskWriteOps',
            'StatusCheckFailed'
        ]
        
        metrics_data = {}
        
        for metric_name in metrics_to_analyze:
            try:
                response = cloudwatch.get_metric_statistics(
                    Namespace='AWS/EC2',
                    MetricName=metric_name,
                    Dimensions=[{'Name': 'InstanceId', 'Value': instance_id}],
                    StartTime=start_time,
                    EndTime=end_time,
                    Period=300,  # 5-minute periods
                    Statistics=['Average', 'Maximum', 'Minimum']
                )
                
                if response['Datapoints']:
                    datapoints = response['Datapoints']
                    metrics_data[metric_name] = {
                        'average': sum(dp['Average'] for dp in datapoints) / len(datapoints),
                        'maximum': max(dp['Maximum'] for dp in datapoints),
                        'minimum': min(dp['Minimum'] for dp in datapoints),
                        'datapoints': len(datapoints)
                    }
                else:
                    metrics_data[metric_name] = {'error': 'No data available'}
                    
            except ClientError as e:
                logger.warning(f"Error getting {metric_name} for {instance_id}: {e}")
                metrics_data[metric_name] = {'error': str(e)}
        
        # Analyze metrics for issues
        analysis = _analyze_ec2_metrics_data(metrics_data)
        
        return {
            "status": "success",
            "data": {
                "instance_id": instance_id,
                "time_range": {"start": start_time.isoformat(), "end": end_time.isoformat()},
                "metrics": metrics_data,
                "analysis": analysis,
                "recommendations": _generate_ec2_recommendations(analysis)
            },
            "message": f"Analyzed EC2 metrics for {instance_id}"
        }
        
    except Exception as e:
        logger.error(f"Error analyzing EC2 metrics: {str(e)}")
        return {
            "status": "error",
            "message": f"Error analyzing EC2 metrics: {str(e)}"
        }

def analyze_rds_metrics(
    db_instance_identifier: str,
    start_time: Optional[str] = None,
    end_time: Optional[str] = None,
    region: Optional[str] = None
) -> Dict[str, Any]:
    """
    Analyze RDS instance metrics for performance and health.
    
    Args:
        db_instance_identifier: RDS instance identifier
        start_time: Start time for analysis (ISO format)
        end_time: End time for analysis (ISO format)
        region: AWS region
        
    Returns:
        Dictionary containing RDS metrics analysis
    """
    try:
        # Set default time range if not provided
        if not start_time:
            end_datetime = datetime.utcnow()
            start_datetime = end_datetime - timedelta(hours=24)
            start_time = start_datetime
            end_time = end_datetime
        elif not end_time:
            end_time = datetime.utcnow()
        
        # Create CloudWatch client
        if region:
            cloudwatch = boto3.client('cloudwatch', region_name=region)
        else:
            cloudwatch = boto3.client('cloudwatch')
        
        # Define RDS metrics to analyze
        metrics_to_analyze = [
            'CPUUtilization',
            'DatabaseConnections',
            'FreeableMemory',
            'FreeStorageSpace',
            'ReadIOPS',
            'WriteIOPS',
            'ReadLatency',
            'WriteLatency'
        ]
        
        metrics_data = {}
        
        for metric_name in metrics_to_analyze:
            try:
                response = cloudwatch.get_metric_statistics(
                    Namespace='AWS/RDS',
                    MetricName=metric_name,
                    Dimensions=[{'Name': 'DBInstanceIdentifier', 'Value': db_instance_identifier}],
                    StartTime=start_time,
                    EndTime=end_time,
                    Period=300,  # 5-minute periods
                    Statistics=['Average', 'Maximum', 'Minimum']
                )
                
                if response['Datapoints']:
                    datapoints = response['Datapoints']
                    metrics_data[metric_name] = {
                        'average': sum(dp['Average'] for dp in datapoints) / len(datapoints),
                        'maximum': max(dp['Maximum'] for dp in datapoints),
                        'minimum': min(dp['Minimum'] for dp in datapoints),
                        'datapoints': len(datapoints)
                    }
                else:
                    metrics_data[metric_name] = {'error': 'No data available'}
                    
            except ClientError as e:
                logger.warning(f"Error getting {metric_name} for {db_instance_identifier}: {e}")
                metrics_data[metric_name] = {'error': str(e)}
        
        # Analyze metrics for issues
        analysis = _analyze_rds_metrics_data(metrics_data)
        
        return {
            "status": "success",
            "data": {
                "db_instance": db_instance_identifier,
                "time_range": {"start": start_time.isoformat(), "end": end_time.isoformat()},
                "metrics": metrics_data,
                "analysis": analysis,
                "recommendations": _generate_rds_recommendations(analysis)
            },
            "message": f"Analyzed RDS metrics for {db_instance_identifier}"
        }
        
    except Exception as e:
        logger.error(f"Error analyzing RDS metrics: {str(e)}")
        return {
            "status": "error",
            "message": f"Error analyzing RDS metrics: {str(e)}"
        }

def analyze_lambda_metrics(
    function_name: str,
    start_time: Optional[str] = None,
    end_time: Optional[str] = None,
    region: Optional[str] = None
) -> Dict[str, Any]:
    """
    Analyze Lambda function metrics for performance and health.
    
    Args:
        function_name: Lambda function name
        start_time: Start time for analysis (ISO format)
        end_time: End time for analysis (ISO format)
        region: AWS region
        
    Returns:
        Dictionary containing Lambda metrics analysis
    """
    try:
        # Set default time range if not provided
        if not start_time:
            end_datetime = datetime.utcnow()
            start_datetime = end_datetime - timedelta(hours=24)
            start_time = start_datetime
            end_time = end_datetime
        elif not end_time:
            end_time = datetime.utcnow()
        
        # Create CloudWatch client
        if region:
            cloudwatch = boto3.client('cloudwatch', region_name=region)
        else:
            cloudwatch = boto3.client('cloudwatch')
        
        # Define Lambda metrics to analyze
        metrics_to_analyze = [
            'Invocations',
            'Errors',
            'Duration',
            'Throttles',
            'ConcurrentExecutions',
            'DeadLetterErrors'
        ]
        
        metrics_data = {}
        
        for metric_name in metrics_to_analyze:
            try:
                response = cloudwatch.get_metric_statistics(
                    Namespace='AWS/Lambda',
                    MetricName=metric_name,
                    Dimensions=[{'Name': 'FunctionName', 'Value': function_name}],
                    StartTime=start_time,
                    EndTime=end_time,
                    Period=300,  # 5-minute periods
                    Statistics=['Sum', 'Average', 'Maximum', 'Minimum']
                )
                
                if response['Datapoints']:
                    datapoints = response['Datapoints']
                    if metric_name in ['Invocations', 'Errors', 'Throttles', 'DeadLetterErrors']:
                        # Sum metrics
                        metrics_data[metric_name] = {
                            'total': sum(dp['Sum'] for dp in datapoints),
                            'average': sum(dp['Sum'] for dp in datapoints) / len(datapoints),
                            'datapoints': len(datapoints)
                        }
                    else:
                        # Average metrics
                        metrics_data[metric_name] = {
                            'average': sum(dp['Average'] for dp in datapoints) / len(datapoints),
                            'maximum': max(dp['Maximum'] for dp in datapoints),
                            'minimum': min(dp['Minimum'] for dp in datapoints),
                            'datapoints': len(datapoints)
                        }
                else:
                    metrics_data[metric_name] = {'error': 'No data available'}
                    
            except ClientError as e:
                logger.warning(f"Error getting {metric_name} for {function_name}: {e}")
                metrics_data[metric_name] = {'error': str(e)}
        
        # Analyze metrics for issues
        analysis = _analyze_lambda_metrics_data(metrics_data)
        
        return {
            "status": "success",
            "data": {
                "function_name": function_name,
                "time_range": {"start": start_time.isoformat(), "end": end_time.isoformat()},
                "metrics": metrics_data,
                "analysis": analysis,
                "recommendations": _generate_lambda_recommendations(analysis)
            },
            "message": f"Analyzed Lambda metrics for {function_name}"
        }
        
    except Exception as e:
        logger.error(f"Error analyzing Lambda metrics: {str(e)}")
        return {
            "status": "error",
            "message": f"Error analyzing Lambda metrics: {str(e)}"
        }

def detect_metric_anomalies(
    namespace: str,
    metric_name: str,
    dimensions: List[Dict[str, str]],
    start_time: Optional[str] = None,
    end_time: Optional[str] = None,
    region: Optional[str] = None,
    threshold_multiplier: float = 2.0
) -> Dict[str, Any]:
    """
    Detect anomalies in CloudWatch metrics using statistical analysis.
    
    Args:
        namespace: CloudWatch namespace
        metric_name: Metric name
        dimensions: List of dimension dictionaries
        start_time: Start time for analysis (ISO format)
        end_time: End time for analysis (ISO format)
        region: AWS region
        threshold_multiplier: Multiplier for anomaly detection threshold
        
    Returns:
        Dictionary containing anomaly detection results
    """
    try:
        # Set default time range if not provided
        if not start_time:
            end_datetime = datetime.utcnow()
            start_datetime = end_datetime - timedelta(hours=24)
            start_time = start_datetime
            end_time = end_datetime
        elif not end_time:
            end_time = datetime.utcnow()
        
        # Create CloudWatch client
        if region:
            cloudwatch = boto3.client('cloudwatch', region_name=region)
        else:
            cloudwatch = boto3.client('cloudwatch')
        
        # Get metric statistics
        response = cloudwatch.get_metric_statistics(
            Namespace=namespace,
            MetricName=metric_name,
            Dimensions=dimensions,
            StartTime=start_time,
            EndTime=end_time,
            Period=300,  # 5-minute periods
            Statistics=['Average']
        )
        
        if not response['Datapoints']:
            return {
                "status": "error",
                "message": "No data available for anomaly detection"
            }
        
        # Extract values and timestamps
        datapoints = response['Datapoints']
        values = [dp['Average'] for dp in datapoints]
        timestamps = [dp['Timestamp'] for dp in datapoints]
        
        # Calculate statistical measures
        mean_value = sum(values) / len(values)
        variance = sum((x - mean_value) ** 2 for x in values) / len(values)
        std_deviation = variance ** 0.5
        
        # Detect anomalies
        threshold = mean_value + (threshold_multiplier * std_deviation)
        anomalies = []
        
        for i, (value, timestamp) in enumerate(zip(values, timestamps)):
            if value > threshold:
                anomalies.append({
                    'timestamp': timestamp.isoformat(),
                    'value': value,
                    'threshold': threshold,
                    'deviation': (value - mean_value) / std_deviation if std_deviation > 0 else 0
                })
        
        return {
            "status": "success",
            "data": {
                "namespace": namespace,
                "metric_name": metric_name,
                "dimensions": dimensions,
                "time_range": {"start": start_time.isoformat(), "end": end_time.isoformat()},
                "statistics": {
                    "mean": mean_value,
                    "std_deviation": std_deviation,
                    "threshold": threshold,
                    "total_datapoints": len(values)
                },
                "anomalies": anomalies,
                "anomaly_count": len(anomalies),
                "anomaly_rate": len(anomalies) / len(values) * 100
            },
            "message": f"Detected {len(anomalies)} anomalies in {metric_name}"
        }
        
    except Exception as e:
        logger.error(f"Error detecting metric anomalies: {str(e)}")
        return {
            "status": "error",
            "message": f"Error detecting metric anomalies: {str(e)}"
        }

def _analyze_ec2_metrics_data(metrics_data: Dict) -> Dict[str, Any]:
    """Analyze EC2 metrics data for issues."""
    analysis = {
        "cpu_utilization": "normal",
        "network_performance": "normal",
        "disk_performance": "normal",
        "health_status": "healthy",
        "issues": []
    }
    
    # CPU analysis
    cpu_data = metrics_data.get('CPUUtilization', {})
    if 'average' in cpu_data:
        avg_cpu = cpu_data['average']
        if avg_cpu > 80:
            analysis["cpu_utilization"] = "high"
            analysis["issues"].append(f"High CPU utilization: {avg_cpu:.1f}%")
        elif avg_cpu > 60:
            analysis["cpu_utilization"] = "moderate"
            analysis["issues"].append(f"Moderate CPU utilization: {avg_cpu:.1f}%")
    
    # Network analysis
    network_in = metrics_data.get('NetworkIn', {})
    network_out = metrics_data.get('NetworkOut', {})
    if 'average' in network_in and 'average' in network_out:
        total_network = network_in['average'] + network_out['average']
        if total_network > 1000000000:  # 1 GB
            analysis["network_performance"] = "high"
            analysis["issues"].append("High network traffic detected")
    
    # Disk analysis
    disk_read = metrics_data.get('DiskReadOps', {})
    disk_write = metrics_data.get('DiskWriteOps', {})
    if 'average' in disk_read and 'average' in disk_write:
        total_disk_ops = disk_read['average'] + disk_write['average']
        if total_disk_ops > 1000:  # 1000 IOPS
            analysis["disk_performance"] = "high"
            analysis["issues"].append("High disk I/O detected")
    
    # Health status
    status_check = metrics_data.get('StatusCheckFailed', {})
    if 'average' in status_check and status_check['average'] > 0:
        analysis["health_status"] = "unhealthy"
        analysis["issues"].append("Status check failures detected")
    
    return analysis

def _analyze_rds_metrics_data(metrics_data: Dict) -> Dict[str, Any]:
    """Analyze RDS metrics data for issues."""
    analysis = {
        "cpu_utilization": "normal",
        "memory_usage": "normal",
        "storage_usage": "normal",
        "connection_health": "normal",
        "io_performance": "normal",
        "health_status": "healthy",
        "issues": []
    }
    
    # CPU analysis
    cpu_data = metrics_data.get('CPUUtilization', {})
    if 'average' in cpu_data:
        avg_cpu = cpu_data['average']
        if avg_cpu > 80:
            analysis["cpu_utilization"] = "high"
            analysis["issues"].append(f"High CPU utilization: {avg_cpu:.1f}%")
    
    # Memory analysis
    memory_data = metrics_data.get('FreeableMemory', {})
    if 'average' in memory_data:
        free_memory = memory_data['average']
        if free_memory < 1000000000:  # Less than 1 GB
            analysis["memory_usage"] = "low"
            analysis["issues"].append("Low free memory detected")
    
    # Storage analysis
    storage_data = metrics_data.get('FreeStorageSpace', {})
    if 'average' in storage_data:
        free_storage = storage_data['average']
        if free_storage < 10000000000:  # Less than 10 GB
            analysis["storage_usage"] = "low"
            analysis["issues"].append("Low free storage space detected")
    
    # Connection analysis
    connections_data = metrics_data.get('DatabaseConnections', {})
    if 'average' in connections_data:
        avg_connections = connections_data['average']
        if avg_connections > 100:  # More than 100 connections
            analysis["connection_health"] = "high"
            analysis["issues"].append(f"High connection count: {avg_connections:.0f}")
    
    # I/O performance analysis
    read_latency = metrics_data.get('ReadLatency', {})
    write_latency = metrics_data.get('WriteLatency', {})
    if 'average' in read_latency and 'average' in write_latency:
        avg_read_latency = read_latency['average']
        avg_write_latency = write_latency['average']
        if avg_read_latency > 0.1 or avg_write_latency > 0.1:  # More than 100ms
            analysis["io_performance"] = "slow"
            analysis["issues"].append("High I/O latency detected")
    
    return analysis

def _analyze_lambda_metrics_data(metrics_data: Dict) -> Dict[str, Any]:
    """Analyze Lambda metrics data for issues."""
    analysis = {
        "error_rate": "normal",
        "duration": "normal",
        "throttling": "normal",
        "concurrency": "normal",
        "health_status": "healthy",
        "issues": []
    }
    
    # Error rate analysis
    invocations_data = metrics_data.get('Invocations', {})
    errors_data = metrics_data.get('Errors', {})
    if 'total' in invocations_data and 'total' in errors_data:
        total_invocations = invocations_data['total']
        total_errors = errors_data['total']
        if total_invocations > 0:
            error_rate = (total_errors / total_invocations) * 100
            if error_rate > 5:  # More than 5%
                analysis["error_rate"] = "high"
                analysis["issues"].append(f"High error rate: {error_rate:.1f}%")
            elif error_rate > 1:  # More than 1%
                analysis["error_rate"] = "moderate"
                analysis["issues"].append(f"Moderate error rate: {error_rate:.1f}%")
    
    # Duration analysis
    duration_data = metrics_data.get('Duration', {})
    if 'average' in duration_data:
        avg_duration = duration_data['average']
        if avg_duration > 10000:  # More than 10 seconds
            analysis["duration"] = "slow"
            analysis["issues"].append(f"Slow execution time: {avg_duration:.0f}ms")
    
    # Throttling analysis
    throttles_data = metrics_data.get('Throttles', {})
    if 'total' in throttles_data and throttles_data['total'] > 0:
        analysis["throttling"] = "detected"
        analysis["issues"].append(f"Function throttling detected: {throttles_data['total']} throttles")
    
    # Concurrency analysis
    concurrency_data = metrics_data.get('ConcurrentExecutions', {})
    if 'average' in concurrency_data:
        avg_concurrency = concurrency_data['average']
        if avg_concurrency > 100:  # More than 100 concurrent executions
            analysis["concurrency"] = "high"
            analysis["issues"].append(f"High concurrency: {avg_concurrency:.0f} concurrent executions")
    
    return analysis

def _generate_ec2_recommendations(analysis: Dict) -> List[str]:
    """Generate recommendations based on EC2 analysis."""
    recommendations = []
    
    if analysis["cpu_utilization"] == "high":
        recommendations.append("Consider upgrading to a larger instance type or implementing auto-scaling")
    
    if analysis["network_performance"] == "high":
        recommendations.append("Review network configuration and consider using enhanced networking")
    
    if analysis["disk_performance"] == "high":
        recommendations.append("Consider using EBS optimized instances or provisioned IOPS")
    
    if analysis["health_status"] == "unhealthy":
        recommendations.append("Investigate status check failures and consider instance replacement")
    
    if not analysis["issues"]:
        recommendations.append("EC2 instance is performing well. Continue monitoring for any changes.")
    
    return recommendations

def _generate_rds_recommendations(analysis: Dict) -> List[str]:
    """Generate recommendations based on RDS analysis."""
    recommendations = []
    
    if analysis["cpu_utilization"] == "high":
        recommendations.append("Consider upgrading to a larger instance class")
    
    if analysis["memory_usage"] == "low":
        recommendations.append("Consider increasing memory allocation or optimizing queries")
    
    if analysis["storage_usage"] == "low":
        recommendations.append("Consider increasing storage capacity or cleaning up old data")
    
    if analysis["connection_health"] == "high":
        recommendations.append("Review connection pooling and consider increasing max connections")
    
    if analysis["io_performance"] == "slow":
        recommendations.append("Consider using provisioned IOPS or optimizing database queries")
    
    if not analysis["issues"]:
        recommendations.append("RDS instance is performing well. Continue monitoring for any changes.")
    
    return recommendations

def _generate_lambda_recommendations(analysis: Dict) -> List[str]:
    """Generate recommendations based on Lambda analysis."""
    recommendations = []
    
    if analysis["error_rate"] == "high":
        recommendations.append("Review function code and implement better error handling")
    
    if analysis["duration"] == "slow":
        recommendations.append("Optimize function code and consider increasing memory allocation")
    
    if analysis["throttling"] == "detected":
        recommendations.append("Consider increasing reserved concurrency or optimizing function performance")
    
    if analysis["concurrency"] == "high":
        recommendations.append("Review function design and consider implementing throttling controls")
    
    if not analysis["issues"]:
        recommendations.append("Lambda function is performing well. Continue monitoring for any changes.")
    
    return recommendations
