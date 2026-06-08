# 차원(Dimensions)

이 사이트에서는 Observability(o11y) 공간을 여섯 가지 차원으로 고려합니다.
각 차원을 독립적으로 살펴보는 것은 분석적 관점에서 유익합니다. 즉, 사용하는 프로그래밍 언어와 같은 개발자 관련 측면부터 컨테이너나 Lambda 함수와 같은 런타임 환경 등의 운영 주제에 이르기까지, 주어진 워크로드에 대한 구체적인 o11y 솔루션을 구축하고자 할 때 유용합니다.

![o11y 공간](images/o11y-space.png)


:::note
    "신호(Signal)란 무엇인가?"
    여기서 신호라고 할 때는 로그 항목, 메트릭, 트레이스를 포함한 모든 종류의 o11y 데이터 및 메타데이터 포인트를 의미합니다. 더 구체적으로 말하고 싶거나 말해야 하는 경우가 아닌 한 "신호"를 사용하며, 어떤 제한이 적용되는지는 문맥에서 명확해야 합니다.
:::

이제 여섯 가지 차원을 하나씩 살펴보겠습니다:

## 목적지(Destinations)

이 차원에서는 장기 저장소 및 신호를 소비할 수 있는 그래픽 인터페이스를 포함한 모든 종류의 신호 목적지를 고려합니다. 개발자로서 서비스 문제를 해결하기 위해 신호를 검색, 조회 및 상관관계를 파악할 수 있는 UI 또는 API에 접근하고 싶을 것입니다. 인프라 또는 플랫폼 역할에서는 인프라 상태를 파악하기 위해 신호를 관리, 검색, 조회 및 상관관계를 파악할 수 있는 UI 또는 API에 접근하고 싶을 것입니다.

![Grafana 스크린샷](images/grafana.png)

궁극적으로 이것은 사람의 관점에서 가장 흥미로운 차원입니다.
하지만 이점을 누리기 위해서는 먼저 약간의 작업을 투자해야 합니다: 소프트웨어와 외부 종속성을 계측하고 신호를 목적지로 수집해야 합니다.

그렇다면 신호는 어떻게 목적지에 도달할까요? 바로 다음 차원입니다…

## 에이전트(Agents)

신호가 수집되고 분석 시스템으로 라우팅되는 방식입니다. 신호는 두 가지 소스에서 올 수 있습니다: 애플리케이션 소스 코드(언어 섹션도 참조) 또는 데이터스토어에서 관리되는 상태와 VPC와 같은 인프라 등 애플리케이션이 의존하는 것들(인프라 및 데이터 섹션도 참조)입니다.

에이전트는 신호를 수집하고 수집하는 데 사용하는 텔레메트리의 일부입니다. 다른 부분은 계측된 애플리케이션과 데이터베이스와 같은 인프라 구성 요소입니다.

## 언어(Languages)

이 차원은 서비스 또는 애플리케이션을 작성하는 데 사용하는 프로그래밍 언어와 관련이 있습니다. 여기서는 [X-Ray SDK][xraysdks]나 OpenTelemetry가 [계측][otelinst] 컨텍스트에서 제공하는 것과 같은 SDK 및 라이브러리를 다룹니다. 로그나 메트릭과 같은 특정 신호 유형에 대해 o11y 솔루션이 선택한 프로그래밍 언어를 지원하는지 확인해야 합니다.

## 인프라 및 데이터베이스

이 차원에서는 서비스가 실행되는 VPC와 같은 인프라, RDS나 DynamoDB와 같은 데이터스토어, SQS와 같은 큐 등 모든 종류의 애플리케이션 외부 종속성을 의미합니다.

:::tip
    "공통점"
    이 차원의 모든 소스가 가진 공통점은 애플리케이션(및 앱이 실행되는 컴퓨팅 환경) 외부에 위치한다는 것이며, 따라서 불투명한 박스로 취급해야 한다는 것입니다.
:::

이 차원에는 다음이 포함되지만 이에 국한되지 않습니다:

