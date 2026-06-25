# Embedded Metric Format

CloudWatch Embedded Metric Format (EMF) என்பது கட்டமைக்கப்பட்ட லாக் நிகழ்வுகளில் உட்பொதிக்கப்பட்ட மெட்ரிக் மதிப்புகளை தானாகப் பிரித்தெடுக்க CloudWatch Logs-க்கு அறிவுறுத்தப் பயன்படுத்தப்படும் JSON விவரக்குறிப்பு ஆகும். பிரித்தெடுக்கப்பட்ட மெட்ரிக் மதிப்புகளின் மீது வரைபடங்களை உருவாக்கவும் அலாரங்களை அமைக்கவும் CloudWatch-ஐப் பயன்படுத்தலாம். EMF மூலம், மெட்ரிக் தொடர்பான தரவை CloudWatch லாக்குகளாக அனுப்பலாம், இது CloudWatch-ல் மெட்ரிக்காகக் கண்டறியப்படும்.

கீழே EMF வடிவமைப்பு மாதிரி மற்றும் JSON ஸ்கீமா உள்ளது:
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
இவ்வாறு, EMF-ன் உதவியுடன் கைமுறையாக PutMetricData API அழைப்புகளைச் செய்ய வேண்டிய அவசியமின்றி உயர் கார்டினாலிட்டி மெட்ரிக்குகளை அனுப்பலாம்.
