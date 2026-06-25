# X-Ray కస్టమర్లు Application Signals + Transaction Search ను ఎందుకు స్వీకరించాలి

## Observability అవసరాల పరిణామం

అప్లికేషన్లు సంక్లిష్టత మరియు స్కేల్‌లో పెరుగుతున్న కొద్దీ, కస్టమర్ observability అవసరాలు గణనీయంగా పరిణామం చెందాయి. [AWS X-Ray](https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html) నమ్మకమైన డిస్ట్రిబ్యూటెడ్ ట్రేసింగ్ సొల్యూషన్‌గా సేవలందించినప్పటికీ, ఆధునిక అప్లికేషన్ ల్యాండ్‌స్కేప్ మరింత సమగ్ర విజిబిలిటీని డిమాండ్ చేస్తోంది.

## సాంకేతిక ఆర్కిటెక్చర్ తేడాలు

**X-Ray సాంప్రదాయ విధానం:**

![X-Ray Architecture](/apm-src/assets/images/deep-dive/X-ray.png)

**Application Signals + Transaction Search:**

![Application Signals + Transaction Search Architecture](/apm-src/assets/images/deep-dive/ap%20ts.png)

## ప్రధాన మైగ్రేషన్ ప్రయోజనాలు

| సామర్థ్యం | X-Ray | Application Signals + Transaction Search |
|---|---|---|
| **డేటా ఇంజెషన్** | 100% లావాదేవీలు (కాన్ఫిగర్ చేసినప్పుడు) | 100% లావాదేవీలు (కాన్ఫిగర్ చేసినప్పుడు) |
| **త్రూపుట్ పరిమితులు** | అధిక వాల్యూమ్ వద్ద X-Ray సర్వీస్ కోటాలకు లోబడి | CloudWatch Logs తో అధిక త్రూపుట్ సామర్థ్యం |
| **ఖర్చు మోడల్** | ప్రతి-ట్రేస్ ప్రైసింగ్ (100% వద్ద ఖరీదైనది) | Application Signals బండిల్డ్ ప్రైసింగ్ |
| **స్టోరేజ్ ఫార్మాట్** | X-Ray ప్రొప్రయటరీ ఫార్మాట్ | OpenTelemetry స్టాండర్డ్ ఫార్మాట్ |
| **స్టోరేజ్ బ్యాకెండ్** | X-Ray ఆప్టిమైజ్డ్ స్టోరేజ్ | CloudWatch Logs సెలెక్టివ్ ఇండెక్సింగ్‌తో |
| **అనలిటిక్స్** | X-Ray కన్సోల్ మాత్రమే | Transaction Search + X-Ray ట్రేస్ అనలిటిక్స్ |
| **క్వెరీ సామర్థ్యాలు** | X-Ray కన్సోల్ మరియు APIs | Transaction Search విజువల్ అనలిటిక్స్ + X-Ray |
| **ఇండెక్సింగ్** | అన్ని ట్రేసెస్ ఇండెక్స్ చేయబడతాయి | సెలెక్టివ్ ఇండెక్సింగ్ (కాన్ఫిగర్ చేయగల %) |
| **బిజినెస్ కాంటెక్స్ట్** | పరిమిత కస్టమ్ ఆట్రిబ్యూట్లు | సమృద్ధ OTEL span ఆట్రిబ్యూట్లు + బిజినెస్ కాంటెక్స్ట్ |

## ప్రధాన విలువ ప్రతిపాదనలు

### 1. అధిక త్రూపుట్ మరియు స్కేలబిలిటీ
- **CloudWatch Logs X-Ray కంటే అధిక త్రూపుట్‌ను నిర్వహిస్తుంది**, కస్టమర్లు సర్వీస్ పరిమితులను చేరుకోకుండా అన్ని అప్లికేషన్ ఈవెంట్లను ట్రాక్ చేయడానికి అనుమతిస్తుంది
- **ట్రేస్ డేటా కోసం స్టోరేజ్‌గా లాగ్‌లు** అధిక-వాల్యూమ్ అప్లికేషన్ల కోసం X-Ray యొక్క త్రూపుట్ పరిమితులను తొలగిస్తుంది
- **స్కేలబుల్ ఇన్‌ఫ్రాస్ట్రక్చర్** భారీ లాగ్ ఇంజెషన్ వాల్యూమ్‌ల కోసం రూపొందించబడింది

