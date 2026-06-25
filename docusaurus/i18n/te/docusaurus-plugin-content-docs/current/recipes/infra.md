# ఇన్‌ఫ్రాస్ట్రక్చర్ & డేటాబేస్‌లు

## నెట్‌వర్కింగ్

- [మీ Application Load Balancers ను మానిటర్ చేయండి][alb-docs]
- [మీ Network Load Balancers ను మానిటర్ చేయండి][nlb-docs]
- [VPC Flow Logs][vpcfl]
- [Amazon Elasticsearch Service ఉపయోగించి VPC Flow logs విశ్లేషణ][vpcf-ws]

## కంప్యూట్

- [Amazon EKS కంట్రోల్ ప్లేన్ లాగింగ్][eks-cp]
- [AWS Lambda మానిటరింగ్ మరియు observability][lambda-docs]

## డేటాబేస్‌లు, స్టోరేజ్ మరియు క్యూలు

- [Amazon Relational Database Service][rds]
- [Amazon DynamoDB][ddb]
- [Amazon Managed Streaming for Apache Kafka][msk]
- [Amazon S3 లో లాగింగ్ మరియు మానిటరింగ్][s3mon]
- [Amazon SQS మరియు AWS X-Ray][sqstrace]


## ఇతరాలు

- [Prometheus ఎక్స్‌పోర్టర్లు][prometheus-exporters]

[alb-docs]: https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-monitoring.html
[nlb-docs]: https://docs.aws.amazon.com/elasticloadbalancing/latest/network/load-balancer-monitoring.html
[vpcfl]: https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html
[eks-cp]: https://docs.aws.amazon.com/eks/latest/userguide/control-plane-logs.html
[lambda-docs]: https://docs.aws.amazon.com/lambda/latest/operatorguide/monitoring-observability.html
[rds]: rds.md
[ddb]: dynamodb.md
[msk]: msk.md
[s3mon]: https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-incident-response.html
[sqstrace]: https://docs.aws.amazon.com/xray/latest/devguide/xray-services-sqs.html
[prometheus-exporters]: https://prometheus.io/docs/instrumenting/exporters/
[vpcf-ws]: https://search-ddb.aesworkshops.com/
