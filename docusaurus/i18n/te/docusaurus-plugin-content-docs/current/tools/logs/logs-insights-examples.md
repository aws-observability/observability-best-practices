# CloudWatch Logs Insights ఉదాహరణ Queries

[CloudWatch Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html) CloudWatch log డేటాను analyze మరియు query చేయడానికి శక్తివంతమైన platform ను అందిస్తుంది. ఇది కొన్ని సరళమైన కానీ శక్తివంతమైన commands తో SQL లాంటి query language ఉపయోగించి మీ log డేటా ద్వారా interactive గా search చేయడానికి అనుమతిస్తుంది.

CloudWatch Logs Insights ఈ క్రింది categories కోసం out of the box ఉదాహరణ queries ను అందిస్తుంది:

- Lambda
- VPC Flow Logs
- CloudTrail
- Common Queries
- Route 53
- AWS AppSync
- NAT Gateway

ఈ best practices guide యొక్క ఈ విభాగంలో మేము ప్రస్తుతం out of the box ఉదాహరణలలో చేర్చబడని ఇతర రకాల logs కోసం కొన్ని ఉదాహరణ queries ను అందిస్తాము. ఈ జాబితా కాలానుగుణంగా అభివృద్ధి చెందుతుంది మరియు మారుతుంది మరియు మీరు git hub లో ఒక [issue](https://github.com/aws-observability/observability-best-practices/issues) ఇవ్వడం ద్వారా సమీక్ష కోసం మీ స్వంత ఉదాహరణలను సమర్పించవచ్చు.

## API Gateway

### HTTP Method Type కలిగి ఉన్న చివరి 20 Messages

```
filter @message like /$METHOD/ 
| fields @timestamp, @message
| sort @timestamp desc
| limit 20
```

ఈ query నిర్దిష్ట HTTP method కలిగి ఉన్న చివరి 20 log messages ను అవరోహణ timestamp క్రమంలో return చేస్తుంది. మీరు query చేస్తున్న method కోసం **METHOD** ను ప్రత్యామ్నాయం చేయండి. ఈ query ను ఎలా ఉపయోగించాలో ఇక్కడ ఒక ఉదాహరణ:

```
filter @message like /POST/ 
| fields @timestamp, @message
| sort @timestamp desc
| limit 20
```

:::tip
    వేరే సంఖ్యలో messages return చేయడానికి మీరు $limit value ను మార్చవచ్చు.
:::

### IP ద్వారా sort చేయబడిన Top 20 Talkers

```
fields @timestamp, @message
| stats count() by ip
| sort ip asc
| limit 20
```

ఈ query IP ద్వారా sort చేయబడిన top 20 talkers ను return చేస్తుంది. మీ API పై హానికరమైన కార్యకలాపాలను గుర్తించడానికి ఇది ఉపయోగకరంగా ఉంటుంది.

తదుపరి దశగా మీరు method type కోసం అదనపు filter add చేయవచ్చు. ఉదాహరణకు, ఈ query IP ద్వారా top talkers ను చూపిస్తుంది కానీ "PUT" method call మాత్రమే:

```
fields @timestamp, @message
| filter @message like /PUT/
| stats count() by ip
| sort ip asc
| limit 20
```

## CloudTrail Logs

### Error category ద్వారా group చేయబడిన API throttling errors

```
stats count(errorCode) as eventCount by eventSource, eventName, awsRegion, userAgent, errorCode
| filter errorCode = 'ThrottlingException' 
| sort eventCount desc
```

ఈ query API throttling errors ను category ద్వారా group చేసి అవరోహణ క్రమంలో ప్రదర్శించడానికి అనుమతిస్తుంది.

:::tip
    ఈ query ను ఉపయోగించడానికి మీరు ముందుగా [CloudTrail logs ను CloudWatch కు పంపుతున్నారని](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/send-cloudtrail-events-to-cloudwatch-logs.html) నిర్ధారించుకోవాలి.
:::
    
### Line graph లో Root account activity

```
fields @timestamp, @message, userIdentity.type 
| filter userIdentity.type='Root' 
| stats count() as RootActivity by bin(5m)
```

ఈ query తో మీరు line graph లో root account activity ను visualize చేయవచ్చు. ఈ query root activity ను కాలానుగుణంగా aggregate చేస్తుంది, ప్రతి 5-నిమిషాల interval లో root activity సంఘటనలను count చేస్తుంది.
:::tip
     [Log డేటాను graphs లో visualize చేయండి](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_Insights-Visualizing-Log-Data.html)
:::

## VPC Flow Logs

### REJECT action తో ఎంచుకున్న source IP address కోసం flow logs ను filter చేయడం

```
fields @timestamp, @message, @logStream, @log  | filter srcAddr like '$SOURCEIP' and action = 'REJECT'
| sort @timestamp desc
| limit 20
```

ఈ query $SOURCEIP నుండి 'REJECT' కలిగి ఉన్న చివరి 20 log messages ను return చేస్తుంది. ట్రాఫిక్ స్పష్టంగా reject చేయబడిందా, లేదా సమస్య ఏదైనా రకమైన client side network configuration problem అనేది గుర్తించడానికి ఇది ఉపయోగించవచ్చు.

:::tip
    మీకు ఆసక్తి ఉన్న IP address యొక్క value ను '$SOURCEIP' కోసం ప్రత్యామ్నాయం చేయడం నిర్ధారించుకోండి
:::

```
fields @timestamp, @message, @logStream, @log  | filter srcAddr like '10.0.0.5' and action = 'REJECT'
| sort @timestamp desc
| limit 20
```

### Availability Zones ద్వారా network traffic ను grouping చేయడం

```
stats sum(bytes / 1048576) as Traffic_MB by azId as AZ_ID 
| sort Traffic_MB desc
```

ఈ query Availability Zone (AZ) ద్వారా group చేయబడిన network traffic డేటాను retrieve చేస్తుంది. ఇది bytes ను sum చేసి MB కు convert చేయడం ద్వారా total traffic ను megabytes (MB) లో calculate చేస్తుంది. ఫలితాలు ప్రతి AZ లో traffic volume ఆధారంగా అవరోహణ క్రమంలో sort చేయబడతాయి.


### Flow direction ద్వారా network traffic ను grouping చేయడం

```
stats sum(bytes / 1048576) as Traffic_MB by flowDirection as Flow_Direction 
| sort by Bytes_MB desc
```

ఈ query flow direction ద్వారా group చేయబడిన network traffic ను analyze చేయడానికి రూపొందించబడింది. (Ingress లేదా Egress)


### Source మరియు destination IP addresses ద్వారా Top 10 data transfers

```
stats sum(bytes / 1048576) as Data_Transferred_MB by srcAddr as Source_IP, dstAddr as Destination_IP 
| sort Data_Transferred_MB desc 
| limit 10
```

ఈ query source మరియు destination IP addresses ద్వారా top 10 data transfers ను retrieve చేస్తుంది. ఈ query నిర్దిష్ట source మరియు destination IP addresses మధ్య అత్యంత ముఖ్యమైన data transfers ను గుర్తించడానికి అనుమతిస్తుంది.

## Amazon SNS Logs

### కారణాల ద్వారా SMS message failures count

```
filter status = "FAILURE"
| stats count(*) by delivery.providerResponse as FailureReason
| sort delivery.providerResponse desc
```

పై query delivery failures count ను కారణం ద్వారా అవరోహణ క్రమంలో జాబితా చేస్తుంది. delivery failure కారణాలను కనుగొనడానికి ఈ query ను ఉపయోగించవచ్చు.

### Invalid Phone Number వల్ల SMS message failures

```
fields notification.messageId as MessageId, delivery.destination as PhoneNumber
| filter status = "FAILURE" and delivery.providerResponse = "Invalid phone number"
| limit 100
```

ఈ query Invalid Phone Number వల్ల deliver అవ్వని message ను return చేస్తుంది. సరిచేయవలసిన phone numbers ను గుర్తించడానికి ఇది ఉపయోగించవచ్చు.

### SMS Type ద్వారా Message failure statistics

```
fields delivery.smsType
| filter status = "FAILURE"
| stats count(notification.messageId), avg(delivery.dwellTimeMs), sum(delivery.priceInUSD) by delivery.smsType
```

ఈ query ప్రతి SMS type (Transactional లేదా Promotional) కోసం count, average dwell time మరియు spend ను return చేస్తుంది. సరిదిద్దే చర్యలను trigger చేయడానికి thresholds స్థాపించడానికి ఈ query ను ఉపయోగించవచ్చు. నిర్దిష్ట SMS Type మాత్రమే సరిదిద్దే చర్య అవసరమైతే, ఆ SMS Type ను మాత్రమే filter చేయడానికి query ను modify చేయవచ్చు.

### SNS failure notifications statistics

```
fields @MessageID 
| filter status = "FAILURE"
| stats count(delivery.deliveryId) as FailedDeliveryCount, avg(delivery.dwellTimeMs) as AvgDwellTime, max(delivery.dwellTimeMs) as MaxDwellTime by notification.messageId as MessageID
| limit 100
```

ఈ query ప్రతి failed Message కోసం count, average dwell time మరియు spend ను return చేస్తుంది. సరిదిద్దే చర్యలను trigger చేయడానికి thresholds స్థాపించడానికి ఈ query ను ఉపయోగించవచ్చు.



