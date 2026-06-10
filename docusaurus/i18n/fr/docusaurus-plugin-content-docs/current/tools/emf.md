# Embedded Metric Format

Le format de metrique integre (EMF) de CloudWatch est une specification JSON utilisee pour indiquer a CloudWatch Logs d'extraire automatiquement les valeurs de metriques integrees dans des evenements de journal structures. Vous pouvez utiliser CloudWatch pour creer des graphiques et des alarmes sur les valeurs de metriques extraites. Avec EMF, vous pouvez envoyer les donnees liees aux metriques sous forme de journaux CloudWatch qui sont ensuite decouverts en tant que metriques dans CloudWatch.

Voici un exemple de format EMF et de schema JSON :
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
Ainsi, grace a EMF, vous pouvez envoyer des metriques a haute cardinalite sans avoir besoin d'effectuer des appels manuels a l'API PutMetricData.
