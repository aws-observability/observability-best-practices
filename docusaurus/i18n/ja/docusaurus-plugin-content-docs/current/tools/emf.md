# Embedded Metric Format

CloudWatch Embedded Metric Format (EMF) は、構造化されたログイベントに埋め込まれたメトリクス値を自動的に抽出するように CloudWatch Logs に指示するための JSON 仕様です。
CloudWatch を使用して、抽出されたメトリクス値のグラフ化やアラームの作成を行うことができます。
EMF を使用すると、CloudWatch Logs としてメトリクス関連のデータをプッシュでき、CloudWatch でメトリクスとして検出されます。

以下は EMF フォーマットのサンプルと JSON スキーマです：
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
このように、EMF を使用することで、手動で PutMetricData API を呼び出すことなく、高カーディナリティのメトリクスを送信できます。
