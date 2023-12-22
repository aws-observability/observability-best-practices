# 組み込みメトリックフォーマット

CloudWatch 組み込みメトリックフォーマット(EMF)は、構造化されたログイベントに埋め込まれたメトリック値を自動的に抽出するよう CloudWatch Logs に指示するために使用される JSON 仕様です。抽出されたメトリック値をグラフ化し、アラームを作成するために CloudWatch を使用できます。EMF を使用すると、メトリックとして CloudWatch で検出される CloudWatch ログとしてメトリック関連データをプッシュできます。

以下は、EMF のサンプルエンコードと JSON スキーマです。

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

したがって、EMF の助けを借りることで、PutMetricData API 呼び出しを手動で行う必要なく、高カーディナリティメトリクスを送信できます。
