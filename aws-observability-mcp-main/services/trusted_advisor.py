"""
AWS Trusted Advisor service module.

This module provides functions for interacting with the AWS Trusted Advisor API.
"""

import logging
from typing import Dict, List, Optional, Any
import boto3
from botocore.exceptions import ClientError

logger = logging.getLogger(__name__)

def get_trusted_advisor_checks(
    check_categories: Optional[List[str]] = None,
    region: Optional[str] = None
) -> Dict[str, Any]:
    """
    Get AWS Trusted Advisor check results.
    
    Args:
        check_categories: List of check categories to filter
        region: AWS region (optional)
        
    Returns:
        Dictionary containing the Trusted Advisor check results
    """
    try:
        # Trusted Advisor is only available in us-east-1
        support_client = boto3.client('support', region_name='us-east-1')
        
        # Get available checks
        checks_response = support_client.describe_trusted_advisor_checks(language='en')
        checks = checks_response['checks']
        
        # Filter by categories if specified
        if check_categories:
            checks = [check for check in checks if check['category'] in check_categories]
            
        # Get results for each check
        results = []
        for check in checks:
            check_id = check['id']
            try:
                result = support_client.describe_trusted_advisor_check_result(
                    checkId=check_id,
                    language='en'
                )
                results.append({
                    'check_id': check_id,
                    'name': check['name'],
                    'category': check['category'],
                    'result': result['result']
                })
            except Exception as check_error:
                logger.warning(f"Error getting result for check {check['name']}: {str(check_error)}")
                
        return {
            "status": "success",
            "data": {"checks": results, "count": len(results)},
            "message": f"Retrieved {len(results)} Trusted Advisor check results"
        }
        
    except ClientError as e:
        logger.error(f"Error in Trusted Advisor API: {str(e)}")
        return {
            "status": "error",
            "message": f"Trusted Advisor API error: {str(e)}",
            "error_code": e.response['Error']['Code'] if 'Error' in e.response else "Unknown"
        }
        
    except Exception as e:
        logger.error(f"Unexpected error in Trusted Advisor service: {str(e)}")
        return {
            "status": "error",
            "message": f"Unexpected error: {str(e)}"
        }