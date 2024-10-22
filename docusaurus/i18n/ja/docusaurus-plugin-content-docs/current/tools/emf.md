# 埋め込みメトリックフォーマット

CloudWatch 埋め込みメトリックフォーマット (EMF) は、CloudWatch Logs に構造化されたログイベントに埋め込まれたメトリック値を自動的に抽出するよう指示する JSON 仕様です。抽出されたメトリック値を CloudWatch でグラフ化したり、アラームを作成したりできます。EMF を使用すると、CloudWatch ログとしてメトリック関連のデータをプッシュでき、CloudWatch でメトリックとして検出されます。

以下は EMF の例と JSON スキーマです。
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
このように、EMF を使用すると、PutMetricData API を手動で呼び出す必要なく、高い基数のメトリックを送信できます。
