import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {SubnetMonitoringStack} from './subnet_monitoring_stack';

export class VpcMonitoringStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const subnet_monitoring_stack = new SubnetMonitoringStack(this, 'SubnetIpMonitoringStack', {
      env: { 
        account: process.env.CDK_DEFAULT_ACCOUNT, 
        region: process.env.CDK_DEFAULT_REGION 
      },
      subnetIds: [
        '<subnet-id-1 i.e subnet-03e46f16d7dc01c0a>', // Replace with your subnet IDs
        '<subnet-id-1 i.e subnet-03e46f16d7dc01c0a>',
        '<subnet-id-1 i.e subnet-03e46f16d7dc01c0a>'
      ],
      ipThreshold: 50, // Alert when available IPs drop below 50
      alarmEmail: '<email>',
      monitoringFrequencyMinutes: 5, // Check every 5 minutes
      evaluationPeriods: 2 // Require 2 consecutive breaches to trigger alarm
    });
  }
}
