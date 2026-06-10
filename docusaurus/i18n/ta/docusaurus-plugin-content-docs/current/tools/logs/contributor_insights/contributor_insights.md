# CloudWatch Contributor Insights

## மேலோட்டம்
Amazon CloudWatch Contributor Insights உங்கள் மெட்ரிக்குகளை பாதிக்கும் முதன்மை பங்களிப்பாளர்களை அடையாளம் காண லாக் தரவை பகுப்பாய்வு செய்ய உதவுகிறது. நிகழ்நேர தரவரிசைகள் மற்றும் புள்ளிவிவரங்களை உருவாக்குவதன் மூலம் உங்கள் அமைப்பின் நடத்தை மற்றும் செயல்திறனை பாதிக்கும் நிறுவனங்களை புரிந்துகொள்ள இது உதவுகிறது.

## அம்சங்கள்
- லாக் தரவின் நிகழ்நேர பகுப்பாய்வு
- பொதுவான AWS சேவைகளுக்கான உள்ளமைந்த விதிகள்
- தனிப்பயன் விதி உருவாக்க திறன்கள்
- தானியங்கு தரவு செயலாக்கம் மற்றும் தரவரிசைப்படுத்தல்
- CloudWatch dashboards மற்றும் alarms உடன் ஒருங்கிணைப்பு

## செயல்படுத்தல்

### உள்ளமைந்த விதிகள்
CloudWatch Contributor Insights பொதுவான AWS சேவைகளுக்கான முன்-கட்டப்பட்ட விதிகளை வழங்குகிறது:
- VPC Flow Logs பகுப்பாய்வு
- Application Load Balancer logs
- Amazon API Gateway logs
- AWS Lambda logs

### தனிப்பயன் விதிகள்
பின்வருவனவற்றை வரையறுப்பதன் மூலம் தனிப்பயன் விதிகளை உருவாக்கவும்:
1. Log group உங்கள் மூல ஆவணங்கள். பகுப்பாய்வு செய்ய Contributor fields
3. Metrics மற்றும் aggregations
4. நேர சாளரங்கள் மற்றும் sampling rates

உதாரண தனிப்பயன் விதி:
```yaml
{
	"AggregateOn": "Count",
	"Contribution": {
		"Filters": [],
		"Keys": [
			"$.pettype"
		]
	},c
	"LogFormat": "JSON",
	"Schema": {
		"Name": "CloudWatchLogRule",
		"Version": 1
	},
	"LogGroupARNs": [
		"arn:aws:logs:[region]:[account]:log-group:[API Gateway Log Group Name]"
	]
}
```

![CloudWatch Contributor Insights கன்சோலின் முன்னோட்டம்](../../../images/contrib1.png)

## சிறந்த நடைமுறைகள்

### விதி கட்டமைப்பு
- விளக்கமான விதி பெயர்களை பயன்படுத்தவும்
- சாத்தியமான போது உள்ளமைந்த விதிகளுடன் தொடங்கவும்
- இலக்கு லாக் வடிகட்டலை செயல்படுத்தவும்
- பொருத்தமான நேர சாளரங்களை கட்டமைக்கவும்

### செயல்திறன் மேம்படுத்தல்
- செயலில் உள்ள விதிகளின் எண்ணிக்கையை கட்டுப்படுத்தவும்
- உகந்த sampling rates ஐ அமைக்கவும்
- பொருத்தமான aggregation காலங்களை பயன்படுத்தவும்
- தேவையான log groups க்கு மட்டும் விதிகளை செயல்படுத்தவும்

### செலவு மேலாண்மை
- விதி பயன்பாட்டை வழக்கமாக கண்காணிக்கவும்
- பயன்படுத்தப்படாத விதிகளை நீக்கவும்
- லாக் வடிகட்டலை செயல்படுத்தவும்
- Sampling rates ஐ அவ்வப்போது மதிப்பாய்வு செய்யவும்

### பாதுகாப்பு
- குறைந்தபட்ச-உரிமை கொள்கையைப் பின்பற்றவும்
- முக்கிய தரவை என்கிரிப்ட் செய்யவும்
- வழக்கமான விதி தணிக்கைகள்
- பேட்டர்ன் மாற்றங்களை கண்காணிக்கவும்

## பொதுவான சிக்கல்கள் மற்றும் தீர்வுகள்

### விதி Logs உடன் பொருந்தவில்லை
**சிக்கல்**: விதிகள் எதிர்பார்க்கப்பட்ட logs ஐ செயலாக்கவில்லை
**தீர்வு**:
- லாக் வடிவம் விதி கட்டமைப்புடன் பொருந்துகிறதா சரிபார்க்கவும்
- புல பெயர்கள் சரியானவை என சரிபார்க்கவும்
- JSON கட்டமைப்பை சரிபார்க்கவும்

### காணாமல் போன தரவு
**சிக்கல்**: contributor தரவில் இடைவெளிகள்
**தீர்வு**:
- Sampling rate கட்டமைப்பை சரிபார்க்கவும்
- லாக் வழங்கலை சரிபார்க்கவும்
- நேர சாளர அமைப்புகளை மதிப்பாய்வு செய்யவும்

## ஒருங்கிணைப்பு

### CloudWatch Dashboards
முதன்மை contributors இன் காட்சிப்படுத்தல்களை உருவாக்கவும்:
```yaml
{
  "widgets": [
    {
      "type": "metric",
      "properties": {
        "view": "bar",
        "region": "us-east-1",
        "title": "Top Contributors",
        "period": 300
      }
    }
  ]
}
```

### CloudWatch Alarms
Contributor patterns க்கான alerts ஐ அமைக்கவும்:
```yaml
{
  "AlarmName": "HighContributorCount",
  "MetricName": "UniqueContributors",
  "Threshold": 100,
  "Period": 300,
  "EvaluationPeriods": 2
}
```

## கருவிகள் மற்றும் ஆதாரங்கள்

### AWS CLI கட்டளைகள்
```bash
# Create a rule
aws cloudwatch put-insight-rule --rule-name MyRule --rule-definition file://rule.json

# Delete a rule
aws cloudwatch delete-insight-rule --rule-name MyRule
```

### தொடர்புடைய சேவைகள்
- Amazon CloudWatch
- CloudWatch Logs
- CloudWatch Alarms
- Amazon EventBridge

### கூடுதல் ஆதாரங்கள்
- [அதிகாரப்பூர்வ ஆவணம்](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContributorInsights.html)
- [விதி தொடரியல் குறிப்பு](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContributorInsights-RuleSyntax.html)
- [AWS CLI குறிப்பு](https://docs.aws.amazon.com/cli/latest/reference/cloudwatch/put-insight-rule.html)
