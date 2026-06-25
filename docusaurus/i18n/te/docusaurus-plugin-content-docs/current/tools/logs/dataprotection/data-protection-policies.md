# SLG/EDU కోసం CloudWatch Logs Data Protection Policies

లాగింగ్ డేటా సాధారణంగా ప్రయోజనకరమే అయినప్పటికీ, Health Insurance Portability and Accountability Act (HIPAA), General Data Privacy Regulation (GDPR), Payment Card Industry Data Security Standard (PCI-DSS), మరియు Federal Risk and Authorization Management Program (FedRAMP) వంటి కఠినమైన నిబంధనలు ఉన్న సంస్థలకు వాటిని mask చేయడం ఉపయోగకరంగా ఉంటుంది.

CloudWatch Logs లో [Data Protection policies](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/cloudwatch-logs-data-protection-policies.html) కస్టమర్‌లకు sensitive data కోసం log data-in-transit ను scan చేసి గుర్తించబడిన sensitive data ను mask చేసే data protection policies ను నిర్వచించి apply చేయడానికి అనుమతిస్తాయి.

ఈ policies sensitive data గుర్తించడానికి pattern matching మరియు machine learning models ను ఉపయోగిస్తాయి, మరియు మీ account లోని CloudWatch log groups కు ingested అయిన events లో కనిపించే ఆ data ను audit చేసి mask చేయడంలో సహాయపడతాయి.

sensitive data ఎంపిక చేయడానికి ఉపయోగించే techniques మరియు criteria లను [matching data identifiers](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/cloudwatch-logs-data-protection-policies.html) అంటారు. ఈ managed data identifiers ఉపయోగించి, CloudWatch Logs గుర్తించగలవు:

- private keys లేదా AWS secret access keys వంటి Credentials
- IP addresses లేదా MAC addresses వంటి Device identifiers
- bank account number, credit card numbers లేదా credit card verification code వంటి Financial information
- Health Insurance Card Number (EHIC) లేదా Personal health Number వంటి Protected Health Information (PHI)
- driver's licenses, social security numbers లేదా taxpayer identification numbers వంటి Personally Identifiable Information (PII)

:::note
    Sensitive data log group లోకి ingest అయినప్పుడు detect మరియు mask అవుతుంది. మీరు data protection policy సెట్ చేసినప్పుడు, ఆ సమయానికి ముందు log group లోకి ingest అయిన log events mask అవ్వవు.
:::
పై పేర్కొన్న కొన్ని data types పై విస్తరించి కొన్ని ఉదాహరణలు చూద్దాం:


## డేటా రకాలు

### Credentials

Credentials అనేవి మీరు ఎవరో verify చేయడానికి మరియు మీరు అభ్యర్థిస్తున్న resources కు access ఉందా అని check చేయడానికి ఉపయోగించే sensitive data types. AWS మీ requests ను authenticate మరియు authorize చేయడానికి private keys మరియు secret access keys వంటి ఈ credentials ను ఉపయోగిస్తుంది.

CloudWatch Logs Data Protection policies ఉపయోగించి, మీరు ఎంచుకున్న data identifiers తో match అయిన sensitive data mask అవుతుంది. (section చివరలో masked ఉదాహరణ చూస్తాము).

![Credentials కోసం CloudWatch Logs Data Protection](../../../images/cwl-dp-credentials.png)


![Credentials2 కోసం CloudWatch Logs Data Protection](../../../images/cwl-dp-cred-sensitive.png)



:::tip
    Data classification best practices స్పష్టంగా నిర్వచించిన data classification tiers మరియు requirements తో ప్రారంభమవుతాయి, ఇవి మీ organizational, legal, మరియు compliance standards కు అనుగుణంగా ఉంటాయి.

    ఉత్తమ పద్ధతిగా, మీ organization data governance policies కు అనుగుణంగా compliance implement చేయడానికి data classification framework ఆధారంగా AWS resources పై tags ఉపయోగించండి.
:::

:::tip
    మీ log events లో sensitive data నివారించడానికి, ఉత్తమ పద్ధతి వాటిని మీ code లోనే exclude చేయడం మరియు అవసరమైన సమాచారం మాత్రమే log చేయడం.
:::


### Financial Information

Payment Card Industry Data Security Standard (PCI DSS) ద్వారా నిర్వచించబడినట్లుగా, bank account, routing numbers, debit మరియు credit card numbers, credit card magnetic strip data sensitive financial information గా పరిగణించబడతాయి.

