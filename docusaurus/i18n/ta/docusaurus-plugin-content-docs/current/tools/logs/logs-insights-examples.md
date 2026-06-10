# CloudWatch Logs Insights உதாரண வினவல்கள்

[CloudWatch Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html) CloudWatch லாக் தரவை பகுப்பாய்வு செய்வதற்கும் வினவுவதற்கும் ஒரு சக்திவாய்ந்த தளத்தை வழங்குகிறது. சில எளிமையான ஆனால் சக்திவாய்ந்த கட்டளைகளுடன் SQL போன்ற வினவல் மொழியைப் பயன்படுத்தி உங்கள் லாக் தரவை ஊடாடும் வகையில் தேட இது உங்களை அனுமதிக்கிறது.

CloudWatch Logs Insights பின்வரும் வகைகளுக்கான உள்ளமைந்த உதாரண வினவல்களை வழங்குகிறது:

- Lambda
- VPC Flow Logs
- CloudTrail
- பொதுவான வினவல்கள்
- Route 53
- AWS AppSync
- NAT Gateway

சிறந்த நடைமுறைகள் வழிகாட்டியின் இந்த பிரிவில், தற்போது உள்ளமைந்த உதாரணங்களில் சேர்க்கப்படாத பிற வகை லாக்குகளுக்கான சில உதாரண வினவல்களை வழங்குகிறோம். இந்த பட்டியல் காலப்போக்கில் உருவாகும் மற்றும் மாறும், நீங்கள் [issue](https://github.com/aws-observability/observability-best-practices/issues) ஒன்றை GitHub இல் விட்டு உங்கள் சொந்த உதாரணங்களை மதிப்பாய்வுக்கு சமர்ப்பிக்கலாம்.

## API Gateway

### HTTP Method வகையை கொண்ட கடைசி 20 செய்திகள்

```
filter @message like /$METHOD/ 
| fields @timestamp, @message
| sort @timestamp desc
| limit 20
```

இந்த வினவல் ஒரு குறிப்பிட்ட HTTP method ஐ கொண்ட கடைசி 20 லாக் செய்திகளை இறங்கு timestamp வரிசையில் திருப்பும். நீங்கள் வினவும் method க்காக **METHOD** ஐ மாற்றவும். இந்த வினவலை எவ்வாறு பயன்படுத்துவது என்பதற்கான உதாரணம்:

```
filter @message like /POST/ 
| fields @timestamp, @message
| sort @timestamp desc
| limit 20
```

:::tip
    வெவ்வேறு எண்ணிக்கையிலான செய்திகளை திருப்ப $limit மதிப்பை மாற்றலாம்.
:::

### IP மூலம் வரிசைப்படுத்தப்பட்ட முதல் 20 பேச்சாளர்கள்

```
fields @timestamp, @message
| stats count() by ip
| sort ip asc
| limit 20
```

இந்த வினவல் IP மூலம் வரிசைப்படுத்தப்பட்ட முதல் 20 பேச்சாளர்களை திருப்பும். உங்கள் API க்கு எதிரான தீங்கிழைக்கும் செயல்பாட்டை கண்டறிவதற்கு இது பயனுள்ளதாக இருக்கும்.

அடுத்த படியாக method வகைக்கான கூடுதல் வடிகட்டியை சேர்க்கலாம். உதாரணமாக, இந்த வினவல் IP மூலம் முதல் பேச்சாளர்களை காட்டும் ஆனால் "PUT" method அழைப்பை மட்டும்:

```
fields @timestamp, @message
| filter @message like /PUT/
| stats count() by ip
| sort ip asc
| limit 20
```

## CloudTrail Logs

### பிழை வகையால் குழுவாக்கப்பட்ட API throttling பிழைகள்

```
stats count(errorCode) as eventCount by eventSource, eventName, awsRegion, userAgent, errorCode
| filter errorCode = 'ThrottlingException' 
| sort eventCount desc
```

இந்த வினவல் வகையால் குழுவாக்கப்பட்ட மற்றும் இறங்கு வரிசையில் காட்டப்படும் API throttling பிழைகளை பார்க்க அனுமதிக்கிறது.

:::tip
    இந்த வினவலைப் பயன்படுத்த நீங்கள் முதலில் [CloudTrail லாக்குகளை CloudWatch க்கு அனுப்புவதை](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/send-cloudtrail-events-to-cloudwatch-logs.html) உறுதி செய்ய வேண்டும்.
:::
    
### வரி வரைபடத்தில் Root கணக்கு செயல்பாடு

```
fields @timestamp, @message, userIdentity.type 
| filter userIdentity.type='Root' 
| stats count() as RootActivity by bin(5m)
```

இந்த வினவலுடன் வரி வரைபடத்தில் root கணக்கு செயல்பாட்டை காட்சிப்படுத்தலாம். இந்த வினவல் காலப்போக்கில் root செயல்பாட்டை ஒருங்கிணைக்கிறது, ஒவ்வொரு 5-நிமிட இடைவெளியிலும் root செயல்பாட்டின் நிகழ்வுகளை எண்ணுகிறது.
:::tip
     [லாக் தரவை வரைபடங்களில் காட்சிப்படுத்துதல்](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_Insights-Visualizing-Log-Data.html)
:::

## VPC Flow Logs

### REJECT செயலுடன் தேர்ந்தெடுக்கப்பட்ட மூல IP முகவரிக்கான flow logs ஐ வடிகட்டுதல்.

```
fields @timestamp, @message, @logStream, @log  | filter srcAddr like '$SOURCEIP' and action = 'REJECT'
| sort @timestamp desc
| limit 20
```

இந்த வினவல் $SOURCEIP இலிருந்து 'REJECT' கொண்ட கடைசி 20 லாக் செய்திகளை திருப்பும். ட்ராஃபிக் வெளிப்படையாக நிராகரிக்கப்படுகிறதா, அல்லது சிக்கல் ஏதேனும் வகையான கிளையண்ட் பக்க நெட்வொர்க் கட்டமைப்பு பிரச்சனையா என்பதை கண்டறிய இதைப் பயன்படுத்தலாம்.

:::tip
    நீங்கள் ஆர்வமுள்ள IP முகவரியின் மதிப்பை '$SOURCEIP' க்கு மாற்றுவதை உறுதிப்படுத்தவும்
:::

```
fields @timestamp, @message, @logStream, @log  | filter srcAddr like '10.0.0.5' and action = 'REJECT'
| sort @timestamp desc
| limit 20
```

### Availability Zone-களால் நெட்வொர்க் ட்ராஃபிக்கை குழுவாக்குதல்

```
stats sum(bytes / 1048576) as Traffic_MB by azId as AZ_ID 
| sort Traffic_MB desc
```

இந்த வினவல் Availability Zone (AZ) மூலம் குழுவாக்கப்பட்ட நெட்வொர்க் ட்ராஃபிக் தரவை மீட்டெடுக்கிறது. bytes ஐ கூட்டி MB க்கு மாற்றுவதன் மூலம் மொத்த ட்ராஃபிக்கை மெகாபைட்களில் (MB) கணக்கிடுகிறது. முடிவுகள் ஒவ்வொரு AZ இல் ட்ராஃபிக் அளவின் அடிப்படையில் இறங்கு வரிசையில் வரிசைப்படுத்தப்படுகின்றன.


### ஓட்ட திசையால் நெட்வொர்க் ட்ராஃபிக்கை குழுவாக்குதல்

```
stats sum(bytes / 1048576) as Traffic_MB by flowDirection as Flow_Direction 
| sort by Bytes_MB desc
```

இந்த வினவல் ஓட்ட திசையால் குழுவாக்கப்பட்ட நெட்வொர்க் ட்ராஃபிக்கை பகுப்பாய்வு செய்ய வடிவமைக்கப்பட்டுள்ளது. (Ingress அல்லது Egress)


### மூல மற்றும் இலக்கு IP முகவரிகள் மூலம் முதல் 10 தரவு பரிமாற்றங்கள்

```
stats sum(bytes / 1048576) as Data_Transferred_MB by srcAddr as Source_IP, dstAddr as Destination_IP 
| sort Data_Transferred_MB desc 
| limit 10
```

இந்த வினவல் மூல மற்றும் இலக்கு IP முகவரிகள் மூலம் முதல் 10 தரவு பரிமாற்றங்களை மீட்டெடுக்கிறது. குறிப்பிட்ட மூல மற்றும் இலக்கு IP முகவரிகளுக்கிடையே மிக முக்கியமான தரவு பரிமாற்றங்களை அடையாளம் காண இந்த வினவல் அனுமதிக்கிறது.

## Amazon SNS Logs

### காரணங்களால் SMS செய்தி தோல்விகளின் எண்ணிக்கை

```
filter status = "FAILURE"
| stats count(*) by delivery.providerResponse as FailureReason
| sort delivery.providerResponse desc
```

மேலே உள்ள வினவல் இறங்கு வரிசையில் காரணத்தால் வரிசைப்படுத்தப்பட்ட வழங்கல் தோல்விகளின் எண்ணிக்கையை பட்டியலிடுகிறது. வழங்கல் தோல்விக்கான காரணங்களை கண்டறிய இந்த வினவலை பயன்படுத்தலாம்.

### தவறான தொலைபேசி எண் காரணமாக SMS செய்தி தோல்விகள்

```
fields notification.messageId as MessageId, delivery.destination as PhoneNumber
| filter status = "FAILURE" and delivery.providerResponse = "Invalid phone number"
| limit 100
```

இந்த வினவல் தவறான தொலைபேசி எண் காரணமாக வழங்கத் தவறிய செய்தியை திருப்புகிறது. திருத்த வேண்டிய தொலைபேசி எண்களை அடையாளம் காண இதைப் பயன்படுத்தலாம்.

### SMS வகையால் செய்தி தோல்வி புள்ளிவிவரங்கள்

```
fields delivery.smsType
| filter status = "FAILURE"
| stats count(notification.messageId), avg(delivery.dwellTimeMs), sum(delivery.priceInUSD) by delivery.smsType
```

இந்த வினவல் ஒவ்வொரு SMS வகைக்கான (Transactional அல்லது Promotional) எண்ணிக்கை, சராசரி dwell நேரம் மற்றும் செலவை திருப்புகிறது. திருத்த நடவடிக்கைகளை தூண்டுவதற்கான வரம்புகளை நிறுவ இந்த வினவலை பயன்படுத்தலாம். குறிப்பிட்ட SMS வகை மட்டும் திருத்த நடவடிக்கை தேவைப்பட்டால், அந்த SMS வகையை மட்டும் வடிகட்ட வினவலை மாற்றலாம்.

### SNS தோல்வி அறிவிப்புகள் புள்ளிவிவரங்கள்

```
fields @MessageID 
| filter status = "FAILURE"
| stats count(delivery.deliveryId) as FailedDeliveryCount, avg(delivery.dwellTimeMs) as AvgDwellTime, max(delivery.dwellTimeMs) as MaxDwellTime by notification.messageId as MessageID
| limit 100
```

இந்த வினவல் ஒவ்வொரு தோல்வியுற்ற செய்திக்கான எண்ணிக்கை, சராசரி dwell நேரம் மற்றும் செலவை திருப்புகிறது. திருத்த நடவடிக்கைகளை தூண்டுவதற்கான வரம்புகளை நிறுவ இந்த வினவலை பயன்படுத்தலாம்.
