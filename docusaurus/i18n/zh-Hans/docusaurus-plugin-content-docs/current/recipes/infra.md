# 基础设施与数据库

## 网络

- [监控您的 Application Load Balancers][alb-docs]
- [监控您的 Network Load Balancers][nlb-docs]
- [VPC Flow Logs][vpcfl]
- [使用 Amazon Elasticsearch Service 分析 VPC Flow logs][vpcf-ws]

## 计算

- [Amazon EKS 控制平面日志][eks-cp]
- [AWS Lambda 监控与可观测性][lambda-docs]

## 数据库、存储与队列

- [Amazon Relational Database Service][rds]
- [Amazon DynamoDB][ddb]
- [Amazon Managed Streaming for Apache Kafka][msk]
- [Amazon S3 中的日志记录与监控][s3mon]
- [Amazon SQS 与 AWS X-Ray][sqstrace]


## 其他

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
