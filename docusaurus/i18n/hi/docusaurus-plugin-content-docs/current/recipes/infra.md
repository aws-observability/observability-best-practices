# इन्फ्रास्ट्रक्चर और डेटाबेस

## नेटवर्किंग

- [अपने Application Load Balancers की मॉनिटरिंग करें][alb-docs]
- [अपने Network Load Balancers की मॉनिटरिंग करें][nlb-docs]
- [VPC Flow Logs][vpcfl]
- [Amazon Elasticsearch Service का उपयोग करके VPC Flow logs विश्लेषण][vpcf-ws]

## कंप्यूट

- [Amazon EKS कंट्रोल प्लेन लॉगिंग][eks-cp]
- [AWS Lambda मॉनिटरिंग और Observability][lambda-docs]

## डेटाबेस, स्टोरेज और क्यूज

- [Amazon Relational Database Service][rds]
- [Amazon DynamoDB][ddb]
- [Amazon Managed Streaming for Apache Kafka][msk]
- [Amazon S3 में लॉगिंग और मॉनिटरिंग][s3mon]
- [Amazon SQS और AWS X-Ray][sqstrace]


## अन्य

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
