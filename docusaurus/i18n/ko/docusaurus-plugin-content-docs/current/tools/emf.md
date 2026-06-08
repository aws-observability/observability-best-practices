# Embedded Metric Format

CloudWatch Embedded Metric Format(EMF)은 구조화된 로그 이벤트에 포함된 메트릭 값을 자동으로 추출하도록 CloudWatch Logs에 지시하는 데 사용되는 JSON 사양입니다. CloudWatch를 사용하여 추출된 메트릭 값에 대한 그래프를 만들고 경보를 설정할 수 있습니다. EMF를 사용하면 메트릭 관련 데이터를 CloudWatch 로그 형태로 전송할 수 있으며, 이는 CloudWatch에서 메트릭으로 검색됩니다.

아래는 EMF 형식의 샘플 및 JSON 스키마입니다:
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
이와 같이 EMF를 활용하면 수동으로 PutMetricData API를 호출할 필요 없이 높은 카디널리티의 메트릭을 전송할 수 있습니다.
