# CloudWatch ఖర్చు తగ్గించడం

## GetMetricData

సాధారణంగా `GetMetricData` 3rd party Observability tools మరియు/లేదా cloud financial tools తమ platform లో CloudWatch Metrics ఉపయోగించడం వల్ల చేసే calls వలన వస్తుంది.

- 3rd party tool requests చేస్తున్న frequency తగ్గించడం consider చేయండి. ఉదాహరణకు, frequency ను 1 min నుండి 5 mins కు తగ్గించడం cost లో 1/5 (20%) result ఇవ్వాలి.
- Trend identify చేయడానికి, short while కోసం 3rd party tools నుండి ఏదైనా data collection off చేయడం consider చేయండి.

## CloudWatch Logs

- ఈ [knowledge center document][log-article] ఉపయోగించి top contributors find చేయండి.
- అవసరమని deemed అవకపోతే top contributors logging level తగ్గించండి.
- Cloud Watch తో పాటు logging కోసం 3rd party tooling ఉపయోగిస్తున్నారా find out చేయండి.
- ప్రతి VPC పై enable చేసి చాలా traffic ఉంటే VPC Flow Log costs త్వరగా add up అవుతాయి. ఇంకా అవసరమైతే, Amazon S3 కు deliver చేయడం consider చేయండి.
- అన్ని AWS Lambda functions పై logging అవసరమా చూడండి. అవసరం లేకపోతే, Lambda role లో "logs:PutLogEvents" permissions deny చేయండి.
- CloudTrail logs తరచుగా top contributor. వాటిని Amazon S3 కు send చేసి Amazon Athena ఉపయోగించి query చేయడం మరియు alarms/notifications కోసం Amazon EventBridge ఉపయోగించడం cheaper.

మరింత details కోసం ఈ [knowledge center article][article] refer చేయండి.


[article]: https://aws.amazon.com/premiumsupport/knowledge-center/cloudwatch-understand-and-reduce-charges/
[log-article]: https://aws.amazon.com/premiumsupport/knowledge-center/cloudwatch-logs-bill-increase/
