# சப்நெட்டில் இலவச IP-ஐ கண்காணித்தல்

இந்த ரெசிபியில் சப்நெட்டில் கிடைக்கும் IP-களை கண்காணிக்க மானிட்டரிங் ஸ்டாக்கை எவ்வாறு அமைப்பது என்பதைக் காட்டுகிறோம்.

சப்நெட்டில் கிடைக்கும் இலவச IP-களை கண்காணிக்க Lambda, CloudWatch டாஷ்போர்டு மற்றும் CloudWatch அலாரம் ஆகியவற்றை உருவாக்க [AWS Cloud Development Kit (CDK)](https://aws.amazon.com/cdk/) பயன்படுத்தி ஒரு ஸ்டாக்கை அமைப்போம்.

:::note
    இந்த வழிகாட்டியை முடிக்க சுமார் 30 நிமிடங்கள் ஆகும்.
:::
## உள்கட்டமைப்பு
பின்வரும் பகுதியில் இந்த ரெசிபிக்கான உள்கட்டமைப்பை அமைப்போம்.

இங்கு டிப்ளாய் செய்யப்பட்ட Lambda ஒரு இடைவெளியில் EC2 API-களை அழைத்து, இலவச IP மெட்ரிக்குகளை [Cloudwatch Metrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/working_with_metrics.html)-க்கு வெளியிடும்.

### முன்நிபந்தனைகள்

* AWS CLI உங்கள் சூழலில் [நிறுவப்பட்டு](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html) [கட்டமைக்கப்பட்டிருக்க](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html) வேண்டும்.
* [AWS CDK Typescript](https://docs.aws.amazon.com/cdk/latest/guide/work-with-cdk-typescript.html) உங்கள் சூழலில் நிறுவப்பட்டிருக்க வேண்டும்.
* Node.js.
* [repo](https://github.com/aws-observability/observability-best-practices/) உங்கள் உள்ளூர் கணினியில் குளோன் செய்யப்பட்டிருக்க வேண்டும். இந்த திட்டத்திற்கான குறியீடு `/sandbox/grafana_subnet_ip_monitoring` கீழ் உள்ளது.

### சார்புகளை நிறுவுதல்

grafana_subnet_ip_monitoring-க்கு உங்கள் டைரக்டரியை மாற்றவும்:

```
cd sandbox/grafana_subnet_ip_monitoring
```

இனிமேல் இதுவே repo-வின் ரூட் ஆக கருதப்படும்.

பின்வரும் கட்டளை வழியாக CDK சார்புகளை நிறுவுங்கள்:

```
npm install
```

அனைத்து சார்புகளும் இப்போது நிறுவப்பட்டுள்ளன.

### கட்டமைப்பு கோப்பை மாற்றுதல்

repo-வின் ரூட்டில், `lib/vpc_monitoring_stack.ts` கோப்பைத் திறந்து உங்கள் தேவைக்கேற்ப `subnetIds`, `alarmEmail` மற்றும் `monitoringFrequencyMinutes` ஆகியவற்றை மாற்றவும்.

உதாரணமாக, பின்வருவது போல் மாற்றவும்:

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


### ஸ்டாக்கை டிப்ளாய் செய்தல்

மேற்கண்ட மாற்றங்கள் செய்யப்பட்டதும், CloudFormation-க்கு ஸ்டாக்கை டிப்ளாய் செய்ய வேண்டிய நேரம். CDK ஸ்டாக்கை டிப்ளாய் செய்ய பின்வரும் கட்டளையை இயக்கவும்:

```
cdk bootstrap
cdk deploy --all
```

## சுத்தம் செய்தல்

CloudFormation ஸ்டாக்கை நீக்கவும்:

```
cdk destroy
```