- AWS 인프라, 예를 들어 [VPC 플로우 로그][vpcfl].
- [Kubernetes 컨트롤 플레인 로그][kubecpl]와 같은 보조 API.
- [S3][s3mon], [RDS][rdsmon] 또는 [SQS][sqstrace]와 같은 데이터스토어의 신호.


## 컴퓨팅 단위(Compute Unit)

코드를 패키징, 스케줄링, 실행하는 방식입니다. 예를 들어 Lambda에서는 함수이고, [ECS][ecs]와 [EKS][eks]에서는 각각 태스크(ECS) 또는 파드(EKS)에서 실행되는 컨테이너입니다. Kubernetes와 같은 컨테이너화된 환경에서는 텔레메트리 배포에 관해 사이드카 또는 노드(인스턴스)별 데몬 프로세스의 두 가지 옵션을 사용할 수 있는 경우가 많습니다.

## 컴퓨팅 엔진(Compute Engine)

이 차원은 기본 런타임 환경을 나타내며, EC2 인스턴스의 경우처럼 프로비저닝 및 패치가 사용자의 책임일 수도 있고, Fargate나 Lambda와 같은 서버리스 오퍼링의 경우처럼 책임이 없을 수도 있습니다. 사용하는 컴퓨팅 엔진에 따라 텔레메트리 부분이 이미 오퍼링에 포함되어 있을 수 있습니다. 예를 들어 [Fargate 기반 EKS][firelensef]는 Fluent Bit을 통한 로그 라우팅이 통합되어 있습니다.


[aes]: https://aws.amazon.com/elasticsearch-service/ "Amazon Elasticsearch Service"
[adot]: https://aws-otel.github.io/ "AWS Distro for OpenTelemetry"
[amg]: https://aws.amazon.com/grafana/ "Amazon Managed Grafana"
[amp]: https://aws.amazon.com/prometheus/ "Amazon Managed Service for Prometheus"
[batch]: https://aws.amazon.com/batch/ "AWS Batch"
[beans]: https://aws.amazon.com/elasticbeanstalk/ "AWS Elastic Beanstalk"
[cw]: https://aws.amazon.com/cloudwatch/ "Amazon CloudWatch"
[dimensions]: ../dimensions
[ec2]: https://aws.amazon.com/ec2/ "Amazon EC2"
[ecs]: https://aws.amazon.com/ecs/ "Amazon Elastic Container Service"
[eks]: https://aws.amazon.com/eks/ "Amazon Elastic Kubernetes Service"
[fargate]: https://aws.amazon.com/fargate/ "AWS Fargate"
[fluentbit]: https://fluentbit.io/ "Fluent Bit"
[firelensef]: https://aws.amazon.com/blogs/containers/fluent-bit-for-amazon-eks-on-aws-fargate-is-here/ "Fluent Bit for Amazon EKS on AWS Fargate is here"
[jaeger]: https://www.jaegertracing.io/ "Jaeger"
[kafka]: https://kafka.apache.org/ "Apache Kafka"
[kubecpl]: https://docs.aws.amazon.com/eks/latest/userguide/control-plane-logs.html "Amazon EKS control plane logging"
[lambda]: https://aws.amazon.com/lambda/ "AWS Lambda"
[lightsail]: https://aws.amazon.com/lightsail/ "Amazon Lightsail"
[otel]: https://opentelemetry.io/ "OpenTelemetry"
[otelinst]: https://opentelemetry.io/docs/concepts/instrumenting/
[promex]: https://prometheus.io/docs/instrumenting/exporters/ "Prometheus exporters and integrations"
[rdsmon]: https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Overview.LoggingAndMonitoring.html "Logging and monitoring in Amazon RDS"
[s3]: https://aws.amazon.com/s3/ "Amazon S3"
[s3mon]: https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-incident-response.html "Logging and monitoring in Amazon S3"
[sqstrace]: https://docs.aws.amazon.com/xray/latest/devguide/xray-services-sqs.html "Amazon SQS and AWS X-Ray"
[vpcfl]: https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html "VPC Flow Logs"
[xray]: https://aws.amazon.com/xray/ "AWS X-Ray"
[xraysdks]: https://docs.aws.amazon.com/xray/index.html
