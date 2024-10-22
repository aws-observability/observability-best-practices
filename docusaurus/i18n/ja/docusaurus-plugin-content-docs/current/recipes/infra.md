# インフラストラクチャとデータベース

## ネットワーキング

- [Application Load Balancer をモニタリングする][alb-docs]
- [Network Load Balancer をモニタリングする][nlb-docs]
- [VPC フローログ][vpcfl]
- [Amazon Elasticsearch Service を使用した VPC フローログの分析][vpcf-ws]

## コンピューティング

- [Amazon EKS コントロールプレーンのログ][eks-cp]
- [AWS Lambda のモニタリングとオブザーバビリティ][lambda-docs]

## データベース、ストレージ、キュー

- [Amazon Relational Database Service][rds]
- [Amazon DynamoDB][ddb]
- [Amazon Managed Streaming for Apache Kafka][msk]
- [Amazon S3 でのログ記録とモニタリング][s3mon]
- [Amazon SQS と AWS X-Ray][sqstrace]

## その他

- [Prometheus エクスポーター][prometheus-exporters]

[alb-docs]: https://docs.aws.amazon.com/ja_jp/elasticloadbalancing/latest/application/load-balancer-monitoring.html
[nlb-docs]: https://docs.aws.amazon.com/ja_jp/elasticloadbalancing/latest/network/load-balancer-monitoring.html
[vpcfl]: https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/flow-logs.html
[eks-cp]: https://docs.aws.amazon.com/ja_jp/eks/latest/userguide/control-plane-logs.html
[lambda-docs]: https://docs.aws.amazon.com/ja_jp/lambda/latest/operatorguide/monitoring-observability.html
[rds]: rds.md
[ddb]: dynamodb.md
[msk]: msk.md
[s3mon]: https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/s3-incident-response.html
[sqstrace]: https://docs.aws.amazon.com/ja_jp/xray/latest/devguide/xray-services-sqs.html
[prometheus-exporters]: https://prometheus.io/docs/instrumenting/exporters/
