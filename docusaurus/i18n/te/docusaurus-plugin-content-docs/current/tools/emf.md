# Embedded Metric Format

CloudWatch embedded metric format (EMF) అనేది నిర్మాణాత్మక లాగ్ ఈవెంట్‌లలో పొందుపరచబడిన మెట్రిక్ విలువలను స్వయంచాలకంగా సంగ్రహించడానికి CloudWatch Logs కు సూచించడానికి ఉపయోగించే JSON స్పెసిఫికేషన్. మీరు సంగ్రహించిన మెట్రిక్ విలువలపై గ్రాఫ్ చేయడానికి మరియు అలారాలను సృష్టించడానికి CloudWatch ను ఉపయోగించవచ్చు. EMF తో, మీరు CloudWatch లాగ్‌ల రూపంలో మెట్రిక్ సంబంధిత డేటాను పుష్ చేయవచ్చు, ఇది CloudWatch లో మెట్రిక్‌గా కనుగొనబడుతుంది.

క్రింద ఒక నమూనా EMF ఫార్మాట్ మరియు JSON స్కీమా ఉంది:
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
ఈ విధంగా, EMF సహాయంతో మీరు మాన్యువల్ PutMetricData API కాల్స్ చేయవలసిన అవసరం లేకుండా అధిక కార్డినాలిటీ మెట్రిక్స్‌ను పంపవచ్చు.
