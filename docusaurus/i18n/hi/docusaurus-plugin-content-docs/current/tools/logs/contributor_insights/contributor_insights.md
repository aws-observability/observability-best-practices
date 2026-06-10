# CloudWatch Contributor Insights

## अवलोकन
Amazon CloudWatch Contributor Insights आपको लॉग डेटा का विश्लेषण करने में मदद करता है ताकि आपके मेट्रिक्स को प्रभावित करने वाले शीर्ष योगदानकर्ताओं की पहचान की जा सके। यह रियल-टाइम रैंकिंग और सांख्यिकी बनाकर आपको यह समझने में सक्षम बनाता है कि कौन सी इकाइयां आपके सिस्टम के व्यवहार और प्रदर्शन को प्रभावित कर रही हैं।

## सुविधाएं
- लॉग डेटा का रियल-टाइम विश्लेषण
- सामान्य AWS सेवाओं के लिए बिल्ट-इन नियम
- कस्टम नियम बनाने की क्षमताएं
- स्वचालित डेटा प्रोसेसिंग और रैंकिंग
- CloudWatch डैशबोर्ड और अलार्म के साथ एकीकरण

## कार्यान्वयन

### बिल्ट-इन नियम
CloudWatch Contributor Insights सामान्य AWS सेवाओं के लिए पूर्व-निर्मित नियम प्रदान करता है:
- VPC Flow Logs विश्लेषण
- Application Load Balancer लॉग्स
- Amazon API Gateway लॉग्स
- AWS Lambda लॉग्स

### कस्टम नियम
निम्नलिखित परिभाषित करके कस्टम नियम बनाएं:
1. लॉग ग्रुप जो आपके स्रोत दस्तावेज़ हैं। विश्लेषण के लिए योगदानकर्ता फ़ील्ड
3. मेट्रिक्स और एग्रीगेशन
4. टाइम विंडो और सैंपलिंग रेट

कस्टम नियम का उदाहरण:
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

![CloudWatch Contributor Insights कंसोल का प्रीव्यू](../../../images/contrib1.png)

## सर्वोत्तम अभ्यास

### नियम कॉन्फ़िगरेशन
- वर्णनात्मक नियम नाम का उपयोग करें
- जब संभव हो बिल्ट-इन नियमों से शुरू करें
- लक्षित लॉग फ़िल्टरिंग लागू करें
- उपयुक्त टाइम विंडो कॉन्फ़िगर करें

### प्रदर्शन अनुकूलन
- सक्रिय नियमों की संख्या सीमित करें
- इष्टतम सैंपलिंग रेट सेट करें
- उपयुक्त एग्रीगेशन अवधि का उपयोग करें
- केवल आवश्यक लॉग ग्रुप के लिए नियम सक्षम करें

### लागत प्रबंधन
- नियमित रूप से नियम उपयोग की निगरानी करें
- अप्रयुक्त नियम हटाएं
- लॉग फ़िल्टरिंग लागू करें
- समय-समय पर सैंपलिंग रेट की समीक्षा करें

### सुरक्षा
- न्यूनतम विशेषाधिकार सिद्धांत का पालन करें
- संवेदनशील डेटा एन्क्रिप्ट करें
- नियमित नियम ऑडिट
- पैटर्न परिवर्तनों की निगरानी करें

## सामान्य समस्याएं और समाधान

### नियम लॉग्स से मेल नहीं खा रहा
**समस्या**: नियम अपेक्षित लॉग्स को प्रोसेस नहीं कर रहे
**समाधान**:
- सत्यापित करें कि लॉग फॉर्मेट नियम कॉन्फ़िगरेशन से मेल खाता है
- जांचें कि फ़ील्ड नाम सही हैं
- JSON संरचना को मान्य करें

### डेटा गायब है
**समस्या**: योगदानकर्ता डेटा में अंतराल
**समाधान**:
- सैंपलिंग रेट कॉन्फ़िगरेशन की जांच करें
- लॉग डिलीवरी सत्यापित करें
- टाइम विंडो सेटिंग्स की समीक्षा करें

### प्रदर्शन समस्याएं
**समस्या**: नियम प्रोसेसिंग धीमी
**समाधान**:
- सक्रिय नियमों की संख्या अनुकूलित करें
- सैंपलिंग रेट समायोजित करें
- योगदान थ्रेशोल्ड की समीक्षा करें

## एकीकरण

### CloudWatch डैशबोर्ड
शीर्ष योगदानकर्ताओं के विज़ुअलाइज़ेशन बनाएं:
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
योगदानकर्ता पैटर्न के लिए अलर्ट सेट करें:
```yaml
{
  "AlarmName": "HighContributorCount",
  "MetricName": "UniqueContributors",
  "Threshold": 100,
  "Period": 300,
  "EvaluationPeriods": 2
}
```

## टूल और रिसोर्स

### AWS CLI कमांड
```bash
# नियम बनाएं
aws cloudwatch put-insight-rule --rule-name MyRule --rule-definition file://rule.json

# नियम हटाएं
aws cloudwatch delete-insight-rule --rule-name MyRule
```

### संबंधित सेवाएं
- Amazon CloudWatch
- CloudWatch Logs
- CloudWatch Alarms
- Amazon EventBridge

### अतिरिक्त रिसोर्स
- [आधिकारिक दस्तावेज़ीकरण](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContributorInsights.html)
- [नियम सिंटैक्स संदर्भ](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContributorInsights-RuleSyntax.html)
- [AWS CLI संदर्भ](https://docs.aws.amazon.com/cli/latest/reference/cloudwatch/put-insight-rule.html)
