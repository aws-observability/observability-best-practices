# X-Ray வாடிக்கையாளர்கள் ஏன் Application Signals + Transaction Search ஐ ஏற்றுக்கொள்ள வேண்டும்

## Observability தேவைகளின் பரிணாமம்

அப்ளிகேஷன்கள் சிக்கலான தன்மையிலும் அளவிலும் வளர்ந்துள்ளதால், வாடிக்கையாளர்களின் Observability தேவைகள் கணிசமாக மாறியுள்ளன. [AWS X-Ray](https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html) ஒரு நம்பகமான விநியோகிக்கப்பட்ட ட்ரேசிங் தீர்வாக சேவை செய்து வந்தாலும், நவீன அப்ளிகேஷன் நிலப்பரப்பு மிகவும் விரிவான தெரிவுநிலையை கோருகிறது.

## தொழில்நுட்ப கட்டமைப்பு வேறுபாடுகள்

**X-Ray பாரம்பரிய அணுகுமுறை:**

![X-Ray Architecture](/apm-src/assets/images/deep-dive/X-ray.png)

**Application Signals + Transaction Search:**

![Application Signals + Transaction Search Architecture](/apm-src/assets/images/deep-dive/ap%20ts.png)

## முக்கிய இடம்பெயர்வு நன்மைகள்

| திறன் | X-Ray | Application Signals + Transaction Search |
|---|---|---|
| **தரவு உள்ளீடு** | 100% பரிவர்த்தனைகள் (கட்டமைக்கப்படும்போது) | 100% பரிவர்த்தனைகள் (கட்டமைக்கப்படும்போது) |
| **த்ரூபுட் வரம்புகள்** | உயர் அளவில் X-Ray சேவை ஒதுக்கீடுகளுக்கு உட்பட்டது | CloudWatch Logs உடன் அதிக த்ரூபுட் திறன் |
| **செலவு மாதிரி** | ஒவ்வொரு ட்ரேஸ் விலை (100% இல் விலை அதிகம்) | Application Signals தொகுப்பு விலை |
| **சேமிப்பு வடிவம்** | X-Ray தனியுரிம வடிவம் | OpenTelemetry நிலையான வடிவம் |
| **சேமிப்பு பின்தளம்** | X-Ray மேம்படுத்தப்பட்ட சேமிப்பு | தேர்ந்தெடுக்கப்பட்ட இன்டெக்சிங் உடன் CloudWatch Logs |
| **பகுப்பாய்வு** | X-Ray கன்சோல் மட்டும் | Transaction Search + X-Ray trace analytics |
| **வினவல் திறன்கள்** | X-Ray கன்சோல் மற்றும் API-கள் | Transaction Search காட்சி பகுப்பாய்வு + X-Ray |
| **இன்டெக்சிங்** | அனைத்து ட்ரேஸ்கள் இன்டெக்ஸ் செய்யப்படுகின்றன | தேர்ந்தெடுக்கப்பட்ட இன்டெக்சிங் (கட்டமைக்கக்கூடிய %) |
| **வணிக சூழல்** | குறைந்த தனிப்பயன் அட்ரிபியூட்கள் | சிறப்பான OTEL span அட்ரிபியூட்கள் + வணிக சூழல் |

## முதன்மை மதிப்பு முன்மொழிவுகள்

### 1. அதிக த்ரூபுட் மற்றும் அளவிடுதல்
- **CloudWatch Logs X-Ray ஐ விட அதிக த்ரூபுட்டை கையாளுகிறது**, வாடிக்கையாளர்கள் சேவை வரம்புகளை எட்டாமல் அனைத்து அப்ளிகேஷன் நிகழ்வுகளையும் கண்காணிக்க உதவுகிறது
- **ட்ரேஸ் தரவுக்கான சேமிப்பாக Logs** உயர்-அளவு அப்ளிகேஷன்களுக்கு X-Ray இன் த்ரூபுட் கட்டுப்பாடுகளை நீக்குகிறது
- **அளவிடக்கூடிய உள்கட்டமைப்பு** பெரிய லாக் உள்ளீட்டு அளவுகளுக்காக வடிவமைக்கப்பட்டுள்ளது

