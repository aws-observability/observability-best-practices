# सबनेट में उपलब्ध IP की निगरानी

इस रेसिपी में हम आपको दिखाते हैं कि सबनेट में उपलब्ध IP की निगरानी के लिए मॉनिटरिंग स्टैक कैसे सेटअप करें।

हम [AWS Cloud Development Kit (CDK)](https://aws.amazon.com/cdk/) का उपयोग करके एक स्टैक सेट करेंगे जो सबनेट में उपलब्ध मुक्त IP की निगरानी के लिए Lambda, CloudWatch डैशबोर्ड और CloudWatch अलार्म बनाएगा।

:::note
    इस गाइड को पूरा करने में लगभग 30 मिनट लगेंगे।
:::
## इंफ्रास्ट्रक्चर
निम्नलिखित अनुभाग में हम इस रेसिपी के लिए इंफ्रास्ट्रक्चर सेट करेंगे।

यहाँ तैनात Lambda एक अंतराल पर EC2 API को कॉल करेगा और मुक्त IP मेट्रिक्स को [CloudWatch Metrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/working_with_metrics.html) में भेजेगा।

### पूर्वापेक्षाएँ

* AWS CLI आपके एनवायरनमेंट में [स्थापित](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html) और [कॉन्फ़िगर](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html) होनी चाहिए।
* [AWS CDK Typescript](https://docs.aws.amazon.com/cdk/latest/guide/work-with-cdk-typescript.html) आपके एनवायरनमेंट में स्थापित होना चाहिए।
* Node.js।
* [रिपॉजिटरी](https://github.com/aws-observability/observability-best-practices/) आपकी लोकल मशीन पर क्लोन की जानी चाहिए। इस प्रोजेक्ट का कोड `/sandbox/grafana_subnet_ip_monitoring` के अंतर्गत है।

### डिपेंडेंसी इंस्टॉल करें

निम्नलिखित कमांड के माध्यम से grafana_subnet_ip_monitoring डायरेक्टरी में जाएं:

```
cd sandbox/grafana_subnet_ip_monitoring
```

अब से इसे रिपॉजिटरी का रूट माना जाएगा।

निम्नलिखित कमांड के माध्यम से CDK डिपेंडेंसी इंस्टॉल करें:

```
npm install
```

सभी डिपेंडेंसी अब इंस्टॉल हो गई हैं।

### कॉन्फ़िग फ़ाइल संशोधित करें

रिपॉजिटरी के रूट में, `lib/vpc_monitoring_stack.ts` खोलें और अपनी आवश्यकता के अनुसार `subnetIds`, `alarmEmail` और `monitoringFrequencyMinutes` को संशोधित करें।

उदाहरण के लिए, निम्नलिखित को नीचे दिए गए तरीके से संशोधित करें:

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


### स्टैक डिप्लॉय करें

एक बार ऊपर के परिवर्तन हो जाने के बाद, CloudFormation में स्टैक डिप्लॉय करने का समय है। CDK स्टैक डिप्लॉय करने के लिए निम्नलिखित कमांड चलाएं:

```
cdk bootstrap
cdk deploy --all
```

## सफाई

CloudFormation स्टैक हटाएं:

```
cdk destroy
```
