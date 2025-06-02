import boto3
import json
import logging
import os
import traceback

# Set up logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

def handler(event, context):
    # List of subnet IDs to monitor
    subnet_ids = json.loads(os.environ['SUBNET_IDS'])
    
    # Initialize AWS clients
    ec2 = boto3.client('ec2')
    cloudwatch = boto3.client('cloudwatch')
    
    logger.info(f"Starting subnet IP monitoring for: {subnet_ids}")
    
    try:
        # Call the EC2 API to get subnet information
        logger.info("Calling EC2 describe_subnets API")
        response = ec2.describe_subnets(SubnetIds=subnet_ids)
        
        logger.info(f"Found {len(response['Subnets'])} subnets")
        
        # Process each subnet and publish metrics
        for subnet in response['Subnets']:
            available_ips = subnet['AvailableIpAddressCount']
            subnet_id = subnet['SubnetId']
            vpc_id = subnet['VpcId']
            cidr_block = subnet['CidrBlock']
            
            logger.info(f"Subnet {subnet_id} (CIDR: {cidr_block}) in VPC {vpc_id} has {available_ips} available IPs")
            
            # Publish metric to CloudWatch with explicit namespace
            logger.info(f"Publishing metric for subnet {subnet_id} with {available_ips} IPs")
            try:
                response = cloudwatch.put_metric_data(
                    Namespace='CustomMetrics/Subnet',
                    MetricData=[
                        {
                            'MetricName': 'AvailableIPs',
                            'Dimensions': [
                                {'Name': 'SubnetId', 'Value': subnet_id},
                            ],
                            'Value': available_ips,
                            'Unit': 'Count'
                        }
                    ]
                )
                logger.info(f"Successfully published metric. Response: {response}")
            except Exception as metric_error:
                logger.error(f"Error publishing metric for subnet {subnet_id}: {str(metric_error)}")
                logger.error(traceback.format_exc())
        
        logger.info("Subnet IP monitoring completed successfully")
        return {
            'statusCode': 200,
            'body': json.dumps('Subnet IP monitoring completed successfully')
        }
    except Exception as e:
        logger.error(f"Error monitoring subnet IPs: {str(e)}")
        logger.error(traceback.format_exc())
        raise e