### 2. మెరుగైన అనలిటిక్స్ మరియు ఇంటిగ్రేషన్ సామర్థ్యాలు
- span డేటా విశ్లేషణ కోసం **నేటివ్ CloudWatch Logs ఫీచర్లు** అందుబాటులో ఉన్నాయి:
  - **Metrics Filters**: span ఆట్రిబ్యూట్లు మరియు ప్యాటర్న్ల నుండి కస్టమ్ మెట్రిక్స్ సృష్టించండి
  - **Subscription Filters**: span డేటాను ఇతర AWS సర్వీసులకు (Lambda, Kinesis, మొదలైనవి) స్ట్రీమ్ చేయండి
  - **Log Insights**: సాంప్రదాయ ట్రేస్ విశ్లేషణ కంటే మించిన అధునాతన క్వెరీ సామర్థ్యాలు
- **Transaction Search span-లెవల్ అనలిటిక్స్ కోసం అధునాతన విజువల్ క్వెరీ ఇంటర్‌ఫేస్ అందిస్తుంది**
- **OTEL ఫార్మాట్ కస్టమ్ ఆట్రిబ్యూట్లతో spans లో సమృద్ధ బిజినెస్ కాంటెక్స్ట్‌ను అనుమతిస్తుంది**

### 3. ఖర్చు-ప్రభావిత 100% శాంప్లింగ్
- **బండిల్డ్ ప్రైసింగ్** ప్రతి-ట్రేస్ X-Ray ప్రైసింగ్‌తో పోలిస్తే పూర్తి విజిబిలిటీని ఖర్చు-ప్రభావితంగా చేస్తుంది. దయచేసి [CloudWatch ప్రైసింగ్ పేజీ](https://aws.amazon.com/cloudwatch/pricing/) లో **Example 13** చూడండి
- **ఊహించగల ఖర్చులు** డేటా వాల్యూమ్ ఆధారంగా, ట్రేస్ కౌంట్ ఆధారంగా కాదు
- **సెలెక్టివ్ ఇండెక్సింగ్** పూర్తి డేటా యాక్సెస్‌ను నిర్వహిస్తూ స్టోరేజ్ ఖర్చులను ఆప్టిమైజ్ చేస్తుంది

## Span డేటాతో CloudWatch Logs ఫీచర్లను ఉపయోగించడం

Transaction Search span డేటాను CloudWatch Logs (`aws/spans` లాగ్ గ్రూప్) లో స్టోర్ చేస్తుంది కాబట్టి, మీరు అన్ని నేటివ్ CloudWatch Logs సామర్థ్యాలను ఉపయోగించవచ్చు:

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

**ఇంటిగ్రేషన్ అవకాశాలు:**
- **రియల్-టైమ్ ఆలర్టింగ్**: తక్షణ ఇన్సిడెంట్ రెస్పాన్స్ కోసం Lambda ఫంక్షన్లను ట్రిగ్గర్ చేయడానికి subscription filters ఉపయోగించండి
- **బిజినెస్ ఇంటెలిజెన్స్**: Kinesis Data Streams ద్వారా అనలిటిక్స్ ప్లాట్‌ఫారమ్‌లకు span డేటాను ఎక్స్‌పోర్ట్ చేయండి
- **కస్టమ్ డాష్‌బోర్డ్‌లు**: span ఆట్రిబ్యూట్ల నుండి డెరైవ్ చేయబడిన మెట్రిక్స్ ఉపయోగించి CloudWatch డాష్‌బోర్డ్‌లను సృష్టించండి
- **కంప్లయన్స్ ఆడిటింగ్**: నియంత్రణ కంప్లయన్స్ రిపోర్టింగ్ కోసం spans ను క్వెరీ చేయడానికి Log Insights ఉపయోగించండి
