# インフラストラクチャとデータベース

## ネットワーキング

- [Application Load Balancer をモニタリングする][alb-docs]
- [Network Load Balancer をモニタリングする][nlb-docs] 
- [VPC フローログ][vpcfl]
- [Amazon Elasticsearch Service を使用した VPC フローログの分析][vpcf-ws]

## コンピューティング

- [Amazon EKS コントロールプレーンログ][eks-cp]
- [AWS Lambda のモニタリングとオブザーバビリティ][lambda-docs]

## データベース、ストレージ、キュー

- [Amazon Relational Database Service][rds]
- [Amazon DynamoDB][ddb]
- [Amazon Managed Streaming for Apache Kafka][msk]
- [Amazon S3 でのログ記録とモニタリング][s3mon]
- [Amazon SQS と AWS X-Ray][sqstrace]

## その他

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
