# 인프라 및 데이터베이스

AWS 인프라 및 데이터베이스 서비스에 대한 Observability 레시피 모음입니다.

## 네트워킹

- [Application Load Balancer 모니터링하기][alb-docs]
- [Network Load Balancer 모니터링하기][nlb-docs]
- [VPC 플로우 로그를 사용한 네트워크 트래픽 분석][vpcfl]
- [Amazon Elasticsearch Service를 사용한 VPC 플로우 로그 분석][vpcf-ws]

## 컴퓨팅

- [Amazon EKS 컨트롤 플레인 로깅][eks-cp]
- [AWS Lambda 모니터링 및 Observability][lambda-docs]

## 데이터베이스, 스토리지 및 큐

- [Amazon Relational Database Service][rds]
- [Amazon DynamoDB][ddb]
- [Amazon Managed Streaming for Apache Kafka][msk]
- [Amazon S3에서의 로깅 및 모니터링][s3mon]
- [Amazon SQS 및 AWS X-Ray를 사용한 분산 트레이싱][sqstrace]


## 기타

- [Prometheus exporter를 활용한 커스텀 메트릭 수집][prometheus-exporters]

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
