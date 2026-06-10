# Subnet లో Free IP Monitoring

ఈ recipe లో subnet లో available IPs monitor చేయడానికి monitoring stack ఎలా setup చేయాలో చూపిస్తాము.

Subnet లో available free IPs monitor చేయడానికి Lambda, CloudWatch dashboard మరియు CloudWatch alarm create చేసే stack set up చేయడానికి [AWS Cloud Development Kit (CDK)](https://aws.amazon.com/cdk/) ఉపయోగిస్తాము.

:::note
    ఈ గైడ్ complete చేయడానికి సుమారు 30 నిమిషాలు పడుతుంది.
:::
## Infrastructure
ఈ section లో ఈ recipe కోసం infrastructure set up చేస్తాము.

ఇక్కడ deploy చేయబడిన lambda EC2 APIs ను interval లో call చేస్తుంది మరియు free IP metrics ను [Cloudwatch Metrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/working_with_metrics.html) కు emit చేస్తుంది.

### Prerequisites

* AWS CLI మీ environment లో [installed](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html) మరియు [configured](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html) అయి ఉండాలి.
* [AWS CDK Typescript](https://docs.aws.amazon.com/cdk/latest/guide/work-with-cdk-typescript.html) మీ environment లో installed అయి ఉండాలి.
* Node.js.
* [repo](https://github.com/aws-observability/observability-best-practices/) మీ local machine కు cloned అయి ఉండాలి. ఈ project కోసం code `/sandbox/grafana_subnet_ip_monitoring` కింద ఉంది.

### Dependencies Install చేయండి

ఈ command ద్వారా grafana_subnet_ip_monitoring కు మీ directory change చేయండి:

```
cd sandbox/grafana_subnet_ip_monitoring
```

ఇది ఇకపై repo root గా consider చేయబడుతుంది.

ఈ command ద్వారా CDK dependencies install చేయండి:

```
npm install
```

అన్ని dependencies ఇప్పుడు installed.

### Config file Modify చేయండి

Repo root లో, `lib/vpc_monitoring_stack.ts` open చేసి మీ requirement ఆధారంగా `subnetIds`, `alarmEmail` మరియు `monitoringFrequencyMinutes` modify చేయండి.

ఉదాహరణకు, క్రింద ఇచ్చినట్లు modify చేయండి:

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


### Stack Deploy చేయండి

Above changes చేసిన తర్వాత, CloudFormation కు stack deploy చేయడానికి సమయం. CDK stack deploy చేయడానికి ఈ command run చేయండి:

```
cdk bootstrap
cdk deploy --all
```

## Cleanup

CloudFormation stack delete చేయండి:

```
cdk destroy
```
