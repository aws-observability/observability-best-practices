"""
Purpose
Shows how to use lambda function to get Performance Insight metrics from Amazon Aurora and publish to CloudWatch
@mundabra
@sharajag
https://docs.amazonaws.cn/en_us/AmazonRDS/latest/AuroraUserGuide/USER_PerfInsights.UsingDashboard.AnalyzeDBLoad.AdditionalMetrics.PostgreSQL.html
"""

from base64 import encode
import time
import boto3
import os
import logging
import json
from botocore.exceptions import ClientError

logger = logging.getLogger()
logger.setLevel(logging.INFO)

pi_client = boto3.client('pi')
rds_client = boto3.client('rds')
cw_client = boto3.client('cloudwatch')
targetMetricNamespace = os.environ.get('TargetMetricNamespace')

dbSliceGroup = { "db.sql_tokenized", "db.wait_event", "db.user", "db.host", "db", "db.sql"} #"db.application" "db.application" "db.session_type"


def lambda_handler(event, context):
    # Get DB instances for which Performance Insights have been enabled
    pi_instances = get_pi_instances()
    logger.info('## PI Instances --> ')
    pi_list = ' '.join(e for e in pi_instances)
    logger.info('## PI Instances List--> %s', pi_list)
    for instance in pi_instances:
        logger.info('## pi start')
        pi_response = get_db_resource_metrics(instance)
        logger.info('## pi ready')
        if pi_response:
            logger.info('## pi send')
            send_cloudwatch_data(pi_response)

    return {
        'statusCode': 200,
        'body': 'ok'
    }

# Get DB instances for which Performance Insights have been enabled
def get_pi_instances():
    dbInstancesResponse = rds_client.describe_db_instances()

    if dbInstancesResponse:
        response = filter(lambda _: _.get('PerformanceInsightsEnabled', False), dbInstancesResponse['DBInstances'])
        if response:
            new_list = []
            for item in response:
              logger.info("## instance : %s", item['DBInstanceIdentifier'])
              logger.info("## instance DbiResourceId : %s", item['DbiResourceId'])
            #   if item['DBInstanceIdentifier'] == "dime-default-uat-db-cluster-1-20230224104457267000000003":
              new_list.append(item['DbiResourceId'])
            #       logger.info("APPEND : %s", item['DBInstanceIdentifier'])
            dbInstanceList = [str(item['DbiResourceId']) for item in response]
            pi_list_internal = ' '.join(e for e in new_list)
            # pi_list_internal = ' '.join(e for e in ["a", "b", "c"])
            logger.info('## PI Internal Instances List--> %s', pi_list_internal)
            return new_list # dbInstanceList
    return None


def get_db_resource_metrics(instance):
    # Build metric query list
    metric_queries = []
    for group in dbSliceGroup:
        # The example specifies the metric of db.load.avg and a GroupBy of the top seven wait events
        # https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/USER_PerfInsights.API.html#USER_PerfInsights.API.Examples.CounterMetrics
        
        logger.info('## metrics for group --> %s ', group)
        metric_queries.append(
        {
            "Metric": "db.load.avg", 
            "GroupBy":
                
                { 
                    "Group": group
                }
        }
        )
        
    if not metric_queries:
        return None

    response = pi_client.get_resource_metrics(
                ServiceType='RDS',
                Identifier=instance,
                StartTime= time.time() - 900,   #15 mins
                EndTime= time.time(),
                PeriodInSeconds=60,
                MetricQueries=metric_queries
            )
    
    logger.info(print(response['MetricList']))

    return response

def str_encode(string):
    encoded_str = string.encode("ascii","ignore")
    return remove_non_ascii(encoded_str.decode())

def remove_non_ascii(string):
    non_ascii = ascii(string)
    return non_ascii

def send_cloudwatch_data(pi_response):
    metric_data = []
    for metric_response in pi_response['MetricList']: #dataoints and key
        metric_dict = metric_response['Key']  #db.load.avg
        metric_name = metric_dict['Metric']
     
        is_metric_dimensions = False
        formatted_dims = []
        if metric_dict.get('Dimensions'):
            metric_dimensions = metric_response['Key']['Dimensions']  # return a dictionary
            
            for key in metric_dimensions:
                metric_name = key.split(".")[1]
                formatted_dims.append(dict(Name=key, Value=str_encode(metric_dimensions[key])))
                """ if key == "db.sql_tokenized.statement":
                    formatted_dims.append(dict(Name=key, Value=str_encode(metric_dimensions[key])))
                else:
                    formatted_dims.append(dict(Name=key, Value=str_encode(metric_dimensions[key]))) """

            is_metric_dimensions = True
        else:
            metric_name = metric_name.replace("avg","")


        for datapoint in metric_response['DataPoints']:
            # We don't always have values from an instance
            value = datapoint.get('Value', None)

            if value:
                if is_metric_dimensions:
                    metric_data.append({
                        'MetricName': metric_name,
                        'Dimensions': formatted_dims,
                        'Timestamp': datapoint['Timestamp'],
                        'Value': round(datapoint['Value'], 2)
                    })
                else:
                    metric_data.append({
                        'MetricName': metric_name,
                        'Timestamp': datapoint['Timestamp'],
                        'Value': round(datapoint['Value'], 2)
                    }) 
    
    if metric_data:
        logger.info('## sending data to cloduwatch...')
        try:
            cw_client.put_metric_data(
            Namespace= targetMetricNamespace,
            MetricData= metric_data)
        except ClientError as error:
            raise ValueError('The parameters you provided are incorrect: {}'.format(error))
    else:
        logger.info('## NO Metric Data ##')


# dict_keys(['AlignedStartTime', 'AlignedEndTime', 'Identifier', 'MetricList', 'ResponseMetadata'])