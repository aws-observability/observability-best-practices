# AWS App Runner

[AWS App Runner][apprunner-main]는 개발자가 사전 인프라 경험 없이도 컨테이너화된 웹 애플리케이션 및 API를 대규모로 신속하게 배포할 수 있게 해주는 완전 관리형 서비스입니다. 소스 코드 또는 컨테이너 이미지로 시작하면 App Runner가 웹 애플리케이션을 자동으로 빌드 및 배포하고, 암호화된 트래픽 로드 밸런싱을 수행하며, 트래픽 요구에 맞게 확장하고, 서비스가 프라이빗 Amazon VPC에서 실행되는 다른 AWS 서비스 및 애플리케이션과 쉽게 통신할 수 있도록 합니다. App Runner를 사용하면 서버나 확장에 대해 고민하는 대신 애플리케이션에 더 집중할 수 있습니다.




다음 레시피를 확인하세요:

## 일반
- [Container Day - Docker Con | 개발자가 대규모 프로덕션 웹 애플리케이션을 쉽게 구축하는 방법](https://www.youtube.com/watch?v=Iyp9Ugk9oRs)
- [AWS 블로그 | AWS App Runner 서비스를 위한 중앙 집중식 Observability](https://aws.amazon.com/blogs/containers/centralized-observability-for-aws-app-runner-services/)
- [AWS 블로그 | AWS App Runner VPC 네트워킹을 위한 Observability](https://aws.amazon.com/blogs/containers/observability-for-aws-app-runner-vpc-networking/)
- [AWS 블로그 | Amazon EventBridge로 AWS App Runner 애플리케이션 제어 및 모니터링](https://aws.amazon.com/blogs/containers/controlling-and-monitoring-aws-app-runner-applications-with-amazon-eventbridge/)


## 로그

- [CloudWatch Logs로 스트리밍되는 App Runner 로그 보기][apprunner-cwl]

## 메트릭

- [CloudWatch에 보고되는 App Runner 서비스 메트릭 보기][apprunner-cwm]


## 트레이스
- [AWS Distro for OpenTelemetry를 사용한 App Runner용 AWS X-Ray 트레이싱 시작하기](https://aws-otel.github.io/docs/getting-started/apprunner)
- [Containers from the Couch | AWS App Runner X-Ray 통합](https://youtu.be/cVr8N7enCMM)
- [AWS 블로그 | OpenTelemetry로 AWS X-Ray를 사용한 AWS App Runner 서비스 트레이싱](https://aws.amazon.com/blogs/containers/tracing-an-aws-app-runner-service-using-aws-x-ray-with-opentelemetry/)
- [AWS 블로그 | AWS Copilot CLI를 사용한 AWS App Runner 서비스의 AWS X-Ray 트레이싱 활성화](https://aws.amazon.com/blogs/containers/enabling-aws-x-ray-tracing-for-aws-app-runner-service-using-aws-copilot-cli/)

[apprunner-main]: https://aws.amazon.com/apprunner/
[aes-ws]: https://bookstore.aesworkshops.com/
[apprunner-cwl]: https://docs.aws.amazon.com/apprunner/latest/dg/monitor-cwl.html
[apprunner-cwm]: https://docs.aws.amazon.com/apprunner/latest/dg/monitor-cw.html
