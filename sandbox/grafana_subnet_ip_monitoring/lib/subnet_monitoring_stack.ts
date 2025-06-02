import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';
import * as actions from 'aws-cdk-lib/aws-cloudwatch-actions';

export interface SubnetMonitoringProps extends cdk.StackProps {
  subnetIds: string[];
  ipThreshold: number;
  alarmEmail: string;
  monitoringFrequencyMinutes?: number;
  evaluationPeriods?: number;
}

export class SubnetMonitoringStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: SubnetMonitoringProps) {
    super(scope, id, props);

    const monitoringFrequency = props.monitoringFrequencyMinutes || 5;
    const evaluationPeriods = props.evaluationPeriods || 1;
    
    // Create SNS topic for alarms
    const alarmTopic = new sns.Topic(this, 'SubnetIPAlarmTopic', {
      displayName: 'Subnet IP Availability Alerts',
    });
    
    // Add email subscription
    alarmTopic.addSubscription(
      new subscriptions.EmailSubscription(props.alarmEmail)
    );

    const monitorFunction = new lambda.Function(this, 'SubnetIPMonitorFunction', {
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'index.handler',
      code: lambda.Code.fromAsset("lambda"), // Get the code from the lambda directory
      timeout: cdk.Duration.seconds(60),
      memorySize: 128,
      description: 'Monitors available IP addresses in specified subnets and publishes metrics to CloudWatch',
      environment: {
        SUBNET_IDS: JSON.stringify(props.subnetIds), // Pass subnet IDs as environment variable
      },
    });
    
    // Grant permissions to the Lambda function
    monitorFunction.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['ec2:DescribeSubnets'],
        resources: ['*'],
      })
    );
    
    monitorFunction.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['cloudwatch:PutMetricData'],
        resources: ['*'],
      })
    );
    
    // Create EventBridge rule to trigger the Lambda function periodically
    const rule = new events.Rule(this, 'SubnetMonitorSchedule', {
      schedule: events.Schedule.rate(cdk.Duration.minutes(monitoringFrequency)),
      description: `Trigger subnet IP monitoring every ${monitoringFrequency} minutes`,
    });
    
    rule.addTarget(new targets.LambdaFunction(monitorFunction));
    
    // Create CloudWatch alarms for each subnet
    props.subnetIds.forEach((subnetId, index) => {
      const alarm = new cloudwatch.Alarm(this, `SubnetIPAlarm-${index}`, {
        metric: new cloudwatch.Metric({
          namespace: 'CustomMetrics/Subnet',
          metricName: 'AvailableIPs',
          dimensionsMap: {
            SubnetId: subnetId,
          },
          statistic: 'Minimum',
          period: cdk.Duration.minutes(monitoringFrequency),
        }),
        threshold: props.ipThreshold,
        comparisonOperator: cloudwatch.ComparisonOperator.LESS_THAN_OR_EQUAL_TO_THRESHOLD,
        evaluationPeriods: evaluationPeriods,
        alarmDescription: `Alarm when available IPs in subnet ${subnetId} drops below ${props.ipThreshold}`,
        treatMissingData: cloudwatch.TreatMissingData.BREACHING,
        actionsEnabled: true,
      });
      
      // Add alarm action - send to SNS topic
      alarm.addAlarmAction(new actions.SnsAction(alarmTopic));
    });
    
    // CloudWatch dashboard for monitoring
    const dashboard = new cloudwatch.Dashboard(this, 'SubnetIPDashboard', {
      dashboardName: 'Subnet-IP-Availability',
    });
    
    // Add widgets for each subnet
    const widgets: cloudwatch.IWidget[] = [];
    
    // Add title
    widgets.push(new cloudwatch.TextWidget({
      markdown: '# Subnet IP Availability Monitoring',
      width: 24,
      height: 1,
    }));
    
    // Add metric widgets for each subnet (3 per row)
    for (let i = 0; i < props.subnetIds.length; i += 3) {
      const rowWidgets: cloudwatch.IWidget[] = [];
      
      for (let j = 0; j < 3 && i + j < props.subnetIds.length; j++) {
        const subnetId = props.subnetIds[i + j];
        rowWidgets.push(
          new cloudwatch.GraphWidget({
            title: `Subnet ${subnetId} Available IPs`,
            left: [
              new cloudwatch.Metric({
                namespace: 'CustomMetrics/Subnet',
                metricName: 'AvailableIPs',
                dimensionsMap: {
                  SubnetId: subnetId,
                },
                statistic: 'Minimum',
                period: cdk.Duration.minutes(monitoringFrequency),
              }),
            ],
            width: 8,
            height: 6,
            leftAnnotations: [
              {
                value: props.ipThreshold,
                color: '#ff0000',
                label: 'Threshold',
                visible: true,
              },
            ],
          })
        );
      }
      
      widgets.push(...rowWidgets);
    }
    
    dashboard.addWidgets(...widgets);
    
    // Outputs
    new cdk.CfnOutput(this, 'AlarmTopicArn', {
      value: alarmTopic.topicArn,
      description: 'ARN of the SNS topic for subnet IP alarms',
    });
    
    new cdk.CfnOutput(this, 'MonitoringLambdaName', {
      value: monitorFunction.functionName,
      description: 'Name of the Lambda function monitoring subnet IPs',
    });
    
    new cdk.CfnOutput(this, 'DashboardUrl', {
      value: `https://${this.region}.console.aws.amazon.com/cloudwatch/home?region=${this.region}#dashboards:name=Subnet-IP-Availability`,
      description: 'URL to the Subnet IP Availability Dashboard',
    });
  }
}
