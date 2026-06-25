# உள்கட்டமைப்பு & தரவுத்தளங்கள்

## நெட்வொர்க்கிங்

- [உங்கள் Application Load Balancers-ஐ கண்காணிக்கவும்][alb-docs]
- [உங்கள் Network Load Balancers-ஐ கண்காணிக்கவும்][nlb-docs]
- [VPC Flow Logs][vpcfl]
- [Amazon Elasticsearch Service பயன்படுத்தி VPC Flow logs பகுப்பாய்வு][vpcf-ws]

## கம்ப்யூட்

- [Amazon EKS கட்டுப்பாட்டு தளம் லாக்கிங்][eks-cp]
- [AWS Lambda கண்காணிப்பு மற்றும் observability][lambda-docs]

## தரவுத்தளங்கள், சேமிப்பு மற்றும் க்யூக்கள்

- [Amazon Relational Database Service][rds]
- [Amazon DynamoDB][ddb]
- [Amazon Managed Streaming for Apache Kafka][msk]
- [Amazon S3-இல் லாக்கிங் மற்றும் கண்காணிப்பு][s3mon]
- [Amazon SQS மற்றும் AWS X-Ray][sqstrace]


## மற்றவை

- [Prometheus exporters][prometheus-exporters]

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
[vpcf-ws]: https://aesworkshops.com/log-analytics/mainlab/