sensitive data detect చేయడానికి, మీరు data protection policy సెట్ చేసిన తర్వాత log group ఉన్న geo-location తో సంబంధం లేకుండా మీరు specify చేసిన data identifiers కోసం CloudWatch Logs scan చేస్తుంది.

![Financial కోసం CloudWatch Logs Data Protection](../../../images/cwl-dp-fin-info.png)

:::info
    [financial data types మరియు data identifiers](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/protect-sensitive-log-data-types-financial.html) పూర్తి జాబితా చూడండి
:::


### Protected Health Information (PHI)

PHI insurance మరియు billing information, diagnosis data, medical records వంటి clinical care data మరియు images మరియు test results వంటి lab results తో సహా personally identifiable health మరియు health-related data యొక్క చాలా విస్తృతమైన సెట్‌ను కలిగి ఉంటుంది.

CloudWatch Logs ఎంచుకున్న log group నుండి health information ను scan మరియు detect చేసి ఆ data ను mask చేస్తుంది.

![PHI కోసం CloudWatch Logs Data Protection](../../../images/cwl-dp-phi.png)

:::info
    [phi data types మరియు data identifiers](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/protect-sensitive-log-data-types-health.html) పూర్తి జాబితా చూడండి
:::

### Personally Identifiable Information (PII)

PII అనేది వ్యక్తిని గుర్తించడానికి ఉపయోగించగల personal data కు textual reference. PII ఉదాహరణలలో addresses, bank account numbers, మరియు phone numbers ఉన్నాయి.

![PII కోసం CloudWatch Logs Data Protection](../../../images/cwl-dp-pii.png)

:::info
    [pii data types మరియు data identifiers](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/protect-sensitive-log-data-types-pii.html) పూర్తి జాబితా చూడండి
:::

## Masked Logs

ఇప్పుడు మీరు మీ data protection policy సెట్ చేసిన log group కు వెళ్తే, data protection `On` అని మరియు console sensitive data count ను కూడా ప్రదర్శిస్తుందని చూస్తారు.

![Log Group కోసం CloudWatch Logs Data Protection](../../../images/cwl-dp-loggroup.png)

ఇప్పుడు, `View in Log Insights` క్లిక్ చేయడం మిమ్మల్ని Log Insights console కు తీసుకెళ్తుంది. log stream లో log events check చేయడానికి క్రింది query run చేయడం వల్ల అన్ని logs జాబితా వస్తుంది.

```
fields @timestamp, @message
| sort @timestamp desc
| limit 20
```

query expand చేసిన తర్వాత, క్రింద చూపబడిన విధంగా masked results చూస్తారు:

![Masked Data కోసం CloudWatch Logs Data Protection](../../../images/cwl-dp-masked.png)

:::important
    మీరు data protection policy సృష్టించినప్పుడు, default గా, మీరు ఎంచుకున్న data identifiers తో match అయిన sensitive data mask అవుతుంది. `logs:Unmask` IAM permission ఉన్న users మాత్రమే unmasked data చూడగలరు.
:::

:::tip
    CloudWatch లో sensitive data కు access restrict చేయడానికి మరియు administer చేయడానికి [AWS IAM and Access Management(IAM)](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/auth-and-access-control-cw.html) ఉపయోగించండి.
:::

:::tip
    మీ cloud environment యొక్క regular monitoring మరియు auditing sensitive data రక్షణలో సమానంగా ముఖ్యం. applications పెద్ద volume data generate చేసినప్పుడు ఇది critical aspect అవుతుంది, అందువల్ల excessive amount data log చేయకూడదని recommend చేయబడుతుంది. [Logging Best Practices](https://docs.aws.amazon.com/prescriptive-guidance/latest/logging-monitoring-for-application-owners/logging-best-practices.html) కోసం ఈ AWS Prescriptive Guidance చదవండి
:::

:::tip
    Log Group Data CloudWatch Logs లో ఎల్లప్పుడూ encrypted గా ఉంటుంది. ప్రత్యామ్నాయంగా, మీ log data encrypt చేయడానికి [AWS Key Management Service](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/encrypt-log-data-kms.html) కూడా ఉపయోగించవచ్చు.
:::

:::tip
    resiliency మరియు scalability కోసం, CloudWatch alarms సెటప్ చేసి AWS Amazon EventBridge మరియు AWS Systems Manager ఉపయోగించి remediation automate చేయండి.
:::


[^1]: ప్రారంభించడానికి మా AWS blog [Protect Sensitive Data with Amazon CloudWatch Logs](https://aws.amazon.com/blogs/aws/protect-sensitive-data-with-amazon-cloudwatch-logs/) చూడండి.
