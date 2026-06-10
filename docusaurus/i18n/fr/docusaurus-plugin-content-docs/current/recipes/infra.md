# Infrastructure et bases de donnees

## Reseau

- [Surveiller vos Application Load Balancers][alb-docs]
- [Surveiller vos Network Load Balancers][nlb-docs]
- [VPC Flow Logs][vpcfl]
- [Analyse des VPC Flow logs avec Amazon Elasticsearch Service][vpcf-ws]

## Calcul

- [Journalisation du plan de controle Amazon EKS][eks-cp]
- [Surveillance et observabilite AWS Lambda][lambda-docs]

## Bases de donnees, stockage et files d'attente

- [Amazon Relational Database Service][rds]
- [Amazon DynamoDB][ddb]
- [Amazon Managed Streaming for Apache Kafka][msk]
- [Journalisation et surveillance dans Amazon S3][s3mon]
- [Amazon SQS et AWS X-Ray][sqstrace]


## Autres

- [Exportateurs Prometheus][prometheus-exporters]

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
