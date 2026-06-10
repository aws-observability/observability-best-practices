# Embedded Metric Format

CloudWatch Embedded Metric Format (EMF) 是一种 JSON 规范，用于指示 CloudWatch Logs 自动从结构化日志事件中提取嵌入的 metric 值。您可以使用 CloudWatch 对提取的 metric 值进行图表展示和创建告警。通过 EMF，您可以将与 metric 相关的数据以 CloudWatch logs 的形式推送，这些数据会被自动识别为 CloudWatch 中的 metrics。

以下是 EMF 格式的示例和 JSON schema：
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
因此，借助 EMF，您可以发送高基数 metrics，而无需手动调用 PutMetricData API。