### 2. மேம்படுத்தப்பட்ட பகுப்பாய்வு மற்றும் ஒருங்கிணைப்பு திறன்கள்
- **நேட்டிவ் CloudWatch Logs அம்சங்கள்** span தரவு பகுப்பாய்விற்கு கிடைக்கின்றன:
  - **Metrics Filters**: span அட்ரிபியூட்கள் மற்றும் பேட்டர்ன்களிலிருந்து தனிப்பயன் மெட்ரிக்குகளை உருவாக்கவும்
  - **Subscription Filters**: span தரவை மற்ற AWS சேவைகளுக்கு (Lambda, Kinesis, போன்றவை) ஸ்ட்ரீம் செய்யவும்
  - **Log Insights**: பாரம்பரிய ட்ரேஸ் பகுப்பாய்வுக்கு அப்பாற்பட்ட மேம்பட்ட வினவல் திறன்கள்
- **Transaction Search மேம்பட்ட காட்சி வினவல் இடைமுகத்தை வழங்குகிறது** span-நிலை பகுப்பாய்விற்கு
- **OTEL வடிவம் சிறப்பான வணிக சூழலை செயல்படுத்துகிறது** தனிப்பயன் அட்ரிபியூட்களுடன் span-களில்

### 3. செலவு குறைந்த 100% சாம்ப்ளிங்
- **தொகுப்பு விலை** ஒவ்வொரு ட்ரேஸ் X-Ray விலையுடன் ஒப்பிடும்போது முழு தெரிவுநிலையை செலவு குறைந்ததாக்குகிறது. [CloudWatch விலை பக்கத்தில்](https://aws.amazon.com/cloudwatch/pricing/) **உதாரணம் 13** ஐ பார்க்கவும்
- **கணிக்கக்கூடிய செலவுகள்** தரவு அளவின் அடிப்படையில், ட்ரேஸ் எண்ணிக்கையின் அடிப்படையில் அல்ல
- **தேர்ந்தெடுக்கப்பட்ட இன்டெக்சிங்** முழு தரவு அணுகலை பராமரிக்கும் அதே நேரத்தில் சேமிப்பு செலவுகளை மேம்படுத்துகிறது

## Span தரவுடன் CloudWatch Logs அம்சங்களை பயன்படுத்துதல்

Transaction Search span தரவை CloudWatch Logs-ல் (`aws/spans` log group) சேமிப்பதால், அனைத்து நேட்டிவ் CloudWatch Logs திறன்களையும் பயன்படுத்தலாம்:

**Metrics Filters:**
```bash
# Create custom metrics from span attributes
aws logs put-metric-filter \
  --log-group-name "aws/spans" \
  --filter-name "HighLatencyRequests" \
  --filter-pattern '[timestamp, request_id, span_id, trace_id, duration > 5000]' \
  --metric-transformations \
    metricName=HighLatencySpans,metricNamespace=CustomApp/Performance,metricValue=1
```

**Subscription Filters:**
```bash
# Stream span data to Lambda for real-time processing
aws logs put-subscription-filter \
  --log-group-name "aws/spans" \
  --filter-name "ErrorSpanProcessor" \
  --filter-pattern '[..., status_code="ERROR"]' \
  --destination-arn "arn:aws:lambda:region:account:function:ProcessErrorSpans"
```

**Log Insights Queries:**
```sql
-- Find all spans with specific business attributes
fields @timestamp, attributes.customer_id, attributes.order_value, duration
| filter attributes.service_name = "payment-service"
| filter attributes.customer_tier = "premium"
| stats avg(duration) by attributes.customer_id
| sort avg(duration) desc
```

**ஒருங்கிணைப்பு வாய்ப்புகள்:**
- **நிகழ்நேர எச்சரிக்கைகள்**: உடனடி சம்பவ பதில் நடவடிக்கைக்கு Lambda ஃபங்ஷன்களை தூண்டுவதற்கு subscription filters ஐ பயன்படுத்தவும்
- **வணிக நுண்ணறிவு**: Kinesis Data Streams வழியாக span தரவை பகுப்பாய்வு தளங்களுக்கு ஏற்றுமதி செய்யவும்
- **தனிப்பயன் டாஷ்போர்டுகள்**: span அட்ரிபியூட்களிலிருந்து பெறப்பட்ட மெட்ரிக்குகளைப் பயன்படுத்தி CloudWatch டாஷ்போர்டுகளை உருவாக்கவும்
- **இணக்க தணிக்கை**: ஒழுங்குமுறை இணக்க அறிக்கையிடலுக்கு span-களை வினவ Log Insights ஐ பயன்படுத்தவும்
