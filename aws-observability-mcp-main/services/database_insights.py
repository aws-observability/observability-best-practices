"""
AWS Database Insights service module.

This module provides functions for interacting with the AWS Database Insights API.
"""

import logging
from typing import Dict, List, Optional, Any
import boto3
from datetime import datetime, timedelta
from botocore.exceptions import ClientError

logger = logging.getLogger(__name__)

def get_database_insights_metrics(
    db_instance_identifier: str,
    start_time: Optional[str] = None,
    end_time: Optional[str] = None,
    region: Optional[str] = None
) -> Dict[str, Any]:
    """
    Get Database Insights metrics for an RDS instance.
    
    Args:
        db_instance_identifier: RDS instance identifier
        start_time: Start time for metrics (ISO format)
        end_time: End time for metrics (ISO format)
        region: AWS region (optional)
        
    Returns:
        Dictionary containing the Database Insights metrics
    """
    try:
        # Create Database Insights client
        if region:
            pi_client = boto3.client('pi', region_name=region)
        else:
            pi_client = boto3.client('pi')
            
        # Set default time range if not provided
        if not start_time:
            end_datetime = datetime.utcnow()
            start_datetime = end_datetime - timedelta(hours=1)
            start_time = start_datetime.isoformat() + 'Z'
            end_time = end_datetime.isoformat() + 'Z'
        elif not end_time:
            end_time = datetime.utcnow().isoformat() + 'Z'
            
        # Define metrics to retrieve
        metrics = [
            {'Metric': 'db.load.avg'},
            {'Metric': 'db.sampledload.avg'}
        ]
            
        # Make the API call
        response = pi_client.get_resource_metrics(
            ServiceType='RDS',
            Identifier=db_instance_identifier,
            StartTime=start_time,
            EndTime=end_time,
            MetricQueries=metrics,
            PeriodInSeconds=60
        )
            
        return {
            "status": "success",
            "data": response,
            "message": f"Retrieved Database Insights metrics for {db_instance_identifier}"
        }
        
    except ClientError as e:
        logger.error(f"Error in Database Insights API: {str(e)}")
        return {
            "status": "error",
            "message": f"Database Insights API error: {str(e)}",
            "error_code": e.response['Error']['Code'] if 'Error' in e.response else "Unknown"
        }
        
    except Exception as e:
        logger.error(f"Unexpected error in Database Insights service: {str(e)}")
        return {
            "status": "error",
            "message": f"Unexpected error: {str(e)}"
        }