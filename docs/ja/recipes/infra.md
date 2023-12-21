# Infrastructure & Databases

## Networking

- [Monitor your Application Load Balancers][alb-docs]
- [Monitor your Network Load Balancers][nlb-docs]
- [VPC Flow Logs][vpcfl]
- [VPC Flow logs analysis using Amazon Elasticsearch Service][vpcf-ws]

## Compute

- [Amazon EKS control plane logging][eks-cp]
- [AWS Lambda monitoring and observability][lambda-docs]

## Databases, storage and queues

- [Amazon Relational Database Service][rds]
- [Amazon DynamoDB][ddb]
- [Amazon Managed Streaming for Apache Kafka][msk]
- [Logging and monitoring in Amazon S3][s3mon]
- [Amazon SQS and AWS X-Ray][sqstrace]


## Others

- [Prometheus exporters][prometheus-exporters]

[alb-docs]: https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-monitoring.html
[nlb-docs]: https://docs.aws.amazon.com/elasticloadbalancing/latest/network/load-balancer-monitoring.html
[vpcfl]: https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html
[vpcf-ws]: https://amazon-es-vpc-flowlogs.workshop.aws/en/
[eks-cp]: https://docs.aws.amazon.com/eks/latest/userguide/control-plane-logs.html
[lambda-docs]: https://docs.aws.amazon.com/lambda/latest/operatorguide/monitoring-observability.html
[rds]: rds.md
[ddb]: dynamodb.md
[msk]: msk.md
[s3mon]: https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-incident-response.html
[sqstrace]: https://docs.aws.amazon.com/xray/latest/devguide/xray-services-sqs.html
[prometheus-exporters]: https://prometheus.io/docs/instrumenting/exporters/
