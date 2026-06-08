# 레시피

여기에서는 다양한 사용 사례에 Observability(o11y)를 적용하는 데 도움이 되는 엄선된 가이드, 방법론 및 기타 리소스 링크를 찾을 수 있습니다. 여기에는 [Amazon Managed Service for Prometheus][amp] 및 [Amazon Managed Grafana][amg]와 같은 관리형 서비스뿐만 아니라 [OpenTelemetry][otel] 및 [Fluent Bit][fluentbit]과 같은 에이전트도 포함됩니다. 여기 콘텐츠는 AWS 도구에만 국한되지 않으며 많은 오픈소스 프로젝트가 참조됩니다.

개발자와 인프라 담당자 모두의 요구를 동등하게 다루고자 하므로, 많은 레시피가 "폭넓은 범위"를 다룹니다. 달성하고자 하는 바에 가장 적합한 솔루션을 탐색하고 찾으시기 바랍니다.

:::info
    여기의 콘텐츠는 Solutions Architect, Professional Services의 실제 고객 참여 및 다른 고객의 피드백에서 도출되었습니다. 여기에서 찾을 수 있는 모든 내용은 실제 고객이 자체 환경에서 구현한 것입니다.
:::

o11y 공간에 대한 사고 방식은 다음과 같습니다: 특정 솔루션에 도달하기 위해 결합할 수 있는 [여섯 가지 차원][dimensions]으로 분해합니다:

| 차원 | 예시 |
|---------------|--------------| 
| 목적지  | [Prometheus][amp] &middot; [Grafana][amg] &middot; [OpenSearch][aes] &middot; [CloudWatch][cw] &middot; [Jaeger][jaeger] |
| 에이전트        | [ADOT][adot] &middot; [Fluent Bit][fluentbit] &middot; CW agent &middot; X-Ray agent |
| 언어     | [Java][java] &middot; Python &middot; .NET &middot; [JavaScript][nodejs] &middot; Go &middot; Rust |
| 인프라 및 데이터베이스  |  [RDS][rds] &middot; [DynamoDB][dynamodb] &middot; [MSK][msk] |
| 컴퓨팅 단위 | [Batch][batch] &middot; [ECS][ecs] &middot; [EKS][eks] &middot; [AEB][beans] &middot; [Lambda][lambda] &middot; [AppRunner][apprunner] |
| 컴퓨팅 엔진 | [Fargate][fargate] &middot; [EC2][ec2] &middot; [Lightsail][lightsail] |

:::note
    "솔루션 요구사항 예시"
    Fargate 기반 EKS에서 Python 앱을 실행하고 있으며, 추가 소비를 위해 S3 버킷에 로그를 저장하는 로깅 솔루션이 필요합니다.
:::

이 요구사항에 맞는 스택은 다음과 같습니다:

1. *목적지*: 데이터 추가 소비를 위한 S3 버킷
1. *에이전트*: EKS에서 로그 데이터를 내보내기 위한 FluentBit
1. *언어*: Python
1. *인프라 및 DB*: 해당 없음
1. *컴퓨팅 단위*: Kubernetes (EKS)
1. *컴퓨팅 엔진*: EC2

모든 차원을 지정할 필요는 없으며 때로는 어디서 시작해야 할지 결정하기 어렵습니다. 다양한 경로를 시도하고 특정 레시피의 장단점을 비교해 보세요.

탐색을 간소화하기 위해 여섯 가지 차원을 다음 카테고리로 그룹화합니다:

- **컴퓨팅별**: 컴퓨팅 엔진 및 단위
- **인프라 및 데이터별**: 인프라 및 데이터베이스
- **언어별**: 프로그래밍 언어
- **목적지별**: 텔레메트리 및 분석
- **태스크**: 이상 탐지, 알림, 문제 해결 등

[차원에 대해 자세히 알아보기 …](dimensions.md)

## 사용 방법

상단 탐색 메뉴를 사용하여 특정 인덱스 페이지로 이동할 수 있으며, 대략적인 선택부터 시작합니다. 예를 들어, `컴퓨팅별` -> `EKS` ->
`Fargate` -> `로그`.

또는 `/` 또는 `s` 키를 눌러 사이트를 검색할 수 있습니다:

![o11y 공간](images/search.png)

:::info
   "라이선스"
  이 사이트에 게시된 모든 레시피는 [MIT-0][mit0] 라이선스를 통해 제공됩니다. 이는 일반적인 MIT 라이선스에서 저작자 표시 요구사항을 제거한 수정 버전입니다.
:::

## 기여 방법

계획하는 내용에 대해 [토론][discussion]을 시작하면 그때부터 함께 진행합니다.

## 더 알아보기

이 사이트의 레시피는 모범 사례 모음입니다. 또한 사용하는 오픈소스 프로젝트의 상태와 레시피의 관리형 서비스에 대해 더 알아볼 수 있는 여러 곳이 있습니다:

- [observability @ aws][o11yataws], AWS 직원이 자신의 프로젝트와 서비스에 대해 이야기하는 재생 목록.
- [AWS observability 워크숍](/recipes/workshops/), 구조화된 방식으로 오퍼링을 체험해 볼 수 있습니다.
- [AWS 모니터링 및 Observability][o11yhome] 홈페이지, 사례 연구 및 파트너 정보 제공.

[aes]: aes.md "Amazon Elasticsearch Service"
[adot]: https://aws-otel.github.io/ "AWS Distro for OpenTelemetry"
[amg]: amg.md "Amazon Managed Grafana"
[amp]: amp.md "Amazon Managed Service for Prometheus"
[batch]: https://aws.amazon.com/batch/ "AWS Batch"
[beans]: https://aws.amazon.com/elasticbeanstalk/ "AWS Elastic Beanstalk"
[cw]: cw.md "Amazon CloudWatch"
[dimensions]: dimensions.md
[dynamodb]: dynamodb.md "Amazon DynamoDB"
[ec2]: https://aws.amazon.com/ec2/ "Amazon EC2"
[ecs]: ecs.md "Amazon Elastic Container Service"
[eks]: eks.md "Amazon Elastic Kubernetes Service"
[fargate]: https://aws.amazon.com/fargate/ "AWS Fargate"
[fluentbit]: https://fluentbit.io/ "Fluent Bit"
[jaeger]: https://www.jaegertracing.io/ "Jaeger"
[kafka]: https://kafka.apache.org/ "Apache Kafka"
[apprunner]: apprunner.md "AWS App Runner"
[lambda]: lambda.md "AWS Lambda"
[lightsail]: https://aws.amazon.com/lightsail/ "Amazon Lightsail"
[otel]: https://opentelemetry.io/ "OpenTelemetry"
[java]: java.md
[nodejs]: nodejs.md
[rds]: rds.md "Amazon Relational Database Service"
[msk]: msk.md "Amazon Managed Streaming for Apache Kafka"
[mit0]: https://github.com/aws/mit-0 "MIT-0"
[discussion]: https://github.com/aws-observability/observability-best-practices/discussions "Discussions"
[o11yataws]: https://www.youtube.com/playlist?list=PLaiiCkpc1U7Wy7XwkpfgyOhIf_06IK3U_ "Observability @ AWS YouTube playlist"
[o11yhome]: https://aws.amazon.com/products/management-and-governance/use-cases/monitoring-and-observability/ "AWS Observability home"
