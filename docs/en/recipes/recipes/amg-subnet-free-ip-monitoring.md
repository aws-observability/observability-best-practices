# Monitoring Free IP in Subnet

In this recipe we show you how to setup monitoring stack to monitor for available IPs in the subnet.

We will be setting up a stack using [AWS Cloud Development Kit (CDK)](https://aws.amazon.com/cdk/) to create a Lambda, cloudwatch dashboard and a cloudwatch alarm for monitoring available free IPs in the subnet.

:::note
    This guide will take approximately 30 minutes to complete.
:::
## Infrastructure
In the following section we will be setting up the infrastructure for this recipe. 

The lambda deployed here will be calling EC2 APIs at an interval and will emitting free IP metrics to [Cloudwatch Metrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/working_with_metrics.html).

### Prerequisites

* The AWS CLI is [installed](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html) and [configured](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html) in your environment.
* The [AWS CDK Typescript](https://docs.aws.amazon.com/cdk/latest/guide/work-with-cdk-typescript.html) is installed in your environment.
* Node.js.
* The [repo](https://github.com/aws-observability/observability-best-practices/) has been cloned to your local machine. The code for this project is under `/sandbox/grafana_subnet_ip_monitoring`.

### Install dependencies

Change your directory to grafana_subnet_ip_monitoring via the command:

```
cd sandbox/grafana_subnet_ip_monitoring
```

This will now be considered the root of the repo, going forward.

Install the CDK dependencies via the following command:

```
npm install
```

All the dependencies are now installed.

### Modify config file

In the root of the repo, open `lib/vpc_monitoring_stack.ts` and modify the `subnetIds`, `alarmEmail` and `monitoringFrequencyMinutes` based on your requirement.

For example, modify the following like the one given below:

```
    const subnet_monitoring_stack = new SubnetMonitoringStack(this, 'SubnetIpMonitoringStack', {
      env: { 
        account: process.env.CDK_DEFAULT_ACCOUNT, 
        region: process.env.CDK_DEFAULT_REGION 
      },
      subnetIds: [
        'subnet-03e46f16d7dc01c0a', // Replace with your subnet IDs
        'subnet-0713ae10e4a8da850',
        'subnet-00a36dd76f1c51d97'
      ],
      ipThreshold: 50, // Alert when available IPs drop below 50
      alarmEmail: 'abc123@email.com', // Replace your email
      monitoringFrequencyMinutes: 5, // Check every 5 minutes
      evaluationPeriods: 2 // Require 2 consecutive breaches to trigger alarm
    });
```


### Deploy stack

Once the above changes are made, it is time to deploy the stack to CloudFormation. To deploy CDK stack run the follwong command:

```
cdk bootstrap
cdk deploy --all
```

## Cleanup

Delete the CloudFormation stack:

```
cdk destroy
```