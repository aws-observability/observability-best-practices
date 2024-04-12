# 組み込みメトリクスフォーマット

CloudWatch 組み込みメトリクスフォーマット(EMF) は、構造化されたログイベントに埋め込まれたメトリクス値を CloudWatch Logs が自動的に抽出するように指示するために使用される JSON 仕様です。抽出されたメトリクス値をグラフ化したり、アラームを作成したりすることができます。EMF を使用すると、CloudWatch ログとしてプッシュされ、CloudWatch でメトリクスとして発見されるメトリクス関連データを指定できます。

以下は EMF のサンプルと JSON スキーマです。

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
	            "Unit": "ミリ秒" 
	          }
	        ]
	      }
	    ]
	  },
	  "functionVersion": "$LATEST",
	  "time": 100,
	  "requestId": "989ffbf8-9ace-4817-a57c-e4dd734019ee"
	}

したがって、EMF の助けを借りて、PutMetricData API 呼び出しを手動で行う必要なく、高基数メトリクスを送信できます。
