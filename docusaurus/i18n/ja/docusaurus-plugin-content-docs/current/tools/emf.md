# Embedded Metric Format

CloudWatch 埋め込みメトリクス形式 (EMF) は、構造化されたログイベントに埋め込まれたメトリクス値を自動的に抽出するよう CloudWatch Logs に指示するために使用される JSON 仕様です。CloudWatch を使用して、抽出されたメトリクス値をグラフ化し、アラームを作成できます。EMF を使用すると、メトリクス関連データを CloudWatch ログの形式でプッシュでき、CloudWatch でメトリクスとして検出されます。

以下は、mat encamp と JSON スキーマのサンプル EMG です。
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
したがって、EMF を使用することで、手動で PutMetricData API 呼び出しを行う必要なく、高カーディナリティメトリクスを送信できます。