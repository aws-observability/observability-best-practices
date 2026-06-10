# Embedded Metric Format

CloudWatch Embedded Metric Format (EMF) एक JSON स्पेसिफिकेशन है जिसका उपयोग CloudWatch Logs को स्ट्रक्चर्ड लॉग इवेंट्स में एम्बेडेड मेट्रिक मानों को स्वचालित रूप से एक्सट्रैक्ट करने का निर्देश देने के लिए किया जाता है। आप एक्सट्रैक्ट किए गए मेट्रिक मानों पर ग्राफ बनाने और अलार्म बनाने के लिए CloudWatch का उपयोग कर सकते हैं। EMF के साथ, आप CloudWatch Logs के रूप में मेट्रिक संबंधित डेटा पुश कर सकते हैं जो CloudWatch में मेट्रिक के रूप में खोजा जाता है।

नीचे एक सैंपल EMF फॉर्मेट और JSON स्कीमा है:
```
	{
	  "_aws": {
	    "Timestamp": 1574109732004,
	    "CloudWatchMetrics": [
	      {
	        "Namespace": "lambda-function-metrics",
	        "Dimensions": [
	          [
	            "functionVersion"
	          ]
	        ],
	        "Metrics": [
	          {
	            "Name": "time",
	            "Unit": "Milliseconds"
	          }
	        ]
	      }
	    ]
	  },
	  "functionVersion": "$LATEST",
	  "time": 100,
	  "requestId": "989ffbf8-9ace-4817-a57c-e4dd734019ee"
	}
```
इस प्रकार, EMF की मदद से आप मैन्युअल PutMetricData API कॉल करने की आवश्यकता के बिना उच्च कार्डिनैलिटी मेट्रिक्स भेज सकते हैं।
