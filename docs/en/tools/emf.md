# Embedded Metric Format

The CloudWatch embedded metric format(EMF) is a JSON specification used to instruct CloudWatch Logs to automatically extract metric values embedded in structured log events. You can use CloudWatch to graph and create alarms on the extracted metric values. With EMF, you can push the metric related data in terms of CloudWatch logs which gets discovered as metric in CloudWatch.

Below is a sample EMG for mat encamp and JSON schema :

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

Thus, with help of EMF you can send high cardinality metrics without the need of making manual PutMetricData API calls.